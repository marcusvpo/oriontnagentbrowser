---
id: M-40.0
titulo: 'Gerenciar Alíquotas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: dependencia_dados_banco
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['Editar']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Alíquota'
        elemento_real: 'Configurações > Cadastros auxiliares > Alíquotas'
        camada: menu_path_resolution
        confianca: 0.82
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwiftcro6829eh-97] | x=605, y=134, 239x26'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Dados no Banco de Homologação (Grade Vazia)**.
>
> **Motivo Técnico:** No passo 4, a validação não pôde prosseguir: grade com 5 coluna(s) visível(is) (UF, Cidade, ITBI %, ISS %, Padrão) e 0 linhas de dados; mensagem da tela: "Não existem aliquota itbi cadastrados."; controles inativos: "Filtrar" (Preencha os campos obrigatório para efetuar a busca). Não existe botão Adicionar/Novo na tela. Nenhuma rotina do KB cria esses registros.

#### Descrição:
Gerencia a tabela de alíquotas tributárias municipais e estaduais (ITBI, ITCMD e ISSQN) por comarca/cidade, alimentando os cálculos automáticos de tributos devidos no card de custas dos atos notariais.

#### Roteiro Técnico para Execução Manual:
1. Equipe de Produtos: popular o banco de homologação com ao menos um registro nesta tela.
2. Reexecutar a auditoria da rotina M-40.0.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Alíquota** (ou **Administração > Parâmetros > Alíquotas**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares** · (3) **Alíquotas**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Notas > Cadastros auxiliares > Alíquota"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Cadastros auxiliares > Alíquotas"** (confiança: 82% — Item "Alíquotas" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem aliquota itbi cadastrados."; grade vazia (UF, Cidade, ITBI %, ISS %, Padrão).
2. Na listagem de alíquotas, localize a cidade pelo campo de pesquisa de município ou estado.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **UF** · (2) **Cidade**
   > [!NOTE] **Alvos implícitos demarcados (passo sem negrito):** **UF**, **Cidade**. O texto do manual não foi alterado.
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem aliquota itbi cadastrados."; grade vazia (UF, Cidade, ITBI %, ISS %, Padrão).
3. Clique em **Filtrar** para visualizar os percentuais cadastrados para a localidade.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem aliquota itbi cadastrados."; grade vazia (UF, Cidade, ITBI %, ISS %, Padrão).
4. Na linha da cidade desejada, clique em **Editar** para ajustar os campos:
   [aqui vai a print "passo-04.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** mensagem da tela: "Não existem aliquota itbi cadastrados."; grade vazia (UF, Cidade, ITBI %, ISS %, Padrão).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Editar, Alíquota Geral de ITBI (%), Alíquota Financiada (%)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * **Alíquota Geral de ITBI (%)**: percentual padrão sobre o valor da transação ou venal de referência.
   * **Alíquota Financiada (%)**: percentual reduzido incidente sobre a fração do SFH/alienação fiduciária, se aplicável.
5. Clique no botão **Salvar** para registrar os novos percentuais.
6. Para limpar os filtros da pesquisa, utilize o botão **Limpar**.

* **Importante: Manter as alíquotas municipais atualizadas evita que o escrevente emita simulação de custas com imposto divergente do exigido pela prefeitura.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
