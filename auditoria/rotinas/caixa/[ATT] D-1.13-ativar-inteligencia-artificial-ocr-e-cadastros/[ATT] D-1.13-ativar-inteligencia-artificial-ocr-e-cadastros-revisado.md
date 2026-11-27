---
id: D-1.13
titulo: 'Ativar Inteligência Artificial (OCR e Cadastros)'
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
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Ativar Inteligência Artificial (OCR e Cadastros)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 5
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Provedor de pagamento'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Geral'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Parametrizações > Inteligência Artificial'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy1fwpwffd0o4-37] | x=1041, y=88, 135x20'
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T21:04:34.844Z'
    rota: '#/configuracoes'
    titulo_painel: 'Caixa'
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
    alvos_do_passo: ['Ativar Inteligência Artificial (OCR e Cadastros)']
    correspondencias_sugeridas:
      - alvo: 'Ativar Inteligência Artificial (OCR e Cadastros)'
        elemento_real: 'Inteligência artificial'
        tipo: 'seção'
        similaridade: 0.56
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
      pistas_consultivas:
        - alvo: 'Ativar Inteligência Artificial (OCR e Cadastros)'
          tipo: 'tab'
          rotulo: 'Inteligência Artificial'
          onde: 'root'
          em_subestado_nao_visitado: false
          similaridade: 0.66
        - alvo: 'Ativar Inteligência Artificial (OCR e Cadastros)'
          tipo: 'tab'
          rotulo: 'Inteligência Artificial'
          onde: 'tab:Captura e digitalização'
          em_subestado_nao_visitado: true
          similaridade: 0.66
      alvos_em_subestados: ['Ativar Inteligência Artificial (OCR e Cadastros)']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Ativar Inteligência Artificial (OCR e Cadastros) por Inteligência artificial (seção).'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Ativar Inteligência Artificial (OCR e Cadastros)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 5 de 5 gatilho(s) revelador(es) seguro(s) da tela (aba "Painel de atalhos", aba "Parâmetros por estação", aba "Produtos Orion", aba "Provedor de pagamento", aba "Geral"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Geral > Cadastros auxiliares (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Inteligência artificial**.
> * **Campos:** **Ativar integração**, **IA**, **Api Key**, **Model**, **Prioridade de processamento**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Ativar Inteligência Artificial (OCR e Cadastros)":** **Inteligência artificial** (seção, 56% — termo(s) em comum: inteligencia, artificial).
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Ativar Inteligência Artificial (OCR e Cadastros)" ~ aba **Inteligência Artificial** em superfície principal (66%); "Ativar Inteligência Artificial (OCR e Cadastros)" ~ aba **Inteligência Artificial** em aba **Captura e digitalização** (66%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Ativar Inteligência Artificial (OCR e Cadastros)** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * Sugestão de reescrita: no passo 2, substituir **Ativar Inteligência Artificial (OCR e Cadastros)** por **Inteligência artificial** (seção). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
A ativação da Inteligência Artificial habilita o motor de OCR avançado do Orion TN, permitindo digitalizar ou importar imagens de CNH, RG e DUT para que o sistema reconheça automaticamente nomes, CPFs, filiação, datas e números de registro sem digitação manual.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parametrizações > Inteligência Artificial**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Inteligência Artificial**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parametrizações > Inteligência Artificial"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — "Configurações > Parametrizações" existe na árvore real como folha sem filhos; "Inteligência Artificial" é seção/aba da tela alcançada). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Inteligência Artificial** foi medida ao vivo (mesmo nome do manual) e acionada.
2. Marque a opção **Ativar Inteligência Artificial (OCR e Cadastros)**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Ativar Inteligência Artificial (OCR e Cadastros)] não localizado no DOM nem na Árvore de Acessibilidade, nem após 5 gatilho(s) revelador(es) seguro(s)
3. Configure o nível de sensibilidade de leitura e defina os tipos de documentos habilitados (CNH, RG, DUT).
4. Selecione os módulos autorizados a usar o recurso (**Firmas**, **Notas** e **Caixa**).
5. Clique em **Salvar**.

* **Importante: A precisão do preenchimento automatizado depende diretamente da resolução e nitidez das imagens digitalizadas.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
