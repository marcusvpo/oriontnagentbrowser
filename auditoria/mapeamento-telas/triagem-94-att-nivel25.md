# Triagem Inteligente das 94 Rotinas `[ATT]` × Catálogo Nível 2.5

- **Versão do Catálogo:** 06.05.02 (115 telas mapeadas)
- **Gerado em:** 2026-11-26T14:47:53.834Z
- **Total de Rotinas `[ATT]` Analisadas:** 94

## 1. Resumo Executivo por Fila

| Fila | Quantidade | % | Subcausas |
|---|---:|---:|---|
| **Fila 1 — Destraváveis Agora** | 12 | 12.8% | 1A Sub-estado/Literal: **8** · 1B Menu Canônico: **3** · 1C Similar/Renomeação: **1** |
| **Fila 2 — `[ATT]` Legítimo (Lista Ouro)** | 76 | 80.9% | Confirmadas ausentes no Orion TN 06.05.02: **76** |
| **Fila 3 — Dependência Dados / Fluxo / HW** | 6 | 6.4% | Grade vazia: **4** · Ato prévio `[XRX]`: **0** · Hardware/Serviço: **2** |

## 2. Distribuição por Módulo

| Módulo | Total `[ATT]` | Fila 1 (Destraváveis) | Fila 2 (`[ATT]` Legítimo) | Fila 3 (`[DDD]`/`[XRX]`) |
|---|---:|---:|---:|---:|
| acesso | 8 | 0 | 8 | 0 |
| centrais | 12 | 1 | 11 | 0 |
| certidoes | 12 | 1 | 11 | 0 |
| config | 18 | 1 | 15 | 2 |
| firmas | 17 | 3 | 13 | 1 |
| livros | 15 | 1 | 12 | 2 |
| selos | 12 | 5 | 6 | 1 |

## 3. Top 12 Sugeridas para o Piloto A/B Ao Vivo (Priorizando `config` e `firmas`)

| # | ID | Módulo | Subcausa | Passo | Rota | Mecanismo de Destravamento |
|---:|---|---|---|---:|---|---|
| 1 | M-16.8 | firmas | `1A_substate_literal` | 2 | `#/configuracoes` | Catálogo L2.5 literal (Pedido de Firmas -> root) |
| 2 | M-26.0 | config | `1A_substate_literal` | 5 | `#/configuracaoImpressaoModelo/cadastrar` | Sinônimo de rota já homologado + L2.5 (Salto (Gap) ~= Salto de etiquetas (cm) [0.95, modal:Adicionar]) |
| 3 | D-3.3 | firmas | `1A_substate_literal` | 2 | `#/ficha/cadastrar` | Sinônimo de rota já homologado + L2.5 (Preencher com IA ~= Preencher cartão usando I.A. [0.95, modal:Adicionar]) |
| 4 | V-1.0 | firmas | `1A_substate_literal` | 3 | `#/sinalPublico/cadastrar` | Sinônimo de rota já homologado + L2.5 (data de recebimento/envio ~= Data recebimento [0.95, modal:Adicionar]) |
| 5 | R-11.0 | centrais | `1A_substate_literal` | 2 | `#/comunicacoes/cadastrar` | Catálogo L2.5 literal (Gerar -> root; "E-notariado" -> root) |
| 6 | D-2.4 | selos | `1A_substate_literal` | 3 | `#/categoria/cadastrar` | Sinônimo de rota já homologado + L2.5 (Nome da Categoria ~= Descrição [0.95, root]) |
| 7 | D-2.7 | selos | `1A_substate_literal` | 6 | `#/produto/cadastrar` | Sinônimo de rota já homologado + L2.5 (Salvar ~= Concluir [0.95, modal:Adicionar]) |
| 8 | M-16.13 | certidoes | `1A_substate_literal` | 2 | `#/configuracoes` | Sinônimo de rota já homologado + L2.5 (Prazo de entrega padrão (dias) ~= Previsão de entrega [0.95, tab:Certidão]) |
| 9 | M-16.1 | selos | `1C_similar_candidate` | 2 | `#/configuracoes` | Candidato similar para curadoria em route-synonyms.ts (Papel de Segurança (NFS) ~= Papel de segurança [0.89, tab:Certidão]) |
| 10 | C-SELO-04 | selos | `1B_menu_canonical` | 5 | `#/inicio` | Menu canônico (explicit_equivalence): Configurações > Parametrizações |
| 11 | C-LIVRO-06 | livros | `1B_menu_canonical` | 1 | `#/inicio` | Menu canônico (folha_exact_leaf): Administração > Comunicações |
| 12 | C-SELO-09 | selos | `1B_menu_canonical` | 1 | `#/inicio` | Menu canônico (screen_alias): Administração > Controle de Estoque |

