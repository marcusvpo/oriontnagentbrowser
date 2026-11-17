---
id: M-60.0
titulo: 'Gerenciar Cadastro de Naturezas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Pesquisar por descrição']
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
        alvo_documentado: 'Notas > Cadastros auxiliares > Naturezas'
        elemento_real: 'Configurações > Cadastros auxiliares > Natureza'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwk9pvv9gbr0ja-108] | x=659, y=254, 191x21'
      - passo: 3
        alvo_documentado: 'Pesquisar por descrição'
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
        motivo: 'No passo 3, o manual cita "Pesquisar por descrição", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio.'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Naturezas'
          real: 'Configurações > Cadastros auxiliares > Natureza'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T05:47:02.405Z'
    rota: '#/natureza'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Natureza']
    abas: []
    campos:
      - rotulo: 'Espécie'
        tipo: 'select'
      - rotulo: 'Natureza'
        tipo: 'text'
      - rotulo: 'Comunicação'
        tipo: 'select'
      - rotulo: 'Informa livro e folhas'
        tipo: 'select'
      - rotulo: 'Repetir livro e folhas'
        tipo: 'select'
      - rotulo: 'Inativos'
        tipo: 'checkbox'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Voltar']
    alvos_do_passo: ['Pesquisar por descrição', 'Espécie']
    correspondencias_sugeridas:
      - alvo: 'Espécie'
        elemento_real: 'Espécie'
        tipo: 'campo'
        similaridade: 1
    alvos_sem_correspondencia: ['Pesquisar por descrição']
    sugestao_reescrita: 'Sugestão de reescrita: Espécie existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Pesquisar por descrição não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Pesquisar por descrição", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/natureza**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Natureza**.
> * **Campos:** **Espécie**, **Natureza**, **Comunicação**, **Informa livro e folhas**, **Repetir livro e folhas**, **Inativos**, **totalPorPagina**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Adicionar**, **Voltar**.
> * **Correspondência sugerida para "Espécie":** **Espécie** (campo, 100% — termo(s) em comum: especie).
> * **Sem correspondência funcional na tela:** **Pesquisar por descrição**.
> * Sugestão de reescrita: **Espécie** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Pesquisar por descrição** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Ambiente de consulta, edição e manutenção das naturezas jurídicas dos atos notariais, regulando sua vinculação à respectiva espécie, itens da tabela de custas e regras de envio à CENSEC (CEP, CESDI e RCTO).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Naturezas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Natureza**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Naturezas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Natureza"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Na listagem carregada, visualize todas as naturezas com suas respectivas espécies associadas.
   [aqui vai a print "passo-02.png"]
3. No campo **Pesquisar por descrição**, digite o nome do ato pretendido e selecione a **Espécie** para filtrar.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Pesquisar por descrição"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Pesquisar por descrição"
4. Clique no botão **Filtrar**.
5. Na linha do registro localizado, utilize as ações:
   * **Visualizar**: exibe parâmetros tributários, regras de COAF e obrigações CENSEC.
   * **Editar**: permite atualizar minutas padrão, checklist documental e enquadramentos.
   * **Inativar**: desabilita a natureza para novos protocolos.
6. Para cadastrar uma nova natureza jurídica, clique no botão **Adicionar**.

* **Importante: Naturezas vinculadas a atos já lavrados no histórico do cartório não devem ser excluídas, apenas inativadas para preservação de auditoria.**
* **Dica / Caso Real do 0800: Evite manter o mesmo protocolo aberto em mais de uma aba do Google Chrome para não gerar bloqueios automáticos de concorrência (*locks*) no banco de dados.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Pesquisar por descrição", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Notas > Cadastros auxiliares > Naturezas" → "Configurações > Cadastros auxiliares > Natureza" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
