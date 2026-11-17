# ADR-027: Grafo Semântico de Seções UI, Máquina de Estado Universal e RAG Soberano de Revisões Humanas

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-013, ADR-015, ADR-016, ADR-017, ADR-024, ADR-025, ADR-026  

---

## 1. Contexto

Mesmo após os avanços da ADR-026, o localizador e o executor ainda carregavam três fragilidades estruturais:

1. **Dependência excessiva de similaridade lexical pura (Sørensen–Dice) sem contexto hierárquico de seção:** palavras ou símbolos curtos colidiam com componentes funcionalmente incompatíveis (ex.: `+` / `Adicionar Serviço` contra `Novo cartão +`, sub-strings intra-palavra como `Autenticidade` contra `Cidade`, e itens da `navbar` contra opções de formulário).
2. **Acoplamento de execução interativa por tela:** o fluxo rico de pesquisa + seleção em grade + confirmação + sub-formulário vivia concentrado em `firmas-interactive.ts`, sem um motor genérico baseado em *snapshot* e *DOM Diffing* capaz de cobrir transições em outros módulos (como `Notas`, `Certidões` e sub-portais encadeados como `Configurações > Parametrizações > Comunicações > Orion Coaf`).
3. **Subutilização das revisões humanas como memória ativa do agente:** as 9 revisões de `"Marcus (Revisor)"` registradas no Supabase (`routine_reviews`) e novas revisões salvas no Orion Audit Console ainda não alimentavam automaticamente uma **Camada 0.1** determinística com aprendizado cruzado para outras rotinas do acervo.
4. **Detalhe de DOM legado no menu `Notas` (`D-3.14`):** na árvore do cabeçalho do Orion TN 6.0, `<li id="FIRMPEDCERTIN01">` contém um `<a style="display: none;">Certidões e serviços</a>` antes do link clicável visível `<a id="menuNovaCertidaoEServico">Nova certidão e serviço</a>`, fazendo com que a cascata tentasse medir uma caixa `0x0` ao usar `find(a)`.

---

## 2. Decisão Arquitetural

### 2.1. Grafo Semântico de Seções e Compatibilidade Intenção × Papel (`types.ts`, `dom-geometry.ts`, `smart-locator.ts`, `semantic-compatibility.ts`)
- **Assinatura Semântica Hierárquica (`extractSemanticSignature` em `dom-geometry.ts` e `smart-locator.ts`):** cada elemento interativo passa a carregar `sectionTitle` (ancestral `<fieldset><legend>`, `.panel-heading`, `.card-header`, `.box-header`, `.modal-title`, `h3..h5`), `rowContext` (1ª/2ª coluna e índice quando dentro de `<tr>`), `associatedLabel` (`<label>`, `span`, `placeholder`, `title`, `data-original-title`, `ng-reflect-*`) e `semanticRole` (`navigation_root`, `navigation_leaf`, `search_filter_input`, `search_trigger_button`, `grid_row_picker`, `section_confirm_button`, `service_execution_trigger`, `entity_creation_button`, `form_input`, `form_submit`, `form_cancel`).
- **Matriz Intenção × Papel (`semantic-compatibility.ts`):** `inferStepIntent()`, `inferNodeSemanticRole()`, `hasIntraWordSubstringCollision()` e `evaluateSemanticCompatibility()` aplicam **veto duro (peso `0.0`)** antes de qualquer cálculo Sørensen–Dice:
  - Intenções de lançamento de serviço/item nunca casam com `entity_creation_button` (`Novo cartão +`);
  - Intenções de modalidade/parâmetro nunca casam com campos geográficos (`Cidade`/`UF`) nem com `navigation_root`;
  - Colisões puras de substring intra-palavra (`Autenticidade` vs `Cidade`) recebem peso `0.0`;
  - Coincidência com o `sectionTitle` citado no passo aplica bônus de confiança (`weight: 1.15`).

### 2.2. Máquina de Estado Interativa Universal com DOM Diffing (`stateful-step-engine.ts`, `executor.ts`)
- Criado `auditoria/src/stateful-step-engine.ts` com:
  - `captureDOMStateSnapshot()` e `diffDOMStateSnapshots()` (compara seções, cabeçalhos/contagem de linhas de grades com row picker, botões e inputs visíveis antes e depois da ação);
  - `detectStatefulStepPlan()` para detectar universalmente passos produtores de estado (`search_and_pick`, `guided_sidebar_subportal` multi-hop e delegação do fluxo especializado de `#/pedidoFirmas/cadastrar` ao `firmas-interactive.ts`);
  - `resolveStatefulStep()` e `runStatefulStepPostAction()` executando sondas seguras (`"teste"` + `Enter`/botão de busca + polling reativo + clique no picker `+` + botão de confirmação `Finalizar`/`Confirmar`), bem como transições guiadas de sidebar + link de sub-portal em nova guia (ex.: `C-CENTRAL-02` passo 4 -> `Configurações > Parametrizações > Comunicações` -> nova guia `"Certificados - SPCM-Comunicação COAF"`), sempre respeitando `--dry-run-mutations`.

