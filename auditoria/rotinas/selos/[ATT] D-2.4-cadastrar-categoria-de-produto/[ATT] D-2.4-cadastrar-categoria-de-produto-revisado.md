---
id: D-2.4
titulo: 'Cadastrar Categoria de Produto'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Configurações > Cadastros Auxiliares > Categoria de Produto", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Administração > Controle de Estoque > Cadastros; Administração > Controle de Estoque > Cadastros > Categoria; Administração > Controle de Estoque > Cadastros > Produto; Configurações (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A categorização de produtos estrutura o inventário da serventia em grupos homogêneos, tais como Papéis de Segurança, Selos de Fiscalização, Cartões de Autógrafo e Materiais de Escritório, facilitando a emissão de relatórios e auditorias de insumos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Cadastros Auxiliares > Categoria de Produto**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configurações > Cadastros Auxiliares > Categoria de Produto] não localizado no DOM nem na Árvore de Acessibilidade
2. Clique no botão **Adicionar**.
3. Digite o **Nome da Categoria** (ex: Papel de Segurança para Traslados ou Selos de Fiscalização).
4. Informe uma **Sigla** ou código de referência e uma breve descrição do grupo.
5. Clique em **Salvar** para disponibilizar a categoria nos cadastros de produtos.

* **Observação: As categorias cadastradas servem como filtros primários em todos os relatórios analíticos de inventário e consumo.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
