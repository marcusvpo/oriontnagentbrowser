---
id: M-14.1
titulo: 'Balcão de Firmas: Como Buscar e Selecionar Partes para o Reconhecimento'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
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
Instrui como localizar e selecionar a ficha de firma ou o sinal público do signatário durante o atendimento de balcão, exibindo imagens de fotos, espelhos de assinatura e vínculos de representação para confronto visual.

#### Roteiro Técnico para Execução Manual:
1. Liberar a funcionalidade "Balcão de firmas" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.
2. Reexecutar a auditoria desta rotina e revisar as prints geradas.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com o pedido aberto na tela **Balcão de firmas**, clique no campo **Partes / Cartão de assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Alvo bloqueado para o perfil logado:** **"Balcão de firmas"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (item oculto pela aplicação para o perfil logado — li.functionality.ngx-orion-hide).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Insuficiência de Privilégio na Conta de Homologação: "Balcão de firmas" está bloqueado para o perfil logado (item oculto pela aplicação para o perfil logado)
2. Digite o nome da pessoa, número do CPF ou número da ficha e aguarde a exibição da listagem de autocompletar.
3. Em caso de homônimos, confira na lista o número do CPF, filiação e data de nascimento antes de clicar no registro.
4. Para sinais públicos de outras serventias, marque a opção **Sinal Público** para filtrar a tabela de tabeliães e prepostos credenciados.
5. Ao selecionar a parte, analise na janela lateral a imagem da assinatura cadastrada, a biometria e a foto do titular para confronto minucioso com a assinatura constante no documento físico apresentado.
6. Clique em **Adicionar Parte** para fixar a pessoa no pedido.

* **Importante: Se a ficha estiver com status **Bloqueado** ou houver **Impedimento** ativo, o sistema emitirá aviso vermelho em pop-up impedindo a continuidade do serviço.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
