---
id: C-FIN-11
titulo: 'Tratamento de Faturas de Mensalistas Abaixo do Limite Bancário (< R$ 50) e Alerta de Bloqueio'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['abaixo de R$ 50,00']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T21:16:54.435Z'
    rota: '#/inicio'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Vencidas']
    abas: []
    campos: []
    botoes: []
    alvos_do_passo: ['abaixo de R$ 50,00']
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: ['abaixo de R$ 50,00']
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
      alvos_ausentes_nivel2: ['abaixo de R$ 50,00']
    sugestao_reescrita: 'Sugestão de reescrita: abaixo de R$ 50,00 não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.'
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "abaixo de R$ 50,00", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Vencidas**.
> * **Sem correspondência funcional na tela:** **abaixo de R$ 50,00**.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Ausentes em toda a tela (incluindo sub-estados L2):** **abaixo de R$ 50,00** (candidatos fortes a remoção/renomeação no manual).
> * Sugestão de reescrita: **abaixo de R$ 50,00** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
As normas da Febraban impedem o registro de boletos de cobrança de valores irrisórios. Além disso, o Orion TN oferece parametrização para alertar os escreventes caso o conveniado possua faturas pretéritas em aberto.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Para faturas **abaixo de R$ 50,00**:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [abaixo de R$ 50,00] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. No **Orion Caixa**, acesse **Faturamento > Mensalistas > Conta Corrente**, selecione o cliente e opte por acumular o débito para a competência seguinte ou receba via PIX avulso lançando a liquidação manual.
3. Para ativar o **Alerta / Bloqueio de Inadimplência**:
4. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Mensalistas**.
5. Localize o cliente e clique em **Editar**.
6. Marque a opção **Bloquear Atendimento** e digite a mensagem de advertência (ex.: *"CONVÊNIO SUSPENSO: Contatar setor financeiro"*).
7. Clique em **Gravar**. O alerta surgirá em pop-up impeditivo ao digitar o CNPJ em qualquer protocolo.

* **Gestão Financeira: O bloqueio automático evita novos atos a prazo para empresas com débitos pendentes há mais de 30 dias.**
