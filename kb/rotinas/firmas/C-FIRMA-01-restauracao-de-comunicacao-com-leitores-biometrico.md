---
id: C-FIRMA-01
titulo: Restauração de Comunicação com Leitores Biométricos e Câmeras via IntegradorSPCM
tags:
- Firmas
- Biometria
- Futronic
- SecuGen
- IntegradorSPCM
- Webcam
objetivo: Solucionar falhas de captura de impressão digital e fotografia no balcão de firmas restabelecendo o serviço local IntegradorSPCM.
sinonimos:
- leitor biométrico não funciona
- erro na digital e integrador
- câmera não tira foto firma
- integradorspcm parou
perguntas_usuario:
- O leitor biométrico da estação parou de capturar a digital do cliente, como reiniciar?
- Por que o Orion TN diz que não foi possível comunicar com o leitor biométrico?
- A webcam de captura de fotos do balcão não abre no sistema, o que fazer?
sintomas_comuns:
- botão de captura de digital não responde ou exibe erro de timeout
- ícone do IntegradorSPCM sumiu da bandeja do Windows
- 'mensagem: Falha ao invocar componente de biometria local / Porta 8085 inacessível'
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A comunicação entre o navegador web e os dispositivos físicos de balcão (leitores Futronic/SecuGen e webcams) é intermediada pelo aplicativo local IntegradorSPCM executado em Java. Travamentos no processo bloqueiam as leituras.

#### Passo a passo:
1. Na estação de atendimento, verifique a bandeja do sistema do Windows (Systray). Se o ícone do **IntegradorSPCM** estiver ausente ou congelado, encerre o processo via Gerenciador de Tarefas.
2. Desconecte o cabo USB do leitor biométrico e reconecte em uma porta USB traseira da placa-mãe.
3. Acesse o diretório `C:\Siplan\IntegradorSPCM\` e execute o arquivo `IntegradorSPCM.exe` como Administrador.
4. Aguarde a confirmação de inicialização do serviço na porta local.
5. No **Orion TN**, abra o balcão de firmas, vá em **Configurações > Periféricos de Balcão**.
6. Na aba **Biometria**, clique em **Testar Captura** e posicione o dedo no sensor.
7. Na aba **Câmera**, selecione o driver nativo e valide a imagem na tela.

* **Estabilidade:** Não utilize hubs USB sem alimentação própria para conectar leitores biométricos; a oscilação de corrente desativa o sensor ótico.
---
