import type { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';
import { findRouteEntriesByTabOrSection } from './route-crawler.js';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';

/**
 * Consultor Propositivo de Tela para bloqueios `[ATT]` (ADR-028).
 *
 * Quando um passo esgota todas as camadas de localização (RAG de revisões humanas, SmartLocator,
 * Exploração Investigativa e Máquina de Estado) e a rotina vai encerrar como `[ATT]`, a tela alcançada ainda
 * está aberta. Em vez de só declarar "elemento inexistente", este módulo lê o **Inventário Estruturado** dessa
 * tela (rota, seções, abas, campos, botões) e propõe, com evidência medida no DOM, quais elementos reais têm
 * afinidade funcional com o alvo que falhou — subsídio para o revisor humano reescrever o passo.
 *
 * Regras (Evidência Estrita, ADR-017): tudo aqui é CONSULTIVO. Nada é clicado, nenhum texto do manual é
 * reescrito e a sugestão nunca vira demarcação. O inventário é só leitura.
 */

export interface ScreenField {
  label: string;
  type: string;
  section?: string;
  required?: boolean;
}

export interface ScreenButton {
  label: string;
  section?: string;
  primary: boolean;
  disabled?: boolean;
}

export interface ScreenTab {
  label: string;
  active: boolean;
}

/** Inventário Estruturado da Tela Atual (leitura ao vivo do DOM, zona de conteúdo ou modal ativo). */
export interface ScreenStructuralInventory {
  /** `location.hash` da tela (sem origem: o host do ambiente nunca é gravado) */
  route: string;
  /** Título principal do painel/modal aberto */
  title: string;
  /** O inventário foi lido dentro de um modal ativo */
  inModal: boolean;
  sections: string[];
  tabs: ScreenTab[];
  fields: ScreenField[];
  buttons: ScreenButton[];
}

export type ScreenElementKind = 'field' | 'button' | 'section' | 'tab';

/** Correspondência sugerida entre um alvo do manual que falhou e um elemento real da tela. */
export interface ScreenMatchSuggestion {
  target: string;
  kind: ScreenElementKind;
  actual: string;
  section?: string;
  similarity: number;
  reason: string;
}

export interface CrossRouteHint {
  target: string;
  route: string;
  menuPath: string;
  matchedIn: 'tab' | 'section' | 'title';
  matchedLabel: string;
}

export interface AttScreenDiagnosis {
  stepNumber: number;
  capturedAt: string;
  inventory: ScreenStructuralInventory;
  /** Alvos do passo que a auditoria não conseguiu comprovar */
  targets: string[];
  suggestions: ScreenMatchSuggestion[];
  /** Alvos sem nenhum elemento real de afinidade suficiente */
  unmatched: string[];
  /** Pistas consultivas em outras rotas do grafo vivo (`orion-route-graph.json`, ADR-030) */
  crossRouteHints?: CrossRouteHint[];
  /** Print de referência da tela (a do passo bloqueado ou `passo-NN-contexto-att.png`) */
  contextPrint?: string;
  /** Instrução de reescrita do passo, derivada das sugestões */
  rewriteHint?: string;
  /** O passo cita caminho de menu: a evidência da árvore de navegação já está no bloqueio */
  menuPath?: boolean;
}

const MAX_SECTIONS = 30;
const MAX_TABS = 20;
const MAX_FIELDS = 80;
const MAX_BUTTONS = 40;
/** Afinidade mínima para uma sugestão ser apresentada ao revisor */
export const SUGGESTION_MIN_SCORE = 0.45;
const MAX_SUGGESTIONS_PER_TARGET = 3;

/** Navegação lateral/superior (as abas de conteúdo `.nav-tabs` ficam de fora desta lista: são lidas como abas). */
const SIDE_NAV_SELECTOR = NAV_ZONE_SELECTOR.split(',')
  .map(s => s.trim())
  .filter(s => s !== '.nav-tabs' && s !== '[role="tablist"]')
  .join(', ');

/**
 * Script injetável (via `eval --stdin`) que lê o inventário da tela atual. Escopo: o modal ativo, se existir;
 * senão a página, sempre sem a navegação lateral/superior. Somente leitura.
 */
export function buildScreenInventoryScript(): string {
  return `
    (() => {
      const SIDE_NAV = ${JSON.stringify(SIDE_NAV_SELECTOR)};
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const LIM = ${JSON.stringify({ sections: MAX_SECTIONS, tabs: MAX_TABS, fields: MAX_FIELDS, buttons: MAX_BUTTONS })};
      const clean = t => String(t || '').replace(/\\s+/g, ' ').trim();
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const modals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      const modal = modals.length > 0 ? modals[modals.length - 1] : null;
      const root = modal || document.body;
      const inSideNav = e => !!e.closest(SIDE_NAV);
      const HEAD_SEL = 'legend, .panel-heading, .card-header, .box-title, h1, h2, h3, h4, h5, .modal-title, .page-header';
      const sectionOf = el => {
        const box = el.closest('fieldset, .panel, .card, .box, .modal-content, .tab-pane, form');
        if (!box) return '';
        const h = Array.from(box.querySelectorAll(HEAD_SEL)).find(x => vis(x) && clean(x.textContent).length > 0);
        return h ? clean(h.textContent).slice(0, 80) : '';
      };
      const dedupe = (arr, keyFn) => {
        const seen = new Set();
        return arr.filter(x => {
          const k = keyFn(x);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      };

      // Seções
      const sections = dedupe(
        Array.from(root.querySelectorAll(HEAD_SEL))
          .filter(e => vis(e) && !inSideNav(e))
          .map(e => clean(e.textContent).slice(0, 80))
          .filter(t => t.length > 1),
        t => t.toLowerCase()
      ).slice(0, LIM.sections);

      // Abas de conteúdo (as abas do contêiner principal; a lateral é navegação)
      const tabs = dedupe(
        Array.from(root.querySelectorAll('.nav-tabs a, .nav-tabs button, [role="tab"]'))
          .filter(e => vis(e) && !inSideNav(e))
          .map(e => ({
            label: clean(e.textContent).slice(0, 80),
            active: /(^|\\s)active(\\s|$)/.test(e.className || '') || /(^|\\s)active(\\s|$)/.test((e.parentElement && e.parentElement.className) || '') || e.getAttribute('aria-selected') === 'true'
          }))
          .filter(t => t.label.length > 0),
        t => t.label.toLowerCase()
      ).slice(0, LIM.tabs);

      // Rótulo real de um campo
      const labelOf = el => {
        const byFor = el.id ? root.querySelector('label[for="' + el.id.replace(/"/g, '') + '"]') : null;
        if (byFor && clean(byFor.textContent)) return clean(byFor.textContent);
        const wrap = el.closest('label');
        if (wrap && clean(wrap.textContent)) return clean(wrap.textContent);
        const aria = clean(el.getAttribute('aria-label'));
        if (aria) return aria;
        const group = el.closest('.form-group, .field, [class*="col-"]');
        if (group) {
          const l = group.querySelector('label, .control-label');
          if (l && clean(l.textContent)) return clean(l.textContent);
        }
        if ((el.type === 'checkbox' || el.type === 'radio') && el.parentElement && clean(el.parentElement.textContent)) {
          return clean(el.parentElement.textContent);
        }
        const ph = clean(el.getAttribute('placeholder'));
        if (ph) return ph;
        return clean(el.getAttribute('name')) || clean(el.id);
      };

      const fieldEls = Array.from(root.querySelectorAll('input, select, textarea')).filter(e => {
        const t = (e.type || '').toLowerCase();
        if (['hidden', 'button', 'submit', 'image', 'reset'].includes(t)) return false;
        if (inSideNav(e)) return false;
        if (vis(e)) return true;
        return (t === 'checkbox' || t === 'radio') && vis(e.closest('label, span, div'));
      });
      const fields = dedupe(
        fieldEls
          .map(e => ({
            label: labelOf(e).slice(0, 90),
            type: e.tagName === 'SELECT' ? 'select' : e.tagName === 'TEXTAREA' ? 'textarea' : ((e.type || 'text').toLowerCase()),
            section: sectionOf(e),
            required: !!e.required || /(^|\\s)required(\\s|$)/.test(e.className || '')
          }))
          .filter(f => f.label.length > 0),
        f => f.label.toLowerCase() + '|' + f.section.toLowerCase()
      ).slice(0, LIM.fields);

      // Botões de ação
      const btnEls = Array.from(root.querySelectorAll('button, a.btn, input[type="submit"], input[type="button"], [role="button"], .btn')).filter(
        e => vis(e) && !inSideNav(e)
      );
      const buttons = dedupe(
        btnEls
          .map(e => {
            const own = clean(e.value && e.tagName === 'INPUT' ? e.value : e.textContent);
            const label = (own.length > 1 ? own : clean(e.getAttribute('title')) || clean(e.getAttribute('data-original-title')) || clean(e.getAttribute('aria-label')) || own).slice(0, 80);
            return {
              label,
              section: sectionOf(e),
              primary: /(^|\\s)btn-(primary|success|danger|warning|info)(\\s|$)/.test(e.className || ''),
              disabled: !!e.disabled || /(^|\\s)disabled(\\s|$)/.test(e.className || '')
            };
          })
          .filter(b => /[A-Za-z0-9+]/.test(b.label) && b.label.length > 0),
        b => b.label.toLowerCase() + '|' + b.section.toLowerCase()
      ).slice(0, LIM.buttons);

      const titleEl = (modal || document).querySelector('.modal-title, .page-header, h1, h2, h3');
      return JSON.stringify({
        route: location.hash || '',
        title: clean(titleEl && vis(titleEl) ? titleEl.textContent : '') || clean(document.title),
        inModal: !!modal,
        sections: sections,
        tabs: tabs,
        fields: fields,
        buttons: buttons
      });
    })()
  `;
}

/** Normaliza a resposta bruta do script (campos vazios viram `undefined`). */
export function parseScreenInventory(raw: unknown): ScreenStructuralInventory | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, any>;
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    route: str(r.route),
    title: str(r.title),
    inModal: !!r.inModal,
    sections: arr(r.sections).map(str).filter(Boolean),
    tabs: arr(r.tabs)
      .map((t: any) => ({ label: str(t?.label), active: !!t?.active }))
      .filter((t: ScreenTab) => t.label),
    fields: arr(r.fields)
      .map((f: any) => ({ label: str(f?.label), type: str(f?.type) || 'text', section: str(f?.section) || undefined, required: !!f?.required }))
      .filter((f: ScreenField) => f.label),
    buttons: arr(r.buttons)
      .map((b: any) => ({ label: str(b?.label), section: str(b?.section) || undefined, primary: !!b?.primary, disabled: !!b?.disabled }))
      .filter((b: ScreenButton) => b.label)
  };
}

const STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'para', 'por', 'com', 'sem', 'em', 'na', 'no', 'nas', 'nos', 'ao', 'aos', 'as', 'os', 'um', 'uma', 'ou', 'que', 'campo', 'botao', 'aba', 'tela']);

/** Tokens comparáveis: sem acento, sem stopwords, com plural simples removido. Só igualdade de token (nunca substring). */
export function screenTokens(text: string): string[] {
  return normalizeText(text)
    .split(/[\s+]+/)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t))
    .map(t => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t));
}

type StepCue = 'field' | 'button' | 'tab' | 'section' | 'none';

/** Pista do verbo do passo sobre o tipo do alvo (campo, botão, aba, seção). */
export function inferStepCue(stepText: string): StepCue {
  const t = normalizeText(stepText);
  if (/\b(aba|guia)\b/.test(t)) return 'tab';
  if (/\b(secao|painel|bloco|grupo)\b/.test(t)) return 'section';
  if (/\b(preencha|informe|digite|defina|selecione|escolha|marque|desmarque|campo)\b/.test(t)) return 'field';
  if (/\b(clique|pressione|acione|botao|use o botao)\b/.test(t)) return 'button';
  return 'none';
}

function textAffinity(target: string, candidate: string): { score: number; shared: string[] } {
  const tt = screenTokens(target);
  const ct = screenTokens(candidate);
  const shared = tt.filter(t => ct.includes(t));
  const overlap = tt.length > 0 ? shared.length / Math.max(tt.length, ct.length >= tt.length ? tt.length : ct.length) : 0;
  const dice = computeDiceSimilarity(target, candidate);
  // O Dice sozinho só vale com similaridade alta: sem token em comum, "Autenticidade" nunca vira "Cidade"
  const diceUsable = shared.length > 0 || dice >= 0.75 ? dice : 0;
  const exact = normalizeText(target) === normalizeText(candidate) ? 1 : 0;
  return { score: Math.max(exact, overlap * 0.92, diceUsable), shared };
}

