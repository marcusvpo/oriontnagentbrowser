---
id: D-3.2
titulo: 'Visualizar Dashboard de Envio para Registro'
modulo: centrais
secao: D
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Aguardando Envio', 'Prenotados no RI', 'Com Exigência', 'Registrados']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: '+ Filtros'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: button
          rotulo: '- Filtros'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Dashboard de Envio para Registro'
        elemento_real: 'Dashboard > Envio para Registro'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwljiu70bf9hmu-2] | x=437, y=67, 138x21'
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
        motivo: 'No passo 1, o manual cita "Notas > Dashboard de Envio para Registro", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou ocult'
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
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Dashboard de Envio para Registro" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçam'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T03:10:16.407Z'
    rota: '#/dashboard/envioRegistro'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Dashboard de envio para registro', 'Sem status definido', '#1585138 dias', '#1558149 dias', '#1491196 dias', '#1448218 dias', '#1445219 dias', '#1411238 dias', '#1406239 dias', '#1259369 dias', '#1130464 dias', '#1034471 dias', '#993594 dias', '#992595 dias', '#903650 dias', '#651814 dias', 'Não encaminhado', 'Encaminhado', '#1588134 dias', '#1219408 dias', '#1216418 dias', '#1212419 dias', '#1112482 dias', '#3891035 dias', 'Devolvido - Exigência', 'Registrado', 'Entregue']
    abas: []
    campos: []
    botoes: ['+ Filtros']
    alvos_do_passo: ['Aguardando Envio', 'Prenotados no RI', 'Com Exigência', 'Registrados']
    correspondencias_sugeridas:
      - alvo: 'Aguardando Envio'
        elemento_real: 'Dashboard de envio para registro'
        tipo: 'seção'
        similaridade: 0.46
      - alvo: 'Com Exigência'
        elemento_real: 'Devolvido - Exigência'
        tipo: 'seção'
        similaridade: 0.92
      - alvo: 'Registrados'
        elemento_real: 'Registrado'
        tipo: 'seção'
        similaridade: 0.95
    alvos_sem_correspondencia: ['Prenotados no RI']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Aguardando Envio por Dashboard de envio para registro (seção); substituir Com Exigência por Devolvido - Exigência (seção); substituir Registrados por Registrado (seção). Prenotados no RI não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Aguardando Envio", "Prenotados no RI", "Com Exigência", "Registrados", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 2 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "+ Filtros", botão "- Filtros"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Envio para Registro; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/dashboard/envioRegistro**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Dashboard de envio para registro**, **Sem status definido**, **#1585138 dias**, **#1558149 dias**, **#1491196 dias**, **#1448218 dias**, **#1445219 dias**, **#1411238 dias**, **#1406239 dias**, **#1259369 dias**, **#1130464 dias**, **#1034471 dias** (+15).
> * **Botões:** **+ Filtros**.
> * **Correspondência sugerida para "Aguardando Envio":** **Dashboard de envio para registro** (seção, 46% — termo(s) em comum: envio).
> * **Correspondência sugerida para "Com Exigência":** **Devolvido - Exigência** (seção, 92% — termo(s) em comum: exigencia).
> * **Correspondência sugerida para "Registrados":** **Registrado** (seção, 95% — termo(s) em comum: registrado).
> * **Sem correspondência funcional na tela:** **Prenotados no RI**.
> * Sugestão de reescrita: no passo 2, substituir **Aguardando Envio** por **Dashboard de envio para registro** (seção); substituir **Com Exigência** por **Devolvido - Exigência** (seção); substituir **Registrados** por **Registrado** (seção). **Prenotados no RI** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O Dashboard de Envio para Registro gerencia as escrituras públicas que foram despachadas aos Cartórios de Registro de Imóveis para prenotação e registro. Permite acompanhar status de remessa, recebimento de exigências (notas devolutivas) e conclusão do ato.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Dashboard de Envio para Registro**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Dashboard** · (2) **Envio para Registro** · (3) **Dashboard de Envio para Registro**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Dashboard de Envio para Registro"**, porém na versão atual do Orion TN a tela fica em **"Dashboard > Envio para Registro"** (confiança: 88% — Grafo vivo de rotas (orion-route-graph.json): "Dashboard de Envio para Registro" é seção "Dashboard de envio para registro" da tela "Dashboard > Envio para Registro"). O texto do manual não foi alterado.
2. Analise os blocos operacionais: **Aguardando Envio**, **Prenotados no RI**, **Com Exigência** e **Registrados**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Aguardando Envio, Prenotados no RI, Com Exigência, Registrados] não localizado no DOM nem na Árvore de Acessibilidade, nem após 2 gatilho(s) revelador(es) seguro(s)
3. Filtre por **Cartório de Imóveis de Destino**, **Número do Protocolo** ou **Período**.
4. Ao clicar em um card em exigência, visualize o teor da nota devolutiva e o prazo limite para reapresentação.
5. Clique em **Atualizar Status** após anexar a certidão ou comprovação do registro imobiliário concluído.

* **Importante: Registrar o número de prenotação fornecido pelo Registro de Imóveis facilita a busca integrada em caso de questionamento das partes.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Dashboard de Envio para Registro" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçam → **superado** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
