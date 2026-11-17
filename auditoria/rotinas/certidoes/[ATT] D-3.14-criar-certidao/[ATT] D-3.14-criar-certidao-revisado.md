---
id: D-3.14
titulo: Criar Certidão
modulo: certidoes
secao: D
auditoria_ui:
  data_execucao: 2026-11-17
  status: atualizacao_editorial
  review_tags:
    - ATT
  carga: mutation
  worker_id: worker-2
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes:
        - Identificação do Solicitante
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: Notas > Certidões > Novo Pedido de Certidão
        elemento_real: Notas > Certidões e serviços
        camada: menu_path_resolution
        confianca: 0.98
        texto_alterado: false
        evidencia: menu-tree | [data-orion-audit-menu-mmwk8grc32pcyx7-23] | x=503, y=129, 183x21
  historico_reauditoria:
    - data: 2026-11-17
      ambiente_anterior: não registrado (anterior ao ADR-025)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Certidões > Novo Pedido de Certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Protocolos", "Orçamentos", "Orçame'
      bloqueio_atual:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: No passo 2, o manual cita "Identificação do Solicitante", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio
      bloqueio_atual:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      curas_reaproveitadas:
        - passo: 1
          alvo: Notas > Certidões > Novo Pedido de Certidão
          real: Notas > Certidões e serviços
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: 2026-11-17T05:11:22.552Z
    rota: "#/certidoesServicos/cadastrar"
    titulo_painel: OrionTN - Tabelionatos de Notas
    em_modal: false
    secoes:
      - Certidões e serviços
    abas: []
    campos:
      - rotulo: Pedido
        tipo: text
      - rotulo: Data pedido
        tipo: text
      - rotulo: Recibo
        tipo: text
      - rotulo: Data recibo
        tipo: text
      - rotulo: Previsão de entrega
        tipo: text
      - rotulo: Status
        tipo: text
      - rotulo: Situação
        tipo: select
      - rotulo: Escrevente
        tipo: select
      - rotulo: Certidões e serviços
        tipo: select
      - rotulo: "Escrevente assinante (Substituto):"
        tipo: select
      - rotulo: "Auxiliar do escrevente:"
        tipo: select
      - rotulo: Escrevente que colheu as assinaturas
        tipo: select
      - rotulo: Pessoa física
        tipo: radio
      - rotulo: Pessoa jurídica
        tipo: radio
      - rotulo: Mensalista
        tipo: radio
      - rotulo: CPF ou CIN
        tipo: text
      - rotulo: Nome
        tipo: text
      - rotulo: Tomador
        tipo: checkbox
      - rotulo: Informar intermediador
        tipo: checkbox
      - rotulo: Tipo de endereço
        tipo: select
      - rotulo: CEP
        tipo: text
      - rotulo: Logradouro
        tipo: text
      - rotulo: Número
        tipo: text
      - rotulo: Complemento
        tipo: text
      - rotulo: Bairro
        tipo: text
      - rotulo: País
        tipo: select
      - rotulo: UF
        tipo: select
      - rotulo: Cidade
        tipo: text
      - rotulo: Cód. IBGE
        tipo: text
      - rotulo: Tipo de telefone
        tipo: select
      - rotulo: Telefone
        tipo: text
      - rotulo: Tipo de e-mail
        tipo: select
      - rotulo: E-mail
        tipo: text
      - rotulo: Observação
        tipo: textarea
      - rotulo: Vigência
        tipo: select
      - rotulo: Número da guia
        tipo: text
      - rotulo: ckbToggleCustasProtocolo
        tipo: checkbox
      - rotulo: inputCodigoItemServicoprotocoloCustasRegistra00
        tipo: text
      - rotulo: inputNomeServicoprotocoloCustasRegistra00
        tipo: text
      - rotulo: inputQuantidadeCalculoprotocoloCustasRegistra00
        tipo: text
      - rotulo: selectDivisorServicoprotocoloCustasRegistra00
        tipo: select
      - rotulo: inputNomeOutrosServicos04073
        tipo: text
      - rotulo: quantidadeOutrosServicos04073
        tipo: text
      - rotulo: inputValorOutrosServicos04073
        tipo: text
      - rotulo: ckbToggleEditor
        tipo: checkbox
      - rotulo: Documentos e anexos
        tipo: checkbox
    botoes: []
    alvos_do_passo:
      - Identificação do Solicitante
    correspondencias_sugeridas: []
    alvos_sem_correspondencia:
      - Identificação do Solicitante
    sugestao_reescrita: "Sugestão de reescrita: Identificação do Solicitante não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida."
    print_contexto: passo-02.png
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T18:11:10.127Z
  governanca_comentario: "No passo 1 ('Notas > Certidões > Novo Pedido de Certidão'), o agente curou erroneamente para o campo de busca global ('Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B') em vez de abrir o menu 'Notas' no cabeçalho, o que quebrou o passo 2 ('Identificação do Solicitante'). No menu Notas atual, as opções reais são 'Certidões e serviços' e 'Certidões e serviços em aberto'."
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Identificação do Solicitante", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/certidoesServicos/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Certidões e serviços**.
> * **Campos:** **Pedido**, **Data pedido**, **Recibo**, **Data recibo**, **Previsão de entrega**, **Status**, **Situação**, **Escrevente**, **Certidões e serviços**, **Escrevente assinante (Substituto):**, **Auxiliar do escrevente:**, **Escrevente que colheu as assinaturas**, **Pessoa física**, **Pessoa jurídica**, **Mensalista**, **CPF ou CIN**, **Nome**, **Tomador**, **Informar intermediador**, **Tipo de endereço**, **CEP**, **Logradouro**, **Número**, **Complemento**, **Bairro** (+21).
> * **Sem correspondência funcional na tela:** **Identificação do Solicitante**.
> * Sugestão de reescrita: **Identificação do Solicitante** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Esta rotina inicia a lavratura de certidões oficiais de atos lavrados no cartório (escrituras, testamentos, procurações e atas notariais). Permite selecionar o formato da certidão (Inteiro Teor, Breve Relatório ou Reprográfica), consultar o ato original e gerar o recibo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Certidões e serviços**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Certidões > Novo Pedido de Certidão"**, porém na versão atual do Orion TN a tela fica em **"Notas > Certidões e serviços"** (confiança: 98% — Diretriz soberana da revisão humana em D-3.14 ("Notas > Certidões > Novo Pedido de Certidão" -> "Notas > Certidões e serviços")). O texto do manual não foi alterado.
2. Preencha a **Identificação do Solicitante** (Nome, CPF e telefone de contato).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Identificação do Solicitante] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Selecione o **Tipo de Certidão**: **Inteiro Teor**, **Breve Relatório** ou **Reprográfica**.
4. Localize o ato original informando o **Tipo de Livro**, **Número do Livro**, **Folha** e **Ato**.
5. O sistema importará os dados do ato e calculará os emolumentos correspondentes.
6. Clique em **Concluir Pedido** para salvar e disponibilizar o pagamento no caixa.

* **Importante: Caso o ato original possua imagens indexadas na Digitalização em Lote, o tipo Reprográfica puxará as folhas digitalizadas automaticamente.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Identificação do Solicitante", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Notas > Certidões > Novo Pedido de Certidão" → "Notas > Certidões e serviços" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
