export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ActionType = 'click' | 'fill' | 'search' | 'select' | 'check' | 'navigate' | 'verify';

export type AnchorPlacement = 'top' | 'bottom' | 'right' | 'left' | 'auto';

/**
 * Modo de operação da Camada 2C (Set-of-Mark + Visual Grounding via Antigravity CLI `agy` — ADR-031):
 * - `live`: aciona `agy` (`Gemini 4 Hydrogen Extra`) em tempo real quando as Camadas 0–2A falham (padrão em `--routines` / `--routine`).
 * - `defer`: não dispara subprocessos `agy` durante lotes grandes (`--phase` / `--reaudit-pending`); grava os overlays SoM
 *            em `auditoria/cache/pending-som/` para curadoria em bloco pós-lote via `npm --prefix auditoria run visual:curate`.
 */
export type VisualAuditMode = 'live' | 'defer';

/** Candidato interativo de entrada para o renderizador efêmero Set-of-Mark (ADR-031). */
export interface SetOfMarkCandidateInput {
  id: number;
  box: BoundingBox;
}

/**
 * Classificação de carga da rotina para escalonamento no Worker Pool:
 * - `read_only`: Consultas, visualizações e relatórios (alta concorrência: 4 a 6 workers).
 * - `mutation`: Cadastros, alterações, inativações e parametrizações que gravam no banco WildFly/PostgreSQL
 *               (concorrência restrita/serializada com trava para evitar deadlocks).
 */
export type WorkloadType = 'read_only' | 'mutation';

export interface Point {
  x: number;
  y: number;
}

/**
 * Métricas do Viewport capturadas diretamente do motor Blink (window / visualViewport)
 * no instante exato da medição de geometria do elemento.
 */
export interface DOMViewportMetrics {
  width: number;
  height: number;
  devicePixelRatio: number;
  scrollX: number;
  scrollY: number;
}

export type SemanticRole =
  | 'navigation_root'
  | 'navigation_leaf'
  | 'search_filter_input'
  | 'search_trigger_button'
  | 'grid_row_picker'
  | 'section_confirm_button'
  | 'service_execution_trigger'
  | 'entity_creation_button'
  | 'form_input'
  | 'form_submit'
  | 'form_cancel'
  /** Cabeçalho de coluna de grade (`th`, `[role="columnheader"]`, controle dentro de `thead`) — ADR-035 */
  | 'table_column_header'
  /** Título estático de página/seção (`h1`-`h4`), nunca um campo de entrada — ADR-035 */
  | 'page_heading';

export type StepIntent =
  | 'navigate_menu'
  | 'search_or_filter'
  | 'pick_grid_row'
  | 'confirm_section'
  | 'launch_service_or_item'
  | 'create_entity'
  | 'configure_parameter'
  | 'fill_form_field'
  | 'submit_form'
  | 'cancel_or_clear'
  | 'generic_action';

export interface DOMAngularBindings {
  ngModel?: string;
  ngClick?: string;
  uiSref?: string;
  ngDisabled?: string;
  ngIf?: string;
  humanizedModel?: string;
  humanizedAction?: string;
}

export interface DOMSemanticSignature {
  /** Título do bloco/seção visual mais próximo (fieldset legend, panel-heading, card-header, h3-h5...) */
  sectionTitle?: string;
  /** Contexto de linha quando o elemento está em uma tabela (`<tr>`) */
  rowContext?: {
    rowIndex: number;
    firstColText: string;
    secondColText?: string;
  };
  /** Rótulo associado lido de `<label>`, `<span>` adjacente, placeholder, `title` ou `ng-reflect-*` */
  associatedLabel?: string;
  /** Papel funcional inferido para a Matriz de Compatibilidade Intenção × Papel */
  semanticRole: SemanticRole;
  /** Bindings Angular/AngularJS extraídos como sinal auxiliar determinístico (ADR-030) */
  angularBindings?: DOMAngularBindings;
}

/**
 * Contexto estrutural e semântico extraído da árvore DOM real,
 * eliminando adivinhações por números mágicos ou leitura de pixels RGB.
 */
