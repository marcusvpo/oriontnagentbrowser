import type { AgentBrowserClient } from './browser.js';
import { resolveMenuPathViaHumanReview } from './human-review-rag.js';
import { closeActiveModals } from './modal-scope.js';
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
}

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
    const best = scored[0];
    const tied = scored.filter(s => s.score === best.score && !sameChain(s.item.chain, best.item.chain));
    if (tied.length > 0) continue;

    const confidence = Math.min(
      0.95,
      best.leafSimilarity * 0.8 + (docAncestors.length ? (0.15 * best.shared) / docAncestors.length : 0)
    );
    const docLeaf = documented.segments[documented.segments.length - 1];
    return {
      item: best.item,
      documented,
      exact: false,
      confidence: Number(confidence.toFixed(2)),
      reason: best.canonicalSynonym
        ? `Equivalência canônica de menu: "${docLeaf}" -> "${best.item.chain[best.item.chain.length - 1]}" (${best.shared} de ${docAncestors.length} segmentos ancestrais coincidem)`
        : `Item "${best.item.chain[best.item.chain.length - 1]}" localizado na árvore de navegação em outra rota (${best.shared} de ${docAncestors.length} segmentos ancestrais coincidem)`
    };
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
  const roots = items.filter(i => i.chain.length === 1).map(i => i.chain[0]);

  let existing: string[] = [];
  for (let k = 1; k < segs.length; k++) {
    if (!items.some(i => sameChain(i.chain, segs.slice(0, k)))) break;
    existing = segs.slice(0, k);
  }
  const siblings = items
    .filter(i => i.chain.length === existing.length + 1 && existing.every((seg, idx) => normalizeText(seg) === normalizeText(i.chain[idx])))
    .map(i => i.chain[i.chain.length - 1]);

  const leaf = segs[segs.length - 1];
  const leafElsewhere = items
    .filter(i => {
      const l = i.chain[i.chain.length - 1];
      return normalizeText(l) === normalizeText(leaf) || computeDiceSimilarity(l, leaf) >= LEAF_MIN_SIMILARITY;
    })
    .map(i => i.chain.join(' > '));

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
  return `O caminho "${e.documented}" não existe na árvore de navegação real do Orion TN. ${where}${elsewhere} Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto.`;
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
async function openCascadeWithPointer(client: AgentBrowserClient, selectors: string[]): Promise<CascadeRect[] | null> {
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
  options: { ignoreDisabledBlocks?: boolean } = {}
): Promise<SmartLocatorResult | null> {
  const paths = extractMenuPaths(step);
  if (paths.length === 0) return null;

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
    console.log(`   [Rota de Menu] Nenhum item da árvore de navegação corresponde a: ${documentedLabel}`);
    console.log(`   [Rota de Menu] Evidência: ${describeMenuPathMissing(missing)}`);
    return { found: false, healed: false, geometry: null, matchedTargetName: documentedLabel, menuPathMissing: missing };
  }

  const chain = match.item.chain;
  const realPath = chain.join(' > ');
  const documentedPath = match.documented.segments.join(' > ');

  if (match.blocked) {
    console.warn(`   ⛔ [RBAC] O item "${realPath}" existe, mas está bloqueado para o perfil logado: ${match.reason}`);
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: realPath,
      permissionBlocked: {
        target: realPath,
        detail: match.reason,
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

  const divergence: SmartLocatorDivergence = {
    stepNumber: step.stepNumber,
    documentedTarget: strippedAlternative ? `${documentedPath} ou ${removedAlternatives.join(' ou ')}` : documentedPath,
    actualElementText: realPath,
    actualRole: 'menuitem',
    resolutionLayer: 'menu_path_resolution',
    confidence: match.exact ? 1 : match.confidence,
    reason: strippedAlternative && match.exact
      ? `Alternativa de menu inexistente (${removedAlternatives.join(', ')}) removida após comprovar "${realPath}" na árvore real`
      : match.reason,
    detectedAt: new Date().toISOString(),
    // Evidência (ADR-017): cada segmento do caminho real foi lido da árvore de navegação e medido na print
    evidence: { source: 'menu-tree', matchedSelector: leafSelector, elementText: realPath, box: leafBox },
    textChange: { from: fromSpan, to: realMarkup }
  };

  return {
    found: true,
    healed: true,
    geometry,
    matchedTargetName: realPath,
    divergence,
    validatedText: step.rawText.replace(fromSpan, realMarkup),
    priorHint: match.viaPriorAudit ? { documented: documentedPath, actual: realPath, layer: 'menu_path_resolution' } : undefined
  };
}
