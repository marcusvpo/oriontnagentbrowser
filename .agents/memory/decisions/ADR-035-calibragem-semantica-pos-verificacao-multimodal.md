# ADR-035: Calibragem Semântica Pós-Verificação Multimodal — Cabeçalho de Coluna × Campo, Busca Global em Todas as Camadas, Contexto de Guarda do Passo, Verificador com Sub-Capturas e Guia de Triagem das Fases 2 e 3

> **Data:** 2026-11-18  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Claude Code  
> **Relacionada a:** ADR-015, ADR-017, ADR-018, ADR-019, ADR-024, ADR-026, ADR-027, ADR-029, ADR-030, ADR-031, ADR-033  
> **Numeração:** a ADR-034 já existe; esta é a próxima livre. Sem migration SQL.

---

## 1. Contexto

O `npm --prefix auditoria run verify:semantics` (ADR-033) avaliou 53 passos auto-curados e **sinalizou 17 passos em 13 rotinas** (`C-CERT-02`, `D-3.11`, `D-3.9`, `M-36.0`, `M-41.0`, `M-43.0`, `M-60.0`, `M-66.0`, `M-68.0`, `R-1.1`, `R-10.0`, `R-18.0`, `R-3.0`). O diagnóstico cruzou cada passo com o `-revisado.md`, a telemetria (`cache/kb-telemetry/<ID>.json`) e as imagens.

### 1.1. Achado transversal: telemetria antiga não é defeito atual
Nove das 13 rotinas tinham sido geradas em **13 a 16/11**, antes das guardas da ADR-024 (16/11 14:22), ADR-026 e ADR-027. Parte das divergências (ex.: `C-CERT-02` caindo na busca global, `R-10.0` caindo em **Novo cartão +**) já era vetada pelo código vigente; só a reauditoria prova isso. **Regra:** antes de calibrar um passo sinalizado, comparar a data do `kb-telemetry` com a da guarda e reauditar.

### 1.2. Causas-raiz (mais amplas que os 3 padrões do pedido)
| Padrão | Causa-raiz real | Passos |
|---|---|---|
| **A** cabeçalho × campo | A Camada 1 casa o texto **exato** antes do **parcial**: o `th` "Descrição" vencia o `label` "Pesquisar por descrição". `th`/`h1`-`h4` são candidatos `INTERACTIVE`; nenhuma camada vetava o papel. Ocorria também em passos **não** auto-curados (`M-41.0`/`M-68.0` passos 2-3, `Código`/`Descrição` na grade) e em `M-60.0` (título "Natureza" e `th` "Espécie"), `R-3.0` (`th` "Status" e "Iniciado em"). | `M-36.0`, `M-43.0`, `M-66.0`, `M-60.0`, `R-3.0` |
| **B** `Concluir` pós-`Adicionar` | **Falso defeito do motor:** `passo-05-b` já demarcava `Concluir` (ADR-017/019); o verificador enviava só `passo-05` (o gatilho **Adicionar**). Em paralelo, "e clique em **Adicionar**" do passo 1 só passou a abrir o formulário com a correção A2 da ADR-029 (17/11), posterior às rotinas de 13/11. | `M-41.0`, `M-66.0`, `M-68.0` |
| **C** busca global | `C-CERT-02` passo 5 (pré-ADR-024); a guarda comparava só o **nome**, e o `innerText` de um `<input>` é vazio, então o **placeholder** passava despercebido. Passo 1 truncava `Notas > Protocolo` para `Notas`. | `C-CERT-02` |
| **D** demais | (i) alvos citados **entre aspas** (`**"Sem valor fixo"**`) nunca casavam na Camada 1; (ii) `label` único demarcado sem o campo; (iii) camada `option:` elegendo o `<select>` com a opção "Sim" num passo de clique; (iv) `+ (Adicionar Novo Pedido)` classificado como fluxo `sga_order`; (v) campo renomeado (`Pesquisar por documento apresentado`); (vi) mapeamento editorial de Firmas (`D-3.11`/`R-1.1` passo 4); (vii) valor de lista suspensa (`D-3.9`). | `R-18.0`, `R-10.0`, `R-3.0`, `M-36.0`, `D-3.11`, `R-1.1`, `D-3.9` |

---

## 2. Decisão Arquitetural

### 2.1. Cabeçalho de coluna nunca é campo (`navigation-guard.ts`, `semantic-compatibility.ts`, `dom-geometry.ts`, `smart-locator.ts`)
- `SemanticRole` ganha `table_column_header` (`th`, `[role="columnheader"]`, nó dentro de `thead`) e `page_heading` (`h1`-`h4`).
- `stepExpectsInteractiveControl(step)`: verdadeiro com verbo/pista de controle (*defina, preencha, informe, digite, selecione, escolha, filtre, pesquise, utilize, marque, campo*) ou ação `fill`/`search`/`select`/`check`; falso se o passo cita *coluna, cabeçalho, ordenar* (aí o `th` é o alvo).
- Veto `compatible: false` / `weight: 0` em **todas** as camadas: Camada 1 (o script exclui `th` e rebaixa `h1`-`h4` a último recurso, tier 2e), 2A, 2B (poda e resposta do LLM), 2C-SoM/Grounding (também no pós-check do nó medido) e `forbiddenMeasuredReason`, inclusive por **membro de grupo** (`DOMElementContext.memberTags`).
- Em alvo único, um `<label>` casado vira o **bloco de campo** (rótulo + controle), como na união de grupo (ADR-015).
- Sem controle com o nome na tela, o passo **não** cai no cabeçalho: auto-cura/exploração e, esgotadas, `[ATT]` (Evidência Estrita).

