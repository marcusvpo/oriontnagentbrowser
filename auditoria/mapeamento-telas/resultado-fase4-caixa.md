# Resultado da Fase 4 — Módulo `caixa` (105 rotinas)

> **Data de execução:** 2026-11-26 · **Ambiente:** Produtos (OpenVPN Siplan, host `10.0.3.x`) · **Conta:** perfil pleno (Gerência webFirmas / webCaixa / webEstoque)  
> **Flags de todos os lotes:** `--concurrency 3 --dry-run-mutations --headless --visual-mode defer`, write-through Supabase ligado  
> **Plano:** `auditoria/reports/implementation_plan_fase4.md` · **Decisão arquitetural:** ADR-041  
> **D-1.1 (PoC da Fase 1):** preservada e não reexecutada (`validado_com_sucesso`, execução de 2026-11-11, 4 prints).

---

## 1. Resumo

| Indicador | Valor |
|---|---|
| Rotinas da Fase 4 | **105** (105 pastas, 105 IDs únicos em `auditoria/rotinas/caixa/`) |
| `falha_tecnica` | **0** |
| Validadas (`com_sucesso` + `inalterado` + `com_ajustes`) | **10** (1 + 1 + 8) |
| `[ATT]` | **76** |
| `[DDD]` | **7** (5 pré-triadas B1 sem navegador + D-1.10 + R-31.0) |
| `[XRX]` | **12** |
| `[CCC]` / multi-tags | **0** / **0** |
| Prints geradas (`passo-NN*.png`, não versionadas) | **231** |
| Verificação geométrica (8 invariantes), por lote | **0 discrepâncias** em todos os lotes e reexecuções |

A taxa de `[ATT]` (72%) reflete o manual, não o motor: 68 dos 76 bloqueios são caminho de menu inexistente na árvore lida ao vivo ou alvo citado que não existe na tela (seção 4). Em nenhum deles o texto do manual foi reescrito (Evidência Estrita, ADR-017).

---

## 2. Placar da Fase 4 por produto do Portal

| Produto | Rotinas | Sucesso | Inalterado | Com ajustes | `[ATT]` | `[DDD]` | `[XRX]` | Prints |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Orion TN** (`--product "Orion TN"`) | 57 | 0 | 1 | 7 | 39 | 1 | 9 | 144 |
| **Orion Caixa** (`--product "Orion Caixa"`) | 30 | 0 | 0 | 0 | 27 | 1 | 2 | 55 |
| **Orion Estoque** (`--product "Orion Estoque"`) | 12 | 0 | 0 | 1 | 10 | 0 | 1 | 28 |
| **B1 Hardware** (pré-triagem, sem navegador) | 5 | 0 | 0 | 0 | 0 | 5 | 0 | 0 |
| **PoC Fase 1** (D-1.1, preservada) | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 4 |
| **Total** | **105** | **1** | **1** | **8** | **76** | **7** | **12** | **231** |

### 2.1. Por lote

| Lote | Rotinas | Resultado | Duração |
|---|---:|---|---|
| B1 (pré-triagem) | 5 | 5 `[DDD]` (Docker, impressora Windows, scanner ADF ×2, painel SGA) | sem navegador |
| Piloto (Orion TN) | 12 | 6 com ajustes, 4 `[ATT]`, 2 `[XRX]` (após calibragem da Etapa 3) | ~25 min |
| Smoke Orion Caixa | 1 (D-1.16) | `[ATT]`: o menu **Relatórios** real tem só **Caixa**, **Controle de cheques** e **Provedor de pagamentos** | — |
| Smoke Orion Estoque | 1 (D-2.1) | `[ATT]`: o "link do ORION TN" citado não existe dentro do módulo | — |
| TN-1 | 22 | 19 `[ATT]`, 2 `[XRX]`, 1 com ajustes (M-7.0, após reexecução) | 49 min |
| TN-2 | 23 | 16 `[ATT]`, 5 `[XRX]`, 1 `[DDD]`, 1 inalterado | 28 min |
| Caixa-1 | 14 | 13 `[ATT]`, 1 `[DDD]` | 31 min |
| Caixa-2 | 15 | 13 `[ATT]`, 2 `[XRX]` | 12 min |
| Estoque | 11 | 9 `[ATT]`, 1 com ajustes, 1 `[XRX]` | 23 min |

D-1.16 e D-2.1 foram auditadas no smoke da Etapa 2 e não se repetiram nos lotes. Os lotes rodaram em sequência, porque as sessões `worker-N` são compartilhadas. Nenhum lote precisou de novo login real: a sessão de cada produto foi reaproveitada de `auditoria/auth/session-homolog-<produto>.json`.

### 2.2. Rotinas validadas

