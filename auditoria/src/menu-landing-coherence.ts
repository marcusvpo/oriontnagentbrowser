/**
 * Camada 4 da ADR-037 — Coerência pós-pouso (anti falso positivo de navegação curada).
 *
 * Uma cura de navegação (equivalência explícita da Camada 1, tela de segmento único da Camada 2 ou semântica fechada da
 * Camada 3) só prova que a cadeia EXISTE na árvore real e foi percorrida. Ela não prova que a tela alcançada é a tela
 * que o manual descreve. Antes de aceitar a cura, os alvos em negrito dos 1 a 2 passos SEGUINTES são procurados na tela
 * alcançada (inventário estrutural lido ao vivo, somente leitura, e a entrada do grafo de rotas do hash alcançado).
 *
 * Coerente = ao menos um alvo dos próximos passos existe na tela (texto idêntico, mesma chave de folha, sinônimo
 * contextual da rota ou frase inteira contida num rótulo curto), OU os próximos passos não têm alvo verificável.
 * Incoerente = nenhum alvo encontrado: a cura é descartada e o passo bloqueia `[ATT]` com a evidência.
 *
 * Este módulo é PURO (sem navegador, sem disco): a leitura ao vivo fica no executor.
 */
import type { CrawledRouteEntry } from './route-crawler.js';
import type { ScreenStructuralInventory } from './att-screen-advisor.js';
import { canonNormalize, leafKey } from './menu-canonical.js';
import type { RoutineStep } from './types.js';

/** Bases de cura de navegação que exigem a conferência de coerência pós-pouso. */
export const COHERENCE_CHECKED_BASES = new Set(['explicit_equivalence', 'single_segment_screen', 'closed_semantic', 'closed_semantic_agy']);

/**
 * Rótulos genéricos de ação: existem em quase toda tela e não provam nada sobre a tela alcançada (comparação pelo
 * rótulo inteiro normalizado).
 */
const GENERIC_ACTION_LABELS = new Set([
  'salvar', 'gravar', 'confirmar', 'concluir', 'cancelar', 'voltar', 'fechar', 'ok', 'sim', 'nao', 'excluir', 'inativar',
  'adicionar', 'novo', 'nova', 'incluir', 'editar', 'alterar', 'pesquisar', 'filtrar', 'buscar', 'consultar', 'listar',
  'limpar', 'imprimir', 'visualizar', 'enter', 'esc', 'tab', 'ctrl b', 'ctrl + b', 'f2', 'f3', 'avancar', 'proximo',
  'finalizar', 'selecionar', 'orion tn'
]);

/**
 * Botões que trocam a tela (abrem formulário, modal ou listagem filtrada). Os alvos dos passos POSTERIORES a eles
 * pertencem a outra tela e não podem ser exigidos na tela de pouso.
 */
const SCREEN_CHANGING_LABELS = new Set([
  'adicionar', 'novo', 'nova', 'incluir', 'editar', 'alterar', 'pesquisar', 'filtrar', 'buscar', 'consultar', 'listar',
  'visualizar', 'avancar', 'proximo', 'selecionar'
]);

const norm = (s: string) => canonNormalize(String(s ?? '').replace(/\*\*/g, ''));

export function isGenericActionLabel(label: string): boolean {
  const n = norm(label);
  if (!n) return true;
  if (!/[a-z0-9]/.test(n)) return true; // símbolos (`+`, `x`, `...`)
  return GENERIC_ACTION_LABELS.has(n);
}

/**
 * Alvos em negrito dos próximos `maxSteps` passos (do Orion TN), para a conferência de coerência:
 * - para no primeiro passo com caminho de menu (`>`): a tela muda de novo;
 * - descarta rótulos genéricos (Salvar, Adicionar...) e os segmentos da própria cadeia navegada;
 * - para DEPOIS de um passo que aciona um botão que troca a tela (Adicionar, Editar, Pesquisar...) ou abre aba;
 * - passo que só lista opções (sub-itens) não contribui (as opções dependem de registro selecionado).
 */
