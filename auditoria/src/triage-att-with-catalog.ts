/**
 * Triagem Offline das 94 Rotinas `[ATT]` contra o Catálogo de Telas Nível 2.5 (ADR-038/039/040).
 *
 * SOMENTE LEITURA sobre `auditoria/rotinas/` e `auditoria/data/`:
 * - Não altera nenhum `*-revisado.md` (Evidência Estrita ADR-017);
 * - Classifica cada rotina `[ATT]` em 3 filas:
 *     1. `fila_1_destravavel` (`1A_substate_literal`, `1B_menu_canonical`, `1C_similar_candidate`)
 *     2. `fila_2_att_legitimo` (defasagem real confirmada na Lista Ouro Nível 2.5)
 *     3. `fila_3_ddd_xrx` (dependência de grade populada, ato prévio ou hardware/serviço externo)
 * - Gera `auditoria/mapeamento-telas/triagem-94-att-nivel25.json` e `.md`.
 *
 * Uso: `npm --prefix auditoria run att:triage:l25`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { stepNeedsGridRows } from './grid-prefilter.js';
import { listHardwareRoutineIds } from './hardware-registry.js';
import { canonNormalize, resolveCanonicalMenuPath, type CanonicalMenuItem } from './menu-canonical.js';
import {
  catalogAsCanonicalItems,
  loadMenuCatalog,
  resolveClosedSemantic,
  resolveSingleSegmentScreen,
  type MenuCatalog
} from './menu-catalog.js';
import { detectImplicitScreenNavigation } from './menu-implicit-nav.js';
import { extractMenuPaths } from './menu-path.js';
import { isGlobalSearchName, stepExpectsInteractiveControl, stepNamesGlobalSearch } from './navigation-guard.js';
import { extractBoldTargets } from './parser.js';
import { tagsFromPrefix } from './review-taxonomy.js';
import { routeKey, routeSynonymsFor } from './route-synonyms.js';
import type {
  AllKnownElements,
  ElementWhereLocation,
  ScreenCatalogEntry as L2ScreenCatalogEntry
} from './screen-catalog-extractor.js';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';
import type { RoutineStep } from './types.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');

export const DEFAULT_ROTINAS_DIR = path.join(auditoriaRoot, 'rotinas');
export const DEFAULT_SCREEN_CATALOG_FILE = path.join(auditoriaRoot, 'data', 'orion-screen-catalog.json');
export const DEFAULT_MENU_CATALOG_PATH = path.join(auditoriaRoot, 'data', 'orion-menu-tree-canonical.json');
export const DEFAULT_TRIAGE_JSON_OUT = path.join(auditoriaRoot, 'mapeamento-telas', 'triagem-94-att-nivel25.json');
export const DEFAULT_TRIAGE_MD_OUT = path.join(auditoriaRoot, 'mapeamento-telas', 'triagem-94-att-nivel25.md');

export type TriageQueueId = 'fila_1_destravavel' | 'fila_2_att_legitimo' | 'fila_3_ddd_xrx';
export type TriageSubCause =
  | '1A_substate_literal'
  | '1B_menu_canonical'
  | '1C_similar_candidate'
  | '2_lista_ouro_confirmada'
  | '3_grade_vazia_ou_registro'
  | '3_ato_previo_xrx'
  | '3_hardware_ou_servico_externo';

export type CatalogElementKind = 'tab' | 'button' | 'field' | 'tableHeader' | 'rowAction' | 'heading';

export interface CatalogCandidateMatch {
  target: string;
  matchType: 'literal' | 'route_synonym' | 'similar';
  matchedLabel: string;
  kind: CatalogElementKind;
  where: ElementWhereLocation | 'root';
  similarity: number;
  inSubState: boolean;
  vetoedByAdr035?: string;
}

export interface TargetTriageDiagnosis {
  target: string;
  resolved: boolean;
  resolutionKind?: 'literal_substate' | 'literal_root' | 'route_synonym' | 'similar' | 'menu_canonical';
  bestMatch?: CatalogCandidateMatch;
  rejectedTableHeaders?: string[];
}

export interface MenuResolutionSuggestion {
  documented: string;
  basis: string;
  resolvedChain: string[];
  targetScreenId?: string;
  targetRouteHash?: string;
  downstreamMatchedTargets: string[];
  downstreamCheckedTargets: string[];
}

export interface AttRoutineTriageEntry {
  id: string;
  modulo: string;
  titulo: string;
  carga: string;
  tags: string[];
  folderName: string;
  filePath: string;
  blockedStep: number | null;
  blockedStepText: string;
  tipoBloqueio: string;
  motivo: string;
  landingRejected: boolean;
  reachedRouteRaw: string;
  reachedRouteKey: string;
  matchedScreenId?: string;
  matchedScreenChain?: string[];
  matchedVia?: 'direct_route' | 'sub_route' | 'parent_prefix';
  level2Status?: string;
  missingTargets: string[];
  targetDiagnoses: TargetTriageDiagnosis[];
  menuSuggestion?: MenuResolutionSuggestion;
  queue: TriageQueueId;
  subCause: TriageSubCause;
  priorityScore: number;
  unlockMechanism: string;
  evidenceSummary: string;
}

export interface TriageSummaryReport {
  generatedAt: string;
  catalogVersion: string;
  catalogScreens: number;
  totalAttRoutines: number;
  countsByQueue: Record<TriageQueueId, number>;
  countsBySubCause: Record<TriageSubCause, number>;
  countsByModule: Record<
    string,
    { total: number; fila1: number; fila2: number; fila3: number }
  >;
  pilotTop12: Array<{
    rank: number;
    id: string;
    modulo: string;
    subCause: TriageSubCause;
    blockedStep: number | null;
    reachedRouteKey: string;
    unlockMechanism: string;
    evidenceSummary: string;
  }>;
  renameCandidates: Array<{
    id: string;
    modulo: string;
    routeKey: string;
    screenId: string;
    documented: string;
    candidateLabel: string;
    kind: CatalogElementKind;
    where: string;
    similarity: number;
  }>;
  routines: AttRoutineTriageEntry[];
}

interface ParsedStepLite {
  stepNumber: number;
  rawText: string;
  targets: string[];
}

export interface ParsedAttReport {
  id: string;
  modulo: string;
  titulo: string;
  carga: string;
  tags: string[];
  folderName: string;
  filePath: string;
  blockedStep: number | null;
  blockedStepText: string;
  steps: ParsedStepLite[];
  tipoBloqueio: string;
  motivo: string;
  landingRejected: boolean;
  reachedRouteRaw: string;
  reachedRouteKey: string;
  missingTargets: string[];
}

interface CatalogPoolItem {
  kind: CatalogElementKind;
  label: string;
  where: ElementWhereLocation | 'root';
}

const SIMILAR_MIN_SCORE = 0.65;
const HOME_ROUTES = new Set(['', '#', '#/', '#/inicio', '#/home', '#/produtos']);
const HARDWARE_RE =
  /\b(integrador\s*spcm|leitor biometrico|biometrico|impressora termica|zebra|argox|elgin|bematech|twain|scanner|webcam|docker|spooler|assinador|certificado digital a3|token a3|service worker|servico local)\b/i;
const CROSS_ROUTINE_RE =
  /\b(precisa existir antes|criado em outra rotina|lavrado anteriormente|ato lavrado|protocolo em aberto|previamente cadastrad|gerado anteriormente|outra rotina)\b/i;
const EMPTY_GRID_MOTIVO_RE = /\b(grade vazia|sem dados|0 linhas de dados|nenhum registro encontrado|listagem vazia)\b/i;

function cleanRouteForMatch(hash: string | undefined | null): string {
  return routeKey(hash).trim().toLowerCase();
}

function parseStepsFromBody(body: string): ParsedStepLite[] {
  const marker = body.includes('#### Passo a passo (texto original preservado):')
    ? '#### Passo a passo (texto original preservado):'
    : '#### Passo a passo:';
  const section = body.split(marker)[1] ?? '';
  const cut = section.split(/\n####\s+|\n\*\s+\*\*Dica/)[0] ?? section;
  const lines = cut.split('\n');
  const steps: ParsedStepLite[] = [];
  let current: ParsedStepLite | null = null;
  for (const line of lines) {
    const m = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (m) {
      if (current) steps.push(current);
      const rawText = m[2].trim();
      current = {
        stepNumber: parseInt(m[1], 10),
        rawText,
        targets: extractBoldTargets(rawText)
      };
    } else if (current && /^\s*[-*]\s+/.test(line)) {
      const sub = line.replace(/^\s*[-*]\s+/, '').trim();
      current.rawText += ` ${sub}`;
      for (const bt of extractBoldTargets(sub)) {
        if (!current.targets.includes(bt)) current.targets.push(bt);
      }
    }
  }
  if (current) steps.push(current);
  return steps;
}

function cleanTargetList(items: Array<string | undefined | null>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of items) {
    const cleaned = String(raw ?? '')
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned || !/[\p{L}\p{N}]/u.test(cleaned)) continue;
    const key = normalizeText(cleaned);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

/** Faz o parse determinístico de um `[ATT] *-revisado.md` sem depender de telemetria externa. */
export function parseAttReportMarkdown(filePath: string, moduloFromDir: string, folderName: string): ParsedAttReport | null {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return null;
  const meta = YAML.parse(fmMatch[1]) as Record<string, any>;
  const ui = (meta?.auditoria_ui ?? {}) as Record<string, any>;
  const body = content.slice(fmMatch[0].length);

  const prefixTags = tagsFromPrefix(folderName);
  const yamlTags: string[] = Array.isArray(ui.review_tags) ? ui.review_tags.map(String) : [];
  const tags = Array.from(new Set([...prefixTags, ...yamlTags]));
  if (!tags.includes('ATT')) return null;

  const diag = (ui.diagnostico_tela_att ?? {}) as Record<string, any>;
  const histLast = Array.isArray(ui.historico_reauditoria) ? ui.historico_reauditoria.at(-1) : undefined;
  const motivoRaw = (body.match(/> \*\*Motivo Técnico:\*\*([\s\S]*?)(?:\n\n|\n(?!>)|$)/) || [])[1] ?? '';
  const motivo = motivoRaw.replace(/\n> ?/g, ' ').replace(/\s+/g, ' ').trim();

  const fromMotivoStep = Number((motivo.match(/(?:No passo|do passo|o passo)\s+(\d+)/i) || [])[1]) || null;
  const blockedStep: number | null =
    (Number(diag.passo) || null) ??
    (Number(histLast?.bloqueio_atual?.passo) || null) ??
    fromMotivoStep;

  const steps = parseStepsFromBody(body);
  const blockedStepObj = steps.find(s => s.stepNumber === blockedStep);
  const blockedStepText = blockedStepObj?.rawText ?? '';

  const landingRejected =
    (/coer[eê]ncia p[oó]s-pouso/i.test(body) && /descartad/i.test(body)) ||
    /coer[eê]ncia p[oó]s-pouso/i.test(motivo);

  const warningMatch = body.match(/> \[!WARNING\] \*\*Bloqueio de auditoria neste passo:\*\*[^\n]*?\[([^\]]+)\]/);
  const warningTargets = warningMatch
    ? warningMatch[1].split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const exploracaoEntry = Array.isArray(ui.exploracao_investigativa)
    ? ui.exploracao_investigativa.find((e: any) => Number(e?.passo) === blockedStep)
    : undefined;
  const exploracaoTargets: string[] = Array.isArray(exploracaoEntry?.alvos_ausentes)
    ? exploracaoEntry.alvos_ausentes.map(String)
    : [];

  const autoCuraTargets: string[] = Array.isArray(ui.auto_cura?.divergencias_detectadas)
    ? ui.auto_cura.divergencias_detectadas
        .filter((d: any) => Number(d?.passo) === blockedStep && d?.camada === 'target_not_found')
        .map((d: any) => String(d?.alvo_documentado ?? ''))
    : [];

  const diagMissing: string[] = Array.isArray(diag.alvos_sem_correspondencia)
    ? diag.alvos_sem_correspondencia.map(String)
    : [];

  const missingTargets = cleanTargetList(
    diagMissing.length > 0
      ? diagMissing
      : exploracaoTargets.length > 0
        ? exploracaoTargets
        : warningTargets.length > 0
          ? warningTargets
          : autoCuraTargets.length > 0
            ? autoCuraTargets
            : blockedStepObj?.targets ?? []
  );

  const reachedRouteRaw = String(diag.rota ?? '');
  return {
    id: String(meta.id ?? ''),
    modulo: String(meta.modulo ?? moduloFromDir),
    titulo: String(meta.titulo ?? ''),
    carga: String(ui.carga ?? 'unknown'),
    tags,
    folderName,
    filePath,
    blockedStep,
    blockedStepText,
    steps,
    tipoBloqueio: String(ui.tipo_bloqueio ?? ''),
    motivo,
    landingRejected,
    reachedRouteRaw,
    reachedRouteKey: routeKey(reachedRouteRaw),
    missingTargets
  };
}

