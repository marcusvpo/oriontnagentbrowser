# Catálogo de Telas do Orion TN (Mapeamento Nível 2)

- **Versão do Catálogo:** 06.05.02 (Nível 2)
- **Ambiente:** Produtos (homologacao interna Siplan)
- **Capturado em:** 2026-11-26T03:56:29.150Z
- **Total de Telas no Catálogo:** 115 (Capturadas: 114 | Falhas: 0 | Ignoradas: 1)
- **Totais de Superfície:** 467 botões | 935 campos | 20 abas | 106 tabelas
- **Cobertura Nível 2/2.5:** 73 exploradas | 41 sem sub-estados | 0 parciais | 0 falhas | 95 sub-estados | 777 botões únicos | 2202 campos únicos | 122 ícones | 0 alertas de segurança | 5 alternadores de visão | 3 grades reveladas | 13 prints full-page reais

## Módulo: Dashboard (4 tela(s))

### [001] Dashboard > Atos Protocolares

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/dashboard` | **Título:** Atos protocolares
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/dashboard/001-dashboard-atos-protocolares.png)
- **Cabeçalhos:** **Atos protocolares**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Kanban**
  - **Dashboard**
  - **Filtros**
  - **+ Novo protocolo** — mutação
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `explored` | **Sub-estados:** 4
- **Árvore Nível 2 (Sub-estados):**
  - **Alternadores de Modo/Visão (2):**
    - **Kanban** (status: `captured` | abertura: `view_switch` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/001-dashboard-atos-protocolares__view-kanban.png))
      - Botões (4): **Kanban**, **Dashboard**, **Filtros**, **+ Novo protocolo**
    - **Dashboard** (status: `captured` | abertura: `view_switch` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/001-dashboard-atos-protocolares__view-dashboard.png))
      - Botões (3): **Kanban**, **Dashboard**, **+ Novo protocolo**
      - Tabela 1: [**ATENDENTE**, **EM ANDAMENTO**, **LIBERADO PARA CONFERÊNCIA**, **NECESSÁRIO REVISÃO**, **LIBERADO PARA IMPRESSÃO**, **RECIBO ESTORNADO**, **TOTAL**] (17 linha(s))
      - Tabela 2: [**EMPRESA**, **EM ANDAMENTO**, **LIBERADO PARA CONFERÊNCIA**, **NECESSÁRIO REVISÃO**, **LIBERADO PARA IMPRESSÃO**, **RECIBO ESTORNADO**, **TOTAL**] (1 linha(s))
  - **Accordions & Filtros Avançados (1):**
    - **Filtros** (status: `captured` | abertura: `accordion` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/001-dashboard-atos-protocolares__filter-filtros.png))
      - Botões (2): **Limpar filtros**, **Filtrar**
      - Campos (6): **Agrupar por** (`select`), **Ordenar quadro** (`select`), **Natureza** (`select`), **Escrevente** (`select`), **Auxiliar do escrevente** (`select`), **Dias em aberto** (`select`)
  - **Modais / Formulários (1):**
    - **+ Novo protocolo** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/001-dashboard-atos-protocolares__open-novo-protocolo.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/dashboard/001-dashboard-atos-protocolares__open-novo-protocolo-full.png) | altura: 915px)
      - Accordions na aba: **Duplicar protocolo**, **Preencher protocolo com I.A.**, **Orçamento rápido**
      - Botões (9): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, `glyphicons glyphicons-search`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`
      - Campos (36): **Data recepção** (`text`), **inputStatusProtocolo** (`text`), **Situação** (`select`), **inputNumeroRecibo** (`text`), **Data recibo** (`text`), **__/__/____** (`text`), **Escrevente** (`select`), **Espécie** (`select`), **Natureza** (`select`), **__/__/____** (`text`), **Escrevente assinante (Substituto):** (`select`), **Auxiliar do escrevente:** (`select`), **Escrevente que colheu as assinaturas** (`select`), **Pessoa física** (`radio`), **Pessoa jurídica** (`radio`), **Mensalista** (`radio`), **Escrevente** (`radio`), **CPF ou CIN** (`text`), **Nome** (`text`), **Tomador** (`checkbox`) (+16)

### [002] Dashboard > Envio para Registro

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/dashboard/envioRegistro` | **Título:** Dashboard de envio para registro
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/dashboard/002-dashboard-envio-para-registro.png)
- **Cabeçalhos:** **Dashboard de envio para registro**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (1):**
  - **+ Filtros** — tooltip: "Mais filtros"
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Accordions & Filtros Avançados (1):**
    - **+ Filtros** (status: `captured` | abertura: `accordion` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/002-dashboard-envio-para-registro__filter-filtros.png))
      - Botões (3): **Filtrar**, **Limpar**, **- Filtros**
      - Campos (5): **Ordenar quadro** (`select`), **Natureza** (`select`), **Escrevente** (`select`), **Auxiliar do escrevente** (`select`), **Dias em aberto** (`select`)

### [003] Dashboard > Comunicações

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/dashboard/comunicacoes/geral` | **Título:** Comunicações
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/dashboard/003-dashboard-comunicacoes.png)
- **Cabeçalhos:** **Comunicações**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Visão Geral**
  - **Por comunicação**
- **Campos / Filtros:** Nenhum
- **Tabelas (1):**
  - Tabela 1: Colunas [**COMUNICAÇÃO**, **NÃO VALIDADOS**, **PRONTOS PARA ENVIO**, **URGENTES**, **ATRASADOS**, **COM PENDÊNCIAS**, **ENVIADOS**, **TOTAL**] — Estado: 6 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 2
- **Árvore Nível 2 (Sub-estados):**
  - **Alternadores de Modo/Visão (2):**
    - **Visão Geral** (status: `captured` | abertura: `view_switch` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/003-dashboard-comunicacoes__view-visao-geral.png))
      - Botões (2): **Visão Geral**, **Por comunicação**
      - Tabela 1: [**COMUNICAÇÃO**, **NÃO VALIDADOS**, **PRONTOS PARA ENVIO**, **URGENTES**, **ATRASADOS**, **COM PENDÊNCIAS**, **ENVIADOS**, **TOTAL**] (6 linha(s))
    - **Por comunicação** (status: `captured` | abertura: `view_switch` | [Print](../auditoria/mapeamento-telas/nivel-2/dashboard/003-dashboard-comunicacoes__view-por-comunicacao.png))
      - Botões (8): **Visão Geral**, **Por comunicação**, **SEFAZ – ITCMD**, **DOI**, **SIGNO-RCTO**, **SIGNO-CEP**, **SIGNO-CESDI**, **CENSEC-CTP**

### [004] Dashboard > Agenda de protocolos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/agendaFinanceira` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/dashboard/004-dashboard-agenda-de-protocolos.png)
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros (7):**
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
  - **Sem rótulo** (tipo: `text` | opcional)
- **Tabelas (4):**
  - Tabela 1: Colunas [**SEG 23 TER 24 QUA 25 QUI 26 SEX 27 SÁB 28**, **SEG 23**, **TER 24**, **QUA 25**, **QUI 26**, **SEX 27**, **SÁB 28**] — Estado: 14 linha(s)
  - Tabela 2: Colunas [**SEG 23**, **TER 24**, **QUA 25**, **QUI 26**, **SEX 27**, **SÁB 28**] — Estado: vazia
  - Tabela 3: Colunas [_sem cabeçalhos_] — Estado: 12 linha(s)
  - Tabela 4: Colunas [_sem cabeçalhos_] — Estado: 1 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

## Módulo: Firmas (8 tela(s))

### [005] Firmas > Abertura de pedido

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/aberturaPedidos` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/005-firmas-abertura-de-pedido.png)
- **Cabeçalhos:** **Localizar cartão de assinatura**, **Abertura de pedido**, **Total**, **R$ 0,00**, **Nomes para reconhecimento**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Nova senha** — tooltip: "Nova senha" | mutação
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | tooltip: "Preencha o número do pedido" | desabilitado
  - **Finalizar** — tooltip: "Nenhum pedido aberto encontrado." | desabilitado | mutação
  - **Cancelar** — tooltip: "Nenhum pedido aberto encontrado." | desabilitado | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (16):**
  - **Nome** (tipo: `text` | obrigatório)
  - **Documento** (tipo: `select` | obrigatório | opções (3): [< Selecione >, CPF ou CIN, RG])
  - **Número** (tipo: `text` | opcional | desabilitado)
  - **Rótulo** (tipo: `text` | opcional)
  - **Senha** (tipo: `text` | opcional)
  - **Data e hora** (tipo: `text` | opcional | desabilitado)
  - **Status** (tipo: `text` | opcional | desabilitado)
  - **Tipo de pedido** (tipo: `select` | opcional | opções (5): [< Selecione >, À vista, Escreventes, Mensalista, Serviço Interno])
  - **codServicoAberturaPedido0** (tipo: `text` | opcional)
  - **descricaoServicoAberturaPedido0** (tipo: `text` | opcional)
  - **quantidadeServicoAberturaPedido0** (tipo: `text` | opcional | desabilitado)
  - **cbDivisorSelecaoServicoAberturaPedido0** (tipo: `select` | obrigatório | desabilitado | opções (25): [< Selecione >, 1/3 DAS CUSTAS, 1/3 DE 1/4 DAS CUSTAS, 1/4 das Custas, 1/4 DO ATO (+20 opções)])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **Responsável** (tipo: `text` | opcional | desabilitado)
  - **Impressora** (tipo: `select` | opcional | opções (1): [< Selecione >])
  - **Modelo** (tipo: `select` | opcional | opções (5): [< Selecione >, Abertura de pedido, ORÇAMENTO, Pedido - Recibo, Senha-Comprovante])
- **Tabelas (2):**
  - Tabela 1: Colunas [**CÓD**, **Serviço**, **QTD**, **Cálculo**, **R$ Unitário**, **R$ Total**] — Estado: 1 linha(s)
  - Tabela 2: Colunas [**Nome civil**, **CPF ou CIN**, **RG**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [006] Firmas > Reconhecimento de firmas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/pedidoFirmas/cadastrar` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/006-firmas-reconhecimento-de-firmas.png)
- **Cabeçalhos:** **Reconhecimento de firmas**, **Serviços solicitados**, **Serviços realizados**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (9):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | tooltip: "Preencha o número do pedido" | desabilitado
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | tooltip: "Preencha a senha SGA" | desabilitado
  - **Buscar biometria**
  - **Novo cartão** — mutação
  - **Limpar**
  - **Filtrar** — desabilitado
  - **Tomador** — tooltip: "Para cadastrar um tomador faça a criação de um pedido" | desabilitado | mutação
  - **Pagamento** — tooltip: "O status do pedido deve ser Finalizado, Aguardando pagamento ou Pago para abrir o modal do caixa" | desabilitado
  - **Termo** — tooltip: "Não há serviço que utiliza termo no pedido" | desabilitado
- **Campos / Filtros (23):**
  - **Pedido/Senha** (tipo: `text` | opcional)
  - **Senha SGA** (tipo: `text` | opcional)
  - **Data** (tipo: `text` | opcional | desabilitado)
  - **Status** (tipo: `text` | opcional | desabilitado)
  - **Tipo de pedido** (tipo: `select` | opcional | desabilitado | opções (5): [< Selecione >, À vista, Escreventes, Mensalista, Serviço Interno])
  - **Solicitante** (tipo: `text` | opcional | desabilitado)
  - **CPF ou CIN/CNPJ** (tipo: `text` | opcional | desabilitado)
  - **Busca por** (tipo: `radio` | opcional)
  - **Sinal** (tipo: `radio` | opcional)
  - **Nome** (tipo: `text` | opcional)
  - **Nº cartão** (tipo: `text` | opcional)
  - **CPF ou CIN** (tipo: `text` | opcional)
  - **RG** (tipo: `text` | opcional)
  - **Pessoa jurídica** (tipo: `text` | opcional)
  - **Busca por fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | opcional)
  - **Contém** (tipo: `radio` | opcional)
  - **Cod.** (tipo: `text` | obrigatório)
  - **Nome do serviço** (tipo: `text` | obrigatório)
  - **Escrevente** (tipo: `select` | obrigatório | desabilitado | opções (11): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+6 opções)])
  - **Cálculo** (tipo: `select` | obrigatório | desabilitado | opções (25): [< Selecione >, 1/3 DAS CUSTAS, 1/3 DE 1/4 DAS CUSTAS, 1/4 das Custas, 1/4 DO ATO (+20 opções)])
  - **QTD** (tipo: `text` | opcional | desabilitado)
  - **Observação** (tipo: `text` | opcional)
- **Tabelas (2):**
  - Tabela 1: Colunas [**Serviço**, **QTD**, **Cálculo**, **R$ Unitário**, **R$ Total**] — Estado: vazia
  - Tabela 2: Colunas [**Serviço**, **QTD**, **Série**, **Seq. Inicial**, **Seq. Final**, **R$ Unitário**, **R$ Total**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Novo cartão** (status: `captured` | abertura: `modal` | título: "OrionTN - Tabelionatos de Notas" | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/006-firmas-reconhecimento-de-firmas__open-novo-cartao.png))

### [007] Firmas > Consultas > Reconhecimentos de firmas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/pedidoFirmas` | **Título:** Reconhecimentos de firmas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/007-firmas-consultas-reconhecimentos-de-firmas.png)
- **Cabeçalhos:** **Reconhecimentos de firmas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Realize uma busca com resultados para imprimir" | desabilitado
  - **Adicionar** — tooltip: "Adicionar reconhecimento de firmas" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (15):**
  - **Nº pedido** (tipo: `number` | opcional)
  - **Nº RPS** (tipo: `number` | opcional)
  - **Status** (tipo: `select` | opcional | opções (7): [< Selecione >, Aguardando atendimento, Aguardando pagamento, Cancelado, Finalizado (+2 opções)])
  - **Senha SGA** (tipo: `string` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | opcional | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Cód. mensalista** (tipo: `text` | opcional)
  - **Mensalista** (tipo: `text` | opcional)
  - **Requisição N°** (tipo: `text` | opcional)
  - **Usuário** (tipo: `select` | opcional | opções (18): [< Selecione >, Carlos Neves, Erik Marques, Henrique, Henrique Senha (+13 opções)])
  - **Escrevente** (tipo: `select` | opcional | opções (23): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+18 opções)])
  - **Item** (tipo: `select` | opcional | opções (30): [< Selecione >, Reconhecimento AEDO, Apostilamento de Haia, Fotocópia, Procuração para o foro em geral acima de 4 outorgantes (adicional) (+25 opções)])
  - **Tipo de pedido** (tipo: `select` | opcional | opções (5): [< Selecione >, À vista, Escrevente, Mensalista, Serviço interno])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Pedido**, **RPS**, **Status**, **Usuário**, **Escrevente**, **Mensalista**, **Iniciado em**, **Concluído em**, **Pago em**, **Senha SGA**, **R$ Total**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/007-firmas-consultas-reconhecimentos-de-firmas__open-adicionar.png))
      - Botões (9): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, **Buscar biometria**, **Novo cartão**, **Limpar**, **Filtrar**, **Tomador**, **Pagamento**, **Termo**
      - Campos (23): **Pedido/Senha** (`text`), **Senha SGA** (`text`), **Data** (`text`), **Status** (`text`), **Tipo de pedido** (`select`), **Solicitante** (`text`), **CPF ou CIN/CNPJ** (`text`), **Busca por** (`radio`), **Sinal** (`radio`), **Nome** (`text`), **Nº cartão** (`text`), **CPF ou CIN** (`text`), **RG** (`text`), **Pessoa jurídica** (`text`), **Busca por fonética** (`checkbox`), **Começa com** (`radio`), **Contém** (`radio`), **Cod.** (`text`), **Nome do serviço** (`text`), **Escrevente** (`select`) (+3)
      - Tabela 1: [**Serviço**, **QTD**, **Cálculo**, **R$ Unitário**, **R$ Total**] (0 linha(s))
      - Tabela 2: [**Serviço**, **QTD**, **Série**, **Seq. Inicial**, **Seq. Final**, **R$ Unitário**, **R$ Total**] (0 linha(s))

### [008] Firmas > Consultas > Serviços praticados

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/servicoPraticado` | **Título:** Serviço praticado
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/008-firmas-consultas-servicos-praticados.png)
- **Cabeçalhos:** **Serviço praticado**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (6):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | desabilitado
  - **Mais filtros** — tooltip: "Mais filtros"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Impressão desativada temporariamente para revisão devido a impactos de desempenho. Caso utilize esta rotina, entre em contato com o Suporte para análise e adequação da impressão." | desabilitado
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (11):**
  - **Serviço** (tipo: `text` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Nº do pedido** (tipo: `number` | opcional)
  - **Nome** (tipo: `text` | obrigatório)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | opcional)
  - **Contém** (tipo: `radio` | opcional)
  - **CPF ou CIN** (tipo: `text` | obrigatório)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data serviço**, **Ped.**, **Data ped.**, **Serviço**, **Série**, **Seq.**, **Selo**, **Nome**, **CPF ou CIN**, **Termo**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Accordions & Filtros Avançados (1):**
    - **Mais filtros** (status: `captured` | abertura: `accordion` | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/008-firmas-consultas-servicos-praticados__filter-mais-filtros.png))
      - Botões (1): **Menos filtros**
      - Campos (21): **Nº cartão** (`number`), **Hash** (`text`), **Número do carimbo** (`number`), **Série** (`text`), **Sequência inicial** (`number`), **Sequência final** (`number`), **Usuário** (`select`), **Escrevente** (`select`), **Cód. Mensalista** (`text`), **Mensalista** (`text`), **Requisição N°** (`text`), **Código do termo** (`number`), **Código do termo** (`number`), **Número do livro** (`number`), **Número da folha** (`number`), **Lado** (`select`), **Placa** (`text`), **Renavam** (`text`), **Exibir cancelados** (`checkbox`), **Com termos** (`checkbox`) (+1)
      - Tabela 1: [**Data serviço**, **Ped.**, **Data ped.**, **Serviço**, **Série**, **Seq.**, **Selo**, **Nome**, **CPF ou CIN**, **Termo**] (0 linha(s))

### [009] Firmas > Cadastros > Cartão de assinatura

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/ficha` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/009-firmas-cadastros-cartao-de-assinatura.png)
- **Cabeçalhos:** **Cartões de assinatura**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Realize uma busca com resultados para imprimir" | desabilitado
  - **Adicionar** — tooltip: "Adicionar ficha" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (23):**
  - **Pesquisar por nome** (tipo: `text` | obrigatório)
  - **Pessoa física** (tipo: `radio` | opcional)
  - **Pessoa jurídica** (tipo: `radio` | opcional)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | opcional)
  - **Contém** (tipo: `radio` | opcional)
  - **Documento** (tipo: `select` | obrigatório | opções (3): [< Selecione >, CPF ou CIN, RG])
  - **Número** (tipo: `text` | opcional | desabilitado)
  - **N° Cartão** (tipo: `text` | obrigatório)
  - **NFS** (tipo: `text` | obrigatório)
  - **Rótulo** (tipo: `text` | opcional)
  - **Período de digitação** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Digitador** (tipo: `select` | obrigatório | opções (18): [< Selecione >, Carlos Neves, Erik Marques, Henrique, Henrique Senha (+13 opções)])
  - **Escrevente** (tipo: `select` | obrigatório | opções (23): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+18 opções)])
  - **Status** (tipo: `select` | opcional | opções (3): [< Selecione >, Ativo, Bloqueado])
  - **Observações** (tipo: `text` | obrigatório)
  - **Possui pendências** (tipo: `checkbox` | opcional)
  - **Nome Social** (tipo: `text` | obrigatório)
  - **Começa com** (tipo: `radio` | opcional)
  - **Contém** (tipo: `radio` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Nº Cartão**, **Nome**, **Nome Social**, **CPF ou CIN**, **NFS**, **Data digitação**, **Rótulos**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/009-firmas-cadastros-cartao-de-assinatura__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/firmas/009-firmas-cadastros-cartao-de-assinatura__open-adicionar-full.png) | altura: 1196px)
      - Botões (21): **Preencher cartão usando I.A.**, **Consumir**, **Gerar**, `glyphicons glyphicons-search`, `glyphicons glyphicons-user-ban`, `glyphicons glyphicons-search`, `glyphicon glyphicon-plus`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `glyphicons glyphicons-search`, `halflings halflings-plus` (+6)
      - Campos (55): **Filtro** (`checkbox`), **Nome** (`search`), **Nome social** (`text`), **Sexo** (`select`), **Nascimento** (`text`), **CPF ou CIN** (`text`), **RG** (`text`), **Orgão emissor** (`select`), **UF** (`select`), **Data emissão** (`text`), **CNH** (`text`), **Categoria** (`select`), **Data 1ª habilitação** (`text`), **Data Expedição** (`text`), **Data expiração** (`text`), **Outro documento** (`select`), **Número** (`text`), **Orgão emissor** (`select`), **UF** (`select`), **Data emissão** (`text`) (+35)
      - Tabela 1: [**NFS**, **Status**, **Responsável**] (0 linha(s))
      - Tabela 2: [**Selo**, **Status**] (0 linha(s))
      - Tabela 3: [**Razão Social**, **CNPJ**, **Padrão**] (0 linha(s))
      - Tabela 4: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [010] Firmas > Cadastros > Sinal público

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/sinalPublico` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/010-firmas-cadastros-sinal-publico.png)
- **Cabeçalhos:** **Sinal público**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Realize uma busca com resultados para imprimir" | desabilitado
  - **Adicionar** — tooltip: "Adicionar sinal público" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Cartório** (tipo: `text` | obrigatório)
  - **Nº Sinal** (tipo: `text` | obrigatório)
  - **__/__/____** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Nº Sinal**, **Cartório**, **Data digitação**, **Situação**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/010-firmas-cadastros-sinal-publico__open-adicionar.png))
      - Botões (6): `halflings halflings-plus`, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir**, **Voltar**
      - Campos (19): **Cartório** (`text`), **Recebido** (`radio`), **Enviado** (`radio`), **Data recebimento** (`text`), **inputTextEmail** (`text`), **inputTextSite** (`text`), **Digitador** (`text`), **Digitado em** (`text`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **UF** (`select`), **Cidade** (`text`), **Observações** (`text`), **Nome** (`text`), **Cargo** (`select`), **selecionarAnexoSinalPublico** (`file`)
      - Tabela 1: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoTermo` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/011-firmas-cadastros-tipo-de-documento-termo-de-comparecimento.png)
- **Cabeçalhos:** **Tipos de documento - Termo de comparecimento**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Descrição** (tipo: `text` | opcional)
  - **CRV - SEFAZ SP** (tipo: `checkbox` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **CRV - SEFAZ SP**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/firmas/011-firmas-cadastros-tipo-de-documento-termo-de-comparecimento__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/firmas/011-firmas-cadastros-tipo-de-documento-termo-de-comparecimento__open-adicionar-full.png) | altura: 958px)
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Descrição** (`text`), **Modelo de impressão (padrão)** (`select`), **CRV - SEFAZ SP** (`checkbox`), **Digite aqui a descrição *** (`text`)

