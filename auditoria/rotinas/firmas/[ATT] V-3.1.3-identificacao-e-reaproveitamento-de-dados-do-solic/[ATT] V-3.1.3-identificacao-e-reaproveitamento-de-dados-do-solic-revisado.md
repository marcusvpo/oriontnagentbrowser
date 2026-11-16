---
id: V-3.1.3
titulo: 'Identificação e Reaproveitamento de Dados do Solicitante para Recibo de Protocolo'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Gerar Recibo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Gerar Recibo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Procedimento para identificar o solicitante responsável pelo ato notarial no **ORION TN** (exigência obrigatória para emissão do recibo), utilizando o recurso de busca por lupa para reaproveitar cadastros prévios de cartões de assinatura, cadastros de tomadores de NF-e, orçamentos ou protocolos anteriores.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela do protocolo, posicione o cursor sobre a opção **Gerar Recibo** para inspecionar as pendências (o sistema indicará a necessidade de preenchimento do documento e do nome do solicitante).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Gerar Recibo] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Na seção de **Solicitante**, localize os campos **CPF / CNPJ** e **Nome**:
   * No campo **CPF / CNPJ** (método mais recomendado e preciso), digite o número do documento da pessoa física ou jurídica; ou digite o nome no campo **Nome**.
   * Clique no ícone de **Lupa** ao lado do respectivo campo para realizar a busca no banco de dados.
3. Na lista de registros encontrados exibida na tela, selecione a fonte cadastral desejada:
   * **(Protocolo)**: reaproveita os dados completos do último protocolo lavrado para o solicitante.
   * **(Solicitante)**: reaproveita os dados do cadastro de solicitante feito no módulo de orçamentos.
   * **(Tomador)**: reaproveita os dados do cadastro de tomador de serviços da Nota Fiscal Eletrônica.
   * **(Cartão)**: reaproveita o cadastro completo e endereço constante no cartão de assinatura / autógrafo da pessoa.
4. Após clicar sobre o registro desejado, o sistema importará e preencherá automaticamente os dados do solicitante, incluindo documento, nome completo, telefone, e-mail e endereço.
5. Caso necessário, realize ajustes diretamente nos campos de endereço e contato exibidos na tela para este ato específico.

* **Observação: O solicitante é a pessoa física ou jurídica titular em nome de quem será formalizado o recibo de entrega e a documentação fiscal do protocolo.**
* **Observação: As modificações feitas nas informações do solicitante dentro da tela do protocolo são válidas exclusivamente para aquele ato notarial em andamento, sem alterar o cadastro de origem da ficha de assinatura ou tomador.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
