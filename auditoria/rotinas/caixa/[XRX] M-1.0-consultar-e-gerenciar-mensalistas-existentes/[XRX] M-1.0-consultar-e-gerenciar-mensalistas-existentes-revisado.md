---
id: M-1.0
titulo: 'Consultar e Gerenciar Mensalistas Existentes'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.61', 'D-3.62', 'M-2.0']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Documento', 'Número']
      alvos_revelados: ['Número']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Mensalistas'
        elemento_real: 'Administração > Mensalistas > Mensalistas'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxxgp0u77pzlj-79] | x=474, y=254, 190x21'
      - passo: 2
        alvo_documentado: 'Inativos'
        elemento_real: 'Inativo'
        camada: a11y_fuzzy_match
        confianca: 0.92
        texto_alterado: false
        evidencia: 'dom-measured | text:inativo | x=1156, y=325, 168x29'
      - passo: 2
        alvo_documentado: 'Documento'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Número'
        elemento_real: 'Número'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1251, y=604, 163x24'
        evidencia: 'dom-measured | text:número | x=608, y=215, 106x40'
  historico_reauditoria:
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Mensalistas", "Pesquisar por mensalista", "Documento", "Número", "Inativos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto pa'
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
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 3 coluna(s) visível(is) (Arquivo, Tipo, Tamanho) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obrigatórios.)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.61 — Cadastrar Mensalista; D-3.62 — Gerar Fatura de Mensalista; M-2.0 — Criar um Novo Cadastro de Mensalista.

#### Descrição:
A tela de Mensalistas centraliza a visualização e gestão de clientes conveniados (Pessoa Física e Pessoa Jurídica), permitindo consultas rápidas, alteração cadastral e controle de bloqueio ou inativação para faturamento.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.61 (Cadastrar Mensalista) para criar o registro necessário.
2. Executar antes a rotina D-3.62 (Gerar Fatura de Mensalista) para criar o registro necessário.
3. Executar antes a rotina M-2.0 (Criar um Novo Cadastro de Mensalista) para criar o registro necessário.
4. Reexecutar a auditoria da rotina M-1.0.

* **Rotinas pré-requisito (executar antes):** **D-3.61**, **D-3.62**, **M-2.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Mensalistas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Mensalistas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Mensalistas"**, porém na versão atual do Orion TN a tela fica em **"Administração > Mensalistas > Mensalistas"** (confiança: 95% — O caminho documentado "Administração > Mensalistas" termina num submenu em cascata; a única tela homônima é o item filho "Administração > Mensalistas > Mensalistas"). O texto do manual não foi alterado.
2. Na tela inicial de **Mensalistas**, visualize a listagem padrão ou preencha os filtros desejados: **Pesquisar por mensalista**, **Documento** (CPF/CNPJ), **Número** ou marque **Inativos**.
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   [aqui vai a print "passo-02-c.png"]
   > [!NOTE] **Demarcações na print:** (1) **Mensalistas** · (2) **Pesquisar por mensalista** · (3) **Inativo** · (4) **Adicionar** · (5) **Número**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Inativos"**, porém na tela atual do Orion TN o elemento se chama **"Inativo"** (confiança: 92% — Similaridade semântica na árvore de acessibilidade (92%)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Documento"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Número"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-02-b.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Documento"
3. Clique em **Filtrar** (ou pressione **Enter**) para carregar os registros correspondentes na tabela.
4. Na coluna de ações do mensalista desejado, utilize as opções disponíveis:
   * **Visualizar**: exibe os dados cadastrais completos em modo consulta.
   * **Editar**: abre o formulário de cadastro para atualização de dados, limites e e-mails.
   * **Bloquear**: trava o apontamento de novos serviços no balcão sem inativar o contrato.
   * **Inativar**: desativa o cadastro permanentemente para novas operações.
5. Caso necessite redefinir os campos de pesquisa, clique em **Limpar**.

* **Importante: Mensalistas **Inativados** não ficam disponíveis para seleção em pedidos de balcão ou protocolos.**
* **Observação: O mensalista **Bloqueado** mantém seu cadastro no sistema, mas qualquer tentativa de lançar atos em sua conta emitirá alerta impeditivo no balcão de atendimento.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Mensalistas", "Pesquisar por mensalista", "Documento", "Número", "Inativos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto pa → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
