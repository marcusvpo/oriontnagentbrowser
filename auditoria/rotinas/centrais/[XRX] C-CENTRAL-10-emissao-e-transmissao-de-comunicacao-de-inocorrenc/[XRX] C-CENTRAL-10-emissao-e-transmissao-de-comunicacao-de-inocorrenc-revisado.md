---
id: C-CENTRAL-10
titulo: 'Emissão e Transmissão de Comunicação de Inocorrência Periódica ao COAF'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['M-61.0']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Declaração de Inocorrência']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'dependencia_cruzada_rotina'
      tags_anteriores: ['XRX']
      status_atual: 'dependencia_cruzada_rotina'
      tags_atuais: ['XRX']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
        motivo: 'No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Comunicar" (Não há protocolos para comunicar)). Não ex'
      bloqueio_atual:
        passo: 2
        tipo: 'Dependência Cruzada de Rotina'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Comunicar" (Não há protocolos para comunicar)). Não existe botão Adicionar/Novo na tela. Outra rotina do sistema gera esses registros: M-61.0 — Adicionar Nova Natureza.

#### Descrição:
A ausência de atos suspeitos no período fiscal não dispensa a serventia de prestar informações. É obrigatório o envio da Declaração de Não Ocorrência de Propostas ou Operações Suspeitas.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-61.0 (Adicionar Nova Natureza) para criar o registro necessário.
2. Reexecutar a auditoria da rotina C-CENTRAL-10.

* **Rotinas pré-requisito (executar antes):** **M-61.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Administração > Comunicações > COAF**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **COAF**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência).
2. Selecione a competência correspondente (mês anterior) e clique na aba **Declaração de Inocorrência**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Declaração de Inocorrência] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. O sistema apresentará o termo padrão afirmando que não foram identificadas operações de comunicação obrigatória.
4. Confirme os dados do Tabelião ou Oficial designado.
5. Clique no botão **Transmitir Declaração de Inocorrência ao SISCOAF**.
6. Após o envio síncrono, clique no botão **Imprimir Recibo de Entrega** e arquive o comprovante digital.

* **Penalidade Administrativa: A falta de envio da inocorrência gera abertura automática de Processo Administrativo Disciplinar (PAD) perante a Corregedoria.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Comunicar" (Não há protocolos para comunicar)). Não ex → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
