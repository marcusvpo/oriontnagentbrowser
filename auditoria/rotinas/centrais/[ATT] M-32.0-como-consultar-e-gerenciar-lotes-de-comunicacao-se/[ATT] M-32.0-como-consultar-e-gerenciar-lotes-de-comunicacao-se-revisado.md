---
id: M-32.0
titulo: 'Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado)'
modulo: centrais
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
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
        motivo: 'No passo 1, o manual cita "Administração > Comunicações > Lotes de comunicação", "Firmas > Comunicações > Lotes SEFAZ", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a apli'
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
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Lotes de comunicação" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T04:53:52.344Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Lotes de comunicação" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações", "Auditoria de Selos", "Selo digital", "RPS", "Recolhimento", "Auditoria de RPS"; "Lotes de comunicação" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Painel central para monitoramento, auditoria e manutenção dos lotes de comunicação digital transmitidos às centrais externas (SEFAZ-SP para atos veiculares e e-Notariado), permitindo inspecionar logs técnicos e estornar lotes inconsistentes.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Comunicações > Lotes de comunicação** (ou **Firmas > Comunicações > Lotes SEFAZ**).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Administração > Comunicações > Lotes de comunicação
2. Na área de filtros, defina a busca: selecione o **Destino** (**SEFAZ** ou **e-Notariado**), o **Período de envio**, o **Número do Lote** ou o **Status** (**Processado**, **Pendente**, **Rejeitado**).
3. Clique em **Filtrar** para listar os lotes na tela.
4. Na linha do lote pretendido, utilize as ferramentas disponíveis:
   * **Visualizar logs**: abre a janela técnica com o XML de envio, XML de retorno e respostas do webservice.
   * **Itens do lote**: relaciona todos os termos de comparecimento ou cartões que integraram o envio.
   * **Estornar lote**: desfaz a remessa, retornando os termos para o status 'Pendente' para que possam ser corrigidos e reenviados.
5. Clique em **Fechar** ou **Voltar** ao concluir a análise.

* **Importante: Apenas lotes com status 'Rejeitado' ou com falha técnica devem ser estornados; lotes homologados e com recibo definitivo da SEFAZ não podem ser desfeitos.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Lotes de comunicação" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
