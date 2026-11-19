import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  buildExportJson,
  buildExportMarkdown,
  computeCurationStage,
  computeReviewIngestionFlags,
  computeRoutineReviewRollup,
  isReviewAuditStatus,
  normalizeTags,
  reviewTagsForStatus,
  tagsFromPrefix,
  type CurationStage,
  type ExportBundleRoutine,
  type ReviewIngestionState,
  type ReviewTag,
} from './exportFormat.js';

type Row = Record<string, unknown>;

function asStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : v === null || v === undefined ? fallback : String(v);
}

function asOptStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function asNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asOptNum(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function asStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)) : [];
}

function asNumArr(v: unknown): number[] {
  return Array.isArray(v) ? v.map((x) => Number(x)).filter((n) => Number.isFinite(n)) : [];
}

function asObj(v: unknown): Row | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Row) : null;
}

let cachedSupabase: SupabaseClient | null = null;

function getEnvSupabaseUrl(): string {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
}

function getEnvSupabaseSecret(): string {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function getSupabase(): SupabaseClient {
  const url = getEnvSupabaseUrl();
  const key = getEnvSupabaseSecret();
  if (!url || !key) {
    throw new Error(
      'Variáveis SUPABASE_URL e SUPABASE_SECRET_KEY não configuradas no ambiente da API.',
    );
  }
  if (!cachedSupabase) {
    cachedSupabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedSupabase;
}

function extractRoutineReviewTags(row: Row | null | undefined): ReviewTag[] {
  const status = asStr(row?.status_auditoria);
  const dbTags = asStrArr(row?.tags_revisao);
  if (
    status === 'nao_auditada' ||
    status === 'validado_inalterado' ||
    status === 'validado_com_ajustes'
  ) {
    return normalizeTags(dbTags);
  }
  const audUi = asObj(row?.auditoria_ui);
  const fmTags = asStrArr(audUi?.review_tags);
  const prefixTags = row?.pasta_auditoria ? tagsFromPrefix(asStr(row.pasta_auditoria)) : [];
  const statusTags = isReviewAuditStatus(status) ? reviewTagsForStatus(status) : [];
  return normalizeTags([...dbTags, ...fmTags, ...prefixTags, ...statusTags]);
}

function reviewTagsPrefix(tags: ReadonlyArray<ReviewTag>): string {
  return tags.length > 0 ? `${tags.map((t) => `[${t}]`).join('')} ` : '';
}

function mapEventRow(row: Row) {
  return {
    id: asStr(row.id),
    tipo: asStr(row.tipo),
    autor: asStr(row.autor),
    em: asStr(row.em),
    descricao: asStr(row.descricao),
    meta: row.meta ?? undefined,
  };
}

function mapBatchRow(b: Row) {
  return {
    id: asStr(b.id),
    operador: asStr(b.operador),
    formato: b.formato === 'json' ? ('json' as const) : ('markdown' as const),
    nota: asOptStr(b.nota),
    reviewIds: asStrArr(b.review_ids),
    routineIds: asStrArr(b.routine_ids),
    totalRevisoes: asNum(b.total_revisoes, 0),
    totalRotinas: asNum(b.total_rotinas, 0),
    criadoEm: asStr(b.criado_em),
  };
}

function mapReviewVersionRow(v: Row) {
  return {
    versao: asNum(v.versao, 1),
    revisor: asStr(v.revisor),
    categoria: asStr(v.categoria),
    passos: asNumArr(v.passos),
    motivo: asStr(v.motivo),
    resolucao: asOptStr(v.resolucao),
    status: asStr(v.status),
    alteradoPor: asStr(v.alterado_por),
    notaAtualizacao: asOptStr(v.nota_atualizacao),
    criadoEm: asStr(v.criado_em),
  };
}

type MappedReviewVersion = ReturnType<typeof mapReviewVersionRow>;

function mapReviewItem(r: Row, versions: MappedReviewVersion[]) {
  const routine = asObj(r.routines);
  const flags = computeReviewIngestionFlags({
    status: asStr(r.status, 'aberta'),
    versao: asNum(r.versao, 1),
    consumida_pelo_agente: Boolean(r.consumida_pelo_agente),
    versao_consumida: asOptNum(r.versao_consumida),
  });
  return {
    id: asStr(r.id),
    routineId: asStr(r.routine_id),
    rotinaTitulo: asStr(routine?.titulo, asStr(r.routine_id)),
    rotinaModulo: asStr(routine?.modulo, 'geral'),
    rotinaFase: routine?.fase !== null && routine?.fase !== undefined ? asNum(routine.fase) : null,
    rotinaStatusAuditoria: asStr(routine?.status_auditoria, 'nao_auditada'),
    rotinaReviewTags: routine ? extractRoutineReviewTags(routine) : [],
    rotinaTotalPassos: asNum(routine?.total_passos, 0),
    revisor: asStr(r.revisor),
    categoria: asStr(r.categoria),
    passos: asNumArr(r.passos),
    motivo: asStr(r.motivo),
    resolucao: asOptStr(r.resolucao),
    status: asStr(r.status, 'aberta'),
    versao: asNum(r.versao, 1),
    criadoEm: asStr(r.criado_em),
    atualizadoEm: asStr(r.atualizado_em),
    atualizadoPor: asStr(r.atualizado_por, asStr(r.revisor)),
    consumidaPeloAgente: flags.consumidaPeloAgente,
    consumidaEm: asOptStr(r.consumida_em),
    consumidaPor: asOptStr(r.consumida_por),
    loteExportacaoId: asOptStr(r.lote_exportacao_id),
    versaoConsumida: asOptNum(r.versao_consumida),
    editadaPosIngestao: flags.editadaPosIngestao,
    pendenteExportacao: flags.pendenteExportacao,
    versoes: versions,
  };
}

type MappedReviewItem = ReturnType<typeof mapReviewItem>;

function mapRoutineSummary(row: Row, routineReviews: Row[] = []) {
  const reviewTags = extractRoutineReviewTags(row);
  const rollup = computeRoutineReviewRollup(
    routineReviews.map((r) => ({
      status: asStr(r.status, 'aberta'),
      versao: asNum(r.versao, 1),
      consumida_pelo_agente: Boolean(r.consumida_pelo_agente ?? r.consumidaPeloAgente),
      consumida_em: asOptStr(r.consumida_em ?? r.consumidaEm),
      consumida_por: asOptStr(r.consumida_por ?? r.consumidaPor),
      lote_exportacao_id: asOptStr(r.lote_exportacao_id ?? r.loteExportacaoId),
      versao_consumida: asOptNum(r.versao_consumida ?? r.versaoConsumida),
    })),
  );
  const curationStage = computeCurationStage({
    statusGovernanca: asStr(row.status_governanca, 'pendente_aprovacao'),
    statusAuditoria: asStr(row.status_auditoria, 'nao_auditada'),
    revisoesPendentesExportacao: rollup.revisoesPendentesExportacao,
    revisoesConsumidasCount: rollup.revisoesConsumidasCount,
  });

  return {
    id: asStr(row.id),
    titulo: asStr(row.titulo),
    modulo: asStr(row.modulo),
    secao: asStr(row.secao),
    fase: row.fase !== null && row.fase !== undefined ? asNum(row.fase) : null,
    temVideo: Boolean(row.tem_video),
    workloadType: asStr(row.workload_type, 'read_only'),
    statusAuditoria: asStr(row.status_auditoria, 'nao_auditada'),
    reviewTags,
    tagsRevisao: reviewTags,
    statusGovernanca: asStr(row.status_governanca, 'pendente_aprovacao'),
    pastaAuditoria: asOptStr(row.pasta_auditoria) ?? null,
    totalPassos: asNum(row.total_passos, 0),
    printsGeradas: asNum(row.prints_geradas, 0),
    divergenciasCount: asNum(row.divergencias_count, 0),
    menorConfianca: asOptNum(row.menor_confianca),
    rotasHash: asStrArr(row.rotas_hash),
    tags: asStrArr(row.tags),
    dataExecucao: asOptStr(row.data_execucao),
    workerId: asOptStr(row.worker_id),
    durationSeconds: asOptNum(row.duration_seconds),
    thumbnailUrl: asOptStr(row.thumbnail_url),
    updatedAt: asStr(row.updated_at),
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

type MappedRoutineSummary = ReturnType<typeof mapRoutineSummary>;

function resolveExternalStepMap(rRow: Row, sRows: Row[], effectiveMd = ''): Map<number, string | undefined> {
  const externalMap = new Map<number, string | undefined>();
  const audUi = asObj(rRow.auditoria_ui);
  const uiExternas = audUi?.etapas_externas;
  if (Array.isArray(uiExternas)) {
    for (const rawEntry of uiExternas) {
      const entry = asObj(rawEntry);
      const n = asOptNum(entry?.passo);
      if (n !== undefined) {
        externalMap.set(n, asOptStr(entry?.portal));
      }
    }
  }
  if (effectiveMd) {
    const body = effectiveMd.replace(/\r\n/g, '\n');
    const stepMatches = body.matchAll(/^(\d+)\.\s[\s\S]*?(?=^\d+\.\s|^#### |$(?![\s\S]))/gm);
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
    const n = asNum(s.step_number);
    if (s.step_scope === 'external_portal') {
      externalMap.set(n, asOptStr(s.portal_externo) ?? externalMap.get(n));
    }
  }
  return externalMap;
}

function mapStepRows(rRow: Row, sRows: Row[], effectiveMd = '') {
  const externalMap = resolveExternalStepMap(rRow, sRows, effectiveMd);
  return (sRows || []).map((s) => {
    const n = asNum(s.step_number);
    const isExternal = s.step_scope === 'external_portal' || externalMap.has(n);
    const mediaObj = asObj(s.media);
    const layoutObj = asObj(s.layout_result);
    return {
      stepNumber: n,
      actionType: asStr(s.action_type, 'click'),
      zonePolicy: asOptStr(s.zone_policy),
      targets: asStrArr(s.targets),
      originalText: asStr(s.original_text),
      validatedText: asStr(s.validated_text),
      isModified: Boolean(s.is_modified),
      status: asStr(s.status, 'nao_executado'),
      stepScope: isExternal ? ('external_portal' as const) : ('orion_tn' as const),
      portalExterno: isExternal ? (asOptStr(s.portal_externo) ?? externalMap.get(n)) : undefined,
      media: mediaObj ? { ...mediaObj, subCapturas: undefined } : null,
      subCapturas: Array.isArray(mediaObj?.subCapturas) ? mediaObj.subCapturas : [],
      callouts: layoutObj?.callouts ?? undefined,
      domGeometry: s.dom_geometry ?? undefined,
      layoutResult: s.layout_result ?? undefined,
      divergence: s.divergence ?? undefined,
      executedAction: s.executed_action ?? undefined,
      invariantes: s.invariantes ?? undefined,
      errorMessage: asOptStr(s.error_message),
    };
  });
}

async function fetchReviewsList(filters: {
  routineId?: string;
  status?: string;
  categoria?: string;
  modulo?: string;
  ingestao?: string;
  q?: string;
} = {}): Promise<MappedReviewItem[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('routine_reviews')
    .select(
      '*, routines!inner(id, titulo, modulo, fase, status_auditoria, tags_revisao, pasta_auditoria, auditoria_ui, total_passos)',
    )
    .order('atualizado_em', { ascending: false });

  if (filters.routineId) query = query.eq('routine_id', filters.routineId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.categoria) query = query.eq('categoria', filters.categoria);

  const { data: reviewRows, error: revErr } = await query;
  if (revErr) throw revErr;

  const typedReviewRows = (reviewRows || []) as Row[];
  const reviewIds = typedReviewRows.map((r) => asStr(r.id));
  const versionsByReview = new Map<string, MappedReviewVersion[]>();
  if (reviewIds.length > 0) {
    const { data: verRows, error: verErr } = await supabase
      .from('routine_review_versions')
      .select('*')
      .in('review_id', reviewIds)
      .order('versao', { ascending: false });
    if (verErr) throw verErr;
    for (const v of (verRows || []) as Row[]) {
      const rid = asStr(v.review_id);
      if (!versionsByReview.has(rid)) versionsByReview.set(rid, []);
      versionsByReview.get(rid)!.push(mapReviewVersionRow(v));
    }
  }

  let items = typedReviewRows.map((r) => mapReviewItem(r, versionsByReview.get(asStr(r.id)) || []));

  if (filters.modulo) {
    items = items.filter((i) => i.rotinaModulo === filters.modulo);
  }
  if (filters.ingestao === 'pendentes') {
    items = items.filter((i) => i.pendenteExportacao);
  } else if (filters.ingestao === 'consumidas') {
    items = items.filter((i) => i.consumidaPeloAgente);
  }
  if (filters.q?.trim()) {
    const t = filters.q.trim().toLowerCase();
    items = items.filter(
      (i) =>
        i.routineId.toLowerCase().includes(t) ||
        i.rotinaTitulo.toLowerCase().includes(t) ||
        i.motivo.toLowerCase().includes(t) ||
        i.revisor.toLowerCase().includes(t) ||
        (i.resolucao || '').toLowerCase().includes(t) ||
        (i.loteExportacaoId || '').toLowerCase().includes(t),
    );
  }

  return items;
}

async function fetchRecentBatches(limit = 20) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('review_export_batches')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(limit);
  if (error) return [];
  return ((data || []) as Row[]).map(mapBatchRow);
}

async function fetchAllRoutinesSummary() {
  const supabase = getSupabase();
  const [{ data: rData, error: rErr }, { data: revData, error: revErr }] = await Promise.all([
    supabase
      .from('routines')
      .select(
        'id, titulo, modulo, secao, fase, tem_video, workload_type, status_auditoria, tags_revisao, status_governanca, pasta_auditoria, total_passos, prints_geradas, divergencias_count, menor_confianca, rotas_hash, tags, data_execucao, worker_id, duration_seconds, thumbnail_url, auditoria_ui, updated_at',
      ),
    supabase
      .from('routine_reviews')
      .select(
        'id, routine_id, status, versao, consumida_pelo_agente, consumida_em, consumida_por, lote_exportacao_id, versao_consumida',
      ),
  ]);

  if (rErr) throw rErr;
  if (revErr) throw revErr;

  const rawRows = (rData || []) as Row[];
  const allReviewRows = (revData || []) as Row[];

  const reviewsByRoutine = new Map<string, Row[]>();
  for (const rev of allReviewRows) {
    const rid = asStr(rev.routine_id);
    if (!reviewsByRoutine.has(rid)) reviewsByRoutine.set(rid, []);
    reviewsByRoutine.get(rid)!.push(rev);
  }

  const summaries = rawRows.map((row) =>
    mapRoutineSummary(row, reviewsByRoutine.get(asStr(row.id)) || []),
  );
  return { summaries, rawRows, allReviewRows };
}

async function buildDashboardStats(
  allSummaries: MappedRoutineSummary[],
  rawRows: Row[],
  allReviewRows: Row[],
) {
  const supabase = getSupabase();
  const totalRotinas = allSummaries.length;
  const auditadas = allSummaries.filter((r) => r.statusAuditoria !== 'nao_auditada').length;
  const naoAuditadas = totalRotinas - auditadas;
  const aprovadas = allSummaries.filter((r) => r.statusGovernanca === 'aprovada').length;
  const taxaAprovacao = auditadas > 0 ? aprovadas / auditadas : 0;
  const autoCuradas = allSummaries.filter((r) => r.statusAuditoria === 'validado_com_ajustes').length;
  const countStatus = (list: MappedRoutineSummary[], status: string) =>
    list.filter((r) => r.statusAuditoria === status).length;
  const bloqueadas = allSummaries.filter((r) => isReviewAuditStatus(r.statusAuditoria)).length;

  const porTagRevisao: Record<ReviewTag, number> = { ATT: 0, CCC: 0, DDD: 0, XRX: 0 };
  for (const r of allSummaries) {
    for (const tag of r.reviewTags || []) {
      if (tag in porTagRevisao) porTagRevisao[tag]++;
    }
  }

  const phaseDefs = [
    { fase: 1, titulo: 'Piloto' },
    { fase: 2, titulo: 'Cadastrais, segurança e parâmetros' },
    { fase: 3, titulo: 'Atos de balcão, insumos e livros' },
    { fase: 4, titulo: 'Financeiro e caixa' },
    { fase: 5, titulo: 'Notas, minutas e escrituras' },
    { fase: 6, titulo: 'Consolidação' },
    { fase: null, titulo: 'Sem fase atribuída' },
  ];

  const porFase = phaseDefs.map((pd) => {
    const rInPhase = pd.fase === 6 ? allSummaries : allSummaries.filter((r) => r.fase === pd.fase);
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
    const aud = rInPhase.filter((r) => r.statusAuditoria !== 'nao_auditada').length;
    return {
      fase: pd.fase,
      titulo: pd.titulo,
      total,
      auditadas: aud,
      porStatus: {
        validado_inalterado: countStatus(rInPhase, 'validado_inalterado'),
        validado_com_ajustes: countStatus(rInPhase, 'validado_com_ajustes'),
        atualizacao_editorial: countStatus(rInPhase, 'atualizacao_editorial'),
        comunicacao_externa: countStatus(rInPhase, 'comunicacao_externa'),
        dependencia_dados_banco: countStatus(rInPhase, 'dependencia_dados_banco'),
        dependencia_cruzada_rotina: countStatus(rInPhase, 'dependencia_cruzada_rotina'),
        nao_auditada: total - aud,
      },
    };
  });

  const porCarga = {
    read_only: allSummaries.filter((r) => r.workloadType === 'read_only').length,
    mutation: allSummaries.filter((r) => r.workloadType === 'mutation').length,
  };

  const modulosList = [
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
  const porModulo = modulosList.map((m) => {
    const rInMod = allSummaries.filter((r) => r.modulo === m);
    return {
      modulo: m,
      total: rInMod.length,
      auditadas: rInMod.filter((r) => r.statusAuditoria !== 'nao_auditada').length,
    };
  });

  const porCamadaDivergencia: Record<string, number> = {
    dom_synonym_heuristic: 0,
    a11y_fuzzy_match: 0,
    llm_a11y_fallback: 0,
  };
  for (const r of rawRows) {
    const audUi = asObj(r.auditoria_ui);
    const autoCura = asObj(audUi?.auto_cura);
    const divs = autoCura?.divergencias_detectadas;
    if (Array.isArray(divs)) {
      for (const rawDiv of divs) {
        const d = asObj(rawDiv);
        const camada = asStr(d?.camada);
        if (camada in porCamadaDivergencia) porCamadaDivergencia[camada]++;
      }
    }
  }

  let totalRevisoesPendentes = 0;
  let totalRevisoesConsumidas = 0;
  for (const rev of allReviewRows) {
    const flags = computeReviewIngestionFlags({
      status: asStr(rev.status, 'aberta'),
      versao: asNum(rev.versao, 1),
      consumida_pelo_agente: Boolean(rev.consumida_pelo_agente),
      versao_consumida: asOptNum(rev.versao_consumida),
    });
    if (flags.pendenteExportacao) totalRevisoesPendentes++;
    if (flags.consumidaPeloAgente) totalRevisoesConsumidas++;
  }

  const [{ data: recentEvents }, batches] = await Promise.all([
    supabase.from('governance_events').select('*').order('em', { ascending: false }).limit(12),
    fetchRecentBatches(1),
  ]);

  const countStage = (st: CurationStage) => allSummaries.filter((r) => r.curationStage === st).length;

  const curadoria = {
    aprovadasKb: countStage('aprovadas_kb'),
    ingeridasAgente: countStage('ingeridas_agente'),
    revisaoPendenteExportacao: countStage('revisao_pendente'),
    precisamApoioHumano: countStage('apoio_humano'),
    prontasConferencia: countStage('prontas_conferencia'),
    naoAuditadas: countStage('nao_auditadas'),
    totalRevisoesPendentes,
    totalRevisoesConsumidas,
    rotinasComIngestao: allSummaries.filter((r) => r.revisoesConsumidasCount > 0).length,
    ultimoLote: batches[0] ?? null,
  };

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
    atividadeRecente: ((recentEvents || []) as Row[]).map((e) => ({
      ...mapEventRow(e),
      rotinaId: asStr(e.routine_id),
    })),
  };
}

async function fetchRoutineDetail(id: string) {
  const supabase = getSupabase();
  const [
    { data: rRowData, error: rErr },
    { data: sRowsData, error: sErr },
    { data: eRowsData, error: eErr },
    revisoes,
  ] = await Promise.all([
    supabase.from('routines').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('routine_steps')
      .select('*')
      .eq('routine_id', id)
      .order('step_number', { ascending: true }),
    supabase
      .from('governance_events')
      .select('*')
      .eq('routine_id', id)
      .order('em', { ascending: false }),
    fetchReviewsList({ routineId: id }),
  ]);

  if (rErr) throw rErr;
  if (sErr) throw sErr;
  if (eErr) throw eErr;
  if (!rRowData) return null;

  const rRow = rRowData as Row;
  const sRows = (sRowsData || []) as Row[];
  const eRows = (eRowsData || []) as Row[];

  const effectiveMd = asStr(rRow.markdown_revisado);
  const summary = mapRoutineSummary(rRow, revisoes as unknown as Row[]);
  const steps = mapStepRows(rRow, sRows, effectiveMd);

  return {
    summary,
    original: {
      id: asStr(rRow.id),
      titulo: asStr(rRow.titulo),
      modulo: asStr(rRow.modulo),
      secao: asStr(rRow.secao),
      tem_video: Boolean(rRow.tem_video),
      workloadType: asStr(rRow.workload_type, 'read_only'),
      frontmatter: asObj(rRow.frontmatter_original) || {},
      descricao: asStr(rRow.descricao_revisada || rRow.descricao_original),
      steps: steps.map((s) => ({
        stepNumber: s.stepNumber,
        rawText: s.originalText,
        targets: s.targets,
        actionType: s.actionType,
        zone: s.zonePolicy,
      })),
      observacoes: asStrArr(rRow.observacoes),
      rawContent: asStr(rRow.markdown_original),
    },
    report:
      rRow.status_auditoria !== 'nao_auditada'
        ? {
            id: asStr(rRow.id),
            modulo: asStr(rRow.modulo),
            titulo: asStr(rRow.titulo),
            workloadType: asStr(rRow.workload_type, 'read_only'),
            workerSessionId: asOptStr(rRow.worker_id),
            status: asStr(rRow.status_auditoria),
            steps: [],
            executedAt: asStr(rRow.data_execucao || rRow.updated_at),
            durationSeconds: asNum(rRow.duration_seconds, 12),
            changelogPath: asStr(rRow.pasta_auditoria),
          }
        : null,
    auditoriaUi: rRow.auditoria_ui || null,
    steps,
    frontmatterOriginalYaml: asStr(rRow.frontmatter_original_yaml),
    frontmatterRevisadoYaml: asStr(rRow.frontmatter_revisado_yaml),
    markdownRevisado: effectiveMd || asStr(rRow.markdown_original),
    bloqueio: rRow.bloqueio ?? undefined,
    historico: eRows.map(mapEventRow),
    revisoes,
  };
}

async function buildExportBundleRoutines(
  selectedReviews: MappedReviewItem[],
): Promise<ExportBundleRoutine[]> {
  const supabase = getSupabase();
  const routineIds = Array.from(new Set(selectedReviews.map((r) => r.routineId))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true }),
  );
  if (routineIds.length === 0) return [];

  const [{ data: rRowsData, error: rErr }, { data: sRowsData, error: sErr }] = await Promise.all([
    supabase.from('routines').select('*').in('id', routineIds),
    supabase
      .from('routine_steps')
      .select(
        'routine_id, step_number, status, step_scope, portal_externo, original_text, validated_text, is_modified, error_message',
      )
      .in('routine_id', routineIds)
      .order('step_number', { ascending: true }),
  ]);
  if (rErr) throw rErr;
  if (sErr) throw sErr;

  const routineById = new Map<string, Row>();
  for (const r of (rRowsData || []) as Row[]) routineById.set(asStr(r.id), r);

  const stepsByRoutine = new Map<string, Row[]>();
  for (const s of (sRowsData || []) as Row[]) {
    const rid = asStr(s.routine_id);
    if (!stepsByRoutine.has(rid)) stepsByRoutine.set(rid, []);
    stepsByRoutine.get(rid)!.push(s);
  }

  const reviewsByRoutine = new Map<string, MappedReviewItem[]>();
  for (const rev of selectedReviews) {
    if (!reviewsByRoutine.has(rev.routineId)) reviewsByRoutine.set(rev.routineId, []);
    reviewsByRoutine.get(rev.routineId)!.push(rev);
  }

  return routineIds.map((id) => {
    const r = routineById.get(id) || {};
    const revs = reviewsByRoutine.get(id) || [];
    const audUi = asObj(r.auditoria_ui);
    const steps = (stepsByRoutine.get(id) || []).map((s) => ({
      stepNumber: asNum(s.step_number),
      status: asStr(s.status, 'ok'),
      stepScope: asStr(s.step_scope, 'orion_tn'),
      portalExterno: asOptStr(s.portal_externo),
      originalText: asStr(s.original_text),
      validatedText: asStr(s.validated_text || s.original_text),
      isModified: Boolean(s.is_modified),
      errorMessage: asOptStr(s.error_message),
    }));

    return {
      id,
      titulo: asStr(r.titulo, revs[0]?.rotinaTitulo || id),
      modulo: asStr(r.modulo, revs[0]?.rotinaModulo || 'geral'),
      secao: asStr(r.secao, id[0] || 'R'),
      fase: r.fase !== null && r.fase !== undefined ? asNum(r.fase) : null,
      statusAuditoria: asStr(r.status_auditoria, 'nao_auditada'),
      reviewTags: extractRoutineReviewTags(r),
      statusGovernanca: asStr(r.status_governanca, 'pendente_aprovacao'),
      dataExecucao: asOptStr(r.data_execucao),
      rotasHash: asStrArr(r.rotas_hash),
      bloqueio: (asObj(r.bloqueio) as ExportBundleRoutine['bloqueio']) ?? null,
      diagnosticoTelaAtt:
        (asObj(audUi?.diagnostico_tela_att) as ExportBundleRoutine['diagnosticoTelaAtt']) ?? null,
      steps,
      revisoes: revs.map((rev) => ({
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

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Row> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return req.body ? (JSON.parse(req.body) as Row) : {};
    if (Buffer.isBuffer(req.body)) {
      const s = req.body.toString('utf8');
      return s ? (JSON.parse(s) as Row) : {};
    }
    return asObj(req.body) || {};
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as Row) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function hasForbiddenVideoId(body: Row): boolean {
  const edicoes = Array.isArray(body.edicoes) ? body.edicoes : [];
  const inSteps = edicoes.some((item) => {
    const o = asObj(item);
    return o ? /\bvideo_id\b/.test(asStr(o.validatedText)) : false;
  });
  const desc = asOptStr(body.descricao);
  return inSteps || Boolean(desc && /\bvideo_id\b/.test(desc));
}

export async function handleOrionAuditApiRequest(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  const sendJson = (status: number, data: unknown) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  try {
    // 1. GET /api/health
    if (req.method === 'GET' && pathname === '/api/health') {
      const supabase = getSupabase();
      const [{ count: totalCount }, { count: auditedCount }] = await Promise.all([
        supabase.from('routines').select('*', { count: 'exact', head: true }),
        supabase
          .from('routines')
          .select('*', { count: 'exact', head: true })
          .neq('status_auditoria', 'nao_auditada'),
      ]);
      sendJson(200, {
        status: 'ok',
        mode: 'vercel-serverless',
        backend: 'supabase',
        routinesIndexed: totalCount ?? 0,
        auditedIndexed: auditedCount ?? 0,
      });
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
      const tagRevisaoParam = [
        ...params.getAll('tagRevisao'),
        ...params.getAll('reviewTags'),
        ...params.getAll('tag'),
      ];
      const ingestaoParam = params
        .getAll('ingestao')
        .flatMap((v) => v.split(',').map((s) => s.trim()))
        .filter(Boolean) as ReviewIngestionState[];
      const estagioParam = params.get('estagio') as CurationStage | null;
      const temVideoParam = params.get('temVideo');
      const comDivergenciasParam = params.get('comDivergencias');
      const q = params.get('q')?.trim().toLowerCase();
      const page = Math.max(1, parseInt(params.get('page') || '1', 10));
      const pageSize = Math.max(1, parseInt(params.get('pageSize') || '25', 10));
      const sort = (params.get('sort') || 'id') as keyof MappedRoutineSummary;
      const order = params.get('order') || 'asc';

      const { summaries: allSummaries, rawRows, allReviewRows } = await fetchAllRoutinesSummary();
      let filtered = allSummaries;

      if (faseParam) {
        filtered =
          faseParam === 'sem_fase'
            ? filtered.filter((r) => r.fase === null)
            : filtered.filter((r) => r.fase === Number(faseParam));
      }
      if (moduloParam.length > 0) filtered = filtered.filter((r) => moduloParam.includes(r.modulo));
      if (secaoParam.length > 0) filtered = filtered.filter((r) => secaoParam.includes(r.secao));
      if (statusAuditoriaParam.length > 0) {
        filtered = filtered.filter((r) => statusAuditoriaParam.includes(r.statusAuditoria));
      }
      if (statusGovernancaParam.length > 0) {
        filtered = filtered.filter((r) => statusGovernancaParam.includes(r.statusGovernanca));
      }
      const wantedTags = normalizeTags(
        tagRevisaoParam.flatMap((raw) => String(raw).split(',').map((s) => s.trim())),
      );
      if (wantedTags.length > 0) {
        filtered = filtered.filter((r) => r.reviewTags.some((t) => wantedTags.includes(t)));
      }
      if (ingestaoParam.length > 0) {
        filtered = filtered.filter((r) => {
          if (ingestaoParam.includes('ingerida_pelo_agente') && r.revisoesConsumidasCount > 0) {
            return true;
          }
          return ingestaoParam.includes(r.reviewIngestionState);
        });
      }
      if (estagioParam) {
        filtered = filtered.filter((r) => r.curationStage === estagioParam);
      }
      if (temVideoParam !== null && temVideoParam !== '') {
        const tv = temVideoParam === 'true';
        filtered = filtered.filter((r) => r.temVideo === tv);
      }
      if (comDivergenciasParam !== null && comDivergenciasParam !== '') {
        const cd = comDivergenciasParam === 'true';
        filtered = filtered.filter((r) => (r.divergenciasCount > 0) === cd);
      }
      if (q) {
        if (q.startsWith('#/')) {
          filtered = filtered.filter((r) => r.rotasHash.some((h) => h.toLowerCase().includes(q)));
        } else {
          filtered = filtered.filter(
            (r) =>
              r.id.toLowerCase().includes(q) ||
              r.titulo.toLowerCase().includes(q) ||
              r.tags.some((t) => t.toLowerCase().includes(q)) ||
              r.rotasHash.some((h) => h.toLowerCase().includes(q)) ||
              reviewTagsPrefix(r.reviewTags).trim().toLowerCase().includes(q) ||
              r.reviewTags.some((t) => t.toLowerCase() === q) ||
              (r.ultimoLoteIngestaoId || '').toLowerCase().includes(q),
          );
        }
      }

      filtered.sort((a, b) => {
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
      const body = await readJsonBody(req);
      const supabase = getSupabase();
      const revisor = asStr(body.revisor).trim();

      if (!revisor) {
        sendJson(422, { error: { code: 'validation', message: 'Informe o nome do revisor.' } });
        return;
      }

      const { data: existingData, error: exErr } = await supabase
        .from('routines')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (exErr) throw exErr;
      if (!existingData) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }
      const existing = existingData as Row;

      if (isReviewAuditStatus(asStr(existing.status_auditoria)) && !body.confirmacaoManual) {
        const tagsStr = reviewTagsPrefix(extractRoutineReviewTags(existing)).trim() || '[ATT]';
        sendJson(409, {
          error: {
            code: 'manual_confirmation_required',
            message: `Confirme a validação manual antes de aprovar uma rotina ${tagsStr}.`,
          },
        });
        return;
      }

      if (hasForbiddenVideoId(body)) {
        sendJson(422, {
          error: { code: 'forbidden_field', message: 'Campo proibido: video_id. Use bunny_video_id.' },
        });
        return;
      }

      const now = new Date().toISOString();
      let editedCount = 0;

      if (Array.isArray(body.edicoes) && body.edicoes.length > 0) {
        for (const rawEd of body.edicoes) {
          const ed = asObj(rawEd);
          if (!ed) continue;
          const stepNumber = asNum(ed.stepNumber);
          const validatedText = asStr(ed.validatedText);
          const { data: stepRow } = await supabase
            .from('routine_steps')
            .select('original_text, validated_text')
            .eq('routine_id', id)
            .eq('step_number', stepNumber)
            .maybeSingle();
          const st = asObj(stepRow);
          if (st && asStr(st.validated_text) !== validatedText) {
            await supabase
              .from('routine_steps')
              .update({
                validated_text: validatedText,
                is_modified: validatedText !== asStr(st.original_text),
                updated_at: now,
              })
              .eq('routine_id', id)
              .eq('step_number', stepNumber);
            editedCount++;
          }
        }
      }

      const updateFields: Row = { status_governanca: 'aprovada', updated_at: now };
      const desc = asOptStr(body.descricao);
      if (desc && desc !== asStr(existing.descricao_revisada)) {
        updateFields.descricao_revisada = desc;
        editedCount++;
      }

      await supabase.from('routines').update(updateFields).eq('id', id);

      if (editedCount > 0) {
        await supabase.from('governance_events').insert({
          id: `ev-ed-${Date.now()}-${Math.random().toString(16).slice(2, 5)}`,
          routine_id: id,
          tipo: 'texto_editado',
          autor: revisor,
          em: now,
          descricao: `${editedCount} trecho(s) editado(s) antes da aprovação.`,
        });
      }

      const comentario = asOptStr(body.comentario);
      const evt: Row = {
        id: `ev-ap-${Date.now()}-${Math.random().toString(16).slice(2, 5)}`,
        routine_id: id,
        tipo: 'aprovada',
        autor: revisor,
        em: now,
        descricao: comentario ? `Rotina aprovada p/ Base KB. ${comentario}` : 'Rotina aprovada p/ Base KB.',
      };
      await supabase.from('governance_events').insert(evt);

      const updated = await fetchRoutineDetail(id);
      sendJson(200, { rotina: updated, evento: mapEventRow(evt) });
      return;
    }

    // 5. PUT|PATCH /api/rotinas/:id/texto
    const editTextMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/texto$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && editTextMatch) {
      const id = decodeURIComponent(editTextMatch[1]);
      const body = await readJsonBody(req);
      const supabase = getSupabase();

      const { data: existingData, error: exErr } = await supabase
        .from('routines')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (exErr) throw exErr;
      if (!existingData) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }
      const existing = existingData as Row;

      if (hasForbiddenVideoId(body)) {
        sendJson(422, {
          error: { code: 'forbidden_field', message: 'Campo proibido: video_id. Use bunny_video_id.' },
        });
        return;
      }

      const now = new Date().toISOString();
      const revisor = asStr(body.revisor).trim() || 'Revisor';
      let editedCount = 0;

      if (Array.isArray(body.edicoes) && body.edicoes.length > 0) {
        for (const rawEd of body.edicoes) {
          const ed = asObj(rawEd);
          if (!ed) continue;
          const stepNumber = asNum(ed.stepNumber);
          const validatedText = asStr(ed.validatedText);
          const { data: stepRow } = await supabase
            .from('routine_steps')
            .select('original_text, validated_text')
            .eq('routine_id', id)
            .eq('step_number', stepNumber)
            .maybeSingle();
          const st = asObj(stepRow);
          if (st && asStr(st.validated_text) !== validatedText) {
            await supabase
              .from('routine_steps')
              .update({
                validated_text: validatedText,
                is_modified: validatedText !== asStr(st.original_text),
                updated_at: now,
              })
              .eq('routine_id', id)
              .eq('step_number', stepNumber);
            editedCount++;
          }
        }
      }

      const updateFields: Row = { updated_at: now };
      const desc = asOptStr(body.descricao);
      if (desc && desc !== asStr(existing.descricao_revisada)) {
        updateFields.descricao_revisada = desc;
        editedCount++;
      }
      await supabase.from('routines').update(updateFields).eq('id', id);

      if (editedCount > 0) {
        await supabase.from('governance_events').insert({
          id: `ev-ed-${Date.now()}-${Math.random().toString(16).slice(2, 5)}`,
          routine_id: id,
          tipo: 'texto_editado',
          autor: revisor,
          em: now,
          descricao: `${editedCount} trecho(s) editado(s) no Orion Audit.`,
        });
      }

      const updated = await fetchRoutineDetail(id);
      sendJson(200, { rotina: updated });
      return;
    }

    // 6. POST /api/rotinas/:id/revisao
    const reviewMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/revisao$/);
    if (req.method === 'POST' && reviewMatch) {
      const id = decodeURIComponent(reviewMatch[1]);
      const body = await readJsonBody(req);
      const supabase = getSupabase();

      const revisor = asStr(body.revisor).trim();
      const motivo = asStr(body.motivo).trim();

      if (!revisor) {
        sendJson(422, { error: { code: 'validation', message: 'Informe o nome do revisor.' } });
        return;
      }
      if (motivo.length < 10) {
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
      const categoria = asStr(body.categoria, 'outro');
      const passos = asNumArr(body.passos);

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
        consumida_pelo_agente: false,
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

      await supabase
        .from('routines')
        .update({ status_governanca: 'revisao_solicitada', updated_at: now })
        .eq('id', id);

      const evt: Row = {
        id: `ev-rev-${Date.now()}-${Math.random().toString(16).slice(2, 5)}`,
        routine_id: id,
        tipo: 'revisao_solicitada',
        autor: revisor,
        em: now,
        descricao: `${motivo}${passos.length ? ` (passos ${passos.join(', ')})` : ''}`,
        meta: { categoria, reviewId, versao: 1 },
      };
      await supabase.from('governance_events').insert(evt);

      const updated = await fetchRoutineDetail(id);
      const createdReviews = await fetchReviewsList({ routineId: id });
      const revisao = createdReviews.find((r) => r.id === reviewId);
      sendJson(200, { rotina: updated, evento: mapEventRow(evt), revisao });
      return;
    }

    // 7. GET /api/revisoes
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

      const pendingItems = allItems.filter((i) => i.pendenteExportacao);
      const consumedItems = allItems.filter((i) => i.consumidaPeloAgente);

      sendJson(200, {
        data: filtered,
        meta: {
          total: filtered.length,
          abertas: allItems.filter((i) => i.status === 'aberta').length,
          emAndamento: allItems.filter((i) => i.status === 'em_andamento').length,
          resolvidas: allItems.filter((i) => i.status === 'resolvida').length,
          arquivadas: allItems.filter((i) => i.status === 'arquivada').length,
          pendentesExportacao: pendingItems.length,
          consumidas: consumedItems.length,
          rotinasPendentesExportacao: new Set(pendingItems.map((i) => i.routineId)).size,
          rotinasConsumidas: new Set(consumedItems.map((i) => i.routineId)).size,
        },
        lotes,
      });
      return;
    }

    // 8. GET /api/revisoes/lotes
    if (req.method === 'GET' && pathname === '/api/revisoes/lotes') {
      const lotes = await fetchRecentBatches(50);
      sendJson(200, { data: lotes });
      return;
    }

    // 9. GET /api/revisoes/lotes/:batchId/download
    const batchDlMatch = pathname.match(/^\/api\/revisoes\/lotes\/([^/]+)\/download$/);
    if (req.method === 'GET' && batchDlMatch) {
      const batchId = decodeURIComponent(batchDlMatch[1]);
      const formatParam = reqUrl.searchParams.get('formato');
      const supabase = getSupabase();
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
      const batch = mapBatchRow(batchRow as Row);
      const allReviews = await fetchReviewsList({});
      const selected = allReviews.filter(
        (r) => batch.reviewIds.includes(r.id) || r.loteExportacaoId === batchId,
      );
      const routines = await buildExportBundleRoutines(selected);
      const formato =
        formatParam === 'json' || formatParam === 'markdown' ? formatParam : batch.formato;
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
        mimeType:
          formato === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8',
        content,
        totalRevisoes: selected.length,
        totalRotinas: routines.length,
        routineIds: routines.map((r) => r.id),
        reviewIds: selected.map((r) => r.id),
      });
      return;
    }

    // 10. POST /api/revisoes/exportar
    if (req.method === 'POST' && pathname === '/api/revisoes/exportar') {
      const body = await readJsonBody(req);
      const escopoRaw = asStr(body.escopo, 'pendentes');
      const escopo: 'pendentes' | 'selecionadas' | 'todas_ativas' =
        escopoRaw === 'selecionadas' || escopoRaw === 'todas_ativas' ? escopoRaw : 'pendentes';
      const formato: 'markdown' | 'json' = body.formato === 'json' ? 'json' : 'markdown';
      const marcarComoIngeridas = body.marcarComoIngeridas !== false;
      const operador = asStr(body.operador).trim();
      const nota = asOptStr(body.nota)?.trim();

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
        selected = allReviews.filter((r) => r.pendenteExportacao);
      } else if (escopo === 'selecionadas') {
        const wanted = new Set(asStrArr(body.reviewIds));
        selected = allReviews.filter((r) => wanted.has(r.id));
      } else {
        selected = allReviews.filter((r) => r.status === 'aberta' || r.status === 'em_andamento');
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
      const reviewIds = selected.map((r) => r.id);
      const routineIds = routines.map((r) => r.id);

      let batch: ReturnType<typeof mapBatchRow> | null = null;

      if (marcarComoIngeridas) {
        const supabase = getSupabase();
        const batchInsert: Row = {
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
          selected.map((rev) =>
            supabase
              .from('routine_reviews')
              .update({
                consumida_pelo_agente: true,
                consumida_em: now,
                consumida_por: operador,
                lote_exportacao_id: batchId,
                versao_consumida: rev.versao,
              })
              .eq('id', rev.id),
          ),
        );

        const events = routineIds.map((rid, idx) => {
          const countInRoutine = selected.filter((r) => r.routineId === rid).length;
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
        mimeType:
          formato === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8',
        content,
        totalRevisoes: reviewIds.length,
        totalRotinas: routineIds.length,
        routineIds,
        reviewIds,
      });
      return;
    }

    // 11. GET /api/rotinas/:id/revisoes
    const routineReviewsMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/revisoes$/);
    if (req.method === 'GET' && routineReviewsMatch) {
      const id = decodeURIComponent(routineReviewsMatch[1]);
      const items = await fetchReviewsList({ routineId: id });
      sendJson(200, { data: items });
      return;
    }

    // 12. PUT|PATCH /api/revisoes/:reviewId
    const updateReviewMatch = pathname.match(/^\/api\/revisoes\/([^/]+)$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && updateReviewMatch) {
      const reviewId = decodeURIComponent(updateReviewMatch[1]);
      const body = await readJsonBody(req);
      const supabase = getSupabase();

      const { data: existingData, error: exErr } = await supabase
        .from('routine_reviews')
        .select('*')
        .eq('id', reviewId)
        .maybeSingle();
      if (exErr) throw exErr;
      if (!existingData) {
        sendJson(404, { error: { code: 'not_found', message: `Revisão ${reviewId} não encontrada.` } });
        return;
      }
      const existing = existingData as Row;

      const alteradoPor = asStr(
        body.alteradoPor || body.revisor || existing.atualizado_por || existing.revisor,
      ).trim();
      if (!alteradoPor) {
        sendJson(422, {
          error: { code: 'validation', message: 'Informe quem está realizando a atualização.' },
        });
        return;
      }

      const motivo =
        body.motivo !== undefined ? asStr(body.motivo).trim() : asStr(existing.motivo).trim();
      if (motivo.length < 10) {
        sendJson(422, {
          error: { code: 'validation', message: 'O motivo precisa de pelo menos 10 caracteres.' },
        });
        return;
      }

      const categoria = asStr(body.categoria, asStr(existing.categoria, 'outro'));
      const passos = Array.isArray(body.passos) ? asNumArr(body.passos) : asNumArr(existing.passos);
      const resolucao =
        body.resolucao !== undefined
          ? asStr(body.resolucao).trim() || null
          : existing.resolucao ?? null;
      const status = asStr(body.status, asStr(existing.status, 'aberta'));
      const revisor = asStr(body.revisor).trim() || asStr(existing.revisor);
      const nextVersion = asNum(existing.versao, 1) + 1;
      const now = new Date().toISOString();
      const notaAtualizacao = asOptStr(body.notaAtualizacao)?.trim();

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
        nota_atualizacao: notaAtualizacao || `Atualizada para v${nextVersion}`,
        criado_em: now,
      });
      if (verErr) throw verErr;

      await supabase.from('governance_events').insert({
        id: `ev-rev-upd-${Date.now()}-${Math.random().toString(16).slice(2, 5)}`,
        routine_id: asStr(existing.routine_id),
        tipo: 'texto_editado',
        autor: alteradoPor,
        em: now,
        descricao: `Revisão ${reviewId} atualizada para v${nextVersion} (status: ${status}).${notaAtualizacao ? ` Nota: ${notaAtualizacao}` : ''}`,
        meta: { reviewId, versao: nextVersion, status },
      });

      const items = await fetchReviewsList({ routineId: asStr(existing.routine_id) });
      const revisao = items.find((i) => i.id === reviewId);
      sendJson(200, { revisao });
      return;
    }

    sendJson(404, { error: { code: 'not_found', message: `Endpoint ${pathname} não encontrado.` } });
  } catch (err: unknown) {
    console.error('Orion Audit API Error:', err);
    const message = err instanceof Error ? err.message : 'Erro interno.';
    sendJson(500, { error: { code: 'server_error', message } });
  }
}
