---
id: C-GERAL-06
titulo: Persistência Estruturada de Metadados e Validação de Lote Mensal para a DOI
tags:
- DOI
- Receita Federal
- Comunicações Fiscais
- Persistência de Dados
- Lote Mensal
objetivo: Assegurar a correta gravação de metadados obrigatórios na aba específica da Declaração de Operações Imobiliárias (DOI) para evitar campos vazios na exportação do arquivo da Receita.
sinonimos:
- erro ao gerar arquivo da doi
- campos em branco no lote da doi
- gravar metadados da doi no protocolo
- como validar lote da doi no orion
perguntas_usuario:
- Preenchemos todas as informações no protocolo mas na hora de exportar a DOI diz que faltam dados do imóvel, por quê?
- Como salvar os metadados da DOI para que eles não sumam na hora de gerar o arquivo mensal?
- Qual o procedimento correto para validar o lote da DOI antes de transmitir para a Receita Federal?
sintomas_comuns:
- mensagem "Campo Inscrição Municipal / Matrícula não informado" no validador oficial da Receita Federal
- dados digitados na tela de protocolo não são incorporados no arquivo `.DEC` gerado pelo Orion TN
- lote mensal de operações imobiliárias gerado com zero registros mesmo com escrituras lavradas no mês
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O preenchimento descritivo da minuta não alimenta automaticamente a estrutura de tabelas relacionais exigida pela Receita Federal. O Orion TN dispõe de uma aba especializada denominada "DOI / Obrigações Fiscais" dentro do protocolo. Para que os dados sejam exportados no lote mensal, o operador deve acionar a rotina de persistência interna antes do fechamento formal do protocolo.

#### Passo a passo:
1. No Orion TN, acesse o menu **Notas** > **Protocolo** e abra a escritura imobiliária.
2. Navegue até a aba **DOI / Obrigações Fiscais**.
3. Confira o preenchimento rigoroso dos campos específicos:
    - **Inscrição Municipal (IPTU):** Apenas algarismos numéricos, sem pontos, barras ou hífens.
    - **Número da Matrícula e Cartório de Registro de Imóveis (RI) Competente** devidamente selecionado na tabela auxiliar.
    - **Área do Imóvel** e **Unidade de Medida** (m² ou ha).
    - **Forma de Pagamento** (à vista, a prazo, financiamento bancário).
4. Clique no botão interno **Gravar Metadados da DOI** localizado no canto inferior da aba.
5. Em seguida, clique no botão **Salvar Protocolo** principal (`F10`).
6. Para gerar a declaração: Acesse **Comunicações** > **DOI** > clique em **Gerar Lote Mensal**.
7. Selecione o **Mês e Ano de Referência**, acione o botão **Validar Inconsistências** e, se nenhum alerta vermelho for reportado, clique em **Exportar Arquivo (.DEC)**.
8. Abra o programa oficial da Receita Federal (**Declaração sobre Operações Imobiliárias**) e importe o arquivo gerado para transmissão final.

* **Dica:** Gere o lote preliminar da DOI até o dia 20 de cada mês para ter tempo hábil de sanar eventuais cadastros incompletos antes do prazo final da Receita no último dia útil.
---
