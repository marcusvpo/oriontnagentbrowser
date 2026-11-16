import type {
  ApproveRoutinePayload, ApproveRoutineResponse, DashboardStats, GovernanceEvent, ListReviewsQuery, ListReviewsResponse,
  ListRoutinesQuery, ListRoutinesResponse, ReexecutePayload, ReexecuteResponse, RequestReviewPayload,
  RequestReviewResponse, RoutineDetail, RoutineReviewItem, UpdateReviewPayload, UpdateReviewResponse,
} from "@/types/api";
import { ApiError, type ReexecuteBatchPayload, type ReexecuteBatchResponse } from "@/services/api";
import { isReviewState, reviewPrefix, tagsOfSummary } from "@/lib/status";
import { buildRotinas } from "./rotinas.mock";
import { baseStats } from "./stats.mock";

let store: Map<string, RoutineDetail> | null = null;
const db = () => (store ??= new Map(buildRotinas().map((r) => [r.summary.id, r])));
const clone = <T,>(v: T): T => structuredClone(v);
const delay = () => new Promise((r) => setTimeout(r, 250 + Math.random() * 350));
const now = () => new Date().toISOString();
let evSeq = 1000;
let jobSeq = 0x7f400;
let revSeq = 100;
const reviewsMap = new Map<string, RoutineReviewItem>();

function get(id: string): RoutineDetail {
  const r = db().get(id);
  if (!r) throw new ApiError(404, "not_found", `Rotina ${id} não encontrada.`);
  return r;
}

function addEvent(r: RoutineDetail, e: Omit<GovernanceEvent, "id" | "em">): GovernanceEvent {
  const ev: GovernanceEvent = { ...e, id: `ev-${++evSeq}`, em: now() };
  r.historico.unshift(ev);
  r.summary.updatedAt = ev.em;
  return ev;
}

function queueLength(lane: string) {
  return [...db().values()].filter((r) => r.summary.runner.lane === lane && (r.summary.runner.estado === "na_fila" || r.summary.runner.estado === "em_execucao")).length;
}

function stats(): DashboardStats {
  const all = [...db().values()];
  const ativos = all.filter((r) => r.summary.runner.estado === "na_fila" || r.summary.runner.estado === "em_execucao");
  return {
    ...clone(baseStats),
    filaRunner: {
      read_only: ativos.filter((r) => r.summary.runner.lane === "read_only").length,
      mutation: ativos.filter((r) => r.summary.runner.lane === "mutation").length,
      emExecucao: ativos.filter((r) => r.summary.runner.estado === "em_execucao").length,
    },
    atividadeRecente: all.flatMap((r) => r.historico.map((e) => ({ ...e, rotinaId: r.summary.id })))
      .sort((a, b) => b.em.localeCompare(a.em)).slice(0, 8),
  };
}

function simulateRunner(id: string) {
  setTimeout(() => {
    const r = db().get(id); if (!r || r.summary.runner.estado !== "na_fila") return;
    r.summary.runner = { ...r.summary.runner, estado: "em_execucao", posicaoFila: undefined, iniciadoEm: now() };
    r.summary.updatedAt = now();
  }, 6000);
  setTimeout(() => {
    const r = db().get(id); if (!r || r.summary.runner.estado !== "em_execucao") return;
    const fim = now();
    r.summary.runner = { ...r.summary.runner, estado: "concluida", finalizadoEm: fim };
    r.summary.dataExecucao = fim;
    if (r.report) r.report.executedAt = fim;
    addEvent(r, { tipo: "reexecucao_concluida", autor: "runner", descricao: `Reexecução concluída em ${r.summary.workerId ?? "worker-1"}.` });
  }, 14000);
}

function enqueue(r: RoutineDetail, solicitante: string, p: Pick<ReexecutePayload, "lane" | "modo" | "prioridade" | "passos" | "motivo">): ReexecuteResponse {
  const st = r.summary.runner.estado;
  if (st === "na_fila" || st === "em_execucao") throw new ApiError(409, "already_queued", "Rotina já está na fila.");
  const lane = p.lane ?? r.summary.workloadType;
  const posicaoFila = p.prioridade === "alta" ? 1 : queueLength(lane) + 1;
  const enfileiradoEm = now();
  const jobId = `job-${(++jobSeq).toString(16)}`;
  r.summary.runner = { estado: "na_fila", jobId, lane, posicaoFila, enfileiradoEm };
  addEvent(r, { tipo: "reexecucao_enfileirada", autor: solicitante, descricao: `Reexecução enfileirada na lane ${lane} (posição ${posicaoFila}, ${p.modo}, prioridade ${p.prioridade}).${p.motivo ? ` Motivo: ${p.motivo}` : ""}`, meta: { passos: p.passos ?? "todos" } });
  simulateRunner(r.summary.id);
  return { jobId, lane, posicaoFila, estimativaSegundos: 14 + posicaoFila * 20, enfileiradoEm };
}

