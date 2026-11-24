---
id: M-22.0
titulo: 'Criar um Novo Livro e Configurar seus Parâmetros'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Tipo de Livro', 'Livro de Notas', 'Livro de Procurações']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Livros'
        elemento_real: 'Administração > Controle de Livros'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwuz2t0r1jamab-74] | x=664, y=171, 192x20'
      - passo: 2
        alvo_documentado: 'Tipo de Livro'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Livro de Notas'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Livro de Procurações'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Número do Livro", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é in'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Livros'
          real: 'Firmas'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 2
          alvo: 'Livro de Notas'
          real: 'Notas'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Livros" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cadastros"; "Livros" n'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Livros" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cadastros"; "Livros" n'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-24T17:34:18.629Z'
    rota: '#/livro/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Controle de livro']
    abas: []
    campos:
      - rotulo: 'Tipo livro'
        tipo: 'select'
      - rotulo: 'Sigla'
        tipo: 'text'
      - rotulo: 'Utiliza frente e verso'
        tipo: 'checkbox'
      - rotulo: 'Total de folhas'
        tipo: 'text'
      - rotulo: 'Número do livro'
        tipo: 'text'
      - rotulo: 'Página inicial'
        tipo: 'text'
      - rotulo: 'Lado inicial'
        tipo: 'select'
      - rotulo: 'Posição inicial'
        tipo: 'text'
      - rotulo: 'N° termo'
        tipo: 'text'
      - rotulo: 'Data de abertura'
        tipo: 'text'
      - rotulo: 'Responsável'
        tipo: 'select'
      - rotulo: 'Responsável pelo cadastro'
        tipo: 'text'
    botoes: ['Concluir', 'Voltar', 'Imprimir']
    alvos_do_passo: ['Tipo de Livro', 'Termo de Comparecimento', 'Livro de Notas', 'Livro de Procurações']
    correspondencias_sugeridas:
      - alvo: 'Tipo de Livro'
        elemento_real: 'Tipo livro'
        tipo: 'campo'
        similaridade: 0.97
      - alvo: 'Tipo de Livro'
        elemento_real: 'Número do livro'
        tipo: 'campo'
        similaridade: 0.57
      - alvo: 'Tipo de Livro'
        elemento_real: 'Controle de livro'
        tipo: 'seção'
        similaridade: 0.49
      - alvo: 'Termo de Comparecimento'
        elemento_real: 'N° termo'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'Livro de Notas'
        elemento_real: 'Tipo livro'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'Livro de Notas'
        elemento_real: 'Número do livro'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'Livro de Procurações'
        elemento_real: 'Tipo livro'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'Livro de Procurações'
        elemento_real: 'Número do livro'
        tipo: 'campo'
        similaridade: 0.48
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Tipo de Livro por Tipo livro (campo); substituir Termo de Comparecimento por N° termo (campo); substituir Livro de Notas por Tipo livro (campo); substituir Livro de Procurações por Tipo livro (campo).'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Tipo de Livro", "Livro de Notas", "Livro de Procurações", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas; Notas > Consultas > Índice de escrituras e procurações; Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/livro/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Controle de livro**.
> * **Campos:** **Tipo livro**, **Sigla**, **Utiliza frente e verso**, **Total de folhas**, **Número do livro**, **Página inicial**, **Lado inicial**, **Posição inicial**, **N° termo**, **Data de abertura**, **Responsável**, **Responsável pelo cadastro**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**, **Imprimir**.
> * **Correspondência sugerida para "Tipo de Livro":** **Tipo livro** (campo, 97% — termo(s) em comum: tipo, livro); **Número do livro** (campo, 57% — termo(s) em comum: livro); **Controle de livro** (seção, 49% — termo(s) em comum: livro).
> * **Correspondência sugerida para "Termo de Comparecimento":** **N° termo** (campo, 48% — termo(s) em comum: termo).
> * **Correspondência sugerida para "Livro de Notas":** **Tipo livro** (campo, 48% — termo(s) em comum: livro); **Número do livro** (campo, 48% — termo(s) em comum: livro).
> * **Correspondência sugerida para "Livro de Procurações":** **Tipo livro** (campo, 48% — termo(s) em comum: livro); **Número do livro** (campo, 48% — termo(s) em comum: livro).
> * Sugestão de reescrita: no passo 2, substituir **Tipo de Livro** por **Tipo livro** (campo); substituir **Termo de Comparecimento** por **N° termo** (campo); substituir **Livro de Notas** por **Tipo livro** (campo); substituir **Livro de Procurações** por **Tipo livro** (campo). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Permite cadastrar um novo volume ou livro notarial na serventia, definindo sua tipologia, numeração de livro, intervalo sequencial de folhas, permissões de acesso por escrevente e texto de abertura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Livros** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Livros** · (3) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Livros"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Livros"** (confiança: 90% — Equivalência canônica "Firmas > Livros" -> "Administração > Controle de Livros": Firmas não tem "Livros"; a única tela de gestão de livros é "Administração > Controle de Livros" (M-22.0, C-FIRMA-02)). O texto do manual não foi alterado.
   > [!NOTE] **Coerência pós-pouso (ADR-037):** a tela alcançada contém "Tipo de Livro" (= "Tipo livro", leaf_key), "Número do Livro" (= "Número do livro", exact).
2. No campo **Tipo de Livro**, selecione a categoria desejada (ex: **Termo de Comparecimento**, **Livro de Notas**, **Livro de Procurações**).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Tipo de Livro"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Livro de Notas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Livro de Procurações"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Tipo de Livro", "Livro de Notas", "Livro de Procurações"
3. Informe o **Número do Livro** (ex: `46`).
4. Preencha a numeração sequencial: indique a **Folha Inicial** (ex: `1`), a **Folha Final** (ex: `200`) e a **Folha Atual** inicial.
5. No campo **Proprietário / Permissão**, defina quem poderá escriturar no livro: marque **Todos** para uso compartilhado da equipe ou selecione um **Escrevente** específico.
6. Na seção **Termo de Abertura**, digite ou selecione o modelo do texto padrão de abertura e clique no botão **Salvar**.

* **Importante: Verifique com precisão a folha inicial e final conferindo fisicamente as folhas rubricadas do livro encadernado.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Livros" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cadastros"; "Livros" n → **superado** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
