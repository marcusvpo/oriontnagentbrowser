---
id: M-9.3
titulo: 'Gerenciar Consumo de Papel de Segurança e Selo Digital no Cartão de Assinatura'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.3', 'M-9.0', 'V-CCA.3.3']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['NFS (Papel de Segurança)']
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
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Cadastro > Cartão de assinatura'
        elemento_real: 'Firmas > Cadastros > Cartão de assinatura'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwiqhl815ujdx-13] | x=572, y=108, 413x26'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela, mas a rotina não consulta registros e o seed não foi necessário. Outra rotina do sistema gera esses registros: D-3.3 — Cadastrar Cartão de Assinatura; M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais); V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
Controla a baixa de insumos físicos (Papel de Segurança - NFS) e a geração do respectivo Selo Digital no momento da abertura ou renovação do cartão de assinatura, assegurando rastreabilidade contábil e de estoque.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
2. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina M-9.3.

* **Rotinas pré-requisito (executar antes):** **D-3.3**, **M-9.0**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Durante a abertura ou edição do cartão em **Firmas > Cadastro > Cartão de assinatura**, acesse a aba **Consumo de Papel / Selo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Cadastro > Cartão de assinatura"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Cadastros > Cartão de assinatura"** (confiança: 88% — Item "Cartão de assinatura" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. No campo **NFS (Papel de Segurança)**, selecione a série e informe o número do formulário físico utilizado na impressão da ficha de firma.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [NFS (Papel de Segurança)] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. Se o sistema estiver parametrizado para controle automático de estoque, o número sequencial do lote do escrevente será sugerido automaticamente.
4. Caso ocorra rasura física durante a coleta da assinatura:
   * Clique em **Inutilizar Papel**: insira o motivo do descarte (ex: 'erro de impressão/rasura'); o sistema dará baixa de descarte no estoque e liberará o próximo número.
   * Se o número tiver sido digitado incorretamente sem uso real, clique em **Reutilizar/Estornar** para devolvê-lo ao estoque disponível.
5. Clique no botão **Salvar** para gerar o selo digital de abertura e consolidar o consumo.

* **Importante: Folhas de papel de segurança inutilizadas ficam registradas no livro de estoque para prestação de contas com a Corregedoria.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
