---
id: D-3.75
titulo: 'Ativar Consumo Automático de Papel e Selos'
modulo: selos
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Ativar Consumo Automático de Papel de Segurança']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Parametrizações > Consumo de Insumos'
        elemento_real: 'Configurações'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: false
        evidencia: 'dom-measured | text:configurações | x=945, y=1, 118x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Ativar Consumo Automático de Papel de Segurança", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Controle de Estoque > Consumo manual (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A parametrização de consumo automático assegura que todo ato notarial ou certidão finalize seu ciclo com a perfeita baixa das folhas de segurança e dos selos utilizados, eliminando o esquecimento operacional e garantindo fidelidade contínua do estoque da serventia.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Parametrizações > Consumo de Insumos**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, dom_synonym_heuristic):** O manual cita **"Configurações > Parametrizações > Consumo de Insumos"**, porém na tela atual do Orion TN o elemento se chama **"Configurações"** (confiança: 96% — Sinônimo canônico Orion TN ('Configurações > Parametrizações > Consumo de Insumos' -> 'Configurações')). O texto do manual não foi alterado.
2. Marque a opção **Ativar Consumo Automático de Papel de Segurança**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Ativar Consumo Automático de Papel de Segurança] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Marque a opção **Ativar Consumo Automático de Selos Digitais / Físicos**.
4. Defina o gatilho da baixa: marque **Ao Converter em Livro Definitivo** (para escrituras) e **Ao Concluir Pedido** (para certidões e balcão).
5. Configure a regra de contingência: se o sistema deve **Bloquear Impressão caso o Estoque do Usuário esteja Zerado**.
6. Clique em **Salvar Alterações** para aplicar a regra em toda a rede do cartório.

* **Importante: Para que a rotina funcione sem travar os atendimentos, certifique-se de que os escreventes tenham sempre lotes de insumos previamente distribuídos.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