/** Resolve a tela do Catálogo Nível 2.5 correspondente à rota alcançada (direta, sub-estado `sub_route`, ou prefixo). */
export function matchCatalogScreenForRoute(
  route: string,
  screens: L2ScreenCatalogEntry[]
): { screen: L2ScreenCatalogEntry; via: 'direct_route' | 'sub_route' | 'parent_prefix'; matchedSubWhere?: ElementWhereLocation } | null {
  const clean = cleanRouteForMatch(route);
  if (!clean || HOME_ROUTES.has(clean)) return null;

  const direct = screens.find(s => cleanRouteForMatch(s.routeHash) === clean);
  if (direct) return { screen: direct, via: 'direct_route' };

  for (const s of screens) {
    const sub = (s.subStates ?? []).find(st => cleanRouteForMatch(st.routeHash) === clean);
    if (sub) {
      const subWhere: ElementWhereLocation | undefined =
        sub.openedAs === 'modal' || sub.kind === 'modal_opener' || sub.kind === 'form_opener'
          ? (`modal:${sub.triggerLabel}` as ElementWhereLocation)
          : sub.openedAs === 'tab'
            ? (`tab:${sub.triggerLabel}` as ElementWhereLocation)
            : undefined;
      return { screen: s, via: 'sub_route', matchedSubWhere: subWhere };
    }
  }

  const parentPrefix = clean.replace(/\/(cadastrar|alterar|editar|visualizar|detalhes)$/, '');
  if (parentPrefix !== clean) {
    const byPrefix = screens.find(s => cleanRouteForMatch(s.routeHash) === parentPrefix);
    if (byPrefix) return { screen: byPrefix, via: 'parent_prefix' };
  }
  return null;
}