### 2.2. Busca global (`CTRL + B`) em todas as camadas
`isGlobalSearchNode` reconhece texto, **placeholder**, `id` (`search.?menu`...) e a marca `isGlobalSearch` calculada no DOM; todo campo de **texto** (nunca `select`/`combobox`) em `header, nav, .navbar` conta como ela. Só o passo que a cita (*barra de pesquisa*, `CTRL + B`) pode medi-la. Vale na Camada 1 (exclusão no script, `allowGlobalSearch`), 2A, 2B, 2C e pós-medição. O id real do campo não está no repositório (o `#inputSearchMenu` do pedido era hipótese): o placeholder é o discriminador principal e o id entra por padrão.

### 2.3. Contexto de guarda do passo
`deriveStepGuard(step)` → `{ fieldIntent, allowGlobalSearch, allowOptionTier }`, derivado **antes** de tocar o DOM, fixado por `locateAndCaptureWithSelfHealing` (wrapper com `finally`) em `AgentBrowserClient.setStepGuard` e herdado por `getDOMGeometry`; a exploração investigativa e a medição pós-ação do `executor.ts` o reaplicam. `allowOptionTier = false` em clique puro sem pista de escolha: "clique em **Sim**" numa confirmação não elege o `<select>` que contém "Sim" (ADR-018 mantida para *selecione/escolha/filtre*).

### 2.4. Demais ajustes de Padrão D
- **Aspas literais:** a Camada 1 remove aspas envoltórias do alvo (`"Valor"` → `valor`); a consulta original é preservada para a Trava de Evidência.
- **Frase introdutória não é alvo (`parser.ts`, `isLeadInBoldPhrase`):** negrito terminado em `:` que abre com conectivo de finalidade/condição (*Para, Se, Caso, Quando, Ao, Enquanto...*) é o enunciado do passo (`**Para definir um preço padrão:**`), não um controle. Antes, virava alvo "não localizado" e, pela regra 12 (rótulo não localizado bloqueia), mandava a rotina inteira para `[ATT]` (`R-18.0` passo 3). Rótulo de seção real (`**Serventia:**`, `**Seção Final (Outras Informações):**`) continua alvo. O texto do manual não muda.
- **Preenchimento de grupo recai no campo de texto (`dom-geometry.ts`):** em passo de grupo (`"Sem valor fixo"` + `"Valor"`) o carimbo `fillSelector` pula caixa de marcação/opção (`input[type=checkbox|radio]`) e elege o primeiro campo de entrada; a caixa só é usada se for o único controle. Antes a digitação era endereçada à caixa de 10x11 px.
- **Pré-Filtro de Grade não precede o especialista de Firmas (`executor.ts`, `firmasSpecialistHandlesStep`):** em `#/pedidoFirmas/cadastrar`, passo que o `classifyFirmasStep` reconhece é conduzido pelo fluxo da ADR-026. O pré-filtro (ADR-029) rodava antes e, ao popular a grade com `"teste"`, mudava o formulário: o `D-3.11` passo 2 perdia **Nome**/**CPF ou CIN** e caía no fluxo genérico (7 prints, sem `Nomes para reconhecimento`). Com a guarda o fluxo voltou (8 prints). Achado da reauditoria; não aparecia na telemetria antiga.
- **`+` não é `sga_order`:** `classifyFirmasStep` não envia ao fluxo por Senha SGA o passo cujo alvo é o ícone `+` ("Adicionar Novo Pedido"); `add_service` (ADR-026) permanece.
- **Sinônimo por rota (ADR-029, Camada 0.2):** `#/documentoApresentado`: `Pesquisar por descrição` → `Pesquisar por documento apresentado`, evidência do Raio-X lido ao vivo; só vale com o nó real medido e não reescreve o manual.

### 2.5. Verificador semântico (`scripts/antigravity-worker/semantic_visual_verifier.py`)
Envia **todas** as imagens do passo (`passo-NN` gatilho + `passo-NN-b…` revelado) e as convenções do motor que **não** são falha (gatilho + revelado, valor de lista suspensa ADR-018, lupa 2.5x, badge sobre campo vizinho). `--routines` **mescla** no `semantic-audit-report.json` e `lift_stale_semantic_flags` libera só sinalizações com `revisor == "Verificador Semântico SDK (ADR-033)"`; revisão humana nunca é alterada. Detalhes em `auditoria_agent_browser.md` §23.4.

### 2.6. O que **não** foi alterado (decisão humana)
Três reprovações do verificador permanecem, todas de mapeamento editorial anterior a esta ADR, e ficam sinalizadas para adjudicação de Produtos:
- `R-1.1` passo 4: `+ (Adicionar Serviço)` → painel *Serviços realizados*/*Efetuar Serviço* (ADR-026; a revisão humana de `R-1.1` só condena **Novo cartão +**, não define o `+` correto).
- `D-3.11` passo 2: o fluxo de Firmas (ADR-026) enquadra **Nome** + **CPF ou CIN**, não **Pedido/Senha** nem **Senha SGA**, citados no passo.
- `C-CERT-02` passo 1: o item **Novo protocolo** é demarcado com o rótulo-alias "Protocolos" (alias de `li` com âncora oculta, ADR-027); o menu **Notas** não tem item com esse texto.
- A regex `search_or_filter` de `inferStepIntent` (`\b(pesquis|busc|filt|localiz)\b`) é inerte (exige a palavra inteira). Mudá-la altera o veto de **Novo cartão +** em muitas rotinas; **não** foi tocada. A guarda desta ADR não depende dela.

