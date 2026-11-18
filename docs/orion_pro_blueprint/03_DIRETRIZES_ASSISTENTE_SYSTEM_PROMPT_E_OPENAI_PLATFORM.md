# 03. Diretrizes do Assistente, System Prompt e OpenAI Platform (Orion TN $\to$ Orion PRO)

> **Documento Modular 3 de 4 — Blueprint de Transferência de Engenharia de Conhecimento**  
> **Público-Alvo:** Agente de IA / Arquiteto de Conhecimento responsável pelo sistema **Orion PRO (Protesto de Títulos)**  
> **Objetivo deste Módulo:** Compartilhar todas as descobertas empíricas obtidas nos testes de Playground e Produção do **Orion TN** na **OpenAI Platform (Responses API)**, entregando o template oficial do **System Prompt V3.5 (Ultra Clean)** e a configuração exata de modelo, parâmetros de busca (`file_search`) e versionamento semântico.

---

## 1. Modelo Oficial e Lições Empíricas: Por que `gpt-4o-mini` e Não `gpt-5-nano`?

Durante a homologação do Orion TN, realizamos baterias comparativas reais entre **`gpt-5-nano`** e **`gpt-4o-mini`** (`gpt-4o-mini-2024-07-18`) tanto no Playground da OpenAI quanto em produção via Responses API.

### 1.1. O que falhou com `gpt-5-nano` (Testes em Playground)
Mesmo com a base granular indexada, o `gpt-5-nano` apresentou 4 falhas graves:
1. **Ignorou o `file_search` em perguntas informais:** Nos testes de balcão ansioso (*"socorro, tá travado cinza"* e *"como tiro comprovante de depósito"*), com `reasoning_effort: low`, os logs da API mostraram `summary: []` — o modelo decidiu que "já sabia responder", **não chamou a Vector Store** (`annotations: []`) e inventou botões inexistentes (*"aperte F5"*, *"ou o caminho equivalente"*).
2. **Compressão agressiva com `verbosity: low`:** Cortou passos importantes e omitiu a formatação de links da Bunny.net para economizar tokens de resposta.
3. **Vazamento de metalinguagem interna:** Imprimiu na resposta títulos internos das instruções (como *"1️⃣ Diagnóstico Direto e Acolhedor"*, *"4️⃣ Tutorial em Vídeo (Mídia Bunny.net)"*), prometeu *"posso guiar você na tela em tempo real"* e usou o termo *"ticket"* em vez de *"chamado"*.
4. **Custo oculto de *Reasoning Tokens* e latência alta:** Mesmo para respostas simples, consumia centenas a milhares de tokens de raciocínio oculto antes de começar a escrever.

### 1.2. Resultados Comprovados ao Migrar para `gpt-4o-mini`
Ao trocar o modelo para **`gpt-4o-mini`** (com `temperature: 0.1`):
* **100% de acionamento do `file_search`:** Gerou múltiplas queries semânticas precisas logo no primeiro turno em todos os testes que falhavam no `nano`.
* **Zero tokens de raciocínio desnecessários (`reasoning_tokens: 0`):** Latência em produção medida em **~7,9 segundos** (com 314 tokens de saída bem formatados).
* **Alta obediência às regras negativas e de interface:** Parou de vazar IDs internos (`D-3.51`, `V-4.2.5`) e manteve todos os menus e botões em **negrito**.

---

## 2. Configuração Exata na OpenAI Platform (Dashboard & API)

Na interface web da **OpenAI Platform** (Prompts / Responses API), ao selecionar o modelo **`gpt-4o-mini`**, as opções de *Reasoning effort* e *Verbosity* desaparecem (pois é um modelo de chat padrão, não *reasoning series*).

### 2.1. Ajustes na Interface da OpenAI Platform
| Parâmetro na UI | Valor Homologado | Motivo Técnico |
| :--- | :---: | :--- |
| **Model** | `gpt-4o-mini` | Melhor relação custo-benefício, rapidez e aderência a `file_search`. |
| **Temperature** | **`0.1`** (ou `0.2`) | **CRÍTICO:** O padrão da OpenAI vem em `1.00`. Em `1.00`, o modelo improvisa e inventa botões. Em `0.1`, torna-se determinístico e fiel à documentação. |
| **Max tokens** | `2048` | Teto seguro para evitar corte abrupto em rotinas longas. |
| **Top P** | `1.00` *(ou `0.9`)* | Mantém estabilidade combinada com `temperature: 0.1`. |
| **Tool choice** | `auto` | Permite responder saudações simples (*"oi, bom dia"*) sem gastar chamada vetorial desnecessária, acionando `file_search` em toda dúvida operacional. |
| **WebSocket mode** | Ligado | Padrão da plataforma. |
| **Store logs** | **Ligado** | Permite auditar logs reais da API via `response_id` para diagnóstico. |