/**
 * Para cada alvo que falhou, ranqueia os elementos reais da tela por afinidade funcional (tokens em comum,
 * Dice com guarda anti-substring, pista do verbo do passo e seção citada no próprio passo).
 */
export function suggestScreenMatches(
  targets: string[],
  inventory: ScreenStructuralInventory,
  stepText = ''
): { suggestions: ScreenMatchSuggestion[]; unmatched: string[] } {
  const cue = inferStepCue(stepText);
  const stepNorm = normalizeText(stepText);
  const pool: Array<{ kind: ScreenElementKind; label: string; section?: string }> = [
    ...inventory.fields.map(f => ({ kind: 'field' as const, label: f.label, section: f.section })),
    ...inventory.buttons.map(b => ({ kind: 'button' as const, label: b.label, section: b.section })),
    ...inventory.tabs.map(t => ({ kind: 'tab' as const, label: t.label })),
    ...inventory.sections.map(s => ({ kind: 'section' as const, label: s }))
  ];
  const suggestions: ScreenMatchSuggestion[] = [];
  const unmatched: string[] = [];

  for (const target of targets) {
    const ranked = pool
      .map(c => {
        const { score, shared } = textAffinity(target, c.label);
        let adjusted = score;
        if (cue !== 'none' && c.kind !== cue) adjusted *= 0.85;
        if (cue === c.kind) adjusted = Math.min(1, adjusted * 1.05);
        // A seção do candidato é citada no próprio passo: contexto funcional compatível
        const sectionCited = !!c.section && normalizeText(c.section).length > 3 && stepNorm.includes(normalizeText(c.section));
        if (sectionCited && adjusted > 0) adjusted = Math.min(1, adjusted + 0.08);
        return { c, adjusted, shared, sectionCited };
      })
      .filter(x => x.adjusted >= SUGGESTION_MIN_SCORE)
      .sort((a, b) => b.adjusted - a.adjusted)
      .slice(0, MAX_SUGGESTIONS_PER_TARGET);

    if (ranked.length === 0) {
      unmatched.push(target);
      continue;
    }
    for (const r of ranked) {
      const why = [
        r.shared.length > 0 ? `termo(s) em comum: ${r.shared.join(', ')}` : `similaridade textual ${Math.round(r.adjusted * 100)}%`,
        r.sectionCited ? `seção "${r.c.section}" citada no passo` : r.c.section ? `na seção "${r.c.section}"` : ''
      ]
        .filter(Boolean)
        .join('; ');
      suggestions.push({
        target,
        kind: r.c.kind,
        actual: r.c.label,
        section: r.c.section,
        similarity: Number(r.adjusted.toFixed(2)),
        reason: why
      });
    }
  }
  return { suggestions, unmatched };
}

