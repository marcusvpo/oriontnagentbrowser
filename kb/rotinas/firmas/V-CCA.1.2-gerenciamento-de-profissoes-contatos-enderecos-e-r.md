---
id: V-CCA.1.2
titulo: Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura
tags:
- firmas
- cartao de assinatura
- profissao
- contatos
- endereco
- pessoa juridica
- termo de comparecimento
objetivo: Cadastrar e gerenciar profissões vinculadas, múltiplos e-mails, telefones, endereços e vínculos de representação de pessoa jurídica no cartão de assinatura.
sinonimos:
- cadastrar nova profissao no cartao de assinatura
- adicionar empresa que a pessoa representa na firma
- colocar multiplos telefones no cartao de autografo
- vincular cnpj na ficha de firma
- autenticar firma de balcão
perguntas_usuario:
- Por que a profissão que digitei não ficou gravada no cartão de assinatura?
- Como cadastrar uma nova profissão que não existe na busca?
- Como adicionar múltiplos e-mails e telefones no cartão de assinatura e marcar o principal?
- Como vincular uma empresa (PJ) que a pessoa representa para sair no termo de comparecimento?
sintomas_comuns:
- vincular empresa que a pessoa assina no cartão
- adicionar procurador ou diretor no cartão de assinatura
- endereço e telefone não gravam na ficha de firma
- cadastrar profissão que não existe na lista do cartão
- representação de PJ não aparece na consulta de firma
- leitor biométrico ou câmera de captura não responde no momento da validação presencial
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=178
    video_timestamp: 02:58
    video_start_seconds: 178
  - parte: 2
    video_title: Cadastro Cartão de Assinatura pt 2 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 76bede7b-b314-4776-9e6f-3af28af1b54d
    video_url: https://iframe.mediadelivery.net/embed/467408/76bede7b-b314-4776-9e6f-3af28af1b54d?t=0
    video_timestamp: 00:00
    video_start_seconds: 0
  bunny_library_id: '467408'
  bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
  video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
  video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=0
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: V
categoria: videoaula_tutorial
versao_sistema: Orion TN 6.0
---

#### Descrição:
O cartão de assinatura permite estruturar de forma minuciosa as formas de contato (pessoal, residencial, comercial), múltiplos endereços e os vínculos societários/representativos com pessoas jurídicas, além de exigir a seleção padronizada de profissões na tabela do sistema para garantir integridade nas certidões e relatórios.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de assinatura**, clique em **Adicionar** e localize o campo **Profissão**:
   * **Atenção:** O campo profissão utiliza pesquisa obrigatória por tabela. Se você apenas digitar um texto livre e não selecionar um item da lista suspensa da lupa, o sistema **NÃO** gravará a profissão na ficha.
   * Digite o nome da profissão e clique na **Lupa** para buscar.
   * Se a profissão for localizada, clique sobre ela para selecioná-la.
   * Se a profissão **NÃO** existir no banco de dados: selecione o texto digitado, copie com **Ctrl+C**, clique no botão de adição (**+**) ao lado do campo, cole/digite o nome da nova profissão, clique em **Concluir** para registrar a profissão no sistema e, em seguida, selecione-a na lista de busca.
2. Na seção **Contato**:
   * **E-mails**: Clique no botão de adição (**+**) para incluir novos endereços de e-mail (ex.: E-mail Pessoal, E-mail Comercial). Para remover um registro incorreto, selecione e clique no botão de subtração (**-**).
   * **Telefones**: Clique no botão de adição (**+**) para inserir telefones (Celular, Comercial, Residencial). Marque a caixa de seleção **Principal** no telefone prioritário para que ele tenha preferência nas telas de consulta e identificação do sistema.
3. Na seção **Endereço**:
   * Clique no botão de adição (**+**) para inserir os dados do logradouro (tipo de endereço, CEP, rua, número, complemento, bairro, município e UF).
   * Defina qual é o endereço **Principal** marcando a opção correspondente.
4. Na seção **Pessoa Jurídica - Representante**:
   * Se a pessoa cadastrada assinar ou representar empresas (como administradora, sócia ou procuradora), clique no botão de adição (**+**).
   * Preencha o **Nome / Razão Social** da empresa e o **CNPJ** (campo de preenchimento obrigatório para efetivar o vínculo).
   * Caso haja mais de uma empresa vinculada à pessoa, marque a opção de empresa **Padrão** se desejar que essa PJ seja prioritária.
   * A empresa vinculada será automaticamente impressa no **Termo de Comparecimento** gerado no reconhecimento de firmas.
5. Após preencher todas as seções e verificar as informações, clique no botão **Concluir** para gravar o cartão de assinatura.

* **Observação:** O vínculo de Pessoa Jurídica na ficha de firma agiliza extraordinariamente o reconhecimento de firma por representação, evitando a necessidade de digitar dados da empresa a cada ato de firma presencial ou por autenticidade.
---

* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
