---
id: R-36.0
titulo: 'Imprimir Relatório do Livro de Protocolo'
modulo: livros
secao: R
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 3
        alvo_documentado: 'Para Rascunho / Conferência:'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: '"Rascunho"'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Para Impressão Definitiva:'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 3
        alvo_documentado: 'Folha Inicial'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Modelos de impressão; Configurações > Modelos de impressão > Configuração de impressão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O relatório do Livro de Protocolo reúne a sequência formal de todos os atos notariais prenotados na serventia dentro de um determinado intervalo de tempo, permitindo emissões preliminares em rascunho para auditoria e impressão definitiva para encadernação.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu principal do sistema em **Relatórios > Livro Protocolo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Relatórios** · (2) **Livro Protocolo**
2. Na tela de parâmetros, informe o **Período** de apuração no qual deseja visualizar os protocolos recepcionados.
   [aqui vai a print "passo-02.png"]
3. Defina a modalidade de impressão:
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Para Rascunho / Conferência:"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **""Rascunho""**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Para Impressão Definitiva:"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Folha Inicial"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial"
   * **Para Rascunho / Conferência:** Marque a caixa de seleção **"Rascunho"** para emitir listagem de trabalho sem numeração definitiva de livro físico.
   * **Para Impressão Definitiva:** Desmarque a opção de rascunho e preencha os campos **Livro** e **Folha Inicial** correspondentes à encadernação oficial.
4. Clique no botão **Imprimir**.
5. O sistema gerará o documento formatado em uma nova guia do navegador, pronto para conferência interna ou arquivamento permanente.

* **Para Rascunho / Conferência: Marque a caixa de seleção **"Rascunho"** para emitir listagem de trabalho sem numeração definitiva de livro físico.**
* **Para Impressão Definitiva: Desmarque a opção de rascunho e preencha os campos **Livro** e **Folha Inicial** correspondentes à encadernação oficial.**
* **Importante: Sempre emita primeiramente a versão em "Rascunho" para conferir se há protocolos pendentes antes de gerar a impressão definitiva do livro físico.**
* **Dica / Caso Real do 0800: Ajuste o espaçamento entrelinhas para 1.15 e margens para 2.0 cm na configuração de página do traslado para eliminar páginas residuais e otimizar o consumo de folhas oficiais.**