export interface DOMElementContext {
  tagName: string;
  role?: string;
  innerText?: string;
  isTopNav?: boolean;
  isVerticalSidebar?: boolean;
  isDropdownItem?: boolean;
  isModal?: boolean;
  iframeOffset?: Point;
  neighborBoxes?: BoundingBox[];
  /** Assinatura Semântica Hierárquica extraída ao vivo no DOM (ADR-027) */
  semantic?: DOMSemanticSignature;
  /** Placeholder/title/aria-label do nó medido (o `innerText` de um `<input>` é sempre vazio) — ADR-035 */
  placeholder?: string;
  /** `id` do nó medido (ex.: o campo da busca global da barra superior) — ADR-035 */
  elementId?: string;
  /** Verdadeiro quando o nó (ou algum membro do grupo) é a busca global `CTRL + B` ou um campo da barra superior — ADR-035 */
  isGlobalSearch?: boolean;
  /** Tags dos membros de uma união de grupo (`th` para cabeçalho de coluna), para guardas por membro — ADR-035 */
  memberTags?: string[];
}

/**
 * Zona Semântica efetivamente aplicada na busca dentro do DOM (ADR-015):
 * - `content`: escopo restrito ao contêiner principal de conteúdo/formulário, excluindo
 *   toda zona de navegação (`aside`, `nav`, `.sidebar`, `.nav-stacked`, `[role="tablist"]`...).
 * - `any`: busca irrestrita no documento (passos de navegação: menus, abas, barra superior).
 */
export type SemanticZone = 'content' | 'any';

/**
 * Política de zona de um passo (decidida antes de tocar o DOM):
 * - `content`: estrita — passos de parametrização/formulário ("Defina", "Preencha", "Configure"...).
 *   Se nada for encontrado no contêiner de conteúdo, o passo NÃO recai sobre a navegação.
 * - `content-preferred`: verbos ambíguos ("Selecione", "Escolha"...) — tenta o conteúdo primeiro e
 *   só então libera a busca irrestrita.
 * - `any`: passos de navegação explícita.
 */
export type StepZonePolicy = SemanticZone | 'content-preferred';

/**
 * Membro individual de uma União Geométrica de Múltiplos Alvos (Group Bounding Box, ADR-015).
 * `cssBox` é a união do nó localizado com o seu bloco de campo (rótulo + controle associado).
 */
export interface DOMGroupMember {
  query: string;
  matchedSelector: string;
  innerText: string;
  cssBox: BoundingBox;
  /** Tag do nó medido (`th` para cabeçalho de coluna, inclusive `[role="columnheader"]`) — ADR-035 */
  tagName?: string;
}

/**
 * Contrato Determinístico de Geometria do DOM (Fonte Única de Verdade).
 */
export interface DOMResolvedGeometry {
  /** Coordenadas em CSS pixels relativas ao viewport visível (pós-scrollIntoView e pós-estabilização) */
  cssBox: BoundingBox;
  /** Métricas exatas do viewport no instante da captura */
  viewport: DOMViewportMetrics;
  /** Contexto semântico e estrutural extraído da árvore DOM */
  context: DOMElementContext;
  /** Seletor ou expressão que localizou o elemento */
  matchedSelector: string;
  /** Rota hash/URL ativa no momento da medição */
  url: string;
  /** Timestamp ISO da extração */
  capturedAt: string;

  /** Zona semântica efetivamente aplicada na busca (ADR-015) */
  zone?: SemanticZone;
  /** Política de zona solicitada pelo passo (preenchida no lado Node) */
  zonePolicy?: StepZonePolicy;
  /** Contêiner principal de conteúdo resolvido ao vivo (apenas quando `zone === 'content'`) */
  contentRoot?: { selector: string; strategy: string; box: BoundingBox };
  /** Caixas das navegações laterais excluídas da busca, medidas no mesmo frame do alvo */
  lateralNavBoxes?: BoundingBox[];
  /** Membros resolvidos quando `cssBox` é uma união de múltiplos alvos (Group Bounding Box) */
  groupMembers?: DOMGroupMember[];
  /** União matemática exata (minX, minY, maxX, maxY) dos membros, antes do recorte no viewport */
  groupUnionBox?: BoundingBox;
  /** Alvos do grupo que não foram localizados no contêiner de conteúdo */
  unresolvedGroupTargets?: string[];
  /** Verdadeiro se `cssBox` foi recortado à porção visível do viewport */
  clippedToViewport?: boolean;
  /** Carimbo do nó validado na zona, usado pela ação pós-captura do executor (ADR-015 §2.4) */
  actionTarget?: DOMActionTarget;
  /**
   * Multi-demarcação (ADR-017): alvos medidos no MESMO frame que recebem, cada um, a sua moldura e o
   * seu número de sequência (1, 2, 3...) numa única print. Ausente = demarcação única (`cssBox`).
   */
  callouts?: DOMCallout[];
}

