---
id: D-1.10
titulo: 'Configurar Painel de Atalhos'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Adicionar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 5
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Inteligência Artificial'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Geral'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Provedor de pagamento'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Painel de Atalhos'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy184wmeru6ea-37] | x=1041, y=88, 135x20'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Dados no Banco de Homologação (Grade Vazia)**.
>
> **Motivo Técnico:** No passo 3, a validação não pôde prosseguir: grade com 4 coluna(s) visível(is) (Função, Base, Atalho, Complemento) e 0 linhas de dados. Não existe botão Adicionar/Novo na tela. Nenhuma rotina do KB cria esses registros.

#### Descrição:
A tela inicial do Orion Caixa conta com uma área de atalhos rápidos que pode ser customizada conforme a rotina do operador, garantindo acesso em um clique a funções como Abertura de Caixa, Recebimento de Notas, Pagamento de Certidões e Sangria.

#### Roteiro Técnico para Execução Manual:
1. Equipe de Produtos: popular o banco de homologação com ao menos um registro nesta tela.
2. Reexecutar a auditoria da rotina D-1.10.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Painel de Atalhos**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Painel de atalhos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Painel de Atalhos"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — Grafo vivo de rotas (orion-route-graph.json): "Painel de Atalhos" é aba "Painel de atalhos" da tela "Configurações > Parametrizações"). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Painel de atalhos** foi medida ao vivo (mesmo nome do manual) e acionada.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
2. Visualize as rotinas disponíveis na coluna esquerda e os atalhos ativos na coluna direita.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
3. Clique em **Adicionar** na rotina desejada para incluí-la no painel.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Adicionar] não localizado no DOM nem na Árvore de Acessibilidade, nem após 5 gatilho(s) revelador(es) seguro(s)
4. Utilize as setas de ordenação para priorizar os atalhos mais críticos no atendimento.
5. Clique em **Salvar** para registrar as alterações na interface.

* **Observação: A configuração de atalhos pode ser salva globalmente para a serventia ou personalizada por estação de trabalho.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
