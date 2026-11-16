---
id: C-CENTRAL-11
titulo: Apontamento de Ato Primitivo em Retificações e Aditamentos para CENSEC RCTO
tags:
- CENSEC
- RCTO
- Retificação
- Aditamento
- Ato Primitivo
- Livro e Folha
objetivo: Vincular Livro, Folha e Data da escritura original em atos de rerratificação para atender às regras de validação do RCTO.
sinonimos:
- erro rcto ato origem não vinculado
- aditamento rejeitado censec
- retificação de escritura censec rcto
- vincular ato primitivo rcto
perguntas_usuario:
- A CENSEC rejeitou a escritura de retificação exigindo os dados do ato original, onde preencher?
- Como vincular o livro e folha da escritura antiga na rerratificação para a CENSEC?
- O que colocar no campo de ato primitivo da carga do RCTO?
sintomas_comuns:
- 'rejeição no RCTO: Ato de retificação/aditamento exige o apontamento do ato primitivo de referência'
- escrevente lavrou escritura de rerratificação sem referenciar o negócio anterior
- carga quinzenal da CENSEC bloqueada
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Registro Central de Testamentos e Outros (RCTO) exige que escrituras que modifiquem negócios pretéritos tragam em seus metadados a remissão exata ao livro, folha e data do ato primitivo retificado.

#### Passo a passo:
1. Abra o protocolo da escritura de rerratificação no menu **Notas > Protocolo**.
2. Navegue até a aba **Dados do Ato / Retificação**.
3. Marque a opção **Este Ato Retifica / Adita Negócio Jurídico Anterior**.
4. Preencha obrigatoriamente os campos:
5. **Livro de Origem**, **Folha de Origem**, **Data da Lavratura Primitiva** e **Cartório de Origem** (se praticado na mesma serventia ou fora).
6. Clique no botão **Salvar Protocolo**.
7. Acesse **Comunicações > CENSEC RCTO**, regenere a carga da quinzena e transmita com aprovação imediata.

* **Normas Notariais:** Esse vínculo digital garante que a central notarial atualize o índice de publicidade com a remissão recíproca entre as escrituras.
---
