# ADR-036: Orion Audit Console V3 — Plataforma Pública na Vercel, Desacoplamento Total do Motor Local e Ciclo Manual de Exportação & Ingestão de Revisões

* **Status:** Aceita e Implementada
* **Data:** 2026-11-19
* **Decisores:** Marcus (Product Owner) & Antigravity
* **Relacionada a:** ADR-023, ADR-024, ADR-029, ADR-032, ADR-035

---

## 1. Contexto e Motivação

Para escalar a validação das 471 rotinas com apoio do **SD** e da **equipe de Produtos**, o **Orion Audit Console** precisava tornar-se acessível publicamente pela **Vercel** (`https://orionaudit.vercel.app`), vinculado ao GitHub (`marcusvpo/oriontnagentbrowser`), mantendo sincronização ao vivo com as execuções do motor (prints `.webp`, comparativos *Manual Original × Texto Revisado*, Raio-X `[ATT]`, etapas externas `[CCC]` e revisões humanas).

Ao mesmo tempo, decidiu-se **desacoplar totalmente a plataforma web do motor local**:
- O motor (`agent-browser`, Chromium, VPN da Siplan, Antigravity / Claude Code) permanece 100% local e acionado apenas manualmente pelo operador.
- A plataforma web deixa de exibir botões/telas operacionais do runner (`Reexecutar`, `Fila do Runner`, `READ_ONLY`/`MUTATION`, `workerId`) e passa a operar como uma **Central de Curadoria, Auditoria e Geração de Conhecimento**.
- As revisões humanas não acionam nada automaticamente no motor: elas são **exportadas em massa** em pacote estruturado (`.md` ou `.json`) para análise profunda no Antigravity, com marcação explícita na plataforma das revisões e rotinas já **"Ingeridas pelo agente"**, destaque visual por cor e **popup de aviso** caso alguém tente editar ou revisar novamente uma rotina já ingerida.

---

## 2. Decisões Arquiteturais

### 2.1. Banco de Dados Supabase — Migration `006_review_ingestion_lifecycle.sql`
- Criada [`auditoria/supabase/migrations/006_review_ingestion_lifecycle.sql`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/supabase/migrations/006_review_ingestion_lifecycle.sql) (idempotente e aplicada via `supabase:migrate`):
  - Nova tabela `public.review_export_batches` (rastreabilidade dos lotes exportados: `id`, `operador`, `formato`, `nota`, `review_ids`, `routine_ids`, `total_revisoes`, `total_rotinas`, `criado_em`), com RLS de leitura pública e inclusão na publication `supabase_realtime`.
  - Novas colunas em `public.routine_reviews`: `consumida_pelo_agente`, `consumida_em`, `consumida_por`, `lote_exportacao_id`, `versao_consumida`.
  - Novo evento `revisao_ingerida_agente` no CHECK de `public.governance_events`.
- O estado de ingestão de cada rotina é calculado diretamente sobre `routine_reviews` (`sem_revisoes` | `pendente_exportacao` | `ingerida_pelo_agente` + detecção automática de `temNovaRevisaoPosIngestao` quando `versao > versao_consumida`), impedindo qualquer perda de estado quando `sync-supabase.ts` atualiza `routines`.

