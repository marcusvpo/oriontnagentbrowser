---
id: C-ACESSO-07
titulo: Liberação de Acesso e Impressão de Consulta de Serviços Praticados para Auxiliares
tags:
- Relatórios
- Serviços Praticados
- Permissões
- Balcão de Firmas
- Produtividade
objetivo: Configurar privilégios para que colaboradores de funções auxiliares possam consultar e imprimir o relatório diário de serviços praticados no balcão.
sinonimos:
- usuário não consegue imprimir serviços praticados
- liberar relatório de firmas para auxiliar
- consulta de atos praticados bloqueada
- erro de permissão ao gerar extrato do balcão
perguntas_usuario:
- Um auxiliar não está conseguindo tirar a folha de serviços praticados no final do expediente, onde libero?
- Como autorizo um funcionário do balcão a visualizar quantos reconhecimentos ele fez hoje?
- Qual permissão dá acesso à impressão de resumo de serviços praticados no Orion TN?
sintomas_comuns:
- 'mensagem "Acesso Negado: Usuário não possui autorização para emitir este relatório" ao clicar no menu'
- item de menu "Serviços Praticados" aparece oculto para o operador do balcão
- colaborador precisa deslocar-se até o terminal do chefe para conferir a contagem de selos e reconhecimentos
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O relatório de Serviços Praticados é uma ferramenta essencial de prestação de contas no encerramento do turno de balcão, permitindo conferir a quantidade de autenticações, reconhecimentos de firma e certidões expedidas. Quando operadores com perfil auxiliar assumem o caixa do balcão, o perfil de acesso precisa ter essa prerrogativa liberada individualmente ou pelo grupo funcional.

#### Passo a passo:
1. No Orion TN, acesse o menu **Configurações** > **Perfis e permissões de acesso** (ou **Usuários** para ajuste individual).
2. Localize o grupo **Auxiliares de Cartório** e clique em **Alterar**.
3. Na árvore de permissões, expanda **Balcão de Firmas** > pasta **Consultas e Relatórios**.
4. Localize e marque a opção **[x] Consulta de Serviços Praticados** e o subitem **[x] Permitir Impressão de Extrato Operacional**.
5. Se a serventia restringe a visualização financeira, desmarque a opção **Exibir Valores de Emolumentos e Caixa Líquido** para apresentar apenas o quantitativo físico de atos.
6. Clique no botão **Salvar**.
7. Oriente o colaborador a fechar o módulo e reabri-lo; o menu **Firmas** > **Consultas** > **Serviços praticados** estará imediatamente disponível.

* **Dica:** Para maior controle de gestão, utilize a restrição de visualização por operador, garantindo que cada atendente visualize apenas os atos que ele próprio selou e praticou.
---
