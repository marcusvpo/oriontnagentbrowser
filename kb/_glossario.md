# Glossário e Terminologia Oficial: Ecossistema Orion TN

> **Referência Semântica Obrigatória:** Vocabulário controlado, siglas notariais, centrais oficiais e normas da Corregedoria Geral de Justiça.

---

# Glossário Notarial, Registral e Corporativo: Siplan / Orion TN

**Status:** ATIVO / DEFINITIVO  
**Aplicação:** Todas as rotinas, minutas, regras, respostas e transcrições do ecossistema Orion TN  

---

## 1. Módulos e Produtos do Ecossistema Siplan

| Termo Oficial | Grafia Proibida / Incorreta | Descrição e Contexto de Uso |
| :--- | :--- | :--- |
| **ORION TN** | OrionTN, Orion Tn, Orem TN | Módulo central de Tabelionato de Notas (protocolos, minutas, livros, traslados e firmas). |
| **ORION Caixa** | OrionCaixa, Caixa TN | Módulo financeiro, depósitos prévios, faturamento, recebimento de emolumentos e conciliação. |
| **ORION Estoque** | Orion Stock, OrionStock | Controle de almoxarifado, papel de segurança, selos físicos e insumos da serventia. |
| **ORION GED** | OrionGED, GED Nativo | Gerenciador Eletrônico de Documentos integrado aos protocolos e fichas de firma. |
| **Orion Connect** | OramConnect, Connect | Plataforma de mensageria interna, comunicados, mural de avisos e ciência obrigatória de provimentos. |
| **Cartflow** | CartFlow, Cart Flower, Cardflow | Ferramenta de interface cliente-cartório para coleta remota, checklists e recepção de documentos via web/WhatsApp. |
| **Siplan** | Ciplã, Siplam, Siplanweb | Empresa desenvolvedora do ecossistema e software de gestão notarial e registral. |

---

## 2. Termos do Direito Notarial, Registral e Centrais Eletrônicas

| Termo Oficial | Significado e Aplicação no Orion TN |
| :--- | :--- |
| **ONR** | Operador Nacional do Sistema de Registro Eletrônico de Imóveis (integração direta de escrituras para registro). |
| **SAEC** | Serviço de Atendimento Eletrônico Compartilhado (plataforma integrada ao ONR para trâmite com o RI). |
| **RI / Registro de Imóveis** | Cartório de Registro de Imóveis destinatário das escrituras notariais para prenotação e registro. |
| **DOI** | Declaração sobre Operações Imobiliárias encaminhada à Receita Federal do Brasil. |
| **CENSEC** | Central Notarial de Serviços Eletrônicos Compartilhados (alimentada com dados de escrituras, procurações e testamentos). |
| **SIGNO** | Sistema Integrado de Gestão Notarial, compreendendo CTO, CEP, CED e CTP (comunicações para prefeituras e corregedorias). |
| **PEP / COAF** | Pessoas Expostas Politicamente e Conselho de Controle de Atividades Financeiras (compliance antilavagem no cadastro de partes). |
| **ITCMD / ITBI** | Imposto sobre Transmissão Causa Mortis e Doação (estadual/SEFAZ) e Imposto sobre Transmissão de Bens Imóveis (municipal). |
| **CNIB** | Central Nacional de Indisponibilidade de Bens (consulta obrigatória na lavratura de atos de alienação). |
| **Traslado** | Primeira cópia fiel da escritura pública entregue às partes após a lavratura no livro de notas. |
| **Prenotação** | Registro provisório da escritura protocolada no Registro de Imóveis que assegura a prioridade do direito real. |
| **Nota Devolutiva** | Exigência formal emitida pelo registrador de imóveis apontando pendências para a conclusão do registro. |

---

## 3. Conta de Homologação e Perfil Pleno Oficial (`4tabeliao.scs`)

