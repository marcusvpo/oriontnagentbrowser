---
id: M-62.0
titulo: 'Gerenciar Grupo de Itens'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  registros_mock_criados:
    - passo: 1
      rota: '#/grupoItem'
      botao_cadastro: 'Adicionar'
      botao_gravacao: 'Concluir'
      linhas_na_grade_apos: 1
      campos: ['Descrição=AUDIT-MOCK Descrição', 'Especialidade=Notas e Contratos Marítimos']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Firmas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Grupo de itens'
        elemento_real: 'Configurações > Tabela de custas > Grupo de item'
        camada: menu_path_resolution
        confianca: 0.7
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwigd59ra9nu52-92] | x=627, y=160, 217x26'
      - passo: 3
        alvo_documentado: 'Firmas'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Firmas", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Gerencia a segmentação e agrupamento das linhas da tabela de custas e emolumentos (ex: 'Escrituras com Valor Declarado', 'Escrituras sem Valor', 'Atos de Procuração', 'Reconhecimentos e Autenticações'), facilitando a organização tarifária.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Tabela de custas > Grupos de itens** (ou **Notas > Cadastros auxiliares > Grupo de itens**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Tabela de custas** · (3) **Grupo de item**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Grupo de itens"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Tabela de custas > Grupo de item"** (confiança: 70% — Item "Grupo de item" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem grupo de item cadastrados.".
   > [!NOTE] **Registro mock de pré-requisito criado (AUDIT-MOCK):** a grade estava vazia; o agente usou **Adicionar**, preencheu 2 campo(s) e gravou com **Concluir**. Linhas na grade depois: 1.
2. Na tela de listagem, consulte os grupos estruturados por especialidade.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem grupo de item cadastrados.".
3. No campo **Pesquisar por descrição**, digite o nome do grupo e selecione a **Especialidade** (**Notas** ou **Firmas**).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Pesquisar por descrição** · (2) **Especialidade** · (3) **Notas**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Firmas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem grupo de item cadastrados.".
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Firmas"
4. Clique no botão **Filtrar**.
5. Na linha do registro, selecione a ação correspondente:
   * **Visualizar**: exibe todos os subitens e faixas de custas pertencentes ao grupo.
   * **Editar**: permite atualizar a nomenclatura do agrupador.
   * **Inativar**: desabilita o grupo caso a tabela do Estado tenha sofrido reestruturação.
6. Para cadastrar um novo grupamento tarifário, clique no botão **Adicionar**.

* **Observação: O agrupamento correto mantém a seleção de itens de custas limpa e intuitiva durante a liquidação de protocolos e pedidos.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
