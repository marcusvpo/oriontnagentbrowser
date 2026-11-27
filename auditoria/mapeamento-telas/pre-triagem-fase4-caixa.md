# Pré-Triagem da Fase 4 — `kb/rotinas/caixa/` (105 Rotinas) por Produto do Portal Orion

- **Gerado em:** 2026-11-26 (inspeção determinística, sem navegador)
- **Fontes:** `kb/rotinas/caixa/*.md` (parser do motor), `classifyRoutineWorkload` (`worker-pool.ts`), `analyzeRoutineScope` (`step-scope.ts`) e Catálogo Estrutural de Telas Nível 2.5 (`auditoria/data/orion-screen-catalog.json`, versão `06.05.02`).
- **Carga:** 29 `read_only` + 76 `mutation` = **105** rotinas.
- **Passos externos `[CCC]` previstos (`step-scope.ts`):** **0** — nenhuma rotina de `caixa` cita portal/serviço externo (SISCOAF, e-Notariado, CENSEC, CRC, Receita...).
- **Execução:** sempre `--dry-run-mutations --headless --visual-mode defer --concurrency 3`, write-through Supabase ativo (sem `--no-sync`).

> [!NOTE]
> A coluna **Tela L2.5** só é preenchida quando a cadeia de menu documentada nos passos 1–3 coincide **exatamente** com uma cadeia do catálogo `06.05.02` (ou, no Piloto, pela tela-alvo definida no plano). O catálogo é só dica: a cadeia vale apenas se existir na árvore lida ao vivo (ADR-037). As telas do Orion Caixa e do Orion Estoque não estão no catálogo (que é do Orion TN): nelas o motor lê a árvore real do próprio produto.

## 1. Distribuição

| Grupo / Produto | Qtd. | Estratégia | Lotes |
|---|---:|---|---|
| Fase 1 PoC (`D-1.1`, preservada intacta) | 1 | Não reexecutada | — |
| **A1 — Orion TN** (`--product "Orion TN"`) | 57 | Ao vivo | Piloto (12) + TN-1 (22) + TN-2 (23) |
| **A2 — Orion Caixa** (`--product "Orion Caixa"`) | 30 | Ao vivo pelo card Orion Caixa | Caixa-1 (15) + Caixa-2 (15) |
| **A3 — Orion Estoque** (`--product "Orion Estoque"`) | 12 | Ao vivo pelo card Orion Estoque | Estoque (12) |
| **B1 — Hardware / Docker / SGA** | 5 | `[DDD]` sem navegador (`phase4-hardware-pretriage.ts`) | — |
| **Total** | **105** | 1 PoC + 99 navegador + 5 `[DDD]` (0 duplicatas, 0 omissões) | |

## 2. Grupo B1 — Pré-Triagem `[DDD]` sem Navegador

| ID | Título | Carga | Motivo (`tipo_bloqueio: Dependência de Ambiente/Hardware`) |
|---|---|---|---|
| `C-FIN-04` | Desbloqueio e Reinício do Integrador Bancário de Boletos de Mensalistas | `read_only` | Os passos 1 a 4 são executados no terminal/console do Docker do servidor da serventia (docker ps -a, docker restart siplan-integrador): infraestrutura local fora do navegador, indisponível no ambiente web de homologação. |
| `D-1.9` | Configurar Impressora e Modelos Padrão | `mutation` | A configuração depende da lista de impressoras instaladas no Windows da estação de atendimento (Impressora Padrão de Recibos): periférico físico local que o ambiente web de homologação não supre. |
| `D-3.5` | Fazer Digitalização em Lote por Sequência de Cartão | `mutation` | A digitalização em lote por sequência de cartão exige as fichas físicas no alimentador (ADF) de um scanner homologado e o perfil de cores/resolução do dispositivo: hardware TWAIN indisponível no ambiente web de homologação. |
| `D-3.7` | Fazer Digitalização em Lote de DUT para SEFAZ | `mutation` | A digitalização em lote de DUT exige os documentos físicos no alimentador de um scanner homologado (300 DPI) antes do envio à SEFAZ: hardware TWAIN indisponível no ambiente web de homologação. |
| `D-3.72` | Acessar Integração SGA (Sistema de Senhas) | `read_only` | A barra de atendimento do SGA depende do sistema de senhas instalado na serventia (painel/TV do salão, sinal sonoro e guichês físicos): serviço local e hardware externo indisponíveis no ambiente web de homologação. |

