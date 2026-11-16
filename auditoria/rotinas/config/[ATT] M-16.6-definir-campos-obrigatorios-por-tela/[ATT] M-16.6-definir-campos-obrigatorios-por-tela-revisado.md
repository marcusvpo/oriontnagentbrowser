---
id: M-16.6
titulo: 'Definir Campos Obrigatórios por Tela'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
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
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Campos obrigatórios", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite customizar as regras de validação por tela do sistema, definindo quais campos devem ser de preenchimento compulsório antes de liberar o salvamento de cadastros e atos, garantindo integridade cadastral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Campos obrigatórios**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Campos obrigatórios] não localizado no DOM nem na Árvore de Acessibilidade
2. No campo **Tela**, selecione o formulário que deseja parametrizar (ex: 'Cartão de Assinatura', 'Protocolo de Notas', 'Pessoa Jurídica', 'Pedido de Certidão').
3. Visualize a lista de todos os campos disponíveis no respectivo formulário.
4. Marque a caixa de seleção na coluna **Obrigatório** para os dados que passam a ser exigidos (ex: CPF, Telefone, Nacionalidade, Estado Civil, CEP).
5. Desmarque os campos que a serventia optar por manter como opcionais.
6. Clique no botão **Salvar** para aplicar as validações em todas as estações.

* **Observação: Quando um campo estiver marcado como obrigatório, o sistema destacará a borda em vermelho e impedirá o clique em Concluir/Salvar até seu preenchimento.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
