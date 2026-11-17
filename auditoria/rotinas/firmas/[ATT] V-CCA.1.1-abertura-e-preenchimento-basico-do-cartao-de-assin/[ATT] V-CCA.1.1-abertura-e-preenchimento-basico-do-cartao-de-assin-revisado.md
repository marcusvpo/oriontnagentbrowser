---
id: V-CCA.1.1
titulo: 'Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 5
        alvo_documentado: 'Lupa'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "\", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investig'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "\", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de '
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-17T16:33:41.125Z'
    rota: '#/ficha/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de cartão de assinatura', 'Papel de segurança', 'Selo digital', 'Dados pessoais', 'Contato', 'Endereço', 'Pessoa Jurídica - Representante', 'Arquivos anexos']
    abas: []
    campos:
      - rotulo: 'Filtro'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Nome'
        tipo: 'search'
        secao: 'Papel de segurança'
      - rotulo: 'Nome social'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Sexo'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Nascimento'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'RG'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Orgão emissor'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Data emissão'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CNH'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Categoria'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Data 1ª habilitação'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Data Expedição'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Data expiração'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Outro documento'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Nacionalidade'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Naturalidade'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Estado civil'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Profissão'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Pai'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Mãe'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Politicamente exposta (Prov. 88)'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Pessoa acusada de terrorismo'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Funcionário público'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Digitador'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Escrevente'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Digitado em'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Rótulos'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Observações'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de e-mail'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Principal'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Notificar'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de telefone'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de endereço'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'País'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Razão social'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CNPJ'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'selecionarAnexoFichaRegistra'
        tipo: 'file'
        secao: 'Papel de segurança'
    botoes: ['Preencher cartão usando I.A.', 'Consumir', 'Gerar', 'Consulta Central de notificações de suspeitos (CNS).', 'Adicionar', 'Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Lupa", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/ficha/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de cartão de assinatura**, **Papel de segurança**, **Selo digital**, **Dados pessoais**, **Contato**, **Endereço**, **Pessoa Jurídica - Representante**, **Arquivos anexos**.
> * **Campos:** **Filtro** (Papel de segurança), **Nome** (Papel de segurança), **Nome social** (Papel de segurança), **Sexo** (Papel de segurança), **Nascimento** (Papel de segurança), **CPF ou CIN** (Papel de segurança), **RG** (Papel de segurança), **Orgão emissor** (Papel de segurança), **UF** (Papel de segurança), **Data emissão** (Papel de segurança), **CNH** (Papel de segurança), **Categoria** (Papel de segurança), **Data 1ª habilitação** (Papel de segurança), **Data Expedição** (Papel de segurança), **Data expiração** (Papel de segurança), **Outro documento** (Papel de segurança), **Número** (Papel de segurança), **Nacionalidade** (Papel de segurança), **Naturalidade** (Papel de segurança), **Estado civil** (Papel de segurança), **Profissão** (Papel de segurança), **Pai** (Papel de segurança), **Mãe** (Papel de segurança), **Politicamente exposta (Prov. 88)** (Papel de segurança), **Pessoa acusada de terrorismo** (Papel de segurança) (+22).
> * **Botões:** **Preencher cartão usando I.A.**, **Consumir** (desabilitado), **Gerar** (desabilitado), **Consulta Central de notificações de suspeitos (CNS).**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
O cadastro de cartão de assinatura (ficha de autógrafo/firma) registra a qualificação completa, dados documentais e parâmetros civis da pessoa física para subsidiar os atos de reconhecimento de firma e lavratura de escrituras/procurações. O Orion TN disponibiliza buscas inteligentes para reaproveitamento ágil de cadastros pré-existentes na base de dados notarial e validações em tempo real de consistência cadastral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
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
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
5. Para reaproveitar dados já cadastrados e agilizar o atendimento:
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Demarcações na print:** (1) **Nome** · (2) **CPF**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Lupa"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Lupa"
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

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "\", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de  → **mantido** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
