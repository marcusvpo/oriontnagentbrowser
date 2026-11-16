---
id: C-SELO-04
titulo: Substituição de Certificado Digital A1 Vencido no Servidor Daemon de Selos
tags:
- Certificado Digital
- A1
- PFX
- Servidor Linux
- Orion Selos
- Assinatura
objetivo: Instalar o novo arquivo de certificado digital padrão A1 no servidor do cartório e reconfigurar o serviço daemon de comunicação.
sinonimos:
- trocar certificado selo digital
- erro ssl selos servidor
- certificado expirado selagem
- renovar certificado a1 siplan
perguntas_usuario:
- Renovamos o certificado digital do cartório, como configurar no servidor para o selo voltar a funcionar?
- O sistema dá erro de falha na autenticação SSL ao transmitir selos, o que verificar?
- Onde colocar o novo arquivo .pfx do certificado digital no servidor Linux?
sintomas_comuns:
- paralisação súbita de todas as emissões de selos no início do expediente
- 'mensagem: Certificado digital revogado ou com cadeia expirada'
- serviço Orion Selos falha ao iniciar no gerenciador de daemons
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A comunicação segura e a assinatura dos lotes de selos exigem certificado ICP-Brasil corporativo válido no servidor da serventia. Ao vencer a anuidade, o novo arquivo `.pfx` deve ser apontado no daemon.

#### Passo a passo:
1. Obtenha o novo arquivo `.pfx` emitido pela Autoridade Certificadora e sua respectiva senha.
2. Acesse o servidor do cartório (via SSH no Linux ou Área de Trabalho Remota no Windows).
3. Copie o arquivo para o diretório padrão `/etc/siplan/certificados/` (ou `C:\Siplan\Certificados\`).
4. Ajuste as permissões de leitura no Linux: `chmod 644 /etc/siplan/certificados/novo_cert.pfx`.
5. No **Orion TN**, acesse **Configurações > Parâmetros de Integração > Certificado Digital**.
6. Aponte o novo caminho do arquivo, digite a nova senha e clique em **Testar Conexão**.
7. Reinicie o serviço de background executando `systemctl restart orionselos` (ou reinicie o serviço no Windows).
8. Gere um selo de teste em qualquer ato de balcão para validar a autorização pelo tribunal.

* **Prevenção:** Agende a renovação do certificado A1 com 15 dias de antecedência do vencimento para evitar interrupções no atendimento da serventia.
---
