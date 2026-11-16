---
id: C-ACESSO-01
titulo: 'Criação de Novo Colaborador e Atribuição de Funções Notariais'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-11'
  status: validado_com_sucesso
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  prints_geradas: 5
---

#### Descrição:
No Orion TN, o cadastro de novos prepostos e colaboradores é centralizado no menu de **Configurações > Usuários**. A interface real do sistema opera com preenchimento unificado dos dados cadastrais básicos (**Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail** e **Telefones**) e permite definir o **Perfil de Usuário** por lista suspensa, além de marcar diretamente por caixas de seleção as atribuições específicas da serventia (**Escrevente de Notas**, **Escrevente de Firmas**, **Escrevente e-Recepção**, **Tabelião**, **Supervisor**, **Substituto** ou **Auxiliar**).

#### Passo a passo revisado:
1. Na barra superior do Orion TN, localize e clique no menu **Configurações**.
   [aqui vai a print "passo-01.png"]
2. Na listagem geral de usuários, localize o canto inferior direito e clique no botão **Adicionar +**.
   [aqui vai a print "passo-02.png"]
3. No formulário **Cadastro de usuário**, preencha os campos obrigatórios: **Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail** e **Telefone principal**.
   [aqui vai a print "passo-03.png"]
4. No campo **Perfil de Usuário**, selecione o perfil de acessos padrão e marque as funções notariais correspondentes às atividades do preposto (ex: **Escrevente de Notas**, **Escrevente de Firmas**).
   [aqui vai a print "passo-04.png"]
5. Após o preenchimento, confirme o cadastro clicando em **Salvar e incluir novo** (ou retorne em **Voltar**).
   [aqui vai a print "passo-05.png"]

* **Observação de Interface Real:** Ao abrir o cadastro, o sistema exibe o aviso em destaque: *"Após o cadastro do usuário será necessário incluí-lo em um perfil de acesso do módulo."*
* **Dica / Caso Real do 0800:** Se a opção **Sem e-mail** estiver marcada, o Orion TN exibirá a senha provisória diretamente na tela para ser informada ao novo operador no primeiro acesso.
