# Árvore Canônica de Menus e Navegação — Orion TN

Documento de conhecimento canônico transcrito integralmente a partir da inspeção visual das 21 capturas de tela da pasta `auditoria/mapeamento-menus/` (`00-home-barra-menus.png` a `20-ola-usuario.png`), com conferência cruzada em [`manifest.json`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/mapeamento-menus/manifest.json).

---

## 1. Metadados da Captura

- **Sistema:** Orion TN (Siplan)
- **Versão exibida no rodapé das prints:** `Versão 06.05.02 de 19/11/2026` (acompanhada do link `Saiba as novidades dessa versão!`)
- **Data e horário da captura:** `24/11/2026`, das `12:28:56` às `12:39:09` (horário local `-03:00`; encerramento registrado no `manifest.json` em `2026-11-24T15:39:11.531Z`)
- **Ambiente:** `Produtos (homologação interna Siplan)`
- **Configuração de captura:** Viewport `1440×900`, zoom `80%` (`0.8`), 21 arquivos PNG (`00-home-barra-menus.png` até `20-ola-usuario.png`), 0 falhas e 0 cortes inferiores (`clippedBottom: false` em todas as capturas)

### Resumo Quantitativo

| Categoria | Quantidade | Detalhamento |
|---|---:|---|
| **Menus pai principais (barra superior)** | **7** | **Dashboard**, **Firmas**, **Notas**, **Relatórios**, **Administração**, **Históricos**, **Configurações** |
| — Menus pai com submenu dropdown | **6** | **Dashboard**, **Firmas**, **Notas**, **Relatórios**, **Administração**, **Configurações** |
| — Links diretos sem submenu | **1** | **Históricos** |
| **Submenus intermediários (nós não-folha)** | **12** | **10** de 2º nível (**Firmas > Consultas**, **Firmas > Cadastros**, **Notas > Consultas**, **Administração > Comissões**, **Administração > Comunicações**, **Administração > Controle de Estoque**, **Administração > Mensalistas**, **Configurações > Modelos de impressão**, **Configurações > Tabela de custas**, **Configurações > Cadastros auxiliares**) e **2** de 3º nível (**Administração > Controle de Estoque > Cadastros**, **Configurações > Cadastros auxiliares > Pessoa física**) |
| **Telas / caminhos finais nos 7 menus principais** | **110** | **Dashboard** (`4`), **Firmas** (`8`), **Notas** (`12`), **Relatórios** (`12`), **Administração** (`33`), **Históricos** (`1`), **Configurações** (`40`) |
| — Distribuição por profundidade (7 menus principais) | **110** | Profundidade 1: `1` \| Profundidade 2: `37` \| Profundidade 3: `62` \| Profundidade 4: `10` |
| **Opções finais do menu do usuário (`Olá, [usuário]`)** | **5** | **Alterar senha**, **Fale conosco**, **Autenticação em dois fatores**, **Cadastrar biometria**, **Sair** (profundidade 2) |
| **Total geral de caminhos finais navegáveis** | **115** | `110` nos 7 menus principais + `5` no menu do usuário (além do painel interativo **Notificações** e dos ícones utilitários diretos da barra superior) |

---

## 2. Anatomia da Barra Superior (Home)

Comprovada pelas prints `00-home-barra-menus.png`, `01-dashboard.png`, `19-9.png` e `20-ola-usuario.png`.

### 2.1 Cabeçalho Principal (da esquerda para a direita)

1. **Identidade do Sistema (canto superior esquerdo):** logotipo **OrionTN**.
2. **Menus pai principais (ordem exata da esquerda para a direita):**
   1. **Dashboard** *(submenu dropdown)*
   2. **Firmas** *(submenu dropdown)*
   3. **Notas** *(submenu dropdown)*
   4. **Relatórios** *(submenu dropdown)*
   5. **Administração** *(submenu dropdown)*
   6. **Históricos** *(link direto sem submenu)*
   7. **Configurações** *(submenu dropdown — grafado com til)*
