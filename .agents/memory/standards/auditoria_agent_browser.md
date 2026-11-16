# Especificação Técnica: Auditoria Visual de Rotinas via Agent-Browser & Sharp

**Status:** ATIVO / HOMOLOGADO  
**Versão Vigente:** BASE V3.2.0 + PIPELINE V2.4 (DOM Real Live + Streaming STDIN + Zona Semântica e União Geométrica + Taxonomia `[ATT]`/`[DDD]`/`[XRX]` + Write-Through & Supabase Realtime)  
**Normas Vinculantes:** ADR-007 a ADR-025  
**Tecnologia:** `vercel-labs/agent-browser` (Rust CLI/CDP Daemon via STDIN) + Node.js (TypeScript/ESM) + `Sharp` (libvips)

---

## 1. Princípios e Regras Inegociáveis

1. **Princípio do DOM Imutável:** O agente nunca injeta CSS, scripts ou elementos visuais no DOM do sistema de homologação. Todas as marcações de moldura e badges são compostas exclusivamente em pós-processamento de imagem pelo motor Sharp.
2. **Preservação do Chunking RAG (ADR-005):** A pasta `kb/` recebe estritamente retificações textuais limpas (preservando o limite estático de 1.800 tokens por chunk do OpenAI Vector Store). As prints e rotinas com imagens embutidas residem no workspace isolado `auditoria/rotinas/`.
3. **Resiliência e Tolerância a Falhas:** Em caso de quebra de fluxo ou botão ausente que não atinja similaridade de 85%, o orquestrador captura o print do erro, grava a tag `status: atualizacao_editorial # ou dependencia_dados_banco / dependencia_cruzada_rotina (ADR-021)` e avança para a próxima rotina.
4. **Zero Coordenadas Estáticas (ADR-012 / ADR-014):** É terminantemente proibido o uso de literais manuais de caixas `{ x, y, width, height }`, tabelas como `NAVBAR` ou imagens de fundo `baseImage`. Toda geometria provém de `getBoundingClientRect()` ao vivo no navegador Chromium.
5. **Sincronização Dinâmica de Abas SPA:** Em passos que alternam abas (ex.: menu lateral de `Configurações` ou abas de `Protocolo`), o executor dispara o clique real na aba e aguarda a visibilidade do contêiner específico antes da medição e captura do passo seguinte.
6. **Streaming STDIN no Windows (ADR-014):** A invocação de scripts JavaScript no `agent-browser` ocorre exclusivamente via pipe em `stdin` (`agent-browser eval --stdin`), eliminando em definitivo o erro de limite de linha de comando (`cmd.exe`).
7. **Filtro de Zona Semântica (ADR-015):** Passos de parametrização/formulário são medidos exclusivamente no contêiner principal de conteúdo; toda zona de navegação (`aside`, `nav`, `.sidebar`, `.nav-stacked`, `[role="tablist"]`...) e todo invólucro que contenha a navegação lateral ficam fora da busca.
8. **União Geométrica de Múltiplos Alvos (ADR-015):** Um passo que referencia vários parâmetros do mesmo bloco é demarcado pela união exata (`minX`, `minY`, `maxX`, `maxY`) dos `DOMRect`s dos nós resolvidos ao vivo — nunca por um contêiner genérico.
9. **Rota de Menu Real (ADR-016):** Caminhos `A > B > C` são percorridos na árvore de navegação real; rota divergente é curada e registrada, rota ambígua bloqueia.
10. **Sem Alvo, Sem Moldura (ADR-016):** Passo sem alvo em negrito recebe screenshot limpo após a verificação de tela carregada; nada é demarcado sem um nó medido ao vivo.
11. **Uma Print, Várias Caixas (ADR-017):** Caminho de menu e passo com vários alvos visíveis na mesma tela geram uma única print com caixas numeradas em sequência.
12. **Privilégio Antes de Tudo (ADR-017):** Rotina que exige perfil não comprovado pela sessão é bloqueada antes do passo 1.
13. **Evidência Estrita (ADR-017):** O texto do manual só muda com elemento real medido e demarcado; sem evidência, texto original e tag de revisão (`[ATT]`/`[DDD]`/`[XRX]`, ADR-021).

---

## 2. Padrões Gráficos de Pós-Processamento (Sharp)

```typescript
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnnotationOptions {
  inputPath: string;       // Screenshot bruto limpo capturado ao vivo
  outputPath: string;      // Destino do print anotado
  box: BoundingBox;        // Coordenadas reais extraídas dinamicamente do DOM
  stepNumber: number;      // Número ordinal do passo
  actionType?: 'click' | 'fill' | 'search' | 'select' | 'check' | 'verify';
  themeColor?: string;     // Default: #ad0505 (Carmesim Siplan)

  // 1. Inset de Lupa / Zoom Callout (para ícones minúsculos <= 44px)
  enableZoomCallout?: boolean;
  zoomFactor?: number;     // Default: 2.5x (interpolação Lanczos3)

  // 2. Badges com Micro-Ícones de Ação (Mouse, Teclado, Lupa, Dropdown, Check)
  showActionIcon?: boolean;

  // 3. Solver Multi-Quadrante Anti-Oclusão (ADR-012)
  domContext?: DOMElementContext;

  // 4. Otimização em Múltiplos Formatos
  exportWebp?: boolean;    // Gera simultaneamente .png e .webp (economia de ~60%)
}
```

* **Moldura:** Retângulo vetorial com cantos arredondados (`rx: 6px, ry: 6px`), borda de `3px` em **Carmesim Siplan (`#ad0505`)**, preenchimento translúcido com opacidade de 10% e padding de respiro de `4px`.
* **Badge Numérico:** Pílula ou círculo em Carmesim Siplan (`#ad0505`), stroke branco de `2px`, micro-ícone SVG correspondente à ação e número do passo centralizado.
* **Solver Anti-Oclusão:** O posicionamento do badge e do rótulo avalia os 4 quadrantes cardinais evitando cobrir o texto interno do botão/campo ou elementos vizinhos.

---

## 3. Estrutura de Diretórios e Nomenclatura

```text
auditoria/
├── auth/
│   ├── session-homolog.json
│   └── session-worker-*.json
├── cache/
│   ├── live-phase2/
│   │   └── [id]-passo-[nn]-raw.png
│   └── phase2-live-telemetry.json
├── rotinas/
│   └── [modulo]/
│       └── [id]-[slug]/
│           ├── [id]-[slug]-revisado.md
│           ├── passo-01.png
│           ├── passo-01.webp
│           └── ...
└── src/
    ├── browser.ts            # Cliente agent-browser com streaming STDIN
    ├── dom-geometry.ts       # Introspecção do DOM real, zona semântica, união de grupo e solver anti-oclusão
    ├── smart-locator.ts      # Política de zona (inferStepZone) e auto-cura A11y validada por zona
    ├── menu-path.ts         # Camada 0: caminho de menu A > B > C na árvore real + Auto-Cura de Rota (ADR-016) + cascata com ponteiro real (ADR-017)
    ├── rbac.ts              # RBAC Gate: perfil exigido x identidade da sessão; alvos bloqueados para o perfil (ADR-017)
    ├── evidence.ts          # Trava de Evidência e prova de presença (ADR-017)
    ├── report.ts            # Gerador único do -revisado.md (ADR-017)
    ├── annotator.ts          # Composição gráfica vetorial via Sharp
    ├── worker-pool.ts        # Worker Pool paralelo com controle de concorrência
    ├── run-phase2-master.ts  # Orquestrador mestre declarativo da Fase 2
    ├── invariants.ts         # Os 8 invariantes em módulo único (validador e Console) (ADR-019)
    ├── mutation-guard.ts     # Trava Segura de Mutação: o que é comando de gravação (ADR-019)
    ├── reveal-explorer.ts    # Exploração Investigativa pré-bloqueio (ADR-019)
    ├── icon-action-resolver.ts # Ações icônicas de grade: olho/lápis/X na 1ª linha (ADR-020)
    ├── help-tooltips.ts      # Ajuda contextual "i": hover não destrutivo (ADR-020)
    ├── screen-snapshot.ts    # Snapshot da tela + Confronto Semântico com evidência dupla (ADR-020)
    ├── governance-disk.ts    # Dupla via de edição/governança em disco (*-revisado.md, ADR-023)
    ├── sync-supabase.ts      # Write-Through por rotina (syncSingleRoutineToSupabase) + sync em lote (ADR-023)
    ├── server.ts             # API REST do Console com dupla via + fila real de reexecução (ADR-023)
    └── verify-all-phase2-boxes.ts # Validação matemática dos 8 invariantes
```

