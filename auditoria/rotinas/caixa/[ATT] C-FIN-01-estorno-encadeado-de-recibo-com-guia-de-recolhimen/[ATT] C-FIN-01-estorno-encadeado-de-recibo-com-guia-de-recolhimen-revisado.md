---
id: C-FIN-01
titulo: 'Estorno Encadeado de Recibo com Guia de Recolhimento Definitiva (PEX) Emitida'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: '2026-11-26'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Guias > Guias de Recolhimento Definitivas (PEX)" não existe na árvore de navegação real do Orion TN. O menu raiz "Guias" não existe na barra de navegação (menus lidos: "Administração", "Relatórios", "Históricos",'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T22:15:13.232Z'
    rota: '#/inicio'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Vencidas']
    abas: []
    campos: []
    botoes: []
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    pistas_mapa_rotas:
      - alvo: 'Recolhimento'
        menu: 'Administração > Comunicações > Recolhimento'
        rota: '#/recolhimentoDefinitivo'
        encontrado_em: 'section'
        rotulo_real: 'Recolhimento'
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Guias > Guias de Recolhimento Definitivas (PEX)" não existe na árvore de navegação real do Orion TN. O menu raiz "Guias" não existe na barra de navegação (menus lidos: "Administração", "Relatórios", "Históricos", "Configurações", "7", "0", "Olá, [usuário]", "Olá Marcus , seja bem-vindo!"). Nenhum item de nome igual ou parecido existe em outro ponto da árvore (47 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — a semântica fechada indicou "Administração > Comunicações > Recolhimento", que não existe (ou não é único) na árvore lida ao vivo; candidatos mais próximos: "Administração > Comunicações > Recolhimento (0.794)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Vencidas**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Recolhimento" aparece em **Administração > Comunicações > Recolhimento** (#/recolhimentoDefinitivo, seção **Recolhimento**).
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
No Orion TN, a integridade fiscal impede o estorno direto de recibos cujas taxas estaduais (PEX/Sinoreg) já foram apuradas em guia definitiva. Para desbloquear a edição do protocolo e das custas, o operador deve seguir uma cadeia estrita e reversível de estornos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion Caixa** (ou no menu **Recolhimento** do Orion TN), acesse **Guias > Guias de Recolhimento Definitivas (PEX)**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Guias > Guias de Recolhimento Definitivas (PEX)
2. Localize a guia gerada para o protocolo e selecione a opção **Estornar Guia de Recolhimento**.
3. Em seguida, no **Orion Caixa**, acesse o menu **Administração > Controle de Caixa > Recibos**.
4. Pesquise o recibo pelo número do protocolo correspondente e clique no botão **Estornar Recibo**.
5. No **Orion TN**, abra o protocolo através de **Notas > Protocolo**, aplique as retificações necessárias nas custas ou na qualificação e salve.
6. Conclua o ato novamente, envie ao caixa, emita o novo **Recibo** definitivo e processe a nova **Guia de Recolhimento**.

* **Alerta Operacional: Nunca tente reabrir o protocolo no Notas sem antes cancelar a guia PEX e o recibo no Caixa; essa sequência evita divergências no fechamento semanal do Sinoreg.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Guias > Guias de Recolhimento Definitivas (PEX)" não existe na árvore de navegação real do Orion TN. O menu raiz "Guias" não existe na barra de navegação (menus lidos: "Administração", "Relatórios", "Históricos", → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
