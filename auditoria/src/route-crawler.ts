import fs from 'node:fs';
import path from 'node:path';
import type { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import { canonNormalize, leafKey } from './menu-canonical.js';

/**
 * Crawler de Grafo Vivo de Rotas e Menus do Orion TN (ADR-030).
 *
 * Modo estritamente somente-leitura (`--crawl-map`): percorre as folhas não-bloqueadas da árvore
 * de menus no ambiente de Produtos sem acionar gravações, aguarda rede ociosa (`waitForNetworkIdle`),
 * coleta rota (`location.hash`), título da tela, abas e seções, e grava `auditoria/cache/orion-route-graph.json`.
 *
 * Esse grafo atua exclusivamente como fonte auxiliar de validação/sugestão em `menu-path.ts` e
 * `att-screen-advisor.ts` — nunca substitui a medição ao vivo exigida pela Evidência Estrita (ADR-017).
 */

export const ORION_ROUTE_GRAPH_FILE = path.join(config.rootDir, 'auditoria', 'cache', 'orion-route-graph.json');
export const ORION_SCREEN_CATALOG_FILE = path.join(config.rootDir, 'auditoria', 'data', 'orion-screen-catalog.json');

export interface CrawledRouteEntry {
  modulo: string;
  chain: string[];
  hash: string;
  title: string;
  tabs: string[];
  sections: string[];
  fields?: string[];
  buttons?: string[];
  tables?: string[];
}

export type ScreenCatalogItemLike =
  | string
  | { label?: string; title?: string; tooltip?: string; name?: string; placeholder?: string; [key: string]: unknown };

export type ScreenCatalogTableLike =
  | string
  | { title?: string; label?: string; headers?: string[]; columns?: string[]; [key: string]: unknown };

export interface ScreenCatalogEntry {
  id: string;
  modulo: string;
  chain: string[];
  slug: string;
  status: string;
  openedAs: string;
  routeHash: string;
  pageTitle: string;
  tabs: ScreenCatalogItemLike[];
  headings: ScreenCatalogItemLike[];
  buttons: ScreenCatalogItemLike[];
  fields: ScreenCatalogItemLike[];
  tables: ScreenCatalogTableLike[];
}

export interface OrionScreenCatalog {
  version: string;
  level: number | string;
  capturedAt?: string;
  screens: ScreenCatalogEntry[];
}

export interface ScreenCatalogHint {
  entry: ScreenCatalogEntry;
  matchedIn: 'tab' | 'heading' | 'button' | 'field' | 'table' | 'title';
  matchedLabel: string;
  score: number;
}

export interface OrionRouteGraph {
  capturedAt: string;
  environment: string;
  totalMenus: number;
  totalRoutes: number;
  entries: CrawledRouteEntry[];
}

export interface RouteGraphHint {
  entry: CrawledRouteEntry;
  matchedIn: 'tab' | 'section' | 'title';
  matchedLabel: string;
  score: number;
}

let testRouteGraphOverride: OrionRouteGraph | null | undefined;
let diskCache: { filePath: string; mtimeMs: number; graph: OrionRouteGraph } | null = null;
let testScreenCatalogOverride: OrionScreenCatalog | null | undefined;
let screenCatalogDiskCache: { filePath: string; mtimeMs: number; catalog: OrionScreenCatalog } | null = null;

/** Injeção determinística para testes unitários offline; `undefined` restaura a leitura de disco. */
export function setRouteGraphForTesting(graph: OrionRouteGraph | null | undefined): void {
  testRouteGraphOverride = graph;
}

/** Injeção determinística do catálogo Nível 1 para testes offline; `undefined` restaura a leitura de disco. */
export function setScreenCatalogForTesting(catalog: OrionScreenCatalog | null | undefined): void {
  testScreenCatalogOverride = catalog;
}

/** Carrega `orion-route-graph.json` do disco com cache por `mtimeMs`; nunca lança. */
export function loadCachedRouteGraph(filePath = ORION_ROUTE_GRAPH_FILE): OrionRouteGraph | null {
  if (filePath === ORION_ROUTE_GRAPH_FILE && testRouteGraphOverride !== undefined) {
    return testRouteGraphOverride;
  }
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    if (diskCache && diskCache.filePath === filePath && diskCache.mtimeMs === stat.mtimeMs) {
      return diskCache.graph;
    }
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!raw || !Array.isArray(raw.entries)) return null;
    const graph = raw as OrionRouteGraph;
    diskCache = { filePath, mtimeMs: stat.mtimeMs, graph };
    return graph;
  } catch {
    return null;
  }
}

