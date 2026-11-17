---
id: V-7.3.2
titulo: 'Geração de Recibo, Lavratura do Ato e Tramitação de Selo Digital para o Livro'
modulo: livros
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-1'
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
      alvos_ausentes: ['Livro']
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
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkxooih8wqqwt-18] | x=503, y=67, 183x21'
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
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
Procedimento indispensável que antecede a confecção e impressão definitiva do livro de notas. A geração do recibo formaliza a data de lavratura do ato, calcula automaticamente a folha inicial do livro com base no último ato lavrado, gera o **Selo Digital**, transmite as informações ao **Tribunal de Justiça (TJ)** e executa as rotinas financeiras de verbas e comissões.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina V-7.3.2.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No dia agendado para o comparecimento das partes e assinatura do ato, acesse o protocolo em **Notas > Protocolo** e clique em **Editar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. No campo **Livro**, selecione ou informe o número do livro de notas que será utilizado.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Livro] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Pressione a tecla **Tab** no campo do livro. O sistema calculará e preencherá automaticamente:
   * **Folha Inicial:** Calculada com base no último ato lavrado somando uma unidade (+1 folha).
   * **Folha Final:** Preenchida provisoriamente com o mesmo número da folha inicial. Não é necessário alterar a folha final manualmente, pois o editor do **ORION TN** atualizará a folha final de forma automatizada na impressão definitiva.
4. Realize as validações financeiras e cadastrais obrigatórias:
   * **Tomador do Recibo:** Acesse o campo de tomador e defina o responsável financeiro (marcando a opção **Mesmo do solicitante** ou abrindo a tela de tomador, preenchendo os dados e clicando em **Salvar**).
   * **Custas e Emolumentos:** Certifique-se de que os atos e custas foram lançados na aba financeira, fazendo com que o botão de emissão de recibo fique habilitado na cor **verde**.
5. Clique no botão para **Gerar Recibo**.
6. O sistema processará a solicitação:
   * Gera o **Selo Digital** oficial;
   * Transmite os dados do ato ao **TJ (Tribunal de Justiça)**;
   * Registra a arrecadação de verbas e o repasse de comissões aos escreventes configurados.
7. Ao término da emissão, o sistema abrirá automaticamente duas janelas/guias:
   * **Guia do Recibo:** Exibe o espelho do recibo para impressão. **Atenção:** Feche esta guia sem imprimir no momento, pois a informação da folha final ainda não reflete a contagem real de páginas do ato.
   * **Tela do Selo Digital:** Exibe o número do selo e o **QR Code** gerados. Não é necessário copiar o selo ou os dados manualmente, pois o editor do sistema os incorporará automaticamente. Clique no botão **Voltar** para fechar a tela.

* **Folha Inicial: Calculada com base no último ato lavrado somando uma unidade (+1 folha).**
* **Folha Final: Preenchida provisoriamente com o mesmo número da folha inicial. Não é necessário alterar a folha final manualmente, pois o editor do **ORION TN** atualizará a folha final de forma automatizada na impressão definitiva.**
* **Tomador do Recibo: Acesse o campo de tomador e defina o responsável financeiro (marcando a opção **Mesmo do solicitante** ou abrindo a tela de tomador, preenchendo os dados e clicando em **Salvar**).**
* **Custas e Emolumentos: Certifique-se de que os atos e custas foram lançados na aba financeira, fazendo com que o botão de emissão de recibo fique habilitado na cor **verde**.**
* **Guia do Recibo: Exibe o espelho do recibo para impressão. **Atenção:** Feche esta guia sem imprimir no momento, pois a informação da folha final ainda não reflete a contagem real de páginas do ato.**
* **Tela do Selo Digital: Exibe o número do selo e o **QR Code** gerados. Não é necessário copiar o selo ou os dados manualmente, pois o editor do sistema os incorporará automaticamente. Clique no botão **Voltar** para fechar a tela.**
* **Importante: A geração prévia do recibo é pré-requisito técnico absoluto para a geração do livro no editor. Se o recibo não for emitido, os dados de data de lavratura, número de selo digital e QR Code não constarão nas finalizações do livro e do traslado.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo. → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 1):** "Notas > Protocolo" → "Notas > Protocolos" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
