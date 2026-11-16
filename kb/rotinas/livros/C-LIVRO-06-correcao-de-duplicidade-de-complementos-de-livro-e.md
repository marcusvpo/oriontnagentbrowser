---
id: C-LIVRO-06
titulo: Correção de Duplicidade de Complementos de Livro e Folha em Lotes de Quinzena
tags:
- Livros Notariais
- Complemento de Folha
- Duplicidade
- CENSEC
- Quinzena
objetivo: Resolver inconsistências de complementos alfanuméricos de folhas (letras ou bis) que bloqueiam o fechamento quinzenal de atos.
sinonimos:
- duplicidade de livro e folha na quinzena
- erro complemento de folha
- folha 100A duplicada
- destravar lote quinzenal livro
perguntas_usuario:
- O fechamento da quinzena acusa duplicidade no livro 420 folha 15, mas os atos são diferentes, como corrigir?
- Como ajustar o complemento de folha para o sistema aceitar atos lavrados no verso e anexo?
- Por que a CENSEC rejeita o lote dizendo que já existe ato com o mesmo livro e folha?
sintomas_comuns:
- 'mensagem ao fechar quinzena: Duplicidade identificada na numeração de Livro e Folha'
- dois atos cadastrados com a mesma folha sem distinção de frente e verso
- bloqueio de geração da remessa eletrônica de escrituras
video:
  tem_video: false
modulo: livros
modulo_nome: Livros Notariais e Folhas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando dois atos ocupam a mesma página física (ex.: ato breve na frente e outro no verso) ou quando há folhas aditadas, é obrigatório utilizar o campo Complemento para garantir a unicidade de chave registral.

#### Passo a passo:
1. Acesse a tela de fechamento em **Notas > Fechamento de Quinzena / Comunicações**.
2. Identifique na mensagem de alerta o número exato do Livro e da Folha em conflito.
3. Abra o protocolo correspondente em **Notas > Protocolo**, aba **Dados do Ato**.
4. No campo **Complemento de Folha**, informe a distinção formal (ex.: `V` para Verso, ou `A` / `B` para subdivisões autorizadas).
5. Salve o protocolo.
6. No ato correlato, assegure que o campo de complemento esteja devidamente preenchido com a especificação recíproca (ex.: `F` para Frente).
7. Retorne à tela de fechamento de quinzena e clique em **Revalidar Numerações**, liberando o lote.

* **Padrão Cadastral:** Padronize o uso de "F" e "V" na serventia para eliminar conflitos de duplicidade em atos com mais de uma lavratura na mesma folha.
---
