---
id: M-16.13
titulo: 'Parametrizar Pedido de Certidão'
modulo: certidoes
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Prazo de entrega padrão (dias)']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Pedido de certidão'
        elemento_real: 'Administração'
        camada: a11y_fuzzy_match
        confianca: 0.68
        texto_alterado: false
        evidencia: 'dom-measured | text:administração | x=733, y=1, 119x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Prazo de entrega padrão (dias)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Configura as políticas de atendimento do módulo de Pedidos de Certidão, estabelecendo o prazo padrão de expedição conforme a lei de registros públicos e vinculando o consumo obrigatório de papel de segurança.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Pedido de certidão**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Administração > Parâmetros > Pedido de certidão"**, porém na tela atual do Orion TN o elemento se chama **"Administração"** (confiança: 68% — Similaridade semântica na árvore de acessibilidade (64%)). O texto do manual não foi alterado.
2. No campo **Prazo de entrega padrão (dias)**, informe a quantidade de dias úteis fixada para expedição de certidões comuns (ex: 5 dias úteis, ou prazo menor conforme a rotina do cartório).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Prazo de entrega padrão (dias)] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Na seção **Estoque e Insumos**, marque a opção **Controlar estoque de papel de segurança** para impedir que a certidão seja concluída sem o apontamento do número da folha utilizada.
4. Configure se o sistema deve exigir a assinatura ou identificação do recebedor no momento da entrega do documento no balcão.
5. Clique no botão **Salvar** para registrar os parâmetros do setor de certidões.

* **Observação: O prazo cadastrado é utilizado para alimentar a data de previsão de entrega no comprovante entregue ao usuário no balcão.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
