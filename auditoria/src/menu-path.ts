import type { AgentBrowserClient } from './browser.js';
import { resolveMenuPathViaHumanReview } from './human-review-rag.js';
import { AGY_DEFAULT_TIMEOUT_MS, invokeAgyText } from './agy-client.js';
import { canonNormalize, isUserMenuRootLabel, resolveCanonicalMenuPath, USER_MENU_ROOT, type CanonicalMenuBasis } from './menu-canonical.js';
import {
  buildClosedSemanticPrompt,
  chainUnderAnchor,
  closedSemanticAnchor,
  parseClosedSemanticAnswer,
  resolveClosedSemantic,
  resolveSingleSegmentScreen,
  SEM_EQUIVALENTE_NA_ARVORE,
  type ClosedSemanticResolution,
  type SingleSegmentResolution
} from './menu-catalog.js';
import { detectImplicitScreenNavigation, IMPLICIT_NAV_MAX_STEP, type ImplicitScreenNavigation } from './menu-implicit-nav.js';
import { COHERENCE_CHECKED_BASES } from './menu-landing-coherence.js';
import { closeActiveModals } from './modal-scope.js';
import { findRouteEntriesByTabOrSection } from './route-crawler.js';
import { computeDiceSimilarity, normalizeText } from './smart-locator.js';
import type { BoundingBox, MenuPathMissingEvidence, RoutineStep, SmartLocatorDivergence, SmartLocatorResult } from './types.js';

/**
 * Navegação Encadeada por Segmentos com Auto-Cura de Rota (ADR-016) e Cascata com Hover Persistente
 * e Multi-Demarcação (ADR-017).
 *
 * Um passo do KB pode citar um caminho de menu (`A > B > C`). O caminho não existe como texto na tela:
 * cada segmento é um item da árvore de navegação superior. Este módulo:
 * 1. extrai os caminhos citados no passo;
 * 2. lê a árvore de menus real no DOM e carimba cada item com um atributo único;
 * 3. escolhe o item folha (caminho exato ou, se o caminho documentado divergir, a folha homônima);
 * 4. abre a cascata com o ponteiro REAL do navegador (`mouse move`), percorrendo o centro de cada
 *    nível por dentro da geometria segura do submenu, e estaciona o ponteiro na folha;
 * 5. mede todos os níveis no mesmo frame: cada um vira uma demarcação numerada (1, 2, 3...) da print.
 *
 * Um item que a aplicação marca como bloqueado/oculto para o perfil logado não é "inexistente": o
 * passo é devolvido como bloqueio por privilégio (ADR-017), sem cura para outra rota.
 */

/** Caminho de menu citado no texto de um passo. */
export interface DocumentedMenuPath {
  segments: string[];
  /** Trecho do passo que será substituído no texto validado quando a rota for curada */
  sourceText: string;
}

/** Item da árvore de navegação real, com o seletor (carimbo) de cada nó do seu caminho. */
export interface MenuTreeItem {
  chain: string[];
  selectors: string[];
  /** Bloqueado ou oculto para o perfil logado (classe `disabled` ou `ngx-orion-hide`) */
  disabled: boolean;
  /** Mensagem da própria aplicação para o bloqueio (atributo `title` do item) */
  blockTitle?: string;
  hasChildren: boolean;
}

export interface MenuPathMatch {
  item: MenuTreeItem;
  documented: DocumentedMenuPath;
  /** O caminho real é idêntico ao documentado */
  exact: boolean;
  /** O item existe na árvore, mas está bloqueado/oculto para o perfil logado */
  blocked?: boolean;
  confidence: number;
  reason: string;
  /** Escolhido pela rota comprovada numa auditoria anterior e reconfirmada na árvore real (ADR-025) */
  viaPriorAudit?: boolean;
  /** Empate resolvido pela menor profundidade de cadeia no mesmo módulo raiz (ADR-028) */
  depthTieBreak?: { chosen: string; discarded: string[] };
  /** Equivalência canônica (ADR-029): segmentos do manual que viram aba/seção da tela alcançada */
  tail?: string[];
  /** Quantos segmentos do manual a cadeia real substituiu (só com `canonicalBasis`) */
  consumed?: number;
  canonicalBasis?: CanonicalMenuBasis;
  /** Base da cura das Camadas 2/3 da ADR-037 (tela de segmento único ou semântica fechada) */
  cureBasis?: MenuCureBasis;
}

/**
 * Bases de cura de navegação. As três primeiras vêm da ADR-029 (`menu-canonical.ts`); as demais da ADR-037:
 * `single_segment_screen` (Camada 2: tela citada sem `>` nos passos 1 a 3), `closed_semantic` (Camada 3 determinística)
 * e `closed_semantic_agy` (Camada 3 via `agy`, só em `--visual-mode live`).
 */
export type MenuCureBasis = CanonicalMenuBasis | 'single_segment_screen' | 'closed_semantic' | 'closed_semantic_agy';

/** Contexto da rotina para as Camadas 2 e 3 da ADR-037. Sem contexto, as duas camadas ficam desligadas. */
export interface MenuNavigationContext {
  modulo?: string;
  routineTitle?: string;
  /** Texto bruto dos passos 1 a 3 da rotina (Camada 3) */
  stepTexts?: string[];
  /** Texto bruto dos passos seguintes ao atual (desempate de homônimos na Camada 2) */
  nextStepsText?: string[];
  /** Camada 3 via `agy` (só quando o modo visual é `live`); falha do `agy` nunca bloqueia */
  allowAgy?: boolean;
}

/** Decisão pura das Camadas 2/3 (sem navegador): navegar até um item da árvore VIVA, ou não. */
export type MenuNavigationPlan =
  | {
      kind: 'navigate';
      basis: 'single_segment_screen' | 'closed_semantic' | 'closed_semantic_agy';
      item: MenuTreeItem;
      /** Cadeia do catálogo canônico (o marcador `Olá, [usuário]` vira a raiz real em `item.chain`) */
      catalogChain: string[];
      confidence: number;
      evidence: string;
    }
  | { kind: 'no_equivalent'; closed: Extract<ClosedSemanticResolution, { status: typeof SEM_EQUIVALENTE_NA_ARVORE }> }
  | { kind: 'skip'; reason: string; single?: SingleSegmentResolution; closed?: ClosedSemanticResolution };

const MENU_LEAF_SYNONYMS: Record<string, string[]> = {
  'balcao de firmas': ['reconhecimento de firmas']
};

const NAV_TREE_ROOT_SELECTOR = '.navbar ul.nav, nav ul.nav, #navbar ul.nav';
const LEAF_MIN_SIMILARITY = 0.8;
const MAX_GAP_BETWEEN_BOLD_SEGMENTS = 40;
const MAX_CASCADE_ATTEMPTS = 3;

function splitSegments(text: string): string[] {
  return text
    .split('>')
    .map(s => s.replace(/\*\*/g, '').trim())
    .filter(Boolean);
}

/**
 * Extrai os caminhos de menu de um passo. Reconhece as duas formas usadas no KB:
 * - um único alvo em negrito com separadores: `**Notas > Cadastros auxiliares > Perfil de partes**`;
 * - alvos em negrito encadeados por `>`: `**Configurações** > submenu **Usuários**`.
 */