3. **Ícones utilitários à direita de **Configurações** (ordem exata da esquerda para a direita):**
   1. Ícone de câmera fotográfica
   2. Ícone de QR Code verde
   3. Ícone utilitário adicional posicionado entre o QR Code verde e o sino de notificações *(ausente na `00-home-barra-menus.png` e visível de `01-dashboard.png` até `20-ola-usuario.png` por carregamento assíncrono)*
   4. Ícone de sino de **Notificações** com badge vermelho `9+` — abre o painel suspenso (`19-9.png`) com:
      - Cabeçalho **Notificações** e badge `9+`
      - Ação **Marcar como lidas** e ícone de filtros
      - Abas de filtro com contadores: **Todas** (`10`), **Não lidas** (`984`) e **Lidas** (`0`)
      - Lista de cartões de aviso (exemplos visíveis: **Pedido não concluído**, **Controle de assinatura (tabelião)**)
      - Rodapé com o link **Escolher quais avisos receber**
   5. Ícone de robô
   6. Ícone de calendário
   7. Ícone de megafone
   8. Ícone de grade 3×3 (9 quadrados)
4. **Menu do usuário (canto superior direito):** **Olá, [usuário]** (exibido dinamicamente com o nome do usuário logado e seta `▾`), que expande um dropdown com **5** opções (`20-ola-usuario.png`):
   - **Alterar senha**
   - **Fale conosco**
   - **Autenticação em dois fatores**
   - **Cadastrar biometria**
   - **Sair**

### 2.2 Demais Elementos Visuais da Home

- **Controle de recolhimento do cabeçalho:** botão quadrado bordô com seta `^` posicionado abaixo do menu do usuário no canto superior direito.
- **Barra de pesquisa rápida (busca global):** campo largo posicionado imediatamente abaixo da barra de menus, com o texto placeholder literal: `Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B`.
- **Faixa de alerta 2FA (acima do rodapé):** aviso em destaque amarelo com o texto: `Sua conta não possui a autenticação em dois fatores (2FA) ativada. Clique aqui para ativar agora e proteger seu acesso.` (com **Clique aqui para ativar agora** em link sublinhado).
- **Rodapé institucional:** barra cinza inferior com `Versão 06.05.02 de 19/11/2026`, link `Saiba as novidades dessa versão!` e logotipo **Siplan**.

---

## 3. Árvore Hierárquica Completa (Visual)

Representação integral da esquerda para a direita na barra superior e, em cada menu, na ordem exata de cima para baixo exibida nas prints.

- **Dashboard** (`01-dashboard.png`)
  - **Atos Protocolares** `[Tela]`
  - **Envio para Registro** `[Tela]`
  - **Comunicações** `[Tela]`
  - **Agenda de protocolos** `[Tela]`
- **Firmas** (`02-firmas.png`)
  - **Abertura de pedido** `[Tela]`
  - **Reconhecimento de firmas** `[Tela]`
  - **Consultas** `[Submenu]` (`03-firmas__consultas.png`)
    - **Reconhecimentos de firmas** `[Tela]`
    - **Serviços praticados** `[Tela]`
  - **Cadastros** `[Submenu]` (`04-firmas__cadastros.png`)
    - **Cartão de assinatura** `[Tela]`
    - **Sinal público** `[Tela]`
    - **Tipo de documento - Termo de comparecimento** `[Tela]`
    - **Digitalização em lote** `[Tela]`
- **Notas** (`05-notas.png`)
  - **Protocolos em aberto** `[Tela]`
  - **Novo protocolo** `[Tela]`
  - **Orçamento completo** `[Tela]`
  - **Orçamento rápido** `[Tela]`
  - **Nova certidão e serviço** `[Tela]`
  - **Certidões e serviços em aberto** `[Tela]`
  - **Consultas** `[Submenu]` (`06-notas__consultas.png`)
    - **Índice de escrituras e procurações** `[Tela]`
    - **Orçamentos** `[Tela]`
    - **Protocolos** `[Tela]`
    - **Movimentação financeira por protocolo** `[Tela]`
    - **Certidões e serviços** `[Tela]`
    - **Editor** `[Tela]`
- **Relatórios** (`07-relatorios.png`)
  - **Fechamento de caixa** `[Tela]`
  - **PEX - TJ/SP** `[Tela]`
  - **PEX Selos - TJ/SP** `[Tela]`
  - **Recolhimento diário** `[Tela]`
  - **Atos Incompletos** `[Tela]`
  - **Demonstrativo financeiro dos selos digitais** `[Tela]`
  - **Recolhimento resumido** `[Tela]`
  - **Índice por livro** `[Tela]`
  - **Transferência de imóveis** `[Tela]`
  - **Auditoria Selos TJ - Orion** `[Tela]`
  - **Livro Protocolo** `[Tela]`
  - **Relatório ISS** `[Tela]`
