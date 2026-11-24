import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import type { VisualAuditMode } from './types.js';

/**
 * Cliente Exclusivo do Antigravity CLI (`agy`) para as Camadas 2B e 2C (ADR-031):
 * - Zero APIs externas (sem `OPENAI_API_KEY` e sem `claude -p`).
 * - Modelo canônico fixo em `Gemini 4 Hydrogen Extra` (`--model gemini-4-hydrogen-xhigh --effort xhigh`).
 * - Execução single-shot não-interativa (`--print --disable-slash-commands`) com prompt enviado
 *   obrigatoriamente via `STDIN` (`child.stdin`) para eliminar o limite de caracteres do `cmd.exe` (ADR-014).
 * - Singleton `AsyncSemaphore(1)` serializando todas as inferências entre workers do `BrowserWorkerPool`.
 * - Escrita efêmera de imagem em `auditoria/cache/som-worker-${workerId}-${Date.now()}.png` com remoção
 *   garantida no bloco `finally`.
 * - Degradação graciosa: timeout, erro de parse JSON ou limite de cota retornam `null` sem exceção fatal.
 */

export const AGY_BINARY = process.platform === 'win32' ? 'agy.exe' : 'agy';
export const AGY_MODEL_ID = 'gemini-4-hydrogen-xhigh';
export const AGY_MODEL_LABEL = 'Gemini 4 Hydrogen Extra';
export const AGY_EFFORT_LEVEL = 'xhigh';
export const AGY_DEFAULT_TIMEOUT_MS = 45_000;

/**
 * Semáforo assíncrono FIFO (`AsyncSemaphore(1)`) que garante exclusão mútua entre workers concorrentes
 * do `BrowserWorkerPool` ao invocar o binário local `agy`.
 */
export class AsyncSemaphore {
  private permits: number;
  private readonly maxPermits: number;
  private readonly queue: Array<() => void> = [];
  private activeCount = 0;

  constructor(maxPermits = 1) {
    this.maxPermits = Math.max(1, maxPermits);
    this.permits = this.maxPermits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      this.activeCount++;
      return;
    }
    return new Promise<void>(resolve => {
      this.queue.push(() => {
        this.activeCount++;
        resolve();
      });
    });
  }

  release(): void {
    this.activeCount = Math.max(0, this.activeCount - 1);
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.permits = Math.min(this.maxPermits, this.permits + 1);
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

  get inFlight(): number {
    return this.activeCount;
  }

  get waitingCount(): number {
    return this.queue.length;
  }
}

/** Singleton global de serialização de chamadas ao `agy` (`AsyncSemaphore(1)`). */
export const agyInferenceSemaphore = new AsyncSemaphore(1);

export interface AgyInvocationRequest {
  prompt: string;
  imagePath?: string;
  timeoutMs?: number;
  model?: string;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  jsonSchema?: string;
}

export interface AgyRawExecutionResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut?: boolean;
  quotaExceeded?: boolean;
  errorReason?: string;
}

export type AgyTransportFn = (req: AgyInvocationRequest) => Promise<AgyRawExecutionResult | Response | string | Record<string, unknown> | null>;

let testTransportOverride: AgyTransportFn | null = null;

/** Permite injetar transporte simulado em testes unitários 100% offline. */
export function setAgyTransportForTests(transport: AgyTransportFn | null): void {
  testTransportOverride = transport;
}

/**
 * Resolve o modo de operação da Camada 2B/2C (`--visual-mode live | defer` — ADR-031):
 * - Flag explícita `--visual-mode=live|defer` ou `--visual-mode live|defer` tem precedência;
 * - Padrão `defer` quando `--phase` ou `--reaudit-pending` for usado (sem subprocessos `agy` durante lotes);
 * - Padrão `live` quando `--routines` ou `--routine` for usado.
 */
