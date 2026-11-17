---
id: V-CCA.1.2
titulo: 'Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura'
modulo: firmas
secao: V
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Cartão de Assinatura', 'Profissão']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Cartão de Assinatura", "Profissão", "Atenção:", "NÃO", "Lupa", "Ctrl+C", "Concluir", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-17T06:34:33.964Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: ['Cartão de Assinatura', 'Profissão']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['Cartão de Assinatura', 'Profissão']
    sugestao_reescrita: 'Sugestão de reescrita: Cartão de Assinatura, Profissão não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Cartão de Assinatura", "Profissão", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros > Cartão de assinatura; Configurações > Cadastros auxiliares > Pessoa física > Profissão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Sem correspondência funcional na tela:** **Cartão de Assinatura**, **Profissão**.
> * Sugestão de reescrita: **Cartão de Assinatura**, **Profissão** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O cartão de assinatura permite estruturar de forma minuciosa as formas de contato (pessoal, residencial, comercial), múltiplos endereços e os vínculos societários/representativos com pessoas jurídicas, além de exigir a seleção padronizada de profissões na tabela do sistema para garantir integridade nas certidões e relatórios.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela de cadastro do **Cartão de Assinatura**, localize o campo **Profissão**:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Cartão de Assinatura, Profissão, Atenção:, NÃO, Lupa, Ctrl+C, +, Concluir] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
   * **Atenção:** O campo profissão utiliza pesquisa obrigatória por tabela. Se você apenas digitar um texto livre e não selecionar um item da lista suspensa da lupa, o sistema **NÃO** gravará a profissão na ficha.
   * Digite o nome da profissão e clique na **Lupa** para buscar.
   * Se a profissão for localizada, clique sobre ela para selecioná-la.
   * Se a profissão **NÃO** existir no banco de dados: selecione o texto digitado, copie com **Ctrl+C**, clique no botão de adição (**+**) ao lado do campo, cole/digite o nome da nova profissão, clique em **Concluir** para registrar a profissão no sistema e, em seguida, selecione-a na lista de busca.
2. Na seção de **Contatos (E-mails e Telefones)**:
   * **E-mails**: Clique no botão de adição (**+**) para incluir novos endereços de e-mail (ex.: E-mail Pessoal, E-mail Comercial). Para remover um registro incorreto, selecione e clique no botão de subtração (**-**).
   * **Telefones**: Clique no botão de adição (**+**) para inserir telefones (Celular, Comercial, Residencial). Marque a caixa de seleção **Principal** no telefone prioritário para que ele tenha preferência nas telas de consulta e identificação do sistema.
3. Na seção de **Endereços**:
   * Clique no botão de adição (**+**) para inserir os dados do logradouro (tipo de endereço, CEP, rua, número, complemento, bairro, município e UF).
   * Defina qual é o endereço **Principal** marcando a opção correspondente.
4. Na seção de **Representação de Pessoa Jurídica (Empresas)**:
   * Se a pessoa cadastrada assinar ou representar empresas (como administradora, sócia ou procuradora), clique no botão de adição (**+**).
   * Preencha o **Nome / Razão Social** da empresa e o **CNPJ** (campo de preenchimento obrigatório para efetivar o vínculo).
   * Caso haja mais de uma empresa vinculada à pessoa, marque a opção de empresa **Padrão** se desejar que essa PJ seja prioritária.
   * A empresa vinculada será automaticamente impressa no **Termo de Comparecimento** gerado no reconhecimento de firmas.
5. Após preencher todas as seções e verificar as informações, clique no botão **Concluir** para gravar o cartão de assinatura.

* **Atenção: O campo profissão utiliza pesquisa obrigatória por tabela. Se você apenas digitar um texto livre e não selecionar um item da lista suspensa da lupa, o sistema **NÃO** gravará a profissão na ficha.**
* **Observação: O vínculo de Pessoa Jurídica na ficha de firma agiliza extraordinariamente o reconhecimento de firma por representação, evitando a necessidade de digitar dados da empresa a cada ato de firma presencial ou por autenticidade.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Cartão de Assinatura", "Profissão", "Atenção:", "NÃO", "Lupa", "Ctrl+C", "Concluir", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado  → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
