---
id: D-9.0
titulo: 'Excluir Movimentação Financeira em Pedido de Certidão'
modulo: certidoes
secao: D
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.14', 'D-3.16', 'M-54.3']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Editar']
      alvos_revelados: ['Editar']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
    - passo: 3
      alvos_ausentes: ['Cifrão ($)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Consultas > Consulta de Certidões e Serviços'
        elemento_real: 'Notas > Consultas > Certidões e serviços'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwktn0op31eqjq-31] | x=686, y=254, 327x21'
      - passo: 2
        alvo_documentado: 'Editar'
        elemento_real: 'Editar'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1256, y=286, 165x24'
        evidencia: 'dom-measured | text:editar | x=53, y=104, 30x16'
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
        motivo: 'No passo 1, o manual cita "Notas > Consultas > Consulta de Certidões e Serviços", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloque'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Consultas > Consulta de Certidões e Serviços" não existe na árvore de navegação real do Orion TN. O menu **Notas > Consultas** existe na barra de navegação e contém: "Índice de escrituras e procurações", '
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
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Consultas > Consulta de Certidões e Serviços" não existe na árvore de navegação real do Orion TN. O menu **Notas > Consultas** existe na barra de navegação e contém: "Índice de escrituras e procurações", '
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios), "Imprimir" (Faça uma consulta que retorne resultados.); pré-filtro automáti'
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Consultas > Consulta de Certidões e Serviços'
          real: 'Notas > Consultas > Certidões e serviços'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um certidao que precisa existir antes (criado em outra rotina) e o alvo do passo 3 não estava na tela. Rotinas que o criam: D-3.14 — Criar Certidão; D-3.16 — Gerar Certidão no Editor de texto; M-54.3 — Como Lançar as Custas em um Pedido de Certidão.

#### Descrição:
Caso um lançamento financeiro (pagamento à vista ou depósito prévio) tenha sido lançado erroneamente em um pedido de certidão, esta rotina permite sua exclusão direta na tela de edição do ato. O procedimento estorna a entrada do caixa e restaura a cobrança do saldo.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.14 (Criar Certidão).
2. Executar antes a rotina D-3.16 (Gerar Certidão no Editor de texto).
3. Executar antes a rotina M-54.3 (Como Lançar as Custas em um Pedido de Certidão).
4. Com o certidao aberto, reexecutar a auditoria da rotina D-9.0.

* **Rotinas pré-requisito (executar antes):** **D-3.14**, **D-3.16**, **M-54.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No menu principal do Orion TN, acesse **Notas > Consultas > Consulta de Certidões e Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Certidões e serviços**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Consultas > Consulta de Certidões e Serviços"**, porém na versão atual do Orion TN a tela fica em **"Notas > Consultas > Certidões e serviços"** (confiança: 88% — Equivalência de folha: "Consulta de Certidões e Serviços" ≡ "Certidões e serviços" (mesma chave de folha sob "Notas > Consultas")). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente).
2. Utilize os filtros de busca para localizar a certidão específica e clique no botão **Editar** (ícone de lápis).
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Adicionar** · (2) **Editar**
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Editar"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-02.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
3. Dentro da certidão, clique no ícone de **Cifrão ($)** na barra superior para acessar a movimentação de caixa.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Cifrão ($)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Role a tela até o quadro de **Lançamentos Financeiros Vinculados**.
5. Identifique o lançamento que deseja remover e clique no botão **Excluir (ícone X)**.
6. O sistema exibirá aviso de confirmação; clique em **Confirmar** para finalizar o estorno da movimentação.

* **Importante: A exclusão remove imediatamente o crédito do saldo do caixa ativo do operador e reabre o pedido para novo recebimento.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios), "Imprimir" (Faça uma consulta que retorne resultados.); pré-filtro automáti → **superado** (agora: passo 3, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 1):** "Notas > Consultas > Consulta de Certidões e Serviços" → "Notas > Consultas > Certidões e serviços" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
