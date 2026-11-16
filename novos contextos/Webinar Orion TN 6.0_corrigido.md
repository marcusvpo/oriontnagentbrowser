# Webinar Orion TN 6.0 — Apresentação Técnica e Novidades da Versão

> **Data do Evento:** Novembro de 2026  
> **Apresentadores e Especialistas Técnicos:** Renato (**Siplan**), Luan (Especialista de Sistemas e Produto **ORION TN**), Vinícius Silva (Especialista de Sistemas e Integrações **Siplan**), Marcos (**Siplan**) e Diego (**Siplan**).  
> **Participantes com Intervenções / Perguntas:** Erika, Lucas (Primeiro Tabelionato de Notas) e Dra. Marília.  
> **Público-Alvo:** Tabeliães, Substitutos, Escreventes, Gestores Operacionais e Financeiros de **Tabelionatos de Notas**.  
> **Objetivo:** Registro documental técnico purificado, cronológico e normalizado das inovações apresentadas na versão 6.0 do ecossistema **ORION TN**, com aplicação rigorosa do Glossário Notarial e Corporativo da **Siplan**.

---

### [00:00 - 01:25] Abertura e Apresentação da Versão 6.0 do ORION TN

**Renato (Siplan):**  
Boa tarde a todos! Sejam muito bem-vindos. Convidamos vocês hoje para conhecer formalmente a nova versão do **ORION TN** — a versão 6.0. Esta grande atualização traz uma série de novos recursos, automações e melhorias de arquitetura que serão detalhadas hoje à tarde pela nossa equipe de produto, representada pelo Luan e pelo Vinícius Silva, que são os responsáveis diretos pela evolução do sistema.

Gostaria de passar a palavra a eles para as saudações iniciais e para darmos início imediato à apresentação técnica. Vale ressaltar que disponibilizaremos a gravação completa para os colegas que precisarem sair antecipadamente ou que ingressarem na sala ao longo da transmissão. Desejo a todos uma excelente demonstração!

**Luan (Especialista Orion TN):**  
Obrigado, Renato! Boa tarde a todos os participantes. Eu e o Vinícius Silva integramos o time de desenvolvimento e engenharia de sistemas do **ORION TN**. Hoje, conduziremos uma demonstração prática das principais rotinas agregadas à versão 6.0. 

Essa versão já se encontra em operação assistida em ambiente real de produção em diversas serventias parceiras selecionadas. Com os excelentes resultados de estabilidade e performance obtidos, iniciamos agora o cronograma oficial de expansão para toda a nossa carteira de clientes. Vou compartilhar a minha tela para iniciarmos a apresentação dos módulos e fluxos de trabalho.

---

### [01:26 - 02:45] Arquitetura Nativa Web e Eficiência de Infraestrutura

**Luan (Especialista Orion TN):**  
Esta é a tela inicial do ecossistema **ORION TN**. Aqueles que já utilizam a nossa ferramenta no dia a dia reconhecem facilmente o ambiente; para os colegas que estão tendo o primeiro contato, esta é a visão operacional primária.

A plataforma é composta por módulos especializados e integrados:
* **ORION TN**: Módulo central de lavratura de atos notariais, gestão de protocolos e índices da serventia;
* **ORION Caixa**: Gestão financeira, faturamento, recebimento de emolumentos, depósitos prévios e conciliação;
* **ORION Stock** (ou **ORION Estoque**): Controle rigoroso de estoque de insumos, selos físicos e materiais;
* **ORION GED**: Gestor autônomo e repositório central de documentos eletrônicos da serventia;
* **Módulo de Gestão de Livros**: Controle de aberturas, encerramentos, numeração de folhas e acervo encadernado.

Um dos pilares estruturais da versão 6.0 é ser uma solução **100% nativa Web**. Isso significa que o sistema opera com total compatibilidade nos navegadores padrão de mercado, como Google Chrome, Microsoft Edge ou Mozilla Firefox, sem a necessidade de instalações pesadas ou configurações locais nas estações de trabalho do cartório.

No nível de infraestrutura, o sistema roda integralmente em ambiente de servidores **Linux** e utiliza o banco de dados relacional **PostgreSQL**. Esta decisão técnica traz uma vantagem financeira e operacional expressiva para o **Tabelionato de Notas**: elimina por completo a necessidade de aquisição de licenças proprietárias dispendiosas de Windows Server ou Microsoft SQL Server — um custo expressivo que ainda é imposto pela grande maioria das ferramentas legadas do mercado.

Na interface principal, o usuário dispõe de uma barra universal de pesquisa para localizar qualquer rotina operacional com rapidez, como a busca imediata por atos, participantes ou protocolos.

---

### [02:46 - 04:38] Gestão Visual por Dashboards: Atos Protocolares e Parceiros Comerciais

**Luan (Especialista Orion TN):**  
Desenvolvemos para a versão 6.0 uma suíte avançada de dashboards analíticos que conferem visibilidade estratégica sobre a produção da equipe e o ciclo de vida dos atos praticados na serventia.

O primeiro painel em destaque é o **Dashboard de Atos Protocolares**, desenhado no formato Kanban. Nesse quadro, os protocolos são organizados por estágios de execução, permitindo filtrar e acompanhar:
* A natureza jurídica de cada ato (ex.: **Escritura de Compra e Venda**, Doação, Inventário, **Procuração**);
* A quantidade de dias em aberto de cada protocolo, garantindo o controle rigoroso do prazo legal regulamentar de até 60 dias para a conclusão da prática do ato notarial;
* O montante dos emolumentos calculados;
* O saldo financeiro vinculado a cada ato, com controle em tempo real dos valores ingressados a título de depósito prévio.

