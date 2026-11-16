---
id: C-LIVRO-04
titulo: 'Reinício dos Microsserviços de Renderização e Conversão Documental (Docker)'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['PowerShell', 'Docker Desktop']
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
> **Motivo Técnico:** No passo 2, o manual cita "PowerShell", "Docker Desktop", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A geração em alta fidelidade do livro e do traslado depende dos containers Docker `orion-document-service` e `orion-conversion`. Se o serviço perder conexão com a memória ou congelar, o editor falha ao converter os formatos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o servidor central do cartório com credenciais administrativas.
   [aqui vai a print "passo-01.png"]
2. Abra o terminal do **PowerShell** ou aplicativo **Docker Desktop**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [PowerShell, Docker Desktop] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Execute o comando de reinício dos microsserviços documentais:
4. `docker restart orion-document-service orion-conversion`
5. Aguarde cerca de 30 a 45 segundos para que as portas internas sejam reestabelecidas.
6. Execute `docker ps` e valide se ambos os containers exibem o status `Up (healthy)`.
7. Nas estações de trabalho, feche e reabra o navegador.
8. Acesse qualquer protocolo em **Notas > Protocolo**, abra a aba **Livro** e confirme a renderização imediata do documento.

* **Suporte de TI: Reiniciar apenas a máquina cliente não resolve a falha se o container central no servidor estiver parado.**
