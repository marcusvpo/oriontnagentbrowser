---
id: V-3.4.6
titulo: 'Gestão de Protocolos com Assinaturas Pendentes e Estorno de Recolhimento'
modulo: acesso
secao: V
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Para emitir recibo com pendência de assinaturas:']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Para emitir recibo com pendência de assinaturas:", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Explica o fluxo de trabalho para atos notariais em que o recibo precisa ser emitido preliminarmente, mas a coleta de assinaturas das partes ainda não foi concluída. Apresenta o mecanismo que mantém as taxas zeradas nos relatórios de recolhimento do TJ até a formalização do ato, bem como a rotina obrigatória de estorno de recolhimento para alteração de valores ou consolidação definitiva.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. **Para emitir recibo com pendência de assinaturas:**
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Para emitir recibo com pendência de assinaturas:, Custas, Assinaturas Pendentes, Gerar Recibo, "Assinaturas Pendentes", TJ (Tribunal de Justiça)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * Na aba de **Custas** do protocolo, antes de clicar em Gerar Recibo, marque a opção/flag **Assinaturas Pendentes**.
   * Cadastre o tomador e clique em **Gerar Recibo**.
   * Observe que o protocolo assumirá o status **"Assinaturas Pendentes"** (em vez de "Lavrado").
   * O sistema emitirá o recibo, porém manterá zerados os valores no relatório de recolhimento de taxas institucionais e o Selo Digital perante o **TJ (Tribunal de Justiça)**.
2. **Para finalizar o ato após a coleta de todas as assinaturas:**
   * Acesse o protocolo com status de **Assinaturas Pendentes**.
   * Execute o procedimento de **Estorno de Recolhimento** (ação restrita a usuários com permissão de acesso específica).
   * Acesse a aba de **Custas** e desmarque a opção **Assinaturas Pendentes**.
   * Clique novamente no botão **Gerar Recibo**.
   * O sistema atualizará o status do protocolo para **"Lavrado"** e incluirá os valores integralmente nos relatórios de recolhimento oficiais e transmissão definitiva ao TJ.
3. **Para realizar qualquer alteração de valores em protocolo com recibo gerado:**
   * Solicite a um usuário autorizado a execução do **Estorno de Recolhimento**.
   * Efetue as retificações necessárias nas custas ou no protocolo.
   * Emita novamente o recibo para gerar a nova consolidação financeira.

* **Observação: Qualquer modificação que envolva valores em um protocolo com recibo emitido bloqueia a gravação até que o recolhimento anterior seja formalmente estornado por usuário detentor do perfil de permissão adequado.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
