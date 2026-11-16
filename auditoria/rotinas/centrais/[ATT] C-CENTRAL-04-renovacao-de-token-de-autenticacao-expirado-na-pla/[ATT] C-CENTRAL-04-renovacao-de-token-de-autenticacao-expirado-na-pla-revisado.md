---
id: C-CENTRAL-04
titulo: 'Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
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
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['SIGNO / CENSEC']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "SIGNO / CENSEC", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Por segurança, os tokens de API fornecidos pelo Colégio Notarial do Brasil (CNB/SIGNO) possuem prazo de expiração. Ao vencer, o Orion TN perde autorização para realizar chamadas ao webservice da CENSEC.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o portal oficial do **SIGNO / CENSEC** (`signo.censec.org.br`) com o certificado digital do Tabelião.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [SIGNO / CENSEC] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Navegue até **Configurações da Serventia > Integração / API / Tokens**.
3. Clique no botão **Gerar Novo Token de Integração / API Key** e copie a chave extensa gerada.
4. No **Orion TN**, acesse com perfil de administrador: **Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC**.
5. Cole a nova chave no campo **Token de Acesso (API Key)**.
6. Clique no botão **Validar Conexão com SIGNO** e confirme a mensagem de sucesso.
7. Clique em **Salvar**.
8. Acesse a tela de envio da CENSEC e retransmita os lotes pendentes da quinzena.

* **Organização: Anote na agenda do cartório a data de validade do token emitido no SIGNO para renová-lo preventivamente antes do vencimento.**
