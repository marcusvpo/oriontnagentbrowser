---
id: D-3.9
titulo: 'Consultar Reconhecimento de Firmas'
modulo: firmas
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
> **Motivo Técnico:** No passo 1, o manual cita "Firmas > Consultas > Consulta de Reconhecimento de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A tela de consulta de reconhecimentos de firmas reúne o histórico integral de atos de balcão da serventia. Permite auditar reconhecimentos por semelhança e autenticidade, verificar o selo digital aplicado, a imagem da folha e o operador responsável.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Consultas > Consulta de Reconhecimento de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Firmas > Consultas > Consulta de Reconhecimento de Firmas] não localizado no DOM nem na Árvore de Acessibilidade
2. Preencha os critérios de pesquisa: **Nome da Parte**, **CPF**, **Número do Pedido**, **Selo Digital** ou **Período**.
3. Se desejar refinar, filtre por **Tipo de Reconhecimento** (Autenticidade ou Semelhança) e **Escrevente**.
4. Clique em **Filtrar** para carregar os registros na tabela.
5. Dê um duplo clique na linha do ato para inspecionar os detalhes, selos utilizados, valores e comprovantes de baixa.

* **Observação: É possível gerar relatórios gerenciais e exportações em PDF ou planilha a partir dos resultados listados.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