/** Carrega `orion-screen-catalog.json` (Nível 1) do disco com cache por `mtimeMs`; nunca lança. */
export function loadCachedScreenCatalog(filePath = ORION_SCREEN_CATALOG_FILE): OrionScreenCatalog | null {
  if (filePath === ORION_SCREEN_CATALOG_FILE) {
    if (testScreenCatalogOverride !== undefined) {
      return testScreenCatalogOverride;
    }
    if (testRouteGraphOverride !== undefined) {
      return null;
    }
  }
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    if (screenCatalogDiskCache && screenCatalogDiskCache.filePath === filePath && screenCatalogDiskCache.mtimeMs === stat.mtimeMs) {
      return screenCatalogDiskCache.catalog;
    }
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!raw || !Array.isArray(raw.screens)) return null;
    const catalog = raw as OrionScreenCatalog;
    screenCatalogDiskCache = { filePath, mtimeMs: stat.mtimeMs, catalog };
    return catalog;
  } catch {
    return null;
  }
}

const sameNormalizedChain = (a: string[], b: string[]) =>
  a.length === b.length && a.every((s, i) => canonNormalize(s) === canonNormalize(b[i]));

const cleanRouteHash = (hash: string) =>
  String(hash || '')
    .split('?')[0]
    .replace(/\/\d+$/, '')
    .trim()
    .toLowerCase();

/** Extrai rótulo textual de entradas string ou objetos (`{ label, title, tooltip, name, placeholder }`) do catálogo Nível 1. */
export function extractCatalogLabel(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    for (const key of ['label', 'title', 'tooltip', 'name', 'placeholder']) {
      const val = obj[key];
      if (typeof val === 'string' && val.trim()) return val.trim();
    }
  }
  return '';
}

export function extractCatalogLabels(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.map(extractCatalogLabel).filter(Boolean);
}

export function normalizeCatalogTableLabels(tables: unknown): string[] {
  if (!Array.isArray(tables)) return [];
  const out: string[] = [];
  for (const t of tables) {
    if (typeof t === 'string') {
      if (t.trim()) out.push(t.trim());
    } else if (t && typeof t === 'object') {
      const obj = t as Record<string, unknown>;
      if (typeof obj.title === 'string' && obj.title.trim()) out.push(obj.title.trim());
      else if (typeof obj.label === 'string' && obj.label.trim()) out.push(obj.label.trim());
      if (Array.isArray(obj.headers)) {
        for (const h of obj.headers) if (typeof h === 'string' && h.trim()) out.push(h.trim());
      }
      if (Array.isArray(obj.columns)) {
        for (const c of obj.columns) if (typeof c === 'string' && c.trim()) out.push(c.trim());
      }
    }
  }
  return out;
}

export function catalogEntryToRouteEntry(s: ScreenCatalogEntry): CrawledRouteEntry {
  return {
    modulo: s.modulo,
    chain: s.chain,
    hash: s.routeHash || '',
    title: s.pageTitle || '',
    tabs: extractCatalogLabels(s.tabs),
    sections: extractCatalogLabels(s.headings),
    fields: extractCatalogLabels(s.fields),
    buttons: extractCatalogLabels(s.buttons),
    tables: normalizeCatalogTableLabels(s.tables)
  };
}

