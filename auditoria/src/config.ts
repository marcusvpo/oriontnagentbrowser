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

/** Diretório (ignorado pelo Git) com sessões e URLs de módulo descobertas ao vivo. */
const authDir = path.join(auditoriaRoot, 'auth');

/**
 * Produtos do Portal Orion (`/webPortal/#/produtos`) selecionáveis por `--product` (Fase 4). O padrão é o
 * Orion TN, com os mesmos arquivos de antes (`app-home.json`, `session-homolog.json`): 100% retrocompatível.
 */
export type PortalProductName = 'Orion TN' | 'Orion Caixa' | 'Orion Estoque';
export const PORTAL_PRODUCTS: readonly PortalProductName[] = ['Orion TN', 'Orion Caixa', 'Orion Estoque'];
export const DEFAULT_PORTAL_PRODUCT: PortalProductName = 'Orion TN';

const PRODUCT_SLUGS: Record<PortalProductName, string> = {
  'Orion TN': 'orion-tn',
  'Orion Caixa': 'orion-caixa',
  'Orion Estoque': 'orion-estoque'
};

/** `orion-tn` | `orion-caixa` | `orion-estoque`. */
export const portalProductSlug = (product: PortalProductName): string => PRODUCT_SLUGS[product];

/**
 * Normaliza o valor de `--product`: aceita o nome do card (`"Orion Caixa"`), o slug (`orion-caixa`) ou o nome
 * curto (`caixa`), sem diferenciar caixa, acento, hífen ou sublinhado. Valor desconhecido devolve `null`.
 */
export function normalizePortalProduct(input: string | null | undefined): PortalProductName | null {
  if (input == null) return null;
  const key = String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ')
    .trim()
    .replace(/^orion\s*/, '');
  if (key === 'tn') return 'Orion TN';
  if (key === 'caixa') return 'Orion Caixa';
  if (key === 'estoque') return 'Orion Estoque';
  return null;
}

/** URL do módulo descoberta ao vivo, por produto: o Orion TN mantém `auth/app-home.json`; os demais, `auth/app-home-<slug>.json`. */
export function appHomeFileFor(product: PortalProductName, dir: string = authDir): string {
  return path.join(dir, product === DEFAULT_PORTAL_PRODUCT ? 'app-home.json' : `app-home-${portalProductSlug(product)}.json`);
}

/**
 * Sessão mestre por produto: o Orion TN mantém `auth/session-homolog.json`; os demais, `auth/session-homolog-<slug>.json`,
 * para que o estado salvo dentro de um módulo nunca seja reaproveitado como se fosse de outro.
 */
export function sessionFileFor(product: PortalProductName, dir: string = authDir): string {
  return path.join(dir, product === DEFAULT_PORTAL_PRODUCT ? 'session-homolog.json' : `session-homolog-${portalProductSlug(product)}.json`);
}

/** Arquivo (em `auth/`, ignorado pelo Git) com a URL real do módulo Orion TN descoberta após o login (ADR-025). */
const appHomeFile = appHomeFileFor(DEFAULT_PORTAL_PRODUCT);

function readDiscoveredAppHome(file: string = appHomeFile): string {
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
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
  /** Zoom CSS aplicado no documento (0.8 = 80%, área útil equivalente a 1800x1125 mantendo PNG 1440x900) */
  browserZoom: number;
  maxWriteConcurrency: number;
  maxReadConcurrency: number;
  timeoutMs: number;
  sessionFile: string;
  /** Persistência da URL do módulo descoberta ao vivo (ADR-025), por produto do Portal */
  appHomeFile: string;
  /** Produto do Portal Orion auditado (`--product`); padrão `Orion TN` */
  portalProduct: PortalProductName;
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
  browserZoom: parseFloat(process.env.BROWSER_ZOOM || '0.8') || 0.8,
  // Golden Rule 8: rotinas `mutation` passam por um semáforo de 1 (evita deadlocks no WildFly/PostgreSQL)
  maxWriteConcurrency: 1,
  maxReadConcurrency: 4, // Concorrência para consultas
  timeoutMs: parseInt(process.env.BROWSER_TIMEOUT_MS || '20000', 10),
  sessionFile: sessionFileFor(DEFAULT_PORTAL_PRODUCT),
  appHomeFile,
  portalProduct: DEFAULT_PORTAL_PRODUCT,
  rootDir: projectRoot,
  kbDir: path.join(projectRoot, 'kb', 'rotinas'),
  outputDir: path.join(auditoriaRoot, 'rotinas'),
  envLabel: process.env.ORION_ENV_LABEL || '4 TN SCS - CARTÓRIO SILVIA DALBIEN',
  envVersion: process.env.ORION_ENV_VERSION || 'WildFly 22 / Orion 06.04.01',
  autoSeedDefault: process.env.ORION_AUTO_SEED !== 'false'
};

/**
 * Ativa o produto do Portal Orion (`--product`). `Orion TN` mantém exatamente o comportamento anterior
 * (`app-home.json`, `ORION_APP_HOME_URL` e o fallback `/webFirmas/#/inicio`). `Orion Caixa` e `Orion Estoque`
 * usam só a URL descoberta ao vivo no clique do card (`app-home-<slug>.json`), sem derivar `/webFirmas`:
 * enquanto ela não existe, `appHomeUrl` fica vazia e a autenticação passa pelo card do Portal.
 */
export function setActivePortalProduct(product: PortalProductName, dir: string = authDir): AuditorConfig {
  config.portalProduct = product;
  config.appHomeFile = appHomeFileFor(product, dir);
  config.sessionFile = sessionFileFor(product, dir);
  config.appHomeUrl =
    product === DEFAULT_PORTAL_PRODUCT
      ? readDiscoveredAppHome(config.appHomeFile) || process.env.ORION_APP_HOME_URL || deriveAppHomeUrl(homologUrl)
      : readDiscoveredAppHome(config.appHomeFile);
  return config;
}

/** Tela de seleção de produtos do Portal Orion (`/webPortal/#/produtos`), na origem de `ORION_BASE_URL`. */
export function portalProductsUrl(): string {
  try {
    return `${new URL(config.homologUrl).origin}/webPortal/#/produtos`;
  } catch {
    return '';
  }
}

/** Grava e adota em memória a URL real do módulo do produto ativo descoberta no login (ADR-025). */
export function persistDiscoveredAppHome(url: string): void {
  if (!/^https?:\/\//i.test(url)) return;
  const file = config.appHomeFile;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify({ appHomeUrl: url, produto: config.portalProduct, descobertoEm: new Date().toISOString() }, null, 2),
      'utf-8'
    );
  } catch {
    // sem persistência o valor vale apenas neste processo
  }
  config.appHomeUrl = url;
}