function buildCatalogPool(screen: L2ScreenCatalogEntry): CatalogPoolItem[] {
  const all: AllKnownElements | undefined = screen.allKnownElements;
  const items: CatalogPoolItem[] = [];
  if (all) {
    const rootTabs = new Set((all.tabs ?? []).filter(t => (t.where ?? 'root') === 'root').map(t => normalizeText(t.label)));
    for (const t of all.tabs ?? []) {
      if (!t.label) continue;
      // Evita duplicatas da barra lateral de abas copiadas dentro de `tab:...` durante a captura L2
      const w = t.where ?? 'root';
      if (w.startsWith('tab:') && rootTabs.has(normalizeText(t.label))) continue;
      items.push({ kind: 'tab', label: t.label, where: w });
    }
    for (const b of all.buttons ?? []) {
      if (b.label) items.push({ kind: 'button', label: b.label, where: b.where ?? 'root' });
      if (b.tooltip && b.tooltip !== b.label) items.push({ kind: 'button', label: b.tooltip, where: b.where ?? 'root' });
    }
    for (const f of all.fields ?? []) {
      if (f.label) items.push({ kind: 'field', label: f.label, where: f.where ?? 'root' });
      for (const opt of f.options ?? []) {
        if (opt && !/^<\s*selecione\s*>$/i.test(opt) && opt.length >= 3) {
          items.push({ kind: 'field', label: opt, where: f.where ?? 'root' });
        }
      }
    }
    for (const h of all.tableHeaders ?? []) {
      if (h.header) items.push({ kind: 'tableHeader', label: h.header, where: h.where ?? 'root' });
    }
    for (const r of all.rowActions ?? []) {
      if (r.tooltip) items.push({ kind: 'rowAction', label: r.tooltip, where: r.where ?? 'grid_row' });
    }
  } else {
    for (const t of screen.tabs ?? []) if (t.label) items.push({ kind: 'tab', label: t.label, where: 'root' });
    for (const b of screen.buttons ?? []) {
      if (b.label) items.push({ kind: 'button', label: b.label, where: 'root' });
      if (b.tooltip && b.tooltip !== b.label) items.push({ kind: 'button', label: b.tooltip, where: 'root' });
    }
    for (const f of screen.fields ?? []) if (f.label) items.push({ kind: 'field', label: f.label, where: 'root' });
    for (const tbl of screen.tables ?? []) {
      for (const h of tbl.headers ?? []) items.push({ kind: 'tableHeader', label: h, where: 'root' });
    }
  }
  for (const h of screen.headings ?? []) {
    if (h) items.push({ kind: 'heading', label: h, where: 'root' });
  }
  return items;
}

function isStepMenuNavigation(report: ParsedAttReport): boolean {
  if (/caminho de menu/i.test(report.motivo)) return true;
  if (report.blockedStep != null && report.blockedStep <= 3) {
    const stepLike = { stepNumber: report.blockedStep, rawText: report.blockedStepText, targets: report.missingTargets } as RoutineStep;
    if (extractMenuPaths(stepLike).length > 0) return true;
    if (detectImplicitScreenNavigation(stepLike)) return true;
  }
  return false;
}

function checkDownstreamTargetsInScreen(
  report: ParsedAttReport,
  screen: L2ScreenCatalogEntry
): { matched: string[]; checked: string[] } {
  if (report.blockedStep == null) return { matched: [], checked: [] };
  const pool = buildCatalogPool(screen);
  const poolNorms = pool.map(p => normalizeText(p.label));
  const checked: string[] = [];
  const matched: string[] = [];
  for (const s of report.steps) {
    if (s.stepNumber <= report.blockedStep) continue;
    for (const t of s.targets) {
      if (t.includes('>')) continue;
      const tNorm = normalizeText(t);
      if (!tNorm || checked.includes(t)) continue;
      checked.push(t);
      const exactOrSyn =
        poolNorms.includes(tNorm) ||
        routeSynonymsFor(screen.routeHash, t).some(syn => syn.real.every(r => poolNorms.includes(normalizeText(r)))) ||
        poolNorms.some(p => computeDiceSimilarity(tNorm, p) >= 0.78);
      if (exactOrSyn) matched.push(t);
      if (checked.length >= 8) break;
    }
    if (checked.length >= 8) break;
  }
  return { matched, checked };
}

