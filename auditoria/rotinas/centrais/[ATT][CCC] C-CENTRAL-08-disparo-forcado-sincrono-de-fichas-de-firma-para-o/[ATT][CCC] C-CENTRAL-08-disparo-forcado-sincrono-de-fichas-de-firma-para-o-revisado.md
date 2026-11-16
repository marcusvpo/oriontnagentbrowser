---
id: C-CENTRAL-08
titulo: 'Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  review_tags: ['ATT', 'CCC']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  etapas_externas:
    - passo: 7
      portal: 'e-Notariado'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Outras Comunicações > E-Notariado" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações > Outras Comunicações** existe na barra de navegação e contém: (nenhum subitem); "E-Notariado" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (136 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** O passo 7 ocorre fora do Orion TN (e-Notariado); não foi executado nem fotografado. As demais etapas foram auditadas até o ponto de bloqueio.

#### Descrição:
Por padrão de economia de rede, o Orion TN acumula os cartões de autógrafo abertos e faz o upload em lote uma vez ao dia. Para atendimentos imediatos de atos digitais, a transmissão pode ser antecipada manualmente.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 2 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva com imagem da assinatura e biometria.
   [aqui vai a print "passo-01.png"]
2. Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Administração > Comunicações > Outras Comunicações > E-Notariado
3. Na aba **Cartões de Autógrafo / Fichas de Firma**, informe o CPF ou número da ficha do cliente.
4. Selecione o registro na grade e clique no botão **Gerar / Enviar Imediatamente**.
5. O sistema executará o upload síncrono do payload com as assinaturas para os servidores do Colégio Notarial.
6. Confirme o recebimento do hash de transmissão.
7. Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível para consulta nacional.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**e-Notariado**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.

* **Agilidade: O envio imediato libera a assinatura digital de atos remotos em menos de 2 minutos pelo módulo de fluxo de assinaturas do e-Notariado.**
