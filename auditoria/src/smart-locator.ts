import fs from 'node:fs';
import path from 'node:path';
import type { AgentBrowserClient } from './browser.js';
import { resolveAndNavigateMenuPath } from './menu-path.js';
import { forbiddenCandidateReason, forbiddenMeasuredReason, synonymMatchesNode } from './navigation-guard.js';
import { isGenericContainerMatch } from './evidence.js';
import { isFullAccessSession, probePermissionBlockedTargets, readSessionIdentity } from './rbac.js';
import { clamp, NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { MAX_SOM_CANDIDATES, renderSetOfMarkOverlay } from './annotator.js';
import { resolveGridActions } from './icon-action-resolver.js';
import { evaluateSemanticCompatibility } from './semantic-compatibility.js';
import { getHumanTargetSuggestionsForStep } from './human-review-rag.js';
import { routeSynonymsFor } from './route-synonyms.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';
import { config } from './config.js';
import {
  AsyncSemaphore,
  invokeAgyJson,
  invokeAgyVisionBufferJson,
  parseStrictJsonFromAgyOutput,
  type AgyTransportFn
} from './agy-client.js';
import type {
  ActionType,
  BoundingBox,
  DOMAngularBindings,
  DOMCallout,
  DOMResolvedGeometry,
  DOMSemanticSignature,
  Point,
  RoutineStep,
  SemanticRole,
  SmartLocatorDivergence,
  SmartLocatorResult,
  StepZonePolicy,
  VisualAuditMode
} from './types.js';

export interface ParsedA11yNode {
  ref: string;
  role: string;
  name: string;
  rawLine: string;
  /** Texto exato do nó no DOM, quando difere do nome exibido (ex.: rótulo com marca de obrigatório "Descrição*") */
  domQuery?: string;
  /** Contexto semântico de seção, linha de grade, rótulo associado e papel (ADR-027) */
  sectionTitle?: string;
  rowContext?: DOMSemanticSignature['rowContext'];
  associatedLabel?: string;
  semanticRole?: SemanticRole;
  inNavbar?: boolean;
}

export function buildCollectVisibleLabelNodesScript(): string {
  return `
    (() => {
      const MAX_DEPTH = 6;
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/[\\uE000-\\uF8FF\\u200B-\\u200D\\uFEFF]/g, '').replace(/\\u00A0/g, ' ').replace(/\\s+/g, ' ').trim();
      const composedParent = node => {
        if (!node) return null;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode ? node.getRootNode() : null;
        return root && root.host ? root.host : null;
      };
      const composedClosest = (node, selector) => {
        let cur = node;
        while (cur) {
          if (cur.nodeType === 1 && cur.matches && cur.matches(selector)) return cur;
          cur = composedParent(cur);
        }
        return null;
      };
      const queryAllDeep = (root, selector, depth) => {
        const d = depth || 0;
        const out = [];
        const seen = new Set();
        if (!root || d > MAX_DEPTH) return out;
        const add = el => {
          if (el && !seen.has(el)) {
            seen.add(el);
            out.push(el);
          }
        };
        if (root.querySelectorAll) {
          try {
            const direct = root.querySelectorAll(selector);
            for (let i = 0; i < direct.length; i++) add(direct[i]);
          } catch (e) {}
        }
        if (d === 0 && root.shadowRoot) {
          const own = queryAllDeep(root.shadowRoot, selector, d + 1);
          for (let j = 0; j < own.length; j++) add(own[j]);
        }
        if (d < MAX_DEPTH && root.querySelectorAll) {
          try {
            const all = root.querySelectorAll('*');
            for (let i = 0; i < all.length; i++) {
              const host = all[i];
              if (host && host.shadowRoot) {
                const inner = queryAllDeep(host.shadowRoot, selector, d + 1);
                for (let j = 0; j < inner.length; j++) add(inner[j]);
              }
            }
          } catch (e) {}
        }
        return out;
      };
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        if (composedClosest(e, '.ng-hide')) return false;
        const win = (e.ownerDocument && e.ownerDocument.defaultView) || window;
        const r = e.getBoundingClientRect();
        const s = win.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const sectionOf = el => {
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const body = cur.ownerDocument ? cur.ownerDocument.body : document.body;
          const de = cur.ownerDocument ? cur.ownerDocument.documentElement : document.documentElement;
          if (cur === body || cur === de) break;
          if (cur.tagName === 'FIELDSET') {
            const leg = queryAllDeep(cur, 'legend').find(vis) || cur.querySelector('legend');
            if (leg && vis(leg)) return clean(leg.innerText || leg.textContent);
          }
          if (cur.matches && cur.matches('.panel, .card, .box, .modal-content, .well, section')) {
            const hd =
              cur.querySelector(':scope > .panel-heading, :scope > .card-header, :scope > .box-header, :scope > .modal-header .modal-title, :scope > h3, :scope > h4, :scope > h5, :scope > legend') ||
              (cur.shadowRoot && cur.shadowRoot.querySelector('.panel-heading, .card-header, .box-header, .modal-header .modal-title, h3, h4, h5, legend'));
            if (hd && vis(hd)) return clean(hd.innerText || hd.textContent);
          }
          cur = composedParent(cur);
        }
        return '';
      };
      const rowOf = el => {
        const tr = composedClosest(el, 'tr');
        const pTr = tr ? composedParent(tr) : null;
        if (!tr || !pTr) return undefined;
        const rows = Array.from(pTr.children || []).filter(r => r.tagName === 'TR');
        const cells = Array.from(tr.querySelectorAll('td, th')).map(c => clean(c.innerText || c.textContent)).filter(Boolean);
        return cells.length > 0 ? { rowIndex: Math.max(0, rows.indexOf(tr)), firstColText: cells[0], secondColText: cells[1] } : undefined;
      };
      const collectDocs = (doc, depth, acc) => {
        if (!doc || depth > MAX_DEPTH) return;
        acc.push(doc);
        if (depth >= MAX_DEPTH) return;
        const iframes = queryAllDeep(doc, 'iframe');
        for (let i = 0; i < iframes.length; i++) {
          try {
            const f = iframes[i];
            if (vis(f) && f.contentDocument && f.contentDocument.body) {
              collectDocs(f.contentDocument, depth + 1, acc);
            }
          } catch (e) {}
        }
      };
      const docs = [];
      collectDocs(document, 0, docs);

      const out = [];
      const seen = new Set();
      const add = (el, raw, roleOverride) => {
        const query = clean(raw);
        const name = query.replace(/[\\s*:]+$/, '');
        const sectionTitle = sectionOf(el) || undefined;
        const key = (sectionTitle ? sectionTitle.toLowerCase() + '|' : '') + name.toLowerCase();
        if (name.length < 3 || name.length > 60 || seen.has(key)) return;
        seen.add(key);
        const rowContext = rowOf(el);
        const associatedLabel =
          clean(
            el.getAttribute('title') ||
            el.getAttribute('data-original-title') ||
            el.getAttribute('placeholder') ||
            el.getAttribute('aria-label') ||
            el.getAttribute('ng-reflect-name') ||
            el.getAttribute('ng-model') ||
            el.getAttribute('ng-click') ||
            ''
          ) || undefined;
        out.push({ name, query, role: roleOverride, sectionTitle, rowContext, associatedLabel });
      };
      for (const doc of docs) {
        for (const el of queryAllDeep(doc, 'label, legend, th')) {
          if (vis(el) && !composedClosest(el, NAV)) add(el, el.innerText || el.textContent, 'label');
        }
        for (const el of queryAllDeep(doc, 'span, orion-checkbox')) {
          if (!vis(el) || composedClosest(el, NAV)) continue;
          const checks = queryAllDeep(el, 'input[type="checkbox"], input[type="radio"]');
          if (checks.length === 1) add(el, el.innerText || el.textContent, 'label');
        }
        for (const el of queryAllDeep(doc, 'input[placeholder], textarea[placeholder]')) {
          if (vis(el) && !composedClosest(el, NAV)) add(el, el.getAttribute('placeholder'), 'label');
        }
      }
      return JSON.stringify(out.slice(0, 80));
    })()
  `;
}

/**
 * Rótulos visíveis da tela (ADR-018 + ADR-027 + ADR-030): `label`, `legend`, cabeçalhos de grade,
 * checkboxes em `<span>` e placeholders em Deep DOM (Open Shadow DOM + iframes), com `sectionTitle` e `rowContext`.
 */
export async function collectVisibleLabelNodes(client: AgentBrowserClient): Promise<ParsedA11yNode[]> {
  const labels = await client.evalJson<
    Array<{
      name: string;
      query: string;
      role?: string;
      sectionTitle?: string;
      rowContext?: DOMSemanticSignature['rowContext'];
      associatedLabel?: string;
      semanticRole?: SemanticRole;
    }>
  >(buildCollectVisibleLabelNodesScript());
  return (labels || []).map(l => ({
    ref: '',
    role: l.role || 'label',
    name: l.name,
    rawLine: `label "${l.name}"`,
    domQuery: l.query !== l.name ? l.query : undefined,
    sectionTitle: l.sectionTitle,
    rowContext: l.rowContext,
    associatedLabel: l.associatedLabel,
    semanticRole: l.semanticRole
  }));
}

/**
 * Mapa Canônico de Equivalência Semântica do Ecossistema Orion TN (SPCM / Angular):
 * Mapeia termos legados de manuais (v4/v5) para a nomenclatura real da interface v6.0.4.
 */
const ORION_UI_SYNONYMS: Record<string, string[]> = {
  salvar: ['concluir', 'confirmar', 'gravar', 'salvar', 'aplicar', 'persistir'],
  concluir: ['salvar', 'confirmar', 'gravar', 'finalizar'],
  confirmar: ['concluir', 'salvar', 'ok', 'sim', 'aplicar'],
  novo: ['adicionar +', 'adicionar', 'novo', 'incluir', 'cadastrar', '+'],
  adicionar: ['adicionar +', 'novo', 'incluir', 'cadastrar'],
  incluir: ['adicionar +', 'adicionar', 'novo', 'cadastrar'],
  cadastrar: ['adicionar +', 'novo', 'incluir', 'salvar'],
  visualizar: ['consultar', 'visualizar', 'exibir', 'detalhes'],
  consultar: ['visualizar', 'consultar', 'exibir', 'pesquisar'],
  remover: ['excluir', 'remover', 'apagar', 'inativar'],
  editar: ['alterar', 'editar', 'modificar', 'detalhes'],
  alterar: ['editar', 'modificar', 'atualizar'],
  excluir: ['remover', 'inativar', 'apagar', 'excluir', 'desativar'],
  pesquisar: ['filtrar', 'localizar', 'buscar', 'consultar', 'pesquisa'],
  buscar: ['pesquisar', 'localizar', 'filtrar', 'consultar'],
  localizar: ['pesquisar', 'buscar', 'filtrar'],
  parametrizacoes: ['configurações', 'parâmetros', 'geral'],
  usuarios: ['colaboradores', 'operadores', 'prepostos', 'usuários'],
  'grupo firmas': ['escrevente de firmas'],
  impressao: ['imprimir', 'impressão'],
  imprimir: ['impressão', 'imprimir']
};

/**
 * Normaliza texto removendo acentos, pontuação e caixa alta para comparação semântica.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[^\w\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Coeficiente de similaridade de Sørensen–Dice por bigramas (0.0 a 1.0).
 */
export function computeDiceSimilarity(a: string, b: string): number {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return s1 === s2 ? 1.0 : 0;

  const bigrams1 = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bg = s1.slice(i, i + 2);
    bigrams1.set(bg, (bigrams1.get(bg) || 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bg = s2.slice(i, i + 2);
    const count = bigrams1.get(bg) || 0;
    if (count > 0) {
      bigrams1.set(bg, count - 1);
      intersection++;
    }
  }

  return (2.0 * intersection) / (s1.length - 1 + (s2.length - 1));
}

// Intenção de navegação explícita: o alvo legítimo ESTÁ numa zona de navegação.
const HARD_NAV_INTENT_PATTERN =
  /\b(menu|menus|submenu|barra superior|barra de navegacao|painel lateral|menu lateral|navbar|sidebar)\b/;
const NAV_INTENT_PATTERN =
  /\b(menu|menus|submenu|aba|abas|barra superior|barra de navegacao|painel lateral|menu lateral|navbar|sidebar)\b/;
// Verbos inequívocos de parametrização/preenchimento de formulário (imperativo e infinitivo).
const STRICT_FORM_VERB_PATTERN =
  /\b(defin[ae]|definir|preench[ae]|preencher|configur[ae]|configurar|inform[ae]|informar|digit[ae]|digite|ajust[ae]|ajustar|parametriz[ae]|parametrizar|marqu[ae]|marcar|desmarqu[ae]|desmarcar|insir[ae]|inserir|vincul[ae]|vincular|associ[ae]|associar)\b/;
// Verbos que tanto operam um campo quanto escolhem um item de navegação.
const AMBIGUOUS_FORM_VERB_PATTERN = /\b(selecione|escolha|localize|consulte|filtre|pesquise)\b/;

/** O passo cita explicitamente menu, aba, barra ou painel lateral (o alvo é navegação). */
export function hasNavigationIntent(text: string): boolean {
  return NAV_INTENT_PATTERN.test(normalizeText(text));
}

/**
 * Filtro de Zona Semântica (ADR-015) — decide, a partir do texto do passo, onde o alvo pode estar:
 * - Menção explícita a menu/barra/painel lateral -> `any` (o alvo é navegação).
 * - Citação a "aba" combinada com verbo estrito de formulário ("marcar", "preencher"...) -> `content-preferred`.
 * - Verbos de parametrização ("Defina", "Preencha", "Configure"...) ou ação `fill`/`search` -> `content`
 *   (estrito: `aside`, `.sidebar`, `nav` e abas ficam fora da busca).
 * - Verbos ambíguos ("Selecione", "Escolha"...) ou ação `select`/`check` -> `content-preferred`.
 * - Demais passos (cliques genéricos) -> `any`.
 */
export function inferStepZone(text: string, actionType?: string): StepZonePolicy {
  const norm = normalizeText(text);
  if (HARD_NAV_INTENT_PATTERN.test(norm)) return 'any';
  if (NAV_INTENT_PATTERN.test(norm)) {
    if (STRICT_FORM_VERB_PATTERN.test(norm) || actionType === 'fill' || actionType === 'search') {
      return 'content-preferred';
    }
    return 'any';
  }
  if (STRICT_FORM_VERB_PATTERN.test(norm)) return 'content';
  if (actionType === 'fill' || actionType === 'search') return 'content';
  if (AMBIGUOUS_FORM_VERB_PATTERN.test(norm)) return 'content-preferred';
  if (actionType === 'select' || actionType === 'check') return 'content-preferred';
  return 'any';
}

/**
 * Rótulo compacto para a anotação de um Group Bounding Box: primeiro parâmetro + contagem dos demais.
 */
export function describeGroupLabel(geometry: DOMResolvedGeometry, fallback: string): string {
  const members = geometry.groupMembers || [];
  if (members.length === 0) return fallback;
  const first = members[0].query.replace(/\*\*/g, '').trim() || members[0].innerText || fallback;
  // Vários alvos podem resolver para o mesmo campo (ex.: opções de um mesmo select): conta campos distintos
  const distinctFields = new Set(members.map(m => `${m.cssBox.x},${m.cssBox.y},${m.cssBox.width},${m.cssBox.height}`));
  if (distinctFields.size === 1) return first;
  const extra = distinctFields.size - 1;
  return `${first} (+${extra} ${extra === 1 ? 'campo' : 'campos'})`;
}

/**
 * Multi-demarcação (ADR-017): converte os membros de um grupo medido no mesmo frame em demarcações
 * numeradas (1, 2, 3...), na ordem em que os alvos aparecem no passo. Alvos que resolvem para a
 * mesma caixa (ex.: opções de um mesmo campo) compartilham uma demarcação. Com um único campo
 * distinto não há multi-demarcação: vale a moldura única.
 */
export function buildCalloutsFromGroup(geometry: DOMResolvedGeometry, firstIndex = 1): DOMCallout[] | undefined {
  const members = geometry.groupMembers || [];
  const vp = geometry.viewport;
  const merged: DOMCallout[] = [];
  for (const m of members) {
    // Só entra o que está visível na print
    const x1 = Math.max(0, m.cssBox.x);
    const y1 = Math.max(0, m.cssBox.y);
    const x2 = Math.min(vp.width, m.cssBox.x + m.cssBox.width);
    const y2 = Math.min(vp.height, m.cssBox.y + m.cssBox.height);
    if (x2 - x1 <= 0 || y2 - y1 <= 0) continue;
    const box = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    const label = m.query.replace(/\*\*/g, '').trim() || m.innerText;
    const same = merged.find(
      c => c.cssBox.x === box.x && c.cssBox.y === box.y && c.cssBox.width === box.width && c.cssBox.height === box.height
    );
    if (same) {
      if (!same.label.split(' / ').includes(label)) same.label += ` / ${label}`;
      continue;
    }
    merged.push({ index: 0, label, cssBox: box, matchedSelector: m.matchedSelector, innerText: m.innerText });
  }
  if (merged.length < 2) return undefined;
  merged.forEach((c, i) => (c.index = firstIndex + i));
  return merged;
}

/**
 * Extrai os nós interativos da Árvore de Acessibilidade compacta (`agent-browser snapshot -i`).
 */
export function parseAccessibilitySnapshot(snapshotText: string): ParsedA11yNode[] {
  const nodes: ParsedA11yNode[] = [];
  const lines = snapshotText.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Formatos suportados: `button "Concluir" [ref=e12]` ou `@e12 button "Concluir"`
    const refMatch = line.match(/\[ref=(e\d+)\]/) || line.match(/@(e\d+)/);
    if (!refMatch) continue;

    const ref = `@${refMatch[1]}`;
    const roleMatch = line.match(/^(?:-\s*)?([a-zA-Z]+)\s+"/);
    const nameMatch = line.match(/"([^"]+)"/);

    const role = roleMatch ? roleMatch[1].toLowerCase() : 'generic';
    const name = nameMatch ? nameMatch[1].trim() : line.replace(/\[ref=e\d+\]|@e\d+/g, '').trim();

    if (name) {
      nodes.push({ ref, role, name, rawLine: line });
    }
  }

  return nodes;
}

interface A11ySemanticCandidate {
  node: ParsedA11yNode;
  documentedTarget: string;
  confidence: number;
  reason: string;
}

/**
 * Avalia equivalência semântica na Árvore de Acessibilidade (Sub-camada 2A — 0 Tokens).
 * Retorna TODOS os candidatos com confiança >= 0.68, do melhor para o pior (um por nó), para que a
 * camada de zona possa descartar um item de navegação e seguir para o próximo candidato de conteúdo.
 */
const hasWholePhrase = (haystack: string, phrase: string): boolean =>
  Boolean(haystack && phrase && (haystack === phrase || ` ${haystack} `.includes(` ${phrase} `)));

const singleWordTokens = (norm: string): string[] => norm.split(' ').filter(w => w.length >= 3);

export function rankSemanticCandidatesInA11y(
  targets: string[],
  nodes: ParsedA11yNode[],
  step?: Pick<RoutineStep, 'rawText' | 'targets'>
): A11ySemanticCandidate[] {
  const bestByRef = new Map<string, A11ySemanticCandidate>();

  for (const docTarget of targets) {
    const normDoc = normalizeText(docTarget);
    if (!normDoc) continue;

    // Coletar sinônimos conhecidos do dicionário Orion TN (exige palavra/frase inteira)
    const synonyms = new Set<string>();
    for (const [key, synList] of Object.entries(ORION_UI_SYNONYMS)) {
      if (hasWholePhrase(normDoc, key)) {
        for (const s of synList) synonyms.add(normalizeText(s));
      }
    }

    for (const node of nodes) {
      const normNode = normalizeText(node.name);
      if (!normNode) continue;
      // ADR-024 + ADR-026: bloqueia campo em passo de navegação, CTRL + B, "Novo cartão +" sem "cartão" e colapso em navbar
      if (step && forbiddenCandidateReason(step, { name: node.name, role: node.role, inNavbar: node.inNavbar })) continue;

      // ADR-027: Matriz de Compatibilidade Intenção × Papel + filtro anti-substring ANTES do Sørensen-Dice
      const compat = step
        ? evaluateSemanticCompatibility(step, docTarget, {
            name: node.name,
            role: node.role,
            inNavbar: node.inNavbar,
            sectionTitle: node.sectionTitle,
            rowContext: node.rowContext,
            associatedLabel: node.associatedLabel,
            semanticRole: node.semanticRole
          })
        : { compatible: true, weight: 1.0, stepIntent: 'generic_action' as const, nodeRole: 'form_input' as const };
      if (!compat.compatible || compat.weight === 0) continue;

      let score = 0;
      let reason = '';

      if (Array.from(synonyms).some(s => synonymMatchesNode(s, normNode))) {
        // ADR-024: palavra inteira ou igualdade exata; vale também para rótulos de checkboxes (ex.: Escrevente de Firmas)
        score = node.role === 'label' ? 0.9 : 0.92;
        reason = `Sinônimo canônico Orion TN ('${docTarget}' -> '${node.name}')`;
      } else if (node.role === 'label') {
        // Rótulo visível sem sinônimo: exige inclusão por palavra/frase inteira (campo renomeado)
        if (!hasWholePhrase(normDoc, normNode) && !hasWholePhrase(normNode, normDoc)) continue;
        score = Math.min(0.95, computeDiceSimilarity(normDoc, normNode) + 0.2);
        reason = `Rótulo visível na tela equivalente por inclusão de nome (${Math.round(score * 100)}%)`;
      } else {
        // 2. Similaridade léxica Sørensen–Dice + inclusão SOMENTE por palavra/frase inteira (nunca intra-palavra: "Autenticidade" != "Cidade")
        const dice = computeDiceSimilarity(normDoc, normNode);
        const wordsDoc = singleWordTokens(normDoc);
        const wordsNode = singleWordTokens(normNode);
        const bothSingleWord = wordsDoc.length === 1 && wordsNode.length === 1;
        if (bothSingleWord && wordsDoc[0] !== wordsNode[0] && dice < 0.75) {
          continue;
        }
        const tokenOverlap =
          hasWholePhrase(normNode, normDoc) || hasWholePhrase(normDoc, normNode) ? 0.2 : 0;
        score = Math.min(0.95, dice + tokenOverlap);
        reason = `Similaridade semântica na árvore de acessibilidade (${Math.round(score * 100)}%)`;
      }

      // Ponderação semântica por correspondência de seção (`sectionTitle` vs texto do passo)
      score = Math.min(0.98, score * compat.weight);

      // Bônus se o role for um controle interativo primário (button, link, tab, menuitem)
      if (['button', 'link', 'tab', 'menuitem', 'textbox', 'combobox'].includes(node.role)) {
        score = Math.min(0.98, score + 0.04);
      }

      // Rótulos visíveis não têm `ref`: a chave é o próprio nome
      const key = node.ref || `label:${normNode}`;
      const previous = bestByRef.get(key);
      if (score >= 0.68 && (!previous || score > previous.confidence)) {
        bestByRef.set(key, {
          node,
          documentedTarget: docTarget,
          confidence: Number(score.toFixed(2)),
          reason
        });
      }
    }
  }

  // Ordenação estável: em empate de confiança, mantém a ordem de descoberta na árvore
  return Array.from(bestByRef.values()).sort((a, b) => b.confidence - a.confidence);
}

/** Máximo de candidatos da árvore de acessibilidade testados contra a zona de conteúdo. */
const MAX_ZONE_HEAL_ATTEMPTS = 5;

/**
 * Extrai a geometria determinística de um nó curado respeitando a política de zona do passo.
 * Em zona estrita (`content`) não há fallback por `ref`: uma caixa obtida fora do DOM introspectado
 * não pode ser auditada contra a navegação lateral e seria uma demarcação não verificável.
 */
async function resolveHealedGeometry(
  client: AgentBrowserClient,
  node: ParsedA11yNode,
  zonePolicy: StepZonePolicy
): Promise<DOMResolvedGeometry | null> {
  const viaDom = await client.getDOMGeometry([node.domQuery ?? node.name], { scrollIntoView: true, zone: zonePolicy });
  if (viaDom || zonePolicy === 'content' || !node.ref) return viaDom;

  try {
    const refBox = await client.getBox(node.ref);
    if (refBox.width > 0 && refBox.height > 0) {
      return {
        cssBox: refBox,
        viewport: { width: 1440, height: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
        context: {
          tagName: node.role,
          role: node.role,
          innerText: node.name,
          isTopNav: refBox.y < 52,
          isVerticalSidebar: refBox.x < 140 && refBox.width < 240 && refBox.y >= 60
        },
        matchedSelector: node.ref,
        url: 'healed://a11y-snapshot',
        capturedAt: new Date().toISOString(),
        zone: 'any',
        zonePolicy
      };
    }
  } catch {}
  return null;
}

/**
 * Reconciliação de alvos não localizados num passo de múltiplos alvos (ADR-016).
 *
 * O passo foi demarcado porque parte dos alvos existe, mas um ou mais rótulos citados no manual não
 * estão na zona de conteúdo. Para cada um:
 * 1. tenta a Auto-Cura na Árvore de Acessibilidade (sinônimos + Sørensen–Dice), descartando candidatos
 *    que já são outro membro do grupo e validando o candidato no DOM dentro da zona de conteúdo;
 * 2. se curado, o rótulo real entra no grupo e a união é medida de novo (a moldura passa a cobri-lo);
 * 3. se não, registra a divergência `target_not_found`.
 * Em ambos os casos a divergência vai para o relatório: o passo deixa de passar como `ok` silencioso.
 */
async function reconcileUnresolvedGroupTargets(
  client: AgentBrowserClient,
  step: RoutineStep,
  geometry: DOMResolvedGeometry,
  ctx: { candidates: string[]; groupTargets: string[]; zonePolicy: StepZonePolicy; allowHealing: boolean }
): Promise<{ geometry: DOMResolvedGeometry; divergences: SmartLocatorDivergence[]; validatedText?: string }> {
  const unresolved = geometry.unresolvedGroupTargets || [];
  const divergences: SmartLocatorDivergence[] = [];
  const replacements = new Map<string, string>();
  /** Texto exato usado para medir o rótulo curado no DOM (pode trazer a marca de obrigatório) */
  const domQueries = new Map<string, string>();
  const healedByTarget = new Map<string, SmartLocatorDivergence>();
  const healZone = ctx.zonePolicy === 'any' ? 'any' : 'content';
  let remeasure = false;
  /** Alvos resolvidos por sinônimo contextual de rota (ADR-029) e os rótulos reais medidos para cada um */
  const routeResolved = new Set<string>();
  const routeQueries = new Map<string, string[]>();
  const routeHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';

  if (ctx.allowHealing) {
    let nodes: ParsedA11yNode[] = [];
    try {
      nodes = parseAccessibilitySnapshot(await client.snapshotInteractive());
    } catch {
      nodes = [];
    }
    nodes.push(...(await collectVisibleLabelNodes(client)));
    // Nomes já ocupados por outros alvos do passo: um rótulo ausente não pode ser "curado" para eles
    const taken = new Set<string>();
    for (const m of geometry.groupMembers || []) {
      taken.add(normalizeText(m.query));
      if (m.innerText) taken.add(normalizeText(m.innerText));
    }
    for (const t of step.targets) taken.add(normalizeText(t));

    for (const target of unresolved) {
      // ADR-029: sinônimo contextual da rota (Raio-X das telas `[ATT]`). Todos os rótulos reais da entrada precisam
      // ser MEDIDOS ao vivo na zona de conteúdo; só um deles substitui o negrito do manual, vários entram sem troca de texto.
      const routeSyn = routeSynonymsFor(routeHash, target)[0];
      if (routeSyn) {
        const measured: string[] = [];
        for (const real of routeSyn.real) {
          remeasure = true;
          const probe = await client.getDOMGeometry([real], { scrollIntoView: false, zone: healZone });
          if (probe && !isGenericContainerMatch(probe)) measured.push(real);
        }
        if (measured.length === routeSyn.real.length) {
          routeResolved.add(target);
          routeQueries.set(target, measured);
          for (const r of measured) taken.add(normalizeText(r));
          const single = measured.length === 1;
          if (single) {
            replacements.set(target, measured[0]);
            domQueries.set(target, measured[0]);
          }
          const healed: SmartLocatorDivergence = {
            stepNumber: step.stepNumber,
            documentedTarget: target,
            actualElementText: measured.join(' + '),
            resolutionLayer: 'dom_synonym_heuristic',
            confidence: 0.9,
            reason: `Sinônimo contextual da rota ${routeSyn.route}: ${routeSyn.evidence}`,
            detectedAt: new Date().toISOString(),
            textChange: single ? { from: `**${target}**`, to: `**${measured[0]}**` } : undefined
          };
          divergences.push(healed);
          healedByTarget.set(target, healed);
          console.log(`   ◈ [Sinônimo de Rota] ${routeSyn.route}: "${target}" -> ${measured.map(m => `"${m}"`).join(' + ')} medido(s) ao vivo na zona de conteúdo.`);
          continue;
        }
      }
      const ranked = rankSemanticCandidatesInA11y([target], nodes, step)
        .filter(c => !taken.has(normalizeText(c.node.name)))
        .slice(0, MAX_ZONE_HEAL_ATTEMPTS);
      for (const candidate of ranked) {
        remeasure = true;
        const domQuery = candidate.node.domQuery ?? candidate.node.name;
        const probe = await client.getDOMGeometry([domQuery], { scrollIntoView: false, zone: healZone });
        if (!probe || isGenericContainerMatch(probe)) continue;
        replacements.set(target, candidate.node.name);
        domQueries.set(target, domQuery);
        taken.add(normalizeText(candidate.node.name));
        const healed: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget: target,
          actualElementText: candidate.node.name,
          actualRole: candidate.node.role,
          matchedRef: candidate.node.ref,
          resolutionLayer: candidate.reason.includes('Sinônimo') ? 'dom_synonym_heuristic' : 'a11y_fuzzy_match',
          confidence: candidate.confidence,
          reason: candidate.reason,
          detectedAt: new Date().toISOString(),
          textChange: { from: `**${target}**`, to: `**${candidate.node.name}**` }
        };
        divergences.push(healed);
        healedByTarget.set(target, healed);
        console.log(
          `   ⚡ [SmartLocator Auto-Cura] Rótulo curado na zona de conteúdo: "${target}" -> "${candidate.node.name}" (conf: ${Math.round(candidate.confidence * 100)}%)`
        );
        break;
      }
    }
  }

  for (const target of unresolved) {
    if (replacements.has(target) || routeResolved.has(target)) continue;
    divergences.push({
      stepNumber: step.stepNumber,
      documentedTarget: target,
      actualElementText: '',
      resolutionLayer: 'target_not_found',
      confidence: 0,
      reason: 'Alvo citado no manual não localizado na zona de conteúdo da tela auditada',
      detectedAt: new Date().toISOString()
    });
    console.log(`   ⚠ [Divergência] Alvo "${target}" não existe na zona de conteúdo; registrado para o relatório.`);
  }

  // As medições de validação trocam o carimbo de ação de lugar: a última medição antes da captura
  // precisa ser a do grupo, já com os rótulos curados no lugar dos documentados.
  let finalGeometry = geometry;
  if (remeasure) {
    const healedGroup = ctx.groupTargets.flatMap(t => routeQueries.get(t) ?? [domQueries.get(t) ?? t]);
    const again = await client.getDOMGeometry(ctx.candidates, {
      scrollIntoView: true,
      zone: ctx.zonePolicy,
      groupTargets: healedGroup
    });
    if (again) finalGeometry = again;
  }

  // Evidência (ADR-017): o rótulo curado só altera o texto se o seu nó foi medido na união final
  for (const [target, healed] of healedByTarget) {
    const name = replacements.get(target) ?? (routeQueries.get(target) || []).join(' + ');
    const member = (finalGeometry.groupMembers || []).find(m => m.query === (domQueries.get(target) ?? routeQueries.get(target)?.[0]));
    if (member) {
      healed.evidence = {
        source: 'dom-measured',
        matchedSelector: member.matchedSelector,
        elementText: member.innerText || name,
        box: member.cssBox
      };
    }
  }

  let validatedText: string | undefined;
  if (replacements.size > 0) {
    validatedText = step.rawText;
    for (const [from, to] of replacements) {
      validatedText = validatedText.replace(`**${from}**`, `**${to}**`);
    }
  }
  return { geometry: finalGeometry, divergences, validatedText };
}

/**
 * Remove caracteres de fonte icônica (PUA `\uE000-\uF8FF`), zero-width e NBSP (`\u00A0`)
 * de nomes extraídos da Árvore de Acessibilidade (ADR-030).
 */
export function cleanA11yNodeName(name: string): string {
  return String(name ?? '')
    .replace(/[\uE000-\uF8FF\u200B-\u200D\uFEFF]/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const LLM_PRIMARY_ROLES = new Set(['button', 'link', 'tab', 'menuitem', 'textbox', 'searchbox', 'combobox', 'checkbox', 'radio']);

/**
 * Poda Semântica e Ranqueamento da Camada 2B (ADR-030):
 *  a) Mantém apenas nós acionáveis com `@ref` válido (`/^@?e\d+$/`), descartando `role: 'label'` sem ref;
 *  b) Limpa PUA/NBSP, veta `forbiddenCandidateReason` e `evaluateSemanticCompatibility` (`weight === 0`),
 *     remove itens de navegação quando `zone === 'content'` e rebaixa em `content-preferred`;
 *  c) Deduplica ações repetidas de grade por `(role, normalizeText(name), normalizeText(sectionTitle))`;
 *  d) Prioriza por afinidade semântica com o passo antes do corte de `maxNodes` (40).
 */
export function pruneAndPrioritizeNodesForLLM(
  step: RoutineStep,
  nodes: ParsedA11yNode[],
  maxNodes = 40
): ParsedA11yNode[] {
  const zonePolicy: StepZonePolicy = step.zone ?? inferStepZone(step.rawText, step.actionType);
  const targets = step.targets.length > 0 ? step.targets : [step.rawText];
  const stepNorm = normalizeText(step.rawText);

  const dedupKeys = new Set<string>();
  const scored: Array<{ node: ParsedA11yNode; score: number; order: number }> = [];

  for (let idx = 0; idx < nodes.length; idx++) {
    const rawNode = nodes[idx];
    const rawRef = String(rawNode.ref ?? '').trim();
    if (rawNode.role === 'label' || !/^@?e\d+$/i.test(rawRef)) continue;
    const ref = rawRef.startsWith('@') ? rawRef : `@${rawRef}`;

    const cleanedName = cleanA11yNodeName(rawNode.name);
    if (!cleanedName) continue;

    if (forbiddenCandidateReason(step, { name: cleanedName, role: rawNode.role, inNavbar: rawNode.inNavbar })) {
      continue;
    }

    const isNavNode = Boolean(
      rawNode.inNavbar || rawNode.semanticRole === 'navigation_root' || rawNode.semanticRole === 'navigation_leaf'
    );
    if (zonePolicy === 'content' && isNavNode) {
      continue;
    }

    const cleanSection = rawNode.sectionTitle ? cleanA11yNodeName(rawNode.sectionTitle) : undefined;
    const normName = normalizeText(cleanedName);
    const dedupKey = `${rawNode.role.toLowerCase()}|${normName}|${normalizeText(cleanSection || '')}`;
    if (dedupKeys.has(dedupKey)) continue;

    let bestCompatScore = -1;
    let bestWeight = 0;
    for (const docTarget of targets) {
      const compat = evaluateSemanticCompatibility(step, docTarget, {
        name: cleanedName,
        role: rawNode.role,
        inNavbar: rawNode.inNavbar,
        sectionTitle: cleanSection,
        rowContext: rawNode.rowContext,
        associatedLabel: rawNode.associatedLabel,
        semanticRole: rawNode.semanticRole
      });
      if (!compat.compatible || compat.weight === 0) continue;

      const normDoc = normalizeText(docTarget);
      const dice = computeDiceSimilarity(normDoc, normName);
      const exactBoost = normDoc && normName && normDoc === normName ? 0.9 : 0;
      const phraseBoost = hasWholePhrase(normName, normDoc) || hasWholePhrase(normDoc, normName) ? 0.25 : 0;
      const synList = ORION_UI_SYNONYMS[normDoc] || [];
      const synBoost = synList.some(s => synonymMatchesNode(s, normName)) ? 0.5 : 0;
      const affinity = (dice + exactBoost + phraseBoost + synBoost) * compat.weight;
      if (affinity > bestCompatScore) {
        bestCompatScore = affinity;
        bestWeight = compat.weight;
      }
    }

    // Vetado em todos os alvos por incompatibilidade semântica (`weight === 0`)
    if (bestWeight === 0) continue;

    dedupKeys.add(dedupKey);

    let priority = Math.max(0, bestCompatScore);
    if (LLM_PRIMARY_ROLES.has(rawNode.role.toLowerCase())) priority += 0.08;
    if (cleanSection) {
      const normSec = normalizeText(cleanSection);
      if (normSec.length >= 3 && stepNorm.includes(normSec)) priority += 0.12;
    }
    if (zonePolicy === 'content-preferred' && isNavNode) priority -= 0.4;

    scored.push({
      node: {
        ...rawNode,
        ref,
        name: cleanedName,
        ...(cleanSection ? { sectionTitle: cleanSection } : {})
      },
      score: priority,
      order: idx
    });
  }

  scored.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.order - b.order));
  return scored.slice(0, maxNodes).map(s => s.node);
}

/**
 * Adapta um runner de teste (tanto `AgyTransportFn` quanto um mock de `fetch` legado `(url, init) => Promise<Response>`)
 * para `AgyTransportFn`, permitindo que suítes de testes rodem 100% offline sem processos externos.
 */
function adaptCustomTransport(
  customRunnerOrFetch?: AgyTransportFn | typeof fetch
): AgyTransportFn | undefined {
  if (!customRunnerOrFetch) return undefined;
  return async req =>
    (customRunnerOrFetch as any)(req, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: req.prompt,
        imagePath: req.imagePath,
        model: req.model,
        effort: req.effort
      })
    });
}