function resolveMenuForReport(
  report: ParsedAttReport,
  menuCatalog: MenuCatalog,
  canonicalItems: CanonicalMenuItem[],
  screens: L2ScreenCatalogEntry[]
): MenuResolutionSuggestion | undefined {
  if (report.blockedStep == null) return undefined;
  const stepLike = { stepNumber: report.blockedStep, rawText: report.blockedStepText, targets: report.missingTargets } as RoutineStep;
  const explicit = extractMenuPaths(stepLike);
  let documented = '';
  let basis = '';
  let resolvedChain: string[] | undefined;

  if (explicit.length > 0) {
    const segs = explicit[0].segments;
    documented = segs.join(' > ');
    const res = resolveCanonicalMenuPath(segs, canonicalItems);
    if (res) {
      resolvedChain = res.chain;
      basis = res.basis;
    } else {
      const leaf = segs[segs.length - 1];
      const single = resolveSingleSegmentScreen(leaf, { modulo: report.modulo, routineTitle: report.titulo }, menuCatalog);
      if (single.status === 'resolved') {
        resolvedChain = single.chain;
        basis = `folha_${single.basis}`;
      }
    }
  } else {
    const implicit = detectImplicitScreenNavigation(stepLike);
    if (implicit) {
      documented = implicit.label;
      const single = resolveSingleSegmentScreen(implicit.label, { modulo: report.modulo, routineTitle: report.titulo }, menuCatalog);
      if (single.status === 'resolved') {
        resolvedChain = single.chain;
        basis = single.basis;
      } else {
        const closed = resolveClosedSemantic(
          { stepTexts: report.steps.map(s => s.rawText), modulo: report.modulo, routineTitle: report.titulo },
          menuCatalog
        );
        if (closed.status === 'resolved') {
          resolvedChain = closed.chain;
          basis = 'closed_semantic';
        }
      }
    }
  }

  if (!resolvedChain || resolvedChain.length === 0) return undefined;

  const targetScreen = screens.find(
    s => Array.isArray(s.chain) && s.chain.length === resolvedChain!.length && s.chain.every((seg, i) => canonNormalize(seg) === canonNormalize(resolvedChain![i]))
  );
  const downstream = targetScreen
    ? checkDownstreamTargetsInScreen(report, targetScreen)
    : { matched: [], checked: [] };

  return {
    documented,
    basis,
    resolvedChain,
    targetScreenId: targetScreen?.id,
    targetRouteHash: targetScreen?.routeHash,
    downstreamMatchedTargets: downstream.matched,
    downstreamCheckedTargets: downstream.checked
  };
}

function screenHasPopulatedGridReveal(screen: L2ScreenCatalogEntry): boolean {
  return (screen.subStates ?? []).some(
    s => s.kind === 'search_grid_reveal' && (s.rowCount ?? 0) > 0
  );
}

function screenGridIsDefinitelyEmpty(screen: L2ScreenCatalogEntry): boolean {
  if (screenHasPopulatedGridReveal(screen)) return false;
  if (!screen.tables || screen.tables.length === 0) return false;
  return screen.tables.every(t => t.isEmpty || t.rowCount === 0);
}

function evaluateTargetAgainstPool(
  target: string,
  step: Pick<RoutineStep, 'rawText' | 'targets'>,
  routeHash: string,
  pool: CatalogPoolItem[]
): TargetTriageDiagnosis {
  const expectsControl = stepExpectsInteractiveControl(step);
  const allowGlobal = stepNamesGlobalSearch(step);
  const tNorm = normalizeText(target);
  const rejectedTableHeaders: string[] = [];

  const isAllowedItem = (item: CatalogPoolItem): { ok: boolean; veto?: string } => {
    if (!allowGlobal && isGlobalSearchName(item.label)) {
      return { ok: false, veto: 'ADR-035: busca global CTRL+B vetada' };
    }
    if (expectsControl && (item.kind === 'tableHeader' || item.kind === 'heading')) {
      return { ok: false, veto: 'ADR-035: cabeçalho de coluna (th) / título (heading) vetado em passo de controle interativo' };
    }
    return { ok: true };
  };

  // 1. Literal match in pool
  const literalHits: CatalogPoolItem[] = [];
  for (const item of pool) {
    if (normalizeText(item.label) !== tNorm) continue;
    const check = isAllowedItem(item);
    if (!check.ok) {
      if (item.kind === 'tableHeader') rejectedTableHeaders.push(item.label);
      continue;
    }
    literalHits.push(item);
  }
  if (literalHits.length > 0) {
    // Prefer substate hit if present, else root
    const subHit = literalHits.find(h => h.where !== 'root') ?? literalHits[0];
    const inSubState = subHit.where !== 'root';
    return {
      target,
      resolved: true,
      resolutionKind: inSubState ? 'literal_substate' : 'literal_root',
      bestMatch: {
        target,
        matchType: 'literal',
        matchedLabel: subHit.label,
        kind: subHit.kind,
        where: subHit.where,
        similarity: 1,
        inSubState
      },
      ...(rejectedTableHeaders.length ? { rejectedTableHeaders } : {})
    };
  }

  // 2. Existing routeSynonymsFor match in pool
  const syns = routeSynonymsFor(routeHash, target);
  for (const syn of syns) {
    const matchedItems: CatalogPoolItem[] = [];
    for (const realLabel of syn.real) {
      const rNorm = normalizeText(realLabel);
      const found = pool.find(item => normalizeText(item.label) === rNorm && isAllowedItem(item).ok);
      if (found) matchedItems.push(found);
    }
    if (matchedItems.length === syn.real.length && matchedItems.length > 0) {
      const primary = matchedItems[0];
      return {
        target,
        resolved: true,
        resolutionKind: 'route_synonym',
        bestMatch: {
          target,
          matchType: 'route_synonym',
          matchedLabel: matchedItems.map(m => m.label).join(' + '),
          kind: primary.kind,
          where: primary.where,
          similarity: 0.95,
          inSubState: primary.where !== 'root'
        },
        ...(rejectedTableHeaders.length ? { rejectedTableHeaders } : {})
      };
    }
  }

  // 3. Similar candidate (Sørensen-Dice >= 0.65) in pool
  let bestSim: CatalogCandidateMatch | undefined;
  for (const item of pool) {
    const score = computeDiceSimilarity(target, item.label);
    if (score < SIMILAR_MIN_SCORE) continue;
    const check = isAllowedItem(item);
    if (!check.ok) {
      if (item.kind === 'tableHeader') rejectedTableHeaders.push(item.label);
      continue;
    }
    if (!bestSim || score > bestSim.similarity) {
      bestSim = {
        target,
        matchType: 'similar',
        matchedLabel: item.label,
        kind: item.kind,
        where: item.where,
        similarity: Number(score.toFixed(2)),
        inSubState: item.where !== 'root'
      };
    }
  }

  const dedupRejected = Array.from(new Set(rejectedTableHeaders));

  if (bestSim) {
    return {
      target,
      resolved: true,
      resolutionKind: 'similar',
      bestMatch: bestSim,
      ...(dedupRejected.length ? { rejectedTableHeaders: dedupRejected } : {})
    };
  }

  return {
    target,
    resolved: false,
    ...(dedupRejected.length ? { rejectedTableHeaders: dedupRejected } : {})
  };
}

