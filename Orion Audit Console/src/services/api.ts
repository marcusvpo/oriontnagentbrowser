import type {
  ApiErrorBody,
  ApproveRoutinePayload,
  ApproveRoutineResponse,
  ExportReviewsPayload,
  ExportReviewsResponse,
  ListReviewsQuery,
  ListReviewsResponse,
  ListRoutinesQuery,
  ListRoutinesResponse,
  RequestReviewPayload,
  RequestReviewResponse,
  ReviewExportBatch,
  RoutineDetail,
  RoutineReviewItem,
  SaveRoutineTextPayload,
  SaveRoutineTextResponse,
  UpdateReviewPayload,
  UpdateReviewResponse,
} from "@/types/api";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.PROD
      ? ""
      : "http://localhost:3333";
export const CONTRACTS_VERSION = "2026.11-v3";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const TIMEOUT_MS = 25_000;

export function serializeQuery(q: Record<string, unknown>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      v.forEach((x) => p.append(k, String(x)));
      continue;
    }
    p.append(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH",
  path: string,
  body?: unknown,
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (method !== "GET") headers["Content-Type"] = "application/json";
    const base = API_BASE_URL.replace(/\/+$/, "");
    const res = await fetch(`${base}${path}`, {
      method,
      headers,
      signal: ctrl.signal,
      credentials: "omit",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      const err = (json as ApiErrorBody | undefined)?.error;
      throw new ApiError(
        res.status,
        err?.code ?? "http_error",
        err?.message ?? `Erro HTTP ${res.status}`,
        err?.details,
      );
    }
    return json as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if ((e as Error).name === "AbortError") {
      throw new ApiError(0, "timeout", "Tempo de resposta excedido (25s).");
    }
    throw new ApiError(0, "network", "Não foi possível conectar à API do Orion Audit.");
  } finally {
    clearTimeout(timer);
  }
}

const enc = encodeURIComponent;

const realApi = {
  listRotinas: (query: ListRoutinesQuery) =>
    request<ListRoutinesResponse>(
      "GET",
      `/api/rotinas${serializeQuery(query as Record<string, unknown>)}`,
    ),
  getRotina: (id: string) => request<RoutineDetail>("GET", `/api/rotinas/${enc(id)}`),
  aprovarRotina: (id: string, payload: ApproveRoutinePayload) =>
    request<ApproveRoutineResponse>("POST", `/api/rotinas/${enc(id)}/aprovar`, payload),
  salvarTextoRotina: (id: string, payload: SaveRoutineTextPayload) =>
    request<SaveRoutineTextResponse>("PUT", `/api/rotinas/${enc(id)}/texto`, payload),
  solicitarRevisao: (id: string, payload: RequestReviewPayload) =>
    request<RequestReviewResponse>("POST", `/api/rotinas/${enc(id)}/revisao`, payload),
  listRevisoes: (query: ListReviewsQuery = {}) =>
    request<ListReviewsResponse>(
      "GET",
      `/api/revisoes${serializeQuery(query as Record<string, unknown>)}`,
    ),
  listRevisoesByRotina: (id: string) =>
    request<{ data: RoutineReviewItem[] }>("GET", `/api/rotinas/${enc(id)}/revisoes`),
  updateRevisao: (reviewId: string, payload: UpdateReviewPayload) =>
    request<UpdateReviewResponse>("PUT", `/api/revisoes/${enc(reviewId)}`, payload),
  exportarRevisoes: (payload: ExportReviewsPayload) =>
    request<ExportReviewsResponse>("POST", `/api/revisoes/exportar`, payload),
  listLotesRevisoes: () => request<{ data: ReviewExportBatch[] }>("GET", `/api/revisoes/lotes`),
  downloadLoteRevisoes: (batchId: string, formato?: "markdown" | "json") =>
    request<ExportReviewsResponse>(
      "GET",
      `/api/revisoes/lotes/${enc(batchId)}/download${formato ? `?formato=${formato}` : ""}`,
    ),
};

type Api = typeof realApi;

async function mock(): Promise<Api> {
  return (await import("@/mocks/mockApi")).mockApi;
}

export const api: Api = {
  listRotinas: async (q) => (USE_MOCK ? (await mock()).listRotinas(q) : realApi.listRotinas(q)),
  getRotina: async (id) => (USE_MOCK ? (await mock()).getRotina(id) : realApi.getRotina(id)),
  aprovarRotina: async (id, p) =>
    USE_MOCK ? (await mock()).aprovarRotina(id, p) : realApi.aprovarRotina(id, p),
  salvarTextoRotina: async (id, p) =>
    USE_MOCK ? (await mock()).salvarTextoRotina(id, p) : realApi.salvarTextoRotina(id, p),
  solicitarRevisao: async (id, p) =>
    USE_MOCK ? (await mock()).solicitarRevisao(id, p) : realApi.solicitarRevisao(id, p),
  listRevisoes: async (q) => (USE_MOCK ? (await mock()).listRevisoes(q) : realApi.listRevisoes(q)),
  listRevisoesByRotina: async (id) =>
    USE_MOCK ? (await mock()).listRevisoesByRotina(id) : realApi.listRevisoesByRotina(id),
  updateRevisao: async (reviewId, p) =>
    USE_MOCK ? (await mock()).updateRevisao(reviewId, p) : realApi.updateRevisao(reviewId, p),
  exportarRevisoes: async (p) =>
    USE_MOCK ? (await mock()).exportarRevisoes(p) : realApi.exportarRevisoes(p),
  listLotesRevisoes: async () =>
    USE_MOCK ? (await mock()).listLotesRevisoes() : realApi.listLotesRevisoes(),
  downloadLoteRevisoes: async (batchId, fmt) =>
    USE_MOCK
      ? (await mock()).downloadLoteRevisoes(batchId, fmt)
      : realApi.downloadLoteRevisoes(batchId, fmt),
};
