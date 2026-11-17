---
id: V-CCA.2.2
titulo: 'Consulta Rápida de Anexos, Histórico de Andamentos e Bloqueio de Ficha'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['M-9.0', 'D-3.3', 'V-CCA.3.3']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Indicadores Visuais Rápidos']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
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
        motivo: 'No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentad'
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
> **Motivo Técnico:** No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). Há botão "Adicionar" na tela, mas o auto-seed estava desligado nesta execução. Outra rotina do sistema gera esses registros: M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais); D-3.3 — Cadastrar Cartão de Assinatura; V-CCA.3.3 — Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas.

#### Descrição:
Cada registro listado na tabela de cartões de assinatura possui atalhos de consulta instantânea e recursos de auditoria. Esta rotina aborda a leitura dos indicadores visuais (presença de imagem e foto), o uso da galeria unificada de anexos em tela cheia, o rastreamento do log de andamentos e a ativação de bloqueios cautelares com alertas operacionais para o balcão de firmas.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina M-9.0 (Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)) para criar o registro necessário.
2. Executar antes a rotina D-3.3 (Cadastrar Cartão de Assinatura) para criar o registro necessário.
3. Executar antes a rotina V-CCA.3.3 (Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas) para criar o registro necessário.
4. Reexecutar a auditoria da rotina V-CCA.2.2.

* **Rotinas pré-requisito (executar antes):** **M-9.0**, **D-3.3**, **V-CCA.3.3**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e realize o filtro do registro desejado.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
2. Observe os **Indicadores Visuais Rápidos** na linha do registro:
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Indicadores Visuais Rápidos, Ícone de Imagem do Cartão, Verde, Indicador de Foto, Atalho de Biometria] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
   * **Ícone de Imagem do Cartão**: Se estiver na cor **Verde**, sinaliza que o cartão físico de assinatura está digitalizado e anexado à ficha; se estiver cinza/apagado, indica ausência de imagem anexada.
   * **Indicador de Foto**: Mostra visualmente se a foto facial da pessoa foi capturada via webcam.
   * **Atalho de Biometria**: Permite acionar diretamente a coleta biométrica no leitor sem necessidade de abrir todo o formulário de edição.
3. Para **Visualizar Anexos e Imagens da Ficha**:
   * Clique no ícone/atalho de **Anexos** na linha da ficha.
   * O sistema abrirá a galeria unificada com todas as imagens vinculadas ao cartão (ficha de assinatura, documentos de identidade, comprovantes).
   * Utilize o recurso de **Visualização em Tela Cheia** para inspecionar traços de assinaturas ou detalhes de documentos com máxima nitidez.
   * Para fechar a visualização, pressione a tecla **Esc** no teclado ou clique no botão **Fechar**.
4. Para auditar o **Histórico de Andamentos**:
   * Clique no ícone de **Andamentos** (ícone de histórico/relógio).
   * O sistema abrirá a janela de auditoria completa da ficha, exibindo em ordem cronológica: a data e hora exatas de cada ação, o nome do usuário/operador responsável e a descrição detalhada da alteração executada.
5. Para **Bloquear uma Ficha de Assinatura**:
   * Na linha do cartão, clique na opção **Bloquear Ficha**.
   * O sistema abrirá uma janela para inserção da justificativa; digite o motivo detalhado do bloqueio (por exemplo: "Parte não alfabetizada - exigir assinatura a rogo e testemunhas", "Assinatura divergente - conferir documento original", ou "Determinação judicial").
   * Confirme o bloqueio.
   * Ao efetuar o bloqueio, sempre que qualquer usuário pesquisar ou tentar reconhecer firma para essa pessoa no balcão de firmas, o sistema emitirá um alerta ostensivo na tela impedindo ou condicionando o atendimento.
6. Para consultar os dados da ficha sem risco de alteração acidental, clique no botão **Visualizar** (modo somente leitura).

* **Observação: O histórico de andamentos é gravado de forma automática e imutável pelo sistema, servindo como base de conformidade e auditoria interna do cartório.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [XRX] dependencia_cruzada_rotina → [XRX] dependencia_cruzada_rotina
* **Bloqueio anterior:** passo 2 — Dependência Cruzada de Rotina: No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Período de pesquisa inválido), "Imprimir" (Realize uma busca com resultados para imprimir)). O auto-seed foi tentad → **mantido** (agora: passo 2, Dependência Cruzada de Rotina)
