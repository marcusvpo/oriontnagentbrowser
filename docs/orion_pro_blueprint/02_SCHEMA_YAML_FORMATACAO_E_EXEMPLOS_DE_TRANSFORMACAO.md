# 02. Schema YAML V3.2, Formatação Canônica e Exemplos de Transformação (Orion TN $\to$ Orion PRO)

> **Documento Modular 2 de 4 — Blueprint de Transferência de Engenharia de Conhecimento**  
> **Público-Alvo:** Agente de IA / Arquiteto de Conhecimento responsável pelo sistema **Orion PRO (Protesto de Títulos)**  
> **Objetivo deste Módulo:** Fornecer o dicionário completo do **Schema V3.2**, as regras rígidas de corpo Markdown, o **Protocolo em 2 Estágios para Vídeos da Bunny.net**, a transformação comentada do exemplo real do `Orion PRO.md` (`D-2.0`) e exemplos reais homologados do **Orion TN**.

---

## 1. Anatomia Canônica de uma Rotina (Schema V3.2)

Cada rotina no arquivo mestre e nos arquivos individuais em `kb/rotinas/<modulo>/` segue uma estrutura invariável delimitada por triplos traços (`---`).

### 1.1. Modelo Estrutural Completo
*Nota:* No **arquivo mestre consolidado**, o bloco contém os metadados editoriais obrigatórios. Ao ser compilado para a pasta granular **`kb/rotinas/<modulo>/<id>-<slug>.md`**, o compilador (`build_kb.py` / nó n8n) injeta automaticamente os 5 campos de roteamento RAG (`modulo`, `modulo_nome`, `secao`, `categoria`, `versao_sistema`).

```markdown
---
id: [PREFIXO]-[NUMERO]
titulo: [Título Limpo e Autoexplicativo da Rotina]
tags:
- [Tag 1]
- [Tag 2]
- [Tag 3]
objetivo: [Declaração direta em 1 a 2 linhas começando com verbo no infinitivo]
sinonimos:
- [expressão coloquial ou gíria de balcão 1]
- [termo alternativo 2]
- [termo alternativo 3]
perguntas_usuario:
- [Pergunta real humanizada em primeira pessoa 1?]
- [Pergunta real humanizada 2?]
- [Pergunta real humanizada 3?]
sintomas_comuns:
- [dor, dúvida prática ou mensagem de tela 1]
- [erro ou travamento operacional 2]
- [sintoma de usuário iniciante 3]
video:
  tem_video: false
  # Quando houver vídeo da Bunny.net (Estágio 2), tem_video passa a true e recebe:
  # bunny_library_id: 'ID_DA_BIBLIOTECA'
  # bunny_video_id: 'UUID-DO-VIDEO'
  # video_title: 'Título do Vídeo'
  # video_url: 'https://iframe.mediadelivery.net/embed/LIB/UUID?t=SEGUNDOS'
  # video_timestamp: 'MM:SS'
  # video_start_seconds: 123
  # thumbnail_url: 'https://vz-xxxx.b-cdn.net/UUID/thumbnail.jpg'
# --- Campos injetados pelo compilador ao gerar kb/ ---
modulo: [slug_modulo]
modulo_nome: [Nome Amigável do Módulo]
secao: [R | V | M | D | C]
categoria: [procedimento_geral | videoaula_tutorial | manual_operacional | demonstracao_pratica | troubleshooting_0800]
versao_sistema: Orion PRO [Versão Atual]
---

#### Descrição:
[1 a 2 parágrafos contextualizando para que serve a funcionalidade na rotina real do Tabelionato de Protesto, quais dados exibe ou modifica e quando deve ser usada.]

#### Passo a passo:
1. No menu **[Nome do Menu]**, acesse a opção **[Nome da Tela]**.
2. Preencha o campo **[Nome do Campo]** ou utilize o filtro **[Nome do Filtro]**.
3. Clique no botão **[Nome do Botão]** para confirmar ou visualizar o resultado.

* **Dica / Alerta / Importante:** [Orientação prática de balcão, regra de prazo/custas, ou alerta da Corregedoria / Normas do CNJ].
---
```

