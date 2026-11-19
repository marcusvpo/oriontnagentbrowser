import {
  CheckCircle2,
  CircleDashed,
  Clock,
  Database,
  ExternalLink,
  FileCheck2,
  FileWarning,
  Flag,
  GitBranch,
  Send,
  ShieldCheck,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { BadgeStatus } from "@/design-system/orion-audit-console---design-system-bdbb01/design-system/components/Badge";
import type {
  AuditStatusLegacy,
  CurationStage,
  GovernanceStatus,
  ReviewIngestionState,
  ReviewTagCode,
  RoutineAuditState,
  RoutineSummary,
} from "@/types/api";

export interface StatusMeta {
  label: string;
  tone: BadgeStatus;
  icon: LucideIcon;
  description: string;
  extraClass?: string;
}

/** Os 4 status de revisão humana (ADR-021 + [CCC] da ADR-024), que substituem o antigo `requer_revisao_humana` / `[!!!]`. */
export const REVIEW_STATES = [
  "atualizacao_editorial",
  "comunicacao_externa",
  "dependencia_dados_banco",
  "dependencia_cruzada_rotina",
] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];
export const REVIEW_TAG: Record<ReviewState, ReviewTagCode> = {
  atualizacao_editorial: "ATT",
  comunicacao_externa: "CCC",
  dependencia_dados_banco: "DDD",
  dependencia_cruzada_rotina: "XRX",
};
/** Ordem canônica das tags no nome da pasta e nos badges (ADR-024). */
export const REVIEW_TAG_ORDER: readonly ReviewTagCode[] = ["ATT", "CCC", "DDD", "XRX"];
export const REVIEW_TAG_LABEL: Record<ReviewTagCode, string> = {
  ATT: "Atualização editorial",
  CCC: "Comunicação externa",
  DDD: "Dependência de dados",
  XRX: "Dependência cruzada",
};
export const REVIEW_TAG_STATE: Record<ReviewTagCode, ReviewState> = {
  ATT: "atualizacao_editorial",
  CCC: "comunicacao_externa",
  DDD: "dependencia_dados_banco",
  XRX: "dependencia_cruzada_rotina",
};
export const REVIEW_TAG_META: Record<
  ReviewTagCode,
  StatusMeta & { tag: ReviewTagCode; shortLabel: string }
> = {
  ATT: {
    tag: "ATT",
    shortLabel: "[ATT]",
    label: "[ATT] Atualização editorial",
    tone: "warning",
    icon: FileWarning,
    description:
      "O manual cita tela, caminho, botão ou campo diferente na versão atual. Exige avaliação humana.",
  },
  CCC: {
    tag: "CCC",
    shortLabel: "[CCC]",
    label: "[CCC] Comunicação externa",
    tone: "neutral",
    extraClass: "ds-badge--external",
    icon: ExternalLink,
    description:
      "Parte do passo a passo ocorre em portal externo ao Orion TN (SISCOAF, e-Notariado, CENSEC, Receita...). Validação humana.",
  },
  DDD: {
    tag: "DDD",
    shortLabel: "[DDD]",
    label: "[DDD] Dependência de dados",
    tone: "failed",
    icon: Database,
    description:
      "Faltam registros no banco de homologação (ou o ambiente/hardware não permite validar). Exige apoio de Produtos.",
  },
  XRX: {
    tag: "XRX",
    shortLabel: "[XRX]",
    label: "[XRX] Dependência cruzada",
    tone: "neutral",
    icon: GitBranch,
    description: "Depende da execução prévia de outra rotina que cria os registros necessários.",
  },
};
export const isReviewState = (s: string | null | undefined): s is ReviewState =>
  !!s && (REVIEW_STATES as readonly string[]).includes(s);

/** Normaliza uma lista de tags para a ordem canônica, sem duplicatas nem valores desconhecidos. */
export const sortTags = (tags: ReadonlyArray<string> | null | undefined): ReviewTagCode[] =>
  REVIEW_TAG_ORDER.filter((t) =>
    (tags ?? []).map((x) => String(x).replace(/[[\]\s]/g, "").toUpperCase()).includes(t),
  );

/** Tags de uma rotina: a lista completa quando existe; senão, a única tag do status principal (legado). */
export const tagsOf = (
  status: string | null | undefined,
  tags?: ReadonlyArray<string> | null,
): ReviewTagCode[] => {
  const full = sortTags(tags);
  if (full.length > 0) return full;
  return isReviewState(status) ? [REVIEW_TAG[status]] : [];
};

