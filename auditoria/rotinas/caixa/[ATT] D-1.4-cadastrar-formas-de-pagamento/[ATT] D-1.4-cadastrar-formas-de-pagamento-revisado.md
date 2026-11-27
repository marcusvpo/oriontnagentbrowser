---
id: D-1.4
titulo: 'Cadastrar Formas de Pagamento'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Forma de Pagamento'
        elemento_real: 'Configurações > Geral > Cadastros auxiliares > Formas de pagamento'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0olbu8uwbhp-31] | x=752, y=88, 144x21'
      - passo: 4
        alvo_documentado: 'Exigir Dados Bancários'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 4
        alvo_documentado: 'Uso Exclusivo em Serviço Interno'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-26T20:42:44.789Z'
    rota: '#/tipoPagamento/cadastrar'
    titulo_painel: 'Caixa'
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
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Exigir Dados Bancários", "Uso Exclusivo em Serviço Interno", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Geral > Dados do cartório (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/tipoPagamento/cadastrar**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de forma de pagamento**.
> * **Campos:** **Descrição**, **Sigla**, **Código**, **Código SIGNO**, **Exige dados bancários**, **Forma de pagamento padrão**, **Exige dados mensalista**, **Forma de pagamento em espécie**, **Provedor de pagamento**, **Forma de pagamento para escreventes**, **Forma de pagamento para serviços internos**, **Transferência de protocolo**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
Esta rotina permite cadastrar todas as modalidades financeiras aceitas pela serventia (Dinheiro, PIX, Cartão de Débito/Crédito, Boleto e Faturado Mensalista). É possível parametrizar a integração direta com intermediadores como Parcela Express e definir formas padrão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Cadastros Auxiliares > Forma de Pagamento**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Geral** · (3) **Cadastros auxiliares** · (4) **Formas de pagamento**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Forma de Pagamento"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Geral > Cadastros auxiliares > Formas de pagamento"** (confiança: 88% — Item "Formas de pagamento" localizado na árvore de navegação em outra rota (2 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar** para abrir o formulário de cadastro.
   [aqui vai a print "passo-02.png"]
3. Preencha a **Descrição** (ex: PIX Parcela Express) e a **Sigla** identificadora (ex: PIX).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Descrição** · (2) **Sigla**
4. Parametrize as opções operacionais desejadas:
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Demarcações na print:** (1) **Forma de Pagamento Padrão** · (2) **Provedor de Pagamento**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Exigir Dados Bancários"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Uso Exclusivo em Serviço Interno"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Exigir Dados Bancários", "Uso Exclusivo em Serviço Interno"
   * **Forma de Pagamento Padrão**: seleciona automaticamente no atendimento.
   * **Provedor de Pagamento**: selecione a integração quando utilizar gateway (ex: Parcela Express).
   * **Exigir Dados Bancários** ou **Uso Exclusivo em Serviço Interno**, se aplicável.
5. Clique em **Conclusão** para salvar o registro.

* **Exigir Dados Bancários** ou **Uso Exclusivo em Serviço Interno**, se aplicável.
5. Clique em **Conclusão** para salvar o registro.

* **Importante: Quando integrado ao Parcela Express, relatórios analíticos de conciliação do provedor estarão automaticamente disponíveis no módulo financeiro.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
