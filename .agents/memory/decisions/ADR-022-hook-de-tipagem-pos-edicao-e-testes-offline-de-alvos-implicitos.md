# ADR-022 — Hook de tipagem pós-edição e testes offline de Alvos Implícitos

**Status:** Aceita · **Complementa:** ADR-021 (§ Alvos Implícitos), ADR-010 (sem git)

## Contexto
A heurística de alvos implícitos (`implicit-targets.ts`) não tinha testes e cobria só município/estado/data/descrição. Passos como *"informe o período inicial e final"* ou *"digite o número do documento ou CPF"* resultavam em print limpa. Edições em `auditoria/src/` também podiam acumular quebras de tipagem sem aviso.

## Decisão
1. **Hook `PostToolUse`** (`.claude/settings.json`, matcher `Edit|Write|MultiEdit`) executa `.claude/hooks/typecheck-ts.mjs`: só para `.ts` em `auditoria/src/`, roda `tsc --noEmit` e, em falha, sai com código 2 devolvendo os erros ao Claude.
2. **Testes offline** em `auditoria/src/__tests__/smart-locator-implicit.test.ts` (`node:test` via `tsx`, `npm --prefix auditoria test`). O `AgentBrowserClient` é um stub: nenhum navegador é aberto. Casos: busca geográfica, intervalo temporal, identificador único e passivo/contemplativo (guarda de não-demarcação).
3. **Heurística estendida** (`CONTROL_NOUNS`): `inicial`/`final` (apenas com contexto `período|data|intervalo`) → `Data/Período Inicial/Final`; `cpf` → `CPF`; `documento` → `Documento`/`CPF`. O grupo genérico `data` é suprimido quando o intervalo já foi resolvido, para não demarcar "Data de nascimento".

## Invariantes preservados
Evidência Estrita (texto do manual intacto, nenhuma ação executada), zona `content`, passo de navegação nunca vira alvo implícito, só se demarca rótulo real da tela.