/** Classifica uma rotina `[ATT]` individual contra os catálogos Nível 2.5 e de Menus. */
export function classifyAttRoutine(
  report: ParsedAttReport,
  deps: {
    screens: L2ScreenCatalogEntry[];
    menuCatalog: MenuCatalog;
    canonicalItems: CanonicalMenuItem[];
    hardwareIds: Set<string>;
  }
): AttRoutineTriageEntry {
  const { screens, menuCatalog, canonicalItems, hardwareIds } = deps;
  const screenMatch = matchCatalogScreenForRoute(report.reachedRouteRaw, screens);
  const screen = screenMatch?.screen;
  const stepObj: Pick<RoutineStep, 'rawText' | 'targets'> = {
    rawText: report.blockedStepText,
    targets: report.missingTargets
  };

  // 1. Sinais de Hardware / Serviço Externo -> Fila 3
  const stepAndTitle = `${report.titulo} ${report.blockedStepText} ${report.missingTargets.join(' ')}`;
  if (hardwareIds.has(report.id) || HARDWARE_RE.test(stepAndTitle)) {
    return {
      ...report,
      matchedScreenId: screen?.id,
      matchedScreenChain: screen?.chain,
      matchedVia: screenMatch?.via,
      level2Status: screen?.level2Status,
      targetDiagnoses: [],
      queue: 'fila_3_ddd_xrx',
      subCause: '3_hardware_ou_servico_externo',
      priorityScore: 10,
      unlockMechanism: 'Requer hardware físico / serviço local (IntegradorSPCM, scanner, biometria, impressora)',
      evidenceSummary: `Dependência de hardware/serviço externo detectada (${report.id}).`
    };
  }

  // 2. Bloqueio de caminho de menu (Camada 1-3 ADR-037)
  const isMenuStep = isStepMenuNavigation(report);
  const homeScreen = HOME_ROUTES.has(cleanRouteForMatch(report.reachedRouteRaw));
  if (isMenuStep && (homeScreen || report.missingTargets.length === 0 || report.landingRejected)) {
    if (report.landingRejected) {
      return {
        ...report,
        matchedScreenId: screen?.id,
        matchedScreenChain: screen?.chain,
        matchedVia: screenMatch?.via,
        level2Status: screen?.level2Status,
        targetDiagnoses: [],
        queue: 'fila_2_att_legitimo',
        subCause: '2_lista_ouro_confirmada',
        priorityScore: 20,
        unlockMechanism: 'Coerência pós-pouso (ADR-037 Camada 4) descartou equivalência: conteúdo do manual defasado',
        evidenceSummary: 'Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real.'
      };
    }

    const menuSuggestion = resolveMenuForReport(report, menuCatalog, canonicalItems, screens);
    if (menuSuggestion) {
      // Se o catálogo achou a tela e há evidência downstream (ou nenhum alvo downstream falhou), é 1B destravável
      const hasCoherence =
        menuSuggestion.downstreamCheckedTargets.length === 0 ||
        menuSuggestion.downstreamMatchedTargets.length > 0;
      if (hasCoherence) {
        return {
          ...report,
          matchedScreenId: screen?.id,
          matchedScreenChain: screen?.chain,
          matchedVia: screenMatch?.via,
          level2Status: screen?.level2Status,
          targetDiagnoses: [],
          menuSuggestion,
          queue: 'fila_1_destravavel',
          subCause: '1B_menu_canonical',
          priorityScore: 85 + menuSuggestion.downstreamMatchedTargets.length * 2,
          unlockMechanism: `Menu canônico (${menuSuggestion.basis}): ${menuSuggestion.resolvedChain.join(' > ')}`,
          evidenceSummary: `Caminho "${menuSuggestion.documented}" -> "${menuSuggestion.resolvedChain.join(' > ')}" (tela ${menuSuggestion.targetScreenId ?? '?'}, ${menuSuggestion.downstreamMatchedTargets.length}/${menuSuggestion.downstreamCheckedTargets.length} alvos seguintes confirmados no catálogo).`
        };
      }
      return {
        ...report,
        matchedScreenId: screen?.id,
        matchedScreenChain: screen?.chain,
        matchedVia: screenMatch?.via,
        level2Status: screen?.level2Status,
        targetDiagnoses: [],
        menuSuggestion,
        queue: 'fila_2_att_legitimo',
        subCause: '2_lista_ouro_confirmada',
        priorityScore: 25,
        unlockMechanism: `Menu candidato ${menuSuggestion.resolvedChain.join(' > ')}, mas 0/${menuSuggestion.downstreamCheckedTargets.length} alvos seguintes existem na tela`,
        evidenceSummary: `Equivalência de menu encontrada, porém os passos seguintes citam recursos ausentes na tela ${menuSuggestion.targetScreenId ?? '?'}.`
      };
    }

    return {
      ...report,
      matchedScreenId: screen?.id,
      matchedScreenChain: screen?.chain,
      matchedVia: screenMatch?.via,
      level2Status: screen?.level2Status,
      targetDiagnoses: [],
      queue: 'fila_2_att_legitimo',
      subCause: '2_lista_ouro_confirmada',
      priorityScore: 15,
      unlockMechanism: 'Caminho/módulo sem equivalente na árvore canônica 06.05.02',
      evidenceSummary: 'Bloqueio em navegação de menu sem tela equivalente no catálogo canônico.'
    };
  }

  // 3. Tela alcançada: avaliar alvos contra allKnownElements (Catálogo Nível 2.5)
  const pool = screen ? buildCatalogPool(screen) : [];
  const targetDiagnoses = report.missingTargets.map(t =>
    evaluateTargetAgainstPool(t, stepObj, report.reachedRouteRaw, pool)
  );

  // Sinais de dependência de grade populada ou ato prévio
  const needsGrid =
    stepNeedsGridRows({ rawText: report.blockedStepText, targets: report.missingTargets }) ||
    EMPTY_GRID_MOTIVO_RE.test(report.motivo);
  const gridEmpty = !screen || screenGridIsDefinitelyEmpty(screen);
  const dependsOnEmptyGridRow =
    gridEmpty &&
    (needsGrid ||
      targetDiagnoses.some(d => d.bestMatch?.where === 'grid_row' || d.bestMatch?.kind === 'rowAction'));
  const allResolved = targetDiagnoses.length > 0 && targetDiagnoses.every(d => d.resolved);

  if (dependsOnEmptyGridRow && (!allResolved || targetDiagnoses.some(d => d.bestMatch?.where === 'grid_row'))) {
    return {
      ...report,
      matchedScreenId: screen?.id,
      matchedScreenChain: screen?.chain,
      matchedVia: screenMatch?.via,
      level2Status: screen?.level2Status,
      targetDiagnoses,
      queue: 'fila_3_ddd_xrx',
      subCause: '3_grade_vazia_ou_registro',
      priorityScore: 20,
      unlockMechanism: 'Ação de linha/grade depende de registro populado na tabela',
      evidenceSummary: `Passo exige registro na grade (${report.missingTargets.join(', ')}) e a tela ${screen?.id ?? report.reachedRouteKey} está sem linhas no catálogo.`
    };
  }

  if (!allResolved) {
    if (CROSS_ROUTINE_RE.test(`${report.motivo} ${report.blockedStepText}`)) {
      return {
        ...report,
        matchedScreenId: screen?.id,
        matchedScreenChain: screen?.chain,
        matchedVia: screenMatch?.via,
        level2Status: screen?.level2Status,
        targetDiagnoses,
        queue: 'fila_3_ddd_xrx',
        subCause: '3_ato_previo_xrx',
        priorityScore: 15,
        unlockMechanism: 'Depende de ato/protocolo previamente lavrado em outra rotina',
        evidenceSummary: `Alvos [${report.missingTargets.join(', ')}] dependem de registro/ato prévio.`
      };
    }
  }

  if (allResolved) {
    const hasSubstateOrLiteral = targetDiagnoses.every(
      d => d.resolutionKind === 'literal_substate' || d.resolutionKind === 'literal_root'
    );
    const hasSynonym = targetDiagnoses.some(d => d.resolutionKind === 'route_synonym');
    const hasSimilar = targetDiagnoses.some(d => d.resolutionKind === 'similar');

    if (hasSubstateOrLiteral && !hasSynonym && !hasSimilar) {
      const locations = targetDiagnoses
        .map(d => `${d.target} -> ${d.bestMatch?.where ?? 'root'}`)
        .join('; ');
      return {
        ...report,
        matchedScreenId: screen?.id,
        matchedScreenChain: screen?.chain,
        matchedVia: screenMatch?.via,
        level2Status: screen?.level2Status,
        targetDiagnoses,
        queue: 'fila_1_destravavel',
        subCause: '1A_substate_literal',
        priorityScore: 100 - (report.blockedStep ?? 5),
        unlockMechanism: `Catálogo L2.5 literal (${locations})`,
        evidenceSummary: `Todos os ${targetDiagnoses.length} alvo(s) existem literalmente na tela ${screen?.id ?? report.reachedRouteKey}: ${locations}.`
      };
    }

    // Há ao menos 1 route_synonym já homologado ou candidato similar >= 0.65
    const synReady = targetDiagnoses.every(
      d => d.resolutionKind !== 'similar'
    );
    const details = targetDiagnoses
      .map(d =>
        d.bestMatch?.matchType === 'literal'
          ? `${d.target} (${d.bestMatch.where})`
          : `${d.target} ~= ${d.bestMatch?.matchedLabel} [${d.bestMatch?.similarity}, ${d.bestMatch?.where}]`
      )
      .join('; ');
    return {
      ...report,
      matchedScreenId: screen?.id,
      matchedScreenChain: screen?.chain,
      matchedVia: screenMatch?.via,
      level2Status: screen?.level2Status,
      targetDiagnoses,
      queue: 'fila_1_destravavel',
      subCause: synReady ? '1A_substate_literal' : '1C_similar_candidate',
      priorityScore: synReady ? 92 : 70 + Math.round((targetDiagnoses[0]?.bestMatch?.similarity ?? 0.65) * 20),
      unlockMechanism: synReady
        ? `Sinônimo de rota já homologado + L2.5 (${details})`
        : `Candidato similar para curadoria em route-synonyms.ts (${details})`,
      evidenceSummary: `Tela ${screen?.id ?? report.reachedRouteKey}: ${details}.`
    };
  }

  // Fallback Fila 2: Lista Ouro confirmada (ao menos um alvo ausente em toda a tela e sub-estados)
  const missingList = targetDiagnoses.filter(d => !d.resolved).map(d => d.target);
  const partialList = targetDiagnoses
    .filter(d => d.resolved && d.bestMatch)
    .map(d => `${d.target} -> ${d.bestMatch!.matchedLabel} (${d.bestMatch!.where})`);
  const vetoNote = targetDiagnoses
    .flatMap(d => d.rejectedTableHeaders ?? [])
    .join(', ');

  return {
    ...report,
    matchedScreenId: screen?.id,
    matchedScreenChain: screen?.chain,
    matchedVia: screenMatch?.via,
    level2Status: screen?.level2Status,
    targetDiagnoses,
    queue: 'fila_2_att_legitimo',
    subCause: '2_lista_ouro_confirmada',
    priorityScore: 20,
    unlockMechanism: `Lista Ouro confirmada no Catálogo L2.5 (tela ${screen?.id ?? 'não mapeada'}, status ${screen?.level2Status ?? 'n/a'})`,
    evidenceSummary:
      `Ausente(s) em toda a superfície e sub-estados: [${missingList.join(', ')}]` +
      (partialList.length ? ` | Parciais: ${partialList.join('; ')}` : '') +
      (vetoNote ? ` | Vetado(s) ADR-035 (th): ${vetoNote}` : '')
  };
}

