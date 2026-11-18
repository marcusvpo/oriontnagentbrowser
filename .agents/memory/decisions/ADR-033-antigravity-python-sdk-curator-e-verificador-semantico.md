# ADR-033: Orquestrador Satélite com Google Antigravity Python SDK (v0.1.23) para Curadoria Visual Set-of-Mark em Lote e Verificação Semântica Multimodal Pós-Lote

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-012, ADR-015, ADR-017, ADR-023, ADR-027, ADR-029, ADR-030, ADR-031, ADR-032  

---

## 1. Contexto

Na `ADR-031`, implementamos o pipeline visual híbrido Set-of-Mark (SoM) efêmero em memória com Sharp e o modo diferido (`--visual-mode defer`), que enfileira pendências visuais em `auditoria/cache/pending-som-queue.json` (e `auditoria/cache/pending-som/`) durante a execução de grandes lotes (`--phase`, `--reaudit-pending`). Para processar essas pendências pós-lote, o script `curate-pending-som.ts` invocava o binário `agy.exe` via subprocesso CLI no Windows com pipe `STDIN`.

Com a disponibilidade do **Google Antigravity Python SDK (`google-antigravity>=0.1.23`)**, abriu-se a oportunidade de substituir o wrapper de subprocesso CLI pós-lote por um cliente assíncrono nativo em Python operando como **ferramenta satélite**, mantendo o motor Playwright/TypeScript (`auditoria/src/`) 100% intocado e conquistando três avanços estruturais:

1. **Validação Estrita via Pydantic (`Structured Outputs`):** Uso nativo de `LocalAgentConfig(response_schema=...)` e `await response.structured_output()`, garantindo retorno tipado exato sem falhas de parsing JSON ou escapes de caracteres em `cmd.exe`/PowerShell no Windows.
2. **Eliminação do Overhead de Subprocessos por Imagem:** Comunicação direta e assíncrona com o runtime do Antigravity/Gemini (`gemini-4-hydrogen-xhigh` com fallback automático para `gemini-4-hydrogen-high`), eliminando o cold start repetitivo de processo CLI a cada imagem da fila.
3. **Verificação Semântica Multimodal Pós-Lote (`semantic_visual_verifier.py`):** Camada de auditoria cruzada pós-lote que inspeciona os relatórios `*-revisado.md` com status `validado_com_ajustes` e avalia multimodalmente se a moldura Carmesim Siplan (`#ad0505`) desenhada em passos auto-curados corresponde de fato à intenção semântica do texto do passo.

---

## 2. Decisão Arquitetural

### 2.1. Isolamento Arquitetural ("Zero Acoplamento no Loop do Navegador")
- O motor de automação e geometria em `auditoria/src/` (Playwright/`agent-browser`, `BrowserWorkerPool`, `dom-geometry.ts`, `smart-locator.ts` e o renderizador `Sharp` em `annotator.ts`) **permanece 100% em TypeScript (Node.js v22)**, sem nenhuma alteração ou dependência Python no loop quente de captura.
- O pacote Python reside isolado em `scripts/antigravity-worker/` e atua estritamente como **orquestrador satélite pós-lote** para curadoria visual Set-of-Mark e auditoria semântica multimodal.
- **Isolamento Estrito de Credenciais Supabase:** `scripts/antigravity-worker/config.py` lê exclusivamente de `auditoria/.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_SECRET_KEY`, `DATABASE_URL`/`SUPABASE_DB_URL` do IPv4 Pooler), sem depender de configurações globais externas.

### 2.2. Etapa 1 — Ambiente e Configuração Compartilhada (`scripts/antigravity-worker/`)
- Criado `scripts/antigravity-worker/requirements.txt` especificando `google-antigravity>=0.1.23`, `pydantic>=2.0`, `python-dotenv>=1.0`, `psycopg2-binary>=2.9` e `PyYAML>=6.0`.
- Criado `scripts/antigravity-worker/config.py`:
  - Carrega `auditoria/.env` e expõe `OrionWorkerSettings` (`load_worker_settings()`) e `create_postgres_connection()` para acesso ao Pooler PostgreSQL IPv4;
  - Define o modelo primário `gemini-4-hydrogen-xhigh` (`Gemini 4 Hydrogen Extra`) com fallback automático para `gemini-4-hydrogen-high` em `generate_structured_multimodal()`;
  - Configura `LocalAgentConfig` do SDK `google.antigravity` com `response_schema` acoplado diretamente aos modelos Pydantic e ferramentas restritas a `BuiltinTools.read_only()`.

### 2.3. Etapa 2 — Curador em Lote de Set-of-Mark (`scripts/antigravity-worker/curate_som_sdk.py`)
- Define o schema Pydantic estrito:
  ```python
  class SomTargetDecision(BaseModel):
      tag_id: int = Field(description="O número da tag [N] identificada sobre o elemento correto")
      confidence: float = Field(ge=0.0, le=1.0, description="Nível de confiança da identificação")
      justification: str = Field(description="Breve explicação da escolha confrontando rótulo/ícone com o passo")
      actual_target_name: str = Field(description="Nome ou texto do elemento identificado")
  ```
- Lê as entradas pendentes em `auditoria/cache/pending-som-queue.json` (e `auditoria/cache/pending-som/pending-som-queue.json`) e as respectivas imagens demarcadas com tags `[1]..[N]`.
- Aplica a trava semântica da **ADR-027 / ADR-015 / ADR-024**:
  - Rejeita decisões com `confidence < 0.70` ou `tag_id` inválido;
  - Aplica `validate_som_candidate_semantics()` bloqueando elementos da zona de navegação em passos `content`, busca global `CTRL + B`, colisões intra-palavra (`Autenticidade` vs `Cidade`) e incompatibilidades de papel (`Novo cartão +` em passos de lançamento de serviço).