export function resolveVisualAuditMode(args: string[]): VisualAuditMode {
  const inline = args.find(a => a.startsWith('--visual-mode='));
  const explicitRaw = inline
    ? inline.slice('--visual-mode='.length).trim().toLowerCase()
    : (() => {
        const idx = args.indexOf('--visual-mode');
        return idx !== -1 && args[idx + 1] ? args[idx + 1].trim().toLowerCase() : '';
      })();

  if (explicitRaw === 'live' || explicitRaw === 'defer') {
    return explicitRaw;
  }

  const hasPhase = args.some(a => a === '--phase' || a.startsWith('--phase='));
  const hasReauditPending = args.includes('--reaudit-pending');
  if (hasPhase || hasReauditPending) {
    return 'defer';
  }
  return 'live';
}

/**
 * Monta os argumentos de linha de comando para `agy.exe` em modo não-interativo (`--print`),
 * selecionando `Gemini 4 Hydrogen Extra` (`--model gemini-4-hydrogen-xhigh --effort xhigh`)
 * sem jamais passar o texto do prompt na linha de comando (enviado via `STDIN`).
 */
export function buildAgyCliArgs(req: AgyInvocationRequest): string[] {
  const timeoutSec = Math.max(5, Math.ceil((req.timeoutMs ?? AGY_DEFAULT_TIMEOUT_MS) / 1000));
  // agy >= 1.5.x: `--print` consome o próximo token como prompt. `--print=` (valor vazio colado à flag)
  // + `--input-format stream-json` mantém o prompt exclusivamente em STDIN como NDJSON (ADR-014/ADR-031).
  const args: string[] = [
    '--print=',
    '--input-format',
    'stream-json',
    '--model',
    req.model || AGY_MODEL_ID,
    '--effort',
    req.effort || AGY_EFFORT_LEVEL,
    '--output-format',
    'stream-json',
    '--print-timeout',
    `${timeoutSec}s`,
    '--disable-slash-commands'
  ];

  if (req.jsonSchema) {
    args.push('--json-schema', req.jsonSchema);
  }

  if (req.imagePath) {
    const imgDir = path.dirname(path.resolve(req.imagePath));
    args.push('--dangerously-skip-permissions', '--add-dir', imgDir);
  }

  return args;
}

/**
 * Prepara o payload enviado via `STDIN` ao `agy`, incluindo referência `@<caminho>`
 * quando há imagem anexa (Camada 2C Set-of-Mark ou Visual Grounding).
 */
export function buildAgyStdinPayload(prompt: string, imagePath?: string): string {
  if (!imagePath) return prompt;
  const absPath = path.resolve(imagePath).replace(/\\/g, '/');
  const relPath = path.relative(config.rootDir, path.resolve(imagePath)).replace(/\\/g, '/');
  const mention = relPath && !relPath.startsWith('..') ? `@${relPath}` : `@${absPath}`;
  return [
    `[Imagem Anexa para Inspeção Visual: ${mention} (${absPath})]`,
    prompt
  ].join('\n\n');
}

/**
 * Envelopa o prompt como mensagem NDJSON de entrada do `agy --input-format stream-json`
 * (`{"event":"user","message":{"content":"..."}}` + `\n`).
 */
export function buildAgyStreamInput(stdinPayload: string): string {
  return `${JSON.stringify({ event: 'user', message: { content: stdinPayload } })}\n`;
}

/**
 * Lê a saída `--output-format stream-json` do `agy` e devolve o evento final `result`:
 * `response` (texto) e `error` quando `status !== 'SUCCESS'`. `null` se não houver evento `result`.
 */
export function extractAgyStreamResult(stdout: string): { ok: boolean; response: string; error?: string } | null {
  let last: Record<string, any> | null = null;
  for (const line of String(stdout || '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    try {
      const evt = JSON.parse(t);
      if (evt && evt.event === 'result' && evt.result && typeof evt.result === 'object') last = evt.result;
    } catch {
      /* linha parcial/ruído: ignora */
    }
  }
  if (!last) return null;
  const ok = String(last.status || '').toUpperCase() === 'SUCCESS';
  return { ok, response: String(last.response ?? ''), error: ok ? undefined : String(last.error || last.status || 'erro') };
}