- **Administração** (`08-administracao.png`)
  - **Comissões** `[Submenu]` (`09-administracao__comissoes.png`)
    - **Consulta** `[Tela]`
    - **Consulta indicação de mensalistas** `[Tela]`
    - **Planos de comissão** `[Tela]`
    - **Plano diferenciado Mensalistas** `[Tela]`
    - **Planos indicação de mensalista** `[Tela]`
  - **Comunicações** `[Submenu]` (`10-administracao__comunicacoes.png`)
    - **COAF** `[Tela]`
    - **Outras comunicações** `[Tela]`
    - **Auditoria de Selos** `[Tela]`
    - **Selo digital** `[Tela]`
    - **RPS** `[Tela]`
    - **Recolhimento** `[Tela]`
    - **Auditoria de RPS** `[Tela]`
  - **Envio de escrituras para Registro** `[Tela]`
  - **Controle de Estoque** `[Submenu]` (`11-administracao__controle-de-estoque.png`)
    - **Aquisição** `[Tela]`
    - **Distribuição** `[Tela]`
    - **Consumo manual** `[Tela]`
    - **Consultas** `[Tela]`
    - **Cadastros** `[Submenu]` (`12-administracao__controle-de-estoque__cadastros.png`)
      - **Categoria** `[Tela]`
      - **Grupos de distribuição** `[Tela]`
      - **Produto** `[Tela]`
      - **Unidade de medida** `[Tela]`
  - **Cadastro de Impedimentos** `[Tela]`
  - **Importações de arquivos** `[Tela]`
  - **Controle de Livros** `[Tela]`
  - **Mensalistas** `[Submenu]` (`13-administracao__mensalistas.png`)
    - **Faturamento** `[Tela]`
    - **Filiais** `[Tela]`
    - **Lançamentos manuais** `[Tela]`
    - **Mensalistas** `[Tela]`
  - **Intermediadores** `[Tela]`
  - **Cadastro de Pessoas Jurídicas** `[Tela]`
  - **Serviços internos realizados** `[Tela]`
  - **Certidões solicitadas** `[Tela]`
  - **Calendário** `[Tela]`
- **Históricos** `[Link direto sem submenu]` (`00-home-barra-menus.png`)
- **Configurações** (`14-configuracoes.png`)
  - **Dados do cartório** `[Tela]`
  - **Modelos de impressão** `[Submenu]` (`15-configuracoes__modelos-de-impressao.png`)
    - **Enquadramento COAF** `[Tela]`
    - **Listagens diversas** `[Tela]`
    - **Etiquetas diversas** `[Tela]`
    - **Configuração de impressão** `[Tela]`
  - **Tabela de custas** `[Submenu]` (`16-configuracoes__tabela-de-custas.png`)
    - **Cálculos** `[Tela]`
    - **Itens** `[Tela]`
    - **Grupo de item** `[Tela]`
    - **Parâmetros** `[Tela]`
    - **Taxas** `[Tela]`
    - **Vigências** `[Tela]`
  - **Cadastros auxiliares** `[Submenu]` (`17-configuracoes__cadastros-auxiliares.png`)
    - **Alíquotas** `[Tela]`
    - **Banco** `[Tela]`
    - **Cargo** `[Tela]`
    - **Documento apresentado** `[Tela]`
    - **Espécie** `[Tela]`
    - **Feriados** `[Tela]`
    - **Formas de pagamento** `[Tela]`
    - **Natureza** `[Tela]`
    - **Órgão expedidor** `[Tela]`
    - **Outros serviços** `[Tela]`
    - **Participação** `[Tela]`
    - **Perfil de partes** `[Tela]`
    - **Pessoa física** `[Submenu]` (`18-configuracoes__cadastros-auxiliares__pessoa-fisica.png`)
      - **Área de Atuação** `[Tela]`
      - **Estado civil** `[Tela]`
      - **Nacionalidade** `[Tela]`
      - **Naturalidade** `[Tela]`
      - **Profissão** `[Tela]`
      - **Regime de bens** `[Tela]`
    - **Serviços Internos** `[Tela]`
    - **Situação do protocolo** `[Tela]`
    - **Tipo de movimentação financeira** `[Tela]`
    - **Tipo de documento** `[Tela]`
    - **Tipo de e-mail** `[Tela]`
    - **Tipo de endereço** `[Tela]`
    - **Tipo de telefone** `[Tela]`
    - **Tipo de representante** `[Tela]`
  - **Perfis e permissões de acesso** `[Tela]`
  - **Usuários** `[Tela]`
  - **Parametrizações** `[Tela]`
