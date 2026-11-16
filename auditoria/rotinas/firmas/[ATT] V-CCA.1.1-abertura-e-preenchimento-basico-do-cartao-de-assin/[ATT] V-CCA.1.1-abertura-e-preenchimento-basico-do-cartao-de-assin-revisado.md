---
id: V-CCA.1.1
titulo: 'Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['\']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 9
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 4
        alvo_documentado: '\'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "\", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (9 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O cadastro de cartão de assinatura (ficha de autógrafo/firma) registra a qualificação completa, dados documentais e parâmetros civis da pessoa física para subsidiar os atos de reconhecimento de firma e lavratura de escrituras/procurações. O Orion TN disponibiliza buscas inteligentes para reaproveitamento ágil de cadastros pré-existentes na base de dados notarial e validações em tempo real de consistência cadastral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Na tela de gerenciamento de cartões de assinatura, clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
3. O sistema abrirá o formulário de cadastro dinâmico com os campos disponíveis para preenchimento.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
4. Identifique os campos com asterisco (**\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF**, além de eventuais campos customizados pela serventia).
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Demarcações na print:** (1) **Nome** · (2) **CPF**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"\"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "\"
5. Para reaproveitar dados já cadastrados e agilizar o atendimento:
   * No campo **Nome**, digite o nome completo ou parcial e clique no ícone da **Lupa** ao lado do campo; ou
   * No campo **CPF**, digite o número do documento e clique no ícone da **Lupa** ao lado do campo para uma busca exata.
6. Na lista de resultados apresentada pelo sistema:
   * Registros identificados com a indicação **(Protocolo)** carregam as informações do índice de escrituras/procurações do último protocolo cadastrado para aquele CPF/Nome.
   * Registros identificados como **(Cartão de Assinatura)** carregam os dados da última ficha de firma preenchida no sistema.
7. Selecione o registro desejado; o sistema exibirá uma mensagem de confirmação para a importação dos dados; clique em **Confirmar** (ou **Sim**).
8. Os campos da ficha serão automaticamente populados, permanecendo todos abertos para edição, correção ou complementação.
9. Preencha ou confira os dados pessoais e civis:
   * **Estado Civil**: Selecione o estado civil correspondente.
   * **Dados do Cônjuge**: Note que os campos de qualificação do cônjuge são dinâmicos e só serão exibidos na tela se o estado civil selecionado for **Casado** (permanecendo ocultos para **Solteiro**, **Divorciado**, etc.).
   * **Documento de Identidade (RG / CNH)**: Informe número, órgão emissor, UF e data de emissão. Se desejar, anexe uma digitalização do documento ou capture uma foto diretamente pela webcam clicando no ícone correspondente junto ao campo.
   * Passe o mouse sobre o ícone informativo (**i**) ao lado dos campos para visualizar instruções detalhadas de preenchimento.
10. Valide o preenchimento:
   * Se houver algum campo obrigatório não preenchido ou dado inconsistente (por exemplo, uma data de nascimento inválida), o botão **Concluir** na parte inferior permanecerá inativo (cinza) com um ícone de **Triângulo de Alerta**.
   * Posicione o mouse sobre o alerta para identificar a pendência, corrija o campo apontado e o botão **Concluir** será imediatamente liberado.
11. Clique no botão **Concluir** para salvar a ficha (caso não vá inserir mídias ou anexos neste momento).

* **Observação: O preenchimento correto do CPF e do Nome completo é a chave primária para a busca unificada de firmas em todo o sistema. A importação de dados de protocolos ou cartões anteriores não bloqueia nenhuma alteração cadastral necessária.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
