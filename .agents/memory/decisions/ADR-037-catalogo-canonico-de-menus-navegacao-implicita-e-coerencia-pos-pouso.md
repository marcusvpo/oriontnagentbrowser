# ADR-037: Catálogo Canônico de Menus 06.05.02, Navegação Implícita por Tela, Resolutor Semântico Fechado e Coerência Pós-Pouso

> **Data:** 2026-11-24  
> **Status:** Aceita e Implementada (Fases 1 a 5)  
> **Decisores:** Product Owner & Claude Code  
> **Relacionada a:** ADR-016, ADR-017, ADR-024, ADR-026, ADR-028, ADR-029, ADR-030, ADR-031, ADR-034  
> **Numeração:** a ADR-036 já existe; esta é a próxima livre. Sem migration SQL (as evidências novas vão para o JSONB `auditoria_ui` e para a divergência `menu_path_resolution` já existentes).

---

## 1. Contexto

A mineração da ADR-029 mostrou que a maior parte dos bloqueios `[ATT]`/`[XRX]` nasce **nos passos 1 a 3**, na navegação até a tela da rotina, e não na tela em si. Três lacunas sustentavam esse quadro:

1. **Árvore de menus sem fonte versionada.** A árvore real só existia em `auditoria/cache/orion-menu-tree-real.json` (ignorado pelo Git, lido ao vivo e sujeito a capturas parciais). Não havia lista fechada e auditável dos destinos navegáveis da versão em produção.
2. **Tela citada sem `>` não navegava.** O `menu-path.ts` só consultava a árvore com `segments.length >= 2`. Passos como *"Acesse **Grupos e Perfis de Acesso**"* ou *"No menu **Cartão de Assinatura**"* caíam na busca textual da tela inicial e terminavam `[ATT]`.
3. **Cura de rota sem prova de pouso.** Uma equivalência de menu (ADR-029) provava que a cadeia **existe** e foi percorrida, mas não que a tela alcançada é a que o manual descreve. Um destino plausível porém errado passaria como `validado_com_ajustes`.

Em paralelo, as 21 capturas da barra de menus do Orion TN **06.05.02** (ambiente de Produtos, 1440×900, zoom 80%) foram transcritas em `auditoria/mapeamento-menus/arvore-menus-orion-tn.md`, com a conferência cruzada em `manifest.json`.

---

## 2. Decisão Arquitetural

### 2.1. Fase 1 — Catálogo canônico fechado e versionado (`build-menu-catalog.ts`, `menu-catalog.ts`)

