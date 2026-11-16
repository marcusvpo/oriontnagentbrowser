---
id: D-3.14
titulo: 'Criar Certidão'
modulo: certidoes
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Identificação do Solicitante']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Certidões > Novo Pedido de Certidão'
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
> **Motivo Técnico:** No passo 2, o manual cita "Identificação do Solicitante", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Esta rotina inicia a lavratura de certidões oficiais de atos lavrados no cartório (escrituras, testamentos, procurações e atas notariais). Permite selecionar o formato da certidão (Inteiro Teor, Breve Relatório ou Reprográfica), consultar o ato original e gerar o recibo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Notas > Certidões > Novo Pedido de Certidão"**, porém na tela atual do Orion TN o elemento se chama **"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"** (confiança: 96% — Sinônimo canônico Orion TN ('Notas > Certidões > Novo Pedido de Certidão' -> 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B')). O texto do manual não foi alterado.
2. Preencha a **Identificação do Solicitante** (Nome, CPF e telefone de contato).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Identificação do Solicitante] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Selecione o **Tipo de Certidão**: **Inteiro Teor**, **Breve Relatório** ou **Reprográfica**.
4. Localize o ato original informando o **Tipo de Livro**, **Número do Livro**, **Folha** e **Ato**.
5. O sistema importará os dados do ato e calculará os emolumentos correspondentes.
6. Clique em **Concluir Pedido** para salvar e disponibilizar o pagamento no caixa.

* **Importante: Caso o ato original possua imagens indexadas na Digitalização em Lote, o tipo Reprográfica puxará as folhas digitalizadas automaticamente.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
