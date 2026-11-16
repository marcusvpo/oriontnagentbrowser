# ADR-015: Filtro de Zona Semântica (Anti-Sidebar) e União Geométrica de Múltiplos Alvos (Group Bounding Box)

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-12
* **Contexto:** Correção de erro de contexto semântico na escolha do elemento destacado em passos de parametrização da Fase 2 (caso `M-16.2/passo-03.png`)
* **Complementa:** ADR-012 (geometria determinística do DOM), ADR-013 (SmartLocator) e ADR-014 (zero coordenadas estáticas)

---

## 1. Contexto e Problema

Com o motor Sharp (`annotator.ts`) e a geometria do DOM (`dom-geometry.ts`) já alinhados, restava um erro de **decisão**: a caixa era geometricamente perfeita, mas sobre o elemento errado.

**Caso real — `M-16.2`, passo 3** (*"Defina a resolução (DPI), formato e parâmetros do scanner"*): a moldura cobria o menu lateral de **Configurações** em vez dos campos **Cor para digitalização do DUT**, **Dpi's para digitalização do DUT** e **Mostrar configurações do scanner** no painel central.

### 1.1. Causa raiz (medida ao vivo no DOM)

1. **O primeiro alvo do manifesto casava com a coluna do menu.** `CONFIG_TAB_CONTENT_TARGETS` começa por `form .col-md-24`. Na tela de **Configurações**, o primeiro `.col-md-24` do formulário é o invólucro do menu lateral. A telemetria registrava `matchedSelector: "form .col-md-24"`, caixa `25,118 219×756` e `innerText: "Geral\nCaptura e digitalização\n..."`.
2. **O menu lateral não é semântico.** A estrutura real é `div.col-md-4 > div.d-block > div.col-md-24.mb10 > ul#navConfiguracoes.nav.nav-pills.nav-stacked[role="tablist"] > li.aba-configuracoes > a.bg-menu-lateral`, com o conteúdo na coluna irmã `div.col-md-20`. Um filtro restrito a `aside`, `.sidebar` e `nav` não o teria detectado.
3. **O erro era sistêmico, não pontual.** As cinco rotinas que usam abas de **Configurações** (`M-16.2`, `M-16.6`, `M-16.7`, `M-16.10` e `C-ACESSO-04`) tinham o passo 3 sobre a mesma coluna do menu.
4. **O validador não tinha como perceber.** Os 5 invariantes da ADR-012 conferem geometria e artefatos, não a zona da tela: uma caixa sobre a sidebar passava em todos.
5. **A auto-cura tinha o mesmo ponto cego.** A Árvore de Acessibilidade (`snapshot -i`) não carrega zona; o melhor candidato por similaridade podia ser o item de menu homônimo da aba.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Filtro de Zona Semântica

**Política por passo — `inferStepZone()` (`smart-locator.ts`).** Decidida antes de tocar o DOM:

| Sinal no passo | Política |
| :--- | :--- |
| Menciona menu, submenu, aba, barra superior/de navegação, painel/menu lateral | `any` |
| Verbo de parametrização (defina, preencha, configure, informe, digite, ajuste, parametrize, marque, desmarque, insira, vincule, associe) ou ação `fill`/`search` | `content` (estrita) |
| Verbo ambíguo (selecione, escolha, localize, consulte, filtre, pesquise) ou ação `select`/`check` | `content-preferred` |
| Demais passos | `any` |

A intenção de navegação tem precedência: *"No painel lateral, clique na aba **X**"* é `any` mesmo contendo outros verbos. `StepConfig.zone` e `RoutineStep.zone` permitem fixar a política explicitamente.

**Aplicação no navegador — `buildDOMIntrospectionScript()` (`dom-geometry.ts`).** Com `zone: 'content'`:

1. **Zonas de navegação (`NAV_ZONE_SELECTOR`):** `aside`, `nav`, `.sidebar`, `.navbar`, `.nav-stacked`, `.nav-pills`, `.nav-tabs`, `.menu-lateral`, `.bg-menu-lateral`, `[role="tablist"]`, `[role="navigation"]`, `[role="menubar"]`.
2. **Contêiner de conteúdo resolvido ao vivo**, nesta ordem: modal aberto → coluna irmã da navegação lateral → `main`/`[role="main"]`/`#content`/... → `body`. A coluna irmã é o irmão visível, lado a lado e **mais largo** do ancestral da sidebar. O critério é largura, não área: em abas com poucos campos (**E-mail**, **Painel de atalhos**) a coluna de conteúdo é mais baixa que a sidebar, e um critério de área falhava.
3. **Rejeição de candidatos** que (a) estejam dentro de uma zona de navegação, (b) estejam fora do contêiner de conteúdo, ou (c) **contenham** a navegação lateral.
4. **Política estrita não tem fallback para a navegação.** Sem alvo no conteúdo, `getDOMGeometry()` retorna `null` e o passo segue para auto-cura na mesma zona ou para bloqueio `[!!!]` (ADR-010). Só `content-preferred` libera a busca irrestrita — e sem união de grupo, para nunca fundir um item de menu com campos do formulário.

