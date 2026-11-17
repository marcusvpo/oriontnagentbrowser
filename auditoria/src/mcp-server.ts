import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js';
import { config } from './config.js';
import { findRevisedMarkdownById } from './governance-disk.js';
import { findRoutineFileById, PHASES } from './phases.js';
import { parseRoutineMarkdown } from './parser.js';
import {
  normalizeReviewTags,
  reviewTagsFor,
  isReviewStatus,
  stripReviewPrefix,
  tagsFromPrefix,
  type ReviewTag
} from './review-taxonomy.js';
import { mineClusters, type ClusterId, type MinedRoutine } from './mine-att-clusters.js';
import { loadCachedRouteGraph, findRouteEntriesByTabOrSection, type CrawledRouteEntry } from './route-crawler.js';
import { canonNormalize, EXPLICIT_MENU_EQUIVALENCES } from './menu-canonical.js';
import { createPgClient, SUPABASE_DB_URL } from './supabase.js';
import {
  getCachedHumanReviewsKnowledge,
  upsertVisualCuratedTargetOverride
} from './human-review-rag.js';
import {
  readPendingSomQueue,
  writePendingSomQueue,
  type PendingSomQueueItem
} from './smart-locator.js';
import { routeKey, upsertCuratedRouteSynonym, type RouteSynonymKind } from './route-synonyms.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const projectRoot = path.resolve(auditoriaRoot, '..');
const rotinasDir = path.join(auditoriaRoot, 'rotinas');
const kbTelemetryDir = path.join(auditoriaRoot, 'cache', 'kb-telemetry');

export interface InspectRoutineResult {
  found: boolean;
  routineId: string;
  audited: boolean;
  titulo?: string;
  modulo?: string;
  secao?: string;
  phase?: number | null;
  statusAuditoria: string;
  statusGovernanca: string;
  reviewTags: ReviewTag[];
  frontmatterYaml: string;
  auditoriaUi: Record<string, any> | null;
  divergencias: any[];
  diagnosticoTelaAtt: Record<string, any> | null;
  blockedStep: {
    stepNumber: number | null;
    tipoBloqueio?: string;
    motivoTecnico?: string;
    stepText?: string;
  } | null;
  webpImages: string[];
  revisedMarkdownPath: string | null;
  kbMarkdownPath: string | null;
}

function getPhaseNumberForRoutine(id: string, modulo: string): number | null {
  if (id === 'D-1.1' || id === 'R-1.1') return 1;
  if (modulo === 'acesso' || modulo === 'config') return 2;
  if (['firmas', 'selos', 'livros', 'certidoes', 'centrais'].includes(modulo)) return 3;
  if (modulo === 'caixa') return 4;
  if (modulo === 'notas') return 5;
  return null;
}

/**
 * Tool 1: `inspect_routine({ routineId })`
 * Retorna status atual, frontmatter YAML, divergências, `diagnostico_tela_att`,
 * passo onde bloqueou e caminhos das imagens `.webp`.
 */
