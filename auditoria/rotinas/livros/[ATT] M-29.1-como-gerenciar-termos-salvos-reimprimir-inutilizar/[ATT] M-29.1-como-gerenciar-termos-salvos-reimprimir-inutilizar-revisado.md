---
id: M-29.1
titulo: 'Como Gerenciar Termos Salvos (Reimprimir, Inutilizar, Digitalizar)'
modulo: livros
secao: M
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
> **Motivo Técnico:** No passo 1, o manual cita "Firmas > Consultas > Termos de comparecimento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite a manutenção e pós-processamento de termos de comparecimento já lavrados, possibilitando reimpressão de etiquetas, digitalização da folha assinada no livro e descarte formal por rasura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No pedido de atendimento ou em **Firmas > Consultas > Termos de comparecimento**, localize o termo desejado e abra a tela de gerenciamento.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Firmas > Consultas > Termos de comparecimento] não localizado no DOM nem na Árvore de Acessibilidade
2. Na listagem de termos registrados, utilize uma das opções de controle:
   * **Reimprimir**: emite nova via do espelho do termo ou das etiquetas de autenticidade caso a impressora tenha falhado.
   * **Digitalizar / Anexar**: aciona o scanner para capturar a página do livro devidamente rubricada e assinada pelo cliente para arquivamento digital seguro.
   * **Inutilizar Termo**: cancela formalmente o termo por erro de dados ou desistência, baixando os selos e lavrando certidão de inutilização.
   * **Reutilizar Folha do Livro**: caso a impressão do livro tenha sido cancelada antes de qualquer assinatura e a folha continue fisicamente em branco.
3. Confirme as ações na caixa de diálogo e informe a justificativa exigida pelo sistema.

* **Importante: Termos inutilizados após terem sido assinados exigem o cancelamento físico das assinaturas no livro com termo de cancelamento circunstanciado.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
