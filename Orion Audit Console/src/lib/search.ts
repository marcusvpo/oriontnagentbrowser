import type { GovernanceStatus, ListRoutinesQuery, Modulo, PhaseNumber, RoutineAuditState, Secao } from "@/types/api";
import type { WorkloadType } from "@/types/audit";
import { REVIEW_FILTER } from "@/lib/status";

/** Estado do Explorador na URL. Listas viram valores separados por vírgula. */
export interface RotinasSearch {
  fase?: string; modulo?: string; secao?: string; status?: string; gov?: string; carga?: string;
  video?: string; div?: string; q?: string; page?: number; sort?: string; order?: string;
}

const str = (v: unknown) => (typeof v === "string" && v !== "" ? v : typeof v === "number" ? String(v) : undefined);

export function validateRotinasSearch(raw: Record<string, unknown>): RotinasSearch {
  const page = Number(raw.page);
  return {
    fase: str(raw.fase), modulo: str(raw.modulo), secao: str(raw.secao), status: str(raw.status), gov: str(raw.gov),
    carga: str(raw.carga), video: str(raw.video), div: str(raw.div), q: str(raw.q),
    page: Number.isFinite(page) && page > 1 ? page : undefined, sort: str(raw.sort), order: str(raw.order),
  };
}

const list = <T extends string>(v?: string) => (v ? (v.split(",").filter(Boolean) as T[]) : undefined);

export function toListQuery(s: RotinasSearch, pageSize = 25): ListRoutinesQuery {
  return {
    fase: s.fase ? (s.fase === "sem_fase" ? "sem_fase" : (Number(s.fase) as PhaseNumber)) : undefined,
    modulo: list<Modulo>(s.modulo), secao: list<Secao>(s.secao),
    statusAuditoria: list<RoutineAuditState>(s.status), statusGovernanca: list<GovernanceStatus>(s.gov),
    carga: s.carga as WorkloadType | undefined,
    temVideo: s.video ? s.video === "true" : undefined, comDivergencias: s.div ? s.div === "true" : undefined,
    q: s.q, page: s.page ?? 1, pageSize,
    sort: s.sort as ListRoutinesQuery["sort"], order: s.order as ListRoutinesQuery["order"],
  };
}

export const PRESETS: Array<{ key: string; label: string; search: RotinasSearch }> = [
  { key: "triagem", label: "Triagem Pendente", search: { status: `validado_com_ajustes,${REVIEW_FILTER}`, gov: "pendente_aprovacao" } },
  { key: "criticos", label: "Em revisão [ATT][DDD][XRX]", search: { status: REVIEW_FILTER } },
  { key: "f6", label: "Fase 6 Prontas", search: { gov: "aprovada" } },
];
