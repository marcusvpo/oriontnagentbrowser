---
id: C-SELO-01
titulo: 'Resolução de Divergência no Recolhimento Semanal de Selos com o Portal do TJSP'
modulo: selos
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
  prints_geradas: 1
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
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Orion TN", "Módulos > Selo Digital > Auditoria / Conferência Semanal", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elem'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Módulos > Selo Digital > Auditoria / Conferência Semanal" não existe na árvore de navegação real do Orion TN. O menu raiz "Módulos" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T02:37:30.159Z'
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
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Módulos > Selo Digital > Auditoria / Conferência Semanal" não existe na árvore de navegação real do Orion TN. O menu raiz "Módulos" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administração", "Históricos", "Configurações", "9+", "0", "Olá, Marcus", "Olá Marcus , seja bem-vindo!"). Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Divergências na contagem semanal ocorrem principalmente quando há instabilidade na conexão e o sistema retém requisições em contingência local sem sincronizar o retorno definitivo do tribunal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Módulos > Selo Digital > Auditoria / Conferência Semanal**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Módulos > Selo Digital > Auditoria / Conferência Semanal
2. Filtre o período fiscal exato da semana em apuração (segunda a domingo).
3. Verifique a grade de **Selos com Envio Pendente** ou **Aguardando Retorno**.
4. Clique no botão **Transmitir Fila de Selos Pendentes** para forçar a comunicação síncrona com o webservice do TJ.
5. Caso o portal do TJSP continue desatualizado: acione a rotina **Exportar Arquivo de Remessa Manual** no Orion TN.
6. Acesse o portal do TJSP com certificado digital e efetue a **Reimportação Manual de Lote**, confirmando o aceite.

* **Prazo Legal: Efetue a auditoria da fila de selos impreterivelmente até as 18h de toda sexta-feira para evitar inconsistências no recolhimento bancário semanal.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Módulos > Selo Digital > Auditoria / Conferência Semanal" não existe na árvore de navegação real do Orion TN. O menu raiz "Módulos" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", " → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
