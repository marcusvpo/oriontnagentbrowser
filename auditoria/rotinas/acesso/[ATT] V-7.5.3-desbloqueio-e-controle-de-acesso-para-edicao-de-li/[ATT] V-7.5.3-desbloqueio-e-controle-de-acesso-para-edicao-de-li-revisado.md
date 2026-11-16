---
id: V-7.5.3
titulo: 'Desbloqueio e Controle de Acesso para Edição de Livros e Atos Já Impressos'
modulo: acesso
secao: V
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Canetinha', 'Livro', 'Impressão Definitiva', 'Impresso']
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
> **Motivo Técnico:** No passo 1, o manual cita "Canetinha", "Livro", "Impressão Definitiva", "Impresso", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo; Configurações > Modelos de impressão; Configurações > Modelos de impressão > Configuração de impressão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Detalhamento dos bloqueios de segurança aplicados pelo **ORION TN** após a realização da impressão definitiva de livros e traslados, e os procedimentos controlados para liberação de edição mediante credenciais de supervisor/substituto ou alteração de status operacional conforme perfil de acesso.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Ao tentar clicar no ícone da **Canetinha** de uma versão do **Livro** que já passou pela **Impressão Definitiva**, o sistema identificará o documento com o status de **Impresso** e exibirá uma tela de bloqueio de segurança.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Canetinha, Livro, Impressão Definitiva, Impresso] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Para desbloquear a edição do texto caso seja estritamente necessário retificar o ato:
   * **Método 1 (Autorização Direta por Supervisor):** Na janela de solicitação de credenciais, solicite que o **Tabelião**, **Substituto** ou **Supervisor** informe seu **Usuário** e **Senha** de autorização. O sistema liberará o acesso à tela do LibreOffice para ajustes controlados.
   * **Método 2 (Alteração Manual de Status de Impressão):** Na tabela de versões de impressão do editor, localize a coluna de **Status de Impressão** (ícone indicativo de documento impresso). Caso o perfil do seu usuário possua privilégios administrativos concedidos, clique sobre o ícone e altere o status de **Impresso** para **Editando**. Com o status revertido para **Editando**, o documento poderá ser aberto pela **Canetinha** sem exigir a tela de senha.
3. Realizadas as correções necessárias no editor, clique no botão **Concluir** para salvar as alterações.
4. Execute novamente o processo de conferência e reemissão conforme as normas correcionais da serventia.

* **Método 1 (Autorização Direta por Supervisor): Na janela de solicitação de credenciais, solicite que o **Tabelião**, **Substituto** ou **Supervisor** informe seu **Usuário** e **Senha** de autorização. O sistema liberará o acesso à tela do LibreOffice para ajustes controlados.**
* **Método 2 (Alteração Manual de Status de Impressão): Na tabela de versões de impressão do editor, localize a coluna de **Status de Impressão** (ícone indicativo de documento impresso). Caso o perfil do seu usuário possua privilégios administrativos concedidos, clique sobre o ícone e altere o status de **Impresso** para **Editando**. Com o status revertido para **Editando**, o documento poderá ser aberto pela **Canetinha** sem exigir a tela de senha.**
* **Atenção: As travas de segurança existem para preservar a integridade jurídica e a fé pública dos atos lavrados no cartório. Qualquer intervenção em atos com status impresso deve ser respaldada pela titularidade ou substituição legal do cartório.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
