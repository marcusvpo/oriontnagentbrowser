import {
  isColumnHeaderNode,
  isGlobalSearchNode,
  stepExpectsInteractiveControl,
  stepNamesGlobalSearch
} from './navigation-guard.js';
import type { DOMSemanticSignature, RoutineStep, SemanticRole, StepIntent } from './types.js';

export interface CompatibilityNodeInput {
  name?: string;
  role?: string;
  tagName?: string;
  inNavbar?: boolean;
  sectionTitle?: string;
  rowContext?: DOMSemanticSignature['rowContext'];
  associatedLabel?: string;
  semanticRole?: SemanticRole;
  /** Placeholder/title/aria-label do nó (ADR-035) */
  placeholder?: string;
  /** `id` do nó (reconhece o campo de busca global da barra superior — ADR-035) */
  id?: string;
  /** Marca já calculada no DOM: busca global `CTRL + B` / campo de texto da barra superior (ADR-035) */
  isGlobalSearch?: boolean;
}

export interface SemanticCompatibilityResult {
  compatible: boolean;
  /** 0.0 quando incompatível; 1.0 padrão; > 1.0 (ex.: 1.15) quando a seção coincide com o passo */
  weight: number;
  reason?: string;
  stepIntent: StepIntent;
  nodeRole: SemanticRole;
}

function normSem(text: string | undefined | null): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[^\w\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function alphaTokens(norm: string): string[] {
  return norm
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2);
}

const STOPWORDS = new Set(['para', 'com', 'sem', 'dos', 'das', 'que', 'por', 'uma', 'uns', 'umas', 'como', 'mais', 'nao', 'sim']);

/**
 * Impede casamentos espúrios por substring intra-palavra (ex.: "autenticidade" contendo "cidade").
 * Permite flexões normais no final da palavra com diferença <= 2 caracteres (ex.: "aliquota" vs "aliquotas").
 */
export function hasIntraWordSubstringCollision(docTarget: string, candidateName: string): boolean {
  const docNorm = normSem(docTarget);
  const candNorm = normSem(candidateName);
  if (!docNorm || !candNorm) return false;
  if (docNorm === candNorm) return false;

  const docToks = alphaTokens(docNorm).filter(t => t.length >= 4 && !STOPWORDS.has(t));
  const candToks = alphaTokens(candNorm).filter(t => t.length >= 4 && !STOPWORDS.has(t));
  if (docToks.length === 0 || candToks.length === 0) return false;

  // Se já existe pelo menos um token inteiro coincidente, não é mera colisão intra-palavra
  if (docToks.some(d => candToks.includes(d))) return false;

  let hitIntraWord = false;
  for (const d of docToks) {
    for (const c of candToks) {
      if (d === c) continue;
      const shorter = d.length <= c.length ? d : c;
      const longer = d.length <= c.length ? c : d;
      if (!longer.includes(shorter)) continue;

      const isMinorInflection = longer.startsWith(shorter) && longer.length - shorter.length <= 2;
      if (!isMinorInflection) {
        hitIntraWord = true;
      }
    }
  }
  return hitIntraWord;
}

/** Infere a intenção funcional do passo/alvo do manual para a matriz de compatibilidade (ADR-027). */
export function inferStepIntent(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] },
  target?: string
): StepIntent {
  const norm = normSem([step.rawText, target || '', ...step.targets].join(' '));
  const normTarget = normSem(target || '');

  if (
    step.targets.some(t => t.includes('>')) ||
    /\b(acesse|abra|navegue|entre)\b.{0,28}\b(menu|submenu|menus)\b/.test(norm) ||
    step.actionType === 'navigate'
  ) {
    return 'navigate_menu';
  }

  if (/\bnovo\s+cartao\b/.test(norm) || /\bcadastr(e|ar)\s+nov[ao]\b/.test(norm)) {
    return 'create_entity';
  }

  if (
    /\b(adicionar servico|servicos realizados|efetuar servico|nome do servico|lancar ato|lancamentos?|tipo de ato|autenticidade|semelhanca|fotocopia)\b/.test(
      norm
    ) ||
    (normTarget === '+' && /\b(servico|servicos|ato|atos|pedido|lancamento)\b/.test(norm))
  ) {
    return 'launch_service_or_item';
  }

  if (/\b(na grade|nomes encontrados|partes encontradas|registros localizados|selecionar linha)\b/.test(norm)) {
    return 'pick_grid_row';
  }

  if (/\b(finalizar selecao|confirmar selecao|continuar)\b/.test(norm) && !/\bcaixa\b/.test(norm)) {
    return 'confirm_section';
  }

  if (/\b(salvar|gravar|concluir|enviar ao caixa|transmitir|efetivar)\b/.test(norm)) {
    return 'submit_form';
  }

  if (/\b(limpar|cancelar|descartar|fechar)\b/.test(norm)) {
    return 'cancel_or_clear';
  }

  if (
    /\b(pesquis|busc|filt|localiz)\b/.test(norm) &&
    !/\b(configur|habilit|assinale|marque|permiss|aliquota)\b/.test(norm)
  ) {
    return 'search_or_filter';
  }

  if (
    /\b(marqu[ae]|marcar|desmarqu[ae]|habilit|assinale|configur|parametriz|grupo|permiss|aliquota|impressora|margem|dpi|scanner)\b/.test(
      norm
    ) ||
    step.actionType === 'check' ||
    step.actionType === 'select'
  ) {
    return 'configure_parameter';
  }

  if (/\b(preench|digit|inform|insir)\b/.test(norm) || step.actionType === 'fill') {
    return 'fill_form_field';
  }

  return 'generic_action';
}