- **Fonte:** seção 4 (coluna *Caminho Canônico*) e seção 5 (homônimos e famílias de quase-homônimos) de `auditoria/mapeamento-menus/arvore-menus-orion-tn.md`, conferidas submenu a submenu contra os `directChildren` de `auditoria/mapeamento-menus/manifest.json`.
- **Saída versionada:** `auditoria/data/orion-menu-tree-canonical.json` (`version: "06.05.02"`): **115 caminhos finais** (110 nos 7 menus da barra + 5 no menu do usuário), **134 nós** (raízes, 12 submenus intermediários e telas), **4 homônimos exatos** (`Consultas`, `Cadastros`, `Comunicações`, `Mensalistas`), **14 famílias de quase-homônimos** (singular/plural, caixa, família Protocolos, Certidões, Selos, COAF...) e o resultado da conferência (`crossCheck`: 19 submenus conferidos, 0 divergências).
- **Gerador estrito:** `npm --prefix auditoria run menu:catalog` falha (código 1) se o total de caminhos finais for **≠ 115**, se houver **cadeia duplicada**, profundidade declarada ≠ número de segmentos ou homônimos calculados ≠ tabela 5.1. As entradas da captura que não são menus — o link fantasma **`"0"`** (badge zerado) e o painel **`"9+"`** de notificações — são excluídas e listadas.
- **`--sync-cache`:** regrava `auditoria/cache/orion-menu-tree-real.json` no formato do `capture-menu-tree.ts` (`MenuTreeSnapshot`), guardando a leitura anterior em `orion-menu-tree-real.prev.json` (um cache já sincronizado do mesmo catálogo não sobrescreve o backup da última leitura ao vivo).
- **API pura (`menu-catalog.ts`):** `loadMenuCatalog`, `findExactPath`, `findByLeaf` (texto idêntico normalizado e, só sem ele, mesma chave de folha; nunca substring intra-palavra), `isHomonym`, `rootsForModulo` (`MODULE_ROOTS`: módulo do KB → raízes da barra, usado **só** para desempate), `SCREEN_ALIASES` (11 apelidos curados de telas legadas, cada um com a rotina/print que o prova), `resolveSingleSegmentScreen` e `resolveClosedSemantic`. Sem navegador, sem rede.
- **O catálogo nunca é evidência.** Ele é a lista fechada de destinos **candidatos**. Toda cadeia que sai dele só vale depois de existir na árvore de navegação **lida ao vivo** e ser percorrida com ponteiro real (cascata da ADR-017).
- **Minerador (`mine-att-clusters.ts --tree auto|live|canonical`):** `auto` (padrão) usa a árvore ao vivo, salvo se ausente ou capturada **antes** do catálogo, caso em que usa o catálogo; `live` mantém o comportamento anterior; `canonical` força o catálogo.
- **`capture-all-menu-prints.ts`:** captura one-off das 21 prints e do `manifest.json` (somente na tela inicial, sem navegar para telas internas). O produto versionado é `auditoria/mapeamento-menus/` + `auditoria/data/`; o script fica em `LEGACY_EXCLUDED` do Super-Contexto (§2.7).

### 2.2. Menu do usuário: raiz neutra `Olá, [usuário]`

- A aplicação exibe o menu do canto superior direito com o nome do usuário logado (`Olá, <nome>`). Catálogo, tabela explícita e **qualquer texto gerado** (manual revisado, divergência, relatório, rótulo de print, evidência de bloqueio) usam a raiz neutra **`Olá, [usuário]`** (`USER_MENU_ROOT`, `menu-canonical.ts`). **Nunca** se grava o nome real.
- `isUserMenuRootLabel` casa o marcador ou `Olá, <nome>` (vírgula logo após "Olá"); a saudação `Olá <nome>, seja bem-vindo!` (sem vírgula após "Olá") **não** é a raiz do menu.
- Travessia e medição usam a cadeia **viva** (`item.selectors`); todo texto usa a cadeia neutra (`neutralUserMenuChain`/`neutralizeUserMenuText` em `menu-path.ts`).
- Itens do menu do usuário no 06.05.02: **Alterar senha**, **Fale conosco**, **Autenticação em dois fatores**, **Cadastrar biometria**, **Sair**.

### 2.3. Fase 2 — Navegação em 4 camadas (tudo em memória antes do clique)

Todas as camadas decidem **antes** de qualquer clique, sobre a árvore lida ao vivo. **Nada é evidência** até a cadeia existir nessa árvore e ser percorrida com ponteiro real (ADR-017). O texto do manual só muda pela substituição pontual da Trava de Evidência: divergência `menu_path_resolution` registrada no `-revisado.md` e rotina `validado_com_ajustes`. Toda cura é `exact: false`, nunca `ok` silencioso.

#### Camada 1 — Equivalências explícitas ampliadas (`menu-canonical.ts`, `EXPLICIT_MENU_EQUIVALENCES`)

- **Novos recursos da tabela:** curingas de segmento (`*` casa qualquer segmento único; `palavra*` casa o segmento igual a `palavra` ou que começa por `palavra ` — palavra inteira, nunca substring intra-palavra); **`keepRestAsPath`** (os segmentos do manual depois do prefixo são **re-resolvidos** sob a cadeia real: filho direto com texto igual/mesma chave de folha, senão descendente **único**; se parar numa folha sem filhos e `tailFromRest` estiver ligado, o resto vira aba/seção; senão a entrada não se aplica); **`userMenu`** (destino sob `Olá, [usuário]`, aberto como qualquer raiz da barra).
- A cadeia devolvida é sempre a do item **real lido agora** (`realItems.length !== 1` → a entrada não se aplica).
- `canonStem` passa a tratar o plural **`-ens` → `-em`** (`itens`→`item`, `ordens`→`ordem`), o que faz `Grupo de itens` ≡ `Grupo de item`.
- **Entradas acrescentadas (mineradas dos bloqueios `[ATT]`/`[XRX]` contra o catálogo):**

