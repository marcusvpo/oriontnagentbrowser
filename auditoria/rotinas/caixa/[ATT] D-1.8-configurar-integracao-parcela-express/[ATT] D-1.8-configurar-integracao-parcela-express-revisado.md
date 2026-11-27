---
id: D-1.8
titulo: 'Configurar Integração Parcela Express'
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
        alvo_documentado: 'Configurações > Parametrizações > Integrações'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy15p4w5dcjzn-37] | x=1041, y=88, 135x20'
      - passo: 1
        alvo_documentado: 'Integrações'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T20:55:25.422Z'
    rota: '#/configuracoes'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Configurações', 'Contas bancárias']
    abas: []
    campos:
      - rotulo: 'Ativar rotina - Firmas'
        tipo: 'checkbox'
      - rotulo: 'Ativar rotina - Notas'
        tipo: 'checkbox'
      - rotulo: 'Abertura sem troco'
        tipo: 'checkbox'
      - rotulo: 'Balcão de firmas - Estornar pagamentos com autorização'
        tipo: 'checkbox'
      - rotulo: 'Ativar rotina Atenção! Necessário fazer um novo login'
        tipo: 'checkbox'
        secao: 'Contas bancárias'
    botoes: ['Adicionar conta', 'Visualizar conta', 'Excluir conta', 'Concluir', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '110'
      menu: 'Configurações > Parametrizações'
      rota: '#/configuracoes'
      nivel: 2
      estado_nivel2: 'explored'
      abas: ['Geral', 'Captura e digitalização', 'Parâmetros por estação', 'Sequência', 'Comunicações', 'Campos obrigatórios', 'Painel de atalhos', 'Pedido de firmas', 'Comissões e mensalistas', 'E-mail', 'Faturamento', 'Protocolo', 'Certidão', 'Editor', 'Produtos Orion', 'Inteligência Artificial', 'WhatsApp', 'Impressão']
      secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
      tabelas: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Integrações" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Provedor de pagamento", "Parâmetros por estação", "Painel de atalhos", "Produtos Orion", "Inteligência Artificial", "Contas bancárias". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/configuracoes**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Contas bancárias**.
> * **Campos:** **Ativar rotina - Firmas**, **Ativar rotina - Notas**, **Abertura sem troco**, **Balcão de firmas - Estornar pagamentos com autorização**, **Ativar rotina Atenção! Necessário fazer um novo login** (Contas bancárias).
> * **Botões:** **Adicionar conta**, **Visualizar conta**, **Excluir conta**, **Concluir**, **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A integração com a plataforma Parcela Express permite ao cartório oferecer recebimento via cartão de crédito, débito e Pix com liquidação rápida e possibilidade de parcelamento de emolumentos e ITBI pelos usuários da serventia.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parametrizações > Integrações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parametrizações > Integrações"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — "Configurações > Parametrizações" existe na árvore real como folha sem filhos; "Integrações" é seção/aba da tela alcançada). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Integrações"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Integrações"
2. Selecione a opção **Parcela Express**.
3. Preencha as credenciais fornecidas pela credenciadora (**Client ID**, **Client Secret** ou **Token de Acesso**).
4. Configure as contas financeiras de destino e selecione os terminais TEF/POS vinculados aos caixas.
5. Clique em **Testar Conexão** para validar a comunicação com a API.
6. Clique em **Salvar** para habilitar a operação em tempo real.

* **Importante: A ativação do provedor libera relatórios analíticos de conciliação de recebíveis no menu Relatórios do Orion Caixa.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
