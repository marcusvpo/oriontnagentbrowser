---
id: C-GERAL-07
titulo: Validação de Quinhões e Frações Ideais Imobiliárias em 100% para Eliminação de Erros na DOI
tags:
- DOI
- Frações Ideais
- Quinhão
- Partilha
- Validação Matemática
objetivo: Ajustar a soma percentual das frações ideais transmitidas entre alienantes e adquirentes no protocolo para que totalizem exatamente 100%, evitando rejeições na Receita e CENSEC.
sinonimos:
- erro de fração ideal na doi
- soma dos quinhões não dá cem por cento
- quinhão divergente na declaração imobiliária
- como acertar percentual transmitido no protocolo
perguntas_usuario:
- O validador da DOI acusa que a soma das frações transmitidas é diferente de 100%, como conserto?
- Em uma escritura com vários compradores, como informo a porcentagem que cada um está adquirindo?
- Por que o arquivo da Receita rejeita a escritura com erro de quota-parte?
sintomas_comuns:
- 'rejeição no validador da DOI: "A soma das participações dos adquirentes deve totalizar 100,00%"'
- dízima periódica em frações de 1/3 gerando arredondamentos de 99,99% ou 100,01%
- erro no cadastro onde o escrevente colocou o percentual total em vez da fração adquirida por cada condômino
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Tanto o módulo da DOI da Receita Federal quanto a CENSEC impõem validação matemática estrita: a soma das cotas-partes alienadas e a soma das participações dos adquirentes sobre o bem devem totalizar impreterivelmente `100,00%` da transação (ou a fração exata do imóvel que está sendo objeto do negócio jurídico, quando se tratar de fração ideal destacada). Divergências de arredondamento impedem a consolidação do lote.

#### Passo a passo:
1. No Orion TN, acesse **Notas** > submenu **Protocolo** e abra o ato apontado com inconsistência.
2. Acesse a aba **Bens / Imóveis** e clique sobre o imóvel transacionado.
3. Na sub-aba **Participação das Partes / Quinhões**, observe a coluna **Percentual Transmitido (%)**.
4. Para os alienantes (vendedores/doadores): Assegure que a soma dos percentuais que estão sendo transmitidos feche em `100,00%` da operação.
5. Para os adquirentes (compradores/donatários): Verifique a divisão proporcional. Em caso de 3 adquirentes com cotas iguais, distribua como `33,34%`, `33,33%` e `33,33%` para fechar a soma em exatamente `100,00%`.
6. Clique no botão **Calcular e Equalizar Frações** para que o sistema valide a soma matemática.
7. Acesse a aba **DOI / Obrigações Fiscais** e acione **Atualizar Metadados de Frações**.
8. Clique em **Salvar Protocolo** (`F10`). O arquivo da DOI poderá ser regerado sem alertas de partilha inválida.

* **Dica:** Caso o negócio verse sobre apenas metade (50%) de um imóvel sob condomínio pro indiviso, marque a caixa **Alienação Parcial de Quinhão**, mantendo a soma das cotas dos novos proprietários em 100% sobre a fração alienada.
---
