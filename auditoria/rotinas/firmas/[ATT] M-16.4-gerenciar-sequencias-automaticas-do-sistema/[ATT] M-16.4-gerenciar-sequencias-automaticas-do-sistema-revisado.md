---
id: M-16.4
titulo: 'Gerenciar Sequências Automáticas do Sistema'
modulo: firmas
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
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Sequências automáticas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Controla os contadores numéricos sequenciais do sistema para protocolos de notas, recibos de pagamento, cartões de assinatura, certidões e pedidos de balcão, permitindo conferência e correções de numeração.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Sequências automáticas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Sequências automáticas] não localizado no DOM nem na Árvore de Acessibilidade
2. Na listagem de contadores do sistema, identifique o registro desejado (ex: 'Protocolo de Notas', 'Recibo de Caixa', 'Cartão de Assinatura', 'Pedido de Balcão').
3. Verifique o valor exibido na coluna **Último número gerado** e **Próximo número**.
4. Caso seja necessário ajustar a numeração por determinação judicial, correição ou virada de exercício, clique no botão **Editar** do registro.
5. Atualize o campo **Próximo número** com o valor correto e selecione se a sequência deve reiniciar anualmente.
6. Clique no botão **Salvar** para gravar o novo valor do contador.

* **Importante: A alteração manual de sequências deve ser realizada com cautela estrita para não gerar furos de numeração ou duplicidade de registros oficiais no livro.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
