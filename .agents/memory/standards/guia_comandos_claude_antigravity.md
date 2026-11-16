# Playbook de Comandos de Execução — Claude Code (`v2.1.322`) & Antigravity (`v2.31.2`)
**Finalidade:** Elevar a qualidade arquitetural, evitar *context rot*, prevenir edições precipitadas, acelerar paralelismo cognitivo e eliminar retrabalho no pipeline do Orion TN.
**Restrição global:** Repositório 100% local (sem `.git`). Comandos nativos de Git (`/review` de PR, `/diff` via git) são proibidos.

---

## 1. Claude Code (`v2.1.322`) — Comandos que Alteram Execução e Qualidade

### 1.1. Comandos de Controle de Fluxo, Contexto e Recuperação

| Comando | O que executa na prática | Quando e como disparar no Orion TN |
| :--- | :--- | :--- |
| **`/plan`** | Bloqueia qualquer ferramenta de escrita (`Edit`, `Write`, `Bash` mutável) e força leitura profunda + desenho arquitetural antes de alterar uma única linha. | **Obrigatório antes de tocar no núcleo (`executor.ts`, `smart-locator.ts`, `dom-geometry.ts`, `annotator.ts`).** Impede o agente de sair remendando seletores sem entender o impacto nos 8 invariantes. |
| **`/clear`** | Destrói o histórico acumulado da sessão e reinicia o agente lendo apenas o `CLAUDE.md` da raiz. | **Imediatamente após fechar uma entrega validada (`tsc` 0 + validador).** Evita *context rot* (quando logs antigos de terminal e saídas longas de DOM fazem o modelo esquecer regras do `CLAUDE.md` e reintroduzir gambiarras). |
| **`/compact [diretriz]`** | Comprime a janela mantendo apenas as decisões arquiteturais e os arquivos que você especificar na diretriz, descartando logs brutos de execução. | No meio de uma refatoração multi-arquivo quando o contexto encher de logs do Playwright/Sharp.<br>**Exemplo:** `/compact preserve o plano da ADR-018, os contratos de smart-locator.ts e os erros pendentes do tsc` |
| **`/rewind`** *(ou `Esc` `Esc`)* | Volta o estado da conversa **e desfaz alterações de arquivo** até um checkpoint anterior da mesma sessão. | **Válvula de escape essencial sem Git:** se o agente tomar o caminho errado no meio da Fase 2 (ex.: quebrar o filtro de zona ou criar heurística estática), use `/rewind` para restaurar os arquivos instantaneamente em vez de pedir "desfaça e tente de novo" (que gasta cota e suja o contexto). |
| **`/init`** | Analisa o repositório e atualiza/estrutura o `CLAUDE.md` com comandos de build, testes e arquitetura detectados. | Apenas se a estrutura de pastas ou scripts `npm` de `auditoria/` mudar drasticamente (sempre revisando para não sobrescrever as *Golden Rules* sincronizadas com o `GEMINI.md`). |
| **`/agents`** | Cria e gerencia subagentes especializados dentro do Claude Code com prompts e permissões isoladas (ex.: um subagente somente-leitura para auditar relatórios `*-revisado.md` sem poluir a sessão principal). | Quando precisar validar 39 relatórios gerados em disco sem encher a janela do agente principal que está editando o motor TypeScript. |
| **`/hooks`** | Configura gatilhos automáticos de shell executados após eventos do agente (ex.: `PostToolUse` ao editar `.ts`). | Para automatizar `npx tsc --noEmit` sempre que o Claude Code terminar de editar arquivos em `auditoria/src/`, detectando quebra de tipagem na hora sem você precisar lembrar de pedir. |
| **`/permissions`** | Pré-autoriza comandos seguros (`npx tsc`, `npx tsx verify-all-phase2-boxes.ts`) e bloqueia comandos perigosos (`git *`, `rm -rf`). | Elimina interrupções manuais de aprovação a cada validação de tipo ou execução do validador geométrico. |

### 1.2. Atalhos de Precisão no Prompt do Claude Code
* **`@caminho/do/arquivo` (Menção Direta):** Em vez de deixar o agente gastar turnos procurando onde fica uma função, cite explicitamente `@auditoria/src/smart-locator.ts` e `@.agents/memory/standards/auditoria_agent_browser.md` no prompt.
* **`!` + comando shell (Ex.: `!npx tsc --noEmit`):** Executa o comando direto no terminal e injeta o resultado limpo no contexto sem gastar raciocínio do modelo para decidir rodar o comando.

---

## 2. Google Antigravity (`v2.31.2`) — Comandos de Orquestração, Refinamento e Lote

### 2.1. Comandos que Transformam a Execução

