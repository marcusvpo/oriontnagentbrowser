---
id: C-MINUTA-02
titulo: Falha na Mesclagem Automática de Variáveis de Qualificação de Partes e Imóveis
tags:
- Editor
- Qualificação
- Variáveis Dinâmicas
- Modelos
- Mesclagem
objetivo: Resolver falhas onde tags de substituição dinâmica não preenchem automaticamente os dados das partes e do imóvel na minuta.
sinonimos:
- tags não mesclam na minuta
- variáveis do editor não funcionam
- erro modelo qualificação partes
- não puxa dados do comprador no texto
perguntas_usuario:
- O editor do Orion TN não está mesclando a qualificação das partes, ficam aparecendo as tags no texto, o que fazer?
- Por que o modelo de qualificação de compradores não puxa os dados cadastrados no protocolo?
- 'Mensagem: Modelo padrão para tipo Editor - Qualificações não configurado, como resolver?'
sintomas_comuns:
- texto da minuta exibe códigos literais como `<<OUTORGANTE_NOME>>` ou `<<IMOVEL_DESCRICAO>>`
- 'mensagem ao abrir o editor: Modelo padrão de qualificação de partes não configurado ou sem permissão'
- escrevente precisa digitar manualmente qualificações que já estão no cadastro
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O preenchimento automático depende de duas regras: o usuário ter permissão de acesso ao modelo mestre de qualificação e as partes do protocolo estarem associadas às participações previstas no modelo.

#### Passo a passo:
1. No protocolo, acesse a aba **Partes** e garanta que todos os envolvidos possuem papel definido (ex.: Outorgante, Outorgado, Vendedor, Comprador).
2. Acesse **Configurações > Modelos de Minutas > Modelos de Qualificação de Partes**.
3. Selecione o modelo padrão da serventia e verifique a aba **Permissões de Usuários**, garantindo que o perfil do escrevente esteja marcado.
4. Na aba **Vínculo com Naturezas**, confira se a natureza do ato possui o modelo de qualificação associado.
5. Retorne à aba **Minuta** do protocolo e clique no botão **Remesclar Variáveis Dinâmicas**.
6. O Orion TN substituirá todas as tags pelos textos qualificativos formatados.

* **Permissões:** Em 90% das ocorrências de erro de modelo de qualificação, a causa é falta de permissão de acesso ao modelo concedida ao usuário logado.
---
