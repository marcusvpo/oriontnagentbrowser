---
id: V-CCA.3.2
titulo: Impressão da Ficha do Cartão de Assinatura e Destinação de Impressora
tags:
- firmas
- cartao de assinatura
- impressao de ficha
- papel de seguranca
- impressora
- modelo de impressao
objetivo: Emitir a impressão física do cartão de assinatura no modelo configurado da serventia, selecionando a impressora de destino e vinculando dados de segurança.
sinonimos:
- imprimir cartao de assinatura no orion
- imprimir ficha de autografo
- como mandar o cartao de firma para a impressora
- botao imprimir na ficha de firma
- autenticar firma de balcão
perguntas_usuario:
- Como imprimir o cartão de assinatura após cadastrar a pessoa?
- Onde fica o botão Imprimir do cartão de assinatura?
- Como selecionar a impressora para imprimir a ficha de firma?
- Por que não consigo imprimir o cartão antes de salvar?
sintomas_comuns:
- impressora não puxa folha do cartão de assinatura
- impressão da ficha de firma desalinhada
- selecionar impressora padrão para cartão de autógrafos
- como reimprimir ficha de assinatura para cliente assinar
- erro ao enviar cartão de assinatura para impressão
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=567
    video_timestamp: 09:27
    video_start_seconds: 567
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
Após a gravação inicial dos dados cadastrais, consumo do formulário/papel de segurança e aplicação do selo digital, o Orion TN habilita a emissão física do cartão de assinatura. A rotina permite selecionar o modelo gráfico padrão da serventia e direcionar a impressão para a impressora correta de papel de segurança ou formulário contínuo.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de assinatura**.
2. Filtre e abra o cartão de assinatura gravado clicando no ícone da **Caneta** (**Alteração**).
   * **Atenção:** O botão de impressão do cartão pelo menu principal só é liberado na tela de edição após o cartão ter sido gravado previamente no banco de dados.
3. Verifique se os dados cadastrais, o número do papel de segurança e o selo digital (se aplicável) estão devidamente preenchidos.
4. Na barra de ações do formulário, clique no botão **Imprimir**.
5. O sistema exibirá a tela de parâmetros de impressão:
   * **Modelo**: Selecione o layout/modelo padrão de cartão de assinatura adotado pelo cartório.
   * **Impressora**: Selecione a impressora de destino configurada na rede ou estação de trabalho para emissão em papel de segurança.
6. Clique em **Confirmar** (ou **Imprimir**) para enviar o documento para a impressora.
7. Solicite que o titular aponha suas assinaturas físicas e rubricas nos campos delimitados do cartão impresso.
8. Retorne à tela do sistema e clique no botão **Concluir** para finalizar a manutenção do cartão de assinatura.

* **Observação:** É altamente recomendável digitalizar o cartão físico logo após a coleta das assinaturas e anexá-lo à ficha no sistema (conforme rotina de captura de imagens).
---

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