/** Infere o papel semântico de um nó do DOM/Árvore de Acessibilidade caso não venha carimbado do script DOM. */
export function inferNodeSemanticRole(node: CompatibilityNodeInput): SemanticRole {
  const n = normSem(node.name || node.associatedLabel || '');
  const sec = normSem(node.sectionTitle || '');
  const role = String(node.role || '').toLowerCase();
  const tag = String(node.tagName || '').toLowerCase();

  // ADR-035: cabeçalho de coluna da grade e título estático são papéis próprios (nunca `form_input`)
  if (isColumnHeaderNode({ role, tagName: tag, semanticRole: node.semanticRole })) return 'table_column_header';
  if (/^h[1-4]$/.test(tag) || role === 'heading') return 'page_heading';

  if (node.semanticRole) return node.semanticRole;

  if (node.inNavbar) {
    return role === 'menuitem' ? 'navigation_leaf' : 'navigation_root';
  }

  if (/\bnovo\s+(cartao|ficha|usuario|protocolo|orcamento)\b/.test(n)) {
    return 'entity_creation_button';
  }

  if (/ctrl\s*\+\s*b|pesquise aqui|nome da tela que deseja/.test(n)) {
    return 'search_filter_input';
  }

  if (/\befetuar servico\b/.test(n)) {
    return 'service_execution_trigger';
  }

  if (node.rowContext && (n === '+' || /\b(selecionar|escolher|alterar|consultar|excluir|adicionar)\b/.test(n))) {
    return 'grid_row_picker';
  }

  if (/^(finalizar|confirmar selecao|continuar)$/.test(n)) {
    return 'section_confirm_button';
  }

  if (/^(filtrar|pesquisar|buscar)$/.test(n) && (role === 'button' || tag === 'button')) {
    return 'search_trigger_button';
  }

  if (/^(salvar|concluir|gravar|transmitir|cadastrar|confirmar)$/.test(n) && (role === 'button' || tag === 'button' || role === 'label')) {
    return 'form_submit';
  }

  if (/^(limpar|cancelar|voltar|fechar)$/.test(n)) {
    return 'form_cancel';
  }

  if (
    (role === 'textbox' || role === 'searchbox' || tag === 'input') &&
    (/\b(busca|pesquisa|filtro)\b/.test(sec) || /\b(filtrar|pesquisa|senha sga|pedido senha)\b/.test(n))
  ) {
    return 'search_filter_input';
  }

  return 'form_input';
}

const GEOGRAPHIC_NODE_RE = /\b(cidade|uf|municipio|estado|cep|endereco|logradouro|bairro|pais)\b/;
const GEOGRAPHIC_STEP_RE = /\b(cidade|uf|municipio|estado|cep|endereco|logradouro|bairro|localidade|ibge|comarca)\b/;
const NAV_MENTION_RE = /\b(menu|submenu|menus|navbar|barra superior|barra de navegacao)\b/;
const CARTAO_STEP_RE = /\bcartao\b/;

/**
 * Matriz de Compatibilidade de Intenção × Papel de Componente (ADR-027).
 * Bloqueia com peso 0.0 qualquer casamento semanticamente absurdo ANTES da similaridade textual.
 */