/**
 * Sub-camada 2B (ADR-030 / ADR-031): Fallback estruturado de chamada única ao Antigravity CLI (`agy`)
 * configurado em `Gemini 4 Hydrogen Extra` sobre a Árvore de Acessibilidade compacta podada (máx. 40 nós).
 * Zero APIs externas (`OPENAI_API_KEY` e `claude -p` aposentados).
 */
export async function resolveViaLLMOnAccessibilityTree(
  step: RoutineStep,
  nodes: ParsedA11yNode[],
  customRunnerOrFetch?: AgyTransportFn | typeof fetch
): Promise<{ node: ParsedA11yNode; documentedTarget: string; confidence: number; reason: string } | null> {
  const pruned = pruneAndPrioritizeNodesForLLM(step, nodes, 40);
  if (pruned.length === 0) return null;

  const compactTree = pruned
    .map(n => `${n.ref} [${n.role}] "${n.name}"${n.sectionTitle ? ` {${n.sectionTitle}}` : ''}`)
    .join('\n');

  const prompt = [
    `Você é o módulo SmartLocator (Camada 2B) de auto-cura de seletores do ERP Orion TN.`,
    `Passo documentado no manual: "${step.rawText}"`,
    `Alvos procurados: ${JSON.stringify(step.targets)}`,
    `Elementos interativos presentes na tela atual (Accessibility Tree):`,
    compactTree,
    `Responda APENAS um objeto JSON válido no formato:`,
    `{"ref":"@eXX","confidence":0.0,"reason":"motivo curto"} (use confidence=0 se nenhum elemento corresponder).`
  ].join('\n');

  try {
    const parsed = await invokeAgyJson<{ ref?: string | null; confidence?: number; reason?: string }>(
      { prompt },
      adaptCustomTransport(customRunnerOrFetch)
    );
    if (!parsed || !parsed.ref || typeof parsed.confidence !== 'number' || parsed.confidence < 0.65) {
      return null;
    }

    const normRef = `@${String(parsed.ref).replace(/^@/, '')}`;
    const matchedNode = pruned.find(n => n.ref === parsed.ref || n.ref === normRef);
    if (!matchedNode) return null;

    if (forbiddenCandidateReason(step, { name: matchedNode.name, role: matchedNode.role, inNavbar: matchedNode.inNavbar })) {
      return null;
    }
    const targets = step.targets.length > 0 ? step.targets : [step.rawText];
    const hasCompatibleTarget = targets.some(docTarget => {
      const compat = evaluateSemanticCompatibility(step, docTarget, {
        name: matchedNode.name,
        role: matchedNode.role,
        inNavbar: matchedNode.inNavbar,
        sectionTitle: matchedNode.sectionTitle,
        rowContext: matchedNode.rowContext,
        associatedLabel: matchedNode.associatedLabel,
        semanticRole: matchedNode.semanticRole
      });
      return compat.compatible && compat.weight > 0;
    });
    if (!hasCompatibleTarget) return null;

    return {
      node: matchedNode,
      documentedTarget: step.targets[0] || step.rawText,
      confidence: Number(parsed.confidence.toFixed(2)),
      reason: String(parsed.reason || 'Equivalência semântica identificada via agy (Gemini 4 Hydrogen Extra) na Árvore de Acessibilidade')
    };
  } catch {
    return null;
  }
}

