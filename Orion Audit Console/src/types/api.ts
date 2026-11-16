// DTOs da API do Orion Audit Console.
import type {
  ActionType, AnnotationLayoutResult, AuditRoutineReport, DOMResolvedGeometry, ExecutedStepAction,
  ParsedRoutine, SmartLocatorDivergence, StepZonePolicy, WorkloadType
} from './audit';
export type Modulo = 'acesso' | 'caixa' | 'centrais' | 'certidoes' | 'comunicacao' | 'config'
  | 'firmas' | 'geral' | 'livros' | 'notas' | 'selos';
export type Secao = 'R' | 'V' | 'M' | 'D' | 'C';
export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type AuditStatus = AuditRoutineReport['status'];
export type AuditStatusLegacy = 'validado_com_sucesso'; // normalizar para 'validado_inalterado' na UI
/** Tags de revisão humana (ADR-021/024). Uma rotina pode ter várias: `[ATT][CCC]`. */
export type ReviewTagCode = 'ATT' | 'CCC' | 'DDD' | 'XRX';
export type RoutineAuditState = AuditStatus | 'nao_auditada';
export type GovernanceStatus = 'pendente_aprovacao' | 'aprovada' | 'revisao_solicitada';
export type RunnerJobState = 'idle' | 'na_fila' | 'em_execucao' | 'concluida' | 'falhou';
export type ReviewCategory = 'divergencia_texto' | 'print_incorreta' | 'tela_bloqueada' | 'hardware_driver' | 'outro';
export type ReviewStatus = 'aberta' | 'em_andamento' | 'resolvida' | 'arquivada';

export interface RoutineReviewVersion {
  versao: number;
  revisor: string;
  categoria: ReviewCategory;
  passos: number[];
  motivo: string;
  resolucao?: string;
  status: ReviewStatus;
  alteradoPor: string;
  notaAtualizacao?: string;
  criadoEm: string;
}

export interface RoutineReviewItem {
  id: string;
  routineId: string;
  rotinaTitulo: string;
  rotinaModulo: Modulo;
  rotinaFase: PhaseNumber | null;
  rotinaStatusAuditoria: RoutineAuditState;
  rotinaTotalPassos: number;
  revisor: string;
  categoria: ReviewCategory;
  passos: number[];
  motivo: string;
  resolucao?: string;
  status: ReviewStatus;
  versao: number;
  criadoEm: string;
  atualizadoEm: string;
  atualizadoPor: string;
  versoes: RoutineReviewVersion[];
}

export interface ListReviewsQuery {
  routineId?: string;
  status?: ReviewStatus;
  categoria?: ReviewCategory;
  modulo?: Modulo;
  q?: string;
}

export interface ListReviewsResponse {
  data: RoutineReviewItem[];
  meta: {
    total: number;
    abertas: number;
    emAndamento: number;
    resolvidas: number;
    arquivadas: number;
  };
}

export interface UpdateReviewPayload {
  revisor?: string;
  categoria?: ReviewCategory;
  passos?: number[];
  motivo?: string;
  resolucao?: string;
  status?: ReviewStatus;
  alteradoPor: string;
  notaAtualizacao?: string;
}

