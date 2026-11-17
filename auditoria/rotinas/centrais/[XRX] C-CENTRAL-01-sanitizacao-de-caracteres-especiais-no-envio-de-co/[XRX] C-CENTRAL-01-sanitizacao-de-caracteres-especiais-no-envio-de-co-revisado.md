---
id: C-CENTRAL-01
titulo: 'Sanitização de Caracteres Especiais no Envio de Comunicações ao COAF / SISCOAF'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
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
      alvos_ausentes: ['Informações Adicionais']
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
O parser XML da API do SISCOAF é extremamente rígido. Caracteres reservados de formatação tipográfica e quebras de linha (`\r\n`) quebram a validação dos nós do documento eletrônico.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-61.0 (Adicionar Nova Natureza) para criar o registro necessário.
2. Reexecutar a auditoria da rotina C-CENTRAL-01.

* **Rotinas pré-requisito (executar antes):** **M-61.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse o menu **Administração > Comunicações > COAF**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **COAF**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência).
2. Localize a comunicação rejeitada e abra a aba **Informações Adicionais**.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Informações Adicionais] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Aplique a higienização textual obrigatória:
4. Substitua qualquer apóstrofo (`'`) por acento agudo (`´`) — ex.: altere `Santa Bárbara D'Oeste` para `Santa Bárbara D´Oeste`.
5. Se houver o caractere comercial `&`, substitua pela palavra `e` ou pela entidade `&amp;`.
6. Remova todas as aspas simples e duplas (`"` e `'`).
7. **Remova todos os Enters (quebras de linha):** mantenha o texto em um parágrafo único e contínuo.
8. Clique no botão **Salvar e Transmitir** para receber o protocolo de entrega imediato.

* **Norma COAF: Sempre revise textos longos de fundamentação no Bloco de Notas antes de colar no campo de informações adicionais do COAF.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Comunicar" (Não há protocolos para comunicar)). Não ex → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
