---
id: C-FIRMA-08
titulo: 'Migração e Reconhecimento de Imagens de Cartões de Assinatura em Novo Caminho de Rede'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-24'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: 'Configurações > Parâmetros Gerais > Armazenamento e GED'
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Orion TN", "Configurações > Parâmetros Gerais > Armazenamento e GED", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o eleme'
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
        motivo: 'No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Armazenamento e GED" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impres'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-24'
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
        motivo: 'No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Armazenamento e GED" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impres'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-24T17:21:32.449Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros Gerais > Armazenamento e GED" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Caminho das Imagens do Balcão de Firmas / Assinaturas", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
As imagens digitalizadas de assinaturas não ficam armazenadas dentro do banco relacional, mas sim em diretório estruturado no servidor de arquivos (GED). Quando o servidor é renomeado ou migrado, o ponteiro de rede deve ser atualizado.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 2 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Assegure que a pasta compartilhada no novo servidor possui permissões completas de leitura/escrita para todos os usuários do cartório.
   [aqui vai a print "passo-01.png"]
2. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Armazenamento e GED**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Configurações > Parâmetros Gerais > Armazenamento e GED"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por equivalência canônica explícita (Camada 1) ("Configurações > Parâmetros Gerais > Armazenamento e GED" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Caminho das Imagens do Balcão de Firmas / Assinaturas", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "OrionTN - Tabelionatos de Notas", "Configurações", "Cartão de assinatura", "Cálculo de custas", "Controle de guia", "Geral", "Consumo NFS", "Tipo", "Qtd. na busca", "Produto", "Consumo selo digital", "Configurações da rotina de bloqueio de cartões de assinatura", "Ativar rotina de bloqueio automático de cartões de assinatura", "Horário de execução", "Arredondamento".
3. Localize o campo **Caminho das Imagens do Balcão de Firmas / Assinaturas**.
4. Informe o novo caminho UNC (ex.: `\\novo_servidor\OrionTN_Imagens\Firmas\`).
5. Clique no botão **Testar Leitura de Diretório** e valide a mensagem de confirmação.
6. Clique em **Gravar**.
7. Abra uma ficha de firma de teste e certifique-se de que a imagem da assinatura é exibida instantaneamente na tela.

* **Infraestrutura: Utilize caminhos UNC padrão de rede em vez de letras de unidades mapeadas (como `Z:\`) para evitar perda de vínculo ao trocar de usuário no Windows.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Armazenamento e GED" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impres → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