---

## 4. Metadados de Auditoria no Frontmatter YAML

Quando uma rotina é auditada, o bloco `auditoria_ui` é injetado no YAML da versão enriquecida:

```yaml
auditoria_ui:
  data_execucao: '2026-11-12'
  status: validado_inalterado # validado_inalterado | validado_com_ajustes | atualizacao_editorial | dependencia_dados_banco | dependencia_cruzada_rotina (ADR-021)
  carga: read_only # read_only | mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  prints_geradas: 4
```

---

## 5. Filtro de Zona Semântica e União Geométrica de Múltiplos Alvos (ADR-015)

### 5.1. Política de zona por passo (`inferStepZone` em `smart-locator.ts`)

A política é decidida **antes** de tocar o DOM, a partir do texto do passo e do `actionType`, nesta ordem:

| Sinal no passo | Política | Efeito |
| :--- | :--- | :--- |
| Menciona menu, submenu, aba, barra superior/de navegação, painel/menu lateral | `any` | Busca irrestrita (o alvo legítimo é navegação). |
| Verbo de parametrização: defina, preencha, configure, informe, digite, ajuste, parametrize, marque, desmarque, insira, vincule, associe | `content` | Estrita: só o contêiner de conteúdo. Sem alvo ali, o passo não recai sobre a navegação. |
| `actionType` `fill` ou `search` | `content` | Idem. |
| Verbo ambíguo: selecione, escolha, localize, consulte, filtre, pesquise — ou `actionType` `select`/`check` | `content-preferred` | Tenta o conteúdo; só então libera a busca irrestrita (sem união de grupo). |
| Demais (cliques genéricos: Salvar, Concluir, Adicionar) | `any` | Comportamento anterior. |

O manifesto (`StepConfig.zone`) e o passo parseado (`RoutineStep.zone`) podem fixar a política explicitamente.

### 5.2. Resolução da zona no navegador (`buildDOMIntrospectionScript` em `dom-geometry.ts`)

* **Zonas de navegação (`NAV_ZONE_SELECTOR`):** `aside`, `nav`, `.sidebar`, `.navbar`, `.nav-stacked`, `.nav-pills`, `.nav-tabs`, `.menu-lateral`, `.bg-menu-lateral`, `[role="tablist"]`, `[role="navigation"]`, `[role="menubar"]`. O menu lateral de **Configurações** do Orion TN 6.0 é `ul#navConfiguracoes.nav.nav-pills.nav-stacked[role="tablist"]` — não usa `<aside>`/`<nav>`.
* **Contêiner de conteúdo**, resolvido ao vivo nesta ordem:
  1. Modal aberto (`.modal.in`, `.modal.show`, `.modal-dialog`, `[role="dialog"]`).
  2. Coluna irmã da navegação lateral: sobe da sidebar até o ancestral com um irmão visível, lado a lado e **mais largo** (critério de largura, não de área — abas com poucos campos são mais baixas que a sidebar). Em **Configurações**: sidebar em `div.col-md-4`, conteúdo em `div.col-md-20`.
  3. `main`, `[role="main"]`, `#content`, `#main`, `.main-content`, `.content-wrapper`.
  4. `document.body`.
* **Um candidato é rejeitado** em zona `content` se: (a) está dentro de uma zona de navegação; (b) está fora do contêiner de conteúdo; (c) **contém** a navegação lateral (invólucros como a coluna `.col-md-24` que embrulha o menu).
* A telemetria registra `zone`, `zonePolicy`, `contentRoot { selector, strategy, box }` e `lateralNavBoxes`, todos medidos no mesmo frame do alvo.

### 5.3. União Geométrica (`groupTargets`)

1. Cada alvo (seletor CSS ou texto do rótulo) é resolvido dentro da zona. Alvos ambíguos (ex.: **Mostrar configurações do scanner**, que existe nas seções DUT e ITCMD) são desambiguados pelo candidato mais próximo do centroide dos alvos inequívocos — isto é, o do mesmo bloco.
2. Cada nó é expandido ao seu **bloco de campo**: rótulo + controle associado (`label.control`, atributo `for`, ou os irmãos do rótulo dentro da célula do campo); um controle é unido ao seu rótulo.
3. As 4 arestas de cada `DOMRect` são arredondadas para inteiros e a caixa final é `(minX, minY, maxX, maxY)`. Se a união estiver fora do viewport, o membro mais central é rolado para o centro e **tudo é medido de novo** no mesmo frame.
4. A telemetria registra `groupMembers[]` (com a caixa de cada membro), `groupUnionBox` e `unresolvedGroupTargets`. Se nenhum membro for localizado, a medição recai na lista `targets`.

Exemplo de manifesto (`run-phase2-master.ts`):

```typescript
{
  targets: CONFIG_TAB_CONTENT_TARGETS, // fallback, medido só dentro do contêiner de conteúdo
  groupTargets: ['Cor para digitalização do DUT', "Dpi's para digitalização do DUT", 'Mostrar configurações do scanner'],
  zone: 'content',
  actionType: 'select',
  label: 'Defina a resolução (DPI), formato e parâmetros do scanner'
}
```

### 5.4. Ação pós-captura no mesmo nó medido (`executor.ts`)

1. A medição carimba o nó validado na zona com um atributo único (`data-orion-audit-click-<token>` / `data-orion-audit-fill-<token>`) e devolve os seletores em `DOMResolvedGeometry.actionTarget`.
2. `executeStepAction()` confere o carimbo com `AgentBrowserClient.probeActionNode()` (um único nó, visível, fora de zona de navegação quando a medição foi `content`) e só então chama `agent-browser click|fill <seletor do carimbo>`.
3. Sem carimbo válido em zona `content`, a ação é omitida. A busca por nome na Árvore de Acessibilidade só vale para alvos medidos sem filtro de zona.
4. Alvo único: clique no nó medido, preenchimento no controle do bloco de campo. Grupo: clique no primeiro membro clicável, preenchimento no primeiro campo. Passo `verify`: nenhuma ação.
5. O relatório registra `executedAction` por passo. O modo `cli.ts --routine` autentica e trava o viewport antes de executar.

### 5.5. Invariantes do validador (`verify-all-phase2-boxes.ts`)