/** Alvo individual de uma print com múltiplas demarcações numeradas (ADR-017). */
export interface DOMCallout {
  /** Número de sequência exibido no badge (1..N, na ordem em que o alvo aparece no passo) */
  index: number;
  /** Nome do alvo como citado no passo (ou o nome real, quando curado com evidência) */
  label: string;
  /** Caixa em CSS pixels medida ao vivo via getBoundingClientRect() */
  cssBox: BoundingBox;
  matchedSelector?: string;
  /** Texto real do nó medido (prova de que o rótulo existe na tela) */
  innerText?: string;
}

/** Descrição de um nó carimbado durante a medição. */
export interface DOMActionNode {
  tagName: string;
  text: string;
  box: BoundingBox;
  insideNavZone: boolean;
  /** Controle desabilitado na tela no instante da conferência (ex.: botão que aguarda campo obrigatório) */
  disabled?: boolean;
  /** Rótulo alternativo do nó (`title`, `aria-label` ou `value`), para controles sem texto (ADR-018) */
  hint?: string;
  /** O clique tende a abrir uma nova guia (`target="_blank"` / `window.open`); só então a detecção de guias roda (ADR-025) */
  opensNewTab?: boolean;
}

/**
 * Alvo da ação pós-captura (ADR-015 §2.4). Os seletores apontam para um atributo único gravado,
 * durante a medição, no próprio nó validado pelo Filtro de Zona Semântica: clicar por eles é clicar
 * no mesmo nó que foi medido e demarcado.
 */
export interface DOMActionTarget {
  clickSelector: string;
  click: DOMActionNode;
  /** Controle de formulário (input/select/textarea) do alvo, quando existe */
  fillSelector?: string;
  fill?: DOMActionNode;
}

/** Registro da ação efetivamente executada pelo executor após a captura de um passo. */
export interface ExecutedStepAction {
  kind: 'click' | 'fill' | 'none';
  /**
   * `measured-node`: mesmo nó medido na zona; `a11y-ref`: legado por nome (só fora da zona de conteúdo);
   * `dry-run`: comando de gravação/exclusão localizado e demarcado, com o clique final omitido pela
   * Trava Segura de Mutação (ADR-018).
   */
  via: 'measured-node' | 'a11y-ref' | 'skipped' | 'dry-run';
  /** Comando de gravação cujo clique foi omitido (`via: 'dry-run'`) */
  commitLabel?: string;
  selector?: string;
  node?: DOMActionNode;
  /** Zona em que o alvo foi medido */
  zone?: SemanticZone;
  reason?: string;
  /** Nova guia aberta pela ação do passo (sub-portal integrado, ADR-025). A guia passa a ser o foco da rotina. */
  openedTab?: { tabId: string; url: string; title: string };
}

/**
 * Telemetria de divergência gerada pelo `smart-locator.ts` (Auto-Cura)
 * quando o seletor/texto documentado no manual diverge da interface real do Orion TN.
 */
export interface SmartLocatorDivergence {
  stepNumber: number;
  documentedTarget: string;
  actualElementText: string;
  actualRole?: string;
  matchedRef?: string;
  /** `menu_path_resolution`: Auto-Cura de Rota de um caminho de menu `A > B > C` (ADR-016) */
  /** `target_not_found`: alvo citado no passo que não existe na zona de conteúdo e não pôde ser curado */
  /** `permission_blocked`: o alvo existe, mas a aplicação o marca como bloqueado/oculto para o perfil logado (ADR-017) */
  /** `investigative_reveal`: o alvo só aparece após um gatilho revelador seguro da própria tela (ADR-018) */
  /** `visual_som_fallback`: Camada 2C Set-of-Mark (SoM) em memória + VLM `agy` + validação DOM (ADR-031) */
  /** `visual_grounding_fallback`: Camada 2C Visual Grounding `[0..1000]` -> `elementFromPoint` + DOM (ADR-031) */
  resolutionLayer:
    | 'dom_synonym_heuristic'
    | 'a11y_fuzzy_match'
    | 'llm_a11y_fallback'
    | 'visual_som_fallback'
    | 'visual_grounding_fallback'
    | 'menu_path_resolution'
    | 'target_not_found'
    | 'permission_blocked'
    | 'investigative_reveal';
  confidence: number;
  reason: string;
  detectedAt: string;
  /** Evidência concreta no DOM que autoriza a alteração do texto do manual (ADR-017) */
  evidence?: TextChangeEvidence;
  /** Substituição exata proposta no texto do passo; só é aplicada pela Trava de Evidência (ADR-017) */
  textChange?: { from: string; to: string };
  /** Gatilho revelador que tornou o alvo visível (`investigative_reveal`, ADR-018) */
  reveal?: RevealTriggerInfo;
}

