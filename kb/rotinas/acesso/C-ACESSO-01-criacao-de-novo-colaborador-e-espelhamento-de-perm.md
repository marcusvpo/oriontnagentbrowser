---
id: C-ACESSO-01
titulo: Criação de Novo Colaborador e Espelhamento de Permissões de Usuário Paradigma
tags:
- Usuários
- Perfis de Acesso
- Clonagem de Permissões
- Cadastro de Colaborador
- Segurança
objetivo: Cadastrar novos colaboradores no Orion TN aproveitando a matriz de permissões de um usuário modelo do mesmo setor, eliminando retrabalho na seleção manual de rotinas.
sinonimos:
- cadastrar novo funcionário
- clonar perfil de escrevente
- copiar permissões de outro usuário
- criar login para escrevente novato
perguntas_usuario:
- Como crio um usuário novo com os mesmos acessos de um escrevente já cadastrado?
- Onde fica a opção de copiar perfil de permissões de outro colaborador?
- Contratamos uma nova auxiliar, como libero os módulos dela com base em outra funcionária?
sintomas_comuns:
- escrevente recém-contratado não consegue acessar módulo de notas ou balcão de firmas
- tabelião perde tempo configurando item por item de permissão para novos funcionários
- escrevente novato recebe acessos incorretos por esquecimento de liberação manual de rotinas
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Ao admitir novos prepostos ou redistribuir funções, a parametrização manual de dezenas de permissões individuais pode ocasionar omissões operacionais ou concessão indevida de privilégios. O Orion TN dispõe da funcionalidade de espelhamento de permissões, que permite clonar instantaneamente a grade de acessos de um usuário paradigma do mesmo setor (Notas, Procurações ou Balcão de Firmas), bastando personalizar os dados cadastrais básicos e definir a senha provisória.

#### Passo a passo:
1. No menu superior, acesse **Configurações** (ou **Administração**) e selecione a opção **Usuários**.
2. Na listagem de colaboradores, acione o botão **Novo** (ícone de folha em branco ou pressione `F2`).
3. Preencha a ficha cadastral obrigatória: **Nome Completo**, **Login de Acesso**, **CPF**, **E-mail Corporativo** e selecione o **Cargo / Função** (ex: *Escrevente Notarial*).
4. Navegue até a aba **Perfis / Permissões** e clique no botão **Copiar Permissões de Usuário Existente**.
5. Na janela suspensa, localize e selecione o colaborador modelo (paradigma) com as permissões equivalentes desejadas e confirme em **Importar Permissões**.
6. Defina uma **Senha Provisória** alfanumérica, marque a caixa **Exigir troca no próximo logon** e clique em **Salvar** (`F10`).
7. Confirme se o novo usuário consta com a coluna **Status** exibindo **Ativo** na grade geral de operadores.

* **Dica:** Recomenda-se criar usuários genéricos modelo como paradigmas definitivos (ex: *Modelo Escrevente Notas*, *Modelo Balcão Firmas*) para evitar herdar exceções temporárias de colaboradores específicos.
---
