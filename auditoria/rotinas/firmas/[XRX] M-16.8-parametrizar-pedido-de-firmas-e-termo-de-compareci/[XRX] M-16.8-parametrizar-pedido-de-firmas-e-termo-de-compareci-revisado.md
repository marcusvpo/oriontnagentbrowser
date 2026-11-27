---
id: M-16.8
titulo: 'Parametrizar Pedido de Firmas e Termo de Comparecimento'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['M-54.3', 'R-10.0', 'M-13.0']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Pedido de Firmas']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 2
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: 'Pedido de firmas'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'E-mail'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Editor'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Painel de atalhos'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Captura e digitalização'
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: 'Comissões e mensalistas'
          deduzido_do_dom: false
          resultado: sem_efeito
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
        motivo: 'No passo 1, o manual cita "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o e'
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
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicaç'
      bloqueio_atual:
        passo: 2
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Pedido de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Pedido de firmas e Termo de comparecimento'
          real: 'Pedido de firmas'
          confirmada_ao_vivo: true
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Pedido de firmas e Termo de comparecimento'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Pedido de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      curas_reaproveitadas:
        - passo: 1
          alvo: 'Pedido de firmas e Termo de comparecimento'
          real: 'Pedido de firmas'
          confirmada_ao_vivo: false
          usada_como_dica: false
        - passo: 1
          alvo: 'Administração > Parâmetros > Pedido de firmas e Termo de comparecimento'
          real: 'Configurações > Parametrizações'
          confirmada_ao_vivo: false
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um pedido que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: M-54.3 — Como Lançar as Custas em um Pedido de Certidão; R-10.0 — Abrir Pedido de Firmas no Balcão de Atendimento; M-13.0 — Abertura de Pedido de Firmas com Senha (Pré-Atendimento).

#### Descrição:
Configura o comportamento operacional dos módulos de Atendimento de Firmas e Termos de Comparecimento, regulando captura biométrica compulsória, senhas de fila e regras de escrituração em livros.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-54.3 (Como Lançar as Custas em um Pedido de Certidão).
2. Executar antes a rotina R-10.0 (Abrir Pedido de Firmas no Balcão de Atendimento).
3. Executar antes a rotina M-13.0 (Abertura de Pedido de Firmas com Senha (Pré-Atendimento)).
4. Com o pedido aberto, reexecutar a auditoria da rotina M-16.8.

* **Rotinas pré-requisito (executar antes):** **M-54.3**, **R-10.0**, **M-13.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações** e selecione a aba **Pedido de firmas**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
2. Na seção **Pedido de Firmas**, selecione se o cartório utiliza módulo de senhas de atendimento e defina o formato da numeração de pedidos.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Pedido de Firmas] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Na seção **Termo de Comparecimento**, configure as exigências biométricas: marque a opção para **Exigir captura de biometria** e defina o **Tipo de captura** (**Apenas um dedo** ou **Todos os dedos**).
4. Defina as regras de vinculação a **Livros Notariais**, selecionando se a escolha do livro deve ser automática por escrevente ou manual pelo operador.
5. Marque se o sistema deve gerar automaticamente o espelho de impressão ao concluir o termo.
6. Clique no botão **Concluir** para registrar os parâmetros.

* **Importante: A exigência de biometria no termo atende aos padrões de segurança jurídica contra fraudes em transferências veiculares e procurações.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Pedido de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
* **Cura reaproveitada (passo 1):** "Pedido de firmas e Termo de comparecimento" → "Pedido de firmas" — não reconfirmada nesta execução (a dica não foi usada)
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento" → "Configurações > Parametrizações" — não reconfirmada nesta execução (a dica não foi usada)
