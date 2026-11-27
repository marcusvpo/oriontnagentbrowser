# ADR-039: Catálogo de Telas Nível 2 (Sub-Estados, Exploração Segura e Integração Direcionada)

> **Data:** 2026-11-24  
> **Status:** Aceita e Implementada  
> **Decisores:** Product Owner & Equipe de Auditoria Orion TN  
> **Relacionada a:** ADR-017, ADR-018, ADR-028, ADR-038

---

## 1. Contexto

A ADR-038 consolidou o **Catálogo Estrutural de Telas Nível 1** (`auditoria/data/orion-screen-catalog.json`) cobrindo a superfície inicial das **114 telas** do Orion TN `06.05.02`. Contudo, grande parte dos campos, botões e ações de grade reside em **sub-estados internos** (abas inativas, accordions recolhidos, filtros avançados, modais/formulários de abertura e grades populadas após pesquisa).

Para mapear esses sub-estados com **zero risco de mutação** no ambiente de Produtos e acelerar a localização e o diagnóstico `[ATT]` sem violar a **Evidência Estrita (ADR-017)**, definiu-se a arquitetura de **Nível 2** do catálogo de telas.

---

## 2. Decisão Arquitetural

### 2.1. Exploração Segura Nível 2 (`map-screens-level2.ts` / `screen-catalog-extractor.ts`)

- **Blocklist Absoluta Anti-Mutação:** nenhum controle cujo texto, `title`, `aria-label` ou `ng-click` contenha verbos de persistência, destruição, alteração de estado ou encerramento de sessão (`salvar`, `gravar`, `confirmar`, `excluir`, `cancelar ato`, `sair`, etc.) pode ser acionado. `Cancelar`/`Fechar`/`Voltar`/`×` são permitidos **exclusivamente** para descartar um modal/formulário recém-aberto sem salvar.
- **Monitoramento Passivo XHR/Fetch:** qualquer tentativa inesperada de mutação de rede é registrada como `SubStateSecurityAlert` (`blocked_security`), e o estado é restaurado via `restoredCleanly`.
- **Taxonomia de Sub-Estados (`subStates[]`):** `tab`, `accordion`, `advanced_filters`, `form_opener`, `modal_opener` e `search_grid_reveal`, com deduplicação por `fingerprint` e screenshots limpos em `auditoria/mapeamento-telas/nivel-2/<modulo>/`.
- **Índice Unificado (`allKnownElements`) e `iconDictionary`:** cada tela explorada recebe `level2Status`, `allKnownElements` (botões, campos, abas, cabeçalhos e ações de grade anotados com `where: 'root' | 'tab:<nome>' | 'modal:<gatilho>' | 'accordion:<nome>' | 'grid_row'`) e `iconDictionary` consolidado.

### 2.2. Navegação Direcionada em `reveal-explorer.ts`

- **`findCatalogRevealHints` e `parseWhereLocation`:** quando um alvo não está na superfície inicial do passo, o explorador consulta `allKnownElements` da rota atual (`findScreenCatalogEntryByHash`) e converte anotações não-`root` (`tab:...`, `accordion:...`, `modal:...`, `grid_row`) em pistas diretas para `rankTriggers`.
- **Preservação Integral da Evidência Estrita (ADR-017):** o catálogo apenas **reordena** os gatilhos reais carimbados no DOM ao vivo (dispensando reordenação cega por LLM quando há pista direta). Após o clique, o elemento revelado **continua sendo medido e validado ao vivo** via `getDOMGeometry` e fotografado antes/depois.

### 2.3. Diagnóstico Diferenciado em `att-screen-advisor.ts`

- **`AttCatalogContext` Nível 2:** quando `allKnownElements` está disponível para a rota, `buildCatalogContextForScreen` inclui `where` e `inUnvisitedSubState` em cada pista consultiva e separa explicitamente:
  - `unvisitedSubStateTargets`: alvos presentes no catálogo sob `tab:...`, `accordion:...`, `modal:...` ou `grid_row` não ativos no recorte atual do DOM (o passo do manual omitiu o sub-passo de abertura).
  - `genuinelyMissingTargets`: alvos sem correspondência em toda a tela (root + sub-estados) em catálogo L2 `explored`/`no_substates` (candidatos fortes a remoção ou renomeação no manual).
- **Relatório e YAML:** `renderAttDiagnosisTip` e `attDiagnosisYamlLines` exibem essas classificações de forma estritamente consultiva, mantendo `suggestions` e `unmatched` 100% restritos ao DOM medido ao vivo.

---

## 3. Verificação

- Testes offline dedicados em `auditoria/src/__tests__/screen-catalog-l2.test.ts`, `auditoria/src/__tests__/screen-reports-l2.test.ts` e `auditoria/src/__tests__/screen-catalog-integration.test.ts`.
- Checagem completa via `npm --prefix auditoria run typecheck` e `npm --prefix auditoria test`.
