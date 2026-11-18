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
  /** Placeholder/title/aria-label (o `innerText` de um `<input>` é vazio) — ADR-035 */
  placeholder?: string;
  /** `id` do elemento (a busca global é reconhecida também por ele) — ADR-035 */
  id?: string;
  /** Já classificado como busca global/campo da barra superior pelo script do DOM — ADR-035 */
  isGlobalSearch?: boolean;
  /** Papel semântico carimbado no DOM (`table_column_header`, `page_heading`...) — ADR-035 */
  semanticRole?: string;
}

// ---------------------------------------------------------------------------
// ADR-035 — Cabeçalho de coluna de grade nunca é campo de entrada
// ---------------------------------------------------------------------------

/** Verbos/pistas de passo que exigem um controle interativo (digitar, filtrar, selecionar, preencher...). */
const FIELD_INTENT_RE =
  /\b(defin[ae]|definir|preench[ae]|preencher|configur[ae]|configurar|inform[ae]|informar|digit[ae]|digitar|ajust[ae]|ajustar|parametriz[ae]|parametrizar|marqu[ae]|marcar|desmarqu[ae]|desmarcar|insir[ae]|inserir|vincul[ae]|vincular|associ[ae]|associar|selecion[ae]|selecionar|escolh[ae]|escolher|filtr[ae]|filtrar|pesquis[ae]|pesquisar|busque|buscar|utilize|utilizar|campos?)\b/;

/** Pistas de que o passo trata da COLUNA/ordenação da grade (aí o `th` é um alvo legítimo). */
const COLUMN_CUE_RE = /\b(colunas?|cabecalhos?|ordenar|ordene|ordena|ordenacao|classificar|classifique|ordem)\b/;

/**
 * O passo pede um controle interativo real (`input`, `select`, `textarea`, `orion-select`...): digitação,
 * filtro, seleção ou preenchimento. Cabeçalhos de coluna (`th`) e títulos estáticos nunca satisfazem esse
 * pedido (M-36.0/M-43.0/M-66.0/R-3.0: o `th` "Descrição"/"Status" era demarcado no lugar do campo).
 * Passo que cita coluna/ordenação não conta: ali o `th` é o alvo.
 */
export function stepExpectsInteractiveControl(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] }
): boolean {
  const raw = normalize([step.rawText, ...step.targets].join(' '));
  if (COLUMN_CUE_RE.test(raw)) return false;
  if (step.actionType === 'fill' || step.actionType === 'search' || step.actionType === 'select' || step.actionType === 'check') {
    return true;
  }
  return FIELD_INTENT_RE.test(raw);
}

/** O nó é um cabeçalho de coluna de grade (`th`, `[role="columnheader"]` ou papel carimbado no DOM). */
export function isColumnHeaderNode(node: Pick<GuardNode, 'role' | 'tagName' | 'semanticRole'>): boolean {
  const role = String(node.role ?? '').toLowerCase();
  const tag = String(node.tagName ?? '').toLowerCase();
  return role === 'columnheader' || tag === 'th' || node.semanticRole === 'table_column_header';
}

// ---------------------------------------------------------------------------
// ADR-035 — Busca global (CTRL + B) em TODAS as camadas
// ---------------------------------------------------------------------------

/** `id`/`name` típicos do campo de busca de telas da barra superior do Orion TN. */
const GLOBAL_SEARCH_ID_RE = /search.?menu|input.?search|busca.?menu|pesquisa.?menu|menu.?search/i;

/**
 * O nó é a busca global de telas (`CTRL + B`) ou um campo de texto da barra superior. Reconhecido pelo
 * texto/placeholder, pelo `id` ou pela marca já calculada no DOM. Um `<input>` medido tem `innerText`
 * vazio: sem o placeholder a busca global passava despercebida nas camadas 1/2A/2B/2C.
 */
export function isGlobalSearchNode(node: GuardNode): boolean {
  if (node.isGlobalSearch) return true;
  if (isGlobalSearchName(node.name) || isGlobalSearchName(node.placeholder)) return true;
  return GLOBAL_SEARCH_ID_RE.test(String(node.id ?? ''));
}

/**
 * Contexto de guarda do passo, derivado ANTES de tocar o DOM e propagado ao script de medição
 * (`getDOMGeometry`): o mesmo critério vale para as Camadas 1, 2A, 2B, 2C-SoM e 2C-Grounding.
 */
