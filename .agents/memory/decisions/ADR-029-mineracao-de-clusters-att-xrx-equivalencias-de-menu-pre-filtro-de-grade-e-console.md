# ADR-029: Mineração de Clusters `[ATT]`/`[XRX]`, Equivalências Canônicas de Menu, Pré-Filtro de Grade Vazia, Sinônimos por Rota e Console Fase 2 × Fase 3

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Claude Code  
> **Relacionada a:** ADR-016, ADR-017, ADR-021, ADR-024, ADR-025, ADR-026, ADR-027, ADR-028  

---

## 1. Contexto

A reauditoria da ADR-028 deixou 103 rotinas `[ATT]` e 24 `[XRX]` e, com o Raio-X de tela, dados suficientes para perguntar **por que** elas bloqueiam. Antes de mexer em heurísticas, esta ADR minera os 127 relatórios e a telemetria (`kb-telemetry`) e só então altera o motor onde a causa é do motor (e não do manual).

## 2. Mineração (`mine-att-clusters.ts`, `capture-menu-tree.ts`)

Leitura offline dos `*-revisado.md` (frontmatter, `diagnostico_tela_att`, corpo) e da telemetria, cruzada com a **árvore de menus real** (140 itens lidos ao vivo, sem cliques, em `cache/orion-menu-tree-real.json`). Saída: `cache/att-xrx-cluster-analysis.json` + resumo no terminal.

| Cluster | Rotinas | Subcausas |
| --- | ---: | --- |
| **A** — Falha de caminho de menu (passo 1 ou navegação intermediária) | 60 | A1 equivalente canônico inequívoco **21** · A1 cauda como aba **2** · A2 rota curada com clique omitido **9** · A3 sem equivalente na árvore real **26** · A4 produto externo ao menu **2** |
| **B** — Grade inicialmente vazia que exige filtro/busca | 13 | B1 `Filtrar` desabilitado aguardando campos **8** · B2 sem busca acionada **5** |
| **C** — Rótulo renomeado / alvo espúrio na tela alcançada | 7 | C0 alvo espúrio de parser **2** · C1 sinônimo de rota **3** · C2 correspondência sugerida sem regra **2** |
| **D** — Removido / pressuposto / exclusivo de outra rotina | 47 | D1 tela pressuposta **28** · D2 produto/portal externo **4** · D3 recurso removido na tela alcançada **7** · D4 depende de objeto criado em outra rotina **8** |

Por fase (disco): Fase 2 (`acesso` + `config`, 50 rotinas) A=17 B=0 C=1 D=12; Fase 3 (`firmas`, `selos`, `livros`, `certidoes`, `centrais`, 117 rotinas) A=43 B=13 C=6 D=35. **50 das 127** têm uma regra de motor desta ADR (`destravavel`); as 77 restantes (A3, D1–D4, C2) são defasagem real do manual ou dependência de outra rotina e **permanecem `[ATT]`/`[XRX]`**.

Achados que mudaram o motor:

