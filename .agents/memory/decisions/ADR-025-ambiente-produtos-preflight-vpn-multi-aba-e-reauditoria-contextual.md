# ADR-025: Ambiente de Produtos, Preflight de VPN, Multi-Aba (Sub-Portais) e Reauditoria Contextual

**Status:** ACEITA  
**Data:** 2026-11-16  
**Relacionadas:** ADR-009 (viewport/sessão), ADR-017/019 (RBAC, exploração, evidência estrita), ADR-021 (taxonomia, auto-seed), ADR-023 (segredos, Git), ADR-024 (sessão ativa, passos externos, guarda de menu)

## Contexto

O ambiente `4tn SCS` usado nas Fases 2 e 3 estava vazio: faltavam parâmetros globais (menus ocultos) e registros (grades vazias). Parte das 149 rotinas em `[ATT]`/`[DDD]`/`[XRX]`/`[CCC]` estava bloqueada por causa do **ambiente**, não do manual. A equipe de Produtos passou a oferecer um ambiente interno completo (integrações, parâmetros globais e dados multi-ano), acessível **somente com a OpenVPN da Siplan**.

Os artefatos das fases anteriores (`*-revisado.md` e `cache/kb-telemetry/<id>.json`) registram o que já foi curado e **onde cada rotina parou**. Descartá-los obrigaria a reauditoria a redescobrir tudo às cegas. Por outro lado, a Evidência Estrita (ADR-017) proíbe que conhecimento antigo substitua a medição ao vivo.

Um fluxo também não era suportado: sub-portais que abrem em **nova guia** (`target="_blank"`/`window.open`), como a tela de configuração do Orion Coaf. O motor não tinha nenhum tratamento de guias, e a guia nova nascia sem a emulação 1440x900 (ADR-009).

## Decisão

### 1. Conexão, segredos e preflight

* `config.ts` lê `ORION_BASE_URL` (alias `ORION_HOMOLOG_URL`), `ORION_ENV_LABEL`/`ORION_ENV_VERSION` e `ORION_AUTO_SEED`. URL, usuário e senha vivem **só** em `auditoria/.env` (ignorado). O `.env` anterior fica em `auditoria/backups/` (ignorado); `.env.example` só tem placeholders. **Nenhum IP interno ou senha entra em código, documentação ou commit.**
* **Preflight (`preflight.ts`)**: `fetch` de 3 s na origem, antes de qualquer worker. Qualquer resposta HTTP prova alcance; erro de rede/timeout aborta com *"Conecte a OpenVPN da Siplan"* e o host mascarado (`10.0.3.x`).
* **Entrada pelo portal (`auth.ts`)**: no `webPortal` (`#/produtos`) clica no card **Orion TN**; se o módulo abre em nova guia, o foco passa para ela e a do portal é fechada. A URL real do módulo é **descoberta ao vivo** e persistida em `auditoria/auth/app-home.json` (`persistDiscoveredAppHome`), em vez de derivada de uma convenção. `isSessionActiveInPage` (ADR-024) segue como 1ª checagem e aceita o path descoberto.
* **Auto-seed desligado** no ambiente compartilhado (`ORION_AUTO_SEED=false`): o auto-seed grava um registro mock e clica em Salvar mesmo com `--dry-run-mutations`; num ambiente usado por Produtos isso poluiria dados de terceiros. `--auto-seed` religa pontualmente.
* **RBAC:** a conta atual não é `4tabeliao.scs`. O Gate só reconhece perfil pleno pelas regras da ADR-019; identidade ilegível é `inconclusive` e não bloqueia. `ORION_SESSION_GRANTED_ROLES` **não** é declarado sem comprovar o perfil lido.

### 2. Multi-aba e sub-portais

* O `agent-browser` (v0.42) não tem "wait for popup". A guia nova é detectada pelo **diff de `tab list --json`** antes/depois da ação (`withNewTabDetection`), com `tab <tN>` (ids `t1`, `t2`...; inteiros puros são rejeitados), espera de `readyState` e **reaplicação do viewport 1440x900 @ DPR 1.0**.
* Clique de passo só vigia guia nova quando o nó medido é `target="_blank"`/`window.open` (`DOMActionNode.opensNewTab`): listar guias a cada clique custaria uma chamada de CLI extra por clique.
* **Gatilho genérico de sub-portal** (`openSubportalLink`): com o alvo ausente, aciona o link de nova guia cujo texto compartilha **termo distintivo** com o passo, os alvos ausentes ou o título/descrição da rotina (`subportalAffinityTerms`; lista de palavras genéricas excluída; **nenhum nome de portal no código**). A nova guia **permanece em foco** (decisão do usuário) e o executor repete a localização do **mesmo passo** nela, com medição ao vivo; o link vai numa sub-captura `passo-NN-b` e na trilha `exploracao_investigativa`. Nada é preenchido nem gravado.
* `resetToHome` chama `closeSecondaryTabs()` antes de qualquer reset: as guias secundárias só são fechadas ao terminar a rotina.
* Telemetria: `KbStepTelemetry.tab { id, url, title, openedAtStep }` nos frames capturados fora da guia principal; `ExecutedStepAction.openedTab`.

