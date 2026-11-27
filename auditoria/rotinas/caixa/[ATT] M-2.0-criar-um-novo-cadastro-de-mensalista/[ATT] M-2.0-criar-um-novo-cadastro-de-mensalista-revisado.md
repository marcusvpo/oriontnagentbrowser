---
id: M-2.0
titulo: 'Criar um Novo Cadastro de Mensalista'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Desconto (%)', 'Dias de fechamento']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 6
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Mensalistas'
        elemento_real: 'Administração > Mensalistas > Mensalistas'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxxrvfndw8wwj-79] | x=474, y=254, 190x21'
      - passo: 4
        alvo_documentado: 'Desconto (%)'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 4
        alvo_documentado: 'Dias de fechamento'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-26T19:24:38.501Z'
    rota: '#/mensalistas/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de mensalista', 'Dados cadastrais', 'Configurações']
    abas: []
    campos:
      - rotulo: 'Jurídica'
        tipo: 'radio'
      - rotulo: 'Física'
        tipo: 'radio'
      - rotulo: 'Indicado por'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'Razão social'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'CNPJ'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Nome fantasia'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Representante'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'País'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Tipo de telefone'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Receber cobrança por WhatsApp'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Pós-pago'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Pré-pago'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Fechamento fatura'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Vencimento Fatura'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Ciclo de cobrança'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'E-mail (envio de extrato)'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Rótulos'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Observações'
        tipo: 'textarea'
        secao: 'Dados cadastrais'
      - rotulo: 'Possui filiais'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'Não utilizar boleto bancário'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'Gerar RPS no faturamentoGerar RPS no faturamentoAo selecionar essa opção, os serviços real'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'Repasse da taxa do boleto (provedor de pagamento)AtençãoAo selecionar essa opção, a taxa p'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'selecionarAnexoMensalista'
        tipo: 'file'
        secao: 'Dados cadastrais'
    botoes: ['Excluir', 'Adicionar', 'Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: ['Desconto (%)', 'E-mail (envio de extrato)', 'Enter', 'Dias de fechamento']
    correspondencias_sugeridas:
      - alvo: 'E-mail (envio de extrato)'
        elemento_real: 'E-mail (envio de extrato)'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 1
      - alvo: 'Dias de fechamento'
        elemento_real: 'Fechamento fatura'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 0.64
    alvos_sem_correspondencia: ['Desconto (%)', 'Enter']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 4, substituir Dias de fechamento por Fechamento fatura (campo da seção Dados cadastrais). E-mail (envio de extrato) existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Desconto (%), Enter não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Desconto (%)", "Dias de fechamento", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Fechamento de caixa (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/mensalistas/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de mensalista**, **Dados cadastrais**, **Configurações**.
> * **Campos:** **Jurídica**, **Física**, **Indicado por** (Dados cadastrais), **Razão social** (Dados cadastrais), **CNPJ** (Dados cadastrais), **Nome fantasia** (Dados cadastrais), **Representante** (Dados cadastrais), **CEP** (Dados cadastrais), **Logradouro** (Dados cadastrais), **Número** (Dados cadastrais), **Complemento** (Dados cadastrais), **Bairro** (Dados cadastrais), **País** (Dados cadastrais), **UF** (Dados cadastrais), **Cidade** (Dados cadastrais), **Tipo de telefone** (Dados cadastrais), **Telefone** (Dados cadastrais), **Receber cobrança por WhatsApp** (Dados cadastrais), **E-mail** (Dados cadastrais), **Pós-pago** (Dados cadastrais), **Pré-pago** (Dados cadastrais), **Fechamento fatura** (Dados cadastrais), **Vencimento Fatura** (Dados cadastrais), **Ciclo de cobrança** (Dados cadastrais), **E-mail (envio de extrato)** (Dados cadastrais) (+7).
> * **Botões:** **Excluir**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "E-mail (envio de extrato)":** **E-mail (envio de extrato)** (campo, 100% — termo(s) em comum: mail, envio, extrato; na seção "Dados cadastrais").
> * **Correspondência sugerida para "Dias de fechamento":** **Fechamento fatura** (campo, 64% — termo(s) em comum: fechamento; na seção "Dados cadastrais").
> * **Sem correspondência funcional na tela:** **Desconto (%)**, **Enter**.
> * Sugestão de reescrita: no passo 4, substituir **Dias de fechamento** por **Fechamento fatura** (campo da seção **Dados cadastrais**). **E-mail (envio de extrato)** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Desconto (%)**, **Enter** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar um novo cliente conveniado (Pessoa Física ou Jurídica), parametrizando regras de faturamento (pré ou pós-pago), percentual de desconto contratual, datas de fechamento e anexos comprobatórios.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Mensalistas** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Mensalistas** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Mensalistas"**, porém na versão atual do Orion TN a tela fica em **"Administração > Mensalistas > Mensalistas"** (confiança: 95% — O caminho documentado "Administração > Mensalistas" termina num submenu em cascata; a única tela homônima é o item filho "Administração > Mensalistas > Mensalistas"). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
2. Na seção **Dados cadastrais**, defina o **Tipo de pessoa** (**Física** ou **Jurídica**) e preencha Razão Social/Nome, CNPJ/CPF, Inscrição Estadual, endereço completo e dados de contato.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Dados cadastrais** · (2) **Tipo de pessoa** · (3) **Física** · (4) **Jurídica**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
3. Na seção **Configurações**, selecione o **Plano**:
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Plano** · (3) **Pós-pago** · (4) **Pré-pago**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   * **Pós-pago**: os serviços são lançados em conta e quitados no ciclo de fechamento.
   * **Pré-pago**: o sistema exige saldo de crédito prévio para liberar serviços no balcão.
4. Configure o percentual no campo **Desconto (%)**, informe os destinatários no campo **E-mail (envio de extrato)** pressionando **Enter** após cada e-mail, e adicione os **Dias de fechamento** clicando em **+**.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Demarcações na print:** (1) **E-mail (envio de extrato)** · (2) **Enter**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Desconto (%)"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Dias de fechamento"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Desconto (%)", "Dias de fechamento"
5. Na seção **Arquivos anexos**, clique em **Selecionar documentos** ou **Digitalizar** para anexar contrato social, procuração ou ficha cadastral.
6. Clique no botão **Salvar** para finalizar o cadastramento.

* **Importante: É possível cadastrar no máximo 3 dias de fechamento por mensalista.**
* **Observação: Para adicionar mais de um e-mail de extrato, é obrigatório pressionar a tecla **Enter** após digitar cada endereço.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