---

## 2. Dicionário Técnico de Campos do YAML Frontmatter

| Campo | Tipo | Obrigatório | Regra e Finalidade Semântica no RAG |
| :--- | :---: | :---: | :--- |
| `id` | `String` | **Sim** | Identificador único. No Orion TN segue: `R-` (Rotinas gerais), `V-` (Videoaulas), `M-` (Manuais), `D-` (Demonstrações) e `C-` (Casos Reais 0800 com sub-sigla temática). **Nunca deve ser citado na resposta ao usuário.** |
| `titulo` | `String` | **Sim** | Nome funcional claro, sem abreviações obscuras. Evite caracteres que quebrem YAML sem aspas (se houver `:` no título, envolva o valor em aspas simples ou duplas). |
| `tags` | `List[String]` | **Sim** | De 3 a 8 palavras-chave principais para indexação híbrida (BM25 + embeddings). |
| `objetivo` | `String` | **Sim** | Frase objetiva iniciada por verbo no infinitivo (*"Visualizar...", "Orientar...", "Registrar..."*). |
| `sinonimos` | `List[String]` | **Sim (mín. 3)** | Mapeia como o escrevente leigo ou ansioso chama a rotina no dia a dia (*"puxar titulo", "ver custas", "abrir detalhes"*). Essencial para evitar falhas de busca semântica. |
| `perguntas_usuario` | `List[String]` | **Sim (mín. 3)** | Simula perguntas humanizadas reais enviadas no chat (em linguagem natural informal). Substitui o antigo bloco `### Intenções de Busca & Dúvidas Frequentes` do corpo do Markdown, mantendo o corpo limpo e concentrando a indexação no cabeçalho. |
| `sintomas_comuns` | `List[String]` | **Sim (mín. 3)** | **Padrão V3.0 (ADR-001):** Captura dores de balcão, erros de tela, mensagens literais de validação e bloqueios (*"não aparece o valor total", "botão de cancelar cinza", "cliente quer saber quanto vai pagar"*). Foi um dos maiores ganhos de assertividade no Orion TN. |
| `video` | `Object` | **Sim** | Estrutura padronizada para integração com o player da **Bunny.net** (ver Seção 3). |
| `modulo` | `String` | *Injetado* | Slug técnico do módulo (usado em `attributes` da OpenAI Vector Store para filtros pré-busca). |
| `modulo_nome` | `String` | *Injetado* | Nome legível do módulo (usado no `_indice.md` e `_contexto.md`). |
| `secao` | `String` | *Injetado* | Prefixo único (`R`, `V`, `M`, `D` ou `C`). |
| `categoria` | `String` | *Injetado* | `procedimento_geral`, `videoaula_tutorial`, `manual_operacional`, `demonstracao_pratica` ou `troubleshooting_0800`. |
| `versao_sistema` | `String` | *Injetado* | Identificação de versão do software (ex.: `Orion TN 6.0` $\to$ adaptar conforme versão vigente do Orion PRO). |

---

## 3. Protocolo de 2 Estágios para Vídeos da Bunny.net (Regra ADR-003)

Como os dados de vídeos do **Orion PRO** ainda serão fornecidos posteriormente pelo usuário, a arquitetura deve operar em **2 estágios limpos e compatíveis**, evitando placeholders vazios ou campos proibidos.

### Estágio 1 — Estado Atual (Sem URLs da Bunny.net ainda cadastradas)
Todas as rotinas devem ser padronizadas desde já com o nó `video:` enxuto:

```yaml
video:
  tem_video: false
```

