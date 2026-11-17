---
id: M-63.0
titulo: 'Adicionar Novo Grupo de Itens'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
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
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Firmas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Grupo de itens'
        elemento_real: 'Configurações > Tabela de custas > Grupo de item'
        camada: menu_path_resolution
        confianca: 0.85
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkzvgb7b1ehgl-96] | x=677, y=129, 173x21'
      - passo: 3
        alvo_documentado: 'Firmas'
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
        motivo: 'No passo 3, o manual cita "Firmas", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloquei'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Grupo de itens'
          real: 'Configurações > Tabela de custas > Grupo de item'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'validado_com_ajustes'
      tags_atuais: []
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Descrição", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Inve'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Grupo de itens'
          real: 'Configurações > Tabela de custas > Grupo de item'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: null
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 5
          alvo: 'Concluir'
          real: 'Concluir'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Grupo de itens'
          real: 'Configurações > Tabela de custas > Grupo de item'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 1
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T17:59:08.062Z'
    rota: '#/grupoItem/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de grupo de item']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Especialidade'
        tipo: 'select'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Especialidade', 'Notas', 'Firmas']
    correspondencias_sugeridas:
      - alvo: 'Especialidade'
        elemento_real: 'Especialidade'
        tipo: 'campo'
        similaridade: 1
    alvos_sem_correspondencia: ['Notas', 'Firmas']
    sugestao_reescrita: 'Sugestão de reescrita: Especialidade existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Notas, Firmas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Firmas", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/grupoItem/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de grupo de item**.
> * **Campos:** **Descrição**, **Especialidade**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Especialidade":** **Especialidade** (campo, 100% — termo(s) em comum: especialidade).
> * **Sem correspondência funcional na tela:** **Notas**, **Firmas**.
> * Sugestão de reescrita: **Especialidade** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Notas**, **Firmas** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Permite cadastrar um novo cabeçalho ou categoria de agrupamento na tabela de emolumentos da serventia, categorizando atos afins sob a mesma especialidade notarial.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Grupo de itens** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Tabela de custas** · (3) **Grupo de item** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Grupo de itens"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Tabela de custas > Grupo de item"** (confiança: 85% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. No campo **Descrição**, digite a denominação clara do agrupador (ex: 'Atas Notariais Eletrônicas', 'Escrituras de Regularização Fundiária - REURB').
   [aqui vai a print "passo-02.png"]
3. No campo **Especialidade**, selecione a área de aplicação: **Notas** ou **Firmas**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Firmas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Firmas"
4. Se disponível, defina o código numérico de ordenação para exibição sequencial nos menus de custas.
5. Clique no botão **Concluir** para salvar o registro.
6. Em seguida, acerte a tabela de custas vinculando as linhas tarifárias ao grupo criado.

* **Importante: A descrição deve ser objetiva e fiel à nomenclatura da legislação de custas estadual para facilitar conferências fiscais.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** (sem tag) validado_com_ajustes → [ATT] atualizacao_editorial
* **Cura reaproveitada (passo 5):** "Concluir" → "Concluir" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Notas > Cadastros auxiliares > Grupo de itens" → "Configurações > Tabela de custas > Grupo de item" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
* **Notas editoriais anteriores:** 0 reconfirmada(s) ao vivo; 1 não reproduzida(s) nesta tela e, por isso, não mantida(s) no relatório.
