---
id: C-SELO-10
titulo: 'Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
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
        motivo: 'No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Naturezas de Atos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bl'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-17T05:01:47.402Z'
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Naturezas de Atos" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas", "Banco", "Cargo", "Documento apresentado", "Espécie", "Feriados", "Formas de pagamento", "Natureza", "Órgão expedidor", "Outros serviços", "Participação", "Perfil de partes", "Pessoa física", "Serviços Internos", "Situação do protocolo", "Tipo de movimentação financeira", "Tipo de documento", "Tipo de e-mail", "Tipo de endereço", "Tipo de telefone", "Tipo de representante"; "Naturezas de Atos" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Por equívoco de configuração cadastral, a flag de obrigatoriedade de conferência fiscal de ITCMD pode ser vinculada globalmente ao protocolo, impedindo o avanço de negócios onerosos em que incide apenas ITBI.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Cadastros Auxiliares > Naturezas de Atos
2. Localize a natureza jurídica do ato que está bloqueado (ex.: **Compra e Venda Pura** ou **Procuração**).
3. Clique em **Editar** e acesse a aba **Obrigações e Parâmetros Fiscais**.
4. Desmarque o checkbox **Exigir Comprovante de ITCMD na Conclusão do Protocolo**.
5. Acesse também **Configurações > Parâmetros do Caixa > Emissão de Recibos** e assegure que a validação de ITCMD esteja restrita às naturezas de inventário e doação.
6. Clique em **Salvar Parâmetros**.
7. Retorne ao protocolo, clique em **Salvar** e gere o recibo financeiro com sucesso.

* **Atenção Cadastral: Mantenha a exigência mandatória de ITCMD ligada apenas nas naturezas de Inventário, Partilha de Bens, Doação e Separação com Excesso de Meação.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Naturezas de Atos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bl → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
