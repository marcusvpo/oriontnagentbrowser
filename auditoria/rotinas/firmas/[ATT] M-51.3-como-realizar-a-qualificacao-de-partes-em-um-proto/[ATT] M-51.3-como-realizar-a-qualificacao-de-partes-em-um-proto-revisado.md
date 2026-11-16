---
id: M-51.3
titulo: 'Como Realizar a Qualificação de Partes em um Protocolo'
modulo: firmas
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
      alvos_ausentes: ['Qualificação de Partes']
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
> **Motivo Técnico:** No passo 1, o manual cita "Qualificação de Partes", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Cadastros auxiliares > Perfil de partes (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Gerencia o cadastramento e qualificação civil completa de outorgantes, outorgados, intervenientes, anuentes e procuradores no ato notarial, incluindo consulta compulsória à Central Nacional de Indisponibilidade de Bens (CNIB).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No protocolo em elaboração, clique no card **Qualificação de Partes**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Qualificação de Partes] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Clique no botão **Adicionar Parte**.
3. Busque a pessoa física ou jurídica pelo CPF/CNPJ (se já possuir ficha de firma, os dados e documentos serão importados automaticamente).
4. Defina a **Participação** contratual da pessoa no ato (ex: Outorgante Vendedor, Outorgado Comprador, Doador, Donatário).
5. Se a parte for representada, marque a opção **Representado por Procurador** e selecione a ficha do procurador indicando o livro, folha e cartório da procuração.
6. Clique no botão **Consultar Indisponibilidade**: o Orion TN conectará à CNIB e emitirá a certidão circunstanciada negativa (ou apontamento de indisponibilidade com respectivo protocolo/hash).
7. Clique no botão **Salvar** para registrar os participantes.

* **Importante: A consulta à CNIB é obrigatória por provimento do CNJ em todos os atos notariais translativos de direitos reais ou com valor econômico.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
