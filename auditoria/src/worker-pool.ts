import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';
import { config } from './config.js';
import type { AuditRoutineReport, ParsedRoutine, WorkloadType } from './types.js';

/**
 * Semáforo Assíncrono Determinístico para controle estrito de concorrência
 * (usado tanto na fila READ_ONLY quanto na trava de banco MUTATION).
 */
export class AsyncSemaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(maxConcurrency: number) {
    this.permits = Math.max(1, maxConcurrency);
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise<void>(resolve => {
      this.waitQueue.push(resolve);
    });
  }

  release(): void {
    const next = this.waitQueue.shift();
    if (next) {
      next();
    } else {
      this.permits++;
    }
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/** Comandos que gravam, excluem ou inativam dados quando acionados (ADR-016). */
const COMMIT_ACTION_PATTERN = /\b(salvar|gravar|confirmar|concluir|excluir|inativar)\b/;
/** O mesmo comando citado sem negrito, junto de um verbo de acionamento na mesma frase. */
const COMMIT_CLICK_PATTERN =
  /\b(clique|clicar|acione|acionar|pressione|selecione)\b[^.;:]*\b(salvar|gravar|confirmar|concluir|excluir|inativar)\b/;

/**
 * Classifica deterministicamente uma rotina em `read_only` (consulta/visualização)
 * ou `mutation` (cadastro/gravação/alteração no WildFly/PostgreSQL).
 */
export function classifyRoutineWorkload(routine: {
  id: string;
  titulo?: string;
  steps?: Array<{
    actionType?: string;
    label?: string;
    rawText?: string;
    targets?: string[];
    mainTargetCount?: number;
  }>;
}): WorkloadType {
  const mutationKeywords = [
    'cadastrar',
    'cadastro',
    'criar',
    'criação',
    'novo',
    'adicionar',
    'incluir',
    'salvar',
    'concluir',
    'gravar',
    'alterar',
    'editar',
    'edição',
    'inativar',
    'inativação',
    'excluir',
    'redefinir',
    'redefinição',
    'parametrizar',
    'configurar',
    'habilitar',
    'liberar',
    'promover',
    'promoção'
  ];

  const titleLower = (routine.titulo || '').toLowerCase();
  const hasMutationInTitle = mutationKeywords.some(kw => titleLower.includes(kw));

  const steps = routine.steps || [];
  const hasFillStep = steps.some(s => s.actionType === 'fill');
  const hasMutationStep = steps.some(s => {
    const text = `${s.label || ''} ${s.rawText || ''} ${(s.targets || []).join(' ')}`.toLowerCase();
    return mutationKeywords.some(kw => text.includes(kw));
  });

  // ADR-016: qualquer passo que acione um comando de gravação/exclusão torna a rotina `mutation`,
  // independentemente do título (ex.: "Descompasso de credenciais..." que termina em Salvar).
  // Exceção: passo de lista de opções (linha principal sem negrito, opções nos sub-itens). O executor
  // nunca aciona essas opções, então um "Inativar" citado só ali não oferece risco de gravação.
  const hasCommitAction = steps.some(s => {
    if (s.mainTargetCount === 0 && (s.targets || []).length > 0) return false;
    const strip = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if ((s.targets || []).some(t => COMMIT_ACTION_PATTERN.test(strip(t)))) return true;
    return COMMIT_CLICK_PATTERN.test(strip(`${s.label || ''} ${s.rawText || ''}`));
  });

  if (hasFillStep || hasCommitAction || (hasMutationInTitle && hasMutationStep)) {
    return 'mutation';
  }
  return 'read_only';
}

export interface BrowserWorkerPoolOptions {
  /** Concorrência máxima para rotinas de leitura/consulta (default: 4, máx recomendado: 6) */
  readConcurrency?: number;
  /** Concorrência máxima para rotinas de gravação/mutação no banco (default: 1 para evitar deadlocks no WildFly) */
  mutationConcurrency?: number;
  /** Executar navegadores em modo headless (default: true para lotes paralelos) */
  headless?: boolean;
}

export interface WorkerSlot {
  workerId: number;
  sessionId: string;
  stateFilePath: string;
  client: AgentBrowserClient;
}

/**
 * Pool de Execução Concorrente de Navegadores (`agent-browser` Worker Pool):
 * - Isola cada worker com `--session worker-${id}`.
 * - Protege a autenticação SSO do WildFly com Mutex (`authMutex`) e snapshots somente-leitura
 *   (`session-worker-${id}.json`), eliminando race conditions e file locks em disco.
 * - Particiona a carga entre rotinas `READ_ONLY` (paralelismo máximo) e `MUTATION` (semáforo restrito).
 * - Garante encerramento gracioso (`disposeAll`) de todos os daemons ao fim do lote ou em exceções.
 */
export class BrowserWorkerPool {
  private readonly readConcurrency: number;
  private readonly mutationConcurrency: number;
  private readonly headless: boolean;
  private readonly authMutex = new AsyncSemaphore(1);
  private readonly mutationSemaphore: AsyncSemaphore;
  private readonly workers = new Map<number, WorkerSlot>();
  private lastAuthRefreshMs = 0;
  private isDisposed = false;

  constructor(options: BrowserWorkerPoolOptions = {}) {
    this.readConcurrency = Math.min(6, Math.max(1, options.readConcurrency ?? config.maxReadConcurrency ?? 4));
    this.mutationConcurrency = Math.min(3, Math.max(1, options.mutationConcurrency ?? config.maxWriteConcurrency ?? 1));
    this.headless = options.headless ?? true;
    this.mutationSemaphore = new AsyncSemaphore(this.mutationConcurrency);
  }

  /**
   * Garante que a sessão mestre (`session-homolog.json`) está autenticada e sincroniza
   * cópias isoladas (`session-worker-${id}.json`) para que múltiplos workers nunca disputem lock de escrita.
   */
  async ensureMasterAuthAndSyncWorkerState(workerId: number): Promise<string> {
    return this.authMutex.runExclusive(async () => {
      const masterSession = config.sessionFile;
      const authDir = path.dirname(masterSession);
      await fs.promises.mkdir(authDir, { recursive: true });

      const now = Date.now();
      const masterExists = fs.existsSync(masterSession);

      // Double-checked locking: só reautentica se o arquivo não existir ou tiver expirado (> 15 min)
      if (!masterExists || now - this.lastAuthRefreshMs > 15 * 60 * 1000) {
        const authClient = new AgentBrowserClient({
          headless: this.headless,
          sessionId: 'worker-auth-master',
          statePath: masterSession,
          deviceScaleFactor: 1
        });
        try {
          const ok = await ensureAuthenticated(authClient);
          if (!ok) {
            throw new Error('[WorkerPool] Falha ao autenticar sessão mestre no Orion TN.');
          }
          this.lastAuthRefreshMs = Date.now();
        } finally {
          try {
            await authClient.close();
          } catch {}
        }
      }

      // Criar snapshot isolado para o worker (evita file lock compartilhado no Windows)
      const workerStatePath = path.join(authDir, `session-worker-${workerId}.json`);
      if (fs.existsSync(masterSession)) {
        await fs.promises.copyFile(masterSession, workerStatePath);
      }
      return workerStatePath;
    });
  }

  /**
   * Inicializa ou recupera o slot isolado de um worker (`--session worker-${workerId}`).
   */
  private async acquireWorkerSlot(workerId: number): Promise<WorkerSlot> {
    const existing = this.workers.get(workerId);
    if (existing) return existing;

    const sessionId = `worker-${workerId}`;
    const stateFilePath = await this.ensureMasterAuthAndSyncWorkerState(workerId);

    const client = new AgentBrowserClient({
      headless: this.headless,
      sessionId,
      statePath: stateFilePath,
      deviceScaleFactor: 1
    });

    await client.setViewport(config.viewportWidth, config.viewportHeight);
    if (fs.existsSync(stateFilePath)) {
      try {
        await client.stateLoad(stateFilePath);
      } catch {}
    }

    const slot: WorkerSlot = {
      workerId,
      sessionId,
      stateFilePath,
      client
    };
    this.workers.set(workerId, slot);
    return slot;
  }

  /**
   * Executa um lote de rotinas no navegador distribuindo inteligentemente entre:
   * - Fila `READ_ONLY`: até `readConcurrency` workers simultâneos.
   * - Fila `MUTATION`: protegida pelo `mutationSemaphore` (`mutationConcurrency` por vez).
   */
  async executeBatch(
    routineFiles: string[],
    parseFn: (file: string) => ParsedRoutine,
    runnerFn: (file: string, client: AgentBrowserClient, workerSessionId: string, workload: WorkloadType) => Promise<AuditRoutineReport>,
    /** Carga declarada por ID de rotina (ex.: `phase3-manifest.ts`); sem entrada, classifica pelo conteúdo */
    workloadOverrides?: Map<string, WorkloadType>
  ): Promise<AuditRoutineReport[]> {
    const total = routineFiles.length;
    if (total === 0) return [];

    // Classificar todas as rotinas do lote
    const tasks = routineFiles.map((file, index) => {
      const parsed = parseFn(file);
      const workload = workloadOverrides?.get(parsed.id) ?? classifyRoutineWorkload(parsed);
      return { file, index, parsed, workload };
    });

    const readCount = tasks.filter(t => t.workload === 'read_only').length;
    const mutationCount = tasks.length - readCount;

    console.log(`\n================================================================`);
    console.log(`  [WorkerPool] Escalonador Concorrente Iniciado`);
    console.log(`  - Workers Totais: ${this.readConcurrency} (--session worker-1..${this.readConcurrency})`);
    console.log(`  - Rotinas READ_ONLY (Paralelo): ${readCount}`);
    console.log(`  - Rotinas MUTATION (Trava Semáforo=${this.mutationConcurrency}): ${mutationCount}`);
    console.log(`================================================================\n`);

    const results: AuditRoutineReport[] = new Array(total);
    let cursor = 0;

    const signalHandler = () => {
      void this.disposeAll();
    };
    process.once('SIGINT', signalHandler);
    process.once('SIGTERM', signalHandler);

    try {
      const workerCount = Math.min(this.readConcurrency, total);
      const workerPromises = Array.from({ length: workerCount }, async (_, idx) => {
        const workerId = idx + 1;
        const slot = await this.acquireWorkerSlot(workerId);

        while (!this.isDisposed) {
          const currentIdx = cursor++;
          if (currentIdx >= tasks.length) break;

          const task = tasks[currentIdx];
          console.log(
            `[Worker #${workerId} | ${slot.sessionId} | ${task.workload.toUpperCase()}] (${currentIdx + 1}/${total}) Iniciando ${task.parsed.id}...`
          );

          if (task.workload === 'mutation') {
            // Operações de mutação adquirem o semáforo restrito para proteger o WildFly / PostgreSQL
            results[currentIdx] = await this.mutationSemaphore.runExclusive(async () => {
              return runnerFn(task.file, slot.client, slot.sessionId, task.workload);
            });
          } else {
            // Operações de leitura rodam em paralelismo total
            results[currentIdx] = await runnerFn(task.file, slot.client, slot.sessionId, task.workload);
          }
        }
      });

      await Promise.all(workerPromises);
      return results;
    } finally {
      process.removeListener('SIGINT', signalHandler);
      process.removeListener('SIGTERM', signalHandler);
      await this.disposeAll();
    }
  }

  /**
   * Encerra graciosamente todos os daemons `--session worker-N` e limpa os snapshots temporários.
   */
  async disposeAll(): Promise<void> {
    if (this.isDisposed) return;
    this.isDisposed = true;

    const slots = Array.from(this.workers.values());
    this.workers.clear();

    await Promise.allSettled(
      slots.map(async slot => {
        try {
          await slot.client.close();
        } catch {}
        try {
          if (fs.existsSync(slot.stateFilePath)) {
            await fs.promises.unlink(slot.stateFilePath);
          }
        } catch {}
      })
    );
  }
}

/**
 * Executor de Pool Concorrente Leve para Processamento Gráfico / Sharp em Lote:
 * Executa até `concurrency` rotinas simultaneamente sem bloqueio de I/O.
 */
export async function executeConcurrentRenderPool<T, R>(
  items: T[],
  concurrency: number,
  processor: (item: T, index: number, workerId: number) => Promise<R>
): Promise<R[]> {
  const total = items.length;
  if (total === 0) return [];

  const results: R[] = new Array(total);
  const safeConcurrency = Math.max(1, Math.min(concurrency, total));
  let cursor = 0;

  const workers = Array.from({ length: safeConcurrency }, async (_, idx) => {
    const workerId = idx + 1;
    while (true) {
      const currentIdx = cursor++;
      if (currentIdx >= total) break;
      results[currentIdx] = await processor(items[currentIdx], currentIdx, workerId);
    }
  });

  await Promise.all(workers);
  return results;
}
