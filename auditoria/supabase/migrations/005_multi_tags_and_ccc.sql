-- ADR-024 — Tag [CCC] (comunicação/portal externo) e múltiplas tags por rotina.
--
-- Idempotente: o `migrate-supabase` reaplica todos os *.sql em ordem a cada execução.
-- (Numerada 005 porque 004 já é a habilitação do Supabase Realtime.)
--
--   comunicacao_externa  [CCC]  parte do passo a passo ocorre em portal/serviço externo ao Orion TN
--                              (SISCOAF, e-Notariado, CENSEC, CRC, CNB, Receita Federal...). Não bloqueia
--                              a auditoria das etapas do Orion TN e pode vir com outra tag ([ATT][CCC]).
--
-- `status_auditoria` continua guardando o status PRINCIPAL (um só valor: as tags bloqueantes ATT/DDD/XRX têm
-- precedência sobre CCC). A lista completa de tags, em ordem canônica ATT, CCC, DDD, XRX, fica em `tags_revisao`.

-- 1. Novo valor de status
ALTER TABLE public.routines DROP CONSTRAINT IF EXISTS routines_status_auditoria_check;
ALTER TABLE public.routines
  ADD CONSTRAINT routines_status_auditoria_check
  CHECK (status_auditoria IN (
    'validado_inalterado',
    'validado_com_ajustes',
    'atualizacao_editorial',
    'comunicacao_externa',
    'dependencia_dados_banco',
    'dependencia_cruzada_rotina',
    'nao_auditada'
  ));

-- 2. Lista de tags da rotina (multi-tag)
ALTER TABLE public.routines ADD COLUMN IF NOT EXISTS tags_revisao TEXT[] NOT NULL DEFAULT '{}';

-- Linhas existentes: a lista parte do status principal (uma tag); o sync reescreve com a lista completa
UPDATE public.routines
SET tags_revisao = CASE status_auditoria
    WHEN 'atualizacao_editorial' THEN ARRAY['ATT']
    WHEN 'comunicacao_externa' THEN ARRAY['CCC']
    WHEN 'dependencia_dados_banco' THEN ARRAY['DDD']
    WHEN 'dependencia_cruzada_rotina' THEN ARRAY['XRX']
    ELSE '{}'::text[]
  END
WHERE tags_revisao = '{}'::text[]
  AND status_auditoria IN ('atualizacao_editorial', 'comunicacao_externa', 'dependencia_dados_banco', 'dependencia_cruzada_rotina');

ALTER TABLE public.routines DROP CONSTRAINT IF EXISTS routines_tags_revisao_check;
ALTER TABLE public.routines
  ADD CONSTRAINT routines_tags_revisao_check
  CHECK (tags_revisao <@ ARRAY['ATT', 'CCC', 'DDD', 'XRX']::text[]);

CREATE INDEX IF NOT EXISTS idx_routines_tags_revisao ON public.routines USING GIN (tags_revisao);

-- 3. Escopo do passo: passo de portal externo não tem print por desenho (não é erro de paridade)
ALTER TABLE public.routine_steps ADD COLUMN IF NOT EXISTS step_scope TEXT NOT NULL DEFAULT 'orion_tn';
ALTER TABLE public.routine_steps DROP CONSTRAINT IF EXISTS routine_steps_step_scope_check;
ALTER TABLE public.routine_steps
  ADD CONSTRAINT routine_steps_step_scope_check
  CHECK (step_scope IN ('orion_tn', 'external_portal'));
ALTER TABLE public.routine_steps ADD COLUMN IF NOT EXISTS portal_externo TEXT;