function enrichRouteEntryFromCatalog(
  entry: CrawledRouteEntry,
  catalog = loadCachedScreenCatalog()
): CrawledRouteEntry {
  if (!catalog) return entry;
  const cat =
    catalog.screens.find(s => sameNormalizedChain(s.chain || [], entry.chain)) ??
    (entry.hash ? catalog.screens.find(s => cleanRouteHash(s.routeHash) === cleanRouteHash(entry.hash)) : undefined);
  if (!cat) return entry;
  const catTabs = extractCatalogLabels(cat.tabs);
  const catSections = extractCatalogLabels(cat.headings);
  const catFields = extractCatalogLabels(cat.fields);
  const catButtons = extractCatalogLabels(cat.buttons);
  const catTables = normalizeCatalogTableLabels(cat.tables);
  return {
    ...entry,
    hash: entry.hash || cat.routeHash || '',
    title: entry.title || cat.pageTitle || '',
    tabs: entry.tabs.length > 0 ? entry.tabs : catTabs,
    sections: entry.sections.length > 0 ? entry.sections : catSections,
    fields: entry.fields && entry.fields.length > 0 ? entry.fields : catFields,
    buttons: entry.buttons && entry.buttons.length > 0 ? entry.buttons : catButtons,
    tables: entry.tables && entry.tables.length > 0 ? entry.tables : catTables
  };
}

/** Busca uma tela no catálogo Nível 1 pela cadeia exata de menu. */
export function findScreenCatalogEntryByChain(
  chain: string[],
  catalog = loadCachedScreenCatalog()
): ScreenCatalogEntry | null {
  if (!catalog || chain.length === 0) return null;
  return catalog.screens.find(s => Array.isArray(s.chain) && sameNormalizedChain(s.chain, chain)) ?? null;
}

/** Busca uma tela no catálogo Nível 1 por `routeHash` (ignorando query string e ID numérico final). */
export function findScreenCatalogEntryByHash(
  hash: string,
  catalog = loadCachedScreenCatalog()
): ScreenCatalogEntry | null {
  if (!catalog) return null;
  const want = cleanRouteHash(hash);
  if (!want) return null;
  return catalog.screens.find(s => cleanRouteHash(s.routeHash) === want) ?? null;
}

/** Busca uma rota mapeada no grafo pela cadeia exata de menu (`['Firmas', 'Cadastros', 'Cartão de assinatura']`), com fallback/enriquecimento do catálogo Nível 1. */
export function findRouteEntryByChain(
  chain: string[],
  graph?: OrionRouteGraph | null
): CrawledRouteEntry | null {
  if (chain.length === 0) return null;
  const effectiveGraph = graph === undefined ? loadCachedRouteGraph() : graph;
  const catalog = graph === undefined || testScreenCatalogOverride !== undefined ? loadCachedScreenCatalog() : null;
  const fromGraph = effectiveGraph?.entries.find(e => sameNormalizedChain(e.chain, chain));
  if (fromGraph) return enrichRouteEntryFromCatalog(fromGraph, catalog);
  const fromCatalog = findScreenCatalogEntryByChain(chain, catalog);
  return fromCatalog ? catalogEntryToRouteEntry(fromCatalog) : null;
}

/** Busca uma rota mapeada no grafo por `location.hash` (ignorando query string e ID numérico final), com fallback/enriquecimento do catálogo Nível 1. */
export function findRouteEntryByHash(
  hash: string,
  graph?: OrionRouteGraph | null
): CrawledRouteEntry | null {
  const want = cleanRouteHash(hash);
  if (!want) return null;
  const effectiveGraph = graph === undefined ? loadCachedRouteGraph() : graph;
  const catalog = graph === undefined || testScreenCatalogOverride !== undefined ? loadCachedScreenCatalog() : null;
  const fromGraph = effectiveGraph?.entries.find(e => cleanRouteHash(e.hash) === want);
  if (fromGraph) return enrichRouteEntryFromCatalog(fromGraph, catalog);
  const fromCatalog = findScreenCatalogEntryByHash(hash, catalog);
  return fromCatalog ? catalogEntryToRouteEntry(fromCatalog) : null;
}