Relatórios gerados com `prints_geradas: 0`, texto 100% original e write-through Supabase; protegidos por `listHardwareRoutineIds` (fora do `--reaudit-pending`).

## 3. Lote PILOTO — `Orion TN` (12 rotinas: 5 `read_only` + 7 `mutation`)

*Etapa 2 — Piloto A/B.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion TN" --routines M-30.0,M-31.0,M-64.0,M-65.0,M-1.0,M-4.0,M-48.0,R-19.0,M-5.0,D-3.10,D-3.58,M-16.11 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=M-30.0,M-31.0,M-64.0,M-65.0,M-1.0,M-4.0,M-48.0,R-19.0,M-5.0,D-3.10,D-3.58,M-16.11
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `M-30.0` | Gerenciamento de Formas de Pagamento | `read_only` | 5 | **Administração > Financeiro > Formas de pagamento** | 088 (`#/tipoPagamento`) |
| `M-31.0` | Cadastro de Nova Forma de Pagamento | `mutation` | 6 | **Administração > Financeiro > Formas de pagamento** | 088 (`#/tipoPagamento` + modal Adicionar) |
| `M-64.0` | Gerenciar Tipo de Movimentação Financeira | `read_only` | 5 | **Administração > Financeiro > Tipos de movimentação financeira** | 102 (`#/tipoMovimentacaoFinanceira`) |
| `M-65.0` | Adicionar Novo Tipo de Movimentação Financeira | `mutation` | 6 | **Administração > Financeiro > Tipos de movimentação financeira** | 102 (`#/tipoMovimentacaoFinanceira` + modal Adicionar) |
| `M-1.0` | Consultar e Gerenciar Mensalistas Existentes | `mutation` | 5 | **Administração > Mensalistas** | 064 (`#/mensalistas`) |
| `M-4.0` | Lançamentos Manuais e Pesquisa de Lançamentos para Mensalistas | `mutation` | 6 | **Administração > Mensalistas > Lançamentos manuais** | 063 (`#/mensalistaLancamentoManual`) |
| `M-48.0` | Acessar e Gerenciar Filiais | `mutation` | 5 | **Administração > Mensalistas > Filiais** | 062 (`#/filiais`) |
| `R-19.0` | Configurar Plano de Comissões para o Módulo de Notas | `mutation` | 5 | **Administração > Comissões > Planos de Comissões** | 039 (`#/plano`) |
| `M-5.0` | Gerenciamento de Planos de Comissões | `read_only` | 5 | **Administração > Comissões > Planos** | 039 (`#/plano`) |
| `D-3.10` | Consultar Serviços Praticados | `read_only` | 5 | **Firmas > Consultas > Serviços Praticados** | 008 (`#/servicoPraticado`) |
| `D-3.58` | Gerar Recolhimento Diário | `read_only` | 6 | **Relatórios > Recolhimento Diário** | 028 (Relatórios > Recolhimento diário) |
| `M-16.11` | Parametrizar Faturamento | `mutation` | 6 | **Administração > Parâmetros > Faturamento** | 110 (`#/configuracoes`, aba Faturamento) |

## 4. Lote TN-1 — `Orion TN` (22 rotinas: 5 `read_only` + 17 `mutation`)

