---
id: D-3.14
titulo: 'Criar Certidão'
modulo: certidoes
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  review_tags: ['ATT']
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
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Certidões > Novo Pedido de Certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Protocolos", "Orçamentos", "Orçamento rápido", "Certidões e serviços", "Certidões e serviços em aberto", "Consultas"; "Certidões" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (136 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Esta rotina inicia a lavratura de certidões oficiais de atos lavrados no cartório (escrituras, testamentos, procurações e atas notariais). Permite selecionar o formato da certidão (Inteiro Teor, Breve Relatório ou Reprográfica), consultar o ato original e gerar o recibo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Notas > Certidões > Novo Pedido de Certidão
2. Preencha a **Identificação do Solicitante** (Nome, CPF e telefone de contato).
3. Selecione o **Tipo de Certidão**: **Inteiro Teor**, **Breve Relatório** ou **Reprográfica**.
4. Localize o ato original informando o **Tipo de Livro**, **Número do Livro**, **Folha** e **Ato**.
5. O sistema importará os dados do ato e calculará os emolumentos correspondentes.
6. Clique em **Concluir Pedido** para salvar e disponibilizar o pagamento no caixa.

* **Importante: Caso o ato original possua imagens indexadas na Digitalização em Lote, o tipo Reprográfica puxará as folhas digitalizadas automaticamente.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