/** Tipos de gatilho revelador seguro investigados antes de um bloqueio `[!!!]` (ADR-018). */
export type RevealTriggerKind = 'tab' | 'accordion' | 'button' | 'checkbox' | 'radio' | 'subportal_link';

/** Gatilho revelador acionado, com a evidência medida ao vivo antes do clique (ADR-018). */
export interface RevealTriggerInfo {
  kind: RevealTriggerKind;
  /** Texto real do gatilho na tela */
  label: string;
  /** O gatilho foi deduzido do DOM (o alvo já existia oculto sob ele), não apenas enumerado */
  directed: boolean;
  evidence: TextChangeEvidence;
  /** Print em que o gatilho está demarcado */
  printFile?: string;
}

/** Registro de um gatilho testado pela Exploração Investigativa (ADR-018). */
export interface ExploredTrigger {
  kind: RevealTriggerKind;
  label: string;
  directed: boolean;
  /** `subportal_opened`: o link abriu uma nova guia (sub-portal integrado), que passou a ser o foco da rotina (ADR-025) */
  outcome: 'revealed' | 'no_effect' | 'screen_error' | 'not_actionable' | 'subportal_opened';
  /** O estado anterior da tela foi restaurado e conferido após a tentativa */
  restored?: boolean;
}

/** Resultado da Exploração Investigativa de um passo (ADR-018). */
export interface RevealExplorationLog {
  /** Alvos do manual que não estavam na tela inicial do passo */
  missing: string[];
  /** Alvos que passaram a existir após um gatilho */
  revealed: string[];
  explored: ExploredTrigger[];
  /** Total de gatilhos candidatos encontrados na tela (pode exceder os testados) */
  candidates: number;
  /** Checkboxes/radios da tela descartados por não terem afinidade semântica com o alvo */
  selectorsWithoutAffinity: number;
  /** Falso se o estado da tela não pôde ser devolvido ao ponto de partida */
  stateRestored: boolean;
}

/**
 * Evidência de uma substituição de texto (Regra da Evidência Estrita, ADR-017). O texto do manual só
 * pode ser alterado quando existe um elemento real, medido ao vivo e demarcado na print.
 */
export interface TextChangeEvidence {
  /** `dom-measured`: nó medido via getBoundingClientRect(); `menu-tree`: item lido da árvore de navegação real */
  source: 'dom-measured' | 'menu-tree';
  matchedSelector: string;
  /** Texto real do nó (deve conter o texto que entra no manual) */
  elementText: string;
  box: BoundingBox;
}

/** Perfil/privilégio exigido por uma rotina, extraído do texto do manual (ADR-017). */
export interface PrivilegeRequirement {
  /** Papéis aceitos (basta um), como escritos no manual */
  roles: string[];
  /** Passo de onde o requisito foi extraído (0 = fora dos passos) */
  sourceStep: number;
  sourceText: string;
}

/** Identidade da sessão autenticada, lida do armazenamento de sessão da própria aplicação (ADR-017). */
export interface SessionIdentity {
  login: string;
  name: string;
  /** Cargo cadastrado (informativo: cargo não é privilégio) */
  position: string;
  /** Nomes dos perfis de acesso atribuídos à conta */
  profiles: string[];
  source: string;
}

export interface PrivilegeGateResult {
  satisfied: boolean;
  requirement: PrivilegeRequirement | null;
  identity: SessionIdentity | null;
  /** Papel do requisito que a sessão comprovadamente possui */
  matchedRole?: string;
  reason: string;
  /**
   * Estado do gate (ADR-018): `not_required` (rotina sem requisito), `satisfied`, `restricted`
   * (identidade lida, sem perfil pleno nem correspondência: único estado que bloqueia antes do passo 1)
   * e `inconclusive` (identidade ilegível: a auditoria segue e só bloqueia com evidência no DOM).
   */
  state: 'not_required' | 'satisfied' | 'restricted' | 'inconclusive';
  /** A sessão é um perfil administrativo pleno reconhecido (ex.: Gerência webFirmas / TABELIAO) */
  fullAccess: boolean;
  /** Marcador que comprovou o perfil pleno, como lido da sessão */
  fullAccessEvidence?: string;
}

