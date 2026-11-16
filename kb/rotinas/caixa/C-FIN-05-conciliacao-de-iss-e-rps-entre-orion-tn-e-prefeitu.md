---
id: C-FIN-05
titulo: Conciliação de ISS e RPS entre Orion TN e Prefeitura / Emissor Nacional
tags:
- ISS
- NFS-e
- RPS
- Emissor Nacional
- Prefeitura
- Tributário
objetivo: Solucionar divergências de valores e notas fiscais de serviço entre o fechamento fiscal do Orion TN e o portal municipal.
sinonimos:
- diferença de iss prefeitura
- rps rejeitado emissor nacional
- valor pex não bate com prefeitura
- conciliação de notas fiscais
perguntas_usuario:
- Por que o valor da guia de ISS na prefeitura está diferente do relatório do Orion TN?
- Como cancelar uma NFS-e gerada antecipadamente para ato não lavrado?
- O que fazer quando o lote de RPS é rejeitado pelo Emissor Nacional?
sintomas_comuns:
- relatório PEX aponta valor de ISS diferente da apuração no portal municipal
- RPS transmitido referente a protocolo que ainda está com assinaturas pendentes
- notas fiscais canceladas no sistema permanecem ativas na base da prefeitura
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Divergências fiscais ocorrem frequentemente pela emissão antecipada de RPS antes da conclusão definitiva de escrituras ou pela transmissão em duplicidade com séries de RPS divergentes.

#### Passo a passo:
1. No **Orion Caixa**, emita o relatório em **Relatórios > Notas Fiscais / Listagem de RPS** filtrando o mês de competência.
2. Acesse o portal da **Prefeitura / Emissor Nacional** e extraia o extrato mensal de notas emitidas.
3. Faça o batimento dos números de RPS para identificar as notas divergentes.
4. Para atos não assinados ou cancelados: acesse o portal municipal e execute o **Cancelamento Manual da NFS-e**.
5. No **Orion TN**, em **Configurações > Parâmetros de NFS-e**, padronize a **Série de Emissão** para evitar saltos.
6. Recalcule o relatório em **Relatórios > Fechamento PEX / ISS**.

* **Regra Tributária:** Nunca gere a RPS definitiva antes de coletar todas as assinaturas do ato notarial; o fato gerador tributário consolida-se apenas com a lavratura perfeita.
---