*Etapa 4 — Mensalistas/Comissões/Custas.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion TN" --routines M-2.0,M-3.0,M-33.1,M-33.2,M-33.3,M-49.0,D-3.61,D-3.62,D-3.63,D-3.64,D-3.65,M-6.0,M-7.0,M-16.9,D-3.55,D-3.49,C-FIN-02,C-FIN-06,C-FIN-09,C-FIN-13,C-FIN-14,D-7.0 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=M-2.0,M-3.0,M-33.1,M-33.2,M-33.3,M-49.0,D-3.61,D-3.62,D-3.63,D-3.64,D-3.65,M-6.0,M-7.0,M-16.9,D-3.55,D-3.49,C-FIN-02,C-FIN-06,C-FIN-09,C-FIN-13,C-FIN-14,D-7.0
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `M-2.0` | Criar um Novo Cadastro de Mensalista | `mutation` | 6 | **Administração > Mensalistas** | — |
| `M-3.0` | Consulta e Impressão de Extrato de Mensalistas | `mutation` | 6 | **Administração > Mensalistas > Extrato** | — |
| `M-33.1` | Como Consultar o Extrato de um Mensalista | `mutation` | 6 | **Administração > Faturamento > Extrato de mensalistas** | — |
| `M-33.2` | Como Emitir Novas Faturas para Mensalistas | `mutation` | 7 | **Administração > Faturamento > Emissão de faturas** | — |
| `M-33.3` | Manutenção de Faturas Emitidas (Pagamento, Envio e Cancelamento) | `read_only` | 5 | **Administração > Faturamento > Faturas emitidas** | — |
| `M-49.0` | Cadastrar Nova Filial | `mutation` | 6 | **Administração > Mensalistas > Filiais** | 062 (`#/filiais`) |
| `D-3.61` | Cadastrar Mensalista | `mutation` | 6 | **Notas > Mensalistas > Cadastros de Mensalistas** | — |
| `D-3.62` | Gerar Fatura de Mensalista | `mutation` | 6 | **Notas > Mensalistas > Gerar Fatura de Mensalista** | — |
| `D-3.63` | Importar Arquivo de Retorno de Boleto | `read_only` | 6 | **Notas > Mensalistas > Importar Arquivo de Retorno** | — |
| `D-3.64` | Fazer Manutenção de Fatura de Mensalista | `mutation` | 4 | **Notas > Mensalistas > Manutenção de Fatura** | — |
| `D-3.65` | Visualizar Extrato de Saldo de Mensalista | `read_only` | 5 | **Notas > Mensalistas > Visualizar Extrato de Saldo** | — |
| `M-6.0` | Cadastro de Plano de Comissão | `mutation` | 6 | **Administração > Comissões > Planos** | — |
| `M-7.0` | Consulta de Comissões | `mutation` | 5 | **Administração > Comissões > Consultas** | — |
| `M-16.9` | Parametrizar Comissões e Mensalistas | `mutation` | 6 | **Administração > Parâmetros > Comissões e mensalistas** | — |
| `D-3.55` | Gerenciar Comissões de Escreventes | `read_only` | 6 | **Notas > Administração > Gerenciar Comissões de Escreventes** | — |
| `D-3.49` | Configurar Tabela de Custas | `mutation` | 6 | **Configurações > Parametrizações > Tabela de Custas** | — |
| `C-FIN-02` | Liberação de Permissão para Estorno de Recolhimento Definitivo e Recibos | `mutation` | 6 | **Configurações > Perfis de Acesso / Usuários** | — |
| `C-FIN-06` | Regularização de Relatório PEX e Sinoreg Travado por Recibo Estornado Pendente | `read_only` | 6 | **Notas > Protocolo** | — |
| `C-FIN-09` | Desbloqueio de Emissão de Recibo por Inconsistência nos Dados do Solicitante | `mutation` | 7 | **Notas > Protocolo** | — |
| `C-FIN-13` | Habilitação de Permissão e Procedimento para Retificação de Data de Recibo | `mutation` | 6 | **Configurações > Usuários / Perfis de Acesso** | — |
| `C-FIN-14` | Correção de Vigência Retroativa na Tabela de Comissões de Mensalistas | `mutation` | 6 | **Configurações > Parâmetros de Faturamento > Comissões / Convênios** | — |
| `D-7.0` | Atualizar e Reenviar Receitas para o Livro Caixa Web (LCW) Manualmente | `mutation` | 6 | **Configurações > Parametrizações** | 110 (`#/configuracoes`) |

## 5. Lote TN-2 — `Orion TN` (23 rotinas: 7 `read_only` + 16 `mutation`)

