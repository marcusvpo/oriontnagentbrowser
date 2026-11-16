---
id: M-24.0
titulo: 'Cadastro de Novo Tipo de Documento para Termo de Comparecimento'
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
      alvos_ausentes: ['CRV - SEFAZ SP']
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
        alvo_documentado: 'Firmas > Termo de comparecimento > Tipos de documentos'
        elemento_real: 'Configurações > Cadastros auxiliares > Tipo de documento'
        camada: menu_path_resolution
        confianca: 0.71
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwifmnq09hdzfn-119] | x=605, y=550, 239x26'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "CRV - SEFAZ SP", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Orienta o cadastro e parametrização técnica de um novo modelo de Termo de Comparecimento, estruturando campos de dados dinâmicos, texto notarial e acionando a integração fiscal com a SEFAZ-SP (CRV).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Termo de comparecimento > Tipos de documentos** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Tipo de documento**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Termo de comparecimento > Tipos de documentos"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Tipo de documento"** (confiança: 71% — Item "Tipo de documento" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Preencha a **Descrição** do modelo (ex: 'Termo de Comparecimento - CRV SEFAZ SP').
   [aqui vai a print "passo-02.png"]
3. Caso o modelo seja voltado à transferência veicular com envio obrigatório à Fazenda Estadual, marque obrigatoriamente a opção **CRV - SEFAZ SP**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [CRV - SEFAZ SP] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. Na aba **Campos Personalizados**, adicione os campos necessários: Placa, RENAVAM, Chassi, Ano/Modelo, Valor da Venda e Município de Emplacamento.
5. Na aba **Layout de Impressão**, selecione o modelo de minuta pré-configurado com as variáveis notariais.
6. Clique no botão **Salvar** para disponibilizar o modelo no balcão de atendimento.

* **Importante: Marcar a opção **CRV - SEFAZ SP** é indispensável para que os termos emitidos com este tipo alimentem automaticamente a fila de geração de lotes eletrônicos.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
