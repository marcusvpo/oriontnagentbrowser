-- ADR-021 — Taxonomia de revisão humana: [ATT] / [DDD] / [XRX] substituem o [!!!] (requer_revisao_humana).
--
-- ESTA MIGRAÇÃO FOI ESCRITA MAS NÃO EXECUTADA (decisão do usuário): rode `migrate-supabase` quando quiser.
-- É idempotente: pode ser reaplicada sem efeito colateral (o migrate-supabase roda todos os *.sql sempre).
--
--   atualizacao_editorial       [ATT]  manual desatualizado (tela/caminho/campo inexistente na versão atual)
--   dependencia_dados_banco     [DDD]  faltam registros no banco de homologação (ou ambiente/hardware)
--   dependencia_cruzada_rotina  [XRX]  depende da execução prévia de outra rotina

-- 1. Linhas legadas: 'requer_revisao_humana' vira o status mais próximo pelo tipo do bloqueio.
--    Hardware/infra/ambiente/dados -> [DDD]; dependência de rotina -> [XRX]; o restante -> [ATT].
ALTER TABLE public.routines DROP CONSTRAINT IF EXISTS routines_status_auditoria_check;

UPDATE public.routines
SET status_auditoria = CASE
    WHEN COALESCE(bloqueio->>'tipo', '') ~* '(hardware|infraestrutura|container|docker|ambiente|banco de homologa|grade vazia|dados)' THEN 'dependencia_dados_banco'
    WHEN COALESCE(bloqueio->>'tipo', '') ~* '(depend[eê]ncia cruzada|pr[eé]-requisito)' THEN 'dependencia_cruzada_rotina'
    ELSE 'atualizacao_editorial'
  END
WHERE status_auditoria = 'requer_revisao_humana';

-- 2. Novo CHECK (inline em 001 só vale para instalações novas)
ALTER TABLE public.routines
  ADD CONSTRAINT routines_status_auditoria_check
  CHECK (status_auditoria IN (
    'validado_inalterado',
    'validado_com_ajustes',
    'atualizacao_editorial',
    'dependencia_dados_banco',
    'dependencia_cruzada_rotina',
    'nao_auditada'
  ));
