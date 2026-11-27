---
id: M-49.0
titulo: 'Cadastrar Nova Filial'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Descrição da Filial']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 2
      estado_restaurado: true
      gatilhos_testados:
        - tipo: checkbox
          rotulo: 'Filial padrão'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'Descrição da Filial'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T19:32:32.601Z'
    rota: '#/filiais/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de filial', 'Dados cadastrais', 'Configurações']
    abas: []
    campos:
      - rotulo: 'inputNomeMensalista'
        tipo: 'text'
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
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Filial padrão'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'Pós-pago'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Pré-pago'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Desconto (%)'
        tipo: 'text'
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
      - rotulo: 'Gerar RPS no faturamentoGerar RPS no faturamentoAo selecionar essa opção, os serviços real'
        tipo: 'checkbox'
        secao: 'Dados cadastrais'
      - rotulo: 'selecionarAnexoMensalista'
        tipo: 'file'
        secao: 'Dados cadastrais'
    botoes: ['Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: ['Descrição da Filial', 'CNPJ']
    correspondencias_sugeridas:
      - alvo: 'Descrição da Filial'
        elemento_real: 'Cadastro de filial'
        tipo: 'seção'
        similaridade: 0.66
      - alvo: 'CNPJ'
        elemento_real: 'CNPJ'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 0.85
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Descrição da Filial por Cadastro de filial (seção). CNPJ existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Descrição da Filial", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (caixa de seleção "Filial padrão"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/filiais/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de filial**, **Dados cadastrais**, **Configurações**.
> * **Campos:** **inputNomeMensalista** (Dados cadastrais), **Razão social** (Dados cadastrais), **CNPJ** (Dados cadastrais), **Nome fantasia** (Dados cadastrais), **CEP** (Dados cadastrais), **Logradouro** (Dados cadastrais), **Número** (Dados cadastrais), **Complemento** (Dados cadastrais), **Bairro** (Dados cadastrais), **UF** (Dados cadastrais), **Cidade** (Dados cadastrais), **Telefone** (Dados cadastrais), **E-mail** (Dados cadastrais), **Filial padrão** (Dados cadastrais), **Pós-pago** (Dados cadastrais), **Pré-pago** (Dados cadastrais), **Desconto (%)** (Dados cadastrais), **E-mail (envio de extrato)** (Dados cadastrais), **Rótulos** (Dados cadastrais), **Observações** (Dados cadastrais), **Gerar RPS no faturamentoGerar RPS no faturamentoAo selecionar essa opção, os serviços real** (Dados cadastrais), **selecionarAnexoMensalista** (Dados cadastrais).
> * **Botões:** **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Descrição da Filial":** **Cadastro de filial** (seção, 66% — termo(s) em comum: filial).
> * **Correspondência sugerida para "CNPJ":** **CNPJ** (campo, 85% — termo(s) em comum: cnpj; na seção "Dados cadastrais").
> * Sugestão de reescrita: no passo 3, substituir **Descrição da Filial** por **Cadastro de filial** (seção). **CNPJ** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Permite cadastrar uma nova unidade filial sob a titularidade de uma Pessoa Jurídica mensalista já existente, definindo endereço da sucursal, CNPJ com sufixo filial, regras próprias de desconto e datas de fechamento.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Mensalistas > Filiais** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Filiais** · (4) **Adicionar**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
2. No campo **Mensalista**, selecione obrigatoriamente a empresa matriz principal à qual a filial pertence.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
3. Na seção de identificação, preencha a **Descrição da Filial** (ex: 'Filial Centro', 'Unidade Shopping'), o **CNPJ** próprio da unidade e a Inscrição Estadual.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Descrição da Filial"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Descrição da Filial"
4. Preencha o endereço completo da filial, telefone de contato e o campo **E-mail (envio de extrato)** pressionando **Enter** após cada e-mail.
5. Na seção de faturamento, configure o **Desconto (%)** e adicione o **Dia de fechamento** específico da unidade clicando no botão **+**.
6. Clique no botão **Salvar** para registrar a filial no sistema.

* **Importante: A seleção da matriz no campo 'Mensalista' é obrigatória para consolidar a hierarquia societária no faturamento.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
