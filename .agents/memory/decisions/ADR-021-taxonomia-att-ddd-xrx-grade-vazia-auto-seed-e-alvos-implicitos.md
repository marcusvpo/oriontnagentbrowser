# ADR-021: Taxonomia `[ATT]`/`[DDD]`/`[XRX]`, Detector de Grade Vazia, Auto-Seed Mock e Alvos Implícitos

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-15
* **Contexto:** Inspeção manual da `M-40.0` (Gerenciar Alíquotas) após a ADR-020
* **Complementa/Revisa:** ADR-010 (**aposenta o prefixo `[!!!]`**), ADR-016 (passo sem alvo), ADR-017 (Evidência Estrita), ADR-018 (Supabase), ADR-019 (Exploração Investigativa, Trava de Mutação), ADR-020 (ações icônicas, `empty-grid`)

---

## 1. Diagnóstico

1. **`[!!!]` misturava causas:** manual desatualizado, banco vazio, dependência entre rotinas, RBAC e hardware recebiam o mesmo prefixo, sem dizer quem deve agir. A `M-40.0` bloqueou no passo 4 como "Defasagem Editorial", mas a causa real era **banco vazio**: toast `Não existem aliquota itbi cadastrados.`, grade com `UF`/`Cidade`/`ITBI %`/`ISS %`/`Padrão` e 0 linhas, **Filtrar** inativo.
2. **Passo sem negrito virava print limpa:** "Na listagem de alíquotas, localize a cidade pelo campo de pesquisa de município ou estado" não tinha `**negrito**`; o motor o tratou como descritivo passivo e não demarcou os campos de pesquisa.
3. **Nada lia o estado vazio:** `empty-grid` só existia dentro da resolução de ações de linha (ADR-020); toasts transitórios, mensagens de "nada cadastrado" e controles inativos por falta de dado não eram detectados.
4. **Grade vazia com `Adicionar` não era destravada:** o agente só fotografava o formulário e nunca criava um registro de pré-requisito.
5. **O KB não tem campo de pré-requisito** (`pre_requisitos`, `depende`...): dependências entre rotinas vivem só na prosa.
6. **Achado de execução:** seletor de atributo **com valor** (`[x="1"]`) perde as aspas no `agent-browser`/Windows e não encontra o nó (já visto na ADR-020). Os carimbos do seed usam atributos **sem valor**.

## 2. Decisões

### 2.1. Taxonomia de 3 tags (substitui `[!!!]` e `requer_revisao_humana`)

| Tag | `auditoria_ui.status` | Quando | Ação |
|---|---|---|---|
| `[ATT]` | `atualizacao_editorial` | Manual cita tela/caminho/botão/campo inexistente; rotas e `reveal-explorer.ts` esgotados. RBAC (`rbac`) também. | Equipe editorial |
| `[DDD]` | `dependencia_dados_banco` | Faltam registros no banco de homologação sem `Adicionar` utilizável e sem rotina provedora; hardware/Docker/ambiente (`tipo_bloqueio: 'Dependência de Ambiente/Hardware'`); tela inoperante; efeito de gravação omitido pela Trava de Mutação. | Equipe de Produtos |
| `[XRX]` | `dependencia_cruzada_rotina` | Depende de outra rotina que cria o registro/estado; `rotinas_pre_requisito` lista quais rodar antes. | Auditoria |

* Pasta e arquivo levam a tag (`[ATT] M-xx-slug/[ATT] M-xx-slug-revisado.md`). Fonte única: `review-taxonomy.ts` (`REVIEW_TAGS`, `REVIEW_PREFIX_RE`, `statusFromPrefix`...).
* **Falha técnica** (exceção após 2 tentativas) **não recebe tag**: o executor remove a pasta vazia e lança erro; o lote registra `falha_tecnica` em `kb-batch-summary.json` e a rotina segue `nao_auditada`.
* O cabeçalho do bloco de alerta do `-revisado.md` virou `ROTINA QUE REQUER REVISÃO HUMANA ([TAG])`; as linhas **Motivo Técnico** e **Roteiro Técnico para Execução Manual** continuam literais (o `sync-supabase.ts` as interpreta por regex).

### 2.2. Árvore de decisão única (`review-classifier.ts`, `classifyBlock()`)

