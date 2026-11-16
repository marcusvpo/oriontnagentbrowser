---
id: V-7.4.2
titulo: 'Consulta e Inserção de Hashes da CNIB (Central de Indisponibilidade) no Livro'
modulo: livros
secao: V
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
      alvos_ausentes: ['Livro', 'Canetinha', 'Editor']
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
> **Motivo Técnico:** No passo 1, o manual cita "Livro", "Canetinha", "Editor", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas > Consultas > Editor; Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Procedimento para realização da consulta integrada de indisponibilidade de bens junto à **CNIB** via token institucional do cartório diretamente no editor do livro de notas, com inserção parametrizada das certidões e hashes no texto e sincronização cadastral no protocolo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra a versão de impressão do **Livro** clicando no ícone da **Canetinha** na aba **Editor** do protocolo.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Livro, Canetinha, Editor] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Posicione o cursor do mouse exatamente no parágrafo do texto onde a cláusula de certidão de indisponibilidade deve ser inserida.
3. Na barra de ferramentas inferior do editor, clique no botão **Central de Indisponibilidade**.
   * O **ORION TN** executará a consulta automática à base da **CNIB** utilizando o token configurado da serventia, sem necessidade de selecionar certificados individuais no navegador, gerando os códigos hash de todas as partes cadastradas.
4. Na janela suspensa exibida com o modelo de certidão homologado para o cartório:
   * Revise o texto da certidão, o qual reflete a constatação de inexistência (ou existência) de ordens de indisponibilidade para os CPFs/CNPJs consultados;
   * Ajuste eventuais termos caso necessário e clique em **Inserir**. O bloco de texto com os hashes será incluído na posição exata do cursor.
5. **Método Alternativo (Caso a consulta tenha sido gerada sem posicionamento prévio do cursor):**
   * Posicione o cursor no local correto do texto.
   * Na barra lateral do editor, clique no ícone da **Lupa**.
   * Selecione a opção **Consulta CNIB**.
   * Clique no ícone do **Olho** (**Abrir Detalhe do Texto**) para visualizar o conteúdo e clique diretamente no item para inseri-lo no texto.
6. Na barra inferior do editor, clique no botão **Concluir** para salvar a certidão no livro e feche a guia do editor.
7. Ao retornar à tela do protocolo, o sistema exibirá notificações na tela confirmando a emissão dos hashes.
8. Pressione o atalho de teclado `Ctrl + Shift + R` para recarregar a tela do protocolo sem sair da sessão.
9. Acesse a aba **Partes** para auditar e conferir os números de hash da **CNIB** gravados individualmente no cadastro de cada parte.

* **Observação: O recarregamento via `Ctrl + Shift + R` serve para conferência dos hashes nos cadastros individuais das partes no protocolo, não sendo um requisito impeditivo para a impressão física do livro caso o texto já tenha sido inserido no editor.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
