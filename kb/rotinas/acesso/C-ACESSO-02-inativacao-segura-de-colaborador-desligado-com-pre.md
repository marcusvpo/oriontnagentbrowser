---
id: C-ACESSO-02
titulo: Inativação Segura de Colaborador Desligado com Preservação de Histórico e Auditoria
tags:
- Usuários
- Inativação de Acesso
- Desligamento
- Auditoria Notarial
- Segurança
objetivo: Revogar o acesso de colaboradores desligados da serventia sem violar a integridade referencial do banco de dados, mantendo a autoria de atos e trilhas de auditoria.
sinonimos:
- excluir usuário de funcionário demitido
- desativar login de escrevente desligado
- bloquear acesso de colaborador
- como inativar operador no sistema
perguntas_usuario:
- Um escrevente foi desligado do cartório, como cancelo o login dele no sistema?
- Tentei excluir um funcionário demitido e o Orion TN deu erro de chave estrangeira, o que fazer?
- Como revogar o acesso de um operador sem perder o registro de quem fez os atos passados?
sintomas_comuns:
- erro de violação de integridade referencial ao tentar deletar colaborador cadastrado
- necessidade urgente de bloquear acesso ao sistema corporativo após rescisão contratual
- dúvida sobre como manter a autoria de escrituras e selos lavrados por operador demitido
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Em sistemas notariais e registrais, colaboradores que praticaram atos, lavraram livros ou emitiram selos jamais podem sofrer exclusão física direta do banco de dados (`DELETE`), pois seus identificadores estão vinculados às tabelas de auditoria e cumprimento de provimentos da Corregedoria. O encerramento de vínculo exige inativação lógica, a qual revoga o login e derruba sessões conectadas instantaneamente, resguardando todo o acervo histórico.

#### Passo a passo:
1. Acesse o menu **Configurações** > submenu **Usuários**.
2. Localize o colaborador desligado na lista de operadores e dê um duplo clique sobre o registro (ou acione o botão **Alterar**).
3. Na tela de cadastro do usuário, localize a caixa de seleção **Ativo** e desmarque-a (o status mudará para **Inativo / Bloqueado**).
4. Acesse a aba **Sessões Ativas / Conexões** e clique no botão **Derrubar Sessões Conectadas** para desconectar imediatamente eventuais instâncias abertas na rede ou remotamente.
5. Na aba **Observações**, registre a justificativa administrativa interna: *"Inativação por término de contrato de trabalho em [data]"*.
6. Clique no botão **Salvar** (`F10`). O acesso ao Orion TN e módulos integrados será bloqueado no mesmo instante.

* **Dica:** Nunca compartilhe o login do colaborador inativado com seu sucessor. Cada novo funcionário deve possuir seu próprio CPF e credencial individual para conformidade com a LGPD e normas do CNJ.
---