| Documentado no manual | Cadeia real 06.05.02 | Rotinas que motivaram |
|---|---|---|
| `Configurações > Parâmetros Gerais` (+ aba) | **Configurações > Parametrizações** | `C-FIRMA-08`, `C-CENTRAL-04`, `C-SELO-03` |
| `Configurações > Parâmetros de NFS-e` (+ aba) | **Configurações > Parametrizações** | `C-FIRMA-06` |
| `Configurações > Parâmetros do Módulo Firmas` (+ aba) | **Configurações > Parametrizações** | `C-FIRMA-07` |
| `Configurações > Parâmetros de Integração` (+ aba) | **Configurações > Parametrizações** | `C-SELO-04` |
| `Configurações > Grupos e Perfis de Acesso` | **Configurações > Perfis e permissões de acesso** | `C-ACESSO-06`, `C-ACESSO-07` |
| `Notas > Cadastros auxiliares > Grupo de itens` | **Configurações > Tabela de custas > Grupo de item** | `M-62.0`, `M-63.0` |
| `Notas > Cadastros auxiliares > …` (`keepRestAsPath`) | **Configurações > Cadastros auxiliares > …** | `M-61.0` (`M-34.0`/`M-35.0` *Tipos de anexo* seguem sem destino) |
| `Administração > Cadastros auxiliares > …` (`keepRestAsPath`) | **Configurações > Cadastros auxiliares > …** | `M-34.0`, `M-41.0`/`M-67.0`/`M-68.0` (*Área de atuação* → **Pessoa física > Área de Atuação**) |
| `Notas > Certidões > Consulta de Certidões` | **Notas > Consultas > Certidões e serviços** | `D-3.15` |
| `Notas > Certidões > Novo Pedido de Certidão` | **Notas > Nova certidão e serviço** | `D-3.14` |
| `Notas > Pedido de Certidão` | **Notas > Nova certidão e serviço** | `M-54.0`, `M-54.1` |
| `Firmas > Atendimento > Abertura de Pedido com Senha` | **Firmas > Abertura de pedido** | `M-13.0` |
| `Livros > …` (+ aba) | **Administração > Controle de Livros** | `C-LIVRO-01`, `C-LIVRO-05` |
| `Configurações > Livros Notariais` (+ aba) | **Administração > Controle de Livros** | `C-LIVRO-02` |
| `Firmas > Livros` (+ aba) | **Administração > Controle de Livros** | `M-22.0`, `C-FIRMA-02` |
| `Orion Estoque > …` (`keepRestAsPath` + aba) | **Administração > Controle de Estoque > …** | `C-LIVRO-07` |
| `Administração > Consultas > Estoque` | **Administração > Controle de Estoque > Consultas** | `V-3.0` |
| `Módulos > Selo Digital > Auditoria*` | **Administração > Comunicações > Auditoria de Selos** | `C-SELO-01` |
| `Configurações [> Usuários] > Alterar senha` / *Alteração de senha* / *Trocar senha* | **Olá, [usuário] > Alterar senha** | `C-ACESSO-03`, `C-ACESSO-04` |
| `… > Autenticação em/de dois fatores` / *2FA* | **Olá, [usuário] > Autenticação em dois fatores** | `C-ACESSO-03` |
| `… > Cadastrar biometria` / *Cadastro de biometria* | **Olá, [usuário] > Cadastrar biometria** | — (print do menu do usuário) |
| `… > Fale conosco` | **Olá, [usuário] > Fale conosco** | — (print do menu do usuário) |

As quatro últimas linhas são geradas por `userMenuEquivalences` para os prefixos `Configurações > Usuários`, `Configurações` e `Usuários`.