*Etapa 4 — Orçamentos/Certidões/Relatórios.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion TN" --routines D-3.13,V-2.3.3,V-2.4.3,D-3.4,D-3.17,D-3.18,M-14.4,M-17.0,M-18.0,M-53.0,D-3.50,D-3.53,D-3.54,D-3.57,D-3.59,D-3.66,D-3.67,D-3.68,D-3.69,D-3.73,D-3.76,R-31.0,R-35.0 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=D-3.13,V-2.3.3,V-2.4.3,D-3.4,D-3.17,D-3.18,M-14.4,M-17.0,M-18.0,M-53.0,D-3.50,D-3.53,D-3.54,D-3.57,D-3.59,D-3.66,D-3.67,D-3.68,D-3.69,D-3.73,D-3.76,R-31.0,R-35.0
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `D-3.13` | Fazer Orçamento Completo | `mutation` | 6 | **Notas > Orçamento > Orçamento Completo** | — |
| `V-2.3.3` | Conclusão, Emissão de PDF e Envio do Orçamento Completo via WhatsApp e E-mail | `mutation` | 5 | — (sem caminho `>`) | — |
| `V-2.4.3` | Auditoria de Andamentos, Emissão de PDF e Edição de Orçamentos na Consulta | `mutation` | 4 | **Notas > Consulta > Orçamentos** | — |
| `D-3.4` | Cadastrar Termo de Comparecimento | `mutation` | 6 | **Firmas > Cadastros > Termo de Comparecimento** | — |
| `D-3.17` | Estornar Recibo de Certidão | `mutation` | 6 | **Notas > Consultas > Consulta de Certidões e Serviços** | — |
| `D-3.18` | Consultar Histórico de Certidões | `mutation` | 5 | **Notas > Consultas > Consulta de Certidões e Serviços** | — |
| `M-14.4` | Balcão de Firmas: Finalizando o Pedido para Pagamento no Caixa | `mutation` | 4 | — (sem caminho `>`) | — |
| `M-17.0` | Como Consultar Pedidos de Firmas | `read_only` | 5 | **Firmas > Consultas > Pedidos de firmas** | — |
| `M-18.0` | Consulta de Serviços Praticados | `mutation` | 5 | **Firmas > Consultas > Serviços praticados** | 008 (`#/servicoPraticado`) |
| `M-53.0` | Consultar Pedidos de Certidão | `read_only` | 5 | **Notas > Pedido de certidão > Consultar pedidos de certidão** | — |
| `D-3.50` | Visualizar Change Log do Sistema | `read_only` | 5 | **Ajuda > Change Log** | — |
| `D-3.53` | Fazer Consulta de Selos Digitais | `mutation` | 6 | **Notas > Consultas > Consulta de Selos Digitais** | — |
| `D-3.54` | Comunicar Selos ao TJ | `read_only` | 6 | **Notas > Administração > Comunicar Selos ao TJ** | — |
| `D-3.57` | Gerar Relatório PEX | `read_only` | 6 | **Relatórios > PEX** | — |
| `D-3.59` | Gerar Recolhimento Resumido | `mutation` | 6 | **Relatórios > Recolhimento Resumido** | 031 (`#/inicio`) |
| `D-3.66` | Registrar Serviço Interno | `mutation` | 6 | **Notas > Administração > Registrar Serviço Interno** | — |
| `D-3.67` | Consultar Certidões Solicitadas | `read_only` | 6 | **Notas > Certidões > Consultar Certidões Solicitadas** | — |
| `D-3.68` | Cadastrar Impedimento de Pessoa/Documento | `mutation` | 6 | **Notas > Administração > Cadastrar Impedimento de Pessoa/Documento** | — |
| `D-3.69` | Importar Arquivo de Protesto ou RC | `mutation` | 6 | **Notas > Administração > Importar Arquivo de Protesto ou RC** | — |
| `D-3.73` | Consultar Selos Digitais Gerados | `mutation` | 5 | **Notas > Consultas > Consultar Selos Digitais Gerados** | — |
| `D-3.76` | Configurar Comunicação Automática ao TJ | `mutation` | 6 | **Configurações > Parametrizações > Comunicação com TJ** | — |
| `R-31.0` | Importar e Consultar Arquivos de Receitas de Outras Especialidades | `read_only` | 5 | **Administração > Importação de Arquivos > Novo Arquivo** | — |
| `R-35.0` | Gerar Relatório de ISS (Imposto Sobre Serviços) | `mutation` | 5 | **Relatórios > Relatório ISS** | 036 (`#/inicio`) |

## 6. Lote Caixa-1 — `Orion Caixa` (15 rotinas: 3 `read_only` + 12 `mutation`)

