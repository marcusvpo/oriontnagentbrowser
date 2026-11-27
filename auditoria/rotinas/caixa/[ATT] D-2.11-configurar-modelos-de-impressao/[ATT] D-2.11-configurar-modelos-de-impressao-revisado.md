---
id: D-2.11
titulo: 'Configurar Modelos de Impressão'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
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
    capturado_em: '2026-11-26T21:38:13.917Z'
    rota: '#/inicio'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos: []
    botoes: []
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Modelos de Impressão" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Módulo", "Négocios", "Parametrizações"; "Modelos de Impressão" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (28 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — a semântica fechada indicou "Configurações > Modelos de impressão > Configuração de impressão", que não existe (ou não é único) na árvore lida ao vivo; candidatos mais próximos: "Configurações > Modelos de impressão > Configuração de impressão (0.78)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * Nenhuma seção, aba, campo ou botão visível foi lido nesta tela.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
A rotina permite criar e padronizar layouts para termos de responsabilidade de entrega de selos, recibos de devolução, termos de inutilização e relatórios de posição física de estoque, incluindo campos para assinatura do escrevente e do responsável pelo almoxarifado.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Modelos de Impressão**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Modelos de Impressão
2. Localize um modelo existente ou clique no botão **Adicionar**.
3. Selecione o **Tipo de Modelo** (Termo de Distribuição, Inventário ou Inutilização).
4. No editor de texto, personalize o cabeçalho, variáveis dinâmicas (série inicial/final, quantidade) e rodapé com linhas para assinatura.
5. Clique em **Salvar** para registrar o modelo.

* **Observação: As variáveis dinâmicas do editor preenchem automaticamente os números de série e o nome do escrevente no momento da impressão.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
