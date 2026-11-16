---
id: C-FIN-02
titulo: Liberação de Permissão para Estorno de Recolhimento Definitivo e Recibos
tags:
- Permissões
- Financeiro
- Recolhimento
- Estorno Definitivo
- Perfis de Usuário
objetivo: Configurar o perfil de acesso do colaborador para liberar os botões de estorno de guias de recolhimento e recibos no módulo financeiro.
sinonimos:
- botão de estornar recolhimento apagado
- permissão para estornar guia
- acesso negado ao estornar recibo
- liberar estorno pex
perguntas_usuario:
- Por que o botão de estornar recolhimento definitivo está desabilitado para o meu usuário?
- Como dar permissão para o escrevente estornar guias no Orion Caixa?
- Mensagem de permissão negada ao tentar cancelar recibo financeiro, onde configuro?
sintomas_comuns:
- botão estornar recolhimento acinzentado ou inativo
- 'mensagem de alerta: Usuário sem privilégio para estorno de recolhimento definitivo'
- escrevente depende do tabelião para cancelar qualquer guia lançada por engano
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O privilégio de desfazimento contábil de recolhimentos definitivos é restrito por padrão. Quando um colaborador necessita operar retificações no caixa, a permissão deve ser concedida no perfil e a sessão precisa ser renovada.

#### Passo a passo:
1. Com login de administrador ou tabelião, acesse no **Orion TN** o menu **Configurações > Perfis de Acesso / Usuários**.
2. Localize e edite o perfil do colaborador (ex.: **Escrevente / Caixa**).
3. Na árvore de módulos, expanda **Financeiro > Orion Caixa > Recolhimento**.
4. Marque as opções **Permitir Estorno de Recolhimento Definitivo** e **Permitir Estorno de Recibo**.
5. Clique no botão **Gravar / Salvar**.
6. Solicite ao usuário que realize obrigatoriamente **Logoff** do sistema e efetue um novo **Login** para carregar os novos tokens de segurança.

* **Boas Práticas:** A alteração de perfis de acesso no Orion TN só surte efeito na estação após o escrevente encerrar e reabrir a sessão do navegador.
---
