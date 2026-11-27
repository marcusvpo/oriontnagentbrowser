---
id: D-3.18
titulo: 'Consultar Histórico de Certidões'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['M-54.3', 'M-54.1']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Requerente']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Consultas > Consulta de Certidões e Serviços'
        elemento_real: 'Notas > Consultas > Certidões e serviços'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxztny4wmilx-31] | x=686, y=254, 327x21'
      - passo: 2
        alvo_documentado: 'Número do Pedido'
        elemento_real: 'Pedido'
        camada: a11y_fuzzy_match
        confianca: 0.7
        texto_alterado: false
        evidencia: 'dom-measured | text:pedido | x=14, y=94, 107x40'
      - passo: 2
        alvo_documentado: 'Livro/Folha'
        elemento_real: 'Livro'
        camada: a11y_fuzzy_match
        confianca: 0.77
        texto_alterado: false
        evidencia: 'dom-measured | text:livro | x=548, y=134, 47x40'
      - passo: 2
        alvo_documentado: 'Requerente'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios), "Imprimir" (Faça uma consulta que retorne resultados.)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: M-54.3 — Como Lançar as Custas em um Pedido de Certidão; M-54.1 — Como Criar um Novo Pedido de Certidão (Dados do Solicitante).

#### Descrição:
A consulta de histórico de certidões centraliza todos os requerimentos processados pela serventia. Apresenta o fluxo completo do pedido: data da solicitação, livro e folha pesquisados, requerente, status de pagamento, data da expedição e operador responsável.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-54.3 (Como Lançar as Custas em um Pedido de Certidão) para criar o registro necessário.
2. Executar antes a rotina M-54.1 (Como Criar um Novo Pedido de Certidão (Dados do Solicitante)) para criar o registro necessário.
3. Reexecutar a auditoria da rotina D-3.18.

* **Rotinas pré-requisito (executar antes):** **M-54.3**, **M-54.1**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Consultas > Consulta de Certidões e Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Certidões e serviços**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Consultas > Consulta de Certidões e Serviços"**, porém na versão atual do Orion TN a tela fica em **"Notas > Consultas > Certidões e serviços"** (confiança: 88% — Equivalência de folha: "Consulta de Certidões e Serviços" ≡ "Certidões e serviços" (mesma chave de folha sob "Notas > Consultas")). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente).
2. Preencha os filtros desejados: **Número do Pedido**, **Requerente**, **Livro/Folha**, **Período** ou **Status** (Pendente, Pago, Concluído).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Pedido** · (2) **Livro** · (3) **Período** · (4) **Status**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Número do Pedido"**, porém na tela atual do Orion TN o elemento se chama **"Pedido"** (confiança: 70% — Rótulo visível na tela equivalente por inclusão de nome (70%)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Livro/Folha"**, porém na tela atual do Orion TN o elemento se chama **"Livro"** (confiança: 77% — Rótulo visível na tela equivalente por inclusão de nome (77%)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Requerente"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Requerente"
3. Clique no botão **Pesquisar** para carregar os registros na tela.
4. Selecione o registro desejado para consultar o histórico detalhado de tramitação.
5. Caso precise de uma segunda via, clique em **Reimprimir** ou acesse a minuta no editor.

* **Observação: É possível exportar relatórios de certidões emitidas para atender relatórios estatísticos da Corregedoria e CNJ.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
