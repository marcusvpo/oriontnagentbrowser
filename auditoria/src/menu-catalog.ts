/**
 * Catálogo Canônico de Menus do Orion TN 06.05.02 — carregador PURO e API de consulta (ADR-037).
 *
 * Fonte: `auditoria/data/orion-menu-tree-canonical.json` (gerado por `build-menu-catalog.ts` a partir de
 * `auditoria/mapeamento-menus/arvore-menus-orion-tn.md` + `manifest.json`): 115 caminhos finais (110 nos 7 menus da
 * barra + 5 no menu do usuário `Olá, [usuário]`), todos os nós intermediários, 4 homônimos exatos e 14 famílias de
 * quase-homônimos. Sem navegador, sem rede, sem importar o SmartLocator.
 *
 * TRAVA DE EVIDÊNCIA (ADR-017/029): nada aqui é evidência. Toda cadeia devolvida é só um CANDIDATO fechado que o
 * chamador precisa confirmar na árvore de navegação lida ao vivo (e medir/clicar de verdade) antes de qualquer
 * demarcação; o texto do manual nunca é reescrito por estas funções.
 *
 * Camadas oferecidas:
 * - Camada 2 (`resolveSingleSegmentScreen`): nome de tela citado SEM `>` -> destino ÚNICO por folha idêntica, mesma
 *   chave de folha ou apelido curado (`SCREEN_ALIASES`), com desempate de homônimos pelo módulo da rotina.
 * - Camada 3 (`resolveClosedSemantic`): pontuação determinística por radicais inteiros (nunca substring) sobre os 115
 *   caminhos, com limiar e margem documentados; abaixo deles, `SEM_EQUIVALENTE_NA_ARVORE`. `buildClosedSemanticPrompt`
 *   e `parseClosedSemanticAnswer` preparam uma consulta opcional ao `agy` que só aceita uma cadeia LITERAL da lista.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonNormalize, isUserMenuRootLabel, leafAlternatives, leafKey, USER_MENU_ROOT, type CanonicalMenuItem } from './menu-canonical.js';

export { USER_MENU_ROOT } from './menu-canonical.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MENU_CATALOG_FILE = path.resolve(moduleDir, '..', 'data', 'orion-menu-tree-canonical.json');

export interface MenuCatalogPath {
  chain: string[];
  depth: number;
  isLeaf: true;
  /** Raiz da barra (chain[0]); no menu do usuário, `Olá, [usuário]` */
  parentModule: string;
  /** Print que comprova o caminho (`auditoria/mapeamento-menus/`) */
  printProof: string;
  aliases: string[];
  userMenu?: boolean;
}

export interface MenuCatalogNode {
  chain: string[];
  depth: number;
  hasChildren: boolean;
  /** Um dos 115 caminhos finais */
  isLeaf: boolean;
  parentModule: string;
  userMenu?: boolean;
}

export interface MenuCatalogHomonym {
  label: string;
  occurrences: Array<{ chain: string[]; role: 'leaf' | 'submenu' }>;
}

export interface MenuCatalogNearFamily {
  id: number;
  title: string;
  chains: string[][];
}

export interface MenuCatalog {
  version: string;
  capturedAt: string;
  environment: string;
  source: { markdown: string; manifest: string };
  userMenuRoot: string;
  pathCount: number;
  paths: MenuCatalogPath[];
  nodes: MenuCatalogNode[];
  homonyms: MenuCatalogHomonym[];
  nearHomonymFamilies: MenuCatalogNearFamily[];
  crossCheck: { mismatches: string[]; excluded: string[]; checkedSubmenus: number };
}

const catalogCache = new Map<string, MenuCatalog>();

/** Lê (uma vez por caminho de arquivo) o catálogo versionado. Síncrono e sem efeitos colaterais além do cache. */
export function loadMenuCatalog(filePath: string = DEFAULT_MENU_CATALOG_FILE): MenuCatalog {
  const key = path.resolve(filePath);
  const cached = catalogCache.get(key);
  if (cached) return cached;
  const parsed = JSON.parse(fs.readFileSync(key, 'utf-8')) as MenuCatalog;
  if (!Array.isArray(parsed.paths) || !Array.isArray(parsed.nodes)) throw new Error(`Catálogo de menus inválido: ${key}`);
  catalogCache.set(key, parsed);
  return parsed;
}

