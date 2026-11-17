---
id: M-61.0
titulo: 'Adicionar Nova Natureza'
modulo: centrais
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Sigla']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 2
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Naturezas'
        elemento_real: 'Configurações > Cadastros auxiliares > Natureza'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkzpytrbcgyik-108] | x=659, y=254, 191x21'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Descrição", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insufici'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Naturezas'
          real: 'Configurações > Cadastros auxiliares > Natureza'
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
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Espécie", "Escritura", "Procuração", "Ata Notarial", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuf'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Naturezas'
          real: 'Configurações > Cadastros auxiliares > Natureza'
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
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Sigla", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investig'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Descrição'
          real: 'Descrição'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Naturezas'
          real: 'Configurações > Cadastros auxiliares > Natureza'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-17T17:56:27.505Z'
    rota: '#/natureza/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de natureza', 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ', 'Perfil de partes e partes', 'Documentos apresentados', 'Usuários permitidos Usuários permitidos Use esta lista para restringir o acesso.']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'Espécie'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'CEP'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'CESDI'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'RCTO'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'ITCMD'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'Não informar livro e folhas'
        tipo: 'checkbox'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'Permitir a repetição do livro e folhas'
        tipo: 'checkbox'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'Utilização de imóvel *'
        tipo: 'select'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'inputPesquisaPerfilPartes'
        tipo: 'text'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'inputCheckboxMarcarTodosPerfilParticipacaoTO'
        tipo: 'checkbox'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
      - rotulo: 'inputCheckboxSelecionarTodosPerfilParte'
        tipo: 'checkbox'
        secao: 'Selecione um perfil de partes, uma parte ou um documento apresentado que deseja '
    botoes: ['Perfil de Partes', 'Partes', 'Documentos apresentados', 'Usuários', 'Limpar', 'Filtrar', 'Concluir', 'Voltar']
    alvos_do_passo: ['Sigla']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Sigla']
    sugestao_reescrita: 'Sugestão de reescrita: Sigla não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Sigla", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (2 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/natureza/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de natureza**, **Selecione um perfil de partes, uma parte ou um documento apresentado que deseja **, **Perfil de partes e partes**, **Documentos apresentados**, **Usuários permitidos Usuários permitidos Use esta lista para restringir o acesso.**.
> * **Campos:** **Descrição** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **Espécie** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **CEP** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **CESDI** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **RCTO** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **ITCMD** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **Não informar livro e folhas** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **Permitir a repetição do livro e folhas** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **Utilização de imóvel *** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **inputPesquisaPerfilPartes** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **inputCheckboxMarcarTodosPerfilParticipacaoTO** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ), **inputCheckboxSelecionarTodosPerfilParte** (Selecione um perfil de partes, uma parte ou um documento apresentado que deseja ).
> * **Botões:** **Perfil de Partes**, **Partes**, **Documentos apresentados**, **Usuários**, **Limpar**, **Filtrar** (desabilitado), **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **Sigla**.
> * Sugestão de reescrita: **Sigla** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar uma nova modalidade de negócio jurídico no acervo notarial do Orion TN, associando-a à sua espécie mãe, parametrizando obrigações de reporte à CENSEC e vinculando a tabela de custas.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Naturezas** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Natureza** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Naturezas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Natureza"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Perfil de partes).
2. No campo **Espécie**, selecione o gênero correspondente (ex: **Escritura**, **Procuração**, **Ata Notarial**).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Espécie** · (2) **Escritura / Procuração / Ata Notarial**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Perfil de partes).
3. No campo **Descrição**, digite a denominação jurídica formal da nova natureza (ex: 'Escritura Pública de Emancipação', 'Doação em Adiantamento de Legítima').
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Perfil de partes).
4. No campo **Sigla**, insira um código mnemônico abreviado (ex: `EMAN`, `DOAC`).
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Perfil de partes).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Sigla] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. Na seção **Comunicações com Centrais Notariais**, configure os parâmetros normativos:
   * Marque se comunica à **CESDI** (Separações, Divórcios e Inventários).
   * Marque se comunica ao **CEP** (Escrituras e Procurações gerais).
   * Marque se comunica ao **RCTO** (Testamentos).
6. Na aba **Custas**, associe o item padrão da tabela de emolumentos estadual.
7. Clique no botão **Concluir** para registrar a nova natureza.

* **Importante: A parametrização correta das flags de centrais notariais é vital para evitar omissões involuntárias na carga periódica da CENSEC.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 4 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "Sigla", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investig → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 3):** "Descrição" → "Descrição" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Notas > Cadastros auxiliares > Naturezas" → "Configurações > Cadastros auxiliares > Natureza" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