/** Extrai tags de revisão de um resumo da API aceitando `reviewTags` (preferencial) ou `tagsRevisao`. */
export const tagsOfSummary = (
  s?: {
    statusAuditoria?: string | null;
    reviewTags?: ReadonlyArray<string> | null;
    tagsRevisao?: ReadonlyArray<string> | null;
  } | null,
): ReviewTagCode[] => {
  if (!s) return [];
  const merged = sortTags([...(s.reviewTags ?? []), ...(s.tagsRevisao ?? [])]);
  return tagsOf(s.statusAuditoria, merged);
};

/** Prefixo de exibição na ordem canônica e sem espaço entre colchetes: `[ATT][CCC] ` (vazio fora da revisão humana). */
export const reviewPrefix = (
  s: string | null | undefined,
  tags?: ReadonlyArray<string> | null,
): string => {
  const list = tagsOf(s, tags);
  return list.length > 0 ? `${list.map((t) => `[${t}]`).join("")} ` : "";
};

/** Filtro de busca que reúne os 4 status de revisão humana. */
export const REVIEW_FILTER = REVIEW_STATES.join(",");

/** Normaliza o status legado 'validado_com_sucesso' → 'validado_inalterado' e 'requer_revisao_humana' ([!!!]) → [ATT]. */
export function normalizeAudit(s: RoutineAuditState | AuditStatusLegacy | string): RoutineAuditState {
  if (s === "validado_com_sucesso") return "validado_inalterado";
  if (s === "requer_revisao_humana") return "atualizacao_editorial";
  return s as RoutineAuditState;
}

export const AUDIT_STATUS: Record<RoutineAuditState, StatusMeta> = {
  validado_inalterado: {
    label: "Validado",
    tone: "passed",
    icon: CheckCircle2,
    description: "O manual confere com a tela sem ajustes.",
  },
  validado_com_ajustes: {
    label: "Auto-curada",
    tone: "warning",
    icon: Wand2,
    description: "Divergências de rótulo ajustadas automaticamente pelo motor.",
  },
  atualizacao_editorial: {
    label: "[ATT] Atualização editorial",
    tone: "warning",
    icon: FileWarning,
    description:
      "O manual cita tela, caminho, botão ou campo diferente na versão atual. Exige revisão editorial humana.",
  },
  comunicacao_externa: {
    label: "[CCC] Comunicação externa",
    tone: "neutral",
    extraClass: "ds-badge--external",
    icon: ExternalLink,
    description:
      "Parte do passo a passo ocorre em portal externo ao Orion TN. Etapas internas auditadas; etapas externas exigem conferência humana.",
  },
  dependencia_dados_banco: {
    label: "[DDD] Dependência de dados",
    tone: "failed",
    icon: Database,
    description:
      "Faltam registros no banco de homologação (ou o ambiente/hardware não permite validar). Exige apoio de Produtos.",
  },
  dependencia_cruzada_rotina: {
    label: "[XRX] Dependência cruzada",
    tone: "neutral",
    icon: GitBranch,
    description: "Depende da execução prévia de outra rotina que cria os registros necessários.",
  },
  nao_auditada: {
    label: "Não auditada",
    tone: "neutral",
    icon: CircleDashed,
    description: "Ainda não passou pela auditoria local do motor.",
  },
};

export const GOV_STATUS: Record<GovernanceStatus, StatusMeta> = {
  pendente_aprovacao: {
    label: "Aguardando aprovação",
    tone: "neutral",
    icon: Clock,
    description: "Aguardando conferência e aprovação para a base do assistente.",
  },
  aprovada: {
    label: "Aprovada p/ Base KB",
    tone: "passed",
    icon: ShieldCheck,
    description: "Passo a passo e prints 100% aprovados para subir na base de conhecimento do assistente.",
  },
  revisao_solicitada: {
    label: "Em revisão",
    tone: "warning",
    icon: Flag,
    description: "Possui revisão/observação registrada para refinamento do manual ou calibragem do motor.",
  },
};

export const INGESTION_META: Record<ReviewIngestionState, StatusMeta> = {
  sem_revisoes: {
    label: "Sem revisões",
    tone: "neutral",
    icon: CircleDashed,
    description: "Nenhuma revisão humana registrada para esta rotina.",
  },
  pendente_exportacao: {
    label: "Revisão pendente p/ agente",
    tone: "running",
    icon: Send,
    description:
      "Possui revisão humana aguardando exportação em lote para ser analisada e incorporada ao conhecimento do motor.",
  },
  ingerida_pelo_agente: {
    label: "Ingerida pelo agente",
    tone: "neutral",
    extraClass: "ds-badge--ingested",
    icon: Sparkles,
    description:
      "As revisões desta rotina já foram exportadas e ingeridas como conhecimento para calibragem do motor.",
  },
};