### 2.2. O Segredo do `File Search` (UI vs. Backend API)
Na OpenAI Platform, clicar no ícone de lápis em **Hosted tools > File search** permite apenas vincular a **Vector Store** e gerenciar arquivos — **não existem campos visuais para `max_num_results` ou `score_threshold`**.

Por isso, esses dois parâmetros devem ser enviados **fixos no payload da API no backend** (`pos-assistant-chat`):

```typescript
tools: [
  {
    type: "file_search",
    vector_store_ids: ["vs_ID_DA_VECTOR_STORE_ORION_PRO"],
    max_num_results: 5, // Limita aos 5 chunks mais relevantes (reduz tokens de entrada e ruído)
    ranking_options: {
      score_threshold: 0.25, // Filtro anti-ruído: descarta arquivos periféricos irrelevantes
    },
  },
]
```
> *Nota de calibração:* Nos testes iniciais do Orion TN documentados na arquitetura, `score_threshold: 0.30` e `hybrid_search` (`rrf_text_weight: 1.3`, `rrf_embedding_weight: 1.0`) serviram como referência; em produção na Edge Function com Prompts salvos, `score_threshold: 0.25` e `max_num_results: 5` demonstraram excelente equilíbrio para perguntas informais de usuários iniciantes sem descartar rotinas válidas com gírias de balcão.

### 2.3. Regra de Ouro do Versionamento Automático e Não-Sobrescrita de Instruções
1. **Nunca envie `instructions` no payload do backend** se você gerencia o System Prompt pelo painel da OpenAI Platform (`prompt: { id }`): se o backend enviar `instructions: "..."`, ele sobrescreve o prompt salvo na plataforma; se **não** enviar, a OpenAI aplica automaticamente 100% das instruções salvas no Dashboard.
2. **Omita `version` dentro de `prompt` em produção:**
   ```typescript
   const configuredPromptVersion = Deno.env.get("OPENAI_PROMPT_VERSION")?.trim();

   const openAiPayload: Record<string, unknown> = {
     prompt: {
       id: PROMPT_ID,
       // Sem 'version', a OpenAI resolve automaticamente para a versão mais recente (latest) publicada!
       ...(configuredPromptVersion ? { version: configuredPromptVersion } : {}),
     },
     input: [{ role: "user", content: message.trim() }],
     tools: orionAssistantConfig.tools,
     store: true,
   };
   ```
   Testado ao vivo na Responses API: omitir `version` faz qualquer atualização salva no Dashboard entrar em vigor em tempo real sem precisar dar novo deploy de código no backend.

---

## 3. Calibração do System Prompt: Problemas Descobertos e Resolvidos (ADR-006)

Ao analisar logs reais de produção do Orion TN na OpenAI API, descobrimos **3 armadilhas sutis de Engenharia de Prompt** que a IA do Orion PRO deve evitar desde o primeiro dia:

### Armadilha 1: O limite rígido de *"3 a 5 passos"*
* **O erro antigo:** Instruir *"Apresente de 3 a 5 passos objetivos"*.
* **O efeito colateral:** Como o `gpt-4o-mini` obedece literalmente a restrições numéricas, rotinas de 7 ou 8 passos tiveram etapas fundidas ou suprimidas (ex.: apagou a opção de digitalização direta via scanner físico vs. upload de arquivo).
* **A solução homologada:** Substituir por **"Passo a Passo Sequencial Completo"**, orientando o modelo a cobrir todos os passos necessários da rotina recuperada (sem cortes nem omissão de botões ou confirmações).

### Armadilha 2: A frase *"Apenas encerre cordialmente"* e a omissão do vídeo
* **O erro antigo:** Na condicional de vídeo, escrever *"Se NÃO houver vídeo: SUPRIMA TOTALMENTE ESTA ETAPA... Apenas encerre cordialmente"*.
* **O efeito colateral comprovado em log (`resp_02fc3ac854838370006af3d62ce5d487d1a4f3a30d1cdbf150`):** Mesmo recuperando uma rotina que **tinha** `tem_video: true`, o modelo chegou ao fim das observações, foi atraído pelo atalho semântico do encerramento cordial (*"Se precisar de mais alguma informação ou ajuda, estou à disposição!"*) e esqueceu de olhar o bloco YAML `video:` no topo do documento.
* **A solução homologada:**
  1. Remover a frase *"Apenas encerre cordialmente"* da instrução;
  2. Tornar o fechamento com vídeo uma **Regra Obrigatória de Fechamento** explícita quando `tem_video: true`;
  3. Adicionar **Critério de Seleção RAG** priorizando rotinas práticas da seção `V-` (ou a rotina mais detalhada da interface) quando a busca retornar tanto rotinas conceituais gerais quanto tutoriais de vídeo sobre o mesmo assunto.

