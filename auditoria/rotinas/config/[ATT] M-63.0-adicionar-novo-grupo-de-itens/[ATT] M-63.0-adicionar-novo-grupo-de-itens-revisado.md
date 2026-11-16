---
id: M-63.0
titulo: 'Adicionar Novo Grupo de Itens'
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
      alvos_ausentes: ['Firmas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
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
        alvo_documentado: 'Notas > Cadastros auxiliares > Grupo de itens'
        elemento_real: 'Configurações > Tabela de custas > Grupo de item'
        camada: menu_path_resolution
        confianca: 0.7
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwigkh415ml4du-92] | x=627, y=160, 217x26'
      - passo: 3
        alvo_documentado: 'Firmas'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Firmas", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite cadastrar um novo cabeçalho ou categoria de agrupamento na tabela de emolumentos da serventia, categorizando atos afins sob a mesma especialidade notarial.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Grupo de itens** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Tabela de custas** · (3) **Grupo de item**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Grupo de itens"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Tabela de custas > Grupo de item"** (confiança: 70% — Item "Grupo de item" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. No campo **Descrição**, digite a denominação clara do agrupador (ex: 'Atas Notariais Eletrônicas', 'Escrituras de Regularização Fundiária - REURB').
   [aqui vai a print "passo-02.png"]
3. No campo **Especialidade**, selecione a área de aplicação: **Notas** ou **Firmas**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Especialidade** · (2) **Notas**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Firmas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Firmas"
4. Se disponível, defina o código numérico de ordenação para exibição sequencial nos menus de custas.
5. Clique no botão **Concluir** para salvar o registro.
6. Em seguida, acerte a tabela de custas vinculando as linhas tarifárias ao grupo criado.

* **Importante: A descrição deve ser objetiva e fiel à nomenclatura da legislação de custas estadual para facilitar conferências fiscais.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
