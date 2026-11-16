---
id: C-ACESSO-04
titulo: Descompasso de Credenciais entre Orion TN e Módulo SGA com Divergência de Regras de Senha
tags:
- SGA
- Painel de Senhas
- Atendimento
- Validação de Senha
- Integração de Módulos
objetivo: Corrigir falhas de login automático no módulo SGA (Sistema de Gestão de Atendimento) causadas por diferenças no tamanho mínimo e complexidade de senhas entre os módulos.
sinonimos:
- não consigo chamar senha no painel
- login não entra no sga
- erro de credencial ao abrir painel de chamada
- senha do sga rejeitada
perguntas_usuario:
- Por que o escrevente consegue logar no Orion TN mas quando clica para chamar senha no SGA dá erro de login?
- Como cadastrar usuário no SGA para que o login automático funcione direto do Orion TN?
- O painel de atendimento não reconhece minha senha do sistema de notas, o que fazer?
sintomas_comuns:
- login no Orion TN aceito normalmente, porém o botão "Chamar Senha" solicita credenciais e rejeita a senha digitada
- mensagem de autenticação recusada na API interna do SGA ao tentar vincular o operador
- escrevente com senha de 4 dígitos não consegue operar o painel eletrônico de chamada
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Orion TN permite senhas numéricas curtas em perfis legados, ao passo que a interface web do módulo SGA (Gestão de Atendimento e Painel de Senhas) adota políticas de segurança mais restritivas (mínimo de 6 a 8 caracteres). Quando o escrevente aciona o painel integrado a partir do Orion TN, a passagem automática de parâmetros falha devido à rejeição da senha curta pela API do SGA.

#### Passo a passo:
1. No Orion TN, acesse o menu **Configurações** > submenu **Usuários**.
2. Localize e abra o cadastro do escrevente com falha no SGA clicando em **Alterar**.
3. No campo **Senha**, cadastre uma nova senha que cumpra integralmente os requisitos do SGA (mínimo de 6 caracteres alfanuméricos).
4. Clique no botão **Salvar**.
5. Em seguida, acesse o menu **Atendimento** > **Configurações do SGA** > aba **Operadores de Guichê**.
6. Localize o usuário correspondente, selecione **Sincronizar Credenciais com Orion TN** e insira a nova senha padronizada.
7. Vincule o operador ao **Guichê de Atendimento** físico correspondente e clique em **Gravar**.
8. Solicite ao escrevente que feche o módulo e acione o atalho **Chamar Senha** para validar o acesso imediato.

* **Dica:** Mantenha a regra de senhas com no mínimo 6 caracteres alfanuméricos para todos os colaboradores do cartório, eliminando atritos de Single Sign-On entre o módulo de Notas, Caixa, SGA e Estoque.
---
