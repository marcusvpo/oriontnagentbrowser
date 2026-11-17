---
id: C-SELO-03
titulo: 'Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-2.7', 'D-2.4']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador', 'substituto']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'marcus'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webFirmas', 'Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque']
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Online', 'Modo de Selagem Offline (Contingência)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Parâmetros Gerais > Selo Digital'
        elemento_real: 'Administração > Comunicações > Selo digital'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwk7yxrwertuu2-57] | x=474, y=129, 190x21'
      - passo: 2
        alvo_documentado: 'Modo de Envio do Selo Digital'
        elemento_real: 'Selo digital '
        camada: a11y_fuzzy_match
        confianca: 0.76
        texto_alterado: false
        evidencia: 'dom-measured | @e954 | x=411, y=230, 166x26'
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera '
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Modo de Envio do Selo Digital'
          real: 'Selo digital '
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Configurações > Parâmetros Gerais > Selo Digital'
          real: 'Administração > Comunicações > Selo digital'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-2.7 — Cadastrar Produto; D-2.4 — Cadastrar Categoria de Produto.

#### Descrição:
O Provimento Geral da Justiça autoriza a selagem em modo de contingência offline em casos de instabilidade técnica comprovada, permitindo que a serventia reserve a numeração localmente para envio posterior.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-2.7 (Cadastrar Produto) para criar o registro necessário.
2. Executar antes a rotina D-2.4 (Cadastrar Categoria de Produto) para criar o registro necessário.
3. Reexecutar a auditoria da rotina C-SELO-03.

* **Rotinas pré-requisito (executar antes):** **D-2.7**, **D-2.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parâmetros Gerais > Selo Digital** (ou aba **Integração TJ**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Selo digital**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parâmetros Gerais > Selo Digital"**, porém na versão atual do Orion TN a tela fica em **"Administração > Comunicações > Selo digital"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
2. Localize a opção **Modo de Envio do Selo Digital**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Modo de Envio do Selo Digital"**, porém na tela atual do Orion TN o elemento se chama **"Selo digital "** (confiança: 76% — Similaridade semântica na árvore de acessibilidade (76%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
3. Altere o parâmetro de **Online** para **Modo de Selagem Offline (Contingência)**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Online, Modo de Selagem Offline (Contingência)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Clique no botão **Salvar**.
5. Caso o usuário receba alerta de acesso negado: libere a permissão em **Usuários e Perfis > Módulo Selos > Alternar Contingência**.
6. Prossiga com os atendimentos e lavraturas normalmente (os selos serão numerados pela base local).
7. Assim que o tribunal restabelecer a operação: retorne o parâmetro para **Online** e acione **Transmitir Lote de Contingência Acumulado**.

* **Alerta de Sincronização: Nunca encerre o expediente sem retransmitir todos os selos gerados em modo offline para evitar penalidades de envio fora do prazo legal.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 3 — Dependência Cruzada de Rotina: No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera  → **mantido** (agora: passo 3, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 2):** "Modo de Envio do Selo Digital" → "Selo digital " — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Configurações > Parâmetros Gerais > Selo Digital" → "Administração > Comunicações > Selo digital" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
