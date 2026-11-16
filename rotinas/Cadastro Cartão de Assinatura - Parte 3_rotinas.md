---
id: V-CCA.3.1
titulo: "Geração e Gerenciamento de Selo Digital (Automático e Manual) no Cartão de Assinatura"
tags:
  - firmas
  - cartao de assinatura
  - selo digital
  - tj
  - qr code
  - comunicacao pendente
  - cancelamento de selo
objetivo: "Gerar e gerenciar selos digitais de fiscalização (automático ou manual) com transmissão ao Tribunal de Justiça, cancelamento, reutilização e consulta de QR Code no cartão de assinatura."
sinonimos:
  - como selar ficha de firma
  - selo digital automatico no cartao de assinatura
  - gerar selo manual para cartao de autografo
  - ver qr code do selo da ficha
perguntas_usuario:
  - "Como gerar o Selo Digital para um cartão de assinatura?"
  - "O envio de Selo Digital no cartão de assinatura é obrigatório?"
  - "Como visualizar o QR Code do Selo Digital gerado para o Tribunal de Justiça?"
  - "O que significa o status Comunicação Pendente no Selo Digital?"
  - "Como cancelar ou reutilizar um Selo Digital vinculado à ficha de firma?"
---
#### Descrição:
O Orion TN permite a aplicação de Selo Digital do Tribunal de Justiça (TJ) no cadastro de cartões de assinatura, com suporte à geração totalmente automática no salvamento da ficha ou acionamento sob demanda (manual). O sistema disponibiliza ferramentas para consulta do QR Code oficial, controle de comunicação com o webservice do TJ, reutilização e cancelamento de selos.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro.
2. Identifique o fluxo de geração de **Selo Digital** configurado na sua serventia:
   * **Fluxo A - Geração Automática**:
     * Caso o sistema esteja parametrizado para geração automática de selos em cartões de assinatura, ao preencher e clicar em **Concluir** no cadastro, o sistema consumirá e gerará o selo digital imediatamente junto ao webservice do TJ.
     * Na tela do cartão, serão exibidos o número do selo, o código de autenticidade e o **QR Code** de validação.
   * **Fluxo B - Geração Manual**:
     * Caso a serventia utilize a geração sob demanda (uma vez que a remessa de selo em cartão de assinatura é facultativa por norma), localize a seção de **Selo Digital** na tela de edição do cartão e clique no botão **Gerar**.
     * O sistema não exigirá seleção de lotes ou números prévios: ele efetuará a geração direta, atribuição de numeração, exibição em tela e comunicação com o Tribunal de Justiça.
3. Tratando o status de comunicação:
   * Em ambiente de teste ou **Homologação** (ou caso haja oscilação momentânea no webservice do tribunal), o selo poderá exibir o status **Comunicação pendente**, indicando que os dados foram gerados localmente e serão transmitidos assim que a conexão com a base de produção do TJ for restabelecida.
4. Para **Gerenciar o Selo Gerado**:
   * **Visualizar QR Code**: Clique no ícone de **QR Code** ao lado do selo para exibir a imagem de validação pública do Tribunal.
   * **Reutilizar Selo**: Caso o selo não vá ser mantido na ficha e as regras do TJ permitam reaproveitamento, acione a opção de reutilização para disponibilizá-lo para outro ato.
   * **Cancelar Selo**: Se a ficha for descartada após a selagem, utilize a opção de cancelamento de selo informando a justificativa para envio ao tribunal.
5. Clique em **Concluir** para salvar as alterações na ficha.

* **Observação:** A obrigatoriedade de transmissão do selo digital para cartões de assinatura varia de acordo com o Provimento da Corregedoria Geral da Justiça de cada Estado, cabendo ao titular da serventia definir a parametrização do sistema (automática, manual ou desativada).
---
---
id: V-CCA.3.2
titulo: "Impressão da Ficha do Cartão de Assinatura e Destinação de Impressora"
tags:
  - firmas
  - cartao de assinatura
  - impressao de ficha
  - papel de seguranca
  - impressora
  - modelo de impressao
objetivo: "Emitir a impressão física do cartão de assinatura no modelo configurado da serventia, selecionando a impressora de destino e vinculando dados de segurança."
sinonimos:
  - imprimir cartao de assinatura no orion
  - imprimir ficha de autografo
  - como mandar o cartao de firma para a impressora
  - botao imprimir na ficha de firma
perguntas_usuario:
  - "Como imprimir o cartão de assinatura após cadastrar a pessoa?"
  - "Onde fica o botão Imprimir do cartão de assinatura?"
  - "Como selecionar a impressora para imprimir a ficha de firma?"
  - "Por que não consigo imprimir o cartão antes de salvar?"
