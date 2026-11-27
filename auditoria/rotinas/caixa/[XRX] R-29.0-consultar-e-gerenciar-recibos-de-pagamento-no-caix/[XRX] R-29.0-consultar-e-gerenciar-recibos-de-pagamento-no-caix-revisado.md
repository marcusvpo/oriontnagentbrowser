---
id: R-29.0
titulo: 'Consultar e Gerenciar Recibos de Pagamento no Caixa'
modulo: caixa
secao: R
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-1.21', 'D-1.19', 'D-1.15']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Data', 'CPF/CNPJ', 'Operador']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Orion Caixa > Administração > Consultas > Recibos'
        elemento_real: 'Administração > Consultas > Recibos'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy1sr53ap5f17-11] | x=933, y=129, 155x21'
      - passo: 2
        alvo_documentado: 'Número do Recibo'
        elemento_real: 'Recibo'
        camada: a11y_fuzzy_match
        confianca: 0.7
        texto_alterado: false
        evidencia: 'dom-measured | text:recibo | x=20, y=94, 106x40'
      - passo: 2
        alvo_documentado: 'Data'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'CPF/CNPJ'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Operador'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Recibo, Senha SGA, Criação, Pagamento, Total, Responsável) e 0 linhas de dados; controles inativos: "Imprimir" (Realize uma busca com resultados para imprimir)). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-1.21 — Fazer Sangria de Caixa; D-1.19 — Fazer Abertura de Caixa; D-1.15 — Gerar Relatório de Caixa.

#### Descrição:
Permite auditar todas as transações quitadas no módulo Caixa através de filtros por data, número ou cliente, viabilizando a reimpressão de segundas vias e a execução de estornos e cancelamentos financeiros com segurança.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-1.21 (Fazer Sangria de Caixa) para criar o registro necessário.
2. Executar antes a rotina D-1.19 (Fazer Abertura de Caixa) para criar o registro necessário.
3. Executar antes a rotina D-1.15 (Gerar Relatório de Caixa) para criar o registro necessário.
4. Reexecutar a auditoria da rotina R-29.0.

* **Rotinas pré-requisito (executar antes):** **D-1.21**, **D-1.19**, **D-1.15**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Orion Caixa > Administração > Consultas > Recibos**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Consultas** · (3) **Recibos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Orion Caixa > Administração > Consultas > Recibos"**, porém na versão atual do Orion TN a tela fica em **"Administração > Consultas > Recibos"** (confiança: 90% — Item "Recibos" localizado na árvore de navegação em outra rota (2 de 3 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Recibo, Senha SGA, Criação, Pagamento, Total, Responsável).
2. Configure os filtros de busca preenchendo **Data**, **Número do Recibo**, **Solicitante**, **CPF/CNPJ** ou **Operador**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Recibo** · (2) **Solicitante**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Número do Recibo"**, porém na tela atual do Orion TN o elemento se chama **"Recibo"** (confiança: 70% — Similaridade semântica na árvore de acessibilidade (70%)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Data"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"CPF/CNPJ"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Operador"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Recibo, Senha SGA, Criação, Pagamento, Total, Responsável).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Data", "CPF/CNPJ", "Operador"
3. Clique no botão **Consultar / Filtrar** para exibir a listagem dos recibos correspondentes.
4. Identifique o recibo desejado na tabela para acompanhar seus detalhes operacionais e valores.
5. Utilize os botões de ação na linha do registro:
   * **Visualizar Detalhes / Imprimir:** Abre a 2ª via do recibo para reimpressão.
   * **Visualizar Andamentos:** Exibe o histórico de logs da transação.
   * **Estornar Pagamento / Cancelar Pagamento:** Desfaz o recebimento financeiro e reabre o pedido para acerto.

* **Visualizar Detalhes / Imprimir: Abre a 2ª via do recibo para reimpressão.**
* **Visualizar Andamentos: Exibe o histórico de logs da transação.**
* **Estornar Pagamento / Cancelar Pagamento: Desfaz o recebimento financeiro e reabre o pedido para acerto.**
* **Importante: O estorno financeiro de um recibo exige justificativa e deve ser realizado antes do fechamento definitivo do caixa do operador.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
