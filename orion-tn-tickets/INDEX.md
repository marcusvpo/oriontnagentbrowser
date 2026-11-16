# Base de Conhecimento Operacional — Orion TN (Suporte Ellevo / 0800)

Esta base de conhecimento reúne a extração integral, estruturada e sanitizada de todos os chamados de suporte do produto **Orion TN** registrados no sistema de atendimento Ellevo / 0800 da SiplanControl-M.

Os dados foram consolidados para servir de insumo de altíssima fidelidade para a **Base de Conhecimento do Assistente de Inteligência Artificial do Orion TN**, permitindo que ele responda dúvidas com base na experiência real de atendimento acumulada pelos analistas de suporte.

---

## 📊 Estatísticas Gerais da Varredura

| Métrica | Quantidade |
| :--- | :--- |
| **Total de Chamados Orion TN Analisados** | **9.384** |
| **Total de Trâmites Técnicos Extraídos** | **15.648** |
| **Chamados Concluídos / Resolvidos (com Soluções Oficiais)** | **6.095** |
| **Chamados Recentes em Aberto (Cenários das Versões Atuais)** | **3.289** |
| **Período Histórico Coberto** | **2023 a 2026 (Atual)** |
| **Naturezas Selecionadas** | Dúvida operacional, Configuração do sistema, Erro operacional |
| **Software Foco** | Orion TN (Excluídos chamados de sistemas Legados) |

---

## 📂 Catálogo Temático de Módulos (Arquivos .md)

A base foi dividida em 11 módulos funcionais para viabilizar o consumo por LLMs e ferramentas de RAG sem ultrapassar limites de janela de contexto.

| Módulo / Arquivo | Descrição Temática | Total Chamados | Concluídos | Em Aberto |
| :--- | :--- | :---: | :---: | :---: |
| [**Módulo 01 — Financeiro, Caixa, Guias de Recolhimento e Recibos**](./01-financeiro-caixa-guias-recibos.md) | Operações financeiras, fechamento de caixa, depósito prévio, emissão e estorno de guias de recolhimento, recibos, ISS, Sinoreg e emolumentos notariais. | 2.993 | 1.196 | 1.797 |
| [**Módulo 02 — Selo Digital e Integrações com Tribunais (TJ)**](./02-selo-digital-tribunais.md) | Geração, consulta, lote, validação, cancelamento e transmissão de selos digitais do Tribunal de Justiça competente. | 713 | 563 | 150 |
| [**Módulo 03 — Lavratura de Atos (Escrituras, Procurações e Testamentos)**](./03-lavratura-atos-escrituras-procuracoes.md) | Rotinas de lavratura, qualificação de partes, escrituras públicas (compra/venda, inventário, doação, divórcio), procurações, substabelecimentos e testamentos. | 286 | 257 | 29 |
| [**Módulo 04 — Reconhecimento de Firmas e Autenticações**](./04-reconhecimento-firmas-autenticacoes.md) | Reconhecimento de firma por semelhança e autenticidade, cartão de autógrafo, biometria facial/digital, ficha de firma, autenticação de cópias e sinal público. | 398 | 340 | 58 |
| [**Módulo 05 — Centrais Notariais Obrigatórias (COAF, CENSEC, DOI, SIRC, e-Notariado)**](./05-centrais-coaf-censec-doi-sirc.md) | Transmissões e comunicações obrigatórias para COAF (operações suspeitas), CENSEC (CESDI, RCTO, CEP), DOI (Receita Federal), SIRC e plataforma e-Notariado. | 807 | 616 | 191 |
| [**Módulo 06 — Livros Notariais, Termos de Abertura/Encerramento e Folhas**](./06-livros-notariais-termos-folhas.md) | Gerenciamento de livros notariais (Notas, Procurações), numeração e controle sequencial de folhas, termos de abertura, termos de encerramento e traslados. | 464 | 368 | 96 |
| [**Módulo 07 — Modelos, Minutas e Editor OrionTN**](./07-modelos-minutas-editor-oriontn.md) | Editor de texto integrado do Orion TN, gestão de modelos de minutas, tags dinâmicas, variáveis de sistema, formatação e máscaras. | 135 | 112 | 23 |
| [**Módulo 08 — Certidões, Buscas de Atos e Fichas**](./08-certidoes-buscas.md) | Emissão de certidões em breve relato e inteiro teor, buscas de atos por período/partes, fichas de atos e conferências. | 78 | 59 | 19 |
| [**Módulo 09 — Usuários, Perfis, Permissões e Acessos**](./09-usuarios-permissoes-acessos.md) | Cadastro de colaboradores (tabelião, substitutos, escreventes), perfis de permissão, liberação de rotinas, senhas e trilha de auditoria. | 443 | 342 | 101 |
| [**Módulo 10 — Configurações Gerais, Impressão, Certificado Digital e Infraestrutura**](./10-configuracao-sistema-perifericos.md) | Parâmetros globais do Orion TN, impressoras de etiquetas e termos, certificados digitais ICP-Brasil (A1/A3), token, scanners, banco de dados e backup. | 500 | 370 | 130 |
| [**Módulo 11 — Dúvidas Operacionais Gerais e Rotinas Administrativas**](./11-geral-outras-duvidas-operacionais.md) | Atendimentos operacionais gerais, cadastros diversos de pessoas e partes, validações cadastrais e procedimentos de suporte que perpassam múltiplos fluxos. | 2.567 | 1.872 | 695 |

---

## 🛡️ Tratamento e Sanitização de Dados Aplicados

Para garantir conformidade com boas práticas de segurança e proteção de dados (LGPD):
1. **Credenciais e Acessos Remotos:** Todos os IDs e senhas de AnyDesk, TeamViewer, senhas de sistema e IPs locais/públicos foram removidos e substituídos por marcadores seguros (`[ACESSO REMOVIDO]`, `[SENHA REMOVIDA]`).
2. **Telefones e Ramais:** Contatos telefônicos diretos de atendentes e funcionários de cartórios foram higienizados (`[CONTATO TELEFÔNICO REMOVIDO]`), preservando números de protocolos, livros, folhas e selos intactos.
3. **Limpeza de Boilerplate:** Pesquisas de satisfação de suporte, mensagens repetitivas de despedida e questionários de qualidade foram removidos dos trâmites, preservando apenas o conteúdo técnico útil.
4. **Integridade Notarial:** O contexto dos cartórios, tipos de livros, minutas, rotinas e mensagens de erro do sistema foram **100% preservados**, garantindo que o assistente compreenda a terminologia notarial exata.

---

## 🤖 Guia de Ingestão e Uso para IAs e RAG

Ao utilizar esta base em outro modelo de IA ou motor de RAG (Retrieval-Augmented Generation):
1. **Chunking Recomendado:** Quebre os arquivos utilizando o delimitador `### Chamado #` para que cada chunk represente uma unidade de conhecimento completa (solicitação + trâmites + solução).
2. **Prioridade de Resolução:** Priorize sempre os dados da seção **1. Chamados Concluídos e Resolvidos**, pois trazem as soluções homologadas pelo suporte técnico.
3. **Cenários Recentes:** Utilize a seção **2. 📌 Dúvidas e Cenários Recentes em Aberto** para identificar novas terminologias e comportamentos introduzidos nas versões recentes do Orion TN.
4. **Metadados:** Os campos de metadados no início de cada chamado (`Cartório`, `Natureza`, `Analista`, `Data`) podem ser convertidos em vetores de filtragem facetada em bancos como pgvector, Pinecone ou Qdrant.

---
*Gerado automaticamente pelo agente Antigravity no Siplan HUB.*