### [012] Firmas > Cadastros > Digitalização em lote

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/digitalizarEmLote` | **Título:** OrionTN - Tabelionatos de Notas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/firmas/012-firmas-cadastros-digitalizacao-em-lote.png)
- **Cabeçalhos:** **Digitalização**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Processar** — tooltip: "Processar"
- **Campos / Filtros (6):**
  - **Rotina** (tipo: `select` | opcional | opções (6): [< Selecione >, Cartão de assinatura, Cartão de assinatura - código barras, DUT, Livro (+1 opções)])
  - **Responsável** (tipo: `select` | opcional | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
  - **Status** (tipo: `select` | opcional | opções (3): [< Selecione >, Concluído, Cancelado])
  - **__/__/____** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data digitalização**, **Rotina**, **Responsável**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

## Módulo: Notas (12 tela(s))

### [013] Notas > Protocolos em aberto

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/protocolo/aberto` | **Título:** Protocolos em aberto
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/013-notas-protocolos-em-aberto.png)
- **Cabeçalhos:** **Protocolos em aberto**
- **Abas:** Nenhuma
- **Accordions (1):** **Orçamento rápido** (expandido)
- **Botões:** Nenhum
- **Campos / Filtros (1):**
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [15, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**N° Protocolo**, **Data recepção**, **Escrevente**, **Espécie**, **Natureza**, **Solicitante**, **Telefone**, **Status**] — Estado: 15 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [014] Notas > Novo protocolo

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/protocolo/cadastrar` | **Título:** Protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/014-notas-novo-protocolo.png)
- **Cabeçalhos:** **Protocolo**
- **Abas:** Nenhuma
- **Accordions (3):** **Duplicar protocolo** (expandido), **Preencher protocolo com I.A.** (expandido), **Orçamento rápido** (expandido)
- **Botões (9):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
- **Campos / Filtros (36):**
  - **Data recepção** (tipo: `text` | opcional)
  - **inputStatusProtocolo** (tipo: `text` | opcional | desabilitado)
  - **Situação** (tipo: `select` | opcional | opções (13): [< Selecione >, Em andamento, 1 - STATUS, 2 - STATUS, 3 - STATUS (+8 opções)])
  - **inputNumeroRecibo** (tipo: `text` | opcional | desabilitado)
  - **Data recibo** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Escrevente** (tipo: `select` | obrigatório | opções (9): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+4 opções)])
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **Natureza** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
  - **__/__/____** (tipo: `text` | opcional)
  - **Escrevente assinante (Substituto):** (tipo: `select` | opcional | opções (5): [< Selecione >, Henrique, Marcus, rafael, Vinícius Sebastião])
  - **Auxiliar do escrevente:** (tipo: `select` | opcional | opções (1): [< Selecione >])
  - **Escrevente que colheu as assinaturas** (tipo: `select` | opcional | opções (9): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+4 opções)])
  - **Pessoa física** (tipo: `radio` | opcional)
  - **Pessoa jurídica** (tipo: `radio` | opcional)
  - **Mensalista** (tipo: `radio` | opcional)
  - **Escrevente** (tipo: `radio` | opcional)
  - **CPF ou CIN** (tipo: `text` | opcional)
  - **Nome** (tipo: `text` | opcional)
  - **Tomador** (tipo: `checkbox` | opcional | desabilitado)
  - **Informar intermediador** (tipo: `checkbox` | opcional)
  - **Tipo de endereço** (tipo: `select` | opcional | opções (3): [< Selecione >, Comercial, Residencial])
  - **CEP** (tipo: `text` | opcional)
  - **Logradouro** (tipo: `text` | opcional)
  - **Número** (tipo: `text` | opcional)
  - **Complemento** (tipo: `text` | opcional)
  - **Bairro** (tipo: `text` | opcional)
  - **País** (tipo: `select` | opcional | opções (30): [< Selecione >, AFEGANISTÃO, ÁFRICA DO SUL, ALBÂNIA, ALEMANHA (+25 opções)])
  - **UF** (tipo: `select` | opcional | opções (30): [< Selecione >, AC, AL, AP, AM (+25 opções)])
  - **Cidade** (tipo: `text` | opcional)
  - **Cód. IBGE** (tipo: `text` | opcional)
  - **Tipo de telefone** (tipo: `select` | opcional | opções (4): [< Selecione >, Comercial, Estrangeiro, Residencial])
  - **Telefone** (tipo: `text` | opcional)
  - **Tipo de e-mail** (tipo: `select` | opcional | opções (3): [< Selecione >, Comercial, Pessoal])
  - **E-mail** (tipo: `text` | opcional)
  - **Observação** (tipo: `textarea` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [015] Notas > Orçamento completo

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/orcamento/cadastrar` | **Título:** Cadastro de orçamento
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/015-notas-orcamento-completo.png)
- **Cabeçalhos:** **Cadastro de orçamento**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | tooltip: "Buscar"
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | desabilitado
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only` | tooltip: "Abrir modal tipo endereço"
  - **Informações** — tooltip: "Menos informações"
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - **Concluir** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (33):**
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **Natureza** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
  - **Escrevente** (tipo: `select` | obrigatório | opções (9): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+4 opções)])
  - **CPF ou CIN/CNPJ** (tipo: `text` | opcional)
  - **inputSolicitante** (tipo: `text` | obrigatório)
  - **Telefone** (tipo: `text` | opcional)
  - **Digite e tecle enter** (tipo: `text` | opcional)
  - **Observações** (tipo: `textarea` | opcional)
  - **Tipo de endereço** (tipo: `select` | opcional | opções (3): [< Selecione >, Comercial, Residencial])
  - **CEP** (tipo: `text` | opcional)
  - **Logradouro** (tipo: `text` | opcional)
  - **Número** (tipo: `text` | opcional)
  - **Complemento** (tipo: `text` | opcional)
  - **Bairro** (tipo: `text` | opcional)
  - **UF** (tipo: `select` | opcional | opções (30): [< Selecione >, AC, AL, AM, AP (+25 opções)])
  - **Cidade** (tipo: `text` | opcional)
  - **Vigência** (tipo: `select` | opcional | opções (6): [08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024, 11/02/2023 (+1 opções)])
  - **inputCodigoItemServicoorcamentoAtoCustas0** (tipo: `text` | obrigatório)
  - **inputNomeServicoorcamentoAtoCustas0** (tipo: `text` | obrigatório)
  - **inputQuantidadeOutorgantesServicoorcamentoAtoCustas0** (tipo: `text` | opcional | desabilitado)
  - **inputQuantidadeCalculoorcamentoAtoCustas0** (tipo: `text` | opcional)
  - **selectDivisorServicoorcamentoAtoCustas0** (tipo: `select` | obrigatório | opções (25): [< Selecione >, INTEGRAL, DILIGÊNCIA, 1/3 DAS CUSTAS, NIHIL EMOLUMENTOS (+20 opções)])
  - **inputValorVenalServicoorcamentoAtoCustas0** (tipo: `text` | opcional | desabilitado)
  - **inputValorInstrumentoServicoorcamentoAtoCustas0** (tipo: `text` | opcional | desabilitado)
  - **inputValorBaseCalculoServicoorcamentoAtoCustas0** (tipo: `text` | opcional | desabilitado)
  - **inputUfAliquotaorcamentoAtoCustas0** (tipo: `select` | opcional | opções (30): [< Selecione >, AC, AL, AP, AM (+25 opções)])
  - **inputTextCidadeAliquotaorcamentoAtoCustas0** (tipo: `text` | opcional)
  - **inputPorcentagemItbiServicoorcamentoAtoCustas0** (tipo: `text` | opcional)
  - **inputValorItbiServicoorcamentoAtoCustas0** (tipo: `text` | opcional)
  - **inputValorRegistroImoveisServicoorcamentoAtoCustas0** (tipo: `text` | opcional)
  - **inputNomeOutrosServicos02dee** (tipo: `text` | opcional)
  - **quantidadeOutrosServicos02dee** (tipo: `text` | opcional | desabilitado)
  - **inputValorOutrosServicos02dee** (tipo: `text` | opcional | desabilitado)
- **Tabelas (3):**
  - Tabela 1: Colunas [**Item**, **Descrição**, **Qtd. Adicional**, **Qtd. Cálculo**, **Cálculo**, **Valor venal**, **Valor do instrumento**, **Base de cálculo**, **Total**, **UF**, **Cidade**, **ITBI**, **Total ITBI**, **Reg. imóveis**, **Item**, **Descrição**] — Estado: 1 linha(s)
  - Tabela 2: Colunas [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] — Estado: vazia
  - Tabela 3: Colunas [**Serviço**, **Quantidade**, **Valor un.**, **Valor total**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Alternadores de Modo/Visão (1):**
    - **Informações** (status: `captured` | abertura: `view_switch` | [Print](../auditoria/mapeamento-telas/nivel-2/notas/015-notas-orcamento-completo__view-informacoes.png))
      - Botões (6): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, **Informações**, `glyphicons glyphicons-plus`, **Concluir**, **Voltar**
      - Campos (25): **Espécie** (`select`), **Natureza** (`select`), **Escrevente** (`select`), **CPF ou CIN/CNPJ** (`text`), **inputSolicitante** (`text`), **Telefone** (`text`), **Digite e tecle enter** (`text`), **Observações** (`textarea`), **Vigência** (`select`), **inputCodigoItemServicoorcamentoAtoCustas0** (`text`), **inputNomeServicoorcamentoAtoCustas0** (`text`), **inputQuantidadeOutorgantesServicoorcamentoAtoCustas0** (`text`), **inputQuantidadeCalculoorcamentoAtoCustas0** (`text`), **selectDivisorServicoorcamentoAtoCustas0** (`select`), **inputValorVenalServicoorcamentoAtoCustas0** (`text`), **inputValorInstrumentoServicoorcamentoAtoCustas0** (`text`), **inputValorBaseCalculoServicoorcamentoAtoCustas0** (`text`), **inputUfAliquotaorcamentoAtoCustas0** (`select`), **inputTextCidadeAliquotaorcamentoAtoCustas0** (`text`), **inputPorcentagemItbiServicoorcamentoAtoCustas0** (`text`) (+5)
      - Tabela 1: [**Item**, **Descrição**, **Qtd. Adicional**, **Qtd. Cálculo**, **Cálculo**, **Valor venal**, **Valor do instrumento**, **Base de cálculo**, **Total**, **UF**, **Cidade**, **ITBI**, **Total ITBI**, **Reg. imóveis**, **Item**, **Descrição**] (1 linha(s))
      - Tabela 2: [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] (0 linha(s))
      - Tabela 3: [**Serviço**, **Quantidade**, **Valor un.**, **Valor total**] (1 linha(s))
  - **Ações de Grade:**
    - Ações catalogadas (4): `Sair` (sem tooltip), `glyphicons glyphicons-plus` (sem tooltip), `Sair` (sem tooltip), `glyphicons glyphicons-plus` (sem tooltip)

### [016] Notas > Orçamento rápido

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/016-notas-orcamento-rapido.png)
- **Cabeçalhos:** **Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022**, **Orçamento rápido**, **Dados do solicitante**, **Custas**, **R$ 362,98**, **Outros serviços**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | tooltip: "Buscar"
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - **Gerar** — tooltip: "Imprimir" | mutação
  - **Cancelar** — tooltip: "Fechar" | mutação
- **Campos / Filtros (18):**
  - **selectVigenciaModal** (tipo: `select` | opcional | opções (6): [08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024, 11/02/2023 (+1 opções)])
  - **CPF ou CIN/CNPJ** (tipo: `text` | opcional)
  - **Solicitante** (tipo: `text` | opcional)
  - **Digite e tecle enter** (tipo: `text` | opcional)
  - **modalOrcamentoRapidocodItemServicoModal0** (tipo: `text` | obrigatório)
  - **modalOrcamentoRapidonomeServicoPagamentoModal0** (tipo: `text` | obrigatório)
  - **modalOrcamentoRapidoquantidadeOutorgantesModal0** (tipo: `text` | opcional | desabilitado)
  - **modalOrcamentoRapidoselectDivisorModal0** (tipo: `select` | obrigatório | opções (25): [< Selecione >, INTEGRAL, DILIGÊNCIA, 1/3 DAS CUSTAS, NIHIL EMOLUMENTOS (+20 opções)])
  - **modalOrcamentoRapidoinputValorBaseCalculoModal0** (tipo: `text` | opcional)
  - **modalOrcamentoRapidoinputUfAliquot0** (tipo: `select` | opcional | opções (30): [< Selecione >, AC, AL, AP, AM (+25 opções)])
  - **modalOrcamentoRapidoselectAliquotaCidadeModal0** (tipo: `text` | opcional)
  - **modalOrcamentoRapidoinputValorItbiModal0** (tipo: `text` | opcional)
  - **modalOrcamentoRapidoinputValorITBICalculoModal0** (tipo: `text` | opcional)
  - **modalOrcamentoRapidoinputValorRegistroImoveisModal0** (tipo: `text` | opcional)
  - **inputNomeOutrosServicos0b1f3** (tipo: `text` | opcional)
  - **quantidadeOutrosServicos0b1f3** (tipo: `text` | opcional | desabilitado)
  - **inputValorOutrosServicos0b1f3** (tipo: `text` | opcional | desabilitado)
  - **orcamentoObservacao** (tipo: `textarea` | opcional)
- **Tabelas (4):**
  - Tabela 1: Colunas [**Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**, **UF**, **Cidade**, **%ITBI**, **ITBI**, **Registro de Imóveis**] — Estado: 1 linha(s)
  - Tabela 2: Colunas [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] — Estado: vazia
  - Tabela 3: Colunas [**Serviço**, **Quantidade**, **Valor un.**, **Valor total**] — Estado: 1 linha(s)
  - Tabela 4: Colunas [_sem cabeçalhos_] — Estado: 3 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Ações de Grade:**
    - **Buscar** (status: `captured` | abertura: `grid_reveal` | [Print](../auditoria/mapeamento-telas/nivel-2/notas/016-notas-orcamento-rapido__grid-reveal.png))
      - Botões (5): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, **Gerar**, **Cancelar**
      - Campos (18): **selectVigenciaModal** (`select`), **CPF ou CIN/CNPJ** (`text`), **Solicitante** (`text`), **Digite e tecle enter** (`text`), **modalOrcamentoRapidocodItemServicoModal0** (`text`), **modalOrcamentoRapidonomeServicoPagamentoModal0** (`text`), **modalOrcamentoRapidoquantidadeOutorgantesModal0** (`text`), **modalOrcamentoRapidoselectDivisorModal0** (`select`), **modalOrcamentoRapidoinputValorBaseCalculoModal0** (`text`), **modalOrcamentoRapidoinputUfAliquot0** (`select`), **modalOrcamentoRapidoselectAliquotaCidadeModal0** (`text`), **modalOrcamentoRapidoinputValorItbiModal0** (`text`), **modalOrcamentoRapidoinputValorITBICalculoModal0** (`text`), **modalOrcamentoRapidoinputValorRegistroImoveisModal0** (`text`), **inputNomeOutrosServicos08d9e** (`text`), **quantidadeOutrosServicos08d9e** (`text`), **inputValorOutrosServicos08d9e** (`text`), **orcamentoObservacao** (`textarea`)
      - Tabela 1: [**Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**, **UF**, **Cidade**, **%ITBI**, **ITBI**, **Registro de Imóveis**] (1 linha(s))
      - Tabela 2: [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] (0 linha(s))
      - Tabela 3: [**Serviço**, **Quantidade**, **Valor un.**, **Valor total**] (1 linha(s))
      - Tabela 4: [_sem cabeçalhos_] (3 linha(s))
      - Grade revelada: 1 linha(s) | Ícones de ação: nenhum
    - Ações catalogadas (1): `glyphicons glyphicons-plus` (sem tooltip)

### [017] Notas > Nova certidão e serviço

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/certidoesServicos/cadastrar` | **Título:** Certidões e serviços
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/017-notas-nova-certidao-e-servico.png)
- **Cabeçalhos:** **Certidões e serviços**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (10):**
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only` | desabilitado
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-search`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only`
  - _(somente ícone: `glyphicons glyphicons-plus`)_ — `icon_only`
- **Campos / Filtros (44):**
  - **inputNumeroPedido** (tipo: `text` | opcional | desabilitado)
  - **__/__/____** (tipo: `text` | opcional)
  - **inputNumeroRecibo** (tipo: `text` | opcional | desabilitado)
  - **Data recibo** (tipo: `text` | opcional)
  - **Previsão de entrega** (tipo: `text` | opcional)
  - **inputStatusProtocolo** (tipo: `text` | opcional | desabilitado)
  - **Situação** (tipo: `select` | opcional | opções (13): [< Selecione >, Em andamento, 1 - STATUS, 2 - STATUS, 3 - STATUS (+8 opções)])
  - **Escrevente** (tipo: `select` | obrigatório | opções (9): [< Selecione >, Erik Marques, Henrique, Marcus, orion (+4 opções)])
  - **Certidões e serviços** (tipo: `select` | obrigatório | opções (7): [< Selecione >, APOSTILAMENTO DE HAIA, CARTA DE SENTENÇA, CERTIDÃO, CERTIDÃO AUTOCURATELA (+2 opções)])
  - **Escrevente assinante (Substituto):** (tipo: `select` | opcional | opções (5): [< Selecione >, Henrique, Marcus, rafael, Vinícius Sebastião])
  - **Auxiliar do escrevente:** (tipo: `select` | opcional | opções (1): [< Selecione >])
  - **Escrevente que colheu as assinaturas** (tipo: `select` | opcional | opções (15): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+10 opções)])
  - **Pessoa física** (tipo: `radio` | opcional)
  - **Pessoa jurídica** (tipo: `radio` | opcional)
  - **Mensalista** (tipo: `radio` | opcional)
  - **Escrevente** (tipo: `radio` | opcional)
  - **CPF ou CIN** (tipo: `text` | obrigatório)
  - **Nome** (tipo: `text` | obrigatório)
  - **Tomador** (tipo: `checkbox` | opcional | desabilitado)
  - **Informar intermediador** (tipo: `checkbox` | opcional)
  - **Tipo de endereço** (tipo: `select` | opcional | opções (3): [< Selecione >, Comercial, Residencial])
  - **CEP** (tipo: `text` | opcional)
  - **Logradouro** (tipo: `text` | opcional)
  - **Número** (tipo: `text` | opcional)
  - **Complemento** (tipo: `text` | opcional)
  - **Bairro** (tipo: `text` | opcional)
  - **País** (tipo: `select` | opcional | opções (30): [< Selecione >, AFEGANISTÃO, ÁFRICA DO SUL, ALBÂNIA, ALEMANHA (+25 opções)])
  - **UF** (tipo: `select` | opcional | opções (30): [< Selecione >, AC, AL, AP, AM (+25 opções)])
  - **Cidade** (tipo: `text` | opcional)
  - **Cód. IBGE** (tipo: `text` | opcional)
  - **Tipo de telefone** (tipo: `select` | opcional | opções (4): [< Selecione >, Comercial, Estrangeiro, Residencial])
  - **Telefone** (tipo: `text` | opcional)
  - **Tipo de e-mail** (tipo: `select` | opcional | opções (3): [< Selecione >, Comercial, Pessoal])
  - **E-mail** (tipo: `text` | opcional)
  - **Observação** (tipo: `textarea` | opcional)
  - **Vigência** (tipo: `select` | opcional | opções (6): [08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024, 11/02/2023 (+1 opções)])
  - **Número da guia** (tipo: `text` | opcional)
  - **inputCodigoItemServicoprotocoloCustasRegistra00** (tipo: `text` | obrigatório)
  - **inputNomeServicoprotocoloCustasRegistra00** (tipo: `text` | obrigatório)
  - **inputQuantidadeCalculoprotocoloCustasRegistra00** (tipo: `text` | opcional)
  - **selectDivisorServicoprotocoloCustasRegistra00** (tipo: `select` | obrigatório | opções (25): [< Selecione >, INTEGRAL, DILIGÊNCIA, 1/3 DAS CUSTAS, NIHIL EMOLUMENTOS (+20 opções)])
  - **inputNomeOutrosServicos00f10** (tipo: `text` | opcional)
  - **quantidadeOutrosServicos00f10** (tipo: `text` | opcional | desabilitado)
  - **inputValorOutrosServicos00f10** (tipo: `text` | opcional | desabilitado)
- **Tabelas (3):**
  - Tabela 1: Colunas [**Item**, **Descrição**, **Qtd. Cálculo**, **Cálculo**, **Total**] — Estado: 1 linha(s)
  - Tabela 2: Colunas [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] — Estado: vazia
  - Tabela 3: Colunas [**Descrição**, **Qtde**, **Valor un.**, **Valor total**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0
- **Árvore Nível 2 (Sub-estados):**
  - **Ações de Grade:**
    - Ações catalogadas (1): `glyphicons glyphicons-plus` (sem tooltip)

### [018] Notas > Certidões e serviços em aberto

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/certidoesServicos/aberto` | **Título:** Certidões e serviços em aberto
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/018-notas-certidoes-e-servicos-em-aberto.png)
- **Cabeçalhos:** **Certidões e serviços em aberto**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros (1):**
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [15, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**N° pedido**, **Data pedido**, **Previsão de entrega**, **Escrevente**, **Tipo**, **Solicitante**, **Telefone**, **Status**] — Estado: 15 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [019] Notas > Consultas > Índice de escrituras e procurações

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/indice` | **Título:** Índice de escrituras e procurações
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/019-notas-consultas-indice-de-escrituras-e-procuracoes.png)
- **Cabeçalhos:** **Índice de escrituras e procurações**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Selecione um escrevente e preencha ao menos um dos filtros obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (28):**
  - **N° Protocolo** (tipo: `text` | obrigatório)
  - **Período de recepção** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **N° Recibo** (tipo: `text` | obrigatório)
  - **Período de recibo** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Período de primeira lavratura** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **Natureza** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
  - **Comunicação** (tipo: `select` | obrigatório | opções (7): [< Selecione >, CEP, CESDI, DOI, DOITU (+2 opções)])
  - **Nome** (tipo: `text` | opcional)
  - **Parte** (tipo: `checkbox` | opcional)
  - **Solicitante** (tipo: `checkbox` | opcional)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | obrigatório)
  - **Contém** (tipo: `radio` | obrigatório)
  - **CPF ou CIN/CNPJ** (tipo: `text` | obrigatório)
  - **Tipo de Participação** (tipo: `select` | opcional | opções (30): [< Selecione >, A-ROGO, ADJUDICATÁRIO, ADQUIRENTE, ADVOGADO(A) (+25 opções)])
  - **Livro** (tipo: `text` | obrigatório)
  - **Folha** (tipo: `text` | obrigatório)
  - **Matrícula** (tipo: `text` | obrigatório)
  - **Objeto** (tipo: `text` | obrigatório)
  - **Tipo Imóvel** (tipo: `select` | opcional | opções (23): [< Selecione >, Loja, Terreno/fração, Galpão, Prédio comercial (+18 opções)])
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Status** (tipo: `select` | opcional | opções (11): [< Selecione >, Em andamento, Liberado para conferência, Liberado para impressão, Lavrado (+6 opções)])
  - **Assinatura pendente** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Status**, **Recibo**, **Data de recepção**, **Data recibo**, **Livro**, **Folha inicial**, **Folha final**, **Espécie**, **Natureza**, **Nome**, **Enviado para**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [020] Notas > Consultas > Orçamentos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/orcamento` | **Título:** Orçamentos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/020-notas-consultas-orcamentos.png)
