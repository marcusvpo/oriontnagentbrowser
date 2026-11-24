---
id: M-13.0
titulo: 'Abertura de Pedido de Firmas com Senha (Pré-Atendimento)'
modulo: centrais
secao: M
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 5
      alvos_ausentes: ['Concluir o pedido']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Firmas > Atendimento > Abertura de pedido com senha'
        elemento_real: 'Firmas > Abertura de pedido'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwuyw8n11hud9j-6] | x=471, y=46, 162x21'
      - passo: 2
        alvo_documentado: 'Novo'
        elemento_real: 'Nova senha'
        camada: llm_a11y_fallback
        confianca: 0.95
        texto_alterado: false
        evidencia: 'dom-measured | text:nova senha | x=144, y=198, 182x24'
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
        motivo: 'No passo 1, o manual cita "Firmas > Atendimento > Abertura de pedido com senha", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloquea'
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
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Atendimento > Abertura de pedido com senha" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Atendimento > Abertura de pedido com senha" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", '
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-24T17:31:52.640Z'
    rota: '#/aberturaPedidos'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Localizar cartão de assinatura', 'Abertura de pedido', 'Total', 'R$ 0,00', 'Nomes para reconhecimento']
    abas: []
    campos:
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'Documento'
        tipo: 'select'
      - rotulo: 'Número'
        tipo: 'text'
      - rotulo: 'Digite e tecle enter'
        tipo: 'text'
      - rotulo: 'Senha'
        tipo: 'text'
        secao: 'Total'
      - rotulo: 'Data e hora'
        tipo: 'text'
        secao: 'Total'
      - rotulo: 'Status'
        tipo: 'text'
        secao: 'Total'
      - rotulo: 'Tipo de pedido'
        tipo: 'select'
        secao: 'Total'
      - rotulo: 'Nova senha'
        tipo: 'text'
        secao: 'Total'
      - rotulo: 'cbDivisorSelecaoServicoAberturaPedido0'
        tipo: 'select'
        secao: 'Total'
      - rotulo: 'Nome civil'
        tipo: 'checkbox'
        secao: 'Total'
      - rotulo: 'Responsável'
        tipo: 'text'
      - rotulo: 'Impressora'
        tipo: 'select'
      - rotulo: 'Modelo'
        tipo: 'select'
    botoes: ['Limpar', 'Filtrar', 'Nova senha', 'Buscar', 'Finalizar', 'Cancelar', 'Voltar']
    alvos_do_passo: ['Concluir o pedido']
    correspondencias_sugeridas:
      - alvo: 'Concluir o pedido'
        elemento_real: 'Abertura de pedido'
        tipo: 'seção'
        similaridade: 0.48
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 5, substituir Concluir o pedido por Abertura de pedido (seção).'
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Concluir o pedido", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Abertura de pedido (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/aberturaPedidos**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Localizar cartão de assinatura**, **Abertura de pedido**, **Total**, **R$ 0,00**, **Nomes para reconhecimento**.
> * **Campos:** **Nome**, **Documento**, **Número**, **Digite e tecle enter**, **Senha** (Total), **Data e hora** (Total), **Status** (Total), **Tipo de pedido** (Total), **Nova senha** (Total), **cbDivisorSelecaoServicoAberturaPedido0** (Total), **Nome civil** (Total), **Responsável**, **Impressora**, **Modelo**.
> * **Botões:** **Limpar**, **Filtrar** (desabilitado), **Nova senha** (desabilitado), **Buscar**, **Finalizar** (desabilitado), **Cancelar**, **Voltar**.
> * **Correspondência sugerida para "Concluir o pedido":** **Abertura de pedido** (seção, 48% — termo(s) em comum: pedido).
> * Sugestão de reescrita: no passo 5, substituir **Concluir o pedido** por **Abertura de pedido** (seção). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
Rotina voltada à triagem e recepção do cartório para registrar a demanda inicial do usuário, emitir a senha de atendimento e adiantar o lançamento de partes e atos antes da chamada no guichê.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Atendimento > Abertura de pedido com senha**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Abertura de pedido**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Firmas > Atendimento > Abertura de pedido com senha"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Abertura de pedido"** (confiança: 90% — Equivalência canônica "Firmas > Atendimento > Abertura de pedido com senha" -> "Firmas > Abertura de pedido": Firmas não tem submenu "Atendimento"; "Abertura de pedido" é o único item de abertura de pedido da árvore (M-13.0)). O texto do manual não foi alterado.
2. Clique no botão **Novo** para gerar a senha sequencial de fila conforme a prioridade (Normal ou Preferencial).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, llm_a11y_fallback):** O manual cita **"Novo"**, porém na tela atual do Orion TN o elemento se chama **"Nova senha"** (confiança: 95% — Botão Nova senha corresponde ao botão Novo para gerar a senha de fila). O texto do manual não foi alterado.
3. Na seção de partes, informe o nome e documento dos interessados que solicitaram os serviços.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Alvos implícitos demarcados (passo sem negrito):** **Documento**. O texto do manual não foi alterado.
4. Na seção de serviços, selecione os atos solicitados (ex: Reconhecimento por Semelhança, Autenticação de Cópia) e indique as quantidades estimadas.
   [aqui vai a print "passo-04.png"]
5. Clique no botão **Concluir o pedido** para enviar a solicitação para a fila do painel e imprimir o comprovante de senha do cidadão.
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Concluir o pedido] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
6. O escrevente do guichê receberá o pedido pronto para conferência ao chamar a respectiva senha.

* **Observação: Todos os dados inseridos na triagem podem ser revisados, complementados ou corrigidos pelo escrevente no momento do atendimento definitivo.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Atendimento > Abertura de pedido com senha" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas",  → **superado** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