const sameKeySet = (a: string[], b: string[]): boolean =>
  a.length > 0 && a.length === b.length && a.every((w, i) => w === b[i]);

function scoreHintLabel(query: string, label: string, baseExact: number, baseKey: number, baseSub: number): number {
  const qNorm = canonNormalize(query);
  const lNorm = canonNormalize(label);
  if (!qNorm || !lNorm) return 0;
  if (lNorm === qNorm) return baseExact;
  const qKey = leafKey(query);
  if (qKey.length > 0 && sameKeySet(qKey, leafKey(label))) return baseKey;
  if (qNorm.length >= 5 && ` ${lNorm} `.includes(` ${qNorm} `)) return baseSub;
  return 0;
}

/**
 * Busca pistas auxiliares no catálogo Nível 1 (`tabs`, `headings`, `buttons`, `fields`, `tables`, `pageTitle`).
 * Não substitui medição ao vivo; atua apenas como pista consultiva/auxiliar.
 */
export function findScreenCatalogHints(
  query: string,
  catalog = loadCachedScreenCatalog(),
  options: { moduloHint?: string; excludeHash?: string } = {}
): ScreenCatalogHint[] {
  if (!catalog) return [];
  const qNorm = canonNormalize(query);
  if (!qNorm) return [];
  const modHint = options.moduloHint ? canonNormalize(options.moduloHint) : '';
  const excludeHash = options.excludeHash ? cleanRouteHash(options.excludeHash) : '';

  const hints: ScreenCatalogHint[] = [];
  for (const entry of catalog.screens) {
    if (excludeHash && cleanRouteHash(entry.routeHash) === excludeHash) continue;

    let best: { matchedIn: ScreenCatalogHint['matchedIn']; matchedLabel: string; score: number } | null = null;
    const consider = (label: string, kind: ScreenCatalogHint['matchedIn'], weights: [number, number, number]) => {
      const s = scoreHintLabel(query, label, weights[0], weights[1], weights[2]);
      if (s > 0 && (!best || s > best.score)) {
        best = { matchedIn: kind, matchedLabel: label, score: s };
      }
    };

    for (const tab of extractCatalogLabels(entry.tabs)) consider(tab, 'tab', [1.0, 0.88, 0.8]);
    for (const h of extractCatalogLabels(entry.headings)) consider(h, 'heading', [0.95, 0.84, 0.76]);
    for (const b of extractCatalogLabels(entry.buttons)) consider(b, 'button', [0.92, 0.82, 0.74]);
    for (const f of extractCatalogLabels(entry.fields)) consider(f, 'field', [0.92, 0.82, 0.74]);
    for (const t of normalizeCatalogTableLabels(entry.tables)) consider(t, 'table', [0.9, 0.8, 0.72]);
    if (entry.pageTitle) consider(entry.pageTitle, 'title', [0.9, 0.8, 0.72]);

    if (best) {
      const chosen = best as { matchedIn: ScreenCatalogHint['matchedIn']; matchedLabel: string; score: number };
      const modBonus = modHint && canonNormalize(entry.modulo) === modHint ? 0.02 : 0;
      hints.push({
        entry,
        matchedIn: chosen.matchedIn,
        matchedLabel: chosen.matchedLabel,
        score: Number(Math.min(1, chosen.score + modBonus).toFixed(2))
      });
    }
  }

  return hints.sort((a, b) => b.score - a.score);
}

/**
 * Localiza rotas do grafo vivo (e, complementarmente, do catálogo Nível 1) cuja lista de abas, seções ou título corresponda ao termo procurado.
 * Útil como pista auxiliar para caminhos legados (onde a folha virou aba) e para sugestões em `[ATT]`.
 */
