---
id: M-18.0
titulo: 'Consulta de Serviços Praticados'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-1.6', 'D-3.66', 'D-3.4']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Série'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Sequência'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Hash'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Nº Cartão'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 10 coluna(s) visível(is) (Data serviço, Ped., Data ped., Serviço, Série, Seq.) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios para efetuar a busca), "Imprimir" (Impressão desativada temporariamente para revisão devido a impactos de desempenho. Caso utilize esta rotina, entre em co)). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-1.6 — Cadastrar Outros Serviços; D-3.66 — Registrar Serviço Interno; D-3.4 — Cadastrar Termo de Comparecimento.

#### Descrição:
Ferramenta analítica para rastreabilidade minuciosa de cada ato individual praticado no balcão de firmas, permitindo buscas cirúrgicas por código de autenticidade (Hash), numeração de selo, carimbo, número de cartão ou escrevente.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-1.6 (Cadastrar Outros Serviços) para criar o registro necessário.
2. Executar antes a rotina D-3.66 (Registrar Serviço Interno) para criar o registro necessário.
3. Executar antes a rotina D-3.4 (Cadastrar Termo de Comparecimento) para criar o registro necessário.
4. Reexecutar a auditoria da rotina M-18.0.

* **Rotinas pré-requisito (executar antes):** **D-1.6**, **D-3.66**, **D-3.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Consultas > Serviços praticados**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Consultas** · (3) **Serviços praticados**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data serviço, Ped., Data ped., Serviço, Série, Seq.).
2. No painel de pesquisa, preencha os filtros necessários para a auditoria:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Serviço** · (2) **Período** · (3) **Mês de referência** · (4) **Nome**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Série"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Sequência"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Hash"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nº Cartão"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Data serviço, Ped., Data ped., Serviço, Série, Seq.).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Série", "Sequência", "Hash", "Nº Cartão"
   * **Serviço**: selecione o tipo de ato (Autenticação, Reconhecimento por Semelhança ou Autenticidade).
   * **Período** ou **Mês de referência**: delimite as datas do ato.
   * **Série** e **Sequência**: informe os dados do selo fiscal físico ou digital consumido.
   * **Hash**: digite o código alfanumérico de validação impresso na etiqueta.
   * **Nº Cartão** ou **Nome**: filtre pelo signatário ou pela ficha de firma.
3. Clique em **Filtrar** para processar e exibir os registros correspondentes.
4. Na grade de resultados, visualize a data/hora exata do ato, escrevente operador, valores e número do pedido de origem.
5. Clique em **Imprimir** para exportar o relatório de conferência ou em **Limpar** para reiniciar a pesquisa.

* **Importante: A busca por Hash ou Selo é o canal oficial de verificação para responder ofícios judiciais e pedidos de confirmação de autenticidade de terceiros.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