O painel oferece filtros dinâmicos por equipes de trabalho, por status consolidado e por atendentes/escreventes responsáveis.

Outra grande novidade operacional é a rotina de **Intermediadores e Parceiros Comerciais**. Muitas vezes, uma transação imobiliária ou ato notarial conta com a atuação decisiva de um escritório de advocacia, uma corretora ou uma imobiliária parceira. Esses agentes não figuram como outorgantes ou outorgados no texto da **Escritura**, mas foram os responsáveis pela articulação inicial do negócio. Com esse novo recurso, o escrevente vincula formalmente esses parceiros ao protocolo, permitindo à serventia acompanhar métricas de relacionamento comercial e histórico de originação de atos.

---

### [04:39 - 06:40] Painel de Escrituras para Registro (ONR/SAEC/RI) e Central de Obrigações Legais

**Luan (Especialista Orion TN):**  
Apresentamos em seguida o **Dashboard de Escrituras Enviadas para Registro**. Essa rotina gerencia a interoperabilidade direta do **ORION TN** com as plataformas de centrais eletrônicas, em especial via API do Operador Nacional do Sistema de Registro Eletrônico de Imóveis (**ONR**) e do **SAEC** (Serviço de Atendimento Eletrônico Compartilhado).

A partir do momento em que a **Escritura** é transmitida ao **Registro de Imóveis (RI)** competente, o **ORION TN** atualiza automaticamente o status da tramitação em tempo real:
1. Captura e registra de forma automática o número do protocolo/prenotação gerado no **Registro de Imóveis (RI)**;
2. Controla o envio de notificações e notas devolutivas, sinalizando caso a serventia predial formule alguma exigência registral;
3. Atualiza o status quando o ato for efetivamente registrado na matrícula imobiliária;
4. Registra a data e o horário da entrega formal do ato concluído às partes interessadas.

Complementando a camada de conformidade, exibimos o **Dashboard de Comunicações Legais e Obrigações Fiscais**, que organiza o cumprimento dos deveres normativos do cartório perante as diversas centrais e órgãos fiscalizadores:
* **SEFAZ**: Declarações e guias tributárias estaduais de **ITCMD**;
* **DOI**: Declaração sobre Operações Imobiliárias encaminhada à Secretaria da Receita Federal do Brasil;
* **SIGNO**: Sistema Integrado de Gestão Notarial, abrangendo os módulos obrigatórios:
  * **CTO**: Comunicação de Transmissão Onerosa (dados para prefeituras e controle de **ITBI**);
  * **CEP**: Comunicação de Escrituras e Procurações;
  * **CED**: Comunicação de Escrituras de Doação;
  * **CTP**: Comunicação de Transmissão e Partilha (o mais recente mecanismo implementado, correlato à **DOI** em nível de central);
* **CENSEC**: Central Notarial de Serviços Compartilhados (módulos RCTO, CESDI, CEP e CNSIP).

O sistema conta com um motor diário refinado de validação automática sobre todo o acervo de protocolos lavrados. Os atos são classificados dinamicamente em quatro colunas:
1. **Não Validados**: Atos em processo de análise cadastral preliminar;
2. **Prontos para Envio**: Protocolos com 100% dos campos de qualificação, valores e dados fiscais preenchidos em total conformidade para transmissão;
3. **Atrasados**: Atos cujo prazo regulamentar legal de envio à respectiva central expirou;
4. **Com Pendências**: Protocolos que apresentam incongruências ou ausência de dados obrigatórios exigidos pela central reguladora.

Ao clicar sobre qualquer protocolo com pendência, um painel lateral retrátil é aberto instantaneamente, indicando com precisão técnica quais campos estão impedindo a transmissão perante aquela central específica e qual é o prazo legal remanescente para a regularização. O escrevente pode clicar diretamente no card para ser direcionado à tela de edição do protocolo, efetuar a correção imediata e liberar a transmissão em poucos segundos.

---

### [06:41 - 11:38] Inteligência Artificial no Protocolo: OCR, Extração Documental e Compliance (PEP, COAF, SIGNO-CEP)

**Luan (Especialista Orion TN):**  
Passamos agora a detalhar as rotinas de **Inteligência Artificial (IA)** do **ORION TN**. Embora recursos inteligentes já fizessem parte do nosso roadmap anterior, na versão 6.0 realizamos um salto significativo de estabilização e precisão, incorporando nativamente os modelos de última geração do **Gemini** (Google) e da **OpenAI**, integrados a uma engenharia proprietária de prompts estruturados desenvolvida pela equipe da **Siplan**, que soma anos de know-how acumulado no segmento notarial e registral.

A Inteligência Artificial atua de ponta a ponta: desde o **Balcão de Firmas**, na captura e abertura de cartões de autógrafo/fichas de firma (conforme detalharemos adiante), até a abertura e qualificação minuciosa das partes dentro do protocolo notarial.

Ao simular a abertura de um protocolo de **Escritura de Compra e Venda**, o sistema estrutura o atendimento em uma interface ágil de cards organizacionais. Quando expandimos um card de participação, o sistema sugere as qualificações padrão (outorgante vendedor, outorgado comprador), permitindo adicionar livremente quaisquer participações específicas (intervenientes, anuentes, procuradores, credores fiduciários, etc.).

