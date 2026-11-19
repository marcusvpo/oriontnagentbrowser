import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { getSupabaseAdmin, isSupabaseConfigured, SUPABASE_URL } from './supabase.js';
import {
  REVIEW_TAGS,
  describeTags,
  isReviewStatus,
  normalizeReviewTags,
  reviewTagsFor,
  reviewTagsPrefix,
  tagsFromPrefix,
  type ReviewTag,
} from './review-taxonomy.js';
import { auditExternalSteps, externalStepsFromMd, reviewTagsFromMd } from './invariants.js';
import { findRevisedMarkdownById, persistRoutineGovernanceToDisk, type GovernanceDiskUpdate } from './governance-disk.js';
import { analyzeRoutineScope } from './step-scope.js';
import { syncSingleRoutineToSupabase } from './sync-supabase.js';
import {
  buildExportJson,
  buildExportMarkdown,
  computeCurationStage,
  computeReviewIngestionFlags,
  computeRoutineReviewRollup,
  type CurationStage,
  type ExportBundleRoutine,
  type ReviewIngestionState,
} from './review-export.js';
import type { ReviewStatus, RoutineAuditStatus, WorkloadType } from './types.js';

const PORT = parseInt(process.env.API_PORT || '3333', 10);
const HOST = process.env.API_HOST || '0.0.0.0';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const rotinasDir = path.join(auditoriaRoot, 'rotinas');

export type Modulo =
  | 'acesso'
  | 'caixa'
  | 'centrais'
  | 'certidoes'
  | 'comunicacao'
  | 'config'
  | 'firmas'
  | 'geral'
  | 'livros'
  | 'notas'
  | 'selos';

export type Secao = 'R' | 'V' | 'M' | 'D' | 'C';
export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6;
// ADR-021/024: `[ATT]`/`[CCC]`/`[DDD]`/`[XRX]` substituem o `requer_revisao_humana` (`[!!!]`)
export type RoutineAuditState = RoutineAuditStatus | 'nao_auditada';

/** Os 4 status de revisão humana contam como "em revisão" nos painéis e exigem confirmação para aprovar. */
const isReview = (s: string | null | undefined): boolean => isReviewStatus(s);
export type GovernanceStatus = 'pendente_aprovacao' | 'aprovada' | 'revisao_solicitada';
export type RunnerJobState = 'idle' | 'na_fila' | 'em_execucao' | 'concluida' | 'falhou';

interface RunnerJobInfo {
  estado: RunnerJobState;
  jobId?: string;
  lane?: WorkloadType;
  posicaoFila?: number;
  enfileiradoEm?: string;
  iniciadoEm?: string;
  finalizadoEm?: string;
  erro?: string;
}

export interface RoutineSummary {
  id: string;
  titulo: string;
  modulo: Modulo;
  secao: Secao;
  fase: PhaseNumber | null;
  temVideo: boolean;
  workloadType: WorkloadType;
  statusAuditoria: RoutineAuditState;
  /** Todas as tags da rotina em ordem canônica (ADR-024), ex.: `['ATT', 'CCC']`; vazio fora da revisão humana */
  reviewTags: ReviewTag[];
  /** Alias legado/compatibilidade com `reviewTags` */
  tagsRevisao: ReviewTag[];
  statusGovernanca: GovernanceStatus;
  runner: RunnerJobInfo;
  pastaAuditoria: string | null;
  totalPassos: number;
  printsGeradas: number;
  divergenciasCount: number;
  menorConfianca?: number;
  rotasHash: string[];
  tags: string[];
  dataExecucao?: string;
  workerId?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  updatedAt: string;
  revisoesCount?: number;
  revisoesPendentesExportacao?: number;
  revisoesConsumidasCount?: number;
  reviewIngestionState?: ReviewIngestionState;
  ultimaIngestaoEm?: string;
  ultimoLoteIngestaoId?: string;
  ultimaIngestaoPor?: string;
  temNovaRevisaoPosIngestao?: boolean;
  curationStage?: CurationStage;
}

/**
 * Extrai e normaliza todas as tags de revisão (`ATT`, `CCC`, `DDD`, `XRX`) combinando
 * coluna `tags_revisao`, frontmatter (`auditoria_ui.review_tags`), prefixo da pasta (`pasta_auditoria`),
 * cabeçalho do markdown revisado e o status principal.
 */
export function extractRoutineReviewTags(row: any, revMdContent?: string): ReviewTag[] {
  const status = row?.status_auditoria;
  const dbTags = Array.isArray(row?.tags_revisao) ? row.tags_revisao : [];
  if (status === 'nao_auditada' || status === 'validado_inalterado' || status === 'validado_com_ajustes') {
    return normalizeReviewTags(dbTags);
  }
  const fmTags = Array.isArray(row?.auditoria_ui?.review_tags) ? row.auditoria_ui.review_tags : [];
  const prefixTags = row?.pasta_auditoria ? tagsFromPrefix(String(row.pasta_auditoria)) : [];
  const mdTags = revMdContent ? reviewTagsFromMd(revMdContent) : [];
  const statusTags = isReviewStatus(status) ? reviewTagsFor(status) : [];
  return normalizeReviewTags([...dbTags, ...fmTags, ...prefixTags, ...mdTags, ...statusTags]);
}

function mapJobRow(row: any): RunnerJobInfo {
  if (!row) return { estado: 'idle' };
  return {
    estado: row.estado,
    jobId: row.job_id,
    lane: row.lane,
    posicaoFila: row.posicao_fila ?? undefined,
    enfileiradoEm: row.enfileirado_em ?? undefined,
    iniciadoEm: row.iniciado_em ?? undefined,
    finalizadoEm: row.finalizado_em ?? undefined,
    erro: row.erro ?? undefined,
  };
}

export function mapRoutineSummary(
  row: any,
  latestJob?: any,
  revMdContent?: string,
  routineReviews: any[] = [],
): RoutineSummary {
  const reviewTags = extractRoutineReviewTags(row, revMdContent);
  const rollup = computeRoutineReviewRollup(routineReviews);
  const curationStage = computeCurationStage({
    statusGovernanca: row.status_governanca,
    statusAuditoria: row.status_auditoria,
    revisoesPendentesExportacao: rollup.revisoesPendentesExportacao,
    revisoesConsumidasCount: rollup.revisoesConsumidasCount,
  });
  return {
    id: row.id,
    titulo: row.titulo,
    modulo: row.modulo as Modulo,
    secao: row.secao as Secao,
    fase: row.fase !== null && row.fase !== undefined ? (Number(row.fase) as PhaseNumber) : null,
    temVideo: Boolean(row.tem_video),
    workloadType: row.workload_type as WorkloadType,
    statusAuditoria: row.status_auditoria as RoutineAuditState,
    reviewTags,
    tagsRevisao: reviewTags,
    statusGovernanca: row.status_governanca as GovernanceStatus,
    runner: mapJobRow(latestJob),
    pastaAuditoria: row.pasta_auditoria || null,
    totalPassos: row.total_passos ?? 0,
    printsGeradas: row.prints_geradas ?? 0,
    divergenciasCount: row.divergencias_count ?? 0,
    menorConfianca: row.menor_confianca !== null && row.menor_confianca !== undefined ? Number(row.menor_confianca) : undefined,
    rotasHash: row.rotas_hash || [],
    tags: row.tags || [],
    dataExecucao: row.data_execucao ?? undefined,
    workerId: row.worker_id ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    updatedAt: row.updated_at,
    revisoesCount: rollup.revisoesCount,
    revisoesPendentesExportacao: rollup.revisoesPendentesExportacao,
    revisoesConsumidasCount: rollup.revisoesConsumidasCount,
    reviewIngestionState: rollup.reviewIngestionState,
    ultimaIngestaoEm: rollup.ultimaIngestaoEm,
    ultimoLoteIngestaoId: rollup.ultimoLoteIngestaoId,
    ultimaIngestaoPor: rollup.ultimaIngestaoPor,
    temNovaRevisaoPosIngestao: rollup.temNovaRevisaoPosIngestao,
    curationStage,
  };
}

