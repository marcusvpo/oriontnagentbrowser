---
id: V-CCA.2.1
titulo: 'Consulta Avançada, Filtros e Relatórios de Cartões de Assinatura'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: validado_com_ajustes
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  prints_geradas: 9
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentad'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'validado_com_ajustes'
      tags_atuais: []
      bloqueio_superado: true
      bloqueio_anterior:
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" n'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

#### Descrição:
A tela de consulta de cartões de assinatura disponibiliza mecanismos rápidos e flexíveis de localização de registros notariais cadastrados na serventia. Os filtros comportam-se de forma inteligente e adaptativa, liberando a pesquisa a partir do preenchimento de um critério principal (como Nome ou CPF) e oferecendo busca fonética e recursos de ordenação e exportação de relatórios.

#### Passo a passo revisado:
1. Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!TIP] **Ajuda da tela — "Fonética":** "Ao usar esta opção, os resultados da busca trará os dados com e sem caracteres especiais"
2. Na barra de pesquisa superior, observe que o botão **Filtrar** só é habilitado após o preenchimento de pelo menos um dos critérios obrigatórios (marcados com asterisco **\***).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
3. Para pesquisar por **Nome**:
   [aqui vai a print "passo-03.png"]
   [aqui vai a print "passo-03-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Nome** · (2) **Selecionar nome (+)**
   > [!NOTE] Fluxo executado ao vivo (Máquina de Estado Universal + DOM Diffing): pesquisa com **"teste" + Enter** -> inclusão do registro na grade (**+**) -> confirmação em **Finalizar** liberando o próximo painel.
   * Comece a digitar as primeiras letras do nome do titular no campo **Nome**.
   * O sistema apresentará automaticamente sugestões em tempo real com os nomes correspondentes no banco de dados.
   * Você pode clicar diretamente em uma das sugestões listadas ou pressionar a tecla **Enter** para executar o filtro.
   * Marque a opção **Busca Fonética** para localizar nomes com grafias parecidas ou variações com e sem acentuação (ex.: Souza / Sousa, Luiz / Luís).
   * Marque a opção **Contém** para localizar registros onde o termo digitado esteja em qualquer parte do nome (início, meio ou fim).
4. Para pesquisar por **Documento**:
   [aqui vai a print "passo-04.png"]
   * No campo de tipo de documento, selecione a opção **CPF** (ou outro documento).
   * Digite o número do CPF no campo correspondente; observe que o sistema remove a obrigatoriedade dos demais campos e habilita imediatamente o botão **Filtrar**.
   * Pressione **Enter** ou clique no botão **Filtrar**.
5. Para pesquisar por **Período de Cadastro**:
   [aqui vai a print "passo-05.png"]
   * Informe a data inicial e a data final no filtro de período e clique em **Filtrar**.
6. Manipulando a **Tabela de Resultados**:
   [aqui vai a print "passo-06.png"]
   [aqui vai a print "passo-06-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Tabela de Resultados** · (2) **Selecionar nome (+)**
   > [!NOTE] Fluxo executado ao vivo (Máquina de Estado Universal + DOM Diffing): pesquisa com **"teste" + Enter** -> inclusão do registro na grade (**+**) -> confirmação em **Finalizar** liberando o próximo painel.
   * Ordene os dados em ordem crescente ou decrescente clicando nas setas localizadas no cabeçalho das colunas (por exemplo, clique no cabeçalho da coluna **Número do Cartão** ou **Data de Cadastro** para inverter a ordenação).
7. Para gerar o **Relatório em PDF**:
   [aqui vai a print "passo-07.png"]
   * Com os resultados filtrados na tabela, clique no botão **Imprimir**.
   * O sistema exibirá a janela com os modelos de relatório configurados conforme o padrão do cartório.
   * Selecione o modelo e gere o arquivo em formato **PDF** para visualização, salvamento ou impressão física.

* **Observação: Quanto mais critérios e caracteres forem informados na pesquisa, mais rápido e refinado será o retorno dos dados da base notarial.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → (sem tag) validado_com_ajustes
* **Bloqueio anterior:** passo não registrado — Dependência Cruzada de Rotina: No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" n → **superado**
