---
id: R-36.0
titulo: 'Imprimir Relatório do Livro de Protocolo'
modulo: livros
secao: R
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'Para Rascunho / Conferência:'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: '"Rascunho"'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Para Impressão Definitiva:'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Folha Inicial'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como blo'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T06:14:43.219Z'
    rota: '#/inicio'
    titulo_painel: 'Livro Protocolo'
    em_modal: true
    secoes: ['Livro Protocolo']
    abas: []
    campos:
      - rotulo: 'Período'
        tipo: 'text'
      - rotulo: 'Livro atual'
        tipo: 'number'
      - rotulo: 'Página atual'
        tipo: 'number'
      - rotulo: 'Rascunho (não exibe livro e página)'
        tipo: 'checkbox'
    botoes: ['Imprimir', 'Fechar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Modelos de impressão; Configurações > Modelos de impressão > Configuração de impressão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/inicio**, título **Livro Protocolo** (modal aberto). Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Livro Protocolo**.
> * **Campos:** **Período**, **Livro atual**, **Página atual**, **Rascunho (não exibe livro e página)**.
> * **Botões:** **Imprimir** (desabilitado), **Fechar**.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
O relatório do Livro de Protocolo reúne a sequência formal de todos os atos notariais prenotados na serventia dentro de um determinado intervalo de tempo, permitindo emissões preliminares em rascunho para auditoria e impressão definitiva para encadernação.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu principal do sistema em **Relatórios > Livro Protocolo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Livro Protocolo**
2. Na tela de parâmetros, informe o **Período** de apuração no qual deseja visualizar os protocolos recepcionados.
   [aqui vai a print "passo-02.png"]
3. Defina a modalidade de impressão:
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Para Rascunho / Conferência:"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **""Rascunho""**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Para Impressão Definitiva:"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Folha Inicial"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial"
   * **Para Rascunho / Conferência:** Marque a caixa de seleção **"Rascunho"** para emitir listagem de trabalho sem numeração definitiva de livro físico.
   * **Para Impressão Definitiva:** Desmarque a opção de rascunho e preencha os campos **Livro** e **Folha Inicial** correspondentes à encadernação oficial.
4. Clique no botão **Imprimir**.
5. O sistema gerará o documento formatado em uma nova guia do navegador, pronto para conferência interna ou arquivamento permanente.

* **Para Rascunho / Conferência: Marque a caixa de seleção **"Rascunho"** para emitir listagem de trabalho sem numeração definitiva de livro físico.**
* **Para Impressão Definitiva: Desmarque a opção de rascunho e preencha os campos **Livro** e **Folha Inicial** correspondentes à encadernação oficial.**
* **Importante: Sempre emita primeiramente a versão em "Rascunho" para conferir se há protocolos pendentes antes de gerar a impressão definitiva do livro físico.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como blo → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