- **Notificações** `[Painel]` *(ícone de sino com badge `9+`)* (`19-9.png`)
  - **Marcar como lidas** `[Ação]`
  - **Todas** / **Não lidas** / **Lidas** `[Abas de filtro]`
  - **Escolher quais avisos receber** `[Link / Configuração]`
- **Olá, [usuário]** *(menu dinâmico do usuário logado)* (`20-ola-usuario.png`)
  - **Alterar senha** `[Tela]`
  - **Fale conosco** `[Tela]`
  - **Autenticação em dois fatores** `[Tela]`
  - **Cadastrar biometria** `[Tela]`
  - **Sair** `[Ação]`

---

## 4. Catálogo Canônico de Todos os Caminhos (por Menu Pai)

### 4.1 Dashboard (4 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Dashboard > Atos Protocolares** | 2 | `01-dashboard.png` |
| 2 | **Dashboard > Envio para Registro** | 2 | `01-dashboard.png` |
| 3 | **Dashboard > Comunicações** | 2 | `01-dashboard.png` |
| 4 | **Dashboard > Agenda de protocolos** | 2 | `01-dashboard.png` |

### 4.2 Firmas (8 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Firmas > Abertura de pedido** | 2 | `02-firmas.png` |
| 2 | **Firmas > Reconhecimento de firmas** | 2 | `02-firmas.png` |
| 3 | **Firmas > Consultas > Reconhecimentos de firmas** | 3 | `03-firmas__consultas.png` |
| 4 | **Firmas > Consultas > Serviços praticados** | 3 | `03-firmas__consultas.png` |
| 5 | **Firmas > Cadastros > Cartão de assinatura** | 3 | `04-firmas__cadastros.png` |
| 6 | **Firmas > Cadastros > Sinal público** | 3 | `04-firmas__cadastros.png` |
| 7 | **Firmas > Cadastros > Tipo de documento - Termo de comparecimento** | 3 | `04-firmas__cadastros.png` |
| 8 | **Firmas > Cadastros > Digitalização em lote** | 3 | `04-firmas__cadastros.png` |

### 4.3 Notas (12 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Notas > Protocolos em aberto** | 2 | `05-notas.png` |
| 2 | **Notas > Novo protocolo** | 2 | `05-notas.png` |
| 3 | **Notas > Orçamento completo** | 2 | `05-notas.png` |
| 4 | **Notas > Orçamento rápido** | 2 | `05-notas.png` |
| 5 | **Notas > Nova certidão e serviço** | 2 | `05-notas.png` |
| 6 | **Notas > Certidões e serviços em aberto** | 2 | `05-notas.png` |
| 7 | **Notas > Consultas > Índice de escrituras e procurações** | 3 | `06-notas__consultas.png` |
| 8 | **Notas > Consultas > Orçamentos** | 3 | `06-notas__consultas.png` |
| 9 | **Notas > Consultas > Protocolos** | 3 | `06-notas__consultas.png` |
| 10 | **Notas > Consultas > Movimentação financeira por protocolo** | 3 | `06-notas__consultas.png` |
| 11 | **Notas > Consultas > Certidões e serviços** | 3 | `06-notas__consultas.png` |
| 12 | **Notas > Consultas > Editor** | 3 | `06-notas__consultas.png` |

### 4.4 Relatórios (12 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Relatórios > Fechamento de caixa** | 2 | `07-relatorios.png` |
| 2 | **Relatórios > PEX - TJ/SP** | 2 | `07-relatorios.png` |
| 3 | **Relatórios > PEX Selos - TJ/SP** | 2 | `07-relatorios.png` |
| 4 | **Relatórios > Recolhimento diário** | 2 | `07-relatorios.png` |
| 5 | **Relatórios > Atos Incompletos** | 2 | `07-relatorios.png` |
| 6 | **Relatórios > Demonstrativo financeiro dos selos digitais** | 2 | `07-relatorios.png` |
| 7 | **Relatórios > Recolhimento resumido** | 2 | `07-relatorios.png` |
| 8 | **Relatórios > Índice por livro** | 2 | `07-relatorios.png` |
| 9 | **Relatórios > Transferência de imóveis** | 2 | `07-relatorios.png` |
| 10 | **Relatórios > Auditoria Selos TJ - Orion** | 2 | `07-relatorios.png` |
| 11 | **Relatórios > Livro Protocolo** | 2 | `07-relatorios.png` |
| 12 | **Relatórios > Relatório ISS** | 2 | `07-relatorios.png` |