// =========================================================================
// CAMADA 2C (ADR-031): Set-of-Mark (SoM) em Memória + Visual Grounding DOM
// =========================================================================

export interface SomInteractiveCandidate {
  id: number;
  box: BoundingBox;
  tagName: string;
  role: string;
  name: string;
  innerText?: string;
  selector: string;
  sectionTitle?: string;
  rowContext?: DOMSemanticSignature['rowContext'];
  associatedLabel?: string;
  semanticRole?: SemanticRole;
  inNavbar?: boolean;
  angularBindings?: DOMAngularBindings;
}

export interface SomVlmDecision {
  tagId: number | null;
  confidence: number;
  reason: string;
}

export interface VisualGroundingDecision {
  x: number | null;
  y: number | null;
  confidence: number;
  reason: string;
}

export interface PendingSomQueueItem {
  id: string;
  routineId: string;
  stepNumber: number;
  rawText: string;
  targets: string[];
  actionType: ActionType;
  zonePolicy: StepZonePolicy;
  routeHash: string;
  somImagePath: string;
  cleanImagePath?: string;
  candidates: SomInteractiveCandidate[];
  createdAt: string;
  status: 'pending' | 'curated' | 'rejected';
  curationDecision?: {
    tagId: number | null;
    matchedName?: string;
    confidence: number;
    reason: string;
    curatedAt: string;
  };
}

