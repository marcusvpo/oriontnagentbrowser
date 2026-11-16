# Relatório Geral de Auditoria de Interações e Diagnóstico de UX — Assistente IA (Orion TN)

Este documento consolida a análise completa das **17 interações reais** extraídas dos logs de produção do Assistente Virtual de Pós-Implantação do **Orion TN**. O objetivo é mapear o comportamento real dos escreventes e operadores de cartório, auditar as falhas e acertos do modelo atual e estabelecer as diretrizes corretivas para o Prompt de Sistema e para a Base de Conhecimento (`OrionTN pos.md`).

---

## Sumário Executivo: 8 Padrões Identificados nos Logs

A leitura cruzada de todas as 17 interações revela padrões críticos sobre como os clientes interagem com a IA e por que a retenção atual é baixa:

1. **O que já funciona muito bem (O Ouro do Projeto):**
   * Quando o usuário consegue chegar na entrega final da rotina (como nos **Casos 7 e 8**, com o usuário Darlan), o formato de passo a passo aliado ao **player de vídeo iniciando no minuto e segundo exatos da dúvida** (`Início aos 01:34`, `Início aos 02:04`) entrega uma experiência excelente. O problema é que a maioria dos usuários desiste antes de chegar nessa etapa por culpa da barreira do "Digite 1, 2 ou 3".
2. **Abandono em Perguntas de "Quick Reply" / Onboarding:**
   * A pergunta *"Como funciona a navegação geral e menus no Orion TN?"* aparece de forma idêntica em **3 cartórios diferentes** (**Casos 2, 6 e 16**), indicando ser um botão de sugestão inicial na tela do chat. Em **100% das vezes**, o usuário abandonou a conversa após a resposta da IA, pois ela respondeu a um botão de boas-vindas exigindo que ele escolhesse entre 1, 2 ou 3.
3. **Saudação Simples Tratada como Busca de Rotina:**
   * No **Caso 4**, o usuário enviou apenas *"Boa tarde"*. Como o prompt obrigava a IA a sempre listar rotinas na Etapa 1, ela respondeu ao "Boa tarde" oferecendo 3 manuais aleatórios. Pior: quando o usuário digitou `2`, a IA disse que aquela rotina (`R-1.1`) não possuía passo a passo completo na base.
4. **Dúvidas sobre Dados Reais do Cartório vs. Limite de Acesso / LGPD:**
   * No **Caso 17 (Sorocaba)**, o usuário perguntou por que o lote SEFAZ do dia 29/09 não estava aparecendo no sistema dele. O assistente não tem acesso ao banco de dados local da serventia (por questões técnicas e de LGPD). Em vez de avisar de forma humana e transparente que não enxerga a tela/dados do cartório e já entregar o checklist de verificação (filtros de consulta vs. termos pendentes de geração), a IA jogou o menu engessado dizendo *"neste momento não vou apresentar o passo a passo"*.
5. **Vazamento Grave do Nome do Arquivo Fonte (`.md`) e IDs Internos:**
   * Apesar da proibição nas instruções, a IA vazou explicitamente o nome do arquivo interno no **Caso 6** (`Referência: Orion TN pos.md`) e no **Caso 9** (`Fonte: OrionTN pos.md - R-33.0`).
6. **Vazamento de Metalinguagem e Instruções do Prompt:**
   * O assistente fala com o usuário repetindo ordens internas: *"Selecione uma das opções abaixo (com apenas o ID e o título)"* (**Caso 1**), *"neste momento não vou apresentar o passo a passo"* (**Caso 17**), ou imprimindo cabeçalhos de rascunho como *"Passo a passo fiel:"* e *"Descrever as ações disponíveis:"* (**Casos 8, 9 e 10**). No **Caso 8**, mesmo após já ter entregado o passo a passo completo, a IA encerrou perguntando novamente se o usuário queria digitar "1" para ver o passo a passo.
7. **Poluição na Base `.md` (Rotinas Duplicadas que Confundem o RAG):**
   * Quando o usuário pergunta *"como posso consultar um protocolo"* (**Caso 12**), a IA ignora a rotina correta (`R-33.0 - Como Consultar Protocolos`) e sugere 3 rotinas de **Movimentação Financeira**, sendo duas delas com títulos idênticos (`D-3.43` e `D-3.33`).
   * Para *"Cartão de Assinatura"* (**Casos 11 e 13**), a base possui 3 rotinas quase iguais (`D-3.3`, `M-9.0` e `V-CCA.3.3`), forçando o usuário a adivinhar qual das três é a certa.
8. **Falta de Filtro de Escopo entre Sistemas da Siplan (Notas vs. Protesto):**
   * Cartórios cumulativos (Notas + Protesto, como no **Caso 1**) perguntam sobre rotinas de Protesto no assistente do Orion TN. A IA tenta forçar rotinas de Notas que contêm a palavra "protesto" por acaso (como `Importar Arquivo de Protesto ou RC`).

---

## Auditoria Individual e Integral das 17 Interações

---

### Caso 1: EMBU DAS ARTES – 1º TABELIONATO DE NOTAS E DE PROTESTO DE TÍTULOS
**Usuário:** rb · Setor: adm · **Data:** 27/10/2026 às 09:45

#### 📜 Registro Integral da Interação
```text
EMBU DAS ARTES – 1º TABELIONATO DE NOTAS E DE PROTESTO DE TITULOS
rb · adm · 27/10/2026 às 09:45

rb
27/10 09:45
estorno de atos

Assistente IA
27/10 09:45
Olá! Para te orientar sobre estorno de atos, selecionei as rotinas mais relacionadas. Por favor, escolha a opção desejada digitando o número correspondente.

1
D-2.14 - Estornar Distribuição de Produto
Desfazer distribuições de produtos, retornando-os ao estoque para redistribuição. Estorno é imediato e reverte a distribuição sem deixar rastro.
Endereço de referência: Estornar distribuição de produto no Orion TN.
2
V-3.4.6 / D-3.4.6 - Gestão de Protocolos com Assinaturas Pendentes e Estorno de Recolhimento
Fluxo para atos com assinaturas pendentes, mantendo taxas zeradas e realizando estorno de recolhimento para retificação de valores ou finalização do ato.
Inclui permissão de estorno e procedimentos para finalização de protocolo com assinatura pendente.
3
R-9.0 - Cancelar Selos de um Protocolo ou Inutilizar Protocolo
Alternativas: cancelar apenas selos de um ato dentro de um protocolo ou inutilizar o protocolo inteiro. Inclui estorno de selos conforme necessidade.
Endereço de referência: cancelar/inutilizar cerimônias/atias de protocolo.
Qual opção você quer que eu trate em seguida? Digite 1, 2 ou 3 para eu enviar o passo a passo completo e, se houver, o vídeo tutorial correspondente.

rb
27/10 09:45
cancelamento de protesto

Assistente IA
27/10 09:45
Ótimo. Vamos identificar rotinas relacionadas a cancelamento de protesto. Selecione uma das opções abaixo (com apenas o ID e o título). Quero confirmar qual você quer que eu forneça o passo a passo completo depois.

1
D-3.35 Gerar Selo de Cancelamento
Descrição: Cancelar protocolo formalmente gerando selo de cancelamento e comunicando ao TJ.
Observação
libera o cancelamento formal de atos, incluindo comunicação de cancelamento ao TJ.
2
R-9.0 Cancelar Selos de um Protocolo ou Inutilizar Protocolo
Descrição: Realizar o cancelamento de selos de um ato específico dentro de um protocolo ou inutilizar completamente um protocolo que não terá continuidade. Inclui opções para cancelar apenas selos de um ato ou inutilizar o protocolo inteiro.
3
D-3.69 Importar Arquivo de Protesto ou RC
Descrição: Importar dados de protesto ou RC para unificar em relatórios. Embora não seja exatamente cancelamento, pode ser relevante se o protesto precisar ser retificado ou reprocessado após cancelamento.
Qual opção você deseja que eu trate em detalhes (digite 1, 2 ou 3)?
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Busca por palavras-chave curtas (*"estorno de atos"*, *"cancelamento de protesto"*). Como o cartório acumula Notas e Protesto, o usuário misturou dúvidas de ambos os setores e ignorou completamente o comando de digitar números.
* **O que falhou no Assistente:**
  1. **Alucinação bizarra de palavras:** Na opção 3 da primeira resposta, escreveu *"cancelar/inutilizar **cerimônias/atias** de protocolo"*.
  2. **Vazamento de instrução interna:** Disse ao usuário *"Selecione uma das opções abaixo (com apenas o ID e o título)"*.
  3. **Exibição de ID duplo:** Exibiu `V-3.4.6 / D-3.4.6`.
  4. **Confusão entre Notas e Protesto:** Sugeriu `Importar Arquivo de Protesto ou RC` para alguém que pediu cancelamento de protesto.
* **Como deveria ter sido:** Explicar diretamente a diferença entre **Estorno de Recolhimento Financeiro** e **Cancelamento de Selo/Protocolo** em Notas já com os passos resumidos; e na segunda mensagem esclarecer que este é o assistente exclusivo do **Orion TN (Notas)**, orientando sobre o Selo de Cancelamento caso seja um ato notarial ou direcionando para o suporte do módulo de Protesto.

---

### Caso 2: SÃO CAETANO - 4º TABELIONATO DE NOTAS
**Usuário:** EDGARD PEIRO DE CAMARGO · Setor: Notas · **Data:** 01/09/2026 às 08:59

#### 📜 Registro Integral da Interação
```text
SÃO CAETANO - 4º TABELIONATO DE NOTAS
EDGARD PEIRO DE CAMARGO · Notas · 01/09/2026 às 08:59

