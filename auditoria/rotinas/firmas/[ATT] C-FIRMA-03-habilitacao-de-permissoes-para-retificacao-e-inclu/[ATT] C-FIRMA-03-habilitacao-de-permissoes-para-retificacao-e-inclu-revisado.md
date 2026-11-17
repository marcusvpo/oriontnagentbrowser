---
id: C-FIRMA-03
titulo: Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: 2026-11-17
  status: atualizacao_editorial
  review_tags:
    - ATT
  carga: mutation
  worker_id: worker-3
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido:
      - administrador
    origem_requisito: passo 1
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: marcus
    sessao_usuario: marcus
    sessao_cargo: Teste
    sessao_perfis:
      - Perfil de acesso - Gerência webFirmas
      - Perfil de acesso - Gerência webCaixa
      - Perfil de acesso - Gerência webEstoque
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes:
        - Permissões Específicas
        - Balcão de Firmas
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: Configurações > Segurança > Usuários
        elemento_real: Configurações > Usuários
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: menu-tree | [data-orion-audit-menu-mmwk7fr8c3dds50-129] | x=850, y=150, 175x21
      - passo: 2
        alvo_documentado: Editar
        elemento_real: Alterar
        camada: dom_synonym_heuristic
        confianca: 0.92
        texto_alterado: false
      - passo: 3
        alvo_documentado: Grupo Firmas
        elemento_real: Escrevente de Firmas
        camada: dom_synonym_heuristic
        confianca: 0.98
        texto_alterado: false
        evidencia: dom-measured | text:escrevente de firmas | x=20, y=187, 133x13
  historico_reauditoria:
    - data: 2026-11-16
      ambiente_anterior: não registrado (anterior ao ADR-025)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: Insuficiência de Privilégio na Conta de Homologação
        motivo: A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de Firmas"
      bloqueio_atual:
        passo: 4
        tipo: Insuficiência de Privilégio na Conta de Homologação
      curas_reaproveitadas:
        - passo: 2
          alvo: Editar
          real: Alterar
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: Grupo Firmas
          real: Firmas
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: Configurações > Segurança > Usuários
          real: Configurações > Usuários
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: Insuficiência de Privilégio na Conta de Homologação
        motivo: 'A conta "marcus" ("Perfil de acesso - Gerência webFirmas", "Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque") não tem acesso a "Balcão de Firmas", citado no passo 4: a aplicação o marca como bloqueado para o perfil (item oculto pela aplicação para o perfil logado). Evi'
      bloqueio_atual:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      curas_reaproveitadas:
        - passo: 2
          alvo: Editar
          real: Alterar
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: Grupo Firmas
          real: Firmas
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: Configurações > Segurança > Usuários
          real: Configurações > Usuários
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: No passo 4, o manual cita "Permissões Específicas", "Balcão de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência
      bloqueio_atual:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      curas_reaproveitadas:
        - passo: 2
          alvo: Editar
          real: Alterar
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 3
          alvo: Grupo Firmas
          real: Escrevente de Firmas
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: Configurações > Segurança > Usuários
          real: Configurações > Usuários
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 4
    capturado_em: 2026-11-17T04:45:14.104Z
    rota: "#/usuario/alterar/1"
    titulo_painel: OrionTN - Tabelionatos de Notas
    em_modal: false
    secoes:
      - Alteração de usuário
    abas: []
    campos:
      - rotulo: Usuário
        tipo: text
      - rotulo: Nome
        tipo: text
      - rotulo: CPF ou CIN
        tipo: text
      - rotulo: Cargo
        tipo: text
      - rotulo: E-mail
        tipo: text
      - rotulo: Telefone principal
        tipo: text
      - rotulo: Telefone
        tipo: text
      - rotulo: Perfil de Usuário
        tipo: select
      - rotulo: Escrevente de Firmas
        tipo: checkbox
      - rotulo: Escrevente de Notas
        tipo: checkbox
      - rotulo: Escrevente e-Recepção
        tipo: checkbox
      - rotulo: Tabelião
        tipo: checkbox
      - rotulo: Supervisor
        tipo: checkbox
      - rotulo: Substituto
        tipo: checkbox
      - rotulo: Auxiliar
        tipo: checkbox
    botoes:
      - Salvar
      - Excluir
      - Voltar
    alvos_do_passo:
      - Permissões Específicas
      - Balcão de Firmas
    correspondencias_sugeridas:
      - alvo: Balcão de Firmas
        elemento_real: Escrevente de Firmas
        tipo: campo
        similaridade: 0.45
    alvos_sem_correspondencia:
      - Permissões Específicas
    sugestao_reescrita: "Sugestão de reescrita: no passo 4, substituir Balcão de Firmas por Escrevente de Firmas (campo). Permissões Específicas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida."
    print_contexto: passo-04.png
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T18:11:05.076Z
  governanca_comentario: "Passos 1 e 2 estão corretos. Nos passos 3 e 4 o agente destacou erroneamente o menu superior 'Firmas' (navbar) como se fosse 'Grupo de Trabalho > Grupo Firmas' (que não existe nesta tela) e acusou falso bloqueio de permissão em 'Balcão de Firmas'. A conta marcus (Perfil de acesso - Gerência webFirmas) possui 100% de permissão liberada. A rotina está desatualizada: o caminho real na tela atual é assinalar a opção 'Escrevente de Firmas' nos checkboxes do lado esquerdo da tela."
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Permissões Específicas", "Balcão de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Configurações > Perfis e permissões de acesso (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/usuario/alterar/1**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Alteração de usuário**.
> * **Campos:** **Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail**, **Telefone principal**, **Telefone**, **Perfil de Usuário**, **Escrevente de Firmas**, **Escrevente de Notas**, **Escrevente e-Recepção**, **Tabelião**, **Supervisor**, **Substituto**, **Auxiliar**.
> * **Botões:** **Salvar**, **Excluir**, **Voltar**.
> * **Correspondência sugerida para "Balcão de Firmas":** **Escrevente de Firmas** (campo, 45% — termo(s) em comum: firma).
> * **Sem correspondência funcional na tela:** **Permissões Específicas**.
> * Sugestão de reescrita: no passo 4, substituir **Balcão de Firmas** por **Escrevente de Firmas** (campo). **Permissões Específicas** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
A alteração de cartões de autógrafo é controlada por diretivas de segurança para impedir adulterações em firmas registradas. O operador deve estar vinculado ao grupo específico do balcão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Segurança > Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Segurança > Usuários"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Usuários"** (confiança: 95% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Selecione o operador e clique em **Editar**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Editar"**, porém na tela atual do Orion TN o elemento se chama **"Alterar"** (confiança: 92% — botão de ícone da primeira linha da grade, nome real lido do atributo title em x=1378, y=251, 11x13). O texto do manual não foi alterado.
3. Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Grupo Firmas"**, porém na tela atual do Orion TN o elemento se chama **"Escrevente de Firmas"** (confiança: 98% — Diretriz direta da revisão humana (C-FIRMA-03): "Grupo Firmas" -> "Escrevente de Firmas"). O texto do manual não foi alterado.
4. Na aba **Permissões Específicas**, expanda o módulo **Balcão de Firmas** e habilite:
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Permissões Específicas, Balcão de Firmas] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. **[x] Alterar Dados da Ficha de Firma**
6. **[x] Inserir Observações / Alertas no Cartão de Assinatura**
7. Clique em **Salvar**.
8. Solicite que o operador faça logoff e login no sistema para atualizar os privilégios.

* **Segurança Preventiva: Utilize o campo "Alerta do Cartão" para avisos de roubo de documentos, procurações revogadas ou assinaturas por outorga.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 4 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "Permissões Específicas", "Balcão de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 2):** "Editar" → "Alterar" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 3):** "Grupo Firmas" → "Escrevente de Firmas" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Configurações > Segurança > Usuários" → "Configurações > Usuários" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
