---
id: M-34.0
titulo: 'Gerenciar Tipos de Anexo'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: read_only
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Cadastros auxiliares > Tipos de anexo", "Administração > Cadastros auxiliares > Tipos de anexo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Notas; Administração; Administração > Controle de Estoque > Cadastros; Configurações > Cadastros auxiliares (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite consultar, filtrar, alterar e inativar as categorias e classificadores de arquivos digitais (ex: 'Documento de Identificação', 'Comprovante de Estado Civil', 'Procuração'), padronizando a indexação de anexos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Tipos de anexo** (ou **Administração > Cadastros auxiliares > Tipos de anexo**).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Cadastros auxiliares > Tipos de anexo, Administração > Cadastros auxiliares > Tipos de anexo] não localizado no DOM nem na Árvore de Acessibilidade
2. Na tela de listagem, consulte as categorias existentes ou filtre pelo campo **Pesquisar por descrição**.
3. Clique em **Filtrar** para refinar os resultados na grade.
4. Na linha do registro desejado, selecione a ação correspondente:
   * **Visualizar**: confere a descrição completa e a sigla cadastrada.
   * **Editar**: altera a nomenclatura ou a sigla identificadora.
   * **Inativar**: desabilita o classificador para novas digitalizações sem apagar os documentos antigos vinculados.
5. Para registrar uma nova modalidade de anexo, clique no botão **Adicionar**.

* **Observação: Manter os tipos de anexos bem definidos agiliza a localização de certidões e identidades em auditorias e pedidos de certidão.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
