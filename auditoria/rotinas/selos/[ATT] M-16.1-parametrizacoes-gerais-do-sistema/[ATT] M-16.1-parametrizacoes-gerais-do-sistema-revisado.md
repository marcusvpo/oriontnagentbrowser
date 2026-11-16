---
id: M-16.1
titulo: 'Parametrizações Gerais do Sistema'
modulo: selos
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Geral', 'Papel de Segurança (NFS)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Parâmetros gerais'
        elemento_real: 'Administração'
        camada: a11y_fuzzy_match
        confianca: 0.69
        texto_alterado: false
        evidencia: 'dom-measured | text:administração | x=733, y=1, 119x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Geral", "Papel de Segurança (NFS)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Configura as diretrizes macro do Orion TN, englobando obrigatoriedade de consumo de papel de segurança (NFS), método de envio do selo digital, regra de arredondamento de centavos em emolumentos e numeração de guias.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Parâmetros gerais**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Administração > Parâmetros > Parâmetros gerais"**, porém na tela atual do Orion TN o elemento se chama **"Administração"** (confiança: 69% — Similaridade semântica na árvore de acessibilidade (65%)). O texto do manual não foi alterado.
2. Na aba **Geral**, configure o comportamento de insumos: marque se o sistema deve exigir o consumo de **Papel de Segurança (NFS)** na emissão de atos.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Geral, Papel de Segurança (NFS)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Na seção **Selo Digital**, defina o modo de geração preferencial (**Online** para envio em tempo real ou **Offline** para envio agrupado).
4. No campo **Arredondamento de custas**, selecione o critério homologado para frações de centavos (Arredondamento ABNT, Truncamento ou Superior).
5. Na seção **Guias**, ative o controle de numeração automática e regras de controle fiscal se aplicável.
6. Clique no botão **Salvar** para aplicar as diretrizes globais do cartório.

* **Importante: Alterações nos parâmetros gerais exigem atenção da administração do cartório, pois impactam o cálculo financeiro e o fluxo de todos os escreventes.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
