---
id: D-3.72
titulo: 'Acessar Integração SGA (Sistema de Senhas)'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: read_only
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** A barra de atendimento do SGA depende do sistema de senhas instalado na serventia (painel/TV do salão, sinal sonoro e guichês físicos): serviço local e hardware externo indisponíveis no ambiente web de homologação.

#### Descrição:
A integração operacional com o SGA conecta o posto de atendimento do escrevente ao painel de TV da recepção do cartório. Permite acionar a próxima senha convencional ou preferencial, chamar novamente clientes ausentes e vincular o número da senha aos atos praticados.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na barra superior do Orion TN, localize a barra flutuante de atendimento do **SGA**.
2. Clique no botão **Chamar Próxima Senha** (ou selecione no menu suspenso a fila desejada: Prioritária, Firmas, Notas).
3. O sistema disparará o sinal sonoro e visual na TV do salão com o número da senha e o seu guichê.
4. Quando o cidadão se apresentar, clique em **Iniciar Atendimento**; o número da senha será vinculado aos serviços do balcão.
5. Se o cliente não comparecer, clique em **Chamar Novamente** ou em **Ausente** para convocar o próximo da fila.
6. Ao finalizar a entrega dos documentos, clique no botão **Encerrar Atendimento**.

* **Importante: A correta operação do SGA gera relatórios estatísticos de tempo médio de espera e atendimento auditados pelo CNJ.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
