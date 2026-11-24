/**
 * Gerador OFFLINE do Catálogo Canônico de Menus do Orion TN (ADR-037).
 *
 * Lê a fonte de verdade transcrita das prints (`auditoria/mapeamento-menus/arvore-menus-orion-tn.md`, seção 4:
 * coluna "Caminho Canônico"; seção 5: homônimos e famílias de quase-homônimos), confere cada submenu contra os
 * `directChildren` da captura ao vivo (`auditoria/mapeamento-menus/manifest.json`, descartando o link fantasma `"0"`
 * e o painel `"9+"` de notificações) e grava `auditoria/data/orion-menu-tree-canonical.json` (versionado).
 *
 * O catálogo NUNCA é evidência: é a lista fechada de destinos candidatos. Toda cadeia resolvida a partir dele só
 * vale depois de conferida na árvore de navegação lida ao vivo (Trava de Evidência, ADR-017/029).
 *
 *   npx --prefix auditoria tsx auditoria/src/build-menu-catalog.ts               # gera o JSON versionado
 *   npx --prefix auditoria tsx auditoria/src/build-menu-catalog.ts --sync-cache  # + cache no formato do capture-menu-tree.ts
 *
 * Falha (código 1) se o total de caminhos finais não for 115 ou se houver cadeias duplicadas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  USER_MENU_ROOT,
  type MenuCatalog,
  type MenuCatalogHomonym,
  type MenuCatalogNearFamily,
  type MenuCatalogNode,
  type MenuCatalogPath
} from './menu-catalog.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const projectRoot = path.resolve(auditoriaRoot, '..');

export const CATALOG_MARKDOWN_FILE = path.join(auditoriaRoot, 'mapeamento-menus', 'arvore-menus-orion-tn.md');
export const CATALOG_MANIFEST_FILE = path.join(auditoriaRoot, 'mapeamento-menus', 'manifest.json');
export const CATALOG_OUTPUT_FILE = path.join(auditoriaRoot, 'data', 'orion-menu-tree-canonical.json');
export const MENU_TREE_CACHE_FILE = path.join(auditoriaRoot, 'cache', 'orion-menu-tree-real.json');
export const MENU_TREE_CACHE_BACKUP_FILE = path.join(auditoriaRoot, 'cache', 'orion-menu-tree-real.prev.json');

/** Total exigido de caminhos finais (110 nos 7 menus principais + 5 no menu do usuário). */
export const EXPECTED_PATH_COUNT = 115;
/** Entradas da captura ao vivo que não são menus: link fantasma (badge zerado) e painel de notificações. */
export const MANIFEST_EXCLUDED_LABELS = ['0', '9+'];

const BOLD_RE = /\*\*([^*]+)\*\*/g;
const sectionOf = (md: string, start: RegExp, end: RegExp): string => {
  const s = md.search(start);
  if (s < 0) return '';
  const rest = md.slice(s);
  const e = rest.slice(1).search(end);
  return e < 0 ? rest : rest.slice(0, e + 1);
};
const splitChain = (text: string): string[] =>
  text
    .split(' > ')
    .map(s => s.trim())
    .filter(Boolean);
const chainKey = (chain: string[]) => chain.join(' > ');

/** Versão exibida no rodapé das prints (`Versão 06.05.02 de ...`). */
export function parseCatalogVersion(md: string): string {
  const m = md.match(/Vers[aã]o\s+(\d{2}\.\d{2}\.\d{2})/);
  return m ? m[1] : 'desconhecida';
}

