---
id: C-FIN-13
titulo: 'Habilitação de Permissão e Procedimento para Retificação de Data de Recibo'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'marcus'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Gravar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 2
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
        alvo_documentado: 'Configurações > Usuários / Perfis de Acesso'
        elemento_real: 'Configurações > Usuários'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxz7ln0azu6fa-129] | x=850, y=150, 175x21'
      - passo: 2
        alvo_documentado: 'Orion Caixa'
        elemento_real: 'orion'
        camada: a11y_fuzzy_match
        confianca: 0.77
        texto_alterado: false
        evidencia: 'dom-measured | text:orion | x=20, y=244, 169x27'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T20:01:30.042Z'
    rota: '#/usuario'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Usuários']
    abas: []
    campos:
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'Cargo'
        tipo: 'text'
      - rotulo: 'Perfil de acesso'
        tipo: 'text'
      - rotulo: 'Inativos'
        tipo: 'checkbox'
      - rotulo: 'Apenas com 2FA'
        tipo: 'checkbox'
      - rotulo: 'totalPerPage'
        tipo: 'select'
      - rotulo: 'selecionarModelos'
        tipo: 'checkbox'
      - rotulo: 'selecionarModelo'
        tipo: 'checkbox'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Excluir', 'Voltar']
    alvos_do_passo: ['Gravar']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Gravar']
    contexto_catalogo_nivel1:
      id_tela: '109'
      menu: 'Configurações > Usuários'
      rota: '#/usuario'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Usuários']
      tabelas: ['Usuário', 'Nome', 'Cargo', 'Perfil de acesso', 'Assinante', 'Escrevente', '2FA']
      alvos_ausentes_nivel2: ['Gravar']
    sugestao_reescrita: 'Sugestão de reescrita: Gravar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Gravar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/usuario**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Usuários**.
> * **Campos:** **Nome**, **Cargo**, **Perfil de acesso**, **Inativos**, **Apenas com 2FA**, **totalPerPage**, **selecionarModelos**, **selecionarModelo**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Adicionar**, **Excluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Gravar**.
> * **Contexto do Catálogo Nível 2 (`109`, consultivo):** tela **Configurações > Usuários** | tabelas: **Usuário**, **Nome**, **Cargo**, **Perfil de acesso**, **Assinante**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Gravar** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **Gravar** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Para resguardar a ordem cronológica do caixa e evitar alterações extemporâneas não autorizadas, o campo de data de recibo exige permissão específica concedida pelo administrador da serventia.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com usuário administrador, acesse no **Orion TN** o menu **Configurações > Usuários / Perfis de Acesso**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Usuários / Perfis de Acesso"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Usuários"** (confiança: 88% — Equivalência de folha: "Usuários / Perfis de Acesso" ≡ "Usuários" (mesma chave de folha sob "Configurações")). O texto do manual não foi alterado.
2. Selecione o perfil do colaborador, expanda a seção **Orion Caixa** e marque a opção **Permitir alteração de data do recibo**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Orion Caixa"**, porém na tela atual do Orion TN o elemento se chama **"orion"** (confiança: 77% — Similaridade semântica na árvore de acessibilidade (77%)). O texto do manual não foi alterado.
3. Clique em **Gravar** e solicite que o operador reinicie sua sessão no sistema.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Gravar] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. No **Orion Caixa**, navegue até o menu **Controle de Caixa > Recibos**.
5. Pesquise o recibo desejado e clique no botão **Retificar / Editar Recibo**.
6. Altere o campo **Data de Emissão** para a data correspondente e clique em **Confirmar Retificação**.

* **Restrição: O sistema não permite retificar datas de recibos referentes a meses contábeis cujo Livro Diário ou Sinoreg já tenham sido definitivamente encerrados.**