- **Cabeçalhos:** **Orçamentos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Imprimir** — tooltip: "Realize uma busca com resultados para imprimir" | desabilitado
  - **Adicionar** — tooltip: "Adicionar orcamento" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (12):**
  - **N° orçamento** (tipo: `text` | obrigatório)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Nome** (tipo: `text` | obrigatório)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | opcional)
  - **Contém** (tipo: `radio` | opcional)
  - **CPF ou CIN/CNPJ** (tipo: `text` | obrigatório)
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Status** (tipo: `select` | obrigatório | opções (5): [< Selecione >, Protocolado, Desistência, Cancelado, Em aberto])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**N° Orçamento**, **Data criação**, **N° Protocolo**, **Solicitante**, **Escrevente**, **Status**, **Valor**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/notas/020-notas-consultas-orcamentos__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/notas/020-notas-consultas-orcamentos__open-adicionar-full.png) | altura: 1314px)
      - Botões (7): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, **Informações**, `glyphicons glyphicons-plus`, **Concluir**, **Voltar**
      - Campos (33): **Espécie** (`select`), **Natureza** (`select`), **Escrevente** (`select`), **CPF ou CIN/CNPJ** (`text`), **inputSolicitante** (`text`), **Telefone** (`text`), **Digite e tecle enter** (`text`), **Observações** (`textarea`), **Tipo de endereço** (`select`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **UF** (`select`), **Cidade** (`text`), **Vigência** (`select`), **inputCodigoItemServicoorcamentoAtoCustas0** (`text`), **inputNomeServicoorcamentoAtoCustas0** (`text`), **inputQuantidadeOutorgantesServicoorcamentoAtoCustas0** (`text`) (+13)
      - Tabela 1: [**Item**, **Descrição**, **Qtd. Adicional**, **Qtd. Cálculo**, **Cálculo**, **Valor venal**, **Valor do instrumento**, **Base de cálculo**, **Total**, **UF**, **Cidade**, **ITBI**, **Total ITBI**, **Reg. imóveis**, **Item**, **Descrição**] (1 linha(s))
      - Tabela 2: [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] (0 linha(s))
      - Tabela 3: [**Serviço**, **Quantidade**, **Valor un.**, **Valor total**] (1 linha(s))
  - **Ações de Grade:**
    - Ações catalogadas (2): `Sair` (sem tooltip), `glyphicons glyphicons-plus` (sem tooltip)

### [021] Notas > Consultas > Protocolos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/protocolo` | **Título:** Protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/021-notas-consultas-protocolos.png)
- **Cabeçalhos:** **Protocolo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (6):**
  - **Mais filtros** — tooltip: "Mais filtros"
  - **Filtrar** — tooltip: "Selecione um escrevente e preencha ao menos um dos filtros obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Imprimir** — tooltip: "Realize uma busca com resultados antes de prosseguir com a impressão" | desabilitado
  - **Adicionar** — tooltip: "Cadastro de protocolo" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (9):**
  - **Protocolo** (tipo: `text` | obrigatório)
  - **Período de recepção** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de recepção** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Escrevente assinante (Substituto):** (tipo: `select` | opcional | opções (8): [< Selecione >, Henrique, jorge, Marcus, rafael (+3 opções)])
  - **Auxiliar do escrevente** (tipo: `select` | opcional | opções (6): [< Selecione >, Auxiliar Rio Claro Teste, Elaine, Henrique Senha, hugo (+1 opções)])
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Nº Recibo**, **Livro**, **Folha inicial**, **Folha final**, **Escrevente**, **Espécie**, **Natureza**, **Nome**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 2
- **Árvore Nível 2 (Sub-estados):**
  - **Accordions & Filtros Avançados (1):**
    - **Mais filtros** (status: `captured` | abertura: `accordion` | [Print](../auditoria/mapeamento-telas/nivel-2/notas/021-notas-consultas-protocolos__filter-mais-filtros.png))
      - Botões (5): **1 dia**, **7 dias**, **15 dias**, **30 dias**, **Menos filtros**
      - Campos (20): **Status** (`select`), **N° Recibo** (`text`), **Período de recibo** (`text`), **Período de primeira lavratura** (`text`), **Nome** (`text`), **Parte** (`checkbox`), **Solicitante** (`checkbox`), **Fonética** (`checkbox`), **Começa com** (`radio`), **Contém** (`radio`), **CPF ou CIN/CNPJ** (`text`), **Tipo da participação** (`select`), **Situação** (`select`), **Livro** (`text`), **Folha** (`text`), **Apenas atos retificados** (`checkbox`), **Cód.** (`text`), **Intermediador** (`text`), **Assinatura pendente** (`checkbox`), **Encaminha para R.I.** (`checkbox`)
      - Tabela 1: [**Protocolo**, **Nº Recibo**, **Livro**, **Folha inicial**, **Folha final**, **Escrevente**, **Espécie**, **Natureza**, **Nome**, **Status**] (0 linha(s))
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/notas/021-notas-consultas-protocolos__open-adicionar.png))
      - Accordions na aba: **Duplicar protocolo**, **Preencher protocolo com I.A.**, **Orçamento rápido**
      - Botões (9): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, `glyphicons glyphicons-search`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`
      - Campos (36): **Data recepção** (`text`), **inputStatusProtocolo** (`text`), **Situação** (`select`), **inputNumeroRecibo** (`text`), **Data recibo** (`text`), **__/__/____** (`text`), **Escrevente** (`select`), **Espécie** (`select`), **Natureza** (`select`), **__/__/____** (`text`), **Escrevente assinante (Substituto):** (`select`), **Auxiliar do escrevente:** (`select`), **Escrevente que colheu as assinaturas** (`select`), **Pessoa física** (`radio`), **Pessoa jurídica** (`radio`), **Mensalista** (`radio`), **Escrevente** (`radio`), **CPF ou CIN** (`text`), **Nome** (`text`), **Tomador** (`checkbox`) (+16)

### [022] Notas > Consultas > Movimentação financeira por protocolo

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/movimentacaoFinanceira` | **Título:** Movimentação financeira por protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/022-notas-consultas-movimentacao-financeira-por-protocolo.png)
- **Cabeçalhos:** **Movimentação financeira por protocolo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Selecione um escrevente e preencha ao menos um dos filtros obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpa os filtros preenchidos e refaz a busca inicial"
  - **Imprimir** — tooltip: "Realize uma busca com resultados antes de prosseguir com a impressão" | desabilitado
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (24):**
  - **Protocolo** (tipo: `text` | obrigatório)
  - **N° Recibo** (tipo: `text` | obrigatório)
  - **Período de recepção** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Status** (tipo: `select` | obrigatório | opções (10): [< Selecione >, Em andamento, Liberado para conferência, Liberado para impressão, Lavrado (+5 opções)])
  - **Saldo do ato** (tipo: `select` | opcional | opções (4): [< Selecione >, Positivo, Negativo, Zero])
  - **Tipo de lançamento** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Crédito, Débito])
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Nome** (tipo: `text` | obrigatório)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | obrigatório)
  - **Contém** (tipo: `radio` | obrigatório)
  - **CPF ou CIN/CNPJ** (tipo: `text` | obrigatório)
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **Natureza** (tipo: `select` | opcional | desabilitado | opções (1): [< Selecione >])
  - **Período de recibo** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Pago** (tipo: `checkbox` | opcional)
  - **Período de primeira lavratura** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Cód.** (tipo: `text` | obrigatório)
  - **Intermediador** (tipo: `text` | obrigatório)
  - **Apenas atos retificados** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Recibo**, **Recepção**, **Lavratura**, **Status**, **Escrevente**, **Natureza**, **Total de itens selecionados**, **Saldo**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [023] Notas > Consultas > Certidões e serviços

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/certidoesServicos` | **Título:** Certidões e serviços
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/023-notas-consultas-certidoes-e-servicos.png)
- **Cabeçalhos:** **Certidões e serviços**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (9):**
  - **1 dia**
  - **7 dias**
  - **15 dias**
  - **30 dias**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Imprimir** — tooltip: "Faça uma consulta que retorne resultados." | desabilitado
  - **Adicionar** — tooltip: "Cadastro de pedido de certidão" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (21):**
  - **Pedido** (tipo: `text` | obrigatório)
  - **N° Recibo** (tipo: `text` | obrigatório)
  - **Data pedido** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês do pedido** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Data previsão** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Certidões e serviços** (tipo: `select` | obrigatório | opções (7): [< Selecione >, APOSTILAMENTO DE HAIA, CARTA DE SENTENÇA, CERTIDÃO, CERTIDÃO AUTOCURATELA (+2 opções)])
  - **Data recibo** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Nome** (tipo: `text` | opcional)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | obrigatório)
  - **Contém** (tipo: `radio` | obrigatório)
  - **CPF ou CIN/CNPJ** (tipo: `text` | obrigatório)
  - **Livro** (tipo: `text` | obrigatório)
  - **Folha** (tipo: `text` | obrigatório)
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Auxiliar do escrevente** (tipo: `select` | opcional | opções (1): [< Selecione >])
  - **Status** (tipo: `select` | obrigatório | opções (7): [< Selecione >, Em andamento, Lavrado, Recibo estornado, Inutilizado (+2 opções)])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data pedido**, **Previsão**, **Recibo**, **Pedido**, **Tipo de certidão**, **Escrevente**, **Nome**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/notas/023-notas-consultas-certidoes-e-servicos__open-adicionar.png))
      - Botões (10): `glyphicons glyphicons-search`, `glyphicons glyphicons-search`, `glyphicons glyphicons-plus`, `glyphicons glyphicons-search`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`, `halflings halflings-plus`, `glyphicons glyphicons-plus`
      - Campos (44): **inputNumeroPedido** (`text`), **__/__/____** (`text`), **inputNumeroRecibo** (`text`), **Data recibo** (`text`), **Previsão de entrega** (`text`), **inputStatusProtocolo** (`text`), **Situação** (`select`), **Escrevente** (`select`), **Certidões e serviços** (`select`), **Escrevente assinante (Substituto):** (`select`), **Auxiliar do escrevente:** (`select`), **Escrevente que colheu as assinaturas** (`select`), **Pessoa física** (`radio`), **Pessoa jurídica** (`radio`), **Mensalista** (`radio`), **Escrevente** (`radio`), **CPF ou CIN** (`text`), **Nome** (`text`), **Tomador** (`checkbox`), **Informar intermediador** (`checkbox`) (+24)
      - Tabela 1: [**Item**, **Descrição**, **Qtd. Cálculo**, **Cálculo**, **Total**] (1 linha(s))
      - Tabela 2: [**Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] (0 linha(s))
      - Tabela 3: [**Descrição**, **Qtde**, **Valor un.**, **Valor total**] (1 linha(s))
  - **Ações de Grade:**
    - Ações catalogadas (1): `glyphicons glyphicons-plus` (sem tooltip)

### [024] Notas > Consultas > Editor

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/protocolo/consultaTexto` | **Título:** Protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/notas/024-notas-consultas-editor.png)
- **Cabeçalhos:** **Protocolo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Selecione um escrevente e preencha ao menos um dos filtros obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (8):**
  - **Protocolo** (tipo: `text` | obrigatório)
  - **Data de recepção** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de recepção** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Escrevente** (tipo: `select` | obrigatório | opções (26): [< Selecione >, Camille Ferraz - Inativo, comissão - Inativo, Digital_Persona - Inativo, editor - Inativo (+21 opções)])
  - **Especialidade do modelo** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Editor - Protocolo, Editor - Consulta CNIB])
  - **Status de impressão** (tipo: `select` | obrigatório | opções (4): [< Selecione >, Impresso, Editando, Em validação])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Escrevente**, **Especialidade**, **Status de impressão**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

## Módulo: Relatórios (12 tela(s))

### [025] Relatórios > Fechamento de caixa

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatórios de caixa
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/025-relatorios-fechamento-de-caixa.png)
- **Cabeçalhos:** **Relatórios de caixa**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Preencha os campos obrigatórios." | desabilitado
  - **Fechar**
- **Campos / Filtros (16):**
  - **Setor** (tipo: `select` | opcional | opções (3): [Firmas, Notas, Todos])
  - **Analítico** (tipo: `radio` | opcional)
  - **Sintético** (tipo: `radio` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Total por recibo/caixa** (tipo: `checkbox` | opcional)
  - **Total por serviço/caixa** (tipo: `checkbox` | opcional)
  - **Total pagamento por caixa** (tipo: `checkbox` | opcional)
  - **Total geral serviços** (tipo: `checkbox` | opcional)
  - **Total geral por caixa** (tipo: `checkbox` | opcional)
  - **Total por tipo de pagamento** (tipo: `checkbox` | opcional)
  - **Total por fatura mensalista** (tipo: `checkbox` | opcional)
  - **Caixa** (tipo: `select` | opcional | opções (18): [Todos, Carlos Neves, Erik Marques, Henrique, Henrique Senha (+13 opções)])
  - **Forma de pagamento** (tipo: `select` | opcional | opções (30): [Todos, Dinheiro, link parcela, Transferência, Deposito (+25 opções)])
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [026] Relatórios > PEX - TJ/SP

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** PEX – TJ/SP
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/026-relatorios-pex-tj-sp.png)
- **Cabeçalhos:** **PEX – TJ/SP**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (9):**
  - **Tipo de relatório** (tipo: `radio` | opcional)
  - **Por atos** (tipo: `radio` | opcional)
  - **Justiça aberta** (tipo: `radio` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Incluir outras especialidades** (tipo: `checkbox` | opcional)
  - **Recolhimento definitivo** (tipo: `checkbox` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [027] Relatórios > PEX Selos - TJ/SP

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** PEX Produtos – TJ/SP
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/027-relatorios-pex-selos-tj-sp.png)
- **Cabeçalhos:** **PEX Produtos – TJ/SP**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (8):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
  - **Total consumidos** (tipo: `checkbox` | opcional)
  - **Total inutilizados** (tipo: `checkbox` | opcional)
  - **Total aquisição** (tipo: `checkbox` | opcional)
  - **Total em estoque** (tipo: `checkbox` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [028] Relatórios > Recolhimento diário

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatório - Recolhimento diário
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/028-relatorios-recolhimento-diario.png)
- **Cabeçalhos:** **Relatório - Recolhimento diário**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (10):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Setor** (tipo: `select` | opcional | opções (3): [Todos, Firmas, Notas])
  - **Ordenar por** (tipo: `radio` | opcional)
  - **Protocolo** (tipo: `radio` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
  - **Agrupar setor notas** (tipo: `checkbox` | opcional)
  - **Incluir outras especialidades** (tipo: `checkbox` | opcional)
  - **Filtrar somente serviços mapeados para o LCW** (tipo: `checkbox` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [029] Relatórios > Atos Incompletos

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatório - Atos Incompletos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/029-relatorios-atos-incompletos.png)
- **Cabeçalhos:** **Relatório - Atos Incompletos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Fechar**
- **Campos / Filtros (7):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Gerar de todo período** (tipo: `checkbox` | opcional)
  - **Ordenar por** (tipo: `radio` | opcional)
  - **Protocolo** (tipo: `radio` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [030] Relatórios > Demonstrativo financeiro dos selos digitais

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Demonstrativo financeiro dos selos digitais
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/030-relatorios-demonstrativo-financeiro-dos-selos-digitais.png)
- **Cabeçalhos:** **Demonstrativo financeiro dos selos digitais**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Fechar**
- **Campos / Filtros (2):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [031] Relatórios > Recolhimento resumido

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Recolhimento resumido
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/031-relatorios-recolhimento-resumido.png)
- **Cabeçalhos:** **Recolhimento resumido**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (12):**
  - **Tipo** (tipo: `radio` | opcional)
  - **Diário** (tipo: `radio` | opcional)
  - **Modo de impressão** (tipo: `radio` | opcional)
  - **Paisagem** (tipo: `radio` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Todos** (tipo: `radio` | opcional)
  - **Personalizado** (tipo: `radio` | opcional)
  - **Sem emolumentos** (tipo: `checkbox` | opcional)
  - **Incluir as custas de outras especialidades** (tipo: `checkbox` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [032] Relatórios > Índice por livro

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatório - Índice por livros
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/032-relatorios-indice-por-livro.png)
- **Cabeçalhos:** **Relatório - Índice por livros**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (9):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Livro** (tipo: `text` | obrigatório)
  - **inputNumeroLivroFinal** (tipo: `text` | opcional)
  - **Nome** (tipo: `radio` | opcional)
  - **Natureza** (tipo: `radio` | opcional)
  - **Livro e folha** (tipo: `radio` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [033] Relatórios > Transferência de imóveis

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatório - Transferência de Imóveis
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/033-relatorios-transferencia-de-imoveis.png)
- **Cabeçalhos:** **Relatório - Transferência de Imóveis**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (9):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Estado** (tipo: `select` | opcional | opções (29): [Acre, Alagoas, Amapá, Amazonas, Bahia (+24 opções)])
  - **Município** (tipo: `select` | opcional | opções (30): [Todos, Acrelândia, Assis Brasil, Brasiléia, Bujari (+25 opções)])
  - **Relatório completo** (tipo: `radio` | opcional)
  - **Relatório básico** (tipo: `radio` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
  - **Somente atos com ITBI isento** (tipo: `checkbox` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [034] Relatórios > Auditoria Selos TJ - Orion

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Auditoria Selos TJ – Orion
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/034-relatorios-auditoria-selos-tj-orion.png)
- **Cabeçalhos:** **Auditoria Selos TJ – Orion**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Fechar**
- **Campos / Filtros (4):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [035] Relatórios > Livro Protocolo

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Livro Protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/035-relatorios-livro-protocolo.png)
- **Cabeçalhos:** **Livro Protocolo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — desabilitado
  - **Fechar**
- **Campos / Filtros (5):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Livro atual** (tipo: `number` | obrigatório)
  - **Página atual** (tipo: `number` | obrigatório)
  - **Rascunho (não exibe livro e página)** (tipo: `checkbox` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [036] Relatórios > Relatório ISS

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** Relatório ISS
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/relatorios/036-relatorios-relatorio-iss.png)
- **Cabeçalhos:** **Relatório ISS**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Imprimir** — tooltip: "Preencha o período inicial e final." | desabilitado
  - **Fechar**
- **Campos / Filtros (4):**
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **PDF** (tipo: `radio` | opcional)
  - **Excel** (tipo: `radio` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

## Módulo: Administração (33 tela(s))

### [037] Administração > Comissões > Consulta

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/comissaoEscrevente` | **Título:** Comissão
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/037-administracao-comissoes-consulta.png)
- **Cabeçalhos:** **Comissão**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - **1 dia**
  - **7 dias**
  - **15 dias**
  - **30 dias**
  - **Filtrar** — tooltip: "Filtrar"
  - **Imprimir** — tooltip: "Imprimir listagem" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
- **Campos / Filtros (10):**
  - **Escrevente** (tipo: `select` | opcional | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
  - **Tipo de plano** (tipo: `select` | opcional | opções (3): [Todos, Comum, Mensalista])
  - **Período personalizado** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | opcional | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Descrição** (tipo: `text` | opcional)
  - **Tipo lançamento** (tipo: `select` | opcional | opções (3): [< Selecione >, Débito, Crédito])
  - **Saldo ato** (tipo: `select` | opcional | opções (3): [Todos, Positivo, Negativo])
  - **Não incluir valores zerados** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Escrevente**, **Plano**, **A pagar**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Ações de Grade:**
    - **Filtrar** (status: `captured` | abertura: `grid_reveal` | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/037-administracao-comissoes-consulta__grid-reveal.png))
      - Botões (7): **1 dia**, **7 dias**, **15 dias**, **30 dias**, **Filtrar**, **Imprimir**, **Limpar**
      - Campos (10): **Escrevente** (`select`), **Tipo de plano** (`select`), **Período personalizado** (`text`), **__/__/____** (`text`), **Mês de referência** (`select`), **Descrição** (`text`), **Tipo lançamento** (`select`), **Saldo ato** (`select`), **Não incluir valores zerados** (`checkbox`), **totalPorPagina** (`select`)
      - Tabela 1: [**Escrevente**, **Plano**, **A pagar**] (0 linha(s))
      - Grade revelada: 0 linha(s) | Ícones de ação: nenhum

### [038] Administração > Comissões > Consulta indicação de mensalistas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/bonificacao` | **Título:** Bonificação
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/038-administracao-comissoes-consulta-indicacao-de-mensalistas.png)
- **Cabeçalhos:** **Bonificação**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - **1 dia**
  - **7 dias**
  - **15 dias**
  - **30 dias**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Imprimir** — desabilitado
  - **Limpar**
- **Campos / Filtros (6):**
  - **Escrevente:** (tipo: `select` | obrigatório | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
  - **Período personalizado** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Descrição do plano** (tipo: `text` | obrigatório)
  - **Não incluir valores zerados** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Escrevente**, **Plano**, **A pagar**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [039] Administração > Comissões > Planos de comissão

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/plano` | **Título:** Planos de comissões
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/039-administracao-comissoes-planos-de-comissao.png)
- **Cabeçalhos:** **Planos de comissões**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar**
  - **Filtrar**
  - **Adicionar** — mutação
  - **Voltar**
- **Campos / Filtros (2):**
  - **Pesquisar por planos** (tipo: `text` | opcional)
  - **Vigência:** (tipo: `select` | opcional | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Plano**, **Tabela vigente**] — Estado: 8 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/039-administracao-comissoes-planos-de-comissao__open-adicionar.png))
      - Botões (4): **Limpar**, **Aplicar nos itens selecionados**, **Concluir**, **Voltar**
      - Campos (30): **Descrição** (`text`), **Pesquisar por natureza** (`text`), **totalPorPagina** (`select`), **inputValorCalculoPlano** (`text`), **inpuCheckBoxSelecionarTodosServicos** (`checkbox`), **inputCheckBoxSelecionarServico0** (`checkbox`), **inputCheckBoxSelecionarServico1** (`checkbox`), **inputCheckBoxSelecionarServico2** (`checkbox`), **inputCheckBoxSelecionarServico3** (`checkbox`), **inputCheckBoxSelecionarServico4** (`checkbox`), **inputCheckBoxSelecionarServico5** (`checkbox`), **inputCheckBoxSelecionarServico6** (`checkbox`), **inputCheckBoxSelecionarServico7** (`checkbox`), **inputCheckBoxSelecionarServico8** (`checkbox`), **inputCheckBoxSelecionarServico9** (`checkbox`), **Percentual** (`radio`), **Valor fixo** (`radio`), **Vigência:** (`select`), **Forma de cálculo** (`checkbox`), **Forma de cálculo** (`checkbox`) (+10)
      - Tabela 1: [**Itens**] (10 linha(s))
      - Tabela 2: [**Pertencem ao plano Nomes**] (0 linha(s))
      - Tabela 3: [**Não pertencem ao plano Nomes**] (10 linha(s))

### [040] Administração > Comissões > Plano diferenciado Mensalistas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/plano/mensalista` | **Título:** Planos de comissões diferenciados para mensalistas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/040-administracao-comissoes-plano-diferenciado-mensalistas.png)
- **Cabeçalhos:** **Planos de comissões diferenciados para mensalistas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar**
  - **Filtrar**
  - **Adicionar** — mutação
  - **Voltar**
