import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ReexecuteBatchPayload } from "@/services/api";
import type {
  ApproveRoutinePayload, ListReviewsQuery, ListRoutinesQuery, ReexecutePayload,
  RequestReviewPayload, RoutineDetail, UpdateReviewPayload,
} from "@/types/api";

export const rotinasKey = (q?: ListRoutinesQuery) => (q ? ["rotinas", q] : ["rotinas"]);
export const rotinaKey = (id: string) => ["rotina", id];

export function useRotinas(query: ListRoutinesQuery, opts?: { refetchInterval?: number }) {
  return useQuery({ queryKey: rotinasKey(query), queryFn: () => api.listRotinas(query), placeholderData: keepPreviousData, refetchInterval: opts?.refetchInterval });
}

export function useRotina(id: string) {
  return useQuery({
    queryKey: rotinaKey(id),
    queryFn: () => api.getRotina(id),
    retry: (n, e) => (e as { status?: number }).status !== 404 && n < 2,
    refetchInterval: (q) => {
      const st = q.state.data?.summary.runner.estado;
      return st === "na_fila" || st === "em_execucao" ? 4000 : false;
    },
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (id?: string) => {
    qc.invalidateQueries({ queryKey: ["rotinas"] });
    qc.invalidateQueries({ queryKey: ["revisoes"] });
    if (id) qc.invalidateQueries({ queryKey: rotinaKey(id) });
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
          summary: { ...prev.summary, statusGovernanca: "aprovada" },
          steps: prev.steps.map((s) => { const e = p.edicoes?.find((x) => x.stepNumber === s.stepNumber); return e ? { ...s, validatedText: e.validatedText } : s; }),
        });
      }
      return { prev };
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(rotinaKey(id), ctx.prev); },
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

export function useReexecutarRotina(id: string) {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (p: ReexecutePayload) => api.reexecutarRotina(id, p), onSettled: () => invalidate(id) });
}

export function useReexecutarLote() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (p: ReexecuteBatchPayload) => api.reexecutarLote(p), onSettled: () => invalidate() });
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