export interface StepGuardContext {
  /** O passo pede um controle interativo: o script exclui `th`/`columnheader` e rebaixa títulos `h1`-`h4`. */
  fieldIntent: boolean;
  /** O passo cita a própria busca global (`CTRL + B`): só então ela pode ser alvo. */
  allowGlobalSearch: boolean;
  /**
   * Valor de lista suspensa (`option:`) pode virar o `<select>` dono? Falso quando o passo é clique puro
   * (R-10.0: "clique em **Sim**" numa confirmação nunca é um `<select>` com a opção "Sim").
   */
  allowOptionTier: boolean;
}

const CLICK_VERB_RE = /\b(clique|clicar|pressione|pressionar|acione|acionar)\b/;
const CHOICE_CUE_RE = /\b(selecion[ae]|selecionar|escolh[ae]|escolher|filtr[ae]|filtrar|opcao|opcoes|lista|combo|campos?|modalidade|tipo)\b/;

export function deriveStepGuard(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] }
): StepGuardContext {
  const raw = normalize([step.rawText, ...step.targets].join(' '));
  const clickOnly = CLICK_VERB_RE.test(raw) && !CHOICE_CUE_RE.test(raw) && step.actionType !== 'select' && step.actionType !== 'fill';
  return {
    fieldIntent: stepExpectsInteractiveControl(step),
    allowGlobalSearch: stepNamesGlobalSearch(step),
    allowOptionTier: !clickOnly
  };
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
export function forbiddenCandidateReason(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] },
  node: GuardNode
): string | null {
  const role = String(node.role ?? '').toLowerCase();
  const tag = String(node.tagName ?? '').toLowerCase();
  const inputLike = INPUT_LIKE_ROLES.has(role) || INPUT_LIKE_TAGS.has(tag);

  if (inputLike && isStrictNavigationStep(step)) {
    return `campo de texto (${tag || role}) não é item de menu: o passo é de navegação`;
  }
  // ADR-035: a busca global é reconhecida pelo texto, placeholder, id ou marca do DOM; e QUALQUER campo de texto
  // da barra superior é a busca global (nunca um campo da tela), salvo quando o próprio passo a cita.
  // campo de TEXTO (um `combobox`/`select` de paginação dentro de um <nav> não é a busca global)
  const textEntry = inputLike && role !== 'combobox';
  if ((isGlobalSearchNode(node) || (textEntry && node.inNavbar)) && !stepNamesGlobalSearch(step)) {
    return 'barra de pesquisa global (CTRL + B) não é alvo deste passo';
  }
  // ADR-035: cabeçalho de coluna da grade (`th`) não é campo de digitação/filtro/formulário
  if (isColumnHeaderNode(node) && stepExpectsInteractiveControl(step)) {
    return 'cabeçalho de coluna da grade (th) não é campo de entrada: o passo pede digitação/filtro/formulário';
  }
  if (NOVO_CARTAO_RE.test(normalize(node.name ?? '')) && !stepMentionsCartao(step)) {
    return 'botão "Novo cartão +" destina-se exclusivamente ao cadastro de novo cartão e não corresponde ao serviço/ação deste passo';
  }
  const navbarReason = isNavbarOnlyTargetForbidden(step, node);
  if (navbarReason) return navbarReason;
  return null;
}

/** Variante para a geometria já medida no DOM (`context.tagName`/`role`/`innerText`/`isTopNav`). */
export function forbiddenMeasuredReason(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] },
  ctx: DOMElementContext | undefined
): string | null {
  if (!ctx) return null;
  const single = forbiddenCandidateReason(step, {
    name: ctx.innerText,
    role: ctx.role,
    tagName: ctx.tagName,
    inNavbar: ctx.isTopNav,
    placeholder: ctx.placeholder,
    id: ctx.elementId,
    isGlobalSearch: ctx.isGlobalSearch,
    semanticRole: ctx.semantic?.semanticRole
  });
  if (single) return single;
  // União de grupo (`tagName: 'group'`): o contexto descreve o 1º membro; os demais vêm em `memberTags`
  if (ctx.memberTags?.some(t => String(t).toLowerCase() === 'th') && stepExpectsInteractiveControl(step)) {
    return 'cabeçalho de coluna da grade (th) entre os membros do grupo: o passo pede digitação/filtro/formulário';
  }
  return null;
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
