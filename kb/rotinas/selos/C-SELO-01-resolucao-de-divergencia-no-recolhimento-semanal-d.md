---
id: C-SELO-01
titulo: Resolução de Divergência no Recolhimento Semanal de Selos com o Portal do TJSP
tags:
- Selo Digital
- TJSP
- Recolhimento Semanal
- Fila Offline
- Conferência
objetivo: Sincronizar selos digitais retidos em contingência local e conciliar a quantidade e valores com o portal do Tribunal de Justiça.
sinonimos:
- selo não bate com portal do tj
- divergência recolhimento semanal selos
- selos pendentes de envio tjsp
- reimportar lote selos tj
perguntas_usuario:
- O total de selos no portal do TJSP está diferente do relatório do Orion TN, como conciliar?
- O que fazer quando selos digitais gerados no cartório não sobem para o tribunal?
- Como transmitir a fila de selos offline acumulados para fechar o recolhimento semanal?
sintomas_comuns:
- portal do tribunal acusa quantidade inferior de selos em relação ao relatório interno
- alerta de selos pendentes na fila local do integrador
- risco de divergência na guia de recolhimento semanal do TJ
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Divergências na contagem semanal ocorrem principalmente quando há instabilidade na conexão e o sistema retém requisições em contingência local sem sincronizar o retorno definitivo do tribunal.

#### Passo a passo:
1. No **Orion TN**, acesse o menu **Módulos > Selo Digital > Auditoria / Conferência Semanal**.
2. Filtre o período fiscal exato da semana em apuração (segunda a domingo).
3. Verifique a grade de **Selos com Envio Pendente** ou **Aguardando Retorno**.
4. Clique no botão **Transmitir Fila de Selos Pendentes** para forçar a comunicação síncrona com o webservice do TJ.
5. Caso o portal do TJSP continue desatualizado: acione a rotina **Exportar Arquivo de Remessa Manual** no Orion TN.
6. Acesse o portal do TJSP com certificado digital e efetue a **Reimportação Manual de Lote**, confirmando o aceite.

* **Prazo Legal:** Efetue a auditoria da fila de selos impreterivelmente até as 18h de toda sexta-feira para evitar inconsistências no recolhimento bancário semanal.
---
