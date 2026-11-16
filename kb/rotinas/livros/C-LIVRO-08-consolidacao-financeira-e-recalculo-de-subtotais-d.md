---
id: C-LIVRO-08
titulo: Consolidação Financeira e Recálculo de Subtotais do Livro Caixa / LCW após Encerramento
tags:
- LCW
- Livro Caixa
- Consolidação
- Subtotais
- Fechamento Contábil
objetivo: Recalcular e consolidar subtotais de receitas e despesas no Livro Caixa quando lançamentos extemporâneos forem inseridos após o fechamento preliminar.
sinonimos:
- subtotais do livro caixa não conferem
- recálculo livro diário lcw
- diferença nos subtotais do lcw
- consolidar livro caixa
perguntas_usuario:
- Os subtotais do relatório do Livro Caixa no LCW não estão batendo com o fechamento, como recalcular?
- Como rodar a ferramenta de consolidação de valores contábeis no Orion TN?
- Lançamos uma despesa após fechar o livro caixa e o saldo ficou desalinhado, o que fazer?
sintomas_comuns:
- soma das colunas de receitas e despesas não fecha com o saldo transportado para o dia seguinte
- lançamento de despesa ou estorno efetuado após a impressão prévia do livro
- divergência nos relatórios contábeis de auditoria mensal
video:
  tem_video: false
modulo: livros
modulo_nome: Livros Notariais e Folhas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Se houver inserção ou estorno de lançamentos financeiros em datas pretéritas já consolidadas, os saldos progressivos acumulados sofrem defasagem. É indispensável acionar a consolidação matemática.

#### Passo a passo:
1. No **Orion Caixa**, acesse o menu **Administração > Rotinas Especiais > Consolidação de Movimentações**.
2. Informe a data inicial a partir da qual houve a alteração do lançamento extemporâneo.
3. Marque a opção **Recalcular Saldos Diários e Subtotais Progressivos**.
4. Clique no botão **Executar Consolidação** e aguarde o processamento completo.
5. Acesse o módulo **LCW (Livro Caixa Web)** ou a rotina de emissão do Livro Diário.
6. Gere novamente o relatório contábil do período.
7. Confirme que todos os subtotais e transportes de página passaram a refletir a soma exata.

* **Boas Práticas Contábeis:** Execute a consolidação de movimentações sempre no último dia útil do mês antes da emissão definitiva dos balancetes.
---
