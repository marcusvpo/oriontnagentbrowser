---
id: M-16.4
titulo: 'Gerenciar Sequências Automáticas do Sistema'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Último número gerado', 'Próximo número']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Geral'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Protocolo'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Impressão'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Certidão'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Produtos Orion'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Sequências automáticas'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwllgeatfbsv05-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Sequências automáticas'
        elemento_real: 'Sequência'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwllhmeb3yai-0] | x=26, y=197, 211x32'
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
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Sequências automáticas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloquea'
      bloqueio_atual:
        passo: 1
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
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Sequências automáticas" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escr'
      bloqueio_atual:
        passo: 3
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Último número gerado", "Próximo número", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de '
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Sequências automáticas'
          real: 'Sequência'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Sequências automáticas'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-18T04:09:40.206Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações']
    abas: []
    campos:
      - rotulo: 'Cartão de assinatura'
        tipo: 'number'
      - rotulo: 'Sinal público'
        tipo: 'number'
      - rotulo: 'inputUltimaSequenciaPedidoFirmas'
        tipo: 'number'
      - rotulo: '__/__/____'
        tipo: 'text'
      - rotulo: 'Requisição mensalista'
        tipo: 'number'
      - rotulo: 'Termo'
        tipo: 'number'
      - rotulo: 'Recibo caixa'
        tipo: 'number'
      - rotulo: 'Nosso número'
        tipo: 'number'
      - rotulo: 'Fatura'
        tipo: 'number'
      - rotulo: 'Arquivo remessa'
        tipo: 'number'
      - rotulo: 'Orçamento'
        tipo: 'number'
      - rotulo: 'Protocolo'
        tipo: 'number'
      - rotulo: 'Utilizar sequência única'
        tipo: 'checkbox'
      - rotulo: 'inputUltimaSequenciaUnicaReciboNotas'
        tipo: 'number'
      - rotulo: 'Pedidos de certidão'
        tipo: 'number'
      - rotulo: 'Índice retroativo'
        tipo: 'number'
      - rotulo: 'inputUltimaSequenciaGuia'
        tipo: 'number'
      - rotulo: 'inputUltimaSequenciaRps'
        tipo: 'number'
      - rotulo: 'inputSerieRps'
        tipo: 'text'
      - rotulo: 'inputSequenciaSeloDigital'
        tipo: 'number'
      - rotulo: 'inputSequenciaCoaf'
        tipo: 'number'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Último número gerado', 'Próximo número']
    correspondencias_sugeridas:
      - alvo: 'Último número gerado'
        elemento_real: 'Nosso número'
        tipo: 'campo'
        similaridade: 0.47
      - alvo: 'Próximo número'
        elemento_real: 'Nosso número'
        tipo: 'campo'
        similaridade: 0.58
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Último número gerado por Nosso número (campo); substituir Próximo número por Nosso número (campo).'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Último número gerado", "Próximo número", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Geral", aba "Protocolo", aba "Impressão", aba "Certidão", aba "Produtos Orion", aba "Parâmetros por estação"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**.
> * **Campos:** **Cartão de assinatura**, **Sinal público**, **inputUltimaSequenciaPedidoFirmas**, **__/__/____**, **Requisição mensalista**, **Termo**, **Recibo caixa**, **Nosso número**, **Fatura**, **Arquivo remessa**, **Orçamento**, **Protocolo**, **Utilizar sequência única**, **inputUltimaSequenciaUnicaReciboNotas**, **Pedidos de certidão**, **Índice retroativo**, **inputUltimaSequenciaGuia**, **inputUltimaSequenciaRps**, **inputSerieRps**, **inputSequenciaSeloDigital**, **inputSequenciaCoaf**.
> * **Botões:** **Concluir**, **Voltar**.
> * **Correspondência sugerida para "Último número gerado":** **Nosso número** (campo, 47% — termo(s) em comum: numero).
> * **Correspondência sugerida para "Próximo número":** **Nosso número** (campo, 58% — termo(s) em comum: numero).
> * Sugestão de reescrita: no passo 3, substituir **Último número gerado** por **Nosso número** (campo); substituir **Próximo número** por **Nosso número** (campo). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Controla os contadores numéricos sequenciais do sistema para protocolos de notas, recibos de pagamento, cartões de assinatura, certidões e pedidos de balcão, permitindo conferência e correções de numeração.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Sequências automáticas**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Sequência**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Sequências automáticas"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Sequências automáticas"**, porém na tela atual do Orion TN o elemento se chama **"Sequência"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Sequências automáticas" e a tela real chama a aba de "Sequência" (única aba de numeração/sequência da tela)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Sequência** foi medida ao vivo (sinônimo contextual da rota) e acionada.
2. Na listagem de contadores do sistema, identifique o registro desejado (ex: 'Protocolo de Notas', 'Recibo de Caixa', 'Cartão de Assinatura', 'Pedido de Balcão').
   [aqui vai a print "passo-02.png"]
3. Verifique o valor exibido na coluna **Último número gerado** e **Próximo número**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Último número gerado, Próximo número] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
4. Caso seja necessário ajustar a numeração por determinação judicial, correição ou virada de exercício, clique no botão **Editar** do registro.
5. Atualize o campo **Próximo número** com o valor correto e selecione se a sequência deve reiniciar anualmente.
6. Clique no botão **Salvar** para gravar o novo valor do contador.

* **Importante: A alteração manual de sequências deve ser realizada com cautela estrita para não gerar furos de numeração ou duplicidade de registros oficiais no livro.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 3 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Último número gerado", "Próximo número", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de  → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Sequências automáticas" → "Sequência" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Sequências automáticas" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
