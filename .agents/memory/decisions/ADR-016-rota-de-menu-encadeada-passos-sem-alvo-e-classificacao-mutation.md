# ADR-016: Navegação Encadeada por Segmentos com Auto-Cura de Rota, Passos Sem Alvo e Classificação `mutation` por Comando de Gravação

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-13
* **Contexto:** Destravar o executor guiado pelo KB (`cli.ts` / `executor.ts` / `worker-pool.ts`) antes da Fase 3
* **Complementa:** ADR-010 (Anti-Mock e `[!!!]`), ADR-013 (Worker Pool e SmartLocator) e ADR-015 (zona semântica e ação no nó medido)

---

## 1. Contexto e Problema

A ADR-015 (seção 4.4, limites 5 e 6) registrou que nenhuma rotina real de consulta da Fase 2 concluía pelo executor do KB, por três causas alheias à zona semântica:

1. **Caminho de menu num único alvo.** O passo 1 típico do KB é *"Acesse o menu **Notas > Cadastros auxiliares > Perfil de partes**"*. Esse texto não existe na tela: cada segmento é um item da árvore de navegação, e o caminho documentado muitas vezes diverge do menu real (a tela fica em **Configurações > Cadastros auxiliares**).
2. **Passos descritivos sem alvo em negrito** (*"Na listagem principal, visualize..."*) não tinham o que localizar e bloqueavam a rotina com `[!!!]`.
3. **Classificação de carga pelo título.** `classifyRoutineWorkload` só marcava `mutation` quando o título tinha palavra-chave; rotinas que clicam em **Salvar** (`C-ACESSO-04`, `M-16.6`) iam para a fila paralela `read_only`.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Navegação Encadeada por Segmentos com Auto-Cura de Rota (`menu-path.ts`, Camada 0 do SmartLocator)

1. **Extração (`extractMenuPaths`).** Reconhece as duas formas do KB: um único negrito com separadores (`**A > B > C**`) e negritos encadeados por `>` (`**Configurações** > submenu **Usuários**`). Alternativas (*"ou **X > Y**"*) viram caminhos adicionais, testados na ordem do texto.
2. **Árvore real (`buildMenuTreeScript`).** Um script via `eval --stdin` percorre a navegação superior (`.navbar ul.nav`), devolve o caminho real de cada item e carimba cada `<a>` com um atributo único (`data-orion-audit-menu-<token>-<n>`). Itens com `disabled` ou `ngx-orion-hide` (sem permissão) são ignorados.
3. **Escolha (`chooseMenuItem`).**
   * Caminho idêntico ao documentado → rota válida, sem divergência.
   * Caso contrário, **Auto-Cura de Rota**: a folha documentada é procurada em toda a árvore (texto igual após normalização, ou Sørensen–Dice ≥ 0,80) e vence a que compartilha mais segmentos ancestrais com o manual.
   * **Ambiguidade bloqueia.** Folhas homônimas em rotas diferentes com a mesma pontuação (ex.: **Protocolos**, **Consultas**) não são adivinhadas: o passo segue o fluxo normal e bloqueia com `[!!!]`.
4. **Navegação com interação real.** Clique no menu de topo, hover nos submenus (clique como alternativa), conferindo a cada segmento que o próximo ficou visível. Um menu já aberto por passo anterior não é fechado.
5. **Medição e ação.** A folha é medida ao vivo pelo seu carimbo (sem rolagem, que fecharia o menu), a print mostra o menu aberto com a folha demarcada, e o clique usa o mesmo nó medido (ADR-015 §2.4).
6. **Registro da divergência.** Rota curada gera `SmartLocatorDivergence` com `resolutionLayer: 'menu_path_resolution'`; a rotina fica `validado_com_ajustes`; o `-revisado.md` traz o caminho real no texto do passo, uma nota *"Divergência de caminho de menu"* e a entrada em `auto_cura.divergencias_detectadas`.

### 2.2. Passos sem alvo em negrito (leitura/conferência)

