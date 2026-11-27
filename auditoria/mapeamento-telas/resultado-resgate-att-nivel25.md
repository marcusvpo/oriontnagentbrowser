# Resultado Consolidado — Triagem Inteligente, Mineração de Renomeações e Reauditoria `[ATT]` (Catálogo Nível 2.5)

- **Versão do Catálogo:** `06.05.02` (115 telas mapeadas, Nível 2.5)
- **Data da Operação:** 2026-11-26
- **Política de Execução:** `--dry-run-mutations --headless`, write-through Supabase ativo, Fila 2 preservada intacta em disco (Opção A) e **Evidência Estrita (ADR-017)** 100% respeitada.

---

## 1. Placar Antes × Depois das 169 Rotinas Auditadas (Fases 1–3)

### 1.1 Visão Global por Status Primário (Soma = 169 Pastas)

| Status / Tag | Antes | Depois | Variação | Observação |
|---|---:|---:|---:|---|
| `validado_com_sucesso` (Fase 1 / PoC) | 2 | 2 | 0 | `D-1.1` (`caixa`) e `C-ACESSO-01` (`acesso`) |
| `validado_inalterado` | 2 | **4** | **+2** | Resgatadas: `D-2.4`, `D-2.7` |
| `validado_com_ajustes` | 24 | **25** | **+1** | Resgatada via bridge L2.5: `M-16.13` |
| `comunicacao_externa` (`[CCC]` puro) | 1 | 1 | 0 | Contagem total da tag `[CCC]` (incluindo multi-tags): **4** |
| `atualizacao_editorial` (`[ATT]`) | 94 | **88** | **-6** | 3 validadas + 3 reclassificadas para `[XRX]` |
| `dependencia_dados_banco` (`[DDD]`) | 18 | 18 | 0 | Pré-triagem hardware/ambiente + banco |
| `dependencia_cruzada_rotina` (`[XRX]`) | 28 | **31** | **+3** | Reclassificadas pós-desbloqueio: `M-16.8`, `C-LIVRO-06`, `C-SELO-09` |
| **Total de Pastas (Fases 1–3)** | **169** | **169** | **0** | **100% contabilizadas** |

*(Multi-tags ADR-024 preservadas: `C-CENTRAL-04` `[ATT][CCC]`, `C-CENTRAL-08` `[ATT][CCC]`, `C-CENTRAL-12` `[CCC][XRX]`.)*

### 1.2 Distribuição por Módulo (Antes → Depois)

| Módulo | Total | Validadas (`inalterado` + `ajustes` + `sucesso`) | `[ATT]` (Antes → Depois) | `[DDD]` | `[XRX]` (Antes → Depois) | `[CCC]` (tag) |
|---|---:|---:|---:|---:|---:|---:|
| `acesso` | 10 | 1 → 1 | 8 → **8** | 1 | 0 → 0 | 0 |
| `caixa` (Fase 1) | 1 | 1 → 1 | 0 → **0** | 0 | 0 → 0 | 0 |
| `centrais` | 23 | 2 → 2 | 12 → **12** | 2 | 6 → 6 | 4 |
| `certidoes` | 15 | 2 → **3** | 12 → **11** | 0 | 1 → 1 | 0 |
| `config` | 40 | 12 → 12 | 18 → **18** | 10 | 0 → 0 | 0 |
| `firmas` | 36 | 8 → 8 | 17 → **16** | 3 | 8 → **9** | 0 |
| `livros` | 20 | 0 → 0 | 15 → **14** | 0 | 5 → **6** | 0 |
| `selos` | 24 | 2 → **4** | 12 → **9** | 2 | 8 → **9** | 0 |
| **Total** | **169** | **28 → 31** | **94 → 88** | **18** | **28 → 31** | **4** |

---

## 2. Triagem Offline das 94 `[ATT]` (Etapa 1 & Etapa 2)

A triagem determinística ([triage-att-with-catalog.ts](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/triage-att-with-catalog.ts), comando `npm --prefix auditoria run att:triage:l25`) cruzou os 94 relatórios `[ATT]` contra o Catálogo Nível 2.5 (`115` entradas, `allKnownElements` e sub-rotas `sub_route`/`parent_prefix`), o Catálogo Canônico de Menus (`06.05.02`) e as guardas ADR-035:

