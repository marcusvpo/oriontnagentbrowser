---
id: C-GERAL-01
titulo: Correção de Rejeição de Guia de ITCMD na SEFAZ por Divergência na Natureza Jurídica
tags:
- ITCMD
- SEFAZ
- Natureza Jurídica
- Tributário
- Comunicações Fiscais
objetivo: Corrigir inconsistências na seleção da natureza do ato no Orion TN que causam rejeição automática de guias tributárias nos webservices da SEFAZ Estadual.
sinonimos:
- itcmd rejeitado pela sefaz
- erro na transmissão do itcmd
- natureza do ato incorreta no itcmd
- sefaz rejeita guia de doação
perguntas_usuario:
- Estamos tentando enviar o ITCMD de uma escritura de doação e a SEFAZ rejeita com erro de natureza, como conserto?
- Por que o sistema não transmite a declaração do imposto estadual?
- Como ajustar a classificação do negócio para a SEFAZ aprovar a transmissão do ITCMD?
sintomas_comuns:
- 'mensagem "Rejeição SEFAZ: Código de natureza do ato incompatível com a declaração de transmissão gratuita"'
- lote do ITCMD fica travado com ícone de exclamação vermelho no painel de comunicações
- escritura lavrada com partilha de bens cadastrada incorretamente como compra e venda comum no protocolo
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A Secretaria da Fazenda Estadual (SEFAZ) valida os lotes de ITCMD com base em tabelas padronizadas de fatos geradores. Se um protocolo for registrado no Orion TN com uma natureza genérica ou divergente do negócio jurídico real (ex: cadastrar como Doação Pura uma partilha por divórcio com excesso de meação), o validador fiscal do webservice rejeitará o lote por conflito de código de enquadramento tributário.

#### Passo a passo:
1. No Orion TN, acesse o menu **Notas** > submenu **Protocolo** e localize o ato rejeitado.
2. Na aba **Geral / Identificação**, localize o campo **Natureza do Negócio Jurídico**.
3. Clique no botão de pesquisa (`F3`) e selecione a natureza homologada específica para o fato gerador tributário (ex: **Doação de Imóveis com Reserva de Usufruto** ou **Inventário com Excesso de Quinhão**).
4. Acesse a aba **Partes** e confira se a correlação entre as partes atende às regras da SEFAZ (ex: vínculo expresso de Doador e Donatário).
5. Clique no botão **Salvar Protocolo**.
6. Navegue até o menu superior **Comunicações** > **SEFAZ - ITCMD**.
7. Localize o protocolo pendente, clique com o botão direito e selecione a opção **Regerar Dados Tributários do Protocolo**.
8. Acione o botão **Transmitir Lote para a SEFAZ** e acompanhe o retorno do recibo de entrega e código da guia.

* **Dica:** Sempre confirme com o escrevente do setor de Notas a exata subsunção tributária do ato antes de tentar retransmitir, garantindo fidelidade jurídica aos termos da minuta.
---
