import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';

export interface ScreenTabEntry {
  label: string;
  active?: boolean;
  disabled?: boolean;
}

export interface ScreenAccordionEntry {
  label: string;
  expanded?: boolean;
}

export interface ScreenButtonEntry {
  label: string;
  tooltip?: string;
  iconClass?: string;
  kind?: string;
  disabled?: boolean;
  isMutationLike?: boolean;
}

export interface ScreenFieldEntry {
  label: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  options?: string[];
  section?: string;
}

export interface ScreenTableEntry {
  headers: string[];
  rowCount: number;
  isEmpty: boolean;
  emptyText?: string;
  rowActionIcons?: string[];
}

export interface ScreenScrollMetrics {
  scrollHeight: number;
  clientHeight: number;
  hasVerticalOverflow: boolean;
  innerScrollContainers?: number;
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

export interface AnnotatedButtonInfo extends ScreenButtonEntry {
  where: ElementWhereLocation;
}

export interface AnnotatedFieldInfo extends ScreenFieldEntry {
  where: ElementWhereLocation;
}

export interface AnnotatedTabInfo extends ScreenTabEntry {
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
  buttons: ScreenButtonEntry[];
  fields: ScreenFieldEntry[];
  tabs: ScreenTabEntry[];
  accordions: ScreenAccordionEntry[];
  tables: ScreenTableEntry[];
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
  status: 'captured' | 'failed' | 'skipped' | string;
  openedAs: 'route' | 'modal' | 'new_tab' | 'external' | 'same_route' | 'unknown' | string;
  routeHash: string;
  pageTitle: string;
  screenshots: {
    viewport: string | null;
    fullPage: string | null;
  };
  breadcrumbs: string[];
  headings: string[];
  tabs: ScreenTabEntry[];
  accordions: ScreenAccordionEntry[];
  buttons: ScreenButtonEntry[];
  fields: ScreenFieldEntry[];
  tables: ScreenTableEntry[];
  alerts: string[];
  scrollMetrics: ScreenScrollMetrics;
  elementCounts: ScreenElementCounts;
  capturedAt?: string;
  error?: string | null;
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

export interface OrionScreenCatalogStats {
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
  version: string;
  level: number;
  capturedAt: string;
  environment: string;
  sourceMenuCatalog: string;
  stats: OrionScreenCatalogStats;
  screens: ScreenCatalogEntry[];
}

export interface KbRoutineRecord {
  id: string;
  modulo: string;
  filePath: string;
  boldTerms: string[];
}

export interface SurfaceTermOccurrence {
  rawTerm: string;
  normalizedTerm: string;
  kind: 'menu' | 'title' | 'heading' | 'tab' | 'accordion' | 'button' | 'tooltip' | 'field' | 'column';
  screenId: string;
  chain: string[];
  modulo: string;
  where?: ElementWhereLocation | 'menu';
}

export interface LiteralTermMatch {
  term: string;
  normalizedTerm: string;
  routineCount: number;
  occurrenceCount: number;
  sampleRoutineIds: string[];
  surfaceMatches: SurfaceTermOccurrence[];
}

export interface SimilarTermMatch {
  term: string;
  normalizedTerm: string;
  routineCount: number;
  occurrenceCount: number;
  sampleRoutineIds: string[];
  bestCandidate: SurfaceTermOccurrence;
  similarity: number;
}

export interface UnmatchedTermEntry {
  term: string;
  normalizedTerm: string;
  routineCount: number;
  occurrenceCount: number;
  sampleRoutineIds: string[];
}

export interface RescuedTermMatch extends LiteralTermMatch {
  whereLocations: ElementWhereLocation[];
  whereCategories: Array<'tab' | 'accordion' | 'modal' | 'view_switch' | 'grid_row' | 'root'>;
}

export interface CrossReferenceV2Analysis {
  level1: CrossReferenceAnalysis;
  level2: CrossReferenceAnalysis;
  rescuedLiteralFromUnmatched: RescuedTermMatch[];
  rescuedSimilarFromUnmatched: SimilarTermMatch[];
  upgradedSimilarToLiteral: RescuedTermMatch[];
  rescuedByCategory: {
    tab: number;
    accordion: number;
    modal: number;
    view_switch: number;
    grid_row: number;
    root: number;
  };
  goldUnmatchedTerms: UnmatchedTermEntry[];
}

export interface ConsolidatedIconEntry {
  iconClass: string;
  meanings: string[];
  tooltips: string[];
  screens: Array<{ screenId: string; chain: string[]; observedIn: ElementWhereLocation[] }>;
}

export interface Level2CandidateScreen {
  screenId: string;
  modulo: string;
  chain: string[];
  slug: string;
  routeHash: string;
  priorityScore: number;
  reasons: string[];
  tabsCount: number;
  accordionsCount: number;
  triggerButtons: string[];
  emptyTablesCount: number;
}

export interface CrossReferenceAnalysis {
  totalRoutines: number;
  totalBoldOccurrences: number;
  uniqueBoldTerms: number;
  uniqueSurfaceTerms: number;
  similarityThreshold: number;
  literalMatches: LiteralTermMatch[];
  similarMatches: SimilarTermMatch[];
  unmatchedTerms: UnmatchedTermEntry[];
  level2Candidates: Level2CandidateScreen[];
}

const DEFAULT_SIMILARITY_THRESHOLD = 0.65;
const LEVEL2_TRIGGER_BUTTON_RE = /\b(novo|nova|adicionar|incluir|filtros?|pesquisar)\b/i;

/**
 * Extrai todos os termos em negrito (`**...**`) de um conteúdo markdown, ignorando o frontmatter YAML.
 */
export function extractBoldTermsFromMarkdown(markdown: string): string[] {
  const withoutFrontmatter = stripYamlFrontmatter(markdown);
  const terms: string[] = [];
  const regex = /\*\*([^*\r\n]+?)\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(withoutFrontmatter)) !== null) {
    const cleaned = match[1].replace(/\s+/g, ' ').trim();
    if (cleaned.length > 0) {
      terms.push(cleaned);
    }
  }
  return terms;
}

function stripYamlFrontmatter(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return normalized;
  }
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) {
    return normalized;
  }
  return normalized.slice(endIdx + 5);
}

/**
 * Faz o parse de um arquivo de rotina da base `kb/`, extraindo `id`, `modulo` e termos em negrito.
 */
export function parseKbRoutineFile(filePath: string, content: string): KbRoutineRecord {
  const normalized = content.replace(/\r\n/g, '\n');
  let id = path.basename(filePath, '.md');
  let modulo = path.basename(path.dirname(filePath));

  if (normalized.startsWith('---\n')) {
    const endIdx = normalized.indexOf('\n---\n', 4);
    if (endIdx !== -1) {
      const yamlBlock = normalized.slice(4, endIdx);
      try {
        const parsed = yaml.parse(yamlBlock) as Record<string, unknown> | null;
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.id === 'string' && parsed.id.trim()) {
            id = parsed.id.trim();
          }
          if (typeof parsed.modulo === 'string' && parsed.modulo.trim()) {
            modulo = parsed.modulo.trim();
          }
        }
      } catch {
        // Mantém fallback por caminho de arquivo caso o frontmatter esteja malformado
      }
    }
  }

  return {
    id,
    modulo,
    filePath,
    boldTerms: extractBoldTermsFromMarkdown(content)
  };
}

/**
 * Lê recursivamente todas as rotinas de `kb/`, ignorando `_indice.md`, `_glossario.md`, `_contexto.md` e `README.md`.
 */