### 2.7. Guia de triagem (`scripts/generate-triage-report.mjs` → `docs/RELATORIO_TRIAGEM_FASES_2_E_3.md`)
Somente leitura; fase por módulo (`acesso`+`config` = 2; demais = 3); Antes × Depois via `git show <ref>` e `--semantic-before`; IPs mascarados (§23.5 do padrão técnico).

---

## 3. Validação

- **Testes offline:** `auditoria/src/__tests__/adr035-semantic-calibration.test.ts` (36 casos; mini-DOM extraído para `__tests__/mock-dom.ts` e reaproveitado pela ADR-030) e `scripts/antigravity-worker/test_sdk_worker.py` (13 casos). Os testes são **diferenciais**: provam o defeito sem `fieldIntent` e a correção com ele.
- **Motor:** `tsc --noEmit` limpo; `npm --prefix auditoria test` 224/224. **Console:** `tsc`, 39/39 testes e `build` limpos.
- **Reauditoria ao vivo** (`--routines <13> --headless --dry-run-mutations`, 0 falhas técnicas, 0 gravações): ver §4.

## 4. Resultados da Reauditoria das 13 Rotinas

Lote ao vivo de 38 min (0 falhas técnicas, 0 gravações) + duas reexecuções pontuais motivadas por achados do próprio lote (`R-18.0`: parser; `D-3.11`: pré-filtro × Firmas). Estado final: **11 `validado_com_ajustes`, 1 `[ATT]` (`R-10.0`), 1 `[XRX]` (`R-3.0`)**. Verificador: **17 divergências → 3** (23 passos avaliados, 20 confirmados). Os 8 invariantes: **0 discrepâncias**, 434/434 prints.

| Rotina | Antes (passos reprovados) | Depois |
|---|---|---|
| `C-CERT-02` | 1, 5 | 5 ✓ (**Notas > Nova certidão e serviço**, sem busca global); 1 ✗ residual (alias, §2.6) |
| `D-3.11` | 4 | 4 deixou de ser curado (o parser descarta o `+`; mede **Autenticidade**/**Semelhança**); 2 ✗ residual (§2.6) |
| `D-3.9` | 3 | ✓ (valor de lista suspensa, ADR-018) |
| `M-36.0` | 3 | ✓ (`[ATT]` na 1ª rodada; sinônimo de rota o converteu em `validado_com_ajustes`) |
| `M-41.0`, `M-68.0` | 5 | ✓ (**Concluir** demarcado; o verificador recebe `passo-05` + `passo-05-b`) |
| `M-43.0` | 3 | ✓ (**Descrição** real + **Filtrar**) |
| `M-60.0` | 3 | ✓ (**Natureza** como campo e **Espécie** como lista) |
| `M-66.0` | 3, 5 | ✓ |
| `R-1.1` | 4 | 4 ✗ residual (§2.6) |
| `R-10.0` | 2, 3 | `[ATT]` com Raio-X: o ícone **+ (Adicionar Novo Pedido)** não existe na tela (antes caía em **Novo cartão +**) |
| `R-18.0` | 3 | ✓ (aspas, frase introdutória e preenchimento de grupo); o campo **Valor** está desabilitado na tela |
| `R-3.0` | 3, 5 | `[XRX]`: grade sem dados; o filtro "Iniciado" não se resolve sem a rotina provedora |

## 5. Riscos e Consequências

- Rotinas que dependiam de um falso casamento com `th`/título passam a sair `[ATT]` ou `[XRX]` com evidência (comportamento desejado: a Evidência Estrita vale mais que o "validado").
- O veto por `fieldIntent` é textual (verbos do manual). Passo de formulário sem verbo nem a palavra *campo* e sem `actionType` de preenchimento não aciona o veto por `th`; a guarda pós-medição cobre apenas passos com essas pistas.
- A reauditoria de 13 rotinas não cobre as demais 155: a mesma calibragem vale para elas na próxima reauditoria; `--reaudit-pending` não as seleciona (só `[ATT]`/`[DDD]`/`[XRX]`/`[CCC]`).
