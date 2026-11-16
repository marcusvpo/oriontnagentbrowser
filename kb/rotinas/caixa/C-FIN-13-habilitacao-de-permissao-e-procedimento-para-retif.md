---
id: C-FIN-13
titulo: Habilitação de Permissão e Procedimento para Retificação de Data de Recibo
tags:
- Recibo
- Retificação de Data
- Permissões
- Orion Caixa
- Competência Fiscal
objetivo: Orientar a concessão de privilégios de segurança e o procedimento para alterar a data de emissão de um recibo financeiro já emitido.
sinonimos:
- mudar data do recibo
- campo data do recibo desabilitado
- permissão alterar data recibo
- ajustar competência de recibo
perguntas_usuario:
- Preciso mudar a data de um recibo para bater com a data da escritura, mas o campo está cinza, o que fazer?
- Onde libero permissão para o usuário poder alterar a data de recibos?
- Como retificar a data de pagamento no Orion Caixa dentro do mês vigente?
sintomas_comuns:
- campo de data de emissão bloqueado para edição na tela de recibos
- 'mensagem: Usuário não possui autorização para alterar a data de emissão de recibos'
- divergência entre a data de lavratura do ato e a data de escrituração do recibo
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Para resguardar a ordem cronológica do caixa e evitar alterações extemporâneas não autorizadas, o campo de data de recibo exige permissão específica concedida pelo administrador da serventia.

#### Passo a passo:
1. Com usuário administrador, acesse no **Orion TN** o menu **Configurações > Usuários / Perfis de Acesso**.
2. Selecione o perfil do colaborador, expanda a seção **Orion Caixa** e marque a opção **Permitir alteração de data do recibo**.
3. Clique em **Gravar** e solicite que o operador reinicie sua sessão no sistema.
4. No **Orion Caixa**, navegue até o menu **Controle de Caixa > Recibos**.
5. Pesquise o recibo desejado e clique no botão **Retificar / Editar Recibo**.
6. Altere o campo **Data de Emissão** para a data correspondente e clique em **Confirmar Retificação**.

* **Restrição:** O sistema não permite retificar datas de recibos referentes a meses contábeis cujo Livro Diário ou Sinoreg já tenham sido definitivamente encerrados.
---
