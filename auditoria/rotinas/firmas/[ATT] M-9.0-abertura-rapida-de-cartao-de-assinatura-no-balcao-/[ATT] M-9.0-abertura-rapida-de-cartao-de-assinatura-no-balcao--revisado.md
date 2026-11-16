---
id: M-9.0
titulo: 'Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Dados pessoais', 'Nome completo', 'RG/CNH']
      alvos_revelados: ['Dados pessoais']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Cadastro > Cartão de assinatura'
        elemento_real: 'Firmas > Cadastros > Cartão de assinatura'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwiq5zp3ebyzz2-13] | x=572, y=108, 413x26'
      - passo: 2
        alvo_documentado: 'Nome completo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'RG/CNH'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Dados pessoais'
        elemento_real: 'Dados pessoais'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1249, y=480, 159x30'
        evidencia: 'dom-measured | text:dados pessoais | x=25, y=266, 1146x20'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Nome completo", "RG/CNH", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas > Orçamento completo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Etapa inicial da abertura de ficha de firma no balcão de atendimento, destinada à inserção ágil e qualificação de dados pessoais, documentação civil, contatos e endereço do titular.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Cadastro > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Cadastro > Cartão de assinatura"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Cadastros > Cartão de assinatura"** (confiança: 88% — Item "Cartão de assinatura" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Na aba **Dados pessoais**, insira o **Nome completo** do cliente, **CPF**, documento de identificação (**RG/CNH**, órgão emissor e UF).
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   [aqui vai a print "passo-02-c.png"]
   > [!NOTE] **Demarcações na print:** (1) **CPF** · (2) **Adicionar** · (3) **Dados pessoais**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nome completo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"RG/CNH"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Dados pessoais"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-02-b.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nome completo", "RG/CNH"
3. Preencha **Data de nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação).
4. Na seção **Contato e Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail.
5. Clique em **Avançar** para seguir para as etapas de captura biométrica, fotográfica e consumo de selos.

* **Importante: A validação do CPF é automática; se o CPF já constar na base do Orion TN, o sistema notificará o escrevente para evitar abertura de ficha em duplicidade.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
