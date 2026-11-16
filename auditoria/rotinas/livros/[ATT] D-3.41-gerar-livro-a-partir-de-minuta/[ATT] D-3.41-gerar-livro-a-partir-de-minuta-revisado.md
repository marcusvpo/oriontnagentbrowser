---
id: D-3.41
titulo: 'Gerar Livro a partir de Minuta'
modulo: livros
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Gerar Livro Definitivo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Gerar Livro Definitivo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A conversão da minuta em Livro Definitivo é o ápice solene do ato notarial. O sistema reserva a numeração do livro e folhas oficiais, insere os termos solenes de abertura e encerramento notarial, gera o selo digital principal da escritura e trava o documento contra alterações.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No editor da minuta conferida e aprovada, clique no comando **Gerar Livro Definitivo**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Gerar Livro Definitivo] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Selecione o **Livro de Notas Ativo** (o sistema sugerirá a próxima folha disponível na sequência).
3. Confira a numeração inicial e final de folhas que a escritura consumirá.
4. Execute a revalidação da consulta à **CENIB** para todas as partes.
5. Clique em **Confirmar e Gerar Livro**; o sistema emitirá o selo digital do ato e montará a diagramação oficial.
6. Imprima as folhas oficiais no livro de folhas soltas e colha as assinaturas das partes e do tabelião/escrevente.

* **Importante: Uma vez gerado o livro, o ato torna-se público e definitivo; eventuais erros materiais só poderão ser corrigidos por escritura de rerratificação.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
