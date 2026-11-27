---
id: V-2.3.3
titulo: 'Conclusão, Emissão de PDF e Envio do Orçamento Completo via WhatsApp e E-mail'
modulo: caixa
secao: V
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_cruzada_rotina
  review_tags: ['XRX']
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.12', 'D-3.13', 'M-47.0']
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Concluir']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um orçamento que precisa existir antes (criado em outra rotina) e o alvo do passo 1 não estava na tela. Rotinas que o criam: D-3.12 — Fazer Orçamento Rápido; D-3.13 — Fazer Orçamento Completo; M-47.0 — Cadastrar Orçamento Rápido.

#### Descrição:
Procedimento para finalizar o cadastro do Orçamento Completo no **ORION TN**, gerando o número de registro permanente no sistema, e realizar a transmissão da proposta ao cliente por meio do módulo de WhatsApp integrado, disparo automático de e-mail ou geração de PDF personalizado para envio pelo correio eletrônico individual do escrevente.

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.12 (Fazer Orçamento Rápido).
2. Executar antes a rotina D-3.13 (Fazer Orçamento Completo).
3. Executar antes a rotina M-47.0 (Cadastrar Orçamento Rápido).
4. Com o orcamento aberto, reexecutar a auditoria da rotina V-2.3.3.

* **Rotinas pré-requisito (executar antes):** **D-3.12**, **D-3.13**, **M-47.0**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na tela do orçamento completo, após conferir todos os atos notariais, ITBI, registro e valores extranotariais, clique no botão **Concluir** no canto inferior.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Concluir] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. O sistema grava os dados no banco de dados e gera imediatamente o **Número do Orçamento** sequencial na tela (ex.: Orçamento nº 77).
3. Para enviar a proposta via **WhatsApp**:
   * Clique na opção **WhatsApp** na barra inferior (recurso que requer a contratação e ativação de componente integrado junto à equipe comercial da Siplan).
   * O sistema carrega automaticamente o número de telefone registrado na ficha do solicitante.
   * Digite números de WhatsApp adicionais se desejar e confirme o envio da mensagem formatada com o orçamento.
4. Para enviar a proposta via **E-mail automático**:
   * Clique na opção **E-mail** na barra inferior.
   * O sistema carrega os endereços de e-mail cadastrados na ficha do solicitante.
   * Para adicionar mais destinatários, digite o novo endereço de e-mail e pressione a tecla **Enter** no teclado para acumular o endereço na lista de envio.
   * Clique no botão **Enviar** para que o sistema transmita o orçamento completo para todos os e-mails acumulados.
5. Para envio com **Remetente Individualizado do Escrevente** (Personalizado):
   * Como o disparo automático do sistema utiliza o remetente institucional único do **Cartório**, caso o escrevente deseje enviar do seu próprio e-mail pessoal de trabalho, utilize a opção de PDF.
   * Clique na opção de **Impressão em PDF** na barra inferior.
   * Selecione o modelo de orçamento desejado entre as opções cadastradas do cartório.
   * O sistema gerará o documento PDF completo em tela contendo todas as rubricas e identificações.
   * Salve o arquivo PDF na estação de trabalho e anexe-o diretamente no seu programa de e-mail habitual para envio com sua assinatura individual.

* **Observação: O serviço de envio de WhatsApp depende de contratação de componente terceirizado homologado pela Siplan.**
* **Observação: O envio de e-mails diretos pelo sistema não individualiza o remetente por operador; para atendimento customizado, a geração do PDF e envio externo pelo e-mail do escrevente é o procedimento recomendado.**
* **Dica / Caso Real do 0800: Evite manter o mesmo protocolo aberto em mais de uma aba do Google Chrome para não gerar bloqueios automáticos de concorrência (*locks*) no banco de dados.**