- **Campos / Filtros (3):**
  - **Pesquisar por planos** (tipo: `text` | opcional)
  - **Vigência:** (tipo: `select` | opcional | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **Plano referência:** (tipo: `select` | opcional | opções (9): [< Selecione >, Comissão de 25%, Comissão no mensalista, Comissão Teste Presidente Prudente, Plano comissão 50% - FIRMAS (+4 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Plano**, **Tabela vigente**] — Estado: 3 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/040-administracao-comissoes-plano-diferenciado-mensalistas__open-adicionar.png))
      - Botões (4): **Limpar**, **Aplicar nos itens selecionados**, **Concluir**, **Voltar**
      - Campos (13): **Vigência:** (`select`), **Plano de comissão de referência** (`select`), **Descrição** (`text`), **Pesquisar por natureza** (`text`), **totalPorPagina** (`select`), **inputValorCalculoPlano** (`text`), **inpuCheckBoxSelecionarTodosServicos** (`checkbox`), **Percentual** (`radio`), **Valor fixo** (`radio`), **Como aplicar o cálculo** (`select`), **Forma de cálculo** (`checkbox`), **Forma de cálculo** (`checkbox`), **Buscar por Mensalistas** (`text`)
      - Tabela 1: [**Itens**] (0 linha(s))
      - Tabela 2: [**Pertencem ao plano Nomes**] (0 linha(s))
      - Tabela 3: [**Não pertencem ao plano Nomes**] (0 linha(s))
      - Tabela 4: [**Código**, **Nome**, **Documento**] (0 linha(s))

### [041] Administração > Comissões > Planos indicação de mensalista

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/bonus` | **Título:** Bônus por indicação
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/041-administracao-comissoes-planos-indicacao-de-mensalista.png)
- **Cabeçalhos:** **Bônus por indicação**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar"
  - **Limpar**
  - **Adicionar** — tooltip: "Adicionar bonus" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por planos** (tipo: `text` | opcional)
  - **Vigência:** (tipo: `select` | opcional | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **Escrevente:** (tipo: `select` | opcional | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Plano**, **Tabela vigente**] — Estado: 5 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/041-administracao-comissoes-planos-indicacao-de-mensalista__open-adicionar.png))
      - Botões (4): **Limpar**, **Aplicar nos itens selecionados**, **Concluir**, **Voltar**
      - Campos (42): **Descrição** (`text`), **Escrevente** (`select`), **Pesquisar por natureza** (`text`), **totalPorPagina** (`select`), **inputValorCalculoPlano** (`text`), **inpuCheckBoxSelecionarTodosServicos** (`checkbox`), **inputCheckBoxSelecionarServico0** (`checkbox`), **inputValorCalculo0** (`text`), **inputCheckBoxSelecionarServico1** (`checkbox`), **inputValorCalculo1** (`text`), **inputCheckBoxSelecionarServico2** (`checkbox`), **inputValorCalculo2** (`text`), **inputCheckBoxSelecionarServico3** (`checkbox`), **inputValorCalculo3** (`text`), **inputCheckBoxSelecionarServico4** (`checkbox`), **inputValorCalculo4** (`text`), **inputCheckBoxSelecionarServico5** (`checkbox`), **inputValorCalculo5** (`text`), **inputCheckBoxSelecionarServico6** (`checkbox`), **inputValorCalculo6** (`text`) (+22)
      - Tabela 1: [**Itens**, **%**] (10 linha(s))
      - Tabela 2: [**Mensalistas vinculados ao usuário**] (0 linha(s))
      - Tabela 3: [**Mensalista sem vínculos**] (10 linha(s))

### [042] Administração > Comunicações > COAF

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/comunicacaoCoaf` | **Título:** COAF - Comunicação
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/042-administracao-comunicacoes-coaf.png)
- **Cabeçalhos:** **COAF - Comunicação**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Período de pesquisa inválido" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Imprimir listagem"
  - **Comunicar** — tooltip: "Não há protocolos para comunicar" | desabilitado
- **Campos / Filtros (6):**
  - **Tipo de comunicação** (tipo: `select` | opcional | opções (2): [Envio, Recibo])
  - **Situação do protocolo** (tipo: `select` | opcional | opções (5): [Todos, Não comunicado, Comunicado, Cancelado, Possui enquadramento])
  - **Protocolo** (tipo: `text` | opcional)
  - **Período do ato** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Natureza**, **Data de lavratura**, **Data comunicação**, **Data cancelamento**, **Nº Ocorrência**, **Indicado**, **Situação**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [043] Administração > Comunicações > Outras comunicações

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/comunicacoes` | **Título:** Comunicações
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/043-administracao-comunicacoes-outras-comunicacoes.png)
- **Cabeçalhos:** **Comunicações**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Imprimir** — tooltip: "Realize uma busca com resultados para imprimir" | desabilitado
  - **Gerar** — tooltip: "Gerar arquivo de comunicação" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (8):**
  - **Tipo** (tipo: `select` | obrigatório | opções (13): [< Selecione >, SEFAZ - Veículos, E-Notariado, CESDI, RCTO (+8 opções)])
  - **__/__/____** (tipo: `text` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | obrigatório | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Status** (tipo: `select` | opcional | opções (4): [< Selecione >, Estornado, Processado, Falha])
  - **Lote** (tipo: `number` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [044] Administração > Comunicações > Auditoria de Selos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/auditoriaSelos` | **Título:** Auditoria de Selos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/044-administracao-comunicacoes-auditoria-de-selos.png)
- **Cabeçalhos:** **Auditoria de Selos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Exportar excel** — desabilitado
  - **Auditar** — tooltip: "Auditar"
- **Campos / Filtros (6):**
  - **Status** (tipo: `select` | opcional | opções (8): [< Selecione >, Em conformidade, Divergente, Retificado, Cancelado (+3 opções)])
  - **Data do ato** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Data da auditoria** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Selo digital** (tipo: `text` | obrigatório)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Selo Digital**, **Data do Ato**, **Auditado em**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [045] Administração > Comunicações > Selo digital

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/seloDigital` | **Título:** Selo digital TJ-SP
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/045-administracao-comunicacoes-selo-digital.png)
- **Cabeçalhos:** **Selo digital TJ-SP**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Filtrar"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Comunicar** — tooltip: "Nenhum selo encontrado" | desabilitado
  - **Totalizadores** — desabilitado
  - **Auditoria**
- **Campos / Filtros (11):**
  - **Status** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Comunicado, Retificado, Cancelado, Comunicação pendente (+3 opções)])
  - **Data do ato** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Produto** (tipo: `select` | opcional | opções (7): [< Selecione >, Autenticação, Reconhecimento com valor 1, Reconhecimento com valor 2, Reconhecimento por autenticidade (+2 opções)])
  - **Série** (tipo: `text` | opcional)
  - **Sequência** (tipo: `text` | opcional)
  - **Selo digital** (tipo: `text` | opcional)
  - **Período de geração** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Serviço** (tipo: `select` | opcional | opções (30): [< Selecione >, (AEV) Reconhecimento por autenticidade digital, AEDO, Apostilamento de Haia, Atas notariais, sem reflexo econômico pela primeira folha (+25 opções)])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Produto**, **Série**, **Sequência**, **Selo digital**, **Geração**, **Comunicação**, **Serviço**, **Status**, **Erro**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Ações de Grade:**
    - **Filtrar** (status: `captured` | abertura: `grid_reveal` | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/045-administracao-comunicacoes-selo-digital__grid-reveal.png))
      - Botões (5): **Filtrar**, **Limpar**, **Comunicar**, **Totalizadores**, **Auditoria**
      - Campos (10): **Status** (`select`), **Data do ato** (`text`), **__/__/____** (`text`), **Produto** (`select`), **Série** (`text`), **Sequência** (`text`), **Selo digital** (`text`), **Período de geração** (`text`), **__/__/____** (`text`), **Serviço** (`select`)
      - Tabela 1: [**Produto**, **Série**, **Sequência**, **Selo digital**, **Geração**, **Comunicação**, **Serviço**, **Status**, **Erro**] (0 linha(s))
      - Grade revelada: 0 linha(s) | Ícones de ação: nenhum

### [046] Administração > Comunicações > RPS

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/comunicacaoRps` | **Título:** RPS - comunicações processadas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/046-administracao-comunicacoes-rps.png)
- **Cabeçalhos:** **RPS - comunicações processadas**, **Valor total: R$ 0,00**
- **Abas:** Nenhuma
- **Accordions (1):** **Exportar relatório** (expandido)
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos corretamente" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Exportar relatório** — desabilitado
  - **Comunicar** — tooltip: "Comunicar"
- **Campos / Filtros (11):**
  - **Setor** (tipo: `select` | opcional | opções (2): [Firmas, Notas])
  - **Pedido** (tipo: `text` | opcional)
  - **RPS** (tipo: `text` | opcional)
  - **NFE** (tipo: `text` | opcional)
  - **Data pedido** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Período comunicação** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Status** (tipo: `select` | opcional | opções (6): [Comunicado, Falha, Retificado, Aguardando retificação, Falha na retificação (+1 opções)])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Setor**, **Numero RPS**, **NFE**, **Código**, **Pedido**, **Data pedido**, **Escrevente**, **Responsável**, **Total**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [047] Administração > Comunicações > Recolhimento

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/recolhimentoDefinitivo` | **Título:** Recolhimento
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/047-administracao-comunicacoes-recolhimento.png)
- **Cabeçalhos:** **Recolhimento**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
- **Campos / Filtros (3):**
  - **Período recolhimento** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Estorno** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data do recolhimento**, **Responsavel pelo recolhimento**, **Status**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [048] Administração > Comunicações > Auditoria de RPS

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/auditoriaRPS` | **Título:** Auditoria de RPS
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/048-administracao-comunicacoes-auditoria-de-rps.png)
- **Cabeçalhos:** **Auditoria de RPS**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Exportar excel** — desabilitado
  - **Auditar** — tooltip: "Auditar"
- **Campos / Filtros (9):**
  - **Status** (tipo: `select` | opcional | opções (4): [< Selecione >, Divergente, Em conformidade, Não encontrado])
  - **Data do ato** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Auditado em** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Número RPS** (tipo: `text` | opcional)
  - **Tipo de Serviços** (tipo: `select` | opcional | opções (4): [< Selecione >, Notas, Firmas, Fotocopia])
  - **Mensalista** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Número RPS**, **Data do ato**, **Comunicado em**, **Auditado em**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [049] Administração > Envio de escrituras para Registro

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/escritura` | **Título:** Envio de Escrituras para Registro
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/049-administracao-envio-de-escrituras-para-registro.png)
- **Cabeçalhos:** **Envio de Escrituras para Registro**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (6):**
  - **Filtrar** — tooltip: "Preencha ao menos um campo obrigatório para liberar o botão" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Imprimir** — tooltip: "Sem resultados para imprimir." | desabilitado
  - **Salvar** — tooltip: "Nenhum registro selecionado" | desabilitado | mutação
  - **Comunicar** — tooltip: "Nenhum registro selecionado" | desabilitado
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (22):**
  - **Data recibo** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Data envio** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Previsão de retorno** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Status registro** (tipo: `select` | obrigatório | opções (6): [< Selecione >, Não encaminhado, Encaminhado, Devolvido - Exigência, Registrado (+1 opções)])
  - **Tipo de envio** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Físico, e-Protocolo])
  - **Protocolo notas** (tipo: `text` | obrigatório)
  - **Recibo.** (tipo: `text` | obrigatório)
  - **Escrevente** (tipo: `select` | obrigatório | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
  - **Nome** (tipo: `text` | opcional)
  - **Pessoa física** (tipo: `radio` | obrigatório)
  - **Pessoa jurídica** (tipo: `radio` | obrigatório)
  - **Fonética** (tipo: `checkbox` | opcional)
  - **Começa com** (tipo: `radio` | obrigatório)
  - **Contém** (tipo: `radio` | obrigatório)
  - **Tipo de doc.** (tipo: `select` | obrigatório | opções (3): [< Selecione >, CPF ou CIN, CNPJ])
  - **Protocolo no R.I.** (tipo: `text` | obrigatório)
  - **Cartório de registro** (tipo: `text` | obrigatório)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **inpuCheckBoxSelecionarTodosRegistrosEscritura** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Protocolo**, **Tipo de envio**, **Data de envio**, **Cartório de R.I**, **Protocolo no R.I**, **Previsão de retorno**, **Valor do registro**, **Status R.I**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [050] Administração > Controle de Estoque > Aquisição

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/aquisicao` | **Título:** Aquisições de Produto
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/050-administracao-controle-de-estoque-aquisicao.png)
- **Cabeçalhos:** **Aquisições de Produto**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar aquisição" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **__/__/____** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Responsável** (tipo: `select` | opcional | opções (18): [Todos, orion, Henrique, Erik Marques, rafael (+13 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data de aquisição**, **Comprador**, **Responsável**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/050-administracao-controle-de-estoque-aquisicao__open-adicionar.png))
      - Botões (6): **Preencher aquisicão usando I.A.**, `halflings halflings-remove`, `halflings halflings-plus`, `halflings halflings-plus`, **Concluir**, **Voltar**
      - Campos (14): **descricaoFornecedor** (`text`), **Nota Fiscal** (`text`), **__/__/____** (`text`), **Comprador** (`text`), **Responsável** (`select`), **Categoria** (`select`), **Produto** (`select`), **Un** (`text`), **Série** (`text`), **Seq. inicial** (`text`), **Seq. Final** (`text`), **Qtd.** (`number`), **Valor unitário** (`text`), **Valor total** (`text`)

### [051] Administração > Controle de Estoque > Distribuição

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/distribuicao` | **Título:** Distribuição
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/051-administracao-controle-de-estoque-distribuicao.png)
- **Cabeçalhos:** **Distribuição**, **Aquisições disponíveis para o produto:**, **Total em estoque: 0**, **Total distribuído: 0**
- **Abas (2):** **Distribuição** (ativa), **Consulta**
- **Accordions:** Nenhum
- **Botões (5):**
  - _(somente ícone: `halflings halflings-minus`)_ — `icon_only` | tooltip: "Excluir" | mutação
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only` | tooltip: "Adicionar" | mutação
  - _(somente ícone: `glyphicons glyphicons-refresh`)_ — `icon_only` | tooltip: "Atualizar lista do portador dados maquina" | mutação
  - **Concluir** — tooltip: "Preencha os campos obrigatórios para concluir" | desabilitado | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (7):**
  - **Categoria** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Papel de segurança, Selos])
  - **Produto** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **Série** (tipo: `text` | obrigatório)
  - **Sequência inicial** (tipo: `number` | obrigatório)
  - **Sequência final** (tipo: `number` | obrigatório)
  - **Portador** (tipo: `select` | obrigatório | opções (1): [< Selecione >])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Série**, **Sequência inicial**, **Sequência final**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Abas (1):**
    - **Consulta** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/051-administracao-controle-de-estoque-distribuicao__tab-consulta.png) | altura: 915px)
      - Abas internas: **Distribuição**, **Consulta**
      - Botões (3): **Filtrar**, **Limpar**, **Imprimir**
      - Campos (9): **Categoria** (`select`), **Produto** (`select`), **Período de distribuição** (`text`), **__/__/____** (`text`), **Portador** (`select`), **Série** (`text`), **Somente disponíveis** (`checkbox`), **totalPorPagina** (`select`), **selecionarTodos** (`checkbox`)
      - Tabela 1: [**Produto**, **Portador**, **Distribuído por**, **Data**, **Série**, **Seq. Inicial**, **Seq. Final**, **Distribuído**, **Consumido**, **Inutilizado**, **Disponível**, **Último utilizado**] (0 linha(s))

### [052] Administração > Controle de Estoque > Consumo manual

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/consumoProdutoManual` | **Título:** Consumo manual
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/052-administracao-controle-de-estoque-consumo-manual.png)
- **Cabeçalhos:** **Consumo manual**, **Produtos disponíveis para consumo**, **Selecione o produto que será consumido**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - _(somente ícone: `halflings halflings-minus`)_ — `icon_only` | tooltip: "Excluir" | mutação
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only` | tooltip: "Adicionar" | mutação
  - **Concluir** — tooltip: "Preencha os campos necessários" | desabilitado | mutação
- **Campos / Filtros (8):**
  - **Produto** (tipo: `select` | obrigatório | opções (9): [< Selecione >, AEV, Apostilamento de Haia, Cartão, Certidão (+4 opções)])
  - **Portador** (tipo: `select` | opcional | desabilitado | opções (1): [< Selecione >])
  - **Quantidade** (tipo: `number` | obrigatório | desabilitado)
  - **__/__/____** (tipo: `text` | opcional)
  - **Série** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
  - **Seq. inicial** (tipo: `number` | obrigatório | desabilitado)
  - **Seq. final** (tipo: `number` | obrigatório | desabilitado)
  - **Status** (tipo: `select` | obrigatório | desabilitado | opções (1): [< Selecione >])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Produto**, **Série**, **Sequência inicial**, **Sequência final**, **Total disponível**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `new_tab` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/052-administracao-controle-de-estoque-consumo-manual__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/administracao/052-administracao-controle-de-estoque-consumo-manual__open-adicionar-full.png) | altura: 1010px)
      - Botões (4): `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-plus`, **Concluir**
      - Campos (16): **Produto** (`select`), **Portador** (`select`), **Quantidade** (`number`), **__/__/____** (`text`), **Série** (`select`), **Seq. inicial** (`number`), **Seq. final** (`number`), **Status** (`select`), **Produto** (`select`), **Portador** (`select`), **Quantidade** (`number`), **__/__/____** (`text`), **Série** (`select`), **Seq. inicial** (`number`), **Seq. final** (`number`), **Status** (`select`)
      - Tabela 1: [**Produto**, **Série**, **Sequência inicial**, **Sequência final**, **Total disponível**] (10 linha(s))

### [053] Administração > Controle de Estoque > Consultas

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/consultaEstoque` | **Título:** Estoque
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/053-administracao-controle-de-estoque-consultas.png)
- **Cabeçalhos:** **Estoque**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar**
  - **Imprimir** — desabilitado
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (15):**
  - **Resumida** (tipo: `radio` | opcional)
  - **Detalhada** (tipo: `radio` | opcional)
  - **Categoria** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Papel de segurança, Selos])
  - **Mês de referência** (tipo: `select` | opcional | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Status** (tipo: `select` | opcional | opções (6): [< Selecione >, Consumido, Distribuído, Em estoque, Inutilizado (+1 opções)])
  - **Série** (tipo: `text` | obrigatório)
  - **Seq. inicial** (tipo: `number` | opcional)
  - **Seq. final** (tipo: `number` | opcional)
  - **Período:** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Período de aquisição:** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Portador** (tipo: `select` | opcional | desabilitado | opções (1): [< Selecione >])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Produto**, **Unidade**, **Categoria**, **Data consumo**, **Data cancelamento**, **Série**, **Sequência**, **Seq. Inicial**, **Seq. Final**, **Quantidade**, **Portador**, **Status**, **Responsável**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [054] Administração > Controle de Estoque > Cadastros > Categoria

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/categoria` | **Título:** Categoria
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/054-administracao-controle-de-estoque-cadastros-categoria.png)
- **Cabeçalhos:** **Categoria**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar filtro"
  - **Filtrar** — tooltip: "Preencha o filtro obrigatório" | desabilitado
  - **Adicionar** — tooltip: "Adicionar categoria" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Descrição** (tipo: `text` | obrigatório)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descricao**, **Situação**] — Estado: 2 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/054-administracao-controle-de-estoque-cadastros-categoria__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (8): **Descrição** (`text`), **Responsável** (`select`), **Utiliza sequência inicial e sequência final** (`checkbox`), **Enviar alerta de estoque mínimo** (`checkbox`), **Informar quantidade de atos** (`checkbox`), **Utiliza série** (`checkbox`), **Informa consumo ao CNJ** (`checkbox`), **Digite e tecle enter** (`text`)

### [055] Administração > Controle de Estoque > Cadastros > Grupos de distribuição

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/grupoDistribuicao` | **Título:** Grupos de distribuição
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/055-administracao-controle-de-estoque-cadastros-grupos-de-distribuicao.png)
- **Cabeçalhos:** **Grupos de distribuição**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha o filtro obrigatório" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar grupo" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Pesquisar por descrição** (tipo: `text` | obrigatório)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 9 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/055-administracao-controle-de-estoque-cadastros-grupos-de-distribuicao__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/administracao/055-administracao-controle-de-estoque-cadastros-grupos-de-distribuicao__open-adicionar-full.png) | altura: 1194px)
      - Botões (2): **Concluir**, **Voltar**
      - Campos (18): **Descrição** (`text`), **Distribuição** (`select`), **inputCheckboxSelecionarTodosPertencem** (`checkbox`), **inputCheckboxSelecionarTodosNaoPertencem** (`checkbox`), **inputCheckMarcarNaoPertence1** (`checkbox`), **inputCheckMarcarNaoPertence2** (`checkbox`), **inputCheckMarcarNaoPertence3** (`checkbox`), **inputCheckMarcarNaoPertence4** (`checkbox`), **inputCheckMarcarNaoPertence5** (`checkbox`), **inputCheckMarcarNaoPertence6** (`checkbox`), **inputCheckMarcarNaoPertence7** (`checkbox`), **inputCheckMarcarNaoPertence8** (`checkbox`), **inputCheckMarcarNaoPertence10** (`checkbox`), **inputCheckMarcarNaoPertence11** (`checkbox`), **inputCheckMarcarNaoPertence12** (`checkbox`), **inputCheckMarcarNaoPertence13** (`checkbox`), **inputCheckMarcarNaoPertence14** (`checkbox`), **inputCheckMarcarNaoPertence16** (`checkbox`)
      - Tabela 1: [**Pertencem ao grupo Nomes**] (0 linha(s))
      - Tabela 2: [**Não pertencem ao grupo Nomes**] (14 linha(s))

### [056] Administração > Controle de Estoque > Cadastros > Produto

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/produto` | **Título:** Produtos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/056-administracao-controle-de-estoque-cadastros-produto.png)
- **Cabeçalhos:** **Produtos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Imprimir** — tooltip: "Imprimir"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Filtrar** — tooltip: "Filtrar"
  - **Adicionar** — tooltip: "Adicionar produto" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Categoria** (tipo: `select` | opcional | opções (3): [< Selecione >, Papel de segurança, Selos])
  - **Descrição produto** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Produto**, **Unidade**, **Categoria**, **Disponível**, **Distribuído**, **Estoque min.**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/056-administracao-controle-de-estoque-cadastros-produto__open-adicionar.png))
      - Botões (3): `glyphicons glyphicons-plus`, **Concluir**, **Voltar**
      - Campos (11): **Categoria** (`select`), **Descrição** (`text`), **Unidade** (`select`), **Responsável** (`text`), **Estoque mínimo** (`text`), **Distribuição** (`select`), **Quantidade de atos** (`select`), **Código de barras** (`select`), **Prefixo** (`text`), **Cod. Referencia** (`text`), **Observações** (`text`)

