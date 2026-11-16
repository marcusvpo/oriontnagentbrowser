---
id: V-CCA.1.1
titulo: "Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados"
tags:
  - firmas
  - cartao de assinatura
  - cadastro de firmas
  - reaproveitamento de dados
  - campos obrigatorios
  - validacao
objetivo: "Cadastrar um novo cartão de assinatura no módulo de Firmas, aproveitando dados pré-existentes de protocolos e fichas anteriores com validação dinâmica de campos."
sinonimos:
  - abrir cartao de autografo
  - cadastrar ficha de firma
  - novo cartao de assinatura
  - importar dados do protocolo para o cartao de firma
perguntas_usuario:
  - "Como cadastrar um novo cartão de assinatura no Orion TN?"
  - "Por que o botão Concluir do cartão de assinatura está desabilitado com um triângulo de alerta?"
  - "Como puxar os dados de um protocolo anterior para preencher o cartão de assinatura?"
  - "Quais campos são obrigatórios no cadastro de cartão de assinatura?"
  - "Como preencher os dados do cônjuge no cartão de assinatura?"
---
#### Descrição:
O cadastro de cartão de assinatura (ficha de autógrafo/firma) registra a qualificação completa, dados documentais e parâmetros civis da pessoa física para subsidiar os atos de reconhecimento de firma e lavratura de escrituras/procurações. O Orion TN disponibiliza buscas inteligentes para reaproveitamento ágil de cadastros pré-existentes na base de dados notarial e validações em tempo real de consistência cadastral.

#### Passo a passo:
1. Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.
2. Na tela de gerenciamento de cartões de assinatura, clique no botão **Adicionar**.
3. O sistema abrirá o formulário de cadastro dinâmico com os campos disponíveis para preenchimento.
4. Identifique os campos com asterisco (**\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF**, além de eventuais campos customizados pela serventia).
5. Para reaproveitar dados já cadastrados e agilizar o atendimento:
   * No campo **Nome**, digite o nome completo ou parcial e clique no ícone da **Lupa** ao lado do campo; ou
   * No campo **CPF**, digite o número do documento e clique no ícone da **Lupa** ao lado do campo para uma busca exata.
6. Na lista de resultados apresentada pelo sistema:
   * Registros identificados com a indicação **(Protocolo)** carregam as informações do índice de escrituras/procurações do último protocolo cadastrado para aquele CPF/Nome.
   * Registros identificados como **(Cartão de Assinatura)** carregam os dados da última ficha de firma preenchida no sistema.
7. Selecione o registro desejado; o sistema exibirá uma mensagem de confirmação para a importação dos dados; clique em **Confirmar** (ou **Sim**).
8. Os campos da ficha serão automaticamente populados, permanecendo todos abertos para edição, correção ou complementação.
9. Preencha ou confira os dados pessoais e civis:
   * **Estado Civil**: Selecione o estado civil correspondente.
   * **Dados do Cônjuge**: Note que os campos de qualificação do cônjuge são dinâmicos e só serão exibidos na tela se o estado civil selecionado for **Casado** (permanecendo ocultos para **Solteiro**, **Divorciado**, etc.).
   * **Documento de Identidade (RG / CNH)**: Informe número, órgão emissor, UF e data de emissão. Se desejar, anexe uma digitalização do documento ou capture uma foto diretamente pela webcam clicando no ícone correspondente junto ao campo.
   * Passe o mouse sobre o ícone informativo (**i**) ao lado dos campos para visualizar instruções detalhadas de preenchimento.
10. Valide o preenchimento:
    * Se houver algum campo obrigatório não preenchido ou dado inconsistente (por exemplo, uma data de nascimento inválida), o botão **Concluir** na parte inferior permanecerá inativo (cinza) com um ícone de **Triângulo de Alerta**.
    * Posicione o mouse sobre o alerta para identificar a pendência, corrija o campo apontado e o botão **Concluir** será imediatamente liberado.
11. Clique no botão **Concluir** para salvar a ficha (caso não vá inserir mídias ou anexos neste momento).

