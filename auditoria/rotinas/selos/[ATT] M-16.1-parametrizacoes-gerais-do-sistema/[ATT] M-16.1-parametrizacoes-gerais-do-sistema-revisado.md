---
id: M-16.1
titulo: 'Parametrizações Gerais do Sistema'
modulo: selos
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Papel de Segurança (NFS)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 2
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Pedido de firmas'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Inteligência Artificial'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Sequência'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Parâmetros gerais'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlkibur8yurup-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Parâmetros gerais'
        elemento_real: 'Geral'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwlkj6ef1qtg-0] | x=26, y=94, 211x34'
      - passo: 2
        alvo_documentado: 'Papel de Segurança (NFS)'
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Geral", "Papel de Segurança (NFS)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Parâmetros gerais'
          real: 'Administração'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Parâmetros gerais" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritura'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Papel de Segurança (NFS)", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Inve'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Parâmetros gerais'
          real: 'Geral'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Parâmetros gerais'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T03:40:59.701Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
    abas: []
    campos:
      - rotulo: 'Tipo'
        tipo: 'select'
      - rotulo: 'Qtd. na busca'
        tipo: 'text'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Ativar rotina de bloqueio automático de cartões de assinatura'
        tipo: 'checkbox'
      - rotulo: 'Horário de execução'
        tipo: 'time'
      - rotulo: 'Para menos'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Para mais'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Truncado'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Contábil'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Diário'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Semanal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Mensal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Zera anualmente'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
      - rotulo: 'Otimizar consultas e telas Atenção! Necessário fazer um novo login'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Geral', 'Papel de Segurança (NFS)']
    correspondencias_sugeridas:
      - alvo: 'Geral'
        elemento_real: 'Geral'
        tipo: 'seção'
        similaridade: 0.85
    alvos_sem_correspondencia: ['Papel de Segurança (NFS)']
    sugestao_reescrita: 'Sugestão de reescrita: Geral existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Papel de Segurança (NFS) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Papel de Segurança (NFS)", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Captura e digitalização", aba "Painel de atalhos", aba "Pedido de firmas", aba "Parâmetros por estação", aba "Inteligência Artificial", aba "Sequência"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Cartão de assinatura**, **Cálculo de custas**, **Controle de guia**, **Geral**.
> * **Campos:** **Tipo**, **Qtd. na busca**, **Produto**, **Ativar rotina de bloqueio automático de cartões de assinatura**, **Horário de execução**, **Para menos** (Cartão de assinatura), **Para mais** (Cartão de assinatura), **Truncado** (Cartão de assinatura), **Contábil** (Cartão de assinatura), **Diário** (Cartão de assinatura), **Semanal** (Cartão de assinatura), **Mensal** (Cartão de assinatura), **Zera anualmente** (Cartão de assinatura), **Otimizar consultas e telas Atenção! Necessário fazer um novo login** (Cartão de assinatura).
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Geral":** **Geral** (seção, 85% — termo(s) em comum: geral).
> * **Sem correspondência funcional na tela:** **Papel de Segurança (NFS)**.
> * Sugestão de reescrita: **Geral** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Papel de Segurança (NFS)** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Configura as diretrizes macro do Orion TN, englobando obrigatoriedade de consumo de papel de segurança (NFS), método de envio do selo digital, regra de arredondamento de centavos em emolumentos e numeração de guias.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Parâmetros gerais**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Geral**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Parâmetros gerais"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Parâmetros gerais"**, porém na tela atual do Orion TN o elemento se chama **"Geral"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Parâmetros gerais" e a tela real chama a aba de "Geral" (aba "Geral" é a primeira aba de Parametrizações)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Geral** foi medida ao vivo (sinônimo contextual da rota) e acionada.
2. Na aba **Geral**, configure o comportamento de insumos: marque se o sistema deve exigir o consumo de **Papel de Segurança (NFS)** na emissão de atos.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Papel de Segurança (NFS)"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Papel de Segurança (NFS)"
3. Na seção **Selo Digital**, defina o modo de geração preferencial (**Online** para envio em tempo real ou **Offline** para envio agrupado).
4. No campo **Arredondamento de custas**, selecione o critério homologado para frações de centavos (Arredondamento ABNT, Truncamento ou Superior).
5. Na seção **Guias**, ative o controle de numeração automática e regras de controle fiscal se aplicável.
6. Clique no botão **Salvar** para aplicar as diretrizes globais do cartório.

* **Importante: Alterações nos parâmetros gerais exigem atenção da administração do cartório, pois impactam o cálculo financeiro e o fluxo de todos os escreventes.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Papel de Segurança (NFS)", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Inve → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Parâmetros gerais" → "Geral" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Parâmetros gerais" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