* **Usuário de Homologação:** `4tabeliao.scs`
* **Cargo:** `TABELIAO`
* **Perfil de Acesso Atribuído:** **`Perfil de acesso - Gerência webFirmas`**
* **Escopo de Permissões (Validado com Produtos):** Conforme árvore oficial em [`auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md), o perfil possui **100% das funcionalidades marcadas `[x]`** (0 itens desmarcados), incluindo `Configuraçoes > Perfis e permissões de acesso`, `Configuraçoes > Usuários` e `Configuraçoes > Parametrizações`.
* **Regra Operacional Decorrente:**
  * Nunca classificar a ausência de botões administrativos (como *Redefinir Senha Manualmente* ou *Resetar 2FA* na rotina `C-ACESSO-03`) como *"Insuficiência de Privilégio na Conta de Homologação"*.
  * Quando um recurso documentado no manual não existe na tela sob esse perfil pleno (e não está marcado com `.ngx-orion-hide` / `.functionality.disabled`), trata-se de **defasagem real do manual**. No Orion TN 6.0, a gestão pessoal de senha e 2FA fica no menu superior direito **`"Olá, [username]"`**, e não na tela de **Alteração de usuário**.

### 3.1. Ambiente de Produtos (ADR-025)

* **O que é:** ambiente interno de homologação da equipe de **Produtos** (versão Orion 06.04.x), com integrações, parâmetros globais e dados multi-ano. Acesso **só com a OpenVPN da Siplan**; entrada pelo **Portal** (`/webPortal/#/produtos`) e card **Orion TN**, que abre o módulo (`/webFirmas`) em **nova guia**. URL, usuário e senha ficam **somente** em `auditoria/.env` (nunca em documentação ou Git).
* **Conta de auditoria (ADR-026):** a conta de homologação no ambiente de Produtos (`marcus`, com os perfis `Perfil de acesso - Gerência webFirmas`, `webCaixa` e `webEstoque`, tal como `4tabeliao.scs`) possui **100% acesso pleno liberado** em todo o sistema. Itens ocultos por `.ngx-orion-hide` na árvore de menus (como `Balcão de Firmas`) correspondem a telas descontinuadas/renomeadas na aplicação (curar para **`Reconhecimento de firmas`**), **nunca** bloqueio de privilégio RBAC. Na `C-FIRMA-03` (`#/usuario/alterar`), `Grupo Firmas` equivale ao checkbox **`Escrevente de Firmas`** e `Permissões Específicas / Balcão de Firmas` caracteriza defasagem editorial do manual (`[ATT]`).
* **Fatos da UI neste ambiente (Orion 06.04.10):** **Configurações > Parametrizações** abre `#/configuracoes` (lateral `ul#navConfiguracoes`: Geral, Captura e digitalização, Parâmetros por estação, Sequência, **Comunicações**, Campos obrigatórios...). O item de menu **Parâmetros Gerais** (citado em manuais) **não existe** na árvore. A aba **Comunicações** tem links "Clique aqui para acessar a tela de configuração no Orion **Selo Digital / e-Notariado / Coaf / SIGNO**", dirigidos por JS (sem `href`/`target` no DOM); o do **Coaf** abre uma nova guia (**Certificados - SPCM-Comunicação COAF**, outra porta do mesmo servidor) com **CPF/CNPJ**, **E-mail**, **Tipo do certificado**, **Senha** e **Cadastrar**; o do **SIGNO** vem desabilitado (`disabled-no-events`) pela própria aplicação.

---

## 4. Árvore Canônica de Módulos e Telas (Orion TN 6.0)

Referência oficial de nomenclatura real da UI extraída de `permiss_es_oriontn_4tabeliao_scs.md` (atenção às grafias literais da interface, como **`Configuraçoes`** sem til):

* **Dashboard:** `Atos Protocolares`, `Envio para Registro`, `Comunicações`
* **Agenda de protocolos:** `Acessar Agenda de Protocolos`, `Gerenciar Agendamento de Protocolo`
* **Firmas:** `Abertura de pedido`, `Balcão de firmas`, `Reconhecimento de firmas` (`Visualização de andamentos`, `Tela de termos`, `Cartão de assinatura`, `Inserir sinal público`), `Consultas` (`Serviços praticados`), `Cadastros` (`Cartão de assinatura`, `Sinal público`, `Tipo de documento - Termo de comparecimento`), `Digitalização em lote`
* **Notas:** `Protocolos` (`Aba de trâmites`, `Tela de andamentos`, `Cartão de assinatura`, `Acessar anexos`, `Card/listagem movimentação financeira`, `Card/listagem documentos apresentados`, `Qualificação das partes`, `Valor de pagamento`, `Acessar card COAF`, `Inserir imóvel`, `Acessar custas`, `Gerar selos digitais`, `Inserir índice retroativo`, `Alterar informações complementares`, `Acesso card Editor`, `Bem e direito`, `Aba de bloqueio`), `Orçamentos`, `Certidões e serviços`, `Consultas` (`Índice de escrituras e procurações`, `Orçamentos`, `Protocolos`, `Movimentação financeira por protocolo`, `Certidões e serviços`, `Editor`)
* **Relatórios:** `Fechamento de caixa`, `PEX - TJ/SP`, `PEX Selos - TJ/SP`, `Recolhimento diário`, `Atos Incompletos`, `Demonstrativo financeiro dos selos digitais`, `Recolhimento resumido`, `Índice por livro`, `Transferência de imóveis`, `Auditoria Selos TJ - Orion`, `Livro Protocolo`, `Relatório ISS`
* **Administração:** `Comissões` (`Consulta`, `Consulta indicação de mensalistas`, `Planos de comissão`, `Plano diferenciado Mensalistas`, `Planos indicação de mensalista`), `Comunicações` (`COAF`, `Outras comunicações`), `Auditoria de Selos`, `Selo digital`, `Recolhimento`, `Envio de escrituras para Registro`, `Controle de Estoque` (`Aquisição`, `Distribuição`, `Consumo manual`, `Consultas`, `Cadastros`), `Cadastro de Impedimentos`, `Importações de arquivos`, `Controle de Livros`, `Mensalistas` (`Faturamento`, `Filiais`, `Lançamentos manuais`, `Mensalistas`), `Cadastro de Pessoas Jurídicas`, `Serviços internos realizados`, `Certidões solicitadas`, `Calendário`, `Históricos`
* **Configuraçoes** *(grafia literal sem til na árvore de permissões)*: `Dados do cartório` (`Intermediadores`, `Enquadramento COAF`), `Modelos de impressão` (`Listagens diversas`, `Etiquetas diversas`, `Configuração de impressão`), `Tabela de custas` (`Cálculos`, `Itens`, `Grupo de item`, `Parâmetros`, `Taxas`, `Vigências`), `Cadastros auxiliares` (`Alíquotas`, `Banco`, `Cargo`, `Documento apresentado`, `Espécie`, `Feriados`, `Formas de pagamento`, `Natureza`, `Órgão expedidor`, `Outros serviços`, `Participação`, `Perfil de partes`, `Pessoa física`, `Serviços Internos`, `Situação do protocolo`, `Tipo de movimentação financeira`, `Tipo de documento`, `Tipo de e-mail`, `Tipo de endereço`, `Tipo de telefone`, `Tipo de representante`), `Perfis e permissões de acesso`, `Usuários`, `Parametrizações`
* **Integração:** `Dados da ficha`, `Protocolo via API`
* **Botões de linha (ícones) de grades** *(ADR-020)*: olho = **Consultar** (manual: *Visualizar*), lápis = **Alterar** (manual: *Editar*), X = **Excluir** (manual: *Remover*). Nome real no atributo `title`.
* **Abertura de chamados**
* **Tags de revisão humana da auditoria** *(ADR-021, substituem o antigo `[!!!]`)*: **`[ATT]`** = atualização editorial (o manual cita tela/caminho/botão/campo que não existe mais na versão atual); **`[DDD]`** = dependência de dados (faltam registros no banco de homologação, ou o ambiente/hardware não permite validar; ação da equipe de Produtos); **`[XRX]`** = dependência cruzada (a rotina precisa que outra rotina rode antes e crie o registro). Registros criados pelo agente para destravar uma grade vazia levam a marca **`AUDIT-MOCK`**.

### 4.1. Catálogo Canônico de Menus — Orion TN 06.05.02 (ADR-037)

* **Fonte versionada e oficial da barra de menus:** [`auditoria/data/orion-menu-tree-canonical.json`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/data/orion-menu-tree-canonical.json), gerado por `npm --prefix auditoria run menu:catalog` a partir de [`auditoria/mapeamento-menus/arvore-menus-orion-tn.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/mapeamento-menus/arvore-menus-orion-tn.md) (transcrição das prints) + `manifest.json`. **115 caminhos finais** (110 nos 7 menus da barra + 5 no menu do usuário) e 134 nós. Para caminhos de menu do 06.05.02, o catálogo prevalece sobre a árvore de permissões acima (que reflete a versão 6.0 e a grafia da tela de permissões).
* **Barra superior (esquerda → direita):** **Dashboard**, **Firmas**, **Notas**, **Relatórios**, **Administração**, **Históricos** (link direto, sem submenu) e **Configurações** (com til na barra).
* **Homônimos exatos (4):** **Consultas** (Firmas, Notas, Controle de Estoque), **Cadastros** (Firmas, Controle de Estoque), **Comunicações** (Dashboard, Administração), **Mensalistas** (submenu de Administração e tela dentro dele). Sem pista de módulo/contexto, nunca se escolhe um deles.
* **Menu do usuário (canto superior direito):** a aplicação o exibe com o nome do usuário logado; em qualquer texto, relatório ou manual escreve-se sempre **`Olá, [usuário]`** (nunca o nome real). Itens: **Alterar senha**, **Fale conosco**, **Autenticação em dois fatores**, **Cadastrar biometria** e **Sair**. A troca da própria senha e o 2FA ficam aqui, não em **Configurações > Usuários**.
* **Grafias reais que divergem de manuais antigos:** **Reconhecimento de firmas** (minúsculo), **Firmas > Cadastros** (plural), **Configurações > Parametrizações** (não existe *Parâmetros Gerais*), **Configurações > Perfis e permissões de acesso** (não existe *Grupos e Perfis de Acesso*), **Configurações > Tabela de custas > Grupo de item**, **Administração > Controle de Livros** (não existe raiz *Livros*), **Administração > Controle de Estoque** (antigo *Orion Estoque*) e **Cadastros auxiliares** só sob **Configurações**.
