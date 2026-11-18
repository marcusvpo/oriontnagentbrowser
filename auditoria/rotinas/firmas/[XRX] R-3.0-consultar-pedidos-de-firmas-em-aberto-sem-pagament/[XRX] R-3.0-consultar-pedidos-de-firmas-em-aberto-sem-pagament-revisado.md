---
id: R-3.0
titulo: 'Consultar Pedidos de Firmas em Aberto Sem Pagamento no Caixa'
modulo: firmas
secao: R
auditoria_ui:
  data_execucao: '2026-11-18'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['R-10.0', 'D-3.11', 'V-CCA.3.3']
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Consultas > Reconhecimento de Firmas'
        elemento_real: 'Firmas > Consultas > Reconhecimentos de firmas'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwmozif5cvxd15-9] | x=633, y=88, 160x21'
  historico_reauditoria:
    - data: '2026-11-18'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'validado_com_ajustes'
      tags_anteriores: []
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: null
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 3
          alvo: '"Aguardando Pagamento"'
          real: 'Aguardando atendimento'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: '"Iniciado"'
          real: 'Iniciado em'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 5
          alvo: 'Caixa > Administração > Pagamentos'
          real: 'Administração'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Consultas > Reconhecimento de Firmas'
          real: 'Firmas > Consultas > Reconhecimentos de firmas'
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
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 11 coluna(s) visível(is) (Pedido, RPS, Status, Usuário, Escrevente, Mensalista) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela, '
      bloqueio_atual:
        passo: 5
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 3
          alvo: '"Aguardando Pagamento"'
          real: 'Aguardando atendimento'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Firmas > Consultas > Reconhecimento de Firmas'
          real: 'Firmas > Consultas > Reconhecimentos de firmas'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 5, a tela está sem dados (grade com 11 coluna(s) visível(is) (Pedido, RPS, Status, Usuário, Escrevente, Mensalista) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: R-10.0 — Abrir Pedido de Firmas no Balcão de Atendimento; D-3.11 — Fazer Reconhecimento de Firma; V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
Esta consulta permite localizar pedidos de balcão de firmas que foram emitidos pelos atendentes mas permanecem pendentes de liquidação financeira no Caixa, impedindo o fechamento contábil no Livro Caixa Web.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina R-10.0 (Abrir Pedido de Firmas no Balcão de Atendimento) para criar o registro necessário.
2. Executar antes a rotina D-3.11 (Fazer Reconhecimento de Firma) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina R-3.0.

* **Rotinas pré-requisito (executar antes):** **R-10.0**, **D-3.11**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Consultas > Reconhecimento de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Consultas** · (3) **Reconhecimentos de firmas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Consultas > Reconhecimento de Firmas"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Consultas > Reconhecimentos de firmas"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Pedido, RPS, Status, Usuário, Escrevente, Mensalista).
2. No campo de filtro **Período**, defina a data inicial e final do atendimento.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Pedido, RPS, Status, Usuário, Escrevente, Mensalista).
3. No campo **Status**, selecione os filtros **"Aguardando Pagamento"** e **"Iniciado"**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Pedido, RPS, Status, Usuário, Escrevente, Mensalista).
4. Clique no botão **Filtrar** para listar todas as comandas pendentes de liquidação.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Pedido, RPS, Status, Usuário, Escrevente, Mensalista).
5. Na lista retornada, clique sobre o número do pedido desejado para conferir os itens ou acesse o módulo **Caixa > Administração > Pagamentos** para efetuar a baixa financeira.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Pedido, RPS, Status, Usuário, Escrevente, Mensalista).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Caixa > Administração > Pagamentos

* **Importante: Os atos realizados no balcão de firmas só são contabilizados no Livro Caixa Web após a confirmação do pagamento no Caixa.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo não registrado — Dependência Cruzada de Rotina: No passo 3, a tela está sem dados (grade com 11 coluna(s) visível(is) (Pedido, RPS, Status, Usuário, Escrevente, Mensalista) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela,  → **mantido** (agora: passo 5, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 3):** ""Aguardando Pagamento"" → "Aguardando atendimento" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Firmas > Consultas > Reconhecimento de Firmas" → "Firmas > Consultas > Reconhecimentos de firmas" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
