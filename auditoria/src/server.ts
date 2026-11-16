import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getSupabaseAdmin, isSupabaseConfigured, SUPABASE_URL } from './supabase.js';
import { REVIEW_TAGS, isReviewStatus, normalizeReviewTags, reviewTagsFor } from './review-taxonomy.js';
import { auditExternalSteps } from './invariants.js';
import { persistRoutineGovernanceToDisk, type GovernanceDiskUpdate } from './governance-disk.js';
import { syncSingleRoutineToSupabase } from './sync-supabase.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import { findRoutineFileById } from './phases.js';
import { writePreTriagedDddReport } from './hardware-pretriage.js';
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

interface RoutineSummary {
  id: string;
  titulo: string;
  modulo: Modulo;
  secao: Secao;
  fase: PhaseNumber | null;
  temVideo: boolean;
  workloadType: WorkloadType;
  statusAuditoria: RoutineAuditState;
  /** Todas as tags da rotina em ordem canônica (ADR-024), ex.: `['ATT', 'CCC']`; vazio fora da revisão humana */
  tagsRevisao: string[];
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

function mapRoutineSummary(row: any, latestJob?: any): RoutineSummary {
  return {
    id: row.id,
    titulo: row.titulo,
    modulo: row.modulo as Modulo,
    secao: row.secao as Secao,
    fase: row.fase !== null && row.fase !== undefined ? (Number(row.fase) as PhaseNumber) : null,
    temVideo: Boolean(row.tem_video),
    workloadType: row.workload_type as WorkloadType,
    statusAuditoria: row.status_auditoria as RoutineAuditState,
    tagsRevisao: normalizeReviewTags(Array.isArray(row.tags_revisao) && row.tags_revisao.length > 0 ? row.tags_revisao : reviewTagsFor(row.status_auditoria)),
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

async function fetchReviewsList(filters: {
  routineId?: string;
  status?: string;
  categoria?: string;
  modulo?: string;
  q?: string;
} = {}) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('routine_reviews')
    .select('*, routines!inner(id, titulo, modulo, fase, status_auditoria, total_passos)')
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

  let items = (reviewRows || []).map((r: any) => ({
    id: r.id,
    routineId: r.routine_id,
    rotinaTitulo: r.routines?.titulo ?? r.routine_id,
    rotinaModulo: r.routines?.modulo ?? 'geral',
    rotinaFase: r.routines?.fase ?? null,
    rotinaStatusAuditoria: r.routines?.status_auditoria ?? 'nao_auditada',
    rotinaTotalPassos: r.routines?.total_passos ?? 0,
    revisor: r.revisor,
    categoria: r.categoria,
    passos: r.passos || [],
    motivo: r.motivo,
    resolucao: r.resolucao ?? undefined,
    status: r.status,
    versao: r.versao,
    criadoEm: r.criado_em,
    atualizadoEm: r.atualizado_em,
    atualizadoPor: r.atualizado_por ?? r.revisor,
    versoes: versionsByReview.get(r.id) || [],
  }));

  if (filters.modulo) {
    items = items.filter((i: any) => i.rotinaModulo === filters.modulo);
  }
  if (filters.q?.trim()) {
    const t = filters.q.trim().toLowerCase();
    items = items.filter(
      (i: any) =>
        i.routineId.toLowerCase().includes(t) ||
        i.rotinaTitulo.toLowerCase().includes(t) ||
        i.motivo.toLowerCase().includes(t) ||
        i.revisor.toLowerCase().includes(t) ||
        (i.resolucao || '').toLowerCase().includes(t)
    );
  }

  return items;
}

async function fetchAllRoutinesSummary(): Promise<{ summaries: RoutineSummary[]; rawRows: any[] }> {
  const supabase = getSupabaseAdmin();
  const [{ data: rData, error: rErr }, { data: jData, error: jErr }] = await Promise.all([
    supabase.from('routines').select(
      'id, titulo, modulo, secao, fase, tem_video, workload_type, status_auditoria, tags_revisao, status_governanca, pasta_auditoria, total_passos, prints_geradas, divergencias_count, menor_confianca, rotas_hash, tags, data_execucao, worker_id, duration_seconds, thumbnail_url, auditoria_ui, updated_at'
    ),
    supabase.from('runner_jobs').select('*').order('enfileirado_em', { ascending: false }),
  ]);

  if (rErr) throw rErr;
  if (jErr) throw jErr;

  const latestJobByRoutine = new Map<string, any>();
  for (const job of jData || []) {
    if (!latestJobByRoutine.has(job.routine_id)) {
      latestJobByRoutine.set(job.routine_id, job);
    }
  }

  const summaries = (rData || []).map(row => mapRoutineSummary(row, latestJobByRoutine.get(row.id)));
  return { summaries, rawRows: rData || [] };
}

async function buildDashboardStats(allSummaries: RoutineSummary[], rawRows: any[]) {
  const supabase = getSupabaseAdmin();
  const totalRotinas = allSummaries.length;
  const auditadas = allSummaries.filter(r => r.statusAuditoria !== 'nao_auditada').length;
  const naoAuditadas = totalRotinas - auditadas;
  const aprovadas = allSummaries.filter(r => r.statusGovernanca === 'aprovada').length;
  const taxaAprovacao = auditadas > 0 ? aprovadas / auditadas : 0;
  const autoCuradas = allSummaries.filter(r => r.statusAuditoria === 'validado_com_ajustes').length;
  const countStatus = (list: typeof allSummaries, status: RoutineAuditState) => list.filter(r => r.statusAuditoria === status).length;
  const bloqueadas = allSummaries.filter(r => isReview(r.statusAuditoria)).length;

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

  const ativosRunner = allSummaries.filter(r => r.runner.estado === 'na_fila' || r.runner.estado === 'em_execucao');
  const filaRunner = {
    read_only: ativosRunner.filter(r => r.runner.lane === 'read_only').length,
    mutation: ativosRunner.filter(r => r.runner.lane === 'mutation').length,
    emExecucao: ativosRunner.filter(r => r.runner.estado === 'em_execucao').length,
  };

  const { data: recentEvents } = await supabase
    .from('governance_events')
    .select('*')
    .order('em', { ascending: false })
    .limit(10);

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
    porFase,
    porCarga,
    porModulo,
    porCamadaDivergencia,
    filaRunner,
    atividadeRecente,
  };
}

async function fetchRoutineDetail(id: string) {
  const supabase = getSupabaseAdmin();
  const [
    { data: rRow, error: rErr },
    { data: sRows, error: sErr },
    { data: eRows, error: eErr },
    { data: jRows, error: jErr },
  ] = await Promise.all([
    supabase.from('routines').select('*').eq('id', id).maybeSingle(),
    supabase.from('routine_steps').select('*').eq('routine_id', id).order('step_number', { ascending: true }),
    supabase.from('governance_events').select('*').eq('routine_id', id).order('em', { ascending: false }),
    supabase.from('runner_jobs').select('*').eq('routine_id', id).order('enfileirado_em', { ascending: false }).limit(1),
  ]);

  if (rErr) throw rErr;
  if (sErr) throw sErr;
  if (eErr) throw eErr;
  if (jErr) throw jErr;
  if (!rRow) return null;

  const summary = mapRoutineSummary(rRow, jRows?.[0]);
  const steps = (sRows || []).map(s => ({
    stepNumber: s.step_number,
    actionType: s.action_type,
    zonePolicy: s.zone_policy ?? undefined,
    targets: s.targets || [],
    originalText: s.original_text,
    validatedText: s.validated_text,
    isModified: Boolean(s.is_modified),
    status: s.status,
    // ADR-024: passo de portal externo não tem print por desenho (não é erro de paridade)
    stepScope: s.step_scope ?? 'orion_tn',
    portalExterno: s.portal_externo ?? undefined,
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
  }));

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
    passosExternos: auditExternalSteps(rRow.markdown_revisado || ''),
    steps,
    frontmatterOriginalYaml: rRow.frontmatter_original_yaml || '',
    frontmatterRevisadoYaml: rRow.frontmatter_revisado_yaml || '',
    markdownRevisado: rRow.markdown_revisado || rRow.markdown_original || '',
    bloqueio: rRow.bloqueio ?? undefined,
    historico: (eRows || []).map(mapEventRow),
    revisoes: await fetchReviewsList({ routineId: id }),
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

let mutationRunnerChain: Promise<void> = Promise.resolve();

function runCliRoutine(routineId: string, modo: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise(resolve => {
    const tsxCli = path.join(auditoriaRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    const cliArgs = [tsxCli, 'src/cli.ts', '--routine', routineId];
    if (modo === 'headed') cliArgs.push('--headed');
    if (process.env.ORION_DRY_RUN_MUTATIONS !== 'false') cliArgs.push('--dry-run-mutations');

    const child = spawn(process.execPath, cliArgs, {
      cwd: auditoriaRoot,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderrTail = '';
    child.stderr?.on('data', chunk => {
      stderrTail = (stderrTail + String(chunk)).slice(-800);
    });
    child.on('error', err => resolve({ ok: false, error: err.message }));
    child.on('close', code => {
      if (code === 0) resolve({ ok: true });
      else resolve({ ok: false, error: stderrTail.trim() || `Runner encerrou com código ${code}` });
    });
  });
}

function enqueueRunnerExecution(
  routineId: string,
  jobId: string,
  opts: { lane?: string; modo?: string } = {}
) {
  const executeJob = async () => {
    const supabase = getSupabaseAdmin();
    try {
      await supabase
        .from('runner_jobs')
        .update({ estado: 'em_execucao', posicao_fila: null, iniciado_em: new Date().toISOString() })
        .eq('job_id', jobId);

      const hwEntry = PHASE3_MANIFEST.find(e => e.id === routineId && e.hardwarePreTriage.isHardwareDependent);
      let ok = false;
      let errMessage = '';

      if (hwEntry) {
        const kbFile = findRoutineFileById(routineId);
        if (!kbFile) {
          errMessage = `Arquivo KB não encontrado para ${routineId}`;
        } else {
          await writePreTriagedDddReport(hwEntry, kbFile, { syncToSupabase: true });
          ok = true;
        }
      } else {
        const res = await runCliRoutine(routineId, opts.modo || 'headless');
        ok = res.ok;
        errMessage = res.error || '';
        if (ok) {
          await syncSingleRoutineToSupabase(routineId, {
            onlyWebp: true,
            preserveExistingGovernance: false,
            quiet: true,
          });
        }
      }

      const fim = new Date().toISOString();
      if (ok) {
        await supabase
          .from('runner_jobs')
          .update({ estado: 'concluida', finalizado_em: fim })
          .eq('job_id', jobId);
        await supabase.from('governance_events').insert({
          id: `ev-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          routine_id: routineId,
          tipo: 'reexecucao_concluida',
          autor: 'runner',
          em: fim,
          descricao: 'Reexecução concluída e sincronizada com o Supabase em tempo real.',
        });
      } else {
        await supabase
          .from('runner_jobs')
          .update({ estado: 'falhou', finalizado_em: fim, erro: errMessage.slice(0, 500) })
          .eq('job_id', jobId);
        await supabase.from('governance_events').insert({
          id: `ev-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          routine_id: routineId,
          tipo: 'reexecucao_falhou',
          autor: 'runner',
          em: fim,
          descricao: `Falha na reexecução: ${errMessage.slice(0, 300)}`,
        });
      }
    } catch (err: any) {
      const fim = new Date().toISOString();
      const msg = String(err?.message || err);
      await supabase
        .from('runner_jobs')
        .update({ estado: 'falhou', finalizado_em: fim, erro: msg.slice(0, 500) })
        .eq('job_id', jobId);
      await supabase.from('governance_events').insert({
        id: `ev-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        routine_id: routineId,
        tipo: 'reexecucao_falhou',
        autor: 'runner',
        em: fim,
        descricao: `Falha inesperada na reexecução: ${msg.slice(0, 300)}`,
      });
    }
  };

  if (opts.lane === 'mutation') {
    mutationRunnerChain = mutationRunnerChain.then(executeJob, executeJob);
  } else {
    void executeJob();
  }
}

// --- INICIALIZAÇÃO ---

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
      const tagRevisaoParam = params.getAll('tagRevisao').map(t => t.toUpperCase());
      const cargaParam = params.get('carga');
      const temVideoParam = params.get('temVideo');
      const comDivergenciasParam = params.get('comDivergencias');
      const q = params.get('q')?.trim().toLowerCase();
      const page = Math.max(1, parseInt(params.get('page') || '1', 10));
      const pageSize = Math.max(1, parseInt(params.get('pageSize') || '25', 10));
      const sort = params.get('sort') || 'id';
      const order = params.get('order') || 'asc';

      const { summaries: allSummaries, rawRows } = await fetchAllRoutinesSummary();
      let filtered = allSummaries;

      if (faseParam) {
        filtered =
          faseParam === 'sem_fase'
            ? filtered.filter(r => r.fase === null)
            : filtered.filter(r => r.fase === Number(faseParam));
      }
      if (moduloParam.length > 0) filtered = filtered.filter(r => moduloParam.includes(r.modulo));
      if (secaoParam.length > 0) filtered = filtered.filter(r => secaoParam.includes(r.secao));
      if (statusAuditoriaParam.length > 0) filtered = filtered.filter(r => statusAuditoriaParam.includes(r.statusAuditoria));
      if (statusGovernancaParam.length > 0) filtered = filtered.filter(r => statusGovernancaParam.includes(r.statusGovernanca));
      if (tagRevisaoParam.length > 0) filtered = filtered.filter(r => r.tagsRevisao.some(t => tagRevisaoParam.includes(t)));
      if (cargaParam) filtered = filtered.filter(r => r.workloadType === cargaParam);
      if (temVideoParam !== null && temVideoParam !== '') {
        const tv = temVideoParam === 'true';
        filtered = filtered.filter(r => r.temVideo === tv);
      }
      if (comDivergenciasParam !== null && comDivergenciasParam !== '') {
        const cd = comDivergenciasParam === 'true';
        filtered = filtered.filter(r => (r.divergenciasCount > 0) === cd);
      }
      if (q) {
        if (q.startsWith('#/')) {
          filtered = filtered.filter(r => r.rotasHash.some(h => h.toLowerCase().includes(q)));
        } else {
          filtered = filtered.filter(
            r =>
              r.id.toLowerCase().includes(q) ||
              r.titulo.toLowerCase().includes(q) ||
              r.tags.some(t => t.toLowerCase().includes(q)) ||
              r.rotasHash.some(h => h.toLowerCase().includes(q))
          );
        }
      }

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
      const stats = await buildDashboardStats(allSummaries, rawRows);

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
        sendJson(409, {
          error: {
            code: 'manual_confirmation_required',
            message: `Confirme a validação manual antes de aprovar uma rotina [${REVIEW_TAGS[existing.status_auditoria as ReviewStatus].tag}].`,
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

    // 5b. GET /api/revisoes (Biblioteca global de revisões)
    if (req.method === 'GET' && pathname === '/api/revisoes') {
      const params = reqUrl.searchParams;
      const allItems = await fetchReviewsList({});
      const filtered = await fetchReviewsList({
        routineId: params.get('routineId') || undefined,
        status: params.get('status') || undefined,
        categoria: params.get('categoria') || undefined,
        modulo: params.get('modulo') || undefined,
        q: params.get('q') || undefined,
      });
      sendJson(200, {
        data: filtered,
        meta: {
          total: filtered.length,
          abertas: allItems.filter((i: any) => i.status === 'aberta').length,
          emAndamento: allItems.filter((i: any) => i.status === 'em_andamento').length,
          resolvidas: allItems.filter((i: any) => i.status === 'resolvida').length,
          arquivadas: allItems.filter((i: any) => i.status === 'arquivada').length,
        },
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

    // 6. POST /api/rotinas/:id/reexecutar
    const reexecuteMatch = pathname.match(/^\/api\/rotinas\/([^/]+)\/reexecutar$/);
    if (req.method === 'POST' && reexecuteMatch) {
      const id = decodeURIComponent(reexecuteMatch[1]);
      const body = await readBody();
      const supabase = getSupabaseAdmin();

      const { data: existing } = await supabase.from('routines').select('id, workload_type').eq('id', id).maybeSingle();
      if (!existing) {
        sendJson(404, { error: { code: 'not_found', message: `Rotina ${id} não encontrada.` } });
        return;
      }

      const { data: activeJobs } = await supabase
        .from('runner_jobs')
        .select('job_id, estado')
        .eq('routine_id', id)
        .in('estado', ['na_fila', 'em_execucao']);

      if (activeJobs && activeJobs.length > 0) {
        sendJson(409, { error: { code: 'already_queued', message: 'Rotina já está na fila de execução.' } });
        return;
      }

      const lane = body.lane || existing.workload_type || 'read_only';
      const jobId = `job-${Date.now().toString(16)}`;
      const posicaoFila = body.prioridade === 'alta' ? 1 : 2;
      const enfileiradoEm = new Date().toISOString();

      await supabase.from('runner_jobs').insert({
        job_id: jobId,
        routine_id: id,
        estado: 'na_fila',
        lane,
        modo: body.modo || 'headless',
        prioridade: body.prioridade || 'normal',
        solicitante: body.solicitante || 'Operador',
        motivo: body.motivo || null,
        passos: body.passos || null,
        posicao_fila: posicaoFila,
        enfileirado_em: enfileiradoEm,
      });

      await supabase.from('governance_events').insert({
        id: `ev-q-${Date.now()}`,
        routine_id: id,
        tipo: 'reexecucao_enfileirada',
        autor: body.solicitante || 'Operador',
        em: enfileiradoEm,
        descricao: `Reexecução enfileirada na lane ${lane} (${body.modo || 'headless'}, prioridade ${body.prioridade || 'normal'}).${body.motivo ? ' Motivo: ' + body.motivo : ''}`,
      });

      enqueueRunnerExecution(id, jobId, { lane, modo: body.modo || 'headless' });

      sendJson(202, { jobId, lane, posicaoFila, estimativaSegundos: 15, enfileiradoEm });
      return;
    }

    // 7. POST /api/rotinas/reexecutar-lote
    if (req.method === 'POST' && pathname === '/api/rotinas/reexecutar-lote') {
      const body = await readBody();
      const ids: string[] = body.ids || [];
      const supabase = getSupabaseAdmin();
      const jobs: any[] = [];
      const rejeitadas: any[] = [];

      for (const id of ids) {
        const { data: active } = await supabase
          .from('runner_jobs')
          .select('job_id')
          .eq('routine_id', id)
          .in('estado', ['na_fila', 'em_execucao']);

        if (active && active.length > 0) {
          rejeitadas.push({ id, motivo: 'Rotina já está na fila.' });
          continue;
        }

        const { data: rRow } = await supabase.from('routines').select('workload_type').eq('id', id).maybeSingle();
        const lane = rRow?.workload_type || 'read_only';
        const jobId = `job-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 6)}`;
        const enfileiradoEm = new Date().toISOString();
        const posicaoFila = jobs.length + 1;

        await supabase.from('runner_jobs').insert({
          job_id: jobId,
          routine_id: id,
          estado: 'na_fila',
          lane,
          modo: body.modo || 'headless',
          prioridade: body.prioridade || 'normal',
          solicitante: 'lote',
          posicao_fila: posicaoFila,
          enfileirado_em: enfileiradoEm,
        });

        enqueueRunnerExecution(id, jobId, { lane, modo: body.modo || 'headless' });
        jobs.push({ id, jobId, lane, posicaoFila, estimativaSegundos: 15 + jobs.length * 10, enfileiradoEm });
      }

      sendJson(200, { jobs, rejeitadas });
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

server.listen(PORT, HOST, () => {
  console.log(`🚀 API Servidor (Supabase) ativo em http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
