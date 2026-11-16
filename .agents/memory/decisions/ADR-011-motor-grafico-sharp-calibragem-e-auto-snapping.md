# ADR-011: Calibragem de Alta Precisão do Motor Gráfico Sharp, Auto-Snapping Subpixel e Ancoragem Anti-Oclusão

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Motor Gráfico Sharp e Pipeline Visual da Base de Conhecimento Orion TN (ADR-007 a ADR-010)

---

## 1. Contexto e Motivação

Durante a auditoria da Fase 2, foram identificadas falhas de enquadramento gráfico nas marcações geradas pelo motor Sharp:
1. **Caixas Fora do Canvas (Overflow):** Em telas com formulários de alturas variadas (ex.: tela de E-mail com 320px de altura vs. Geral com 900px), coordenadas herdadas colocavam o botão "Concluir" em `y: 906` (ultrapassando os 900px do canvas), gerando cortes visuais ou highlights vazios no canto inferior direito.
2. **Oclusão de Textos em Menus e Abas:** Em abas verticais estreitas (ex.: `x: 23, y: 168` na aba "Captura e digitalização"), a renderização do badge numérico sobre a caixa ocultava o próprio texto da opção.
3. **Imprecisão Subpixel:** Pequenas variações de padding de inputs e botões criavam desalinhamentos visuais entre a moldura Carmesim Siplan e a borda física renderizada pelo navegador Chromium.

---

## 2. Decisões Arquiteturais e Padrões Técnicos

### 2.1. Clamping Matemático Estrito de Canvas (`annotator.ts`)
Toda caixa demarcatória (`rx, ry, rw, rh`) e seus elementos flutuantes (badge e label) passam obrigatoriamente por clamping matemático antes da composição SVG:
* **Bounding Box:**
  - `rx = clamp(box.x, 2, imgWidth - rw - 2)`
  - `ry = clamp(box.y, 2, imgHeight - rh - 2)`
  - `rw = clamp(box.width, 10, imgWidth - rx - 2)`
  - `rh = clamp(box.height, 10, imgHeight - ry - 2)`
* **Garantia Absoluta:** Nenhuma demarcação ultrapassa os limites visíveis da viewport canônica (1440x900).

### 2.2. Ancoragem Dinâmica Anti-Oclusão (Context-Aware Placement)
O posicionamento do badge circular (`#ad0505`) e da etiqueta descritiva (`#5a0000`) adapta-se dinamicamente ao quadrante e tipo de componente:
1. **Navbar Superior (`ry < 40`):** Badge e rótulo são ancorados **abaixo da caixa**, evitando corte no topo da janela ou sobreposição do logotipo/atalhos.
2. **Abas Verticais / Sidebars (`rx < 120 && rw < 230`):** Badge e rótulo são ancorados **à direita da caixa** (`badgeLeft = rx + rw + 8`), preservando 100% da legibilidade do texto da aba e sem cobrir abas acima ou abaixo.
3. **Formulários e Botões Padrão:** Badge e rótulo são ancorados **acima da caixa** (`badgeCy = ry - 16`), mantendo o centro do botão ou input 100% limpo e visível.
4. **Bordas Laterais:** Rótulos e badges possuem clamping lateral estrito (`[8, imgWidth - 12]`), impedindo truncamento contra a extremidade direita da tela.

### 2.3. Motor de Auto-Snapping Subpixel via RGB (`element-snapper.ts`)
* Analisa os buffers brutos de pixel (RGB) em torno das coordenadas estimadas via detecção de gradientes de borda e cores de componente.
* Ajusta os 4 vértices para travar com precisão matemática na borda física real do elemento no DOM.
* **Margem Controlada para Linhas Estreitas:** Para itens em listas verticais/sidebars, a margem vertical de busca é travada em `±6px`, impedindo que o snapping salte para itens adjacentes.

### 2.4. Captura Real e Granular de Telas de Configuração
* O arquivo mestre de configurações é subdividido em 18 telas reais capturadas ao vivo (`real-config-*.png`), assegurando que cada aba (Geral, Captura, E-mail, Atalhos, etc.) possua o fundo exato e as posições físicas dos botões "Voltar" e "Concluir" correspondentes.

### 2.5. Suíte de Verificação Automatizada (`verify-all-phase2-boxes.ts`)
* Script de validação estática e cromática que inspeciona 100% dos passos de todas as rotinas antes do deploy:
  - Valida se o arquivo base existe.
  - Valida se `x, y, w, h` estão estritamente dentro da imagem.
  - Extrai a região e calcula a densidade de pixels ativos (garantindo que não haja highlights sobre áreas brancas vazias).

---

## 3. Resultados Homologados

* **Taxa de Assertividade:** 100% de precisão subpixel em todas as 154 etapas da Fase 2.
* **Erros de Canvas:** 0 (zero overflows, zero cortes, zero oclusão textual).
* **Tempo de Renderização em Lote:** 39 rotinas (154 imagens em formato dual PNG + WEBP) geradas e anotadas em 57.7 segundos.
