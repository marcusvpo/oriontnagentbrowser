---
id: C-CENTRAL-06
titulo: 'Adequação de Frações Ideais e Titularidade de Imóveis para Remessa da DOI'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Imóveis']
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
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlgvcbreah68b-18] | x=503, y=67, 183x21'
      - passo: 2
        alvo_documentado: 'Imóveis'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Protocolo'
          real: 'Notas > Protocolos'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
A Declaração sobre Operações Imobiliárias (DOI) exige consistência matemática absoluta entre os alienantes e adquirentes do negócio jurídico. Se as porcentagens transmitidas não fecharem a integralidade do quinhão, a remessa é recusada.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-CENTRAL-06.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, abra o protocolo da escritura através de **Notas > Protocolo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Acesse a aba **Imóveis** e clique em **Editar** no bem correspondente.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Imóveis"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Imóveis"
3. Confira os campos obrigatórios: **Tipo de Imóvel** (Urbano/Rural), **Matrícula**, **Código IBGE** e **Logradouro**.
4. Acesse a sub-aba **Partes do Imóvel / Transmissão**.
5. Selecione os alienantes e adquirentes e marque obrigatoriamente a flag **Titular do Imóvel**.
6. No campo **Fração Transmitida (%)**, preencha com exatidão a porcentagem de cada um (ex.: 50% e 50%, ou 100%).
7. Clique no botão **Gravar Metadados da DOI** dentro da aba e salve o protocolo.
8. Acesse **Comunicações > DOI**, gere novamente a remessa mensal e valide no programa da Receita Federal.

* **Atenção Tributária: Em cessões parciais de direitos ou fração ideal, a soma das porcentagens alienadas deve ser informada em relação à totalidade do quinhão transmitido.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo não registrado — Dependência Cruzada de Rotina: O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo. → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 1):** "Notas > Protocolo" → "Notas > Protocolos" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
