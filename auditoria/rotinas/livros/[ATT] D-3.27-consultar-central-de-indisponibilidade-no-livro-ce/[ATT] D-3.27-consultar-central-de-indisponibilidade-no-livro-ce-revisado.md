---
id: D-3.27
titulo: 'Consultar Central de Indisponibilidade no Livro (CENIB)'
modulo: livros
secao: D
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
      alvos_ausentes: ['Gerar Livro Definitivo']
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
> **Motivo Técnico:** No passo 1, o manual cita "Gerar Livro Definitivo", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Índice por livro; Relatórios > Livro Protocolo (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Em conformidade com as normas da Corregedoria Nacional de Justiça, a verificação de indisponibilidade deve ser revalidada no momento da lavratura final do ato. Esta rotina executa a consulta de última hora no fechamento do livro, assegurando que nenhum gravame tenha ingressado antes da assinatura.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na etapa de finalização da minuta, clique no comando **Gerar Livro Definitivo**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Gerar Livro Definitivo] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. O sistema abrirá a janela de validação prévia com o botão **Revalidar Consulta CENIB**.
3. Clique em **Executar Nova Consulta em Lote** para pesquisar novamente todos os outorgantes.
4. O sistema atualizará os códigos HASH de cada parte com o timestamp exato do momento do fechamento.
5. Caso persista o resultado 'Nada Consta', o botão de geração de livro será liberado.
6. Clique em **Confirmar e Gerar Livro** para lavrar o ato com as certidões revalidadas.

* **Importante: Se surgir uma indisponibilidade superveniente durante o expediente, a rotina interrompe a lavratura para proteção das partes e do tabelião.**
* **Dica / Caso Real do 0800: Sempre utilize **Ctrl + Shift + V** para colar textos copiados de fontes externas, garantindo que estilos de fonte estranhos (como fonte tamanho 2) não corrompam a estrutura do documento.**