export function inspectRoutine(params: { routineId: string }): InspectRoutineResult {
  const routineId = String(params.routineId || '').trim();
  const revPath = findRevisedMarkdownById(routineId);
  const kbPath = findRoutineFileById(routineId);

  if (!revPath && !kbPath) {
    return {
      found: false,
      routineId,
      audited: false,
      statusAuditoria: 'nao_encontrada',
      statusGovernanca: 'pendente_aprovacao',
      reviewTags: [],
      frontmatterYaml: '',
      auditoriaUi: null,
      divergencias: [],
      diagnosticoTelaAtt: null,
      blockedStep: null,
      webpImages: [],
      revisedMarkdownPath: null,
      kbMarkdownPath: null
    };
  }

  if (!revPath) {
    const parsed = parseRoutineMarkdown(kbPath!);
    const rawKb = fs.readFileSync(kbPath!, 'utf8').replace(/\r\n/g, '\n');
    const fmParts = rawKb.split(/^---$/m);
    const fmYaml = fmParts.length >= 2 ? fmParts[1].trim() : '';
    return {
      found: true,
      routineId,
      audited: false,
      titulo: parsed.titulo,
      modulo: parsed.modulo,
      secao: parsed.secao,
      phase: getPhaseNumberForRoutine(routineId, parsed.modulo),
      statusAuditoria: 'nao_auditada',
      statusGovernanca: 'pendente_aprovacao',
      reviewTags: [],
      frontmatterYaml: fmYaml,
      auditoriaUi: null,
      divergencias: [],
      diagnosticoTelaAtt: null,
      blockedStep: null,
      webpImages: [],
      revisedMarkdownPath: null,
      kbMarkdownPath: path.relative(projectRoot, kbPath!).replace(/\\/g, '/')
    };
  }

  const rawRev = fs.readFileSync(revPath, 'utf8').replace(/\r\n/g, '\n');
  const parts = rawRev.split(/^---$/m);
  const frontmatterYaml = parts.length >= 2 ? parts[1].trim() : '';
  const fm = frontmatterYaml ? yaml.parse(frontmatterYaml) || {} : {};
  const body = parts.slice(2).join('---');
  const ui = fm.auditoria_ui || {};
  const folderDir = path.dirname(revPath);
  const folderName = path.basename(folderDir);
  const modulo = String(fm.modulo || path.basename(path.dirname(folderDir)) || 'geral');
  const statusAuditoria = String(ui.status || 'validado_inalterado');
  const statusGovernanca = String(ui.status_governanca || 'pendente_aprovacao');

  const reviewTags = normalizeReviewTags([
    ...(Array.isArray(ui.review_tags) ? ui.review_tags : []),
    ...tagsFromPrefix(folderName),
    ...(isReviewStatus(statusAuditoria) ? reviewTagsFor(statusAuditoria) : [])
  ]);

  const divergencias = Array.isArray(ui.auto_cura?.divergencias_detectadas)
    ? ui.auto_cura.divergencias_detectadas
    : [];
  const diagnosticoTelaAtt = ui.diagnostico_tela_att || null;

  // Coleta imagens .webp na pasta da rotina
  const webpImages = fs
    .readdirSync(folderDir)
    .filter(f => f.toLowerCase().endsWith('.webp'))
    .sort()
    .map(f => path.relative(projectRoot, path.join(folderDir, f)).replace(/\\/g, '/'));

  // Identifica passo onde bloqueou (telemetria, diagnostico_tela_att, historico ou texto)
  let blockedStepNum: number | null = null;
  if (typeof diagnosticoTelaAtt?.passo === 'number') {
    blockedStepNum = diagnosticoTelaAtt.passo;
  }
  const telPath = path.join(kbTelemetryDir, `${routineId}.json`);
  if (blockedStepNum === null && fs.existsSync(telPath)) {
    try {
      const telEntries = JSON.parse(fs.readFileSync(telPath, 'utf8'));
      if (Array.isArray(telEntries)) {
        const b = telEntries.find((e: any) => e.status === 'blocked');
        if (b && typeof b.stepNum === 'number') blockedStepNum = b.stepNum;
      }
    } catch {}
  }
  const motivoMatch = body.match(/> \*\*Motivo Técnico:\*\*\s*([\s\S]*?)(?=\n\n|\n[^>])/);
  const motivoTecnico = motivoMatch ? motivoMatch[1].replace(/\n>\s?/g, ' ').trim() : undefined;
  if (blockedStepNum === null && motivoTecnico) {
    const m = motivoTecnico.match(/passo\s+(\d+)/i);
    if (m) blockedStepNum = parseInt(m[1], 10);
  }

  let blockedStep: InspectRoutineResult['blockedStep'] = null;
  if (ui.tipo_bloqueio || motivoTecnico || blockedStepNum !== null) {
    let stepText: string | undefined;
    if (blockedStepNum !== null) {
      const stepRe = new RegExp(`^\\s*${blockedStepNum}\\.\\s+(.+)$`, 'm');
      const sm = body.match(stepRe);
      if (sm) stepText = sm[1].trim();
    }
    blockedStep = {
      stepNumber: blockedStepNum,
      tipoBloqueio: ui.tipo_bloqueio,
      motivoTecnico,
      stepText
    };
  }

  return {
    found: true,
    routineId,
    audited: true,
    titulo: fm.titulo,
    modulo,
    secao: fm.secao,
    phase: getPhaseNumberForRoutine(routineId, modulo),
    statusAuditoria,
    statusGovernanca,
    reviewTags,
    frontmatterYaml,
    auditoriaUi: ui,
    divergencias,
    diagnosticoTelaAtt,
    blockedStep,
    webpImages,
    revisedMarkdownPath: path.relative(projectRoot, revPath).replace(/\\/g, '/'),
    kbMarkdownPath: kbPath ? path.relative(projectRoot, kbPath).replace(/\\/g, '/') : null
  };
}

export interface QueryClustersParams {
  tag?: string;
  modulo?: string;
  phase?: number;
}

export interface QueryClustersResult {
  filters: QueryClustersParams;
  totalMatching: number;
  byStatus: Record<string, number>;
  byTag: Record<ReviewTag, number>;
  byCluster: Record<ClusterId, number>;
  routines: Array<{
    id: string;
    titulo: string;
    modulo: string;
    phase: number | null;
    statusAuditoria: string;
    statusGovernanca: string;
    reviewTags: ReviewTag[];
    divergenciasCount: number;
    cluster?: ClusterId;
    subcausa?: string;
    blockedStep?: number | null;
  }>;
}

/**
 * Tool 2: `query_clusters({ tag?, modulo?, phase? })`
 * Retorna o resumo agrupado de `[ATT]`, `[CCC]`, `[DDD]`, `[XRX]`, `validado_com_ajustes`
 * e `validado_inalterado`, cruzando com a mineração de clusters A/B/C/D (ADR-029).
 */
