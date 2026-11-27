---
id: C-LIVRO-06
titulo: 'Correção de Duplicidade de Complementos de Livro e Folha em Lotes de Quinzena'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.60', 'D-3.41', 'C-LIVRO-05']
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Complemento de Folha']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 2
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: button
          rotulo: 'Mais filtros'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Fechamento de Quinzena / Comunicações'
        elemento_real: 'Notas > Consultas > Protocolos'
        camada: menu_path_resolution
        confianca: 0.7
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwxptcvheqsuj7-29] | x=686, y=212, 327x21'
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
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Notas > Fechamento de Quinzena / Comunicações", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou '
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Fechamento de Quinzena / Comunicações" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Fechamento de Quinzena / Comunicações" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "'
      bloqueio_atual:
        passo: 4
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 4, a tela está sem dados (grade com 10 coluna(s) visível(is) (Protocolo, Nº Recibo, Livro, Folha inicial, Folha final, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar" (Selecione um escrevente e preencha ao menos um dos filtros obrigatórios), "Imprimir" (Realize uma busca com resultados antes de prosseguir com a impressão)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.60 — Cadastrar Livro para Consumo; D-3.41 — Gerar Livro a partir de Minuta; C-LIVRO-05 — Geração de Termos de Abertura e Encerramento de Livros Notariais.

#### Descrição:
Quando dois atos ocupam a mesma página física (ex.: ato breve na frente e outro no verso) ou quando há folhas aditadas, é obrigatório utilizar o campo Complemento para garantir a unicidade de chave registral.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.60 (Cadastrar Livro para Consumo) para criar o registro necessário.
2. Executar antes a rotina D-3.41 (Gerar Livro a partir de Minuta) para criar o registro necessário.
3. Executar antes a rotina C-LIVRO-05 (Geração de Termos de Abertura e Encerramento de Livros Notariais) para criar o registro necessário.
4. Reexecutar a auditoria da rotina C-LIVRO-06.

* **Rotinas pré-requisito (executar antes):** **D-3.60**, **D-3.41**, **C-LIVRO-05**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse a tela de fechamento em **Notas > Fechamento de Quinzena / Comunicações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Protocolos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Fechamento de Quinzena / Comunicações"**, porém na versão atual do Orion TN a tela fica em **"Notas > Consultas > Protocolos"** (confiança: 70% — Semântica fechada sobre o catálogo canônico (Camada 3, ADR-037): "Notas > Consultas > Protocolos" — folha "Protocolos": radicais [protocolo] no texto (cobertura 100%), Dice com o título 0, ancestrais 100%, bônus de módulo 0; margem 0.3 sobre "Notas > Novo protocolo" (candidato a confirmar na árvore lida ao vivo)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Nº Recibo, Livro, Folha inicial, Folha final, Escrevente).
2. Identifique na mensagem de alerta o número exato do Livro e da Folha em conflito.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Nº Recibo, Livro, Folha inicial, Folha final, Escrevente).
3. Abra o protocolo correspondente em **Notas > Consultas > Protocolos**, aba **Dados do Ato**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Consultas** · (3) **Protocolos**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Nº Recibo, Livro, Folha inicial, Folha final, Escrevente).
4. No campo **Complemento de Folha**, informe a distinção formal (ex.: `V` para Verso, ou `A` / `B` para subdivisões autorizadas).
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Nº Recibo, Livro, Folha inicial, Folha final, Escrevente).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Complemento de Folha] não localizado no DOM nem na Árvore de Acessibilidade, nem após 2 gatilho(s) revelador(es) seguro(s)
5. Salve o protocolo.
6. No ato correlato, assegure que o campo de complemento esteja devidamente preenchido com a especificação recíproca (ex.: `F` para Frente).
7. Retorne à tela de fechamento de quinzena e clique em **Revalidar Numerações**, liberando o lote.

* **Padrão Cadastral: Padronize o uso de "F" e "V" na serventia para eliminar conflitos de duplicidade em atos com mais de uma lavratura na mesma folha.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Fechamento de Quinzena / Comunicações" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", " → **superado** (agora: passo 4, Dependência Cruzada de Rotina)