| # | Invariante |
| :-- | :--- |
| 1 | Confinamento da caixa, do badge e do rótulo no buffer da imagem. |
| 2 | Zero Auto-Oclusão (badge + rótulo × núcleo do elemento = 0 px²). |
| 3 | Zero colisão entre badge e rótulo. |
| 4 | Variância estrutural na região demarcada (componente real de UI). |
| 5 | Paridade dos artefatos (`.png`, `.webp`, marcador no `-revisado.md`). |
| 6 | **Zona Semântica:** passo de política `content` foi de fato resolvido em zona `content`, e toda caixa de zona `content` tem interseção = 0 px² com cada navegação lateral registrada. |
| 7 | **União Geométrica:** a caixa de um grupo é exatamente a união dos seus membros, recortada ao viewport. |


---

## 6. Executor do KB: Rota de Menu, Passos Sem Alvo e Carga (ADR-016)

### 6.1. Camadas do SmartLocator

| Camada | Módulo | O que resolve |
| :-- | :--- | :--- |
| 0 | `menu-path.ts` | Caminho de menu `A > B > C` na árvore de navegação real, com Auto-Cura de Rota. |
| 1 | `dom-geometry.ts` | Medição direta no DOM, sob a política de zona do passo. |
| 2A | `smart-locator.ts` | Árvore de Acessibilidade + sinônimos + Sørensen–Dice, validada por zona. |
| 2B | `smart-locator.ts` | Chamada única ao LLM sobre a árvore compacta (se houver chave). |

### 6.2. Rota de menu

1. `extractMenuPaths()` aceita `**A > B > C**` e `**A** > submenu **B**`; alternativas (*"ou ..."*) são testadas na ordem.
2. `buildMenuTreeScript()` (via `eval --stdin`) devolve o caminho real de cada item de `.navbar ul.nav` e carimba cada `<a>` com `data-orion-audit-menu-<token>-<n>`. Itens `disabled`/`ngx-orion-hide` são ignorados.
3. `chooseMenuItem()`: caminho idêntico → exato; senão a folha (igual ou Dice ≥ 0,80) com mais ancestrais em comum. Empate entre folhas de rotas diferentes → sem escolha (bloqueio).
4. Navegação: `click` no topo, `hover` nos submenus (clique como alternativa), conferindo a visibilidade do próximo segmento. A folha é medida sem rolagem e clicada pelo mesmo nó medido.
5. Rota curada: `SmartLocatorDivergence.resolutionLayer = menu_path_resolution`, status `validado_com_ajustes`, texto do passo com o caminho real e nota *"Divergência de caminho de menu"* no `-revisado.md`.

### 6.3. Tipos de passo no executor

| Tipo de passo | Como é reconhecido | Tratamento |
| :--- | :--- | :--- |
| Descritivo | Nenhum negrito no passo | `probeScreenLoaded()` + screenshot limpo (`captureMode: clean`); bloqueia só se a tela não carregou. |
| Lista de opções | Linha principal sem negrito, opções nos sub-itens (`mainTargetCount === 0`) | Zona `content`, sem Auto-Cura. Na tela: demarca, não aciona. Fora da tela: screenshot limpo + nota. |
| Caminho de menu | Alvo com `>` ou negritos encadeados por `>` | Camada 0 (seção 6.2). |
| Demais | — | Camadas 1 e 2, ação no mesmo nó medido (seção 5.4). Controle desabilitado não é acionado. |

### 6.4. Classificação de carga (`classifyRoutineWorkload`)

`mutation` se: algum passo é `fill`; **ou** algum passo tem alvo/ação de **Salvar**, **Gravar**, **Confirmar**, **Concluir**, **Excluir** ou **Inativar**; **ou** título e passo trazem palavra-chave de cadastro/alteração. Caso contrário, `read_only`. Passos de lista de opções são ignorados na checagem de comandos, porque o executor nunca os aciona.

### 6.5. Divergência de rótulos em passos de múltiplos alvos

Alvo ausente num grupo em zona de conteúdo passa por `reconcileUnresolvedGroupTargets()`: tentativa de cura na Árvore de Acessibilidade (sem reutilizar outro alvo do passo, validada no DOM em zona `content`); se curado, o rótulo real entra na união e no texto do passo; se não, a divergência é `target_not_found`. Em ambos os casos: passo `modified`, rotina `validado_com_ajustes`, nota *"Divergência de rótulo"* e entrada em `auto_cura.divergencias_detectadas` no `-revisado.md`.
---

## 7. Cascata, Multi-Demarcação, RBAC Gate e Evidência Estrita (ADR-017)

### 7.1. Cascata com ponteiro real (`menu-path.ts`)

Os submenus abrem por `.dropdown-submenu:hover > .dropdown-menu`. `openCascadeWithPointer()`:

1. clica o menu de topo (se a lista ainda não estiver aberta);
2. para cada nível: `mouseMove` ao centro do item → trecho horizontal na faixa do item até entrar na lista filha → trecho vertical até a linha do próximo item → centro do próximo item;
3. estaciona o ponteiro na folha e confere, via `readCascade()`, que todos os níveis estão visíveis;
4. alternativas por nível: `hover` por seletor e `focus`; até 3 tentativas.

A medição usa `getDOMGeometry([folha], { zone: 'any', scrollIntoView: false, groupTargets: seletores, actionMember: 'last' })`. A cadeia é conferida de novo após o screenshot.

### 7.2. Multi-demarcação

| Peça | Papel |
| :--- | :--- |
| `DOMResolvedGeometry.callouts` | Alvos numerados medidos no mesmo frame (`index`, `label`, `cssBox`). |
| `buildCalloutsFromGroup()` | Converte os membros de um grupo em demarcações; funde caixas idênticas; exige 2+ campos distintos. |
| `computeMultiAnnotationLayout()` | Solver guloso: 4 quadrantes × 3 alinhamentos × com/sem rótulo; restrições duras de 0 px². |
| `annotateScreenshot({ callouts, softObstacles })` | Desenha N molduras e badges numerados (28×28, sem ícone de ação). |

Badge de alvo único continua exibindo o número do passo. Print `passo-NN-b.png`: alvos que só aparecem após a ação do passo, com a numeração continuando.

### 7.3. RBAC Gate (`rbac.ts`)

| Função | Papel |
| :--- | :--- |
| `extractPrivilegeRequirement(parsed)` | Requisito de perfil a partir do frontmatter ou do texto dos passos. |
| `readSessionIdentity(client)` | Login, nome, cargo e perfis lidos de `localStorage.user_<produto>`. |
| `evaluatePrivilege(req, identity)` | Estados `satisfied` / `restricted` / `inconclusive` / `not_required` (ADR-019). Perfil pleno (`Gerência webFirmas`, `TABELIAO` e `ORION_SESSION_GRANTED_ROLES`) atende a qualquer requisito; só `restricted` bloqueia antes do passo 1. |
| `stripPrerequisiteRoles(passo, req)` | Os papéis em negrito do passo de pré-requisito (**Administrador**, **Tabelião Titular**) deixam de ser alvos de tela. |
| `probePermissionBlockedTargets(client, alvos)` | Alvo de texto **exatamente igual** sob `PERMISSION_MARK_SELECTOR` (`.functionality.disabled`, `.functionality.ngx-orion-hide`, `title` "bloqueada para o seu perfil"). `.ngx-orion-hide` sozinha não é evidência. |
| `buildMissingTargetBlock(...)` | Classifica o bloqueio de alvo ausente: `manual_outdated` (sessão plena), `dry_run_dependent` (comando de gravação omitido antes do passo) ou `missing_target`. |

