---
id: M-54.2
titulo: 'Como Realizar a Busca do Ato Original em um Pedido de Certidão'
modulo: certidoes
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
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Busca']
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
> **Motivo Técnico:** No passo 1, o manual cita "Busca", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite pesquisar e associar o ato notarial arquivado na base da serventia (Livro, Folha, Número do Ato, Nomes das Partes) sobre o qual a certidão será expedida e selada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com o pedido de certidão salvo, acesse o card **Busca**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Busca] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Preencha os dados conhecidos do ato original:
   * **Espécie**: selecione se é Escritura, Procuração, Testamento ou Ata Notarial.
   * **Livro** e **Folha**: informe a localização física no arquivo de livros encadernados.
   * **Nº do Protocolo / Ato**: se possuir o número do processo notarial original.
   * **Partes**: digite o nome de qualquer outorgante ou outorgado do ato.
3. Clique no botão **Buscar Ato**.
4. O sistema exibirá os registros localizados no acervo do cartório.
5. Clique no registro correto para vinculá-lo ao pedido de certidão: o Orion TN carregará o resumo do ato original na tela.
6. Clique no botão **Salvar** na barra de ferramentas.

* **Observação: Para livros do período pré-informatizado não digitalizados, preencha manualmente os campos de livro e folha para permitir a escrituração física da certidão.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