EDGARD PEIRO DE CAMARGO
01/09 08:59
Como funciona a navegação geral e menus no Orion TN?

Assistente IA
01/09 08:59
Ótima pergunta! Para te orientar com navegação e menus no Orion TN, selecione a opção que melhor descreve o que você precisa entender:

1
D-1.2 - Configurar Dados de Cartório
2
D-1.3 - Configurar Modelos de Impressão
3
D-3.33 - Visualizar Movimentação Financeira do Protocolo
Qual opção você gostaria de ver o passo a passo completo? Digite o número da opção (1, 2 ou 3).
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Clicou na pergunta pronta de boas-vindas (*"Como funciona a navegação geral e menus no Orion TN?"*) esperando um resumo de boas-vindas sobre a interface do sistema.
* **O que falhou no Assistente:**
  1. **Erro grosseiro de busca (RAG):** Em vez de puxar a rotina `R-1.0 - Visão Geral do Sistema ORION TN`, trouxe rotinas de configuração administrativa e financeira (`Configurar Dados de Cartório`, `Modelos de Impressão`, `Movimentação Financeira`).
  2. **Abandono imediato:** O usuário viu opções que não tinham relação com a pergunta e fechou o chat.
* **Como deveria ter sido:** Entregar de imediato uma visão geral acolhedora explicando como o Orion TN se divide (módulos de **Notas**, **Firmas**, **Caixa** e **Administração**) e perguntar qual serviço ele deseja realizar primeiro.

---

### Caso 3: SÃO PAULO - 26º TABELIONATO DE NOTAS
**Usuário:** Clayton · Setor: TI · **Data:** 23/10/2026 às 15:12

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Clayton · TI · 23/10/2026 às 15:12

Clayton
23/10 15:12
a Barra de Tarefas do um usuario sumiu o que pode ter acontecido

Assistente IA
23/10 15:12
Entendi. Vamos identificar opções de rotinas que ajudam a localizar o que pode ter acontecido com a Barra de Tarefas e o desbloqueio de edição no protocolo.

Para seguir o fluxo, aqui vão 2 opções distintas que costumam tratar de esse tipo de situação (IDs e títulos oficiais):

1
V-4.1.1 - Acesso à Guia de Partes e Desbloqueio de Edição no Protocolo
2
V-4.3.6 - Consulta Automática de Impedimentos Legais e Indisponibilidade no SIGNO e CGI
Qual opção você gostaria que eu te encaminhasse com o passo a passo completo? Por favor, diga 1 ou 2 para eu enviar o tutorial detalhado (incluindo o vídeo, se houver).
Observação
se a barra de busca estiver indisponível por questões de impedimentos legais ou indisponibilidade de partes, a rotina de verificação de impedimentos (SIGNO/CGI) pode explicar o comportamento, mas a primeira linha de atuação costuma ser desbloquear a guia Partes conforme a V-4.1.1.
Clayton
23/10 15:18
exite alguma possibildade de um usuario esta bloqueado

Assistente IA
23/10 15:18
Entendi. Existem caminhos específicos para tratar bloqueios de edição ou de acessos no protocolo. Abaixo, apresento 2 rotinas pertinentes. Não vou detalhar o passo a passo ainda; apenas indico as opções para você escolher qual deseja que eu te encaminhe o tutorial completo.

1
V-4.1.1 - Acesso à Guia de Partes e Desbloqueio de Edição no Protocolo
2
V-7.0.1 - Geração e Qualificação de Partes e Imóveis no Editor com Resolução de Pendências em Vermelho
Qual opção você quer que eu lhe envie com o passo a passo completo (incluindo o vídeo, se houver)? Digite 1 ou 2.

Observação
breve: a rotina V-4.1.1 trata especificamente do desbloqueio da edição na aba Partes (útil quando campos aparecem travados). A V-7.0.1 aborda a geração/qualificação de partes e imóveis e como solucionar pendências destacadas em vermelho, o que também pode impedir edição dependendo do contexto.
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Profissional de TI diagnosticando um sintoma relatado por um escrevente (*"barra sumiu"* / *"usuário bloqueado"*).
* **O que falhou no Assistente:**
  1. **Postura hostil/burocrática:** *"Não vou detalhar o passo a passo ainda; apenas indico as opções"*.
  2. **Falta de resposta direta:** O usuário perguntou *"existe alguma possibilidade de um usuário estar bloqueado?"* e a IA se recusou a responder "Sim" e explicar os motivos, repetindo a lista numérica.
* **Como deveria ter sido:** Iniciar com o diagnóstico direto (bloqueio de edição do protocolo na guia Partes vs. grupo de permissão do usuário) e entregar os passos de verificação na primeira resposta.

---

### Caso 4: SÃO PAULO - 26º TABELIONATO DE NOTAS
**Usuário:** Clayton · Setor: TI · **Data:** 22/10/2026 às 16:59

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Clayton · TI · 22/10/2026 às 16:59

Clayton
22/10 16:59
Boa tarde

Assistente IA
22/10 16:59
Boa tarde! Para te ajudar da melhor forma, encontrei algumas rotinas do Orion TN que costumam ser úteis em atendimentos de rotina de cartório. Escolha a opção que melhor descreve sua dúvida ou o que você precisa fazer, que eu já sigo com o passo a passo completo na próxima mensagem.

1
V-1.0 - Visão Geral do Sistema ORION TN
2
R-1.1 - Módulo ORION TN: Firmas
3
D-3.23 - Gerar Recibo de Protocolo
Observação
cada opção tem um objetivo específico dentro do fluxo do Orion TN. Qual opção você gostaria de ver com o passo a passo completo?
Clayton
22/10 17:00
2

Assistente IA
22/10 17:00
R-1.1
Módulo ORION TN: Firmas
Descrição resumida:

O módulo de Firmas descreve seu propósito para serviços de balcão e o fluxo básico para um reconhecimento de firma.
Observação importante:

O documento não traz um passo a passo completo nesta rotina específica. Se desejar, posso buscar outra rotina relacionada ao módulo de Firmas que contenha o passo a passo completo ou sugerir caminhos alternativos dentro do fluxo de reconhecimento de firmas.
Próximo passo:

Deseja que eu pesquise outra rotina com passo a passo completo sobre Firmas (por exemplo, abertura de pedido de reconhecimento, geração de fichas, ou envio de fichas) ou prefere que eu siga com outra opção de solução?
Clayton
22/10 17:00
Duvidas sobre Permissoes do usuarios