#### Camada 2 — Tela citada sem `>` nos passos 1 a 3 (`menu-implicit-nav.ts`, `menu-catalog.ts`, `menu-path.ts`)

- `detectImplicitScreenNavigation(step)` (puro, compartilhado pelo executor e pelo auditor offline) reconhece *"Acesse/Abra/Vá/Entre/Navegue **X**"*, *"No menu/Na tela/No módulo/Na opção **X**"* em passo `<= IMPLICIT_NAV_MAX_STEP` (3), **só** quando o passo não traz caminho `>`. Ignora botões/símbolos (`Salvar`, `Adicionar`, `+`, `CTRL + B`...) e endereços/login do sistema.
- `resolveSingleSegmentScreen` decide, nesta ordem: **`exact_leaf`** (folha idêntica normalizada), **`leaf_key`** (mesma chave de folha) e **`screen_alias`** (`SCREEN_ALIASES`). Vários candidatos: (1) caminho final único cujos demais candidatos são seus ancestrais, (2) raízes do módulo da rotina (`MODULE_ROOTS`), (3) contexto (título + próximos passos) citando radicais de um único ancestral. Persistindo o empate: **`ambiguous`**, e **nada é adivinhado**.
- `planImplicitScreenNavigation` só navega até uma **tela** (folha; submenu é `skip`) que exista **única** na árvore viva (`liveItemForCatalogChain`). A navegação implícita só vale em passo cuja ação é o clique de navegação (`isImplicitNavigationActionable`: `click`/`navigate`): passo de preenchimento (*"Na tela **X**, preencha..."*), lista de opções e alvo implícito (ADR-021) **não navegam** por ela (o executor não passa `menuContext`). Tela já aberta (`isAlreadyOnScreen`, hash da folha) não é renavegada. Cascata que não abriu numa cura implícita devolve o passo ao fluxo normal (não é falha técnica de rota citada).
- Confiança registrada: `exact_leaf` 0,92, `screen_alias` 0,90, `leaf_key` 0,88. Base: `single_segment_screen`.

#### Camada 3 — Resolutor semântico fechado (`menu-catalog.ts`, `menu-path.ts`, `agy-client.ts`)

- **Determinístico:** `resolveClosedSemantic` pontua os 115 caminhos por radicais **inteiros** (nunca substring) do título + passos 1 a 3: `0,60 × cobertura dos radicais da folha + 0,20 × Sørensen–Dice (folha × título) + 0,10 × cobertura dos ancestrais + 0,10 × bônus de módulo`. Só devolve destino com **pontuação ≥ 0,70** (`CLOSED_SEMANTIC_MIN_SCORE`) **e margem ≥ 0,12** sobre o 2º colocado (`CLOSED_SEMANTIC_MIN_MARGIN`); abaixo, **`SEM_EQUIVALENTE_NA_ARVORE`** com a justificativa e os melhores candidatos.
- **Ancorado no caminho documentado:** para caminhos explícitos, a busca fica restrita ao **maior prefixo documentado que existe no catálogo** (`closedSemanticAnchor(documentedChain)`, `chainUnderAnchor`); âncora vazia = sem restrição. Camada 3 em tela citada sem `>` só roda **na tela inicial** (depois que a rotina abriu uma tela, o negrito pode ser elemento dessa tela).
- **`agy` opcional (só `--visual-mode live`):** `buildClosedSemanticPrompt` envia a lista fechada; `invokeAgyText` (novo em `agy-client.ts`: mesmo `AsyncSemaphore(1)`, timeout e `null` em qualquer falha) devolve texto livre e `parseClosedSemanticAnswer` só aceita **uma cadeia literal da lista** (igualdade do caminho inteiro) ou o token. A resposta ainda precisa estar sob a mesma âncora **e** existir na árvore viva (`planFromAgyAnswer`). Base `closed_semantic_agy`, confiança 0,75. `ORION_MENU_AGY=false` desliga a consulta; falha do `agy` nunca bloqueia.
- **Bloqueio rápido:** caminho explícito dos passos 1 a 3 sem equivalente (`no_equivalent`) termina `[ATT]` na hora, sem explorar menus, com `closedSemantic: { justification, topCandidates }` na evidência da divergência (só evidência; nada foi navegado).