export function extractMenuPaths(step: RoutineStep): DocumentedMenuPath[] {
  const paths: DocumentedMenuPath[] = [];
  const text = step.rawText;
  const bolds = Array.from(text.matchAll(/\*\*([^*]+)\*\*/g)).map(m => ({
    inner: m[1].trim(),
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length
  }));

  let chain: typeof bolds = [];
  const flush = () => {
    if (chain.length >= 2) {
      paths.push({
        segments: chain.map(b => b.inner),
        sourceText: text.slice(chain[0].start, chain[chain.length - 1].end)
      });
    }
    chain = [];
  };

  for (const bold of bolds) {
    if (bold.inner.includes('>')) {
      flush();
      const segments = splitSegments(bold.inner);
      if (segments.length >= 2) {
        paths.push({ segments, sourceText: text.slice(bold.start, bold.end) });
      }
      continue;
    }
    const previous = chain[chain.length - 1];
    if (previous) {
      const gap = text.slice(previous.end, bold.start);
      if (!gap.includes('>') || gap.length > MAX_GAP_BETWEEN_BOLD_SEGMENTS) flush();
    }
    chain.push(bold);
  }
  flush();

  // Alvos vindos de sub-itens (fora da linha principal do passo)
  for (const target of step.targets) {
    if (!target.includes('>')) continue;
    const segments = splitSegments(target);
    if (segments.length >= 2 && !paths.some(p => p.segments.join('>') === segments.join('>'))) {
      paths.push({ segments, sourceText: `**${target}**` });
    }
  }
  return paths;
}

/**
 * Script injetável (via `eval --stdin`) que percorre a árvore de navegação superior, carimba cada
 * item com um atributo único e devolve a lista de itens com o caminho real de cada um.
 * O token vai no NOME do atributo (sem `=` nem aspas) para atravessar o `cmd.exe` intacto.
 */
export function buildMenuTreeScript(): string {
  return `
    (() => {
      for (const prev of window.__orionMenuStamps || []) {
        try { prev[0].removeAttribute(prev[1]); } catch (e) {}
      }
      window.__orionMenuStamps = [];
      const token = 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
      const clean = t => (t || '').replace(/\\s+/g, ' ').trim();
      const hiddenByApp = li =>
        /(^|\\s)ngx-orion-hide(\\s|$)/.test(typeof li.className === 'string' ? li.className : '') ||
        li.style?.display === 'none';
      const blocked = li => /(^|\\s)disabled(\\s|$)/.test(typeof li.className === 'string' ? li.className : '');
      const items = [];

      const walk = (ul, chain, selectors, inheritedDisabled, inheritedTitle) => {
        for (const li of Array.from(ul.children)) {
          if (li.tagName !== 'LI') continue;
          if (hiddenByApp(li)) continue;
          const aList = Array.from(li.children).filter(c => c.tagName === 'A');
          const a =
            aList.find(
              c =>
                c.style?.display !== 'none' &&
                (!window.getComputedStyle || window.getComputedStyle(c).display !== 'none')
            ) || aList[0];
          const sub = Array.from(li.children).find(c => c.tagName === 'UL');
          const ownBlocked = blocked(li);
          const disabled = inheritedDisabled || ownBlocked;
          const blockTitle = ownBlocked
            ? (clean(li.getAttribute('title')) || 'Item desabilitado pela aplicação')
            : inheritedTitle;
          let nextChain = chain;
          let nextSelectors = selectors;
          const text = a ? clean(a.textContent) : '';
          if (a && text) {
            const attr = 'data-orion-audit-menu-' + token + '-' + items.length;
            a.setAttribute(attr, '');
            window.__orionMenuStamps.push([a, attr]);
            nextChain = chain.concat(text);
            nextSelectors = selectors.concat('[' + attr + ']');
            items.push({ chain: nextChain, selectors: nextSelectors, disabled, blockTitle: disabled ? blockTitle : undefined, hasChildren: !!sub });
            for (const altA of aList) {
              if (altA === a) continue;
              const altText = clean(altA.textContent);
              if (altText && altText.toLowerCase() !== text.toLowerCase()) {
                items.push({ chain: chain.concat(altText), selectors: nextSelectors, disabled, blockTitle: disabled ? blockTitle : undefined, hasChildren: !!sub });
              }
            }
          }
          if (sub) walk(sub, nextChain, nextSelectors, disabled, blockTitle);
        }
      };

      const roots = Array.from(document.querySelectorAll(${JSON.stringify(NAV_TREE_ROOT_SELECTOR)}))
        .filter(u => !u.parentElement || !u.parentElement.closest('ul'));
      for (const root of roots) walk(root, [], [], false, undefined);
      return JSON.stringify(items);
    })()
  `;
}

export function parseMenuTreeResponse(raw: string | null | undefined): MenuTreeItem[] {
  if (!raw || raw === 'null' || raw === 'undefined') return [];
  try {
    const first = JSON.parse(raw);
    const parsed = typeof first === 'string' ? JSON.parse(first) : first;
    return Array.isArray(parsed) ? (parsed as MenuTreeItem[]) : [];
  } catch {
    return [];
  }
}

const sameChain = (a: string[], b: string[]) =>
  a.length === b.length && a.every((seg, i) => normalizeText(seg) === normalizeText(b[i]));

/**
 * Escolhe, na árvore real, o item que corresponde a um dos caminhos documentados.
 * - Caminho idêntico ao documentado: rota válida, sem divergência. Se esse item estiver bloqueado
 *   para o perfil logado, o resultado é `blocked` (ADR-017): nunca se cura para outra rota.
 * - Senão, Auto-Cura de Rota: a folha documentada é procurada em toda a árvore (texto igual ou
 *   Sørensen–Dice >= 0.80) e vence a que compartilha mais segmentos ancestrais com o manual.
 * - Empate entre folhas homônimas em rotas diferentes é ambiguidade: retorna `null` (o passo
 *   bloqueia em vez de adivinhar a tela).
 * - Se a folha só existe em itens bloqueados para o perfil, o resultado também é `blocked`.
 */
