# ADR-028: Consultor Propositivo de Tela em Bloqueios `[ATT]` e Desempate de Menu por Profundidade

> **Data:** 2026-11-17  
> **Status:** Aceita e Homologada  
> **Decisores:** Marcus (Product Owner) & Claude Code  
> **Relacionada a:** ADR-016, ADR-017, ADR-019, ADR-021, ADR-024, ADR-025, ADR-026, ADR-027  

---

## 1. Contexto

Depois da reauditoria contextual no ambiente de Produtos (ADR-025 a ADR-027), a maior fila do acervo é `[ATT]` (`atualizacao_editorial`, 105 rotinas antes desta ADR). O relatório dizia **o que** não foi encontrado, mas não ajudava o redator do manual a descobrir **o que existe hoje** na tela do bloqueio. Além disso, folhas de menu homônimas em profundidades diferentes (`Notas > Protocolos` x `Notas > Consultas > Protocolos`) bloqueavam por ambiguidade mesmo quando a rota mais rasa era a única plausível.

## 2. Decisão

### 2.1. Consultor Propositivo de Tela (`att-screen-advisor.ts`)

- Quando o passo esgota todas as camadas (RAG de revisões, SmartLocator, Exploração Investigativa, Máquina de Estado) e a rotina encerra como `[ATT]`, o executor lê, **somente em leitura** e via STDIN, o `ScreenStructuralInventory` da tela do bloqueio: `location.hash`, título, seções, abas de conteúdo, campos com rótulo real e botões. A navegação lateral é excluída; modal ativo tem prioridade.
- Correspondências sugeridas por afinidade funcional: token igual (nunca substring), Dice só com termo em comum ou ≥ 0,75, mínimo 0,45, no máximo 3 por alvo. Passo de caminho de menu não gera correspondências (a rota não é adivinhada).
- Saída: `> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**` logo abaixo do `[!CAUTION]` e `auditoria_ui.diagnostico_tela_att` no frontmatter (JSONB, **sem migration**).
- **Consultivo, nunca evidência:** nada é clicado, o texto do manual segue 100% original (Evidência Estrita, ADR-017) e a sugestão nunca vira demarcação. Só rotina com tag `ATT` recebe o Raio-X; falha de leitura devolve `null` e não vira falha técnica.
- **Print de contexto:** se o passo bloqueado não tem imagem, grava `passo-NN-contexto-att.png/.webp`, fora do padrão `passo-NN[-x]` (não entra na paridade do validador e não leva marcador `[aqui vai a print]`). `sync-supabase.ts` envia o `.webp` ao Storage; a limpeza do executor remove prints de contexto obsoletas.

### 2.2. Desempate por menor profundidade (`menu-path.ts`, `chooseMenuItem`)

Folhas empatadas no **mesmo módulo raiz** e em **profundidades diferentes** resolvem pela de menor cadeia, com nota de auto-cura (`depthTieBreak`, motivo "menor profundidade de cadeia") na divergência `menu_path_resolution`. Empate na mesma profundidade, ou entre raízes diferentes, continua **bloqueio por ambiguidade** (ADR-016/ADR-024).

## 3. Testes

`auditoria/src/__tests__/adr028-att-advisor-menu-depth.test.ts` (18 testes): tokens e anti-substring, sugestões, caminho de menu sem correspondência, captura, YAML, posição do `[!TIP]` no relatório, exclusividade `ATT`, desempate 2×3, independência de ordem, ambiguidade na mesma profundidade e entre raízes, ancestral compartilhado ainda decidindo.

## 4. Resultado da Reauditoria Contextual Completa (Antes × Depois)

Lote `--reaudit-pending --headless --dry-run-mutations --concurrency 4`: 130 rotinas (17 de hardware protegidas ficaram de fora, ADR-025), 2 h 47 min, **0 falhas técnicas**, 0 logins reais (1 sessão reaproveitada, 124 resets leves), 9 revisões humanas preservadas como `revisao_solicitada` (`--seed-reviews` reexecutado: `unchanged`, disco e Supabase `ok`). Ambiente: Produtos (host mascarado `10.0.3.x`), zoom 80%.

Consolidado das Fases 2 e 3 e demais rotinas auditadas em disco (169 rotinas com `-revisado.md`; ambiente anterior = homologação 4tn SCS → Produtos + ADR-026/027/028):

| Status | Antes | Depois |
| --- | ---: | ---: |
| `validado_inalterado` | 2 | 2 |
| `validado_com_sucesso` | 2 | 2 |
| `validado_com_ajustes` | 18 | 20 |
| `[CCC]` `comunicacao_externa` (principal) | 1 | 1 |
| `[ATT]` `atualizacao_editorial` | 105 | 103 |
| `[DDD]` `dependencia_dados_banco` | 17 | 17 |
| `[XRX]` `dependencia_cruzada_rotina` | 24 | 24 |
| `nao_auditada` | 0 | 0 |

Pastas por tag (Antes → Depois): `[ATT]` 102 → 101, `[ATT][CCC]` 3 → 2, `[CCC]` 1 → 1, `[CCC][XRX]` 0 → 1, `[DDD]` 17 → 17, `[XRX]` 24 → 23, sem tag 22 → 24.

Transições: 2 rotinas **saíram** de bloqueio e foram validadas (`validado_com_ajustes`): **D-3.11** (`[ATT]`) e **D-4.0** (`[XRX]`); 1 rotina `[ATT]` passou a `[XRX]` (pré-requisito identificado); nenhuma rotina entrou em bloqueio. As 17 `[DDD]` são hardware/ambiente protegidas (ADR-025).

Efeito da ADR-028: 103 rotinas `[ATT]` saíram com `diagnostico_tela_att` e Raio-X; o desempate por profundidade foi aplicado em 8 relatórios (a maioria segue bloqueada por outra causa, como grade vazia `[XRX]`); nenhuma `passo-NN-contexto-att` foi necessária, pois todo passo bloqueado já tinha imagem.

Validação: `verify-all-phase2-boxes.ts --all` → 352 prints, 187 com geometria auditada (187/187 Zero Auto-Oclusão), 113 caixas multi-demarcadas, 352/352 pares PNG+WebP, passos bloqueados sem classificação: 0, **0 discrepâncias**.

## 5. Limitações Conhecidas

- O Orion Audit Console ainda não exibe a imagem `passo-NN-contexto-att` (o arquivo chega ao Storage); o Raio-X aparece no relatório e no JSONB.
- O Raio-X é heurístico e consultivo: a decisão de reescrever o manual é humana.
