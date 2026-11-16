---
id: C-ACESSO-04
titulo: 'Descompasso de Credenciais entre Orion TN e Módulo SGA com Divergência de Regras de Senha'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 3
      alvos_ausentes: ['Senha']
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
> **Motivo Técnico:** No passo 3, o manual cita "Senha", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Olá, 4 > Alterar senha (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O Orion TN permite senhas numéricas curtas em perfis legados, ao passo que a interface web do módulo SGA (Gestão de Atendimento e Painel de Senhas) adota políticas de segurança mais restritivas (mínimo de 6 a 8 caracteres). Quando o escrevente aciona o painel integrado a partir do Orion TN, a passagem automática de parâmetros falha devido à rejeição da senha curta pela API do SGA.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 3 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No Orion TN, acesse o menu **Configurações** > submenu **Usuários**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Usuários**
2. Localize e abra o cadastro do escrevente com falha no SGA clicando em **Alterar**.
   [aqui vai a print "passo-02.png"]
3. No campo **Senha**, cadastre uma nova senha que cumpra integralmente os requisitos do SGA (mínimo de 6 caracteres alfanuméricos).
   [aqui vai a print "passo-03.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Senha] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
4. Clique no botão **Salvar**.
5. Em seguida, acesse o menu **Atendimento** > **Configurações do SGA** > aba **Operadores de Guichê**.
6. Localize o usuário correspondente, selecione **Sincronizar Credenciais com Orion TN** e insira a nova senha padronizada.
7. Vincule o operador ao **Guichê de Atendimento** físico correspondente e clique em **Gravar**.
8. Solicite ao escrevente que feche o módulo e acione o atalho **Chamar Senha** para validar o acesso imediato.

* **Dica: Mantenha a regra de senhas com no mínimo 6 caracteres alfanuméricos para todos os colaboradores do cartório, eliminando atritos de Single Sign-On entre o módulo de Notas, Caixa, SGA e Estoque.**