export function evaluateSemanticCompatibility(
  step: Pick<RoutineStep, 'rawText' | 'targets'> & { actionType?: RoutineStep['actionType'] },
  docTarget: string,
  candidate: CompatibilityNodeInput
): SemanticCompatibilityResult {
  const stepIntent = inferStepIntent(step, docTarget);
  const nodeRole = inferNodeSemanticRole(candidate);
  const candNorm = normSem(candidate.name || candidate.associatedLabel || '');
  const stepNorm = normSem([step.rawText, docTarget, ...step.targets].join(' '));
  const targetNorm = normSem(docTarget);

  // 0. ADR-035: a busca global (CTRL + B / campo da barra superior) nunca é eleita em NENHUMA intenção, salvo se o
  //    próprio passo a cita (qualquer camada: 1, 2A, 2B, 2C-SoM, 2C-Grounding)
  // campo de TEXTO (um `combobox`/`select` de paginação dentro de um <nav> não é a busca global)
  const candInputLike =
    ['textbox', 'searchbox', 'spinbutton', 'input', 'textarea'].includes(String(candidate.role || '').toLowerCase()) ||
    ['input', 'textarea'].includes(String(candidate.tagName || '').toLowerCase());
  if (
    (isGlobalSearchNode({
      name: candidate.name,
      placeholder: candidate.placeholder ?? candidate.associatedLabel,
      id: candidate.id,
      isGlobalSearch: candidate.isGlobalSearch
    }) ||
      (candInputLike && candidate.inNavbar)) &&
    !stepNamesGlobalSearch(step)
  ) {
    return {
      compatible: false,
      weight: 0,
      reason: `Busca global (CTRL + B) ou campo da barra superior ("${candidate.name}") nunca é alvo de campo de tela`,
      stepIntent,
      nodeRole
    };
  }

  // 0.1 ADR-035: cabeçalho de coluna (`th`/`columnheader`) e título estático (`h1`-`h4`) não satisfazem um passo
  //     de digitação, filtro ou formulário — exige-se um controle interativo real (`input`, `select`, `textarea`...)
  if ((nodeRole === 'table_column_header' || nodeRole === 'page_heading') && stepExpectsInteractiveControl(step)) {
    return {
      compatible: false,
      weight: 0,
      reason:
        nodeRole === 'table_column_header'
          ? `Cabeçalho de coluna da grade ("${candidate.name}") não é campo de entrada: o passo pede digitação/filtro/formulário`
          : `Título estático ("${candidate.name}") não é campo de entrada: o passo pede digitação/filtro/formulário`,
      stepIntent,
      nodeRole
    };
  }

  // 1. Proibição estrita de colisão por substring intra-palavra (ex.: "Autenticidade" vs "Cidade")
  if (hasIntraWordSubstringCollision(docTarget, candidate.name || candidate.associatedLabel || '')) {
    return {
      compatible: false,
      weight: 0,
      reason: `Colisão lexical intra-palavra proibida entre "${docTarget}" e "${candidate.name}"`,
      stepIntent,
      nodeRole
    };
  }

  // 2. "Novo cartão +" (criação de entidade de cartão) NUNCA casa com lançamento de serviço/pedido sem citar cartão
  if (
    (/\bnovo cartao\b/.test(candNorm) || nodeRole === 'entity_creation_button') &&
    !CARTAO_STEP_RE.test(stepNorm) &&
    (stepIntent === 'launch_service_or_item' ||
      stepIntent === 'search_or_filter' ||
      stepIntent === 'configure_parameter' ||
      targetNorm === '+' ||
      /\badicionar\b|\bnovo pedido\b/.test(targetNorm))
  ) {
    return {
      compatible: false,
      weight: 0,
      reason: `Papel entity_creation_button ("${candidate.name}") incompatível com intenção ${stepIntent}`,
      stepIntent,
      nodeRole
    };
  }

  // 3. Parâmetro/modalidade/preenchimento não geográfico NUNCA casa com campos de endereço ("Cidade", "UF")
  if (
    (stepIntent === 'configure_parameter' ||
      stepIntent === 'launch_service_or_item' ||
      stepIntent === 'fill_form_field' ||
      stepIntent === 'generic_action') &&
    GEOGRAPHIC_NODE_RE.test(candNorm) &&
    !GEOGRAPHIC_STEP_RE.test(stepNorm)
  ) {
    return {
      compatible: false,
      weight: 0,
      reason: `Campo geográfico/endereço ("${candidate.name}") incompatível com passo sem contexto geográfico`,
      stepIntent,
      nodeRole
    };
  }

  // 4. Barra superior (navigation_root) nunca casa com alvos compostos ou passos de formulário sem citar menu/navbar
  const targetTokens = alphaTokens(targetNorm);
  const candTokens = alphaTokens(candNorm);
  if (
    (candidate.inNavbar || nodeRole === 'navigation_root') &&
    stepIntent !== 'navigate_menu' &&
    !NAV_MENTION_RE.test(stepNorm) &&
    (targetTokens.length >= 2 && (candTokens.length < targetTokens.length || targetNorm !== candNorm))
  ) {
    return {
      compatible: false,
      weight: 0,
      reason: `Item raiz de navegação ("${candidate.name}") incompatível com alvo composto de formulário "${docTarget}"`,
      stepIntent,
      nodeRole
    };
  }

  // 5. Navegação de menu estrita nunca casa com inputs de busca/formulário ou busca global CTRL + B
  if (
    stepIntent === 'navigate_menu' &&
    (nodeRole === 'search_filter_input' ||
      nodeRole === 'form_input' ||
      ['textbox', 'searchbox', 'combobox', 'spinbutton', 'input', 'textarea'].includes(String(candidate.role || '').toLowerCase()))
  ) {
    return {
      compatible: false,
      weight: 0,
      reason: `Campo de entrada/busca ("${candidate.name}") incompatível com passo de navegação`,
      stepIntent,
      nodeRole
    };
  }

  // 6. Ponderação por correspondência de seção (`sectionTitle`)
  const secNorm = normSem(candidate.sectionTitle || '');
  const secMatchesStep =
    secNorm.length >= 4 && (` ${stepNorm} `.includes(` ${secNorm} `) || step.targets.some(t => normSem(t) === secNorm));

  return {
    compatible: true,
    weight: secMatchesStep ? 1.15 : 1.0,
    stepIntent,
    nodeRole
  };
}
