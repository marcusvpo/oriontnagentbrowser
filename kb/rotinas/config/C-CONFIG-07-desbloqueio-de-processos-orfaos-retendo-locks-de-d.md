---
id: C-CONFIG-07
titulo: Desbloqueio de Processos Órfãos Retendo Locks de DLLs e Limpeza de Arquivos Temporários
tags:
- Processos Órfãos
- OrionTN.exe
- Locks
- Arquivos Temporários
- Desempenho
objetivo: Eliminar instâncias ocultas e congeladas do executável do sistema na memória do Windows e limpar o cache temporário para permitir atualizações de versão e desbloqueio de módulos.
sinonimos:
- sistema não abre mas diz que já está em execução
- erro ao atualizar orion tn arquivo bloqueado
- derrubar processos travados do sistema
- limpar temporários do orion
perguntas_usuario:
- O Orion TN fechou do nada e agora quando tento abrir de novo aparece que o programa já está rodando, como destravar?
- Ao atualizar a versão do sistema o instalador acusa que a DLL está bloqueada por outro usuário, o que fazer?
- Como faço uma limpeza completa dos arquivos temporários que travam o sistema?
sintomas_comuns:
- duplo clique no ícone do Orion TN exibe a ampulheta do mouse por instantes e nada acontece na tela
- mensagem "O arquivo OrionTN.exe já está sendo utilizado por outro processo"
- lentidão acentuada ou mensagens de erro de memória insuficiente (*Out of memory*) na estação de trabalho
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando o sistema é encerrado abruptamente por queda de energia ou finalização de tarefa, instâncias do processo `OrionTN.exe` e de seus módulos de serviço podem permanecer em execução invisível em segundo plano retendo o bloqueio (*lock*) de arquivos de banco de dados locais, drivers BDE e bibliotecas dinâmicas (.dll), impedindo novas inicializações e rotinas de atualização.

#### Passo a passo:
1. Pressione a combinação de teclas `Ctrl + Shift + Esc` para abrir o **Gerenciador de Tarefas** do Windows.
2. Selecione a aba **Detalhes** (ou Processos no Windows 11) e clique na coluna **Nome** para ordenar alfabeticamente.
3. Localize quaisquer ocorrências de `OrionTN.exe`, `OrionCaixa.exe`, `IntegradorSPCM.exe` ou `DocuViewareService.exe`.
4. Clique com o botão direito sobre cada um deles e selecione **Finalizar Processo** (ou **Finalizar Árvore de Processos**).
5. Pressione `Win + R`, digite `%temp%` e pressione Enter para abrir a pasta de arquivos temporários do usuário.
6. Pressione `Ctrl + A` para selecionar todos os arquivos e execute a exclusão definitiva (`Shift + Delete`). Caso algum arquivo do Windows acuse estar em uso, clique em **Ignorar**.
7. Dê um clique com o botão direito no atalho oficial do **Orion TN** e escolha **Executar como Administrador** na primeira reinicialização.

* **Dica:** Oriente todos os operadores da serventia a sempre fecharem o sistema utilizando o botão formal **Sair / Encerrar** em vez de desligarem a máquina diretamente no botão físico da tomada.
---