export const PENDING_SOM_DIR = () => path.join(config.rootDir, 'auditoria', 'cache', 'pending-som');
export const PENDING_SOM_QUEUE_FILE = () => path.join(PENDING_SOM_DIR(), 'pending-som-queue.json');

const pendingQueueMutex = new AsyncSemaphore(1);

/**
 * Parseia estritamente a resposta JSON da Sub-camada 2C-SoM (`{"tagId": number | null, "confidence": number, "reason": string}`).
 */
export function parseSomVlmResponse(rawInput: unknown): SomVlmDecision | null {
  const parsed = parseStrictJsonFromAgyOutput<Record<string, any>>(rawInput);
  if (!parsed || typeof parsed !== 'object') return null;

  const rawTag = parsed.tagId !== undefined ? parsed.tagId : parsed.tag_id;
  let tagId: number | null = null;
  if (typeof rawTag === 'number' && Number.isFinite(rawTag)) {
    tagId = Math.trunc(rawTag);
  } else if (typeof rawTag === 'string') {
    const m = rawTag.match(/\d+/);
    if (m) tagId = parseInt(m[0], 10);
  }
  if (tagId !== null && tagId <= 0) tagId = null;

  const conf = Number(parsed.confidence);
  if (!Number.isFinite(conf)) return null;

  return {
    tagId,
    confidence: clamp(Number(conf.toFixed(2)), 0, 1),
    reason: String(parsed.reason || '').trim() || 'Inferência visual Set-of-Mark (Camada 2C-SoM)'
  };
}

/**
 * Parseia estritamente a resposta JSON da Sub-camada 2C-Grounding
 * (`{"x": number | null, "y": number | null, "confidence": number, "reason": string}`, coordenadas normalizadas `[0..1000]`).
 */
export function parseVisualGroundingResponse(rawInput: unknown): VisualGroundingDecision | null {
  const parsed = parseStrictJsonFromAgyOutput<Record<string, any>>(rawInput);
  if (!parsed || typeof parsed !== 'object') return null;

  let x: number | null = null;
  let y: number | null = null;

  if (typeof parsed.x === 'number' && typeof parsed.y === 'number' && Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
    x = parsed.x;
    y = parsed.y;
  } else if (Array.isArray(parsed.point) && parsed.point.length >= 2) {
    const px = Number(parsed.point[0]);
    const py = Number(parsed.point[1]);
    if (Number.isFinite(px) && Number.isFinite(py)) {
      x = px;
      y = py;
    }
  } else if (Array.isArray(parsed.box_2d) && parsed.box_2d.length === 4) {
    // Formato [ymin, xmin, ymax, xmax] normalizado 0..1000
    const [ymin, xmin, ymax, xmax] = parsed.box_2d.map(Number);
    if ([ymin, xmin, ymax, xmax].every(Number.isFinite)) {
      x = (xmin + xmax) / 2;
      y = (ymin + ymax) / 2;
    }
  }

  const conf = Number(parsed.confidence);
  if (!Number.isFinite(conf)) return null;

  if (x !== null && y !== null) {
    if (x < 0 || x > 1000 || y < 0 || y > 1000) {
      return null;
    }
  }

  return {
    x,
    y,
    confidence: clamp(Number(conf.toFixed(2)), 0, 1),
    reason: String(parsed.reason || '').trim() || 'Inferência de coordenadas Visual Grounding (Camada 2C-Grounding)'
  };
}

/**
 * Converte coordenadas visuais normalizadas `[0..1000]` para pixels físicos do viewport (`1440×900`).
 */
export function normalizedPointToViewportPx(
  normX: number,
  normY: number,
  viewportWidth = 1440,
  viewportHeight = 900
): Point {
  const px = clamp(Math.round((clamp(normX, 0, 1000) / 1000) * viewportWidth), 0, Math.max(0, viewportWidth - 1));
  const py = clamp(Math.round((clamp(normY, 0, 1000) / 1000) * viewportHeight), 0, Math.max(0, viewportHeight - 1));
  return { x: px, y: py };
}

/**
 * Valida se o candidato selecionado pela VLM (2C-SoM ou 2C-Grounding) respeita:
 * 1. A Guarda de Navegação (`forbiddenCandidateReason`, ADR-024/ADR-026);
 * 2. O Filtro de Zona Semântica (`zonePolicy === 'content'` veta `inNavbar` / `navigation_*`, ADR-015);
 * 3. A Matriz de Compatibilidade Semântica Intenção × Papel (`evaluateSemanticCompatibility`, ADR-027).
 */
export function validateVisualCandidateSemantics(
  step: RoutineStep,
  candidate: Pick<
    SomInteractiveCandidate,
    'name' | 'role' | 'inNavbar' | 'sectionTitle' | 'rowContext' | 'associatedLabel' | 'semanticRole'
  >,
  zonePolicy?: StepZonePolicy
): { allowed: boolean; reason?: string } {
  const effectiveZone = zonePolicy ?? step.zone ?? inferStepZone(step.rawText, step.actionType);
  const candidateName = cleanA11yNodeName(candidate.name || candidate.associatedLabel || '');

  const navForbidden = forbiddenCandidateReason(step, {
    name: candidateName,
    role: candidate.role,
    inNavbar: candidate.inNavbar
  });
  if (navForbidden) {
    return { allowed: false, reason: navForbidden };
  }

  const isNavNode = Boolean(
    candidate.inNavbar ||
      candidate.semanticRole === 'navigation_root' ||
      candidate.semanticRole === 'navigation_leaf'
  );
  if (effectiveZone === 'content' && isNavNode) {
    return {
      allowed: false,
      reason: 'Elemento pertence à zona de navegação lateral/superior, vedada em passo de zona "content" (ADR-015)'
    };
  }

  const targets = step.targets.length > 0 ? step.targets : [step.rawText];
  let anyCompatible = false;
  let lastCompatReason = 'Incompatibilidade semântica Intenção × Papel (ADR-027)';

  for (const docTarget of targets) {
    const compat = evaluateSemanticCompatibility(step, docTarget, {
      name: candidateName,
      role: candidate.role,
      inNavbar: candidate.inNavbar,
      sectionTitle: candidate.sectionTitle,
      rowContext: candidate.rowContext,
      associatedLabel: candidate.associatedLabel,
      semanticRole: candidate.semanticRole
    });
    if (compat.compatible && compat.weight > 0) {
      anyCompatible = true;
      break;
    }
    if (compat.reason) lastCompatReason = compat.reason;
  }

  if (!anyCompatible) {
    return { allowed: false, reason: lastCompatReason };
  }

  return { allowed: true };
}

/**
 * Filtra e limita a lista de candidatos interativos para o Set-of-Mark (máx. 45 na zona do passo).
 */
export function filterSomCandidatesForStep(
  step: RoutineStep,
  candidates: SomInteractiveCandidate[],
  maxCandidates = MAX_SOM_CANDIDATES
): SomInteractiveCandidate[] {
  const zonePolicy = step.zone ?? inferStepZone(step.rawText, step.actionType);
  const filtered: SomInteractiveCandidate[] = [];

  for (const c of candidates) {
    if (c.box.width <= 1 || c.box.height <= 1) continue;
    const check = validateVisualCandidateSemantics(step, c, zonePolicy);
    if (!check.allowed) continue;
    filtered.push(c);
    if (filtered.length >= maxCandidates) break;
  }

  return filtered;
}

/**
 * Gera o script injetável via STDIN que coleta até `maxCandidates` (45) candidatos interativos visíveis
 * na zona do passo (atravessando Open Shadow DOM e iframes same-origin até profundidade 6),
 * carimba `data-orion-som-id="1..N"` e extrai coordenadas CSS reais e assinatura semântica.
 */
