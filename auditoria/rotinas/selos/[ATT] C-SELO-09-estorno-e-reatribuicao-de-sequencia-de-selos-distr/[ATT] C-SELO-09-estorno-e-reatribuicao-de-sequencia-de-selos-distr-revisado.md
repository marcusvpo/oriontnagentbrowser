---
id: C-SELO-09
titulo: 'Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: '4tabeliao.scs'
    sessao_cargo: 'TABELIAO'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webGed', 'Perfil de acesso - Gerência webLivros', 'Perfil de acesso - Gerência webPro', 'Perfil de acesso - Gerência webFirmas']
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion Estoque']
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion Estoque", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion; Administração > Controle de Estoque (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
No Orion Estoque, os lotes de selos são entregues em pacotes sequenciais numerados. Se o administrador distribuir o lote 2 antes do lote 1, os escreventes consomem selos fora de ordem cronológica.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o módulo **Orion Estoque** com perfil de administrador.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion Estoque] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Navegue até **Distribuição > Histórico de Distribuição**.
3. Localize a distribuição equivocada entregue ao operador.
4. Verifique se nenhum selo daquele lote já foi consumido em atos lavrados.
5. Clique no botão **Estornar Distribuição** e confirme o cancelamento.
6. Acesse a tela de **Nova Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador.
7. Solicite ao escrevente que atualize a tela de lavratura para carregar o novo numerador.

* **Fiscalização: A quebra indevida da sequência de distribuição é apontada em relatórios de correição; sempre confira o número inicial antes de confirmar o lote.**
