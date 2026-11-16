---
id: C-CERT-05
titulo: 'Resolução de Conflito de Cache de Navegador no Módulo de Nova Certidão'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Orion TN']
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion TN", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Quando o Orion TN recebe atualizações de componentes, arquivos JavaScript e folhas de estilo anteriores armazenados na memória do navegador criam conflitos de renderização, travando formulários dinâmicos.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com a janela do **Orion TN** aberta, pressione simultaneamente as teclas `Ctrl + Shift + R` (ou `Ctrl + F5`) para forçar o recarregamento do código fonte da página.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Caso persista:
3. Pressione `Ctrl + Shift + Delete` para abrir a janela **Limpar Dados de Navegação** do Chrome/Edge.
4. Selecione o intervalo de tempo **Todo o Período**.
5. Marque obrigatoriamente a opção **Imagens e Ficheiros em Cache** (não é necessário apagar senhas ou histórico).
6. Clique no botão **Limpar Dados**.
7. Feche completamente todas as abas do navegador e reabra o sistema.
8. Acesse **Certidões > Novo Pedido de Certidão** e confirme que o formulário é carregado com perfeição.

* **Manutenção Preventiva: Realizar a limpeza forçada de cache (`Ctrl + F5`) deve ser o primeiro passo preventivo de qualquer operador após atualizações de versão.**