### [057] Administração > Controle de Estoque > Cadastros > Unidade de medida

- **Status:** `captured` | **Abertura:** `new_tab` | **Rota:** `#/unidadeMedida` | **Título:** Unidades de medida
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/057-administracao-controle-de-estoque-cadastros-unidade-de-medida.png)
- **Cabeçalhos:** **Unidades de medida**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha o filtro obrigatório" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar unidade de medida" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Pesquisar por descrição** (tipo: `text` | obrigatório)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **selecionarUnidadeMedida0** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: não | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/057-administracao-controle-de-estoque-cadastros-unidade-de-medida__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (1): **Descrição** (`text`)

### [058] Administração > Cadastro de Impedimentos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/impedimento` | **Título:** Impedimentos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/058-administracao-cadastro-de-impedimentos.png)
- **Cabeçalhos:** **Impedimentos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar impedimento" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Nome** (tipo: `text` | obrigatório)
  - **Documento** (tipo: `select` | opcional | opções (5): [< Selecione >, CPF ou CIN, RG, CNPJ, RNE])
  - **Número** (tipo: `text` | opcional | desabilitado)
  - **__/__/____** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data**, **Nome**, **Nº Documento**, **Motivo**, **Origem**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/058-administracao-cadastro-de-impedimentos__open-adicionar.png))
      - Botões (21): `halflings halflings-plus`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, **Formatação**, **Fonte**, **Tamanho**, `icon_only` (+6)
      - Campos (5): **Nome** (`text`), **Documento** (`select`), **Número** (`text`), **Motivo** (`text`), **selecionarAnexoimpedimento** (`file`)
      - Tabela 1: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [059] Administração > Importações de arquivos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/importacaoRecolhimetoExterno` | **Título:** Importação de arquivos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/059-administracao-importacoes-de-arquivos.png)
- **Cabeçalhos:** **Importação de arquivos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Novo arquivo** — tooltip: "Selecionar um arquivo" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Data do arquivo** (tipo: `text` | opcional)
  - **Período de processamento** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Especialidade** (tipo: `select` | obrigatório | opções (3): [Selecione, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Data**, **Especialidade**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Novo arquivo** (status: `captured` | abertura: `same_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/059-administracao-importacoes-de-arquivos__open-novo-arquivo.png))
      - Botões (4): **Filtrar**, **Limpar**, **Novo arquivo**, **Voltar**
      - Campos (5): **Data do arquivo** (`text`), **Período de processamento** (`text`), **__/__/____** (`text`), **Especialidade** (`select`), **totalPorPagina** (`select`)
      - Tabela 1: [**Descrição**, **Data**, **Especialidade**, **Status**] (0 linha(s))

### [060] Administração > Controle de Livros

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/livro` | **Título:** Controle de livros
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/060-administracao-controle-de-livros.png)
- **Cabeçalhos:** **Controle de livros**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar livro" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (9):**
  - **Número** (tipo: `number` | opcional)
  - **Período de abertura** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Período de encerramento** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Status** (tipo: `select` | opcional | opções (3): [< Selecione >, Aberto, Encerrado])
  - **Tipo livro** (tipo: `select` | opcional | opções (3): [< Selecione >, Atos notariais, Termo de comparecimento])
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Tipo**, **Sigla**, **Nº Livro**, **Página atual**, **Lado atual**, **Posiçao atual**, **Responsável**, **Status**, **Situação**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/060-administracao-controle-de-livros__open-adicionar.png))
      - Botões (3): **Concluir**, **Voltar**, **Imprimir**
      - Campos (12): **Tipo livro** (`select`), **Sigla** (`text`), **Utiliza frente e verso** (`checkbox`), **Total de folhas** (`text`), **Número do livro** (`text`), **Página inicial** (`text`), **Lado inicial** (`select`), **Posição inicial** (`text`), **N° termo** (`text`), **__/__/____** (`text`), **Responsável** (`select`), **Responsável pelo cadastro** (`text`)

### [061] Administração > Mensalistas > Faturamento

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/mensalistaFaturamento` | **Título:** Faturamento do mensalista
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/061-administracao-mensalistas-faturamento.png)
- **Cabeçalhos:** **Faturamento do mensalista**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - **1 dia**
  - **7 dias**
  - **15 dias**
  - **30 dias**
  - **Filtrar** — tooltip: "Selecione um mensalista e preencha ao menos um dos filtros obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Pesquisar por mensalista** (tipo: `text` | obrigatório)
  - **Período personalizado** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | opcional | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data**, **Pedido**, **Requisição**, **Solicitante**, **Tipo**, **Lançamento**, **Qtd.**, **Valor**, **Saldo**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [062] Administração > Mensalistas > Filiais

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/filiais` | **Título:** Filiais
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/062-administracao-mensalistas-filiais.png)
- **Cabeçalhos:** **Filiais**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar mensalistas"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar filial" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (19):**
  - **Código** (tipo: `number` | opcional)
  - **Mensalista** (tipo: `text` | opcional)
  - **Pesquisar por filial** (tipo: `text` | opcional)
  - **CPF, CNPJ ou CIN** (tipo: `text` | opcional)
  - **Status** (tipo: `select` | opcional | opções (4): [Todos, Ativo, Bloqueado, Inativo])
  - **Plano** (tipo: `select` | opcional | opções (3): [Todos, Pré-pago, Pós-pago])
  - **Rótulos** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista0** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista1** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista2** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista3** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista4** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista5** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista6** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista7** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista8** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista9** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Mensalista**, **Filial**, **Tipo**, **Documento**, **Plano**, **Rótulos**, **Status**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/062-administracao-mensalistas-filiais__open-adicionar.png))
      - Botões (5): **Selecionar**, **Capturar**, **Digitalizar **, **Concluir**, **Voltar**
      - Campos (22): **Mensalista** (`text`), **Razão social** (`text`), **CNPJ** (`text`), **Nome fantasia** (`text`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **UF** (`select`), **Cidade** (`text`), **Telefone** (`text`), **E-mail** (`text`), **Filial padrão** (`checkbox`), **Pós-pago** (`radio`), **Pré-pago** (`radio`), **Desconto (%)** (`text`), **Digite e tecle enter** (`text`), **Rótulos** (`text`), **Observações** (`textarea`) (+2)
      - Tabela 1: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [063] Administração > Mensalistas > Lançamentos manuais

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/mensalistaLancamentoManual` | **Título:** Lançamentos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/063-administracao-mensalistas-lancamentos-manuais.png)
- **Cabeçalhos:** **Lançamentos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar filtro"
  - _(somente ícone: `halflings halflings-plus`)_ — `icon_only` | tooltip: "Adicionar pagamento" | mutação
  - **Salvar** — tooltip: "Preencha os campos obrigatórios" | desabilitado | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (8):**
  - **Pesquisar por mensalista** (tipo: `text` | obrigatório)
  - **Tipo** (tipo: `select` | obrigatório | opções (3): [Crédito, Débito, Serviços])
  - **Requisição** (tipo: `text` | opcional)
  - **Responsável** (tipo: `text` | opcional | desabilitado)
  - **Data** (tipo: `text` | opcional)
  - **Hora** (tipo: `time` | obrigatório)
  - **Valor** (tipo: `text` | opcional)
  - **Descrição** (tipo: `text` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar pagamento** (status: `captured` | abertura: `same_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/063-administracao-mensalistas-lancamentos-manuais__open-adicionar-pagamento.png))
      - Botões (6): **Limpar**, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-plus`, **Salvar**, **Voltar**
      - Campos (10): **Pesquisar por mensalista** (`text`), **Tipo** (`select`), **Requisição** (`text`), **Responsável** (`text`), **Data** (`text`), **Hora** (`time`), **Valor** (`text`), **Descrição** (`text`), **Valor** (`text`), **Descrição** (`text`)

### [064] Administração > Mensalistas > Mensalistas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/mensalistas` | **Título:** Mensalistas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/064-administracao-mensalistas-mensalistas.png)
- **Cabeçalhos:** **Mensalistas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar mensalistas"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar mensalista" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (20):**
  - **Código** (tipo: `number` | opcional)
  - **Pesquisar por mensalista** (tipo: `text` | opcional)
  - **CPF, CNPJ ou CIN** (tipo: `text` | opcional)
  - **Tipo de pessoa** (tipo: `select` | opcional | opções (3): [Todos, Física, Jurídica])
  - **Usuário** (tipo: `select` | opcional | opções (30): [< Selecione >, Carlos Neves, Erik Marques, Henrique, Henrique Senha (+25 opções)])
  - **Plano** (tipo: `select` | opcional | opções (3): [Todos, Pré-pago, Pós-pago])
  - **Rótulos** (tipo: `text` | opcional)
  - **Bloqueado** (tipo: `select` | opcional | opções (4): [Todos, Ativo, Bloqueado, Inativo])
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista0** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista1** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista2** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista3** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista4** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista5** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista6** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista7** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista8** (tipo: `checkbox` | opcional)
  - **selecionarCheckMensalista9** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Mensalista**, **Tipo**, **Documento**, **Plano**, **Rótulos**, **Status**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/064-administracao-mensalistas-mensalistas__open-adicionar.png))
      - Botões (7): `glyphicons glyphicons-plus`, `halflings halflings-plus`, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir**, **Voltar**
      - Campos (32): **Jurídica** (`radio`), **Física** (`radio`), **Indicado por** (`select`), **Razão social** (`text`), **CNPJ** (`text`), **Nome fantasia** (`text`), **Representante** (`text`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **País** (`select`), **UF** (`select`), **Cidade** (`text`), **Tipo de telefone** (`select`), **Telefone** (`text`), **Receber cobrança por WhatsApp** (`checkbox`), **E-mail** (`text`), **Pós-pago** (`radio`) (+12)
      - Tabela 1: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [065] Administração > Intermediadores

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/intermediador` | **Título:** Intermediador
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/065-administracao-intermediadores.png)
- **Cabeçalhos:** **Intermediador**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar intermediador" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (7):**
  - **Pesquisar por intermediador** (tipo: `text` | obrigatório)
  - **Documento** (tipo: `select` | obrigatório | opções (3): [< Selecione >, CNPJ, CPF ou CIN])
  - **Número** (tipo: `text` | opcional | desabilitado)
  - **Rótulos** (tipo: `text` | opcional)
  - **Bloqueado** (tipo: `select` | opcional | opções (4): [< Selecione >, Ativo, Bloqueado, Inativo])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **selecionarCheckIntermediador0** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Intermediador**, **Tipo**, **Tipo doc.**, **Número**, **Rótulos**, **Status**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/065-administracao-intermediadores__open-adicionar.png))
      - Botões (4): `glyphicons glyphicons-plus`, `halflings halflings-plus`, **Concluir**, **Voltar**
      - Campos (19): **Jurídica** (`radio`), **Física** (`radio`), **Razão social** (`text`), **CNPJ** (`text`), **Nome fantasia** (`text`), **Representante** (`text`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **País** (`select`), **UF** (`select`), **Cidade** (`text`), **Tipo** (`select`), **Telefone** (`text`), **E-mail** (`text`), **Rótulos** (`text`), **Observações** (`textarea`)

### [066] Administração > Cadastro de Pessoas Jurídicas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/pessoaJuridica` | **Título:** Pessoas Jurídicas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/066-administracao-cadastro-de-pessoas-juridicas.png)
- **Cabeçalhos:** **Pessoas Jurídicas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos obrigatórios para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Não há campos para serem limpos" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Nome fantasia** (tipo: `text` | opcional)
  - **Razão social** (tipo: `text` | opcional)
  - **CNPJ** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Nome fantasia**, **Razão social**, **CNPJ**, **Responsável**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/066-administracao-cadastro-de-pessoas-juridicas__open-adicionar.png))
      - Botões (5): **Selecionar**, **Capturar**, **Digitalizar **, **Concluir**, **Voltar**
      - Campos (23): **__/__/____** (`text`), **razaoSocial** (`text`), **CNPJ** (`text`), **Nome fantasia** (`text`), **Inscrição estadual** (`text`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **UF** (`select`), **Cidade** (`text`), **Telefone** (`text`), **E-mail** (`text`), **inputTextSite** (`text`), **Digitador** (`text`), **Última alteração contratual** (`text`), **Data NIRE** (`text`), **Data registro NIRE** (`text`), **Nº Cartão** (`text`) (+3)
      - Tabela 1: [**Cartão**, **Nome**, **CPF ou CIN**] (0 linha(s))
      - Tabela 2: [**Certidão**, **Arquivo**, **Data**, **Tipo**, **Envia signo?**, **Envia RI?**, **Tamanho**] (0 linha(s))

### [067] Administração > Serviços internos realizados

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/servicosRealizados` | **Título:** Serviços internos realizados
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/067-administracao-servicos-internos-realizados.png)
- **Cabeçalhos:** **Serviços internos realizados**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
  - **Limpar** — tooltip: "Limpar filtros"
  - **Imprimir** — tooltip: "Realize uma busca com resultados antes de prosseguir com a impressão" | desabilitado
- **Campos / Filtros (6):**
  - **Tipo de pedido** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Escreventes, Serviço Interno])
  - **Período de lançamento** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Mês de referência** (tipo: `select` | opcional | opções (13): [< Selecione >, Janeiro, Fevereiro, Março, Abril (+8 opções)])
  - **Resumida** (tipo: `radio` | opcional)
  - **Detalhada** (tipo: `radio` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Valor total**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [068] Administração > Certidões solicitadas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/certidoesSolicitadas` | **Título:** Certidões Solicitadas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/068-administracao-certidoes-solicitadas.png)
- **Cabeçalhos:** **Certidões Solicitadas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Para continuar, preencha ao menos, um campo obrigatório." | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Imprimir** — tooltip: "Imprimir listagem"
- **Campos / Filtros (6):**
  - **Protocolo** (tipo: `text` | obrigatório)
  - **Escrevente** (tipo: `select` | opcional | opções (30): [< Selecione >, Erik Marques, Henrique, Henrique Senha, hugo (+25 opções)])
  - **Responsável** (tipo: `select` | opcional | opções (18): [< Selecione >, orion, Henrique, Erik Marques, rafael (+13 opções)])
  - **Status** (tipo: `select` | opcional | opções (5): [< Selecione >, Solicitada, Em andamento, Em emissão, Entregue])
  - **Data da solicitação** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data de recepção**, **Protocolo**, **Escrevente**, **Responsável**, **Data da solicitação**, **Status**, **Valor total**] — Estado: 6 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [069] Administração > Calendário

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/calendario` | **Título:** Calendário
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/administracao/069-administracao-calendario.png) | [Full Page](../auditoria/mapeamento-telas/nivel-1/administracao/069-administracao-calendario-full.png)
- **Cabeçalhos:** **Calendário**, **novembro de 2026**
- **Abas:** Nenhuma
- **Accordions (1):** **+ mais** (expandido)
- **Botões (7):**
  - _(somente ícone: `fa fa-chevron-left`)_ — `icon_only` | tooltip: "Anterior"
  - _(somente ícone: `fa fa-chevron-right`)_ — `icon_only` | tooltip: "Próximo"
  - **Hoje** — tooltip: "Hoje" | desabilitado
  - **Mês** — tooltip: "Mês atual"
  - **Semana** — tooltip: "Semana"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros:** Nenhum
- **Tabelas (4):**
  - Tabela 1: Colunas [**dom. seg. ter. qua. qui. sex. sáb.**, **dom.**, **seg.**, **ter.**, **qua.**, **qui.**, **sex.**, **sáb.**] — Estado: 6 linha(s)
  - Tabela 2: Colunas [**dom.**, **seg.**, **ter.**, **qua.**, **qui.**, **sex.**, **sáb.**] — Estado: vazia
  - Tabela 3: Colunas [_sem cabeçalhos_] — Estado: 5 linha(s)
  - Tabela 4: Colunas [**Descrição**, **Data**, **Tipo**, **Fixo**] — Estado: 30 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/administracao/069-administracao-calendario__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Tipo** (`select`), **Descrição** (`text`), **Data** (`text`), **Abrangência** (`select`), **inputfixed** (`checkbox`)
  - **Ações de Grade:**
    - Ações catalogadas (36): `1 de novembro de 2026` (sem tooltip), `2 de novembro de 2026` (sem tooltip), `mais +10` (sem tooltip), `3 de novembro de 2026` (sem tooltip), `4 de novembro de 2026` (sem tooltip), `5 de novembro de 2026` (sem tooltip), `6 de novembro de 2026` (sem tooltip), `7 de novembro de 2026` (sem tooltip), `8 de novembro de 2026` (sem tooltip), `9 de novembro de 2026` (sem tooltip), `10 de novembro de 2026` (sem tooltip), `11 de novembro de 2026` (sem tooltip), `12 de novembro de 2026` (sem tooltip), `13 de novembro de 2026` (sem tooltip), `14 de novembro de 2026` (sem tooltip), `15 de novembro de 2026` (sem tooltip), `16 de novembro de 2026` (sem tooltip), `17 de novembro de 2026` (sem tooltip), `18 de novembro de 2026` (sem tooltip), `19 de novembro de 2026` (sem tooltip), `20 de novembro de 2026` (sem tooltip), `21 de novembro de 2026` (sem tooltip), `22 de novembro de 2026` (sem tooltip), `23 de novembro de 2026` (sem tooltip), `24 de novembro de 2026` (sem tooltip), `25 de novembro de 2026` (sem tooltip), `26 de novembro de 2026` (sem tooltip), `27 de novembro de 2026` (sem tooltip), `28 de novembro de 2026` (sem tooltip), `29 de novembro de 2026` (sem tooltip), `30 de novembro de 2026` (sem tooltip), `1 de dezembro de 2026` (sem tooltip), `2 de dezembro de 2026` (sem tooltip), `3 de dezembro de 2026` (sem tooltip), `4 de dezembro de 2026` (sem tooltip), `5 de dezembro de 2026` (sem tooltip)

## Módulo: Históricos (1 tela(s))

### [070] Históricos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/historicoUsuario` | **Título:** Histórico
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/historicos/070-historicos.png)
- **Cabeçalhos:** **Histórico**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios" | desabilitado
- **Campos / Filtros (10):**
  - **Período:** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **Usuário** (tipo: `select` | opcional | opções (18): [< Selecione >, orion, henrique, Erik, rafael (+13 opções)])
  - **Ação** (tipo: `text` | opcional)
  - **Conteúdo** (tipo: `text` | opcional)
  - **Data e hora** (tipo: `text` | opcional)
  - **Usuário** (tipo: `text` | opcional)
  - **Ação** (tipo: `text` | opcional)
  - **Atividade** (tipo: `text` | opcional)
  - **Filtrar lista por conteúdo** (tipo: `text` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Data e hora**, **Usuário**, **Ação**, **Atividade**, **Conteúdo**] — Estado: vazia
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

## Módulo: Configurações (40 tela(s))

### [071] Configurações > Dados do cartório

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/cartorio/cadastrar` | **Título:** Cadastro das informações do cartório
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/071-configuracoes-dados-do-cartorio.png)
- **Cabeçalhos:** **Cadastro das informações do cartório**, **Endereço**, **Contato**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (2):**
  - **Alterar** — mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (19):**
  - **Nome da serventia** (tipo: `text` | opcional | desabilitado)
  - **CNPJ** (tipo: `text` | opcional | desabilitado)
  - **CNS** (tipo: `text` | opcional | desabilitado)
  - **Nome do responsável** (tipo: `text` | opcional | desabilitado)
  - **CPF ou CIN** (tipo: `text` | opcional | desabilitado)
  - **CEP** (tipo: `text` | opcional | desabilitado)
  - **CEP** (tipo: `text` | opcional | desabilitado)
  - **Número** (tipo: `text` | opcional | desabilitado)
  - **Complemento** (tipo: `text` | opcional | desabilitado)
  - **Bairro** (tipo: `text` | opcional | desabilitado)
  - **Bairro** (tipo: `text` | opcional | desabilitado)
  - **Código IBGE** (tipo: `text` | opcional | desabilitado)
  - **UF** (tipo: `select` | opcional | desabilitado | opções (30): [< Selecione >, AC, AL, AP, AM (+25 opções)])
  - **Telefone principal** (tipo: `text` | opcional | desabilitado)
  - **Telefone** (tipo: `text` | opcional | desabilitado)
  - **Site** (tipo: `text` | opcional | desabilitado)
  - **Email** (tipo: `text` | opcional | desabilitado)
  - **Email notificações** (tipo: `text` | opcional | desabilitado)
  - **observacao** (tipo: `textarea` | opcional | desabilitado)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [072] Configurações > Modelos de impressão > Enquadramento COAF

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/modeloComunicacao` | **Título:** Modelos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/072-configuracoes-modelos-de-impressao-enquadramento-coaf.png)
- **Cabeçalhos:** **Modelos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar um modelo comunicação" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (1):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Tipo**, **Título**, **Descrição**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/072-configuracoes-modelos-de-impressao-enquadramento-coaf__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (3): **Tipo de modelo** (`select`), **Título** (`text`), **Descrição** (`text`)
      - Tabela 1: [_sem cabeçalhos_] (15 linha(s))

### [073] Configurações > Modelos de impressão > Listagens diversas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/modelo` | **Título:** Modelos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/073-configuracoes-modelos-de-impressao-listagens-diversas.png)
- **Cabeçalhos:** **Modelos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (6):**
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
  - **Excluir** — tooltip: "Excluir modelos" | mutação
  - **Exportar** — tooltip: "Exportar modelos"
