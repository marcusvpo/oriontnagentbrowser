---
id: C-ATOS-01
titulo: Rejeição Cadastral em Centrais Notariais em Atos sem Imóvel ou com Partes Estrangeiras
tags:
- Lavratura
- Centrais Notariais
- CESDI
- SIGNO
- Estrangeiro
- Divórcio
objetivo: Corrigir parametrizações e erros de validação cadastral na transmissão de atos de divórcio sem partilha de bens e de partes estrangeiras.
sinonimos:
- titulares inválidos cesdi
- divórcio sem bens rejeitado
- cpf obrigatório estrangeiro censec
- erro comunicação signo ato
perguntas_usuario:
- O sistema rejeita a transmissão do divórcio para a CESDI dizendo que os titulares são inválidos, como resolver?
- Como enviar ato para a central quando uma das partes é estrangeira e não tem CPF?
- Por que a CESDI exige dados de imóvel se o divórcio não tem partilha de bens?
sintomas_comuns:
- 'rejeição CESDI: Ato exige obrigatoriamente os dados do titular do imóvel'
- validador acusa campo CPF obrigatório para cidadão com nacionalidade estrangeira
- natureza do ato vinculada erroneamente à exigência de bens patrimoniais
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando um ato de separação ou divórcio não envolve bens imóveis, a utilização da natureza padrão de divórcio gera rejeição na central por ausência de dados do bem. Da mesma forma, estrangeiros exigem indicação de UF específica.

#### Passo a passo:
1. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Naturezas de Atos**.
2. Crie ou selecione a natureza específica **Divórcio Direto S/ Imóvel** e, na aba de integrações, desmarque a exigência de bens imobiliários.
3. No protocolo do ato (menu **Notas > Protocolo**):
4. Se houver recibo emitido, estorne-o no **Orion Caixa** para liberar a alteração do protocolo.
5. Altere a natureza do ato para a nova opção configurada sem imóvel.
6. Na aba **Partes**, ao editar o estrangeiro: marque **Nacionalidade** como `Estrangeiro`, insira o Passaporte/RNE no documento e selecione **UF** = `EX`.
7. Salve o protocolo, emita o novo recibo e acesse **Comunicações > Centrais Notariais** para retransmitir com sucesso.

* **Regra Central:** A sigla "EX" (Exterior) é o único padrão aceito pelas centrais notariais para dispensar a exigência de CPF de partes domiciliadas fora do país.
---
