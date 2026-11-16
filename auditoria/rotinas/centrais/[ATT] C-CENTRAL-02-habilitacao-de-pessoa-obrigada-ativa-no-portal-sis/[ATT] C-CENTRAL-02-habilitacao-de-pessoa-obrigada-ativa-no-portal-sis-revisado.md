---
id: C-CENTRAL-02
titulo: 'Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['SISCOAF']
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
> **Motivo Técnico:** No passo 1, o manual cita "SISCOAF", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
As comunicações de operações suspeitas e inocorrências só podem ser transmitidas por prepostos expressamente cadastrados pelo Tabelião Titular dentro do ambiente autenticado do SISCOAF.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [SISCOAF] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.
3. Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.
4. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.
5. No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal.
6. Clique em **Gravar**.
7. Retorne à tela de envio do COAF e faça a transmissão do lote pendente.

* **Responsabilidade Legal: Mantenha o cadastro de prepostos atualizado no SISCOAF e desative imediatamente o vínculo de funcionários desligados.**