export function buildCollectSomCandidatesScript(
  zonePolicy: StepZonePolicy,
  maxCandidates = MAX_SOM_CANDIDATES,
  fallbackZoom = config.browserZoom || 0.8
): string {
  const effectiveZone = zonePolicy === 'content' ? 'content' : 'any';
  return `
    (() => {
      const MAX_DEPTH = 6;
      const MAX_ITEMS = ${JSON.stringify(Math.min(MAX_SOM_CANDIDATES, Math.max(1, maxCandidates)))};
      const ZONE = ${JSON.stringify(effectiveZone)};
      const NAV_ZONE = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const ACTIVE_MODAL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const FALLBACK_ZOOM = ${JSON.stringify(fallbackZoom)};
      const INTERACTIVE = 'button, a, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="combobox"], [ng-click], [ui-sref], .btn, orion-checkbox';

      const clean = t => String(t == null ? '' : t).replace(/[\\uE000-\\uF8FF\\u200B-\\u200D\\uFEFF]/g, '').replace(/\\u00A0/g, ' ').replace(/\\s+/g, ' ').trim();
      const composedParent = node => {
        if (!node) return null;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode ? node.getRootNode() : null;
        return root && root.host ? root.host : null;
      };
      const composedClosest = (node, selector) => {
        let cur = node;
        while (cur) {
          if (cur.nodeType === 1 && cur.matches && cur.matches(selector)) return cur;
          cur = composedParent(cur);
        }
        return null;
      };
      const queryAllDeep = (root, selector, depth) => {
        const d = depth || 0;
        const out = [];
        const seen = new Set();
        if (!root || d > MAX_DEPTH) return out;
        const add = el => {
          if (el && !seen.has(el)) {
            seen.add(el);
            out.push(el);
          }
        };
        if (root.querySelectorAll) {
          try {
            const direct = root.querySelectorAll(selector);
            for (let i = 0; i < direct.length; i++) add(direct[i]);
          } catch (e) {}
        }
        if (d === 0 && root.shadowRoot) {
          const own = queryAllDeep(root.shadowRoot, selector, d + 1);
          for (let j = 0; j < own.length; j++) add(own[j]);
        }
        if (d < MAX_DEPTH && root.querySelectorAll) {
          try {
            const all = root.querySelectorAll('*');
            for (let i = 0; i < all.length; i++) {
              const host = all[i];
              if (host && host.shadowRoot) {
                const inner = queryAllDeep(host.shadowRoot, selector, d + 1);
                for (let j = 0; j < inner.length; j++) add(inner[j]);
              }
            }
          } catch (e) {}
        }
        return out;
      };
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        if (composedClosest(e, '.ng-hide, .ngx-orion-hide')) return false;
        const win = (e.ownerDocument && e.ownerDocument.defaultView) || window;
        const r = e.getBoundingClientRect();
        const s = win.getComputedStyle(e);
        return r.width > 2 && r.height > 2 && s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.05;
      };
      const humanizeNg = (expr, mode) => {
        const raw = String(expr || '').trim();
        if (!raw) return '';
        const core = mode === 'action' ? raw.split('(')[0] : raw.split('|')[0];
        const segs = core.split('.').map(s => s.trim()).filter(Boolean);
        const filtered = segs.filter((s, i) => i > 0 || !/^(vm|ctrl|\\$ctrl|\\$scope|model|filtro|form|entidade|item|dados|dto)$/i.test(s));
        const target = (filtered.length > 0 ? filtered : segs).join(' ');
        return target.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      };
      const sectionOf = el => {
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const body = cur.ownerDocument ? cur.ownerDocument.body : document.body;
          if (cur === body) break;
          if (cur.tagName === 'FIELDSET') {
            const leg = queryAllDeep(cur, 'legend').find(vis);
            if (leg) return clean(leg.innerText || leg.textContent);
          }
          if (cur.matches && cur.matches('.panel, .card, .box, .modal-content, .well, section')) {
            const hd = cur.querySelector(':scope > .panel-heading, :scope > .card-header, :scope > .box-header, :scope > .modal-header .modal-title, :scope > h3, :scope > h4, :scope > h5, :scope > legend');
            if (hd && vis(hd)) return clean(hd.innerText || hd.textContent);
          }
          cur = composedParent(cur);
        }
        return undefined;
      };
      const rowOf = el => {
        const tr = composedClosest(el, 'tr');
        const pTr = tr ? composedParent(tr) : null;
        if (!tr || !pTr) return undefined;
        const rows = Array.from(pTr.children || []).filter(r => r.tagName === 'TR');
        const cells = Array.from(tr.querySelectorAll('td, th')).map(c => clean(c.innerText || c.textContent)).filter(Boolean);
        return cells.length > 0 ? { rowIndex: Math.max(0, rows.indexOf(tr)), firstColText: cells[0], secondColText: cells[1] } : undefined;
      };
      const inferRole = (el, text, inNav, rowCtx) => {
        const t = (text || '').toLowerCase();
        const tag = (el.tagName || '').toLowerCase();
        if (inNav) return composedClosest(el, '.dropdown-menu, .sub-menu') ? 'navigation_leaf' : 'navigation_root';
        if (tag === 'input' || tag === 'select' || tag === 'textarea') {
          return /pesquis|filtr|busca/i.test(t) ? 'search_filter_input' : 'form_input';
        }
        if (/novo\\s+cart[aã]o/i.test(t)) return 'entity_creation_button';
        if (rowCtx && (t === '+' || /adicionar|selecionar|incluir/i.test(t))) return 'grid_row_picker';
        if (/^(salvar|gravar|concluir|confirmar|cadastrar)$/i.test(t)) return 'form_submit';
        if (/^(cancelar|limpar|voltar|fechar)$/i.test(t)) return 'form_cancel';
        if (/^(filtrar|pesquisar|buscar|consultar|listar)$/i.test(t)) return 'search_trigger_button';
        return 'service_execution_trigger';
      };

      const vpW = window.innerWidth || 1440;
      const vpH = window.innerHeight || 900;
      const modals = queryAllDeep(document, ACTIVE_MODAL).filter(vis);
      const topModal = modals.length > 0 ? modals[modals.length - 1] : null;
      const searchRoot = topModal || document;

      for (const old of queryAllDeep(document, '[data-orion-som-id]')) {
        old.removeAttribute('data-orion-som-id');
      }

      const rawElements = queryAllDeep(searchRoot, INTERACTIVE).filter(vis);
      const out = [];
      const rowActionDedup = new Set();
      let nextId = 1;

      for (const el of rawElements) {
        if (nextId > MAX_ITEMS) break;
        const inNavbar = Boolean(composedClosest(el, NAV_ZONE));
        if (ZONE === 'content' && inNavbar && !topModal) continue;

        const r = el.getBoundingClientRect();
        const x1 = Math.max(0, Math.round(r.left));
        const y1 = Math.max(0, Math.round(r.top));
        const x2 = Math.min(vpW, Math.round(r.right));
        const y2 = Math.min(vpH, Math.round(r.bottom));
        if (x2 - x1 < 4 || y2 - y1 < 4) continue;
        // Ignora contêineres gigantes
        if ((x2 - x1) * (y2 - y1) > vpW * vpH * 0.35) continue;

        const innerText = clean(el.innerText || el.textContent || '');
        const ngModel = clean(el.getAttribute('ng-model') || el.getAttribute('data-ng-model') || '');
        const ngClick = clean(el.getAttribute('ng-click') || el.getAttribute('data-ng-click') || '');
        const uiSref = clean(el.getAttribute('ui-sref') || '');
        const humanizedModel = humanizeNg(ngModel, 'model');
        const humanizedAction = humanizeNg(ngClick, 'action');
        const iconEl = el.querySelector ? el.querySelector('i[class], span[class*="fa-"], span[class*="glyphicon-"], svg') : null;
        const iconCls = iconEl ? clean(iconEl.getAttribute('class') || iconEl.tagName) : '';
        const attrLabel = clean(
          el.getAttribute('title') ||
          el.getAttribute('data-original-title') ||
          el.getAttribute('aria-label') ||
          el.getAttribute('placeholder') ||
          el.getAttribute('value') ||
          humanizedAction ||
          humanizedModel ||
          iconCls ||
          ''
        );
        const displayName = innerText || attrLabel || (el.tagName || 'control').toLowerCase();
        const sectionTitle = sectionOf(el);
        const rowContext = rowOf(el);

        // Deduplica ações repetidas em linhas subsequentes de tabela
        if (rowContext && rowContext.rowIndex > 0) {
          const rowKey = (el.tagName || '') + '|' + displayName.toLowerCase() + '|' + (sectionTitle || '');
          if (rowActionDedup.has(rowKey)) continue;
          rowActionDedup.add(rowKey);
        }

        const id = nextId++;
        el.setAttribute('data-orion-som-id', String(id));
        const tag = (el.tagName || 'div').toLowerCase();
        const role = clean(el.getAttribute('role') || (tag === 'a' ? 'link' : tag === 'input' || tag === 'textarea' ? 'textbox' : tag === 'select' ? 'combobox' : 'button')).toLowerCase();
        const semanticRole = inferRole(el, displayName, inNavbar, rowContext);

        out.push({
          id,
          box: { x: x1, y: y1, width: x2 - x1, height: y2 - y1 },
          tagName: tag,
          role,
          name: displayName.slice(0, 90),
          innerText: innerText ? innerText.slice(0, 90) : undefined,
          selector: '[data-orion-som-id="' + id + '"]',
          sectionTitle,
          rowContext,
          associatedLabel: attrLabel || undefined,
          semanticRole,
          inNavbar,
          angularBindings: (ngModel || ngClick || uiSref)
            ? {
                ...(ngModel ? { ngModel, humanizedModel } : {}),
                ...(ngClick ? { ngClick, humanizedAction } : {}),
                ...(uiSref ? { uiSref } : {})
              }
            : undefined
        });
      }

      return JSON.stringify(out);
    })()
  `;
}

/**
 * Coleta até 45 candidatos interativos visíveis na zona do passo e aplica pré-filtragem semântica (ADR-031).
 */
export async function collectInteractiveSomCandidates(
  client: AgentBrowserClient,
  step: RoutineStep,
  zonePolicy: StepZonePolicy,
  maxCandidates = MAX_SOM_CANDIDATES
): Promise<SomInteractiveCandidate[]> {
  try {
    const raw = await client.evalJson<SomInteractiveCandidate[]>(
      buildCollectSomCandidatesScript(zonePolicy, maxCandidates)
    );
    return filterSomCandidatesForStep(step, raw || [], maxCandidates);
  } catch {
    return [];
  }
}

/**
 * Script injetável via STDIN para ancorar coordenadas `(px, py)` no DOM real via `document.elementFromPoint(px, py)`,
 * com descida recursiva em Open Shadow DOM (`shadowRoot.elementFromPoint`) e iframes same-origin,
 * carimbando `data-orion-grounding-target="1"` no controle interativo encontrado (ADR-031).
 */
export function buildAnchorVisualPointScript(px: number, py: number): string {
  return `
    (() => {
      const MAX_DEPTH = 6;
      const NAV_ZONE = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const INTERACTIVE = 'button, a, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="combobox"], [ng-click], [ui-sref], .btn, orion-checkbox';
      const clean = t => String(t == null ? '' : t).replace(/[\\uE000-\\uF8FF\\u200B-\\u200D\\uFEFF]/g, '').replace(/\\u00A0/g, ' ').replace(/\\s+/g, ' ').trim();
      const composedParent = node => {
        if (!node) return null;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode ? node.getRootNode() : null;
        return root && root.host ? root.host : null;
      };
      const composedClosest = (node, selector) => {
        let cur = node;
        while (cur) {
          if (cur.nodeType === 1 && cur.matches && cur.matches(selector)) return cur;
          cur = composedParent(cur);
        }
        return null;
      };

      const deepHitAt = (docOrRoot, x, y, depth) => {
        if (!docOrRoot || !docOrRoot.elementFromPoint || depth > MAX_DEPTH) return null;
        let hit = docOrRoot.elementFromPoint(x, y);
        while (hit && depth < MAX_DEPTH) {
          if (hit.shadowRoot && hit.shadowRoot.elementFromPoint) {
            const inner = hit.shadowRoot.elementFromPoint(x, y);
            if (!inner || inner === hit) break;
            hit = inner;
            depth++;
            continue;
          }
          if (hit.tagName === 'IFRAME' && hit.contentDocument) {
            try {
              const fr = hit.getBoundingClientRect();
              const scaleX = hit.offsetWidth > 0 ? fr.width / hit.offsetWidth : 1;
              const scaleY = hit.offsetHeight > 0 ? fr.height / hit.offsetHeight : 1;
              const localX = (x - fr.left - (hit.clientLeft || 0)) / (scaleX || 1);
              const localY = (y - fr.top - (hit.clientTop || 0)) / (scaleY || 1);
              const frameHit = deepHitAt(hit.contentDocument, localX, localY, depth + 1);
              if (frameHit) return frameHit;
            } catch (e) {}
          }
          break;
        }
        return hit;
      };

      for (const old of document.querySelectorAll('[data-orion-grounding-target]')) {
        old.removeAttribute('data-orion-grounding-target');
      }

      const rawHit = deepHitAt(document, ${JSON.stringify(px)}, ${JSON.stringify(py)}, 0);
      if (!rawHit) return JSON.stringify(null);

      const target = composedClosest(rawHit, INTERACTIVE) || rawHit;
      if (!target || target === document.body || target === document.documentElement) {
        return JSON.stringify(null);
      }

      target.setAttribute('data-orion-grounding-target', '1');
      const r = target.getBoundingClientRect();
      const inNavbar = Boolean(composedClosest(target, NAV_ZONE));
      const innerText = clean(target.innerText || target.textContent || '');
      const associatedLabel = clean(
        target.getAttribute('title') ||
        target.getAttribute('data-original-title') ||
        target.getAttribute('aria-label') ||
        target.getAttribute('placeholder') ||
        target.getAttribute('ng-click') ||
        target.getAttribute('ng-model') ||
        ''
      ) || undefined;
      const tag = (target.tagName || 'div').toLowerCase();
      const role = clean(target.getAttribute('role') || (tag === 'a' ? 'link' : tag === 'input' ? 'textbox' : 'button')).toLowerCase();
      const name = innerText || associatedLabel || tag;

      return JSON.stringify({
        id: 1,
        box: { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) },
        tagName: tag,
        role,
        name: name.slice(0, 90),
        innerText: innerText ? innerText.slice(0, 90) : undefined,
        selector: '[data-orion-grounding-target="1"]',
        associatedLabel,
        inNavbar
      });
    })()
  `;
}

