---
id: V-6.2.3
titulo: 'Pesquisa Rápida na Barra Superior da Tela de Protocolos em Aberto (Busca de Atos Abertos e Encerrados)'
modulo: certidoes
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['Filtrar']
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
        motivo: 'No passo 5, o manual cita "Filtrar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiên'
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Filtrar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Invest'
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-17T15:02:39.387Z'
    rota: '#/protocolo/aberto'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Protocolos em aberto']
    abas: []
    campos:
      - rotulo: 'totalPorPagina'
        tipo: 'select'
    botoes: []
    alvos_do_passo: ['Filtrar']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Filtrar']
    sugestao_reescrita: 'Sugestão de reescrita: Filtrar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Filtrar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/protocolo/aberto**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Protocolos em aberto**.
> * **Campos:** **totalPorPagina**.
> * **Sem correspondência funcional na tela:** **Filtrar**.
> * Sugestão de reescrita: **Filtrar** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Para garantir agilidade sem exigir que o escrevente troque constantemente de tela, a tela de **Protocolos em Aberto** do **ORION TN** conta com uma barra superior retrátil de busca rápida acionada por um ícone de lupa. Essa barra permite buscar não apenas protocolos em andamento, mas também localizar e carregar atos que já foram lavrados e encerrados, pesquisando por múltiplos critérios como livro/folha, solicitante, partes, data ou recibo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Estando na tela de **Notas > Protocolos em aberto**, localizar o ícone de lupa (**Lupinha de Busca**) posicionado na barra superior da página.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos em aberto**
2. Clicar no ícone de lupa para expandir a barra com os campos de pesquisa (clicar novamente quando desejar ocultar a barra e liberar espaço visual).
   [aqui vai a print "passo-02.png"]
3. **Para busca imediata por número:**
   [aqui vai a print "passo-03.png"]
   * No campo **Protocolo**, digitar o número correspondente.
   * Pressionar a tecla **Enter** no teclado. O sistema carregará o protocolo imediatamente na tela.
4. **Para busca combinada por múltiplos parâmetros (atos abertos ou encerrados):**
   [aqui vai a print "passo-04.png"]
   * Preencher os campos conforme os dados disponíveis:
   * **Livro** e **Folha**: informar a numeração do livro notarial e da folha do ato;
   * **Solicitante**: digitar o nome do apresentante/solicitante do serviço;
   * **Partes**: digitar o nome de outorgantes ou outorgados;
   * **Data de recepção**: informar o período de entrada do protocolo no cartório;
   * **Número do recibo**: digitar o número do comprovante financeiro/recibo emitido.
5. Clicar no botão **Filtrar**.
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Filtrar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
6. Localizar o ato retornado no resultado da busca e clicar sobre ele para carregá-lo na interface.

* **Observação: O grande diferencial desta barra de busca é a capacidade de recuperar atos lavrados e encerrados mesmo estando dentro do módulo de protocolos em aberto.**
* **Observação: A flexibilidade de ocultar e reabrir a barra de pesquisa mantém a interface limpa e focada no fluxo de digitação.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 5 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 5, o manual cita "Filtrar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Invest → **mantido** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
