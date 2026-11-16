---
id: C-SELO-03
titulo: Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ
tags:
- Selo Digital
- Contingência
- Modo Offline
- Tribunal Indisponível
- Permissões
objetivo: Ativar a modalidade de contingência local para permitir a continuidade da lavratura e autenticações durante indisponibilidade do tribunal.
sinonimos:
- servidor do tj fora do ar
- não gera selo tribunal caiu
- ativar selo offline
- modo contingência selos
perguntas_usuario:
- O servidor do TJ está fora do ar e os clientes estão no balcão esperando, como lavrar os atos?
- Como ligar o modo de selagem offline no Orion TN?
- Deu erro 500/503 na comunicação com o tribunal, como não travar o cartório?
sintomas_comuns:
- 'mensagem: Não foi possível conectar ao Webservice do Tribunal / Serviço indisponível'
- balcão de atendimento completamente paralisado sem poder emitir escrituras ou firmas
- escrevente não localiza onde alternar para o modo de contingência
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Provimento Geral da Justiça autoriza a selagem em modo de contingência offline em casos de instabilidade técnica comprovada, permitindo que a serventia reserve a numeração localmente para envio posterior.

#### Passo a passo:
1. Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parâmetros Gerais > Selo Digital** (ou aba **Integração TJ**).
2. Localize a opção **Modo de Envio do Selo Digital**.
3. Altere o parâmetro de **Online** para **Modo de Selagem Offline (Contingência)**.
4. Clique no botão **Salvar**.
5. Caso o usuário receba alerta de acesso negado: libere a permissão em **Usuários e Perfis > Módulo Selos > Alternar Contingência**.
6. Prossiga com os atendimentos e lavraturas normalmente (os selos serão numerados pela base local).
7. Assim que o tribunal restabelecer a operação: retorne o parâmetro para **Online** e acione **Transmitir Lote de Contingência Acumulado**.

* **Alerta de Sincronização:** Nunca encerre o expediente sem retransmitir todos os selos gerados em modo offline para evitar penalidades de envio fora do prazo legal.
---
