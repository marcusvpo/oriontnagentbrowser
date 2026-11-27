---
id: M-6.0
titulo: 'Cadastro de Plano de Comissão'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 6
  dry_run_mutations: true
  comandos_de_gravacao_nao_acionados:
    - passo: 4
      comando: 'Aplicar nos itens selecionados'
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['seta para a esquerda (<)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Comissões > Planos'
        elemento_real: 'Administração > Comissões > Planos de comissão'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxyde51ecchnn-50] | x=474, y=88, 190x21'
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-26T19:38:32.734Z'
    rota: '#/plano/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de plano de comissão', 'Escreventes']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
        secao: 'Escreventes'
      - rotulo: 'Pesquisar por natureza'
        tipo: 'text'
        secao: 'Escreventes'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
        secao: 'Escreventes'
      - rotulo: 'inputValorCalculoPlano'
        tipo: 'text'
        secao: 'Escreventes'
      - rotulo: 'inpuCheckBoxSelecionarTodosServicos'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'Percentual'
        tipo: 'radio'
        secao: 'Escreventes'
      - rotulo: 'Valor fixo'
        tipo: 'radio'
        secao: 'Escreventes'
      - rotulo: 'Vigência:'
        tipo: 'select'
        secao: 'Escreventes'
      - rotulo: 'inputCheckboxSelecionarTodosPertencem'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckboxSelecionarTodosNaoPertencem'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence17'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea17'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence22'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea22'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence78'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea78'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence1'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea1'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence21'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea21'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence23'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea23'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence57'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea57'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence19'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea19'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence49'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea49'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertence44'
        tipo: 'checkbox'
        secao: 'Escreventes'
      - rotulo: 'inputCheckMarcarNaoPertencea44'
        tipo: 'checkbox'
        secao: 'Escreventes'
    botoes: ['Limpar', 'Aplicar nos itens selecionados', 'Concluir', 'Voltar']
    alvos_do_passo: ['seta para a esquerda (<)']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['seta para a esquerda (<)']
    sugestao_reescrita: 'Sugestão de reescrita: seta para a esquerda (<) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "seta para a esquerda (<)", que não foram localizados na tela auditada (nenhum dos elementos citados). A auditoria rodou com a Trava Segura de Mutação: o comando "Aplicar nos itens selecionados" (passo 4) foi localizado e demarcado, mas não foi acionado, para não gravar no banco de homologação. O elemento ausente pode depender do efeito dessa gravação. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito. Como a grade já possui registros carregados, o comportamento observado após o dry-run decorre de diferença editorial/UI e não de falta de dados.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/plano/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de plano de comissão**, **Escreventes**.
> * **Campos:** **Descrição** (Escreventes), **Pesquisar por natureza** (Escreventes), **totalPorPagina** (Escreventes), **inputValorCalculoPlano** (Escreventes), **inpuCheckBoxSelecionarTodosServicos** (Escreventes), **Percentual** (Escreventes), **Valor fixo** (Escreventes), **Vigência:** (Escreventes), **inputCheckboxSelecionarTodosPertencem** (Escreventes), **inputCheckboxSelecionarTodosNaoPertencem** (Escreventes), **inputCheckMarcarNaoPertence17** (Escreventes), **inputCheckMarcarNaoPertencea17** (Escreventes), **inputCheckMarcarNaoPertence22** (Escreventes), **inputCheckMarcarNaoPertencea22** (Escreventes), **inputCheckMarcarNaoPertence78** (Escreventes), **inputCheckMarcarNaoPertencea78** (Escreventes), **inputCheckMarcarNaoPertence1** (Escreventes), **inputCheckMarcarNaoPertencea1** (Escreventes), **inputCheckMarcarNaoPertence21** (Escreventes), **inputCheckMarcarNaoPertencea21** (Escreventes), **inputCheckMarcarNaoPertence23** (Escreventes), **inputCheckMarcarNaoPertencea23** (Escreventes), **inputCheckMarcarNaoPertence57** (Escreventes), **inputCheckMarcarNaoPertencea57** (Escreventes), **inputCheckMarcarNaoPertence19** (Escreventes) (+5).
> * **Botões:** **Limpar** (desabilitado), **Aplicar nos itens selecionados**, **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **seta para a esquerda (<)**.
> * Sugestão de reescrita: **seta para a esquerda (<)** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Permite estruturar uma nova política de comissão para escreventes, fixando o tipo de cálculo (percentual ou valor em reais), parametrizando os atos da tabela de custas participantes e associando os funcionários.

#### Roteiro Técnico para Execução Manual:
1. Executar a rotina manualmente no ambiente de homologação até o passo 5, efetivando a gravação, e conferir se "seta para a esquerda (<)" aparece.
2. Se o elemento existir após a gravação, aprovar a rotina manualmente; se não existir, corrigir o manual.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Comissões > Planos** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comissões** · (3) **Planos de comissão** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Comissões > Planos"**, porém na versão atual do Orion TN a tela fica em **"Administração > Comissões > Planos de comissão"** (confiança: 90% — Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): "Administração > Comissões > Planos de comissão" — folha "Planos de comissão": radicais [comissao, plano] no texto (cobertura 100%), Dice com o título 0.8, ancestrais 100%, bônus de módulo 1; margem 0.493 sobre "Administração > Comissões > Plano diferenciado Mensalistas" (candidato a confirmar na árvore lida ao vivo)). O texto do manual não foi alterado.
   > [!NOTE] **Coerência pós-pouso (ADR-037):** a tela alcançada contém "Descrição", "Forma de cálculo", "Percentual", "Valor fixo".
2. Digite a **Descrição** do plano (ex: 'Comissão Balcão Firmas').
   [aqui vai a print "passo-02.png"]
3. Selecione a **Forma de cálculo**: escolha **Percentual** (ex: 10% sobre emolumentos) ou **Valor fixo** (R$ por ato).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Forma de cálculo** · (2) **Percentual** · (3) **Valor fixo**
4. Na tabela de atos/naturezas, localize os itens desejados pelo campo de busca, digite o valor no campo de aplicação e clique em **APLICAR NOS ITENS SELECIONADOS**.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Trava Segura de Mutação (dry-run):** o comando **Aplicar nos itens selecionados** foi localizado, medido e demarcado na print, mas o clique final foi omitido para não gravar no banco de homologação. A ação foi validada visualmente, sem efetivar a gravação.
5. No quadro de escreventes, selecione o funcionário na coluna da direita e clique na **seta para a esquerda (<)** para incluí-lo no plano.
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [seta para a esquerda (<)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
6. Clique no botão **CONCLUIR** para salvar e ativar as regras.

* **Importante: Para que o funcionário apareça na lista de escreventes elegíveis, ele deve estar cadastrado como escrevente no menu de Usuários do sistema.**
* **Observação: Não é permitido misturar percentual e valor fixo dentro da mesma regra de plano de comissão.**
* **Dica / Caso Real do 0800: Após alterar permissões de um perfil de acesso no módulo de Usuários, oriente os colaboradores a realizarem **Logoff** e efetuarem novo login para que as permissões de sessão sejam atualizadas.**
