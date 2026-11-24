---
id: C-LIVRO-05
titulo: 'Geração de Termos de Abertura e Encerramento de Livros Notariais'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Livros > Gestão de Livros Notariais'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
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
        motivo: 'No passo 1, o manual cita "Livros > Gestão de Livros Notariais", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto par'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão de Livros Notariais" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administ'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão de Livros Notariais" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administ'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-24T17:11:46.794Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Livros > Gestão de Livros Notariais" -> "Administração > Controle de Livros" (#/livro)) não contém "Escrituras", "Procurações", "Testamentos", "Novo Livro (Abertura)", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Controle de livros", "Número", "Período de abertura", "Período de encerramento", "Status", "Tipo livro", "Inativos", "Filtrar", "Limpar", "Tipo", "Sigla", "Nº Livro", "Página atual", "Lado atual". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Todo livro notarial exige termos de abertura (no frontispício) e de encerramento (no fecho), com a qualificação da serventia, capacidade de folhas e assinatura da autoridade delegatária.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Livros > Gestão de Livros Notariais**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Livros**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Livros > Gestão de Livros Notariais"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por equivalência canônica explícita (Camada 1) ("Livros > Gestão de Livros Notariais" -> "Administração > Controle de Livros" (#/livro)) não contém "Escrituras", "Procurações", "Testamentos", "Novo Livro (Abertura)", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Controle de livros", "Número", "Período de abertura", "Período de encerramento", "Status", "Tipo livro", "Inativos", "Filtrar", "Limpar", "Tipo", "Sigla", "Nº Livro", "Página atual", "Lado atual".
2. Selecione o tipo de livro (ex.: **Escrituras**, **Procurações** ou **Testamentos**).
3. Para **Novo Livro (Abertura)**:
4. Clique em **Cadastrar Novo Livro**, informe o número, total de folhas e selecione **Emitir Termo de Abertura**.
5. Para **Livro Concluído (Encerramento)**:
6. Localize o livro que atingiu a última folha útil e clique no botão **Encerrar Livro**.
7. O sistema compilará a quantidade exata de atos lavrados e eventuais folhas inutilizadas.
8. Clique em **Visualizar e Imprimir Termo de Encerramento**.
9. Colete a assinatura do Tabelião ou Substituto e encaminhe o volume para a encadernação oficial.

* **Normas da CGJ: O termo de encerramento deve conter expressamente a ressalva de todas as folhas inutilizadas no decorrer do livro.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão de Livros Notariais" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administ → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
