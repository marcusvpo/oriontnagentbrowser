---
id: M-14.2
titulo: 'Balcão de Firmas: Lançando Serviços e Imprimindo Etiquetas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
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
        alvo_documentado: 'Balcão de firmas'
        elemento_real: '(não localizado na tela)'
        camada: permission_blocked
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Insuficiência de Privilégio na Conta de Homologação**.
>
> **Motivo Técnico:** A conta "4tabeliao.scs" ("Perfil de acesso - Gerência webCaixa", "Perfil de acesso - Gerência webEstoque", "Perfil de acesso - Gerência webGed", "Perfil de acesso - Gerência webLivros", "Perfil de acesso - Gerência webPro", "Perfil de acesso - Gerência webFirmas") não tem acesso a "Balcão de firmas", citado no passo 1: a aplicação o marca como bloqueado para o perfil (item oculto pela aplicação para o perfil logado). Evidência no DOM: li.functionality.ngx-orion-hide. O elemento existe no sistema; o texto original foi preservado.

#### Descrição:
Detalha o procedimento de inclusão dos atos notariais no pedido (reconhecimento por semelhança com/sem valor econômico, autenticações), cálculo automático de emolumentos e disparo da impressão de etiquetas térmicas.

#### Roteiro Técnico para Execução Manual:
1. Liberar a funcionalidade "Balcão de firmas" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.
2. Reexecutar a auditoria desta rotina e revisar as prints geradas.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com a parte selecionada na tela **Balcão de firmas**, acesse o painel **Lançamento de Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Alvo bloqueado para o perfil logado:** **"Balcão de firmas"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (item oculto pela aplicação para o perfil logado — li.functionality.ngx-orion-hide).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Insuficiência de Privilégio na Conta de Homologação: "Balcão de firmas" está bloqueado para o perfil logado (item oculto pela aplicação para o perfil logado)
2. Selecione o serviço pretendido:
   * **Reconhecimento de firma por semelhança** (com ou sem valor econômico).
   * **Reconhecimento por autenticidade** (exige Termo de Comparecimento).
   * **Autenticação de cópia** (informar a quantidade de páginas/folhas).
3. Informe a quantidade de atos e, se o ato for com valor econômico, preencha o valor do negócio no campo correspondente.
4. No campo **Modelo de etiqueta**, selecione o layout homologado da serventia (ex: Etiqueta Padrão 1 coluna).
5. Clique no botão **Lançar e Imprimir** (ou pressione a tecla de atalho correspondente) para consumir o selo sequencial e emitir a etiqueta na impressora térmica configurada.

* **Observação: O sistema calcula automaticamente os emolumentos, taxas de fiscalização do Estado e fundos aplicáveis conforme a tabela de custas em vigor.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