/**
 * Executa a Sub-camada 2C-SoM (Preferencial):
 * 1. Renderiza o overlay Set-of-Mark `[1]..[N]` em memória via Sharp (`renderSetOfMarkOverlay`);
 * 2. Invoca `agy` (`Gemini 4 Hydrogen Extra`) esperando `{"tagId": number | null, "confidence": number, "reason": string}`;
 * 3. Aplica o veto semântico pós-VLM (`validateVisualCandidateSemantics` — ADR-027 + Zona + Guarda de Navegação);
 * 4. Mede o `getBoundingClientRect()` real no DOM via `client.getDOMGeometry`.
 */
export async function resolveViaSetOfMark2C(
  client: AgentBrowserClient,
  step: RoutineStep,
  screenshotBuffer: Buffer,
  candidates: SomInteractiveCandidate[],
  options: {
    zonePolicy?: StepZonePolicy;
    workerId?: string;
    customVlmRunner?: AgyTransportFn | typeof fetch;
  } = {}
): Promise<{
  candidate: SomInteractiveCandidate;
  geometry: DOMResolvedGeometry;
  documentedTarget: string;
  confidence: number;
  reason: string;
} | null> {
  const zonePolicy = options.zonePolicy ?? step.zone ?? inferStepZone(step.rawText, step.actionType);
  const validCandidates = filterSomCandidatesForStep(step, candidates, MAX_SOM_CANDIDATES);
  if (validCandidates.length === 0) return null;

  const somBuffer = await renderSetOfMarkOverlay(
    screenshotBuffer,
    validCandidates.map(c => ({ id: c.id, box: c.box }))
  );

  const candidateLegend = validCandidates
    .map(
      c =>
        `[${c.id}] <${c.tagName} role="${c.role}"> "${c.name}"${c.sectionTitle ? ` {seção: ${c.sectionTitle}}` : ''}${c.associatedLabel && c.associatedLabel !== c.name ? ` (hint: ${c.associatedLabel})` : ''}`
    )
    .join('\n');

  const prompt = [
    `Você é o módulo visual Set-of-Mark (Camada 2C-SoM) do auditor do ERP Orion TN.`,
    `Analise a imagem anexa com as tags numeradas [1]..[${validCandidates.length}] sobre a tela 1440x900.`,
    `Passo documentado no manual: "${step.rawText}"`,
    `Alvos procurados: ${JSON.stringify(step.targets)}`,
    `Legenda dos candidatos interativos numerados na zona do passo:`,
    candidateLegend,
    `Responda ESTRITAMENTE um objeto JSON válido no formato:`,
    `{"tagId": number | null, "confidence": 0.0, "reason": "justificativa visual curta"}`,
    `(use "tagId": null e "confidence": 0 se nenhum candidato corresponder com segurança ao passo).`
  ].join('\n');

  const rawDecision = await invokeAgyVisionBufferJson<Record<string, unknown>>(
    {
      prompt,
      imageBuffer: somBuffer,
      workerId: options.workerId || 'single'
    },
    adaptCustomTransport(options.customVlmRunner)
  );

  const decision = parseSomVlmResponse(rawDecision);
  if (!decision || decision.tagId === null || decision.confidence < 0.68) {
    return null;
  }

  // Busca candidato na lista original ou filtrada e aplica o veto semântico explícito pós-VLM (ADR-027)
  const rawChosen = candidates.find(c => c.id === decision.tagId) ?? validCandidates.find(c => c.id === decision.tagId);
  if (!rawChosen) return null;

  const semanticCheck = validateVisualCandidateSemantics(step, rawChosen, zonePolicy);
  if (!semanticCheck.allowed) {
    console.log(
      `   ⛔ [Veto Semântico Pós-VLM 2C-SoM] Tag [${rawChosen.id}] "${rawChosen.name}" rejeitada: ${semanticCheck.reason}`
    );
    return null;
  }

  const queries = [rawChosen.selector, ...(rawChosen.innerText ? [rawChosen.innerText] : [])];
  const geometry = await client.getDOMGeometry(queries, { scrollIntoView: true, zone: zonePolicy });
  if (!geometry || isGenericContainerMatch(geometry)) return null;

  const measuredForbidden = forbiddenMeasuredReason(step, geometry.context);
  if (measuredForbidden) return null;

  if (geometry.context.semantic) {
    const postDomCheck = validateVisualCandidateSemantics(
      step,
      {
        name: geometry.context.innerText || rawChosen.name,
        role: geometry.context.role || rawChosen.role,
        inNavbar: geometry.context.isTopNav || geometry.context.isVerticalSidebar,
        sectionTitle: geometry.context.semantic.sectionTitle,
        rowContext: geometry.context.semantic.rowContext,
        associatedLabel: geometry.context.semantic.associatedLabel,
        semanticRole: geometry.context.semantic.semanticRole
      },
      zonePolicy
    );
    if (!postDomCheck.allowed) return null;
  }

  return {
    candidate: rawChosen,
    geometry,
    documentedTarget: step.targets[0] || step.rawText,
    confidence: decision.confidence,
    reason: decision.reason
  };
}

/**
 * Executa a Sub-camada 2C-Grounding (Fallback para Canvas / OOPIF / Toolbars sem candidato SoM):
 * 1. Envia a screenshot limpa `1440×900` ao `agy` (`Gemini 4 Hydrogen Extra`);
 * 2. Recebe coordenadas normalizadas `[0..1000]`, converte para pixels `(px, py)` no viewport `1440×900`;
 * 3. Ancora via `document.elementFromPoint(px, py)` (incluindo Open Shadow DOM e iframes);
 * 4. Valida com `validateVisualCandidateSemantics` e mede `getBoundingClientRect()` real no DOM.
 */
export async function resolveViaVisualGrounding2C(
  client: AgentBrowserClient,
  step: RoutineStep,
  cleanScreenshotBuffer: Buffer,
  options: {
    zonePolicy?: StepZonePolicy;
    workerId?: string;
    customVlmRunner?: AgyTransportFn | typeof fetch;
  } = {}
): Promise<{
  candidate: SomInteractiveCandidate;
  geometry: DOMResolvedGeometry;
  pointPx: Point;
  documentedTarget: string;
  confidence: number;
  reason: string;
} | null> {
  const zonePolicy = options.zonePolicy ?? step.zone ?? inferStepZone(step.rawText, step.actionType);

  const prompt = [
    `Você é o módulo de Visual Grounding (Camada 2C-Grounding) do auditor do ERP Orion TN.`,
    `Analise a captura limpa 1440x900 anexa e localize o controle visual correspondente ao passo.`,
    `Passo documentado no manual: "${step.rawText}"`,
    `Alvos procurados: ${JSON.stringify(step.targets)}`,
    `Devolva as coordenadas normalizadas [0..1000] do centro do elemento (onde 0,0 é o canto superior esquerdo e 1000,1000 é o canto inferior direito).`,
    `Responda ESTRITAMENTE um objeto JSON válido no formato:`,
    `{"x": number | null, "y": number | null, "confidence": 0.0, "reason": "descrição visual do controle"}`,
    `(use "x": null, "y": null e "confidence": 0 se o controle não estiver visível na tela).`
  ].join('\n');

  const rawDecision = await invokeAgyVisionBufferJson<Record<string, unknown>>(
    {
      prompt,
      imageBuffer: cleanScreenshotBuffer,
      workerId: options.workerId || 'single'
    },
    adaptCustomTransport(options.customVlmRunner)
  );

  const decision = parseVisualGroundingResponse(rawDecision);
  if (!decision || decision.x === null || decision.y === null || decision.confidence < 0.68) {
    return null;
  }

  const pointPx = normalizedPointToViewportPx(decision.x, decision.y, 1440, 900);
  const anchored = await client
    .evalJson<SomInteractiveCandidate | null>(buildAnchorVisualPointScript(pointPx.x, pointPx.y))
    .catch(() => null);
  if (!anchored) return null;

  const semanticCheck = validateVisualCandidateSemantics(step, anchored, zonePolicy);
  if (!semanticCheck.allowed) {
    console.log(
      `   ⛔ [Veto Semântico Pós-VLM 2C-Grounding] Ponto (${pointPx.x}, ${pointPx.y}) -> "${anchored.name}" rejeitado: ${semanticCheck.reason}`
    );
    return null;
  }

  const geometry = await client.getDOMGeometry([anchored.selector], { scrollIntoView: true, zone: zonePolicy });
  if (!geometry || isGenericContainerMatch(geometry)) return null;

  const measuredForbidden = forbiddenMeasuredReason(step, geometry.context);
  if (measuredForbidden) return null;

  if (geometry.context.semantic) {
    const postDomCheck = validateVisualCandidateSemantics(
      step,
      {
        name: geometry.context.innerText || anchored.name,
        role: geometry.context.role || anchored.role,
        inNavbar: geometry.context.isTopNav || geometry.context.isVerticalSidebar,
        sectionTitle: geometry.context.semantic.sectionTitle,
        rowContext: geometry.context.semantic.rowContext,
        associatedLabel: geometry.context.semantic.associatedLabel,
        semanticRole: geometry.context.semantic.semanticRole
      },
      zonePolicy
    );
    if (!postDomCheck.allowed) return null;
  }

  return {
    candidate: anchored,
    geometry,
    pointPx,
    documentedTarget: step.targets[0] || step.rawText,
    confidence: decision.confidence,
    reason: decision.reason
  };
}

/**
 * Lê a fila de overlays Set-of-Mark pendentes (`auditoria/cache/pending-som/pending-som-queue.json`).
 */
export function readPendingSomQueue(): PendingSomQueueItem[] {
  const file = PENDING_SOM_QUEUE_FILE();
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Grava a fila de overlays Set-of-Mark pendentes (`auditoria/cache/pending-som/pending-som-queue.json`).
 */
export async function writePendingSomQueue(items: PendingSomQueueItem[]): Promise<void> {
  const file = PENDING_SOM_QUEUE_FILE();
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, JSON.stringify(items, null, 2), 'utf8');
}

/**
 * Modo `defer` (ADR-031): salva o overlay SoM pendente em
 * `auditoria/cache/pending-som/<routineId>-passo-<NN>-som.png` e registra os metadados/candidatos em
 * `auditoria/cache/pending-som/pending-som-queue.json` sem invocar subprocessos `agy` durante o lote.
 */
