import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureAuthenticated } from './auth.js';
import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { captureTrueFullPage } from './fullpage-capture.js';
import { canonNormalize, isUserMenuRootLabel } from './menu-canonical.js';
import { buildMenuTreeScript, openCascadeWithPointer, parseMenuTreeResponse, type MenuTreeItem } from './menu-path.js';
import { ACTIVE_MODAL_SELECTOR, closeActiveModals, countActiveModals } from './modal-scope.js';
import { preflightOrionReachability } from './preflight.js';
import {
  buildFailedScreenEntry,
  buildOrionScreenCatalog,
  buildScreenDomExtractionScript,
  buildSkippedScreenEntry,
  DEFAULT_SCREEN_CATALOG_PATH,
  DEFAULT_SCREENSHOTS_DIR,
  filterScreenTargets,
  loadCanonicalMenuCatalog,
  mergeCatalogEntries,
  normalizeExtractedScreen,
  prepareScreenTargets,
  type OrionScreenCatalog,
  type RawScreenDomExtraction,
  type ScreenCatalogEntry,
  type ScreenOpenedAs,
  type ScreenTarget
} from './screen-catalog-extractor.js';

export interface MapScreensCliOptions {
  module?: string;
  only?: string;
  resume: boolean;
  max?: number;
  timeoutMs: number;
}

/**
 * Faz o parse das flags de linha de comando:
 * --module=<Nome>, --only=<slug-ou-indice>, --resume, --max=<N>, --timeout=<ms>
 */
export function parseCliFlags(argv: string[]): MapScreensCliOptions {
  const opts: MapScreensCliOptions = {
    resume: false,
    timeoutMs: 90000
  };

  for (const arg of argv) {
    if (arg === '--resume') {
      opts.resume = true;
    } else if (arg.startsWith('--module=')) {
      opts.module = arg.slice('--module='.length).trim();
    } else if (arg.startsWith('--only=')) {
      opts.only = arg.slice('--only='.length).trim();
    } else if (arg.startsWith('--max=')) {
      const n = parseInt(arg.slice('--max='.length), 10);
      if (Number.isFinite(n) && n > 0) opts.max = n;
    } else if (arg.startsWith('--timeout=')) {
      const ms = parseInt(arg.slice('--timeout='.length), 10);
      if (Number.isFinite(ms) && ms > 0) opts.timeoutMs = ms;
    }
  }

  return opts;
}

function readExistingCatalog(catalogPath: string): OrionScreenCatalog | null {
  if (!fs.existsSync(catalogPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(catalogPath, 'utf-8')) as OrionScreenCatalog;
  } catch {
    return null;
  }
}

function writeCatalogCheckpoint(
  catalogPath: string,
  entries: ScreenCatalogEntry[],
  totalCanonicalPaths: number
): OrionScreenCatalog {
  const dir = path.dirname(catalogPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const catalog = buildOrionScreenCatalog(entries, { totalCanonicalPaths });
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
  return catalog;
}

async function waitForOrionLoaders(client: AgentBrowserClient, maxWaitMs = 8000): Promise<void> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const busy = await client.evalJson<boolean>(`
      (() => {
        const vis = e => {
          if (!e || !e.getBoundingClientRect) return false;
          const r = e.getBoundingClientRect();
          const s = window.getComputedStyle(e);
          return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
        };
        const loaders = Array.from(document.querySelectorAll('.loading, .spinner, .blockUI, .ngx-spinner'));
        return JSON.stringify(loaders.some(vis));
      })()
    `);
    if (!busy) return;
    await client.wait(250);
  }
}

function findLiveMenuItem(items: MenuTreeItem[], target: ScreenTarget): MenuTreeItem | null {
  if (target.navigationKind === 'user_menu') {
    const leafNorm = canonNormalize(target.chain[target.chain.length - 1] || '');
    return (
      items.find(
        it =>
          it.chain.length === target.chain.length &&
          isUserMenuRootLabel(it.chain[0] || '') &&
          canonNormalize(it.chain[it.chain.length - 1] || '') === leafNorm
      ) || null
    );
  }

  return (
    items.find(
      it =>
        it.chain.length === target.chain.length &&
        it.chain.every((seg, i) => canonNormalize(seg) === canonNormalize(target.chain[i] || ''))
    ) || null
  );
}

