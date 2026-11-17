---
id: R-30.0
titulo: 'Reutilizar Posição de Livro Inutilizada'
modulo: livros
secao: R
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.60', 'D-3.41', 'C-LIVRO-05']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Inutilizados']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Número do Livro'
        elemento_real: 'Número'
        camada: a11y_fuzzy_match
        confianca: 0.73
        texto_alterado: false
        evidencia: 'dom-measured | text:número | x=20, y=94, 41x16'
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca)). O auto-seed foi tentado e não concluiu: motiv'
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Número do Livro'
          real: 'Número'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.60 — Cadastrar Livro para Consumo; D-3.41 — Gerar Livro a partir de Minuta; C-LIVRO-05 — Geração de Termos de Abertura e Encerramento de Livros Notariais.

#### Descrição:
A rotina de controle de livros permite resgatar posições ou folhas notariais marcadas indevidamente como inutilizadas, devolvendo-as ao saldo operacional para que novos atos possam aproveitá-las.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.60 (Cadastrar Livro para Consumo) para criar o registro necessário.
2. Executar antes a rotina D-3.41 (Gerar Livro a partir de Minuta) para criar o registro necessário.
3. Executar antes a rotina C-LIVRO-05 (Geração de Termos de Abertura e Encerramento de Livros Notariais) para criar o registro necessário.
4. Reexecutar a auditoria da rotina R-30.0.

* **Rotinas pré-requisito (executar antes):** **D-3.60**, **D-3.41**, **C-LIVRO-05**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Controle de Livros**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Livros**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual).
2. No campo **Número do Livro**, informe o livro desejado e clique no ícone do **Livro Pequeno** para carregar suas informações detalhadas.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Número do Livro"**, porém na tela atual do Orion TN o elemento se chama **"Número"** (confiança: 73% — Similaridade semântica na árvore de acessibilidade (73%)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual).
3. Na janela de controle exibida, clique sobre a aba **Inutilizados**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Inutilizados] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. Localize e selecione a posição numérica ou folha que deseja resgatar.
5. Clique nas **Setas de Movimentação** para transferir a posição selecionada de volta para o status ativo de uso.
6. A posição retornará ao controle do sistema e ficará disponível para conferência na aba **Reutilizadas**, pronta para ser atribuída a um novo ato.

* **Importante: Certifique-se de que a folha física do livro está em perfeito estado e apta para impressão antes de formalizar a reutilização.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 3 — Dependência Cruzada de Rotina: No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca)). O auto-seed foi tentado e não concluiu: motiv → **mantido** (agora: passo 3, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 2):** "Número do Livro" → "Número" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
