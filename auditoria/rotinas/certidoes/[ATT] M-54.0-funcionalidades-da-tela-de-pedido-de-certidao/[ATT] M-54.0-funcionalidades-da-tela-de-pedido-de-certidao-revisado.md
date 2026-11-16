---
id: M-54.0
titulo: 'Funcionalidades da Tela de Pedido de Certidão'
modulo: certidoes
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Pedido de certidão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Abertura de pedido; Notas; Notas > Nova certidão e serviço (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Apresenta as funcionalidades da barra de ferramentas da tela de Pedidos de Certidão, centralizando comandos para abertura, edição, auditoria de andamentos, emissão de recibos e geração de selos digitais.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Pedido de certidão**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Pedido de certidão] não localizado no DOM nem na Árvore de Acessibilidade
2. Utilize os comandos do menu superior:
   * **Novo**: inicia o preenchimento de uma nova requisição de certidão.
   * **Editar**: habilita a alteração do pedido de certidão em exibição.
   * **Salvar**: grava as informações e cálculos preenchidos nos cards.
   * **Pedidos em aberto**: abre uma janela com a relação de todos os pedidos em tramitação na serventia.
   * **Andamentos**: exibe a trilha de auditoria completa com histórico de alterações.
   * **Gerar recibo**: imprime o recibo provisório ou definitivo com o número do protocolo e valor pago.
   * **Selo digital**: exibe os selos digitais emitidos vinculados à certidão expedida.
   * **Inutilizar**: cancela formalmente o pedido caso o requerente desista ou ocorra erro não sanável.
3. Preencha os cards estruturais e conclua o atendimento.

* **Importante: A inutilização de um pedido de certidão que já consumiu selo fiscal exige justificativa formal e descarte do selo perante a fiscalização.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
