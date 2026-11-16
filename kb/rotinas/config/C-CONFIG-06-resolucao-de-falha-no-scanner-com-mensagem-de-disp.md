---
id: C-CONFIG-06
titulo: Resolução de Falha no Scanner com Mensagem de Dispositivo TWAIN Não Localizado
tags:
- Scanner
- TWAIN
- Falha de Hardware
- USB
- Periféricos
objetivo: Diagnosticar e resolver falhas de perda de comunicação entre o Orion TN e scanners físicos causadas por suspensão de portas USB ou travamento de processo em segundo plano.
sinonimos:
- scanner sumiu do sistema
- dispositivo twain não localizado
- orion diz que scanner está desconectado
- scanner de livro travou
perguntas_usuario:
- O scanner estava funcionando hoje de manhã e de repente o sistema diz que não encontrou o dispositivo TWAIN, o que fazer?
- Como fazer o sistema voltar a enxergar o scanner sem precisar reiniciar o computador?
- Por que o Orion TN perde a conexão com o scanner quando a máquina fica um tempo parada?
sintomas_comuns:
- 'mensagem "Falha na abertura da fonte TWAIN: Dispositivo não localizado ou ocupado por outro aplicativo"'
- scanner ligado na tomada e com luz verde acesa, porém sem resposta no acionamento pelo software
- perda frequente de conexão após períodos de inatividade do terminal de trabalho
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Sistemas operacionais Windows ativam por padrão a economia de energia em portas USB ("Suspensão Seletiva USB"), cortando a alimentação lógica de scanners após períodos ociosos. Além disso, se o processo do driver anterior não tiver sido liberado na memória, a porta ficará ocupada em modo exclusivo, impedindo novas capturas pelo Orion TN.

#### Passo a passo:
1. Desconecte o cabo USB do scanner na traseira da estação de trabalho, aguarde 5 segundos e conecte-o preferencialmente em uma porta USB traseira direta da placa-mãe (evite hubs ou portas frontais).
2. Pressione `Ctrl + Shift + Esc` para abrir o **Gerenciador de Tarefas**, localize processos residuais do scanner (ex: `twunk_32.exe`, `kdsmon.exe` ou software proprietário do fabricante) e clique em **Finalizar Tarefa**.
3. No Windows, acesse **Opções de Energia** > **Alterar configurações do plano** > **Alterar configurações de energia avançadas** > expanda **Configurações USB** > desative a opção **Configuração de suspensão seletiva USB**.
4. No Orion TN, acesse **Balcão de Firmas** (ou **Livros**) > **Configurações de Captura**.
5. Clique no botão **Redetectar Fontes de Captura**.
6. Selecione a fonte TWAIN atualizada e clique em **Salvar**.
7. Realize uma digitalização de teste para confirmar a normalização definitiva do tráfego de dados.

* **Dica:** Sempre prefira portas USB 3.0 (identificadas pela cor azul) e evite extensões ou cabos com comprimento superior a 2 metros, que atenuam o sinal de sincronismo TWAIN.
---