/** Esvazia o cache do carregador (testes). */
export function clearMenuCatalogCache(): void {
  catalogCache.clear();
}

const pathText = (chain: string[]) => chain.join(' > ');

/** Todos os nós (raízes, submenus e telas) no formato do resolvedor `resolveCanonicalMenuPath`. */
export function catalogAsCanonicalItems(catalog: MenuCatalog = loadMenuCatalog()): CanonicalMenuItem[] {
  return catalog.nodes.map(n => ({ chain: [...n.chain], hasChildren: n.hasChildren }));
}

const sameSegment = (catalogSeg: string, otherSeg: string) =>
  catalogSeg === USER_MENU_ROOT ? isUserMenuRootLabel(otherSeg) : canonNormalize(catalogSeg) === canonNormalize(otherSeg);

/**
 * Nó do catálogo com a cadeia idêntica (sem acento/caixa; `Olá, <nome>` casa com `Olá, [usuário]`). Procura em
 * todos os nós (inclusive submenus); `isLeaf` diz se é um dos 115 caminhos finais.
 */
export function findExactPath(chain: string[], catalog: MenuCatalog = loadMenuCatalog()): MenuCatalogNode | null {
  return catalog.nodes.find(n => n.chain.length === chain.length && n.chain.every((s, i) => sameSegment(s, chain[i]))) ?? null;
}

export interface MenuCatalogLeafHit {
  node: MenuCatalogNode;
  basis: 'exact_leaf' | 'leaf_key';
}

/** Raízes de submenu não são telas: um rótulo só casa com nós de profundidade >= 2 ou raízes sem filhos (Históricos). */
const isScreenCandidate = (n: MenuCatalogNode) => n.depth >= 2 || !n.hasChildren;

/**
 * Nós cujo rótulo final casa com o texto: primeiro texto idêntico normalizado (com alternativas `X / Y`); só se não
 * houver nenhum, mesma chave de folha NÃO vazia (`leafKey`). Palavras inteiras: nunca substring intra-palavra.
 */
export function findByLeaf(leafText: string, catalog: MenuCatalog = loadMenuCatalog()): MenuCatalogLeafHit[] {
  const alternatives = leafAlternatives(cleanScreenLabel(leafText)).filter(Boolean);
  if (alternatives.length === 0) return [];
  const pool = catalog.nodes.filter(isScreenCandidate);
  const label = (n: MenuCatalogNode) => n.chain[n.chain.length - 1];
  const exact = pool.filter(n => alternatives.some(a => canonNormalize(a) === canonNormalize(label(n))));
  if (exact.length > 0) return exact.map(node => ({ node, basis: 'exact_leaf' as const }));
  const keys = alternatives.map(a => leafKey(a)).filter(k => k.length > 0);
  if (keys.length === 0) return [];
  return pool
    .filter(n => {
      const k = leafKey(label(n));
      return k.length > 0 && keys.some(d => d.length === k.length && d.every((w, i) => w === k[i]));
    })
    .map(node => ({ node, basis: 'leaf_key' as const }));
}

/** Rótulo repetido (texto idêntico normalizado) em mais de um nó da árvore (ex.: Consultas, Cadastros). */
export function isHomonym(label: string, catalog: MenuCatalog = loadMenuCatalog()): boolean {
  const norm = canonNormalize(label);
  return catalog.nodes.filter(n => canonNormalize(n.chain[n.chain.length - 1]) === norm).length > 1;
}

/** Existe algum nó-tela cujo rótulo final casa com o texto (idêntico ou mesma chave de folha). */
export function leafExists(label: string, catalog: MenuCatalog = loadMenuCatalog()): boolean {
  return findByLeaf(label, catalog).length > 0;
}

// ------------------------------------------------------------------------------------------------------------------
// Camada 2: nome de tela citado sem `>`
// ------------------------------------------------------------------------------------------------------------------

/**
 * Módulo da rotina (frontmatter `modulo:` do KB: firmas, notas, certidoes, config, acesso, caixa, selos, livros,
 * centrais, comunicacao, geral) -> raízes da barra onde suas telas vivem. Usado só para desempatar homônimos e como
 * bônus na Camada 3; nunca cria destino.
 */
