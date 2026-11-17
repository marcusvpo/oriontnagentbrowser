---
id: V-7.5.3
titulo: 'Desbloqueio e Controle de Acesso para Edição de Livros e Atos Já Impressos'
modulo: acesso
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Canetinha', 'Livro', 'Impressão Definitiva', 'Impresso']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Canetinha", "Livro", "Impressão Definitiva", "Impresso", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloq'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-17T06:25:55.707Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['Canetinha', 'Livro', 'Impressão Definitiva', 'Impresso']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Canetinha', 'Livro', 'Impressão Definitiva', 'Impresso']
    sugestao_reescrita: 'Sugestão de reescrita: Canetinha, Livro, Impressão Definitiva, Impresso não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Canetinha", "Livro", "Impressão Definitiva", "Impresso", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo; Configurações > Modelos de impressão; Configurações > Modelos de impressão > Configuração de impressão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **Canetinha**, **Livro**, **Impressão Definitiva**, **Impresso**.
> * Sugestão de reescrita: **Canetinha**, **Livro**, **Impressão Definitiva**, **Impresso** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

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

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Canetinha", "Livro", "Impressão Definitiva", "Impresso", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloq → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
