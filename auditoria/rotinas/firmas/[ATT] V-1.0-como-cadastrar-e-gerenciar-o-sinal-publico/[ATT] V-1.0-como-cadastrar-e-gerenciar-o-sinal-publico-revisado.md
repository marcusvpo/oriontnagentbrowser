---
id: V-1.0
titulo: 'Como Cadastrar e Gerenciar o Sinal Público'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
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
        evidencia: 'dom-measured | text:data recebimento | x=1020, y=94, 133x40'
      - passo: 3
        alvo_documentado: '\'
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
        motivo: 'No passo 3, o manual cita "\", "data de recebimento/envio", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de priv'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'data de recebimento/envio'
          real: 'Data recebimento'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T06:17:45.332Z'
    rota: '#/sinalPublico/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de sinal público', 'Pessoas', 'Arquivos anexos']
    abas: []
    campos:
      - rotulo: 'Cartório'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Recebido'
        tipo: 'radio'
        secao: 'Pessoas'
      - rotulo: 'Enviado'
        tipo: 'radio'
        secao: 'Pessoas'
      - rotulo: 'Data recebimento'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Site'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Digitador'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Digitado em'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Pessoas'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Observações'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Nome'
        tipo: 'text'
        secao: 'Pessoas'
      - rotulo: 'Cargo'
        tipo: 'select'
        secao: 'Pessoas'
      - rotulo: 'selecionarAnexoSinalPublico'
        tipo: 'file'
        secao: 'Pessoas'
    botoes: ['Excluir', 'Adicionar', 'Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: ['\']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['\']
    sugestao_reescrita: 'Sugestão de reescrita: \ não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "\", "data de recebimento/envio", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Envio para Registro; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/sinalPublico/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de sinal público**, **Pessoas**, **Arquivos anexos**.
> * **Campos:** **Cartório** (Pessoas), **Recebido** (Pessoas), **Enviado** (Pessoas), **Data recebimento** (Pessoas), **E-mail** (Pessoas), **Site** (Pessoas), **Digitador** (Pessoas), **Digitado em** (Pessoas), **CEP** (Pessoas), **Logradouro** (Pessoas), **Número** (Pessoas), **Complemento** (Pessoas), **Bairro** (Pessoas), **UF** (Pessoas), **Cidade** (Pessoas), **Observações** (Pessoas), **Nome** (Pessoas), **Cargo** (Pessoas), **selecionarAnexoSinalPublico** (Pessoas).
> * **Botões:** **Excluir**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **\**.
> * Sugestão de reescrita: **\** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

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

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "\", "data de recebimento/envio", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de priv → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 3):** "data de recebimento/envio" → "Data recebimento" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
