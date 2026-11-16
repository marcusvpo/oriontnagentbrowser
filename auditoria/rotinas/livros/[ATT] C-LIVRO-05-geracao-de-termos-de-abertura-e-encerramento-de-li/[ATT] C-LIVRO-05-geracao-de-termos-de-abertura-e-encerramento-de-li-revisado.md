---
id: C-LIVRO-05
titulo: 'Geração de Termos de Abertura e Encerramento de Livros Notariais'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-4'
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
> **Motivo Técnico:** No passo 1, o manual cita "Livros > Gestão de Livros Notariais", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Controle de Livros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Todo livro notarial exige termos de abertura (no frontispício) e de encerramento (no fecho), com a qualificação da serventia, capacidade de folhas e assinatura da autoridade delegatária.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Livros > Gestão de Livros Notariais**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Livros > Gestão de Livros Notariais] não localizado no DOM nem na Árvore de Acessibilidade
2. Selecione o tipo de livro (ex.: **Escrituras**, **Procurações** ou **Testamentos**).
3. Para **Novo Livro (Abertura)**:
4. Clique em **Cadastrar Novo Livro**, informe o número, total de folhas e selecione **Emitir Termo de Abertura**.
5. Para **Livro Concluído (Encerramento)**:
6. Localize o livro que atingiu a última folha útil e clique no botão **Encerrar Livro**.
7. O sistema compilará a quantidade exata de atos lavrados e eventuais folhas inutilizadas.
8. Clique em **Visualizar e Imprimir Termo de Encerramento**.
9. Colete a assinatura do Tabelião ou Substituto e encaminhe o volume para a encadernação oficial.

* **Normas da CGJ: O termo de encerramento deve conter expressamente a ressalva de todas as folhas inutilizadas no decorrer do livro.**
