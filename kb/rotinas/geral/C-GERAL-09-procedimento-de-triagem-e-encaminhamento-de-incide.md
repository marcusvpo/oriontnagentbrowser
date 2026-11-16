---
id: C-GERAL-09
titulo: Procedimento de Triagem e Encaminhamento de Incidentes de Banco de Dados ao Suporte N2 Siplan
tags:
- Suporte N2
- Service Desk
- Banco de Dados
- Bugs Críticos
- Triagem de Chamados
objetivo: Orientar o usuário com transparência sobre incidentes críticos que extrapolam a interface do sistema, preparando o diagnóstico técnico estruturado para abertura de chamado 0800.
sinonimos:
- erro interno de banco de dados postgresql
- como abrir chamado crítico no suporte siplan
- bug do sistema precisando de correção de scripts
- quando acionar o suporte n2 da siplan
perguntas_usuario:
- O sistema está dando um erro de banco de dados em inglês que não me deixa salvar nada, o que eu faço?
- Já tentei todas as opções da tela e o erro persiste, como pedir ajuda ao suporte da Siplan?
- O que devo informar para o suporte N2 quando der erro grave no sistema?
sintomas_comuns:
- caixas de diálogo contendo mensagens de erro de SQL (*Internal PostgreSQL Server Error*, *Deadlock Detected*, *Corrupt Index*)
- falha recorrente em botão do sistema após todas as validações de campos e regras de interface terem sido seguidas
- necessidade comprovada de execução de scripts de manutenção de dados diretamente no backend da serventia
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Determinados incidentes decorrem de falhas estruturais, corrupção pontual de índices de banco de dados, deadlocks de concorrência profunda ou inconsistências de integridade que não possuem comandos de resolução disponíveis na interface visual do operador. Nesses casos, o assistente adota uma postura empática e resolutiva: acolhe a urgência do cartório, realiza a triagem prévia dos itens de tela e fornece o texto exato do diagnóstico para encaminhamento ao suporte técnico especializado (N2 / Engenharia da Siplan).

#### Passo a passo:
1. Verifique se a falha decorre de campos obrigatórios não preenchidos, regras de validação cadastral ou permissões de usuário (esgote primeiro as verificações de tela aplicáveis).
2. Pressione a tecla `Print Screen` da estação de trabalho para registrar a mensagem exata exibida na tela de erro.
3. Se a mensagem contiver o botão **Detalhes Técnicos / Ver Log**, clique nele e acione o botão **Copiar Log para Área de Transferência**.
4. Anote o número do protocolo, livro ou folha exata envolvida no incidente.
5. Acesse o portal do cliente Siplan ou entre em contato pelo telefone/WhatsApp oficial do suporte (0800 Siplan).
6. Envie a seguinte descrição padronizada de triagem:
    - **Serventia:** [Nome e Código do Cartório]
    - **Módulo e Versão:** Orion TN 6.0
    - **Ato / Protocolo Afetado:** [Número do protocolo ou livro]
    - **Ação Executada:** [Descrever o clique ou comando exato que disparou o erro]
    - **Log de Erro Capturado:** [Colar o texto copiado do log de banco de dados].
7. Aguarde a conexão remota do analista N2 da Siplan para aplicação do patch corretivo ou script de banco de dados homologado.

* **Dica:** Nunca tente executar comandos manuais no banco de dados (`DROP`, `UPDATE` via pgAdmin) por conta própria sem a supervisão e homologação expressa da engenharia da Siplan, sob risco de corrupção do acervo notarial.
---
