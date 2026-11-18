---
id: V-3.0
titulo: 'Como Consultar o Estoque de Produtos'
modulo: selos
secao: V
auditoria_ui:
  data_execucao: '2026-11-18'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-2.4', 'D-2.7']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Data']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Consultas > Estoque'
        elemento_real: 'Administração > Controle de Estoque > Consultas'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlp7mstf23n28-66] | x=474, y=171, 190x21'
      - passo: 2
        alvo_documentado: 'Data'
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Categoria", "Produto", "Data", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o per'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Consultas > Estoque'
          real: 'Administração'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Consultas > Estoque" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escrituras para Regi'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 7 coluna(s) visível(is) (Produto, Categoria, Série, Seq. Inicial, Seq. Final, Quantidade) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios para efetuar a busca), "Imprimir"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-2.4 — Cadastrar Categoria de Produto; D-2.7 — Cadastrar Produto.

#### Descrição:
O Orion Stock oferece ferramentas de consulta para rastrear cada item do estoque, seja de forma geral ou detalhada.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-2.4 (Cadastrar Categoria de Produto) para criar o registro necessário.
2. Executar antes a rotina D-2.7 (Cadastrar Produto) para criar o registro necessário.
3. Reexecutar a auditoria da rotina V-3.0.

* **Rotinas pré-requisito (executar antes):** **D-2.4**, **D-2.7**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No módulo **Orion Stock**, acesse o menu **Administração > Consultas > Estoque**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Estoque** · (3) **Consultas** · (4) **Estoque**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Consultas > Estoque"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Estoque > Consultas"** (confiança: 88% — Grafo vivo de rotas (orion-route-graph.json): "Estoque" é seção "Estoque" da tela "Administração > Controle de Estoque > Consultas"). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Categoria, Série, Seq. Inicial, Seq. Final, Quantidade).
2. Utilize os filtros disponíveis, como **Categoria**, **Produto**, **Data**, entre outros, para refinar a pesquisa.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Categoria** · (2) **Produto**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Data"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Categoria, Série, Seq. Inicial, Seq. Final, Quantidade).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Data"
3. Selecione o **Tipo de Consulta**:
   * **Resumida:** Mostra os intervalos de numeração e seus status de forma consolidada (ex.: "Selo 1 a 15, consumido"; "Selo 51 a 100, em estoque").
   * **Detalhada:** Lista cada item (selo ou papel) individualmente com seu status e oferece mais opções de gerenciamento.
4. Clique em **Filtrar**.
5. Na consulta **Detalhada**, a linha de cada item apresentará opções adicionais, como:
   * **Cancelamento**;
   * **Inutilização**;
   * **Andamentos (Logs)**.
6. É possível também estornar um produto específico que já foi utilizado, tornando-o disponível para reutilização.

* **Resumida: Mostra os intervalos de numeração e seus status de forma consolidada (ex.: "Selo 1 a 15, consumido"; "Selo 51 a 100, em estoque").**
* **Detalhada: Lista cada item (selo ou papel) individualmente com seu status e oferece mais opções de gerenciamento.**
* **Cancelamento**;
   * **Inutilização**;
   * **Andamentos (Logs)**.
6. É possível também estornar um produto específico que já foi utilizado, tornando-o disponível para reutilização.

* **Observação: A reutilização de um selo deve ser iniciada primeiro na tela de serviço onde ele foi originalmente utilizado, para depois ser estornado aqui no estoque.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Consultas > Estoque" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escrituras para Regi → **superado** (agora: passo 2, Dependência Cruzada de Rotina)
