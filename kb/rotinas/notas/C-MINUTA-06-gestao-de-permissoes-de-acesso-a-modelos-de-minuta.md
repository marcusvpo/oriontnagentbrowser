---
id: C-MINUTA-06
titulo: Gestão de Permissões de Acesso a Modelos de Minutas por Usuário e Perfil
tags:
- Modelos
- Permissões
- Segurança
- Governança
- Perfis de Acesso
objetivo: Liberar ou restringir o acesso a modelos específicos de minutas garantindo que apenas escreventes autorizados utilizem minutas sensíveis.
sinonimos:
- escrevente não consegue ver modelo
- liberar modelo de minuta para usuário
- modelo de minuta sumiu da lista
- restringir acesso a modelos
perguntas_usuario:
- Criei um modelo novo de inventário mas os outros escreventes não conseguem ver na lista, onde libero?
- Como restringir o modelo de testamento para apenas o tabelião e substituto poderem usar?
- Por que o modelo de minuta aparece para mim mas não para o meu colega?
sintomas_comuns:
- lista de modelos disponíveis na aba Minuta varia entre diferentes estações
- escreventes novos não localizam os modelos padronizados do cartório
- tabelião deseja resguardar minutas complexas contra uso por auxiliares
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Cada modelo de minuta cadastrado no Orion TN possui uma lista de controle de acesso (ACL). Se o modelo for gravado como privativo ou sem permissão para o grupo de escreventes, ele fica invisível para os demais.

#### Passo a passo:
1. Com usuário administrador, acesse **Configurações > Modelos de Minutas > Cadastro de Modelos**.
2. Localize o modelo desejado e clique no botão **Editar**.
3. Navegue até a aba **Permissões de Acesso / Usuários Autorizados**.
4. Marque o checkbox **Todos os Usuários do Setor de Notas** (ou selecione os colaboradores específicos permitidos).
5. Certifique-se de que a opção **Modelo Ativo / Visível** esteja marcada.
6. Clique no botão **Salvar**.
7. Solicite aos escreventes que fechem e reabram o protocolo para atualizar o catálogo de modelos disponíveis.

* **Governança:** Revise periodicamente os modelos descontinuados marcando-os como Inativos para evitar o uso de redações desatualizadas.
---
