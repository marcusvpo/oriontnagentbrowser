import type { AgentBrowserClient } from './browser.js';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';
import type { BoundingBox, DOMResolvedGeometry, ParsedRoutine, RevealTriggerKind, SmartLocatorDivergence } from './types.js';

/**
 * Regra da Evidência Estrita — Trava Anti-Alucinação (ADR-017).
 *
 * O texto de um manual só pode ser alterado quando há evidência concreta no DOM: um elemento real,
 * localizado, medido ao vivo e demarcado na print, cujo texto contém o que entra no manual. Tudo o
 * que não tiver essa prova é revertido para o texto original. Este módulo é a única porta por onde
 * um texto alterado chega ao `-revisado.md`, para os dois geradores de relatório.
 */

/** Confiança mínima para uma cura virar alteração de texto. */
export const MIN_EVIDENCE_CONFIDENCE = 0.68;
/** Fração do viewport acima da qual um nó casado por texto é contêiner genérico, não um alvo. */
export const GENERIC_CONTAINER_AREA_RATIO = 0.45;

const area = (b: BoundingBox) => Math.max(0, b.width) * Math.max(0, b.height);

/**
 * Um alvo casado por TEXTO que ocupa quase a tela inteira não é o elemento descrito no passo: é um
 * contêiner que apenas contém a palavra. Não serve de evidência nem de demarcação.
 */
export function isGenericContainerMatch(geometry: DOMResolvedGeometry): boolean {
  if (geometry.groupMembers && geometry.groupMembers.length > 0) return false;
  if (!geometry.matchedSelector.startsWith('text:')) return false;
  const vp = geometry.viewport;
  return area(geometry.cssBox) > vp.width * vp.height * GENERIC_CONTAINER_AREA_RATIO;
}

/** O texto real do nó medido comprova o nome que entra no manual? */
function elementTextProves(actual: string, elementText: string): boolean {
  const a = normalizeText(actual);
  const e = normalizeText(elementText);
  if (!a || !e) return false;
  if (a === e) return true;
  if (` ${e} `.includes(` ${a} `) && e.length <= a.length * 3 + 24) return true;
  return computeDiceSimilarity(a, e) >= 0.8;
}

/** Motivo pelo qual uma divergência NÃO autoriza alteração de texto; `null` se a evidência é válida. */
export function evidenceRejection(d: SmartLocatorDivergence): string | null {
  if (d.resolutionLayer === 'target_not_found' || d.resolutionLayer === 'permission_blocked') {
    return 'o elemento não foi localizado na tela';
  }
  if (!d.actualElementText.trim()) return 'não há texto real do elemento';
  if (!d.textChange) return 'não há substituição pontual declarada';
  if (!d.evidence) return 'não há elemento medido que comprove a alteração';
  if (d.confidence < MIN_EVIDENCE_CONFIDENCE) return `confiança ${d.confidence} abaixo do mínimo`;
  if (d.evidence.box.width <= 0 || d.evidence.box.height <= 0) return 'o elemento medido não tem área';
  const proof = d.evidence.elementText;

  // Sub-passo descoberto (ADR-018): o alvo do manual mantém o nome e ganha a menção ao gatilho que o
  // revela. Exige as duas provas: o alvo medido após o gatilho e o gatilho medido antes do clique.
  if (d.resolutionLayer === 'investigative_reveal') {
    const trigger = d.reveal;
    if (!trigger) return 'não há gatilho revelador registrado';
    if (!trigger.label.trim()) return 'o gatilho revelador não tem texto real';
    if (trigger.evidence.box.width <= 0 || trigger.evidence.box.height <= 0) return 'o gatilho revelador medido não tem área';
    if (!elementTextProves(trigger.label, trigger.evidence.elementText)) {
      return `o texto do gatilho medido ("${trigger.evidence.elementText.slice(0, 60)}") não comprova "${trigger.label}"`;
    }
    if (!elementTextProves(d.documentedTarget, proof)) {
      return `o texto do elemento revelado ("${proof.slice(0, 60)}") não comprova "${d.documentedTarget}"`;
    }
    const bold = `**${d.documentedTarget}**`;
    if (d.textChange.from !== bold || !d.textChange.to.startsWith(bold) || !d.textChange.to.includes(`**${trigger.label}**`)) {
      return 'a substituição do sub-passo não preserva o alvo do manual nem cita o gatilho medido';
    }
    return null;
  }

  // Rota de menu: cada segmento do caminho real foi lido da árvore de navegação
  if (!elementTextProves(d.actualElementText, proof)) {
    return `o texto do elemento medido ("${proof.slice(0, 60)}") não comprova "${d.actualElementText}"`;
  }
  return null;
}