> **Conta de Homologação Plena (`4tabeliao.scs`):** Validado com Produtos que `4tabeliao.scs` (cargo `TABELIAO`, perfil **`Perfil de acesso - Gerência webFirmas`**) possui **100% das permissões `[x]`** em toda a árvore do Orion TN 6.0 (cf. `auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md` e `glossario_siplan.md`). Portanto, **nunca** classificar a ausência de botões administrativos (como *Redefinir Senha Manualmente* ou *Resetar 2FA* em `C-ACESSO-03`) como *"Insuficiência de Privilégio na Conta de Homologação"*: quando não existem no DOM sob esse perfil pleno, trata-se de **defasagem real do manual** (no Orion TN 6.0, senha e 2FA ficam no menu superior direito `"Olá, [username]"`). O bloqueio por privilégio exige evidência real de bloqueio no DOM (`PERMISSION_MARK_SELECTOR`) ou sessão comprovadamente restrita; identidade ilegível é `inconclusive` e não bloqueia.

Frontmatter de uma rotina bloqueada:

```yaml
auditoria_ui:
  status: requer_revisao_humana
  tipo_bloqueio: 'Insuficiência de Privilégio na Conta de Homologação'
  rbac:
    perfil_exigido: ['Administrador', 'Tabelião Titular']
    origem_requisito: 'passo 1'
    atendido: false
    sessao_usuario: '...'
    sessao_cargo: '...'
    sessao_perfis: ['...']
```

### 7.4. Regra da Evidência Estrita (`evidence.ts`, `report.ts`)

1. O texto do passo é reconstruído a partir do original por `lockStepText()`; só entram `textChange` com `evidence` válida.
2. Evidência válida: nó medido (ou item da árvore de navegação), área > 0, confiança ≥ 0,68, texto real que comprove o novo nome.
3. Alvo casado por texto com mais de 45% do viewport é contêiner genérico: não demarca nem comprova.
4. Alvo sem evidência → passo `blocked`, rotina `[ATT]`/`[DDD]`/`[XRX]`, `tipo_bloqueio: 'Alvo do Manual sem Evidência na Tela'`.
5. Relatório `[ATT]`/`[DDD]`/`[XRX]`: aviso, **Motivo Técnico**, **Roteiro Técnico para Execução Manual** e *"Passo a passo (texto original preservado)"*.
6. Cada divergência do frontmatter traz `texto_alterado` e `evidencia` (fonte, seletor e caixa).
7. Manifesto da Fase 2: texto do KB, capturas em *"Evidências visuais da auditoria"*, `alvos_sem_evidencia` quando houver.

### 7.5. Telemetria e invariante 8

O executor do KB grava `auditoria/cache/kb-telemetry/<id>.json` (uma entrada por print, com `frame`, `callouts`, `captureMode` e `blockKind`). O validador lê as duas fontes; a telemetria do KB supera a do manifesto para a mesma rotina. Invariante 8: numeração sequencial, molduras no canvas, 0 px² de anotação sobre qualquer núcleo, 0 px² entre anotações.

---

## 8. Exploração Investigativa Antes do Bloqueio

A **Regra da Evidência Estrita** (nunca inventar ações ou elementos inexistentes) permanece obrigatória, mas o bloqueio **`[ATT]`/`[DDD]`/`[XRX]` deve ser o último recurso, nunca a primeira reação**:

1. **Gatilhos Reveladores Seguros (Angular SPA):** Antes de concluir que um campo, botão ou seção não existe na tela atual, o agente auditor deve investigar dinamicamente os gatilhos seguros que revelam conteúdo condicional no DOM:
   - Abas internas (`nav-tabs` / `nav-pills`);
   - Accordions ou painéis recolhidos;
   - Botões não destrutivos de modo/expansão (ex.: **Alterar**, **Editar**, **Adicionar**, **Avançado**);
   - Checkboxes ou seletores condicionais que habilitam/renderizam sub-formulários.
2. **Descoberta bem-sucedida:** Se a micro-ação revelar o elemento procurado, capturar a evidência complementar (`passo-NN-b`), classificar a rotina como `validado_com_ajustes` e documentar o sub-passo real descoberto no `-revisado.md`.
3. **Bloqueio definitivo (`[ATT]`/`[DDD]`/`[XRX]`):** Só marcar a tag de revisão (`[ATT]`/`[DDD]`/`[XRX]`) após esgotar as possibilidades seguras da tela e confirmar que o recurso realmente não existe ou foi movido para outro fluxo (caracterizando defasagem do manual).

### 8.1. Implementação (`reveal-explorer.ts`, ADR-019)

1. **Quando roda:** alvo em negrito ausente após DOM direto, rótulos visíveis (`collectVisibleLabelNodes`), sinônimos e ordem das zonas; ou alvo parcial de um grupo que continua ausente após a ação do passo. Não roda em caminho de menu (ADR-016) nem em lista de opções.
2. **Gatilhos (`buildRevealTriggerScript`):** etapa dirigida (o alvo existe oculto no DOM; sobe até o contêiner oculto e acha a aba/cabeçalho que o controla) e etapa enumerada (abas `nav-tabs`/`nav-pills` inativas, `aria-expanded="false"`, botões *Alterar/Editar/Adicionar/Novo/Avançado/Filtros*, checkbox/radio com afinidade ≥ 0,45). Teto de 6 gatilhos (`ORION_REVEAL_MAX_TRIGGERS`). Com `OPENAI_API_KEY` e mais gatilhos que o teto, uma chamada reordena (nunca cria candidato).
3. **Segurança:** nunca aciona controle de gravação/exclusão (`mutation-guard.ts`), nem item da barra superior, nem controle bloqueado; checkbox/radio só em formulário com botão de gravação visível e fora de grade.
4. **Restauração:** cada tentativa sem efeito é desfeita (aba anterior, recolher, desmarcar, fechar modal) e o estado é conferido por impressão digital (rota, modais, aba ativa, expandidos, marcados).
5. **Sucesso:** `passo-NN.png` (ou `passo-NN-b.png`) com o gatilho demarcado e sub-captura com o alvo; divergência `investigative_reveal` com evidência do gatilho e do alvo; texto por molde fixo `**Alvo** (exibido ao abrir a aba **X**)`; rotina `validado_com_ajustes`.
6. **Esgotada:** texto original, `[ATT]`/`[DDD]`/`[XRX]` com a lista dos gatilhos testados em `exploracao_investigativa` no frontmatter.

---

## 9. Trava Segura de Mutação e Sub-capturas (ADR-019)

1. **`--dry-run-mutations`** (ou `ORION_DRY_RUN_MUTATIONS=true`): o comando é localizado, medido, demarcado e fotografado; o clique é omitido. A decisão (`detectCommitCommand`) olha o texto real do nó, o rótulo alternativo (`title`/`aria-label`/`value`), o alvo do manual que a Auto-Cura resolveu e, para botão de ícone, o alvo citado no passo. Registro: `dry_run_mutations` e `comandos_de_gravacao_nao_acionados` no frontmatter, nota no passo, `executedAction.via = 'dry-run'`.
2. **Alvo ausente depois de comando omitido:** `[ATT]`/`[DDD]`/`[XRX]` com `Validação Dependente de Gravação Real`; não se aprova o que não foi visto.
3. **Sub-capturas:** `passo-NN-b.png`/`.webp`, `-c`... (pós-ação, gatilho, alvo revelado), numeração das demarcações continuando a da print anterior. Telemetria do executor do KB: `frame`, `captureKind`, `layout` desenhado, `revealTrigger`.
4. **Invariantes:** `invariants.ts` implementa os 8 (o 8, Multi-Demarcação, agora também no Console). `verify-all-phase2-boxes.ts` audita manifesto e executor do KB, sub-capturas incluídas, e faz a conferência inversa (disco x telemetria x marcadores x pasta gêmea) e a de segurança (nenhum clique em gravação com dry-run).
5. **Console:** as sub-capturas vão em `media.subCapturas[]` (sem coluna nova) pelo `sync-supabase.ts`; `GET /api/rotinas/:id` devolve `steps[].subCapturas[]` com mídia, geometria, demarcações e invariantes de cada uma.
6. **Pool:** cada rotina do lote começa na tela inicial recarregada (`resetToHome`), semáforo de mutação = 1, pastas gêmeas da mesma rotina são removidas, falha técnica não derruba o lote.

