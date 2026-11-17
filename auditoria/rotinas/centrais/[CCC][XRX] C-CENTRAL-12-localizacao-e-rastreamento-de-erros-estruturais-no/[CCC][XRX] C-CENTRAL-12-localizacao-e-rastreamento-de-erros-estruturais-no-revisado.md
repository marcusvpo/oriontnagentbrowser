---
id: C-CENTRAL-12
titulo: 'Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor de Texto'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['CCC', 'XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
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
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 7
      alvos_ausentes: ['Imóveis', 'Partes']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 6
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwk7apzvf71fy3-18] | x=503, y=67, 183x21'
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT', 'CCC']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['CCC', 'XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 6
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 6, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Protocolo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Protocolos", "Orçamentos", "Orçamento rápido", "Certidões e '
      bloqueio_atual:
        passo: 7
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([CCC][XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 7 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.
>
> **Etapas externas ([CCC]):** Os passos 1, 2, 3, 4, 5, 8 ocorrem fora do Orion TN (Receita Federal); não foram executados nem fotografados. As demais etapas foram auditadas até o ponto de bloqueio.

#### Descrição:
O software validador oficial da Receita Federal para a DOI é legado e não exibe Livro e Folha no log de inconsistências. É necessário abrir o arquivo estruturado para cruzar o número de ordem com o protocolo.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-CENTRAL-12.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

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
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Protocolo"**, porém na versão atual do Orion TN a tela fica em **"Notas > Protocolos"** (confiança: 90% — Item "Protocolos" localizado na árvore de navegação em outra rota (1 de 1 segmentos ancestrais coincidem). Auto-cura por menor profundidade de cadeia: "Notas > Protocolos" (profundidade 2) escolhida entre "Notas > Protocolos" e "Notas > Consultas > Protocolos"). O texto do manual não foi alterado.
7. Acesse a aba **Imóveis** ou **Partes** e aplique a correção do dado faltante indicado pela Receita.
   [aqui vai a print "passo-07.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Imóveis, Partes] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
8. Exporte o lote novamente e revalide no programa oficial.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**Receita Federal**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.

* **Dica de Especialista: Utilizar editores de texto com numeração de linhas facilita em 100% a localização de falhas em grandes arquivos de obrigações fiscais.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT][CCC] atualizacao_editorial → [CCC][XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 6 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 6, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Protocolo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Protocolos", "Orçamentos", "Orçamento rápido", "Certidões e  → **superado** (agora: passo 7, Dependência Cruzada de Rotina)
