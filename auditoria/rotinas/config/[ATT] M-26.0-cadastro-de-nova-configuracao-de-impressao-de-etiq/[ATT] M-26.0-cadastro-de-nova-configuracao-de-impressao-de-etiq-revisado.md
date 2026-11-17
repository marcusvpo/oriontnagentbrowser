---
id: M-26.0
titulo: 'Cadastro de Nova Configuração de Impressão de Etiquetas'
modulo: config
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
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['Salto (Gap)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Configurações de impressão'
        elemento_real: 'Configurações > Modelos de impressão > Configuração de impressão'
        camada: menu_path_resolution
        confianca: 0.84
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkzklg0gbpxqm-92] | x=677, y=129, 173x21'
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
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-17T17:51:46.331Z'
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
    alvos_do_passo: ['Salto (Gap)']
    correspondencias_sugeridas:
      - alvo: 'Salto (Gap)'
        elemento_real: 'Salto de etiquetas (cm)'
        tipo: 'campo'
        secao: 'Margem mínima'
        similaridade: 0.48
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 5, substituir Salto (Gap) por Salto de etiquetas (cm) (campo da seção Margem mínima).'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/configuracaoImpressaoModelo/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de configuração de impressão**, **Margem mínima**.
> * **Campos:** **Descrição** (Margem mínima), **Largura da etiqueta (cm)** (Margem mínima), **Altura da etiqueta (cm)** (Margem mínima), **Salto de etiquetas (cm)** (Margem mínima), **Margem superior (cm)** (Margem mínima), **Margem esquerda (cm)** (Margem mínima), **Margem inferior (cm)** (Margem mínima), **Margem direita (cm)** (Margem mínima).
> * **Botões:** **Salvar** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Salto (Gap)":** **Salto de etiquetas (cm)** (campo, 48% — termo(s) em comum: salto; na seção "Margem mínima").
> * Sugestão de reescrita: no passo 5, substituir **Salto (Gap)** por **Salto de etiquetas (cm)** (campo da seção **Margem mínima**). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Detalha o cadastro técnico de um novo perfil geométrico de etiqueta, orientando a inserção de largura, altura, gap entre etiquetas, margens e orientação espacial para impressoras térmicas industriais e de mesa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Configurações de impressão** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Modelos de impressão** · (3) **Configuração de impressão** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Configurações de impressão"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Modelos de impressão > Configuração de impressão"** (confiança: 84% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. No campo **Descrição**, insira um nome identificador claro (ex: 'Bobina Térmica 105x50mm - Zebra TLP').
   [aqui vai a print "passo-02.png"]
3. No campo **Largura**, digite a medida transversal da etiqueta em milímetros (ex: `105`).
   [aqui vai a print "passo-03.png"]
4. No campo **Altura**, digite o comprimento vertical da etiqueta em milímetros (ex: `50`).
   [aqui vai a print "passo-04.png"]
5. No campo **Salto (Gap)**, preencha a distância do espaçamento vazio entre uma etiqueta e outra (ex: `3`).
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Salto (Gap)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
6. Configure as **Margens Superior e Esquerda** (ex: `2` mm) e selecione a **Orientação** (**Retrato** ou **Paisagem**).
7. Clique no botão **Salvar** para homologar as medidas no sistema.

* **Importante: Medições incorretas de altura ou salto fazem com que a impressora desalinhe a cada duas ou três etiquetas impressas sequencialmente.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 5 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração In → **mantido** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 3):** "Largura" → "Largura da etiqueta (cm)" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Configurações de impressão" → "Configurações > Modelos de impressão > Configuração de impressão" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