/**
 * Taxonomia de revisão humana (ADR-021), que substitui o `[!!!]` genérico:
 * - `atualizacao_editorial` `[ATT]`: o manual cita tela/caminho/campo que não existe mais na versão atual;
 * - `dependencia_dados_banco` `[DDD]`: faltam registros no banco de homologação (ou o ambiente/hardware não permite);
 * - `dependencia_cruzada_rotina` `[XRX]`: depende da execução prévia de outra rotina;
 * - `comunicacao_externa` `[CCC]` (ADR-024): parte do passo a passo ocorre em portal externo ao Orion TN. Não
 *   bloqueia a auditoria das etapas do Orion TN e pode vir junto de outra tag (`[ATT][CCC]`).
 */
export type ReviewStatus =
  | 'atualizacao_editorial'
  | 'comunicacao_externa'
  | 'dependencia_dados_banco'
  | 'dependencia_cruzada_rotina';

/**
 * Escopo de um passo (ADR-024): `external_portal` ocorre em portal/serviço externo ao Orion TN (SISCOAF,
 * e-Notariado, CENSEC, CRC, CNB, Receita Federal...) e nunca é executado nem fotografado; `orion_tn` é auditado.
 */
export type StepScope = 'external_portal' | 'orion_tn';

/** Status gravado no `-revisado.md` (`auditoria_ui.status`) e no banco. */
export type RoutineAuditStatus = 'validado_inalterado' | 'validado_com_ajustes' | ReviewStatus;

/**
 * Status do relatório devolvido pelo executor. `falha_tecnica` nunca vira pasta nem `-revisado.md`: a
 * rotina permanece `nao_auditada` e a falha vai para o resumo do lote (ADR-021).
 */
export type AuditReportStatus = RoutineAuditStatus | 'falha_tecnica';

/** Evidência de estado vazio da tela (ADR-021 §2): grade sem linhas, toast transitório, controles inativos por falta de dado. */
export interface EmptyStateEvidence {
  /** Existe grade/tabela com cabeçalhos visíveis e nenhuma linha de dados */
  emptyGrid: boolean;
  headers: string[];
  /** Texto literal de um toast/alerta de "nada cadastrado" capturado antes de sumir (ou da mensagem fixa da grade) */
  toastText?: string;
  /** Controles inativos na zona de conteúdo (ex.: Filtrar) com a dica que a tela exibe */
  disabledControls: Array<{ label: string; hint?: string }>;
  /** Botão de abertura de cadastro ativo na zona de conteúdo (Adicionar/Novo/Cadastrar) */
  addButton?: { label: string; selector: string };
  /** Hash da rota onde a evidência foi lida */
  hash?: string;
  /**
   * Pré-filtro automático de grade vazia tentado antes de declarar a tela sem dados (ADR-029): estratégia usada,
   * campos de filtro preenchidos e o motivo pelo qual a grade seguiu sem linhas.
   */
  prefilter?: {
    strategy: 'as_is' | 'wide_period' | 'text_probe' | 'none';
    trigger?: string;
    filled: Array<{ label: string; value: string }>;
    reason: string;
  };
}

/** Registro mock criado pelo auto-seed (ADR-021 §3), gravado na telemetria. */
export interface SeededRecord {
  stepNumber: number;
  route: string;
  addButton: string;
  commitButton: string;
  /** Campos preenchidos (rótulo -> valor) */
  fields: Array<{ label: string; value: string; kind: string }>;
  /** Linhas da grade depois do cadastro */
  rowsAfter: number;
  createdAt: string;
}

/** Bloqueio estruturado de uma rotina (`ReviewStatus`). */
export interface RoutineBlockInfo {
  /** Vai para `auditoria_ui.tipo_bloqueio` */
  tipo: string;
  /** Vai para a linha "Motivo Técnico" do relatório */
  motivo: string;
  /** Passos do "Roteiro Técnico para Execução Manual" */
  roteiro: string[];
  /**
   * `manual_outdated`: sessão plena, sem marca de bloqueio no DOM e gatilhos reveladores esgotados —
   * defasagem editorial do manual (ADR-018). `dry_run_dependent`: o alvo depende do efeito de um
   * comando de gravação que a Trava Segura de Mutação não acionou.
   */
  kind:
    | 'rbac'
    | 'missing_target'
    | 'manual_outdated'
    | 'dry_run_dependent'
    | 'screen_error'
    | 'other'
    | 'empty_data'
    | 'cross_routine'
    | 'environment';
  /** Rotinas pré-requisito (`[XRX]`): precisam rodar antes desta */
  prerequisites?: string[];
  /** Evidência de tela vazia que sustenta um `[DDD]` */
  emptyState?: EmptyStateEvidence;
}

