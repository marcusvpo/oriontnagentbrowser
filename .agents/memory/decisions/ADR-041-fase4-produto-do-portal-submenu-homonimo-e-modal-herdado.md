# ADR-041: Fase 4 (`caixa`) — Produto do Portal (`--product`), Submenu Homônimo, Produto Ativo Fora dos Alvos e Modal Herdado

> **Data:** 2026-11-26  
> **Status:** Aceita e Implementada  
> **Decisores:** Product Owner & Equipe de Auditoria Orion TN  
> **Relacionada a:** ADR-016, ADR-017, ADR-024, ADR-025, ADR-035, ADR-037, ADR-040

---

## 1. Contexto

A Fase 4 audita as 105 rotinas de `kb/rotinas/caixa/`, que se dividem entre três cards do Portal Orion (`/webPortal/#/produtos`): **Orion TN** (`/webFirmas`), **Orion Caixa** (`/webCaixa`) e **Orion Estoque** (`/webEstoque`); os dois últimos abrem em nova guia. O motor só sabia entrar no Orion TN, e o piloto e os lotes revelaram quatro lacunas objetivas:

1. **Um único produto:** `loginOrion` clicava sempre no card Orion TN e gravava um único `app-home.json`/`session-homolog.json`.
2. **Submenu com folha homônima:** `Administração > Mensalistas` é um submenu em cascata cujo único filho é a tela `Mensalistas` (`#/mensalistas`); o casamento exato parava no submenu e a rotina não navegava (M-1.0, M-2.0).
3. **Nome do produto ativo como alvo:** "Abra o **Orion Caixa**" / "No **Orion Caixa**, abra..." com a sessão já dentro do Orion Caixa bloqueava o passo 1 com `[ATT]` ("Orion Caixa não localizado"). A ADR-024 só removia **Orion TN**.
4. **Modal herdado:** **Imprimir** (passo 4 de M-7.0) abre o modal Bootstrap `#mbmodalSelecaoModelo`; o passo 5 (**Limpar**, tela de trás) era recusado pela Camada 1 (escopo do modal, correto) e a auto-cura A11y clicava o nó por trás do modal: `falha_tecnica` determinística (4 tentativas).

## 2. Decisão

### 2.1. Produto do Portal (`config.ts`, `auth.ts`, `cli.ts`)
- `--product "Orion TN" | "Orion Caixa" | "Orion Estoque"` (aceita slug e nome curto, sem acento/caixa); padrão **Orion TN** (comportamento anterior intacto).
- Arquivos por produto dentro de `auditoria/auth/` (ignorado pelo Git): `app-home.json`/`session-homolog.json` para TN, `app-home-<slug>.json`/`session-homolog-<slug>.json` para os demais.
- `openPortalProductCard` clica o card por **texto exato**, detecta a nova guia (ADR-025), fecha a do portal, reaplica o viewport 1440x900 e persiste a URL real descoberta ao vivo. `isSessionActiveInPage` aceita o path do módulo ativo; para TN continua aceitando `/webFirmas`.
- Logs mascaram o host (`maskUrlHost`). Nenhuma URL, IP ou credencial em código.

### 2.2. Submenu homônimo (`menu-path.ts`, `chooseMenuItem`)
Item exato com filhos, não desabilitado, cujo **único** filho direto de mesmo nome normalizado é folha não desabilitada → desce ao filho (`exact: false`, confiança 0,95, motivo registrado). Sem homônimo, homônimo com filhos ou item folha: comportamento anterior.

### 2.3. Produto ativo fora dos alvos (`step-scope.ts`, `stripProductNameTargets(step, activeProduct)`)
O nome em negrito do **produto ativo** (`config.portalProduct` ≠ Orion TN), precedido de verbo de contexto (*no, na, abra o, acesse o, entre no, dentro do...*), sai da lista de alvos; o texto do manual não muda (Evidência Estrita). O nome de **outro** produto continua alvo e bloqueia se ausente. A regra da ADR-024 para **Orion TN** fica intacta.

### 2.4. Modal herdado (`modal-scope.ts`, `executor.ts`)
Antes de medir o passo N > 1: leitura sem efeito (`buildInheritedModalProbeScript`) dos modais visíveis (`ACTIVE_MODAL_SELECTOR`). `shouldDismissInheritedModal` só autoriza fechar quando **nenhum** alvo do passo aparece no modal **e todos** existem como controle visível fora dele. O fechamento usa só controle de saída (`closeActiveModals`: X/Cancelar/Fechar), nunca gravação. Em qualquer dúvida o modal fica.

### 2.5. Calibragem pontual por rota
`#/tipoMovimentacaoFinanceira/cadastrar`: `Tipo de Lançamento` → `Tipo lançamento` (Raio-X de M-65.0; aceito só com o nó medido ao vivo).

### 2.6. Rejeitado
Regra de "passo condicional inteiro" (descartar negritos de "Para faturas **abaixo de R$ 50,00**:") — a varredura do KB mostrou 42 passos atingidos em 471 rotinas, muitos com controles reais ("Para pesquisar por **Nome**:", guia **Partes**, tecla **Tab**). C-FIN-08 e C-FIN-11 ficam `[ATT]` para triagem humana.

## 3. Consequências
- Rotinas de Orion Caixa/Estoque são auditadas no módulo real, com a árvore de menus lida ao vivo nele. O catálogo canônico 06.05.02 (ADR-037) é só do Orion TN: nos outros produtos a Camada 3 nunca vira evidência (a cadeia precisa existir na árvore viva) e a mensagem de bloqueio ainda diz "árvore de navegação real do Orion TN" (cosmético).
- Testes offline: `portal-product-selection.test.ts` (produto, isolamento de arquivos, produto ativo fora dos alvos), `triage-att-level25.test.ts` (sinônimo M-65.0 e submenu homônimo), `modal-scope.test.ts` (decisão do modal herdado e compilação do script).
