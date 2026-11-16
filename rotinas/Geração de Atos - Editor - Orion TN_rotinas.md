---
id: V-7.0.1
titulo: "Geração e Qualificação de Partes e Imóveis no Editor com Resolução de Pendências em Vermelho"
tags:
  - protocolo
  - editor de texto
  - qualificação de partes
  - qualificação de imóvel
  - modelos de qualificação
  - campos em vermelho
  - remesclagem
objetivo: "Configurar e mesclar a qualificação de partes e imóveis no editor do protocolo, solucionando pendências de dados destacados em vermelho antes da geração da minuta."
sinonimos:
  - qualificar partes no editor
  - trocar modelo de qualificação de partes
  - dados em vermelho na qualificação
  - resolver pendência de qualificação
  - qualificar imóvel no editor
  - incluir ou sobrescrever qualificação
perguntas_usuario:
  - "Como faço para qualificar as partes e o imóvel para a minuta no Orion TN?"
  - "Por que alguns campos aparecem com a fonte em vermelho na qualificação da parte?"
  - "O que fazer quando faltam dados do cônjuge ou regime de bens na qualificação?"
  - "Como trocar o modelo de qualificação de uma parte de solteiro para casado?"
  - "Qual a diferença entre incluir e sobrescrever a qualificação de uma parte?"
---
#### Descrição:
Procedimento completo para realizar a geração e personalização da qualificação de partes e imóveis diretamente no editor de texto do protocolo notarial. O sistema **ORION TN** permite utilizar modelos pré-qualificados padrão, alternar dinamicamente entre modelos cadastrados (com opção de incluir na posição do cursor ou sobrescrever o texto anterior) e alerta visualmente dados incompletos em cor vermelha para rápida correção cadastral antes da geração da minuta.

#### Passo a passo:
1. No menu de **Notas**, abrir um novo protocolo selecionando a **Espécie** (ex: Escritura) e a **Natureza** (ex: Compra e Venda).
2. Preencher os dados do solicitante nos campos **Interessado**, **CPF** e **Nome**, salvando o protocolo pelo ícone de **Salvar** à direita ou utilizando o atalho **Ctrl + Alt + S**.
3. Na guia de partes do protocolo, cadastrar os participantes do ato (ex: **Outorgante vendedor** e **Outorgado comprador**) ou selecionar os respectivos **Cartões de Assinatura** existentes.
4. Para gerar a qualificação textual das partes:
   * Clicar no botão **Qualificação**.
   * O sistema carregará o modelo padrão parametrizado nas configurações ou a última qualificação utilizada para a respectiva parte.
5. Para alternar ou personalizar o modelo de qualificação:
   * No painel lateral direito da tela de qualificação, localizar a lista de modelos cadastrados e liberados para os usuários.
   * Selecionar o modelo desejado (ex: modelo de qualificação para pessoa casada).
   * O sistema exibirá uma mensagem de confirmação com duas opções de inserção:
     * **Incluir:** insere o novo texto exatamente onde o cursor do mouse estiver posicionado, preservando os dados anteriores.
     * **Sobrescrever:** limpa integralmente o texto anterior e insere apenas a nova estrutura do modelo selecionado.
6. Resolução de pendências de dados destacados em vermelho:
   * Se o texto gerado na qualificação exibir termos com a fonte na cor **vermelha** (ex: profissão do cônjuge, UF do RG do cônjuge, regime de bens), isso indica que os respectivos campos não foram preenchidos na guia de qualificação da parte no protocolo.
   * Salvar as alterações da tela de qualificação e fechar a janela.
   * Retornar ao cadastro da parte no protocolo e preencher as informações faltantes nos campos correspondentes.
   * Clicar novamente no botão **Qualificação** e efetuar a remesclagem; o sistema atualizará o texto substituindo os alertas em vermelho pelos dados cadastrados.
   * Repetir o procedimento para todas as partes restantes do ato.
