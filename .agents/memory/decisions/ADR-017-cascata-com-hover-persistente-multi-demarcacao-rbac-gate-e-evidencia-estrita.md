# ADR-017: Cascata com Hover Persistente, Multi-Demarcação Numerada, RBAC Gate e Regra da Evidência Estrita

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-13
* **Contexto:** Três falhas estruturais encontradas na inspeção das auditorias da Fase 2 pelo Orion Audit Console: prints únicas em menus em cascata, cegueira de permissão e reescrita de manuais sem evidência
* **Complementa:** ADR-010 (Anti-Mock e `[!!!]`), ADR-011/012 (motor gráfico e solver anti-oclusão), ADR-015 (zona semântica, união geométrica, ação no nó medido) e ADR-016 (rota de menu e passos sem alvo)
* **Substitui em parte:** ADR-016 §2.4 (itens 3 e 4): um alvo não localizado deixa de produzir `validado_com_ajustes` e passa a bloquear com `[!!!]`

---

## 1. Diagnóstico

### 1.1. Menu em cascata

Os submenus do Orion TN abrem por CSS (`.dropdown-submenu:hover > .dropdown-menu`). O submenu existe apenas enquanto o ponteiro está dentro do `li` do submenu ou da sua lista filha (`ul`). Medição ao vivo em **Configurações > Cadastros auxiliares**: item em `x 843–1062, y 135–161`; lista filha em `x 603–844, y 129–687` (abre para a esquerda, com 1 px de sobreposição). O `menu-path.ts` da ADR-016 usava `hover <seletor>`, deixava o ponteiro no nível intermediário, não conferia a cadeia no instante da captura e só media a folha. O `annotator.ts` aceitava uma única caixa por imagem.

### 1.2. Permissão

A aplicação oferece dois sinais reais que o agente ignorava:

* **Identidade da sessão** no armazenamento de sessão da própria aplicação (`localStorage.user_<produto>`): login, nome, cargo e `profileList[].name`. No ambiente auditado: `4tabeliao.scs`, cargo `TABELIAO`, perfis `Perfil de acesso - Gerência web{Caixa,Estoque,Ged,Livros,Pro,Firmas}`.
* **Itens negados ao perfil** marcados no DOM: `li.functionality.disabled` com `title="Esta funcionalidade está bloqueada para o seu perfil"`, ou `li.functionality.ngx-orion-hide` (oculto). A ADR-016 tratava esses itens como inexistentes.

### 1.3. Reescrita sem evidência

A causa principal não estava no SmartLocator. O `-revisado.md` das 39 rotinas da Fase 2 era montado a partir de `revisadoDesc` e `revisadoPassos`, **textos escritos à mão no manifesto** de `run-phase2-master.ts`. O gerador os imprimia sempre, media alvos genéricos (`form`, `.panel-body`, `table`) que sempre existem e gravava `validado_inalterado`. No caso `C-ACESSO-03`, o manual de 7 passos virou 4 passos inventados.

No executor do KB havia uma brecha menor: em passo de navegação com vários negritos, os alvos eram alternativas, e o passo passava como `ok` demarcando o primeiro que existisse.

---

## 2. Decisões

### 2.1. Cascata com ponteiro real e hover persistente (`menu-path.ts`, `browser.ts`)

1. `AgentBrowserClient.mouseMove(x, y)` usa o comando `mouse move` do agent-browser: coordenadas reais do viewport.
2. `openCascadeWithPointer()` abre o menu de topo por clique (um menu já aberto não recebe novo clique) e, de um nível para o seguinte, percorre um corredor em "L" que nunca sai da união `li ∪ ul`: centro do item → trecho horizontal, na faixa do próprio item, até entrar na lista filha → trecho vertical até a linha do próximo item → centro do próximo item.
3. O ponteiro **estaciona na folha**. A folha é descendente de todos os níveis, então mantém a cadeia inteira aberta.
4. Cada trecho é conferido no DOM (`readCascade()`: caixa e visibilidade de todos os níveis num único `eval`). Alternativas se um nível não abrir: `hover` por seletor e `focus` (que aciona o `openSubMenu` nativo). Até 3 tentativas.
5. Todos os níveis são medidos no mesmo frame, sem rolagem, e a cadeia é conferida de novo logo após o screenshot. Cascata instável devolve o passo ao fluxo normal; nunca gera print de menu fechado com caixas.
6. O carimbo de clique vai para a folha (`actionMember: 'last'` na medição de grupo).

### 2.2. Multi-demarcação numerada (`types.ts`, `dom-geometry.ts`, `annotator.ts`)

