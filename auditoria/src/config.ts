import fs from 'node:fs';
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

/** Arquivo (em `auth/`, ignorado pelo Git) com a URL real do módulo Orion TN descoberta após o login (ADR-025). */
const appHomeFile = path.join(auditoriaRoot, 'auth', 'app-home.json');

function readDiscoveredAppHome(): string {
  try {
    const raw = JSON.parse(fs.readFileSync(appHomeFile, 'utf-8'));
    return typeof raw?.appHomeUrl === 'string' ? raw.appHomeUrl : '';
  } catch {
    return '';
  }
}

export interface AuditorConfig {
  /** URL de entrada (login do portal ou `#/produtos`). `ORION_BASE_URL` com alias legado `ORION_HOMOLOG_URL` */
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
  /** Persistência da URL do módulo descoberta ao vivo (ADR-025) */
  appHomeFile: string;
  rootDir: string;
  kbDir: string;
  outputDir: string;
  /** Rótulo do ambiente auditado, gravado no frontmatter e no histórico de reauditoria (ADR-025) */
  envLabel: string;
  envVersion: string;
  /** Auto-seed ligado por padrão; `ORION_AUTO_SEED=false` desliga (ambiente compartilhado, ADR-025) */
  autoSeedDefault: boolean;
}

const homologUrl = process.env.ORION_BASE_URL || process.env.ORION_HOMOLOG_URL || '';

export const config: AuditorConfig = {
  homologUrl,
  appHomeUrl: readDiscoveredAppHome() || process.env.ORION_APP_HOME_URL || deriveAppHomeUrl(homologUrl),
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
  appHomeFile,
  rootDir: projectRoot,
  kbDir: path.join(projectRoot, 'kb', 'rotinas'),
  outputDir: path.join(auditoriaRoot, 'rotinas'),
  envLabel: process.env.ORION_ENV_LABEL || '4 TN SCS - CARTÓRIO SILVIA DALBIEN',
  envVersion: process.env.ORION_ENV_VERSION || 'WildFly 22 / Orion 06.04.01',
  autoSeedDefault: process.env.ORION_AUTO_SEED !== 'false'
};

/** Grava e adota em memória a URL real do módulo Orion TN descoberta no login (ADR-025). */
export function persistDiscoveredAppHome(url: string): void {
  if (!/^https?:\/\//i.test(url)) return;
  try {
    fs.mkdirSync(path.dirname(appHomeFile), { recursive: true });
    fs.writeFileSync(appHomeFile, JSON.stringify({ appHomeUrl: url, descobertoEm: new Date().toISOString() }, null, 2), 'utf-8');
  } catch {
    // sem persistência o valor vale apenas neste processo
  }
  config.appHomeUrl = url;
}