7. Qualificação do Imóvel:
   * Na guia de imóveis do protocolo, selecionar o imóvel cadastrado ou inserir um novo bem.
   * Preencher as informações descritivas no campo aberto **Descrição** (que possui variável correspondente para transporte automático ao modelo).
   * Salvar o cadastro do imóvel e clicar no ícone referente ao **Editor** no card do imóvel.
   * O sistema carregará a qualificação do imóvel. Caso queira alternar o modelo, clicar no ícone de **Lupa** no canto superior direito e selecionar o modelo de imóvel desejado na lista.
   * Clicar em **Salvar** para gravar a qualificação do imóvel.

* **Observação:** As variáveis mescladas no texto sofrem alterações automáticas com base nas parametrizações da parte, como regime de bens e papel do cônjuge (transmitente, anuente ou nenhum).
* **Observação:** A remesclagem é mandatória após preencher dados faltantes no cadastro para que os campos vermelhos sejam atualizados com os dados reais.
---
id: V-7.0.2
titulo: "Geração de Minuta com Variáveis Dinâmicas de Gênero, Número e Papel de Cônjuge (Transmitente e Anuente)"
tags:
  - protocolo
  - editor de texto
  - minuta
  - variáveis dinâmicas
  - concordância gramatical
  - cônjuge transmitente
  - cônjuge anuente
objetivo: "Gerar a minuta da escritura a partir de modelos pré-configurados e ajustar variáveis dinâmicas de concordância gramatical e participação do cônjuge."
sinonimos:
  - gerar minuta de compra e venda
  - concordância automática minuta orion
  - configurar cônjuge transmitente na minuta
  - flexão de gênero e número no editor
  - opções do card do editor de texto
perguntas_usuario:
  - "Como gero a minuta da escritura no card do editor de texto?"
  - "Por que o cônjuge da parte não apareceu na minuta como vendedor?"
  - "Como funciona o ajuste automático de gênero e número na minuta do Orion TN?"
  - "Quais ações estão disponíveis no card da minuta gerada?"
---
#### Descrição:
Rotina operacional para criação da minuta do ato notarial no **ORION TN**, demonstrando a atuação do motor de variáveis dinâmicas que realiza a validação e concordância automática de gênero e número (singular/plural e masculino/feminino) no corpo do documento, além de ajustar as qualificações e cláusulas conforme a definição de participação do cônjuge (transmitente, anuente ou nenhum).

#### Passo a passo:
1. No card do **Editor de Texto** do protocolo, localizar o campo de seleção de modelos.
2. Selecionar o modelo de minuta desejado (ex: Minuta de Compra e Venda) e clicar no botão **Adicionar**.
3. O sistema realizará o processamento e a mescla dos dados qualificados (partes, imóvel, valores e negócio jurídico) e disponibilizará o registro da minuta no card.
4. No card da minuta gerada, estão disponíveis as seguintes ações operacionais:
   * **Excluir:** remove a versão da minuta gerada.
   * **Alterar** / **Editar:** abre o documento para edição no LibreOffice Online.
   * **Visualizar:** abre a minuta em modo somente leitura.
   * **Enviar por e-mail:** dispara a minuta diretamente ao e-mail dos interessados.
   * **Assinar digitalmente:** direciona o documento para rotinas de assinatura digital.
   * **Status de impressão:** monitora o andamento da impressão do ato.
   * **Fazer download da prévia:** baixa o arquivo PDF da minuta na máquina local.
   * **Enviar por WhatsApp:** encaminha o documento por mensagem instantânea.
   * **Preenchimento do protocolo com IA:** executa a extração e qualificação automática via Inteligência Artificial.
