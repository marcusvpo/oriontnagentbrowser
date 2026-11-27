import type { AgentBrowserClient, OpenedTab } from './browser.js';
import { isGenericContainerMatch } from './evidence.js';
import { ACTIVE_MODAL_SELECTOR, dismissTopModalOnce } from './modal-scope.js';
import { RESOLVED_COMMIT_SOURCE } from './mutation-guard.js';
import { deriveStepGuard } from './navigation-guard.js';
import { PERMISSION_MARK_SELECTOR } from './rbac.js';
import { findScreenCatalogEntryByHash } from './route-crawler.js';
import { routeSynonymsFor } from './route-synonyms.js';
import type {
  AllKnownElements,
  ElementWhereLocation,
  ScreenCatalogEntry as L2ScreenCatalogEntry,
  ScreenSubState
} from './screen-catalog-extractor.js';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';
import type {
  BoundingBox,
  DOMResolvedGeometry,
  ExploredTrigger,
  RevealExplorationLog,
  RevealTriggerKind,
  RoutineStep,
  StepZonePolicy
} from './types.js';

/**
 * Exploração Investigativa Pré-`[!!!]` (ADR-018, Golden Rule 13).
 *
 * `[!!!]` é o último recurso. Quando um alvo obrigatório não está na tela inicial do passo (depois do
 * DOM direto, dos rótulos visíveis e dos sinônimos), este módulo investiga os gatilhos reveladores
 * seguros da tela atual antes de concluir que o recurso não existe:
 *   a) abas internas (`nav-tabs` / `nav-pills`) ainda não abertas;
 *   b) accordions e painéis recolhidos (`aria-expanded="false"`);
 *   c) botões de abertura/habilitação não destrutivos (Alterar, Editar, Adicionar, Novo, Avançado, Filtros);
 *   d) checkboxes/radios com afinidade semântica ao campo procurado.
 *
 * Regras de segurança:
 * - nenhum gatilho com texto de gravação/exclusão é acionado (mesma decisão da Trava de Mutação);
 * - checkbox/radio só dentro de um formulário com botão de gravação visível (a persistência é
 *   adiada até o Salvar, que nunca é acionado aqui) e fora de linhas de grade;
 * - cada tentativa sem efeito é desfeita e o estado da tela é conferido por impressão digital;
 * - nada é inventado: todo gatilho e todo alvo revelado são nós reais, carimbados e medidos ao vivo.
 */

/** Palavras que abrem um modo, formulário ou filtro sem gravar nada (texto normalizado do botão). */
const PREFIX_OPENERS = ['adicionar', 'novo', 'nova', 'filtros', 'mais filtros', 'pesquisa avancada', 'busca avancada', 'opcoes avancadas', 'mais opcoes', 'exibir', 'mostrar', 'expandir'];
/** Verbos que só valem como texto inteiro do botão: com complemento, podem alterar um registro direto. */
const EXACT_OPENERS = ['alterar', 'editar', 'visualizar', 'detalhes', 'avancado', 'avancada', 'avancados', 'avancadas'];

const DEFAULT_MAX_TRIGGERS = 6;

export interface RevealTrigger {
  kind: RevealTriggerKind;
  /** Texto real do gatilho */
  label: string;
  /** O alvo já existia oculto no DOM sob este gatilho */
  directed: boolean;
  /** O alvo foi localizado no Catálogo Nível 2 sob este gatilho (ADR-039) */
  catalogDirected?: boolean;
  /** Carimbo do nó a clicar */
  selector: string;
  /** Carimbo do nó que desfaz o gatilho (aba antes ativa, radio antes marcado) */
  restoreSelector?: string;
  box: BoundingBox;
}

export interface CatalogRevealHint {
  target: string;
  matchedLabel: string;
  where: ElementWhereLocation;
  triggerKind: RevealTriggerKind;
  triggerLabel: string;
  parentTab?: string;
  nestedTab?: string;
  score: number;
}

interface ScreenFingerprint {
  hash: string;
  modals: number;
  tabs: string;
  expanded: number;
  checked: number;
}

interface TriggerScan {
  triggers: RevealTrigger[];
  latent: Array<{ target: string; hiddenIn: string; controller: string }>;
  fingerprint: ScreenFingerprint;
  scope: string;
}

export interface RevealSuccess {
  trigger: RevealTrigger;
  /** Gatilho medido ao vivo ANTES do clique, no frame de `triggerRawPath` */
  triggerGeometry: DOMResolvedGeometry;
  triggerRawPath: string;
  /** Alvos revelados medidos APÓS o clique, no frame de `revealedRawPath` */
  geometry: DOMResolvedGeometry;
  revealedRawPath: string;
  /** Alvos do manual agora medidos, como citados */
  revealed: string[];
  /** Sinônimos de rota usados na medição pós-abertura de sub-estado (documentado -> rótulo(s) real(is)) */
  revealedSynonyms?: Record<string, string[]>;
  /** Caixa do gatilho no frame pós-clique, quando ele continua inteiro no viewport */
  triggerBoxAfter?: BoundingBox;
}

export interface RevealOutcome {
  success?: RevealSuccess;
  log: RevealExplorationLog;
}

export interface RevealRequest {
  step: RoutineStep;
  /** Alvos do manual que não estão na tela */
  missing: string[];
  zonePolicy: StepZonePolicy;
  /** Caminho do screenshot bruto de cada frame da exploração */
  rawPathFor: (suffix: string) => string;
  maxTriggers?: number;
}