export function loadKbRoutines(kbDir: string): KbRoutineRecord[] {
  if (!fs.existsSync(kbDir)) {
    return [];
  }
  const files: string[] = [];

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) {
        continue;
      }
      const lower = entry.name.toLowerCase();
      if (lower.startsWith('_') || lower === 'readme.md') {
        continue;
      }
      files.push(fullPath);
    }
  };

  walk(kbDir);
  return files.map(filePath => parseKbRoutineFile(filePath, fs.readFileSync(filePath, 'utf-8')));
}

/**
 * Coleta os termos reais da superfície mapeada no catálogo Nível 1.
 */
export function collectSurfaceTerms(catalog: OrionScreenCatalog): SurfaceTermOccurrence[] {
  const out: SurfaceTermOccurrence[] = [];

  const pushTerm = (
    raw: string | undefined | null,
    kind: SurfaceTermOccurrence['kind'],
    screen: ScreenCatalogEntry,
    where: ElementWhereLocation | 'menu' = 'root'
  ) => {
    const cleaned = String(raw ?? '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    const norm = normalizeText(cleaned);
    if (!norm) return;
    out.push({
      rawTerm: cleaned,
      normalizedTerm: norm,
      kind,
      screenId: screen.id,
      chain: screen.chain,
      modulo: screen.modulo,
      where
    });
  };

  for (const screen of catalog.screens) {
    for (const segment of screen.chain ?? []) {
      pushTerm(segment, 'menu', screen, 'menu');
    }
    if (screen.status !== 'captured') {
      continue;
    }
    pushTerm(screen.pageTitle, 'title', screen, 'root');
    for (const h of screen.headings ?? []) {
      pushTerm(h, 'heading', screen, 'root');
    }
    for (const t of screen.tabs ?? []) {
      pushTerm(t.label, 'tab', screen, 'root');
    }
    for (const a of screen.accordions ?? []) {
      pushTerm(a.label, 'accordion', screen, 'root');
    }
    for (const b of screen.buttons ?? []) {
      pushTerm(b.label, 'button', screen, 'root');
      pushTerm(b.tooltip, 'tooltip', screen, 'root');
    }
    for (const f of screen.fields ?? []) {
      pushTerm(f.label, 'field', screen, 'root');
      pushTerm(f.placeholder, 'field', screen, 'root');
    }
    for (const tbl of screen.tables ?? []) {
      for (const col of tbl.headers ?? []) {
        pushTerm(col, 'column', screen, 'root');
      }
    }
  }

  return out;
}

function resolveSubStateWhere(sub: ScreenSubState): ElementWhereLocation {
  if (sub.kind === 'nested_tab') {
    const opener = sub.parentOpener || sub.parentTab || 'Formulário';
    return `modal:${opener} > tab:${sub.triggerLabel}`;
  }
  if (sub.kind === 'tab') return `tab:${sub.triggerLabel}`;
  if (sub.kind === 'accordion' || sub.kind === 'advanced_filters') return `accordion:${sub.triggerLabel}`;
  if (sub.kind === 'form_opener' || sub.kind === 'modal_opener') return `modal:${sub.triggerLabel}`;
  if (sub.kind === 'view_switcher') return `view:${sub.triggerLabel}`;
  if (sub.kind === 'search_grid_reveal') return 'grid_row';
  return 'root';
}

/**
 * Coleta todos os termos conhecidos no catálogo Nível 2 (superfície + subStates + allKnownElements + iconDictionary).
 */
export function collectLevel2Terms(catalog: OrionScreenCatalog): SurfaceTermOccurrence[] {
  const out: SurfaceTermOccurrence[] = [];
  const seen = new Set<string>();

  const pushTerm = (
    raw: string | undefined | null,
    kind: SurfaceTermOccurrence['kind'],
    screen: ScreenCatalogEntry,
    where: ElementWhereLocation | 'menu'
  ) => {
    const cleaned = String(raw ?? '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    const norm = normalizeText(cleaned);
    if (!norm) return;
    const dedupeKey = `${screen.id}|${kind}|${where}|${norm}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    out.push({
      rawTerm: cleaned,
      normalizedTerm: norm,
      kind,
      screenId: screen.id,
      chain: screen.chain,
      modulo: screen.modulo,
      where
    });
  };

  for (const occ of collectSurfaceTerms(catalog)) {
    pushTerm(occ.rawTerm, occ.kind, {
      id: occ.screenId,
      chain: occ.chain,
      modulo: occ.modulo
    } as ScreenCatalogEntry, occ.where ?? 'root');
  }

  for (const screen of catalog.screens) {
    if (screen.status !== 'captured') continue;

    if (screen.allKnownElements) {
      for (const b of screen.allKnownElements.buttons ?? []) {
        pushTerm(b.label, 'button', screen, b.where ?? 'root');
        pushTerm(b.tooltip, 'tooltip', screen, b.where ?? 'root');
      }
      for (const f of screen.allKnownElements.fields ?? []) {
        pushTerm(f.label, 'field', screen, f.where ?? 'root');
        pushTerm(f.placeholder, 'field', screen, f.where ?? 'root');
      }
      for (const t of screen.allKnownElements.tabs ?? []) {
        pushTerm(t.label, 'tab', screen, t.where ?? 'root');
      }
      for (const h of screen.allKnownElements.tableHeaders ?? []) {
        pushTerm(h.header, 'column', screen, h.where ?? 'root');
      }
      for (const r of screen.allKnownElements.rowActions ?? []) {
        pushTerm(r.tooltip, 'tooltip', screen, r.where ?? 'grid_row');
      }
    }

    for (const sub of screen.subStates ?? []) {
      if (sub.status !== 'captured') continue;
      const where = resolveSubStateWhere(sub);
      pushTerm(sub.modalTitle, 'title', screen, where);
      for (const t of sub.tabs ?? []) {
        pushTerm(t.label, 'tab', screen, where);
      }
      for (const a of sub.accordions ?? []) {
        pushTerm(a.label, 'accordion', screen, where);
      }
      for (const b of sub.buttons ?? []) {
        pushTerm(b.label, 'button', screen, where);
        pushTerm(b.tooltip, 'tooltip', screen, where);
      }
      for (const f of sub.fields ?? []) {
        pushTerm(f.label, 'field', screen, where);
        pushTerm(f.placeholder, 'field', screen, where);
      }
      for (const tbl of sub.tables ?? []) {
        for (const col of tbl.headers ?? []) {
          pushTerm(col, 'column', screen, where);
        }
      }
    }

    if (screen.iconDictionary) {
      for (const entry of Object.values(screen.iconDictionary)) {
        const where = entry.observedIn?.[0] ?? 'root';
        for (const m of entry.meanings ?? []) {
          pushTerm(m, 'tooltip', screen, where);
        }
        for (const t of entry.tooltips ?? []) {
          pushTerm(t, 'tooltip', screen, where);
        }
      }
    }
  }

  return out;
}

/**
 * Identifica e prioriza telas candidatas ao mapeamento Nível 2 (interação com abas, accordions e modais).
 */
export function identifyLevel2CandidateScreens(catalog: OrionScreenCatalog): Level2CandidateScreen[] {
  const candidates: Level2CandidateScreen[] = [];

  for (const screen of catalog.screens) {
    if (screen.status !== 'captured') {
      continue;
    }

    const tabsCount = (screen.tabs ?? []).length;
    const accordionsCount = (screen.accordions ?? []).length;
    const triggerButtons: string[] = [];
    for (const btn of screen.buttons ?? []) {
      const candidateText = [btn.label, btn.tooltip].filter(Boolean).join(' ').trim();
      if (!candidateText) continue;
      if (LEVEL2_TRIGGER_BUTTON_RE.test(normalizeText(candidateText))) {
        triggerButtons.push(btn.label?.trim() || btn.tooltip?.trim() || candidateText);
      }
    }
    const uniqueTriggerButtons = Array.from(new Set(triggerButtons));
    const emptyTablesCount = (screen.tables ?? []).filter(t => t.isEmpty).length;

    const reasons: string[] = [];
    if (tabsCount > 0) reasons.push(`${tabsCount} aba(s)`);
    if (accordionsCount > 0) reasons.push(`${accordionsCount} accordion(s)`);
    if (uniqueTriggerButtons.length > 0) reasons.push(`botões: ${uniqueTriggerButtons.join(', ')}`);
    if (emptyTablesCount > 0) reasons.push(`${emptyTablesCount} tabela(s) vazia(s)`);

    if (reasons.length === 0) {
      continue;
    }

    const priorityScore =
      tabsCount * 3 +
      accordionsCount * 3 +
      uniqueTriggerButtons.length * 2 +
      emptyTablesCount * 2;

    candidates.push({
      screenId: screen.id,
      modulo: screen.modulo,
      chain: screen.chain,
      slug: screen.slug,
      routeHash: screen.routeHash,
      priorityScore,
      reasons,
      tabsCount,
      accordionsCount,
      triggerButtons: uniqueTriggerButtons,
      emptyTablesCount
    });
  }

  candidates.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    return a.screenId.localeCompare(b.screenId);
  });

  return candidates;
}

function runCrossReference(
  catalog: OrionScreenCatalog,
  routines: KbRoutineRecord[],
  surfaceOccurrences: SurfaceTermOccurrence[],
  options: { similarityThreshold?: number } = {}
): CrossReferenceAnalysis {
  const similarityThreshold = options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;

  const surfaceByNorm = new Map<string, SurfaceTermOccurrence[]>();
  for (const occ of surfaceOccurrences) {
    const list = surfaceByNorm.get(occ.normalizedTerm) ?? [];
    list.push(occ);
    surfaceByNorm.set(occ.normalizedTerm, list);
  }
  const uniqueSurfaceRepresentatives = Array.from(surfaceByNorm.values()).map(list => list[0]);

  interface TermBucket {
    displayCounts: Map<string, number>;
    routineIds: Set<string>;
    occurrenceCount: number;
  }

  const termBuckets = new Map<string, TermBucket>();
  let totalBoldOccurrences = 0;

  for (const routine of routines) {
    for (const rawTerm of routine.boldTerms) {
      const norm = normalizeText(rawTerm);
      if (!norm) continue;
      totalBoldOccurrences++;

      let bucket = termBuckets.get(norm);
      if (!bucket) {
        bucket = {
          displayCounts: new Map<string, number>(),
          routineIds: new Set<string>(),
          occurrenceCount: 0
        };
        termBuckets.set(norm, bucket);
      }
      bucket.occurrenceCount++;
      bucket.routineIds.add(routine.id);
      bucket.displayCounts.set(rawTerm, (bucket.displayCounts.get(rawTerm) ?? 0) + 1);
    }
  }

  const pickDisplayTerm = (bucket: TermBucket): string => {
    let best = '';
    let bestCount = -1;
    for (const [term, count] of bucket.displayCounts.entries()) {
      if (count > bestCount) {
        best = term;
        bestCount = count;
      }
    }
    return best;
  };

  const literalMatches: LiteralTermMatch[] = [];
  const similarMatches: SimilarTermMatch[] = [];
  const unmatchedTerms: UnmatchedTermEntry[] = [];

  for (const [norm, bucket] of termBuckets.entries()) {
    const displayTerm = pickDisplayTerm(bucket);
    const sampleRoutineIds = Array.from(bucket.routineIds).sort().slice(0, 8);
    const routineCount = bucket.routineIds.size;

    const exact = surfaceByNorm.get(norm);
    if (exact && exact.length > 0) {
      literalMatches.push({
        term: displayTerm,
        normalizedTerm: norm,
        routineCount,
        occurrenceCount: bucket.occurrenceCount,
        sampleRoutineIds,
        surfaceMatches: exact
      });
      continue;
    }

    let bestCandidate: SurfaceTermOccurrence | null = null;
    let bestScore = 0;
    for (const rep of uniqueSurfaceRepresentatives) {
      const score = computeDiceSimilarity(norm, rep.normalizedTerm);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = rep;
      }
    }

    if (bestCandidate && bestScore >= similarityThreshold) {
      similarMatches.push({
        term: displayTerm,
        normalizedTerm: norm,
        routineCount,
        occurrenceCount: bucket.occurrenceCount,
        sampleRoutineIds,
        bestCandidate,
        similarity: Number(bestScore.toFixed(4))
      });
    } else {
      unmatchedTerms.push({
        term: displayTerm,
        normalizedTerm: norm,
        routineCount,
        occurrenceCount: bucket.occurrenceCount,
        sampleRoutineIds
      });
    }
  }

  literalMatches.sort((a, b) => b.occurrenceCount - a.occurrenceCount || b.routineCount - a.routineCount || a.term.localeCompare(b.term));
  similarMatches.sort((a, b) => b.occurrenceCount - a.occurrenceCount || b.similarity - a.similarity || a.term.localeCompare(b.term));
  unmatchedTerms.sort((a, b) => b.occurrenceCount - a.occurrenceCount || b.routineCount - a.routineCount || a.term.localeCompare(b.term));

  return {
    totalRoutines: routines.length,
    totalBoldOccurrences,
    uniqueBoldTerms: termBuckets.size,
    uniqueSurfaceTerms: surfaceByNorm.size,
    similarityThreshold,
    literalMatches,
    similarMatches,
    unmatchedTerms,
    level2Candidates: identifyLevel2CandidateScreens(catalog)
  };
}

/**
 * Executa o cruzamento editorial entre os termos em negrito das rotinas `kb/` e a superfície mapeada Nível 1.
 */
export function analyzeEditorialCrossReference(
  catalog: OrionScreenCatalog,
  routines: KbRoutineRecord[],
  options: { similarityThreshold?: number } = {}
): CrossReferenceAnalysis {
  return runCrossReference(catalog, routines, collectSurfaceTerms(catalog), options);
}

function categorizeWhereLocation(
  where: ElementWhereLocation | 'menu' | undefined
): 'tab' | 'accordion' | 'modal' | 'view_switch' | 'grid_row' | 'root' {
  if (!where || where === 'root' || where === 'menu') return 'root';
  if (where.startsWith('tab:')) return 'tab';
  if (where.startsWith('accordion:')) return 'accordion';
  if (where.startsWith('modal:')) return 'modal';
  if (where.startsWith('view:')) return 'view_switch';
  if (where === 'grid_row') return 'grid_row';
  return 'root';
}

function toRescuedTermMatch(match: LiteralTermMatch): RescuedTermMatch {
  const whereLocations = Array.from(
    new Set(
      match.surfaceMatches
        .map(s => s.where)
        .filter((w): w is ElementWhereLocation => Boolean(w && w !== 'menu'))
    )
  );
  const whereCategories = Array.from(new Set(whereLocations.map(w => categorizeWhereLocation(w))));
  return {
    ...match,
    whereLocations,
    whereCategories
  };
}

/**
 * Compara o cruzamento editorial Nível 1 (superfície) vs Nível 2/2.5 (superfície + sub-estados).
 */
export function analyzeEditorialCrossReferenceV2(
  catalog: OrionScreenCatalog,
  routines: KbRoutineRecord[],
  options: { similarityThreshold?: number } = {}
): CrossReferenceV2Analysis {
  const level1 = analyzeEditorialCrossReference(catalog, routines, options);
  const level2 = runCrossReference(catalog, routines, collectLevel2Terms(catalog), options);

  const l1UnmatchedNorms = new Set(level1.unmatchedTerms.map(u => u.normalizedTerm));
  const l1SimilarNorms = new Set(level1.similarMatches.map(s => s.normalizedTerm));

  const rescuedLiteralFromUnmatched = level2.literalMatches
    .filter(m => l1UnmatchedNorms.has(m.normalizedTerm))
    .map(toRescuedTermMatch);

  const rescuedSimilarFromUnmatched = level2.similarMatches.filter(m => l1UnmatchedNorms.has(m.normalizedTerm));

  const upgradedSimilarToLiteral = level2.literalMatches
    .filter(m => l1SimilarNorms.has(m.normalizedTerm))
    .map(toRescuedTermMatch);

  const rescuedByCategory = {
    tab: 0,
    accordion: 0,
    modal: 0,
    view_switch: 0,
    grid_row: 0,
    root: 0
  };
  for (const item of rescuedLiteralFromUnmatched) {
    for (const cat of item.whereCategories) {
      rescuedByCategory[cat]++;
    }
  }

  return {
    level1,
    level2,
    rescuedLiteralFromUnmatched,
    rescuedSimilarFromUnmatched,
    upgradedSimilarToLiteral,
    rescuedByCategory,
    goldUnmatchedTerms: level2.unmatchedTerms
  };
}

/**
 * Consolida o iconDictionary de todas as telas mapeadas no catálogo.
 */
export function collectConsolidatedIconDictionary(catalog: OrionScreenCatalog): ConsolidatedIconEntry[] {
  const map = new Map<
    string,
    {
      meanings: Set<string>;
      tooltips: Set<string>;
      screens: Map<string, { screenId: string; chain: string[]; observedIn: Set<ElementWhereLocation> }>;
    }
  >();

  for (const screen of catalog.screens) {
    if (!screen.iconDictionary) continue;
    for (const [iconClass, entry] of Object.entries(screen.iconDictionary)) {
      let bucket = map.get(iconClass);
      if (!bucket) {
        bucket = {
          meanings: new Set<string>(),
          tooltips: new Set<string>(),
          screens: new Map()
        };
        map.set(iconClass, bucket);
      }
      for (const m of entry.meanings ?? []) {
        if (m.trim()) bucket.meanings.add(m.trim());
      }
      for (const t of entry.tooltips ?? []) {
        if (t.trim()) bucket.tooltips.add(t.trim());
      }
      let sc = bucket.screens.get(screen.id);
      if (!sc) {
        sc = { screenId: screen.id, chain: screen.chain ?? [], observedIn: new Set<ElementWhereLocation>() };
        bucket.screens.set(screen.id, sc);
      }
      for (const w of entry.observedIn ?? []) {
        sc.observedIn.add(w);
      }
    }
  }

  return Array.from(map.entries())
    .map(([iconClass, bucket]) => ({
      iconClass,
      meanings: Array.from(bucket.meanings).sort(),
      tooltips: Array.from(bucket.tooltips).sort(),
      screens: Array.from(bucket.screens.values())
        .map(sc => ({
          screenId: sc.screenId,
          chain: sc.chain,
          observedIn: Array.from(sc.observedIn).sort()
        }))
        .sort((a, b) => a.screenId.localeCompare(b.screenId))
    }))
    .sort((a, b) => b.screens.length - a.screens.length || a.iconClass.localeCompare(b.iconClass));
}

function toRelativeReportLink(screenshotPath: string | null | undefined, outputDir: string): string | null {
  if (!screenshotPath) return null;
  const cleaned = screenshotPath.replace(/\\/g, '/');
  if (!path.isAbsolute(cleaned) && !cleaned.startsWith('auditoria/')) {
    return cleaned;
  }
  const absTarget = path.isAbsolute(screenshotPath)
    ? screenshotPath
    : path.resolve(process.cwd(), screenshotPath);
  const rel = path.relative(outputDir, absTarget).replace(/\\/g, '/');
  return rel || cleaned;
}

function escapeMd(text: string | undefined | null): string {
  return String(text ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function formatSubStateDetails(sub: ScreenSubState, outputDir: string): string[] {
  const out: string[] = [];
  const printLink = toRelativeReportLink(sub.screenshot, outputDir);
  const fullLink = toRelativeReportLink(sub.fullPageScreenshot, outputDir);
  const metaParts: string[] = [`status: \`${sub.status}\``, `abertura: \`${sub.openedAs}\``];
  if (sub.parentOpener) metaParts.push(`origem: **${escapeMd(sub.parentOpener)}**`);
  if (sub.modalTitle) metaParts.push(`título: "${escapeMd(sub.modalTitle)}"`);
  if (sub.kind === 'form_opener' || sub.kind === 'modal_opener') {
    metaParts.push(`restauração limpa: ${sub.restoredCleanly ? 'sim' : 'não'}`);
  }
  if (printLink) metaParts.push(`[Print](${printLink})`);
  if (fullLink) metaParts.push(`[Full Page](${fullLink})`);
  if (sub.screenshotHeight && sub.screenshotHeight > 910) metaParts.push(`altura: ${sub.screenshotHeight}px`);
  if (sub.error) metaParts.push(`erro: ${escapeMd(sub.error)}`);

  out.push(`    - **${escapeMd(sub.triggerLabel)}** (${metaParts.join(' | ')})`);

  if ((sub.tabs ?? []).length > 0) {
    out.push(`      - Abas internas: ${sub.tabs.map(t => `**${escapeMd(t.label)}**`).join(', ')}`);
  }
  if ((sub.accordions ?? []).length > 0) {
    out.push(`      - Accordions na aba: ${sub.accordions.map(a => `**${escapeMd(a.label)}**`).join(', ')}`);
  }
  if ((sub.buttons ?? []).length > 0) {
    const btnNames = sub.buttons
      .map(b => (b.label?.trim() ? `**${escapeMd(b.label)}**` : `\`${escapeMd(b.iconClass || 'icon_only')}\``))
      .slice(0, 15);
    const extra = sub.buttons.length > 15 ? ` (+${sub.buttons.length - 15})` : '';
    out.push(`      - Botões (${sub.buttons.length}): ${btnNames.join(', ')}${extra}`);
  }
  if ((sub.fields ?? []).length > 0) {
    const fieldNames = sub.fields
      .map(f => `**${escapeMd(f.label || f.placeholder || 'Sem rótulo')}** (\`${f.type || 'text'}\`)`)
      .slice(0, 20);
    const extra = sub.fields.length > 20 ? ` (+${sub.fields.length - 20})` : '';
    out.push(`      - Campos (${sub.fields.length}): ${fieldNames.join(', ')}${extra}`);
  }
  if ((sub.tables ?? []).length > 0) {
    sub.tables.forEach((tbl, idx) => {
      const cols = (tbl.headers ?? []).length > 0 ? tbl.headers.map(h => `**${escapeMd(h)}**`).join(', ') : '_sem cabeçalhos_';
      out.push(`      - Tabela ${idx + 1}: [${cols}] (${tbl.rowCount} linha(s))`);
    });
  }
  if (typeof sub.rowCount === 'number' || (sub.rowActionIcons ?? []).length > 0) {
    const icons = (sub.rowActionIcons ?? []).length > 0 ? sub.rowActionIcons!.map(i => `\`${escapeMd(i)}\``).join(', ') : 'nenhum';
    out.push(`      - Grade revelada: ${sub.rowCount ?? 0} linha(s) | Ícones de ação: ${icons}`);
  }
  return out;
}

/**
 * Gera o relatório enciclopédico `catalogo-telas-orion-tn.md` organizado por módulo.
 */
export function buildScreenCatalogMarkdown(
  catalog: OrionScreenCatalog,
  options: { outputDir?: string } = {}
): string {
  const outputDir = options.outputDir ?? path.resolve('auditoria/mapeamento-telas');
  const lines: string[] = [];
  const isLevel2 = catalog.level === 2 || Boolean(catalog.stats.level2) || catalog.screens.some(s => (s.subStates ?? []).length > 0);

  lines.push(`# Catálogo de Telas do Orion TN (Mapeamento Nível ${isLevel2 ? 2 : 1})`);
  lines.push('');
  lines.push(`- **Versão do Catálogo:** ${catalog.version} (Nível ${catalog.level})`);
  lines.push(`- **Ambiente:** ${catalog.environment}`);
  lines.push(`- **Capturado em:** ${catalog.capturedAt}`);
  lines.push(`- **Total de Telas no Catálogo:** ${catalog.screens.length} (Capturadas: ${catalog.stats.captured} | Falhas: ${catalog.stats.failed} | Ignoradas: ${catalog.stats.skipped})`);
  lines.push(`- **Totais de Superfície:** ${catalog.stats.totalButtons} botões | ${catalog.stats.totalFields} campos | ${catalog.stats.totalTabs} abas | ${catalog.stats.totalTables} tabelas`);
  if (catalog.stats.level2) {
    const l2 = catalog.stats.level2;
    const extras: string[] = [];
    if (l2.totalViewSwitchers) extras.push(`${l2.totalViewSwitchers} alternadores de visão`);
    if (l2.totalNestedTabs) extras.push(`${l2.totalNestedTabs} abas internas de formulários`);
    if (l2.totalGridReveals) extras.push(`${l2.totalGridReveals} grades reveladas`);
    if (l2.trueFullPagePrintsCount) extras.push(`${l2.trueFullPagePrintsCount} prints full-page reais`);
    lines.push(
      `- **Cobertura Nível 2/2.5:** ${l2.explored} exploradas | ${l2.noSubstates} sem sub-estados | ${l2.partial} parciais | ${l2.failed} falhas | ` +
        `${l2.totalSubStates} sub-estados | ${l2.totalUniqueKnownButtons} botões únicos | ${l2.totalUniqueKnownFields} campos únicos | ` +
        `${l2.totalIconDictionaryEntries} ícones | ${l2.securityAlertsCount} alertas de segurança` +
        (extras.length > 0 ? ` | ${extras.join(' | ')}` : '')
    );
  }
  lines.push('');

  const byModule = new Map<string, ScreenCatalogEntry[]>();
  for (const screen of catalog.screens) {
    const mod = screen.modulo || 'Sem Módulo';
    const list = byModule.get(mod) ?? [];
    list.push(screen);
    byModule.set(mod, list);
  }

  for (const [modulo, screens] of byModule.entries()) {
    lines.push(`## Módulo: ${modulo} (${screens.length} tela(s))`);
    lines.push('');

    for (const s of screens) {
      const canonicalPath = (s.chain ?? []).join(' > ') || s.slug;
      lines.push(`### [${s.id}] ${canonicalPath}`);
      lines.push('');
      lines.push(`- **Status:** \`${s.status}\` | **Abertura:** \`${s.openedAs}\` | **Rota:** \`${s.routeHash || 'N/A'}\` | **Título:** ${escapeMd(s.pageTitle) || 'N/A'}`);

      const vpLink = toRelativeReportLink(s.screenshots?.viewport, outputDir);
      const fpLink = toRelativeReportLink(s.screenshots?.fullPage, outputDir);
      if (vpLink || fpLink) {
        const links: string[] = [];
        if (vpLink) links.push(`[Viewport](${vpLink})`);
        if (fpLink) links.push(`[Full Page](${fpLink})`);
        lines.push(`- **Prints:** ${links.join(' | ')}`);
      } else {
        lines.push('- **Prints:** _Nenhuma print registrada_');
      }

      if (s.error) {
        lines.push(`- **Erro/Observação:** ${escapeMd(s.error)}`);
      }

      if ((s.breadcrumbs ?? []).length > 0) {
        lines.push(`- **Breadcrumbs:** ${s.breadcrumbs.map(b => escapeMd(b)).join(' > ')}`);
      }

      if ((s.headings ?? []).length > 0) {
        lines.push(`- **Cabeçalhos:** ${s.headings.map(h => `**${escapeMd(h)}**`).join(', ')}`);
      }

      if ((s.tabs ?? []).length > 0) {
        const tabDesc = s.tabs.map(t => {
          const flags = [t.active ? 'ativa' : '', t.disabled ? 'desabilitada' : ''].filter(Boolean);
          return flags.length > 0 ? `**${escapeMd(t.label)}** (${flags.join(', ')})` : `**${escapeMd(t.label)}**`;
        });
        lines.push(`- **Abas (${s.tabs.length}):** ${tabDesc.join(', ')}`);
      } else {
        lines.push('- **Abas:** Nenhuma');
      }

      if ((s.accordions ?? []).length > 0) {
        const accDesc = s.accordions.map(a => `**${escapeMd(a.label)}** (${a.expanded ? 'expandido' : 'recolhido'})`);
        lines.push(`- **Accordions (${s.accordions.length}):** ${accDesc.join(', ')}`);
      } else {
        lines.push('- **Accordions:** Nenhum');
      }

      if ((s.buttons ?? []).length > 0) {
        lines.push(`- **Botões (${s.buttons.length}):**`);
        for (const btn of s.buttons) {
          const isIconOnly = btn.kind === 'icon_only' || (!btn.label?.trim() && Boolean(btn.iconClass));
          const displayLabel = btn.label?.trim() ? `**${escapeMd(btn.label)}**` : `_(somente ícone: \`${escapeMd(btn.iconClass || 'sem-classe')}\`)_`;
          const meta: string[] = [];
          if (isIconOnly) meta.push('`icon_only`');
          if (btn.tooltip) meta.push(`tooltip: "${escapeMd(btn.tooltip)}"`);
          if (btn.disabled) meta.push('desabilitado');
          if (btn.isMutationLike) meta.push('mutação');
          lines.push(`  - ${displayLabel}${meta.length > 0 ? ` — ${meta.join(' | ')}` : ''}`);
        }
      } else {
        lines.push('- **Botões:** Nenhum');
      }

      if ((s.fields ?? []).length > 0) {
        lines.push(`- **Campos / Filtros (${s.fields.length}):**`);
        for (const f of s.fields) {
          const req = f.required ? 'obrigatório' : 'opcional';
          const meta = [`tipo: \`${f.type || 'text'}\``, req];
          if (f.disabled) meta.push('desabilitado');
          if (f.readonly) meta.push('somente leitura');
          if (f.section) meta.push(`seção: ${escapeMd(f.section)}`);
          if (f.options && f.options.length > 0) {
            const preview = f.options.slice(0, 5).map(o => escapeMd(o)).join(', ');
            const suffix = f.options.length > 5 ? ` (+${f.options.length - 5} opções)` : '';
            meta.push(`opções (${f.options.length}): [${preview}${suffix}]`);
          }
          lines.push(`  - **${escapeMd(f.label || f.placeholder || 'Sem rótulo')}** (${meta.join(' | ')})`);
        }
      } else {
        lines.push('- **Campos / Filtros:** Nenhum');
      }

      if ((s.tables ?? []).length > 0) {
        lines.push(`- **Tabelas (${s.tables.length}):**`);
        s.tables.forEach((tbl, idx) => {
          const cols = (tbl.headers ?? []).length > 0 ? tbl.headers.map(h => `**${escapeMd(h)}**`).join(', ') : '_sem cabeçalhos_';
          const state = tbl.isEmpty ? `vazia${tbl.emptyText ? ` ("${escapeMd(tbl.emptyText)}")` : ''}` : `${tbl.rowCount} linha(s)`;
          lines.push(`  - Tabela ${idx + 1}: Colunas [${cols}] — Estado: ${state}`);
        });
      } else {
        lines.push('- **Tabelas:** Nenhuma');
      }

      if ((s.alerts ?? []).length > 0) {
        lines.push(`- **Avisos / Alertas (${s.alerts.length}):** ${s.alerts.map(a => `"${escapeMd(a)}"`).join('; ')}`);
      }

      const subStates = s.subStates ?? [];
      const rowActions = s.allKnownElements?.rowActions ?? [];
      if (s.level2Status || subStates.length > 0 || rowActions.length > 0) {
        lines.push(`- **Nível 2 — Status:** \`${s.level2Status ?? 'N/A'}\` | **Sub-estados:** ${subStates.length}`);
        if (s.level2SecurityAlerts && s.level2SecurityAlerts.length > 0) {
          lines.push(`- **Alertas de Segurança Nível 2:** ${s.level2SecurityAlerts.length}`);
        }

        const tabSubs = subStates.filter(sub => sub.kind === 'tab');
        const viewSubs = subStates.filter(sub => sub.kind === 'view_switcher');
        const accSubs = subStates.filter(sub => (sub.kind === 'accordion' || sub.kind === 'advanced_filters') && !sub.parentTab && !sub.parentOpener);
        const modalSubs = subStates.filter(sub => sub.kind === 'form_opener' || sub.kind === 'modal_opener');
        const gridSubs = subStates.filter(sub => sub.kind === 'search_grid_reveal');

        if (tabSubs.length > 0 || viewSubs.length > 0 || accSubs.length > 0 || modalSubs.length > 0 || gridSubs.length > 0 || rowActions.length > 0) {
          lines.push('- **Árvore Nível 2 (Sub-estados):**');
          if (tabSubs.length > 0) {
            lines.push(`  - **Abas (${tabSubs.length}):**`);
            for (const tab of tabSubs) {
              lines.push(...formatSubStateDetails(tab, outputDir));
              const nestedAccs = subStates.filter(
                sub => (sub.kind === 'accordion' || sub.kind === 'advanced_filters') && sub.parentTab === tab.triggerLabel
              );
              for (const nAcc of nestedAccs) {
                lines.push(...formatSubStateDetails(nAcc, outputDir).map(l => `  ${l}`));
              }
            }
          }
          if (viewSubs.length > 0) {
            lines.push(`  - **Alternadores de Modo/Visão (${viewSubs.length}):**`);
            for (const vs of viewSubs) {
              lines.push(...formatSubStateDetails(vs, outputDir));
            }
          }
          if (accSubs.length > 0) {
            lines.push(`  - **Accordions & Filtros Avançados (${accSubs.length}):**`);
            for (const acc of accSubs) {
              lines.push(...formatSubStateDetails(acc, outputDir));
            }
          }
          if (modalSubs.length > 0) {
            lines.push(`  - **Modais / Formulários (${modalSubs.length}):**`);
            for (const mod of modalSubs) {
              lines.push(...formatSubStateDetails(mod, outputDir));
              const nestedInModal = subStates.filter(
                sub =>
                  (sub.kind === 'nested_tab' || sub.kind === 'accordion' || sub.kind === 'advanced_filters') &&
                  sub.parentOpener === mod.triggerLabel
              );
              for (const nm of nestedInModal) {
                lines.push(...formatSubStateDetails(nm, outputDir).map(l => `  ${l}`));
              }
            }
          }
          if (gridSubs.length > 0 || rowActions.length > 0) {
            lines.push(`  - **Ações de Grade:**`);
            for (const g of gridSubs) {
              lines.push(...formatSubStateDetails(g, outputDir));
            }
            if (rowActions.length > 0) {
              const actionsStr = rowActions
                .map(r => `\`${escapeMd(r.iconClass)}\` (${escapeMd(r.tooltip || 'sem tooltip')})`)
                .join(', ');
              lines.push(`    - Ações catalogadas (${rowActions.length}): ${actionsStr}`);
            }
          }
        }
      }

      lines.push('');
    }
  }

  const consolidatedIcons = collectConsolidatedIconDictionary(catalog);
  if (consolidatedIcons.length > 0) {
    lines.push('## Dicionário Consolidado de Ícones (`iconDictionary`)');
    lines.push('');
    lines.push('| Classe do Ícone | Significados | Tooltips Observados | Telas |');
    lines.push('|---|---|---|---|');
    for (const ic of consolidatedIcons) {
      const meanings = ic.meanings.length > 0 ? ic.meanings.map(m => `**${escapeMd(m)}**`).join(', ') : '_N/A_';
      const tooltips = ic.tooltips.length > 0 ? ic.tooltips.map(t => `"${escapeMd(t)}"`).join(', ') : '_N/A_';
      const screensList = ic.screens
        .slice(0, 8)
        .map(sc => `[${sc.screenId}] ${escapeMd(sc.chain.join(' > '))} (${sc.observedIn.join(', ')})`)
        .join('; ');
      const extraScreens = ic.screens.length > 8 ? `; (+${ic.screens.length - 8} telas)` : '';
      lines.push(`| \`${escapeMd(ic.iconClass)}\` | ${meanings} | ${tooltips} | ${screensList}${extraScreens} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Gera o relatório de cruzamento editorial `cruzamento-editorial-telas.md`.
 */
export function buildEditorialCrossReferenceMarkdown(
  analysis: CrossReferenceAnalysis,
  catalog: OrionScreenCatalog
): string {
  const lines: string[] = [];

  lines.push('# Cruzamento Editorial × Superfície Mapeada (Orion TN — Nível 1)');
  lines.push('');
  lines.push(`- **Versão do Catálogo:** ${catalog.version} | **Capturado em:** ${catalog.capturedAt}`);
  lines.push(`- **Rotinas Analisadas:** ${analysis.totalRoutines}`);
  lines.push(`- **Termos em Negrito Extraídos:** ${analysis.totalBoldOccurrences} ocorrências (${analysis.uniqueBoldTerms} termos únicos normalizados)`);
  lines.push(`- **Termos Únicos na Superfície Mapeada:** ${analysis.uniqueSurfaceTerms}`);
  lines.push(`- **Limiar Sørensen-Dice:** ${analysis.similarityThreshold}`);
  lines.push(`- **Resumo:** ${analysis.literalMatches.length} literais | ${analysis.similarMatches.length} similares (>= ${analysis.similarityThreshold}) | ${analysis.unmatchedTerms.length} não encontrados`);
  lines.push('');

  lines.push('## 1. Termos Encontrados Literalmente na Superfície');
  lines.push('');
  if (analysis.literalMatches.length === 0) {
    lines.push('_Nenhum termo encontrado literalmente._');
  } else {
    lines.push('| # | Termo no Manual | Ocorrências | Rotinas | Elemento(s) na UI | Exemplo de Tela |');
    lines.push('|---|---|---:|---:|---|---|');
    analysis.literalMatches.forEach((m, i) => {
      const kinds = Array.from(new Set(m.surfaceMatches.map(s => s.kind))).join(', ');
      const sampleScreen = m.surfaceMatches[0] ? `[${m.surfaceMatches[0].screenId}] ${m.surfaceMatches[0].chain.join(' > ')}` : '-';
      lines.push(`| ${i + 1} | **${escapeMd(m.term)}** | ${m.occurrenceCount} | ${m.routineCount} | \`${kinds}\` | ${escapeMd(sampleScreen)} |`);
    });
  }
  lines.push('');

  lines.push(`## 2. Termos com Candidato Similar (Sørensen-Dice >= ${analysis.similarityThreshold} — Provável Renomeação de UI)`);
  lines.push('');
  if (analysis.similarMatches.length === 0) {
    lines.push('_Nenhum candidato similar encontrado acima do limiar._');
  } else {
    lines.push('| # | Termo no Manual | Candidato Real na UI | Similaridade | Tipo | Tela | Ocorrências |');
    lines.push('|---|---|---|---:|---|---|---:|');
    analysis.similarMatches.forEach((m, i) => {
      const screenLabel = `[${m.bestCandidate.screenId}] ${m.bestCandidate.chain.join(' > ')}`;
      lines.push(
        `| ${i + 1} | **${escapeMd(m.term)}** | **${escapeMd(m.bestCandidate.rawTerm)}** | ${m.similarity.toFixed(2)} | \`${m.bestCandidate.kind}\` | ${escapeMd(screenLabel)} | ${m.occurrenceCount} |`
      );
    });
  }
  lines.push('');

  lines.push('## 3. Termos Não Encontrados na Superfície (Candidatos Prioritários para o Nível 2)');
  lines.push('');
  lines.push('> Termos ausentes da superfície inicial provavelmente residem em abas secundárias, accordions recolhidos ou modais acionados por botões como **Novo** / **Adicionar**.');
  lines.push('');
  if (analysis.unmatchedTerms.length === 0) {
    lines.push('_Todos os termos das rotinas foram localizados ou tiveram candidatos similares._');
  } else {
    lines.push('| # | Termo no Manual | Ocorrências | Rotinas | Exemplos de Rotinas |');
    lines.push('|---|---|---:|---:|---|');
    analysis.unmatchedTerms.forEach((u, i) => {
      lines.push(
        `| ${i + 1} | **${escapeMd(u.term)}** | ${u.occurrenceCount} | ${u.routineCount} | ${u.sampleRoutineIds.join(', ')} |`
      );
    });
  }
  lines.push('');

  lines.push('## 4. Telas Candidatas Prioritárias para o Mapeamento Nível 2');
  lines.push('');
  if (analysis.level2Candidates.length === 0) {
    lines.push('_Nenhuma tela candidata ao Nível 2 identificada._');
  } else {
    lines.push('| Prioridade | ID | Módulo | Caminho Canônico | Score | Motivos |');
    lines.push('|---:|---|---|---|---:|---|');
    analysis.level2Candidates.forEach((c, i) => {
      lines.push(
        `| ${i + 1} | ${c.screenId} | ${escapeMd(c.modulo)} | ${escapeMd(c.chain.join(' > '))} | ${c.priorityScore} | ${escapeMd(c.reasons.join(' | '))} |`
      );
    });
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Gera o relatório comparativo Nível 1 vs Nível 2 (`cruzamento-editorial-telas-v2.md`)
 * com a Lista Ouro de candidatos `[ATT]` editoriais confirmados.
 */
export function buildEditorialCrossReferenceV2Markdown(
  v2: CrossReferenceV2Analysis,
  catalog: OrionScreenCatalog
): string {
  const lines: string[] = [];
  const { level1, level2 } = v2;
  const pct = (count: number, total: number) => (total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0.0%');

  lines.push('# Cruzamento Editorial × Orion TN (Nível 1 vs Nível 2 — V2)');
  lines.push('');
  lines.push(`- **Versão do Catálogo:** ${catalog.version} (Nível ${catalog.level}) | **Capturado em:** ${catalog.capturedAt}`);
  lines.push(`- **Rotinas Analisadas:** ${level2.totalRoutines}`);
  lines.push(`- **Termos em Negrito Extraídos:** ${level2.totalBoldOccurrences} ocorrências (${level2.uniqueBoldTerms} termos únicos normalizados)`);
  lines.push(`- **Limiar Sørensen-Dice:** ${level2.similarityThreshold}`);
  lines.push('');

  lines.push('## 1. Comparativo Nível 1 (Superfície) vs Nível 2 (Superfície + Sub-estados)');
  lines.push('');
  lines.push('| Métrica | Nível 1 (Superfície) | Nível 2 (Completo) | Variação |');
  lines.push('|---|---:|---:|---:|');
  lines.push(
    `| Termos Únicos na UI | ${level1.uniqueSurfaceTerms} | ${level2.uniqueSurfaceTerms} | +${level2.uniqueSurfaceTerms - level1.uniqueSurfaceTerms} |`
  );
  lines.push(
    `| Encontrados Literalmente | ${level1.literalMatches.length} (${pct(level1.literalMatches.length, level1.uniqueBoldTerms)}) | ${level2.literalMatches.length} (${pct(level2.literalMatches.length, level2.uniqueBoldTerms)}) | +${level2.literalMatches.length - level1.literalMatches.length} |`
  );
  lines.push(
    `| Candidatos Similares (>= ${level2.similarityThreshold}) | ${level1.similarMatches.length} (${pct(level1.similarMatches.length, level1.uniqueBoldTerms)}) | ${level2.similarMatches.length} (${pct(level2.similarMatches.length, level2.uniqueBoldTerms)}) | ${level2.similarMatches.length - level1.similarMatches.length >= 0 ? '+' : ''}${level2.similarMatches.length - level1.similarMatches.length} |`
  );
  lines.push(
    `| Não Encontrados | ${level1.unmatchedTerms.length} (${pct(level1.unmatchedTerms.length, level1.uniqueBoldTerms)}) | ${level2.unmatchedTerms.length} (${pct(level2.unmatchedTerms.length, level2.uniqueBoldTerms)}) | ${level2.unmatchedTerms.length - level1.unmatchedTerms.length} |`
  );
  lines.push('');
  lines.push('### Resgate de Termos Ocultos (Antes "Não Encontrados na Superfície")');
  lines.push('');
  lines.push(`- **Total de termos resgatados literalmente no Nível 2:** ${v2.rescuedLiteralFromUnmatched.length}`);
  lines.push(`- **Total de termos resgatados como similares no Nível 2:** ${v2.rescuedSimilarFromUnmatched.length}`);
  lines.push(`- **Termos promovidos de Similar (Nível 1) para Literal (Nível 2):** ${v2.upgradedSimilarToLiteral.length}`);
  lines.push(
    `- **Distribuição dos resgates literais por sub-estado:** Abas: **${v2.rescuedByCategory.tab}** | ` +
      `Accordions/Filtros: **${v2.rescuedByCategory.accordion}** | ` +
      `Modais/Formulários: **${v2.rescuedByCategory.modal}** | ` +
      `Ações de Grade: **${v2.rescuedByCategory.grid_row}** | ` +
      `Superfície/Ícones: **${v2.rescuedByCategory.root}**` +
      (v2.rescuedByCategory.view_switch > 0 ? ` | Alternadores de Visão: **${v2.rescuedByCategory.view_switch}**` : '')
  );
  lines.push('');

  lines.push('## 2. Termos Resgatados no Nível 2 (Encontrados em Abas, Accordions, Modais ou Ações de Grade)');
  lines.push('');
  if (v2.rescuedLiteralFromUnmatched.length === 0) {
    lines.push('_Nenhum termo anteriormente ausente foi resgatado literalmente no Nível 2._');
  } else {
    lines.push('| # | Termo no Manual | Ocorrências | Rotinas | Onde foi Encontrado (`where`) | Tela Exemplo |');
    lines.push('|---|---|---:|---:|---|---|');
    v2.rescuedLiteralFromUnmatched.forEach((m, i) => {
      const whereStr = m.whereLocations.join(', ') || 'root';
      const sampleScreen = m.surfaceMatches[0] ? `[${m.surfaceMatches[0].screenId}] ${m.surfaceMatches[0].chain.join(' > ')}` : '-';
      lines.push(
        `| ${i + 1} | **${escapeMd(m.term)}** | ${m.occurrenceCount} | ${m.routineCount} | \`${escapeMd(whereStr)}\` | ${escapeMd(sampleScreen)} |`
      );
    });
  }
  lines.push('');

  if (v2.upgradedSimilarToLiteral.length > 0) {
    lines.push('## 3. Termos Promovidos de Similar (Nível 1) para Literal (Nível 2)');
    lines.push('');
    lines.push('| # | Termo no Manual | Ocorrências | Rotinas | Onde foi Encontrado (`where`) | Tela Exemplo |');
    lines.push('|---|---|---:|---:|---|---|');
    v2.upgradedSimilarToLiteral.forEach((m, i) => {
      const whereStr = m.whereLocations.join(', ') || 'root';
      const sampleScreen = m.surfaceMatches[0] ? `[${m.surfaceMatches[0].screenId}] ${m.surfaceMatches[0].chain.join(' > ')}` : '-';
      lines.push(
        `| ${i + 1} | **${escapeMd(m.term)}** | ${m.occurrenceCount} | ${m.routineCount} | \`${escapeMd(whereStr)}\` | ${escapeMd(sampleScreen)} |`
      );
    });
    lines.push('');
  }

  lines.push('## 4. Lista Ouro — Termos Confirmados Inexistentes no Orion TN 06.05.02 (Candidatos `[ATT]` Editoriais)');
  lines.push('');
  lines.push('> Termos abaixo não foram encontrados na superfície nem em nenhum sub-estado explorado (abas, accordions, modais/formulários ou ações de grade), e não possuem candidato similar acima do limiar.');
  lines.push('');
  if (v2.goldUnmatchedTerms.length === 0) {
    lines.push('_Nenhum termo ausente remanescente após o mapeamento Nível 2._');
  } else {
    lines.push('| # | Termo no Manual | Ocorrências | Rotinas | Exemplos de Rotinas |');
    lines.push('|---|---|---:|---:|---|');
    v2.goldUnmatchedTerms.forEach((u, i) => {
      lines.push(
        `| ${i + 1} | **${escapeMd(u.term)}** | ${u.occurrenceCount} | ${u.routineCount} | ${u.sampleRoutineIds.join(', ')} |`
      );
    });
  }
  lines.push('');

  lines.push(`## 5. Candidatos Similares Remanescentes no Nível 2 (Sørensen-Dice >= ${level2.similarityThreshold})`);
  lines.push('');
  if (level2.similarMatches.length === 0) {
    lines.push('_Nenhum candidato similar remanescente._');
  } else {
    lines.push('| # | Termo no Manual | Candidato Real na UI | Similaridade | Tipo | Onde (`where`) | Tela |');
    lines.push('|---|---|---|---:|---|---|---|');
    level2.similarMatches.forEach((m, i) => {
      const screenLabel = `[${m.bestCandidate.screenId}] ${m.bestCandidate.chain.join(' > ')}`;
      lines.push(
        `| ${i + 1} | **${escapeMd(m.term)}** | **${escapeMd(m.bestCandidate.rawTerm)}** | ${m.similarity.toFixed(2)} | \`${m.bestCandidate.kind}\` | \`${escapeMd(m.bestCandidate.where ?? 'root')}\` | ${escapeMd(screenLabel)} |`
      );
    });
  }
  lines.push('');

  return lines.join('\n');
}

export interface GenerateScreenReportsOptions {
  catalogPath: string;
  kbDir: string;
  outputDir: string;
  similarityThreshold?: number;
}

export interface GenerateScreenReportsResult {
  catalogReportPath: string;
  crossRefReportPath: string;
  crossRefV2ReportPath: string;
  analysis: CrossReferenceAnalysis;
  analysisV2: CrossReferenceV2Analysis;
}

/**
 * Pipeline completo offline: lê o catálogo JSON e as rotinas `kb/` e grava os relatórios markdown.
 */
export function generateScreenReports(options: GenerateScreenReportsOptions): GenerateScreenReportsResult {
  if (!fs.existsSync(options.catalogPath)) {
    throw new Error(`Catálogo de telas não encontrado em: ${options.catalogPath}`);
  }
  const catalog = JSON.parse(fs.readFileSync(options.catalogPath, 'utf-8')) as OrionScreenCatalog;
  const routines = loadKbRoutines(options.kbDir);
  const analysisV2 = analyzeEditorialCrossReferenceV2(catalog, routines, {
    similarityThreshold: options.similarityThreshold
  });
  const analysis = analysisV2.level1;

  fs.mkdirSync(options.outputDir, { recursive: true });
  const catalogReportPath = path.join(options.outputDir, 'catalogo-telas-orion-tn.md');
  const crossRefReportPath = path.join(options.outputDir, 'cruzamento-editorial-telas.md');
  const crossRefV2ReportPath = path.join(options.outputDir, 'cruzamento-editorial-telas-v2.md');

  fs.writeFileSync(catalogReportPath, buildScreenCatalogMarkdown(catalog, { outputDir: options.outputDir }), 'utf-8');
  fs.writeFileSync(crossRefReportPath, buildEditorialCrossReferenceMarkdown(analysis, catalog), 'utf-8');
  fs.writeFileSync(crossRefV2ReportPath, buildEditorialCrossReferenceV2Markdown(analysisV2, catalog), 'utf-8');

  return {
    catalogReportPath,
    crossRefReportPath,
    crossRefV2ReportPath,
    analysis,
    analysisV2
  };
}

function parseCliArgs(argv: string[]): GenerateScreenReportsOptions {
  const thisDir = path.dirname(fileURLToPath(import.meta.url));
  const auditoriaDir = path.resolve(thisDir, '..');
  const repoRoot = path.resolve(auditoriaDir, '..');

  let catalogPath = path.join(auditoriaDir, 'data', 'orion-screen-catalog.json');
  let kbDir = path.join(repoRoot, 'kb');
  let outputDir = path.join(auditoriaDir, 'mapeamento-telas');

  for (const arg of argv) {
    if (arg.startsWith('--catalog=')) catalogPath = path.resolve(arg.slice('--catalog='.length));
    else if (arg.startsWith('--kb=')) kbDir = path.resolve(arg.slice('--kb='.length));
    else if (arg.startsWith('--out-dir=')) outputDir = path.resolve(arg.slice('--out-dir='.length));
  }

  return { catalogPath, kbDir, outputDir };
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  const opts = parseCliArgs(process.argv.slice(2));
  const result = generateScreenReports(opts);
  console.log(
    `[generate-screen-reports] Concluído: ${result.catalogReportPath}, ${result.crossRefReportPath} e ${result.crossRefV2ReportPath} ` +
      `(${result.analysis.totalRoutines} rotinas | L1 literais: ${result.analysis.literalMatches.length} -> L2 literais: ${result.analysisV2.level2.literalMatches.length} | ` +
      `resgatados: ${result.analysisV2.rescuedLiteralFromUnmatched.length} | lista ouro [ATT]: ${result.analysisV2.goldUnmatchedTerms.length}).`
  );
}
