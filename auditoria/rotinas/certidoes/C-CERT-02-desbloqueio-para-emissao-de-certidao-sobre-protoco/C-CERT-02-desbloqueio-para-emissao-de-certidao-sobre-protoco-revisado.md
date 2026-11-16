---
id: C-CERT-02
titulo: 'Desbloqueio para Emissão de Certidão sobre Protocolo com Status de Ato Retificado'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: validado_com_ajustes
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  prints_geradas: 7
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas'
        camada: a11y_fuzzy_match
        confianca: 0.68
        texto_alterado: true
        evidencia: 'dom-measured | text:notas | x=573, y=1, 67x50'
      - passo: 5
        alvo_documentado: 'Certidões > Novo Pedido de Certidão'
        elemento_real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: true
        evidencia: 'dom-measured | text:pesquise aqui o nome da tela que deseja acessar. atalho: ctrl + b | x=135, y=72, 1171x30'
---

#### Descrição:
Para resguardar a fé pública, o motor de certidões bloqueia a emissão direta sobre protocolos com trâmite de rerratificação pendente. É indispensável que a escritura retificadora esteja lavrada ou o status regularizado.

#### Passo a passo revisado:
1. Acesse o menu **Notas** e localize o protocolo da escritura retificadora.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Notas > Protocolo"**, porém na tela atual do Orion TN o elemento se chama **"Notas"** (confiança: 68% — Similaridade semântica na árvore de acessibilidade (64%)).
2. Verifique se a escritura de rerratificação já foi assinada e encadernada no livro.
   [aqui vai a print "passo-02.png"]
3. Altere o status do protocolo retificador para `Lavrado / Concluído` e salve.
   [aqui vai a print "passo-03.png"]
4. No protocolo da escritura primitiva, confirme que a anotação marginal da rerratificação está vinculada.
   [aqui vai a print "passo-04.png"]
5. Acesse **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B** e informe o Livro e Folha da escritura primitiva.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Certidões > Novo Pedido de Certidão"**, porém na tela atual do Orion TN o elemento se chama **"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"** (confiança: 96% — Sinônimo canônico Orion TN ('Certidões > Novo Pedido de Certidão' -> 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B')).
6. O sistema liberará o pedido e, na geração do inteiro teor, incluirá automaticamente a nota de rerratificação no rodapé.
   [aqui vai a print "passo-06.png"]
7. Conclua a emissão e a selagem da certidão.
   [aqui vai a print "passo-07.png"]

* **Fé Pública: A certidão de inteiro teor de ato retificado deve conter obrigatoriamente a transcrição de ambas as escrituras (primitiva e retificadora).**
