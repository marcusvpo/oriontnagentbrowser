---
id: C-CENTRAL-12
titulo: Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor de Texto
tags:
- DOI
- Receita Federal
- Validador RFB
- Rastreamento de Erro
- Troubleshooting
objetivo: Rastrear e decifrar as linhas de erro apontadas pelo programa validador da Receita Federal a partir do arquivo bruto da DOI.
sinonimos:
- como achar erro da doi
- validador receita dá linha sem livro folha
- descobrir qual protocolo deu erro na doi
- erro registro alienação rfb
perguntas_usuario:
- O validador da DOI acusa erro na linha 142 mas não diz qual escritura é, como descobrir o protocolo?
- Como localizar o ato com problema dentro do arquivo gerado da DOI?
- O programa da Receita Federal rejeitou o lote com código críptico, como resolver?
sintomas_comuns:
- relatório do programa validador da RFB informa apenas o número do registro/linha no arquivo
- escrevente não sabe qual das 50 escrituras do mês precisa de correção
- dificuldade para associar os avisos do validador aos protocolos do Orion TN
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O software validador oficial da Receita Federal para a DOI é legado e não exibe Livro e Folha no log de inconsistências. É necessário abrir o arquivo estruturado para cruzar o número de ordem com o protocolo.

#### Passo a passo:
1. Anote o **Número da Linha / Registro** apontado no relatório de erro do programa da Receita Federal (ex.: Linha `142`).
2. Localize o arquivo gerado da DOI (geralmente salvo na pasta `C:\Siplan\DOI\` ou Downloads com extensão `.txt` ou `.dec`).
3. Abra o arquivo utilizando o **Notepad++** ou **Bloco de Notas** do Windows.
4. Pressione `Ctrl + G` e digite o número da linha correspondente ao erro.
5. No início dessa linha ou no registro de controle imediatamente anterior, localize o campo de identificação que contém o **Número do Protocolo** ou a data de lavratura.
6. Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Protocolo**.
7. Acesse a aba **Imóveis** ou **Partes** e aplique a correção do dado faltante indicado pela Receita.
8. Exporte o lote novamente e revalide no programa oficial.

* **Dica de Especialista:** Utilizar editores de texto com numeração de linhas facilita em 100% a localização de falhas em grandes arquivos de obrigações fiscais.
---