export const MODULE_ROOTS: Record<string, string[]> = {
  firmas: ['Firmas'],
  notas: ['Notas'],
  certidoes: ['Notas', 'Administração'],
  config: ['Configurações'],
  acesso: ['Configurações', USER_MENU_ROOT],
  caixa: ['Relatórios', 'Administração'],
  selos: ['Administração', 'Relatórios'],
  livros: ['Administração', 'Relatórios'],
  centrais: ['Administração', 'Dashboard'],
  comunicacao: ['Administração', 'Dashboard'],
  geral: []
};

/** Raízes associadas ao módulo; aceita também o próprio nome de uma raiz (`administracao`, `Configurações`...). */
export function rootsForModulo(modulo: string | undefined, catalog: MenuCatalog = loadMenuCatalog()): string[] {
  if (!modulo) return [];
  const norm = canonNormalize(modulo);
  if (MODULE_ROOTS[norm]) return MODULE_ROOTS[norm];
  const roots = Array.from(new Set(catalog.nodes.map(n => n.chain[0])));
  return roots.filter(r => canonNormalize(r) === norm);
}

export interface ScreenAlias {
  /** Nomes legados da tela, normalizados por `canonNormalize` (comparação por igualdade, nunca substring) */
  aliases: string[];
  /** Cadeia canônica (precisa existir no catálogo) */
  chain: string[];
  /** Prova: rotina/print que motivou o apelido */
  evidence: string;
}

/**
 * Apelidos curados de telas legadas -> cadeia canônica única. Só entra aqui o que a folha idêntica e a chave de
 * folha não resolvem sozinhas. A igualdade é do rótulo INTEIRO normalizado.
 */
export const SCREEN_ALIASES: ScreenAlias[] = [
  {
    aliases: ['grupos e perfis de acesso', 'perfis de acesso', 'grupos de acesso', 'grupos e perfis', 'perfis e permissoes'],
    chain: ['Configurações', 'Perfis e permissões de acesso'],
    evidence: 'a tela de grupos/perfis de acesso é "Configurações > Perfis e permissões de acesso" no 06.05.02 (C-ACESSO-06, C-ACESSO-07; print 14-configuracoes.png)'
  },
  {
    aliases: ['fichas', 'fichas de assinatura', 'cartoes de assinatura', 'fichas / cartoes de assinatura'],
    chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
    evidence: 'o único cadastro de fichas/cartões de assinatura é "Firmas > Cadastros > Cartão de assinatura" (C-FIRMA-04; print 04-firmas__cadastros.png)'
  },
  {
    aliases: ['alteracao de senha', 'trocar senha', 'troca de senha'],
    chain: [USER_MENU_ROOT, 'Alterar senha'],
    evidence: 'a troca da própria senha fica no menu do usuário "Olá, [usuário] > Alterar senha" (C-ACESSO-03/04; print 20-ola-usuario.png)'
  },
  {
    aliases: ['2fa', 'autenticacao de dois fatores', 'dois fatores', 'autenticacao 2fa', 'autenticacao em 2 fatores'],
    chain: [USER_MENU_ROOT, 'Autenticação em dois fatores'],
    evidence: 'o 2FA do usuário fica em "Olá, [usuário] > Autenticação em dois fatores" (C-ACESSO-03; print 20-ola-usuario.png)'
  },
  {
    aliases: ['cadastro de biometria', 'biometria do usuario'],
    chain: [USER_MENU_ROOT, 'Cadastrar biometria'],
    evidence: 'o cadastro de biometria do usuário fica em "Olá, [usuário] > Cadastrar biometria" (print 20-ola-usuario.png)'
  },
  {
    aliases: ['parametros gerais', 'parametros do sistema', 'parametrizacao geral', 'parametros de integracao', 'parametros de nfs e', 'parametros do modulo firmas'],
    chain: ['Configurações', 'Parametrizações'],
    evidence: 'os parâmetros globais ficam na tela única "Configurações > Parametrizações" (C-FIRMA-06/07/08, C-SELO-04, C-CENTRAL-04; ADR-029)'
  },
  {
    aliases: ['livros notariais', 'gestao de livros notariais', 'livros', 'gestao de livros', 'cadastro de livros'],
    chain: ['Administração', 'Controle de Livros'],
    evidence: 'a única tela de gestão de livros é "Administração > Controle de Livros" (C-LIVRO-01/02/05, M-22.0; print 08-administracao.png)'
  },
  {
    aliases: ['orion estoque', 'estoque'],
    chain: ['Administração', 'Controle de Estoque'],
    evidence: 'o antigo módulo "Orion Estoque" é o submenu "Administração > Controle de Estoque" (C-LIVRO-07; print 11-administracao__controle-de-estoque.png)'
  },
  {
    aliases: ['pedido de certidao', 'novo pedido de certidao'],
    chain: ['Notas', 'Nova certidão e serviço'],
    evidence: 'o único item de criação de pedido de certidão é "Notas > Nova certidão e serviço" (M-54.0, M-54.1, C-CERT-01/03; ADR-029)'
  },
  {
    aliases: ['consulta de certidoes', 'consulta de certidoes e servicos'],
    chain: ['Notas', 'Consultas', 'Certidões e serviços'],
    evidence: 'a única consulta de certidões é "Notas > Consultas > Certidões e serviços" (D-3.15, D-9.0)'
  },
  {
    aliases: ['abertura de pedido com senha'],
    chain: ['Firmas', 'Abertura de pedido'],
    evidence: 'o único item de abertura de pedido é "Firmas > Abertura de pedido" (M-13.0)'
  }
];

