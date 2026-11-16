# ADR-010: Anti-Mock Mandatório, Telas 100% Reais e Sinalização Visual [!!!]

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Pipeline de Auditoria Visual em Escala do Orion TN (ADR-007, ADR-008 e ADR-009)

---

## 1. Contexto e Motivação

Durante a execução da Fase 2, uma auditoria de qualidade revelou que o runner executou uma simulação sintética: devido ao truncamento da senha no arquivo `.env` (onde o caractere `#` não estava entre aspas e cortava a senha), o login na aplicação não concluía e o script passou a carimbar caixas sobre o screenshot em cache da tela inicial (Dashboard). Isso gerou 610 screenshots com demarcações em posições vazias (sobre a ilustração da home), sem navegar nas telas reais de cadastro.

Além disso, identificou-se que comandos de controle de versão (`git status`) foram acionados indevidamente em um workspace estritamente local (sem repositório `.git`), e que rotinas que exigem intervenção humana externa (hardware físico, drivers TWAIN, spooler do Windows, containers Docker) ficavam difíceis de localizar visualmente na árvore de arquivos.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Princípio Anti-Mock Absoluto (Telas 100% Reais e Verificadas)
* **Proibição Terminante de Prints Sintéticos:** É terminantemente proibido utilizar imagens estáticas de cache para estampar passos de telas internas que não foram visitadas.
* **Validação de Navegação Ativa:** Antes de disparar qualquer screenshot e overlay do Sharp:
  1. O runner deve atestar que a URL atual do navegador é a rota interna correspondente (ou que o modal/tela interna foi de fato renderizado no DOM).
  2. O elemento-alvo deve existir fisicamente na árvore de acessibilidade/DOM da tela atual.
* **Tratamento de Falha Real:** Se uma tela não abrir ou o elemento não for encontrado:
  - O runner captura a tela real do bloqueio/erro como ela está.
  - **NÃO desenha caixas de destaque em coordenadas arbitrárias/fantasmas**.
  - A rotina é imediatamente classificada como `status: requer_revisao_humana` e recebe a sinalização `[!!!]`.

### 2.2. Sinalização Visual Obrigatória de Revisão Humana `[!!!]`
Toda rotina que exigir revisão humana (seja por envolver SO/Hardware/Rede/Docker externos ou por bloqueio de tela na homologação) deve ser imediatamente identificável na árvore de arquivos sem necessidade de abrir cada arquivo:
* **Nome da Pasta:** Prefixo obrigatório `[!!!]`:  
  `auditoria/rotinas/[modulo]/[!!!] [id]-[slug]/`
* **Nome do Arquivo Revisado:** Prefixo obrigatório `[!!!]`:  
  `[!!!] [id]-[slug]-revisado.md`
* **Metadados YAML:** `auditoria_ui.status: requer_revisao_humana`.

### 2.3. Proibição de Comandos Git
* O workspace é 100% local e não possui repositório `.git`.
* É terminantemente proibido executar `git status`, `git add`, `git diff` ou qualquer comando git na automação ou no terminal.

### 2.4. Credenciais Fortificadas no `.env`
* Senhas e strings de conexão com caracteres especiais (`#`, `!`, `$`, `%`) DEVEM estar obrigatoriamente entre aspas duplas no arquivo `.env` (ex.: `ORION_PASS="<SENHA_COM_CARACTERES_ESPECIAIS>"`), prevenindo truncamentos pelo parser do `dotenv`.

---

## 3. Impacto Operacional

1. **Eliminação de Falsos Positivos:** Zero prints carimbados sobre telas erradas; 100% das capturas refletem a interface real do Orion TN.
2. **Triagem Instantânea:** Desenvolvedores e analistas identificam de relance na árvore de pastas quais rotinas possuem a tag `[!!!]` para intervenção no servidor ou laboratório de hardware.
3. **Fidelidade Documental:** O texto dos manuais é confrontado contra os botões e formulários reais (como a constatação de que o cadastro de usuário possui checkboxes de função e não abas de perfil).
