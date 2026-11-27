---
id: R-31.0
titulo: 'Importar e Consultar Arquivos de Receitas de Outras Especialidades'
modulo: caixa
secao: R
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: read_only
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['XML']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Novo arquivo'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Importação de Arquivos > Novo Arquivo'
        elemento_real: 'Administração > Importações de arquivos'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0butv611vjs-73] | x=664, y=150, 192x21'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Dados no Banco de Homologação (Grade Vazia)**.
>
> **Motivo Técnico:** No passo 2, a validação não pôde prosseguir: grade com 4 coluna(s) visível(is) (Descrição, Data, Especialidade, Status) e 0 linhas de dados; controles inativos: "Filtrar" (Preencha ao menos um dos campos obrigatórios para efetuar a busca). Há botão "Novo arquivo" na tela, mas o auto-seed estava desligado nesta execução. Nenhuma rotina do KB cria esses registros.

#### Descrição:
Em cartórios cumulativos, esta rotina permite importar arquivos padronizados em formato XML contendo receitas e atos de outras especialidades (como Registro Civil e Protesto), integrando-os à apuração financeira global.

#### Roteiro Técnico para Execução Manual:
1. Equipe de Produtos: popular o banco de homologação com ao menos um registro nesta tela.
2. Reexecutar a auditoria da rotina R-31.0.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. **Para importar um novo arquivo de receita:** Acesse **Administração > Importação de Arquivos > Novo Arquivo**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Importações de arquivos** · (3) **Novo Arquivo**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Importação de Arquivos > Novo Arquivo"**, porém na versão atual do Orion TN a tela fica em **"Administração > Importações de arquivos"** (confiança: 88% — Equivalência de folha: "Importação de Arquivos" ≡ "Importações de arquivos" (mesma chave de folha sob "Administração"); "Administração > Importações de arquivos" é folha sem filhos e "Novo Arquivo" é seção/aba da tela). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Descrição, Data, Especialidade, Status).
2. Clique no botão de seleção de arquivo, escolha o arquivo no formato **XML** em seu computador e confirme o envio.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Descrição, Data, Especialidade, Status).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [XML] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. O sistema fará a leitura da estrutura XML e processará as receitas importadas na base do cartório.
4. **Para consultar arquivos já importados:** Acesse **Administração > Importação de Arquivos**.
5. Para uma pesquisa rápida, informe a **Data do Arquivo** e clique em **Filtrar**; para busca detalhada, utilize os campos de **Período de Processamento** e selecione a **Especialidade** desejada (ex: RC ou Protesto).

* **Observação: Essa rotina é exclusiva para a conciliação financeira de receitas entre especialidades em cartórios cumulativos.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