- Para cada decisão aprovada:
  - Atualiza `auditoria/cache/human-reviews-cache.json` (Camada 0.1 RAG) e opcionalmente `routine_reviews` via Pooler IPv4;
  - Atualiza `auditoria/cache/curated-route-synonyms.json` (Camada 0.2 — sinônimos por rota);
  - Remove o item curado de `pending-som-queue.json`, permitindo resolução determinística em **2 ms (0 tokens)** nas próximas execuções.
- Suporta flags CLI: `--limit N`, `--dry-run`, `--verbose` e `--sync-supabase`.

### 2.4. Etapa 3 — Verificador Semântico Multimodal Pós-Lote (`scripts/antigravity-worker/semantic_visual_verifier.py`)
- Define o schema Pydantic de auditoria semântica:
  ```python
  class SemanticAuditResult(BaseModel):
      routine_id: str
      step_number: int
      semantic_match: bool = Field(description="True se a caixa demarcada corresponde ao que o passo solicita")
      visual_confidence: float = Field(ge=0.0, le=1.0)
      discrepancy_reason: Optional[str] = Field(default=None, description="Motivo caso haja divergência visual ou semântica")
  ```
- Varre os relatórios `*-revisado.md` com `status: validado_com_ajustes` e passos listados em `auditoria_ui.auto_cura.divergencias_detectadas`.
- Carrega o print final anotado (`passo-NN.webp` ou `passo-NN.png`) junto com o texto do passo e o histórico da divergência, solicitando ao modelo multimodal uma verificação cruzada estrita sobre a demarcação em Carmesim Siplan (`#ad0505`).
- Emite o relatório consolidado em `auditoria/cache/semantic-audit-report.json`.
- Quando `visual_confidence < 0.85` ou `semantic_match == False`, sinaliza automaticamente a rotina para revisão prioritária (`status_governanca = 'revisao_solicitada'`) em `auditoria/cache/governance.json` (e opcionalmente no Supabase via `--sync-supabase`), prevenindo falsos-positivos semânticos no Orion Audit Console.

### 2.5. Etapa 4 — Integração no `auditoria/package.json`
- Adicionados os scripts npm convenientes em `auditoria/package.json`:
  - `"curate:sdk": "python ../scripts/antigravity-worker/curate_som_sdk.py"`
  - `"verify:semantics": "python ../scripts/antigravity-worker/semantic_visual_verifier.py"`

---

## 3. Verificação e Evidências

- **Testes Unitários Python (`scripts/antigravity-worker/test_sdk_worker.py`):** 7/7 testes aprovados validando:
  - Schemas Pydantic `SomTargetDecision` e `SemanticAuditResult` (incluindo rejeição de `confidence` fora de `[0.0, 1.0]`);
  - Inicialização de `LocalAgentConfig` com `response_schema` JSON Schema gerado pelo Pydantic e fallback automático de `gemini-4-hydrogen-xhigh` para `gemini-4-hydrogen-high`;
  - Tratamento de fila vazia (`pending-som-queue.json`);
  - Fluxo completo de curadoria com aprovação (`confidence >= 0.70`), rejeição (`confidence < 0.70`) e veto semântico ADR-027 (`Novo cartão +` e colisão intra-palavra `Autenticidade` vs `Cidade`);
  - Fluxo completo do verificador semântico pós-lote gerando `semantic-audit-report.json` e sinalizando revisão prioritária quando `visual_confidence < 0.85` ou `semantic_match == False`.
- **Integridade do Ecossistema TypeScript (`auditoria/`):**
  - `npx --prefix auditoria tsc -p auditoria/tsconfig.json --noEmit`: **0 erros**.
  - `npm --prefix auditoria test`: **188/188 testes aprovados em 46 suítes**.


---

## Emenda 2026-11-18 — Autenticação somente por sessão local (sem chave de API)

- **Decisão:** o worker Python **não lê** `GEMINI_API_KEY` nem `GOOGLE_API_KEY` e não passa `api_key` ao `LocalAgentConfig` (`config.py`: campo `gemini_api_key` removido). A autenticação do SDK é exclusivamente a **sessão local autenticada do Antigravity** (mesma conta do CLI `agy`), sem custo de API. `auditoria/.env` continua fonte das credenciais do Supabase e dos modelos (`ORION_AGY_PRIMARY_MODEL`/`ORION_AGY_FALLBACK_MODEL`).
- **Salvaguarda:** se `GEMINI_API_KEY`/`GOOGLE_API_KEY` existir no ambiente, `load_worker_settings` emite aviso (o SDK as lê por conta própria e passaria a cobrar por uso). Sem sessão autenticada, o SDK falha com "A Gemini API key is required"; `config.py` converte em mensagem acionável (*autentique a sessão local; este worker não usa chave de API*).
- **Fila:** falha de inferência do SDK **não** rejeita mais o item (`Outcome: pending_error`, contador `inference_errors`, item segue `pending`). Um run sem sessão tinha marcado os 78 itens como `rejected`, o que bloqueou o `visual:curate` até a fila ser restaurada.
- **Pendência operacional:** `curate:sdk` e `verify:semantics` só rodam depois de o usuário autenticar a sessão local do SDK. A curadoria pós-lote da Camada 2C já foi feita pelo `agy` (`visual:curate`, ver emenda da ADR-031).
- **Verificação:** `test_sdk_worker.py` 7/7; `auditoria` 188/188 testes e `tsc` limpo; Console 39/39 testes e build ok.
