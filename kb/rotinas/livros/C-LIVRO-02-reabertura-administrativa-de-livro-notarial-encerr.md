---
id: C-LIVRO-02
titulo: Reabertura Administrativa de Livro Notarial Encerrado Prematuramente com Termos Vagos
tags:
- Livros Notariais
- Encerramento de Livro
- Reabertura de Livro
- Termos Vagos
objetivo: Reverter o encerramento indevido de um livro de termos ou escrituras para permitir a queima integral das posições remanescentes.
sinonimos:
- livro fechado faltando termos
- como reabrir livro encerrado por engano
- cancelar encerramento de livro
- livro de termos sumiu do balcão
perguntas_usuario:
- O livro de termos foi encerrado faltando 4 termos para a capacidade máxima, como reabrir?
- Fechamos o livro de procurações por engano e ainda restavam folhas, como cancelar o termo de encerramento?
- Por que o livro não aparece mais para lavrar atos no balcão?
sintomas_comuns:
- livro encadernado físico possui 500 folhas mas o sistema fechou no número 496
- escreventes impedidos de selecionar o livro ativo no momento da lavratura
- termo de encerramento emitido antes do consumo pleno das páginas
video:
  tem_video: false
modulo: livros
modulo_nome: Livros Notariais e Folhas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando o operador aciona a rotina de encerramento de livro sem atentar para o saldo de folhas vagas, o sistema bloqueia novos atos. O administrador pode cancelar a operação e reabrir o livro.

#### Passo a passo:
1. Com login de administrador ou substituto, acesse **Configurações > Livros Notariais > Cadastro e Encerramento**.
2. Localize o livro que consta com status `ENCERRADO`.
3. Selecione o livro e clique no botão **Ações > Reabrir Livro Notarial / Cancelar Encerramento**.
4. Informe a justificativa formal (ex.: *"Cancelamento de encerramento precoce para consumo dos termos restantes"*).
5. Confirme a operação. O livro retornará ao status de `Aberto / Em Uso`.
6. No balcão, utilize as posições remanescentes até o encerramento da numeração física real.
7. Concluído o lote, acione novamente a rotina formal de encerramento emitindo o respectivo termo.

* **Auditoria:** Sempre confira a numeração do último termo impresso fisicamente antes de homologar o encerramento no sistema.
---