const BROWSER_HELPERS = `
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w\\s+]/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const fingerprint = () => ({
        hash: window.location.hash || '',
        modals: Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis).length,
        tabs: Array.from(document.querySelectorAll('.nav-tabs li.active > a, .nav-pills li.active > a, .nav-link.active, [role="tab"][aria-selected="true"]')).filter(vis).map(t => clean(t.textContent)).join('|'),
        expanded: document.querySelectorAll('[aria-expanded="true"]').length,
        checked: document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').length
      });
`;

/**
 * Script injetável (via `eval --stdin`) que levanta os gatilhos reveladores seguros da tela atual,
 * carimba cada um com um atributo único e devolve rótulo, tipo e caixa medidos ao vivo.
 */
export function buildRevealTriggerScript(missingTargets: string[]): string {
  const wanted = missingTargets.map(t => ({ raw: t, norm: normalizeText(t) })).filter(t => t.norm.length >= 2);
  return `
    (() => {
      const wanted = ${JSON.stringify(wanted)};
      const PREFIX_OPENERS = ${JSON.stringify(PREFIX_OPENERS)};
      const EXACT_OPENERS = ${JSON.stringify(EXACT_OPENERS)};
      const COMMIT_RE = new RegExp(${JSON.stringify(RESOLVED_COMMIT_SOURCE)});
      const TOP_NAV = '.navbar, #navbar, .dropdown-menu';
      const BLOCKED = ${JSON.stringify(PERMISSION_MARK_SELECTOR)};
      const TAB_SEL = '.nav-tabs > li > a, .nav-pills > li > a, .nav-tabs .nav-link, .nav-pills .nav-link, [role="tab"]';
      const PANE_SEL = '.tab-pane, [role="tabpanel"], tab';
      ${BROWSER_HELPERS}
      for (const prev of window.__orionRevealStamps || []) {
        try { prev[0].removeAttribute(prev[1]); } catch (e) {}
      }
      window.__orionRevealStamps = [];
      const token = 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
      let stampCount = 0;
      const stamp = el => {
        const attr = 'data-orion-audit-reveal-' + token + '-' + (stampCount++);
        el.setAttribute(attr, '');
        window.__orionRevealStamps.push([el, attr]);
        return '[' + attr + ']';
      };
      const describe = el => {
        if (!el || !el.tagName) return '';
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\\s+/).filter(Boolean).slice(0, 3) : [];
        return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls.length ? '.' + cls.join('.') : '');
      };
      const box = el => {
        const r = el.getBoundingClientRect();
        const x1 = Math.round(r.left), y1 = Math.round(r.top);
        return { x: x1, y: y1, width: Math.round(r.right) - x1, height: Math.round(r.bottom) - y1 };
      };

      const modals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      const scope = modals.length > 0 ? modals[modals.length - 1] : document.body;

      const labelOf = el => clean(el.innerText || el.textContent) || clean(el.getAttribute('title') || el.getAttribute('aria-label') || el.value);
      const checkLabel = c => {
        const lab = (c.labels && c.labels[0]) || c.closest('label');
        return clean((lab && (lab.innerText || lab.textContent)) || c.getAttribute('aria-label') || c.getAttribute('title'));
      };
      const isActiveTab = t => t.classList.contains('active') || (t.parentElement && t.parentElement.classList.contains('active')) || t.getAttribute('aria-selected') === 'true';
      const activeTabOf = el => {
        const list = el.closest('ul, [role="tablist"], .nav');
        if (!list) return null;
        return Array.from(list.querySelectorAll('a, [role="tab"], button')).find(t => t !== el && vis(t) && isActiveTab(t)) || null;
      };

      const triggers = [];
      const used = new Set();
      const push = (el, kind, directed, clickEl, restoreEl) => {
        const target = clickEl || el;
        if (!target || used.has(target) || !vis(target)) return;
        if (target.closest(TOP_NAV) || target.closest(BLOCKED)) return;
        const cls = typeof target.className === 'string' ? target.className : '';
        if (target.disabled || target.getAttribute('aria-disabled') === 'true' || /(^|\\s)disabled(\\s|$)/.test(cls)) return;
        const label = kind === 'checkbox' || kind === 'radio' ? checkLabel(el) : labelOf(el);
        if (!label || label.length > 60) return;
        const n = norm(label);
        if (COMMIT_RE.test(n) || n === 'sim' || n === 'ok') return;
        used.add(target);
        const t = { kind, label, directed, selector: stamp(target), box: box(target) };
        if (restoreEl && vis(restoreEl)) t.restoreSelector = stamp(restoreEl);
        triggers.push(t);
      };

      // ------------------------------------------------------------------
      // Etapa dirigida: o alvo já existe no DOM, oculto sob uma aba inativa ou um painel recolhido
      // ------------------------------------------------------------------
      const matches = (el, w) => {
        const hit = t => !!t && (t === w.norm || (t.length <= w.norm.length * 3 + 24 && (' ' + t + ' ').includes(' ' + w.norm + ' ')));
        return hit(norm((el.textContent || '').slice(0, 200))) ||
          hit(norm(el.getAttribute('placeholder') || el.getAttribute('value') || el.getAttribute('title') || ''));
      };
      const hiddenAncestors = el => {
        const out = [];
        let cur = el;
        while (cur && cur !== scope && cur !== document.documentElement) {
          const s = window.getComputedStyle(cur);
          if (s.display === 'none' || s.visibility === 'hidden') out.push(cur);
          cur = cur.parentElement;
        }
        return out;
      };
      const byRef = id => {
        if (!id) return null;
        const q = id.replace(/["\\\\]/g, '');
        return scope.querySelector('[href="#' + q + '"], [data-target="#' + q + '"], [data-bs-target="#' + q + '"], [aria-controls="' + q + '"]');
      };
      const controllerOf = c => {
        let ctrl = byRef(c.id);
        const labelledBy = c.getAttribute('aria-labelledby');
        if (!ctrl && labelledBy) ctrl = document.getElementById(labelledBy);
        const isPane = c.matches(PANE_SEL);
        if (!ctrl && isPane && c.parentElement) {
          const panes = Array.from(c.parentElement.children).filter(k => k.matches(PANE_SEL));
          const idx = panes.indexOf(c);
          let host = c.parentElement;
          for (let up = 0; up < 3 && host && !ctrl; up++) {
            const tabs = Array.from(host.querySelectorAll(TAB_SEL)).filter(t => !panes.some(p => p.contains(t)));
            if (tabs.length === panes.length && tabs[idx]) ctrl = tabs[idx];
            host = host.parentElement;
          }
        }
        if (!ctrl && c.matches('.collapse, .panel-collapse, .accordion-collapse, [aria-hidden="true"]')) {
          const head = c.previousElementSibling;
          if (head) ctrl = head.matches('a, button, [role="button"]') ? head : (head.querySelector('a, button, [role="button"]') || head);
        }
        if (!ctrl || ctrl === c) return null;
        const tabLike = isPane || ctrl.matches('[role="tab"]') || !!ctrl.closest('.nav-tabs, .nav-pills, [role="tablist"]');
        return { el: ctrl, kind: tabLike ? 'tab' : 'accordion' };
      };

      const latent = [];
      const HIDDEN_TEXT = 'label, button, a, span, th, legend, h1, h2, h3, h4, h5, input, select, textarea, strong, b, td, p, li';
      for (const el of scope.querySelectorAll(HIDDEN_TEXT)) {
        if (latent.length >= 12) break;
        if (vis(el) || el.closest(TOP_NAV) || el.closest(BLOCKED)) continue;
        for (const w of wanted) {
          if (latent.some(l => l.target === w.raw && l.controller) || !matches(el, w)) continue;
          let found = null;
          let hider = null;
          for (const h of hiddenAncestors(el)) {
            found = controllerOf(h);
            if (found) { hider = h; break; }
          }
          latent.push({ target: w.raw, hiddenIn: describe(hider || el), controller: found ? labelOf(found.el) : '' });
          if (found) push(found.el, found.kind, true, null, found.kind === 'tab' ? activeTabOf(found.el) : null);
          break;
        }
      }

      // ------------------------------------------------------------------
      // Etapa enumerada
      // ------------------------------------------------------------------
      // (a) abas internas ainda não abertas
      for (const t of scope.querySelectorAll(TAB_SEL)) {
        if (isActiveTab(t)) continue;
        push(t, 'tab', false, null, activeTabOf(t));
      }
      // (b) accordions e painéis recolhidos
      for (const t of scope.querySelectorAll('[aria-expanded="false"], [data-toggle="collapse"].collapsed, .accordion-toggle.collapsed, details:not([open]) > summary')) {
        if (t.matches('input, select, textarea, [role="combobox"], [role="tab"], .dropdown-toggle, [data-toggle="dropdown"]')) continue;
        if (t.closest('.nav-tabs, .nav-pills, [role="tablist"]')) continue;
        push(t, 'accordion', false);
      }
      // (c) botões de abertura/habilitação não destrutivos
      const seenLabels = new Set();
      for (const b of scope.querySelectorAll('button, a.btn, [role="button"], input[type="button"]')) {
        const n = norm(labelOf(b)).replace(/^\\+\\s*/, '').replace(/\\s*\\+$/, '');
        if (!n || seenLabels.has(n)) continue;
        const opener = EXACT_OPENERS.includes(n) || PREFIX_OPENERS.some(o => n === o || n.startsWith(o + ' '));
        if (!opener) continue;
        seenLabels.add(n);
        push(b, 'button', false);
      }
      // (d) checkboxes/radios: só com persistência adiada comprovada (formulário com botão de gravação
      //     visível) e fora de linhas de grade, onde um seletor pode gravar no ato
      const hasCommitButton = c => Array.from(c.querySelectorAll('button, a.btn, input[type="submit"], input[type="button"]')).some(b => vis(b) && COMMIT_RE.test(norm(labelOf(b))));
      let checks = 0;
      for (const c of scope.querySelectorAll('input[type="checkbox"], input[type="radio"]')) {
        if (checks >= 20) break;
        if (c.checked || c.disabled) continue;
        if (c.closest('table, tr, .ui-grid, [role="grid"], [role="row"]')) continue;
        const lab = (c.labels && c.labels[0]) || c.closest('label');
        const clickEl = vis(c) ? c : lab;
        if (!clickEl || !vis(clickEl)) continue;
        const container = c.closest('form, .modal-content, .tab-pane, .panel, fieldset') || scope;
        if (!hasCommitButton(container) && !hasCommitButton(scope)) continue;
        let restoreEl = null;
        if (c.type === 'radio') {
          const prior = c.name ? Array.from(scope.querySelectorAll('input[type="radio"]')).find(r => r.name === c.name && r.checked) : null;
          if (!prior) continue;
          restoreEl = vis(prior) ? prior : ((prior.labels && prior.labels[0]) || prior.closest('label'));
          if (!restoreEl) continue;
        }
        push(c, c.type === 'radio' ? 'radio' : 'checkbox', false, clickEl, restoreEl);
        checks++;
      }

      return JSON.stringify({ triggers: triggers.slice(0, 60), latent, fingerprint: fingerprint(), scope: describe(scope) });
    })()
  `;
}

