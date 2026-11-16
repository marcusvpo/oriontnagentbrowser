---
id: C-CONFIG-08
titulo: 'Parametrização e Configuração de Nova Estação de Trabalho com Driver ODBC e Fontes Siplan'
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **instalação de pacotes no windows / fontes de sistema** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Requer instalação local do driver PostgreSQL ODBC 64-bit, configuração de DSN no Windows e instalação dos arquivos de fontes tipográficas (Oswald, Lato).

#### Descrição:
Parametrização e Configuração de Nova Estação de Trabalho com Driver ODBC e Fontes Siplan. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Instalar o driver PostgreSQL ODBC 64/32-bit na máquina do usuário.
2. Configurar o DSN de sistema no `odbcad32.exe` apontando para o host de banco do cartório.
3. Instalar as fontes institucionais Siplan na pasta `C:\Windows\Fonts`.
4. Instalar o cliente do Integrador SPCM para comunicação com impressoras e scanners.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
