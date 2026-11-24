---
id: V-CCA.1.1
titulo: Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados
tags:
- firmas
- cartao de assinatura
- cadastro de firmas
- reaproveitamento de dados
- campos obrigatorios
- validacao
objetivo: Cadastrar um novo cartão de assinatura no módulo de Firmas, aproveitando dados pré-existentes de protocolos e fichas anteriores com validação dinâmica de campos.
sinonimos:
- abrir cartao de autografo
- cadastrar ficha de firma
- novo cartao de assinatura
- importar dados do protocolo para o cartao de firma
- autenticar firma de balcão
perguntas_usuario:
- Como cadastrar um novo cartão de assinatura no Orion TN?
- Por que o botão Concluir do cartão de assinatura está desabilitado com um triângulo de alerta?
- Como puxar os dados de um protocolo anterior para preencher o cartão de assinatura?
- Quais campos são obrigatórios no cadastro de cartão de assinatura?
- Como preencher os dados do cônjuge no cartão de assinatura?
sintomas_comuns:
- não consigo abrir novo cartão de assinatura
- lupa de CPF não localiza pessoa para ficha de firma
- reaproveitar dados cadastrais ao abrir cartão de autógrafo
- erro ao salvar cadastro básico de cartão de assinatura
- campos obrigatórios travados na abertura do cartão
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
O cadastro de cartão de assinatura (ficha de autógrafo/firma) registra a qualificação completa, dados documentais e parâmetros civis da pessoa física para subsidiar os atos de reconhecimento de firma e lavratura de escrituras/procurações. O Orion TN disponibiliza buscas inteligentes para reaproveitamento ágil de cadastros pré-existentes na base de dados notarial e validações em tempo real de consistência cadastral.

#### Passo a passo:
1. Acesse o menu principal **Firmas > Cadastros > Cartão de assinatura**.
2. Na tela de gerenciamento de cartões de assinatura, clique no botão **Adicionar**.
3. O sistema abrirá o formulário de cadastro dinâmico com os campos disponíveis para preenchimento.
4. Identifique os campos com asterisco (**\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF ou CIN**, além de eventuais campos customizados pela serventia).
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

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
