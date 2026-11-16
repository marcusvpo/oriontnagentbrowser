---
id: C-ACESSO-06
titulo: Habilitação de Permissões para Edição de Partes e Imóveis em Protocolos em Andamento
tags:
- Protocolo
- Permissões
- Grupos de Acesso
- Notas
- Edição de Atos
objetivo: Liberar a prerrogativa de alteração de partes, valores e dados de bens em protocolos em andamento para escreventes impedidos por bloqueios de perfil.
sinonimos:
- campos do protocolo cinzas e travados
- escrevente não consegue alterar parte
- não consigo editar valor do protocolo aberto
- permissão para alterar protocolo antes de finalizar
perguntas_usuario:
- Por que meus escreventes de Notas não conseguem alterar uma parte no protocolo que ainda está aberto?
- Onde configuro para que os funcionários possam mudar dados do ato antes de lavrar?
- Como liberar os botões de edição de partes e imóveis na tela de protocolo?
sintomas_comuns:
- botões "Alterar", "Adicionar Parte" e "Remover Imóvel" ficam esmaecidos (desabilitados) na tela de protocolo
- mensagem "Usuário sem permissão para modificar protocolos iniciados por outro operador"
- escrevente precisa pedir constantemente para o substituto alterar informações básicas de minutas em elaboração
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Com o objetivo de prevenir fraudes e adulterações inadvertidas, perfis padrão do grupo de escreventes podem estar configurados com travas que impedem a edição de protocolos após a geração inicial do número de apontamento. Quando a rotina de trabalho exige que múltiplos operadores colaborem no mesmo protocolo, os parâmetros de edição pré-finalização devem ser habilitados no perfil do grupo.

#### Passo a passo:
1. Acesse o menu **Configurações** > submenu **Grupos e Perfis de Acesso**.
2. Selecione o grupo operacional correspondente (ex: **Escreventes de Notas**) e clique em **Alterar**.
3. Na árvore de módulos e rotinas, expanda o nó **Notas** > **Protocolo** > **Operações Básicas**.
4. Marque as caixas de seleção obrigatórias:
    - **[x] Permitir Alteração de Protocolo em Andamento**
    - **[x] Editar Partes, Qualificações e Representantes**
    - **[x] Adicionar / Modificar Bens e Imóveis**.
5. Se desejado permitir a colaboração cruzada entre colegas, marque também **[x] Alterar Protocolos Criados por Outros Usuários do Mesmo Setor**.
6. Clique no botão **Gravar** (`F10`).
7. **Ação Fundamental:** Solicite a todos os escreventes do setor afetado que realizem **Logoff** do sistema e façam login novamente para recarregar a tabela de permissões de sessão.

* **Dica:** Não conceda essa permissão ao perfil de estagiários ou recepcionistas; reserve a alteração plena de dados jurídicos aos perfis de prepostos escreventes e substitutos.
---
