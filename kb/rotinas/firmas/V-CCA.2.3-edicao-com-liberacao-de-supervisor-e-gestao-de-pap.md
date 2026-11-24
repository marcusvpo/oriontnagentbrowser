---
id: V-CCA.2.3
titulo: Edição com Liberação de Supervisor e Gestão de Papel de Segurança (Consumo, Estorno e Inutilização)
tags:
- firmas
- cartao de assinatura
- edicao de ficha
- senha de supervisor
- papel de seguranca
- formulario de seguranca
- inutilizacao de papel
- estoque
objetivo: Editar dados cadastrais com autenticação de supervisor e gerenciar o consumo, reserva, devolução ao estoque ou inutilização de formulários de papel de segurança.
sinonimos:
- alterar nome ou cpf no cartao de assinatura
- pedir senha de supervisor para alterar ficha
- consumir papel de seguranca na ficha de firma
- devolver papel de seguranca para o estoque
- inutilizar papel de seguranca no cartao
- acerto de contas do caixa
perguntas_usuario:
- Como alterar o nome ou documento de uma ficha de firma que já teve atos reconhecidos?
- Por que o campo de CPF está travado na edição do cartão de assinatura?
- Como vincular e consumir o papel de segurança na ficha de firma?
- Qual a diferença entre status Reservado e Consumido no papel de segurança?
- Como devolver um papel de segurança cancelado para o estoque?
- Como inutilizar definitivamente uma folha de papel de segurança?
sintomas_comuns:
- alterar dados do cartão exige liberação de supervisor
- senha de supervisor não autoriza edição de ficha de firma
- papel de segurança do cartão consumido por engano
- como estornar ou inutilizar papel de segurança de cartão
- salvar alterações em cartão de assinatura já homologado
- escrevente não consegue localizar o protocolo no módulo Caixa para baixar o pagamento
video:
  tem_video: true
  partes:
  - parte: 1
    video_title: Cadastro Cartão de Assinatura pt 1 - Orion TN
    bunny_library_id: '467408'
    bunny_video_id: 8b0225b8-ab00-44a2-a03e-5a3cb3f07f99
    video_url: https://iframe.mediadelivery.net/embed/467408/8b0225b8-ab00-44a2-a03e-5a3cb3f07f99?t=628
    video_timestamp: '10:28'
    video_start_seconds: 628
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
Quando um cartão de assinatura já possui atos notariais ou reconhecimentos de firma vinculados em seu histórico, os campos sensíveis de identificação (como Nome e Documentos) são bloqueados pelo sistema para segurança jurídica, exigindo liberação por senha de supervisor. Além disso, esta rotina abrange todo o ciclo de vida do papel/formulário de segurança no cartão: consumo, controle de status (Reservado/Consumido), estorno para o estoque e inutilização definitiva.

#### Passo a passo:
1. Acesse **Firmas > Cadastros > Cartão de assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**).
2. Para **Editar Campos Sensíveis Bloqueados (Nome / Documentos)**:
   * Caso o cadastro já possua atos praticados, campos como Nome e CPF estarão desabilitados para edição direta.
   * Localize e clique no botão **Editar** posicionado ao lado do campo restrito.
   * O sistema solicitará autenticação administrativa; insira o **Login** e **Senha** de um usuário com perfil de **Supervisor** e confirme.
   * O campo será liberado para que o escrevente realize a devida retificação cadastral.
3. Para **Consumir o Papel de Segurança (Formulário)**:
   * Na seção de controle de papel/formulário de segurança da tela de edição do cartão, clique no botão **Consumir**.
   * O sistema abrirá a lista de papéis de segurança disponíveis no estoque da serventia.
   * Selecione o formulário desejado (o sistema permite selecionar qualquer folha disponível no estoque, inclusive fora da ordem sequencial estrita).
   * Clique no botão **Concluir**.
   * Observe que o sistema atribuirá inicialmente o status de **Reservado** ao papel selecionado.
   * Ao clicar em **Concluir** no formulário principal do cartão de assinatura para salvar as alterações, o status do papel de segurança mudará automaticamente para **Consumido**, efetivando a vinculação legal da folha à ficha.
4. Para **Estornar o Papel de Segurança de Volta ao Estoque (Reutilizar)**:
   * Se o papel consumido ou reservado não for mais utilizado nesta ficha e estiver em perfeitas condições de reaproveitamento, clique no ícone de seta **Reutilizar**.
   * O sistema desvinculará o número do formulário da ficha e devolverá o papel para o **Estoque**, tornando-o novamente disponível para uso em qualquer outro cartão.
5. Para **Inutilizar Definitivamente o Papel de Segurança**:
   * Se a folha de segurança física foi danificada, rasurada ou extraviada:
   * Clique no ícone **X** (**Inutilizar**).
   * O sistema cancelará e inutilizará o formulário de segurança no banco de dados, impedindo permanentemente que essa numeração de papel seja reutilizada em qualquer ficha ou ato da serventia.
6. Clique no botão **Concluir** para salvar a edição do cartão de assinatura.

* **Observação:** Todas as movimentações de consumo, devolução e inutilização de formulários de segurança são registradas automaticamente nos relatórios de controle de estoque do Orion TN para prestação de contas à Corregedoria.
---

* **Dica / Caso Real do 0800:** Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.
