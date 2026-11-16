---
id: M-70.1
titulo: 'Configurando os Parâmetros Técnicos de um Modelo de Etiqueta'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Editar', 'Parâmetros Técnicos / Layout']
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
> **Motivo Técnico:** No passo 1, o manual cita "Editar", "Parâmetros Técnicos / Layout", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Configura os parâmetros técnicos de baixo nível do layout da etiqueta, programando a linguagem da impressora térmica (ZPL/EPL), coordenadas de alinhamento e inserção de variáveis dinâmicas para selo, QR Code e dados da parte.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No cadastro do modelo de etiqueta (ou em **Editar**), acesse a aba **Parâmetros Técnicos / Layout**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Editar, Parâmetros Técnicos / Layout] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Selecione a **Linguagem da Impressora** compatível com o seu hardware (**ZPL** para Zebra moderna, **EPL** para Zebra clássica/Argox ou modo gráfico).
3. Na seção **Variáveis**, consulte os campos de dados dinâmicos disponíveis no sistema (ex: `[NOME_PARTE]`, `[NUMERO_SELO]`, `[DATA_ATO]`, `[ESCREVENTE]`, `[QRCODE_URL]`, `[HASH]`).
4. Insira os comandos de formatação e posicione as variáveis nas coordenadas desejadas do script de impressão.
5. Clique no botão **Validar Script** para checar a sintaxe do código térmico.
6. Clique no botão **Imprimir Teste** em uma impressora homologada para conferir contraste, legibilidade do QR Code e enquadramento físico.
7. Clique no botão **Salvar** para disponibilizar o modelo aos operadores.

* **Importante: A etiqueta deve sempre reservar espaço perfeitamente legível para o QR Code e o número do selo de fiscalização, atendendo às normas técnicas da Corregedoria.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**