#### Camada 4 — Coerência pós-pouso (`menu-landing-coherence.ts`, `executor.ts`)

- Vale para as curas `explicit_equivalence`, `single_segment_screen`, `closed_semantic` e `closed_semantic_agy` (`COHERENCE_CHECKED_BASES`). O `SmartLocatorResult.menuCure` carrega a base, o texto documentado e a cadeia real.
- Depois do clique, `checkLandingCoherence` lê **somente em leitura**: o `ScreenStructuralInventory` (`att-screen-advisor.ts`), os rótulos curtos da zona de conteúdo (`th`, `label`, `legend`, `h1`-`h5`, botões, abas; navegação excluída) e a entrada do grafo de rotas (`orion-route-graph.json`, ADR-030) do hash alcançado.
- `collectNextStepTargets` reúne os alvos em negrito dos **1 a 2 passos seguintes** (para no próximo caminho `>` ou depois de um botão que troca a tela; descarta rótulos genéricos de ação, os segmentos navegados e listas de opções). `evaluateLandingCoherence` aceita texto idêntico, mesma chave de folha, sinônimo contextual da rota (ADR-029, Camada 0.2) ou frase inteira num rótulo curto.
- **Veredictos:** `coherent` (algum alvo presente: nota *"Coerência pós-pouso (ADR-037)"* na observação do passo); `no_targets` e **`inconclusive`** (inventário ilegível e sem grafo) **nunca bloqueiam**; **`incoherent`**: a cura é descartada, `resetToHome`, o passo vira bloqueio de rota (`menuNavBlockedSteps` → `[ATT]`, nunca dependência de dado) com a evidência `describeIncoherentLanding` (tela alcançada, alvos ausentes, até 15 rótulos lidos) e o **texto do manual sai 100% original**.

### 2.4. Fase 3 — Auditor offline de coerência dos menus (`audit-menu-coherence.ts`)

- **Somente leitura** sobre `auditoria/rotinas/**` e `kb/**`, sem navegador e sem rede. Classifica cada navegação dos passos 1 a 3 em `exact`, `exact_with_spelling_drift`, `canonical_equivalence`, `single_segment`, `closed_semantic`, `ambiguous` ou `no_equivalent`, usando as mesmas funções do executor.
- **Filas de reauditoria:** **A** (bloqueio `[ATT]`/`[XRX]` em passo 1–3 causado por navegação que agora tem destino único no catálogo; `confidence: 'alta' | 'revisar'`, carga `read_only`/`mutation`), **B** (caminho já exato, bloqueio após o passo 3, grade vazia, rótulo interno ausente ou dependência cruzada) e **C** (sem destino único: `navegacao_sem_equivalente` ou `tela_pressuposta`, com os vizinhos mais próximos como laudo). `[DDD]`/`[CCC]` puros só são relatados; rotinas de hardware (`hardware-registry.ts`) nunca entram na Fila A.
- **Saídas:** `auditoria/cache/menu-reaudit-queue.json` (máquina, ignorado pelo Git) e `auditoria/reports/auditoria-caminhos-menus.md` (humano, versionado). `--json-only` não regrava o relatório; `--routines A,B` grava só `menu-reaudit-queue-partial.json`.
- **Números pré-reauditoria (baseline em 2026-11-24, antes da Fase 4 — ver saldo pós-reauditoria na §4):** 169 rotinas auditadas lidas (95 `[ATT]`, 25 `[XRX]`, 18 `[DDD]`, 2 `[ATT][CCC]`, 1 `[CCC]`, 1 `[CCC][XRX]`, 27 validadas). **Fila A 29** (7 `read_only`, 22 `mutation`; **15 de confiança alta**), **Fila B 67**, **Fila C 27** (16 tela pressuposta), **19** `[DDD]`/`[CCC]` fora das filas. Rotinas validadas com navegação 1–3 não exata: **23 de 27** (28 ocorrências). KB ainda não auditado: **302** rotinas (26 com toda navegação exata, 138 precisam de equivalência, 63 sem equivalente/ambíguas, 75 sem navegação nos passos 1–3).
- **Derivas conhecidas** (rotinas validadas, reveladas pelo auditor): caixa **"Reconhecimento de Firmas"** × real **"Reconhecimento de firmas"** (`D-3.11`, `D-4.0`, `R-1.1`, `V-CCA.3.3`); **"Cadastro"** × **"Cadastros"** (`M-8.0`, `Firmas > Cadastros > Cartão de assinatura`); caminhos antigos de **Cadastros auxiliares** sob `Notas`/`Administração`/`Caixa`/`Configurações > Geral`, que no 06.05.02 vivem só em **Configurações > Cadastros auxiliares** (`M-36.0`, `M-40.0`, `M-41.0`, `M-43.0`, `M-60.0`, `M-62.0`, `M-66.0`, `M-67.0`, `M-68.0`, `R-4.0`, `R-18.0`). O manual não é reescrito pelo auditor: a correção editorial continua dependendo da Trava de Evidência ao vivo ou de decisão de Produtos.