/** Linhas da seção 4: um caminho final por linha de tabela (`| # | **Caminho** | Profundidade | `print` |`). */
export function parseCanonicalPaths(md: string): MenuCatalogPath[] {
  const section = sectionOf(md, /^## 4\./m, /^## 5\./m);
  const out: MenuCatalogPath[] = [];
  for (const line of section.split(/\r?\n/)) {
    const row = line.match(/^\|\s*\d+\s*\|(.+)\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|\s*$/);
    if (!row) continue;
    const bold = row[1].match(/\*\*([^*]+)\*\*/);
    if (!bold) continue;
    const chain = splitChain(bold[1]);
    const depth = Number(row[2]);
    out.push({
      chain,
      depth,
      isLeaf: true,
      parentModule: chain[0],
      printProof: row[3],
      aliases: [],
      ...(chain[0] === USER_MENU_ROOT ? { userMenu: true } : {})
    });
  }
  return out;
}

/** Todos os nós (raízes, submenus intermediários e telas finais), na ordem da árvore. */
export function buildCatalogNodes(paths: MenuCatalogPath[]): MenuCatalogNode[] {
  const nodes = new Map<string, MenuCatalogNode>();
  for (const p of paths) {
    for (let k = 1; k <= p.chain.length; k++) {
      const chain = p.chain.slice(0, k);
      const key = chainKey(chain);
      const existing = nodes.get(key);
      const hasChildren = k < p.chain.length;
      if (existing) {
        existing.hasChildren = existing.hasChildren || hasChildren;
        continue;
      }
      nodes.set(key, {
        chain,
        depth: k,
        hasChildren,
        isLeaf: false,
        parentModule: chain[0],
        ...(chain[0] === USER_MENU_ROOT ? { userMenu: true } : {})
      });
    }
  }
  const leafKeys = new Set(paths.map(p => chainKey(p.chain)));
  for (const [key, node] of nodes) node.isLeaf = leafKeys.has(key);
  return Array.from(nodes.values());
}

/** Rótulos repetidos (texto idêntico) na árvore, com o papel de cada ocorrência. */
export function computeHomonyms(nodes: MenuCatalogNode[]): MenuCatalogHomonym[] {
  const byLabel = new Map<string, MenuCatalogNode[]>();
  for (const n of nodes) {
    const label = n.chain[n.chain.length - 1];
    byLabel.set(label, [...(byLabel.get(label) || []), n]);
  }
  return Array.from(byLabel.entries())
    .filter(([, list]) => list.length > 1)
    .map(([label, list]) => ({
      label,
      occurrences: list.map(n => ({ chain: n.chain, role: n.hasChildren ? ('submenu' as const) : ('leaf' as const) }))
    }));
}

/** Rótulos da tabela 5.1 do markdown (para conferir com os homônimos calculados). */
export function parseDocumentedHomonymLabels(md: string): string[] {
  const section = sectionOf(md, /^### 5\.1/m, /^### 5\.2/m);
  const labels: string[] = [];
  for (const line of section.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\*\*([^*]+)\*\*\s*\|\s*\*\*(\d+)\*\*\s*\|/);
    if (m) labels.push(m[1].trim());
  }
  return labels;
}

/** Famílias da seção 5.2: cada negrito vira cadeia existente (com `>`) ou folha de rótulo único (profundidade >= 2). */
export function parseNearHomonymFamilies(md: string, nodes: MenuCatalogNode[]): MenuCatalogNearFamily[] {
  const section = sectionOf(md, /^### 5\.2/m, /^### 5\.3/m);
  const byKey = new Map(nodes.map(n => [chainKey(n.chain), n]));
  const resolveBold = (text: string): string[] | null => {
    const t = text.trim();
    if (t.includes(' > ')) {
      const n = byKey.get(chainKey(splitChain(t)));
      return n ? n.chain : null;
    }
    const hits = nodes.filter(n => n.depth >= 2 && n.chain[n.chain.length - 1] === t);
    return hits.length === 1 ? hits[0].chain : null;
  };
  const families: MenuCatalogNearFamily[] = [];
  let current: MenuCatalogNearFamily | null = null;
  for (const line of section.split(/\r?\n/)) {
    const head = line.match(/^(\d+)\.\s+(.*)$/);
    if (head) {
      current = {
        id: Number(head[1]),
        title: head[2].replace(/\*\*/g, '').replace(/:\s*$/, '').trim(),
        chains: []
      };
      families.push(current);
      continue;
    }
    if (!current) continue;
    for (const m of line.matchAll(BOLD_RE)) {
      const chain = resolveBold(m[1]);
      if (chain && !current.chains.some(c => chainKey(c) === chainKey(chain))) current.chains.push(chain);
    }
  }
  return families;
}

interface ManifestFile {
  capturedAt: string;
  environment: string;
  rootDirectLinks: Array<{ chain: string[]; disabled?: boolean }>;
  captures: Array<{ file: string; chain: string[]; directChildren: string[] }>;
}

/** `Olá, <nome>` (nome dinâmico) -> `Olá, [usuário]`. */
export function normalizeUserMenuRoot(label: string): string {
  return /^ol[aá],\s*\S/i.test(String(label ?? '').trim()) ? USER_MENU_ROOT : label;
}

/** Conferência cruzada submenu a submenu: filhos diretos do catálogo x `directChildren` da captura ao vivo. */
export function crossCheckManifest(
  nodes: MenuCatalogNode[],
  manifest: ManifestFile
): { mismatches: string[]; excluded: string[]; checkedSubmenus: number } {
  const mismatches: string[] = [];
  const excluded: string[] = [];
  const childrenOf = (chain: string[]) =>
    nodes.filter(n => n.depth === chain.length + 1 && chainKey(n.chain.slice(0, -1)) === chainKey(chain)).map(n => n.chain[n.chain.length - 1]);
  let checked = 0;
  const seenSubmenus = new Set<string>();
  for (const cap of manifest.captures) {
    if (cap.chain.some(s => MANIFEST_EXCLUDED_LABELS.includes(s))) {
      excluded.push(`captura ${cap.file} (${chainKey(cap.chain)})`);
      continue;
    }
    const chain = cap.chain.map((s, i) => (i === 0 ? normalizeUserMenuRoot(s) : s));
    const expected = childrenOf(chain);
    seenSubmenus.add(chainKey(chain));
    checked++;
    const live = cap.directChildren;
    if (expected.length !== live.length || expected.some((c, i) => c !== live[i])) {
      mismatches.push(`${chainKey(chain)}: catálogo [${expected.join(', ')}] x captura [${live.join(', ')}]`);
    }
  }
  for (const link of manifest.rootDirectLinks) {
    if (link.chain.some(s => MANIFEST_EXCLUDED_LABELS.includes(s))) {
      excluded.push(`link de raiz "${chainKey(link.chain)}"`);
      continue;
    }
    const node = nodes.find(n => chainKey(n.chain) === chainKey(link.chain));
    if (!node || node.hasChildren) mismatches.push(`link direto de raiz "${chainKey(link.chain)}" não é tela final de profundidade 1 no catálogo`);
  }
  for (const n of nodes) {
    if (n.hasChildren && !seenSubmenus.has(chainKey(n.chain))) mismatches.push(`submenu "${chainKey(n.chain)}" sem captura no manifest.json`);
  }
  return { mismatches, excluded, checkedSubmenus: checked };
}

/** Monta o catálogo completo a partir do markdown e do manifest (puro: sem disco). */
export function buildMenuCatalog(md: string, manifest: ManifestFile): { catalog: MenuCatalog; errors: string[] } {
  const errors: string[] = [];
  const paths = parseCanonicalPaths(md);
  if (paths.length !== EXPECTED_PATH_COUNT) errors.push(`esperados ${EXPECTED_PATH_COUNT} caminhos finais, lidos ${paths.length}`);
  const seen = new Set<string>();
  for (const p of paths) {
    const key = chainKey(p.chain);
    if (seen.has(key)) errors.push(`cadeia duplicada: ${key}`);
    seen.add(key);
    if (p.depth !== p.chain.length) errors.push(`profundidade declarada ${p.depth} != ${p.chain.length} segmentos em ${key}`);
  }
  const nodes = buildCatalogNodes(paths);
  const documentedHomonyms = parseDocumentedHomonymLabels(md);
  // Mesma ordem da tabela 5.1 (rótulos fora dela ficam no fim e acusam erro abaixo)
  const order = (label: string) => {
    const i = documentedHomonyms.indexOf(label);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  const homonyms = computeHomonyms(nodes).sort((a, b) => order(a.label) - order(b.label));
  const computedLabels = homonyms.map(h => h.label).sort();
  if (computedLabels.join('|') !== [...documentedHomonyms].sort().join('|')) {
    errors.push(`homônimos calculados [${computedLabels.join(', ')}] != tabela 5.1 [${documentedHomonyms.join(', ')}]`);
  }
  const nearHomonymFamilies = parseNearHomonymFamilies(md, nodes);
  const cross = crossCheckManifest(nodes, manifest);
  const catalog: MenuCatalog = {
    version: parseCatalogVersion(md),
    capturedAt: manifest.capturedAt,
    environment: manifest.environment,
    source: {
      markdown: path.relative(projectRoot, CATALOG_MARKDOWN_FILE).replace(/\\/g, '/'),
      manifest: path.relative(projectRoot, CATALOG_MANIFEST_FILE).replace(/\\/g, '/')
    },
    userMenuRoot: USER_MENU_ROOT,
    pathCount: paths.length,
    paths,
    nodes,
    homonyms,
    nearHomonymFamilies,
    crossCheck: cross
  };
  return { catalog, errors };
}

/** Converte o catálogo no formato exato do `capture-menu-tree.ts` (`MenuTreeSnapshot`). */
export function catalogToMenuTreeSnapshot(catalog: MenuCatalog) {
  return {
    capturedAt: catalog.capturedAt,
    environment: catalog.environment,
    itemCount: catalog.nodes.length,
    items: catalog.nodes.map(n => ({ chain: n.chain, hasChildren: n.hasChildren, disabled: false }))
  };
}

function main(): void {
  const md = fs.readFileSync(CATALOG_MARKDOWN_FILE, 'utf-8');
  const manifest = JSON.parse(fs.readFileSync(CATALOG_MANIFEST_FILE, 'utf-8')) as ManifestFile;
  const { catalog, errors } = buildMenuCatalog(md, manifest);
  for (const m of catalog.crossCheck.mismatches) console.warn(`⚠ [Catálogo de Menus] divergência com o manifest.json: ${m}`);
  for (const e of catalog.crossCheck.excluded) console.log(`· [Catálogo de Menus] excluído da captura: ${e}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`✗ [Catálogo de Menus] ${e}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(CATALOG_OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(CATALOG_OUTPUT_FILE, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(
    `✓ [Catálogo de Menus] versão ${catalog.version}: ${catalog.pathCount} caminhos finais, ${catalog.nodes.length} nós, ` +
      `${catalog.homonyms.length} homônimos exatos, ${catalog.nearHomonymFamilies.length} famílias, ` +
      `${catalog.crossCheck.checkedSubmenus} submenus conferidos (${catalog.crossCheck.mismatches.length} divergências) -> ` +
      path.relative(projectRoot, CATALOG_OUTPUT_FILE)
  );

  if (process.argv.includes('--sync-cache')) {
    fs.mkdirSync(path.dirname(MENU_TREE_CACHE_FILE), { recursive: true });
    if (fs.existsSync(MENU_TREE_CACHE_FILE)) {
      // Um cache já sincronizado deste mesmo catálogo não sobrescreve o backup da última leitura ao vivo
      let alreadySynced = false;
      try {
        alreadySynced = JSON.parse(fs.readFileSync(MENU_TREE_CACHE_FILE, 'utf-8'))?.capturedAt === catalog.capturedAt;
      } catch {
        alreadySynced = false;
      }
      if (!alreadySynced || !fs.existsSync(MENU_TREE_CACHE_BACKUP_FILE)) fs.copyFileSync(MENU_TREE_CACHE_FILE, MENU_TREE_CACHE_BACKUP_FILE);
    }
    const snapshot = catalogToMenuTreeSnapshot(catalog);
    fs.writeFileSync(MENU_TREE_CACHE_FILE, JSON.stringify(snapshot, null, 1), 'utf-8');
    console.log(
      `✓ [Catálogo de Menus] cache ${path.relative(projectRoot, MENU_TREE_CACHE_FILE)} sincronizado (${snapshot.itemCount} itens; ` +
        `anterior em ${path.relative(projectRoot, MENU_TREE_CACHE_BACKUP_FILE)})`
    );
  }
}

if (process.argv[1] && /build-menu-catalog\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) {
  try {
    main();
  } catch (err) {
    console.error(`✗ [Catálogo de Menus] ${(err as Error)?.message || err}`);
    process.exit(1);
  }
}
