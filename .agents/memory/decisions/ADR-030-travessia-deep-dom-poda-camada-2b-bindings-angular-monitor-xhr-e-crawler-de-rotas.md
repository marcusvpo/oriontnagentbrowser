# ADR-030: Travessia Deep DOM & Iframes Pós-Scroll, Poda Semântica da Camada 2B, Bindings Angular, Monitor XHR/Fetch e Crawler de Rotas

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-009, ADR-012, ADR-014, ADR-015, ADR-024, ADR-025, ADR-026, ADR-027, ADR-028, ADR-029  

---

## 1. Contexto

A evolução do motor determinístico (`auditoria/src/`) até a ADR-029 ainda possuía cinco lacunas estruturais em páginas modernas com Web Components (Open Shadow DOM), sub-portais/relatórios em `<iframe>` aninhados, chamadas tardias ao fallback LLM da Camada 2B, controles icônicos/inputs sem `<label>` em AngularJS/Angular e esperas fixas após requisições ao WildFly:

1. **Limite de DOM plano e iframes de 1º nível (`dom-geometry.ts`, `browser.ts`):** `querySelectorAll` e `parentElement` paravam na fronteira do `ShadowRoot`, perdendo `sectionTitle`, `rowContext` e zona semântica; a busca em `iframe` ia só ao 1º nível, não recalculava `frameOffset` após `scrollIntoView()` nem compensava `clientLeft`/`paddingLeft`, clipping acumulado e `zoom: 0.8` do documento hospedeiro, além de proibir carimbo `actionTarget` fora de `document`. Em novas guias `[CCC]`, redirects pós-`readyState === 'complete'` podiam resetar o viewport/zoom antes da estabilização final.
2. **Ruído e desperdício de slots na Camada 2B (`smart-locator.ts`):** o fallback `resolveViaLLMOnAccessibilityTree` cortava `.slice(0, 40)` antes de remover `label` sem `@ref`, ícones PUA (`\uE000-\uF8FF`) / NBSP, candidatos incompatíveis (`weight === 0` em `evaluateSemanticCompatibility`), itens de `navbar` em zona `content` e ações repetidas de linhas de tabela; além disso não revalidava o `@ref` devolvido pelo LLM.
3. **Botões icônicos sem `title` e inputs sem `<label>`:** o Orion TN expõe bindings declarativos AngularJS/Angular (`ng-model`, `ng-click`, `ui-sref`, `ng-disabled`, `ng-if`) ignorados até então.
4. **Esperas cegas em fluxos reativos (`stateful-step-engine.ts`):** `runStatefulStepPostAction` dependia de `wait(1200)` fixos e polling sem visibilidade das requisições XHR/Fetch em voo nem das mensagens HTTP 400/422 retornadas pelo backend WildFly.
5. **Ausência de mapa vivo de rotas e abas (`--crawl-map`):** telas com abas/seções internas só eram descobertas sob demanda no momento de falha (`[ATT]`), sem índice somente-leitura pré-mapeado das rotas e abas reais de Produtos.

---

## 2. Decisão Arquitetural

### 2.1. Parte A.1 — Travessia Deep DOM, Iframes Recursivos Pós-Scroll e Nova Guia (`dom-geometry.ts`, `browser.ts`)
- **Open Shadow DOM:** `composedParent`, `composedClosest`, `composedContains` e `queryAllDeep(root, selector, depth <= 6)` atravessam `ShadowRoot` abertos mantendo `sectionTitle`, `rowContext`, `topModalOf`, `isBehindModal` (`deepElementFromPoint`), `resolveContentRoot`, `inZone`, `findCandidates`, `resolveGroup`, `fieldBlockElements` e `controlOf`. `.ng-hide` ancestral passa a invalidar `isVisible`.
- **Iframes recursivos com cadeia e recálculo pós-scroll:** `searchFramesRecursively(rootDoc, frameChain, depth <= 6)` (inclusive iframes dentro de Shadow DOM) registra `frameChain: HTMLIFrameElement[]`. `computeChainOffsetAndClip(frameChain, targetZoom)` soma `frame.clientLeft`/`paddingLeft` e acumula o retângulo de recorte (`clip`) ao longo da cadeia, compensando a escala visual efetiva (`fr.width / frame.offsetWidth`, com fallback para o zoom do documento hospedeiro, evitando duplo-zoom ao não re-injetar `zoom: 0.8` dentro do `contentDocument`). Esse cálculo é **reexecutado após `el.scrollIntoView(...)` e `void el.offsetHeight`** nos modos Grupo e Alvo Único.
- **`actionTarget` cross-frame e `probeActionNode`:** removida a trava `clickEl.ownerDocument === document` / `fillEl.ownerDocument === document`; `buildProbeActionNodeScript` usa `findDeepBySelector` até profundidade 6 somando `frameOffset` ao `box` e `click`/`fill` contam com fallback deep-DOM caso o seletor `[data-orion-*]` resida em `iframe`.
- **Nova guia `[CCC]` (`withNewTabDetection`):** após `readyState === 'complete'`, aguarda estabilidade de `window.location.href` em redirects pós-load e reafirma `ensureViewport(1440, 900)`, `applyZoom()` e `ensureNetMonitor()`.

