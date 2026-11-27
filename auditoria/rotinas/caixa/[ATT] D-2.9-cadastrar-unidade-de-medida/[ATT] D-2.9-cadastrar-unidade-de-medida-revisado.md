---
id: D-2.9
titulo: 'Cadastrar Unidade de Medida'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Sigla']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Unidade de Medida'
        elemento_real: 'Configurações > Négocios > Cadastros > Unidade de medida'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy2l5f2f3i7ff-16] | x=880, y=171, 126x21'
      - passo: 3
        alvo_documentado: 'Descrição da Unidade'
        elemento_real: 'Descrição'
        camada: a11y_fuzzy_match
        confianca: 0.79
        texto_alterado: false
        evidencia: 'dom-measured | text:descrição | x=20, y=89, 694x40'
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-26T21:36:14.688Z'
    rota: '#/unidadeMedida/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de unidade medida']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Sigla']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Sigla']
    pistas_mapa_rotas:
      - alvo: 'Sigla'
        menu: 'Configurações > Cadastros auxiliares > Cargo'
        rota: '#/cargo'
        encontrado_em: 'field'
        rotulo_real: 'Sigla'
      - alvo: 'Sigla'
        menu: 'Configurações > Cadastros auxiliares > Formas de pagamento'
        rota: '#/tipoPagamento'
        encontrado_em: 'field'
        rotulo_real: 'Sigla'
    sugestao_reescrita: 'Sugestão de reescrita: Sigla não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Sigla", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/unidadeMedida/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de unidade medida**.
> * **Campos:** **Descrição**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Sigla**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Sigla" aparece em **Configurações > Cadastros auxiliares > Cargo** (#/cargo, campo **Sigla**); "Sigla" aparece em **Configurações > Cadastros auxiliares > Formas de pagamento** (#/tipoPagamento, campo **Sigla**).
> * Sugestão de reescrita: **Sigla** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
A tabela de Unidades de Medida padroniza a quantificação dos materiais no cartório, permitindo registrar insumos em unidades individuais (UN, FL), pacotes fechados (RES, CX) ou lotes de segurança (MIL).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Unidade de Medida**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Négocios** · (3) **Cadastros** · (4) **Unidade de medida**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Unidade de Medida"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Négocios > Cadastros > Unidade de medida"** (confiança: 88% — Item "Unidade de medida" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Digite a **Descrição da Unidade** (ex: Folha de Segurança ou Resma com 500).
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Descrição da Unidade"**, porém na tela atual do Orion TN o elemento se chama **"Descrição"** (confiança: 79% — Rótulo visível na tela equivalente por inclusão de nome (79%)). O texto do manual não foi alterado.
4. Informe a **Sigla** padronizada (ex: FL, RES, UN).
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Sigla] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. Defina se a unidade aceita valores decimais (fracionamento).
6. Clique em **Salvar** para gravar.

* **Observação: Insumos oficiais de segurança (selos e papéis) devem ser configurados como unidades inteiras sem fracionamento.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
