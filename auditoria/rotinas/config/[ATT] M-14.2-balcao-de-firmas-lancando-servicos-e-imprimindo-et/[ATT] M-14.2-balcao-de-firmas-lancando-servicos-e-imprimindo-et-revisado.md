---
id: M-14.2
titulo: 'Balcão de Firmas: Lançando Serviços e Imprimindo Etiquetas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Balcão de firmas', 'Lançamento de Serviços']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
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
        tipo: 'Insuficiência de Privilégio na Conta de Homologação'
        motivo: 'A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de firmas"'
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
        motivo: 'No passo 1, o manual cita "Balcão de firmas", "Lançamento de Serviços", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T03:34:07.135Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['Balcão de firmas', 'Lançamento de Serviços']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Balcão de firmas', 'Lançamento de Serviços']
    sugestao_reescrita: 'Sugestão de reescrita: Balcão de firmas, Lançamento de Serviços não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Balcão de firmas", "Lançamento de Serviços", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Firmas > Consultas > Serviços praticados (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **Balcão de firmas**, **Lançamento de Serviços**.
> * Sugestão de reescrita: **Balcão de firmas**, **Lançamento de Serviços** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Detalha o procedimento de inclusão dos atos notariais no pedido (reconhecimento por semelhança com/sem valor econômico, autenticações), cálculo automático de emolumentos e disparo da impressão de etiquetas térmicas.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com a parte selecionada na tela **Balcão de firmas**, acesse o painel **Lançamento de Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Balcão de firmas, Lançamento de Serviços] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Selecione o serviço pretendido:
   * **Reconhecimento de firma por semelhança** (com ou sem valor econômico).
   * **Reconhecimento por autenticidade** (exige Termo de Comparecimento).
   * **Autenticação de cópia** (informar a quantidade de páginas/folhas).
3. Informe a quantidade de atos e, se o ato for com valor econômico, preencha o valor do negócio no campo correspondente.
4. No campo **Modelo de etiqueta**, selecione o layout homologado da serventia (ex: Etiqueta Padrão 1 coluna).
5. Clique no botão **Lançar e Imprimir** (ou pressione a tecla de atalho correspondente) para consumir o selo sequencial e emitir a etiqueta na impressora térmica configurada.

* **Observação: O sistema calcula automaticamente os emolumentos, taxas de fiscalização do Estado e fundos aplicáveis conforme a tabela de custas em vigor.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Balcão de firmas", "Lançamento de Serviços", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
