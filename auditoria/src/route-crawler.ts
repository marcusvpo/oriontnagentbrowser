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

export interface CrawledRouteEntry {
  modulo: string;
  chain: string[];
  hash: string;
  title: string;
  tabs: string[];
  sections: string[];
  fields?: string[];
  buttons?: string[];
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

/** Injeção determinística para testes unitários offline; `undefined` restaura a leitura de disco. */
export function setRouteGraphForTesting(graph: OrionRouteGraph | null | undefined): void {
  testRouteGraphOverride = graph;
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

const sameNormalizedChain = (a: string[], b: string[]) =>
  a.length === b.length && a.every((s, i) => canonNormalize(s) === canonNormalize(b[i]));

const cleanRouteHash = (hash: string) =>
  String(hash || '')
    .split('?')[0]
    .replace(/\/\d+$/, '')
    .trim()
    .toLowerCase();

/** Busca uma rota mapeada no grafo pela cadeia exata de menu (`['Firmas', 'Cadastros', 'Cartão de assinatura']`). */
export function findRouteEntryByChain(
  chain: string[],
  graph = loadCachedRouteGraph()
): CrawledRouteEntry | null {
  if (!graph || chain.length === 0) return null;
  return graph.entries.find(e => sameNormalizedChain(e.chain, chain)) ?? null;
}

/** Busca uma rota mapeada no grafo por `location.hash` (ignorando query string e ID numérico final). */
export function findRouteEntryByHash(
  hash: string,
  graph = loadCachedRouteGraph()
): CrawledRouteEntry | null {
  if (!graph) return null;
  const want = cleanRouteHash(hash);
  if (!want) return null;
  return graph.entries.find(e => cleanRouteHash(e.hash) === want) ?? null;
}

const sameKeySet = (a: string[], b: string[]): boolean =>
  a.length > 0 && a.length === b.length && a.every((w, i) => w === b[i]);

/**
 * Localiza rotas do grafo vivo cuja lista de abas, seções ou título corresponda ao termo procurado.
 * Útil como pista auxiliar para caminhos legados (onde a folha virou aba) e para sugestões em `[ATT]`.
 */
export function findRouteEntriesByTabOrSection(
  query: string,
  graph = loadCachedRouteGraph(),
  options: { moduloHint?: string; excludeHash?: string } = {}
): RouteGraphHint[] {
  if (!graph) return [];
  const qNorm = canonNormalize(query);
  if (!qNorm) return [];
  const qKey = leafKey(query);
  const modHint = options.moduloHint ? canonNormalize(options.moduloHint) : '';
  const excludeHash = options.excludeHash ? cleanRouteHash(options.excludeHash) : '';

  const scoreLabel = (label: string, kind: RouteGraphHint['matchedIn']): number => {
    const lNorm = canonNormalize(label);
    if (!lNorm) return 0;
    if (lNorm === qNorm) {
      return kind === 'tab' ? 1.0 : kind === 'section' ? 0.95 : 0.9;
    }
    if (qKey.length > 0 && sameKeySet(qKey, leafKey(label))) {
      return kind === 'tab' ? 0.88 : kind === 'section' ? 0.84 : 0.8;
    }
    if (qNorm.length >= 5 && ` ${lNorm} `.includes(` ${qNorm} `)) {
      return kind === 'tab' ? 0.8 : kind === 'section' ? 0.76 : 0.72;
    }
    return 0;
  };

  const hints: RouteGraphHint[] = [];
  for (const entry of graph.entries) {
    if (excludeHash && cleanRouteHash(entry.hash) === excludeHash) continue;

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
      const chosen = best as { matchedIn: RouteGraphHint['matchedIn']; matchedLabel: string; score: number };
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
