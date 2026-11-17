# REGRAS DO WORKSPACE: SISTEMA ORION TN & BASE DE CONHECIMENTO

> **MEMÓRIA VIVA & CONHECIMENTO CONTÍNUO (VERSÃO 1.3)**  
> **Status Vigente:** BASE V3.2.0 + PIPELINE DE AUDITORIA V2.5 (Taxonomia `[ATT]`/`[CCC]`/`[DDD]`/`[XRX]` com Multi-Tags + Passos Externos + Sessão Ativa + Guarda de Menu + GitHub Seguro + Write-Through + Supabase Realtime — ADR-024 + Ambiente de Produtos, Preflight de VPN, Multi-Aba e Reauditoria Contextual — ADR-025 + Revisões Humanas, Zoom 80%, Acesso Pleno e Firmas Interativo — ADR-026 + Grafo Semântico UI, Máquina de Estado Universal com DOM Diffing e RAG Soberano de Revisões Humanas — ADR-027 + Consultor Propositivo de Tela `[ATT]` e Desempate de Menu por Profundidade — ADR-028 + Mineração de Clusters, Equivalências de Menu, Pré-Filtro de Grade Vazia e Console Fase 2 × Fase 3 — ADR-029 + Deep DOM Shadow/Iframes Pós-Scroll, Poda Camada 2B, Bindings Angular, Monitor XHR/Fetch e Crawler de Rotas — ADR-030 + Pipeline Visual Híbrido Set-of-Mark SoM em Memória + Visual Grounding DOM via `agy` na Camada 2C — ADR-031)  
> **Arquivo Mestre Consolidado:** `doc conhecimento final/OrionTN pos.md`  
> **Base de Produção RAG (OpenAI):** `kb/` (471 rotinas atômicas + `_indice.md` + `_glossario.md` + contextos modulares)  
> **Camada de Memória:** `.agents/memory/` (Padrões em `standards/`, Decisões em `decisions/`)

---

## 1. Missão do Projeto e Escopo do Agente

Este workspace gerencia a **Base de Conhecimento Mestre** e as **Diretrizes de Resposta do Assistente Virtual do Orion TN** (ecossistema de software notarial e registral desenvolvido pela **Siplan**).

Toda intervenção do agente (em qualquer conversa atual ou futura) deve respeitar rigorosamente os padrões técnicos, o schema de dados e a arquitetura de respostas consolidados neste repositório.

---

## 2. Mandamentos Inegociáveis (Golden Rules)

