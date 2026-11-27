---
id: D-3.61
titulo: 'Cadastrar Mensalista'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Mensalistas > Cadastros de Mensalistas'
        elemento_real: 'Administração > Mensalistas > Mensalistas'
        camada: menu_path_resolution
        confianca: 0.84
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxy9na08f9gev-79] | x=474, y=254, 190x21'
      - passo: 1
        alvo_documentado: 'Cadastros de Mensalistas'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T19:34:07.836Z'
    rota: '#/mensalistas'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Mensalistas']
    abas: []
    campos:
      - rotulo: 'Código'
        tipo: 'number'
      - rotulo: 'Pesquisar por mensalista'
        tipo: 'text'
      - rotulo: 'CPF, CNPJ ou CIN'
        tipo: 'text'
      - rotulo: 'Tipo de pessoa'
        tipo: 'select'
      - rotulo: 'Usuário'
        tipo: 'select'
      - rotulo: 'Plano'
        tipo: 'select'
      - rotulo: 'Digite e tecle enter'
        tipo: 'text'
      - rotulo: 'Bloqueado'
        tipo: 'select'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
      - rotulo: 'selecionarTodos'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista0'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista1'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista2'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista3'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista4'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista5'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista6'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista7'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista8'
        tipo: 'checkbox'
      - rotulo: 'selecionarCheckMensalista9'
        tipo: 'checkbox'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    pistas_mapa_rotas:
      - alvo: 'Cadastros de Mensalistas'
        menu: 'Firmas > Consultas > Reconhecimentos de firmas'
        rota: '#/pedidoFirmas'
        encontrado_em: 'field'
        rotulo_real: 'Mensalista'
      - alvo: 'Cadastros de Mensalistas'
        menu: 'Notas > Novo protocolo'
        rota: '#/protocolo/cadastrar'
        encontrado_em: 'field'
        rotulo_real: 'Mensalista'
    contexto_catalogo_nivel1:
      id_tela: '064'
      menu: 'Administração > Mensalistas > Mensalistas'
      rota: '#/mensalistas'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Mensalistas']
      tabelas: ['Código', 'Mensalista', 'Tipo', 'Documento', 'Plano', 'Rótulos', 'Status']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Administração > Mensalistas > Mensalistas** foi aberto (rota #/mensalistas), mas a tela não tem a aba/seção "Cadastros de Mensalistas" citada pelo manual. Abas e seções lidas ao vivo na tela: (nenhuma aba ou seção lida). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/mensalistas**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Mensalistas**.
> * **Campos:** **Código**, **Pesquisar por mensalista**, **CPF, CNPJ ou CIN**, **Tipo de pessoa**, **Usuário**, **Plano**, **Digite e tecle enter**, **Bloqueado**, **totalPorPagina**, **selecionarTodos**, **selecionarCheckMensalista0**, **selecionarCheckMensalista1**, **selecionarCheckMensalista2**, **selecionarCheckMensalista3**, **selecionarCheckMensalista4**, **selecionarCheckMensalista5**, **selecionarCheckMensalista6**, **selecionarCheckMensalista7**, **selecionarCheckMensalista8**, **selecionarCheckMensalista9**.
> * **Botões:** **Filtrar**, **Limpar**, **Adicionar**, **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Cadastros de Mensalistas" aparece em **Firmas > Consultas > Reconhecimentos de firmas** (#/pedidoFirmas, campo **Mensalista**); "Cadastros de Mensalistas" aparece em **Notas > Novo protocolo** (#/protocolo/cadastrar, campo **Mensalista**).
> * **Contexto do Catálogo Nível 2 (`064`, consultivo):** tela **Administração > Mensalistas > Mensalistas** | tabelas: **Código**, **Mensalista**, **Tipo**, **Documento**, **Plano**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O cadastro de mensalistas gerencia os clientes corporativos que utilizam os serviços da serventia de forma contínua com pagamento faturado. Permite estabelecer limites de crédito, dia fixo de vencimento, emissão de boletos bancários e lista de portadores autorizados.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Mensalistas > Cadastros de Mensalistas** (ou menu Geral).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Mensalistas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Mensalistas > Cadastros de Mensalistas"**, porém na versão atual do Orion TN a tela fica em **"Administração > Mensalistas > Mensalistas"** (confiança: 84% — Grafo vivo de rotas (orion-route-graph.json): "Cadastros de Mensalistas" é seção "Mensalistas" da tela "Administração > Mensalistas > Mensalistas"). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Cadastros de Mensalistas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Cadastros de Mensalistas"
2. Clique no botão **Adicionar**.
3. Preencha a **Razão Social**, **Nome Fantasia**, **CNPJ** e **Inscrição Municipal/Estadual**.
4. Na aba financeira, defina o **Limite de Crédito Mensal** e o **Dia Padrão de Vencimento da Fatura**.
5. Cadastre os e-mails para envio automático do boleto e o rol de pessoas autorizadas a solicitar atos em nome da empresa.
6. Clique em **Salvar** para ativar o convênio no sistema.

* **Observação: O sistema monitora o consumo em tempo real e emite alertas na abertura de atos caso o limite de crédito seja atingido.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
