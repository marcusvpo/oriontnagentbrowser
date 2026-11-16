---
id: C-SELO-08
titulo: Correção de Falha de Lote de Selos por Desconexão de Token e Assinador Local
tags:
- Token A3
- Assinador Local
- Falha de Lote
- Selo Digital
- Hardware
objetivo: Restabelecer a comunicação do token físico de assinatura digital A3 com o serviço assinador para liberação de lotes de selos travados.
sinonimos:
- token não reconhecido selos
- assinador local travado
- erro de leitora de cartão a3
- destravar lote de selos assinador
perguntas_usuario:
- O lote de selos não assina e diz que o assinador digital não foi localizado, como resolver?
- O token da leitora desconectou e travou a transmissão de selos, o que fazer?
- Como reiniciar o assinador de selos digitais do Orion TN na máquina?
sintomas_comuns:
- 'alerta: Falha ao invocar o serviço de assinatura digital local'
- token A3 conectado na USB mas com luz apagada ou travado no PIN
- lote de selos permanece com status Processando sem finalizar o envio
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando a serventia utiliza certificado padrão A3 (token USB ou cartão com leitora) em vez de A1, o serviço assinador local pode perder o handle criptográfico após suspensão do Windows ou oscilação de porta USB.

#### Passo a passo:
1. Feche o navegador e os módulos do **Orion TN** abertos na estação.
2. Desconecte o token ou leitora de cartão da porta USB e conecte em uma porta traseira estável.
3. Abra o aplicativo **Gerenciador de Certificados / Token** (ex.: SafeNet / SafeSign) e valide se o certificado está visível.
4. Na barra de tarefas do Windows (Systray), clique com botão direito no ícone do **Assinador Orion** e acione **Reiniciar Serviço**.
5. Abra o **Orion TN**, acesse **Módulos > Selo Digital > Transmissão de Lote**.
6. Selecione o lote pendente, insira o código PIN do token quando solicitado e conclua o envio.

* **Recomendação de TI:** Serventias com grande volume de selagem devem preferir certificados padrão A1 instalados em servidor para evitar travamentos por hardware de token.
---
