---
id: C-CENTRAL-04
titulo: Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC
tags:
- CENSEC
- SIGNO
- Token JWT
- API Key
- Erro 401
- Comunicações
objetivo: Gerar e parametrizar um novo token JWT de acesso na plataforma SIGNO para restabelecer os envios de CEP, CESDI e RCTO.
sinonimos:
- token censec expirado
- erro 401 unauthorized signo
- falha comunicação cep cesdi
- trocar token api censec
perguntas_usuario:
- Todas as transmissões para a CENSEC começaram a dar erro 401 Unauthorized, o que aconteceu?
- Como gerar um novo token de integração na plataforma SIGNO do CNB?
- Onde colo a chave de API da CENSEC dentro do Orion TN?
sintomas_comuns:
- todas as transmissões de CEP, CESDI e RCTO falham em bloco no início da quinzena
- 'mensagem: Falha na autenticação com os serviços CENSEC / Token de acesso inválido'
- comunicação funcionava normalmente até o término da validade do token anual
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por segurança, os tokens de API fornecidos pelo Colégio Notarial do Brasil (CNB/SIGNO) possuem prazo de expiração. Ao vencer, o Orion TN perde autorização para realizar chamadas ao webservice da CENSEC.

#### Passo a passo:
1. Acesse o portal oficial do **SIGNO / CENSEC** (`signo.censec.org.br`) com o certificado digital do Tabelião.
2. Navegue até **Configurações da Serventia > Integração / API / Tokens**.
3. Clique no botão **Gerar Novo Token de Integração / API Key** e copie a chave extensa gerada.
4. No **Orion TN**, acesse com perfil de administrador: **Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC**.
5. Cole a nova chave no campo **Token de Acesso (API Key)**.
6. Clique no botão **Validar Conexão com SIGNO** e confirme a mensagem de sucesso.
7. Clique em **Salvar**.
8. Acesse a tela de envio da CENSEC e retransmita os lotes pendentes da quinzena.

* **Organização:** Anote na agenda do cartório a data de validade do token emitido no SIGNO para renová-lo preventivamente antes do vencimento.
---