async function captureFullPageScreenshot(
  client: AgentBrowserClient,
  fullAbsPath: string
): Promise<boolean> {
  try {
    const res = await captureTrueFullPage(client, fullAbsPath, { onlyIfOverflow: true });
    return res.captured && res.tallerThanViewport;
  } catch {
    return false;
  }
}

function checkDeadline(deadline: number, timeoutMs: number, label: string): void {
  if (Date.now() > deadline) {
    throw new Error(`Timeout (${timeoutMs}ms) em ${label}`);
  }
}

function classifyOpenedAs(
  openedTabUrl: string | null,
  modalOpen: boolean,
  routeHash: string
): ScreenOpenedAs {
  if (openedTabUrl) {
    try {
      const tabOrigin = new URL(openedTabUrl).origin;
      const appOrigin = config.appHomeUrl ? new URL(config.appHomeUrl).origin : '';
      if (appOrigin && tabOrigin !== appOrigin) return 'external';
    } catch {
      // ignora URL relativa
    }
    return 'new_tab';
  }
  if (modalOpen) return 'modal';
  const cleanHash = (routeHash || '').split('?')[0].replace(/\/+$/, '').toLowerCase();
  if (cleanHash && cleanHash !== '#/inicio' && cleanHash !== '#/home' && cleanHash !== '#') {
    return 'route';
  }
  return 'same_route';
}

