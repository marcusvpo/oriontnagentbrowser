---
id: C-SELO-10
titulo: 'Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos'
modulo: selos
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
> **Motivo Técnico:** No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Naturezas de Atos", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Administração > Controle de Estoque > Cadastros; Configurações; Configurações > Cadastros auxiliares (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Por equívoco de configuração cadastral, a flag de obrigatoriedade de conferência fiscal de ITCMD pode ser vinculada globalmente ao protocolo, impedindo o avanço de negócios onerosos em que incide apenas ITBI.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configurações > Cadastros Auxiliares > Naturezas de Atos] não localizado no DOM nem na Árvore de Acessibilidade
2. Localize a natureza jurídica do ato que está bloqueado (ex.: **Compra e Venda Pura** ou **Procuração**).
3. Clique em **Editar** e acesse a aba **Obrigações e Parâmetros Fiscais**.
4. Desmarque o checkbox **Exigir Comprovante de ITCMD na Conclusão do Protocolo**.
5. Acesse também **Configurações > Parâmetros do Caixa > Emissão de Recibos** e assegure que a validação de ITCMD esteja restrita às naturezas de inventário e doação.
6. Clique em **Salvar Parâmetros**.
7. Retorne ao protocolo, clique em **Salvar** e gere o recibo financeiro com sucesso.

* **Atenção Cadastral: Mantenha a exigência mandatória de ITCMD ligada apenas nas naturezas de Inventário, Partilha de Bens, Doação e Separação com Excesso de Meação.**