async function scanTriggers(client: AgentBrowserClient, missing: string[]): Promise<TriggerScan | null> {
  const scan = await client.evalJson<TriggerScan>(buildRevealTriggerScript(missing));
  return scan && Array.isArray(scan.triggers) && scan.fingerprint ? scan : null;
}

async function readFingerprint(client: AgentBrowserClient): Promise<ScreenFingerprint | null> {
  return client.evalJson<ScreenFingerprint>(`
    (() => {
      ${BROWSER_HELPERS}
      return JSON.stringify(fingerprint());
    })()
  `);
}

/** Fecha o modal do topo por um controle de saída sem efeito (X, Cancelar, Fechar, Voltar). */
export async function dismissTopModal(client: AgentBrowserClient): Promise<void> {
  await dismissTopModalOnce(client);
}

const sameState = (a: ScreenFingerprint, b: ScreenFingerprint) =>
  a.hash === b.hash && a.modals === b.modals && a.tabs === b.tabs && a.expanded === b.expanded && a.checked === b.checked;

/**
 * Desfaz um gatilho que não revelou o alvo e confere, pela impressão digital, que a tela voltou ao
 * ponto de partida. Devolve `false` se o estado não pôde ser restaurado (a exploração é encerrada).
 */
async function restoreState(client: AgentBrowserClient, trigger: RevealTrigger, origin: ScreenFingerprint): Promise<boolean> {
  let now = await readFingerprint(client);
  if (now && sameState(now, origin)) return true;

  try {
    if (now && now.modals > origin.modals) {
      await dismissTopModal(client);
    } else if ((trigger.kind === 'tab' || trigger.kind === 'radio') && trigger.restoreSelector) {
      await client.click(trigger.restoreSelector);
    } else if (trigger.kind === 'accordion' || trigger.kind === 'checkbox') {
      await client.click(trigger.selector);
    }
  } catch {}
  await client.wait(600);
  now = await readFingerprint(client);
  if (now && sameState(now, origin)) return true;

  try {
    if (now && now.modals > origin.modals) {
      await dismissTopModal(client);
      await client.wait(600);
    }
    if (!now || now.hash !== origin.hash) {
      await client.jumpHash(origin.hash || '#/inicio');
      await client.wait(1200);
    }
  } catch {}
  now = await readFingerprint(client);
  return !!now && sameState(now, origin);
}

