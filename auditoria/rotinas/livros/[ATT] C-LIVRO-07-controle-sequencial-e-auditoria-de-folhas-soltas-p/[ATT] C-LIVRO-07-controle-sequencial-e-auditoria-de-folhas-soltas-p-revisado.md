---
id: C-LIVRO-07
titulo: 'Controle Sequencial e Auditoria de Folhas Soltas para Impressão de Escrituras'
modulo: livros
secao: C
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion Estoque > Livros Notariais > Controle de Folhas Soltas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion; Administração > Controle de Estoque; Administração > Controle de Livros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Em serventias que adotam o sistema de folhas soltas para posterior encadernação, cada folha consumida deve ser rigorosamente contabilizada no módulo de estoque para evitar desvios ou quebras de sequencial.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o módulo **Orion Estoque > Livros Notariais > Controle de Folhas Soltas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion Estoque > Livros Notariais > Controle de Folhas Soltas] não localizado no DOM nem na Árvore de Acessibilidade
2. Selecione o livro ativo e clique no botão **Auditoria de Sequência**.
3. O sistema listará todas as folhas: Utilizadas, Disponíveis e Inutilizadas.
4. Para registrar folhas que encravaram e foram danificadas fisicamente:
5. Clique sobre a numeração e acione **Baixa por Avaria Mecânica** (anexe a justificativa).
6. No campo **Próxima Folha a Alimentar**, informe o número que está efetivamente na gaveta da impressora.
7. Clique em **Gravar e Sincronizar Contador**.

* **Fiscalização Rigorosa: As folhas danificadas por atolamento devem ser carimbadas com o selo de "INUTILIZADA" e guardadas para fiscalização correicional.**