1. `other` (falha técnica) → sem tag. 2. `rbac` → `[ATT]`. 3. `screen_error`/`environment` → `[DDD]`. 4. Grade vazia (e a rotina **não** é de criação) → `[XRX]` se o grafo achar provedor, senão `[DDD]`. 5. Passo com caminho de menu ausente → `[ATT]` (rota nunca é dependência de dado). 6. `dry_run_dependent` → `[DDD]`. 7. Objeto criado fora da tela (protocolo, orçamento, ato, pedido, certidão; "localize/acesse/abra o objeto" com provedor) → `[XRX]`. 8. Alvo ausente com exploração esgotada → `[ATT]`. **`[DDD]` é o último recurso.** Rotina de **criação** (título com verbo de criação) não é bloqueada por grade vazia: o alvo ausente segue para as regras 5-8.

### 2.3. Grafo de dependências do KB (`kb-dependency-graph.ts`)

471 rotinas lidas do front-matter; **provedor** = título de criação (Adicionar/Cadastrar/Criar/Abrir/Fazer/Lançar...); **consumidor** = tokens da entidade do título e da grade. Liga no mesmo módulo (1 token significativo ≥ 5 letras) ou entre módulos (≥ 2 tokens). Cache em `cache/kb-dependency-graph.json`. `npx tsx src/kb-dependency-graph.ts <IDs>` imprime os provedores. É **heurístico**: os pré-requisitos aparecem no relatório para validação humana.

### 2.4. Detector de estado vazio (`empty-state.ts`)

Script via **STDIN** (ADR-014), somente leitura: (a) grade/tabela/datatable com cabeçalhos visíveis e 0 linhas de dados (ou linha-mensagem "Nenhum registro"/"Não existem ... cadastrados"); (b) **toasts transitórios** por `MutationObserver` instalado antes de cada passo (texto literal; o "×" do botão de fechar é removido); (c) controles inativos na zona de conteúdo com a dica que a tela mostra (ex.: **Filtrar** — "Preencha os campos obrigatório para efetuar a busca"); (d) botão Adicionar/Novo/Cadastrar ativo (carimbado). Evidência `EmptyStateEvidence` vai para a telemetria e para o `-revisado.md` (`> [!NOTE] **Tela sem dados (Evidência de Tela)**`).

### 2.5. Auto-seed de registro mock (`auto-seed.ts`)

* **Gatilho:** grade vazia **e** `Adicionar` ativo **e** a rotina consulta/altera/filtra linhas (`routineNeedsExistingRows`). Grade já populada: **nada é gravado**.
* **Ciclo:** Adicionar → varredura de campos (`input/textarea/select/ng-select`, obrigatórios `*`) → valores válidos por tipo (`mock-generator.ts`: CPF/CNPJ válidos, CEP, e-mail, telefone, datas, percentual, valor, número, UF/Cidade, 1ª opção de select, texto `AUDIT-MOCK ...`) → Salvar/Gravar/Concluir **mesmo com `--dry-run-mutations`** → volta à grade → conta linhas. Validação recusada → segunda passada; persistindo, aborta e a rotina cai em `[DDD]` com o motivo.
* **Segurança:** aciona só os dois nós carimbados; nunca Excluir/Inativar; um ciclo por rota e rotina; **serializado entre workers**; `--no-auto-seed` desliga. Rotina semeada sai `validado_com_ajustes` com `registros_mock_criados` no frontmatter (rota, botões, campos, linhas após).
* **Registros `AUDIT-MOCK` ficam no banco de homologação** (Excluir é vedado); o seed é idempotente (nunca semeia se já há linha).

### 2.6. Alvos implícitos (`implicit-targets.ts`)

Passo com `targets.length === 0`, verbo de ação (*localize, pesquise, filtre, informe, preencha, selecione...*) e substantivo de controle (*município/cidade → Cidade, estado → UF, data, descrição*) é casado (igualdade, palavra inteira ou Dice ≥ 0,85) com rótulos/placeholders **reais** de campos de formulário na zona `content` (nunca cabeçalhos de grade), na ordem do DOM. O executor trata o passo como `verify` (**nenhuma ação**), com `zone: 'content'` e **sem Auto-Cura**: multi-demarcação `(1) UF (2) Cidade`. O texto do manual **não** é reescrito (Evidência Estrita); alvo não confirmado na medição vira print limpa, nunca bloqueio. `parser.ts#inferActionType` **não** foi alterado (evita mudar rotinas que já passam).

### 2.7. Validação, relatório, Supabase e Console

