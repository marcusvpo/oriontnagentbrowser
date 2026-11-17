---
id: M-16.5
titulo: 'Configurar Comunicações Externas (Selo Digital, E-notariado, COAF)'
modulo: centrais
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
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Produção', 'Homologação']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 14
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Protocolo'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Impressão'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Campos obrigatórios'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Comunicações externas'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwksv0iabc9mvl-130] | x=892, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Comunicações externas'
        elemento_real: 'Comunicações'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwksvxcd4z8l-0] | x=26, y=231, 211x32'
      - passo: 2
        alvo_documentado: 'Selo Digital TJSP'
        elemento_real: 'Selo digital'
        camada: a11y_fuzzy_match
        confianca: 0.95
        texto_alterado: false
        evidencia: 'dom-measured | text:selo digital | x=268, y=125, 54x16'
      - passo: 3
        alvo_documentado: 'Produção'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Homologação'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Comunicações externas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloquead'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Comunicações externas" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escri'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T14:49:56.020Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Clique aqui para acessar a tela de configuração no Orion Selo Digital.', 'Clique aqui para acessar a tela de configuração no Orion e-Notariado.', 'Clique aqui para acessar a tela de configuração no Orion Coaf', 'Clique aqui para acessar a tela de configuração no Orion SIGNO', 'Comunicações', 'Comunicação NFS-e (Nota fiscal eletrônica de serviço) Clique aqui se precisar de']
    abas: []
    campos:
      - rotulo: 'Automática'
        tipo: 'radio'
      - rotulo: 'Manual'
        tipo: 'radio'
      - rotulo: 'Online'
        tipo: 'radio'
      - rotulo: 'Offline'
        tipo: 'radio'
      - rotulo: 'Notificar por e-mail'
        tipo: 'checkbox'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Enviar dados da parte em selos de reconhecimento'
        tipo: 'checkbox'
      - rotulo: 'Diário'
        tipo: 'radio'
      - rotulo: 'Semanal'
        tipo: 'radio'
      - rotulo: 'Quinzenal'
        tipo: 'radio'
      - rotulo: 'Horário'
        tipo: 'time'
      - rotulo: 'Token do cartório'
        tipo: 'text'
      - rotulo: 'Subscription'
        tipo: 'text'
      - rotulo: 'API Key CNB'
        tipo: 'text'
      - rotulo: 'Diretório de instalação do Java'
        tipo: 'text'
      - rotulo: 'Solicitação de recibo'
        tipo: 'radio'
      - rotulo: 'CPF ou CIN para integração'
        tipo: 'text'
      - rotulo: 'Client ID'
        tipo: 'text'
      - rotulo: 'Client Secret'
        tipo: 'text'
      - rotulo: 'Notificar comunicações pendentes'
        tipo: 'checkbox'
      - rotulo: 'Ativar geração de RPS'
        tipo: 'checkbox'
      - rotulo: 'Layout de comunicação'
        tipo: 'select'
      - rotulo: 'Forma de envio do valor da nota'
        tipo: 'select'
      - rotulo: 'Insc. municipal'
        tipo: 'text'
      - rotulo: 'Tomador firmas'
        tipo: 'select'
      - rotulo: 'Tomador protocolo'
        tipo: 'select'
      - rotulo: 'Doc. para comunicação'
        tipo: 'select'
      - rotulo: 'Opção pelo Simples'
        tipo: 'select'
      - rotulo: 'Código NBS'
        tipo: 'text'
      - rotulo: 'Indicador de operação'
        tipo: 'text'
      - rotulo: 'Classificação tributária'
        tipo: 'text'
      - rotulo: 'Cód tributação municipal'
        tipo: 'text'
      - rotulo: 'Situação Tributária'
        tipo: 'select'
      - rotulo: 'Tributação do ISSQN'
        tipo: 'select'
      - rotulo: 'Regime especial de tributação'
        tipo: 'select'
      - rotulo: 'Retenção ISSQN por tipo de tomador'
        tipo: 'checkbox'
      - rotulo: 'Tipo de retencao do ISSQN'
        tipo: 'select'
      - rotulo: 'Horários de execução do Job'
        tipo: 'text'
      - rotulo: 'Email'
        tipo: 'text'
      - rotulo: 'URL de destino da nota fiscal eletrônica'
        tipo: 'text'
      - rotulo: 'Servidor'
        tipo: 'radio'
      - rotulo: 'Tipo de certificado'
        tipo: 'select'
      - rotulo: 'Caminho certificado A1'
        tipo: 'text'
      - rotulo: 'Senha'
        tipo: 'password'
      - rotulo: 'Usar documento do Certificado Quando ativado, o sistema irá utilizar o documento associado'
        tipo: 'checkbox'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'ID Parceiro'
        tipo: 'text'
      - rotulo: 'Chave'
        tipo: 'text'
      - rotulo: 'Token de Acesso'
        tipo: 'text'
      - rotulo: 'Chave de Acesso'
        tipo: 'text'
      - rotulo: 'ID do Cartório'
        tipo: 'text'
    botoes: ['Iniciar serviço do E-notariado', 'Parar serviço do E-notariado', 'Iniciar serviço do Signo', 'Parar serviço do Signo', 'Concluir', 'Voltar']
    alvos_do_passo: ['e-Notariado', 'Produção', 'Homologação']
    correspondencias_sugeridas:
      - alvo: 'e-Notariado'
        elemento_real: 'Iniciar serviço do E-notariado'
        tipo: 'botão'
        similaridade: 0.78
      - alvo: 'e-Notariado'
        elemento_real: 'Parar serviço do E-notariado'
        tipo: 'botão'
        similaridade: 0.78
      - alvo: 'e-Notariado'
        elemento_real: 'Clique aqui para acessar a tela de configuração no Orion e-Notariado.'
        tipo: 'seção'
        similaridade: 0.78
    alvos_sem_correspondencia: ['Produção', 'Homologação']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir e-Notariado por Iniciar serviço do E-notariado (botão). Produção, Homologação não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Produção", "Homologação", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Produtos Orion", aba "Protocolo", aba "Impressão", aba "Parâmetros por estação", aba "Captura e digitalização", aba "Campos obrigatórios"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Clique aqui para acessar a tela de configuração no Orion Selo Digital.**, **Clique aqui para acessar a tela de configuração no Orion e-Notariado.**, **Clique aqui para acessar a tela de configuração no Orion Coaf**, **Clique aqui para acessar a tela de configuração no Orion SIGNO**, **Comunicações**, **Comunicação NFS-e (Nota fiscal eletrônica de serviço) Clique aqui se precisar de**.
