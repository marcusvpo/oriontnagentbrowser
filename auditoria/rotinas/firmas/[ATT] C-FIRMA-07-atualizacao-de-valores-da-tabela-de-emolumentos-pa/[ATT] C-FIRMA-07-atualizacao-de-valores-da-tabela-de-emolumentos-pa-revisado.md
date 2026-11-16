---
id: C-FIRMA-07
titulo: 'Atualização de Valores da Tabela de Emolumentos para Materialização e Cópias'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
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
> **Motivo Técnico:** No passo 1, o manual cita "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Configurações (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Determinados serviços de balcão (como materialização de certidões eletrônicas e apostilamento) possuem parametrização de valor fixo direto nos parâmetros do módulo de firmas, além da tabela geral.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas] não localizado no DOM nem na Árvore de Acessibilidade
2. Localize a linha do serviço correspondente (ex.: **Materialização de Documento Eletrônico**).
3. Atualize o campo **Valor dos Emolumentos** com o valor fixado no provimento anual do estado.
4. Confira os campos de repasses legais (Fundo do Tribunal, Carteira de Previdência e ISS) para garantir o fechamento exato da soma.
5. Clique no botão **Gravar Parâmetros**.
6. Abra um novo pedido no balcão e valide que o sistema puxa o valor oficial automaticamente.

* **Vigência: Os reajustes anuais de custas vigoram a partir de 1º de janeiro de cada ano; aplique a atualização sempre na virada do exercício fiscal.**
