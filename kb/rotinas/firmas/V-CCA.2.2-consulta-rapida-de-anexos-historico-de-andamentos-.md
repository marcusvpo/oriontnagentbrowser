---
id: V-CCA.2.2
titulo: Consulta Rápida de Anexos, Histórico de Andamentos e Bloqueio de Ficha
tags:
- firmas
- cartao de assinatura
- anexos
- historico de andamentos
- bloqueio de ficha
- alerta de firma
- tela cheia
objetivo: Consultar indicadores visuais de imagens e fotos, visualizar galeria de anexos em tela cheia, auditar o histórico de alterações da ficha e aplicar bloqueio com motivo de alerta.
sinonimos:
- ver se a ficha tem foto ou imagem
- abrir anexos do cartao de assinatura em tela cheia
- historico de alteracoes do cartao de assinatura
- bloquear ficha de firma nao alfabetizado
- autenticar firma de balcão
perguntas_usuario:
- O que significa o ícone de imagem verde na lista de cartões de assinatura?
- Como abrir e visualizar todos os documentos anexados à ficha em tela cheia?
- Como ver quem alterou o cartão de assinatura e o que foi modificado?
- Como bloquear uma ficha de firma e colocar um aviso para o escrevente no balcão?
- Como fechar a tela de visualização de anexos?
sintomas_comuns:
- ver imagem da ficha de assinatura sem abrir para editar
- como bloquear cartão de assinatura de pessoa falecida
- histórico de quem abriu ou alterou o cartão (andamentos)
- cartão de assinatura bloqueado como consultar motivo
- documento de RG anexado ao cartão não abre
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=286
    video_timestamp: 04:46
    video_start_seconds: 286
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
Cada registro listado na tabela de cartões de assinatura possui atalhos de consulta instantânea e recursos de auditoria. Esta rotina aborda a leitura dos indicadores visuais (presença de imagem e foto), o uso da galeria unificada de anexos em tela cheia, o rastreamento do log de andamentos e a ativação de bloqueios cautelares com alertas operacionais para o balcão de firmas.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de assinatura** e realize o filtro do registro desejado.
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

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
