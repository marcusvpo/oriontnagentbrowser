---
id: M-31.0
titulo: 'Cadastro de Nova Forma de Pagamento'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['Parâmetros', 'Permite troco', 'Exige código de autorização / NSU']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 7
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Financeiro > Formas de pagamento'
        elemento_real: 'Configurações > Cadastros auxiliares > Formas de pagamento'
        camada: menu_path_resolution
        confianca: 0.8
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxwbej2b78g5e-107] | x=691, y=233, 191x21'
      - passo: 4
        alvo_documentado: 'Código Numérico'
        elemento_real: 'Código'
        camada: a11y_fuzzy_match
        confianca: 0.73
        texto_alterado: false
        evidencia: 'dom-measured | text:código | x=902, y=94, 106x40'
      - passo: 5
        alvo_documentado: 'Parâmetros'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 5
        alvo_documentado: 'Permite troco'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 5
        alvo_documentado: 'Exige código de autorização / NSU'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-26T18:42:26.536Z'
    rota: '#/tipoPagamento/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de forma de pagamento']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Sigla'
        tipo: 'text'
      - rotulo: 'Código'
        tipo: 'text'
      - rotulo: 'Código SIGNO'
        tipo: 'select'
      - rotulo: 'Exige dados bancários'
        tipo: 'checkbox'
      - rotulo: 'Forma de pagamento padrão'
        tipo: 'checkbox'
      - rotulo: 'Exige dados mensalista'
        tipo: 'checkbox'
      - rotulo: 'Forma de pagamento em espécie'
        tipo: 'checkbox'
      - rotulo: 'Provedor de pagamento'
        tipo: 'checkbox'
      - rotulo: 'Forma de pagamento para escreventes'
        tipo: 'checkbox'
      - rotulo: 'Forma de pagamento para serviços internos'
        tipo: 'checkbox'
      - rotulo: 'Transferência de protocolo'
        tipo: 'checkbox'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Parâmetros']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Parâmetros']
    pistas_mapa_rotas:
      - alvo: 'Parâmetros'
        menu: 'Configurações > Tabela de custas > Parâmetros'
        rota: '#/custas/parametros'
        encontrado_em: 'section'
        rotulo_real: 'Parâmetros'
      - alvo: 'Parâmetros'
        menu: 'Configurações > Parametrizações'
        rota: '#/configuracoes'
        encontrado_em: 'tab'
        rotulo_real: 'Parâmetros por estação'
    sugestao_reescrita: 'Sugestão de reescrita: Parâmetros não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Parâmetros", "Permite troco", "Exige código de autorização / NSU", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (7 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/tipoPagamento/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de forma de pagamento**.
> * **Campos:** **Descrição**, **Sigla**, **Código**, **Código SIGNO**, **Exige dados bancários**, **Forma de pagamento padrão**, **Exige dados mensalista**, **Forma de pagamento em espécie**, **Provedor de pagamento**, **Forma de pagamento para escreventes**, **Forma de pagamento para serviços internos**, **Transferência de protocolo**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **Parâmetros**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Parâmetros" aparece em **Configurações > Tabela de custas > Parâmetros** (#/custas/parametros, seção **Parâmetros**); "Parâmetros" aparece em **Configurações > Parametrizações** (#/configuracoes, aba **Parâmetros por estação**).
> * Sugestão de reescrita: **Parâmetros** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Permite incluir uma nova modalidade de liquidação financeira no Orion TN, definindo descrição, sigla, código numérico de atalho e exigências adicionais como identificação de comprovante ou dados bancários.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Financeiro > Formas de pagamento** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Formas de pagamento** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Financeiro > Formas de pagamento"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Formas de pagamento"** (confiança: 80% — Item "Formas de pagamento" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Preencha a **Descrição** (ex: 'PIX QR Code', 'Cartão de Débito Mastercard').
   [aqui vai a print "passo-02.png"]
3. No campo **Sigla**, insira um código mnemônico de 2 a 4 caracteres (ex: `PIX`, `DEB`, `CRED`).
   [aqui vai a print "passo-03.png"]
4. Defina o **Código Numérico** de seleção rápida pelo teclado.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Código Numérico"**, porém na tela atual do Orion TN o elemento se chama **"Código"** (confiança: 73% — Rótulo visível na tela equivalente por inclusão de nome (73%)). O texto do manual não foi alterado.
5. Na seção **Parâmetros**, configure o comportamento da forma:
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Parâmetros"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Permite troco"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Exige código de autorização / NSU"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Parâmetros", "Permite troco", "Exige código de autorização / NSU"
   * Marque se **Permite troco** (geralmente apenas para Dinheiro).
   * Marque se **Exige dados bancários** (para DOC/TED/Transferências).
   * Marque se **Exige código de autorização / NSU** (para Cartões de Crédito e Débito).
6. Clique no botão **Salvar** para disponibilizar a forma de pagamento nos caixas.

* **Importante: A exigência de código NSU para cartões e comprovante para PIX facilita imensamente a conciliação bancária diária do cartório.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