- **Com ajustes (8):**
  - Piloto: M-30.0, M-48.0, M-5.0, M-64.0, M-65.0 e R-19.0.
  - TN-1: M-7.0.
  - Estoque: D-2.6.
- **Inalterada (1):** R-35.0.
- **Sucesso (1):** D-1.1 (PoC).

### 2.3. Revisão humana não editorial

- **`[DDD]` (7):** C-FIN-04, D-1.9, D-3.5, D-3.7 e D-3.72 (B1, protegidas pelo `hardware-registry`); D-1.10 e R-31.0 (grade vazia sem rotina provedora).
- **`[XRX]` (12):** C-FIN-09, D-1.23, D-2.14, D-3.10, D-3.17, D-3.18, M-1.0, M-18.0, M-3.0, R-29.0, V-2.3.3 e V-2.4.3. Os pré-requisitos de cada uma estão no seu `-revisado.md`.

---

## 3. Retentativas pontuais (Etapa 4)

| Rotina | Antes | Causa | Ação | Depois |
|---|---|---|---|---|
| **M-7.0** | `falha_tecnica` (2/2 no lote, 2/2 na 1ª reexecução) | **Imprimir** (passo 4) abre o modal `#mbmodalSelecaoModelo`; no passo 5 a auto-cura A11y clicava **Limpar** por trás dele | Regra do modal herdado (ADR-041 §2.4) | `validado_com_ajustes`, 5 prints, 0 discrepâncias |
| C-FIN-03, C-FIN-10 | `[ATT]` no passo 1 ("Orion Caixa" não localizado) | Nome do produto ativo tratado como alvo | Regra do produto ativo (ADR-041 §2.3) | `[ATT]`: C-FIN-03 agora no passo 2 (caminho **Administração > Parâmetros do Sistema** inexistente); C-FIN-10 no passo 1 (tela **Movimentações de Caixa** inexistente) |
| C-FIN-01, C-FIN-05, C-FIN-12 | `[ATT]` no passo 1 | Mesmo alvo "Orion Caixa" junto do caminho de menu | Reexecução de consistência | `[ATT]` mantido: caminho de menu inexistente no Orion Caixa |
| C-FIN-07 | `[ATT]` (Caixa-2) | Passo 1 cita "No **Orion TN**", mas o passo 2 cita "No **Orion Caixa**": rotina mista, não "de outro produto" | Reexecução de teste no Orion TN, que deu `falha_tecnica` porque a cascata de **Relatórios** fechou 3/3 no passo 2; reexecução no produto de origem | `[ATT]` no passo 1 (estado do lote restaurado) |

Nenhuma outra rotina C-FIN, D-1 ou D-2 tem prova, no texto e ao vivo, de pertencer a outro produto. Os candidatos levantados por contagem de citações (C-FIN-13, D-1.19, D-2.11 a D-2.13) citam o próprio produto do lote no passo 1 ou são ambíguos.

---

## 4. Causas dos 76 `[ATT]`

| Grupo | Qtde | O que significa | Exemplos |
|---|---:|---|---|
| A. Caminho de menu inexistente na árvore lida ao vivo | 34 | A raiz ou a folha citada não existe no módulo. Equivalências e semântica fechada (ADR-037) não acharam destino único | **Administração > Faturamento > …** (M-33.1 a 33.3), **Notas > Mensalistas > …** (D-3.62 a 65), **Administração > Controle de Caixa > …** (D-1.19 a 22), **Ajuda > Change Log** (D-3.50), **Guias > …** (C-FIN-01) |
| D. Alvo citado ausente na tela alcançada | 34 | A navegação funcionou, mas o botão, campo ou seção do manual não existe. Exploração investigativa esgotada; Raio-X anexado | M-31.0 (seção **Parâmetros**), M-4.0 (**Novo lançamento**), D-3.58 (**Dia de Referência** × **Período**), M-16.11 (campos bancários) |
| B. Tela aberta sem a aba/seção citada | 6 | O prefixo real foi aberto, mas a cauda (aba) não existe | D-1.8 (aba **Integrações**), D-1.12 (**Integração SGA**), D-3.49 (**Tabela de Custas**), D-3.76 (**Comunicação com TJ**) |
| C. Cura incoerente com os passos seguintes | 2 | A coerência pós-pouso (ADR-037, Camada 4) rejeitou a tela curada | D-3.66 e uma C-FIN |

### 4.1. Candidatos para triagem (não alterados no motor)

