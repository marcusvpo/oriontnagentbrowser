---
id: V-CCA.1.3
titulo: Captura de Foto Facial, Biometria e Imagem/Digitalização do Cartão de Assinatura
tags:
- firmas
- cartao de assinatura
- captura de foto
- biometria
- scanner
- digitalizacao de ficha
- webcam
objetivo: Capturar e vincular a fotografia facial via webcam, a impressão digital no leitor biométrico e a imagem do cartão físico de assinatura (via arquivo, scanner ou webcam).
sinonimos:
- tirar foto da pessoa no cartao de assinatura
- coletar biometria na ficha de firma
- escanear ficha de autografo
- anexar imagem do cartao de assinatura
- autenticar firma de balcão
perguntas_usuario:
- Como tirar a foto do cliente na tela de cartão de assinatura?
- Como coletar a impressão digital no leitor biométrico para a ficha de firma?
- Como digitalizar o cartão de assinatura diretamente pelo scanner no Orion TN?
- Como anexar um arquivo PDF ou imagem do cartão físico já digitalizado?
- Por que a imagem do cartão de assinatura não ficou salva na ficha?
sintomas_comuns:
- webcam não tira foto para o cartão de assinatura
- leitor biométrico não captura digital da pessoa
- scanner não digitaliza ficha de firma assinada
- imagem do autógrafo ficou borrada ou ilegível
- erro ao anexar assinatura digitalizada no cartão
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=465
    video_timestamp: 07:45
    video_start_seconds: 465
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

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