Assistente IA
22/10 17:00
Ótimo tema. Sobre permissões de usuários, selecionei as rotinas mais relacionadas para te orientar. Abaixo vão 2 opções de rotinas com foco em administração de usuários e permissões. Escolha uma delas (ou me diga se quer uma terceira) para eu te entregar o passo a passo completo.

1
D-2.2 - Configurar Grupos de Permissões
Descrição: Criar e configurar grupos de permissões com controle granular sobre acesso às telas e rotinas do módulo.
O que envolve: criação de grupos, definição de quais telas/rotinas ficam liberadas ou restritas, e como transferir usuários entre grupos.
Observação
Permite configuração granular por tela e rotina dentro de cada menu.
Referência: contém instruções para criar/grupos, atribuir telas/rotinas e gerenciar usuários dentro dos grupos.
2
D-2.3 - Cadastrar Novo Usuário
Descrição: Registrar novo usuário no módulo com dados básicos e definir suas permissões.
O que envolve: criar o usuário, preencher campos principais e, após a criação, associar a um grupo de permissões para definir o acesso às funcionalidades.
Observação
após criar, é essencial atribuir o usuário a um grupo de permissões para definir o acesso às funcionalidades.
Referência: passo a passo inicial para cadastro de usuário e a necessidade de associar a um grupo de permissões.
Observação
rápida
Se quiser, também posso trazer uma rotina mais específica sobre atribuição de permissões por perfil de escrevente ou sobre desbloqueio de edição em protocolo relacionado a permissões (por exemplo, quando o usuário precisa de permissões para editar partes ou emitir recibos). Existem itens nessa linha de conteúdo que ajudam a entender limites de acesso conforme o papel do usuário.
Qual rotina você prefere que eu siga com o passo a passo completo? Digite 1 para Configurar Grupos de Permissões (D-2.2) ou 2 para Cadastrar Novo Usuário (D-2.3). Se quiser, posso buscar uma terceira opção específica sobre “permissões por grupo” ou “permissões de Caixa/Remuneração” conforme o seu fluxo.
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** O usuário começou educadamente dizendo apenas *"Boa tarde"*, esperando que o bot respondesse *"Boa tarde! Como posso te ajudar hoje?"*.
* **O que falhou no Assistente:**
  1. **Disparo de menu para um simples "Boa tarde":** Como as instruções antigas forçavam a Etapa 1 em qualquer mensagem inicial, a IA inventou 3 opções aleatórias (`Visão Geral`, `Firmas`, `Gerar Recibo`) sem o usuário ter perguntado nada!
  2. **Armadilha de Rotina Vazia (`R-1.1`):** Curioso, o usuário digitou `2`. A IA respondeu: *"O documento não traz um passo a passo completo nesta rotina específica"*. Ou seja, ofereceu um item na vitrine e depois disse que a caixa estava vazia.
  3. **Prolixidade Extrema na 3ª Resposta:** Quando o usuário finalmente pediu *"Duvidas sobre Permissoes do usuarios"*, a IA gerou um texto gigante e repetitivo (`Descrição`, `O que envolve`, `Observação`, `Referência`) apenas para não entregar os passos de como configurar o grupo de permissão! O usuário desistiu e abandonou o chat.
* **Como deveria ter sido:**
  * Para saudações (*"Bom dia"*, *"Boa tarde"*, *"Olá"*), responder apenas cumprimentando de forma calorosa e perguntando qual é a dúvida no Orion TN.
  * Ao ouvir *"Dúvidas sobre permissões de usuários"*, já entregar de forma enxuta como funciona a lógica de **Grupos de Permissões** no Orion TN (menu de acesso + como vincular um usuário a um grupo).

---

### Caso 5: SÃO PAULO - 26º TABELIONATO DE NOTAS
**Usuário:** Cristiano · Setor: TI · **Data:** 22/10/2026 às 09:03

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Cristiano · TI · 22/10/2026 às 09:03

Cristiano
22/10 09:03
Como gerar e qualificar partes e documentos no Editor do Orion TN?

Assistente IA
22/10 09:03
Olá! Para te ajudar com essa dúvida, localizei rotinas relacionadas no sistema. Selecione a opção desejada para eu te enviar o passo a passo completo.

1
V-7.0.1 - Pré-Qualificação Textual de Imóveis para Modelos de Minutas Internas (Ícone Azinho)
2
D-3.38 - Qualificar Partes no Editor
3
D-3.39 - Qualificar Imóvel no Editor
D-3.38 e D-3.39 tratam diretamente da qualificação das Partes e do Imóvel no Editor, enquanto a V-7.0.1 aborda o fluxo completo de qualificação de partes e imóveis para gerar minutas com modelos internos e inclui a etapa de remesclagem de dados.
Qual opção você quer que eu apresente o passo a passo completo? Por favor, responda com o número da opção (1, 2 ou 3).
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Clicou em outra sugestão pronta de tela inicial (*"Como gerar e qualificar partes e documentos no Editor do Orion TN?"*) um minuto depois de ter tentado a pergunta de navegação geral (Caso 6).
* **O que falhou no Assistente:** As rotinas encontradas (`D-3.38`, `D-3.39` e `V-7.0.1`) eram **exatamente as corretas**, mas como o assistente se recusou a resumir o fluxo na primeira resposta e exigiu que o usuário escolhesse um número, o usuário abandonou a conversa.
* **Como deveria ter sido:** Explicar em 4 passos diretos como qualificar Partes e Imóveis no Editor e já disponibilizar o vídeo tutorial correspondente.

---

### Caso 6: SÃO PAULO - 26º TABELIONATO DE NOTAS
**Usuário:** Cristiano · Setor: TI · **Data:** 22/10/2026 às 09:02

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Cristiano · TI · 22/10/2026 às 09:02

Cristiano
22/10 09:02
Como funciona a navegação geral e menus no Orion TN?

Assistente IA
22/10 09:03
Ótima pergunta! Para te orientar sobre a navegação e os menus no Orion TN, selecionei as opções mais relacionadas na base de conhecimento. Qual delas você quer que eu detalhe depois?

1
R-1.0 - Visão Geral do Sistema ORION TN
Descrição: apresenta a arquitetura, os módulos e a interface do Orion TN, incluindo o layout com menus de fácil acesso para os escreventes e operadores.
Observação
fornece contexto geral sobre onde ficam os módulos integrados e como eles se conectam na rotina diária.
(Referência: Orion TN pos.md)
2
R-1.1 - Módulo ORION TN: Firmas
Descrição: descreve o módulo de Firmas, com foco no fluxo de serviços de balcão, incluindo consultas, cadastros e o fluxo básico de reconhecimento de firma.
Observação
útil para entender onde iniciar procedimentos de reconhecimento de assinaturas e como navegar pelas opções dentro do módulo de Firmas.
(Referência: Orion TN pos.md)
3
D-1.1 - Acessar o Módulo Orion Caixa
Descrição: orienta como acessar o módulo Orion Caixa via Orion TN, com o menu principal e os passos para abrir o módulo correspondente ao seu perfil.
Observação
mostra a organização dos menus após abrir o módulo e como confirmar quais opções aparecem para o seu usuário.
(Referência: Orion TN pos.md)
Observação
sobre o formato: esta primeira mensagem não traz o passo a passo; apenas apresento as opções relevantes para você escolher qual rotina quer que eu entregue o passo a passo completo na próxima etapa. Por favor, diga qual opção deseja seguir digitando 1, 2 ou 3.
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Teste inicial do assistente clicando no botão de navegação geral.
* **O que falhou no Assistente:**
  1. **Violação Grave de Regra (Vazamento do Arquivo `.md`):** Exibiu 3 vezes seguidas `(Referência: Orion TN pos.md)`.
  2. **Metalinguagem Robótica no Rodapé:** *"Observação sobre o formato: esta primeira mensagem não traz o passo a passo; apenas apresento as opções relevantes para você escolher..."*.
* **Como deveria ter sido:** Apresentar diretamente o resumo da rotina de **Visão Geral do Sistema Orion TN**, sem jamais citar o arquivo `.md` ou os códigos `R-1.0`.

---

