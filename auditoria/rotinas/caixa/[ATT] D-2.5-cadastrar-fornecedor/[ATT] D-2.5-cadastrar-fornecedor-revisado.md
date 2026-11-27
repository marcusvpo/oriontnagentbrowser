---
id: D-2.5
titulo: 'Cadastrar Fornecedor'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Inscrição Estadual']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 1
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Fornecedor'
        elemento_real: 'Configurações > Négocios > Cadastros > Fornecedores'
        camada: menu_path_resolution
        confianca: 0.8
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy295n99uriyu-12] | x=880, y=88, 126x21'
      - passo: 3
        alvo_documentado: 'Inscrição Estadual'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T21:26:25.827Z'
    rota: '#/fornecedor/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de fornecedor', 'Dados cadastrais']
    abas: []
    campos:
      - rotulo: 'Jurídica'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Física'
        tipo: 'radio'
        secao: 'Dados cadastrais'
      - rotulo: 'Razão social'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'CNPJ'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Nome fantasia'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Representante'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Dados cadastrais'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Dados cadastrais'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Dados cadastrais'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Razão Social', 'Nome Fantasia', 'CNPJ', 'Inscrição Estadual']
    correspondencias_sugeridas:
      - alvo: 'Razão Social'
        elemento_real: 'Razão social'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 1
      - alvo: 'Nome Fantasia'
        elemento_real: 'Nome fantasia'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 1
      - alvo: 'CNPJ'
        elemento_real: 'CNPJ'
        tipo: 'campo'
        secao: 'Dados cadastrais'
        similaridade: 1
    alvos_sem_correspondencia: ['Inscrição Estadual']
    sugestao_reescrita: 'Sugestão de reescrita: Razão social, Nome fantasia, CNPJ existem na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparecem. Inscrição Estadual não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Inscrição Estadual", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (1 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/fornecedor/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de fornecedor**, **Dados cadastrais**.
> * **Campos:** **Jurídica** (Dados cadastrais), **Física** (Dados cadastrais), **Razão social** (Dados cadastrais), **CNPJ** (Dados cadastrais), **Nome fantasia** (Dados cadastrais), **Representante** (Dados cadastrais), **CEP** (Dados cadastrais), **Logradouro** (Dados cadastrais), **Número** (Dados cadastrais), **Complemento** (Dados cadastrais), **Bairro** (Dados cadastrais), **UF** (Dados cadastrais), **Cidade** (Dados cadastrais), **Telefone** (Dados cadastrais), **E-mail** (Dados cadastrais).
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Razão Social":** **Razão social** (campo, 100% — termo(s) em comum: razao, social; na seção "Dados cadastrais").
> * **Correspondência sugerida para "Nome Fantasia":** **Nome fantasia** (campo, 100% — termo(s) em comum: nome, fantasia; na seção "Dados cadastrais").
> * **Correspondência sugerida para "CNPJ":** **CNPJ** (campo, 100% — termo(s) em comum: cnpj; na seção "Dados cadastrais").
> * **Sem correspondência funcional na tela:** **Inscrição Estadual**.
> * Sugestão de reescrita: **Razão social**, **Nome fantasia**, **CNPJ** existem na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparecem. **Inscrição Estadual** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar as empresas gráficas homologadas, fabricantes e órgãos emissores de insumos notariais (ex: Casa da Moeda, ARPEN, Colégio Notarial ou TJ). O fornecedor cadastrado é obrigatoriamente vinculado às notas de aquisição de estoque.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Cadastros Auxiliares > Fornecedor**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Négocios** · (3) **Cadastros** · (4) **Fornecedores**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Fornecedor"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Négocios > Cadastros > Fornecedores"** (confiança: 80% — Item "Fornecedores" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Preencha a **Razão Social**, **Nome Fantasia**, **CNPJ** e **Inscrição Estadual**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Razão Social** · (2) **Nome Fantasia** · (3) **CNPJ**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Inscrição Estadual"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Inscrição Estadual"
4. Informe os dados de contato (**Telefone**, **E-mail** e **Endereço Completo**).
5. Clique em **Salvar** para registrar o fornecedor.

* **Importante: A correta identificação do fornecedor garante a rastreabilidade do lote de papéis e selos em caso de fiscalização da Corregedoria.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
