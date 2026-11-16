---
id: V-3.0
titulo: 'Como Consultar o Estoque de Produtos'
modulo: selos
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Categoria', 'Produto', 'Data']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Consultas > Estoque'
        elemento_real: 'Administração'
        camada: a11y_fuzzy_match
        confianca: 0.81
        texto_alterado: false
        evidencia: 'dom-measured | text:administração | x=733, y=1, 119x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Categoria", "Produto", "Data", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Controle de Estoque > Cadastros > Categoria; Administração > Controle de Estoque > Cadastros > Produto (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O Orion Stock oferece ferramentas de consulta para rastrear cada item do estoque, seja de forma geral ou detalhada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No módulo **Orion Stock**, acesse o menu **Administração > Consultas > Estoque**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Administração > Consultas > Estoque"**, porém na tela atual do Orion TN o elemento se chama **"Administração"** (confiança: 81% — Similaridade semântica na árvore de acessibilidade (77%)). O texto do manual não foi alterado.
2. Utilize os filtros disponíveis, como **Categoria**, **Produto**, **Data**, entre outros, para refinar a pesquisa.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Categoria, Produto, Data] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Selecione o **Tipo de Consulta**:
   * **Resumida:** Mostra os intervalos de numeração e seus status de forma consolidada (ex.: "Selo 1 a 15, consumido"; "Selo 51 a 100, em estoque").
   * **Detalhada:** Lista cada item (selo ou papel) individualmente com seu status e oferece mais opções de gerenciamento.
4. Clique em **Filtrar**.
5. Na consulta **Detalhada**, a linha de cada item apresentará opções adicionais, como:
   * **Cancelamento**;
   * **Inutilização**;
   * **Andamentos (Logs)**.
6. É possível também estornar um produto específico que já foi utilizado, tornando-o disponível para reutilização.

* **Resumida: Mostra os intervalos de numeração e seus status de forma consolidada (ex.: "Selo 1 a 15, consumido"; "Selo 51 a 100, em estoque").**
* **Detalhada: Lista cada item (selo ou papel) individualmente com seu status e oferece mais opções de gerenciamento.**
* **Cancelamento**;
   * **Inutilização**;
   * **Andamentos (Logs)**.
6. É possível também estornar um produto específico que já foi utilizado, tornando-o disponível para reutilização.

* **Observação: A reutilização de um selo deve ser iniciada primeiro na tela de serviço onde ele foi originalmente utilizado, para depois ser estornado aqui no estoque.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