### 2.2. Arquitetura Vercel Serverless na Raiz (`Root Directory = ./`)
- [`Orion Audit Console/vite.config.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/Orion%20Audit%20Console/vite.config.ts): desativado `@cloudflare/vite-plugin` no build padrão (restrito a `DEPLOY_TARGET=cloudflare`) e ativado `tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index.html" } } })`, gerando SPA estática em `Orion Audit Console/dist/client/index.html`.
- [`vercel.json`](file:///d:/marcu/Videos/OrionTN/OrionTN/vercel.json) + [`.vercelignore`](file:///d:/marcu/Videos/OrionTN/OrionTN/.vercelignore) na raiz do repositório: a Vercel rejeita espaços no nome interno da Serverless Function (`Orion Audit Console/api/index.js`). Mantendo `vercel.json` e `api/` na raiz (`Root Directory = ./`), a função é publicada como `api/index.js` (sem espaços), o `installCommand` instala `@supabase/supabase-js` na raiz (`--omit=dev`) + dependências do frontend, o `buildCommand` executa `npm run build --prefix "Orion Audit Console"`, o `outputDirectory` aponta para `Orion Audit Console/dist/client`, e os rewrites mapeiam `/api/:path*` → `/api/index?__path=:path*` e fallback SPA → `/index.html`.
- [`api/index.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/api/index.ts), [`api/_lib/supabaseApi.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/api/_lib/supabaseApi.ts) e [`api/_lib/exportFormat.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/api/_lib/exportFormat.ts): API 100% serverless usando apenas `@supabase/supabase-js` (sem `fs`, sem `spawn`, sem dependência de `auditoria/`).
- [`Orion Audit Console/src/services/api.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/Orion%20Audit%20Console/src/services/api.ts): em produção (`import.meta.env.PROD`), `USE_MOCK` assume `false` e `API_BASE_URL` assume `""` (mesmo domínio `/api/*`).
- [`auditoria/src/server.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/server.ts) + [`auditoria/src/review-export.ts`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/src/review-export.ts): mantidos em 100% de paridade para desenvolvimento local (`npm run dev`), com acionamento do motor (`spawn`/`reexecutar`) removido (retorna `410 Gone`) e sem atualização automática do RAG em disco ao salvar revisões.

### 2.3. UX Minimalista Focada no Humano & Ciclo de Ingestão
- **Remoção de ruído de motor/runner:** removidos `src/routes/fila.tsx`, `ReexecuteDialog.tsx`, `RunnerBadge.tsx`, `WorkloadChip.tsx` e `WorkloadDonut.tsx`.
- **Mapa Humano de Curadoria (6 estágios mutuamente exclusivos somando 100% das 471 rotinas):**
  1. `aprovadas_kb` — Aprovadas p/ Base KB (verde)
  2. `ingeridas_agente` — Ingeridas pelo agente (violeta `--color-ingested: #a78bfa`)
  3. `revisao_pendente` — Revisão pendente p/ agente (carmesim)
  4. `apoio_humano` — Precisam de apoio humano (`[ATT]`/`[CCC]`/`[DDD]`/`[XRX]` sem revisão, âmbar)
  5. `prontas_conferencia` — Prontas p/ conferência (validadas/auto-curadas aguardando aprovação)
  6. `nao_auditadas` — Não auditadas
- **Exportação em Massa (`ExportReviewsModal.tsx` + `POST /api/revisoes/exportar`):** gera arquivo `.md` enriquecido (metadados do lote, índice, bloqueio, Raio-X `[ATT]`, revisões humanas e passos Original × Revisado) ou `.json`, carimbando as revisões/rotinas como ingeridas e mantendo histórico em *Lotes exportados* com re-download.
- **Proteção Visual & Popup (`IngestionBadge.tsx`, `IngestedRoutineBanner.tsx`, `IngestedRoutineWarningModal.tsx`):** destaque violeta em badges, linhas da tabela, cards de revisão e banner do Estúdio, além de popup obrigatório de confirmação ao tentar editar texto, registrar nova revisão ou editar revisão de rotina já ingerida pelo agente.

---

## 3. Verificação e Evidências (2026-11-19)
- **Supabase Migration:** `npm --prefix auditoria run supabase:migrate` aplicou `001` a `006` com sucesso (tabela `review_export_batches` criada e colunas em `routine_reviews` adicionadas).
- **Smoke Test da Vercel Serverless API (`api/index.ts`) contra o Supabase real:** `/api/health` (`200`), rewrite `/api/index?__path=health` (`200`), `/api/rotinas` (`471` rotinas com partição exata `0 + 0 + 9 + 137 + 23 + 302 = 471`), `/api/revisoes` (`9` revisões pendentes) e `/api/revisoes/exportar` em modo leitura (`31.995` caracteres `.md`).
- **Testes Unitários & Tipagem:**
  - `Orion Audit Console`: `vitest run` **46/46** passando; `tsc --noEmit` **0 erros** (incluindo `api/**/*.ts`); `vite build` gerando `dist/client/index.html` limpo.
  - `auditoria`: `npm --prefix auditoria test` **227/227** passando; `tsc --noEmit` **0 erros**.
- **Inspeção Visual ao Vivo (`1440×900`):** validadas todas as 5 rotas (`/`, `/rotinas`, `/rotinas/R-1.1`, `/revisoes` + modal de exportação, `/configuracoes`) com 0 erros de console/rede e carregamento de prints `.webp` do Supabase Storage.