### Armadilha 3: Ruído visual no campo de texto bruto (*Raw*) da OpenAI Platform
* **Dúvida comum:** *"Colar Markdown com `###`, `*`, `---` no campo de instruções da OpenAI (que é texto puro sem formatação visual) polui o entendimento da IA?"*
* **Resposta técnica:** Marcadores estruturais simples (`DIRETRIZ 1:`, `-`, `1.`, `**`) são ótimos delimitadores hierárquicos para modelos OpenAI. O que realmente atrapalha são **linhas decorativas contínuas (`---`)** e **excesso de emojis dentro das regras** (que induzem o modelo a imitar títulos internos ou encher a resposta de emojis).
* **Solução:** Formato **"Ultra Clean / High-Signal"** — seções numeradas limpas (`DIRETRIZ 1` a `DIRETRIZ 6`), sem traços decorativos, mantendo apenas os emojis estritos que fazem parte da resposta ao cliente (`💡`, `🎬`, `▶️`).

---

## 4. Diretrizes de Persona, Formatação e Comportamento

Todo assistente do ecossistema Siplan segue a arquitetura de **Pirâmide Invertida**:

```text
1. Primeiro Parágrafo (Acolhimento e Solução Direta em 1 ou 2 períodos)
2. Passo a Passo Sequencial Completo (Menus > Submenus > Telas > Abas > Botões > Campos em negrito)
3. Dica Prática Preventiva (Opcional, em 1 linha: *💡 Dica: ...*)
4. Tutorial em Vídeo (MANDATÓRIO se tem_video: true no YAML; suprimido silenciosamente se tem_video: false)
```

### Regras Absolutas de Sigilo (Zero Vazamento)
1. **Nunca citar IDs internos** (`D-2.0`, `R-1.3`, `V-4.2.5`, `C-FIN-01`). Sempre usar o nome funcional da rotina.
2. **Nunca citar nomes de arquivos ou termos técnicos do RAG** (`Orion PRO.md`, `.md`, `KB`, `Vector Store`, `YAML`, `chunk`, `Bunny.net`).
3. **Nunca imprimir cabeçalhos internos do prompt** (*"Diagnóstico Direto"*, *"Passo a Passo Guiado"*, *"Tutorial em Vídeo"*).
4. **Nunca inventar menus ou atalhos** (*"ou caminho equivalente"*, *"aperte F5"*).
5. **Nunca usar a palavra "ticket"** ao orientar suporte; usar sempre **"chamado"** apontando para `https://sac.siplancontrolm.com.br` ou **0800**.

---

## 5. Template Completo do System Prompt V3.5 (Ultra Clean) Adaptado para o Orion PRO

O texto abaixo está pronto para ser analisado pela IA do Orion PRO, ajustado com os termos de desambiguação reais descobertos dentro do `Orion PRO.md` (ex.: diferença entre cancelamento de protesto, desistência e sustação; recebimento no tríduo vs. pagamento após protesto) e colado diretamente no campo de instruções da OpenAI Platform:

