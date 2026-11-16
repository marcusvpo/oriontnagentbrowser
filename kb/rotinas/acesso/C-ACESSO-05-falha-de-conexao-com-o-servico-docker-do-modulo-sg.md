---
id: C-ACESSO-05
titulo: Falha de Conexão com o Serviço Docker do Módulo SGA e Painel de Chamada Silencioso
tags:
- SGA
- Docker
- Painel de Senhas
- Serviços
- Infraestrutura
objetivo: Restabelecer o funcionamento do painel eletrônico de atendimento e som de chamada de senhas após reinicialização do servidor ou pausa acidental do container Docker.
sinonimos:
- painel de senhas não abre
- sga fora do ar
- chamar senha não emite som
- docker do sga pausado
perguntas_usuario:
- O painel da TV da recepção não está chamando as senhas e dá tela branca, o que aconteceu?
- Como reiniciar o serviço do SGA que parou depois que o servidor desligou?
- Os escreventes clicam em chamar senha no sistema mas nada aparece na tela do balcão, como resolver?
sintomas_comuns:
- navegador exibe tela de "Conexão Recusada" ao tentar abrir o painel de atendimento na TV da recepção
- botão "Chamar Senha" nos terminais dos escreventes fica em carregamento infinito sem resposta sonora
- servidor local sofreu reinicialização noturna e os containers de serviços não subiram com inicialização automática
video:
  tem_video: false
modulo: acesso
modulo_nome: Acesso, Usuários e Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O painel e a fila de atendimento do SGA são suportados por um microsserviço executado em ambiente containerizado (Docker) no servidor local do cartório. Caso o servidor sofra um pico de energia ou reinicialização sem que o serviço do Docker esteja parametrizado para início automático (`restart: always`), a aplicação ficará com status *Exited* ou *Paused*, cessando as chamadas em rede.

#### Passo a passo:
1. Acesse o servidor principal da serventia com perfil de administrador.
2. Abra o **Docker Desktop** (ou execute o comando `docker ps -a` no terminal PowerShell).
3. Localize o container denominado `siplan-sga` (ou `orion-painel-atendimento`) e verifique a coluna **Status**.
4. Se o status estiver *Exited* ou *Paused*, clique no botão de reprodução **Start / Restart** (ou execute `docker start siplan-sga`).
5. Aguarde cerca de 30 segundos para que os microsserviços de fila e áudio carreguem completamente.
6. Abra o navegador na máquina da recepção conectada à TV e pressione `Ctrl + F5` na página do painel (`http://[IP-SERVIDOR]:8080/painel`).
7. No Orion TN dos escreventes, acione **Atendimento** > **Chamar Senha** e teste o disparo sonoro.

* **Dica:** Configure o serviço do Docker no Windows (`services.msc`) com o **Tipo de Inicialização** definido como **Automático (Atraso na Inicialização)** para que o SGA suba sem intervenção manual após reinicializações.
---
