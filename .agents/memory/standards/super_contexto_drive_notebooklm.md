# Padrão: Super-Contexto GitHub → Google Drive → NotebookLM (ADR-034)

**Finalidade:** manter 5 Google Docs nativos sempre iguais ao empacotamento atual do repositório, para consulta no NotebookLM.

## 1. Comandos (raiz do repositório)

| Comando | O que faz |
| :--- | :--- |
| `npm run pack:context` | Roda os 5 `repomix` (`pack:memory`, `pack:engine`, `pack:engine2`, `pack:engine3`, `pack:console`) e grava em `.repomix-output/` (ignorado pelo Git). |
| `npm run check:context` | `node scripts/upload-to-drive.mjs --check`: valida configs (arquivos explícitos existem, 02a/02b/02c disjuntos, `LEGACY_EXCLUDED` ignorado) e mede cada pacote contra o limite. Offline, sem credenciais. |
| `npm run sync:notebook` | `pack:context` + upload via `drive.files.update` (exige as variáveis abaixo). |

## 2. Pacotes e limites

| Saída | Config | Variável de ambiente |
| :--- | :--- | :--- |
| `01-memoria-e-contratos.md` | `repomix.memory.config.json` | `GDRIVE_FILE_ID_MEMORY` |
| `02a-motor-nucleo.md` | `repomix.engine.config.json` | `GDRIVE_FILE_ID_ENGINE` |
| `02b-motor-operacao.md` | `repomix.engine2.config.json` | `GDRIVE_FILE_ID_ENGINE_2` |
| `02c-motor-periferia-e-scripts.md` | `repomix.engine3.config.json` | `GDRIVE_FILE_ID_ENGINE_3` |
| `03-console-e-testes.md` | `repomix.console.config.json` | `GDRIVE_FILE_ID_CONSOLE` |

- **Limite rígido por arquivo: 570.000 caracteres** (~260 páginas; acima de ~300 páginas o parser do NotebookLM estoura o timeout). Acima disso o script aborta antes de qualquer upload. **Meta operacional: < 450.000 caracteres por pacote.** Aviso a partir de **82% do teto (~467.000)** e de 450.000 palavras (NotebookLM: ~500.000 por fonte).
- Medição de 2026-11-17 após o desafogamento (ADR-034 §6):

| Pacote | Antes (caracteres) | Depois (aprox.) | % do teto | Conteúdo |
| :--- | :--- | :--- | :--- | :--- |
| 01 | 560.022 | ≈ 439 k | 77% | memória viva e governança (exclusivo) |
| 02a | 495.342 | ≈ 423 k | 74% | núcleo de localização/DOM |
| 02b | 463.868 | ≈ 436 k | 77% | operação + `types.ts` + `phase3-types.ts` + migrations SQL |
| 02c | 485.336 | ≈ 440 k | 77% | periferia de `auditoria/src` + scripts ativos |
| 03 | 524.384 | ≈ 428 k | 75% | Console + testes do motor |

- **Fora de todos os pacotes (continuam no repositório):** `auditoria/src/manifests/phase3-manifest.ts` (dados); `GEMINI.md` (espelho do `CLAUDE.md`), `.agents/memory/README.md`, `standards/design_system_siplan.md`, `standards/guia_comandos_claude_antigravity.md`, `.mcp.json`, `package.json`, `auditoria/package.json`; os 16 arquivos de `LEGACY_EXCLUDED` em `upload-to-drive.mjs` (13 scripts exploratórios sem importador, `execute-phase1/2`, `run-phase2-master.ts`); `scripts/dev-all.js`, `scripts/sync_openai_vector_store.py`, `scripts/antigravity-worker/test_sdk_worker.py`; no Console, `package.json`, `tsconfig.json`, `src/mocks/**`, `src/design-system/**` e `src/routes/*.preview.$.tsx`.

## 3. Variáveis de ambiente (somente nomes; nunca valores no repositório)

`GDRIVE_SERVICE_ACCOUNT_KEY` (JSON da Service Account; fallback `GOOGLE_APPLICATION_CREDENTIALS` com o caminho do arquivo), `GDRIVE_FILE_ID_MEMORY`, `GDRIVE_FILE_ID_ENGINE`, `GDRIVE_FILE_ID_ENGINE_2`, `GDRIVE_FILE_ID_ENGINE_3`, `GDRIVE_FILE_ID_CONSOLE` e, opcional, `GDRIVE_UPLOAD_MIME`. No GitHub: Repository Secrets com os mesmos nomes. Local: `.env` na raiz (ignorado pelo Git; modelo em `.env.example`). O carregamento do `.env` é opcional (`try/catch`), então o CI funciona só com `secrets`.

## 4. Regras

1. **Somente `drive.files.update`.** Nunca `files.create`: Service Account sem cota própria falha com `storageQuotaExceeded`. Os 5 Google Docs são criados antes, manualmente, e compartilhados como **Editor** com o e-mail da Service Account.
2. Nunca gravar chave, ID de documento, e-mail da Service Account ou IP interno em código, ADR, log versionado ou mensagem de commit (ADR-023/ADR-025). `.gitignore` bloqueia `.repomix-output/`, `credentials.json` e `service-account*.json`.
3. Motor em 3 pacotes: as listas explícitas ficam em `repomix.engine.config.json` (02a, `include`) e `repomix.engine2.config.json` (02b, `include`, com `types.ts`, `phase3-types.ts` e `supabase/**/*.sql`) e **também** em `repomix.engine3.config.json` (02c, `ignore.customPatterns`). Alterar os três juntos e rodar `npm run check:context`, que exige cada `auditoria/src/*.ts` em exatamente 1 pacote ou em `LEGACY_EXCLUDED`. Arquivo novo em `auditoria/src` cai automaticamente na periferia (02c); se ela passar de ~445k, mover arquivos para um pacote menos cheio. O 01 não pode incluir `auditoria/src/**` nem `auditoria/supabase/**`.
4. Estouro de limite: primeiro excluir peso morto (mocks, scaffold gerado, scripts legados sem importador), depois mover arquivos grandes do pacote cheio para um menos cheio; não usar `removeComments`, pois os comentários PT-BR registram o motivo das decisões.
   - **Glob com colchetes:** `[__component].preview.$.tsx` tem `[...]`, lido como classe de caracteres; ignore por `*.preview.$.tsx` e confira no pacote gerado que o arquivo sumiu.
5. Workflow: `.github/workflows/sync-notebook-context.yml` (`push` na `main` + `workflow_dispatch`, `concurrency: sync-notebook-context`). Primeiro run real deve ser manual para confirmar a conversão `text/markdown` → Google Doc.

## 5. Diagnóstico rápido

| Sintoma | Causa provável | Ação |
| :--- | :--- | :--- |
| HTTP 404 em um pacote | ID errado ou Doc não compartilhado | Conferir o secret e compartilhar como Editor com a Service Account (o script imprime o e-mail). |
| HTTP 403 `storageQuotaExceeded` | tentativa de criar arquivo / Doc inexistente | Criar o Doc antes; o script só atualiza. |
| `> 570.000 caracteres` | pacote cheio | Rebalancear listas dos configs. |
| aviso de 82% (~467.000) | pacote chegando ao teto | Antecipar o rebalanceamento (meta < 450.000). |
| `... ausente` | secret não cadastrado | Cadastrar o secret indicado. |
