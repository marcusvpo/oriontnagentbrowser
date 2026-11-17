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
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
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
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T04:31:04.033Z'
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
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e contém: (nenhum subitem); "E-Notariado" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** O passo 7 ocorre fora do Orion TN (e-Notariado); não foi executado nem fotografado. As demais etapas foram auditadas até o ponto de bloqueio.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Por padrão de economia de rede, o Orion TN acumula os cartões de autógrafo abertos e faz o upload em lote uma vez ao dia. Para atendimentos imediatos de atos digitais, a transmissão pode ser antecipada manualmente.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 2 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva com imagem da assinatura e biometria.
   [aqui vai a print "passo-01.png"]
2. Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Administração > Comunicações > Outras Comunicações > E-Notariado
3. Na aba **Cartões de Autógrafo / Fichas de Firma**, informe o CPF ou número da ficha do cliente.
4. Selecione o registro na grade e clique no botão **Gerar / Enviar Imediatamente**.
5. O sistema executará o upload síncrono do payload com as assinaturas para os servidores do Colégio Notarial.
6. Confirme o recebimento do hash de transmissão.
7. Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível para consulta nacional.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**e-Notariado**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.

* **Agilidade: O envio imediato libera a assinatura digital de atos remotos em menos de 2 minutos pelo módulo de fluxo de assinaturas do e-Notariado.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT][CCC] atualizacao_editorial → [ATT][CCC] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e c → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
