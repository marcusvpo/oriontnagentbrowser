/**
 * Equivalências canônicas de caminhos de menu legados do manual -> árvore real do Orion TN 6.0 (ADR-029).
 *
 * Módulo PURO (sem navegador, sem importar o SmartLocator): usado pelo `chooseMenuItem` (`menu-path.ts`), pelo
 * minerador `mine-att-clusters.ts` e pelos testes offline. Nada aqui é evidência: toda resolução só vale se a
 * cadeia real devolvida EXISTE na árvore lida ao vivo nesta execução (o chamador confere) e é registrada como
 * divergência `menu_path_resolution` no relatório (o texto do manual nunca é reescrito fora da Trava de Evidência).
 *
 * Três regras, em ordem:
 * 1. `explicit_equivalence`: tabela de destinos únicos e inequívocos, provados pela mineração (ex.: o submenu
 *    legado `Administração > Parâmetros` virou a tela `Configurações > Parametrizações`).
 * 2. `generic_leaf_key`: sob o MAIOR prefixo que existe na árvore real, o irmão cuja chave de folha é igual à da
 *    folha documentada (sem acento, sem plural, sem palavras genéricas como "Consulta de"/"Tipos de"). Se mais de
 *    um irmão casar, é ambiguidade: não resolve.
 * 3. `tail_as_screen_section`: o prefixo existente termina numa folha SEM filhos e o manual cita mais segmentos;
 *    os segmentos restantes são abas/seções da tela dessa folha (ex.: `Configurações > Parametrizações > Consumo
 *    de Insumos`). O chamador mede a aba ao vivo; sem aba medida, a rotina segue bloqueada.
 *
 * ADR-037: a tabela explícita ganhou curingas de segmento (`*`, `palavra*`), `keepRestAsPath` (o resto do manual é
 * re-resolvido sob a cadeia real) e destinos no menu do usuário (`userMenu`, raiz `Olá, [usuário]` que casa com a
 * raiz real `Olá, <nome>`). A cadeia devolvida é sempre a do item REAL lido agora. Entradas provadas contra o
 * catálogo canônico 06.05.02 (`menu-catalog.ts`, 115 caminhos finais).
 */

export interface CanonicalMenuItem {
  chain: string[];
  hasChildren: boolean;
  disabled?: boolean;
}

export type CanonicalMenuBasis = 'explicit_equivalence' | 'generic_leaf_key' | 'tail_as_screen_section';

export interface CanonicalMenuResolution {
  /** Cadeia real (a existir na árvore lida agora) */
  chain: string[];
  /** Segmentos do manual que sobram como aba/seção da tela alcançada */
  tail: string[];
  /** Quantos segmentos do manual a cadeia real substitui (prefixo) */
  consumed: number;
  basis: CanonicalMenuBasis;
  /** Frase de evidência para o relatório (fatos lidos da árvore, nunca suposição) */
  evidence: string;
}

/** Normalização sem acento/pontuação, minúscula. */
export function canonNormalize(text: string): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const STOPWORDS = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'ou', 'para', 'com', 'em', 'no', 'na', 'nos', 'nas', 'a', 'o', 'as', 'os']);
/** Palavras que só qualificam o tipo de tela e não distinguem uma folha da outra */
const GENERIC_WORDS = new Set(['consulta', 'consultas', 'cadastro', 'cadastros', 'gestao', 'tela', 'modulo', 'tipo', 'tipos', 'listagem']);

/** Radical leve: plural -> singular (`certidoes`->`certidao`, `firmas`->`firma`, `reconhecimentos`->`reconhecimento`). */
export function canonStem(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('oes') || word.endsWith('aes')) return word.slice(0, -3) + 'ao';
  if (word.endsWith('ais')) return word.slice(0, -2) + 'l';
  // Plural em -ens -> singular em -em (`itens`->`item`, `ordens`->`ordem`, `viagens`->`viagem`) (ADR-037)
  if (word.endsWith('ens')) return word.slice(0, -3) + 'em';
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/** Conjunto de radicais distintivos de um rótulo de menu. */
export function leafKey(text: string, opts: { dropGeneric?: boolean } = {}): string[] {
  const dropGeneric = opts.dropGeneric !== false;
  const words = canonNormalize(text)
    .split(/[\s/]+/)
    .filter(w => w && !STOPWORDS.has(w))
    .map(canonStem)
    .filter(w => !(dropGeneric && GENERIC_WORDS.has(w)));
  return Array.from(new Set(words)).sort();
}