*Etapa 4 — Configurações/Relatórios.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion Caixa" --routines D-1.2,D-1.3,D-1.4,D-1.5,D-1.6,D-1.7,D-1.8,D-1.10,D-1.11,D-1.12,D-1.13,D-1.14,D-1.15,D-1.16,D-1.17 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=D-1.2,D-1.3,D-1.4,D-1.5,D-1.6,D-1.7,D-1.8,D-1.10,D-1.11,D-1.12,D-1.13,D-1.14,D-1.15,D-1.16,D-1.17
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `D-1.2` | Configurar Dados de Cartório | `mutation` | 4 | **Configurações > Dados de Cartório** | — |
| `D-1.3` | Configurar Modelos de Impressão | `mutation` | 5 | **Configurações > Modelo de Impressão** | — |
| `D-1.4` | Cadastrar Formas de Pagamento | `mutation` | 5 | **Configurações > Cadastros Auxiliares > Forma de Pagamento** | — |
| `D-1.5` | Cadastrar Tipos de Saída | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Tipos de Saída** | — |
| `D-1.6` | Cadastrar Outros Serviços | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Outros Serviços** | 091 (`#/outrosServicos`) |
| `D-1.7` | Ativar Caixa para Firmas e Notas | `mutation` | 5 | **Configurações > Parametrizações** | 110 (`#/configuracoes`) |
| `D-1.8` | Configurar Integração Parcela Express | `mutation` | 6 | **Configurações > Parametrizações > Integrações** | — |
| `D-1.10` | Configurar Painel de Atalhos | `mutation` | 5 | **Configurações > Painel de Atalhos** | — |
| `D-1.11` | Cadastrar Conta Bancária para Conciliação | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Conta Bancária** | — |
| `D-1.12` | Ativar Integração com SGA (Sistema de Senhas) | `mutation` | 5 | **Configurações > Parametrizações > Integração SGA** | — |
| `D-1.13` | Ativar Inteligência Artificial (OCR e Cadastros) | `mutation` | 5 | **Configurações > Parametrizações > Inteligência Artificial** | — |
| `D-1.14` | Consultar Histórico de Ações | `read_only` | 5 | **Administração > Histórico de Ações** | — |
| `D-1.15` | Gerar Relatório de Caixa | `read_only` | 5 | **Relatórios > Relatório de Caixa** | — |
| `D-1.16` | Gerar Relatório de Fechamento de Caixa | `read_only` | 5 | **Relatórios > Fechamento de Caixa** | 025 (`#/inicio`) |
| `D-1.17` | Consultar Controle de Cheques | `mutation` | 5 | **Relatórios > Controle de Cheques** | — |

## 7. Lote Caixa-2 — `Orion Caixa` (15 rotinas: 6 `read_only` + 9 `mutation`)

*Etapa 4 — Operações/C-FIN.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion Caixa" --routines D-1.18,D-1.19,D-1.20,D-1.21,D-1.22,D-1.23,R-29.0,C-FIN-01,C-FIN-03,C-FIN-05,C-FIN-07,C-FIN-08,C-FIN-10,C-FIN-11,C-FIN-12 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=D-1.18,D-1.19,D-1.20,D-1.21,D-1.22,D-1.23,R-29.0,C-FIN-01,C-FIN-03,C-FIN-05,C-FIN-07,C-FIN-08,C-FIN-10,C-FIN-11,C-FIN-12
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `D-1.18` | Gerar Relatório de Provedor de Pagamentos | `mutation` | 5 | **Relatórios > Provedor de Pagamentos** | — |
| `D-1.19` | Fazer Abertura de Caixa | `mutation` | 6 | **Administração > Controle de Caixa > Abertura de Caixa** | — |
| `D-1.20` | Fazer Suprimento de Caixa | `mutation` | 5 | **Administração > Controle de Caixa > Suprimento e Sangria** | — |
| `D-1.21` | Fazer Sangria de Caixa | `mutation` | 6 | **Administração > Controle de Caixa > Suprimento e Sangria** | — |
| `D-1.22` | Fazer Transferência de Caixa | `mutation` | 6 | **Administração > Controle de Caixa > Suprimento e Sangria** | — |
| `D-1.23` | Realizar Pagamento de Certidões | `mutation` | 6 | **Administração > Menu de Pagamentos > Certidões e Serviços** | — |
| `R-29.0` | Consultar e Gerenciar Recibos de Pagamento no Caixa | `read_only` | 5 | **Orion Caixa > Administração > Consultas > Recibos** | — |
| `C-FIN-01` | Estorno Encadeado de Recibo com Guia de Recolhimento Definitiva (PEX) Emitida | `read_only` | 6 | **Guias > Guias de Recolhimento Definitivas (PEX)** | — |
| `C-FIN-03` | Habilitação da Conferência de Atos do Setor de Notas no Fechamento de Caixa | `mutation` | 6 | **Administração > Parâmetros do Sistema** | — |
| `C-FIN-05` | Conciliação de ISS e RPS entre Orion TN e Prefeitura / Emissor Nacional | `read_only` | 6 | **Relatórios > Notas Fiscais / Listagem de RPS** | — |
| `C-FIN-07` | Conciliação entre Fechamento de Caixa e Livro Diário / LCW por Atos Retroativos | `read_only` | 6 | **Relatórios > Pedidos Pendentes** | — |
| `C-FIN-08` | Ajuste de Saldo de Abertura de Caixa Incorreto via Suprimento ou Sangria | `mutation` | 6 | **Movimentação > Sangria / Retirada de Caixa** | — |
| `C-FIN-10` | Estorno de Baixa Indevida de Mensalista no Caixa do Operador e Liquidação em Conta Corrente | `read_only` | 6 | — (sem caminho `>`) | — |
| `C-FIN-11` | Tratamento de Faturas de Mensalistas Abaixo do Limite Bancário (< R$ 50) e Alerta de Bloqueio | `mutation` | 7 | **Faturamento > Mensalistas > Conta Corrente** | — |
| `C-FIN-12` | Parametrização do Livro de Depósito Prévio e Conversão em Emolumento Definitivo | `read_only` | 6 | **Administração > Parâmetros > Tipos de Movimentação** | — |

