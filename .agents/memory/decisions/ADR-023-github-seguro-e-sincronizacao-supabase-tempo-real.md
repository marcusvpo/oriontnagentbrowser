# ADR-023: Repositório Git/GitHub Seguro e Sincronização Write-Through + Supabase Realtime

* **Status:** Aceita e Vigente
* **Data:** 2026-11-16
* **Nota de Numeração:** Registrada sequencialmente como **ADR-023** porque a **ADR-022** já estava ocupada em disco por [`ADR-022-hook-de-tipagem-pos-edicao-e-testes-offline-de-alvos-implicitos.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/.agents/memory/decisions/ADR-022-hook-de-tipagem-pos-edicao-e-testes-offline-de-alvos-implicitos.md).
* **Revoga / Atualiza:** `ADR-010` (§2.3 Proibição de Comandos Git) e `ADR-018` / `ADR-021` (fluxo manual de `supabase:sync` em lote como padrão).

---

## 1. Contexto e Motivação

Com a Fase 2 (39 rotinas navegáveis / 50 rotinas nos módulos `acesso` e `config`) e a Fase 3 (118 rotinas em `firmas`, `selos`, `livros`, `certidoes` e `centrais`) 100% auditadas e validadas com 0 discrepâncias nos 8 invariantes matemáticos, duas restrições operacionais legadas precisavam ser superadas:

1. **Ausência de controle de versão remoto:** A proibição de comandos `git` (`ADR-010`) impedia histórico auditável, backup contínuo e colaboração segura em repositório privado no GitHub (`https://github.com/marcusvpo/oriontnagentbrowser.git`). Ao mesmo tempo, existiam credenciais de fallback em arquivos legados (`config.ts`, `execute-phase1.ts`, `generate-perfect-phase1.ts`, `.env.example`, `ADR-010`), URLs literais de homologação e sessões WildFly SSO em `auditoria/auth/`.
2. **Sincronização manual com o Supabase:** Até então, as execuções do motor (`executor.ts`, `hardware-pretriage.ts`) e as mutações do Orion Audit Console (`server.ts`) exigiam rodar `npm --prefix auditoria run supabase:sync` manualmente em lote ou não espelhavam edições de volta no `*-revisado.md` em disco, e o frontend dependia de polling periódico sem assinatura de `postgres_changes`.

---

## 2. Decisões Arquiteturais

### 2.1. Git / GitHub Privado com Blindagem Estrita de Segurança (Revoga ADR-010 §2.3)

* O repositório Git local passa a ser oficial na raiz do projeto, conectado ao remoto privado `https://github.com/marcusvpo/oriontnagentbrowser.git` (branch `main`).
* **Auditoria prévia de segredos:** Toda senha, credencial e URL literal de homologação foi removida do código-fonte (`config.ts`, `auth.ts`, `execute-phase1.ts`, `generate-perfect-phase1.ts`, `run-phase2-master.ts`, scripts auxiliares), dos arquivos `.env.example` e da documentação (`ADR-010`, `fase-01-poc-homologacao.md`, tokens JWT em `orion-tn-tickets/`). `config.ts` carrega `auditoria/.env` explicitamente via `fileURLToPath(import.meta.url)`, funcionando de qualquer `cwd`.
* **`.gitignore` blindado na raiz:** Bloqueia obrigatoriamente:
  * `auditoria/auth/` e `session-*.json` (sessões, cookies e tokens WildFly SSO)
  * `.env` e `.env.*` (liberando exclusivamente `!.env.example`)
  * `node_modules/`, `dist/`, `build/`, `.tanstack/`, `.wrangler/`, `Orion Audit Console/src/.generated/`, `*.log`
  * `auditoria/backups/`, `auditoria/cache/`, `auditoria/test-output/*.png`
  * `auditoria/rotinas/**/*.png` (prints `.png` pesadas ficam apenas localmente; versionam-se os `*-revisado.md` e `.webp`).
* **Regra permanente:** É terminantemente proibido commitar `auditoria/auth/`, `.env`, cookies, tokens SSO ou arquivos `.png`. Sempre verificar `git status` antes de `git commit`/`git push`.

### 2.2. Sincronização Write-Through por Rotina no Motor (`syncSingleRoutineToSupabase`)

* `auditoria/src/sync-supabase.ts` expõe `syncSingleRoutineToSupabase(routineId, options)` compartilhando a lógica de montagem de registros (`buildRoutineRecords`, `uploadScreenshots`) com a carga em lote.
* Correções estruturais incorporadas ao parser de sync:
  * Extração de passos revisados restrita à seção `#### Passo a passo...` (impedindo captura acidental dos itens numerados de `#### Roteiro Técnico para Execução Manual:`);
  * Extração de `descricao_revisada` diretamente do `*-revisado.md` (preservando edições humanas feitas no Console);
  * Fallback automático de `pngUrl` para `webpUrl` quando apenas `.webp` é enviado (`onlyWebp: true` no Write-Through) ou quando não há `.png` local;
  * Limpeza de passos órfãos (`step_number > stepsCount`) em reauditorias e preservação de `status_governanca` do Supabase frente a `governance.json` legado.
* **Execução automática e resiliente:** `executor.ts` (`executeRoutineAudit`) e `hardware-pretriage.ts` (`writePreTriagedDddReport`) chamam `syncSingleRoutineToSupabase` ao final de cada rotina concluída dentro de `try/catch` com log de aviso — falhas transitórias de rede nunca derrubam um lote.
* **Flag offline opcional:** `cli.ts` adiciona `--no-sync` (ou `ORION_NO_SYNC=true`) exclusivamente para testes offline pontuais. O comando em lote `npm --prefix auditoria run supabase:sync` fica reservado para carga inicial ou recuperação em massa.

### 2.3. Dupla Via na Governança (`server.ts` + `governance-disk.ts`)

* `auditoria/src/governance-disk.ts` aplica edições de descrição, edições de texto de passos e metadados de governança (`status_governanca`, `governanca_revisor`, `governanca_atualizado_em`, `governanca_comentario`, sem colidir com `auditoria_ui.status`) diretamente no `*-revisado.md` em disco, preservando marcadores `[aqui vai a print "..."]`, callouts, tooltips e notas de confronto semântico.
* Em `auditoria/src/server.ts`, todos os endpoints de mutação (`POST /api/rotinas/:id/aprovar`, `PUT /api/rotinas/:id/texto`, `POST /api/rotinas/:id/revisao`, `PUT|PATCH /api/revisoes/:reviewId`) e a conclusão real de `POST /api/rotinas/:id/reexecutar` / `/api/rotinas/reexecutar-lote` (que substitui a transição simulada por execução real serializada na lane `mutation`) gravam o `*-revisado.md` em disco e disparam `syncSingleRoutineToSupabase(id)` imediatamente.

### 2.4. Supabase Realtime no Orion Audit Console

* A migration `auditoria/supabase/migrations/004_supabase_realtime.sql` adiciona de forma idempotente as tabelas `routines`, `routine_steps`, `governance_events`, `runner_jobs` e `routine_reviews` à publication `supabase_realtime`.
* No frontend (`Orion Audit Console`), `src/lib/supabase.ts` inicializa o cliente browser-only com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (respeitando `VITE_USE_MOCK` e SSR), e `src/hooks/useSupabaseRealtime.ts` assina `postgres_changes` em todas as 5 tabelas, invalidando com debounce (200 ms) as queries `["rotinas"]`, `["revisoes"]` e `["rotina", id]` no TanStack Query.
* `RootComponent` (`src/routes/__root.tsx`) monta `<RealtimeBridge />` dentro de `<QueryClientProvider>`, `AppShell` exibe o indicador de status ao vivo e `index.tsx` / `fila.tsx` reduzem o polling para fallback de segurança (60s / 30s) quando o Realtime está ativo.

---

## 3. Resultados da Implantação e Verificação (2026-11-16)

* **GitHub:** Commit inicial `51f61b6` (`chore: baseline Fase 2 e Fase 3 auditadas (ADR-021)`, 1.398 arquivos versionados, zero arquivos de `auth/`, `.env` ou `*.png`) enviado para `origin/main`.
* **Migrations Supabase (`supabase:migrate`):** `001` a `004_supabase_realtime.sql` aplicadas; todas as 5 tabelas confirmadas na publication `supabase_realtime`.
* **Carga Inicial (`supabase:sync`):** 471 rotinas (`169` auditadas nas Fases 1, 2 e 3, incluindo as 7 pré-triadas `[DDD]` de hardware com `0` prints e `R-18.0` com `AUDIT-MOCK`), 2.838 passos (incluindo `subCapturas[]`), 172 eventos e 696 arquivos de print no bucket `audit-screenshots`.
* **Validação Ponta a Ponta:**
  * `auditoria`: `tsc --noEmit` = 0 erros; `npm --prefix auditoria test` = 28/28 testes passando; `verify-all-phase2-boxes.ts --all` (339 prints) e `--phase 3` (231 prints) = **0 discrepâncias**.
  * `Orion Audit Console`: `tsc --noEmit` = 0 erros; `vitest run` = 18/18 testes passando; `vite build` (client + SSR) = 0 erros.
  * **Teste ao vivo (Write-Through + Realtime):** Execução de `cli.ts --routine R-1.1 --dry-run-mutations --headless` sincronizou automaticamente `R-1.1` + 5 `.webp` no Supabase com reflexo imediato em `GET /api/rotinas/R-1.1`; teste de `POST /api/rotinas/R-1.1/aprovar` confirmou atualização em disco, persistência no Supabase e entrega de eventos `UPDATE` via WebSocket no canal `postgres_changes`.
