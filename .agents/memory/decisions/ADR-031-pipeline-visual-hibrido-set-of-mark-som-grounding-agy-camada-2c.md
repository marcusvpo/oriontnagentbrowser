# ADR-031: Pipeline Visual Híbrido Set-of-Mark (SoM) em Memória com Sharp + Visual Grounding Multimodal via Antigravity CLI (`agy`) como Camada 2C

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Antigravity  
> **Relacionada a:** ADR-007, ADR-009, ADR-011, ADR-012, ADR-014, ADR-015, ADR-017, ADR-027, ADR-028, ADR-029, ADR-030  

---

## 1. Contexto

O motor determinístico de auditoria (`auditoria/src/`) resolve >95% dos passos em ~2 ms com **0 tokens** através das Camadas 0 (Rota de Menu Canônica + Profundidade), 0.1 (RAG Soberano de Revisões Humanas), 0.2 (Sinônimos por Rota), 0.5 (Reauditoria Contextual), 1 (Geometria Direta DOM + Deep Shadow DOM/Iframes + Bindings Angular), 1.5 (Ações Icônicas de Grade) e 2A (Árvore de Acessibilidade + Sørensen–Dice).

Entretanto, restavam dois cenários de fronteira nos quais nem a introspecção textual nem a Camada 2B sobre a Árvore de Acessibilidade bastam:
1. **Controles puramente icônicos sem `title`/`aria-label`/binding identificável e toolbars customizadas**;
2. **Sub-portais externos (`[CCC]`), widgets em `<canvas>` ou iframes cross-origin (OOPIF)** onde a estrutura textual é opaca, mas a evidência visual na tela `1440×900` é inequívoca.

Adicionalmente, era necessário aposentar qualquer dependência de chaves externas (`OPENAI_API_KEY` ou `claude -p`) na Camada 2B/2C, unificando toda inferência de fallback exclusivamente no binário local **Antigravity CLI (`agy`)** configurado em **`Gemini 4 Hydrogen Extra`**, sem abrir mão da medição real via `getBoundingClientRect()`, do Veto Semântico Intenção × Papel (`ADR-027`) e da Regra da Evidência Estrita (`ADR-017`).

---

## 2. Decisão Arquitetural

### 2.1. Etapa 1 — Renderizador Set-of-Mark (SoM) Efêmero em Memória (`auditoria/src/annotator.ts`)
- Criados `renderSetOfMarkOverlay(screenshotBuffer: Buffer, candidates: Array<{ id: number; box: BoundingBox }>): Promise<Buffer>` e `computeSetOfMarkTagPlacement(...)` usando **Sharp**.
- Opera **100% em buffer de memória** (jamais grava em disco na pasta da rotina nem polui `passo-NN.png`).
- Desenha até **45 candidatos interativos** (`MAX_SOM_CANDIDATES = 45`) visíveis na zona do passo sobre o canvas `1440×900`, com moldura tracejada de alto contraste (`#FF0055`) e tags numeradas `[1]..[N]` (`#111111` com texto e borda `#FFD600`).
- **Algoritmo de Deslocamento Anti-Centro:** `computeSetOfMarkTagPlacement` avalia posições cardinais externas e diagonais ao redor da caixa do alvo, aplicando penalidade absoluta se a tag cobrir o ponto central `(cx, cy)` do próprio elemento e minimizando sobreposição com tags vizinhas.

### 2.2. Etapa 2A — Cliente Exclusivo Antigravity CLI (`auditoria/src/agy-client.ts`)
- **Provedor Único (Zero APIs Externas):** `OPENAI_API_KEY` e `claude -p` estão vedados. Toda inferência de fallback (Camada 2B textual e Camada 2C visual) utiliza exclusivamente o CLI local `agy` (`agy.exe`) configurado em **`Gemini 4 Hydrogen Extra`** (`--print= --input-format stream-json --model gemini-4-hydrogen-xhigh --effort xhigh --output-format stream-json --disable-slash-commands`; ver **Emenda 2026-11-18** ao final).
- **Protocolo Seguro no Windows:**
  - Envia o prompt obrigatoriamente via **`STDIN`** (`child.stdin`) para eliminar o limite de caracteres do `cmd.exe` (ADR-014), com timeout configurável (padrão `45s`, `--print-timeout 45s`).
  - Protege todas as chamadas com o singleton **`agyInferenceSemaphore = new AsyncSemaphore(1)`**, impedindo disputa de sessão entre múltiplos workers do `BrowserWorkerPool`.
  - Na Camada 2C (`withEphemeralSomImage`), grava o buffer Sharp em `auditoria/cache/som-worker-${workerId}-${Date.now()}.png`, anexa `--dangerously-skip-permissions --add-dir` e `@<caminho>` no STDIN, e **remove obrigatoriamente o arquivo temporário no bloco `finally`**.
  - **Degradação Graciosa:** timeout, erro de parse JSON ou limite de cota retornam `null` sem lançar exceção fatal, permitindo que a rotina siga normalmente para o Consultor Propositivo de Tela `[ATT]` (`att-screen-advisor.ts`).