### 2.5. Fase 4 — Reauditoria ao vivo da Fila A

- `npm --prefix auditoria run reaudit:menu-queue` (`auditoria/src/reaudit-menu-queue.ts`) lê `menu-reaudit-queue.json`, seleciona a Fila A de **confiança alta** (`--all` para a fila inteira; `--list-only` só imprime a seleção e o comando) e dispara `tsx src/cli.ts --routines <ids> --concurrency 4 --dry-run-mutations --headless` (cwd `auditoria/`). A fila é triagem offline: a cadeia continua candidata até ser lida, percorrida e medida ao vivo.

### 2.6. O que **não** muda

- Caminho de menu inexistente continua **não curado** fora das quatro camadas; a guarda anti-busca da ADR-024 (nenhum `<input>` nem `CTRL + B` em passo de navegação) e o desempate por profundidade da ADR-028 ficam intactos.
- Homônimo indecidível (mesma profundidade ou raízes diferentes sem pista de módulo/contexto) continua **bloqueio por ambiguidade**.
- O catálogo não substitui a leitura ao vivo: `menu-path.ts` continua lendo `buildMenuTreeScript()` em cada rotina.

### 2.7. Super-Contexto (ADR-034): rebalanceamento dos pacotes

Os módulos novos levaram o 02c a 667.949 caracteres e o 03 a 603.438 (acima do teto de 570.000). Rebalanceado sem pacote novo:
- **02a** (`repomix.engine.config.json`) += `menu-path.ts`, `menu-catalog.ts`, `__tests__/adr037-canonical-menu-catalog.test.ts`;
- **02b** (`repomix.engine2.config.json`) += `audit-menu-coherence.ts`, `__tests__/adr037-menu-integration.test.ts`, `__tests__/adr037-menu-coherence-audit.test.ts`;
- **02c** ignora os mesmos arquivos (disjunção exigida pelo `check:context`); **03** ignora os 3 testes da ADR-037;
- `capture-all-menu-prints.ts` entra em `LEGACY_EXCLUDED` (`scripts/upload-to-drive.mjs`).

Resultado medido após `pack:context` (já com esta ADR e a atualização da memória): 01 ≈ 514k (90%), 02a ≈ 551k (97%), 02b ≈ 541k (95%), 02c ≈ 517k (91%), 03 ≈ 550k (97%) — **todos abaixo do teto**, mas acima da meta operacional de 450k. **Próxima ação recomendada:** criar um 6º Google Doc + secret `GDRIVE_FILE_ID_*` e dividir o motor ou os testes antes da próxima ampliação (exige ação humana no Drive e no GitHub; não feito aqui).

---

## 3. Validação