/** Evidência real de um caminho de menu inexistente (ADR-024), lida da árvore de navegação ao vivo. */
export interface MenuPathMissingEvidence {
  /** Caminho citado no manual, `A > B > C` */
  documented: string;
  /** Maior prefixo do caminho que existe na árvore (`Notas > Certidões`); vazio se nem o menu raiz existe */
  existingPrefix: string[];
  /** Primeiro segmento que não existe (`Novo Pedido de Certidão`) */
  missingSegment: string;
  /** Itens reais do último nível existente (filhos do prefixo), para o relatório */
  siblings: string[];
  /** Menus raiz lidos da barra de navegação */
  roots: string[];
  /** Total de itens da árvore de navegação lidos */
  treeSize: number;
  /** Nome da folha encontrado em outro ponto da árvore (apenas pista), se houver */
  leafElsewhere?: string[];
}

/**
 * Resultado retornado pelo `smart-locator.ts` após resolver um passo.
 */
export interface SmartLocatorResult {
  found: boolean;
  healed: boolean;
  geometry: DOMResolvedGeometry | null;
  matchedTargetName: string;
  matchedRef?: string;
  divergence?: SmartLocatorDivergence;
  /** Texto do passo já corrigido pela camada que curou a divergência (ex.: rota de menu, ADR-016) */
  validatedText?: string;
  /** O alvo existe, mas está bloqueado/oculto para o perfil logado: bloqueio por privilégio (ADR-017) */
  permissionBlocked?: { target: string; detail: string; domEvidence?: string };
  /**
   * Caminho de menu documentado que NÃO existe na árvore de navegação real (ADR-024): o passo não é curado
   * para outro elemento; a evidência lida da árvore vai para o bloqueio `[ATT]`.
   */
  menuPathMissing?: MenuPathMissingEvidence;
  /** O caminho existe na árvore, mas a cascata não pôde ser aberta/mantida: falha técnica, não defasagem do manual */
  menuPathOpenFailed?: string;
  /**
   * A medição só foi possível com a dica de uma auditoria anterior (ADR-025): o rótulo real já curado antes foi
   * RECONFIRMADO ao vivo no DOM desta execução. A dica nunca é evidência; a evidência é o nó medido agora.
   */
  priorHint?: { documented: string; actual: string; layer: string };
  /**
   * Cauda do caminho documentado que a árvore real NÃO tem como item de menu (ADR-029): `Administração >
   * Parâmetros > Captura e digitalização` resolve para a tela `Configurações > Parametrizações`, e o segmento
   * restante é aba/seção dessa tela. O executor mede a aba ao vivo depois do clique da folha; sem aba medida, o passo
   * bloqueia com a lista real de abas. O texto da cauda nunca é reescrito.
   */
  menuTail?: { segments: string[]; realChain: string[]; documentedPath: string; basis: string };
  /**
   * Divergências de alvos individuais de um passo com múltiplos alvos (ADR-016): rótulos curados para
   * o nome real da tela ou não localizados na zona de conteúdo, mesmo quando o passo foi demarcado.
   */
  targetDivergences?: SmartLocatorDivergence[];
  /**
   * Ações icônicas de grade (ADR-020): resultado da leitura da 1ª linha da grade. `empty-grid`: a grade não
   * tem registros; `no-actions`: a linha não tem botões de ação localizáveis.
   */
  gridActions?: {
    status: 'resolved' | 'empty-grid' | 'no-actions';
    firstRowText?: string;
    rowActions?: Array<{ label: string; kind: string | null; source: string }>;
    matches?: Array<{ target: string; realLabel: string; via: string; source: string }>;
  };
}

/**
 * Resultado determinístico do solver de layout do motor gráfico Sharp.
 */
