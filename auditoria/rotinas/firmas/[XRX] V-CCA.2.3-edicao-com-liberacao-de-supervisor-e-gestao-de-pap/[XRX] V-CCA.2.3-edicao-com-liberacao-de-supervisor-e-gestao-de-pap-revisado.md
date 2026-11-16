---
id: V-CCA.2.3
titulo: 'Edição com Liberação de Supervisor e Gestão de Papel de Segurança (Consumo, Estorno e Inutilização)'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['V-CCA.3.3', 'D-3.3', 'M-9.0']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['Supervisor']
    origem_requisito: 'passo 2'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: '4tabeliao.scs'
    sessao_cargo: 'TABELIAO'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webGed', 'Perfil de acesso - Gerência webLivros', 'Perfil de acesso - Gerência webPro', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Editar Campos Sensíveis Bloqueados (Nome / Documentos)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentado e não concluiu: "Concluir" permaneceu desabilitado após o preenchimento.. Outra rotina do sistema gera esses registros: V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas; D-3.3 — Cadastrar Cartão de Assinatura; M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais).

#### Descrição:
Quando um cartão de assinatura já possui atos notariais ou reconhecimentos de firma vinculados em seu histórico, os campos sensíveis de identificação (como Nome e Documentos) são bloqueados pelo sistema para segurança jurídica, exigindo liberação por senha de supervisor. Além disso, esta rotina abrange todo o ciclo de vida do papel/formulário de segurança no cartão: consumo, controle de status (Reservado/Consumido), estorno para o estoque e inutilização definitiva.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
2. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
3. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
4. Reexecutar a auditoria da rotina V-CCA.2.3.

* **Rotinas pré-requisito (executar antes):** **V-CCA.3.3**, **D-3.3**, **M-9.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Firmas > Cadastros > Cartão de Assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Para **Editar Campos Sensíveis Bloqueados (Nome / Documentos)**:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Editar Campos Sensíveis Bloqueados (Nome / Documentos), Editar, Login, Senha] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
   * Caso o cadastro já possua atos praticados, campos como Nome e CPF estarão desabilitados para edição direta.
   * Localize e clique no botão **Editar** posicionado ao lado do campo restrito.
   * O sistema solicitará autenticação administrativa; insira o **Login** e **Senha** de um usuário com perfil de **Supervisor** e confirme.
   * O campo será liberado para que o escrevente realize a devida retificação cadastral.
3. Para **Consumir o Papel de Segurança (Formulário)**:
   * Na seção de controle de papel/formulário de segurança da tela de edição do cartão, clique no botão **Consumir**.
   * O sistema abrirá a lista de papéis de segurança disponíveis no estoque da serventia.
   * Selecione o formulário desejado (o sistema permite selecionar qualquer folha disponível no estoque, inclusive fora da ordem sequencial estrita).
   * Clique no botão **Concluir**.
   * Observe que o sistema atribuirá inicialmente o status de **Reservado** ao papel selecionado.
   * Ao clicar em **Concluir** no formulário principal do cartão de assinatura para salvar as alterações, o status do papel de segurança mudará automaticamente para **Consumido**, efetivando a vinculação legal da folha à ficha.
4. Para **Estornar o Papel de Segurança de Volta ao Estoque (Reutilizar)**:
   * Se o papel consumido ou reservado não for mais utilizado nesta ficha e estiver em perfeitas condições de reaproveitamento, clique no ícone de seta **Reutilizar**.
   * O sistema desvinculará o número do formulário da ficha e devolverá o papel para o **Estoque**, tornando-o novamente disponível para uso em qualquer outro cartão.
5. Para **Inutilizar Definitivamente o Papel de Segurança**:
   * Se a folha de segurança física foi danificada, rasurada ou extraviada:
   * Clique no ícone **X** (**Inutilizar**).
   * O sistema cancelará e inutilizará o formulário de segurança no banco de dados, impedindo permanentemente que essa numeração de papel seja reutilizada em qualquer ficha ou ato da serventia.
6. Clique no botão **Concluir** para salvar a edição do cartão de assinatura.

* **Observação: Todas as movimentações de consumo, devolução e inutilização de formulários de segurança são registradas automaticamente nos relatórios de controle de estoque do Orion TN para prestação de contas à Corregedoria.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