export function collectNextStepTargets(
  steps: Array<Pick<RoutineStep, 'stepNumber' | 'rawText' | 'targets' | 'mainTargetCount' | 'scope'>>,
  currentStepNumber: number,
  options: { maxSteps?: number; excludeLabels?: string[] } = {}
): string[] {
  const maxSteps = options.maxSteps ?? 2;
  const exclude = new Set((options.excludeLabels || []).map(norm));
  const out: string[] = [];
  const next = steps
    .filter(s => s.stepNumber > currentStepNumber && s.scope !== 'external_portal')
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .slice(0, maxSteps);
  for (const step of next) {
    const raw = String(step.rawText ?? '');
    const bolds = Array.from(raw.matchAll(/\*\*([^*]+)\*\*/g));
    const hasPath =
      bolds.some(b => b[1].includes('>')) ||
      bolds.some((b, i) => i > 0 && raw.slice((bolds[i - 1].index ?? 0) + bolds[i - 1][0].length, b.index ?? 0).includes('>'));
    if (hasPath) break;
    const main = step.targets.slice(0, step.mainTargetCount ?? step.targets.length);
    let changesScreen = /\b(aba|guia)\b/i.test(raw.normalize('NFD').replace(/[̀-ͯ]/g, ''));
    for (const t of main) {
      const n = norm(t);
      if (SCREEN_CHANGING_LABELS.has(n)) changesScreen = true;
      if (t.includes('>') || isGenericActionLabel(t) || exclude.has(n)) continue;
      if (!out.some(o => norm(o) === n)) out.push(t);
    }
    if (changesScreen) break;
  }
  return out;
}

export type LandingCoherenceVerdict = 'coherent' | 'incoherent' | 'no_targets' | 'inconclusive';

export interface LandingCoherenceMatch {
  target: string;
  actual: string;
  via: 'exact' | 'leaf_key' | 'route_synonym' | 'phrase';
  source: 'inventory' | 'route_graph';
}

export interface LandingCoherenceResult {
  coherent: boolean;
  verdict: LandingCoherenceVerdict;
  matched: LandingCoherenceMatch[];
  missing: string[];
  /** Rótulos reais lidos (amostra) para a evidência do bloqueio */
  screenLabels: string[];
  reason: string;
}

const sameKey = (a: string[], b: string[]) => a.length > 0 && a.length === b.length && a.every((w, i) => w === b[i]);

/** Frase inteira do alvo dentro de um rótulo curto (mesma régua da Trava de Evidência; nunca substring intra-palavra). */
const phraseInside = (target: string, label: string) => {
  const t = norm(target);
  const l = norm(label);
  return t.length >= 3 && ` ${l} `.includes(` ${t} `) && l.length <= t.length * 3 + 24;
};

/**
 * Avalia se a tela alcançada por uma cura de navegação contém algum alvo dos próximos passos.
 * `routeSynonyms(target)` devolve os rótulos reais aceitos para o alvo nesta rota (ADR-029, Camada 0.2).
 */