function mapEventRow(row: any) {
  return {
    id: row.id,
    tipo: row.tipo,
    autor: row.autor,
    em: row.em,
    descricao: row.descricao,
    meta: row.meta ?? undefined,
  };
}

function mapReviewVersionRow(v: any) {
  return {
    versao: v.versao,
    revisor: v.revisor,
    categoria: v.categoria,
    passos: v.passos || [],
    motivo: v.motivo,
    resolucao: v.resolucao ?? undefined,
    status: v.status,
    alteradoPor: v.alterado_por,
    notaAtualizacao: v.nota_atualizacao ?? undefined,
    criadoEm: v.criado_em,
  };
}

function mapBatchRow(b: any) {
  return {
    id: b.id,
    operador: b.operador,
    formato: b.formato === 'json' ? ('json' as const) : ('markdown' as const),
    nota: b.nota ?? undefined,
    reviewIds: Array.isArray(b.review_ids) ? b.review_ids : [],
    routineIds: Array.isArray(b.routine_ids) ? b.routine_ids : [],
    totalRevisoes: Number(b.total_revisoes ?? 0),
    totalRotinas: Number(b.total_rotinas ?? 0),
    criadoEm: b.criado_em,
  };
}

async function fetchRecentBatches(limit = 20) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('review_export_batches')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).map(mapBatchRow);
}

async function fetchReviewsList(filters: {
  routineId?: string;
  status?: string;
  categoria?: string;
  modulo?: string;
  ingestao?: string;
  q?: string;
} = {}) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('routine_reviews')
    .select('*, routines!inner(id, titulo, modulo, fase, status_auditoria, tags_revisao, pasta_auditoria, auditoria_ui, total_passos)')
    .order('atualizado_em', { ascending: false });

  if (filters.routineId) query = query.eq('routine_id', filters.routineId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.categoria) query = query.eq('categoria', filters.categoria);

  const { data: reviewRows, error: revErr } = await query;
  if (revErr) throw revErr;

  const reviewIds = (reviewRows || []).map((r: any) => r.id);
  const versionsByReview = new Map<string, any[]>();
  if (reviewIds.length > 0) {
    const { data: verRows, error: verErr } = await supabase
      .from('routine_review_versions')
      .select('*')
      .in('review_id', reviewIds)
      .order('versao', { ascending: false });
    if (verErr) throw verErr;
    for (const v of verRows || []) {
      if (!versionsByReview.has(v.review_id)) versionsByReview.set(v.review_id, []);
      versionsByReview.get(v.review_id)!.push(mapReviewVersionRow(v));
    }
  }

  let items = (reviewRows || []).map((r: any) => {
    const flags = computeReviewIngestionFlags(r);
    return {
      id: r.id,
      routineId: r.routine_id,
      rotinaTitulo: r.routines?.titulo ?? r.routine_id,
      rotinaModulo: r.routines?.modulo ?? 'geral',
      rotinaFase: r.routines?.fase ?? null,
      rotinaStatusAuditoria: r.routines?.status_auditoria ?? 'nao_auditada',
      rotinaReviewTags: r.routines ? extractRoutineReviewTags(r.routines) : [],
      rotinaTotalPassos: r.routines?.total_passos ?? 0,
      revisor: r.revisor,
      categoria: r.categoria,
      passos: r.passos || [],
      motivo: r.motivo,
      resolucao: r.resolucao ?? undefined,
      status: r.status,
      versao: Number(r.versao ?? 1),
      criadoEm: r.criado_em,
      atualizadoEm: r.atualizado_em,
      atualizadoPor: r.atualizado_por ?? r.revisor,
      consumidaPeloAgente: flags.consumidaPeloAgente,
      consumidaEm: r.consumida_em ?? undefined,
      consumidaPor: r.consumida_por ?? undefined,
      loteExportacaoId: r.lote_exportacao_id ?? undefined,
      versaoConsumida:
        r.versao_consumida !== null && r.versao_consumida !== undefined
          ? Number(r.versao_consumida)
          : undefined,
      editadaPosIngestao: flags.editadaPosIngestao,
      pendenteExportacao: flags.pendenteExportacao,
      versoes: versionsByReview.get(r.id) || [],
    };
  });

  if (filters.modulo) {
    items = items.filter((i: any) => i.rotinaModulo === filters.modulo);
  }
  if (filters.ingestao === 'pendentes') {
    items = items.filter((i: any) => i.pendenteExportacao);
  } else if (filters.ingestao === 'consumidas') {
    items = items.filter((i: any) => i.consumidaPeloAgente);
  }
  if (filters.q?.trim()) {
    const t = filters.q.trim().toLowerCase();
    items = items.filter(
      (i: any) =>
        i.routineId.toLowerCase().includes(t) ||
        i.rotinaTitulo.toLowerCase().includes(t) ||
        i.motivo.toLowerCase().includes(t) ||
        i.revisor.toLowerCase().includes(t) ||
        (i.resolucao || '').toLowerCase().includes(t) ||
        (i.loteExportacaoId || '').toLowerCase().includes(t)
    );
  }

  return items;
}

async function fetchAllRoutinesSummary(): Promise<{ summaries: RoutineSummary[]; rawRows: any[]; allReviewRows: any[] }> {
  const supabase = getSupabaseAdmin();
  const [{ data: rData, error: rErr }, { data: revData, error: revErr }] = await Promise.all([
    supabase.from('routines').select(
      'id, titulo, modulo, secao, fase, tem_video, workload_type, status_auditoria, tags_revisao, status_governanca, pasta_auditoria, total_passos, prints_geradas, divergencias_count, menor_confianca, rotas_hash, tags, data_execucao, worker_id, duration_seconds, thumbnail_url, auditoria_ui, updated_at'
    ),
    supabase
      .from('routine_reviews')
      .select(
        'id, routine_id, status, versao, consumida_pelo_agente, consumida_em, consumida_por, lote_exportacao_id, versao_consumida'
      ),
  ]);

  if (rErr) throw rErr;
  if (revErr) throw revErr;

  const reviewsByRoutine = new Map<string, any[]>();
  for (const rev of revData || []) {
    if (!reviewsByRoutine.has(rev.routine_id)) reviewsByRoutine.set(rev.routine_id, []);
    reviewsByRoutine.get(rev.routine_id)!.push(rev);
  }

  const summaries = (rData || []).map(row => mapRoutineSummary(row, undefined, undefined, reviewsByRoutine.get(row.id) || []));
  return { summaries, rawRows: rData || [], allReviewRows: revData || [] };
}

