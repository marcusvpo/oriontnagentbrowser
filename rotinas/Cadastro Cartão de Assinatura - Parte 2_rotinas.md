---
id: V-CCA.2.1
titulo: "Consulta Avançada, Filtros e Relatórios de Cartões de Assinatura"
tags:
  - firmas
  - cartao de assinatura
  - consulta de firmas
  - busca fonetica
  - relatorio em pdf
  - filtros de pesquisa
objetivo: "Pesquisar fichas de cartões de assinatura utilizando filtros dinâmicos, busca fonética, critério de correspondência parcial, ordenação de colunas e emissão de relatórios em PDF."
sinonimos:
  - como pesquisar ficha de firma no orion
  - busca por cpf no cartao de assinatura
  - busca fonetica de nomes em firmas
  - imprimir relatorio de cartoes de assinatura
perguntas_usuario:
  - "Como localizar um cartão de assinatura por nome ou CPF?"
  - "Por que o botão Filtrar está desabilitado na pesquisa de cartões de assinatura?"
  - "Como funciona a busca fonética no cadastro de firmas?"
  - "Como ordenar os cartões por data ou número do cartão?"
  - "Como gerar um relatório em PDF com a listagem dos cartões de assinatura?"
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
---
id: V-CCA.2.2
titulo: "Consulta Rápida de Anexos, Histórico de Andamentos e Bloqueio de Ficha"
tags:
  - firmas
  - cartao de assinatura
  - anexos
  - historico de andamentos
  - bloqueio de ficha
  - alerta de firma
  - tela cheia
objetivo: "Consultar indicadores visuais de imagens e fotos, visualizar galeria de anexos em tela cheia, auditar o histórico de alterações da ficha e aplicar bloqueio com motivo de alerta."
sinonimos:
  - ver se a ficha tem foto ou imagem
  - abrir anexos do cartao de assinatura em tela cheia
  - historico de alteracoes do cartao de assinatura
  - bloquear ficha de firma nao alfabetizado
perguntas_usuario:
  - "O que significa o ícone de imagem verde na lista de cartões de assinatura?"
  - "Como abrir e visualizar todos os documentos anexados à ficha em tela cheia?"
  - "Como ver quem alterou o cartão de assinatura e o que foi modificado?"
  - "Como bloquear uma ficha de firma e colocar um aviso para o escrevente no balcão?"
  - "Como fechar a tela de visualização de anexos?"
---
#### Descrição:
Cada registro listado na tabela de cartões de assinatura possui atalhos de consulta instantânea e recursos de auditoria. Esta rotina aborda a leitura dos indicadores visuais (presença de imagem e foto), o uso da galeria unificada de anexos em tela cheia, o rastreamento do log de andamentos e a ativação de bloqueios cautelares com alertas operacionais para o balcão de firmas.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e realize o filtro do registro desejado.
2. Observe os **Indicadores Visuais Rápidos** na linha do registro:
   * **Ícone de Imagem do Cartão**: Se estiver na cor **Verde**, sinaliza que o cartão físico de assinatura está digitalizado e anexado à ficha; se estiver cinza/apagado, indica ausência de imagem anexada.
   * **Indicador de Foto**: Mostra visualmente se a foto facial da pessoa foi capturada via webcam.
   * **Atalho de Biometria**: Permite acionar diretamente a coleta biométrica no leitor sem necessidade de abrir todo o formulário de edição.
3. Para **Visualizar Anexos e Imagens da Ficha**:
   * Clique no ícone/atalho de **Anexos** na linha da ficha.
   * O sistema abrirá a galeria unificada com todas as imagens vinculadas ao cartão (ficha de assinatura, documentos de identidade, comprovantes).
   * Utilize o recurso de **Visualização em Tela Cheia** para inspecionar traços de assinaturas ou detalhes de documentos com máxima nitidez.
   * Para fechar a visualização, pressione a tecla **Esc** no teclado ou clique no botão **Fechar**.
4. Para auditar o **Histórico de Andamentos**:
   * Clique no ícone de **Andamentos** (ícone de histórico/relógio).
   * O sistema abrirá a janela de auditoria completa da ficha, exibindo em ordem cronológica: a data e hora exatas de cada ação, o nome do usuário/operador responsável e a descrição detalhada da alteração executada.
5. Para **Bloquear uma Ficha de Assinatura**:
   * Na linha do cartão, clique na opção **Bloquear Ficha**.
   * O sistema abrirá uma janela para inserção da justificativa; digite o motivo detalhado do bloqueio (por exemplo: "Parte não alfabetizada - exigir assinatura a rogo e testemunhas", "Assinatura divergente - conferir documento original", ou "Determinação judicial").
   * Confirme o bloqueio.
   * Ao efetuar o bloqueio, sempre que qualquer usuário pesquisar ou tentar reconhecer firma para essa pessoa no balcão de firmas, o sistema emitirá um alerta ostensivo na tela impedindo ou condicionando o atendimento.
6. Para consultar os dados da ficha sem risco de alteração acidental, clique no botão **Visualizar** (modo somente leitura).

* **Observação:** O histórico de andamentos é gravado de forma automática e imutável pelo sistema, servindo como base de conformidade e auditoria interna do cartório.
---
---
id: V-CCA.2.3
titulo: "Edição com Liberação de Supervisor e Gestão de Papel de Segurança (Consumo, Estorno e Inutilização)"
tags:
  - firmas
  - cartao de assinatura
  - edicao de ficha
  - senha de supervisor
  - papel de seguranca
  - formulario de seguranca
  - inutilizacao de papel
  - estoque
objetivo: "Editar dados cadastrais com autenticação de supervisor e gerenciar o consumo, reserva, devolução ao estoque ou inutilização de formulários de papel de segurança."
sinonimos:
  - alterar nome ou cpf no cartao de assinatura
  - pedir senha de supervisor para alterar ficha
  - consumir papel de seguranca na ficha de firma
  - devolver papel de seguranca para o estoque
  - inutilizar papel de seguranca no cartao
perguntas_usuario:
  - "Como alterar o nome ou documento de uma ficha de firma que já teve atos reconhecidos?"
  - "Por que o campo de CPF está travado na edição do cartão de assinatura?"
  - "Como vincular e consumir o papel de segurança na ficha de firma?"
  - "Qual a diferença entre status Reservado e Consumido no papel de segurança?"
  - "Como devolver um papel de segurança cancelado para o estoque?"
  - "Como inutilizar definitivamente uma folha de papel de segurança?"
---
#### Descrição:
Quando um cartão de assinatura já possui atos notariais ou reconhecimentos de firma vinculados em seu histórico, os campos sensíveis de identificação (como Nome e Documentos) são bloqueados pelo sistema para segurança jurídica, exigindo liberação por senha de supervisor. Além disso, esta rotina abrange todo o ciclo de vida do papel/formulário de segurança no cartão: consumo, controle de status (Reservado/Consumido), estorno para o estoque e inutilização definitiva.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de Assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**).
2. Para **Editar Campos Sensíveis Bloqueados (Nome / Documentos)**:
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

* **Observação:** Todas as movimentações de consumo, devolução e inutilização de formulários de segurança são registradas automaticamente nos relatórios de controle de estoque do Orion TN para prestação de contas à Corregedoria.
---
