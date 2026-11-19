import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleOrionAuditApiRequest } from './_lib/supabaseApi.js';

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
): Promise<void> {
  // Garante preservação do path original mesmo quando Vercel reescreve `/api/:path*` -> `/api/index?__path=:path*`
  if (req.url) {
    const parsed = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    if (parsed.pathname === '/api/index' && parsed.searchParams.has('__path')) {
      const subPath = parsed.searchParams.get('__path') || '';
      parsed.searchParams.delete('__path');
      const qs = parsed.searchParams.toString();
      req.url = `/api/${subPath.replace(/^\/+/, '')}${qs ? `?${qs}` : ''}`;
    }
  }
  await handleOrionAuditApiRequest(req, res);
}