* **Observação:** O preenchimento correto do CPF e do Nome completo é a chave primária para a busca unificada de firmas em todo o sistema. A importação de dados de protocolos ou cartões anteriores não bloqueia nenhuma alteração cadastral necessária.
---
---
id: V-CCA.1.2
titulo: "Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura"
tags:
  - firmas
  - cartao de assinatura
  - profissao
  - contatos
  - endereco
  - pessoa juridica
  - termo de comparecimento
objetivo: "Cadastrar e gerenciar profissões vinculadas, múltiplos e-mails, telefones, endereços e vínculos de representação de pessoa jurídica no cartão de assinatura."
sinonimos:
  - cadastrar nova profissao no cartao de assinatura
  - adicionar empresa que a pessoa representa na firma
  - colocar multiplos telefones no cartao de autografo
  - vincular cnpj na ficha de firma
perguntas_usuario:
  - "Por que a profissão que digitei não ficou gravada no cartão de assinatura?"
  - "Como cadastrar uma nova profissão que não existe na busca?"
  - "Como adicionar múltiplos e-mails e telefones no cartão de assinatura e marcar o principal?"
  - "Como vincular uma empresa (PJ) que a pessoa representa para sair no termo de comparecimento?"
---
#### Descrição:
O cartão de assinatura permite estruturar de forma minuciosa as formas de contato (pessoal, residencial, comercial), múltiplos endereços e os vínculos societários/representativos com pessoas jurídicas, além de exigir a seleção padronizada de profissões na tabela do sistema para garantir integridade nas certidões e relatórios.

#### Passo a passo:
1. Na tela de cadastro do **Cartão de Assinatura**, localize o campo **Profissão**:
   * **Atenção:** O campo profissão utiliza pesquisa obrigatória por tabela. Se você apenas digitar um texto livre e não selecionar um item da lista suspensa da lupa, o sistema **NÃO** gravará a profissão na ficha.
   * Digite o nome da profissão e clique na **Lupa** para buscar.
   * Se a profissão for localizada, clique sobre ela para selecioná-la.
   * Se a profissão **NÃO** existir no banco de dados: selecione o texto digitado, copie com **Ctrl+C**, clique no botão de adição (**+**) ao lado do campo, cole/digite o nome da nova profissão, clique em **Concluir** para registrar a profissão no sistema e, em seguida, selecione-a na lista de busca.
2. Na seção de **Contatos (E-mails e Telefones)**:
   * **E-mails**: Clique no botão de adição (**+**) para incluir novos endereços de e-mail (ex.: E-mail Pessoal, E-mail Comercial). Para remover um registro incorreto, selecione e clique no botão de subtração (**-**).
   * **Telefones**: Clique no botão de adição (**+**) para inserir telefones (Celular, Comercial, Residencial). Marque a caixa de seleção **Principal** no telefone prioritário para que ele tenha preferência nas telas de consulta e identificação do sistema.
3. Na seção de **Endereços**:
   * Clique no botão de adição (**+**) para inserir os dados do logradouro (tipo de endereço, CEP, rua, número, complemento, bairro, município e UF).
   * Defina qual é o endereço **Principal** marcando a opção correspondente.
4. Na seção de **Representação de Pessoa Jurídica (Empresas)**:
   * Se a pessoa cadastrada assinar ou representar empresas (como administradora, sócia ou procuradora), clique no botão de adição (**+**).
   * Preencha o **Nome / Razão Social** da empresa e o **CNPJ** (campo de preenchimento obrigatório para efetivar o vínculo).
   * Caso haja mais de uma empresa vinculada à pessoa, marque a opção de empresa **Padrão** se desejar que essa PJ seja prioritária.
   * A empresa vinculada será automaticamente impressa no **Termo de Comparecimento** gerado no reconhecimento de firmas.
5. Após preencher todas as seções e verificar as informações, clique no botão **Concluir** para gravar o cartão de assinatura.