const sameKey = (a: string[], b: string[]) => a.length > 0 && a.length === b.length && a.every((w, i) => w === b[i]);

const sameChain = (a: string[], b: string[]) =>
  a.length === b.length && a.every((s, i) => canonNormalize(s) === canonNormalize(b[i]));

/** Alternativas do rótulo separadas por barra (`Fichas / Cartões de Assinatura`) */
export function leafAlternatives(text: string): string[] {
  const parts = String(text ?? '')
    .split(/\s\/\s/)
    .map(s => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

/**
 * Raiz canônica do menu do usuário no canto superior direito (ADR-037). A aplicação a exibe com o nome do usuário
 * logado (`Olá, <nome>`); o catálogo e a tabela explícita usam este marcador, que casa com qualquer `Olá, <nome>`.
 */
export const USER_MENU_ROOT = 'Olá, [usuário]';

/**
 * Verdadeiro para o marcador `Olá, [usuário]` ou para o rótulo real `Olá, <nome>` (com vírgula logo após "Olá").
 * A saudação fantasma `Olá Fulano , seja bem-vindo!` (sem vírgula após "Olá") NÃO é a raiz do menu do usuário.
 */
export function isUserMenuRootLabel(label: string): boolean {
  const raw = String(label ?? '').trim();
  if (canonNormalize(raw) === canonNormalize(USER_MENU_ROOT)) return true;
  return /^ol[aá],\s*\S/i.test(raw);
}

export interface ExplicitMenuEquivalence {
  /**
   * Prefixo documentado (normalizado por `canonNormalize`); casa por prefixo de segmentos. Curingas (ADR-037):
   * `*` casa qualquer segmento único; `palavra*` casa o segmento igual a `palavra` ou que começa por `palavra `
   * (palavra inteira, nunca substring intra-palavra).
   */
  documented: string[];
  /** Cadeia real equivalente (`Olá, [usuário]` casa com a raiz real `Olá, <nome>`) */
  real: string[];
  /** Os segmentos do manual depois do prefixo viram abas/seções da tela real */
  tailFromRest?: boolean;
  /**
   * ADR-037: os segmentos do manual depois do prefixo são ACRESCENTADOS à cadeia real e re-resolvidos na árvore
   * (texto igual ou mesma chave de folha; filho direto primeiro, depois descendente único). Se a re-resolução
   * parar numa folha sem filhos e `tailFromRest` também estiver ligado, o que sobra vira aba/seção; caso contrário
   * a entrada não se aplica (nada é adivinhado).
   */
  keepRestAsPath?: boolean;
  /**
   * ADR-037: destino no menu do usuário (`Olá, <nome>`, canto superior direito). O chamador abre esse menu
   * suspenso como qualquer raiz da barra; a cadeia devolvida é a real lida agora (com o nome do usuário).
   */
  userMenu?: boolean;
  /** Prova da mineração: por que o destino é único e inequívoco */
  evidence: string;
}

/** Segmento documentado (já normalizado) x padrão da tabela, com os curingas `*` e `palavra*`. */
export function documentedSegmentMatches(pattern: string, segmentNorm: string): boolean {
  if (pattern === '*') return segmentNorm.length > 0;
  if (pattern.endsWith('*')) {
    const base = pattern.slice(0, -1).trim();
    return base.length > 0 && (segmentNorm === base || segmentNorm.startsWith(base + ' '));
  }
  return pattern === segmentNorm;
}

/** Atalho de entradas do menu do usuário: o mesmo destino citado sob `Configurações`/`Usuários` no manual legado. */
const userMenuEquivalences = (leaf: string, spellings: string[], evidence: string): ExplicitMenuEquivalence[] => {
  const prefixes = [['configuracoes', 'usuarios'], ['configuracoes'], ['usuarios']];
  return prefixes.flatMap(prefix =>
    spellings.map(spelling => ({
      documented: [...prefix, spelling],
      real: [USER_MENU_ROOT, leaf],
      userMenu: true,
      evidence
    }))
  );
};

const USER_MENU_EVIDENCE =
  'no Orion TN 06.05.02 as credenciais do próprio usuário ficam no menu "Olá, [usuário]" (canto superior direito: Alterar senha, Fale conosco, Autenticação em dois fatores, Cadastrar biometria — print 20-ola-usuario.png) e não em Configurações, que só abriga Usuários e Perfis e permissões de acesso (C-ACESSO-03/C-ACESSO-04: Raio-X apontou "Olá, [usuário] > Alterar senha")';

/**
 * Destinos únicos e inequívocos, provados contra a árvore real de 140 itens e a tela alcançada (Raio-X).
 * Mais específicos primeiro. Cada entrada só é aplicada se a cadeia real existir na árvore lida ao vivo.
 */
export const EXPLICIT_MENU_EQUIVALENCES: ExplicitMenuEquivalence[] = [
  {
    documented: ['administracao', 'parametros', 'modelos de etiqueta'],
    real: ['Configurações', 'Modelos de impressão', 'Etiquetas diversas'],
    evidence: 'único item de etiquetas da árvore real; o submenu legado "Parâmetros" não existe mais em Administração'
  },
  {
    documented: ['administracao', 'parametros'],
    real: ['Configurações', 'Parametrizações'],
    tailFromRest: true,
    evidence:
      'o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)'
  },
  {
    documented: ['certidoes', 'novo pedido de certidao'],
    real: ['Notas', 'Nova certidão e serviço'],
    evidence: 'o módulo raiz "Certidões" foi absorvido por "Notas"; "Nova certidão e serviço" é o único item de criação de pedido de certidão'
  },
  {
    documented: ['balcao de firmas', 'fichas / cartoes de assinatura'],
    real: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
    evidence: 'o "Balcão de Firmas" é "Firmas" no Orion TN 6.0 e o único cadastro de fichas é "Cartão de assinatura"'
  },
  {
    documented: ['configuracoes', 'cadastros auxiliares', 'naturezas de atos'],
    real: ['Configurações', 'Cadastros auxiliares', 'Natureza'],
    evidence: '"Natureza" é o único irmão em Cadastros auxiliares com o radical natureza (tela #/natureza: Espécie, Natureza, Comunicação)'
  },
  {
    documented: ['configuracoes', 'cadastros auxiliares', 'categoria de produto'],
    real: ['Administração', 'Controle de Estoque', 'Cadastros', 'Categoria'],
    evidence: '"Categoria" aparece uma única vez na árvore real (irmã de "Produto", em Controle de Estoque > Cadastros)'
  },
  // ---- ADR-037: equivalências mineradas dos bloqueios [ATT]/[XRX] contra o catálogo canônico 06.05.02 (115 caminhos) ----
  {
    documented: ['configuracoes', 'parametros gerais'],
    real: ['Configurações', 'Parametrizações'],
    tailFromRest: true,
    evidence:
      'não há submenu "Parâmetros Gerais" em Configurações; os parâmetros globais ficam na tela única "Configurações > Parametrizações" (C-FIRMA-08, C-CENTRAL-04, C-SELO-03)'
  },
  {
    documented: ['configuracoes', 'parametros de nfs e'],
    real: ['Configurações', 'Parametrizações'],
    tailFromRest: true,
    evidence: 'não há submenu "Parâmetros de NFS-e" em Configurações; o único destino de parâmetros é "Configurações > Parametrizações" (C-FIRMA-06)'
  },
  {
    documented: ['configuracoes', 'parametros do modulo firmas'],
    real: ['Configurações', 'Parametrizações'],
    tailFromRest: true,
    evidence:
      'não há submenu "Parâmetros do Módulo Firmas" em Configurações; o único destino de parâmetros é "Configurações > Parametrizações" (C-FIRMA-07)'
  },
  {
    documented: ['configuracoes', 'parametros de integracao'],
    real: ['Configurações', 'Parametrizações'],
    tailFromRest: true,
    evidence:
      'não há submenu "Parâmetros de Integração" em Configurações; o único destino de parâmetros é "Configurações > Parametrizações" (C-SELO-04)'
  },
  {
    documented: ['configuracoes', 'grupos e perfis de acesso'],
    real: ['Configurações', 'Perfis e permissões de acesso'],
    evidence:
      'Configurações não tem "Grupos e Perfis de Acesso"; a única tela de perfis/grupos de acesso é "Configurações > Perfis e permissões de acesso" (C-ACESSO-06, C-ACESSO-07; print 14-configuracoes.png)'
  },
  {
    documented: ['notas', 'cadastros auxiliares', 'grupo de itens'],
    real: ['Configurações', 'Tabela de custas', 'Grupo de item'],
    evidence:
      '"Grupo de item" é o único item da árvore com a chave grupo+item (Configurações > Tabela de custas); a telemetria de M-62.0/M-63.0 mediu o nó real "Grupo de item" (M-63.0)'
  },
  {
    documented: ['notas', 'cadastros auxiliares'],
    real: ['Configurações', 'Cadastros auxiliares'],
    keepRestAsPath: true,
    evidence:
      'o submenu "Cadastros auxiliares" existe só em Configurações (Notas não tem cadastros auxiliares no 06.05.02); a folha citada é re-resolvida sob ele (M-61.0 "Naturezas", M-34.0/M-35.0 "Tipos de anexo" segue sem destino)'
  },
  {
    documented: ['administracao', 'cadastros auxiliares'],
    real: ['Configurações', 'Cadastros auxiliares'],
    keepRestAsPath: true,
    evidence:
      'o submenu "Cadastros auxiliares" existe só em Configurações; a folha citada é re-resolvida sob ele (M-34.0 alternativa, "Administração > Cadastros auxiliares > Área de atuação" -> Pessoa física > Área de Atuação)'
  },
  {
    documented: ['notas', 'certidoes', 'consulta de certidoes'],
    real: ['Notas', 'Consultas', 'Certidões e serviços'],
    evidence: '"Certidões e serviços" em Notas > Consultas é a única tela de consulta de certidões da árvore (D-3.15)'
  },
  {
    documented: ['notas', 'certidoes', 'novo pedido de certidao'],
    real: ['Notas', 'Nova certidão e serviço'],
    evidence: '"Nova certidão e serviço" é o único item de criação de pedido de certidão (D-3.14)'
  },
  {
    documented: ['notas', 'pedido de certidao'],
    real: ['Notas', 'Nova certidão e serviço'],
    evidence: 'Notas não tem "Pedido de certidão"; o único item de criação de pedido de certidão é "Notas > Nova certidão e serviço" (M-54.0, M-54.1)'
  },
  {
    documented: ['firmas', 'atendimento', 'abertura de pedido com senha'],
    real: ['Firmas', 'Abertura de pedido'],
    evidence: 'Firmas não tem submenu "Atendimento"; "Abertura de pedido" é o único item de abertura de pedido da árvore (M-13.0)'
  },
  {
    documented: ['livros'],
    real: ['Administração', 'Controle de Livros'],
    tailFromRest: true,
    evidence:
      'não existe raiz "Livros" na barra do 06.05.02; a única tela de gestão de livros é "Administração > Controle de Livros" (C-LIVRO-01, C-LIVRO-05)'
  },
  {
    documented: ['configuracoes', 'livros notariais'],
    real: ['Administração', 'Controle de Livros'],
    tailFromRest: true,
    evidence: 'Configurações não tem "Livros Notariais"; a única tela de gestão de livros é "Administração > Controle de Livros" (C-LIVRO-02)'
  },
  {
    documented: ['firmas', 'livros'],
    real: ['Administração', 'Controle de Livros'],
    tailFromRest: true,
    evidence: 'Firmas não tem "Livros"; a única tela de gestão de livros é "Administração > Controle de Livros" (M-22.0, C-FIRMA-02)'
  },
  {
    documented: ['orion estoque'],
    real: ['Administração', 'Controle de Estoque'],
    keepRestAsPath: true,
    tailFromRest: true,
    evidence:
      'o antigo módulo "Orion Estoque" é o submenu "Administração > Controle de Estoque" (Aquisição, Distribuição, Consumo manual, Consultas, Cadastros); a folha citada é re-resolvida sob ele (C-LIVRO-07)'
  },
  {
    documented: ['administracao', 'consultas', 'estoque'],
    real: ['Administração', 'Controle de Estoque', 'Consultas'],
    evidence: 'Administração não tem submenu "Consultas"; a única consulta de estoque é "Administração > Controle de Estoque > Consultas" (V-3.0)'
  },
  {
    documented: ['modulos', 'selo digital', 'auditoria*'],
    real: ['Administração', 'Comunicações', 'Auditoria de Selos'],
    evidence: 'não existe raiz "Módulos"; "Auditoria de Selos" (Administração > Comunicações) é a única tela de auditoria do selo digital no menu (C-SELO-01)'
  },
  ...userMenuEquivalences('Alterar senha', ['alterar senha', 'alteracao de senha', 'trocar senha'], USER_MENU_EVIDENCE),
  ...userMenuEquivalences(
    'Autenticação em dois fatores',
    ['autenticacao em dois fatores', 'autenticacao de dois fatores', '2fa'],
    USER_MENU_EVIDENCE
  ),
  ...userMenuEquivalences('Cadastrar biometria', ['cadastrar biometria', 'cadastro de biometria'], USER_MENU_EVIDENCE),
  ...userMenuEquivalences('Fale conosco', ['fale conosco'], USER_MENU_EVIDENCE)
];

const startsWithSegments = (docNorm: string[], prefix: string[]) =>
  prefix.length <= docNorm.length && prefix.every((p, i) => documentedSegmentMatches(p, docNorm[i]));

/** Segmento da árvore real x segmento da tabela explícita (o marcador do menu do usuário casa `Olá, <nome>`). */
const sameRealSegment = (itemSeg: string, realSeg: string) =>
  realSeg === USER_MENU_ROOT ? isUserMenuRootLabel(itemSeg) : canonNormalize(itemSeg) === canonNormalize(realSeg);

const matchesRealChain = (itemChain: string[], real: string[]) =>
  itemChain.length === real.length && itemChain.every((s, i) => sameRealSegment(s, real[i]));

/** Rótulo do manual x rótulo real: texto igual (sem acento/caixa) ou mesma chave de folha não vazia. */
function labelMatches(documentedLabel: string, realLabel: string): 'exact' | 'leaf_key' | null {
  const alternatives = leafAlternatives(documentedLabel);
  const real = canonNormalize(realLabel);
  if (alternatives.some(a => canonNormalize(a) === real)) return 'exact';
  const realKey = leafKey(realLabel);
  if (alternatives.some(a => sameKey(leafKey(a), realKey))) return 'leaf_key';
  return null;
}

/**
 * Re-resolve os segmentos restantes do manual sob um nó real (`keepRestAsPath`, ADR-037): filho direto com texto
 * igual/mesma chave; sem filho, descendente ÚNICO com texto igual/mesma chave. Para no primeiro segmento sem destino
 * único e devolve até onde chegou.
 */
function descendRestAsPath(
  start: CanonicalMenuItem,
  rest: string[],
  items: CanonicalMenuItem[]
): { node: CanonicalMenuItem; consumedRest: number; steps: string[] } {
  let node = start;
  const steps: string[] = [];
  let consumedRest = 0;
  for (const seg of rest) {
    if (!node.hasChildren) break;
    const under = (i: CanonicalMenuItem) =>
      i.chain.length > node.chain.length && node.chain.every((s, k) => canonNormalize(s) === canonNormalize(i.chain[k]));
    const pick = (pool: CanonicalMenuItem[]) => {
      const exact = pool.filter(i => labelMatches(seg, i.chain[i.chain.length - 1]) === 'exact');
      if (exact.length > 0) return exact;
      return pool.filter(i => labelMatches(seg, i.chain[i.chain.length - 1]) === 'leaf_key');
    };
    const descendants = items.filter(under);
    let hits = pick(descendants.filter(i => i.chain.length === node.chain.length + 1));
    if (hits.length === 0) hits = pick(descendants);
    if (hits.length !== 1) break;
    steps.push(`"${seg}" ≡ "${hits[0].chain[hits[0].chain.length - 1]}"`);
    node = hits[0];
    consumedRest++;
  }
  return { node, consumedRest, steps };
}

const pathText = (segments: string[]) => segments.join(' > ');

/**
 * Resolve um caminho documentado contra a árvore real. `null` = sem equivalência comprovável (a rota segue
 * bloqueada com `[ATT]`; nada é adivinhado). A função é determinística e independente da ordem dos itens.
 */
export function resolveCanonicalMenuPath(documented: string[], items: CanonicalMenuItem[]): CanonicalMenuResolution | null {
  if (documented.length < 2) return null;
  const docNorm = documented.map(canonNormalize);
  const exists = (chain: string[]) => items.some(i => sameChain(i.chain, chain));
  const find = (chain: string[]) => items.find(i => sameChain(i.chain, chain));

  // 1. Tabela explícita (mais específica primeiro)
  for (const eq of EXPLICIT_MENU_EQUIVALENCES) {
    if (!startsWithSegments(docNorm, eq.documented)) continue;
    // A cadeia devolvida é a REAL lida agora (no menu do usuário, `Olá, <nome>`), nunca o marcador da tabela
    const realItems = items.filter(i => matchesRealChain(i.chain, eq.real));
    if (realItems.length !== 1) continue;
    const realItem = realItems[0];
    const rest = documented.slice(eq.documented.length);
    const head = `Equivalência canônica "${pathText(documented.slice(0, eq.documented.length))}" -> "${pathText(realItem.chain)}": ${eq.evidence}`;
    if (rest.length > 0 && eq.keepRestAsPath) {
      // ADR-037: o resto do manual é re-resolvido sob a cadeia real; o que não resolver só vira aba numa folha sem filhos
      const { node, consumedRest, steps } = descendRestAsPath(realItem, rest, items);
      const remaining = rest.slice(consumedRest);
      if (remaining.length > 0 && !(eq.tailFromRest && !node.hasChildren)) continue;
      if (remaining.length === 0 && node.hasChildren) continue; // o manual terminou num submenu: não há tela a abrir
      return {
        chain: node.chain,
        tail: remaining,
        consumed: documented.length - remaining.length,
        basis: 'explicit_equivalence',
        evidence:
          head +
          (steps.length > 0 ? `; folha re-resolvida na árvore real: ${steps.join('; ')}` : '') +
          (remaining.length > 0 ? `; "${remaining.join(' > ')}" é seção/aba da tela alcançada` : '')
      };
    }
    // Sem `tailFromRest`, só casa o caminho exato do prefixo (não há segmentos sobrando a explicar)
    if (rest.length > 0 && !eq.tailFromRest) continue;
    return {
      chain: realItem.chain,
      tail: rest,
      consumed: eq.documented.length,
      basis: 'explicit_equivalence',
      evidence: head
    };
  }

  // 2. e 3. Descida pela árvore real, a partir do maior prefixo que existe
  let prefix: string[] = [];
  for (let k = 1; k <= documented.length; k++) {
    if (!exists(documented.slice(0, k))) break;
    prefix = documented.slice(0, k);
  }
  if (prefix.length === 0) return null;

  let current = prefix.map((_, i) => find(documented.slice(0, i + 1))!.chain[i]);
  let consumed = prefix.length;
  const viaKey: string[] = [];
  while (consumed < documented.length) {
    const here = find(current);
    if (!here) return null;
    if (!here.hasChildren) {
      // 3. folha sem filhos: o que sobra do manual é aba/seção da tela dessa folha
      if (viaKey.length === 0 && consumed === prefix.length && current.length < 2) return null;
      return {
        chain: current,
        tail: documented.slice(consumed),
        consumed,
        basis: viaKey.length > 0 ? 'generic_leaf_key' : 'tail_as_screen_section',
        evidence:
          viaKey.length > 0
            ? `Equivalência de folha: ${viaKey.join('; ')}; "${pathText(current)}" é folha sem filhos e "${documented.slice(consumed).join(' > ')}" é seção/aba da tela`
            : `"${pathText(current)}" existe na árvore real como folha sem filhos; "${documented.slice(consumed).join(' > ')}" é seção/aba da tela alcançada`
      };
    }
    // 2. irmão com a mesma chave de folha sob o prefixo existente
    const docSeg = documented[consumed];
    const siblings = items.filter(i => i.chain.length === current.length + 1 && sameChain(i.chain.slice(0, -1), current));
    const alternatives = leafAlternatives(docSeg).map(a => leafKey(a));
    const hits = siblings.filter(s => {
      const key = leafKey(s.chain[s.chain.length - 1]);
      return alternatives.some(a => sameKey(a, key));
    });
    if (hits.length !== 1) return null;
    const hit = hits[0];
    viaKey.push(`"${docSeg}" ≡ "${hit.chain[hit.chain.length - 1]}" (mesma chave de folha sob "${pathText(current)}")`);
    current = hit.chain;
    consumed++;
  }
  if (viaKey.length === 0) return null; // caminho idêntico ao documentado: não é equivalência
  return {
    chain: current,
    tail: [],
    consumed,
    basis: 'generic_leaf_key',
    evidence: `Equivalência de folha: ${viaKey.join('; ')}`
  };
}