### 3. Reauditoria contextual (`PriorAuditContext`)

* `loadPriorAuditContext` roda **antes** da limpeza da pasta da rotina (o `-revisado.md` sem tag é apagado no início da execução). Lê o relatório (frontmatter + Motivo Técnico) e a telemetria (passo e `blockKind` do bloqueio).
* **Dicas, nunca evidência:**
  * curas de rótulo (`auto_cura`, confiança ≥ 0,68, elemento real localizado) entram como **Camada 0.5** do SmartLocator, tentada **depois** da medição do alvo documentado (se o manual está certo, a dica nem é usada), só em passo de alvo único, com as mesmas guardas (contêiner genérico, navegação estrita, zona);
  * rotas de menu reais entram em `chooseMenuItem(paths, items, priorChains)`: só valem se a rota **existe na árvore lida agora**, o item não está bloqueado e a folha segue ≥ 0,80 do manual. A guarda da ADR-024 contra falsa cura fica intacta.
  * a evidência continua sendo o nó medido **nesta** execução; o texto do manual só muda pela Trava de Evidência.
* **`auditoria_ui.historico_reauditoria`** (últimas 10 entradas) e a seção `#### Evolução da Reauditoria`: status/tags antes→depois, `bloqueio_superado` (`true` se deixou de bloquear ou passou do passo anterior; `false` se bloqueia no mesmo passo ou antes; `null` sem bloqueio anterior), curas reaproveitadas com `confirmada_ao_vivo`, notas editoriais reconfirmadas. **Sem migration**: `auditoria_ui` é JSONB e já é sincronizado inteiro. Nota editorial anterior só permanece se o confronto semântico a reproduz agora.
* **Hardware protegido** (`hardware-registry.ts`): rotinas de hardware/ambiente = flag `hardwarePreTriage.isHardwareDependent` do manifesto da Fase 3 (7) ∪ relatórios em disco com `Dependência de Ambiente/Hardware` e `prints_geradas: 0` (as da Fase 2). `cli.ts --reaudit-pending [--list-only]` seleciona as `[ATT]`/`[DDD]`/`[XRX]`/`[CCC]` **sem elas**; só `--routines` as força. Sem lista duplicada em código.

## Consequências

* **Positivas:** o ambiente deixa de ser a causa dos bloqueios; cada reauditoria deixa um comparativo Antes→Depois auditável (frontmatter, Supabase, Console); o conhecimento prévio acelera e estabiliza sem virar evidência; sub-portais em nova guia passam a ser auditáveis; o ambiente compartilhado não recebe gravações do auto-seed.
* **Limites assumidos:**
  * a reauditoria **não corrige manual desatualizado**: caminho de menu inexistente na árvore real continua `[ATT]` (guarda da ADR-024), mesmo com ambiente completo. O gatilho de sub-portal só é alcançado se o passo anterior chegar à tela que contém o link;
  * dica de cura só reaproveita o que o motor já curou: rótulos nunca vistos continuam dependendo da Auto-Cura normal;
  * o formato de `tab list --json` não é documentado; o parser aceita `[...]`, `{tabs}` e `{data:{tabs}}` e é coberto por testes, mas deve ser reconferido a cada atualização do `agent-browser`;
  * o executor remove o `-revisado.md` sem tag no início da execução: uma falha técnica numa rotina antes validada deixa a rotina sem relatório até a próxima execução (comportamento anterior, não alterado aqui).

## Validação (smoke test ao vivo, 2026-11-16, `--dry-run-mutations`, sync Supabase ativo)

`cli.ts --routines C-CENTRAL-02,M-40.0,C-FIRMA-03,R-1.1`, com o estado "Antes" restaurado para que o `historico_reauditoria` compare com a auditoria do ambiente antigo.

