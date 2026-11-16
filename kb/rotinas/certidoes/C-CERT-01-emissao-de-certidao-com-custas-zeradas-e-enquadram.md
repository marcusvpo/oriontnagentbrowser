---
id: C-CERT-01
titulo: Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta
tags:
- Certidões
- Gratuidade
- Selo Isento
- Assistência Judiciária
- Custas Zeradas
objetivo: Configurar o pedido de certidão para gratuidade legal, garantindo que o sistema zere os emolumentos e gere o selo digital isento correspondente.
sinonimos:
- como fazer certidão com custas zeradas
- certidão gratuita assistência judiciária
- selo digital certidão isenta
- certidão sem custas orion tn
perguntas_usuario:
- Preciso emitir uma certidão com as custas zeradas para a Defensoria Pública, como proceder no Orion TN?
- O sistema está cobrando valor na certidão de assistência judiciária gratuita, onde mudo para isento?
- Como gerar o selo digital gratuito de certidão sem dar erro no tribunal?
sintomas_comuns:
- sistema calcula tabela cheia de emolumentos para pedidos requisitados pela Justiça
- tribunal rejeita selo digital porque o valor monetário informado foi zero sem indicação do enquadramento legal de isenção
- escrevente não localiza o campo de gratuidade no pedido de certidão
video:
  tem_video: false
modulo: certidoes
modulo_nome: Certidões e Buscas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Certidões emitidas sob assistência judiciária gratuita ou por requisição judicial possuem código de selo e regramento tributário próprio. O sistema exige a especificação do fundamento legal da isenção.

#### Passo a passo:
1. No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão** (ou **Notas > Certidões**).
2. No formulário inicial do pedido, altere o campo **Modalidade de Cobrança** de `Normal / Paga` para **Isenta / Gratuita**.
3. No campo **Motivo Legal da Gratuidade**, selecione o dispositivo correspondente (ex.: **Assistência Judiciária Gratuita**, **Requisição Judicial**, **Defensoria Pública** ou **Poder Público**).
4. Na aba **Cálculo de Custas**, certifique-se de que todas as linhas de emolumentos exibam `R$ 0,00`.
5. No editor da certidão, carregue o texto de breve relato ou inteiro teor.
6. Clique no botão **Finalizar e Emitir Selo Digital**.
7. O Orion TN transmitirá o selo ao tribunal sob a tipologia isenta homologada e emitirá o recibo zerado.

* **Auditoria de Gratuidade:** Sempre anexe o ofício judicial ou declaração de pobreza digitalizada no GED da certidão para respaldo em correições.
---