## 10. Ações Icônicas de Grade, Ajuda Contextual e Confronto Semântico (ADR-020)

### 10.1. `icon-action-resolver.ts` (Camada 1.5)

| Etapa | Regra |
| :--- | :--- |
| Varredura | 1ª linha de dados da grade (modal aberto tem prioridade; fora de zona de navegação). Unidade de ação = `a`/`button`/`[role=button]` ancestral do ícone (`em`/`i`/`span.glyphicon*`/`halflings*`/`fa-*`). |
| Nome real | `title` → `data-original-title` → `aria-label` → `alt` → texto → classe do ícone (`eye`→Consultar, `pencil`/`edit`→Alterar, `remove`/`trash`/`times`→Excluir). |
| Casamento | nome real igual → sinônimo (`Visualizar/Consultar/Exibir`, `Editar/Alterar/Modificar`, `Remover/Excluir/Apagar`) → só classe do ícone (confiança 0,80). |
| Medição | carimbos `[data-orion-audit-icon-<token>-<n>]` (sem valor: o seletor com aspas perde as aspas no `agent-browser` do Windows) viram `groupTargets` do `getDOMGeometry`, zona `content`; `buildCalloutsFromGroup` numera `(1)(2)(3)`. |
| Ação | `actionTarget` só com UM alvo e negrito na linha principal. Lista de opções: nunca clica (ADR-016). Comando de gravação (**Excluir**): dry-run. |
| Saída | `SmartLocatorResult.gridActions` (`resolved`/`empty-grid`/`no-actions`), divergência `dom_synonym_heuristic` sem `textChange`, rotina `validado_com_ajustes` (`AuditStepResult.adjusted`). |

### 10.2. `help-tooltips.ts`

Ícones `circle-info`, `info-sign`, `fa-info`, `data-toggle=popover|tooltip` (≤ 40 px, teto 8/tela; exclui `asterisk` e `.infotitulo`). `hover` → `.popover-title` + `.popover-content` (ou `.tooltip-inner`) → `mouseMove(2,2)`. Coleta no passo descritivo e após a ação de cada passo; telemetria `helpTooltips[]`; relatório `> [!TIP] **Ajuda da tela — "<título>":** "<texto literal>"`.

### 10.3. `screen-snapshot.ts` (Confronto Semântico)

`readScreenSnapshot()` guarda título, cabeçalhos, colunas, 3 valores da 1ª coluna, rótulos e unidades. `compareManualWithScreens()` (determinístico) emite `unit`, `examples` e `concept` somente com trecho do manual **e** trecho do DOM. Relatório: nota sob a **Descrição** e no passo correspondente; frontmatter `auditoria_ui.divergencias_editoriais[]`. Rotina `[ATT]`/`[DDD]`/`[XRX]` não recebe notas. Telemetria: `screenSnapshots` e `editorialDivergences` na 1ª entrada de `cache/kb-telemetry/<id>.json`.

### 10.4. Cascata resiliente

`menu-path.ts` `captureCascade()`: reabre, mede, fotografa e confere a cascata até 3 vezes antes de desistir.

---

## 11. Taxonomia de Revisão `[ATT]`/`[DDD]`/`[XRX]`, Estado Vazio, Auto-Seed Mock e Alvos Implícitos (ADR-021)

O `[!!!]` genérico foi **aposentado**. Cada rotina que exige revisão humana recebe exatamente uma tag, que identifica quem age:

| Tag | `auditoria_ui.status` | Causa | Quem age |
|---|---|---|---|
| `[ATT]` | `atualizacao_editorial` | Manual cita tela, caminho, botão ou campo inexistente na versão atual; rotas e `reveal-explorer.ts` esgotados. Inclui bloqueio por privilégio (`rbac`). | Equipe editorial |
| `[DDD]` | `dependencia_dados_banco` | Faltam registros no banco de homologação (grade vazia, toast "Não existem ... cadastrados", controles inativos por falta de dado) **sem** `Adicionar` utilizável **e** sem rotina provedora. Também: hardware/Docker/ambiente (`tipo_bloqueio: 'Dependência de Ambiente/Hardware'`), tela inoperante e efeito de gravação omitido pela Trava de Mutação. | Equipe de Produtos |
| `[XRX]` | `dependencia_cruzada_rotina` | Depende da execução prévia de outra rotina que cria o registro/estado (grade vazia com provedor no KB, ou objeto criado fora da tela: protocolo, orçamento, ato...). `rotinas_pre_requisito` e a seção *Rotinas pré-requisito* listam o que rodar antes. | Auditoria (ordem de execução) |

**Falha técnica** (exceção após 2 tentativas) **não recebe tag**: o executor remove a pasta vazia e lança erro; a rotina segue `nao_auditada` e a falha fica em `cache/kb-batch-summary.json` (`falha_tecnica: true`, status `falha_tecnica`).

### 11.1. Módulos

| Módulo | Função |
|---|---|
| `review-taxonomy.ts` | Fonte única: `REVIEW_TAGS`, `REVIEW_PREFIX_RE`, `statusFromPrefix`, `reviewPrefix`, `reviewHeadline`. |
| `review-classifier.ts` | `classifyBlock()`: árvore de decisão única (ver regra 16 do `CLAUDE.md`). |
| `kb-dependency-graph.ts` | Grafo heurístico do KB: provedores (título de criação) × consumidores (tokens da entidade). `npx tsx src/kb-dependency-graph.ts <IDs>` regenera `cache/kb-dependency-graph.json` e imprime os provedores. |
| `empty-state.ts` | `readEmptyState()`, `installToastObserver()`, `countGridRows()`: grade vazia, toast transitório (`MutationObserver`) e controles inativos, tudo via STDIN. |
| `auto-seed.ts` | `autoSeedMockRecord()` (ciclo Adicionar → preencher → Salvar → voltar) e `routineNeedsExistingRows()`. |
| `implicit-targets.ts` | `detectImplicitTargets()`: passo sem negrito → rótulos reais dos campos na zona `content`. |

### 11.2. Auto-Seed

- **Gatilho:** `emptyGrid` **e** botão Adicionar/Novo/Cadastrar ativo na zona de conteúdo (carimbado `data-orion-add-stamp`) **e** a rotina tem algum passo que consulta/altera/filtra linhas. Grade com registros: nada é gravado.
- **Campos:** `mock-generator.ts` (`generateMockFieldValue`) escolhe o valor pelo tipo do input e pelo rótulo: CPF/CNPJ válidos, CEP, e-mail, telefone, datas (`dd/MM/yyyy` ou ISO), percentual, valor, número, UF/Cidade, `select`/`ng-select` (1ª opção válida, com releitura para selects dependentes) e texto livre com a marca `AUDIT-MOCK`.
- **Gravação:** só os dois nós carimbados são acionados (abrir cadastro e Salvar/Gravar/Concluir/Confirmar/Cadastrar), **ignorando** `--dry-run-mutations`; confirmação "Sim/OK" de diálogo é aceita. Validação recusada → uma segunda passada preenche os campos inválidos; persistindo, aborta e a rotina cai em `[DDD]` com o motivo.
- **Segurança:** um ciclo por rota e por rotina; serializado entre workers (`serialized()`); nunca Excluir/Inativar; `--no-auto-seed` desliga. A rotina semeada fica `validado_com_ajustes` e registra `registros_mock_criados` (rota, botões, campos, linhas após).

