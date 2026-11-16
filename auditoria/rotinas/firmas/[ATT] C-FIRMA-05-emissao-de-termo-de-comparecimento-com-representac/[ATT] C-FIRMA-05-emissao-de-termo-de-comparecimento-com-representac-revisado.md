---
id: C-FIRMA-05
titulo: 'Emissão de Termo de Comparecimento com Representação por Procuração (DUT / CRV)'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion TN", "Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Firmas > Consultas > Serviços praticados (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Quando o proprietário do veículo outorga poderes por instrumento público para venda de veículo, o comparecente físico perante o tabelionato é o procurador. O termo deve certificar essa representação legal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse **Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)] não localizado no DOM nem na Árvore de Acessibilidade
2. No campo **Proprietário / Vendedor**, informe o CPF do titular do veículo.
3. Marque a opção **Assinado por Representante / Procurador**.
4. Selecione ou busque o cadastro do procurador que está fisicamente no balcão.
5. Nos campos de identificação do instrumento, informe os dados da procuração (Livro, Folha, Cartório e Data da Lavratura).
6. Capture a assinatura/biometria do procurador no dispositivo.
7. Gere e imprima o termo de comparecimento, conferindo o texto de outorga antes da coleta manual da assinatura.

* **Exigência do Detran: O preenchimento do livro e folha da procuração é exigência expressa do Detran para homologação de transferências com representação.**