export function findRouteEntriesByTabOrSection(
  query: string,
  graph?: OrionRouteGraph | null,
  options: { moduloHint?: string; excludeHash?: string } = {}
): RouteGraphHint[] {
  const effectiveGraph = graph === undefined ? loadCachedRouteGraph() : graph;
  const catalog = graph === undefined || testScreenCatalogOverride !== undefined ? loadCachedScreenCatalog() : null;
  if (!effectiveGraph && !catalog) return [];
  const qNorm = canonNormalize(query);
  if (!qNorm) return [];
  const modHint = options.moduloHint ? canonNormalize(options.moduloHint) : '';
  const excludeHash = options.excludeHash ? cleanRouteHash(options.excludeHash) : '';

  const scoreLabel = (label: string, kind: RouteGraphHint['matchedIn']): number => {
    if (kind === 'tab') return scoreHintLabel(query, label, 1.0, 0.88, 0.8);
    if (kind === 'section') return scoreHintLabel(query, label, 0.95, 0.84, 0.76);
    return scoreHintLabel(query, label, 0.9, 0.8, 0.72);
  };

  const hints: RouteGraphHint[] = [];
  const seenChains = new Set<string>();

  const inspectEntry = (entry: CrawledRouteEntry) => {
    if (excludeHash && cleanRouteHash(entry.hash) === excludeHash) return;
    const chainKey = entry.chain.map(canonNormalize).join('>');
    if (seenChains.has(chainKey)) return;

    let best: { matchedIn: RouteGraphHint['matchedIn']; matchedLabel: string; score: number } | null = null;
    const consider = (label: string, kind: RouteGraphHint['matchedIn']) => {
      const s = scoreLabel(label, kind);
      if (s > 0 && (!best || s > best.score)) {
        best = { matchedIn: kind, matchedLabel: label, score: s };
      }
    };

    for (const tab of entry.tabs || []) consider(tab, 'tab');
    for (const sec of entry.sections || []) consider(sec, 'section');
    if (entry.title) consider(entry.title, 'title');

    if (best) {
      seenChains.add(chainKey);
      const chosen = best as { matchedIn: RouteGraphHint['matchedIn']; matchedLabel: string; score: number };
      const modBonus = modHint && canonNormalize(entry.modulo) === modHint ? 0.02 : 0;
      hints.push({
        entry: enrichRouteEntryFromCatalog(entry, catalog),
        matchedIn: chosen.matchedIn,
        matchedLabel: chosen.matchedLabel,
        score: Number(Math.min(1, chosen.score + modBonus).toFixed(2))
      });
    }
  };

  for (const entry of effectiveGraph?.entries || []) inspectEntry(entry);
  for (const s of catalog?.screens || []) inspectEntry(catalogEntryToRouteEntry(s));

  return hints.sort((a, b) => b.score - a.score);
}

export interface CrawlOptions {
  outputPath?: string;
  maxRoutes?: number;
  settleMs?: number;
}

/**
 * Percorre em modo somente-leitura todas as folhas ativas do menu superior do Orion TN,
 * extrai `location.hash`, título, abas e seções de cada tela alcançada e grava `orion-route-graph.json`.
 */
