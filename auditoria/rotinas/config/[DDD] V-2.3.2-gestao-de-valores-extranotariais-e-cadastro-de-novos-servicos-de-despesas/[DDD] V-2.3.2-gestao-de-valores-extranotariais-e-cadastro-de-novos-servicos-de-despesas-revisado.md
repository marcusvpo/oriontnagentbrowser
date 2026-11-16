---
id: V-2.3.2
titulo: 'Gestão de Valores Extranotariais e Cadastro de Novos Serviços de Despesas'
modulo: config
secao: V
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **regra de negócio com reflexo fiscal restrito** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Configuração com impacto direto na prestação de contas do cartório, livro caixa e emissão de notas fiscais; requer parametrização contábil assistida.

#### Descrição:
Gestão de Valores Extranotariais e Cadastro de Novos Serviços de Despesas. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. No Orion TN, acesse **Configurações > Tabela de Custas > Extranotariais**.
2. Conferir com o setor financeiro da serventia os tipos de despesas reembolsáveis autorizados pela Corregedoria Geral.
3. Cadastrar o novo item definindo a alíquota de ISS e se o valor é repassado integralmente.
4. Realizar lançamento em protocolo de teste para conferir a separação das custas na guia de depósito prévio.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