async function buildDashboardStats(allSummaries: RoutineSummary[], rawRows: any[], allReviewRows: any[] = []) {
  const supabase = getSupabaseAdmin();
  const totalRotinas = allSummaries.length;
  const auditadas = allSummaries.filter(r => r.statusAuditoria !== 'nao_auditada').length;
  const naoAuditadas = totalRotinas - auditadas;
  const aprovadas = allSummaries.filter(r => r.statusGovernanca === 'aprovada').length;
  const taxaAprovacao = auditadas > 0 ? aprovadas / auditadas : 0;
  const autoCuradas = allSummaries.filter(r => r.statusAuditoria === 'validado_com_ajustes').length;
  const countStatus = (list: typeof allSummaries, status: RoutineAuditState) => list.filter(r => r.statusAuditoria === status).length;
  const bloqueadas = allSummaries.filter(r => isReview(r.statusAuditoria)).length;
  const porTagRevisao: Record<ReviewTag, number> = { ATT: 0, CCC: 0, DDD: 0, XRX: 0 };
  for (const r of allSummaries) {
    for (const tag of r.reviewTags) {
      if (tag in porTagRevisao) porTagRevisao[tag]++;
    }
  }

  const phaseDefs = [
    { fase: 1 as PhaseNumber, titulo: 'Piloto' },
    { fase: 2 as PhaseNumber, titulo: 'Cadastrais, segurança e parâmetros' },
    { fase: 3 as PhaseNumber, titulo: 'Atos de balcão, insumos e livros' },
    { fase: 4 as PhaseNumber, titulo: 'Financeiro e caixa' },
    { fase: 5 as PhaseNumber, titulo: 'Notas, minutas e escrituras' },
    { fase: 6 as PhaseNumber, titulo: 'Consolidação' },
    { fase: null, titulo: 'Sem fase atribuída' },
  ];

  const porFase = phaseDefs.map(pd => {
    const rInPhase = pd.fase === 6 ? allSummaries : allSummaries.filter(r => r.fase === pd.fase);
    const total = rInPhase.length;
    if (pd.fase === 6) {
      return {
        fase: pd.fase,
        titulo: pd.titulo,
        total,
        auditadas: aprovadas,
        porStatus: {
          validado_inalterado: aprovadas,
          validado_com_ajustes: 0,
          atualizacao_editorial: 0,
          comunicacao_externa: 0,
          dependencia_dados_banco: 0,
          dependencia_cruzada_rotina: 0,
          nao_auditada: Math.max(0, total - aprovadas),
        },
      };
    }
    const aud = rInPhase.filter(r => r.statusAuditoria !== 'nao_auditada').length;
    const ok = rInPhase.filter(r => r.statusAuditoria === 'validado_inalterado').length;
    const adj = rInPhase.filter(r => r.statusAuditoria === 'validado_com_ajustes').length;
    return {
      fase: pd.fase,
      titulo: pd.titulo,
      total,
      auditadas: aud,
      porStatus: {
        validado_inalterado: ok,
        validado_com_ajustes: adj,
        atualizacao_editorial: countStatus(rInPhase, 'atualizacao_editorial'),
        comunicacao_externa: countStatus(rInPhase, 'comunicacao_externa'),
        dependencia_dados_banco: countStatus(rInPhase, 'dependencia_dados_banco'),
        dependencia_cruzada_rotina: countStatus(rInPhase, 'dependencia_cruzada_rotina'),
        nao_auditada: total - aud,
      },
    };
  });

  const porCarga = {
    read_only: allSummaries.filter(r => r.workloadType === 'read_only').length,
    mutation: allSummaries.filter(r => r.workloadType === 'mutation').length,
  };

  const modulosList: Modulo[] = [
    'acesso',
    'caixa',
    'centrais',
    'certidoes',
    'comunicacao',
    'config',
    'firmas',
    'geral',
    'livros',
    'notas',
    'selos',
  ];
  const porModulo = modulosList.map(m => {
    const rInMod = allSummaries.filter(r => r.modulo === m);
    return {
      modulo: m,
      total: rInMod.length,
      auditadas: rInMod.filter(r => r.statusAuditoria !== 'nao_auditada').length,
    };
  });

  const porCamadaDivergencia = {
    dom_synonym_heuristic: 0,
    a11y_fuzzy_match: 0,
    llm_a11y_fallback: 0,
  };
  for (const r of rawRows) {
    const divs = r.auditoria_ui?.auto_cura?.divergencias_detectadas;
    if (Array.isArray(divs)) {
      for (const d of divs) {
        if (d.camada in porCamadaDivergencia) {
          (porCamadaDivergencia as any)[d.camada]++;
        }
      }
    }
  }

  let totalRevisoesPendentes = 0;
  let totalRevisoesConsumidas = 0;
  for (const rev of allReviewRows) {
    const flags = computeReviewIngestionFlags(rev);
    if (flags.pendenteExportacao) totalRevisoesPendentes++;
    if (flags.consumidaPeloAgente) totalRevisoesConsumidas++;
  }

  const [{ data: recentEvents }, batches] = await Promise.all([
    supabase.from('governance_events').select('*').order('em', { ascending: false }).limit(12),
    fetchRecentBatches(1),
  ]);

  const countStage = (st: CurationStage) => allSummaries.filter(r => r.curationStage === st).length;
  const curadoria = {
    aprovadasKb: countStage('aprovadas_kb'),
    ingeridasAgente: countStage('ingeridas_agente'),
    revisaoPendenteExportacao: countStage('revisao_pendente'),
    precisamApoioHumano: countStage('apoio_humano'),
    prontasConferencia: countStage('prontas_conferencia'),
    naoAuditadas: countStage('nao_auditadas'),
    totalRevisoesPendentes,
    totalRevisoesConsumidas,
    rotinasComIngestao: allSummaries.filter(r => (r.revisoesConsumidasCount ?? 0) > 0).length,
    ultimoLote: batches[0] ?? null,
  };

  const atividadeRecente = (recentEvents || []).map(e => ({
    ...mapEventRow(e),
    rotinaId: e.routine_id,
  }));

  return {
    totalRotinas,
    auditadas,
    naoAuditadas,
    aprovadas,
    taxaAprovacao,
    autoCuradas,
    bloqueadas,
    porTagRevisao,
    porFase,
    porCarga,
    porModulo,
    porCamadaDivergencia,
    curadoria,
    atividadeRecente,
  };
}

/**
 * Resolve o mapa `stepNumber -> portalExterno` a partir de múltiplas fontes (coluna `step_scope` do Supabase,
 * `auditoria_ui.etapas_externas`, callouts no `markdown_revisado` e análise de fallback dos passos).
 */