### Caso 7: SÃO PAULO - 26º TABELIONATO DE NOTAS (CASO DE SUCESSO NA ETAPA 2)
**Usuário:** Darlan · Setor: Firmas · **Data:** 21/10/2026 às 15:46

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Darlan · Firmas · 21/10/2026 às 15:46

Darlan
21/10 15:46
Histórico de reconhecimento de firma

Assistente IA
21/10 15:46
Olá! Para te ajudar com o histórico de reconhecimento de firma, selecionei as rotinas mais relacionadas. Por favor, digite o número da opção que deseja (1 ou 2):

1
M-17.0 - Como Consultar Pedidos de Firmas
2
D-3.9 - Consultar Reconhecimento de Firmas
Qual opção você quer que eu entregue o passo a passo completo?
Darlan
21/10 15:47
2

Assistente IA
21/10 15:47
D-3.9
Consultar Reconhecimento de Firmas
Descrição
Fazer consulta rápida de serviços de reconhecimento realizados no dia ou período, visualizando itens utilizados e valores.

Passo a passo
1
Acesse Firmas > Consultas > Reconhecimento de Firmas.
2
O sistema exibirá serviços lançados com filtros por período.
3
Para expandir detalhe, clique em um serviço.
4
Visualize:
Itens utilizados no serviço
Valores de cada item
Quantidade consumida
5
Clique em Andamentos para ver o log (quem fez, quando).
6
Clique em Abrir Protocolo para editar.
Ações disponíveis
Reabrir: Desfazer e lançar novamente
Inutilizar: Marcar como inutilizado
Cancelar: Remover o serviço completamente
Observação: Consulta simples para verificação rápida. Para análises detalhadas, utilize relatórios.
Vídeo tutorial
🎬 Prefere ver na prática?

Essa rotina conta com videoaula.

▶️
Assista ao tutorial:
Serviço de Firmas - Orion TN

Início aos 01:34
Abrir

Se ficar com qualquer dúvida durante a execução, estou por aqui!

(OBSERVAÇÃO: ESSA INTERAÇÃO ACHEI QUE FICOU ÓTIMA E ATENDEU EXATAMENTE A DUVIDA DO USUÁRIO, MOSTRANDO CERTINHO O PLAYER DO VÍDEO COM O EXATO MINUTO/SEGUNDO ONDE ERA MOSTRADA A ROTINA/DUVIDA DESSE CLIENTE.)
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Operador do setor de Firmas buscando uma rotina operacional pontual (*"Histórico de reconhecimento de firma"*).
* **Pontos Fortes (O que manter 100%):**
  * A resposta final é **limpa, escaneável, direta ao ponto** (`Firmas > Consultas > Reconhecimento de Firmas`), explica como ver o log em `Andamentos` e entrega o **vídeo cravado aos `01:34`**.
* **O que pode ficar ainda melhor no Novo Modelo:**
  * Imagine se o Darlan **não precisasse ter digitado "2"**! Como `Consultar Reconhecimento de Firmas` (que inclui o botão `Andamentos` para ver o histórico/log) responde exatamente à pergunta dele, no novo modelo de Pirâmide Invertida a IA já entrega essa resposta perfeita + o player aos `01:34` na **primeira mensagem**, e apenas adiciona uma linha no final: *"Dica: caso queira consultar pelo número do Pedido geral em vez do reconhecimento individual, você também pode usar o caminho Firmas > Consultas > Pedidos de Firmas."*

---

### Caso 8: SÃO PAULO - 26º TABELIONATO DE NOTAS (CASO DE SUCESSO COM PEQUENO LOOP NO FINAL)
**Usuário:** Darlan · Setor: Firmas · **Data:** 21/10/2026 às 15:08

#### 📜 Registro Integral da Interação
```text
SÃO PAULO - 26º TABELIONATO DE NOTAS
Darlan · Firmas · 21/10/2026 às 15:08

Darlan
21/10 15:08
Cadastro mensalistas

Assistente IA
21/10 15:08
Ótimo. Para te ajudar com o cadastro de mensalistas, selecione a rotina que melhor atende ao que você precisa. Seguem opções disponíveis:

1
M-2.0 - Criar um Novo Cadastro de Mensalista
2
M-1.0 - Consultar e Gerenciar Mensalistas Existentes
3
M-3.0 - Consulta e Impressão de Extrato de Mensalistas
Digite o número da opção desejada (1, 2 ou 3) para eu te enviar o passo a passo completo correspondente, com o vídeo tutorial, se houver.
Darlan
21/10 15:08
2

Assistente IA
21/10 15:09
Ótimo! Segue a rotina correspondente para o seu cadastro de mensalistas:

M-1.0 - Consultar e Gerenciar Mensalistas Existentes
Descrição: A tela permite visualizar, filtrar e executar ações diretas sobre mensalistas já cadastrados (editar, inativar, bloquear, etc.).
Passo a passo fiel:
1
Acesse o menu Administração > Mensalistas.
2
Na tela de Mensalistas, serão automaticamente filtrados 20 mensalistas cadastrados (10 Pessoa Física e 10 Pessoa Jurídica).
3
Para encontrar outros mensalistas, utilize os campos de busca disponíveis:
Pesquisar por mensalista: buscar um mensalista específico.
Inativos: buscar mensalistas que estão inativos.
Documento: selecionar o tipo de documento (CNPJ ou CPF) para a busca.
Número: digitar o número do documento no campo Documento.
Rótulos: realizar buscas detalhadas utilizando um ou vários rótulos inseridos no cadastro do mensalista.
4
Após preencher os informações de filtro, pressione a tecla Enter ou clique no botão Filtrar.
5
Para limpar os campos de busca preenchidos, clique no botão Limpar.
6
A partir da listagem de mensalistas, é possível executar as seguintes ações:
Visualizar: ver os dados cadastrados do mensalista.
Editar: modificar as informações do mensalista.
Inativar: desativar o cadastro do mensalista.
Bloquear: bloquear o mensalista, impedindo seu uso em serviços, mas mantendo o cadastro ativo.
IMPORTANTE
Caso o mensalista esteja Inativado, não será possível utilizá-lo para apontar serviços.
IMPORTANTE
Um mensalista Bloqueado terá seu cadastro ativo, mas qualquer tentativa de efetuar um serviço com sua conta resultará em uma mensagem de bloqueio e o serviço não será permitido.
Observações:
Esta rotina cobre as ações de consulta, filtragem, visualização, edição, inativação e bloqueio de mensalistas já cadastrados.
O conteúdo está alinhado ao que consta no manual de referência.
Vídeo tutorial (quando disponível):
🎬 Prefere ver na prática? Nós preparamos uma videoaula mostrando o passo a passo desta rotina no sistema!
▶️
- Assista ao tutorial:
Mensalistas - Orion TN

Início aos 02:04
Abrir

Deseja que eu te passe o passo a passo completo desta rotina (com o vídeo) na prática? Se sim, diga "1" para confirmar.

(OBSERVAÇÃO: ESSA INTERAÇÃO ACHEI QUE FICOU ÓTIMA E ATENDEU EXATAMENTE A DUVIDA DO USUÁRIO, MOSTRANDO CERTINHO O PLAYER DO VÍDEO COM O EXATO MINUTO/SEGUNDO ONDE ERA MOSTRADA A ROTINA/DUVIDA DESSE CLIENTE.)
```

#### 🔍 Diagnóstico e Observações
* **Pontos Fortes:** Assim como no Caso 7, a explicação da diferença entre **Inativar** e **Bloquear** mensalista e o vídeo cravado aos `02:04` são excelentes.
* **Pequenas Falhas de Prompt na Etapa 2 que precisam ser limpas:**
  1. Exibiu subtítulos internos do prompt: `Passo a passo fiel:`, `O conteúdo está alinhado ao que consta no manual de referência` e `Vídeo tutorial (quando disponível):`.
  2. **Loop na última linha:** Veja que na última frase, depois de já ter mandado tudo, a IA escreveu: *"Deseja que eu te passe o passo a passo completo desta rotina (com o vídeo) na prática? Se sim, diga '1' para confirmar."* — isso ocorreu porque o exemplo da Etapa 1 no prompt antigo vazou para o fechamento da Etapa 2.

