# ADR-012: Transição de Heurísticas Visuais/RGB para Geometria Determinística do DOM e Solver Anti-Oclusão

* **Status:** Aprovada e Vigente (Substitui o item 2.3 da ADR-011)
* **Data:** 2026-11-11
* **Contexto:** Pipeline de Automação Playwright/CDP, Introspecção DOM e Motor Gráfico Sharp (Orion TN)

---

## 1. Contexto e Problema Arquitetural

Nas iterações anteriores da auditoria visual, tentou-se contornar desalinhamentos de coordenadas usando duas abordagens paliativas:
1. **Tabelas Estáticas de Coordenadas (`COORDS` em `execute-phase2.ts`):** Dicionários hardcoded assumindo posições fixas de botões e menus que quebram diante de qualquer mudança dinâmica de layout, rolagem (`scroll`) ou altura variável de formulário.
2. **Auto-Snapping por Leitura de Pixels RGB (`element-snapper.ts` na ADR-011):** Algoritmo pós-captura que decodificava o buffer PNG para RGB bruto e buscava contrastes (`diff > 35`) ao redor da caixa estimada.

### Por que o Auto-Snapping via RGB foi Aposentado (Inversão de Pipeline):
* **Redundância com o Motor Blink:** O Chromium já calcula o `border-box` exato de cada nó na fase de Layout com precisão subpixel (`DOMRect`). Tentar "redescobrir" limites de botões lendo pixels rasterizados é computacionalmente redundante e propenso a falhas.
* **Fragilidade em Componentes Flat e Sombras:** Em links de texto sem borda (como abas laterais ou itens de navbar), o detector RGB encolhia a caixa para a tinta das letras; em botões próximos a divisores ou sombras (`box-shadow`), expandia indevidamente a caixa englobando elementos vizinhos.
* **Custo de I/O Duplicado:** Exigia decodificar a imagem duas vezes e usava espera ocupada síncrona (`while (Date.now() - start < delay)`) na escrita em disco.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Fonte Única de Verdade: Geometria Determinística do DOM (`dom-geometry.ts`)
Toda coordenada de elemento é extraída exclusivamente do DOM real via protocolo atômico (`captureStepWithDOMGeometry` em `browser.ts`):
1. **Travessia Completa:** Busca no documento principal e acumula offsets de `<iframe>` (`frameRect.left + clientLeft`, `frameRect.top + clientTop`) quando aplicável.
2. **Garantia de Visibilidade (`scrollIntoViewIfNeeded`):** Caso o elemento esteja parcial ou totalmente fora da área visível (`rect.top < 0 || rect.bottom > innerHeight`), executa `el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })` **antes** da captura do screenshot e da leitura de coordenadas.
3. **Estabilização de Reflow:** Força reflow síncrono (`void el.offsetHeight`) pós-scroll antes de ler `getBoundingClientRect()`.
4. **Transformação Desacoplada de Resolução (`CSS Space -> Physical Image Space`):**
   O motor gráfico calcula os fatores de escala reais entre o buffer da imagem (`metadata.width`, `metadata.height`) e o viewport do DOM (`viewport.width`, `viewport.height`):
   $$s_x = \frac{W_{\text{img}}}{W_{\text{viewport}}}, \quad s_y = \frac{H_{\text{img}}}{H_{\text{viewport}}}$$
   compensando automaticamente qualquer `devicePixelRatio` (DPR 1.0, 1.25, 1.5, 2.0).

### 2.2. Remoção Definitiva de `element-snapper.ts` e de `COORDS` Estáticos
* O módulo `element-snapper.ts` foi removido do código-fonte e do pipeline `annotator.ts`.
* A tabela legada `COORDS` de `execute-phase2.ts` foi eliminada.

### 2.3. Solver Matemático de Layout Anti-Oclusão (`computeOptimalAnnotationLayout`)
O motor gráfico Sharp (`annotator.ts`) foca estritamente em suas responsabilidades legítimas:
* **Clamping Estrito no Buffer Real:** Todas as caixas (`targetBox`, `badgeBox`, `labelBox`) são matematicamente confinadas dentro de `[margin, imgWidth - margin]` $\times$ `[margin, imgHeight - margin]`.
* **Avaliação Multi-Quadrante (`top`, `bottom`, `right`, `left`):** O solver testa os 4 quadrantes cardinais guiado pelo contexto semântico do DOM (`isVerticalSidebar`, `isTopNav`, `neighborBoxes`) e escolhe a direção que garante **Invariante de Zero Auto-Oclusão** ($\text{Interseção}(\text{Anotação}, \text{Elemento}) = 0\text{ px}^2$) e zero colisão entre badge e rótulo.
* **I/O Assíncrono Não-Bloqueante:** Decodificação única do buffer em memória com exportação paralela (`.clone()`) de `.png` e `.webp` via `Promise.all` e escrita assíncrona (`fs.promises.writeFile`).

### 2.4. Validação Geométrica e Estrutural Real (`verify-all-phase2-boxes.ts`)
O validador deixa de usar regex sobre código-fonte e passa a auditar 5 invariantes formais sobre o manifesto tipado:
1. Confinamento estrito de `targetBox`, `badgeBox` e `labelBox` dentro de `metadata.width` $\times$ `metadata.height`.
2. Invariante de Zero Auto-Oclusão (`selfOcclusionArea === 0`).
3. Invariante de Zero Colisão Badge $\leftrightarrow$ Rótulo (`calculateRectIntersection(badgeBox, labelBox) === 0`).
4. Variância de luminância ($\sigma^2$) e densidade estrutural na região demarcada.
5. Paridade física dos artefatos `.png`, `.webp` e marcadores no arquivo `-revisado.md`.