5. Para conferir e ajustar variáveis dinâmicas e concordância gramatical:
   * Clicar no botão **Editar** (ou ícone de lápis) para abrir o corpo da minuta.
   * O sistema aplica regras automáticas de validação de gênero e número:
     * **Cônjuge como "Nenhum":** no cadastro da parte, se o cônjuge estiver marcado como "Nenhum", a minuta apresentará apenas o titular no singular (ex: *"outorgante vendedor Bruno Fernandes"*).
     * **Cônjuge como "Transmitente":** ao alterar a marcação do cônjuge para "Transmitente" no cadastro da parte e gerar a minuta novamente, o sistema flexiona o texto automaticamente para o plural composto (ex: *"outorgantes vendedores Bruno Fernandes e sua cônjuge, Paula"*).
     * **Flexão de Gênero Feminino:** para compradores ou vendedoras do sexo feminino, o sistema flexiona automaticamente para o feminino (ex: *"outorgada compradora Roberta Magalhães"*).
6. Ajuste de campos institucionais e financeiros:
   * Se campos como o cargo do escrevente assinante ou o valor total do ITBI não constarem na minuta, o motivo é a ausência de preenchimento nas respectivas guias do protocolo.
   * *Regra de Ouro:* Embora seja possível digitar esses dados manualmente no editor, a alteração manual no texto não atualiza o banco de dados do protocolo. Deve-se sempre preencher os campos diretamente no formulário do protocolo (escrevente na guia de dados e ITBI na guia de custas/emolumentos) e gerar a minuta novamente para que os dados fiquem salvos e sincronizados.

* **Observação:** A parametrização correta de cônjuge (Transmitente/Anuente/Nenhum) garante a emissão juridicamente perfeita das cláusulas de transmissão e declarações de outorga uxória/marital.
---
id: V-7.0.3
titulo: "Edição Avançada no LibreOffice Online: Inserção de Cláusulas, Formatação e Transcrição por Extenso"
tags:
  - editor de texto
  - libreoffice online
  - inserção de cláusulas
  - formatar documento
  - transcrição por extenso
  - valores por extenso
  - metragem quadrada
objetivo: "Utilizar as ferramentas do LibreOffice Online integrado para formatar documentos, inserir cláusulas laterais padronizadas e converter valores numéricos e metragens por extenso."
sinonimos:
  - formatar minuta libreoffice
  - inserir cláusula na escritura
  - escrever valor por extenso no editor
  - converter metros quadrados por extenso
  - padronizar fontes da minuta
perguntas_usuario:
  - "Como faço para inserir uma cláusula padrão na minuta pelo editor?"
  - "Como corrigir fontes desconfiguradas após inserir uma cláusula na minuta?"
  - "Onde fica a ferramenta para escrever valores e áreas em metros quadrados por extenso?"
  - "Quais recursos de formatação de texto estão disponíveis no editor do Orion TN?"
---
#### Descrição:
Este procedimento orienta sobre a utilização dos recursos avançados do editor de texto integrado do **ORION TN** (baseado em LibreOffice Online), incluindo a barra de ferramentas tipográficas, o painel de inserção e pré-visualização de cláusulas padronizadas, a função de formatação global de documento e o conversor automático de números, valores monetários e áreas em texto por extenso.

#### Passo a passo:
1. Com a minuta aberta na tela de edição do editor integrado, utilizar as ferramentas do **LibreOffice Online** disponíveis no menu superior:
   * Seleção de família de fonte, tamanho de fonte, cor do texto, marca-texto/realce, alinhamentos (à esquerda, centralizado, à direita, justificado), listas e espaçamentos.
2. Para buscar e inserir cláusulas contratuais na minuta:
   * Localizar e clicar no ícone de **Lupa** no canto superior direito da tela de edição.
   * No campo **Local de busca**, selecionar a opção **Cláusulas**.
   * O sistema listará todas as cláusulas padrão cadastradas e ativas na serventia.
   * Para visualizar o teor de uma cláusula antes de aplicá-la, clicar no ícone de **Olho** correspondente.
   * Para inserir a cláusula no texto: posicionar o cursor do mouse exatamente no ponto da minuta onde a cláusula deve ser inserida e clicar sobre o nome da cláusula na listagem lateral.
