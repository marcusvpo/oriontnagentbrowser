# ADR-007: Arquitetura de Auditoria Visual e Saneamento de Rotinas via Agent-Browser e Sharp

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Base de Conhecimento Orion TN V3.2.0 (471 rotinas atômicas homologadas em `kb/` e mestre consolidado)

---

## 1. Contexto e Motivação
A base de 471 rotinas foi consolidada e normalizada em padrão V3.2.0 (ADR-001 a ADR-006). Contudo, a maioria dos roteiros foi gerada a partir de transcrições de vídeos e treinamentos históricos. Faz-se necessário um processo contínuo de auditoria automatizada diretamente contra a interface real do sistema no ambiente de homologação, visando:
1. Validar se caminhos de menu, botões e campos descritos continuam fiéis à interface atual.
2. Atualizar termos que sofreram alterações de rotulagem (labels) ou reordenação de abas.
3. Produzir documentação visual profissional com capturas de tela enriquecidas com moldura e badge numérico sobre os elementos acionados.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Ferramenta de Navegação (`vercel-labs/agent-browser`)
* A automação utiliza o `agent-browser` (CLI nativo em Rust desenvolvido pela Vercel Labs), que roda via CDP com Chrome for Testing.
* A extração de elementos ocorre via árvore de acessibilidade compacta (`snapshot -i --json`), utilizando referências curtas (`@e1`, `@e2`), garantindo eficiência de tokens e controle determinístico.
* As coordenadas espaciais para anotação visual são extraídas diretamente da engine através do comando `agent-browser get box @ref --json`.

### 2.2. Pós-Processamento Gráfico via Sharp (Node.js) & Guia de Estilos Siplan
* **Princípio do DOM Imutável e Canvas Puro:** O navegador nunca injeta estilos, CSS ou elementos DOM na aplicação de homologação. A captura retrata fielmente o canvas real da aplicação sem molduras simuladas de janela de navegador.
* **Massa Fictícia Sem Tarjas:** Como o ambiente de testes utiliza exclusivamente dados fictícios/sintéticos, não há aplicação de tarjas de desfoque (LGPD blur), preservando a legibilidade e transparência total de formulários, fotos e cartões.
* **Padrão Gráfico Siplan (SPCM):**
  * **Cor Canônica Carmesim Siplan (`#ad0505`):** Moldura de destaque arredondada (`rx: 6px, ry: 6px`) com espessura de `3px`, preenchimento translúcido de `10%` e respiro de `4px`.
  * **Tipografia Siplan:** Número do passo em **Oswald Bold** e rótulos/textos em **Lato**.
  * **Pill Badge com Micro-Ícones:** Pílula em Carmesim `#ad0505` com micro-ícone SVG inline representando a ação (`click`, `fill`, `search`, `select`, `verify`).
  * **Zoom Callout (2.5x):** Para micro-ícones minúsculos (dimensões <= 44px, como lupas de busca e calendários), o Sharp compõe um card flutuante ampliado no canto, conectado ao elemento por linha pontilhada.
  * **Setas Indicativas Curvas:** Utilizadas para conectar ações sequenciais ou transições de abas.
  * **Exportação Dual:** Geração automática do par `.png` (master) e `.webp` (redução de ~58% em disco).

### 2.3. Estrutura Híbrida de Armazenamento (Preservação RAG - ADR-005)
* **Pasta `kb/` (Produção RAG):** Permanece estritamente com os textos e metadados saneados, sem caminhos binários locais de imagens, preservando a calibração de `max_chunk_size_tokens: 1800` do OpenAI Vector Store.
* **Pasta `auditoria/` (Workspace Visual):**
  * `auditoria/rotinas/[modulo]/[id]-[slug]/`: Contém **SOMENTE** os prints anotados da rotina (`passo-01.png`, `passo-02.png`, etc.) e o arquivo de esboço `[id]-[slug]-revisado.md` com as indicações explícitas de inserção de cada print.
  * `auditoria/cache/raw/`: Capturas originais da viewport inteira para auditoria e backup (isoladas fora da pasta da rotina).

### 2.4. Ambiente, Conectividade e Tolerância a Falhas
* **Conectividade:** Aplicação Web interna/intranet que depende de VPN ativa na máquina local. O orquestrador realiza um teste prévio de conectividade antes de disparar batches.
* **Sessão:** Persistência via `agent-browser state save ./auditoria/auth/session-homolog.json` e `state load` para inicialização imediata.
* **Massa de Dados:** Sandbox livre com autonomia de geração dinâmica de CPFs/CNPJs válidos e nomes fictícios (`data-generator.ts`), realizando commits reais para desbloqueio de telas subsequentes.
* **Resiliência:** Divergências semânticas óbvias (>85%) são corrigidas no texto; bloqueios estruturais ou erros disparam print do erro, status `requer_revisao_humana` e skip para a próxima rotina.
* **Modos de Exibição:** Modo `--headed` (janela visível) para PoCs e depuração; modo `--headless` para grandes lotes.

---

## 3. Consequências e Benefícios
* As rotinas ganham fidelidade operacional comprovada pela interface real.
* Documentação visual rica e profissional pronta para onboarding e manuais de clientes.
* RAG e Vector Store permanecem protegidos contra poluição de tokens ou artefatos pesados.