async function mapSingleScreen(
  client: AgentBrowserClient,
  target: ScreenTarget,
  timeoutMs: number,
  getMenuItems: (forceRefresh?: boolean) => Promise<MenuTreeItem[]>,
  needsCleanup: boolean
): Promise<ScreenCatalogEntry> {
  if (target.navigationKind === 'skipped_logout') {
    return buildSkippedScreenEntry(target, 'logout_safety_block');
  }

  const label = `${target.id} (${target.chain.join(' > ')})`;
  const deadline = Date.now() + timeoutMs;

  if (needsCleanup) {
    await closeActiveModals(client).catch(() => undefined);
    await client.closeSecondaryTabs().catch(() => undefined);
  }
  checkDeadline(deadline, timeoutMs, label);

  await client.jumpHash('#/inicio');
  await client.wait(400);
  checkDeadline(deadline, timeoutMs, label);

  let items = await getMenuItems(false);
  let liveItem = findLiveMenuItem(items, target);
  if (!liveItem) {
    items = await getMenuItems(true);
    liveItem = findLiveMenuItem(items, target);
  }
  if (!liveItem) {
    return buildFailedScreenEntry(target, `Item de menu não encontrado na árvore viva: ${target.chain.join(' > ')}`);
  }
  if (liveItem.disabled) {
    return buildFailedScreenEntry(
      target,
      `Item de menu desabilitado pela aplicação: ${liveItem.blockTitle || target.chain.join(' > ')}`
    );
  }
  checkDeadline(deadline, timeoutMs, label);

  const clickLeafViaDom = async (leafSel: string) => {
    const clicked = await client.evalJson<boolean>(
      `(() => { const el = document.querySelector(${JSON.stringify(leafSel)}); if (!el) return JSON.stringify(false); el.click(); return JSON.stringify(true); })()`
    );
    if (!clicked) {
      throw new Error(`Elemento de menu não encontrado no DOM para clique: ${leafSel}`);
    }
  };

  const { openedTab } = await client.withNewTabDetection(async () => {
    if (target.navigationKind === 'direct_top' || liveItem!.selectors.length === 1) {
      await clickLeafViaDom(liveItem!.selectors[0]);
      return;
    }
    let cascade = await openCascadeWithPointer(client, liveItem!.selectors);
    if (!cascade) {
      // Fallback: re-lê a árvore viva caso o navbar tenha sido re-renderizado
      items = await getMenuItems(true);
      const refreshed = findLiveMenuItem(items, target);
      if (refreshed) {
        liveItem = refreshed;
        cascade = await openCascadeWithPointer(client, liveItem.selectors);
      }
    }
    if (cascade) {
      await clickLeafViaDom(liveItem!.selectors[liveItem!.selectors.length - 1]);
      return;
    }
    if (target.navigationKind === 'user_menu' && liveItem!.selectors.length === 2) {
      await client.click(liveItem!.selectors[0]);
      await client.wait(350);
      await clickLeafViaDom(liveItem!.selectors[1]);
      return;
    }
    throw new Error(`Falha ao abrir cascata de menu para: ${target.chain.join(' > ')}`);
  }, 1200);

  // Move o ponteiro para fora do menu e remove foco do navbar para fechar qualquer dropdown :hover aberto
  await client.mouseMove(2, 2).catch(() => undefined);
  await client
    .eval(
      '(() => { const a = document.activeElement; if (a && a.closest && a.closest(".navbar, nav") && a.blur) a.blur(); return true; })()'
    )
    .catch(() => undefined);
  checkDeadline(deadline, timeoutMs, label);

  await waitForOrionLoaders(client, Math.min(6000, Math.max(1000, deadline - Date.now())));
  await client.waitForNetworkIdle({ timeoutMs: Math.min(4000, Math.max(1000, deadline - Date.now())), idleMs: 250 });
  await client.wait(800);
  checkDeadline(deadline, timeoutMs, label);

  const extractionScript = buildScreenDomExtractionScript(NAV_ZONE_SELECTOR, ACTIVE_MODAL_SELECTOR);
  const raw = await client.evalJson<RawScreenDomExtraction>(extractionScript);
  if (!raw) {
    return buildFailedScreenEntry(target, 'Falha ao extrair metadados do DOM (retorno nulo)');
  }

  const modalCount = await countActiveModals(client).catch(() => 0);
  const openedAs = classifyOpenedAs(
    openedTab?.url ?? null,
    modalCount > 0 || Boolean(raw.openedAsModal),
    raw.routeHash
  );

  const moduleDir = path.join(DEFAULT_SCREENSHOTS_DIR, target.moduloSlug);
  if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });

  const baseFileName = `${target.id}-${target.slug}`;
  const viewportAbs = path.join(moduleDir, `${baseFileName}.png`);
  const viewportRel = `auditoria/mapeamento-telas/nivel-1/${target.moduloSlug}/${baseFileName}.png`;
  await client.screenshot(viewportAbs);

  let fullPageRel: string | null = null;
  if (raw.scrollMetrics?.hasVerticalOverflow) {
    const fullAbs = path.join(moduleDir, `${baseFileName}-full.png`);
    const ok = await captureFullPageScreenshot(client, fullAbs);
    if (ok) {
      fullPageRel = `auditoria/mapeamento-telas/nivel-1/${target.moduloSlug}/${baseFileName}-full.png`;
    }
  }

  return normalizeExtractedScreen(target, raw, {
    openedAs,
    screenshots: {
      viewport: viewportRel,
      fullPage: fullPageRel
    }
  });
}

