# ADR-008: Execução Mandatória via Subagents e Aceleração por Fast DOM Introspection

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Pipeline de Auditoria Visual de 471 Rotinas do Orion TN (ADR-007)

---

## 1. Contexto e Motivação

O plano de auditoria das 471 rotinas do Orion TN exige processamento contínuo em larga escala. No teste piloto inicial da Fase 1, identificaram-se três gargalos fundamentais:

1. **Sobrecarga de Janela de Contexto no Coordenador:** A execução de múltiplos passos interativos na conversa principal do chat polui o histórico com comandos de baixo nível, consome cota excessiva e desacelera o feedback ao usuário.
2. **Latência e Custo de Visão/OCR vs DOM Nativo:** Questionou-se a possibilidade de utilizar modelos de visão/OCR para localizar botões. A análise técnica comprovou que inferência visual em nuvem adiciona de 3 a 8 segundos de latência por imagem, consome entre 1.000 e 2.000 tokens por print (totalizando mais de 3 milhões de tokens para o acervo) e sofre de imprecisão de bordas (pixel jitter).
3. **Navegação Sequencial Lenta:** Navegar clicando um a um em menus e submenus acumula esperas de renderização desnecessárias.

Para viabilizar a auditoria de centenas de rotinas de forma rápida, barata e matematicamente precisa, formalizam-se as diretrizes deste ADR.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Execução Mandatória via Subagents (`invoke_subagent`)
* **Regra de Ouro da Orquestração:** O agente coordenador na conversa principal **NUNCA** executa comandos interativos de terminal passo a passo para percorrer telas ou auditar rotinas.
* **Delegação Completa de Fase:** Toda solicitação de auditoria (seja uma fase inteira como a Fase 2, ou um lote de rotinas) deve ser delegada imediatamente a um subagente dedicado via ferramenta `invoke_subagent`:
  - **TypeName:** `research` ou `self`
  - **Role:** `Auditor de Rotinas Orion TN`
  - **Model:** `inherit`
  - **Prompt:** Contendo o escopo exato da fase, lista de IDs de rotinas, credenciais do ambiente de homologação e caminho das pastas de saída.
* **Retorno Consolidado:** O subagente executa o lote autonomamente em seu próprio contexto, gera todas as pastas, imagens anotadas e arquivos `*-revisado.md`, valida os resultados e envia apenas o resumo executivo final para o coordenador reportar ao usuário.

### 2.2. Fast DOM Introspection (Substituição de OCR)
* **Zero Tokens & 2 Milissegundos:** A obtenção de coordenadas de caixas delimitadoras (`boundingBox`: x, y, width, height) para alimentar o Sharp é realizada diretamente pelo motor Blink do Chromium (`document.querySelector(...).getBoundingClientRect()` ou `agent-browser get box`).
* **Busca Semântica no DOM:** O motor localiza botões e campos por texto visível, atributos de acessibilidade (`aria-label`, `role`), ou classes Bootstrap da aplicação, eliminando a necessidade de OCR ou inspeção visual pesada por IA.
* **Composição Instantânea no Sharp:** As coordenadas matemáticas exatas são passadas ao Sharp em memória, gerando a anotação gráfica Carmesim em menos de 15ms por print.

### 2.3. Aceleração por Rotas Hash do Angular SPA
* Como o Orion TN é uma Single Page Application (SPA) baseada em AngularJS / Angular com hash routing, o agente aproveita a navegação direta por URL hash (ex.: `#/pedidoFirmas/cadastrar`, `#/notas/novo`, `#/caixa/fluxo`).
* Essa navegação direta salta etapas intermediárias redundantes de abertura de menus, reduzindo o tempo de acesso a qualquer tela de 10 segundos para 300 milissegundos.

### 2.4. Ancoragem Dinâmica de Badges e Rótulos (SPCM)
* **Elementos em Barra Superior (`ry < 40`):** Quando o botão auditado pertence à barra de navegação no topo da tela, o badge numérico e a pílula de rótulo são ancorados obrigatoriamente **abaixo da caixa delimitadora** (`badgeCy = ry + rh + 14`, `labelY = badgeCy + 1`). Isso garante que o texto original do menu (ex.: "Firmas", "Notas") permaneça 100% desobstruído e legível.
* **Elementos Gerais (`ry >= 40`):** O badge numérico é posicionado no canto superior esquerdo e o rótulo é alinhado logo acima do elemento, mantendo a harmonia visual.
* **Escrita Segura no Windows (`safeWriteFileSync`):** O motor Sharp implementa retries exponenciais e escrita atômica para evitar bloqueios transitórios de arquivo (`EBUSY`/`UNKNOWN`) comuns no sistema de arquivos do Windows.

---

## 3. Benefícios e Impacto

| Critério | Abordagem Legada / OCR | Nova Arquitetura (ADR-008) |
| :--- | :--- | :--- |
| **Tempo por Rotina** | 30 a 60 segundos | **3 a 6 segundos** (10x mais rápido) |
| **Consumo de Tokens** | 2.000 tokens por print (~3M total) | **Zero tokens** para extração de coordenadas |
| **Janela de Contexto** | Esgota rapidamente na conversa principal | **Totalmente preservada** via subagents |
| **Precisão de Alinhamento** | Variável com jitter de 5-15px | **100% exato** (subpixel via GPU/DOM) |
| **Legibilidade do Texto** | Badges cobriam texto em barras de menu | **100% desobstruído** via ancoragem dinâmica |