- **Fila 1 — Destraváveis Agora:** **12** rotinas (`12.8%`):
  - `1A_substate_literal`: **8** (`D-2.4`, `D-2.7`, `D-3.3`, `M-16.8`, `M-16.13`, `M-26.0`, `R-11.0`, `V-1.0`)
  - `1B_menu_canonical`: **3** (`C-LIVRO-06`, `C-SELO-04`, `C-SELO-09`)
  - `1C_similar_candidate`: **1** (`M-16.1`)
- **Fila 2 — `[ATT]` Legítimo Confirmado (Lista Ouro):** **76** rotinas (`80.9%`), mantidas intactas em disco conforme Opção A para revisão editorial humana no Orion Audit Console.
- **Fila 3 — Dependência de Dados / Fluxo / Hardware:** **6** rotinas (`6.4%` — `M-16.2`, `C-LIVRO-04`, `V-2.2.2`, `V-CCA.1.2`, `V-7.4.2`, `R-1.4`).

### Curadoria de Renomeações de UI (`route-synonyms.ts`) e Bridge L2.5 (`reveal-explorer.ts`)
Foram promovidos **10 sinônimos inequívocos escopados por rota** em [route-synonyms.ts](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/route-synonyms.ts) (validados por testes unitários ADR-035 contra `orion-screen-catalog.json` para zero colisão com `th` ou `heading`) e integrada a expansão de `routeSynonymsFor` em `findCatalogRevealHints` e `exploreRevealTriggers` ([reveal-explorer.ts](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/reveal-explorer.ts) + [executor.ts](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/executor.ts)).

---

## 3. Resultado do Lote Ao Vivo (Piloto A/B = Total da Fila 1: 12 Rotinas)

Executado via subagent `Auditor de Rotinas Orion TN` com `--concurrency 3 --dry-run-mutations --headless` (`52min 21s`, 1 login real, `51` prints verificadas com **0 discrepâncias** nos 8 invariantes geométricos):

| ID | Módulo | Antes | Depois | Mecanismo Observado / Diagnóstico |
|---|---|---|---|---|
| `D-2.4` | `selos` | `[ATT]` (passo 3) | **`validado_inalterado`** | Sinônimo de rota `#/categoria/cadastrar`: `Nome da Categoria` → `Descrição` (5 prints, `Concluir` omitido por dry-run) |
| `D-2.7` | `selos` | `[ATT]` (passo 6) | **`validado_inalterado`** | Sinônimo de rota `#/produto/cadastrar`: `Salvar` → `Concluir` (6 prints, `Concluir` omitido por dry-run) |
| `M-16.13` | `certidoes` | `[ATT]` (passo 2) | **`validado_com_ajustes`** | **Bridge L2.5 (`reveal-explorer.ts` + `routeSynonymsFor`)**: aba `Certidão` revelou `Previsão de entrega` (`Prazo de entrega padrão (dias)`); passo 3 curado por A11y (`Papel de segurança`) |
| `M-16.8` | `firmas` | `[ATT]` (passo 2) | **`[XRX]`** | Reclassificada para dependência cruzada (`M-54.3`, `R-10.0`, `M-13.0`) após 6 abas testadas sem seção `Pedido de Firmas` |
| `C-LIVRO-06` | `livros` | `[ATT]` (passo 1) | **`[XRX]`** (passo 4) | Menu passo 1 superado via Camada 3 (`Notas > Consultas > Protocolos`); bloqueada em passo 4 por grade vazia (`D-3.60`, `D-3.41`, `C-LIVRO-05`) |
| `C-SELO-09` | `selos` | `[ATT]` (passo 1) | **`[XRX]`** (passo 5) | Menu passo 1 superado (`Administração > Controle de Estoque > Distribuição`); bloqueada em passo 5 por grade vazia (`D-2.7`, `D-2.4`) |
| `M-26.0` | `config` | `[ATT]` (passo 5) | `[ATT]` (**passo 6**) | Passo 5 superado ao vivo via sinônimo `Salto (Gap)` → `Salto de etiquetas (cm)`; passo 6 confirmou ausência editorial de `Orientação`/`Retrato`/`Paisagem` |
| `R-11.0` | `centrais` | `[ATT]` (passo 2) | `[ATT]` (**passo 3**) | Passo 2 superado ao vivo (`#/comunicacoes/cadastrar`); passo 3 confirmou ausência de `Processar`/`Finalizar` |
| `V-1.0` | `firmas` | `[ATT]` (passo 3) | `[ATT]` (passo 3) | Passo 3 possui `mainTargetCount === 0` (`isOptionsOnly = true`), o que desabilita Auto-Cura/sinônimo de rota para `data de recebimento/envio` |
| `M-16.1` | `selos` | `[ATT]` (passo 2) | `[ATT]` (passo 2) | Defasagem editorial confirmada: `Papel de Segurança (NFS)` ausente em `#/configuracoes` (3 abas retornaram erro de serviço local) |
| `C-SELO-04` | `selos` | `[ATT]` (passo 5) | `[ATT]` (passo 5) | Coerência Pós-Pouso (Camada 4) descartou equivalência pois `Testar Conexão` não existe na tela destino |
| `D-3.3` | `firmas` | `[ATT]` (passo 2) | `falha_tecnica` *(mantida `[ATT]`)* | Passo 2 clicou `Preencher cartão usando I.A.` (sinônimo funcionou!) abrindo `#mbmodalDigitalizacaoOcr`; passo 3 falhou ao tentar clicar em `CPF ou CIN` coberto pelo modal OCR |

