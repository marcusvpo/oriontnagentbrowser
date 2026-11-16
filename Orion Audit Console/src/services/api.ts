import type {
  ApiErrorBody, ApproveRoutinePayload, ApproveRoutineResponse, ListReviewsQuery, ListReviewsResponse,
  ListRoutinesQuery, ListRoutinesResponse, ReexecutePayload, ReexecuteResponse, RequestReviewPayload,
  RequestReviewResponse, RoutineDetail, RoutineReviewItem, UpdateReviewPayload, UpdateReviewResponse,
} from "@/types/api";

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";
export const CONTRACTS_VERSION = "2026.11-r1";

export interface ReexecuteBatchPayload { ids: string[]; modo: "headless" | "headed"; prioridade: "normal" | "alta" }
export interface ReexecuteBatchResponse { jobs: Array<ReexecuteResponse & { id: string }>; rejeitadas: Array<{ id: string; motivo: string }> }

export class ApiError extends Error {
  status: number; code: string; details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message); this.status = status; this.code = code; this.details = details;
  }
}

const TIMEOUT_MS = 15_000;

export function serializeQuery(q: Record<string, unknown>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) { v.forEach((x) => p.append(k, String(x))); continue; }
    p.append(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function request<T>(method: "GET" | "POST" | "PUT" | "PATCH", path: string, body?: unknown): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (method !== "GET") headers["Content-Type"] = "application/json";
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method, headers, signal: ctrl.signal, credentials: "omit",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      const err = (json as ApiErrorBody | undefined)?.error;
      throw new ApiError(res.status, err?.code ?? "http_error", err?.message ?? `Erro HTTP ${res.status}`, err?.details);
    }
    return json as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if ((e as Error).name === "AbortError") throw new ApiError(0, "timeout", "Tempo de resposta excedido (15s).");
    throw new ApiError(0, "network", "Não foi possível conectar à API.");
  } finally {
    clearTimeout(timer);
  }
}

const enc = encodeURIComponent;

const realApi = {
  listRotinas: (query: ListRoutinesQuery) => request<ListRoutinesResponse>("GET", `/api/rotinas${serializeQuery(query as Record<string, unknown>)}`),
  getRotina: (id: string) => request<RoutineDetail>("GET", `/api/rotinas/${enc(id)}`),
  aprovarRotina: (id: string, payload: ApproveRoutinePayload) => request<ApproveRoutineResponse>("POST", `/api/rotinas/${enc(id)}/aprovar`, payload),
  reexecutarRotina: (id: string, payload: ReexecutePayload) => request<ReexecuteResponse>("POST", `/api/rotinas/${enc(id)}/reexecutar`, payload),
  solicitarRevisao: (id: string, payload: RequestReviewPayload) => request<RequestReviewResponse>("POST", `/api/rotinas/${enc(id)}/revisao`, payload),
  reexecutarLote: (payload: ReexecuteBatchPayload) => request<ReexecuteBatchResponse>("POST", `/api/rotinas/reexecutar-lote`, payload),
  listRevisoes: (query: ListReviewsQuery = {}) => request<ListReviewsResponse>("GET", `/api/revisoes${serializeQuery(query as Record<string, unknown>)}`),
  listRevisoesByRotina: (id: string) => request<{ data: RoutineReviewItem[] }>("GET", `/api/rotinas/${enc(id)}/revisoes`),
  updateRevisao: (reviewId: string, payload: UpdateReviewPayload) => request<UpdateReviewResponse>("PUT", `/api/revisoes/${enc(reviewId)}`, payload),
};

type Api = typeof realApi;

async function mock(): Promise<Api> {
  return (await import("@/mocks/mockApi")).mockApi;
}

export const api: Api = {
  listRotinas: async (q) => (USE_MOCK ? (await mock()).listRotinas(q) : realApi.listRotinas(q)),
  getRotina: async (id) => (USE_MOCK ? (await mock()).getRotina(id) : realApi.getRotina(id)),
  aprovarRotina: async (id, p) => (USE_MOCK ? (await mock()).aprovarRotina(id, p) : realApi.aprovarRotina(id, p)),
  reexecutarRotina: async (id, p) => (USE_MOCK ? (await mock()).reexecutarRotina(id, p) : realApi.reexecutarRotina(id, p)),
  solicitarRevisao: async (id, p) => (USE_MOCK ? (await mock()).solicitarRevisao(id, p) : realApi.solicitarRevisao(id, p)),
  reexecutarLote: async (p) => (USE_MOCK ? (await mock()).reexecutarLote(p) : realApi.reexecutarLote(p)),
  listRevisoes: async (q) => (USE_MOCK ? (await mock()).listRevisoes(q) : realApi.listRevisoes(q)),
  listRevisoesByRotina: async (id) => (USE_MOCK ? (await mock()).listRevisoesByRotina(id) : realApi.listRevisoesByRotina(id)),
  updateRevisao: async (reviewId, p) => (USE_MOCK ? (await mock()).updateRevisao(reviewId, p) : realApi.updateRevisao(reviewId, p)),
};
