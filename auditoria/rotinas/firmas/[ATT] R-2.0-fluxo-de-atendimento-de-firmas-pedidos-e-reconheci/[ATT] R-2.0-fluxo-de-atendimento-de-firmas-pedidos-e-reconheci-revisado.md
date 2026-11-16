---
id: R-2.0
titulo: 'Fluxo de Atendimento de Firmas: Pedidos e Reconhecimentos'
modulo: firmas
secao: R
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-4'
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
        alvo_documentado: 'Firmas > Balcão de firmas'
        elemento_real: '(não localizado na tela)'
        camada: permission_blocked
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Insuficiência de Privilégio na Conta de Homologação**.
>
> **Motivo Técnico:** A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Firmas > Balcão de firmas", citado no passo 1: a aplicação o marca como bloqueado para o perfil (Item oculto pela aplicação para o perfil logado). Evidência no DOM: item da árvore de navegação com a classe disabled/ngx-orion-hide. O elemento existe no sistema; o texto original foi preservado.

#### Descrição:
No Orion TN, o atendimento no balcão de firmas estrutura-se pela relação entre o **Pedido** (comanda que agrupa todos os atos solicitados pelo cliente) e os **Serviços** (atos individuais executados, como reconhecimentos de firma e autenticações).

#### Roteiro Técnico para Execução Manual:
1. Liberar a funcionalidade "Firmas > Balcão de firmas" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.
2. Reexecutar a auditoria desta rotina e revisar as prints geradas.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Balcão de Firmas** para abrir a interface central de atendimento.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Alvo bloqueado para o perfil logado:** **"Firmas > Balcão de firmas"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (Item oculto pela aplicação para o perfil logado — item da árvore de navegação com a classe disabled/ngx-orion-hide).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Insuficiência de Privilégio na Conta de Homologação: "Firmas > Balcão de firmas" está bloqueado para o perfil logado (Item oculto pela aplicação para o perfil logado)
2. Inicie um **Novo Pedido** clicando no botão **"+"** ou importando a senha do pré-atendimento (Siplan SGA).
3. No campo de busca do pedido, pesquise o cliente por **Nome** ou **CPF** para carregar a ficha de assinatura e documentos.
4. Clique em **Adicionar Serviço (+)** e lance os atos solicitados (ex: 2 reconhecimentos por autenticidade e 3 autenticações de cópias) vinculados ao mesmo pedido.
5. Após concluir os lançamentos e conferências, clique no botão **Finalizar Pedido / Enviar ao Caixa** para emitir as etiquetas com selos e liberar a cobrança.

* **Observação: O agrupamento de múltiplos serviços em um único pedido simplifica a emissão de recibo unificado no caixa.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
