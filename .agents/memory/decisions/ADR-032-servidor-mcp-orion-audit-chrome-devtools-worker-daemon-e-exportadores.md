# ADR-032: Servidor MCP Local (`orion-audit`), `chrome-devtools-mcp`, Worker Daemon Realtime (`worker:daemon`) e Exportadores de Base de Ajuda e Testes Playwright E2E

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-005, ADR-007, ADR-017, ADR-023, ADR-025, ADR-026, ADR-027, ADR-028, ADR-029, ADR-030, ADR-031  

---

## 1. Contexto

Com a consolidação do Pipeline de Auditoria V2.5 (`ADR-027` a `ADR-031`), o ecossistema Orion TN precisava acoplar quatro frentes de produtividade operacional ponta a ponta sem conflitar com outras contas Supabase existentes na máquina de desenvolvimento:

1. **Inspeção e Operação de Baixo Custo de Tokens para Agentes de Código:** Evitar que agentes precisem ler relatórios inteiros, telemetrias brutas ou o `orion-route-graph.json` completo a cada consulta, expondo um servidor MCP local dedicado (`orion-audit`) via `stdio` + `chrome-devtools-mcp` para inspeção ao vivo no Chrome conectado à OpenVPN da Siplan.
2. **Isolamento Estrito de Credenciais Supabase:** Não instalar nem configurar `@supabase/mcp-server-supabase` no `.mcp.json` (evitando conflito de credenciais globais com outros projetos), mantendo 100% da comunicação do projeto exclusivamente via **Pooler PostgreSQL IPv4** (`SUPABASE_DB_URL` / `DATABASE_URL` via `pg`) e **API REST/Storage** (`SUPABASE_URL` + `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` em `auditoria/.env`).
3. **Automação Reativa para o Orion Audit Console (`worker:daemon`):** Reexecutar automaticamente rotinas em background sempre que uma nova revisão humana for salva (`routine_reviews`) ou o botão **"Reexecutar"** for acionado no Console (`runner_jobs` / `audit_jobs` / `routines`), atualizando antes o cache da Camada 0.1 (`human-reviews-cache.json`) com debounce e trava de concorrência (`1 job por vez`).
4. **Exportação Pós-Aprovação para Documentação e QA:** Gerar automaticamente versões limpas de Manual/Base de Ajuda (`--export-docs`) e scripts executáveis de regressão E2E `@playwright/test` (`--export-playwright`).

---

## 2. Decisão Arquitetural

### 2.1. Etapa 1 — Servidor MCP Local (`auditoria/src/mcp-server.ts`) & `.mcp.json`
- Instalado `@modelcontextprotocol/sdk` em `auditoria/package.json` e criado `auditoria/src/mcp-server.ts` operando via `StdioServerTransport` (`createOrionAuditMcpServer()`), expondo 7 tools otimizadas:
  1. `inspect_routine({ routineId })`: retorna status de auditoria e governança, tags de revisão, frontmatter YAML, divergências de auto-cura, `diagnostico_tela_att` (Raio-X), passo onde bloqueou e lista de imagens `.webp`.
  2. `query_clusters({ tag?, modulo?, phase? })`: agrega contagens por status (`[ATT]`, `[CCC]`, `[DDD]`, `[XRX]`, `validado_com_ajustes`, `validado_inalterado`) e por cluster de causa raiz (`A`, `B`, `C`, `D` da ADR-029), com filtros opcionais.
  3. `search_orion_tree({ query })`: busca rotas hash, cadeias de menu reais, abas e seções em `auditoria/cache/orion-route-graph.json`, `orion-menu-tree-real.json`, equivalências canônicas (`EXPLICIT_MENU_EQUIVALENCES`) e `.agents/memory/standards/glossario_siplan.md`.
  4. `list_human_reviews()`: consulta diretamente via Pooler PostgreSQL IPv4 (`pg`, `createPgClient()`) as revisões humanas em `routine_reviews` e os contadores de `status_governanca` em `routines` (com fallback automático para `human-reviews-cache.json` quando offline).
  5. `trigger_single_reaudit({ routineId, headless? })`: executa a reauditoria segura (`--routines <id> --dry-run-mutations --headless`) e retorna o snapshot atualizado da rotina.
  6. `list_pending_som()`: lê `auditoria/cache/pending-som/pending-som-queue.json` e lista os passos pendentes com caminhos das imagens `*-som.png` e candidatos numerados `[1]..[N]`.
  7. `apply_som_curation({ routineId, stepNumber, tagId, actualTarget, note })`: grava a decisão visual aprovada na Camada 0.1 (`human-reviews-cache.json` via `upsertVisualCuratedTargetOverride`) e em `routine_reviews` via Pooler PostgreSQL IPv4 (`pg`), atualiza `curated-route-synonyms.json` (Camada 0.2) e remove o item curado de `pending-som-queue.json`.
