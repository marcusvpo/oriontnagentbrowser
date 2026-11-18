---
id: R-26.0
titulo: 'Imprimir Relatório de Índice por Livro'
modulo: livros
secao: R
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
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
        evidencia: 'dom-measured | text:livro | x=654, y=81, 72x40'
      - passo: 2
        alvo_documentado: 'Livro Final'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Livro Final", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploraçã'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Livro Inicial'
          real: 'Livro'
          confirmada_ao_vivo: true
          usada_como_dica: false
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Livro Final", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não en'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 2
          alvo: 'Livro Inicial'
          real: 'Livro'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T05:39:54.530Z'
    rota: '#/inicio'
    titulo_painel: 'Relatório - Índice por livros'
    em_modal: true
    secoes: ['Relatório - Índice por livros']
    abas: []
    campos:
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Livro'
        tipo: 'text'
      - rotulo: 'inputNumeroLivroFinal'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'radio'
      - rotulo: 'Natureza'
        tipo: 'radio'
      - rotulo: 'Livro e folha'
        tipo: 'radio'
      - rotulo: 'PDF'
        tipo: 'radio'
      - rotulo: 'Excel'
        tipo: 'radio'
    botoes: ['Imprimir', 'Fechar']
    alvos_do_passo: ['Período', 'Livro Inicial', 'Livro Final']
    correspondencias_sugeridas:
      - alvo: 'Período'
        elemento_real: 'Período'
        tipo: 'campo'
        similaridade: 1
      - alvo: 'Livro Inicial'
        elemento_real: 'Livro'
        tipo: 'campo'
        similaridade: 0.53
      - alvo: 'Livro Inicial'
        elemento_real: 'Livro e folha'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'Livro Final'
        elemento_real: 'Livro'
        tipo: 'campo'
        similaridade: 0.6
      - alvo: 'Livro Final'
        elemento_real: 'Livro e folha'
        tipo: 'campo'
        similaridade: 0.57
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Livro Inicial por Livro (campo); substituir Livro Final por Livro (campo). Período existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Livro Final", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **Relatório - Índice por livros** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Relatório - Índice por livros**.
> * **Campos:** **Período**, **Livro**, **inputNumeroLivroFinal**, **Nome**, **Natureza**, **Livro e folha**, **PDF**, **Excel**.
> * **Botões:** **Imprimir** (desabilitado), **Fechar**.
> * **Correspondência sugerida para "Período":** **Período** (campo, 100% — termo(s) em comum: periodo).
> * **Correspondência sugerida para "Livro Inicial":** **Livro** (campo, 53% — termo(s) em comum: livro); **Livro e folha** (campo, 48% — termo(s) em comum: livro).
> * **Correspondência sugerida para "Livro Final":** **Livro** (campo, 60% — termo(s) em comum: livro); **Livro e folha** (campo, 57% — termo(s) em comum: livro).
> * Sugestão de reescrita: no passo 2, substituir **Livro Inicial** por **Livro** (campo); substituir **Livro Final** por **Livro** (campo). **Período** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

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

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Livro Final", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não en → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 2):** "Livro Inicial" → "Livro" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
