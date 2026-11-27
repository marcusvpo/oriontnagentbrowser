---
id: M-17.0
titulo: 'Como Consultar Pedidos de Firmas'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Nº Pedido', 'Período', 'Status', 'Em aberto', 'Finalizado', 'Cancelado', 'Mensalista']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 9
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Comissões e mensalistas'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Editor'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Faturamento'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Certidão'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Consultas > Pedidos de firmas'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxztny36n66ni-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Pedidos de firmas'
        elemento_real: 'Pedido de firmas'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwxzui39fhlw-0] | x=26, y=331, 211x32'
      - passo: 2
        alvo_documentado: 'Nº Pedido'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Período'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Status'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Em aberto'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Finalizado'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Cancelado'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Mensalista'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:24:35.118Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Termo de comparecimento']
    abas: []
    campos:
      - rotulo: 'Todos os dedos'
        tipo: 'radio'
      - rotulo: 'Um dedo'
        tipo: 'radio'
      - rotulo: 'Por comparação'
        tipo: 'radio'
      - rotulo: 'Por pesquisa'
        tipo: 'radio'
      - rotulo: 'Automática'
        tipo: 'radio'
      - rotulo: 'Manual'
        tipo: 'radio'
      - rotulo: 'Sequência única'
        tipo: 'radio'
      - rotulo: 'Diário'
        tipo: 'radio'
      - rotulo: 'Anual'
        tipo: 'radio'
      - rotulo: 'Completo'
        tipo: 'radio'
      - rotulo: 'Campos básicos'
        tipo: 'radio'
      - rotulo: 'Não incluir imagens Não incluir imagens Não carregar imagens automaticamente ao acessar a '
        tipo: 'checkbox'
      - rotulo: 'Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a '
        tipo: 'checkbox'
      - rotulo: 'Manter o pedido em tela após conclusão'
        tipo: 'checkbox'
      - rotulo: 'Exibir rotina de caixa na conclusão do pedido'
        tipo: 'checkbox'
      - rotulo: 'Manter a tela do caixa aberta após concluir o pagamento'
        tipo: 'checkbox'
      - rotulo: 'Divisão automática de etiquetas Divisão automática de etiquetas Quando selecionado permite'
        tipo: 'checkbox'
      - rotulo: 'Total de folhas'
        tipo: 'number'
      - rotulo: 'Termos por página'
        tipo: 'number'
      - rotulo: 'Termos abertura'
        tipo: 'number'
      - rotulo: 'Termos encerramento'
        tipo: 'number'
      - rotulo: 'Responsável'
        tipo: 'select'
      - rotulo: 'Utilizar frente e verso'
        tipo: 'checkbox'
      - rotulo: 'Sequência de termo automática'
        tipo: 'checkbox'
      - rotulo: 'Abrir livro automaticamente'
        tipo: 'checkbox'
      - rotulo: 'Tipo padrão'
        tipo: 'select'
      - rotulo: 'Utiliza impressão de etiqueta'
        tipo: 'checkbox'
      - rotulo: 'Utiliza consumo de etiqueta'
        tipo: 'checkbox'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Cadastrar termo de comparecimento após reconhecimento'
        tipo: 'checkbox'
      - rotulo: 'Selo obrigatório'
        tipo: 'checkbox'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Nº Pedido', 'Período', 'Status', 'Em aberto', 'Finalizado', 'Cancelado', 'Mensalista', 'Escrevente']
    correspondencias_sugeridas:
      - alvo: 'Nº Pedido'
        elemento_real: 'Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a '
        tipo: 'campo'
        similaridade: 0.97
      - alvo: 'Nº Pedido'
        elemento_real: 'Manter o pedido em tela após conclusão'
        tipo: 'campo'
        similaridade: 0.97
      - alvo: 'Nº Pedido'
        elemento_real: 'Exibir rotina de caixa na conclusão do pedido'
        tipo: 'campo'
        similaridade: 0.97
    alvos_sem_correspondencia: ['Período', 'Status', 'Em aberto', 'Finalizado', 'Cancelado', 'Mensalista', 'Escrevente']
    pistas_mapa_rotas:
      - alvo: 'Período'
        menu: 'Firmas > Consultas > Reconhecimentos de firmas'
        rota: '#/pedidoFirmas'
        encontrado_em: 'field'
        rotulo_real: 'Período'
      - alvo: 'Período'
        menu: 'Firmas > Consultas > Serviços praticados'
        rota: '#/servicoPraticado'
        encontrado_em: 'field'
        rotulo_real: 'Período'
      - alvo: 'Status'
        menu: 'Firmas > Abertura de pedido'
        rota: '#/aberturaPedidos'
        encontrado_em: 'field'
        rotulo_real: 'Status'
      - alvo: 'Status'
        menu: 'Firmas > Reconhecimento de firmas'
        rota: '#/pedidoFirmas/cadastrar'
        encontrado_em: 'field'
        rotulo_real: 'Status'
      - alvo: 'Mensalista'
        menu: 'Administração > Mensalistas > Mensalistas'
        rota: '#/mensalistas'
        encontrado_em: 'section'
        rotulo_real: 'Mensalistas'
      - alvo: 'Mensalista'
        menu: 'Firmas > Consultas > Reconhecimentos de firmas'
        rota: '#/pedidoFirmas'
        encontrado_em: 'field'
        rotulo_real: 'Mensalista'
      - alvo: 'Escrevente'
        menu: 'Firmas > Reconhecimento de firmas'
        rota: '#/pedidoFirmas/cadastrar'
        encontrado_em: 'field'
        rotulo_real: 'Escrevente'
      - alvo: 'Escrevente'
        menu: 'Firmas > Consultas > Reconhecimentos de firmas'
        rota: '#/pedidoFirmas'
        encontrado_em: 'field'
        rotulo_real: 'Escrevente'
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
        - alvo: 'Status'
          tipo: 'button'
          rotulo: 'Configurar status'
          onde: 'tab:Produtos Orion'
          em_subestado_nao_visitado: true
          similaridade: 0.92
        - alvo: 'Mensalista'
          tipo: 'tab'
          rotulo: 'Comissões e mensalistas'
          onde: 'root'
          em_subestado_nao_visitado: false
          similaridade: 0.92
        - alvo: 'Mensalista'
          tipo: 'tab'
          rotulo: 'Comissões e mensalistas'
          onde: 'tab:Captura e digitalização'
          em_subestado_nao_visitado: true
          similaridade: 0.92
        - alvo: 'Escrevente'
          tipo: 'field'
          rotulo: 'Escrevente'
          onde: 'tab:Parâmetros por estação'
          em_subestado_nao_visitado: true
          similaridade: 1
        - alvo: 'Escrevente'
          tipo: 'field'
          rotulo: 'Escrevente padrão'
          onde: 'tab:Parâmetros por estação'
          em_subestado_nao_visitado: true
          similaridade: 0.92
      alvos_em_subestados: ['Status', 'Mensalista', 'Escrevente']
      alvos_ausentes_nivel2: ['Período', 'Em aberto', 'Finalizado', 'Cancelado']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Nº Pedido por Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a  (campo). Período, Status, Em aberto, Finalizado, Cancelado, Mensalista, Escrevente não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Nº Pedido", "Período", "Status", "Em aberto", "Finalizado", "Cancelado", "Mensalista", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Comissões e mensalistas", aba "Parâmetros por estação", aba "Editor", aba "Produtos Orion", aba "Faturamento", aba "Certidão"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Abertura de pedido; Notas > Protocolos em aberto; Notas > Certidões e serviços em aberto; Administração > Comissões > Planos indicação de mensalista (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Termo de comparecimento**.
> * **Campos:** **Todos os dedos**, **Um dedo**, **Por comparação**, **Por pesquisa**, **Automática**, **Manual**, **Sequência única**, **Diário**, **Anual**, **Completo**, **Campos básicos**, **Não incluir imagens Não incluir imagens Não carregar imagens automaticamente ao acessar a **, **Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a **, **Manter o pedido em tela após conclusão**, **Exibir rotina de caixa na conclusão do pedido**, **Manter a tela do caixa aberta após concluir o pagamento**, **Divisão automática de etiquetas Divisão automática de etiquetas Quando selecionado permite**, **Total de folhas**, **Termos por página**, **Termos abertura**, **Termos encerramento**, **Responsável**, **Utilizar frente e verso**, **Sequência de termo automática**, **Abrir livro automaticamente** (+6).
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Nº Pedido":** **Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a ** (campo, 97% — termo(s) em comum: pedido); **Manter o pedido em tela após conclusão** (campo, 97% — termo(s) em comum: pedido); **Exibir rotina de caixa na conclusão do pedido** (campo, 97% — termo(s) em comum: pedido).
> * **Sem correspondência funcional na tela:** **Período**, **Status**, **Em aberto**, **Finalizado**, **Cancelado**, **Mensalista**, **Escrevente**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Período" aparece em **Firmas > Consultas > Reconhecimentos de firmas** (#/pedidoFirmas, campo **Período**); "Período" aparece em **Firmas > Consultas > Serviços praticados** (#/servicoPraticado, campo **Período**); "Status" aparece em **Firmas > Abertura de pedido** (#/aberturaPedidos, campo **Status**); "Status" aparece em **Firmas > Reconhecimento de firmas** (#/pedidoFirmas/cadastrar, campo **Status**); "Mensalista" aparece em **Administração > Mensalistas > Mensalistas** (#/mensalistas, seção **Mensalistas**); "Mensalista" aparece em **Firmas > Consultas > Reconhecimentos de firmas** (#/pedidoFirmas, campo **Mensalista**); "Escrevente" aparece em **Firmas > Reconhecimento de firmas** (#/pedidoFirmas/cadastrar, campo **Escrevente**); "Escrevente" aparece em **Firmas > Consultas > Reconhecimentos de firmas** (#/pedidoFirmas, campo **Escrevente**).
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Status" ~ botão **Configurar status** em aba **Produtos Orion** (92%); "Mensalista" ~ aba **Comissões e mensalistas** em superfície principal (92%); "Mensalista" ~ aba **Comissões e mensalistas** em aba **Captura e digitalização** (92%); "Escrevente" ~ campo **Escrevente** em aba **Parâmetros por estação** (100%); "Escrevente" ~ campo **Escrevente padrão** em aba **Parâmetros por estação** (92%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Status**, **Mensalista**, **Escrevente** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Período**, **Em aberto**, **Finalizado**, **Cancelado** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 2, substituir **Nº Pedido** por **Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a ** (campo). **Período**, **Status**, **Em aberto**, **Finalizado**, **Cancelado**, **Mensalista**, **Escrevente** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Permite pesquisar, rastrear e auditar todos os atendimentos gerados no balcão de firmas, aplicando filtros por status financeiro, intervalo de datas, escrevente, cliente mensalista ou numeração do pedido.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Consultas > Pedidos de firmas**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Pedido de firmas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Consultas > Pedidos de firmas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — Grafo vivo de rotas (orion-route-graph.json): "Pedidos de firmas" é aba "Pedido de firmas" da tela "Configurações > Parametrizações"). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Pedidos de firmas"**, porém na tela atual do Orion TN o elemento se chama **"Pedido de firmas"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Pedidos de firmas" e a tela real chama a aba de "Pedido de firmas"). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Pedido de firmas** foi medida ao vivo (mesma chave de nome) e acionada.
2. Na área de filtros, defina os parâmetros desejados: **Nº Pedido**, **Período** (data inicial e final), **Status** (**Em aberto**, **Finalizado**, **Cancelado**), **Mensalista** ou **Escrevente**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nº Pedido"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Período"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Status"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Em aberto"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Finalizado"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Cancelado"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Mensalista"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nº Pedido", "Período", "Status", "Em aberto", "Finalizado", "Cancelado", "Mensalista"
3. Clique no botão **Filtrar** (ou pressione **Enter**) para carregar os pedidos na tabela de resultados.
4. Na linha do pedido localizado, utilize as ações disponíveis:
   * **Visualizar**: abre o detalhamento completo dos atos lançados, partes qualificadas e recibo emitido.
   * **Histórico**: exibe a trilha de auditoria com data, hora e operador responsável por cada alteração.
   * **Reimprimir**: emite a 2ª via do comprovante ou recibo do pedido.
5. Para limpar os filtros e reiniciar a busca, clique no botão **Limpar**.

* **Observação: Pedidos com status 'Em aberto' ainda não foram liquidados no caixa e podem sofrer alterações ou inclusão de novos atos pelo balcão.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