Logo na inserção dos dados básicos dos participantes, o **ORION TN** dispara validações automatizadas de conformidade e integridade registral:
1. **Consulta PEP na Base da Receita Federal**: O sistema verifica em tempo real se o documento consultado pertence a uma **Pessoa Exposta Politicamente (PEP)**. No teste ao vivo demonstrado, inserimos um documento de autoridade pública (Ministro Alexandre de Moraes), e o sistema classificou a parte imediatamente como PEP, enquadrando o ato nas exigências normativas obrigatórias de comunicação junto ao **COAF** (Conselho de Controle de Atividades Financeiras), nos termos do **Provimento** aplicável do CNJ.
2. **Consulta Automatizada à SIGNO-CEP**: O sistema cruza os dados do participante com a base de dados da Central de Escrituras e Procurações para apurar se aquele nome ou documento possui qualquer comunicado de indisponibilidade, perda de validade, advertência ou restrição encaminhada pela Corregedoria Geral da Justiça (**TJ**).

Para o cadastramento dos participantes, o escrevente não precisa mais digitar manualmente campo a campo. Ele pode utilizar a funcionalidade de **Importação por Inteligência Artificial**, de forma unitária ou em lote com múltiplos arquivos:
* O operador anexa o arquivo digital (por exemplo, a imagem ou PDF de uma CNH, RG ou passaporte);
* O motor de **OCR** do sistema processa o arquivo, extrai as cadeias de texto e as submete ao prompt estruturado da **Siplan**;
* O sistema identifica e preenche automaticamente: nome civil completo, número de RG com órgão expedidor e UF, CPF, data de nascimento, filiação materna e paterna, número do registro da CNH, data da primeira habilitação e validade;
* O escrevente escolhe entre manter os campos preenchidos anteriormente e apenas complementar os faltantes ou sobrescrever integralmente a ficha de qualificação;
* Se o escrevente anexar conjuntamente um comprovante de residência (água, energia, telefonia), a IA extrai e preenche automaticamente os dados de logradouro, número, complemento, bairro, cidade, UF e CEP;
* Se o documento anexado for uma certidão de casamento, o motor de IA reconhece o regime de bens pactuado, os dados do registro civil e já pré-qualifica o respectivo cônjuge no protocolo; caso seja uma certidão de nascimento, estrutura todos os dados de registro civil correspondentes.

O mesmo motor de reconhecimento inteligente aplica-se ao cadastramento de imóveis a partir de certidões de matrícula enviadas em formato PDF, como veremos na integração com o editor. Esse fluxo retira a morosidade do processo operacional do escrevente, que deixará de despender horas com tarefas manuais de preenchimento de índices, passando a focar na análise jurídica material do ato notarial.

---

### [11:39 - 16:15] Nova Geração do Editor de Textos do ORION TN: Recursos do LibreOffice, Formatação Automática e Validação CNIB

**Luan (Especialista Orion TN):**  
Avançando para a redação do ato notarial, acessamos o novo módulo de editor de textos do **ORION TN**. Ao iniciar uma minuta, o escrevente dispõe de ampla flexibilidade: pode importar uma **Minuta** proveniente de outro protocolo, utilizar o recurso de **Duplicar Parcial** (selecionando etapas específicas de um ato já concluído para reaproveitamento) ou carregar um modelo institucional inteiramente novo.

O nosso editor foi totalmente atualizado. Mantemos a base tecnológica consolidada sobre o motor do **LibreOffice**, agora atualizado para a versão 26 — trazendo uma compilação consideravelmente mais robusta, ágil e estável, com recursos nativos sofisticados de renderização.

Dentre as novidades de interface e ergonomia, implementamos o **Modo Escuro (Dark Mode)** completo no ambiente de edição. Para os escreventes que passam longas horas ininterruptas conferindo minutas complexas e digitando escrituras, a redução da fadiga visual representa um ganho imediato de conforto e produtividade.

Principais recursos operacionais do novo editor:
1. **Modelos Inteligentes com Variáveis de Mescla**: Se a serventia utiliza modelos pré-parametrizados com tags de mescla, os dados cadastrados nos índices do protocolo (partes, qualificações, imóveis, valores, representações) são preenchidos automaticamente na abertura do documento.
2. **Formatação Automática de Documento com Um Clique**: Ao colar ou importar textos de minutas elaboradas externamente por advogados ou construtoras — frequentemente em fontes, tamanhos e margens discrepantes —, a ferramenta de formatação instantânea ajusta todo o corpo do documento para os padrões tipográficos oficiais do cartório (por exemplo, fonte Times New Roman, corpo 12, recuo parágrafo e alinhamento justificado).
3. **Prévia Dinâmica de Livro e Traslado**: O escrevente dispõe de botões dedicados para gerar a pré-visualização exata de como a **Escritura** será diagramada no **Livro** notarial físico e como ficará a apresentação gráfica do **Traslado** final:
   * O layout do livro respeita rigorosamente as margens, cabeçalhos, rodapés e numerações de folhas oficiais do cartório;
   * Se o ato ainda não tiver sido formalmente lavrado, os dados pendentes (como número do livro, termo de lavratura e folha definitiva) são renderizados propositalmente em destaque vermelho;
   * O sistema posiciona perfeitamente as linhas de assinatura de todas as partes intervenientes e do tabelião ou escrevente autorizado;
   * **Mecanismo Antifraude**: A prévia gerada para download e compartilhamento é emitida com uma marca d'água transversal indelével ("PRÉVIA"), prevenindo qualquer risco de fraude ou circulação indevida de minutas preliminares como se fossem traslados definitivos.
