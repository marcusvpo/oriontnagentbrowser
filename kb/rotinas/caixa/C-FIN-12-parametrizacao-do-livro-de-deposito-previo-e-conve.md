---
id: C-FIN-12
titulo: Parametrização do Livro de Depósito Prévio e Conversão em Emolumento Definitivo
tags:
- Depósito Prévio
- Livro Depósito Prévio
- Sobra de Custas
- Conversão de Receita
objetivo: Configurar rubricas de adiantamento financeiro para escrituras e efetuar a conversão precisa em receita definitiva após a lavratura.
sinonimos:
- livro depósito prévio com erro
- saldo a devolver errado protocolo
- converter depósito prévio em custas
- adiantamento de escritura
perguntas_usuario:
- O relatório do Livro de Depósito Prévio não imprime e acusa erro de cálculo, o que verificar?
- Como converter o adiantamento pago pelo cliente em emolumentos definitivos da escritura?
- Por que o saldo a devolver está saindo com valor negativo no fechamento da escritura?
sintomas_comuns:
- relatório do Livro Oficial de Depósito Prévio não bate com os protocolos abertos
- lançamento de adiantamento foi cadastrado como receita avulsa em vez de depósito prévio
- acréscimos de matrícula incidindo sobre o depósito em vez dos emolumentos
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Os valores recebidos antecipadamente para despesas e certidões devem ser escriturados no Livro de Depósito Prévio sob estrito regime de custódia. Após a conclusão do ato, a quantia consumida deve ser convertida e o saldo restante restituído à parte.

#### Passo a passo:
1. No **Orion Caixa**, acesse **Administração > Parâmetros > Tipos de Movimentação**.
2. Assegure que a rubrica de adiantamento esteja associada ao tipo **Depósito Prévio**.
3. No **Orion TN**, abra o ato em **Notas > Protocolo**, aba **Financeiro / Custas**.
4. Ao finalizar a escritura e apurar o custo total real, clique no botão **Converter Depósito em Emolumento Definitivo**.
5. O sistema baixará o crédito do Livro de Depósito Prévio e lançará a receita definitiva de emolumentos.
6. Se houver resíduo, clique em **Emitir Recibo de Devolução de Saldo** para respaldar a entrega do troco ao apresentante.

* **Corregedoria:** Manter o Livro de Depósito Prévio atualizado diariamente é exigência expressa do Provimento CNJ nº 149/2023.
---
