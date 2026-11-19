import type {
  CurationStage,
  GovernanceStatus,
  ListRoutinesQuery,
  Modulo,
  PhaseNumber,
  ReviewIngestionState,
  ReviewTagCode,
  RoutineAuditState,
  Secao,
} from "@/types/api";

/** Estado do Explorador na URL. Listas viram valores separados por vírgula. */
export interface RotinasSearch {
  fase?: string;
  modulo?: string;
  secao?: string;
  status?: string;
  gov?: string;
  /** ADR-024: filtro por tag (ATT,CCC,DDD,XRX), que enxerga também as tags adicionais de uma rotina multi-tag */
  tag?: string;
  /** ADR-036: ciclo de ingestão de revisões (pendente_exportacao, ingerida_pelo_agente, sem_revisoes) */
  ingestao?: string;
  /** ADR-036: estágio humano de curadoria (partição exata do funil do Dashboard) */
  estagio?: string;
  video?: string;
  div?: string;
  q?: string;
  page?: number;
  sort?: string;
  order?: string;
}

const str = (v: unknown) =>
  typeof v === "string" && v !== "" ? v : typeof v === "number" ? String(v) : undefined;

export function validateRotinasSearch(raw: Record<string, unknown>): RotinasSearch {
  const page = Number(raw.page);
  return {
    fase: str(raw.fase),
    modulo: str(raw.modulo),
    secao: str(raw.secao),
    status: str(raw.status),
    gov: str(raw.gov),
    tag: str(raw.tag),
    ingestao: str(raw.ingestao),
    estagio: str(raw.estagio),
    video: str(raw.video),
    div: str(raw.div),
    q: str(raw.q),
    page: Number.isFinite(page) && page > 1 ? page : undefined,
    sort: str(raw.sort),
    order: str(raw.order),
  };
}

const list = <T extends string>(v?: string) => (v ? (v.split(",").filter(Boolean) as T[]) : undefined);

export function toListQuery(s: RotinasSearch, pageSize = 25): ListRoutinesQuery {
  return {
    fase: s.fase ? (s.fase === "sem_fase" ? "sem_fase" : (Number(s.fase) as PhaseNumber)) : undefined,
    modulo: list<Modulo>(s.modulo),
    secao: list<Secao>(s.secao),
    statusAuditoria: list<RoutineAuditState>(s.status),
    statusGovernanca: list<GovernanceStatus>(s.gov),
    tagRevisao: list<ReviewTagCode>(s.tag),
    ingestao: list<ReviewIngestionState>(s.ingestao),
    estagio: s.estagio as CurationStage | undefined,
    temVideo: s.video ? s.video === "true" : undefined,
    comDivergencias: s.div ? s.div === "true" : undefined,
    q: s.q,
    page: s.page ?? 1,
    pageSize,
    sort: s.sort as ListRoutinesQuery["sort"],
    order: s.order as ListRoutinesQuery["order"],
  };
}

export const PRESETS: Array<{ key: string; label: string; accent?: "ingested" | "approved" | "pending"; search: RotinasSearch }> = [
  { key: "apoio_humano", label: "Apoio humano", search: { estagio: "apoio_humano" } },
  { key: "prontas_conferencia", label: "Prontas p/ conferir", search: { estagio: "prontas_conferencia" } },
  { key: "revisao_pendente", label: "Pendentes p/ agente", accent: "pending", search: { estagio: "revisao_pendente" } },
  { key: "ingeridas_agente", label: "Ingeridas p/ agente", accent: "ingested", search: { ingestao: "ingerida_pelo_agente" } },
  { key: "aprovadas_kb", label: "Aprovadas p/ KB", accent: "approved", search: { estagio: "aprovadas_kb" } },
];
