/**
 * Resolução de Alvos Implícitos (ADR-021 §4): passo sem nenhum `**negrito**` mas que manda localizar,
 * pesquisar, filtrar ou informar algo por um campo ("localize a cidade pelo campo de pesquisa de
 * município ou estado") não é descritivo passivo. Os substantivos de controle do texto são casados com
 * os rótulos/placeholders REAIS dos campos visíveis na zona de conteúdo; só o que casa é demarcado.
 *
 * Evidência Estrita (ADR-017): o texto do manual nunca é reescrito por um alvo implícito, e nenhuma
 * ação é executada — o passo apenas ganha a demarcação do campo que o humano usaria.
 */
import type { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { computeDiceSimilarity, hasNavigationIntent, normalizeText } from './smart-locator.js';
import type { RoutineStep } from './types.js';

/** Verbos de ação/pesquisa que tornam o passo operável (sem acento). */
const ACTION_VERB = /\b(localize|localizar|pesquise|pesquisar|informe|informar|filtre|filtrar|selecione|escolha|preencha|busque|buscar|digite)\b/;

/**
 * Substantivo de controle -> nomes que a tela real pode usar (sinônimos Siplan). O primeiro de cada
 * lista é o nome canônico. `generic` não identifica um campo sozinho ("campo", "pesquisa", "filtro").
 */
const CONTROL_NOUNS: Array<{ nouns: string[]; labels: string[]; context?: RegExp }> = [
  { nouns: ['municipio', 'municipios', 'cidade', 'cidades'], labels: ['cidade', 'municipio'] },
  { nouns: ['estado', 'estados', 'uf'], labels: ['uf', 'estado'] },
  // Intervalo temporal: "inicial"/"final" só identificam campo junto de período/data/intervalo.
  // Vêm antes de `data` para que "data inicial" não seja consumida pelo grupo genérico.
  { nouns: ['inicial', 'inicio'], labels: ['data inicial', 'periodo inicial', 'inicio'], context: /\b(periodo|periodos|data|datas|intervalo)\b/ },
  { nouns: ['final', 'fim'], labels: ['data final', 'periodo final', 'fim'], context: /\b(periodo|periodos|data|datas|intervalo)\b/ },
  { nouns: ['data', 'datas'], labels: ['data'] },
  // Identificador único: CPF e documento são tratados como campos distintos (a tela pode ter só um deles)
  { nouns: ['cpf'], labels: ['cpf'] },
  { nouns: ['documento', 'documentos'], labels: ['documento', 'cpf'] },
  { nouns: ['descricao', 'descricoes'], labels: ['descricao'] }
];
const GENERIC_NOUNS = /\b(campos?|pesquisa|pesquisas|filtros?)\b/;

export interface ImplicitTermGroup {
  /** Substantivo encontrado no passo */
  noun: string;
  /** Nomes aceitos para o rótulo na tela */
  labels: string[];
}

/** Texto do passo -> grupos de termos de controle (vazio se o passo não é operável). */
export function inferImplicitTerms(rawText: string): ImplicitTermGroup[] {
  const norm = normalizeText(rawText);
  if (!ACTION_VERB.test(norm)) return [];
  if (hasNavigationIntent(rawText)) return [];
  const groups: ImplicitTermGroup[] = [];
  for (const entry of CONTROL_NOUNS) {
    if (entry.context && !entry.context.test(norm)) continue;
    const noun = entry.nouns.find(n => new RegExp(`\\b${n}\\b`).test(norm));
    if (!noun) continue;
    // "data" solta é redundante quando o intervalo (inicial/final) já foi resolvido
    if (entry.labels[0] === 'data' && groups.some(g => g.labels[0] === 'data inicial' || g.labels[0] === 'data final')) continue;
    // "cidade" e "município" são o mesmo campo: um grupo só
    if (groups.some(g => g.labels[0] === entry.labels[0])) continue;
    groups.push({ noun, labels: entry.labels });
  }
  // Só substantivo genérico ("campo de pesquisa") não basta: não se adivinha o campo
  if (groups.length === 0 && GENERIC_NOUNS.test(norm)) return [];
  return groups;
}

export interface FormLabel {
  /** Nome exibido, sem marca de obrigatório nem dois-pontos */
  name: string;
  kind: 'label' | 'placeholder';
}

/** Rótulos e placeholders de campos de formulário visíveis na zona de conteúdo (nunca cabeçalhos de grade). */
export async function collectFormLabels(client: AgentBrowserClient): Promise<FormLabel[]> {
  const found = await client.evalJson<FormLabel[]>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const modals = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"]')).filter(vis);
      const root = modals.length > 0 ? modals[modals.length - 1] : document;
      const out = [];
      const seen = new Set();
      const add = (raw, kind) => {
        const name = clean(raw).replace(/[\\s*:]+$/, '');
        if (name.length < 2 || name.length > 60 || seen.has(name.toLowerCase())) return;
        seen.add(name.toLowerCase());
        out.push({ name, kind });
      };
      const nodes = root.querySelectorAll('label, legend, input[placeholder], textarea[placeholder], .ng-placeholder, select[aria-label], input[aria-label]');
      for (const el of nodes) {
        if (!vis(el) || el.closest(NAV) || el.closest('table, thead, [role="grid"]')) continue;
        if (el.tagName === 'LABEL' || el.tagName === 'LEGEND') add(el.innerText || el.textContent, 'label');
        else if (el.classList.contains('ng-placeholder')) add(el.innerText || el.textContent, 'placeholder');
        else add(el.getAttribute('placeholder') || el.getAttribute('aria-label'), 'placeholder');
      }
      return JSON.stringify(out.slice(0, 80));
    })()
  `);
  return found || [];
}

const DICE_FLOOR = 0.85;

/** Casa os grupos de termos contra os rótulos reais e devolve os nomes da tela, na ordem do DOM. */
export function matchImplicitLabels(groups: ImplicitTermGroup[], labels: FormLabel[]): string[] {
  const picked = new Set<number>();
  for (const group of groups) {
    for (const wanted of group.labels) {
      const idx = labels.findIndex((l, i) => {
        if (picked.has(i)) return false;
        const n = normalizeText(l.name);
        if (n === wanted) return true;
        if (new RegExp(`\\b${wanted}\\b`).test(n) && n.split(' ').length <= 4) return true;
        return computeDiceSimilarity(n, wanted) >= DICE_FLOOR;
      });
      if (idx >= 0) {
        picked.add(idx);
        break; // um rótulo por grupo: o primeiro nome aceito que existir na tela
      }
    }
  }
  return Array.from(picked)
    .sort((a, b) => a - b)
    .map(i => labels[i].name);
}

export interface ImplicitTargetResult {
  /** Nomes reais dos campos da tela a demarcar */
  targets: string[];
  /** Substantivos do passo que geraram a busca */
  nouns: string[];
}

/**
 * Detecta os alvos implícitos de um passo sem negrito. Devolve `null` quando o passo não é operável,
 * quando já tem alvos em negrito ou quando nenhum rótulo real da tela casa (então a print segue limpa).
 */
export async function detectImplicitTargets(client: AgentBrowserClient, step: RoutineStep): Promise<ImplicitTargetResult | null> {
  if (step.targets.length > 0) return null;
  const groups = inferImplicitTerms(step.rawText);
  if (groups.length === 0) return null;
  const labels = await collectFormLabels(client);
  const targets = matchImplicitLabels(groups, labels);
  if (targets.length === 0) return null;
  return { targets, nouns: groups.map(g => g.noun) };
}
