---
id: D-2.7
titulo: 'Cadastrar Produto'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 6
      alvos_ausentes: ['Salvar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Produto'
        elemento_real: 'Administração > Controle de Estoque > Cadastros > Produto'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkxxx5f77ovg-70] | x=286, y=233, 188x21'
      - passo: 3
        alvo_documentado: 'Nome do Produto'
        elemento_real: 'Descrição'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | text:descrição | x=314, y=89, 576x40'
      - passo: 4
        alvo_documentado: 'Unidade de Medida'
        elemento_real: 'Unidade'
        camada: a11y_fuzzy_match
        confianca: 0.75
        texto_alterado: false
        evidencia: 'dom-measured | text:unidade | x=902, y=89, 133x40'
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Cadastros Auxiliares > Produto'
          real: 'Administração > Controle de Estoque > Cadastros > Produto'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e nã'
      bloqueio_atual:
        passo: 6
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Cadastros Auxiliares > Produto'
          real: 'Administração > Controle de Estoque > Cadastros > Produto'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 6
    capturado_em: '2026-11-17T17:06:51.268Z'
    rota: '#/produto/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de produto']
    abas: []
    campos:
      - rotulo: 'Categoria'
        tipo: 'select'
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Unidade'
        tipo: 'select'
      - rotulo: 'Responsável'
        tipo: 'text'
      - rotulo: 'Estoque mínimo'
        tipo: 'text'
      - rotulo: 'Distribuição'
        tipo: 'select'
      - rotulo: 'Quantidade de atos'
        tipo: 'select'
      - rotulo: 'Código de barras'
        tipo: 'select'
      - rotulo: 'Prefixo'
        tipo: 'text'
      - rotulo: 'Cod. Referencia'
        tipo: 'text'
      - rotulo: 'Observações'
        tipo: 'text'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Salvar']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Salvar']
    sugestao_reescrita: 'Sugestão de reescrita: Salvar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-06.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 6, o manual cita "Salvar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 6: rota **#/produto/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de produto**.
> * **Campos:** **Categoria**, **Descrição**, **Unidade**, **Responsável**, **Estoque mínimo**, **Distribuição**, **Quantidade de atos**, **Código de barras**, **Prefixo**, **Cod. Referencia**, **Observações**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **Salvar**.
> * Sugestão de reescrita: **Salvar** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-06.png (tela exata no momento do bloqueio).

#### Descrição:
O cadastro de produtos formaliza todos os itens geridos no cartório, incluindo insumos de segurança (papel moeda, selos digitais/físicos, etiquetas) e itens administrativos. Permite configurar o estoque mínimo de segurança e se o item exige controle de série/folha.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 6 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Produto**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Estoque** · (3) **Cadastros** · (4) **Produto**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Produto"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Estoque > Cadastros > Produto"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Preencha o **Nome do Produto** (ex: Papel de Segurança A4 - Escrituras) e a **Categoria**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Descrição** · (2) **Categoria**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Nome do Produto"**, porém na tela atual do Orion TN o elemento se chama **"Descrição"** (confiança: 90% — Sinônimo contextual da rota #/produto/cadastrar: o nome do produto é o campo "Descrição" (único campo de texto de identificação da tela)). O texto do manual não foi alterado.
4. Selecione a **Unidade de Medida** (Folha, Unidade, Milhar) e informe o **Estoque Mínimo**.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Demarcações na print:** (1) **Unidade** · (2) **Estoque Mínimo**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Unidade de Medida"**, porém na tela atual do Orion TN o elemento se chama **"Unidade"** (confiança: 75% — Rótulo visível na tela equivalente por inclusão de nome (75%)). O texto do manual não foi alterado.
5. Configure as opções de rastreabilidade:
   [aqui vai a print "passo-05.png"]
   > [!NOTE] As opções **Controlar por Sequência Numérica/Série**, **Critério Padrão de Distribuição** não estavam visíveis na tela durante a auditoria (dependem de um registro selecionado na listagem). Print sem demarcação.
   * Marque **Controlar por Sequência Numérica/Série** para insumos oficiais.
   * Defina o **Critério Padrão de Distribuição** (igualitária ou manual).
6. Clique em **Salvar** para registrar o produto no catálogo da serventia.
   [aqui vai a print "passo-06.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Salvar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar

* **Importante: Insumos marcados com controle sequencial exigem a digitação ou leitura por código de barras dos números inicial e final em cada distribuição.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e nã → **mantido** (agora: passo 6, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Configurações > Cadastros Auxiliares > Produto" → "Administração > Controle de Estoque > Cadastros > Produto" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