export function queryClusters(params: QueryClustersParams = {}): QueryClustersResult {
  const wantedTag = params.tag ? String(params.tag).replace(/[\[\]]/g, '').trim().toUpperCase() : undefined;
  const wantedModulo = params.modulo ? String(params.modulo).trim().toLowerCase() : undefined;
  const wantedPhase = params.phase !== undefined && params.phase !== null ? Number(params.phase) : undefined;

  let minedMap = new Map<string, MinedRoutine>();
  try {
    if (fs.existsSync(rotinasDir)) {
      const mined = mineClusters({
        rotinasDir,
        telemetryDir: kbTelemetryDir,
        menuTreeFile: path.join(auditoriaRoot, 'cache', 'orion-menu-tree-real.json')
      });
      minedMap = new Map(mined.routines.map(r => [r.id, r]));
    }
  } catch {}

  const byStatus: Record<string, number> = {
    validado_inalterado: 0,
    validado_com_ajustes: 0,
    atualizacao_editorial: 0,
    comunicacao_externa: 0,
    dependencia_dados_banco: 0,
    dependencia_cruzada_rotina: 0
  };
  const byTag: Record<ReviewTag, number> = { ATT: 0, CCC: 0, DDD: 0, XRX: 0 };
  const byCluster: Record<ClusterId, number> = { A: 0, B: 0, C: 0, D: 0 };
  const routines: QueryClustersResult['routines'] = [];

  if (fs.existsSync(rotinasDir)) {
    const latestByRoutine = new Map<
      string,
      { fm: any; folderName: string; modulo: string; mtimeMs: number }
    >();

    for (const mod of fs.readdirSync(rotinasDir)) {
      const modDir = path.join(rotinasDir, mod);
      if (!fs.statSync(modDir).isDirectory()) continue;
      for (const folder of fs.readdirSync(modDir)) {
        const folderPath = path.join(modDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        const revFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
        if (!revFile) continue;
        const revPath = path.join(folderPath, revFile);
        try {
          const raw = fs.readFileSync(revPath, 'utf8').replace(/\r\n/g, '\n');
          const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
          if (!fmMatch) continue;
          const fm = yaml.parse(fmMatch[1]) || {};
          const id = String(fm.id || '').trim();
          if (!id) continue;
          const mtimeMs = fs.statSync(revPath).mtimeMs;
          const prev = latestByRoutine.get(id);
          if (!prev || mtimeMs > prev.mtimeMs) {
            latestByRoutine.set(id, { fm, folderName: folder, modulo: mod, mtimeMs });
          }
        } catch {}
      }
    }

    for (const [id, entry] of latestByRoutine.entries()) {
      const { fm, folderName, modulo } = entry;
      const ui = fm.auditoria_ui || {};
      const statusAuditoria = String(ui.status || 'validado_inalterado');
      const statusGovernanca = String(ui.status_governanca || 'pendente_aprovacao');
      const phase = getPhaseNumberForRoutine(id, modulo);
      const reviewTags = normalizeReviewTags([
        ...(Array.isArray(ui.review_tags) ? ui.review_tags : []),
        ...tagsFromPrefix(folderName),
        ...(isReviewStatus(statusAuditoria) ? reviewTagsFor(statusAuditoria) : [])
      ]);

      if (wantedModulo && modulo.toLowerCase() !== wantedModulo) continue;
      if (wantedPhase !== undefined && phase !== wantedPhase) continue;
      if (wantedTag) {
        const matchesTag =
          reviewTags.includes(wantedTag as ReviewTag) ||
          statusAuditoria.toUpperCase() === wantedTag;
        if (!matchesTag) continue;
      }

      byStatus[statusAuditoria] = (byStatus[statusAuditoria] || 0) + 1;
      for (const t of reviewTags) {
        if (t in byTag) byTag[t]++;
      }

      const mined = minedMap.get(id);
      if (mined) {
        byCluster[mined.cluster] = (byCluster[mined.cluster] || 0) + 1;
      }

      const divs = Array.isArray(ui.auto_cura?.divergencias_detectadas)
        ? ui.auto_cura.divergencias_detectadas.length
        : 0;

      routines.push({
        id,
        titulo: String(fm.titulo || id),
        modulo,
        phase,
        statusAuditoria,
        statusGovernanca,
        reviewTags,
        divergenciasCount: divs,
        cluster: mined?.cluster,
        subcausa: mined?.subcausa,
        blockedStep: mined?.passo ?? ui.diagnostico_tela_att?.passo ?? null
      });
    }
  }

  routines.sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true }));

  return {
    filters: params,
    totalMatching: routines.length,
    byStatus,
    byTag,
    byCluster,
    routines
  };
}