const KIND_LABEL: Record<ScreenElementKind, string> = { field: 'campo', button: 'botão', section: 'seção', tab: 'aba' };

/** Instrução de reescrita derivada da melhor sugestão de cada alvo (consultiva; o manual não é alterado). */
export function buildRewriteHint(stepNumber: number, suggestions: ScreenMatchSuggestion[], unmatched: string[]): string | undefined {
  const best = new Map<string, ScreenMatchSuggestion>();
  for (const s of suggestions) {
    const cur = best.get(s.target);
    if (!cur || s.similarity > cur.similarity) best.set(s.target, s);
  }
  const parts = Array.from(best.values())
    .filter(s => normalizeText(s.target) !== normalizeText(s.actual))
    .map(s => `substituir **${s.target}** por **${s.actual}** (${KIND_LABEL[s.kind]}${s.section ? ` da seção **${s.section}**` : ''})`);
  const exact = Array.from(best.values()).filter(s => normalizeText(s.target) === normalizeText(s.actual));
  const out: string[] = [];
  if (parts.length > 0) out.push(`no passo ${stepNumber}, ${parts.join('; ')}`);
  if (exact.length > 0) {
    out.push(`${exact.map(s => `**${s.actual}**`).join(', ')} existe${exact.length > 1 ? 'm' : ''} na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde ${exact.length > 1 ? 'aparecem' : 'aparece'}`);
  }
  if (unmatched.length > 0) {
    out.push(`${unmatched.map(t => `**${t}**`).join(', ')} não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida`);
  }
  return out.length > 0 ? `Sugestão de reescrita: ${out.join('. ')}.` : undefined;
}

