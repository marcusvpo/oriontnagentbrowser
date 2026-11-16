---
id: C-FIN-08
titulo: Ajuste de Saldo de Abertura de Caixa Incorreto via Suprimento ou Sangria
tags:
- Orion Caixa
- Abertura de Caixa
- Fundo de Troco
- Suprimento
- Sangria
objetivo: Corrigir equívocos de digitação no valor informado como fundo de troco inicial sem violar a rastreabilidade da sessão de caixa.
sinonimos:
- errei o valor da abertura de caixa
- como alterar fundo de troco digitado errado
- caixa com sobra por erro de abertura
- sangria de ajuste
perguntas_usuario:
- O operador digitou R$ 500 em vez de R$ 50 na abertura do caixa e o sistema não deixa editar, como corrigir?
- Como arrumar o fundo de troco inicial sem cancelar a sessão de atendimento?
- Tem como reabrir a tela de abertura de caixa para mudar o saldo inicial?
sintomas_comuns:
- conferência final de turno acusa sobra ou quebra exorbitante no saldo físico
- campo de saldo inicial fica travado em cinza após a confirmação da abertura
- operador cometeu erro de digitação ao inserir zeros no fundo de troco
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por diretriz de auditoria contábil, o valor registrado na abertura de caixa é imutável após ser confirmado. Para neutralizar o erro sem interromper os atendimentos, utilizam-se os lançamentos de compensação.

#### Passo a passo:
1. Caso o operador tenha digitado valor a **MAIOR** que o real no fundo de troco:
2. Acesse o menu **Movimentação > Sangria / Retirada de Caixa**.
3. Informe a quantia excedente (diferença entre o digitado e o real) e, no campo **Histórico**, justifique: *"Ajuste compensatório de erro de digitação na abertura de caixa"* e confirme.
4. Caso o operador tenha digitado valor a **MENOR** que o real:
5. Acesse **Movimentação > Suprimento de Caixa**, lance o montante faltante com a justificativa de complementação de troco e confirme.
6. Verifique na tela de **Conferência de Caixa** que o saldo físico e o teórico tornaram-se idênticos.

* **Auditoria:** Os lançamentos de Suprimento e Sangria possuem numeração de recibo própria e comprovam formalmente a correção para a gerência da serventia.
---
