---
id: C-CERT-01
titulo: 'Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Modalidade de Cobrança', 'Isenta / Gratuita']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Certidões > Novo Pedido de Certidão'
        elemento_real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: false
        evidencia: 'dom-measured | text:pesquise aqui o nome da tela que deseja acessar. atalho: ctrl + b | x=135, y=72, 1171x30'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Modalidade de Cobrança", "Isenta / Gratuita", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Certidões emitidas sob assistência judiciária gratuita ou por requisição judicial possuem código de selo e regramento tributário próprio. O sistema exige a especificação do fundamento legal da isenção.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão** (ou **Notas > Certidões**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Certidões > Novo Pedido de Certidão"**, porém na tela atual do Orion TN o elemento se chama **"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"** (confiança: 96% — Sinônimo canônico Orion TN ('Certidões > Novo Pedido de Certidão' -> 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B')). O texto do manual não foi alterado.
2. No formulário inicial do pedido, altere o campo **Modalidade de Cobrança** de `Normal / Paga` para **Isenta / Gratuita**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Modalidade de Cobrança, Isenta / Gratuita] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. No campo **Motivo Legal da Gratuidade**, selecione o dispositivo correspondente (ex.: **Assistência Judiciária Gratuita**, **Requisição Judicial**, **Defensoria Pública** ou **Poder Público**).
4. Na aba **Cálculo de Custas**, certifique-se de que todas as linhas de emolumentos exibam `R$ 0,00`.
5. No editor da certidão, carregue o texto de breve relato ou inteiro teor.
6. Clique no botão **Finalizar e Emitir Selo Digital**.
7. O Orion TN transmitirá o selo ao tribunal sob a tipologia isenta homologada e emitirá o recibo zerado.

* **Auditoria de Gratuidade: Sempre anexe o ofício judicial ou declaração de pobreza digitalizada no GED da certidão para respaldo em correições.**
