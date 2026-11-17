/**
 * Captura SOMENTE LEITURA da árvore de navegação real do Orion TN (ADR-029).
 *
 * Reusa `buildMenuTreeScript()` (o mesmo script da Camada 0 do executor) e grava a lista de itens reais
 * (`chain`, `hasChildren`, `disabled`) em `auditoria/cache/orion-menu-tree-real.json` (cache ignorado pelo Git).
 * O minerador `mine-att-clusters.ts` usa esse arquivo para provar, com a árvore real, quais caminhos legados do
 * manual têm destino único e inequívoco. Nada é clicado; os seletores de carimbo não são gravados.
 *
 *   npx --prefix auditoria tsx auditoria/src/capture-menu-tree.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';
import { config } from './config.js';
import { buildMenuTreeScript, parseMenuTreeResponse } from './menu-path.js';
import { preflightOrionReachability } from './preflight.js';

export const MENU_TREE_SNAPSHOT_FILE = path.join(config.rootDir, 'auditoria', 'cache', 'orion-menu-tree-real.json');

export interface MenuTreeSnapshot {
  capturedAt: string;
  environment: string;
  itemCount: number;
  items: Array<{ chain: string[]; hasChildren: boolean; disabled: boolean }>;
}

async function main(): Promise<void> {
  await preflightOrionReachability();
  const client = new AgentBrowserClient({ headless: true, sessionId: 'capture-menu-tree', deviceScaleFactor: 1 });
  try {
    await client.open('about:blank');
    await client.setViewport(config.viewportWidth, config.viewportHeight);
    if (!(await ensureAuthenticated(client))) throw new Error('Sessão não autenticada: execute --login antes.');
    if (config.appHomeUrl) await client.open(config.appHomeUrl);
    await client.wait(2500);
    await client.jumpHash('#/inicio');
    await client.wait(2000);
    const raw = await client.eval(buildMenuTreeScript());
    const items = parseMenuTreeResponse(raw);
    if (items.length === 0) throw new Error('Árvore de navegação vazia: a barra de menus não foi lida.');
    const snapshot: MenuTreeSnapshot = {
      capturedAt: new Date().toISOString(),
      environment: process.env.ORION_ENV_LABEL || 'Produtos',
      itemCount: items.length,
      items: items.map(i => ({ chain: i.chain, hasChildren: i.hasChildren, disabled: i.disabled }))
    };
    await fs.promises.mkdir(path.dirname(MENU_TREE_SNAPSHOT_FILE), { recursive: true });
    await fs.promises.writeFile(MENU_TREE_SNAPSHOT_FILE, JSON.stringify(snapshot, null, 1), 'utf-8');
    console.log(`✓ [Árvore de Menus] ${items.length} itens reais gravados em ${path.relative(config.rootDir, MENU_TREE_SNAPSHOT_FILE)}`);
  } finally {
    await client.close().catch(() => undefined);
  }
}

if (process.argv[1] && /capture-menu-tree\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) {
  main().catch(err => {
    console.error(`✗ [Árvore de Menus] ${err?.message || err}`);
    process.exit(1);
  });
}
