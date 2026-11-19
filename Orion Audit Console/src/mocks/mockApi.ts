import type {
  ApproveRoutinePayload,
  ApproveRoutineResponse,
  DashboardStats,
  ExportReviewsPayload,
  ExportReviewsResponse,
  GovernanceEvent,
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
import { ApiError } from "@/services/api";
import { deriveCurationStage, isReviewState, reviewPrefix, tagsOfSummary } from "@/lib/status";
import { buildRotinas } from "./rotinas.mock";
import { baseStats } from "./stats.mock";

let store: Map<string, RoutineDetail> | null = null;
const reviewsMap = new Map<string, RoutineReviewItem>();
const batchesList: ReviewExportBatch[] = [];
let seeded = false;

const clone = <T,>(v: T): T => structuredClone(v);
const delay = () => new Promise((r) => setTimeout(r, 150 + Math.random() * 200));
const now = () => new Date().toISOString();
let evSeq = 1000;
let revSeq = 100;

function syncRoutineIngestionSummary(r: RoutineDetail) {
  const revs = [...reviewsMap.values()].filter((x) => x.routineId === r.summary.id);
  r.revisoes = revs.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  const pendentes = revs.filter((x) => x.pendenteExportacao).length;
  const consumidas = revs.filter((x) => x.consumidaPeloAgente).length;
  const lastConsumed = revs
    .filter((x) => x.consumidaPeloAgente && x.consumidaEm)
    .sort((a, b) => (b.consumidaEm ?? "").localeCompare(a.consumidaEm ?? ""))[0];

  r.summary.revisoesCount = revs.length;
  r.summary.revisoesPendentesExportacao = pendentes;
  r.summary.revisoesConsumidasCount = consumidas;
  r.summary.temNovaRevisaoPosIngestao = consumidas > 0 && pendentes > 0;
  r.summary.reviewIngestionState =
    pendentes > 0 ? "pendente_exportacao" : consumidas > 0 ? "ingerida_pelo_agente" : "sem_revisoes";
  r.summary.ultimaIngestaoEm = lastConsumed?.consumidaEm;
  r.summary.ultimoLoteIngestaoId = lastConsumed?.loteExportacaoId;
  r.summary.ultimaIngestaoPor = lastConsumed?.consumidaPor;
  r.summary.curationStage = deriveCurationStage({ ...r.summary, curationStage: undefined });
}

function db() {
  if (!store) {
    store = new Map(buildRotinas().map((r) => [r.summary.id, r]));
  }
  if (!seeded) {
    seeded = true;
    const all = [...store.values()];
    const first = all[0];
    const second = all[1];
    if (first) {
      const batchId = "lote-2026-11-18-demo";
      const ts = "2026-11-18T17:30:00.000Z";
      batchesList.push({
        id: batchId,
        operador: "Marcus",
        formato: "markdown",
        nota: "Lote inicial de calibragem (mock)",
        reviewIds: ["rev-seed-1"],
        routineIds: [first.summary.id],
        totalRevisoes: 1,
        totalRotinas: 1,
        criadoEm: ts,
      });
      reviewsMap.set("rev-seed-1", {
        id: "rev-seed-1",
        routineId: first.summary.id,
        rotinaTitulo: first.summary.titulo,
        rotinaModulo: first.summary.modulo,
        rotinaFase: first.summary.fase,
        rotinaStatusAuditoria: first.summary.statusAuditoria,
        rotinaReviewTags: tagsOfSummary(first.summary),
        rotinaTotalPassos: first.summary.totalPassos,
        revisor: "Ana (Produtos)",
        categoria: "divergencia_texto",
        passos: [1],
        motivo: "Na versão atual do Orion TN o menu fica em Configurações > Parâmetros Gerais.",
        status: "aberta",
        versao: 1,
        criadoEm: "2026-11-18T14:15:00.000Z",
        atualizadoEm: "2026-11-18T14:15:00.000Z",
        atualizadoPor: "Ana (Produtos)",
        consumidaPeloAgente: true,
        consumidaEm: ts,
        consumidaPor: "Marcus",
        loteExportacaoId: batchId,
        versaoConsumida: 1,
        editadaPosIngestao: false,
        pendenteExportacao: false,
        versoes: [
          {
            versao: 1,
            revisor: "Ana (Produtos)",
            categoria: "divergencia_texto",
            passos: [1],
            motivo: "Na versão atual do Orion TN o menu fica em Configurações > Parâmetros Gerais.",
            status: "aberta",
            alteradoPor: "Ana (Produtos)",
            notaAtualizacao: "Revisão criada",
            criadoEm: "2026-11-18T14:15:00.000Z",
          },
        ],
      });
    }
    if (second) {
      reviewsMap.set("rev-seed-2", {
        id: "rev-seed-2",
        routineId: second.summary.id,
        rotinaTitulo: second.summary.titulo,
        rotinaModulo: second.summary.modulo,
        rotinaFase: second.summary.fase,
        rotinaStatusAuditoria: second.summary.statusAuditoria,
        rotinaReviewTags: tagsOfSummary(second.summary),
        rotinaTotalPassos: second.summary.totalPassos,
        revisor: "Carlos (SD)",
        categoria: "print_incorreta",
        passos: [2],
        motivo: "O botão destacado deve ser 'Gravar' no rodapé do modal, não 'Pesquisar'.",
        status: "aberta",
        versao: 1,
        criadoEm: "2026-11-19T10:05:00.000Z",
        atualizadoEm: "2026-11-19T10:05:00.000Z",
        atualizadoPor: "Carlos (SD)",
        consumidaPeloAgente: false,
        editadaPosIngestao: false,
        pendenteExportacao: true,
        versoes: [
          {
            versao: 1,
            revisor: "Carlos (SD)",
            categoria: "print_incorreta",
            passos: [2],
            motivo: "O botão destacado deve ser 'Gravar' no rodapé do modal, não 'Pesquisar'.",
            status: "aberta",
            alteradoPor: "Carlos (SD)",
            notaAtualizacao: "Revisão criada",
            criadoEm: "2026-11-19T10:05:00.000Z",
          },
        ],
      });
    }
    for (const r of all) syncRoutineIngestionSummary(r);
  }
  return store;
}

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

function stats(): DashboardStats {
  const all = [...db().values()].map((r) => r.summary);
  const revs = [...reviewsMap.values()];
  const countSt = (st: string) => all.filter((r) => r.curationStage === st).length;
  return {
    ...clone(baseStats),
    curadoria: {
      aprovadasKb: countSt("aprovadas_kb"),
      ingeridasAgente: countSt("ingeridas_agente"),
      revisaoPendenteExportacao: countSt("revisao_pendente"),
      precisamApoioHumano: countSt("apoio_humano"),
      prontasConferencia: countSt("prontas_conferencia"),
      naoAuditadas: countSt("nao_auditadas"),
      totalRevisoesPendentes: revs.filter((x) => x.pendenteExportacao).length,
      totalRevisoesConsumidas: revs.filter((x) => x.consumidaPeloAgente).length,
      rotinasComIngestao: all.filter((r) => (r.revisoesConsumidasCount ?? 0) > 0).length,
      ultimoLote: batchesList[0] ? clone(batchesList[0]) : null,
    },
    atividadeRecente: [...db().values()]
      .flatMap((r) => r.historico.map((e) => ({ ...e, rotinaId: r.summary.id })))
      .sort((a, b) => b.em.localeCompare(a.em))
      .slice(0, 10),
  };
}

function buildMockExportContent(
  batchId: string,
  operador: string,
  nota: string | undefined,
  formato: "markdown" | "json",
  revs: RoutineReviewItem[],
): string {
  if (formato === "json") {
    return JSON.stringify({ batchId, operador, nota, revisoes: revs }, null, 2);
  }
  const lines = [
    "# Pacote de Revisões Humanas — Orion Audit Console (Mock)",
    "",
    `- **Lote:** \`${batchId}\``,
    `- **Operador:** ${operador}`,
    ...(nota ? [`- **Nota:** ${nota}`] : []),
    `- **Total:** ${revs.length} revisão(ões)`,
    "",
  ];
  for (const rev of revs) {
    lines.push(`## \`${rev.routineId}\` — ${rev.rotinaTitulo}`);
    lines.push(`- **Revisor:** ${rev.revisor} (v${rev.versao})`);
    lines.push(`- **Motivo:** ${rev.motivo}`);
    lines.push("");
  }
  return lines.join("\n");
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
    if (q.ingestao?.length) {
      rows = rows.filter((r) => {
        if (q.ingestao!.includes("ingerida_pelo_agente") && (r.revisoesConsumidasCount ?? 0) > 0) return true;
        return r.reviewIngestionState ? q.ingestao!.includes(r.reviewIngestionState) : false;
      });
    }
    if (q.estagio) rows = rows.filter((r) => r.curationStage === q.estagio);
    if (q.temVideo !== undefined) rows = rows.filter((r) => r.temVideo === q.temVideo);
    if (q.comDivergencias !== undefined) rows = rows.filter((r) => (r.divergenciasCount > 0) === q.comDivergencias);
    if (q.q?.trim()) {
      const t = q.q.trim().toLowerCase();
      rows = t.startsWith("#/")
        ? rows.filter((r) => r.rotasHash.some((h) => h.toLowerCase().includes(t)))
        : rows.filter((r) =>
            [r.id, r.titulo, reviewPrefix(r.statusAuditoria, tagsOfSummary(r)).trim(), ...r.tags, ...r.rotasHash].some(
              (s) => s.toLowerCase().includes(t),
            ),
          );
    }
    const sort = q.sort ?? "id";
    const dir = q.order === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      const va = a[sort] ?? "";
      const vb = b[sort] ?? "";
      return (
        (typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "pt-BR", { numeric: true })) * dir
      );
    });
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 25;
    return {
      data: clone(rows.slice((page - 1) * pageSize, page * pageSize)),
      meta: { total: rows.length, page, pageSize, stats: stats() },
    };
  },

  async getRotina(id: string): Promise<RoutineDetail> {
    await delay();
    return clone(get(id));
  },

  async aprovarRotina(id: string, p: ApproveRoutinePayload): Promise<ApproveRoutineResponse> {
    await delay();
    const r = get(id);
    if (!p.revisor?.trim()) throw new ApiError(422, "validation", "Informe o revisor.");
    if (p.baseUpdatedAt !== r.summary.updatedAt) {
      throw new ApiError(409, "conflict", "A rotina foi alterada por outra sessão. Recarregue antes de aprovar.");
    }
    if (isReviewState(r.summary.statusAuditoria) && !p.confirmacaoManual) {
      throw new ApiError(
        409,
        "manual_confirmation_required",
        "Confirme a validação manual antes de aprovar uma rotina em revisão ([ATT]/[CCC]/[DDD]/[XRX]).",
      );
    }
    if (
      p.edicoes?.some((e) => /\bvideo_id\b/.test(e.validatedText)) ||
      (p.descricao && /\bvideo_id\b/.test(p.descricao))
    ) {
      throw new ApiError(422, "forbidden_field", "Campo proibido: video_id. Use bunny_video_id.");
    }
    let editados = 0;
    p.edicoes?.forEach((e) => {
      const s = r.steps.find((x) => x.stepNumber === e.stepNumber);
      if (s && s.validatedText !== e.validatedText) {
        s.validatedText = e.validatedText;
        s.isModified = s.validatedText !== s.originalText;
        editados++;
      }
    });
    if (p.descricao && p.descricao !== r.original.descricao) {
      r.original.descricao = p.descricao;
      editados++;
    }
    if (editados) {
      addEvent(r, { tipo: "texto_editado", autor: p.revisor, descricao: `${editados} trecho(s) editado(s) antes da aprovação.` });
    }
    r.summary.statusGovernanca = "aprovada";
    syncRoutineIngestionSummary(r);
    const evento = addEvent(r, {
      tipo: "aprovada",
      autor: p.revisor,
      descricao: p.comentario ? `Rotina aprovada p/ Base KB. ${p.comentario}` : "Rotina aprovada p/ Base KB.",
    });
    return { rotina: clone(r), evento };
  },

  async salvarTextoRotina(id: string, p: SaveRoutineTextPayload): Promise<SaveRoutineTextResponse> {
    await delay();
    const r = get(id);
    if (
      p.edicoes?.some((e) => /\bvideo_id\b/.test(e.validatedText)) ||
      (p.descricao && /\bvideo_id\b/.test(p.descricao))
    ) {
      throw new ApiError(422, "forbidden_field", "Campo proibido: video_id. Use bunny_video_id.");
    }
    let editados = 0;
    p.edicoes?.forEach((e) => {
      const s = r.steps.find((x) => x.stepNumber === e.stepNumber);
      if (s && s.validatedText !== e.validatedText) {
        s.validatedText = e.validatedText;
        s.isModified = s.validatedText !== s.originalText;
        editados++;
      }
    });
    if (p.descricao && p.descricao !== r.original.descricao) {
      r.original.descricao = p.descricao;
      editados++;
    }
    if (editados) {
      addEvent(r, { tipo: "texto_editado", autor: p.revisor || "Revisor", descricao: `${editados} trecho(s) editado(s) no Orion Audit.` });
    }
    return { rotina: clone(r) };
  },

  async solicitarRevisao(id: string, p: RequestReviewPayload): Promise<RequestReviewResponse> {
    await delay();
    const r = get(id);
    if (!p.motivo || p.motivo.trim().length < 10) {
      throw new ApiError(422, "validation", "O motivo precisa de pelo menos 10 caracteres.");
    }
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
      consumidaPeloAgente: false,
      editadaPosIngestao: false,
      pendenteExportacao: true,
      versoes: [
        {
          versao: 1,
          revisor: p.revisor,
          categoria: p.categoria,
          passos,
          motivo: p.motivo.trim(),
          status: "aberta",
          alteradoPor: p.revisor,
          notaAtualizacao: "Revisão criada",
          criadoEm: ts,
        },
      ],
    };
    reviewsMap.set(revId, revisao);
    r.summary.statusGovernanca = "revisao_solicitada";
    syncRoutineIngestionSummary(r);
    const evento = addEvent(r, {
      tipo: "revisao_solicitada",
      autor: p.revisor,
      descricao: `${p.motivo}${passos.length ? ` (passos ${passos.join(", ")})` : ""}`,
      meta: { categoria: p.categoria, reviewId: revId, versao: 1 },
    });
    return { rotina: clone(r), evento, revisao: clone(revisao) };
  },

  async listRevisoes(q: ListReviewsQuery = {}): Promise<ListReviewsResponse> {
    await delay();
    db();
    const all = [...reviewsMap.values()].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    let filtered = all;
    if (q.routineId) filtered = filtered.filter((i) => i.routineId === q.routineId);
    if (q.status) filtered = filtered.filter((i) => i.status === q.status);
    if (q.categoria) filtered = filtered.filter((i) => i.categoria === q.categoria);
    if (q.modulo) filtered = filtered.filter((i) => i.rotinaModulo === q.modulo);
    if (q.ingestao === "pendentes") filtered = filtered.filter((i) => i.pendenteExportacao);
    if (q.ingestao === "consumidas") filtered = filtered.filter((i) => i.consumidaPeloAgente);
    if (q.q?.trim()) {
      const t = q.q.trim().toLowerCase();
      filtered = filtered.filter((i) =>
        [i.routineId, i.rotinaTitulo, i.motivo, i.revisor, i.resolucao ?? "", i.loteExportacaoId ?? ""].some((s) =>
          s.toLowerCase().includes(t),
        ),
      );
    }
    const pendentes = all.filter((i) => i.pendenteExportacao);
    const consumidas = all.filter((i) => i.consumidaPeloAgente);
    return {
      data: clone(filtered),
      meta: {
        total: filtered.length,
        abertas: all.filter((i) => i.status === "aberta").length,
        emAndamento: all.filter((i) => i.status === "em_andamento").length,
        resolvidas: all.filter((i) => i.status === "resolvida").length,
        arquivadas: all.filter((i) => i.status === "arquivada").length,
        pendentesExportacao: pendentes.length,
        consumidas: consumidas.length,
        rotinasPendentesExportacao: new Set(pendentes.map((i) => i.routineId)).size,
        rotinasConsumidas: new Set(consumidas.map((i) => i.routineId)).size,
      },
      lotes: clone(batchesList),
    };
  },

  async listRevisoesByRotina(id: string): Promise<{ data: RoutineReviewItem[] }> {
    await delay();
    db();
    const list = [...reviewsMap.values()]
      .filter((i) => i.routineId === id)
      .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    return { data: clone(list) };
  },

  async updateRevisao(reviewId: string, p: UpdateReviewPayload): Promise<UpdateReviewResponse> {
    await delay();
    db();
    const existing = reviewsMap.get(reviewId);
    if (!existing) throw new ApiError(404, "not_found", `Revisão ${reviewId} não encontrada.`);
    const ts = now();
    const nextVer = existing.versao + 1;
    const status = p.status ?? existing.status;
    const consumida = Boolean(existing.consumidaPeloAgente);
    const editadaPos = consumida && existing.versaoConsumida !== undefined && nextVer > existing.versaoConsumida;
    const isActive = status === "aberta" || status === "em_andamento";

    const updated: RoutineReviewItem = {
      ...existing,
      revisor: p.revisor ?? existing.revisor,
      categoria: p.categoria ?? existing.categoria,
      passos: p.passos ?? existing.passos,
      motivo: p.motivo ?? existing.motivo,
      resolucao: p.resolucao !== undefined ? p.resolucao : existing.resolucao,
      status,
      versao: nextVer,
      atualizadoEm: ts,
      atualizadoPor: p.alteradoPor,
      editadaPosIngestao: editadaPos,
      pendenteExportacao: isActive && (!consumida || editadaPos),
      versoes: [
        {
          versao: nextVer,
          revisor: p.revisor ?? existing.revisor,
          categoria: p.categoria ?? existing.categoria,
          passos: p.passos ?? existing.passos,
          motivo: p.motivo ?? existing.motivo,
          resolucao: p.resolucao !== undefined ? p.resolucao : existing.resolucao,
          status,
          alteradoPor: p.alteradoPor,
          notaAtualizacao: p.notaAtualizacao || `Atualizada para v${nextVer}`,
          criadoEm: ts,
        },
        ...existing.versoes,
      ],
    };
    reviewsMap.set(reviewId, updated);
    const r = db().get(existing.routineId);
    if (r) syncRoutineIngestionSummary(r);
    return { revisao: clone(updated) };
  },

  async exportarRevisoes(p: ExportReviewsPayload): Promise<ExportReviewsResponse> {
    await delay();
    db();
    const all = [...reviewsMap.values()];
    let selected = all;
    if (p.escopo === "pendentes") selected = all.filter((x) => x.pendenteExportacao);
    else if (p.escopo === "selecionadas") {
      const set = new Set(p.reviewIds ?? []);
      selected = all.filter((x) => set.has(x.id));
    } else {
      selected = all.filter((x) => x.status === "aberta" || x.status === "em_andamento");
    }
    if (selected.length === 0) {
      throw new ApiError(409, "empty_export", "Nenhuma revisão elegível para exportação.");
    }
    const ts = now();
    const batchId = p.marcarComoIngeridas
      ? `lote-${ts.slice(0, 10)}-${Math.random().toString(16).slice(2, 6)}`
      : `copia-${ts.slice(0, 10)}`;
    const routineIds = Array.from(new Set(selected.map((x) => x.routineId)));
    const reviewIds = selected.map((x) => x.id);
    let batch: ReviewExportBatch | null = null;

    if (p.marcarComoIngeridas) {
      batch = {
        id: batchId,
        operador: p.operador,
        formato: p.formato,
        nota: p.nota,
        reviewIds,
        routineIds,
        totalRevisoes: reviewIds.length,
        totalRotinas: routineIds.length,
        criadoEm: ts,
      };
      batchesList.unshift(batch);
      for (const rev of selected) {
        rev.consumidaPeloAgente = true;
        rev.consumidaEm = ts;
        rev.consumidaPor = p.operador;
        rev.loteExportacaoId = batchId;
        rev.versaoConsumida = rev.versao;
        rev.editadaPosIngestao = false;
        rev.pendenteExportacao = false;
      }
      for (const rid of routineIds) {
        const r = db().get(rid);
        if (r) {
          syncRoutineIngestionSummary(r);
          addEvent(r, {
            tipo: "revisao_ingerida_agente",
            autor: p.operador,
            descricao: `Revisões marcadas como ingeridas pelo agente (lote ${batchId}).`,
            meta: { batchId },
          });
        }
      }
    }

    const content = buildMockExportContent(batchId, p.operador || "Operador", p.nota, p.formato, selected);
    return {
      batch: batch ? clone(batch) : null,
      filename: `orion-revisoes-${batchId}.${p.formato === "json" ? "json" : "md"}`,
      mimeType: p.formato === "json" ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8",
      content,
      totalRevisoes: reviewIds.length,
      totalRotinas: routineIds.length,
      routineIds,
      reviewIds,
    };
  },

  async listLotesRevisoes(): Promise<{ data: ReviewExportBatch[] }> {
    await delay();
    db();
    return { data: clone(batchesList) };
  },

  async downloadLoteRevisoes(batchId: string, formato?: "markdown" | "json"): Promise<ExportReviewsResponse> {
    await delay();
    db();
    const batch = batchesList.find((b) => b.id === batchId);
    if (!batch) throw new ApiError(404, "not_found", `Lote ${batchId} não encontrado.`);
    const revs = [...reviewsMap.values()].filter((r) => batch.reviewIds.includes(r.id));
    const fmt = formato ?? batch.formato;
    const content = buildMockExportContent(batch.id, batch.operador, batch.nota, fmt, revs);
    return {
      batch: clone(batch),
      filename: `orion-revisoes-${batch.id}.${fmt === "json" ? "json" : "md"}`,
      mimeType: fmt === "json" ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8",
      content,
      totalRevisoes: revs.length,
      totalRotinas: batch.routineIds.length,
      routineIds: batch.routineIds,
      reviewIds: batch.reviewIds,
    };
  },
};
