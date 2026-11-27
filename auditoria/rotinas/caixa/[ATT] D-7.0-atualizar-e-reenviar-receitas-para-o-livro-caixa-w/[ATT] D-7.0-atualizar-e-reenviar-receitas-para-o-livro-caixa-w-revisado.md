---
id: D-7.0
titulo: 'Atualizar e Reenviar Receitas para o Livro Caixa Web (LCW) Manualmente'
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
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Livro Caixa Web (LCW)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Captura e digitalização'
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
          rotulo: 'E-mail'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Protocolo'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Comunicações'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Livro Caixa Web (LCW)'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:07:14.851Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Integração com o LivroCaixaWeb', 'Integração com pedidos eletrônicos', 'Orion Admin', 'Integração com o orion SGA']
    abas: []
    campos:
      - rotulo: 'Ativar integração'
        tipo: 'checkbox'
      - rotulo: 'Usuário'
        tipo: 'text'
      - rotulo: 'Senha'
        tipo: 'password'
      - rotulo: 'Horário'
        tipo: 'time'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'CartFlow'
        tipo: 'radio'
      - rotulo: 'E-recepção'
        tipo: 'radio'
      - rotulo: 'Ativar integração com o SGA'
        tipo: 'checkbox'
    botoes: ['Comunicar', 'Importar fornecedores', 'Testar conexão', 'Configurar natureza', 'Configurar participação', 'Configurar status', 'Sincronizar logradouro', 'Resetar conexão', 'Concluir', 'Voltar']
    alvos_do_passo: ['Produtos Orion', 'Livro Caixa Web (LCW)']
    correspondencias_sugeridas:
      - alvo: 'Produtos Orion'
        elemento_real: 'Orion Admin'
        tipo: 'seção'
        similaridade: 0.48
      - alvo: 'Produtos Orion'
        elemento_real: 'Integração com o orion SGA'
        tipo: 'seção'
        similaridade: 0.48
    alvos_sem_correspondencia: ['Livro Caixa Web (LCW)']
    contexto_catalogo_nivel1:
      id_tela: '110'
      menu: 'Configurações > Parametrizações'
      rota: '#/configuracoes'
      nivel: 2
      estado_nivel2: 'explored'
      abas: ['Geral', 'Captura e digitalização', 'Parâmetros por estação', 'Sequência', 'Comunicações', 'Campos obrigatórios', 'Painel de atalhos', 'Pedido de firmas', 'Comissões e mensalistas', 'E-mail', 'Faturamento', 'Protocolo', 'Certidão', 'Editor', 'Produtos Orion', 'Inteligência Artificial', 'WhatsApp', 'Impressão']
      secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
      tabelas: []
      alvos_ausentes_nivel2: ['Livro Caixa Web (LCW)']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Produtos Orion por Orion Admin (seção). Livro Caixa Web (LCW) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Livro Caixa Web (LCW)", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Captura e digitalização", aba "Parâmetros por estação", aba "Inteligência Artificial", aba "E-mail", aba "Protocolo", aba "Comunicações"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Fechamento de caixa; Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Integração com o LivroCaixaWeb**, **Integração com pedidos eletrônicos**, **Orion Admin**, **Integração com o orion SGA**.
> * **Campos:** **Ativar integração**, **Usuário**, **Senha**, **Horário**, **E-mail**, **CartFlow**, **E-recepção**, **Ativar integração com o SGA**.
> * **Botões:** **Comunicar**, **Importar fornecedores**, **Testar conexão**, **Configurar natureza**, **Configurar participação**, **Configurar status**, **Sincronizar logradouro**, **Resetar conexão**, **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Produtos Orion":** **Orion Admin** (seção, 48% — termo(s) em comum: orion); **Integração com o orion SGA** (seção, 48% — termo(s) em comum: orion).
> * **Sem correspondência funcional na tela:** **Livro Caixa Web (LCW)**.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Livro Caixa Web (LCW)** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 2, substituir **Produtos Orion** por **Orion Admin** (seção). **Livro Caixa Web (LCW)** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O Orion TN transmite automaticamente as receitas para o Livro Caixa Web (LCW) em horário programado. No entanto, quando ocorrem estornos, liquidações expressivas ou fechamentos de turno que precisem ser apurados de imediato pelo titular, é possível disparar a comunicação manual instantânea.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
2. No menu lateral esquerdo, localize a seção **Produtos Orion** e clique em **Livro Caixa Web (LCW)**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Livro Caixa Web (LCW)"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Livro Caixa Web (LCW)"
3. Na tela de integração, visualize a data e hora da última sincronização realizada.
4. Clique no botão **Comunicar / Enviar Receitas**.
5. O sistema processará as receitas, depósitos e emolumentos apurados até o momento e transmitirá ao servidor do LCW.
6. Ao término da mensagem de confirmação, clique em **Concluir** no rodapé da página.

* **Importante: A retransmissão manual atualiza os saldos sem duplicar lançamentos já existentes na base contábil.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
