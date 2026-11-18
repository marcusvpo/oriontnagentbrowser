---
id: D-2.4
titulo: 'Cadastrar Categoria de Produto'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-18'
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
      alvos_ausentes: ['Nome da Categoria']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 3
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Categoria de Produto'
        elemento_real: 'Administração > Controle de Estoque > Cadastros > Categoria'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlj7df74uafzu-68] | x=286, y=192, 188x21'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Categoria de Produto", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Categoria de Produto" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas",'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Nome da Categoria", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explora'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Cadastros Auxiliares > Categoria de Produto'
          real: 'Administração > Controle de Estoque > Cadastros > Categoria'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-18T03:00:13.041Z'
    rota: '#/categoria/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de categoria']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Responsável'
        tipo: 'select'
      - rotulo: 'Utiliza sequência inicial e sequência final'
        tipo: 'checkbox'
      - rotulo: 'Enviar alerta de estoque mínimo'
        tipo: 'checkbox'
      - rotulo: 'Informar quantidade de atos'
        tipo: 'checkbox'
      - rotulo: 'Utiliza série'
        tipo: 'checkbox'
      - rotulo: 'E-mail (s) para envio de alerta'
        tipo: 'text'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Nome da Categoria']
    correspondencias_sugeridas:
      - alvo: 'Nome da Categoria'
        elemento_real: 'Cadastro de categoria'
        tipo: 'seção'
        similaridade: 0.57
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Nome da Categoria por Cadastro de categoria (seção).'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome da Categoria", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (3 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Négocios > Cadastros > Categoria (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/categoria/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de categoria**.
> * **Campos:** **Descrição**, **Responsável**, **Utiliza sequência inicial e sequência final**, **Enviar alerta de estoque mínimo**, **Informar quantidade de atos**, **Utiliza série**, **E-mail (s) para envio de alerta**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Nome da Categoria":** **Cadastro de categoria** (seção, 57% — termo(s) em comum: categoria).
> * Sugestão de reescrita: no passo 3, substituir **Nome da Categoria** por **Cadastro de categoria** (seção). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
A categorização de produtos estrutura o inventário da serventia em grupos homogêneos, tais como Papéis de Segurança, Selos de Fiscalização, Cartões de Autógrafo e Materiais de Escritório, facilitando a emissão de relatórios e auditorias de insumos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Categoria de Produto**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Estoque** · (3) **Cadastros** · (4) **Categoria**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Categoria de Produto"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Estoque > Cadastros > Categoria"** (confiança: 90% — Equivalência canônica "Configurações > Cadastros Auxiliares > Categoria de Produto" -> "Administração > Controle de Estoque > Cadastros > Categoria": "Categoria" aparece uma única vez na árvore real (irmã de "Produto", em Controle de Estoque > Cadastros)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Digite o **Nome da Categoria** (ex: Papel de Segurança para Traslados ou Selos de Fiscalização).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Nome da Categoria] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Informe uma **Sigla** ou código de referência e uma breve descrição do grupo.
5. Clique em **Salvar** para disponibilizar a categoria nos cadastros de produtos.

* **Observação: As categorias cadastradas servem como filtros primários em todos os relatórios analíticos de inventário e consumo.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 3 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Nome da Categoria", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explora → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Configurações > Cadastros Auxiliares > Categoria de Produto" → "Administração > Controle de Estoque > Cadastros > Categoria" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
