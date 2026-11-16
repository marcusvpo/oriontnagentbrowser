---
id: D-3.60
titulo: 'Cadastrar Livro para Consumo'
modulo: livros
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Cadastros > Livro para Consumo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Notas; Relatórios > Índice por livro; Relatórios > Livro Protocolo; Administração > Controle de Estoque > Consumo manual (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O cadastro de livros notariais formaliza a abertura de novos volumes de escrituras, procurações, testamentos ou atas no sistema. Registra o número do volume, a quantidade total de folhas autorizadas pela Corregedoria, a folha inicial e gera o solene Termo de Abertura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros > Livro para Consumo**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Cadastros > Livro para Consumo] não localizado no DOM nem na Árvore de Acessibilidade
2. Clique no botão **Adicionar Novo Livro**.
3. Selecione a **Espécie de Livro** (Escrituras, Procurações, Testamentos ou Atas Notariais).
4. Informe o **Número do Livro** (em algarismos arábicos ou romanos), a **Folha Inicial** (geralmente 001) e a **Capacidade Total de Folhas** (ex: 200 folhas).
5. Preencha os dados do **Termo de Abertura** com a data oficial e o nome do tabelião/substituto.
6. Clique em **Salvar e Imprimir Termo de Abertura** para arquivar a primeira folha no livro físico.

* **Importante: O livro cadastrado passará automaticamente a receber os novos atos notariais assim que o livro anterior for encerrado.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