export async function runLevel1Mapping(argv = process.argv.slice(2)): Promise<OrionScreenCatalog> {
  const cli = parseCliFlags(argv);
  console.log('=== Mapeamento de Telas Nível 1 — Orion TN 06.05.02 (Somente Leitura) ===');

  const menuCatalog = loadCanonicalMenuCatalog();
  const allTargets = prepareScreenTargets(menuCatalog);
  const existingCatalog = cli.resume ? readExistingCatalog(DEFAULT_SCREEN_CATALOG_PATH) : null;
  const targets = filterScreenTargets(allTargets, {
    module: cli.module,
    only: cli.only,
    max: cli.max,
    resumeCatalog: existingCatalog
  });

  console.log(
    `Alvos carregados: ${allTargets.length} canônicos | Selecionados nesta execução: ${targets.length} (timeout=${cli.timeoutMs}ms)`
  );

  const onlySkipped = targets.every(t => t.navigationKind === 'skipped_logout');
  let entries: ScreenCatalogEntry[] = existingCatalog?.screens ?? [];

  if (targets.length === 0) {
    return writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, allTargets.length);
  }

  let client: AgentBrowserClient | null = null;
  const sessionId = 'screens-map-l1';

  let cachedMenuItems: MenuTreeItem[] | null = null;
  const getMenuItems = async (forceRefresh = false): Promise<MenuTreeItem[]> => {
    if (!forceRefresh && cachedMenuItems && cachedMenuItems.length > 0) {
      const sampleSel = cachedMenuItems[0]?.selectors?.[0];
      if (sampleSel) {
        const alive = await client!.evalJson<boolean>(
          `JSON.stringify(Boolean(document.querySelector(${JSON.stringify(sampleSel)})))`
        );
        if (alive) return cachedMenuItems;
      }
    }
    cachedMenuItems = parseMenuTreeResponse(await client!.eval(buildMenuTreeScript()));
    return cachedMenuItems;
  };

  if (!onlySkipped) {
    await preflightOrionReachability();
    client = new AgentBrowserClient({
      headless: config.headless,
      sessionId,
      deviceScaleFactor: 1,
      zoom: config.browserZoom
    });
    const authed = await ensureAuthenticated(client);
    if (!authed) {
      throw new Error('Falha na autenticação WildFly SSO antes do mapeamento Nível 1.');
    }
    const viewportCorrected = await client.ensureViewport(config.viewportWidth, config.viewportHeight);
    if (viewportCorrected) {
      await client.applyZoom(config.browserZoom);
    }
    await client.markPrimaryTab();
    await client.jumpHash('#/inicio');
    await waitForOrionLoaders(client, 4000);
    await getMenuItems(true);
  }

  try {
    let prevNeedsCleanup = false;
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      console.log(`[${i + 1}/${targets.length}] ${target.id} ${target.chain.join(' > ')} (${target.navigationKind})`);

      let entry: ScreenCatalogEntry;
      try {
        entry = await mapSingleScreen(client!, target, cli.timeoutMs, getMenuItems, prevNeedsCleanup);
      } catch (err: any) {
        entry = buildFailedScreenEntry(target, String(err?.message || err || 'Erro desconhecido'));
      }

      prevNeedsCleanup =
        entry.status === 'failed' ||
        entry.openedAs === 'modal' ||
        entry.openedAs === 'new_tab' ||
        entry.openedAs === 'external';

      entries = mergeCatalogEntries(entries, [entry]);
      writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, allTargets.length);

      const icon = entry.status === 'captured' ? '✓' : entry.status === 'skipped' ? '⊘' : '✗';
      console.log(
        `  ${icon} ${entry.status} | openedAs=${entry.openedAs} | hash=${entry.routeHash || '-'} | btns=${entry.elementCounts.buttons} fields=${entry.elementCounts.fields}` +
          (entry.error ? ` | ${entry.error}` : '')
      );
    }
  } finally {
    if (client) {
      await client.closeSecondaryTabs().catch(() => undefined);
      await closeActiveModals(client).catch(() => undefined);
      await client.close().catch(() => undefined);
    }
  }

  const finalCatalog = writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, allTargets.length);
  console.log(
    `=== Concluído: captured=${finalCatalog.stats.captured}, failed=${finalCatalog.stats.failed}, skipped=${finalCatalog.stats.skipped} ===`
  );
  return finalCatalog;
}

const isMainModule =
  typeof process.argv[1] === 'string' &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  runLevel1Mapping().catch(err => {
    console.error('Erro fatal no mapeamento Nível 1:', err);
    process.exitCode = 1;
  });
}
