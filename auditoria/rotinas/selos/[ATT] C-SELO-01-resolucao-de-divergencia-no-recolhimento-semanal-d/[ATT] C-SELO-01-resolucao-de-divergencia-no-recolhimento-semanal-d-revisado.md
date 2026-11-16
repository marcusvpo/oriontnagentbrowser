---
id: C-SELO-01
titulo: 'Resolução de Divergência no Recolhimento Semanal de Selos com o Portal do TJSP'
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
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Orion TN", "Módulos > Selo Digital > Auditoria / Conferência Semanal", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion; Administração > Comunicações > Auditoria de Selos; Administração > Comunicações > Selo digital (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Divergências na contagem semanal ocorrem principalmente quando há instabilidade na conexão e o sistema retém requisições em contingência local sem sincronizar o retorno definitivo do tribunal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Módulos > Selo Digital > Auditoria / Conferência Semanal**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Módulos > Selo Digital > Auditoria / Conferência Semanal] não localizado no DOM nem na Árvore de Acessibilidade
2. Filtre o período fiscal exato da semana em apuração (segunda a domingo).
3. Verifique a grade de **Selos com Envio Pendente** ou **Aguardando Retorno**.
4. Clique no botão **Transmitir Fila de Selos Pendentes** para forçar a comunicação síncrona com o webservice do TJ.
5. Caso o portal do TJSP continue desatualizado: acione a rotina **Exportar Arquivo de Remessa Manual** no Orion TN.
6. Acesse o portal do TJSP com certificado digital e efetue a **Reimportação Manual de Lote**, confirmando o aceite.

* **Prazo Legal: Efetue a auditoria da fila de selos impreterivelmente até as 18h de toda sexta-feira para evitar inconsistências no recolhimento bancário semanal.**
