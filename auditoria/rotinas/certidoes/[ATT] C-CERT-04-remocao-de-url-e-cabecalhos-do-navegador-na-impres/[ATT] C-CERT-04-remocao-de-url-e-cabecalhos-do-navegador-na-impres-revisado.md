---
id: C-CERT-04
titulo: 'Remoção de URL e Cabeçalhos do Navegador na Impressão de Certidões pelo Chrome'
modulo: certidoes
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Mais Definições']
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
> **Motivo Técnico:** No passo 2, o manual cita "Mais Definições", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Esse comportamento não é uma falha do Orion TN, mas sim uma configuração padrão de fábrica do Google Chrome que injeta cabeçalhos e rodapés (data, título e URL da página) em qualquer impressão HTML.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela de visualização da certidão, acione o comando de impressão (`Ctrl + P`).
   [aqui vai a print "passo-01.png"]
2. No painel lateral de configurações de impressão do Google Chrome, clique em **Mais Definições**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Mais Definições] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Localize o grupo de opções e **DESMARQUE** a caixa de seleção **Cabeçalhos e Rodapés**.
4. Certifique-se de que a opção **Ajustar à Área de Impressão** ou **Escala** esteja definida como `Padrão` (100%).
5. Envie a impressão para a impressora oficial de papel de segurança.
6. O Chrome salvará essa preferência permanentemente para os próximos documentos impressos naquela estação.

* **Aparência Profissional: Sempre desmarque cabeçalhos e rodapés em todos os navegadores instalados nos computadores do cartório.**
