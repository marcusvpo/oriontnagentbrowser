---
id: D-1.17
titulo: 'Consultar Controle de Cheques'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Filtrar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Período de Emissão'
        elemento_real: 'Período'
        camada: a11y_fuzzy_match
        confianca: 0.72
        texto_alterado: false
        evidencia: 'dom-measured | text:período | x=255, y=81, 109x40'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T21:06:27.731Z'
    rota: '#/inicio'
    titulo_painel: 'Controle de cheques'
    em_modal: true
    secoes: ['Controle de cheques']
    abas: []
    campos:
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Caixa'
        tipo: 'select'
      - rotulo: 'Setor'
        tipo: 'select'
    botoes: ['Imprimir', 'Fechar']
    alvos_do_passo: ['Filtrar']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Filtrar']
    pistas_mapa_rotas:
      - alvo: 'Filtrar'
        menu: 'Firmas > Abertura de pedido'
        rota: '#/aberturaPedidos'
        encontrado_em: 'button'
        rotulo_real: 'Filtrar'
      - alvo: 'Filtrar'
        menu: 'Firmas > Reconhecimento de firmas'
        rota: '#/pedidoFirmas/cadastrar'
        encontrado_em: 'button'
        rotulo_real: 'Filtrar'
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['Filtrar']
    sugestao_reescrita: 'Sugestão de reescrita: Filtrar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Filtrar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/inicio**, título **Controle de cheques** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Controle de cheques**.
> * **Campos:** **Período**, **Caixa**, **Setor**.
> * **Botões:** **Imprimir** (desabilitado), **Fechar**.
> * **Sem correspondência funcional na tela:** **Filtrar**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Filtrar" aparece em **Firmas > Abertura de pedido** (#/aberturaPedidos, botão **Filtrar**); "Filtrar" aparece em **Firmas > Reconhecimento de firmas** (#/pedidoFirmas/cadastrar, botão **Filtrar**).
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Filtrar** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **Filtrar** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
A rotina de Controle de Cheques permite gerenciar todos os títulos de crédito recebidos no cartório como pagamento de atos notariais. Possibilita acompanhar a custódia física, data prevista de depósito, compensação bancária e identificação do emitente.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Relatórios > Controle de Cheques**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Controle de cheques**
2. Preencha os filtros desejados: **Período de Emissão**, **Banco**, **Status** (Em Custódia, Compensado ou Devolvido) ou **Emitente**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Período de Emissão"**, porém na tela atual do Orion TN o elemento se chama **"Período"** (confiança: 72% — Rótulo visível na tela equivalente por inclusão de nome (72%)). O texto do manual não foi alterado.
3. Clique em **Filtrar** para listar os cheques cadastrados.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Filtrar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Para atualizar a situação de um título após retorno do banco, selecione o registro e altere o **Status**.
5. Clique em **Salvar** para registrar a atualização na custódia financeira.

* **Importante: Ao receber um cheque no balcão, certifique-se de registrar corretamente o número do documento, banco e agência para facilitar a conciliação.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
