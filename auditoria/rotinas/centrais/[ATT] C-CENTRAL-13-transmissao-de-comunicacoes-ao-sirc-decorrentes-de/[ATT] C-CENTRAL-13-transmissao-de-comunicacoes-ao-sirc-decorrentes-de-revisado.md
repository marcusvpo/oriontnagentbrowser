---
id: C-CENTRAL-13
titulo: 'Transmissão de Comunicações ao SIRC decorrentes de Inventários e Testamentos'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Orion TN", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiê'
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
        motivo: 'No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > SIRC / Comunicações Previdenciárias" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outr'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-18T02:00:45.851Z'
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
> **Motivo Técnico:** No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > SIRC / Comunicações Previdenciárias" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações", "Auditoria de Selos", "Selo digital", "RPS", "Recolhimento", "Auditoria de RPS"; "SIRC / Comunicações Previdenciárias" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Os tabelionatos de notas devem comunicar atos que envolvam pessoas falecidas aos órgãos previdenciários e assistenciais para prevenir fraudes em benefícios.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 2 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, certifique-se de que no cadastro do inventário a certidão de óbito do autor da herança (Livro, Folha, Termo e Município) foi preenchida na aba do falecido.
   [aqui vai a print "passo-01.png"]
2. Acesse o menu **Administração > Comunicações > SIRC / Comunicações Previdenciárias**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Administração > Comunicações > SIRC / Comunicações Previdenciárias
3. Selecione o período de apuração mensal.
4. Clique no botão **Compilar Registros de Óbito de Inventários**.
5. Valide a listagem gerada e clique em **Transmitir / Exportar para o SIRC**.
6. Imprima o comprovante de remessa para anexar à pasta de prestação de contas da serventia.

* **Conformidade Legal: A conferência do número de matrícula da certidão de óbito do de cujus evita devoluções de consistência pelo sistema do INSS.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > SIRC / Comunicações Previdenciárias" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outr → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
