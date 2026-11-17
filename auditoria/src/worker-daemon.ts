import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { SupabaseClient } from '@supabase/supabase-js';
import { AsyncSemaphore } from './agy-client.js';
import { refreshHumanReviewsCache } from './human-review-rag.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import { findRoutineFileById } from './phases.js';
import { writePreTriagedDddReport } from './hardware-pretriage.js';
import { getSupabaseAdmin, isSupabaseConfigured, SUPABASE_URL } from './supabase.js';
import { syncSingleRoutineToSupabase, type SyncSingleRoutineResult } from './sync-supabase.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');

export type DaemonTriggerSource = 'routine_reviews' | 'runner_jobs' | 'audit_jobs' | 'routines' | 'manual';

export interface DaemonJobRequest {
  routineId: string;
  source: DaemonTriggerSource;
  jobId?: string;
  modo?: 'headless' | 'headed';
  requestedAt: string;
}

export interface DaemonJobExecutionResult {
  routineId: string;
  source: DaemonTriggerSource;
  jobId?: string;
  ok: boolean;
  commandArgs: string[];
  error?: string;
  startedAt: string;
  finishedAt: string;
}

export interface WorkerDaemonOptions {
  debounceMs?: number;
  supabaseClient?: SupabaseClient;
  refreshCacheFn?: () => Promise<unknown>;
  runRoutineCliFn?: (
    routineId: string,
    commandArgs: string[]
  ) => Promise<{ ok: boolean; error?: string }>;
  syncRoutineFn?: (routineId: string) => Promise<SyncSingleRoutineResult | void>;
  quiet?: boolean;
}

export function buildSafeDaemonCliArgs(
  routineId: string,
  modo: 'headless' | 'headed' = 'headless'
): string[] {
  return [
    'src/cli.ts',
    '--routines',
    routineId,
    modo === 'headed' ? '--headed' : '--headless',
    '--dry-run-mutations'
  ];
}