> * **Campos:** **Automática**, **Manual**, **Online**, **Offline**, **Notificar por e-mail**, **E-mail**, **Enviar dados da parte em selos de reconhecimento**, **Diário**, **Semanal**, **Quinzenal**, **Horário**, **Token do cartório**, **Subscription**, **API Key CNB**, **Diretório de instalação do Java**, **Solicitação de recibo**, **CPF ou CIN para integração**, **Client ID**, **Client Secret**, **Notificar comunicações pendentes**, **Ativar geração de RPS**, **Layout de comunicação**, **Forma de envio do valor da nota**, **Insc. municipal**, **Tomador firmas** (+26).
> * **Botões:** **Iniciar serviço do E-notariado** (desabilitado), **Parar serviço do E-notariado**, **Iniciar serviço do Signo**, **Parar serviço do Signo** (desabilitado), **Concluir**, **Voltar**.
> * **Correspondência sugerida para "e-Notariado":** **Iniciar serviço do E-notariado** (botão, 78% — termo(s) em comum: notariado); **Parar serviço do E-notariado** (botão, 78% — termo(s) em comum: notariado); **Clique aqui para acessar a tela de configuração no Orion e-Notariado.** (seção, 78% — termo(s) em comum: notariado).
> * **Sem correspondência funcional na tela:** **Produção**, **Homologação**.
> * Sugestão de reescrita: no passo 3, substituir **e-Notariado** por **Iniciar serviço do E-notariado** (botão). **Produção**, **Homologação** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Centraliza os parâmetros de conexão técnica, endpoints, chaves de API, usuários e certificados necessários para integrar o Orion TN às plataformas governamentais e notariais externas (TJSP, e-Notariado, COAF e Livro Caixa Web).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Comunicações externas**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Comunicações**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Comunicações externas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Comunicações externas"**, porém na tela atual do Orion TN o elemento se chama **"Comunicações"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Comunicações externas" e a tela real chama a aba de "Comunicações" (única aba de comunicações da tela)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Comunicações** foi medida ao vivo (sinônimo contextual da rota) e acionada.
2. Na aba **Selo Digital TJSP**, preencha a URL do WebService, o usuário, senha e código da serventia fornecidos pelo tribunal.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Selo Digital TJSP"**, porém na tela atual do Orion TN o elemento se chama **"Selo digital"** (confiança: 95% — Rótulo visível na tela equivalente por inclusão de nome (95%)). O texto do manual não foi alterado.
3. Na aba **e-Notariado**, insira a chave de integração (API Token) e configure o modo de ambiente (**Produção** ou **Homologação**).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Produção"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Homologação"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Produção", "Homologação"
4. Na aba **COAF / SISCOAF**, defina o código de habilitação da serventia e o prazo de alerta de atos suspeitos para comunicação.
5. Na aba **Livro Caixa Web**, configure o token de exportação financeira diária.
6. Clique no botão **Testar Conexão** em cada aba para validar os acessos e clique em **Salvar**.

* **Importante: Sempre que houver troca de senhas no portal do tribunal ou atualização de tokens de segurança, os novos dados devem ser atualizados imediatamente nesta tela.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Comunicações externas" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escri → **superado** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
