---
id: D-2.3
titulo: 'Cadastrar Novo Usuário'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Nome Completo']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Configurações > Usuários e Permissões > Usuários'
        elemento_real: 'Configurações > Módulo > Usuários'
        camada: menu_path_resolution
        confianca: 0.88
        texto_alterado: false
        evidencia: 'menu-tree | [data-orion-audit-menu-mmwy23hxj742p0-8] | x=967, y=67, 162x21'
      - passo: 3
        alvo_documentado: 'Nome Completo'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  diagnostico_tela_att:
    passo: 3
    capturado_em: '2026-11-26T21:24:01.935Z'
    rota: '#/usuario/cadastrar'
    titulo_painel: 'Estoque - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de usuário']
    abas: []
    campos:
      - rotulo: 'Usuário'
        tipo: 'text'
      - rotulo: 'Nome'
        tipo: 'text'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
      - rotulo: 'Cargo'
        tipo: 'text'
      - rotulo: 'E-mail'
        tipo: 'text'
      - rotulo: 'Telefone principal'
        tipo: 'text'
      - rotulo: 'Telefone'
        tipo: 'text'
      - rotulo: 'Perfil de Usuário'
        tipo: 'select'
      - rotulo: 'Escrevente de Firmas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente de Notas'
        tipo: 'checkbox'
      - rotulo: 'Escrevente e-Recepção'
        tipo: 'checkbox'
      - rotulo: 'Tabelião'
        tipo: 'checkbox'
      - rotulo: 'Supervisor'
        tipo: 'checkbox'
      - rotulo: 'Substituto'
        tipo: 'checkbox'
      - rotulo: 'Auxiliar'
        tipo: 'checkbox'
    botoes: ['Fechar', 'Salvar e incluir novo', 'Voltar']
    alvos_do_passo: ['Nome Completo', 'CPF', 'E-mail', 'Login de Acesso']
    correspondencias_sugeridas:
      - alvo: 'Nome Completo'
        elemento_real: 'Nome'
        tipo: 'campo'
        similaridade: 0.48
      - alvo: 'CPF'
        elemento_real: 'CPF ou CIN'
        tipo: 'campo'
        similaridade: 0.97
      - alvo: 'E-mail'
        elemento_real: 'E-mail'
        tipo: 'campo'
        similaridade: 1
    alvos_sem_correspondencia: ['Login de Acesso']
    sugestao_reescrita: 'Sugestão de reescrita: no passo 3, substituir Nome Completo por Nome (campo); substituir CPF por CPF ou CIN (campo). E-mail existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Login de Acesso não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-03.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 3, o manual cita "Nome Completo", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 3: rota **#/usuario/cadastrar**, título **Estoque - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de usuário**.
> * **Campos:** **Usuário**, **Nome**, **CPF ou CIN**, **Cargo**, **E-mail**, **Telefone principal**, **Telefone**, **Perfil de Usuário**, **Escrevente de Firmas**, **Escrevente de Notas**, **Escrevente e-Recepção**, **Tabelião**, **Supervisor**, **Substituto**, **Auxiliar**.
> * **Botões:** **Fechar**, **Salvar e incluir novo** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Nome Completo":** **Nome** (campo, 48% — termo(s) em comum: nome).
> * **Correspondência sugerida para "CPF":** **CPF ou CIN** (campo, 97% — termo(s) em comum: cpf).
> * **Correspondência sugerida para "E-mail":** **E-mail** (campo, 100% — termo(s) em comum: mail).
> * **Sem correspondência funcional na tela:** **Login de Acesso**.
> * Sugestão de reescrita: no passo 3, substituir **Nome Completo** por **Nome** (campo); substituir **CPF** por **CPF ou CIN** (campo). **E-mail** existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. **Login de Acesso** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-03.png (tela exata no momento do bloqueio).

#### Descrição:
Permite registrar colaboradores da serventia no módulo de estoque, habilitando suas credenciais de login, e-mail institucional e dados básicos para que possam receber papel de segurança, selos e insumos em seu nome.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Configurações > Usuários e Permissões > Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Módulo** · (3) **Usuários**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Configurações > Usuários e Permissões > Usuários"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Módulo > Usuários"** (confiança: 88% — Item "Usuários" localizado na árvore de navegação em outra rota (1 de 2 segmentos ancestrais coincidem)). O texto do manual não foi alterado.
2. Clique no botão **Adicionar**.
   [aqui vai a print "passo-02.png"]
3. Preencha o **Nome Completo**, **CPF**, **E-mail** e defina o **Login de Acesso**.
   [aqui vai a print "passo-03.png"]
   > [!NOTE] **Demarcações na print:** (1) **CPF** · (2) **E-mail** · (3) **Login de Acesso**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Nome Completo"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: "Nome Completo"
4. Crie uma **Senha Inicial** provisória e marque a opção para exigir troca no primeiro acesso.
5. Selecione o **Grupo de Permissões** ao qual o usuário pertencerá.
6. Clique em **Salvar** para registrar o novo usuário no sistema.

* **Observação: O cadastro centralizado de usuários compartilha as credenciais entre os módulos de Caixa, Estoque e Notas.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