export function evaluateLandingCoherence(
  nextStepTargets: string[],
  inventory: ScreenStructuralInventory | null | undefined,
  routeGraphEntry?: Pick<CrawledRouteEntry, 'title' | 'tabs' | 'sections' | 'fields' | 'buttons'> | null,
  options: { routeSynonyms?: (target: string) => string[][] } = {}
): LandingCoherenceResult {
  const targets = nextStepTargets.filter(t => !isGenericActionLabel(t));
  const labels: Array<{ label: string; source: LandingCoherenceMatch['source'] }> = [];
  const add = (label: string | undefined, source: LandingCoherenceMatch['source']) => {
    const l = String(label ?? '').trim();
    if (l && !labels.some(x => x.label === l && x.source === source)) labels.push({ label: l, source });
  };
  if (inventory) {
    add(inventory.title, 'inventory');
    inventory.sections.forEach(s => add(s, 'inventory'));
    inventory.tabs.forEach(t => add(t.label, 'inventory'));
    inventory.fields.forEach(f => add(f.label, 'inventory'));
    inventory.buttons.forEach(b => add(b.label, 'inventory'));
  }
  if (routeGraphEntry) {
    add(routeGraphEntry.title, 'route_graph');
    (routeGraphEntry.tabs || []).forEach(t => add(t, 'route_graph'));
    (routeGraphEntry.sections || []).forEach(s => add(s, 'route_graph'));
    (routeGraphEntry.fields || []).forEach(f => add(f, 'route_graph'));
    (routeGraphEntry.buttons || []).forEach(b => add(b, 'route_graph'));
  }
  const screenLabels = Array.from(new Set(labels.map(l => l.label))).slice(0, 25);

  if (targets.length === 0) {
    return { coherent: true, verdict: 'no_targets', matched: [], missing: [], screenLabels, reason: 'os próximos passos não citam alvo verificável na tela de pouso' };
  }
  if (labels.length === 0) {
    return {
      coherent: true,
      verdict: 'inconclusive',
      matched: [],
      missing: [],
      screenLabels,
      reason: 'o inventário da tela alcançada não pôde ser lido e não há entrada do grafo de rotas: coerência não avaliada'
    };
  }

  const matched: LandingCoherenceMatch[] = [];
  const missing: string[] = [];
  for (const target of targets) {
    const tn = norm(target);
    const tk = leafKey(target);
    let hit: LandingCoherenceMatch | null = null;
    for (const { label, source } of labels) {
      if (norm(label) === tn) {
        hit = { target, actual: label, via: 'exact', source };
        break;
      }
    }
    if (!hit && tk.length > 0) {
      const l = labels.find(x => sameKey(tk, leafKey(x.label)));
      if (l) hit = { target, actual: l.label, via: 'leaf_key', source: l.source };
    }
    if (!hit && options.routeSynonyms) {
      for (const real of options.routeSynonyms(target)) {
        if (real.length > 0 && real.every(r => labels.some(x => norm(x.label) === norm(r)))) {
          hit = { target, actual: real.join(' + '), via: 'route_synonym', source: 'inventory' };
          break;
        }
      }
    }
    if (!hit) {
      const l = labels.find(x => phraseInside(target, x.label));
      if (l) hit = { target, actual: l.label, via: 'phrase', source: l.source };
    }
    if (hit) matched.push(hit);
    else missing.push(target);
  }

  if (matched.length > 0) {
    return {
      coherent: true,
      verdict: 'coherent',
      matched,
      missing,
      screenLabels,
      reason: `a tela alcançada contém ${matched.map(m => `"${m.target}"${m.actual !== m.target ? ` (= "${m.actual}", ${m.via})` : ''}`).join(', ')}`
    };
  }
  return {
    coherent: false,
    verdict: 'incoherent',
    matched,
    missing,
    screenLabels,
    reason: `a tela alcançada não contém ${missing.map(m => `"${m}"`).join(', ')}, citados nos passos seguintes`
  };
}

/** Frase de evidência do bloqueio `[ATT]` por cura de navegação incoerente. */
export function describeIncoherentLanding(input: {
  basisLabel: string;
  documented: string;
  realChain: string[];
  hash?: string;
  result: LandingCoherenceResult;
}): string {
  const where = input.hash ? ` (${input.hash})` : '';
  const seen =
    input.result.screenLabels.length > 0
      ? ` Elementos lidos na tela alcançada: ${input.result.screenLabels.slice(0, 15).map(l => `"${l}"`).join(', ')}.`
      : '';
  return (
    `A tela alcançada por ${input.basisLabel} ("${input.documented}" -> "${input.realChain.join(' > ')}"${where}) não contém ` +
    `${input.result.missing.map(m => `"${m}"`).join(', ')}, citado(s) nos passos seguintes: a equivalência foi descartada e a ` +
    `tela restaurada (Camada 4, coerência pós-pouso).${seen}`
  );
}
