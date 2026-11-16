---
id: C-CONFIG-04
titulo: 'Desbloqueio de Spooler do Windows e Configuração de Porta RAW para Impressão Rápida'
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **sistema operacional windows / services.msc** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Demanda intervenção direta no Windows da estação local: parar serviço `spooler`, limpar arquivos temporários em `System32\spool\PRINTERS` e reiniciar.

#### Descrição:
Desbloqueio de Spooler do Windows e Configuração de Porta RAW para Impressão Rápida. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Abrir o prompt de comando como Administrador na estação do escrevente.
2. Executar `net stop spooler` para interromper a fila travada.
3. Excluir todos os arquivos `.shd` e `.spl` dentro da pasta `C:\Windows\System32\spool\PRINTERS`.
4. Executar `net start spooler` e conferir se as impressões do Orion TN voltam a fluir imediatamente.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
