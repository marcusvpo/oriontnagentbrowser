---
id: V-2.2.2
titulo: 'Configuração de Atos Notariais, Quantidade e Base de Cálculo no Orçamento Completo'
modulo: config
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Natureza', 'Item']
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
        motivo: 'No passo 1, o manual cita "Natureza", "Item", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é i'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-17T06:19:40.124Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['Natureza', 'Item']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Natureza', 'Item']
    sugestao_reescrita: 'Sugestão de reescrita: Natureza, Item não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Natureza", "Item", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Cadastros auxiliares > Natureza (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **Natureza**, **Item**.
> * Sugestão de reescrita: **Natureza**, **Item** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Procedimento para selecionar a natureza das custas notariais, estabelecer a modalidade de cobrança (integral, diligência, frações) e determinar a base de cálculo do ato com base na apuração automática do maior valor entre a avaliação venal e o valor declarado do negócio jurídico.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No campo **Natureza** (ou **Item**), selecione o ato notarial desejado utilizando uma das seguintes formas:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Natureza, Item, Digitação com autocompletar, Listagem completa por Tab, Tab, duplo clique] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * **Digitação com autocompletar**: digite o nome do ato (ex.: "Escritura com valor declarado") e selecione o item correspondente sugerido na barra de rolagem suspensa; ou
   * **Listagem completa por Tab**: deixe o campo do item em branco e pressione a tecla **Tab** no teclado. O sistema abrirá uma janela com a relação completa de naturezas disponíveis; localize o item desejado e dê um **duplo clique** sobre ele.
2. No campo **Quantidade**, informe a quantidade de cálculos ou atos a serem computados na composição do orçamento.
3. No campo de modalidade / **Tipo de Cálculo**, selecione a forma de apuração das custas:
   * **Integral**: aplica o valor total integral da tabela de custas notariais.
   * **Diligência**: dobra o valor das custas notariais.
   * **Um Terço (1/3)**: calcula um terço do valor das custas notariais.
   * Selecione outra fração correspondente caso o ato possua previsão específica.
4. Na seção de valores do negócio jurídico, preencha:
   * **Valor Venal**: digite o valor venal de referência do imóvel/bem atribuído pelo município ou Estado.
   * **Valor do Instrumento**: digite o valor declarado da transação ou negócio jurídico.
5. Verifique o campo **Base de Cálculo**:
   * O sistema compara automaticamente os campos preenchidos e atribui para a **Base de Cálculo** o maior valor apurado entre o **Valor Venal** e o **Valor do Instrumento**.
   * Caso haja determinação para utilizar outro valor, o sistema permite a edição ou digitação manual direta no campo **Base de Cálculo**.
6. O sistema apura e exibe no campo correspondente o valor parcial do ato notarial calculado com base na tabela de emolumentos vigente.

* **Observação: A regra de negócio do ORION TN segue o princípio tributário e notarial de aplicar a tabela de custas sobre a maior base apurada entre o valor de avaliação fiscal e o montante declarado pelas partes.**
* **Dica / Caso Real do 0800: Evite manter o mesmo protocolo aberto em mais de uma aba do Google Chrome para não gerar bloqueios automáticos de concorrência (*locks*) no banco de dados.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Natureza", "Item", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é i → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