### 4.5 Administração (33 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Administração > Comissões > Consulta** | 3 | `09-administracao__comissoes.png` |
| 2 | **Administração > Comissões > Consulta indicação de mensalistas** | 3 | `09-administracao__comissoes.png` |
| 3 | **Administração > Comissões > Planos de comissão** | 3 | `09-administracao__comissoes.png` |
| 4 | **Administração > Comissões > Plano diferenciado Mensalistas** | 3 | `09-administracao__comissoes.png` |
| 5 | **Administração > Comissões > Planos indicação de mensalista** | 3 | `09-administracao__comissoes.png` |
| 6 | **Administração > Comunicações > COAF** | 3 | `10-administracao__comunicacoes.png` |
| 7 | **Administração > Comunicações > Outras comunicações** | 3 | `10-administracao__comunicacoes.png` |
| 8 | **Administração > Comunicações > Auditoria de Selos** | 3 | `10-administracao__comunicacoes.png` |
| 9 | **Administração > Comunicações > Selo digital** | 3 | `10-administracao__comunicacoes.png` |
| 10 | **Administração > Comunicações > RPS** | 3 | `10-administracao__comunicacoes.png` |
| 11 | **Administração > Comunicações > Recolhimento** | 3 | `10-administracao__comunicacoes.png` |
| 12 | **Administração > Comunicações > Auditoria de RPS** | 3 | `10-administracao__comunicacoes.png` |
| 13 | **Administração > Envio de escrituras para Registro** | 2 | `08-administracao.png` |
| 14 | **Administração > Controle de Estoque > Aquisição** | 3 | `11-administracao__controle-de-estoque.png` |
| 15 | **Administração > Controle de Estoque > Distribuição** | 3 | `11-administracao__controle-de-estoque.png` |
| 16 | **Administração > Controle de Estoque > Consumo manual** | 3 | `11-administracao__controle-de-estoque.png` |
| 17 | **Administração > Controle de Estoque > Consultas** | 3 | `11-administracao__controle-de-estoque.png` |
| 18 | **Administração > Controle de Estoque > Cadastros > Categoria** | 4 | `12-administracao__controle-de-estoque__cadastros.png` |
| 19 | **Administração > Controle de Estoque > Cadastros > Grupos de distribuição** | 4 | `12-administracao__controle-de-estoque__cadastros.png` |
| 20 | **Administração > Controle de Estoque > Cadastros > Produto** | 4 | `12-administracao__controle-de-estoque__cadastros.png` |
| 21 | **Administração > Controle de Estoque > Cadastros > Unidade de medida** | 4 | `12-administracao__controle-de-estoque__cadastros.png` |
| 22 | **Administração > Cadastro de Impedimentos** | 2 | `08-administracao.png` |
| 23 | **Administração > Importações de arquivos** | 2 | `08-administracao.png` |
| 24 | **Administração > Controle de Livros** | 2 | `08-administracao.png` |
| 25 | **Administração > Mensalistas > Faturamento** | 3 | `13-administracao__mensalistas.png` |
| 26 | **Administração > Mensalistas > Filiais** | 3 | `13-administracao__mensalistas.png` |
| 27 | **Administração > Mensalistas > Lançamentos manuais** | 3 | `13-administracao__mensalistas.png` |
| 28 | **Administração > Mensalistas > Mensalistas** | 3 | `13-administracao__mensalistas.png` |
| 29 | **Administração > Intermediadores** | 2 | `08-administracao.png` |
| 30 | **Administração > Cadastro de Pessoas Jurídicas** | 2 | `08-administracao.png` |
| 31 | **Administração > Serviços internos realizados** | 2 | `08-administracao.png` |
| 32 | **Administração > Certidões solicitadas** | 2 | `08-administracao.png` |
| 33 | **Administração > Calendário** | 2 | `08-administracao.png` |

### 4.6 Históricos (1 caminho)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Históricos** *(link direto sem submenu)* | 1 | `00-home-barra-menus.png` |

