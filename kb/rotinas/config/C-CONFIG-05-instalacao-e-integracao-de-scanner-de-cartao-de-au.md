---
id: C-CONFIG-05
titulo: Instalação e Integração de Scanner de Cartão de Autógrafo via DocuVieware e Driver TWAIN
tags:
- Scanner
- DocuVieware
- TWAIN
- Balcão de Firmas
- Digitalização
objetivo: Instalar e parametrizar o componente de captura DocuVieware com drivers TWAIN nativos para digitalização e visualização de fichas de assinatura no Balcão de Firmas.
sinonimos:
- instalar scanner de ficha de firma
- erro no docuvieware ao escanear
- configurar scanner twain no orion
- sistema não acha scanner para digitalizar ficha
perguntas_usuario:
- Compramos um scanner novo para as fichas de firma, como faço o Orion TN reconhecer ele?
- Ao tentar escanear o cartão de autógrafo aparece erro do DocuVieware, como consertar?
- Qual driver de scanner deve ser usado para digitalização no balcão de firmas?
sintomas_comuns:
- mensagem "Componente DocuVieware não registrado ou serviço inacessível" ao clicar em Digitalizar Ficha
- janela de seleção de scanner exibe fontes WIA mas não lista a fonte nativa TWAIN do fabricante
- travamento com encerramento inesperado do Orion TN no momento do disparo da captura de imagem
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Orion TN integra-se a digitalizadores de documentos utilizando o motor DocuVieware, que exige drivers compatíveis com o padrão TWAIN de 32 bits. Caso o scanner esteja operando apenas com drivers WIA genéricos do Windows ou o instalador do componente DocuVieware não tenha sido executado com privilégios de administrador, a comunicação será interrompida.

#### Passo a passo:
1. Instale o pacote completo de drivers fornecido pelo fabricante do scanner (Fujitsu, Kodak, Epson, Canon), garantindo a instalação expressa do driver **TWAIN**.
2. Localize e execute o instalador da biblioteca oficial disponibilizado pela Siplan: `DocuViewareServiceSetup.msi` clicando com o botão direito e selecionando **Executar como Administrador**.
3. Concluída a instalação, reinicie a estação de trabalho para carregar os serviços e registrar os componentes ActiveX.
4. Abra o Orion TN e navegue até **Balcão de Firmas** > menu **Configurações de Captura e Imagens**.
5. No campo **Fonte de Digitalização Padrão**, selecione a opção que inicia com o prefixo **TWAIN:** (ex: *TWAIN: fi-7160*). Evite selecionar opções com prefixo WIA.
6. Defina a **Resolução Padrão** como `300 DPI`, o **Modo de Cor** como `Tons de Cinza` ou `Preto e Branco (1 bit)` e o alimentador como `Mesa Plana (Flatbed)` ou `Alimentador Automático (ADF)`.
7. Clique no botão **Testar Digitalização**, confira a renderização nítida da imagem e acione **Gravar como Padrão**.

* **Dica:** Para fichas de autógrafo, a resolução de 300 DPI em tons de cinza oferece a proporção perfeita entre nitidez microscópica dos traços da assinatura e leveza de armazenamento no banco de dados.
---
