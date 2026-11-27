---
id: D-1.3
titulo: 'Configurar Modelos de Impressão'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Adicionar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Modelo de Impressão'
        elemento_real: 'Configurações > Geral > Modelos de impressão'
        camada: menu_path_resolution
        confianca: 0.89
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0mcsqft04ug-28] | x=897, y=67, 146x21'
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:40:01.750Z'
    rota: '#/inicio'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Vencidas']
    abas: []
    campos: []
    botoes: []
    alvos_do_passo: ['Adicionar']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Adicionar']
    pistas_mapa_rotas:
      - alvo: 'Adicionar'
        menu: 'Firmas > Consultas > Reconhecimentos de firmas'
        rota: '#/pedidoFirmas'
        encontrado_em: 'button'
        rotulo_real: 'Adicionar'
      - alvo: 'Adicionar'
        menu: 'Firmas > Cadastros > Cartão de assinatura'
        rota: '#/ficha'
        encontrado_em: 'button'
        rotulo_real: 'Adicionar'
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['Adicionar']
    sugestao_reescrita: 'Sugestão de reescrita: Adicionar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Adicionar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Vencidas**.
> * **Sem correspondência funcional na tela:** **Adicionar**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Adicionar" aparece em **Firmas > Consultas > Reconhecimentos de firmas** (#/pedidoFirmas, botão **Adicionar**); "Adicionar" aparece em **Firmas > Cadastros > Cartão de assinatura** (#/ficha, botão **Adicionar**).
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Adicionar** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **Adicionar** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
A configuração de modelos de impressão possibilita padronizar o layout de recibos de balcão, comprovantes de sangria, suprimento e relatórios de fechamento de caixa. O sistema permite criar múltiplos formatos adaptados a impressoras térmicas (bobina) ou formato A4.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Modelo de Impressão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Geral** · (3) **Modelos de impressão**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Modelo de Impressão"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Geral > Modelos de impressão"** (confiança: 89% — Item "Modelos de impressão" localizado na árvore de navegação em outra rota (1 de 1 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Utilize o campo de filtro para consultar modelos já cadastrados ou clique em **Adicionar** para um novo modelo.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Adicionar] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Defina o **Nome do Modelo** e selecione o **Tipo de Documento** (Recibo, Fechamento de Caixa ou Retirada).
4. Configure as variáveis de cabeçalho, corpo e rodapé no editor de layout.
5. Clique em **Salvar** para registrar o modelo no banco de dados.

* **Observação: É possível manter abas de trabalho simultâneas no navegador durante o teste de impressão dos layouts.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
