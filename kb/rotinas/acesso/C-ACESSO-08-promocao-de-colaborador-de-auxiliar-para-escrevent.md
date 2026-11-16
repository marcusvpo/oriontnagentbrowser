---
id: C-ACESSO-08
titulo: Promoção de Colaborador de Auxiliar para Escrevente com Habilitação de Lavratura e Estoque
tags:
- Usuários
- Promoção de Função
- Lavratura
- Estoque de Selos
- Substitutos
objetivo: Migrar o perfil funcional de um colaborador promovido de auxiliar a escrevente no Orion TN, liberando atribuições de lavratura, assinatura e consumo de selos físicos e digitais.
sinonimos:
- mudar cargo de auxiliar para escrevente
- promover funcionário no sistema
- habilitar lavratura de livros para novo escrevente
- liberar carga de selos para escrevente
perguntas_usuario:
- Nossa auxiliar foi nomeada escrevente pelo juiz corregedor, como mudo as funções dela no Orion TN?
- O que precisa ser alterado no sistema quando um funcionário passa a poder lavrar escrituras?
- Como habilitar um novo escrevente para retirar selos de segurança no módulo de Estoque?
sintomas_comuns:
- colaborador promovido não consegue selecionar o próprio nome no campo "Escrevente Lavrador" do protocolo
- módulo de Estoque recusa a entrega de folhas de traslado para o usuário por falta de habilitação funcional
- nome do novo escrevente não é impresso no encerramento da escritura
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A nomeação formal de um escrevente exige atualizações que vão além de uma simples troca de descrição textual no cadastro. O Orion TN valida regras estritas na emissão de livros notariais e repasse de selos: o operador deve ter o cargo alterado, o atributo de "Praticante de Atos Notariais" ativado e o vínculo habilitado nas tabelas do módulo Orion Estoque.

#### Passo a passo:
1. Acesse o menu **Configurações** > submenu **Usuários**.
2. Selecione o colaborador promovido e clique no botão **Alterar**.
3. No campo **Cargo / Função**, altere de *Auxiliar de Cartório* para *Escrevente Notarial* (ou *Escrevente Substituto* conforme a portaria de nomeação).
4. Na aba **Parâmetros Notariais**, marque a caixa **[x] Autorizado a Lavrar Escrituras, Procurações e Atas**.
5. Insira a portaria de nomeação judicial no campo **Referência de Homologação / Portaria Corregedoria**.
6. Mude o grupo de acesso na aba **Perfis** para **Escreventes Autorizados**.
7. Acesse o módulo **Orion Estoque** > menu **Administração** > **Habilitação de Operadores**, localize o usuário e marque **[x] Autorizado a Receber Carga de Papéis de Segurança e Selos**.
8. Clique em **Salvar** em ambos os módulos. Solicite um novo logon do usuário.

* **Dica:** Após a promoção, lembre-se de cadastrar a assinatura digital (ICP-Brasil) do novo escrevente nos parâmetros do assinador para possibilitar a lavratura remota pelo e-Notariado.
---