function isQuotaOrRateLimitError(text: string): boolean {
  return /quota|rate[_\s-]?limit|resource_exhausted|\b429\b|too many requests|capacity/i.test(text);
}

/**
 * Executa o processo `agy` enviando o prompt exclusivamente via `child.stdin` (ADR-014 / ADR-031).
 */
export async function spawnAgyProcess(req: AgyInvocationRequest): Promise<AgyRawExecutionResult> {
  const timeoutMs = req.timeoutMs ?? AGY_DEFAULT_TIMEOUT_MS;
  const args = buildAgyCliArgs(req);
  const stdinPayload = buildAgyStdinPayload(req.prompt, req.imagePath);

  return new Promise<AgyRawExecutionResult>(resolve => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;

    const finish = (res: AgyRawExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res);
    };

    let child;
    try {
      child = spawn(AGY_BINARY, args, {
        cwd: config.rootDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      });
    } catch (err: any) {
      finish({
        ok: false,
        stdout: '',
        stderr: String(err?.message || err),
        exitCode: null,
        errorReason: `spawn_error: ${String(err?.message || err)}`
      });
      return;
    }

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGTERM');
      } catch {}
      finish({
        ok: false,
        stdout,
        stderr,
        exitCode: null,
        timedOut: true,
        errorReason: `timeout após ${timeoutMs}ms`
      });
    }, timeoutMs);

    child.stdout?.on('data', chunk => {
      stdout += String(chunk);
    });

    child.stderr?.on('data', chunk => {
      stderr += String(chunk);
    });

    child.on('error', err => {
      finish({
        ok: false,
        stdout,
        stderr: `${stderr}\n${String(err?.message || err)}`.trim(),
        exitCode: null,
        errorReason: `process_error: ${String(err?.message || err)}`
      });
    });

    child.on('close', code => {
      const combined = `${stdout}\n${stderr}`;
      const quotaExceeded = isQuotaOrRateLimitError(combined);
      finish({
        ok: code === 0 && !timedOut && !quotaExceeded,
        stdout,
        stderr,
        exitCode: code,
        timedOut,
        quotaExceeded,
        errorReason:
          code !== 0
            ? quotaExceeded
              ? 'quota_exceeded'
              : `exit_code_${code}`
            : undefined
      });
    });

    try {
      child.stdin?.write(buildAgyStreamInput(stdinPayload), 'utf8');
      child.stdin?.end();
    } catch (err: any) {
      finish({
        ok: false,
        stdout,
        stderr: String(err?.message || err),
        exitCode: null,
        errorReason: `stdin_write_error: ${String(err?.message || err)}`
      });
    }
  });
}

/**
 * Extrai o primeiro objeto JSON balanceado `{ ... }` de uma string arbitrária.
 */
function extractFirstBalancedJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

/**
 * Desempacota envelopes JSON do `agy --output-format json`, blocos markdown ```json ... ```
 * ou envelopes de APIs mockadas em testes unitários, devolvendo o objeto de domínio tipado ou `null`.
 */