const KIND_WEIGHT: Record<RevealTriggerKind, number> = { tab: 3, accordion: 3, button: 2, checkbox: 1, radio: 1, subportal_link: 2 };

/** Afinidade de um gatilho com os alvos procurados e com o texto do passo (0..1). */
function affinity(trigger: RevealTrigger, missing: string[], stepText: string): number {
  const label = normalizeText(trigger.label);
  const dice = Math.max(0, ...missing.map(m => computeDiceSimilarity(label, m)));
  const words = label.split(' ').filter(w => w.length >= 4);
  const haystack = ` ${normalizeText(`${stepText} ${missing.join(' ')}`)} `;
  const overlap = words.length > 0 ? words.filter(w => haystack.includes(` ${w} `)).length / words.length : 0;
  return Math.max(dice, overlap);
}

/** Seletor condicional (checkbox/radio) só entra com afinidade semântica ao campo procurado. */
const eligible = (t: RevealTrigger, a: number) => t.directed || (t.kind !== 'checkbox' && t.kind !== 'radio') || a >= 0.45;

const CATALOG_HINT_MIN_SCORE = 0.65;

/**
 * Converte uma anotação `where` do Catálogo Nível 2 no gatilho seguro correspondente (aba, accordion,
 * botão de abertura de modal/formulário ou botão de busca em grade vazia).
 */
export function parseWhereLocation(
  where: ElementWhereLocation,
  subStates?: ScreenSubState[]
): { triggerKind: RevealTriggerKind; triggerLabel: string; parentTab?: string; nestedTab?: string } | null {
  if (!where || where === 'root') return null;
  if (where.startsWith('tab:')) {
    const label = where.slice(4).trim();
    return label ? { triggerKind: 'tab', triggerLabel: label } : null;
  }
  if (where.startsWith('accordion:')) {
    const label = where.slice(10).trim();
    if (!label) return null;
    const sub = subStates?.find(
      s => (s.kind === 'accordion' || s.kind === 'advanced_filters') && normalizeText(s.triggerLabel) === normalizeText(label)
    );
    return { triggerKind: 'accordion', triggerLabel: label, parentTab: sub?.parentTab };
  }
  if (where.startsWith('modal:')) {
    const raw = where.slice(6).trim();
    if (!raw) return null;
    const nestedIdx = raw.indexOf(' > tab:');
    if (nestedIdx !== -1) {
      const opener = raw.slice(0, nestedIdx).trim();
      const nestedTab = raw.slice(nestedIdx + 7).trim();
      if (!opener) return null;
      const sub = subStates?.find(
        s => (s.kind === 'modal_opener' || s.kind === 'form_opener') && normalizeText(s.triggerLabel) === normalizeText(opener)
      );
      return {
        triggerKind: 'button',
        triggerLabel: opener,
        ...(sub?.parentTab ? { parentTab: sub.parentTab } : {}),
        ...(nestedTab ? { nestedTab } : {})
      };
    }
    const sub = subStates?.find(
      s => (s.kind === 'modal_opener' || s.kind === 'form_opener') && normalizeText(s.triggerLabel) === normalizeText(raw)
    );
    return { triggerKind: 'button', triggerLabel: raw, parentTab: sub?.parentTab };
  }
  if (where.startsWith('view:')) {
    const label = where.slice(5).trim();
    return label ? { triggerKind: 'button', triggerLabel: label } : null;
  }
  if (where === 'grid_row') {
    const sub = subStates?.find(s => s.kind === 'search_grid_reveal');
    return {
      triggerKind: 'button',
      triggerLabel: sub?.triggerLabel || 'Pesquisar',
      parentTab: sub?.parentTab
    };
  }
  return null;
}

