# ADR-026: Revisões Humanas no Supabase, Zoom 80%, Fim do Falso RBAC e Fluxo Interativo de Firmas

> **Data:** 2026-11-16  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-017, ADR-018, ADR-019, ADR-021, ADR-023, ADR-024, ADR-025  

---

## 1. Contexto

Após a auditoria no ambiente de Produtos com o perfil administrativo pleno `Gerência webFirmas` (conta `marcus`), a revisão humana detalhada identificou cinco gargalos interligados no pipeline visual:

1. **Governança e memória humana no Supabase:** as 9 revisões detalhadas de auditoria (`C-FIRMA-03`, `R-1.1`, `R-2.0`, `C-CENTRAL-02`, `D-3.14`, `M-40.0`, `M-25.0`, `C-ACESSO-03`, `M-16.2`) precisavam ser persistidas de forma idempotente nas tabelas `routine_reviews`, `routine_review_versions`, `governance_events` e `routines` (`status_governanca = 'revisao_solicitada'`), preservando o estado de revisão em reauditorias subsequentes.
2. **Corte de seções inferiores a 100% de zoom:** telas densas como `Reconhecimento de firmas` (`#/pedidoFirmas/cadastrar`) ocultavam ou cortavam `Nomes para reconhecimento`, `Imprimir` e o rodapé `Tomador / Pagamento / Termo / Cancelar / Concluir` em `1440x900` a 100%.
3. **Falso bloqueio RBAC por `.ngx-orion-hide` e rota obsoleta:** apesar de `marcus` e `Perfil de acesso - Gerência webFirmas` possuírem 100% das permissões liberadas, nós `.ngx-orion-hide` na árvore de menus (ex.: `Balcão de firmas`) e no DOM disparavam falsos positivos de *"Insuficiência de Privilégio na Conta de Homologação"*.
4. **Alucinações residuais no `smart-locator.ts` e alternativas `"X ou Y"`:**
   - Busca por `"+"` / `"Adicionar Serviço"` casava com `"Novo cartão +"` (exclusivo para cadastro de novo cartão);
   - `"Autenticidade"` casava por substring intra-palavra com `"Cidade"`;
   - Alvos compostos em formulários (`"Grupo Firmas"`) colapsavam para `"Firmas"` na barra superior;
   - Checkboxes em `<span>` sem `<label>` (`"Escrevente de Firmas"` em `#/usuario/alterar/1`) ficavam invisíveis para a coleta de rótulos;
   - Caminhos `"X ou Y"` (`**Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**`) mantinham a alternativa inexistente no texto revisado mesmo quando `X` era comprovado e `Y` não existia.
5. **Execução interativa real de Firmas e `M-40.0` sob `--dry-run-mutations`:** `R-1.1` e `R-2.0` precisavam executar a pesquisa real `"teste"` + Enter -> `+` em `Nomes encontrados` -> `Nomes para reconhecimento` -> `Finalizar` -> `Serviços realizados` (`Efetuar Serviço`); e `M-40.0` passo 6 (`Limpar`) com grade populada após omissão de `Concluir`/`Salvar` em `dry-run` configurava ajuste editorial/UI, nunca dependência de banco `[DDD]`.

---

## 2. Decisão Arquitetural

### 2.1. Seed Idempotente e Preservação de Governança (`seed-human-reviews.ts`, `sync-supabase.ts`, `executor.ts`)
- Criado `auditoria/src/seed-human-reviews.ts` e exposto o comando `--seed-reviews` em `auditoria/src/cli.ts` (dispensa preflight de VPN).
- Para cada revisão de `"Marcus (Revisor)"`, atualiza revisão aberta prévia do autor na mesma rotina (versionando em `routine_review_versions`) ou cria registro novo, grava evento em `governance_events`, espelha no `*-revisado.md` via `persistRoutineGovernanceToDisk` e sincroniza com o Supabase (`syncSingleRoutineToSupabase`).
- Em `syncSingleRoutineToSupabase` (`preserveExistingGovernance: true`, ligado no `executor.ts`), se a rotina já possuir revisões abertas (`aberta`/`em_andamento`) em `routine_reviews`, a reauditoria preserva `status_governanca: 'revisao_solicitada'` em vez de sobrescrevê-lo.

