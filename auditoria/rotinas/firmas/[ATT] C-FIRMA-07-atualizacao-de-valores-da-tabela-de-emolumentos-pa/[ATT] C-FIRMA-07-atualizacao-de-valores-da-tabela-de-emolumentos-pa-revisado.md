---
id: C-FIRMA-07
titulo: 'Atualização de Valores da Tabela de Emolumentos para Materialização e Cópias'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
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
        alvo_documentado: 'Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas'
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
        motivo: 'No passo 1, o manual cita "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento '
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos d'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos d'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-24T17:18:41.240Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Materialização de Documento Eletrônico", "Valor dos Emolumentos", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Determinados serviços de balcão (como materialização de certidões eletrônicas e apostilamento) possuem parametrização de valor fixo direto nos parâmetros do módulo de firmas, além da tabela geral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Materialização de Documento Eletrônico", "Valor dos Emolumentos", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento".
2. Localize a linha do serviço correspondente (ex.: **Materialização de Documento Eletrônico**).
3. Atualize o campo **Valor dos Emolumentos** com o valor fixado no provimento anual do estado.
4. Confira os campos de repasses legais (Fundo do Tribunal, Carteira de Previdência e ISS) para garantir o fechamento exato da soma.
5. Clique no botão **Gravar Parâmetros**.
6. Abra um novo pedido no balcão e valide que o sistema puxa o valor oficial automaticamente.

* **Vigência: Os reajustes anuais de custas vigoram a partir de 1º de janeiro de cada ano; aplique a atualização sempre na virada do exercício fiscal.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos d → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
