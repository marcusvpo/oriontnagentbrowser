/**
 * Resolvedor de Ações Icônicas em Grades (ADR-020).
 *
 * Botões de linha do Orion TN (olho, lápis, X) são ícones sem texto visível; o nome real vive no
 * atributo `title` (`Consultar`, `Alterar`, `Excluir`) e difere do manual (`Visualizar`, `Editar`,
 * `Remover`). Este módulo lê a 1ª linha de dados da grade ao vivo, extrai rótulo e semântica de ícone de
 * cada ação, casa com os alvos do manual e devolve a geometria medida (multi-demarcação).
 *
 * Regras: nunca clica nem dá hover para casar; o clique só existe como `actionTarget` quando o passo
 * cita UMA ação (nunca em lista de opções — ADR-016). Tudo vem de medição ao vivo (ADR-012/014).
 */
import { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { buildCalloutsFromGroup, normalizeText } from './smart-locator.js';
import type { BoundingBox, DOMActionNode, DOMResolvedGeometry, SmartLocatorDivergence } from './types.js';

export type GridActionKind = 'consultar' | 'alterar' | 'excluir';

/** Dicionário canônico Orion TN: termo do manual ↔ nome real do botão de linha. */
export const GRID_ACTION_GROUPS: Record<GridActionKind, string[]> = {
  consultar: ['consultar', 'visualizar', 'exibir', 'ver', 'detalhar', 'detalhes', 'abrir'],
  alterar: ['alterar', 'editar', 'modificar'],
  excluir: ['excluir', 'remover', 'apagar', 'deletar']
};

/** Classes de ícone (glyphicons / halflings / fontawesome) → semântica da ação. */
const ICON_KIND_PATTERNS: Array<[GridActionKind, RegExp]> = [
  ['consultar', /(^|[-_\s])(eye|eye-open|search|zoom-in)([-_\s]|$)/],
  ['alterar', /(^|[-_\s])(pencil|edit|pencil-square|create)([-_\s]|$)/],
  ['excluir', /(^|[-_\s])(remove|remove-sign|remove-circle|trash|times|bin|delete)([-_\s]|$)/]
];

export function actionKindOfTerm(term: string): GridActionKind | null {
  const n = normalizeText(term);
  for (const kind of Object.keys(GRID_ACTION_GROUPS) as GridActionKind[]) {
    if (GRID_ACTION_GROUPS[kind].includes(n)) return kind;
  }
  return null;
}

/** O alvo do manual é um nome de ação de linha de grade (Visualizar, Editar, Remover...)? */
export function looksLikeGridAction(term: string): boolean {
  return actionKindOfTerm(term) !== null;
}

interface RawGridAction {
  n: number;
  selector: string;
  tag: string;
  label: string;
  source: 'title' | 'data-original-title' | 'aria-label' | 'alt' | 'text' | 'icon-class';
  classes: string;
  box: BoundingBox;
}

interface RawGridScan {
  rowCount: number;
  firstRowText: string;
  actions: RawGridAction[];
}

export interface GridActionMatch {
  /** Alvo como citado no manual */
  target: string;
  /** Nome real da ação na tela (title/aria/texto, ou o nome canônico quando só há a classe do ícone) */
  realLabel: string;
  kind: GridActionKind | null;
  /** `label`: nome real igual ao alvo; `synonym`: sinônimo canônico; `icon-class`: só a semântica do ícone */
  via: 'label' | 'synonym' | 'icon-class';
  source: RawGridAction['source'];
  selector: string;
  box: BoundingBox;
}

export interface GridActionResolution {
  geometry: DOMResolvedGeometry;
  matches: GridActionMatch[];
  /** Alvos do manual sem ícone correspondente na 1ª linha */
  unmatched: string[];
  /** Todas as ações reais da linha (para o relatório) */
  rowActions: Array<{ label: string; kind: GridActionKind | null; source: string }>;
  firstRowText: string;
  divergences: SmartLocatorDivergence[];
}

export type GridScanOutcome =
  | { status: 'resolved'; resolution: GridActionResolution }
  | { status: 'empty-grid' }
  | { status: 'no-actions' };

/** Script de varredura (eval --stdin): 1ª linha de dados da grade e as ações icônicas dela. */
export function buildGridActionScript(token: string): string {
  return `
(() => {
  const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const modal = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"]')).find(vis);
  const scope = modal || document;
  const rows = Array.from(scope.querySelectorAll('table tbody tr, [role="row"]'))
    .filter(vis).filter(r => !r.closest(NAV) && r.querySelector('td, [role="gridcell"]') && !r.querySelector('th'));
  if (rows.length === 0) return JSON.stringify({ rowCount: 0, firstRowText: '', actions: [] });
  const ICON = 'a, button, [role="button"], em, i, span[class*="glyphicon"], span[class*="halflings"], span[class*="fa-"]';
  const clsOf = e => String((e.className && e.className.baseVal !== undefined) ? e.className.baseVal : e.className || '');
  let chosen = null, units = [];
  for (const row of rows) {
    const found = [];
    for (const el of Array.from(row.querySelectorAll(ICON)).filter(vis)) {
      const unit = el.closest('a, button, [role="button"]') && row.contains(el.closest('a, button, [role="button"]')) ? el.closest('a, button, [role="button"]') : el;
      if (found.includes(unit)) continue;
      const hasText = (unit.innerText || '').trim().length > 0;
      const iconish = /glyphicon|halflings|fa-|fa |icon/.test(clsOf(unit) + ' ' + Array.from(unit.querySelectorAll('*')).map(clsOf).join(' ')) || unit.querySelector('em, i, span[class*="glyphicon"]');
      const labelled = unit.getAttribute('title') || unit.getAttribute('aria-label') || unit.getAttribute('data-original-title');
      if (!iconish && !labelled) continue;
      found.push(unit);
    }
    if (found.length > 0) { chosen = row; units = found; break; }
  }
  if (!chosen) return JSON.stringify({ rowCount: rows.length, firstRowText: (rows[0].innerText || '').trim().slice(0, 80), actions: [] });
  const actions = units.map((u, n) => {
    const inner = u.querySelector('[title], [data-original-title], [aria-label], [alt]');
    const pick = [
      ['title', u.getAttribute('title')], ['data-original-title', u.getAttribute('data-original-title')],
      ['aria-label', u.getAttribute('aria-label')], ['alt', u.getAttribute('alt')],
      ['title', inner && inner.getAttribute('title')], ['data-original-title', inner && inner.getAttribute('data-original-title')],
      ['aria-label', inner && inner.getAttribute('aria-label')], ['text', (u.innerText || '').trim()]
    ].find(p => p[1] && String(p[1]).trim());
    const stamp = 'data-orion-audit-icon-${token}-' + n;
    u.setAttribute(stamp, '1');
    const r = u.getBoundingClientRect();
    const classes = (clsOf(u) + ' ' + Array.from(u.querySelectorAll('*')).map(clsOf).join(' ')).toLowerCase();
    return { n, selector: '[' + stamp + ']', tag: u.tagName.toLowerCase(), label: pick ? String(pick[1]).trim().slice(0, 60) : '', source: pick ? pick[0] : 'icon-class', classes, box: { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) } };
  });
  return JSON.stringify({ rowCount: rows.length, firstRowText: (chosen.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 80), actions });
})()`;
}

function kindFromClasses(classes: string): GridActionKind | null {
  const tokens = classes.split(/\s+/).filter(Boolean);
  for (const [kind, rx] of ICON_KIND_PATTERNS) {
    if (tokens.some(t => rx.test(t))) return kind;
  }
  return null;
}

const canonicalName = (kind: GridActionKind) => kind.charAt(0).toUpperCase() + kind.slice(1);

/**
 * Lê a 1ª linha da grade e casa cada alvo do manual com uma ação real. Devolve `null` se o passo não
 * pede nenhuma ação de grade. Não clica e não faz hover.
 */
export async function resolveGridActions(
  client: AgentBrowserClient,
  stepNumber: number,
  targets: string[],
  options: { allowActionTarget: boolean }
): Promise<GridScanOutcome | null> {
  const wanted = targets.filter(looksLikeGridAction);
  if (wanted.length === 0) return null;

  const token = Math.random().toString(36).slice(2, 10);
  const scan = await client.evalJson<RawGridScan>(buildGridActionScript(token));
  if (!scan || scan.rowCount === 0) return { status: 'empty-grid' };
  if (scan.actions.length === 0) return { status: 'no-actions' };

  const real = scan.actions.map(a => {
    const kind = (a.label ? actionKindOfTerm(a.label) : null) ?? kindFromClasses(a.classes);
    const label = a.label || (kind ? canonicalName(kind) : '');
    return { ...a, kind, label };
  });

  const matches: GridActionMatch[] = [];
  const unmatched: string[] = [];
  const used = new Set<number>();
  for (const target of wanted) {
    const norm = normalizeText(target);
    const kind = actionKindOfTerm(target)!;
    // Evidência decrescente: nome real igual → sinônimo canônico no nome real → semântica do ícone
    let hit =
      real.find(a => !used.has(a.n) && a.source !== 'icon-class' && normalizeText(a.label) === norm) ?? null;
    let via: GridActionMatch['via'] = 'label';
    if (!hit) {
      hit = real.find(a => !used.has(a.n) && a.source !== 'icon-class' && a.kind === kind) ?? null;
      via = 'synonym';
    }
    if (!hit) {
      hit = real.find(a => !used.has(a.n) && a.source === 'icon-class' && a.kind === kind) ?? null;
      via = 'icon-class';
    }
    if (!hit || !hit.label) {
      unmatched.push(target);
      continue;
    }
    used.add(hit.n);
    matches.push({
      target,
      realLabel: hit.label,
      kind,
      via,
      source: hit.source,
      selector: hit.selector,
      box: hit.box
    });
  }
  if (matches.length === 0) return { status: 'no-actions' };

  // Medição final pelo caminho único de geometria (ADR-012): os carimbos viram os alvos do grupo
  const ordered = matches.map(m => m.selector);
  const geometry = await client.getDOMGeometry(ordered, {
    scrollIntoView: true,
    zone: 'content',
    groupTargets: ordered
  });
  if (!geometry || !geometry.groupMembers || geometry.groupMembers.length === 0) return { status: 'no-actions' };

  // Troca o seletor pelo nome real da ação e reconstrói a multi-demarcação (1, 2, 3...)
  for (const member of geometry.groupMembers) {
    const m = matches.find(x => x.selector === member.query);
    if (m) member.query = m.realLabel;
  }
  geometry.callouts = buildCalloutsFromGroup(geometry);

  // Ação: só quando o passo cita UMA ação (nunca em lista de opções — ADR-016)
  if (options.allowActionTarget && matches.length === 1) {
    const node = await client.probeActionNode(matches[0].selector);
    if (node) geometry.actionTarget = { clickSelector: matches[0].selector, click: node as DOMActionNode };
  } else {
    delete geometry.actionTarget;
  }

  const divergences: SmartLocatorDivergence[] = [];
  for (const m of matches) {
    if (normalizeText(m.target) === normalizeText(m.realLabel)) continue;
    divergences.push({
      stepNumber,
      documentedTarget: m.target,
      actualElementText: m.realLabel,
      actualRole: 'icon-action',
      resolutionLayer: 'dom_synonym_heuristic',
      confidence: m.via === 'synonym' ? 0.92 : 0.8,
      reason:
        m.via === 'icon-class'
          ? `botão de ícone da primeira linha da grade, identificado só pela classe do ícone (sem nome no DOM)`
          : `botão de ícone da primeira linha da grade, nome real lido do atributo ${m.source} em x=${m.box.x}, y=${m.box.y}, ${m.box.width}x${m.box.height}`,
      detectedAt: new Date().toISOString()
    });
  }

  return {
    status: 'resolved',
    resolution: {
      geometry,
      matches,
      unmatched,
      rowActions: real.map(a => ({ label: a.label, kind: a.kind, source: a.source })),
      firstRowText: scan.firstRowText,
      divergences
    }
  };
}
