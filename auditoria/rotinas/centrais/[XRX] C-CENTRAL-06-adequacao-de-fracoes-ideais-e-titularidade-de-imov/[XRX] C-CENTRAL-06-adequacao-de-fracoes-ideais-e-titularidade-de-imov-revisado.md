---
id: C-CENTRAL-06
titulo: 'Adequação de Frações Ideais e Titularidade de Imóveis para Remessa da DOI'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Imóveis', 'Editar']
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
        elemento_real: 'Notas'
        camada: a11y_fuzzy_match
        confianca: 0.68
        texto_alterado: false
        evidencia: 'dom-measured | text:notas | x=573, y=1, 67x50'
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
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Notas > Protocolo"**, porém na tela atual do Orion TN o elemento se chama **"Notas"** (confiança: 68% — Similaridade semântica na árvore de acessibilidade (64%)). O texto do manual não foi alterado.
2. Acesse a aba **Imóveis** e clique em **Editar** no bem correspondente.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Imóveis, Editar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Confira os campos obrigatórios: **Tipo de Imóvel** (Urbano/Rural), **Matrícula**, **Código IBGE** e **Logradouro**.
4. Acesse a sub-aba **Partes do Imóvel / Transmissão**.
5. Selecione os alienantes e adquirentes e marque obrigatoriamente a flag **Titular do Imóvel**.
6. No campo **Fração Transmitida (%)**, preencha com exatidão a porcentagem de cada um (ex.: 50% e 50%, ou 100%).
7. Clique no botão **Gravar Metadados da DOI** dentro da aba e salve o protocolo.
8. Acesse **Comunicações > DOI**, gere novamente a remessa mensal e valide no programa da Receita Federal.

* **Atenção Tributária: Em cessões parciais de direitos ou fração ideal, a soma das porcentagens alienadas deve ser informada em relação à totalidade do quinhão transmitido.**