function scoreCatalogMatch(target: string, candidate: string): number {
  const tNorm = normalizeText(target);
  const cNorm = normalizeText(candidate);
  if (!tNorm || !cNorm) return 0;
  if (tNorm === cNorm) return 1;
  return computeDiceSimilarity(tNorm, cNorm);
}

/**
 * Consulta `allKnownElements` do Catálogo Nível 2 para a rota atual e retorna pistas diretas de
 * onde os alvos ausentes residem (`tab:...`, `accordion:...`, `modal:...`, `grid_row`).
 * Nunca fabrica evidência: apenas orienta a ordem dos gatilhos reais do DOM.
 */
export function findCatalogRevealHints(routeHash: string, missing: string[]): CatalogRevealHint[] {
  if (!routeHash || missing.length === 0) return [];
  const entry = findScreenCatalogEntryByHash(routeHash) as unknown as Partial<L2ScreenCatalogEntry> | null;
  const all = entry?.allKnownElements as AllKnownElements | undefined;
  if (!all) return [];

  const candidates: Array<{ label: string; where: ElementWhereLocation }> = [
    ...all.tabs.map(t => ({ label: t.label, where: t.where })),
    ...all.buttons.flatMap(b => [
      ...(b.label ? [{ label: b.label, where: b.where }] : []),
      ...(b.tooltip ? [{ label: b.tooltip, where: b.where }] : [])
    ]),
    ...all.fields.map(f => ({ label: f.label, where: f.where })),
    ...all.tableHeaders.map(h => ({ label: h.header, where: h.where })),
    ...all.rowActions.flatMap(r => [
      ...(r.tooltip ? [{ label: r.tooltip, where: r.where }] : []),
      ...(r.iconClass ? [{ label: r.iconClass, where: r.where }] : [])
    ])
  ].filter(c => c.label && c.where && c.where !== 'root');

  const hints: CatalogRevealHint[] = [];
  const seen = new Set<string>();

  for (const target of missing) {
    const searchTerms = [target, ...routeSynonymsFor(routeHash, target).flatMap(s => s.real)];
    for (const term of searchTerms) {
      for (const cand of candidates) {
        const score = scoreCatalogMatch(term, cand.label);
        if (score < CATALOG_HINT_MIN_SCORE) continue;
        const parsed = parseWhereLocation(cand.where, entry?.subStates);
        if (!parsed) continue;
        const key = `${normalizeText(target)}|${parsed.triggerKind}|${normalizeText(parsed.triggerLabel)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        hints.push({
          target,
          matchedLabel: cand.label,
          where: cand.where,
          triggerKind: parsed.triggerKind,
          triggerLabel: parsed.triggerLabel,
          ...(parsed.parentTab ? { parentTab: parsed.parentTab } : {}),
          ...(parsed.nestedTab ? { nestedTab: parsed.nestedTab } : {}),
          score: Number(score.toFixed(3))
        });
      }
    }
  }

  return hints.sort((a, b) => b.score - a.score);
}

function matchCatalogHint(
  trigger: RevealTrigger,
  catalogHints: CatalogRevealHint[]
): { hint: CatalogRevealHint; direct: boolean } | undefined {
  if (catalogHints.length === 0) return undefined;
  const tNorm = normalizeText(trigger.label);
  const direct = catalogHints.find(h => h.triggerKind === trigger.kind && normalizeText(h.triggerLabel) === tNorm);
  if (direct) return { hint: direct, direct: true };
  if (trigger.kind === 'tab') {
    const viaParent = catalogHints.find(h => h.parentTab && normalizeText(h.parentTab) === tNorm);
    if (viaParent) return { hint: viaParent, direct: false };
  }
  return undefined;
}

export function rankTriggers(
  triggers: RevealTrigger[],
  missing: string[],
  stepText: string,
  catalogHints: CatalogRevealHint[] = []
): RevealTrigger[] {
  return triggers
    .map(t => ({ t, a: affinity(t, missing, stepText), matched: matchCatalogHint(t, catalogHints) }))
    .filter(({ t, a, matched }) => eligible(t, a) || !!matched)
    .map(({ t, a, matched }) => {
      const enriched: RevealTrigger = matched ? { ...t, catalogDirected: true } : t;
      const catalogBoost = matched ? (matched.direct ? 60 : 40) + matched.hint.score * 20 : 0;
      return {
        t: enriched,
        score: (t.directed ? 100 : 0) + catalogBoost + a * 10 + KIND_WEIGHT[t.kind]
      };
    })
    .sort((x, y) => y.score - x.score)
    .map(x => x.t);
}

// ---------------------------------------------------------------------------
// Sub-portais integrados em nova guia (ADR-025)
// ---------------------------------------------------------------------------

/** Palavras genéricas de um link ("Clique aqui para acessar a tela de configuração..."): não provam afinidade. */
const SUBPORTAL_STOPWORDS = new Set(
  [
    'clique', 'aqui', 'para', 'acessar', 'acesse', 'acesso', 'tela', 'configuracao', 'configuracoes', 'link', 'abrir', 'abra',
    'portal', 'sistema', 'orion', 'site', 'pagina', 'saiba', 'mais', 'clicando', 'clicar', 'esta', 'essa', 'este', 'nesta',
    'nessa', 'como', 'onde', 'uma', 'dos', 'das', 'por', 'nos', 'nas', 'com', 'que', 'cadastro', 'cadastrar', 'visualizar'
  ]
);

/**
 * Termos DISTINTIVOS que o rótulo de um link compartilha com o contexto (texto do passo, alvos ausentes e título
 * da rotina). Um link só é aceito como gatilho de sub-portal com pelo menos um termo em comum; nenhum nome de
 * portal é fixado no código (o "COAF" de um link "...no Orion Coaf" casa porque o passo/rotina o cita).
 */
export function subportalAffinityTerms(label: string, context: string): string[] {
  const ctx = new Set(normalizeText(context).split(' ').filter(w => w.length >= 3));
  const shared = normalizeText(label)
    .split(' ')
    .filter(w => w.length >= 3 && !SUBPORTAL_STOPWORDS.has(w) && ctx.has(w));
  return Array.from(new Set(shared));
}

interface SubportalCandidate {
  label: string;
  selector: string;
}

/** Levanta (e carimba) os links que abrem nova guia: `target="_blank"` ou `window.open`. Só leitura + carimbo. */
export function buildSubportalLinkScript(): string {
  return `
    (() => {
      const COMMIT_RE = new RegExp(${JSON.stringify(RESOLVED_COMMIT_SOURCE)});
      const TOP_NAV = '.navbar, #navbar, .dropdown-menu';
      const BLOCKED = ${JSON.stringify(PERMISSION_MARK_SELECTOR)};
      ${BROWSER_HELPERS}
      for (const prev of window.__orionSubportalStamps || []) {
        try { prev[0].removeAttribute(prev[1]); } catch (e) {}
      }
      window.__orionSubportalStamps = [];
      const token = 's' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
      const modals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      const scope = modals.length > 0 ? modals[modals.length - 1] : document.body;
      const out = [];
      let n = 0;
      // Chamada para navegação ("Clique aqui para acessar a tela de configuração no ..."): o handler de links do
      // Angular não aparece como atributo (<a class="cursor-pointer"> sem href/target/onclick), então o sinal é o
      // texto + a ausência de href, sempre filtrado depois pela afinidade com o passo/rotina.
      const CTA = /(clique aqui|acesse|acessar|abrir|abra|ir para|tela de configura)/;
      const nodes = scope.querySelectorAll('a, button, [role="link"]');
      for (const el of nodes) {
        if (out.length >= 12) break;
        if (!vis(el) || el.closest(TOP_NAV) || el.closest(BLOCKED)) continue;
        const cls = typeof el.className === 'string' ? el.className : '';
        // A própria aplicação marca o link inoperante (ex.: 'disabled-no-events' + title explicando a causa)
        if (el.disabled || el.getAttribute('aria-disabled') === 'true' || /(^|\\s)disabled/.test(cls) || el.closest('[disabled], .disabled')) continue;
        const label = clean(el.innerText || el.textContent) || clean(el.getAttribute('title') || el.getAttribute('aria-label'));
        if (!label || label.length > 160) continue;
        if (COMMIT_RE.test(norm(label))) continue;
        const js = [el.getAttribute('onclick'), el.getAttribute('ng-click')].join(' ');
        const href = String(el.getAttribute('href') || '');
        const staticNewTab = String(el.getAttribute('target') || '').toLowerCase() === '_blank' || /window\\.open/.test(js);
        const jsDriven = href === '' || href === '#' || /^javascript:/i.test(href);
        if (!staticNewTab && !(jsDriven && CTA.test(norm(label)))) continue;
        const attr = 'data-orion-audit-subportal-' + token + '-' + (n++);
        el.setAttribute(attr, '');
        window.__orionSubportalStamps.push([el, attr]);
        out.push({ label, selector: '[' + attr + ']' });
      }
      return JSON.stringify(out);
    })()
  `;
}

export interface SubportalRequest {
  step: RoutineStep;
  /** Alvos do manual que não estão na tela atual */
  missing: string[];
  /** Título da rotina (e demais textos de contexto) para a afinidade do link */
  routineContext: string;
  rawPathFor: (suffix: string) => string;
}

export interface SubportalOpened {
  /** Rótulo real do link acionado */
  label: string;
  /** Termos distintivos que justificaram o clique */
  sharedTerms: string[];
  /** Link medido ao vivo ANTES do clique, no frame de `triggerRawPath` (guia de origem) */
  triggerGeometry: DOMResolvedGeometry;
  triggerRawPath: string;
  /** Guia aberta, já em foco, com viewport 1440x900 reaplicado */
  tab: OpenedTab;
  /** Links de nova guia da tela e quantos tinham afinidade (rastreabilidade) */
  candidates: number;
  withAffinity: number;
}

/**
 * Gatilho genérico de sub-portal (ADR-025). Quando o alvo do passo não está na tela, procura um link que abre
 * nova guia e cujo texto tem afinidade com o passo/rotina, aciona-o e DEIXA a guia nova em foco: o executor
 * repete a localização do passo nela e os passos seguintes continuam nela até o `resetToHome`.
 *
 * Segurança: só links `_blank`/`window.open`, nunca em barra de menu nem bloqueados para o perfil, nunca com
 * texto de gravação; nada é preenchido nem gravado. Sem guia nova (o link navegou a própria guia), a tela
 * volta ao ponto de partida e o gatilho é descartado.
 */
export async function openSubportalLink(client: AgentBrowserClient, request: SubportalRequest): Promise<SubportalOpened | null> {
  const found = (await client.evalJson<SubportalCandidate[]>(buildSubportalLinkScript())) || [];
  if (found.length === 0) return null;
  const context = `${request.step.rawText} ${(request.step.subItems || []).join(' ')} ${request.missing.join(' ')} ${request.routineContext}`;
  const ranked = found
    .map(c => ({ c, terms: subportalAffinityTerms(c.label, context) }))
    .filter(x => x.terms.length > 0)
    .sort((a, b) => b.terms.length - a.terms.length);
  if (ranked.length === 0) {
    console.log(`   [Sub-portal] ${found.length} link(s) de nova guia na tela, nenhum com afinidade com o passo/rotina; descartados.`);
    return null;
  }
  const { c: link, terms } = ranked[0];
  const triggerGeometry = await client.getDOMGeometry([link.selector], { scrollIntoView: true, zone: 'any' });
  if (!triggerGeometry) return null;
  const triggerRawPath = request.rawPathFor('subportal');
  await client.screenshot(triggerRawPath);
  const hrefBefore = String(await client.eval('window.location.href')).replace(/^"|"$/g, '');
  const before = await readFingerprint(client);

  console.log(`   [Sub-portal] Acionando o link "${link.label}" (afinidade: ${terms.join(', ')}); a nova guia, se abrir, passa a ser o foco.`);
  const { openedTab } = await client.withNewTabDetection(() => client.click(link.selector), 6000);
  if (!openedTab) {
    // O link não abriu guia (só dá para saber depois do clique): restaura o estado anterior da tela, que pode
    // ter navegado a própria guia ou aberto um modal.
    await client.wait(800);
    const hrefNow = String(await client.eval('window.location.href').catch(() => '')).replace(/^"|"$/g, '');
    if (hrefNow && hrefNow !== hrefBefore) {
      await client.eval('window.history.back()').catch(() => undefined);
      await client.wait(1500);
    }
    const now = await readFingerprint(client);
    if (before && now && now.modals > before.modals) {
      await dismissTopModal(client);
      await client.wait(600);
    }
    console.log(`   [Sub-portal] O link "${link.label}" não abriu nova guia; descartado e tela restaurada.`);
    return null;
  }

  // A guia nova precisa estar carregada (readyState + conteúdo) antes de ser medida
  let loaded = false;
  for (let i = 0; i < 8 && !loaded; i++) {
    const state = await client.evalJson<{ ready: boolean; text: number }>(
      `(() => JSON.stringify({ ready: document.readyState === 'complete', text: (document.body && document.body.innerText || '').trim().length }))()`
    );
    loaded = !!state && state.ready && state.text > 0;
    if (!loaded) await client.wait(800);
  }
  if (!loaded) console.warn(`   ⚠ [Sub-portal] A guia "${openedTab.title || openedTab.url}" não terminou de carregar; seguindo mesmo assim.`);
  await client.wait(1000);
  return { label: link.label, sharedTerms: terms, triggerGeometry, triggerRawPath, tab: openedTab, candidates: found.length, withAffinity: ranked.length };
}

const triggerKey = (t: RevealTrigger) => `${t.kind}:${normalizeText(t.label)}`;

async function readTriggerBox(client: AgentBrowserClient, selector: string): Promise<BoundingBox | undefined> {
  const box = await client.evalJson<BoundingBox>(`
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      if (r.width <= 1 || r.height <= 1 || s.display === 'none' || s.visibility === 'hidden') return null;
      const x1 = Math.round(r.left), y1 = Math.round(r.top), x2 = Math.round(r.right), y2 = Math.round(r.bottom);
      if (x1 < 0 || y1 < 0 || x2 > window.innerWidth || y2 > window.innerHeight) return null;
      return JSON.stringify({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
    })()
  `);
  return box || undefined;
}

/**
 * Investiga os gatilhos reveladores seguros da tela atual em busca dos alvos ausentes.
 *
 * Em caso de sucesso, a tela fica no estado revelado (é o sub-passo real que o manual não descreve)
 * e o resultado traz o gatilho e os alvos medidos ao vivo, cada um com o seu frame. Sem sucesso, cada
 * tentativa é desfeita e o registro lista o que foi testado.
 */
export async function exploreRevealTriggers(client: AgentBrowserClient, request: RevealRequest): Promise<RevealOutcome> {
  const { step, missing, zonePolicy, rawPathFor } = request;
  const max = request.maxTriggers ?? (parseInt(process.env.ORION_REVEAL_MAX_TRIGGERS || '', 10) || DEFAULT_MAX_TRIGGERS);
  const log: RevealExplorationLog = {
    missing: [...missing],
    revealed: [],
    explored: [],
    candidates: 0,
    selectorsWithoutAffinity: 0,
    stateRestored: true
  };

  let scan = await scanTriggers(client, missing);
  if (!scan) return { log };
  const origin = scan.fingerprint;
  const catalogHints = origin.hash ? findCatalogRevealHints(origin.hash, missing) : [];
  if (catalogHints.length > 0) {
    console.log(
      `   [Exploração L2] Catálogo Nível 2 aponta ${catalogHints.length} pista(s) direta(s): ${catalogHints
        .slice(0, 4)
        .map(h => `"${h.target}" -> ${h.where}`)
        .join('; ')}.`
    );
  }
  let queue = rankTriggers(scan.triggers, missing, step.rawText, catalogHints);
  log.candidates = queue.length;
  log.selectorsWithoutAffinity = scan.triggers.length - queue.length;
  const preferred = queue.map(triggerKey);
  for (const l of scan.latent) {
    console.log(
      `   [Exploração] "${l.target}" existe oculto no DOM em ${l.hiddenIn}${l.controller ? `, sob o gatilho "${l.controller}"` : ' (sem gatilho identificável)'}.`
    );
  }
  console.log(
    `   [Exploração] ${queue.length} gatilho(s) revelador(es) seguro(s) em ${scan.scope} (${log.selectorsWithoutAffinity} seletor(es) condicional(is) sem afinidade com o alvo, descartados); até ${max} serão testados.`
  );

  const tried = new Set<string>();
  while (log.explored.length < max) {
    const trigger = queue.find(t => !tried.has(triggerKey(t)));
    if (!trigger) break;
    tried.add(triggerKey(trigger));
    const record = (outcome: ExploredTrigger['outcome'], restored?: boolean) =>
      log.explored.push({ kind: trigger.kind, label: trigger.label, directed: trigger.directed, outcome, restored });

    const triggerGeometry = await client.getDOMGeometry([trigger.selector], { scrollIntoView: true, zone: 'any' });
    if (!triggerGeometry) {
      record('not_actionable');
      continue;
    }
    const triggerRawPath = rawPathFor(`gatilho-${log.explored.length + 1}`);
    await client.screenshot(triggerRawPath);
    try {
      await client.click(trigger.selector);
    } catch {
      record('not_actionable');
      continue;
    }
    await client.wait(900);

    const screen = await client.probeScreenLoaded();
    if (screen.ok) {
      // ADR-035: o contexto de guarda do passo vale também aqui (o localizador já o limpou): `th` da grade que
      // continua visível atrás do formulário aberto por **Adicionar** nunca substitui o campo revelado
      let after = await client.getDOMGeometry(missing, {
        scrollIntoView: true,
        zone: zonePolicy,
        groupTargets: missing,
        ...deriveStepGuard(step)
      });
      if (after && isGenericContainerMatch(after)) after = null;
      const revealed = (after?.groupMembers || []).map(m => m.query).filter(q => missing.includes(q));
      const revealedSynonyms: Record<string, string[]> = {};
      const stillUnresolved = missing.filter(t => !revealed.includes(t));
      if (stillUnresolved.length > 0) {
        const afterHash =
          (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => origin.hash)) || origin.hash;
        for (const t of stillUnresolved) {
          for (const syn of routeSynonymsFor(afterHash, t)) {
            let probe = await client.getDOMGeometry(syn.real, {
              scrollIntoView: true,
              zone: zonePolicy,
              groupTargets: syn.real,
              ...deriveStepGuard(step)
            });
            if (probe && isGenericContainerMatch(probe)) probe = null;
            const foundReal = (probe?.groupMembers || []).map(m => m.query);
            if (!probe || foundReal.length !== syn.real.length) continue;
            revealed.push(t);
            revealedSynonyms[t] = syn.real;
            if (!after) {
              after = probe;
            } else {
              const existingMembers = after.groupMembers || [];
              const addedMembers = (probe.groupMembers || []).filter(
                pm => !existingMembers.some(em => em.query === pm.query)
              );
              after = {
                ...after,
                groupMembers: [...existingMembers, ...addedMembers]
              };
            }
            break;
          }
        }
      }
      if (after && revealed.length > 0) {
        const triggerBoxAfter = await readTriggerBox(client, trigger.selector);
        const revealedRawPath = rawPathFor('revelado');
        await client.screenshot(revealedRawPath);
        record('revealed');
        log.revealed = revealed;
        console.log(
          `   ⚡ [Exploração] ${trigger.kind} "${trigger.label}" revelou: ${revealed.map(r => `"${r}"`).join(', ')}.`
        );
        return {
          success: {
            trigger,
            triggerGeometry,
            triggerRawPath,
            geometry: after,
            revealedRawPath,
            revealed,
            ...(Object.keys(revealedSynonyms).length > 0 ? { revealedSynonyms } : {}),
            triggerBoxAfter
          },
          log
        };
      }
    }

    const restored = await restoreState(client, trigger, origin);
    record(screen.ok ? 'no_effect' : 'screen_error', restored);
    console.log(
      `   [Exploração] ${trigger.kind} "${trigger.label}": ${screen.ok ? 'não revelou o alvo' : `tela com erro (${screen.reason})`}; estado ${restored ? 'restaurado' : 'NÃO restaurado'}.`
    );
    if (!restored) {
      log.stateRestored = false;
      break;
    }
    // A restauração pode recriar nós: os carimbos são refeitos e a ordem preferida é mantida
    scan = await scanTriggers(client, missing);
    if (!scan) break;
    const fresh = rankTriggers(scan.triggers, missing, step.rawText, catalogHints);
    const rank = (t: RevealTrigger) => {
      const i = preferred.indexOf(triggerKey(t));
      return i === -1 ? preferred.length : i;
    };
    queue = fresh.sort((a, b) => rank(a) - rank(b));
  }

  return { log };
}
