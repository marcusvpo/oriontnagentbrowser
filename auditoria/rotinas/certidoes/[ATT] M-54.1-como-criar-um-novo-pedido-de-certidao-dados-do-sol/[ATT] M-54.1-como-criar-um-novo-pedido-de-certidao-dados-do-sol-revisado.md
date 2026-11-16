---
id: M-54.1
titulo: 'Como Criar um Novo Pedido de Certidão (Dados do Solicitante)'
modulo: certidoes
secao: M
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
      alvos_ausentes: ['Dados do pedido de certidão', 'Tipo de Certidão']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Novo'
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
> **Motivo Técnico:** No passo 2, o manual cita "Dados do pedido de certidão", "Tipo de Certidão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Abertura de pedido; Notas > Nova certidão e serviço; Configurações > Dados do cartório (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Primeira etapa na emissão de certidão notarial, responsável por registrar os dados de qualificação e contato do requerente, selecionar a modalidade da certidão e fixar o prazo legal de retirada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela **Notas > Pedido de certidão**, clique no botão **Novo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Novo"**, porém na tela atual do Orion TN o elemento se chama **"Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"** (confiança: 96% — Sinônimo canônico Orion TN ('Novo' -> 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B')). O texto do manual não foi alterado.
2. No card **Dados do pedido de certidão**, selecione o **Tipo de Certidão**:
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Dados do pedido de certidão, Tipo de Certidão, Inteiro Teor, Breve Relato / Resumo, Traslado / 2ª Via] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * **Inteiro Teor**: reprodução integral da escritura ou procuração com todas as suas cláusulas.
   * **Breve Relato / Resumo**: certidão circunstanciada dos pontos essenciais do ato.
   * **Traslado / 2ª Via**: nova expedição da folha original de traslado.
3. No campo **Solicitante**, busque e selecione o interessado (ou cadastre novo com Nome, CPF/CNPJ, Telefone e E-mail).
4. O sistema calculará automaticamente o campo **Previsão de Entrega** com base nos parâmetros da serventia.
5. Selecione o **Escrevente** responsável e defina a situação como **Em Aberto**.
6. Clique no botão **Salvar** na barra superior para desbloquear os cards de busca do ato e custas.

* **Importante: O registro do e-mail e telefone do solicitante viabiliza o envio automático de notificação quando a certidão for emitida.**
* **Dica / Caso Real do 0800: Na busca de atos no índice notarial, utilize o curinga `%` entre os nomes para localizar registros mesmo com variações ortográficas históricas de prenomes e sobrenomes.**
