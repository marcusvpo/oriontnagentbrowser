---
id: C-FIRMA-03
titulo: 'Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Insuficiência de Privilégio na Conta de Homologação'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webFirmas', 'Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque']
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Segurança > Usuários'
        elemento_real: 'Configurações > Usuários'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwjq2fytf626gz-127] | x=706, y=187, 219x26'
      - passo: 2
        alvo_documentado: 'Editar'
        elemento_real: 'Alterar'
        camada: dom_synonym_heuristic
        confianca: 0.92
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Grupo Firmas'
        elemento_real: 'Firmas'
        camada: a11y_fuzzy_match
        confianca: 0.86
        texto_alterado: false
        evidencia: 'dom-measured | text:firmas | x=363, y=1, 72x50'
      - passo: 4
        alvo_documentado: 'Balcão de Firmas'
        elemento_real: '(não localizado na tela)'
        camada: permission_blocked
        confianca: 0
        texto_alterado: false
  historico_reauditoria:
    - data: '2026-11-16'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: 'Insuficiência de Privilégio na Conta de Homologação'
        motivo: 'A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de Firmas"'
      bloqueio_atual:
        passo: 4
        tipo: 'Insuficiência de Privilégio na Conta de Homologação'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Editar'
          real: 'Alterar'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: 'Grupo Firmas'
          real: 'Firmas'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Configurações > Segurança > Usuários'
          real: 'Configurações > Usuários'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Insuficiência de Privilégio na Conta de Homologação**.
>
> **Motivo Técnico:** A conta "marcus" ("Perfil de acesso - Gerência webFirmas", "Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque") não tem acesso a "Balcão de Firmas", citado no passo 4: a aplicação o marca como bloqueado para o perfil (item oculto pela aplicação para o perfil logado). Evidência no DOM: li.functionality.ngx-orion-hide. O elemento existe no sistema; o texto original foi preservado.

#### Descrição:
A alteração de cartões de autógrafo é controlada por diretivas de segurança para impedir adulterações em firmas registradas. O operador deve estar vinculado ao grupo específico do balcão.

#### Roteiro Técnico para Execução Manual:
1. Liberar a funcionalidade "Balcão de Firmas" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.
2. Reexecutar a auditoria desta rotina e revisar as prints geradas.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Segurança > Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Segurança > Usuários"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Usuários"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Selecione o operador e clique em **Editar**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Editar"**, porém na tela atual do Orion TN o elemento se chama **"Alterar"** (confiança: 92% — botão de ícone da primeira linha da grade, nome real lido do atributo title em x=1363, y=333, 14x17). O texto do manual não foi alterado.
3. Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Grupo Firmas"**, porém na tela atual do Orion TN o elemento se chama **"Firmas"** (confiança: 86% — Similaridade semântica na árvore de acessibilidade (83%)). O texto do manual não foi alterado.
4. Na aba **Permissões Específicas**, expanda o módulo **Balcão de Firmas** e habilite:
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Alvo bloqueado para o perfil logado:** **"Balcão de Firmas"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (item oculto pela aplicação para o perfil logado — li.functionality.ngx-orion-hide).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Insuficiência de Privilégio na Conta de Homologação: "Balcão de Firmas" está bloqueado para o perfil logado (item oculto pela aplicação para o perfil logado)
5. **[x] Alterar Dados da Ficha de Firma**
6. **[x] Inserir Observações / Alertas no Cartão de Assinatura**
7. Clique em **Salvar**.
8. Solicite que o operador faça logoff e login no sistema para atualizar os privilégios.

* **Segurança Preventiva: Utilize o campo "Alerta do Cartão" para avisos de roubo de documentos, procurações revogadas ou assinaturas por outorga.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 4 — Insuficiência de Privilégio na Conta de Homologação: A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de Firmas" → **mantido** (agora: passo 4, Insuficiência de Privilégio na Conta de Homologação)
* **Cura reaproveitada (passo 2):** "Editar" → "Alterar" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 3):** "Grupo Firmas" → "Firmas" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Configurações > Segurança > Usuários" → "Configurações > Usuários" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
