---
id: V-CCA.2.1
titulo: Consulta Avançada, Filtros e Relatórios de Cartões de Assinatura
tags:
- firmas
- cartao de assinatura
- consulta de firmas
- busca fonetica
- relatorio em pdf
- filtros de pesquisa
objetivo: Pesquisar fichas de cartões de assinatura utilizando filtros dinâmicos, busca fonética, critério de correspondência parcial, ordenação de colunas e emissão de relatórios em PDF.
sinonimos:
- como pesquisar ficha de firma no orion
- busca por cpf no cartao de assinatura
- busca fonetica de nomes em firmas
- imprimir relatorio de cartoes de assinatura
- autenticar firma de balcão
perguntas_usuario:
- Como localizar um cartão de assinatura por nome ou CPF?
- Por que o botão Filtrar está desabilitado na pesquisa de cartões de assinatura?
- Como funciona a busca fonética no cadastro de firmas?
- Como ordenar os cartões por data ou número do cartão?
- Como gerar um relatório em PDF com a listagem dos cartões de assinatura?
sintomas_comuns:
- não acho cartão de assinatura pelo nome da pessoa
- como filtrar cartões cadastrados em determinada data
- emitir relatório de fichas de firma em Excel
- consulta de autógrafos travada no balcão de firmas
- busca por fonética no cadastro de cartões de assinatura
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=18
    video_timestamp: 00:18
    video_start_seconds: 18
  - parte: 2
    video_title: Cadastro Cartão de Assinatura pt 2 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 76bede7b-b314-4776-9e6f-3af28af1b54d
    video_url: https://iframe.mediadelivery.net/embed/467408/76bede7b-b314-4776-9e6f-3af28af1b54d?t=0
    video_timestamp: 00:00
    video_start_seconds: 0
  bunny_library_id: '467408'
  bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
  video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
  video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=0
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: V
categoria: videoaula_tutorial
versao_sistema: Orion TN 6.0
---

#### Descrição:
A tela de consulta de cartões de assinatura disponibiliza mecanismos rápidos e flexíveis de localização de registros notariais cadastrados na serventia. Os filtros comportam-se de forma inteligente e adaptativa, liberando a pesquisa a partir do preenchimento de um critério principal (como Nome ou CPF) e oferecendo busca fonética e recursos de ordenação e exportação de relatórios.

#### Passo a passo:
1. Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.
2. Na barra de pesquisa superior, observe que o botão **Filtrar** só é habilitado após o preenchimento de pelo menos um dos critérios obrigatórios (marcados com asterisco **\***).
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

* **Observação:** Quanto mais critérios e caracteres forem informados na pesquisa, mais rápido e refinado será o retorno dos dados da base notarial.
---

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
