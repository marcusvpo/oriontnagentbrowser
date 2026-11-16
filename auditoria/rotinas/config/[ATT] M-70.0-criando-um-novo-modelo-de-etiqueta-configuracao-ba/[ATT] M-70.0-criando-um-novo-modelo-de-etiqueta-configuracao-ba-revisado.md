---
id: M-70.0
titulo: 'Criando um Novo Modelo de Etiqueta (Configuração Básica)'
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
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Modelos de etiqueta", "Adicionar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração; Configurações > Modelos de impressão; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Primeira etapa na confecção de um modelo de etiqueta térmica, responsável por estabelecer o título, descrição, vínculo com o ato notarial da tabela de custas e definição de padrão de uso.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Modelos de etiqueta, Adicionar] não localizado no DOM nem na Árvore de Acessibilidade
2. No campo **Título**, digite um nome identificador claro (ex: 'Etiqueta Semelhança Sem Valor 2024 - 1 Coluna').
3. No campo **Descrição**, insira o detalhamento do propósito do modelo e impressoras compatíveis.
4. No campo **Serviço**, selecione na lista o ato notarial ao qual o modelo pertencerá (ex: **Reconhecimento de firma por semelhança sem valor econômico**).
5. Marque a caixa de seleção **Modelo padrão** se desejar que o Orion TN selecione este layout automaticamente toda vez que o escrevente lançar o ato no balcão.
6. Clique no botão **Avançar** para seguir para a configuração dos parâmetros técnicos e script de impressão.

* **Importante: Cada serviço notarial deve possuir apenas um modelo assinalado como 'Modelo padrão' para garantir fluxo automático no balcão.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**