export interface SearchOrionTreeResult {
  query: string;
  routeGraphMatches: Array<{
    modulo: string;
    chain: string[];
    hash: string;
    title: string;
    tabs: string[];
    sections: string[];
    matchedIn?: string;
    score?: number;
  }>;
  menuTreeMatches: Array<{
    chain: string[];
    disabled?: boolean;
  }>;
  canonicalEquivalences: Array<{
    documented: string;
    real: string;
    reason: string;
  }>;
  glossarioMatches: string[];
}

/**
 * Tool 3: `search_orion_tree({ query })`
 * Busca rotas hash, menus reais e seções no `auditoria/cache/orion-route-graph.json`,
 * na árvore real de menus e no `.agents/memory/standards/glossario_siplan.md`.
 */
export function searchOrionTree(params: { query: string }): SearchOrionTreeResult {
  const query = String(params.query || '').trim();
  const qNorm = canonNormalize(query);
  const tokens = qNorm.split(/\s+/).filter(t => t.length >= 2);

  const matchesTokens = (text: string): boolean => {
    const tNorm = canonNormalize(text);
    if (!tNorm) return false;
    if (tNorm.includes(qNorm)) return true;
    return tokens.length > 0 && tokens.every(tok => tNorm.includes(tok));
  };

  const graph = loadCachedRouteGraph();
  const routeGraphMatches: SearchOrionTreeResult['routeGraphMatches'] = [];
  const seenHashes = new Set<string>();

  if (graph && Array.isArray(graph.entries)) {
    const tabSectionHits = findRouteEntriesByTabOrSection(query, graph);
    for (const h of tabSectionHits) {
      const key = `${h.entry.chain.join('>')}|${h.entry.hash}`;
      seenHashes.add(key);
      routeGraphMatches.push({
        modulo: h.entry.modulo,
        chain: h.entry.chain,
        hash: h.entry.hash,
        title: h.entry.title,
        tabs: h.entry.tabs || [],
        sections: h.entry.sections || [],
        matchedIn: `${h.matchedIn}:${h.matchedLabel}`,
        score: h.score
      });
    }

    for (const entry of graph.entries) {
      const key = `${entry.chain.join('>')}|${entry.hash}`;
      if (seenHashes.has(key)) continue;
      const haystack = [
        entry.modulo,
        ...entry.chain,
        entry.hash,
        entry.title,
        ...(entry.tabs || []),
        ...(entry.sections || []),
        ...(entry.fields || []),
        ...(entry.buttons || [])
      ].join(' ');
      if (matchesTokens(haystack) || (query.startsWith('#/') && entry.hash.toLowerCase().includes(query.toLowerCase()))) {
        seenHashes.add(key);
        routeGraphMatches.push({
          modulo: entry.modulo,
          chain: entry.chain,
          hash: entry.hash,
          title: entry.title,
          tabs: entry.tabs || [],
          sections: entry.sections || [],
          matchedIn: 'chain_or_hash',
          score: 0.75
        });
      }
    }
  }

  // Busca na árvore de menus real se disponível em cache
  const menuTreeMatches: SearchOrionTreeResult['menuTreeMatches'] = [];
  const menuTreePath = path.join(auditoriaRoot, 'cache', 'orion-menu-tree-real.json');
  if (fs.existsSync(menuTreePath)) {
    try {
      const rawTree = JSON.parse(fs.readFileSync(menuTreePath, 'utf8'));
      const items = Array.isArray(rawTree?.items) ? rawTree.items : [];
      for (const item of items) {
        const chain: string[] = Array.isArray(item.chain) ? item.chain : [];
        if (matchesTokens(chain.join(' > '))) {
          menuTreeMatches.push({ chain, disabled: Boolean(item.disabled) });
        }
      }
    } catch {}
  }

  // Equivalências canônicas de menu (ADR-029)
  const canonicalEquivalences = EXPLICIT_MENU_EQUIVALENCES.filter(
    eq => matchesTokens(eq.documented.join(' > ')) || matchesTokens(eq.real.join(' > '))
  ).map(eq => ({
    documented: eq.documented.join(' > '),
    real: eq.real.join(' > '),
    reason: eq.evidence
  }));

  // Busca linhas relevantes em glossario_siplan.md e permiss_es_oriontn_4tabeliao_scs.md
  const glossarioMatches: string[] = [];
  const docFiles = [
    path.join(projectRoot, '.agents', 'memory', 'standards', 'glossario_siplan.md'),
    path.join(auditoriaRoot, 'reports', 'permiss_es_oriontn_4tabeliao_scs.md')
  ];
  for (const docFile of docFiles) {
    if (!fs.existsSync(docFile)) continue;
    try {
      const lines = fs.readFileSync(docFile, 'utf8').replace(/\r\n/g, '\n').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (matchesTokens(trimmed)) {
          glossarioMatches.push(`[${path.basename(docFile)}] ${trimmed.slice(0, 220)}`);
          if (glossarioMatches.length >= 25) break;
        }
      }
    } catch {}
    if (glossarioMatches.length >= 25) break;
  }

  return {
    query,
    routeGraphMatches: routeGraphMatches.slice(0, 25),
    menuTreeMatches: menuTreeMatches.slice(0, 25),
    canonicalEquivalences,
    glossarioMatches
  };
}

