---
id: D-1.2
titulo: 'Configurar Dados de Cartório'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Razão Social', 'Comarca', 'Endereço Completo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Alterar'
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Dados de Cartório'
        elemento_real: 'Configurações > Geral > Dados do cartório'
        camada: menu_path_resolution
        confianca: 0.85
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy0jqpmbsepeg-27] | x=897, y=46, 146x21'
      - passo: 2
        alvo_documentado: 'Razão Social'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Comarca'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Endereço Completo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-26T20:38:18.252Z'
    rota: '#/cartorio/cadastrar'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Alteração das informações do cartório', 'Endereço', 'Contato']
    abas: []
    campos:
      - rotulo: 'Nome da serventia'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'CNPJ'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'CNS'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Nome do responsável'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Código IBGE'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Endereço'
      - rotulo: 'Telefone principal'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Site'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Email'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Email notificações'
        tipo: 'text'
        secao: 'Endereço'
      - rotulo: 'Observações'
        tipo: 'textarea'
        secao: 'Endereço'
    botoes: ['< Selecione >ACALAPAMBACEDFESGOMAMTMSMGPAPBPRPEPIRJRNRSRORRSCSPSETOEXBR', 'Concluir', 'Voltar']
    alvos_do_passo: ['Razão Social', 'CNPJ', 'Comarca', 'Endereço Completo', 'Telefone']
    correspondencias_sugeridas:
      - alvo: 'CNPJ'
        elemento_real: 'CNPJ'
        tipo: 'campo'
        secao: 'Endereço'
        similaridade: 1
      - alvo: 'Endereço Completo'
        elemento_real: 'Endereço'
        tipo: 'seção'
        similaridade: 0.52
      - alvo: 'Telefone'
        elemento_real: 'Telefone principal'
        tipo: 'campo'
        secao: 'Endereço'
        similaridade: 1
      - alvo: 'Telefone'
        elemento_real: 'Telefone'
        tipo: 'campo'
        secao: 'Endereço'
        similaridade: 1
    alvos_sem_correspondencia: ['Razão Social', 'Comarca']
    pistas_mapa_rotas:
      - alvo: 'Razão Social'
        menu: 'Administração > Cadastro de Pessoas Jurídicas'
        rota: '#/pessoaJuridica'
        encontrado_em: 'field'
        rotulo_real: 'Razão social'
    contexto_catalogo_nivel1:
      id_tela: '071'
      menu: 'Configurações > Dados do cartório'
      rota: '#/cartorio/cadastrar'
      nivel: 2
      estado_nivel2: 'no_substates'
      abas: []
      secoes: ['Cadastro das informações do cartório', 'Endereço', 'Contato']
      tabelas: []
      alvos_ausentes_nivel2: ['Razão Social', 'Comarca']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Endereço Completo por Endereço (seção); substituir Telefone por Telefone principal (campo da seção Endereço). CNPJ existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Razão Social, Comarca não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Razão Social", "Comarca", "Endereço Completo", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Alterar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/cartorio/cadastrar**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Alteração das informações do cartório**, **Endereço**, **Contato**.
> * **Campos:** **Nome da serventia** (Endereço), **CNPJ** (Endereço), **CNS** (Endereço), **Nome do responsável** (Endereço), **CPF ou CIN** (Endereço), **CEP** (Endereço), **Logradouro** (Endereço), **Número** (Endereço), **Complemento** (Endereço), **Bairro** (Endereço), **Cidade** (Endereço), **Código IBGE** (Endereço), **UF** (Endereço), **Telefone principal** (Endereço), **Telefone** (Endereço), **Site** (Endereço), **Email** (Endereço), **Email notificações** (Endereço), **Observações** (Endereço).
> * **Botões:** **< Selecione >ACALAPAMBACEDFESGOMAMTMSMGPAPBPRPEPIRJRNRSRORRSCSPSETOEXBR**, **Concluir**, **Voltar**.
> * **Correspondência sugerida para "CNPJ":** **CNPJ** (campo, 100% — termo(s) em comum: cnpj; seção "Endereço" citada no passo).
> * **Correspondência sugerida para "Endereço Completo":** **Endereço** (seção, 52% — termo(s) em comum: endereco).
> * **Correspondência sugerida para "Telefone":** **Telefone principal** (campo, 100% — termo(s) em comum: telefone; seção "Endereço" citada no passo); **Telefone** (campo, 100% — termo(s) em comum: telefone; seção "Endereço" citada no passo).
> * **Sem correspondência funcional na tela:** **Razão Social**, **Comarca**.
> * **Pistas em outras rotas (`orion-route-graph.json`):** "Razão Social" aparece em **Administração > Cadastro de Pessoas Jurídicas** (#/pessoaJuridica, campo **Razão social**).
> * **Contexto do Catálogo Nível 2 (`071`, consultivo):** tela **Configurações > Dados do cartório**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **Razão Social**, **Comarca** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: no passo 2, substituir **Endereço Completo** por **Endereço** (seção); substituir **Telefone** por **Telefone principal** (campo da seção **Endereço**). **CNPJ** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Razão Social**, **Comarca** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Esta rotina permite cadastrar e manter atualizadas as informações institucionais da serventia, como razão social, CNPJ, comarca, endereço e responsável. Esses dados alimentam automaticamente cabeçalhos de relatórios, recibos e declarações emitidos pelo caixa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No menu principal do Orion Caixa, acesse **Configurações > Dados de Cartório**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Geral** · (3) **Dados do cartório**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Dados de Cartório"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Geral > Dados do cartório"** (confiança: 85% — Item "Dados do cartório" localizado na árvore de navegação em outra rota (1 de 1 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Preencha os campos com as informações cadastrais do cartório (**Razão Social**, **CNPJ**, **Comarca**, **Endereço Completo** e **Telefone**).
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Demarcações na print:** (1) **CNPJ** · (2) **Telefone**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Razão Social"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Comarca"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Endereço Completo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Razão Social", "Comarca", "Endereço Completo"
3. Preencha os dados do titular e responsável financeiro nos campos pertinentes.
4. Clique em **Salvar** para gravar as informações institucionais no sistema.

* **Importante: A consistência desses dados é mandatória para a validade jurídica e fiscal dos comprovantes de pagamento impressos pelo cartório.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
