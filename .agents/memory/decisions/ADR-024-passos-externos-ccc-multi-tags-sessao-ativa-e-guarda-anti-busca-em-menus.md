# ADR-024: Passos Externos `[CCC]`, Multi-Tags, Guarda de Sessão Ativa e Bloqueio Anti-Busca em Menus

* **Status:** Aceita e Vigente
* **Data:** 2026-11-16
* **Nota de Numeração:** o pedido original chamava esta decisão de "ADR-023" e a migration de "`004_multi_tags_and_ccc.sql`". Ambos os números já estavam ocupados em disco ([`ADR-023`](file:///d:/marcu/Videos/OrionTN/OrionTN/.agents/memory/decisions/ADR-023-github-seguro-e-sincronizacao-supabase-tempo-real.md) = GitHub seguro + Write-Through; `004_supabase_realtime.sql`). Registrada, por isso, como **ADR-024** e **`005_multi_tags_and_ccc.sql`**.
* **Atualiza:** `ADR-016` (rota de menu), `ADR-021` (taxonomia), `ADR-009` (zero login overhead) e `ADR-017` (RBAC Gate, que passa a considerar só os passos do Orion TN).

---

## 1. Contexto e Motivação

Os resultados da Fase 3 deixaram quatro defeitos de fundo, todos com evidência em log:

1. **Passos em portais externos fotografados como se fossem o Orion TN.** `C-CENTRAL-02` (e `04`, `08`, `12`) começam em SISCOAF, SIGNO/CENSEC, e-Notariado ou no programa da Receita, e só depois voltam ao sistema (*"No **Orion TN**, acesse..."*). O executor procurava **SISCOAF** na tela inicial do Orion TN, bloqueava no passo 1 como `[ATT]` ("Recurso Inexistente na Tela") e gravava uma `passo-01.png` da home do sistema ilustrando um passo de portal governamental: evidência falsa (viola o Anti-Mock, ADR-010).
2. **Uma só tag por rotina.** Uma rotina que depende de portal externo **e** tem caminho desatualizado no Orion TN não tinha como carregar as duas causas.
3. **Re-login redundante.** Cada rotina reabria `about:blank`, recarregava `/webFirmas` e, na prática, refazia o WildFly SSO. A causa-raiz (achada ao vivo nesta ADR): a checagem de sessão em `ensureAuthenticated` usava `a:has-text("Firmas")`, seletor do Playwright, dentro de `document.querySelector`; ele **lança exceção**, o `catch` registrava "sessão expirada" e **toda** execução refazia o login com a sessão perfeitamente válida.
4. **Falsa cura de menu em `D-3.14`.** *"Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**"* foi curado com 96% de confiança para `"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"`, a caixa de busca global. Causa: o dicionário de sinônimos de *Novo* inclui o símbolo `+` e o casamento era `normNode.includes(s)` (substring), que acha `+` dentro de `CTRL + B`. O rótulo de um `<input>` nunca é um item de menu.

---

## 2. Decisões Arquiteturais

### 2.1. Pré-análise de escopo de passo (`step-scope.ts`)

* `executeRoutineAudit` lê a rotina inteira **antes de abrir o navegador** e grava `scope: 'external_portal' | 'orion_tn'` (e `externalPortal`) em cada `RoutineStep`.
* Máquina de estados sobre o texto normalizado: começa `orion_tn`; **verbo de acesso + portal externo** (SISCOAF, COAF, e-Notariado, SIGNO/CENSEC, CRC, CNB, Receita Federal, Serasa/SPC, DOI, SINTER, SIRP, ONR/SAEC, com portal/site/plataforma/e-CPF/certificado/URL) ou **ferramenta externa** (programa validador da Receita, Notepad++, Bloco de Notas, sem caminho de menu e sem citar o Orion) muda o estado para `external_portal`; o estado persiste, passo a passo, **até o passo que retorna explicitamente** (*"No Orion TN..."*, *"Retorne ao Orion TN"*). Citar a central como módulo (*"Comunicações > CENSEC CTP"*, *"Acesse Comunicações > DOI"*) **não** é externo.
* Resultado sobre os 471 manuais do KB: **5 rotinas** com passos externos (`C-CENTRAL-02` passos 1-3, `C-CENTRAL-04` 1-3, `C-CENTRAL-08` 7, `C-CENTRAL-12` 1-5 e 8, `C-GERAL-06` 8); as demais ficam intactas.
* Passo `external_portal`: **nenhuma ação, medição ou screenshot**. O executor só registra o resultado (`stepScope`) e segue; a execução ao vivo começa no 1º passo `orion_tn`. Rotina 100% externa não abre o navegador. O RBAC Gate usa só os passos do Orion TN (*"o Tabelião Titular acessa o portal"* é privilégio do portal), e o bloqueio por RBAC fotografa o 1º passo `orion_tn`.
* `-revisado.md`: texto original **intacto** + `> [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** ...` em cada passo externo, resumo no topo (`ROTINA COM ETAPAS EM AMBIENTE EXTERNO ([CCC])`), `auditoria_ui.etapas_externas` (`passo`/`portal`) e `tipo_bloqueio: 'Dependência de Comunicação/Portal Externo'`. `report.ts` passa a achar o resultado do passo por `stepNumber` (a posição deixou de valer: passos externos e bloqueios criam lacunas).
* **Paridade:** `invariants.ts` (`auditExternalSteps`, `externalStepsFromMd`) **aceita** passo externo sem `passo-NN.png` e **recusa** marcador ou arquivo de print em passo externo, callout ausente e `etapas_externas` sem `[CCC]`. `auditPrint` (invariante 5) também recusa telemetria de print num passo declarado externo. `verify-all-phase2-boxes.ts` e `GET /api/rotinas/:id` (`passosExternos`) usam a mesma função.

### 2.2. Tag `[CCC]` e múltiplas tags (`review-taxonomy.ts`)

| Tag | Status | Bloqueia? | Quando |
| :--- | :--- | :--- | :--- |
| `[ATT]` | `atualizacao_editorial` | sim | manual cita tela/caminho/campo inexistente |
| `[CCC]` | `comunicacao_externa` | **não** | parte do passo a passo ocorre em portal/serviço externo |
| `[DDD]` | `dependencia_dados_banco` | sim | faltam dados/ambiente/hardware |
| `[XRX]` | `dependencia_cruzada_rotina` | sim | depende de outra rotina |

* `[CCC]` sozinha: as etapas do Orion TN são auditadas e fotografadas normalmente (Evidência Estrita vale para elas). Com bloqueio no Orion TN a rotina vira **`[ATT][CCC]`** (texto original preservado, como em todo bloqueio).
* **Ordem canônica `ATT, CCC, DDD, XRX`, sem espaço entre colchetes**: pasta `[ATT][CCC] C-CENTRAL-02-...`, arquivo `[ATT][CCC] C-CENTRAL-02-...-revisado.md`. `auditoria_ui.status` guarda o status **principal** (`ATT`/`DDD`/`XRX` têm precedência sobre `CCC`, que só é principal quando está sozinha) e `auditoria_ui.review_tags` a lista completa. `statusFromPrefix` deriva o principal do prefixo, então prefixo ≡ `review_tags` ≡ `status` é conferível.
* `removeTwinRoutineFolders` e a limpeza de variantes antigas (`executor.ts`, `run-phase2-master.ts`) deixam de usar lista fixa de prefixos (`Object.values(REVIEW_TAGS).map(...)`, que não cobre combinações) e varrem a pasta do módulo por `stripReviewPrefix`, cujo regex agora aceita qualquer sequência de tags (`^(?:\[(ATT|CCC|DDD|XRX)\]\s*)+`).
* `invariants.ts` e `verify-all-phase2-boxes.ts` conferem prefixo canônico, `review_tags` ≡ prefixo, contagem por tag e pastas multi-tag.
* **Supabase `005_multi_tags_and_ccc.sql`** (idempotente): novo valor no CHECK de `status_auditoria`; `routines.tags_revisao TEXT[]` (CHECK `<@ {ATT,CCC,DDD,XRX}`, índice GIN, backfill a partir do status); `routine_steps.step_scope` (`orion_tn`/`external_portal`) e `portal_externo`. `003_review_taxonomy.sql` também lista `comunicacao_externa`, para que reaplicar as migrações (o `migrate-supabase` roda todas) não falhe na validação do CHECK depois que existirem linhas `[CCC]`. `sync-supabase.ts` grava `tags_revisao`, `step_scope` e `portal_externo`, e o passo externo nunca vira `blocked` por falta de mídia.
* **Console** (`Orion Audit Console`): `lib/status.ts` (`REVIEW_TAG_ORDER`, `tagsOf`, `sortTags`, `reviewPrefix(status, tags)`), `AuditStatusBadge` (badge do principal + chip por tag adicional), filtro `tag` (`tagRevisao` na API, que enxerga também as tags adicionais), preset *Portal externo [CCC]*, KPI/legenda/gráfico com `[CCC]`, e `StepComparisonCard` com o callout do passo externo.

### 2.3. Sessão ativa e reset leve (`auth.ts`, `executor.ts`)

* `isSessionActiveInPage(client)` só **lê** a página atual: URL em `/webPortal` ou `/webFirmas`, menu **"Olá, ..."** visível e **sem** `#username`/`#password`/`input[type=password]`.
* `ensureAuthenticated` e `loginOrion` a consultam **antes** de qualquer `open` ou do fluxo WildFly SSO (`loginOrion(client, { force: true })` ignora). Corrigida a causa-raiz do §1.3: depois do `stateLoad` + `open`, a conferência usa `isSessionActiveInPage` (não mais `a:has-text`).
* `resetToHome` → `tryLightReset`: com sessão ativa, **só fecha os modais** (`closeActiveModals`, que cobre `.orion-lightweight-modal`) e volta ao início por hash (`#/inicio`, derivado de `ORION_APP_HOME_URL`), **sem** `about:blank`, **sem** recarregar `/webFirmas`, **sem** login. Se o worker estiver no portal (`/webPortal`), entra no módulo Orion TN com a mesma sessão. Desvio consciente do pedido (que dizia "`#/webPortal`"): `/webPortal` é outra aplicação, sem rota hash de início; o início do Orion TN é `#/inicio`. Qualquer sinal de estado sujo (modal que não fecha, rota diferente do início, tela com erro) devolve `false` e o reset completo anterior assume (diálogo nativo pendente e renderer travado continuam tratados ali).
* `authStats()` (logins reais, sessões reaproveitadas, resets leves/completos) entra no resumo do lote do `cli.ts` e nos logs.

### 2.4. Guarda estrita contra falsa cura de menu (`navigation-guard.ts`, `menu-path.ts`, `smart-locator.ts`)

* **Navegação estrita** = caminho `A > B` ou *"Acesse o menu/submenu..."*. Esses passos **nunca** casam com `<input>`, `<textarea>`, `role=textbox|searchbox|combobox|spinbutton`, e **nenhum** passo casa com a busca global (`CTRL + B`) a menos que o próprio texto a cite. A guarda atua em quatro pontos: candidatos da árvore de acessibilidade (`rankSemanticCandidatesInA11y`), fallback LLM (o modelo nem vê esses nós), **geometria já medida** (`forbiddenMeasuredReason`, pois o nó medido por texto pode ser o `<input>` com o mesmo rótulo) e o clique legado por `ref` (`findRefByNameInSnapshot`).
* **Sinônimo de símbolo** (`+`) só casa por **igualdade exata** com o nome do nó; sinônimo de palavra, por **palavra inteira** (`synonymMatchesNode`). Fecha a causa do incidente.
* **`resolveAndNavigateMenuPath` sempre responde quando o passo cita caminho** (antes devolvia `null` e o fluxo seguia para a Camada 2):
  * caminho inexistente → `menuPathMissing` com `buildMenuPathMissingEvidence`: maior prefixo que **existe** na hierarquia real (`Notas` → `Certidões` → ...), filhos reais do último nível, folha homônima em outra rota e total de itens lidos. A **Camada 2 (similaridade, sinônimo, LLM) fica proibida**; só a medição **exata** do DOM (Camada 1) ainda vale;
  * a árvore existe, mas a cascata não abriu/manteve → `menuPathOpenFailed`: **falha técnica retentável**, sem tag (o executor lança; o lote tenta de novo);
  * árvore ausente na tela → idem (`menuPathOpenFailed`).
* O bloqueio sai `[ATT]` (`manual_outdated`, via `buildMissingTargetBlock({ menuEvidence })`) com a evidência no `Motivo Técnico` e no `errorMessage`, em vez de um falso positivo.

---

## 3. Validação

* `npx --prefix auditoria tsc -p auditoria/tsconfig.json --noEmit`, `npm --prefix auditoria test`, `tsc` do Console, `npm --prefix "Orion Audit Console" test` e `run build`: 0 erros.
* Novo `src/__tests__/adr024-external-steps-multitag-guard.test.ts` (21 testes): escopo dos passos da `C-CENTRAL-02` e casos de borda, taxonomia/multi-tag, guarda de `D-3.14` (inclui a regressão do `+`/`CTRL + B`), evidência de menu inexistente, relatório `[CCC]` e `[ATT][CCC]` e validador de passos externos.
* Migration `005` aplicada no Supabase (`npm --prefix auditoria run supabase:migrate`; todas as migrações reaplicadas sem erro).
* Reauditoria ao vivo, resultados na seção 4.

## 4. Resultados da Reauditoria

Execução ao vivo em 2026-11-16, `cli.ts --routines ... --concurrency 1 --dry-run-mutations` (Write-Through ligado; 1 worker para provar a sequência sem re-login).

| Rotina | Antes | Depois | Evidência registrada |
| :--- | :--- | :--- | :--- |
| `D-3.14` | `[ATT]`; passo 1 "curado" (96%) para a busca global `CTRL + B`, bloqueio só no passo 2 | `[ATT]`, bloqueio no passo 1, **sem tocar na busca global** | O menu **Notas** existe e contém *Protocolos em aberto, Protocolos, Orçamentos, Orçamento rápido, Certidões e serviços, Certidões e serviços em aberto, Consultas*; "Certidões" não está entre eles; nenhuma folha parecida em outro ponto (136 itens lidos) |
| `C-CENTRAL-02` | `[ATT]` no passo 1 ("SISCOAF" procurado na home) + `passo-01.png` da home | **`[ATT][CCC]`**: passos 1-3 externos (SISCOAF) sem print; execução começa no passo 4 | Passo 4 (`Configurações > Parâmetros Gerais > Comunicação COAF`): **Configurações** contém *Dados do cartório, Modelos de impressão, Tabela de custas, Cadastros auxiliares, Perfis e permissões de acesso, Usuários, Parametrizações*; "Parâmetros Gerais" não existe |
| `C-CENTRAL-04` | `[ATT]` no passo 1 (SIGNO/CENSEC) | **`[ATT][CCC]`**: passos 1-3 externos; execução começa no 4 | Passo 4: mesmo caso (`Parâmetros Gerais` inexistente) |
| `C-CENTRAL-08` | `[ATT]` no passo 1: "Orion TN" tratado como alvo de tela | **`[ATT][CCC]`**: passo 1 vira captura limpa (nome do produto não é alvo), passo 7 externo (e-Notariado) | Passo 2: **Administração > Comunicações > Outras Comunicações** existe e **não tem subitens**; "E-Notariado" não está lá (pista para o editor: a tela pode ser a própria folha) |
| `C-CENTRAL-12` | `[ATT]` no passo 1 ("Número da Linha / Registro" procurado na home) | **`[ATT][CCC]`**: passos 1-5 e 8 externos (programa da Receita, arquivo local); execução começa no passo 6 | Passo 6 (`Notas > Protocolo`): a folha real é **Protocolos**, em duas rotas (`Notas > Protocolos` e `Notas > Consultas > Protocolos`); empate = bloqueio, conforme a ADR-016 ("não se adivinha a tela") |

Nenhuma das quatro `C-CENTRAL` chegou a validar `passo-05`/`passo-06` do Orion TN: o **passo 4 (menu) é o primeiro passo do Orion TN e o caminho do manual não existe na versão atual**, então o desfecho correto é `[ATT][CCC]` com a prova da árvore, não um passo "curado" para outra tela. O que mudou foi a causa registrada: antes, o bloqueio era um artefato (procurar o portal na home); agora é a defasagem real do manual, com evidência.

**Sessão:** lote de 5 rotinas, 1 worker: **0 logins reais, 1 sessão reaproveitada, 4 resets leves sem recarga** (`[Auditoria] Reset leve: sessão ativa reaproveitada (orion_tn); 0 modal(is) fechado(s) e navegação por hash #/inicio, sem recarga nem login.` antes de cada rotina, exceto a primeira). Em processo novo (reauditoria da `C-CENTRAL-08`): `✓ [Auth] Sessão existente ativa e válida (orion_tn)! Pulando 100% do fluxo de login`, também com 0 logins. Antes da correção do §2.3, o mesmo `ensureAuthenticated` registrava "Sessão prévia expirada ou inválida. Refazendo autenticação..." mesmo com a sessão válida.

**Validador** (`verify-all-phase2-boxes.ts --phase 3`, 118 rotinas): **0 discrepâncias**, 231/231 pares PNG+WebP, 4 pastas multi-tag, 13 passos externos em 4 rotinas (3 + 3 + 1 + 6) aceitos sem print, 0 pastas gêmeas, 0 pastas `[!!!]`, 7/7 pré-triadas `[DDD]` íntegras. Varredura geral (Fases 2 e 3): 339 prints, 0 discrepâncias. Na primeira rodada o próprio validador apontou 6 falsos "passo externo sem callout" (meu regex casava com o "Roteiro Técnico", também numerado, de rotina bloqueada); corrigido e coberto por teste.

**Observações fora do escopo, deixadas como estão:** (1) `Notas > Protocolo` aparece em vários manuais e a regra de empate da ADR-016 o bloqueia; se Produtos considerar "Notas > Protocolos" a rota canônica, o desempate (menor cadeia de ancestrais extras) é um ajuste pequeno e separado; (2) `C-CENTRAL-03/09/13/14` seguem `[ATT]` por outras causas e não foram reexecutadas; (3) os resultados dependem do menu real lido ao vivo (136 itens), então a prova vale para esta versão da homologação.

---

## 5. Consequências

* **Positivas:** nenhuma evidência falsa em passo de portal externo; causas combinadas (`[ATT][CCC]`) representáveis; menos tempo e menos carga no SSO por rotina; passo de menu inexistente vira prova na árvore real, nunca uma cura para um campo de texto.
* **A observar:** o detector de portais é heurístico (texto do manual). Um manual que cite o portal sem verbo de acesso ou sem o retorno explícito ao Orion TN pode ser subclassificado (fica `orion_tn`, e o comportamento é o anterior). A lista `EXTERNAL_PORTALS` é o ponto único de extensão. O reset leve confia no hash `#/inicio` para descartar o estado do SPA; se uma rotina deixar estado que sobrevive à navegação, o sinal esperado é a rotina seguinte falhar a verificação de tela inicial, e o reset completo assume.