### 2.3. Etapa 2B/2C — Pipeline Visual Híbrido no `smart-locator.ts` e Modos `live | defer`
- **Sub-camada 2B (`resolveViaLLMOnAccessibilityTree`):** migrada para `invokeAgyJson` (`agy` com `Gemini 4 Hydrogen Extra`) sobre os 40 nós podados da ADR-030.
- **Sub-camada 2C (`resolveViaSetOfMark2C` + `resolveViaVisualGrounding2C`):**
  1. **2C-SoM (Preferencial):** `collectInteractiveSomCandidates` coleta até 45 elementos interativos visíveis na zona do passo (`zonePolicy`), carimba `data-orion-som-id="1..N"`, gera o overlay SoM em memória com Sharp e solicita ao `agy` `{"tagId": number | null, "confidence": number, "reason": string}` (mínimo `0.68`). O candidato escolhido passa pelo **Veto Semântico Pós-VLM** (`validateVisualCandidateSemantics`: `forbiddenCandidateReason`, Filtro de Zona Semântica e `evaluateSemanticCompatibility` da ADR-027) e só então tem sua geometria real medida ao vivo no DOM (`client.getDOMGeometry(['[data-orion-som-id="K"]'])`), produzindo `resolutionLayer: 'visual_som_fallback'`.
  2. **2C-Grounding (Fallback para Canvas / OOPIF):** envia a captura limpa `1440×900` ao `agy`, recebe coordenadas normalizadas `[0..1000]` (`{"x": number | null, "y": number | null, "confidence": number, "reason": string}`), converte para pixels via `normalizedPointToViewportPx`, ancora no DOM via `document.elementFromPoint(px, py)` com descida recursiva em Open Shadow DOM e iframes (`buildAnchorVisualPointScript`), aplica o Veto Semântico Pós-VLM e mede `getBoundingClientRect()` real no DOM (`resolutionLayer: 'visual_grounding_fallback'`).
- **Dois Modos de Operação (`--visual-mode live | defer` em `cli.ts` / `agy-client.ts`):**
  - **`live` (padrão em `--routines` e `--routine`):** aciona `agy` em tempo real quando as Camadas 0–2A falham.
  - **`defer` (padrão em `--phase` e `--reaudit-pending`):** não dispara subprocessos `agy` durante o lote; grava os overlays pendentes em `auditoria/cache/pending-som/<routineId>-passo-<NN>-som.png` e enfileira metadados/candidatos em `auditoria/cache/pending-som/pending-som-queue.json`.
- **Curadoria Pós-Lote (`auditoria/src/curate-pending-som.ts`, `npm --prefix auditoria run visual:curate`):** processa `pending-som-queue.json` em bloco via `agy` (`Gemini 4 Hydrogen Extra`), valida com `validateVisualCandidateSemantics` e persiste os mapeamentos aprovados diretamente no `human-reviews-cache.json` / `routine_reviews` (Camada 0.1 RAG via `upsertVisualCuratedTargetOverride`) e no dicionário por rota (`curated-route-synonyms.json` / `upsertCuratedRouteSynonym`, Camada 0.2 — ADR-029).

---

## 3. Verificação e Evidências

