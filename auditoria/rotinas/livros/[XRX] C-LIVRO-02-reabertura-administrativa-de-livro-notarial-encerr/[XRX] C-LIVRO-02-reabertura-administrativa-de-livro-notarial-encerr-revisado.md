---
id: C-LIVRO-02
titulo: 'Reabertura Administrativa de Livro Notarial Encerrado Prematuramente com Termos Vagos'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['C-LIVRO-05', 'D-3.60', 'D-3.41']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador', 'substituto']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'marcus'
    sessao_usuario: 'marcus'
    sessao_cargo: 'Teste'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webFirmas']
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Livros Notariais > Cadastro e Encerramento'
        elemento_real: 'Administração > Controle de Livros'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwuyrmuv1yhngt-74] | x=664, y=171, 192x20'
      - passo: 1
        alvo_documentado: 'Cadastro e Encerramento'
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Configurações > Livros Notariais > Cadastro e Encerramento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como '
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Livros Notariais > Cadastro e Encerramento" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de imp'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Livros Notariais > Cadastro e Encerramento" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de imp'
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
> **Motivo Técnico:** No passo 1, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: C-LIVRO-05 — Geração de Termos de Abertura e Encerramento de Livros Notariais; D-3.60 — Cadastrar Livro para Consumo; D-3.41 — Gerar Livro a partir de Minuta.

#### Descrição:
Quando o operador aciona a rotina de encerramento de livro sem atentar para o saldo de folhas vagas, o sistema bloqueia novos atos. O administrador pode cancelar a operação e reabrir o livro.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina C-LIVRO-05 (Geração de Termos de Abertura e Encerramento de Livros Notariais) para criar o registro necessário.
2. Executar antes a rotina D-3.60 (Cadastrar Livro para Consumo) para criar o registro necessário.
3. Executar antes a rotina D-3.41 (Gerar Livro a partir de Minuta) para criar o registro necessário.
4. Reexecutar a auditoria da rotina C-LIVRO-02.

* **Rotinas pré-requisito (executar antes):** **C-LIVRO-05**, **D-3.60**, **D-3.41**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com login de administrador ou substituto, acesse **Configurações > Livros Notariais > Cadastro e Encerramento**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Controle de Livros**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Livros Notariais > Cadastro e Encerramento"**, porém na versão atual do Orion TN a tela fica em **"Administração > Controle de Livros"** (confiança: 90% — Equivalência canônica "Configurações > Livros Notariais" -> "Administração > Controle de Livros": Configurações não tem "Livros Notariais"; a única tela de gestão de livros é "Administração > Controle de Livros" (C-LIVRO-02)). O texto do manual não foi alterado.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Cadastro e Encerramento"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Cadastro e Encerramento"
2. Localize o livro que consta com status `ENCERRADO`.
3. Selecione o livro e clique no botão **Ações > Reabrir Livro Notarial / Cancelar Encerramento**.
4. Informe a justificativa formal (ex.: *"Cancelamento de encerramento precoce para consumo dos termos restantes"*).
5. Confirme a operação. O livro retornará ao status de `Aberto / Em Uso`.
6. No balcão, utilize as posições remanescentes até o encerramento da numeração física real.
7. Concluído o lote, acione novamente a rotina formal de encerramento emitindo o respectivo termo.

* **Auditoria: Sempre confira a numeração do último termo impresso fisicamente antes de homologar o encerramento no sistema.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Livros Notariais > Cadastro e Encerramento" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de imp → **mantido** (agora: passo 1, Dependência Cruzada de Rotina)
