---
id: M-53.0
titulo: 'Consultar Pedidos de Certidão'
modulo: caixa
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
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
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T20:21:22.773Z'
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
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão > Consultar pedidos de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "Orçamento rápido", "Nova certidão e serviço", "Certidões e serviços", "Certidões e serviços em aberto", "Consultas"; "Pedido de certidão" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — melhor candidato "Notas > Consultas > Certidões e serviços" com 0.48 (limiar 0.7) e margem 0.113 (mínimo 0.12): sem destino inequívoco; candidatos mais próximos: "Notas > Consultas > Certidões e serviços (0.48)"; "Notas > Certidões e serviços em aberto (0.367)"; "Notas > Nova certidão e serviço (0.367)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Painel para acompanhamento, busca e conferência de todos os pedidos de certidão notarial (escrituras, procurações e atas), permitindo controlar prazos legais de expedição e status de entrega.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Pedido de certidão > Consultar pedidos de certidão** (ou **Notas > Consultas > Pedidos de certidão**).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Notas > Pedido de certidão > Consultar pedidos de certidão
2. Na área de pesquisa, utilize os filtros: **Nº do Pedido**, **Solicitante**, **Período de Solicitação**, **Previsão de Entrega**, **Escrevente** ou **Situação** (**Pendente**, **Pronto**, **Entregue**, **Inutilizado**).
3. Clique em **Filtrar** para processar a busca.
4. Na linha do registro pretendido, utilize as ações:
   * **Visualizar**: confere o ato original vinculado (livro/folha) e dados de contato do requerente.
   * **Editar**: abre o formulário para atualizar andamento ou apontar a folha de certidão emitida.
   * **Andamentos**: audita quem recebeu o pedido, digitou e liberou o documento.
   * **Reimprimir Recibo**: emite a 2ª via do canhoto de retirada para o usuário.
5. Para limpar os parâmetros, clique no botão **Limpar**.

* **Importante: Monitore diariamente os pedidos com status 'Pendente' para não ultrapassar o prazo de expedição fixado pela Corregedoria Geral da Justiça.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
