import { config } from './config.js';

/**
 * Preflight de alcance do servidor de homologação (ADR-025). O ambiente de Produtos é interno e só responde
 * com a OpenVPN da Siplan conectada: sem este teste, cada worker abriria o navegador e estouraria por timeout.
 * Qualquer resposta HTTP (inclusive 3xx/401/404) prova que o servidor está alcançável; só erro de rede ou
 * timeout aborta.
 */

export class PreflightError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreflightError';
  }
}

/** Mascara o host nos logs: `192.0.2.10` -> `192.0.2.x`; nome de host -> `<host>`. */
export function maskHost(host: string): string {
  const ipv4 = host.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  return ipv4 ? `${ipv4[1]}.x` : '<host>';
}

export interface PreflightOptions {
  timeoutMs?: number;
  /** Injetável nos testes offline */
  fetchImpl?: typeof fetch;
  url?: string;
}

export async function preflightOrionReachability(opts: PreflightOptions = {}): Promise<void> {
  const target = opts.url ?? config.homologUrl;
  if (!target) {
    throw new PreflightError('ORION_BASE_URL não configurada em auditoria/.env.');
  }
  let origin: string;
  let host: string;
  try {
    const u = new URL(target);
    origin = u.origin;
    host = u.hostname;
  } catch {
    throw new PreflightError('ORION_BASE_URL inválida em auditoria/.env.');
  }

  const timeoutMs = opts.timeoutMs ?? 3000;
  const doFetch = opts.fetchImpl ?? fetch;
  try {
    await doFetch(origin, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
  } catch (err: any) {
    const reason = err?.name === 'TimeoutError' || err?.name === 'AbortError' ? `sem resposta em ${timeoutMs / 1000}s` : String(err?.cause?.code || err?.message || 'falha de rede');
    throw new PreflightError(
      `Servidor de homologação inalcançável (${maskHost(host)}, ${reason}). ` +
        'Conecte a OpenVPN da Siplan e execute novamente.'
    );
  }
  console.log(`✓ [Preflight] Servidor de homologação alcançável (${maskHost(host)}).`);
}
