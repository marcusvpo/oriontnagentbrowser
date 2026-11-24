---
id: C-LIVRO-01
titulo: Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livro Notarial
tags:
- Livros Notariais
- Salto de Folhas
- Inutilização
- Folha Sem Efeito
- Auditoria
objetivo: Registrar a inutilização formal de folhas soltas saltadas acidentalmente durante a impressão de escrituras no livro encadernado.
sinonimos:
- pulei folha do livro de notas
- como inutilizar folha no sistema
- declarar folha sem efeito
- salto de página livro encadernado
perguntas_usuario:
- A impressora puxou duas folhas juntas e pulamos a folha 89 verso e 90 frente do livro, como regularizar?
- Como declarar uma folha sem efeito no Orion TN para a quinzena bater?
- O que fazer no sistema quando uma folha de livro notarial é danificada?
sintomas_comuns:
- impressora puxou folhas em duplicidade gerando lacuna na paginação do livro físico
- sistema acusa divergência entre a numeração do livro e os protocolos lavrados
- necessidade de certidão formal de inutilização para fins de correição judicial
video:
  tem_video: false
modulo: livros
modulo_nome: Livros Notariais e Folhas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A continuidade cronológica dos livros notariais é princípio basilar. Havendo salto ou avaria física de folha, o Orion TN permite registrar a inutilização com certidão circunstanciada, preservando a trilha contábil e fiscal.

#### Passo a passo:
1. Acesse o menu **Administração > Controle de Livros**.
2. Selecione o Livro Notarial ativo no qual ocorreu o salto.
3. Na grade de controle de páginas, localize as folhas que ficaram em branco (ex.: Folha 089 V e Folha 090 F).
4. Selecione as páginas correspondentes e clique no botão **Ações > Inutilizar Folha / Declarar Sem Efeito**.
5. No campo **Justificativa Legal**, digite a certidão (ex.: *"Folha inutilizada por erro material de alimentação mecânica da impressora"*).
6. Confirme a operação. O status da página passará para `INUTILIZADA`.
7. No protocolo da escritura seguinte, confirme que o sistema assumiu automaticamente a primeira folha útil posterior.

* **Corregedoria:** Imprima o termo de inutilização do sistema e arquive-o junto ao livro encadernado para exibição ao Juiz Corregedor Permanente.
---
