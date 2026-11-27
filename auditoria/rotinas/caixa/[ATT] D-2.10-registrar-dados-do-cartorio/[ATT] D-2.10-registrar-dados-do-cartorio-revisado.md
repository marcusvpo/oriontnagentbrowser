---
id: D-2.10
titulo: 'Registrar Dados do Cartório'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T21:37:13.517Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Dados de Cartório" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Módulo", "Négocios", "Parametrizações"; "Dados de Cartório" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (28 itens lidos). Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): SEM_EQUIVALENTE_NA_ARVORE — a semântica fechada indicou "Configurações > Dados do cartório", que não existe (ou não é único) na árvore lida ao vivo; candidatos mais próximos: "Configurações > Dados do cartório (0.86)". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * Nenhuma seção, aba, campo ou botão visível foi lido nesta tela.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar e manter consistentes os dados cadastrais da serventia (Denominação, CNPJ, Comarca, Titular, Endereço e Contatos) dentro do módulo Orion Estoque, assegurando a identificação formal em relatórios e termos de responsabilidade.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Dados de Cartório**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Dados de Cartório
2. Confira e atualize os campos de **Denominação da Serventia**, **Comarca** e **CNPJ**.
3. Atualize o **Nome do Titular/Oficial** e os dados de localização física.
4. Clique em **Salvar** para gravar as informações institucionais.

* **Importante: A uniformidade desses dados entre todos os módulos do ORION TN é mandatória para a validação em inspeções correicionais.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
