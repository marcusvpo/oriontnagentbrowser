---
id: C-ACESSO-03
titulo: Redefinição de Senha e Reset de Autenticação em Dois Fatores (2FA) por Perda de Dispositivo
tags:
- Segurança
- Reset de Senha
- Autenticação em Dois Fatores
- 2FA
- Recuperação de Login
objetivo: Redefinir credenciais e desvincular o aplicativo autenticador (2FA/TOTP) de colaboradores que trocaram de celular, formataram estações ou perderam o acesso às chaves temporárias.
sinonimos:
- resetar 2fa do escrevente
- desativar autenticação dois fatores
- código de dois fatores dando inválido
- redefinir senha bloqueada do operador
perguntas_usuario:
- A máquina da escrevente foi formatada e o 2FA agora diz que o código é inválido, como resetar?
- Como desbloqueio a senha de um funcionário que errou mais de três vezes?
- O escrevente trocou de celular e não tem mais o autenticador do Orion TN, como cadastrar de novo?
sintomas_comuns:
- mensagem "Código de verificação 2FA inválido ou expirado" repetidamente no login
- e-mail corporativo com link de recuperação de senha não chega na caixa de entrada
- estação formatada impedindo validação da semente simétrica TOTP previamente armazenada
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A autenticação em dois fatores (2FA) vincula um segredo simétrico ao aplicativo móvel ou estação do usuário. Caso o dispositivo seja formatado, o relógio esteja dessincronizado ou o celular trocado, o código gerado deixará de coincidir com o servidor de validação. O Administrador do Orion TN pode desvincular a chave anterior e gerar uma nova semente QR Code para recadastramento imediato.

#### Passo a passo:
1. Faça logon no Orion TN utilizando uma conta com privilégios de **Administrador** ou **Tabelião Titular**.
2. Acesse o menu **Configurações** > submenu **Usuários**.
3. Selecione o colaborador impossibilitado de acessar e clique em **Alterar**.
4. Para redefinição de senha: Na aba **Geral**, acione **Redefinir Senha Manualmente**, digite uma senha provisória segura e marque **Exigir troca no próximo logon**.
5. Para reset de autenticador: Acesse a aba **Segurança / Autenticação** e clique no botão **Resetar 2FA / Desvincular Dispositivo**.
6. Confirme o alerta de revogação de segurança clicando em **Confirmar Reset** e, em seguida, clique em **Salvar** (`F10`).
7. Instrua o colaborador a abrir o Orion TN na sua estação, digitar o login e senha provisória e apontar a câmera do aplicativo autenticador (ex: Google Authenticator) para escanear o novo QR Code exibido na tela.

* **Dica:** Se o código 2FA continuar falhando logo após o cadastro do novo QR Code, verifique se o relógio do celular e o relógio do servidor do cartório estão sincronizados com a hora oficial de Brasília (NTP.br).
---
