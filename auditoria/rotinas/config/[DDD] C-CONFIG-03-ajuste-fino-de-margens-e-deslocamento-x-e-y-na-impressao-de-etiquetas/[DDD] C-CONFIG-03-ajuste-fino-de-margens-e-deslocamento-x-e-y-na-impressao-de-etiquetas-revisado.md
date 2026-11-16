---
id: C-CONFIG-03
titulo: 'Ajuste Fino de Margens e Deslocamento X e Y na Impressão de Etiquetas'
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **hardware periférico / calibração com régua física** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Necessita medição manual milimétrica do papel impresso na serventia e calibração de offsets X e Y no driver ZDesigner ou Generic Text.

#### Descrição:
Ajuste Fino de Margens e Deslocamento X e Y na Impressão de Etiquetas. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Imprimir uma etiqueta de teste de reconhecimento de firma ou selo.
2. Medir com régua o desvio em milímetros da margem superior (Y) e esquerda (X).
3. No Orion TN, acessar **Configurações > Modelos de Impressão > Ajuste Fino**.
4. Compensar os milímetros positivos ou negativos e reimprimir até o enquadramento perfeito.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