- **Testes offline:** `auditoria/src/__tests__/adr037-canonical-menu-catalog.test.ts` (15 casos: 115 caminhos idênticos às tabelas da seção 4, homônimos sem `"0"`/`"9+"`, tabela explícita apontando só para nós do catálogo, apelidos curados, desempate de homônimos, `SEM_EQUIVALENTE_NA_ARVORE`, prompt fechado e parser estrito), `adr037-menu-coherence-audit.test.ts` (23 casos: classes de navegação, derivas de grafia, Filas A/B/C, `[DDD]` e hardware fora da Fila A, mascaramento de IP, `--tree auto|live|canonical`) e `adr037-menu-integration.test.ts` (32 casos: Camada 2 na árvore viva, passo de formulário sem navegação, Camada 3 explícita e âncora do `agy`, coerência pós-pouso, guarda anti-busca no passo implícito e menu do usuário com texto neutro `Olá, [usuário]`).
- **Catálogo:** `npm --prefix auditoria run menu:catalog` → 115 caminhos finais, 134 nós, 4 homônimos, 14 famílias, 19 submenus conferidos, 0 divergências.
- **Auditor:** `npm --prefix auditoria run menu:audit-coherence` → números da §2.4.
- **Super-Contexto:** `npm run pack:context` + `npm run check:context` com código 0 (§2.7).

## 4. Resultados da Reauditoria (Antes × Depois)

Execução em 24/11/2026: Fila A de confiança alta (15 rotinas), `cli.ts --routines … --concurrency 4 --dry-run-mutations --headless`, ambiente de Produtos. Lote de 33 min, 0 falhas técnicas, 0 re-login (1 sessão reaproveitada, 21 resets leves), 0 registros mock e sincronização Write-Through no Supabase. Antes da reauditoria, as 15 estavam `[ATT]` por "caminho de menu inexistente" no passo 1 ou 2.

**Navegação:** o caminho foi resolvido e clicado ao vivo em **15/15** (14 pela Camada 1, 1 pela Camada 2). A Camada 4 aceitou 5 pousos, sendo 4 por `no_targets` e 1 por `coherent`, e **descartou 10**. Nos 10 descartes, a tela real existe, mas não tem os campos/seções que o manual cita nos passos seguintes: é defasagem editorial do conteúdo, não da rota. Esses 10 seguem `[ATT]` com evidência dupla (manual × elementos lidos na tela alcançada).

| Rotina | Carga | Antes | Camada / base da cura | Depois | Observação |
|---|---|---|---|---|---|
| M-54.0 | mutation | `[ATT]` passo 1 | C1 `Notas > Pedido de certidão` → **Notas > Nova certidão e serviço** | **`validado_com_ajustes`** | Pasta sem tag; 3 prints |
| C-LIVRO-01 | mutation | `[ATT]` passo 1 | C1 `Livros > …` → **Administração > Controle de Livros** | `[XRX]` | Rota superada; depende de D-3.60, D-3.41, C-LIVRO-05 |
| C-LIVRO-02 | mutation | `[ATT]` passo 1 | C1 `Configurações > Livros Notariais > …` → **Administração > Controle de Livros** | `[XRX]` | Idem |
| M-13.0 | mutation | `[ATT]` passo 1 | C1 → **Firmas > Abertura de pedido** | `[ATT]` passo 5 | Rota superada; bloqueio avançou para **Concluir o pedido** |
| M-22.0 | mutation | `[ATT]` passo 1 | C1 `Firmas > Livros` → **Administração > Controle de Livros** (C4 `coherent`) | `[ATT]` passo 2 | Rota superada; **Tipo de Livro** (tela: "Tipo livro") e opções não medidos na zona de conteúdo |
| M-54.1 | mutation | `[ATT]` passo 1 | C1 → **Notas > Nova certidão e serviço** | `[ATT]` (C4) | Tela sem "Dados do pedido de certidão", "Tipo de Certidão", "Solicitante" |
| D-3.15 | mutation | `[ATT]` passo 1 | C1 → **Notas > Consultas > Certidões e serviços** | `[ATT]` (C4) | Tela sem "Reprografia / Imagens do Livro" |
| C-ACESSO-06 | mutation | `[ATT]` passo 1 | C1 → **Configurações > Perfis e permissões de acesso** | `[ATT]` (C4) | Tela sem "Escreventes de Notas" |
| C-ACESSO-07 | mutation | `[ATT]` passo 1 | C1 → **Configurações > Perfis e permissões de acesso** | `[ATT]` (C4) | Tela sem "Auxiliares de Cartório" |
| C-FIRMA-06 | mutation | `[ATT]` passo 1 | C1 → **Configurações > Parametrizações** + aba | `[ATT]` (C4) | Tela sem "Tomador Padrão para Atos Não Identificados" |
| C-FIRMA-07 | mutation | `[ATT]` passo 1 | C1 → **Configurações > Parametrizações** + aba | `[ATT]` (C4) | Tela sem "Materialização de Documento Eletrônico", "Valor dos Emolumentos" |
| C-FIRMA-08 | mutation | `[ATT]` passo 2 | C1 → **Configurações > Parametrizações** + aba | `[ATT]` (C4) | Tela sem "Caminho das Imagens do Balcão de Firmas / Assinaturas" |
| C-LIVRO-05 | read_only | `[ATT]` passo 1 | C1 → **Administração > Controle de Livros** | `[ATT]` (C4) | Tela sem "Escrituras", "Procurações", "Testamentos", "Novo Livro (Abertura)" |
| C-SELO-01 | read_only | `[ATT]` passo 1 | C1 → **Administração > Comunicações > Auditoria de Selos** | `[ATT]` (C4) | Tela sem "Selos com Envio Pendente", "Aguardando Retorno" |
| V-7.2.1 | read_only | `[ATT]` passo 1 | C2 `Editor` → **Notas > Consultas > Editor** | `[ATT]` (C4) | Tela sem "Prévia do Livro", "Prévia de Traslado" |