export async function crawlOrionRouteGraph(
  client: AgentBrowserClient,
  options: CrawlOptions = {}
): Promise<OrionRouteGraph> {
  const { buildMenuTreeScript, openCascadeWithPointer, parseMenuTreeResponse } = await import('./menu-path.js');
  const { buildScreenInventoryScript, parseScreenInventory } = await import('./att-screen-advisor.js');
  const { closeActiveModals } = await import('./modal-scope.js');

  const outputPath = options.outputPath ?? ORION_ROUTE_GRAPH_FILE;
  const settleMs = options.settleMs ?? 800;

  await client.ensureViewport(config.viewportWidth, config.viewportHeight);
  await closeActiveModals(client).catch(() => undefined);
  await client.jumpHash('#/inicio');
  await client.waitForNetworkIdle({ timeoutMs: 3500 }).catch(() => undefined);
  await client.wait(settleMs);

  const items = parseMenuTreeResponse(await client.eval(buildMenuTreeScript()));
  if (items.length === 0) {
    throw new Error('Árvore de navegação vazia: não foi possível ler os menus do Orion TN.');
  }

  const leaves = items.filter(i => !i.disabled && !i.hasChildren && i.chain.length >= 2);
  const targets = options.maxRoutes && options.maxRoutes > 0 ? leaves.slice(0, options.maxRoutes) : leaves;
  console.log(`[Crawl Map] ${items.length} itens de menu lidos; ${targets.length} rota(s) folha(s) serão mapeadas em modo somente-leitura.`);

  const entries: CrawledRouteEntry[] = [];
  for (let idx = 0; idx < targets.length; idx++) {
    const target = targets[idx];
    const label = target.chain.join(' > ');
    try {
      await closeActiveModals(client).catch(() => undefined);
      await client.closeSecondaryTabs().catch(() => undefined);
      await client.jumpHash('#/inicio');
      await client.wait(350);

      // Re-lê e carimba a árvore antes da cascata para garantir seletores vivos no DOM atual
      const liveItems = parseMenuTreeResponse(await client.eval(buildMenuTreeScript()));
      const liveItem = liveItems.find(i => sameNormalizedChain(i.chain, target.chain) && !i.disabled);
      if (!liveItem || liveItem.selectors.length === 0) {
        console.warn(`   ⚠ [Crawl Map] (${idx + 1}/${targets.length}) "${label}" indisponível no DOM atual; pulando.`);
        continue;
      }

      const cascade = await openCascadeWithPointer(client, liveItem.selectors);
      if (!cascade) {
        console.warn(`   ⚠ [Crawl Map] (${idx + 1}/${targets.length}) cascata não estabilizou para "${label}".`);
        continue;
      }

      const leafSelector = liveItem.selectors[liveItem.selectors.length - 1];
      const { openedTab } = await client.withNewTabDetection(() => client.click(leafSelector), 1500);
      await client.waitForNetworkIdle({ timeoutMs: 4000, idleMs: 250 }).catch(() => undefined);
      await client.wait(settleMs);

      const rawInv = await client.evalJson<unknown>(buildScreenInventoryScript());
      const inv = parseScreenInventory(rawInv);

      entries.push({
        modulo: target.chain[0],
        chain: target.chain,
        hash: inv?.route || (openedTab ? openedTab.url : ''),
        title: inv?.title || (openedTab ? openedTab.title : ''),
        tabs: (inv?.tabs || []).map(t => t.label),
        sections: inv?.sections || [],
        fields: (inv?.fields || []).map(f => f.label),
        buttons: (inv?.buttons || []).map(b => b.label)
      });

      console.log(
        `   ✓ [Crawl Map] (${idx + 1}/${targets.length}) ${label} -> ${inv?.route || '(sem hash)'} | ${(inv?.tabs || []).length} aba(s), ${(inv?.sections || []).length} seção(ões)`
      );

      await closeActiveModals(client).catch(() => undefined);
      if (openedTab) {
        await client.closeSecondaryTabs().catch(() => undefined);
      }
    } catch (err: any) {
      console.warn(`   ⚠ [Crawl Map] Erro ao mapear "${label}": ${err?.message || err}`);
    }
  }

  const graph: OrionRouteGraph = {
    capturedAt: new Date().toISOString(),
    environment: config.envLabel || process.env.ORION_ENV_LABEL || 'Produtos',
    totalMenus: items.length,
    totalRoutes: entries.length,
    entries
  };

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, JSON.stringify(graph, null, 2), 'utf-8');
  console.log(`\n✓ [Crawl Map] Grafo salvo com ${entries.length} rota(s) em ${path.relative(config.rootDir, outputPath)}`);
  return graph;
}