- Atualizado `.mcp.json` na raiz mantendo `playwright` e adicionando `chrome-devtools` (`npx -y chrome-devtools-mcp@latest`) e `orion-audit` (`npx --prefix auditoria tsx auditoria/src/mcp-server.ts`), **sem** `@supabase/mcp-server-supabase`.

### 2.2. Etapa 2 — Worker Daemon Realtime (`auditoria/src/worker-daemon.ts` / `npm --prefix auditoria run worker:daemon`)
- Criada a classe `OrionRealtimeWorkerDaemon` em `auditoria/src/worker-daemon.ts`, que assina via `@supabase/supabase-js` eventos `postgres_changes` nas tabelas `routine_reviews` (`INSERT`/`UPDATE`), `runner_jobs`, `audit_jobs` e `routines`.
- **Debounce & Trava de Concorrência (`AsyncSemaphore(1)`):** eventos repetidos para a mesma rotina dentro da janela de debounce são coalescidos em uma única execução, e o semáforo unitário garante estritamente **1 job por vez**, impedindo disputa de sessão WildFly/Chromium.
- **Fluxo de Execução:** atualiza `human-reviews-cache.json` (`refreshHumanReviewsCache()`), executa `--routines <id> --headless --dry-run-mutations` (ou `writePreTriagedDddReport` para rotinas de hardware da Fase 3), atualiza `runner_jobs` / `governance_events` e sincroniza via `syncSingleRoutineToSupabase`.

### 2.3. Etapa 3 — Exportadores Pós-Aprovação (`auditoria/src/exporters.ts` + flags no `cli.ts`)
- **Exportador de Manual Limpo / Base de Ajuda (`--export-docs` / `exportManualDocs`):**
  - Gera em `auditoria/exports/manual-publicado/<modulo>/<slug>.md` (e `_indice.md`) versões limpas em Markdown (sem frontmatter interno `auditoria_ui`, sem callouts técnicos `> [!NOTE]`/`[!WARNING]`/`[!CAUTION]`/`[!TIP]` e sem a seção `#### Evolução da Reauditoria`), convertendo `[aqui vai a print "passo-NN.png"]` em links relativos para `.webp`.
  - Por padrão exporta rotinas com `status_governanca === 'aprovada'`; com `--include-unapproved`, exporta todas as rotinas validadas.
- **Gerador de Testes E2E Playwright (`--export-playwright` / `exportPlaywrightSpecs`):**
  - Gera em `auditoria/exports/playwright-e2e/<modulo>/<ID>.spec.ts` especificações `@playwright/test` executáveis com viewport `1440×900 @ DPR 1`, `zoom: 0.8`, rotas hash, navegação de menus, seletores estáveis e guarda de mutação (`process.env.ORION_E2E_ALLOW_MUTATIONS === 'true'`).

---

## 3. Verificação e Evidências

- **Testes unitários (`auditoria/src/__tests__/adr032-mcp-daemon-exporters.test.ts`):** 7 novos testes cobrindo `.mcp.json`, as 7 tools do `mcp-server.ts`, o `OrionRealtimeWorkerDaemon` (debounce + concorrência = 1) e os exportadores `--export-docs` e `--export-playwright`.
- **Checagem estrita de tipos:** `npx --prefix auditoria tsc -p auditoria/tsconfig.json --noEmit` com **0 erros**.
