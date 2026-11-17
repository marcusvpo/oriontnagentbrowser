---
id: C-ACESSO-02
titulo: 'Inativação Segura de Colaborador Desligado com Preservação de Histórico e Auditoria'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Ativo', 'Inativo / Bloqueado']
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
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 3, o manual cita "Ativo", "Inativo / Bloqueado", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o per'
      bloqueio_atual:
        passo: 3
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-17T04:03:14.833Z'
    rota: '#/usuario/alterar/1'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Alteração de usuário']
    abas: []
    campos:
      - rotulo: 'Usuário'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'Cargo'
        tipo: 'text'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Telefone principal'
        tipo: 'text'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'Perfil de Usuário'
        tipo: 'select'
      - rotulo: 'Escrevente de Firmas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente de Notas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente e-Recepção'
        tipo: 'checkbox'
      - rotulo: 'Tabelião'
        tipo: 'checkbox'
      - rotulo: 'Supervisor'
        tipo: 'checkbox'
      - rotulo: 'Substituto'
        tipo: 'checkbox'
      - rotulo: 'Auxiliar'
        tipo: 'checkbox'
    botoes: ['Salvar', 'Excluir', 'Voltar']
    alvos_do_passo: ['Ativo', 'Inativo / Bloqueado']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Ativo', 'Inativo / Bloqueado']
    sugestao_reescrita: 'Sugestão de reescrita: Ativo, Inativo / Bloqueado não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Ativo", "Inativo / Bloqueado", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/usuario/alterar/1**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Alteração de usuário**.
> * **Campos:** **Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail**, **Telefone principal**, **Telefone**, **Perfil de Usuário**, **Escrevente de Firmas**, **Escrevente de Notas**, **Escrevente e-Recepção**, **Tabelião**, **Supervisor**, **Substituto**, **Auxiliar**.
> * **Botões:** **Salvar**, **Excluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Ativo**, **Inativo / Bloqueado**.
> * Sugestão de reescrita: **Ativo**, **Inativo / Bloqueado** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Em sistemas notariais e registrais, colaboradores que praticaram atos, lavraram livros ou emitiram selos jamais podem sofrer exclusão física direta do banco de dados (`DELETE`), pois seus identificadores estão vinculados às tabelas de auditoria e cumprimento de provimentos da Corregedoria. O encerramento de vínculo exige inativação lógica, a qual revoga o login e derruba sessões conectadas instantaneamente, resguardando todo o acervo histórico.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações** > submenu **Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
2. Localize o colaborador desligado na lista de operadores e dê um duplo clique sobre o registro (ou acione o botão **Alterar**).
   [aqui vai a print "passo-02.png"]
3. Na tela de cadastro do usuário, localize a caixa de seleção **Ativo** e desmarque-a (o status mudará para **Inativo / Bloqueado**).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Ativo, Inativo / Bloqueado] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Acesse a aba **Sessões Ativas / Conexões** e clique no botão **Derrubar Sessões Conectadas** para desconectar imediatamente eventuais instâncias abertas na rede ou remotamente.
5. Na aba **Observações**, registre a justificativa administrativa interna: *"Inativação por término de contrato de trabalho em [data]"*.
6. Clique no botão **Salvar** (`F10`). O acesso ao Orion TN e módulos integrados será bloqueado no mesmo instante.

* **Dica: Nunca compartilhe o login do colaborador inativado com seu sucessor. Cada novo funcionário deve possuir seu próprio CPF e credencial individual para conformidade com a LGPD e normas do CNJ.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 3 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 3, o manual cita "Ativo", "Inativo / Bloqueado", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o per → **mantido** (agora: passo 3, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
