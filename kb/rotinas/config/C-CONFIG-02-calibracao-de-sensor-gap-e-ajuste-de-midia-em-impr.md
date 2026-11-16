---
id: C-CONFIG-02
titulo: Calibração de Sensor Gap e Ajuste de Mídia em Impressoras Térmicas Zebra, Argox e Elgin
tags:
- Impressoras
- Zebra
- Argox
- Elgin
- Calibração de Etiquetas
- Hardware
objetivo: Corrigir desalinhamento de etiquetas térmicas de reconhecimento de firma que dividem o texto em duas mídias ou saltam etiquetas em branco por descalibração do sensor ótico.
sinonimos:
- impressora zebra pulando etiqueta
- etiqueta de firma saindo dividida em duas
- calibrar sensor gap da impressora térmica
- ajustar tamanho do rolo na zebra
perguntas_usuario:
- Por que a impressora Zebra está dividindo o texto do reconhecimento em duas etiquetas?
- Como calibro a impressora Elgin que fica jogando etiquetas em branco fora?
- O texto da etiqueta está saindo fora do papel, onde configuro as medidas do rolo?
sintomas_comuns:
- impressora térmica puxa uma etiqueta impressa pela metade e para na metade da próxima etiqueta
- luz indicadora de status (*Status LED*) da impressora pisca em vermelho acusando erro de mídia
- desperdício excessivo de etiquetas por salto de 2 a 3 mídias em branco a cada autenticação
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
As impressoras térmicas (Zebra ZD220/GC420, Argox OS-214 e Elgin L42 Pro) dependem de um feixe de luz ótico que detecta o espaço (*gap*) entre uma etiqueta adesiva e a seguinte. Quando o rolo de etiquetas é trocado por um de espessura diferente ou quando as propriedades de impressão no Windows estão configuradas como contínuas (sem intervalos), a impressora perde a referência física de parada.

#### Passo a passo:
1. No Windows, acesse **Painel de Controle** > **Dispositivos e Impressoras**.
2. Localize a impressora térmica em uso (ex: *Zebra ZD220*), clique com o botão direito e selecione **Preferências de Impressão**.
3. Na aba **Configuração de Página**, certifique-se de que a largura e altura reflitam com exatidão a etiqueta física medida na régua (ex: Largura: `100 mm` | Altura: `50 mm`).
4. Navegue até a aba **Configurações do Estoque / Tipo de Mídia** e altere o modo para **Etiquetas com Intervalos (Web / Gap)** (nunca deixe em "Mídia Contínua").
5. Na impressora física com as etiquetas devidamente travadas pelas guias centrais: Pressione e mantenha pressionado o botão **Feed** até a luz de status piscar em ciclos de 2 vezes consecutivas e solte-o para iniciar a **Auto-Calibração de Mídia**.
6. A impressora ejetará 2 a 3 etiquetas para leitura ótica do espaço e parará exatamente na linha de corte picotada.
7. No Orion TN, imprima uma etiqueta de teste para homologar a centralização perfeita do texto.

* **Dica:** Mantenha a cabeça térmica e a lente do sensor ótico limpas utilizando uma haste flexível levemente umedecida em álcool isopropílico para evitar acúmulo de poeira e cola adesiva.
---