/** Monta o diagnóstico a partir de um inventário já lido (puro; coberto por teste offline). */
export function buildAttDiagnosis(input: {
  stepNumber: number;
  stepText: string;
  targets: string[];
  inventory: ScreenStructuralInventory;
  menuPath?: boolean;
  contextPrint?: string;
  now?: Date;
}): AttScreenDiagnosis {
  const targets = input.menuPath ? [] : input.targets;
  const { suggestions, unmatched } = suggestScreenMatches(targets, input.inventory, input.stepText);

  const crossRouteHints: CrossRouteHint[] = [];
  const queryTerms = input.menuPath
    ? input.targets
        .map(t => t.split('>').pop()?.trim() || '')
        .filter(Boolean)
    : unmatched;
  for (const term of queryTerms) {
    const hints = findRouteEntriesByTabOrSection(term, undefined, { excludeHash: input.inventory.route })
      .filter(h => h.score >= 0.8)
      .slice(0, 2);
    for (const h of hints) {
      crossRouteHints.push({
        target: term,
        route: h.entry.hash,
        menuPath: h.entry.chain.join(' > '),
        matchedIn: h.matchedIn,
        matchedLabel: h.matchedLabel
      });
    }
  }

  return {
    stepNumber: input.stepNumber,
    capturedAt: (input.now ?? new Date()).toISOString(),
    inventory: input.inventory,
    targets,
    suggestions,
    unmatched,
    ...(crossRouteHints.length > 0 ? { crossRouteHints } : {}),
    contextPrint: input.contextPrint,
    rewriteHint: buildRewriteHint(input.stepNumber, suggestions, unmatched),
    menuPath: input.menuPath || undefined
  };
}

/**
 * Lê ao vivo o inventário da tela do bloqueio e monta o diagnóstico. `ensureContextPrint` é chamado quando
 * o passo bloqueado ainda não tem imagem: devolve o nome do arquivo da print de referência gerada.
 * Qualquer falha de leitura devolve `null` (o bloqueio `[ATT]` segue sem o Raio-X, nunca vira falha técnica).
 */
