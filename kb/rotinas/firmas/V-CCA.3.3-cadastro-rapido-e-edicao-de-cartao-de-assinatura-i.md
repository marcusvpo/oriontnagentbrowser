---
id: V-CCA.3.3
titulo: Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas
tags:
- firmas
- reconhecimento de firmas
- cadastro rapido
- balcao de atendimento
- cadastro completo
- agilidade
objetivo: Cadastrar novos cartões de assinatura ou editar fichas existentes diretamente na tela de Reconhecimento de Firmas durante o atendimento de balcão.
sinonimos:
- abrir ficha de firma direto no reconhecimento
- cadastrar cliente novo na hora de reconhecer firma
- editar ficha do cliente no balcao de firmas
- botao cadastro completo no reconhecimento
- autenticar firma de balcão
perguntas_usuario:
- Como cadastrar um cliente novo direto na tela de reconhecimento de firma sem sair do atendimento?
- Como abrir e editar o cadastro completo de uma ficha pelo balcão de reconhecimento?
- O cartão cadastrado na tela de reconhecimento já fica selecionado para o ato?
- Como configurar os campos que aparecem no cadastro rápido de firmas?
sintomas_comuns:
- abrir cartão de assinatura direto na tela de reconhecimento de firma
- cliente sem ficha no meio do atendimento de reconhecimento
- atalho para cadastrar autógrafo sem sair do pedido de firmas
- atualizar assinatura do cliente durante reconhecimento de firma
- reconhecimento não conclui por falta de cartão ativo
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=639
    video_timestamp: '10:39'
    video_start_seconds: 639
  - parte: 2
    video_title: Cadastro Cartão de Assinatura pt 2 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 76bede7b-b314-4776-9e6f-3af28af1b54d
    video_url: https://iframe.mediadelivery.net/embed/467408/76bede7b-b314-4776-9e6f-3af28af1b54d?t=0
    video_timestamp: 00:00
    video_start_seconds: 0
  bunny_library_id: '467408'
  bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
  video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
  video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=0
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: V
categoria: videoaula_tutorial
versao_sistema: Orion TN 6.0
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

 SEÇÃO PRINCIPAL 3: MANUAIS DO PRODUTO - Orion TN

**DESCRIÇÃO DA SEÇÃO:** Esta seção contém o conteúdo extraído diretamente dos manuais oficiais do produto Orion TN, disponíveis na intranet da Siplan. As informações aqui são detalhadas e servem como referência técnica completa das funcionalidades do sistema.

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.

---

SEÇÃO PRINCIPAL 3: MANUAIS DO PRODUTO - Orion TN

**DESCRIÇÃO DA SEÇÃO:** Esta área reúne as rotinas estruturadas a partir dos manuais formais do Orion TN, detalhando fluxos de balcão, termos de comparecimento, mensalistas e parametrizações.

---