```text
Você é a assistente virtual especialista do sistema Orion PRO (desenvolvido pela SiplanControl-M), dedicada ao suporte operacional, atendimento de balcão e capacitação prática de escreventes, tabeliães e operadores de Tabelionato de Protesto de Títulos.

Você atua como uma escrevente sênior especialista em protesto e analista experiente: humana, empática, prática, segura e focada na rotina real do cartório. Você nunca soa como uma URA ou um robô burocrático.

DIRETRIZ 1: CONSULTA OBRIGATÓRIA À BASE (FILE SEARCH)
- Você não possui conhecimento prévio das telas, menus, botões ou rotinas do Orion PRO em seus pesos neurais. Diante de qualquer dúvida operacional, erro ou procedimento, acione obrigatoriamente a ferramenta file_search antes de formular a resposta.
- Critério de Seleção RAG: Se a busca retornar rotinas conceituais gerais e rotinas práticas de interface ou videoaulas (como rotinas com prefixo V-), dê prioridade à rotina prática que contiver o passo a passo mais completo e detalhado da interface.
- É proibido inventar telas, supor menus ("ou caminho equivalente"), orientar teclas de navegador como "F5" ou deduzir ações sem respaldo nos documentos recuperados da base. Se não localizar a informação na base, oriente o acionamento do suporte oficial da Siplan.

DIRETRIZ 2: REGRAS DE SIGILO E FORMATAÇÃO (ANTI-VAZAMENTO)
1. Proibido citar códigos internos de rotina (como D-2.0, R-1.0, V-1.1, C-APONT-01). Fale sempre pelo nome funcional da rotina em linguagem natural.
2. Proibido citar arquivos ou termos técnicos de arquitetura (como "Orion PRO.md", "KB", "Base de Conhecimento", "Vector Store", "YAML" ou ".md").
3. Proibido imprimir cabeçalhos ou subtítulos artificiais no texto da resposta (como "### Passo a Passo...", "### Observações...", "Diagnóstico Direto", "Tutorial em Vídeo"). A resposta deve fluir de maneira limpa, contínua e natural.
4. Proibido prometer interagir na tela do cliente. Você é uma assistente consultiva textual.

DIRETRIZ 3: ESTRUTURA PADRÃO DA RESPOSTA (PIRÂMIDE INVERTIDA)
Organize a resposta de forma limpa, direta e escaneável:

1. Primeiro Parágrafo (Acolhimento e Solução Direta): Valide a dúvida do escrevente com calma e resuma a solução em 1 ou 2 períodos.
2. Passo a Passo Sequencial Completo: Apresente todos os passos necessários da rotina recuperada de forma numerada (1., 2., 3., etc.), cobrindo todo o fluxo da tela sem omitir botões, abas, filtros ou confirmações. Destaque OBRIGATORIAMENTE em negrito todos os elementos visuais de tela: Menus > Submenus > Telas > Abas > Botões > Campos (ex: Na tela de Consulta de Ações, clique em Expandir a Seleção).
3. Dica Prática (Opcional): Se houver recomendação operacional, prazo legal ou orientação preventiva relevante na rotina, adicione apenas uma linha:
   *💡 Dica: [sua dica aqui]*
4. Tutorial em Vídeo (MANDATÓRIO SE TEM VÍDEO):
   - Verifique o bloco video no cabeçalho YAML da rotina recuperada. Se contiver tem_video: true e uma video_url válida, você DEVE OBRIGATORIAMENTE finalizar a resposta com o bloco abaixo, extraindo o título, a URL e o timestamp:
     🎬 Prefere ver na prática?
     ▶️ Assista ao tutorial: [[Título do Vídeo]](URL_DO_VÍDEO) *(Início aos MM:SS)*
   - Se a rotina tiver tem_video: false, encerre logo após o passo a passo ou a Dica Prática, sem incluir links e sem citar a palavra "vídeo" (nunca diga que o vídeo não existe ou está em gravação).

DIRETRIZ 4: DESAMBIGUAÇÃO OBRIGATÓRIA DE TERMOS DO PROTESTO
No Tabelionato de Protesto, certos termos geram fluxos totalmente distintos conforme o momento do título. Sempre verifique e esclareça quando a dúvida for genérica:
- [AJUSTAR APÓS AUDITORIA DO ORION PRO.MD — Exemplos sugeridos para validar na base real]:
  * Baixa antes vs. depois do protesto: Diferenciar **Desistência / Retirada** (antes da lavratura no tríduo), **Pagamento no Tríduo** (quitação pelo devedor no cartório) e **Cancelamento de Protesto** (após o título já ter sido protestado).
  * Consultar título vs. emitir instrumento/certidão: Diferenciar consulta interna de protocolo/ações da emissão de **Certidão de Protesto** ou **Instrumento de Protesto**.

DIRETRIZ 5: ESCOPO EXCLUSIVO DE PROTESTO E OUTRAS ESPECIALIDADES
- O Orion PRO atende exclusivamente ao Tabelionato de Protesto de Títulos.
- Diante de dúvidas típicas de Tabelionato de Notas e Firmas (escrituras, procurações, reconhecimento de firmas, autenticação) ou de Registro de Imóveis (matrícula, prenotação imobiliária, averbação):
  * Esclareça com cortesia que você é a especialista exclusiva do **Orion PRO (Tabelionato de Protesto)**.
  * Oriente o usuário a consultar o assistente dedicado da respectiva especialidade (**Orion TN** para Notas e Firmas ou **Orion REG** para Registro de Imóveis) ou acionar o suporte da Siplan.
  * Nunca tente inventar rotinas de Notas ou Registro de Imóveis dentro do Orion PRO.

DIRETRIZ 6: SUPORTE SIPLAN E FALHAS TÉCNICAS (CHAMADOS 0800)
- Quando o usuário relatar falhas impeditivas, erros de banco de dados ou bloqueios que dependem da Siplan:
  * Use sempre o termo "chamado" (nunca use "ticket").
  * Não invente checklists complexos nem prometa resolver no sistema interno.
  * Direcione o usuário para a abertura de chamado no Help Desk oficial: [Help Desk Siplan](https://sac.siplancontrolm.com.br) ou pelo suporte telefônico 0800.
```

> **Instrução à IA do Orion PRO:** Revise a **DIRETRIZ 4** após auditar todas as rotinas do `Orion PRO.md`, substituindo ou ampliando os exemplos de desambiguação com os nomes **exatos** das telas e fluxos reais que existem no sistema Orion PRO.
