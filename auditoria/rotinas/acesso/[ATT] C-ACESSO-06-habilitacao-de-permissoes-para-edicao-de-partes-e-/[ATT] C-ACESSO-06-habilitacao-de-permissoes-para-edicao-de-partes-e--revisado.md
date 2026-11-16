---
id: C-ACESSO-06
titulo: 'Habilitação de Permissões para Edição de Partes e Imóveis em Protocolos em Andamento'
modulo: acesso
secao: C
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
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Grupos e Perfis de Acesso'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Grupos e Perfis de Acesso", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Controle de Estoque > Cadastros > Grupos de distribuição; Configurações > Perfis e permissões de acesso (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Com o objetivo de prevenir fraudes e adulterações inadvertidas, perfis padrão do grupo de escreventes podem estar configurados com travas que impedem a edição de protocolos após a geração inicial do número de apontamento. Quando a rotina de trabalho exige que múltiplos operadores colaborem no mesmo protocolo, os parâmetros de edição pré-finalização devem ser habilitados no perfil do grupo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações** > submenu **Grupos e Perfis de Acesso**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Grupos e Perfis de Acesso"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Grupos e Perfis de Acesso"
2. Selecione o grupo operacional correspondente (ex: **Escreventes de Notas**) e clique em **Alterar**.
3. Na árvore de módulos e rotinas, expanda o nó **Notas** > **Protocolo** > **Operações Básicas**.
4. Marque as caixas de seleção obrigatórias:
   * **[x] Permitir Alteração de Protocolo em Andamento**
   * **[x] Editar Partes, Qualificações e Representantes**
   * **[x] Adicionar / Modificar Bens e Imóveis**.
5. Se desejado permitir a colaboração cruzada entre colegas, marque também **[x] Alterar Protocolos Criados por Outros Usuários do Mesmo Setor**.
6. Clique no botão **Gravar** (`F10`).
7. **Ação Fundamental:** Solicite a todos os escreventes do setor afetado que realizem **Logoff** do sistema e façam login novamente para recarregar a tabela de permissões de sessão.

* **Dica: Não conceda essa permissão ao perfil de estagiários ou recepcionistas; reserve a alteração plena de dados jurídicos aos perfis de prepostos escreventes e substitutos.**
