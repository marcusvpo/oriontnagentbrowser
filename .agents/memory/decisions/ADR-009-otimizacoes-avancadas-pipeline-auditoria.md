# ADR-009: Otimizações Avançadas de Pipeline, Concorrência Controlada e Validação Híbrida

* **Status:** Aprovada e Vigente
* **Data:** 2026-11-11
* **Contexto:** Pipeline de Auditoria Visual em Escala do Orion TN (ADR-007 e ADR-008)

---

## 1. Contexto e Motivação

Após a validação da prova de conceito da Fase 1 e a definição das diretrizes de Fast DOM e Subagents na ADR-008, foi realizada uma análise aprofundada de gargalos operacionais para viabilizar a auditoria em lote de 50 a 108 rotinas por fase. 

Identificaram-se cinco fatores críticos de latência, estabilidade e fidelidade documental:
1. **Sobrecarga de Raciocínio (Thinking Overhead):** Uso de raciocínio profundo (High) em passos determinísticos e lineares.
2. **Custo de Re-autenticação:** Tempo perdido refazendo o handshake de login no WildFly SSO a cada rotina.
3. **Gargalo Monothread vs. Risco de Concorrência Excessiva no Servidor:** Necessidade de paralelismo, porém com limite estrito para não travar o banco de dados e o pool de conexões do servidor WildFly do cartório.
4. **Acoplamento Síncrono de I/O e Risco de Escala de DPR:** Bloqueio do navegador enquanto o Sharp processa imagens, somado ao risco de distorção de coordenadas se o `deviceScaleFactor` (DPR) não estiver fixado em 1.
5. **Falsos Positivos do Salto Direto por Hash SPA:** Risco de pular direto para uma tela sem atestar se o caminho de menus descrito no manual do cartório realmente existe na barra de navegação.

---

## 2. Decisões Arquiteturais Fixadas

### 2.1. Raciocínio Dinâmico do Modelo (Fast Linear vs. Fallback High)
* **Execução Linear Determinística:** O subagente auditor executa o roteiro pré-definido em modo rápido (modelo `flash` ou esforço de raciocínio Low/Medium). O runner em Node.js executa a verificação de seletores e coordenadas de forma puramente algorítmica.
* **Fallback High Reasoning:** Apenas quando um elemento esperado não for localizado na tela (discrepância na interface), o subagente ativa o raciocínio aprofundado para inferir sinônimos, inspecionar botões vizinhos ou diagnosticar mudanças de layout.

### 2.2. Reutilização de Sessão e Zero Login Overhead (`state load`)
* O handshake de autenticação no WildFly SSO é executado **uma única vez** no início da bateria.
* O estado de autenticação (cookies `JSESSIONID`, tokens de sessão e localStorage) é armazenado em `auditoria/auth/session-homolog.json` via `agent-browser state save`.
* Todas as rotinas e workers subsequentes iniciam diretamente carregando a sessão (`--state ./auditoria/auth/session-homolog.json`), acessando imediatamente o portal autenticado sem passar pela tela de login.

### 2.3. Paralelismo Controlado de Workers (Concorrência Segura)
* O processamento em lote é distribuído entre workers paralelos isolados por sessão (`--session worker-1`, `--session worker-2`, etc.).
* **Controle Adaptativo de Concorrência:**
  - **Rotinas de Consulta / Visualização / Relatórios:** Concorrência de até **4 a 6 workers** paralelos.
  - **Rotinas de Cadastro / Gravação de Atos (Firmas, Escrituras, Caixa):** Concorrência estritamente limitada a **2 a 3 workers** para prevenir deadlocks no banco de dados e evitar o esgotamento do pool de conexões do WildFly no ambiente de homologação.

### 2.4. Desacoplamento Assíncrono do Sharp e Trava Obrigatória de DPR 1.0
* **Trava de DPR (`--device-scale-factor 1`):** É terminantemente obrigatório fixar o `deviceScaleFactor` em 1.0 e viewport em 1440x900. Isso assegura paridade de 1:1 entre as coordenadas retornadas pelo `getBoundingClientRect()` do DOM e os pixels do screenshot capturado pelo Sharp, eliminando qualquer distorção de escala.
* **Pipeline Gráfico Assíncrono:** O navegador não aguarda o processamento gráfico do Sharp para navegar. Ele captura a imagem bruta em buffer, extrai as caixas delimitadoras e já dispara a navegação para o próximo passo. A composição dos overlays SVG e a conversão dual (.png / .webp) são enfileiradas em background.

### 2.5. Navegação Híbrida em Rotas Hash (Validação de Menus + Salto SPA)
Para preservar a fidelidade documental sem perder velocidade:
1. **Passo 1 (Validação de Menu):** Na tela inicial/dashboard, o agente valida no DOM a existência dos menus e submenus descritos no manual (ex.: menu **Firmas** > **Reconhecimento de firmas**), capturando o print com o devido destaque Carmesim.
2. **Passo 2 (Salto Direto SPA):** Confirmada a existência do menu, o agente navega diretamente via fragmento hash (ex.: `#/pedidoFirmas/cadastrar`), carregando a tela de trabalho em 300ms sem perder tempo com animações lentas de hover ou cliques em cascata.

---

## 3. Matriz Comparativa de Resultados

| Métrica | Abordagem Anterior | Nova Arquitetura Otimizada (ADR-009) |
| :--- | :--- | :--- |
| **Tempo por Rotina** | ~3 a 5 segundos (sequencial) | **~1 a 1,5 segundos** (com workers paralelos) |
| **Tempo para 50 Rotinas** | ~4 a 5 minutos | **~1 a 1,5 minutos** |
| **Consumo de Sessão WildFly** | 50 logins repetitivos | **1 único login** (reaproveitamento total de sessão) |
| **Risco de Desalinhamento DPR** | Risco em telas 2K/4K/Retina | **Zero risco** (DPR travado em 1.0) |
| **Fidelidade Documental de Menus** | Menus não eram validados no salto | **100% auditados** via abordagem híbrida |
| **Uso de Tokens no Roteiro** | Alto (High Thinking em passos óbvios) | **Mínimo** (Fast/Low linear + High apenas no fallback) |
