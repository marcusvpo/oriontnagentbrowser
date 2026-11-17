---
id: M-16.8
titulo: 'Parametrizar Pedido de Firmas e Termo de Comparecimento'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
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
      alvos_ausentes: ['Pedido de Firmas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 9
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'E-mail'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Editor'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Comissões e mensalistas'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Certidão'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Pedido de firmas e Termo de comparecimento'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkw3xatd42frw-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Pedido de firmas e Termo de comparecimento'
        elemento_real: 'Pedido de firmas'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwkw4snykemn-0] | x=26, y=331, 211x32'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o e'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicaç'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T16:17:40.697Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Termo de comparecimento']
    abas: []
    campos:
      - rotulo: 'Todos os dedos'
        tipo: 'radio'
      - rotulo: 'Um dedo'
        tipo: 'radio'
      - rotulo: 'Por comparação'
        tipo: 'radio'
      - rotulo: 'Por pesquisa'
        tipo: 'radio'
      - rotulo: 'Automática'
        tipo: 'radio'
      - rotulo: 'Manual'
        tipo: 'radio'
      - rotulo: 'Sequência única'
        tipo: 'radio'
      - rotulo: 'Diário'
        tipo: 'radio'
      - rotulo: 'Anual'
        tipo: 'radio'
      - rotulo: 'Completo'
        tipo: 'radio'
      - rotulo: 'Campos básicos'
        tipo: 'radio'
      - rotulo: 'Não incluir imagens Não incluir imagens Não carregar imagens automaticamente ao acessar a '
        tipo: 'checkbox'
      - rotulo: 'Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a '
        tipo: 'checkbox'
      - rotulo: 'Manter o pedido em tela após conclusão'
        tipo: 'checkbox'
      - rotulo: 'Exibir rotina de caixa na conclusão do pedido'
        tipo: 'checkbox'
      - rotulo: 'Manter a tela do caixa aberta após concluir o pagamento'
        tipo: 'checkbox'
      - rotulo: 'Divisão automática de etiquetas Divisão automática de etiquetas Quando selecionado permite'
        tipo: 'checkbox'
      - rotulo: 'Total de folhas'
        tipo: 'number'
      - rotulo: 'Termos por página'
        tipo: 'number'
      - rotulo: 'Termos abertura'
        tipo: 'number'
      - rotulo: 'Termos encerramento'
        tipo: 'number'
      - rotulo: 'Responsável'
        tipo: 'select'
      - rotulo: 'Utilizar frente e verso'
        tipo: 'checkbox'
      - rotulo: 'Sequência de termo automática'
        tipo: 'checkbox'
      - rotulo: 'Abrir livro automaticamente'
        tipo: 'checkbox'
      - rotulo: 'Tipo padrão'
        tipo: 'select'
      - rotulo: 'Utiliza impressão de etiqueta'
        tipo: 'checkbox'
      - rotulo: 'Utiliza consumo de etiqueta'
        tipo: 'checkbox'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Cadastrar termo de comparecimento após reconhecimento'
        tipo: 'checkbox'
      - rotulo: 'Selo obrigatório'
        tipo: 'checkbox'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Pedido de Firmas']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Pedido de Firmas']
    sugestao_reescrita: 'Sugestão de reescrita: Pedido de Firmas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Pedido de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "E-mail", aba "Editor", aba "Painel de atalhos", aba "Captura e digitalização", aba "Comissões e mensalistas", aba "Certidão"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Abertura de pedido; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Termo de comparecimento**.
> * **Campos:** **Todos os dedos**, **Um dedo**, **Por comparação**, **Por pesquisa**, **Automática**, **Manual**, **Sequência única**, **Diário**, **Anual**, **Completo**, **Campos básicos**, **Não incluir imagens Não incluir imagens Não carregar imagens automaticamente ao acessar a **, **Gerar pedido utilizando senha Gerar pedido utilizando senha Marque caso deseje utilizar a **, **Manter o pedido em tela após conclusão**, **Exibir rotina de caixa na conclusão do pedido**, **Manter a tela do caixa aberta após concluir o pagamento**, **Divisão automática de etiquetas Divisão automática de etiquetas Quando selecionado permite**, **Total de folhas**, **Termos por página**, **Termos abertura**, **Termos encerramento**, **Responsável**, **Utilizar frente e verso**, **Sequência de termo automática**, **Abrir livro automaticamente** (+6).
> * **Botões:** **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Pedido de Firmas**.
> * Sugestão de reescrita: **Pedido de Firmas** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Configura o comportamento operacional dos módulos de Atendimento de Firmas e Termos de Comparecimento, regulando captura biométrica compulsória, senhas de fila e regras de escrituração em livros.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Pedido de firmas e Termo de comparecimento**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Pedido de firmas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Pedido de firmas e Termo de comparecimento"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Pedido de firmas e Termo de comparecimento"**, porém na tela atual do Orion TN o elemento se chama **"Pedido de firmas"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Pedido de firmas e Termo de comparecimento" e a tela real chama a aba de "Pedido de firmas" (única aba de pedido de firmas da tela)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Pedido de firmas** foi medida ao vivo (sinônimo contextual da rota) e acionada.
2. Na seção **Pedido de Firmas**, selecione se o cartório utiliza módulo de senhas de atendimento e defina o formato da numeração de pedidos.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Pedido de Firmas] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Na seção **Termo de Comparecimento**, configure as exigências biométricas: marque a opção para **Exigir captura de biometria** e defina o **Tipo de captura** (**Apenas um dedo** ou **Todos os dedos**).
4. Defina as regras de vinculação a **Livros Notariais**, selecionando se a escolha do livro deve ser automática por escrevente ou manual pelo operador.
5. Marque se o sistema deve gerar automaticamente o espelho de impressão ao concluir o termo.
6. Clique no botão **Salvar** para registrar os parâmetros.

* **Importante: A exigência de biometria no termo atende aos padrões de segurança jurídica contra fraudes em transferências veiculares e procurações.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicaç → **superado** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
