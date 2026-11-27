---
id: D-2.12
titulo: 'Configurar Parametrizações do Estoque'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Consumo de Insumos', 'Ativar Consumo Automático de Papel e Selos']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T21:40:16.607Z'
    rota: '#/configuracoes'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Inteligência artificial']
    abas: []
    campos:
      - rotulo: 'Ativar integração'
        tipo: 'checkbox'
      - rotulo: 'IA'
        tipo: 'select'
      - rotulo: 'Api Key'
        tipo: 'text'
      - rotulo: 'Model'
        tipo: 'select'
      - rotulo: 'Prioridade de processamento'
        tipo: 'select'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Consumo de Insumos', 'Ativar Consumo Automático de Papel e Selos']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Consumo de Insumos', 'Ativar Consumo Automático de Papel e Selos']
    contexto_catalogo_nivel1:
      id_tela: '110'
      menu: 'Configurações > Parametrizações'
      rota: '#/configuracoes'
      nivel: 2
      estado_nivel2: 'explored'
      abas: ['Geral', 'Captura e digitalização', 'Parâmetros por estação', 'Sequência', 'Comunicações', 'Campos obrigatórios', 'Painel de atalhos', 'Pedido de firmas', 'Comissões e mensalistas', 'E-mail', 'Faturamento', 'Protocolo', 'Certidão', 'Editor', 'Produtos Orion', 'Inteligência Artificial', 'WhatsApp', 'Impressão']
      secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
      tabelas: []
      pistas_consultivas:
        - alvo: 'Consumo de Insumos'
          tipo: 'field'
          rotulo: 'Utiliza consumo de etiqueta'
          onde: 'tab:Pedido de firmas'
          em_subestado_nao_visitado: true
          similaridade: 0.47
        - alvo: 'Ativar Consumo Automático de Papel e Selos'
          tipo: 'field'
          rotulo: 'Ativar faturamento automático'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 0.49
        - alvo: 'Ativar Consumo Automático de Papel e Selos'
          tipo: 'field'
          rotulo: 'Ativar a rotina de preenchimento automatico das custas.'
          onde: 'tab:Protocolo'
          em_subestado_nao_visitado: true
          similaridade: 0.49
      alvos_em_subestados: ['Consumo de Insumos', 'Ativar Consumo Automático de Papel e Selos']
    sugestao_reescrita: 'Sugestão de reescrita: Consumo de Insumos, Ativar Consumo Automático de Papel e Selos não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Consumo de Insumos", "Ativar Consumo Automático de Papel e Selos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Consumo manual (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Inteligência artificial**.
> * **Campos:** **Ativar integração**, **IA**, **Api Key**, **Model**, **Prioridade de processamento**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Consumo de Insumos**, **Ativar Consumo Automático de Papel e Selos**.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Consumo de Insumos" ~ campo **Utiliza consumo de etiqueta** em aba **Pedido de firmas** (47%); "Ativar Consumo Automático de Papel e Selos" ~ campo **Ativar faturamento automático** em aba **Faturamento** (49%); "Ativar Consumo Automático de Papel e Selos" ~ campo **Ativar a rotina de preenchimento automatico das custas.** em aba **Protocolo** (49%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Consumo de Insumos**, **Ativar Consumo Automático de Papel e Selos** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * Sugestão de reescrita: **Consumo de Insumos**, **Ativar Consumo Automático de Papel e Selos** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
As parametrizações gerais do estoque definem o comportamento sistêmico do almoxarifado perante os atos notariais. Controlam se o sistema realiza a baixa automática de folhas e selos ao lavrar a escritura, se bloqueia a conclusão em caso de saldo zerado e se dispara avisos de reposição.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
2. Na aba **Consumo de Insumos**, marque **Ativar Consumo Automático de Papel e Selos**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Consumo de Insumos, Ativar Consumo Automático de Papel e Selos] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Defina a regra de tolerância: marque se o sistema deve **Bloquear Atos em Caso de Estoque Zerado**.
4. Configure a porcentagem ou quantidade para disparo do alerta de **Estoque Crítico**.
5. Clique em **Salvar Alterações**.

* **Importante: A ativação do consumo automático exige que os escreventes tenham lotes previamente distribuídos em suas máquinas ou usuários.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