* `invariants.ts`/`verify-all-phase2-boxes.ts`: além dos 8 invariantes, **nenhuma pasta `[!!!]`**, prefixo ≡ `auditoria_ui.status` ≡ `tipo_bloqueio`, contagem por tag (a comparação de caminhos ignora a caixa da letra do drive).
* `supabase/migrations/003_review_taxonomy.sql` (idempotente: troca o CHECK e migra linhas legadas) e CHECK de `001` atualizado. **Escritos, não executados** (decisão do usuário; rodar `supabase:migrate`/`supabase:sync` quando desejar). `sync-supabase.ts` mapeia o legado `requer_revisao_humana` pela tag da pasta.
* `server.ts`: `porStatus` com as 3 chaves; "bloqueadas" = soma das 3; aprovação exige confirmação nas 3. Console: `lib/status.ts` (`AUDIT_STATUS`, `REVIEW_STATES`, `reviewPrefix`), badges, filtros, KPIs, presets, gráfico por fase (`seg-att/ddd/xrx`), diálogo de aprovação, mocks e testes.
* `generate-human-review-routines.ts`: as 10 rotinas de hardware/infra (C-ACESSO-05, C-CONFIG-01..08, V-2.3.2) migraram para `[DDD]` (`Dependência de Ambiente/Hardware`).

## 3. Resultados (2026-11-15, `--dry-run-mutations`, `--concurrency 1`)

* **M-40.0:** `[DDD] M-40.0-gerenciar-aliquotas-revisado.md`. Passo 2 demarca **(1) UF (2) Cidade**; toast `Não existem aliquota itbi cadastrados.` e grade vazia (UF, Cidade, ITBI %, ISS %, Padrão) detectados; **Filtrar** inativo registrado; sem `Adicionar` e sem provedor no KB.
* **32 rotinas da Fase 2 reauditadas** (0 falhas técnicas) + 10 de hardware migradas: **`[ATT]` 30, `[DDD]` 11 (10 ambiente/hardware + M-40.0), `[XRX]` 0** nas pastas em disco (30 + 11 inclui as 10 rotinas de hardware, geradas fora do lote); 1 rotina nova ficou `validado_com_ajustes` por seed (R-18.0); **0 pastas `[!!!]`** em `auditoria/rotinas/`.
* **Auto-seed:** 2 registros mock criados (**M-62.0** em Grupo de itens e **R-18.0** em Outros serviços, ambos via **Adicionar** → **Concluir**, grade com 1 linha depois). **R-18.0** saiu `validado_com_ajustes`; **M-62.0** segue `[ATT]` por outro motivo real: a opção **Firmas** não existe na tela.
* **`[XRX]` observado e depois resolvido pelo seed:** numa 1ª passada (seletor do seed ainda quebrado) M-62.0 → `[XRX]` (provedor **M-63.0**) e R-18.0 → `[XRX]` (provedores **M-66.0**, **M-14.2**), provando o caminho do grafo; com o seed corrigido, a grade é populada e o `[XRX]` deixa de ser necessário.
* **Correções feitas durante a execução:** carimbos do seed sem valor de atributo; `detectExternalObject` apertado (M-16.7 virou `[XRX]` indevidamente por citar "Novo Pedido de Firmas") e rotina de criação (M-63.0) não é mais `[DDD]` por grade vazia.
* **Validação:** `tsc` do motor = 0; `tsc` do Console = 0; Console 16/16 testes; `verify-all-phase2-boxes.ts` = **0 discrepâncias** (108 prints, 67 com geometria, 67/67 Zero Auto-Oclusão, 32 multi-demarcações com 78 caixas, 108/108 pares PNG+WebP, 26 bloqueios estruturados, 0 sem classificação).

> Contagem final por tag no acervo da Fase 2: `[ATT]` 30, `[DDD]` 11, `[XRX]` 0 e 1 rotina `validado_com_ajustes` nova por seed (R-18.0), além das 7 que já estavam validadas.

## 4. Limites conhecidos

* O grafo `[XRX]` é heurístico (prosa do KB); os pré-requisitos listados precisam de validação humana. Com o auto-seed ativo, `[XRX]` só aparece quando a grade está vazia **sem** `Adicionar` e há rotina provedora, ou quando o manual manda trabalhar sobre um objeto criado fora da tela.
* O seed grava no banco de homologação (autorizado só para grade vazia + `Adicionar` na mesma tela); registros `AUDIT-MOCK` permanecem.
* Passo 1 combinado "caminho de menu + **Adicionar**" (M-63.0) demarca só a rota; o **Adicionar** aparece depois da ação e a sub-captura não foi gerada nesta execução: fora do escopo desta ADR.
* A migração SQL 003 e o `sync-supabase` **não foram executados**; enquanto isso, o banco ainda aceita apenas o CHECK antigo.
* `[DDD]` por hardware usa o texto estático de `generate-human-review-routines.ts`; não há leitura de tela para essas rotinas.
