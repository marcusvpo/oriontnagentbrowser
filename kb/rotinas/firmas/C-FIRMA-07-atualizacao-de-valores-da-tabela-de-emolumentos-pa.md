---
id: C-FIRMA-07
titulo: Atualização de Valores da Tabela de Emolumentos para Materialização e Cópias
tags:
- Firmas
- Materialização
- Tabela de Emolumentos
- Custas
- Reajuste
objetivo: Atualizar os valores de atos de materialização eletrônica e cópias autenticadas nos parâmetros operacionais do módulo de firmas.
sinonimos:
- atualizar valor da materialização
- custas de cópia e autenticação desatualizadas
- reajuste anual de firmas
- sistema calculando materialização errada
perguntas_usuario:
- O sistema está cobrando o valor antigo na materialização de documentos, como atualizar?
- Onde altero o valor unitário da cópia autenticada no Orion TN?
- Como aplicar o reajuste anual de emolumentos no balcão de firmas?
sintomas_comuns:
- cálculo do balcão exibe valor defasado em relação à tabela vigente do tribunal
- escrevente precisa corrigir o valor da materialização manualmente a cada pedido
- diferença no recolhimento do Sinoreg por cobrança de valor inferior ao provimento
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Determinados serviços de balcão (como materialização de certidões eletrônicas e apostilamento) possuem parametrização de valor fixo direto nos parâmetros do módulo de firmas, além da tabela geral.

#### Passo a passo:
1. Acesse **Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas**.
2. Localize a linha do serviço correspondente (ex.: **Materialização de Documento Eletrônico**).
3. Atualize o campo **Valor dos Emolumentos** com o valor fixado no provimento anual do estado.
4. Confira os campos de repasses legais (Fundo do Tribunal, Carteira de Previdência e ISS) para garantir o fechamento exato da soma.
5. Clique no botão **Gravar Parâmetros**.
6. Abra um novo pedido no balcão e valide que o sistema puxa o valor oficial automaticamente.

* **Vigência:** Os reajustes anuais de custas vigoram a partir de 1º de janeiro de cada ano; aplique a atualização sempre na virada do exercício fiscal.
---
