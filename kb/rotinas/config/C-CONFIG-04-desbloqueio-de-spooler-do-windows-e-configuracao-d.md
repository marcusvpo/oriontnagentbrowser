---
id: C-CONFIG-04
titulo: Desbloqueio de Spooler do Windows e Configuração de Impressora de Cupom Fiscal e Recibo
tags:
- Spooler de Impressão
- Impressora de Cupom
- Caixa
- Elgin i9
- Daruma
- Bematech
objetivo: Destravar a fila de impressão retida no spooler do Windows e configurar a impressora térmica não fiscal de recibos do caixa após troca de porta USB ou travamento.
sinonimos:
- impressora de recibo não imprime
- recibo do caixa travado na fila
- reiniciar spooler de cupom
- configurar elgin i9 no orion tn
perguntas_usuario:
- O caixa recebe o pagamento mas a impressora de recibos não sai nada e apita, como destravar?
- Trocamos a impressora de cupom da recepção e o sistema não reconhece o novo modelo, como configurar?
- Como limpar a fila de impressão presa do cupom fiscal no Windows?
sintomas_comuns:
- fila de impressão do Windows exibe documentos com status "Erro - Imprimindo" ou retidos indefinidamente
- módulo de Caixa exibe mensagem de timeout ao tentar emitir comprovante de depósito prévio ou recibo definitivo
- 'impressora trocou de porta USB física (ex: de USB001 para USB002) e o sistema continuou disparando para a porta antiga'
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Impressoras térmicas de cupom (Elgin i9, Daruma DR800, Bematech MP-4200) utilizam drivers de comunicação serial virtual ou direta via USB. Quando uma impressão é interrompida por falta de papel ou falha de porta, o serviço de Spooler do Windows bloqueia novos disparos. É necessário purgar a fila pendente e reassociar o dispositivo ativo dentro do módulo financeiro do Orion TN.

#### Passo a passo:
1. Feche o módulo de Caixa no Orion TN.
2. No Windows, abra a janela Executar (`Win + R`), digite `services.msc` e pressione Enter.
3. Localize o serviço **Spooler de Impressão**, clique com o botão direito e selecione **Reiniciar** (ou execute o comando `Restart-Service Spooler` no PowerShell como Administrador).
4. Acesse **Painel de Controle** > **Dispositivos e Impressoras**, abra a fila da impressora de cupom e confirme se a fila foi esvaziada. Imprima uma página de teste nativa do Windows.
5. Abra o Orion TN e acesse o menu **Configurações** > **Configurações do Caixa / Recibos**.
6. Clique no botão **Atualizar Lista de Impressoras Conectadas**.
7. No campo **Impressora Padrão de Recibos**, selecione o driver ativo correspondente (ex: *ELGIN i9 Receipt*).
8. Marque a opção **Ativar Comando de Corte Automático (Guilhotina)** se o modelo possuir o dispositivo físico.
9. Clique no botão **Salvar Configurações** e emita uma reimpressão de recibo no Caixa para certificar a operação.

* **Dica:** Oriente os caixas a nunca puxarem o papel com a mão antes do corte automático da guilhotina, evitando que o rolete dentado trave e gere erros de leitura no sensor de mídia.
---
