---
id: C-CENTRAL-02
titulo: Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações
tags:
- SISCOAF
- Pessoa Obrigada
- Habilitação de Preposto
- COAF
- Autenticação
objetivo: Regularizar a vinculação do CPF do escrevente responsável pelos envios perante o portal governamental do SISCOAF.
sinonimos:
- cpf não vinculado a pessoa obrigada ativa
- erro remetente siscoaf
- escrevente sem acesso siscoaf
- habilitar preposto coaf
perguntas_usuario:
- O sistema retorna que o CPF não está vinculado a uma Pessoa Obrigada ativa no SISCOAF, o que fazer?
- Como habilitar um novo escrevente para transmitir os relatórios do COAF no Orion TN?
- Por que o envio do COAF falha com erro de autorização de remetente?
sintomas_comuns:
- 'rejeição no gateway do COAF: O CPF informado não está vinculado a uma Pessoa Obrigada ativa'
- cartório trocou de substituto/escrevente responsável pelas transmissões
- tentativa de envio utilizando CPF do funcionário sem autorização prévia pelo titular
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
As comunicações de operações suspeitas e inocorrências só podem ser transmitidas por prepostos expressamente cadastrados pelo Tabelião Titular dentro do ambiente autenticado do SISCOAF.

#### Passo a passo:
1. O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.
2. Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.
3. Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.
4. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.
5. No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal.
6. Clique em **Gravar**.
7. Retorne à tela de envio do COAF e faça a transmissão do lote pendente.

* **Responsabilidade Legal:** Mantenha o cadastro de prepostos atualizado no SISCOAF e desative imediatamente o vínculo de funcionários desligados.
---
