---
id: C-FIRMA-03
titulo: Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma
tags:
- Firmas
- Ficha de Firma
- Permissões
- Cartão de Assinatura
- Alertas
objetivo: Conceder privilégios no perfil de operadores para alteração cadastral e inserção de avisos impeditivos em cartões de autógrafo.
sinonimos:
- não consigo alterar ficha de firma
- permissão cartão de assinatura
- colocar aviso no cartão de firma
- bloquear cartão de autógrafo
perguntas_usuario:
- Por que o sistema não deixa a escrevente alterar os dados de uma ficha de firma antiga?
- Onde coloco um alerta visual que aparece toda vez que alguém busca a ficha do cliente?
- Como liberar acesso para o atendente do balcão retificar RG e endereço no cartão de assinatura?
sintomas_comuns:
- botão Salvar ou Editar desabilitado na consulta de fichas de firma
- 'mensagem: Usuário sem permissão para alteração de dados de fichas de firmas'
- necessidade de registrar observação judicial ou alerta de fraude no cartão
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A alteração de cartões de autógrafo é controlada por diretivas de segurança para impedir adulterações em firmas registradas. O operador deve estar vinculado ao grupo específico do balcão.

#### Passo a passo:
1. Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Segurança > Usuários**.
2. Selecione o operador e clique em **Editar**.
3. Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.
4. Na aba **Permissões Específicas**, expanda o módulo **Balcão de Firmas** e habilite:
5. **[x] Alterar Dados da Ficha de Firma**
6. **[x] Inserir Observações / Alertas no Cartão de Assinatura**
7. Clique em **Salvar**.
8. Solicite que o operador faça logoff e login no sistema para atualizar os privilégios.

* **Segurança Preventiva:** Utilize o campo "Alerta do Cartão" para avisos de roubo de documentos, procurações revogadas ou assinaturas por outorga.
---
