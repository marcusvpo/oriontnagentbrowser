---
id: M-26.0
titulo: 'Cadastro de Nova Configuração de Impressão de Etiquetas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 7
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 6
      alvos_ausentes: ['Margens Superior e Esquerda', 'Orientação', 'Retrato', 'Paisagem']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 5
        alvo_documentado: 'Salto (Gap)'
        elemento_real: 'Salto de etiquetas (cm)'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | text:salto de etiquetas (cm) | x=608, y=94, 165x40'
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
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insufi'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Largura'
          real: 'Largura da etiqueta (cm)'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Configurações de impressão'
          real: 'Configurações > Modelos de impressão > Configuração de impressão'
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
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Configurações de impressão'
          real: 'Configurações > Modelos de impressão > Configuração de impressão'
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
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração In'
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Largura'
          real: 'Largura da etiqueta (cm)'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Configurações de impressão'
          real: 'Configurações > Modelos de impressão > Configuração de impressão'
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
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração In'
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Configurações de impressão'
          real: 'Configurações > Modelos de impressão > Configuração de impressão'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração In'
      bloqueio_atual:
        passo: 6
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Configurações de impressão'
          real: 'Configurações > Modelos de impressão > Configuração de impressão'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 6
    capturado_em: '2026-11-26T15:04:00.208Z'
    rota: '#/configuracaoImpressaoModelo/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de configuração de impressão', 'Margem mínima']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
        secao: 'Margem mínima'
      - rotulo: 'Largura da etiqueta (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Altura da etiqueta (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Salto de etiquetas (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Margem superior (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Margem esquerda (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Margem inferior (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
      - rotulo: 'Margem direita (cm)'
        tipo: 'number'
        secao: 'Margem mínima'
    botoes: ['Salvar', 'Voltar']
    alvos_do_passo: ['Margens Superior e Esquerda', 'Orientação', 'Retrato', 'Paisagem']
    correspondencias_sugeridas:
      - alvo: 'Margens Superior e Esquerda'
        elemento_real: 'Margem superior (cm)'
        tipo: 'campo'
        secao: 'Margem mínima'
        similaridade: 0.63
      - alvo: 'Margens Superior e Esquerda'
        elemento_real: 'Margem esquerda (cm)'
        tipo: 'campo'
        secao: 'Margem mínima'
        similaridade: 0.59
    alvos_sem_correspondencia: ['Orientação', 'Retrato', 'Paisagem']
    pistas_mapa_rotas:
      - alvo: 'Paisagem'
        menu: 'Relatórios > Recolhimento resumido'
        rota: '#/inicio'
        encontrado_em: 'field'
        rotulo_real: 'Paisagem'
    sugestao_reescrita: 'Sugestão de reescrita: no passo 6, substituir Margens Superior e Esquerda por Margem superior (cm) (campo da seção Margem mínima). Orientação, Retrato, Paisagem não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-06.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 6, o manual cita "Margens Superior e Esquerda", "Orientação", "Retrato", "Paisagem", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 6: rota **#/configuracaoImpressaoModelo/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de configuração de impressão**, **Margem mínima**.
> * **Campos:** **Descrição** (Margem mínima), **Largura da etiqueta (cm)** (Margem mínima), **Altura da etiqueta (cm)** (Margem mínima), **Salto de etiquetas (cm)** (Margem mínima), **Margem superior (cm)** (Margem mínima), **Margem esquerda (cm)** (Margem mínima), **Margem inferior (cm)** (Margem mínima), **Margem direita (cm)** (Margem mínima).
> * **Botões:** **Salvar** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Margens Superior e Esquerda":** **Margem superior (cm)** (campo, 63% — termo(s) em comum: superior; na seção "Margem mínima"); **Margem esquerda (cm)** (campo, 59% — termo(s) em comum: esquerda; na seção "Margem mínima").
> * **Sem correspondência funcional na tela:** **Orientação**, **Retrato**, **Paisagem**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Paisagem" aparece em **Relatórios > Recolhimento resumido** (#/inicio, campo **Paisagem**).
> * Sugestão de reescrita: no passo 6, substituir **Margens Superior e Esquerda** por **Margem superior (cm)** (campo da seção **Margem mínima**). **Orientação**, **Retrato**, **Paisagem** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-06.png (tela exata no momento do bloqueio).

#### Descrição:
Detalha o cadastro técnico de um novo perfil geométrico de etiqueta, orientando a inserção de largura, altura, gap entre etiquetas, margens e orientação espacial para impressoras térmicas industriais e de mesa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 6 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Modelos de impressão > Configuração de impressão** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Modelos de impressão** · (3) **Configuração de impressão** · (4) **Adicionar**
2. No campo **Descrição**, insira um nome identificador claro (ex: 'Bobina Térmica 105x50mm - Zebra TLP').
   [aqui vai a print "passo-02.png"]
3. No campo **Largura**, digite a medida transversal da etiqueta em milímetros (ex: `105`).
   [aqui vai a print "passo-03.png"]
4. No campo **Altura**, digite o comprimento vertical da etiqueta em milímetros (ex: `50`).
   [aqui vai a print "passo-04.png"]
5. No campo **Salto (Gap)**, preencha a distância do espaçamento vazio entre uma etiqueta e outra (ex: `3`).
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Salto (Gap)"**, porém na tela atual do Orion TN o elemento se chama **"Salto de etiquetas (cm)"** (confiança: 90% — Sinônimo contextual da rota #/configuracaoImpressaoModelo/cadastrar: tela 075 (modal:Adicionar) nomeia o campo de gap como "Salto de etiquetas (cm)" (M-26.0)). O texto do manual não foi alterado.
6. Configure as **Margens Superior e Esquerda** (ex: `2` mm) e selecione a **Orientação** (**Retrato** ou **Paisagem**).
   [aqui vai a print "passo-06.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Margens Superior e Esquerda, Orientação, Retrato, Paisagem] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
7. Clique no botão **Salvar** para homologar as medidas no sistema.

* **Importante: Medições incorretas de altura ou salto fazem com que a impressora desalinhe a cada duas ou três etiquetas impressas sequencialmente.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 5 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração In → **superado** (agora: passo 6, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Configurações de impressão" → "Configurações > Modelos de impressão > Configuração de impressão" — não reconfirmada nesta execução (a dica não foi usada)