**IDs do Piloto A/B:** `M-16.8,M-26.0,D-3.3,V-1.0,R-11.0,D-2.4,D-2.7,M-16.13,M-16.1,C-SELO-04,C-LIVRO-06,C-SELO-09`

## 4. Candidatos de Renomeação (Similares `1C` para Curadoria na Etapa 2)

| ID | Módulo | Tela | Rota | Termo no Manual | Candidato Real UI | Tipo | `where` | Sim. |
|---|---|---|---|---|---|---|---|---:|
| C-ACESSO-02 | acesso | 109 | `#/usuario/alterar` | **Ativo** | **Inativos** | `field` | `root` | 0.73 |
| M-16.1 | selos | 110 | `#/configuracoes` | **Papel de Segurança (NFS)** | **Papel de segurança** | `field` | `tab:Certidão` | 0.89 |

## 5. Fila 1 — Destraváveis Agora (12)

| ID | Módulo | Subcausa | Passo | Rota | Alvos Faltantes | Evidência / Diagnóstico L2.5 |
|---|---|---|---:|---|---|---|
| R-11.0 | centrais | `1A_substate_literal` | 2 | `#/comunicacoes/cadastrar` | Gerar, "E-notariado" | Todos os 2 alvo(s) existem literalmente na tela 043: Gerar -> root; "E-notariado" -> root. |
| M-16.13 | certidoes | `1A_substate_literal` | 2 | `#/configuracoes` | Prazo de entrega padrão (dias) | Tela 110: Prazo de entrega padrão (dias) ~= Previsão de entrega [0.95, tab:Certidão]. |
| M-26.0 | config | `1A_substate_literal` | 5 | `#/configuracaoImpressaoModelo/cadastrar` | Salto (Gap) | Tela 075: Salto (Gap) ~= Salto de etiquetas (cm) [0.95, modal:Adicionar]. |
| D-3.3 | firmas | `1A_substate_literal` | 2 | `#/ficha/cadastrar` | Preencher com IA | Tela 009: Preencher com IA ~= Preencher cartão usando I.A. [0.95, modal:Adicionar]. |
| M-16.8 | firmas | `1A_substate_literal` | 2 | `#/configuracoes` | Pedido de Firmas | Todos os 1 alvo(s) existem literalmente na tela 110: Pedido de Firmas -> root. |
| V-1.0 | firmas | `1A_substate_literal` | 3 | `#/sinalPublico/cadastrar` | data de recebimento/envio | Tela 010: data de recebimento/envio ~= Data recebimento [0.95, modal:Adicionar]. |
| C-LIVRO-06 | livros | `1B_menu_canonical` | 1 | `#/inicio` | Notas > Fechamento de Quinzena / Comunicações | Caminho "Notas > Fechamento de Quinzena / Comunicações" -> "Administração > Comunicações" (tela ?, 0/0 alvos seguintes confirmados no catálogo). |
| C-SELO-04 | selos | `1B_menu_canonical` | 5 | `#/inicio` | Orion TN, Configurações > Parâmetros de Integração > Certificado Digital | Caminho "Configurações > Parâmetros de Integração > Certificado Digital" -> "Configurações > Parametrizações" (tela 110, 1/2 alvos seguintes confirmados no catálogo). |
| C-SELO-09 | selos | `1B_menu_canonical` | 1 | `#/inicio` | Orion Estoque | Caminho "Orion Estoque" -> "Administração > Controle de Estoque" (tela ?, 0/0 alvos seguintes confirmados no catálogo). |
| D-2.4 | selos | `1A_substate_literal` | 3 | `#/categoria/cadastrar` | Nome da Categoria | Tela 054: Nome da Categoria ~= Descrição [0.95, root]. |
| D-2.7 | selos | `1A_substate_literal` | 6 | `#/produto/cadastrar` | Salvar | Tela 056: Salvar ~= Concluir [0.95, modal:Adicionar]. |
| M-16.1 | selos | `1C_similar_candidate` | 2 | `#/configuracoes` | Papel de Segurança (NFS) | Tela 110: Papel de Segurança (NFS) ~= Papel de segurança [0.89, tab:Certidão]. |

