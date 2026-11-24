/**
 * Captura limpa e exaustiva de screenshots de TODOS os menus pai, submenus e sub-submenus
 * abertos na Home (`#/inicio`) do Orion TN, sem navegar para nenhuma tela interna.
 *
 * Uso:
 *   npx --prefix auditoria tsx auditoria/src/capture-all-menu-prints.ts
 *
 * Saída:
 *   auditoria/mapeamento-menus/00-home-barra-menus.png
 *   auditoria/mapeamento-menus/01-...png
 *   auditoria/mapeamento-menus/manifest.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';
import { config } from './config.js';
import { buildMenuTreeScript, parseMenuTreeResponse, type MenuTreeItem } from './menu-path.js';
import { preflightOrionReachability } from './preflight.js';

interface CascadeRect {
  vis: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  ul?: { x: number; y: number; r: number; b: number };
}

interface MenuCaptureEntry {
  file: string;
  chain: string[];
  depth: number;
  status: 'captured' | 'failed';
  ulBounds?: { x: number; y: number; r: number; b: number };
  clippedBottom?: boolean;
  directChildren: string[];
  error?: string;
}

interface MenuMappingManifest {
  capturedAt: string;
  environment: string;
  viewport: { width: number; height: number };
  zoom: number;
  totalTargets: number;
  totalCaptured: number;
  totalFailed: number;
  rootDirectLinks: Array<{ chain: string[]; disabled: boolean }>;
  captures: MenuCaptureEntry[];
}

const OUTPUT_DIR = path.join(config.rootDir, 'auditoria', 'mapeamento-menus');
const MAX_ATTEMPTS = 3;

function slugify(value: string): string {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'menu';
}

function buildCaptureFileName(index: number, chain: string[]): string {
  const prefix = String(index).padStart(2, '0');
  const slugChain = chain.map(slugify).join('__');
  return `${prefix}-${slugChain}.png`;
}

const centerX = (r: CascadeRect): number => r.x + Math.round(r.w / 2);
const centerY = (r: CascadeRect): number => r.y + Math.round(r.h / 2);

async function readCascade(client: AgentBrowserClient, selectors: string[]): Promise<CascadeRect[] | null> {
  return client.evalJson<CascadeRect[]>(`
    (() => {
      const vis = e => {
        if (!e) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      return JSON.stringify(${JSON.stringify(selectors)}.map(sel => {
        const a = document.querySelector(sel);
        if (!a) return { vis: false, x: 0, y: 0, w: 0, h: 0 };
        const r = a.getBoundingClientRect();
        const out = {
          vis: vis(a),
          x: Math.round(r.left),
          y: Math.round(r.top),
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
        const ul = a.parentElement ? Array.from(a.parentElement.children).find(c => c.tagName === 'UL') : null;
        if (ul && vis(ul)) {
          const u = ul.getBoundingClientRect();
          out.ul = { x: Math.round(u.left), y: Math.round(u.top), r: Math.round(u.right), b: Math.round(u.bottom) };
        }
        return out;
      }));
    })()
  `);
}

async function prepareCleanHome(client: AgentBrowserClient): Promise<boolean> {
  await client.mouseMove(10, 880).catch(() => undefined);
  await client.pressKey('Escape').catch(() => undefined);
  await client
    .eval(`
      (() => {
        document.querySelectorAll('.navbar .open, .navbar .dropdown.open, .navbar li.open').forEach(el => {
          el.classList.remove('open');
        });
        document.querySelectorAll('.navbar a[aria-expanded="true"]').forEach(a => {
          a.setAttribute('aria-expanded', 'false');
        });
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        return true;
      })()
    `)
    .catch(() => undefined);
  await client.wait(300);

  const curHash = await client.evalJson<string>('JSON.stringify(window.location.hash || "")');
  if (!curHash || !curHash.startsWith('#/inicio')) {
    console.warn(`   ⚠ Saiu da Home (${curHash || 'sem hash'}); restaurando #/inicio...`);
    await client.jumpHash('#/inicio');
    await client.wait(2000);
    await client.applyZoom(config.browserZoom);
    return true;
  }
  return false;
}

async function loadMenuTree(client: AgentBrowserClient): Promise<MenuTreeItem[]> {
  const raw = await client.eval(buildMenuTreeScript());
  const items = parseMenuTreeResponse(raw);
  if (items.length === 0) {
    throw new Error('Árvore de navegação vazia: a barra de menus não foi lida.');
  }
  return items;
}

function getDirectChildren(allItems: MenuTreeItem[], chain: string[]): string[] {
  const seenSelectors = new Set<string>();
  const children: string[] = [];
  for (const item of allItems) {
    if (item.chain.length !== chain.length + 1) continue;
    if (!chain.every((seg, idx) => item.chain[idx] === seg)) continue;
    const key = item.selectors.join('|');
    if (seenSelectors.has(key)) continue;
    seenSelectors.add(key);
    children.push(item.chain[item.chain.length - 1]);
  }
  return children;
}

async function openParentMenuForPrint(
  client: AgentBrowserClient,
  selectors: string[],
  chain: string[],
  outFile: string
): Promise<{ ok: boolean; ulBounds?: { x: number; y: number; r: number; b: number }; error?: string }> {
  const last = selectors.length - 1;
  const label = chain.join(' > ');
  let lastReason = 'Cascata não abriu após 3 tentativas';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) {
      await prepareCleanHome(client);
    }

    let rects = await readCascade(client, selectors);
    if (!rects || !rects[0]?.vis) {
      lastReason = 'Menu raiz não visível no DOM';
      continue;
    }

    // Nível 0: menu pai abre por clique (só clica se a lista filha ainda estiver fechada).
    for (let tries = 0; tries < 3 && !rects[0]?.ul; tries++) {
      try {
        await client.click(selectors[0]);
      } catch (err: any) {
        lastReason = `Falha ao clicar no menu raiz: ${err?.message || err}`;
      }
      await client.wait(400);
      rects = (await readCascade(client, selectors)) || rects;
    }

    if (!rects[0]?.ul) {
      lastReason = `Dropdown do menu raiz "${chain[0]}" não abriu`;
      continue;
    }

    // Níveis 1..last: percorre a cascata por hover dentro de li ∪ ul até abrir a lista filha do alvo.
    let ok = true;
    for (let i = 1; i <= last; i++) {
      rects = (await readCascade(client, selectors)) || rects;
      const item = rects[i];
      if (!item?.vis) {
        lastReason = `Submenu nível ${i + 1} ("${chain[i]}") não ficou visível`;
        ok = false;
        break;
      }

      if (i === 1) {
        await client.mouseMove(centerX(item), centerY(item));
      } else {
        const prev = rects[i - 1];
        const prevUl = prev?.ul;
        const y0 = centerY(prev);
        if (prevUl && y0 > prevUl.y && y0 < prevUl.b) {
          const enterX =
            prevUl.r <= prev.x + 2
              ? prevUl.r - 8
              : prevUl.x >= prev.x + prev.w - 2
                ? prevUl.x + 8
                : centerX(item);
          await client.mouseMove(enterX, y0);
          await client.mouseMove(enterX, centerY(item));
        }
        await client.mouseMove(centerX(item), centerY(item));
      }

      await client.wait(300);
      rects = (await readCascade(client, selectors)) || rects;

      if (!rects[i]?.ul) {
        for (const fallback of [() => client.hover(selectors[i]), () => client.focus(selectors[i])]) {
          try {
            await fallback();
          } catch {
            // tenta próximo fallback
          }
          await client.wait(300);
          rects = (await readCascade(client, selectors)) || rects;
          if (rects[i]?.ul) break;
        }
      }

      if (!rects[i]?.ul) {
        lastReason = `Lista filha do submenu "${chain.slice(0, i + 1).join(' > ')}" não abriu`;
        ok = false;
        break;
      }
    }

    if (!ok) continue;

    await client.wait(300);
    const settled = await readCascade(client, selectors);
    const settledUl = settled?.[last]?.ul;
    if (!settled || !settled.every(r => r.vis) || !settledUl) {
      lastReason = `Cascata de "${label}" fechou antes da captura`;
      continue;
    }

    if (settledUl.b > config.viewportHeight) {
      console.warn(
        `   ⚠ [Recorte Vertical] "${label}" atinge y=${settledUl.b}px (viewport ${config.viewportHeight}px).`
      );
    }

    await client.screenshot(outFile);

    const after = await readCascade(client, selectors);
    if (!after || !after.every(r => r.vis) || !after[last]?.ul) {
      lastReason = `Cascata de "${label}" fechou durante a captura`;
      console.warn(`   ⚠ "${label}" fechou no instante da captura (tentativa ${attempt}/${MAX_ATTEMPTS}); repetindo...`);
      continue;
    }

    return { ok: true, ulBounds: settledUl };
  }

  return { ok: false, error: lastReason };
}

async function clearOutputDirectory(): Promise<void> {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
  const entries = await fs.promises.readdir(OUTPUT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith('.png') || entry.name === 'manifest.json')) {
      await fs.promises.unlink(path.join(OUTPUT_DIR, entry.name));
    }
  }
}

async function main(): Promise<void> {
  await preflightOrionReachability();
  await clearOutputDirectory();

  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'capture-all-menu-prints',
    deviceScaleFactor: 1,
    zoom: config.browserZoom
  });

  try {
    await client.open('about:blank');
    await client.setViewport(config.viewportWidth, config.viewportHeight);
    if (!(await ensureAuthenticated(client))) {
      throw new Error('Sessão não autenticada: execute --login antes.');
    }

    if (config.appHomeUrl) {
      await client.open(config.appHomeUrl);
    }
    await client.wait(2500);
    await client.jumpHash('#/inicio');
    await client.wait(2000);
    await client.applyZoom(config.browserZoom);

    const homeFile = path.join(OUTPUT_DIR, '00-home-barra-menus.png');
    await client.screenshot(homeFile);
    console.log(`✓ [00] Home limpa capturada: ${path.relative(config.rootDir, homeFile)}`);

    let allItems = await loadMenuTree(client);

    // Deduplica por selectors.join('|') preservando DFS pré-ordem da árvore real.
    const seenTargetKeys = new Set<string>();
    const targets: MenuTreeItem[] = [];
    for (const item of allItems) {
      if (!item.hasChildren || item.disabled) continue;
      const key = item.selectors.join('|');
      if (seenTargetKeys.has(key)) continue;
      seenTargetKeys.add(key);
      targets.push(item);
    }

    const seenRootDirectKeys = new Set<string>();
    const rootDirectLinks: Array<{ chain: string[]; disabled: boolean }> = [];
    for (const item of allItems) {
      if (item.chain.length !== 1 || item.hasChildren) continue;
      const key = item.selectors.join('|');
      if (seenRootDirectKeys.has(key)) continue;
      seenRootDirectKeys.add(key);
      rootDirectLinks.push({ chain: item.chain, disabled: item.disabled });
    }

    console.log(
      `📋 [Mapeamento] ${targets.length} menus pai/submenus para capturar; ` +
        `${rootDirectLinks.length} links raiz diretos preservados sem clique (${rootDirectLinks.map(r => r.chain[0]).join(', ') || 'nenhum'}).`
    );

    const captures: MenuCaptureEntry[] = [];

    for (let idx = 0; idx < targets.length; idx++) {
      const target = targets[idx];
      const fileName = buildCaptureFileName(idx + 1, target.chain);
      const outFile = path.join(OUTPUT_DIR, fileName);

      const reloadedHome = await prepareCleanHome(client);
      if (reloadedHome) {
        allItems = await loadMenuTree(client);
      }

      // Reencontra os seletores atuais pelo chain caso a Home tenha sido recarregada
      const liveItem =
        allItems.find(
          item =>
            item.hasChildren &&
            !item.disabled &&
            item.chain.length === target.chain.length &&
            item.chain.every((seg, k) => seg === target.chain[k])
        ) ?? target;

      const directChildren = getDirectChildren(allItems, liveItem.chain);
      const result = await openParentMenuForPrint(client, liveItem.selectors, liveItem.chain, outFile);

      if (result.ok) {
        const clippedBottom = Boolean(result.ulBounds && result.ulBounds.b > config.viewportHeight);
        captures.push({
          file: fileName,
          chain: liveItem.chain,
          depth: liveItem.chain.length,
          status: 'captured',
          ulBounds: result.ulBounds,
          clippedBottom,
          directChildren
        });
        console.log(
          `✓ [${String(idx + 1).padStart(2, '0')}/${String(targets.length).padStart(2, '0')}] ` +
            `${liveItem.chain.join(' > ')} (${directChildren.length} subitens) -> ${fileName}`
        );
      } else {
        captures.push({
          file: fileName,
          chain: liveItem.chain,
          depth: liveItem.chain.length,
          status: 'failed',
          directChildren,
          error: result.error || 'Falha desconhecida'
        });
        console.error(
          `✗ [${String(idx + 1).padStart(2, '0')}/${String(targets.length).padStart(2, '0')}] ` +
            `${liveItem.chain.join(' > ')} FALHOU: ${result.error}`
        );
      }
    }

    const totalCaptured = captures.filter(c => c.status === 'captured').length;
    const totalFailed = captures.filter(c => c.status === 'failed').length;

    const manifest: MenuMappingManifest = {
      capturedAt: new Date().toISOString(),
      environment: config.envLabel,
      viewport: { width: config.viewportWidth, height: config.viewportHeight },
      zoom: config.browserZoom,
      totalTargets: targets.length,
      totalCaptured,
      totalFailed,
      rootDirectLinks,
      captures
    };

    const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(
      `\n✅ Concluído: ${totalCaptured}/${targets.length} prints capturadas (${totalFailed} falhas). ` +
        `Manifesto salvo em ${path.relative(config.rootDir, manifestPath)}`
    );

    if (totalFailed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await client.close().catch(() => undefined);
  }
}

if (process.argv[1] && /capture-all-menu-prints\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) {
  main().catch(err => {
    console.error(`✗ [Mapeamento de Menus] ${err?.message || err}`);
    process.exit(1);
  });
}