| Rotina | Antes (ambiente antigo) | Depois (Produtos) | Leitura |
| :-- | :-- | :-- | :-- |
| `C-CENTRAL-02` | `[ATT][CCC]`, passo 4 | `[ATT][CCC]`, passo 4 (mantido) | Passos 1–3 externos (SISCOAF) pulados sem print. Passo 4: **Configurações > Parâmetros Gerais > Comunicação COAF** não existe; a árvore real de **Configurações** tem *Dados do cartório, Modelos de impressão, Tabela de custas, Cadastros auxiliares, Perfis e permissões de acesso, Usuários, Parametrizações*. A guarda da ADR-024 não cura (correto). **Defasagem real do manual.** |
| `M-40.0` | `[DDD]`, passo 4 (grade vazia) | `[DDD]`, passo 6 (**bloqueio anterior superado**) | A grade agora tem dados e o passo 4 abre a edição. O novo `[DDD]` é *Validação Dependente de Gravação Real*: o **Salvar** foi omitido pelo dry-run e o passo 6 (**Limpar**) não existe no formulário aberto. Rota de menu comprovada reaproveitada (1/1, via dica). |
| `C-FIRMA-03` | `[ATT]`, passo 4 (privilégio) | `[ATT]`, passo 4 (mantido) | **Balcão de Firmas** vem `li.functionality.ngx-orion-hide` para a conta atual: evidência real de DOM. Curas 3/3 reconfirmadas (1 via dica: a rota de menu). |
| `R-1.1` | `validado_com_ajustes` | `validado_com_ajustes` | Sem bloqueio a superar; curas 2/2 reconfirmadas pelo próprio motor. |

**Mecanismo de sub-portal provado ao vivo por sonda de leitura** (a `C-CENTRAL-02` não chega à tela por causa do passo 4): em **Configurações > Parametrizações > Comunicações** há 4 links "Clique aqui para acessar a tela de configuração no Orion ..." (Selo Digital, e-Notariado, Coaf, SIGNO). Só o do **Coaf** tem afinidade (`coaf`) e foi acionado; o do **SIGNO** vem desabilitado pela aplicação (`disabled-no-events`). Abriu a guia *Certificados - SPCM-Comunicação COAF*, que nasceu em 1442x732 @ DPR 1.25 e foi reposta em **1440x900 @ 1.0**; os campos reais (**CPF/CNPJ**, **E-mail**, **Tipo do certificado**, **Senha**, **Cadastrar**) foram medidos ao vivo; `closeSecondaryTabs` fechou a guia e devolveu o foco. **Descoberta que corrigiu o desenho:** o link é `<a class="cursor-pointer">` **sem** `href`/`target`/`onclick` (handler do Angular), então o detector estático ("`_blank`/`window.open`") nunca o veria; o levantador passou a aceitar link/botão dirigido por JS com texto de chamada para navegação, sempre sob afinidade e nunca desabilitado, e restaura a tela se nada abrir.

**Achados que ficam como pendência (fora do escopo desta ADR):**

1. **Conta de auditoria e RBAC:** a conta do ambiente de Produtos tem os perfis *Gerência webFirmas*, *webCaixa* e *webEstoque* e é tratada como perfil pleno **pelo nome** (regra da conta antiga). A `C-FIRMA-03` mostra que isso não garante permissão total. Confirmar/liberar com Produtos antes de classificar o lote.
2. **Cura fuzzy espúria `Autenticidade → Cidade`** (Dice 83%, "autenti**cidade**" contém "cidade"), presente já no relatório anterior da `R-1.1`: no novo ambiente o nó **Cidade** está fora da área visível do modal e o validador acusa 1 discrepância (invariante 1, passo 5, `y=894`, `h` visível 6 px). Não é regressão desta ADR; corrigir exige tratar o casamento fuzzy por substring e a visibilidade em contêiner com rolagem.
3. **Cura espúria `Grupo Firmas → Firmas`** na `C-FIRMA-03` (passo 3): mede `y=1`, o item **Firmas** da barra superior, não um grupo de trabalho. Também anterior a esta ADR.
4. **Cascata de submenus em janelas headed:** a `M-40.0` falhou 2 vezes (*falha técnica*, sem tag) com a cascata de 3 níveis em modo headed, de forma determinística, e **passou em `--headless`** com todas as mudanças ativas. Para o lote, preferir `--headless`.
5. A tela **Configurações** exibe um *toast* de erro do SGA do próprio ambiente (variável `urlSga` ausente); não afeta a auditoria.

## Arquivos

`auditoria/src/`: `config.ts`, `preflight.ts` (novo), `auth.ts`, `browser.ts`, `executor.ts`, `smart-locator.ts`, `menu-path.ts`, `reveal-explorer.ts`, `prior-audit.ts` (novo), `hardware-registry.ts` (novo), `report.ts`, `cli.ts`, `types.ts`, `evidence.ts`, `rbac.ts`; testes em `__tests__/adr025-prior-audit-multitab.test.ts` (37). Console: `src/types/api.ts` (`historico_reauditoria` opcional). Padrão técnico: `standards/auditoria_agent_browser.md` §14.
