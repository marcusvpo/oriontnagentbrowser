---
name: auditoria-rotinas
description: >-
  Auditoria, validação e enriquecimento visual automatizado das 471 rotinas do Orion TN usando agent-browser (Vercel Labs) e Sharp.
  Use esta skill em qualquer nova conversa para executar uma fase inteira do cronograma, rodar rotinas individuais ou inspecionar o status das auditorias.
---

# Skill: Auditoria de Rotinas Orion TN via Agent-Browser & Sharp

Esta skill orquestra a validação guiada das rotinas da base de conhecimento (`kb/rotinas/`) contra a interface real do sistema no ambiente de homologação, capturando telas, extraindo coordenadas e gerando prints profissionais anotados com Sharp, sem alterar o DOM da aplicação.

---

## 1. Como Usar em Novas Conversas

Em qualquer nova conversa que você iniciar, basta acionar esta skill ou pedir:
* *"Execute a Fase 1 da auditoria"*
* *"Rode a rotina D-1.1"*
* *"Execute a Fase 2 (Módulos Acesso e Config)"*
* *"Verifique o status das rotinas auditadas"*

O agente coordenador já reconhecerá o contexto completo e, **conforme a ADR-008, invocará imediatamente um subagente dedicado (`invoke_subagent`)** para executar a fase em background, sem poluir a conversa principal.

---

### 1.1. Protocolo Mandatório de Subagents (`invoke_subagent`)

Ao receber a solicitação de execução de uma fase:
1. O agente principal **NUNCA** executa comandos interativos na conversa principal.
2. O agente principal chama imediatamente a ferramenta `invoke_subagent`:
   ```json
   {
     "TypeName": "research",
     "Role": "Auditor de Rotinas Orion TN",
     "Prompt": "Execute a Fase X da auditoria de rotinas... Navegue pelas rotinas mapeadas, capture as telas, aplique os destaques Carmesim via Sharp e gere os arquivos *-revisado.md nas pastas correspondentes em auditoria/rotinas/."
   }
   ```
3. O subagente executa a bateria inteira em background de forma autônoma.
4. Ao concluir, o subagente envia uma mensagem consolidada com o resumo dos acertos e métricas, e o coordenador apenas valida e apresenta o resultado limpo ao usuário.

---

## 2. Mapa das Fases de Execução

| Fase | Foco Operacional | Módulos e Quantidade | Comando CLI |
| :--- | :--- | :--- | :--- |
| **Fase 1** | **PoC Ponta a Ponta** | `D-1.1` (Caixa/Acesso) + `R-1.1` (Notas/Protocolo) | `npm run audit -- --phase 1` |
| **Fase 2** | **Cadastrais e Parâmetros** | `acesso` (10) e `config` (40) — 50 rotinas | `npm run audit -- --phase 2` |
| **Fase 3** | **Atos de Balcão e Insumos** | `firmas` (36), `selos` (24), `livros` (20), `certidoes` (15), `centrais` (23) — 108 rotinas | `npm run audit -- --phase 3` |
| **Fase 4** | **Financeiro e Caixa** | `caixa` — 105 rotinas | `npm run audit -- --phase 4` |
| **Fase 5** | **Notas e Minutas** | `notas` — 166 rotinas | `npm run audit -- --phase 5` |
| **Fase 6** | **Consolidação Mestre** | Merge dos textos saneados e sync no OpenAI Vector Store | `npm run audit -- --consolidate` |

---

## 3. Padrão Estrito de Organização de Pastas e Prints

Para garantir organização impecável para o Changelog, cada rotina auditada possui **sua própria pasta isolada** em:
`auditoria/rotinas/[modulo]/[id]-[slug]/`

Dentro dessa pasta ficam **EXCLUSIVAMENTE**:
1. As capturas de tela finais anotadas daquela rotina (`passo-01.png`, `passo-02.png`, etc.).
2. O arquivo de esboço revisado da rotina: `[id]-[slug]-revisado.md`.

### Formato Obrigatório do Arquivo de Esboço (`[id]-[slug]-revisado.md`):
```markdown
---
id: [ID]
titulo: [Título da Rotina]
modulo: [módulo]
auditoria_ui:
  data_execucao: 'YYYY-MM-DD'
  status: validado_com_ajustes # ou validado_inalterado
  versao_homologacao: '6.0.4'
---

#### Descrição:
[Descrição revisada e atualizada com base na interface real]

#### Passo a passo revisado:
1. No menu **Notas**, clique em **Novo Protocolo**.
   [aqui vai a print "passo-01.png"]
2. Na barra superior, clique em **Importar Minuta** e selecione o arquivo Word.
   [aqui vai a print "passo-02.png"]
3. Clique no botão **Extração Reversa de Minuta**.
   [aqui vai a print "passo-03.png"]

* **Dica / Caso Real:** [Observações operacionais relevantes]
```