### 2.2. Zoom de 80% com Paridade 1:1 DOM-PNG (`config.ts`, `browser.ts`, `dom-geometry.ts`)
- Introduzido `config.browserZoom = 0.8` (configurável por `ORION_BROWSER_ZOOM`), mantendo o viewport físico em `1440x900 @ DPR 1.0`.
- Verificado ao vivo no Chromium 157 que `html { zoom: 0.8 !important; }` faz `getBoundingClientRect()` e `elementFromPoint()` retornarem/aceitarem coordenadas já no espaço `0..1440 x 0..900` em paridade exata 1:1 com o buffer PNG capturado (`1440x900`), ampliando a área visível em 25% por eixo (`1800x1125` CSS efetivos) sem violar nenhum dos 8 invariantes geométricos.
- `AgentBrowserClient` aplica o zoom em `open`, `jumpHash`, `setViewport`, `ensureViewport`, `withNewTabDetection` e antes da extração em `dom-geometry.ts`.

### 2.3. Acesso Pleno `marcus` e Descontinuação de `.ngx-orion-hide` como RBAC (`rbac.ts`, `menu-path.ts`)
- `marcus`, `4tabeliao.scs`, `TABELIAO` e `Perfil de acesso - Gerência webFirmas` compõem `FULL_ACCESS_USERS` / `DEFAULT_FULL_ACCESS_MARKERS` com acesso total (`isFullAccessSession`). `probePermissionBlockedTargets` retorna `null` imediatamente em sessão plena.
- Removido `.functionality.ngx-orion-hide` de `PERMISSION_MARK_SELECTOR` (permanecem apenas `.functionality.disabled` e `[title*="bloqueada para o seu perfil"]` para sessões não plenas).
- `buildMenuTreeScript()` em `menu-path.ts` ignora por completo itens `<li>` com `.ngx-orion-hide` ou `display: none` (rotas descontinuadas pela aplicação), e `chooseMenuItem` recebe `{ ignoreDisabledBlocks: fullAccess }` e `MENU_LEAF_SYNONYMS` (`'balcao de firmas' -> ['reconhecimento de firmas']`).

### 2.4. Guardas Semânticas, Checkboxes em `<span>` e Remoção `"X ou Y"` (`navigation-guard.ts`, `smart-locator.ts`, `dom-geometry.ts`, `menu-path.ts`)
- **`navigation-guard.ts`:**
  - `NOVO_CARTAO_RE`: proíbe `"Novo cartão +"` quando o passo não menciona `"cartão"`.
  - `isNavbarOnlyTargetForbidden`: bloqueia nós `inNavbar` (`isTopNav`) em passos com verbo de formulário ou alvo composto (`>= 2` palavras diferente do item simples da navbar, ex.: `"Grupo Firmas"` vs `"Firmas"`).
- **`smart-locator.ts` & `dom-geometry.ts`:**
  - `ORION_UI_SYNONYMS`: inclui `'grupo firmas': ['escrevente de firmas']` e `'impressao': ['imprimir', 'impressão']`.
  - `collectVisibleLabelNodes` coleta também `<span>` / `<orion-checkbox>` na zona de conteúdo com exatamente 1 checkbox/radio interno (`"Escrevente de Firmas"` em `#/usuario/alterar/1`), e `fieldBlockElements` agrupa o par checkbox + `<span>`.
  - `inferStepZone`: verbos estritos de formulário combinados a `"aba"` (sem `"menu"`/`"navbar"`) usam `'content-preferred'` em vez de `'any'`.
  - `rankSemanticCandidatesInA11y` usa comparação por palavra/frase inteira (`hasWholePhrase`), permite sinônimos sobre nós `label` e rejeita falsas colisões intra-palavra entre tokens simples (`"Autenticidade"` != `"Cidade"`).
  - `executeStepAction`: respeita o estado `.checked` em intenções de marcação para não desmarcar checkbox já ativo.
