import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type {
  ApproveRoutinePayload,
  ExportReviewsPayload,
  ListReviewsQuery,
  ListRoutinesQuery,
  RequestReviewPayload,
  RoutineDetail,
  SaveRoutineTextPayload,
  UpdateReviewPayload,
} from "@/types/api";

export const rotinasKey = (q?: ListRoutinesQuery) => (q ? ["rotinas", q] : ["rotinas"]);
export const rotinaKey = (id: string) => ["rotina", id];

export function useRotinas(query: ListRoutinesQuery, opts?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: rotinasKey(query),
    queryFn: () => api.listRotinas(query),
    placeholderData: keepPreviousData,
    refetchInterval: opts?.refetchInterval,
  });
}

export function useRotina(id: string) {
  return useQuery({
    queryKey: rotinaKey(id),
    queryFn: () => api.getRotina(id),
    retry: (n, e) => (e as { status?: number }).status !== 404 && n < 2,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (id?: string) => {
    qc.invalidateQueries({ queryKey: ["rotinas"] });
    qc.invalidateQueries({ queryKey: ["revisoes"] });
    if (id) qc.invalidateQueries({ queryKey: rotinaKey(id) });
    else qc.invalidateQueries({ queryKey: ["rotina"] });
  };
}

export function useAprovarRotina(id: string) {
  const qc = useQueryClient();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (p: ApproveRoutinePayload) => api.aprovarRotina(id, p),
    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: rotinaKey(id) });
      const prev = qc.getQueryData<RoutineDetail>(rotinaKey(id));
      if (prev) {
        qc.setQueryData<RoutineDetail>(rotinaKey(id), {
          ...prev,
          summary: { ...prev.summary, statusGovernanca: "aprovada", curationStage: "aprovadas_kb" },
          steps: prev.steps.map((s) => {
            const e = p.edicoes?.find((x) => x.stepNumber === s.stepNumber);
            return e ? { ...s, validatedText: e.validatedText } : s;
          }),
        });
      }
      return { prev };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(rotinaKey(id), ctx.prev);
    },
    onSuccess: (res) => qc.setQueryData(rotinaKey(id), res.rotina),
    onSettled: () => invalidate(id),
  });
}

export function useSalvarTextoRotina(id: string) {
  const qc = useQueryClient();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (p: SaveRoutineTextPayload) => api.salvarTextoRotina(id, p),
    onSuccess: (res) => qc.setQueryData(rotinaKey(id), res.rotina),
    onSettled: () => invalidate(id),
  });
}

export function useSolicitarRevisao(id: string) {
  const qc = useQueryClient();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (p: RequestReviewPayload) => api.solicitarRevisao(id, p),
    onSuccess: (res) => qc.setQueryData(rotinaKey(id), res.rotina),
    onSettled: () => invalidate(id),
  });
}

export function useRevisoes(query: ListReviewsQuery = {}) {
  return useQuery({
    queryKey: ["revisoes", query],
    queryFn: () => api.listRevisoes(query),
    placeholderData: keepPreviousData,
  });
}

export function useRevisoesRotina(id: string) {
  return useQuery({
    queryKey: ["revisoes", "rotina", id],
    queryFn: () => api.listRevisoesByRotina(id),
  });
}

export function useUpdateRevisao(routineId?: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: UpdateReviewPayload }) =>
      api.updateRevisao(reviewId, payload),
    onSettled: () => invalidate(routineId),
  });
}

export function useExportarRevisoes() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: ExportReviewsPayload) => api.exportarRevisoes(payload),
    onSettled: () => invalidate(),
  });
}

export function useDownloadLoteRevisoes() {
  return useMutation({
    mutationFn: ({ batchId, formato }: { batchId: string; formato?: "markdown" | "json" }) =>
      api.downloadLoteRevisoes(batchId, formato),
  });
}
