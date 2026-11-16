---
id: C-ATOS-03
titulo: Desbloqueio Operacional de Procuração Bloqueada por Vínculo Indevido
tags:
- Procurações
- Substabelecimento
- Revogação
- Desbloqueio
- Anotações
objetivo: Remover apontamentos indevidos de revogação ou substabelecimento que bloquearam a vigência de uma procuração no acervo de buscas.
sinonimos:
- procuração bloqueada no sistema
- substabelecimento cancelou procuração por erro
- desbloquear procuração cancelada
- reativar procuração no índice
perguntas_usuario:
- O sistema bloqueou a procuração depois que lançamos um substabelecimento, como reverter?
- Como tirar a trava de procuração revogada quando a revogação foi lançada no protocolo errado?
- Por que a procuração sumiu da pesquisa de atos válidos?
sintomas_comuns:
- pesquisa de procurações indica ato cancelado sem que tenha havido revogação legal
- escrevente selecionou modalidade de substabelecimento sem reserva em vez de com reserva
- sistema recusa lavrar certidão por bloqueio de eficácia do ato
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Ao registrar anotações marginais de substabelecimento sem reserva ou de revogação, o Orion TN encerra o ciclo de vida do ato primitivo. Se o vínculo foi registrado por equívoco material, o status impeditivo deve ser desfeito.

#### Passo a passo:
1. Acesse o menu **Notas > Pesquisa de Atos / Procurações**.
2. Localize a procuração bloqueada informando Livro e Folha (ou nome do outorgante) e abra o cadastro.
3. Acesse a aba **Anotações Marginais / Vínculos Notariais**.
4. Identifique a linha da anotação extintiva gerada por engano.
5. Com usuário administrador ou tabelião, clique em **Editar Anotação** ou no botão **Excluir Vínculo Indevido**.
6. Na barra de comandos do protocolo, acione a opção **Remover Bloqueio / Reativar Ato**.
7. Confirme a reativação. O ato retornará imediatamente ao status de `Válido / Vigente` no índice.

* **Segurança Jurídica:** Toda exclusão de anotação de cancelamento é registrada na trilha de auditoria do Orion TN para respaldo perante correições.
---
