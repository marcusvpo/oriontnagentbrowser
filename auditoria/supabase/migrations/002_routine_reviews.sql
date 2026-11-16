-- =============================================================================
-- Orion Audit Console — Tabela de Revisões com Versionamento (002)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.routine_reviews (
  id TEXT PRIMARY KEY,
  routine_id TEXT NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  revisor TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'divergencia_texto',
    'print_incorreta',
    'tela_bloqueada',
    'hardware_driver',
    'outro'
  )),
  passos INTEGER[] NOT NULL DEFAULT '{}',
  motivo TEXT NOT NULL,
  resolucao TEXT,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN (
    'aberta',
    'em_andamento',
    'resolvida',
    'arquivada'
  )),
  versao INTEGER NOT NULL DEFAULT 1,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_por TEXT
);

CREATE TABLE IF NOT EXISTS public.routine_review_versions (
  id BIGSERIAL PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES public.routine_reviews(id) ON DELETE CASCADE,
  versao INTEGER NOT NULL,
  revisor TEXT NOT NULL,
  categoria TEXT NOT NULL,
  passos INTEGER[] NOT NULL DEFAULT '{}',
  motivo TEXT NOT NULL,
  resolucao TEXT,
  status TEXT NOT NULL,
  alterado_por TEXT NOT NULL,
  nota_atualizacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (review_id, versao)
);

CREATE INDEX IF NOT EXISTS idx_routine_reviews_routine_id ON public.routine_reviews (routine_id, atualizado_em DESC);
CREATE INDEX IF NOT EXISTS idx_routine_reviews_status ON public.routine_reviews (status);
CREATE INDEX IF NOT EXISTS idx_routine_reviews_categoria ON public.routine_reviews (categoria);
CREATE INDEX IF NOT EXISTS idx_routine_review_versions_review_id ON public.routine_review_versions (review_id, versao DESC);

-- Row Level Security (RLS)
ALTER TABLE public.routine_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_review_versions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routine_reviews' AND policyname = 'Allow public read routine_reviews') THEN
    CREATE POLICY "Allow public read routine_reviews" ON public.routine_reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routine_review_versions' AND policyname = 'Allow public read routine_review_versions') THEN
    CREATE POLICY "Allow public read routine_review_versions" ON public.routine_review_versions FOR SELECT USING (true);
  END IF;
END
$$;
