---
id: C-SELO-10
titulo: 'Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Compra e Venda Pura']
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
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Naturezas de Atos'
        elemento_real: 'Configurações > Cadastros auxiliares > Natureza'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlj3r691ocg0c-108] | x=659, y=254, 191x21'
      - passo: 2
        alvo_documentado: 'Compra e Venda Pura'
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
        motivo: 'No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Naturezas de Atos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bl'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Naturezas de Atos" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas", "B'
      bloqueio_atual:
        passo: 2
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
        motivo: 'No passo 2, o manual cita "Compra e Venda Pura", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investiga'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Cadastros Auxiliares > Naturezas de Atos'
          real: 'Configurações > Cadastros auxiliares > Natureza'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T02:57:34.530Z'
    rota: '#/natureza'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Natureza']
    abas: []
    campos:
      - rotulo: 'Espécie'
        tipo: 'select'
      - rotulo: 'Natureza'
        tipo: 'text'
      - rotulo: 'Comunicação'
        tipo: 'select'
      - rotulo: 'Informa livro e folhas'
        tipo: 'select'
      - rotulo: 'Repetir livro e folhas'
        tipo: 'select'
      - rotulo: 'Inativos'
        tipo: 'checkbox'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Voltar']
    alvos_do_passo: ['Compra e Venda Pura', 'Procuração']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Compra e Venda Pura', 'Procuração']
    sugestao_reescrita: 'Sugestão de reescrita: Compra e Venda Pura, Procuração não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Compra e Venda Pura", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/natureza**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Natureza**.
> * **Campos:** **Espécie**, **Natureza**, **Comunicação**, **Informa livro e folhas**, **Repetir livro e folhas**, **Inativos**, **totalPorPagina**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Adicionar**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Compra e Venda Pura**, **Procuração**.
> * Sugestão de reescrita: **Compra e Venda Pura**, **Procuração** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Por equívoco de configuração cadastral, a flag de obrigatoriedade de conferência fiscal de ITCMD pode ser vinculada globalmente ao protocolo, impedindo o avanço de negócios onerosos em que incide apenas ITBI.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Natureza**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Naturezas de Atos"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Natureza"** (confiança: 90% — Equivalência canônica "Configurações > Cadastros Auxiliares > Naturezas de Atos" -> "Configurações > Cadastros auxiliares > Natureza": "Natureza" é o único irmão em Cadastros auxiliares com o radical natureza (tela #/natureza: Espécie, Natureza, Comunicação)). O texto do manual não foi alterado.
2. Localize a natureza jurídica do ato que está bloqueado (ex.: **Compra e Venda Pura** ou **Procuração**).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Compra e Venda Pura"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Compra e Venda Pura"
3. Clique em **Editar** e acesse a aba **Obrigações e Parâmetros Fiscais**.
4. Desmarque o checkbox **Exigir Comprovante de ITCMD na Conclusão do Protocolo**.
5. Acesse também **Configurações > Parâmetros do Caixa > Emissão de Recibos** e assegure que a validação de ITCMD esteja restrita às naturezas de inventário e doação.
6. Clique em **Salvar Parâmetros**.
7. Retorne ao protocolo, clique em **Salvar** e gere o recibo financeiro com sucesso.

* **Atenção Cadastral: Mantenha a exigência mandatória de ITCMD ligada apenas nas naturezas de Inventário, Partilha de Bens, Doação e Separação com Excesso de Meação.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Compra e Venda Pura", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investiga → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Configurações > Cadastros Auxiliares > Naturezas de Atos" → "Configurações > Cadastros auxiliares > Natureza" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