> [!CAUTION]
> **O QUE NÃO FAZER NO ESTÁGIO 1:**
> 1. **NÃO crie campos com valores vazios, `null`, `"TODO"` ou `"A_DEFINIR"`** (ex.: `bunny_video_id: ""` ou `video_url: null`). O LLM lê o YAML inteiro; placeholders vazios ou `null` fazem o modelo alucinar que o vídeo existe ou responder *"o link está em construção"*.
> 2. **PROIBIÇÃO ABSOLUTA DO CAMPO `video_id` (ADR-003):** No Orion TN, o campo `video_id` foi definitivamente banido por duplicar `bunny_video_id`. Nunca utilize o nome `video_id` em nenhum schema, script ou prompt de extração de metadados. Use **exclusivamente `bunny_video_id`**.

### Estágio 2 — Injeção Futura (Quando o Usuário Fornecer os Vídeos da Bunny)
Quando o usuário enviar os vídeos/transcrições ou planilha com os IDs da Bunny.net do Orion PRO, a IA apenas atualizará o nó `video:` das rotinas correspondentes (ou criará novas rotinas na Seção `V-`):

```yaml
video:
  tem_video: true
  bunny_library_id: 'ID_BIBLIOTECA'
  bunny_video_id: 'UUID-DO-VIDEO-NA-BUNNY'
  video_title: 'Título Limpo da Videoaula'
  video_url: 'https://iframe.mediadelivery.net/embed/ID_BIBLIOTECA/UUID-DO-VIDEO-NA-BUNNY?t=SEGUNDOS'
  video_timestamp: 'MM:SS'
  video_start_seconds: 1245
  thumbnail_url: 'https://vz-xxxx.b-cdn.net/UUID-DO-VIDEO-NA-BUNNY/thumbnail.jpg'
```

**Regras estritas de cálculo da URL de Embed (Bunny.net):**
* `video_start_seconds`: inteiro exato em segundos onde a demonstração começa no vídeo (ex.: `20:45` $\to$ `20 * 60 + 45 = 1245`).
* `video_timestamp`: string formatada em `MM:SS` (ex.: `'20:45'` ou `'06:41'`).
* `video_url`:
  * Se a URL base **já possuir query params** (`?autoplay=false...`), anexe `&t=[segundos]`.
  * Se a URL base for **limpa**, anexe `?t=[segundos]`.

---

## 4. Regras Rígidas de Formatação do Corpo e Arquivo

1. **Codificação e Quebra de Linha:** Sempre **UTF-8** e padrão Windows **CRLF** (`\r\n`) no arquivo mestre consolidado.
2. **Cabeçalhos Obrigatórios do Corpo:**
   * `#### Descrição:` (obrigatório em 100% das rotinas)
   * `#### Passo a passo:` com lista numerada (`1.`, `2.`, `3.`) (obrigatório em 100% das rotinas)
   * *Atenção:* Remover seções antigas como `### Intenções de Busca & Dúvidas Frequentes` e `### Procedimento / Explicação`. As dúvidas frequentes vão para `perguntas_usuario:` e `sintomas_comuns:` no YAML; o corpo fica limpo apenas com `#### Descrição:`, `#### Passo a passo:` e notas finais (`* **Importante:**` / `* **Dica:**`).
3. **Elementos de Interface Estritamente em Negrito:**
   * Todo nome de módulo, menu, submenu, tela, aba, botão, ícone, coluna ou campo deve estar entre `**...**`.
   * *Exemplos:* menu **Consultas**, tela **Consulta de Ações**, botão **Expandir a Seleção**, campo **Nº do Protocolo**.
4. **Regra do Verbo Imperativo no Passo a Passo:**
   * Prefira passos claros e diretos (ex.: *"1. Na tela de **Consulta de Ações**, localize o protocolo desejado."* em vez de infinitivos soltos como *"1. localizar..."*), mantendo fidelidade absoluta às telas reais documentadas na base sem inventar nomes de botões inexistentes.
5. **Delimitador Final:** Finalizar cada bloco de rotina com `---` isolado em linha própria.

