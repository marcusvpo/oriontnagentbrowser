---
id: V-CCA.1.3
titulo: 'Captura de Foto Facial, Biometria e Imagem/Digitalização do Cartão de Assinatura'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_dados_banco
  carga: mutation
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** Rotina dedicada exclusivamente à captura de foto facial (webcam), coleta biométrica (leitor digital) e digitalização (scanner/webcam).

#### Descrição:
O painel lateral direito da tela de Cartão de Assinatura concentra os recursos de captura e conferência multimídia e biométrica do comparecente: registro fotográfico facial por webcam, coleta de impressão digital em leitor biométrico homologado e inserção da imagem da ficha de autógrafo física (por importação de arquivo do Windows, captura direta via scanner TWAIN ou foto pela webcam).

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
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

* **ATENÇÃO (Passo Obrigatório): Em qualquer uma das três modalidades de captura (pasta, scanner ou foto), é estritamente obrigatório clicar no botão **Concluir** da tela de captura para efetivar a vinculação da imagem à ficha.**
* **Observação: Se você capturar a imagem pelo scanner ou importar o arquivo e fechar a janela sem clicar em **Concluir**, o vínculo da imagem será descartado e o cartão constará sem imagem na listagem do sistema.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
