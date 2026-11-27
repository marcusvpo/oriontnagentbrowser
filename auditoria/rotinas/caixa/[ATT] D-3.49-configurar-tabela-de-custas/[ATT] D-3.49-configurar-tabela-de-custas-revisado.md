---
id: D-3.49
titulo: 'Configurar Tabela de Custas'
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
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Parametrizações > Tabela de Custas'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxyv8cl6h8f38-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Tabela de Custas'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T19:51:31.780Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
    abas: []
    campos:
      - rotulo: 'Tipo'
        tipo: 'select'
      - rotulo: 'Qtd. na busca'
        tipo: 'text'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Ativar rotina de bloqueio automático de cartões de assinatura'
        tipo: 'checkbox'
      - rotulo: 'Horário de execução'
        tipo: 'time'
      - rotulo: 'Para menos'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Para mais'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Truncado'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Contábil'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Diário'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Semanal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Mensal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Zera anualmente'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
      - rotulo: 'Otimizar consultas e telas Atenção! Necessário fazer um novo login'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '110'
      menu: 'Configurações > Parametrizações'
      rota: '#/configuracoes'
      nivel: 2
      estado_nivel2: 'explored'
      abas: ['Geral', 'Captura e digitalização', 'Parâmetros por estação', 'Sequência', 'Comunicações', 'Campos obrigatórios', 'Painel de atalhos', 'Pedido de firmas', 'Comissões e mensalistas', 'E-mail', 'Faturamento', 'Protocolo', 'Certidão', 'Editor', 'Produtos Orion', 'Inteligência Artificial', 'WhatsApp', 'Impressão']
      secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
      tabelas: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Tabela de Custas" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e digitalização", "Parâmetros por estação", "Sequência", "Comunicações", "Campos obrigatórios", "Painel de atalhos", "Pedido de firmas", "Comissões e mensalistas", "E-mail", "Faturamento", "Protocolo", "Certidão", "Editor", "Produtos Orion", "Inteligência Artificial", "WhatsApp", "Impressão", "Cartão de assinatura", "Cálculo de custas", "Controle de guia". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Cartão de assinatura**, **Cálculo de custas**, **Controle de guia**, **Geral**.
> * **Campos:** **Tipo**, **Qtd. na busca**, **Produto**, **Ativar rotina de bloqueio automático de cartões de assinatura**, **Horário de execução**, **Para menos** (Cartão de assinatura), **Para mais** (Cartão de assinatura), **Truncado** (Cartão de assinatura), **Contábil** (Cartão de assinatura), **Diário** (Cartão de assinatura), **Semanal** (Cartão de assinatura), **Mensal** (Cartão de assinatura), **Zera anualmente** (Cartão de assinatura), **Otimizar consultas e telas Atenção! Necessário fazer um novo login** (Cartão de assinatura).
> * **Botões:** **Concluir**, **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`110`, consultivo):** tela **Configurações > Parametrizações**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A parametrização da Tabela de Custas centraliza as regras de precificação e tarifação dos serviços notariais conforme os provimentos editados pela Corregedoria Geral da Justiça. Permite cadastrar atos fixos, tabelas progressivas por faixas de valores e percentuais de repasses obrigatórios.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações > Tabela de Custas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parametrizações > Tabela de Custas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — "Configurações > Parametrizações" existe na árvore real como folha sem filhos; "Tabela de Custas" é seção/aba da tela alcançada). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Tabela de Custas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Tabela de Custas"
2. Selecione o **Ano de Exercício** vigente ou clique em **Importar Nova Tabela** para carregar o arquivo do TJ.
3. Para ajustar manualmente, localize o item (ex: Escrituras com Valor Declarado) e clique em **Editar Faixas**.
4. Confira ou preencha os valores inicial e final de cada faixa e o respectivo emolumento líquido.
5. Na aba de encargos complementares, defina as alíquotas dos **Fundos Judiciais** (ex: FARPEN, FADEP) e do **ISS Municipal**.
6. Clique em **Salvar e Publicar Tabela** para ativar os novos preços no sistema.

* **Importante: A ativação da nova tabela deve coincidir rigorosamente com a data de vigência do ato normativo da Corregedoria.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
