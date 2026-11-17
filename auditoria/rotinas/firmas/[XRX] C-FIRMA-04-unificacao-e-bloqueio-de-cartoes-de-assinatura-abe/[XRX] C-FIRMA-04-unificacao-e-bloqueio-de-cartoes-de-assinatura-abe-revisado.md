---
id: C-FIRMA-04
titulo: 'Unificação e Bloqueio de Cartões de Assinatura Abertos em Duplicidade'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.3', 'M-9.0', 'V-CCA.3.3']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Ficha Principal']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Balcão de Firmas > Fichas / Cartões de Assinatura'
        elemento_real: 'Firmas > Cadastros > Cartão de assinatura'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkvlejo3gi956-12] | x=633, y=109, 330x20'
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
        motivo: 'No passo 1, o manual cita "Balcão de Firmas > Fichas / Cartões de Assinatura", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Balcão de Firmas > Fichas / Cartões de Assinatura" não existe na árvore de navegação real do Orion TN. O menu raiz "Balcão de Firmas" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas",'
      bloqueio_atual:
        passo: 3
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 3, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: D-3.3 — Cadastrar Cartão de Assinatura; M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais); V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
A legislação veda a exclusão física de fichas numeradas. A duplicidade deve ser tratada elegendo-se a ficha primitiva como principal e inativando a ficha secundária com nota de remissão recíproca.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
2. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina C-FIRMA-04.

* **Rotinas pré-requisito (executar antes):** **D-3.3**, **M-9.0**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Balcão de Firmas > Fichas / Cartões de Assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Balcão de Firmas > Fichas / Cartões de Assinatura"**, porém na versão atual do Orion TN a tela fica em **"Firmas > Cadastros > Cartão de assinatura"** (confiança: 90% — Equivalência canônica "Balcão de Firmas > Fichas / Cartões de Assinatura" -> "Firmas > Cadastros > Cartão de assinatura": o "Balcão de Firmas" é "Firmas" no Orion TN 6.0 e o único cadastro de fichas é "Cartão de assinatura"). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Localize ambas as fichas buscando pelo CPF da parte.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
3. Identifique a ficha mais antiga (ou que possui o maior acervo de imagens e atos) para ser a **Ficha Principal**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Ficha Principal] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
4. Abra a ficha secundária (duplicada) e clique em **Editar**.
5. Altere o status para **Inativo / Bloqueado** e, no campo de observações, registre: *"Ficha aberta em duplicidade; atos unificados na Ficha nº [NUMERO_PRINCIPAL]"*.
6. Na Ficha Principal, registre no histórico a anotação da existência do cartão correlato inativado.
7. Clique em **Salvar** em ambas as fichas.

* **Auditoria Notarial: A inativação formal impede que novas firmas sejam reconhecidas no cartão excedente sem quebrar a rastreabilidade histórica.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Balcão de Firmas > Fichas / Cartões de Assinatura" não existe na árvore de navegação real do Orion TN. O menu raiz "Balcão de Firmas" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", → **superado** (agora: passo 3, Dependência Cruzada de Rotina)
