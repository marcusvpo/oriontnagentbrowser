---
id: R-11.0
titulo: 'Comunicação de Fichas de Firma com o e-Notariado'
modulo: centrais
secao: R
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
      alvos_ausentes: ['"E-notariado"']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 2
        alvo_documentado: '"E-notariado"'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita ""E-notariado"", que não foi localizado na tela auditada. A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite enviar os dados e imagens das fichas de cartão de assinatura para a base nacional do e-Notariado (CCN), operando via transmissão em lote manual ou agendamento automático em segundo plano.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. **Para Envio Manual:** Acesse **Administração > Comunicações > Outras Comunicações**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Administração** · (2) **Comunicações** · (3) **Outras comunicações**
2. Clique no botão **Gerar**, selecione o tipo **"E-notariado"** e defina o período das fichas cadastradas.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **""E-notariado""**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Alvo(s) citados no manual sem evidência na tela auditada: ""E-notariado""
3. Selecione as fichas listadas, clique em **Processar** e em seguida em **Finalizar** para concluir a transmissão.
4. **Para Configurar o Envio Automático:** Acesse **Configurações > Parametrizações > Comunicações**.
5. Selecione a opção **Automático**, defina a periodicidade (diária ou semanal), insira o **Token do Cartório** (obtido na plataforma do e-Notariado), marque o status como **"Ativo"** e clique em **Concluir**.

* **Importante: Mantenha o token de integração do e-Notariado sempre atualizado para evitar rejeições no processamento em lote.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**
