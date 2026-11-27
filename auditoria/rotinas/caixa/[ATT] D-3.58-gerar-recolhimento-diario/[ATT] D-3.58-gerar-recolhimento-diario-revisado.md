---
id: D-3.58
titulo: 'Gerar Recolhimento Diário'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Dia de Referência']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T18:55:49.618Z'
    rota: '#/inicio'
    titulo_painel: 'Relatório - Recolhimento diário'
    em_modal: true
    secoes: ['Relatório - Recolhimento diário']
    abas: []
    campos:
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Setor'
        tipo: 'select'
      - rotulo: 'Ordenar por'
        tipo: 'radio'
      - rotulo: 'Protocolo'
        tipo: 'radio'
      - rotulo: 'PDF'
        tipo: 'radio'
      - rotulo: 'Excel'
        tipo: 'radio'
      - rotulo: 'Agrupar setor notas'
        tipo: 'checkbox'
      - rotulo: 'Incluir outras especialidades'
        tipo: 'checkbox'
      - rotulo: 'Filtrar somente serviços mapeados para o LCW'
        tipo: 'checkbox'
    botoes: ['Imprimir', 'Fechar']
    alvos_do_passo: ['Dia de Referência']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Dia de Referência']
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['Dia de Referência']
    sugestao_reescrita: 'Sugestão de reescrita: Dia de Referência não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Dia de Referência", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **Relatório - Recolhimento diário** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Relatório - Recolhimento diário**.
> * **Campos:** **Período**, **Setor**, **Ordenar por**, **Protocolo**, **PDF**, **Excel**, **Agrupar setor notas**, **Incluir outras especialidades**, **Filtrar somente serviços mapeados para o LCW**.
> * **Botões:** **Imprimir** (desabilitado), **Fechar**.
> * **Sem correspondência funcional na tela:** **Dia de Referência**.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Dia de Referência** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **Dia de Referência** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O demonstrativo de Recolhimento Diário detalha os atos praticados no expediente e segrega as parcelas financeiras pertencentes à serventia (emolumentos líquidos) e as destinadas aos repasses obrigatórios (Poder Judiciário, Ministério Público, Defensoria, FARPEN e ISS).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Relatórios > Recolhimento Diário**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Recolhimento diário**
2. No campo de data, selecione o **Dia de Referência** para apuração.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Dia de Referência] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Escolha o nível de detalhamento desejado: **Sintético por Ato** ou **Analítico por Protocolo/Recibo**.
4. Clique em **Processar Relatório**.
5. Analise o quadro de partilha de valores demonstrando o valor bruto, deduções de fundos e valor líquido da serventia.
6. Clique em **Imprimir** ou exporte o resumo para instruir o fechamento da tesouraria do cartório.

* **Observação: As alíquotas aplicadas baseiam-se na parametrização vigente da Tabela de Custas do Estado.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
