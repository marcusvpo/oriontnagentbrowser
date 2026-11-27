---
id: M-16.9
titulo: 'Parametrizar Comissões e Mensalistas'
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
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Comissões', 'Valor Bruto dos Emolumentos', 'Valor Líquido']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 7
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Comunicações'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Campos obrigatórios'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Impressão'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Faturamento'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Comissões e mensalistas'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxyo1pz60u6ny-130] | x=850, y=171, 175x20'
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T19:49:17.470Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Comissões - Balcão', 'Comissões - Notas', 'Bonificação - Balcão', 'Bonificação - Notas', 'Mensalistas']
    abas: []
    campos:
      - rotulo: 'No momento que concluir o pedido'
        tipo: 'radio'
      - rotulo: 'No momento que for realizado o pagamento'
        tipo: 'radio'
      - rotulo: 'Não utilizar comissão'
        tipo: 'radio'
      - rotulo: 'Taxa para cálculo'
        tipo: 'select'
      - rotulo: 'No momento que lavrar o ato'
        tipo: 'radio'
      - rotulo: 'Automática'
        tipo: 'radio'
      - rotulo: 'Manual'
        tipo: 'radio'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Comissões', 'Valor Bruto dos Emolumentos', 'Valor Líquido']
    correspondencias_sugeridas:
      - alvo: 'Comissões'
        elemento_real: 'Comissões - Balcão'
        tipo: 'seção'
        similaridade: 0.97
      - alvo: 'Comissões'
        elemento_real: 'Comissões - Notas'
        tipo: 'seção'
        similaridade: 0.97
    alvos_sem_correspondencia: ['Valor Bruto dos Emolumentos', 'Valor Líquido']
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
        - alvo: 'Valor Líquido'
          tipo: 'field'
          rotulo: 'Exigir valor minímo de boleto'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 0.46
        - alvo: 'Valor Líquido'
          tipo: 'field'
          rotulo: 'Valor mínimo para enquadramento no COAF'
          onde: 'tab:Protocolo'
          em_subestado_nao_visitado: true
          similaridade: 0.46
      alvos_em_subestados: ['Valor Líquido']
      alvos_ausentes_nivel2: ['Valor Bruto dos Emolumentos']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Comissões por Comissões - Balcão (seção). Valor Bruto dos Emolumentos, Valor Líquido não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Comissões", "Valor Bruto dos Emolumentos", "Valor Líquido", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Comunicações", aba "Campos obrigatórios", aba "Produtos Orion", aba "Parâmetros por estação", aba "Impressão", aba "Faturamento"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Comissões (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Comissões - Balcão**, **Comissões - Notas**, **Bonificação - Balcão**, **Bonificação - Notas**, **Mensalistas**.
> * **Campos:** **No momento que concluir o pedido**, **No momento que for realizado o pagamento**, **Não utilizar comissão**, **Taxa para cálculo**, **No momento que lavrar o ato**, **Automática**, **Manual**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Comissões":** **Comissões - Balcão** (seção, 97% — termo(s) em comum: comissoe); **Comissões - Notas** (seção, 97% — termo(s) em comum: comissoe).
> * **Sem correspondência funcional na tela:** **Valor Bruto dos Emolumentos**, **Valor Líquido**.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Valor Líquido" ~ campo **Exigir valor minímo de boleto** em aba **Faturamento** (46%); "Valor Líquido" ~ campo **Valor mínimo para enquadramento no COAF** em aba **Protocolo** (46%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Valor Líquido** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Valor Bruto dos Emolumentos** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 2, substituir **Comissões** por **Comissões - Balcão** (seção). **Valor Bruto dos Emolumentos**, **Valor Líquido** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Estabelece a base de cálculo para apuração de comissões de escreventes (deduções fiscais e fundos) e parametriza regras de faturamento de mensalistas, como obrigatoriedade e sequenciamento de requisições.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Comissões e mensalistas**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Comissões e mensalistas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Comissões e mensalistas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Comissões e mensalistas** foi medida ao vivo (mesmo nome do manual) e acionada. **Coerência pós-pouso (ADR-037):** a tela alcançada contém "Comissões" (= "Comissões - Balcão", phrase).
2. Na seção **Comissões**, defina a base de incidência: selecione se o percentual incidirá sobre o **Valor Bruto dos Emolumentos** ou sobre o **Valor Líquido** (deduzidos os repasses aos fundos estaduais e tributos).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Comissões, Valor Bruto dos Emolumentos, Valor Líquido] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Selecione a **Forma de pagamento padrão** para liquidação dos extratos de comissão.
4. Na seção **Mensalistas**, marque se o sistema deve **Exigir número de requisição** no momento em que o escrevente lançar um serviço conveniado no balcão.
5. Defina se a numeração de requisição será informada manualmente pelo cliente ou controlada por **Sequência automática** interna do sistema.
6. Clique no botão **Salvar** para aplicar as regras.

* **Observação: A exigência de número de requisição impede que prepostos utilizem a conta do mensalista sem autorização formal do departamento jurídico da empresa contratante.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