1. `DOMResolvedGeometry.callouts[]` (`DOMCallout`: índice, rótulo, `cssBox` medido ao vivo) e `AnnotationOptions.callouts[]`. `AnnotationLayoutResult.callouts[]` traz o layout de cada alvo; os campos antigos espelham a demarcação 1.
2. `computeMultiAnnotationLayout()` posiciona moldura, badge numerado e rótulo de cada alvo, em ordem, tratando como obstáculos todos os alvos e todas as anotações já colocadas. Restrições duras, todas 0 px²: anotação sobre o núcleo de qualquer alvo; anotação sobre anotação; qualquer coisa fora do canvas. Sem posição livre para o rótulo, cai para badge sozinho e, por fim, desliza o badge pelas arestas. Listas de menu abertas entram como obstáculos suaves.
3. Onde se aplica:
   * **Caminho de menu:** 1 = menu de topo, 2 = submenu, ..., N = item.
   * **Passo com vários alvos em negrito visíveis na mesma tela:** um número por alvo, na ordem do texto (`buildCalloutsFromGroup()`). Vale também para passos de navegação/clique (`any`), cujos negritos da linha principal deixam de ser alternativas.
   * Alvos que resolvem para a mesma caixa compartilham uma demarcação. Com um único campo distinto, vale a moldura única.
4. **Alvo que só aparece depois da ação do passo** (ex.: *"clique em **A** e depois em **B**"*): é medido após a ação e demarcado numa segunda print, `passo-NN-b.png`, continuando a numeração. Só a primeira ação do passo é executada.
5. O `-revisado.md` ganha a legenda *"Demarcações na print: (1) **A** · (2) **B**"*.
6. O manifesto da Fase 2 mantém a moldura de união da ADR-015 nos passos com `groupTargets`.

### 2.3. RBAC Gate (`rbac.ts`)

1. **Antes do passo 1.** `extractPrivilegeRequirement()` lê o requisito do frontmatter (`perfil_requerido`, `perfis_requeridos`, `pre_requisito_perfil`) ou do texto dos passos (*"privilégios de X"*, *"permissão de X"*, *"com perfil de X"*, *"com usuário X"*, *"utilizando uma conta X"*). `readSessionIdentity()` lê a identidade real. `evaluatePrivilege()` compara por **nome de perfil de acesso**; o cargo é informativo e não concede privilégio.
2. Sem correspondência (ou sem identidade legível): nenhum passo é executado, a rotina sai `requer_revisao_humana` com `tipo_bloqueio: 'Insuficiência de Privilégio na Conta de Homologação'`, uma print limpa da tela e o texto original intacto.
3. **Durante os passos.** Item de menu marcado como bloqueado/oculto para o perfil (`chooseMenuItem()` → `blocked`) e alvo não localizado que exista sob `.ngx-orion-hide` / `.functionality.disabled` (`probePermissionBlockedTargets()`) geram o mesmo bloqueio. Um caminho exato bloqueado nunca é curado para outra rota.
4. `ORION_SESSION_GRANTED_ROLES` (lista separada por vírgulas) permite a um humano declarar papéis que a conta comprovadamente possui sob outro nome de perfil.
5. O relatório registra `auditoria_ui.rbac` (perfil exigido, origem, usuário, cargo e perfis da sessão).

### 2.4. Regra da Evidência Estrita (`evidence.ts`, `report.ts`)

1. `report.ts` é o gerador único do `-revisado.md` para o executor do KB e para o manifesto.
2. O texto de cada passo parte **sempre do manual original**. `lockStepText()` aplica somente substituições pontuais (`textChange`) cuja divergência traga `evidence` válida: elemento medido ao vivo (ou item lido da árvore de navegação), com área, confiança ≥ 0,68 e texto real que comprove o nome que entra no manual. Qualquer outra diferença é descartada e registrada no log.
3. **Contêiner genérico não é evidência.** Um alvo casado por texto que ocupe mais de 45% do viewport é rejeitado na medição direta e na auto-cura (`isGenericContainerMatch()`).
4. **Alvo sem evidência bloqueia.** Alvo em negrito não localizado (nem curado com evidência, nem visível após a ação do passo) deixa o passo `blocked` e a rotina `[!!!]`, com `tipo_bloqueio: 'Alvo do Manual sem Evidência na Tela'`. Cura com evidência rejeitada tem o mesmo efeito.
5. **Rotina `[!!!]` sai com o texto 100% original.** Divergências comprovadas aparecem só como observações (`texto_alterado: false`).
6. `validado_com_ajustes` exige ao menos uma substituição aplicada pela trava.
7. **Manifesto da Fase 2:** `revisadoDesc`, `revisadoPassos` e `dica` ficam `@deprecated` e não são mais emitidos. O relatório traz o texto do KB, as capturas como "Evidências visuais" e só fica `validado_inalterado` se todo negrito do manual tiver sido visto ao vivo em alguma tela capturada (`probeTargetsPresence()`). Caso contrário, `[!!!]`.

### 2.5. Validador (`verify-all-phase2-boxes.ts`)

1. **Invariante 8 — Multi-Demarcação:** numeração sequencial, cada moldura no canvas, 0 px² de anotação sobre o núcleo de qualquer alvo, 0 px² entre anotações.
2. Lê duas fontes: `cache/phase2-live-telemetry.json` (manifesto) e `cache/kb-telemetry/<id>.json` (executor do KB, novo). Como as duas gravam na mesma pasta da rotina, a telemetria do KB supera as entradas do manifesto da mesma rotina, e o runner do manifesto apaga a telemetria do KB ao regenerar.
3. Bloqueios estruturados e prints limpas são contados à parte e passam só pelo invariante 5. Bloqueio estruturado sem `[!!!]` é discrepância.