export interface AnnotationLayoutResult {
  /** Caixa demarcada final após transformação física (DPR) e clamping no canvas */
  targetBox: BoundingBox;
  /** Caixa ocupada pelo badge numérico / ícone */
  badgeBox: BoundingBox;
  /** Caixa ocupada pelo rótulo textual (se presente) */
  labelBox?: BoundingBox;
  /** Direção cardinal escolhida pelo solver anti-oclusão */
  placement: Exclude<AnchorPlacement, 'auto'>;
  /** Fator de escala horizontal aplicado (imgWidth / viewport.width) */
  scaleX: number;
  /** Fator de escala vertical aplicado (imgHeight / viewport.height) */
  scaleY: number;
  /** Área de interseção entre anotação (badge+label) e interior do elemento alvo (deve ser 0) */
  selfOcclusionArea: number;
  /**
   * Multi-demarcação (ADR-017): layout de cada alvo numerado. Quando presente, os campos acima
   * espelham a demarcação 1 (compatibilidade) e `selfOcclusionArea` soma TODAS as oclusões
   * (anotação x qualquer alvo), que devem ser 0.
   */
  callouts?: AnnotationCalloutLayout[];
  /** Soma das interseções entre anotações de alvos diferentes (deve ser 0) */
  crossAnnotationOverlap?: number;
}

/** Layout resolvido de uma demarcação numerada numa print com múltiplos alvos (ADR-017). */
export interface AnnotationCalloutLayout {
  index: number;
  label?: string;
  targetBox: BoundingBox;
  /** Núcleo do elemento (sem a folga da moldura): área protegida contra oclusão */
  coreBox: BoundingBox;
  badgeBox: BoundingBox;
  labelBox?: BoundingBox;
  placement: Exclude<AnchorPlacement, 'auto'>;
  /** Interseção das anotações deste alvo com o núcleo de QUALQUER alvo da print (deve ser 0) */
  occlusionArea: number;
}

/** Alvo de entrada de uma print com múltiplas demarcações (coordenadas CSS medidas ao vivo). */
export interface AnnotationCalloutInput {
  index: number;
  box: BoundingBox;
  label?: string;
}

export interface AnnotationOptions {
  inputPath: string;
  outputPath: string;
  box: BoundingBox;
  stepNumber: number;
  actionType?: ActionType;
  label?: string;
  themeColor?: string; // Default: #ad0505 (Carmesim Canônico Siplan)

  /**
   * Multi-demarcação (ADR-017): dois ou mais alvos medidos no mesmo frame. Cada um recebe moldura e
   * badge numerado em sequência (1, 2, 3...) na mesma imagem. Quando presente, `box`, `label` e
   * o número do passo no badge são ignorados.
   */
  callouts?: AnnotationCalloutInput[];
  /** Obstáculos suaves (CSS px) que as anotações da multi-demarcação evitam cobrir, ex.: menus abertos */
  softObstacles?: BoundingBox[];

  /** Métricas do viewport do DOM para transformação determinística CSS -> Physical Pixels */
  viewport?: DOMViewportMetrics;

  /** Contexto estrutural do elemento no DOM para ancoragem inteligente sem heurística cega */
  domContext?: DOMElementContext;

  /** Posição explícita de ancoragem do conjunto Badge + Rótulo (default: 'auto') */
  anchorPlacement?: AnchorPlacement;

  // 1. Inset de Lupa / Zoom Callout (Card ampliado para ícones minúsculos <= 44px)
  enableZoomCallout?: boolean;
  zoomFactor?: number; // Default: 2.5
  zoomPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'auto';

  // 2. Badges com Micro-Ícones de Ação (Pill badge com ícone vetorial)
  showActionIcon?: boolean; // Default: true

  // 3. Setas Indicativas Vetoriais (Curved Arrows para abas e passos sequenciais)
  arrowFrom?: Point; // Ponto de origem da seta

  // 4. Otimização em Múltiplos Formatos (WebP)
  exportWebp?: boolean; // Default: true
  webpQuality?: number; // Default: 85
}

export interface AnnotationOutput {
  pngPath: string;
  webpPath?: string;
  layout: AnnotationLayoutResult;
  imageSize: {
    width: number;
    height: number;
  };
}

export interface RoutineStep {
  stepNumber: number;
  /** ID da rotina proprietária (ex.: 'C-CENTRAL-02'), propagado para consulta de RAG de revisões (ADR-027) */
  routineId?: string;
  rawText: string;
  targets: string[]; // Elementos visuais em **negrito**
  actionType: ActionType;
  subItems?: string[];
  /**
   * Quantos alvos em negrito vêm da linha principal do passo (os demais vêm dos sub-itens).
   * Zero com `targets` preenchido = passo que apenas lista opções alternativas (ADR-016).
   */
  mainTargetCount?: number;
  /** Política de zona explícita; se ausente, é inferida do texto via `inferStepZone()` (ADR-015) */
  zone?: StepZonePolicy;
  /** Escopo do passo, decidido na pré-análise da rotina inteira antes de abrir o navegador (ADR-024) */
  scope?: StepScope;
  /** Portal/serviço externo do passo `external_portal` (ex.: `SISCOAF`) */
  externalPortal?: string;
}

