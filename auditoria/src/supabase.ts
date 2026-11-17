import dotenv from 'dotenv';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';

const auditoriaRoot = path.resolve(
  process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria')
);
dotenv.config({ path: path.join(auditoriaRoot, '.env') });

export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';
export const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '';
export const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'audit-screenshots';

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_URL e SUPABASE_SECRET_KEY não configurados em auditoria/.env');
  }
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

export function createPgClient(): pg.Client {
  if (!SUPABASE_DB_URL) {
    throw new Error('SUPABASE_DB_URL não configurado em auditoria/.env');
  }
  return new pg.Client({
    connectionString: SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
}
