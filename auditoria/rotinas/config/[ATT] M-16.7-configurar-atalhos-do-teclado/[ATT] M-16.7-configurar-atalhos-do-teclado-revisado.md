---
id: M-16.7
titulo: 'Configurar Atalhos do Teclado'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 4
      alvos_ausentes: ['CTRL + ALT + N', 'F2']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Atalhos do teclado'
        elemento_real: 'Administração'
        camada: a11y_fuzzy_match
        confianca: 0.68
        texto_alterado: false
        evidencia: 'dom-measured | text:administração | x=733, y=1, 119x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "CTRL + ALT + N", "F2", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite atribuir combinações de teclas rápidas (ex: combinações com CTRL, ALT e teclas funcionais) às operações mais repetitivas do cartório, conferindo agilidade ao atendimento de balcão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Atalhos do teclado**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Administração > Parâmetros > Atalhos do teclado"**, porém na tela atual do Orion TN o elemento se chama **"Administração"** (confiança: 68% — Similaridade semântica na árvore de acessibilidade (64%)). O texto do manual não foi alterado.
2. Na listagem de ações do sistema, localize a função desejada (ex: 'Novo Pedido de Firmas', 'Lançar e Imprimir', 'Localizar Parte', 'Finalizar Pedido').
   [aqui vai a print "passo-02.png"]
3. Clique sobre o campo de comando correspondente à ação.
   [aqui vai a print "passo-03.png"]
4. Pressione a combinação de teclas pretendida no teclado físico (ex: **CTRL + ALT + N** ou tecla de função **F2**).
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [CTRL + ALT + N, F2] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
5. O sistema validará se a combinação não colide com outra função já parametrizada.
6. Clique no botão **Salvar** para registrar os atalhos.

* **Importante: Evite atribuir combinações nativas do Windows (como CTRL + C, CTRL + V ou ALT + F4) para não gerar conflito com o sistema operacional.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
