---
id: C-SELO-03
titulo: 'Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlior60fn1fnu-57] | x=474, y=129, 190x21'
      - passo: 2
        alvo_documentado: 'Modo de Envio do Selo Digital'
        elemento_real: 'Selo digital '
        camada: a11y_fuzzy_match
        confianca: 0.76
        texto_alterado: false
        evidencia: 'dom-measured | @e1111 | x=407, y=222, 159x26'
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
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
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
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"; pré-filtro automático tentado antes de declarar a grade vazia: a busca '
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-18T02:49:18.218Z'
    rota: '#/seloDigital'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Selo digital TJ-SP']
    abas: []
    campos:
      - rotulo: 'Status'
        tipo: 'select'
      - rotulo: 'Data do ato'
        tipo: 'text'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Série'
        tipo: 'text'
      - rotulo: 'Sequência'
        tipo: 'text'
      - rotulo: 'Selo digital'
        tipo: 'text'
      - rotulo: 'Período de geração'
        tipo: 'text'
      - rotulo: 'Serviço'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Comunicar', 'Totalizadores', 'Auditoria']
    alvos_do_passo: ['Online', 'Modo de Selagem Offline (Contingência)']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Online', 'Modo de Selagem Offline (Contingência)']
    sugestao_reescrita: 'Sugestão de reescrita: Online, Modo de Selagem Offline (Contingência) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Online", "Modo de Selagem Offline (Contingência)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/seloDigital**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Selo digital TJ-SP**.
> * **Campos:** **Status**, **Data do ato**, **Produto**, **Série**, **Sequência**, **Selo digital**, **Período de geração**, **Serviço**.
> * **Botões:** **Filtrar**, **Limpar**, **Comunicar**, **Totalizadores**, **Auditoria**.
> * **Sem correspondência funcional na tela:** **Online**, **Modo de Selagem Offline (Contingência)**.
> * Sugestão de reescrita: **Online**, **Modo de Selagem Offline (Contingência)** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
O Provimento Geral da Justiça autoriza a selagem em modo de contingência offline em casos de instabilidade técnica comprovada, permitindo que a serventia reserve a numeração localmente para envio posterior.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parâmetros Gerais > Selo Digital** (ou aba **Integração TJ**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Selo digital**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parâmetros Gerais > Selo Digital"**, porém na versão atual do Orion TN a tela fica em **"Administração > Comunicações > Selo digital"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
2. Localize a opção **Modo de Envio do Selo Digital**.
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Selo digital ** · (2) **Filtrar**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Modo de Envio do Selo Digital"**, porém na tela atual do Orion TN o elemento se chama **"Selo digital "** (confiança: 76% — Similaridade semântica na árvore de acessibilidade (76%)). O texto do manual não foi alterado.
   > [!NOTE] **Pré-filtro automático da grade:** grade sem linhas ao abrir a tela; após acionar "Filtrar" a grade passou a ter 2 linha(s) (nada foi gravado).
3. Altere o parâmetro de **Online** para **Modo de Selagem Offline (Contingência)**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Online, Modo de Selagem Offline (Contingência)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Clique no botão **Salvar**.
5. Caso o usuário receba alerta de acesso negado: libere a permissão em **Usuários e Perfis > Módulo Selos > Alternar Contingência**.
6. Prossiga com os atendimentos e lavraturas normalmente (os selos serão numerados pela base local).
7. Assim que o tribunal restabelecer a operação: retorne o parâmetro para **Online** e acione **Transmitir Lote de Contingência Acumulado**.

* **Alerta de Sincronização: Nunca encerre o expediente sem retransmitir todos os selos gerados em modo offline para evitar penalidades de envio fora do prazo legal.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 3 — Dependência Cruzada de Rotina: No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"; pré-filtro automático tentado antes de declarar a grade vazia: a busca  → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 2):** "Modo de Envio do Selo Digital" → "Selo digital " — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Configurações > Parâmetros Gerais > Selo Digital" → "Administração > Comunicações > Selo digital" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
