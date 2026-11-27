---
id: D-2.8
titulo: 'Cadastrar Tipo de Documento'
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
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Nome do Documento']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Tipo de Documento'
        elemento_real: 'Configurações > Négocios > Cadastros > Tipo de documento'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy2hllb8rh0j8-15] | x=880, y=150, 126x21'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T21:33:10.532Z'
    rota: '#/tipoDocumento/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de tipo de documento']
    abas: []
    campos:
      - rotulo: 'Sigla do tipo de documento'
        tipo: 'text'
      - rotulo: 'Descrição do tipo de documento'
        tipo: 'text'
      - rotulo: 'Observações'
        tipo: 'textarea'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Nome do Documento']
    correspondencias_sugeridas:
      - alvo: 'Nome do Documento'
        elemento_real: 'Sigla do tipo de documento'
        tipo: 'campo'
        similaridade: 0.67
      - alvo: 'Nome do Documento'
        elemento_real: 'Descrição do tipo de documento'
        tipo: 'campo'
        similaridade: 0.61
      - alvo: 'Nome do Documento'
        elemento_real: 'Cadastro de tipo de documento'
        tipo: 'seção'
        similaridade: 0.46
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Nome do Documento por Sigla do tipo de documento (campo).'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome do Documento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Négocios > Cadastros > Tipo de documento (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/tipoDocumento/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de tipo de documento**.
> * **Campos:** **Sigla do tipo de documento**, **Descrição do tipo de documento**, **Observações**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Nome do Documento":** **Sigla do tipo de documento** (campo, 67% — termo(s) em comum: documento); **Descrição do tipo de documento** (campo, 61% — termo(s) em comum: documento); **Cadastro de tipo de documento** (seção, 46% — termo(s) em comum: documento).
> * Sugestão de reescrita: no passo 3, substituir **Nome do Documento** por **Sigla do tipo de documento** (campo). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Permite cadastrar os formatos de identificação pessoal e empresarial aceitos no sistema (CPF, CNPJ, RG, CNH, RNE, OAB, Passaporte). Estabelece a sigla oficial e parâmetros de validação para consistência cadastral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Tipo de Documento**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Négocios** · (3) **Cadastros** · (4) **Tipo de documento**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Tipo de Documento"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Négocios > Cadastros > Tipo de documento"** (confiança: 88% — Item "Tipo de documento" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Preencha o **Nome do Documento** (ex: Passaporte Estrangeiro ou Carteira da OAB).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Nome do Documento] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Informe a **Sigla** oficial do documento.
5. Se aplicável, configure a **Máscara de Formatação** e se exige órgão expedidor.
6. Clique em **Salvar** para registrar.

* **Observação: Essa tabela auxilia na validação uniforme de documentos em cadastros de fornecedores e agentes autorizados.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
