---
id: C-CENTRAL-03
titulo: 'Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Comunicações - Configurações']
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
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Tipos de Participação'
        elemento_real: 'Configurações > Cadastros auxiliares > Participação'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwksv0iv9kliv3-111] | x=702, y=316, 190x21'
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
        motivo: 'No passo 1, o manual cita "Orion TN", "Configurações > Cadastros Auxiliares > Tipos de Participação", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o '
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Tipos de Participação" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas"'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T14:42:58.525Z'
    rota: '#/participacaoNotas'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Participação']
    abas: []
    campos:
      - rotulo: 'Pesquisar por descrição'
        tipo: 'text'
      - rotulo: 'Inativos'
        tipo: 'checkbox'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
    botoes: ['Filtrar', 'Limpar', 'Adicionar', 'Voltar']
    alvos_do_passo: ['Comunicações - Configurações']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Comunicações - Configurações']
    sugestao_reescrita: 'Sugestão de reescrita: Comunicações - Configurações não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Comunicações - Configurações", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Comunicações; Administração > Comunicações; Administração > Comunicações > Outras comunicações; Configurações (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/participacaoNotas**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Participação**.
> * **Campos:** **Pesquisar por descrição**, **Inativos**, **totalPorPagina**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Adicionar**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Comunicações - Configurações**.
> * Sugestão de reescrita: **Comunicações - Configurações** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O Provimento nº 18 do CNJ estabelece que todo inventário comunicado à CESDI deve possuir identificação explícita do falecido, herdeiros e advogado assistente, além de dados de filiação completa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Tipos de Participação**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Participação**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Tipos de Participação"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Participação"** (confiança: 88% — Equivalência de folha: "Tipos de Participação" ≡ "Participação" (mesma chave de folha sob "Configurações > Cadastros auxiliares")). O texto do manual não foi alterado.
2. Verifique se as participações estão mapeadas no quadro **Comunicações - Configurações**:
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Comunicações - Configurações] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. Falecido/Autor da Herança ➔ Qualidade CESDI: **De Cujus / Falecido**.
4. Herdeiro/Cônjuge Meiro ➔ Qualidade CESDI: **Herdeiro**.
5. Advogado/Assistente ➔ Qualidade CESDI: **Advogado**.
6. Abra o protocolo do inventário em **Notas > Protocolo**, aba **Partes**.
7. Confira cada participante, garantindo que os papéis acima foram selecionados.
8. Abra o cadastro das pessoas e preencha obrigatoriamente: **Filiação (Pai e Mãe)**, **Data de Nascimento** e **Município com Código IBGE**.
9. Salve o protocolo e retransmita a carga da CESDI.

* **Validação Estrutural: Em caso de genitor desconhecido, marque expressamente a opção "Pai Não Declarado" no cadastro para não gerar nó nulo no XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Tipos de Participação" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas" → **superado** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
