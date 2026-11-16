---
id: C-SELO-06
titulo: 'Emissão de Selo de Retificação (Tipo XA) para Metadados de Selo já Transmitido'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion TN']
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
De acordo com as normas da Corregedoria (TJSP), selos digitais transmitidos são imutáveis na base estadual. Qualquer correção superveniente deve ser formalizada através de um evento de retificação vinculado ao selo primitivo.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-SELO-06.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, localize o protocolo ou cartão de autógrafo afetado.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Acesse o menu de ações do ato e selecione **Retificação de Selo Digital**.
3. O sistema exibirá a janela de evento retificador.
4. No campo **Justificativa Legal**, digite a motivação (ex.: *"Correção material de iniciais da parte outorgante"*).
5. Preencha os novos dados retificados nos campos correspondentes.
6. Clique em **Confirmar e Gerar Selo de Retificação**.
7. O Orion TN gerará automaticamente o selo **Tipo XA**, vinculando-o ao selo original e transmitindo a atualização ao tribunal.

* **Importante: O selo de retificação não gera novas custas de emolumentos ao cliente; trata-se de ato estritamente fiscal e regulatório.**
