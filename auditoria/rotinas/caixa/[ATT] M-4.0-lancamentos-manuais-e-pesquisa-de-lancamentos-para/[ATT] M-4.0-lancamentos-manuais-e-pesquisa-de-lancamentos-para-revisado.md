---
id: M-4.0
titulo: 'Lançamentos Manuais e Pesquisa de Lançamentos para Mensalistas'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Novo lançamento'
        elemento_real: '+'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: false
        evidencia: 'dom-measured | text:+ | x=1156, y=22, 13x13'
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T18:48:26.258Z'
    rota: '#/mensalistaLancamentoManual'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Lançamentos', 'Lançamento']
    abas: []
    campos:
      - rotulo: 'Pesquisar por mensalista'
        tipo: 'text'
        secao: 'Lançamento'
      - rotulo: 'Tipo'
        tipo: 'select'
        secao: 'Lançamento'
      - rotulo: 'Requisição'
        tipo: 'text'
        secao: 'Lançamento'
      - rotulo: 'Responsável'
        tipo: 'text'
        secao: 'Lançamento'
      - rotulo: 'Data'
        tipo: 'text'
        secao: 'Lançamento'
      - rotulo: 'Hora'
        tipo: 'time'
        secao: 'Lançamento'
      - rotulo: 'Valor'
        tipo: 'text'
        secao: 'Lançamento'
      - rotulo: 'Descrição'
        tipo: 'text'
        secao: 'Lançamento'
    botoes: ['Limpar', 'Adicionar pagamento', 'Salvar', 'Voltar']
    alvos_do_passo: ['Novo lançamento']
    correspondencias_sugeridas:
      - alvo: 'Novo lançamento'
        elemento_real: 'Lançamento'
        tipo: 'seção'
        similaridade: 0.67
      - alvo: 'Novo lançamento'
        elemento_real: 'Lançamentos'
        tipo: 'seção'
        similaridade: 0.64
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '063'
      menu: 'Administração > Mensalistas > Lançamentos manuais'
      rota: '#/mensalistaLancamentoManual'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Lançamentos']
      tabelas: []
      pistas_consultivas:
        - alvo: 'Novo lançamento'
          tipo: 'heading'
          rotulo: 'Lançamentos'
          onde: 'root'
          em_subestado_nao_visitado: false
          similaridade: 0.75
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Novo lançamento por Lançamento (seção).'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Novo lançamento", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/mensalistaLancamentoManual**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Lançamentos**, **Lançamento**.
> * **Campos:** **Pesquisar por mensalista** (Lançamento), **Tipo** (Lançamento), **Requisição** (Lançamento), **Responsável** (Lançamento), **Data** (Lançamento), **Hora** (Lançamento), **Valor** (Lançamento), **Descrição** (Lançamento).
> * **Botões:** **Limpar**, **Adicionar pagamento**, **Salvar** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Novo lançamento":** **Lançamento** (seção, 67% — termo(s) em comum: lancamento); **Lançamentos** (seção, 64% — termo(s) em comum: lancamento).
> * **Contexto do Catálogo Nível 2 (`063`, consultivo):** tela **Administração > Mensalistas > Lançamentos manuais** | pistas para alvos ausentes no recorte atual: "Novo lançamento" ~ seção **Lançamentos** em superfície principal (75%).
> * Sugestão de reescrita: no passo 2, substituir **Novo lançamento** por **Lançamento** (seção). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar movimentações avulsas de crédito, débito ou serviços diretamente na conta corrente de um cliente mensalista, além de pesquisar o histórico de lançamentos manuais e realizar estornos quando necessário.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Mensalistas > Lançamentos manuais**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Lançamentos manuais**
2. No menu lateral da tela, selecione **Novo lançamento**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Novo lançamento"**, porém na tela atual do Orion TN o elemento se chama **"+"** (confiança: 96% — Sinônimo canônico Orion TN ('Novo lançamento' -> '+')). O texto do manual não foi alterado.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Novo lançamento"
3. Selecione o **Mensalista** (e a **Filial**, se aplicável).
4. Preencha os dados do lançamento:
   * **Tipo**: selecione **Crédito** (para aporte/adiantamento), **Débito** ou **Serviços**.
   * **Requisição**: informe o número de ordem/requisição do cliente ou deixe automático se parametrizado.
   * **Data** e **Hora**: valide o momento contábil do lançamento.
   * **Forma de pagamento** e **Valor**: selecione o código ou descrição do meio de pagamento e digite o valor monetário.
5. Insira a justificativa no campo **Histórico** e clique em **Salvar**.
6. Para consultar ou estornar: acesse a aba de pesquisa na mesma tela, preencha os filtros por período ou mensalista, clique em **Filtrar** e utilize a ação **Estornar** no registro desejado.

* **Importante: O estorno de lançamento manual reverte o saldo na hora e mantém registro de auditoria com usuário e data.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
