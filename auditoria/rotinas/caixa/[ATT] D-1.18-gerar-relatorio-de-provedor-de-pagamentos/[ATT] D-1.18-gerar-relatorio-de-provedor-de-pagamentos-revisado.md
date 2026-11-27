---
id: D-1.18
titulo: 'Gerar Relatório de Provedor de Pagamentos'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Período de Consulta', 'Status da Transação']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T21:09:07.787Z'
    rota: '#/inicio'
    titulo_painel: 'Provedor de pagamentos'
    em_modal: true
    secoes: ['Provedor de pagamentos']
    abas: []
    campos:
      - rotulo: 'Provedor'
        tipo: 'select'
      - rotulo: 'Período de vendas'
        tipo: 'text'
      - rotulo: 'Data de liquidação'
        tipo: 'text'
      - rotulo: 'Forma de pagamento'
        tipo: 'select'
      - rotulo: 'Status do pagamento'
        tipo: 'select'
      - rotulo: 'Usuario responsável'
        tipo: 'select'
      - rotulo: 'Período de pagamento'
        tipo: 'text'
      - rotulo: 'PDF'
        tipo: 'radio'
      - rotulo: 'Excel'
        tipo: 'radio'
    botoes: ['Imprimir', 'Cancelar']
    alvos_do_passo: ['Período de Consulta', 'Status da Transação']
    correspondencias_sugeridas:
      - alvo: 'Período de Consulta'
        elemento_real: 'Período de vendas'
        tipo: 'campo'
        similaridade: 0.62
      - alvo: 'Período de Consulta'
        elemento_real: 'Período de pagamento'
        tipo: 'campo'
        similaridade: 0.57
      - alvo: 'Status da Transação'
        elemento_real: 'Status do pagamento'
        tipo: 'campo'
        similaridade: 0.48
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['Período de Consulta', 'Status da Transação']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Período de Consulta por Período de vendas (campo); substituir Status da Transação por Status do pagamento (campo).'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Período de Consulta", "Status da Transação", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Consultas > Consulta de caixa (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/inicio**, título **Provedor de pagamentos** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Provedor de pagamentos**.
> * **Campos:** **Provedor**, **Período de vendas**, **Data de liquidação**, **Forma de pagamento**, **Status do pagamento**, **Usuario responsável**, **Período de pagamento**, **PDF**, **Excel**.
> * **Botões:** **Imprimir** (desabilitado), **Cancelar**.
> * **Correspondência sugerida para "Período de Consulta":** **Período de vendas** (campo, 62% — termo(s) em comum: periodo); **Período de pagamento** (campo, 57% — termo(s) em comum: periodo).
> * **Correspondência sugerida para "Status da Transação":** **Status do pagamento** (campo, 48% — termo(s) em comum: statu).
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Período de Consulta**, **Status da Transação** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 3, substituir **Período de Consulta** por **Período de vendas** (campo); substituir **Status da Transação** por **Status do pagamento** (campo). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Este relatório consolida todas as liquidações efetuadas por meio de intermediadores integrados (Parcela Express e gateways similares). Permite confrontar as autorizações de débito, crédito e Pix com os lançamentos efetuados nos protocolos do cartório.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Relatórios > Provedor de Pagamentos**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Provedor de pagamentos**
2. Selecione o **Provedor** desejado (ex: Parcela Express).
   [aqui vai a print "passo-02.png"]
3. Informe o **Período de Consulta** e selecione o **Status da Transação** (Aprovadas, Pendentes ou Canceladas).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Período de Consulta, Status da Transação] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Clique em **Gerar Relatório**.
5. Analise as colunas contendo NSU, Código de Autorização, Protocolo de Origem, Valor Bruto e Taxa do Provedor.

* **Observação: O relatório é essencial para fechar o lote de cartões no encerramento diário e conferir os repasses em conta corrente.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
