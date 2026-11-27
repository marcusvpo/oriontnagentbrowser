---
id: C-FIN-02
titulo: 'Liberação de Permissão para Estorno de Recolhimento Definitivo e Recibos'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador', 'tabelião']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'marcus'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Permitir Estorno de Recolhimento Definitivo', 'Permitir Estorno de Recibo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Perfis de Acesso / Usuários'
        elemento_real: 'Configurações > Usuários'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxyybbu3zhmd6-129] | x=850, y=150, 175x21'
      - passo: 2
        alvo_documentado: 'Escrevente / Caixa'
        elemento_real: 'Escrevente '
        camada: a11y_fuzzy_match
        confianca: 0.95
        texto_alterado: false
        evidencia: 'dom-measured | @e831 | x=1179, y=218, 113x26'
      - passo: 3
        alvo_documentado: 'Financeiro > Orion Caixa > Recolhimento'
        elemento_real: 'Administração > Comunicações > Recolhimento'
        camada: menu_path_resolution
        confianca: 0.8
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxz08339dfd84-59] | x=474, y=171, 190x21'
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-26T19:55:02.535Z'
    rota: '#/recolhimentoDefinitivo'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Recolhimento']
    abas: []
    campos:
      - rotulo: 'Período recolhimento'
        tipo: 'text'
      - rotulo: 'Estorno'
        tipo: 'checkbox'
    botoes: ['Filtrar', 'Limpar']
    alvos_do_passo: ['Permitir Estorno de Recolhimento Definitivo', 'Permitir Estorno de Recibo']
    correspondencias_sugeridas:
      - alvo: 'Permitir Estorno de Recolhimento Definitivo'
        elemento_real: 'Período recolhimento'
        tipo: 'campo'
        similaridade: 0.52
    alvos_sem_correspondencia: ['Permitir Estorno de Recibo']
    contexto_catalogo_nivel1:
      id_tela: '047'
      menu: 'Administração > Comunicações > Recolhimento'
      rota: '#/recolhimentoDefinitivo'
      nivel: 2
      estado_nivel2: 'no_substates'
      abas: []
      secoes: ['Recolhimento']
      tabelas: ['Data do recolhimento', 'Responsavel pelo recolhimento', 'Status']
      alvos_ausentes_nivel2: ['Permitir Estorno de Recibo']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 4, substituir Permitir Estorno de Recolhimento Definitivo por Período recolhimento (campo). Permitir Estorno de Recibo não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Permitir Estorno de Recolhimento Definitivo", "Permitir Estorno de Recibo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Recolhimento diário; Relatórios > Recolhimento resumido; Administração > Comunicações > Recolhimento (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/recolhimentoDefinitivo**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Recolhimento**.
> * **Campos:** **Período recolhimento**, **Estorno**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**.
> * **Correspondência sugerida para "Permitir Estorno de Recolhimento Definitivo":** **Período recolhimento** (campo, 52% — termo(s) em comum: recolhimento).
> * **Sem correspondência funcional na tela:** **Permitir Estorno de Recibo**.
> * **Contexto do Catálogo Nível 2 (`047`, consultivo):** tela **Administração > Comunicações > Recolhimento** | tabelas: **Data do recolhimento**, **Responsavel pelo recolhimento**, **Status**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Permitir Estorno de Recibo** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 4, substituir **Permitir Estorno de Recolhimento Definitivo** por **Período recolhimento** (campo). **Permitir Estorno de Recibo** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
O privilégio de desfazimento contábil de recolhimentos definitivos é restrito por padrão. Quando um colaborador necessita operar retificações no caixa, a permissão deve ser concedida no perfil e a sessão precisa ser renovada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com login de administrador ou tabelião, acesse no **Orion TN** o menu **Configurações > Perfis de Acesso / Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Perfis de Acesso / Usuários"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Usuários"** (confiança: 88% — Equivalência de folha: "Perfis de Acesso / Usuários" ≡ "Usuários" (mesma chave de folha sob "Configurações")). O texto do manual não foi alterado.
2. Localize e edite o perfil do colaborador (ex.: **Escrevente / Caixa**).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Escrevente / Caixa"**, porém na tela atual do Orion TN o elemento se chama **"Escrevente "** (confiança: 95% — Similaridade semântica na árvore de acessibilidade (95%)). O texto do manual não foi alterado.
3. Na árvore de módulos, expanda **Financeiro > Orion Caixa > Recolhimento**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Recolhimento**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Financeiro > Orion Caixa > Recolhimento"**, porém na versão atual do Orion TN a tela fica em **"Administração > Comunicações > Recolhimento"** (confiança: 80% — Item "Recolhimento" localizado na árvore de navegação em outra rota (0 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
4. Marque as opções **Permitir Estorno de Recolhimento Definitivo** e **Permitir Estorno de Recibo**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Permitir Estorno de Recolhimento Definitivo, Permitir Estorno de Recibo] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. Clique no botão **Gravar / Salvar**.
6. Solicite ao usuário que realize obrigatoriamente **Logoff** do sistema e efetue um novo **Login** para carregar os novos tokens de segurança.

* **Boas Práticas: A alteração de perfis de acesso no Orion TN só surte efeito na estação após o escrevente encerrar e reabrir a sessão do navegador.**
