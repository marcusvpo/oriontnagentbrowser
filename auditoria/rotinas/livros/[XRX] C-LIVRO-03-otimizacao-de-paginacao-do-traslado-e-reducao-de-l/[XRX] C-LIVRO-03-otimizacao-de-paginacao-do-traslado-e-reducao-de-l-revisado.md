---
id: C-LIVRO-03
titulo: 'Otimização de Paginação do Traslado e Redução de Laudas Residuais'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
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
      alvos_ausentes: ['Editar Traslado / Diagramação']
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwli703dj40tz-18] | x=503, y=67, 183x21'
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
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
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
          real: 'Notas > Protocolos'
          confirmada_ao_vivo: true
          usada_como_dica: true
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
        passo: 2
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
O traslado notarial deve ter apresentação sóbria e compacta. Pequenos ajustes de entrelinhas (1.15) e recuos de parágrafo permitem absorver linhas órfãs nas páginas precedentes sem violar normas visuais.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-LIVRO-03.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra o protocolo do ato através de **Notas > Protocolo** e selecione a aba **Traslado**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Clique no botão **Editar Traslado / Diagramação**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Editar Traslado / Diagramação] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Pressione `Ctrl + A` para selecionar todo o texto do documento.
4. Na barra de formatação, altere o campo **Espaçamento Entrelinhas** para `1.15` (ou `Simples`).
5. Acesse o menu **Formatar > Parágrafo** e zere os valores de **Espaçamento Antes e Depois** (defina como `0 pt`).
6. No menu **Layout da Página > Margens**, confira se as margens superior e inferior estão padronizadas em `2,0 cm`.
7. Clique no botão **Visualizar Impressão** e confira a diminuição da contagem total de páginas.
8. Clique em **Gravar Diagramação** e imprima o documento definitivo.

* **Sustentabilidade e Custos: A compactação correta de traslados reduz em até 20% o consumo anual de papéis de segurança da serventia.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo. → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 1):** "Notas > Protocolo" → "Notas > Protocolos" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
