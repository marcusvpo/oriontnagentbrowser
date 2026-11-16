---
id: C-ACESSO-07
titulo: 'Liberação de Acesso e Impressão de Consulta de Serviços Praticados para Auxiliares'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Grupos e Perfis de Acesso'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Grupos e Perfis de Acesso", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Controle de Estoque > Cadastros > Grupos de distribuição; Configurações > Perfis e permissões de acesso (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O relatório de Serviços Praticados é uma ferramenta essencial de prestação de contas no encerramento do turno de balcão, permitindo conferir a quantidade de autenticações, reconhecimentos de firma e certidões expedidas. Quando operadores com perfil auxiliar assumem o caixa do balcão, o perfil de acesso precisa ter essa prerrogativa liberada individualmente ou pelo grupo funcional.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No Orion TN, acesse o menu **Configurações** > **Grupos e Perfis de Acesso** (ou **Usuários** para ajuste individual).
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Grupos e Perfis de Acesso"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Grupos e Perfis de Acesso"
2. Localize o grupo **Auxiliares de Cartório** e clique em **Alterar**.
3. Na árvore de permissões, expanda **Balcão de Firmas** > pasta **Consultas e Relatórios**.
4. Localize e marque a opção **[x] Consulta de Serviços Praticados** e o subitem **[x] Permitir Impressão de Extrato Operacional**.
5. Se a serventia restringe a visualização financeira, desmarque a opção **Exibir Valores de Emolumentos e Caixa Líquido** para apresentar apenas o quantitativo físico de atos.
6. Clique no botão **Salvar**.
7. Oriente o colaborador a fechar o módulo e reabri-lo; o menu **Balcão de Firmas** > **Relatórios** > **Serviços Praticados** estará imediatamente disponível.

* **Dica: Para maior controle de gestão, utilize a restrição de visualização por operador, garantindo que cada atendente visualize apenas os atos que ele próprio selou e praticou.**