### 4.7 Configurações (40 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Configurações > Dados do cartório** | 2 | `14-configuracoes.png` |
| 2 | **Configurações > Modelos de impressão > Enquadramento COAF** | 3 | `15-configuracoes__modelos-de-impressao.png` |
| 3 | **Configurações > Modelos de impressão > Listagens diversas** | 3 | `15-configuracoes__modelos-de-impressao.png` |
| 4 | **Configurações > Modelos de impressão > Etiquetas diversas** | 3 | `15-configuracoes__modelos-de-impressao.png` |
| 5 | **Configurações > Modelos de impressão > Configuração de impressão** | 3 | `15-configuracoes__modelos-de-impressao.png` |
| 6 | **Configurações > Tabela de custas > Cálculos** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 7 | **Configurações > Tabela de custas > Itens** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 8 | **Configurações > Tabela de custas > Grupo de item** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 9 | **Configurações > Tabela de custas > Parâmetros** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 10 | **Configurações > Tabela de custas > Taxas** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 11 | **Configurações > Tabela de custas > Vigências** | 3 | `16-configuracoes__tabela-de-custas.png` |
| 12 | **Configurações > Cadastros auxiliares > Alíquotas** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 13 | **Configurações > Cadastros auxiliares > Banco** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 14 | **Configurações > Cadastros auxiliares > Cargo** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 15 | **Configurações > Cadastros auxiliares > Documento apresentado** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 16 | **Configurações > Cadastros auxiliares > Espécie** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 17 | **Configurações > Cadastros auxiliares > Feriados** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 18 | **Configurações > Cadastros auxiliares > Formas de pagamento** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 19 | **Configurações > Cadastros auxiliares > Natureza** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 20 | **Configurações > Cadastros auxiliares > Órgão expedidor** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 21 | **Configurações > Cadastros auxiliares > Outros serviços** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 22 | **Configurações > Cadastros auxiliares > Participação** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 23 | **Configurações > Cadastros auxiliares > Perfil de partes** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 24 | **Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 25 | **Configurações > Cadastros auxiliares > Pessoa física > Estado civil** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 26 | **Configurações > Cadastros auxiliares > Pessoa física > Nacionalidade** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 27 | **Configurações > Cadastros auxiliares > Pessoa física > Naturalidade** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 28 | **Configurações > Cadastros auxiliares > Pessoa física > Profissão** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 29 | **Configurações > Cadastros auxiliares > Pessoa física > Regime de bens** | 4 | `18-configuracoes__cadastros-auxiliares__pessoa-fisica.png` |
| 30 | **Configurações > Cadastros auxiliares > Serviços Internos** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 31 | **Configurações > Cadastros auxiliares > Situação do protocolo** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 32 | **Configurações > Cadastros auxiliares > Tipo de movimentação financeira** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 33 | **Configurações > Cadastros auxiliares > Tipo de documento** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 34 | **Configurações > Cadastros auxiliares > Tipo de e-mail** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 35 | **Configurações > Cadastros auxiliares > Tipo de endereço** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 36 | **Configurações > Cadastros auxiliares > Tipo de telefone** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 37 | **Configurações > Cadastros auxiliares > Tipo de representante** | 3 | `17-configuracoes__cadastros-auxiliares.png` |
| 38 | **Configurações > Perfis e permissões de acesso** | 2 | `14-configuracoes.png` |
| 39 | **Configurações > Usuários** | 2 | `14-configuracoes.png` |
| 40 | **Configurações > Parametrizações** | 2 | `14-configuracoes.png` |

### 4.8 Olá, [usuário] (5 caminhos)

| # | Caminho Canônico | Profundidade | Print Comprobatória |
|---:|---|---:|---|
| 1 | **Olá, [usuário] > Alterar senha** | 2 | `20-ola-usuario.png` |
| 2 | **Olá, [usuário] > Fale conosco** | 2 | `20-ola-usuario.png` |
| 3 | **Olá, [usuário] > Autenticação em dois fatores** | 2 | `20-ola-usuario.png` |
| 4 | **Olá, [usuário] > Cadastrar biometria** | 2 | `20-ola-usuario.png` |
| 5 | **Olá, [usuário] > Sair** | 2 | `20-ola-usuario.png` |

### 4.9 Notificações (Painel Interativo — `19-9.png`)

Ao acionar o ícone de sino com badge `9+` na barra superior, abre-se o painel suspenso **Notificações** (sem submenus hierárquicos tradicionais), contendo os seguintes controles e elementos visíveis:

