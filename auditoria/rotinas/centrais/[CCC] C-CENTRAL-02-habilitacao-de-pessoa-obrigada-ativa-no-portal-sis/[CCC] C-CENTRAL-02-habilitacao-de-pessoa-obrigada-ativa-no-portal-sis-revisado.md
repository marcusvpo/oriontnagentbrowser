---
id: C-CENTRAL-02
titulo: Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: 2026-11-17
  status: comunicacao_externa
  review_tags:
    - CCC
  carga: mutation
  worker_id: worker-1
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Dependência de Comunicação/Portal Externo
  etapas_externas:
    - passo: 1
      portal: SISCOAF
    - passo: 2
      portal: SISCOAF
    - passo: 3
      portal: SISCOAF
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 4
        alvo_documentado: Configurações > Parâmetros Gerais > Comunicação COAF
        elemento_real: Configurações > Parametrizações
        camada: menu_path_resolution
        confianca: 0.98
        texto_alterado: true
        evidencia: menu-tree | [data-orion-audit-menu-mmwk55i5d3enfio-130] | x=850, y=171, 175x20
      - passo: 5
        alvo_documentado: CPF do Responsável pelo Envio
        elemento_real: CPF/CNPJ
        camada: dom_synonym_heuristic
        confianca: 0.98
        texto_alterado: true
        evidencia: dom-measured | text:cpf/cnpj | x=23, y=287, 96x24
      - passo: 6
        alvo_documentado: Gravar
        elemento_real: Cadastrar
        camada: dom_synonym_heuristic
        confianca: 0.98
        texto_alterado: true
        evidencia: dom-measured | text:cadastrar | x=850, y=160, 212x27
  historico_reauditoria:
    - data: 2026-11-16
      ambiente_anterior: não registrado (anterior ao ADR-025)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
        - CCC
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
        - CCC
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: 'No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Comunicação COAF" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão'
      bloqueio_atual:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
        - CCC
      status_atual: comunicacao_externa
      tags_atuais:
        - CCC
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: 'No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Comunicação COAF" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: comunicacao_externa
      tags_anteriores:
        - CCC
      status_atual: comunicacao_externa
      tags_atuais:
        - CCC
      bloqueio_superado: null
      curas_reaproveitadas:
        - passo: 5
          alvo: CPF do Responsável pelo Envio
          real: CPF/CNPJ
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 6
          alvo: Gravar
          real: Cadastrar
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 4
          alvo: Configurações > Parâmetros Gerais > Comunicação COAF
          real: Configurações > Parametrizações
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T03:40:13.924Z
  governanca_comentario: Passos 1 a 3 ocorrem fora do Orion TN (diretamente no portal oficial do SISCOAF com e-CPF) e devem ser sinalizados como Etapa Externa [CCC] sem print falsa da home. No Orion TN (a partir do passo 4), o caminho atualizado é 'Configurações > Parametrizações > Comunicações' (menu lateral) > bloco 'Coaf' > clicar em 'Clique aqui para acessar a tela de configuração no Orion Coaf', que abre em nova guia a tela com os campos 'CPF/CNPJ', 'E-mail', 'Tipo do certificado' e botão 'Cadastrar'.
---

> [!IMPORTANT]
> **ROTINA COM ETAPAS EM AMBIENTE EXTERNO ([CCC]):**  
> Os passos 1, 2, 3 ocorrem fora do Orion TN (SISCOAF); não foram executados nem fotografados. As demais etapas foram auditadas no Orion TN.

#### Descrição:
As comunicações de operações suspeitas e inocorrências só podem ser transmitidas por prepostos expressamente cadastrados pelo Tabelião Titular dentro do ambiente autenticado do SISCOAF.

#### Passo a passo revisado:
1. O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
2. Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
3. Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
4. No **Orion TN**, acesse **Configurações > Parametrizações**.
   [aqui vai a print "passo-04.png"]
   [aqui vai a print "passo-04-b.png"]
   [aqui vai a print "passo-04-c.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Comunicações** · (4) **Clique aqui para acessar a tela de configuração no Orion Coaf**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parâmetros Gerais > Comunicação COAF"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 98% — Diretriz soberana da revisão humana em C-CENTRAL-02 ("Configurações > Parâmetros Gerais > Comunicação COAF" -> "Configurações > Parametrizações")).
   > [!NOTE] Fluxo guiado por revisão humana executado ao vivo: selecionado **Comunicações** no menu lateral e acionado **Clique aqui para acessar a tela de configuração no Orion Coaf** abrindo a guia **Certificados - SPCM-Comunicação COAF** para os passos seguintes.
5. No campo **CPF/CNPJ**, informe com exatidão o CPF que foi habilitado no portal.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"CPF do Responsável pelo Envio"**, porém na tela atual do Orion TN o elemento se chama **"CPF/CNPJ"** (confiança: 98% — Diretriz direta da revisão humana (C-CENTRAL-02): "CPF do Responsável pelo Envio" -> "CPF/CNPJ").
6. Clique em **Cadastrar**.
   [aqui vai a print "passo-06.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Gravar"**, porém na tela atual do Orion TN o elemento se chama **"Cadastrar"** (confiança: 98% — Diretriz direta da revisão humana (C-CENTRAL-02): "Gravar" -> "Cadastrar").
7. Retorne à tela de envio do COAF e faça a transmissão do lote pendente.
   [aqui vai a print "passo-07.png"]

* **Responsabilidade Legal: Mantenha o cadastro de prepostos atualizado no SISCOAF e desative imediatamente o vínculo de funcionários desligados.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [CCC] comunicacao_externa → [CCC] comunicacao_externa
* **Cura reaproveitada (passo 5):** "CPF do Responsável pelo Envio" → "CPF/CNPJ" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 6):** "Gravar" → "Cadastrar" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 4):** "Configurações > Parâmetros Gerais > Comunicação COAF" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