export function parseStrictJsonFromAgyOutput<T = Record<string, unknown>>(rawInput: unknown): T | null {
  if (rawInput == null) return null;

  if (typeof rawInput === 'object' && !Buffer.isBuffer(rawInput)) {
    const obj = rawInput as Record<string, any>;
    // Envelopes conhecidos (agy --output-format json ou mocks de API em testes offline)
    if (Array.isArray(obj.choices) && obj.choices[0]?.message?.content !== undefined) {
      return parseStrictJsonFromAgyOutput<T>(obj.choices[0].message.content);
    }
    if (Array.isArray(obj.candidates) && obj.candidates[0]?.content?.parts?.[0]?.text !== undefined) {
      return parseStrictJsonFromAgyOutput<T>(obj.candidates[0].content.parts[0].text);
    }
    for (const envelopeKey of ['result', 'response', 'output', 'content', 'text', 'message']) {
      if (typeof obj[envelopeKey] === 'string' && obj[envelopeKey].trim().length > 0) {
        const inner = parseStrictJsonFromAgyOutput<T>(obj[envelopeKey]);
        if (inner !== null) return inner;
      } else if (
        obj[envelopeKey] &&
        typeof obj[envelopeKey] === 'object' &&
        !Array.isArray(obj[envelopeKey])
      ) {
        return obj[envelopeKey] as T;
      }
    }
    return obj as T;
  }

  const rawText = String(rawInput).trim();
  if (!rawText) return null;

  // 1. Tentativa de parse direto
  try {
    const direct = JSON.parse(rawText);
    if (direct && typeof direct === 'object' && !Array.isArray(direct)) {
      return parseStrictJsonFromAgyOutput<T>(direct);
    }
  } catch {}

  // 2. Bloco cercado ```json ... ```
  const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) {
    try {
      const parsedFence = JSON.parse(fenced[1].trim());
      if (parsedFence && typeof parsedFence === 'object' && !Array.isArray(parsedFence)) {
        return parseStrictJsonFromAgyOutput<T>(parsedFence);
      }
    } catch {}
  }

  // 3. Primeiro objeto `{ ... }` balanceado no texto
  const balanced = extractFirstBalancedJsonObject(rawText);
  if (balanced) {
    try {
      const parsedBalanced = JSON.parse(balanced);
      if (parsedBalanced && typeof parsedBalanced === 'object' && !Array.isArray(parsedBalanced)) {
        return parseStrictJsonFromAgyOutput<T>(parsedBalanced);
      }
    } catch {}
  }

  return null;
}

/**
 * Executa uma inferência JSON estrita no `agy` (`Gemini 4 Hydrogen Extra`), protegida pelo
 * `agyInferenceSemaphore` (`AsyncSemaphore(1)`) e com degradação graciosa (`null` em qualquer erro).
 */
export async function invokeAgyJson<T = Record<string, unknown>>(
  req: AgyInvocationRequest,
  customTransport?: AgyTransportFn
): Promise<T | null> {
  return agyInferenceSemaphore.runExclusive(async () => {
    try {
      const transport = customTransport ?? testTransportOverride;
      if (transport) {
        const raw = await transport(req);
        if (raw == null) return null;
        if (typeof (raw as Response)?.json === 'function') {
          const resp = raw as Response;
          if (!resp.ok) return null;
          const body = await resp.json();
          return parseStrictJsonFromAgyOutput<T>(body);
        }
        if (typeof raw === 'object' && 'ok' in raw && 'stdout' in raw) {
          const execRes = raw as AgyRawExecutionResult;
          if (!execRes.ok) return null;
          return parseStrictJsonFromAgyOutput<T>(execRes.stdout);
        }
        return parseStrictJsonFromAgyOutput<T>(raw);
      }

      const result = await spawnAgyProcess(req);
      if (!result.ok) {
        console.warn(
          `   ⚠ [agy-client] Degradação graciosa (${result.errorReason || 'falha na execução'}): seguindo sem bloqueio fatal.`
        );
        return null;
      }
      // stream-json: o JSON de domínio está em `result.response` do evento final.
      const streamResult = extractAgyStreamResult(result.stdout);
      if (streamResult) {
        if (!streamResult.ok) {
          console.warn(`   ⚠ [agy-client] Degradação graciosa (${streamResult.error}): seguindo sem bloqueio fatal.`);
          return null;
        }
        return parseStrictJsonFromAgyOutput<T>(streamResult.response);
      }
      return parseStrictJsonFromAgyOutput<T>(result.stdout);
    } catch {
      return null;
    }
  });
}

