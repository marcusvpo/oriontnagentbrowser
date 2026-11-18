---
id: D-3.75
titulo: 'Ativar Consumo Automático de Papel e Selos'
modulo: selos
secao: D
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
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Parametrizações > Consumo de Insumos'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwlk5jllg73pg9-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Consumo de Insumos'
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Ativar Consumo Automático de Papel de Segurança", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado o'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Parametrizações > Consumo de Insumos'
          real: 'Configurações'
          confirmada_ao_vivo: false
          usada_como_dica: false
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parametrizações > Consumo de Insumos" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Parametrizações** existe na barra de navegação e contém: (nenhum subitem); "Consu'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Consumo de Insumos" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Configurações > Parametrizações > Consumo de Insumos'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T03:26:46.169Z'
    rota: '#/configuracoes'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Configurações', 'Cartão de assinatura', 'Cálculo de custas', 'Controle de guia', 'Geral']
    abas: []
    campos:
      - rotulo: 'Tipo'
        tipo: 'select'
      - rotulo: 'Qtd. na busca'
        tipo: 'text'
      - rotulo: 'Produto'
        tipo: 'select'
      - rotulo: 'Ativar rotina de bloqueio automático de cartões de assinatura'
        tipo: 'checkbox'
      - rotulo: 'Horário de execução'
        tipo: 'time'
      - rotulo: 'Para menos'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Para mais'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Truncado'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Contábil'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Diário'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Semanal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Mensal'
        tipo: 'radio'
        secao: 'Cartão de assinatura'
      - rotulo: 'Zera anualmente'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
      - rotulo: 'Otimizar consultas e telas Atenção! Necessário fazer um novo login'
        tipo: 'checkbox'
        secao: 'Cartão de assinatura'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Consumo de Insumos" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e digitalização", "Parâmetros por estação", "Sequência", "Comunicações", "Campos obrigatórios", "Painel de atalhos", "Pedido de firmas", "Comissões e mensalistas", "E-mail", "Faturamento", "Protocolo", "Certidão", "Editor", "Produtos Orion", "Inteligência Artificial", "WhatsApp", "Impressão", "Cartão de assinatura", "Cálculo de custas", "Controle de guia". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Cartão de assinatura**, **Cálculo de custas**, **Controle de guia**, **Geral**.
> * **Campos:** **Tipo**, **Qtd. na busca**, **Produto**, **Ativar rotina de bloqueio automático de cartões de assinatura**, **Horário de execução**, **Para menos** (Cartão de assinatura), **Para mais** (Cartão de assinatura), **Truncado** (Cartão de assinatura), **Contábil** (Cartão de assinatura), **Diário** (Cartão de assinatura), **Semanal** (Cartão de assinatura), **Mensal** (Cartão de assinatura), **Zera anualmente** (Cartão de assinatura), **Otimizar consultas e telas Atenção! Necessário fazer um novo login** (Cartão de assinatura).
> * **Botões:** **Concluir**, **Voltar**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A parametrização de consumo automático assegura que todo ato notarial ou certidão finalize seu ciclo com a perfeita baixa das folhas de segurança e dos selos utilizados, eliminando o esquecimento operacional e garantindo fidelidade contínua do estoque da serventia.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações > Consumo de Insumos**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Parametrizações > Consumo de Insumos"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 88% — "Configurações > Parametrizações" existe na árvore real como folha sem filhos; "Consumo de Insumos" é seção/aba da tela alcançada). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Consumo de Insumos"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Consumo de Insumos"
2. Marque a opção **Ativar Consumo Automático de Papel de Segurança**.
3. Marque a opção **Ativar Consumo Automático de Selos Digitais / Físicos**.
4. Defina o gatilho da baixa: marque **Ao Converter em Livro Definitivo** (para escrituras) e **Ao Concluir Pedido** (para certidões e balcão).
5. Configure a regra de contingência: se o sistema deve **Bloquear Impressão caso o Estoque do Usuário esteja Zerado**.
6. Clique em **Salvar Alterações** para aplicar a regra em toda a rede do cartório.

* **Importante: Para que a rotina funcione sem travar os atendimentos, certifique-se de que os escreventes tenham sempre lotes de insumos previamente distribuídos.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Consumo de Insumos" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e  → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Configurações > Parametrizações > Consumo de Insumos" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