1. **Bug A2 (9 rotinas):** em passo "acesse o menu X e clique em **Adicionar**" cuja rota era curada, o clique da folha era omitido pelo guard de "alvo citado" (`"tipo de documento"` ≠ `"Tipos de documentos"`); a rotina seguia em `#/inicio` e o passo 2 bloqueava com `[ATT]` falso. Além disso, a Camada 0 devolvia só o caminho e o botão de cadastro do mesmo passo nunca era conferido.
2. **Submenu legado (≈18 rotinas):** `Administração > Parâmetros > <X>` virou a tela única **Configurações > Parametrizações**, e `<X>` é uma **aba** dela (`Captura e digitalização`, `E-mail`, `Campos obrigatórios`, `Protocolo`, `Certidão`, `Impressão`...).
3. **Grades iniciais vazias:** `Filtrar` fica desabilitado até haver campos válidos (`Período de pesquisa inválido`, `Preencha ao menos um dos campos obrigatórios...`); no `#/seloDigital` o filtro padrão é "hoje".
4. **Alvo espúrio de parser:** `(**\***)` (asterisco de obrigatório escapado) virava o alvo `\` e bloqueava rotinas inteiras.
5. **Rótulos renomeados** poucos e localizados (`Nome completo`→`Nome`, `Nome do Produto`→`Descrição`, abas de Parametrizações abreviadas).

## 3. Decisões de motor

### 3.1. Equivalências canônicas de menu (`menu-canonical.ts`, `menu-path.ts`, `menu-tail.ts`)
Função pura `resolveCanonicalMenuPath`, aplicada em `chooseMenuItem` depois de exato / revisão humana / rota anterior e antes do Dice: (1) tabela explícita de destinos únicos provados, (2) irmão de mesma **chave de folha** sob o maior prefixo real (sem acento, plural, `de/do/da/e/ou`, `consulta/cadastro/gestão/tela/tipo`), (3) **cauda como aba/seção** quando o prefixo real termina em folha sem filhos. A cadeia real precisa existir na árvore lida agora; 2+ irmãos com a mesma chave = ambiguidade (sem cura, ADR-024 intacta). Só o prefixo documentado que aparece literal no negrito vira o caminho real; a cauda é **medida ao vivo** (`resolveMenuTail`: texto idêntico → sinônimo de rota → mesma chave), demarcada em `passo-NN-b` e acionada; sem aba medida o passo bloqueia com a lista real de abas.

### 3.2. Correção A2 (`executor.ts`)
A folha de um caminho resolvido na árvore real (`menu_path_resolution` com evidência `menu-tree`) é o nó da navegação e é clicada. O botão de cadastro (`Adicionar`/`Novo`...) citado no mesmo passo vira alvo pendente, é medido após a navegação (`passo-NN-b`) e acionado (abre formulário; nada é gravado).

### 3.3. Pré-Filtro de Grade Vazia (`grid-prefilter.ts`)
Passo que escolhe/abre item da listagem ou aciona botão de linha em grade com 0 linhas dispara a busca antes de declarar vazio: `as_is` → `wide_period` (par De/Até `01/01/2000`..hoje, **digitado com teclas reais** — `fill` não aciona a máscara) → `text_probe` (`"teste"`). Só botões `Filtrar/Pesquisar/Buscar/Consultar/Listar` fora das linhas; nunca gravação; sem linhas, `Limpar` restaura e a tentativa vira evidência (`emptyState.prefilter`) no motivo de `[DDD]`/`[XRX]`. Com linhas, o botão vai em `passo-NN-b`.

**Limite comprovado ao vivo (Produtos):** em `#/ficha`, `#/livro` e `#/comunicacaoCoaf` o `Filtrar` continuou desabilitado com período, nome e número válidos (a obrigatoriedade vem da parametrização da serventia); `#/seloDigital` e `#/certidoesServicos` buscam e retornam 0 linhas. O pré-filtro não cria dados: a evidência dessas tentativas sustenta o `[XRX]`/`[DDD]`.

### 3.4. Sinônimos contextuais por rota (`route-synonyms.ts`)
Camada 0.2 do SmartLocator (alvo único) e `reconcileUnresolvedGroupTargets` (grupo): `#/ficha/cadastrar` (`Nome completo`→`Nome`, `CPF`→`CPF ou CIN`, `RG/CNH`→`RG`+`CNH`), `#/produto/cadastrar` (`Nome do Produto`→`Descrição`), `#/natureza` e as abas de `#/configuracoes`. O nó real é medido ao vivo na zona do passo; vários reais não trocam o texto.

### 3.5. Parser
Negrito sem letra/número não é alvo.

### 3.6. Console
`AttScreenDiagnosisCard` (Raio-X: rota, seções, abas, campos, botões, sugestões), `StepMedia.contexto` + `sync-supabase.ts` (mídia `passo-NN-contexto-att` do passo bloqueado sem print, nota no visualizador), `PhaseSplitCards` (Fase 2 × Fase 3 no Dashboard), filtro rápido de fase no Explorador e `ReauditTimeline` (Antes × Depois de `historico_reauditoria`). `server.ts` repassa `media` e `auditoria_ui` (JSONB) sem migration; o fallback `/api/media/rotinas/` já serve o `.webp` de contexto.

## 4. Reauditoria seletiva e resultado (Antes × Depois)

Reauditoria seletiva (`--routines <50 IDs> --headless --dry-run-mutations --concurrency 4`, ambiente Produtos, host mascarado `10.0.3.x`): **apenas** as 50 rotinas dos clusters A1/A2, B e C0/C1, em 2 h 49 min, **0 falhas técnicas**, 0 logins reais, 45 resets leves. Um mini-lote final reexecutou as 7 rotinas "caminho de menu + clique em **Adicionar**" depois da correção de um regex (ver §6). `--seed-reviews` reexecutado: as 9 revisões humanas seguem `unchanged`, `revisao_solicitada`, disco e Supabase `ok`. `verify-all-phase2-boxes.ts --all`: **433 prints, 267 com geometria auditada (267/267 Zero Auto-Oclusão), 433/433 pares PNG+WebP, 0 discrepâncias**.

### 4.1. Antes × Depois por fase (Antes = fim da ADR-028)

