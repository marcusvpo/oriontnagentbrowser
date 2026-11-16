---
id: M-40.0
titulo: 'Gerenciar Alíquotas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Validação Dependente de Gravação Real (Trava de Mutação Ativa)'
  prints_geradas: 6
  dry_run_mutations: true
  comandos_de_gravacao_nao_acionados:
    - passo: 5
      comando: 'Concluir '
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 6
      alvos_ausentes: ['Limpar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Alíquota'
        elemento_real: 'Configurações > Cadastros auxiliares > Alíquotas'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwjqgvrybdhulz-99] | x=467, y=135, 238x26'
      - passo: 4
        alvo_documentado: 'Editar'
        elemento_real: 'Alterar'
        camada: dom_synonym_heuristic
        confianca: 0.8
        texto_alterado: false
      - passo: 5
        alvo_documentado: 'Salvar'
        elemento_real: 'Concluir   '
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: false
        evidencia: 'dom-measured | @e30 | x=1254, y=232, 161x30'
  historico_reauditoria:
    - data: '2026-11-16'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_dados_banco'
      tags_anteriores: ['DDD']
      status_atual: 'dependencia_dados_banco'
      tags_atuais: ['DDD']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 4
        tipo: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
        motivo: 'No passo 4, a validação não pôde prosseguir: grade com 5 coluna(s) visível(is) (UF, Cidade, ITBI %, ISS %, Padrão) e 0 linhas de dados; mensagem da tela: "Não existem aliquota itbi cadastrados."; controles inativos: "Filtrar" (Preencha os campos obrigatório para efetuar a busca). Não existe botão Ad'
      bloqueio_atual:
        passo: 6
        tipo: 'Validação Dependente de Gravação Real (Trava de Mutação Ativa)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Cadastros auxiliares > Alíquota'
          real: 'Configurações > Cadastros auxiliares > Alíquotas'
          confirmada_ao_vivo: true
          usada_como_dica: true
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Validação Dependente de Gravação Real (Trava de Mutação Ativa)**.
>
> **Motivo Técnico:** No passo 6, o manual cita "Limpar", que não foram localizados na tela auditada (nenhum dos elementos citados). A auditoria rodou com a Trava Segura de Mutação: o comando "Concluir " (passo 5) foi localizado e demarcado, mas não foi acionado, para não gravar no banco de homologação. O elemento ausente pode depender do efeito dessa gravação. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Gerencia a tabela de alíquotas tributárias municipais e estaduais (ITBI, ITCMD e ISSQN) por comarca/cidade, alimentando os cálculos automáticos de tributos devidos no card de custas dos atos notariais.

#### Roteiro Técnico para Execução Manual:
1. Executar a rotina manualmente no ambiente de homologação até o passo 6, efetivando a gravação, e conferir se "Limpar" aparece.
2. Se o elemento existir após a gravação, aprovar a rotina manualmente; se não existir, corrigir o manual.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Alíquota** (ou **Administração > Parâmetros > Alíquotas**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Alíquotas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Alíquota"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Alíquotas"** (confiança: 90% — Rota comprovada numa auditoria anterior e reconfirmada na árvore de navegação real desta execução). O texto do manual não foi alterado.
2. Na listagem de alíquotas, localize a cidade pelo campo de pesquisa de município ou estado.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **UF** · (2) **Cidade**
   > [!NOTE] **Alvos implícitos demarcados (passo sem negrito):** **UF**, **Cidade**. O texto do manual não foi alterado.
3. Clique em **Filtrar** para visualizar os percentuais cadastrados para a localidade.
   [aqui vai a print "passo-03.png"]
4. Na linha da cidade desejada, clique em **Editar** para ajustar os campos:
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Editar"**, porém na tela atual do Orion TN o elemento se chama **"Alterar"** (confiança: 80% — botão de ícone da primeira linha da grade, identificado só pela classe do ícone (sem nome no DOM)). O texto do manual não foi alterado.
   * **Alíquota Geral de ITBI (%)**: percentual padrão sobre o valor da transação ou venal de referência.
   * **Alíquota Financiada (%)**: percentual reduzido incidente sobre a fração do SFH/alienação fiduciária, se aplicável.
5. Clique no botão **Salvar** para registrar os novos percentuais.
   [aqui vai a print "passo-05.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Salvar"**, porém na tela atual do Orion TN o elemento se chama **"Concluir   "** (confiança: 96% — Sinônimo canônico Orion TN ('Salvar' -> 'Concluir   ')). O texto do manual não foi alterado.
   > [!NOTE] **Trava Segura de Mutação (dry-run):** o comando **Concluir ** foi localizado, medido e demarcado na print, mas o clique final foi omitido para não gravar no banco de homologação. A ação foi validada visualmente, sem efetivar a gravação.
6. Para limpar os filtros da pesquisa, utilize o botão **Limpar**.
   [aqui vai a print "passo-06.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Limpar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar

* **Importante: Manter as alíquotas municipais atualizadas evita que o escrevente emita simulação de custas com imposto divergente do exigido pela prefeitura.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [DDD] dependencia_dados_banco → [DDD] dependencia_dados_banco
* **Bloqueio anterior:** passo 4 — Dependência de Dados no Banco de Homologação (Grade Vazia): No passo 4, a validação não pôde prosseguir: grade com 5 coluna(s) visível(is) (UF, Cidade, ITBI %, ISS %, Padrão) e 0 linhas de dados; mensagem da tela: "Não existem aliquota itbi cadastrados."; controles inativos: "Filtrar" (Preencha os campos obrigatório para efetuar a busca). Não existe botão Ad → **superado** (agora: passo 6, Validação Dependente de Gravação Real (Trava de Mutação Ativa))
* **Cura reaproveitada (passo 1):** "Notas > Cadastros auxiliares > Alíquota" → "Configurações > Cadastros auxiliares > Alíquotas" — reconfirmada ao vivo nesta execução (a dica anterior localizou o nó)
