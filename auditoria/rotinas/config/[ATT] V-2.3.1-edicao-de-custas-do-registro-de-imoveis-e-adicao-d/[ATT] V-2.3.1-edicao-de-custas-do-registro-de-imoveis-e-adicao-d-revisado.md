---
id: V-2.3.1
titulo: 'Edição de Custas do Registro de Imóveis e Adição de Múltiplos Atos no Orçamento Completo'
modulo: config
secao: V
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Registro de Imóveis']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
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
        motivo: 'No passo 1, o manual cita "Registro de Imóveis", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não '
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
        motivo: 'No passo 1, o manual cita "Registro de Imóveis", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T05:49:40.407Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['Registro de Imóveis']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Registro de Imóveis']
    sugestao_reescrita: 'Sugestão de reescrita: Registro de Imóveis não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Registro de Imóveis", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Envio para Registro; Relatórios > Transferência de imóveis; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **Registro de Imóveis**.
> * Sugestão de reescrita: **Registro de Imóveis** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Procedimento para gerenciar e recalcular os valores do Registro de Imóveis (via tabela auxiliar ou liberação para digitação manual externa) e adicionar múltiplas linhas de atos notariais (como compra e venda cumulada com reserva de usufruto) dentro do mesmo Orçamento Completo no **ORION TN**.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Para alterar o valor do **Registro de Imóveis** calculado pela tabela auxiliar:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Registro de Imóveis, Cifrão ($), Tabela do Registro de Imóveis, Concluir] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * Observe que o campo na tela principal permanece bloqueado para edição direta.
   * Clique novamente no ícone de **Cifrão ($)** ao lado do campo para reabrir a janela da **Tabela do Registro de Imóveis**.
   * Realize as modificações necessárias: altere valores, quantidades ou remova atos desnecessários.
   * Clique em **Concluir** para recalcular e atualizar automaticamente o total na tela principal.
2. Para desativar a tabela auxiliar e digitar o valor do **Registro de Imóveis** manualmente (cálculo externo):
   * Clique no ícone de **Cifrão ($)**.
   * Exclua todos os atos listados na janela auxiliar e clique em **Concluir**.
   * Com a tabela limpa, o campo **Registro de Imóveis** na tela principal será liberado, permitindo a digitação manual de qualquer montante calculado por fora.
3. Para incluir múltiplos atos notariais no mesmo orçamento (ex.: escritura de compra e venda + usufruto):
   * Posicione o cursor no último campo da primeira linha de ato e pressione a tecla **Tab**, ou clique no botão **+** (Mais) localizado na seção de atos notariais para abrir uma nova linha.
   * Selecione a **Natureza** do segundo ato (ex.: "Escritura com valor declarado").
   * Configure o **Tipo de Cálculo** para a fração desejada (ex.: selecionar "1/4 de custas" para a cobrança da reserva de usufruto).
   * Preencha a base de cálculo correspondente. O sistema calculará a segunda linha e a somará ao total dos atos notariais.
4. Para remover qualquer linha de cálculo notarial adicionada indevidamente, clique no botão **X** correspondente àquela linha.

* **Observação: O bloqueio do campo de Registro de Imóveis na tela principal é uma proteção do sistema para evitar divergências entre o total exibido e os itens discriminados na tabela do cifrão ($).**
* **Observação: A adição de múltiplos atos é ideal para formalizar negócios jurídicos complexos que envolvam atos acessórios simultâneos na mesma escritura pública.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Registro de Imóveis", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Explo → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