export const mockApi = {
  async listRotinas(q: ListRoutinesQuery): Promise<ListRoutinesResponse> {
    await delay();
    let rows = [...db().values()].map((r) => r.summary);
    if (q.fase) rows = rows.filter((r) => (q.fase === "sem_fase" ? r.fase === null : r.fase === Number(q.fase)));
    if (q.modulo?.length) rows = rows.filter((r) => q.modulo!.includes(r.modulo));
    if (q.secao?.length) rows = rows.filter((r) => q.secao!.includes(r.secao));
    if (q.statusAuditoria?.length) rows = rows.filter((r) => q.statusAuditoria!.includes(r.statusAuditoria));
    if (q.statusGovernanca?.length) rows = rows.filter((r) => q.statusGovernanca!.includes(r.statusGovernanca));
    if (q.tagRevisao?.length) rows = rows.filter((r) => tagsOfSummary(r).some((t) => q.tagRevisao!.includes(t)));
    if (q.carga) rows = rows.filter((r) => r.workloadType === q.carga);
    if (q.temVideo !== undefined) rows = rows.filter((r) => r.temVideo === q.temVideo);
    if (q.comDivergencias !== undefined) rows = rows.filter((r) => (r.divergenciasCount > 0) === q.comDivergencias);
    if (q.q?.trim()) {
      const t = q.q.trim().toLowerCase();
      rows = t.startsWith("#/")
        ? rows.filter((r) => r.rotasHash.some((h) => h.toLowerCase().includes(t)))
        : rows.filter((r) => [r.id, r.titulo, reviewPrefix(r.statusAuditoria, tagsOfSummary(r)).trim(), ...r.tags, ...r.rotasHash].some((s) => s.toLowerCase().includes(t)));
    }
    const sort = q.sort ?? "id"; const dir = q.order === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      const va = a[sort] ?? ""; const vb = b[sort] ?? "";
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "pt-BR", { numeric: true })) * dir;
    });
    const page = q.page ?? 1; const pageSize = q.pageSize ?? 25;
    return { data: clone(rows.slice((page - 1) * pageSize, page * pageSize)), meta: { total: rows.length, page, pageSize, stats: stats() } };
  },

  async getRotina(id: string): Promise<RoutineDetail> {
    await delay();
    return clone(get(id));
  },

  async aprovarRotina(id: string, p: ApproveRoutinePayload): Promise<ApproveRoutineResponse> {
    await delay();
    const r = get(id);
    if (!p.revisor?.trim()) throw new ApiError(422, "validation", "Informe o revisor.");
    if (p.baseUpdatedAt !== r.summary.updatedAt) throw new ApiError(409, "conflict", "A rotina foi alterada por outra sessão. Recarregue antes de aprovar.");
    if (isReviewState(r.summary.statusAuditoria) && !p.confirmacaoManual)
      throw new ApiError(409, "manual_confirmation_required", "Confirme a validação manual antes de aprovar uma rotina em revisão ([ATT]/[DDD]/[XRX]).");
    if (p.edicoes?.some((e) => /\bvideo_id\b/.test(e.validatedText)) || (p.descricao && /\bvideo_id\b/.test(p.descricao)))
      throw new ApiError(422, "forbidden_field", "Campo proibido: video_id. Use bunny_video_id.");
    let editados = 0;
    p.edicoes?.forEach((e) => {
      const s = r.steps.find((x) => x.stepNumber === e.stepNumber);
      if (s && s.validatedText !== e.validatedText) { s.validatedText = e.validatedText; s.isModified = s.validatedText !== s.originalText; editados++; }
    });
    if (p.descricao && p.descricao !== r.original.descricao) { r.original.descricao = p.descricao; editados++; }
    if (editados) addEvent(r, { tipo: "texto_editado", autor: p.revisor, descricao: `${editados} trecho(s) editado(s) antes da aprovação.` });
    r.summary.statusGovernanca = "aprovada";
    const evento = addEvent(r, { tipo: "aprovada", autor: p.revisor, descricao: p.comentario ? `Rotina aprovada. ${p.comentario}` : "Rotina aprovada." });
    return { rotina: clone(r), evento };
  },

  async solicitarRevisao(id: string, p: RequestReviewPayload): Promise<RequestReviewResponse> {
    await delay();
    const r = get(id);
    if (!p.motivo || p.motivo.trim().length < 10) throw new ApiError(422, "validation", "O motivo precisa de pelo menos 10 caracteres.");
    const ts = now();
    const revId = `rev-${++revSeq}`;
    const passos = p.passos ?? [];
    const revisao: RoutineReviewItem = {
      id: revId,
      routineId: id,
      rotinaTitulo: r.summary.titulo,
      rotinaModulo: r.summary.modulo,
      rotinaFase: r.summary.fase,
      rotinaStatusAuditoria: r.summary.statusAuditoria,
      rotinaReviewTags: tagsOfSummary(r.summary),
      rotinaTotalPassos: r.summary.totalPassos,
      revisor: p.revisor,
      categoria: p.categoria,
      passos,
      motivo: p.motivo.trim(),
      status: "aberta",
      versao: 1,
      criadoEm: ts,
      atualizadoEm: ts,
      atualizadoPor: p.revisor,
      versoes: [{
        versao: 1, revisor: p.revisor, categoria: p.categoria, passos, motivo: p.motivo.trim(),
        status: "aberta", alteradoPor: p.revisor, notaAtualizacao: "Revisão criada", criadoEm: ts,
      }],
    };
    reviewsMap.set(revId, revisao);
    r.revisoes = [revisao, ...(r.revisoes ?? [])];
    r.summary.statusGovernanca = "revisao_solicitada";
    const evento = addEvent(r, { tipo: "revisao_solicitada", autor: p.revisor, descricao: `${p.motivo}${passos.length ? ` (passos ${passos.join(", ")})` : ""}`, meta: { categoria: p.categoria, reviewId: revId, versao: 1 } });
    return { rotina: clone(r), evento, revisao: clone(revisao) };
  },

  async reexecutarRotina(id: string, p: ReexecutePayload): Promise<ReexecuteResponse> {
    await delay();
    return enqueue(get(id), p.solicitante, p);
  },

  async reexecutarLote(p: ReexecuteBatchPayload): Promise<ReexecuteBatchResponse> {
    await delay();
    const out: ReexecuteBatchResponse = { jobs: [], rejeitadas: [] };
    for (const id of p.ids) {
      try { out.jobs.push({ id, ...enqueue(get(id), "lote", { modo: p.modo, prioridade: p.prioridade }) }); }
      catch (e) { out.rejeitadas.push({ id, motivo: (e as Error).message }); }
    }
    return out;
  },

  async listRevisoes(q: ListReviewsQuery = {}): Promise<ListReviewsResponse> {
    await delay();
    const all = [...reviewsMap.values()].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    let filtered = all;
    if (q.routineId) filtered = filtered.filter((i) => i.routineId === q.routineId);
    if (q.status) filtered = filtered.filter((i) => i.status === q.status);
    if (q.categoria) filtered = filtered.filter((i) => i.categoria === q.categoria);
    if (q.modulo) filtered = filtered.filter((i) => i.rotinaModulo === q.modulo);
    if (q.q?.trim()) {
      const t = q.q.trim().toLowerCase();
      filtered = filtered.filter((i) => [i.routineId, i.rotinaTitulo, i.motivo, i.revisor, i.resolucao ?? ""].some((s) => s.toLowerCase().includes(t)));
    }
    return {
      data: clone(filtered),
      meta: {
        total: filtered.length,
        abertas: all.filter((i) => i.status === "aberta").length,
        emAndamento: all.filter((i) => i.status === "em_andamento").length,
        resolvidas: all.filter((i) => i.status === "resolvida").length,
        arquivadas: all.filter((i) => i.status === "arquivada").length,
      },
    };
  },

  async listRevisoesByRotina(id: string): Promise<{ data: RoutineReviewItem[] }> {
    await delay();
    const list = [...reviewsMap.values()].filter((i) => i.routineId === id).sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    return { data: clone(list) };
  },

  async updateRevisao(reviewId: string, p: UpdateReviewPayload): Promise<UpdateReviewResponse> {
    await delay();
    const existing = reviewsMap.get(reviewId);
    if (!existing) throw new ApiError(404, "not_found", `Revisão ${reviewId} não encontrada.`);
    const ts = now();
    const nextVer = existing.versao + 1;
    const updated: RoutineReviewItem = {
      ...existing,
      revisor: p.revisor ?? existing.revisor,
      categoria: p.categoria ?? existing.categoria,
      passos: p.passos ?? existing.passos,
      motivo: p.motivo ?? existing.motivo,
      resolucao: p.resolucao !== undefined ? p.resolucao : existing.resolucao,
      status: p.status ?? existing.status,
      versao: nextVer,
      atualizadoEm: ts,
      atualizadoPor: p.alteradoPor,
      versoes: [
        {
          versao: nextVer,
          revisor: p.revisor ?? existing.revisor,
          categoria: p.categoria ?? existing.categoria,
          passos: p.passos ?? existing.passos,
          motivo: p.motivo ?? existing.motivo,
          resolucao: p.resolucao !== undefined ? p.resolucao : existing.resolucao,
          status: p.status ?? existing.status,
          alteradoPor: p.alteradoPor,
          notaAtualizacao: p.notaAtualizacao || `Atualizada para v${nextVer}`,
          criadoEm: ts,
        },
        ...existing.versoes,
      ],
    };
    reviewsMap.set(reviewId, updated);
    const r = db().get(existing.routineId);
    if (r) r.revisoes = (r.revisoes ?? []).map((x) => (x.id === reviewId ? updated : x));
    return { revisao: clone(updated) };
  },
};
