---
id: D-3.66
titulo: 'Registrar Serviço Interno'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Administração > Registrar Serviço Interno'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T20:28:53.475Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por semântica fechada sobre o catálogo (Camada 3) ("Notas > Administração > Registrar Serviço Interno" -> "Notas > Consultas > Certidões e serviços" (#/certidoesServicos)) não contém "Novo Serviço Interno", "Tipo de Ato Praticado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Certidões e serviços", "Pedido", "N° Recibo", "Data pedido", "Mês do pedido", "Data previsão", "Data recibo", "Nome", "Fonética", "Começa com", "Contém", "CPF ou CIN/CNPJ", "Livro", "Folha". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A rotina de Serviços Internos é utilizada para emissão de atos destinados à administração da própria serventia (ex: certidões para instrução de processos do cartório, fotocópias administrativas ou consultas correicionais). Registra o consumo de insumos sem gerar receita cobrável.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Administração > Registrar Serviço Interno** (ou menu de Firmas).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Certidões e serviços**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Notas > Administração > Registrar Serviço Interno"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por semântica fechada sobre o catálogo (Camada 3) ("Notas > Administração > Registrar Serviço Interno" -> "Notas > Consultas > Certidões e serviços" (#/certidoesServicos)) não contém "Novo Serviço Interno", "Tipo de Ato Praticado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Certidões e serviços", "Pedido", "N° Recibo", "Data pedido", "Mês do pedido", "Data previsão", "Data recibo", "Nome", "Fonética", "Começa com", "Contém", "CPF ou CIN/CNPJ", "Livro", "Folha".
2. Clique no botão **Novo Serviço Interno**.
3. Selecione o **Tipo de Ato Praticado** (Certidão Interna, Autenticação Administrativa ou Cópia).
4. Informe o **Setor Solicitante** ou o motivo da requisição interna.
5. Se o ato exigir selo de fiscalização com isenção ou papel oficial, confirme o consumo no card de insumos.
6. Clique em **Concluir Registro**; o sistema arquivará o lançamento na rubrica de serviços internos sem gerar saldo no caixa.

* **Importante: Toda emissão interna que envolva selo de fiscalização deve ter motivo formalmente consignado para prestação de contas à Corregedoria.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
