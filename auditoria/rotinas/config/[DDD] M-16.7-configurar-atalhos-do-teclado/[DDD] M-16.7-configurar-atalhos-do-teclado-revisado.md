---
id: M-16.7
titulo: 'Configurar Atalhos do Teclado'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['CTRL + ALT + N', 'F2']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Geral'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Inteligência Artificial'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Parâmetros por estação'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Comissões e mensalistas'
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: 'Sequência'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Atalhos do teclado'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwkuhopof8jhih-130] | x=850, y=171, 175x20'
      - passo: 1
        alvo_documentado: 'Atalhos do teclado'
        elemento_real: 'Painel de atalhos'
        camada: dom_synonym_heuristic
        confianca: 0.9
        texto_alterado: false
        evidencia: 'dom-measured | group:[data-orion-stateful-stmwkuippf85wq-0] | x=26, y=298, 211x32'
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
        motivo: 'No passo 4, o manual cita "CTRL + ALT + N", "F2", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Administração > Parâmetros > Atalhos do teclado'
          real: 'Administração'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_dados_banco'
      tags_atuais: ['DDD']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Atalhos do teclado" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritur'
      bloqueio_atual:
        passo: 4
        tipo: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Dados no Banco de Homologação (Grade Vazia)**.
>
> **Motivo Técnico:** No passo 4, a validação não pôde prosseguir: grade com 4 coluna(s) visível(is) (Função, Base, Atalho, Complemento) e 0 linhas de dados. Não existe botão Adicionar/Novo na tela. Nenhuma rotina do KB cria esses registros.

#### Descrição:
Permite atribuir combinações de teclas rápidas (ex: combinações com CTRL, ALT e teclas funcionais) às operações mais repetitivas do cartório, conferindo agilidade ao atendimento de balcão.

#### Roteiro Técnico para Execução Manual:
1. Equipe de Produtos: popular o banco de homologação com ao menos um registro nesta tela.
2. Reexecutar a auditoria da rotina M-16.7.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Atalhos do teclado**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Painel de atalhos**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Atalhos do teclado"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Atalhos do teclado"**, porém na tela atual do Orion TN o elemento se chama **"Painel de atalhos"** (confiança: 90% — Na tela #/configuracoes, o manual cita "Atalhos do teclado" e a tela real chama a aba de "Painel de atalhos" (única aba de atalhos da tela)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Painel de atalhos** foi medida ao vivo (sinônimo contextual da rota) e acionada.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
2. Na listagem de ações do sistema, localize a função desejada (ex: 'Novo Pedido de Firmas', 'Lançar e Imprimir', 'Localizar Parte', 'Finalizar Pedido').
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
3. Clique sobre o campo de comando correspondente à ação.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
4. Pressione a combinação de teclas pretendida no teclado físico (ex: **CTRL + ALT + N** ou tecla de função **F2**).
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Função, Base, Atalho, Complemento).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [CTRL + ALT + N, F2] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
5. O sistema validará se a combinação não colide com outra função já parametrizada.
6. Clique no botão **Salvar** para registrar os atalhos.

* **Importante: Evite atribuir combinações nativas do Windows (como CTRL + C, CTRL + V ou ALT + F4) para não gerar conflito com o sistema operacional.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [DDD] dependencia_dados_banco
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Atalhos do teclado" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escritur → **superado** (agora: passo 4, Dependência de Dados no Banco de Homologação (Grade Vazia))
