---
id: D-3.13
titulo: 'Fazer Orçamento Completo'
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
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Orçamento > Orçamento Completo'
        elemento_real: 'Notas > Orçamentos'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxzjcrd6g07au-20] | x=503, y=88, 183x20'
      - passo: 1
        alvo_documentado: 'Orçamento Completo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 1
        alvo_documentado: 'Novo Orçamento'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T20:09:20.114Z'
    rota: '#/orcamento/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de orçamento']
    abas: []
    campos:
      - rotulo: 'Espécie'
        tipo: 'select'
      - rotulo: 'Natureza'
        tipo: 'select'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'CPF ou CIN/CNPJ'
        tipo: 'text'
      - rotulo: 'Solicitante'
        tipo: 'text'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Observações'
        tipo: 'textarea'
      - rotulo: 'Tipo de endereço'
        tipo: 'select'
      - rotulo: 'CEP'
        tipo: 'text'
      - rotulo: 'Logradouro'
        tipo: 'text'
      - rotulo: 'Número'
        tipo: 'text'
      - rotulo: 'Complemento'
        tipo: 'text'
      - rotulo: 'Bairro'
        tipo: 'text'
      - rotulo: 'UF'
        tipo: 'select'
      - rotulo: 'Cidade'
        tipo: 'text'
      - rotulo: 'Vigência'
        tipo: 'select'
      - rotulo: 'Item'
        tipo: 'text'
      - rotulo: 'inputNomeOutrosServicos04703'
        tipo: 'text'
      - rotulo: 'quantidadeOutrosServicos04703'
        tipo: 'text'
      - rotulo: 'inputValorOutrosServicos04703'
        tipo: 'text'
    botoes: ['Buscar', 'Abrir modal tipo endereço', 'Informações', 'Concluir', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '015'
      menu: 'Notas > Orçamento completo'
      rota: '#/orcamento/cadastrar'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Cadastro de orçamento']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Qtd. Cálculo', 'Cálculo', 'Valor venal', 'Valor do instrumento', 'Base de cálculo', 'Total', 'UF', 'Cidade', 'ITBI', 'Total ITBI', 'Reg. imóveis', 'Item', 'Descrição', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Notas > Orçamentos** foi aberto (rota #/orcamento/cadastrar), mas a tela não tem a aba/seção "Orçamento Completo" citada pelo manual. Abas e seções lidas ao vivo na tela: (nenhuma aba ou seção lida). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/orcamento/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de orçamento**.
> * **Campos:** **Espécie**, **Natureza**, **Escrevente**, **CPF ou CIN/CNPJ**, **Solicitante**, **Telefone**, **E-mail**, **Observações**, **Tipo de endereço**, **CEP**, **Logradouro**, **Número**, **Complemento**, **Bairro**, **UF**, **Cidade**, **Vigência**, **Item**, **inputNomeOutrosServicos04703**, **quantidadeOutrosServicos04703**, **inputValorOutrosServicos04703**.
> * **Botões:** **Buscar**, **Abrir modal tipo endereço**, **Informações**, **Concluir** (desabilitado), **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`015`, consultivo):** tela **Notas > Orçamento completo** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Qtd. Cálculo**, **Cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O Orçamento Completo é destinado a negócios imobiliários e atos solenes com múltiplos bens ou partes. Permite calcular emolumentos notariais, estimar o imposto de transmissão (ITBI/ITCMD), prever taxas de registro imobiliário e listar todas as certidões de praxe.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Notas > Orçamento > Orçamento Completo** e clique em **Novo Orçamento**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Orçamentos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Orçamento > Orçamento Completo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Orçamentos"** (confiança: 88% — Equivalência de folha: "Orçamento" ≡ "Orçamentos" (mesma chave de folha sob "Notas"); "Notas > Orçamentos" é folha sem filhos e "Orçamento Completo" é seção/aba da tela). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Orçamento Completo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Novo Orçamento"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Item, Descrição, Qtd. Adicional, Qtd. Cálculo, Cálculo, Valor venal).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Orçamento Completo", "Novo Orçamento"
2. Informe o **Nome do Apresentante/Cliente** e selecione a **Natureza do Negócio Jurídico**.
3. Adicione os bens e direitos envolvidos, indicando a base de cálculo de cada um.
4. Na aba de despesas acessórias, marque o cálculo automático de **ITBI**, **Custas de Registro de Imóveis (RI)** e certidões necessárias.
5. Clique em **Salvar Orçamento** para gerar o documento formal.
6. Quando o cliente aprovar, utilize o botão **Converter em Protocolo** para reaproveitar todos os dados sem redigitação.

* **Importante: A integração do cálculo de RI requer a prévia habilitação nas parametrizações gerais de protocolo.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