### 2.3. RAG Soberano de Revisões Humanas e Grafo Cruzado (`human-review-rag.ts`, `seed-human-reviews.ts`, `server.ts`, `menu-path.ts`, `smart-locator.ts`)
- Criado `auditoria/src/human-review-rag.ts`:
  - Carrega todas as revisões abertas (`aberta`/`em_andamento`) de `routine_reviews` no Supabase via `loadHumanReviewsKnowledge()`, persistindo `auditoria/cache/human-reviews-cache.json` (com fallback síncrono em `getCachedHumanReviewsKnowledge()` para testes offline e catálogo canônico das 9 revisões de seed);
  - Compila em linguagem natural via `parseReviewMotivo()` as **diretrizes diretas por rotina** e o **Grafo de Conhecimento Cruzado** (`CrossRoutineKnowledgeGraph`: equivalências globais de menu, aliases de botões icônicos e anti-alvos globais como `CTRL + B` para navegação e `Novo cartão +` para pedidos/serviços);
  - Conectado como **Camada 0.1** em `chooseMenuItem()` (`menu-path.ts`) e `locateAndCaptureWithSelfHealing()` (`smart-locator.ts`), além de guiar planos multi-hop no `stateful-step-engine.ts`.
- `seed-human-reviews.ts` (`--seed-reviews`) e as APIs de mutação do console em `auditoria/src/server.ts` (`POST /api/rotinas/:id/revisao` e `PUT|PATCH /api/revisoes/:reviewId`) invocam `refreshHumanReviewsCache()` após cada gravação.
- Em `auditoria/src/menu-path.ts`, `buildMenuTreeScript()` prioriza o `<a>` visível dentro de cada `<li>` (resolvendo `<a style="display: none;">` + `<a id="menuNovaCertidaoEServico">` em `Notas > Certidões e serviços`) e preserva o texto oculto como alias apontando para o seletor visível; em `modal-scope.ts`/`executor.ts`, modais de aviso no início (`#modalAvisoCertificado`) são encerrados com segurança antes de abrir menus.

### 2.4. Playwright MCP & Skill Atualizada (`.mcp.json`, `.agents/skills/auditoria-rotinas/SKILL.md`)
- Adicionado `.mcp.json` na raiz configurando `@playwright/mcp@latest --headless` (zero credenciais ou IPs versionados).
- Atualizada `.agents/skills/auditoria-rotinas/SKILL.md` com a Seção 6 documentando o Pipeline V2.5 (ADR-027).

---

## 3. Verificação e Evidências

- **Tipagem e Suítes de Testes:**
  - `auditoria`: `tsc -p auditoria/tsconfig.json --noEmit` (exit 0) e `npm --prefix auditoria test` (**114 testes em 28 suítes**, incluindo `adr027-semantic-graph-stateful-rag.test.ts`, **100% aprovados**).
  - `Orion Audit Console`: `tsc -p "Orion Audit Console/tsconfig.json" --noEmit` (exit 0), `vitest run` (**25 testes em 4 arquivos**, 100% aprovados) e `vite build` (client + SSR concluídos).
- **Reauditoria ao vivo (`--routines D-3.14,C-CENTRAL-02,R-1.1,R-2.0 --headless --dry-run-mutations`):**
  - **Falhas técnicas:** `0`; **0** logins redundantes (1 sessão reaproveitada); **0** registros mock criados.
  - **`R-1.1`:** `validado_com_ajustes` (7 prints/webp, Layer 0.1 RAG + `stateful-step-engine`).
  - **`R-2.0`:** `validado_com_ajustes` (9 prints/webp, `stateful-step-engine` + `Concluir` preservado por `dry-run`).
  - **`C-CENTRAL-02`:** `comunicacao_externa` `[CCC]` (6 prints/webp; passos 1–3 `[CCC]` SISCOAF sem print falsa; passo 4 via `Configurações > Parametrizações > Comunicações > Orion Coaf` abrindo nova guia `"Certificados - SPCM-Comunicação COAF"`; passos 5–6 medidos na guia com `CPF/CNPJ` e `Cadastrar`).
  - **`D-3.14`:** bloqueio anterior no passo 1 **superado** (`Notas > Certidões e serviços` aberto via cascata sem tocar em `CTRL + B` e navegando para `#/certidoesServicos/cadastrar`), avançando ao passo 2 onde `[ATT]` reflete legitimamente a ausência de `Identificação do Solicitante` na tela atual (2 prints/webp).
- **Seed & Auditor Geométrico (`--seed-reviews` & `verify-all-phase2-boxes.ts`):**
  - 9/9 revisões humanas sincronizadas (`disco: ok | supabase: ok`).
  - `--only=D-3.14,C-CENTRAL-02,R-1.1,R-2.0`: **24/24 prints** aprovadas nos 8 invariantes matemáticos e estruturais (**Discrepâncias: 0**).
  - Acervo completo (`verify-all-phase2-boxes.ts`): **150 rotinas**, **357/357 prints** aprovadas (**Discrepâncias: 0**).
