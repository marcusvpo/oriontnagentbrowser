---
id: C-FIRMA-06
titulo: 'Tratamento de RPS Rejeitado no Balcão de Firmas por Falta de Tomador Identificado'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
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
        alvo_documentado: 'Configurações > Parâmetros de NFS-e > Regras de Balcão'
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
        motivo: 'No passo 1, o manual cita "Configurações > Parâmetros de NFS-e > Regras de Balcão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloq'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de NFS-e > Regras de Balcão" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impress'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de NFS-e > Regras de Balcão" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impress'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-24T17:15:49.004Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros de NFS-e > Regras de Balcão" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Tomador Padrão para Atos Não Identificados", "Consumidor Final / Não Identificado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Na migração para o Emissor Nacional, certos municípios passaram a exigir parametrização tributária especial para "Tomador Não Identificado" (Consumidor Final) em serviços de balcão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parâmetros de NFS-e > Regras de Balcão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Configurações > Parâmetros de NFS-e > Regras de Balcão"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros de NFS-e > Regras de Balcão" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Tomador Padrão para Atos Não Identificados", "Consumidor Final / Não Identificado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento".
2. Na seção **Tomador Padrão para Atos Não Identificados**, selecione a modalidade **Consumidor Final / Não Identificado**.
3. Caso o provedor exija cadastro específico: informe os dados da Serventia ou a inscrição padrão autorizada pelo fisco municipal.
4. No campo **Classificação Tributária / CST**, informe o código de operação notarial sem retenção na fonte.
5. Acesse o lote de RPS rejeitado em **Orion Caixa > Notas Fiscais > Listagem de RPS**.
6. Clique no botão **Reprocessar Lote de Firmas** para reenviar as notas com o novo layout parametrizado.

* **Legislação Fiscal: Sempre ofereça a inclusão do CPF do apresentante no recibo para agilizar a emissão individualizada quando solicitada.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de NFS-e > Regras de Balcão" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impress → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
