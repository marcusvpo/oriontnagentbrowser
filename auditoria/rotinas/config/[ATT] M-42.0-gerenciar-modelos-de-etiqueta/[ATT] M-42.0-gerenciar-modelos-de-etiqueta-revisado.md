---
id: M-42.0
titulo: 'Gerenciar Modelos de Etiqueta'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Pesquisar por modelo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Modelos de etiqueta ou Firmas > Parâmetros > Modelos de etiqueta'
        elemento_real: 'Configurações > Modelos de impressão > Etiquetas diversas'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlnbw592mmg3x-91] | x=677, y=109, 173x20'
      - passo: 3
        alvo_documentado: 'Pesquisar por modelo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
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
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Modelos de etiqueta", "Firmas > Parâmetros > Modelos de etiqueta", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a a'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Modelos de etiqueta" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritu'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Pesquisar por modelo", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investig'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Modelos de etiqueta ou Firmas > Parâmetros > Modelos de etiqueta'
          real: 'Configurações > Modelos de impressão > Etiquetas diversas'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-18T04:56:27.558Z'
    rota: '#/modeloEtiqueta'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Modelos de etiquetas']
    abas: []
    campos:
      - rotulo: 'Título'
        tipo: 'text'
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Tipo modelo'
        tipo: 'select'
      - rotulo: 'totalPerPage'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Voltar']
    alvos_do_passo: ['Pesquisar por modelo', 'Filtrar']
    correspondencias_sugeridas:
      - alvo: 'Pesquisar por modelo'
        elemento_real: 'Tipo modelo'
        tipo: 'campo'
        similaridade: 0.51
      - alvo: 'Filtrar'
        elemento_real: 'Filtrar'
        tipo: 'botão'
        similaridade: 0.85
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Pesquisar por modelo por Tipo modelo (campo). Filtrar existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Pesquisar por modelo", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/modeloEtiqueta**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Modelos de etiquetas**.
> * **Campos:** **Título**, **Descrição**, **Tipo modelo**, **totalPerPage**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Adicionar**, **Voltar**.
> * **Correspondência sugerida para "Pesquisar por modelo":** **Tipo modelo** (campo, 51% — termo(s) em comum: modelo).
> * **Correspondência sugerida para "Filtrar":** **Filtrar** (botão, 85% — termo(s) em comum: filtrar).
> * Sugestão de reescrita: no passo 3, substituir **Pesquisar por modelo** por **Tipo modelo** (campo). **Filtrar** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Ambiente de consulta, visualização e manutenção de todos os modelos de etiqueta de balcão (reconhecimento por semelhança, autenticidade, sinal público, autenticações), permitindo calibrar layouts e inativar modelos obsoletos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** (ou **Firmas > Parâmetros > Modelos de etiqueta**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Modelos de impressão** · (3) **Etiquetas diversas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Modelos de etiqueta ou Firmas > Parâmetros > Modelos de etiqueta"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Modelos de impressão > Etiquetas diversas"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros > Modelos de etiqueta" -> "Configurações > Modelos de impressão > Etiquetas diversas": único item de etiquetas da árvore real; o submenu legado "Parâmetros" não existe mais em Administração). O texto do manual não foi alterado.
2. Na tela de gerenciamento, visualize todos os modelos cadastrados com seus títulos, códigos e serviços vinculados.
   [aqui vai a print "passo-02.png"]
3. Para localizar um modelo específico, utilize o campo **Pesquisar por modelo** e clique em **Filtrar**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Pesquisar por modelo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Pesquisar por modelo"
4. Na linha do registro, selecione a ação pretendida:
   * **Visualizar**: exibe a pré-visualização do texto, fontes e campos dinâmicos da etiqueta.
   * **Editar**: permite ajustar o código EPL/ZPL, variáveis e margens técnicas.
   * **Inativar**: desabilita o modelo para que deixe de figurar nas opções de impressão do balcão.
5. Para estruturar um novo layout de etiqueta, clique no botão **Adicionar**.

* **Observação: O modelo de etiqueta com a opção 'Padrão' marcada é carregado automaticamente sempre que o escrevente seleciona o ato no balcão de firmas.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Pesquisar por modelo", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investig → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Modelos de etiqueta ou Firmas > Parâmetros > Modelos de etiqueta" → "Configurações > Modelos de impressão > Etiquetas diversas" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
