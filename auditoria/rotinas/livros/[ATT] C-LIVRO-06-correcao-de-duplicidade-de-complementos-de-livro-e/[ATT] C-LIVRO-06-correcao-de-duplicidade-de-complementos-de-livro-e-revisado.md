---
id: C-LIVRO-06
titulo: 'Correção de Duplicidade de Complementos de Livro e Folha em Lotes de Quinzena'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Fechamento de Quinzena / Comunicações", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Comunicações; Notas; Relatórios > Fechamento de caixa; Administração > Comunicações; Administração > Comunicações > Outras comunicações (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Quando dois atos ocupam a mesma página física (ex.: ato breve na frente e outro no verso) ou quando há folhas aditadas, é obrigatório utilizar o campo Complemento para garantir a unicidade de chave registral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse a tela de fechamento em **Notas > Fechamento de Quinzena / Comunicações**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Fechamento de Quinzena / Comunicações] não localizado no DOM nem na Árvore de Acessibilidade
2. Identifique na mensagem de alerta o número exato do Livro e da Folha em conflito.
3. Abra o protocolo correspondente em **Notas > Protocolo**, aba **Dados do Ato**.
4. No campo **Complemento de Folha**, informe a distinção formal (ex.: `V` para Verso, ou `A` / `B` para subdivisões autorizadas).
5. Salve o protocolo.
6. No ato correlato, assegure que o campo de complemento esteja devidamente preenchido com a especificação recíproca (ex.: `F` para Frente).
7. Retorne à tela de fechamento de quinzena e clique em **Revalidar Numerações**, liberando o lote.

* **Padrão Cadastral: Padronize o uso de "F" e "V" na serventia para eliminar conflitos de duplicidade em atos com mais de uma lavratura na mesma folha.**
