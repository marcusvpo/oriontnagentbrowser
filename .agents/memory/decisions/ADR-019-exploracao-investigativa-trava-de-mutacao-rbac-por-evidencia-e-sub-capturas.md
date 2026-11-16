# ADR-019: Exploração Investigativa Pré-`[!!!]`, Trava Segura de Mutação, RBAC por Evidência de DOM e Sub-capturas

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-13
* **Contexto:** Golden Rule 13 (conta `4tabeliao.scs` com 100% das permissões) e a reauditoria das 39 rotinas da Fase 2 pelo executor do KB
* **Complementa/Revisa:** ADR-017 (RBAC Gate e Evidência Estrita), ADR-015/016 (zona e rota de menu). Não confundir com a ADR-018 (conexão Supabase).

---

## 1. Diagnóstico

1. **Falso-positivo de privilégio:** o gate comparava só o nome do perfil. "Gerência webFirmas" não casava com "Administrador"; `C-ACESSO-03` era bloqueada antes do passo 1 sem nenhuma evidência no DOM. Identidade ilegível também bloqueava.
2. **Pré-requisito virava alvo:** **Administrador** e **Tabelião Titular** (negrito do passo 1) eram procurados na tela.
3. **`[!!!]` como primeira reação:** alvo ausente bloqueava direto, sem investigar abas, painéis recolhidos ou botões de abertura.
4. **Executor clicava em gravação:** **Salvar/Concluir/Excluir...** eram acionados em 30 das 39 rotinas (`mutation`).
5. **Console cego às sub-capturas:** mídia fixa em `passo-NN.png`; telemetria do KB ausente; invariantes duplicados (7, não 8) em dois lugares.
6. **Defeitos achados na reauditoria ao vivo:** (a) `.ngx-orion-hide` sozinha marca 250 nós na tela inicial (asterisco de obrigatório, paginação vazia, contadores) e não é evidência de privilégio; (b) a sonda casava por palavra contida e tratou o menu **Firmas** como bloqueado por haver "Balcão de **firmas**" oculto; (c) valores de lista suspensa (**Notas** ou **Firmas**) nunca eram vistos pelo medidor; (d) rótulo renomeado (**Pesquisar por descrição** → **Descrição\***) não entrava na Auto-Cura porque a Árvore de Acessibilidade interativa não traz rótulos não associados; (e) `config.maxWriteConcurrency` era 2 (regra 8 pede 1); (f) o pool não reiniciava a tela entre rotinas e `--phase 2` ignorava o executor do KB.

## 2. Decisões

### 2.1. RBAC por evidência (`rbac.ts`)
* Perfil pleno: `Gerência webFirmas` e `TABELIAO` (+ `ORION_SESSION_GRANTED_ROLES`). Estados do gate: `not_required`, `satisfied`, `restricted` (único que bloqueia antes do passo 1), `inconclusive` (não bloqueia).
* Bloqueio durante os passos só com `PERMISSION_MARK_SELECTOR` (`.functionality.disabled`, `.functionality.ngx-orion-hide`, `title` "bloqueada para o seu perfil") e **igualdade exata** de texto. Evidência (nó e marcas) vai ao relatório.
* `stripPrerequisiteRoles()` retira os papéis do passo de pré-requisito da lista de alvos.
* Alvo ausente sem marca de bloqueio: `Defasagem Editorial do Manual` (sessão plena), `Validação Dependente de Gravação Real` (comando de gravação omitido antes) ou `Alvo do Manual sem Evidência` (sessão não plena). Pistas de realocação (ex.: **Olá, 4 > Alterar senha**) entram como observação, nunca como equivalência.

### 2.2. Exploração Investigativa (`reveal-explorer.ts`)
Ver `standards/auditoria_agent_browser.md` §8.1. Resumo: etapa dirigida (alvo oculto no DOM → gatilho que o controla) + etapa enumerada (abas, `aria-expanded=false`, botões de abertura, seletor com afinidade); teto 6; nunca aciona gravação; restaura e confere o estado; sucesso gera `passo-NN-b`, divergência `investigative_reveal` e texto por molde fixo (`evidence.ts: revealTextChange`), validado por `evidenceRejection` com a prova do gatilho **e** do alvo.

