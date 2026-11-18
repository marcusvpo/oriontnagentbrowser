---
id: C-CERT-01
titulo: 'Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Modalidade de Cobrança', 'Isenta / Gratuita']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Certidões > Novo Pedido de Certidão ou Notas > Certidões'
        elemento_real: 'Notas > Nova certidão e serviço'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlh8y1y21oksj-23] | x=503, y=129, 183x21'
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Modalidade de Cobrança", "Isenta / Gratuita", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oc'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Certidões > Novo Pedido de Certidão'
          real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Certidões > Novo Pedido de Certidão" não existe na árvore de navegação real do Orion TN. O menu raiz "Certidões" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Admin'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Modalidade de Cobrança", "Isenta / Gratuita", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiênci'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Certidões > Novo Pedido de Certidão ou Notas > Certidões'
          real: 'Notas > Nova certidão e serviço'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T02:06:12.151Z'
    rota: '#/certidoesServicos/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Certidões e serviços']
    abas: []
    campos:
      - rotulo: 'Pedido'
        tipo: 'text'
      - rotulo: 'Data pedido'
        tipo: 'text'
      - rotulo: 'Recibo'
        tipo: 'text'
      - rotulo: 'Data recibo'
        tipo: 'text'
      - rotulo: 'Previsão de entrega'
        tipo: 'text'
      - rotulo: 'Status'
        tipo: 'text'
      - rotulo: 'Situação'
        tipo: 'select'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Certidões e serviços'
        tipo: 'select'
      - rotulo: 'Escrevente assinante (Substituto):'
        tipo: 'select'
      - rotulo: 'Auxiliar do escrevente:'
        tipo: 'select'
      - rotulo: 'Escrevente que colheu as assinaturas'
        tipo: 'select'
      - rotulo: 'Pessoa física'
        tipo: 'radio'
      - rotulo: 'Pessoa jurídica'
        tipo: 'radio'
      - rotulo: 'Mensalista'
        tipo: 'radio'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'Tomador'
        tipo: 'checkbox'
      - rotulo: 'Informar intermediador'
        tipo: 'checkbox'
      - rotulo: 'Tipo de endereço'
        tipo: 'select'
      - rotulo: 'CEP'
        tipo: 'text'
      - rotulo: 'Logradouro'
        tipo: 'text'
      - rotulo: 'Número'
        tipo: 'text'
      - rotulo: 'Complemento'
        tipo: 'text'
      - rotulo: 'Bairro'
        tipo: 'text'
      - rotulo: 'País'
        tipo: 'select'
      - rotulo: 'UF'
        tipo: 'select'
      - rotulo: 'Cidade'
        tipo: 'text'
      - rotulo: 'Cód. IBGE'
        tipo: 'text'
      - rotulo: 'Tipo de telefone'
        tipo: 'select'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'Tipo de e-mail'
        tipo: 'select'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Observação'
        tipo: 'textarea'
      - rotulo: 'Vigência'
        tipo: 'select'
      - rotulo: 'Número da guia'
        tipo: 'text'
      - rotulo: 'ckbToggleCustasProtocolo'
        tipo: 'checkbox'
      - rotulo: 'inputCodigoItemServicoprotocoloCustasRegistra00'
        tipo: 'text'
      - rotulo: 'inputNomeServicoprotocoloCustasRegistra00'
        tipo: 'text'
      - rotulo: 'inputQuantidadeCalculoprotocoloCustasRegistra00'
        tipo: 'text'
      - rotulo: 'selectDivisorServicoprotocoloCustasRegistra00'
        tipo: 'select'
      - rotulo: 'inputNomeOutrosServicos0e2b5'
        tipo: 'text'
      - rotulo: 'quantidadeOutrosServicos0e2b5'
        tipo: 'text'
      - rotulo: 'inputValorOutrosServicos0e2b5'
        tipo: 'text'
      - rotulo: 'ckbToggleEditor'
        tipo: 'checkbox'
      - rotulo: 'Documentos e anexos'
        tipo: 'checkbox'
    botoes: []
    alvos_do_passo: ['Modalidade de Cobrança', 'Isenta / Gratuita']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Modalidade de Cobrança', 'Isenta / Gratuita']
    sugestao_reescrita: 'Sugestão de reescrita: Modalidade de Cobrança, Isenta / Gratuita não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Modalidade de Cobrança", "Isenta / Gratuita", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/certidoesServicos/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Certidões e serviços**.
> * **Campos:** **Pedido**, **Data pedido**, **Recibo**, **Data recibo**, **Previsão de entrega**, **Status**, **Situação**, **Escrevente**, **Certidões e serviços**, **Escrevente assinante (Substituto):**, **Auxiliar do escrevente:**, **Escrevente que colheu as assinaturas**, **Pessoa física**, **Pessoa jurídica**, **Mensalista**, **CPF ou CIN**, **Nome**, **Tomador**, **Informar intermediador**, **Tipo de endereço**, **CEP**, **Logradouro**, **Número**, **Complemento**, **Bairro** (+21).
> * **Sem correspondência funcional na tela:** **Modalidade de Cobrança**, **Isenta / Gratuita**.
> * Sugestão de reescrita: **Modalidade de Cobrança**, **Isenta / Gratuita** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Certidões emitidas sob assistência judiciária gratuita ou por requisição judicial possuem código de selo e regramento tributário próprio. O sistema exige a especificação do fundamento legal da isenção.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão** (ou **Notas > Certidões**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Nova certidão e serviço**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Certidões > Novo Pedido de Certidão ou Notas > Certidões"**, porém na versão atual do Orion TN a tela fica em **"Notas > Nova certidão e serviço"** (confiança: 90% — Equivalência canônica "Certidões > Novo Pedido de Certidão" -> "Notas > Nova certidão e serviço": o módulo raiz "Certidões" foi absorvido por "Notas"; "Nova certidão e serviço" é o único item de criação de pedido de certidão). O texto do manual não foi alterado.
2. No formulário inicial do pedido, altere o campo **Modalidade de Cobrança** de `Normal / Paga` para **Isenta / Gratuita**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Modalidade de Cobrança, Isenta / Gratuita] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. No campo **Motivo Legal da Gratuidade**, selecione o dispositivo correspondente (ex.: **Assistência Judiciária Gratuita**, **Requisição Judicial**, **Defensoria Pública** ou **Poder Público**).
4. Na aba **Cálculo de Custas**, certifique-se de que todas as linhas de emolumentos exibam `R$ 0,00`.
5. No editor da certidão, carregue o texto de breve relato ou inteiro teor.
6. Clique no botão **Finalizar e Emitir Selo Digital**.
7. O Orion TN transmitirá o selo ao tribunal sob a tipologia isenta homologada e emitirá o recibo zerado.

* **Auditoria de Gratuidade: Sempre anexe o ofício judicial ou declaração de pobreza digitalizada no GED da certidão para respaldo em correições.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Modalidade de Cobrança", "Isenta / Gratuita", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiênci → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Certidões > Novo Pedido de Certidão ou Notas > Certidões" → "Notas > Nova certidão e serviço" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
