---
id: D-3.10
titulo: 'Consultar Serviços Praticados'
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
  rotinas_pre_requisito: ['D-1.6', 'D-3.66', 'D-3.4']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Escrevente/Usuário', 'Tipo de Ato', 'Guichê']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Mais filtros'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Período de Análise'
        elemento_real: 'Período'
        camada: a11y_fuzzy_match
        confianca: 0.72
        texto_alterado: false
        evidencia: 'dom-measured | text:período | x=255, y=94, 129x40'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 10 coluna(s) visível(is) (Data serviço, Ped., Data ped., Serviço, Série, Seq.) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios para efetuar a busca), "Imprimir" (Impressão desativada temporariamente para revisão devido a impactos de desempenho. Caso utilize esta rotina, entre em co)). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-1.6 — Cadastrar Outros Serviços; D-3.66 — Registrar Serviço Interno; D-3.4 — Cadastrar Termo de Comparecimento.

#### Descrição:
A consulta de Serviços Praticados consolida todos os atos praticados no balcão de notas e firmas (autenticações, reconhecimentos, termos e certidões avulsas), demonstrando quantidades, valores de emolumentos arrecadados e insumos baixados.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-1.6 (Cadastrar Outros Serviços) para criar o registro necessário.
2. Executar antes a rotina D-3.66 (Registrar Serviço Interno) para criar o registro necessário.
3. Executar antes a rotina D-3.4 (Cadastrar Termo de Comparecimento) para criar o registro necessário.
4. Reexecutar a auditoria da rotina D-3.10.

* **Rotinas pré-requisito (executar antes):** **D-1.6**, **D-3.66**, **D-3.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Consultas > Serviços Praticados**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Consultas** · (3) **Serviços praticados**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data serviço, Ped., Data ped., Serviço, Série, Seq.).
2. Defina o **Período de Análise** informando data inicial e data final.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Período de Análise"**, porém na tela atual do Orion TN o elemento se chama **"Período"** (confiança: 72% — Rótulo visível na tela equivalente por inclusão de nome (72%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data serviço, Ped., Data ped., Serviço, Série, Seq.).
3. Selecione os filtros de segmentação: **Escrevente/Usuário**, **Tipo de Ato** ou **Guichê**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data serviço, Ped., Data ped., Serviço, Série, Seq.).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Escrevente/Usuário, Tipo de Ato, Guichê] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. Clique em **Pesquisar** para exibir a listagem e os gráficos de resumo.
5. Analise o rodapé da tabela com a soma total de atos, valores tributáveis e selos de fiscalização utilizados.

* **Importante: Esta tela é a principal ferramenta de conciliação de atos praticados antes do envio da carga diária à Corregedoria.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