**Saldo:** 1 rotina destravada, 2 reclassificadas para `[XRX]` (pré-requisito real em outra rotina), 2 com bloqueio adiante da rota e 10 confirmadas como defasagem de conteúdo com prova de tela. Nenhuma falsa aprovação. Validação pós-lote: `verify-all-phase2-boxes.ts` com 0 discrepâncias (Fase 2: 442/442 prints; Fase 3: 307/307 prints). A triagem regenerada ficou com Fila A = 14 (todas "revisar", nenhuma de alta confiança pendente), Fila B = 71 e Fila C = 37. Fila C passou a ter o subtipo **C3 `conteudo_defasado_pos_pouso`**, com as 10 rotinas cuja cura a Camada 4 descartou ao vivo. O auditor offline lê esse veredito no `-revisado.md` e não as devolve à Fila A, para que o `reaudit:menu-queue` não as reprocesse à toa.

**Pendências observadas:** em M-22.0, a Camada 4 casou **Tipo de Livro** ≡ "Tipo livro" por `leafKey`, mas o localizador do passo 2 não aplicou a mesma equivalência. Candidato a sinônimo de rota `#/livro` (ADR-029). Nas abas de **Parametrizações**, o inventário da Camada 4 lê só a aba aberta pela cauda; um campo em outra aba conta como ausente.

## 5. Riscos e Consequências

- **Catálogo envelhece com a versão.** Uma nova versão do Orion TN exige nova captura (`capture-all-menu-prints.ts`), nova transcrição e `menu:catalog`; o `--tree auto` do minerador e a leitura ao vivo do executor protegem contra o catálogo velho, mas o auditor offline passa a classificar contra a versão antiga até a recaptura.
- **Camada 4 é conservadora por desenho:** `inconclusive` não bloqueia, então uma tela cujo inventário não pôde ser lido aceita a cura (a divergência `menu_path_resolution` continua registrada para revisão humana).
- **Limiar da Camada 3** (0,70 / 0,12) foi calibrado sobre o acervo atual; abaixar qualquer um dos dois aumenta o risco de destino plausível porém errado, que só a Camada 4 pegaria.
- **Pacotes do Super-Contexto no limite** (§2.7): qualquer acréscimo relevante a 02a ou 03 volta a estourar o teto.
