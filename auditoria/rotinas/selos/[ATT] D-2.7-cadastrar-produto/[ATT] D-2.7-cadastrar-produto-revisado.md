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
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Nome do Produto']
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwk883316b4d6u-70] | x=286, y=233, 188x21'
      - passo: 3
        alvo_documentado: 'Nome do Produto'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
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
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T05:05:29.303Z'
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
    alvos_do_passo: ['Nome do Produto', 'Categoria']
    correspondencias_sugeridas:
      - alvo: 'Nome do Produto'
        elemento_real: 'Cadastro de produto'
        tipo: 'seção'
        similaridade: 0.53
      - alvo: 'Categoria'
        elemento_real: 'Categoria'
        tipo: 'campo'
        similaridade: 1
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Nome do Produto por Cadastro de produto (seção). Categoria existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Négocios > Cadastros > Produto (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/produto/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de produto**.
> * **Campos:** **Categoria**, **Descrição**, **Unidade**, **Responsável**, **Estoque mínimo**, **Distribuição**, **Quantidade de atos**, **Código de barras**, **Prefixo**, **Cod. Referencia**, **Observações**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Nome do Produto":** **Cadastro de produto** (seção, 53% — termo(s) em comum: produto).
> * **Correspondência sugerida para "Categoria":** **Categoria** (campo, 100% — termo(s) em comum: categoria).
> * Sugestão de reescrita: no passo 3, substituir **Nome do Produto** por **Cadastro de produto** (seção). **Categoria** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
O cadastro de produtos formaliza todos os itens geridos no cartório, incluindo insumos de segurança (papel moeda, selos digitais/físicos, etiquetas) e itens administrativos. Permite configurar o estoque mínimo de segurança e se o item exige controle de série/folha.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
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
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nome do Produto"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nome do Produto"
4. Selecione a **Unidade de Medida** (Folha, Unidade, Milhar) e informe o **Estoque Mínimo**.
5. Configure as opções de rastreabilidade:
   * Marque **Controlar por Sequência Numérica/Série** para insumos oficiais.
   * Defina o **Critério Padrão de Distribuição** (igualitária ou manual).
6. Clique em **Salvar** para registrar o produto no catálogo da serventia.

* **Importante: Insumos marcados com controle sequencial exigem a digitação ou leitura por código de barras dos números inicial e final em cada distribuição.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Configurações > Cadastros Auxiliares > Produto" → "Administração > Controle de Estoque > Cadastros > Produto" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
