-- =============================================================================
-- Orion Audit Console — Habilitação do Supabase Realtime (004)
-- Adiciona as tabelas de auditoria, passos, eventos, jobs e revisões à
-- publication `supabase_realtime` de forma idempotente.
-- =============================================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOREACH tbl IN ARRAY ARRAY[
      'routines',
      'routine_steps',
      'governance_events',
      'runner_jobs',
      'routine_reviews'
    ]
    LOOP
      IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = tbl
      ) THEN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
      END IF;
    END LOOP;
  END IF;
END
$$;
