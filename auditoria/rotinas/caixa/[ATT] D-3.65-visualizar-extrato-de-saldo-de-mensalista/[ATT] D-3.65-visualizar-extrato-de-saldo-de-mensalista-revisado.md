---
id: D-3.65
titulo: 'Visualizar Extrato de Saldo de Mensalista'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T19:34:52.986Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Mensalistas > Visualizar Extrato de Saldo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "Orçamento rápido", "Nova certidão e serviço", "Certidões e serviços", "Certidões e serviços em aberto", "Consultas"; "Mensalistas" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — nenhum radical de folha do catálogo aparece no título nem nos passos 1 a 3. Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O Extrato de Saldo de Mensalista é o espelho contábil da relação comercial entre o cartório e a empresa conveniada. Demonstra o limite total concedido, consumo acumulado no mês corrente, faturas pendentes de liquidação e histórico de pagamentos efetuados.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Mensalistas > Visualizar Extrato de Saldo**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Notas > Mensalistas > Visualizar Extrato de Saldo
2. Selecione o **Cliente Mensalista** no menu de busca nominal ou CNPJ.
3. O sistema exibirá o quadro de resumo financeiro:
   * **Limite Total Concedido** e **Saldo de Crédito Disponível**
   * **Consumo em Aberto no Mês Atual** (atos ainda não faturados)
   * **Faturas Emitidas Pendentes de Pagamento**.
4. Clique na aba **Histórico de Lançamentos** para consultar cada protocolo discriminado por data e solicitante.
5. Clique em **Imprimir / Exportar Extrato** para envio à empresa solicitante.

* **Limite Total Concedido** e **Saldo de Crédito Disponível**
   * **Consumo em Aberto no Mês Atual** (atos ainda não faturados)
   * **Faturas Emitidas Pendentes de Pagamento**.
4. Clique na aba **Histórico de Lançamentos** para consultar cada protocolo discriminado por data e solicitante.
5. Clique em **Imprimir / Exportar Extrato** para envio à empresa solicitante.

* **Observação: O extrato pode ser emitido com detalhes de centros de custos para atender aos departamentos de auditoria das empresas clientes.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
