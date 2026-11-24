---
id: C-LIVRO-01
titulo: 'Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livro Notarial'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.60', 'D-3.41', 'C-LIVRO-05']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Livros > Gestão e Controle de Folhas ou Notas > Livros'
        elemento_real: 'Administração > Controle de Livros'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwuyphdidrtnfl-74] | x=664, y=171, 192x20'
      - passo: 1
        alvo_documentado: 'Gestão e Controle de Folhas'
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
        passo: 4
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 4, o manual cita "Ações > Inutilizar Folha / Declarar Sem Efeito", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Notas > Livros'
          real: 'Notas'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão e Controle de Folhas" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Adminis'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão e Controle de Folhas" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Adminis'
      bloqueio_atual:
        passo: 1
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 1, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.60 — Cadastrar Livro para Consumo; D-3.41 — Gerar Livro a partir de Minuta; C-LIVRO-05 — Geração de Termos de Abertura e Encerramento de Livros Notariais.

#### Descrição:
A continuidade cronológica dos livros notariais é princípio basilar. Havendo salto ou avaria física de folha, o Orion TN permite registrar a inutilização com certidão circunstanciada, preservando a trilha contábil e fiscal.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.60 (Cadastrar Livro para Consumo) para criar o registro necessário.
2. Executar antes a rotina D-3.41 (Gerar Livro a partir de Minuta) para criar o registro necessário.
3. Executar antes a rotina C-LIVRO-05 (Geração de Termos de Abertura e Encerramento de Livros Notariais) para criar o registro necessário.
4. Reexecutar a auditoria da rotina C-LIVRO-01.

* **Rotinas pré-requisito (executar antes):** **D-3.60**, **D-3.41**, **C-LIVRO-05**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Livros > Gestão e Controle de Folhas** (ou **Notas > Livros**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Livros**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Livros > Gestão e Controle de Folhas ou Notas > Livros"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Livros"** (confiança: 90% — Equivalência canônica "Livros" -> "Administração > Controle de Livros": não existe raiz "Livros" na barra do 06.05.02; a única tela de gestão de livros é "Administração > Controle de Livros" (C-LIVRO-01, C-LIVRO-05)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Gestão e Controle de Folhas"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Gestão e Controle de Folhas"
2. Selecione o Livro Notarial ativo no qual ocorreu o salto.
3. Na grade de controle de páginas, localize as folhas que ficaram em branco (ex.: Folha 089 V e Folha 090 F).
4. Selecione as páginas correspondentes e clique no botão **Ações > Inutilizar Folha / Declarar Sem Efeito**.
5. No campo **Justificativa Legal**, digite a certidão (ex.: *"Folha inutilizada por erro material de alimentação mecânica da impressora"*).
6. Confirme a operação. O status da página passará para `INUTILIZADA`.
7. No protocolo da escritura seguinte, confirme que o sistema assumiu automaticamente a primeira folha útil posterior.

* **Corregedoria: Imprima o termo de inutilização do sistema e arquive-o junto ao livro encadernado para exibição ao Juiz Corregedor Permanente.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão e Controle de Folhas" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Adminis → **mantido** (agora: passo 1, Dependência Cruzada de Rotina)
