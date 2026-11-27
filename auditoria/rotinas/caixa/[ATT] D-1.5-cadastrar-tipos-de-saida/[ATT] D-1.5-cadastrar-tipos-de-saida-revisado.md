---
id: D-1.5
titulo: 'Cadastrar Tipos de Saída'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 6
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 6
      alvos_ausentes: ['Conclusão']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Tipos de Saída'
        elemento_real: 'Configurações > Geral > Cadastros auxiliares > Tipos de saída'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0ruji2o2ih-32] | x=752, y=109, 144x21'
      - passo: 4
        alvo_documentado: 'Vincular ao Livro Caixa'
        elemento_real: 'Livro caixa'
        camada: a11y_fuzzy_match
        confianca: 0.82
        texto_alterado: false
        evidencia: 'dom-measured | text:livro caixa | x=785, y=117, 82x16'
      - passo: 5
        alvo_documentado: 'Conta de Despesa'
        elemento_real: 'Despesa'
        camada: a11y_fuzzy_match
        confianca: 0.77
        texto_alterado: false
        evidencia: 'dom-measured | text:despesa | x=20, y=134, 223x40'
  diagnostico_tela_att:
    passo: 6
    capturado_em: '2026-11-26T20:46:49.108Z'
    rota: '#/tipo-saida/cadastrar'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Cadastro de tipo de saída']
    abas: []
    campos:
      - rotulo: 'Tipo de saída'
        tipo: 'text'
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Livro caixa'
        tipo: 'checkbox'
      - rotulo: 'Despesa'
        tipo: 'select'
      - rotulo: 'Contas'
        tipo: 'select'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Conclusão']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Conclusão']
    sugestao_reescrita: 'Sugestão de reescrita: Conclusão não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-06.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 6, o manual cita "Conclusão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 6: rota **#/tipo-saida/cadastrar**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de tipo de saída**.
> * **Campos:** **Tipo de saída**, **Descrição**, **Livro caixa**, **Despesa**, **Contas**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Sem correspondência funcional na tela:** **Conclusão**.
> * Sugestão de reescrita: **Conclusão** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-06.png (tela exata no momento do bloqueio).

#### Descrição:
Os tipos de saída categorizam qualquer retirada física ou digital de numerário da gaveta de caixa, tais como sangrias de segurança, pagamento de despesas miúdas ou devoluções de troco/depósito prévio. Podem ser vinculados a contas do Livro Caixa para escrituração automática.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 6 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Cadastros Auxiliares > Tipos de Saída**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Geral** · (3) **Cadastros auxiliares** · (4) **Tipos de saída**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Tipos de Saída"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Geral > Cadastros auxiliares > Tipos de saída"** (confiança: 95% — Item "Tipos de saída" localizado na árvore de navegação em outra rota (2 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Preencha o campo **Tipo de Saída** com a descrição operacional (ex: Devolução ao Apresentante ou Despesas com Correios).
   [aqui vai a print "passo-03.png"]
4. Caso deseje escrituração automática, marque a opção **Vincular ao Livro Caixa**.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Vincular ao Livro Caixa"**, porém na tela atual do Orion TN o elemento se chama **"Livro caixa"** (confiança: 82% — Similaridade semântica na árvore de acessibilidade (83%)). O texto do manual não foi alterado.
5. Selecione a **Conta Financeira** e a **Conta de Despesa** correspondentes no plano de contas.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Conta de Despesa"**, porém na tela atual do Orion TN o elemento se chama **"Despesa"** (confiança: 77% — Rótulo visível na tela equivalente por inclusão de nome (77%)). O texto do manual não foi alterado.
6. Clique em **Conclusão** para finalizar o cadastro.
   [aqui vai a print "passo-06.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Conclusão] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar

* **Observação: As retiradas efetuadas com tipos de saída vinculados ao Livro Caixa geram os lançamentos contábeis correspondentes em tempo real.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
