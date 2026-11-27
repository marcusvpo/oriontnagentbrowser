---
id: D-1.6
titulo: 'Cadastrar Outros Serviços'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Nome do Serviço', 'Sigla']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 1
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Cadastros Auxiliares > Outros Serviços'
        elemento_real: 'Configurações > Geral > Cadastros auxiliares > Outros serviços'
        camada: menu_path_resolution
        confianca: 0.95
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0x91q2fq0uk-33] | x=752, y=130, 144x20'
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T20:49:23.726Z'
    rota: '#/outrosServicos/cadastrar'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Cadastro de outros serviços']
    abas: []
    campos:
      - rotulo: 'Descrição'
        tipo: 'text'
      - rotulo: 'Valor'
        tipo: 'text'
      - rotulo: 'Imprimir serviço no protocolo oficial'
        tipo: 'checkbox'
      - rotulo: 'Sem valor fixo'
        tipo: 'checkbox'
    botoes: ['Concluir', 'Voltar']
    alvos_do_passo: ['Nome do Serviço', 'Sigla']
    correspondencias_sugeridas:
      - alvo: 'Nome do Serviço'
        elemento_real: 'Imprimir serviço no protocolo oficial'
        tipo: 'campo'
        similaridade: 0.48
    alvos_sem_correspondencia: ['Sigla']
    pistas_mapa_rotas:
      - alvo: 'Sigla'
        menu: 'Configurações > Cadastros auxiliares > Cargo'
        rota: '#/cargo'
        encontrado_em: 'field'
        rotulo_real: 'Sigla'
      - alvo: 'Sigla'
        menu: 'Configurações > Cadastros auxiliares > Formas de pagamento'
        rota: '#/tipoPagamento'
        encontrado_em: 'field'
        rotulo_real: 'Sigla'
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Nome do Serviço por Imprimir serviço no protocolo oficial (campo). Sigla não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome do Serviço", "Sigla", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento (1 caixa(s) de seleção sem relação com o elemento não foram acionadas). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/outrosServicos/cadastrar**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de outros serviços**.
> * **Campos:** **Descrição**, **Valor**, **Imprimir serviço no protocolo oficial**, **Sem valor fixo**.
> * **Botões:** **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Nome do Serviço":** **Imprimir serviço no protocolo oficial** (campo, 48% — termo(s) em comum: servico).
> * **Sem correspondência funcional na tela:** **Sigla**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Sigla" aparece em **Configurações > Cadastros auxiliares > Cargo** (#/cargo, campo **Sigla**); "Sigla" aparece em **Configurações > Cadastros auxiliares > Formas de pagamento** (#/tipoPagamento, campo **Sigla**).
> * Sugestão de reescrita: no passo 3, substituir **Nome do Serviço** por **Imprimir serviço no protocolo oficial** (campo). **Sigla** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
A rotina de Outros Serviços permite incluir no caixa cobranças de serviços administrativos, consultas extras, fotocópias ou serviços de conveniência que não estão atrelados diretamente a atos notariais de notas ou certidões tradicionais.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Cadastros Auxiliares > Outros Serviços**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Geral** · (3) **Cadastros auxiliares** · (4) **Outros serviços**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Cadastros Auxiliares > Outros Serviços"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Geral > Cadastros auxiliares > Outros serviços"** (confiança: 95% — Item "Outros serviços" localizado na árvore de navegação em outra rota (2 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar** para cadastrar um novo serviço.
   [aqui vai a print "passo-02.png"]
3. Preencha o **Nome do Serviço** e defina a **Sigla** operacional.
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Nome do Serviço, Sigla] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Informe o **Valor Padrão** cobrado pelo serviço na serventia.
5. Selecione a classificação contábil e tributária conforme as regras do cartório.
6. Clique em **Conclusão** para salvar o registro.

* **Importante: Serviços cadastrados nesta tela ficam imediatamente habilitados no menu de recebimentos avulsos de balcão.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
