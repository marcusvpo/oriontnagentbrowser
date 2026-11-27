# Cruzamento Editorial × Orion TN (Nível 1 vs Nível 2 — V2)

- **Versão do Catálogo:** 06.05.02 (Nível 2) | **Capturado em:** 2026-11-26T03:56:29.150Z
- **Rotinas Analisadas:** 471
- **Termos em Negrito Extraídos:** 5489 ocorrências (2224 termos únicos normalizados)
- **Limiar Sørensen-Dice:** 0.65

## 1. Comparativo Nível 1 (Superfície) vs Nível 2 (Superfície + Sub-estados)

| Métrica | Nível 1 (Superfície) | Nível 2 (Completo) | Variação |
|---|---:|---:|---:|
| Termos Únicos na UI | 850 | 1644 | +794 |
| Encontrados Literalmente | 223 (10.0%) | 300 (13.5%) | +77 |
| Candidatos Similares (>= 0.65) | 454 (20.4%) | 561 (25.2%) | +107 |
| Não Encontrados | 1547 (69.6%) | 1363 (61.3%) | -184 |

### Resgate de Termos Ocultos (Antes "Não Encontrados na Superfície")

- **Total de termos resgatados literalmente no Nível 2:** 52
- **Total de termos resgatados como similares no Nível 2:** 132
- **Termos promovidos de Similar (Nível 1) para Literal (Nível 2):** 25
- **Distribuição dos resgates literais por sub-estado:** Abas: **15** | Accordions/Filtros: **2** | Modais/Formulários: **33** | Ações de Grade: **0** | Superfície/Ícones: **0** | Alternadores de Visão: **3**

## 2. Termos Resgatados no Nível 2 (Encontrados em Abas, Accordions, Modais ou Ações de Grade)

| # | Termo no Manual | Ocorrências | Rotinas | Onde foi Encontrado (`where`) | Tela Exemplo |
|---|---|---:|---:|---|---|
| 1 | **Número do Livro** | 7 | 7 | `accordion:Mais filtros, modal:Adicionar` | [008] Firmas > Consultas > Serviços praticados |
| 2 | **DOI** | 7 | 6 | `view:Por comunicação` | [003] Dashboard > Comunicações |
| 3 | **Sim** | 7 | 6 | `modal:Adicionar` | [081] Configurações > Tabela de custas > Vigências |
| 4 | **NÃO** | 5 | 4 | `modal:Adicionar` | [081] Configurações > Tabela de custas > Vigências |
| 5 | **Hash** | 5 | 3 | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 6 | **Sem valor fixo** | 5 | 2 | `modal:Adicionar` | [091] Configurações > Cadastros auxiliares > Outros serviços |
| 7 | **Salvar Alterações** | 4 | 4 | `tab:Cálculos` | [079] Configurações > Tabela de custas > Parâmetros |
| 8 | **Testar Conexão** | 4 | 4 | `tab:Produtos Orion` | [110] Configurações > Parametrizações |
| 9 | **Depósito Prévio** | 4 | 3 | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 10 | **IA** | 4 | 2 | `tab:Inteligência Artificial` | [110] Configurações > Parametrizações |
| 11 | **Cabeçalho:** | 3 | 3 | `tab:Impressão` | [110] Configurações > Parametrizações |
| 12 | **CESDI** | 3 | 2 | `modal:Adicionar` | [089] Configurações > Cadastros auxiliares > Natureza |
| 13 | **Online** | 3 | 2 | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 14 | **Capturar** | 2 | 2 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 15 | **Desconto (%)** | 2 | 2 | `modal:Adicionar` | [062] Administração > Mensalistas > Filiais |
| 16 | **Inscrição Estadual** | 2 | 2 | `modal:Adicionar` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 17 | **Outorgado** | 2 | 2 | `modal:Adicionar` | [092] Configurações > Cadastros auxiliares > Participação |
| 18 | **Outorgante** | 2 | 2 | `modal:Adicionar` | [092] Configurações > Cadastros auxiliares > Participação |
| 19 | **Percentual** | 2 | 2 | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 20 | **Autenticação** | 2 | 1 | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 21 | **Principal** | 2 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 22 | **"Em andamento"** | 1 | 1 | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 23 | **Carteira** | 1 | 1 | `tab:Faturamento` | [110] Configurações > Parametrizações |
| 24 | **Client ID** | 1 | 1 | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 25 | **Client Secret** | 1 | 1 | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 26 | **CNH** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 27 | **Consumir** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 28 | **Copiar** | 1 | 1 | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 29 | **Enviar alerta de estoque mínimo** | 1 | 1 | `modal:Adicionar` | [054] Administração > Controle de Estoque > Cadastros > Categoria |
| 30 | **Exige dados bancários** | 1 | 1 | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 31 | **Física** | 1 | 1 | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 32 | **Informar quantidade de atos** | 1 | 1 | `modal:Adicionar` | [054] Administração > Controle de Estoque > Cadastros > Categoria |
| 33 | **Mãe** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 34 | **Nascimento** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 35 | **negrito** | 1 | 1 | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 36 | **Nota Fiscal** | 1 | 1 | `modal:Adicionar` | [050] Administração > Controle de Estoque > Aquisição |
| 37 | **O extrato será enviado juntamente com o boleto bancário** | 1 | 1 | `tab:Faturamento` | [110] Configurações > Parametrizações |
| 38 | **Offline** | 1 | 1 | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 39 | **Página Inicial** | 1 | 1 | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 40 | **Pós-pago** | 1 | 1 | `modal:Adicionar` | [062] Administração > Mensalistas > Filiais |
| 41 | **Pré-pago** | 1 | 1 | `modal:Adicionar` | [062] Administração > Mensalistas > Filiais |
| 42 | **Preencher cartão usando I.A.** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 43 | **Procurador** | 1 | 1 | `modal:Adicionar` | [107] Configurações > Cadastros auxiliares > Tipo de representante |
| 44 | **RCTO** | 1 | 1 | `modal:Adicionar` | [089] Configurações > Cadastros auxiliares > Natureza |
| 45 | **recebido** | 1 | 1 | `modal:Adicionar` | [010] Firmas > Cadastros > Sinal público |
| 46 | **SEFAZ - ITCMD** | 1 | 1 | `view:Por comunicação` | [003] Dashboard > Comunicações |
| 47 | **Tela** | 1 | 1 | `tab:Campos obrigatórios, tab:Painel de atalhos` | [110] Configurações > Parametrizações |
| 48 | **Todos os dedos** | 1 | 1 | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 49 | **Token de Acesso** | 1 | 1 | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 50 | **Utiliza sequência inicial e sequência final** | 1 | 1 | `modal:Adicionar` | [054] Administração > Controle de Estoque > Cadastros > Categoria |
| 51 | **Utiliza série** | 1 | 1 | `modal:Adicionar` | [054] Administração > Controle de Estoque > Cadastros > Categoria |
| 52 | **Utilizar cobrança por boleto bancário** | 1 | 1 | `tab:Faturamento` | [110] Configurações > Parametrizações |

## 3. Termos Promovidos de Similar (Nível 1) para Literal (Nível 2)

| # | Termo no Manual | Ocorrências | Rotinas | Onde foi Encontrado (`where`) | Tela Exemplo |
|---|---|---:|---:|---|---|
| 1 | **Partes** | 39 | 34 | `modal:Adicionar` | [089] Configurações > Cadastros auxiliares > Natureza |
| 2 | **Valor Fixo** | 5 | 3 | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 3 | **Digitalizar** | 4 | 4 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 4 | **Termo de Comparecimento** | 4 | 4 | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 5 | **Valor Unitário** | 4 | 3 | `modal:Adicionar` | [050] Administração > Controle de Estoque > Aquisição |
| 6 | **(Cartão)** | 3 | 3 | `modal:Adicionar` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 7 | **Inutilizado** | 3 | 3 | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 8 | **APLICAR NOS ITENS SELECIONADOS** | 2 | 2 | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 9 | **Forma de cálculo** | 2 | 2 | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 10 | **Forma de Pagamento Padrão** | 2 | 2 | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 11 | **Termo de Abertura** | 2 | 2 | `tab:Impressão` | [110] Configurações > Parametrizações |
| 12 | **Adicionar Participante** | 1 | 1 | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 13 | **Assinatura** | 1 | 1 | `tab:Impressão` | [110] Configurações > Parametrizações |
| 14 | **Consumido** | 1 | 1 | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 15 | **Documentos Apresentados** | 1 | 1 | `modal:Adicionar` | [089] Configurações > Cadastros auxiliares > Natureza |
| 16 | **enviado** | 1 | 1 | `modal:Adicionar` | [010] Firmas > Cadastros > Sinal público |
| 17 | **Estoque mínimo** | 1 | 1 | `modal:Adicionar` | [056] Administração > Controle de Estoque > Cadastros > Produto |
| 18 | **Jurídica** | 1 | 1 | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 19 | **Mais Informações** | 1 | 1 | `view:Informações` | [015] Notas > Orçamento completo |
| 20 | **Pai** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 21 | **Provedor de Pagamento** | 1 | 1 | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 22 | **Representante** | 1 | 1 | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 23 | **Selecionar** | 1 | 1 | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 24 | **Tipo de Modelo** | 1 | 1 | `modal:Adicionar` | [072] Configurações > Modelos de impressão > Enquadramento COAF |
| 25 | **Token do Cartório** | 1 | 1 | `tab:Comunicações` | [110] Configurações > Parametrizações |

## 4. Lista Ouro — Termos Confirmados Inexistentes no Orion TN 06.05.02 (Candidatos `[ATT]` Editoriais)

> Termos abaixo não foram encontrados na superfície nem em nenhum sub-estado explorado (abas, accordions, modais/formulários ou ações de grade), e não possuem candidato similar acima do limiar.

