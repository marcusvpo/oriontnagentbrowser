---
id: R-23.0
titulo: 'Como Realizar a Distribuição de Produtos e Selos no Estoque'
modulo: selos
secao: R
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-2.7', 'D-2.4']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Usuários Individuais', 'Grupos de Usuários', 'Máquinas (estações)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Consulta'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Distribuição'
        elemento_real: 'Administração > Controle de Estoque > Distribuição'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwivui4r92v5hl-60] | x=373, y=160, 238x26'
      - passo: 3
        alvo_documentado: '"+"'
        elemento_real: '+'
        camada: a11y_fuzzy_match
        confianca: 0.98
        texto_alterado: false
        evidencia: 'dom-measured | @e167 | x=968, y=374, 40x30'
      - passo: 4
        alvo_documentado: 'Usuários Individuais'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 4
        alvo_documentado: 'Grupos de Usuários'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 4
        alvo_documentado: 'Máquinas (estações)'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 4, a tela está sem dados (grade com 3 coluna(s) visível(is) (Série, Sequência inicial, Sequência final) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obrigatórios para concluir)). O auto-seed foi tentado e não concluiu: "Concluir" permaneceu desabilitado após o preenchimento (obrigatórios vazios: Série, Portador).. Outra rotina do sistema gera esses registros: D-2.7 — Cadastrar Produto; D-2.4 — Cadastrar Categoria de Produto.

#### Descrição:
A rotina de distribuição transfere a custódia de produtos, selos físicos e papéis de segurança do almoxarifado central do cartório diretamente para colaboradores individuais, grupos ou estações de trabalho específicas.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-2.7 (Cadastrar Produto) para criar o registro necessário.
2. Executar antes a rotina D-2.4 (Cadastrar Categoria de Produto) para criar o registro necessário.
3. Reexecutar a auditoria da rotina R-23.0.

* **Rotinas pré-requisito (executar antes):** **D-2.7**, **D-2.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No módulo **Orion Estoque**, acesse o menu **Administração > Distribuição**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Estoque** · (3) **Distribuição**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Distribuição"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Estoque > Distribuição"** (confiança: 95% — Item "Distribuição" localizado na árvore de navegação em outra rota (1 de 1 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
2. Na aba **Distribuição**, selecione a **Categoria** e o **Produto** desejado para que o sistema relacione os lotes disponíveis.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Distribuição** · (2) **Categoria** · (3) **Produto**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
3. Escolha a série e sequência que deseja distribuir clicando na seta de transferência para a direita ou use o botão **"+"** para inclusão manual.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **""+""**, porém na tela atual do Orion TN o elemento se chama **"+"** (confiança: 98% — Similaridade semântica na árvore de acessibilidade (95%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
4. No campo **Portador**, defina o destinatário do lote, selecionando entre **Usuários Individuais**, **Grupos de Usuários** ou **Máquinas (estações)**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Usuários Individuais"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Grupos de Usuários"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Máquinas (estações)"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Usuários Individuais", "Grupos de Usuários", "Máquinas (estações)"
5. Revise as quantidades e numerações atribuídas e clique no botão **Concluir** para registrar a entrega.
6. **Para consultar ou estornar:** Na mesma tela, clique na aba **Consulta**, localize a entrega pelos filtros e clique em **Estornar** (caso o produto ainda não tenha sido consumido).

* **Importante: Produtos que já sofreram consumo em atos ou selagens de balcão não podem ser estornados para o estoque central.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
