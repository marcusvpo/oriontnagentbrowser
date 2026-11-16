---
id: M-22.0
titulo: 'Criar um Novo Livro e Configurar seus Parâmetros'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Número do Livro']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Livros'
        elemento_real: 'Firmas'
        camada: a11y_fuzzy_match
        confianca: 0.83
        texto_alterado: false
        evidencia: 'dom-measured | text:firmas | x=501, y=1, 72x50'
      - passo: 2
        alvo_documentado: 'Livro de Notas'
        elemento_real: 'Notas'
        camada: a11y_fuzzy_match
        confianca: 0.71
        texto_alterado: false
        evidencia: 'dom-measured | text:notas | x=573, y=1, 67x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Número do Livro", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite cadastrar um novo volume ou livro notarial na serventia, definindo sua tipologia, numeração de livro, intervalo sequencial de folhas, permissões de acesso por escrevente e texto de abertura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Livros** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Firmas > Livros"**, porém na tela atual do Orion TN o elemento se chama **"Firmas"** (confiança: 83% — Similaridade semântica na árvore de acessibilidade (79%)). O texto do manual não foi alterado.
2. No campo **Tipo de Livro**, selecione a categoria desejada (ex: **Termo de Comparecimento**, **Livro de Notas**, **Livro de Procurações**).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Livro de Notas"**, porém na tela atual do Orion TN o elemento se chama **"Notas"** (confiança: 71% — Similaridade semântica na árvore de acessibilidade (67%)). O texto do manual não foi alterado.
3. Informe o **Número do Livro** (ex: `46`).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Número do Livro] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Preencha a numeração sequencial: indique a **Folha Inicial** (ex: `1`), a **Folha Final** (ex: `200`) e a **Folha Atual** inicial.
5. No campo **Proprietário / Permissão**, defina quem poderá escriturar no livro: marque **Todos** para uso compartilhado da equipe ou selecione um **Escrevente** específico.
6. Na seção **Termo de Abertura**, digite ou selecione o modelo do texto padrão de abertura e clique no botão **Salvar**.

* **Importante: Verifique com precisão a folha inicial e final conferindo fisicamente as folhas rubricadas do livro encadernado.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