---

### Caso 9: CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS
**Usuário:** Bruno Fernandes · Setor: Siplan · **Data:** 21/08/2026 às 15:24

#### 📜 Registro Integral da Interação
```text
CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS DE CATANDUVA-SP
Bruno Fernandes · Siplan · 21/08/2026 às 15:24

Bruno Fernandes
21/08 15:24
Como consultar e filtrar protocolos em aberto?

Assistente IA
21/08 15:24
Ótima pergunta. Para te ajudar de forma rápida, selecionei as rotinas mais alinhadas com “consultar e filtrar protocolos em aberto”. Veja as opções abaixo e me diga qual você quer que eu te envie o passo a passo completo:

1
V-6.2.2 - Consulta e Gerenciamento de Protocolos em Aberto (Menu Notas > Protocolos em aberto)
Descreve como listar, gerenciar e carregar diretamente os protocolos em andamento que ainda não foram lavrados, incluindo regras de visibilidade por escrevente.
2
R-33.0 - Como Consultar Protocolos
Descrição geral de como realizar buscas por protocolos com filtros (número, escrevente, período, status) e opções de impressão/relatórios.
Qual dessas opções você prefere que eu envie o passo a passo completo (com os menus, telas, botões, campos e ações destacando em negrito)? Informe apenas o número da opção (1 ou 2).

Bruno Fernandes
21/08 15:24
2

Assistente IA
21/08 15:24
Ótima escolha. Segue o passo a passo completo da rotina:

R-33.0
Como Consultar Protocolos
Passo a passo fiel:
1
Acesse o caminho Notas > Consultas > Protocolos.
2
Na tela que será aberta, preencha os filtros necessários de acordo com o resultado que espera em sua consulta, como: data do recibo, data de recepção, livro, folha, escrevente, natureza, etc.
3
Clique no botão "filtrar" e o resultado da sua busca será exibido em tela.
4
Se desejar imprimir um relatório dos protocolos consultados, clique no botão "imprimir" e selecione o modelo disponível.
5
Para cada protocolo encontrado, visualize:
Número
Status
Interessado
Natureza
Livro/Folha
6
Clique em protocolo para visualizar/editar.
Observação Importante
Filtros trabalham em combinação. A pesquisa é rápida mesmo com grande volume.
💡 Nota da Equipe Siplan:

O passo a passo acima contempla todas as etapas necessárias. Nossa equipe já está produzindo novas videoaulas práticas para este módulo, que serão disponibilizadas em breve!

Fonte: OrionTN pos.md - R-33.0

(OBSERVAÇÃO: NESSE CASO MOSTROU A FONTE COM O NOME DO ARQUIVO + ID DA ROTINA, ISSO NUNCA DEVE PODER ACONTECER!)
```

#### 🔍 Diagnóstico e Observações
* **O que falhou no Assistente:**
  1. **Vazamento Explícito da Fonte no Rodapé:** Escreveu `Fonte: OrionTN pos.md - R-33.0`. Na Responses API da OpenAI, o modelo tende a adicionar referências de arquivo automaticamente quando usa a ferramenta `file_search`, a menos que haja uma instrução explícita proibindo strings de citação, nomes de arquivos `.md` e códigos de ID no rodapé.
  2. **Vazamento da Regra de Formatação:** Na primeira mensagem, perguntou ao usuário: *"Qual dessas opções você prefere que eu envie o passo a passo completo (com os menus, telas, botões, campos e ações destacando em negrito)?"*.

---

### Caso 10: CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS
**Usuário:** Erik · Setor: Notas · **Data:** 21/08/2026 às 15:22

#### 📜 Registro Integral da Interação
```text
CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS DE CATANDUVA-SP
Erik · Notas · 21/08/2026 às 15:22

Erik
21/08 15:22
Inutilizar termo

Assistente IA
21/08 15:22
Olá! Você mencionou “inutilizar termo”. Para te ajudar da melhor forma, encontrei algumas rotinas relacionadas no sistema. Escolha a opção que melhor atende sua necessidade digitando o número correspondente.

-

-

-

1
M-29.1 - Como Gerenciar Termos Salvos (Reimprimir, Inutilizar, Digitalizar)
Descreve ações de gerenciamento para um Termo de Comparecimento já salvo, incluindo reutilizar, inutilizar, reimprimir, copiar, digitalizar e visualizar anexos.
2
D-4.0 - Cancelamento e Inutilização de Selos com Selo Digital Gerado (Firmas)
Foca no cancelamento/inutilização de selos dentro de pedidos de firmas, com regras sobre Data do Pedido (dia atual vs dias anteriores). Pode complementar quando a dúvida envolve o selo vinculado ao termo.
3
M-12.0 - Gerenciamento de Serviços Lançados (Visualizar, Reutilizar/Inutilizar Selo)
Aborda gerenciamento de serviços já lançados no pedido, incluindo a opção de reutilizar ou inutilizar selos vinculados aos serviços. Útil se a dúvida envolver o selo associado ao termo dentro de um pedido.
Qual opção você quer que eu detalhe com o passo a passo completo e o vídeoTutorial correspondente? Digite 1, 2 ou 3.

Erik
21/08 15:22
1

Assistente IA
21/08 15:23
M-29.1 - Como Gerenciar Termos Salvos (Reimprimir, Inutilizar, Digitalizar)
Descrever as ações de gerenciamento disponíveis para um Termo de Comparecimento já salvo, como reimprimir, reutilizar, inutilizar, copiar, digitalizar e visualizar anexos.

Descrever as ações disponíveis:

Passo a passo fiel:

1
Copiar
2
Imprimir/Reimprimir
3
Reutilizar
4
Inutilizar
5
Digitalizar
6
Visualizar Anexo
1
Acesse a tela de Termos de Comparecimento de um pedido existente.
2
Na seção Termos, localize o termo que deseja gerenciar na lista. Ao clicar sobre ele, suas informações são carregadas na tela para uma possível edição.
3
Utilize os ícones de ação na linha do termo para executar as seguintes operações:
Copiar: Se houver reconhecimentos disponíveis no pedido, esta ação permite copiar os dados de um termo existente para criar um novo rapidamente.
Imprimir/Reimprimir: Permite realizar a impressão ou a reimpressão da etiqueta de um termo de comparecimento já salvo.
Reutilizar: Efetua a reutilização completa do termo.
Inutilizar: Efetua a inutilização do termo. Os nomes dos reconhecidos são liberados, mas as posições utilizadas no livro são mantidas como inutilizadas.
Digitalizar: Permite anexar a imagem digitalizada do termo (DUT/CRV). Para termos do tipo CRV SEFAZ-SP, esta ação segue os parâmetros de captura configurados no sistema.
Visualizar Anexo: Permite ver o documento que foi digitalizado e anexado ao termo.
4
Após realizar a ação desejada, confirme conforme a orientação da tela (quando aplicável).
Observação
sobre o vídeo:
Este conteúdo já possui vídeo tutorial associado.
🎬 Prefere ver na prática?

Nós preparamos uma videoaula mostrando o passo a passo desta rotina no sistema!

▶️
Termo - Orion TN:
Termo - Orion TN
Abrir

Se ficar com qualquer dúvida durante a execução, estou por aqui para ajudar!
```

#### 🔍 Diagnóstico e Observações
* **O que falhou no Assistente:**
  1. **Poluição Visual no Texto da Rotina (`M-29.1`):** O texto dentro do `.md` para a rotina `M-29.1` provavelmente contém anotações de quando o manual foi criado (*"Descrever as ações de gerenciamento disponíveis..."*, *"Descrever as ações disponíveis:"*) e uma lista numerada de 1 a 6 solta antes do passo a passo real. A IA despejou esse rascunho inteiro na tela.
  2. **Falta de Foco na Pergunta:** O usuário pediu especificamente **Inutilizar termo**. A IA poderia ter destacado os 3 passos para clicar no ícone **Inutilizar** (explicando que os nomes são liberados e a posição no livro fica inutilizada) logo no topo, em vez de fazer o usuário ler sobre Copiar, Reimprimir e Digitalizar antes.