---

## 5. Transformação Real Comentada: Exemplo do `Orion PRO.md` (Antes $\times$ Depois)

Abaixo está a análise diagnóstica exata da rotina de exemplo extraída do `Orion PRO.md` atual e como ela deve ser transformada ao aplicar a engenharia do Orion TN.

### 5.1. O Estado Atual no `Orion PRO.md` ("Antes")
```markdown
## D-2.0 - Expandir e Visualizar Detalhes do Protocolo
**Objetivo:** Visualizar informações detalhadas de um protocolo específico, incluindo dados do título, devedor, sacador e valores de custas.  
**Tags:** `protocolo`, `detalhes`, `visualização`, `informações`

### Intenções de Busca & Dúvidas Frequentes
- Onde consigo expandir e visualizar detalhes do protocolo?
- visualização
- Como faço para expandir e visualizar detalhes do protocolo?
- informações

### Procedimento / Explicação
#### Passo a passo:

1. Na tela de **Consulta de Ações**, localizar o protocolo desejado

2. Clicar para **Expandir a Seleção**

3. Visualizar os dados do título (espécie, número, valor)

4. Visualizar os dados do devedor

5. Visualizar os dados do sacador/cedente

6. Visualizar os valores de custas e total para cancelamento
```

**Diagnóstico das Deficiências da Versão Atual:**
1. **Ausência de YAML Frontmatter delimitador (`---`):** Impede parsing automático por scripts e impossibilita extrair atributos para a OpenAI Vector Store.
2. **`Intenções de Busca` poluídas com palavras soltas:** Itens como `- visualização` e `- informações` geram ruído e não ajudam a busca semântica; pertencem a `tags` ou `sinonimos` contextualizados.
3. **Falta de `sinonimos` e `sintomas_comuns`:** Se um atendente no balcão perguntar *"cliente quer saber quanto fica pra cancelar o protesto do título"* ou *"onde vejo quem é o cedente e o devedor do apontamento"*, a versão antiga tem baixa similaridade lexical.
4. **Ausência de `#### Descrição:`:** O assistente precisa contextualizar brevemente a tela antes de listar os cliques (para cumprir o primeiro parágrafo da Pirâmide Invertida).
5. **Ausência do nó `video:`:** Impede o assistente de saber de forma determinística se existe tutorial gravado (`tem_video: false` no Estágio 1).

### 5.2. A Rotina Transformada no Padrão V3.2 ("Depois" — Estágio 1)
```markdown
---
id: D-2.0
titulo: Expandir e Visualizar Detalhes do Protocolo
tags:
- protocolo
- consulta de ações
- detalhes do título
- devedor
- sacador
- cedente
- custas de cancelamento
objetivo: Visualizar informações detalhadas de um protocolo específico na Consulta de Ações, abrangendo dados do título, devedor, sacador/cedente e valores de custas.
sinonimos:
- ver detalhes do protesto
- consultar dados do título protestado
- abrir informações do devedor e cedente
- conferir valor total para cancelamento do título
- detalhar protocolo na consulta de ações
perguntas_usuario:
- Onde consigo expandir e visualizar todos os detalhes de um protocolo no Orion PRO?
- Como faço para ver quem é o devedor, o sacador e o valor das custas de um título?
- Em qual tela confiro a espécie, o número do título e o total para cancelamento?
sintomas_comuns:
- escrevente não encontra os dados completos do sacador ou cedente na grade resumida
- dúvida sobre onde consultar o valor total de custas para cancelar o protocolo
- cliente no balcão pedindo detalhamento do título antes de pagar ou cancelar
- atendente precisa conferir espécie e número do título sem abrir outro módulo
video:
  tem_video: false
---

#### Descrição:
Permite expandir um protocolo diretamente na grade da tela **Consulta de Ações** para inspecionar seus dados completos sem precisar navegar para outras telas de edição. A visualização detalhada consolida em um único painel as características do título, a identificação das partes envolvidas (devedor e sacador/cedente) e o demonstrativo de custas com o valor total calculado para eventual cancelamento.

#### Passo a passo:
1. Acesse a tela **Consulta de Ações** e localize o protocolo desejado na listagem.
2. Clique na opção **Expandir a Seleção** correspondente à linha do protocolo.
3. Na área expandida, confira os dados principais do título (**espécie**, **número** e **valor**).
4. Verifique os dados cadastrais do **devedor**.
5. Confira os dados do **sacador/cedente**.
6. Analise o detalhamento dos **valores de custas** e o **total para cancelamento** exibidos na tela.

* **Dica Prática:** Utilize a expansão rápida na **Consulta de Ações** antes de iniciar um cancelamento ou atendimento de balcão para informar com segurança ao interessado o valor exato de custas e confirmar os dados do título.
---
```
> **Observação importante para a IA do Orion PRO:** Note que no exemplo acima **não inventamos menus, abas ou botões** que não existiam no original (`Orion PRO.md`). Mantivemos 100% da verdade operacional documentada (**Consulta de Ações**, **Expandir a Seleção**, etc.) e elevamos radicalmente a semântica do YAML, a clareza da descrição e a formatação de interface em **negrito**. Sempre que enriquecer uma rotina, valide se há outras rotinas no `Orion PRO.md` que informem o caminho completo do menu até a **Consulta de Ações** antes de citar qualquer caminho pai.

