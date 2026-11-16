import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient, isRealtimeConfigured } from "@/lib/supabase";

export type RealtimeStatus = "disabled" | "connecting" | "connected" | "error";

let currentStatus: RealtimeStatus = isRealtimeConfigured() ? "connecting" : "disabled";
const listeners = new Set<() => void>();

function setRealtimeStatus(next: RealtimeStatus) {
  if (currentStatus === next) return;
  currentStatus = next;
  for (const fn of listeners) fn();
}

export function useRealtimeStatus(): RealtimeStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentStatus,
    () => "disabled",
  );
}

export interface RealtimeChangePayload {
  table?: string;
  new?: Record<string, unknown> | null;
  old?: Record<string, unknown> | null;
}

export function extractChangedRoutineId(table: string, payload: RealtimeChangePayload): string | undefined {
  const row = payload.new && Object.keys(payload.new).length > 0 ? payload.new : payload.old;
  if (!row) return undefined;
  const raw = table === "routines" ? row.id : row.routine_id;
  return typeof raw === "string" && raw.trim() ? raw : undefined;
}

export function createRealtimeInvalidator(queryClient: QueryClient, debounceMs = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const pendingRoutineIds = new Set<string>();
  let needsReviews = false;

  const flush = () => {
    timer = null;
    void queryClient.invalidateQueries({ queryKey: ["rotinas"] });
    if (needsReviews) {
      needsReviews = false;
      void queryClient.invalidateQueries({ queryKey: ["revisoes"] });
    }
    for (const id of pendingRoutineIds) {
      void queryClient.invalidateQueries({ queryKey: ["rotina", id] });
    }
    pendingRoutineIds.clear();
  };

  return {
    notify(table: string, payload: RealtimeChangePayload) {
      const routineId = extractChangedRoutineId(table, payload);
      if (routineId) pendingRoutineIds.add(routineId);
      if (table === "routine_reviews") needsReviews = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, debounceMs);
    },
    dispose() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pendingRoutineIds.clear();
    },
  };
}

export function useSupabaseRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setRealtimeStatus("disabled");
      return;
    }

    setRealtimeStatus("connecting");
    const invalidator = createRealtimeInvalidator(queryClient, 200);

    const tables = [
      "routines",
      "routine_steps",
      "governance_events",
      "runner_jobs",
      "routine_reviews",
    ] as const;

    let channel = supabase.channel("orion-audit-realtime");
    for (const table of tables) {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          invalidator.notify(table, payload as unknown as RealtimeChangePayload);
        },
      );
    }

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") setRealtimeStatus("connected");
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setRealtimeStatus("error");
      else if (status === "CLOSED") setRealtimeStatus("disabled");
    });

    return () => {
      invalidator.dispose();
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