### 11.3. Alvos Implícitos

Passo com `targets.length === 0`, verbo de ação e substantivo de controle: `inferImplicitTerms()` extrai os grupos (município/cidade → `Cidade`; estado/uf → `UF`; data; descrição), `collectFormLabels()` lê `label/legend/placeholder/.ng-placeholder` da zona `content` (nunca cabeçalhos de grade) e `matchImplicitLabels()` casa por igualdade, palavra inteira ou Dice ≥ 0,85, na ordem do DOM. O executor trata o passo como `verify` (nenhuma ação) com `zone: 'content'`, sem Auto-Cura e **sem** reescrever o texto; alvo não confirmado na medição vira print limpa, nunca bloqueio.

### 11.4. Validação (8 invariantes + varredura da taxonomia)

`invariants.ts` e `verify-all-phase2-boxes.ts` conferem, além dos 8 invariantes: nenhuma pasta com prefixo `[!!!]`; prefixo da pasta ≡ `auditoria_ui.status` ≡ `tipo_bloqueio` presente; contagem por tag. Frontend: `lib/status.ts` (`AUDIT_STATUS`, `REVIEW_STATES`, `reviewPrefix`) alimenta badges, filtros, KPIs e o gráfico por fase.

### 11.5. Banco (Supabase), Write-Through e Realtime (ADR-021 / ADR-023)

* **Migrations aplicadas:** `003_review_taxonomy.sql` (CHECK `routines_status_auditoria_check` para `[ATT]`/`[DDD]`/`[XRX]` + migração de linhas legadas) e `004_supabase_realtime.sql` (publication `supabase_realtime` para `routines`, `routine_steps`, `governance_events`, `runner_jobs` e `routine_reviews`).
* **Write-Through por rotina:** `syncSingleRoutineToSupabase(routineId)` em `sync-supabase.ts` é chamada automaticamente dentro de `try/catch` ao final de `executor.ts` (`executeRoutineAudit`), `hardware-pretriage.ts` (`writePreTriagedDddReport`) e das mutações do `server.ts` (`aprovar`, `revisao`, `texto`, `revisoes` e conclusão de `reexecutar`), em dupla via com `governance-disk.ts` (`*-revisado.md`). O comando `npm --prefix auditoria run supabase:sync` fica reservado para carga inicial/recuperação em massa, e `--no-sync` no `cli.ts` desliga o sync apenas em testes offline.
* **Frontend Realtime:** `Orion Audit Console/src/hooks/useSupabaseRealtime.ts` assina `postgres_changes` e invalida com debounce o TanStack Query para atualização ao vivo do Dashboard, Explorador, Estúdio e Fila.

## 12. Fase 3 (118 rotinas) e Recuperação de Worker

* `cli.ts --phase 3` lê `manifests/phase3-manifest.ts` (118 rotinas: firmas 36, selos 24, livros 20, certidões 15, centrais 23). As 7 pré-triadas `[DDD]` de hardware/serviço local (`C-FIRMA-01`, `M-9.1`, `V-CCA.1.3`, `C-SELO-08`, `D-3.6`, `C-CENTRAL-07`, `R-32.1`) são geradas por `hardware-pretriage.ts` sem abrir navegador (`prints_geradas: 0`, texto 100% original, sem telemetria). As demais usam o `BrowserWorkerPool` com a carga do manifesto (`workloadOverrides`). Resumo: `cache/kb-batch-summary-fase3.json`; `--pretriage-only` gera só as 7.
* `verify-all-phase2-boxes.ts --phase 3` (ou `--all`, padrão) restringe aos IDs do manifesto, confere uma pasta por rotina, ausência de pasta gêmea e que as pré-triadas têm `[DDD]`, `prints_geradas: 0` e nenhuma print em disco; elas ficam fora da conferência inversa disco → telemetria.
* `resetToHome` (`executor.ts`): sai da página anterior via `about:blank` (descarta modal, formulário sujo e `beforeunload`); se o `open` falhar, reinicia o daemon do worker (estado volta do `--state`) e repete. Motivo: após uma rotina falhar com modal aberto, o renderer deixava de responder e todo `open`/`eval` seguinte estourava 30 s, derrubando as rotinas restantes do worker.
* **Escopo de Modal Ativo (`modal-scope.ts`, resolvido)**: o Orion TN 6.0 tem o modal Bootstrap (`.modal.in`) e o modal leve próprio (`#modalFichaRegistra`: `orion-lightweight-modal orion-lightweight-in in`, sem a classe `.modal`, e que ignora `Esc`). `ACTIVE_MODAL_SELECTOR` é a fonte única para medição (`dom-geometry.ts`), Exploração Investigativa, auto-seed (raiz = modal visível mais externo) e `resetToHome`. Com modal visível no topo, a resolução de alvos fica no modal e `isBehindModal` (`document.elementFromPoint` no centro do nó) rejeita nó de fora cujo centro é interceptado pelo modal/backdrop; sem modal o filtro é inerte. `closeActiveModals` fecha o formulário por X/Cancelar/Fechar quando o ciclo do auto-seed é abortado, sem gravar. Corrigiu o `V-CCA.3.3` (moldura sobre região vazia) e os cliques cobertos de `R-1.1`, `D-3.11` e `R-10.0`.
* **Clique em passo de vários alvos (`executeStepAction`)**: o nó medido só é clicado se o seu texto é exatamente um dos alvos citados; casamento parcial (ex.: alvo "Protocolo" -> botão **Agenda de protocolos**, que abre o modal da agenda) é omitido com motivo registrado. Alvo documentado terminado em `:` (título de bloco) nunca é clicado nem tem o substituto curado clicado. Corrigiu o `V-6.2.3`.
* **Trava de Viewport por passo (`browser.ts` `ensureViewport`)**: antes de medir cada passo e no reset, confere `innerWidth x innerHeight @ DPR` (DPR com tolerância 0,01: o Chromium reporta `1.0000000149`) e reaplica 1440x900. Um passo que abre nova aba/janela deixava o worker em 1803x915 para as rotinas seguintes (58 prints em 27 rotinas na 1ª execução da Fase 3). O invariante 1 agora confere as dimensões reais do PNG entregue.
* Estado final da Fase 3 (118 rotinas, validador `--phase 3`): 0 discrepâncias, 0 `nao_auditada`, 0 pastas `[!!!]` e gêmeas, 231/231 pares PNG+WebP.

## 13. Passos Externos `[CCC]`, Multi-Tags, Sessão Ativa e Guarda de Navegação (ADR-024)

### 13.1. Escopo de passo (`step-scope.ts`)

