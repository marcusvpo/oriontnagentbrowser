import type { DOMElementContext, RoutineStep } from './types.js';

/**
 * Guarda Estrita Contra Falsa Cura de Menu no Campo de Busca (ADR-024).
 *
 * Incidente (D-3.14): o passo "Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**" não achou o
 * caminho na árvore de menus e o SmartLocator o "curou" para a caixa de pesquisa global da barra superior
 * ("Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"), com 96% de confiança. Causa: o
 * dicionário de sinônimos de "Novo" inclui o símbolo `+`, que casava por SUBSTRING com o "CTRL + B" do
 * placeholder. Um campo de texto nunca é um item de menu.
 *
 * Regras (todas aplicadas antes de aceitar um candidato e depois de medi-lo no DOM):
 *  1. Passo de navegação ESTRITA (caminho de menu `A > B`, "Acesse o menu/submenu...") nunca casa com
 *     `<input>`, `<textarea>`, `[role="textbox"]`, `[role="searchbox"]` (nem combobox/spinbutton).
 *  2. Nenhum passo casa com a barra de pesquisa global (`CTRL + B`) a menos que o próprio passo a cite.
 *  3. Sinônimos de símbolo (`+`) só valem por igualdade exata do nome do nó, nunca por substring.
 */

const normalize = (text: string): string =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[^\w\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Roles de campo de entrada: nunca são item de menu nem alvo de um passo de navegação. */
export const INPUT_LIKE_ROLES = new Set(['textbox', 'searchbox', 'combobox', 'spinbutton', 'textarea', 'input']);

/** Tags de campo de entrada. */
export const INPUT_LIKE_TAGS = new Set(['input', 'textarea']);

/** Nome/placeholder da barra de pesquisa global do Orion TN (texto normalizado). */
const GLOBAL_SEARCH_RE = /ctrl\s*\+\s*b\b|pesquise aqui|nome da tela que deseja/;

/** O passo cita a própria barra de pesquisa global (aí ela é um alvo legítimo). */
const NAMES_GLOBAL_SEARCH_RE = /barra de (pesquisa|busca)|pesquisa global|busca global|ctrl\s*\+\s*b\b|campo de pesquisa/;

/** "Acesse o menu ...", "Abra o submenu ...", "Pelo menu ...", "Na barra de menus ...". */
const MENU_ACCESS_RE = /\b(acesse|acessar|abra|abrir|va|vá|entre|navegue|clique)\b.{0,30}\b(menu|submenu|menus)\b|\b(pelo|no|do|via) (menu|submenu)\b|barra de menus?/;

/** Texto cru do passo traz um caminho `**A > B**` ou `**A** > **B**`. */
const MENU_PATH_TEXT_RE = /\*\*[^*]*>[^*]*\*\*|\*\*[^*]+\*\*\s*>\s*\*\*/;

/**
 * Passo de navegação estrita (ADR-024): caminho de menu `A > B` ou "Acesse o menu...". Para esses passos o
 * alvo é um item da árvore de navegação, e campos de texto são proibidos.
 */
export function isStrictNavigationStep(step: Pick<RoutineStep, 'rawText' | 'targets'>): boolean {
  if (step.targets.some(t => t.includes('>'))) return true;
  if (MENU_PATH_TEXT_RE.test(step.rawText)) return true;
  return MENU_ACCESS_RE.test(normalize(step.rawText));
}

/** Botão exclusivo de criação de novo cartão — proibido quando o passo não trata de cartão. */
const NOVO_CARTAO_RE = /\bnovo cartao\b/;

/** Verbos inequívocos de formulário/parametrização (em modo imperativo ou infinitivo). */
const FORM_VERB_RE =
  /\b(defin[ae]|definir|preench[ae]|preencher|configur[ae]|configurar|inform[ae]|informar|digit[ae]|digitar|ajust[ae]|ajustar|parametriz[ae]|parametrizar|marqu[ae]|marcar|desmarqu[ae]|desmarcar|insir[ae]|inserir|vincul[ae]|vincular|associ[ae]|associar)\b/;

/** O texto do passo cita a barra de pesquisa global (única hipótese em que ela pode ser alvo). */
export function stepNamesGlobalSearch(step: Pick<RoutineStep, 'rawText' | 'targets'>): boolean {
  return NAMES_GLOBAL_SEARCH_RE.test(normalize([step.rawText, ...step.targets].join(' ')));
}

/** O passo cita cartão de assinatura/ficha (única hipótese em que "Novo cartão +" é alvo legítimo). */
export function stepMentionsCartao(step: Pick<RoutineStep, 'rawText' | 'targets'>): boolean {
  return /\bcartao\b/.test(normalize([step.rawText, ...step.targets].join(' ')));
}

/** O nome/placeholder do nó é o da barra de pesquisa global do Orion TN. */
export function isGlobalSearchName(name: string | undefined | null): boolean {
  return GLOBAL_SEARCH_RE.test(normalize(name ?? ''));
}

export interface GuardNode {
  name?: string;
  role?: string;
  tagName?: string;
  /** Verdadeiro quando o elemento medido está na barra superior (`header` / `.navbar`). */
  inNavbar?: boolean;
}

/**
 * Em passos de formulário/parametrização (ou com alvo composto como "Grupo Firmas"), impede que
 * o alvo colapse para um item simples da barra superior (`navbar`, ex.: "Firmas").
 */
export function isNavbarOnlyTargetForbidden(
  step: Pick<RoutineStep, 'rawText' | 'targets'>,
  node: GuardNode
): string | null {
  if (!node.inNavbar) return null;
  if (isStrictNavigationStep(step)) return null;
  const raw = normalize(step.rawText);
  if (/\b(menu|submenu|menus|navbar|barra superior|barra de navegacao)\b/.test(raw)) return null;
  const normName = normalize(node.name ?? '');
  if (!normName) return null;

  const hasCompoundTarget = step.targets.some(t => {
    const nt = normalize(t);
    return nt.split(' ').filter(Boolean).length >= 2 && nt !== normName;
  });
  if (FORM_VERB_RE.test(raw) || hasCompoundTarget) {
    return `item da barra superior (${node.name || 'navbar'}) não é alvo de formulário/parametrização`;
  }
  return null;
}

/**
 * Motivo pelo qual um candidato é proibido para o passo, ou `null` se pode ser avaliado.
 * Usado sobre os nós da Árvore de Acessibilidade (antes de medir) e sobre o contexto medido no DOM.
 */
export function forbiddenCandidateReason(step: Pick<RoutineStep, 'rawText' | 'targets'>, node: GuardNode): string | null {
  const role = String(node.role ?? '').toLowerCase();
  const tag = String(node.tagName ?? '').toLowerCase();
  const inputLike = INPUT_LIKE_ROLES.has(role) || INPUT_LIKE_TAGS.has(tag);

  if (inputLike && isStrictNavigationStep(step)) {
    return `campo de texto (${tag || role}) não é item de menu: o passo é de navegação`;
  }
  if (isGlobalSearchName(node.name) && !stepNamesGlobalSearch(step)) {
    return 'barra de pesquisa global (CTRL + B) não é alvo deste passo';
  }
  if (NOVO_CARTAO_RE.test(normalize(node.name ?? '')) && !stepMentionsCartao(step)) {
    return 'botão "Novo cartão +" destina-se exclusivamente ao cadastro de novo cartão e não corresponde ao serviço/ação deste passo';
  }
  const navbarReason = isNavbarOnlyTargetForbidden(step, node);
  if (navbarReason) return navbarReason;
  return null;
}

/** Variante para a geometria já medida no DOM (`context.tagName`/`role`/`innerText`/`isTopNav`). */
export function forbiddenMeasuredReason(step: Pick<RoutineStep, 'rawText' | 'targets'>, ctx: DOMElementContext | undefined): string | null {
  if (!ctx) return null;
  return forbiddenCandidateReason(step, {
    name: ctx.innerText,
    role: ctx.role,
    tagName: ctx.tagName,
    inNavbar: ctx.isTopNav
  });
}

/**
 * Sinônimo de símbolo (`+`, `-`...): só casa por igualdade exata com o nome normalizado do nó. Sinônimos
 * de palavra seguem a inclusão por palavra inteira. Nunca por substring: `'ctrl + b'.includes('+')` é a
 * causa do incidente D-3.14.
 */
export function synonymMatchesNode(synonym: string, normalizedNodeName: string): boolean {
  const s = normalize(synonym);
  if (!s || !normalizedNodeName) return false;
  if (!/[a-z0-9]/.test(s)) return normalizedNodeName === s;
  if (normalizedNodeName === s) return true;
  return ` ${normalizedNodeName} `.includes(` ${s} `);
}
