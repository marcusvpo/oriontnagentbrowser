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

export interface ExplicitMenuEquivalence {
  /** Prefixo documentado (normalizado por `canonNormalize`); casa por prefixo de segmentos */
  documented: string[];
  /** Cadeia real equivalente */
  real: string[];
  /** Os segmentos do manual depois do prefixo viram abas/seções da tela real */
  tailFromRest?: boolean;
  /** Prova da mineração: por que o destino é único e inequívoco */
  evidence: string;
}

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
  }
];

const startsWithSegments = (docNorm: string[], prefix: string[]) =>
  prefix.length <= docNorm.length && prefix.every((p, i) => p === docNorm[i]);

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
    if (!exists(eq.real)) continue;
    const rest = documented.slice(eq.documented.length);
    // Sem `tailFromRest`, só casa o caminho exato do prefixo (não há segmentos sobrando a explicar)
    if (rest.length > 0 && !eq.tailFromRest) continue;
    return {
      chain: eq.real,
      tail: rest,
      consumed: eq.documented.length,
      basis: 'explicit_equivalence',
      evidence: `Equivalência canônica "${pathText(documented.slice(0, eq.documented.length))}" -> "${pathText(eq.real)}": ${eq.evidence}`
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
