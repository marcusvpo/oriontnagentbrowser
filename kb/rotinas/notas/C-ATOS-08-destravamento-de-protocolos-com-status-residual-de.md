---
id: C-ATOS-08
titulo: Destravamento de Protocolos com Status Residual de Inutilizado ou Em Andamento
tags:
- Protocolo
- Status do Ato
- Inutilizado
- Destravamento
- Suporte N2
objetivo: Recuperar e normalizar protocolos que sofreram travamento de concorrência ou tiveram o status alterado para inutilizado por engano.
sinonimos:
- protocolo travado em andamento
- recuperar protocolo inutilizado por engano
- erro ao salvar ato em edição
- destravar protocolo notas
perguntas_usuario:
- O protocolo ficou marcado como Inutilizado por engano e não deixa editar nem consultar, como recuperar?
- O sistema diz que o protocolo está em uso por outro usuário que já fechou o navegador, como liberar?
- Como reverter o status de um protocolo no Orion TN?
sintomas_comuns:
- 'mensagem: Protocolo bloqueado por concorrência de sessão'
- ato marcado com status Inutilizado sem possibilidade de clique na tela de edição
- queda de conexão no momento da assinatura deixou o registro com lock no banco
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Falhas de rede ou encerramento forçado do navegador podem deixar a trava de concorrência ativa no protocolo. Já a inutilização acidental requer restauração controlada do status lógico.

#### Passo a passo:
1. Para **Locks de Concorrência (Sessão Presa)**:
2. Com perfil de chefia, acesse **Administração > Sessões Ativas e Bloqueios**.
3. Localize a trava associada ao protocolo e clique em **Liberar Lock de Registro**.
4. Solicite ao escrevente que pressione `Ctrl + F5` no navegador e reabra o protocolo.
5. Para **Restauração de Protocolo Marcado como Inutilizado por Engano**:
6. Verifique se nenhum ato com o mesmo Livro e Folha foi lavrado posteriormente.
7. Abra chamado no **Service Desk 0800 da Siplan** solicitando o reestabelecimento do status lógico de `Em Edição` (informe o número do protocolo, data e justificativa formal do tabelião).

* **Suporte Siplan:** A reativação de protocolo inutilizado envolve auditoria de integridade para garantir que não haja duplicidade de livro e folha física.
---
