---
id: D-3.3
titulo: 'Cadastrar Cartão de Assinatura'
modulo: firmas
secao: D
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Preencher com IA']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 1
      seletores_sem_afinidade_descartados: 7
      estado_restaurado: true
      gatilhos_testados:
        - tipo: button
          rotulo: 'Adicionar'
          deduzido_do_dom: false
          resultado: sem_efeito
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
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é i'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: '2026-11-17'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b'
      bloqueio_atual:
        passo: 2
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: '2026-11-17T17:44:48.816Z'
    rota: '#/ficha/cadastrar'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: ['Cadastro de cartão de assinatura', 'Papel de segurança', 'Selo digital', 'Dados pessoais', 'Contato', 'Endereço', 'Pessoa Jurídica - Representante', 'Arquivos anexos']
    abas: []
    campos:
      - rotulo: 'Filtro'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Nome'
        tipo: 'search'
        secao: 'Papel de segurança'
      - rotulo: 'Nome social'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Sexo'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Nascimento'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CPF ou CIN'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'RG'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Orgão emissor'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'UF'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Data emissão'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CNH'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Categoria'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Data 1ª habilitação'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Data Expedição'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Data expiração'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Outro documento'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Número'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Nacionalidade'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Naturalidade'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Estado civil'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Profissão'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Pai'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Mãe'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Politicamente exposta (Prov. 88)'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Pessoa acusada de terrorismo'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Funcionário público'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Digitador'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Escrevente'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Digitado em'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Rótulos'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Observações'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de e-mail'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'E-mail'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Principal'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Notificar'
        tipo: 'checkbox'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de telefone'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Telefone'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Tipo de endereço'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'CEP'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Logradouro'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Complemento'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Bairro'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'País'
        tipo: 'select'
        secao: 'Papel de segurança'
      - rotulo: 'Cidade'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'Razão social'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'CNPJ'
        tipo: 'text'
        secao: 'Papel de segurança'
      - rotulo: 'selecionarAnexoFichaRegistra'
        tipo: 'file'
        secao: 'Papel de segurança'
    botoes: ['Preencher cartão usando I.A.', 'Consumir', 'Gerar', 'Consulta Central de notificações de suspeitos (CNS).', 'Excluir', 'Adicionar', 'Selecionar', 'Capturar', 'Digitalizar ', 'Concluir', 'Voltar']
    alvos_do_passo: ['Preencher com IA']
    correspondencias_sugeridas:
      - alvo: 'Preencher com IA'
        elemento_real: 'Preencher cartão usando I.A.'
        tipo: 'botão'
        similaridade: 0.56
    alvos_sem_correspondencia: []
    sugestao_reescrita: 'Sugestão de reescrita: no passo 2, substituir Preencher com IA por Preencher cartão usando I.A. (botão).'
    print_contexto: 'passo-02.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 1 de 1 gatilho(s) revelador(es) seguro(s) da tela (botão "Adicionar"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/ficha/cadastrar**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Cadastro de cartão de assinatura**, **Papel de segurança**, **Selo digital**, **Dados pessoais**, **Contato**, **Endereço**, **Pessoa Jurídica - Representante**, **Arquivos anexos**.
> * **Campos:** **Filtro** (Papel de segurança), **Nome** (Papel de segurança), **Nome social** (Papel de segurança), **Sexo** (Papel de segurança), **Nascimento** (Papel de segurança), **CPF ou CIN** (Papel de segurança), **RG** (Papel de segurança), **Orgão emissor** (Papel de segurança), **UF** (Papel de segurança), **Data emissão** (Papel de segurança), **CNH** (Papel de segurança), **Categoria** (Papel de segurança), **Data 1ª habilitação** (Papel de segurança), **Data Expedição** (Papel de segurança), **Data expiração** (Papel de segurança), **Outro documento** (Papel de segurança), **Número** (Papel de segurança), **Nacionalidade** (Papel de segurança), **Naturalidade** (Papel de segurança), **Estado civil** (Papel de segurança), **Profissão** (Papel de segurança), **Pai** (Papel de segurança), **Mãe** (Papel de segurança), **Politicamente exposta (Prov. 88)** (Papel de segurança), **Pessoa acusada de terrorismo** (Papel de segurança) (+22).
> * **Botões:** **Preencher cartão usando I.A.**, **Consumir** (desabilitado), **Gerar** (desabilitado), **Consulta Central de notificações de suspeitos (CNS).**, **Excluir**, **Adicionar**, **Selecionar**, **Capturar**, **Digitalizar **, **Concluir** (desabilitado), **Voltar**.
> * **Correspondência sugerida para "Preencher com IA":** **Preencher cartão usando I.A.** (botão, 56% — termo(s) em comum: preencher).
> * Sugestão de reescrita: no passo 2, substituir **Preencher com IA** por **Preencher cartão usando I.A.** (botão). O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
O Cartão de Assinatura é o registro fundamental de identificação e autógrafo do usuário no tabelionato. A rotina reúne dados de qualificação, captura fotográfica ao vivo, impressão digital, digitalização de documentos e consumo automático de insumos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse **Firmas > Cadastros > Cartão de Assinatura** e clique no botão **Adicionar**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Cadastros** · (3) **Cartão de assinatura** · (4) **Adicionar**
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
2. Para agilizar o preenchimento, clique em **Preencher com IA** e digitalize ou importe a CNH/RG do cliente.
   [aqui vai a print "passo-02.png"]
   > [!NOTE] **Tela sem dados (Evidência de Tela):** grade vazia (Arquivo, Data, Tipo, Tamanho).
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Preencher com IA] não localizado no DOM nem na Árvore de Acessibilidade, nem após 1 gatilho(s) revelador(es) seguro(s)
3. Revise os dados extraídos pelo OCR (**Nome**, **CPF**, **RG**, **Filiação**, **Endereço** e **Profissão**).
4. Clique no ícone de **Webcam** para capturar a fotografia da face e em **Capturar Biometria** para ler o leitor digital.
5. Imprima o cartão de autógrafo físico clicando em **Impressão** para recolher as assinaturas físicas do apresentante.
6. Clique em **Salvar** para registrar o cartão; se ativado, o sistema consumirá automaticamente o selo e papel de segurança.

* **Importante: Em caso de documentos rasurados ou indícios de falsificação, utilize o botão **Bloquear Cartão** para impedir reconhecimentos imediatos.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Preencher com IA", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do b → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
