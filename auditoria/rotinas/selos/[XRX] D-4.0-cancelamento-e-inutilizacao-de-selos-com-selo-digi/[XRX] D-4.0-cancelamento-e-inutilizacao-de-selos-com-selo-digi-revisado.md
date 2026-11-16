---
id: D-4.0
titulo: 'Cancelamento e Inutilização de Selos com Selo Digital Gerado (Firmas)'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.35']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Detalhes']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Novo cartão'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'Reabrir Pedido'
        elemento_real: 'Pedido'
        camada: a11y_fuzzy_match
        confianca: 0.8
        texto_alterado: false
        evidencia: 'dom-measured | text:pedido | x=40, y=106, 43x20'
      - passo: 4
        alvo_documentado: 'Detalhes'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 4, a tela está sem dados (grade com 4 coluna(s) visível(is) (Arquivo, Data, Tipo, Tamanho) e 0 linhas de dados; controles inativos: "Preencha o número do pedido" (Preencha o número do pedido), "Preencha a senha SGA" (Preencha a senha SGA), "Filtrar", "Consumir" (Consumir)). Há botão "Novo cartão" na tela, mas a rotina não consulta registros e o seed não foi necessário. Outra rotina do sistema gera esses registros: D-3.35 — Gerar Selo de Cancelamento.

#### Descrição:
Esta rotina orienta sobre o procedimento de cancelamento ou inutilização de selos consumidos em atos de firmas. Para pedidos do dia atual sem selo transmitido, o selo pode ser reutilizado (devolvido ao estoque); para pedidos de dias anteriores ou com selo digital gerado, o procedimento obrigatório é a inutilização definitiva.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.35 (Gerar Selo de Cancelamento) para criar o registro necessário.
2. Reexecutar a auditoria da rotina D-4.0.

* **Rotinas pré-requisito (executar antes):** **D-3.35**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Reconhecimento de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Reconhecimento de firmas**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
2. No campo **Pedido** (canto superior esquerdo), digite o número do pedido onde o selo foi consumido.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
3. Verifique o status do pedido: se constar 'Pago', estorne o recebimento no caixa e clique no botão **Reabrir Pedido**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Reabrir Pedido"**, porém na tela atual do Orion TN o elemento se chama **"Pedido"** (confiança: 80% — Similaridade semântica na árvore de acessibilidade (76%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
4. No card **Serviços Realizados**, clique no ícone de **Detalhes** (quatro traços) ao lado do serviço para listar os selos utilizados.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Detalhes"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Detalhes"
5. Marque a caixa de seleção do selo específico e selecione a ação adequada:
   * Clique no ícone **X** para **Inutilizar** o selo (ação definitiva para selos gerados ou de datas passadas).
   * Clique no ícone de **Seta/Flexinha** para **Reutilizar** o selo (devolve o selo ao estoque, exclusivo para atos do dia atual).
6. Confirme a operação para concluir a remoção do selo do pedido e atualizar o inventário.

* **Importante: A inutilização gera registro oficial de perda comunicada à Corregedoria, sendo vedada a reutilização física do código.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
