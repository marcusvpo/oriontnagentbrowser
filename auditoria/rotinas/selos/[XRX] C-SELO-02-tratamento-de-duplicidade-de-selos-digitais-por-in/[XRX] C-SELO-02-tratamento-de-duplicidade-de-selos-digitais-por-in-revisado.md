---
id: C-SELO-02
titulo: 'Tratamento de Duplicidade de Selos Digitais por Instabilidade ou Timeout de Webservice'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion TN', 'Custas / Selos']
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
Quando ocorre timeout de socket após o tribunal processar a requisição mas antes de retornar o código de confirmação ao cartório, nova tentativa gera uma segunda numeração legítima no banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-SELO-02.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra o protocolo no **Orion TN** e acesse a aba **Custas / Selos**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Custas / Selos] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Identifique qual dos selos foi impresso no documento físico e qual ficou excedente (espúrio).
3. No selo excedente, clique em **Estornar Selo** e justifique: *"Duplicidade sistêmica decorrente de timeout de conexão"*.
4. Na grade de custas, remova o lançamento excedente para que o valor não seja cobrado da parte.
5. **Ação de Suporte Siplan N2 (se o lote ainda não fechou no TJ):**
6. O suporte técnico executará a chamada de cancelamento via API de retaguarda para registrar a anulação do selo órfão diretamente no webservice do tribunal antes do fechamento semanal.

* **Suporte Siplan: Ao abrir chamado no 0800 para exclusão de selo duplicado, informe sempre o número do selo a manter, o número a cancelar e o número do protocolo.**