**Auto-cura validada por zona (`smart-locator.ts`).** A Sub-camada 2A passa a devolver o ranking completo de candidatos (≥ 0,68). Cada candidato é medido no DOM sob a política do passo; um item de menu homônimo é descartado e o próximo é testado (até 5). Em política estrita não há fallback por `ref` (`get box`), porque essa caixa não pode ser auditada contra a navegação lateral.

### 2.2. União Geométrica de Múltiplos Alvos

Novo campo `groupTargets` (manifesto e `getDOMGeometry`):

1. Cada alvo (seletor CSS ou texto do rótulo) é resolvido dentro da zona.
2. **Desambiguação por bloco:** quando um alvo tem vários candidatos (ex.: **Mostrar configurações do scanner** existe nas seções DUT e ITCMD), vence o mais próximo do centroide dos alvos inequívocos.
3. **Bloco de campo:** um rótulo é unido ao seu controle (`label.control`, atributo `for`, ou os irmãos do rótulo na célula do campo); um controle é unido ao seu rótulo.
4. **União exata:** as 4 arestas de cada `DOMRect` são arredondadas para inteiros e a caixa é `(minX, minY, maxX, maxY)`. Se a união estiver fora do viewport, o membro mais central é rolado ao centro e tudo é medido de novo no mesmo frame.
5. Membros não localizados ficam em `unresolvedGroupTargets`; a união usa os que existem. Se nenhum existir, a medição recai em `targets`, ainda sob o filtro de zona.

No executor guiado pelo KB (`executor.ts` + `smart-locator.ts`), um passo de zona `content`/`content-preferred` com dois ou mais alvos em negrito é tratado automaticamente como grupo, e o rótulo da anotação vira *"primeiro alvo (+N campos)"*.

### 2.3. Demais ajustes

* **Recorte ao viewport:** toda caixa é recortada à porção visível (`clippedToViewport`). Um contêiner maior que o viewport e já visível não é mais rolado para o seu centro.
* **Telemetria:** `zone`, `zonePolicy`, `contentRoot`, `lateralNavBoxes`, `groupMembers`, `groupUnionBox`, `unresolvedGroupTargets`.
* **Validador com 7 invariantes** (`verify-all-phase2-boxes.ts`):
  * **6 — Zona Semântica:** passo de política `content` resolvido em zona `content`, com interseção = 0 px² com cada navegação lateral registrada.
  * **7 — União Geométrica:** caixa do grupo = união dos membros recortada ao viewport, recalculada no Node por `unionBoundingBoxes()`.
* **Manifesto da Fase 2:** os passos de parametrização das cinco abas de **Configurações** declaram `zone: 'content'` e `groupTargets` com os rótulos reais da tela.

### 2.4. Ação pós-captura no mesmo nó medido (complemento de 2026-11-12)

O filtro passa a cobrir também a **execução** do clique/preenchimento do `executor.ts`, e não só a medição.

1. **Carimbo no nó validado.** Ao final da medição, `buildDOMIntrospectionScript()` grava um atributo único (`data-orion-audit-click-<token>` e, havendo controle de formulário, `data-orion-audit-fill-<token>`) no próprio nó que passou pelo filtro de zona, e devolve os seletores em `DOMResolvedGeometry.actionTarget`. O carimbo anterior é removido a cada medição.
2. **Ação por carimbo.** `executeStepAction()` clica/preenche pelo seletor do carimbo: é o **mesmo nó** medido e demarcado. A busca por nome na Árvore de Acessibilidade deixa de ser o caminho padrão, inclusive em passos curados (o `ref` da árvore podia apontar para um homônimo do menu lateral).
3. **Conferência antes de agir.** `probeActionNode()` exige exatamente um nó visível para o carimbo e, se a medição foi em zona `content`, que ele esteja fora de `NAV_ZONE_SELECTOR`.
4. **Falha segura.** Sem carimbo válido num alvo de zona `content`, a ação é **omitida** e registrada (`executedAction.via = 'skipped'`). A busca legada por nome só subsiste para alvos medidos sem filtro de zona (navegação) ou curados por `ref`.
5. **Qual nó recebe a ação.** Alvo único: clique no nó medido; preenchimento no controle do seu bloco de campo (rótulo → `input`/`select`/`textarea`). Grupo: clique no primeiro membro nativamente clicável (ex.: o botão de *"digite ... e clique em ..."*), preenchimento no primeiro campo. Passo `verify` não aciona nada.
6. **Rastreabilidade.** Cada passo do relatório carrega `executedAction` (`kind`, `via`, seletor, nó, caixa e zona).