- **C-FIN-08 e C-FIN-11:** o passo 1 é uma frase condicional com negrito de ênfase ("valor a **MAIOR** …:", "Para faturas **abaixo de R$ 50,00**:"), que o parser trata como alvo. Avaliei uma regra genérica e a rejeitei: ela atingiria 42 passos de 471 rotinas, muitos com controles reais (ADR-041 §2.6). Recomendação: ajuste editorial do manual.
- **Camada 3 em Orion Caixa/Estoque:** o resolutor semântico fechado usa o catálogo 06.05.02, que é do Orion TN. Nos outros produtos ele nunca vira evidência, porque a cadeia precisa existir na árvore viva. Mas a mensagem de bloqueio ainda diz "árvore de navegação real do Orion TN" (cosmético).
- **C-FIN-07 no Orion TN:** a Camada 3 levou **Relatórios > Pedidos Pendentes** a **Relatórios > Fechamento de caixa** com 87%. A coerência pós-pouso aceitou. Vale revisão humana do limiar para relatórios.

---

## 5. Evoluções aplicadas na Fase 4 (ADR-041)

1. **`--product "Orion TN" | "Orion Caixa" | "Orion Estoque"`** (`config.ts`, `auth.ts`, `cli.ts`):
   - O card do Portal é clicado por texto exato, com detecção de nova guia.
   - A URL do módulo é descoberta ao vivo (`/webCaixa/#/inicio`, `/webEstoque/#/inicio`).
   - Sessão e home ficam por produto em `auditoria/auth/`, que é ignorado pelo Git.
   - O log de login mascara o host.
2. **Submenu homônimo** (`menu-path.ts`): **Administração > Mensalistas** desce à tela-filha **Mensalistas** (`#/mensalistas`), o que destravou a navegação de M-1.0 e M-2.0.
3. **Sinônimo por rota** (`route-synonyms.ts`): **Tipo de Lançamento** → **Tipo lançamento** em `#/tipoMovimentacaoFinanceira/cadastrar` (M-65.0, tela 102 do catálogo).
4. **Produto ativo fora dos alvos** (`step-scope.ts`): "Abra o **Orion Caixa**" com a sessão já no Orion Caixa deixa de bloquear.
5. **Modal herdado** (`modal-scope.ts`, `executor.ts`): o modal aberto pelo passo anterior é fechado só por X, **Cancelar** ou **Fechar**, e só quando o passo atual está claramente na tela de trás.
6. **Pré-triagem B1** (`phase4-hardware-pretriage.ts`): 5 `[DDD]` sem navegador, protegidas contra `--reaudit-pending`.

Testes offline novos ou ampliados: `portal-product-selection.test.ts`, `triage-att-level25.test.ts` (bloco Fase 4) e `modal-scope.test.ts`. A suíte completa tem **379 testes**, todos passando.

---

## 6. Placar acumulado das Fases 1 a 4 (273 rotinas)

| Módulo | Rotinas | Sucesso | Inalterado | Com ajustes | `[ATT]` | `[DDD]` | `[XRX]` | `[CCC]` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| acesso | 10 | 1 | 0 | 0 | 8 | 1 | 0 | 0 |
| caixa | 105 | 1 | 1 | 8 | 76 | 7 | 12 | 0 |
| centrais | 23 | 0 | 0 | 2 | 12 | 2 | 6 | 1 |
| certidoes | 15 | 0 | 0 | 3 | 11 | 0 | 1 | 0 |
| config | 40 | 0 | 0 | 12 | 18 | 10 | 0 | 0 |
| firmas | 36 | 0 | 2 | 6 | 16 | 3 | 9 | 0 |
| livros | 20 | 0 | 0 | 0 | 14 | 0 | 6 | 0 |
| selos | 24 | 0 | 2 | 2 | 9 | 2 | 9 | 0 |
| **Total** | **273** | **2** | **5** | **33** | **164** | **25** | **43** | **1** |

As colunas contam o **status principal** (`auditoria_ui.status`). Multi-tags: C-CENTRAL-04 e C-CENTRAL-08 são `[ATT][CCC]`, e C-CENTRAL-12 é `[CCC][XRX]`. O total de prints no acumulado é 690 (`.png` não versionados).

---

## 7. Prontidão para a Fase 5 (`notas`, 166 rotinas)

- Use `--product "Orion TN"`, que é o padrão; nenhum card novo é necessário.
- As regras de submenu homônimo, modal herdado e sinônimos por rota já estão ativas para o Orion TN.
- Recomendação: repetir o formato desta fase (pré-triagem B1, piloto de cerca de 12 rotinas, calibragem só com prova inequívoca, lotes de 20 a 25 rotinas com `verify --only` por lote).
- Ponto de atenção: o grupo A (caminho de menu inexistente) predominou. Antes do piloto, rodar `npm --prefix auditoria run menu:audit-coherence` sobre `notas` para separar o que é Fila A (destravável) do que é defasagem real do manual.
