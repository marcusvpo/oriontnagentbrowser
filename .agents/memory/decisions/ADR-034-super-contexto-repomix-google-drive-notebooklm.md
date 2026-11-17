# ADR-034: Super-Contexto Contínuo GitHub → Google Drive (NotebookLM) via `repomix`, Google Drive API v3 e GitHub Actions, em 5 Pacotes < 570.000 Caracteres

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada (implementação local validada; primeiro upload real depende do cadastro dos secrets no GitHub)  
> **Decisores:** Marcus (Product Owner) & Claude Code  
> **Relacionada a:** ADR-023 (GitHub seguro e blindagem de segredos), ADR-025 (segredos e IP interno só em `.env`), ADR-029 a ADR-033 (arquitetura incluída no pacote)  

---

## 1. Contexto

O NotebookLM precisa enxergar sempre a versão mais recente do repositório (`marcusvpo/oriontnagentbrowser`): regras (`CLAUDE.md`/`GEMINI.md`), ADRs, padrões, motor de auditoria, Orion Audit Console, testes e o orquestrador Python (ADR-033). Copiar arquivos à mão para o Drive gera divergência silenciosa. Requisitos:

1. **Automático** a cada `push` na `main`, sem credenciais no código;
2. **Idempotente**: o Google Doc mantém ID/URL, para que as fontes do NotebookLM continuem apontando para o mesmo documento;
3. **Compatível com Drive pessoal**: uma Service Account não tem cota de armazenamento própria, então criar arquivos (`files.create`) falha com HTTP 403 `storageQuotaExceeded`.

## 2. Decisão Arquitetural

### 2.1. Pipeline
`repomix` (Markdown, 4 configs) → `.repomix-output/*.md` (ignorado pelo Git) → `scripts/upload-to-drive.mjs` → `drive.files.update` em **Google Docs nativos pré-existentes** → fontes do NotebookLM. O workflow `.github/workflows/sync-notebook-context.yml` roda em `push` na `main` e em `workflow_dispatch`, com `concurrency: sync-notebook-context` (`cancel-in-progress`), Node 22, `permissions: contents: read` e `npm ci || npm install`.

### 2.2. Cinco pacotes (cada um < 570.000 caracteres)
O Google Docs aceita conversão até ~1,02 M de caracteres, mas o parser do NotebookLM estoura o timeout acima de ~300 páginas. Na importação real, os pacotes de ~558 k (232 págs) e ~524 k (276 págs) indexaram; os de ~666 k (346 págs) e ~773 k (423 págs) falharam. O teto rígido passou a **570.000 caracteres** (~260 páginas) e o motor (`auditoria/src` + `scripts/`, ~1,44 M de caracteres) foi dividido em **3 pacotes** (02a/02b/02c), totalizando **5 Google Docs** (os pacotes 01 e 03 ficaram intactos):

| Pacote | Config → saída | Variável de ambiente (ID do Doc) | Conteúdo |
| :--- | :--- | :--- | :--- |
| 1 | `repomix.memory.config.json` → `01-memoria-e-contratos.md` | `GDRIVE_FILE_ID_MEMORY` | `CLAUDE.md`, `GEMINI.md`, `.mcp.json`, `package.json`, `.agents/memory/**`, `.agents/skills/**`, `auditoria/package.json`, `auditoria/tsconfig.json`, `auditoria/src/types.ts`, `auditoria/src/manifests/phase3-types.ts`, migrations SQL |
| 2a | `repomix.engine.config.json` → `02a-motor-nucleo.md` | `GDRIVE_FILE_ID_ENGINE` | núcleo (lista explícita): `executor`, `smart-locator`, `dom-geometry`, `browser`, `menu-path`, `stateful-step-engine`, `reveal-explorer`, `rbac`, `annotator`, `auth` (~495 k) |
| 2b | `repomix.engine2.config.json` → `02b-motor-operacao.md` | `GDRIVE_FILE_ID_ENGINE_2` | operação (lista explícita): `run-phase2-master`, `server`, `mcp-server`, `sync-supabase`, `invariants`, `att-screen-advisor`, `human-review-rag`, `report`, `firmas-interactive`, `cli`, `exporters`, `verify-all-phase2-boxes`, `worker-daemon`, `worker-pool`, `evidence`, `semantic-compatibility`, `step-scope`, `navigation-guard` (~464 k) |
| 2c | `repomix.engine3.config.json` → `02c-motor-periferia-e-scripts.md` | `GDRIVE_FILE_ID_ENGINE_3` | todo o restante de `auditoria/src/**/*.ts` (arquivos novos caem aqui automaticamente; exclui 2a, 2b, `types.ts`, testes e manifestos) + `scripts/**` (~485 k, folga para crescer até ~540 k) |
| 3 | `repomix.console.config.json` → `03-console-e-testes.md` | `GDRIVE_FILE_ID_CONSOLE` | `Orion Audit Console` (`src/**/*.ts(x)`, inclusive testes) + `auditoria/src/__tests__/**` |

