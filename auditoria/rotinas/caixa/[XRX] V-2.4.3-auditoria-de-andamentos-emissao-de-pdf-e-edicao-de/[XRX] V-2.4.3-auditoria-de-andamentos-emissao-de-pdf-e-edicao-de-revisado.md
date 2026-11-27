---
id: V-2.4.3
titulo: 'Auditoria de Andamentos, Emissão de PDF e Edição de Orçamentos na Consulta'
modulo: caixa
secao: V
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.13']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Auditoria (Andamentos)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Consulta > Orçamentos'
        elemento_real: 'Notas > Orçamentos'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxzmci13hy03q-20] | x=503, y=88, 183x20'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 14 coluna(s) visível(is) (Item, Descrição, Qtd. Adicional, Qtd. Cálculo, Cálculo, Valor venal) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obrigatórios para liberar o botão); pré-filtro automático tentado antes de declarar a grade vazia: a busca (filtro amplo) não retornou registros no ambiente). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-3.13 — Fazer Orçamento Completo.

#### Descrição:
Procedimento para auditar o histórico de alterações (log de auditoria com usuário, data e hora), emitir a via em PDF diretamente pela tela de pesquisa e acessar o cadastro do orçamento em modo de visualização somente leitura (ícone do olho) ou em modo de edição direta destravada (ícone do lápis/caneta) no **ORION TN**.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.13 (Fazer Orçamento Completo) para criar o registro necessário.
2. Reexecutar a auditoria da rotina V-2.4.3.

* **Rotinas pré-requisito (executar antes):** **D-3.13**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Notas > Consulta > Orçamentos** e realize a busca pelos registros desejados.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Orçamentos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Consulta > Orçamentos"**, porém na versão atual do Orion TN a tela fica em **"Notas > Orçamentos"** (confiança: 88% — Item "Orçamentos" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem). Auto-cura por menor profundidade de cadeia: "Notas > Orçamentos" (profundidade 2) escolhida entre "Notas > Orçamentos" e "Notas > Consultas > Orçamentos"). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Item, Descrição, Qtd. Adicional, Qtd. Cálculo, Cálculo, Valor venal).
2. Para consultar a **Auditoria (Andamentos)** do orçamento:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Item, Descrição, Qtd. Adicional, Qtd. Cálculo, Cálculo, Valor venal).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Auditoria (Andamentos), Andamentos] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * Na linha do registro desejado, clique no ícone de **Andamentos**.
   * A tela exibirá o log completo de auditoria do sistema: data e hora exatas de criação, identificação do usuário/escrevente responsável, registro de todas as alterações efetuadas nas custas e o histórico de eventuais exclusões de itens.
3. Para emitir a **Impressão em PDF**:
   * Na linha do orçamento pesquisado, clique no botão de **Impressão em PDF**.
   * O sistema abrirá uma nova guia no navegador com o documento formatado para salvar no computador ou enviar para impressão na impressora.
4. Para acessar a tela de cadastro do orçamento:
   * **Modo Somente Leitura (Ícone do Olho)**: clique no ícone do **Olho** para abrir a ficha do orçamento protegida contra edições acidentais; para habilitar modificações, clique no botão **Alterar** na barra inferior da tela.
   * **Modo Edição Direta (Ícone do Lápis / Caneta)**: clique no ícone do **Lápis** na listagem de resultados para abrir o orçamento imediatamente em modo de edição, permitindo alterar dados e custas diretamente sem precisar clicar em "Alterar".

* **Observação: O registro de andamentos é gravado de forma automática e inviolável pelo sistema, funcionando como ferramenta de compliance e segurança operacional para o tabelião.**
* **Observação: A abertura pelo ícone do olho é recomendada para atendimentos rápidos de balcão para conferência de valores sem risco de alteração inadvertida dos cálculos.**
* **Dica / Caso Real do 0800: Evite manter o mesmo protocolo aberto em mais de uma aba do Google Chrome para não gerar bloqueios automáticos de concorrência (*locks*) no banco de dados.**
