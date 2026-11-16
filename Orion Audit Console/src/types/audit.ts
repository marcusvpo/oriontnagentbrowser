// Espelho exato dos dados do backend — não alterar nomes nem tipos.
export interface BoundingBox { x: number; y: number; width: number; height: number; }
export type ActionType = 'click' | 'fill' | 'search' | 'select' | 'check' | 'navigate' | 'verify';
export type AnchorPlacement = 'top' | 'bottom' | 'right' | 'left' | 'auto';
/** read_only: consultas (4-6 workers) | mutation: gravações (semáforo restrito) */
export type WorkloadType = 'read_only' | 'mutation';
export interface Point { x: number; y: number; }
export interface DOMViewportMetrics { width: number; height: number; devicePixelRatio: number; scrollX: number; scrollY: number; }
export interface DOMElementContext {
  tagName: string; role?: string; innerText?: string;
  isTopNav?: boolean; isVerticalSidebar?: boolean; isDropdownItem?: boolean; isModal?: boolean;
  iframeOffset?: Point; neighborBoxes?: BoundingBox[];
}
export type SemanticZone = 'content' | 'any';
export type StepZonePolicy = SemanticZone | 'content-preferred';
export interface DOMGroupMember { query: string; matchedSelector: string; innerText: string; cssBox: BoundingBox; }
export interface DOMActionNode { tagName: string; text: string; box: BoundingBox; insideNavZone: boolean; }
export interface DOMActionTarget { clickSelector: string; click: DOMActionNode; fillSelector?: string; fill?: DOMActionNode; }
export interface DOMResolvedGeometry {
  cssBox: BoundingBox; viewport: DOMViewportMetrics; context: DOMElementContext;
  matchedSelector: string; url: string; capturedAt: string;
  zone?: SemanticZone; zonePolicy?: StepZonePolicy;
  contentRoot?: { selector: string; strategy: string; box: BoundingBox };
  lateralNavBoxes?: BoundingBox[];
  groupMembers?: DOMGroupMember[]; groupUnionBox?: BoundingBox; unresolvedGroupTargets?: string[];
  clippedToViewport?: boolean; actionTarget?: DOMActionTarget;
}
export interface ExecutedStepAction {
  kind: 'click' | 'fill' | 'none';
  via: 'measured-node' | 'a11y-ref' | 'skipped' | 'dry-run';
  /** Comando de gravação cujo clique foi omitido pela Trava Segura de Mutação (ADR-018) */
  commitLabel?: string;
  selector?: string; node?: DOMActionNode; zone?: SemanticZone; reason?: string;
}
export interface SmartLocatorDivergence {
  stepNumber: number;
  documentedTarget: string;
  actualElementText: string;
  actualRole?: string;
  matchedRef?: string;
  resolutionLayer: 'dom_synonym_heuristic' | 'a11y_fuzzy_match' | 'llm_a11y_fallback' | 'menu_path_resolution' | 'target_not_found' | 'permission_blocked' | 'investigative_reveal';
  confidence: number; // 0..1
  reason: string;
  detectedAt: string; // ISO
}
export interface SmartLocatorResult {
  found: boolean; healed: boolean; geometry: DOMResolvedGeometry | null;
  matchedTargetName: string; matchedRef?: string; divergence?: SmartLocatorDivergence;
}
export interface AnnotationLayoutResult {
  targetBox: BoundingBox; badgeBox: BoundingBox; labelBox?: BoundingBox;
  placement: Exclude<AnchorPlacement, 'auto'>;
  scaleX: number; scaleY: number;
  selfOcclusionArea: number; // deve ser 0
}
export interface RoutineStep {
  stepNumber: number; rawText: string;
  targets: string[]; // elementos de UI em **negrito**
  actionType: ActionType; subItems?: string[]; zone?: StepZonePolicy;
}
export interface ParsedRoutine {
  id: string; titulo: string; modulo: string; secao: string; tem_video: boolean;
  workloadType?: WorkloadType; frontmatter: Record<string, any>;
  descricao: string; steps: RoutineStep[]; observacoes: string[]; rawContent: string;
}
export interface AuditStepResult {
  stepNumber: number; originalText: string; validatedText: string; isModified: boolean;
  screenshotRawPath: string; screenshotAnnotatedPath: string; screenshotWebpPath?: string; // caminhos internos do servidor: o front NÃO os usa
  boundingBox?: BoundingBox; domGeometry?: DOMResolvedGeometry; layoutResult?: AnnotationLayoutResult;
  divergence?: SmartLocatorDivergence; executedAction?: ExecutedStepAction;
  status: 'ok' | 'modified' | 'blocked'; errorMessage?: string;
}
export interface AuditRoutineReport {
  id: string; modulo: string; titulo: string; workloadType?: WorkloadType; workerSessionId?: string;
  // ADR-021: [ATT] atualizacao_editorial | [DDD] dependencia_dados_banco | [XRX] dependencia_cruzada_rotina
  status: 'validado_inalterado' | 'validado_com_ajustes' | 'atualizacao_editorial' | 'dependencia_dados_banco' | 'dependencia_cruzada_rotina';
  steps: AuditStepResult[]; divergences?: SmartLocatorDivergence[];
  executedAt: string; durationSeconds: number; changelogPath: string;
}