export async function enqueuePendingSomForCuration(input: {
  routineId: string;
  step: RoutineStep;
  zonePolicy: StepZonePolicy;
  routeHash: string;
  screenshotBuffer: Buffer;
  candidates: SomInteractiveCandidate[];
}): Promise<PendingSomQueueItem> {
  const padStep = String(input.step.stepNumber).padStart(2, '0');
  const safeRoutine = String(input.routineId || 'UNKNOWN').replace(/[^a-zA-Z0-9._-]/g, '-');
  const itemId = `${safeRoutine}-passo-${padStep}`;
  const dir = PENDING_SOM_DIR();
  await fs.promises.mkdir(dir, { recursive: true });

  const somFileName = `${safeRoutine}-passo-${padStep}-som.png`;
  const somImagePath = path.join(dir, somFileName);
  const somBuffer = await renderSetOfMarkOverlay(
    input.screenshotBuffer,
    input.candidates.map(c => ({ id: c.id, box: c.box }))
  );
  await fs.promises.writeFile(somImagePath, somBuffer);

  const item: PendingSomQueueItem = {
    id: itemId,
    routineId: input.routineId,
    stepNumber: input.step.stepNumber,
    rawText: input.step.rawText,
    targets: [...input.step.targets],
    actionType: input.step.actionType,
    zonePolicy: input.zonePolicy,
    routeHash: input.routeHash,
    somImagePath: path.relative(config.rootDir, somImagePath).replace(/\\/g, '/'),
    candidates: input.candidates,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  await pendingQueueMutex.runExclusive(async () => {
    const queue = readPendingSomQueue();
    const idx = queue.findIndex(q => q.id === itemId);
    if (idx >= 0) {
      queue[idx] = item;
    } else {
      queue.push(item);
    }
    await writePendingSomQueue(queue);
  });

  console.log(
    `   ⏸ [Camada 2C Defer] Overlay SoM (${input.candidates.length} candidatos) enfileirado em ${item.somImagePath} para curadoria pós-lote (visual:curate).`
  );
  return item;
}

export interface SmartLocateOptions {
  /**
   * `false` restringe a busca à medição direta no DOM (sem Auto-Cura por similaridade). Usado em
   * passos que apenas listam opções alternativas: uma opção ausente não deve ser "curada" para
   * outro elemento da tela (ADR-016).
   */
  allowHealing?: boolean;
  /**
   * Curas já comprovadas numa auditoria anterior para ESTE passo (ADR-025). Entram como Camada 0.5, depois da
   * medição direta do alvo documentado: se o manual está certo, a dica nem é usada. Só valem se o nó for
   * medido ao vivo de novo; a dica acelera e estabiliza, nunca comprova.
   */
  priorHints?: Array<{ documented: string; actual: string; layer: SmartLocatorDivergence['resolutionLayer']; confidence: number }>;
  /** Rotas de menu reais já comprovadas para este passo (ADR-025), repassadas à Camada 0 */
  priorMenuChains?: string[][];
  /** Modo de operação da Camada 2B/2C (`live` | `defer` — ADR-031). Default: `live` */
  visualMode?: VisualAuditMode;
  /** Identificador do worker atual para isolamento de imagens efêmeras `som-worker-${workerId}-${ts}.png` */
  workerSessionId?: string;
}

/**
 * SmartLocator (Motor de Resiliência e Auto-Cura em Camadas):
 * - Camada 0: Caminho de menu `A > B > C` percorrido na árvore de navegação real, com Auto-Cura de Rota (`menu-path.ts`).
 * - Camada 1: Geometria direta e determinística no DOM (`dom-geometry.ts`) -> 2ms, 0 tokens.
 * - Camada 2A: Árvore de Acessibilidade Compacta (`snapshot -i`) + Dicionário Canônico Orion TN & Sørensen–Dice -> 0 tokens.
 * - Camada 2B: Chamada única estruturada ao LLM sobre a Árvore de Acessibilidade compacta.
 * - Emite telemetria `SmartLocatorDivergence` sempre que curar uma divergência entre o manual e a tela real.
 * - Todas as camadas obedecem ao Filtro de Zona Semântica (ADR-015): passos de parametrização/formulário
 *   nunca resolvem para `aside`, `.sidebar`, `nav` ou abas, e múltiplos parâmetros viram um Group Bounding Box.
 */
export async function locateAndCaptureWithSelfHealing(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  options: SmartLocateOptions = {}
): Promise<SmartLocatorResult> {
  // =========================================================================
  // CAMADA 0: Navegação Encadeada por Segmentos com Auto-Cura de Rota (ADR-016)
  // Um caminho de menu `A > B > C` é percorrido na árvore de navegação real antes de qualquer busca textual.
  // =========================================================================
  const fullAccess =
    isFullAccessSession() || isFullAccessSession(await readSessionIdentity(client).catch(() => null));
  const viaMenuPath = await resolveAndNavigateMenuPath(client, step, rawScreenshotPath, options.priorMenuChains, {
    ignoreDisabledBlocks: fullAccess
  });
  if (viaMenuPath && (viaMenuPath.found || viaMenuPath.permissionBlocked)) return viaMenuPath;
  // ADR-024: caminho de menu inexistente na árvore real (ou cascata que não abriu). O passo ainda pode ser
  // medido por correspondência EXATA no DOM (Camada 1), mas nunca é "curado" por similaridade/sinônimo.
  const menuGuard: Pick<SmartLocatorResult, 'menuPathMissing' | 'menuPathOpenFailed'> = viaMenuPath
    ? { menuPathMissing: viaMenuPath.menuPathMissing, menuPathOpenFailed: viaMenuPath.menuPathOpenFailed }
    : {};
  const healingForbiddenByMenu = !!(menuGuard.menuPathMissing || menuGuard.menuPathOpenFailed);

  const candidates = step.targets.length > 0 ? step.targets : [step.rawText];

  // =========================================================================
  // FILTRO DE ZONA SEMÂNTICA (ADR-015): decide onde o alvo pode estar antes de tocar o DOM
  // =========================================================================
  const zonePolicy: StepZonePolicy = step.zone ?? inferStepZone(step.rawText, step.actionType);
  // Passo de formulário que cita vários parâmetros -> União Geométrica de Múltiplos Alvos
  //  (ADR-015). Em passo de navegação/clique, os negritos da linha principal deixam de ser
  //  alternativas: cada um é medido e demarcado na mesma print (multi-demarcação, ADR-017).
  const mainTargets = step.targets.slice(0, step.mainTargetCount ?? step.targets.length);
  const groupTargets =
    zonePolicy !== 'any'
      ? step.targets.length >= 2
        ? step.targets
        : undefined
      : mainTargets.length >= 2
        ? mainTargets
        : undefined;
  if (zonePolicy !== 'any') {
    console.log(
      `   [Zona Semântica] Política "${zonePolicy}": navegação lateral/abas fora da busca${groupTargets ? ` | união de ${groupTargets.length} alvos` : ''}`
    );
  }

  // =========================================================================
  // CAMADA 1: Resolução Direta via Geometria Determinística do DOM (0 tokens)
  // =========================================================================
  let directGeometry = await client.getDOMGeometry(candidates, {
    scrollIntoView: true,
    zone: zonePolicy,
    groupTargets
  });
  if (directGeometry && isGenericContainerMatch(directGeometry)) {
    console.log(
      `   [Evidência] "${directGeometry.matchedSelector}" casou com um contêiner genérico (${directGeometry.cssBox.width}x${directGeometry.cssBox.height}); não serve de demarcação.`
    );
    directGeometry = null;
  }
  if (directGeometry) {
    const forbidden = forbiddenMeasuredReason(step, directGeometry.context);
    if (forbidden) {
      console.log(`   [Guarda de Navegação] Medição direta descartada (${directGeometry.matchedSelector}): ${forbidden}.`);
      directGeometry = null;
    }
  }
  if (directGeometry) {
    let geometry = directGeometry;
    let targetDivergences: SmartLocatorDivergence[] = [];
    let validatedText: string | undefined;

    if (groupTargets && geometry.groupMembers && geometry.unresolvedGroupTargets?.length) {
      console.log(
        `   [Group Bounding Box] ${geometry.groupMembers.length} alvo(s) unidos; não localizados no conteúdo: ${geometry.unresolvedGroupTargets.join(', ')}`
      );
      const reconciled = await reconcileUnresolvedGroupTargets(client, step, geometry, {
        candidates,
        groupTargets,
        zonePolicy,
        allowHealing: options.allowHealing !== false
      });
      geometry = reconciled.geometry;
      targetDivergences = reconciled.divergences;
      validatedText = reconciled.validatedText;
    }

    geometry.callouts = buildCalloutsFromGroup(geometry);
    await client.screenshot(rawScreenshotPath);
    const fallbackName = step.targets[0] || geometry.context.innerText || 'Elemento Validado';
    return {
      found: true,
      healed: targetDivergences.length > 0,
      geometry,
      matchedTargetName: describeGroupLabel(geometry, fallbackName),
      targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined,
      validatedText
    };
  }

  // RBAC (ADR-017): o alvo pode existir e estar bloqueado/oculto pela aplicação para o perfil logado
  const blockedHit = await probePermissionBlockedTargets(client, candidates);
  if (blockedHit) {
    console.warn(`   ⛔ [RBAC] "${blockedHit.target}" existe na tela, mas está bloqueado para o perfil logado: ${blockedHit.detail}`);
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: blockedHit.target,
      permissionBlocked: { target: blockedHit.target, detail: blockedHit.detail, domEvidence: blockedHit.domEvidence }
    };
  }

  // =========================================================================
  // CAMADA 1.5 (ADR-020): ações icônicas de grade (olho/lápis/X). O nome real vive no `title`, que
  // difere do manual (Visualizar→Consultar, Editar→Alterar, Remover→Excluir). Não clica nem cura por similaridade.
  // =========================================================================
  const gridOutcome = await resolveGridActions(client, step.stepNumber, candidates, {
    allowActionTarget: step.mainTargetCount !== 0
  });
  let gridScanStatus: SmartLocatorResult['gridActions'];
  if (gridOutcome) {
    if (gridOutcome.status === 'resolved') {
      const g = gridOutcome.resolution;
      console.log(
        `   [Ações de Grade] 1ª linha "${g.firstRowText}": ${g.matches.map(m => `${m.target}→${m.realLabel} (${m.via})`).join(' · ')}`
      );
      await client.screenshot(rawScreenshotPath);
      const now = new Date().toISOString();
      const missingDivs: SmartLocatorDivergence[] = g.unmatched.map(t => ({
        stepNumber: step.stepNumber,
        documentedTarget: t,
        actualElementText: '',
        resolutionLayer: 'target_not_found',
        confidence: 0,
        reason: `nenhum botão de ação da primeira linha da grade corresponde a "${t}" (ações reais: ${g.rowActions.map(a => a.label || '(sem nome)').join(', ')})`,
        detectedAt: now
      }));
      const allDivs = [...g.divergences, ...missingDivs];
      return {
        found: true,
        healed: g.divergences.length > 0,
        geometry: g.geometry,
        matchedTargetName: describeGroupLabel(g.geometry, g.matches[0].realLabel),
        targetDivergences: allDivs.length > 0 ? allDivs : undefined,
        gridActions: {
          status: 'resolved',
          firstRowText: g.firstRowText,
          rowActions: g.rowActions,
          matches: g.matches.map(m => ({ target: m.target, realLabel: m.realLabel, via: m.via, source: m.source }))
        }
      };
    }
    gridScanStatus = { status: gridOutcome.status };
    console.log(
      `   [Ações de Grade] ${gridOutcome.status === 'empty-grid' ? 'a grade não tem registros' : 'a 1ª linha não expõe botões de ação identificáveis'}; nada a demarcar para [${candidates.join(', ')}].`
    );
  }

  if (options.allowHealing === false || healingForbiddenByMenu) {
    if (healingForbiddenByMenu) {
      console.log('   [Guarda de Navegação] Caminho de menu sem correspondência na árvore real: a Auto-Cura por similaridade/sinônimo está proibida para este passo.');
    }
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: step.targets[0] || 'Elemento não localizado',
      gridActions: gridScanStatus,
      ...menuGuard
    };
  }

  // =========================================================================
  // CAMADA 0.1 (ADR-027): Diretriz Soberana da Revisão Humana (`routine_reviews`)
  // Comprova ao vivo no DOM os alvos reais apontados pelo revisor antes das heurísticas.
  // =========================================================================
  const humanSuggestions = getHumanTargetSuggestionsForStep(step);
  for (const sug of humanSuggestions) {
    const sugZone = sug.preferredZone ?? zonePolicy;
    const geometry = await client.getDOMGeometry([sug.actual], { scrollIntoView: true, zone: sugZone });
    const forbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
    if (geometry && !isGenericContainerMatch(geometry) && !forbidden) {
      console.log(`   ★ [RAG Revisão Humana] Alvo orientado por revisão humana comprovado ao vivo: "${sug.documented}" -> "${sug.actual}"`);
      await client.screenshot(rawScreenshotPath);
      const divergence: SmartLocatorDivergence = {
        stepNumber: step.stepNumber,
        documentedTarget: sug.documented,
        actualElementText: sug.actual,
        resolutionLayer: 'dom_synonym_heuristic',
        confidence: 0.98,
        reason: sug.reason,
        detectedAt: new Date().toISOString(),
        evidence: {
          source: 'dom-measured',
          matchedSelector: geometry.matchedSelector,
          elementText: geometry.context.innerText || sug.actual,
          box: geometry.cssBox
        },
        textChange: { from: `**${sug.documented}**`, to: `**${sug.actual}**` }
      };
      return {
        found: true,
        healed: true,
        geometry,
        matchedTargetName: sug.actual,
        divergence
      };
    }
  }

  // =========================================================================
  // CAMADA 0.2 (ADR-029): sinônimo contextual por rota (`location.hash`), descoberto pelo Raio-X das telas `[ATT]`.
  // Só passo de alvo único; o rótulo real é MEDIDO ao vivo na zona do passo e passa pelas mesmas guardas. O texto do
  // manual não é reescrito: a troca só vale com o nó real medido (Evidência Estrita) e a divergência vai ao relatório.
  // =========================================================================
  if (step.targets.length === 1 && !groupTargets) {
    const routeHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
    for (const syn of routeSynonymsFor(routeHash, step.targets[0]).filter(s => s.real.length === 1)) {
      const actual = syn.real[0];
      const geometry = await client.getDOMGeometry([actual], { scrollIntoView: true, zone: zonePolicy });
      const forbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
      if (!geometry || isGenericContainerMatch(geometry) || forbidden) continue;
      console.log(`   ◈ [Sinônimo de Rota] ${syn.route}: "${step.targets[0]}" -> "${actual}" medido ao vivo (${syn.evidence}).`);
      await client.screenshot(rawScreenshotPath);
      const divergence: SmartLocatorDivergence = {
        stepNumber: step.stepNumber,
        documentedTarget: step.targets[0],
        actualElementText: actual,
        resolutionLayer: 'dom_synonym_heuristic',
        confidence: 0.9,
        reason: `Sinônimo contextual da rota ${syn.route}: ${syn.evidence}`,
        detectedAt: new Date().toISOString(),
        evidence: { source: 'dom-measured', matchedSelector: geometry.matchedSelector, elementText: geometry.context.innerText || actual, box: geometry.cssBox },
        textChange: { from: `**${step.targets[0]}**`, to: `**${actual}**` }
      };
      return { found: true, healed: true, geometry, matchedTargetName: actual, divergence };
    }
  }

  // =========================================================================
  // CAMADA 0.5 (ADR-025): cura já comprovada numa auditoria anterior. Roda só depois de a medição direta do
  // alvo documentado falhar e só em passo de alvo único; a dica é medida ao vivo e passa pelas mesmas guardas
  // (contêiner genérico, navegação estrita, zona semântica). Sem acerto, segue para a Camada 2 sem penalidade.
  // =========================================================================
  if (options.priorHints && options.priorHints.length > 0 && step.targets.length === 1 && !groupTargets) {
    const documentedTarget = step.targets[0];
    const hint = options.priorHints.find(h => normalizeText(h.documented) === normalizeText(documentedTarget));
    if (hint) {
      const geometry = await client.getDOMGeometry([hint.actual], { scrollIntoView: true, zone: zonePolicy });
      const forbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
      if (geometry && !isGenericContainerMatch(geometry) && !forbidden) {
        console.log(
          `   ↺ [Reauditoria] Cura anterior reconfirmada ao vivo: "${documentedTarget}" -> "${hint.actual}" (${hint.layer}, conf anterior ${Math.round(hint.confidence * 100)}%)`
        );
        await client.screenshot(rawScreenshotPath);
        const divergence: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget,
          actualElementText: hint.actual,
          resolutionLayer: hint.layer,
          confidence: hint.confidence,
          reason: `Cura comprovada numa auditoria anterior (${hint.layer}) e reconfirmada ao vivo: o elemento "${hint.actual}" foi medido na tela desta execução`,
          detectedAt: new Date().toISOString(),
          evidence: {
            source: 'dom-measured',
            matchedSelector: geometry.matchedSelector,
            elementText: geometry.context.innerText || hint.actual,
            box: geometry.cssBox
          },
          textChange: { from: `**${documentedTarget}**`, to: `**${hint.actual}**` }
        };
        return {
          found: true,
          healed: true,
          geometry,
          matchedTargetName: hint.actual,
          divergence,
          priorHint: { documented: documentedTarget, actual: hint.actual, layer: hint.layer }
        };
      }
      console.log(`   [Reauditoria] A cura anterior "${hint.actual}" não foi reconfirmada nesta tela; seguindo para a Auto-Cura.`);
    }
  }

  // =========================================================================
  // CAMADA 2: Auto-Cura via Árvore de Acessibilidade Compacta (`snapshot -i`)
  // =========================================================================
  console.log(
    `   [SmartLocator] Alvo exato [${candidates.join(', ')}] ausente no DOM. Iniciando Auto-Cura na Árvore de Acessibilidade...`
  );

  let snapshotText = '';
  try {
    snapshotText = await client.snapshotInteractive();
  } catch {
    snapshotText = '';
  }

  const a11yNodes = [...parseAccessibilitySnapshot(snapshotText), ...(await collectVisibleLabelNodes(client))];

  // Sub-camada 2A: Equivalência Semântica / Sinônimos Orion TN + Fuzzy Matching.
  // A árvore de acessibilidade não carrega zona; por isso cada candidato é validado contra o DOM
  // com a política do passo. Em zona de conteúdo, um item de menu lateral homônimo é descartado
  // e o próximo candidato do ranking é testado.
  const ranked = rankSemanticCandidatesInA11y(candidates, a11yNodes, step);
  const attempts = ranked.slice(0, zonePolicy === 'any' ? 1 : MAX_ZONE_HEAL_ATTEMPTS);

  let healedCandidate: A11ySemanticCandidate | null = null;
  let healedGeometry: DOMResolvedGeometry | null = null;
  let resolutionLayer: SmartLocatorDivergence['resolutionLayer'] = 'dom_synonym_heuristic';

  for (const candidate of attempts) {
    const geometry = await resolveHealedGeometry(client, candidate.node, zonePolicy);
    // ADR-024: o que foi MEDIDO também passa pela guarda (o nó medido pode ser um <input> com o mesmo texto)
    const measuredForbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
    if (measuredForbidden) {
      console.log(`   [Guarda de Navegação] Candidato "${candidate.node.name}" descartado após a medição: ${measuredForbidden}.`);
      continue;
    }
    if (geometry && !isGenericContainerMatch(geometry)) {
      healedCandidate = candidate;
      healedGeometry = geometry;
      resolutionLayer = candidate.reason.includes('Sinônimo') ? 'dom_synonym_heuristic' : 'a11y_fuzzy_match';
      break;
    }
    if (zonePolicy !== 'any') {
      console.log(
        `   [Zona Semântica] Candidato "${candidate.node.name}" (${candidate.node.ref}) descartado: fora do contêiner de conteúdo.`
      );
    }
  }

  const visualMode: VisualAuditMode = options.visualMode ?? 'live';

  // Sub-camada 2B: Fallback LLM Estruturado de Chamada Única no `agy` (somente em modo `live` quando 2A falhar)
  if (!healedCandidate && visualMode === 'live' && ranked.length === 0 && a11yNodes.length > 0) {
    const llmCandidate = await resolveViaLLMOnAccessibilityTree(step, a11yNodes);
    if (llmCandidate) {
      const geometry = await resolveHealedGeometry(client, llmCandidate.node, zonePolicy);
      if (geometry && !isGenericContainerMatch(geometry) && !forbiddenMeasuredReason(step, geometry.context)) {
        healedCandidate = llmCandidate;
        healedGeometry = geometry;
        resolutionLayer = 'llm_a11y_fallback';
      }
    }
  }

  if (healedCandidate && healedGeometry) {
    const { node, documentedTarget, confidence, reason } = healedCandidate;
    console.log(
      `   ⚡ [SmartLocator Auto-Cura] Divergência curada: "${documentedTarget}" -> "${node.name}" (${node.ref}, conf: ${Math.round(confidence * 100)}%)`
    );

    await client.screenshot(rawScreenshotPath);

    const divergence: SmartLocatorDivergence = {
      stepNumber: step.stepNumber,
      documentedTarget,
      actualElementText: node.name,
      actualRole: node.role,
      matchedRef: node.ref,
      resolutionLayer,
      confidence,
      reason,
      detectedAt: new Date().toISOString(),
      // Evidência (ADR-017): o nó curado foi medido ao vivo e é o que a print demarca
      evidence: {
        source: 'dom-measured',
        matchedSelector: healedGeometry.matchedSelector,
        elementText: healedGeometry.context.innerText || node.name,
        box: healedGeometry.cssBox
      },
      textChange: { from: `**${documentedTarget}**`, to: `**${node.name}**` }
    };

    return {
      found: true,
      healed: true,
      geometry: healedGeometry,
      matchedTargetName: node.name,
      matchedRef: node.ref,
      divergence
    };
  }

  // =========================================================================
  // CAMADA 2C (ADR-031): Set-of-Mark (SoM) em Memória + Visual Grounding DOM
  // =========================================================================
  await client.screenshot(rawScreenshotPath);
  let screenshotBuffer: Buffer | null = null;
  try {
    screenshotBuffer = await fs.promises.readFile(rawScreenshotPath);
  } catch {
    screenshotBuffer = null;
  }

  if (screenshotBuffer && screenshotBuffer.length > 0) {
    const somCandidates = await collectInteractiveSomCandidates(client, step, zonePolicy, MAX_SOM_CANDIDATES);

    if (visualMode === 'defer') {
      const routeHash =
        (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
      if (somCandidates.length > 0) {
        await enqueuePendingSomForCuration({
          routineId: step.routineId || 'UNKNOWN',
          step,
          zonePolicy,
          routeHash,
          screenshotBuffer,
          candidates: somCandidates
        }).catch(() => undefined);
      }
    } else {
      // Modo `live`: 1º tenta 2C-SoM (preferencial), 2º tenta 2C-Grounding (fallback para Canvas/OOPIF)
      const somResolved =
        somCandidates.length > 0
          ? await resolveViaSetOfMark2C(client, step, screenshotBuffer, somCandidates, {
              zonePolicy,
              workerId: options.workerSessionId || 'single'
            })
          : null;

      if (somResolved) {
        const { candidate, geometry, documentedTarget, confidence, reason } = somResolved;
        const actualText = (geometry.context.innerText || candidate.innerText || candidate.name || documentedTarget).trim();
        const hasRealDomText = Boolean((geometry.context.innerText || candidate.innerText || '').trim());
        console.log(
          `   👁 [Camada 2C-SoM] Alvo resolvido via Set-of-Mark [Tag ${candidate.id}]: "${documentedTarget}" -> "${actualText}" (conf: ${Math.round(confidence * 100)}%)`
        );
        await client.screenshot(rawScreenshotPath);
        const divergence: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget,
          actualElementText: actualText,
          actualRole: candidate.role,
          matchedRef: `som:${candidate.id}`,
          resolutionLayer: 'visual_som_fallback',
          confidence,
          reason,
          detectedAt: new Date().toISOString(),
          evidence: {
            source: 'dom-measured',
            matchedSelector: geometry.matchedSelector,
            elementText: geometry.context.innerText || actualText,
            box: geometry.cssBox
          },
          textChange:
            hasRealDomText && normalizeText(actualText) !== normalizeText(documentedTarget)
              ? { from: `**${documentedTarget}**`, to: `**${actualText}**` }
              : undefined
        };
        return {
          found: true,
          healed: true,
          geometry,
          matchedTargetName: actualText,
          matchedRef: `som:${candidate.id}`,
          divergence
        };
      }

      const groundingResolved = await resolveViaVisualGrounding2C(client, step, screenshotBuffer, {
        zonePolicy,
        workerId: options.workerSessionId || 'single'
      });

      if (groundingResolved) {
        const { candidate, geometry, pointPx, documentedTarget, confidence, reason } = groundingResolved;
        const actualText = (geometry.context.innerText || candidate.innerText || candidate.name || documentedTarget).trim();
        const hasRealDomText = Boolean((geometry.context.innerText || candidate.innerText || '').trim());
        console.log(
          `   🎯 [Camada 2C-Grounding] Alvo ancorado em (${pointPx.x}, ${pointPx.y}): "${documentedTarget}" -> "${actualText}" (conf: ${Math.round(confidence * 100)}%)`
        );
        await client.screenshot(rawScreenshotPath);
        const divergence: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget,
          actualElementText: actualText,
          actualRole: candidate.role,
          matchedRef: `grounding:${pointPx.x},${pointPx.y}`,
          resolutionLayer: 'visual_grounding_fallback',
          confidence,
          reason,
          detectedAt: new Date().toISOString(),
          evidence: {
            source: 'dom-measured',
            matchedSelector: geometry.matchedSelector,
            elementText: geometry.context.innerText || actualText,
            box: geometry.cssBox
          },
          textChange:
            hasRealDomText && normalizeText(actualText) !== normalizeText(documentedTarget)
              ? { from: `**${documentedTarget}**`, to: `**${actualText}**` }
              : undefined
        };
        return {
          found: true,
          healed: true,
          geometry,
          matchedTargetName: actualText,
          matchedRef: `grounding:${pointPx.x},${pointPx.y}`,
          divergence
        };
      }
    }
  }

  return {
    found: false,
    healed: false,
    geometry: null,
    matchedTargetName: step.targets[0] || 'Elemento não localizado'
  };
}
