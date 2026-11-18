---
id: M-24.0
titulo: 'Cadastro de Novo Tipo de Documento para Termo de Comparecimento'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['CRV - SEFAZ SP']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Termo de comparecimento > Tipos de documentos'
        elemento_real: 'Configurações > Cadastros auxiliares > Tipo de documento'
        camada: menu_path_resolution
        confianca: 0.86
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlmzx6fb83sp6-123] | x=659, y=441, 191x21'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é ins'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
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
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Descrição", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Inve'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do blo'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do blo'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do blo'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Firmas > Termo de comparecimento > Tipos de documentos'
          real: 'Configurações > Cadastros auxiliares > Tipo de documento'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-18T04:47:00.534Z'
    rota: '#/tipoDocumento/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de tipo de documento']
    abas: []
    campos:
      - rotulo: 'Sigla do tipo de documento'
        tipo: 'text'
      - rotulo: 'Descrição do tipo de documento'
        tipo: 'text'
      - rotulo: 'Tipo de documento (Cadastro Único de Clientes do Notariado)'
        tipo: 'select'
      - rotulo: 'Tipo de documento para comunicação CEP:'
        tipo: 'select'
      - rotulo: 'Tipo de documento para comunicação CESDI:'
        tipo: 'select'
      - rotulo: 'Pessoa física'
        tipo: 'checkbox'
      - rotulo: 'Pessoa jurídica'
        tipo: 'checkbox'
      - rotulo: 'Observações'
        tipo: 'textarea'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['CRV - SEFAZ SP']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['CRV - SEFAZ SP']
    sugestao_reescrita: 'Sugestão de reescrita: CRV - SEFAZ SP não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/tipoDocumento/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de tipo de documento**.
> * **Campos:** **Sigla do tipo de documento**, **Descrição do tipo de documento**, **Tipo de documento (Cadastro Único de Clientes do Notariado)**, **Tipo de documento para comunicação CEP:**, **Tipo de documento para comunicação CESDI:**, **Pessoa física**, **Pessoa jurídica**, **Observações**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **CRV - SEFAZ SP**.
> * Sugestão de reescrita: **CRV - SEFAZ SP** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Orienta o cadastro e parametrização técnica de um novo modelo de Termo de Comparecimento, estruturando campos de dados dinâmicos, texto notarial e acionando a integração fiscal com a SEFAZ-SP (CRV).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Termo de comparecimento > Tipos de documentos** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Tipo de documento** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Termo de comparecimento > Tipos de documentos"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Tipo de documento"** (confiança: 86% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Preencha a **Descrição** do modelo (ex: 'Termo de Comparecimento - CRV SEFAZ SP').
   [aqui vai a print "passo-02.png"]
3. Caso o modelo seja voltado à transferência veicular com envio obrigatório à Fazenda Estadual, marque obrigatoriamente a opção **CRV - SEFAZ SP**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [CRV - SEFAZ SP] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Na aba **Campos Personalizados**, adicione os campos necessários: Placa, RENAVAM, Chassi, Ano/Modelo, Valor da Venda e Município de Emplacamento.
5. Na aba **Layout de Impressão**, selecione o modelo de minuta pré-configurado com as variáveis notariais.
6. Clique no botão **Salvar** para disponibilizar o modelo no balcão de atendimento.

* **Importante: Marcar a opção **CRV - SEFAZ SP** é indispensável para que os termos emitidos com este tipo alimentem automaticamente a fila de geração de lotes eletrônicos.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 3 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Firmas > Termo de comparecimento > Tipos de documentos" → "Configurações > Cadastros auxiliares > Tipo de documento" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
