---
id: C-GERAL-08
titulo: Desbloqueio de Protocolos Travados por Concorrência Simultânea em Múltiplas Abas do Chrome
tags:
- Google Chrome
- Concorrência
- Lock de Sessão
- Protocolo Travado
- Navegador
objetivo: Eliminar bloqueios lógicos de concorrência (*locks*) em protocolos acessados via interface web do Orion TN quando abertos simultaneamente em múltiplas abas do mesmo navegador.
sinonimos:
- protocolo em uso por outro usuário
- registro bloqueado para edição no chrome
- destravar protocolo preso em outra aba
- erro de concorrência de sessão no orion web
perguntas_usuario:
- Estou tentando abrir o protocolo e o Orion diz que ele já está em uso por mim mesmo, como destravar?
- O que fazer quando o navegador bloqueia a gravação dizendo que o documento foi modificado em outra janela?
- Como limpar o bloqueio de tela no Google Chrome sem reiniciar o servidor?
sintomas_comuns:
- 'mensagem "Registro Bloqueado: O protocolo nº [X] está sendo editado na sessão ativa de [Usuário]"'
- escrevente abre o mesmo protocolo em duas abas do Chrome e a segunda aba bloqueia a gravação da primeira
- queda de conexão de internet durante a digitação mantendo o lock temporário ativo na tabela do banco
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Para prevenir que dois escreventes sobrescrevam alterações concorrentes no mesmo negócio jurídico, o Orion TN aplica um bloqueio otimista de registro (*lock*). Se o próprio operador abrir o protocolo em mais de uma aba do Google Chrome ou fechar o navegador sem clicar em "Cancelar / Liberar", a sessão permanecerá retida temporariamente no servidor até a expiração do token.

#### Passo a passo:
1. Feche todas as abas e janelas adicionais do Google Chrome que estejam acessando o Orion TN.
2. Pressione `Ctrl + Shift + Delete` no Chrome, selecione **Última Hora**, marque a opção **Imagens e arquivos em cache** e confirme em **Limpar dados**.
3. Faça novamente o login no sistema na aba principal.
4. Acesse o menu **Notas** > **Protocolo** e tente acessar o número do ato.
5. Se a mensagem de bloqueio de concorrência persistir, solicite ao usuário com perfil de **Administrador / Tabelião** que acesse **Administração** > **Gerenciador de Sessões e Locks**.
6. Na grade de bloqueios ativos, localize a linha contendo o número do protocolo e o nome do usuário travado.
7. Clique no botão **Liberar Lock de Registro** (ou **Derrubar Bloqueio Concorrente**).
8. Retorne à tela de protocolo e confirme que os campos foram plenamente reabertos para digitação.

* **Dica:** Recomende aos colaboradores que nunca mantenham o mesmo protocolo aberto em múltiplos navegadores ao mesmo tempo, utilizando sempre o fluxo de abrir, salvar e fechar a tela.
---
