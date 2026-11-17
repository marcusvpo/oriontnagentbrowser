---
id: C-CENTRAL-02
titulo: Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: 2026-11-16
  status: atualizacao_editorial
  review_tags:
    - ATT
    - CCC
  carga: mutation
  worker_id: worker-3
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  etapas_externas:
    - passo: 1
      portal: SISCOAF
    - passo: 2
      portal: SISCOAF
    - passo: 3
      portal: SISCOAF
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: 2026-11-16
      ambiente_anterior: não registrado (anterior ao ADR-025)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
        - CCC
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
        - CCC
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: 'No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Comunicação COAF" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão'
      bloqueio_atual:
        passo: 4
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T02:13:49.655Z
  governanca_comentario: Passos 1 a 3 ocorrem fora do Orion TN (diretamente no portal oficial do SISCOAF com e-CPF) e devem ser sinalizados como Etapa Externa [CCC] sem print falsa da home. No Orion TN (a partir do passo 4), o caminho atualizado é 'Configurações > Parametrizações > Comunicações' (menu lateral) > bloco 'Coaf' > clicar em 'Clique aqui para acessar a tela de configuração no Orion Coaf', que abre em nova guia a tela com os campos 'CPF/CNPJ', 'E-mail', 'Tipo do certificado' e botão 'Cadastrar'.
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Comunicação COAF" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas", "Cadastros auxiliares", "Perfis e permissões de acesso", "Usuários", "Parametrizações"; "Parâmetros Gerais" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (139 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** Os passos 1, 2, 3 ocorrem fora do Orion TN (SISCOAF); não foram executados nem fotografados. As demais etapas foram auditadas até o ponto de bloqueio.

#### Descrição:
As comunicações de operações suspeitas e inocorrências só podem ser transmitidas por prepostos expressamente cadastrados pelo Tabelião Titular dentro do ambiente autenticado do SISCOAF.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 4 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
2. Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
3. Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
4. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Parâmetros Gerais > Comunicação COAF
5. No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal.
6. Clique em **Gravar**.
7. Retorne à tela de envio do COAF e faça a transmissão do lote pendente.

* **Responsabilidade Legal: Mantenha o cadastro de prepostos atualizado no SISCOAF e desative imediatamente o vínculo de funcionários desligados.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT][CCC] atualizacao_editorial → [ATT][CCC] atualizacao_editorial
* **Bloqueio anterior:** passo 4 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Comunicação COAF" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão → **mantido** (agora: passo 4, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
