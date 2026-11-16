---
id: C-FIN-01
titulo: Estorno Encadeado de Recibo com Guia de Recolhimento Definitiva (PEX) Emitida
tags:
- Financeiro
- Caixa
- Estorno
- Recibo
- Guia PEX
- Sinoreg
- Protocolo
objetivo: Orientar o procedimento obrigatório de estorno encadeado quando o recibo financeiro está bloqueado devido à prévia emissão da guia de recolhimento definitiva.
sinonimos:
- estornar recibo com guia emitida
- não consigo estornar recibo
- erro guia emitida estorno
- estorno encadeado pex
perguntas_usuario:
- Como faço para estornar um recibo que já teve a guia PEX emitida?
- O sistema diz que o recibo teve a guia de recolhimento emitida e não deixa estornar, o que fazer?
- Qual é a ordem correta para estornar um protocolo concluído no caixa e retificar custas?
sintomas_comuns:
- 'mensagem: Não é possível realizar o estorno, pois este pedido teve a guia de recolhimento emitida'
- escrevente precisa retificar partes ou custas mas o recibo está travado
- botão de estornar recibo bloqueia a ação por pendência de cancelamento de guia
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
No Orion TN, a integridade fiscal impede o estorno direto de recibos cujas taxas estaduais (PEX/Sinoreg) já foram apuradas em guia definitiva. Para desbloquear a edição do protocolo e das custas, o operador deve seguir uma cadeia estrita e reversível de estornos.

#### Passo a passo:
1. No **Orion Caixa** (ou no menu **Recolhimento** do Orion TN), acesse **Guias > Guias de Recolhimento Definitivas (PEX)**.
2. Localize a guia gerada para o protocolo e selecione a opção **Estornar Guia de Recolhimento**.
3. Em seguida, no **Orion Caixa**, acesse o menu **Administração > Controle de Caixa > Recibos**.
4. Pesquise o recibo pelo número do protocolo correspondente e clique no botão **Estornar Recibo**.
5. No **Orion TN**, abra o protocolo através de **Notas > Protocolo**, aplique as retificações necessárias nas custas ou na qualificação e salve.
6. Conclua o ato novamente, envie ao caixa, emita o novo **Recibo** definitivo e processe a nova **Guia de Recolhimento**.

* **Alerta Operacional:** Nunca tente reabrir o protocolo no Notas sem antes cancelar a guia PEX e o recibo no Caixa; essa sequência evita divergências no fechamento semanal do Sinoreg.
---
