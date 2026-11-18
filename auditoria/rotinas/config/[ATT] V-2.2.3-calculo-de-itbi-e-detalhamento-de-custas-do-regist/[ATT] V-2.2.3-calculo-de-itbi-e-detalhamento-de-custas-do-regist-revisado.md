---
id: V-2.2.3
titulo: 'Cálculo de ITBI e Detalhamento de Custas do Registro de Imóveis via Tabela Auxiliar'
modulo: config
secao: V
auditoria_ui:
  data_execucao: '2026-11-18'
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
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['ITBI']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
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
        motivo: 'No passo 1, o manual cita "ITBI", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência'
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
        motivo: 'No passo 1, o manual cita "ITBI", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investiga'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-18T05:48:14.818Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['ITBI']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['ITBI']
    sugestao_reescrita: 'Sugestão de reescrita: ITBI não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "ITBI", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **ITBI**.
> * Sugestão de reescrita: **ITBI** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Procedimento para apurar o imposto de transmissão (ITBI) e utilizar a ferramenta da Tabela do Registro de Imóveis (acessada pelo ícone de cifrão) no **ORION TN** para incluir detalhadamente custas acessórias registrais, tais como prenotações, certidões e averbações, considerando o ISS da respectiva comarca.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na seção de **ITBI**, confira o cálculo apresentado:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [ITBI, Alíquota] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * O sistema sugere a cidade e a alíquota padrão configuradas no cartório.
   * Para alterar, digite o nome de outra cidade cadastrada (para carregar a alíquota vinculada) ou digite diretamente o percentual no campo **Alíquota** para que o sistema refaça o cálculo do ITBI instantaneamente.
2. Na seção de **Registro de Imóveis**, observe o valor sugerido automaticamente com base na base de cálculo do ato.
3. Para detalhar e somar despesas registrais complementares (certidões, averbações e prenotações):
   * Clique no ícone de **Cifrão ($)** localizado imediatamente ao lado do campo de Registro de Imóveis.
4. Na tela auxiliar da **Tabela do Registro de Imóveis** que se abre:
   * **Certidões**: o sistema já exibe por padrão o item de certidões do registro. Informe a **Quantidade** necessária (ex.: 2 certidões) e o sistema atualizará o subtotal.
   * **Cidade e Percentual de ISS**: ajuste a cidade da comarca do registro e o percentual de **ISS** aplicável para recalcular a tributação municipal das custas registrais.
   * **Adicionar Atos (Averbações / Prenotação)**: clique no botão **+** (Adicionar ato), digite o código do item no campo correspondente (se souber) ou digite a descrição (ex.: "Averbação com valor declarado" ou "Prenotação"), selecione o item sugerido e defina a **Quantidade**.
5. Verifique o panorama geral e o somatório dos emolumentos registrais apurados na janela auxiliar.
6. Clique no botão **Concluir** na janela da tabela do registro.
7. O sistema exibirá uma mensagem de validação alertando que a soma dos itens da tabela é diferente do valor original do campo e perguntará: *"Deseja atualizar o valor?"*.
8. Clique em **Sim** para confirmar a importação do montante discriminado para o campo principal de Registro de Imóveis no orçamento.

* **Observação: O cálculo padrão automático do sistema considera unicamente o ato de registro principal; a abertura da tabela pelo ícone de **Cifrão ($)** é indispensável quando o orçamento do cliente exigir o cômputo prévio de prenotação, certidões e averbações imobiliárias.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "ITBI", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investiga → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