* `executeRoutineAudit` lê a rotina inteira **antes de abrir o navegador** (`stampStepScopes`) e grava `scope: 'external_portal' | 'orion_tn'` (e `externalPortal`) em cada `RoutineStep`. Máquina de estados: começa `orion_tn`; um passo com **verbo de acesso + portal externo** (SISCOAF, e-Notariado, SIGNO/CENSEC, CRC, CNB, Receita Federal, Serasa/SPC, DOI, SINTER, SIRP, ONR/SAEC, e-CPF, URL) ou com **ferramenta externa** (programa validador da Receita, Notepad++/Bloco de Notas) vira `external_portal`; continua externo até o passo que **retorna explicitamente** ao sistema (*"No **Orion TN**, acesse..."*, *"Retorne ao Orion TN"*). Citar a central como módulo (*"Comunicações > CENSEC CTP"*) **não** é portal externo.
* Passo `external_portal`: **nenhuma ação, medição ou screenshot**. O executor registra o resultado (`stepScope`) e segue. A execução ao vivo começa no primeiro passo `orion_tn` (ex.: passo 4 da `C-CENTRAL-02`). Rotina 100% externa não abre o navegador. O RBAC Gate só considera os passos do Orion TN (*"o Tabelião Titular acessa o portal"* é privilégio do portal), e o bloqueio por RBAC fotografa o 1º passo `orion_tn`, nunca um passo externo.
* `-revisado.md`: texto original intacto + `> [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** ...` por passo, resumo no topo, e no frontmatter `auditoria_ui.etapas_externas` (`passo`/`portal`) e `tipo_bloqueio: 'Dependência de Comunicação/Portal Externo'`. `report.ts` localiza o resultado do passo por `stepNumber` (não por posição).
* Validação: `auditExternalSteps` (`invariants.ts`) **aceita** passo externo sem `passo-NN.png` (não é erro de paridade) e **recusa** marcador/arquivo de print em passo externo (evidência falsa), callout ausente e `etapas_externas` sem `[CCC]` em `review_tags`. `verify-all-phase2-boxes.ts` e `GET /api/rotinas/:id` (`passosExternos`) usam a mesma função.

### 13.2. `[CCC]` e múltiplas tags (`review-taxonomy.ts`)

* `[CCC]` = `comunicacao_externa`. **Não bloqueia**: sozinha, a rotina tem as etapas do Orion TN validadas com prints e texto revisável pela Evidência Estrita. Com bloqueio no Orion TN vira `[ATT][CCC]` (texto original preservado, como em todo bloqueio).
* Ordem canônica **`ATT, CCC, DDD, XRX`**, sem espaço entre colchetes: `[ATT][CCC] C-CENTRAL-02-...`. O `status` do relatório é o **principal** (`ATT`/`DDD`/`XRX` têm precedência sobre `CCC`) e `auditoria_ui.review_tags` guarda a lista completa. Funções: `reviewTagsPrefix`, `tagsFromPrefix`, `primaryStatusOf`, `isBlockingReviewStatus`. `removeTwinRoutineFolders`, a limpeza de variantes antigas de pasta (`executor.ts`, `run-phase2-master.ts`) e o validador varrem a pasta do módulo por `stripReviewPrefix`, e não por lista fixa de prefixos.
* Supabase: `005_multi_tags_and_ccc.sql` (a 004 já é o Realtime) — novo valor no CHECK de `status_auditoria`, `routines.tags_revisao TEXT[]` (CHECK `<@ {ATT,CCC,DDD,XRX}`, índice GIN), `routine_steps.step_scope` (`orion_tn`/`external_portal`) e `portal_externo`. `sync-supabase.ts` grava as três. `003` também lista `comunicacao_externa` para que reaplicar a migração não quebre.
* Console: `lib/status.ts` (`REVIEW_TAG_ORDER`, `tagsOf`, `sortTags`, `reviewPrefix(status, tags)`), `AuditStatusBadge` (badge do status principal + chip por tag adicional), filtro `tag` (API `tagRevisao`) que enxerga as tags adicionais, KPI/legenda `[CCC]`, `StepComparisonCard` com o callout do passo externo.

### 13.3. Sessão ativa e reset leve (`auth.ts`, `executor.ts`)

* `isSessionActiveInPage(client)`: só lê a página atual (URL em `/webPortal` ou `/webFirmas`, menu **"Olá, ..."** visível e **sem** `#username`/`#password`/`input[type=password]`). `ensureAuthenticated` e `loginOrion` a consultam **antes** de abrir qualquer URL ou refazer o WildFly SSO (`loginOrion(client, { force: true })` ignora). Contadores `authStats()` (logins reais, sessões reaproveitadas, resets leves/completos) saem no resumo do lote.
* `resetToHome`: com a sessão ativa, `tryLightReset` apenas fecha os modais (`closeActiveModals`, inclui `.orion-lightweight-modal`) e volta ao início por hash (`#/inicio`, derivado de `ORION_APP_HOME_URL`), sem `about:blank`, sem recarregar `/webFirmas` e sem login. Se o worker estiver no portal (`/webPortal`), entra no módulo com a mesma sessão. Qualquer sinal de estado sujo (modal que não fecha, rota diferente do início, tela com erro) devolve `false` e o reset completo antigo assume.

### 13.4. Guarda contra falsa cura de menu (`navigation-guard.ts`, `menu-path.ts`, `smart-locator.ts`)

* Incidente `D-3.14`: *"Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**"* foi curado (96%) para a busca global (*"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"*). Causa: o sinônimo `+` de "Novo" casava por substring com `CTRL + B`.
* Regras: (1) passo de **navegação estrita** (caminho `A > B` ou *"Acesse o menu/submenu"*) nunca casa com `<input>`, `<textarea>`, `role=textbox|searchbox|combobox|spinbutton` — filtrado nos candidatos da árvore de acessibilidade, no fallback LLM, **depois da medição** (`forbiddenMeasuredReason`) e no clique legado por `ref`; (2) a busca global (`CTRL + B`) só é alvo se o próprio passo a cita; (3) sinônimo de símbolo (`+`) só casa por igualdade exata (`synonymMatchesNode`); sinônimo de palavra, por palavra inteira.
* `resolveAndNavigateMenuPath` agora **sempre** devolve resultado quando o passo cita caminho: `menuPathMissing` (caminho inexistente) com `buildMenuPathMissingEvidence` — maior prefixo real, filhos reais do último nível, folha homônima em outra rota e total de itens lidos — ou `menuPathOpenFailed` (a árvore está lá, mas a cascata não abriu: **falha técnica retentável**, sem tag). Com `menuPathMissing`, a Camada 2 (similaridade/sinônimo/LLM) fica **proibida**; só a medição exata do DOM (Camada 1) ainda vale. O bloqueio sai `[ATT]` (`manual_outdated`) com a evidência no `Motivo Técnico` e no `errorMessage`.
* Testes offline: `src/__tests__/adr024-external-steps-multitag-guard.test.ts` (21 testes: escopo, taxonomia, guarda, evidência de menu, relatório e validador).

## 14. Ambiente de Produtos, Preflight de VPN, Multi-Aba e Reauditoria Contextual (ADR-025)

### 14.1. Configuração e preflight (`config.ts`, `preflight.ts`, `cli.ts`)

| Variável (`auditoria/.env`, ignorado pelo Git) | Papel |
| :-- | :-- |
| `ORION_BASE_URL` (alias legado `ORION_HOMOLOG_URL`) | URL de entrada: login do portal ou `webPortal/#/produtos`. |
| `ORION_USER` / `ORION_PASS` | Credenciais. **Nunca** em código, ADR, documentação, log versionado ou commit. |
| `ORION_ENV_LABEL` / `ORION_ENV_VERSION` | Rótulo/versão do ambiente gravados em `auditoria_ui.ambiente`/`versao_homologacao` e no histórico. |
| `ORION_AUTO_SEED` | `false` desliga o auto-seed (ambiente compartilhado); `--auto-seed`/`--no-auto-seed` sobrepõem. |
| `ORION_APP_HOME_URL` | Opcional: a URL do módulo é descoberta ao vivo e persistida em `auth/app-home.json`. |