O atributo usa o token no **nome** (sem `=` nem aspas) para atravessar o `cmd.exe` intacto, e não altera pixels do screenshot.

---

## 3. Regras Derivadas (vinculantes)

1. Passo de parametrização/formulário **nunca** é demarcado sobre `aside`, `nav`, `.sidebar`, menu lateral ou faixa de abas.
2. É vedado usar contêiner genérico (ex.: `form .col-md-24`, `.panel`) como alvo principal de um passo que nomeia parâmetros; declare `groupTargets` com os rótulos reais.
3. Ao encontrar um novo padrão de menu lateral não semântico, acrescente o seletor em `NAV_ZONE_SELECTOR` — não crie exceção por rotina.
4. A regra de Zero Coordenadas Estáticas (ADR-014) permanece integral: zona, contêiner de conteúdo e união vêm de `getBoundingClientRect()` ao vivo.
5. A ação pós-captura recai sobre o nó carimbado na medição. É vedado refazer a busca do alvo por nome/texto para clicar ou preencher um passo medido em zona `content`.

---

## 4. Consequências e Resultados Homologados

Medições ao vivo no ambiente de homologação em 2026-11-12 (viewport 1440×900, DPR 1.0).

### 4.1. Passo 3 das cinco rotinas afetadas

Antes, as cinco tinham a mesma caixa `25,118 219×756` (coluna do menu lateral, `form .col-md-24`). Depois:

| Rotina | Alvos unidos (`groupTargets`) | Caixa final |
| :--- | :--- | :--- |
| `M-16.2` | **Cor para digitalização do DUT** + **Dpi's para digitalização do DUT** + **Mostrar configurações do scanner** | `267,681 707×50` |
| `C-ACESSO-04` | **Token do cartório** + **Subscription** + **API Key CNB** | `275,414 1124×120` |
| `M-16.10` | **Serviço realizados x Serviços solicitados** + **E-mail** | `275,155 1124×50` |
| `M-16.6` | **Tela** + painel **Campos obrigatórios** + grade **Campos disponíveis** | `259,148 1156×190` |
| `M-16.7` | **Tela** + grade de atalhos | `259,128 1156×94` |

Em todas: contêiner de conteúdo `div.col-md-20` (estratégia `coluna-irma-da-navegacao-lateral`), navegação lateral registrada em `33,118 204×756`, interseção = 0 px², nenhum alvo de grupo não localizado.

### 4.2. Regressão

* Fase 2 completa (`cli.ts --phase 2`): **39/39 rotinas validadas, 0 bloqueadas**, 154 passos.
* Nas 34 rotinas não afetadas, os **134 passos** ficaram idênticos em seletor e caixa à telemetria anterior à mudança.
* Distribuição de políticas nos 154 passos: `any` 95, `content` 34, `content-preferred` 25.
* `verify-all-phase2-boxes.ts`: **154/154 passos nos 7 invariantes, 0 discrepâncias** (59 passos medidos em zona de conteúdo, 5 uniões de grupo).
* `tsc --noEmit`: código de retorno 0.

### 4.3. Sonda do caminho SmartLocator (sem cliques de gravação)

| Passo sintético na aba **Captura e digitalização** | Política | Resultado |
| :--- | :--- | :--- |
| *"Defina os parâmetros de **Captura e digitalização**"* (alvo homônimo do item de menu) | `content` | Não localizado — o item do menu lateral não é mais aceito. |
| *"No painel lateral, clique na aba **Captura e digitalização**"* | `any` | Item do menu lateral, `33,160 204×42` (navegação preservada). |
| *"Defina a **Cor para digitalização do DUT** e os **Dpi's para digitalização do DUT**"* | `content` | União de 2 campos, `267,681 466×50`. |

### 4.4. Limites conhecidos

