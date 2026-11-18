---
id: C-ACESSO-08
titulo: 'Promoção de Colaborador de Auxiliar para Escrevente com Habilitação de Lavratura e Estoque'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Parâmetros Notariais', '[x] Autorizado a Lavrar Escrituras, Procurações e Atas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'Cargo / Função'
        elemento_real: 'Cargo'
        camada: a11y_fuzzy_match
        confianca: 0.73
        texto_alterado: false
        evidencia: 'dom-measured | text:cargo | x=1138, y=100, 30x16'
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
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Parâmetros Notariais", "[x] Autorizado a Lavrar Escrituras, Procurações e Atas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não ma'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Cargo / Função'
          real: 'Cargo'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-18'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Parâmetros Notariais", "[x] Autorizado a Lavrar Escrituras, Procurações e Atas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou ocult'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 3
          alvo: 'Cargo / Função'
          real: 'Cargo'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-18T01:40:52.124Z'
    rota: '#/usuario/alterar/1'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Alteração de usuário']
    abas: []
    campos:
      - rotulo: 'Usuário'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'Cargo'
        tipo: 'text'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Telefone principal'
        tipo: 'text'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'Perfil de Usuário'
        tipo: 'select'
      - rotulo: 'Escrevente de Firmas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente de Notas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente e-Recepção'
        tipo: 'checkbox'
      - rotulo: 'Tabelião'
        tipo: 'checkbox'
      - rotulo: 'Supervisor'
        tipo: 'checkbox'
      - rotulo: 'Substituto'
        tipo: 'checkbox'
      - rotulo: 'Auxiliar'
        tipo: 'checkbox'
    botoes: ['Salvar', 'Excluir', 'Voltar']
    alvos_do_passo: ['Parâmetros Notariais', '[x] Autorizado a Lavrar Escrituras, Procurações e Atas']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Parâmetros Notariais', '[x] Autorizado a Lavrar Escrituras, Procurações e Atas']
    sugestao_reescrita: 'Sugestão de reescrita: Parâmetros Notariais, [x] Autorizado a Lavrar Escrituras, Procurações e Atas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Parâmetros Notariais", "[x] Autorizado a Lavrar Escrituras, Procurações e Atas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas > Consultas > Índice de escrituras e procurações; Administração > Envio de escrituras para Registro; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/usuario/alterar/1**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Alteração de usuário**.
> * **Campos:** **Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail**, **Telefone principal**, **Telefone**, **Perfil de Usuário**, **Escrevente de Firmas**, **Escrevente de Notas**, **Escrevente e-Recepção**, **Tabelião**, **Supervisor**, **Substituto**, **Auxiliar**.
> * **Botões:** **Salvar**, **Excluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Parâmetros Notariais**, **[x] Autorizado a Lavrar Escrituras, Procurações e Atas**.
> * Sugestão de reescrita: **Parâmetros Notariais**, **[x] Autorizado a Lavrar Escrituras, Procurações e Atas** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
A nomeação formal de um escrevente exige atualizações que vão além de uma simples troca de descrição textual no cadastro. O Orion TN valida regras estritas na emissão de livros notariais e repasse de selos: o operador deve ter o cargo alterado, o atributo de "Praticante de Atos Notariais" ativado e o vínculo habilitado nas tabelas do módulo Orion Estoque.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações** > submenu **Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
2. Selecione o colaborador promovido e clique no botão **Alterar**.
   [aqui vai a print "passo-02.png"]
3. No campo **Cargo / Função**, altere de *Auxiliar de Cartório* para *Escrevente Notarial* (ou *Escrevente Substituto* conforme a portaria de nomeação).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Cargo / Função"**, porém na tela atual do Orion TN o elemento se chama **"Cargo"** (confiança: 73% — Cura comprovada numa auditoria anterior (a11y_fuzzy_match) e reconfirmada ao vivo: o elemento "Cargo" foi medido na tela desta execução). O texto do manual não foi alterado.
4. Na aba **Parâmetros Notariais**, marque a caixa **[x] Autorizado a Lavrar Escrituras, Procurações e Atas**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Parâmetros Notariais, [x] Autorizado a Lavrar Escrituras, Procurações e Atas] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. Insira a portaria de nomeação judicial no campo **Referência de Homologação / Portaria Corregedoria**.
6. Mude o grupo de acesso na aba **Perfis** para **Escreventes Autorizados**.
7. Acesse o módulo **Orion Estoque** > menu **Administração** > **Habilitação de Operadores**, localize o usuário e marque **[x] Autorizado a Receber Carga de Papéis de Segurança e Selos**.
8. Clique em **Salvar** em ambos os módulos. Solicite um novo logon do usuário.

* **Dica: Após a promoção, lembre-se de cadastrar a assinatura digital (ICP-Brasil) do novo escrevente nos parâmetros do assinador para possibilitar a lavratura remota pelo e-Notariado.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 4 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "Parâmetros Notariais", "[x] Autorizado a Lavrar Escrituras, Procurações e Atas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou ocult → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 3):** "Cargo / Função" → "Cargo" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
