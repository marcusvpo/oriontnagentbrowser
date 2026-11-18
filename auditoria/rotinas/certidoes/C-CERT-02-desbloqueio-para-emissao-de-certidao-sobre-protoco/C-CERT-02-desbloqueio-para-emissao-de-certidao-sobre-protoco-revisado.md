---
id: C-CERT-02
titulo: 'Desbloqueio para Emissão de Certidão sobre Protocolo com Status de Ato Retificado'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: validado_com_ajustes
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  prints_geradas: 7
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: true
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwmo3s0y2ryvgs-18] | x=535, y=67, 183x21'
      - passo: 5
        alvo_documentado: 'Certidões > Novo Pedido de Certidão'
        elemento_real: 'Notas > Nova certidão e serviço'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: true
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwmobzg76v9c7b-23] | x=504, y=128, 183x21'
  historico_reauditoria:
    - data: '2026-11-18'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'validado_com_ajustes'
      tags_atuais: []
      bloqueio_superado: null
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 5
          alvo: 'Certidões > Novo Pedido de Certidão'
          real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'validado_com_ajustes'
      tags_atuais: []
      bloqueio_superado: null
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas > Protocolos'
          confirmada_ao_vivo: true
          usada_como_dica: true
        - passo: 5
          alvo: 'Certidões > Novo Pedido de Certidão'
          real: 'Notas > Nova certidão e serviço'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

#### Descrição:
Para resguardar a fé pública, o motor de certidões bloqueia a emissão direta sobre protocolos com trâmite de rerratificação pendente. É indispensável que a escritura retificadora esteja lavrada ou o status regularizado.

#### Passo a passo revisado:
1. Acesse o menu **Notas > Protocolos** e localize o protocolo da escritura retificadora.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução).
   > [!TIP] **Ajuda da tela — "Data recibo":** "Essa data será usada como base para o recolhimento e geração de selo digital"
   > [!TIP] **Ajuda da tela — "Data 1ª lavratura":** "Essa data será usada como base para a comunicação com as centrais"
   > [!TIP] **Ajuda da tela — "Data do contrato":** "Data da última assinatura da escritura."
   > [!TIP] **Ajuda da tela — "Tomador":** "Ao marcar essa opção, os dados do solicitante sairá na geração do RPS, e posteriormente na NFE-s"
2. Verifique se a escritura de rerratificação já foi assinada e encadernada no livro.
   [aqui vai a print "passo-02.png"]
3. Altere o status do protocolo retificador para `Lavrado / Concluído` e salve.
   [aqui vai a print "passo-03.png"]
4. No protocolo da escritura primitiva, confirme que a anotação marginal da rerratificação está vinculada.
   [aqui vai a print "passo-04.png"]
5. Acesse **Notas > Nova certidão e serviço** e informe o Livro e Folha da escritura primitiva.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Nova certidão e serviço**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Certidões > Novo Pedido de Certidão"**, porém na versão atual do Orion TN a tela fica em **"Notas > Nova certidão e serviço"** (confiança: 90% — Equivalência canônica "Certidões > Novo Pedido de Certidão" -> "Notas > Nova certidão e serviço": o módulo raiz "Certidões" foi absorvido por "Notas"; "Nova certidão e serviço" é o único item de criação de pedido de certidão).
6. O sistema liberará o pedido e, na geração do inteiro teor, incluirá automaticamente a nota de rerratificação no rodapé.
   [aqui vai a print "passo-06.png"]
7. Conclua a emissão e a selagem da certidão.
   [aqui vai a print "passo-07.png"]

* **Fé Pública: A certidão de inteiro teor de ato retificado deve conter obrigatoriamente a transcrição de ambas as escrituras (primitiva e retificadora).**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** (sem tag) validado_com_ajustes → (sem tag) validado_com_ajustes
* **Cura reaproveitada (passo 1):** "Notas > Protocolo" → "Notas > Protocolos" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
* **Cura reaproveitada (passo 5):** "Certidões > Novo Pedido de Certidão" → "Notas > Nova certidão e serviço" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