export function resolveExternalStepMap(params: {
  rRow: any;
  sRows: any[];
  effectiveMd?: string;
  diskAuditoriaUi?: any;
}): Map<number, string | undefined> {
  const { rRow, sRows, effectiveMd = '', diskAuditoriaUi } = params;
  const externalMap = new Map<number, string | undefined>();

  const uiExternas = rRow?.auditoria_ui?.etapas_externas ?? diskAuditoriaUi?.etapas_externas;
  if (Array.isArray(uiExternas)) {
    for (const entry of uiExternas) {
      const n = Number(entry?.passo);
      if (Number.isFinite(n)) {
        externalMap.set(n, entry?.portal ? String(entry.portal) : undefined);
      }
    }
  }

  if (effectiveMd) {
    for (const ext of externalStepsFromMd(effectiveMd)) {
      if (!externalMap.has(ext.stepNumber) || !externalMap.get(ext.stepNumber)) {
        externalMap.set(ext.stepNumber, ext.portal);
      }
    }
    const body = effectiveMd.replace(/\r\n/g, '\n');
    const stepsStart = body.search(/^#### Passo a passo/m);
    const stepsSection = stepsStart >= 0 ? body.slice(stepsStart).replace(/^#### Passo a passo[^\n]*\n/, '') : body;
    const stepsEnd = stepsSection.search(/^#### /m);
    const stepArea = stepsEnd >= 0 ? stepsSection.slice(0, stepsEnd) : stepsSection;
    const stepMatches = stepArea.matchAll(/^(\d+)\.\s[\s\S]*?(?=^\d+\.\s|^\*\s|$(?![\s\S]))/gm);
    for (const m of stepMatches) {
      const n = Number(m[1]);
      const block = m[0];
      if (!block.includes('Etapa Externa (Fora do Orion TN)')) continue;
      const portalMatch = block.match(/Orion TN\s*\(\*\*([^*]+)\*\*\)/i);
      if (!externalMap.has(n) || (!externalMap.get(n) && portalMatch?.[1])) {
        externalMap.set(n, portalMatch?.[1]?.trim() || externalMap.get(n));
      }
    }
  }

  for (const s of sRows || []) {
    const n = Number(s.step_number);
    if (s.step_scope === 'external_portal') {
      if (!externalMap.has(n) || s.portal_externo) {
        externalMap.set(n, s.portal_externo ?? externalMap.get(n) ?? undefined);
      }
    }
  }

  // Fallback para linhas antigas/parciais sem `step_scope` gravado no banco ou sem metadados no frontmatter
  const needsScopeAnalysis =
    (sRows || []).length > 0 &&
    externalMap.size === 0 &&
    (sRows || []).some(s => s.step_scope === null || s.step_scope === undefined);
  if (needsScopeAnalysis) {
    const scopeAnalysis = analyzeRoutineScope(
      (sRows || []).map(s => ({
        stepNumber: Number(s.step_number),
        rawText: String(s.original_text || s.validated_text || ''),
        targets: Array.isArray(s.targets) ? s.targets : [],
        actionType: s.action_type || 'click',
        subItems: Array.isArray(s.sub_items) ? s.sub_items : [],
      }))
    );
    for (const ext of scopeAnalysis.externalSteps) {
      if (!externalMap.has(ext.stepNumber)) {
        externalMap.set(ext.stepNumber, ext.portal);
      }
    }
  }

  return externalMap;
}

export function mapStepRowsWithScope(params: {
  rRow: any;
  sRows: any[];
  effectiveMd?: string;
  diskAuditoriaUi?: any;
}) {
  const { sRows } = params;
  const externalMap = resolveExternalStepMap(params);
  return (sRows || []).map(s => {
    const n = Number(s.step_number);
    const isExternal = s.step_scope === 'external_portal' || externalMap.has(n);
    const stepScope: 'orion_tn' | 'external_portal' = isExternal ? 'external_portal' : 'orion_tn';
    const portalExterno = isExternal ? (s.portal_externo ?? externalMap.get(n) ?? undefined) : undefined;
    return {
      stepNumber: s.step_number,
      actionType: s.action_type,
      zonePolicy: s.zone_policy ?? undefined,
      targets: s.targets || [],
      originalText: s.original_text,
      validatedText: s.validated_text,
      isModified: Boolean(s.is_modified),
      status: s.status,
      // ADR-024: passo de portal externo não tem print por desenho (não é erro de paridade)
      stepScope,
      portalExterno,
      media: s.media ? { ...s.media, subCapturas: undefined } : null,
      // Sub-capturas (passo-NN-b...): ficam em `media.subCapturas` para não exigir nova coluna (ADR-018)
      subCapturas: Array.isArray(s.media?.subCapturas) ? s.media.subCapturas : [],
      callouts: s.layout_result?.callouts ?? undefined,
      domGeometry: s.dom_geometry ?? undefined,
      layoutResult: s.layout_result ?? undefined,
      divergence: s.divergence ?? undefined,
      executedAction: s.executed_action ?? undefined,
      invariantes: s.invariantes ?? undefined,
      errorMessage: s.error_message ?? undefined,
    };
  });
}

function readDiskFallbackForRoutine(routineId: string): { markdown?: string; auditoriaUi?: any; pastaAuditoria?: string } | null {
  try {
    const revPath = findRevisedMarkdownById(routineId);
    if (!revPath || !fs.existsSync(revPath)) return null;
    const markdown = fs.readFileSync(revPath, 'utf8').replace(/\r\n/g, '\n');
    const parts = markdown.split(/^---$/m);
    const fm = parts.length >= 3 ? yaml.parse(parts[1].trim()) : null;
    return {
      markdown,
      auditoriaUi: fm?.auditoria_ui ?? null,
      pastaAuditoria: path.basename(path.dirname(revPath)),
    };
  } catch {
    return null;
  }
}

async function fetchRoutineDetail(id: string) {
  const supabase = getSupabaseAdmin();
  const [
    { data: rRow, error: rErr },
    { data: sRows, error: sErr },
    { data: eRows, error: eErr },
    revisoes,
  ] = await Promise.all([
    supabase.from('routines').select('*').eq('id', id).maybeSingle(),
    supabase.from('routine_steps').select('*').eq('routine_id', id).order('step_number', { ascending: true }),
    supabase.from('governance_events').select('*').eq('routine_id', id).order('em', { ascending: false }),
    fetchReviewsList({ routineId: id }),
  ]);

  if (rErr) throw rErr;
  if (sErr) throw sErr;
  if (eErr) throw eErr;
  if (!rRow) return null;

  const hasExplicitExternalInDb = (sRows || []).some(s => s.step_scope === 'external_portal');
  const needsDiskFallback = !rRow.markdown_revisado || !hasExplicitExternalInDb || !Array.isArray(rRow.tags_revisao);
  const diskFallback = needsDiskFallback ? readDiskFallbackForRoutine(id) : null;
  const effectiveMd = rRow.markdown_revisado || diskFallback?.markdown || '';
  const mergedRow = diskFallback
    ? {
        ...rRow,
        pasta_auditoria: rRow.pasta_auditoria || diskFallback.pastaAuditoria || null,
        auditoria_ui: rRow.auditoria_ui || diskFallback.auditoriaUi || null,
      }
    : rRow;

  const summary = mapRoutineSummary(mergedRow, undefined, effectiveMd, revisoes);
  const steps = mapStepRowsWithScope({
    rRow: mergedRow,
    sRows: sRows || [],
    effectiveMd,
    diskAuditoriaUi: diskFallback?.auditoriaUi,
  });

  return {
    summary,
    original: {
      id: rRow.id,
      titulo: rRow.titulo,
      modulo: rRow.modulo,
      secao: rRow.secao,
      tem_video: Boolean(rRow.tem_video),
      workloadType: rRow.workload_type,
      frontmatter: rRow.frontmatter_original || {},
      descricao: rRow.descricao_revisada || rRow.descricao_original || '',
      steps: steps.map(s => ({
        stepNumber: s.stepNumber,
        rawText: s.originalText,
        targets: s.targets,
        actionType: s.actionType,
        zone: s.zonePolicy,
      })),
      observacoes: rRow.observacoes || [],
      rawContent: rRow.markdown_original || '',
    },
    report:
      rRow.status_auditoria !== 'nao_auditada'
        ? {
            id: rRow.id,
            modulo: rRow.modulo,
            titulo: rRow.titulo,
            workloadType: rRow.workload_type,
            workerSessionId: rRow.worker_id ?? undefined,
            status: rRow.status_auditoria,
            steps: [],
            executedAt: rRow.data_execucao || rRow.updated_at,
            durationSeconds: rRow.duration_seconds ?? 12,
            changelogPath: rRow.pasta_auditoria || '',
          }
        : null,
    auditoriaUi: rRow.auditoria_ui || null,
    // ADR-024: passos de portal externo aceitos sem `passo-NN.png`; os problemas reais (print em passo externo,
    // callout ausente, [CCC] faltando) vêm do mesmo validador usado em `verify-all-phase2-boxes.ts`
    passosExternos: auditExternalSteps(effectiveMd),
    steps,
    frontmatterOriginalYaml: rRow.frontmatter_original_yaml || '',
    frontmatterRevisadoYaml: rRow.frontmatter_revisado_yaml || '',
    markdownRevisado: effectiveMd || rRow.markdown_original || '',
    bloqueio: rRow.bloqueio ?? undefined,
    historico: (eRows || []).map(mapEventRow),
    revisoes,
  };
}

/**
 * Dupla via na governança (ADR-022/023): grava as alterações/status no `*-revisado.md` em disco
 * e dispara imediatamente `syncSingleRoutineToSupabase` para manter o Supabase 100% espelhado.
 */
async function mirrorGovernanceToDiskAndSupabase(routineId: string, update: GovernanceDiskUpdate): Promise<void> {
  try {
    await persistRoutineGovernanceToDisk(routineId, update);
  } catch (diskErr: any) {
    console.warn(`⚠ [Dupla Via Disco] Falha ao atualizar *-revisado.md de ${routineId}: ${diskErr?.message || diskErr}`);
  }
  try {
    await syncSingleRoutineToSupabase(routineId, {
      skipMedia: true,
      preserveExistingGovernance: true,
      statusGovernancaOverride: update.statusGovernanca,
      quiet: true,
    });
  } catch (syncErr: any) {
    console.warn(`⚠ [Dupla Via Supabase] Falha ao sincronizar ${routineId}: ${syncErr?.message || syncErr}`);
  }
}

async function buildExportBundleRoutines(selectedReviews: any[]): Promise<ExportBundleRoutine[]> {
  const supabase = getSupabaseAdmin();
  const routineIds = Array.from(new Set(selectedReviews.map((r: any) => r.routineId))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true }),
  );
  if (routineIds.length === 0) return [];

  const [{ data: rRows, error: rErr }, { data: sRows, error: sErr }] = await Promise.all([
    supabase.from('routines').select('*').in('id', routineIds),
    supabase
      .from('routine_steps')
      .select('routine_id, step_number, status, step_scope, portal_externo, original_text, validated_text, is_modified, error_message')
      .in('routine_id', routineIds)
      .order('step_number', { ascending: true }),
  ]);
  if (rErr) throw rErr;
  if (sErr) throw sErr;

  const routineById = new Map<string, any>();
  for (const r of rRows || []) routineById.set(r.id, r);

  const stepsByRoutine = new Map<string, any[]>();
  for (const s of sRows || []) {
    if (!stepsByRoutine.has(s.routine_id)) stepsByRoutine.set(s.routine_id, []);
    stepsByRoutine.get(s.routine_id)!.push(s);
  }

  const reviewsByRoutine = new Map<string, any[]>();
  for (const rev of selectedReviews) {
    if (!reviewsByRoutine.has(rev.routineId)) reviewsByRoutine.set(rev.routineId, []);
    reviewsByRoutine.get(rev.routineId)!.push(rev);
  }

  return routineIds.map(id => {
    const r = routineById.get(id) || {};
    const revs = reviewsByRoutine.get(id) || [];
    const steps = (stepsByRoutine.get(id) || []).map((s: any) => ({
      stepNumber: Number(s.step_number),
      status: String(s.status || 'ok'),
      stepScope: s.step_scope || 'orion_tn',
      portalExterno: s.portal_externo || undefined,
      originalText: String(s.original_text || ''),
      validatedText: String(s.validated_text || s.original_text || ''),
      isModified: Boolean(s.is_modified),
      errorMessage: s.error_message || undefined,
    }));
    return {
      id,
      titulo: r.titulo || revs[0]?.rotinaTitulo || id,
      modulo: r.modulo || revs[0]?.rotinaModulo || 'geral',
      secao: r.secao || id[0] || 'R',
      fase: r.fase !== null && r.fase !== undefined ? Number(r.fase) : null,
      statusAuditoria: r.status_auditoria || 'nao_auditada',
      reviewTags: extractRoutineReviewTags(r),
      statusGovernanca: r.status_governanca || 'pendente_aprovacao',
      dataExecucao: r.data_execucao ?? undefined,
      rotasHash: Array.isArray(r.rotas_hash) ? r.rotas_hash : [],
      bloqueio: r.bloqueio ?? null,
      diagnosticoTelaAtt: r.auditoria_ui?.diagnostico_tela_att ?? null,
      steps,
      revisoes: revs.map((rev: any) => ({
        id: rev.id,
        versao: rev.versao,
        status: rev.status,
        categoria: rev.categoria,
        revisor: rev.revisor,
        atualizadoPor: rev.atualizadoPor,
        criadoEm: rev.criadoEm,
        atualizadoEm: rev.atualizadoEm,
        passos: rev.passos || [],
        motivo: rev.motivo,
        resolucao: rev.resolucao,
        consumidaAnteriormente: rev.consumidaPeloAgente,
        versaoConsumidaAnterior: rev.versaoConsumida,
      })),
    };
  });
}

function makeBatchId(nowIso: string): string {
  const day = nowIso.slice(0, 10);
  const rand = Math.random().toString(16).slice(2, 6);
  return `lote-${day}-${rand}`;
}

// --- FILTRO DE ROTINAS & INICIALIZAÇÃO ---

export interface RoutineFilterInput {
  fase?: string | null;
  modulos?: string[];
  secoes?: string[];
  statusesAuditoria?: string[];
  statusesGovernanca?: string[];
  tagsRevisao?: string[];
  ingestao?: string[];
  estagio?: string | null;
  carga?: string | null;
  temVideo?: string | null;
  comDivergencias?: string | null;
  q?: string;
}

export function filterRoutineSummaries(summaries: RoutineSummary[], f: RoutineFilterInput): RoutineSummary[] {
  let filtered = summaries;
  if (f.fase) {
    filtered =
      f.fase === 'sem_fase'
        ? filtered.filter(r => r.fase === null)
        : filtered.filter(r => r.fase === Number(f.fase));
  }
  if (f.modulos && f.modulos.length > 0) filtered = filtered.filter(r => f.modulos!.includes(r.modulo));
  if (f.secoes && f.secoes.length > 0) filtered = filtered.filter(r => f.secoes!.includes(r.secao));
  if (f.statusesAuditoria && f.statusesAuditoria.length > 0) {
    filtered = filtered.filter(r => f.statusesAuditoria!.includes(r.statusAuditoria));
  }
  if (f.statusesGovernanca && f.statusesGovernanca.length > 0) {
    filtered = filtered.filter(r => f.statusesGovernanca!.includes(r.statusGovernanca));
  }
  const wantedTags = normalizeReviewTags(
    (f.tagsRevisao || []).flatMap(raw => String(raw).split(',').map(s => s.trim()))
  );
  if (wantedTags.length > 0) {
    filtered = filtered.filter(r => r.reviewTags.some(t => wantedTags.includes(t)));
  }
  const wantedIng = (f.ingestao || [])
    .flatMap(raw => String(raw).split(',').map(s => s.trim()))
    .filter(Boolean);
  if (wantedIng.length > 0) {
    filtered = filtered.filter(r => {
      if (wantedIng.includes('ingerida_pelo_agente') && (r.revisoesConsumidasCount ?? 0) > 0) {
        return true;
      }
      return r.reviewIngestionState ? wantedIng.includes(r.reviewIngestionState) : false;
    });
  }
  if (f.estagio) {
    filtered = filtered.filter(r => r.curationStage === f.estagio);
  }
  if (f.carga) filtered = filtered.filter(r => r.workloadType === f.carga);
  if (f.temVideo !== null && f.temVideo !== undefined && f.temVideo !== '') {
    const tv = f.temVideo === 'true';
    filtered = filtered.filter(r => r.temVideo === tv);
  }
  if (f.comDivergencias !== null && f.comDivergencias !== undefined && f.comDivergencias !== '') {
    const cd = f.comDivergencias === 'true';
    filtered = filtered.filter(r => (r.divergenciasCount > 0) === cd);
  }
  const q = f.q?.trim().toLowerCase();
  if (q) {
    if (q.startsWith('#/')) {
      filtered = filtered.filter(r => r.rotasHash.some(h => h.toLowerCase().includes(q)));
    } else {
      filtered = filtered.filter(
        r =>
          r.id.toLowerCase().includes(q) ||
          r.titulo.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q)) ||
          r.rotasHash.some(h => h.toLowerCase().includes(q)) ||
          reviewTagsPrefix(r.reviewTags).trim().toLowerCase().includes(q) ||
          r.reviewTags.some(t => t.toLowerCase() === q) ||
          (r.ultimoLoteIngestaoId || '').toLowerCase().includes(q)
      );
    }
  }
  return filtered;
}

