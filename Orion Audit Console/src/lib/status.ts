import { CheckCircle2, CircleDashed, Database, DatabaseZap, Eye, FileWarning, Flag, GitBranch, Loader2, ShieldCheck, Wand2, XCircle, Clock, CheckCheck, type LucideIcon } from "lucide-react";
import type { BadgeStatus } from "@/design-system/orion-audit-console---design-system-bdbb01/design-system/components/Badge";
import type { GovernanceStatus, RoutineAuditState, RunnerJobState, AuditStatusLegacy } from "@/types/api";
import type { WorkloadType } from "@/types/audit";

export interface StatusMeta { label: string; tone: BadgeStatus; icon: LucideIcon; description: string }

/** Os 3 status de revisão humana (ADR-021), que substituem o antigo `requer_revisao_humana` / `[!!!]`. */
export const REVIEW_STATES = ["atualizacao_editorial", "dependencia_dados_banco", "dependencia_cruzada_rotina"] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];
export const REVIEW_TAG: Record<ReviewState, "ATT" | "DDD" | "XRX"> = {
  atualizacao_editorial: "ATT",
  dependencia_dados_banco: "DDD",
  dependencia_cruzada_rotina: "XRX",
};
export const isReviewState = (s: string | null | undefined): s is ReviewState => !!s && (REVIEW_STATES as readonly string[]).includes(s);
/** Prefixo de exibição `[ATT] `, `[DDD] ` ou `[XRX] ` (vazio fora da revisão humana). */
export const reviewPrefix = (s: string | null | undefined): string => (isReviewState(s) ? `[${REVIEW_TAG[s]}] ` : "");
/** Filtro de busca que reúne os 3 status de revisão humana. */
export const REVIEW_FILTER = REVIEW_STATES.join(",");

/** Normaliza o status legado 'validado_com_sucesso' → 'validado_inalterado' e 'requer_revisao_humana' ([!!!]) → [ATT]. */
export function normalizeAudit(s: RoutineAuditState | AuditStatusLegacy | string): RoutineAuditState {
  if (s === "validado_com_sucesso") return "validado_inalterado";
  if (s === "requer_revisao_humana") return "atualizacao_editorial";
  return s as RoutineAuditState;
}

export const AUDIT_STATUS: Record<RoutineAuditState, StatusMeta> = {
  validado_inalterado: { label: "Validado", tone: "passed", icon: CheckCircle2, description: "O manual confere com a tela sem ajustes." },
  validado_com_ajustes: { label: "Auto-curada", tone: "warning", icon: Wand2, description: "Divergências corrigidas automaticamente pelo localizador." },
  atualizacao_editorial: { label: "[ATT] Atualização editorial", tone: "warning", icon: FileWarning, description: "O manual cita tela, caminho, botão ou campo que não existe na versão atual. Exige revisão editorial humana." },
  dependencia_dados_banco: { label: "[DDD] Dependência de dados", tone: "failed", icon: Database, description: "Faltam registros no banco de homologação (ou o ambiente/hardware não permite validar). Exige a equipe de Produtos." },
  dependencia_cruzada_rotina: { label: "[XRX] Dependência cruzada", tone: "neutral", icon: GitBranch, description: "Depende da execução prévia de outra rotina que cria os registros necessários." },
  nao_auditada: { label: "Não auditada", tone: "neutral", icon: CircleDashed, description: "Ainda não passou pelo runner." },
};

export const GOV_STATUS: Record<GovernanceStatus, StatusMeta> = {
  pendente_aprovacao: { label: "Pendente", tone: "neutral", icon: Clock, description: "Aguardando decisão de um revisor." },
  aprovada: { label: "Aprovada", tone: "passed", icon: ShieldCheck, description: "Aprovada por um revisor humano." },
  revisao_solicitada: { label: "Revisão solicitada", tone: "warning", icon: Flag, description: "Um revisor pediu correção." },
};

export const RUNNER_STATUS: Record<RunnerJobState, StatusMeta> = {
  idle: { label: "Ocioso", tone: "neutral", icon: CircleDashed, description: "" },
  na_fila: { label: "Na fila", tone: "running", icon: Clock, description: "Aguardando worker livre." },
  em_execucao: { label: "Em execução", tone: "running", icon: Loader2, description: "Runner executando agora." },
  concluida: { label: "Concluída", tone: "passed", icon: CheckCheck, description: "Última reexecução concluída." },
  falhou: { label: "Falhou", tone: "failed", icon: XCircle, description: "A última reexecução falhou." },
};

export const WORKLOAD: Record<WorkloadType, { label: string; icon: LucideIcon; description: string }> = {
  read_only: { label: "READ_ONLY", icon: Eye, description: "Consulta — roda em paralelo (4–6 workers)." },
  mutation: { label: "MUTATION", icon: DatabaseZap, description: "Gravação — roda serializada (semáforo restrito)." },
};

export const MODULOS = ["acesso", "caixa", "centrais", "certidoes", "comunicacao", "config", "firmas", "geral", "livros", "notas", "selos"] as const;
export const MODULO_LABEL: Record<string, string> = {
  acesso: "Acesso",
  caixa: "Caixa",
  centrais: "Centrais",
  certidoes: "Certidões",
  comunicacao: "Comunicação",
  config: "Configurações",
  firmas: "Firmas",
  geral: "Geral",
  livros: "Livros",
  notas: "Notas",
  selos: "Selos",
};
export const SECOES = ["R", "V", "M", "D", "C"] as const;
export const SECAO_LABEL: Record<string, string> = { R: "Rotina", V: "Vídeo", M: "Manual", D: "Dica", C: "Contingência" };
export const CAMADA_LABEL: Record<string, string> = { dom_synonym_heuristic: "Sinônimo DOM", a11y_fuzzy_match: "Fuzzy a11y", llm_a11y_fallback: "Fallback LLM", menu_path_resolution: "Rota de menu", target_not_found: "Alvo não localizado", permission_blocked: "Bloqueado para o perfil", investigative_reveal: "Exploração investigativa" };

export function confidenceTone(c: number): BadgeStatus {
  return c >= 0.85 ? "passed" : c >= 0.7 ? "warning" : "failed";
}
