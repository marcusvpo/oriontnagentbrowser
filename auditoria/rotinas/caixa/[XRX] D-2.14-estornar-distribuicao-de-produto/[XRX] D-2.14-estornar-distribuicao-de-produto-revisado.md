---
id: D-2.14
titulo: 'Estornar Distribuição de Produto'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.5']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Usuário', 'Máquina', 'Data da Distribuição']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 2
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Consulta'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 3 coluna(s) visível(is) (Série, Sequência inicial, Sequência final) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obrigatórios para concluir)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.5 — Fazer Digitalização em Lote por Sequência de Cartão.

#### Descrição:
A rotina de Estorno de Distribuição permite reverter a alocação de lotes de papel ou selos entregues a uma máquina ou escrevente. O procedimento cancela a custódia do destinatário e retorna os itens não consumidos imediatamente ao saldo disponível no almoxarifado central.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.5 (Fazer Digitalização em Lote por Sequência de Cartão) para criar o registro necessário.
2. Reexecutar a auditoria da rotina D-2.14.

* **Rotinas pré-requisito (executar antes):** **D-3.5**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Distribuição**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Distribuição**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
2. Na tela de consulta de distribuições ativas, filtre pelo **Usuário**, **Máquina** ou **Data da Distribuição**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Usuário, Máquina, Data da Distribuição] não localizado no DOM nem na Árvore de Acessibilidade, nem após 2 gatilho(s) revelador(es) seguro(s)
3. Localize e selecione a linha da distribuição que deseja reverter.
4. Clique no botão **Estornar**.
5. O sistema exibirá mensagem de confirmação informando a quantidade e série dos itens a retornar; confirme a operação.
6. A distribuição é removida da tela e o saldo do produto retorna imediatamente disponível para nova entrega no almoxarifado.

* **Importante: Apenas itens que ainda não foram consumidos em atos notariais podem ser estornados. Selos já utilizados não são revertidos.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
