---
id: D-3.15
titulo: 'Vincular Ato a Certidão para Reprografia'
modulo: certidoes
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Certidões > Consulta de Certidões", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Notas; Notas > Certidões e serviços; Notas > Certidões e serviços em aberto; Notas > Consultas > Certidões e serviços; Administração > Comissões > Consulta (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A emissão de certidões reprográficas exige a anexação das cópias fotostáticas fiéis das páginas do livro onde o ato foi lavrado. A rotina localiza o repositório de folhas previamente digitalizadas, ordena as páginas do ato e compõe o documento com o cabeçalho e encerramento oficial.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra o pedido de certidão desejado em **Notas > Certidões > Consulta de Certidões**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Certidões > Consulta de Certidões] não localizado no DOM nem na Árvore de Acessibilidade
2. Clique na aba **Reprografia / Imagens do Livro**.
3. O sistema listará as imagens disponíveis para o Livro e intervalo de folhas do ato.
4. Caso falte alguma página, clique em **Adicionar Imagem** para digitalizar diretamente pelo scanner.
5. Ordene a sequência das folhas clicando nas setas de posicionamento.
6. Clique em **Confirmar Vinculação** para enviar o conjunto ao editor de certidões.

* **Observação: As imagens devem conter os selos físicos e assinaturas originais legíveis para plena eficácia jurídica da certidão.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