4. **Assistente de Transcrição por Extenso e Medidas**: Durante a redação, o escrevente não precisa redigir valores monetários ou grandezas métricas por extenso manualmente. Basta inserir o numeral (ex.: `100.000,00` ou `134,88`), selecionar a ferramenta de transcrição notarial, e o editor substitui automaticamente pelo valor por extenso com grafia jurídica impecável (`cem mil reais`; `cento e trinta e quatro inteiros e oitenta e oito centésimos de metro quadrado`), mitigando erros materiais.
5. **Integração e Consulta à CNIB**: O editor conta com rotina direta de conferência na Central Nacional de Indisponibilidade de Bens (**CNIB**). O sistema submete todas as partes arroladas no protocolo à consulta nacional, obtém o código hash de validação temporal emitido pela central e insere a respectiva declaração de indisponibilidade negativa diretamente nas cláusulas da minuta.

---

### [16:16 - 19:35] Versionamento Inteligente de Minutas, Comparador Visual e Trilha de Auditoria

**Luan (Especialista Orion TN):**  
Apresentamos agora um dos maiores marcos tecnológicos da versão 6.0: o sistema integrado de **Versionamento de Minutas e Documentos**.

No dia a dia de um **Tabelionato de Notas**, um mesmo ato notarial passa por sucessivas revisões: a minuta é elaborada por um escrevente, remetida ao advogado das partes, corrigida internamente, submetida ao tabelião substituto e, por vezes, readequada minutos antes da lavratura. Anteriormente, era um desafio operacional complexo rastrear o que havia sido modificado, por quem e em que momento.

Com o novo motor de versionamento:
* A cada salvamento de alterações na minuta, no **Livro** ou no **Traslado**, o **ORION TN** arquiva automaticamente um snapshot histórico imutável com carimbo cronológico de data, hora e identificação do usuário logado;
* **Comparador Visual de Versões**: O usuário pode selecionar quaisquer duas versões do documento (por exemplo, a versão inicial elaborada pelo escrevente e a versão pós-revisão retornada pelo setor de conferência) e acionar a ferramenta de comparação;
* O sistema renderiza uma tela comparativa analítica, onde os trechos suprimidos aparecem com destaque em vermelho e formatação tachada, enquanto os trechos inseridos surgem destacados. Ao repousar o cursor do mouse sobre o trecho alterado, uma tooltip indica expressamente o nome do colaborador que efetuou aquela exclusão ou inserção;
* Isso encerra em definitivo conflitos de autoria ou incertezas operacionais sobre adulterações de cláusulas e erros inseridos durante a tramitação da minuta;
* **Restauração Segura**: Caso uma revisão tenha sido equivocada, o operador pode clicar no comando "Restaurar Versão", revertendo o texto do documento imediatamente ao seu estado original anterior;
* O usuário pode ainda realizar o download ou a simples visualização de qualquer versão preliminar armazenada na linha do tempo auditável do protocolo.

---

### [19:36 - 24:30] Flexibilidade Operacional: Preenchimento Automático do Protocolo a partir da Minuta e Gestão de Qualificação

**Luan (Especialista Orion TN):**  
Uma diretriz primordial da versão 6.0 foi garantir que o sistema se adeque à cultura de trabalho da serventia, e não o inverso. Reconhecemos que nos cartórios coexistem dois perfis de colaboradores indispensáveis:
1. O escrevente focado no fluxo digital, que alimenta os formulários cadastrais com apoio de inteligência artificial e gera a minuta padronizada via variáveis de mescla;
2. O escrevente sênior tradicional, com anos de experiência jurídica notarial, altamente produtivo na confecção de minutas em editores como o Word, mas que tem aversão ao preenchimento repetitivo de dezenas de campos de índices cadastrais.

Para este segundo perfil, desenvolvemos o recurso inovador de **Extração Reversa de Minuta para Protocolo**:
* O escrevente tradicional redige livremente sua minuta ou importa o arquivo elaborado externamente, contendo as qualificações e os bens negociados;
* Ao concluir o texto no editor, ele simplesmente aciona o botão de sincronização inteligente do **Orion Editor**;
* O motor de IA analisa minuciosamente a redação jurídica da minuta e realiza a engenharia reversa do texto:
  * Identifica todas as partes que figuraram no instrumento, reconhecendo quem é outorgante, outorgado, cônjuge, procurador ou representante legal;
  * Extrai os dados pessoais (nome, CPF, RG, filiação, estado civil, regime de bens da sociedade conjugal);
  * Identifica a descrição predial do imóvel negociado: área privativa, confrontações, número de matrícula registral, respectiva circunscrição do **Registro de Imóveis (RI)**, número de inscrição municipal de IPTU e o valor da transação e valor venal atribuído;
  * Alimenta automaticamente todas as abas do protocolo no **ORION TN** com esses dados catalogados.
* Dessa forma, todas as obrigações acessórias decorrentes do ato — tais como o preenchimento da **DOI**, comunicações da **SEFAZ** e alimentação de índices do sistema — ficam 100% preenchidas sem que o escrevente precise redigitar uma única linha no sistema.

Enfatizamos categoricamente: a Inteligência Artificial foi implementada como uma potente ferramenta de produtividade para retirar a morosidade das tarefas cartorárias burocráticas, permitindo que a equipe notarial direcione seu tempo e capacidade crítica para a conferência jurídica, o atendimento humanizado e a segurança preventiva dos negócios.

---

### [24:31 - 27:25] Envio Automatizado de Escrituras para o Registro de Imóveis via ONR / SAEC

**Luan (Especialista Orion TN):**  
Com a **Escritura** formalmente lavrada e o imóvel devidamente cadastrado no protocolo, o **ORION TN** 6.0 disponibiliza a rotina operacional dedicada ao **Envio de Escrituras para Registro**.

