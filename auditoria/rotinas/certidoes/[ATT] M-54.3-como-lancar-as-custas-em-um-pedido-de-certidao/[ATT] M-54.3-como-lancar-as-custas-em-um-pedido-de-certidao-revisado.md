---
id: M-54.3
titulo: 'Como Lançar as Custas em um Pedido de Certidão'
modulo: certidoes
secao: M
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
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Custas']
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
> **Motivo Técnico:** No passo 1, o manual cita "Custas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Tabela de custas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Estrutura a cobrança do serviço de expedição de certidões, aplicando os itens da tabela de custas vigente (certidão padrão de até 1 página, folhas excedentes, buscas no arquivo e certidão em meio eletrônico).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No pedido de certidão, clique no card **Custas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Custas] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Clique no botão **Adicionar Item** e selecione o item correspondente da tabela (ex: 'Certidão de Notas - 1ª Folha').
3. Se a certidão de inteiro teor possuir mais de uma página, adicione o item **Folha Excedente** e informe a quantidade adicional de páginas.
4. Caso tenha sido necessária pesquisa no acervo por falta de indicação de livro/folha pelo usuário, inclua o item de **Busca no Arquivo**.
5. O sistema calculará automaticamente os emolumentos do cartório, taxas de fiscalização do Estado e o valor total devido.
6. Clique no botão **Salvar** na barra superior.
7. Na barra de ferramentas, clique em **Gerar recibo** para emitir o comprovante fiscal para pagamento no caixa.

* **Importante: Cada estado possui regramento próprio sobre a cobrança de busca; aplique a cobrança somente quando autorizada pelas normas da Corregedoria Geral.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
