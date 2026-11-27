---
id: D-1.9
titulo: 'Configurar Impressora e Modelos Padrão'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** A configuração depende da lista de impressoras instaladas no Windows da estação de atendimento (Impressora Padrão de Recibos): periférico físico local que o ambiente web de homologação não supre.

#### Descrição:
Permite designar a impressora padrão vinculada ao terminal do operador e associar os modelos de recibo e fechamento que serão disparados automaticamente após a confirmação de recebimentos ou encerramento do expediente financeiro.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Configurações > Impressora e Modelos Padrão**.
2. Na lista de dispositivos instalados no Windows, selecione a **Impressora Padrão de Recibos**.
3. Selecione o **Modelo Padrão de Comprovante de Pagamento**.
4. Defina o **Modelo Padrão de Fechamento de Caixa**.
5. Marque a opção **Imprimir Automaticamente após Conclusão**, se desejado.
6. Clique em **Salvar Configurações**.

* **Observação: As preferências de hardware podem ser definidas de forma individualizada para cada estação de atendimento do cartório.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
