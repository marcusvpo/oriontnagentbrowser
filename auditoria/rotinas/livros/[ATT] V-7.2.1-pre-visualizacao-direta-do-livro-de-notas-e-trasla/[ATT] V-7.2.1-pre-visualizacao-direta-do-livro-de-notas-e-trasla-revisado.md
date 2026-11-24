---
id: V-7.2.1
titulo: 'Pré-Visualização Direta do Livro de Notas e Traslado com Marca d''Água Antifraude'
modulo: livros
secao: V
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Editor'
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
        motivo: 'No passo 1, o manual cita "Editor", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiênc'
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
        motivo: 'No passo 1, o manual cita "Editor", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investi'
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
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Editor", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investi'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-24T17:11:30.583Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por tela citada sem caminho (Camada 2) ("Editor" -> "Notas > Consultas > Editor" (#/protocolo/consultaTexto)) não contém "Prévia do Livro", "Prévia de Traslado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Protocolo", "Data de recepção", "Mês de recepção", "Escrevente", "Especialidade do modelo", "Status de impressão", "Filtrar", "Limpar", "Especialidade", "Voltar", "Saiba as novidades dessa versão!", "totalPorPagina". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O Orion Editor 6.0 permite emitir a prévia formal do Livro de Notas e do Traslado diretamente da tela de edição do protocolo com apenas um clique. O documento gerado exibe a diagramação fiel das páginas e folhas da serventia, incorpora marca d'água diagonal "PRÉVIA" para impedir fraudes e sinaliza em vermelho dados cadastrais que ainda não foram preenchidos antes da lavratura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No protocolo notarial, acesse a aba **Editor** com a minuta aberta em edição.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Editor**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Editor"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por tela citada sem caminho (Camada 2) ("Editor" -> "Notas > Consultas > Editor" (#/protocolo/consultaTexto)) não contém "Prévia do Livro", "Prévia de Traslado", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Protocolo", "Data de recepção", "Mês de recepção", "Escrevente", "Especialidade do modelo", "Status de impressão", "Filtrar", "Limpar", "Especialidade", "Voltar", "Saiba as novidades dessa versão!", "totalPorPagina".
2. Na barra de ferramentas do editor, clique no botão **Prévia do Livro** (ou **Prévia de Traslado**).
3. O sistema processa o layout configurado para o livro oficial da serventia (margens espelho, cabeçalho, rodapé e numeração de folhas) e abre a visualização em tela.
4. Analise a paginação, a distribuição das linhas de assinatura das partes e do tabelião/escrevente, observando eventuais campos destacados em **vermelho** (indicadores de dados pendentes no protocolo, como livro/folha ou selo não lavrado).
5. Para disponibilizar a conferência às partes ou advogados, clique em **Baixar Prévia em PDF** ou no ícone de compartilhamento direto.

* **Observação: As tarjas ou marcações em vermelho desaparecem automaticamente assim que o ato for formalmente lavrado e receber a numeração definitiva de livro, folha e selo digital.**
* **Importante: A marca d'água "PRÉVIA" impressa transversalmente é um mecanismo de segurança jurídica essencial para assegurar que rascunhos compartilhados por e-mail ou WhatsApp não sejam apresentados como traslados definitivos.**
* **Dica / Caso Real do 0800: Sempre utilize **Ctrl + Shift + V** para colar textos copiados de fontes externas, garantindo que estilos de fonte estranhos (como fonte tamanho 2) não corrompam a estrutura do documento.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Editor", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investi → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
