---
id: V-1.0
titulo: 'Como Cadastrar e Gerenciar o Sinal Público'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['\']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 1
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'data de recebimento/envio'
        elemento_real: 'Data recebimento'
        camada: a11y_fuzzy_match
        confianca: 0.81
        texto_alterado: false
        evidencia: 'dom-measured | text:data recebimento | x=1020, y=117, 122x50'
      - passo: 3
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
> **Motivo Técnico:** No passo 3, o manual cita "\", "data de recebimento/envio", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Envio para Registro; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Esta rotina orienta sobre o fluxo completo de gerenciamento do Sinal Público, desde o cadastro de um novo registro até a consulta e manutenção dos sinais existentes.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Cadastros > Sinal Público**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Sinal público**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Sinal, Cartório, Data digitação, Situação).
2. Na tela de consulta, clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
3. Preencha as informações do cartório de origem. Os campos marcados com asterisco (**\***) são de preenchimento obrigatório:
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **recebido** · (2) **enviado** · (3) **Data recebimento** · (4) **CEP**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"data de recebimento/envio"**, porém na tela atual do Orion TN o elemento se chama **"Data recebimento"** (confiança: 81% — Similaridade semântica na árvore de acessibilidade (77%)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"\"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "\", "data de recebimento/envio"
   * Defina se o sinal público é **recebido** ou **enviado**.
   * Informe a **data de recebimento/envio**.
   * Ao inserir o **CEP**, o sistema preencherá automaticamente os campos de endereço (Logradouro, Cidade, UF, etc.).
4. Na aba **Pessoas**, preencha o nome e o cargo do escrevente. Para adicionar mais de um, clique no botão **+**.
5. Na aba **Arquivos Anexos**, você pode:
   * Clicar em **Selecionar** para anexar documentos já existentes (PDF, JPG, etc.).
   * Clicar em **Capturar** para tirar uma foto do escrevente com a webcam.
   * Clicar em **Digitalizar** para escanear um documento na hora.
6. Após preencher todas as informações, clique em **Concluir**.

* **Andamentos: Visualizar o histórico de logs do cadastro.**
* **Anexos: Ver os documentos anexados.**
* **Visualizar: Abrir o cadastro em modo de leitura.**
* **Editar: Alterar as informações do cadastro.**
* **Inativar: Desativar o sinal público.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