/**
 * Inferência de TEXTO livre no `agy` (resposta de uma linha, ex.: Camada 3 da ADR-037, que valida a resposta por
 * `parseClosedSemanticAnswer`). Mesmas convenções de `invokeAgyJson`: `agyInferenceSemaphore`, timeout e `null` em
 * qualquer falha (nunca bloqueia o passo).
 */
export async function invokeAgyText(req: AgyInvocationRequest, customTransport?: AgyTransportFn): Promise<string | null> {
  return agyInferenceSemaphore.runExclusive(async () => {
    try {
      const transport = customTransport ?? testTransportOverride;
      if (transport) {
        const raw = await transport(req);
        if (raw == null) return null;
        if (typeof raw === 'string') return raw;
        if (typeof (raw as Response)?.text === 'function') {
          const resp = raw as Response;
          return resp.ok ? await resp.text() : null;
        }
        if (typeof raw === 'object' && 'ok' in raw && 'stdout' in raw) {
          const execRes = raw as AgyRawExecutionResult;
          if (!execRes.ok) return null;
          const s = extractAgyStreamResult(execRes.stdout);
          return s ? (s.ok ? s.response : null) : execRes.stdout || null;
        }
        return null;
      }
      const result = await spawnAgyProcess(req);
      if (!result.ok) {
        console.warn(`   ⚠ [agy-client] Degradação graciosa (${result.errorReason || 'falha na execução'}): seguindo sem bloqueio fatal.`);
        return null;
      }
      const s = extractAgyStreamResult(result.stdout);
      if (s) return s.ok ? s.response : null;
      return result.stdout || null;
    } catch {
      return null;
    }
  });
}

/**
 * Grava o buffer PNG gerado pelo Sharp em `auditoria/cache/som-worker-${workerId}-${Date.now()}.png`,
 * executa a função de inferência visual com o caminho do arquivo e remove o arquivo temporário
 * obrigatoriamente no bloco `finally` (ADR-031).
 */
export async function withEphemeralSomImage<T>(
  imageBuffer: Buffer,
  workerId: string,
  fn: (tempImagePath: string) => Promise<T>
): Promise<T> {
  const safeWorker = String(workerId || 'default').replace(/[^a-zA-Z0-9_-]/g, '-');
  const cacheDir = path.join(config.rootDir, 'auditoria', 'cache');
  await fs.promises.mkdir(cacheDir, { recursive: true });
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const tempImagePath = path.join(cacheDir, `som-worker-${safeWorker}-${uniqueSuffix}.png`);

  await fs.promises.writeFile(tempImagePath, imageBuffer);
  try {
    return await fn(tempImagePath);
  } finally {
    await fs.promises.unlink(tempImagePath).catch(() => undefined);
  }
}

/**
 * Invoca o `agy` (`Gemini 4 Hydrogen Extra`) com imagem efêmera em disco (`som-worker-${workerId}-${ts}.png`),
 * limpando o arquivo no `finally` e retornando o objeto JSON parseado ou `null`.
 */
export async function invokeAgyVisionBufferJson<T = Record<string, unknown>>(
  options: {
    prompt: string;
    imageBuffer: Buffer;
    workerId?: string;
    timeoutMs?: number;
    jsonSchema?: string;
  },
  customTransport?: AgyTransportFn
): Promise<T | null> {
  try {
    return await withEphemeralSomImage(
      options.imageBuffer,
      options.workerId || 'single',
      async tempImagePath =>
        invokeAgyJson<T>(
          {
            prompt: options.prompt,
            imagePath: tempImagePath,
            timeoutMs: options.timeoutMs ?? AGY_DEFAULT_TIMEOUT_MS,
            jsonSchema: options.jsonSchema
          },
          customTransport
        )
    );
  } catch {
    return null;
  }
}
