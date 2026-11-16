---
id: C-CENTRAL-12
titulo: 'Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor de Texto'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  review_tags: ['ATT', 'CCC']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  etapas_externas:
    - passo: 1
      portal: 'Receita Federal'
    - passo: 2
      portal: 'Receita Federal'
    - passo: 3
      portal: 'Receita Federal'
    - passo: 4
      portal: 'Receita Federal'
    - passo: 5
      portal: 'Receita Federal'
    - passo: 8
      portal: 'Receita Federal'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 6, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Protocolo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Protocolos", "Orçamentos", "Orçamento rápido", "Certidões e serviços", "Certidões e serviços em aberto", "Consultas"; "Protocolo" não está entre eles. Item de nome igual ou parecido em outra rota (apenas pista, não validado como equivalente): "Notas > Protocolos"; "Notas > Consultas > Protocolos". Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** Os passos 1, 2, 3, 4, 5, 8 ocorrem fora do Orion TN (Receita Federal); não foram executados nem fotografados. As demais etapas foram auditadas até o ponto de bloqueio.

#### Descrição:
O software validador oficial da Receita Federal para a DOI é legado e não exibe Livro e Folha no log de inconsistências. É necessário abrir o arquivo estruturado para cruzar o número de ordem com o protocolo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 6 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Anote o **Número da Linha / Registro** apontado no relatório de erro do programa da Receita Federal (ex.: Linha `142`).
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
2. Localize o arquivo gerado da DOI (geralmente salvo na pasta `C:\Siplan\DOI\` ou Downloads com extensão `.txt` ou `.dec`).
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
3. Abra o arquivo utilizando o **Notepad++** ou **Bloco de Notas** do Windows.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
4. Pressione `Ctrl + G` e digite o número da linha correspondente ao erro.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
5. No início dessa linha ou no registro de controle imediatamente anterior, localize o campo de identificação que contém o **Número do Protocolo** ou a data de lavratura.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
6. Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Protocolo**.
   [aqui vai a print "passo-06.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Notas > Protocolo
7. Acesse a aba **Imóveis** ou **Partes** e aplique a correção do dado faltante indicado pela Receita.
8. Exporte o lote novamente e revalide no programa oficial.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.

* **Dica de Especialista: Utilizar editores de texto com numeração de linhas facilita em 100% a localização de falhas em grandes arquivos de obrigações fiscais.**