export const CURATION_STAGE_ORDER: readonly CurationStage[] = [
  "aprovadas_kb",
  "ingeridas_agente",
  "revisao_pendente",
  "apoio_humano",
  "prontas_conferencia",
  "nao_auditadas",
];

export const CURATION_STAGES: Record<
  CurationStage,
  {
    label: string;
    shortLabel: string;
    description: string;
    segmentClass: string;
    toneClass: string;
    icon: LucideIcon;
  }
> = {
  aprovadas_kb: {
    label: "Aprovadas p/ Base KB",
    shortLabel: "Aprovadas p/ KB",
    description: "Passo a passo e prints 100% validados e prontos para o assistente.",
    segmentClass: "seg-ok",
    toneClass: "curation-tone--approved",
    icon: ShieldCheck,
  },
  ingeridas_agente: {
    label: "Ingeridas pelo agente",
    shortLabel: "Ingeridas p/ agente",
    description: "Revisões já exportadas e consumidas na calibragem do motor.",
    segmentClass: "seg-ingested",
    toneClass: "curation-tone--ingested",
    icon: Sparkles,
  },
  revisao_pendente: {
    label: "Revisão pendente p/ agente",
    shortLabel: "Pendente exportar",
    description: "Colaboradores já registraram ajustes; prontas para o próximo lote.",
    segmentClass: "seg-pending-export",
    toneClass: "curation-tone--pending",
    icon: Send,
  },
  apoio_humano: {
    label: "Precisam de apoio humano",
    shortLabel: "Apoio humano",
    description: "Bloqueios [ATT]/[CCC]/[DDD]/[XRX] ainda sem revisão humana.",
    segmentClass: "seg-adj",
    toneClass: "curation-tone--support",
    icon: FileWarning,
  },
  prontas_conferencia: {
    label: "Prontas p/ conferência",
    shortLabel: "Prontas p/ conferir",
    description: "Validadas ou auto-ajustadas aguardando conferência e aprovação.",
    segmentClass: "seg-review-ready",
    toneClass: "curation-tone--ready",
    icon: FileCheck2,
  },
  nao_auditadas: {
    label: "Não auditadas",
    shortLabel: "Não auditadas",
    description: "Aguardando próxima rodada local do motor.",
    segmentClass: "seg-none",
    toneClass: "curation-tone--none",
    icon: CircleDashed,
  },
};

export function hasIngestedReview(s?: Pick<RoutineSummary, "revisoesConsumidasCount" | "reviewIngestionState"> | null): boolean {
  if (!s) return false;
  return (s.revisoesConsumidasCount ?? 0) > 0 || s.reviewIngestionState === "ingerida_pelo_agente";
}

export function deriveCurationStage(s: Pick<RoutineSummary, "curationStage" | "statusGovernanca" | "statusAuditoria" | "revisoesPendentesExportacao" | "revisoesConsumidasCount" | "reviewIngestionState">): CurationStage {
  if (s.curationStage) return s.curationStage;
  if (s.statusGovernanca === "aprovada") return "aprovadas_kb";
  if (s.statusAuditoria === "nao_auditada") return "nao_auditadas";
  if ((s.revisoesPendentesExportacao ?? 0) > 0 || s.reviewIngestionState === "pendente_exportacao") return "revisao_pendente";
  if ((s.revisoesConsumidasCount ?? 0) > 0 || s.reviewIngestionState === "ingerida_pelo_agente") return "ingeridas_agente";
  if (isReviewState(s.statusAuditoria)) return "apoio_humano";
  return "prontas_conferencia";
}

export const MODULOS = [
  "acesso",
  "caixa",
  "centrais",
  "certidoes",
  "comunicacao",
  "config",
  "firmas",
  "geral",
  "livros",
  "notas",
  "selos",
] as const;

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
export const SECAO_LABEL: Record<string, string> = {
  R: "Rotina",
  V: "Vídeo",
  M: "Manual",
  D: "Dica",
  C: "Contingência",
};

export const CAMADA_LABEL: Record<string, string> = {
  dom_synonym_heuristic: "Sinônimo DOM",
  a11y_fuzzy_match: "Fuzzy a11y",
  llm_a11y_fallback: "Fallback LLM",
  visual_som_fallback: "Visual SoM (2C)",
  visual_grounding_fallback: "Visual Grounding (2C)",
  menu_path_resolution: "Rota de menu",
  target_not_found: "Alvo não localizado",
  permission_blocked: "Bloqueado para o perfil",
  investigative_reveal: "Exploração investigativa",
};

export function confidenceTone(c: number): BadgeStatus {
  return c >= 0.85 ? "passed" : c >= 0.7 ? "warning" : "failed";
}