Nesta tela, o processo de encaminhamento do título ao fólio real é integralmente desburocratizado:
1. O escrevente localiza e seleciona o protocolo do ato lavrado;
2. O sistema já identifica o imóvel vinculado e solicita a indicação do cartório de **Registro de Imóveis (RI)** competente da comarca ou circunscrição;
3. O operador vincula os arquivos necessários que instruirão a prenotação: o arquivo PDF assinado do **Traslado** da escritura e eventuais certidões e comprovantes fiscais já anexados aos autos do protocolo;
4. Ao clicar no botão **"Comunicar"**, o **ORION TN** estabelece comunicação imediata via webservice/API com a central do **ONR** / **SAEC**, transmitindo os metadados do ato e os arquivos associados diretamente à serventia predial de destino;
5. A partir do envio, a rotina captura o protocolo de prenotação no RI de forma transparente e gerencia todo o ciclo de vida subsequente (notas devolutivas, reingressos e confirmação de averbação/registro), sem necessidade de que o escrevente acesse portais externos para efetuar uploads manuais.

Passo agora a palavra ao meu colega Vinícius Silva, que apresentará as inovações em mensageria com o ecossistema de **WhatsApp** e a integração avançada com a plataforma **Cartflow**.

---

### [27:26 - 34:55] Comunicação Omnichannel: Notificações Automatizadas via WhatsApp (API Meta e Z-API)

**Vinícius Silva (Especialista de Sistemas Siplan):**  
Boa tarde a todos! É uma grande satisfação estar aqui demonstrando duas vertentes cruciais de conexão externa do **ORION TN**: os novos recursos de mensageria via **WhatsApp** e a integração nativa com o **Cartflow**.

No que tange à integração com o **WhatsApp**, o **ORION TN** oferece flexibilidade de infraestrutura com suporte a duas modalidades de conectividade:
1. **API Oficial da Meta (Cloud API)**: Canal corporativo de alta escalabilidade com verificação empresarial;
2. **Z-API**: Integração prática e consolidada que foi substancialmente aprimorada na versão 6.0 para suportar envios automatizados em lote e com anexos dinâmicos.

Demonstrarei em meu ambiente operacional (configurado via Z-API, mas idêntico em funcionamento à API oficial da Meta) as principais rotinas beneficiadas pela automação via WhatsApp:

1. **Envio Automatizado de Orçamentos com PDF**: Ao finalizar a elaboração da planilha orçamentária de um ato notarial, o sistema exibe o botão de compartilhamento por **WhatsApp**. O operador seleciona o contato do destinatário (ou utiliza os telefones pré-cadastrados das partes) e dispara a mensagem. O cliente recebe no WhatsApp uma mensagem institucional formatada contendo o resumo das custas e emolumentos acompanhada obrigatoriamente do documento do orçamento em formato PDF anexado.
2. **Disparo de Prévia da Minuta**: Diretamente da tela de protocolo ou do editor de textos, o escrevente aciona o comando de envio de prévia. O sistema gera o arquivo PDF da **Minuta** — devidamente protegido com as marcas d'água de conferência — e permite disparar o documento simultaneamente para múltiplos números de telefone cadastrados (partes, advogados e corretores) com um único clique.
3. **Comprovante de Abertura de Protocolo**: Assim que um pedido ou ato dá entrada no cartório, o sistema emite o comprovante formal de protocolo com o número da prenotação e chave de acompanhamento diretamente para o WhatsApp do requerente.
4. **Recibos de Balcão de Firmas e Pedidos de Certidão**: Serviços executados no atendimento ao público, como aberturas/reconhecimentos de firma e emissão de **Certidões**, geram comprovantes digitais de prestação de serviços e recibos financeiros disparados instantaneamente ao cidadão.
5. **Módulo de Faturamento e Cobrança de Mensalistas**:
   * No cadastro de pessoas e mensalistas do cartório, há um parâmetro específico que define se o cliente opta por receber avisos e cobranças via WhatsApp;
   * Ao processar o faturamento periódico dos mensalistas no encerramento da competência, o operador seleciona os clientes faturados e clica em disparar;
   * O **ORION TN** envia automaticamente a mensagem no WhatsApp com o relatório discriminado de todos os atos praticados no período e o respectivo boleto bancário em PDF para liquidação.
6. **Notificações de Movimentações Financeiras**: Cada aporte financeiro, quitação de emolumentos ou complemento de depósito prévio registrado no caixa do protocolo pode gerar um comprovante de quitação em PDF disparado de forma transparente para os interessados.
7. **Alerta Preventivo de Vencimento de Procurações**: Ao lavrar um ato de **Procuração** ou **Substabelecimento** que possua prazo determinado de validade, o escrevente parametriza a data de vigência no protocolo. O motor de automação do **ORION TN** monitora essa data e, de forma programada, dispara uma notificação via WhatsApp ao outorgante e mandatário exatamente 7 dias antes do vencimento do instrumento, alertando sobre a expiração e oportunizando a renovação tempestiva do ato.

---

### [34:56 - 42:15] Integração Cartflow: Recepção Documental Digital, Triagem pelo WhatsApp e Gestão PJ (Imobiliárias e Advocacia)

**Vinícius Silva (Especialista de Sistemas Siplan):**  
Apresentamos agora a integração aprofundada do **ORION TN** com o **Cartflow**. Para as serventias que ainda não o utilizam, o **Cartflow** é a ferramenta especializada da **Siplan** criada para solucionar um dos maiores gargalos operacionais dos cartórios: a coleta de documentação preliminar junto ao cliente externo e a gestão do pipeline de pedidos da serventia.

