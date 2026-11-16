---
id: D-9.0
titulo: 'Excluir Movimentação Financeira em Pedido de Certidão'
modulo: certidoes
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Consultas > Consulta de Certidões e Serviços", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Consultas; Firmas > Consultas > Serviços praticados; Notas; Notas > Certidões e serviços; Notas > Certidões e serviços em aberto (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Caso um lançamento financeiro (pagamento à vista ou depósito prévio) tenha sido lançado erroneamente em um pedido de certidão, esta rotina permite sua exclusão direta na tela de edição do ato. O procedimento estorna a entrada do caixa e restaura a cobrança do saldo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No menu principal do Orion TN, acesse **Notas > Consultas > Consulta de Certidões e Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Consultas > Consulta de Certidões e Serviços] não localizado no DOM nem na Árvore de Acessibilidade
2. Utilize os filtros de busca para localizar a certidão específica e clique no botão **Editar** (ícone de lápis).
3. Dentro da certidão, clique no ícone de **Cifrão ($)** na barra superior para acessar a movimentação de caixa.
4. Role a tela até o quadro de **Lançamentos Financeiros Vinculados**.
5. Identifique o lançamento que deseja remover e clique no botão **Excluir (ícone X)**.
6. O sistema exibirá aviso de confirmação; clique em **Confirmar** para finalizar o estorno da movimentação.

* **Importante: A exclusão remove imediatamente o crédito do saldo do caixa ativo do operador e reabre o pedido para novo recebimento.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
