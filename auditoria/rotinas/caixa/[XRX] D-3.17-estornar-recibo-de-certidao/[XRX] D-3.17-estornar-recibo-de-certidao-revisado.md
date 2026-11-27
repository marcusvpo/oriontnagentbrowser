---
id: D-3.17
titulo: 'Estornar Recibo de Certidão'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
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
      alvos_ausentes: ['Editar']
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxzpu33c5djcl-31] | x=686, y=254, 327x21'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios), "Imprimir" (Faça uma consulta que retorne resultados.); pré-filtro automático tentado antes de declarar a grade vazia: a busca (filtro amplo) não retornou registros no ambiente). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: M-54.3 — Como Lançar as Custas em um Pedido de Certidão; M-54.1 — Como Criar um Novo Pedido de Certidão (Dados do Solicitante).

#### Descrição:
O estorno de recibo desfaz a baixa financeira de um pedido de certidão, cancelando a movimentação de entrada no caixa ativo do operador e restaurando o status do pedido para 'Aguardando Pagamento' ou cancelando o faturamento.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-54.3 (Como Lançar as Custas em um Pedido de Certidão) para criar o registro necessário.
2. Executar antes a rotina M-54.1 (Como Criar um Novo Pedido de Certidão (Dados do Solicitante)) para criar o registro necessário.
3. Reexecutar a auditoria da rotina D-3.17.

* **Rotinas pré-requisito (executar antes):** **M-54.3**, **M-54.1**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Consultas > Consulta de Certidões e Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Certidões e serviços**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Consultas > Consulta de Certidões e Serviços"**, porém na versão atual do Orion TN a tela fica em **"Notas > Consultas > Certidões e serviços"** (confiança: 88% — Equivalência de folha: "Consulta de Certidões e Serviços" ≡ "Certidões e serviços" (mesma chave de folha sob "Notas > Consultas")). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente).
2. Localize a certidão pelo número do pedido ou recibo e clique no botão **Editar**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Editar] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. No topo da tela, clique no ícone de **Cifrão ($) / Financeiro** para abrir a movimentação de caixa.
4. Localize a linha do recibo emitido e clique no botão **Estornar Recibo / Excluir**.
5. Informe a justificativa operacional do estorno no campo obrigatório.
6. Confirme a operação; o sistema deduzirá o valor do saldo do caixa e reabrirá a cobrança.

* **Importante: Se a certidão já tiver selo digital gerado e transmitido ao TJ, o estorno financeiro não cancela automaticamente o selo, sendo necessário inutilizá-lo.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
