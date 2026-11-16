Olá, pessoal! Hoje apresentarei a rotina de comunicação para a **CENSEC** dentro do **ORION TN**. Os **Cartórios** devem comunicar à **CENSEC** as operações imobiliárias que possuam imóveis vinculados. Portanto, para todas as naturezas de atos que estiverem associadas a um imóvel no sistema, é necessário realizar a comunicação para esta central.

Dentro do **ORION**, acesse o módulo **ORION TN**, onde se concentram as rotinas de comunicações. Em seguida, navegue até o menu Administração, selecione o submenu Comunicações e acesse a opção Outras Comunicações.

O sistema exibirá a tela inicial de consulta. No campo "Tipo de Comunicação", selecione a opção **CENSEC**. Em seguida, informe o período de processamento ou o período do ato. Neste exemplo, preencheremos o período referente ao mês de março completo, inserindo a data inicial (primeiro dia do mês) e a data final (último dia do mês). Caso prefira, você também pode utilizar o campo "Mês de Referência" em vez do intervalo de datas. Além disso, é possível filtrar pelo status do envio ou pelo número do lote, caso o possua. Após preencher os filtros desejados, clique no botão "Filtrar".

Se a consulta indicar que não existem comunicações cadastradas para o período, será necessário gerar um novo lote de comunicação. Para isso, clique no botão "Gerar" na mesma tela. O sistema exibirá o campo "Tipo de Comunicação"; ao selecionar **CENSEC**, serão habilitados os campos "Mês de Referência" e "Ano". Informe o mês e o ano desejados (neste exemplo, março de 2026) e o sistema listará todos os atos com naturezas que possuem imóvel vinculado e que precisam ser enviados à **CENSEC**.

A listagem apresenta colunas como Número de Protocolo, Data do Recibo, Natureza, Número do Livro, Folha Inicial, Folha Final e Progresso. Para realizar a comunicação, marque a caixa de seleção dos protocolos desejados (individualmente ou selecionando todos) e clique no botão "Processar".

Neste momento, o sistema realizará a validação dos campos obrigatórios exigidos pela central. Caso algum ato fique destacado na cor vermelha, isso indica que ele não pôde ser enviado. Nesses casos, clique no ícone de exclamação ("!") para visualizar o detalhamento da pendência (por exemplo: "é necessário ao menos um imóvel vinculado").

Para realizar a correção, clique no ícone de livro ao lado do protocolo para abrir o ato diretamente. Realize os ajustes necessários no card "Imóvel", preenchendo todos os campos obrigatórios exigidos pelas centrais. Após salvar as alterações, retorne à tela de geração e processe o envio novamente.

Como o **ORION TN** possui integração direta via **API** com a **CENSEC**, o envio é realizado de forma automática para a central, sem a necessidade de gerar e importar arquivos manualmente. Quando a coluna Progresso exibir a cor verde, o envio terá sido concluído com sucesso e o ato já constará disponível para consulta no portal da **CENSEC**. Após concluir o envio de todos os atos do período, basta realizar o fechamento do lote diretamente no portal da central.

Finalize os ajustes necessários e siga com os seus envios. Obrigado e até a próxima!
