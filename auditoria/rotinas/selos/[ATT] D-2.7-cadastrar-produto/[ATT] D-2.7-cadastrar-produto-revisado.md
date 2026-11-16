---
id: D-2.7
titulo: 'Cadastrar Produto'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
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
        confianca: 0.8
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwivc613193at0-66] | x=137, y=290, 237x26'
      - passo: 3
        alvo_documentado: 'Nome do Produto'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome do Produto", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Négocios > Cadastros > Produto (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

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
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Produto"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Estoque > Cadastros > Produto"** (confiança: 80% — Item "Produto" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
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
