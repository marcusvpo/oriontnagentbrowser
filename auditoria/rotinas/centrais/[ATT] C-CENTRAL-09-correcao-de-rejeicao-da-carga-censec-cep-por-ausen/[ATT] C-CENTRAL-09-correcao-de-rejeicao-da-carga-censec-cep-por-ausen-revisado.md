---
id: C-CENTRAL-09
titulo: 'Correção de Rejeição da Carga CENSEC CEP por Ausência de Código IBGE'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Partes', 'Município']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlh4mo889tav9-18] | x=503, y=67, 183x21'
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
        motivo: 'No passo 2, o manual cita "Partes", "Município", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não '
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas'
          confirmada_ao_vivo: false
          usada_como_dica: false
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
        motivo: 'No passo 2, o manual cita "Partes", "Município", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas > Protocolos'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T02:02:51.200Z'
    rota: '#/protocolo/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Protocolo']
    abas: []
    campos:
      - rotulo: 'ckbToggleDadosProtocolo'
        tipo: 'checkbox'
      - rotulo: 'Data recepção'
        tipo: 'text'
      - rotulo: 'Status'
        tipo: 'text'
      - rotulo: 'Situação'
        tipo: 'select'
      - rotulo: 'Recibo'
        tipo: 'text'
      - rotulo: 'Data recibo'
        tipo: 'text'
      - rotulo: 'Data 1ª lavratura'
        tipo: 'text'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Espécie'
        tipo: 'select'
      - rotulo: 'Natureza'
        tipo: 'select'
      - rotulo: 'Data do contrato'
        tipo: 'text'
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
    botoes: []
    alvos_do_passo: ['Partes', 'Município']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Partes', 'Município']
    sugestao_reescrita: 'Sugestão de reescrita: Partes, Município não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Partes", "Município", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Cadastros auxiliares > Perfil de partes (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/protocolo/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Protocolo**.
> * **Campos:** **ckbToggleDadosProtocolo**, **Data recepção**, **Status**, **Situação**, **Recibo**, **Data recibo**, **Data 1ª lavratura**, **Escrevente**, **Espécie**, **Natureza**, **Data do contrato**, **Escrevente assinante (Substituto):**, **Auxiliar do escrevente:**, **Escrevente que colheu as assinaturas**, **Pessoa física**, **Pessoa jurídica**, **Mensalista**, **CPF ou CIN**, **Nome**, **Tomador**, **Informar intermediador**, **Tipo de endereço**, **CEP**, **Logradouro**, **Número** (+11).
> * **Sem correspondência funcional na tela:** **Partes**, **Município**.
> * Sugestão de reescrita: **Partes**, **Município** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
A CENSEC não utiliza o nome textual dos municípios para cruzamento estatístico, mas sim o código de 7 dígitos da tabela oficial do IBGE. Cidades cadastradas sem esse vínculo impedem o envio da carga.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Notas > Protocolo** e abra o ato apontado com pendência no log da CEP.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Na aba **Partes**, edite o endereço das partes: no campo **Município**, utilize a lupa de busca para selecionar a cidade da lista oficial (o sistema preencherá o código IBGE automaticamente).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Partes, Município] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Na aba **Imóveis**, confira o endereço do bem e repita a seleção assistida do município.
4. Clique no botão **Salvar** do protocolo.
5. Acesse **Comunicações > CENSEC CEP**, selecione a quinzena e clique em **Reprocessar Carga**.
6. Transmita o lote aprovado.

* **Prevenção Cadastral: Nunca desative o preenchimento automático por CEP dos Correios; ele já amarra o código IBGE correto sem intervenção do digitador.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Partes", "Município", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Notas > Protocolo" → "Notas > Protocolos" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
