# ADR-040: Catálogo de Telas Nível 2.5 (Full-Page Real, Alternadores de Visão, Sub-Abas e Busca Segura em Grades)

> **Data:** 2026-11-26  
> **Status:** Aceita e Implementada  
> **Decisores:** Product Owner & Equipe de Auditoria Orion TN  
> **Relacionada a:** ADR-017, ADR-038, ADR-039

---

## 1. Contexto

Após a entrega do **Nível 1 (ADR-038)** e do **Nível 2 (ADR-039)**, uma auditoria direta sobre o `auditoria/data/orion-screen-catalog.json` e os 313 PNGs gerados identificou 4 lacunas objetivas:
1. **Falso overflow e truncamento em 900px:** com `zoom: 0.8`, `scrollHeight` reportava `1125` contra `clientHeight: 900`, marcando `114/114` telas como overflow, porém todas as prints `-full.png` do Nível 1 permaneciam em `900px` por falta de `--full` e expansão de containers internos com scroll (`overflow-y: auto|scroll`).
2. **Alternadores de modo/visão não explorados:** botões seguros como **Kanban**, **Dashboard**, **Visão Geral**, **Por comunicação** e **Informações** mudam completamente o layout da tela sem alterar rota nem persistir dados, mas não entravam no plano L2.
3. **Seletores de abas bloqueados por `NAV_ZONE_SELECTOR` e ausência de checagem aninhada em formulários:** `NAV_ZONE_SELECTOR` continha `[role="tablist"]` e `.nav-stacked`, impedindo detecção/clique em certos menus internos e abas dentro de formulários (`form_opener`/`modal_opener`).
4. **Grades vazias sem busca:** `SEARCH_BUTTON_PREFIXES` não incluía `filtrar` e `planScreenExploration` bloqueava estaticamente qualquer tela que tivesse campo `required` no DOM, mesmo quando já preenchido por padrão.

---

## 2. Decisão Arquitetural

### 2.1. Captura Full-Page Verdadeira (`auditoria/src/fullpage-capture.ts` + `browser.ts`)
- Adicionado `screenshotFullPage()` em `AgentBrowserClient` usando `agent-browser screenshot --full`.
- Criado `captureTrueFullPage(client, outputPath, { onlyIfOverflow })`, que:
  1. Calcula `effectiveClientHeight = Math.round(clientHeight / zoom)` em `buildScreenDomExtractionScript()` (eliminando falsos positivos de `1125 > 900` em `zoom: 0.8`).
  2. Expande temporariamente containers internos com `overflow-y: auto|scroll` e `scrollHeight > clientHeight + 40` (restaurando os estilos originais em `finally`).
  3. Dispara `screenshot --full` e, se o PNG continuar `<= 910px` mesmo com overflow no DOM, aplica costura vertical via `Sharp` (`stitchDocumentScrollWithSharp`).
  4. Remove `-full.png` falsos (`<= 910px`) e só persiste arquivos `-full.png` com altura real verificada `> 910px`.

### 2.2. Alternadores de Visão, Abas Internas de Formulários e Busca Segura (`map-screens-level2.ts` + `screen-catalog-extractor.ts`)
- **`view_switcher` (`classifySafeViewSwitcher`):** whitelist segura (`kanban`, `dashboard`, `visao geral`, `por ...`, `informacoes`, `resumo`, `lista`, `grade`, `calendario`, `grafico`, etc.), protegida pela blocklist absoluta anti-mutação (`isBlockedByAntiMutation`), gerando `where: 'view:<label>'`.
- **`nested_tab` (`exploreNestedTabsAndAccordions`):** exploração automática de abas/menus laterais internos (`.nav-tabs`, `.nav-pills`, `.nav-stacked`, `.nav-wizard`, `.wizard-steps`, `.steps`, `ul.list-group`, `[role="tab"]`, `.mat-tab-label`) e accordions recolhidos dentro de `form_opener`/`modal_opener` antes de restaurar o estado, gerando `where: 'modal:<opener> > tab:<tab>'`.
- **Correção da exclusão de `NAV_ZONE_SELECTOR` em abas:** `buildScreenDomExtractionScript` e `clickControlSafelyInDom` (`KIND === 'tab'`) agora excluem apenas `.navbar, header, footer, .footer, .rodape, .sidebar, .menu-lateral, .bg-menu-lateral`, evitando descartar `[role="tablist"]` e `.nav-stacked` de conteúdo.
- **Busca segura em grade (`search_grid_reveal`):** `SEARCH_BUTTON_PREFIXES` passa a incluir `'filtrar'`; o planejamento não bloqueia mais estaticamente por `f.required`, delegando a checagem ao vivo para o momento da execução no DOM.
- **Modo incremental `--level25` / `--refresh-fullpage` (`npm --prefix auditoria run screens:map:l25`):** preserva os sub-estados `captured` do Nível 2, atualiza `scrollMetrics` e `-full.png` reais, re-checa `form_opener`/`modal_opener` para sub-abas e executa apenas as novas ações delta com timeout padrão de `25000ms` e guarda `isAborted()` em todos os `pushSubState`.

### 2.3. Integração no Motor e Relatórios
- **`reveal-explorer.ts` (`parseWhereLocation`) e `att-screen-advisor.ts` (`isWhereUnvisited`, `formatWherePt`):** suportam `view:<label>` e `modal:<opener> > tab:<tab>`, preservando integralmente a Evidência Estrita (ADR-017).
- **`generate-screen-reports.ts`:** contempla `view_switcher`, `nested_tab`, `fullPageScreenshot` e `trueFullPagePrintsCount` no catálogo Markdown e no comparativo V2.

---

## 3. Resultados Verificados em Produção (Homologação 06.05.02)

- **Cobertura:** `114/114` telas alvo processadas (`73 explored`, `41 no_substates`, `0 partial`, `0 failed`, `1 skipped: Sair`), **`securityAlertsCount: 0`**.
- **Sub-estados & Elementos:** `95` sub-estados capturados (`62 form_opener`, `20 tab`, `5 view_switcher`, `4 advanced_filters`, `3 search_grid_reveal`, `1 modal_opener`), `777` botões únicos, `2.202` campos únicos, `122` entradas em `iconDictionary`.
- **Prints Full-Page Reais:** todos os 114 `-full.png` falsos de `900px` foram eliminados (`screensWithOverflow` caiu de `114` para `7`); **12/12 arquivos `-full.png` em disco têm altura real > 910px** (até `3240px` em `086 Espécie > Adicionar` e `2216px` em `110 Parametrizações > Comunicações`).
- **Cruzamento Editorial V2 (471 rotinas):** `1.644` termos únicos na UI (`+794` sobre L1), `300` termos literais (`+77` sobre L1, incluindo resgates via `view_switcher` como **DOI** e **"Em andamento"**), Lista Ouro `[ATT]` refinada para `1.363` termos.
- **Verificação de código:** `npm --prefix auditoria run typecheck` (exit 0) e `npm --prefix auditoria test` (`336/336` testes em 73 suítes, incluindo `auditoria/src/__tests__/screen-catalog-l25.test.ts`).
