---
id: V-2.0
titulo: 'Como Realizar a Aquisição de Produtos (Entrada no Estoque)'
modulo: selos
secao: V
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion Stock']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Orion Stock", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Esta rotina detalha o procedimento para dar entrada (Aquisição) de produtos no módulo Orion Stock, o primeiro passo para o controle de insumos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o módulo **Orion Stock**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion Stock] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Navegue até o menu **Administração > Aquisição**.
3. Preencha os campos da aquisição. Apenas os campos com asterisco (**\***) são obrigatórios. A **Data de aquisição** pode ser alterada.
4. Selecione a **Categoria** do produto (ex.: "Selos" ou "Papel de Segurança").
5. Selecione o **Produto** específico (ex.: "Reconhecimento por autenticidade").
6. Preencha o campo **Série**:
   * **Para Selos:** O formato deve seguir o padrão do selo (sigla, prefixo do cartório, série).
   * **Para Papel de Segurança:** O campo é livre, permitindo um preenchimento de acordo com a preferência da serventia.
7. Informe a **Sequência inicial** e a **Sequência final** do lote. O sistema calculará a **Quantidade (Qtd)** total automaticamente.
8. Informe o **Valor Unitário** do produto, se aplicável.
9. Para registrar a entrada de mais de um tipo de produto na mesma operação, clique no botão **+** (inserir). Utilize o botão **-** para remover uma linha.
10. Clique em **Concluir** para registrar a entrada dos produtos no estoque.

* **Para Selos: O formato deve seguir o padrão do selo (sigla, prefixo do cartório, série).**
* **Para Papel de Segurança: O campo é livre, permitindo um preenchimento de acordo com a preferência da serventia.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
