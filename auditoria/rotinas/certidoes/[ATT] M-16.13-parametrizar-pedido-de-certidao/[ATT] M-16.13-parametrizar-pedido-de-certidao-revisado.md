---
id: M-16.13
titulo: 'Parametrizar Pedido de Certidão'
modulo: certidoes
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
      alvos_ausentes: ['Prazo de entrega padrão (dias)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Captura e digitalização'
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
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Impressão'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Comissões e mensalistas'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Pedido de certidão'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwktrmrk2gomw-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Pedido de certidão'
        elemento_real: 'Certidão'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwktsi4bcui5-0] | x=26, y=499, 211x32'
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
        motivo: 'No passo 2, o manual cita "Prazo de entrega padrão (dias)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o p'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Pedido de certidão'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritur'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T15:10:17.941Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações']
    abas: []
    campos:
      - rotulo: 'Utiliza pedidos de certidão'
        tipo: 'checkbox'
      - rotulo: 'Utiliza controle de estoque em notas'
        tipo: 'checkbox'
      - rotulo: 'Previsão de entrega'
        tipo: 'text'
      - rotulo: 'Consumo do papel de segurança'
        tipo: 'select'
      - rotulo: 'Qtd. na busca'
        tipo: 'number'
      - rotulo: 'Categoria'
        tipo: 'select'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Padrão'
        tipo: 'checkbox'
    botoes: ['Excluir', 'Adicionar', 'Concluir', 'Voltar']
    alvos_do_passo: ['Prazo de entrega padrão (dias)']
    correspondencias_sugeridas:
      - alvo: 'Prazo de entrega padrão (dias)'
        elemento_real: 'Previsão de entrega'
        tipo: 'campo'
        similaridade: 0.61
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Prazo de entrega padrão (dias) por Previsão de entrega (campo).'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Prazo de entrega padrão (dias)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Captura e digitalização", aba "Pedido de firmas", aba "Parâmetros por estação", aba "Painel de atalhos", aba "Impressão", aba "Comissões e mensalistas"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**.
> * **Campos:** **Utiliza pedidos de certidão**, **Utiliza controle de estoque em notas**, **Previsão de entrega**, **Consumo do papel de segurança**, **Qtd. na busca**, **Categoria**, **Produto**, **Padrão**.
> * **Botões:** **Excluir**, **Adicionar**, **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Prazo de entrega padrão (dias)":** **Previsão de entrega** (campo, 61% — termo(s) em comum: entrega).
> * Sugestão de reescrita: no passo 2, substituir **Prazo de entrega padrão (dias)** por **Previsão de entrega** (campo). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Configura as políticas de atendimento do módulo de Pedidos de Certidão, estabelecendo o prazo padrão de expedição conforme a lei de registros públicos e vinculando o consumo obrigatório de papel de segurança.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Pedido de certidão**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Certidão**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Pedido de certidão"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Pedido de certidão"**, porém na tela atual do Orion TN o elemento se chama **"Certidão"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Pedido de certidão" e a tela real chama a aba de "Certidão" (única aba de certidão da tela)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Certidão** foi medida ao vivo (sinônimo contextual da rota) e acionada.
2. No campo **Prazo de entrega padrão (dias)**, informe a quantidade de dias úteis fixada para expedição de certidões comuns (ex: 5 dias úteis, ou prazo menor conforme a rotina do cartório).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Prazo de entrega padrão (dias)] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Na seção **Estoque e Insumos**, marque a opção **Controlar estoque de papel de segurança** para impedir que a certidão seja concluída sem o apontamento do número da folha utilizada.
4. Configure se o sistema deve exigir a assinatura ou identificação do recebedor no momento da entrega do documento no balcão.
5. Clique no botão **Salvar** para registrar os parâmetros do setor de certidões.

* **Observação: O prazo cadastrado é utilizado para alimentar a data de previsão de entrega no comprovante entregue ao usuário no balcão.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritur → **superado** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
