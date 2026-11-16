---
id: C-CERT-02
titulo: Desbloqueio para Emissão de Certidão sobre Protocolo com Status de Ato Retificado
tags:
- Certidões
- Ato Retificado
- Rerratificação
- Desbloqueio
- Status do Ato
objetivo: Permitir a emissão de certidão de escrituras que sofreram rerratificação, consolidando os vínculos registrais do acervo.
sinonimos:
- não consigo emitir certidão de ato retificado
- protocolo retificado bloqueia certidão
- certidão de escritura com rerratificação
- erro certidão ato retificado
perguntas_usuario:
- O protocolo está com status de Ato Retificado e o sistema não deixa puxar na certidão, como resolver?
- Como emitir certidão de uma escritura que foi retificada por outra escritura?
- Por que a busca de certidões não localiza um ato que foi aditado?
sintomas_comuns:
- 'mensagem ao buscar ato para certidão: O protocolo informado encontra-se em trâmite de rerratificação'
- escrevente tenta emitir inteiro teor mas o sistema impede a seleção do livro e folha
- ato de retificação foi aberto no sistema mas não teve seu status formalmente finalizado
video:
  tem_video: false
modulo: certidoes
modulo_nome: Certidões e Buscas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Para resguardar a fé pública, o motor de certidões bloqueia a emissão direta sobre protocolos com trâmite de rerratificação pendente. É indispensável que a escritura retificadora esteja lavrada ou o status regularizado.

#### Passo a passo:
1. Acesse o menu **Notas > Protocolo** e localize o protocolo da escritura retificadora.
2. Verifique se a escritura de rerratificação já foi assinada e encadernada no livro.
3. Altere o status do protocolo retificador para `Lavrado / Concluído` e salve.
4. No protocolo da escritura primitiva, confirme que a anotação marginal da rerratificação está vinculada.
5. Acesse **Certidões > Novo Pedido de Certidão** e informe o Livro e Folha da escritura primitiva.
6. O sistema liberará o pedido e, na geração do inteiro teor, incluirá automaticamente a nota de rerratificação no rodapé.
7. Conclua a emissão e a selagem da certidão.

* **Fé Pública:** A certidão de inteiro teor de ato retificado deve conter obrigatoriamente a transcrição de ambas as escrituras (primitiva e retificadora).
---
