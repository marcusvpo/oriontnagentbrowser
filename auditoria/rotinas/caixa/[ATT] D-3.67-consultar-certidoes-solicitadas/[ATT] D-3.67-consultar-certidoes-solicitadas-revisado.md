---
id: D-3.67
titulo: 'Consultar Certidões Solicitadas'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-1'
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
        alvo_documentado: 'Notas > Certidões > Consultar Certidões Solicitadas'
        elemento_real: 'Administração > Certidões solicitadas'
        camada: menu_path_resolution
        confianca: 0.64
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0589r1fan86-83] | x=664, y=275, 192x20'
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T20:26:30.831Z'
    rota: '#/certidoesSolicitadas'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Certidões Solicitadas']
    abas: []
    campos:
      - rotulo: 'Protocolo'
        tipo: 'text'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Responsável'
        tipo: 'select'
      - rotulo: 'Status'
        tipo: 'select'
      - rotulo: 'Data da solicitação'
        tipo: 'text'
    botoes: ['Filtrar', 'Limpar', 'Imprimir']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '068'
      menu: 'Administração > Certidões solicitadas'
      rota: '#/certidoesSolicitadas'
      nivel: 2
      estado_nivel2: 'no_substates'
      abas: []
      secoes: ['Certidões Solicitadas']
      tabelas: ['Data de recepção', 'Protocolo', 'Escrevente', 'Responsável', 'Data da solicitação', 'Status', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Certidões > Consultar Certidões Solicitadas", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas; Notas > Certidões e serviços; Notas > Certidões e serviços em aberto; Notas > Consultas > Certidões e serviços; Administração > Certidões solicitadas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/certidoesSolicitadas**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Certidões Solicitadas**.
> * **Campos:** **Protocolo**, **Escrevente**, **Responsável**, **Status**, **Data da solicitação**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Imprimir**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`068`, consultivo):** tela **Administração > Certidões solicitadas** | tabelas: **Data de recepção**, **Protocolo**, **Escrevente**, **Responsável**, **Data da solicitação**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O painel de Certidões Solicitadas é o gerenciador de fluxo de trabalho do setor de certidões. Exibe em formato de fila operacional todos os pedidos recepcionados, ordenados por prioridade e prazo limite de expedição, controlando as etapas de busca no livro, redação e entrega.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Certidões > Consultar Certidões Solicitadas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Certidões solicitadas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Certidões > Consultar Certidões Solicitadas"**, porém na versão atual do Orion TN a tela fica em **"Administração > Certidões solicitadas"** (confiança: 64% — Item "Certidões solicitadas" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Notas > Certidões > Consultar Certidões Solicitadas"
2. Utilize as abas de status para navegar: **Solicitadas/Pendentes**, **Em Elaboração**, **Prontas para Retirada** e **Entregues**.
3. Filtre por **Escrevente Responsável** ou ordene por **Data Prevista de Entrega**.
4. Dê um duplo clique no pedido desejado para abrir o editor e redigir a certidão.
5. Após a impressão definitiva, altere o status para **Pronta para Retirada** (o sistema pode disparar aviso por WhatsApp/e-mail ao requerente).
6. Na entrega física ao cidadão, colha a assinatura no protocolo e marque **Entregue**.

* **Importante: Acompanhe diariamente os alertas amarelos e vermelhos para cumprir rigorosamente os prazos estabelecidos na Lei dos Notários e Registradores.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