---

## 6. Exemplos Reais Homologados do Orion TN (Referência por Seção)

Abaixo estão exemplos reais extraídos diretamente de `kb/rotinas/` do **Orion TN** ilustrando as 5 seções canônicas:

### 6.1. Seção `R-` (Rotina Geral com Vídeo Bunny.net)
Arquivo: `kb/rotinas/notas/R-1.3-integracao-com-inteligencia-artificial-para-preenc.md`
```markdown
---
id: R-1.3
titulo: Integração com Inteligência Artificial para Preenchimento de Partes e Atos Notariais
tags:
- Inteligência Artificial
- IA
- OCR
- Preenchimento Automático
- Protocolo
- Qualificação de Partes
- Receita Federal
objetivo: Preencher e qualificar automaticamente partes e intervenientes no protocolo notarial a partir de documentos digitalizados utilizando os novos motores de IA com validação cadastral e checagem de PEP.
sinonimos:
- preenchimento com IA
- importação de CNH com inteligência artificial
- leitura de documento por IA
- OCR inteligente
- importação coletiva de documentos
- validação de partes por IA
perguntas_usuario:
- Como faço para qualificar as partes automaticamente usando a Inteligência Artificial no protocolo?
- Posso importar a CNH e a certidão de casamento de uma vez para a IA preencher o protocolo?
- A IA do Orion TN consulta a Receita Federal e avisa se a pessoa é PEP?
- O que significa a opção de manter o que já preenchi ou sobrescrever ao usar a IA?
sintomas_comuns:
- demora ao digitar qualificação de partes
- erro ao ler CNH na IA
- dúvida entre sobrescrever ou complementar dados
- alerta de PEP não identificado
- CPF não validado na Receita
video:
  tem_video: true
  bunny_library_id: '467408'
  bunny_video_id: a0110cc2-af70-4994-9f28-0ef295c00858
  video_title: Webinar Orion TN 6.0
  video_url: https://iframe.mediadelivery.net/embed/467408/a0110cc2-af70-4994-9f28-0ef295c00858?autoplay=false&loop=false&muted=false&preload=true&responsive=true&t=401
  video_timestamp: 06:41
  video_start_seconds: 401
  thumbnail_url: https://vz-f849dcb4-55a.b-cdn.net/a0110cc2-af70-4994-9f28-0ef295c00858/thumbnail.jpg
modulo: notas
modulo_nome: Notas e Escrituras
secao: R
categoria: procedimento_geral
versao_sistema: Orion TN 6.0
---

#### Descrição:
A ferramenta de Inteligência Artificial do Orion TN 6.0 processa lotes de documentos de identificação (CNH, RG, certidões) através de motores avançados (OpenAI e Google Gemini), estruturando automaticamente a qualificação das partes...

#### Passo a passo:
1. No módulo **Notas**, acesse a aba **Protocolos** e abra o protocolo desejado ou clique em **Novo Protocolo**.
2. Na aba **Partes**, localize o painel de participantes e clique no botão **Preencher com IA** (ou ícone de Inteligência Artificial).
...
---
```