- **Testes unitários (`auditoria/src/__tests__/visual-som-layer.test.ts`):** 12 novos testes (totalizando **181/181 testes aprovados em 45 suítes** em `npm --prefix auditoria test`, 100% offline):
  - Validação do buffer PNG `1440×900` em memória (`renderSetOfMarkOverlay`), teto de 45 candidatos e garantia matemática de não-oclusão do centro `(cx, cy)` em `computeSetOfMarkTagPlacement`;
  - Validação das flags CLI do `agy` (`gemini-4-hydrogen-xhigh` / `xhigh`), envio via `STDIN`, exclusão mútua do `AsyncSemaphore(1)` e limpeza garantida no `finally` de `withEphemeralSomImage`;
  - Parseamento JSON estrito (`parseSomVlmResponse`, `parseVisualGroundingResponse`, `normalizedPointToViewportPx`) e resolução de `--visual-mode live | defer`;
  - Veto semântico pós-VLM bloqueando alucinações para `Novo cartão +`, `Cidade` e itens de `navbar`, e aprovação com medição DOM real em `resolveViaSetOfMark2C` e `resolveViaVisualGrounding2C`;
  - Fluxo completo `defer` -> `visual:curate` alimentando a Camada 0.1 (RAG) e a Camada 0.2 (Sinônimos de Rota).
- **Checagem de tipos e Console:**
  - `npx --prefix auditoria tsc -p auditoria/tsconfig.json --noEmit`: **0 erros**.
  - `npx --prefix "Orion Audit Console" tsc -p "Orion Audit Console/tsconfig.json" --noEmit` e `npm --prefix "Orion Audit Console" test`: **0 erros** (35/35 testes aprovados).
- **Auditoria Geométrica (`npx --prefix auditoria tsx auditoria/src/verify-all-phase2-boxes.ts --all`):**
  - **150 rotinas**, **433 prints**, **267/267 Zero Auto-Oclusão**, **433/433 pares PNG+WebP**, **0 discrepâncias** nos 8 invariantes.


---

## Emenda 2026-11-18 — Contrato do `agy` ≥ 1.5, curadoria pós-lote resiliente

Contexto: a curadoria pós-lote dos 78 passos de `pending-som-queue.json` (reauditoria massiva de 2026-11-17/18) falhou em 100% das chamadas com `exit_code_2`.

- **Causa:** no `agy` 1.5.9 o `--print` consome o token seguinte como prompt (`--print took "--model" as its prompt`). O STDIN não é lido como prompt em modo `text`.
- **Contrato novo (`agy-client.ts`, `buildAgyCliArgs`/`buildAgyStreamInput`/`extractAgyStreamResult`):** `--print= --input-format stream-json --output-format stream-json`; o prompt (com a menção `@imagem`) entra em **STDIN** como NDJSON `{"event":"user","message":{"content":"..."}}`; a resposta é o `response` do evento final `{"event":"result","result":{"status":"SUCCESS",...}}`. `status != SUCCESS` vira `null` (degradação graciosa). O prompt continua **fora** da linha de comando (ADR-014).
- **Detector de cota:** `429` agora com limite de palavra (`\b429\b`); antes, contadores de tokens do stream (`11429`) davam falso positivo.
- **Timeout:** `45s` segue no modo `live`. Uma chamada com imagem em `xhigh` leva ~45 s (medido), então `curate-pending-som.ts` usa `CURATION_TIMEOUT_MS = 180s`.
- **Falha de infraestrutura nunca rejeita item:** resposta `null` (sessão, cota, timeout, JSON ilegível) mantém o item `pending`; 3 falhas consecutivas interrompem o lote e preservam o restante da fila. Só decisão do modelo (confiança, veto ADR-027, tag inexistente) rejeita. O curador Python (`curate_som_sdk.py`) segue a mesma regra (`Outcome: pending_error`, `inference_errors`).
- **Nome genérico não é evidência:** candidato cujo nome é vazio, a tag (`input`, `button`...) ou o papel (`textbox`) é rejeitado antes de gravar a Camada 0.1/0.2. Dois sinônimos `→ "input"` (D-2.4, M-16.13) chegaram a ser gravados e foram removidos.
- **Resultado da primeira curadoria real (78 itens):** 3 curados (D-2.7 `Salvar`→`Concluir`, D-3.3 `Preencher com IA`→`Preencher cartão usando I.A.`, M-26.0 `Salto (Gap)`→campo de espaço entre etiquetas), 72 rejeitados por evidência insuficiente (alvo não presente na tela; muitos em `#/inicio`), 3 pendentes por falha do `agy`.
