---
id: M-9.0
titulo: 'Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
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
    - passo: 2
      alvos_ausentes: ['Dados pessoais', 'Nome completo', 'RG/CNH']
      alvos_revelados: ['Dados pessoais']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Cadastro > Cartão de assinatura'
        elemento_real: 'Firmas > Cadastros > Cartão de assinatura'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwka246ucf51yf-12] | x=633, y=109, 330x20'
      - passo: 2
        alvo_documentado: 'Nome completo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'RG/CNH'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Dados pessoais'
        elemento_real: 'Dados pessoais'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1251, y=384, 163x24'
        evidencia: 'dom-measured | text:dados pessoais | x=20, y=262, 1167x15'
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
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T05:56:33.915Z'
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
    alvos_do_passo: ['Dados pessoais', 'Nome completo', 'CPF', 'RG/CNH']
    correspondencias_sugeridas:
      - alvo: 'Dados pessoais'
        elemento_real: 'Dados pessoais'
        tipo: 'seção'
        similaridade: 0.85
      - alvo: 'CPF'
        elemento_real: 'CPF ou CIN'
        tipo: 'campo'
        secao: 'Papel de segurança'
        similaridade: 0.78
      - alvo: 'RG/CNH'
        elemento_real: 'CNH'
        tipo: 'campo'
        secao: 'Papel de segurança'
        similaridade: 0.49
    alvos_sem_correspondencia: ['Nome completo']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir CPF por CPF ou CIN (campo da seção Papel de segurança); substituir RG/CNH por CNH (campo da seção Papel de segurança). Dados pessoais existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Nome completo não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas > Orçamento completo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/ficha/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de cartão de assinatura**, **Papel de segurança**, **Selo digital**, **Dados pessoais**, **Contato**, **Endereço**, **Pessoa Jurídica - Representante**, **Arquivos anexos**.
> * **Campos:** **Filtro** (Papel de segurança), **Nome** (Papel de segurança), **Nome social** (Papel de segurança), **Sexo** (Papel de segurança), **Nascimento** (Papel de segurança), **CPF ou CIN** (Papel de segurança), **RG** (Papel de segurança), **Orgão emissor** (Papel de segurança), **UF** (Papel de segurança), **Data emissão** (Papel de segurança), **CNH** (Papel de segurança), **Categoria** (Papel de segurança), **Data 1ª habilitação** (Papel de segurança), **Data Expedição** (Papel de segurança), **Data expiração** (Papel de segurança), **Outro documento** (Papel de segurança), **Número** (Papel de segurança), **Nacionalidade** (Papel de segurança), **Naturalidade** (Papel de segurança), **Estado civil** (Papel de segurança), **Profissão** (Papel de segurança), **Pai** (Papel de segurança), **Mãe** (Papel de segurança), **Politicamente exposta (Prov. 88)** (Papel de segurança), **Pessoa acusada de terrorismo** (Papel de segurança) (+22).
> * **Botões:** **Preencher cartão usando I.A.**, **Consumir** (desabilitado), **Gerar** (desabilitado), **Consulta Central de notificações de suspeitos (CNS).**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Dados pessoais":** **Dados pessoais** (seção, 85% — termo(s) em comum: dado, pessoai).
> * **Correspondência sugerida para "CPF":** **CPF ou CIN** (campo, 78% — termo(s) em comum: cpf; na seção "Papel de segurança").
> * **Correspondência sugerida para "RG/CNH":** **CNH** (campo, 49% — termo(s) em comum: cnh; na seção "Papel de segurança").
> * **Sem correspondência funcional na tela:** **Nome completo**.
> * Sugestão de reescrita: no passo 2, substituir **CPF** por **CPF ou CIN** (campo da seção **Papel de segurança**); substituir **RG/CNH** por **CNH** (campo da seção **Papel de segurança**). **Dados pessoais** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Nome completo** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Etapa inicial da abertura de ficha de firma no balcão de atendimento, destinada à inserção ágil e qualificação de dados pessoais, documentação civil, contatos e endereço do titular.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Cadastro > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Cadastro > Cartão de assinatura"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Cadastros > Cartão de assinatura"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Na aba **Dados pessoais**, insira o **Nome completo** do cliente, **CPF**, documento de identificação (**RG/CNH**, órgão emissor e UF).
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   [aqui vai a print "passo-02-c.png"]
   > [!NOTE] **Demarcações na print:** (1) **CPF** · (2) **Adicionar** · (3) **Dados pessoais**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nome completo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"RG/CNH"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Dados pessoais"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-02-b.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nome completo", "RG/CNH"
3. Preencha **Data de nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação).
4. Na seção **Contato e Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail.
5. Clique em **Avançar** para seguir para as etapas de captura biométrica, fotográfica e consumo de selos.

* **Importante: A validação do CPF é automática; se o CPF já constar na base do Orion TN, o sistema notificará o escrevente para evitar abertura de ficha em duplicidade.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 2):** "Dados pessoais" → "Dados pessoais" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Firmas > Cadastro > Cartão de assinatura" → "Firmas > Cadastros > Cartão de assinatura" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
