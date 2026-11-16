---
id: M-13.0
titulo: 'Abertura de Pedido de Firmas com Senha (Pré-Atendimento)'
modulo: centrais
secao: M
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
> **Motivo Técnico:** No passo 1, o manual cita "Firmas > Atendimento > Abertura de pedido com senha", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Abertura de pedido; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Rotina voltada à triagem e recepção do cartório para registrar a demanda inicial do usuário, emitir a senha de atendimento e adiantar o lançamento de partes e atos antes da chamada no guichê.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Atendimento > Abertura de pedido com senha**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Firmas > Atendimento > Abertura de pedido com senha] não localizado no DOM nem na Árvore de Acessibilidade
2. Clique no botão **Novo** para gerar a senha sequencial de fila conforme a prioridade (Normal ou Preferencial).
3. Na seção de partes, informe o nome e documento dos interessados que solicitaram os serviços.
4. Na seção de serviços, selecione os atos solicitados (ex: Reconhecimento por Semelhança, Autenticação de Cópia) e indique as quantidades estimadas.
5. Clique no botão **Concluir o pedido** para enviar a solicitação para a fila do painel e imprimir o comprovante de senha do cidadão.
6. O escrevente do guichê receberá o pedido pronto para conferência ao chamar a respectiva senha.

* **Observação: Todos os dados inseridos na triagem podem ser revisados, complementados ou corrigidos pelo escrevente no momento do atendimento definitivo.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