- **Campos / Filtros (6):**
  - **Tipo modelo** (tipo: `select` | obrigatório | opções (4): [< Selecione >, Modelo, Submodelo, Cláusula])
  - **Tipo modelo** (tipo: `select` | obrigatório | opções (30): [< Selecione >, Administração - Bonificação mensalista, Administração - Certidões solicitadas, Administração - Comunicações, Administração - Envio de escrituras para Registro (+25 opções)])
  - **Título** (tipo: `text` | opcional)
  - **Descrição** (tipo: `text` | opcional)
  - **totalPerPage** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **fileImport** (tipo: `file` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Tipo**, **Modelo**, **Título**, **Descrição**, **Modelo Padrão**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/073-configuracoes-modelos-de-impressao-listagens-diversas__open-adicionar.png))
      - Accordions na aba: **Tipo modelo < Selecione > Modelo Submodelo Cláusula Modelo < Selecione > Administração - Bonificação mensalista Administração - Certidões solicitadas Administração - Comunicações Administração - Envio de escrituras para Registro Administração - Faturamento saldo das contas Administração - Faturamento saldo das contas Comunicações - COAF envio Comunicações - COAF recibo Editor - Certidões e serviços Editor - Cláusula Editor - Consulta CNIB Editor - Protocolo Editor - Qualificações de partes Editor - Qualificações imóveis Email - Fatura mensalista Email - Notificação de serviços realizados Email - Vencimento Procuração Firmas - Certidão Firmas - Extrato da fatura mensalista Firmas - Extrato da fatura mensalista agrupado Firmas - Extrato de depósitos prévios do protocolo Firmas - Faturamento do mensalista - Extrato Firmas - Faturamento do mensalista - Listagem da emissão Firmas - Faturamento do mensalista - Listagem da manutenção Firmas - Faturamento do mensalista - Listagem leitura do arquivo de retorno Firmas - Impressão do cartão de assinatura Firmas - Listagem de comissões Firmas - Listagem de depósito prévio Firmas - Listagem de divergência pedido Firmas - Listagem de extrato do mensalista Firmas - Listagem de fichas Firmas - Listagem de orçamento Firmas - Listagem de pedido de firmas Firmas - Listagem de serviços praticados Firmas - Listagem de sinal público Firmas - Notificação de pendências Comunicação E-Notariado Firmas - Notificação de pendências Comunicação SEFAZ Veículos Firmas - Recibo do depósito prévio do protocolo Firmas - Serviços praticados Livro - Termo de abertura Livro - Termo de encerramento Notas - Certidão Notas - Certidão pedido Notas - Comprovante abertura de pedido de certidão Notas - Comprovante abertura de protocolo Notas - Consulta Certidão e serviços Notas - Consulta de protocolos Notas - Extrato de comissões Notas - Livro Notas - Notificação de pendências Comunicação DOITU Notas - Notificação de pendências Comunicação ITCMD Notas - Orçamento Notas - Recibo pedido Notas - Recibo protocolo Notas - Retirada Notas - Traslado RPS - Comunicação e Consultas Título Descrição Modelo padrão**
      - Botões (3): **Salvar e incluir novo**, **Visualizar modelo**, **Voltar**
      - Campos (6): **Tipo modelo** (`select`), **Tipo modelo** (`select`), **Título** (`text`), **Descrição** (`text`), **Modelo padrão** (`checkbox`), **importarModeloWord** (`file`)
  - **Ações de Grade:**
    - Ações catalogadas (4): `glyphicons glyphicons-user` (sem tooltip), `fas fa-clipboard-list vertical-center` (sem tooltip), `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip)

### [074] Configurações > Modelos de impressão > Etiquetas diversas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/modeloEtiqueta` | **Título:** Modelos de etiquetas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/074-configuracoes-modelos-de-impressao-etiquetas-diversas.png)
- **Cabeçalhos:** **Modelos de etiquetas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha o campo "Título" ou "Descrição" antes de prosseguir" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **inputTextTituloModelo** (tipo: `text` | opcional)
  - **inpuTextModeloDescricao** (tipo: `text` | opcional)
  - **selectTipoModelo** (tipo: `select` | opcional | opções (16): [< Selecione >, Caixa - Pedido certidão, Caixa - Protocolo, Caixa - Recibo entrada, Caixa - Recibo pagamento (+11 opções)])
  - **totalPerPage** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Tipo**, **Título**, **Descrição**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/074-configuracoes-modelos-de-impressao-etiquetas-diversas__open-adicionar.png))
      - Accordions na aba: **Tipo modelo < Selecione > Caixa - Pedido certidão Caixa - Protocolo Caixa - Recibo entrada Caixa - Recibo pagamento Caixa - Recibo retirada Firmas - Abertura de pedido Firmas - Autenticação Firmas - Cartão assinatura Firmas - Pagamento boleto Firmas - Reconhecimento Firmas - Reconhecimento de Sinal Público Firmas - Termo de comparecimento Firmas - Termo de comparecimento - Subsequente Notas - Recibo depósito prévio Notas - Trâmites Título Descrição Item Serviço < Selecione > (AEV) Reconhecimento por autenticidade digital Abertura de Firma AEDO Apostilamento de Haia Atas notariais, sem reflexo econômico pela primeira folha Atas notariais, sem reflexo econômico por página adicional Ato sem selo sem recolhimento Autenticação Autenticações Digitais (CENAD) Carta de Sentença Certidão ou traslado ou pública forma Certidão Procuração Descrição Manual Diligencia E-NOT PROVAS Escritura com valor declarado Escritura com valor declarado (Assinatura momentos distintos) Escritura de Convenção de Condomínio Escritura pública. Contrato de aquisição e correspondentes garantias reais Escritura pública. Primeira alienação imobiliária e eventual hipoteca Escritura pública. Primeiro título aquisitivo de imóvel Escritura sem valor declarado demais escrituras Escritura sem valor declarado para reconhecimento de filho, ou adoção Escritura sem valor ZEIS Fotocópia Fotocópia - Pira Materialização/Autenticação Matricula RI MATRÍCULA Outros Serviços - Prot Procuração com valor econômico acima de 4 outorgantes (adicional) Procuração com valor econômico até 4 outorgantes Procuração para fins previdenciários Procuração para o foro em geral acima de 4 outorgantes (adicional) Procuração para o foro em geral até 4 outorgantes Procuração para o foro em geral tratando-se de outorgante analfabeto Procuração sem valor econômico acima de 4 outorgantes (adicional) Procuração sem valor econômico até 4 outorgantes PROTESTO RC Reconhecimento AEDO Reconhecimento Autenticidade AEDO Reconhecimento com valor Reconhecimento em Documento Digital (e-Not Assina) Reconhecimento por autenticidade Reconhecimento sem valor Registro chancela mecânica Revogação de testamento Serviço AEDO e-notariado Testamento cerrado Testamento público com ou sem revogação Testamento público sem conteúdo patrimonial TESTE (AEV - Presen) Reconhecimento por autenticidade digital Teste Registro Imóveis Teste-SEDEX VOTU Traslado Gratuito Traslado Isento ZEIS com R.I ÍNDICE Configuração < Selecione > A_4 Autenticacao Cartao de assinatura Diebold Etiqueta Termica - AUT Etiqueta Térmica - REC Matricial Não fiscal Pagamento_Boleto Termica Térmica PP Linguagem < Selecione > EPL - Térmica ESC/P - Matricial Não fiscal ZPL - Térmica Fonte < Selecione > Modelo padrão Complementar com caractere especial: Variáveis Conteúdo Posicione o cursor no texto e clique sobre a variável para adicioná-la ◢**
      - Botões (7): `icon_only`, `icon_only`, `icon_only`, `icon_only`, `icon_only`, **Concluir**, **Voltar**
      - Campos (11): **Tipo modelo** (`select`), **Tipo modelo** (`text`), **Tipo modelo** (`text`), **Item** (`text`), **Serviço** (`select`), **Configuração** (`select`), **Linguagem** (`select`), **Fonte** (`select`), **Modelo padrão** (`checkbox`), **doClosingCharacter** (`checkbox`), **symbol** (`text`)
  - **Ações de Grade:**
    - Ações catalogadas (2): `Consultar` (sem tooltip), `Alterar` (sem tooltip)

### [075] Configurações > Modelos de impressão > Configuração de impressão

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/configuracaoImpressaoModelo` | **Título:** Configuração de impressão
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/075-configuracoes-modelos-de-impressao-configuracao-de-impressao.png)
- **Cabeçalhos:** **Configuração de impressão**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha o campo "Pesquisar por descrição" antes de prosseguir" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (1):**
  - **inputTextFiltroConfiguracaoImpressaoModeloName** (tipo: `text` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/075-configuracoes-modelos-de-impressao-configuracao-de-impressao__open-adicionar.png))
      - Accordions na aba: **Descrição Largura da etiqueta (cm) Altura da etiqueta (cm) Salto de etiquetas (cm) Margem superior (cm) Margem esquerda (cm)**
      - Botões (2): **Salvar**, **Voltar**
      - Campos (10): **Descrição** (`text`), **Descrição** (`number`), **Altura da etiqueta (cm)** (`number`), **Salto de etiquetas (cm)** (`number`), **Margem superior (cm)** (`number`), **Margem esquerda (cm)** (`number`), **Margem superior (cm)** (`number`), **Margem inferior (cm)** (`number`), **Margem esquerda (cm)** (`number`), **Margem direita (cm)** (`number`)
  - **Ações de Grade:**
    - Ações catalogadas (2): `Consultar` (sem tooltip), `Alterar` (sem tooltip)

### [076] Configurações > Tabela de custas > Cálculos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/divisor` | **Título:** Cálculo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/076-configuracoes-tabela-de-custas-calculos.png)
- **Cabeçalhos:** **Cálculo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Filtrar item"
  - **Limpar** — tooltip: "Limpar filtro"
  - **Adicionar** — tooltip: "Adicionar Divisor" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Vigência** (tipo: `select` | obrigatório | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **inputDescricao** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/076-configuracoes-tabela-de-custas-calculos__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (14): **Especialidade** (`select`), **Vigência** (`select`), **Descrição** (`text`), **Tabelião (%)** (`text`), **Estado (%)** (`text`), **SEFAZ (%)** (`text`), **ISS (%)** (`text`), **M. Público (%)** (`text`), **Reg. Civil (%)** (`text`), **T.J (%)** (`text`), **Sta. Casa (%)** (`text`), **Marcar cálculo como padrão** (`checkbox`), **Ignorar faixa mínima** (`checkbox`), **Cálculo para atos com assinaturas pendentes** (`checkbox`)

### [077] Configurações > Tabela de custas > Itens

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/item` | **Título:** Itens
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/077-configuracoes-tabela-de-custas-itens.png)
- **Cabeçalhos:** **Itens**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (7):**
  - **Filtrar** — tooltip: "Filtrar item"
  - **Limpar** — tooltip: "Limpar filtro"
  - _(somente ícone: `sem-classe`)_
  - _(somente ícone: `sem-classe`)_
  - _(somente ícone: `sem-classe`)_
  - **Adicionar** — tooltip: "Adicionar item" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (6):**
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Vigência** (tipo: `select` | obrigatório | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **Item** (tipo: `text` | opcional)
  - **inputDescricao** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Item**, **Descrição**, **Valor Inicial**, **Valor Final**, **Tabelião**, **Estado**, **SEFAZ**, **ISS**, **M. Público**, **Reg. Civil**, **T.J**, **Sta. Casa**, **Total**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/077-configuracoes-tabela-de-custas-itens__open-adicionar.png))
      - Botões (3): `halflings halflings-plus`, **Concluir**, **Voltar**
      - Campos (16): **Especialidade** (`select`), **Vigência** (`select`), **Item** (`text`), **Descrição** (`text`), **Valor inicial** (`text`), **Valor final** (`text`), **inputValorRecebedor0_0** (`text`), **inputValorRecebedor1_0** (`text`), **inputValorRecebedor2_0** (`text`), **inputValorRecebedor3_0** (`text`), **inputValorRecebedor4_0** (`text`), **inputValorRecebedor5_0** (`text`), **inputValorRecebedor6_0** (`text`), **inputValorRecebedor7_0** (`text`), **TOTAL** (`text`), **Observações** (`textarea`)

### [078] Configurações > Tabela de custas > Grupo de item

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/grupoItem` | **Título:** Grupo de item
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/078-configuracoes-tabela-de-custas-grupo-de-item.png)
- **Cabeçalhos:** **Grupo de item**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar grupo de item" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Pesquisar por descrição** (tipo: `text` | obrigatório)
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Especialidade**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/078-configuracoes-tabela-de-custas-grupo-de-item__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (2): **Descrição** (`text`), **Especialidade** (`select`)

### [079] Configurações > Tabela de custas > Parâmetros

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/custas/parametros` | **Título:** Parâmetros
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/079-configuracoes-tabela-de-custas-parametros.png)
- **Cabeçalhos:** **Parâmetros**
- **Abas (3):** **Itens** (ativa), **Taxas**, **Cálculos**
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar filtro"
  - **Filtrar** — tooltip: "Filtrar"
  - **Concluir** — tooltip: "Concluir" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (65):**
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Vigência** (tipo: `select` | obrigatório | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **Item** (tipo: `number` | opcional)
  - **inputDescricaoConfiguracaoCustas** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **inputValorConfiguracao0_0** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_0** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_0** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_0** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_0** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_1** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_1** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_1** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_1** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_1** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_2** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_2** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_2** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_2** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_2** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_3** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_3** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_3** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_3** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_3** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_4** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_4** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_4** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_4** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_4** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_5** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_5** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_5** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_5** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_5** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_6** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_6** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_6** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_6** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_6** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_7** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_7** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_7** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_7** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_7** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_8** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_8** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_8** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_8** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_8** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
  - **inputValorConfiguracao0_9** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao1_9** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao2_9** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao7_9** (tipo: `checkbox` | opcional)
  - **inputValorConfiguracao8_9** (tipo: `checkbox` | opcional | desabilitado)
  - **selectContasNotasLCW** (tipo: `select` | obrigatório | opções (30): [Não enviar, Autenticacao, Certidões ou Traslados, Cópias, Materialização/Desmaterialização de documentos (+25 opções)])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Item**, **Descricao**, **Mínimo**, **Máximo**, **Recolhe**, **Certidão**, **Traslado**, **Livro caixa**, **Tipo Certidão**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 2
- **Árvore Nível 2 (Sub-estados):**
  - **Abas (2):**
    - **Taxas** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/079-configuracoes-tabela-de-custas-parametros__tab-taxas.png))
      - Abas internas: **Itens**, **Taxas**, **Cálculos**
      - Botões (4): **Limpar**, **Filtrar**, **Concluir**, **Voltar**
      - Campos (10): **Especialidade** (`select`), **Vigência** (`select`), **selectReferenciaTaxa0** (`select`), **selectReferenciaTaxa1** (`select`), **selectReferenciaTaxa2** (`select`), **selectReferenciaTaxa3** (`select`), **selectReferenciaTaxa4** (`select`), **selectReferenciaTaxa5** (`select`), **selectReferenciaTaxa6** (`select`), **selectReferenciaTaxa7** (`select`)
      - Tabela 1: [**Descrição**, **Referência**] (8 linha(s))
    - **Cálculos** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/079-configuracoes-tabela-de-custas-parametros__tab-calculos.png))
      - Abas internas: **Itens**, **Taxas**, **Cálculos**
      - Botões (4): **Limpar**, **Filtrar**, **Concluir**, **Voltar**
      - Campos (13): **Especialidade** (`select`), **Vigência** (`select`), **totalPorPagina** (`select`), **selectSiglaGratuita1870** (`select`), **selectSiglaGratuitae1ba** (`select`), **selectSiglaGratuita057c** (`select`), **selectSiglaGratuita4c92** (`select`), **selectSiglaGratuita1f4a** (`select`), **selectSiglaGratuitaa36d** (`select`), **selectSiglaGratuitae3c9** (`select`), **selectSiglaGratuitab85f** (`select`), **selectSiglaGratuita59ca** (`select`), **selectSiglaGratuitad134** (`select`)
      - Tabela 1: [**Descrição**, **Sigla gratuita**] (10 linha(s))

### [080] Configurações > Tabela de custas > Taxas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/taxas` | **Título:** Taxas
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/080-configuracoes-tabela-de-custas-taxas.png)
- **Cabeçalhos:** **Taxas**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Filtrar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Vigência** (tipo: `select` | obrigatório | opções (7): [< Selecione >, 08/01/2026, 02/01/2026, 08/01/2025, 08/01/2024 (+2 opções)])
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 8 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/080-configuracoes-tabela-de-custas-taxas__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (6): **Especialidade** (`select`), **Vigência** (`select`), **Descrição** (`text`), **Adicionar alíquota cópia** (`checkbox`), **Prefixado** (`radio`), **Percentual** (`radio`)

### [081] Configurações > Tabela de custas > Vigências

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/vigencias` | **Título:** Vigências
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/081-configuracoes-tabela-de-custas-vigencias.png)
- **Cabeçalhos:** **Vigências**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar filtro"
  - **Filtrar** — tooltip: "Filtrar vigências"
  - **Adicionar** — tooltip: "Adicionar vigência" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (9):**
  - **Especialidade** (tipo: `select` | obrigatório | opções (8): [< Selecione >, Notas e Contratos Marítimos, Protesto de Letras e Títulos, Registro Civil das Pessoas Naturais, Registro de Imóveis (+3 opções)])
  - **Inativos** (tipo: `checkbox` | opcional)
  - **Sem rótulo** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia0** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia1** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia2** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia3** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia4** (tipo: `checkbox` | opcional)
  - **inputSelecionadoVigencia5** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Vigência**, **Especialidade**, **Responsável**, **Situação**] — Estado: 6 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/081-configuracoes-tabela-de-custas-vigencias__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (6): **Especialidade** (`select`), **__/__/____** (`text`), **Responsável** (`select`), **Sim** (`radio`), **Não** (`radio`), **fonteTabela** (`textarea`)

### [082] Configurações > Cadastros auxiliares > Alíquotas

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/aliquota` | **Título:** Alíquota
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/082-configuracoes-cadastros-auxiliares-aliquotas.png)
- **Cabeçalhos:** **Alíquota**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (3):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatório para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **UF** (tipo: `select` | obrigatório | opções (28): [< Selecione >, AC, AL, AP, AM (+23 opções)])
  - **Cidade** (tipo: `text` | obrigatório)
- **Tabelas (1):**
  - Tabela 1: Colunas [**UF**, **Cidade**, **ITBI %**, **ISS %**, **Padrão**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [083] Configurações > Cadastros auxiliares > Banco

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/banco` | **Título:** Bancos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/083-configuracoes-cadastros-auxiliares-banco.png)
- **Cabeçalhos:** **Bancos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Pesquisar por bancos** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Código**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/083-configuracoes-cadastros-auxiliares-banco__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (2): **Código** (`text`), **Descrição** (`text`)
  - **Ações de Grade:**
    - Ações catalogadas (2): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip)

### [084] Configurações > Cadastros auxiliares > Cargo

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/cargo` | **Título:** Cargo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/084-configuracoes-cadastros-auxiliares-cargo.png)
- **Cabeçalhos:** **Cargo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por cargo** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 5 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/084-configuracoes-cadastros-auxiliares-cargo__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (3): **Descrição** (`text`), **Sigla** (`text`), **Observações** (`textarea`)

### [085] Configurações > Cadastros auxiliares > Documento apresentado

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/documentoApresentado` | **Título:** Documento apresentado
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/085-configuracoes-cadastros-auxiliares-documento-apresentado.png)
- **Cabeçalhos:** **Documento apresentado**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por documento apresentado** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/085-configuracoes-cadastros-auxiliares-documento-apresentado__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Descrição** (`text`), **Sigla** (`text`), **Documento de certidão** (`checkbox`), **Controle automático de classificadores** (`checkbox`), **Observações** (`textarea`)

### [086] Configurações > Cadastros auxiliares > Espécie

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/especie` | **Título:** Espécie
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/086-configuracoes-cadastros-auxiliares-especie.png)
- **Cabeçalhos:** **Espécie**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Descrição** (tipo: `text` | obrigatório)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Status**] — Estado: 7 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/086-configuracoes-cadastros-auxiliares-especie__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/configuracoes/086-configuracoes-cadastros-auxiliares-especie__open-adicionar-full.png) | altura: 3240px)
      - Botões (2): **Concluir**, **Voltar**
      - Campos (104): **Tipo ato DOI** (`select`), **Descrição** (`text`), **inputPesquisaNatureza** (`text`), **inputCheckboxMarcarTodasParticipacoes** (`checkbox`), **inputCheckboxNaturezaTO0** (`checkbox`), **inputCheckboxNaturezaTO1** (`checkbox`), **inputCheckboxNaturezaTO2** (`checkbox`), **inputCheckboxNaturezaTO3** (`checkbox`), **inputCheckboxNaturezaTO4** (`checkbox`), **inputCheckboxNaturezaTO5** (`checkbox`), **inputCheckboxNaturezaTO6** (`checkbox`), **inputCheckboxNaturezaTO7** (`checkbox`), **inputCheckboxNaturezaTO8** (`checkbox`), **inputCheckboxNaturezaTO9** (`checkbox`), **inputCheckboxNaturezaTO10** (`checkbox`), **inputCheckboxNaturezaTO11** (`checkbox`), **inputCheckboxNaturezaTO12** (`checkbox`), **inputCheckboxNaturezaTO13** (`checkbox`), **inputCheckboxNaturezaTO14** (`checkbox`), **inputCheckboxNaturezaTO15** (`checkbox`) (+84)
      - Tabela 1: [**Natureza**] (99 linha(s))
      - Tabela 2: [**Natureza**] (0 linha(s))

### [087] Configurações > Cadastros auxiliares > Feriados

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/feriado` | **Título:** Feriado
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/087-configuracoes-cadastros-auxiliares-feriados.png)
- **Cabeçalhos:** **Feriado**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (15):**
  - **inputDescricaoFeriado** (tipo: `text` | opcional)
  - **Período** (tipo: `text` | opcional)
  - **__/__/____** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Data**, **Território**, **Fixo**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/087-configuracoes-cadastros-auxiliares-feriados__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Tipo** (`select`), **Descrição** (`text`), **Data** (`text`), **Abrangência** (`select`), **inputfixed** (`checkbox`)

### [088] Configurações > Cadastros auxiliares > Formas de pagamento

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoPagamento` | **Título:** Formas de pagamento
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/088-configuracoes-cadastros-auxiliares-formas-de-pagamento.png)
- **Cabeçalhos:** **Formas de pagamento**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar forma de pagamento" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (5):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Código** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Descrição**, **Sigla**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/088-configuracoes-cadastros-auxiliares-formas-de-pagamento__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (12): **Descrição** (`text`), **Sigla** (`text`), **Código** (`text`), **Código SIGNO** (`select`), **Exige dados bancários** (`checkbox`), **Forma de pagamento padrão** (`checkbox`), **Exige dados mensalista** (`checkbox`), **Forma de pagamento em espécie** (`checkbox`), **Provedor de pagamento** (`checkbox`), **Forma de pagamento para escreventes** (`checkbox`), **Forma de pagamento para serviços internos** (`checkbox`), **Transferência de protocolo** (`checkbox`)

