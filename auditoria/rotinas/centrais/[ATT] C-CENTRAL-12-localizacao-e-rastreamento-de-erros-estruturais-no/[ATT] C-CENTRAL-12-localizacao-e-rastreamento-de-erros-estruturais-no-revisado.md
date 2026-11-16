---
id: C-CENTRAL-12
titulo: 'Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor de Texto'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Número da Linha / Registro']
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
> **Motivo Técnico:** No passo 1, o manual cita "Número da Linha / Registro", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Envio para Registro; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O software validador oficial da Receita Federal para a DOI é legado e não exibe Livro e Folha no log de inconsistências. É necessário abrir o arquivo estruturado para cruzar o número de ordem com o protocolo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Anote o **Número da Linha / Registro** apontado no relatório de erro do programa da Receita Federal (ex.: Linha `142`).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Número da Linha / Registro] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Localize o arquivo gerado da DOI (geralmente salvo na pasta `C:\Siplan\DOI\` ou Downloads com extensão `.txt` ou `.dec`).
3. Abra o arquivo utilizando o **Notepad++** ou **Bloco de Notas** do Windows.
4. Pressione `Ctrl + G` e digite o número da linha correspondente ao erro.
5. No início dessa linha ou no registro de controle imediatamente anterior, localize o campo de identificação que contém o **Número do Protocolo** ou a data de lavratura.
6. Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Protocolo**.
7. Acesse a aba **Imóveis** ou **Partes** e aplique a correção do dado faltante indicado pela Receita.
8. Exporte o lote novamente e revalide no programa oficial.

* **Dica de Especialista: Utilizar editores de texto com numeração de linhas facilita em 100% a localização de falhas em grandes arquivos de obrigações fiscais.**