export async function captureAttScreenDiagnosis(
  client: AgentBrowserClient,
  input: {
    stepNumber: number;
    stepText: string;
    targets: string[];
    menuPath?: boolean;
    existingPrint?: string;
    ensureContextPrint?: () => Promise<string | undefined>;
  }
): Promise<AttScreenDiagnosis | null> {
  try {
    const raw = await client.evalJson<unknown>(buildScreenInventoryScript());
    const inventory = parseScreenInventory(raw);
    if (!inventory) return null;
    let contextPrint = input.existingPrint;
    if (!contextPrint && input.ensureContextPrint) {
      try {
        contextPrint = await input.ensureContextPrint();
      } catch {
        contextPrint = undefined;
      }
    }
    return buildAttDiagnosis({
      stepNumber: input.stepNumber,
      stepText: input.stepText,
      targets: input.targets,
      inventory,
      menuPath: input.menuPath,
      contextPrint
    });
  } catch {
    return null;
  }
}

/** Nome do arquivo da print de referência de um passo bloqueado sem imagem. */
export const contextPrintName = (stepNumber: number): string => `passo-${String(stepNumber).padStart(2, '0')}-contexto-att.png`;

const bold = (s: string) => `**${s}**`;
const clip = <T,>(items: T[], max: number) => ({ shown: items.slice(0, max), extra: Math.max(0, items.length - max) });

/**
 * Bloco `> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**` do relatório `[ATT]`.
 * Linhas de citação contínuas (cada uma com `>`); o texto do manual não é tocado.
 */
export function renderAttDiagnosisTip(d: AttScreenDiagnosis): string {
  const inv = d.inventory;
  const lines: string[] = [];
  lines.push(`> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**`);
  lines.push(
    `> Tela alcançada no passo ${d.stepNumber}: ${inv.route ? `rota **${inv.route}**` : 'rota sem hash'}${inv.title ? `, título **${inv.title}**` : ''}${inv.inModal ? ' (modal aberto)' : ''}. Leitura ao vivo do DOM; nada foi acionado.`
  );
  if (inv.sections.length > 0) {
    const { shown, extra } = clip(inv.sections, 12);
    lines.push(`> * **Seções visíveis:** ${shown.map(bold).join(', ')}${extra ? ` (+${extra})` : ''}.`);
  }
  if (inv.tabs.length > 0) {
    const { shown, extra } = clip(inv.tabs, 10);
    lines.push(`> * **Abas:** ${shown.map(t => bold(t.label) + (t.active ? ' (ativa)' : '')).join(', ')}${extra ? ` (+${extra})` : ''}.`);
  }
  if (inv.fields.length > 0) {
    const { shown, extra } = clip(inv.fields, 25);
    lines.push(`> * **Campos:** ${shown.map(f => bold(f.label) + (f.section ? ` (${f.section})` : '')).join(', ')}${extra ? ` (+${extra})` : ''}.`);
  }
  if (inv.buttons.length > 0) {
    const { shown, extra } = clip(inv.buttons, 15);
    lines.push(`> * **Botões:** ${shown.map(b => bold(b.label) + (b.disabled ? ' (desabilitado)' : '')).join(', ')}${extra ? ` (+${extra})` : ''}.`);
  }
  if (inv.sections.length + inv.tabs.length + inv.fields.length + inv.buttons.length === 0) {
    lines.push(`> * Nenhuma seção, aba, campo ou botão visível foi lido nesta tela.`);
  }
  if (d.menuPath) {
    lines.push(`> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.`);
  }
  const grouped = new Map<string, ScreenMatchSuggestion[]>();
  for (const s of d.suggestions) grouped.set(s.target, [...(grouped.get(s.target) || []), s]);
  for (const [target, list] of grouped) {
    lines.push(
      `> * **Correspondência sugerida para "${target}":** ${list
        .map(s => `${bold(s.actual)} (${KIND_LABEL[s.kind]}, ${Math.round(s.similarity * 100)}% — ${s.reason})`)
        .join('; ')}.`
    );
  }
  if (d.unmatched.length > 0) {
    lines.push(`> * **Sem correspondência funcional na tela:** ${d.unmatched.map(bold).join(', ')}.`);
  }
  if (d.crossRouteHints && d.crossRouteHints.length > 0) {
    const kindPt: Record<CrossRouteHint['matchedIn'], string> = { tab: 'aba', section: 'seção', title: 'título' };
    lines.push(
      `> * **Pistas em outras rotas (\`orion-route-graph.json\`):** ${d.crossRouteHints
        .map(h => `"${h.target}" aparece em **${h.menuPath}** (${h.route || 'sem hash'}, ${kindPt[h.matchedIn]} **${h.matchedLabel}**)`)
        .join('; ')}.`
    );
  }
  if (d.rewriteHint) lines.push(`> * ${d.rewriteHint} O texto original do manual foi preservado nesta rotina.`);
  if (d.contextPrint) lines.push(`> * **Referência visual:** ${d.contextPrint} (tela exata no momento do bloqueio).`);
  return lines.join('\n');
}

