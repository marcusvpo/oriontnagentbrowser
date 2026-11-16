---
id: R-26.0
titulo: 'Imprimir Relatório de Índice por Livro'
modulo: livros
secao: R
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Livro Final']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Livro Inicial'
        elemento_real: 'Livro'
        camada: a11y_fuzzy_match
        confianca: 0.7
        texto_alterado: false
        evidencia: 'dom-measured | text:livro | x=637, y=100, 90x50'
      - passo: 2
        alvo_documentado: 'Livro Final'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Livro Final", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O relatório de índice por livro compila a relação cronológica ou alfabética de todos os atos lavrados em livros específicos da serventia, servindo de elemento obrigatório para encadernação e consultas históricas.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu principal do sistema em **Relatórios > Índice por Livro**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Índice por livro**
2. Na tela de parâmetros, informe o **Período** de referência e defina os campos **Livro Inicial** e **Livro Final**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Período** · (2) **Livro**
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Livro Inicial"**, porém na tela atual do Orion TN o elemento se chama **"Livro"** (confiança: 70% — Rótulo visível na tela equivalente por inclusão de nome (70%)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Livro Final"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Livro Final"
3. No campo de ordenação, selecione o critério desejado: **Nome** (ordem alfabética das partes), **Natureza** ou **Livro e Folha** (ordem sequencial).
4. Clique no botão **Imprimir**.
5. Uma nova guia será aberta no navegador com o relatório formatado para conferência e impressão definitiva.

* **Observação: Para livros recém-fechados, utilize a ordenação por 'Nome' se a norma estadual exigir índice alfabético no encadernamento.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