* **Observação:** O vínculo de Pessoa Jurídica na ficha de firma agiliza extraordinariamente o reconhecimento de firma por representação, evitando a necessidade de digitar dados da empresa a cada ato de firma presencial ou por autenticidade.
---
---
id: V-CCA.1.3
titulo: "Captura de Foto Facial, Biometria e Imagem/Digitalização do Cartão de Assinatura"
tags:
  - firmas
  - cartao de assinatura
  - captura de foto
  - biometria
  - scanner
  - digitalizacao de ficha
  - webcam
objetivo: "Capturar e vincular a fotografia facial via webcam, a impressão digital no leitor biométrico e a imagem do cartão físico de assinatura (via arquivo, scanner ou webcam)."
sinonimos:
  - tirar foto da pessoa no cartao de assinatura
  - coletar biometria na ficha de firma
  - escanear ficha de autografo
  - anexar imagem do cartao de assinatura
perguntas_usuario:
  - "Como tirar a foto do cliente na tela de cartão de assinatura?"
  - "Como coletar a impressão digital no leitor biométrico para a ficha de firma?"
  - "Como digitalizar o cartão de assinatura diretamente pelo scanner no Orion TN?"
  - "Como anexar um arquivo PDF ou imagem do cartão físico já digitalizado?"
  - "Por que a imagem do cartão de assinatura não ficou salva na ficha?"
---
#### Descrição:
O painel lateral direito da tela de Cartão de Assinatura concentra os recursos de captura e conferência multimídia e biométrica do comparecente: registro fotográfico facial por webcam, coleta de impressão digital em leitor biométrico homologado e inserção da imagem da ficha de autógrafo física (por importação de arquivo do Windows, captura direta via scanner TWAIN ou foto pela webcam).

#### Passo a passo:
1. Com o cadastro do **Cartão de Assinatura** aberto na tela, direcione a atenção ao **Painel Lateral Direito**.
2. Para realizar a **Captura de Foto Facial da Pessoa**:
   * Posicione a pessoa em frente à câmera/webcam configurada na estação de trabalho.
   * Clique no ícone/botão de captura de foto da pessoa (webcam).
   * Visualize o enquadramento na tela de prévia e clique em **Capturar** (ou **Tirar Foto**).
   * Clique em **Concluir** para fixar a foto na ficha.
3. Para realizar a **Coleta Biométrica (Impressão Digital)**:
   * Solicite que o comparecente posicione o dedo indicador (ou polegar) sobre a superfície do leitor biométrico conectado.
   * Clique no ícone de **Coleta Biométrica**.
   * Aguarde a leitura e a validação da qualidade da digital pelo leitor.
   * Clique no botão **Concluir** para salvar a biometria vinculada à ficha.
4. Para realizar a **Inclusão da Imagem do Cartão de Assinatura Físico**:
   * Escolha uma das 3 modalidades de captura disponíveis:
     * **Opção A - Importar de Pasta (Arquivo)**: Clique na opção de pasta do Windows, navegue pelas pastas do computador, selecione o arquivo de imagem/digitalização da ficha física preenchida e clique em **Abrir**.
     * **Opção B - Captura Direta via Scanner**: Clique no ícone de **Scanner**, selecione o periférico/scanner instalado na estação de trabalho, posicione a ficha no vidro/alimentador do scanner e execute a digitalização.
     * **Opção C - Captura via Foto (Webcam)**: Clique no ícone de foto do cartão, posicione a folha do cartão preenchida manualmente em frente à câmera e faça o disparo.
   * **ATENÇÃO (Passo Obrigatório):** Em qualquer uma das três modalidades de captura (pasta, scanner ou foto), é estritamente obrigatório clicar no botão **Concluir** da tela de captura para efetivar a vinculação da imagem à ficha.
5. Após registrar as fotos, biometrias e imagens do cartão, clique no botão **Concluir** na parte inferior do cadastro do cartão de assinatura para finalizar e gravar todas as mídias no banco de dados.

* **Observação:** Se você capturar a imagem pelo scanner ou importar o arquivo e fechar a janela sem clicar em **Concluir**, o vínculo da imagem será descartado e o cartão constará sem imagem na listagem do sistema.
---