O **Cartflow** opera tanto de maneira autônoma quanto nativamente acoplado ao **ORION TN**. Ao iniciar um protocolo de **Escritura de Compra e Venda**, o escrevente clica no botão integrado do **Cartflow**:
1. O sistema cria o pedido e já organiza automaticamente uma árvore de pastas com a listagem dos documentos obrigatórios parametrizados especificamente para aquela natureza jurídica (ex.: certidões de estado civil, certidões de feitos ajuizados, guias de **ITBI**, matrícula atualizada do imóvel);
2. O escrevente realiza o convite ao cliente via e-mail ou, prioritariamente, por **WhatsApp**;
3. **Fim da Barreira Tecnológica para o Usuário Final**: Sabemos que muitos cidadãos têm dificuldade ou resistência em instalar aplicativos ou acessar portais web desconhecidos para fazer uploads. Com a integração via WhatsApp, o cliente recebe a requisição documental diretamente na janela de conversa usual do aplicativo;
4. O cliente simplesmente anexa ou fotografa os documentos requeridos (como RG, CNH, certidão de casamento) e os envia no próprio chat do WhatsApp;
5. **Triagem em Modal Ágil no Orion TN**: No ambiente do escrevente dentro do protocolo, o sistema exibe um modal de conferência documental:
   * O escrevente visualiza o preview do documento enviado pelo cliente sem sair da tela do ato;
   * Ao clicar em **"Aprovar"**, o arquivo é imediatamente incorporado e organizado na respectiva pasta de arquivamento digital daquele protocolo;
   * O cliente recebe instantaneamente uma mensagem automática no WhatsApp informando que o documento foi validado;
   * Caso o documento esteja vencido, ilegível ou incorreto, o escrevente clica em **"Recusar"** e digita a motivação técnica (ex.: "Certidão de casamento emitida há mais de 90 dias" ou "Documento com bordas cortadas"). O cliente recebe no WhatsApp a notificação imediata com a justificativa, podendo reenviar o arquivo correto na mesma hora;
   * Caso falte algum documento não previsto inicialmente, o escrevente pode requisitar o item complementar pelo próprio modal.
6. Os documentos aprovados passam a compor permanentemente os anexos do protocolo, podendo ter suas aprovações revistas ou manipuladas pelo escrevente a qualquer tempo.

**Luan (Especialista Orion TN):**  
Complementando o que o Vinícius demonstrou: a gestão documental entre as partes é uma das maiores dores das serventias, mormente em atos complexos como inventários, partilhas de bens e divórcios com ampla gama de certidões e herdeiros. 

O **Cartflow** conta ainda com o **Módulo CNPJ**, voltado expressamente para parceiros institucionais do cartório, tais como imobiliárias, incorporadoras, construtoras e escritórios de advocacia. Sob um único cadastro de pessoa jurídica, a empresa pode vincular múltiplos colaboradores (advogados, assistentes jurídicos, corretores). O setor administrativo da empresa parceira tem acesso a uma visão 360° de todos os seus pedidos em trâmite no **Tabelionato de Notas**, visualizando quais exigências documentais pendem do lado da empresa e quais estão sob análise dos escreventes do cartório, trazendo uma governança sem precedentes à relação institucional.

---

### [42:16 - 48:15] Apresentação do Orion Connect: Mensageria Interna, Canais Temáticos e Ciência de Provimentos

**Luan (Especialista Orion TN):**  
Para finalizar a demonstração das grandes soluções da família Orion, tenho o orgulho de apresentar o **Orion Connect**.

O **Orion Connect** foi desenvolvido para solucionar outra dor crônica diagnosticada nos cartórios brasileiros: a comunicação interna caótica e desprovida de segurança jurídica. Em muitas serventias, ordens de serviço, deliberações sobre **Provimentos** e instruções de minutas trafegam em grupos informais de WhatsApp pessoal ou por recados verbais que se perdem, gerando sérios riscos de responsabilidade civil e falhas de conformidade.

O **Orion Connect** institui uma plataforma corporativa exclusiva para a serventia:
1. **Estruturação por Canais Temáticos**: O cartório cria canais segmentados por especialidade ou equipe, tais como Canal de **Escrituras**, Canal de **Balcão de Firmas**, Canal de Coordenação, Gestão Operacional ou Diretoria, definindo rigorosamente quais colaboradores integram cada espaço;
2. **Moderação e Governança de Publicações**: Apenas os moderadores e o tabelião têm prerrogativa de criar novas publicações estruturais nos canais. Os demais colaboradores podem interagir através de comentários subordinados, perguntas, esclarecimentos e reações formais (curtidas e sinalizações), garantindo que a informação oficial não seja soterrada por mensagens avulsas;
3. **Mural de Comunicados Oficiais e Ciência de Provimentos**:
   * Quando a **Corregedoria Geral da Justiça** ou o CNJ publica um novo **Provimento**, ou a serventia emite uma nova diretriz interna, o gestor publica o texto na aba de Comunicados Oficiais exigindo obrigatoriamente a confirmação formal de leitura;
   * O colaborador recebe um alerta na interface e, após ler o comunicado e eventuais anexos normativos, clica em **"Confirmar Leitura e Ciência"**;
   * O tabelião e os gestores têm acesso a um painel analítico de conformidade que aponta nominalmente quem já confirmou ciência, quem ainda está pendente e o registro exato de data e hora de cada confirmação, gerando um dossiê de auditoria irrefutável para fins de fiscalização correcional e gestão de compliance;
4. **Mecanismo de Pesquisa Global**: O sistema possui um mecanismo de busca com indexação textual avançada. O colaborador pode pesquisar termos como "Provimento" ou "ITBI", e o sistema resgata imediatamente todas as instruções normativas, posts e discussões correlatas já realizadas no cartório;
5. **Chat Interno (Mensagens Diretas 1:1 e Grupos de Trabalho)**:
   * Mensageria instantânea privativa entre colaboradores ou grupos fechados de projeto (ex.: comitê de tecnologia ou escreventes da comissão de regularização fundiária);
   * Troca segura de arquivos digitais, documentos técnicos, recibos de leitura e respostas encadeadas em tempo real;