export type SingleSegmentBasis = 'exact_leaf' | 'leaf_key' | 'screen_alias';

export type SingleSegmentResolution =
  | {
      status: 'resolved';
      chain: string[];
      basis: SingleSegmentBasis;
      /** Como o homônimo foi desfeito, quando havia mais de um candidato */
      disambiguatedBy?: 'modulo' | 'context' | 'ancestor_collapse';
      /** O destino é um dos 115 caminhos finais (false = submenu intermediário, ex.: "Firmas > Consultas") */
      isLeaf: boolean;
      evidence: string;
    }
  | { status: 'ambiguous'; basis: SingleSegmentBasis; candidates: string[][]; evidence: string }
  | { status: 'not_found'; evidence: string };

/** Remove aspas, pontuação final e qualificadores de tela ("menu", "submenu", "tela de", "módulo") do rótulo citado. */
export function cleanScreenLabel(label: string): string {
  let t = String(label ?? '')
    .replace(/[*`"“”'‘’]/g, ' ')
    .replace(/[.:;!?]+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/^(?:o |a )?(?:menu|submenu|tela|m[oó]dulo|aba)\s+(?:(?:de|do|da)\s+)?/i, '');
  return t.trim();
}

/** Radicais inteiros de um texto livre (sem palavras vazias; mantém palavras genéricas). */
const textStems = (text: string) => new Set(leafKey(String(text ?? '').replace(/\*\*/g, ' '), { dropGeneric: false }));

/**
 * Camada 2 — nome de tela citado sem `>` -> destino único no catálogo. Ordem: folha idêntica, mesma chave de folha,
 * apelido curado. Vários candidatos: (1) um único caminho final cujos demais candidatos são seus ancestrais
 * (`Mensalistas`), (2) raízes do módulo da rotina, (3) contexto (título + próximos passos) citando radicais de um único
 * ancestral. Persistindo o empate: `ambiguous`. Nada é adivinhado e o resultado é só candidato (Trava de Evidência).
 */
export function resolveSingleSegmentScreen(
  label: string,
  ctx: { modulo?: string; routineTitle?: string; nextStepsText?: string[] } = {},
  catalog: MenuCatalog = loadMenuCatalog()
): SingleSegmentResolution {
  const cleaned = cleanScreenLabel(label);
  if (!cleaned || cleaned.includes('>')) {
    return { status: 'not_found', evidence: `"${label}" não é um nome de tela de segmento único` };
  }

  let basis: SingleSegmentBasis;
  let candidates: MenuCatalogNode[];
  let aliasEvidence = '';
  const hits = findByLeaf(cleaned, catalog);
  if (hits.length > 0) {
    basis = hits[0].basis;
    candidates = hits.map(h => h.node);
  } else {
    const norm = canonNormalize(cleaned);
    const alias = SCREEN_ALIASES.find(a => a.aliases.includes(norm));
    const node = alias ? findExactPath(alias.chain, catalog) : null;
    if (!alias || !node) return { status: 'not_found', evidence: `"${cleaned}" não casa com nenhuma tela do catálogo ${catalog.version}` };
    basis = 'screen_alias';
    candidates = [node];
    aliasEvidence = alias.evidence;
  }

  const describe = (n: MenuCatalogNode) =>
    basis === 'screen_alias'
      ? `apelido curado "${cleaned}" -> "${pathText(n.chain)}": ${aliasEvidence}`
      : basis === 'exact_leaf'
        ? `rótulo idêntico "${cleaned}" = "${pathText(n.chain)}"`
        : `mesma chave de folha "${cleaned}" ≡ "${pathText(n.chain)}"`;
  const done = (n: MenuCatalogNode, by?: 'modulo' | 'context' | 'ancestor_collapse', why = ''): SingleSegmentResolution => ({
    status: 'resolved',
    chain: [...n.chain],
    basis,
    ...(by ? { disambiguatedBy: by } : {}),
    isLeaf: n.isLeaf,
    evidence: `${describe(n)}${why ? `; ${why}` : ''} (catálogo canônico ${catalog.version}; candidato a confirmar na árvore lida ao vivo)`
  });

  if (candidates.length === 1) return done(candidates[0]);

  const isPrefix = (a: string[], b: string[]) => a.length < b.length && a.every((s, i) => s === b[i]);
  const collapse = (pool: MenuCatalogNode[]) => {
    const leaves = pool.filter(n => n.isLeaf);
    if (leaves.length !== 1) return null;
    return pool.every(n => n === leaves[0] || isPrefix(n.chain, leaves[0].chain)) ? leaves[0] : null;
  };
  const collapsed = collapse(candidates);
  if (collapsed) return done(collapsed, 'ancestor_collapse', 'os demais candidatos são o submenu que leva a essa tela');

  let pool = candidates;
  const roots = rootsForModulo(ctx.modulo, catalog);
  if (roots.length > 0) {
    const byModule = candidates.filter(n => roots.includes(n.chain[0]));
    if (byModule.length === 1) return done(byModule[0], 'modulo', `módulo da rotina "${ctx.modulo}" -> raiz "${byModule[0].chain[0]}"`);
    if (byModule.length > 1) {
      const c2 = collapse(byModule);
      if (c2) return done(c2, 'modulo', `módulo da rotina "${ctx.modulo}" e submenu ancestral da mesma tela`);
      pool = byModule;
    }
  }

  const contextText = [ctx.routineTitle || '', ...(ctx.nextStepsText || [])].join(' ');
  if (contextText.trim()) {
    const stems = textStems(contextText);
    const scored = pool.map(n => {
      const anc = new Set(n.chain.slice(0, -1).filter(s => s !== USER_MENU_ROOT).flatMap(s => leafKey(s)));
      return { n, hits: Array.from(anc).filter(w => stems.has(w)) };
    });
    const best = Math.max(...scored.map(s => s.hits.length));
    const top = scored.filter(s => s.hits.length === best);
    if (best > 0 && top.length === 1) {
      return done(top[0].n, 'context', `o contexto da rotina cita [${top[0].hits.join(', ')}] do ancestral de "${pathText(top[0].n.chain)}"`);
    }
  }

  return {
    status: 'ambiguous',
    basis,
    candidates: pool.map(n => [...n.chain]),
    evidence: `"${cleaned}" é homônimo em ${pool.length} pontos da árvore (${pool.map(n => pathText(n.chain)).join(' | ')}); módulo e contexto não desempatam`
  };
}

// ------------------------------------------------------------------------------------------------------------------
// Camada 3: semântica fechada sobre os 115 caminhos
// ------------------------------------------------------------------------------------------------------------------

export const SEM_EQUIVALENTE_NA_ARVORE = 'SEM_EQUIVALENTE_NA_ARVORE' as const;

/**
 * Limiar mínimo da Camada 3. Pontuação = 0,60 × cobertura dos radicais da folha no texto + 0,20 × Sørensen–Dice
 * (folha × título) + 0,10 × cobertura dos radicais dos ancestrais + 0,10 × bônus de módulo. 0,70 exige, na prática,
 * TODOS os radicais distintivos da folha no texto e mais algum sinal independente (título, ancestral ou módulo).
 */
export const CLOSED_SEMANTIC_MIN_SCORE = 0.7;
/** Margem mínima do 1º sobre o 2º colocado: abaixo dela, dois destinos são plausíveis e nada é escolhido. */
export const CLOSED_SEMANTIC_MIN_MARGIN = 0.12;

export interface ClosedSemanticInput {
  /** Passos da rotina (só os 3 primeiros entram na pontuação) */
  stepTexts: string[];
  modulo?: string;
  routineTitle?: string;
  /**
   * Caminho documentado pelo manual (quando houver). A Camada 3 fica restrita ao MAIOR prefixo dele que existe no
   * catálogo: "Administração > Comunicações > SIRC" nunca salta para "Dashboard > Comunicações" (ADR-037).
   */
  documentedChain?: string[];
}

export interface ClosedSemanticCandidate {
  chain: string[];
  score: number;
}

export type ClosedSemanticResolution =
  | { status: 'resolved'; chain: string[]; score: number; margin: number; justification: string }
  | { status: typeof SEM_EQUIVALENTE_NA_ARVORE; topCandidates: ClosedSemanticCandidate[]; justification: string };

const dice = (a: string[], b: Set<string>) => {
  if (a.length === 0 || b.size === 0) return 0;
  const inter = a.filter(w => b.has(w)).length;
  return (2 * inter) / (a.length + b.size);
};
const round = (n: number) => Number(n.toFixed(3));

/**
 * Camada 3 determinística: pontua cada um dos 115 caminhos pelos radicais INTEIROS do título + passos 1 a 3 (nunca
 * substring) e só devolve destino com pontuação >= `CLOSED_SEMANTIC_MIN_SCORE` e margem >= `CLOSED_SEMANTIC_MIN_MARGIN`.
 */
export function resolveClosedSemantic(input: ClosedSemanticInput, catalog: MenuCatalog = loadMenuCatalog()): ClosedSemanticResolution {
  return resolveClosedSemanticInner(input, catalog);
}

/**
 * Âncora da Camada 3: maior prefixo do caminho documentado que existe no catálogo (segmentos normalizados por
 * `canonNormalize`). Vazia = sem restrição. Compartilhada pela Camada 3 determinística e pela resposta do `agy`.
 */
export function closedSemanticAnchor(documentedChain: string[] | undefined, catalog: MenuCatalog = loadMenuCatalog()): string[] {
  let anchor: string[] = [];
  const doc = (documentedChain || []).filter(Boolean);
  for (let k = 1; k <= doc.length; k++) {
    const pre = doc.slice(0, k).map(canonNormalize);
    if (!catalog.nodes.some(n => n.chain.length === k && n.chain.every((seg, i) => canonNormalize(seg) === pre[i]))) break;
    anchor = pre;
  }
  return anchor;
}

/** A cadeia fica estritamente abaixo da âncora (âncora vazia aceita qualquer cadeia). */
export function chainUnderAnchor(chain: string[], anchor: string[]): boolean {
  return anchor.length === 0 || (chain.length > anchor.length && anchor.every((seg, i) => canonNormalize(chain[i]) === seg));
}

function resolveClosedSemanticInner(input: ClosedSemanticInput, catalog: MenuCatalog): ClosedSemanticResolution {
  const text = [input.routineTitle || '', ...(input.stepTexts || []).slice(0, 3)].join(' ');
  const stems = textStems(text);
  const titleStems = textStems(input.routineTitle || '');
  const roots = rootsForModulo(input.modulo, catalog);
  const anchor = closedSemanticAnchor(input.documentedChain, catalog);
  const underAnchor = (chain: string[]) => chainUnderAnchor(chain, anchor);
  const scored = catalog.paths
    .filter(p => underAnchor(p.chain))
    .map(p => {
      const leaf = p.chain[p.chain.length - 1];
      let leafK = leafKey(leaf);
      if (leafK.length === 0) leafK = leafKey(leaf, { dropGeneric: false });
      const leafHits = leafK.filter(w => stems.has(w));
      const leafCoverage = leafK.length > 0 ? leafHits.length / leafK.length : 0;
      const ancK = Array.from(new Set(p.chain.slice(0, -1).filter(s => s !== USER_MENU_ROOT).flatMap(s => leafKey(s))));
      const ancCoverage = ancK.length > 0 ? ancK.filter(w => stems.has(w)).length / ancK.length : 0;
      const titleDice = dice(leafK, titleStems);
      const moduleBonus = roots.includes(p.chain[0]) ? 1 : 0;
      const score = 0.6 * leafCoverage + 0.2 * titleDice + 0.1 * ancCoverage + 0.1 * moduleBonus;
      return { p, score: round(score), leafCoverage, leafHits, titleDice, ancCoverage, moduleBonus };
    })
    .filter(s => s.leafCoverage > 0)
    .sort((a, b) => b.score - a.score || pathText(a.p.chain).localeCompare(pathText(b.p.chain)));

  const topCandidates = scored.slice(0, 5).map(s => ({ chain: [...s.p.chain], score: s.score }));
  const best = scored[0];
  const second = scored[1];
  const margin = best ? round(best.score - (second ? second.score : 0)) : 0;
  if (!best || best.score < CLOSED_SEMANTIC_MIN_SCORE || margin < CLOSED_SEMANTIC_MIN_MARGIN) {
    return {
      status: SEM_EQUIVALENTE_NA_ARVORE,
      topCandidates,
      justification: best
        ? `melhor candidato "${pathText(best.p.chain)}" com ${best.score} (limiar ${CLOSED_SEMANTIC_MIN_SCORE}) e margem ${margin} (mínimo ${CLOSED_SEMANTIC_MIN_MARGIN}): sem destino inequívoco`
        : 'nenhum radical de folha do catálogo aparece no título nem nos passos 1 a 3'
    };
  }
  return {
    status: 'resolved',
    chain: [...best.p.chain],
    score: best.score,
    margin,
    justification:
      `folha "${best.p.chain[best.p.chain.length - 1]}": radicais [${best.leafHits.join(', ')}] no texto (cobertura ${Math.round(best.leafCoverage * 100)}%), ` +
      `Dice com o título ${round(best.titleDice)}, ancestrais ${Math.round(best.ancCoverage * 100)}%, bônus de módulo ${best.moduleBonus}; ` +
      `margem ${margin} sobre "${second ? pathText(second.p.chain) : '—'}" (candidato a confirmar na árvore lida ao vivo)`
  };
}

/** Prompt fechado para um LLM opcional (`agy`): a resposta precisa ser UMA cadeia literal da lista ou o token. */
export function buildClosedSemanticPrompt(input: ClosedSemanticInput, catalog: MenuCatalog = loadMenuCatalog()): string {
  const list = catalog.paths.map((p, i) => `${i + 1}. ${pathText(p.chain)}`).join('\n');
  const steps = (input.stepTexts || [])
    .slice(0, 3)
    .map((s, i) => `Passo ${i + 1}: ${s}`)
    .join('\n');
  return [
    `Você classifica rotinas do manual do Orion TN (versão ${catalog.version}) na árvore REAL de menus.`,
    'Escolha a tela que a rotina abre, EXCLUSIVAMENTE entre os caminhos da lista fechada abaixo.',
    `Se nenhum caminho for inequivocamente o destino, responda exatamente ${SEM_EQUIVALENTE_NA_ARVORE}.`,
    'Responda com UMA ÚNICA LINHA: o caminho copiado literalmente da lista (sem o número) ou o token. Nenhum outro texto.',
    '',
    `Título da rotina: ${input.routineTitle || '(sem título)'}`,
    `Módulo: ${input.modulo || '(não informado)'}`,
    steps,
    '',
    'Lista fechada de caminhos:',
    list
  ].join('\n');
}

/**
 * Aceita SOMENTE uma cadeia literal da lista fechada (igualdade do caminho inteiro, sem acento/caixa) ou o token
 * `SEM_EQUIVALENTE_NA_ARVORE`. Qualquer outro texto (explicação, numeração, várias linhas, cadeia fora da lista) -> null.
 */
export function parseClosedSemanticAnswer(
  raw: string,
  catalog: MenuCatalog = loadMenuCatalog()
): { status: 'resolved'; chain: string[] } | { status: typeof SEM_EQUIVALENTE_NA_ARVORE } | null {
  let text = String(raw ?? '').trim();
  text = text.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length !== 1) return null;
  let line = lines[0];
  for (let i = 0; i < 2; i++) line = line.replace(/^(\*\*|["'`“”])/, '').replace(/(\*\*|["'`“”])$/, '').trim();
  if (line === SEM_EQUIVALENTE_NA_ARVORE) return { status: SEM_EQUIVALENTE_NA_ARVORE };
  const norm = canonNormalize(line);
  const hit = catalog.paths.find(p => pathText(p.chain) === line) ?? catalog.paths.find(p => canonNormalize(pathText(p.chain)) === norm);
  // A normalização apaga o `>`: uma cadeia de vários segmentos só vale se veio com os separadores
  if (!hit || (hit.chain.length > 1 && !line.includes('>'))) return null;
  return { status: 'resolved', chain: [...hit.chain] };
}
