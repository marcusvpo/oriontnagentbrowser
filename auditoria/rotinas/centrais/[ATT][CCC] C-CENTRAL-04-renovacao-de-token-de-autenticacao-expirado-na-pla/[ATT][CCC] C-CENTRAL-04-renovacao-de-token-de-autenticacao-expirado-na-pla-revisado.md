---
id: C-CENTRAL-04
titulo: 'Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  review_tags: ['ATT', 'CCC']
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  etapas_externas:
    - passo: 1
      portal: 'SIGNO / CENSEC'
    - passo: 2
      portal: 'SIGNO / CENSEC'
    - passo: 3
      portal: 'SIGNO / CENSEC'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador']
    origem_requisito: 'passo 4'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: '4tabeliao.scs'
    sessao_cargo: 'TABELIAO'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webGed', 'Perfil de acesso - Gerência webLivros', 'Perfil de acesso - Gerência webPro', 'Perfil de acesso - Gerência webFirmas']
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT][CCC]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas", "Cadastros auxiliares", "Perfis e permissões de acesso", "Usuários", "Parametrizações"; "Parâmetros Gerais" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (136 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.
>
> **Etapas externas ([CCC]):** Os passos 1, 2, 3 ocorrem fora do Orion TN (SIGNO / CENSEC); não foram executados nem fotografados. As demais etapas foram auditadas até o ponto de bloqueio.

#### Descrição:
Por segurança, os tokens de API fornecidos pelo Colégio Notarial do Brasil (CNB/SIGNO) possuem prazo de expiração. Ao vencer, o Orion TN perde autorização para realizar chamadas ao webservice da CENSEC.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 4 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o portal oficial do **SIGNO / CENSEC** (`signo.censec.org.br`) com o certificado digital do Tabelião.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SIGNO / CENSEC**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
2. Navegue até **Configurações da Serventia > Integração / API / Tokens**.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SIGNO / CENSEC**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
3. Clique no botão **Gerar Novo Token de Integração / API Key** e copie a chave extensa gerada.
   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SIGNO / CENSEC**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.
4. No **Orion TN**, acesse com perfil de administrador: **Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC
5. Cole a nova chave no campo **Token de Acesso (API Key)**.
6. Clique no botão **Validar Conexão com SIGNO** e confirme a mensagem de sucesso.
7. Clique em **Salvar**.
8. Acesse a tela de envio da CENSEC e retransmita os lotes pendentes da quinzena.

* **Organização: Anote na agenda do cartório a data de validade do token emitido no SIGNO para renová-lo preventivamente antes do vencimento.**
