---
id: C-LIVRO-08
titulo: 'Consolidação Financeira e Recálculo de Subtotais do Livro Caixa / LCW após Encerramento'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion Caixa", "Administração > Rotinas Especiais > Consolidação de Movimentações", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Fechamento de caixa; Relatórios > Auditoria Selos TJ - Orion; Administração (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Se houver inserção ou estorno de lançamentos financeiros em datas pretéritas já consolidadas, os saldos progressivos acumulados sofrem defasagem. É indispensável acionar a consolidação matemática.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion Caixa**, acesse o menu **Administração > Rotinas Especiais > Consolidação de Movimentações**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion Caixa, Administração > Rotinas Especiais > Consolidação de Movimentações] não localizado no DOM nem na Árvore de Acessibilidade
2. Informe a data inicial a partir da qual houve a alteração do lançamento extemporâneo.
3. Marque a opção **Recalcular Saldos Diários e Subtotais Progressivos**.
4. Clique no botão **Executar Consolidação** e aguarde o processamento completo.
5. Acesse o módulo **LCW (Livro Caixa Web)** ou a rotina de emissão do Livro Diário.
6. Gere novamente o relatório contábil do período.
7. Confirme que todos os subtotais e transportes de página passaram a refletir a soma exata.

* **Boas Práticas Contábeis: Execute a consolidação de movimentações sempre no último dia útil do mês antes da emissão definitiva dos balancetes.**
