# ADR-038: Catálogo Estrutural de Telas Nível 1 (114 Telas) e Integração Consultiva com Evidência Estrita

> **Data:** 2026-11-24  
> **Status:** Aceita e Implementada  
> **Decisores:** Product Owner & Equipe de Auditoria Orion TN  
> **Relacionada a:** ADR-017, ADR-028, ADR-030, ADR-037

---

## 1. Contexto

Com a ADR-037, o catálogo canônico de menus (`auditoria/data/orion-menu-tree-canonical.json`) fechou a lista navegável de **115 caminhos finais** do Orion TN `06.05.02`. Entretanto, `auditoria/cache/orion-route-graph.json` (ADR-030) é um artefato de cache local ignorado pelo Git e sujeito a capturas parciais.

Para dotar a auditoria de um mapa estrutural versionado de **Nível 1** das **114 telas** do sistema — contendo rota hash, título, abas, cabeçalhos/seções, botões, campos e tabelas — sem comprometer a **Evidência Estrita (ADR-017)**, tornou-se necessário definir o contrato de leitura e integração auxiliar desse catálogo no motor local (`route-crawler.ts` e `att-screen-advisor.ts`).

---

## 2. Decisão Arquitetural

### 2.1. Artefato e Schema Nível 1 (`auditoria/data/orion-screen-catalog.json`)

O catálogo Nível 1 segue o schema:

```json
{
  "version": "06.05.02",
  "level": 1,
  "screens": [
    {
      "id": "...",
      "modulo": "...",
      "chain": ["..."],
      "slug": "...",
      "status": "...",
      "openedAs": "...",
      "routeHash": "#/...",
      "pageTitle": "...",
      "tabs": ["..."],
      "headings": ["..."],
      "buttons": ["..."],
      "fields": ["..."],
      "tables": ["..."]
    }
  ]
}
```

### 2.2. Leitura Opcional, Cache por `mtimeMs` e Enriquecimento em `route-crawler.ts`

- **`ORION_SCREEN_CATALOG_FILE`:** aponta para `auditoria/data/orion-screen-catalog.json`.
- **`loadCachedScreenCatalog` & `setScreenCatalogForTesting`:** leitura opcional com cache por `mtimeMs` (nunca lança erro quando o arquivo não existe em disco) e helper determinístico para testes unitários offline.
- **Compatibilidade e Enriquecimento:**
  - `findRouteEntryByChain` e `findRouteEntryByHash` preservam a prioridade de `orion-route-graph.json`, enriquecendo campos ausentes (`sections`, `fields`, `buttons`, `tables`, `tabs`, `hash`, `title`) a partir do catálogo Nível 1 ou servindo-o como fallback quando o grafo vivo não existe.
  - `findRouteEntriesByTabOrSection` continua compatível com `menu-path.ts` e `mcp-server.ts`, combinando entradas do grafo vivo e do catálogo Nível 1 sem duplicidade.
  - `findScreenCatalogEntryByChain`, `findScreenCatalogEntryByHash` e `findScreenCatalogHints` expõem busca auxiliar sobre `tabs`, `headings`, `buttons`, `fields`, `tables` e `pageTitle`.

### 2.3. Integração Consultiva em `att-screen-advisor.ts` (Preservação 100% da Evidência Estrita — ADR-017)

- **Separação Estrita:** `suggestScreenMatches` continua operando **exclusivamente** sobre `ScreenStructuralInventory` (DOM medido ao vivo no momento do bloqueio `[ATT]`). O catálogo Nível 1 **nunca** injeta sugestões como se fossem medições ao vivo, **nunca** gera caixas/demarcações e **nunca** reescreve o texto do manual.
- **`catalogContext` (`AttCatalogContext`):** quando `inventory.route` corresponde a uma tela mapeada no catálogo Nível 1, `buildAttDiagnosis` anexa `catalogContext` (com `screenId`, `menuPath`, `routeHash`, `tabs`, `headings`, `tables` e eventuais `matchedElements` consultivos para alvos que falharam no recorte atual do DOM).
- **`crossRouteHints` ampliado:** além de `findRouteEntriesByTabOrSection`, `buildAttDiagnosis` consulta `findScreenCatalogHints` para apontar quando um campo, botão, tabela, aba ou seção ausente na tela atual existe em outra rota do catálogo (`source: 'screen-catalog'`).
- **Relatório e YAML:** `renderAttDiagnosisTip` exibe o bloco de forma explicitamente consultiva e `attDiagnosisYamlLines` serializa `contexto_catalogo_nivel1` dentro de `auditoria_ui.diagnostico_tela_att` (sem migration SQL).

---

## 3. Verificação

Cobertura unitária offline em `auditoria/src/__tests__/screen-catalog-integration.test.ts`, validando fallback sem arquivo em disco, cache por `mtimeMs`, `setScreenCatalogForTesting`, enriquecimento no `route-crawler.ts` e preservação integral da Evidência Estrita no `att-screen-advisor.ts`.