const q = (s: string) => `'${String(s).replace(/'/g, "''")}'`;
const qList = (items: string[]) => `[${items.map(q).join(', ')}]`;

/** Linhas YAML de `auditoria_ui.diagnostico_tela_att` (JSONB no Supabase, sem migration), recuo de 2 espaços. */
export function attDiagnosisYamlLines(d: AttScreenDiagnosis): string[] {
  const inv = d.inventory;
  const lines: string[] = ['  diagnostico_tela_att:'];
  lines.push(`    passo: ${d.stepNumber}`);
  lines.push(`    capturado_em: ${q(d.capturedAt)}`);
  lines.push(`    rota: ${q(inv.route)}`);
  lines.push(`    titulo_painel: ${q(inv.title)}`);
  lines.push(`    em_modal: ${inv.inModal}`);
  lines.push(`    secoes: ${qList(inv.sections)}`);
  lines.push(`    abas: ${qList(inv.tabs.map(t => t.label))}`);
  if (inv.fields.length > 0) {
    lines.push(`    campos:`);
    for (const f of inv.fields) {
      lines.push(`      - rotulo: ${q(f.label)}`);
      lines.push(`        tipo: ${q(f.type)}`);
      if (f.section) lines.push(`        secao: ${q(f.section)}`);
    }
  } else {
    lines.push(`    campos: []`);
  }
  lines.push(`    botoes: ${qList(inv.buttons.map(b => b.label))}`);
  lines.push(`    alvos_do_passo: ${qList(d.targets)}`);
  if (d.suggestions.length > 0) {
    lines.push(`    correspondencias_sugeridas:`);
    for (const s of d.suggestions) {
      lines.push(`      - alvo: ${q(s.target)}`);
      lines.push(`        elemento_real: ${q(s.actual)}`);
      lines.push(`        tipo: ${q(KIND_LABEL[s.kind])}`);
      if (s.section) lines.push(`        secao: ${q(s.section)}`);
      lines.push(`        similaridade: ${s.similarity}`);
    }
  } else {
    lines.push(`    correspondencias_sugeridas: []`);
  }
  lines.push(`    alvos_sem_correspondencia: ${qList(d.unmatched)}`);
  if (d.crossRouteHints && d.crossRouteHints.length > 0) {
    lines.push(`    pistas_mapa_rotas:`);
    for (const h of d.crossRouteHints) {
      lines.push(`      - alvo: ${q(h.target)}`);
      lines.push(`        menu: ${q(h.menuPath)}`);
      lines.push(`        rota: ${q(h.route)}`);
      lines.push(`        encontrado_em: ${q(h.matchedIn)}`);
      lines.push(`        rotulo_real: ${q(h.matchedLabel)}`);
    }
  }
  if (d.rewriteHint) lines.push(`    sugestao_reescrita: ${q(d.rewriteHint.replace(/\*\*/g, ''))}`);
  if (d.contextPrint) lines.push(`    print_contexto: ${q(d.contextPrint)}`);
  return lines;
}
