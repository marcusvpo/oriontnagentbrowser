---
id: V-CCA.3.1
titulo: Geração e Gerenciamento de Selo Digital (Automático e Manual) no Cartão de Assinatura
tags:
- firmas
- cartao de assinatura
- selo digital
- tj
- qr code
- comunicacao pendente
- cancelamento de selo
objetivo: Gerar e gerenciar selos digitais de fiscalização (automático ou manual) com transmissão ao Tribunal de Justiça, cancelamento, reutilização e consulta de QR Code no cartão de assinatura.
sinonimos:
- como selar ficha de firma
- selo digital automatico no cartao de assinatura
- gerar selo manual para cartao de autografo
- ver qr code do selo da ficha
- dar carga de selos
perguntas_usuario:
- Como gerar o Selo Digital para um cartão de assinatura?
- O envio de Selo Digital no cartão de assinatura é obrigatório?
- Como visualizar o QR Code do Selo Digital gerado para o Tribunal de Justiça?
- O que significa o status Comunicação Pendente no Selo Digital?
- Como cancelar ou reutilizar um Selo Digital vinculado à ficha de firma?
sintomas_comuns:
- selo digital não gerou na abertura do cartão
- como gerar selo manual para ficha de firma
- código do selo digital não aparece no cartão de assinatura
- erro ao transmitir selo de abertura de firma ao tribunal
- cancelar ou estornar selo digital de cartão
- sistema avisa que o lote de selos físicos está esgotado ou insuficiente para lavratura
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=634
    video_timestamp: '10:34'
    video_start_seconds: 634
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
O Orion TN permite a aplicação de Selo Digital do Tribunal de Justiça (TJ) no cadastro de cartões de assinatura, com suporte à geração totalmente automática no salvamento da ficha ou acionamento sob demanda (manual). O sistema disponibiliza ferramentas para consulta do QR Code oficial, controle de comunicação com o webservice do TJ, reutilização e cancelamento de selos.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro.
2. Identifique o fluxo de geração de **Selo Digital** configurado na sua serventia:
   * **Fluxo A - Geração Automática**:
     * Caso o sistema esteja parametrizado para geração automática de selos em cartões de assinatura, ao preencher e clicar em **Concluir** no cadastro, o sistema consumirá e gerará o selo digital imediatamente junto ao webservice do TJ.
     * Na tela do cartão, serão exibidos o número do selo, o código de autenticidade e o **QR Code** de validação.
   * **Fluxo B - Geração Manual**:
     * Caso a serventia utilize a geração sob demanda (uma vez que a remessa de selo em cartão de assinatura é facultativa por norma), localize a seção de **Selo Digital** na tela de edição do cartão e clique no botão **Gerar**.
     * O sistema não exigirá seleção de lotes ou números prévios: ele efetuará a geração direta, atribuição de numeração, exibição em tela e comunicação com o Tribunal de Justiça.
3. Tratando o status de comunicação:
   * Em ambiente de teste ou **Homologação** (ou caso haja oscilação momentânea no webservice do tribunal), o selo poderá exibir o status **Comunicação pendente**, indicando que os dados foram gerados localmente e serão transmitidos assim que a conexão com a base de produção do TJ for restabelecida.
4. Para **Gerenciar o Selo Gerado**:
   * **Visualizar QR Code**: Clique no ícone de **QR Code** ao lado do selo para exibir a imagem de validação pública do Tribunal.
   * **Reutilizar Selo**: Caso o selo não vá ser mantido na ficha e as regras do TJ permitam reaproveitamento, acione a opção de reutilização para disponibilizá-lo para outro ato.
   * **Cancelar Selo**: Se a ficha for descartada após a selagem, utilize a opção de cancelamento de selo informando a justificativa para envio ao tribunal.
5. Clique em **Concluir** para salvar as alterações na ficha.

* **Observação:** A obrigatoriedade de transmissão do selo digital para cartões de assinatura varia de acordo com o Provimento da Corregedoria Geral da Justiça de cada Estado, cabendo ao titular da serventia definir a parametrização do sistema (automática, manual ou desativada).
---

* **Dica / Caso Real do 0800:** Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.