- `auditoria/src/manifests/phase3-manifest.ts` (≈340 KB, apenas dados declarativos) fica **fora** do pacote; `phase3-types.ts` entra no pacote 1.
- Exclusões pesadas comuns: `node_modules`, `dist`, `build`, `auditoria/{rotinas,backup,backups,cache,auth,exports,design system}`, `kb/`, `rotinas/`, transcrições e contextos brutos, `*_corrigido.md`, lockfiles, binários (`webp/png/jpg/ico/pdf/zip`). `useGitignore: true` e a verificação de segredos do repomix (secretlint) permanecem ligadas.
- A lista do núcleo aparece em dois configs (`include` no pacote 2, `ignore` no pacote 3). `scripts/upload-to-drive.mjs --check` valida a consistência (arquivo renomeado, duplicidade entre pacotes) e o tamanho de cada saída.

### 2.3. Upload (`scripts/upload-to-drive.mjs`)
- **Somente `drive.files.update`** (nunca `files.create`), com `supportsAllDrives`, `media.mimeType = text/markdown` (fallback único para `text/plain` se o Drive recusar a conversão; `GDRIVE_UPLOAD_MIME` sobrescreve) e `files.get` prévio para conferir tipo, lixeira e permissão de edição.
- **Validação antes de qualquer envio:** mede KB, caracteres e palavras de cada pacote; pacote acima de 570.000 caracteres ou ID ausente aborta **antes** do primeiro upload (evita deixar os 5 Docs dessincronizados); o `--check` também exige que `02a.include`, `02b.include` e `02c` sejam 100% disjuntos e cubram todo `auditoria/src/*.ts` (exceto `types.ts`, do pacote 01); aviso acima de 450.000 palavras (limite de ~500.000 por fonte do NotebookLM) e acima de 90% do limite de caracteres.
- **Autenticação:** `GDRIVE_SERVICE_ACCOUNT_KEY` (JSON da Service Account; aceita base64) com fallback para `GOOGLE_APPLICATION_CREDENTIALS` (caminho local). Escopo `https://www.googleapis.com/auth/drive`. A chave nunca é impressa.
- **Erros orientativos:** HTTP 403/404 e `storageQuotaExceeded` explicam que o Doc deve existir previamente e estar compartilhado como **Editor** com a Service Account; 429/5xx têm retry com backoff; uploads são sequenciais.
- **`.env` local opcional:** `process.loadEnvFile` fica dentro de `try/catch`, pois no GitHub Actions as variáveis vêm exclusivamente do ambiente (`secrets`) e o arquivo não existe (`ENOENT`).
- `--check` roda offline (sem rede e sem credenciais).

### 2.4. Segredos (apenas nomes; nenhum valor ou ID real neste repositório)
Repository Secrets no GitHub e, se necessário, `.env` local ignorado pelo Git: `GDRIVE_SERVICE_ACCOUNT_KEY`, `GDRIVE_FILE_ID_MEMORY`, `GDRIVE_FILE_ID_ENGINE`, `GDRIVE_FILE_ID_ENGINE_2`, `GDRIVE_FILE_ID_ENGINE_3`, `GDRIVE_FILE_ID_CONSOLE`. O `.env.example` da raiz contém só placeholders. `.gitignore` acrescenta `.repomix-output/`, `credentials.json` e `service-account*.json` (ADR-023).

## 3. Consequências

- **Positivas:** o NotebookLM acompanha a `main` sem intervenção; URLs dos Docs estáveis; falhas de tamanho/ID/permissão aparecem no CI com instrução de correção; nada de credencial no código.
- **Custos/riscos:** (i) o motor cresce e os pacotes 2a/2b/2c e o 01 (98% do teto) podem estourar, caso em que se rebalanceiam as listas; (ii) a aceitação de `text/markdown` na conversão para Doc só é comprovada no primeiro `workflow_dispatch` real (há fallback para `text/plain`); (iii) cada `push` na `main` dispara o job (cancelamento de execuções antigas via `concurrency`).
- **Manutenção:** ao criar/renomear arquivos do núcleo, atualizar `repomix.engine.config.json`, `repomix.engine2.config.json` e `repomix.engine3.config.json` juntos e rodar `npm run check:context`.

## 4. Verificação (2026-11-17)
`npm run pack:context` gerou os 4 pacotes (558 k, 666 k, 773 k e 524 k caracteres; todos < 950 k), com ADR-029 a ADR-033, `mine-att-clusters.ts`, `route-crawler.ts`, `agy-client.ts`, `worker-daemon.ts`, `exporters.ts`, `curate_som_sdk.py` e migrations 001–005 presentes; sem `kb/`, `auditoria/cache`, `auditoria/rotinas`, imagens, lockfiles ou manifesto de dados; sem sobreposição entre pacotes; verificação de segredos do repomix limpa. `node --check scripts/upload-to-drive.mjs`, `npm run check:context` e `tsc --noEmit` (auditoria) com código 0.

## 5. Rebalanceamento para o parser do NotebookLM (2026-11-17)
Medição após o rebalanceamento: 558 k (01), 495 k (02a), 464 k (02b), 485 k (02c) e 524 k (03) caracteres, todos < 570 k. `npm run check:context` e `tsc --noEmit` (auditoria) com código 0. Exige o secret/variável `GDRIVE_FILE_ID_ENGINE_3` (5º Google Doc nativo, compartilhado como Editor com a Service Account); o Doc do antigo `02b-motor-periferia-e-scripts` (`GDRIVE_FILE_ID_ENGINE_2`) passa a receber o pacote 02b (operação).
