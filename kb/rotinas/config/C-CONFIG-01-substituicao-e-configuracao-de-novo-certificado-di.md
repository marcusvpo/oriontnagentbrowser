---
id: C-CONFIG-01
titulo: Substituição e Configuração de Novo Certificado Digital A1 no Orion TN, SEFAZ e SIGNO
tags:
- Certificado Digital
- Certificado A1
- SEFAZ
- SIGNO
- Assinador Digital
objetivo: Instalar o novo certificado digital A1 (.pfx) da serventia após renovação anual e atualizar o apontamento de impressão digital (thumbprint) em todos os módulos de comunicação.
sinonimos:
- trocar certificado a1 vencido
- atualizar certificado digital no sistema
- erro no envio sefaz após troca de certificado
- configurar novo arquivo pfx no orion
perguntas_usuario:
- Renovamos nosso certificado digital A1, como atualizo ele dentro do Orion TN?
- O certificado venceu e agora o SIGNO e a SEFAZ dão erro de conexão, onde coloco o novo?
- Comprei o arquivo .pfx novo do cartório, quais telas do sistema precisam ser atualizadas?
sintomas_comuns:
- mensagem "Certificado Digital expirado ou revogado" ao tentar transmitir atos para a SEFAZ ou SIGNO
- assinador digital da Siplan abre em branco sem listar a autoridade certificadora válida
- falha no envio de lotes de selos digitais com rejeição de assinatura eletrônica
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A substituição de certificados digitais do tipo A1 exige atualização em duas etapas complementares: a importação física do arquivo `.pfx` no repositório criptográfico de certificados do Windows na estação emissora e a atualização da impressão digital (*thumbprint*) nos parâmetros de integração do Orion TN (SIGNO, SEFAZ-ITCMD e Assinador).

#### Passo a passo:
1. No computador do cartório onde ocorrem as comunicações, dê um duplo clique no arquivo `.pfx` do novo certificado.
2. No assistente do Windows, selecione **Máquina Local** (ou Usuário Atual), confirme o caminho, digite a senha da chave privada e marque a caixa **Marcar esta chave como exportável**.
3. Finalize a instalação no repositório automático (**Repositório Pessoal**).
4. Abra o Orion TN e acesse o menu **Configurações** > **Certificados Digitais / Assinador**.
5. Clique no botão **Localizar Certificado Instalado**, selecione o novo certificado na lista (conferindo a data de validade estendida) e clique em **Vincular**.
6. Acesse o menu **Comunicações** > **Parâmetros de Integração** > abra as abas **SIGNO** e **SEFAZ**, confirmando o apontamento do novo certificado e salvando.
7. Clique no botão **Testar Conexão com WebService**; o sistema deverá retornar mensagem de sucesso em verde: *"Comunicação Estabelecida com Sucesso"*.

* **Dica:** Mantenha uma cópia de segurança do arquivo `.pfx` e da senha mestra em local seguro e protegido, pois todas as estações que emitem atos digitais precisarão do mesmo certificado instalado.
---
