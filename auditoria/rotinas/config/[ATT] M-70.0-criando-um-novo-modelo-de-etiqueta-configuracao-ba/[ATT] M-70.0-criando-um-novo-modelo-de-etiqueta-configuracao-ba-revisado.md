---
id: M-70.0
titulo: 'Criando um Novo Modelo de Etiqueta (Configuração Básica)'
modulo: config
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
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Reconhecimento de firma por semelhança sem valor econômico']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Modelos de etiqueta'
        elemento_real: 'Configurações > Modelos de impressão > Etiquetas diversas'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlnx98ncheyuh-91] | x=677, y=109, 173x20'
      - passo: 4
        alvo_documentado: 'Reconhecimento de firma por semelhança sem valor econômico'
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
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Modelos de etiqueta", "Adicionar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento co'
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
        passo: 4
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Reconhecimento de firma por semelhança sem valor econômico", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. An'
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 4
          alvo: 'Serviço'
          real: 'Serviço'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Modelos de etiqueta'
          real: 'Configurações > Modelos de impressão > Etiquetas diversas'
          confirmada_ao_vivo: true
          usada_como_dica: false
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
        motivo: 'No passo 4, o manual cita "Reconhecimento de firma por semelhança sem valor econômico", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A '
      bloqueio_atual:
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Modelos de etiqueta'
          real: 'Configurações > Modelos de impressão > Etiquetas diversas'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 4
    capturado_em: '2026-11-18T05:13:07.978Z'
    rota: '#/modeloEtiqueta/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de modelo de etiqueta']
    abas: []
    campos:
      - rotulo: 'Tipo modelo'
        tipo: 'select'
      - rotulo: 'Título'
        tipo: 'text'
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Item'
        tipo: 'text'
      - rotulo: 'Serviço'
        tipo: 'select'
      - rotulo: 'Configuração'
        tipo: 'select'
      - rotulo: 'Linguagem'
        tipo: 'select'
      - rotulo: 'Fonte'
        tipo: 'select'
      - rotulo: 'Modelo padrão'
        tipo: 'checkbox'
      - rotulo: 'Complementar com caractere especial:'
        tipo: 'checkbox'
      - rotulo: 'symbol'
        tipo: 'text'
    botoes: ['Negrito', 'Alinhar Esquerda', 'Centralizar', 'Alinhar Direita', 'Justificado', 'Concluir', 'Voltar']
    alvos_do_passo: ['Serviço', 'Reconhecimento de firma por semelhança sem valor econômico']
    correspondencias_sugeridas:
      - alvo: 'Serviço'
        elemento_real: 'Serviço'
        tipo: 'campo'
        similaridade: 1
    alvos_sem_correspondencia: ['Reconhecimento de firma por semelhança sem valor econômico']
    sugestao_reescrita: 'Sugestão de reescrita: Serviço existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Reconhecimento de firma por semelhança sem valor econômico não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-04.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Reconhecimento de firma por semelhança sem valor econômico", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Reconhecimento de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 4: rota **#/modeloEtiqueta/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de modelo de etiqueta**.
> * **Campos:** **Tipo modelo**, **Título**, **Descrição**, **Item**, **Serviço**, **Configuração**, **Linguagem**, **Fonte**, **Modelo padrão**, **Complementar com caractere especial:**, **symbol**.
> * **Botões:** **Negrito**, **Alinhar Esquerda**, **Centralizar**, **Alinhar Direita**, **Justificado**, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Serviço":** **Serviço** (campo, 100% — termo(s) em comum: servico).
> * **Sem correspondência funcional na tela:** **Reconhecimento de firma por semelhança sem valor econômico**.
> * Sugestão de reescrita: **Serviço** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Reconhecimento de firma por semelhança sem valor econômico** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-04.png (tela exata no momento do bloqueio).

#### Descrição:
Primeira etapa na confecção de um modelo de etiqueta térmica, responsável por estabelecer o título, descrição, vínculo com o ato notarial da tabela de custas e definição de padrão de uso.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Modelos de impressão** · (3) **Etiquetas diversas** · (4) **Adicionar**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Modelos de etiqueta"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Modelos de impressão > Etiquetas diversas"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros > Modelos de etiqueta" -> "Configurações > Modelos de impressão > Etiquetas diversas": único item de etiquetas da árvore real; o submenu legado "Parâmetros" não existe mais em Administração). O texto do manual não foi alterado.
2. No campo **Título**, digite um nome identificador claro (ex: 'Etiqueta Semelhança Sem Valor 2024 - 1 Coluna').
   [aqui vai a print "passo-02.png"]
3. No campo **Descrição**, insira o detalhamento do propósito do modelo e impressoras compatíveis.
   [aqui vai a print "passo-03.png"]
4. No campo **Serviço**, selecione na lista o ato notarial ao qual o modelo pertencerá (ex: **Reconhecimento de firma por semelhança sem valor econômico**).
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Reconhecimento de firma por semelhança sem valor econômico"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Reconhecimento de firma por semelhança sem valor econômico"
5. Marque a caixa de seleção **Modelo padrão** se desejar que o Orion TN selecione este layout automaticamente toda vez que o escrevente lançar o ato no balcão.
6. Clique no botão **Avançar** para seguir para a configuração dos parâmetros técnicos e script de impressão.

* **Importante: Cada serviço notarial deve possuir apenas um modelo assinalado como 'Modelo padrão' para garantir fluxo automático no balcão.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita "Reconhecimento de firma por semelhança sem valor econômico", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A  → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Modelos de etiqueta" → "Configurações > Modelos de impressão > Etiquetas diversas" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
