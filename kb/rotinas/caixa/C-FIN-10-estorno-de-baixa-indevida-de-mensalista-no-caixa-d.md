---
id: C-FIN-10
titulo: Estorno de Baixa Indevida de Mensalista no Caixa do Operador e Liquidação em Conta Corrente
tags:
- Mensalistas
- Baixa de Faturas
- Caixa Físico
- Estorno
- Conta Corrente
objetivo: Corrigir faturas de mensalistas baixadas erroneamente como dinheiro em balcão, regularizando o fechamento do caixa e o saldo da empresa.
sinonimos:
- baixa de mensalista entrou no meu caixa
- sobra de caixa fatura mensalista
- estornar pagamento mensalista balcão
- liquidar fatura conta gráfica
perguntas_usuario:
- Baixei o pagamento de uma empresa mensalista no balcão e agora está dando sobra no meu caixa físico, como arrumar?
- Como fazer o estorno de um recebimento de mensalista lançado no operador errado?
- Qual é o local correto para liquidar as faturas pagas por depósito bancário de clientes mensalistas?
sintomas_comuns:
- saldo em dinheiro do caixa do operador fica muito superior ao numerário real na gaveta
- empresa mensalista continua com débito em aberto no faturamento contábil
- operador selecionou espécie Dinheiro em vez de Conta Corrente / Faturamento
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando o atendente recebe a comprovação de pagamento de um mensalista e registra a baixa na tela comum de recebimento de pedidos, o sistema atribui o valor como dinheiro recebido no guichê, em vez de liquidar a conta gráfica.

#### Passo a passo:
1. No **Orion Caixa**, abra a tela de **Movimentações de Caixa** do operador.
2. Localize o lançamento indevido e clique em **Estornar Recebimento de Balcão**.
3. Confirme o estorno informando a justificativa: *"Baixa indevida no balcão - liquidação via faturamento"* (o caixa físico será normalizado imediatamente).
4. Acesse o módulo de faturamento em **Faturamento > Mensalistas > Baixa de Faturas / Conta Corrente**.
5. Localize o cliente conveniado e a respectiva fatura em aberto.
6. Selecione a fatura e acione a rotina **Liquidar Fatura / Depósito em Conta Corrente**, informando a data efetiva da quitação bancária.

* **Organização:** Mantenha os procedimentos de cobrança de mensalistas restritos ao módulo de Faturamento para blindar a tesouraria física do cartório.
---