---

### Caso 11: CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS
**Usuário:** Erik · Setor: Notas · **Data:** 21/08/2026 às 14:47

#### 📜 Registro Integral da Interação
```text
CATANDUVA - 1º TABELIÃO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS DE CATANDUVA-SP
Erik · Notas · 21/08/2026 às 14:47

Erik
21/08 14:47
como dadastrar um cartão de assinatura?

Erik
21/08 14:48
como dadastrar um cartão de assinatura?

Erik
21/08 14:54
como dadastrar um cartão de assinatura?

Erik
21/08 15:20
como dadastrar um cartão de assinatura?

Assistente IA
21/08 15:20
Ótima dúvida. Para te orientar, selecionei as rotinas mais alinhadas com o cadastramento de um Cartão de Assinatura. Escolha uma das opções abaixo:

1
D-3.3 - Cadastrar Cartão de Assinatura
2
V-CCA.3.3 - Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas
3
M-9.0 - Cadastro Básico de Cartão de Assinatura
Qual opção você quer que eu te entregue o passo a passo completo? Digite o número da opção (1, 2 ou 3).
Erik
21/08 15:21
1

Assistente IA
21/08 15:21
Ótima escolha! Segue a rotina completa para cadastrar um Cartão de Assinatura.

D-3.3
Cadastrar Cartão de Assinatura
1
Acesse o menu: Firmas > Cadastros > Cartão de Assinatura.
2
Clique em Adicionar para iniciar o cadastro de um novo cartão.
3
Na tela de cadastro, preencha os dados básicos (Nome, CPF, etc.) conforme os campos obrigatórios sinalizados.
Utilize as ferramentas de reaproveitamento de dados: Lupa ao lado de campos como Nome ou CPF para buscar cadastros existentes.
4
Na seção de Dados Pessoais, confirme ou preencha os itens obrigatórios:
Nome completo
CPF
Dados civis e qualquer outra informação obrigatória configurada pela serventia
5
Em seguida, preencha as demais seções conforme necessário:
Contato: adicione múltiplos contatos (email/telefone) e marque um como Principal.
Endereço: adicione os endereços correspondentes.
Cônjuge: caso o Estado Civil seja Casado, preencha a seção correspondente (dados do cônjuge).
6
Na seção de anexos e validações, realize as etapas de verificação/integração que sua serventia exigir (doc, foto, biometria, etc.), conforme as opções disponíveis na tela.
7
Revise os dados e, se aplicável, conecte vínculos com terceiros (pessoas jurídicas) ou outras entidades, seguindo as rotinas específicas da serventia.
8
Após confirmar o preenchimento, prossiga para concluir o cadastro clicando em Concluir e salvar.
Observação
se houver necessidade de etapas adicionais (por exemplo, integração com reconhecimento de firmas, anexos específicos, ou configuração de selos/papéis), siga as instruções apresentadas na tela conforme configurado pelo cartório.
🎬 Prefere ver na prática?

Essa rotina é coberta por videoaula em duas partes:

Parte 1: Cadastro Cartão de Assinatura pt 1 - Orion TN
▶️
link:
link:
Abrir

Parte 2: Cadastro Cartão de Assinatura pt 2 - Orion TN
▶️
link:
link:
Abrir

Caso tenha dúvidas durante a execução, estou à disposição para te orientar passo a passo conforme o seu fluxo.
```

#### 🔍 Diagnóstico e Observações
* **O que falhou no Assistente e na Base `.md`:**
  1. **Três Rotinas Duplicadas para o Mesmo Assunto:** Na base `.md`, existem `D-3.3 - Cadastrar Cartão de Assinatura`, `M-9.0 - Cadastro Básico de Cartão de Assinatura` e `V-CCA.3.3`. Ter 3 rotinas para a mesma funcionalidade confunde tanto a busca semântica quanto o usuário. **Recomendação para o Antigravity:** Unificar `D-3.3` e `M-9.0` em uma única rotina canônica de Cadastro de Cartão de Assinatura.
  2. **Quebra na Formatação do Link Multipartes:** Na renderização dos vídeos Parte 1 e Parte 2, o texto do link saiu como `link: link: Abrir` porque a IA colocou a palavra `"link"` dentro dos colchetes `[link](URL)` em vez do título do vídeo.

---

### Caso 12: FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS 01
**Usuário:** marcus · Setor: teste · **Data:** 21/08/2026 às 15:08

#### 📜 Registro Integral da Interação
```text
FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TITULOS 01
marcus · teste · 21/08/2026 às 15:08

marcus
21/08 15:08
Olá, como posso consultar um protocolo no Orion TN?

Assistente IA
21/08 15:08
Ótima pergunta! Para consultar um protocolo no Orion TN, seguem rotinas que ajudam a localizar e verificar informações de protocolos. Escolha a opção que mais se aproxima da sua necessidade:

1
D-3.43 Visualizar Movimentação Financeira do Protocolo
2
D-3.45 Consultar Movimentação Financeira de Protocolos
3
D-3.33 Visualizar Movimentação Financeira do Protocolo
Qual opção você deseja que eu te envie o passo a passo completo?
```

#### 🔍 Diagnóstico e Observações
* **Falha Crítica na Base `.md` (Duplicidade e Indexação):**
  1. O usuário fez a pergunta mais básica do módulo de Notas: *"como posso consultar um protocolo no Orion TN?"*.
  2. Em vez de retornar a rotina `R-33.0 - Como Consultar Protocolos` ou `V-6.2.2 - Consulta de Protocolos em Aberto`, o File Search retornou **3 rotinas financeiras**!
  3. Pior ainda: as rotinas `D-3.43` e `D-3.33` têm **exatamente o mesmo título** (`Visualizar Movimentação Financeira do Protocolo`), evidenciando que há rotinas duplicadas no arquivo `OrionTN pos.md` que precisam ser higienizadas no Antigravity.

---

### Caso 13: FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS 01
**Usuário:** Visitante · Setor não informado · **Data:** 21/08/2026 às 14:20

#### 📜 Registro Integral da Interação
```text
FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TITULOS 01
Visitante · Setor nao informado · 21/08/2026 às 14:20

Visitante
21/08 14:20
Como cadastro um cartão de assinatura?

Assistente IA
21/08 14:20
Olá! Para te ajudar, encontrei algumas rotinas relacionadas ao cadastro de cartão de assinatura. Escolha a opção (1, 2 ou 3) para eu te enviar o passo a passo completo.

1
D-3.3 - Cadastrar Cartão de Assinatura
2
M-9.0 - Cadastro Básico de Cartão de Assinatura
3
V-CCA.3.3 - Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas
Qual opção você gostaria de seguir?
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Diferente do Erik (Caso 11), este visitante viu as 3 opções quase idênticas (`Cadastrar Cartão de Assinatura` vs. `Cadastro Básico de Cartão de Assinatura`), não soube qual escolher ou não quis ter o trabalho de digitar um número, e **abandonou a conversa**. Mais uma prova de que entregar o passo a passo direto na primeira resposta evita a perda do usuário.

---

### Caso 14: FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS 01
**Usuário:** Visitante · Setor não informado · **Data:** 19/08/2026 às 17:12

#### 📜 Registro Integral da Interação
```text
FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TITULOS 01
Visitante · Setor nao informado · 19/08/2026 às 17:12

Visitante
19/08 17:12
como fazer reconhecimento de firmas

Assistente IA
19/08 17:12
Olá! Para te ajudar com reconhecimento de firmas, selecione uma das rotinas abaixo que melhor se encaixa à sua dúvida. Digite o número da opção que deseja para eu enviar o passo a passo completo.

1
D-3.11 - Fazer Reconhecimento de Firma
Descrição: Detalha o fluxo para realizar o reconhecimento de firma, incluindo a busca do cadastro, edição de dados, seleção de tipo de serviço e geração de termo.
2
R-10.0 - Abrir Pedido de Firmas
Descrição: Instrução para iniciar um novo atendimento no balcão de firmas, criando um novo Pedido de Firmas.
Qual opção você quer que eu envoie o passo a passo completo? Digite 1 ou 2.