export interface ListHumanReviewsResult {
  source: 'pg_pooler' | 'local_cache';
  totalReviews: number;
  governanceCounts: Record<string, number>;
  reviews: Array<{
    id: string;
    routineId: string;
    rotinaTitulo?: string;
    rotinaModulo?: string;
    statusAuditoria?: string;
    statusGovernanca?: string;
    revisor: string;
    categoria: string;
    passos: number[];
    motivo: string;
    resolucao?: string | null;
    status: string;
    versao: number;
    atualizadoEm?: string;
  }>;
}

/**
 * Tool 4: `list_human_reviews()`
 * Consulta diretamente via Pooler PostgreSQL IPv4 (`pg`) as revisões humanas em `routine_reviews`
 * e o status de governança em `routines` (com fallback gracioso para `human-reviews-cache.json`).
 */
export async function listHumanReviews(options: {
  customPgQuery?: (sql: string, values?: any[]) => Promise<{ rows: any[] }>;
} = {}): Promise<ListHumanReviewsResult> {
  if (options.customPgQuery || SUPABASE_DB_URL) {
    let client: ReturnType<typeof createPgClient> | null = null;
    try {
      let runQuery = options.customPgQuery;
      if (!runQuery) {
        const pgClient = createPgClient();
        client = pgClient;
        await pgClient.connect();
        runQuery = (sql: string, values?: any[]) => pgClient.query(sql, values);
      }

      const reviewsRes = await runQuery(`
        SELECT
          rr.id,
          rr.routine_id,
          rr.revisor,
          rr.categoria,
          rr.passos,
          rr.motivo,
          rr.resolucao,
          rr.status,
          rr.versao,
          rr.atualizado_em,
          r.titulo AS rotina_titulo,
          r.modulo AS rotina_modulo,
          r.status_auditoria,
          r.status_governanca
        FROM routine_reviews rr
        LEFT JOIN routines r ON r.id = rr.routine_id
        ORDER BY rr.atualizado_em DESC NULLS LAST
      `);

      const govRes = await runQuery(`
        SELECT status_governanca, COUNT(*)::int AS total
        FROM routines
        GROUP BY status_governanca
      `);

      const governanceCounts: Record<string, number> = {};
      for (const row of govRes.rows || []) {
        governanceCounts[String(row.status_governanca || 'pendente_aprovacao')] = Number(row.total || 0);
      }

      const reviews = (reviewsRes.rows || []).map((row: any) => ({
        id: String(row.id),
        routineId: String(row.routine_id),
        rotinaTitulo: row.rotina_titulo ? String(row.rotina_titulo) : undefined,
        rotinaModulo: row.rotina_modulo ? String(row.rotina_modulo) : undefined,
        statusAuditoria: row.status_auditoria ? String(row.status_auditoria) : undefined,
        statusGovernanca: row.status_governanca ? String(row.status_governanca) : undefined,
        revisor: String(row.revisor || ''),
        categoria: String(row.categoria || 'outro'),
        passos: Array.isArray(row.passos) ? row.passos.map(Number) : [],
        motivo: String(row.motivo || ''),
        resolucao: row.resolucao ?? null,
        status: String(row.status || 'aberta'),
        versao: Number(row.versao || 1),
        atualizadoEm: row.atualizado_em ? new Date(row.atualizado_em).toISOString() : undefined
      }));

      return {
        source: 'pg_pooler',
        totalReviews: reviews.length,
        governanceCounts,
        reviews
      };
    } catch {
      // Fallback para cache local quando sem rede/VPN
    } finally {
      if (client) {
        await client.end().catch(() => undefined);
      }
    }
  }

  const kb = getCachedHumanReviewsKnowledge();
  return {
    source: 'local_cache',
    totalReviews: kb.reviews.length,
    governanceCounts: {},
    reviews: kb.reviews.map(r => ({
      id: r.id,
      routineId: r.routineId,
      revisor: r.revisor,
      categoria: r.categoria,
      passos: r.passos,
      motivo: r.motivo,
      status: r.status,
      versao: r.versao,
      atualizadoEm: r.atualizadoEm
    }))
  };
}

export interface TriggerSingleReauditResult {
  ok: boolean;
  routineId: string;
  commandArgs: string[];
  exitCode: number;
  stdoutTail: string;
  stderrTail: string;
  routineSnapshot: InspectRoutineResult;
}

/**
 * Tool 5: `trigger_single_reaudit({ routineId, headless? })`
 * Dispara a reauditoria segura (`--routines <id> --dry-run-mutations`) de uma rotina específica.
 */
