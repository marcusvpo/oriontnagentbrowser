---
id: M-3.0
titulo: 'Consulta e Impressão de Extrato de Mensalistas'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.61', 'D-3.62', 'M-2.0']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Período', 'Mês de referência', 'Fechamento']
      alvos_revelados: ['Fechamento']
      resultado: alvo_revelado
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: revelou_o_alvo
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Mensalistas > Extrato'
        elemento_real: 'Administração > Mensalistas > Mensalistas'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxxzojv1mzfrq-79] | x=474, y=254, 190x21'
      - passo: 3
        alvo_documentado: 'Fechamento'
        elemento_real: 'Fechamento fatura'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: false
        gatilho_revelador: 'button | Adicionar | x=1251, y=604, 163x24'
        evidencia: 'dom-measured | text:fechamento | x=197, y=396, 164x40'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 3 coluna(s) visível(is) (Arquivo, Tipo, Tamanho) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obrigatórios.)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.61 — Cadastrar Mensalista; D-3.62 — Gerar Fatura de Mensalista; M-2.0 — Criar um Novo Cadastro de Mensalista.

#### Descrição:
Permite pesquisar, detalhar e imprimir todos os serviços e atos notariais prestados a determinado mensalista, possibilitando conciliação prévia por período, mês de referência ou dia de corte.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.61 (Cadastrar Mensalista) para criar o registro necessário.
2. Executar antes a rotina D-3.62 (Gerar Fatura de Mensalista) para criar o registro necessário.
3. Executar antes a rotina M-2.0 (Criar um Novo Cadastro de Mensalista) para criar o registro necessário.
4. Reexecutar a auditoria da rotina M-3.0.

* **Rotinas pré-requisito (executar antes):** **D-3.61**, **D-3.62**, **M-2.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Mensalistas > Extrato**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Mensalistas** · (3) **Mensalistas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Mensalistas > Extrato"**, porém na versão atual do Orion TN a tela fica em **"Administração > Mensalistas > Mensalistas"** (confiança: 88% — Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): "Administração > Mensalistas > Mensalistas" — folha "Mensalistas": radicais [mensalista] no texto (cobertura 100%), Dice com o título 0.4, ancestrais 100%, bônus de módulo 1; margem 0.88 sobre "—" (candidato a confirmar na árvore lida ao vivo)). O texto do manual não foi alterado.
   > [!NOTE] **Coerência pós-pouso (ADR-037):** a tela alcançada contém "Pesquisar por mensalista".
2. No campo **Pesquisar por mensalista**, selecione o cliente desejado.
   [aqui vai a print "passo-02.png"]
3. Defina os critérios de busca: preencha o **Período** (data inicial e final), ou informe o **Mês de referência**, ou selecione a data em **Fechamento**.
   [aqui vai a print "passo-03.png"]
   [aqui vai a print "passo-03-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Adicionar** · (2) **Fechamento**
   > [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"Fechamento"** não estava visível na tela inicial do passo; passou a ser exibido após acionar o(a) botão **"Adicionar"**, medido ao vivo na tela. O gatilho está demarcado em "passo-03.png" e o elemento revelado, na sub-captura seguinte. O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Período", "Mês de referência"
4. Clique no botão **Filtrar** para processar e exibir a listagem detalhada de todos os atos praticados.
5. Clique no botão **Imprimir** para emitir o relatório analítico impresso ou exportar para conferência do cliente.
6. Ao concluir a verificação, clique em **Voltar** para retornar ao menu principal.

* **Observação: O extrato lista discriminadamente número de pedido, tipo de ato, selos utilizados, valores de emolumentos e eventuais descontos concedidos.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
