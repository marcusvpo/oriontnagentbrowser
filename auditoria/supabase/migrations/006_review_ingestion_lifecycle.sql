-- =============================================================================
-- ADR-036 — Ciclo de Vida de Exportação & Ingestão de Revisões pelo Agente (006)
--
-- Idempotente: pode ser reaplicada sem efeito colateral pelo `migrate-supabase`.
-- Cria `review_export_batches`, adiciona colunas de consumo/ingestão em
-- `routine_reviews`, amplia `governance_events.tipo` e registra a tabela nova
-- na publication `supabase_realtime`.
-- =============================================================================

-- 1. Histórico de lotes exportados para análise/ingestão no agente
CREATE TABLE IF NOT EXISTS public.review_export_batches (
  id TEXT PRIMARY KEY,
  operador TEXT NOT NULL,
  formato TEXT NOT NULL DEFAULT 'markdown' CHECK (formato IN ('markdown', 'json')),
  nota TEXT,
  review_ids TEXT[] NOT NULL DEFAULT '{}',
  routine_ids TEXT[] NOT NULL DEFAULT '{}',
  total_revisoes INTEGER NOT NULL DEFAULT 0,
  total_rotinas INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_export_batches_criado_em
  ON public.review_export_batches (criado_em DESC);

ALTER TABLE public.review_export_batches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'review_export_batches'
      AND policyname = 'Allow public read review_export_batches'
  ) THEN
    CREATE POLICY "Allow public read review_export_batches"
      ON public.review_export_batches FOR SELECT USING (true);
  END IF;
END
$$;

-- 2. Colunas de ingestão pelo agente em `routine_reviews`
ALTER TABLE public.routine_reviews
  ADD COLUMN IF NOT EXISTS consumida_pelo_agente BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.routine_reviews
  ADD COLUMN IF NOT EXISTS consumida_em TIMESTAMPTZ;
ALTER TABLE public.routine_reviews
  ADD COLUMN IF NOT EXISTS consumida_por TEXT;
ALTER TABLE public.routine_reviews
  ADD COLUMN IF NOT EXISTS lote_exportacao_id TEXT REFERENCES public.review_export_batches(id) ON DELETE SET NULL;
ALTER TABLE public.routine_reviews
  ADD COLUMN IF NOT EXISTS versao_consumida INTEGER;

CREATE INDEX IF NOT EXISTS idx_routine_reviews_consumida
  ON public.routine_reviews (consumida_pelo_agente, atualizado_em DESC);
CREATE INDEX IF NOT EXISTS idx_routine_reviews_lote
  ON public.routine_reviews (lote_exportacao_id);

-- 3. Novo tipo de evento de governança (`revisao_ingerida_agente`)
ALTER TABLE public.governance_events DROP CONSTRAINT IF EXISTS governance_events_tipo_check;
ALTER TABLE public.governance_events
  ADD CONSTRAINT governance_events_tipo_check
  CHECK (tipo IN (
    'auditoria_executada',
    'aprovada',
    'texto_editado',
    'revisao_solicitada',
    'revisao_ingerida_agente',
    'reexecucao_enfileirada',
    'reexecucao_concluida',
    'reexecucao_falhou'
  ));

-- 4. Habilita Realtime na tabela `review_export_batches`
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'review_export_batches'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.review_export_batches;
    END IF;
  END IF;
END
$$;