## 6. Fila 2 — Defasagem Real do Manual Confirmada (`[ATT]` Legítimo) (76)

| ID | Módulo | Subcausa | Passo | Rota | Alvos Faltantes | Evidência / Diagnóstico L2.5 |
|---|---|---|---:|---|---|---|
| C-ACESSO-02 | acesso | `2_lista_ouro_confirmada` | 3 | `#/usuario/alterar` | Ativo, Inativo / Bloqueado | Ausente(s) em toda a superfície e sub-estados: [Inativo / Bloqueado] / Parciais: Ativo -> Inativos (root) |
| C-ACESSO-03 | acesso | `2_lista_ouro_confirmada` | 4 | `#/usuario/alterar` | Geral, Redefinir Senha Manualmente, Exigir troca no próximo logon | Ausente(s) em toda a superfície e sub-estados: [Geral, Redefinir Senha Manualmente, Exigir troca no próximo logon] |
| C-ACESSO-04 | acesso | `2_lista_ouro_confirmada` | 3 | `#/usuario/alterar` | Senha | Ausente(s) em toda a superfície e sub-estados: [Senha] |
| C-ACESSO-06 | acesso | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Configurações > Grupos e Perfis de Acesso | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-ACESSO-07 | acesso | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Configurações > Grupos e Perfis de Acesso | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-ACESSO-08 | acesso | `2_lista_ouro_confirmada` | 4 | `#/usuario/alterar` | Parâmetros Notariais, [x] Autorizado a Lavrar Escrituras, Procurações e Atas | Ausente(s) em toda a superfície e sub-estados: [Parâmetros Notariais, [x] Autorizado a Lavrar Escrituras, Procurações e Atas] |
| V-3.4.6 | acesso | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Para emitir recibo com pendência de assinaturas: | Ausente(s) em toda a superfície e sub-estados: [Para emitir recibo com pendência de assinaturas:] |
| V-7.5.3 | acesso | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Canetinha, Livro, Impressão Definitiva, Impresso | Ausente(s) em toda a superfície e sub-estados: [Canetinha, Livro, Impressão Definitiva, Impresso] |
| C-CENTRAL-03 | centrais | `2_lista_ouro_confirmada` | 2 | `#/participacaoNotas` | Comunicações - Configurações | Ausente(s) em toda a superfície e sub-estados: [Comunicações - Configurações] |
| C-CENTRAL-09 | centrais | `2_lista_ouro_confirmada` | 2 | `#/protocolo/cadastrar` | Partes, Município | Ausente(s) em toda a superfície e sub-estados: [Partes, Município] |
| C-CENTRAL-13 | centrais | `2_lista_ouro_confirmada` | 2 | `#/inicio` | Administração > Comunicações > SIRC / Comunicações Previdenciárias | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| C-CENTRAL-14 | centrais | `2_lista_ouro_confirmada` | 2 | `#/inicio` | Integração Externa / ONR - SAEC | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| D-3.2 | centrais | `2_lista_ouro_confirmada` | 2 | `#/dashboard/envioRegistro` | Prenotados no RI | Ausente(s) em toda a superfície e sub-estados: [Prenotados no RI] |
| M-13.0 | centrais | `2_lista_ouro_confirmada` | 5 | `#/aberturaPedidos` | Concluir o pedido | Ausente(s) em toda a superfície e sub-estados: [Concluir o pedido] |
| M-16.5 | centrais | `2_lista_ouro_confirmada` | 3 | `#/configuracoes` | Produção, Homologação | Ausente(s) em toda a superfície e sub-estados: [Produção, Homologação] |
| M-32.0 | centrais | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Administração > Comunicações > Lotes de comunicação, Firmas > Comunicações > Lotes SEFAZ | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-61.0 | centrais | `2_lista_ouro_confirmada` | 4 | `#/natureza/cadastrar` | Sigla | Ausente(s) em toda a superfície e sub-estados: [Sigla] |
| C-CENTRAL-04 | centrais | `2_lista_ouro_confirmada` | 4 | `#/inicio` | Orion TN, Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC | Equivalência de menu encontrada, porém os passos seguintes citam recursos ausentes na tela 110. |
| C-CENTRAL-08 | centrais | `2_lista_ouro_confirmada` | 3 | `#/comunicacoes` | Cartões de Autógrafo / Fichas de Firma | Ausente(s) em toda a superfície e sub-estados: [Cartões de Autógrafo / Fichas de Firma] |
| C-CERT-01 | certidoes | `2_lista_ouro_confirmada` | 2 | `#/certidoesServicos/cadastrar` | Modalidade de Cobrança, Isenta / Gratuita | Ausente(s) em toda a superfície e sub-estados: [Modalidade de Cobrança, Isenta / Gratuita] |
| C-CERT-03 | certidoes | `2_lista_ouro_confirmada` | 2 | `#/certidoesServicos/cadastrar` | Certidão de Ato Antigo / Não Digitalizado | Ausente(s) em toda a superfície e sub-estados: [Certidão de Ato Antigo / Não Digitalizado] |
| C-CERT-04 | certidoes | `2_lista_ouro_confirmada` | 2 | `#/inicio` | Mais Definições | Ausente(s) em toda a superfície e sub-estados: [Mais Definições] |
| C-CERT-05 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Orion TN | Ausente(s) em toda a superfície e sub-estados: [Orion TN] |
| D-3.14 | certidoes | `2_lista_ouro_confirmada` | 2 | `#/certidoesServicos/cadastrar` | Identificação do Solicitante | Ausente(s) em toda a superfície e sub-estados: [Identificação do Solicitante] |
| D-3.15 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Notas > Certidões > Consulta de Certidões | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| D-3.29 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Certidões Solicitadas | Ausente(s) em toda a superfície e sub-estados: [Certidões Solicitadas] |
| M-54.1 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Notas > Pedido de certidão | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| M-54.2 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Busca | Ausente(s) em toda a superfície e sub-estados: [Busca] |
| M-54.3 | certidoes | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Custas | Ausente(s) em toda a superfície e sub-estados: [Custas] |
| V-6.2.3 | certidoes | `2_lista_ouro_confirmada` | 5 | `#/protocolo/aberto` | Filtrar | Ausente(s) em toda a superfície e sub-estados: [Filtrar] |
| M-12.0 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Balcão de Firmas, Últimos serviços realizados | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-14.2 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Balcão de firmas, Lançamento de Serviços | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-16.10 | config | `2_lista_ouro_confirmada` | 2 | `#/configuracoes` | Configuração do Servidor (SMTP), Porta, TLS/SSL | Ausente(s) em toda a superfície e sub-estados: [Configuração do Servidor (SMTP), Porta, TLS/SSL] |
| M-22.0 | config | `2_lista_ouro_confirmada` | 2 | `#/livro/cadastrar` | Tipo de Livro, Livro de Notas, Livro de Procurações | Ausente(s) em toda a superfície e sub-estados: [Livro de Notas, Livro de Procurações] / Parciais: Tipo de Livro -> Tipo livro (root) |
| M-24.0 | config | `2_lista_ouro_confirmada` | 3 | `#/tipoDocumento/cadastrar` | CRV - SEFAZ SP | Ausente(s) em toda a superfície e sub-estados: [CRV - SEFAZ SP] |
| M-32.2 | config | `2_lista_ouro_confirmada` | 1 | `#/configuracoes` | Certificados digitais | Ausente(s) em toda a superfície e sub-estados: [Certificados digitais] |
| M-34.0 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Notas > Cadastros auxiliares > Tipos de anexo, Administração > Cadastros auxiliares > Tipos de anexo | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-35.0 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Notas > Cadastros auxiliares > Tipos de anexo, Adicionar | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-42.0 | config | `2_lista_ouro_confirmada` | 3 | `#/modeloEtiqueta` | Pesquisar por modelo | Ausente(s) em toda a superfície e sub-estados: [Pesquisar por modelo] |
| M-63.0 | config | `2_lista_ouro_confirmada` | 3 | `#/grupoItem/cadastrar` | Notas, Firmas | Ausente(s) em toda a superfície e sub-estados: [Notas, Firmas] |
| M-69.0 | config | `2_lista_ouro_confirmada` | 3 | `#/modeloEtiqueta` | Pesquisar por modelo | Ausente(s) em toda a superfície e sub-estados: [Pesquisar por modelo] |
| M-70.0 | config | `2_lista_ouro_confirmada` | 4 | `#/modeloEtiqueta/cadastrar` | Reconhecimento de firma por semelhança sem valor econômico | Ausente(s) em toda a superfície e sub-estados: [Reconhecimento de firma por semelhança sem valor econômico] |
| M-70.1 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Editar, Parâmetros Técnicos / Layout | Equivalência de menu encontrada, porém os passos seguintes citam recursos ausentes na tela 079. |
| V-2.2.3 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | ITBI | Ausente(s) em toda a superfície e sub-estados: [ITBI] |
| V-2.3.1 | config | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Registro de Imóveis | Ausente(s) em toda a superfície e sub-estados: [Registro de Imóveis] |
| C-FIRMA-02 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Erro de Grafia no Termo Já Impresso | Ausente(s) em toda a superfície e sub-estados: [Erro de Grafia no Termo Já Impresso] |
| C-FIRMA-03 | firmas | `2_lista_ouro_confirmada` | 4 | `#/usuario/alterar` | Permissões Específicas | Ausente(s) em toda a superfície e sub-estados: [Permissões Específicas] |
| C-FIRMA-05 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Orion TN, Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV) | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| C-FIRMA-06 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Configurações > Parâmetros de NFS-e > Regras de Balcão | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-FIRMA-07 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-FIRMA-08 | firmas | `2_lista_ouro_confirmada` | 2 | `#/inicio` | Configurações > Parâmetros Gerais > Armazenamento e GED | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| M-14.1 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Balcão de firmas, Partes / Cartão de assinatura | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-16.4 | firmas | `2_lista_ouro_confirmada` | 3 | `#/configuracoes` | Último número gerado, Próximo número | Ausente(s) em toda a superfície e sub-estados: [Último número gerado, Próximo número] |
| M-51.3 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Qualificação de Partes | Ausente(s) em toda a superfície e sub-estados: [Qualificação de Partes] |
| M-9.0 | firmas | `2_lista_ouro_confirmada` | 4 | `#/ficha/cadastrar` | Contato e Endereço | Ausente(s) em toda a superfície e sub-estados: [Contato e Endereço] |
| R-10.0 | firmas | `2_lista_ouro_confirmada` | 2 | `#/pedidoFirmas/cadastrar` | "+" (Adicionar Novo Pedido) | Ausente(s) em toda a superfície e sub-estados: ["+" (Adicionar Novo Pedido)] |
| V-3.1.3 | firmas | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Gerar Recibo | Ausente(s) em toda a superfície e sub-estados: [Gerar Recibo] |
| V-CCA.1.1 | firmas | `2_lista_ouro_confirmada` | 5 | `#/ficha/cadastrar` | Lupa | Ausente(s) em toda a superfície e sub-estados: [Lupa] |
| C-LIVRO-05 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Livros > Gestão de Livros Notariais | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-LIVRO-07 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Orion Estoque > Livros Notariais > Controle de Folhas Soltas | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| C-LIVRO-08 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Orion Caixa, Administração > Rotinas Especiais > Consolidação de Movimentações | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| D-3.16 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Gerar no Editor | Ausente(s) em toda a superfície e sub-estados: [Gerar no Editor] |
| D-3.27 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Gerar Livro Definitivo | Ausente(s) em toda a superfície e sub-estados: [Gerar Livro Definitivo] |
| D-3.41 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Gerar Livro Definitivo | Ausente(s) em toda a superfície e sub-estados: [Gerar Livro Definitivo] |
| D-3.60 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Notas > Cadastros > Livro para Consumo | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| M-29.1 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Firmas > Consultas > Termos de comparecimento | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |
| R-26.0 | livros | `2_lista_ouro_confirmada` | 2 | `#/inicio` | Livro Final | Ausente(s) em toda a superfície e sub-estados: [Livro Final] |
| R-36.0 | livros | `2_lista_ouro_confirmada` | 3 | `#/inicio` | Para Rascunho / Conferência:, "Rascunho", Para Impressão Definitiva:, Folha Inicial | Ausente(s) em toda a superfície e sub-estados: [Para Rascunho / Conferência:, "Rascunho", Para Impressão Definitiva:, Folha Inicial] |
| V-7.0.4 | livros | `2_lista_ouro_confirmada` | 5 | `#/inicio` | CNIB | Ausente(s) em toda a superfície e sub-estados: [CNIB] |
| V-7.2.1 | livros | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Editor | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-SELO-01 | selos | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Módulos > Selo Digital > Auditoria / Conferência Semanal | Rota resolvida ao vivo anteriormente, porém os elementos dos passos seguintes não existem na tela real. |
| C-SELO-03 | selos | `2_lista_ouro_confirmada` | 3 | `#/seloDigital` | Online, Modo de Selagem Offline (Contingência) | Ausente(s) em toda a superfície e sub-estados: [Online, Modo de Selagem Offline (Contingência)] |
| C-SELO-10 | selos | `2_lista_ouro_confirmada` | 2 | `#/natureza` | Compra e Venda Pura, Procuração | Ausente(s) em toda a superfície e sub-estados: [Compra e Venda Pura] / Parciais: Procuração -> PROCURAÇÃO (modal:Adicionar) |
| D-3.75 | selos | `2_lista_ouro_confirmada` | 1 | `#/configuracoes` | Consumo de Insumos | Ausente(s) em toda a superfície e sub-estados: [Consumo de Insumos] |
| R-1.6 | selos | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Stock (Estoque) | Ausente(s) em toda a superfície e sub-estados: [Stock (Estoque)] |
| V-2.0 | selos | `2_lista_ouro_confirmada` | 1 | `#/inicio` | Orion Stock | Bloqueio em navegação de menu sem tela equivalente no catálogo canônico. |