6. **Política Rigorosa de Privacidade e Proteção de Dados**:
   * O **Orion Connect** respeita a privacidade funcional dos colaboradores. Nem os supervisores nem o tabelião têm acesso visual irrestrito às conversas privadas mantidas entre os usuários no chat individual;
   * Em situações excepcionais de apuração de falta funcional grave, assédio, injúria ou ilícitos penais que demandem instrução probatória para juntada em processo administrativo ou judicial, a extração dos registros é realizada exclusivamente via banco de dados sob protocolo formal junto à equipe técnica da **Siplan**.

---

### [48:16 - 49:55] Evoluções Complementares do Ecossistema: Módulos de Tesouraria, Caixa e Gestão de Despesas

**Luan (Especialista Orion TN):**  
Estas são as diretrizes nucleares da versão 6.0 do **ORION TN**. Recomendamos a todos os clientes que monitorem continuamente o nosso painel de atualizações (*Changelog*), acessível diretamente pelo menu **"Saiba as novidades da versão"** no sistema. Nossa equipe técnica de desenvolvimento adota um ciclo contínuo de entregas e aprimoramentos semanais em produção.

Dentre as evoluções correlatas recém-disponibilizadas no ecossistema **Siplan**, destacamos:
* **Novo Módulo de Tesouraria e Evolução do ORION Caixa**: Gestão consolidada de movimentações de tesouraria física e bancária da serventia;
* **Conciliação Bancária Automatizada**: Leitura e conciliação digital avançada de extratos OFX e integração direta com contas correntes cartorárias;
* **Gestão de Despesas e Contas a Pagar**: Ferramentas aprofundadas para acompanhamento orçamentário, classificação contábil de despesas da serventia e apoio integral à gestão financeira do titular.

Passo a palavra ao Renato para coordenarmos a nossa sessão de debates e respostas aos questionamentos do público.

---

### [49:56 - 01:00:17] Sessão de Perguntas e Respostas (Q&A)

**Renato (Siplan):**  
Excelente, Luan e Vinícius! Agradeço imensamente pelas demonstrações. Como mencionado, temos hoje participantes que já são clientes de longa data e colegas que utilizam outras plataformas de mercado e estão avaliando a migração para a linha Orion. 

Disponibilizei no chat o endereço de contato direto com o nosso time comercial para agendamento de implantações e conversões de base. Vamos dar início imediato ao atendimento das dúvidas postadas na ferramenta de Perguntas e Respostas, começando pela pergunta da Dra. Erika.

---

#### 1. Preenchimento Automático de Partes no Protocolo e Geração da Minuta com Concordância Gramatical
**Participante (Dra. Erika):**  
*Ao realizar o preenchimento dos dados das partes no protocolo utilizando a Inteligência Artificial e importar os documentos, o sistema já gera a minuta com a devida concordância gramatical ou é necessário ajustar manualmente o modelo?*

**Luan (Especialista Orion TN):**  
Não precisa de ajustes manuais, Dra. Erika! Os modelos institucionais do cartório configurados no **ORION TN** trabalham com variáveis dinâmicas de mescla avançadas. Uma vez que a qualificação da pessoa é preenchida no protocolo pela IA (com identificação do gênero, estado civil, regime de casamento e papel figurado no ato), ao disparar a geração da **Minuta**, o sistema aplica de forma automatizada todas as regras de flexão de gênero e número (ex.: "o outorgante vendedor, brasileiro, casado..." ou "as outorgantes vendedoras, brasileiras, casadas..."). Caso a serventia queira revisar ou personalizar expressões típicas de seu padrão notarial, a equipe de suporte da **Siplan** faz essa parametrização fina.

---

#### 2. Balcão de Firmas: Abertura de Cartões de Assinatura via IA e Envio pelo WhatsApp
**Participante (Representante da Comarca de Votorantim):**  
*Na abertura e cadastramento de cartões de assinatura / autógrafo no balcão de firmas, o sistema já recebe as imagens diretamente pelo WhatsApp?*

**Luan (Especialista Orion TN):**  
Atualmente, o recebimento de arquivos diretamente via **WhatsApp** está consolidado no módulo **Cartflow** integrado aos protocolos de atos. Para o **Balcão de Firmas**, o recurso avançado de IA que temos em operação na versão 6.0 reside na extração inteligente durante o cadastramento do **Cartão de Assinatura**: 
Ao abrir uma nova ficha de autógrafo, o atendente insere o arquivo do documento do cidadão (por exemplo, o PDF ou foto da CNH/RG); o motor de **OCR** e IA processa o documento, preenche automaticamente todos os dados cadastrais da parte (nome, documentos, filiação, nascimento) e já arquiva a imagem do documento original digitalizada na ficha do cliente, poupando tempo expressivo de fila no atendimento presencial.

---

#### 3. Emissão e Envio de Recibos no Balcão de Firmas e Pedidos de Certidão via WhatsApp
**Participante (Atendimento / Balcão de Firmas):**  
*O disparo de comprovantes de pagamento e recibos de serviços prestados por WhatsApp também está disponível no caixa do balcão de firmas?*

**Luan (Especialista Orion TN):**  
Sim, com certeza! O recurso de disparo automatizado de comprovantes via **WhatsApp** está integralmente ativo tanto nas rotinas de caixa do **Balcão de Firmas** quanto no módulo de expedição e pedidos de **Certidão**, exatamente com o mesmo padrão visual de agilidade demonstrado pelo Vinícius nos protocolos notariais.

