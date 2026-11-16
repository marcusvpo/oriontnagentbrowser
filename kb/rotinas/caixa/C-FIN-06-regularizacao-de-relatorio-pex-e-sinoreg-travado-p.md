---
id: C-FIN-06
titulo: Regularização de Relatório PEX e Sinoreg Travado por Recibo Estornado Pendente
tags:
- Sinoreg
- PEX
- Recibo Estornado
- Fechamento Semanal
- Conciliação
objetivo: Regularizar protocolos que tiveram recibos estornados mas não foram concluídos, destravando a geração do arquivo Sinoreg.
sinonimos:
- protocolo estornado travando pex
- erro fechamento sinoreg
- recibo estornado pendente
- diferença relatório pex
perguntas_usuario:
- Estornei um recibo e agora o relatório do PEX acusa erro e não deixa fechar a semana do Sinoreg, como resolver?
- Como localizar protocolos com recibos estornados que ficaram abandonados no sistema?
- O que fazer quando o fechamento do Sinoreg acusa divergência de centavos no protocolo?
sintomas_comuns:
- 'mensagem no PEX: Existem protocolos com situação fiscal pendente no período'
- valor apurado para o Sinoreg diverge do caixa físico
- escrevente cancelou o recibo para ajustar o ato e esqueceu de gerar o novo pagamento
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando um recibo é estornado no caixa para correção de custas e o operador abandona o protocolo sem gerar o novo recebimento, o Orion TN trava o fechamento contábil para evitar omissão de receita fiscal perante o tribunal.

#### Passo a passo:
1. Identifique o número do protocolo exibido na mensagem de bloqueio do relatório PEX.
2. No **Orion TN**, acesse **Notas > Protocolo**, abra o ato e confira as custas na aba **Custas / Emolumentos**.
3. No **Orion Caixa**, acesse **Controle de Caixa > Recebimento de Protocolo**, realize a baixa financeira e emita o **Recibo Definitivo**.
4. Retorne à tela de **Relatórios > Relatório PEX / Fechamento Sinoreg**.
5. Acione o botão **Recalcular / Atualizar Informações**.
6. Confirme a zeragem da divergência e faça a geração do arquivo de remessa.

* **Dica Prática:** Sempre que estornar um recibo para alterar dados de minuta, conclua o novo recebimento imediatamente para não bloquear o plantão de fechamento da serventia.
---