1. **Passo descritivo** (nenhum negrito no passo): não há busca nem Auto-Cura. O executor confere a tela com `probeScreenLoaded()` — documento completo, sessão fora do login/portal, área de conteúdo visível e não vazia, nenhum alerta de erro — e grava o **screenshot limpo** (PNG + WebP), sem moldura, badge ou rótulo. O passo fica `ok` com `captureMode: 'clean'` e a rotina avança.
2. **Só a falha de carregamento bloqueia.** Se a verificação de tela falhar, o passo é `blocked` com o motivo e a rotina recebe `[!!!]`.
3. **Passo que só lista opções** (linha principal sem negrito, opções nos sub-itens: *"Na linha do registro, execute a ação desejada: **Visualizar** / **Editar** / **Inativar**"*), identificado por `RoutineStep.mainTargetCount === 0`:
   * busca restrita à zona `content` e **sem Auto-Cura** — uma opção ausente nunca é "curada" para outro elemento;
   * opções na tela → demarcadas (união de grupo), mas **nenhuma é acionada**: o executor não escolhe entre alternativas, muito menos **Inativar**;
   * opções fora da tela (ex.: grade vazia) → screenshot limpo e nota no `-revisado.md`, sem bloqueio.
4. **Controle desabilitado não é acionado.** `probeActionNode()` informa `disabled`; a ação é omitida e registrada (ex.: **Filtrar** aguardando campo obrigatório), em vez de estourar o tempo limite do clique.

### 2.3. Classificação `mutation` por comando de gravação (`worker-pool.ts`)

`classifyRoutineWorkload` passa a retornar `mutation` quando **qualquer passo** tem alvo em negrito com **Salvar**, **Gravar**, **Confirmar**, **Concluir**, **Excluir** ou **Inativar** (palavra inteira, sem acento/caixa), ou cita um desses comandos sem negrito junto de verbo de acionamento na mesma frase. Vale independentemente do título. As regras anteriores (passo `fill`; título + passo com palavra-chave) continuam.

**Exceção — listas de opções (complemento de 2026-11-13).** Um passo de lista de opções (`mainTargetCount === 0` com alvos nos sub-itens) é desconsiderado nessa checagem: o executor nunca aciona essas opções (seção 2.2, item 3), então um **Inativar** citado só ali não grava nada. Rotinas de consulta como `M-43.0` voltam à fila paralela `read_only`. Um comando de gravação em qualquer outro passo continua tornando a rotina `mutation`.

### 2.4. Divergência de rótulos em passos de múltiplos alvos (complemento de 2026-11-13)

Um passo em zona de conteúdo com dois ou mais alvos é demarcado pela união dos alvos que existem (ADR-015). Antes, um alvo ausente ficava só em `unresolvedGroupTargets` e o passo passava como `ok`. Agora `reconcileUnresolvedGroupTargets()` (`smart-locator.ts`) trata cada alvo ausente:

1. **Tentativa de cura.** Auto-Cura na Árvore de Acessibilidade (sinônimos + Sørensen–Dice ≥ 0,68), descartando candidatos que já são outro alvo do passo (um rótulo ausente não pode ser "curado" para o botão vizinho) e validando o candidato no DOM dentro da zona `content`. Não se aplica a listas de opções.
2. **Curado:** o rótulo real entra no grupo, a união é medida de novo (a moldura passa a cobri-lo), o texto do passo é corrigido e a divergência é registrada com a camada da cura.
3. **Não curado:** divergência `resolutionLayer: 'target_not_found'`, confiança 0.
4. **Em ambos os casos** o passo fica `modified`, a rotina `validado_com_ajustes`, e o `-revisado.md` ganha uma nota *"Divergência de rótulo"* por alvo e a entrada em `auto_cura.divergencias_detectadas` (`elemento_real: '(não localizado na tela)'` quando não curado).
5. As medições de validação deslocam o carimbo de ação; por isso a última medição antes da captura é sempre a do grupo (ADR-015 §2.4 preservada).

### 2.5. Ajuste correlato

`cli.ts --routine` autentica, trava o viewport e abre a tela inicial antes de executar (registrado na ADR-015 §4.5).

---

## 3. Regras Derivadas (vinculantes)

1. Caminho de menu é resolvido na árvore de navegação real, nunca por busca do texto completo do caminho.
2. Rota divergente é curada e **registrada**; rota ambígua ou folha inexistente bloqueia com `[!!!]`. É vedado escolher entre folhas homônimas empatadas.
3. Passo sem alvo recebe screenshot limpo. É vedado desenhar moldura, badge ou rótulo sem um nó medido ao vivo (ADR-010, ADR-014).
4. O executor não aciona opções alternativas listadas em sub-itens nem controles desabilitados.
5. Rotina com comando de gravação/exclusão é `mutation` e passa pelo semáforo restrito (ADR-013).

---

## 4. Resultados Homologados (2026-11-13, viewport 1440×900, DPR 1.0)

