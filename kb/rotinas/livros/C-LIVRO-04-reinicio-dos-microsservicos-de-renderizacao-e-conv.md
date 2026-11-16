---
id: C-LIVRO-04
titulo: Reinício dos Microsserviços de Renderização e Conversão Documental (Docker)
tags:
- Servidor
- Docker
- Conversão de Documentos
- Editor
- Livro
- Traslado
objetivo: Reiniciar a stack de containers de renderização de PDF/DOCX no servidor da serventia quando o carregamento de livros travar.
sinonimos:
- editor do livro tela branca
- falha ao converter livro e traslado
- serviço de documento travado docker
- erro carregar texto escritura
perguntas_usuario:
- O editor de livros e traslados está com a tela branca em todas as máquinas do cartório, o que reiniciar?
- Por que o sistema não converte a minuta para PDF na hora de visualizar o livro?
- Como reiniciar os microsserviços de documentos do Orion TN no servidor?
sintomas_comuns:
- todas as estações apresentam tela de carregamento infinita ao abrir a aba Livro ou Traslado
- 'mensagem: Falha ao estabelecer comunicação com o microsserviço de conversão documental'
- ocorrência generalizada em todo o cartório após queda de energia no servidor
video:
  tem_video: false
modulo: livros
modulo_nome: Livros Notariais e Folhas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A geração em alta fidelidade do livro e do traslado depende dos containers Docker `orion-document-service` e `orion-conversion`. Se o serviço perder conexão com a memória ou congelar, o editor falha ao converter os formatos.

#### Passo a passo:
1. Acesse o servidor central do cartório com credenciais administrativas.
2. Abra o terminal do **PowerShell** ou aplicativo **Docker Desktop**.
3. Execute o comando de reinício dos microsserviços documentais:
4. `docker restart orion-document-service orion-conversion`
5. Aguarde cerca de 30 a 45 segundos para que as portas internas sejam reestabelecidas.
6. Execute `docker ps` e valide se ambos os containers exibem o status `Up (healthy)`.
7. Nas estações de trabalho, feche e reabra o navegador.
8. Acesse qualquer protocolo em **Notas > Protocolo**, abra a aba **Livro** e confirme a renderização imediata do documento.

* **Suporte de TI:** Reiniciar apenas a máquina cliente não resolve a falha se o container central no servidor estiver parado.
---
