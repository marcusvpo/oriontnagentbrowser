---
id: C-SELO-09
titulo: 'Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-2.7', 'D-2.4']
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'marcus'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['Estornar Distribuição']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Distribuição'
          deduzido_do_dom: false
          resultado: sem_efeito
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
        motivo: 'No passo 1, o manual cita "Orion Estoque", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insu'
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
        motivo: 'No passo 1, o manual cita "Orion Estoque", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Orion Estoque", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração '
      bloqueio_atual:
        passo: 5
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 5, a tela está sem dados (grade com 12 coluna(s) visível(is) (Produto, Portador, Distribuído por, Data, Série, Seq. Inicial) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha os campos obrigatórios para efetuar a busca)). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: D-2.7 — Cadastrar Produto; D-2.4 — Cadastrar Categoria de Produto.

#### Descrição:
No Orion Estoque, os lotes de selos são entregues em pacotes sequenciais numerados. Se o administrador distribuir o lote 2 antes do lote 1, os escreventes consomem selos fora de ordem cronológica.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-2.7 (Cadastrar Produto) para criar o registro necessário.
2. Executar antes a rotina D-2.4 (Cadastrar Categoria de Produto) para criar o registro necessário.
3. Reexecutar a auditoria da rotina C-SELO-09.

* **Rotinas pré-requisito (executar antes):** **D-2.7**, **D-2.4**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Administração > Controle de Estoque > Distribuição** com perfil de administrador.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Estoque** · (3) **Distribuição**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Série, Sequência inicial, Sequência final).
2. Acesse a aba **Consulta**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Portador, Distribuído por, Data, Série, Seq. Inicial).
3. Localize a distribuição equivocada entregue ao operador.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Portador, Distribuído por, Data, Série, Seq. Inicial).
4. Verifique se nenhum selo daquele lote já foi consumido em atos lavrados.
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Portador, Distribuído por, Data, Série, Seq. Inicial).
5. Clique no botão **Estornar Distribuição** e confirme o cancelamento.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Produto, Portador, Distribuído por, Data, Série, Seq. Inicial).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Estornar Distribuição] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
6. Acesse a aba **Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador.
7. Solicite ao escrevente que atualize a tela de lavratura para carregar o novo numerador.

* **Fiscalização: A quebra indevida da sequência de distribuição é apontada em relatórios de correição; sempre confira o número inicial antes de confirmar o lote.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Orion Estoque", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração  → **superado** (agora: passo 5, Dependência Cruzada de Rotina)