## 7. Fila 3 — Dependência de Dados / Fluxo Prévio / Hardware (6)

| ID | Módulo | Subcausa | Passo | Rota | Alvos Faltantes | Evidência / Diagnóstico L2.5 |
|---|---|---|---:|---|---|---|
| M-16.2 | config | `3_hardware_ou_servico_externo` | 2 | `#/configuracoes` | Dispositivo de Captura | Dependência de hardware/serviço externo detectada (M-16.2). |
| V-2.2.2 | config | `3_grade_vazia_ou_registro` | 1 | `#/inicio` | Natureza, Item | Passo exige registro na grade (Natureza, Item) e a tela #/inicio está sem linhas no catálogo. |
| V-CCA.1.2 | firmas | `3_grade_vazia_ou_registro` | 1 | `#/inicio` | Cartão de Assinatura, Profissão | Passo exige registro na grade (Cartão de Assinatura, Profissão) e a tela #/inicio está sem linhas no catálogo. |
| C-LIVRO-04 | livros | `3_hardware_ou_servico_externo` | 2 | `#/inicio` | PowerShell, Docker Desktop | Dependência de hardware/serviço externo detectada (C-LIVRO-04). |
| V-7.4.2 | livros | `3_grade_vazia_ou_registro` | 1 | `#/inicio` | Livro, Canetinha, Editor | Passo exige registro na grade (Livro, Canetinha, Editor) e a tela #/inicio está sem linhas no catálogo. |
| R-1.4 | selos | `3_grade_vazia_ou_registro` | 1 | `#/inicio` | Barra Superior | Passo exige registro na grade (Barra Superior) e a tela #/inicio está sem linhas no catálogo. |
