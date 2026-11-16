---
id: C-SELO-07
titulo: Enquadramento e Parametrização de Selos Sem Valor Econômico (Sem Valor 1 e 2)
tags:
- Selo Isento
- Sem Valor Econômico
- Emolumentos
- Gratuidade
- Tabela TJ
objetivo: Parametrizar corretamente atos gratuitos, certidões isentas e declarações sem valor patrimonial para atender às regras de selagem do tribunal.
sinonimos:
- erro sem valor econômico 2
- selo gratuito rejeitado
- enquadramento sem valor econômico
- como selar ato sem valor
perguntas_usuario:
- O sistema dá erro dizendo que não é possível comunicar sem valor econômico 2, o que significa?
- Como configurar as custas para gerar selo isento de escritura declaratória?
- Por que o selo sem valor econômico está saindo com valores de emolumentos no fechamento?
sintomas_comuns:
- 'rejeição no validador do TJ: Valor dos emolumentos incompatível com a regra de selo isento'
- operador selecionou ato sem valor mas manteve valores residuais preenchidos nas custas
- recibo estornado deixou o selo órfão distorcendo a conciliação
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A tabela de custas do Tribunal de Justiça estabelece distinção rígida entre atos declaratórios sem conteúdo patrimonial (Sem Valor 1) e atos com isenção legal por gratuidade (Sem Valor 2). O preenchimento indevido de custas gera rejeição imediata.

#### Passo a passo:
1. Abra o protocolo no **Orion TN** e vá até a aba **Custas / Emolumentos**.
2. No campo **Enquadramento Tributário / Tabela do TJ**, selecione a rubrica exata:
3. Utilize **Sem Valor Econômico 1** para escrituras declaratórias, emancipações e atas sem patrimônio.
4. Utilize **Sem Valor Econômico 2** para atos com gratuidade decorrente de assistência judiciária ou determinação legal.
5. Zere todos os valores lançados em campos não compatíveis com a isenção.
6. Se houver recibo financeiro estornado associado: gere um novo recibo definitivo no **Orion Caixa** para que o ato e o selo se correlacionem.
7. Clique em **Salvar** e retransmita o selo digital.

* **Boas Práticas:** Sempre consulte o Provimento de Custas vigente do estado para certificar se a declaração lavrada se enquadra na modalidade 1 ou 2.
---
