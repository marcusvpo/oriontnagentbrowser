---
id: C-ACESSO-03
titulo: 'Redefinição de Senha e Reset de Autenticação em Dois Fatores (2FA) por Perda de Dispositivo'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['Administrador', 'Tabelião Titular']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: '4tabeliao.scs'
    sessao_cargo: 'TABELIAO'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webGed', 'Perfil de acesso - Gerência webLivros', 'Perfil de acesso - Gerência webPro', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Geral', 'Redefinir Senha Manualmente', 'Exigir troca no próximo logon']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Geral", "Redefinir Senha Manualmente", "Exigir troca no próximo logon", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Olá, 4 > Alterar senha (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A autenticação em dois fatores (2FA) vincula um segredo simétrico ao aplicativo móvel ou estação do usuário. Caso o dispositivo seja formatado, o relógio esteja dessincronizado ou o celular trocado, o código gerado deixará de coincidir com o servidor de validação. O Administrador do Orion TN pode desvincular a chave anterior e gerar uma nova semente QR Code para recadastramento imediato.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Faça logon no Orion TN utilizando uma conta com privilégios de **Administrador** ou **Tabelião Titular**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] Pré-requisito de perfil (Administrador ou Tabelião Titular) conferido na sessão real: A conta "4tabeliao.scs" é um perfil administrativo pleno reconhecido (perfil "Perfil de acesso - Gerência webFirmas"), que atende ao requisito Administrador ou Tabelião Titular.
2. Acesse o menu **Configurações** > submenu **Usuários**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
3. Selecione o colaborador impossibilitado de acessar e clique em **Alterar**.
   [aqui vai a print "passo-03.png"]
4. Para redefinição de senha: Na aba **Geral**, acione **Redefinir Senha Manualmente**, digite uma senha provisória segura e marque **Exigir troca no próximo logon**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Geral, Redefinir Senha Manualmente, Exigir troca no próximo logon] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. Para reset de autenticador: Acesse a aba **Segurança / Autenticação** e clique no botão **Resetar 2FA / Desvincular Dispositivo**.
6. Confirme o alerta de revogação de segurança clicando em **Confirmar Reset** e, em seguida, clique em **Salvar** (`F10`).
7. Instrua o colaborador a abrir o Orion TN na sua estação, digitar o login e senha provisória e apontar a câmera do aplicativo autenticador (ex: Google Authenticator) para escanear o novo QR Code exibido na tela.

* **Dica: Se o código 2FA continuar falhando logo após o cadastro do novo QR Code, verifique se o relógio do celular e o relógio do servidor do cartório estão sincronizados com a hora oficial de Brasília (NTP.br).**