export function chooseMenuItem(
  paths: DocumentedMenuPath[],
  items: MenuTreeItem[],
  priorChains: string[][] = [],
  options: { ignoreDisabledBlocks?: boolean; routineId?: string } = {}
): MenuPathMatch | null {
  const eligible = items.filter(i => i.chain.length >= 2);
  const usable = eligible.filter(i => !i.disabled);

  for (const documented of paths) {
    const pool = options.ignoreDisabledBlocks ? usable : eligible;
    const exact = pool.find(i => sameChain(i.chain, documented.segments));
    if (exact) {
      // Fase 4 (piloto M-1.0): o caminho do manual termina num SUBMENU em cascata (`Administração > Mensalistas`)
      // cuja única tela homônima é o filho direto de mesmo nome (`Administração > Mensalistas > Mensalistas`).
      // Clicar no submenu não abre tela; desce-se ao filho homônimo, só quando ele é único, e a cura vai ao relatório.
      if (exact.hasChildren && !exact.disabled) {
        const leafNorm = normalizeText(exact.chain[exact.chain.length - 1]);
        const homonymChildren = pool.filter(
          i =>
            i.chain.length === exact.chain.length + 1 &&
            sameChain(i.chain.slice(0, -1), exact.chain) &&
            normalizeText(i.chain[i.chain.length - 1]) === leafNorm
        );
        if (homonymChildren.length === 1 && !homonymChildren[0].disabled && !homonymChildren[0].hasChildren) {
          const child = homonymChildren[0];
          return {
            item: child,
            documented,
            exact: false,
            confidence: 0.95,
            reason: `O caminho documentado "${exact.chain.join(' > ')}" termina num submenu em cascata; a única tela homônima é o item filho "${child.chain.join(' > ')}"`
          };
        }
      }
      return exact.disabled
        ? { item: exact, documented, exact: true, blocked: true, confidence: 1, reason: exact.blockTitle || 'Item bloqueado para o perfil logado' }
        : { item: exact, documented, exact: true, confidence: 1, reason: 'Caminho de menu idêntico ao documentado' };
    }
  }

  // ADR-027 (Camada 0.1): Diretriz soberana da revisão humana (routine_reviews) e grafo cruzado
  for (const documented of paths) {
    const guide = resolveMenuPathViaHumanReview(options.routineId, documented.segments);
    if (!guide) continue;
    const hit = usable.find(i => sameChain(i.chain, guide.targetChain));
    if (!hit) continue;
    return {
      item: hit,
      documented,
      exact: false,
      confidence: guide.viaDirectReview ? 0.98 : 0.94,
      reason: guide.reason
    };
  }

  // ADR-025: rota comprovada numa auditoria anterior. Só vale se o item EXISTE na árvore lida agora (a dica
  // nunca é evidência) e a sua folha ainda é a do manual (similaridade >= 0.80): a guarda da ADR-024 contra a
  // falsa cura de menu continua intacta. Resolve de forma determinística o que antes dependia do desempate.
  for (const prior of priorChains) {
    const hit = usable.find(i => sameChain(i.chain, prior));
    if (!hit) continue;
    const leaf = hit.chain[hit.chain.length - 1];
    for (const documented of paths) {
      const docLeaf = documented.segments[documented.segments.length - 1];
      const normLeaf = normalizeText(leaf);
      const normDocLeaf = normalizeText(docLeaf);
      const canonicalHit = (MENU_LEAF_SYNONYMS[normDocLeaf] || []).map(normalizeText).includes(normLeaf);
      const similarity = normLeaf === normDocLeaf ? 1 : canonicalHit ? 0.92 : computeDiceSimilarity(leaf, docLeaf);
      if (similarity < LEAF_MIN_SIMILARITY) continue;
      return {
        item: hit,
        documented,
        exact: false,
        confidence: Number(Math.min(0.95, similarity * 0.8 + 0.15).toFixed(2)),
        reason: 'Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução',
        viaPriorAudit: true
      };
    }
  }

  // ADR-029: equivalência canônica provada pela mineração dos bloqueios `[ATT]` (tabela explícita, chave de folha
  // sob o prefixo real e cauda como aba/seção da tela). A cadeia real PRECISA existir na árvore lida agora (a tabela
  // nunca é evidência) e a divergência é registrada no relatório; o texto do manual só muda pela Trava de Evidência.
  // O resolvedor precisa das RAÍZES (profundidade 1) para achar o maior prefixo existente; só os itens bloqueados
  // para o perfil ficam de fora.
  const canonicalPool = items.filter(i => !i.disabled);
  for (const documented of paths) {
    const canon = resolveCanonicalMenuPath(documented.segments, canonicalPool);
    if (!canon) continue;
    const hit = usable.find(i => sameChain(i.chain, canon.chain));
    if (!hit) continue;
    return {
      item: hit,
      documented,
      exact: false,
      confidence: canon.basis === 'explicit_equivalence' ? 0.9 : 0.88,
      reason: canon.evidence,
      tail: canon.tail.length > 0 ? canon.tail : undefined,
      consumed: canon.consumed,
      canonicalBasis: canon.basis
    };
  }

  const scoreLeaf = (pool: MenuTreeItem[], documented: DocumentedMenuPath) => {
    const docLeaf = documented.segments[documented.segments.length - 1];
    const normDocLeaf = normalizeText(docLeaf);
    const docLeafSynonyms = (MENU_LEAF_SYNONYMS[normDocLeaf] || []).map(normalizeText);
    const docAncestors = documented.segments.slice(0, -1).map(normalizeText);
    const scored = pool
      .map(item => {
        const leaf = item.chain[item.chain.length - 1];
        const normLeaf = normalizeText(leaf);
        const exactLeaf = normLeaf === normDocLeaf;
        const canonicalSynonym = !exactLeaf && docLeafSynonyms.includes(normLeaf);
        const leafSimilarity = exactLeaf ? 1 : canonicalSynonym ? 0.92 : computeDiceSimilarity(leaf, docLeaf);
        const ancestors = item.chain.slice(0, -1).map(normalizeText);
        const shared = docAncestors.filter(seg => ancestors.includes(seg)).length;
        return {
          item,
          leafSimilarity,
          canonicalSynonym,
          shared,
          score: leafSimilarity * 10 + shared - (item.hasChildren ? 0.5 : 0)
        };
      })
      .filter(s => s.leafSimilarity >= LEAF_MIN_SIMILARITY)
      .sort((a, b) => b.score - a.score);
    return { scored, docAncestors };
  };

  for (const documented of paths) {
    const { scored, docAncestors } = scoreLeaf(usable, documented);
    if (scored.length === 0) continue;
    let best = scored[0];
    const tiedAll = scored.filter(s => s.score === best.score);
    let depthTieBreak: { chosen: string; discarded: string[] } | undefined;
    if (tiedAll.length > 1) {
      // ADR-028: empate entre folhas do mesmo módulo raiz com profundidades diferentes (ex.: `Notas > Protocolos`
      // operacional x `Notas > Consultas > Protocolos` de consulta) desempata pela MENOR profundidade de cadeia.
      // Na mesma profundidade, ou em módulos raiz diferentes, segue a ambiguidade (bloqueio): não se adivinha a tela.
      const sameRoot = tiedAll.every(s => normalizeText(s.item.chain[0]) === normalizeText(tiedAll[0].item.chain[0]));
      if (!sameRoot) continue;
      const minDepth = Math.min(...tiedAll.map(s => s.item.chain.length));
      const shallowest = tiedAll.filter(s => s.item.chain.length === minDepth);
      if (shallowest.length !== 1) continue;
      best = shallowest[0];
      depthTieBreak = {
        chosen: best.item.chain.join(' > '),
        discarded: tiedAll.filter(s => s !== best).map(s => s.item.chain.join(' > '))
      };
    }

    const confidence = Math.min(
      0.95,
      best.leafSimilarity * 0.8 + (docAncestors.length ? (0.15 * best.shared) / docAncestors.length : 0)
    );
    const docLeaf = documented.segments[documented.segments.length - 1];
    const baseReason = best.canonicalSynonym
      ? `Equivalência canônica de menu: "${docLeaf}" -> "${best.item.chain[best.item.chain.length - 1]}" (${best.shared} de ${docAncestors.length} segmentos ancestrais coincidem)`
      : `Item "${best.item.chain[best.item.chain.length - 1]}" localizado na árvore de navegação em outra rota (${best.shared} de ${docAncestors.length} segmentos ancestrais coincidem)`;
    return {
      item: best.item,
      documented,
      exact: false,
      confidence: Number(confidence.toFixed(2)),
      reason: depthTieBreak
        ? `${baseReason}. Auto-cura por menor profundidade de cadeia: "${depthTieBreak.chosen}" (profundidade ${best.item.chain.length}) escolhida entre ${[depthTieBreak.chosen, ...depthTieBreak.discarded].map(c => `"${c}"`).join(' e ')}`
        : baseReason,
      depthTieBreak
    };
  }

  // ADR-030: consulta auxiliar ao grafo vivo de rotas (orion-route-graph.json) quando a folha
  // documentada é uma aba ou seção única de uma tela cujo menu existe na árvore viva.
  for (const documented of paths) {
    if (documented.segments.length < 2) continue;
    const docLeaf = documented.segments[documented.segments.length - 1];
    const hints = findRouteEntriesByTabOrSection(docLeaf, undefined, { moduloHint: documented.segments[0] })
      .filter(h => h.score >= 0.84 && (h.matchedIn === 'tab' || h.matchedIn === 'section'));
    const usableHints = hints
      .map(h => ({ hint: h, item: usable.find(i => sameChain(i.chain, h.entry.chain)) }))
      .filter((pair): pair is { hint: typeof hints[number]; item: MenuTreeItem } => Boolean(pair.item));
    if (usableHints.length === 0) continue;

    const topScore = usableHints[0].hint.score;
    const topTied = usableHints.filter(u => u.hint.score === topScore);
    let chosen = topTied.length === 1 ? topTied[0] : null;
    if (!chosen) {
      const modNorm = canonNormalize(documented.segments[0]);
      const sameMod = topTied.filter(u => canonNormalize(u.item.chain[0]) === modNorm);
      if (sameMod.length === 1) chosen = sameMod[0];
    }
    if (chosen) {
      const kindPt = chosen.hint.matchedIn === 'tab' ? 'aba' : 'seção';
      return {
        item: chosen.item,
        documented,
        exact: false,
        confidence: Number(Math.min(0.88, chosen.hint.score).toFixed(2)),
        reason: `Grafo vivo de rotas (orion-route-graph.json): "${docLeaf}" é ${kindPt} "${chosen.hint.matchedLabel}" da tela "${chosen.item.chain.join(' > ')}"`,
        tail: [docLeaf],
        consumed: documented.segments.length - 1,
        canonicalBasis: 'tail_as_screen_section'
      };
    }
  }

  // Nenhuma folha acessível: a folha documentada existe, mas só em itens bloqueados para o perfil?
  if (!options.ignoreDisabledBlocks) {
    for (const documented of paths) {
      const { scored } = scoreLeaf(eligible.filter(i => i.disabled), documented);
      if (scored.length > 0) {
        const best = scored[0];
        return {
          item: best.item,
          documented,
          exact: false,
          blocked: true,
          confidence: Number(Math.min(0.95, best.leafSimilarity * 0.8).toFixed(2)),
          reason: best.item.blockTitle || 'Item bloqueado para o perfil logado'
        };
      }
    }
  }
  return null;
}

