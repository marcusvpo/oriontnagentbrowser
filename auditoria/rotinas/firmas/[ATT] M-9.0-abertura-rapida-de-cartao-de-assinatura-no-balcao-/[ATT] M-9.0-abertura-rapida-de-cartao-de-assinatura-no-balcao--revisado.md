---
id: M-9.0
titulo: 'Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Contato e Endereço']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 7
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Cadastro > Cartão de assinatura'
        elemento_real: 'Firmas > Cadastros > Cartão de assinatura'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlo32iig0vyhf-12] | x=633, y=109, 330x20'
      - passo: 2
        alvo_documentado: 'Nome completo'
        elemento_real: 'Nome'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | text:nome | x=20, y=286, 299x40'
      - passo: 2
        alvo_documentado: 'RG/CNH'
        elemento_real: 'RG + CNH'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | text:rg | x=20, y=326, 135x40'
      - passo: 3
        alvo_documentado: 'Data de nascimento'
        elemento_real: 'Nascimento'
        camada: a11y_fuzzy_match
        confianca: 0.93
        texto_alterado: false
        evidencia: 'dom-measured | text:nascimento | x=806, y=286, 139x40'
      - passo: 4
        alvo_documentado: 'Contato e Endereço'
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
        motivo: 'No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio.'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Dados pessoais'
          real: 'Dados pessoais'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Cadastro > Cartão de assinatura'
          real: 'Firmas > Cadastros > Cartão de assinatura'
          confirmada_ao_vivo: true
          usada_como_dica: true
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
        motivo: 'No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Inves'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Dados pessoais'
          real: 'Dados pessoais'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Cadastro > Cartão de assinatura'
          real: 'Firmas > Cadastros > Cartão de assinatura'
          confirmada_ao_vivo: true
          usada_como_dica: true
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
        motivo: 'No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Inves'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Dados pessoais'
          real: 'Dados pessoais'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Cadastro > Cartão de assinatura'
          real: 'Firmas > Cadastros > Cartão de assinatura'
          confirmada_ao_vivo: true
          usada_como_dica: true
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Contato e Endereço", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigat'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Nome completo'
          real: 'Nome'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 2
          alvo: 'RG/CNH'
          real: 'RG + CNH'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: 'Data de nascimento'
          real: 'Nascimento'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Cadastro > Cartão de assinatura'
          real: 'Firmas > Cadastros > Cartão de assinatura'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-18T05:23:36.051Z'
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
    botoes: ['Preencher cartão usando I.A.', 'Consumir', 'Gerar', 'Consulta Central de notificações de suspeitos (CNS).', 'Excluir', 'Adicionar', 'Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: ['Contato e Endereço', 'CEP']
    correspondencias_sugeridas:
      - alvo: 'Contato e Endereço'
        elemento_real: 'Endereço'
        tipo: 'seção'
        similaridade: 0.61
      - alvo: 'Contato e Endereço'
        elemento_real: 'Contato'
        tipo: 'seção'
        similaridade: 0.55
      - alvo: 'Contato e Endereço'
        elemento_real: 'Tipo de endereço'
        tipo: 'campo'
        secao: 'Papel de segurança'
        similaridade: 0.53
      - alvo: 'CEP'
        elemento_real: 'CEP'
        tipo: 'campo'
        secao: 'Papel de segurança'
        similaridade: 0.85
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 4, substituir Contato e Endereço por Endereço (seção). CEP existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Contato e Endereço", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Cadastros auxiliares > Tipo de endereço (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/ficha/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de cartão de assinatura**, **Papel de segurança**, **Selo digital**, **Dados pessoais**, **Contato**, **Endereço**, **Pessoa Jurídica - Representante**, **Arquivos anexos**.
> * **Campos:** **Filtro** (Papel de segurança), **Nome** (Papel de segurança), **Nome social** (Papel de segurança), **Sexo** (Papel de segurança), **Nascimento** (Papel de segurança), **CPF ou CIN** (Papel de segurança), **RG** (Papel de segurança), **Orgão emissor** (Papel de segurança), **UF** (Papel de segurança), **Data emissão** (Papel de segurança), **CNH** (Papel de segurança), **Categoria** (Papel de segurança), **Data 1ª habilitação** (Papel de segurança), **Data Expedição** (Papel de segurança), **Data expiração** (Papel de segurança), **Outro documento** (Papel de segurança), **Número** (Papel de segurança), **Nacionalidade** (Papel de segurança), **Naturalidade** (Papel de segurança), **Estado civil** (Papel de segurança), **Profissão** (Papel de segurança), **Pai** (Papel de segurança), **Mãe** (Papel de segurança), **Politicamente exposta (Prov. 88)** (Papel de segurança), **Pessoa acusada de terrorismo** (Papel de segurança) (+22).
> * **Botões:** **Preencher cartão usando I.A.**, **Consumir** (desabilitado), **Gerar** (desabilitado), **Consulta Central de notificações de suspeitos (CNS).**, **Excluir**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Contato e Endereço":** **Endereço** (seção, 61% — termo(s) em comum: endereco); **Contato** (seção, 55% — termo(s) em comum: contato); **Tipo de endereço** (campo, 53% — termo(s) em comum: endereco; na seção "Papel de segurança").
> * **Correspondência sugerida para "CEP":** **CEP** (campo, 85% — termo(s) em comum: cep; na seção "Papel de segurança").
> * Sugestão de reescrita: no passo 4, substituir **Contato e Endereço** por **Endereço** (seção). **CEP** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
Etapa inicial da abertura de ficha de firma no balcão de atendimento, destinada à inserção ágil e qualificação de dados pessoais, documentação civil, contatos e endereço do titular.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Cadastro > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento).
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Cadastro > Cartão de assinatura"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Cadastros > Cartão de assinatura"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
2. Na aba **Dados pessoais**, insira o **Nome completo** do cliente, **CPF**, documento de identificação (**RG/CNH**, órgão emissor e UF).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Dados pessoais** · (2) **Nome** · (3) **CPF** · (4) **RG** · (5) **CNH**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Nome completo"**, porém na tela atual do Orion TN o elemento se chama **"Nome"** (confiança: 90% — Sinônimo contextual da rota #/ficha/cadastrar: campo "Nome" da seção Dados pessoais (o "Nome social" é outro campo)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"RG/CNH"**, porém na tela atual do Orion TN o elemento se chama **"RG + CNH"** (confiança: 90% — Sinônimo contextual da rota #/ficha/cadastrar: o manual agrupa dois campos que a tela separa: "RG" e "CNH"). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
3. Preencha **Data de nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Nascimento** · (2) **Nacionalidade** · (3) **Estado civil** · (4) **Profissão**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Data de nascimento"**, porém na tela atual do Orion TN o elemento se chama **"Nascimento"** (confiança: 93% — Similaridade semântica na árvore de acessibilidade (89%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
4. Na seção **Contato e Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Contato e Endereço"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Contato e Endereço"
5. Clique em **Avançar** para seguir para as etapas de captura biométrica, fotográfica e consumo de selos.

* **Importante: A validação do CPF é automática; se o CPF já constar na base do Orion TN, o sistema notificará o escrevente para evitar abertura de ficha em duplicidade.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "Contato e Endereço", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigat → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 2):** "Nome completo" → "Nome" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 2):** "RG/CNH" → "RG + CNH" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 3):** "Data de nascimento" → "Nascimento" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Firmas > Cadastro > Cartão de assinatura" → "Firmas > Cadastros > Cartão de assinatura" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