| Comando / Recurso | O que executa na prática | Quando e como disparar no Orion TN |
| :--- | :--- | :--- |
| **`/grill-me`** | Inverte o fluxo: impede o agente de propor soluções imediatas e o obriga a **interrogar você** sobre regras de negócio, exceções de tela, critérios de aceite e bordas não tratadas. | **Antes de criar regras complexas ou prompts grandes** (ex.: definir critérios de triagem da Fase 3, regras da Exploração Investigativa ou comportamento de mutação segura). Elimina ambiguidades antes que virem bugs em 108 rotinas. |
| **`/goal`** | Trava um objetivo verificável com critérios de conclusão explícitos no topo da execução, impedindo desvio de escopo (*scope creep*) em tarefas longas. | No início de frentes multi-etapas (ex.: `/goal Mapear e classificar as 108 rotinas da Fase 3 sem iniciar execução no navegador, gerando manifesto tipado com 0 erros de tsc`). |
| **`/swarm`** | Cria um quadro de agentes paralelos (`Alt + S`) com papéis distintos (`@worker-1..N`, `@verifier`), memória compartilhada e revisão cruzada. | **Exclusivo para paralelismo cognitivo e multimodal:**<br>1. Mapear 108 manuais `.md` da Fase 3 divididos por pasta;<br>2. Auditar visualmente centenas de screenshots (workers varrem pastas; `@verifier` em **Hydrogen High/Extra** cruza o texto do badge com a região demarcada).<br>**Proibido:** rodar navegador em paralelo via `/swarm` (usar `worker-pool.ts`). |
| **`/browser`** | Abre controle direto e interativo do navegador dentro do chat atual. | **Apenas cirurgia pontual ao vivo:** abrir uma única tela rebelde do Orion TN para inspecionar classes CSS, atributos `aria-expanded` ou estrutura de modal antes de ajustar o seletor no código. |
| **`@nome-do-worker` (no `/swarm`)** | Intervém diretamente em um worker específico no board do `/swarm` sem parar os demais. | Quando um worker travar em uma pasta específica ou aprovar um falso-positivo visual (`@verifier revise M-16.10/passo-03.png — os campos SMTP não existem na tela`). |
| **`Alt + J` / `Ctrl + K`** | Aprova imediatamente uma chamada de ferramenta pendente de permissão dentro do `/swarm`. | Evita que workers fiquem ociosos aguardando autorização de leitura/escrita em disco durante lotes grandes. |

### 2.2. Sequências de Alta Alavancagem no Antigravity

#### Fluxo A — Refinamento Cirúrgico de Regras/Arquitetura (Zero Retrabalho)
1. Selecione **`Orchestrator (Argon)`** (para parear planejamento profundo do Argon com execução econômica do Hydrogen).
2. Dispare **`/goal`** definindo exatamente o entregável e os critérios de aceite.
3. Dispare **`/grill-me`** instruindo: *"Antes de propor o plano ou editar arquivos, faça todas as perguntas críticas sobre regras de negócio do Orion TN, comportamento de tela e edge cases que ainda não estão claros."*
4. Responda às perguntas -> autorize a execução.

#### Fluxo B — Auditoria Visual Sem Falso-Positivo (`/swarm` Multimodal)
1. Abra sessão limpa em **`Gemini 4 Hydrogen Medium`** (os workers herdam o modelo da sessão).
2. Dispare **`/swarm`** dividindo as pastas de rotinas entre `@auditor-1`, `@auditor-2`, `@auditor-3` e exigindo que **`@verifier`** opere em **`Hydrogen High`** para cruzar o texto do passo com a caixa vermelha na imagem e rodar `npx tsc --noEmit`.
3. Monitore pelo board (**`Alt + S`**) e destrave permissões com **`Alt + J`**.

#### Fluxo C — Inspeção de Tela Rebelde antes de Alterar o Motor
1. Abra **`/browser`** apenas na URL/tela problemática do Orion TN (ex.: um modal oculto ou aba dinâmica).
2. Extraia o seletor real / comportamento de DOM -> feche o `/browser` -> passe o diagnóstico exato para o **Claude Code** implementar no motor via **`/plan`**.

---

## 3. Gatilhos de Uso por Cenário (Resumo de Ação Imediata)

| Cenário Real no Projeto | Ferramenta | Sequência de Comandos |
| :--- | :--- | :--- |
| **Alterar lógica do motor** (`smart-locator`, `executor`, `annotator`) | **Claude Code** | **`/clear`** → **`/plan`** (citando `@arquivos` afetados) → aprovar plano → validar com **`!npx tsc --noEmit`** → **`/clear`** |
| **Agente errou a mão no meio da implementação** | **Claude Code** | **`/rewind`** (`Esc` `Esc`) para restaurar os arquivos antes do erro → ajustar instrução |
| **Sessão ficou pesada no meio de uma refatoração grande** | **Claude Code** | **`/compact preserve o plano aprovado e os arquivos modificados`** |
| **Definir regras novas ou requisitos ambíguos antes de codar/mapear** | **Antigravity** | **`/goal`** + **`/grill-me`** (em **Orchestrator (Argon)**) |
| **Mapear 108 rotinas da Fase 3 ou auditar 150+ screenshots** | **Antigravity** | **`/swarm`** (workers em **Hydrogen Medium**, `@verifier` em **Hydrogen High**, board em **`Alt + S`**) |
| **Descobrir por que um campo/modal específico não abre no Orion TN** | **Antigravity** | **`/browser`** pontual na tela → levar diagnóstico para o **Claude Code** |