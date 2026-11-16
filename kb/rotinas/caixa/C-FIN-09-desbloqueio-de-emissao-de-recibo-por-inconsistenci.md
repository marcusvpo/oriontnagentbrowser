---
id: C-FIN-09
titulo: Desbloqueio de Emissão de Recibo por Inconsistência nos Dados do Solicitante
tags:
- Recibo
- Solicitante
- Tomador
- Caracteres Especiais
- Validação
objetivo: Eliminar caracteres invisíveis e quebras de linha coladas no cadastro do solicitante que travam a emissão do recibo financeiro.
sinonimos:
- recibo não emite erro solicitante
- dados do tomador pendentes recibo
- sistema diz que falta solicitante preenchido
- trava de emissão de recibo
perguntas_usuario:
- O sistema acusa dados do solicitante pendentes mas já preenchi tudo no protocolo, por que não emite o recibo?
- Como destravar a geração de recibo com erro de informações do tomador?
- Por que o botão de gerar recibo não conclui e volta para a tela de solicitante?
sintomas_comuns:
- 'mensagem: Dados cadastrais do tomador/solicitante incompletos ou inválidos'
- dados foram copiados e colados de mensagens de WhatsApp ou documentos PDF
- campos visivelmente preenchidos na tela mas rejeitados pelo motor de validação
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A cópia direta de cadastros a partir de navegadores ou mensageiros costuma injetar caracteres não imprimíveis (tabulações, quebras de linha `\r\n` e espaços especiais) que invalidam o schema de dados do recibo.

#### Passo a passo:
1. No **Orion TN**, abra o protocolo através do menu **Notas > Protocolo**.
2. Navegue até a aba **Solicitante / Tomador**.
3. Selecione e apague completamente o conteúdo dos campos **Nome / Razão Social**, **CPF/CNPJ** e **Endereço**.
4. Digite novamente os dados diretamente pelo teclado físico, sem usar colar.
5. Certifique-se de selecionar o tipo de pessoa correto (Física ou Jurídica).
6. Clique no botão **Salvar** do protocolo.
7. Acesse a aba **Financeiro** e clique em **Emitir Recibo**, que será processado imediatamente.

* **Prevenção:** Evite utilizar atalhos de colar (`Ctrl + V`) diretamente em campos de identificação fiscal para impedir a contaminação por formatações externas.
---