---
#### Descrição:
Após a gravação inicial dos dados cadastrais, consumo do formulário/papel de segurança e aplicação do selo digital, o Orion TN habilita a emissão física do cartão de assinatura. A rotina permite selecionar o modelo gráfico padrão da serventia e direcionar a impressão para a impressora correta de papel de segurança ou formulário contínuo.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de Assinatura**.
2. Filtre e abra o cartão de assinatura gravado clicando no ícone da **Caneta** (**Alteração**).
   * **Atenção:** O botão de impressão do cartão pelo menu principal só é liberado na tela de edição após o cartão ter sido gravado previamente no banco de dados.
3. Verifique se os dados cadastrais, o número do papel de segurança e o selo digital (se aplicável) estão devidamente preenchidos.
4. Na barra de ações do formulário, clique no botão **Imprimir**.
5. O sistema exibirá a tela de parâmetros de impressão:
   * **Modelo**: Selecione o layout/modelo padrão de cartão de assinatura adotado pelo cartório.
   * **Impressora**: Selecione a impressora de destino configurada na rede ou estação de trabalho para emissão em papel de segurança.
6. Clique em **Confirmar** (ou **Imprimir**) para enviar o documento para a impressora.
7. Solicite que o titular aponha suas assinaturas físicas e rubricas nos campos delimitados do cartão impresso.
8. Retorne à tela do sistema e clique no botão **Concluir** para finalizar a manutenção do cartão de assinatura.

* **Observação:** É altamente recomendável digitalizar o cartão físico logo após a coleta das assinaturas e anexá-lo à ficha no sistema (conforme rotina de captura de imagens).
---
---
id: V-CCA.3.3
titulo: "Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas"
tags:
  - firmas
  - reconhecimento de firmas
  - cadastro rapido
  - balcao de atendimento
  - cadastro completo
  - agilidade
objetivo: "Cadastrar novos cartões de assinatura ou editar fichas existentes diretamente na tela de Reconhecimento de Firmas durante o atendimento de balcão."
sinonimos:
  - abrir ficha de firma direto no reconhecimento
  - cadastrar cliente novo na hora de reconhecer firma
  - editar ficha do cliente no balcao de firmas
  - botao cadastro completo no reconhecimento
perguntas_usuario:
  - "Como cadastrar um cliente novo direto na tela de reconhecimento de firma sem sair do atendimento?"
  - "Como abrir e editar o cadastro completo de uma ficha pelo balcão de reconhecimento?"
  - "O cartão cadastrado na tela de reconhecimento já fica selecionado para o ato?"
  - "Como configurar os campos que aparecem no cadastro rápido de firmas?"
---
#### Descrição:
Para garantir máxima agilidade no atendimento de balcão, o módulo de Reconhecimento de Firmas é totalmente integrado ao cadastro de cartões de assinatura. Caso o cliente que se apresenta no balcão não possua ficha no cartório, o escrevente pode cadastrá-lo instantaneamente sem fechar a rotina de reconhecimento, liberando a impressão imediata da ficha e vinculando o titular ao ato de firma em andamento de forma automática.

#### Passo a passo:
1. Acesse o menu principal **Firmas > Reconhecimento de Firmas**.
2. No campo de pesquisa do reconhecimento, informe o **Nome** ou **CPF** do comparecente para conferir se há ficha cadastrada.
3. Se a pesquisa **NÃO** retornar registro cadastrado para a parte:
   * Clique diretamente no botão de **Novo Cadastro** (ícone **+**) na própria tela de reconhecimento.
   * O sistema abrirá a tela de cadastro de cartão de assinatura (em formato simplificado/rápido ou completo, dependendo da configuração parametrizada pelo cartório para o balcão).
   * Preencha os dados obrigatórios (**Nome**, **CPF**, documentos, estado civil, contatos e endereços).
   * Capture a foto facial, biometria e consuma o papel de segurança/selo conforme a necessidade do cartório.
   * Clique no botão **Concluir** para gravar o novo cartão.
   * **Diferencial de Balcão:** Imediatamente após a gravação, o sistema libera a impressão do cartão de assinatura para coleta da firma do cliente e vincula e seleciona automaticamente o novo cartão cadastrado para o ato de reconhecimento de firmas aberto na tela.
4. Se a pesquisa **LOCALIZAR** um registro existente que necessite de atualização cadastral:
   * Selecione o registro da pessoa na listagem de busca da tela de reconhecimento.
   * Clique no botão **Cadastro Completo**.
   * Na janela que se abre, clique na opção **Alterar**.
   * Atualize os dados necessários (ex.: novo telefone, endereço atualizado ou anexo de novo documento) e clique em **Concluir**.
   * As alterações serão salvas imediatamente na base e o escrevente retorna à tela de reconhecimento com os dados já atualizados.
5. Prossiga normalmente com o lançamento do ato de reconhecimento de firma (selecionando o tipo de reconhecimento: por autenticidade, por semelhança com valor ou sem valor) e finalize o atendimento.

* **Observação:** A exibição de campos no formulário de cadastro acionado pelo reconhecimento de firmas pode ser ajustada nas configurações da serventia para exibir apenas os dados essenciais para o balcão ou o formulário integral, de acordo com o fluxo de trabalho do cartório.
---
