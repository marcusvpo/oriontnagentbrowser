---
id: C-CERT-03
titulo: 'Emissão de Certidão de Ato Legado não Digitalizado com Anexo do Livro Físico'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Certidão de Ato Antigo / Não Digitalizado']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Certidões > Novo Pedido de Certidão'
        elemento_real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: false
        evidencia: 'dom-measured | text:pesquise aqui o nome da tela que deseja acessar. atalho: ctrl + b | x=135, y=72, 1171x30'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Certidão de Ato Antigo / Não Digitalizado", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas > Nova certidão e serviço (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Serventias centenárias possuem grande acervo anterior à informatização. O Orion TN dispõe de rotina para emissão avulsa de certidões sobre atos legados, com cobrança no caixa e aposição de selo digital do tribunal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Certidões > Novo Pedido de Certidão"**, porém na tela atual do Orion TN o elemento se chama **"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"** (confiança: 96% — Sinônimo canônico Orion TN ('Certidões > Novo Pedido de Certidão' -> 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B')). O texto do manual não foi alterado.
2. Marque a opção **Certidão de Ato Antigo / Não Digitalizado**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Certidão de Ato Antigo / Não Digitalizado] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Informe os dados manuais da busca: **Número do Livro**, **Folhas Inicial/Final** e **Data da Lavratura Original**.
4. Informe os nomes das partes principais para constarem no recibo e no índice de buscas.
5. No **Orion Caixa**, efetue o recebimento dos emolumentos e gere o recibo financeiro.
6. Na aba **Editor da Certidão**:
7. Se for inteiro teor reprográfico: clique em **Anexar Imagem Escaneada do Livro (GED)** e selecione o PDF do livro físico.
8. Se for em breve relato: digite o teor certificatório no modelo padrão.
9. Clique em **Finalizar e Emitir Selo Digital**. O selo será vinculado à remessa do tribunal normalmente.

* **Acervo Histórico: Ao emitir certidão de ato legado, o sistema aproveita os dados digitados para alimentar o índice notarial retroativo da serventia.**
