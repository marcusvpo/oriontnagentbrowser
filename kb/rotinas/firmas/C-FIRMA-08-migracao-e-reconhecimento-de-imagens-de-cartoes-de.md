---
id: C-FIRMA-08
titulo: Migração e Reconhecimento de Imagens de Cartões de Assinatura em Novo Caminho de Rede
tags:
- Firmas
- Imagens
- GED
- Caminho de Rede
- Cartão de Assinatura
objetivo: Reconfigurar o diretório compartilhado de armazenamento das imagens digitalizadas dos cartões de autógrafo após migração de servidor.
sinonimos:
- imagens dos cartões não abrem
- caminho de imagens de firma mudou
- foto da assinatura sumiu
- reconfigurar pasta ged firmas
perguntas_usuario:
- Trocamos o servidor de arquivos do cartório e agora as assinaturas das fichas não aparecem na tela, como resolver?
- Onde configuro o caminho de rede onde ficam salvas as fotos dos cartões de firma?
- As fichas de firma abrem mas a imagem da assinatura fica com ícone de arquivo quebrado, o que fazer?
sintomas_comuns:
- painel de pré-visualização de assinaturas exibe tela cinza ou imagem não encontrada
- migração recente de estação ou servidor de arquivos da serventia
- 'sistema busca caminho antigo de rede (ex.: `\\servidor_antigo\siplan_imagens\`)'
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
As imagens digitalizadas de assinaturas não ficam armazenadas dentro do banco relacional, mas sim em diretório estruturado no servidor de arquivos (GED). Quando o servidor é renomeado ou migrado, o ponteiro de rede deve ser atualizado.

#### Passo a passo:
1. Assegure que a pasta compartilhada no novo servidor possui permissões completas de leitura/escrita para todos os usuários do cartório.
2. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Armazenamento e GED**.
3. Localize o campo **Caminho das Imagens do Balcão de Firmas / Assinaturas**.
4. Informe o novo caminho UNC (ex.: `\\novo_servidor\OrionTN_Imagens\Firmas\`).
5. Clique no botão **Testar Leitura de Diretório** e valide a mensagem de confirmação.
6. Clique em **Gravar**.
7. Abra uma ficha de firma de teste e certifique-se de que a imagem da assinatura é exibida instantaneamente na tela.

* **Infraestrutura:** Utilize caminhos UNC padrão de rede em vez de letras de unidades mapeadas (como `Z:\`) para evitar perda de vínculo ao trocar de usuário no Windows.
---