### 6.2. Seção `C-` (Troubleshooting Real do 0800 — ADR-004)
Arquivo: `kb/rotinas/caixa/C-FIN-01-estorno-encadeado-de-recibo-com-guia-de-recolhimen.md`
```markdown
---
id: C-FIN-01
titulo: Estorno Encadeado de Recibo com Guia de Recolhimento Definitiva (PEX) Emitida
tags:
- Financeiro
- Caixa
- Estorno
- Recibo
- Guia PEX
- Sinoreg
- Protocolo
objetivo: Orientar o procedimento obrigatório de estorno encadeado quando o recibo financeiro está bloqueado devido à prévia emissão da guia de recolhimento definitiva.
sinonimos:
- estornar recibo com guia emitida
- não consigo estornar recibo
- erro guia emitida estorno
- estorno encadeado pex
perguntas_usuario:
- Como faço para estornar um recibo que já teve a guia PEX emitida?
- O sistema diz que o recibo teve a guia de recolhimento emitida e não deixa estornar, o que fazer?
- Qual é a ordem correta para estornar um protocolo concluído no caixa e retificar custas?
sintomas_comuns:
- 'mensagem: Não é possível realizar o estorno, pois este pedido teve a guia de recolhimento emitida'
- escrevente precisa retificar partes ou custas mas o recibo está travado
- botão de estornar recibo bloqueia a ação por pendência de cancelamento de guia
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
No Orion TN, a integridade fiscal impede o estorno direto de recibos cujas taxas estaduais (PEX/Sinoreg) já foram apuradas em guia definitiva. Para desbloquear a edição do protocolo e das custas, o operador deve seguir uma cadeia estrita e reversível de estornos.

#### Passo a passo:
1. No **Orion Caixa** (ou no menu **Recolhimento** do Orion TN), acesse **Guias > Guias de Recolhimento Definitivas (PEX)**.
2. Localize a guia gerada para o protocolo e selecione a opção **Estornar Guia de Recolhimento**.
3. Em seguida, no **Orion Caixa**, acesse o menu **Administração > Controle de Caixa > Recibos**.
4. Pesquise o recibo pelo número do protocolo correspondente e clique no botão **Estornar Recibo**.
5. No **Orion TN**, abra o protocolo através de **Notas > Protocolo**, aplique as retificações necessárias nas custas ou na qualificação e salve.
6. Conclua o ato novamente, envie ao caixa, emita o novo **Recibo** definitivo e processe a nova **Guia de Recolhimento**.

* **Alerta Operacional:** Nunca tente reabrir o protocolo no Notas sem antes cancelar a guia PEX e o recibo no Caixa; essa sequência evita divergências no fechamento semanal do Sinoreg.
---
```

---

## 7. Estrutura dos Documentos Estruturais da Pasta `kb/`

Além das rotinas individuais em `kb/rotinas/<modulo>/`, a compilação gera 3 tipos de arquivos de apoio essenciais para o RAG:

### 7.1. `kb/_indice.md` (Padrão `llms.txt`)
Catálogo único que lista todas as rotinas agrupadas por módulo, permitindo que a busca descubra títulos exatos e sinônimos mesmo diante de termos coloquiais:

```markdown
# Catálogo Mestre de Rotinas do Sistema Orion PRO

> **Arquivo de Roteamento de Vocabulário & Descoberta RAG (llms.txt Pattern)**  
> **Total de Rotinas Homologadas:** [N] rotinas  

## Módulo: [Nome do Módulo] (`slug`) - [X] Rotinas

| ID | Título da Rotina | Seção | Vídeo | Sinônimos Chave | Arquivo Relativo |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `D-2.0` | **Expandir e Visualizar Detalhes do Protocolo** | D | Não | *ver detalhes do protesto, conferir valor total para cancelamento...* | [`D-2.0`](rotinas/protocolo/D-2.0-expandir-e-visualizar-detalhes-do-protocolo.md) |
```

### 7.2. `kb/_glossario.md`
Tabela de terminologia oficial do domínio e produtos Siplan (evita que erros de digitação do usuário ou termos regionais confundam o retriever).

### 7.3. `kb/modulos/<modulo>/_contexto.md`
Resumo transversal do módulo contendo:
1. Visão Geral do Módulo;
2. Regras Transversais e Desambiguações Obrigatórias daquele módulo;
3. Catálogo Rápido das rotinas vinculadas.

---

## 8. Sugestão Consultiva de Taxonomia para o Orion PRO (Protesto)

Enquanto no **Orion TN** (Notas e Firmas) os 11 módulos foram `notas`, `caixa`, `firmas`, `selos`, `centrais`, `livros`, `certidoes`, `acesso`, `config`, `comunicacao` e `geral`, para o **Orion PRO** recomenda-se que a IA avalie o `Orion PRO.md` e proponha ao usuário uma árvore adaptada ao fluxo do **Tabelionato de Protesto**, como por exemplo:

| Slug Sugerido do Módulo | Nome Sugerido | Escopo Típico no Protesto | Sigla Futura `C-` (0800) |
| :--- | :--- | :--- | :--- |
| `apontamento` | Apontamento e Protocolo | Recepção de títulos, distribuição, conferência, qualificação de devedor/sacador, remessa manual/lote | `C-APONT-xx` |
| `intimacao` | Intimação e Editais | Emissão de intimações, AR, portador, edital eletrônico/físico, retorno de entrega e prazos do tríduo | `C-INTIM-xx` |
| `lavratura` | Lavratura, Desistência e Cancelamento | Efetivação do protesto, pagamento no tríduo, desistência, sustação judicial, anuência e cancelamento | `C-LAVRA-xx` ou `C-CANCEL-xx` |
| `centrais` | Centrais e Convênios (CENPROT / CRA / Bancos) | Remessa/retorno bancário, IEPTB, CRA, CENPROT Nacional/Estadual, SERASA, Boa Vista/SPC | `C-CENTRAL-xx` |
| `caixa` | Financeiro, Caixa e Custas | Cálculo de emolumentos, pagamento pelo devedor, repasse ao apresentante, guias e mensalistas | `C-FIN-xx` |
| `selos` | Selo Digital e Livros | Selagem eletrônica, envio ao Tribunal (TJ), livros de apontamento/protesto e termos | `C-SELO-xx` / `C-LIVRO-xx` |
| `certidoes` | Certidões e Buscas | Certidão negativa/positiva de protesto, buscas de CPF/CNPJ e segunda via de instrumento | `C-CERT-xx` |
| `acesso` | Acesso, Usuários e Permissões | Perfis de usuário, senhas, 2FA e bloqueios de tela | `C-ACESSO-xx` |
| `config` | Configurações, Tabelas e Parâmetros | Tabelas de custas, feriados, modelos de intimação/instrumento, impressoras | `C-CONFIG-xx` |
| `geral` | Rotinas Gerais e Administrativas | Visão geral e procedimentos transversais | `C-GERAL-xx` |

*Nota:* Esta tabela é uma **sugestão inicial de referência** para a IA validar contra as rotinas reais existentes dentro do arquivo `Orion PRO.md`.
