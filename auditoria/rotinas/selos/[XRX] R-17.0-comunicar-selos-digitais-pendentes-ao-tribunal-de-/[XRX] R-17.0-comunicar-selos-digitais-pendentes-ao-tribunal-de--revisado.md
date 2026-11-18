---
id: R-17.0
titulo: 'Comunicar Selos Digitais Pendentes ao Tribunal de Justiça'
modulo: selos
secao: R
auditoria_ui:
  data_execucao: '2026-11-18'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-2.7', 'D-2.4']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: '"Não comunicado"'
        elemento_real: 'Comunicado'
        camada: a11y_fuzzy_match
        confianca: 0.95
        texto_alterado: false
        evidencia: 'dom-measured | text:comunicado | x=20, y=94, 282x40'
      - passo: 3
        alvo_documentado: '"Comunicação pendente"'
        elemento_real: 'Comunicação'
        camada: a11y_fuzzy_match
        confianca: 0.89
        texto_alterado: false
        evidencia: 'dom-measured | text:comunicação | x=690, y=230, 114x26'
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
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/N'
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 3
          alvo: '"Não comunicado"'
          real: 'Comunicado'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: '"Comunicação pendente"'
          real: 'Comunicação'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera '
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 3
          alvo: '"Não comunicado"'
          real: 'Comunicado'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: '"Comunicação pendente"'
          real: 'Comunicação'
          confirmada_ao_vivo: true
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
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; mensagem da tela: "Não existem grupo de item cadastrados."; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe'
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 3
          alvo: '"Não comunicado"'
          real: 'Comunicado'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: '"Comunicação pendente"'
          real: 'Comunicação'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-2.7 — Cadastrar Produto; D-2.4 — Cadastrar Categoria de Produto.

#### Descrição:
Esta rotina permite auditar a fila de selos gerados na serventia e forçar a transmissão manual em lote daqueles que permaneceram com status pendente de sincronização com o webservice do Tribunal de Justiça.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-2.7 (Cadastrar Produto) para criar o registro necessário.
2. Executar antes a rotina D-2.4 (Cadastrar Categoria de Produto) para criar o registro necessário.
3. Reexecutar a auditoria da rotina R-17.0.

* **Rotinas pré-requisito (executar antes):** **D-2.7**, **D-2.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Comunicações > Selo Digital** (ou utilize o atalho de **Selo Digital** na barra superior).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Selo digital**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
2. No campo **Data do Ato**, informe o período desejado da pesquisa.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
3. No campo **Status**, selecione os filtros **"Não comunicado"** e **"Comunicação pendente"**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Status / Comunicado** · (2) **Comunicação**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **""Não comunicado""**, porém na tela atual do Orion TN o elemento se chama **"Comunicado"** (confiança: 95% — Similaridade semântica na árvore de acessibilidade (95%)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **""Comunicação pendente""**, porém na tela atual do Orion TN o elemento se chama **"Comunicação"** (confiança: 89% — Rótulo visível na tela equivalente por inclusão de nome (89%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Série, Sequência, Selo digital, Geração, Comunicação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: ""Não comunicado""
4. Clique no botão **Filtrar** para listar todos os selos que aguardam transmissão.
5. Confira a listagem na tela e clique no botão **Comunicar** para sincronizar o lote com a Corregedoria Geral da Justiça.

* **Observação: Monitore a conclusão da transmissão até que todos os selos do período passem para o status "Comunicado com sucesso".**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo não registrado — Dependência Cruzada de Rotina: No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; mensagem da tela: "Não existem grupo de item cadastrados."; controles inativos: "Comunicar" (Nenhum selo encontrado), "Totalizadores"). Não existe → **mantido** (agora: passo 3, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 3):** ""Não comunicado"" → "Comunicado" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 3):** ""Comunicação pendente"" → "Comunicação" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
