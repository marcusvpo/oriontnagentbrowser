---
id: V-7.0.4
titulo: 'Geração, Configuração de Margem Espelho e Impressão do Livro Oficial com Consulta CNIB Integrada'
modulo: livros
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['CNIB']
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
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "CNIB", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência'
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-17T06:23:54.224Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['CNIB']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['CNIB']
    sugestao_reescrita: 'Sugestão de reescrita: CNIB não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "CNIB", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **CNIB**.
> * Sugestão de reescrita: **CNIB** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Procedimento para transição da minuta para o livro oficial de notas no **ORION TN**, abrangendo a emissão de prévia sem lavratura para conferência externa, a geração do livro definitivo com recibo e número de folhas, a aplicação mandatória de margem espelho para folhas de segurança encadernáveis, a inserção de certidões da Central de Indisponibilidade (**CNIB**) e a impressão definitiva com fechamento automático de folhas.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Após finalizar e salvar a minuta no editor, fechar a tela de edição para retornar ao card do editor de texto no protocolo.
   [aqui vai a print "passo-01.png"]
2. Selecionar o documento de referência da minuta e definir o tipo de livro a ser gerado:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] As opções **Prévia do Livro:**, **Gerar Livro Oficial:** não estavam visíveis na tela durante a auditoria (dependem de um registro selecionado na listagem). Print sem demarcação.
   * **Prévia do Livro:** gera o documento com cabeçalho e encerramento, porém sem as datas de lavratura, sem o número do recibo e sem valores pendentes de lançamento. É a opção indicada para envio a clientes ou advogados para leitura e validação prévia.
   * **Gerar Livro Oficial:** gera a versão oficial vinculada aos dados definitivos do protocolo.
3. Para gerar o Livro Oficial definitivo:
   [aqui vai a print "passo-03.png"]
   > [!NOTE] As opções **Livro**, **Folha**, **Gerar Livro** não estavam visíveis na tela durante a auditoria (dependem de um registro selecionado na listagem). Print sem demarcação.
   * Realizar previamente a geração do recibo no protocolo informando o número do **Livro**; o sistema sugerirá automaticamente o número da **Folha** inicial disponível na sequência.
   * Concluir o recibo e, no card do editor, clicar no botão **Gerar Livro**.
4. Configuração de Margem Espelho para Papéis de Segurança:
   [aqui vai a print "passo-04.png"]
   > [!NOTE] As opções **Margem espelho** não estavam visíveis na tela durante a auditoria (dependem de um registro selecionado na listagem). Print sem demarcação.
   * Antes de disparar a impressão, habilitar a opção **Margem espelho**.
   * *Justificativa Técnica:* Os papéis de segurança oficiais utilizados para encadernação em livros possuem margens assimétricas diferenciadas para páginas pares e ímpares (área de costura e perfuração). A opção de margem espelho ajusta o posicionamento do texto conforme o lado da folha, evitando que caracteres fiquem ocultos ou danificados pela encadernação.
5. Consulta à Central de Indisponibilidade (**CNIB**) no Livro:
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [CNIB, Central de Indisponibilidade, Lupa, Consulta CNIB] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * No editor do livro, antes da impressão definitiva, clicar no botão **Central de Indisponibilidade** para disparar a consulta aos bancos de dados de indisponibilidade.
   * Após o processamento da consulta, clicar no ícone de **Lupa** no canto superior direito do editor e selecionar a opção **Consulta CNIB**.
   * O sistema carregará o modelo cadastrado contendo o hash e o resultado da consulta.
   * Posicionar o cursor do mouse no ponto desejado do livro e clicar sobre o nome do modelo para inserir a certidão no corpo do ato.
6. Impressão do Livro Oficial:
   * **Impressão prévia:** gera o livro com marca-d'água para conferência visual.
   * **Impressão definitiva:** envia o ato para impressão nas folhas de segurança oficiais.
   * Ao concluir a impressão definitiva, o sistema executa automaticamente a contagem exata das folhas consumidas e insere a folha final de encerramento do ato, atualizando a numeração do livro.

* **Prévia do Livro: gera o documento com cabeçalho e encerramento, porém sem as datas de lavratura, sem o número do recibo e sem valores pendentes de lançamento. É a opção indicada para envio a clientes ou advogados para leitura e validação prévia.**
* **Gerar Livro Oficial: gera a versão oficial vinculada aos dados definitivos do protocolo.**
* **Impressão prévia: gera o livro com marca-d'água para conferência visual.**
* **Impressão definitiva: envia o ato para impressão nas folhas de segurança oficiais.**
* **Atenção: A impressão definitiva consome a numeração oficial de folhas no sistema e trava o documento para edição direta, exigindo liberação de supervisor caso sejam necessárias retificações posteriores.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 5 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 5, o manual cita "CNIB", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência → **mantido** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
