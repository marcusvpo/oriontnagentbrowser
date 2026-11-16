---
id: C-SELO-09
titulo: Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente
tags:
- Estoque
- Distribuição de Selos
- Sequência
- Traslado
- Consumo
objetivo: Estornar lotes de selos distribuídos por equívoco a um operador e restabelecer o sequencial cronológico correto para consumo.
sinonimos:
- distribuição de selos errada
- pulei a sequência de selos do estoque
- estornar lote de selos distribuídos
- sequência de traslados errada
perguntas_usuario:
- Distribuímos a sequência errada de selos para o escrevente no estoque, como desfazer?
- O sistema está puxando um número de selo que não corresponde aos papéis na gaveta do escrevente, como ajustar?
- Como estornar a entrega de selos físicos/digitais no Orion Estoque?
sintomas_comuns:
- escrevente tenta lavrar ato e o sistema sugere número de selo que não está em sua posse
- distribuição foi realizada saltando milhares de posições do lote central
- conflito entre o sequencial do livro de traslados e o controle de estoque
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
No Orion Estoque, os lotes de selos são entregues em pacotes sequenciais numerados. Se o administrador distribuir o lote 2 antes do lote 1, os escreventes consomem selos fora de ordem cronológica.

#### Passo a passo:
1. Acesse o módulo **Orion Estoque** com perfil de administrador.
2. Navegue até **Distribuição > Histórico de Distribuição**.
3. Localize a distribuição equivocada entregue ao operador.
4. Verifique se nenhum selo daquele lote já foi consumido em atos lavrados.
5. Clique no botão **Estornar Distribuição** e confirme o cancelamento.
6. Acesse a tela de **Nova Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador.
7. Solicite ao escrevente que atualize a tela de lavratura para carregar o novo numerador.

* **Fiscalização:** A quebra indevida da sequência de distribuição é apontada em relatórios de correição; sempre confira o número inicial antes de confirmar o lote.
---