### 2.2. Parte A.2 — Poda Semântica e Ranqueamento na Camada 2B (`smart-locator.ts`)
- `collectVisibleLabelNodes` (`buildCollectVisibleLabelNodesScript`) passa a usar `composedParent`/`queryAllDeep` e travessia recursiva de iframes same-origin.
- Criados `cleanA11yNodeName` e `pruneAndPrioritizeNodesForLLM(step, nodes, 40)`:
  1. Filtra apenas nós acionáveis com `@ref` válido (`/^@?e\d+$/`, excluindo `role: 'label'` sem ref);
  2. Limpa caracteres PUA (`\uE000-\uF8FF`), zero-width e NBSP (`\u00A0`), aplica `forbiddenCandidateReason` e `evaluateSemanticCompatibility` (vetando `weight === 0`), remove nós `inNavbar`/`navigation_*` quando `inferStepZone(...) === 'content'` (e os rebaixa em `content-preferred`);
  3. Deduplica ações repetidas de grade por `(role, normalizeText(name), normalizeText(sectionTitle))`, preservando o 1º representante;
  4. Ordena por afinidade semântica com os alvos do passo antes do corte de 40 linhas, incluindo `{sectionTitle}` no prompt compacto;
  5. Revalida `forbiddenCandidateReason` e `evaluateSemanticCompatibility` sobre o `@ref` retornado pelo LLM antes de chamar `resolveHealedGeometry`.

### 2.3. Parte B.3 — Extrator de Bindings Angular (`types.ts`, `dom-geometry.ts`)
- `DOMAngularBindings` (`ngModel`, `ngClick`, `uiSref`, `ngDisabled`, `ngIf`, `humanizedModel`, `humanizedAction`) adicionada em `DOMSemanticSignature.angularBindings`.
- Exportados `humanizeAngularIdentifier` e `extractAngularBindingsFromAttrs`. Em `findCandidates` e `extractSemanticSignature`, os bindings servem para desempate de controles habilitados (`!isNgDisabled`), fallback de `associatedLabel`/`semanticRole` e localização determinística de botões icônicos sem texto e inputs sem `<label>`.

### 2.4. Parte B.4 — Monitor de Rede XHR/Fetch (`browser.ts`, `stateful-step-engine.ts`)
- `buildNetMonitorInitScript()` injeta idempotentemente `window.__orionNetMonitor` interceptando `fetch` e `XMLHttpRequest`, contabilizando `pendingCount`, `totalRequests`, `lastActivityAt` e `lastApiResponse` (`status`, `url` sanitizada sem origem/IP via `sanitizeMonitoredUrl`, `isEmptyArray`, `validationMessage`, `snippet`). Instalado sem roundtrip extra dentro de `applyZoom()`.
- `AgentBrowserClient` expõe `ensureNetMonitor()`, `readNetMonitor()` e `waitForNetworkIdle()`.
- `runStatefulStepPostAction` em `stateful-step-engine.ts` aguarda `pendingCount === 0`, encerra cedo quando `isEmptyArray === true` e registra `apiValidationMessage` / `lastApiResponse` diante de erros HTTP 400/422.

### 2.5. Parte B.5 — Crawler de Grafo Vivo de Rotas (`route-crawler.ts`, `cli.ts`, `menu-path.ts`, `att-screen-advisor.ts`)
- `cli.ts --crawl-map [--headless] [--max-routes N]` executa `crawlOrionRouteGraph` em modo estritamente somente-leitura, percorrendo folhas ativas do menu e gravando `auditoria/cache/orion-route-graph.json` (`modulo`, `chain`, `hash`, `title`, `tabs`, `sections`, `fields`, `buttons`).
- Conectado como fonte auxiliar (nunca substituta de evidência ao vivo) em:
  - `menu-path.ts`: `chooseMenuItem` (resolução auxiliar de cauda `tail_as_screen_section` quando a tela real existe na árvore viva e não há ambiguidade) e `buildMenuPathMissingEvidence` (`leafElsewhere`);
  - `att-screen-advisor.ts`: `crossRouteHints` em `buildAttDiagnosis`, `renderAttDiagnosisTip` e `pistas_mapa_rotas` em `attDiagnosisYamlLines`.

---

## 3. Verificação e Evidências

- **Testes unitários (`auditoria/src/__tests__/adr030-deep-dom-angular-net-crawler.test.ts`):** 16 novos testes cobrindo validação sintática dos scripts, travessia Deep DOM / Shadow DOM / cadeia de iframes com recálculo pós-scroll e zoom `0.8`, `probeActionNode` deep-DOM, poda da Camada 2B e validação pós-LLM, humanização e fallback de bindings Angular, `__orionNetMonitor` (fetch/XHR, sanitização de URL, HTTP 422, `isEmptyArray`, `waitForNetworkIdle`/`withNewTabDetection`), e crawler de rotas + integrações em `menu-path.ts` e `att-screen-advisor.ts`.
- **Checagem empírica de `zoom: 0.8` em iframe (Chromium 157 via `agent-browser` + Sharp):** comprovado pixel a pixel que `html { zoom: 0.8 }` no documento raiz escala visualmente o `<iframe>` em `0.8x` (`fr.width / offsetWidth === 0.8`), validando a fórmula exata de `computeChainOffsetAndClip`.
- **Tipagem e suíte completa:**
  - `npx --prefix auditoria tsc -p auditoria/tsconfig.json --noEmit`: **0 erros** (exit 0).
  - `npm --prefix auditoria test`: **169/169 testes aprovados em 42 suítes** (`fail: 0`).
- **Auditoria Geométrica (`npx --prefix auditoria tsx auditoria/src/verify-all-phase2-boxes.ts --all`):**
  - **150 rotinas**, **433 prints**, **267/267 Zero Auto-Oclusão**, **433/433 pares PNG+WebP**, **0 discrepâncias** nos 8 invariantes.