### [089] Configurações > Cadastros auxiliares > Natureza

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/natureza` | **Título:** Natureza
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/089-configuracoes-cadastros-auxiliares-natureza.png)
- **Cabeçalhos:** **Natureza**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (7):**
  - **Espécie** (tipo: `select` | obrigatório | opções (8): [< Selecione >, APOSTILA DE HAIA, ATA NOTARIAL, CARTA DE SENTENÇA, CERTIDÃO (+3 opções)])
  - **Natureza** (tipo: `text` | obrigatório)
  - **Comunicação** (tipo: `select` | obrigatório | opções (6): [< Selecione >, CEP, CESDI, DOI, ITCMD (+1 opções)])
  - **Informa livro e folhas** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Sim, Não])
  - **Repetir livro e folhas** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Sim, Não])
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Espécie**, **Natureza**, **Status**, **Informa livro e folha**, **Repetir livro e folhas**, **Imóvel**, **Comunicações**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/089-configuracoes-cadastros-auxiliares-natureza__open-adicionar.png))
      - Botões (8): **Perfil de Partes**, **Partes**, **Documentos apresentados**, **Usuários**, **Limpar**, **Filtrar**, **Concluir**, **Voltar**
      - Campos (12): **inputDescricaoNatureza** (`text`), **Espécie** (`select`), **CEP** (`select`), **CESDI** (`select`), **RCTO** (`select`), **ITCMD** (`select`), **Não informar livro e folhas** (`checkbox`), **Permitir a repetição do livro e folhas** (`checkbox`), **Utilização de imóvel** (`select`), **inputPesquisaPerfilPartes** (`text`), **inputCheckboxMarcarTodosPerfilParticipacaoTO** (`checkbox`), **inputCheckboxSelecionarTodosPerfilParte** (`checkbox`)
      - Tabela 1: [**Perfil de partes**] (0 linha(s))

### [090] Configurações > Cadastros auxiliares > Órgão expedidor

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/orgaoExpedidor` | **Título:** Órgão expedidor
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/090-configuracoes-cadastros-auxiliares-orgao-expedidor.png)
- **Cabeçalhos:** **Órgão expedidor**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por órgão expedidor** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 1 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/090-configuracoes-cadastros-auxiliares-orgao-expedidor__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (3): **Descrição** (`text`), **Sigla** (`text`), **Observações** (`textarea`)

### [091] Configurações > Cadastros auxiliares > Outros serviços

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/outrosServicos` | **Título:** Outros serviços
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/091-configuracoes-cadastros-auxiliares-outros-servicos.png)
- **Cabeçalhos:** **Outros serviços**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar outro serviço" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Valor**, **Protocolo oficial Protocolo oficialSim - O serviço será impresso no protocolo oficial.Não - O serviço não será impresso no protocolo oficial.Caso deseje alterar, clique no ícone para realizar a edição do cadastro.**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/091-configuracoes-cadastros-auxiliares-outros-servicos__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Descrição** (`text`), **Valor** (`text`), **Imprimir serviço no protocolo oficial** (`checkbox`), **Sem valor fixo** (`checkbox`)

### [092] Configurações > Cadastros auxiliares > Participação

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/participacaoNotas` | **Título:** Participação
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/092-configuracoes-cadastros-auxiliares-participacao.png)
- **Cabeçalhos:** **Participação**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar participação" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/092-configuracoes-cadastros-auxiliares-participacao__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (7): **Descrição** (`text`), **Pessoa física** (`checkbox`), **Pessoa jurídica** (`checkbox`), **Firmas** (`checkbox`), **Notas** (`checkbox`), **Outorgante** (`checkbox`), **Outorgado** (`checkbox`)

### [093] Configurações > Cadastros auxiliares > Perfil de partes

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/perfilParticipacao` | **Título:** Perfil de partes
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/093-configuracoes-cadastros-auxiliares-perfil-de-partes.png)
- **Cabeçalhos:** **Perfil de partes**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Descrição** (tipo: `text` | obrigatório)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Status**] — Estado: vazia
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/093-configuracoes-cadastros-auxiliares-perfil-de-partes__open-adicionar.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/configuracoes/093-configuracoes-cadastros-auxiliares-perfil-de-partes__open-adicionar-full.png) | altura: 1788px)
      - Botões (3): `glyphicons glyphicons-plus`, **Concluir**, **Voltar**
      - Campos (54): **Descrição** (`text`), **inputPesquisaParticipacao** (`text`), **inputCheckboxMarcarTodasParticipacoes** (`checkbox`), **inputCheckboxParticipacaoTO0** (`checkbox`), **inputCheckboxParticipacaoTO1** (`checkbox`), **inputCheckboxParticipacaoTO2** (`checkbox`), **inputCheckboxParticipacaoTO3** (`checkbox`), **inputCheckboxParticipacaoTO4** (`checkbox`), **inputCheckboxParticipacaoTO5** (`checkbox`), **inputCheckboxParticipacaoTO6** (`checkbox`), **inputCheckboxParticipacaoTO7** (`checkbox`), **inputCheckboxParticipacaoTO8** (`checkbox`), **inputCheckboxParticipacaoTO9** (`checkbox`), **inputCheckboxParticipacaoTO10** (`checkbox`), **inputCheckboxParticipacaoTO11** (`checkbox`), **inputCheckboxParticipacaoTO12** (`checkbox`), **inputCheckboxParticipacaoTO13** (`checkbox`), **inputCheckboxParticipacaoTO14** (`checkbox`), **inputCheckboxParticipacaoTO15** (`checkbox`), **inputCheckboxParticipacaoTO16** (`checkbox`) (+34)
      - Tabela 1: [**Participação**] (50 linha(s))
      - Tabela 2: [**Participação**] (0 linha(s))

### [094] Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/areaAtuacao` | **Título:** Área de atuação
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/094-configuracoes-cadastros-auxiliares-pessoa-fisica-area-de-atuacao.png)
- **Cabeçalhos:** **Área de atuação**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Descrição**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/094-configuracoes-cadastros-auxiliares-pessoa-fisica-area-de-atuacao__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (2): **Código** (`text`), **Descrição** (`text`)

### [095] Configurações > Cadastros auxiliares > Pessoa física > Estado civil

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/estadoCivil` | **Título:** Estado civil
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/095-configuracoes-cadastros-auxiliares-pessoa-fisica-estado-civil.png)
- **Cabeçalhos:** **Estado civil**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Pesquisar por estado civil** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 8 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/095-configuracoes-cadastros-auxiliares-pessoa-fisica-estado-civil__open-adicionar.png))
      - Accordions na aba: **Código sinter Descrição do estado civil Masculina Código E-Notariado Descrição do estado civil Feminino**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Código sinter** (`text`), **Descrição do estado civil Masculina** (`text`), **Código E-Notariado** (`text`), **Descrição do estado civil Feminino** (`text`)
  - **Ações de Grade:**
    - Ações catalogadas (3): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip), `glyphicons glyphicons-pencil disabled-no-events` (sem tooltip)

### [096] Configurações > Cadastros auxiliares > Pessoa física > Nacionalidade

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/nacionalidade` | **Título:** Consulta de Nacionalidade
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/096-configuracoes-cadastros-auxiliares-pessoa-fisica-nacionalidade.png)
- **Cabeçalhos:** **Consulta de Nacionalidade**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Descrição**, **Situação**] — Estado: 6 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/096-configuracoes-cadastros-auxiliares-pessoa-fisica-nacionalidade__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (2): **Código** (`text`), **Descrição** (`text`)

### [097] Configurações > Cadastros auxiliares > Pessoa física > Naturalidade

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/naturalidade` | **Título:** Naturalidade
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/097-configuracoes-cadastros-auxiliares-pessoa-fisica-naturalidade.png)
- **Cabeçalhos:** **Naturalidade**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Pesquisar por naturalidade** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/097-configuracoes-cadastros-auxiliares-pessoa-fisica-naturalidade__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (3): **Descrição** (`text`), **Sigla** (`text`), **Observações** (`textarea`)

### [098] Configurações > Cadastros auxiliares > Pessoa física > Profissão

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/profissao` | **Título:** Profissão
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/098-configuracoes-cadastros-auxiliares-pessoa-fisica-profissao.png)
- **Cabeçalhos:** **Profissão**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por profissão** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPerPage** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/098-configuracoes-cadastros-auxiliares-pessoa-fisica-profissao__open-adicionar.png))
      - Accordions na aba: **Código sinter Área de atuação Selecione uma Area de Atuação Dirigentes e Gerentes Membros Superiores, Dirigentes e Servidores do Poder Público e de Organizações de Interesse Público Militares Outras Ocupações Outros Técnicos de Nível Médio Profissionais das Ciências Biológicas, Bioquímicas, da Saúde e Afins Profissionais das Ciências Exatas, Físicas, Químicas e da Engenharia Profissionais das Ciências Jurídicas, Sociais e Humanas Profissionais das Letras, das Artes, da Comunicação e Religiosos Profissionais do Ensino Técnicos de Nível Médio das Ciências Biológicas, Bioquímicas, da Saúde e Afins Técnicos de Nível Médio das Ciências Físicas, Químicas, Engenharia e Afins Técnicos de Nível Médio dos Serviços Culturais, das Comunicações e dos Desportos Técnicos de Nível Médio em Serviços de Transportes Técnicos de Nível Médio nas Ciências Administrativas Trabalhadores das Indústrias Trabalhadores de Reparação e Manutenção Trabalhadores de Serviços Administrativos Trabalhadores de Serviços Diversos Trabalhadores do Setor Primário Vendedores e Prestadores de Serviços do Comércio Descrição da Profissão Masculina Descrição da Profissão Feminino**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Código sinter** (`text`), **Código sinter** (`select`), **Código sinter** (`text`), **Código sinter** (`text`)
  - **Ações de Grade:**
    - Ações catalogadas (3): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip), `glyphicons glyphicons-pencil disabled-no-events` (sem tooltip)

### [099] Configurações > Cadastros auxiliares > Pessoa física > Regime de bens

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/regimeBens` | **Título:** Regime de bens
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/099-configuracoes-cadastros-auxiliares-pessoa-fisica-regime-de-bens.png)
- **Cabeçalhos:** **Regime de bens**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Pesquisar por regime de bens** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**] — Estado: 7 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/099-configuracoes-cadastros-auxiliares-pessoa-fisica-regime-de-bens__open-adicionar.png))
      - Accordions na aba: **Descrição do regime de bens Regime de bens (Cadastro Único de Clientes do Notariado) < Selecione > Comunhão Parcial Comunhão Universal Participacao Final nos Aquestos Separação Total**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (2): **Descrição do regime de bens** (`text`), **Regime de bens (Cadastro Único de Clientes do Notariado)** (`select`)
  - **Ações de Grade:**
    - Ações catalogadas (2): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip)

### [100] Configurações > Cadastros auxiliares > Serviços Internos

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/servicoInterno` | **Título:** Serviços Internos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/100-configuracoes-cadastros-auxiliares-servicos-internos.png)
- **Cabeçalhos:** **Serviços Internos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar Serviço Interno" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Código** (tipo: `number` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Código**, **Descrição**, **Situação**] — Estado: 2 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/100-configuracoes-cadastros-auxiliares-servicos-internos__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (3): **Código** (`text`), **Nome do serviço** (`text`), **Observações** (`text`)

### [101] Configurações > Cadastros auxiliares > Situação do protocolo

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/situacaoProtocolo` | **Título:** Situação do protocolo
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/101-configuracoes-cadastros-auxiliares-situacao-do-protocolo.png)
- **Cabeçalhos:** **Situação do protocolo**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por descrição** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Situação**, **Ordem apresentação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/101-configuracoes-cadastros-auxiliares-situacao-do-protocolo__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (7): **Descrição** (`text`), **Vincular Status Protocolo** (`select`), **Vincular Status Certidão** (`select`), **Protocolo** (`checkbox`), **Certidões e serviços** (`checkbox`), **Ordem de apresentação** (`number`), **Observações** (`textarea`)

### [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoMovimentacaoFinanceira` | **Título:** Tipo de movimentação financeira
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/102-configuracoes-cadastros-auxiliares-tipo-de-movimentacao-financeira.png)
- **Cabeçalhos:** **Tipo de movimentação financeira**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Filtrar** — tooltip: "Preencha ao menos um dos campos para efetuar a busca" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar tipo de movimentação financeira" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (4):**
  - **Pesquisar por descrição** (tipo: `text` | obrigatório)
  - **Tipo lançamento** (tipo: `select` | obrigatório | opções (3): [< Selecione >, Crédito, Débito])
  - **Inativos** (tipo: `checkbox` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Tipo de lançamento**, **Sigla**, **Situação**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/102-configuracoes-cadastros-auxiliares-tipo-de-movimentacao-financeira__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (6): **inputDescricaoDepositoPrevio** (`text`), **inputSiglaDepositoPrevio** (`text`), **Tipo lançamento** (`select`), **Depósito prévio** (`checkbox`), **Tipo de movimentação** (`select`), **Observações** (`textarea`)

### [103] Configurações > Cadastros auxiliares > Tipo de documento

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoDocumento` | **Título:** Tipos de documentos
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/103-configuracoes-cadastros-auxiliares-tipo-de-documento.png)
- **Cabeçalhos:** **Tipos de documentos**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (14):**
  - **Filtrar** — tooltip: "Preencha o campo "Pesquisar por tipo de documento" antes de prosseguir" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Um documento padrão não pode ser excluído" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Um documento padrão não pode ser excluído" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Um documento padrão não pode ser excluído" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Um documento padrão não pode ser excluído" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Um documento padrão não pode ser excluído" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (2):**
  - **Pesquisar por tipo de documento** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (5): [? number:10 ?, 10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Sigla do tipo documento**, **Descrição**, **Tipo de pessoa**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/103-configuracoes-cadastros-auxiliares-tipo-de-documento__open-adicionar.png))
      - Accordions na aba: **Sigla do tipo de documento Descrição do tipo de documento Tipo de documento (Cadastro Único de Clientes do Notariado) < Selecione > RG Carteira Profissional Passaporte Carteira de Reservista RNE Tipo de documento para comunicação CEP: < Selecione > Carteira de Identificação Funcional Carteira de Identificação Militar Carteira de Trabalho Carteira Profissional CNH Passaporte RNE RG Outro Documento Público CNPJ Tipo de documento para comunicação CESDI: < Selecione > Carteira de Identidade Funcional Carteira de Identidade Militar Carteira de Trabalho Carteira Profissional CNH Passaporte RNE RG Outro Documento Público OAB Utilizado para: Pessoa física Pessoa jurídica Observações**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (8): **Sigla do tipo de documento** (`text`), **Descrição do tipo de documento** (`text`), **Tipo de documento (Cadastro Único de Clientes do Notariado)** (`select`), **Tipo de documento para comunicação CEP:** (`select`), **Tipo de documento para comunicação CESDI:** (`select`), **Pessoa física** (`checkbox`), **Pessoa jurídica** (`checkbox`), **Observações** (`textarea`)
  - **Ações de Grade:**
    - Ações catalogadas (4): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip), `Excluir` (sem tooltip), `Um documento padrão não pode ser excluído` (sem tooltip)

### [104] Configurações > Cadastros auxiliares > Tipo de e-mail

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoEmail` | **Título:** Tipo de e-mail
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/104-configuracoes-cadastros-auxiliares-tipo-de-e-mail.png)
- **Cabeçalhos:** **Tipo de e-mail**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por tipo de e-mail** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 2 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/104-configuracoes-cadastros-auxiliares-tipo-de-e-mail__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Descrição** (`text`), **Sigla** (`text`), **Padrão** (`checkbox`), **Observações** (`textarea`)

### [105] Configurações > Cadastros auxiliares > Tipo de endereço

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoEndereco` | **Título:** Tipo de endereço
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/105-configuracoes-cadastros-auxiliares-tipo-de-endereco.png)
- **Cabeçalhos:** **Tipo de endereço**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por tipo de endereço** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 2 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/105-configuracoes-cadastros-auxiliares-tipo-de-endereco__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Descrição** (`text`), **Sigla** (`text`), **Tipo** (`select`), **Padrão** (`checkbox`), **Observações** (`textarea`)

### [106] Configurações > Cadastros auxiliares > Tipo de telefone

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoTelefone` | **Título:** Tipo de telefone
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/106-configuracoes-cadastros-auxiliares-tipo-de-telefone.png)
- **Cabeçalhos:** **Tipo de telefone**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (3):**
  - **Pesquisar por tipo de telefone** (tipo: `text` | opcional)
  - **Sigla** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 3 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/106-configuracoes-cadastros-auxiliares-tipo-de-telefone__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Descrição** (`text`), **Sigla** (`text`), **Tipo** (`select`), **Padrão** (`checkbox`), **Observações** (`textarea`)

### [107] Configurações > Cadastros auxiliares > Tipo de representante

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/tipoRepresentante` | **Título:** Tipo de representante
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/107-configuracoes-cadastros-auxiliares-tipo-de-representante.png)
- **Cabeçalhos:** **Tipo de representante**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (4):**
  - **Limpar** — tooltip: "Limpar"
  - **Filtrar** — tooltip: "Preencha os campos obrigatórios para liberar o botão" | desabilitado
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (10):**
  - **Descrição** (tipo: `text` | opcional)
  - **totalPorPagina** (tipo: `select` | opcional | opções (4): [10, 20, 50, 100])
  - **selecionarTodos** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
  - **inputSelecionado** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Descrição**, **Sigla**, **Situação**] — Estado: 7 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/107-configuracoes-cadastros-auxiliares-tipo-de-representante__open-adicionar.png))
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Descrição** (`text`), **Sigla** (`text`), **Procurador** (`radio`), **Procurador** (`radio`), **Procurador** (`radio`)

### [108] Configurações > Perfis e permissões de acesso

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/perfil` | **Título:** Perfis e permissões
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/108-configuracoes-perfis-e-permissoes-de-acesso.png)
- **Cabeçalhos:** **Perfis e permissões**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (16):**
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Este perfil não pode ser excluído porque é o perfil principal da aplicação" | desabilitado
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - _(somente ícone: `sem-classe`)_ — tooltip: "Excluir" | mutação
  - _(somente ícone: `sem-classe`)_ — tooltip: "Duplicar perfil"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (1):**
  - **Mostrar perfis de outras especialidades** (tipo: `checkbox` | opcional)
- **Tabelas (1):**
  - Tabela 1: Colunas [**Perfil**, **Produto**, **Tempo de sessão (minutos)**] — Estado: 7 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/108-configuracoes-perfis-e-permissoes-de-acesso__open-adicionar.png))
      - Abas internas: **Dashboard**, **Firmas**, **Notas**, **Relatórios**, **Administração**, **Históricos**, **Configurações**, **Integração**, **Abertura de chamados**
      - Accordions na aba: **Nome do perfil Tempo de sessão (minutos)**, **Funcionalidades Marcar/Desmarcar todas Dashboard Firmas Notas Relatórios Administração Históricos Configurações Integração Abertura de chamados Usuários Usuários selecionados Nome Usuários não selecionados Nome bruno Erik henrique henrique_senha henriqueauditoria hugo joaocontarim lucas marcus neves orion orion2 orion3 otavio.branco rafael vina2 vinicius**, **Dashboard**, **Firmas**, **Notas**, **Relatórios**, **Administração**, **Históricos**, **Configurações**, **Integração**, **Abertura de chamados**
      - Botões (2): **Salvar e incluir novo**, **Voltar**
      - Campos (29): **Nome do perfil** (`text`), **Nome do perfil** (`text`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **Sem rótulo** (`checkbox`), **usuarioDisp21** (`checkbox`), **usuarioDisp4** (`checkbox`), **usuarioDisp3** (`checkbox`), **usuarioDisp39** (`checkbox`), **usuarioDisp30** (`checkbox`), **usuarioDisp41** (`checkbox`), **usuarioDisp34** (`checkbox`), **usuarioDisp50** (`checkbox`) (+9)
      - Tabela 1: [**Nome**] (0 linha(s))
      - Tabela 2: [**Nome**] (17 linha(s))
  - **Ações de Grade:**
    - Ações catalogadas (6): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip), `fas fa-clipboard-list vertical-center` (sem tooltip), `Excluir` (sem tooltip), `Duplicar perfil` (sem tooltip), `Este perfil não pode ser excluído porque é o perfil principal da aplicação` (sem tooltip)

### [109] Configurações > Usuários

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/usuario` | **Título:** Usuários
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/109-configuracoes-usuarios.png)
- **Cabeçalhos:** **Usuários**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (5):**
  - **Filtrar** — tooltip: "Digite algo para pesquisar" | desabilitado
  - **Limpar** — tooltip: "Limpar"
  - **Adicionar** — tooltip: "Adicionar" | mutação
  - **Excluir** — tooltip: "Excluir modelos" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (6):**
  - **Nome** (tipo: `text` | opcional)
  - **Cargo** (tipo: `text` | opcional)
  - **Perfil de acesso** (tipo: `text` | opcional)
  - **Inativos** (tipo: `checkbox` | opcional)
  - **Apenas com 2FA** (tipo: `checkbox` | opcional)
  - **totalPerPage** (tipo: `select` | opcional | opções (5): [? number:10 ?, 10, 20, 50, 100])
- **Tabelas (1):**
  - Tabela 1: Colunas [**Usuário**, **Nome**, **Cargo**, **Perfil de acesso**, **Assinante**, **Escrevente**, **2FA**] — Estado: 10 linha(s)
- **Nível 2 — Status:** `explored` | **Sub-estados:** 1
- **Árvore Nível 2 (Sub-estados):**
  - **Modais / Formulários (1):**
    - **Adicionar** (status: `captured` | abertura: `sub_route` | restauração limpa: sim | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/109-configuracoes-usuarios__open-adicionar.png))
      - Botões (3): **×**, **Salvar e incluir novo**, **Voltar**
      - Campos (16): **Usuário** (`text`), **Nome** (`text`), **CPF ou CIN** (`text`), **Usuário** (`text`), **E-mail** (`text`), **E-mail** (`checkbox`), **Telefone principal** (`text`), **Telefone** (`text`), **Perfil de Usuário** (`select`), **checkBoxUsuarioAssinante** (`checkbox`), **checkBoxUsuarioEscrevente** (`checkbox`), **checkBoxUsuarioEscreventeERecepcao** (`checkbox`), **checkBoxUsuarioOficial** (`checkbox`), **checkBoxUsuarioSupervisor** (`checkbox`), **checkBoxUsuarioSubstituto** (`checkbox`), **checkBoxUsuarioAuxiliar** (`checkbox`)
  - **Ações de Grade:**
    - Ações catalogadas (2): `glyphicons glyphicons-eye-open` (sem tooltip), `glyphicons glyphicons-pencil` (sem tooltip)

### [110] Configurações > Parametrizações

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/configuracoes` | **Título:** Configurações
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/configuracoes/110-configuracoes-parametrizacoes.png)
- **Cabeçalhos:** **Configurações**, **Cartão de assinatura**, **Cálculo de custas**, **Controle de guia**, **Geral**
- **Abas (18):** **Geral** (ativa), **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
- **Accordions:** Nenhum
- **Botões (2):**
  - **Concluir** — tooltip: "Concluir" | mutação
  - **Voltar** — tooltip: "Voltar"
