# Especificação Técnica: Design System Siplan (SPCM / Orion TN)

**Status:** ATIVO / HOMOLOGADO  
**Data:** 11/11/2026  
**Fonte Primária:** `auditoria/design system/` (`siplancontrolm.css`, `content.md`, `siplan - guia de estilos.pdf`)

---

## 1. Paleta Canônica de Cores (SPCM)

O ecossistema SiplanControl.M (base visual do Orion TN) adota uma paleta estrita de 6 cores corporativas:

| Nome da Cor | Hex Code | RGB | Aplicação na Interface do Sistema | Uso nas Anotações do Agente |
| :--- | :--- | :--- | :--- | :--- |
| **Bordô** | `#5a0000` | (90, 0, 0) | Títulos h2 e h4, labels de formulários, bordas de tabelas `thead`, ícones `glyphicons` inativos | Fundo de rótulos explicativos, contraste de textos |
| **Carmesim** | `#ad0505` | (173, 5, 5) | Botão primário (`.btn-spcm`), links ativos, títulos h1 e h3, abas ativas (`.nav-pills>li.active`), paginação | **Cor Primária das Molduras, Badges e Callouts de Lupa** |
| **Borgonha** | `#7f0101` | (127, 1, 1) | Variação escura para estados hover de cabeçalhos e painéis | Acentos secundários |
| **Urucum** | `#d52d2d` | (213, 45, 45) | Estado hover de botões e links (`a:hover`, `.glyphicons:hover`), destaques de alerta | Setas indicativas de transição, ponteiros de ação |
| **Cinza Médio**| `#bbbbbb` | (187, 187, 187) | Botões desabilitados (`.btn-spcm[disabled]`), ícones neutros | Fundo de badges inativos |
| **Cinza Suave**| `#999999` | (153, 153, 153) | Subtextos (`p.subtexto`), linhas divisórias, placeholders | Bordas de cards |

---

## 2. Tipografia do Sistema

* **Títulos e Cabeçalhos:** `'Oswald', sans-serif; font-weight: 700;`
  - Utilizada em títulos de telas (h1/h2), números de passos nos badges e cabeçalhos de cards de zoom.
* **Corpo, Labels e Formulários:** `'Lato', Arial, sans-serif; font-weight: 300 / 400;`
  - Utilizada nos textos dos formulários, rótulos de campos e descrições das rotinas.

---

## 3. Seletores CSS e Componentes Chave para o `agent-browser`

Ao interagir com o sistema via `agent-browser`, o agente pode recorrer a esses seletores canônicos para navegação determinística:

### 3.1. Botões
* **Botão Primário Siplan:** `button.btn-spcm`, `.btn.btn-spcm`
* **Botão Desabilitado (Aguardando Preenchimento):** `.btn-spcm[disabled]`, `.btn-spcm.disabled`
* **Botão de Confirmação:** `.btn-success`, `.btn .glyphicon-ok`
* **Botão Cancelar:** `.btn-danger`, `.btn .glyphicon-remove`

### 3.2. Formulários e Abas
* **Labels:** `label`, `form label`, `.gabel` (cor `#5a0000`)
* **Inputs com Foco:** `input:focus`, `.form-control:focus` (gera `border-color: #ad0505; box-shadow: 0 0 10px #ad0505;`)
* **Abas e Navegação:**
  - Aba Ativa: `.nav-pills>li.active>a` (fundo `#f1f1f1`, borda `#ad0505`, texto `#ad0505`)
  - Wizard: `.wizard-card.ct-wizard-red > ul > li.active a`
  - Acordeon: `h4.panel-title a` (cor `#5a0000`, hover `#ad0505`)

### 3.3. Ícones (Glyphicons e Halflings)
* Todos os ícones herdam `.glyphicons, .halflings { color: #5a0000; }` com hover em `#d52d2d`.
* **Micro-Ícones Críticos (Dimensões <= 44px):**
  - Busca / Lupa: `.glyphicon-search`, `.glyphicons-search` (dispara automaticamente o **Zoom Callout de 2.5x**)
  - Calendário / Data: `.glyphicon-calendar`
  - Adicionar / Expandir: `.glyphicon-plus`
  - Informações: `.glyphicon-info-sign` (cor `#5bc0de`)
  - Sucesso / Validação: `.glyphicon-ok-circle` (cor `#5cb85c`)

---

## 4. Diretrizes Visuais para Capturas de Tela

1. **Canvas 100% Puro do Sistema:**
   - Não adicionar molduras externas de navegador (sem barras simuladas de browser). O print deve retratar fielmente a tela real da aplicação.
2. **Sem Tarjas ou Blurs:**
   - Como o ambiente de homologação utiliza massa de dados 100% fictícia, todos os campos, cadastros, fotos e cartões permanecem totalmente visíveis e desobstruídos.
3. **Destaque em Carmesim Siplan (`#ad0505`):**
   - Moldura retangular com espessura de 3px, cantos arredondados de 6px e preenchimento translúcido com opacidade de 10%.
   - Badge tipo pílula com micro-ícone SVG da ação + número do passo em Oswald Bold.
4. **Zoom Callout para Micro-Ícones:**
   - Para botões/ícones com dimensões <= 44px, insere um card de detalhe ampliado a 2.5x no canto, conectado ao elemento por uma linha tracejada.
5. **Setas Indicativas Curvas (*Curved Arrows*):**
   - Utilizadas exclusivamente para demonstrar transições de abas ou fluxos de dois passos correlacionados na mesma tela.