### Gargalos Pontuais Mapeados para Evolução Futura (Fora do Escopo de Alteração Estrita deste Lote)
1. **Modal OCR pós-ação (`D-3.3`):** quando um clique no passo anterior abre `#mbmodalDigitalizacaoOcr`, o passo seguinte de revisão no formulário precisa fechar o modal OCR se os alvos estiverem no formulário principal.
2. **Passos com sub-itens de formulário (`V-1.0`):** `isOptionsOnly` (`mainTargetCount === 0`) bloqueia `routeSynonymsFor` mesmo quando os sub-itens listam campos distintos (*"Informe a..."*), não opções alternativas.
3. **Orçamento de 6 gatilhos em telas grandes (`#/configuracoes`, 17 abas):** abas com erro de serviço local consomem cota da exploração.

---

## 4. Fila `[ATT]` Consolidada Pronta para Revisão Editorial no Console (`88` Rotinas)

As **88** rotinas restantes com tag `[ATT]` em `auditoria/rotinas/` (76 da Fila 2 confirmadas ausentes no Orion TN `06.05.02` + 6 residuais da Fila 1 + 6 com sinalizações auxiliares da Fila 3) permanecem íntegras com seus relatórios `*-revisado.md` e `Raio-X da Tela Atual`, prontas para triagem humana definitiva no **Orion Audit Console**.

---

## 5. Prontidão para a Fase 4 (`caixa` — Financeiro, Custas e Controle de Caixa)

- **Escopo da Fase 4 no KB (`kb/rotinas/caixa/`):** **105 rotinas** mapeadas (`D-1.1` já validada na Fase 1 PoC).
- **Cobertura no Catálogo Nível 2.5 (`orion-screen-catalog.json`):** **15 telas** de Caixa, Faturamento, Comissões, Mensalistas, Formas de Pagamento e Movimentação Financeira já mapeadas com sub-estados (`004`, `022`, `025`, `030`, `037`–`041`, `061`–`064`, `088`, `102`).
- **Infraestrutura pronta:** Trava Segura de Mutação (`--dry-run-mutations`), Worker Pool com partição `READ_ONLY`/`MUTATION`, Catálogo Nível 2.5 integrado em `reveal-explorer.ts` + `att-screen-advisor.ts`, `route-synonyms.ts` expandido e Write-Through Supabase ativo.
- **Comando pronto para iniciar a Fase 4 na próxima conversa (sempre via subagent `Auditor de Rotinas Orion TN`):**
  ```powershell
  npx --prefix auditoria tsx auditoria/src/cli.ts --phase 4 --concurrency 3 --dry-run-mutations --headless
  ```
