---
id: C-FIN-09
titulo: 'Desbloqueio de Emissão de Recibo por Inconsistência nos Dados do Solicitante'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Nome / Razão Social', 'CPF/CNPJ']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxz2j5qgie618-18] | x=503, y=67, 183x21'
      - passo: 2
        alvo_documentado: 'Solicitante / Tomador'
        elemento_real: 'Tomador'
        camada: a11y_fuzzy_match
        confianca: 0.7
        texto_alterado: false
        evidencia: 'dom-measured | text:tomador | x=962, y=442, 53x14'
      - passo: 3
        alvo_documentado: 'Nome / Razão Social'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'CPF/CNPJ'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 3 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
A cópia direta de cadastros a partir de navegadores ou mensageiros costuma injetar caracteres não imprimíveis (tabulações, quebras de linha `\r\n` e espaços especiais) que invalidam o schema de dados do recibo.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-FIN-09.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, abra o protocolo através do menu **Notas > Protocolo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 88% — Equivalência de folha: "Protocolo" ≡ "Protocolos" (mesma chave de folha sob "Notas")). O texto do manual não foi alterado.
2. Navegue até a aba **Solicitante / Tomador**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Solicitante / Tomador"**, porém na tela atual do Orion TN o elemento se chama **"Tomador"** (confiança: 70% — Rótulo visível na tela equivalente por inclusão de nome (70%)). O texto do manual não foi alterado.
3. Selecione e apague completamente o conteúdo dos campos **Nome / Razão Social**, **CPF/CNPJ** e **Endereço**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nome / Razão Social"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"CPF/CNPJ"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nome / Razão Social", "CPF/CNPJ"
4. Digite novamente os dados diretamente pelo teclado físico, sem usar colar.
5. Certifique-se de selecionar o tipo de pessoa correto (Física ou Jurídica).
6. Clique no botão **Salvar** do protocolo.
7. Acesse a aba **Financeiro** e clique em **Emitir Recibo**, que será processado imediatamente.

* **Prevenção: Evite utilizar atalhos de colar (`Ctrl + V`) diretamente em campos de identificação fiscal para impedir a contaminação por formatações externas.**
