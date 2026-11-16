---
id: C-CENTRAL-01
titulo: Sanitização de Caracteres Especiais no Envio de Comunicações ao COAF / SISCOAF
tags:
- COAF
- SISCOAF
- XML
- Caracteres Especiais
- Apóstrofo
- Comunicações
objetivo: Sanitizar textos com apóstrofos, aspas e quebras de linha no campo de informações adicionais para evitar rejeição de schema XML pelo SISCOAF.
sinonimos:
- erro caracteres especiais coaf
- informações adicionais não pode conter caracteres
- rejeição schema xml siscoaf
- apóstrofo comarca coaf
perguntas_usuario:
- O COAF rejeitou a transmissão dizendo que informações adicionais não pode conter certos caracteres, como corrigir?
- Como enviar comunicação ao COAF de ato da comarca de Santa Bárbara D'Oeste sem dar erro no sistema?
- Por que o arquivo XML do SISCOAF é recusado quando colo o texto da escritura?
sintomas_comuns:
- 'mensagem do COAF: Informações adicionais não pode conter os caracteres ( < , > , & , " , '' )'
- envio de comunicação suspeita abortado no último dia do prazo legal
- texto colado do Word contendo aspas curvas ou quebras de parágrafo invisíveis
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O parser XML da API do SISCOAF é extremamente rígido. Caracteres reservados de formatação tipográfica e quebras de linha (`\r\n`) quebram a validação dos nós do documento eletrônico.

#### Passo a passo:
1. No **Orion TN**, acesse o menu **Administração > Comunicações > COAF**.
2. Localize a comunicação rejeitada e abra a aba **Informações Adicionais**.
3. Aplique a higienização textual obrigatória:
4. Substitua qualquer apóstrofo (`'`) por acento agudo (`´`) — ex.: altere `Santa Bárbara D'Oeste` para `Santa Bárbara D´Oeste`.
5. Se houver o caractere comercial `&`, substitua pela palavra `e` ou pela entidade `&amp;`.
6. Remova todas as aspas simples e duplas (`"` e `'`).
7. **Remova todos os Enters (quebras de linha):** mantenha o texto em um parágrafo único e contínuo.
8. Clique no botão **Salvar e Transmitir** para receber o protocolo de entrega imediato.

* **Norma COAF:** Sempre revise textos longos de fundamentação no Bloco de Notas antes de colar no campo de informações adicionais do COAF.
---
