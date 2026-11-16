---
id: C-SELO-07
titulo: 'Enquadramento e Parametrização de Selos Sem Valor Econômico (Sem Valor 1 e 2)'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion TN', 'Custas / Emolumentos']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 1 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
A tabela de custas do Tribunal de Justiça estabelece distinção rígida entre atos declaratórios sem conteúdo patrimonial (Sem Valor 1) e atos com isenção legal por gratuidade (Sem Valor 2). O preenchimento indevido de custas gera rejeição imediata.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-SELO-07.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra o protocolo no **Orion TN** e vá até a aba **Custas / Emolumentos**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Custas / Emolumentos] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. No campo **Enquadramento Tributário / Tabela do TJ**, selecione a rubrica exata:
3. Utilize **Sem Valor Econômico 1** para escrituras declaratórias, emancipações e atas sem patrimônio.
4. Utilize **Sem Valor Econômico 2** para atos com gratuidade decorrente de assistência judiciária ou determinação legal.
5. Zere todos os valores lançados em campos não compatíveis com a isenção.
6. Se houver recibo financeiro estornado associado: gere um novo recibo definitivo no **Orion Caixa** para que o ato e o selo se correlacionem.
7. Clique em **Salvar** e retransmita o selo digital.

* **Boas Práticas: Sempre consulte o Provimento de Custas vigente do estado para certificar se a declaração lavrada se enquadra na modalidade 1 ou 2.**