### 2.3. Trava Segura de Mutação (`mutation-guard.ts`, `executor.ts`)
`--dry-run-mutations` / `ORION_DRY_RUN_MUTATIONS=true`: o comando é medido, demarcado e fotografado; o clique é omitido (texto real do nó, rótulo alternativo, alvo curado ou, em botão de ícone, alvo citado). Registro no frontmatter, no passo e na telemetria. O validador reprova clique registrado em nó de gravação com dry-run ativo.

### 2.4. Sub-capturas e invariantes
* `invariants.ts`: os 8 invariantes em módulo único (validador e Console). Numeração do `-b` continua a da print anterior; layout auditado é o desenhado (telemetria); conferência inversa disco × telemetria × marcadores × pasta gêmea.
* `sync-supabase.ts` publica `media.subCapturas[]` (sem coluna nova) e usa a telemetria do KB; `GET /api/rotinas/:id` devolve `steps[].subCapturas[]`. O front (`ScreenshotViewer`) ganhou o seletor de print do passo.

### 2.5. Medição e lote
* `collectVisibleLabelNodes`: rótulos visíveis entram na Auto-Cura (só por inclusão de nome por palavras inteiras, validados no DOM em zona `content`, com o texto exato incluindo `*`).
* Texto que é `option` de um `select` visível resolve para o `select`.
* `cli.ts --phase 2` usa o executor do KB sobre os 39 IDs do manifesto (`--engine manifest` mantém o runner antigo; `--routines A,B` para seleção). `resetToHome` por rotina, remoção de pasta gêmea do mesmo `id`, semáforo de mutação = 1, falha técnica não derruba o lote (`cache/kb-batch-summary.json`).

## 3. Resultados (2026-11-13, `--dry-run-mutations`)

| Verificação | Resultado |
| :--- | :--- |
| `tsc --noEmit` (auditoria e Console) | 0 erros |
| Validador dos 8 invariantes | 105 prints do executor do KB, 6 sub-capturas, **0 discrepâncias**, 105/105 pares PNG+WebP |
| Balanço das 39 rotinas | `validado_inalterado` **0** · `validado_com_ajustes` **7** (M-25.0, M-36.0, M-41.0, M-43.0, M-66.0, M-67.0, M-68.0) · `[!!!]` **32** (30 defasagem editorial; 2 privilégio: M-12.0, M-14.2) |
| `C-ACESSO-03` | gate liberado (perfil pleno); passos 1–3 validados; passo 4 sem gatilho revelador; `[!!!]` por defasagem editorial, texto original |
| `M-43.0` | `validado_com_ajustes`; **Pesquisar por descrição** → **Descrição** curada com evidência |
| `investigative_reveal` | M-26.0 (**Largura**), M-41.0/M-66.0/M-68.0 (**Concluir**), todos via **Adicionar**; fixture de teste: aba **Captura e digitalização** revelou **Dpi's para digitalização do DUT** |

## 4. Limites conhecidos

1. **Dos 30 `[!!!]` de defasagem, 16 travam no passo 1** (caminho de menu inexistente, ex.: **Administração > Parâmetros > ...**): a exploração não roda em rota de menu (ADR-016) e a causa é do manual. Revisão humana obrigatória; não são "correções" feitas pelo agente.
2. **A Trava de Mutação só foi exercitada de ponta a ponta na fixture** (comando **Concluir** omitido). Na reauditoria real, as rotinas travam antes do comando de gravação, ou o botão estava desabilitado (nada foi clicado). Rotinas que chegarem ao **Salvar** em lotes futuros usarão a trava.
3. **Divergência com a árvore de permissões:** a aplicação oculta `Abertura de pedido` e `Balcão de firmas` (`li.functionality.ngx-orion-hide`) para `4tabeliao.scs`, embora a árvore marque `[x]`. O bloqueio de M-12.0/M-14.2 tem evidência real de DOM, mas a causa (flag de ambiente × permissão) cabe a Produtos.
4. As 11 rotinas `[!!!]` de hardware e `C-ACESSO-01`/`V-2.3.2` não foram sobrescritas.
5. O `sync-supabase.ts` foi atualizado mas **não foi executado**: publicar no Supabase é decisão do usuário.
6. Rótulo curado por inclusão de nome (73% em **Descrição**) é aceito com evidência, mas merece conferência humana.
