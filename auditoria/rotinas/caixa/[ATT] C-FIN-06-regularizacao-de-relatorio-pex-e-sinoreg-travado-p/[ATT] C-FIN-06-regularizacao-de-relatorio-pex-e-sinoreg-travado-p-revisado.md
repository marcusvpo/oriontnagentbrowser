---
id: C-FIN-06
titulo: 'Regularização de Relatório PEX e Sinoreg Travado por Recibo Estornado Pendente'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
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
      - passo: 2
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxyw6qbb9dvza-18] | x=503, y=67, 183x21'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T19:52:33.080Z'
    rota: '#/protocolo/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Protocolo']
    abas: []
    campos:
      - rotulo: 'ckbToggleDadosProtocolo'
        tipo: 'checkbox'
      - rotulo: 'Data recepção'
        tipo: 'text'
      - rotulo: 'Status'
        tipo: 'text'
      - rotulo: 'Situação'
        tipo: 'select'
      - rotulo: 'Recibo'
        tipo: 'text'
      - rotulo: 'Data recibo'
        tipo: 'text'
      - rotulo: 'Data 1ª lavratura'
        tipo: 'text'
      - rotulo: 'Escrevente'
        tipo: 'select'
      - rotulo: 'Espécie'
        tipo: 'select'
      - rotulo: 'Natureza'
        tipo: 'select'
      - rotulo: 'Data do contrato'
        tipo: 'text'
      - rotulo: 'Escrevente assinante (Substituto):'
        tipo: 'select'
      - rotulo: 'Auxiliar do escrevente:'
        tipo: 'select'
      - rotulo: 'Escrevente que colheu as assinaturas'
        tipo: 'select'
      - rotulo: 'Pessoa física'
        tipo: 'radio'
      - rotulo: 'Pessoa jurídica'
        tipo: 'radio'
      - rotulo: 'Mensalista'
        tipo: 'radio'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'Tomador'
        tipo: 'checkbox'
      - rotulo: 'Informar intermediador'
        tipo: 'checkbox'
      - rotulo: 'Tipo de endereço'
        tipo: 'select'
      - rotulo: 'CEP'
        tipo: 'text'
      - rotulo: 'Logradouro'
        tipo: 'text'
      - rotulo: 'Número'
        tipo: 'text'
      - rotulo: 'Complemento'
        tipo: 'text'
      - rotulo: 'Bairro'
        tipo: 'text'
      - rotulo: 'País'
        tipo: 'select'
      - rotulo: 'UF'
        tipo: 'select'
      - rotulo: 'Cidade'
        tipo: 'text'
      - rotulo: 'Cód. IBGE'
        tipo: 'text'
      - rotulo: 'Tipo de telefone'
        tipo: 'select'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'Tipo de e-mail'
        tipo: 'select'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Observação'
        tipo: 'textarea'
    botoes: []
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '014'
      menu: 'Notas > Novo protocolo'
      rota: '#/protocolo/cadastrar'
      nivel: 2
      estado_nivel2: 'no_substates'
      abas: []
      secoes: ['Protocolo']
      tabelas: []
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita um caminho de menu que não existe na versão atual. O caminho "Controle de Caixa > Recebimento de Protocolo" não existe na árvore de navegação real do Orion TN. O menu raiz "Controle de Caixa" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administração", "Históricos", "Configurações", "9+", "0", "Olá, [usuário]", "Olá Marcus , seja bem-vindo!"). Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — melhor candidato "Notas > Consultas > Protocolos" com 0.7 (limiar 0.7) e margem 0.119 (mínimo 0.12): sem destino inequívoco; candidatos mais próximos: "Notas > Consultas > Protocolos (0.7)"; "Notas > Consultas > Movimentação financeira por protocolo (0.581)"; "Relatórios > Relatório ISS (0.536)"; "Relatórios > Atos Incompletos (0.5)"; "Relatórios > Fechamento de caixa (0.5)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/protocolo/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Protocolo**.
> * **Campos:** **ckbToggleDadosProtocolo**, **Data recepção**, **Status**, **Situação**, **Recibo**, **Data recibo**, **Data 1ª lavratura**, **Escrevente**, **Espécie**, **Natureza**, **Data do contrato**, **Escrevente assinante (Substituto):**, **Auxiliar do escrevente:**, **Escrevente que colheu as assinaturas**, **Pessoa física**, **Pessoa jurídica**, **Mensalista**, **CPF ou CIN**, **Nome**, **Tomador**, **Informar intermediador**, **Tipo de endereço**, **CEP**, **Logradouro**, **Número** (+11).
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`014`, consultivo):** tela **Notas > Novo protocolo**.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Quando um recibo é estornado no caixa para correção de custas e o operador abandona o protocolo sem gerar o novo recebimento, o Orion TN trava o fechamento contábil para evitar omissão de receita fiscal perante o tribunal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 3 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Identifique o número do protocolo exibido na mensagem de bloqueio do relatório PEX.
   [aqui vai a print "passo-01.png"]
2. No **Orion TN**, acesse **Notas > Protocolo**, abra o ato e confira as custas na aba **Custas / Emolumentos**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 88% — Equivalência de folha: "Protocolo" ≡ "Protocolos" (mesma chave de folha sob "Notas")). O texto do manual não foi alterado.
3. No **Orion Caixa**, acesse **Controle de Caixa > Recebimento de Protocolo**, realize a baixa financeira e emita o **Recibo Definitivo**.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Controle de Caixa > Recebimento de Protocolo
4. Retorne à tela de **Relatórios > Relatório PEX / Fechamento Sinoreg**.
5. Acione o botão **Recalcular / Atualizar Informações**.
6. Confirme a zeragem da divergência e faça a geração do arquivo de remessa.

* **Dica Prática: Sempre que estornar um recibo para alterar dados de minuta, conclua o novo recebimento imediatamente para não bloquear o plantão de fechamento da serventia.**
