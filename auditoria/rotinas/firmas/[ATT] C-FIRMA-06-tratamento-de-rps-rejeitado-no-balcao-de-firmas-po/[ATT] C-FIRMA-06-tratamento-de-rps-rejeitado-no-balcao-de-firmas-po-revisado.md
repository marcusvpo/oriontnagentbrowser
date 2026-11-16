---
id: C-FIRMA-06
titulo: 'Tratamento de RPS Rejeitado no Balcão de Firmas por Falta de Tomador Identificado'
modulo: firmas
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
> **Motivo Técnico:** No passo 1, o manual cita "Configurações > Parâmetros de NFS-e > Regras de Balcão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Balcão de firmas; Configurações; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Na migração para o Emissor Nacional, certos municípios passaram a exigir parametrização tributária especial para "Tomador Não Identificado" (Consumidor Final) em serviços de balcão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parâmetros de NFS-e > Regras de Balcão**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configurações > Parâmetros de NFS-e > Regras de Balcão] não localizado no DOM nem na Árvore de Acessibilidade
2. Na seção **Tomador Padrão para Atos Não Identificados**, selecione a modalidade **Consumidor Final / Não Identificado**.
3. Caso o provedor exija cadastro específico: informe os dados da Serventia ou a inscrição padrão autorizada pelo fisco municipal.
4. No campo **Classificação Tributária / CST**, informe o código de operação notarial sem retenção na fonte.
5. Acesse o lote de RPS rejeitado em **Orion Caixa > Notas Fiscais > Listagem de RPS**.
6. Clique no botão **Reprocessar Lote de Firmas** para reenviar as notas com o novo layout parametrizado.

* **Legislação Fiscal: Sempre ofereça a inclusão do CPF do apresentante no recibo para agilizar a emissão individualizada quando solicitada.**