function defaultRunRoutineCli(
  _routineId: string,
  commandArgs: string[]
): Promise<{ ok: boolean; error?: string }> {
  return new Promise(resolve => {
    const tsxCli = path.join(auditoriaRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    const child = spawn(process.execPath, [tsxCli, ...commandArgs], {
      cwd: auditoriaRoot,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stderrTail = '';
    child.stderr?.on('data', chunk => {
      stderrTail = (stderrTail + String(chunk)).slice(-1000);
    });
    child.on('error', err => resolve({ ok: false, error: err.message }));
    child.on('close', code => {
      if (code === 0) resolve({ ok: true });
      else resolve({ ok: false, error: stderrTail.trim() || `Runner encerrou com código ${code}` });
    });
  });
}

/**
 * Worker Daemon Realtime para o Orion Audit Console (ADR-032).
 *
 * - Assina eventos `postgres_changes` via `@supabase/supabase-js` em `routine_reviews`,
 *   `runner_jobs` / `audit_jobs` e `routines`.
 * - Aplica debounce por `routineId` e trava de concorrência estrita (`AsyncSemaphore(1)` — 1 job por vez)
 *   para evitar disputa de sessão do navegador.
 * - Atualiza `human-reviews-cache.json` (Camada 0.1 RAG), executa `--routines <id> --headless --dry-run-mutations`
 *   e sincroniza o resultado via `syncSingleRoutineToSupabase`.
 */
export class OrionRealtimeWorkerDaemon {
  private readonly debounceMs: number;
  private readonly supabaseClient?: SupabaseClient;
  private readonly refreshCacheFn: () => Promise<unknown>;
  private readonly runRoutineCliFn: (
    routineId: string,
    commandArgs: string[]
  ) => Promise<{ ok: boolean; error?: string }>;
  private readonly syncRoutineFn: (routineId: string) => Promise<SyncSingleRoutineResult | void>;
  private readonly quiet: boolean;

  /** Trava de concorrência estrita: 1 job por vez para não disputar sessão WildFly/agent-browser */
  private readonly concurrencyLock = new AsyncSemaphore(1);
  private readonly debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly pendingRequests = new Map<string, DaemonJobRequest>();
  private readonly activeRoutines = new Set<string>();
  private readonly completedHistory: DaemonJobExecutionResult[] = [];
  private activeCount = 0;
  private maxObservedConcurrency = 0;
  private channel: any = null;

  constructor(options: WorkerDaemonOptions = {}) {
    this.debounceMs = options.debounceMs ?? 1200;
    this.supabaseClient = options.supabaseClient;
    this.refreshCacheFn = options.refreshCacheFn ?? (() => refreshHumanReviewsCache());
    this.runRoutineCliFn = options.runRoutineCliFn ?? defaultRunRoutineCli;
    this.syncRoutineFn =
      options.syncRoutineFn ??
      (routineId =>
        syncSingleRoutineToSupabase(routineId, {
          onlyWebp: true,
          preserveExistingGovernance: true,
          quiet: true
        }));
    this.quiet = Boolean(options.quiet);
  }

  public getStats() {
    return {
      activeCount: this.activeCount,
      maxObservedConcurrency: this.maxObservedConcurrency,
      pendingDebouncedCount: this.debounceTimers.size,
      completedCount: this.completedHistory.length,
      completedHistory: [...this.completedHistory]
    };
  }

  private log(msg: string): void {
    if (!this.quiet) {
      console.log(msg);
    }
  }

  /**
   * Agenda com debounce a reexecução segura de uma rotina.
   * Múltiplos eventos para a mesma rotina dentro da janela de `debounceMs` são coalescidos em 1 único job.
   */
  public scheduleReaudit(request: Omit<DaemonJobRequest, 'requestedAt'>): Promise<DaemonJobExecutionResult> {
    const routineId = String(request.routineId || '').trim();
    if (!routineId) {
      return Promise.reject(new Error('routineId vazio em scheduleReaudit'));
    }

    const fullReq: DaemonJobRequest = {
      ...request,
      routineId,
      requestedAt: new Date().toISOString()
    };

    const existingTimer = this.debounceTimers.get(routineId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Preserva jobId caso um dos eventos coalescidos venha de runner_jobs / audit_jobs
    const prevReq = this.pendingRequests.get(routineId);
    if (prevReq?.jobId && !fullReq.jobId) {
      fullReq.jobId = prevReq.jobId;
    }
    this.pendingRequests.set(routineId, fullReq);

    return new Promise<DaemonJobExecutionResult>(resolve => {
      const timer = setTimeout(async () => {
        this.debounceTimers.delete(routineId);
        const reqToRun = this.pendingRequests.get(routineId) || fullReq;
        this.pendingRequests.delete(routineId);
        const res = await this.executeSerializedJob(reqToRun);
        resolve(res);
      }, this.debounceMs);

      this.debounceTimers.set(routineId, timer);
    });
  }

  private async executeSerializedJob(req: DaemonJobRequest): Promise<DaemonJobExecutionResult> {
    return this.concurrencyLock.runExclusive(async () => {
      this.activeCount++;
      if (this.activeCount > this.maxObservedConcurrency) {
        this.maxObservedConcurrency = this.activeCount;
      }
      this.activeRoutines.add(req.routineId);
      const startedAt = new Date().toISOString();
      const commandArgs = buildSafeDaemonCliArgs(req.routineId, req.modo || 'headless');

      this.log(
        `▶ [Worker Daemon] Iniciando reauditoria segura de ${req.routineId} (origem: ${req.source}${req.jobId ? `, job: ${req.jobId}` : ''})...`
      );

      const supabase = this.supabaseClient ?? (isSupabaseConfigured() ? getSupabaseAdmin() : null);

      try {
        if (supabase && req.jobId) {
          await supabase
            .from('runner_jobs')
            .update({ estado: 'em_execucao', posicao_fila: null, iniciado_em: startedAt })
            .eq('job_id', req.jobId);
        }

        // 1. Atualiza o cache soberano da Camada 0.1 (human-reviews-cache.json) antes de abrir a rotina
        await this.refreshCacheFn().catch(() => undefined);

        // 2. Verifica se é rotina de hardware pré-triada da Fase 3 ou rotina navegável
        const hwEntry = PHASE3_MANIFEST.find(
          e => e.id === req.routineId && e.hardwarePreTriage.isHardwareDependent
        );
        let ok = false;
        let errMessage: string | undefined;

        if (hwEntry) {
          const kbFile = findRoutineFileById(req.routineId);
          if (!kbFile) {
            errMessage = `Arquivo KB não encontrado para ${req.routineId}`;
          } else {
            await writePreTriagedDddReport(hwEntry, kbFile, { syncToSupabase: true });
            ok = true;
          }
        } else {
          const cliRes = await this.runRoutineCliFn(req.routineId, commandArgs);
          ok = cliRes.ok;
          errMessage = cliRes.error;
        }

        // 3. Sincroniza resultado de volta com o Supabase (Write-Through)
        if (ok) {
          await this.syncRoutineFn(req.routineId);
        }

        const finishedAt = new Date().toISOString();
        if (supabase && req.jobId) {
          await supabase
            .from('runner_jobs')
            .update({
              estado: ok ? 'concluida' : 'falhou',
              finalizado_em: finishedAt,
              erro: ok ? null : (errMessage || 'Erro na execução').slice(0, 500)
            })
            .eq('job_id', req.jobId);
        }

        if (supabase) {
          await supabase
            .from('governance_events')
            .insert({
              id: `ev-daemon-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
              routine_id: req.routineId,
              tipo: ok ? 'reexecucao_concluida' : 'reexecucao_falhou',
              autor: 'worker-daemon',
              em: finishedAt,
              descricao: ok
                ? `Reauditoria automática concluída via Worker Daemon (gatilho: ${req.source}).`
                : `Falha na reauditoria via Worker Daemon: ${(errMessage || '').slice(0, 280)}`
            })
            .then(
              () => undefined,
              () => undefined
            );
        }

        const result: DaemonJobExecutionResult = {
          routineId: req.routineId,
          source: req.source,
          jobId: req.jobId,
          ok,
          commandArgs,
          error: errMessage,
          startedAt,
          finishedAt
        };
        this.completedHistory.push(result);
        this.log(
          ok
            ? `✓ [Worker Daemon] ${req.routineId} concluída e sincronizada com sucesso.`
            : `✕ [Worker Daemon] ${req.routineId} falhou: ${errMessage}`
        );
        return result;
      } finally {
        this.activeRoutines.delete(req.routineId);
        this.activeCount--;
      }
    });
  }

  /**
   * Processa payload de evento `postgres_changes` de `routine_reviews`.
   */
  public handleRoutineReviewChange(payload: {
    eventType?: string;
    new?: Record<string, any>;
  }): Promise<DaemonJobExecutionResult> | null {
    const row = payload?.new;
    if (!row || !row.routine_id) return null;
    const status = String(row.status || 'aberta');
    if (status !== 'aberta' && status !== 'em_andamento') {
      // Ainda atualiza o cache local mesmo se foi resolvida/arquivada
      void this.refreshCacheFn().catch(() => undefined);
      return null;
    }
    return this.scheduleReaudit({
      routineId: String(row.routine_id),
      source: 'routine_reviews',
      modo: 'headless'
    });
  }

  /**
   * Processa payload de evento `postgres_changes` de `runner_jobs` ou `audit_jobs`.
   */
  public handleJobChange(
    payload: {
      eventType?: string;
      new?: Record<string, any>;
    },
    source: 'runner_jobs' | 'audit_jobs' = 'runner_jobs'
  ): Promise<DaemonJobExecutionResult> | null {
    const row = payload?.new;
    if (!row || !row.routine_id) return null;
    const estado = String(row.estado || row.status || '');
    if (estado !== 'na_fila' && estado !== 'queued' && estado !== 'pending') {
      return null;
    }
    return this.scheduleReaudit({
      routineId: String(row.routine_id),
      source,
      jobId: row.job_id ? String(row.job_id) : row.id ? String(row.id) : undefined,
      modo: row.modo === 'headed' ? 'headed' : 'headless'
    });
  }

  /**
   * Processa payload de evento `postgres_changes` de `routines` quando uma reexecução ou revisão é solicitada.
   */
  public handleRoutineRowChange(payload: {
    eventType?: string;
    old?: Record<string, any>;
    new?: Record<string, any>;
  }): Promise<DaemonJobExecutionResult> | null {
    const row = payload?.new;
    const oldRow = payload?.old;
    if (!row || !row.id) return null;

    const requestedReaudit =
      row.reexecutar_solicitado === true ||
      (row.status_governanca === 'revisao_solicitada' &&
        oldRow &&
        oldRow.status_governanca &&
        oldRow.status_governanca !== 'revisao_solicitada');

    if (!requestedReaudit) return null;
    return this.scheduleReaudit({
      routineId: String(row.id),
      source: 'routines',
      modo: 'headless'
    });
  }

  /**
   * Inicia a assinatura Realtime via `@supabase/supabase-js` nas tabelas:
   * `routine_reviews`, `runner_jobs`, `audit_jobs` e `routines`.
   */
  public async startRealtimeSubscription(): Promise<void> {
    const supabase = this.supabaseClient ?? getSupabaseAdmin();
    await this.refreshCacheFn().catch(() => undefined);

    this.channel = supabase
      .channel('orion-worker-daemon-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routine_reviews' },
        (payload: any) => {
          this.handleRoutineReviewChange(payload);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'runner_jobs' },
        (payload: any) => {
          this.handleJobChange(payload, 'runner_jobs');
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'audit_jobs' },
        (payload: any) => {
          this.handleJobChange(payload, 'audit_jobs');
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'routines' },
        (payload: any) => {
          this.handleRoutineRowChange(payload);
        }
      )
      .subscribe((status: string) => {
        this.log(`📡 [Worker Daemon Realtime] Status do canal Supabase: ${status}`);
      });
  }

  public async stop(): Promise<void> {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.pendingRequests.clear();
    if (this.channel && this.supabaseClient) {
      await this.supabaseClient.removeChannel(this.channel).catch(() => undefined);
    }
    this.channel = null;
  }
}

const isMain = (() => {
  try {
    return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMain) {
  if (!isSupabaseConfigured()) {
    console.error('✕ ERRO: SUPABASE_URL e SUPABASE_SECRET_KEY não definidos em auditoria/.env');
    process.exit(1);
  }
  console.log('====================================================');
  console.log('  ORION AUDIT CONSOLE — WORKER DAEMON REALTIME      ');
  console.log('  (1 job por vez | Debounce | Camada 0.1 RAG Sync)  ');
  console.log('====================================================');
  console.log(`✓ Supabase URL: ${SUPABASE_URL}`);
  const daemon = new OrionRealtimeWorkerDaemon();
  daemon.startRealtimeSubscription().catch(err => {
    console.error('✕ Falha ao iniciar Worker Daemon Realtime:', err);
    process.exit(1);
  });
}
