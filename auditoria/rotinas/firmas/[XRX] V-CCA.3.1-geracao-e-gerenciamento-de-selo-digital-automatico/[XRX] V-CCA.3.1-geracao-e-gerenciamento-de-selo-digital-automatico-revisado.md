---
id: V-CCA.3.1
titulo: 'Geração e Gerenciamento de Selo Digital (Automático e Manual) no Cartão de Assinatura'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.3', 'M-9.0', 'V-CCA.3.3']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Selo Digital']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentado e não concluiu: "Concluir" permaneceu desabilitado após o preenchimento.. Outra rotina do sistema gera esses registros: D-3.3 — Cadastrar Cartão de Assinatura; M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais); V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
O Orion TN permite a aplicação de Selo Digital do Tribunal de Justiça (TJ) no cadastro de cartões de assinatura, com suporte à geração totalmente automática no salvamento da ficha ou acionamento sob demanda (manual). O sistema disponibiliza ferramentas para consulta do QR Code oficial, controle de comunicação com o webservice do TJ, reutilização e cancelamento de selos.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
2. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina V-CCA.3.1.

* **Rotinas pré-requisito (executar antes):** **D-3.3**, **M-9.0**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Identifique o fluxo de geração de **Selo Digital** configurado na sua serventia:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Selo Digital, Fluxo A - Geração Automática, Concluir, QR Code, Fluxo B - Geração Manual, Gerar] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
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

* **Observação: A obrigatoriedade de transmissão do selo digital para cartões de assinatura varia de acordo com o Provimento da Corregedoria Geral da Justiça de cada Estado, cabendo ao titular da serventia definir a parametrização do sistema (automática, manual ou desativada).**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
