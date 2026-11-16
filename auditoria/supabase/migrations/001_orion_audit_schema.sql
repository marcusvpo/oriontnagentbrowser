-- =============================================================================
-- Orion Audit Console — Schema PostgreSQL (Supabase)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.routines (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  modulo TEXT NOT NULL,
  secao TEXT NOT NULL,
  fase SMALLINT,
  tem_video BOOLEAN NOT NULL DEFAULT false,
  workload_type TEXT NOT NULL DEFAULT 'read_only' CHECK (workload_type IN ('read_only', 'mutation')),
  status_auditoria TEXT NOT NULL DEFAULT 'nao_auditada' CHECK (status_auditoria IN ('validado_inalterado', 'validado_com_ajustes', 'atualizacao_editorial', 'dependencia_dados_banco', 'dependencia_cruzada_rotina', 'nao_auditada')),
  status_governanca TEXT NOT NULL DEFAULT 'pendente_aprovacao' CHECK (status_governanca IN ('pendente_aprovacao', 'aprovada', 'revisao_solicitada')),
  pasta_auditoria TEXT,
  total_passos INTEGER NOT NULL DEFAULT 0,
  prints_geradas INTEGER NOT NULL DEFAULT 0,
  divergencias_count INTEGER NOT NULL DEFAULT 0,
  menor_confianca NUMERIC(4,3),
  rotas_hash TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  data_execucao TIMESTAMPTZ,
  worker_id TEXT,
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  descricao_original TEXT NOT NULL DEFAULT '',
  descricao_revisada TEXT NOT NULL DEFAULT '',
  observacoes TEXT[] NOT NULL DEFAULT '{}',
  frontmatter_original JSONB NOT NULL DEFAULT '{}'::jsonb,
  frontmatter_original_yaml TEXT NOT NULL DEFAULT '',
  frontmatter_revisado_yaml TEXT NOT NULL DEFAULT '',
  auditoria_ui JSONB,
  markdown_original TEXT NOT NULL DEFAULT '',
  markdown_revisado TEXT NOT NULL DEFAULT '',
  bloqueio JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.routine_steps (
  id BIGSERIAL PRIMARY KEY,
  routine_id TEXT NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'click',
  zone_policy TEXT,
  targets TEXT[] NOT NULL DEFAULT '{}',
  sub_items TEXT[] NOT NULL DEFAULT '{}',
  original_text TEXT NOT NULL,
  validated_text TEXT NOT NULL,
  is_modified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'nao_executado' CHECK (status IN ('ok', 'modified', 'blocked', 'nao_executado')),
  media JSONB,
  dom_geometry JSONB,
  layout_result JSONB,
  divergence JSONB,
  executed_action JSONB,
  invariantes JSONB,
  error_message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (routine_id, step_number)
);

CREATE TABLE IF NOT EXISTS public.governance_events (
  id TEXT PRIMARY KEY,
  routine_id TEXT NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'auditoria_executada',
    'aprovada',
    'texto_editado',
    'revisao_solicitada',
    'reexecucao_enfileirada',
    'reexecucao_concluida',
    'reexecucao_falhou'
  )),
  autor TEXT NOT NULL,
  em TIMESTAMPTZ NOT NULL DEFAULT now(),
  descricao TEXT NOT NULL,
  meta JSONB
);

CREATE TABLE IF NOT EXISTS public.runner_jobs (
  job_id TEXT PRIMARY KEY,
  routine_id TEXT NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('idle', 'na_fila', 'em_execucao', 'concluida', 'falhou')),
  lane TEXT NOT NULL DEFAULT 'read_only' CHECK (lane IN ('read_only', 'mutation')),
  modo TEXT NOT NULL DEFAULT 'headless' CHECK (modo IN ('headless', 'headed')),
  prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('normal', 'alta')),
  solicitante TEXT,
  motivo TEXT,
  passos INTEGER[],
  posicao_fila INTEGER,
  enfileirado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  iniciado_em TIMESTAMPTZ,
  finalizado_em TIMESTAMPTZ,
  erro TEXT
);

-- Índices para filtros e buscas rápidas no Explorador & Dashboard
CREATE INDEX IF NOT EXISTS idx_routines_modulo ON public.routines (modulo);
CREATE INDEX IF NOT EXISTS idx_routines_secao ON public.routines (secao);
CREATE INDEX IF NOT EXISTS idx_routines_fase ON public.routines (fase);
CREATE INDEX IF NOT EXISTS idx_routines_status_auditoria ON public.routines (status_auditoria);
CREATE INDEX IF NOT EXISTS idx_routines_status_governanca ON public.routines (status_governanca);
CREATE INDEX IF NOT EXISTS idx_routines_workload_type ON public.routines (workload_type);
CREATE INDEX IF NOT EXISTS idx_routines_rotas_hash ON public.routines USING GIN (rotas_hash);
CREATE INDEX IF NOT EXISTS idx_routines_tags ON public.routines USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_routine_steps_routine ON public.routine_steps (routine_id, step_number);
CREATE INDEX IF NOT EXISTS idx_governance_events_routine ON public.governance_events (routine_id, em DESC);
CREATE INDEX IF NOT EXISTS idx_governance_events_em ON public.governance_events (em DESC);
CREATE INDEX IF NOT EXISTS idx_runner_jobs_routine ON public.runner_jobs (routine_id, enfileirado_em DESC);
CREATE INDEX IF NOT EXISTS idx_runner_jobs_estado ON public.runner_jobs (estado);

-- Row Level Security (RLS)
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runner_jobs ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (frontend/dashboard) — escritas são feitas exclusivamente via service role no backend Node.js
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routines' AND policyname = 'Allow public read routines') THEN
    CREATE POLICY "Allow public read routines" ON public.routines FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routine_steps' AND policyname = 'Allow public read routine_steps') THEN
    CREATE POLICY "Allow public read routine_steps" ON public.routine_steps FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'governance_events' AND policyname = 'Allow public read governance_events') THEN
    CREATE POLICY "Allow public read governance_events" ON public.governance_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'runner_jobs' AND policyname = 'Allow public read runner_jobs') THEN
    CREATE POLICY "Allow public read runner_jobs" ON public.runner_jobs FOR SELECT USING (true);
  END IF;
END
$$;
