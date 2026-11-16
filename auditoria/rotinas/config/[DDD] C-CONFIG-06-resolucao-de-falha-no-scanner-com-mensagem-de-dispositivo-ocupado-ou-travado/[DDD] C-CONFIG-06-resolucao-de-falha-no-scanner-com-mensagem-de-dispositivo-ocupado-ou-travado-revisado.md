---
id: C-CONFIG-06
titulo: 'Resolução de Falha no Scanner com Mensagem de Dispositivo Ocupado ou Travado'
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **driver de hardware / processos órfãos no so** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Processo de escaneamento em segundo plano retém a porta USB; requer matar o processo via Gerenciador de Tarefas ou reiniciar o serviço TWAIN.

#### Descrição:
Resolução de Falha no Scanner com Mensagem de Dispositivo Ocupado ou Travado. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Abrir o Gerenciador de Tarefas (`Ctrl + Shift + Esc`).
2. Localizar e encerrar processos órfãos de captura (ex: `DocuViewareServer.exe`, `twain.exe`, `integrador.exe`).
3. Desconectar e reconectar o cabo USB do scanner.
4. Reabrir o Orion TN e acionar a captura novamente.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
