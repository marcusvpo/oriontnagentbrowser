# ADR-020: Ações Icônicas de Grade, Ajuda Contextual "i" e Confronto Semântico da Descrição com a Tela

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-15
* **Contexto:** Inspeção manual da `M-25.0` (Configuração de impressão) após a ADR-019
* **Complementa/Revisa:** ADR-016 (passo de lista de opções: nunca aciona), ADR-017 (Evidência Estrita, multi-demarcação), ADR-019 (sub-capturas, dry-run)

---

## 1. Diagnóstico

1. **Botões de ícone em grades:** na grade de `M-25.0`, os botões de linha são ícones sem texto; o nome real está no atributo `title`: `Consultar` (olho, `glyphicons-eye-open`), `Alterar` (lápis, `glyphicons-pencil`) e `Excluir` (`halflings-remove`, `data-toggle="modal"`). O manual diz *Visualizar/Editar/Remover*. O passo de lista de opções roda em zona `content` **sem Auto-Cura** (ADR-016) e o DOM direto só casa texto/`title` **exato**; resultado: nota falsa "dependem de um registro selecionado" e print limpa.
2. **Ícone "i" ignorado:** `i.glyphicons-circle-info` ao lado de **Margem mínima** abre um popover Bootstrap (`.popover-title` + `.popover-content`) no `hover`. Nenhum código lia balões.
3. **Descrição sem confronto:** o texto do manual (perfis de calibração, milímetros, exemplos de bobina) era copiado sem comparar com a tela (modelos de impressão, centímetros, registros `Não Fiscal`/`Reconhecimento`/`Termo`).
4. **Achado da sonda (read-only, `probe-grid-icons.ts`):** o `title` é estático (o hover não renderiza balão para os ícones de linha); o seletor de atributo no `agent-browser` no Windows perde as aspas (`[data-x="1"]` → `[data-x=1]`): carimbos usam atributo sem valor (`[data-orion-audit-icon-<token>-<n>]`). O asterisco `glyphicons-asterisk` ("Campo obrigatório") e o `.infotitulo` do título (sem balão) não são ajuda de regra de negócio.

## 2. Decisões

### 2.1. `icon-action-resolver.ts` (Camada 1.5 do SmartLocator)
* Varre a **1ª linha de dados** da grade (modal aberto tem prioridade; nunca a navegação) e extrai por ação: `title` → `data-original-title` → `aria-label` → `alt` → texto → **classe do ícone** (olho/lápis/X).
* Casa cada alvo do manual com evidência decrescente: **nome real igual** → **sinônimo canônico** (`Visualizar/Consultar/Exibir`, `Editar/Alterar/Modificar`, `Remover/Excluir/Apagar`) → **só a classe do ícone** (confiança menor).
* A medição final passa pelo caminho único `getDOMGeometry` (carimbos como `groupTargets`, zona `content`); o nome real vira o rótulo da caixa e `buildCalloutsFromGroup` gera `(1) Consultar · (2) Alterar · (3) Excluir` numeradas, 0 px² de oclusão (invariante 8).
* **Trava ADR-016 preservada:** `actionTarget` só é criado quando o passo cita UMA ação e tem negrito na linha principal; em lista de opções nada é clicado. Com dry-run, **Excluir** é comando de gravação e não é acionado.
* Divergência registrada como `dom_synonym_heuristic` (*"Divergência de rótulo"*), **sem alterar o texto do manual** (os nomes estão em sub-itens). Alvo sem ícone correspondente → `target_not_found` (Evidência Estrita). Grade vazia / linha sem ícones → nota própria (distinta de "ícone não localizado") e log `[Ações de Grade]`.
* Dicionário `ORION_UI_SYNONYMS` ganhou `visualizar`, `consultar`, `remover`.

### 2.2. `help-tooltips.ts` (Ajuda Contextual)
* Detecta ícones informativos (`circle-info`, `info-sign`, `fa-info`, `data-toggle=popover|tooltip`...) na zona de conteúdo/modal aberto (teto 8 por tela), faz `hover`, lê o balão **literal** e devolve o ponteiro a uma coordenada neutra. Nunca clica. Texto repetido no mesmo roteiro é registrado uma vez.
* Coletado no passo descritivo (print limpa) e **após a ação** de cada passo (o formulário aberto por **Adicionar** é lido no Passo 4). Telemetria `helpTooltips[]`; relatório `> [!TIP] **Ajuda da tela — "Margem mínima":** "..."`.

### 2.3. `screen-snapshot.ts` (Confronto Semântico)
* Snapshot estrutural leve ao vivo: título, cabeçalhos, colunas, até 3 valores da 1ª coluna, rótulos e unidades `(cm)`; guardado na telemetria (`screenSnapshots`).
* Comparador **determinístico, sem LLM**, com **duas evidências obrigatórias** (trecho do manual + trecho do DOM):
  1. `unit`: manual cita *milímetros/mm* e os rótulos reais medem em `cm` (sem `mm`).
  2. `examples`: exemplos de registros entre aspas no manual que não existem entre os registros reais.
  3. `concept`: o substantivo-núcleo que a Descrição diz cadastrar/gerenciar (ex.: *perfis de calibração*) não aparece em nenhum texto da tela.
* Saída: `> [!NOTE] **Divergência Conceitual/Editorial (Evidência de Tela):** ...` sob a **Descrição** e no passo que carrega o trecho; frontmatter `auditoria_ui.divergencias_editoriais[]`; rotina → `validado_com_ajustes`. A Descrição original **não é reescrita** (nota adicional), em respeito ao "vedado texto escrito à mão". Rotina `[!!!]` sai sem notas (texto 100% original).

### 2.4. Robustez da cascata (`menu-path.ts`)
Na reauditoria, a cascata do Passo 1 fechou entre a medição e a captura em duas execuções seguidas (`[!!!]` espúrio). `captureCascade()` agora reabre, mede e confere até 3 vezes.

## 3. Resultados (2026-11-15, `--dry-run-mutations`)

| Verificação | Resultado |
| :--- | :--- |
| `tsc --noEmit` | 0 erros |
| `M-25.0` | `validado_com_ajustes`; `passo-03.png` com `(1) Consultar (2) Alterar (3) Excluir` na 1ª linha, nenhum clique; tooltip de **Margem mínima** no Passo 4; 3 divergências editoriais (mm×cm, exemplos, conceito) |
| `M-36.0`, `M-43.0`, `M-67.0` | `validado_com_ajustes` (ícones da 1ª linha resolvidos; M-43.0/M-67.0 só pela classe do ícone) |
| `M-40.0`, `R-18.0`, `M-70.1` | seguem `[!!!]`: o alvo **Editar** não existe na tela alcançada (grade sem registros / filtro desabilitado / sem gatilho revelador) — defasagem real, não falha do resolvedor |
| Validador dos 8 invariantes | 62/62 prints com geometria, Zero Auto-Oclusão 62/62, 105/105 pares PNG+WebP; 35 discrepâncias, **todas** "pasta gêmea em disco" de rotinas não tocadas aqui (pré-existentes) |

## 4. Limites conhecidos

1. O resolvedor só olha a **1ª linha** da grade; ação que existe só em outras linhas (ex.: por status) não é vista.
2. Regra `concept` é lexical (núcleo da frase da Descrição × vocabulário da tela): pode apontar sinônimo legítimo como divergência; o texto pede confirmação humana e nunca bloqueia.
3. Ícone casado só pela classe (`icon-class`, M-43.0/M-67.0) tem confiança menor (0,80).
4. `.infotitulo` (ajuda do título) não abre balão no hover; pode exigir clique e fica fora desta ADR.
