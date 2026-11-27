---
id: D-2.13
titulo: 'Consultar Histórico de Aquisição'
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
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T21:41:21.229Z'
    rota: '#/inicio'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos: []
    botoes: []
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Consultas > Histórico de Aquisição" não existe na árvore de navegação real do Orion TN. O menu raiz "Consultas" não existe na barra de navegação (menus lidos: "Administração", "Configurações", "2", "Olá, [usuário]", "Olá Marcus , seja bem-vindo!"). Nenhum item de nome igual ou parecido existe em outro ponto da árvore (28 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — melhor candidato "Administração > Controle de Estoque > Aquisição" com 0.8 (limiar 0.7) e margem 0.1 (mínimo 0.12): sem destino inequívoco; candidatos mais próximos: "Administração > Controle de Estoque > Aquisição (0.8)"; "Administração > Comissões > Consulta (0.7)"; "Administração > Controle de Estoque > Cadastros > Produto (0.7)"; "Administração > Controle de Estoque > Consultas (0.7)"; "Históricos (0.7)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * Nenhuma seção, aba, campo ou botão visível foi lido nesta tela.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A consulta de Histórico de Aquisições exibe todas as notas fiscais e lotes oficiais que ingressaram no almoxarifado do cartório. Demonstra a data de recebimento, fornecedor, quantidade adquirida, sequência de numeração (inicial e final) e usuário que registrou a entrada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Consultas > Histórico de Aquisição**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Consultas > Histórico de Aquisição
2. Defina os filtros: **Período de Entrada**, **Fornecedor** ou **Produto Específico**.
3. Se necessário, informe o número da **Nota Fiscal** ou número de série da folha.
4. Clique em **Filtrar** para listar as entradas na grade.
5. Clique sobre a linha para inspecionar os detalhes do lote, numeração de série e usuário responsável.

* **Observação: É possível exportar a listagem de aquisições para relatórios periódicos de prestação de contas aos órgãos fiscalizadores.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
