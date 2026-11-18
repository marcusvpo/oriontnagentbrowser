---
id: R-10.0
titulo: 'Abrir Pedido de Firmas no Balcão de Atendimento'
modulo: firmas
secao: R
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['"+" (Adicionar Novo Pedido)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Novo cartão'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Reconhecimento de Firmas ou Firmas > Balcão de Firmas'
        elemento_real: 'Firmas > Reconhecimento de firmas'
        camada: menu_path_resolution
        confianca: 1
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwmp53i2dputzj-7] | x=471, y=67, 162x21'
  historico_reauditoria:
    - data: '2026-11-18'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'validado_com_ajustes'
      tags_atuais: []
      bloqueio_superado: null
      curas_reaproveitadas:
        - passo: 2
          alvo: '"+" (Adicionar Novo Pedido)'
          real: 'Novo cartão +'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 3
          alvo: 'Confirmar'
          real: 'Sim'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: null
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Confirmar'
          real: 'Concluir'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 4
          alvo: 'CPF'
          real: 'CPF ou CIN'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Reconhecimento de Firmas ou Firmas > Balcão de Firmas'
          real: 'Firmas > Reconhecimento de firmas'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T22:35:52.137Z'
    rota: '#/pedidoFirmas/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Reconhecimento de firmas', 'Serviços solicitados', 'Serviços realizados']
    abas: []
    campos:
      - rotulo: 'Pedido/Senha'
        tipo: 'text'
      - rotulo: 'Senha SGA'
        tipo: 'text'
      - rotulo: 'Data'
        tipo: 'text'
      - rotulo: 'Status'
        tipo: 'text'
      - rotulo: 'Tipo de pedido'
        tipo: 'select'
      - rotulo: 'Solicitante'
        tipo: 'text'
      - rotulo: 'CPF ou CIN/CNPJ'
        tipo: 'text'
      - rotulo: 'Filtro'
        tipo: 'checkbox'
      - rotulo: 'Cartão'
        tipo: 'radio'
      - rotulo: 'Sinal'
        tipo: 'radio'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'Nº cartão'
        tipo: 'text'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'RG'
        tipo: 'text'
      - rotulo: 'Pessoa jurídica'
        tipo: 'text'
      - rotulo: 'Busca por fonética'
        tipo: 'checkbox'
      - rotulo: 'Começa com'
        tipo: 'radio'
      - rotulo: 'Contém'
        tipo: 'radio'
      - rotulo: 'Cod.'
        tipo: 'text'
      - rotulo: 'Nome do serviço'
        tipo: 'text'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Cálculo'
        tipo: 'select'
      - rotulo: 'QTD'
        tipo: 'text'
      - rotulo: 'Observação'
        tipo: 'text'
    botoes: ['Preencha o número do pedido', 'Preencha a senha SGA', 'Buscar biometria', 'Novo cartão', 'Limpar', 'Filtrar', 'Tomador', 'Pagamento', 'Termo']
    alvos_do_passo: ['"+" (Adicionar Novo Pedido)']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['"+" (Adicionar Novo Pedido)']
    sugestao_reescrita: 'Sugestão de reescrita: "+" (Adicionar Novo Pedido) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita ""+" (Adicionar Novo Pedido)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Novo cartão"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Abertura de pedido (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/pedidoFirmas/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Reconhecimento de firmas**, **Serviços solicitados**, **Serviços realizados**.
> * **Campos:** **Pedido/Senha**, **Senha SGA**, **Data**, **Status**, **Tipo de pedido**, **Solicitante**, **CPF ou CIN/CNPJ**, **Filtro**, **Cartão**, **Sinal**, **Nome**, **Nº cartão**, **CPF ou CIN**, **RG**, **Pessoa jurídica**, **Busca por fonética**, **Começa com**, **Contém**, **Cod.**, **Nome do serviço**, **Escrevente**, **Cálculo**, **QTD**, **Observação**.
> * **Botões:** **Preencha o número do pedido** (desabilitado), **Preencha a senha SGA** (desabilitado), **Buscar biometria**, **Novo cartão**, **Limpar**, **Filtrar** (desabilitado), **Tomador** (desabilitado), **Pagamento** (desabilitado), **Termo** (desabilitado).
> * **Sem correspondência funcional na tela:** **"+" (Adicionar Novo Pedido)**.
> * Sugestão de reescrita: **"+" (Adicionar Novo Pedido)** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
A abertura do Pedido de Firmas é a primeira etapa do atendimento de balcão, criando a ordem de serviço que receberá a vinculação dos signatários e os atos a serem executados.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Reconhecimento de firmas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Reconhecimento de Firmas ou Firmas > Balcão de Firmas"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Reconhecimento de firmas"** (confiança: 100% — Alternativa de menu inexistente (Firmas > Balcão de Firmas) removida após comprovar "Firmas > Reconhecimento de firmas" na árvore real). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
2. Na parte superior da tela de atendimento, clique no botão de **"+" (Adicionar Novo Pedido)**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Serviço, QTD, Série, Seq. Inicial, Seq. Final, R$ Unitário).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual ["+" (Adicionar Novo Pedido)] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. Uma mensagem de confirmação será exibida na tela; clique em **Confirmar** para inicializar a comanda.
4. O sistema gerará o número sequencial do pedido e liberará os campos de pesquisa de ficha por **Nome** ou **CPF**.
5. Localize as partes e prossiga com o lançamento dos reconhecimentos e autenticações necessários.

* **Observação: Se a sua serventia utiliza o chamador de senhas Siplan SGA, o pedido pode ser aberto automaticamente ao chamar a senha da fila.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** (sem tag) validado_com_ajustes → [ATT] atualizacao_editorial
* **Cura reaproveitada (passo 3):** "Confirmar" → "Concluir" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 4):** "CPF" → "CPF ou CIN" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Firmas > Reconhecimento de Firmas ou Firmas > Balcão de Firmas" → "Firmas > Reconhecimento de firmas" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