export async function triggerSingleReaudit(
  params: { routineId: string; headless?: boolean },
  options: {
    customSpawn?: (args: string[]) => Promise<{ exitCode: number; stdout: string; stderr: string }>;
  } = {}
): Promise<TriggerSingleReauditResult> {
  const routineId = String(params.routineId || '').trim();
  if (!routineId) {
    throw new Error('routineId é obrigatório para trigger_single_reaudit');
  }
  const headless = params.headless !== false;
  const tsxCli = path.join(auditoriaRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  const commandArgs = [
    tsxCli,
    'src/cli.ts',
    '--routines',
    routineId,
    '--dry-run-mutations',
    headless ? '--headless' : '--headed'
  ];

  const execResult = options.customSpawn
    ? await options.customSpawn(commandArgs)
    : await new Promise<{ exitCode: number; stdout: string; stderr: string }>(resolve => {
        const child = spawn(process.execPath, commandArgs, {
          cwd: auditoriaRoot,
          shell: false,
          stdio: ['ignore', 'pipe', 'pipe']
        });
        let stdout = '';
        let stderr = '';
        child.stdout?.on('data', chunk => {
          stdout = (stdout + String(chunk)).slice(-2000);
        });
        child.stderr?.on('data', chunk => {
          stderr = (stderr + String(chunk)).slice(-2000);
        });
        child.on('error', err => resolve({ exitCode: 1, stdout, stderr: err.message }));
        child.on('close', code => resolve({ exitCode: code ?? 1, stdout, stderr }));
      });

  return {
    ok: execResult.exitCode === 0,
    routineId,
    commandArgs: commandArgs.slice(1),
    exitCode: execResult.exitCode,
    stdoutTail: execResult.stdout.trim(),
    stderrTail: execResult.stderr.trim(),
    routineSnapshot: inspectRoutine({ routineId })
  };
}

export interface ListPendingSomResult {
  totalInQueue: number;
  pendingCount: number;
  items: Array<{
    id: string;
    routineId: string;
    stepNumber: number;
    rawText: string;
    targets: string[];
    routeHash: string;
    somImagePath: string;
    status: PendingSomQueueItem['status'];
    candidates: Array<{
      id: number;
      tagName: string;
      role: string;
      name: string;
      sectionTitle?: string;
      associatedLabel?: string;
      box: { x: number; y: number; width: number; height: number };
    }>;
  }>;
}

/**
 * Tool 6: `list_pending_som()`
 * Lê `auditoria/cache/pending-som/pending-som-queue.json` e retorna os passos pendentes
 * com os caminhos das imagens `*-som.png` e candidatos `[1]..[N]`.
 */
export function listPendingSom(): ListPendingSomResult {
  const queue = readPendingSomQueue();
  const pendingItems = queue.filter(i => i.status === 'pending');
  return {
    totalInQueue: queue.length,
    pendingCount: pendingItems.length,
    items: pendingItems.map(item => ({
      id: item.id,
      routineId: item.routineId,
      stepNumber: item.stepNumber,
      rawText: item.rawText,
      targets: item.targets,
      routeHash: item.routeHash,
      somImagePath: item.somImagePath,
      status: item.status,
      candidates: item.candidates.map(c => ({
        id: c.id,
        tagName: c.tagName,
        role: c.role,
        name: c.name,
        sectionTitle: c.sectionTitle,
        associatedLabel: c.associatedLabel,
        box: c.box
      }))
    }))
  };
}

export interface ApplySomCurationParams {
  routineId: string;
  stepNumber: number;
  tagId: number;
  actualTarget: string;
  note: string;
}

export interface ApplySomCurationResult {
  ok: boolean;
  routineId: string;
  stepNumber: number;
  tagId: number;
  documentedTarget: string;
  actualTarget: string;
  persistedPgPooler: boolean;
  removedFromQueue: boolean;
  remainingPendingCount: number;
}

function inferSynonymKindFromRole(role?: string): RouteSynonymKind {
  const r = String(role || '').toLowerCase();
  if (r === 'tab') return 'tab';
  if (r === 'textbox' || r === 'combobox' || r === 'searchbox' || r === 'checkbox' || r === 'radio') return 'field';
  return 'button';
}

/**
 * Tool 7: `apply_som_curation({ routineId, stepNumber, tagId, actualTarget, note })`
 * Registra a decisão visual aprovada no cache da Camada 0.1 (`human-reviews-cache.json`)
 * e em `routine_reviews` via Pooler PostgreSQL IPv4, e remove o item da fila `pending-som-queue.json`.
 */
export async function applySomCuration(
  params: ApplySomCurationParams,
  options: {
    customPgQuery?: (sql: string, values?: any[]) => Promise<{ rows: any[] }>;
    syncToSupabaseRest?: boolean;
  } = {}
): Promise<ApplySomCurationResult> {
  const routineId = String(params.routineId || '').trim();
  const stepNumber = Number(params.stepNumber);
  const tagId = Number(params.tagId);
  const note = String(params.note || 'Curadoria visual Set-of-Mark via MCP orion-audit').trim();

  if (!routineId || !Number.isFinite(stepNumber) || stepNumber <= 0) {
    throw new Error('routineId e stepNumber válidos são obrigatórios em apply_som_curation');
  }

  const queue = readPendingSomQueue();
  const itemIdx = queue.findIndex(
    q => q.routineId === routineId && q.stepNumber === stepNumber
  );
  const queueItem = itemIdx >= 0 ? queue[itemIdx] : undefined;
  const candidate = queueItem?.candidates.find(c => c.id === tagId);

  const documentedTarget =
    queueItem?.targets[0] || queueItem?.rawText || `Passo ${stepNumber}`;
  const actualTarget =
    String(params.actualTarget || '').trim() ||
    candidate?.innerText ||
    candidate?.name ||
    '';

  if (!actualTarget) {
    throw new Error('actualTarget não informado e candidato não localizado na fila SoM');
  }

  // 1. Atualiza o cache local da Camada 0.1 (human-reviews-cache.json)
  await upsertVisualCuratedTargetOverride({
    routineId,
    stepNumber,
    documented: documentedTarget,
    actual: actualTarget,
    preferredZone: queueItem?.zonePolicy,
    reason: note,
    syncToSupabase: options.syncToSupabaseRest ?? false
  });

  // 2. Se houver rota no item da fila, atualiza também o dicionário contextual por rota (Camada 0.2)
  if (queueItem?.routeHash) {
    const normRoute = routeKey(queueItem.routeHash);
    if (normRoute) {
      upsertCuratedRouteSynonym({
        route: normRoute,
        documented: documentedTarget,
        real: [actualTarget],
        kind: inferSynonymKindFromRole(candidate?.role),
        evidence: `Curadoria SoM MCP (${routineId} passo ${stepNumber}, tag [${tagId}]): ${note}`
      });
    }
  }

  // 3. Persiste via Pooler PostgreSQL IPv4 (pg) em routine_reviews
  let persistedPgPooler = false;
  if (options.customPgQuery || SUPABASE_DB_URL) {
    let client: ReturnType<typeof createPgClient> | null = null;
    try {
      let runQuery = options.customPgQuery;
      if (!runQuery) {
        const pgClient = createPgClient();
        client = pgClient;
        await pgClient.connect();
        runQuery = (sql: string, values?: any[]) => pgClient.query(sql, values);
      }

      const revId = `rev-som-${routineId.toLowerCase().replace(/[^a-z0-9]/g, '-')}-p${stepNumber}`;
      const motivo = `Curadoria Visual Set-of-Mark (ADR-031/ADR-032) no passo ${stepNumber} [tag ${tagId}]: '${documentedTarget}' -> '${actualTarget}' (${note}).`;
      const nowIso = new Date().toISOString();

      await runQuery(
        `
        INSERT INTO routine_reviews (id, routine_id, revisor, categoria, passos, motivo, status, versao, criado_em, atualizado_em, atualizado_por)
        VALUES ($1, $2, $3, $4, $5::int[], $6, 'aberta', 1, $7, $7, $3)
        ON CONFLICT (id) DO UPDATE SET
          motivo = EXCLUDED.motivo,
          passos = EXCLUDED.passos,
          versao = routine_reviews.versao + 1,
          atualizado_em = EXCLUDED.atualizado_em,
          atualizado_por = EXCLUDED.atualizado_por
        `,
        [revId, routineId, 'Curadoria Visual SoM (MCP)', 'atualizacao_editorial', [stepNumber], motivo, nowIso]
      );
      persistedPgPooler = true;
    } catch {
      persistedPgPooler = false;
    } finally {
      if (client) {
        await client.end().catch(() => undefined);
      }
    }
  }

  // 4. Remove o item da fila pending-som-queue.json
  let removedFromQueue = false;
  if (itemIdx >= 0) {
    queue.splice(itemIdx, 1);
    await writePendingSomQueue(queue);
    removedFromQueue = true;
  }

  const remainingPendingCount = queue.filter(i => i.status === 'pending').length;

  return {
    ok: true,
    routineId,
    stepNumber,
    tagId,
    documentedTarget,
    actualTarget,
    persistedPgPooler,
    removedFromQueue,
    remainingPendingCount
  };
}

export const MCP_TOOL_DEFINITIONS: Tool[] = [
  {
    name: 'inspect_routine',
    description:
      'Inspeciona uma rotina do Orion TN (ex.: R-1.1, M-16.2), retornando status atual, frontmatter YAML, divergências de auto-cura, diagnostico_tela_att (Raio-X), passo onde bloqueou e caminhos das imagens .webp.',
    inputSchema: {
      type: 'object',
      properties: {
        routineId: {
          type: 'string',
          description: 'Identificador canônico da rotina (ex.: R-1.1, M-40.0, C-CENTRAL-02).'
        }
      },
      required: ['routineId']
    }
  },
  {
    name: 'query_clusters',
    description:
      'Retorna o resumo agrupado de rotinas por status ([ATT], [CCC], [DDD], [XRX], validado_com_ajustes, validado_inalterado) e clusters de causa raiz (A, B, C, D), com filtro opcional por tag, módulo ou fase.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'Filtro opcional de tag (ATT, CCC, DDD, XRX).'
        },
        modulo: {
          type: 'string',
          description: 'Filtro opcional de módulo (firmas, notas, config, acesso, caixa, selos, livros, certidoes, centrais).'
        },
        phase: {
          type: 'number',
          description: 'Filtro opcional de fase do cronograma (1 a 6).'
        }
      }
    }
  },
  {
    name: 'search_orion_tree',
    description:
      'Busca rotas hash, menus reais, abas e seções no grafo vivo (auditoria/cache/orion-route-graph.json), na árvore de menus real e no glossario_siplan.md.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Termo de busca, caminho de menu ou rota hash (ex.: "Reconhecimento de firmas", "#/pedidoFirmas", "COAF").'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'list_human_reviews',
    description:
      'Consulta diretamente via Pooler PostgreSQL IPv4 (pg) as revisões humanas cadastradas em routine_reviews e a distribuição de status_governanca em routines.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'trigger_single_reaudit',
    description:
      'Dispara a reauditoria segura (--routines <id> --dry-run-mutations) de uma rotina específica do Orion TN e retorna o status atualizado.',
    inputSchema: {
      type: 'object',
      properties: {
        routineId: {
          type: 'string',
          description: 'Identificador da rotina a reauditar (ex.: M-16.2).'
        },
        headless: {
          type: 'boolean',
          description: 'Executa em modo headless (padrão: true).'
        }
      },
      required: ['routineId']
    }
  },
  {
    name: 'list_pending_som',
    description:
      'Lê auditoria/cache/pending-som/pending-som-queue.json e retorna os passos pendentes de curadoria visual Set-of-Mark com caminhos das imagens *-som.png e candidatos [1]..[N].',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'apply_som_curation',
    description:
      'Registra a decisão visual Set-of-Mark aprovada na Camada 0.1 (human-reviews-cache.json e routine_reviews via Pooler PostgreSQL IPv4) e remove o item da fila pending-som-queue.json.',
    inputSchema: {
      type: 'object',
      properties: {
        routineId: {
          type: 'string',
          description: 'ID da rotina (ex.: M-16.2).'
        },
        stepNumber: {
          type: 'number',
          description: 'Número do passo curado.'
        },
        tagId: {
          type: 'number',
          description: 'Número da tag [1]..[N] aprovada na imagem Set-of-Mark.'
        },
        actualTarget: {
          type: 'string',
          description: 'Rótulo real na interface aprovado para substituir/mapear o alvo documentado.'
        },
        note: {
          type: 'string',
          description: 'Justificativa técnica da curadoria visual.'
        }
      },
      required: ['routineId', 'stepNumber', 'tagId', 'actualTarget', 'note']
    }
  }
];