- **`menu-path.ts`:** `expandMenuOrAlternativeSpan` expande o `from` da substituição quando um passo contém `**X** ou **Y**` (ou `**X** (ou **Y**)`) e a árvore real prova `X` enquanto `Y` inexiste, removendo `Y` dentro da Trava de Evidência (`evidence.ts`).

### 2.5. Fluxo Interativo de Firmas e Regra de `M-40.0` sob Dry-Run (`firmas-interactive.ts`, `executor.ts`, `review-classifier.ts`)
- Criado `auditoria/src/firmas-interactive.ts` para `#/pedidoFirmas/cadastrar`:
  - `resolveFirmasStep` resolve determinística e graficamente as etapas `search_person`, `review_card`, `sga_order`, `add_service` (`Nome do serviço`, `Escrevente`, `Cálculo`, `QTD`, `Efetuar Serviço`, `Observação`), `act_and_print` (`Imprimir`) e `finish_order` (`Tomador`, `Pagamento`, `Termo`, `Concluir` respeitando `--dry-run-mutations`).
  - `runFirmasSearchPostStep` executa ao vivo a busca `"teste"` + `Enter` em `#inputOrdemServicoNome`, aguarda `#iconSelecionaPessoa0` em `Nomes encontrados` (`passo-NN-b`), clica `+`, captura `Nomes para reconhecimento` + `Finalizar` (`passo-NN-c`) e clica em `Finalizar` para reexibir `Serviços realizados`.
- Em `review-classifier.ts` e `executor.ts`, quando `--dry-run-mutations` omitiu uma gravação anterior e o passo seguinte apenas busca botão de filtro (`Limpar`) em rotina cuja grade já possui dados reais (`!emptyGrid && headers.length > 0`), o passo é registrado com captura limpa e nota de ajuste (`validado_com_ajustes`), nunca `[DDD]`.

---

## 3. Verificação e Evidências

- **Supabase & Disco (`--seed-reviews`):** 9 revisões de `"Marcus (Revisor)"` gravadas/atualizadas em `routine_reviews`, `routine_review_versions`, `governance_events`, `routines` (`status_governanca = 'revisao_solicitada'`) e `*-revisado.md`.
- **Tipagem e Testes:**
  - `auditoria`: `tsc --noEmit` (0 erros) e `npm test` (104 testes em 25 suítes, 100% aprovados).
  - `Orion Audit Console`: `tsc --noEmit` (0 erros), `vitest run` (25 testes em 4 arquivos, 100% aprovados) e `vite build` concluído.
- **Reauditoria ao vivo (`--headless --dry-run-mutations`, zoom 80%):**
  - `R-1.1`: `validado_com_ajustes` (7 prints com `passo-02-b` e `passo-02-c`, alternativa `"ou Firmas > Balcão de Firmas"` removida no passo 1, sem `Novo cartão +` e sem `Cidade`).
  - `R-2.0`: `validado_com_ajustes` (bloqueio RBAC anterior superado, 7 prints com `passo-03-b` e `passo-03-c`, `Serviços realizados` + `Efetuar Serviço`, `Concluir` preservado por `dry-run`).
  - `C-FIRMA-03`: `[ATT] atualizacao_editorial` (falso RBAC eliminado, passo 3 resolveu `Grupo Firmas` -> `Escrevente de Firmas`, passo 4 bloqueado corretamente por defasagem do manual).
  - `M-40.0`: `validado_com_ajustes` (`[DDD]` anterior superado sob `dry-run` com grade populada).
- **Auditor Geométrico (`verify-all-phase2-boxes.ts`):** 24/24 prints das 4 rotinas e 349/349 prints de 150 rotinas em todo o acervo aprovadas nos 8 invariantes matemáticos e estruturais (0 discrepâncias).