/** Executa a triagem offline completa das rotinas `[ATT]` em disco. */
export function triageAllAttRoutines(options: {
  rotinasDir?: string;
  screenCatalogPath?: string;
  menuCatalogPath?: string;
} = {}): TriageSummaryReport {
  const rotinasDir = options.rotinasDir ?? DEFAULT_ROTINAS_DIR;
  const screenCatalogPath = options.screenCatalogPath ?? DEFAULT_SCREEN_CATALOG_FILE;
  const menuCatalogPath = options.menuCatalogPath ?? DEFAULT_MENU_CATALOG_PATH;

  const screenCatalog = JSON.parse(fs.readFileSync(screenCatalogPath, 'utf-8')) as {
    version: string;
    screens: L2ScreenCatalogEntry[];
  };
  const menuCatalog = loadMenuCatalog(menuCatalogPath);
  const canonicalItems = catalogAsCanonicalItems(menuCatalog);
  const hardwareIds = listHardwareRoutineIds();

  const parsedReports: ParsedAttReport[] = [];
  for (const mod of fs.readdirSync(rotinasDir).sort()) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const folder of fs.readdirSync(modDir).sort()) {
      if (!folder.includes('[ATT]')) continue;
      const folderPath = path.join(modDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;
      const mdFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
      if (!mdFile) continue;
      const parsed = parseAttReportMarkdown(path.join(folderPath, mdFile), mod, folder);
      if (parsed) parsedReports.push(parsed);
    }
  }

  const routines = parsedReports.map(r =>
    classifyAttRoutine(r, {
      screens: screenCatalog.screens,
      menuCatalog,
      canonicalItems,
      hardwareIds
    })
  );

  const countsByQueue: Record<TriageQueueId, number> = {
    fila_1_destravavel: 0,
    fila_2_att_legitimo: 0,
    fila_3_ddd_xrx: 0
  };
  const countsBySubCause: Record<TriageSubCause, number> = {
    '1A_substate_literal': 0,
    '1B_menu_canonical': 0,
    '1C_similar_candidate': 0,
    '2_lista_ouro_confirmada': 0,
    '3_grade_vazia_ou_registro': 0,
    '3_ato_previo_xrx': 0,
    '3_hardware_ou_servico_externo': 0
  };
  const countsByModule: TriageSummaryReport['countsByModule'] = {};

  for (const r of routines) {
    countsByQueue[r.queue]++;
    countsBySubCause[r.subCause]++;
    if (!countsByModule[r.modulo]) {
      countsByModule[r.modulo] = { total: 0, fila1: 0, fila2: 0, fila3: 0 };
    }
    countsByModule[r.modulo].total++;
    if (r.queue === 'fila_1_destravavel') countsByModule[r.modulo].fila1++;
    else if (r.queue === 'fila_2_att_legitimo') countsByModule[r.modulo].fila2++;
    else countsByModule[r.modulo].fila3++;
  }

  // Ranking Top 12 Piloto A/B: prioriza config e firmas, depois demais módulos, ordenado por priorityScore
  const moduleWeight = (mod: string) => (mod === 'config' ? 25 : mod === 'firmas' ? 20 : 0);
  const pilotTop12 = [...routines]
    .filter(r => r.queue === 'fila_1_destravavel')
    .sort((a, b) => {
      const sa = a.priorityScore + moduleWeight(a.modulo);
      const sb = b.priorityScore + moduleWeight(b.modulo);
      if (sb !== sa) return sb - sa;
      return a.id.localeCompare(b.id);
    })
    .slice(0, 12)
    .map((r, i) => ({
      rank: i + 1,
      id: r.id,
      modulo: r.modulo,
      subCause: r.subCause,
      blockedStep: r.blockedStep,
      reachedRouteKey: r.reachedRouteKey,
      unlockMechanism: r.unlockMechanism,
      evidenceSummary: r.evidenceSummary
    }));

  const renameCandidates: TriageSummaryReport['renameCandidates'] = [];
  for (const r of routines) {
    for (const td of r.targetDiagnoses) {
      if (td.resolutionKind === 'similar' && td.bestMatch) {
        renameCandidates.push({
          id: r.id,
          modulo: r.modulo,
          routeKey: r.reachedRouteKey,
          screenId: r.matchedScreenId ?? '-',
          documented: td.target,
          candidateLabel: td.bestMatch.matchedLabel,
          kind: td.bestMatch.kind,
          where: td.bestMatch.where,
          similarity: td.bestMatch.similarity
        });
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    catalogVersion: screenCatalog.version,
    catalogScreens: screenCatalog.screens.length,
    totalAttRoutines: routines.length,
    countsByQueue,
    countsBySubCause,
    countsByModule,
    pilotTop12,
    renameCandidates,
    routines
  };
}

export function buildTriageMarkdown(report: TriageSummaryReport): string {
  const L: string[] = [];
  L.push('# Triagem Inteligente das 94 Rotinas `[ATT]` × Catálogo Nível 2.5');
  L.push('');
  L.push(`- **Versão do Catálogo:** ${report.catalogVersion} (${report.catalogScreens} telas mapeadas)`);
  L.push(`- **Gerado em:** ${report.generatedAt}`);
  L.push(`- **Total de Rotinas \`[ATT]\` Analisadas:** ${report.totalAttRoutines}`);
  L.push('');
  L.push('## 1. Resumo Executivo por Fila');
  L.push('');
  L.push('| Fila | Quantidade | % | Subcausas |');
  L.push('|---|---:|---:|---|');
  const pct = (n: number) => ((n / Math.max(1, report.totalAttRoutines)) * 100).toFixed(1) + '%';
  L.push(
    `| **Fila 1 — Destraváveis Agora** | ${report.countsByQueue.fila_1_destravavel} | ${pct(report.countsByQueue.fila_1_destravavel)} | 1A Sub-estado/Literal: **${report.countsBySubCause['1A_substate_literal']}** · 1B Menu Canônico: **${report.countsBySubCause['1B_menu_canonical']}** · 1C Similar/Renomeação: **${report.countsBySubCause['1C_similar_candidate']}** |`
  );
  L.push(
    `| **Fila 2 — \`[ATT]\` Legítimo (Lista Ouro)** | ${report.countsByQueue.fila_2_att_legitimo} | ${pct(report.countsByQueue.fila_2_att_legitimo)} | Confirmadas ausentes no Orion TN ${report.catalogVersion}: **${report.countsBySubCause['2_lista_ouro_confirmada']}** |`
  );
  L.push(
    `| **Fila 3 — Dependência Dados / Fluxo / HW** | ${report.countsByQueue.fila_3_ddd_xrx} | ${pct(report.countsByQueue.fila_3_ddd_xrx)} | Grade vazia: **${report.countsBySubCause['3_grade_vazia_ou_registro']}** · Ato prévio \`[XRX]\`: **${report.countsBySubCause['3_ato_previo_xrx']}** · Hardware/Serviço: **${report.countsBySubCause['3_hardware_ou_servico_externo']}** |`
  );
  L.push('');
  L.push('## 2. Distribuição por Módulo');
  L.push('');
  L.push('| Módulo | Total `[ATT]` | Fila 1 (Destraváveis) | Fila 2 (`[ATT]` Legítimo) | Fila 3 (`[DDD]`/`[XRX]`) |');
  L.push('|---|---:|---:|---:|---:|');
  for (const mod of Object.keys(report.countsByModule).sort()) {
    const c = report.countsByModule[mod];
    L.push(`| ${mod} | ${c.total} | ${c.fila1} | ${c.fila2} | ${c.fila3} |`);
  }
  L.push('');
  L.push('## 3. Top 12 Sugeridas para o Piloto A/B Ao Vivo (Priorizando `config` e `firmas`)');
  L.push('');
  L.push('| # | ID | Módulo | Subcausa | Passo | Rota | Mecanismo de Destravamento |');
  L.push('|---:|---|---|---|---:|---|---|');
  for (const p of report.pilotTop12) {
    L.push(`| ${p.rank} | ${p.id} | ${p.modulo} | \`${p.subCause}\` | ${p.blockedStep ?? '-'} | \`${p.reachedRouteKey}\` | ${p.unlockMechanism} |`);
  }
  L.push('');
  L.push(`**IDs do Piloto A/B:** \`${report.pilotTop12.map(p => p.id).join(',')}\``);
  L.push('');
  L.push('## 4. Candidatos de Renomeação (Similares `1C` para Curadoria na Etapa 2)');
  L.push('');
  if (report.renameCandidates.length === 0) {
    L.push('_Nenhum candidato `1C` pendente._');
  } else {
    L.push('| ID | Módulo | Tela | Rota | Termo no Manual | Candidato Real UI | Tipo | `where` | Sim. |');
    L.push('|---|---|---|---|---|---|---|---|---:|');
    for (const c of report.renameCandidates) {
      L.push(
        `| ${c.id} | ${c.modulo} | ${c.screenId} | \`${c.routeKey}\` | **${c.documented}** | **${c.candidateLabel}** | \`${c.kind}\` | \`${c.where}\` | ${c.similarity.toFixed(2)} |`
      );
    }
  }
  L.push('');

  const appendQueueSection = (title: string, queueId: TriageQueueId) => {
    const items = report.routines.filter(r => r.queue === queueId);
    L.push(`## ${title} (${items.length})`);
    L.push('');
    L.push('| ID | Módulo | Subcausa | Passo | Rota | Alvos Faltantes | Evidência / Diagnóstico L2.5 |');
    L.push('|---|---|---|---:|---|---|---|');
    for (const r of items) {
      const targets = r.missingTargets.length ? r.missingTargets.join(', ') : '(navegação de menu)';
      L.push(
        `| ${r.id} | ${r.modulo} | \`${r.subCause}\` | ${r.blockedStep ?? '-'} | \`${r.reachedRouteKey}\` | ${targets} | ${r.evidenceSummary.replace(/\|/g, '/')} |`
      );
    }
    L.push('');
  };

  appendQueueSection('5. Fila 1 — Destraváveis Agora', 'fila_1_destravavel');
  appendQueueSection('6. Fila 2 — Defasagem Real do Manual Confirmada (`[ATT]` Legítimo)', 'fila_2_att_legitimo');
  appendQueueSection('7. Fila 3 — Dependência de Dados / Fluxo Prévio / Hardware', 'fila_3_ddd_xrx');

  return L.join('\n');
}

function main(): void {
  const report = triageAllAttRoutines();
  fs.mkdirSync(path.dirname(DEFAULT_TRIAGE_JSON_OUT), { recursive: true });
  fs.writeFileSync(DEFAULT_TRIAGE_JSON_OUT, JSON.stringify(report, null, 2), 'utf-8');
  fs.writeFileSync(DEFAULT_TRIAGE_MD_OUT, buildTriageMarkdown(report), 'utf-8');

  console.log('====================================================');
  console.log('  TRIAGEM OFFLINE 94 [ATT] x CATÁLOGO NÍVEL 2.5     ');
  console.log('====================================================');
  console.log(`  Total [ATT] analisadas:        ${report.totalAttRoutines}`);
  console.log(`  - Fila 1 (Destraváveis agora): ${report.countsByQueue.fila_1_destravavel}`);
  console.log(`      · 1A Sub-estado/Literal:   ${report.countsBySubCause['1A_substate_literal']}`);
  console.log(`      · 1B Menu Canônico:        ${report.countsBySubCause['1B_menu_canonical']}`);
  console.log(`      · 1C Similar/Renomeação:   ${report.countsBySubCause['1C_similar_candidate']}`);
  console.log(`  - Fila 2 ([ATT] Legítimo):     ${report.countsByQueue.fila_2_att_legitimo}`);
  console.log(`  - Fila 3 ([DDD]/[XRX]/HW):     ${report.countsByQueue.fila_3_ddd_xrx}`);
  console.log(`  JSON: ${path.relative(process.cwd(), DEFAULT_TRIAGE_JSON_OUT)}`);
  console.log(`  MD:   ${path.relative(process.cwd(), DEFAULT_TRIAGE_MD_OUT)}`);
  console.log(`  Top 12 Piloto: ${report.pilotTop12.map(p => p.id).join(',')}`);
  console.log('====================================================');
}

if (process.argv[1] && /triage-att-with-catalog\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) {
  main();
}
