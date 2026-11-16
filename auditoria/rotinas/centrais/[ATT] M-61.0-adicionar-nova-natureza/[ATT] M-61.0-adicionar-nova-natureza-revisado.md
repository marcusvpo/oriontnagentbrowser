---
id: M-61.0
titulo: 'Adicionar Nova Natureza'
modulo: centrais
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Descrição']
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwiu5g1be9uln8-104] | x=605, y=316, 239x26'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Descrição", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite registrar uma nova modalidade de negócio jurídico no acervo notarial do Orion TN, associando-a à sua espécie mãe, parametrizando obrigações de reporte à CENSEC e vinculando a tabela de custas.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Naturezas** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Natureza**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Naturezas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Natureza"** (confiança: 82% — Item "Natureza" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. No campo **Espécie**, selecione o gênero correspondente (ex: **Escritura**, **Procuração**, **Ata Notarial**).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Espécie / Procuração** · (2) **Escritura** · (3) **Ata Notarial**
3. No campo **Descrição**, digite a denominação jurídica formal da nova natureza (ex: 'Escritura Pública de Emancipação', 'Doação em Adiantamento de Legítima').
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Descrição] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. No campo **Sigla**, insira um código mnemônico abreviado (ex: `EMAN`, `DOAC`).
5. Na seção **Comunicações com Centrais Notariais**, configure os parâmetros normativos:
   * Marque se comunica à **CESDI** (Separações, Divórcios e Inventários).
   * Marque se comunica ao **CEP** (Escrituras e Procurações gerais).
   * Marque se comunica ao **RCTO** (Testamentos).
6. Na aba **Custas**, associe o item padrão da tabela de emolumentos estadual.
7. Clique no botão **Concluir** para registrar a nova natureza.

* **Importante: A parametrização correta das flags de centrais notariais é vital para evitar omissões involuntárias na carga periódica da CENSEC.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**