## 8. Lote Estoque — `Orion Estoque` (12 rotinas: 1 `read_only` + 11 `mutation`)

*Etapa 4 — Trilha D-2.*.* Comando:

```powershell
npx tsx src/cli.ts --product "Orion Estoque" --routines D-2.1,D-2.2,D-2.3,D-2.5,D-2.6,D-2.8,D-2.9,D-2.10,D-2.11,D-2.12,D-2.13,D-2.14 --concurrency 3 --dry-run-mutations --headless --visual-mode defer
npx tsx src/verify-all-phase2-boxes.ts --only=D-2.1,D-2.2,D-2.3,D-2.5,D-2.6,D-2.8,D-2.9,D-2.10,D-2.11,D-2.12,D-2.13,D-2.14
```

| ID | Título | Carga | Passos | Menu documentado (passos 1–3) | Tela L2.5 |
|---|---|---|---:|---|---|
| `D-2.1` | Acessar o Módulo Orion Estoque | `mutation` | 4 | — (sem caminho `>`) | — |
| `D-2.2` | Configurar Grupos de Permissões | `mutation` | 6 | **Configurações > Usuários e Permissões > Grupos de Permissões** | — |
| `D-2.3` | Cadastrar Novo Usuário | `mutation` | 6 | **Configurações > Usuários e Permissões > Usuários** | — |
| `D-2.5` | Cadastrar Fornecedor | `mutation` | 5 | **Configurações > Cadastros Auxiliares > Fornecedor** | — |
| `D-2.6` | Configurar Grupos de Distribuição | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Grupos de Distribuição** | — |
| `D-2.8` | Cadastrar Tipo de Documento | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Tipo de Documento** | 103 (`#/tipoDocumento`) |
| `D-2.9` | Cadastrar Unidade de Medida | `mutation` | 6 | **Configurações > Cadastros Auxiliares > Unidade de Medida** | — |
| `D-2.10` | Registrar Dados do Cartório | `mutation` | 4 | **Configurações > Dados de Cartório** | — |
| `D-2.11` | Configurar Modelos de Impressão | `mutation` | 5 | **Configurações > Modelos de Impressão** | — |
| `D-2.12` | Configurar Parametrizações do Estoque | `mutation` | 5 | **Configurações > Parametrizações** | 110 (`#/configuracoes`) |
| `D-2.13` | Consultar Histórico de Aquisição | `mutation` | 5 | **Consultas > Histórico de Aquisição** | — |
| `D-2.14` | Estornar Distribuição de Produto | `read_only` | 6 | **Administração > Distribuição** | — |

## 9. Conferência de Cobertura

- IDs no KB: **105**; IDs cobertos (PoC + B1 + 6 lotes): **105**; omissões: **0**.
- Soma acumulada após a Fase 4: **273** rotinas (169 das Fases 1–3 + 104 novas de `caixa`).