1. **`inferStepZone` é heurística lexical.** Um passo de navegação redigido sem citar menu/aba e com verbo estrito (ex.: *"Configure em **Parâmetros**"*) seria tratado como formulário e bloqueado em vez de destacar o menu. O bloqueio é a falha segura (ADR-010); a correção é fixar `zone: 'any'` no passo.
2. ~~A ação pós-captura do `executor.ts` localiza o `ref` pelo nome, sem zona.~~ **Resolvido na seção 2.4** (resultados em 4.5).
3. **`cli.ts --routine <id>` segue o markdown do KB, clica de fato em cada alvo (inclusive **Salvar**) e grava em `auditoria/rotinas/<modulo>/<arquivo-do-KB>/`**, que em várias rotinas coincide com a pasta do manifesto. Não use como teste em rotina que grava dados; a regeneração seletiva do manifesto é `run-phase2-master.ts --only=<ids>`.
4. **Texto dos `revisadoPassos` não foi alterado.** Alguns passos revisados ainda descrevem campos que a tela real não tem (ex.: `M-16.10` cita SMTP/Porta/SSL, e a aba **E-mail** só tem periodicidade e endereço). A moldura agora mostra os campos reais; o texto pede revisão editorial à parte.
5. **O executor guiado pelo KB ainda não conclui nenhuma rotina real de consulta da Fase 2** (ver 4.5). Causas, todas anteriores a esta ADR e alheias à zona: (a) o passo 1 traz o caminho de menu inteiro num único alvo (*"**Notas > Cadastros auxiliares > Perfil de partes**"*), que não existe como texto na tela e não é percorrido segmento a segmento; (b) em várias rotinas o caminho documentado diverge do menu real (o item fica em **Configurações > Cadastros auxiliares**); (c) passos sem alvo em negrito (*"Na listagem principal, visualize..."*) não têm o que localizar e bloqueiam. Decisão pendente antes da Fase 3.
6. **`classifyRoutineWorkload` rotula como `read_only` rotinas que clicam em Salvar** (ex.: `C-ACESSO-04`, `M-16.6`), porque só considera mutação quando o título tem palavra-chave. Não confie no rótulo para escolher rotina de teste.
7. **O clique pós-captura do manifesto (`clickTargetAfter`/`clickSelectorAfter` em `run-phase2-master.ts`) continua com busca própria por seletor/texto**, sem carimbo. Hoje só aciona abas, **Adicionar** e **Alterar**.

### 4.5. Ação pós-captura (seção 2.4) — medições de 2026-11-12

**Sonda do alvo homônimo** (aba **E-mail** das **Configurações**: existe o item **E-mail** no menu lateral e o campo **E-mail** no painel central), chamando o `executeStepAction()` real:

| Passo sintético | Política | Nó medido | Nó acionado |
| :--- | :--- | :--- | :--- |
| *"Informe o **E-mail** de destino"* (`fill`) | `content` | `label` `655,155 39×20` | `input` do mesmo bloco, `667,180 157×20`; valor gravado no campo, foco no conteúdo |
| *"Configure o campo **E-mail**"* (`click`) | `content` | `label` `655,155 39×20` | o mesmo `label`; aba ativa inalterada |
| *"No menu lateral, clique na aba **Captura e digitalização**"* | `any` | `a` `33,160 204×40` | o mesmo `a`; aba ativa passou a **Captura e digitalização** |

**Ponta a ponta com `cli.ts --routine M-43.0`** (consulta de **Perfil de partes**): o comando roda sem erro (código 0) e gera o `-revisado.md`, mas a rotina termina em `requer_revisao_humana` no passo 1 pelo limite 5(a)/(b) — não chega a nenhum passo de formulário. Antes desta correção o modo `--routine` nem autenticava: media uma página em branco. `cli.ts` agora autentica, trava o viewport e abre a tela inicial no modo individual.

**Ponta a ponta com roteiro de consulta em formato KB** (5 passos com os rótulos reais da tela, sem Concluir/Salvar), pelo mesmo `executeRoutineAudit()` que o `cli.ts` chama: `validado_inalterado`, 5/5 passos, 5 pares PNG+WebP e `-revisado.md` gerado.

| Passo | Zona | Ação |
| :--- | :--- | :--- |
| *"Acesse o menu **Configurações**"* | `any` | clique no nó medido, `a` `944,1` |
| *"Clique em **Parametrizações**"* | `any` | clique no nó medido, `a` `843,213` |
| *"No menu lateral, clique na aba **E-mail**"* | `any` | clique no nó medido, `a` `33,498` (menu lateral) |
| *"Informe o **E-mail** de destino"* | `content` | preenchimento no `input` `667,180` (painel central), não no item homônimo do menu |
| *"Confira o campo ..."* | `any` | nenhuma (passo de conferência) |

O roteiro e as saídas ficaram fora do repositório (não entram no KB nem em `auditoria/rotinas`).

**Regressão:** 7 rotinas do manifesto regeneradas (`M-16.2`, `M-16.6`, `M-16.7`, `M-16.10`, `C-ACESSO-04`, `M-43.0`, `M-34.0`) — 7/7 validadas; os 154 passos da telemetria idênticos em seletor e caixa ao estado anterior; nenhum carimbo de ação em zona de navegação num passo `content`. `tsc --noEmit` = 0; `verify-all-phase2-boxes.ts` = 154/154 nos 7 invariantes.
