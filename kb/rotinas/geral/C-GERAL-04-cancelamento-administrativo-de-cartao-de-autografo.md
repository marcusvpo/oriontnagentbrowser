---
id: C-GERAL-04
titulo: Cancelamento Administrativo de Cartão de Autógrafo Duplicado e Reposicionamento Sequencial
tags:
- Balcão de Firmas
- Ficha de Autógrafo
- Duplicidade
- Numeração Sequencial
- Auditoria
objetivo: Inativar com segurança fichas de firma abertas em duplicidade para o mesmo titular e reajustar o contador automático para reaproveitar a numeração sem violar a auditoria notarial.
sinonimos:
- cartão de assinatura duplicado
- como excluir ficha de firma aberta duas vezes
- ajustar número do último cartão de firma
- cancelar cartão de autógrafo no orion
perguntas_usuario:
- Um atendente abriu duas vezes o cartão de firma para o mesmo cliente, como cancelo o duplicado?
- O sistema não deixa apagar um cartão de assinatura, o que devo fazer?
- Como volto o contador do número de ficha de firma para não dar salto de numeração no fichário?
sintomas_comuns:
- duas fichas com números sequenciais distintos cadastradas com a mesma imagem de assinatura e mesmo CPF
- buraco ou salto na numeração física dos cartões de autógrafo arquivados na serventia
- sistema bloqueia tentativa de exclusão física do registro para proteger a trilha de segurança do balcão
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Em virtude de normativas da Corregedoria Geral da Justiça, fichas de assinatura e cartões de autógrafo possuem numeração sequencial perpétua e não podem ser deletados fisicamente do banco de dados. Caso uma abertura duplicada ocorra por desatenção, o procedimento correto consiste em inativar a ficha excedente com justificativa formal e retroagir o contador de numeração se a ficha física ainda não tiver sido utilizada.

#### Passo a passo:
1. Acesse o menu **Balcão de Firmas** > submenu **Fichas / Cartões de Assinatura**.
2. Localize a ficha gerada indevidamente em duplicidade (ex: Cartão nº `25.401`) e clique no botão **Alterar**.
3. Na tela de cadastro, altere o campo **Situação / Status** de *Ativo* para **Cancelado / Inativo por Erro Operacional**.
4. No campo **Observações / Justificativa Interna**, registre o motivo circunstanciado: *"Ficha cancelada administrativamente por duplicidade de abertura referente ao CPF [número], cujo autógrafo válido consta no Cartão nº [número-correto]"*.
5. Clique no botão **Salvar**.
6. Para restaurar a sequência mecânica: Acesse o menu **Configurações** > **Parâmetros do Módulo Firmas** > aba **Numeração e Sequenciamento**.
7. No campo **Último Cartão Utilizado**, retroaja o contador para o número imediatamente anterior (ex: altere de `25.401` para `25.400`) apenas se a ficha subsequente ainda não tiver sido selada.
8. Clique em **Salvar Parâmetros** para que o próximo cidadão atendido assuma o número sem abrir lacunas no arquivo físico.

* **Dica:** Mantenha o campo de busca por CPF sempre ativo como primeira ação no balcão antes de iniciar qualquer abertura de firma, prevenindo a duplicação na origem.
---