/**
 * Evidência real de um caminho documentado que não existe na árvore de navegação (ADR-024). Percorre a
 * hierarquia lida do DOM segmento a segmento (`Notas` -> `Certidões` -> `Novo Pedido de Certidão`) e
 * registra o maior prefixo que existe, o que há nesse nível e onde a folha aparece, se aparecer.
 */
export function buildMenuPathMissingEvidence(paths: DocumentedMenuPath[], items: MenuTreeItem[]): MenuPathMissingEvidence {
  const documented = paths.reduce((a, b) => (b.segments.length > a.segments.length ? b : a), paths[0]);
  const segs = documented.segments;
  const roots = items.filter(i => i.chain.length === 1).map(i => neutralUserMenuChain(i.chain)[0]);

  let existing: string[] = [];
  for (let k = 1; k < segs.length; k++) {
    if (!items.some(i => sameChain(i.chain, segs.slice(0, k)))) break;
    existing = segs.slice(0, k);
  }
  const siblings = items
    .filter(i => i.chain.length === existing.length + 1 && existing.every((seg, idx) => normalizeText(seg) === normalizeText(i.chain[idx])))
    .map(i => neutralUserMenuChain(i.chain)[i.chain.length - 1]);

  const leaf = segs[segs.length - 1];
  const leafElsewhereSet = new Set(
    items
      .filter(i => {
        const l = i.chain[i.chain.length - 1];
        return normalizeText(l) === normalizeText(leaf) || computeDiceSimilarity(l, leaf) >= LEAF_MIN_SIMILARITY;
      })
      .map(i => i.chain.join(' > '))
  );
  for (const h of findRouteEntriesByTabOrSection(leaf, undefined, { moduloHint: segs[0] })) {
    if (h.score < 0.84) continue;
    const kindPt = h.matchedIn === 'tab' ? 'aba' : h.matchedIn === 'section' ? 'seção' : 'título';
    leafElsewhereSet.add(`${h.entry.chain.join(' > ')} (${kindPt}: ${h.matchedLabel})`);
  }
  // A evidência vai para o relatório: a raiz real do menu do usuário nunca expõe o nome do usuário
  const leafElsewhere = Array.from(new Set(Array.from(leafElsewhereSet).map(r => neutralizeUserMenuText(r, items))));

  return {
    documented: segs.join(' > '),
    existingPrefix: existing,
    missingSegment: segs[existing.length] ?? leaf,
    siblings,
    roots,
    treeSize: items.length,
    leafElsewhere: leafElsewhere.length > 0 ? leafElsewhere : undefined
  };
}

/** Frase de evidência (relatório e bloqueio `[ATT]`) de um caminho de menu inexistente, só com fatos lidos da árvore. */
export function describeMenuPathMissing(e: MenuPathMissingEvidence): string {
  const found = e.existingPrefix.length > 0 ? `**${e.existingPrefix.join(' > ')}**` : null;
  const where = found
    ? `O menu ${found} existe na barra de navegação e contém: ${e.siblings.length > 0 ? e.siblings.map(s => `"${s}"`).join(', ') : '(nenhum subitem)'}; "${e.missingSegment}" não está entre eles.`
    : `O menu raiz "${e.missingSegment}" não existe na barra de navegação (menus lidos: ${e.roots.map(r => `"${r}"`).join(', ') || 'nenhum'}).`;
  const elsewhere =
    e.leafElsewhere && e.leafElsewhere.length > 0
      ? ` Item de nome igual ou parecido em outra rota (apenas pista, não validado como equivalente): ${e.leafElsewhere.map(r => `"${r}"`).join('; ')}.`
      : ` Nenhum item de nome igual ou parecido existe em outro ponto da árvore (${e.treeSize} itens lidos).`;
  const closed = e.closedSemantic
    ? ` Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): ${SEM_EQUIVALENTE_NA_ARVORE} — ${e.closedSemantic.justification}${
        e.closedSemantic.topCandidates.length > 0 ? `; candidatos mais próximos: ${e.closedSemantic.topCandidates.map(c => `"${c}"`).join('; ')}` : ''
      }.`
    : '';
  return `O caminho "${e.documented}" não existe na árvore de navegação real do Orion TN. ${where}${elsewhere}${closed} Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto.`;
}

// ------------------------------------------------------------------------------------------------------------------
// ADR-037: Camadas 2 (tela citada sem `>`) e 3 (semântica fechada) — decisão PURA sobre a árvore lida ao vivo
// ------------------------------------------------------------------------------------------------------------------

/** Segmento do catálogo casa com o segmento vivo (`Olá, [usuário]` casa com a raiz real `Olá, <nome>`). */
const catalogSegmentMatches = (catalogSeg: string, liveSeg: string) =>
  catalogSeg === USER_MENU_ROOT ? isUserMenuRootLabel(liveSeg) : canonNormalize(catalogSeg) === canonNormalize(liveSeg);

/**
 * Item da árvore VIVA (não bloqueado) que corresponde a uma cadeia do catálogo canônico. O catálogo nunca é evidência:
 * sem item vivo único, `null` (nada é navegado).
 */
/**
 * Cadeia para TEXTO (manual, divergência, relatório, rótulo da demarcação): a raiz real do menu do usuário
 * (`Olá, <nome>`) vira o marcador neutro `Olá, [usuário]`. A travessia e a medição seguem com a cadeia viva.
 */
export function neutralUserMenuChain(chain: string[]): string[] {
  return chain.length > 0 && chain[0] !== USER_MENU_ROOT && isUserMenuRootLabel(chain[0]) ? [USER_MENU_ROOT, ...chain.slice(1)] : [...chain];
}

