---
id: D-1.7
titulo: 'Ativar Caixa para Firmas e Notas'
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
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Módulos Integrados']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 6
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Inteligência Artificial'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Provedor de pagamento'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: button
          rotulo: 'Adicionar conta'
          deduzido_do_dom: false
          resultado: tela_com_erro
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:53:30.191Z'
    rota: '#/configuracoes'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Configurações', 'Contas bancárias']
    abas: []
    campos:
      - rotulo: 'Ativar rotina - Firmas'
        tipo: 'checkbox'
      - rotulo: 'Ativar rotina - Notas'
        tipo: 'checkbox'
      - rotulo: 'Abertura sem troco'
        tipo: 'checkbox'
      - rotulo: 'Balcão de firmas - Estornar pagamentos com autorização'
        tipo: 'checkbox'
      - rotulo: 'Ativar rotina Atenção! Necessário fazer um novo login'
        tipo: 'checkbox'
        secao: 'Contas bancárias'
    botoes: ['Adicionar conta', 'Visualizar conta', 'Excluir conta', 'Concluir', 'Voltar']
    alvos_do_passo: ['Módulos Integrados']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Módulos Integrados']
    contexto_catalogo_nivel1:
      id_tela: '110'
      menu: 'Configurações > Parametrizações'
      rota: '#/configuracoes'
      nivel: 2
      estado_nivel2: 'explored'
      abas: ['Geral', 'Captura e digitalização', 'Parâmetros por estação', 'Sequência', 'Comunicações', 'Campos obrigatórios', 'Painel de atalhos', 'Pedido de firmas', 'Comissões e mensalistas', 'E-mail', 'Faturamento', 'Protocolo', 'Certidão', 'Editor', 'Produtos Orion', 'Inteligência Artificial', 'WhatsApp', 'Impressão']
      secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
      tabelas: []
      pistas_consultivas:
        - alvo: 'Módulos Integrados'
          tipo: 'field'
          rotulo: 'Utiliza controle de caixa no módulo de notas.'
          onde: 'tab:Protocolo'
          em_subestado_nao_visitado: true
          similaridade: 0.46
      alvos_em_subestados: ['Módulos Integrados']
    sugestao_reescrita: 'Sugestão de reescrita: Módulos Integrados não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Módulos Integrados", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 6 gatilho(s) revelador(es) seguro(s) da tela (aba "Produtos Orion", aba "Parâmetros por estação", aba "Inteligência Artificial", aba "Painel de atalhos", aba "Provedor de pagamento", botão "Adicionar conta"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Contas bancárias**.
> * **Campos:** **Ativar rotina - Firmas**, **Ativar rotina - Notas**, **Abertura sem troco**, **Balcão de firmas - Estornar pagamentos com autorização**, **Ativar rotina Atenção! Necessário fazer um novo login** (Contas bancárias).
> * **Botões:** **Adicionar conta**, **Visualizar conta**, **Excluir conta**, **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Módulos Integrados**.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Módulos Integrados" ~ campo **Utiliza controle de caixa no módulo de notas.** em aba **Protocolo** (46%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Módulos Integrados** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * Sugestão de reescrita: **Módulos Integrados** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Esta parametrização conecta as rotinas operacionais dos módulos de Firmas e Notas ao Orion Caixa. Quando ativada, toda emissão de reconhecimento, autenticação, certidão ou escritura gera automaticamente a pendência de recebimento no caixa do cartório.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
2. Na aba lateral, localize as opções de **Módulos Integrados**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Módulos Integrados] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Marque as opções **Ativar Caixa para Firmas** e **Ativar Caixa para Notas**.
4. Defina as regras operacionais de bloqueio (se o ato pode ser finalizado antes ou somente após o pagamento).
5. Clique em **Salvar Alterações** para aplicar a parametrização em toda a serventia.

* **Observação: Com a integração ativada, cancelamentos ou estornos de atos no balcão refletem imediatamente no extrato financeiro do caixa correspondente.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
