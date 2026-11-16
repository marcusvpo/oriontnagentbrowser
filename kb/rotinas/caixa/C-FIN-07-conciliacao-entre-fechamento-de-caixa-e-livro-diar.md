---
id: C-FIN-07
titulo: Conciliação entre Fechamento de Caixa e Livro Diário / LCW por Atos Retroativos
tags:
- LCW
- Livro Diário
- Livro Caixa
- Competência
- Fechamento
objetivo: Ajustar divergências entre o saldo físico do fechamento de caixa e o relatório contábil do LCW causadas por atos com lavratura retroativa.
sinonimos:
- caixa não bate com lcw
- livro diário divergente do caixa
- atos retroativos lcw
- conciliação contábil
perguntas_usuario:
- Por que o saldo do Livro Diário no LCW está diferente do fechamento de caixa do Orion TN?
- Como conciliar atos que foram lavrados no fim do mês anterior e pagos no mês atual?
- Relatório do Livro Caixa Web não bate com os relatórios diários de balcão, onde está o erro?
sintomas_comuns:
- LCW registra faturamento superior ou inferior ao caixa do mês
- atos praticados em competências distintas geram desencontro no livro diário
- pedidos de firmas mantidos em status Pendente virando o mês contábil
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Livro Diário obedece ao regime de competência legal (data da lavratura do ato), enquanto o Caixa obedece ao regime financeiro (data da entrada do valor). Atos lavrados em um mês e recebidos em outro criam distorções no batimento.

#### Passo a passo:
1. No **Orion TN**, acesse **Relatórios > Pedidos Pendentes** e certifique-se de que nenhum ato de balcão ficou aberto.
2. No **Orion Caixa**, emita o relatório em **Relatórios > Conciliação Caixa vs. Livro Diário** filtrando o mês de apuração.
3. Isole os atos onde a **Data do Ato** diverge da **Data de Baixa no Caixa**.
4. No caso de erro operacional de lançamento: estorne a movimentação e lance com a data de competência correta.
5. No aplicativo **LCW (Livro Caixa Web)**, acesse **Movimentações > Atualizar Integração** para forçar a sincronização de dados.
6. Reimprima o livro contábil conferido.

* **Norma Notarial:** Para evitar descompassos fiscais perante a Corregedoria, nunca deixe a baixa financeira de escrituras lavradas para o mês subsequente.
---
