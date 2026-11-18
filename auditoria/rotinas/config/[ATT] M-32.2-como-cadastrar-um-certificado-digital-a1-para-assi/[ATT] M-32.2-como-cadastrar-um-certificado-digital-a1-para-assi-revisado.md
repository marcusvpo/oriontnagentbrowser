---
id: M-32.2
titulo: 'Como Cadastrar um Certificado Digital A1 para Assinatura de Lotes'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Certificados digitais'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlnd0o29j0bz0-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Certificados digitais'
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
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Certificados digitais", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloquead'
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
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Certificados digitais" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escri'
      bloqueio_atual:
        passo: 1
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Certificados digitais" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Certificados digitais'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T04:56:32.620Z'
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
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Certificados digitais" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e digitalização", "Parâmetros por estação", "Sequência", "Comunicações", "Campos obrigatórios", "Painel de atalhos", "Pedido de firmas", "Comissões e mensalistas", "E-mail", "Faturamento", "Protocolo", "Certidão", "Editor", "Produtos Orion", "Inteligência Artificial", "WhatsApp", "Impressão", "Cartão de assinatura", "Cálculo de custas", "Controle de guia". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Cartão de assinatura**, **Cálculo de custas**, **Controle de guia**, **Geral**.
> * **Campos:** **Tipo**, **Qtd. na busca**, **Produto**, **Ativar rotina de bloqueio automático de cartões de assinatura**, **Horário de execução**, **Para menos** (Cartão de assinatura), **Para mais** (Cartão de assinatura), **Truncado** (Cartão de assinatura), **Contábil** (Cartão de assinatura), **Diário** (Cartão de assinatura), **Semanal** (Cartão de assinatura), **Mensal** (Cartão de assinatura), **Zera anualmente** (Cartão de assinatura), **Otimizar consultas e telas Atenção! Necessário fazer um novo login** (Cartão de assinatura).
> * **Botões:** **Concluir**, **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Instrui a importação e parametrização do Certificado Digital padrão ICP-Brasil (tipo A1 - arquivo em software .pfx/.p12) no repositório do Orion TN, habilitando a assinatura digital automatizada de lotes SEFAZ e e-Notariado.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Certificados digitais**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Certificados digitais"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Certificados digitais"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Certificados digitais"
2. Clique no botão **Adicionar**.
3. No campo **Descrição / Titular**, insira o nome do tabelião ou escrevente titular do certificado.
4. Clique no botão **Selecionar arquivo** e localize o arquivo do certificado digital no formato `.pfx` ou `.p12` no computador.
5. No campo **Senha**, digite a senha privativa de proteção da chave privada do certificado.
6. Clique no botão **Validar / Testar Certificado**: o sistema lerá o arquivo, validará a cadeia ICP-Brasil e exibirá a data de validade inicial e final.
7. Clique no botão **Salvar** para registrar o certificado no sistema.

* **Importante: Mantenha controle sobre a data de expiração do certificado A1; certificados vencidos paralisam imediatamente o envio de comunicações obrigatórias.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Certificados digitais" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Certificados digitais" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
