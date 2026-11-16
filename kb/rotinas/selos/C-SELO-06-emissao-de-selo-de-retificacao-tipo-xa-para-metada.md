---
id: C-SELO-06
titulo: Emissão de Selo de Retificação (Tipo XA) para Metadados de Selo já Transmitido
tags:
- Retificação
- Selo XA
- Metadados
- Iniciais Incorretas
- TJSP
objetivo: Corrigir iniciais de partes, números de documentos ou datas de atos já comunicados ao tribunal através da emissão de selo retificador.
sinonimos:
- retificar selo digital
- selo tipo xa
- corrigir iniciais selo tj
- erro no documento do selo transmitido
perguntas_usuario:
- O selo já subiu para o tribunal com o nome do cliente errado, como corrigir?
- Como emitir um selo de retificação Tipo XA no Orion TN?
- Tem como alterar dados de um selo que já foi transmitido ao TJSP?
sintomas_comuns:
- campos do protocolo ficam bloqueados após a transmissão do selo ao tribunal
- tribunal rejeita alteração direta de atos já consolidados na base estadual
- necessidade de ajustar iniciais ou documento na certidão ou ficha de firma
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
De acordo com as normas da Corregedoria (TJSP), selos digitais transmitidos são imutáveis na base estadual. Qualquer correção superveniente deve ser formalizada através de um evento de retificação vinculado ao selo primitivo.

#### Passo a passo:
1. No **Orion TN**, localize o protocolo ou cartão de autógrafo afetado.
2. Acesse o menu de ações do ato e selecione **Retificação de Selo Digital**.
3. O sistema exibirá a janela de evento retificador.
4. No campo **Justificativa Legal**, digite a motivação (ex.: *"Correção material de iniciais da parte outorgante"*).
5. Preencha os novos dados retificados nos campos correspondentes.
6. Clique em **Confirmar e Gerar Selo de Retificação**.
7. O Orion TN gerará automaticamente o selo **Tipo XA**, vinculando-o ao selo original e transmitindo a atualização ao tribunal.

* **Importante:** O selo de retificação não gera novas custas de emolumentos ao cliente; trata-se de ato estritamente fiscal e regulatório.
---