- Cabeçalho: título **Notificações** (`9+`), botão **Marcar como lidas** e ícone de filtros.
- Abas de estado: **Todas** (`10`), **Não lidas** (`984`) e **Lidas** (`0`).
- Área de lista de avisos: notificações com título, descrição, data relativa, ícone de abrir/navegar e indicador de leitura (exemplos exibidos na captura: **Pedido não concluído**, **Controle de assinatura (tabelião)**).
- Rodapé: ação **Escolher quais avisos receber**.

---

## 5. Mapa de Homônimos e Pontos de Atenção

### 5.1 Homônimos Exatos

| Rótulo Repetido | Ocorrências | Caminhos Completos e Papel na Árvore |
|---|---:|---|
| **Consultas** | **3** | 1. **Firmas > Consultas** *(submenu intermediário)*<br>2. **Notas > Consultas** *(submenu intermediário)*<br>3. **Administração > Controle de Estoque > Consultas** *(tela final)* |
| **Cadastros** | **2** | 1. **Firmas > Cadastros** *(submenu intermediário de 2º nível)*<br>2. **Administração > Controle de Estoque > Cadastros** *(submenu intermediário de 3º nível)* |
| **Comunicações** | **2** | 1. **Dashboard > Comunicações** *(tela final)*<br>2. **Administração > Comunicações** *(submenu intermediário)* |
| **Mensalistas** | **2** | 1. **Administração > Mensalistas** *(submenu intermediário)*<br>2. **Administração > Mensalistas > Mensalistas** *(tela final — auto-homônimo dentro do próprio submenu)* |

### 5.2 Quase-Homônimos, Variações de Grafia e Famílias Temáticas

1. **Singular vs. Plural em Firmas:**
   - **Firmas > Reconhecimento de firmas** *(singular — tela operacional)* × **Firmas > Consultas > Reconhecimentos de firmas** *(plural — tela de consulta)*.
2. **Consulta (singular) vs. Consultas (plural):**
   - **Administração > Comissões > Consulta** *(singular)* × **Firmas > Consultas**, **Notas > Consultas** e **Administração > Controle de Estoque > Consultas** *(plural)*.
3. **Família Protocolos (7 caminhos em 4 menus pai):**
   - **Dashboard > Agenda de protocolos**
   - **Notas > Protocolos em aberto**
   - **Notas > Novo protocolo**
   - **Notas > Consultas > Protocolos**
   - **Notas > Consultas > Movimentação financeira por protocolo**
   - **Relatórios > Livro Protocolo**
   - **Configurações > Cadastros auxiliares > Situação do protocolo**
4. **Envio para Registro (2 caminhos):**
   - **Dashboard > Envio para Registro** × **Administração > Envio de escrituras para Registro**.
5. **Serviços Internos (variação de caixa `i`/`I`):**
   - **Administração > Serviços internos realizados** *(`i` minúsculo)* × **Configurações > Cadastros auxiliares > Serviços Internos** *(`I` maiúsculo)*.
6. **Família Certidões e serviços (4 caminhos):**
   - **Notas > Nova certidão e serviço**
   - **Notas > Certidões e serviços em aberto**
   - **Notas > Consultas > Certidões e serviços**
   - **Administração > Certidões solicitadas**
7. **Família Orçamentos (3 caminhos):**
   - **Notas > Orçamento completo**
   - **Notas > Orçamento rápido**
   - **Notas > Consultas > Orçamentos**
8. **Documentos / Tipo de documento (3 caminhos):**
   - **Firmas > Cadastros > Tipo de documento - Termo de comparecimento**
   - **Configurações > Cadastros auxiliares > Documento apresentado**
   - **Configurações > Cadastros auxiliares > Tipo de documento**
9. **Família Recolhimento (3 caminhos):**
   - **Administração > Comunicações > Recolhimento**
   - **Relatórios > Recolhimento diário**
   - **Relatórios > Recolhimento resumido**
10. **Família Selos (5 caminhos):**
    - **Administração > Comunicações > Auditoria de Selos**
    - **Administração > Comunicações > Selo digital**
    - **Relatórios > PEX Selos - TJ/SP**
    - **Relatórios > Demonstrativo financeiro dos selos digitais**
    - **Relatórios > Auditoria Selos TJ - Orion**
11. **Família COAF (2 caminhos):**
    - **Administração > Comunicações > COAF**
    - **Configurações > Modelos de impressão > Enquadramento COAF**