| # | Termo no Manual | Ocorrências | Rotinas | Exemplos de Rotinas |
|---|---|---:|---:|---|
| 1 | **Dica / Caso Real do 0800:** | 370 | 370 | D-1.1, D-1.10, D-1.11, D-1.12, D-1.13, D-1.14, D-1.15, D-1.16 |
| 2 | **Importante:** | 173 | 173 | C-SELO-06, D-1.11, D-1.13, D-1.15, D-1.17, D-1.19, D-1.2, D-1.21 |
| 3 | **Aguardando Pagamento** | 109 | 108 | D-1.1, D-1.10, D-1.11, D-1.12, D-1.13, D-1.14, D-1.15, D-1.16 |
| 4 | **ORION TN** | 102 | 94 | C-ATOS-01, C-ATOS-06, C-CENTRAL-01, C-CENTRAL-02, C-CENTRAL-03, C-CENTRAL-04, C-CENTRAL-06, C-CENTRAL-07 |
| 5 | **IntegradorSPCM** | 46 | 46 | C-FIRMA-01, D-3.24, D-3.3, D-3.4, D-3.55, D-3.67, D-3.7, D-3.72 |
| 6 | **Ctrl + Shift + V** | 40 | 40 | D-3.20, D-3.25, D-3.27, D-3.38, D-3.39, D-3.40, D-3.46, D-3.48 |
| 7 | **+** | 32 | 21 | D-3.11, M-2.0, M-49.0, R-2.0, R-23.0, R-24.0, V-1.0, V-1.1.2 |
| 8 | **Dica:** | 26 | 26 | C-ACESSO-01, C-ACESSO-02, C-ACESSO-03, C-ACESSO-04, C-ACESSO-05, C-ACESSO-06, C-ACESSO-07, C-ACESSO-08 |
| 9 | **Lupa** | 22 | 18 | V-2.2.1, V-3.1.3, V-4.1.4, V-4.1.5, V-4.2.1, V-4.2.2, V-4.3.3, V-4.3.4 |
| 10 | **CPF** | 20 | 19 | C-ACESSO-01, D-2.3, D-3.4, D-3.9, D-6.0, R-1.1, R-10.0, R-2.0 |
| 11 | **Orion Caixa** | 19 | 17 | C-ATOS-01, C-CERT-03, C-FIN-01, C-FIN-03, C-FIN-05, C-FIN-06, C-FIN-07, C-FIN-10 |
| 12 | **Minuta** | 17 | 12 | C-MINUTA-02, C-MINUTA-03, D-3.1, D-3.24, D-3.40, R-1.2, V-7.0.5, V-7.1.2 |
| 13 | **Logoff** | 15 | 15 | C-ACESSO-06, C-FIN-02, D-3.34, D-3.43, D-3.68, M-16.3, M-43.0, M-5.0 |
| 14 | **Atenção:** | 13 | 13 | C-FIN-14, V-2.3.2, V-3.1.2, V-5.1.1, V-7.0.4, V-7.1.2, V-7.3.2, V-7.3.3 |
| 15 | **Notas > Consultas > Protocolos** | 13 | 13 | C-CENTRAL-05, C-CENTRAL-06, C-CENTRAL-09, C-CENTRAL-11, C-CENTRAL-12, C-LIVRO-03, C-LIVRO-06, D-3.35 |
| 16 | **X** | 13 | 12 | D-4.0, V-2.3.1, V-2.3.2, V-3.2.2, V-3.2.5, V-3.2.6, V-3.4.1, V-4.2.3 |
| 17 | **Tab** | 12 | 10 | V-2.2.2, V-2.3.1, V-3.1.2, V-3.1.4, V-3.2.2, V-3.2.4, V-3.4.1, V-4.3.6 |
| 18 | **Canetinha** | 11 | 9 | V-7.1.2, V-7.2.2, V-7.3.3, V-7.4.1, V-7.4.2, V-7.4.3, V-7.5.1, V-7.5.2 |
| 19 | **CNIB** | 11 | 6 | V-7.0.4, V-7.3.1, V-7.4.2, V-7.4.3, V-7.8.1, V-7.8.3 |
| 20 | **Cifrão ($)** | 10 | 6 | D-9.0, R-13.0, R-5.0, V-2.2.3, V-2.3.1, V-3.2.5 |
| 21 | **setinha lateral** | 8 | 7 | V-5.1.1, V-5.1.2, V-5.1.5, V-5.1.6, V-5.2.1, V-5.2.2, V-6.1.3 |
| 22 | **Caneta** | 7 | 7 | V-6.1.5, V-7.1.1, V-7.8.1, V-7.8.3, V-CCA.2.3, V-CCA.3.1, V-CCA.3.2 |
| 23 | **Confirmar** | 7 | 7 | C-GERAL-03, D-9.0, R-10.0, V-4.4.4, V-4.4.5, V-CCA.1.1, V-CCA.3.2 |
| 24 | **Gravar** | 7 | 7 | C-ACESSO-04, C-ACESSO-06, C-ATOS-04, C-FIN-11, C-FIN-13, C-FIN-14, C-FIRMA-08 |
| 25 | **Olho** | 7 | 7 | V-2.4.3, V-6.1.5, V-7.0.3, V-7.4.2, V-7.7.2, V-7.7.3, V-7.8.2 |
| 26 | **Anexos** | 6 | 6 | M-20.0, R-1.6, R-14.0, V-1.0, V-4.3.1, V-CCA.2.2 |
| 27 | **verde** | 6 | 6 | R-12.0, V-3.4.2, V-3.4.5, V-6.2.1, V-7.3.2, V-CCA.2.2 |
| 28 | **Cônjuge** | 5 | 5 | V-4.1.2, V-4.4.2, V-5.1.3, V-6.1.3, V-7.1.3 |
| 29 | **Impressão Definitiva** | 5 | 5 | V-7.0.4, V-7.0.5, V-7.4.3, V-7.5.1, V-7.5.3 |
| 30 | **Nome da Parte** | 5 | 5 | D-3.44, D-3.9, D-6.0, M-56.0, V-4.4.1 |
| 31 | **Novo** | 5 | 5 | C-ACESSO-01, M-14.0, M-51.0, M-51.1, M-54.0 |
| 32 | **Qualificação das Partes** | 5 | 5 | D-3.20, D-3.26, D-5.0, D-6.0, R-1.2 |
| 33 | **QR Code** | 5 | 4 | V-7.2.2, V-7.3.2, V-7.5.1, V-CCA.3.1 |
| 34 | **Total do Ato Notarial** | 5 | 4 | V-1.1.2, V-2.3.2, V-3.2.1, V-3.2.6 |
| 35 | **Administração > Comunicações > COAF** | 4 | 4 | C-CENTRAL-01, C-CENTRAL-10, R-12.0, R-32.0 |
| 36 | **Boas Práticas:** | 4 | 4 | C-ATOS-02, C-CENTRAL-05, C-FIN-02, C-SELO-07 |
| 37 | **caixa de seleção (checkbox)** | 4 | 4 | D-6.0, V-7.3.3, V-7.5.1, V-7.5.2 |
| 38 | **Compra e Venda** | 4 | 4 | M-51.1, M-51.2, V-4.1.2, V-7.6.1 |
| 39 | **Configurações > Modelos de impressão > Etiquetas diversas** | 4 | 4 | M-42.0, M-69.0, M-70.0, M-70.1 |
| 40 | **Inventário e Partilha** | 4 | 4 | C-ATOS-05, M-51.1, M-51.2, R-37.0 |
| 41 | **Número do Recibo** | 4 | 4 | R-29.0, V-3.4.4, V-4.4.5, V-6.2.3 |
| 42 | **Salvar Minuta** | 4 | 4 | C-MINUTA-01, D-3.38, D-3.39, D-3.40 |
| 43 | **vermelho** | 4 | 4 | V-3.1.1, V-4.1.3, V-4.4.2, V-7.2.1 |
| 44 | **DESCRIÇÃO DA SEÇÃO:** | 4 | 3 | M-70.1, R-38.0, V-CCA.3.3 |
| 45 | **Preenchimento com IA** | 4 | 3 | V-4.2.5, V-4.3.3, V-4.3.4 |
| 46 | **Reutilizar selo** | 4 | 3 | M-12.0, M-14.3, V-CCA.3.1 |
| 47 | **Sobrescrever:** | 4 | 3 | V-4.2.5, V-7.0.1, V-7.7.2 |
| 48 | **CGI** | 4 | 2 | V-4.4.2, V-4.4.5 |
| 49 | **Desistência** | 4 | 2 | V-2.4.2, V-2.4.4 |
| 50 | **ONR** | 4 | 2 | V-4.4.2, V-7.5.2 |
| 51 | **Inserir Arquivo** | 4 | 1 | V-7.1.2 |
| 52 | **Administração > Cadastros auxiliares > Área de atuação** | 3 | 3 | M-41.0, M-67.0, M-68.0 |
| 53 | **Administração > Controle de Caixa > Suprimento e Sangria** | 3 | 3 | D-1.20, D-1.21, D-1.22 |
| 54 | **Agilidade:** | 3 | 3 | C-ATOS-05, C-CENTRAL-08, C-MINUTA-01 |
| 55 | **Alienantes e Adquirentes** | 3 | 3 | V-5.1.3, V-5.2.1, V-5.2.2 |
| 56 | **Concluir Pagamento** | 3 | 3 | D-1.23, D-1.24, D-3.52 |
| 57 | **Corregedoria:** | 3 | 3 | C-FIN-12, C-FIRMA-02, C-LIVRO-01 |
| 58 | **Dados do Imóvel** | 3 | 3 | D-3.21, D-3.43, V-5.2.1 |
| 59 | **Débito** | 3 | 3 | M-4.0, M-57.0, M-65.0 |
| 60 | **Endereço Completo** | 3 | 3 | D-1.2, D-2.5, D-3.21 |
| 61 | **Inteiro Teor** | 3 | 3 | D-3.14, D-3.29, M-54.1 |
| 62 | **Manter e Complementar** | 3 | 3 | R-1.3, V-4.2.5, V-4.3.1 |
| 63 | **Notas > Consulta > Orçamentos** | 3 | 3 | V-2.4.2, V-2.4.3, V-2.4.4 |
| 64 | **Notas > Consultas > Consulta de protocolos** | 3 | 3 | V-6.1.4, V-6.1.5, V-6.2.1 |
| 65 | **nova guia** | 3 | 3 | V-4.4.4, V-6.1.3, V-6.2.1 |
| 66 | **Número do Orçamento** | 3 | 3 | M-45.0, V-2.3.3, V-2.4.2 |
| 67 | **Papel de Segurança** | 3 | 3 | D-3.36, D-3.42, M-16.12 |
| 68 | **Prévia do Livro** | 3 | 3 | V-7.0.4, V-7.2.1, V-7.3.3 |
| 69 | **Salvar e Imprimir** | 3 | 3 | D-3.4, M-29.0, M-46.0 |
| 70 | **Seta Lateral** | 3 | 3 | V-4.1.1, V-4.1.3, V-4.3.3 |
| 71 | **Suporte Siplan:** | 3 | 3 | C-ATOS-08, C-FIN-04, C-SELO-02 |
| 72 | **TJ (Tribunal de Justiça)** | 3 | 3 | V-3.4.4, V-3.4.6, V-7.3.2 |
| 73 | **Um Terço (1/3)** | 3 | 3 | V-1.1.1, V-2.2.2, V-3.2.1 |
| 74 | **Valor do Negócio** | 3 | 3 | D-3.21, M-46.0, M-51.4 |
| 75 | **vermelha** | 3 | 3 | R-12.0, V-7.0.1, V-7.7.1 |
| 76 | **Remesclar** | 3 | 2 | V-7.7.1, V-7.7.2 |
| 77 | **Traslado Digital** | 3 | 1 | V-7.5.2 |
| 78 | **100%** | 2 | 2 | V-5.1.3, V-6.1.3 |
| 79 | **Aberto** | 2 | 2 | M-21.0, M-45.0 |
| 80 | **Administração > Comissões > Planos** | 2 | 2 | M-5.0, M-6.0 |
| 81 | **Administração > Comunicações > Outras comunicações** | 2 | 2 | C-CENTRAL-08, R-11.0 |
| 82 | **Administração > Controle de Estoque > Distribuição** | 2 | 2 | C-SELO-09, R-23.0 |
| 83 | **Administração > Financeiro > Formas de pagamento** | 2 | 2 | M-30.0, M-31.0 |
| 84 | **Administração > Mensalistas > Filiais** | 2 | 2 | M-48.0, M-49.0 |
| 85 | **Adquirente** | 2 | 2 | D-3.44, V-7.6.2 |
| 86 | **Adquirentes** | 2 | 2 | V-5.1.3, V-5.2.2 |
| 87 | **Advogado** | 2 | 2 | C-CENTRAL-03, V-4.1.2 |
| 88 | **Alerta Operacional:** | 2 | 2 | C-FIN-01, V-7.4.3 |
| 89 | **Alienante** | 2 | 2 | D-3.44, V-7.6.2 |
| 90 | **Alienantes** | 2 | 2 | V-5.1.3, V-5.2.2 |
| 91 | **Alterar Vencimento** | 2 | 2 | D-3.64, M-33.3 |
| 92 | **Arquivos anexos** | 2 | 2 | M-2.0, V-1.0 |
| 93 | **Ata Notarial** | 2 | 2 | M-51.1, M-61.0 |
| 94 | **Autenticidade** | 2 | 2 | D-3.11, R-1.1 |
| 95 | **Avançar** | 2 | 2 | M-70.0, M-9.0 |
| 96 | **Cargo / Função** | 2 | 2 | C-ACESSO-01, C-ACESSO-08 |
| 97 | **Casado** | 2 | 2 | V-4.2.1, V-CCA.1.1 |
| 98 | **CENSEC / SIGNO** | 2 | 2 | R-14.1, V-7.6.1 |
| 99 | **Central de Indisponibilidade** | 2 | 2 | V-7.0.4, V-7.4.2 |
| 100 | **Chamar Senha** | 2 | 2 | C-ACESSO-04, C-ACESSO-05 |
| 101 | **Comarca** | 2 | 2 | D-1.2, D-2.10 |
| 102 | **Configurações > Cadastros auxiliares > Natureza** | 2 | 2 | C-SELO-10, M-61.0 |
| 103 | **Configurações > Cadastros Auxiliares > Naturezas de Atos** | 2 | 2 | C-ATOS-01, C-ATOS-05 |
| 104 | **Configurações > Custas e Emolumentos > Itens da Tabela** | 2 | 2 | C-ATOS-04, C-ATOS-07 |
| 105 | **Configurações > Dados de Cartório** | 2 | 2 | D-1.2, D-2.10 |
| 106 | **Configurações > Modelos de Minutas > Cadastro de Modelos** | 2 | 2 | C-MINUTA-04, C-MINUTA-06 |
| 107 | **Confirmar e Gerar Livro** | 2 | 2 | D-3.27, D-3.41 |
| 108 | **Confirmar Envio** | 2 | 2 | D-3.70, R-15.0 |
| 109 | **Confirmar Gravação** | 2 | 2 | D-3.5, D-3.69 |
| 110 | **Continuar** | 2 | 2 | V-4.4.1, V-4.4.5 |
| 111 | **Ctrl+C** | 2 | 2 | V-4.4.3, V-CCA.1.2 |
| 112 | **Ctrl+V** | 2 | 2 | V-3.4.5, V-4.4.3 |
| 113 | **Custas / Selos** | 2 | 2 | C-SELO-02, C-SELO-05 |
| 114 | **Devolvido com Exigência** | 2 | 2 | R-14.0, R-14.2 |
| 115 | **Dica Operacional:** | 2 | 2 | V-7.4.1, V-7.7.1 |
| 116 | **Dispositivos e Impressoras** | 2 | 2 | C-CONFIG-02, C-CONFIG-04 |
| 117 | **Divórcio / Separação** | 2 | 2 | M-51.2, V-4.1.2 |
| 118 | **Docker Desktop** | 2 | 2 | C-ACESSO-05, C-LIVRO-04 |
| 119 | **DOI / Obrigações Fiscais** | 2 | 2 | C-GERAL-06, C-GERAL-07 |
| 120 | **duplo clique** | 2 | 2 | V-2.2.2, V-3.1.4 |
| 121 | **E-mail (envio de extrato)** | 2 | 2 | M-2.0, M-49.0 |
| 122 | **Editor de Minutas** | 2 | 2 | D-3.38, D-3.39 |
| 123 | **Editor de Texto** | 2 | 2 | V-7.0.2, V-7.0.5 |
| 124 | **Entregue** | 2 | 2 | D-3.67, M-53.0 |
| 125 | **Escrevente Responsável** | 2 | 2 | D-3.19, D-3.67 |
| 126 | **Escritura** | 2 | 2 | M-51.1, M-61.0 |
| 127 | **Estornar Selo** | 2 | 2 | C-SELO-02, C-SELO-05 |
| 128 | **Excluir / Inativar** | 2 | 2 | M-59.0, M-64.0 |
| 129 | **Executar como Administrador** | 2 | 2 | C-CONFIG-05, C-CONFIG-07 |
| 130 | **Exigir troca no próximo logon** | 2 | 2 | C-ACESSO-01, C-ACESSO-03 |
| 131 | **F2** | 2 | 2 | M-14.0, M-16.7 |
| 132 | **F5** | 2 | 2 | R-32.1, R-4.0 |
| 133 | **Finalizar e Emitir Selo Digital** | 2 | 2 | C-CERT-01, C-CERT-03 |
| 134 | **Financeiro** | 2 | 2 | C-FIN-09, M-58.0 |
| 135 | **Firmas > Balcão de Firmas** | 2 | 2 | R-1.1, R-2.0 |
| 136 | **Firmas > Comunicações > Gerar lote SEFAZ** | 2 | 2 | M-32.1, M-32.3 |
| 137 | **Gerar Livro Definitivo** | 2 | 2 | D-3.27, D-3.41 |
| 138 | **Gerenciador de Tarefas** | 2 | 2 | C-CONFIG-06, C-CONFIG-07 |
| 139 | **Gravar Metadados da DOI** | 2 | 2 | C-CENTRAL-06, C-GERAL-06 |
| 140 | **Guichê de Atendimento** | 2 | 2 | C-ACESSO-04, D-1.12 |
| 141 | **Homologação** | 2 | 2 | M-16.5, V-CCA.3.1 |
| 142 | **Impressora Padrão de Recibos** | 2 | 2 | C-CONFIG-04, D-1.9 |
| 143 | **Índice Notarial** | 2 | 2 | C-ATOS-02, V-7.6.1 |
| 144 | **Informações Complementares** | 2 | 2 | M-51.1, M-51.2 |
| 145 | **Inserir** | 2 | 2 | V-7.2.3, V-7.4.2 |
| 146 | **Justificativa Legal** | 2 | 2 | C-LIVRO-01, C-SELO-06 |
| 147 | **Liberar Lock de Registro** | 2 | 2 | C-ATOS-08, C-GERAL-08 |
| 148 | **Limpar Dados** | 2 | 2 | C-CERT-05, C-GERAL-08 |
| 149 | **Login** | 2 | 2 | C-FIN-02, V-CCA.2.3 |
| 150 | **Lupinha de Busca** | 2 | 2 | V-6.2.3, V-6.2.4 |
| 151 | **Marcar como Lido** | 2 | 2 | D-3.50, D-3.71 |
| 152 | **Minuta / Editor** | 2 | 2 | C-MINUTA-01, C-MINUTA-05 |
| 153 | **Minutas** | 2 | 2 | V-7.6.2, V-7.8.1 |
| 154 | **Modalidade de Cobrança** | 2 | 2 | C-CERT-01, M-16.11 |
| 155 | **Natureza do Negócio Jurídico** | 2 | 2 | C-GERAL-01, D-3.13 |
| 156 | **Norma Notarial:** | 2 | 2 | C-FIN-07, C-SELO-05 |
| 157 | **Notas > Cadastros auxiliares > Documento apresentado** | 2 | 2 | M-36.0, M-37.0 |
| 158 | **Notas > Cadastros auxiliares > Perfil de partes** | 2 | 2 | M-43.0, M-44.0 |
| 159 | **Notas > Cadastros auxiliares > Situação do protocolo** | 2 | 2 | M-38.0, M-39.0 |
| 160 | **Notas > Cadastros auxiliares > Tipos de anexo** | 2 | 2 | M-34.0, M-35.0 |
| 161 | **Notas > Consultas > Consulta Avançada de Protocolos** | 2 | 2 | D-3.24, D-3.43 |
| 162 | **Notas > Consultas > Consulta de Certidões e Serviços** | 2 | 2 | D-3.17, D-3.18 |
| 163 | **Observação Importante:** | 2 | 2 | V-7.0.5, V-7.8.3 |
| 164 | **Operador** | 2 | 2 | D-1.16, R-29.0 |
| 165 | **Organização:** | 2 | 2 | C-CENTRAL-04, C-FIN-10 |
| 166 | **Outorgado Comprador** | 2 | 2 | V-4.1.2, V-7.0.1 |
| 167 | **Outros Serviços / Valores Extranotariais** | 2 | 2 | V-3.2.6, V-3.2.7 |
| 168 | **Outros Valores / Valores Extranotariais** | 2 | 2 | V-1.1.2, V-2.3.2 |
| 169 | **Painel de Controle** | 2 | 2 | C-CONFIG-02, C-CONFIG-04 |
| 170 | **Período de Consulta** | 2 | 2 | D-1.15, D-1.18 |
| 171 | **Prevenção:** | 2 | 2 | C-FIN-09, C-SELO-04 |
| 172 | **Qualificação de Partes** | 2 | 2 | M-51.1, M-51.3 |
| 173 | **Receita Federal** | 2 | 2 | R-1.3, V-4.3.1 |
| 174 | **Reconhecimento por autenticidade** | 2 | 2 | M-14.2, M-29.0 |
| 175 | **Registrado** | 2 | 2 | R-14.0, R-14.2 |
| 176 | **Regra de Validação:** | 2 | 2 | V-5.1.3, V-6.1.2 |
| 177 | **Remover** | 2 | 2 | M-25.0, M-5.0 |
| 178 | **Reprográfica** | 2 | 2 | D-3.14, D-3.29 |
| 179 | **Restaurar Versão** | 2 | 2 | C-MINUTA-03, V-7.5.4 |
| 180 | **Reutilizar** | 2 | 2 | D-4.0, V-CCA.2.3 |
| 181 | **Semelhança** | 2 | 2 | D-3.11, R-1.1 |
| 182 | **SGA** | 2 | 2 | D-3.11, D-3.72 |
| 183 | **Sobrescrever Todos os Dados** | 2 | 2 | R-1.3, V-4.3.1 |
| 184 | **Solteiro** | 2 | 2 | V-4.2.1, V-CCA.1.1 |
| 185 | **Status no TJ** | 2 | 2 | D-3.37, D-3.53 |
| 186 | **Supervisor** | 2 | 2 | V-7.5.3, V-CCA.2.3 |
| 187 | **União Estável** | 2 | 2 | C-ATOS-06, M-51.1 |
| 188 | **Valor do ITBI** | 2 | 2 | V-1.1.2, V-3.2.3 |
| 189 | **50%** | 2 | 1 | V-5.1.3 |
| 190 | **Aguardando retificação** | 2 | 1 | M-15.0 |
| 191 | **Barra Superior** | 2 | 1 | R-1.4 |
| 192 | **Cadastro do Tomador** | 2 | 1 | V-3.4.2 |
| 193 | **Editando** | 2 | 1 | V-7.5.3 |
| 194 | **Falha** | 2 | 1 | M-15.0 |
| 195 | **Firmas > Cadastros > Sinal público** | 2 | 1 | V-1.0 |
| 196 | **Ícone de Bonequinho** | 2 | 1 | D-5.0 |
| 197 | **Integrador Local** | 2 | 1 | R-32.1 |
| 198 | **Integrador Orion** | 2 | 1 | C-CENTRAL-07 |
| 199 | **LGPD** | 2 | 1 | V-4.4.1 |
| 200 | **Lupa Lateral** | 2 | 1 | V-3.1.2 |
| 201 | **Próximo número** | 2 | 1 | M-16.4 |
| 202 | **Remesclar o documento** | 2 | 1 | V-7.8.3 |
| 203 | **Sócios** | 2 | 1 | V-4.3.4 |
| 204 | **Tabelas** | 2 | 1 | C-GERAL-05 |
| 205 | **TJ** | 2 | 1 | V-4.2.2 |
| 206 | **Todos em CAdES** | 2 | 1 | M-32.3 |
| 207 | **TWAIN** | 2 | 1 | C-CONFIG-05 |
| 208 | **.docx** | 1 | 1 | C-MINUTA-05 |
| 209 | **"+" (Adicionar Novo Pedido)** | 1 | 1 | R-10.0 |
| 210 | **"dou fé"** | 1 | 1 | V-7.1.2 |
| 211 | **[x] Adicionar / Modificar Bens e Imóveis** | 1 | 1 | C-ACESSO-06 |
| 212 | **[x] Alterar Dados da Ficha de Firma** | 1 | 1 | C-FIRMA-03 |
| 213 | **[x] Alterar Protocolos Criados por Outros Usuários do Mesmo Setor** | 1 | 1 | C-ACESSO-06 |
| 214 | **[x] Autorizado a Lavrar Escrituras, Procurações e Atas** | 1 | 1 | C-ACESSO-08 |
| 215 | **[x] Autorizado a Receber Carga de Papéis de Segurança e Selos** | 1 | 1 | C-ACESSO-08 |
| 216 | **[x] Editar Partes, Qualificações e Representantes** | 1 | 1 | C-ACESSO-06 |
| 217 | **[x] Inserir Observações / Alertas no Cartão de Assinatura** | 1 | 1 | C-FIRMA-03 |
| 218 | **[x] Permitir Alteração de Protocolo em Andamento** | 1 | 1 | C-ACESSO-06 |
| 219 | **[x] Permitir Impressão de Extrato Operacional** | 1 | 1 | C-ACESSO-07 |
| 220 | **1/5 das Custas** | 1 | 1 | C-GERAL-05 |
| 221 | **1ª Opção (Dados do Imóvel):** | 1 | 1 | V-5.1.1 |
| 222 | **2ª Opção (Endereço):** | 1 | 1 | V-5.1.1 |
| 223 | **3ª Opção (DOI):** | 1 | 1 | V-5.1.1 |
| 224 | **4ª Opção (Alienantes e Adquirentes):** | 1 | 1 | V-5.1.1 |
| 225 | **98 rotinas canônicas de troubleshooting e suporte prático** | 1 | 1 | D-9.0 |
| 226 | **A** | 1 | 1 | V-7.7.3 |
| 227 | **A cada 30 minutos** | 1 | 1 | D-3.76 |
| 228 | **abaixo de R$ 50,00** | 1 | 1 | C-FIN-11 |
| 229 | **Abrir** | 1 | 1 | V-CCA.1.3 |
| 230 | **Abrir Caixa** | 1 | 1 | D-1.19 |
| 231 | **Abrir Detalhe do Texto** | 1 | 1 | V-7.4.2 |
| 232 | **Abrir no Editor** | 1 | 1 | D-3.40 |
| 233 | **Ação de Suporte Siplan N2 (se o lote ainda não fechou no TJ):** | 1 | 1 | C-SELO-02 |
| 234 | **Ação Executada:** | 1 | 1 | C-GERAL-09 |
| 235 | **Ação Fundamental:** | 1 | 1 | C-ACESSO-06 |
| 236 | **Ações** | 1 | 1 | C-MINUTA-01 |
| 237 | **Ações > Inutilizar Folha / Declarar Sem Efeito** | 1 | 1 | C-LIVRO-01 |
| 238 | **Ações > Reabrir Livro Notarial / Cancelar Encerramento** | 1 | 1 | C-LIVRO-02 |
| 239 | **Adequações Legais** | 1 | 1 | D-3.50 |
| 240 | **Adição de Telefones e E-mails (Regra dos Botões +):** | 1 | 1 | V-4.2.3 |
| 241 | **Adicionar Atos (Averbações / Prenotação)** | 1 | 1 | V-2.2.3 |
| 242 | **Adicionar Nova Fase** | 1 | 1 | D-3.32 |
| 243 | **Adicionar Novo Ato / Natureza Vinculada** | 1 | 1 | C-ATOS-02 |
| 244 | **Administração > Cadastros auxiliares > Espécies** | 1 | 1 | M-59.0 |
| 245 | **Administração > Cadastros auxiliares > Tipos de anexo** | 1 | 1 | M-34.0 |
| 246 | **Administração > Comissões > Consultas** | 1 | 1 | M-7.0 |
| 247 | **Administração > Comissões > Planos de Comissões** | 1 | 1 | R-19.0 |
| 248 | **Administração > Comunicações > DOI** | 1 | 1 | C-CENTRAL-07 |
| 249 | **Administração > Comunicações > Lotes de comunicação** | 1 | 1 | M-32.0 |
| 250 | **Administração > Comunicações > Selo digital** | 1 | 1 | R-17.0 |
| 251 | **Administração > Comunicações > SIRC / Comunicações Previdenciárias** | 1 | 1 | C-CENTRAL-13 |
| 252 | **Administração > Controle de Caixa > Abertura de Caixa** | 1 | 1 | D-1.19 |
| 253 | **Administração > Controle de Caixa > Recibos** | 1 | 1 | C-FIN-01 |
| 254 | **Administração > Controle de Estoque > Aquisição** | 1 | 1 | V-2.0 |
| 255 | **Administração > Controle de Estoque > Cadastros > Categoria** | 1 | 1 | D-2.4 |
| 256 | **Administração > Controle de Estoque > Cadastros > Produto** | 1 | 1 | D-2.7 |
| 257 | **Administração > Controle de Estoque > Consultas** | 1 | 1 | V-3.0 |
| 258 | **Administração > Distribuição** | 1 | 1 | D-2.14 |
| 259 | **Administração > Faturamento > Emissão de faturas** | 1 | 1 | M-33.2 |
| 260 | **Administração > Faturamento > Extrato de mensalistas** | 1 | 1 | M-33.1 |
| 261 | **Administração > Faturamento > Faturas emitidas** | 1 | 1 | M-33.3 |
| 262 | **Administração > Financeiro > Orçamentos** | 1 | 1 | M-45.0 |
| 263 | **Administração > Histórico de Ações** | 1 | 1 | D-1.14 |
| 264 | **Administração > Importação de Arquivos > Novo Arquivo** | 1 | 1 | R-31.0 |
| 265 | **Administração > Logs e Histórico** | 1 | 1 | R-1.5 |
| 266 | **Administração > Mensalistas > Extrato** | 1 | 1 | M-3.0 |
| 267 | **Administração > Mensalistas > Lançamentos manuais** | 1 | 1 | M-4.0 |
| 268 | **Administração > Menu de Pagamentos > Certidões e Serviços** | 1 | 1 | D-1.23 |
| 269 | **Administração > Menu de Pagamentos > Notas** | 1 | 1 | D-1.24 |
| 270 | **Administração > Mural de Comunicados** | 1 | 1 | R-38.0 |
| 271 | **Administração > Parâmetros > Alíquotas** | 1 | 1 | M-40.0 |
| 272 | **Administração > Parâmetros > Campos obrigatórios** | 1 | 1 | M-16.6 |
| 273 | **Administração > Parâmetros > Certificados digitais** | 1 | 1 | M-32.2 |
| 274 | **Administração > Parâmetros > Comissões e mensalistas** | 1 | 1 | M-16.9 |
| 275 | **Administração > Parâmetros > Configurações de impressão** | 1 | 1 | M-25.0 |
| 276 | **Administração > Parâmetros > Faturamento** | 1 | 1 | M-16.11 |
| 277 | **Administração > Parâmetros > Importação de arquivos** | 1 | 1 | M-58.0 |
| 278 | **Administração > Parâmetros > Parâmetros por estação** | 1 | 1 | M-16.3 |
| 279 | **Administração > Parâmetros > Protocolo de notas** | 1 | 1 | M-16.12 |
| 280 | **Administração > Parâmetros > Tipos de Movimentação** | 1 | 1 | C-FIN-12 |
| 281 | **Administração > Parâmetros do Sistema** | 1 | 1 | C-FIN-03 |
| 282 | **Administração > Rotinas Especiais > Consolidação de Movimentações** | 1 | 1 | C-LIVRO-08 |
| 283 | **Administração > Selo Digital** | 1 | 1 | M-15.0 |
| 284 | **Administração > Sessões Ativas e Bloqueios** | 1 | 1 | C-ATOS-08 |
| 285 | **Administração > Tabela de custas > Grupos de itens** | 1 | 1 | M-62.0 |
| 286 | **Administração > Tabela de custas > Outros serviços** | 1 | 1 | M-66.0 |
| 287 | **Administrador / Tabelião** | 1 | 1 | C-GERAL-08 |
| 288 | **Administrador de Fonte de Dados ODBC (32 bits)** | 1 | 1 | C-CONFIG-08 |
| 289 | **Adquirindo** | 1 | 1 | V-7.1.3 |
| 290 | **Advogado / Assistente** | 1 | 1 | C-ATOS-05 |
| 291 | **Aguardando Envio** | 1 | 1 | D-3.2 |
| 292 | **Aguardando Retorno** | 1 | 1 | C-SELO-01 |
| 293 | **Ajuda (?)** | 1 | 1 | R-1.5 |
| 294 | **Ajuda > Change Log** | 1 | 1 | D-3.50 |
| 295 | **Ajuste de Sequência de Termos** | 1 | 1 | C-FIRMA-02 |
| 296 | **Alerta / Bloqueio de Inadimplência** | 1 | 1 | C-FIN-11 |
| 297 | **Alerta de Sincronização:** | 1 | 1 | C-SELO-03 |
| 298 | **Alerta Informativo** | 1 | 1 | D-3.68 |
| 299 | **ALERTA OPERACIONAL IMPORTANTE:** | 1 | 1 | V-6.2.4 |
| 300 | **Alienação Parcial de Quinhão** | 1 | 1 | C-GERAL-07 |
| 301 | **Alíquota Financiada (%)** | 1 | 1 | M-40.0 |
| 302 | **Alíquota Geral de ITBI (%)** | 1 | 1 | M-40.0 |
| 303 | **Alterar configurações de energia avançadas** | 1 | 1 | C-CONFIG-06 |
| 304 | **Alterar Layout / Parâmetros** | 1 | 1 | C-CONFIG-03 |
| 305 | **Alterar Status > Em Edição** | 1 | 1 | C-MINUTA-01 |
| 306 | **Altura** | 1 | 1 | M-26.0 |
| 307 | **amarela** | 1 | 1 | V-7.8.1 |
| 308 | **Analítico por Protocolo/Recibo** | 1 | 1 | D-3.58 |
| 309 | **Andamentos (Logs)** | 1 | 1 | V-3.0 |
| 310 | **Andamentos / Tramitação** | 1 | 1 | D-3.30 |
| 311 | **Anexar Imagem Escaneada do Livro (GED)** | 1 | 1 | C-CERT-03 |
| 312 | **Anexos e Documentos Digitalizados** | 1 | 1 | D-3.31 |
| 313 | **Ano de Exercício** | 1 | 1 | D-3.49 |
| 314 | **Anotações Marginais / Vínculos Notariais** | 1 | 1 | C-ATOS-03 |
| 315 | **Anuindo** | 1 | 1 | V-7.1.3 |
| 316 | **Ao Converter em Livro Definitivo** | 1 | 1 | D-3.75 |
| 317 | **Aparência Profissional:** | 1 | 1 | C-CERT-04 |
| 318 | **Apenas com Saldo Devedor** | 1 | 1 | D-3.45 |
| 319 | **Apenas Emolumentos Líquidos Quitados no Caixa** | 1 | 1 | D-3.55 |
| 320 | **Apenas um dedo** | 1 | 1 | M-16.8 |
| 321 | **Área do Imóvel** | 1 | 1 | C-GERAL-06 |
| 322 | **Arredondamento de custas** | 1 | 1 | M-16.1 |
| 323 | **Assina a Rogo:** | 1 | 1 | V-7.1.3 |
| 324 | **Assina Eletronicamente:** | 1 | 1 | V-7.1.3 |
| 325 | **Assina Presencialmente:** | 1 | 1 | V-7.1.3 |
| 326 | **Assinado por Representante / Procurador** | 1 | 1 | C-FIRMA-05 |
| 327 | **Assinador Orion** | 1 | 1 | C-SELO-08 |
| 328 | **Assinar digitalmente:** | 1 | 1 | V-7.0.2 |
| 329 | **Assinar e Processar Lote** | 1 | 1 | M-32.3 |
| 330 | **Assistência Judiciária Gratuita** | 1 | 1 | C-CERT-01 |
| 331 | **Atalho de Biometria** | 1 | 1 | V-CCA.2.2 |
| 332 | **ATENÇÃO (Passo Obrigatório):** | 1 | 1 | V-CCA.1.3 |
| 333 | **Atenção Cadastral:** | 1 | 1 | C-SELO-10 |
| 334 | **Ativar Caixa para Firmas** | 1 | 1 | D-1.7 |
| 335 | **Ativar Caixa para Notas** | 1 | 1 | D-1.7 |
| 336 | **Ativar Comando de Corte Automático (Guilhotina)** | 1 | 1 | C-CONFIG-04 |
| 337 | **Ativar Consumo Automático de Papel de Segurança** | 1 | 1 | D-3.75 |
| 338 | **Ativar Consumo Automático de Papel e Selos** | 1 | 1 | D-2.12 |
| 339 | **Ativar Consumo Automático de Selos Digitais / Físicos** | 1 | 1 | D-3.75 |
| 340 | **Ativar Envio Automático de Selos Digitais** | 1 | 1 | D-3.76 |
| 341 | **Ativar rotina - Notas** | 1 | 1 | C-FIN-03 |
| 342 | **Ato** | 1 | 1 | D-3.14 |
| 343 | **Ato Notarial** | 1 | 1 | M-46.0 |
| 344 | **Atualização de Endereço:** | 1 | 1 | V-4.2.3 |
| 345 | **Atualizar Lista de Impressoras Conectadas** | 1 | 1 | C-CONFIG-04 |
| 346 | **Atualizar Metadados de Frações** | 1 | 1 | C-GERAL-07 |
| 347 | **Atualizar Status** | 1 | 1 | D-3.2 |
| 348 | **Auditoria (Andamentos)** | 1 | 1 | V-2.4.3 |
| 349 | **Auditoria de Gratuidade:** | 1 | 1 | C-CERT-01 |
| 350 | **Auditoria Notarial:** | 1 | 1 | C-FIRMA-04 |
| 351 | **Ausente** | 1 | 1 | D-3.72 |
| 352 | **Auto-Calibração de Mídia** | 1 | 1 | C-CONFIG-02 |
| 353 | **Automático (Atraso na Inicialização)** | 1 | 1 | C-ACESSO-05 |
| 354 | **Autorização para recibos** | 1 | 1 | M-16.12 |
| 355 | **Auxiliares de Cartório** | 1 | 1 | C-ACESSO-07 |
| 356 | **Avançar para Assinatura** | 1 | 1 | M-32.1 |
| 357 | **Averbação com valor declarado** | 1 | 1 | V-3.2.5 |
| 358 | **Aviso Informativo** | 1 | 1 | M-27.0 |
| 359 | **Azinho** | 1 | 1 | V-7.7.3 |
| 360 | **Baixa por Avaria Mecânica** | 1 | 1 | C-LIVRO-07 |
| 361 | **Baixar Log** | 1 | 1 | M-32.3 |
| 362 | **Baixar Prévia em PDF** | 1 | 1 | V-7.2.1 |
| 363 | **Banco (Número/Nome)** | 1 | 1 | D-1.11 |
| 364 | **Barra de Módulos (Menu Superior):** | 1 | 1 | R-1.0 |
| 365 | **Barra Superior de Busca** | 1 | 1 | V-6.2.4 |
| 366 | **Base do SIGNO:** | 1 | 1 | V-4.3.6 |
| 367 | **Bens** | 1 | 1 | C-GERAL-02 |
| 368 | **Bloquear Atendimento** | 1 | 1 | C-FIN-11 |
| 369 | **Bloquear Atos em Caso de Estoque Zerado** | 1 | 1 | D-2.12 |
| 370 | **Bloquear Cartão** | 1 | 1 | D-3.3 |
| 371 | **Bloquear Ficha** | 1 | 1 | V-CCA.2.2 |
| 372 | **Bloquear Impressão caso o Estoque do Usuário esteja Zerado** | 1 | 1 | D-3.75 |
| 373 | **Bloquear uma Ficha de Assinatura** | 1 | 1 | V-CCA.2.2 |
| 374 | **Bloqueio Impeditivo Total** | 1 | 1 | M-27.0 |
| 375 | **Bloqueio Total** | 1 | 1 | D-3.68 |
| 376 | **Boas Práticas Contábeis:** | 1 | 1 | C-LIVRO-08 |
| 377 | **Breve Relato / Resumo** | 1 | 1 | M-54.1 |
| 378 | **Busca por CPF (Pessoa Física - Recomendado):** | 1 | 1 | V-4.1.4 |
| 379 | **Cabeçalho de Traslado:** | 1 | 1 | V-7.2.2 |
| 380 | **Cabeçalhos e Rodapés** | 1 | 1 | C-CERT-04 |
| 381 | **Cadastrar Novo Livro** | 1 | 1 | C-LIVRO-05 |
| 382 | **Cadastro Completo** | 1 | 1 | V-CCA.3.3 |
| 383 | **Caixa > Administração > Consultas > Certidões e Serviços** | 1 | 1 | R-5.0 |
| 384 | **Caixa > Administração > Pagamentos** | 1 | 1 | R-3.0 |
| 385 | **Caixa > Cadastros auxiliares > Outros serviços** | 1 | 1 | M-66.0 |
| 386 | **Caixa > Parâmetros > Tipos de movimentação** | 1 | 1 | M-64.0 |
| 387 | **Caixa Destino** | 1 | 1 | D-1.22 |
| 388 | **Calcular Comissões** | 1 | 1 | D-3.55 |
| 389 | **Calcular e Equalizar Frações** | 1 | 1 | C-GERAL-07 |
| 390 | **Câmera** | 1 | 1 | C-FIRMA-01 |
| 391 | **Caminho das Imagens do Balcão de Firmas / Assinaturas** | 1 | 1 | C-FIRMA-08 |
| 392 | **Cancelado / Desistido** | 1 | 1 | C-SELO-05 |
| 393 | **Cancelado / Inativo por Erro Operacional** | 1 | 1 | C-GERAL-04 |
| 394 | **Cancelar Ato / Lavrar Cancelamento** | 1 | 1 | D-3.35 |
| 395 | **Caneta (Editar)** | 1 | 1 | V-4.1.1 |
| 396 | **Captura de Foto Facial da Pessoa** | 1 | 1 | V-CCA.1.3 |
| 397 | **Capturar do Scanner** | 1 | 1 | D-3.31 |
| 398 | **Carregar Modelo** | 1 | 1 | D-3.40 |
| 399 | **Cartão Final** | 1 | 1 | D-3.5 |
| 400 | **Cartflow > Pedidos** | 1 | 1 | R-37.0 |
| 401 | **Cartões de Autógrafo / Fichas de Firma** | 1 | 1 | C-CENTRAL-08 |
| 402 | **Cartório de Imóveis de Destino** | 1 | 1 | D-3.2 |
| 403 | **Cartório de Registro de Imóveis Competente** | 1 | 1 | D-3.70 |
| 404 | **Casado(a)** | 1 | 1 | C-ATOS-06 |
| 405 | **Cenário 1 (Modelos Próprios / Confecção Externa):** | 1 | 1 | V-7.1.1 |
| 406 | **Cenário 1 (Modelos Próprios)** | 1 | 1 | V-7.1.1 |
| 407 | **Cenário 2** | 1 | 1 | V-7.1.1 |
| 408 | **Cenário 2 (Modelos Confeccionados no Sistema):** | 1 | 1 | V-7.1.1 |
| 409 | **CENIB** | 1 | 1 | D-3.41 |
| 410 | **Central de Indisponibilidade (CNIB)** | 1 | 1 | V-7.3.1 |
| 411 | **Centro de Custo** | 1 | 1 | D-3.56 |
| 412 | **Certidão de Ato Antigo / Não Digitalizado** | 1 | 1 | C-CERT-03 |
| 413 | **Certidões diversas** | 1 | 1 | V-3.2.6 |
| 414 | **Certificado Digital A1** | 1 | 1 | M-32.3 |
| 415 | **Certificado Digital ICP-Brasil** | 1 | 1 | D-3.54 |
| 416 | **Certificado Digital Padrão** | 1 | 1 | D-3.76 |
| 417 | **Certificados Digitais / Assinador** | 1 | 1 | C-CONFIG-01 |
| 418 | **Cessionário** | 1 | 1 | C-ATOS-05 |
| 419 | **CGI/ONR** | 1 | 1 | V-4.4.3 |
| 420 | **Chamar Novamente** | 1 | 1 | D-3.72 |
| 421 | **Chamar Próxima Senha** | 1 | 1 | D-3.72 |
| 422 | **Change Log** | 1 | 1 | R-1.7 |
| 423 | **Change Log / Novidades da Versão** | 1 | 1 | R-1.7 |
| 424 | **Cidade e Percentual de ISS** | 1 | 1 | V-2.2.3 |
| 425 | **Cidade padrão** | 1 | 1 | V-1.1.1 |
| 426 | **Cifrão ($) / Financeiro** | 1 | 1 | D-3.17 |
| 427 | **CIM** | 1 | 1 | V-5.1.4 |
| 428 | **Classificação do Documento** | 1 | 1 | D-3.31 |
| 429 | **Cláusulas** | 1 | 1 | V-7.0.3 |
| 430 | **Clipe em cor verde** | 1 | 1 | V-6.2.1 |
| 431 | **Clique aqui para acessar a tela de configuração no Orion Coaf** | 1 | 1 | C-CENTRAL-02 |
| 432 | **Clonagem** | 1 | 1 | V-5.1.5 |
| 433 | **Clonar imóvel** | 1 | 1 | V-5.1.5 |
| 434 | **CNJ** | 1 | 1 | V-7.5.2 |
| 435 | **COAF / SISCOAF** | 1 | 1 | M-16.5 |
| 436 | **Código de Segurança** | 1 | 1 | D-3.37 |
| 437 | **Código Numérico** | 1 | 1 | M-31.0 |
| 438 | **Código Oficial do Tribunal** | 1 | 1 | C-ATOS-07 |
| 439 | **Colar Textos Externos sem Corromper** | 1 | 1 | C-MINUTA-03 |
| 440 | **Coleta Biométrica** | 1 | 1 | V-CCA.1.3 |
| 441 | **Coleta Biométrica (Impressão Digital)** | 1 | 1 | V-CCA.1.3 |
| 442 | **Colorido** | 1 | 1 | M-16.2 |
| 443 | **Com Exigência** | 1 | 1 | D-3.2 |
| 444 | **Comercial** | 1 | 1 | V-5.2.1 |
| 445 | **Comparação Visual** | 1 | 1 | V-7.5.4 |
| 446 | **Comparar** | 1 | 1 | V-7.5.4 |
| 447 | **Compatibilidade** | 1 | 1 | C-CONFIG-08 |
| 448 | **Compilar Registros de Óbito de Inventários** | 1 | 1 | C-CENTRAL-13 |
| 449 | **Compra e Venda Pura** | 1 | 1 | C-SELO-10 |
| 450 | **Comprovante em Folha A4** | 1 | 1 | D-3.23 |
| 451 | **Comunicações > CENSEC RCTO** | 1 | 1 | C-CENTRAL-11 |
| 452 | **Comunicações > Centrais Notariais** | 1 | 1 | C-ATOS-01 |
| 453 | **Comunicações com Centrais Notariais** | 1 | 1 | M-61.0 |
| 454 | **Comunicar / Enviar Receitas** | 1 | 1 | D-7.0 |
| 455 | **Conceder Desconto/Abatimento** | 1 | 1 | D-3.64 |
| 456 | **Concluir / Confirmar** | 1 | 1 | R-13.0 |
| 457 | **Concluir / Gerar Orçamento** | 1 | 1 | R-8.0 |
| 458 | **Concluir Fechamento e Gerar Faturas** | 1 | 1 | D-3.62 |
| 459 | **Concluir Registro** | 1 | 1 | D-3.66 |
| 460 | **Conclusão e Gravação dos Registros:** | 1 | 1 | V-5.2.1 |
| 461 | **Conferência de Caixa** | 1 | 1 | C-FIN-08 |
| 462 | **Conferência Obrigatória dos Dados Extraídos:** | 1 | 1 | V-5.2.1 |
| 463 | **Conferir Minuta** | 1 | 1 | D-3.40 |
| 464 | **Configuração de suspensão seletiva USB** | 1 | 1 | C-CONFIG-06 |
| 465 | **Configuração do Servidor (SMTP)** | 1 | 1 | M-16.10 |
| 466 | **Configurações > Cadastros Auxiliares > Conta Bancária** | 1 | 1 | D-1.11 |
| 467 | **Configurações > Cadastros Auxiliares > Forma de Pagamento** | 1 | 1 | D-1.4 |
| 468 | **Configurações > Cadastros Auxiliares > Fornecedor** | 1 | 1 | D-2.5 |
| 469 | **Configurações > Cadastros Auxiliares > Grupos de Distribuição** | 1 | 1 | D-2.6 |
| 470 | **Configurações > Cadastros Auxiliares > Mensalistas** | 1 | 1 | C-FIN-11 |
| 471 | **Configurações > Cadastros Auxiliares > Outros Serviços** | 1 | 1 | D-1.6 |
| 472 | **Configurações > Cadastros auxiliares > Participação** | 1 | 1 | C-CENTRAL-03 |
| 473 | **Configurações > Cadastros Auxiliares > Tipo de Documento** | 1 | 1 | D-2.8 |
| 474 | **Configurações > Cadastros Auxiliares > Tipos de Saída** | 1 | 1 | D-1.5 |
| 475 | **Configurações > Cadastros Auxiliares > Unidade de Medida** | 1 | 1 | D-2.9 |
| 476 | **Configurações > Geral > Cadastros Auxiliares > Outros Serviços** | 1 | 1 | R-18.0 |
| 477 | **Configurações > Geral > Cadastros Auxiliares > Participação** | 1 | 1 | R-4.0 |
| 478 | **Configurações > Impressora e Modelos Padrão** | 1 | 1 | D-1.9 |
| 479 | **Configurações > Modelos de impressão > Configuração de impressão** | 1 | 1 | M-26.0 |
| 480 | **Configurações > Modelos de Minuta/Livro/Traslado** | 1 | 1 | D-3.48 |
| 481 | **Configurações > Modelos de Minutas > Modelos de Qualificação de Partes** | 1 | 1 | C-MINUTA-02 |
| 482 | **Configurações > Parametrizações > Comunicação com TJ** | 1 | 1 | D-3.76 |
| 483 | **Configurações > Parametrizações > Integração SGA** | 1 | 1 | D-1.12 |
| 484 | **Configurações > Parametrizações > Integrações** | 1 | 1 | D-1.8 |
| 485 | **Configurações > Parametrizações > Inteligência Artificial** | 1 | 1 | D-1.13 |
| 486 | **Configurações > Parametrizações > Natureza de Ato** | 1 | 1 | D-3.47 |
| 487 | **Configurações > Parametrizações > Tabela de Custas** | 1 | 1 | D-3.49 |
| 488 | **Configurações > Parametrizações > Trâmites do Protocolo** | 1 | 1 | D-3.32 |
| 489 | **Configurações > Parâmetros de Faturamento > Comissões / Convênios** | 1 | 1 | C-FIN-14 |
| 490 | **Configurações > Parâmetros de Integração > Certificado Digital** | 1 | 1 | C-SELO-04 |
| 491 | **Configurações > Parâmetros de NFS-e** | 1 | 1 | C-FIN-05 |
| 492 | **Configurações > Parâmetros de NFS-e > Regras de Balcão** | 1 | 1 | C-FIRMA-06 |
| 493 | **Configurações > Parâmetros do Caixa > Emissão de Recibos** | 1 | 1 | C-SELO-10 |
| 494 | **Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas** | 1 | 1 | C-FIRMA-07 |
| 495 | **Configurações > Parâmetros Gerais > Armazenamento e GED** | 1 | 1 | C-FIRMA-08 |
| 496 | **Configurações > Parâmetros Gerais > Editor Orion** | 1 | 1 | C-MINUTA-03 |
| 497 | **Configurações > Perfis de Acesso / Usuários** | 1 | 1 | C-FIN-02 |
| 498 | **Configurações > Periféricos de Balcão** | 1 | 1 | C-FIRMA-01 |
| 499 | **Configurações > Tabela de custas > Grupo de item** | 1 | 1 | M-63.0 |
| 500 | **Configurações > Usuários / Perfis de Acesso** | 1 | 1 | C-FIN-13 |
| 501 | **Configurações > Usuários e Permissões > Grupos de Permissões** | 1 | 1 | D-2.2 |
| 502 | **Configurações > Usuários e Permissões > Usuários** | 1 | 1 | D-2.3 |
| 503 | **Configurações da Serventia > Integração / API / Tokens** | 1 | 1 | C-CENTRAL-04 |
| 504 | **Configurações de Captura e Imagens** | 1 | 1 | C-CONFIG-05 |
| 505 | **Configurações do Caixa / Recibos** | 1 | 1 | C-CONFIG-04 |
| 506 | **Configurações do Estoque / Tipo de Mídia** | 1 | 1 | C-CONFIG-02 |
| 507 | **Confirmar Consumo e Imprimir** | 1 | 1 | D-3.36 |
| 508 | **Confirmar Custas** | 1 | 1 | D-3.22 |
| 509 | **Confirmar Duplicação** | 1 | 1 | D-3.24 |
| 510 | **Confirmar e Emitir Recibo** | 1 | 1 | D-3.51 |
| 511 | **Confirmar e Gerar Selo de Retificação** | 1 | 1 | C-SELO-06 |
| 512 | **Confirmar Importação** | 1 | 1 | C-MINUTA-05 |
| 513 | **Confirmar Indicação** | 1 | 1 | D-3.56 |
| 514 | **Confirmar Leitura e Ciência** | 1 | 1 | R-38.0 |
| 515 | **Confirmar Reset** | 1 | 1 | C-ACESSO-03 |
| 516 | **Confirmar Retificação** | 1 | 1 | C-FIN-13 |
| 517 | **Confirmar Vinculação** | 1 | 1 | D-3.15 |
| 518 | **Conformidade Legal:** | 1 | 1 | C-CENTRAL-13 |
| 519 | **Conformidade:** | 1 | 1 | C-ATOS-04 |
| 520 | **Cônjuge / Companheiro(a)** | 1 | 1 | C-ATOS-06 |
| 521 | **Cônjuge como "Nenhum":** | 1 | 1 | V-7.0.2 |
| 522 | **Cônjuge como "Transmitente":** | 1 | 1 | V-7.0.2 |
| 523 | **Cônjuge Vinculado** | 1 | 1 | C-GERAL-03 |
| 524 | **Consolidado Geral** | 1 | 1 | D-1.16 |
| 525 | **Consulta de indisponibilidade de todas as partes** | 1 | 1 | V-4.4.2 |
| 526 | **Consulta de Orçamentos** | 1 | 1 | V-2.4.4 |
| 527 | **Consulta em Lote** | 1 | 1 | D-5.0 |
| 528 | **Consulta Individual** | 1 | 1 | D-5.0 |
| 529 | **Consulta Pública no TJ** | 1 | 1 | V-3.4.5 |
| 530 | **Consultar / Filtrar** | 1 | 1 | R-29.0 |
| 531 | **Consultar Andamento no SAEC** | 1 | 1 | C-CENTRAL-14 |
| 532 | **Consultar Central de Indisponibilidade** | 1 | 1 | V-4.4.2 |
| 533 | **Consultar Indisponibilidade** | 1 | 1 | M-51.3 |
| 534 | **Consultar Indisponibilidade em Lote** | 1 | 1 | D-3.26 |
| 535 | **Consultas > Histórico de Aquisição** | 1 | 1 | D-2.13 |
| 536 | **Consultas > Procurações a Vencer** | 1 | 1 | R-15.0 |
| 537 | **Consultas e Relatórios** | 1 | 1 | C-ACESSO-07 |
| 538 | **Consumidor Final / Não Identificado** | 1 | 1 | C-FIRMA-06 |
| 539 | **Consumir o Papel de Segurança (Formulário)** | 1 | 1 | V-CCA.2.3 |
| 540 | **Consumo de Insumos** | 1 | 1 | D-2.12 |
| 541 | **Consumo de Papel / Selo** | 1 | 1 | M-9.3 |
| 542 | **Consumo em Aberto no Mês Atual** | 1 | 1 | D-3.65 |
| 543 | **Conta Bancária** | 1 | 1 | D-3.63 |
| 544 | **Conta Bancária de Depósito Prévio** | 1 | 1 | D-3.51 |
| 545 | **Conta de Despesa** | 1 | 1 | D-1.5 |
| 546 | **Conta Financeira** | 1 | 1 | D-1.5 |
| 547 | **Controlar estoque de papel de segurança** | 1 | 1 | M-16.13 |
| 548 | **Controlar por Sequência Numérica/Série** | 1 | 1 | D-2.7 |
| 549 | **Controle de Caixa > Recebimento de Protocolo** | 1 | 1 | C-FIN-06 |
| 550 | **Controle de Caixa > Recibos** | 1 | 1 | C-FIN-13 |
| 551 | **Converter Depósito em Emolumento Definitivo** | 1 | 1 | C-FIN-12 |
| 552 | **Convertido em Protocolo** | 1 | 1 | M-45.0 |
| 553 | **Copiar Log para Área de Transferência** | 1 | 1 | C-GERAL-09 |
| 554 | **Copiar Permissões de Usuário Existente** | 1 | 1 | C-ACESSO-01 |
| 555 | **Copiar QR Code** | 1 | 1 | V-3.4.5 |
| 556 | **Copiar QR Code e Selo** | 1 | 1 | V-3.4.5 |
| 557 | **Correções** | 1 | 1 | D-3.50 |
| 558 | **Corrigir Fonte Tamanho 2 e Parâmetros Globais** | 1 | 1 | C-MINUTA-03 |
| 559 | **CPF regular** | 1 | 1 | C-GERAL-02 |
| 560 | **Criar Novo Grupo** | 1 | 1 | D-2.2 |
| 561 | **CTRL + ALT + N** | 1 | 1 | M-16.7 |
| 562 | **Ctrl + Alt + S** | 1 | 1 | V-7.0.1 |
| 563 | **Custas e Valores** | 1 | 1 | M-46.0 |
| 564 | **Custas integrais** | 1 | 1 | V-1.1.1 |
| 565 | **Dados cadastrais** | 1 | 1 | M-2.0 |
| 566 | **Dados da Empresa** | 1 | 1 | M-20.0 |
| 567 | **Dados da Parte** | 1 | 1 | V-4.2.1 |
| 568 | **Dados das Partes** | 1 | 1 | D-3.43 |
| 569 | **Dados do COAF** | 1 | 1 | V-4.2.4 |
| 570 | **Dados do Cônjuge** | 1 | 1 | V-CCA.1.1 |
| 571 | **Dados Fiscais / SEFAZ** | 1 | 1 | C-GERAL-02 |
| 572 | **Dados pessoais** | 1 | 1 | M-9.0 |
| 573 | **Dashboard > Comunicações e Obrigações Legais** | 1 | 1 | R-14.1 |
| 574 | **Data de Baixa no Caixa** | 1 | 1 | C-FIN-07 |
| 575 | **Data de Cadastro** | 1 | 1 | V-CCA.2.1 |
| 576 | **Data de Início da Vigência** | 1 | 1 | C-FIN-14 |
| 577 | **Data de Modificação** | 1 | 1 | D-3.46 |
| 578 | **Data de Validade** | 1 | 1 | D-3.28 |
| 579 | **Data de Vencimento** | 1 | 1 | M-33.2 |
| 580 | **Data e Hora da Geração** | 1 | 1 | D-3.37 |
| 581 | **Data Final** | 1 | 1 | V-6.1.2 |
| 582 | **De Cujus / Falecido** | 1 | 1 | C-CENTRAL-03 |
| 583 | **Débito automático na lavratura** | 1 | 1 | M-16.12 |
| 584 | **Declaração de Inocorrência** | 1 | 1 | C-CENTRAL-10 |
| 585 | **Declaração sobre Operações Imobiliárias** | 1 | 1 | C-GERAL-06 |
| 586 | **Defensoria Pública** | 1 | 1 | C-CERT-01 |
| 587 | **Definição de Valor Fixo** | 1 | 1 | V-2.3.2 |
| 588 | **Definir como Solicitante** | 1 | 1 | V-4.3.2 |
| 589 | **Depósito Abatido** | 1 | 1 | D-3.52 |
| 590 | **Derrubar Bloqueio Concorrente** | 1 | 1 | C-GERAL-08 |
| 591 | **Derrubar Sessões Conectadas** | 1 | 1 | C-ACESSO-02 |
| 592 | **Desbloquear Protocolo** | 1 | 1 | D-3.34 |
| 593 | **descolado** | 1 | 1 | V-4.2.3 |
| 594 | **Descrição da Filial** | 1 | 1 | M-49.0 |
| 595 | **Descrição da Unidade** | 1 | 1 | D-2.9 |
| 596 | **Descrição de Exibição Interna** | 1 | 1 | C-ATOS-07 |
| 597 | **Deslocamento Horizontal (Eixo X):** | 1 | 1 | C-CONFIG-03 |
| 598 | **Deslocamento Vertical (Eixo Y):** | 1 | 1 | C-CONFIG-03 |
| 599 | **DESMARQUE** | 1 | 1 | C-CERT-04 |
| 600 | **Despesa Total** | 1 | 1 | V-3.4.1 |
| 601 | **Despesa Total / Total Geral:** | 1 | 1 | V-3.2.6 |
| 602 | **Destino** | 1 | 1 | M-32.0 |
| 603 | **Detalhes Técnicos / Ver Log** | 1 | 1 | C-GERAL-09 |
| 604 | **Devolução de Saldo** | 1 | 1 | M-57.0 |
| 605 | **Diariamente às 19:00 horas** | 1 | 1 | D-3.76 |
| 606 | **Dica de Especialista:** | 1 | 1 | C-CENTRAL-12 |
| 607 | **Dica Prática:** | 1 | 1 | C-FIN-06 |
| 608 | **Diferencial de Balcão:** | 1 | 1 | V-CCA.3.3 |
| 609 | **Digitação com autocompletar** | 1 | 1 | V-2.2.2 |
| 610 | **Dígito Verificador** | 1 | 1 | D-1.11 |
| 611 | **Diretórios de Rede** | 1 | 1 | M-16.2 |
| 612 | **Disparar Alerta de Renovação via WhatsApp** | 1 | 1 | R-15.0 |
| 613 | **Disparar via WhatsApp** | 1 | 1 | R-37.0 |
| 614 | **Dispositivo de Captura** | 1 | 1 | M-16.2 |
| 615 | **Divorciado** | 1 | 1 | V-CCA.1.1 |
| 616 | **Divórcio Direto S/ Imóvel** | 1 | 1 | C-ATOS-01 |
| 617 | **Doação de Imóveis com Reserva de Usufruto** | 1 | 1 | C-GERAL-01 |
| 618 | **Doador** | 1 | 1 | V-4.1.2 |
| 619 | **DOC** | 1 | 1 | V-5.1.6 |
| 620 | **Docker** | 1 | 1 | C-FIN-04 |
| 621 | **Documentação Adicional / Estrangeiros** | 1 | 1 | V-4.2.3 |
| 622 | **Documento (RG, CNH, Passaporte)** | 1 | 1 | D-3.68 |
| 623 | **DOI (Declaração de Operações Imobiliárias)** | 1 | 1 | V-7.6.1 |
| 624 | **dois hashes** | 1 | 1 | V-4.4.2 |
| 625 | **Donatário** | 1 | 1 | V-4.1.2 |
| 626 | **Drivers** | 1 | 1 | C-CONFIG-08 |
| 627 | **E-mail (s) para envio de alerta** | 1 | 1 | D-2.4 |
| 628 | **E-mail automático** | 1 | 1 | V-2.3.3 |
| 629 | **E-mail Corporativo** | 1 | 1 | C-ACESSO-01 |
| 630 | **Editar / Alterar** | 1 | 1 | C-GERAL-02 |
| 631 | **Editar Anotação** | 1 | 1 | C-ATOS-03 |
| 632 | **Editar Campos Sensíveis Bloqueados (Nome / Documentos)** | 1 | 1 | V-CCA.2.3 |
| 633 | **Editar Faixas** | 1 | 1 | D-3.49 |
| 634 | **Editar Traslado / Diagramação** | 1 | 1 | C-LIVRO-03 |
| 635 | **Editor da Certidão** | 1 | 1 | C-CERT-03 |
| 636 | **Editor Integrado** | 1 | 1 | R-1.2 |
| 637 | **Eficiência:** | 1 | 1 | C-MINUTA-04 |
| 638 | **Eletronicamente** | 1 | 1 | V-7.1.3 |
| 639 | **Em Elaboração** | 1 | 1 | D-3.67 |
| 640 | **Em Tópicos Destacados** | 1 | 1 | D-3.38 |
| 641 | **Emitente** | 1 | 1 | D-1.17 |
| 642 | **Emitir Recibo** | 1 | 1 | C-FIN-09 |
| 643 | **Emitir Recibo de Devolução de Saldo** | 1 | 1 | C-FIN-12 |
| 644 | **Emitir Traslado com Selo Digital** | 1 | 1 | D-3.42 |
| 645 | **Encerrado** | 1 | 1 | M-21.0 |
| 646 | **Encerrar** | 1 | 1 | M-21.0 |
| 647 | **Encerrar Atendimento** | 1 | 1 | D-3.72 |
| 648 | **Encerrar Livro** | 1 | 1 | C-LIVRO-05 |
| 649 | **Endereço Completo com CEP válido** | 1 | 1 | C-GERAL-02 |
| 650 | **Enquadramento Tributário / Tabela do TJ** | 1 | 1 | C-SELO-07 |
| 651 | **Enquadramentos Normativos** | 1 | 1 | M-51.5 |
| 652 | **Entregues** | 1 | 1 | D-3.67 |
| 653 | **Enviar E-mail de Teste** | 1 | 1 | M-16.10 |
| 654 | **Enviar Mensagem** | 1 | 1 | R-14.2 |
| 655 | **Enviar por WhatsApp:** | 1 | 1 | V-7.0.2 |
| 656 | **Enviar Prévia via WhatsApp** | 1 | 1 | V-7.2.4 |
| 657 | **Enviar via WhatsApp:** | 1 | 1 | R-8.0 |
| 658 | **EPL** | 1 | 1 | M-70.1 |
| 659 | **Erro de Grafia no Termo Já Impresso** | 1 | 1 | C-FIRMA-02 |
| 660 | **Esc** | 1 | 1 | V-CCA.2.2 |
| 661 | **Escala** | 1 | 1 | C-CERT-04 |
| 662 | **Escala de Cinza** | 1 | 1 | M-16.2 |
| 663 | **Escrevente de Firmas** | 1 | 1 | C-FIRMA-03 |
| 664 | **Escrevente Específico** | 1 | 1 | D-3.45 |
| 665 | **Escreventes Autorizados** | 1 | 1 | C-ACESSO-08 |
| 666 | **Escreventes de Notas** | 1 | 1 | C-ACESSO-06 |
| 667 | **escritura com valor declarado** | 1 | 1 | V-1.1.1 |
| 668 | **Escritura Padrão - ZEIS / Área Social** | 1 | 1 | C-ATOS-07 |
| 669 | **Escritura Padrão COHAB/CDHU** | 1 | 1 | C-ATOS-04 |
| 670 | **Escritura Padrão de Compra e Venda - Urbana** | 1 | 1 | C-MINUTA-04 |
| 671 | **Escritura Pública de Venda e Compra** | 1 | 1 | R-37.0 |
| 672 | **Escrituras** | 1 | 1 | C-LIVRO-05 |
| 673 | **Espaçamento Antes e Depois** | 1 | 1 | C-LIVRO-03 |
| 674 | **Espaçamento Entrelinhas** | 1 | 1 | C-LIVRO-03 |
| 675 | **Espécie de Livro** | 1 | 1 | D-3.60 |
| 676 | **Estabilidade:** | 1 | 1 | C-FIRMA-01 |
| 677 | **Este Ato Retifica / Adita Negócio Jurídico Anterior** | 1 | 1 | C-CENTRAL-11 |
| 678 | **Estoque > Administração > Consumo Manual** | 1 | 1 | R-24.0 |
| 679 | **Estoque Crítico** | 1 | 1 | D-2.12 |
| 680 | **Estoque e Insumos** | 1 | 1 | M-16.13 |
| 681 | **Estornar Guia de Recolhimento** | 1 | 1 | C-FIN-01 |
| 682 | **Estornar lote** | 1 | 1 | M-32.0 |
| 683 | **Estornar o Papel de Segurança de Volta ao Estoque (Reutilizar)** | 1 | 1 | V-CCA.2.3 |
| 684 | **Estornar Pagamento / Cancelar Pagamento:** | 1 | 1 | R-29.0 |
| 685 | **Estornar Recebimento de Balcão** | 1 | 1 | C-FIN-10 |
| 686 | **Estrutura de Submódulos Temáticos da Seção 5:** | 1 | 1 | D-9.0 |
| 687 | **Etiquetas com Intervalos (Web / Gap)** | 1 | 1 | C-CONFIG-02 |
| 688 | **Exclamação (!)** | 1 | 1 | V-3.1.1 |
| 689 | **Excluir (ícone X)** | 1 | 1 | D-9.0 |
| 690 | **Excluir Lançamento de Custas** | 1 | 1 | C-SELO-05 |
| 691 | **Excluir Vínculo Indevido** | 1 | 1 | C-ATOS-03 |
| 692 | **Executar Consolidação** | 1 | 1 | C-LIVRO-08 |
| 693 | **Executar este programa como administrador** | 1 | 1 | C-CONFIG-08 |
| 694 | **Executar Nova Consulta em Lote** | 1 | 1 | D-3.27 |
| 695 | **Exibir Valores de Emolumentos e Caixa Líquido** | 1 | 1 | C-ACESSO-07 |
| 696 | **Exige código de autorização / NSU** | 1 | 1 | M-31.0 |
| 697 | **Exige ITBI** | 1 | 1 | D-3.47 |
| 698 | **Exigência do Detran:** | 1 | 1 | C-FIRMA-05 |
| 699 | **Exigir captura de biometria** | 1 | 1 | M-16.8 |
| 700 | **Exigir Comprovante de ITCMD na Conclusão do Protocolo** | 1 | 1 | C-SELO-10 |
| 701 | **Exigir Confirmação de Leitura Obrigatória** | 1 | 1 | R-38.0 |
| 702 | **Exigir número de requisição** | 1 | 1 | M-16.9 |
| 703 | **Exportar / Imprimir** | 1 | 1 | D-3.59 |
| 704 | **Exportar Arquivo de Remessa Manual** | 1 | 1 | C-SELO-01 |
| 705 | **Extenso** | 1 | 1 | V-7.2.3 |
| 706 | **Extração Reversa de Minuta** | 1 | 1 | V-7.6.1 |
| 707 | **Fator Multiplicador de Emolumentos** | 1 | 1 | C-GERAL-05 |
| 708 | **Faturamento > Mensalistas > Baixa de Faturas / Conta Corrente** | 1 | 1 | C-FIN-10 |
| 709 | **Faturar** | 1 | 1 | M-14.4 |
| 710 | **Faturas Emitidas Pendentes de Pagamento** | 1 | 1 | D-3.65 |
| 711 | **Fazer download da prévia:** | 1 | 1 | V-7.0.2 |
| 712 | **Fazer Upload / Importar Arquivos** | 1 | 1 | D-3.31 |
| 713 | **Fechar Folha de Comissões / Imprimir** | 1 | 1 | D-3.55 |
| 714 | **Feed** | 1 | 1 | C-CONFIG-02 |
| 715 | **Filiação (Pai e Mãe)** | 1 | 1 | C-CENTRAL-03 |
| 716 | **Filtros Adicionais:** | 1 | 1 | R-34.0 |
| 717 | **Filtros de Busca** | 1 | 1 | D-1.14 |
| 718 | **Filtros de Cabeçalho** | 1 | 1 | D-3.1 |
| 719 | **Filtros de Pesquisa:** | 1 | 1 | R-1.0 |
| 720 | **Finalidade/Justificativa** | 1 | 1 | D-3.4 |
| 721 | **Finalizações e Assinaturas:** | 1 | 1 | V-7.2.2 |
| 722 | **Finalizar Árvore de Processos** | 1 | 1 | C-CONFIG-07 |
| 723 | **Finalizar Pedido / Enviar ao Caixa** | 1 | 1 | R-2.0 |
| 724 | **Finalizar Processo** | 1 | 1 | C-CONFIG-07 |
| 725 | **Financeiro / Custas** | 1 | 1 | C-FIN-12 |
| 726 | **Financeiro > Orion Caixa > Recolhimento** | 1 | 1 | C-FIN-02 |
| 727 | **Firmas > Atendimento > Balcão de firmas** | 1 | 1 | M-14.0 |
| 728 | **Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel** | 1 | 1 | D-3.6 |
| 729 | **Firmas > Cadastros > Digitalização em Lote > Por Sequência de Cartão** | 1 | 1 | D-3.5 |
| 730 | **Firmas > Cadastros auxiliares > Área de atuação** | 1 | 1 | M-41.0 |
| 731 | **Firmas > Comunicações > Lotes SEFAZ** | 1 | 1 | M-32.0 |
| 732 | **Firmas > Consultas > Consulta de Reconhecimento de Firmas** | 1 | 1 | D-3.9 |
| 733 | **Firmas > Consultas > Pedidos de firmas** | 1 | 1 | M-17.0 |
| 734 | **Firmas > Livros** | 1 | 1 | M-21.0 |
| 735 | **Firmas > Reconhecimento de Firmas > Digitalização de DUT** | 1 | 1 | D-3.7 |
| 736 | **Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)** | 1 | 1 | C-FIRMA-05 |
| 737 | **Fiscalização Rigorosa:** | 1 | 1 | C-LIVRO-07 |
| 738 | **Fiscalização:** | 1 | 1 | C-SELO-09 |
| 739 | **Flexão de Gênero Feminino:** | 1 | 1 | V-7.0.2 |
| 740 | **Fluxo A - Geração Automática** | 1 | 1 | V-CCA.3.1 |
| 741 | **Fluxo B - Geração Manual** | 1 | 1 | V-CCA.3.1 |
| 742 | **Folha de Origem** | 1 | 1 | C-CENTRAL-11 |
| 743 | **Folha Excedente** | 1 | 1 | M-54.3 |
| 744 | **Fonte de Digitalização Padrão** | 1 | 1 | C-CONFIG-05 |
| 745 | **Formatar > Parágrafo** | 1 | 1 | C-LIVRO-03 |
| 746 | **Formatar o Documento:** | 1 | 1 | V-7.3.1 |
| 747 | **Formulário de Segurança / Traslado** | 1 | 1 | V-6.2.1 |
| 748 | **Fórmulas e Regras Especiais** | 1 | 1 | C-GERAL-05 |
| 749 | **Foto do titular** | 1 | 1 | M-9.1 |
| 750 | **Fotos e Biometria** | 1 | 1 | M-9.1 |
| 751 | **Fração Transmitida (%)** | 1 | 1 | C-CENTRAL-06 |
| 752 | **Fundos Judiciais** | 1 | 1 | D-3.49 |
| 753 | **GED** | 1 | 1 | R-1.6 |
| 754 | **Gera DOI** | 1 | 1 | D-3.47 |
| 755 | **Geral / Identificação** | 1 | 1 | C-GERAL-01 |
| 756 | **Gerar / Enviar Imediatamente** | 1 | 1 | C-CENTRAL-08 |
| 757 | **Gerar / Transmitir Boletos** | 1 | 1 | C-FIN-04 |
| 758 | **Gerar e Exportar Lote DOI** | 1 | 1 | C-CENTRAL-07 |
| 759 | **Gerar faturas** | 1 | 1 | M-33.2 |
| 760 | **Gerar Link de Coleta** | 1 | 1 | R-37.0 |
| 761 | **Gerar Livro** | 1 | 1 | V-7.0.4 |
| 762 | **Gerar Livro Oficial:** | 1 | 1 | V-7.0.4 |
| 763 | **Gerar Lote Mensal** | 1 | 1 | C-GERAL-06 |
| 764 | **Gerar no Editor** | 1 | 1 | D-3.16 |
| 765 | **Gerar Novo Token de Integração / API Key** | 1 | 1 | C-CENTRAL-04 |
| 766 | **Gerar Resumo** | 1 | 1 | D-3.59 |
| 767 | **Gerar Selo de Cancelamento** | 1 | 1 | D-3.35 |
| 768 | **Gerar Termo** | 1 | 1 | D-3.4 |
| 769 | **Gerar termos** | 1 | 1 | M-29.2 |
| 770 | **Gerar Termos em Lote** | 1 | 1 | M-29.2 |
| 771 | **Gerenciador de Certificados / Token** | 1 | 1 | C-SELO-08 |
| 772 | **Gerenciador de Sessões e Locks** | 1 | 1 | C-GERAL-08 |
| 773 | **Gerenciar o Selo Gerado** | 1 | 1 | V-CCA.3.1 |
| 774 | **Gestão Financeira:** | 1 | 1 | C-FIN-11 |
| 775 | **Governança:** | 1 | 1 | C-MINUTA-06 |
| 776 | **Gravar / Confirmar** | 1 | 1 | C-FIN-03 |
| 777 | **Gravar / Salvar** | 1 | 1 | C-FIN-02 |
| 778 | **Gravar como Padrão** | 1 | 1 | C-CONFIG-05 |
| 779 | **Gravar Diagramação** | 1 | 1 | C-LIVRO-03 |
| 780 | **Gravar e Sincronizar Contador** | 1 | 1 | C-LIVRO-07 |
| 781 | **Gravar Fórmula** | 1 | 1 | C-GERAL-05 |
| 782 | **Gravar Lote** | 1 | 1 | D-3.8 |
| 783 | **Gravar Modelo** | 1 | 1 | C-MINUTA-04 |
| 784 | **Grupo de Permissões** | 1 | 1 | D-2.3 |
| 785 | **Grupos de Usuários** | 1 | 1 | R-23.0 |
| 786 | **Guia do Recibo:** | 1 | 1 | V-7.3.2 |
| 787 | **Guias** | 1 | 1 | M-16.1 |
| 788 | **Guichê** | 1 | 1 | D-3.10 |
| 789 | **Habilitação de Operadores** | 1 | 1 | C-ACESSO-08 |
| 790 | **Herdeiro** | 1 | 1 | C-CENTRAL-03 |
| 791 | **Histórico de Andamentos** | 1 | 1 | V-CCA.2.2 |
| 792 | **Histórico de Versões** | 1 | 1 | V-7.5.4 |
| 793 | **Histórico de Versões / Snapshots** | 1 | 1 | C-MINUTA-03 |
| 794 | **i** | 1 | 1 | V-CCA.1.1 |
| 795 | **IA e Inovação:** | 1 | 1 | C-MINUTA-05 |
| 796 | **Ícone de Imagem do Cartão** | 1 | 1 | V-CCA.2.2 |
| 797 | **Ícone de Indisponibilidade (CENIB)** | 1 | 1 | D-3.26 |
| 798 | **Identificação Civil** | 1 | 1 | C-GERAL-03 |
| 799 | **Identificação da Estação** | 1 | 1 | M-16.3 |
| 800 | **Identificação do Solicitante** | 1 | 1 | D-3.14 |
| 801 | **Identificação Notarial:** | 1 | 1 | R-34.0 |
| 802 | **Identificadores em Vermelho:** | 1 | 1 | V-7.2.2 |
| 803 | **Ignorar** | 1 | 1 | C-CONFIG-07 |
| 804 | **Imagens e arquivos em cache** | 1 | 1 | C-GERAL-08 |
| 805 | **Imagens e Ficheiros em Cache** | 1 | 1 | C-CERT-05 |
| 806 | **Importação e Processamento em Lote de Múltiplos Imóveis:** | 1 | 1 | V-5.2.1 |
| 807 | **Importar Dados** | 1 | 1 | D-3.57 |
| 808 | **Importar Minuta** | 1 | 1 | V-7.6.1 |
| 809 | **Importar Minuta Externa** | 1 | 1 | C-MINUTA-05 |
| 810 | **Importar Minuta Externa (.docx)** | 1 | 1 | C-MINUTA-03 |
| 811 | **Importar Nova Tabela** | 1 | 1 | D-3.49 |
| 812 | **Importar Permissões** | 1 | 1 | C-ACESSO-01 |
| 813 | **Impressão de Recibo Definitivo** | 1 | 1 | D-3.52 |
| 814 | **Impressão Prévia (Impressão Direta de Tela):** | 1 | 1 | V-7.3.1 |
| 815 | **Impressão/Confirmar** | 1 | 1 | D-3.11 |
| 816 | **Impressora de Certidões e Relatórios** | 1 | 1 | M-16.3 |
| 817 | **Impressora de Livros de Notas** | 1 | 1 | M-16.3 |
| 818 | **Imprimir / Exportar Extrato** | 1 | 1 | D-3.65 |
| 819 | **Imprimir Automaticamente após Conclusão** | 1 | 1 | D-1.9 |
| 820 | **Imprimir Definitivo** | 1 | 1 | D-3.16 |
| 821 | **Imprimir Etiqueta de Teste** | 1 | 1 | C-CONFIG-03 |
| 822 | **Imprimir Recibo de Entrega** | 1 | 1 | C-CENTRAL-10 |
| 823 | **Imprimir Termo de Cancelamento** | 1 | 1 | D-3.35 |
| 824 | **Imprimir Traslado** | 1 | 1 | D-3.36 |
| 825 | **Inativar / Excluir** | 1 | 1 | M-30.0 |
| 826 | **Inclusão da Imagem do Cartão de Assinatura Físico** | 1 | 1 | V-CCA.1.3 |
| 827 | **Inclusão de Profissão** | 1 | 1 | V-4.1.5 |
| 828 | **Incorporar Custas ao Protocolo Principal** | 1 | 1 | D-3.29 |
| 829 | **Indicadores Visuais Rápidos** | 1 | 1 | V-CCA.2.2 |
| 830 | **Indisponibilidade Positiva** | 1 | 1 | D-3.26 |
| 831 | **Infraestrutura:** | 1 | 1 | C-FIRMA-08 |
| 832 | **Iniciar Atendimento** | 1 | 1 | D-3.72 |
| 833 | **Iniciar Leitura** | 1 | 1 | D-3.6 |
| 834 | **Iniciar Transmissão de Selos** | 1 | 1 | D-3.54 |
| 835 | **Inserir / Atualizar Dados do Imóvel** | 1 | 1 | D-3.39 |
| 836 | **Inserir / Atualizar Qualificação das Partes** | 1 | 1 | D-3.38 |
| 837 | **Inserir Campo do Protocolo** | 1 | 1 | D-3.48 |
| 838 | **Inserir Variável** | 1 | 1 | C-MINUTA-04 |
| 839 | **Integração Externa / ONR - SAEC** | 1 | 1 | C-CENTRAL-14 |
| 840 | **Integrador Local da Siplan** | 1 | 1 | R-32.1 |
| 841 | **Interrogação (?)** | 1 | 1 | R-12.0 |
| 842 | **Intervalo de Datas** | 1 | 1 | D-3.59 |
| 843 | **Inutilizar Definitivamente o Papel de Segurança** | 1 | 1 | V-CCA.2.3 |
| 844 | **Inutilizar Papel** | 1 | 1 | M-9.3 |
| 845 | **Inutilizar Termo** | 1 | 1 | M-29.1 |
| 846 | **Inventário com Excesso de Quinhão** | 1 | 1 | C-GERAL-01 |
| 847 | **Item / Natureza das Custas** | 1 | 1 | V-3.1.4 |
| 848 | **Itens do lote** | 1 | 1 | M-32.0 |
| 849 | **Java** | 1 | 1 | V-7.4.3 |
| 850 | **Juros de mora** | 1 | 1 | M-16.11 |
| 851 | **Justificativa / Descrição da Operação** | 1 | 1 | M-51.5 |
| 852 | **Lançamentos Financeiros Vinculados** | 1 | 1 | D-9.0 |
| 853 | **Lançar e Imprimir** | 1 | 1 | M-14.2 |
| 854 | **Lançar Movimentação** | 1 | 1 | D-3.33 |
| 855 | **Lançar Novo Depósito** | 1 | 1 | D-3.51 |
| 856 | **Lápis** | 1 | 1 | V-2.4.3 |
| 857 | **Largura** | 1 | 1 | M-26.0 |
| 858 | **Layout da Página > Margens** | 1 | 1 | C-LIVRO-03 |
| 859 | **Legislação Fiscal:** | 1 | 1 | C-FIRMA-06 |
| 860 | **Liberar Bloqueio Forçado** | 1 | 1 | D-3.34 |
| 861 | **Limite de Crédito Mensal** | 1 | 1 | D-3.61 |
| 862 | **Limite Total Concedido** | 1 | 1 | D-3.65 |
| 863 | **Limpar Dados de Navegação** | 1 | 1 | C-CERT-05 |
| 864 | **Linguagem da Impressora** | 1 | 1 | M-70.1 |
| 865 | **link de acesso do ORION TN** | 1 | 1 | D-1.1 |
| 866 | **link do ORION TN** | 1 | 1 | D-2.1 |
| 867 | **Liquidar Fatura / Depósito em Conta Corrente** | 1 | 1 | C-FIN-10 |
| 868 | **Listagem completa por Tab** | 1 | 1 | V-2.2.2 |
| 869 | **Livro Concluído (Encerramento)** | 1 | 1 | C-LIVRO-05 |
| 870 | **Livro de Notas** | 1 | 1 | M-22.0 |
| 871 | **Livro de Notas Ativo** | 1 | 1 | D-3.41 |
| 872 | **Livro de Origem** | 1 | 1 | C-CENTRAL-11 |
| 873 | **Livro de Procurações** | 1 | 1 | M-22.0 |
| 874 | **Livro Pequeno** | 1 | 1 | R-30.0 |
| 875 | **Livros Notariais** | 1 | 1 | M-16.8 |
| 876 | **Lixeira** | 1 | 1 | V-4.2.3 |
| 877 | **Local de busca** | 1 | 1 | V-7.0.3 |
| 878 | **LOCALIZAR** | 1 | 1 | V-CCA.3.3 |
| 879 | **Localizar Certidão** | 1 | 1 | D-1.23 |
| 880 | **Localizar Certificado Instalado** | 1 | 1 | C-CONFIG-01 |
| 881 | **Locks de Concorrência (Sessão Presa)** | 1 | 1 | C-ATOS-08 |
| 882 | **Log de Erro Capturado:** | 1 | 1 | C-GERAL-09 |
| 883 | **MAIOR** | 1 | 1 | C-FIN-08 |
| 884 | **Mais Definições** | 1 | 1 | C-CERT-04 |
| 885 | **Manutenção Preventiva:** | 1 | 1 | C-CERT-05 |
| 886 | **Máquina** | 1 | 1 | D-2.14 |
| 887 | **Máquina Local** | 1 | 1 | C-CONFIG-01 |
| 888 | **Máquinas (estações)** | 1 | 1 | R-23.0 |
| 889 | **Marcar "Contém":** | 1 | 1 | V-6.1.1 |
| 890 | **Marcar esta chave como exportável** | 1 | 1 | C-CONFIG-01 |
| 891 | **Marcar Todas como Lidas** | 1 | 1 | D-3.71 |
| 892 | **Margem espelho** | 1 | 1 | V-7.0.4 |
| 893 | **Margens Superior e Esquerda** | 1 | 1 | M-26.0 |
| 894 | **Máscara de Formatação** | 1 | 1 | D-2.8 |
| 895 | **Materialização de Documento Eletrônico** | 1 | 1 | C-FIRMA-07 |
| 896 | **Matrícula do Imóvel** | 1 | 1 | M-56.0 |
| 897 | **Melhorias de Performance** | 1 | 1 | D-3.50 |
| 898 | **MENOR** | 1 | 1 | C-FIN-08 |
| 899 | **Mensagem de Alerta em Tela** | 1 | 1 | V-4.3.6 |
| 900 | **Mensalista Específico** | 1 | 1 | D-3.62 |
| 901 | **Mês/Ano de Exercício** | 1 | 1 | D-3.74 |
| 902 | **Método 1 (Autorização Direta por Supervisor):** | 1 | 1 | V-7.5.3 |
| 903 | **Método 1 (Digitação Preditiva)** | 1 | 1 | V-3.1.4 |
| 904 | **Método 1 (Documento Físico / Scanner):** | 1 | 1 | V-5.1.6 |
| 905 | **Método 2 (Alteração Manual de Status de Impressão):** | 1 | 1 | V-7.5.3 |
| 906 | **Método 2 (Arquivo Digital / Upload):** | 1 | 1 | V-5.1.6 |
| 907 | **Método 2 (Busca Geral via Tecla Tab)** | 1 | 1 | V-3.1.4 |
| 908 | **Método Alternativo (Caso a consulta tenha sido gerada sem posicionamento prévio do cursor):** | 1 | 1 | V-7.4.2 |
| 909 | **Metros Quadrados (m²)** | 1 | 1 | V-7.2.3 |
| 910 | **Minuta limpa** | 1 | 1 | V-7.0.5 |
| 911 | **Modalidade de Assinatura:** | 1 | 1 | V-7.1.3 |
| 912 | **Modelo Ativo / Visível** | 1 | 1 | C-MINUTA-06 |
| 913 | **modelos internos** | 1 | 1 | V-7.8.3 |
| 914 | **Modernização:** | 1 | 1 | C-CENTRAL-14 |
| 915 | **Modo de Cor** | 1 | 1 | C-CONFIG-05 |
| 916 | **Modo de Envio do Selo Digital** | 1 | 1 | C-SELO-03 |
| 917 | **Modo de Selagem Offline (Contingência)** | 1 | 1 | C-SELO-03 |
| 918 | **Modo Definitivo** | 1 | 1 | D-3.74 |
| 919 | **Modo Edição Direta (Ícone do Lápis / Caneta)** | 1 | 1 | V-2.4.3 |
| 920 | **Modo Geral / Compartilhado:** | 1 | 1 | V-6.2.2 |
| 921 | **Modo Rascunho** | 1 | 1 | D-3.74 |
| 922 | **Modo Restrito ao Usuário:** | 1 | 1 | V-6.2.2 |
| 923 | **Modo Somente Leitura (Ícone do Olho)** | 1 | 1 | V-2.4.3 |
| 924 | **Módulo** | 1 | 1 | D-3.53 |
| 925 | **Módulo e Versão:** | 1 | 1 | C-GERAL-09 |
| 926 | **Módulos > Selo Digital > Auditoria / Conferência Semanal** | 1 | 1 | C-SELO-01 |
| 927 | **Módulos > Selo Digital > Transmissão de Lote** | 1 | 1 | C-SELO-08 |
| 928 | **Módulos Integrados** | 1 | 1 | D-1.7 |
| 929 | **Moeda (R$)** | 1 | 1 | V-7.2.3 |
| 930 | **Momento Recomendado:** | 1 | 1 | V-7.3.1 |
| 931 | **Motivo do Impedimento** | 1 | 1 | M-27.0 |
| 932 | **Motivo Legal** | 1 | 1 | D-3.35 |
| 933 | **Motivo Legal da Gratuidade** | 1 | 1 | C-CERT-01 |
| 934 | **Movimentação > Sangria / Retirada de Caixa** | 1 | 1 | C-FIN-08 |
| 935 | **Movimentação > Suprimento de Caixa** | 1 | 1 | C-FIN-08 |
| 936 | **Movimentações > Atualizar Integração** | 1 | 1 | C-FIN-07 |
| 937 | **Multa por atraso** | 1 | 1 | M-16.11 |
| 938 | **Múltiplas Abas do Navegador:** | 1 | 1 | R-1.0 |
| 939 | **Município com Código IBGE** | 1 | 1 | C-CENTRAL-03 |
| 940 | **Mural / Orion Connect** | 1 | 1 | R-38.0 |
| 941 | **NÃO FECHE A GUIA DO NAVEGADOR MANUALMENTE** | 1 | 1 | V-7.4.3 |
| 942 | **não seja encontrada** | 1 | 1 | V-4.1.5 |
| 943 | **Naturezas de Atos Notariais** | 1 | 1 | C-GERAL-05 |
| 944 | **Naturezas Habilitadas** | 1 | 1 | C-ATOS-04 |
| 945 | **Navegação por Submenus:** | 1 | 1 | R-1.0 |
| 946 | **Negócio Jurídico** | 1 | 1 | R-1.2 |
| 947 | **Nenhuma** | 1 | 1 | V-7.1.3 |
| 948 | **NFS (Papel de Segurança)** | 1 | 1 | M-9.3 |
| 949 | **Nível de Ação** | 1 | 1 | D-3.68 |
| 950 | **Nome / Documento do Solicitante / Parte:** | 1 | 1 | R-34.0 |
| 951 | **Nome da Mãe** | 1 | 1 | V-4.2.3 |
| 952 | **Nome da Natureza** | 1 | 1 | D-3.47 |
| 953 | **Nome da Regra** | 1 | 1 | C-GERAL-05 |
| 954 | **Nome do Apresentante/Cliente** | 1 | 1 | D-3.13 |
| 955 | **Nome do Grupo** | 1 | 1 | D-2.2 |
| 956 | **Nome do Titular/Oficial** | 1 | 1 | D-2.10 |
| 957 | **Nome Empresarial** | 1 | 1 | D-3.56 |
| 958 | **Nome/CPF/Cartão** | 1 | 1 | D-3.11 |
| 959 | **Norma COAF:** | 1 | 1 | C-CENTRAL-01 |
| 960 | **Normal / Integral:** | 1 | 1 | V-3.2.1 |
| 961 | **Normas da CGJ:** | 1 | 1 | C-LIVRO-05 |
| 962 | **Normas Notariais:** | 1 | 1 | C-CENTRAL-11 |
| 963 | **Notas > Administração > Cadastrar Impedimento de Pessoa/Documento** | 1 | 1 | D-3.68 |
| 964 | **Notas > Administração > Comunicar Selos ao TJ** | 1 | 1 | D-3.54 |
| 965 | **Notas > Administração > Gerenciar Comissões de Escreventes** | 1 | 1 | D-3.55 |
| 966 | **Notas > Administração > Importar Arquivo de Protesto ou RC** | 1 | 1 | D-3.69 |
| 967 | **Notas > Administração > Registrar Serviço Interno** | 1 | 1 | D-3.66 |
| 968 | **Notas > Cadastros > Digitalização em Lote > Livros** | 1 | 1 | D-3.8 |
| 969 | **Notas > Cadastros auxiliares > Grupo de itens** | 1 | 1 | M-62.0 |
| 970 | **Notas > Cadastros auxiliares > Importação de arquivos** | 1 | 1 | M-58.0 |
| 971 | **Notas > Certidões > Consultar Certidões Solicitadas** | 1 | 1 | D-3.67 |
| 972 | **Notas > Consultas > Consulta de Selos Digitais** | 1 | 1 | D-3.53 |
| 973 | **Notas > Consultas > Consultar Editor e Documentos Gerados** | 1 | 1 | D-3.46 |
| 974 | **Notas > Consultas > Consultar protocolos** | 1 | 1 | M-52.0 |
| 975 | **Notas > Consultas > Consultar Selos Digitais Gerados** | 1 | 1 | D-3.73 |
| 976 | **Notas > Consultas > Índices de Protocolos** | 1 | 1 | D-3.44 |
| 977 | **Notas > Consultas > Pedidos de certidão** | 1 | 1 | M-53.0 |
| 978 | **Notas > Consultas > Saldos e Pendências Financeiras** | 1 | 1 | D-3.45 |
| 979 | **Notas > Dashboard de Protocolos** | 1 | 1 | D-3.1 |
| 980 | **Notas > Fechamento de Quinzena / Comunicações** | 1 | 1 | C-LIVRO-06 |
| 981 | **Notas > Livros** | 1 | 1 | M-21.0 |
| 982 | **Notas > Mensalistas > Cadastros de Mensalistas** | 1 | 1 | D-3.61 |
| 983 | **Notas > Mensalistas > Gerar Fatura de Mensalista** | 1 | 1 | D-3.62 |
| 984 | **Notas > Mensalistas > Importar Arquivo de Retorno** | 1 | 1 | D-3.63 |
| 985 | **Notas > Mensalistas > Manutenção de Fatura** | 1 | 1 | D-3.64 |
| 986 | **Notas > Mensalistas > Visualizar Extrato de Saldo** | 1 | 1 | D-3.65 |
| 987 | **Notas > Pedido de certidão > Consultar pedidos de certidão** | 1 | 1 | M-53.0 |
| 988 | **Notas > Pesquisa de Atos / Procurações** | 1 | 1 | C-ATOS-03 |
| 989 | **Notas > Relatórios > Livro de Depósito Prévio** | 1 | 1 | D-3.74 |
| 990 | **Notepad++** | 1 | 1 | C-CENTRAL-12 |
| 991 | **Notificações Automáticas** | 1 | 1 | M-16.10 |
| 992 | **Notificar Administrador em Caso de Falha de Transmissão** | 1 | 1 | D-3.76 |
| 993 | **Notificar via WhatsApp** | 1 | 1 | R-14.2 |
| 994 | **Nova Coleta Cartflow** | 1 | 1 | R-37.0 |
| 995 | **Nova Fórmula / Inserir** | 1 | 1 | C-GERAL-05 |
| 996 | **Nova Remessa para RI** | 1 | 1 | D-3.70 |
| 997 | **Nova Requisição de Certidão** | 1 | 1 | D-3.29 |
| 998 | **Novas Funcionalidades** | 1 | 1 | D-3.50 |
| 999 | **Novo Item de Custa** | 1 | 1 | C-ATOS-04 |
| 1000 | **Novo Livro (Abertura)** | 1 | 1 | C-LIVRO-05 |
| 1001 | **Numeração e Sequenciamento** | 1 | 1 | C-GERAL-04 |
| 1002 | **Número da Linha / Registro** | 1 | 1 | C-CENTRAL-12 |
| 1003 | **Número da Matrícula e Cartório de Registro de Imóveis (RI) Competente** | 1 | 1 | C-GERAL-06 |
| 1004 | **Número de Prenotação / Protocolo no RI** | 1 | 1 | D-3.70 |
| 1005 | **Número de Protocolo / Prenotação no RI** | 1 | 1 | C-CENTRAL-14 |
| 1006 | **Número do Fechamento** | 1 | 1 | D-1.16 |
| 1007 | **Número do Ofício / Processo Judicial** | 1 | 1 | M-27.0 |
| 1008 | **Número do RPS (Recibo Provisório de Serviços)** | 1 | 1 | V-3.4.4 |
| 1009 | **Número/Código do Documento** | 1 | 1 | D-3.28 |
| 1010 | **nunca divulga os códigos internos de rotina (`C-...`) ao usuário** | 1 | 1 | D-9.0 |
| 1011 | **Obrigações e Parâmetros Fiscais** | 1 | 1 | C-SELO-10 |
| 1012 | **Obrigações Legais** | 1 | 1 | R-14.1 |
| 1013 | **Observações / Justificativa Interna** | 1 | 1 | C-GERAL-04 |
| 1014 | **Ofício de Registro de Imóveis Competente** | 1 | 1 | C-CENTRAL-14 |
| 1015 | **Opção B - Captura Direta via Scanner** | 1 | 1 | V-CCA.1.3 |
| 1016 | **Opção C - Captura via Foto (Webcam)** | 1 | 1 | V-CCA.1.3 |
| 1017 | **Opções de Energia** | 1 | 1 | C-CONFIG-06 |
| 1018 | **Operação Regular / Sem Enquadramento** | 1 | 1 | M-51.5 |
| 1019 | **Operações Básicas** | 1 | 1 | C-ACESSO-06 |
| 1020 | **Operadores de Guichê** | 1 | 1 | C-ACESSO-04 |
| 1021 | **Ordem de Compra** | 1 | 1 | D-3.56 |
| 1022 | **Orientação** | 1 | 1 | M-26.0 |
| 1023 | **Orion Caixa > Administração > Consultas > Recibos** | 1 | 1 | R-29.0 |
| 1024 | **Orion Caixa > Administração > Pagamentos** | 1 | 1 | R-28.0 |
| 1025 | **Orion Caixa > Notas Fiscais > Listagem de RPS** | 1 | 1 | C-FIRMA-06 |
| 1026 | **Orion Editor** | 1 | 1 | V-7.2.3 |
| 1027 | **Orion Estoque > Livros Notariais > Controle de Folhas Soltas** | 1 | 1 | C-LIVRO-07 |
| 1028 | **Orion GED** | 1 | 1 | R-1.6 |
| 1029 | **Orion Stock** | 1 | 1 | R-1.6 |
| 1030 | **Orion TN / Orion Caixa** | 1 | 1 | C-FIN-04 |
| 1031 | **Outros Valores (Extranotariais)** | 1 | 1 | V-1.1.2 |
| 1032 | **Padrão Cadastral:** | 1 | 1 | C-LIVRO-06 |
| 1033 | **Padrão de Resposta:** | 1 | 1 | D-9.0 |
| 1034 | **Padronização:** | 1 | 1 | C-ATOS-07 |
| 1035 | **Pagamento Retroativo** | 1 | 1 | D-1.23 |
| 1036 | **Painel de Gestão e Auditoria** | 1 | 1 | R-38.0 |
| 1037 | **Painel Lateral de Diagnóstico** | 1 | 1 | R-14.1 |
| 1038 | **Painel Lateral Direito** | 1 | 1 | V-CCA.1.3 |
| 1039 | **Palavra-chave no Corpo** | 1 | 1 | D-3.46 |
| 1040 | **Papel da Parte** | 1 | 1 | D-3.20 |
| 1041 | **Papel de Segurança (NFS)** | 1 | 1 | M-16.1 |
| 1042 | **Para abrir o protocolo destravado para edição imediata (Ícone de Caneta):** | 1 | 1 | V-6.1.5 |
| 1043 | **Para abrir o protocolo em guia separada:** | 1 | 1 | V-6.1.3 |
| 1044 | **Para abrir o protocolo em modo de visualização segura (Ícone de Olho):** | 1 | 1 | V-6.1.5 |
| 1045 | **Para acompanhar o fluxo de tramitações do ato:** | 1 | 1 | V-6.2.1 |
| 1046 | **Para adicionar mais uma linha de contato (telefone ou e-mail adicional):** | 1 | 1 | V-4.2.3 |
| 1047 | **Para adicionar um novo imóvel em branco:** | 1 | 1 | V-5.1.5 |
| 1048 | **Para ajustar a quantidade de registros por página:** | 1 | 1 | V-6.1.3 |
| 1049 | **Para auditar os logs de alterações e exclusões (Rastreabilidade Completa):** | 1 | 1 | V-6.2.1 |
| 1050 | **Para busca avançada por nome das partes:** | 1 | 1 | V-6.1.1 |
| 1051 | **Para busca combinada por múltiplos parâmetros (atos abertos ou encerrados):** | 1 | 1 | V-6.2.3 |
| 1052 | **Para busca direta por número de protocolo:** | 1 | 1 | V-6.1.1 |
| 1053 | **Para busca imediata por número:** | 1 | 1 | V-6.2.3 |
| 1054 | **Para busca por CPF ou CNPJ:** | 1 | 1 | V-6.1.1 |
| 1055 | **Para busca por livro, folha ou outros critérios:** | 1 | 1 | V-6.2.4 |
| 1056 | **Para cadastrar um novo tipo de contato no sistema (ex.: 'Celular Recado'):** | 1 | 1 | V-4.2.3 |
| 1057 | **Para cancelar selos de atos específicos:** | 1 | 1 | R-9.0 |
| 1058 | **Para carregamento direto por número:** | 1 | 1 | V-6.2.4 |
| 1059 | **Para Cartórios que não utilizam a impressão pelo Editor do sistema** | 1 | 1 | V-3.1.2 |
| 1060 | **Para Cartórios que utilizam a impressão pelo Editor de Textos do ORION TN** | 1 | 1 | V-3.1.2 |
| 1061 | **Para clonar um imóvel já preenchido (cópia rápida):** | 1 | 1 | V-5.1.5 |
| 1062 | **Para Configurar o Envio Automático:** | 1 | 1 | R-11.0 |
| 1063 | **Para consultar arquivos já importados:** | 1 | 1 | R-31.0 |
| 1064 | **Para consultar ou estornar:** | 1 | 1 | R-23.0 |
| 1065 | **Para consultar pagamentos de certidões:** | 1 | 1 | R-5.0 |
| 1066 | **Para consultar saldos de escrituras (Notas):** | 1 | 1 | R-5.0 |
| 1067 | **Para definir um preço padrão:** | 1 | 1 | R-18.0 |
| 1068 | **Para duplicar o protocolo diretamente da pesquisa:** | 1 | 1 | V-6.1.5 |
| 1069 | **Para emitir recibo com pendência de assinaturas:** | 1 | 1 | V-3.4.6 |
| 1070 | **Para Envio Manual:** | 1 | 1 | R-11.0 |
| 1071 | **Para excluir um imóvel:** | 1 | 1 | V-5.1.5 |
| 1072 | **Para excluir um participante:** | 1 | 1 | V-4.3.3 |
| 1073 | **Para finalizar o ato após a coleta de todas as assinaturas:** | 1 | 1 | V-3.4.6 |
| 1074 | **Para gerar e imprimir relatório dos protocolos filtrados:** | 1 | 1 | V-6.1.5 |
| 1075 | **Para importar um novo arquivo de receita:** | 1 | 1 | R-31.0 |
| 1076 | **Para inutilizar um protocolo por completo:** | 1 | 1 | R-9.0 |
| 1077 | **Para liberar a digitação manual livre:** | 1 | 1 | V-3.2.5 |
| 1078 | **Para modificar:** | 1 | 1 | V-3.2.5 |
| 1079 | **Para monitorar o envio a Centrais Notariais e Órgãos Públicos:** | 1 | 1 | V-6.1.3 |
| 1080 | **Para ordenar a grade de resultados:** | 1 | 1 | V-6.1.3 |
| 1081 | **Para Papel de Segurança:** | 1 | 1 | V-2.0 |
| 1082 | **Para permitir valor variável no balcão:** | 1 | 1 | R-18.0 |
| 1083 | **Para pré-visualizar partes e cônjuge sem sair da tela:** | 1 | 1 | V-6.1.3 |
| 1084 | **Para realizar o recebimento no Caixa:** | 1 | 1 | R-5.0 |
| 1085 | **Para realizar qualquer alteração de valores em protocolo com recibo gerado:** | 1 | 1 | V-3.4.6 |
| 1086 | **Para Selos:** | 1 | 1 | V-2.0 |
| 1087 | **Para verificar o consumo de formulários/papéis de segurança:** | 1 | 1 | V-6.2.1 |
| 1088 | **Para visualizar a imagem do livro notarial digitalizado:** | 1 | 1 | V-6.2.1 |
| 1089 | **Parâmetros de Integração** | 1 | 1 | C-CONFIG-01 |
| 1090 | **Parâmetros do Módulo Firmas** | 1 | 1 | C-GERAL-04 |
| 1091 | **Parâmetros Notariais** | 1 | 1 | C-ACESSO-08 |
| 1092 | **Parceiro Comercial** | 1 | 1 | R-37.0 |
| 1093 | **Parcela Express** | 1 | 1 | D-1.8 |
| 1094 | **Parte casada com cônjuge cadastrado:** | 1 | 1 | V-4.4.2 |
| 1095 | **Partes do Imóvel / Transmissão** | 1 | 1 | C-CENTRAL-06 |
| 1096 | **Participação das Partes / Quinhões** | 1 | 1 | C-GERAL-07 |
| 1097 | **Participações Disponíveis** | 1 | 1 | M-44.0 |
| 1098 | **Participações do Perfil** | 1 | 1 | M-44.0 |
| 1099 | **Participações Permitidas / Papéis de Partes** | 1 | 1 | C-ATOS-05 |
| 1100 | **Passaporte** | 1 | 1 | V-4.2.3 |
| 1101 | **Pastinha / Procurar Arquivo** | 1 | 1 | V-5.2.1 |
| 1102 | **PEC Selos** | 1 | 1 | R-1.5 |
| 1103 | **Penalidade Administrativa:** | 1 | 1 | C-CENTRAL-10 |
| 1104 | **PEP / COAF** | 1 | 1 | R-1.3 |
| 1105 | **Percentual Transmitido (%)** | 1 | 1 | C-GERAL-07 |
| 1106 | **Perfil / Suporte** | 1 | 1 | R-1.7 |
| 1107 | **Permissões de Acesso / Usuários Autorizados** | 1 | 1 | C-MINUTA-06 |
| 1108 | **Permissões de Usuários** | 1 | 1 | C-MINUTA-02 |
| 1109 | **Permite troco** | 1 | 1 | M-31.0 |
| 1110 | **Permitir alteração de data do recibo** | 1 | 1 | C-FIN-13 |
| 1111 | **Permitir Estorno de Recibo** | 1 | 1 | C-FIN-02 |
| 1112 | **Pesquisar / Lupinha** | 1 | 1 | V-5.1.2 |
| 1113 | **Pessoa (CPF/Nome)** | 1 | 1 | D-3.68 |
| 1114 | **Pessoas** | 1 | 1 | V-1.0 |
| 1115 | **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos** | 1 | 1 | C-CENTRAL-02 |
| 1116 | **PEX** | 1 | 1 | R-1.5 |
| 1117 | **Por Dia** | 1 | 1 | D-3.59 |
| 1118 | **Por Máquina** | 1 | 1 | D-2.6 |
| 1119 | **PostgreSQL ODBC Driver (psqlodbc 32 bits)** | 1 | 1 | C-CONFIG-08 |
| 1120 | **PowerShell** | 1 | 1 | C-LIVRO-04 |
| 1121 | **Prazo Legal:** | 1 | 1 | C-SELO-01 |
| 1122 | **Prazo Máximo em Horas/Dias** | 1 | 1 | D-3.32 |
| 1123 | **Pré-visualizar o Livro** | 1 | 1 | V-7.3.1 |
| 1124 | **Pré-visualizar o Livro (Recomendado):** | 1 | 1 | V-7.3.1 |
| 1125 | **Pré-visualizar o Traslado** | 1 | 1 | V-7.2.2 |
| 1126 | **Preencher imóvel com a IA** | 1 | 1 | V-7.6.2 |
| 1127 | **Preencher/Fracionar todos os Alienantes e Adquirentes** | 1 | 1 | V-5.2.2 |
| 1128 | **Preenchimento de Filiação e Documentos Complementares / Estrangeiros:** | 1 | 1 | V-4.2.3 |
| 1129 | **Preenchimento do imóvel com IA** | 1 | 1 | V-5.1.6 |
| 1130 | **Prefeitura / Emissor Nacional** | 1 | 1 | C-FIN-05 |
| 1131 | **Prenotados no RI** | 1 | 1 | D-3.2 |
| 1132 | **Presencialmente** | 1 | 1 | V-7.1.3 |
| 1133 | **Preservar Formatação de Estilos Compatíveis** | 1 | 1 | C-MINUTA-05 |
| 1134 | **Preto e Branco** | 1 | 1 | M-16.2 |
| 1135 | **Prevenção Cadastral:** | 1 | 1 | C-CENTRAL-09 |
| 1136 | **Prévia de Traslado** | 1 | 1 | V-7.2.1 |
| 1137 | **Processar Arquivo de Retorno** | 1 | 1 | D-3.63 |
| 1138 | **Processar e Validar Importação** | 1 | 1 | D-3.69 |
| 1139 | **Processar Relatório** | 1 | 1 | D-3.58 |
| 1140 | **Processar Todos os Mensalistas** | 1 | 1 | D-3.62 |
| 1141 | **Procurações** | 1 | 1 | C-LIVRO-05 |
| 1142 | **Procurar / Pastinha** | 1 | 1 | V-5.1.6 |
| 1143 | **Produção** | 1 | 1 | M-16.5 |
| 1144 | **Produto Específico** | 1 | 1 | D-2.13 |
| 1145 | **Pronta para Retirada** | 1 | 1 | D-3.67 |
| 1146 | **Prontas para Retirada** | 1 | 1 | D-3.67 |
| 1147 | **Pronto** | 1 | 1 | M-53.0 |
| 1148 | **Propriedades** | 1 | 1 | C-CONFIG-08 |
| 1149 | **Proprietário / Permissão** | 1 | 1 | M-22.0 |
| 1150 | **Proprietário / Vendedor** | 1 | 1 | C-FIRMA-05 |
| 1151 | **Próxima Folha a Alimentar** | 1 | 1 | C-LIVRO-07 |
| 1152 | **Próximos 15 dias** | 1 | 1 | R-15.0 |
| 1153 | **Próximos 30 dias** | 1 | 1 | R-15.0 |
| 1154 | **QrCode** | 1 | 1 | M-15.0 |
| 1155 | **Qualificação Fiscal ITCMD** | 1 | 1 | C-GERAL-02 |
| 1156 | **Quando o Tomador for a mesma pessoa que o Solicitante:** | 1 | 1 | V-3.4.2 |
| 1157 | **Quando o Tomador for uma pessoa diferente do Solicitante:** | 1 | 1 | V-3.4.2 |
| 1158 | **Reabrir Minuta para Edição** | 1 | 1 | C-MINUTA-01 |
| 1159 | **Reabrir Pedido** | 1 | 1 | D-4.0 |
| 1160 | **Reaproveitamento de dados:** | 1 | 1 | V-4.3.3 |
| 1161 | **Reaproveitar dados do solicitante para o tomador** | 1 | 1 | V-3.4.2 |
| 1162 | **Recalcular / Atualizar Informações** | 1 | 1 | C-FIN-06 |
| 1163 | **Recalcular Saldos Diários e Subtotais Progressivos** | 1 | 1 | C-LIVRO-08 |
| 1164 | **Recibo de Custas** | 1 | 1 | V-3.4.4 |
| 1165 | **Recomendação de TI:** | 1 | 1 | C-SELO-08 |
| 1166 | **Reconhecimento de firma por semelhança sem valor econômico** | 1 | 1 | M-70.0 |
| 1167 | **Redefinir Senha Manualmente** | 1 | 1 | C-ACESSO-03 |
| 1168 | **Redetectar Fontes de Captura** | 1 | 1 | C-CONFIG-06 |
| 1169 | **Reenviar por E-mail** | 1 | 1 | M-33.3 |
| 1170 | **Referência de Homologação / Portaria Corregedoria** | 1 | 1 | C-ACESSO-08 |
| 1171 | **Regerar Dados Tributários do Protocolo** | 1 | 1 | C-GERAL-01 |
| 1172 | **Registrados** | 1 | 1 | D-3.2 |
| 1173 | **Registrar Folha Inutilizada** | 1 | 1 | D-3.36 |
| 1174 | **Regra Central:** | 1 | 1 | C-ATOS-01 |
| 1175 | **Regra de Ouro:** | 1 | 1 | C-MINUTA-03 |
| 1176 | **Regra Mandatória de Segurança:** | 1 | 1 | V-7.5.1 |
| 1177 | **Regra Tributária:** | 1 | 1 | C-FIN-05 |
| 1178 | **Reimportação Manual de Lote** | 1 | 1 | C-SELO-01 |
| 1179 | **Reimprimir Recibo** | 1 | 1 | M-53.0 |
| 1180 | **Reiniciar** | 1 | 1 | C-CONFIG-04 |
| 1181 | **Rejeitado** | 1 | 1 | M-32.0 |
| 1182 | **Relatórios > Conciliação Caixa vs. Livro Diário** | 1 | 1 | C-FIN-07 |
| 1183 | **Relatórios > Controle de Cheques** | 1 | 1 | D-1.17 |
| 1184 | **Relatórios > Fechamento PEX / ISS** | 1 | 1 | C-FIN-05 |
| 1185 | **Relatórios > Notas Fiscais / Listagem de RPS** | 1 | 1 | C-FIN-05 |
| 1186 | **Relatórios > Pedidos Pendentes** | 1 | 1 | C-FIN-07 |
| 1187 | **Relatórios > Relatório PEX / Fechamento Sinoreg** | 1 | 1 | C-FIN-06 |
| 1188 | **Remesclar Variáveis Dinâmicas** | 1 | 1 | C-MINUTA-02 |
| 1189 | **Remessa Eletrônica** | 1 | 1 | D-3.70 |
| 1190 | **Remessa Física por Portador** | 1 | 1 | D-3.70 |
| 1191 | **Remetente Individualizado do Escrevente** | 1 | 1 | V-2.3.3 |
| 1192 | **Remova todos os Enters (quebras de linha):** | 1 | 1 | C-CENTRAL-01 |
| 1193 | **Remover Aprovação** | 1 | 1 | R-37.1 |
| 1194 | **Remover Bloqueio / Reativar Ato** | 1 | 1 | C-ATOS-03 |
| 1195 | **Repositório Pessoal** | 1 | 1 | C-CONFIG-01 |
| 1196 | **Representado por Procurador** | 1 | 1 | M-51.3 |
| 1197 | **Reprocessar e Transmitir** | 1 | 1 | C-GERAL-03 |
| 1198 | **Reprocessar Lote de Firmas** | 1 | 1 | C-FIRMA-06 |
| 1199 | **Reprografia / Imagens do Livro** | 1 | 1 | D-3.15 |
| 1200 | **Requerente** | 1 | 1 | D-3.18 |
| 1201 | **Reservado** | 1 | 1 | V-CCA.2.3 |
| 1202 | **Resetar 2FA / Desvincular Dispositivo** | 1 | 1 | C-ACESSO-03 |
| 1203 | **Resolução Padrão** | 1 | 1 | C-CONFIG-05 |
| 1204 | **Responsabilidade Legal:** | 1 | 1 | C-CENTRAL-02 |
| 1205 | **Restauração de Minuta Travada** | 1 | 1 | C-MINUTA-03 |
| 1206 | **Restauração de Protocolo Marcado como Inutilizado por Engano** | 1 | 1 | C-ATOS-08 |
| 1207 | **Restrição:** | 1 | 1 | C-FIN-13 |
| 1208 | **Retificação de Selo Digital** | 1 | 1 | C-SELO-06 |
| 1209 | **Retificar / Editar Recibo** | 1 | 1 | C-FIN-13 |
| 1210 | **Retrato** | 1 | 1 | M-26.0 |
| 1211 | **Reutilização da Folha do Termo** | 1 | 1 | C-FIRMA-02 |
| 1212 | **Reutilizar / Clonar Texto** | 1 | 1 | D-3.46 |
| 1213 | **Reutilizar Folha do Livro** | 1 | 1 | M-29.1 |
| 1214 | **Reutilizar/Estornar** | 1 | 1 | M-9.3 |
| 1215 | **Revalidar Acervo Agora** | 1 | 1 | R-14.1 |
| 1216 | **Revalidar Consulta CENIB** | 1 | 1 | D-3.27 |
| 1217 | **Revalidar Numerações** | 1 | 1 | C-LIVRO-06 |
| 1218 | **RNE** | 1 | 1 | V-4.2.3 |
| 1219 | **Saídas / Emolumentos Consumidos** | 1 | 1 | M-57.0 |
| 1220 | **Sair / Encerrar** | 1 | 1 | C-CONFIG-07 |
| 1221 | **Saldo de Crédito Disponível** | 1 | 1 | D-3.65 |
| 1222 | **Saldo Devedor Residual** | 1 | 1 | D-3.52 |
| 1223 | **Saldo Pendente** | 1 | 1 | D-3.45 |
| 1224 | **Salto (Gap)** | 1 | 1 | M-26.0 |
| 1225 | **Salto de Numeração** | 1 | 1 | C-FIRMA-02 |
| 1226 | **Salvar / Baixar (Download)** | 1 | 1 | V-1.1.3 |
| 1227 | **Salvar Anexos** | 1 | 1 | D-3.31 |
| 1228 | **Salvar e Atualizar Índice** | 1 | 1 | C-ATOS-02 |
| 1229 | **Salvar e Enviar para SEFAZ** | 1 | 1 | D-3.7 |
| 1230 | **Salvar e Imprimir Termo de Abertura** | 1 | 1 | D-3.60 |
| 1231 | **Salvar e Publicar Tabela** | 1 | 1 | D-3.49 |
| 1232 | **Salvar e Transmitir** | 1 | 1 | C-CENTRAL-01 |
| 1233 | **Salvar Fluxo** | 1 | 1 | D-3.32 |
| 1234 | **Salvar Modelo** | 1 | 1 | D-3.48 |
| 1235 | **Salvar Partes** | 1 | 1 | R-1.3 |
| 1236 | **Salvar Versão** | 1 | 1 | V-7.5.4 |
| 1237 | **Salvar Vínculo** | 1 | 1 | C-CENTRAL-05 |
| 1238 | **Sangria** | 1 | 1 | D-1.21 |
| 1239 | **Scanner** | 1 | 1 | V-CCA.1.3 |
| 1240 | **Se o botão Concluir estiver desabilitado (cinza):** | 1 | 1 | V-5.1.4 |
| 1241 | **Se o nome da parte for diferente:** | 1 | 1 | V-4.4.1 |
| 1242 | **Se o nome da parte for idêntico:** | 1 | 1 | V-4.4.1 |
| 1243 | **Se possuir o arquivo no computador:** | 1 | 1 | V-4.2.5 |
| 1244 | **Se possuir scanner conectado:** | 1 | 1 | V-4.2.5 |
| 1245 | **Seção Final (Outras Informações):** | 1 | 1 | V-5.1.1 |
| 1246 | **Segurança Jurídica:** | 1 | 1 | C-ATOS-03 |
| 1247 | **Segurança Preventiva:** | 1 | 1 | C-FIRMA-03 |
| 1248 | **Selos com Envio Pendente** | 1 | 1 | C-SELO-01 |
| 1249 | **Sem Permissão** | 1 | 1 | D-2.2 |
| 1250 | **Sem Valor Econômico 1** | 1 | 1 | C-SELO-07 |
| 1251 | **Sem Valor Econômico 2** | 1 | 1 | C-SELO-07 |
| 1252 | **Senha Provisória** | 1 | 1 | C-ACESSO-01 |
| 1253 | **Série de Emissão** | 1 | 1 | C-FIN-05 |
| 1254 | **Service Desk 0800 da Siplan** | 1 | 1 | C-ATOS-08 |
| 1255 | **Serviços avulsos (ex.: certidões diversas)** | 1 | 1 | V-1.1.2 |
| 1256 | **Serviços tabelados (ex.: autenticações)** | 1 | 1 | V-1.1.2 |
| 1257 | **Sessões Ativas / Conexões** | 1 | 1 | C-ACESSO-02 |
| 1258 | **seta de mover para a direita (>)** | 1 | 1 | M-44.0 |
| 1259 | **seta para a esquerda (<)** | 1 | 1 | M-6.0 |
| 1260 | **Seta/Flexinha** | 1 | 1 | D-4.0 |
| 1261 | **Sinalizar Pendência** | 1 | 1 | R-37.1 |
| 1262 | **Sincronizar Credenciais com Orion TN** | 1 | 1 | C-ACESSO-04 |
| 1263 | **SÍNTESE DA SEÇÃO 5:** | 1 | 1 | D-9.0 |
| 1264 | **Siplan SGA** | 1 | 1 | R-1.4 |
| 1265 | **Situação: Pendentes de envio** | 1 | 1 | M-32.1 |
| 1266 | **Solicitadas/Pendentes** | 1 | 1 | D-3.67 |
| 1267 | **Start / Restart** | 1 | 1 | C-ACESSO-05 |
| 1268 | **Status da Transação** | 1 | 1 | D-1.18 |
| 1269 | **Status do Produto** | 1 | 1 | R-24.0 |
| 1270 | **Subscrever e Aplicar ao Protocolo** | 1 | 1 | D-3.25 |
| 1271 | **Substituto** | 1 | 1 | V-7.5.3 |
| 1272 | **Suporte de TI:** | 1 | 1 | C-LIVRO-04 |
| 1273 | **Suprimento** | 1 | 1 | D-1.20 |
| 1274 | **Sustentabilidade e Custos:** | 1 | 1 | C-LIVRO-03 |
| 1275 | **Tabela de Resultados** | 1 | 1 | V-CCA.2.1 |
| 1276 | **Tabelião Titular** | 1 | 1 | C-ACESSO-03 |
| 1277 | **Técnico** | 1 | 1 | V-5.2.1 |
| 1278 | **Telas e Rotinas** | 1 | 1 | D-2.2 |
| 1279 | **Termo / Número do Registro** | 1 | 1 | V-4.2.2 |
| 1280 | **Testamentos** | 1 | 1 | C-LIVRO-05 |
| 1281 | **Testar Conexão com WebService** | 1 | 1 | C-CONFIG-01 |
| 1282 | **Testar Leitura de Diretório** | 1 | 1 | C-FIRMA-08 |
| 1283 | **Testemunha Instrumentária** | 1 | 1 | C-ATOS-05 |
| 1284 | **Texto Corrido Jurídico** | 1 | 1 | D-3.38 |
| 1285 | **Texto salvo com sucesso** | 1 | 1 | V-7.1.2 |
| 1286 | **Tipo de Ato Praticado** | 1 | 1 | D-3.66 |
| 1287 | **Tipo de captura** | 1 | 1 | M-16.8 |
| 1288 | **Tipo de Consulta** | 1 | 1 | V-3.0 |
| 1289 | **Tipo de Inicialização** | 1 | 1 | C-ACESSO-05 |
| 1290 | **Tirar Foto** | 1 | 1 | V-CCA.1.3 |
| 1291 | **Titular da Conta** | 1 | 1 | D-1.11 |
| 1292 | **Titular do Imóvel** | 1 | 1 | C-CENTRAL-06 |
| 1293 | **TLS/SSL** | 1 | 1 | M-16.10 |
| 1294 | **Todas as Centrais** | 1 | 1 | R-14.1 |
| 1295 | **Todos os Usuários do Setor de Notas** | 1 | 1 | C-MINUTA-06 |
| 1296 | **Tomador do Recibo:** | 1 | 1 | V-7.3.2 |
| 1297 | **Tomador Padrão para Atos Não Identificados** | 1 | 1 | C-FIRMA-06 |
| 1298 | **Total das Custas e Emolumentos** | 1 | 1 | D-3.33 |
| 1299 | **Total de Pagamentos Efetuados** | 1 | 1 | D-3.33 |
| 1300 | **Tramitação** | 1 | 1 | V-6.2.1 |
| 1301 | **Trâmites e Andamentos** | 1 | 1 | M-51.0 |
| 1302 | **Transcrever por Extenso** | 1 | 1 | V-7.2.3 |
| 1303 | **Transcrição de valores por extenso** | 1 | 1 | V-7.0.3 |
| 1304 | **Transmitindo** | 1 | 1 | V-7.1.3 |
| 1305 | **Transmitir / Exportar para o SIRC** | 1 | 1 | C-CENTRAL-13 |
| 1306 | **Transmitir Declaração de Inocorrência ao SISCOAF** | 1 | 1 | C-CENTRAL-10 |
| 1307 | **Transmitir Escritura para o ONR** | 1 | 1 | C-CENTRAL-14 |
| 1308 | **Transmitir Fila de Selos Pendentes** | 1 | 1 | C-SELO-01 |
| 1309 | **Transmitir Lote de Contingência Acumulado** | 1 | 1 | C-SELO-03 |
| 1310 | **Transmitir Lote para a SEFAZ** | 1 | 1 | C-GERAL-01 |
| 1311 | **Transmitir via ONR** | 1 | 1 | R-14.0 |
| 1312 | **Traslado Digital em PDF** | 1 | 1 | R-14.0 |
| 1313 | **Triângulo de Alerta** | 1 | 1 | V-CCA.1.1 |
| 1314 | **Tribunal de Justiça** | 1 | 1 | V-3.4.5 |
| 1315 | **Tribunal de Justiça (TJ)** | 1 | 1 | V-7.3.2 |
| 1316 | **Última Hora** | 1 | 1 | C-GERAL-08 |
| 1317 | **Último número gerado** | 1 | 1 | M-16.4 |
| 1318 | **URL do Servidor SGA** | 1 | 1 | D-1.12 |
| 1319 | **Uso Exclusivo em Serviço Interno** | 1 | 1 | D-1.4 |
| 1320 | **Usuário Específico** | 1 | 1 | D-1.14 |
| 1321 | **Usuários e Perfis > Módulo Selos > Alternar Contingência** | 1 | 1 | C-SELO-03 |
| 1322 | **Usuários Individuais** | 1 | 1 | R-23.0 |
| 1323 | **Validação Estrutural:** | 1 | 1 | C-CENTRAL-03 |
| 1324 | **Validar / Testar Certificado** | 1 | 1 | M-32.2 |
| 1325 | **Validar Conexão com SIGNO** | 1 | 1 | C-CENTRAL-04 |
| 1326 | **Validar Inconsistências** | 1 | 1 | C-GERAL-06 |
| 1327 | **Validar Script** | 1 | 1 | M-70.1 |
| 1328 | **Valor Bruto dos Emolumentos** | 1 | 1 | M-16.9 |
| 1329 | **Valor Declarado/Econômico** | 1 | 1 | D-3.12 |
| 1330 | **Valor Depositado** | 1 | 1 | R-13.0 |
| 1331 | **Valor do Ato** | 1 | 1 | M-47.0 |
| 1332 | **Valor dos Emolumentos** | 1 | 1 | C-FIRMA-07 |
| 1333 | **Valor em Cheques** | 1 | 1 | D-1.19 |
| 1334 | **Valor Líquido** | 1 | 1 | M-16.9 |
| 1335 | **Valor mínimo para comunicação COAF** | 1 | 1 | M-16.12 |
| 1336 | **Valor Padrão** | 1 | 1 | D-1.6 |
| 1337 | **Valor-Base** | 1 | 1 | V-3.2.5 |
| 1338 | **Variáveis** | 1 | 1 | M-70.1 |
| 1339 | **Venda e Compra Simples** | 1 | 1 | V-7.8.1 |
| 1340 | **Verificação de Habilitação Comercial:** | 1 | 1 | V-5.2.1 |
| 1341 | **vermelho tachado** | 1 | 1 | V-7.5.4 |
| 1342 | **Versão do Sistema** | 1 | 1 | D-3.50 |
| 1343 | **Vincular** | 1 | 1 | C-CONFIG-01 |
| 1344 | **Vincular ao Livro Caixa** | 1 | 1 | D-1.5 |
| 1345 | **Vínculo com Naturezas** | 1 | 1 | C-MINUTA-02 |
| 1346 | **Visual C++ Redistributable (x86)** | 1 | 1 | C-CONFIG-08 |
| 1347 | **Visualização do QR Code** | 1 | 1 | V-3.4.5 |
| 1348 | **Visualização em Tela Cheia** | 1 | 1 | V-CCA.2.2 |
| 1349 | **Visualizar / Dados da Indisponibilidade** | 1 | 1 | V-4.4.3 |
| 1350 | **Visualizar Andamentos:** | 1 | 1 | R-29.0 |
| 1351 | **Visualizar Anexos e Imagens da Ficha** | 1 | 1 | V-CCA.2.2 |
| 1352 | **Visualizar Certidão** | 1 | 1 | D-3.26 |
| 1353 | **Visualizar Comprovante do TJ** | 1 | 1 | D-3.73 |
| 1354 | **Visualizar Detalhes / Imprimir:** | 1 | 1 | R-29.0 |
| 1355 | **Visualizar detalhes / Log** | 1 | 1 | M-58.0 |
| 1356 | **Visualizar e Imprimir Termo de Encerramento** | 1 | 1 | C-LIVRO-05 |
| 1357 | **Visualizar etiqueta** | 1 | 1 | M-12.0 |
| 1358 | **Visualizar Impressão** | 1 | 1 | C-LIVRO-03 |
| 1359 | **Webcam** | 1 | 1 | D-3.3 |
| 1360 | **Windows** | 1 | 1 | V-7.4.3 |
| 1361 | **XA** | 1 | 1 | R-9.0 |
| 1362 | **XML** | 1 | 1 | R-31.0 |
| 1363 | **ZPL** | 1 | 1 | M-70.1 |

