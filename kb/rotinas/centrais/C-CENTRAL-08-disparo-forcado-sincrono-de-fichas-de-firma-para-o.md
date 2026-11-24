---
id: C-CENTRAL-08
titulo: Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN
tags:
- e-Notariado
- CCN
- Ficha de Firma
- Cartão de Autógrafo
- Sincronização
objetivo: Transmitir imediatamente um cartão de autógrafo recém-cadastrado para a nuvem nacional do e-Notariado sem aguardar o envio noturno.
sinonimos:
- ficha de firma não aparece no e-notariado
- cartão não subiu para ccn
- sincronizar firma imediata e-notariado
- envio forçado ccn
perguntas_usuario:
- Cadastramos a ficha de firma do cliente agora e outro cartório não consegue consultar no e-Notariado, como enviar na hora?
- Por que os novos cartões de assinatura demoram para aparecer no CCN do Colégio Notarial?
- Como forçar o envio de uma ficha de firma para o e-Notariado no Orion TN?
sintomas_comuns:
- cartório parceiro relata que o cidadão não possui ficha no e-Notariado para assinar ato remoto
- rotina automática padrão opera em lote diário programado apenas para a meia-noite
- urgência no balcão para lavratura de escritura eletrônica interestadual
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por padrão de economia de rede, o Orion TN acumula os cartões de autógrafo abertos e faz o upload em lote uma vez ao dia. Para atendimentos imediatos de atos digitais, a transmissão pode ser antecipada manualmente.

#### Passo a passo:
1. No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva com imagem da assinatura e biometria.
2. Acesse o menu **Administração > Comunicações > Outras comunicações**.
3. Na aba **Cartões de Autógrafo / Fichas de Firma**, informe o CPF ou número da ficha do cliente.
4. Selecione o registro na grade e clique no botão **Gerar / Enviar Imediatamente**.
5. O sistema executará o upload síncrono do payload com as assinaturas para os servidores do Colégio Notarial.
6. Confirme o recebimento do hash de transmissão.
7. Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível para consulta nacional.

* **Agilidade:** O envio imediato libera a assinatura digital de atos remotos em menos de 2 minutos pelo módulo de fluxo de assinaturas do e-Notariado.
---