const isDirectExecution =
  !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  if (!isSupabaseConfigured()) {
    console.error('✕ ERRO: SUPABASE_URL e SUPABASE_SECRET_KEY não definidos em auditoria/.env');
    process.exit(1);
  }

  console.log('====================================================');
  console.log('  ORION AUDIT CONSOLE — API SERVER + SUPABASE       ');
  console.log('====================================================');
  console.log(`✓ Supabase URL: ${SUPABASE_URL}`);
  console.log(`✓ Porta Local:  http://localhost:${PORT}`);
  console.log('====================================================\n');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  const sendJson = (status: number, data: any) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  const readBody = (): Promise<any> =>
    new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });

  try {
    // 1. Fallback local para mídia (caso algum arquivo local ainda seja referenciado via /api/media)
    if (pathname.startsWith('/api/media/rotinas/')) {
      const parts = pathname.replace('/api/media/rotinas/', '').split('/');
      if (parts.length >= 3) {
        const [mod, slug, file] = parts.map(decodeURIComponent);
        const filePath = path.join(rotinasDir, mod, slug, file);
        if (filePath.startsWith(rotinasDir) && fs.existsSync(filePath)) {
          const ext = path.extname(file).toLowerCase();
          const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' });
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }
      res.writeHead(404);
      res.end('Media not found');
      return;
    }

    // 2. GET /api/rotinas
    if (req.method === 'GET' && pathname === '/api/rotinas') {
      const params = reqUrl.searchParams;
      const faseParam = params.get('fase');
      const moduloParam = params.getAll('modulo');
      const secaoParam = params.getAll('secao');
      const statusAuditoriaParam = params.getAll('statusAuditoria');
      const statusGovernancaParam = params.getAll('statusGovernanca');
      // ADR-024: filtro por tag (ATT, CCC, DDD, XRX), que enxerga também as tags adicionais de uma rotina multi-tag
      const tagRevisaoParam = [
        ...params.getAll('tagRevisao'),
        ...params.getAll('reviewTags'),
        ...params.getAll('tag'),
      ];
      const cargaParam = params.get('carga');
      const ingestaoParam = params.getAll('ingestao');
      const estagioParam = params.get('estagio');
      const temVideoParam = params.get('temVideo');
      const comDivergenciasParam = params.get('comDivergencias');
      const q = params.get('q')?.trim().toLowerCase();
      const page = Math.max(1, parseInt(params.get('page') || '1', 10));
      const pageSize = Math.max(1, parseInt(params.get('pageSize') || '25', 10));
      const sort = params.get('sort') || 'id';
      const order = params.get('order') || 'asc';

      const { summaries: allSummaries, rawRows, allReviewRows } = await fetchAllRoutinesSummary();
      const filtered = filterRoutineSummaries(allSummaries, {
        fase: faseParam,
        modulos: moduloParam,
        secoes: secaoParam,
        statusesAuditoria: statusAuditoriaParam,
        statusesGovernanca: statusGovernancaParam,
        tagsRevisao: tagRevisaoParam,
        ingestao: ingestaoParam,
        estagio: estagioParam,
        carga: cargaParam,
        temVideo: temVideoParam,
        comDivergencias: comDivergenciasParam,
        q,
      });

      filtered.sort((a: any, b: any) => {
        const va = a[sort] ?? '';
        const vb = b[sort] ?? '';
        if (typeof va === 'number' && typeof vb === 'number') {
          return order === 'desc' ? vb - va : va - vb;
        }
        return order === 'desc'
          ? String(vb).localeCompare(String(va), 'pt-BR', { numeric: true })
          : String(va).localeCompare(String(vb), 'pt-BR', { numeric: true });
      });

      const total = filtered.length;
      const startIdx = (page - 1) * pageSize;
      const paged = filtered.slice(startIdx, startIdx + pageSize);
      const stats = await buildDashboardStats(allSummaries, rawRows, allReviewRows);

      sendJson(200, { data: paged, meta: { total, page, pageSize, stats } });
      return;
    }

    // 3. GET /api/rotinas/:id
    const routineMatch = pathname.match(/^\/api\/rotinas\/([^/]+)$/);
    if (req.method === 'GET' && routineMatch) {
      const id = decodeURIComponent(routineMatch[1]);
      const detail = await fetchRoutineDetail(id);
      if (!detail) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }
      sendJson(200, detail);
      return;
    }

    // 4. POST /api/rotinas/:id/aprovar
    const approveMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/aprovar$/);
    if (req.method === 'POST' && approveMatch) {
      const id = decodeURIComponent(approveMatch[1]);
      const body = await readBody();
      const supabase = getSupabaseAdmin();

      if (!body.revisor?.trim()) {
        sendJson(422, { error: { code: 'validation', message: 'Informe o nome do revisor.' } });
        return;
      }

      const { data: existing, error: exErr } = await supabase.from('routines').select('*').eq('id', id).maybeSingle();
      if (exErr) throw exErr;
      if (!existing) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }

      if (isReview(existing.status_auditoria) && !body.confirmacaoManual) {
        const tagsStr =
          describeTags(extractRoutineReviewTags(existing)) ||
          `[${REVIEW_TAGS[existing.status_auditoria as ReviewStatus].tag}]`;
        sendJson(409, {
          error: {
            code: 'manual_confirmation_required',
            message: `Confirme a validação manual antes de aprovar uma rotina ${tagsStr}.`,
          },
        });
        return;
      }

      if (
        body.edicoes?.some((e: any) => /\bvideo_id\b/.test(e.validatedText)) ||
        (body.descricao && /\bvideo_id\b/.test(body.descricao))
      ) {
        sendJson(422, {
          error: { code: 'forbidden_field', message: 'Campo proibido: video_id. Use bunny_video_id.' },
        });
        return;
      }

      const now = new Date().toISOString();
      let editedCount = 0;

      if (Array.isArray(body.edicoes) && body.edicoes.length > 0) {
        for (const ed of body.edicoes) {
          const { data: stepRow } = await supabase
            .from('routine_steps')
            .select('original_text, validated_text')
            .eq('routine_id', id)
            .eq('step_number', ed.stepNumber)
            .maybeSingle();
          if (stepRow && stepRow.validated_text !== ed.validatedText) {
            await supabase
              .from('routine_steps')
              .update({
                validated_text: ed.validatedText,
                is_modified: ed.validatedText !== stepRow.original_text,
                updated_at: now,
              })
              .eq('routine_id', id)
              .eq('step_number', ed.stepNumber);
            editedCount++;
          }
        }
      }

      const updateFields: any = { status_governanca: 'aprovada', updated_at: now };
      if (body.descricao && body.descricao !== existing.descricao_revisada) {
        updateFields.descricao_revisada = body.descricao;
        editedCount++;
      }

      await supabase.from('routines').update(updateFields).eq('id', id);

      if (editedCount > 0) {
        await supabase.from('governance_events').insert({
          id: `ev-ed-${Date.now()}`,
          routine_id: id,
          tipo: 'texto_editado',
          autor: body.revisor,
          em: now,
          descricao: `${editedCount} trecho(s) editado(s) antes da aprovação.`,
        });
      }

      const evt = {
        id: `ev-ap-${Date.now()}`,
        routine_id: id,
        tipo: 'aprovada',
        autor: body.revisor,
        em: now,
        descricao: body.comentario ? `Rotina aprovada. ${body.comentario}` : 'Rotina aprovada.',
      };
      await supabase.from('governance_events').insert(evt);

      await mirrorGovernanceToDiskAndSupabase(id, {
        statusGovernanca: 'aprovada',
        revisor: body.revisor,
        comentario: body.comentario,
        descricao: body.descricao,
        edicoes: body.edicoes,
        updatedAt: now,
      });

      const updated = await fetchRoutineDetail(id);
      sendJson(200, { rotina: updated, evento: mapEventRow(evt) });
      return;
    }

    // 4b. PUT /api/rotinas/:id/texto (Edição direta de descrição/passos com dupla via)
    const editTextMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/texto$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && editTextMatch) {
      const id = decodeURIComponent(editTextMatch[1]);
      const body = await readBody();
      const supabase = getSupabaseAdmin();

      const { data: existing, error: exErr } = await supabase.from('routines').select('*').eq('id', id).maybeSingle();
      if (exErr) throw exErr;
      if (!existing) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }

      if (
        body.edicoes?.some((e: any) => /\bvideo_id\b/.test(e.validatedText)) ||
        (body.descricao && /\bvideo_id\b/.test(body.descricao))
      ) {
        sendJson(422, {
          error: { code: 'forbidden_field', message: 'Campo proibido: video_id. Use bunny_video_id.' },
        });
        return;
      }

      const now = new Date().toISOString();
      const revisor = body.revisor?.trim() || 'Revisor';
      let editedCount = 0;

      if (Array.isArray(body.edicoes) && body.edicoes.length > 0) {
        for (const ed of body.edicoes) {
          const { data: stepRow } = await supabase
            .from('routine_steps')
            .select('original_text, validated_text')
            .eq('routine_id', id)
            .eq('step_number', ed.stepNumber)
            .maybeSingle();
          if (stepRow && stepRow.validated_text !== ed.validatedText) {
            await supabase
              .from('routine_steps')
              .update({
                validated_text: ed.validatedText,
                is_modified: ed.validatedText !== stepRow.original_text,
                updated_at: now,
              })
              .eq('routine_id', id)
              .eq('step_number', ed.stepNumber);
            editedCount++;
          }
        }
      }

      const updateFields: any = { updated_at: now };
      if (body.descricao && body.descricao !== existing.descricao_revisada) {
        updateFields.descricao_revisada = body.descricao;
        editedCount++;
      }
      await supabase.from('routines').update(updateFields).eq('id', id);

      if (editedCount > 0) {
        await supabase.from('governance_events').insert({
          id: `ev-ed-${Date.now()}`,
          routine_id: id,
          tipo: 'texto_editado',
          autor: revisor,
          em: now,
          descricao: `${editedCount} trecho(s) editado(s) no Console.`,
        });
      }

      await mirrorGovernanceToDiskAndSupabase(id, {
        revisor,
        descricao: body.descricao,
        edicoes: body.edicoes,
        updatedAt: now,
      });

      const updated = await fetchRoutineDetail(id);
      sendJson(200, { rotina: updated });
      return;
    }

    // 5. POST /api/rotinas/:id/revisao
    const reviewMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/revisao$/);
    if (req.method === 'POST' && reviewMatch) {
      const id = decodeURIComponent(reviewMatch[1]);
      const body = await readBody();
      const supabase = getSupabaseAdmin();

      if (!body.revisor?.trim()) {
        sendJson(422, { error: { code: 'validation', message: 'Informe o nome do revisor.' } });
        return;
      }
      if (!body.motivo || body.motivo.trim().length < 10) {
        sendJson(422, {
          error: { code: 'validation', message: 'O motivo da revisão precisa de pelo menos 10 caracteres.' },
        });
        return;
      }

      const { data: existing } = await supabase.from('routines').select('id').eq('id', id).maybeSingle();
      if (!existing) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }

      const now = new Date().toISOString();
      const reviewId = `rev-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
      const revisor = body.revisor.trim();
      const categoria = body.categoria || 'outro';
      const passos: number[] = Array.isArray(body.passos) ? body.passos : [];
      const motivo = body.motivo.trim();

      const { error: revInsErr } = await supabase.from('routine_reviews').insert({
        id: reviewId,
        routine_id: id,
        revisor,
        categoria,
        passos,
        motivo,
        status: 'aberta',
        versao: 1,
        criado_em: now,
        atualizado_em: now,
        atualizado_por: revisor,
      });
      if (revInsErr) throw revInsErr;

      const { error: verInsErr } = await supabase.from('routine_review_versions').insert({
        review_id: reviewId,
        versao: 1,
        revisor,
        categoria,
        passos,
        motivo,
        status: 'aberta',
        alterado_por: revisor,
        nota_atualizacao: 'Revisão criada',
        criado_em: now,
      });
      if (verInsErr) throw verInsErr;

      await supabase.from('routines').update({ status_governanca: 'revisao_solicitada', updated_at: now }).eq('id', id);

      const evt = {
        id: `ev-rev-${Date.now()}`,
        routine_id: id,
        tipo: 'revisao_solicitada',
        autor: revisor,
        em: now,
        descricao: `${motivo}${passos.length ? ` (passos ${passos.join(', ')})` : ''}`,
        meta: { categoria, reviewId, versao: 1 },
      };
      await supabase.from('governance_events').insert(evt);

      await mirrorGovernanceToDiskAndSupabase(id, {
        statusGovernanca: 'revisao_solicitada',
        revisor,
        updatedAt: now,
      });

      const updated = await fetchRoutineDetail(id);
      const createdReviews = await fetchReviewsList({ routineId: id });
      const revisao = createdReviews.find((r: any) => r.id === reviewId);
      sendJson(200, { rotina: updated, evento: mapEventRow(evt), revisao });
      return;
    }

    // 5b. GET /api/revisoes (Biblioteca global de revisões + histórico de lotes exportados)
    if (req.method === 'GET' && pathname === '/api/revisoes') {
      const params = reqUrl.searchParams;
      const [allItems, filtered, lotes] = await Promise.all([
        fetchReviewsList({}),
        fetchReviewsList({
          routineId: params.get('routineId') || undefined,
          status: params.get('status') || undefined,
          categoria: params.get('categoria') || undefined,
          modulo: params.get('modulo') || undefined,
          ingestao: params.get('ingestao') || undefined,
          q: params.get('q') || undefined,
        }),
        fetchRecentBatches(20),
      ]);
      const pendingItems = allItems.filter((i: any) => i.pendenteExportacao);
      const consumedItems = allItems.filter((i: any) => i.consumidaPeloAgente);
      sendJson(200, {
        data: filtered,
        meta: {
          total: filtered.length,
          abertas: allItems.filter((i: any) => i.status === 'aberta').length,
          emAndamento: allItems.filter((i: any) => i.status === 'em_andamento').length,
          resolvidas: allItems.filter((i: any) => i.status === 'resolvida').length,
          arquivadas: allItems.filter((i: any) => i.status === 'arquivada').length,
          pendentesExportacao: pendingItems.length,
          consumidas: consumedItems.length,
          rotinasPendentesExportacao: new Set(pendingItems.map((i: any) => i.routineId)).size,
          rotinasConsumidas: new Set(consumedItems.map((i: any) => i.routineId)).size,
        },
        lotes,
      });
      return;
    }

    // 5b2. GET /api/revisoes/lotes
    if (req.method === 'GET' && pathname === '/api/revisoes/lotes') {
      const lotes = await fetchRecentBatches(50);
      sendJson(200, { data: lotes });
      return;
    }

    // 5b3. GET /api/revisoes/lotes/:batchId/download
    const batchDlMatch = pathname.match(/^\/api\/revisoes\/lotes\/([^/]+)\/download$/);
    if (req.method === 'GET' && batchDlMatch) {
      const batchId = decodeURIComponent(batchDlMatch[1]);
      const formatParam = reqUrl.searchParams.get('formato');
      const supabase = getSupabaseAdmin();
      const { data: batchRow, error: bErr } = await supabase
        .from('review_export_batches')
        .select('*')
        .eq('id', batchId)
        .maybeSingle();
      if (bErr) throw bErr;
      if (!batchRow) {
        sendJson(404, { error: { code: 'not_found', message: `Lote ${batchId} não encontrado.` } });
        return;
      }
      const batch = mapBatchRow(batchRow);
      const allReviews = await fetchReviewsList({});
      const selected = allReviews.filter(
        (r: any) => batch.reviewIds.includes(r.id) || r.loteExportacaoId === batchId
      );
      const routines = await buildExportBundleRoutines(selected);
      const formato = formatParam === 'json' || formatParam === 'markdown' ? formatParam : batch.formato;
      const content =
        formato === 'json'
          ? buildExportJson({
              batchId: batch.id,
              operador: batch.operador,
              nota: batch.nota,
              marcarComoIngeridas: true,
              exportedAt: batch.criadoEm,
              routines,
            })
          : buildExportMarkdown({
              batchId: batch.id,
              operador: batch.operador,
              nota: batch.nota,
              marcarComoIngeridas: true,
              exportedAt: batch.criadoEm,
              routines,
            });
      sendJson(200, {
        batch,
        filename: `orion-revisoes-${batch.id}.${formato === 'json' ? 'json' : 'md'}`,
        mimeType: formato === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8',
        content,
        totalRevisoes: selected.length,
        totalRotinas: routines.length,
        routineIds: routines.map(r => r.id),
        reviewIds: selected.map((r: any) => r.id),
      });
      return;
    }

    // 5b4. POST /api/revisoes/exportar (Exportação em massa para ingestão manual no Antigravity)
    if (req.method === 'POST' && pathname === '/api/revisoes/exportar') {
      const body = await readBody();
      const escopo: 'pendentes' | 'selecionadas' | 'todas_ativas' = body.escopo || 'pendentes';
      const formato: 'markdown' | 'json' = body.formato === 'json' ? 'json' : 'markdown';
      const marcarComoIngeridas = body.marcarComoIngeridas !== false;
      const operador = String(body.operador || '').trim();
      const nota = body.nota ? String(body.nota).trim() : undefined;

      if (marcarComoIngeridas && !operador) {
        sendJson(422, {
          error: {
            code: 'validation',
            message: 'Informe o nome do operador responsável pela exportação/ingestão.',
          },
        });
        return;
      }

      const allReviews = await fetchReviewsList({});
      let selected = allReviews;
      if (escopo === 'pendentes') {
        selected = allReviews.filter((r: any) => r.pendenteExportacao);
      } else if (escopo === 'selecionadas') {
        const wanted = new Set(Array.isArray(body.reviewIds) ? body.reviewIds.map(String) : []);
        selected = allReviews.filter((r: any) => wanted.has(r.id));
      } else {
        selected = allReviews.filter((r: any) => r.status === 'aberta' || r.status === 'em_andamento');
      }

      if (selected.length === 0) {
        sendJson(409, {
          error: {
            code: 'empty_export',
            message: 'Nenhuma revisão elegível encontrada para este escopo de exportação.',
          },
        });
        return;
      }

      const now = new Date().toISOString();
      const batchId = marcarComoIngeridas ? makeBatchId(now) : `copia-${now.slice(0, 10)}`;
      const routines = await buildExportBundleRoutines(selected);
      const reviewIds = selected.map((r: any) => r.id);
      const routineIds = routines.map(r => r.id);
      let batch: ReturnType<typeof mapBatchRow> | null = null;

      if (marcarComoIngeridas) {
        const supabase = getSupabaseAdmin();
        const batchInsert = {
          id: batchId,
          operador,
          formato,
          nota: nota || null,
          review_ids: reviewIds,
          routine_ids: routineIds,
          total_revisoes: reviewIds.length,
          total_rotinas: routineIds.length,
          criado_em: now,
        };
        const { error: bInsErr } = await supabase.from('review_export_batches').insert(batchInsert);
        if (bInsErr) throw bInsErr;

        await Promise.all(
          selected.map((rev: any) =>
            supabase
              .from('routine_reviews')
              .update({
                consumida_pelo_agente: true,
                consumida_em: now,
                consumida_por: operador,
                lote_exportacao_id: batchId,
                versao_consumida: rev.versao,
              })
              .eq('id', rev.id)
          )
        );

        const events = routineIds.map((rid, idx) => {
          const countInRoutine = selected.filter((r: any) => r.routineId === rid).length;
          return {
            id: `ev-ing-${Date.now()}-${idx}-${Math.random().toString(16).slice(2, 5)}`,
            routine_id: rid,
            tipo: 'revisao_ingerida_agente',
            autor: operador,
            em: now,
            descricao: `${countInRoutine} revisão(ões) exportada(s) e marcada(s) como ingerida(s) pelo agente (lote ${batchId}).${nota ? ` Nota: ${nota}` : ''}`,
            meta: { batchId, formato, totalRevisoesRotina: countInRoutine },
          };
        });
        if (events.length > 0) {
          await supabase.from('governance_events').insert(events);
        }

        batch = mapBatchRow(batchInsert);
      }

      const content =
        formato === 'json'
          ? buildExportJson({
              batchId,
              operador: operador || 'Operador',
              nota,
              marcarComoIngeridas,
              exportedAt: now,
              routines,
            })
          : buildExportMarkdown({
              batchId,
              operador: operador || 'Operador',
              nota,
              marcarComoIngeridas,
              exportedAt: now,
              routines,
            });

      sendJson(200, {
        batch,
        filename: `orion-revisoes-${batchId}.${formato === 'json' ? 'json' : 'md'}`,
        mimeType: formato === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8',
        content,
        totalRevisoes: reviewIds.length,
        totalRotinas: routineIds.length,
        routineIds,
        reviewIds,
      });
      return;
    }

    // 5c. GET /api/rotinas/:id/revisoes
    const routineReviewsMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/revisoes$/);
    if (req.method === 'GET' && routineReviewsMatch) {
      const id = decodeURIComponent(routineReviewsMatch[1]);
      const items = await fetchReviewsList({ routineId: id });
      sendJson(200, { data: items });
      return;
    }

    // 5d. PUT|PATCH /api/revisoes/:reviewId (Editar revisão e gerar nova versão)
    const updateReviewMatch = pathname.match(/^\/api\/revisoes\/([^/]+)$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && updateReviewMatch) {
      const reviewId = decodeURIComponent(updateReviewMatch[1]);
      const body = await readBody();
      const supabase = getSupabaseAdmin();

      const { data: existing, error: exErr } = await supabase
        .from('routine_reviews')
        .select('*')
        .eq('id', reviewId)
        .maybeSingle();
      if (exErr) throw exErr;
      if (!existing) {
        sendJson(404, { error: { code: 'not_found', message: `Revisão ${reviewId} não encontrada.` } });
        return;
      }

      const alteradoPor = (body.alteradoPor || body.revisor || existing.atualizado_por || existing.revisor || '').trim();
      if (!alteradoPor) {
        sendJson(422, { error: { code: 'validation', message: 'Informe quem está realizando a atualização.' } });
        return;
      }

      const motivo = body.motivo !== undefined ? String(body.motivo).trim() : existing.motivo;
      if (motivo.length < 10) {
        sendJson(422, { error: { code: 'validation', message: 'O motivo precisa de pelo menos 10 caracteres.' } });
        return;
      }

      const categoria = body.categoria ?? existing.categoria;
      const passos: number[] = Array.isArray(body.passos) ? body.passos : existing.passos || [];
      const resolucao = body.resolucao !== undefined ? (body.resolucao ? String(body.resolucao).trim() : null) : existing.resolucao;
      const status = body.status ?? existing.status;
      const revisor = body.revisor?.trim() || existing.revisor;
      const nextVersion = Number(existing.versao || 1) + 1;
      const now = new Date().toISOString();

      const { error: updErr } = await supabase
        .from('routine_reviews')
        .update({
          revisor,
          categoria,
          passos,
          motivo,
          resolucao,
          status,
          versao: nextVersion,
          atualizado_em: now,
          atualizado_por: alteradoPor,
        })
        .eq('id', reviewId);
      if (updErr) throw updErr;

      const { error: verErr } = await supabase.from('routine_review_versions').insert({
        review_id: reviewId,
        versao: nextVersion,
        revisor,
        categoria,
        passos,
        motivo,
        resolucao,
        status,
        alterado_por: alteradoPor,
        nota_atualizacao: body.notaAtualizacao?.trim() || `Atualizada para v${nextVersion}`,
        criado_em: now,
      });
      if (verErr) throw verErr;

      await supabase.from('governance_events').insert({
        id: `ev-rev-upd-${Date.now()}`,
        routine_id: existing.routine_id,
        tipo: 'texto_editado',
        autor: alteradoPor,
        em: now,
        descricao: `Revisão ${reviewId} atualizada para v${nextVersion} (status: ${status}).${body.notaAtualizacao ? ` Nota: ${body.notaAtualizacao}` : ''}`,
        meta: { reviewId, versao: nextVersion, status },
      });

      await mirrorGovernanceToDiskAndSupabase(existing.routine_id, {
        revisor: alteradoPor,
        updatedAt: now,
      });

      const items = await fetchReviewsList({ routineId: existing.routine_id });
      const revisao = items.find((i: any) => i.id === reviewId);
      sendJson(200, { revisao });
      return;
    }

    // 6. Endpoints legados de acionamento do runner desativados (ADR-036: motor roda exclusivamente local)
    if (
      req.method === 'POST' &&
      (pathname === '/api/rotinas/reexecutar-lote' || /^\/api\/rotinas\/[^/]+\/reexecutar$/.test(pathname))
    ) {
      sendJson(410, {
        error: {
          code: 'runner_disabled',
          message:
            'O motor de auditoria é executado exclusivamente no ambiente local. Exporte as revisões pela Central de Revisões para calibrar e rodar o motor.',
        },
      });
      return;
    }

    // 8. Healthcheck
    if (pathname === '/api/health') {
      const supabase = getSupabaseAdmin();
      const { count: totalCount } = await supabase.from('routines').select('*', { count: 'exact', head: true });
      const { count: auditedCount } = await supabase
        .from('routines')
        .select('*', { count: 'exact', head: true })
        .neq('status_auditoria', 'nao_auditada');

      sendJson(200, {
        status: 'ok',
        backend: 'supabase',
        supabaseUrl: SUPABASE_URL,
        routinesIndexed: totalCount ?? 0,
        auditedIndexed: auditedCount ?? 0,
        port: PORT,
      });
      return;
    }

    sendJson(404, { error: { code: 'not_found', message: `Endpoint ${pathname} não encontrado.` } });
  } catch (err: any) {
    console.error('API Error:', err);
    sendJson(500, { error: { code: 'server_error', message: err.message || 'Erro interno.' } });
  }
});

if (isDirectExecution) {
  server.listen(PORT, HOST, () => {
    console.log(`🚀 API Servidor (Supabase) ativo em http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  });
}

export { server };
