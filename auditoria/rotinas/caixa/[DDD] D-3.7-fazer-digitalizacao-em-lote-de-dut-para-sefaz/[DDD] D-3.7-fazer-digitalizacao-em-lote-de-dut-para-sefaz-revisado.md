---
id: D-3.7
titulo: 'Fazer Digitalização em Lote de DUT para SEFAZ'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** A digitalização em lote de DUT exige os documentos físicos no alimentador de um scanner homologado (300 DPI) antes do envio à SEFAZ: hardware TWAIN indisponível no ambiente web de homologação.

#### Descrição:
Esta rotina gerencia o processamento digital dos Documentos Únicos de Transferência de veículos reconhecidos por autenticidade. O sistema digitaliza o lote de formulários, valida a legibilidade exigida pelo DETRAN e anexa as imagens para disparo automático à SEFAZ.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Posicione os DUTs físicos com as assinaturas reconhecidas no alimentador do scanner em resolução homologada (300 DPI, escala de cinza/preto e branco).
2. Acesse o menu **Firmas > Reconhecimento de Firmas > Digitalização de DUT**.
3. Selecione a opção **Digitalização em Lote**.
4. Clique em **Iniciar Digitalização** para processar os documentos.
5. Revise as imagens capturadas e vincule eventuais DUTs pelo número do pedido ou placa/Renavam.
6. Clique em **Salvar e Enviar para SEFAZ** para despachar a remessa de comunicação eletrônica.

* **Importante: A comunicação tempestiva de venda de veículos à SEFAZ/DETRAN é exigência legal e previne a responsabilização solidária por infrações de trânsito.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