export interface UpdateReviewResponse {
  revisao: RoutineReviewItem;
}
/** Bloco `auditoria_ui` injetado no YAML do arquivo *-revisado.md */
export interface AuditoriaUiFrontmatter {
  data_execucao: string;               // 'YYYY-MM-DD'
  status: AuditStatus | AuditStatusLegacy;
  carga?: WorkloadType;
  worker_id?: string;                  // 'worker-1'
  versao_homologacao: string;
  ambiente?: string;
  prints_geradas: number;
  tipo_bloqueio?: string;              // só em [ATT]/[DDD]/[XRX]
  auto_cura?: {
    acionada: boolean;
    divergencias_detectadas: Array<{
      passo: number; alvo_documentado: string; elemento_real: string;
      camada: SmartLocatorDivergence['resolutionLayer']; confianca: number;
    }>;
  };
}
export interface RunnerJobInfo {
  estado: RunnerJobState; jobId?: string; lane?: WorkloadType;
  posicaoFila?: number; enfileiradoEm?: string; iniciadoEm?: string; finalizadoEm?: string; erro?: string;
}
export interface RoutineSummary {
  id: string;                          // 'M-16.2', 'C-ACESSO-05'
  titulo: string;
  modulo: Modulo;
  secao: Secao;
  fase: PhaseNumber | null;
  temVideo: boolean;
  workloadType: WorkloadType;
  statusAuditoria: RoutineAuditState;  // status PRINCIPAL (ATT/DDD/XRX têm precedência sobre CCC)
  /** ADR-024: todas as tags da rotina em ordem canônica ATT, CCC, DDD, XRX (vazio fora da revisão humana) */
  tagsRevisao?: ReviewTagCode[];
  statusGovernanca: GovernanceStatus;
  runner: RunnerJobInfo;
  pastaAuditoria: string | null;       // ex.: '[DDD] C-ACESSO-05-falha-de-conexao...' ou '[ATT][CCC] C-CENTRAL-02-...'
  totalPassos: number;
  printsGeradas: number;
  divergenciasCount: number;
  menorConfianca?: number;
  rotasHash: string[];                 // ['#/configuracoes']
  tags: string[];
  dataExecucao?: string;               // ISO
  workerId?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  updatedAt: string;                   // ISO, usado para concorrência otimista
}
export interface StepMedia {
  webpUrl?: string; pngUrl: string; rawUrl?: string;  // URLs opacas servidas pela API; nunca montar caminho no front
  width: number; height: number;                     // tamanho natural (1440x900 em DPR 1)
  webpBytes?: number; pngBytes?: number;
}
export interface GeometryInvariantResult {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  nome: 'confinamento' | 'zero_auto_oclusao' | 'zero_colisao_badge_rotulo' | 'variancia_estrutural'
      | 'paridade_artefatos' | 'zona_semantica' | 'uniao_geometrica' | 'multi_demarcacao';
  aprovado: boolean; detalhe?: string;
  /** Falso quando o invariante não se aplica à print (print limpa, alvo único no 8...) */
  aplicavel?: boolean;
}
/** Sub-captura de um passo (`passo-NN-b.png`...): estado após a ação ou revelado por um gatilho (ADR-018). */
export interface StepSubCapture {
  frame: string; printName: string;
  kind?: 'post-action' | 'trigger' | 'reveal' | 'step';
  media: StepMedia;
  domGeometry?: DOMResolvedGeometry;
  layoutResult?: AnnotationLayoutResult;
  callouts?: Array<{ index: number; label: string }>;
  revealTrigger?: { kind: string; label: string; directed: boolean };
  invariantes?: GeometryInvariantResult[];
}
export interface StepView {
  stepNumber: number;
  actionType: ActionType;
  zonePolicy?: StepZonePolicy;
  targets: string[];
  originalText: string;
  validatedText: string;
  isModified: boolean;
  status: 'ok' | 'modified' | 'blocked' | 'nao_executado';
  /** ADR-024: `external_portal` = passo fora do Orion TN, sem print por desenho (não é erro de paridade) */
  stepScope?: 'orion_tn' | 'external_portal';
  portalExterno?: string;
  media: StepMedia | null;
  /** Sub-capturas na ordem (b, c...). Vazio quando o passo tem uma só print */
  subCapturas?: StepSubCapture[];
  domGeometry?: DOMResolvedGeometry;
  layoutResult?: AnnotationLayoutResult;
  divergence?: SmartLocatorDivergence;
  executedAction?: ExecutedStepAction;
  invariantes?: GeometryInvariantResult[];
  errorMessage?: string;
}
export interface GovernanceEvent {
  id: string;
  tipo: 'auditoria_executada' | 'aprovada' | 'texto_editado' | 'revisao_solicitada' | 'reexecucao_enfileirada' | 'reexecucao_concluida' | 'reexecucao_falhou';
  autor: string;                       // 'runner' ou o nome do revisor
  em: string;                          // ISO
  descricao: string;
  meta?: Record<string, unknown>;
}
export interface RoutineDetail {
  summary: RoutineSummary;
  original: ParsedRoutine;             // manual original da base
  report: AuditRoutineReport | null;   // null se nao_auditada
  auditoriaUi: AuditoriaUiFrontmatter | null;
  steps: StepView[];
  frontmatterOriginalYaml: string;
  frontmatterRevisadoYaml: string;
  markdownRevisado: string;            // conteúdo do *-revisado.md com marcadores [aqui vai a print "passo-NN.png"]
  bloqueio?: { tipo: string; motivo: string; roteiroManual: string[] };
  /** ADR-024: passos de portal externo aceitos sem `passo-NN.png`; `issues` = discrepâncias reais (print em passo externo...) */
  passosExternos?: { steps: number[]; issues: string[] };
  historico: GovernanceEvent[];
  revisoes?: RoutineReviewItem[];
}
export interface PhaseStats {
  fase: PhaseNumber | null; titulo: string; total: number; auditadas: number;
  porStatus: Record<RoutineAuditState, number>;
}
export interface DashboardStats {
  totalRotinas: number; auditadas: number; naoAuditadas: number; aprovadas: number;
  taxaAprovacao: number;               // 0..1 (aprovadas / auditadas)
  autoCuradas: number; bloqueadas: number;
  porFase: PhaseStats[];
  porCarga: Record<WorkloadType, number>;
  porModulo: Array<{ modulo: Modulo; total: number; auditadas: number }>;
  porCamadaDivergencia: Record<string, number>;
  filaRunner: { read_only: number; mutation: number; emExecucao: number };
  atividadeRecente: Array<GovernanceEvent & { rotinaId: string }>;
}
export interface ListRoutinesQuery {
  fase?: PhaseNumber | 'sem_fase';
  modulo?: Modulo[];
  secao?: Secao[];
  statusAuditoria?: RoutineAuditState[];
  statusGovernanca?: GovernanceStatus[];
  /** Filtro por tag (ADR-024): casa a tag principal E as adicionais ([CCC] encontra `[ATT][CCC]`) */
  tagRevisao?: ReviewTagCode[];
  carga?: WorkloadType;
  temVideo?: boolean;
  comDivergencias?: boolean;
  q?: string;                          // texto livre; se começar com '#/', busca em rotasHash
  page?: number;                       // padrão 1
  pageSize?: number;                   // padrão 25
  sort?: 'id' | 'titulo' | 'dataExecucao' | 'divergenciasCount' | 'menorConfianca';
  order?: 'asc' | 'desc';
}
export interface ListRoutinesResponse {
  data: RoutineSummary[];
  meta: { total: number; page: number; pageSize: number; stats: DashboardStats };
}
export interface ApproveRoutinePayload {
  revisor: string;
  comentario?: string;
  descricao?: string;                                       // descrição editada
  edicoes?: Array<{ stepNumber: number; validatedText: string }>;
  confirmacaoManual?: boolean;                              // obrigatório se [ATT]/[DDD]/[XRX]
  baseUpdatedAt: string;                                    // updatedAt lido; 409 se divergir
}
export interface ApproveRoutineResponse { rotina: RoutineDetail; evento: GovernanceEvent; }
export interface RequestReviewPayload {
  revisor: string; categoria: ReviewCategory; motivo: string; passos?: number[];
}
export interface RequestReviewResponse { rotina: RoutineDetail; evento: GovernanceEvent; revisao?: RoutineReviewItem; }
export interface ReexecutePayload {
  solicitante: string;
  motivo?: string;
  passos?: number[];                   // vazio/ausente = todos
  modo: 'headless' | 'headed';
  prioridade: 'normal' | 'alta';
  lane?: WorkloadType;                 // padrão: workloadType da rotina
}
export interface ReexecuteResponse {
  jobId: string; lane: WorkloadType; posicaoFila: number;
  estimativaSegundos: number; enfileiradoEm: string;
}
export interface ApiErrorBody { error: { code: string; message: string; details?: unknown } }
