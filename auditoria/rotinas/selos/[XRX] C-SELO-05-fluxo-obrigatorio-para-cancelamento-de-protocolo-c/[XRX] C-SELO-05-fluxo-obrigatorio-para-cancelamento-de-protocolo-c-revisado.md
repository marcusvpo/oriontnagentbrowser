---
id: C-SELO-05
titulo: 'Fluxo Obrigatório para Cancelamento de Protocolo com Selo Digital já Gerado'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Custas / Selos']
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
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
Por determinação normativa, uma vez atribuído o selo digital, o ato entra na cadeia de custódia pública. O Orion TN exige a inutilização formal do selo antes de permitir que o protocolo mude para Cancelado.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-SELO-05.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No menu **Notas**, localize e abra o **Protocolo** que será cancelado.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Notas** · (2) **Protocolo**
2. Navegue até a aba **Custas / Selos**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Custas / Selos] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Na grade de selos emitidos, selecione o selo e acione o botão **Estornar Selo** (justifique a desistência da parte).
4. Ainda na aba de custas, clique sobre a linha dos emolumentos e acione **Excluir Lançamento de Custas**.
5. Após o selo e as custas estarem estornados, retorne à aba principal de **Dados do Protocolo**.
6. Altere o campo **Status do Ato** para **Cancelado / Desistido** e clique em **Salvar**.
7. O sistema registrará a inutilização do selo e transmitirá o evento de cancelamento no fechamento do lote.

* **Norma Notarial: Nunca rasgue ou delete dados sem registrar o motivo do cancelamento; a Corregedoria audita rigorosamente selos sem atos lavrados.**
