import { describe, expect, it, vi } from "vitest";
import type { QueryClient } from "@tanstack/react-query";
import { createRealtimeInvalidator, extractChangedRoutineId } from "./../hooks/useSupabaseRealtime";

describe("Supabase Realtime helpers", () => {
  it("extrai routineId de routines (id) e tabelas filhas (routine_id)", () => {
    expect(extractChangedRoutineId("routines", { new: { id: "R-1.1" } })).toBe("R-1.1");
    expect(extractChangedRoutineId("routine_steps", { new: { routine_id: "M-41.0" } })).toBe("M-41.0");
    expect(extractChangedRoutineId("runner_jobs", { old: { routine_id: "D-1.1" } })).toBe("D-1.1");
    expect(extractChangedRoutineId("governance_events", { new: {} })).toBeUndefined();
  });

  it("faz debounce e invalida rotinas, detalhe e revisões", async () => {
    vi.useFakeTimers();
    const invalidateQueries = vi.fn().mockResolvedValue(undefined);
    const qc = { invalidateQueries } as unknown as QueryClient;

    const inv = createRealtimeInvalidator(qc, 200);
    inv.notify("routines", { new: { id: "R-1.1" } });
    inv.notify("routine_steps", { new: { routine_id: "R-1.1" } });
    inv.notify("routine_reviews", { new: { routine_id: "M-16.2" } });

    expect(invalidateQueries).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(210);

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["rotinas"] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["revisoes"] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["rotina", "R-1.1"] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["rotina", "M-16.2"] });

    inv.dispose();
    vi.useRealTimers();
  });
});
