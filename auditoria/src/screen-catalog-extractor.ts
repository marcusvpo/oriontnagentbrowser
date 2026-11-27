import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');

export const DEFAULT_MENU_CATALOG_PATH = path.join(auditoriaRoot, 'data', 'orion-menu-tree-canonical.json');
export const DEFAULT_SCREEN_CATALOG_PATH = path.join(auditoriaRoot, 'data', 'orion-screen-catalog.json');
export const DEFAULT_SCREENSHOTS_DIR = path.join(auditoriaRoot, 'mapeamento-telas', 'nivel-1');
export const DEFAULT_LEVEL2_SCREENSHOTS_DIR = path.join(auditoriaRoot, 'mapeamento-telas', 'nivel-2');

export type ScreenStatus = 'captured' | 'failed' | 'skipped';
export type ScreenOpenedAs = 'route' | 'modal' | 'new_tab' | 'external' | 'same_route' | 'unknown';

export interface ScreenTabInfo {
  label: string;
  active: boolean;
  disabled: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface ScreenAccordionInfo {
  label: string;
  expanded: boolean;
}

export interface ScreenButtonInfo {
  label: string;
  tooltip: string;
  iconClass: string;
  kind: string;
  disabled: boolean;
  isMutationLike: boolean;
}

export interface ScreenFieldInfo {
  label: string;
  type: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;
  options: string[];
  section: string;
}

export interface ScreenTableInfo {
  headers: string[];
  rowCount: number;
  isEmpty: boolean;
  emptyText: string;
  rowActionIcons: string[];
}

export interface ScreenScrollMetrics {
  scrollHeight: number;
  clientHeight: number;
  hasVerticalOverflow: boolean;
  innerScrollContainers: number;
  zoom?: number;
  effectiveClientHeight?: number;
}

export interface ScreenElementCounts {
  tabs: number;
  accordions: number;
  buttons: number;
  iconOnlyButtons: number;
  fields: number;
  tables: number;
  alerts: number;
}

export type Level2Status = 'explored' | 'no_substates' | 'partial' | 'failed';
export type SubStateKind =
  | 'tab'
  | 'nested_tab'
  | 'accordion'
  | 'advanced_filters'
  | 'form_opener'
  | 'modal_opener'
  | 'view_switcher'
  | 'search_grid_reveal';
export type SubStateOpenedAs =
  | 'tab'
  | 'nested_tab'
  | 'accordion'
  | 'modal'
  | 'sub_route'
  | 'new_tab'
  | 'view_switch'
  | 'grid_reveal'
  | 'same_route';
export type ElementWhereLocation =
  | 'root'
  | `tab:${string}`
  | `modal:${string}`
  | `modal:${string} > tab:${string}`
  | `accordion:${string}`
  | `view:${string}`
  | 'grid_row';

export interface AnnotatedButtonInfo extends ScreenButtonInfo {
  where: ElementWhereLocation;
}

export interface AnnotatedFieldInfo extends ScreenFieldInfo {
  where: ElementWhereLocation;
}

export interface AnnotatedTabInfo extends ScreenTabInfo {
  where: ElementWhereLocation;
}

export interface AnnotatedTableHeaderInfo {
  header: string;
  tableIndex: number;
  where: ElementWhereLocation;
}

export interface AnnotatedRowActionInfo {
  iconClass: string;
  tooltip: string;
  where: ElementWhereLocation;
}

export interface AllKnownElements {
  buttons: AnnotatedButtonInfo[];
  fields: AnnotatedFieldInfo[];
  tabs: AnnotatedTabInfo[];
  tableHeaders: AnnotatedTableHeaderInfo[];
  rowActions: AnnotatedRowActionInfo[];
}

export interface IconDictionaryEntry {
  iconClass: string;
  meanings: string[];
  tooltips: string[];
  observedIn: ElementWhereLocation[];
}

export interface SubStateSecurityAlert {
  timestamp: string;
  method: string;
  url: string;
  trigger: string;
  reason: string;
}

export interface ScreenSubState {
  id: string;
  kind: SubStateKind;
  triggerLabel: string;
  triggerSelector?: string;
  parentTab?: string;
  parentOpener?: string;
  openedAs: SubStateOpenedAs;
  routeHash: string;
  modalTitle?: string;
  activeTab?: string;
  fingerprint: string;
  screenshot: string | null;
  fullPageScreenshot?: string | null;
  screenshotHeight?: number;
  restoredCleanly: boolean;
  status: 'captured' | 'no_op' | 'failed' | 'blocked_security';
  error: string | null;
  buttons: ScreenButtonInfo[];
  fields: ScreenFieldInfo[];
  tabs: ScreenTabInfo[];
  accordions: ScreenAccordionInfo[];
  tables: ScreenTableInfo[];
  alerts: string[];
  revealedFieldsCount?: number;
  revealedButtonsCount?: number;
  rowCount?: number;
  rowActionIcons?: string[];
  securityAlerts?: SubStateSecurityAlert[];
  capturedAt: string;
}

export interface ScreenCatalogEntry {
  id: string;
  modulo: string;
  chain: string[];
  slug: string;
  status: ScreenStatus;
  openedAs: ScreenOpenedAs;
  routeHash: string;
  pageTitle: string;
  screenshots: {
    viewport: string | null;
    fullPage: string | null;
  };
  breadcrumbs: string[];
  headings: string[];
  tabs: ScreenTabInfo[];
  accordions: ScreenAccordionInfo[];
  buttons: ScreenButtonInfo[];
  fields: ScreenFieldInfo[];
  tables: ScreenTableInfo[];
  alerts: string[];
  scrollMetrics: ScreenScrollMetrics;
  elementCounts: ScreenElementCounts;
  capturedAt: string;
  error: string | null;
  level2Status?: Level2Status;
  level2ExploredAt?: string;
  subStates?: ScreenSubState[];
  allKnownElements?: AllKnownElements;
  iconDictionary?: Record<string, IconDictionaryEntry>;
  level2SecurityAlerts?: SubStateSecurityAlert[];
}

export interface ScreenCatalogLevel2Stats {
  explored: number;
  noSubstates: number;
  partial: number;
  failed: number;
  totalSubStates: number;
  totalSubStateScreenshots: number;
  totalUniqueKnownButtons: number;
  totalUniqueKnownFields: number;
  totalIconDictionaryEntries: number;
  securityAlertsCount: number;
  totalViewSwitchers?: number;
  totalNestedTabs?: number;
  totalGridReveals?: number;
  trueFullPagePrintsCount?: number;
}

export interface ScreenCatalogStats {
  totalCanonicalPaths: number;
  targetScreens: number;
  captured: number;
  failed: number;
  skipped: number;
  totalButtons: number;
  totalFields: number;
  totalTabs: number;
  totalTables: number;
  screensWithOverflow: number;
  screensWithTabs: number;
  screensWithEmptyTables: number;
  level2?: ScreenCatalogLevel2Stats;
}

export interface OrionScreenCatalog {
  version: '06.05.02';
  level: 1 | 2;
  capturedAt: string;
  environment: 'Produtos (homologacao interna Siplan)';
  sourceMenuCatalog: 'auditoria/data/orion-menu-tree-canonical.json';
  stats: ScreenCatalogStats;
  screens: ScreenCatalogEntry[];
}

export interface CanonicalMenuPathEntry {
  chain: string[];
  depth: number;
  isLeaf: boolean;
  parentModule?: string;
  printProof?: string;
  aliases?: string[];
}

export interface CanonicalMenuCatalogJson {
  version: string;
  capturedAt: string;
  environment: string;
  userMenuRoot?: string;
  pathCount?: number;
  paths: CanonicalMenuPathEntry[];
}

export type ScreenNavigationKind = 'cascade' | 'direct_top' | 'user_menu' | 'skipped_logout';

export interface ScreenTarget {
  id: string;
  index: number;
  modulo: string;
  chain: string[];
  depth: number;
  slug: string;
  moduloSlug: string;
  navigationKind: ScreenNavigationKind;
  skipReason?: 'logout_safety_block';
}

export interface FilterScreenTargetsOptions {
  module?: string;
  only?: string;
  max?: number;
  resumeCatalog?: OrionScreenCatalog | null;
}

export interface RawScreenDomExtraction {
  routeHash: string;
  pageTitle: string;
  openedAsModal?: boolean;
  breadcrumbs: string[];
  headings: string[];
  tabs: ScreenTabInfo[];
  accordions: ScreenAccordionInfo[];
  buttons: Array<Omit<ScreenButtonInfo, 'isMutationLike'> & { isMutationLike?: boolean }>;
  fields: ScreenFieldInfo[];
  tables: ScreenTableInfo[];
  alerts: string[];
  scrollMetrics: ScreenScrollMetrics;
}

function normalizeText(raw: string | null | undefined): string {
  return String(raw ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Converte um rótulo/caminho em slug seguro para nomes de arquivo e URLs.
 */
export function slugify(text: string): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Formata o ID sequencial da tela ("001".."115").
 */
export function buildScreenEntryId(index: number): string {
  const safe = Number.isFinite(index) ? Math.max(1, Math.floor(index)) : 1;
  return String(safe).padStart(3, '0');
}

const MUTATION_KEYWORDS = [
  'salvar',
  'gravar',
  'confirmar',
  'concluir',
  'excluir',
  'deletar',
  'remover',
  'inativar',
  'ativar',
  'cancelar',
  'estornar',
  'aprovar',
  'reprovar',
  'finalizar',
  'emitir',
  'assinar',
  'enviar',
  'gerar',
  'cadastrar',
  'alterar',
  'editar',
  'atualizar',
  'redefinir',
  'resetar',
  'desabilitar',
  'habilitar',
  'bloquear',
  'desbloquear',
  'vincular',
  'desvincular',
  'adicionar',
  'incluir',
  'criar',
  'importar',
  'restaurar',
  'aplicar',
  'novo',
  'nova',
  'save',
  'delete',
  'remove',
  'submit'
];

const MUTATION_WORD_REGEX = new RegExp(`\\b(?:${MUTATION_KEYWORDS.join('|')})\\b`, 'i');

const READONLY_EXCLUSION_REGEX =
  /\b(?:pesquisar|buscar|filtrar|consultar|limpar|visualizar|detalhes|imprimir|exportar|fechar|voltar|sair|ajuda|pdf|excel|csv)\b/i;

const MUTATION_ICON_REGEX = /\b(?:fa-trash|fa-trash-o|fa-save|fa-floppy-o|fa-remove|fa-times-circle|glyphicon-trash|glyphicon-floppy-disk)\b/i;

/**
 * Determina se um botão/ação aparenta realizar mutação de dados (gravação, exclusão, alteração, etc.).
 */
export function isMutationLike(label: string, tooltip = '', iconClass = ''): boolean {
  const normLabel = normalizeText(label);
  const normTooltip = normalizeText(tooltip);
  const combined = `${normLabel} ${normTooltip}`.trim();

  if (combined) {
    if (MUTATION_WORD_REGEX.test(combined)) {
      return true;
    }
    if (READONLY_EXCLUSION_REGEX.test(combined)) {
      return false;
    }
  }

  return MUTATION_ICON_REGEX.test(String(iconClass ?? ''));
}

/**
 * Carrega o catálogo canônico de menus (115 caminhos).
 */
export function loadCanonicalMenuCatalog(filePath = DEFAULT_MENU_CATALOG_PATH): CanonicalMenuCatalogJson {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as CanonicalMenuCatalogJson;
}

function isUserMenuChain(chain: string[], userMenuRoot = 'Olá, [usuário]'): boolean {
  if (!chain.length) return false;
  const first = normalizeText(chain[0]);
  const root = normalizeText(userMenuRoot);
  return first === root || /^ola,\s*/.test(first);
}

/**
 * Prepara os alvos de mapeamento Nível 1 a partir do catálogo canônico:
 * - 109 caminhos com profundidade >= 2 (navegação em cascata)
 * - 1 caminho com profundidade 1 ("Históricos", clique direto)
 * - 4 caminhos do menu do usuário ("Olá, [usuário]")
 * - 1 bloqueio hardcoded para "Sair" marcado como skipped / "logout_safety_block"
 */
export function prepareScreenTargets(catalog: CanonicalMenuCatalogJson): ScreenTarget[] {
  const userMenuRoot = catalog.userMenuRoot || 'Olá, [usuário]';
  const paths = Array.isArray(catalog.paths) ? catalog.paths : [];

  return paths.map((entry, idx) => {
    const index = idx + 1;
    const id = buildScreenEntryId(index);
    const chain = Array.isArray(entry.chain) ? entry.chain.map(s => String(s)) : [];
    const modulo = entry.parentModule || chain[0] || 'Geral';
    const moduloSlug = slugify(modulo) || 'geral';
    const slug = slugify(chain.join(' ')) || `tela-${id}`;
    const depth = entry.depth ?? chain.length;

    const inUserMenu = isUserMenuChain(chain, userMenuRoot);
    const isLogout = inUserMenu && normalizeText(chain[chain.length - 1]) === 'sair';

    let navigationKind: ScreenNavigationKind = 'cascade';
    let skipReason: 'logout_safety_block' | undefined;

    if (isLogout) {
      navigationKind = 'skipped_logout';
      skipReason = 'logout_safety_block';
    } else if (inUserMenu) {
      navigationKind = 'user_menu';
    } else if (depth === 1) {
      navigationKind = 'direct_top';
    }

    return {
      id,
      index,
      modulo,
      chain,
      depth,
      slug,
      moduloSlug,
      navigationKind,
      ...(skipReason ? { skipReason } : {})
    };
  });
}

/**
 * Aplica filtros de CLI (--module, --only, --resume, --max) sobre a lista de alvos.
 */
export function filterScreenTargets(targets: ScreenTarget[], opts: FilterScreenTargetsOptions = {}): ScreenTarget[] {
  let result = targets.slice();

  if (opts.module) {
    const targetMod = normalizeText(opts.module);
    const targetModSlug = slugify(opts.module);
    result = result.filter(
      t => normalizeText(t.modulo) === targetMod || t.moduloSlug === targetModSlug || normalizeText(t.modulo).includes(targetMod)
    );
  }

  if (opts.only) {
    const rawOnly = opts.only.trim();
    const onlyNum = /^\d+$/.test(rawOnly) ? parseInt(rawOnly, 10) : null;
    const onlySlug = slugify(rawOnly);
    result = result.filter(t => {
      if (onlyNum !== null && (t.index === onlyNum || t.id === buildScreenEntryId(onlyNum))) {
        return true;
      }
      return t.slug === onlySlug || t.slug.includes(onlySlug) || t.id === rawOnly;
    });
  }

  if (opts.resumeCatalog) {
    const capturedIds = new Set(
      opts.resumeCatalog.screens.filter(s => s.status === 'captured').map(s => s.id)
    );
    result = result.filter(t => !capturedIds.has(t.id));
  }

  if (typeof opts.max === 'number' && Number.isFinite(opts.max) && opts.max > 0) {
    result = result.slice(0, Math.floor(opts.max));
  }

  return result;
}

/**
 * Calcula estatísticas agregadas do catálogo de telas.
 */
export function computeCatalogStats(screens: ScreenCatalogEntry[], totalCanonicalPaths?: number): ScreenCatalogStats {
  const captured = screens.filter(s => s.status === 'captured').length;
  const failed = screens.filter(s => s.status === 'failed').length;
  const skipped = screens.filter(s => s.status === 'skipped').length;

  let totalButtons = 0;
  let totalFields = 0;
  let totalTabs = 0;
  let totalTables = 0;
  let screensWithOverflow = 0;
  let screensWithTabs = 0;
  let screensWithEmptyTables = 0;

  for (const s of screens) {
    totalButtons += s.elementCounts?.buttons ?? s.buttons?.length ?? 0;
    totalFields += s.elementCounts?.fields ?? s.fields?.length ?? 0;
    totalTabs += s.elementCounts?.tabs ?? s.tabs?.length ?? 0;
    totalTables += s.elementCounts?.tables ?? s.tables?.length ?? 0;
    if (s.scrollMetrics?.hasVerticalOverflow) screensWithOverflow++;
    if ((s.tabs?.length ?? 0) > 0) screensWithTabs++;
    if ((s.tables ?? []).some(t => t.isEmpty)) screensWithEmptyTables++;
  }

  const hasLevel2 = screens.some(s => s.level2Status !== undefined);
  let level2Stats: ScreenCatalogLevel2Stats | undefined;
  if (hasLevel2) {
    let explored = 0;
    let noSubstates = 0;
    let partial = 0;
    let l2Failed = 0;
    let totalSubStates = 0;
    let totalSubStateScreenshots = 0;
    let totalUniqueKnownButtons = 0;
    let totalUniqueKnownFields = 0;
    let totalIconDictionaryEntries = 0;
    let securityAlertsCount = 0;
    let totalViewSwitchers = 0;
    let totalNestedTabs = 0;
    let totalGridReveals = 0;
    let trueFullPagePrintsCount = 0;

    for (const s of screens) {
      if (s.level2Status === 'explored') explored++;
      else if (s.level2Status === 'no_substates') noSubstates++;
      else if (s.level2Status === 'partial') partial++;
      else if (s.level2Status === 'failed') l2Failed++;

      if (s.screenshots?.fullPage) trueFullPagePrintsCount++;

      const subs = s.subStates ?? [];
      totalSubStates += subs.length;
      totalSubStateScreenshots += subs.filter(st => Boolean(st.screenshot)).length;
      totalUniqueKnownButtons += s.allKnownElements?.buttons.length ?? 0;
      totalUniqueKnownFields += s.allKnownElements?.fields.length ?? 0;
      totalIconDictionaryEntries += Object.keys(s.iconDictionary ?? {}).length;
      securityAlertsCount += (s.level2SecurityAlerts?.length ?? 0) + subs.reduce((acc, st) => acc + (st.securityAlerts?.length ?? 0), 0);

      for (const st of subs) {
        if (st.status === 'captured') {
          if (st.kind === 'view_switcher') totalViewSwitchers++;
          else if (st.kind === 'nested_tab') totalNestedTabs++;
          else if (st.kind === 'search_grid_reveal') totalGridReveals++;
        }
        if (st.fullPageScreenshot || (st.screenshotHeight && st.screenshotHeight > 910)) {
          trueFullPagePrintsCount++;
        }
      }
    }

    level2Stats = {
      explored,
      noSubstates,
      partial,
      failed: l2Failed,
      totalSubStates,
      totalSubStateScreenshots,
      totalUniqueKnownButtons,
      totalUniqueKnownFields,
      totalIconDictionaryEntries,
      securityAlertsCount,
      ...(totalViewSwitchers > 0 ? { totalViewSwitchers } : {}),
      ...(totalNestedTabs > 0 ? { totalNestedTabs } : {}),
      ...(totalGridReveals > 0 ? { totalGridReveals } : {}),
      ...(trueFullPagePrintsCount > 0 ? { trueFullPagePrintsCount } : {})
    };
  }

  return {
    totalCanonicalPaths: totalCanonicalPaths ?? screens.length,
    targetScreens: screens.filter(s => s.status !== 'skipped').length,
    captured,
    failed,
    skipped,
    totalButtons,
    totalFields,
    totalTabs,
    totalTables,
    screensWithOverflow,
    screensWithTabs,
    screensWithEmptyTables,
    ...(level2Stats ? { level2: level2Stats } : {})
  };
}

/**
 * Constrói o script JS autônomo para `eval --stdin` que extrai os metadados da tela ativa
 * ignorando menus/navegação global (`NAV_ZONE_SELECTOR`, `.navbar`, `header`, rodapé global)
 * e focando exclusivamente na área de conteúdo ou modal ativo, limitando `<select>` a 30 opções.
 */
export function buildScreenDomExtractionScript(
  navZoneSelector = NAV_ZONE_SELECTOR,
  activeModalSelector = ACTIVE_MODAL_SELECTOR
): string {
  // Remove .nav-tabs and [role="tablist"] from the exclusion selector for tab detection,
  // while keeping full NAV_ZONE_SELECTOR + header/footer for buttons/fields/tables/headings.
  const globalChromeSelector = `${navZoneSelector}, .navbar, header, footer, .footer, .rodape`;

  return `
    (() => {
      const GLOBAL_IGNORE_SEL = ${JSON.stringify(globalChromeSelector)};
      const MODAL_SEL = ${JSON.stringify(activeModalSelector)};

      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && !e.closest('.ng-hide');
      };

      const activeModals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      const modalRoot = activeModals.length > 0 ? activeModals[activeModals.length - 1] : null;
      const contentRoot =
        modalRoot ||
        document.querySelector('#content, main, [role="main"], .main-content, .content-wrapper, .page-content') ||
        document.body;

      const isGlobalChrome = el => {
        if (!el || !el.closest) return false;
        if (modalRoot && el.closest(MODAL_SEL) === modalRoot) {
          return !!el.closest('.navbar, header, footer, .footer, .rodape');
        }
        return !!el.closest(GLOBAL_IGNORE_SEL);
      };

      const isInsideRoot = el => contentRoot === document.body || contentRoot.contains(el);

      const breadcrumbs = [];
      const bcSeen = new Set();
      for (const bc of Array.from(document.querySelectorAll('.breadcrumb li, .breadcrumb a, [aria-label="breadcrumb"] li, [aria-label="breadcrumb"] a'))) {
        if (!vis(bc)) continue;
        const txt = clean(bc.innerText || bc.textContent);
        if (txt && !bcSeen.has(txt)) {
          bcSeen.add(txt);
          breadcrumbs.push(txt);
        }
      }

      const headings = [];
      const hSeen = new Set();
      for (const h of Array.from(contentRoot.querySelectorAll('h1, h2, h3, h4, .page-header, .panel-title, .modal-title'))) {
        if (!vis(h) || isGlobalChrome(h)) continue;
        const txt = clean(h.innerText || h.textContent);
        if (txt && !hSeen.has(txt)) {
          hSeen.add(txt);
          headings.push(txt);
        }
      }

      const tabs = [];
      const tabSeen = new Set();
      const tabSelectors = [
        '.nav-tabs',
        '[role="tablist"]',
        'ul.nav-pills',
        'ul.nav.nav-stacked',
        '.nav-wizard',
        '.wizard-steps',
        '.steps',
        'ul.list-group'
      ].join(', ');
      for (const tabContainer of Array.from(contentRoot.querySelectorAll(tabSelectors))) {
        if (!vis(tabContainer)) continue;
        if (tabContainer.closest('.navbar, header, footer, .footer, .rodape, .sidebar, .menu-lateral, .bg-menu-lateral')) continue;
        const isListGroup = tabContainer.classList.contains('list-group');
        const rawItems = isListGroup
          ? Array.from(tabContainer.querySelectorAll(':scope > a.list-group-item, :scope > button.list-group-item, :scope > li.list-group-item'))
          : Array.from(tabContainer.querySelectorAll(':scope > li, :scope > [role="tab"], :scope > .mat-tab-label'));
        const visItems = rawItems.filter(vis);
        if (isListGroup && visItems.length < 2) continue;
        if (isListGroup) {
          const hasInteractive = visItems.every(it => it.tagName === 'A' || it.tagName === 'BUTTON' || !!it.querySelector('a, button') || it.hasAttribute('ng-click'));
          if (!hasInteractive) continue;
        }
        let orientation = 'horizontal';
        if (visItems.length >= 2) {
          const r0 = visItems[0].getBoundingClientRect();
          const r1 = visItems[1].getBoundingClientRect();
          if (r1.top > r0.top + Math.max(10, r0.height * 0.6) && Math.abs(r1.left - r0.left) < 40) {
            orientation = 'vertical';
          }
        }
        for (const item of visItems) {
          const link = item.querySelector('a, button') || item;
          const label = clean(link.innerText || link.textContent || item.getAttribute('aria-label'));
          if (!label || tabSeen.has(label)) continue;
          tabSeen.add(label);
          const cls = String(item.className || '') + ' ' + String(link.className || '');
          const active = /\\bactive\\b/i.test(cls) || item.getAttribute('aria-selected') === 'true' || link.getAttribute('aria-selected') === 'true';
          const disabled = /\\bdisabled\\b/i.test(cls) || item.getAttribute('aria-disabled') === 'true' || !!link.disabled;
          tabs.push({ label, active, disabled, orientation });
        }
      }
      // Abas Angular customizadas fora de containers padrão
      for (const customTab of Array.from(contentRoot.querySelectorAll('[role="tab"], .mat-tab-label, button[ng-click*="aba" i], a[ng-click*="aba" i], button[ng-click*="tab" i], a[ng-click*="tab" i]'))) {
        if (!vis(customTab) || customTab.closest('.navbar, header, footer, .footer, .rodape, .sidebar, .menu-lateral, .bg-menu-lateral')) continue;
        if (customTab.closest('.nav-tabs, [role="tablist"], ul.nav-pills, ul.nav-stacked, .nav-wizard, .wizard-steps, .steps, ul.list-group')) continue;
        const label = clean(customTab.innerText || customTab.textContent || customTab.getAttribute('aria-label'));
        if (!label || tabSeen.has(label)) continue;
        tabSeen.add(label);
        const cls = String(customTab.className || '');
        const active = /\\bactive\\b/i.test(cls) || customTab.getAttribute('aria-selected') === 'true';
        const disabled = /\\bdisabled\\b/i.test(cls) || customTab.getAttribute('aria-disabled') === 'true' || !!customTab.disabled;
        tabs.push({ label, active, disabled, orientation: 'horizontal' });
      }

      const accordions = [];
      const accSeen = new Set();
      for (const acc of Array.from(contentRoot.querySelectorAll('.panel-heading [data-toggle="collapse"], .accordion-toggle, [aria-expanded]'))) {
        if (!vis(acc) || isGlobalChrome(acc)) continue;
        const label = clean(acc.innerText || acc.textContent || acc.getAttribute('aria-label'));
        if (!label || accSeen.has(label)) continue;
        accSeen.add(label);
        const expanded = acc.getAttribute('aria-expanded') === 'true' || !/\\bcollapsed\\b/i.test(String(acc.className || ''));
        accordions.push({ label, expanded });
      }

      const buttons = [];
      for (const btn of Array.from(contentRoot.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]'))) {
        if (!vis(btn) || !isInsideRoot(btn) || isGlobalChrome(btn)) continue;
        const tag = btn.tagName.toLowerCase();
        const label = clean(tag === 'input' ? (btn.value || btn.getAttribute('value')) : (btn.innerText || btn.textContent));
        const tooltip = clean(btn.getAttribute('title') || btn.getAttribute('data-original-title') || btn.getAttribute('aria-label'));
        const iconEl = btn.querySelector('i, span.glyphicon, span.fa, svg');
        const iconClass = iconEl ? clean(iconEl.getAttribute('class') || '') : '';
        const typeAttr = clean(btn.getAttribute('type') || '');
        const kind = tag === 'a' ? 'link-button' : (typeAttr || tag);
        const disabled =
          !!btn.disabled ||
          btn.getAttribute('aria-disabled') === 'true' ||
          /\\bdisabled\\b/i.test(String(btn.className || '')) ||
          !!btn.closest('fieldset[disabled]');
        buttons.push({ label, tooltip, iconClass, kind, disabled });
      }

      const findSection = el => {
        const panel = el.closest('.panel, fieldset, .card, .tab-pane, section');
        if (!panel) return '';
        const head = panel.querySelector(':scope > .panel-heading, :scope > legend, :scope > .card-header, :scope > h2, :scope > h3, :scope > h4');
        return head ? clean(head.innerText || head.textContent) : '';
      };

      const findFieldLabel = el => {
        if (el.id) {
          const lbl = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
          if (lbl && !isGlobalChrome(lbl)) {
            const t = clean(lbl.innerText || lbl.textContent).replace(/\\s*\\*\\s*$/, '');
            if (t) return t;
          }
        }
        const parentLabel = el.closest('label');
        if (parentLabel && !isGlobalChrome(parentLabel)) {
          const clone = parentLabel.cloneNode(true);
          clone.querySelectorAll('input, select, textarea').forEach(n => n.remove());
          const t = clean(clone.innerText || clone.textContent).replace(/\\s*\\*\\s*$/, '');
          if (t) return t;
        }
        const formGroup = el.closest('.form-group, .form-field, .input-group, td, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-6, .col-md-8, .col-md-12');
        if (formGroup) {
          const lbl = formGroup.querySelector('label, .control-label');
          if (lbl && !isGlobalChrome(lbl)) {
            const t = clean(lbl.innerText || lbl.textContent).replace(/\\s*\\*\\s*$/, '');
            if (t) return t;
          }
        }
        return clean(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '');
      };

      const fields = [];
      for (const el of Array.from(contentRoot.querySelectorAll('input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]), select, textarea'))) {
        if (!vis(el) || !isInsideRoot(el) || isGlobalChrome(el)) continue;
        const tag = el.tagName.toLowerCase();
        const type = tag === 'select' ? 'select' : tag === 'textarea' ? 'textarea' : clean(el.getAttribute('type') || 'text');
        const label = findFieldLabel(el);
        const placeholder = clean(el.getAttribute('placeholder') || '');
        const required = !!el.required || el.getAttribute('aria-required') === 'true' || /\\*/.test(label);
        const disabled = !!el.disabled || el.getAttribute('aria-disabled') === 'true' || !!el.closest('fieldset[disabled]');
        const readonly = !!el.readOnly || el.hasAttribute('readonly');
        const options = tag === 'select'
          ? Array.from(el.options || []).slice(0, 30).map(o => clean(o.textContent || o.label || o.value)).filter(Boolean)
          : [];
        const section = findSection(el);
        fields.push({ label, type, required, disabled, readonly, placeholder, options, section });
      }

      const tables = [];
      for (const tbl of Array.from(contentRoot.querySelectorAll('table'))) {
        if (!vis(tbl) || !isInsideRoot(tbl) || isGlobalChrome(tbl)) continue;
        let headers = Array.from(tbl.querySelectorAll('thead th')).map(th => clean(th.innerText || th.textContent)).filter(Boolean);
        if (headers.length === 0) {
          const firstRow = tbl.querySelector('tr');
          if (firstRow) {
            headers = Array.from(firstRow.querySelectorAll('th')).map(th => clean(th.innerText || th.textContent)).filter(Boolean);
          }
        }
        const bodyRows = Array.from(tbl.querySelectorAll('tbody tr')).filter(vis);
        let emptyText = '';
        let dataRowCount = 0;
        const iconSet = new Set();

        for (const tr of bodyRows) {
          const tds = Array.from(tr.querySelectorAll('td'));
          const rowText = clean(tr.innerText || tr.textContent);
          const isEmptyPlaceholder =
            tds.length === 1 &&
            (tds[0].hasAttribute('colspan') || /nenhum|sem registro|nao ha|vazio|empty/i.test(rowText));
          if (isEmptyPlaceholder) {
            if (!emptyText) emptyText = rowText;
            continue;
          }
          dataRowCount++;
          for (const act of Array.from(tr.querySelectorAll('button, a'))) {
            const ic = act.querySelector('i, span.fa, span.glyphicon');
            const icCls = ic ? clean(ic.getAttribute('class') || '') : '';
            const ttl = clean(act.getAttribute('title') || act.getAttribute('aria-label') || '');
            const token = icCls || ttl;
            if (token) iconSet.add(token);
          }
        }

        const isEmpty = dataRowCount === 0;
        if (isEmpty && !emptyText) {
          const emptySibling = tbl.parentElement ? tbl.parentElement.querySelector('.empty-state, .no-records, .alert-info') : null;
          if (emptySibling && vis(emptySibling)) emptyText = clean(emptySibling.innerText || emptySibling.textContent);
        }

        tables.push({
          headers,
          rowCount: dataRowCount,
          isEmpty,
          emptyText,
          rowActionIcons: Array.from(iconSet)
        });
      }

      const alerts = [];
      const alertSeen = new Set();
      for (const al of Array.from(contentRoot.querySelectorAll('.alert, .toast, [role="alert"], .callout'))) {
        if (!vis(al) || isGlobalChrome(al)) continue;
        const txt = clean(al.innerText || al.textContent);
        if (txt && !alertSeen.has(txt)) {
          alertSeen.add(txt);
          alerts.push(txt);
        }
      }

      const docEl = document.documentElement;
      const zoom = parseFloat((docEl ? window.getComputedStyle(docEl).zoom : '1') || '1') || 1;
      const scrollHeight = Math.max(docEl ? docEl.scrollHeight : 0, document.body ? document.body.scrollHeight : 0);
      const clientHeight = docEl ? docEl.clientHeight : window.innerHeight || 0;
      const effectiveClientHeight = Math.round(clientHeight / zoom);
      let innerScrollContainers = 0;
      for (const el of Array.from(contentRoot.querySelectorAll('*'))) {
        if (!vis(el) || isGlobalChrome(el)) continue;
        const st = window.getComputedStyle(el);
        if ((st.overflowY === 'auto' || st.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 40) {
          innerScrollContainers++;
        }
      }

      let preferredTitle = '';
      for (const el of Array.from(contentRoot.querySelectorAll('h1, h2, .panel-title, .card-title, .page-title'))) {
        if (!vis(el) || isGlobalChrome(el)) continue;
        const txt = clean(el.innerText || el.textContent);
        if (txt) {
          preferredTitle = txt;
          break;
        }
      }
      const pageTitle = preferredTitle || headings[0] || clean(document.title || '');

      return JSON.stringify({
        routeHash: window.location.hash || '',
        pageTitle,
        openedAsModal: !!modalRoot,
        breadcrumbs,
        headings,
        tabs,
        accordions,
        buttons,
        fields,
        tables,
        alerts,
        scrollMetrics: {
          scrollHeight,
          clientHeight,
          zoom,
          effectiveClientHeight,
          hasVerticalOverflow: scrollHeight > effectiveClientHeight + 60 || innerScrollContainers > 0,
          innerScrollContainers
        }
      });
    })()
  `;
}

/**
 * Normaliza a extração bruta do DOM em uma entrada `ScreenCatalogEntry`.
 */
export function normalizeExtractedScreen(
  target: ScreenTarget,
  raw: RawScreenDomExtraction,
  opts: {
    openedAs: ScreenOpenedAs;
    screenshots: { viewport: string | null; fullPage: string | null };
    capturedAt?: string;
  }
): ScreenCatalogEntry {
  const buttons: ScreenButtonInfo[] = (raw.buttons ?? []).map(b => ({
    label: b.label || '',
    tooltip: b.tooltip || '',
    iconClass: b.iconClass || '',
    kind: b.kind || 'button',
    disabled: Boolean(b.disabled),
    isMutationLike:
      typeof b.isMutationLike === 'boolean'
        ? b.isMutationLike
        : isMutationLike(b.label || '', b.tooltip || '', b.iconClass || '')
  }));

  const tabs = raw.tabs ?? [];
  const accordions = raw.accordions ?? [];
  const fields = (raw.fields ?? []).map(f => ({
    ...f,
    options: Array.isArray(f.options) ? f.options.slice(0, 30) : []
  }));
  const tables = raw.tables ?? [];
  const alerts = raw.alerts ?? [];

  const iconOnlyButtons = buttons.filter(b => !b.label.trim()).length;

  return {
    id: target.id,
    modulo: target.modulo,
    chain: target.chain,
    slug: target.slug,
    status: 'captured',
    openedAs: opts.openedAs,
    routeHash: raw.routeHash || '',
    pageTitle: raw.pageTitle || '',
    screenshots: opts.screenshots,
    breadcrumbs: raw.breadcrumbs ?? [],
    headings: raw.headings ?? [],
    tabs,
    accordions,
    buttons,
    fields,
    tables,
    alerts,
    scrollMetrics: raw.scrollMetrics ?? {
      scrollHeight: 0,
      clientHeight: 0,
      hasVerticalOverflow: false,
      innerScrollContainers: 0
    },
    elementCounts: {
      tabs: tabs.length,
      accordions: accordions.length,
      buttons: buttons.length,
      iconOnlyButtons,
      fields: fields.length,
      tables: tables.length,
      alerts: alerts.length
    },
    capturedAt: opts.capturedAt || new Date().toISOString(),
    error: null
  };
}

function emptyScreenEntryBase(target: ScreenTarget, capturedAt: string): Omit<ScreenCatalogEntry, 'status' | 'openedAs' | 'error'> {
  return {
    id: target.id,
    modulo: target.modulo,
    chain: target.chain,
    slug: target.slug,
    routeHash: '',
    pageTitle: '',
    screenshots: { viewport: null, fullPage: null },
    breadcrumbs: [],
    headings: [],
    tabs: [],
    accordions: [],
    buttons: [],
    fields: [],
    tables: [],
    alerts: [],
    scrollMetrics: {
      scrollHeight: 0,
      clientHeight: 0,
      hasVerticalOverflow: false,
      innerScrollContainers: 0
    },
    elementCounts: {
      tabs: 0,
      accordions: 0,
      buttons: 0,
      iconOnlyButtons: 0,
      fields: 0,
      tables: 0,
      alerts: 0
    },
    capturedAt
  };
}

/**
 * Constrói uma entrada `skipped` (ex.: bloqueio de segurança para "Sair").
 */
export function buildSkippedScreenEntry(
  target: ScreenTarget,
  reason = target.skipReason || 'logout_safety_block',
  capturedAt = new Date().toISOString()
): ScreenCatalogEntry {
  return {
    ...emptyScreenEntryBase(target, capturedAt),
    status: 'skipped',
    openedAs: 'unknown',
    error: reason
  };
}

/**
 * Constrói uma entrada `failed` preservando eventuais evidências parciais.
 */
export function buildFailedScreenEntry(
  target: ScreenTarget,
  error: string,
  opts: {
    routeHash?: string;
    pageTitle?: string;
    openedAs?: ScreenOpenedAs;
    screenshots?: { viewport: string | null; fullPage: string | null };
    capturedAt?: string;
  } = {}
): ScreenCatalogEntry {
  const capturedAt = opts.capturedAt || new Date().toISOString();
  return {
    ...emptyScreenEntryBase(target, capturedAt),
    status: 'failed',
    openedAs: opts.openedAs || 'unknown',
    routeHash: opts.routeHash || '',
    pageTitle: opts.pageTitle || '',
    screenshots: opts.screenshots || { viewport: null, fullPage: null },
    error
  };
}

/**
 * Mescla entradas novas/atualizadas com um catálogo existente, ordenando por ID.
 */
export function mergeCatalogEntries(existing: ScreenCatalogEntry[], updates: ScreenCatalogEntry[]): ScreenCatalogEntry[] {
  const byId = new Map<string, ScreenCatalogEntry>();
  for (const item of existing) byId.set(item.id, item);
  for (const item of updates) byId.set(item.id, item);
  return Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Calcula um fingerprint determinístico de estado de tela para deduplicação de sub-estados (Nível 2).
 * Combina hash da rota + título de modal + aba ativa + lista ordenada de rótulos de campos e botões.
 */
export function computeStateFingerprint(input: {
  routeHash?: string;
  modalTitle?: string;
  activeTab?: string;
  fields?: Array<{ label: string; type?: string }>;
  buttons?: Array<{ label: string; tooltip?: string }>;
  tables?: Array<{ headers: string[]; rowCount: number }>;
}): string {
  const hash = normalizeText(input.routeHash || '');
  const modal = normalizeText(input.modalTitle || '');
  const tab = normalizeText(input.activeTab || '');
  const fieldLabels = (input.fields ?? [])
    .map(f => `${normalizeText(f.label)}:${normalizeText(f.type || '')}`)
    .filter(Boolean)
    .sort();
  const btnLabels = (input.buttons ?? [])
    .map(b => normalizeText(b.label || b.tooltip || ''))
    .filter(Boolean)
    .sort();
  const tableSig = (input.tables ?? [])
    .map(t => `${t.headers.map(h => normalizeText(h)).join(',')}[${t.rowCount}]`)
    .sort();

  return [
    `h=${hash}`,
    `m=${modal}`,
    `t=${tab}`,
    `f=${fieldLabels.join('|')}`,
    `b=${btnLabels.join('|')}`,
    `tb=${tableSig.join('|')}`
  ].join(';;');
}

export function getSubStateWhereLocation(sub: ScreenSubState): ElementWhereLocation {
  if (sub.kind === 'nested_tab') {
    const opener = sub.parentOpener || sub.parentTab || 'Formulário';
    return `modal:${opener} > tab:${sub.triggerLabel}`;
  }
  if (sub.kind === 'tab') return `tab:${sub.triggerLabel}`;
  if (sub.kind === 'accordion' || sub.kind === 'advanced_filters') return `accordion:${sub.triggerLabel}`;
  if (sub.kind === 'form_opener' || sub.kind === 'modal_opener') return `modal:${sub.triggerLabel}`;
  if (sub.kind === 'view_switcher') return `view:${sub.triggerLabel}`;
  return 'grid_row';
}

function extractIconTokens(iconClass: string): string[] {
  const tokens = String(iconClass || '')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => /^(?:fa-|glyphicon-|halflings-)/i.test(t) && !/^fa-(?:fw|lg|2x|3x|4x|5x|spin|pulse)$/i.test(t));
  return Array.from(new Set(tokens));
}

/**
 * Constrói a união deduplicada de todos os elementos conhecidos (root + subStates),
 * anotando cada item com `where: 'root' | 'tab:...' | 'modal:...' | 'accordion:...' | 'grid_row'`.
 */
export function buildAllKnownElements(entry: ScreenCatalogEntry, subStates: ScreenSubState[]): AllKnownElements {
  const buttons: AnnotatedButtonInfo[] = [];
  const btnSeen = new Set<string>();
  const fields: AnnotatedFieldInfo[] = [];
  const fieldSeen = new Set<string>();
  const tabs: AnnotatedTabInfo[] = [];
  const tabSeen = new Set<string>();
  const tableHeaders: AnnotatedTableHeaderInfo[] = [];
  const headerSeen = new Set<string>();
  const rowActions: AnnotatedRowActionInfo[] = [];
  const rowActSeen = new Set<string>();

  const addScope = (
    where: ElementWhereLocation,
    scope: {
      buttons?: ScreenButtonInfo[];
      fields?: ScreenFieldInfo[];
      tabs?: ScreenTabInfo[];
      tables?: ScreenTableInfo[];
      rowActionIcons?: string[];
    }
  ) => {
    for (const b of scope.buttons ?? []) {
      const key = `${where}::${normalizeText(b.label)}::${normalizeText(b.tooltip)}::${normalizeText(b.iconClass)}`;
      if (btnSeen.has(key)) continue;
      btnSeen.add(key);
      buttons.push({ ...b, where });
    }
    for (const f of scope.fields ?? []) {
      const key = `${where}::${normalizeText(f.label)}::${normalizeText(f.type)}::${normalizeText(f.section)}`;
      if (fieldSeen.has(key)) continue;
      fieldSeen.add(key);
      fields.push({ ...f, where });
    }
    for (const t of scope.tabs ?? []) {
      const key = `${where}::${normalizeText(t.label)}`;
      if (tabSeen.has(key)) continue;
      tabSeen.add(key);
      tabs.push({ ...t, where });
    }
    (scope.tables ?? []).forEach((tbl, tblIdx) => {
      for (const h of tbl.headers ?? []) {
        const key = `${where}::${tblIdx}::${normalizeText(h)}`;
        if (headerSeen.has(key)) continue;
        headerSeen.add(key);
        tableHeaders.push({ header: h, tableIndex: tblIdx, where });
      }
      for (const ic of tbl.rowActionIcons ?? []) {
        const rowWhere: ElementWhereLocation = where === 'root' ? 'grid_row' : where;
        const key = `${rowWhere}::${normalizeText(ic)}`;
        if (rowActSeen.has(key)) continue;
        rowActSeen.add(key);
        rowActions.push({ iconClass: ic, tooltip: '', where: rowWhere });
      }
    });
    for (const ic of scope.rowActionIcons ?? []) {
      const key = `${where}::${normalizeText(ic)}`;
      if (rowActSeen.has(key)) continue;
      rowActSeen.add(key);
      rowActions.push({ iconClass: ic, tooltip: '', where });
    }
  };

  addScope('root', entry);
  for (const sub of subStates) {
    if (sub.status !== 'captured') continue;
    addScope(getSubStateWhereLocation(sub), sub);
  }

  return { buttons, fields, tabs, tableHeaders, rowActions };
}

/**
 * Consolida o dicionário de ícones (`fa-*` / `glyphicon-*`) observados na tela e seus sub-estados.
 */
export function buildIconDictionary(
  entry: ScreenCatalogEntry,
  subStates: ScreenSubState[]
): Record<string, IconDictionaryEntry> {
  const dict: Record<string, IconDictionaryEntry> = {};

  const record = (iconClassRaw: string, meaning: string, tooltip: string, where: ElementWhereLocation) => {
    const tokens = extractIconTokens(iconClassRaw);
    for (const token of tokens) {
      if (!dict[token]) {
        dict[token] = {
          iconClass: token,
          meanings: [],
          tooltips: [],
          observedIn: []
        };
      }
      const item = dict[token];
      if (meaning && !item.meanings.includes(meaning)) item.meanings.push(meaning);
      if (tooltip && !item.tooltips.includes(tooltip)) item.tooltips.push(tooltip);
      if (!item.observedIn.includes(where)) item.observedIn.push(where);
    }
  };

  const scanScope = (
    where: ElementWhereLocation,
    buttons: ScreenButtonInfo[],
    tables: ScreenTableInfo[]
  ) => {
    for (const b of buttons) {
      if (!b.iconClass) continue;
      const meaning = b.label || b.tooltip || '';
      record(b.iconClass, meaning, b.tooltip || '', where);
    }
    for (const tbl of tables) {
      for (const ic of tbl.rowActionIcons ?? []) {
        record(ic, '', '', where === 'root' ? 'grid_row' : where);
      }
    }
  };

  scanScope('root', entry.buttons ?? [], entry.tables ?? []);
  for (const sub of subStates) {
    if (sub.status !== 'captured') continue;
    scanScope(getSubStateWhereLocation(sub), sub.buttons ?? [], sub.tables ?? []);
  }

  return dict;
}

/**
 * Enriquece uma entrada `ScreenCatalogEntry` com os dados de Nível 2.
 */
export function enrichScreenWithLevel2(
  entry: ScreenCatalogEntry,
  opts: {
    level2Status: Level2Status;
    subStates: ScreenSubState[];
    securityAlerts?: SubStateSecurityAlert[];
    exploredAt?: string;
  }
): ScreenCatalogEntry {
  const subStates = opts.subStates ?? [];
  const allKnownElements = buildAllKnownElements(entry, subStates);
  const iconDictionary = buildIconDictionary(entry, subStates);
  const result: ScreenCatalogEntry = {
    ...entry,
    level2Status: opts.level2Status,
    level2ExploredAt: opts.exploredAt || new Date().toISOString(),
    subStates,
    allKnownElements,
    iconDictionary
  };
  if (opts.securityAlerts && opts.securityAlerts.length > 0) {
    result.level2SecurityAlerts = opts.securityAlerts;
  } else {
    delete result.level2SecurityAlerts;
  }
  return result;
}

/**
 * Monta o documento final `OrionScreenCatalog` com estatísticas recalculadas.
 */
export function buildOrionScreenCatalog(
  screens: ScreenCatalogEntry[],
  opts: { totalCanonicalPaths?: number; capturedAt?: string; level?: 1 | 2 } = {}
): OrionScreenCatalog {
  const ordered = screens.slice().sort((a, b) => a.id.localeCompare(b.id));
  const detectedLevel: 1 | 2 = opts.level ?? (ordered.some(s => s.level2Status !== undefined) ? 2 : 1);
  return {
    version: '06.05.02',
    level: detectedLevel,
    capturedAt: opts.capturedAt || new Date().toISOString(),
    environment: 'Produtos (homologacao interna Siplan)',
    sourceMenuCatalog: 'auditoria/data/orion-menu-tree-canonical.json',
    stats: computeCatalogStats(ordered, opts.totalCanonicalPaths),
    screens: ordered
  };
}
