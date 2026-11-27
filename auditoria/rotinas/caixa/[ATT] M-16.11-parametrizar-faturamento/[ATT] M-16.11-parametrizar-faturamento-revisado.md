---
id: M-16.11
titulo: 'Parametrizar Faturamento'
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
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Código do Cedente/Convênio', 'Agência', 'Conta Corrente', 'Carteira', 'Modalidade de Cobrança']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 1
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Sequência'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Inteligência Artificial'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Pedido de firmas'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Faturamento'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxwzg9y76e8l-130] | x=850, y=171, 175x20'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T19:02:16.009Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Faturamento']
    abas: []
    campos:
      - rotulo: 'Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des'
        tipo: 'checkbox'
      - rotulo: 'O extrato será enviado juntamente com o boleto bancário'
        tipo: 'checkbox'
      - rotulo: 'Ativar faturamento automático'
        tipo: 'checkbox'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Código do Cedente/Convênio', 'Agência', 'Conta Corrente', 'Carteira', 'Modalidade de Cobrança']
    correspondencias_sugeridas:
      - alvo: 'Modalidade de Cobrança'
        elemento_real: 'Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des'
        tipo: 'campo'
        similaridade: 0.48
    alvos_sem_correspondencia: ['Código do Cedente/Convênio', 'Agência', 'Conta Corrente', 'Carteira']
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
        - alvo: 'Código do Cedente/Convênio'
          tipo: 'field'
          rotulo: 'Código cedente'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 0.68
        - alvo: 'Código do Cedente/Convênio'
          tipo: 'field'
          rotulo: 'Código cedente sem dígito'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 0.61
        - alvo: 'Agência'
          tipo: 'field'
          rotulo: 'Nº agência'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 0.92
        - alvo: 'Conta Corrente'
          tipo: 'field'
          rotulo: 'Token de segurança da conta (Cliente Token)'
          onde: 'tab:WhatsApp'
          em_subestado_nao_visitado: true
          similaridade: 0.46
        - alvo: 'Conta Corrente'
          tipo: 'field'
          rotulo: 'ID da conta do WhatsApp Business (Business Account ID)'
          onde: 'tab:WhatsApp'
          em_subestado_nao_visitado: true
          similaridade: 0.46
        - alvo: 'Carteira'
          tipo: 'field'
          rotulo: 'Carteira'
          onde: 'tab:Faturamento'
          em_subestado_nao_visitado: true
          similaridade: 1
      alvos_em_subestados: ['Código do Cedente/Convênio', 'Agência', 'Conta Corrente', 'Carteira']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Modalidade de Cobrança por Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des (campo). Código do Cedente/Convênio, Agência, Conta Corrente, Carteira não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Código do Cedente/Convênio", "Agência", "Conta Corrente", "Carteira", "Modalidade de Cobrança", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Sequência", aba "Inteligência Artificial", aba "Pedido de firmas", aba "Captura e digitalização", aba "Painel de atalhos", aba "Parâmetros por estação"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Faturamento**.
> * **Campos:** **Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des**, **O extrato será enviado juntamente com o boleto bancário**, **Ativar faturamento automático**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Modalidade de Cobrança":** **Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des** (campo, 48% — termo(s) em comum: cobranca).
> * **Sem correspondência funcional na tela:** **Código do Cedente/Convênio**, **Agência**, **Conta Corrente**, **Carteira**.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações** | pistas para alvos ausentes no recorte atual: "Código do Cedente/Convênio" ~ campo **Código cedente** em aba **Faturamento** (68%); "Código do Cedente/Convênio" ~ campo **Código cedente sem dígito** em aba **Faturamento** (61%); "Agência" ~ campo **Nº agência** em aba **Faturamento** (92%); "Conta Corrente" ~ campo **Token de segurança da conta (Cliente Token)** em aba **WhatsApp** (46%); "Conta Corrente" ~ campo **ID da conta do WhatsApp Business (Business Account ID)** em aba **WhatsApp** (46%); "Carteira" ~ campo **Carteira** em aba **Faturamento** (100%).
> * **Alvos em sub-estados não visitados (Catálogo Nível 2):** **Código do Cedente/Convênio**, **Agência**, **Conta Corrente**, **Carteira** (existem na tela sob aba/accordion/modal específico; o passo deve explicitar a abertura).
> * Sugestão de reescrita: no passo 3, substituir **Modalidade de Cobrança** por **Utilizar cobrança por boleto bancárioUtilizar cobrança por boleto bancário Marque caso des** (campo). **Código do Cedente/Convênio**, **Agência**, **Conta Corrente**, **Carteira** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Configura as regras de cobrança bancária do cartório, habilitando a geração de boletos registrados para faturamento de mensalistas e parametrizando o envio unificado de boleto e extrato de atos por correio eletrônico.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Faturamento**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Faturamento**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Faturamento"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Faturamento** foi medida ao vivo (mesmo nome do manual) e acionada. **Coerência pós-pouso (ADR-037):** a tela alcançada contém "Utilizar cobrança por boleto bancário", "Agência" (= "Nº agência", route_synonym), "Conta Corrente" (= "Conta corrente", exact), "Carteira".
2. Marque a opção **Utilizar cobrança por boleto bancário**.
   [aqui vai a print "passo-02.png"]
3. Selecione o banco conveniado e preencha os dados contratuais: **Código do Cedente/Convênio**, **Agência**, **Conta Corrente**, **Carteira** e **Modalidade de Cobrança**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Código do Cedente/Convênio, Agência, Conta Corrente, Carteira, Modalidade de Cobrança] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
4. Configure as instruções financeiras padrão: percentual de **Multa por atraso**, taxa diária de **Juros de mora** e prazo padrão para protesto/negativação.
5. Marque a opção **O extrato será enviado juntamente com o boleto bancário** para que o cliente receba o arquivo analítico de conciliação no mesmo e-mail do boleto.
6. Clique no botão **Salvar** para confirmar as diretrizes de faturamento.

* **Importante: A emissão de boletos registrados exige homologação prévia do layout e remessa de testes junto à agência bancária de relacionamento da serventia.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
