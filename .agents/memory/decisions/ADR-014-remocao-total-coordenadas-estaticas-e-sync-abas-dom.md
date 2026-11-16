# ADR-014: Eliminação Total de Coordenadas Estáticas, Sincronização Dinâmica de Abas SPA e Streaming STDIN para Introspecção do DOM no Windows

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-12
* **Contexto:** Homologação Definitiva da Fase 2 (39 Rotinas), Cumprimento Rígido da ADR-010/ADR-012 e Resolução de Limites de Linha de Comando no Windows

---

## 1. Contexto e Problema Arquitetural

Durante a validação visual da Fase 2, identificou-se que rotinas de configuração parametrizada (notadamente `M-16.2`, `M-16.6`, `M-16.7` e `M-16.10`) apresentavam demarcações desalinhadas, caixas cortando títulos ao meio e capturas congeladas na aba inicial ("Geral"), mesmo após a introdução da geometria matemática do DOM (ADR-012).

A investigação revelou três causas raízes estruturais no pipeline:

1. **Persistência de Coordenadas Estáticas e Imagens de Cache Legadas:**
   - O arquivo mestre da Fase 2 (`run-phase2-master.ts`) ainda mantinha mais de 120 objetos com literais fixos `{ x: ..., y: ..., width: ..., height: ... }`, tabelas como `NAVBAR` e referências a arquivos estáticos (`baseImage: 'test-tela-configuracoes.png'`).
   - Essa prática violava diretamente a **ADR-010 (Anti-Mock)** e a **ADR-012 (Geometria Determinística do DOM)**, pois qualquer variação de renderização, fonte ou tamanho de contêiner gerava caixas arbitrárias sobrepostas a textos e áreas vazias.

2. **Ausência de Sincronização de Transição entre Abas no Angular SPA:**
   - Em rotinas multi-abas (ex.: `Configurações` > `Captura e digitalização` / `Campos obrigatórios`), o passo 2 apenas demarcava a aba lateral sem disparar e aguardar o evento de clique e a consequente renderização do contêiner específico no DOM.
   - O passo 3 realizava a medição e o print enquanto a tela ainda se encontrava na aba anterior ("Geral"), causando descompasso total entre o texto do passo a passo e o print capturado.

3. **Estouro de Limite de Linha de Comando no Windows (`cmd.exe`):**
   - No Windows, a execução do comando `agent-browser eval "eval(atob('<base64>'))"` via shell disparava o erro fatal `Linha de comando muito longa` quando o script gerado por `buildDOMIntrospectionScript()` excedia o limite de caracteres de argumentos de processo (8.191 caracteres).

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Streaming STDIN para Introspecção do DOM no Windows (`auditoria/src/browser.ts`)
- Substituiu-se a passagem de scripts Base64 pela linha de comando pela execução com `child_process.spawn` e streaming direto via `stdin`:
  ```typescript
  // Em browser.ts
  async eval(code: string): Promise<string> {
    return this.run(['eval', '--stdin'], code);
  }
  ```
- O método `run(args, stdinInput)` abre o pipe de entrada para o processo `npx.cmd agent-browser` e escreve o código JavaScript diretamente no stream, suportando scripts de qualquer tamanho com zero risco de estouro de buffer do sistema operacional.

### 2.2. Eliminação Total e Irrevogável de Coordenadas Estáticas (`run-phase2-master.ts`)
- **Proibição de Literais de BoundingBox:** Fica terminantemente vedada a presença de qualquer objeto manual `{ x, y, width, height }`, tabelas de `NAVBAR` ou imagens de fundo `baseImage` nos manifestos de execução da auditoria.
- **Manifesto 100% Declarativo:** O manifesto de rotinas passa a definir exclusivamente a intenção semântica:
  - `navigateHash`: Rota hash do Angular SPA para salto direto (ex.: `#/configuracao/parametrizacao`).
  - `targets`: Seletores CSS e expressões semânticas visíveis no DOM (`['.navbar a:has-text("Configurações")', 'Configurações']`).
  - `actionType`: Tipo de interação (`click`, `fill`, `select`, `search`, `verify`).
  - `clickTargetAfter` / `clickSelectorAfter`: Flag ou seletor explícito para transição efetiva pós-medição (ex.: clique real na aba lateral).
  - `waitSelector`: Seletor do contêiner que deve estar visível e ativo antes da medição do passo seguinte.

### 2.3. Sincronização Dinâmica de Abas e Transições de UI
1. **Passo de Seleção de Aba:**
   - O elemento da aba é localizado no DOM real, medido com precisão subpixel via `getBoundingClientRect()`, anotado com moldura Carmesim Siplan e imediatamente clicado no navegador.
2. **Passo de Conteúdo da Aba:**
   - O executor aguarda a visibilidade do contêiner específico (ex.: painel ativo de *Campos Obrigatórios* ou *Captura e Digitalização*).
   - O contêiner pai visível é capturado e medido dinamicamente via `dom-geometry.ts`, garantindo que toda a seção de formulário seja demarcada proporcionalmente, sem cortes de títulos e sem áreas vazias.

### 2.4. Telemetria Viva do DOM (`phase2-live-telemetry.json`)
- Cada execução ao vivo persiste a telemetria completa de medição extraída diretamente do DOM do Chromium:
  - Timestamp de captura
  - Seletor matched real
  - Coordenadas dinâmicas (`cssBox`)
  - Métricas de Viewport (DPR 1.0, scroll)
  - Contexto semântico (`isTopNav`, `isVerticalSidebar`, irmãos adjacentes)
- O script de auditoria geométrica (`verify-all-phase2-boxes.ts`) audita 100% dos 5 invariantes matemáticos diretamente contra o arquivo de telemetria gerado ao vivo e os screenshots brutos em `auditoria/cache/live-phase2/`.

---

## 3. Consequências e Resultados Homologados

1. **Zero Coordenadas Estáticas:** O código da Fase 2 está 100% em conformidade com as regras da ADR-012.
2. **Paridade Visual Absoluta:** As 39 rotinas (154 passos) da Fase 2 exibem com precisão milimétrica o estado ativo da interface, abas clicadas e contêineres preenchidos.
3. **Robustez no Windows:** Scripts de introspecção complexos rodam fluidamente via streaming STDIN em ambiente Windows.
4. **Base Homologada para as Próximas Fases:** O padrão declarativo e o pipeline STDIN servem de base obrigatória e direta para a Fase 3 e fases subsequentes.
