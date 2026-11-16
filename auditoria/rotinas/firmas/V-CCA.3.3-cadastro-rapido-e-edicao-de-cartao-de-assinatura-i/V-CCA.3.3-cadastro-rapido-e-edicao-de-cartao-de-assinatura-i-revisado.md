---
id: V-CCA.3.3
titulo: 'Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: validado_inalterado
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  prints_geradas: 5
  dry_run_mutations: true
  comandos_de_gravacao_nao_acionados:
    - passo: 4
      comando: 'Concluir'
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

#### Descrição:
Para garantir máxima agilidade no atendimento de balcão, o módulo de Reconhecimento de Firmas é totalmente integrado ao cadastro de cartões de assinatura. Caso o cliente que se apresenta no balcão não possua ficha no cartório, o escrevente pode cadastrá-lo instantaneamente sem fechar a rotina de reconhecimento, liberando a impressão imediata da ficha e vinculando o titular ao ato de firma em andamento de forma automática.

#### Passo a passo revisado:
1. Acesse o menu principal **Firmas > Reconhecimento de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Reconhecimento de firmas**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
2. No campo de pesquisa do reconhecimento, informe o **Nome** ou **CPF** do comparecente para conferir se há ficha cadastrada.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Nome** · (2) **CPF**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
3. Se a pesquisa **NÃO** retornar registro cadastrado para a parte:
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
   * Clique diretamente no botão de **Novo Cadastro** (ícone **+**) na própria tela de reconhecimento.
   * O sistema abrirá a tela de cadastro de cartão de assinatura (em formato simplificado/rápido ou completo, dependendo da configuração parametrizada pelo cartório para o balcão).
   * Preencha os dados obrigatórios (**Nome**, **CPF**, documentos, estado civil, contatos e endereços).
   * Capture a foto facial, biometria e consuma o papel de segurança/selo conforme a necessidade do cartório.
   * Clique no botão **Concluir** para gravar o novo cartão.
   * **Diferencial de Balcão:** Imediatamente após a gravação, o sistema libera a impressão do cartão de assinatura para coleta da firma do cliente e vincula e seleciona automaticamente o novo cartão cadastrado para o ato de reconhecimento de firmas aberto na tela.
4. Se a pesquisa **LOCALIZAR** um registro existente que necessite de atualização cadastral:
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
   > [!NOTE] **Trava Segura de Mutação (dry-run):** o comando **Concluir** foi localizado, medido e demarcado na print, mas o clique final foi omitido para não gravar no banco de homologação. A ação foi validada visualmente, sem efetivar a gravação.
   * Selecione o registro da pessoa na listagem de busca da tela de reconhecimento.
   * Clique no botão **Cadastro Completo**.
   * Na janela que se abre, clique na opção **Alterar**.
   * Atualize os dados necessários (ex.: novo telefone, endereço atualizado ou anexo de novo documento) e clique em **Concluir**.
   * As alterações serão salvas imediatamente na base e o escrevente retorna à tela de reconhecimento com os dados já atualizados.
5. Prossiga normalmente com o lançamento do ato de reconhecimento de firma (selecionando o tipo de reconhecimento: por autenticidade, por semelhança com valor ou sem valor) e finalize o atendimento.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).

* **Diferencial de Balcão: Imediatamente após a gravação, o sistema libera a impressão do cartão de assinatura para coleta da firma do cliente e vincula e seleciona automaticamente o novo cartão cadastrado para o ato de reconhecimento de firmas aberto na tela.**
* **Observação: A exibição de campos no formulário de cadastro acionado pelo reconhecimento de firmas pode ser ajustada nas configurações da serventia para exibir apenas os dados essenciais para o balcão ou o formulário integral, de acordo com o fluxo de trabalho do cartório.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