| Status | Fase 2 antes | Fase 2 depois | Fase 3 antes | Fase 3 depois |
| --- | ---: | ---: | ---: | ---: |
| `validado_inalterado` | 1 | 1 | 2 | 2 |
| `validado_com_ajustes` | 9 | **12** | 10 | **12** |
| `[CCC]` (status principal) | 0 | 0 | 1 | 1 |
| `[ATT]` | 30 | **26** | 73 | **70** |
| `[DDD]` | 10 | 11 | 7 | 7 |
| `[XRX]` | 0 | 0 | 24 | 25 |
| **Total em disco** | 50 | 50 | 117 | 117 |

(Fase 1: 2 rotinas, sem alteração. As contagens são das pastas em disco; o manifesto cita 39 e 118 rotinas para as Fases 2 e 3.)

### 4.2. Rotinas que mudaram de estado (8)

| Fase | Rotina | Antes | Depois | Regra |
| --- | --- | --- | --- | --- |
| 2 | M-16.6 | `[ATT]` | `validado_com_ajustes` | equivalência `Administração > Parâmetros` + aba medida |
| 2 | M-60.0 | `[ATT]` | `validado_com_ajustes` | sinônimo de rota `#/natureza` |
| 2 | M-62.0 | `[ATT]` | `validado_com_ajustes` | correção A2 (folha clicada) |
| 3 | D-3.9 | `[ATT]` | `validado_com_ajustes` | chave de folha (`Consulta de Reconhecimento de Firmas`) |
| 3 | V-CCA.2.1 | `[XRX]` | `validado_com_ajustes` | correção A2 |
| 2 | M-16.7 | `[ATT]` | `[DDD]` | localizada: abre Parametrizações e a aba, bloqueia em dado/ambiente |
| 3 | C-FIRMA-04 | `[ATT]` | `[XRX]` | localizada: `Cartão de assinatura`, grade sem registros |
| 3 | D-9.0 | `[ATT]` | `[XRX]` | localizada: `Certidões e serviços`, grade sem registros |

**Ganho real de validação: 5 rotinas** saíram de `[ATT]`/`[XRX]` e foram validadas com demarcação medida ao vivo; **3** deixaram de ser "caminho inexistente" e passaram a bloqueio por dado/dependência (informação nova e verdadeira). **27 das 50** reauditadas passaram do passo em que bloqueavam (`bloqueio anterior SUPERADO`), mas encontraram o bloqueio seguinte do manual (seção inexistente, grade sem dados): total `[ATT]` 103 → **96**, `[XRX]` 24 → 25, `[DDD]` 17 → 18, auto-curadas 20 → **25**.

### 4.3. Ativações das regras no lote
Cauda como aba medida ao vivo **9** vezes (ausente na tela real: 3, com a lista real de abas no relatório) · sinônimo de rota **2** · pré-filtro de grade tentado **7** vezes, **0** populou (5 com `Filtrar` desabilitado, 2 com busca válida e 0 linhas) · clique em `Adicionar` após a navegação: 7/7 no mini-lote.

## 5. Erratas e correções durante a execução

* O primeiro clique de seguimento em `Adicionar` nunca disparava: a condição usava um regex cujo `\b` virou um caractere de controle (backspace) ao ser gravado por um script Python. O lote seletivo de 50 rotinas rodou com isso; as 7 rotinas afetadas (`D-3.3`, `M-24.0`, `M-26.0`, `M-61.0`, `M-63.0`, `M-70.0`, `M-9.0`) foram reexecutadas depois da correção. Guarda: o teste `higiene dos fontes` falha se algum `auditoria/src/*.ts` tiver caractere de controle.
* `M-63.0` mostrava `validado_com_ajustes` porque o passo 2 casava `Descrição` na **grade** (tela errada, `Adicionar` nunca clicado). Com a navegação correta o formulário real abre, `Descrição` é preenchida e o bloqueio verdadeiro aparece em `Firmas` (opção de `<select>`, não mensurável): voltou a `[ATT]`. É a correção de uma falsa validação, não uma regressão.
* A sessão salva em disco pode expirar no servidor durante lotes longos (preencher a 2ª data de um filtro redirecionou para `#/login-a`); um login real novo resolveu. O lote usa a sessão ativa da página e re-loga no reset completo.

## 6. Limitações conhecidas

* O ganho de `[ATT]` → `[XRX]`/`[DDD]` é **localização**, não validação: a rotina chega à tela certa e o próximo bloqueio é real (grade sem dados, seção inexistente).
* A tabela de equivalências e a de sinônimos por rota são dados provados em Produtos; qualquer mudança de versão exige reexecutar `capture-menu-tree.ts` e `mine-att-clusters.ts` (ambos conferem a tabela contra a árvore e o Raio-X).
* O `Filtrar` desabilitado por obrigatoriedade configurável permanece fora do alcance do pré-filtro.