export interface ParsedRoutine {
  id: string;
  titulo: string;
  modulo: string;
  secao: string;
  tem_video: boolean;
  workloadType?: WorkloadType;
  frontmatter: Record<string, any>;
  descricao: string;
  steps: RoutineStep[];
  observacoes: string[];
  rawContent: string;
}

export interface AuditStepResult {
  stepNumber: number;
  /** Rótulo do manual casado com o nome real da tela sem mudar o texto (ADR-020): rotina vira `validado_com_ajustes` */
  adjusted?: boolean;
  /** `external_portal`: passo fora do Orion TN, não executado nem fotografado (ADR-024) */
  stepScope?: StepScope;
  /** Portal externo do passo `external_portal` */
  externalPortal?: string;
  /** Balões de ajuda "i" lidos ao vivo na tela do passo (ADR-020) */
  helpTooltips?: import('./help-tooltips.js').HelpTooltip[];
  originalText: string;
  validatedText: string;
  isModified: boolean;
  screenshotRawPath: string;
  screenshotAnnotatedPath: string;
  screenshotWebpPath?: string;
  boundingBox?: BoundingBox;
  domGeometry?: DOMResolvedGeometry;
  layoutResult?: AnnotationLayoutResult;
  divergence?: SmartLocatorDivergence;
  /** Divergências de alvos individuais do passo (rótulo curado ou não localizado) — ADR-016 */
  targetDivergences?: SmartLocatorDivergence[];
  /** Ação pós-captura executada (ADR-015 §2.4) */
  executedAction?: ExecutedStepAction;
  /**
   * `clean`: screenshot limpo da tela, sem moldura nem badge (ADR-016) — passo descritivo sem alvo
   * em negrito, ou lista de opções que não está visível na tela atual. `annotated` é o padrão.
   */
  captureMode?: 'annotated' | 'clean';
  /** Observação registrada no `-revisado.md` para o passo */
  note?: string;
  /** Alvos numerados demarcados na print do passo (multi-demarcação, ADR-017) */
  callouts?: DOMCallout[];
  /** Prints do passo, na ordem (a principal e, se houver, a do estado seguinte à ação) */
  printFiles?: string[];
  /** Exploração Investigativa executada neste passo antes de aceitar ou bloquear um alvo (ADR-018) */
  exploration?: RevealExplorationLog;
  /** Alvos deduzidos de um passo sem negrito (ADR-021 §4): só demarcados, o texto do manual não muda */
  implicitTargets?: string[];
  /** Estado vazio da tela lido neste passo (ADR-021 §2) */
  emptyState?: EmptyStateEvidence;
  /** Registro mock de pré-requisito criado neste passo (ADR-021 §3) */
  seededRecord?: SeededRecord;
  status: 'ok' | 'modified' | 'blocked';
  errorMessage?: string;
}

export interface AuditRoutineReport {
  /** Comparativo da reauditoria Antes -> Depois desta execução (ADR-025); ausente na 1ª auditoria */
  reaudit?: import('./prior-audit.js').ReauditHistoryEntry;
  id: string;
  modulo: string;
  titulo: string;
  workloadType?: WorkloadType;
  workerSessionId?: string;
  status: AuditReportStatus;
  steps: AuditStepResult[];
  divergences?: SmartLocatorDivergence[];
  /** Bloqueio estruturado (RBAC Gate, alvo sem evidência...) quando a rotina é `[ATT]`/`[DDD]`/`[XRX]` */
  block?: RoutineBlockInfo;
  /** Todas as tags da rotina em ordem canônica (ADR-024), ex.: `['ATT', 'CCC']` */
  reviewTags?: Array<'ATT' | 'CCC' | 'DDD' | 'XRX'>;
  /** Passos executados fora do Orion TN (ADR-024) */
  externalSteps?: Array<{ stepNumber: number; portal: string }>;
  /** Registros mock criados pelo auto-seed durante a rotina (ADR-021) */
  seededRecords?: SeededRecord[];
  /** Resultado do RBAC Gate executado antes do passo 1 (ADR-017) */
  privilegeGate?: PrivilegeGateResult;
  /** A rotina foi auditada com a Trava Segura de Mutação ativa (ADR-018) */
  dryRunMutations?: boolean;
  executedAt: string;
  durationSeconds: number;
  changelogPath: string;
}