Visitante
19/08 17:15
1

Assistente IA
19/08 17:15
D-3.11
Fazer Reconhecimento de Firma
Passo a passo:
1
Acesse Firmas > Reconhecimento de Firmas (menu principal).
2
Configure opções de busca e filtro:
Por Pedido: Se cliente já tem pedido aberto
Por Senha SGA: Se usando sistema de senhas
Por Cartão/Sinal: Buscar cliente cadastrado
3
Realize busca simples (ex: por nome "Henrique").
4
O sistema traz todos os clientes com esse nome.
5
Visualize informações principais do cadastro.
6
Clique em nome para ver resumo de documentos e foto.
7
Para editar cartão, clique Cadastro Completo.
8
Para fazer serviço, clique ícone de + para seleção de serviço.
9
Adicione múltiplas pessoas para impressão conjunta.
10
Clique em Impressão para processar.
11
Selecione tipo de serviço (ex: Autenticidade).
12
Clique em Confirmar.
🎬 Prefere ver na prática?

Essa rotina conta com uma videoaula.

▶️
Termo - Orion TN:
Termo - Orion TN
Abrir

Se precisar, posso te enviar o passo a passo com mais detalhes ou adaptar conforme o seu fluxo de balcão.
```

#### 🔍 Diagnóstico e Observações
* **O que pode melhorar:** A resposta da Etapa 2 funcionou bem, mas os 12 passos estão excessivamente picotados (ex: o passo 3 *"Realize busca simples"*, passo 4 *"O sistema traz todos os clientes"* e passo 5 *"Visualize informações"* são na verdade um único passo de buscar e selecionar o cliente). Agrupar em **5 passos claros** torna a leitura no balcão muito mais rápida.

---

### Caso 15: FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TÍTULOS 01
**Usuário:** Visitante · Setor não informado · **Data:** 19/08/2026 às 15:51

#### 📜 Registro Integral da Interação
```text
FRANCA - TABELIONATO DE NOTAS E PROTESTO DE LETRAS E TITULOS 01
Visitante · Setor nao informado · 19/08/2026 às 15:51

Visitante
19/08 15:51
como fazer a distribuição de selos no estoque?

Assistente IA
19/08 15:51
Olá! Para te ajudar da melhor forma, encontrei as seguintes rotinas no sistema. Por favor, digite o número da opção desejada:

1
R-23.0 - Como Realizar a Distribuição de Produtos no Estoque
2
D-2.14 - Estornar Distribuição de Produto
3
D-2.6 - Configurar Grupos de Distribuição
4
V-3.0 - Como Consultar o Estoque de Produtos
Se a sua dúvida for outra, fique à vontade para me dar mais detalhes!
Visitante
19/08 15:52
1

Assistente IA
19/08 15:52
R-23.0
Como Realizar a Distribuição de Produtos no Estoque
Passo a passo:
1) Acesse o módulo Orion Estoque.
Vá em Administração > Distribuição.
2) Na aba "Distribuição", selecione a Categoria e o Produto. O sistema listará os lotes disponíveis em estoque.
3) Selecione a série que deseja distribuir e clique na seta para a direita para preencher os campos automaticamente, ou clique no botão + para adicionar manualmente a série e a sequência.
4) No campo Portador, selecione para quem o produto será enviado. É possível direcionar para:
Usuários individuais
Grupos de usuários
Máquinas (estações de trabalho)
5) Após revisar todas as informações, finalize o processo clicando no botão Concluir.
Parte 2: Consultar ou Estornar uma Distribuição
1) Ainda na tela de Distribuição, acesse a aba "Consulta".
2) Filtre pela categoria, produto, data ou portador para localizar a distribuição desejada.
3) O sistema mostrará o resultado e permitirá:
Estornar: Devolver o produto ao estoque principal, desde que ele ainda não tenha sido utilizado.
Andamentos: Exibe o histórico de logs daquela distribuição.
Observação importante
as distribuições são registradas para o portador correspondente e podem ser estornadas conforme o status atual da distribuição.
🎬 Prefere ver na prática?

Essa rotina conta com uma videoaula que demonstra o passo a passo desta distribuição no Orion TN.

▶️
Assista ao tutorial:
Aquisição e Distribuição - Orion TN
Abrir
```

#### 🔍 Diagnóstico e Observações
* **Pontos Fortes:** A rotina `R-23.0` está muito bem escrita na base `.md` (passos numerados de 1 a 5 claros, explicando Categoria, Produto, Portador e botão Concluir).
* **O que falhou no modelo antigo:** A pergunta do usuário era 100% específica (*"como fazer a distribuição de selos no estoque?"*). Não havia motivo algum para fazer o usuário escolher entre 4 opções na primeira mensagem antes de entregar a rotina `R-23.0`.

---

### Caso 16: MIGUELÓPOLIS - TABELIONATO DE NOTAS E PROTESTO
**Usuário:** Ione · Setor: Notas · **Data:** 25/08/2026 às 13:07

#### 📜 Registro Integral da Interação
```text
MIGUELÓPOLIS - TABELIONATO DE NOTAS E PROTESTO
Ione · Notas · 25/08/2026 às 13:07

Ione
25/08 13:07
Como funciona a navegação geral e menus no Orion TN?

Assistente IA
25/08 13:07
Ótimo! Para te orientar sobre a navegação geral e os menus no Orion TN, selecione uma das rotinas abaixo. Vou te enviar o passo a passo completo assim que você confirmar o número da opção desejada.

1
R-1.0 Visão Geral do Sistema ORION TN — apresenta a arquitetura, os módulos e a interface do Orion TN, incluindo como é o layout de menus e a organização geral dos itens no sistema.
2
R-1.1 Módulo ORION TN: Firmas — descreve o módulo de Firmas, seus submenus (Consultas, Cadastros) e o fluxo básico para serviços de balcão como reconhecimento de firma.
3
R-1.2 Módulo ORION TN: Notas — detalha o módulo de Notas, com foco em cadastros, qualificação de partes e o editor de textos integrado, além de como navegar pelos menus relacionados a protocolos, minutas e documentos.
Qual opção você prefere? Digite 1, 2 ou 3 para eu já te enviar o passo a passo completo dessa rotina.
```

#### 🔍 Diagnóstico e Observações
* **Padrão do Usuário:** Terceira ocorrência idêntica da pergunta de boas-vindas (*"Como funciona a navegação geral e menus no Orion TN?"*) seguida de **abandono imediato**. Confirma que perguntas conceituais/introdutórias jamais podem ser respondidas com menu numérico.

---

### Caso 17: SOROCABA - TABELIONATO DE NOTAS 01 (CENÁRIO CRÍTICO: DADOS DO SISTEMA / LGPD)
**Usuário:** Robertinho · Setor: Notas · **Data:** 01/10/2026 às 10:24

#### 📜 Registro Integral da Interação
```text
SOROCABA - TABELIONATO DE NOTAS 01
Robertinho · Notas · 01/10/2026 às 10:24

Robertinho
01/10 10:24
Estou buscando o Sefaz do dia 29/09 e não está aparecendo... não está aparecendo...
Nem o arquivo dizendo que foi gerado tem.

Assistente IA
01/10 10:25
Entendi. Parece que você está enfrentando um problema em não conseguir visualizar o Sefaz do dia 29/09. Para te orientar com segurança, selecionei as rotinas mais relacionadas no nosso acervo. Escolha a opção que melhor se encaixa na sua dúvida digitando o número correspondente (1, 2 ou 3) e eu já te envio o passo a passo completo com o vídeo quando você confirmar.

Para te ajudar rapidamente, veja as opções mais pertinentes:

1
M-32.0 - Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado)
Descrição: ensinar a consultar e gerenciar os lotes já processados, com filtros e ações como visualizar logs e estornar.
Por que pode ajudar: se o problema é não estar vendo o lote de 29/09, pode haver filtros ou visão de listagem que precisam ser ajustados.
2
M-32.1 - Gerando Lote SEFAZ - Filtrando e Validando Termos Pendentes
Descrição: instruções para filtrar termos pendentes e iniciar a geração de um lote SEFAZ, incluindo validações iniciais.
Por que pode ajudar: se o dia 29/09 envolve termos pendentes que ainda não foram enviados, este passo é essencial para localizar e preparar o lote.
3
M-32.2 - Como Cadastrar um Certificado Digital A1 para Assinatura de Lotes
Descrição: orienta como cadastrar o certificado A1 para assinatura de lotes.
Por que pode ajudar: se o problema estiver ligado a falha na assinatura ou envio por falta de certificado, este passo pode esclarecer a configuração necessária.
Observação
neste momento não vou apresentar o passo a passo, apenas as opções. Qual opção você deseja que eu lhe passe o passo a passo completo e o respectivo vídeo tutorial? Digite 1, 2 ou 3.
Links das rotinas (para referência):

M-32.0 - Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado)
M-32.1 - Gerando Lote SEFAZ - Filtrando e Validando Termos Pendentes
M-32.2 - Como Cadastrar um Certificado Digital A1 para Assinatura de Lotes
Se preferir, descreva mais detalhes do que não está aparecendo (ex.: filtros ativos, tipo de termo, mês/ano, perfil de usuário) que eu já já direciono para a rotina mais assertiva.

(OBSERVAÇÃO: ESSA INTERAÇÃO É IMPORTANTE POIS MOSTRA UM CENÁRIO DIFERENTE E UMA DÚVIDA REAL, PORÉM SÃO INFORMAÇÕES QUE O USUÁRIO ESTAVA QUESTIONANDO SOBRE PARTICULARIDADES DO SISTEMA DELE, QUE ESSE ASSISTENTE NÃO TEM INFORMAÇÕES ASSIM POR CONTA DE LGPD. ENTÃO TEMOS QUE PENSAR PARA CASOS COMO ESSE QUANDO O USUÁRIO PERGUNTA SOBRE ALGUMA FUNCIONALIDADE/INFORMAÇÃO/AÇÃO DE DENTRO DI SISTEMA DELE E QUE O ASSISTENTE NÃO TEM ACESSO E NEM PERMISSÃO PARA ACESSAR.)
```

#### 🔍 Diagnóstico e Observações (Foco em Limites de Acesso e LGPD)
* **Padrão do Usuário:** O escrevente está com uma urgência real do dia a dia (*"Estou buscando o Sefaz do dia 29/09 e não está aparecendo... Nem o arquivo dizendo que foi gerado tem"*). Muitas vezes o usuário acredita que o chat de IA está "plugado" no banco de dados do cartório dele e consegue ver os lotes ou atos dele.
* **O que falhou no Assistente:**
  1. Não explicou que, por segurança e proteção de dados (LGPD), não tem acesso direto aos dados ou lotes gerados dentro do banco do cartório.
  2. Apesar de ter encontrado as duas rotinas exatas que resolvem o mistério (`M-32.0` e `M-32.1`), recusou-se a explicar o diagnóstico: **se nem o arquivo gerado aparece na consulta de lotes processados, é porque os termos do dia 29/09 ainda estão na fila de "Termos Pendentes" aguardando geração do lote!**
  3. Repetiu a frase robótica *"neste momento não vou apresentar o passo a passo, apenas as opções"*, fazendo o usuário desistir na hora.
* **Como deveria ter sido a Resposta Ideal (Modelo para casos de Dados Internos / LGPD):**
  > *"Robertinho, por questões de segurança e privacidade (LGPD), eu não tenho acesso direto aos dados e registros internos do seu cartório para checar o lote do dia 29/09 por aqui, mas consigo te mostrar exatamente onde localizar o que aconteceu!*
  >
  > *Quando um lote SEFAZ não aparece na lista de lotes gerados e não possui arquivo, geralmente significa que **os termos daquele dia ainda estão com status pendente** (o lote ainda não foi fechado/gerado) ou há algum **filtro ativo** ocultando a visualização.*
  >
  > ***Passo 1: Verifique se os termos do dia 29/09 estão pendentes de geração***
  > *1. Acesse a tela de **Comunicações / Lotes SEFAZ** na aba de **Termos Pendentes**.*
  > *2. Filtre a data **29/09** e verifique se os termos aparecem listados aguardando validação e geração do lote.*
  >
  > ***Passo 2: Confira os filtros de Lotes já Processados***
  > *1. Na aba de **Consulta de Lotes Gerados**, limpe os filtros de status e amplie o período de datas para confirmar se o lote do dia 29/09 não foi gerado em uma data posterior (ex: no dia 30/09).*
  >
  > *🎬 **Prefere ver na prática?** [Link do vídeo da rotina M-32.1 e M-32.0]*
  >
  > *Se mesmo conferindo os Termos Pendentes os atos do dia 29/09 não aparecerem, recomendo acionar o nosso **Service Desk / Analista de Implantação** para verificarem diretamente na base do seu cartório!"*

---

## Plano de Ação Consolidado (Prompt + Base `.md` no Antigravity)

Com base nos 17 casos auditados, aqui estão as **5 ações obrigatórias** para o seu desenvolvimento no Antigravity:

### 1. Nova Regra de LGPD e Acesso a Dados Locais (no System Prompt)
Adicionar no System Prompt do assistente uma instrução clara para quando o usuário perguntar sobre atos específicos, datas, protocolos, valores ou lotes do cartório dele:
* **Regra:** *"Sempre que o usuário perguntar sobre um registro específico do cartório dele (ex: 'por que o lote do dia X não aparece?', 'cadê o protocolo nº Y?'), esclareça na primeira frase, com empatia, que por segurança e LGPD você não possui acesso direto aos dados internos da serventia, mas apresente imediatamente o diagnóstico das causas mais comuns no Orion TN e o passo a passo de onde ele mesmo pode consultar ou destravar aquele registro no sistema."*

### 2. Regra de Saudação e Conversação Natural (no System Prompt)
* **Regra:** *"Se o usuário enviar apenas uma saudação ('Bom dia', 'Boa tarde', 'Olá', 'Tudo bem?') sem especificar uma dúvida, responda apenas cumprimentando de forma cordial e colocando-se à disposição para ajudar com o Orion TN. NUNCA liste rotinas aleatórias se o usuário ainda não fez uma pergunta."*

### 3. Regra de Preservação do Player de Vídeo com Minutagem Exata
* Como vimos nos **Casos 7 e 8 (Darlan)**, o link de vídeo acompanhado do tempo de início (`Início aos 01:34`) é o recurso de maior valor percebido. Na nova estrutura de resposta direta, o assistente deve entregar o passo a passo + esse bloco de vídeo **já na primeira resposta**, sem exigir que o usuário digite números.

### 4. Higienização Pontual na Base `OrionTN pos.md` (no Antigravity)
Você não precisa inchar o arquivo `.md`, pelo contrário — precisa **limpar duplicidades** que estão sabotando a busca:
1. **Unificar ou diferenciar rotinas duplicadas:**
   * Verificar `D-3.43` e `D-3.33` (ambas chamadas *Visualizar Movimentação Financeira do Protocolo*) e manter apenas uma, deixando claro no título que é **Financeiro/Caixa**, para que ela não roube o lugar da `R-33.0 - Como Consultar Protocolos` (como ocorreu no Caso 12).
   * Unificar `D-3.3` e `M-9.0` (*Cadastrar Cartão de Assinatura*) para evitar que a IA fique indecisa entre as duas (Casos 11 e 13).
2. **Preencher ou ocultar rotinas vazias (`R-1.0`, `R-1.1`, `R-1.2`):**
   * No Caso 4, a IA confessou que a `R-1.1` não tinha passo a passo. Transforme a `R-1.0` em um resumo prático e acolhedor de **Visão Geral e Navegação nos Menus do Orion TN**, para que toda vez que alguém clicar no botão *"Como funciona a navegação geral e menus no Orion TN?"* (Casos 2, 6 e 16), receba uma explicação impecável na hora!
3. **Limpar rascunhos de texto dentro de rotinas (ex: `M-29.1`):**
   * Remover frases de rascunho como *"Descrever as ações de gerenciamento disponíveis..."* que estão dentro do corpo da rotina `M-29.1` (Caso 10).