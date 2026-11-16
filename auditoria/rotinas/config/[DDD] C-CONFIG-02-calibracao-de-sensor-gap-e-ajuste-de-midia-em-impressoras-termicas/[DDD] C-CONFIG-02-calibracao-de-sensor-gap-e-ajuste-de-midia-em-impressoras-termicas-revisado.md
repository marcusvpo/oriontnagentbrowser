---
id: C-CONFIG-02
titulo: 'Calibração de Sensor Gap e Ajuste de Mídia em Impressoras Térmicas (Zebra / Argox / Elgin)'
modulo: config
secao: C
auditoria_ui:
  data_execucao: '2026-11-11'
  status: dependencia_dados_banco
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **hardware periférico / sensor óptico físico** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Envolve procedimentos mecânicos no painel da impressora (Pause + Feed) e alinhamento do sensor de espaçamento (GAP) entre etiquetas físicas.

#### Descrição:
Calibração de Sensor Gap e Ajuste de Mídia em Impressoras Térmicas (Zebra / Argox / Elgin). Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Desligar a impressora térmica no botão traseiro.
2. Pressionar e segurar o botão **FEED** (ou **PAUSE** conforme o modelo) e ligar o equipamento.
3. Aguardar o avanço de 3 etiquetas em branco até o LED estabilizar na cor verde fixa.
4. No Orion TN, acesse **Configurações > Modelos de Impressão** e envie um teste de impressão para validar o corte sobre o picote.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