## 5. Candidatos Similares Remanescentes no Nível 2 (Sørensen-Dice >= 0.65)

| # | Termo no Manual | Candidato Real na UI | Similaridade | Tipo | Onde (`where`) | Tela |
|---|---|---|---:|---|---|---|
| 1 | **Editar** | **Auditar** | 0.73 | `button` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 2 | **Orion Estoque** | **Estoque** | 0.67 | `title` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 3 | **Visualizar** | **Visualizar modelo** | 0.72 | `button` | `modal:Adicionar` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 4 | **Notas > Protocolo** | **Protocolo notas** | 0.86 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 5 | **Enter** | **ter.** | 0.67 | `column` | `root` | [069] Administração > Calendário |
| 6 | **Configurações > Parametrizações** | **Parametrizações** | 0.67 | `menu` | `menu` | [110] Configurações > Parametrizações |
| 7 | **Gerar Recibo** | **N° Recibo** | 0.67 | `field` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 8 | **Inativar** | **Inativos** | 0.71 | `field` | `root` | [010] Firmas > Cadastros > Sinal público |
| 9 | **Firmas > Cadastros > Cartão de assinatura** | **Cartão de assinatura** | 0.69 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 10 | **Número do Protocolo** | **Livro Protocolo** | 0.69 | `menu` | `menu` | [035] Relatórios > Livro Protocolo |
| 11 | **CPF/CNPJ** | **CPF ou CIN/CNPJ** | 0.67 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 12 | **Spooler de Impressão** | **Modo de impressão** | 0.69 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 13 | **Balcão de Firmas** | **Pedido de firmas** | 0.67 | `tab` | `root` | [110] Configurações > Parametrizações |
| 14 | **Firmas > Reconhecimento de firmas** | **Reconhecimento de firmas** | 0.87 | `menu` | `menu` | [006] Firmas > Reconhecimento de firmas |
| 15 | **Andamentos** | **EM ANDAMENTO** | 0.80 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 16 | **Salvar Protocolo** | **N° Protocolo** | 0.72 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 17 | **Imóveis** | **Reg. imóveis** | 0.75 | `column` | `root` | [015] Notas > Orçamento completo |
| 18 | **Pesquisar** | **Por pesquisa** | 0.74 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 19 | **Administração > Controle de Livros** | **Controle de Livros** | 0.71 | `menu` | `menu` | [060] Administração > Controle de Livros |
| 20 | **Notas > Orçamento completo** | **Orçamento completo** | 0.85 | `menu` | `menu` | [015] Notas > Orçamento completo |
| 21 | **Em aberto** | **Dias em aberto** | 0.76 | `field` | `accordion:Filtros` | [001] Dashboard > Atos Protocolares |
| 22 | **Qualificação** | **Bonificação** | 0.67 | `title` | `root` | [038] Administração > Comissões > Consulta indicação de mensalistas |
| 23 | **Notas > Consultas > Índice de escrituras e procurações** | **Índice de escrituras e procurações** | 0.80 | `menu` | `menu` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 24 | **Ativo** | **Inativos** | 0.73 | `field` | `root` | [010] Firmas > Cadastros > Sinal público |
| 25 | **Conclusão** | **Concluir** | 0.67 | `button` | `root` | [015] Notas > Orçamento completo |
| 26 | **Lavrado** | **Lado** | 0.67 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 27 | **Natureza do Ato** | **Natureza** | 0.67 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 28 | **PDF/A** | **PDF** | 0.67 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 29 | **Selecionar Arquivo** | **Selecionar um arquivo** | 0.92 | `tooltip` | `root` | [059] Administração > Importações de arquivos |
| 30 | **Assinaturas Pendentes** | **Assinatura pendente** | 0.89 | `field` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 31 | **Cancelado** | **Cancelar** | 0.80 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 32 | **Diligência** | **Vigência** | 0.75 | `field` | `root` | [015] Notas > Orçamento completo |
| 33 | **Gerar Protocolo** | **N° Protocolo** | 0.75 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 34 | **Consulta de Protocolos** | **Agenda de protocolos** | 0.70 | `menu` | `menu` | [004] Dashboard > Agenda de protocolos |
| 35 | **Comunicação pendente** | **COMUNICAÇÃO** | 0.69 | `column` | `root` | [003] Dashboard > Comunicações |
| 36 | **Enviar por E-mail** | **Notificar por e-mail** | 0.69 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 37 | **Preencher com IA** | **Preencher protocolo com I.A.** | 0.68 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 38 | **Coração** | **Geração** | 0.67 | `column` | `root` | [045] Administração > Comunicações > Selo digital |
| 39 | **Custas e Emolumentos** | **Sem emolumentos** | 0.67 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 40 | **Procuração** | **Procurador** | 0.67 | `field` | `modal:Adicionar` | [107] Configurações > Cadastros auxiliares > Tipo de representante |
| 41 | **Serviços** | **Serviço** | 0.92 | `column` | `root` | [005] Firmas > Abertura de pedido |
| 42 | **Impresso** | **Impressora** | 0.88 | `field` | `root` | [005] Firmas > Abertura de pedido |
| 43 | **Reimprimir** | **Imprimir** | 0.88 | `button` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 44 | **Notas > Protocolos em aberto** | **Protocolos em aberto** | 0.86 | `menu` | `menu` | [013] Notas > Protocolos em aberto |
| 45 | **Tipo de Livro** | **Tipo livro** | 0.86 | `field` | `root` | [060] Administração > Controle de Livros |
| 46 | **Inutilizar** | **Inutilizado** | 0.84 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 47 | **Nome / Razão Social** | **Razão social** | 0.81 | `field` | `root` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 48 | **Bloquear** | **Bloqueado** | 0.80 | `field` | `root` | [064] Administração > Mensalistas > Mensalistas |
| 49 | **Pendente** | **ATENDENTE** | 0.80 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 50 | **Tabela do Registro de Imóveis** | **Registro de Imóveis** | 0.78 | `column` | `root` | [016] Notas > Orçamento rápido |
| 51 | **Escrevente assinante** | **Escrevente assinante (Substituto):** | 0.78 | `field` | `root` | [014] Notas > Novo protocolo |
| 52 | **Estornar** | **Estorno** | 0.77 | `field` | `root` | [047] Administração > Comunicações > Recolhimento |
| 53 | **Encerramento:** | **Termos encerramento** | 0.76 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 54 | **Doação** | **Ação** | 0.75 | `field` | `root` | [070] Históricos |
| 55 | **Notas > Orçamentos** | **Orçamentos** | 0.75 | `menu` | `menu` | [020] Notas > Consultas > Orçamentos |
| 56 | **e-Notariado** | **Código E-Notariado** | 0.74 | `field` | `modal:Adicionar` | [095] Configurações > Cadastros auxiliares > Pessoa física > Estado civil |
| 57 | **Número do Pedido** | **Mês do pedido** | 0.74 | `field` | `root` | [023] Notas > Consultas > Certidões e serviços |
| 58 | **Nome Completo** | **Completo** | 0.74 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 59 | **Crédito** | **Editor** | 0.73 | `menu` | `menu` | [024] Notas > Consultas > Editor |
| 60 | **Salvar Parâmetros** | **Parâmetros** | 0.72 | `menu` | `menu` | [079] Configurações > Tabela de custas > Parâmetros |
| 61 | **Alteração** | **Geração** | 0.71 | `column` | `root` | [045] Administração > Comunicações > Selo digital |
| 62 | **Dados do Protocolo** | **Cadastro de protocolo** | 0.70 | `tooltip` | `root` | [021] Notas > Consultas > Protocolos |
| 63 | **Impressão em PDF** | **Impressão** | 0.70 | `tab` | `root` | [110] Configurações > Parametrizações |
| 64 | **Data do Casamento** | **Data cancelamento** | 0.69 | `column` | `root` | [042] Administração > Comunicações > COAF |
| 65 | **Detalhes** | **Detalhada** | 0.67 | `field` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 66 | **Com Pendência:** | **COM PENDÊNCIAS** | 0.96 | `column` | `root` | [003] Dashboard > Comunicações |
| 67 | **Representantes** | **Representante** | 0.96 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 68 | **Preencher Protocolo com IA** | **Preencher protocolo com I.A.** | 0.94 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 69 | **Concluir / Salvar** | **Salvar Concluir** | 0.93 | `tooltip` | `modal:Adicionar` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 70 | **Inativo** | **Inativos** | 0.92 | `field` | `root` | [010] Firmas > Cadastros > Sinal público |
| 71 | **Selecionar Arquivos** | **Selecionar um arquivo** | 0.89 | `tooltip` | `root` | [059] Administração > Importações de arquivos |
| 72 | **Data do recibo** | **Data recibo** | 0.87 | `field` | `root` | [014] Notas > Novo protocolo |
| 73 | **Nº do Protocolo** | **N° Protocolo** | 0.87 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 74 | **Agência** | **Nº agência** | 0.86 | `field` | `tab:Faturamento` | [110] Configurações > Parametrizações |
| 75 | **Escrituras para Registro** | **Envio de escrituras para Registro** | 0.84 | `menu` | `menu` | [049] Administração > Envio de escrituras para Registro |
| 76 | **Notas > Orçamento Rápido** | **Orçamento rápido** | 0.83 | `accordion` | `root` | [013] Notas > Protocolos em aberto |
| 77 | **Firmas > Cadastro > Pessoa jurídica** | **Cadastro de Pessoas Jurídicas** | 0.83 | `menu` | `menu` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 78 | **Notas > Consultas > Movimentação financeira por protocolo** | **Movimentação financeira por protocolo** | 0.82 | `menu` | `menu` | [022] Notas > Consultas > Movimentação financeira por protocolo |
| 79 | **Últimos serviços realizados** | **Serviços realizados** | 0.82 | `heading` | `root` | [006] Firmas > Reconhecimento de firmas |
| 80 | **Período de lavratura** | **Período de primeira lavratura** | 0.81 | `field` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 81 | **Adicionar Orçamento Completo** | **Adicionar orcamento** | 0.80 | `tooltip` | `root` | [020] Notas > Consultas > Orçamentos |
| 82 | **Adicionar Parte** | **Adicionar participante** | 0.80 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 83 | **Não comunicado:** | **Comunicado em** | 0.80 | `column` | `root` | [048] Administração > Comunicações > Auditoria de RPS |
| 84 | **Período de Apuração** | **Período de geração** | 0.80 | `field` | `root` | [045] Administração > Comunicações > Selo digital |
| 85 | **Novo lançamento** | **Tipo lançamento** | 0.79 | `field` | `root` | [037] Administração > Comissões > Consulta |
| 86 | **Saldo Atual** | **Saldo ato** | 0.78 | `field` | `root` | [037] Administração > Comissões > Consulta |
| 87 | **Protocolado no RI** | **Protocolo no R.I.** | 0.77 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 88 | **Salvar Configurações** | **Configurações** | 0.77 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 89 | **Tipo de Cobrança** | **Ciclo de cobrança** | 0.77 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 90 | **Incluir:** | **Concluir** | 0.77 | `button` | `root` | [015] Notas > Orçamento completo |
| 91 | **Tipo de Ato** | **Tipo ato DOI** | 0.76 | `field` | `modal:Adicionar` | [086] Configurações > Cadastros auxiliares > Espécie |
| 92 | **Iniciar Digitalização** | **Digitalização** | 0.75 | `heading` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 93 | **Consulta CNIB** | **Consulta** | 0.74 | `menu` | `menu` | [037] Administração > Comissões > Consulta |
| 94 | **Pesquisar por modelo** | **Por pesquisa** | 0.73 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 95 | **Tipo de Cálculo** | **Cálculo de custas** | 0.73 | `heading` | `root` | [110] Configurações > Parametrizações |
| 96 | **Enviar** | **Enviado** | 0.73 | `field` | `modal:Adicionar` | [010] Firmas > Cadastros > Sinal público |
| 97 | **Titular** | **Título** | 0.73 | `column` | `root` | [072] Configurações > Modelos de impressão > Enquadramento COAF |
| 98 | **Período de Referência** | **Mês de referência** | 0.72 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 99 | **Adicionar Imóvel** | **Adicionar item** | 0.71 | `tooltip` | `root` | [077] Configurações > Tabela de custas > Itens |
| 100 | **Importar** | **Exportar** | 0.71 | `button` | `root` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 101 | **LCW (Livro Caixa Web)** | **Livro caixa** | 0.71 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 102 | **Login de Acesso** | **Token de Acesso** | 0.71 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 103 | **Custas / Emolumentos** | **Sem emolumentos** | 0.71 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 104 | **Gerar Relatório** | **Exportar relatório** | 0.71 | `accordion` | `root` | [046] Administração > Comunicações > RPS |
| 105 | **Dia de fechamento** | **Fechamento de caixa** | 0.71 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 106 | **Cadastro de Outros Serviços** | **Outros serviços** | 0.70 | `heading` | `root` | [016] Notas > Orçamento rápido |
| 107 | **Valor Recebido** | **Recebido** | 0.70 | `field` | `modal:Adicionar` | [010] Firmas > Cadastros > Sinal público |
| 108 | **Administração > Financeiro > Tipos de movimentação financeira** | **Tipo de movimentação financeira** | 0.70 | `menu` | `menu` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 109 | **Biometria** | **Buscar biometria** | 0.70 | `button` | `root` | [006] Firmas > Reconhecimento de firmas |
| 110 | **Breve Relatório** | **Relatórios** | 0.70 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 111 | **Impressão prévia:** | **Impressão** | 0.70 | `tab` | `root` | [110] Configurações > Parametrizações |
| 112 | **Processar com IA** | **Processar** | 0.70 | `button` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 113 | **Nome do Modelo** | **Tipo de modelo** | 0.69 | `field` | `modal:Adicionar` | [072] Configurações > Modelos de impressão > Enquadramento COAF |
| 114 | **Número da Fatura** | **Número da folha** | 0.69 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 115 | **Total Geral** | **Total geral serviços** | 0.69 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 116 | **Estorno de Recolhimento** | **Data do recolhimento** | 0.68 | `column` | `root` | [047] Administração > Comunicações > Recolhimento |
| 117 | **Firmas > Consultas > Serviços Praticados** | **Serviços praticados** | 0.68 | `menu` | `menu` | [008] Firmas > Consultas > Serviços praticados |
| 118 | **Administração > Mensalistas** | **Administração** | 0.67 | `menu` | `menu` | [037] Administração > Comissões > Consulta |
| 119 | **Atendimento** | **ATENDENTE** | 0.67 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 120 | **Cancelar Fatura** | **Cancelar** | 0.67 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 121 | **Cancelar Pedido** | **Cancelar** | 0.67 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 122 | **Cartório de Casamento** | **Token do cartório** | 0.67 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 123 | **Código do Selo** | **Código do termo** | 0.67 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 124 | **Código HASH** | **Código** | 0.67 | `column` | `root` | [046] Administração > Comunicações > RPS |
| 125 | **Dados do Ato** | **Data do ato** | 0.67 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 126 | **Documentos / Anexos** | **Documento** | 0.67 | `field` | `root` | [005] Firmas > Abertura de pedido |
| 127 | **Formatar documento** | **Nº Documento** | 0.67 | `column` | `root` | [058] Administração > Cadastro de Impedimentos |
| 128 | **Importar Participantes** | **Adicionar participante** | 0.67 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 129 | **Imprimir Recibo** | **Imprimir** | 0.67 | `button` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 130 | **Inativo / Bloqueado** | **Bloqueado** | 0.67 | `field` | `root` | [064] Administração > Mensalistas > Mensalistas |
| 131 | **Inscrição Municipal (IPTU):** | **Insc. municipal** | 0.67 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 132 | **Inutilizar protocolo** | **Duplicar protocolo** | 0.67 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 133 | **Inutilizar selo** | **Inutilizado** | 0.67 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 134 | **NUNCA** | **Função** | 0.67 | `column` | `tab:Painel de atalhos` | [110] Configurações > Parametrizações |
| 135 | **Outorgante Vendedor** | **Outorgante** | 0.67 | `field` | `modal:Adicionar` | [092] Configurações > Cadastros auxiliares > Participação |
| 136 | **Período de Emissão** | **Período de aquisição:** | 0.67 | `field` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 137 | **Tipo de Saída** | **Tipo de certidão** | 0.67 | `column` | `root` | [023] Notas > Consultas > Certidões e serviços |
| 138 | **Certidões > Novo Pedido de Certidão** | **Utiliza pedidos de certidão** | 0.66 | `field` | `tab:Certidão` | [110] Configurações > Parametrizações |
| 139 | **Comunicações - Configurações** | **Outras comunicações** | 0.65 | `menu` | `menu` | [043] Administração > Comunicações > Outras comunicações |
| 140 | **Converter em Protocolo** | **Protocolos em aberto** | 0.65 | `menu` | `menu` | [013] Notas > Protocolos em aberto |
| 141 | **Relatórios > Índice por livro** | **Relatório - Índice por livros** | 0.96 | `title` | `root` | [032] Relatórios > Índice por livro |
| 142 | **Ativar Integração com SGA** | **Ativar integração com o SGA** | 0.96 | `field` | `tab:Produtos Orion` | [110] Configurações > Parametrizações |
| 143 | **Não Validado:** | **NÃO VALIDADOS** | 0.96 | `column` | `root` | [003] Dashboard > Comunicações |
| 144 | **Impedimento** | **Impedimentos** | 0.95 | `title` | `root` | [058] Administração > Cadastro de Impedimentos |
| 145 | **Inutilizados** | **Inutilizado** | 0.95 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 146 | **Dashboard > Envio para Registro** | **Dashboard de envio para registro** | 0.95 | `title` | `root` | [002] Dashboard > Envio para Registro |
| 147 | **Impressoras** | **Impressora** | 0.95 | `field` | `root` | [005] Firmas > Abertura de pedido |
| 148 | **Relatórios > Recolhimento Diário** | **Relatório - Recolhimento diário** | 0.95 | `title` | `root` | [028] Relatórios > Recolhimento diário |
| 149 | **Preencher protocolo com a IA** | **Preencher protocolo com I.A.** | 0.94 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 150 | **Orçamento** | **Orçamentos** | 0.94 | `menu` | `menu` | [020] Notas > Consultas > Orçamentos |
| 151 | **Perfis / Permissões** | **Perfis e permissões** | 0.94 | `title` | `root` | [108] Configurações > Perfis e permissões de acesso |
| 152 | **Consultar** | **Consulta** | 0.93 | `menu` | `menu` | [037] Administração > Comissões > Consulta |
| 153 | **Faturamento / Mensalista** | **Faturamento do mensalista** | 0.93 | `title` | `root` | [061] Administração > Mensalistas > Faturamento |
| 154 | **Salvar e Concluir** | **Salvar Concluir** | 0.93 | `tooltip` | `modal:Adicionar` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 155 | **Telefones** | **Telefone** | 0.93 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 156 | **Classificação Tributária / CST** | **Classificação tributária** | 0.92 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 157 | **Firmas > Termo de comparecimento > Tipos de documentos** | **Tipos de documento - Termo de comparecimento** | 0.91 | `heading` | `root` | [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento |
| 158 | **E-mails** | **E-mail** | 0.91 | `field` | `root` | [014] Notas > Novo protocolo |
| 159 | **Livro/Folha** | **Livro e folha** | 0.91 | `field` | `root` | [032] Relatórios > Índice por livro |
| 160 | **Selo Digital TJSP** | **Selo digital TJ-SP** | 0.91 | `title` | `root` | [045] Administração > Comunicações > Selo digital |
| 161 | **Totalizador** | **Totalizadores** | 0.91 | `button` | `root` | [045] Administração > Comunicações > Selo digital |
| 162 | **Protocolo de Notas** | **Protocolo notas** | 0.90 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 163 | **Cancelamento** | **Lançamento** | 0.90 | `column` | `root` | [061] Administração > Mensalistas > Faturamento |
| 164 | **Automático** | **Automática** | 0.89 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 165 | **Busca** | **Buscar** | 0.89 | `tooltip` | `root` | [015] Notas > Orçamento completo |
| 166 | **Livros** | **Livro** | 0.89 | `field` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 167 | **Modelo de etiqueta** | **Modelos de etiquetas** | 0.89 | `title` | `root` | [074] Configurações > Modelos de impressão > Etiquetas diversas |
| 168 | **Representante PJ** | **Representante** | 0.89 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 169 | **Data de Emissão** | **Data emissão** | 0.88 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 170 | **Exigir Dados Bancários** | **Exige dados bancários** | 0.88 | `field` | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 171 | **Data da Lavratura** | **Data de lavratura** | 0.88 | `column` | `root` | [042] Administração > Comunicações > COAF |
| 172 | **Tipo de Imóvel** | **Tipo Imóvel** | 0.87 | `field` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 173 | **Busca Fonética** | **Busca por fonética** | 0.87 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 174 | **Concluir e Salvar** | **Salvar Concluir** | 0.87 | `tooltip` | `modal:Adicionar` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 175 | **Forma do Cálculo** | **Forma de cálculo** | 0.87 | `field` | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 176 | **Notas - Certidões e Serviços** | **Certidões e serviços** | 0.86 | `title` | `root` | [017] Notas > Nova certidão e serviço |
| 177 | **"X" (Excluir)** | **Excluir** | 0.86 | `tooltip` | `root` | [051] Administração > Controle de Estoque > Distribuição |
| 178 | **(Tomadores)** | **Tomador** | 0.86 | `button` | `root` | [006] Firmas > Reconhecimento de firmas |
| 179 | **Comunicado** | **Comunicado em** | 0.86 | `column` | `root` | [048] Administração > Comunicações > Auditoria de RPS |
| 180 | **Configurações USB** | **Configurações** | 0.86 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 181 | **Total do ITBI:** | **Total ITBI** | 0.86 | `column` | `root` | [015] Notas > Orçamento completo |
| 182 | **Fichas / Cartões de Assinatura** | **Cartões de assinatura** | 0.85 | `heading` | `root` | [009] Firmas > Cadastros > Cartão de assinatura |
| 183 | **Adicionar Serviço (+)** | **Adicionar outro serviço** | 0.85 | `tooltip` | `root` | [091] Configurações > Cadastros auxiliares > Outros serviços |
| 184 | **Notas > Novo Protocolo** | **Protocolo notas** | 0.85 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 185 | **Comunicações > DOI** | **Comunicações** | 0.85 | `menu` | `menu` | [003] Dashboard > Comunicações |
| 186 | **Movimentação Financeira** | **Tipo de movimentação financeira** | 0.85 | `menu` | `menu` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 187 | **Firmas > Cartão de Assinatura** | **Cartão de assinatura** | 0.84 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 188 | **Partes / Cartão de assinatura** | **Cartão de assinatura** | 0.84 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 189 | **Escrevente Padrão (Notas)** | **Escrevente padrão** | 0.84 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 190 | **Mês e Ano de Referência** | **Mês de referência** | 0.84 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 191 | **Notas > Cadastro > Pessoa jurídica** | **Cadastro de Pessoas Jurídicas** | 0.84 | `menu` | `menu` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 192 | **Valor Total do Registro** | **Valor do registro** | 0.84 | `column` | `root` | [049] Administração > Envio de escrituras para Registro |
| 193 | **Lançamento Rápido:** | **Orçamento rápido** | 0.84 | `accordion` | `root` | [013] Notas > Protocolos em aberto |
| 194 | **Firmas > Cadastros > Tipo de documento - Termo de comparecimento** | **Tipos de documento - Termo de comparecimento** | 0.84 | `heading` | `root` | [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento |
| 195 | **Corpo do Texto:** | **Cor do Texto** | 0.83 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 196 | **Livro Caixa Web** | **Livro caixa** | 0.83 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 197 | **Testador** | **Estado** | 0.83 | `column` | `root` | [015] Notas > Orçamento completo |
| 198 | **Anexos e Documentos apresentados** | **Documentos apresentados** | 0.83 | `button` | `modal:Adicionar` | [089] Configurações > Cadastros auxiliares > Natureza |
| 199 | **Firmas > Abertura de pedido** | **Abertura de pedido** | 0.83 | `menu` | `menu` | [005] Firmas > Abertura de pedido |
| 200 | **"Iniciado"** | **Iniciado em** | 0.82 | `column` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 201 | **Dados bancários** | **Exige dados bancários** | 0.82 | `field` | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 202 | **Finalizado** | **Finalizar** | 0.82 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 203 | **Processado** | **Processar** | 0.82 | `button` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 204 | **Provedor** | **Provedor IA** | 0.82 | `field` | `tab:Inteligência Artificial` | [110] Configurações > Parametrizações |
| 205 | **Calcular Registro de Imóveis Automaticamente nos Orçamentos** | **Calcular valor de Registro de Imóveis de forma automática nos orçamentos** | 0.82 | `field` | `tab:Protocolo` | [110] Configurações > Parametrizações |
| 206 | **Emitir Termo de Abertura** | **Termo de abertura** | 0.82 | `tooltip` | `tab:Impressão` | [110] Configurações > Parametrizações |
| 207 | **Escrevente Padrão (Firmas)** | **Escrevente padrão** | 0.82 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 208 | **Tipo de Documento / Modelo** | **Tipo de documento** | 0.82 | `menu` | `menu` | [103] Configurações > Cadastros auxiliares > Tipo de documento |
| 209 | **Comunicados:** | **Comunicado em** | 0.82 | `column` | `root` | [048] Administração > Comunicações > Auditoria de RPS |
| 210 | **Quantidade (Qtd)** | **Quantidade** | 0.82 | `column` | `root` | [015] Notas > Orçamento completo |
| 211 | **Relatórios > PEX** | **Relatórios** | 0.82 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 212 | **Impressão de Etiquetas** | **Utiliza impressão de etiqueta** | 0.82 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 213 | **Notas > Cadastro > Impedimentos** | **Cadastro de Impedimentos** | 0.82 | `menu` | `menu` | [058] Administração > Cadastro de Impedimentos |
| 214 | **Dia de Referência** | **Mês de referência** | 0.81 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 215 | **Último Cartão Utilizado** | **Último utilizado** | 0.81 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 216 | **Sequência automática** | **Sequência de termo automática** | 0.81 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 217 | **"+" (Adicionar Serviço)** | **Adicionar outro serviço** | 0.80 | `tooltip` | `root` | [091] Configurações > Cadastros auxiliares > Outros serviços |
| 218 | **Atribuição** | **Distribuição** | 0.80 | `menu` | `menu` | [051] Administração > Controle de Estoque > Distribuição |
| 219 | **Cancelada** | **Cancelar** | 0.80 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 220 | **Com impedimento:** | **Impedimentos** | 0.80 | `title` | `root` | [058] Administração > Cadastro de Impedimentos |
| 221 | **Dados do pedido de certidão** | **Cadastro de pedido de certidão** | 0.80 | `tooltip` | `root` | [023] Notas > Consultas > Certidões e serviços |
| 222 | **Firmas > Cadastro > Impedimentos** | **Cadastro de Impedimentos** | 0.80 | `menu` | `menu` | [058] Administração > Cadastro de Impedimentos |
| 223 | **Obrigatório** | **Selo obrigatório** | 0.80 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 224 | **Perfis** | **Perfil** | 0.80 | `column` | `root` | [108] Configurações > Perfis e permissões de acesso |
| 225 | **Relatórios > Recolhimento** | **Relatório - Recolhimento diário** | 0.80 | `title` | `root` | [028] Relatórios > Recolhimento diário |
| 226 | **Sem impedimento:** | **Impedimentos** | 0.80 | `title` | `root` | [058] Administração > Cadastro de Impedimentos |
| 227 | **Solicitante (Nome)** | **Solicitante** | 0.80 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 228 | **Tipo de Distribuição** | **Grupos de distribuição** | 0.80 | `menu` | `menu` | [055] Administração > Controle de Estoque > Cadastros > Grupos de distribuição |
| 229 | **Total do Registro de Imóveis:** | **Registro de Imóveis** | 0.80 | `column` | `root` | [016] Notas > Orçamento rápido |
| 230 | **Valor (R$)** | **Valor** | 0.80 | `column` | `root` | [020] Notas > Consultas > Orçamentos |
| 231 | **Valor do Registro de Imóveis** | **Registro de Imóveis** | 0.80 | `column` | `root` | [016] Notas > Orçamento rápido |
| 232 | **Duplicar Ato / Novo Protocolo** | **Duplicar protocolo** | 0.79 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 233 | **Tabela de Custas Vigente** | **Tabela de custas** | 0.79 | `menu` | `menu` | [076] Configurações > Tabela de custas > Cálculos |
| 234 | **Data do Lançamento** | **Data cancelamento** | 0.79 | `column` | `root` | [042] Administração > Comunicações > COAF |
| 235 | **Notas > Escrituras para Registro** | **Envio de escrituras para Registro** | 0.79 | `menu` | `menu` | [049] Administração > Envio de escrituras para Registro |
| 236 | **Adicionar Imagem** | **Adicionar item** | 0.79 | `tooltip` | `root` | [077] Configurações > Tabela de custas > Itens |
| 237 | **Configurações > Modelo de Impressão** | **Configuração de impressão** | 0.79 | `menu` | `menu` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 238 | **SIGNO / Selo Digital** | **Selo digital** | 0.79 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 239 | **Relatórios > Recolhimento Resumido** | **Recolhimento resumido** | 0.78 | `menu` | `menu` | [031] Relatórios > Recolhimento resumido |
| 240 | **Normas do Registro de Imóveis:** | **Registro de Imóveis** | 0.78 | `column` | `root` | [016] Notas > Orçamento rápido |
| 241 | **Novo Orçamento** | **N° orçamento** | 0.78 | `field` | `root` | [020] Notas > Consultas > Orçamentos |
| 242 | **Relatórios > Relatório de Caixa** | **Relatórios de caixa** | 0.78 | `title` | `root` | [025] Relatórios > Fechamento de caixa |
| 243 | **Representado** | **Representante** | 0.78 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 244 | **Protocolado** | **Protocolo** | 0.78 | `title` | `root` | [014] Notas > Novo protocolo |
| 245 | **Solicitar** | **Solicitante** | 0.78 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 246 | **Testar Digitalização** | **Data digitalização** | 0.78 | `column` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 247 | **Token de Acesso (API Key)** | **Token de Acesso** | 0.78 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 248 | **Nome do Grupo de Distribuição** | **Grupos de distribuição** | 0.78 | `menu` | `menu` | [055] Administração > Controle de Estoque > Cadastros > Grupos de distribuição |
| 249 | **Calcular Registro de Imóveis Automaticamente nos Protocolos** | **Calcular valor de Registro de Imóveis de forma automática nos orçamentos** | 0.78 | `field` | `tab:Protocolo` | [110] Configurações > Parametrizações |
| 250 | **Configurações do SGA** | **Configurações** | 0.77 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 251 | **Configurações Gerais** | **Configurações** | 0.77 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 252 | **Número do Cartão** | **Número do carimbo** | 0.77 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 253 | **Possui Representante** | **Representante** | 0.77 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 254 | **Representante Padrão** | **Representante** | 0.77 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 255 | **Inscrição Municipal/Estadual** | **Inscrição estadual** | 0.77 | `field` | `modal:Adicionar` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 256 | **Tipo de Reconhecimento** | **Reconhecimento de firmas** | 0.77 | `menu` | `menu` | [006] Firmas > Reconhecimento de firmas |
| 257 | **Assina:** | **Assinante** | 0.77 | `column` | `root` | [109] Configurações > Usuários |
| 258 | **Calcular** | **Cálculo** | 0.77 | `column` | `root` | [005] Firmas > Abertura de pedido |
| 259 | **data de recebimento/envio** | **Data recebimento** | 0.77 | `field` | `modal:Adicionar` | [010] Firmas > Cadastros > Sinal público |
| 260 | **Novo Comunicado** | **Comunicado em** | 0.77 | `column` | `root` | [048] Administração > Comunicações > Auditoria de RPS |
| 261 | **Relatórios > Provedor de Pagamentos** | **Provedor de pagamento** | 0.77 | `field` | `modal:Adicionar` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 262 | **Setas de Movimentação** | **Tipo de movimentação** | 0.77 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 263 | **Setor Solicitante** | **Solicitante** | 0.77 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 264 | **Tabela de Custas Estadual** | **Tabela de custas** | 0.77 | `menu` | `menu` | [076] Configurações > Tabela de custas > Cálculos |
| 265 | **Todo o Período** | **Período do ato** | 0.77 | `field` | `root` | [042] Administração > Comunicações > COAF |
| 266 | **Para auditar a movimentação financeira do protocolo:** | **Movimentação financeira por protocolo** | 0.77 | `menu` | `menu` | [022] Notas > Consultas > Movimentação financeira por protocolo |
| 267 | **Envio para Registro de Imóveis** | **Envio para Registro** | 0.77 | `menu` | `menu` | [002] Dashboard > Envio para Registro |
| 268 | **Relatórios > Fechamento de Caixa** | **Fechamento de caixa** | 0.77 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 269 | **Busca por Nome:** | **Busca por** | 0.76 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 270 | **Inutilização** | **Inutilizado** | 0.76 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 271 | **menu principal** | **Principal** | 0.76 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 272 | **Período de Vencimento** | **Período de encerramento** | 0.76 | `field` | `root` | [060] Administração > Controle de Livros |
| 273 | **Valor fiscal** | **Valor Final** | 0.76 | `column` | `root` | [077] Configurações > Tabela de custas > Itens |
| 274 | **CPF / CNPJ ou Nome** | **CPF, CNPJ ou CIN** | 0.76 | `field` | `root` | [062] Administração > Mensalistas > Filiais |
| 275 | **Estornar Recibo** | **RECIBO ESTORNADO** | 0.76 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 276 | **Pedidos em aberto** | **Dias em aberto** | 0.76 | `field` | `accordion:Filtros` | [001] Dashboard > Atos Protocolares |
| 277 | **Importar Arquivos** | **Importação de arquivos** | 0.76 | `title` | `root` | [059] Administração > Importações de arquivos |
| 278 | **Total de Outros Serviços:** | **Outros serviços** | 0.76 | `heading` | `root` | [016] Notas > Orçamento rápido |
| 279 | **0,00%** | **R$ 0,00** | 0.75 | `heading` | `root` | [005] Firmas > Abertura de pedido |
| 280 | **Administração > Importação de Arquivos** | **Importação de arquivos** | 0.75 | `title` | `root` | [059] Administração > Importações de arquivos |
| 281 | **Administrador** | **Administração** | 0.75 | `menu` | `menu` | [037] Administração > Comissões > Consulta |
| 282 | **Atos do Protocolo** | **Atos Protocolares** | 0.75 | `menu` | `menu` | [001] Dashboard > Atos Protocolares |
| 283 | **Cadastrar** | **Cadastros** | 0.75 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 284 | **Campos Personalizados** | **Personalizado** | 0.75 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 285 | **Capturar Biometria** | **Buscar biometria** | 0.75 | `button` | `root` | [006] Firmas > Reconhecimento de firmas |
| 286 | **Código de Mensalista** | **Cód. mensalista** | 0.75 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 287 | **colado** | **Lado** | 0.75 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 288 | **Escrevente / Caixa** | **Escrevente** | 0.75 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 289 | **Escrevente/Autor** | **Escrevente** | 0.75 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 290 | **Faturar para Mensalista** | **Total por fatura mensalista** | 0.75 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 291 | **Final** | **Sinal** | 0.75 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 292 | **Inativados** | **Inativos** | 0.75 | `field` | `root` | [010] Firmas > Cadastros > Sinal público |
| 293 | **Integral** | **Integração** | 0.75 | `tab` | `modal:Adicionar` | [108] Configurações > Perfis e permissões de acesso |
| 294 | **Nome do Documento** | **Tipo de documento** | 0.75 | `menu` | `menu` | [103] Configurações > Cadastros auxiliares > Tipo de documento |
| 295 | **Novo Andamento** | **EM ANDAMENTO** | 0.75 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 296 | **Outras informações** | **Mais informações** | 0.75 | `tooltip` | `view:Informações` | [015] Notas > Orçamento completo |
| 297 | **Período / Data** | **Período do ato** | 0.75 | `field` | `root` | [042] Administração > Comunicações > COAF |
| 298 | **Período de Solicitação** | **Período de digitação** | 0.75 | `field` | `root` | [009] Firmas > Cadastros > Cartão de assinatura |
| 299 | **Por Usuário** | **Usuário** | 0.75 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 300 | **Representantes Legais** | **Representante** | 0.75 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 301 | **Selos Digitais** | **Selo digital** | 0.75 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 302 | **Senha Inicial** | **Folha inicial** | 0.75 | `column` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 303 | **Tipo de Selo** | **Tipo de modelo** | 0.75 | `field` | `modal:Adicionar` | [072] Configurações > Modelos de impressão > Enquadramento COAF |
| 304 | **Reaproveitar dados do solicitante** | **Dados do solicitante** | 0.75 | `heading` | `root` | [016] Notas > Orçamento rápido |
| 305 | **Atenção Tributária:** | **Situação Tributária** | 0.74 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 306 | **Localizar Protocolo** | **Duplicar protocolo** | 0.74 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 307 | **Novo Serviço Interno** | **Serviços Internos** | 0.74 | `menu` | `menu` | [100] Configurações > Cadastros auxiliares > Serviços Internos |
| 308 | **Cartão Inicial** | **Posição inicial** | 0.74 | `field` | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 309 | **Digitalizar / Anexar** | **Digitalizar ** | 0.74 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 310 | **Nº do Protocolo / Ato** | **N° Protocolo** | 0.74 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 311 | **Número do Lote** | **Número do livro** | 0.74 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 312 | **Valor Total do Ato** | **Valor total** | 0.74 | `column` | `root` | [015] Notas > Orçamento completo |
| 313 | **Firmas > Consultas > Reconhecimentos de firmas** | **Reconhecimentos de firmas** | 0.74 | `menu` | `menu` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 314 | **Auditoria de Sequência** | **Auditoria de Selos** | 0.74 | `menu` | `menu` | [044] Administração > Comunicações > Auditoria de Selos |
| 315 | **Cancelar Selo** | **Cancelar** | 0.74 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 316 | **Capturar foto** | **Capturar** | 0.74 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 317 | **Com Permissão** | **Comissão** | 0.74 | `title` | `root` | [037] Administração > Comissões > Consulta |
| 318 | **Configurações > Modelos de Impressão** | **Configuração de impressão** | 0.74 | `menu` | `menu` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 319 | **Guia de Recolhimento** | **Data do recolhimento** | 0.74 | `column` | `root` | [047] Administração > Comunicações > Recolhimento |
| 320 | **Mesmo do solicitante** | **Dados do solicitante** | 0.74 | `heading` | `root` | [016] Notas > Orçamento rápido |
| 321 | **Por Quinzena** | **Quinzenal** | 0.74 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 322 | **Retificado** | **Justificado** | 0.74 | `tooltip` | `modal:Adicionar` | [074] Configurações > Modelos de impressão > Etiquetas diversas |
| 323 | **SIGNO / CENSEC** | **SIGNO-CEP** | 0.74 | `button` | `view:Por comunicação` | [003] Dashboard > Comunicações |
| 324 | **Custas de Registro de Imóveis (RI)** | **Registro de Imóveis** | 0.73 | `column` | `root` | [016] Notas > Orçamento rápido |
| 325 | **Notas > Pedido de certidão** | **Utiliza pedidos de certidão** | 0.73 | `field` | `tab:Certidão` | [110] Configurações > Parametrizações |
| 326 | **Alterar configurações do plano** | **Mostrar configurações do scanner** | 0.73 | `field` | `tab:Captura e digitalização` | [110] Configurações > Parametrizações |
| 327 | **Conta Corrente** | **inputContaCorrente** | 0.73 | `field` | `tab:Faturamento` | [110] Configurações > Parametrizações |
| 328 | **Data da Distribuição** | **Distribuição** | 0.73 | `menu` | `menu` | [051] Administração > Controle de Estoque > Distribuição |
| 329 | **Inserir Selo Digital** | **Selo digital** | 0.73 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 330 | **Reconhecimento de firma por semelhança** | **Reconhecimento de firmas** | 0.73 | `menu` | `menu` | [006] Firmas > Reconhecimento de firmas |
| 331 | **Tela do Selo Digital:** | **Selo digital** | 0.73 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 332 | **Visualizar logs** | **Visualizar modelo** | 0.73 | `button` | `modal:Adicionar` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 333 | **Data Prevista de Entrega** | **Previsão de entrega** | 0.73 | `field` | `root` | [017] Notas > Nova certidão e serviço |
| 334 | **Escrevente/Usuário** | **checkBoxUsuarioEscrevente** | 0.73 | `field` | `modal:Adicionar` | [109] Configurações > Usuários |
| 335 | **Critério Padrão de Distribuição** | **Período de distribuição** | 0.73 | `field` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 336 | **Modelo Padrão de Comprovante de Pagamento** | **Comprovante de pagamento** | 0.73 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 337 | **Adicionar Sócio** | **Adicionar** | 0.73 | `button` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 338 | **Baixa / Pagamento** | **Pagamento** | 0.73 | `button` | `root` | [006] Firmas > Reconhecimento de firmas |
| 339 | **Configurações > Usuários** | **Configurações** | 0.73 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 340 | **Conta Principal** | **Principal** | 0.73 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 341 | **Corpo do Ato:** | **Tipo ato DOI** | 0.73 | `field` | `modal:Adicionar` | [086] Configurações > Cadastros auxiliares > Espécie |
| 342 | **Ficha Principal** | **Principal** | 0.73 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 343 | **Logs de Auditoria** | **Auditoria de Selos** | 0.73 | `menu` | `menu` | [044] Administração > Comunicações > Auditoria de Selos |
| 344 | **Porta** | **Portador** | 0.73 | `field` | `root` | [051] Administração > Controle de Estoque > Distribuição |
| 345 | **Processar Livro** | **Processar** | 0.73 | `button` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 346 | **SEMPRE** | **EMPRESA** | 0.73 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 347 | **Status do Ato** | **Data do ato** | 0.73 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 348 | **Transferência de Caixa** | **Transferência de imóveis** | 0.73 | `menu` | `menu` | [033] Relatórios > Transferência de imóveis |
| 349 | **Visualizar QR Code** | **Visualizar modelo** | 0.73 | `button` | `modal:Adicionar` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 350 | **Preenchimento do protocolo com IA:** | **Preencher protocolo com I.A.** | 0.72 | `accordion` | `root` | [014] Notas > Novo protocolo |
| 351 | **Adicionar Documento** | **Adicionar orcamento** | 0.72 | `tooltip` | `root` | [020] Notas > Consultas > Orçamentos |
| 352 | **Informações Adicionais** | **Mais informações** | 0.72 | `tooltip` | `view:Informações` | [015] Notas > Orçamento completo |
| 353 | **Firmas > Cadastros > Termo de Comparecimento** | **Termo de comparecimento** | 0.72 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 354 | **[x] Consulta de Serviços Praticados** | **Serviços praticados** | 0.72 | `menu` | `menu` | [008] Firmas > Consultas > Serviços praticados |
| 355 | **Administração > Controle de Estoque** | **Controle de Estoque** | 0.72 | `menu` | `menu` | [050] Administração > Controle de Estoque > Aquisição |
| 356 | **Fechamento** | **Fechamento fatura** | 0.72 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 357 | **Gravar Parâmetros** | **Parâmetros** | 0.72 | `menu` | `menu` | [079] Configurações > Tabela de custas > Parâmetros |
| 358 | **Histórico de atos** | **Históricos** | 0.72 | `menu` | `menu` | [070] Históricos |
| 359 | **Impressora de Etiquetas** | **Utiliza impressão de etiqueta** | 0.72 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 360 | **ISS Municipal** | **Insc. municipal** | 0.72 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 361 | **Mensalista (Matriz)** | **Mensalista** | 0.72 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 362 | **Nome do arquivo** | **Novo arquivo** | 0.72 | `button` | `root` | [059] Administração > Importações de arquivos |
| 363 | **Percentual de ISS** | **Percentual** | 0.72 | `field` | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 364 | **Salvar Orçamento** | **N° orçamento** | 0.72 | `field` | `root` | [020] Notas > Consultas > Orçamentos |
| 365 | **Base do CGI (Cadastro Geral de Impedimentos):** | **Cadastro de Impedimentos** | 0.72 | `menu` | `menu` | [058] Administração > Cadastro de Impedimentos |
| 366 | **Capacidade Total de Folhas** | **Total de folhas** | 0.72 | `field` | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 367 | **Conta para Depósito Prévio** | **Depósito prévio** | 0.72 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 368 | **Denominação da Serventia** | **Nome da serventia** | 0.72 | `field` | `root` | [071] Configurações > Dados do cartório |
| 369 | **Período de Entrada** | **Período de encerramento** | 0.72 | `field` | `root` | [060] Administração > Controle de Livros |
| 370 | **Período de importação** | **Período de digitação** | 0.72 | `field` | `root` | [009] Firmas > Cadastros > Cartão de assinatura |
| 371 | **Reiniciar Serviço** | **Iniciar serviço do Signo** | 0.72 | `tooltip` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 372 | **Relatórios > Livro Protocolo** | **Livro Protocolo** | 0.72 | `menu` | `menu` | [035] Relatórios > Livro Protocolo |
| 373 | **Cartório de Registro de Imóveis (CRI)** | **Cartório de registro** | 0.72 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 374 | **Notas > Cadastros auxiliares > Alíquota** | **Cadastros auxiliares** | 0.72 | `menu` | `menu` | [082] Configurações > Cadastros auxiliares > Alíquotas |
| 375 | **Notas > Cadastros auxiliares > Espécies** | **Cadastros auxiliares** | 0.72 | `menu` | `menu` | [082] Configurações > Cadastros auxiliares > Alíquotas |
| 376 | **Opção A - Importar de Pasta (Arquivo)** | **Importação de arquivos** | 0.72 | `title` | `root` | [059] Administração > Importações de arquivos |
| 377 | **Buscar Ato** | **Buscar** | 0.71 | `tooltip` | `root` | [015] Notas > Orçamento completo |
| 378 | **Copiar URL** | **Copiar** | 0.71 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 379 | **Livro Caixa Web (LCW)** | **Livro caixa** | 0.71 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 380 | **Salvar Impedimento** | **Impedimentos** | 0.71 | `title` | `root` | [058] Administração > Cadastro de Impedimentos |
| 381 | **Solicitante / Tomador** | **Solicitante** | 0.71 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 382 | **Solicitante Interno** | **Solicitante** | 0.71 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 383 | **Total do Período** | **Período do ato** | 0.71 | `field` | `root` | [042] Administração > Comunicações > COAF |
| 384 | **Mensalistas > Faturamento de Convênios** | **Faturamento do mensalista** | 0.71 | `title` | `root` | [061] Administração > Mensalistas > Faturamento |
| 385 | **PEP (Pessoa Exposta Politicamente)** | **Politicamente exposta (Prov. 88)** | 0.71 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 386 | **Autenticação de cópia** | **Autenticação** | 0.71 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 387 | **Cartório de Origem** | **Cartório de R.I** | 0.71 | `column` | `root` | [049] Administração > Envio de escrituras para Registro |
| 388 | **CCN / e-Notariado** | **Código E-Notariado** | 0.71 | `field` | `modal:Adicionar` | [095] Configurações > Cadastros auxiliares > Pessoa física > Estado civil |
| 389 | **Estornar Distribuição** | **Distribuição** | 0.71 | `menu` | `menu` | [051] Administração > Controle de Estoque > Distribuição |
| 390 | **Folhas Inicial/Final** | **Folha inicial** | 0.71 | `column` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 391 | **Tipo da Parte** | **Tipo da participação** | 0.71 | `field` | `accordion:Mais filtros` | [021] Notas > Consultas > Protocolos |
| 392 | **Visualizar termo** | **Visualizar modelo** | 0.71 | `button` | `modal:Adicionar` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 393 | **Administração > Auditoria de Selos** | **Auditoria de Selos** | 0.71 | `menu` | `menu` | [044] Administração > Comunicações > Auditoria de Selos |
| 394 | **Pesquisar por forma de pagamento** | **Forma de pagamento** | 0.71 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 395 | **Faturamento > Mensalistas > Emissão de Boletos** | **Faturamento do mensalista** | 0.71 | `title` | `root` | [061] Administração > Mensalistas > Faturamento |
| 396 | **Firmas > Atendimento > Termo de comparecimento** | **Tipos de documento - Termo de comparecimento** | 0.71 | `heading` | `root` | [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento |
| 397 | **Adicionar Representante** | **Representante** | 0.71 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 398 | **Especialidade de Origem** | **Especialidade** | 0.71 | `column` | `root` | [024] Notas > Consultas > Editor |
| 399 | **Fé Pública:** | **M. Público** | 0.71 | `column` | `root` | [015] Notas > Orçamento completo |
| 400 | **Layout de Impressão** | **Modo de impressão** | 0.71 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 401 | **Modelo Padrão de Minuta** | **Modelo Padrão** | 0.71 | `column` | `root` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 402 | **Novo Pedido** | **Nº pedido** | 0.71 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 403 | **Permissões:** | **Comissões** | 0.71 | `menu` | `menu` | [037] Administração > Comissões > Consulta |
| 404 | **Selecionar documentos** | **selecionarTodos** | 0.71 | `field` | `root` | [005] Firmas > Abertura de pedido |
| 405 | **Tipo de Aplicação** | **Tipo de comunicação** | 0.71 | `field` | `root` | [042] Administração > Comunicações > COAF |
| 406 | **Título do Documento** | **Tipo de documento** | 0.71 | `menu` | `menu` | [103] Configurações > Cadastros auxiliares > Tipo de documento |
| 407 | **Unificar Especialidades** | **Especialidade** | 0.71 | `column` | `root` | [024] Notas > Consultas > Editor |
| 408 | **Firmas > Cadastro > Cartão de assinatura** | **Cartão de assinatura** | 0.70 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 409 | **Notas > Cadastros auxiliares > Naturezas** | **Cadastros auxiliares** | 0.70 | `menu` | `menu` | [082] Configurações > Cadastros auxiliares > Alíquotas |
| 410 | **Data de Expedição/Emissão** | **Data Expedição** | 0.70 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 411 | **Estornar Recibo / Excluir** | **RECIBO ESTORNADO** | 0.70 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 412 | **Imprimir Livro Definitivo** | **Imprimir Livro** | 0.70 | `tooltip` | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 413 | **Consumir papel** | **Consumir** | 0.70 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 414 | **Exportar Arquivo (.DEC)** | **Importação de arquivos** | 0.70 | `title` | `root` | [059] Administração > Importações de arquivos |
| 415 | **Folha Atual** | **Senha atual** | 0.70 | `field` | `root` | [111] Olá, [usuário] > Alterar senha |
| 416 | **Gerar Traslado** | **Traslado** | 0.70 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 417 | **Histórico de Lançamentos** | **Tipo de lançamento** | 0.70 | `field` | `root` | [022] Notas > Consultas > Movimentação financeira por protocolo |
| 418 | **Imprimir Teste** | **Imprimir** | 0.70 | `button` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 419 | **Novo Cadastro** | **Cadastros** | 0.70 | `menu` | `menu` | [009] Firmas > Cadastros > Cartão de assinatura |
| 420 | **Novo Modelo** | **Tipo modelo** | 0.70 | `field` | `root` | [073] Configurações > Modelos de impressão > Listagens diversas |
| 421 | **Poder Público** | **M. Público** | 0.70 | `column` | `root` | [015] Notas > Orçamento completo |
| 422 | **Preferências de Impressão** | **Mês de referência** | 0.70 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 423 | **Testar Captura** | **Capturar** | 0.70 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 424 | **Traslado / 2ª Via** | **Traslado** | 0.70 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 425 | **Acervo Histórico:** | **Histórico** | 0.70 | `title` | `root` | [070] Históricos |
| 426 | **Configurações > Painel de Atalhos** | **Painel de atalhos** | 0.70 | `tab` | `root` | [110] Configurações > Parametrizações |
| 427 | **Data Inicial** | **Folha inicial** | 0.70 | `column` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 428 | **Descrição/Motivo** | **Descrição** | 0.70 | `field` | `root` | [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento |
| 429 | **Finalizar Pedido** | **Finalizar** | 0.70 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 430 | **Finalizar Tarefa** | **Finalizar** | 0.70 | `button` | `root` | [005] Firmas > Abertura de pedido |
| 431 | **Firmas > Consultas** | **Consultas** | 0.70 | `menu` | `menu` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 432 | **Identificação:** | **Autenticação** | 0.70 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 433 | **Nome do Pai** | **Nome do perfil** | 0.70 | `field` | `modal:Adicionar` | [108] Configurações > Perfis e permissões de acesso |
| 434 | **Participantes** | **Participação** | 0.70 | `menu` | `menu` | [092] Configurações > Cadastros auxiliares > Participação |
| 435 | **Acessar Protocolo** | **N° Protocolo** | 0.69 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 436 | **Aprovar Documento** | **Nº Documento** | 0.69 | `column` | `root` | [058] Administração > Cadastro de Impedimentos |
| 437 | **Assinatura Digital** | **Assinatura** | 0.69 | `field` | `tab:Impressão` | [110] Configurações > Parametrizações |
| 438 | **Busca no Arquivo** | **Novo arquivo** | 0.69 | `button` | `root` | [059] Administração > Importações de arquivos |
| 439 | **Cadastros > Pessoas Físicas** | **Cadastro de Pessoas Jurídicas** | 0.69 | `menu` | `menu` | [066] Administração > Cadastro de Pessoas Jurídicas |
| 440 | **Cliente Mensalista** | **Mensalista** | 0.69 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 441 | **Data de Nascimento** | **Nascimento** | 0.69 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 442 | **Encaminhar para Registro de Imóveis** | **Registro de Imóveis** | 0.69 | `column` | `root` | [016] Notas > Orçamento rápido |
| 443 | **Nome do Mensalista** | **Mensalista** | 0.69 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 444 | **Observação Crítica:** | **Observação** | 0.69 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 445 | **Salvar Andamento** | **EM ANDAMENTO** | 0.69 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 446 | **Complemento de Folha** | **Complemento** | 0.69 | `field` | `root` | [014] Notas > Novo protocolo |
| 447 | **Requisição Judicial** | **Requisição N°** | 0.69 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
| 448 | **Total de Custas** | **Tabela de custas** | 0.69 | `menu` | `menu` | [076] Configurações > Tabela de custas > Cálculos |
| 449 | **Faturamento > Mensalistas > Conta Corrente** | **Faturamento do mensalista** | 0.69 | `title` | `root` | [061] Administração > Mensalistas > Faturamento |
| 450 | **Código do Selo Digital** | **Selo digital** | 0.69 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 451 | **Configuração de Página** | **Configuração** | 0.69 | `field` | `modal:Adicionar` | [074] Configurações > Modelos de impressão > Etiquetas diversas |
| 452 | **Número do documento** | **Outro documento** | 0.69 | `field` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 453 | **Número do Selo Digital** | **Selo digital** | 0.69 | `field` | `root` | [044] Administração > Comunicações > Auditoria de Selos |
| 454 | **Permitir Estorno de Recolhimento Definitivo** | **Recolhimento definitivo** | 0.69 | `field` | `root` | [026] Relatórios > PEX - TJ/SP |
| 455 | **Segurança / Autenticação** | **Autenticação** | 0.69 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 456 | **Abertura de Caixa** | **Abertura de chamados** | 0.69 | `tab` | `modal:Adicionar` | [108] Configurações > Perfis e permissões de acesso |
| 457 | **Classificação:** | **Classificação tributária** | 0.69 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 458 | **Configurações de Captura** | **Configurações** | 0.69 | `menu` | `menu` | [071] Configurações > Dados do cartório |
| 459 | **Dias de fechamento** | **Fechamento de caixa** | 0.69 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 460 | **Gerar Relatório PEX** | **Exportar relatório** | 0.69 | `accordion` | `root` | [046] Administração > Comunicações > RPS |
| 461 | **Relatórios > Relatório ISS** | **Relatório ISS** | 0.69 | `menu` | `menu` | [036] Relatórios > Relatório ISS |
| 462 | **Código do Cedente/Convênio** | **Código cedente** | 0.68 | `field` | `tab:Faturamento` | [110] Configurações > Parametrizações |
| 463 | **Parte / Participante** | **Adicionar participante** | 0.68 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 464 | **Recibo Definitivo** | **Recolhimento definitivo** | 0.68 | `field` | `root` | [026] Relatórios > PEX - TJ/SP |
| 465 | **Data da Lavratura Original** | **Data de lavratura** | 0.68 | `column` | `root` | [042] Administração > Comunicações > COAF |
| 466 | **Menu de Pagamentos > Notas** | **Formas de pagamento** | 0.68 | `menu` | `menu` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 467 | **Ajustar à Área de Impressão** | **Status de impressão** | 0.68 | `field` | `root` | [024] Notas > Consultas > Editor |
| 468 | **LibreOffice Online** | **selectFonteLibreOfficeOnline** | 0.68 | `field` | `tab:Editor` | [110] Configurações > Parametrizações |
| 469 | **Concluir o pedido** | **No momento que concluir o pedido** | 0.68 | `field` | `tab:Comissões e mensalistas` | [110] Configurações > Parametrizações |
| 470 | **Notas > Orçamento > Orçamento Completo** | **Orçamento completo** | 0.68 | `menu` | `menu` | [015] Notas > Orçamento completo |
| 471 | **Caixa > Parâmetros > Formas de pagamento** | **Formas de pagamento** | 0.68 | `menu` | `menu` | [088] Configurações > Cadastros auxiliares > Formas de pagamento |
| 472 | **Modelo Padrão de Fechamento de Caixa** | **Fechamento de caixa** | 0.68 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 473 | **Imprimir Etiqueta de Ressalva** | **Utiliza impressão de etiqueta** | 0.68 | `field` | `tab:Pedido de firmas` | [110] Configurações > Parametrizações |
| 474 | **Firmas > Consultas > Termos de comparecimento** | **Termo de comparecimento** | 0.68 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 475 | **Alíquota padrão** | **Alíquota** | 0.67 | `title` | `root` | [082] Configurações > Cadastros auxiliares > Alíquotas |
| 476 | **Alteração de usuário** | **Alteração de senha** | 0.67 | `title` | `root` | [111] Olá, [usuário] > Alterar senha |
| 477 | **Ao Concluir Pedido** | **No momento que concluir o pedido** | 0.67 | `field` | `tab:Comissões e mensalistas` | [110] Configurações > Parametrizações |
| 478 | **Ato / Protocolo Afetado:** | **Tomador protocolo** | 0.67 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 479 | **Baixar** | **Caixa** | 0.67 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 480 | **Bens / Imóveis** | **Reg. imóveis** | 0.67 | `column` | `root` | [015] Notas > Orçamento completo |
| 481 | **Bloco de Notas** | **Protocolo notas** | 0.67 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 482 | **Bloquear Protocolo** | **N° Protocolo** | 0.67 | `column` | `root` | [013] Notas > Protocolos em aberto |
| 483 | **Calcular Emolumentos** | **Sem emolumentos** | 0.67 | `field` | `root` | [031] Relatórios > Recolhimento resumido |
| 484 | **Cancelamento Manual da NFS-e** | **Lançamentos manuais** | 0.67 | `menu` | `menu` | [063] Administração > Mensalistas > Lançamentos manuais |
| 485 | **Central de Notificações** | **Email notificações** | 0.67 | `field` | `root` | [071] Configurações > Dados do cartório |
| 486 | **Certidões** | **Certidão** | 0.67 | `column` | `root` | [079] Configurações > Tabela de custas > Parâmetros |
| 487 | **CNPJ/CPF** | **CPF, CNPJ ou CIN** | 0.67 | `field` | `root` | [062] Administração > Mensalistas > Filiais |
| 488 | **Comunicações > CENSEC CEP** | **Comunicações** | 0.67 | `menu` | `menu` | [003] Dashboard > Comunicações |
| 489 | **Comunicações > CENSEC CTP** | **Comunicações** | 0.67 | `menu` | `menu` | [003] Dashboard > Comunicações |
| 490 | **Concluir Pedido** | **Concluir** | 0.67 | `button` | `root` | [015] Notas > Orçamento completo |
| 491 | **Copiar Selo** | **Copiar** | 0.67 | `tooltip` | `modal:Adicionar` | [058] Administração > Cadastro de Impedimentos |
| 492 | **Cupom Térmico** | **Com termos** | 0.67 | `field` | `accordion:Mais filtros` | [008] Firmas > Consultas > Serviços praticados |
| 493 | **Dados do Ato / Retificação** | **Apenas atos retificados** | 0.67 | `field` | `root` | [022] Notas > Consultas > Movimentação financeira por protocolo |
| 494 | **Data da Lavratura Primitiva** | **Data de lavratura** | 0.67 | `column` | `root` | [042] Administração > Comunicações > COAF |
| 495 | **Descrição / Titular** | **Descrição** | 0.67 | `field` | `root` | [011] Firmas > Cadastros > Tipo de documento - Termo de comparecimento |
| 496 | **Digitação Manual:** | **Digitalização** | 0.67 | `heading` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 497 | **Digitalizar escritura** | **Digitalizar ** | 0.67 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 498 | **Digitalizar matrícula** | **Digitalizar ** | 0.67 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 499 | **Entradas / Depósitos Prévios** | **Depósito prévio** | 0.67 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 500 | **Estoque (Stock):** | **Estoque** | 0.67 | `title` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 501 | **Filiação** | **Filial** | 0.67 | `column` | `root` | [062] Administração > Mensalistas > Filiais |
| 502 | **Folha / Página** | **Folha final** | 0.67 | `column` | `root` | [019] Notas > Consultas > Índice de escrituras e procurações |
| 503 | **Fonte Padrão** | **Escrevente padrão** | 0.67 | `field` | `tab:Parâmetros por estação` | [110] Configurações > Parametrizações |
| 504 | **Fórmula de Cálculo Vinculada** | **Forma de cálculo** | 0.67 | `field` | `modal:Adicionar` | [039] Administração > Comissões > Planos de comissão |
| 505 | **Fornecedor** | **descricaoFornecedor** | 0.67 | `field` | `modal:Adicionar` | [050] Administração > Controle de Estoque > Aquisição |
| 506 | **Gerar Orçamento para Impressão** | **LIBERADO PARA IMPRESSÃO** | 0.67 | `column` | `view:Dashboard` | [001] Dashboard > Atos Protocolares |
| 507 | **Indicador de Foto** | **Indicador de operação** | 0.67 | `field` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 508 | **Interessado** | **Intermediadores** | 0.67 | `menu` | `menu` | [065] Administração > Intermediadores |
| 509 | **Isenta / Gratuita** | **Sigla gratuita** | 0.67 | `column` | `tab:Cálculos` | [079] Configurações > Tabela de custas > Parâmetros |
| 510 | **Lançamento de Depósito Prévio** | **Depósito prévio** | 0.67 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 511 | **Layout do Arquivo** | **Data do arquivo** | 0.67 | `field` | `root` | [059] Administração > Importações de arquivos |
| 512 | **Livro Digitalizado** | **Digitalizar ** | 0.67 | `button` | `modal:Adicionar` | [009] Firmas > Cadastros > Cartão de assinatura |
| 513 | **Marcar "Fonética":** | **Fonética** | 0.67 | `field` | `root` | [008] Firmas > Consultas > Serviços praticados |
| 514 | **Nada Consta** | **Data consumo** | 0.67 | `column` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 515 | **Nome do Apresentante** | **Documento apresentado** | 0.67 | `menu` | `menu` | [085] Configurações > Cadastros auxiliares > Documento apresentado |
| 516 | **Nome do Remetente** | **Nome do template (Meta)** | 0.67 | `field` | `tab:WhatsApp` | [110] Configurações > Parametrizações |
| 517 | **Numeração Inicial** | **Posição inicial** | 0.67 | `field` | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 518 | **Número da Conta** | **Número da guia** | 0.67 | `field` | `root` | [017] Notas > Nova certidão e serviço |
| 519 | **Observação Contábil:** | **Observação** | 0.67 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 520 | **Paga** | **Pago** | 0.67 | `field` | `root` | [022] Notas > Consultas > Movimentação financeira por protocolo |
| 521 | **Página Final** | **Página inicial** | 0.67 | `field` | `modal:Adicionar` | [060] Administração > Controle de Livros |
| 522 | **Participação do Cônjuge:** | **Participação** | 0.67 | `menu` | `menu` | [092] Configurações > Cadastros auxiliares > Participação |
| 523 | **Período de Análise** | **Período de aquisição:** | 0.67 | `field` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 524 | **Período de envio** | **Tipo de envio** | 0.67 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 525 | **Permissões Específicas** | **Perfis e permissões** | 0.67 | `title` | `root` | [108] Configurações > Perfis e permissões de acesso |
| 526 | **Pessoa Jurídica - Representante** | **Pessoa jurídica** | 0.67 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 527 | **Publicar** | **M. Público** | 0.67 | `column` | `root` | [015] Notas > Orçamento completo |
| 528 | **Relatório em PDF** | **Relatórios** | 0.67 | `menu` | `menu` | [025] Relatórios > Fechamento de caixa |
| 529 | **Relatórios > PEX - TJ/SP** | **PEX Selos - TJ/SP** | 0.67 | `menu` | `menu` | [027] Relatórios > PEX Selos - TJ/SP |
| 530 | **Representante Ativo no Ato** | **Tipo de representante** | 0.67 | `menu` | `menu` | [107] Configurações > Cadastros auxiliares > Tipo de representante |
| 531 | **Reprocessar Carga** | **Processar** | 0.67 | `button` | `root` | [012] Firmas > Cadastros > Digitalização em lote |
| 532 | **Reutilizadas** | **Inutilizado** | 0.67 | `column` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 533 | **Saldo a Pagar** | **A pagar** | 0.67 | `column` | `root` | [037] Administração > Comissões > Consulta |
| 534 | **Salvar foto** | **Salvar** | 0.67 | `button` | `root` | [049] Administração > Envio de escrituras para Registro |
| 535 | **Serventia:** | **Nome da serventia** | 0.67 | `field` | `root` | [071] Configurações > Dados do cartório |
| 536 | **SIGNO** | **SIGNO-CEP** | 0.67 | `button` | `view:Por comunicação` | [003] Dashboard > Comunicações |
| 537 | **Sininho / Notificações** | **Email notificações** | 0.67 | `field` | `root` | [071] Configurações > Dados do cartório |
| 538 | **Sino de Notificações** | **Email notificações** | 0.67 | `field` | `root` | [071] Configurações > Dados do cartório |
| 539 | **Sintético por Ato** | **Sintético** | 0.67 | `field` | `root` | [025] Relatórios > Fechamento de caixa |
| 540 | **SISCOAF** | **COAF** | 0.67 | `menu` | `menu` | [042] Administração > Comunicações > COAF |
| 541 | **Situação / Status** | **Situação** | 0.67 | `column` | `root` | [010] Firmas > Cadastros > Sinal público |
| 542 | **Stock (Estoque)** | **Estoque** | 0.67 | `title` | `root` | [053] Administração > Controle de Estoque > Consultas |
| 543 | **Tipo de termo** | **Tipo de telefone** | 0.67 | `field` | `root` | [014] Notas > Novo protocolo |
| 544 | **Tipo XA** | **Tipo** | 0.67 | `column` | `root` | [018] Notas > Certidões e serviços em aberto |
| 545 | **Total de Depósitos Prévios** | **Depósito prévio** | 0.67 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 546 | **Valor Atribuído/Venal** | **Valor venal** | 0.67 | `column` | `root` | [015] Notas > Orçamento completo |
| 547 | **Ativar Inteligência Artificial (OCR e Cadastros)** | **Inteligência Artificial** | 0.66 | `tab` | `root` | [110] Configurações > Parametrizações |
| 548 | **Guias > Guias de Recolhimento Definitivas (PEX)** | **Recolhimento definitivo** | 0.66 | `field` | `root` | [026] Relatórios > PEX - TJ/SP |
| 549 | **Configuração de Inicialização:** | **Configuração de impressão** | 0.65 | `menu` | `menu` | [075] Configurações > Modelos de impressão > Configuração de impressão |
| 550 | **Salvar e Iniciar Serviço** | **Iniciar serviço do E-notariado** | 0.65 | `tooltip` | `tab:Comunicações` | [110] Configurações > Parametrizações |
| 551 | **Dia Padrão de Vencimento da Fatura** | **Vencimento Fatura** | 0.65 | `field` | `modal:Adicionar` | [064] Administração > Mensalistas > Mensalistas |
| 552 | **Documento de Identidade (RG / CNH)** | **Documento de certidão** | 0.65 | `field` | `modal:Adicionar` | [085] Configurações > Cadastros auxiliares > Documento apresentado |
| 553 | **Adicionar / Qualificar Parte** | **Adicionar participação** | 0.65 | `tooltip` | `root` | [092] Configurações > Cadastros auxiliares > Participação |
| 554 | **Notas > Orçamento > Orçamento Rápido** | **Orçamento rápido** | 0.65 | `accordion` | `root` | [013] Notas > Protocolos em aberto |
| 555 | **Busca por CNPJ (Pessoa Jurídica):** | **Pessoa jurídica** | 0.65 | `field` | `root` | [006] Firmas > Reconhecimento de firmas |
| 556 | **Notas > Protocolo > Novo Protocolo** | **Protocolo notas** | 0.65 | `field` | `root` | [049] Administração > Envio de escrituras para Registro |
| 557 | **Outros Serviços (Extranotariais)** | **Outros serviços** | 0.65 | `heading` | `root` | [016] Notas > Orçamento rápido |
| 558 | **Forçar Comunicação Imediata** | **Por comunicação** | 0.65 | `button` | `root` | [003] Dashboard > Comunicações |
| 559 | **Movimentações de Caixa** | **Tipo de movimentação** | 0.65 | `field` | `modal:Adicionar` | [102] Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| 560 | **Período de Cadastro** | **Período de distribuição** | 0.65 | `field` | `tab:Consulta` | [051] Administração > Controle de Estoque > Distribuição |
| 561 | **Valor Venal de Referência** | **Mês de referência** | 0.65 | `field` | `root` | [007] Firmas > Consultas > Reconhecimentos de firmas |
