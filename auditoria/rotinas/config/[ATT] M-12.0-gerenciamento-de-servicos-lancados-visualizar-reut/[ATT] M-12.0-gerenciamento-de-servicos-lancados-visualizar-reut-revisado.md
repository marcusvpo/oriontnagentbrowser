---
id: M-12.0
titulo: 'Gerenciamento de Serviços Lançados (Visualizar, Reutilizar/Inutilizar Selo)'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Insuficiência de Privilégio na Conta de Homologação'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Balcão de Firmas'
        elemento_real: '(não localizado na tela)'
        camada: permission_blocked
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Insuficiência de Privilégio na Conta de Homologação**.
>
> **Motivo Técnico:** A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de Firmas", citado no passo 1: a aplicação o marca como bloqueado para o perfil (item oculto pela aplicação para o perfil logado). Evidência no DOM: li.functionality.ngx-orion-hide. O elemento existe no sistema; o texto original foi preservado.

#### Descrição:
Permite auditar e gerenciar atos já praticados no pedido de balcão de firmas, possibilitando pré-visualizar etiquetas e termos, devolver selos não utilizados ao estoque ou inutilizar selos avariados.

#### Roteiro Técnico para Execução Manual:
1. Liberar a funcionalidade "Balcão de Firmas" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.
2. Reexecutar a auditoria desta rotina e revisar as prints geradas.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela do **Balcão de Firmas**, localize o serviço na grade **Últimos serviços realizados** ou abra a tela de detalhes do pedido.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Alvo bloqueado para o perfil logado:** **"Balcão de Firmas"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (item oculto pela aplicação para o perfil logado — li.functionality.ngx-orion-hide).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Insuficiência de Privilégio na Conta de Homologação: "Balcão de Firmas" está bloqueado para o perfil logado (item oculto pela aplicação para o perfil logado)
2. Na linha do serviço registrado, selecione a ação correspondente:
   * **Visualizar etiqueta**: abre a pré-visualização do espelho impresso com layout e QR Code.
   * **Visualizar termo**: abre o PDF do Termo de Comparecimento vinculado ao ato.
   * **Reutilizar selo**: estorna o selo (físico ou digital) de volta ao estoque livre, caso o serviço tenha sido cancelado sem que o selo tenha sido colado ou inutilizado.
   * **Inutilizar selo**: descarta o selo permanentemente por rasura ou problema mecânico, dando baixa no estoque e registrando a justificativa.
3. Confirme a operação na caixa de diálogo para atualização imediata do estoque e dos registros do pedido.

* **Importante: A opção **Reutilizar selo** só deve ser acionada se o selo estiver íntegro. Se a etiqueta física foi rasgada ou aplicada no papel do cliente, o selo deve ser **Inutilizado**.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
