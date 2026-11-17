---
id: D-3.3
titulo: 'Cadastrar Cartão de Assinatura'
modulo: firmas
secao: D
auditoria_ui:
  data_execucao: '2026-11-17'
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
      alvos_ausentes: ['Preencher com IA']
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é i'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T05:17:27.720Z'
    rota: '#/ficha'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cartões de assinatura']
    abas: []
    campos:
      - rotulo: 'Pesquisar por nome'
        tipo: 'text'
      - rotulo: 'Pessoa física'
        tipo: 'radio'
      - rotulo: 'Pessoa jurídica'
        tipo: 'radio'
      - rotulo: 'Fonética'
        tipo: 'checkbox'
      - rotulo: 'Começa com'
        tipo: 'radio'
      - rotulo: 'Contém'
        tipo: 'radio'
      - rotulo: 'Documento'
        tipo: 'select'
      - rotulo: 'Número'
        tipo: 'text'
      - rotulo: 'N° Cartão'
        tipo: 'text'
      - rotulo: 'NFS'
        tipo: 'text'
      - rotulo: 'Rótulo'
        tipo: 'text'
      - rotulo: 'Período de digitação'
        tipo: 'text'
      - rotulo: 'Digitador'
        tipo: 'select'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Status'
        tipo: 'select'
      - rotulo: 'Observações'
        tipo: 'text'
      - rotulo: 'Possui pendências'
        tipo: 'checkbox'
      - rotulo: 'Nome Social'
        tipo: 'text'
      - rotulo: 'totalPorPagina'
        tipo: 'select'
      - rotulo: 'Nº Cartão'
        tipo: 'checkbox'
    botoes: ['Filtrar', 'Limpar', 'Imprimir', 'Adicionar', 'Voltar']
    alvos_do_passo: ['Preencher com IA']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Preencher com IA']
    sugestao_reescrita: 'Sugestão de reescrita: Preencher com IA não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/ficha**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cartões de assinatura**.
> * **Campos:** **Pesquisar por nome**, **Pessoa física**, **Pessoa jurídica**, **Fonética**, **Começa com**, **Contém**, **Documento**, **Número**, **N° Cartão**, **NFS**, **Rótulo**, **Período de digitação**, **Digitador**, **Escrevente**, **Status**, **Observações**, **Possui pendências**, **Nome Social**, **totalPorPagina**, **Nº Cartão**.
> * **Botões:** **Filtrar** (desabilitado), **Limpar**, **Imprimir** (desabilitado), **Adicionar**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Preencher com IA**.
> * Sugestão de reescrita: **Preencher com IA** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O Cartão de Assinatura é o registro fundamental de identificação e autógrafo do usuário no tabelionato. A rotina reúne dados de qualificação, captura fotográfica ao vivo, impressão digital, digitalização de documentos e consumo automático de insumos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Para agilizar o preenchimento, clique em **Preencher com IA** e digitalize ou importe a CNH/RG do cliente.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Preencher com IA] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. Revise os dados extraídos pelo OCR (**Nome**, **CPF**, **RG**, **Filiação**, **Endereço** e **Profissão**).
4. Clique no ícone de **Webcam** para capturar a fotografia da face e em **Capturar Biometria** para ler o leitor digital.
5. Imprima o cartão de autógrafo físico clicando em **Impressão** para recolher as assinaturas físicas do apresentante.
6. Clique em **Salvar** para registrar o cartão; se ativado, o sistema consumirá automaticamente o selo e papel de segurança.

* **Importante: Em caso de documentos rasurados ou indícios de falsificação, utilize o botão **Bloquear Cartão** para impedir reconhecimentos imediatos.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é i → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