### 4.1. `cli.ts --routine M-43.0` (Gerenciar Perfil de Partes)

Status final: **`validado_com_ajustes`**, carga **`read_only`**, 5/5 passos, 5 pares PNG+WebP, código de retorno 0, 2 divergências registradas (rota de menu no passo 1, rótulo no passo 3).

| Passo | Tratamento | Resultado |
| :--- | :--- | :--- |
| 1. *"Acesse o menu **Notas > Cadastros auxiliares > Perfil de partes**"* | Auto-Cura de Rota (88%) | Navegou **Configurações > Cadastros auxiliares > Perfil de partes**; folha medida em `604,421 239×26`; clique no mesmo nó; rota `#/perfilParticipacao` |
| 2. *"Na listagem principal, visualize..."* | Passo descritivo | Tela íntegra; print sem demarcação |
| 3. *"...campo **Pesquisar por descrição** e clique em **Filtrar**"* | Zona `content`, grupo | **Filtrar** demarcado; **Pesquisar por descrição** registrado como `target_not_found` no relatório (o campo real se chama **Descrição**); clique omitido porque o botão está desabilitado |
| 4. *"Na linha do registro, execute a ação desejada:"* | Lista de opções | Grade vazia: print sem demarcação e nota no relatório |
| 5. *"...clique no botão **Adicionar**"* | Alvo único | Demarcado e clicado no mesmo nó (`1254,234 161×30`) |

Antes da restrição de zona do item 2.2.3, o passo 4 casava **Visualizar** por texto parcial com um link do rodapé — uma demarcação fantasma. A restrição à zona `content` eliminou o caso.

### 4.2. Checagem offline da escolha de rota (árvore real do menu)

| Passo do KB | Resultado |
| :--- | :--- |
| `**Configurações** > submenu **Usuários**` | Exato |
| `**Notas > Cadastros auxiliares > Alíquota**` | Curado → **Configurações > Cadastros auxiliares > Alíquotas** (82%) |
| `**Administração > Cadastros auxiliares > Área de atuação**` | Curado → **Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação** (88%) |
| `**Notas > Cadastros auxiliares > Tipos de anexo**` | Sem correspondência (item não existe no menu) → bloqueio |
| `**Relatórios > Protocolos**` | Ambíguo (duas folhas **Protocolos** empatadas) → bloqueio |
| `**Painel de Controle** > **Dispositivos e Impressoras**` (Windows) | Sem correspondência → fluxo normal |

### 4.3. Classificação de carga (módulos `acesso` e `config`)

`C-ACESSO-04` e `M-16.6` passaram a `mutation`. Com a exceção das listas de opções, ficam `read_only` 12 rotinas: `C-ACESSO-05`, `V-3.4.6`, `C-CONFIG-02`, `C-CONFIG-08`, `M-12.0`, `M-25.0`, `M-34.0`, `M-36.0`, `M-42.0`, `M-43.0`, `M-67.0` e `M-69.0`.

### 4.4. Integridade

`tsc --noEmit` = 0. `verify-all-phase2-boxes.ts` = 154/154 passos nos 7 invariantes, 0 discrepâncias (o manifesto da Fase 2 não usa as camadas novas).

### 4.5. Limites conhecidos

1. **A folha curada pode ser homônima de outra tela.** A confiança mínima é a similaridade da folha; quando só a folha coincide (nenhum ancestral), a confiança fica em 80% e a nota no relatório é o que permite a revisão humana.
2. ~~Alvos de formulário inexistentes num grupo não viram divergência.~~ **Resolvido na seção 2.4.** Limite remanescente: a cura do rótulo depende do nome acessível do controle. No `M-43.0`, o campo **Descrição** não foi oferecido pela Árvore de Acessibilidade como candidato, então a divergência saiu como `target_not_found`, sem sugerir o nome real. A regra cobre grupos em zona de conteúdo; num passo `any` de alvo único os demais negritos continuam sendo alternativas de busca.
3. **A busca textual direta aceita correspondência parcial em `title`/`placeholder` fora da zona de conteúdo.** Foi a origem da marca fantasma do passo 4; está contida para listas de opções, não para passos `any` em geral.
4. **O validador geométrico cobre o manifesto da Fase 2**, não as saídas do executor do KB. Prints `clean` não têm caixa para auditar.
5. **O executor continua clicando em comandos de gravação** (**Salvar**, **Concluir**) quando o passo manda. A classificação `mutation` serializa essas rotinas; não as torna inofensivas ao banco de homologação.