`preflightOrionReachability()` (`fetch` com `AbortSignal.timeout(3000)`, `redirect: 'manual'`) roda no `cli.ts` antes de `--login`, `--routine`, `--routines`, `--phase` e `--reaudit-pending`. Qualquer resposta HTTP prova alcance; erro de rede ou timeout lança `PreflightError` (*"Conecte a OpenVPN da Siplan"*), com o host mascarado (`maskHost`: `10.0.3.x`).

### 14.2. Entrada pelo portal (`auth.ts`)

`loginOrion`: abre a URL de entrada → preenche o login → no `webPortal` clica no card **Orion TN** dentro de `withNewTabDetection` → se o módulo abriu em nova guia, fecha a do portal, move o foco, registra a nova como principal (`setPrimaryTab`) e reaplica o viewport → persiste `origin + pathname + /#/inicio` (`persistDiscoveredAppHome`). `isSessionActiveInPage` aceita o path do módulo descoberto além de `/webPortal|/webFirmas`; a consulta de sessão ativa continua sendo o 1º passo (ADR-024).

### 14.3. Multi-aba (`browser.ts`)

| Método | Papel |
| :-- | :-- |
| `listTabs()` / `parseTabList()` | `tab list --json`; parser tolerante (`[...]`, `{tabs}`, `{data:{tabs}}`; ids numéricos viram `tN`). |
| `switchTab(id)` / `closeTab(id?)` | `tab <tN>` / `tab close [tN]`. O CLI rejeita inteiros puros (`tab 2`). |
| `markPrimaryTab()` / `setPrimaryTab()` | Guia principal da auditoria (preservada por `closeSecondaryTabs`). |
| `withNewTabDetection(action, settleMs)` | Diff de ids antes/depois (o `agent-browser` não tem "wait for popup"); com guia nova: `switchTab`, espera `readyState`, `ensureViewport(1440, 900)`, devolve `{ tabId, url, title }`. |
| `closeSecondaryTabs()` | Fecha todas menos a principal e devolve o foco. Chamada no início do `resetToHome`. |

* **Clique do passo** (`executeStepAction`): só usa `withNewTabDetection` quando `probeActionNode` marca `opensNewTab` (`target="_blank"`, `window.open` em `onclick`/`ng-click`, ou link dirigido por JS sem `href` com texto *"Clique aqui..."/"Acessar..."*: o handler do Angular não aparece como atributo), evitando listar guias a cada clique. `ExecutedStepAction.openedTab` e `KbStepTelemetry.tab` `{ id, url, title, openedAtStep }` registram a guia.
* **Gatilho de sub-portal** (`reveal-explorer.ts` `openSubportalLink`): levanta links `_blank`/`window.open` **e links dirigidos por JS com texto de chamada para navegação** (fora da barra de menu, não bloqueados pelo perfil, nunca `disabled`/`disabled-no-events`, sem texto de gravação), filtra por `subportalAffinityTerms(rótulo, passo + alvos ausentes + título/descrição da rotina)` (termos distintivos, com lista de palavras genéricas excluída; nenhum portal fixo no código), fotografa o link (guia de origem), aciona dentro de `withNewTabDetection` e **mantém a nova guia em foco**. Sem guia nova, se a própria guia navegou, volta (`history.back()`). O executor repete `locateAndCaptureWithSelfHealing` do **mesmo passo** na nova guia; o link entra em `passo-NN-b` (`captureKind: 'trigger'`, `revealTrigger.kind: 'subportal_link'`, sem o campo `tab`, pois é da guia de origem) e na trilha `exploracao_investigativa` (`resultado: subportal_aberto`). Se o alvo ainda não existe na guia aberta, o bloqueio segue as regras de sempre, com a nota da guia.
* `RevealTriggerKind` ganhou `subportal_link`; `ExploredTrigger.outcome`, `subportal_opened`.

### 14.4. Reauditoria contextual (`prior-audit.ts`, `executor.ts`, `smart-locator.ts`, `menu-path.ts`, `report.ts`)

| Peça | Papel |
| :-- | :-- |
| `loadPriorAuditContext(id)` | Lê o `-revisado.md` mais recente (`findRevisedMarkdownById`) e `cache/kb-telemetry/<id>.json` **antes** da limpeza da pasta (`executor.ts`). |
| `PriorAuditContext` | `status`, `tags`, `ambiente`, `block { stepNumber (telemetria), kind, tipo, motivo (corpo) }`, `targetHints[]` (cura com confiança ≥ 0,68 e elemento real localizado), `menuChains[]` (rota real de `menu_path_resolution`), `editorial[]`, `history[]`. |
| `SmartLocateOptions.priorHints` | **Camada 0.5**: depois da medição do alvo documentado e do gate de healing, só em passo de alvo único; mede a dica ao vivo com as mesmas guardas (contêiner genérico, navegação estrita, zona). Acerto → divergência documentado→real + `SmartLocatorResult.priorHint`; erro → Camada 2 sem penalidade. |
| `chooseMenuItem(paths, items, priorChains)` | Depois do casamento exato e antes da similaridade: aceita a rota comprovada se ela **existe na árvore lida agora**, o item não está bloqueado e a folha segue ≥ 0,80 do manual (`viaPriorAudit`, `exact: false`). |
| `buildReauditHistoryEntry` / `mergeHistory` | `bloqueio_superado`: `true` se deixou de bloquear ou passou do passo anterior; `false` se bloqueia no mesmo passo ou antes; `null` sem bloqueio anterior. Últimas 10 entradas. |
| `report.ts` | `auditoria_ui.historico_reauditoria` (YAML) e `#### Evolução da Reauditoria` (Antes → Depois). Telemetria: `reaudit` na 1ª entrada; resumo do lote: `status_anterior`, `bloqueio_superado`, `curas_reaproveitadas`. |

**Princípios:** a dica acelera e estabiliza, **nunca comprova** (evidência = nó medido nesta execução); o texto do manual só muda pela Trava de Evidência; nota editorial anterior só permanece se o confronto semântico a reproduz agora; `historico_reauditoria` vai em `auditoria_ui` (JSONB) **sem migration**.

### 14.5. Lote de reauditoria e proteção de hardware (`hardware-registry.ts`, `cli.ts`)

`listHardwareRoutineIds()` = rotinas com `hardwarePreTriage.isHardwareDependent` no manifesto da Fase 3 (7) ∪ relatórios em disco com `tipo_bloqueio: 'Dependência de Ambiente/Hardware'` e `prints_geradas: 0` (as da Fase 2). `selectPendingRoutineIds()` = última auditoria em disco `[ATT]`/`[DDD]`/`[XRX]`/`[CCC]` menos as de hardware. `cli.ts --reaudit-pending [--list-only]` roda o lote (resumo em `cache/kb-batch-summary-reauditoria.json`); `--routines` ainda força qualquer rotina.

### 14.6. Testes offline

`src/__tests__/adr025-prior-audit-multitab.test.ts` (37 testes, incluindo a validade sintática do script injetado): parser do contexto anterior com fixtures no formato real, `historico_reauditoria` (YAML + seção), `parseTabList`, afinidade do sub-portal, `chooseMenuItem` com rota comprovada (empate real, rota inexistente, guarda da ADR-024, item bloqueado), Camada 0.5 com cliente falso, preflight (host mascarado) e seleção sem hardware.
