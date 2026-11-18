---
id: M-54.1
titulo: 'Como Criar um Novo Pedido de Certidão (Dados do Solicitante)'
modulo: certidoes
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
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
        motivo: 'No passo 2, o manual cita "Dados do pedido de certidão", "Tipo de Certidão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado o'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Novo'
          real: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
          confirmada_ao_vivo: false
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo"'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T04:59:56.706Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "Orçamento rápido", "Nova certidão e serviço", "Certidões e serviços", "Certidões e serviços em aberto", "Consultas"; "Pedido de certidão" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Primeira etapa na emissão de certidão notarial, responsável por registrar os dados de qualificação e contato do requerente, selecionar a modalidade da certidão e fixar o prazo legal de retirada.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela **Notas > Pedido de certidão**, clique no botão **Novo**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Notas > Pedido de certidão
2. No card **Dados do pedido de certidão**, selecione o **Tipo de Certidão**:
   * **Inteiro Teor**: reprodução integral da escritura ou procuração com todas as suas cláusulas.
   * **Breve Relato / Resumo**: certidão circunstanciada dos pontos essenciais do ato.
   * **Traslado / 2ª Via**: nova expedição da folha original de traslado.
3. No campo **Solicitante**, busque e selecione o interessado (ou cadastre novo com Nome, CPF/CNPJ, Telefone e E-mail).
4. O sistema calculará automaticamente o campo **Previsão de Entrega** com base nos parâmetros da serventia.
5. Selecione o **Escrevente** responsável e defina a situação como **Em Aberto**.
6. Clique no botão **Salvar** na barra superior para desbloquear os cards de busca do ato e custas.

* **Importante: O registro do e-mail e telefone do solicitante viabiliza o envio automático de notificação quando a certidão for emitida.**
* **Dica / Caso Real do 0800: Na busca de atos no índice notarial, utilize o curinga `%` entre os nomes para localizar registros mesmo com variações ortográficas históricas de prenomes e sobrenomes.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo" → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
