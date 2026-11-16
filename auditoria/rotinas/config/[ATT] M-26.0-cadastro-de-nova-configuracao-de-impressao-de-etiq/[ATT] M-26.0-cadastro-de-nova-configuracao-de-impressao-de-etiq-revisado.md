---
id: M-26.0
titulo: 'Cadastro de Nova Configuração de Impressão de Etiquetas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Largura']
      alvos_revelados: ['Largura']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
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
        confianca: 0.69
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwiform2brvsw8-88] | x=627, y=160, 217x26'
      - passo: 3
        alvo_documentado: 'Largura'
        elemento_real: 'Largura da etiqueta (cm)'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1254, y=381, 161x30'
        evidencia: 'dom-measured | text:largura | x=259, y=117, 161x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Salto (Gap)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Detalha o cadastro técnico de um novo perfil geométrico de etiqueta, orientando a inserção de largura, altura, gap entre etiquetas, margens e orientação espacial para impressoras térmicas industriais e de mesa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Configurações de impressão** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Modelos de impressão** · (3) **Configuração de impressão**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Configurações de impressão"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Modelos de impressão > Configuração de impressão"** (confiança: 69% — Item "Configuração de impressão" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. No campo **Descrição**, insira um nome identificador claro (ex: 'Bobina Térmica 105x50mm - Zebra TLP').
   [aqui vai a print "passo-02.png"]
3. No campo **Largura**, digite a medida transversal da etiqueta em milímetros (ex: `105`).
   [aqui vai a print "passo-03.png"]
   [aqui vai a print "passo-03-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Adicionar** · (2) **Largura**
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Largura"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-03.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
4. No campo **Altura**, digite o comprimento vertical da etiqueta em milímetros (ex: `50`).
   [aqui vai a print "passo-04.png"]
5. No campo **Salto (Gap)**, preencha a distância do espaçamento vazio entre uma etiqueta e outra (ex: `3`).
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Salto (Gap)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
6. Configure as **Margens Superior e Esquerda** (ex: `2` mm) e selecione a **Orientação** (**Retrato** ou **Paisagem**).
7. Clique no botão **Salvar** para homologar as medidas no sistema.

* **Importante: Medições incorretas de altura ou salto fazem com que a impressora desalinhe a cada duas ou três etiquetas impressas sequencialmente.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**
