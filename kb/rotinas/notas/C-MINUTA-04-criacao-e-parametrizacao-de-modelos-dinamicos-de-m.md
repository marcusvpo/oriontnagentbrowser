---
id: C-MINUTA-04
titulo: Criação e Parametrização de Modelos Dinâmicos de Minutas com Variáveis de Sistema
tags:
- Modelos
- Minutas
- Tags Dinâmicas
- Variáveis
- Padronização
objetivo: Criar modelos corporativos de escrituras e procurações padronizadas com inserção de variáveis dinâmicas de partes, imóveis e custas.
sinonimos:
- como criar modelo de minuta
- adicionar tags automáticas no modelo
- cadastrar modelo de escritura
- variáveis disponíveis no editor
perguntas_usuario:
- Como cadastrar um novo modelo de escritura de doação com reserva de usufruto no Orion TN?
- Onde vejo a lista de variáveis automáticas que posso colocar no modelo da minuta?
- Como fazer o modelo puxar a qualificação completa do imóvel automaticamente?
sintomas_comuns:
- escreventes redigem minutas do zero a cada atendimento por falta de modelos no sistema
- inconsistência de redação jurídica entre diferentes escreventes da mesma serventia
- dúvida sobre qual tag utilizar para extenso de valores ou número de matrícula
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Os modelos dinâmicos padronizam a redação dos atos e aceleram a lavratura, permitindo que os metadados do protocolo sejam inseridos no texto em tempo de execução sem digitação repetitiva.

#### Passo a passo:
1. Acesse o menu **Configurações > Modelos de Minutas > Cadastro de Modelos**.
2. Clique no botão **Novo Modelo**, informe o título (ex.: **Escritura Padrão de Compra e Venda - Urbana**) e vincule à respectiva natureza jurídica.
3. No editor de modelos, redija a estrutura jurídica padrão da escritura.
4. Nos locais das informações variáveis, clique no botão **Inserir Variável** na barra de ferramentas:
5. Insira as tags de partes (ex.: `<<QUALIFICACAO_COMPLETA_OUTORGANTES>>`).
6. Insira as tags de bens (ex.: `<<DESCRICAO_COMPLETA_IMOVEIS>>`, `<<VALOR_NEGOCIO_EXTENSO>>`).
7. Clique no botão **Gravar Modelo**.
8. Abra um protocolo daquela natureza e comprove que o modelo é sugerido automaticamente para carregamento na aba Minuta.

* **Eficiência:** Utilize modelos estruturados para garantir que cláusulas obrigatórias de combate à lavagem de dinheiro (Provimento 88) constem em todas as escrituras.
---
