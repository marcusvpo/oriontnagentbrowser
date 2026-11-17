---
id: C-CENTRAL-08
titulo: 'Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT', 'CCC']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  etapas_externas:
    - passo: 7
      portal: 'e-Notariado'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Cartões de Autógrafo / Fichas de Firma']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Administração > Comunicações > Outras Comunicações > E-Notariado'
        elemento_real: 'Administração > Comunicações > Outras comunicações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkte3565pkepb-55] | x=474, y=88, 190x21'
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT', 'CCC']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT', 'CCC']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e c'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT', 'CCC']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT', 'CCC']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e c'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T14:56:54.310Z'
    rota: '#/comunicacoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Comunicações']
    abas: []
    campos:
      - rotulo: 'Tipo'
        tipo: 'select'
      - rotulo: 'Data de processamento'
        tipo: 'text'
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Mês de referência'
        tipo: 'select'
      - rotulo: 'Status'
        tipo: 'select'
      - rotulo: 'Lote'
        tipo: 'number'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Imprimir', 'Gerar', 'Voltar']
    alvos_do_passo: ['Cartões de Autógrafo / Fichas de Firma']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Cartões de Autógrafo / Fichas de Firma']
    sugestao_reescrita: 'Sugestão de reescrita: Cartões de Autógrafo / Fichas de Firma não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Cartões de Autógrafo / Fichas de Firma", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** O passo 7 ocorre fora do Orion TN (e-Notariado); não foi executado nem fotografado. As demais etapas foram auditadas até o ponto de bloqueio.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/comunicacoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Comunicações**.
> * **Campos:** **Tipo**, **Data de processamento**, **Período**, **Mês de referência**, **Status**, **Lote**, **totalPorPagina**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Imprimir** (desabilitado), **Gerar**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Cartões de Autógrafo / Fichas de Firma**.
> * Sugestão de reescrita: **Cartões de Autógrafo / Fichas de Firma** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Por padrão de economia de rede, o Orion TN acumula os cartões de autógrafo abertos e faz o upload em lote uma vez ao dia. Para atendimentos imediatos de atos digitais, a transmissão pode ser antecipada manualmente.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva com imagem da assinatura e biometria.
   [aqui vai a print "passo-01.png"]
2. Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**.
   [aqui vai a print "passo-02.png"]
   [aqui vai a print "passo-02-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Outras comunicações** · (4) **E-Notariado**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Comunicações > Outras Comunicações > E-Notariado"**, porém na versão atual do Orion TN a tela fica em **"Administração > Comunicações > Outras comunicações"** (confiança: 88% — "Administração > Comunicações > Outras comunicações" existe na árvore real como folha sem filhos; "E-Notariado" é seção/aba da tela alcançada). O texto do manual não foi alterado.
3. Na aba **Cartões de Autógrafo / Fichas de Firma**, informe o CPF ou número da ficha do cliente.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Cartões de Autógrafo / Fichas de Firma] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Selecione o registro na grade e clique no botão **Gerar / Enviar Imediatamente**.
5. O sistema executará o upload síncrono do payload com as assinaturas para os servidores do Colégio Notarial.
6. Confirme o recebimento do hash de transmissão.
7. Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível para consulta nacional.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**e-Notariado**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.

* **Agilidade: O envio imediato libera a assinatura digital de atos remotos em menos de 2 minutos pelo módulo de fluxo de assinaturas do e-Notariado.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT][CCC] atualizacao_editorial → [ATT][CCC] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e c → **superado** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