- **Campos / Filtros (15):**
  - **Tipo** (tipo: `select` | opcional | opções (5): [< Selecione >, Automático, Desativado, Manual, Por digitação])
  - **Qtd. na busca** (tipo: `text` | obrigatório)
  - **Produto** (tipo: `select` | obrigatório | opções (17): [< Selecione >, AEV, Apostilamento de Haia, Autenticação, Cartão (+12 opções)])
  - **Tipo** (tipo: `select` | opcional | opções (4): [< Selecione >, Automático, Desativado, Manual])
  - **Ativar rotina de bloqueio automático de cartões de assinatura** (tipo: `checkbox` | opcional)
  - **Horário de execução** (tipo: `time` | opcional)
  - **Para menos** (tipo: `radio` | opcional)
  - **Para mais** (tipo: `radio` | opcional)
  - **Truncado** (tipo: `radio` | opcional)
  - **Contábil** (tipo: `radio` | opcional)
  - **Diário** (tipo: `radio` | opcional)
  - **Semanal** (tipo: `radio` | opcional)
  - **Mensal** (tipo: `radio` | opcional)
  - **Zera anualmente** (tipo: `checkbox` | opcional)
  - **Otimizar consultas e telas** (tipo: `checkbox` | opcional)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `explored` | **Sub-estados:** 17
- **Árvore Nível 2 (Sub-estados):**
  - **Abas (17):**
    - **Captura e digitalização** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-captura-e-digitalizacao.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-captura-e-digitalizacao-full.png) | altura: 1206px)
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (13): `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-plus`, **Concluir**, **Voltar**
      - Campos (28): **tipoDigitalizador** (`select`), **inputTextUrlConexaoDocuvieware** (`text`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`), **Caminho** (`text`), **selectCoresDut** (`select`), **selectDpiDut** (`select`), **Mostrar configurações do scanner** (`checkbox`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`), **Caminho** (`text`), **Documento** (`select`) (+8)
    - **Parâmetros por estação** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-parametros-por-estacao.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (13): **Estação** (`text`), **Cartão de assinatura** (`select`), **Reconhecimento** (`select`), **Autenticação** (`select`), **Termo de comparecimento** (`select`), **Abertura de pedido** (`select`), **Comprovante de pagamento** (`select`), **Reconhecimento** (`select`), **Outros serviços** (`select`), **Escrevente** (`select`), **Quantidade de pedidos** (`number`), **Quantidade de pagamentos** (`number`), **Escrevente padrão** (`select`)
    - **Sequência** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-sequencia.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (22): **inputUltimaSequenciaOficios** (`number`), **inputUltimaSequenciaSinalPublico** (`number`), **inputUltimaSequenciaPedidoFirmas** (`number`), **__/__/____** (`text`), **inputUltimaSequenciaMensalista** (`number`), **inputUltimaSequenciaTermo** (`number`), **inputUltimaSequenciaRecibo** (`number`), **inputNossoNumero** (`number`), **inputFatura** (`number`), **inputArquivoRemessa** (`number`), **inputUltimaSequenciaOrcamento** (`number`), **inputUltimaSequenciaProtocolo** (`number`), **Utilizar sequência única** (`checkbox`), **inputUltimaSequenciaUnicaReciboNotas** (`number`), **inputUltimaSequenciaPedidosCertidao** (`number`), **inputUltimaSequenciaIndiceRetroativo** (`number`), **inputUltimaSequenciaGuia** (`number`), **__/__/____** (`text`), **inputUltimaSequenciaRps** (`number`), **inputSerieRps** (`text`) (+2)
    - **Comunicações** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-comunicacoes.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-comunicacoes-full.png) | altura: 2216px)
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (6): `icon_only`, `icon_only`, `icon_only`, `icon_only`, **Concluir**, **Voltar**
      - Campos (64): **Automática** (`radio`), **Manual** (`radio`), **Online** (`radio`), **Offline** (`radio`), **Notificar por e-mail** (`checkbox`), **Digite e tecle enter** (`text`), **Enviar dados da parte em selos de reconhecimento** (`checkbox`), **Automática** (`radio`), **Manual** (`radio`), **Diário** (`radio`), **Semanal** (`radio`), **Quinzenal** (`radio`), **Horário** (`time`), **Notificar por e-mail** (`checkbox`), **Digite e tecle enter** (`text`), **Token do cartório** (`text`), **Subscription** (`text`), **API Key CNB** (`text`), **Diretório de instalação do Java** (`text`), **Automática** (`radio`) (+44)
    - **Campos obrigatórios** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-campos-obrigatorios.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (5): **Tela** (`select`), **Filtrar campos disponíveis...** (`text`), **inputCheckboxMarcarTodosCampoNaoObrigatorio** (`checkbox`), **Filtrar campos obrigatórios...** (`text`), **inputCheckboxMarcarTodosCampoObrigatorio** (`checkbox`)
      - Tabela 1: [**Campos disponíveis**] (0 linha(s))
      - Tabela 2: [**Campos obrigatórios**] (0 linha(s))
    - **Painel de atalhos** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-painel-de-atalhos.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (1): **Tela** (`select`)
      - Tabela 1: [**Função**, **Base**, **Atalho**, **Complemento**] (0 linha(s))
    - **Pedido de firmas** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-pedido-de-firmas.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (31): **Todos os dedos** (`radio`), **Um dedo** (`radio`), **Por comparação** (`radio`), **Por pesquisa** (`radio`), **Automática** (`radio`), **Manual** (`radio`), **Sequência única** (`radio`), **Diário** (`radio`), **Anual** (`radio`), **Completo** (`radio`), **Campos básicos** (`radio`), **Não incluir imagens** (`checkbox`), **Gerar pedido utilizando senha** (`checkbox`), **Manter o pedido em tela após conclusão** (`checkbox`), **Exibir rotina de caixa na conclusão do pedido** (`checkbox`), **Manter a tela do caixa aberta após concluir o pagamento** (`checkbox`), **Divisão automática de etiquetas** (`checkbox`), **inputTotalDeFolhas** (`number`), **inputTermosPorPagina** (`number`), **inputTermosDeAbertura** (`number`) (+11)
    - **Comissões e mensalistas** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-comissoes-e-mensalistas.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (17): **No momento que concluir o pedido** (`radio`), **No momento que for realizado o pagamento** (`radio`), **Não utilizar comissão** (`radio`), **Taxa para cálculo** (`select`), **No momento que lavrar o ato** (`radio`), **No momento que for realizado o pagamento** (`radio`), **Não utilizar comissão** (`radio`), **Taxa para cálculo** (`select`), **No momento que concluir o pedido** (`radio`), **No momento que for realizado o pagamento** (`radio`), **Não utilizar comissão** (`radio`), **Taxa para cálculo** (`select`), **No momento que lavrar o ato** (`radio`), **Não utilizar comissão** (`radio`), **Taxa para cálculo** (`select`), **Automática** (`radio`), **Manual** (`radio`)
    - **E-mail** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-e-mail.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (4): **Diariamente** (`radio`), **Semanalmente** (`radio`), **Mensalmente** (`radio`), **Digite e tecle enter** (`text`)
    - **Faturamento** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-faturamento.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (30): **Utilizar cobrança por boleto bancário** (`checkbox`), **URL conexão - geração boleto** (`text`), **Sistema de geração** (`select`), **O extrato será enviado juntamente com o boleto bancário** (`checkbox`), **inputTextoSuperior** (`text`), **inputTextoSuperior** (`text`), **Cedente** (`texte`), **Banco** (`select`), **CNAB** (`select`), **inputTextoSuperior** (`text`), **Pessoa física** (`radio`), **Pessoa jurídica** (`radio`), **CNPJ** (`text`), **Carteira** (`select`), **CEP** (`text`), **Logradouro** (`text`), **Número** (`text`), **Complemento** (`text`), **Bairro** (`text`), **UF** (`select`) (+10)
    - **Protocolo** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-protocolo.png) | [Full Page](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-protocolo-full.png) | altura: 1151px)
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (5): `halflings halflings-minus`, `halflings halflings-plus`, `glyphicons glyphicons-search`, **Concluir**, **Voltar**
      - Campos (29): **Valor mínimo para enquadramento no COAF** (`text`), **Total de atos** (`checkbox`), **ITBI** (`checkbox`), **Registros de Imóveis** (`checkbox`), **Outros serviços** (`checkbox`), **Necessário autorização para emissão do recibo (nota).** (`checkbox`), **Enviar e-mail ao escrevente no momento que foi autorizado a impressão do recibo (nota).** (`checkbox`), **Preenchimento automático: Data Alienação** (`checkbox`), **Utiliza controle de caixa no módulo de notas.** (`checkbox`), **Utiliza confirmação de pagamento (crédito).** (`checkbox`), **Manter a tela do caixa de notas aberta após concluir o pagamento** (`checkbox`), **Lançar movimento no caixa somente com confirmação** (`checkbox`), **Enviar e-mail ao escrevente informando a confirmação do pagamento** (`checkbox`), **Utiliza assistente** (`checkbox`), **Validar campos obrigatórios** (`checkbox`), **Validação em tempo real** (`checkbox`), **Validar campos obrigatórios** (`select`), **Utiliza controle de estoque em notas** (`checkbox`), **tipoConsumoPapelSeguranca** (`select`), **Categoria** (`select`) (+9)
    - **Certidão** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-certidao.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (7): `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-plus`, **Concluir**, **Voltar**
      - Campos (17): **Utiliza pedidos de certidão** (`checkbox`), **Utiliza controle de estoque em notas** (`checkbox`), **Previsão de entrega** (`text`), **tipoConsumoPapelSegurancaCertidao** (`select`), **Qtd. na busca** (`number`), **Categoria** (`select`), **Produto** (`select`), **Padrão** (`checkbox`), **Categoria** (`select`), **Produto** (`select`), **Padrão** (`checkbox`), **Categoria** (`select`), **Produto** (`select`), **Padrão** (`checkbox`), **Categoria** (`select`), **Produto** (`select`), **Padrão** (`checkbox`)
    - **Editor** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-editor.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (9): `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-minus`, `halflings halflings-plus`, `icon_only`, **Concluir**, **Voltar**
      - Campos (54): **tipoPermissaoLivro** (`select`), **tipoPermissaoTraslado** (`select`), **tipoPermissaoMinuta** (`select`), **Não gerar minuta** (`checkbox`), **Edição de variáveis em minuta** (`checkbox`), **Mescla do Traslado pelo Livro** (`checkbox`), **Emissão de traslado mediante liberação** (`checkbox`), **selectModeloEditorEspecie148** (`select`), **selectModeloEditorAtoFisicoLivro148** (`select`), **selectModeloEditorAtoEletronicoLivro148** (`select`), **selectModeloEditorAtoHibridoLivro148** (`select`), **selectModeloEditorAtoFisicoTraslado148** (`select`), **selectModeloEditorAtoEletronicoTraslado148** (`select`), **selectModeloEditorAtoHibridoTraslado148** (`select`), **selectModeloEditorAtoDigitalTraslado148** (`select`), **selectModeloEditorEspecie215** (`select`), **selectModeloEditorAtoFisicoLivro215** (`select`), **selectModeloEditorAtoEletronicoLivro215** (`select`), **selectModeloEditorAtoHibridoLivro215** (`select`), **selectModeloEditorAtoFisicoTraslado215** (`select`) (+34)
    - **Produtos Orion** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-produtos-orion.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (10): **Comunicar**, **Importar fornecedores**, **Testar conexão**, **Configurar natureza**, **Configurar participação**, **Configurar status**, **Sincronizar logradouro**, **Resetar conexão**, **Concluir**, **Voltar**
      - Campos (12): **Ativar integração** (`checkbox`), **Usuário** (`text`), **Senha** (`password`), **Horário** (`time`), **Digite e tecle enter** (`text`), **Ativar integração** (`checkbox`), **CartFlow** (`radio`), **E-recepção** (`radio`), **Usuário** (`text`), **Senha** (`password`), **Ativar integração com o SGA** (`checkbox`), **Ativar integração com o SGA** (`select`)
    - **Inteligência Artificial** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-inteligencia-artificial.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (2): **Concluir**, **Voltar**
      - Campos (33): **Ativar integração** (`checkbox`), **IA** (`select`), **Api Key** (`text`), **Model** (`select`), **Prioridade de processamento** (`select`), **Ativar integração** (`checkbox`), **IA** (`select`), **Api Key** (`text`), **Model** (`select`), **Prioridade de processamento** (`select`), **Ativar integração** (`checkbox`), **IA** (`select`), **Api Key** (`text`), **Model** (`select`), **Prioridade de processamento** (`select`), **Ativar integração** (`checkbox`), **IA** (`select`), **Api Key** (`text`), **Model** (`select`), **Prioridade de processamento** (`select`) (+13)
    - **WhatsApp** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-whatsapp.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (6): **Testar conexão Z-API**, **Testar conexão Meta**, **Testar conexão ChatPRO**, **Aplicar**, **Concluir**, **Voltar**
      - Campos (26): **ID da instância (Instance ID)** (`text`), **Token da instância (Instance Token)** (`text`), **Token de segurança da conta (Cliente Token)** (`text`), **16999999999** (`text`), **ID do número de telefone (Phone Number ID)** (`text`), **ID da conta do WhatsApp Business (Business Account ID)** (`text`), **Token de acesso (Access Token)** (`text`), **16999999999** (`text`), **Código da instância (Instance Code)** (`text`), **Token** (`text`), **16999999999** (`text`), **plataformaPadraoWhatsApp** (`select`), **Sem rótulo** (`select`), **Nome do template (Meta)** (`text`), **Sem rótulo** (`select`), **Nome do template (Meta)** (`text`), **Sem rótulo** (`select`), **Nome do template (Meta)** (`text`), **Sem rótulo** (`select`), **Nome do template (Meta)** (`text`) (+6)
    - **Impressão** (status: `captured` | abertura: `tab` | [Print](../auditoria/mapeamento-telas/nivel-2/configuracoes/110-configuracoes-parametrizacoes__tab-impressao.png))
      - Abas internas: **Geral**, **Captura e digitalização**, **Parâmetros por estação**, **Sequência**, **Comunicações**, **Campos obrigatórios**, **Painel de atalhos**, **Pedido de firmas**, **Comissões e mensalistas**, **E-mail**, **Faturamento**, **Protocolo**, **Certidão**, **Editor**, **Produtos Orion**, **Inteligência Artificial**, **WhatsApp**, **Impressão**
      - Botões (5): **Ver / Editar**, **Ver / Editar**, **Ver / Editar**, **Concluir**, **Voltar**
      - Campos (2): **Quantidade de folhas** (`number`), **Assinatura** (`select`)

## Módulo: Olá, [usuário] (5 tela(s))

### [111] Olá, [usuário] > Alterar senha

- **Status:** `captured` | **Abertura:** `route` | **Rota:** `#/usuario/alterarsenha` | **Título:** Alteração de senha
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/ola-usuario/111-ola-usuario-alterar-senha.png)
- **Cabeçalhos:** **Alteração de senha**
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões (1):**
  - **Concluir** — desabilitado | mutação
- **Campos / Filtros (3):**
  - **Senha atual** (tipo: `password` | obrigatório)
  - **Nova senha** (tipo: `password` | obrigatório)
  - **Confirmar nova senha** (tipo: `password` | obrigatório)
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [112] Olá, [usuário] > Fale conosco

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** OrionTN - Calendário
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/ola-usuario/112-ola-usuario-fale-conosco.png)
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [113] Olá, [usuário] > Autenticação em dois fatores

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** OrionTN - Calendário
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/ola-usuario/113-ola-usuario-autenticacao-em-dois-fatores.png)
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [114] Olá, [usuário] > Cadastrar biometria

- **Status:** `captured` | **Abertura:** `modal` | **Rota:** `#/inicio` | **Título:** OrionTN - Calendário
- **Prints:** [Viewport](../auditoria/mapeamento-telas/nivel-1/ola-usuario/114-ola-usuario-cadastrar-biometria.png)
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma
- **Nível 2 — Status:** `no_substates` | **Sub-estados:** 0

### [115] Olá, [usuário] > Sair

- **Status:** `skipped` | **Abertura:** `unknown` | **Rota:** `N/A` | **Título:** N/A
- **Prints:** _Nenhuma print registrada_
- **Erro/Observação:** logout_safety_block
- **Abas:** Nenhuma
- **Accordions:** Nenhum
- **Botões:** Nenhum
- **Campos / Filtros:** Nenhum
- **Tabelas:** Nenhuma

## Dicionário Consolidado de Ícones (`iconDictionary`)

| Classe do Ícone | Significados | Tooltips Observados | Telas |
|---|---|---|---|
| `glyphicon-plus` | **Adicionar**, **Gerar**, **Importar fornecedores**, **Informações**, **Novo cartão** | "Adicionar", "Adicionar Divisor", "Adicionar Serviço Interno", "Adicionar aquisição", "Adicionar bonus", "Adicionar categoria", "Adicionar ficha", "Adicionar filial", "Adicionar forma de pagamento", "Adicionar grupo", "Adicionar grupo de item", "Adicionar impedimento", "Adicionar intermediador", "Adicionar item", "Adicionar livro", "Adicionar mensalista", "Adicionar orcamento", "Adicionar outro serviço", "Adicionar participação", "Adicionar produto", "Adicionar reconhecimento de firmas", "Adicionar sinal público", "Adicionar tipo de movimentação financeira", "Adicionar um modelo comunicação", "Adicionar unidade de medida", "Adicionar vigência", "Cadastro de pedido de certidão", "Cadastro de protocolo", "Gerar arquivo de comunicação", "Importar fornecedores", "Mais informações" | [006] Firmas > Reconhecimento de firmas (root); [007] Firmas > Consultas > Reconhecimentos de firmas (modal:Adicionar, root); [009] Firmas > Cadastros > Cartão de assinatura (modal:Adicionar, root); [010] Firmas > Cadastros > Sinal público (root); [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento (root); [015] Notas > Orçamento completo (view:Informações); [020] Notas > Consultas > Orçamentos (root); [021] Notas > Consultas > Protocolos (root); (+54 telas) |
| `halflings-plus` | **Adicionar**, **Adicionar pagamento**, **Adicionar participante** | "Adicionar", "Adicionar pagamento", "Adicionar participante" | [001] Dashboard > Atos Protocolares (modal:+ Novo protocolo); [009] Firmas > Cadastros > Cartão de assinatura (modal:Adicionar); [010] Firmas > Cadastros > Sinal público (modal:Adicionar); [014] Notas > Novo protocolo (root); [017] Notas > Nova certidão e serviço (root); [021] Notas > Consultas > Protocolos (modal:Adicionar); [023] Notas > Consultas > Certidões e serviços (modal:Adicionar); [050] Administração > Controle de Estoque > Aquisição (modal:Adicionar); (+8 telas) |
| `halflings-remove` | **Excluir**, **Fechar** | "Excluir modelos" | [025] Relatórios > Fechamento de caixa (root); [026] Relatórios > PEX - TJ/SP (root); [027] Relatórios > PEX Selos - TJ/SP (root); [028] Relatórios > Recolhimento diário (root); [029] Relatórios > Atos Incompletos (root); [030] Relatórios > Demonstrativo financeiro dos selos digitais (root); [031] Relatórios > Recolhimento resumido (root); [032] Relatórios > Índice por livro (root); (+7 telas) |
| `halflings-filter` | **Filtrar**, **Filtros** | "Digite algo para pesquisar", "Preencha o campo "Pesquisar por tipo de documento" antes de prosseguir" | [001] Dashboard > Atos Protocolares (root, view:Kanban); [073] Configurações > Modelos de impressão > Listagens diversas (root); [083] Configurações > Cadastros auxiliares > Banco (root); [095] Configurações > Cadastros auxiliares > Pessoa física > Estado civil (root); [098] Configurações > Cadastros auxiliares > Pessoa física > Profissão (root); [099] Configurações > Cadastros auxiliares > Pessoa física > Regime de bens (root); [103] Configurações > Cadastros auxiliares > Tipo de documento (root); [109] Configurações > Usuários (root) |
| `halflings-minus` | **Excluir**, **Remover pagamento** | "Excluir", "Remover pagamento" | [051] Administração > Controle de Estoque > Distribuição (root); [052] Administração > Controle de Estoque > Consumo manual (modal:Adicionar, root); [063] Administração > Mensalistas > Lançamentos manuais (modal:Adicionar pagamento); [110] Configurações > Parametrizações (tab:Captura e digitalização, tab:Certidão, tab:Editor, tab:Protocolo) |
| `halflings-open-file` | **Auditar**, **Auditoria** | "Auditar" | [044] Administração > Comunicações > Auditoria de Selos (root); [045] Administração > Comunicações > Selo digital (grid_row, root); [048] Administração > Comunicações > Auditoria de RPS (root) |
| `fa-clipboard-list` | _N/A_ | _N/A_ | [073] Configurações > Modelos de impressão > Listagens diversas (grid_row); [108] Configurações > Perfis e permissões de acesso (grid_row) |
| `fa-fingerprint` | **Buscar biometria** | _N/A_ | [006] Firmas > Reconhecimento de firmas (root); [007] Firmas > Consultas > Reconhecimentos de firmas (modal:Adicionar) |
| `fa-robot` | **Preencher aquisicão usando I.A.**, **Preencher cartão usando I.A.** | _N/A_ | [009] Firmas > Cadastros > Cartão de assinatura (modal:Adicionar); [050] Administração > Controle de Estoque > Aquisição (modal:Adicionar) |
| `fa-chevron-left` | **Anterior** | "Anterior" | [069] Administração > Calendário (root) |
| `fa-chevron-right` | **Próximo** | "Próximo" | [069] Administração > Calendário (root) |
| `halflings-align-justify` | **Por comunicação** | _N/A_ | [003] Dashboard > Comunicações (root, view:Por comunicação, view:Visão Geral) |
| `halflings-download-alt` | **Exportar relatório** | _N/A_ | [046] Administração > Comunicações > RPS (root) |
| `halflings-export` | **Exportar** | "Exportar modelos" | [073] Configurações > Modelos de impressão > Listagens diversas (root) |
| `halflings-list` | **Kanban** | _N/A_ | [001] Dashboard > Atos Protocolares (root, view:Dashboard, view:Kanban) |
| `halflings-th` | **Visão Geral** | _N/A_ | [003] Dashboard > Comunicações (root, view:Por comunicação, view:Visão Geral) |
| `halflings-th-list` | **Dashboard** | _N/A_ | [001] Dashboard > Atos Protocolares (root, view:Dashboard, view:Kanban) |
