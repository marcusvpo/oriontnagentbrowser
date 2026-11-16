---
id: M-16.8
titulo: 'Parametrizar Pedido de Firmas e Termo de Comparecimento'
modulo: firmas
secao: M
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
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Abertura de pedido; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Configura o comportamento operacional dos módulos de Atendimento de Firmas e Termos de Comparecimento, regulando captura biométrica compulsória, senhas de fila e regras de escrituração em livros.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Pedido de firmas e Termo de comparecimento**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Pedido de firmas e Termo de comparecimento] não localizado no DOM nem na Árvore de Acessibilidade
2. Na seção **Pedido de Firmas**, selecione se o cartório utiliza módulo de senhas de atendimento e defina o formato da numeração de pedidos.
3. Na seção **Termo de Comparecimento**, configure as exigências biométricas: marque a opção para **Exigir captura de biometria** e defina o **Tipo de captura** (**Apenas um dedo** ou **Todos os dedos**).
4. Defina as regras de vinculação a **Livros Notariais**, selecionando se a escolha do livro deve ser automática por escrevente ou manual pelo operador.
5. Marque se o sistema deve gerar automaticamente o espelho de impressão ao concluir o termo.
6. Clique no botão **Salvar** para registrar os parâmetros.

* **Importante: A exigência de biometria no termo atende aos padrões de segurança jurídica contra fraudes em transferências veiculares e procurações.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
