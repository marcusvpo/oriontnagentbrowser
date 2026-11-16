---
id: C-FIN-11
titulo: Tratamento de Faturas de Mensalistas Abaixo do Limite Bancário (< R$ 50) e Alerta de Bloqueio
tags:
- Mensalistas
- Limite Bancário
- Boletos
- Bloqueio de Inadimplente
- Cobrança
objetivo: Administrar faturas com valores inferiores à régua mínima de emissão de boletos bancários e configurar travas preventivas contra clientes inadimplentes.
sinonimos:
- boleto menor que 50 reais
- banco recusa boleto valor baixo
- bloquear cliente devedor mensalista
- aviso de inadimplência no protocolo
perguntas_usuario:
- O banco não aceita registrar boleto com valor menor que R$ 50, como faturar o mensalista?
- Como configurar o sistema para avisar na tela quando um mensalista estiver com faturas atrasadas?
- Posso acumular faturas de mensalistas de pequeno valor para o mês seguinte no Orion TN?
sintomas_comuns:
- 'rejeição bancária: Valor do título inferior ao limite mínimo permitido pelo emissor'
- escreventes continuam atendendo empresas inadimplentes por falta de aviso visual
- custo do boleto supera o valor dos próprios serviços notariais praticados
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
As normas da Febraban impedem o registro de boletos de cobrança de valores irrisórios. Além disso, o Orion TN oferece parametrização para alertar os escreventes caso o conveniado possua faturas pretéritas em aberto.

#### Passo a passo:
1. Para faturas **abaixo de R$ 50,00**:
2. No **Orion Caixa**, acesse **Faturamento > Mensalistas > Conta Corrente**, selecione o cliente e opte por acumular o débito para a competência seguinte ou receba via PIX avulso lançando a liquidação manual.
3. Para ativar o **Alerta / Bloqueio de Inadimplência**:
4. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Mensalistas**.
5. Localize o cliente e clique em **Editar**.
6. Marque a opção **Bloquear Atendimento** e digite a mensagem de advertência (ex.: *"CONVÊNIO SUSPENSO: Contatar setor financeiro"*).
7. Clique em **Gravar**. O alerta surgirá em pop-up impeditivo ao digitar o CNPJ em qualquer protocolo.

* **Gestão Financeira:** O bloqueio automático evita novos atos a prazo para empresas com débitos pendentes há mais de 30 dias.
---
