---
id: V-CCA.2.1
titulo: 'Consulta Avançada, Filtros e Relatórios de Cartões de Assinatura'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.3', 'M-9.0', 'V-CCA.3.3']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['\']
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
      - passo: 2
        alvo_documentado: '\'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentado e não concluiu: "Concluir" permaneceu desabilitado após o preenchimento.. Outra rotina do sistema gera esses registros: D-3.3 — Cadastrar Cartão de Assinatura; M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais); V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
A tela de consulta de cartões de assinatura disponibiliza mecanismos rápidos e flexíveis de localização de registros notariais cadastrados na serventia. Os filtros comportam-se de forma inteligente e adaptativa, liberando a pesquisa a partir do preenchimento de um critério principal (como Nome ou CPF) e oferecendo busca fonética e recursos de ordenação e exportação de relatórios.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
2. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina V-CCA.2.1.

* **Rotinas pré-requisito (executar antes):** **D-3.3**, **M-9.0**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Na barra de pesquisa superior, observe que o botão **Filtrar** só é habilitado após o preenchimento de pelo menos um dos critérios obrigatórios (marcados com asterisco **\***).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"\"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "\"
3. Para pesquisar por **Nome**:
   * Comece a digitar as primeiras letras do nome do titular no campo **Nome**.
   * O sistema apresentará automaticamente sugestões em tempo real com os nomes correspondentes no banco de dados.
   * Você pode clicar diretamente em uma das sugestões listadas ou pressionar a tecla **Enter** para executar o filtro.
   * Marque a opção **Busca Fonética** para localizar nomes com grafias parecidas ou variações com e sem acentuação (ex.: Souza / Sousa, Luiz / Luís).
   * Marque a opção **Contém** para localizar registros onde o termo digitado esteja em qualquer parte do nome (início, meio ou fim).
4. Para pesquisar por **Documento**:
   * No campo de tipo de documento, selecione a opção **CPF** (ou outro documento).
   * Digite o número do CPF no campo correspondente; observe que o sistema remove a obrigatoriedade dos demais campos e habilita imediatamente o botão **Filtrar**.
   * Pressione **Enter** ou clique no botão **Filtrar**.
5. Para pesquisar por **Período de Cadastro**:
   * Informe a data inicial e a data final no filtro de período e clique em **Filtrar**.
6. Manipulando a **Tabela de Resultados**:
   * Ordene os dados em ordem crescente ou decrescente clicando nas setas localizadas no cabeçalho das colunas (por exemplo, clique no cabeçalho da coluna **Número do Cartão** ou **Data de Cadastro** para inverter a ordenação).
7. Para gerar o **Relatório em PDF**:
   * Com os resultados filtrados na tabela, clique no botão **Imprimir**.
   * O sistema exibirá a janela com os modelos de relatório configurados conforme o padrão do cartório.
   * Selecione o modelo e gere o arquivo em formato **PDF** para visualização, salvamento ou impressão física.

* **Observação: Quanto mais critérios e caracteres forem informados na pesquisa, mais rápido e refinado será o retorno dos dados da base notarial.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