1. **ARQUIVO MESTRE CENTRAL:** O arquivo oficial de produção é [`doc conhecimento final/OrionTN pos.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/doc%20conhecimento%20final/OrionTN%20pos.md). Ele possui a base homologada consolidada com exatamente **471 rotinas** dividida em 5 seções principais:
   - Seção R: 43 rotinas (Rotinas gerais)
   - Seção V: 110 rotinas (Videoaulas)
   - Seção M: 100 rotinas (Manuais)
   - Seção D: 120 rotinas (Demonstrações/Caixa)
   - Seção 5: 98 rotinas (Casos Reais de Suporte e Troubleshooting 0800 com prefixo `C-` e siglas temáticas conforme ADR-004)
   Qualquer alteração deve preservar a integridade total de 100% dos blocos.
2. **PADRONIZAÇÃO DEFINITIVA DE VÍDEO (BUNNY.NET):**
   - **É TERMINANTEMENTE PROIBIDO UTILIZAR O CAMPO `video_id`** (descontinuado e removido na ADR-003 por ser duplicata redundante).
   - O identificador único do vídeo é **exclusivamente `bunny_video_id`**.
   - Biblioteca padrão da Bunny: `bunny_library_id: '467408'`.
3. **METADADOS OBRIGATÓRIOS DO SCHEMA V3.0:**
   - Toda rotina possui obrigatoriamente o campo `sintomas_comuns:` (mínimo de 3 itens) para indexação de dores, erros e linguagem natural do balcão.
   - O corpo da rotina é estritamente dividido em `#### Descrição:` e `#### Passo a passo:` com listas numeradas.
   - Todos os elementos visuais de interface (menus, telas, botões, ícones, abas, campos) **DEVEM estar estritamente em negrito** (ex.: menu **Notas**, aba **Minuta**, botão **Salvar**).
4. **DIRETRIZES DE RESPOSTA DO ASSISTENTE:**
   - **NUNCA VAZAR CÓDIGOS OU IDs DE ROTINA:** Jamais diga ao usuário *"De acordo com a rotina R-1.3..."* ou *"Consulte o documento V-7.2.1..."*. Esses identificadores são estritamente para busca interna.
   - **PROIBIDO TOM DE URA OU BOT ROBÓTICO:** Sem saudações artificiais de máquina. Adote a persona de um **escrevente sênior e consultor especialista**, empático, direto e humano.
   - **SEM ALUCINAÇÕES DE RECURSOS:** Nunca invente recursos inexistentes. Se a dúvida extrapolar a base ou o sistema não suportar, explique os limites e direcione ao suporte oficial da Siplan.
   - **TRIAGEM TRANSPARENTE DE SUPORTE N2 / BANCO DE DADOS:** Diante de erros que demandam intervenção técnica interna da Siplan, forneça a causa raiz, os testes possíveis na interface e o modelo pronto de abertura de ticket no 0800 (conforme ADR-004).
   - **MODELO DE PIRÂMIDE INVERTIDA:**
     1. *Solução Direta:* Resposta imediata em 1 ou 2 períodos.
     2. *Passo a Passo Guiado:* Caminho numerado com menus e botões em **negrito**.
     3. *Tutorial em Vídeo:* Link markdown com timestamp (apenas se `tem_video: true`).
     4. *Dica Prática / Alerta:* Recomendações de Corregedoria, ITCMD ou boas práticas.
5. **ARQUITETURA DUAL-LAYER RAG & VECTOR STORE (ADR-005):**
   - O arquivo mestre [`doc conhecimento final/OrionTN pos.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/doc%20conhecimento%20final/OrionTN%20pos.md) é a visão consolidada para auditoria e leitura contínua.
   - Para o **OpenAI Platform Responses API**, a base de produção é obrigatoriamente a árvore granular em [`kb/`](file:///d:/marcu/Videos/OrionTN/OrionTN/kb/), gerada automaticamente via `scripts/build_kb.py`.
   - **Calibração Estática de Chunking:** Todo upload no Vector Store deve utilizar `max_chunk_size_tokens: 1800` e `chunk_overlap_tokens: 0`, assegurando que **1 rotina = 1 arquivo = 1 chunk atômico**.
   - **Sincronização Incremental:** Deploy via `scripts/sync_openai_vector_store.py` com hashes SHA-256 e injeção de metadados (`id`, `modulo`, `secao`, `tem_video`, `categoria`).
6. **CODIFICAÇÃO E FORMATAÇÃO DE ARQUIVOS:**
   - Sempre utilize codificação **UTF-8** e quebras de linha padrão Windows (**CRLF** `\r\n`) ao salvar ou editar o arquivo mestre.
7. **PIPELINE DE AUDITORIA VISUAL & AGENT-BROWSER (ADR-007):**
   - A auditoria de telas e geração de prints anotados utiliza `vercel-labs/agent-browser` acoplado ao motor de composição gráfica vetorial `Sharp` (Node.js).
   - A execução respeita a **Arquitetura Híbrida**: a base `kb/` do OpenAI Vector Store recebe apenas o texto auditado e saneado (mantendo a calibração de 1800 tokens da ADR-005).
   - **Organização Estrita por Rotina:** Toda rotina auditada possui sua pasta isolada em `auditoria/rotinas/[modulo]/[id]-[slug]/` contendo **SOMENTE** as prints anotadas daquela rotina (`passo-01.png`, `passo-02.png`, etc.) e o arquivo de esboço `[id]-[slug]-revisado.md` com marcações explícitas de onde inserir cada print (ex: `Passo 1: ... [aqui vai a print "passo-01.png"]`).
   - **Padrão Gráfico Siplan (SPCM):** Molduras e badges na cor Carmesim Siplan (`#ad0505`), rótulos em Bordô (`#5a0000`), tipografia Oswald/Lato, Zoom Callout (2.5x Lanczos3) para micro-ícones (<=44px), canvas puro da aplicação (sem moldura de navegador e sem tarjas LGPD, visto que o banco de homologação é 100% fictício) e exportação dual (.png + .webp).
   - O orquestrador opera com tolerância a falhas (skip com print de bloqueio e status `atualizacao_editorial`/`dependencia_dados_banco`/`dependencia_cruzada_rotina`), operando em modo `--headed` para PoCs e `--headless` para grandes lotes.
   - O formato de URL do ERP homologação segue o padrão SPA com hash routing: `http://<IP>:<PORT>/webPortal/#/login`.
   - Para executar qualquer fase da auditoria em novas conversas, basta acionar a skill `auditoria-rotinas` informando o número da fase (Fases 1 a 6).
8. **EXECUÇÃO MANDATÓRIA VIA SUBAGENTS (ADR-008):**
   - O agente coordenador na conversa principal **NUNCA executa batches de auditoria diretamente** no chat interativo (evita estourar contexto e latência).
   - Toda execução de fase da auditoria (Fases 1 a 6 ou lotes de rotinas) **DEVE ser delegada a um subagent** via `invoke_subagent` com Role `Auditor de Rotinas Orion TN`.
   - O subagent roda o runner de forma autônoma e em background, gera as pastas, prints anotadas e arquivos `*-revisado.md`, e retorna o resumo executivo consolidado para o coordenador.
9. **FAST DOM INTROSPECTION & NAVEGAÇÃO SPA HASH (ADR-008):**
   - **É TERMINANTEMENTE PROIBIDO UTILIZAR OCR OU MODELOS DE VISÃO PARA LOCALIZAR BOTÕES:** A extração de coordenadas é feita em 2ms diretamente pelo motor Blink (``getBoundingClientRect()`` ou `agent-browser get box`), consumindo 0 tokens e garantindo 100% de precisão subpixel.
   - O agente utiliza a navegação direta por rotas hash do Angular SPA (ex.: `#/pedidoFirmas/cadastrar`), saltando passos intermediários lentos de menus.
   - Elementos em barras superiores (`ry < 40`) recebem badge e rótulo obrigatoriamente **ancorados abaixo da caixa demarcatória**, preservando a visibilidade total do texto do botão.
10. **OTIMIZAÇÕES AVANÇADAS DE PIPELINE, CONCORRÊNCIA E DPR (ADR-009):**
    - **Zero Login Overhead:** A sessão WildFly é autenticada uma única vez e reaproveitada em disco (`state load ./auditoria/auth/session-homolog.json`).
    - **Trava de DPR 1.0 Obrigatória:** Viewport sempre em 1440x900 com `--device-scale-factor 1`, garantindo paridade 1:1 absoluta entre coordenadas do DOM e pixels do print.
    - **Concorrência Controlada:** Limite adaptativo de workers paralelos: 2 a 3 para rotinas de gravação/cadastro (protegendo o WildFly/banco de dados) e até 4 para rotinas de leitura.
    - **Navegação Híbrida SPA:** O agente valida e fotografa menus na barra de navegação via DOM, e em seguida dispara o salto direto pela rota hash para carregar a tela interna instantaneamente.
    - **Raciocínio Dinâmico:** Subagente roda em execução rápida/linear para tarefas determinísticas, reservando raciocínio profundo (High) apenas como fallback para resolução de divergências de interface.
11. **ANTI-MOCK MANDATÓRIO & TELAS REAIS AO VIVO (ADR-010):**
    - **É TERMINANTEMENTE PROIBIDO CARIMBAR PRINTS SOBRE TELAS ESTÁTICAS DE CACHE OU CANVAS DE HOME TRAVADA:** Todo screenshot de passo deve ser capturado ao vivo da tela real renderizada no navegador Chromium após a navegação efetiva.
    - Se uma tela não abrir ou o botão não existir no DOM da tela atual, o orquestrador captura o frame real do bloqueio/erro, **NÃO desenha caixas de destaque fantasmas**, e marca a rotina para revisão humana.
12. **SINALIZAÇÃO VISUAL `[ATT]`/`[DDD]`/`[XRX]` (ADR-021) & VERSIONAMENTO GIT SEGURO (ADR-023):**
    - Toda rotina que demandar revisão humana DEVE ter o nome de sua pasta e de seu arquivo de esboço obrigatoriamente prefixados com a tag da causa (`[!!!]` está aposentado): `[ATT]` (`atualizacao_editorial`), `[DDD]` (`dependencia_dados_banco`, inclui hardware/Docker/ambiente) ou `[XRX]` (`dependencia_cruzada_rotina`):
      - Pasta: `auditoria/rotinas/[modulo]/[TAG] [id]-[slug]/`
      - Arquivo: `[TAG] [id]-[slug]-revisado.md`
    - **GIT/GITHUB COM BLINDAGEM ESTRITA DE SEGURANÇA (Revoga a proibição anterior da ADR-010):** O repositório Git é conectado ao remoto privado no GitHub (`https://github.com/marcusvpo/oriontnagentbrowser.git`) com `.gitignore` blindado na raiz. **ALERTA MÁXIMO:** É terminantemente proibido commitar `auditoria/auth/`, `session-*.json`, `.env`, `.env.*` (exceto `.env.example`), `auditoria/backups/`, `auditoria/cache/` ou `auditoria/rotinas/**/*.png`, bem como hardcoding de senhas, cookies ou tokens em código ou documentação. Sempre confira `git status` antes de `git commit`/`git push`.
13. **GEOMETRIA DETERMINÍSTICA DO DOM, SOLVER ANTI-OCLUSÃO & CLAMPING SHARP (ADR-011 / ADR-012):**
    - **Fonte Única de Verdade (DOM Real):** As coordenadas provêm exclusivamente de `getBoundingClientRect()` (com compensação de `iframe`, `scrollIntoViewIfNeeded`, reflow estável e escala física `imgWidth / viewport.width` para independência de DPR). Heurísticas de leitura de pixels RGB (`element-snapper.ts`) e tabelas estáticas (`COORDS`) estão aposentadas e vedadas.
    - **Clamping Matemático Obrigatório:** Nenhuma caixa (`targetBox`), badge (`badgeBox`) ou rótulo (`labelBox`) pode exceder as bordas reais do buffer (`metadata.width` $\times$ `metadata.height`).
    - **Solver Multi-Quadrante Anti-Oclusão (`dom-geometry.ts`):** Avalia os 4 quadrantes cardinais (`top`, `bottom`, `right`, `left`) com base no contexto semântico do DOM (`isTopNav` $\rightarrow$ `bottom`, `isVerticalSidebar` $\rightarrow$ `right`, padrão $\rightarrow$ `top`), garantindo matematicamente **Zero Auto-Oclusão** ($\text{Interseção}(\text{Anotação}, \text{Elemento}) = 0\text{ px}^2$) e zero colisão entre badge e rótulo.
    - **I/O Assíncrono Desacoplado:** O motor Sharp decodifica o buffer uma única vez em memória e exporta `.png` e `.webp` em paralelo (`Promise.all` com `.clone()`), sem bloqueio da Event Loop.
    - **Escopo de Modal Ativo (`modal-scope.ts`):** seletor único para o modal Bootstrap (`.modal.in`) e o modal leve do Orion TN (`orion-lightweight-modal`). Com modal visível, alvos são resolvidos dentro dele e `document.elementFromPoint` rejeita nó por trás do backdrop; passo de vários alvos só clica o nó cujo texto é um dos alvos citados.
    - **Auditoria Geométrica Automatizada (`verify-all-phase2-boxes.ts`):** Valida os 8 invariantes matemáticos e estruturais em 100% das prints antes da homologação (5 geométricos/estruturais + Multi-Demarcação da ADR-017 + Zona Semântica + União Geométrica, conforme ADR-015).
14. **WORKER POOL PARALELO, ISOLAMENTO DE SESSÃO & SMART-LOCATOR AUTO-CURA (ADR-013):**
    - **Isolamento de Workers (`worker-pool.ts`):** Lotes executam em pool concorrente com sessões isoladas (`--session worker-${id}`) e snapshots de autenticação dedicados (`session-worker-${id}.json`) sincronizados via mutex (`authMutex`), eliminando *race conditions* e *file locks*.
    - **Particionamento Dual-Lane (`READ_ONLY` vs. `MUTATION`):** Rotinas de consulta (`read_only`) rodam em paralelismo máximo (4 a 6 workers), enquanto rotinas de gravação/alteração (`mutation`) passam por semáforo restrito (`mutationSemaphore`) para proteger o WildFly/PostgreSQL contra *deadlocks*.
    - **Auto-Cura em Camadas (`smart-locator.ts`):** Se o seletor exato falhar na Camada 1 (`dom-geometry.ts`), aciona a Camada 2 sobre a Árvore de Acessibilidade compacta (`snapshot -i` + dicionário de sinônimos Orion TN + Sørensen–Dice + fallback LLM single-shot), documentando automaticamente a divergência no YAML (`auditoria_ui.auto_cura.divergencias_detectadas`) e no corpo do `*-revisado.md` sem interromper a rotina.
15. **ZERO COORDENADAS ESTÁTICAS & STREAMING STDIN NO WINDOWS (ADR-014):**
    - **Proibição Total de Literais de BoundingBox:** É expressamente vedada a presença de qualquer objeto com coordenadas fixas (`{ x, y, width, height }`), tabelas `NAVBAR` ou imagens de fundo `baseImage` nos manifestos da auditoria. Toda geometria provém de `getBoundingClientRect()` ao vivo no Chromium.
    - **Sincronização Dinâmica de Abas SPA:** Em rotinas multi-abas (ex.: `Configurações` ou `Protocolo`), o executor clica de fato na aba no navegador e aguarda a visibilidade do contêiner específico antes da medição e captura do passo seguinte.
    - **Streaming STDIN no Windows (`browser.ts`):** A execução de scripts JavaScript no `agent-browser` é realizada via pipe em `stdin` (`agent-browser eval --stdin`), eliminando em definitivo o erro de limite de linha de comando (`cmd.exe`).
    - **Telemetria Viva do DOM:** Cada execução persiste as coordenadas reais extraídas em `auditoria/cache/phase2-live-telemetry.json`, auditadas pelo `verify-all-phase2-boxes.ts` contra os 8 invariantes matemáticos.
16. **FILTRO DE ZONA SEMÂNTICA & UNIÃO GEOMÉTRICA DE MÚLTIPLOS ALVOS (ADR-015):**
    - **Anti-Sidebar em Passos de Formulário:** Passos de parametrização/preenchimento (*"Defina"*, *"Preencha"*, *"Configure"*, *"Informe"*, *"Marque"*... ou ação `fill`/`search`) são medidos em zona `content`: `aside`, `nav`, `.sidebar`, `.nav-stacked`, `[role="tablist"]` e qualquer invólucro que contenha a navegação lateral ficam fora da busca, e o escopo é o contêiner principal de conteúdo resolvido ao vivo (`dom-geometry.ts`). Sem alvo no conteúdo, o passo **nunca** recai sobre o menu lateral: segue para auto-cura na mesma zona ou bloqueio `[ATT]`/`[DDD]`/`[XRX]`.
    - **Política por Passo (`inferStepZone` em `smart-locator.ts`):** menção a menu/aba/barra/painel lateral $\rightarrow$ `any`; verbos de parametrização $\rightarrow$ `content` (estrita); verbos ambíguos (*"Selecione"*, *"Escolha"*) $\rightarrow$ `content-preferred`. O manifesto pode fixar `zone` explicitamente.
    - **Group Bounding Box:** Quando o passo referencia vários parâmetros do mesmo bloco, o manifesto declara `groupTargets`; cada nó é medido ao vivo, expandido ao seu bloco de campo (rótulo + controle) e a moldura final é a união exata (`minX`, `minY`, `maxX`, `maxY`) dos `DOMRect`s. É vedado usar contêiner genérico (ex.: `form .col-md-24`) como alvo de passo de parâmetros.
    - **Invariantes 6 e 7:** O validador reprova qualquer passo de zona `content` com interseção > 0 px² sobre a navegação lateral e qualquer grupo cuja caixa difira da união dos seus membros.
    - **A ação segue a medição:** o clique/preenchimento do `executor.ts` recai sobre o mesmo nó validado na zona (carimbo `actionTarget` gravado pelo script de medição e conferido por `probeActionNode()`). É vedado refazer a busca por nome para acionar um passo medido em zona `content`; sem carimbo válido, a ação é omitida.
17. **ROTA DE MENU, PASSOS SEM ALVO & CARGA `MUTATION` NO EXECUTOR DO KB (ADR-016):**
    - **Navegação Encadeada com Auto-Cura de Rota (`menu-path.ts`):** Um caminho de menu (`A > B > C`) é percorrido segmento a segmento na árvore de navegação real (clique no topo, hover nos submenus), nunca buscado como texto único. Se a rota documentada divergir, a folha é localizada na árvore, a rotina fica `validado_com_ajustes` e a divergência é registrada no `-revisado.md` (`resolutionLayer: menu_path_resolution`). Folha inexistente ou folhas homônimas empatadas bloqueiam com `[ATT]`/`[DDD]`/`[XRX]`.
    - **Screenshot Limpo em Passos Sem Alvo:** Passo descritivo sem negrito não gera bloqueio nem caixa fictícia: o executor verifica que a tela carregou sem erros (`probeScreenLoaded`) e grava a print sem moldura, badge ou rótulo.
    - **Listas de Opções e Controles Desabilitados:** Passo que só lista opções nos sub-itens é buscado em zona `content`, sem Auto-Cura, e nenhuma opção é acionada; controle desabilitado na tela também não é acionado.
    - **Classificação `mutation` por Comando (`worker-pool.ts`):** Qualquer passo com alvo ou ação de **Salvar**, **Gravar**, **Confirmar**, **Concluir**, **Excluir** ou **Inativar** torna a rotina `mutation`, independentemente do título. Exceção: palavras-chave presentes só em passos de lista de opções (nunca acionados pelo executor) não contam, mantendo rotinas de consulta na fila `read_only`.
    - **Divergência de Rótulos em Passos de Múltiplos Alvos:** Rótulo curado pelo SmartLocator é registrado no `-revisado.md`; o passo nunca passa como `ok` silencioso. Rótulo **não localizado** bloqueia a rotina com `[ATT]`/`[DDD]`/`[XRX]` (regra 18, que substitui o `validado_com_ajustes` anterior).
18. **CASCATA, MULTI-DEMARCAÇÃO, RBAC GATE & EVIDÊNCIA ESTRITA (ADR-017):**
    - **Cascata com Ponteiro Real (`menu-path.ts`):** Submenu em cascata abre por CSS `:hover`; o executor o percorre com `mouse move` por dentro da geometria `li ∪ ul`, estaciona o ponteiro na folha e confere a cadeia antes e depois da captura.
    - **Multi-Demarcação Numerada (`annotator.ts`, `computeMultiAnnotationLayout`):** Caminho de menu e passo com vários alvos em negrito visíveis na mesma tela geram **uma** print com caixas numeradas (1, 2, 3...). Nenhuma anotação cobre o núcleo de nenhum alvo nem outra anotação (0 px²). É vedado gerar uma print por segmento de menu.
    - **RBAC Gate (`rbac.ts`):** Antes do passo 1, o perfil exigido pelo manual é comparado com a identidade real da sessão. Sem comprovação, a rotina é bloqueada com `[ATT]`/`[DDD]`/`[XRX]` por *Insuficiência de Privilégio na Conta de Homologação* e nenhum passo é auditado. Elemento marcado pela aplicação como bloqueado/oculto para o perfil é bloqueio por privilégio, nunca "inexistente".
    - **Regra da Evidência Estrita (`evidence.ts`, `report.ts`):** O texto do manual só muda por substituição pontual de um negrito, com elemento real medido ao vivo e demarcado. Alvo citado e não comprovado: texto original intacto e rotina `[ATT]`/`[DDD]`/`[XRX]`. Rotina `[ATT]`/`[DDD]`/`[XRX]` sai com o texto 100% original.
    - **Vedado Texto Escrito à Mão:** Nenhum manifesto, tabela ou código pode fornecer texto de passo "revisado". `revisadoPassos`/`revisadoDesc` do manifesto da Fase 2 estão `@deprecated` e não são emitidos; o manifesto só prova presença dos negritos do manual.
19. **CONTA DE HOMOLOGAÇÃO PLENA, EXPLORAÇÃO INVESTIGATIVA PRÉ-BLOQUEIO & ÁRVORE CANÔNICA (ORION TN 6.0):**
    - **Acesso 100% Pleno (`4tabeliao.scs`):** Validado com Produtos que `4tabeliao.scs` (cargo `TABELIAO`, perfil **`Perfil de acesso - Gerência webFirmas`**) possui **100% das permissões `[x]`** em todo o Orion TN 6.0 (cf. `auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md`), incluindo `Configuraçoes > Perfis e permissões de acesso`, `Usuários` e `Parametrizações`.
    - **Defasagem de Manual vs. Privilégio:** Nunca classificar a ausência de botões administrativos (como *Redefinir Senha Manualmente* ou *Resetar 2FA* em `C-ACESSO-03`) como *"Insuficiência de Privilégio na Conta de Homologação"*. Sob esse perfil pleno (e sem marcação `.ngx-orion-hide`/`.functionality.disabled`), trata-se de **defasagem real do manual** (no Orion TN 6.0, senha e 2FA ficam no menu superior direito `"Olá, [username]"`).
    - **Exploração Investigativa Antes do Bloqueio:** a tag de revisão (`[ATT]`/`[DDD]`/`[XRX]`) é o **último recurso**, nunca a primeira reação. Antes de bloquear um campo/botão ausente, o auditor deve investigar gatilhos reveladores seguros na tela atual (`nav-tabs`, accordions recolhidos, botões *Alterar/Editar/Adicionar/Avançado* ou checkboxes condicionais). Se a micro-ação revelar o elemento: fotografar (`passo-NN-b`), marcar `validado_com_ajustes` e documentar o sub-passo real. Só bloquear com `[ATT]`/`[DDD]`/`[XRX]` após esgotar as possibilidades da tela.
    - **Execução ADR-019 (RBAC, Exploração e Trava de Mutação):** o RBAC Gate reconhece `Gerência webFirmas`/`TABELIAO` como perfil pleno (`ORION_SESSION_GRANTED_ROLES` acrescenta entradas) e só bloqueia antes do passo 1 sessão **comprovadamente restrita**; identidade ilegível é inconclusiva e não bloqueia. Bloqueio por privilégio exige marca real no DOM (`.functionality.disabled`, `.functionality.ngx-orion-hide` ou `title` *"bloqueada para o seu perfil"*) com **igualdade exata** de texto; `.ngx-orion-hide` sozinha é a ocultação genérica da aplicação e não prova privilégio. A Exploração Investigativa (`reveal-explorer.ts`) testa abas, painéis recolhidos, botões de abertura e seletores com afinidade, nunca aciona gravação/exclusão, restaura e confere o estado, e registra o sub-passo em `passo-NN-b`; esgotada, o bloqueio é `Defasagem Editorial do Manual` (sessão plena) ou causa em aberto. `--dry-run-mutations` demarca e fotografa **Salvar/Gravar/Confirmar/Concluir/Excluir/Inativar** sem clicar (`mutation-guard.ts`).
    - **Ações icônicas, ajuda "i" e confronto semântico (ADR-020):** botões de ícone em grades são resolvidos na 1ª linha (`icon-action-resolver.ts`; **Visualizar↔Consultar**, **Editar↔Alterar**, **Remover↔Excluir**), numerados na mesma print e **nunca clicados** em lista de opções (ADR-016); ícones `i` são lidos por `hover` (`help-tooltips.ts`, `> [!TIP]`); `screen-snapshot.ts` confronta Descrição/passos com a tela e só registra `Divergência Conceitual/Editorial (Evidência de Tela)` com duas evidências (manual + DOM), sem reescrever a Descrição. Ver ADR-020.
    - **Árvore Canônica de Módulos:** Usar `auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md` (consolidado em `.agents/memory/standards/glossario_siplan.md`) como referência oficial de módulos, caminhos e grafias reais da UI (ex.: `"Configuraçoes"`).
20. **CONEXÃO DIRETA SUPABASE VIA POOLER POSTGRESQL, WRITE-THROUGH & REALTIME (ADR-018 / ADR-023):**
    - **PROIBIDO USAR O SUPABASE MCP NESTE PROJETO:** O MCP `supabase` global está vinculado a outra organização e não possui acesso ao projeto `zgnbdfibnjekmmzsfzzm` (*Orion Agents*). Nunca tentar executar `apply_migration`, `execute_sql`, `list_tables` ou qualquer ferramenta do MCP `supabase` para este projeto.
    - **CAMINHO OFICIAL DE BANCO E STORAGE:** Toda operação DDL/SQL deve ser feita via Pooler PostgreSQL IPv4 (`createPgClient()` / `SUPABASE_DB_URL` em `auditoria/.env` e `auditoria/src/supabase.ts`), e toda operação DML/Storage via `@supabase/supabase-js` (`getSupabaseAdmin()`).
    - **WRITE-THROUGH AUTOMÁTICO & SUPABASE REALTIME (ADR-023):** Não é mais necessário rodar `supabase:sync` manualmente após auditorias ou revisões. `executor.ts`, `hardware-pretriage.ts` e os endpoints de mutação do `server.ts` (via `governance-disk.ts` em dupla via com `*-revisado.md`) executam `syncSingleRoutineToSupabase(id)` automaticamente ao concluir cada rotina (flag `--no-sync` no `cli.ts` apenas para testes offline). As tabelas públicas integram a publication `supabase_realtime` (`004_supabase_realtime.sql`) e o Orion Audit Console atualiza ao vivo via `postgres_changes`. Migrações ficam em `auditoria/supabase/migrations/` (`npm --prefix auditoria run supabase:migrate`) e o sync completo `npm --prefix auditoria run supabase:sync` fica reservado para carga inicial ou recuperação em massa.

21. **TAXONOMIA DE REVISÃO HUMANA `[ATT]`/`[DDD]`/`[XRX]`, GRADE VAZIA, AUTO-SEED MOCK E ALVOS IMPLÍCITOS (ADR-021):**
    - **`[!!!]` está aposentado.** Não existe mais pasta, arquivo, status ou código com esse prefixo. Rotina que exige revisão humana recebe exatamente uma tag, no nome da pasta e do arquivo (`[ATT] M-xx-slug/[ATT] M-xx-slug-revisado.md`) e no `auditoria_ui.status`: **`[ATT]` `atualizacao_editorial`** (manual desatualizado: tela/caminho/botão/campo inexistente, com rotas e `reveal-explorer.ts` esgotados), **`[DDD]` `dependencia_dados_banco`** (faltam registros no banco de homologação ou o ambiente/hardware não permite validar; exige Produtos) e **`[XRX]` `dependencia_cruzada_rotina`** (depende de outra rotina que cria o registro/estado; o relatório lista os pré-requisitos).
    - **Árvore de decisão única (`review-classifier.ts`, `classifyBlock()`):** falha técnica → sem tag (rotina fica `nao_auditada`, falha em `kb-batch-summary.json`); RBAC → `[ATT]`; tela inoperante/hardware/ambiente → `[DDD]`; grade vazia → `[XRX]` se o grafo do KB achar rotina provedora, senão `[DDD]`; caminho de menu ausente → `[ATT]`; objeto criado fora da tela (protocolo, orçamento, ato...) com provedor → `[XRX]`; alvo ausente com exploração esgotada → `[ATT]`. **`[DDD]` é o último recurso:** só depois de descartar Adicionar/seed e provedor `[XRX]`.
    - **Estado vazio (`empty-state.ts`):** grade com cabeçalhos e 0 linhas, toast/alerta transitório (`MutationObserver` instalado antes de cada passo; texto literal, sem o "×" de fechar) e controles inativos por falta de dado são lidos ao vivo via STDIN e gravados como evidência no `-revisado.md`.
    - **Auto-seed (`auto-seed.ts`):** grade vazia **e** botão Adicionar/Novo/Cadastrar ativo na mesma tela **e** rotina que consulta/altera linhas → o agente cria **um** registro mock de pré-requisito (campos válidos por tipo, texto `AUDIT-MOCK`), clica Salvar/Gravar/Concluir **mesmo com `--dry-run-mutations`** e volta à grade. Grade já populada: nada é gravado. Nunca aciona Excluir/Inativar; serializado entre workers; `--no-auto-seed` desliga. Rotina semeada sai `validado_com_ajustes` com `registros_mock_criados` no frontmatter.
    - **Alvos implícitos (`implicit-targets.ts`):** passo sem negrito com verbo de ação (*localize, pesquise, filtre, informe, preencha...*) + substantivo de controle (*município, estado, cidade, data, descrição...*) é casado com rótulos/placeholders **reais** dos campos na zona `content` (estado↔UF, município↔Cidade, período/data inicial↔final, CPF/documento — ADR-022; testes offline em `auditoria/src/__tests__/`, `npm --prefix auditoria test`; hook `PostToolUse` roda `tsc --noEmit` em edições de `auditoria/src/*.ts`) e demarcado em multi-demarcação; sem casamento, print limpa. O texto do manual **não** é reescrito e nenhuma ação é executada (Evidência Estrita).
    - **Grafo do KB (`kb-dependency-graph.ts`):** heurístico (o KB não tem campo de pré-requisito): provedor = rotina de título de criação; consumidor liga por tokens da entidade (mesmo módulo primeiro). Cache em `auditoria/cache/kb-dependency-graph.json`.
    - **Supabase:** `supabase/migrations/003_review_taxonomy.sql` troca o CHECK de `status_auditoria` e migra linhas legadas; `sync-supabase.ts` mapeia o legado `requer_revisao_humana` pela tag da pasta. O Console (Orion Audit Console) exibe as tags em badges, filtros, KPIs e gráfico (ADR-024 acrescenta `[CCC]` e multi-tags).
22. **PASSOS EXTERNOS `[CCC]`, MULTI-TAGS, SESSÃO ATIVA E GUARDA ANTI-BUSCA EM MENUS (ADR-024):**
    - **Escopo de passo (`step-scope.ts`):** a rotina inteira é lida **antes** de abrir o navegador e cada passo recebe `scope: 'external_portal' | 'orion_tn'`. Acessar portal/serviço externo (**SISCOAF, e-Notariado, CENSEC/SIGNO, CRC, CNB, Receita Federal, Serasa/SPC, DOI, SINTER, SIRP**, e-CPF, programa validador) torna o passo `external_portal` **até o passo que volta explicitamente ao Orion TN** (*"No **Orion TN**, acesse..."*). Passo externo **não executa ação, não mede e não tira screenshot** (seria evidência falsa da tela inicial do Orion TN): o `-revisado.md` preserva o texto e acrescenta `> [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** ...`; a execução ao vivo começa no 1º passo `orion_tn`. Passo externo sem `passo-NN.png` **não** é erro de paridade (`auditExternalSteps`); print de passo externo é.
    - **`[CCC]` (`comunicacao_externa`) e multi-tags:** `[CCC]` não bloqueia (as etapas do Orion TN são auditadas e fotografadas). Uma rotina pode ter várias tags, sempre na ordem canônica **`ATT, CCC, DDD, XRX`** e **sem espaço entre colchetes**: `[ATT][CCC] C-CENTRAL-02-...`. `auditoria_ui.status` guarda o status principal (`ATT`/`DDD`/`XRX` > `CCC`) e `auditoria_ui.review_tags` a lista completa. Migration **`005_multi_tags_and_ccc.sql`** (a 004 é o Realtime): CHECK, `routines.tags_revisao`, `routine_steps.step_scope`/`portal_externo`.
    - **Sessão ativa (`auth.ts`):** `isSessionActiveInPage` (URL `/webPortal` ou `/webFirmas`, menu **"Olá, ..."** visível, sem `#username`/`#password`) é consultada antes de abrir URL ou refazer o WildFly SSO. `resetToHome` com sessão ativa só fecha modais (`.orion-lightweight-modal`) e volta ao início por hash, sem `about:blank`, sem recarregar `/webFirmas` e sem login; estado sujo cai no reset completo. `authStats()` prova a ausência de re-login no resumo do lote.
    - **Guarda anti-busca (`navigation-guard.ts`):** passo de navegação (`>` ou *"Acesse o menu..."*) **nunca** casa com `<input>`, `<textarea>`, `[role="textbox"|"searchbox"]` nem com a busca global (`CTRL + B`), na árvore de acessibilidade, no LLM, **depois da medição** e no clique por `ref`. Sinônimo de símbolo (`+`) só por igualdade exata. Caminho de menu inexistente na árvore real **não é curado**: sai `[ATT]` com a evidência lida da árvore (prefixo real, filhos reais, folha em outra rota); cascata que não abriu é falha técnica retentável, sem tag.
23. **AMBIENTE DE PRODUTOS, PREFLIGHT DE VPN, MULTI-ABA E REAUDITORIA CONTEXTUAL (ADR-025):**
    - **Ambiente e segredos:** a auditoria roda contra o ambiente interno de Produtos (dados multi-ano, integrações e parâmetros globais), alcançável **só com a OpenVPN da Siplan**. URL (`ORION_BASE_URL`, alias legado `ORION_HOMOLOG_URL`), usuário, senha, `ORION_ENV_LABEL` e `ORION_AUTO_SEED` vivem **somente** em `auditoria/.env` (ignorado pelo Git). **Nunca** gravar IP interno ou senha em código, documentação, ADR, log versionado ou mensagem de commit. O `.env.example` só tem placeholders.
    - **Preflight (`preflight.ts`):** antes de qualquer worker/login (`--login`, `--routine`, `--routines`, `--phase`, `--reaudit-pending`) um `fetch` de 3 s na origem aborta com *"Conecte a OpenVPN da Siplan"* se o servidor não responde (qualquer HTTP, inclusive 404, conta como alcançável). O host é mascarado nas mensagens (`10.0.3.x`). `--pretriage-only` e `--list-only` não tocam a rede.
    - **Entrada pelo portal (`auth.ts`):** `loginOrion` abre a URL de entrada, preenche o login e, no `webPortal` (`#/produtos`), clica no card **Orion TN**; se o módulo abrir em **nova guia**, o foco passa para ela e a do portal é fechada. A URL real do módulo é descoberta ao vivo e persistida em `auditoria/auth/app-home.json` (`config.appHomeUrl`); `isSessionActiveInPage` aceita esse path. A conta atual **não é** `4tabeliao.scs`: o RBAC Gate só reconhece perfil pleno pelas regras da regra 19; identidade ilegível é `inconclusive` e **nunca** se declara `ORION_SESSION_GRANTED_ROLES` sem comprovar o perfil lido.
    - **Multi-aba (`browser.ts`, `reveal-explorer.ts`, `executor.ts`):** a nova guia é detectada pelo **diff de `tab list --json`** antes/depois da ação (o `agent-browser` não tem "wait for popup"; ids `tN`, nunca inteiros), recebe foco, espera `readyState` e **reaplica o viewport 1440x900 @ DPR 1.0** (a emulação não é herdada). Clique de passo só vigia guia nova quando o nó medido é `target="_blank"`/`window.open` **ou link dirigido por JS** (sem `href`, texto *"Clique aqui..."/"Acessar..."*; o handler do Angular não aparece como atributo, como o link do Orion Coaf) — `DOMActionNode.opensNewTab`; link marcado `disabled`/`disabled-no-events` pela aplicação nunca é acionado. **Gatilho genérico de sub-portal** (`openSubportalLink`): com o alvo ausente, aciona o link de nova guia cujo texto compartilha **termo distintivo** com o passo/rotina (`subportalAffinityTerms`; nenhum nome de portal no código), **mantém a guia em foco** e repete a localização do mesmo passo nela (medição ao vivo; o link vai em `passo-NN-b`). Nada é gravado. `resetToHome` chama `closeSecondaryTabs()` antes de qualquer reset.
    - **Reauditoria contextual (`prior-audit.ts`):** `loadPriorAuditContext` roda **antes** da limpeza da pasta (o `-revisado.md` sem tag é apagado no início). Curas (`auto_cura`, confiança ≥ 0,68) viram **dica** da Camada 0.5 do SmartLocator, tentada **depois** da medição do alvo documentado; rotas de menu reais viram `priorChains` do `chooseMenuItem`, só se a rota existe na árvore lida agora e a folha segue ≥ 0,80 do manual (a guarda da ADR-024 fica intacta). **A dica nunca é evidência:** só vale com o nó medido ao vivo de novo; texto do manual continua intocado fora da Trava de Evidência. Cada reauditoria acrescenta ao frontmatter `auditoria_ui.historico_reauditoria` (últimas 10: status/tags antes→depois, `bloqueio_superado`, curas reaproveitadas com `confirmada_ao_vivo`, notas editoriais reconfirmadas) e a seção `#### Evolução da Reauditoria`; **sem migration** (`auditoria_ui` é JSONB). Nota editorial anterior só volta se o confronto semântico a reproduzir agora.
    - **Hardware protegido e lote:** `hardware-registry.ts` deriva as rotinas de hardware/ambiente (flag do manifesto da Fase 3 + relatórios em disco com `Dependência de Ambiente/Hardware` e `prints_geradas: 0`) e `--reaudit-pending` (`--list-only` só lista) reaudita as `[ATT]`/`[DDD]`/`[XRX]`/`[CCC]` **sem elas**; só `--routines` as força. **Auto-seed** vem desligado no `.env` do ambiente compartilhado (`ORION_AUTO_SEED=false`); `--auto-seed` religa pontualmente.
24. **REVISÕES HUMANAS, ZOOM 80%, FIM DO FALSO RBAC E FLUXO INTERATIVO DE FIRMAS (ADR-026):**
    - **Seed idempotente e preservação (`seed-human-reviews.ts` / `--seed-reviews`):** revisões humanas de `"Marcus (Revisor)"` são persistidas com idempotência em `routine_reviews`, `routine_review_versions`, `governance_events`, `routines` (`status_governanca = 'revisao_solicitada'`) e `*-revisado.md`; reauditorias preservam `revisao_solicitada` enquanto houver revisões abertas.
    - **Zoom 80% (`config.ts`, `browser.ts`, `dom-geometry.ts`):** `browserZoom: 0.8` mantém `1440x900 @ DPR 1.0` com paridade 1:1 DOM-PNG e zero corte em seções inferiores de telas densas.
    - **Fim do falso RBAC / `.ngx-orion-hide` (`rbac.ts`, `menu-path.ts`):** `marcus` e `Perfil de acesso - Gerência webFirmas` têm acesso 100% pleno; `.ngx-orion-hide` em menus (`Balcão de firmas`) indica rota obsoleta e é curado para **`Reconhecimento de firmas`**.
    - **Guardas semânticas & limpeza `"X ou Y"` (`navigation-guard.ts`, `smart-locator.ts`, `menu-path.ts`):** vedado casar `+`/`Adicionar Serviço` com `Novo cartão +`, `Autenticidade` com `Cidade`, ou colapsar `Grupo Firmas` para `Firmas` na `navbar`; checkboxes em `<span>` (`Escrevente de Firmas`) entram no SmartLocator sem desmarcar estado ativo; alternativas inexistentes `X ou Y` são removidas sob evidência de menu.
    - **Fluxo interativo de Firmas (`firmas-interactive.ts`) & `M-40.0` sob dry-run:** em `#/pedidoFirmas/cadastrar` executa `"teste" + Enter`, `+` (`Nomes encontrados`), `Nomes para reconhecimento` + `Finalizar` e mapeia `Serviços realizados` (`Efetuar Serviço`); em grades populadas, ausência de `Limpar` pós-`dry-run` resulta em `validado_com_ajustes`, nunca `[DDD]`.
25. **GRAFO SEMÂNTICO UI, MÁQUINA DE ESTADO UNIVERSAL E RAG SOBERANO DE REVISÕES (ADR-027):**
    - **Grafo Semântico de Seções & Matriz Intenção × Papel (`dom-geometry.ts`, `smart-locator.ts`, `semantic-compatibility.ts`):** cada nó interativo carrega `sectionTitle`, `rowContext`, `associatedLabel` e `semanticRole`. `evaluateSemanticCompatibility` bloqueia com peso `0.0` antes de qualquer métrica lexical combinações incompatíveis (`entity_creation_button` `Novo cartão +` vs lançamento de serviço, campos `Cidade`/`UF` ou `navigation_root` vs modalidade/parâmetro, e substring intra-palavra `Autenticidade` vs `Cidade`) e aplica peso `1.15` à seção coincidente.
    - **Máquina de Estado Universal (`stateful-step-engine.ts`, `executor.ts`):** compara snapshots antes × depois (`captureDOMStateSnapshot`/`diffDOMStateSnapshots`), executa sondas seguras e fluxos mestre-detalhe universais (`search_and_pick`, delegação especializada de `#/pedidoFirmas/cadastrar` e transições guiadas `guided_sidebar_subportal` como `Configurações > Parametrizações > Comunicações > Orion Coaf` em nova guia) preservando `--dry-run-mutations`.
    - **RAG de Revisões Humanas (`human-review-rag.ts`, `menu-path.ts`, `server.ts`, `seed-human-reviews.ts`):** `routine_reviews` alimenta a **Camada 0.1** (direta + grafo cruzado) em `chooseMenuItem` e `smart-locator.ts`, com cache local `auditoria/cache/human-reviews-cache.json` atualizado por `--seed-reviews` e pelas rotas de revisão no `server.ts`. `buildMenuTreeScript()` seleciona o `<a>` visível quando há placeholder `<a style="display: none;">` (`FIRMPEDCERTIN01` -> `#menuNovaCertidaoEServico`) mantendo o alias textual; modais de aviso iniciais (`#modalAvisoCertificado`) são encerrados com segurança antes de abrir menus.
    - **Playwright MCP & Skill:** `.mcp.json` configura `@playwright/mcp@latest --headless` sem credenciais; `.agents/skills/auditoria-rotinas/SKILL.md` documenta a Arquitetura V2.5.
26. **CONSULTOR PROPOSITIVO DE TELA EM `[ATT]` E DESEMPATE DE MENU POR PROFUNDIDADE (ADR-028):**
    - **Raio-X da Tela Atual (`att-screen-advisor.ts`):** ao encerrar uma rotina como `[ATT]` (todas as camadas de localização esgotadas), o executor lê, somente em leitura, o `ScreenStructuralInventory` da tela do bloqueio (`location.hash`, título, seções, abas de conteúdo, campos com rótulo real, botões; sem a navegação lateral; modal ativo primeiro) e ranqueia correspondências por afinidade funcional (token igual, nunca substring; Dice só com termo em comum ou ≥ 0,75; mínimo 0,45). O `-revisado.md` recebe `> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**` abaixo do `[!CAUTION]` e `auditoria_ui.diagnostico_tela_att` (JSONB, sem migration). Tudo consultivo: nada é clicado, o texto do manual fica 100% original e a sugestão nunca vira demarcação. Passo de caminho de menu não gera correspondências.
    - **Print de contexto:** passo bloqueado sem imagem grava `passo-NN-contexto-att.png/.webp` (fora do padrão `passo-NN[-x]`, sem marcador `[aqui vai a print]`; nome em `print_contexto`); `sync-supabase.ts` envia o `.webp` ao Storage.
    - **Desempate por menor profundidade (`menu-path.ts`):** folhas empatadas no mesmo módulo raiz com profundidades diferentes (`Notas > Protocolos` x `Notas > Consultas > Protocolos`) resolvem pela menor cadeia, com nota de auto-cura (`depthTieBreak`). Mesma profundidade ou raízes diferentes continuam bloqueio por ambiguidade.
27. **MINERAÇÃO `[ATT]`/`[XRX]`, EQUIVALÊNCIAS CANÔNICAS DE MENU, PRÉ-FILTRO DE GRADE VAZIA E SINÔNIMOS POR ROTA (ADR-029):**
    - **Mineração (`mine-att-clusters.ts`, `capture-menu-tree.ts`):** classifica cada `[ATT]`/`[XRX]` em clusters **A** (caminho de menu: A1 equivalente canônico, A2 rota curada com clique omitido, A3 sem equivalente, A4 módulo externo), **B** (grade vazia que exige filtro), **C** (rótulo renomeado/alvo espúrio) e **D** (removido/pressuposto/outra rotina) em `cache/att-xrx-cluster-analysis.json`; usa a árvore real lida ao vivo (`cache/orion-menu-tree-real.json`).
    - **Menu canônico (`menu-canonical.ts`, `menu-tail.ts`):** tabela explícita de destinos únicos, irmão de mesma chave de folha e cauda como aba/seção da tela; só vale se a cadeia real existe na árvore lida agora; ambiguidade não resolve; só o prefixo muda no texto (Trava de Evidência); a aba é medida ao vivo e demarcada em `passo-NN-b`.
    - **Correção A2:** a folha de caminho de menu resolvido é clicada (antes era omitida pelo guard de alvo citado); o `Adicionar` que surge após a navegação é acionado sem gravar.
    - **Pré-Filtro de Grade (`grid-prefilter.ts`):** grade com 0 linhas em passo de item/ação de linha -> `as_is`, `wide_period` (datas digitadas com teclas reais) e `text_probe` (`"teste"`); só botões de busca; `Limpar` restaura; tentativa vira evidência (`emptyState.prefilter`).
    - **Sinônimos por rota (`route-synonyms.ts`):** Camada 0.2 do SmartLocator, só com o nó real medido ao vivo. Parser ignora negrito sem letra/número.
    - **Console:** Raio-X (`diagnostico_tela_att`), `passo-NN-contexto-att`, contadores Fase 2 × Fase 3 e linha do tempo Antes × Depois.
28. **DEEP DOM (SHADOW/IFRAMES PÓS-SCROLL), PODA CAMADA 2B, BINDINGS ANGULAR, MONITOR XHR/FETCH E CRAWLER DE ROTAS (ADR-030):**
    - **Travessia Deep DOM & Iframes Pós-Scroll (`dom-geometry.ts`, `browser.ts`):** `queryAllDeep`/`composedParent`/`composedClosest`/`composedContains` atravessam Open Shadow DOM (até profundidade 6) preservando `sectionTitle`, `rowContext`, modal ativo (`deepElementFromPoint`) e zona `content`. `searchFramesRecursively` percorre iframes same-origin até profundidade 6 (`frameChain`); `computeChainOffsetAndClip` recalcula o offset (`clientLeft`/`paddingLeft`, clipping acumulado e compensação `zoom: 0.8`) **após** `scrollIntoView()` e reflow. Removida a trava `ownerDocument === document` de `actionTarget`; `probeActionNode` usa `findDeepBySelector` e `withNewTabDetection` reafirma `ensureViewport(1440, 900)`, `applyZoom()` e `ensureNetMonitor()` após redirects `[CCC]`.
    - **Poda Camada 2B (`smart-locator.ts`):** `collectVisibleLabelNodes` atravessa Shadow DOM/iframes; `pruneAndPrioritizeNodesForLLM` filtra apenas `@ref` válidos (sem `role: 'label'`), limpa PUA/NBSP, veta `weight === 0` e `inNavbar` em `content`, deduplica linhas de tabela e prioriza antes de cortar em 40 nós; o `@ref` do LLM passa por revalidação estrita antes de `resolveHealedGeometry`.
    - **Bindings Angular (`dom-geometry.ts`):** `ng-model`, `ng-click`, `ui-sref`, `ng-disabled` e `ng-if` enriquecem candidatos e `extractSemanticSignature` para desempate e visibilidade (botões icônicos e inputs sem `<label>`).
    - **Monitor XHR/Fetch (`browser.ts`, `stateful-step-engine.ts`):** `window.__orionNetMonitor` expõe `pendingCount` e `lastApiResponse` (URL sanitizada, `isEmptyArray`, `validationMessage` HTTP 400/422) usados por `waitForNetworkIdle` e `runStatefulStepPostAction`.
    - **Crawler de Rotas (`route-crawler.ts`, `cli.ts --crawl-map`):** mapeia rotas, abas e seções em modo somente-leitura para `auditoria/cache/orion-route-graph.json`, servindo como pista auxiliar em `menu-path.ts` e `att-screen-advisor.ts`.
29. **PIPELINE VISUAL HÍBRIDO SET-OF-MARK (SoM) EM MEMÓRIA + VISUAL GROUNDING DOM VIA `agy` NA CAMADA 2C (ADR-031):**
    - **Renderizador SoM Efêmero (`annotator.ts`):** `renderSetOfMarkOverlay(screenshotBuffer, candidates)` desenha em **buffer de memória** (nunca grava em disco nem altera `passo-NN.png`) até 45 candidatos interativos `[1]..[N]` sobre `1440×900`, deslocando cada tag (`computeSetOfMarkTagPlacement`) para nunca cobrir o centro `(cx, cy)` do próprio alvo.
    - **Provedor Único Antigravity CLI (`agy-client.ts`):** vedado usar `OPENAI_API_KEY` ou `claude -p`. Toda inferência das Camadas 2B e 2C usa exclusivamente o CLI local `agy` configurado em **`Gemini 4 Hydrogen Extra`** (`--print --model gemini-4-hydrogen-xhigh --effort xhigh --output-format json --disable-slash-commands`), com prompt via **`STDIN`**, timeout de `45s`, exclusão mútua global via **`AsyncSemaphore(1)`**, imagem temporária em `auditoria/cache/som-worker-${workerId}-${Date.now()}.png` removida no `finally` e degradação graciosa (`null`) em erro/cota/timeout.
    - **Camada 2C Híbrida (`smart-locator.ts`):** (1) **2C-SoM (Preferencial):** envia o overlay SoM ao `agy`, recebe `{"tagId", "confidence", "reason"}`, aplica veto semântico pós-VLM (`validateVisualCandidateSemantics` — ADR-027 + Zona + Guarda de Navegação) e mede `getBoundingClientRect()` real no DOM (`visual_som_fallback`); (2) **2C-Grounding (Fallback Canvas/OOPIF):** envia captura limpa `1440×900`, converte `[0..1000]` para pixels `(px, py)` (`normalizedPointToViewportPx`), ancora via `document.elementFromPoint(px, py)` (incluindo Open Shadow DOM e iframes), aplica veto semântico e mede `getBoundingClientRect()` real (`visual_grounding_fallback`).
    - **Modos `--visual-mode live | defer` & Curadoria (`cli.ts`, `curate-pending-som.ts`):** `live` é padrão em `--routines`/`--routine`; `defer` é padrão em `--phase`/`--reaudit-pending` (enfileira overlays em `auditoria/cache/pending-som/pending-som-queue.json` sem disparar `agy` durante o lote). `npm --prefix auditoria run visual:curate` processa a fila em bloco via `agy` e grava mapeamentos aprovados em `human-reviews-cache.json` / `routine_reviews` (Camada 0.1) e `curated-route-synonyms.json` (Camada 0.2).

---

## 3. Schema Canônico de Rotinas (YAML Frontmatter)

### Caso 1: Rotina COM Vídeo Tutorial (`tem_video: true`)
```yaml
---
id: V-7.6.1
titulo: Importação Reversa de Minuta Word com Extração Automática via IA para Índice, DOI e CENSEC
tags:
- Editor
- Minuta Word
- Importação Reversa
- Inteligência Artificial
- Índice Notarial
- DOI
- CENSEC
objetivo: Permitir a importação direta de minutas redigidas no Microsoft Word (.docx) com extração automática por Inteligência Artificial para alimentação dos metadados do protocolo, índice, DOI e CENSEC.
sinonimos:
- importar minuta word
- minuta externa docx
- puxar texto do word para o sistema
- extrair partes do docx
perguntas_usuario:
- Como importar uma minuta feita no Word para dentro do Orion TN?
- O sistema consegue ler um arquivo do Word e preencher as partes e a DOI sozinho?
- Posso continuar redigindo as escrituras no Word sem perder a integração com o índice do cartório?
sintomas_comuns:
- retrabalho ao cadastrar partes que já estão na minuta Word
- escrevente tem resistência a usar modelos do sistema
- erro de digitação de matrícula ou dados da DOI
- demora para alimentar CENSEC após lavratura
video:
  tem_video: true
  bunny_library_id: '467408'
  bunny_video_id: 'a0110cc2-af70-4994-9f28-0ef295c00858'
  video_title: 'Webinar Orion TN 6.0'
  video_url: 'https://iframe.mediadelivery.net/embed/467408/a0110cc2-af70-4994-9f28-0ef295c00858?autoplay=false&loop=false&muted=false&preload=true&responsive=true&t=1176'
  video_timestamp: '19:36'
  video_start_seconds: 1176
  thumbnail_url: 'https://vz-f849dcb4-55a.b-cdn.net/a0110cc2-af70-4994-9f28-0ef295c00858/thumbnail.jpg'
---
#### Descrição:
O recurso de Importação Reversa viabiliza a convivência entre escreventes que redigem minutas externas no Word (.docx) e as exigências cadastrais do cartório...

#### Passo a passo:
1. No menu **Notas**, localize e abra o **Protocolo**.
2. Clique na aba **Minuta / Editor** e acione o botão **Importar Minuta Externa**.
3. Selecione o arquivo **.docx** e marque **Executar Extração Inteligente de Metadados via IA**.
4. Confira as informações destacadas na tela de conferência e clique em **Confirmar e Integrar ao Protocolo**.

* **Dica:** O sistema alimenta o índice notarial, a DOI e a CENSEC automaticamente sem redigitação.
---
```

### Caso 2: Rotina SEM Vídeo (`tem_video: false`)
```yaml
video:
  tem_video: false
```
*(Não incluir campos nulos ou vazios quando tem_video for falso).*

---

## 4. Glossário Canônico de Produtos e Notariado

* **ORION TN:** Módulo principal de notas, escrituras, procurações e balcão de firmas.
* **ORION Caixa:** Módulo financeiro, depósitos prévios, custas e faturamento.
* **ORION Estoque:** Controle de selos físicos, papéis de segurança e insumos.
* **Orion Connect:** Mural de avisos internos, mensageria e ciência obrigatória de provimentos.
* **Cartflow:** Ferramenta web/WhatsApp de coleta digital de documentos com checklist por ato.
* **Siplan:** Empresa mantenedora e desenvolvedora do ecossistema.
* **ONR / SAEC:** Centrais eletrônicas integradas para envio e acompanhamento de escrituras para o **Registro de Imóveis (RI)**.
* **DOI, CENSEC, SIGNO:** Obrigações fiscais e setoriais comunicadas automaticamente pelo sistema.

---

## 5. Índice de Arquivos Estruturais

| Arquivo / Diretório | Finalidade e Conteúdo |
| :--- | :--- |
| [`doc conhecimento final/OrionTN pos.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/doc%20conhecimento%20final/OrionTN%20pos.md) | **Base de conhecimento mestre consolidada** (471 rotinas homologadas: Seções R, V, M, D e 5 de Casos Reais 0800). |
| [`kb/`](file:///d:/marcu/Videos/OrionTN/OrionTN/kb/) | **Base Granular de Produção RAG** (471 rotinas atômicas em `rotinas/<modulo>/`, contextos em `modulos/<modulo>/`, `_indice.md` e `_glossario.md`). |
| [`scripts/build_kb.py`](file:///d:/marcu/Videos/OrionTN/OrionTN/scripts/build_kb.py) | **Compilador e Validador da Base** (valida 100% dos schemas YAML e gera a árvore `kb/`). |
| [`scripts/sync_openai_vector_store.py`](file:///d:/marcu/Videos/OrionTN/OrionTN/scripts/sync_openai_vector_store.py) | **Sincronizador Incremental OpenAI** (upload em lote, hashes SHA-256 e chunking de 1800 tokens). |
| [`novos contextos/Webinar Orion TN 6.0_corrigido.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/novos%20contextos/Webinar%20Orion%20TN%206.0_corrigido.md) | Transcrição purificada e normalizada do Webinar 6.0. |
| [`.agents/memory/standards/`](file:///d:/marcu/Videos/OrionTN/OrionTN/.agents/memory/standards/) | Especificações detalhadas de schemas, diretrizes, arquitetura RAG e Design System Siplan. |
| [`.agents/memory/decisions/`](file:///d:/marcu/Videos/OrionTN/OrionTN/.agents/memory/decisions/) | Histórico de Decisões Arquiteturais (ADRs numerados de 001 a ADR-031). |
| [`auditoria/`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/) | **Workspace de Auditoria Visual & Agent-Browser** (ADR-007: rotinas enriquecidas com prints anotados via Sharp, changelogs e sessões). |
| [`auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md) | **Árvore Oficial de Permissões & Módulos (Orion TN 6.0):** Comprovação de acesso 100% pleno (`[x]`) de `4tabeliao.scs` e grafia literal de menus/telas. |
| [`.agents/skills/auditoria-rotinas/`](file:///d:/marcu/Videos/OrionTN/OrionTN/.agents/skills/auditoria-rotinas/SKILL.md) | **Skill de Execução da Auditoria:** Permite acionar qualquer fase (1 a 6) em novas conversas independentes. |

---

## 6. Protocolo de Atualização Contínua (Living Memory Protocol)

> [!IMPORTANT]
> **OBRIGAÇÃO DO AGENTE EM TODA CONVERSA:**
> Sempre que durante uma conversa você e o usuário decidirem alterar um padrão, adotar um novo metadado, criar um novo fluxo ou aposentar uma prática legada:
>
> 1. **Não confie apenas no histórico da conversa.** Crie ou atualize imediatamente a documentação persistente.
> 2. **Gere um novo registro de decisão (ADR)** em `.agents/memory/decisions/ADR-XXX-[assunto].md`.
> 3. **Atualize as especificações técnicas** em `.agents/memory/standards/`.
> 4. **Atualize este arquivo `GEMINI.md`**, garantindo que as Golden Rules reflitam a nova verdade.
> 5. **Aplique as mudanças no arquivo mestre** (`doc conhecimento final/OrionTN pos.md`) se o acervo for impactado.
> 6. **Confirme a gravação ao usuário**, assegurando que a nova decisão já está imutavelmente integrada para as próximas sessões.
