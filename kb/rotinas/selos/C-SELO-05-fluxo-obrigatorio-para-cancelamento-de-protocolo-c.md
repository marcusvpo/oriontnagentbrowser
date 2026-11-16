---
id: C-SELO-05
titulo: Fluxo Obrigatório para Cancelamento de Protocolo com Selo Digital já Gerado
tags:
- Cancelamento
- Protocolo
- Selo Digital
- Estorno de Custas
- Desistência
objetivo: Executar o cancelamento encadeado de escrituras ou atos em que o selo já foi gerado na minuta, preservando a auditoria da Corregedoria.
sinonimos:
- como cancelar protocolo com selo
- sistema não deixa excluir ato selado
- desistência de escritura com selo
- cancelamento encadeado de selo
perguntas_usuario:
- O cliente desistiu da escritura mas o selo já foi colocado na minuta, como cancelar o protocolo?
- Por que o sistema diz que o protocolo possui selo vinculado e não pode ser excluído?
- Qual é a ordem certa para anular um ato que já teve selo emitido?
sintomas_comuns:
- 'mensagem: Bloqueio de integridade: protocolo possui selo vinculado e não pode ser excluído'
- escrevente tenta apagar o protocolo diretamente pelo botão Excluir e recebe erro
- selo corre risco de ficar pendente sem destinação formal
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por determinação normativa, uma vez atribuído o selo digital, o ato entra na cadeia de custódia pública. O Orion TN exige a inutilização formal do selo antes de permitir que o protocolo mude para Cancelado.

#### Passo a passo:
1. No menu **Notas**, localize e abra o **Protocolo** que será cancelado.
2. Navegue até a aba **Custas / Selos**.
3. Na grade de selos emitidos, selecione o selo e acione o botão **Estornar Selo** (justifique a desistência da parte).
4. Ainda na aba de custas, clique sobre a linha dos emolumentos e acione **Excluir Lançamento de Custas**.
5. Após o selo e as custas estarem estornados, retorne à aba principal de **Dados do Protocolo**.
6. Altere o campo **Status do Ato** para **Cancelado / Desistido** e clique em **Salvar**.
7. O sistema registrará a inutilização do selo e transmitirá o evento de cancelamento no fechamento do lote.

* **Norma Notarial:** Nunca rasgue ou delete dados sem registrar o motivo do cancelamento; a Corregedoria audita rigorosamente selos sem atos lavrados.
---
