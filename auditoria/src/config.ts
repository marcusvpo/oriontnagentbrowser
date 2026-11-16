import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const projectRoot = path.resolve(auditoriaRoot, '..');

// Carrega .env da raiz de auditoria independentemente do cwd
dotenv.config({ path: path.join(auditoriaRoot, '.env') });

function deriveAppHomeUrl(homologUrl: string): string {
  if (!homologUrl) return '';
  try {
    return `${new URL(homologUrl).origin}/webFirmas/#/inicio`;
  } catch {
    return '';
  }
}

export interface AuditorConfig {
  homologUrl: string;
  /** Tela inicial autenticada do Orion TN: ponto de partida de toda rotina auditada */
  appHomeUrl: string;
  user: string;
  pass: string;
  headless: boolean;
  viewportWidth: number;
  viewportHeight: number;
  deviceScaleFactor: number;
  maxWriteConcurrency: number;
  maxReadConcurrency: number;
  timeoutMs: number;
  sessionFile: string;
  rootDir: string;
  kbDir: string;
  outputDir: string;
}

const homologUrl = process.env.ORION_HOMOLOG_URL || '';

export const config: AuditorConfig = {
  homologUrl,
  appHomeUrl: process.env.ORION_APP_HOME_URL || deriveAppHomeUrl(homologUrl),
  user: process.env.ORION_USER || '',
  pass: process.env.ORION_PASS || '',
  headless: process.env.BROWSER_HEADLESS === 'true',
  viewportWidth: parseInt(process.env.BROWSER_VIEWPORT_WIDTH || '1440', 10),
  viewportHeight: parseInt(process.env.BROWSER_VIEWPORT_HEIGHT || '900', 10),
  deviceScaleFactor: 1, // Trava obrigatória de DPR 1.0 (ADR-009)
  // Golden Rule 8: rotinas `mutation` passam por um semáforo de 1 (evita deadlocks no WildFly/PostgreSQL)
  maxWriteConcurrency: 1,
  maxReadConcurrency: 4, // Concorrência para consultas
  timeoutMs: parseInt(process.env.BROWSER_TIMEOUT_MS || '20000', 10),
  sessionFile: path.join(auditoriaRoot, 'auth', 'session-homolog.json'),
  rootDir: projectRoot,
  kbDir: path.join(projectRoot, 'kb', 'rotinas'),
  outputDir: path.join(auditoriaRoot, 'rotinas')
};
