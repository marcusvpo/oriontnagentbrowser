---
id: R-32.1
titulo: 'Solução para o Erro ''O serviço local não foi encontrado'' nas Comunicações'
modulo: centrais
secao: R
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_dados_banco
  carga: read_only
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** Depende do aplicativo local Integrador Local na estação Windows e leitura de certificado digital A3 para comunicação com órgãos externos.

#### Descrição:
Este erro ocorre quando o aplicativo auxiliar **Integrador Local da Siplan** não está em execução ou não se encontra instalado no computador do usuário, impedindo que o Orion TN se conecte a serviços externos (como SIGNO, ITCMD e DOI).

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Verifique a barra de tarefas do Windows (ao lado do relógio) para checar se o ícone do **Integrador Local** está ativo.
2. Caso o programa esteja fechado, abra o menu Iniciar do Windows, pesquise por **"Integrador Local"** e clique para executá-lo.
3. Aguarde o aplicativo carregar e certifique-se de que o ícone permaneça verde na barra de tarefas.
4. Retorne ao navegador no Orion TN, pressione a tecla **F5** para atualizar a página e repita a comunicação desejada com o órgão externo.
5. Se o aplicativo não estiver instalado em sua estação de trabalho, solicite a instalação à equipe de suporte técnico da serventia ou ao Service Desk Siplan.

* **Importante: O Integrador Local é um pré-requisito indispensável para leitura de certificados digitais A3 e comunicação com webservices governamentais.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**