### 2.6. Ajustes correlatos

* Os dois executores apagam `passo-*.png/.webp` e o `-revisado.md` anteriores da pasta da rotina antes de gravar, e removem a pasta gêmea (`[!!!]` ou sem prefixo) de uma execução anterior.

---

## 3. Regras Vinculantes

1. Submenu em cascata é aberto com o ponteiro real, por dentro da geometria `li ∪ ul`, com o ponteiro estacionado na folha e a cadeia conferida antes e depois da captura.
2. Caminho de menu e passo com vários alvos visíveis na mesma tela geram **uma** print com caixas numeradas em sequência. É vedado gerar uma print por segmento de menu.
3. Nenhuma anotação cobre o núcleo de nenhum alvo da print, nem outra anotação.
4. Rotina que exige perfil que a sessão não comprova é bloqueada antes do passo 1. É vedado auditar ou revisar passos nessa condição.
5. Elemento marcado pela aplicação como bloqueado/oculto para o perfil é bloqueio por privilégio, nunca "inexistente", e nunca é curado para outro elemento.
6. O texto do manual só muda por substituição pontual com evidência no DOM. É vedado emitir texto de passo escrito à mão em manifestos, tabelas ou código.
7. Alvo citado e não comprovado na tela: texto original preservado e rotina `[!!!]`.

---

## 4. Resultados da Validação (2026-11-13)

| Verificação | Resultado |
| :--- | :--- |
| `tsc --noEmit` | código de retorno 0 |
| `verify-all-phase2-boxes.ts` | 150/150 prints nos 8 invariantes (147 do manifesto, 3 do executor do KB), 0 discrepâncias |
| `cli.ts --routine C-ACESSO-03` | RBAC Gate reprovado antes do passo 1; `[!!!]`, 1 print limpa, 7 passos originais intactos |
| `run-phase2-master.ts --only=C-ACESSO-03` | mesmo bloqueio pelo runner do manifesto; `revisadoPassos` não emitido |
| Fixture **Configurações > Cadastros auxiliares > Natureza** | cascata de 3 níveis aberta; 3 caixas numeradas numa print; 0 px² de oclusão e de colisão |
| Fixture **Configurações > Cadastros auxiliares > Pessoa física > Profissão** | cascata de 4 níveis; 4 caixas numeradas numa print; 0 px² |
| Fixture **Notas > Cadastros auxiliares > Naturezas** | rota curada com evidência `menu-tree` (82%); `validado_com_ajustes`; `texto_alterado: true` |
| Fixture **Administração > Controle de Estoque > Aquisição** | item bloqueado para o perfil; `[!!!]` por privilégio, sem cura de rota |
| `cli.ts --routine M-43.0` | passo 1 com 3 caixas numeradas; passo 3 sem evidência para **Pesquisar por descrição**; rotina agora `[!!!]` (antes `validado_com_ajustes`) |

Com as fixtures presentes, o validador auditou 3 prints de multi-demarcação (10 caixas) sem discrepâncias. As fixtures ficaram fora de `kb/` e seus artefatos foram retirados de `auditoria/rotinas`.

### 4.1. Limites conhecidos

1. **As demais 38 rotinas da Fase 2 ainda têm em disco o `-revisado.md` antigo**, com o texto escrito à mão. Só `C-ACESSO-03` foi regenerada. O runner corrigido deve reclassificar várias como `[!!!]`, porque o manifesto visita poucas telas e a prova de presença exige ver todo negrito do manual.
2. **O manifesto não valida passos; só prova presença.** As capturas dele não correspondem 1:1 aos passos do KB. A validação passo a passo, com prints alinhadas e multi-demarcação, é do executor do KB.
3. **O RBAC Gate compara nomes.** O perfil auditado se chama "Gerência webFirmas" e a tela **Perfis e permissões** o descreve como "o perfil principal da aplicação"; pelo DOM não há como provar se ele equivale a Administrador. A tela **Alteração de usuário** não exibe **Redefinir Senha Manualmente**, aba **Segurança / Autenticação** nem **Resetar 2FA**: pode ser permissão, pode ser manual desatualizado. O bloqueio `[!!!]` é correto nos dois casos; a causa cabe ao revisor.
4. O extrator de requisito cobre as redações encontradas no KB. Redações novas precisam entrar em `rbac.ts` ou no frontmatter.
5. A segunda print (`passo-NN-b`) não é exibida pelo Audit Console, que lê `passo-NN.png`.
6. A prova de texto da auto-cura por `ref` da Árvore de Acessibilidade usa o nome acessível do nó quando o DOM não devolve `innerText`.
7. O executor do KB continua acionando comandos de gravação quando o passo manda (limite herdado da ADR-016).