/**
 * Texto do sub-passo descoberto pela Exploração Investigativa (ADR-018). É o único molde de redação
 * do pipeline: o alvo do manual é mantido e os dois nomes vêm de nós medidos ao vivo.
 */
export function revealTextChange(target: string, kind: RevealTriggerKind, triggerLabel: string): { from: string; to: string } {
  const how: Record<RevealTriggerKind, string> = {
    tab: 'exibido ao abrir a aba',
    accordion: 'exibido ao expandir',
    button: 'exibido após clicar em',
    checkbox: 'exibido após marcar',
    radio: 'exibido após selecionar',
    subportal_link: 'exibido na nova guia aberta pelo link'
  };
  return { from: `**${target}**`, to: `**${target}** (${how[kind]} **${triggerLabel}**)` };
}

export interface LockedStepText {
  text: string;
  /** Substituições aplicadas, cada uma com evidência válida */
  applied: SmartLocatorDivergence[];
  /** Alterações descartadas pela trava, com o motivo */
  rejected: Array<{ divergence?: SmartLocatorDivergence; reason: string }>;
}

/**
 * Reconstrói o texto de um passo a partir do ORIGINAL, aplicando somente as substituições pontuais
 * que têm evidência válida. O texto proposto pelo executor nunca é copiado: se ele diferir do que a
 * evidência autoriza, a diferença é registrada e descartada.
 */
export function lockStepText(
  originalText: string,
  proposedText: string | undefined,
  divergences: SmartLocatorDivergence[]
): LockedStepText {
  let text = originalText;
  const applied: SmartLocatorDivergence[] = [];
  const rejected: LockedStepText['rejected'] = [];

  for (const d of divergences) {
    const why = evidenceRejection(d);
    if (why) {
      if (d.textChange) rejected.push({ divergence: d, reason: why });
      continue;
    }
    const change = d.textChange!;
    if (!text.includes(change.from)) {
      rejected.push({ divergence: d, reason: `o trecho "${change.from}" não existe no texto original do passo` });
      continue;
    }
    text = text.replace(change.from, () => change.to);
    applied.push(d);
  }

  if (proposedText !== undefined && proposedText !== text) {
    rejected.push({ reason: 'o texto proposto contém alterações sem evidência no DOM e foi descartado' });
  }
  return { text, applied, rejected };
}

/** Todos os elementos em negrito de uma rotina; um caminho `A > B > C` conta como três elementos. */
export function listRoutineBoldTargets(parsed: ParsedRoutine): string[] {
  const out: string[] = [];
  for (const step of parsed.steps) {
    for (const target of step.targets) {
      for (const part of target.split('>').map(p => p.trim()).filter(Boolean)) {
        if (!out.some(o => normalizeText(o) === normalizeText(part))) out.push(part);
      }
    }
  }
  return out;
}

/**
 * Prova de presença (ADR-017): quais dos alvos informados existem, neste instante, na tela real —
 * como texto de um elemento visível (ou valor/placeholder/título de um controle) ou como item da
 * árvore de navegação. Um texto só comprova o alvo se o elemento for sobre ele, não um contêiner
 * que apenas o contém. Devolve os alvos encontrados, como foram informados.
 */
export async function probeTargetsPresence(client: AgentBrowserClient, targets: string[]): Promise<string[]> {
  const wanted = targets.map(t => ({ raw: t, norm: normalizeText(t) })).filter(t => t.norm.length >= 2);
  if (wanted.length === 0) return [];
  const found = await client.evalJson<string[]>(`
    (() => {
      const wanted = ${JSON.stringify(wanted)};
      const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w\\s+]/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      const vis = e => {
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const texts = new Set();
      const add = t => { const n = norm(t); if (n && n.length <= 160) texts.add(n); };
      for (const e of document.querySelectorAll('a, button, label, span, th, td, h1, h2, h3, h4, h5, legend, li, p, strong, b, input, select, textarea')) {
        if (!vis(e)) continue;
        add(e.innerText || e.textContent);
        add(e.getAttribute('value')); add(e.getAttribute('placeholder')); add(e.getAttribute('title'));
      }
      for (const e of document.querySelectorAll('.navbar a, nav a, option')) add(e.textContent);
      const all = Array.from(texts);
      const proves = (w, t) => t === w || ((' ' + t + ' ').includes(' ' + w + ' ') && t.length <= w.length * 3 + 24);
      return JSON.stringify(wanted.filter(w => all.some(t => proves(w.norm, t))).map(w => w.raw));
    })()
  `);
  return found || [];
}