export function createOrionAuditMcpServer(): Server {
  const server = new Server(
    {
      name: 'orion-audit',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOL_DEFINITIONS
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: rawArgs } = request.params;
    const args = (rawArgs || {}) as Record<string, any>;

    try {
      let result: unknown;
      switch (name) {
        case 'inspect_routine':
          result = inspectRoutine({ routineId: String(args.routineId || '') });
          break;
        case 'query_clusters':
          result = queryClusters({
            tag: args.tag !== undefined ? String(args.tag) : undefined,
            modulo: args.modulo !== undefined ? String(args.modulo) : undefined,
            phase: args.phase !== undefined ? Number(args.phase) : undefined
          });
          break;
        case 'search_orion_tree':
          result = searchOrionTree({ query: String(args.query || '') });
          break;
        case 'list_human_reviews':
          result = await listHumanReviews();
          break;
        case 'trigger_single_reaudit':
          result = await triggerSingleReaudit({
            routineId: String(args.routineId || ''),
            headless: args.headless !== undefined ? Boolean(args.headless) : true
          });
          break;
        case 'list_pending_som':
          result = listPendingSom();
          break;
        case 'apply_som_curation':
          result = await applySomCuration({
            routineId: String(args.routineId || ''),
            stepNumber: Number(args.stepNumber),
            tagId: Number(args.tagId),
            actualTarget: String(args.actualTarget || ''),
            note: String(args.note || '')
          });
          break;
        default:
          return {
            isError: true,
            content: [{ type: 'text', text: `Tool desconhecida no servidor orion-audit: ${name}` }]
          };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Erro ao executar ${name}: ${err?.message || String(err)}`
          }
        ]
      };
    }
  });

  return server;
}

export async function startOrionAuditMcpStdio(): Promise<Server> {
  const server = createOrionAuditMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}

const isMain = (() => {
  try {
    return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMain) {
  startOrionAuditMcpStdio().catch(err => {
    console.error('✕ Falha ao iniciar servidor MCP orion-audit:', err);
    process.exit(1);
  });
}