3. Padronização automática de fontes e formatação de cláusulas:
   * Caso a cláusula inserida apresente fonte ou formatação diferente do restante da minuta (por ter sido criada em padrão distinto), clicar no botão **Formatar documento**.
   * O sistema aplicará a formatação padrão da serventia em todo o documento de forma homogênea e instantânea.
4. Utilização da ferramenta de Transcrição por Extenso:
   * Na barra inferior da tela do editor, clicar no botão **Transcrição de valores por extenso**.
   * Na janela modal exibida, selecionar o tipo de conversão desejado (moeda corrente em reais, números cardinais, área em metros quadrados, etc.).
   * Digitar o número ou valor numérico no campo correspondente (ex: digitar "10" na opção de metragem).
   * O sistema converterá automaticamente o valor para texto por extenso (ex: *"dez metros quadrados"*).
   * Para transferir o texto por extenso diretamente para a minuta, posicionar o cursor no local desejado e pressionar a tecla **Enter** ou clicar no botão de inserção.
   * Utilizar o botão de limpar para novo cálculo ou fechar a janela ao concluir.

* **Dica:** O botão **Formatar documento** elimina desvios visuais em minutas compostas por múltiplas cláusulas de origens diversas.
---
id: V-7.0.4
titulo: "Geração, Configuração de Margem Espelho e Impressão do Livro Oficial com Consulta CNIB Integrada"
tags:
  - protocolo
  - editor de texto
  - geração do livro
  - prévia do livro
  - margem espelho
  - cnib
  - indisponibilidade
  - impressão do livro
objetivo: "Gerar a versão oficial do livro notarial, configurar a margem espelho para papel de segurança, consultar a CNIB e realizar a impressão definitiva com encerramento automático de folhas."
sinonimos:
  - como gerar o livro de notas
  - imprimir livro margem espelho
  - prévia do livro sem lavratura
  - inserir certidão cnib no livro
  - impressão definitiva do livro e contagem de folhas
perguntas_usuario:
  - "Como gerar a prévia do livro para enviar ao advogado antes da lavratura?"
  - "O que é e quando devo usar a opção de Margem Espelho na impressão do livro?"
  - "Como consultar a CNIB e inserir a certidão de indisponibilidade diretamente no livro?"
  - "Como o sistema faz a contagem de folhas e o encerramento do livro após a impressão definitiva?"
---
#### Descrição:
Procedimento para transição da minuta para o livro oficial de notas no **ORION TN**, abrangendo a emissão de prévia sem lavratura para conferência externa, a geração do livro definitivo com recibo e número de folhas, a aplicação mandatória de margem espelho para folhas de segurança encadernáveis, a inserção de certidões da Central de Indisponibilidade (**CNIB**) e a impressão definitiva com fechamento automático de folhas.

#### Passo a passo:
1. Após finalizar e salvar a minuta no editor, fechar a tela de edição para retornar ao card do editor de texto no protocolo.
2. Selecionar o documento de referência da minuta e definir o tipo de livro a ser gerado:
   * **Prévia do Livro:** gera o documento com cabeçalho e encerramento, porém sem as datas de lavratura, sem o número do recibo e sem valores pendentes de lançamento. É a opção indicada para envio a clientes ou advogados para leitura e validação prévia.
   * **Gerar Livro Oficial:** gera a versão oficial vinculada aos dados definitivos do protocolo.
3. Para gerar o Livro Oficial definitivo:
   * Realizar previamente a geração do recibo no protocolo informando o número do **Livro**; o sistema sugerirá automaticamente o número da **Folha** inicial disponível na sequência.
   * Concluir o recibo e, no card do editor, clicar no botão **Gerar Livro**.