12. **Variações de singular/plural e caixa em Comissões (**Administração > Comissões**):**
    - **Consulta indicação de mensalistas** *(`mensalistas` no plural)*
    - **Planos de comissão** *(`Planos` no plural, `comissão` no singular)*
    - **Plano diferenciado Mensalistas** *(`Plano` no singular, `Mensalistas` com `M` maiúsculo)*
    - **Planos indicação de mensalista** *(`Planos` no plural, `mensalista` no singular)*
13. **Calendário em dois locais:**
    - Menu **Administração > Calendário** e ícone de calendário na barra superior direita.
14. **Credenciais e segurança do usuário:**
    - **Alterar senha**, **Autenticação em dois fatores** e **Cadastrar biometria** ficam no menu **Olá, [usuário]** (canto superior direito), e **não** dentro de **Configurações** (que abriga apenas **Usuários** e **Perfis e permissões de acesso**).

### 5.3 Observações Visuais e Comportamentais da Interface

- **Direção de expansão dos submenus:** os submenus de **Firmas** (`03`, `04`) e **Notas** (`06`) expandem-se para a **direita**; já os submenus de **Administração** (`09` a `13`) e **Configurações** (`15` a `18`), tanto no 2º quanto no 3º nível, abrem visualmente para a **esquerda**, embora seus itens pai exibam o indicador `▸` apontando para a direita.
- **Ordenação não estritamente alfabética em **Configurações > Cadastros auxiliares** (`17-configuracoes__cadastros-auxiliares.png`):** o item **Tipo de movimentação financeira** aparece acima de **Tipo de documento**, **Tipo de e-mail**, **Tipo de endereço**, **Tipo de telefone** e **Tipo de representante**.
- **Grafia oficial em produção:** o menu **Configurações** aparece grafado corretamente com til em todas as capturas da `Versão 06.05.02 de 19/11/2026`.
- **Carregamento assíncrono na barra superior:** na print inicial `00-home-barra-menus.png` aparecem 7 ícones utilitários à direita de **Configurações**; a partir de `01-dashboard.png` (e até `20-ola-usuario.png`), surge um 8º ícone utilitário entre o QR Code verde e o sino `9+`.

---

## 6. Auditoria Cruzada (Prints × `manifest.json`)

A conferência cruzada completa entre todas as 21 imagens (`.png`) e os metadados de [`manifest.json`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/mapeamento-menus/manifest.json) confirma **100% de fidelidade** nos nomes literais, acentuação, capitalização, profundidade e ordenação vertical de todos os menus e submenus capturados (`01` a `18` e `20`).

Foram registradas as seguintes observações e diferenças entre a camada visual (prints) e a estrutura JSON do `manifest.json`:

1. **Item fantasma `"0"` em `rootDirectLinks` do `manifest.json`:** o arquivo JSON lista dois links diretos de raiz (`"Históricos"` e `"0"`). Na inspeção visual de todas as 21 prints, **não existe qualquer item textual `"0"` visível na barra superior** — apenas **Históricos** é um link direto de menu entre **Administração** e **Configurações** (trata-se de artefato de DOM/badge zerado capturado pelo seletor automatizado em um dos ícones utilitários).
2. **Detalhamento visual do painel **Notificações** (`19-9.png`):** no `manifest.json`, a entrada aparece como `"chain": ["9+"]` com `"directChildren": []`. Visualmente, a print `19-9.png` comprova que se trata do painel **Notificações**, contendo o botão **Marcar como lidas**, filtros, as abas **Todas** (`10`), **Não lidas** (`984`) e **Lidas** (`0`), cartões de avisos e o link **Escolher quais avisos receber**.
3. **Elementos visíveis na barra superior e na Home ausentes do `manifest.json`:** o logotipo **OrionTN**, a barra de pesquisa global (`CTRL + B`), os demais ícones utilitários sem submenu à direita de **Configurações** (câmera, QR Code verde, ícone adicional carregado assincronamente a partir de `01-dashboard.png`, robô, calendário, megafone e grade 3×3), o botão `^` de recolhimento do cabeçalho, a faixa de alerta 2FA e o rodapé com a `Versão 06.05.02 de 19/11/2026`.
4. **Integridade de captura sem cortes:** confirma-se visualmente `clippedBottom: false` em todas as 21 imagens, inclusive na lista mais extensa do sistema (**Configurações > Cadastros auxiliares**, com 21 itens visíveis na íntegra em `17-configuracoes__cadastros-auxiliares.png`).