/** Substitui, num texto livre, toda raiz real do menu do usuário lida na árvore viva pelo marcador neutro. */
export function neutralizeUserMenuText(text: string, items: Array<Pick<MenuTreeItem, 'chain'>>): string {
  const liveRoots = Array.from(
    new Set(items.map(i => i.chain[0]).filter(r => r && r !== USER_MENU_ROOT && isUserMenuRootLabel(r)))
  ).sort((a, b) => b.length - a.length);
  let out = String(text ?? '');
  for (const root of liveRoots) out = out.split(root).join(USER_MENU_ROOT);
  // Rede de segurança: saudação com nome próprio vinda de outra fonte (ex.: evidência da tabela de equivalências)
  return out.replace(/\bOl[aá],\s*(?!\[usu)[A-ZÀ-Ý][\p{L}'.-]*/gu, USER_MENU_ROOT);
}

export function liveItemForCatalogChain(catalogChain: string[], items: MenuTreeItem[]): MenuTreeItem | null {
  const hits = items.filter(
    i => !i.disabled && i.chain.length === catalogChain.length && i.chain.every((seg, k) => catalogSegmentMatches(catalogChain[k], seg))
  );
  // Itens alternativos do mesmo `<li>` repetem os seletores: contam como um só nó
  const distinct = Array.from(new Map(hits.map(h => [h.selectors.join('|'), h])).values());
  return distinct.length === 1 ? distinct[0] : null;
}

/** `location.hash` da tela inicial do Orion TN (nenhuma tela de rotina aberta). */
export function isHomeHash(hash: string | null | undefined): boolean {
  const h = String(hash ?? '').split('?')[0].replace(/\/+$/, '').toLowerCase();
  return h === '' || h === '#' || h === '#/inicio' || h === '#/home';
}

/** O `href` (hash) da folha é a tela já aberta? Ignora query string e id numérico final. */
export function isAlreadyOnScreen(currentHash: string | null | undefined, leafHref: string | null | undefined): boolean {
  const key = (h: string) =>
    String(h ?? '')
      .split('?')[0]
      .replace(/\/\d+$/, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  const href = String(leafHref ?? '').trim();
  if (!href.startsWith('#/')) return false;
  const cur = key(String(currentHash ?? ''));
  return cur !== '' && cur === key(href);
}

/**
 * Passo de navegação implícita acionável: a ação do passo é o clique de navegação. Em passo de formulário
 * ("Na tela **X**, preencha...") o executor preencheria o item de menu: as Camadas 2/3 não se aplicam.
 */
export function isImplicitNavigationActionable(step: Pick<RoutineStep, 'actionType'>): boolean {
  return step.actionType === 'click' || step.actionType === 'navigate';
}

const SINGLE_SEGMENT_CONFIDENCE: Record<string, number> = { exact_leaf: 0.92, screen_alias: 0.9, leaf_key: 0.88 };

/**
 * Camada 2 (e Camada 3 quando o rótulo não está no catálogo): decide, sem navegador, se o passo `Acesse **X**` vira
 * navegação até um item da árvore viva.
 * - `resolveSingleSegmentScreen` resolvido para uma TELA (folha) que existe viva -> `single_segment_screen`;
 * - homônimo não desempatado, submenu intermediário ou cadeia ausente na árvore viva -> `skip` (nada é adivinhado);
 * - rótulo fora do catálogo: Camada 3 determinística, SÓ na tela inicial (depois que a rotina abriu uma tela, o
 *   negrito pode ser elemento dessa tela). Sem destino inequívoco -> `skip` (o passo segue o fluxo normal).
 */
export function planImplicitScreenNavigation(input: {
  step: Pick<RoutineStep, 'stepNumber' | 'rawText' | 'actionType'>;
  implicit: ImplicitScreenNavigation;
  items: MenuTreeItem[];
  context: MenuNavigationContext;
  atHome: boolean;
}): MenuNavigationPlan {
  const { step, implicit, items, context } = input;
  if (step.stepNumber > IMPLICIT_NAV_MAX_STEP) return { kind: 'skip', reason: `passo ${step.stepNumber} > ${IMPLICIT_NAV_MAX_STEP}` };
  if (!isImplicitNavigationActionable(step)) return { kind: 'skip', reason: `ação "${step.actionType}" não é navegação` };

  const single = resolveSingleSegmentScreen(implicit.label, {
    modulo: context.modulo,
    routineTitle: context.routineTitle,
    nextStepsText: context.nextStepsText
  });
  if (single.status === 'resolved') {
    if (!single.isLeaf) return { kind: 'skip', reason: `"${single.chain.join(' > ')}" é submenu, não tela`, single };
    const item = liveItemForCatalogChain(single.chain, items);
    if (!item) return { kind: 'skip', reason: `"${single.chain.join(' > ')}" não existe (ou não é único) na árvore lida ao vivo`, single };
    return {
      kind: 'navigate',
      basis: 'single_segment_screen',
      item,
      catalogChain: single.chain,
      confidence: SINGLE_SEGMENT_CONFIDENCE[single.basis] ?? 0.88,
      evidence: `Tela citada sem caminho (Camada 2, ADR-037): ${single.evidence}`
    };
  }
  if (single.status === 'ambiguous') return { kind: 'skip', reason: single.evidence, single };

  if (!input.atHome) return { kind: 'skip', reason: 'rótulo fora do catálogo e a rotina já não está na tela inicial', single };
  const closed = resolveClosedSemantic({ stepTexts: context.stepTexts || [step.rawText], modulo: context.modulo, routineTitle: context.routineTitle });
  return planFromClosedSemantic(closed, items, { single, onNoEquivalent: 'skip' });
}

/**
 * Camada 3 para um caminho explícito (`A > B`) dos passos 1 a 3 que não existe na árvore viva nem por equivalência:
 * destino inequívoco que existe vivo -> `closed_semantic`; senão `no_equivalent` (bloqueio `[ATT]` rápido com a
 * justificativa e os candidatos, sem explorar menus).
 */
export function planExplicitClosedSemantic(input: {
  step: Pick<RoutineStep, 'stepNumber' | 'rawText'>;
  items: MenuTreeItem[];
  context: MenuNavigationContext;
  /** Segmentos do caminho documentado: a Camada 3 fica restrita ao maior prefixo dele que existe no catálogo */
  documentedChain?: string[];
}): MenuNavigationPlan {
  if (input.step.stepNumber > IMPLICIT_NAV_MAX_STEP) return { kind: 'skip', reason: `passo ${input.step.stepNumber} > ${IMPLICIT_NAV_MAX_STEP}` };
  const closed = resolveClosedSemantic({
    stepTexts: input.context.stepTexts || [input.step.rawText],
    modulo: input.context.modulo,
    routineTitle: input.context.routineTitle,
    documentedChain: input.documentedChain
  });
  return planFromClosedSemantic(closed, input.items, { onNoEquivalent: 'no_equivalent' });
}

function planFromClosedSemantic(
  closed: ClosedSemanticResolution,
  items: MenuTreeItem[],
  opts: { single?: SingleSegmentResolution; onNoEquivalent: 'skip' | 'no_equivalent' }
): MenuNavigationPlan {
  if (closed.status === 'resolved') {
    const item = liveItemForCatalogChain(closed.chain, items);
    if (item) {
      return {
        kind: 'navigate',
        basis: 'closed_semantic',
        item,
        catalogChain: closed.chain,
        confidence: Number(Math.min(0.9, Math.max(0.7, closed.score)).toFixed(2)),
        evidence: `Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): "${closed.chain.join(' > ')}" — ${closed.justification}`
      };
    }
    const reason = `a semântica fechada indicou "${closed.chain.join(' > ')}", que não existe (ou não é único) na árvore lida ao vivo`;
    if (opts.onNoEquivalent === 'skip') return { kind: 'skip', reason, single: opts.single, closed };
    return {
      kind: 'no_equivalent',
      closed: { status: SEM_EQUIVALENTE_NA_ARVORE, topCandidates: [{ chain: closed.chain, score: closed.score }], justification: reason }
    };
  }
  if (opts.onNoEquivalent === 'skip') return { kind: 'skip', reason: closed.justification, single: opts.single, closed };
  return { kind: 'no_equivalent', closed };
}

/**
 * Resposta do `agy` (Camada 3 opcional) aceita só se for cadeia literal do catálogo, estiver sob a MESMA âncora do
 * caminho documentado que a Camada 3 determinística usa (`closedSemanticAnchor`) E existir na árvore viva.
 */
export function planFromAgyAnswer(raw: string | null | undefined, items: MenuTreeItem[], documentedChain?: string[]): MenuNavigationPlan | null {
  if (!raw) return null;
  const parsed = parseClosedSemanticAnswer(raw);
  if (!parsed || parsed.status !== 'resolved') return null;
  if (!chainUnderAnchor(parsed.chain, closedSemanticAnchor(documentedChain))) return null;
  const item = liveItemForCatalogChain(parsed.chain, items);
  if (!item) return null;
  return {
    kind: 'navigate',
    basis: 'closed_semantic_agy',
    item,
    catalogChain: parsed.chain,
    confidence: 0.75,
    evidence: `Semântica fechada via agy sobre a lista fechada do catálogo canônico (Camada 3, ADR-037): "${parsed.chain.join(' > ')}" (resposta literal da lista, confirmada na árvore lida ao vivo)`
  };
}

/** Converte a decisão `navigate` num `MenuPathMatch` curado (nunca `exact`: a divergência sempre é registrada). */
export function matchFromNavigationPlan(
  plan: Extract<MenuNavigationPlan, { kind: 'navigate' }>,
  documented: DocumentedMenuPath
): MenuPathMatch {
  return { item: plan.item, documented, exact: false, confidence: plan.confidence, reason: plan.evidence, cureBasis: plan.basis };
}

/** Caminho sintético de um único segmento para a tela citada sem `>` (o `sourceText` é o negrito do manual). */
export function syntheticPathFromImplicit(implicit: ImplicitScreenNavigation): DocumentedMenuPath {
  return { segments: [implicit.label], sourceText: implicit.sourceText };
}

const describeClosedForEvidence = (closed: Extract<ClosedSemanticResolution, { status: typeof SEM_EQUIVALENTE_NA_ARVORE }>) => ({
  justification: closed.justification,
  topCandidates: closed.topCandidates.map(c => `${c.chain.join(' > ')} (${c.score})`)
});

/** Camada 3 via `agy`: só no modo `live`, nunca bloqueia (qualquer falha devolve `null`). */
async function askAgyClosedSemantic(
  context: MenuNavigationContext,
  step: RoutineStep,
  items: MenuTreeItem[],
  documentedChain?: string[]
): Promise<MenuNavigationPlan | null> {
  if (!context.allowAgy || process.env.ORION_MENU_AGY === 'false') return null;
  try {
    const prompt = buildClosedSemanticPrompt({
      stepTexts: context.stepTexts || [step.rawText],
      modulo: context.modulo,
      routineTitle: context.routineTitle,
      documentedChain
    });
    const raw = await invokeAgyText({ prompt, timeoutMs: AGY_DEFAULT_TIMEOUT_MS });
    const plan = planFromAgyAnswer(raw, items, documentedChain);
    if (plan?.kind === 'navigate') console.log(`   [Rota de Menu] Camada 3 (agy): "${plan.catalogChain.join(' > ')}" confirmada na árvore viva.`);
    return plan;
  } catch {
    return null;
  }
}

interface CascadeRect {
  vis: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Caixa da lista filha (`ul`) do item, quando existe e está visível */
  ul?: { x: number; y: number; r: number; b: number };
}

/** Lê, num único `eval`, a caixa e a visibilidade de cada nível da cascata e da sua lista filha. */
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
        const out = { vis: vis(a), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
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

const centerX = (r: CascadeRect) => r.x + Math.round(r.w / 2);
const centerY = (r: CascadeRect) => r.y + Math.round(r.h / 2);

/**
 * Abre a cascata com o ponteiro real e o deixa estacionado na folha (ADR-017).
 *
 * Os submenus do Orion TN abrem por CSS (`.dropdown-submenu:hover > .dropdown-menu`): existem só
 * enquanto o ponteiro está dentro do `li` do submenu ou da sua lista filha. Por isso, de um nível
 * para o seguinte, o ponteiro percorre um corredor em "L" que nunca sai dessa união:
 *   centro do item -> trecho horizontal, na faixa do próprio item, até entrar na lista filha ->
 *   trecho vertical até a linha do próximo item -> centro do próximo item.
 * A folha é descendente de todos os níveis: com o ponteiro sobre ela, a cadeia inteira fica aberta.
 * Cada trecho é conferido no DOM; `hover` por seletor e `focus` (que aciona o `openSubMenu` nativo)
 * são alternativas se um nível não abrir.
 */
export async function openCascadeWithPointer(client: AgentBrowserClient, selectors: string[]): Promise<CascadeRect[] | null> {
  const last = selectors.length - 1;

  for (let attempt = 1; attempt <= MAX_CASCADE_ATTEMPTS; attempt++) {
    let rects = await readCascade(client, selectors);
    if (!rects || !rects[0]?.vis) return null;

    // Nível 0: o menu de topo abre por clique. Um menu já aberto não recebe novo clique (fecharia).
    for (let tries = 0; tries < 3 && !rects[1]?.vis; tries++) {
      try {
        await client.click(selectors[0]);
      } catch {
        await closeActiveModals(client).catch(() => undefined);
      }
      await client.wait(400);
      rects = (await readCascade(client, selectors)) || rects;
    }
    if (!rects[1]?.vis) continue;

    let ok = true;
    for (let i = 1; i <= last; i++) {
      const item = rects[i];
      if (!item.vis) {
        ok = false;
        break;
      }
      await client.mouseMove(centerX(item), centerY(item));
      if (i === last) break;

      await client.wait(250);
      rects = (await readCascade(client, selectors)) || rects;
      if (!rects[i + 1]?.vis) {
        // Alternativas: hover por seletor e, por fim, foco (abre o submenu pelo handler nativo)
        for (const fallback of [() => client.hover(selectors[i]), () => client.focus(selectors[i])]) {
          try {
            await fallback();
          } catch {}
          await client.wait(300);
          rects = (await readCascade(client, selectors)) || rects;
          if (rects[i + 1]?.vis) break;
        }
      }
      const next = rects[i + 1];
      if (!next?.vis) {
        ok = false;
        break;
      }

      // Corredor em "L" por dentro de `li ∪ ul`
      const cur = rects[i];
      const ul = cur.ul;
      const y0 = centerY(cur);
      if (ul && y0 > ul.y && y0 < ul.b) {
        const enterX = ul.r <= cur.x + 2 ? ul.r - 8 : ul.x >= cur.x + cur.w - 2 ? ul.x + 8 : centerX(next);
        await client.mouseMove(enterX, y0);
        await client.mouseMove(enterX, centerY(next));
      }
    }
    if (!ok) continue;

    await client.wait(300);
    const settled = await readCascade(client, selectors);
    if (settled && settled.every(r => r.vis)) return settled;
    console.log(`   [Rota de Menu] Cascata instável na tentativa ${attempt}/${MAX_CASCADE_ATTEMPTS}; reabrindo.`);
  }
  return null;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Expande o `sourceText` do caminho resolvido para englobar alternativas `"ou **Y**"` / `"(ou **Y**)"`
 * inexistentes na árvore de navegação real, permitindo removê-las no texto revisado (ADR-026).
 */
export function expandMenuOrAlternativeSpan(
  rawText: string,
  paths: DocumentedMenuPath[],
  matchedDoc: DocumentedMenuPath,
  items: MenuTreeItem[]
): { span: string; removedAlternatives: string[] } {
  let span = matchedDoc.sourceText;
  const removedAlternatives: string[] = [];
  if (paths.length < 2 || !rawText.includes(span)) return { span, removedAlternatives };

  const usable = items.filter(i => !i.disabled);
  const siblings = paths.filter(p => p !== matchedDoc && p.sourceText !== matchedDoc.sourceText && rawText.includes(p.sourceText));

  for (const sib of siblings) {
    const siblingExists = usable.some(i => sameChain(i.chain, sib.segments));
    if (siblingExists) continue;
    const eSpan = escapeRegExp(span);
    const eSib = escapeRegExp(sib.sourceText);
    const patterns = [
      new RegExp(`${eSpan}\\s*\\(\\s*ou\\s+${eSib}\\s*\\)`, 'i'),
      new RegExp(`${eSpan}\\s+(?:ou|/)\\s+${eSib}`, 'i'),
      new RegExp(`${eSib}\\s*\\(\\s*ou\\s+${eSpan}\\s*\\)`, 'i'),
      new RegExp(`${eSib}\\s+(?:ou|/)\\s+${eSpan}`, 'i')
    ];
    for (const re of patterns) {
      const m = rawText.match(re);
      if (m) {
        span = m[0];
        removedAlternatives.push(sib.segments.join(' > '));
        break;
      }
    }
  }
  return { span, removedAlternatives };
}

/**
 * Resolve um passo de caminho de menu de ponta a ponta. Retorna `null` quando o passo não cita
 * caminho de menu ou quando nenhuma folha da árvore corresponde (o chamador segue o fluxo normal).
 */
export async function resolveAndNavigateMenuPath(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  priorChains: string[][] = [],
  options: { ignoreDisabledBlocks?: boolean; context?: MenuNavigationContext } = {}
): Promise<SmartLocatorResult | null> {
  const paths = extractMenuPaths(step);
  const context = options.context;

  // ADR-037 Camada 2: "Acesse **X**" sem `>` nos passos 1 a 3. Só com o contexto da rotina (executor do KB) e só em
  // passo cuja ação é o clique de navegação. A cadeia do catálogo é CANDIDATA: precisa existir na árvore lida agora e
  // é percorrida segmento a segmento pela mesma cascata real dos caminhos explícitos.
  if (paths.length === 0) {
    if (!context) return null;
    const implicit = detectImplicitScreenNavigation(step);
    if (!implicit || !isImplicitNavigationActionable(step)) return null;
    return resolveImplicitScreenNavigation(client, step, rawScreenshotPath, implicit, context);
  }

  const items = parseMenuTreeResponse(await client.eval(buildMenuTreeScript()));
  const documentedLabel = paths.map(p => p.segments.join(' > ')).join(' | ');
  if (items.length === 0) {
    // Sem barra de navegação na tela (portal, página em branco, erro): é falha técnica, não defasagem do manual
    const detail = 'a árvore de navegação (barra de menus) não foi encontrada na tela atual';
    console.warn(`   ⚠ [Rota de Menu] ${detail}; o caminho "${documentedLabel}" não pôde ser verificado.`);
    return { found: false, healed: false, geometry: null, matchedTargetName: documentedLabel, menuPathOpenFailed: detail };
  }
  const match = chooseMenuItem(paths, items, priorChains, { ...options, routineId: step.routineId });
  if (!match) {
    // ADR-024: caminho inexistente na árvore real NÃO é curado para outro elemento (muito menos para um campo
    // de texto): o passo carrega a evidência lida da árvore e a rotina vira `[ATT]`.
    const missing = buildMenuPathMissingEvidence(paths, items);

    // ADR-037 Camada 3: passos 1 a 3, semântica fechada sobre os caminhos do catálogo. Destino inequívoco que existe
    // vivo é percorrido como cura (`closed_semantic`, sujeita à coerência pós-pouso); sem destino, o bloqueio `[ATT]`
    // sai na hora com a justificativa e os candidatos (sem explorar menus).
    if (context) {
      const documented = paths.reduce((a, b) => (b.segments.length > a.segments.length ? b : a), paths[0]);
      let plan = planExplicitClosedSemantic({ step, items, context, documentedChain: documented.segments });
      if (plan.kind === 'no_equivalent') {
        const viaAgy = await askAgyClosedSemantic(context, step, items, documented.segments);
        if (viaAgy?.kind === 'navigate') plan = viaAgy;
      }
      if (plan.kind === 'navigate') {
        console.log(`   ⚡ [Rota de Menu] Camada 3: "${documented.segments.join(' > ')}" -> "${plan.item.chain.join(' > ')}" (${plan.basis}).`);
        return navigateMenuMatch(client, step, rawScreenshotPath, matchFromNavigationPlan(plan, documented), paths, items);
      }
      if (plan.kind === 'no_equivalent') missing.closedSemantic = describeClosedForEvidence(plan.closed);
    }
    console.log(`   [Rota de Menu] Nenhum item da árvore de navegação corresponde a: ${documentedLabel}`);
    console.log(`   [Rota de Menu] Evidência: ${describeMenuPathMissing(missing)}`);
    return { found: false, healed: false, geometry: null, matchedTargetName: documentedLabel, menuPathMissing: missing };
  }
  return navigateMenuMatch(client, step, rawScreenshotPath, match, paths, items);
}

/**
 * ADR-037 Camada 2 (+ Camada 3 na tela inicial): navega até a tela citada sem `>`. `null` = nada a fazer aqui (o
 * passo segue o fluxo normal do SmartLocator): árvore ausente, homônimo, rótulo sem destino, tela já aberta.
 */
async function resolveImplicitScreenNavigation(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  implicit: ImplicitScreenNavigation,
  context: MenuNavigationContext
): Promise<SmartLocatorResult | null> {
  const items = parseMenuTreeResponse(await client.eval(buildMenuTreeScript()));
  if (items.length === 0) return null;
  const currentHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
  let plan = planImplicitScreenNavigation({ step, implicit, items, context, atHome: isHomeHash(currentHash) });
  if (plan.kind === 'skip' && plan.closed?.status === SEM_EQUIVALENTE_NA_ARVORE && isHomeHash(currentHash)) {
    plan = (await askAgyClosedSemantic(context, step, items)) ?? plan;
  }
  if (plan.kind !== 'navigate') {
    console.log(`   [Rota de Menu] "${implicit.label}" (tela citada sem caminho) não navegada: ${plan.kind === 'skip' ? plan.reason : 'sem equivalente'}.`);
    return null;
  }
  // A tela já está aberta (o passo anterior navegou até ela): nada a navegar, o passo segue o fluxo normal
  const leafSel = plan.item.selectors[plan.item.selectors.length - 1];
  const leafHref =
    (await client
      .evalJson<string>(`(() => { const a = document.querySelector(${JSON.stringify(leafSel)}); return JSON.stringify(a ? (a.getAttribute('href') || '') : ''); })()`)
      .catch(() => '')) || '';
  if (isAlreadyOnScreen(currentHash, leafHref)) {
    console.log(`   [Rota de Menu] A tela "${plan.item.chain.join(' > ')}" (${currentHash}) já está aberta; "${implicit.label}" não é renavegado.`);
    return null;
  }
  console.log(`   ⚡ [Rota de Menu] Camada ${plan.basis === 'single_segment_screen' ? '2' : '3'}: "${implicit.label}" -> "${plan.item.chain.join(' > ')}" (${plan.basis}).`);
  const synthetic = syntheticPathFromImplicit(implicit);
  const result = await navigateMenuMatch(client, step, rawScreenshotPath, matchFromNavigationPlan(plan, synthetic), [synthetic], items);
  // Cascata que não abriu numa cura implícita: o passo volta ao fluxo normal (não vira falha técnica de rota citada)
  if (!result.found && result.menuPathOpenFailed) {
    console.warn(`   ⚠ [Rota de Menu] ${result.menuPathOpenFailed}; o passo segue o fluxo normal do SmartLocator.`);
    await client.mouseMove(2, 2).catch(() => undefined);
    return null;
  }
  return result;
}

/** Percorre na árvore viva o item escolhido (cascata com ponteiro real, ADR-017) e monta o resultado/divergência. */
async function navigateMenuMatch(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  match: MenuPathMatch,
  paths: DocumentedMenuPath[],
  items: MenuTreeItem[]
): Promise<SmartLocatorResult> {
  // Travessia e medição usam a cadeia VIVA (`match.item.selectors`); todo texto (manual, divergência, relatório, rótulos)
  // usa a cadeia neutra: a raiz real do menu do usuário (`Olá, <nome>`) vira `Olá, [usuário]` (nunca o nome real).
  const chain = neutralUserMenuChain(match.item.chain);
  const reasonText = neutralizeUserMenuText(match.reason, items);
  const realPath = chain.join(' > ');
  const documentedPath = match.documented.segments.join(' > ');

  if (match.blocked) {
    console.warn(`   ⛔ [RBAC] O item "${realPath}" existe, mas está bloqueado para o perfil logado: ${reasonText}`);
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: realPath,
      permissionBlocked: {
        target: realPath,
        detail: reasonText,
        domEvidence: 'item da árvore de navegação com a classe disabled/ngx-orion-hide'
      }
    };
  }

  console.log(
    match.exact
      ? `   [Rota de Menu] Caminho confirmado na árvore de navegação: ${realPath}`
      : `   ⚡ [Rota de Menu] Auto-Cura de Rota: "${documentedPath}" -> "${realPath}" (conf: ${Math.round(match.confidence * 100)}%)`
  );

  const selectors = match.item.selectors;

  // A cascata depende do hover real: se fechar entre a medição e a captura, reabre e refaz (até 3 vezes).
  const captureCascade = async () => {
    const cascade = await openCascadeWithPointer(client, selectors);
    if (!cascade) {
      console.warn(`   ⚠ [Rota de Menu] Não foi possível manter a cascata aberta até "${realPath}".`);
      return null;
    }

    // Todos os níveis são medidos no mesmo frame, sem rolagem (rolar a página fecharia o menu suspenso).
    // O carimbo de clique vai para a folha: é ela que avança o fluxo.
    const leafSel = selectors[selectors.length - 1];
    const geometry = await client.getDOMGeometry([leafSel], {
      scrollIntoView: false,
      zone: 'any',
      groupTargets: selectors,
      actionMember: 'last'
    });
    const members = geometry?.groupMembers || [];
    if (!geometry || members.length !== selectors.length || geometry.unresolvedGroupTargets?.length) {
      console.warn(`   ⚠ [Rota de Menu] A cascata fechou antes da medição de "${realPath}".`);
      return null;
    }

    geometry.callouts = members.map((m, i) => ({
      index: i + 1,
      label: chain[i],
      cssBox: m.cssBox,
      matchedSelector: m.matchedSelector,
      innerText: m.innerText
    }));
    // Listas de menu abertas: as anotações evitam cobri-las (obstáculos suaves do solver)
    const openLists: BoundingBox[] = cascade
      .filter(r => r.ul)
      .map(r => ({ x: r.ul!.x, y: r.ul!.y, width: r.ul!.r - r.ul!.x, height: r.ul!.b - r.ul!.y }));
    geometry.context.neighborBoxes = openLists;

    await client.screenshot(rawScreenshotPath);
    const after = await readCascade(client, selectors);
    if (!after || !after.every(r => r.vis)) {
      console.warn(`   ⚠ [Rota de Menu] A cascata não estava íntegra no instante da captura de "${realPath}".`);
      return null;
    }
    return { geometry, members };
  };

  let captured: Awaited<ReturnType<typeof captureCascade>> = null;
  for (let attempt = 1; attempt <= 3 && !captured; attempt++) {
    if (attempt > 1) {
      console.log(`   [Rota de Menu] Nova tentativa da cascata (${attempt}/3).`);
      await client.mouseMove(2, 2);
      await client.wait(500);
    }
    captured = await captureCascade();
  }
  if (!captured) {
    // O caminho existe na árvore, mas o submenu não ficou aberto: falha técnica (não é defasagem do manual)
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: realPath,
      menuPathOpenFailed: `o item "${realPath}" existe na árvore, mas a cascata de submenus não pôde ser aberta e mantida após 3 tentativas`
    };
  }
  const { geometry, members } = captured;
  const leafSelector = selectors[selectors.length - 1];
  console.log(`   [Rota de Menu] Cascata aberta com o ponteiro na folha; ${members.length} níveis medidos no mesmo frame.`);

  // Preserva a forma do manual: um único negrito com o caminho, ou um negrito por segmento
  const singleBold = /^\*\*[^*]+\*\*$/.test(match.documented.sourceText);
  const realMarkup = singleBold ? `**${realPath}**` : chain.map(s => `**${s}**`).join(' > ');
  const leafBox = members[members.length - 1].cssBox;
  const { span: fromSpan, removedAlternatives } = expandMenuOrAlternativeSpan(
    step.rawText,
    paths,
    match.documented,
    items
  );
  const strippedAlternative = removedAlternatives.length > 0 && fromSpan !== match.documented.sourceText;

  if (match.exact && !strippedAlternative) {
    return { found: true, healed: false, geometry, matchedTargetName: realPath };
  }

  // ADR-029: o caminho real é MAIS CURTO que o documentado (o resto é aba/seção da tela). Só o prefixo substituído
  // muda no texto (e só se aparece literal dentro do negrito); a cauda fica como o manual escreveu e é provada ao
  // vivo pelo executor depois do clique da folha. Sem prefixo literal, a divergência não carrega troca de texto.
  const tail = match.tail && match.tail.length > 0 ? match.tail : undefined;
  let textChange: SmartLocatorDivergence['textChange'] = { from: fromSpan, to: realMarkup };
  let validatedText: string | undefined = step.rawText.replace(fromSpan, realMarkup);
  if (tail) {
    const consumed = match.consumed ?? match.documented.segments.length - tail.length;
    const prefixText = match.documented.segments.slice(0, consumed).join(' > ');
    if (singleBold && prefixText && step.rawText.includes(prefixText)) {
      textChange = { from: prefixText, to: chain.join(' > ') };
      validatedText = step.rawText.replace(prefixText, chain.join(' > '));
    } else {
      textChange = undefined;
      validatedText = undefined;
    }
  }

  const divergence: SmartLocatorDivergence = {
    stepNumber: step.stepNumber,
    documentedTarget: strippedAlternative ? `${documentedPath} ou ${removedAlternatives.join(' ou ')}` : documentedPath,
    actualElementText: realPath,
    actualRole: 'menuitem',
    resolutionLayer: 'menu_path_resolution',
    confidence: match.exact ? 1 : match.confidence,
    reason: strippedAlternative && match.exact
      ? `Alternativa de menu inexistente (${removedAlternatives.join(', ')}) removida após comprovar "${realPath}" na árvore real`
      : reasonText,
    detectedAt: new Date().toISOString(),
    // Evidência (ADR-017): cada segmento do caminho real foi lido da árvore de navegação e medido na print
    evidence: { source: 'menu-tree', matchedSelector: leafSelector, elementText: realPath, box: leafBox },
    textChange
  };
  const basis: MenuCureBasis | undefined = match.cureBasis ?? match.canonicalBasis;
  if (basis) divergence.menuBasis = basis;

  return {
    found: true,
    healed: true,
    geometry,
    matchedTargetName: realPath,
    divergence,
    validatedText,
    menuTail: tail ? { segments: tail, realChain: chain, documentedPath, basis: match.canonicalBasis ?? 'tail_as_screen_section' } : undefined,
    priorHint: match.viaPriorAudit ? { documented: documentedPath, actual: realPath, layer: 'menu_path_resolution' } : undefined,
    // ADR-037 Camada 4: curas por equivalência explícita, tela de segmento único e semântica fechada só são aceitas
    // depois da coerência pós-pouso (alvos dos passos seguintes presentes na tela alcançada)
    menuCure: basis && COHERENCE_CHECKED_BASES.has(basis) ? { basis, documented: documentedPath, realChain: chain, evidence: reasonText } : undefined
  };
}
