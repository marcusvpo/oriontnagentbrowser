---
id: D-3.59
titulo: 'Gerar Recolhimento Resumido'
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
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Intervalo de Datas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:27:10.050Z'
    rota: '#/inicio'
    titulo_painel: 'Recolhimento resumido'
    em_modal: true
    secoes: ['Recolhimento resumido']
    abas: []
    campos:
      - rotulo: 'Tipo'
        tipo: 'radio'
      - rotulo: 'Diário'
        tipo: 'radio'
      - rotulo: 'Modo de impressão'
        tipo: 'radio'
      - rotulo: 'Paisagem'
        tipo: 'radio'
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Todos'
        tipo: 'radio'
      - rotulo: 'Personalizado'
        tipo: 'radio'
      - rotulo: 'Sem emolumentos'
        tipo: 'checkbox'
      - rotulo: 'Incluir as custas de outras especialidades'
        tipo: 'checkbox'
      - rotulo: 'PDF'
        tipo: 'radio'
        secao: 'Recolhimento resumido'
      - rotulo: 'Excel'
        tipo: 'radio'
        secao: 'Recolhimento resumido'
    botoes: ['Imprimir', 'Fechar']
    alvos_do_passo: ['Intervalo de Datas']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Intervalo de Datas']
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['Intervalo de Datas']
    sugestao_reescrita: 'Sugestão de reescrita: Intervalo de Datas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Intervalo de Datas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **Recolhimento resumido** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Recolhimento resumido**.
> * **Campos:** **Tipo**, **Diário**, **Modo de impressão**, **Paisagem**, **Período**, **Todos**, **Personalizado**, **Sem emolumentos**, **Incluir as custas de outras especialidades**, **PDF** (Recolhimento resumido), **Excel** (Recolhimento resumido).
> * **Botões:** **Imprimir** (desabilitado), **Fechar**.
> * **Sem correspondência funcional na tela:** **Intervalo de Datas**.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Intervalo de Datas** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **Intervalo de Datas** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O relatório de Recolhimento Resumido oferece uma visão executiva e compacta da arrecadação e repasses da serventia. Agrupa os valores por período selecionado (semanal, mensal ou anual), demonstrando em uma única folha os totais de cada fundo fiscalizador.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Relatórios > Recolhimento Resumido**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Recolhimento resumido**
2. Preencha o **Intervalo de Datas** desejado (ex: mês civil completo).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Intervalo de Datas] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Selecione o agrupamento (**Por Dia**, **Por Quinzena** ou **Total do Período**).
4. Clique em **Gerar Resumo**.
5. Visualize o demonstrativo consolidado com os subtotais de emolumentos, repasses judiciais, impostos municipais e receita líquida.
6. Clique em **Exportar / Imprimir** para arquivamento contábil.

* **Observação: É o modelo ideal para encaminhamento mensal à assessoria contábil do tabelionato para conciliação do Livro Caixa Geral.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
