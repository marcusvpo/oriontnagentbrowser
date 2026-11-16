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