4. Configuração de Margem Espelho para Papéis de Segurança:
   * Antes de disparar a impressão, habilitar a opção **Margem espelho**.
   * *Justificativa Técnica:* Os papéis de segurança oficiais utilizados para encadernação em livros possuem margens assimétricas diferenciadas para páginas pares e ímpares (área de costura e perfuração). A opção de margem espelho ajusta o posicionamento do texto conforme o lado da folha, evitando que caracteres fiquem ocultos ou danificados pela encadernação.
5. Consulta à Central de Indisponibilidade (**CNIB**) no Livro:
   * No editor do livro, antes da impressão definitiva, clicar no botão **Central de Indisponibilidade** para disparar a consulta aos bancos de dados de indisponibilidade.
   * Após o processamento da consulta, clicar no ícone de **Lupa** no canto superior direito do editor e selecionar a opção **Consulta CNIB**.
   * O sistema carregará o modelo cadastrado contendo o hash e o resultado da consulta.
   * Posicionar o cursor do mouse no ponto desejado do livro e clicar sobre o nome do modelo para inserir a certidão no corpo do ato.
6. Impressão do Livro Oficial:
   * **Impressão prévia:** gera o livro com marca-d'água para conferência visual.
   * **Impressão definitiva:** envia o ato para impressão nas folhas de segurança oficiais.
   * Ao concluir a impressão definitiva, o sistema executa automaticamente a contagem exata das folhas consumidas e insere a folha final de encerramento do ato, atualizando a numeração do livro.

* **Atenção:** A impressão definitiva consome a numeração oficial de folhas no sistema e trava o documento para edição direta, exigindo liberação de supervisor caso sejam necessárias retificações posteriores.
---
id: V-7.0.5
titulo: "Geração e Emissão do Traslado Notarial a partir da Minuta de Referência"
tags:
  - protocolo
  - editor de texto
  - traslado
  - prévia do traslado
  - impressão definitiva do traslado
  - encerramento do ato
objetivo: "Gerar e imprimir o traslado oficial a partir da minuta limpa de referência, emitindo a prévia para conferência e a versão definitiva para entrega às partes."
sinonimos:
  - como gerar traslado no orion tn
  - imprimir traslado da escritura
  - prévia do traslado
  - encerramento do ato notarial traslado
  - emitir traslado definitivo
perguntas_usuario:
  - "Como faço para gerar e imprimir o traslado após lavrar o livro?"
  - "Posso emitir uma prévia do traslado antes da impressão definitiva?"
  - "De onde o sistema extrai os dados para montar o traslado da escritura?"
---
#### Descrição:
Procedimento para confecção, conferência e impressão do traslado notarial no **ORION TN**. O traslado representa a cópia autêntica integral do ato lavrado no livro de notas destinada às partes interessadas, devendo ser emitido com cabeçalho e encerramento próprios a partir da minuta original de referência.

#### Passo a passo:
1. No card do **Editor de Texto** do protocolo, localizar a **Minuta** original de referência utilizada para a lavratura do ato.
2. Clicar no botão **Traslado**.
3. O sistema abrirá a interface do traslado, aplicando automaticamente os cabeçalhos de abertura de traslado, os dados do livro/folha lavrados e a cláusula de encerramento de traslado configurada na serventia.
4. Para conferência de diagramação antes do uso do papel de segurança:
   * Clicar na opção **Impressão prévia**. O sistema gerará o arquivo com marca-d'água de prévia para revisão visual.
5. Para a emissão oficial do documento:
   * Selecionar a opção de **Impressão definitiva**.
   * O sistema direcionará a impressão para as folhas de papel de segurança de traslado configuradas no cartório.
6. Após a impressão definitiva do traslado e entrega às partes, o protocolo notarial encontra-se plenamente concluído e lavrado no **ORION TN**.

* **Observação Importante:** O traslado deve ser gerado **SEMPRE** a partir da **Minuta limpa** de referência e **NUNCA** a partir do arquivo gerado para o **Livro**, prevenindo a duplicação indevida de cabeçalhos e fechamentos no documento final.
---
