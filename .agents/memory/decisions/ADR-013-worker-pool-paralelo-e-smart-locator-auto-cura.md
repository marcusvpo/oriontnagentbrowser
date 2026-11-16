# ADR-013: Worker Pool Concorrente com Isolamento de Sessão e Auto-Cura Semântica (`smart-locator.ts`)

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Escalabilidade Distribuída para Lotes Massivos (Fase 3 com 108 rotinas) e Resiliência a Mudanças de UI

---

## 1. Contexto e Problema Arquitetural

Após a consolidação da Geometria Determinística do DOM (ADR-012), o pipeline enfrentava dois gargalos de escala e resiliência para enfrentar lotes de centenas de rotinas (como as 108 rotinas da Fase 3):
1. **Execução Sequencial Single-Session (`--session auditoria-session`):**
   - Todas as rotinas compartihavam um único daemon e uma única fila sequencial (`for..of`).
   - O arquivo `auditoria/auth/session-homolog.json` não possuía controle de concorrência (mutex), o que causaria *race conditions* e *file locks* no Windows caso múltiplos workers tentassem renovar ou ler o estado simultaneamente.
   - Não havia distinção programática entre rotinas de **consulta/leitura** (`read_only`) e rotinas de **mutação/gravação** (`mutation`), oferecendo risco de *deadlock* no banco PostgreSQL/WildFly 22 se múltiplas gravações ocorressem simultaneamente no mesmo cartório (`4tabeliao.scs`).
2. **Ausência de Auto-Cura em Divergências de Nomenclatura de UI:**
   - Quando o manual citava um termo legado (ex.: botão `**Salvar**` ou `**Novo**`) e a interface real do Orion TN 6.0 exibia `Concluir` ou `Adicionar +`, o executor abortava imediatamente a rotina inteira como bloqueada (`requer_revisao_humana`), gerando falsos negativos e interrompendo o lote.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Arquitetura do Worker Pool Paralelo (`auditoria/src/worker-pool.ts`)
1. **Isolamento Estrito de Daemons por Sessão:**
   - Cada worker opera em um processo/contexto isolado identificado por `--session worker-${workerId}` (`worker-1` a `worker-6`).
2. **Mutex de Autenticação e Snapshots de Sessão Somente-Leitura:**
   - Um `AsyncSemaphore(1)` (`authMutex` com *double-checked locking*) garante que apenas um coordenador execute o login no `webPortal` e grave o arquivo mestre `auditoria/auth/session-homolog.json`.
   - Cada worker recebe uma cópia isolada (`auditoria/auth/session-worker-${workerId}.json`), eliminando contenção de I/O e *file locks* em disco.
3. **Particionamento Dual-Lane (`READ_ONLY` vs. `MUTATION`):**
   - `classifyRoutineWorkload()` classifica deterministicamente cada rotina:
     - **`read_only` (Consultas, listagens, visualizações):** Executadas com paralelismo máximo (`readConcurrency`: 4 a 6 workers simultâneos).
     - **`mutation` (Cadastros, alterações, inativações, preenchimentos):** Controladas por um `mutationSemaphore` dedicado (`mutationConcurrency`: 1 a 2), prevenindo *deadlocks* e colisões de sequence no WildFly/PostgreSQL.
4. **Gestão de Ciclo de Vida e Graceful Shutdown (`disposeAll`):**
   - Listeners para `SIGINT`/`SIGTERM` e blocos `finally` encerram todos os daemons `--session worker-N` e removem os snapshots temporários `session-worker-*.json`.

### 2.2. Motor de Auto-Cura em Camadas (`auditoria/src/smart-locator.ts`)
O `locateAndCaptureWithSelfHealing()` resolve elementos em 3 níveis progressivos:
1. **Camada 1 — Geometria Direta no DOM (`dom-geometry.ts`):**
   - Busca o seletor/texto exato em 2ms (0 tokens). Se encontrado, segue o fluxo normal (`healed: false`).
2. **Camada 2A — Introspecção da Árvore de Acessibilidade Compacta (`snapshot -i`) + Dicionário Canônico Orion TN & Sørensen–Dice (0 Tokens):**
   - Extrai a árvore interativa (`parseAccessibilitySnapshot`) e avalia equivalência semântica via dicionário canônico (`ORION_UI_SYNONYMS`, ex.: `Salvar` $\leftrightarrow$ `Concluir`, `Novo` $\leftrightarrow$ `Adicionar +`, `Editar` $\leftrightarrow$ `Alterar`) combinado ao coeficiente de bigramas Sørensen–Dice ($\ge 0.68$).
3. **Camada 2B — Fallback Estruturado Single-Shot via LLM sobre a Árvore de Acessibilidade:**
   - Se a Camada 2A não convergir e houver API Key configurada, dispara uma única chamada JSON ultra-compacta (`temperature: 0`, máx. 40 nós interativos) para identificar o `@ref` equivalente.
4. **Contrato de Telemetria de Divergência (`SmartLocatorDivergence`):**
   - Quando a auto-cura é acionada, a rotina prossegue sem interrupção, atualiza seu status para `validado_com_ajustes`, injeta o bloco `auditoria_ui.auto_cura.divergencias_detectadas` no YAML frontmatter do arquivo `*-revisado.md` e adiciona um alerta `> [!NOTE]` no passo correspondente documentando a divergência entre o manual e a tela real.