---

## 4. Ambiente e Autenticação (SPA Hash Routing)

O ambiente de homologação do Orion TN opera no formato Web SPA com hash routing:
* **URL Padrão:** `http://<HOST>:<PORT>/webPortal/#/login`
* **Campos do Formulário:**
  - Usuário (`input[name="usuario"]` ou input de login)
  - Senha (`input[name="senha"]` ou `type="password"`)
  - Botão de Acesso (`button[type="submit"]` ou texto `Entrar`/`Acessar`)
* **Sessão:** Salva e reaproveitada via `auditoria/auth/session-homolog.json`.

---

## 5. Regras Inegociáveis
1. **DOM Imutável & Canvas Puro:** Nunca injetar CSS na aplicação. A marcação com moldura 3px e badge é feita exclusivamente pelo Sharp em pós-processamento, sem moldura de navegador e sem tarjas LGPD (dados de homologação são 100% fictícios).
2. **Padrão Gráfico Siplan (SPCM):** Moldura e badges em Carmesim Siplan (`#ad0505`), rótulos em Bordô (`#5a0000`), números em Oswald e textos em Lato. Elementos com dimensões <= 44px disparam automaticamente o **Zoom Callout de 2.5x** (Lanczos3).
3. **Exportação Dual:** Toda captura gera automaticamente o par `.png` (master sem perdas) e `.webp` (otimizado para web com redução de ~60%).
4. **Preservação de `kb/` (ADR-005):** A pasta `kb/` recebe apenas as correções textuais (sem links de imagens locais), garantindo que nenhum chunk ultrapasse 1.800 tokens.
5. **Resiliência a Falhas:** Se o fluxo travar, o orquestrador gera o print do erro, marca `requer_revisao_humana` e avança para a próxima rotina.
6. **Execução Exclusiva via Subagents (ADR-008):** Toda execução de fase DEVE ser delegada a um subagente autônomo via `invoke_subagent` (usando preferencialmente model `flash` para execução rápida/linear, com fallback para raciocínio profundo apenas em divergências de tela).
7. **Fast DOM Introspection & Zero OCR (ADR-008):** Coordenadas obtidas em 2ms pelo motor Blink nativo com zero tokens. Botões no topo da barra (`ry < 40`) têm badges ancorados abaixo da caixa para nunca obstruir o texto.
8. **Zero Login Overhead & State Persistence (ADR-009):** O login é executado uma única vez e mantido em `session-homolog.json` (`--state`), eliminando logins repetitivos a cada rotina.
9. **Trava de DPR 1.0 Obrigatória (ADR-009):** A automação roda estritamente com `deviceScaleFactor: 1` e viewport 1440x900 para garantir paridade geométrica exata (1:1) entre o DOM e os pixels do screenshot.
10. **Concorrência Segura para o WildFly (ADR-009):** Paralelismo de workers limitado a 2-3 instâncias simultâneas em rotinas de cadastro/gravação de dados, evitando deadlocks ou esgotamento de conexões no servidor do cartório.
11. **Navegação Híbrida SPA (ADR-009):** O agente valida e captura o print dos menus da barra superior via DOM, e em seguida dispara o salto direto por rota hash (`#/rota`) para carregar a tela interna instantaneamente.
12. **Anti-Mock Mandatório & Telas 100% Reais (ADR-010):** Proibição terminante de utilizar screenshots estáticos de cache para simular passos de telas internas. Todo print de passo DEVE ser capturado ao vivo da tela real renderizada no navegador Chromium. Se um botão não existir ou a tela não abrir, não desenhe caixas de destaque em coordenadas arbitrárias/fantasmas: capture a tela do bloqueio e marque a rotina como `requer_revisao_humana`.
13. **Taxonomia `[ATT]`/`[DDD]`/`[XRX]` para Revisão Humana (ADR-021):** O prefixo `[!!!]` foi aposentado. Toda rotina com revisão humana recebe `[ATT]` (`atualizacao_editorial`), `[DDD]` (`dependencia_dados_banco` / ambiente/hardware) ou `[XRX]` (`dependencia_cruzada_rotina`) no nome da pasta e do `-revisado.md`.
14. **Git Seguro & Sync Write-Through com Supabase (ADR-023):** O repositório usa Git + GitHub privado com `.gitignore` blindado — **nunca** commitar `auditoria/auth/`, `.env`, `session-*.json` ou `auditoria/rotinas/**/*.png`. Cada rotina concluída sincroniza automaticamente com o Supabase via `syncSingleRoutineToSupabase` (`--no-sync` apenas para testes offline).
