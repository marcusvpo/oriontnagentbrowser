---
id: C-CONFIG-07
titulo: 'Desbloqueio de Processos Órfãos Retendo Locks de Dados no Banco PostgreSQL'
modulo: config
secao: C
auditoria_ui:
  data_execucao: '2026-11-11'
  status: dependencia_dados_banco
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **banco de dados interno / dba siplan** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Demanda acesso ao PostgreSQL com usuário postgres para rodar `pg_terminate_backend()` em transações travadas que geram erro de timeout na tela.

#### Descrição:
Desbloqueio de Processos Órfãos Retendo Locks de Dados no Banco PostgreSQL. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Acessar o pgAdmin ou terminal `psql` no servidor de banco de dados.
2. Executar a consulta de verificação de bloqueios: `SELECT pid, query, state, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';`
3. Identificar o processo travado que segura locks em tabelas de protocolos ou caixas.
4. Encerrar a sessão com `SELECT pg_terminate_backend(<PID>);`.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
