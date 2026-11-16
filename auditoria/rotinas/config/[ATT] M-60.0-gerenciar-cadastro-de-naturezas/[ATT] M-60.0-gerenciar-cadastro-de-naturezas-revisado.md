---
id: M-60.0
titulo: 'Gerenciar Cadastro de Naturezas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Pesquisar por descrição']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Naturezas'
        elemento_real: 'Configurações > Cadastros auxiliares > Natureza'
        camada: menu_path_resolution
        confianca: 0.82
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwifvu91bacri2-104] | x=605, y=316, 239x26'
      - passo: 3
        alvo_documentado: 'Pesquisar por descrição'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Pesquisar por descrição", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Ambiente de consulta, edição e manutenção das naturezas jurídicas dos atos notariais, regulando sua vinculação à respectiva espécie, itens da tabela de custas e regras de envio à CENSEC (CEP, CESDI e RCTO).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Naturezas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Natureza**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Naturezas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Natureza"** (confiança: 82% — Item "Natureza" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Na listagem carregada, visualize todas as naturezas com suas respectivas espécies associadas.
   [aqui vai a print "passo-02.png"]
3. No campo **Pesquisar por descrição**, digite o nome do ato pretendido e selecione a **Espécie** para filtrar.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Pesquisar por descrição"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Pesquisar por descrição"
4. Clique no botão **Filtrar**.
5. Na linha do registro localizado, utilize as ações:
   * **Visualizar**: exibe parâmetros tributários, regras de COAF e obrigações CENSEC.
   * **Editar**: permite atualizar minutas padrão, checklist documental e enquadramentos.
   * **Inativar**: desabilita a natureza para novos protocolos.
6. Para cadastrar uma nova natureza jurídica, clique no botão **Adicionar**.

* **Importante: Naturezas vinculadas a atos já lavrados no histórico do cartório não devem ser excluídas, apenas inativadas para preservação de auditoria.**
* **Dica / Caso Real do 0800: Evite manter o mesmo protocolo aberto em mais de uma aba do Google Chrome para não gerar bloqueios automáticos de concorrência (*locks*) no banco de dados.**