---

#### 4. Fluxo Financeiro, Gestão de Usuários no Orion Connect e Gestão de Documentos (ORION GED vs. ORION TN Nativo)
**Participantes (Dra. Marília e Lucas - Primeiro Tabelionato de Notas):**  
*Primeira dúvida (Lucas): Quando um usuário for inativado no sistema principal, ele é inativado automaticamente no Orion Connect? É possível restringir o acesso ao Orion Connect para determinados colaboradores que usam o ORION TN?*  
*Segunda dúvida (Dra. Marília): Como fica a integração com o ORION GED? Os documentos anexados ao protocolo precisam ser arquivados em classificadores externos no GED?*

**Luan (Especialista Orion TN):**  
Respondendo ao Lucas: Sim! O gerenciamento de credenciais é unificado. Ao inativar um colaborador no sistema principal (**ORION TN** ou Orion Protesto), a inativação é replicada de imediato para o **Orion Connect**. Além disso, o tabelião tem total autonomia na matriz de permissões para definir quais colaboradores da serventia terão ou não acesso ao **Orion Connect**.

Quanto à dúvida da Dra. Marília sobre a rotina de arquivamento documental e o **ORION GED**, passo a palavra ao Renato para elucidar a evolução entre a plataforma legada e a versão atual.

**Renato (Siplan):**  
Esse esclarecimento formulado pela Dra. Marília é fundamental. Na nossa geração anterior de sistemas, como no **Control-M** para notas, existia uma aplicação apartada e externa dedicada ao arquivamento de documentos eletrônicos, que era o **ORION GED**. O escrevente precisava sair do sistema notarial para classificar os arquivos no GED.

No **ORION TN**, a arquitetura evoluiu substancialmente: **o GED está nativamente embutido dentro do próprio protocolo**. 
Quando você anexa a documentação no protocolo (seja via recepção direta, upload manual ou captação pelo **Cartflow** via WhatsApp), esses arquivos ficam automaticamente indexados à imagem e ao histórico daquele ato notarial específico. Os documentos podem ser pesquisados e resgatados a qualquer tempo por múltiplos critérios: número do protocolo, nome das partes, número do **Livro** e **Folha**, sem qualquer necessidade de digitalização paralela ou indexação manual em classificadores externos. O módulo autônomo do **ORION GED** permanece ativo apenas para consulta unificada corporativa, sem duplicar arquivos na base de dados.

---

#### 5. Sistemática de Envio de Anexos e Traslado ao Registro de Imóveis (RI)
**Luan (Especialista Orion TN):**  
Respondendo a um ponto complementar levantado no chat a respeito do envio para o **Registro de Imóveis (RI)**: peço desculpas por não ter enfatizado na tela anterior. 
Ao preparar a transmissão via **ONR**, os arquivos que instruem o título notarial (em especial o arquivo assinado do **Traslado** e eventuais certidões anexas) podem ser vinculados diretamente na aba de anexos do próprio protocolo (bastando marcar a opção indicando que o arquivo se destina ao registro de imóveis) ou anexados no botão específico da tela de **Envio de Escrituras para Registro**. Quando o escrevente aciona o comando "Comunicar", o sistema empacota as informações e dispara os documentos de forma automática.

---

#### 6. Visão Estratégica do Cartflow como Canal Receptivo no Site do Cartório
**Diego (Siplan):**  
Renato e Luan, gostaria apenas de fazer uma breve complementação sobre o **Cartflow** que considero primordial para a gestão das serventias.
O **Cartflow** não serve apenas para o escrevente provocar o cliente pedindo documentos. Ele é uma extraordinária ferramenta receptiva e ativa de captação de serviços que pode ser disponibilizada no próprio site institucional do cartório.

**Marcos (Siplan):**  
Excelente intervenção, Diego. É muito comum que os cartórios mantenham relacionamento constante com corretores de imóveis, correspondentes bancários e grandes escritórios de advocacia que concentram dezenas de escrituras por mês. 
Com o **Cartflow**, a serventia pode disponibilizar no seu portal web um acesso seguro com login e senha para esses parceiros estratégicos. O corretor ou advogado, do seu próprio escritório e a qualquer hora, acessa a plataforma, solicita a abertura de uma **Escritura de Compra e Venda** e já anexa os documentos das partes e a matrícula imobiliária. 
Essa demanda ingressa diretamente na fila de triagem do **ORION TN**, permitindo ao escrevente converter o pedido de atendimento em um protocolo ativo com os arquivos já anexados, sem a necessidade de deslocamento físico do parceiro ao cartório e sem perda de documentos em caixas de e-mail.

---

### [01:00:18] Considerações Finais e Encerramento

**Renato (Siplan):**  
Perfeita colocação, Marcos e Diego! Esse modelo bidirecional do **Cartflow** moderniza profundamente a prestação do serviço notarial perante o mercado imobiliário e a advocacia.

Como não temos novos questionamentos no painel e o nosso horário programado foi atingido, reitero o convite a todos os presentes para que entrem em contato com a equipe de consultoria e suporte da **Siplan** pelos nossos canais oficiais e e-mails indicados no chat. Enviaremos o link com a gravação integral desta apresentação técnica a todos os inscritos.

Agradeço imensamente a participação do Luan, do Vinícius Silva, do Marcos, do Diego e, principalmente, a presença de cada um dos tabeliães, escreventes e gestores que compartilharam este momento conosco. Tenham todos uma excelente tarde e um ótimo trabalho!

---
*Documento transcrito, purificado e normalizado com aplicação do Glossário Corporativo Notarial e da Siplan — Versão 6.0.*
