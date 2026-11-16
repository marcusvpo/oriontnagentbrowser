---
id: C-GERAL-05
titulo: Parametrização de Regras e Fórmulas de Custas para Cobrança de 1/5 de Emolumentos
tags:
- Tabela de Custas
- Emolumentos
- Fórmulas de Cobrança
- Desistência de Ato
- Custas Proporcionais
objetivo: Cadastrar fórmulas especiais de cálculo proporcional para aplicação de 1/5 (20%) sobre os emolumentos normativos em casos de desistência de lavratura com minuta redigida.
sinonimos:
- cobrar 1/5 das custas no cancelamento
- fórmula de cálculo 20 por cento de emolumentos
- criar regra de cobrança proporcional de escritura
- configurar custas de ato incompleto
perguntas_usuario:
- As partes desistiram da escritura após a minuta pronta e o provimento manda cobrar 1/5 das custas, como configuro essa regra?
- Como crio uma regra de cálculo no Orion TN para cobrar 20% do valor dos emolumentos?
- Onde vinculo a fórmula especial de 1/5 da tabela de custas à natureza do ato?
sintomas_comuns:
- escrevente precisa calcular manualmente o percentual de 20% na calculadora e alterar valores no caixa
- divergência de centavos no rateio fiscal (IPESP, Tribunal de Justiça, Município) em cobranças manuais
- ausência de previsão automatizada na emissão de recibo para atos incompletos ou revogados antes da assinatura
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Os Regimentos de Custas Estaduais preveem que, em caso de revogação ou desistência dos interessados após a elaboração da minuta notarial, será devido ao cartório 1/5 (20%) dos emolumentos cabíveis pelo ato completo. Para garantir a repartição tributária matemática e transparente entre o oficial e os fundos públicos, uma fórmula de cálculo multiplicadora deve ser cadastrada e associada a uma natureza específica.

#### Passo a passo:
1. Acesse o menu **Tabelas** > submenu **Custas e Emolumentos**.
2. Selecione a **Tabela de Custas Vigente** e clique na aba **Fórmulas e Regras Especiais**.
3. Clique no botão **Nova Fórmula / Inserir**.
4. Preencha o **Nome da Regra** como: `Cobrança Proporcional de Atos Incompletos - 1/5 (20%)`.
5. No campo **Fator Multiplicador de Emolumentos**, informe o índice decimal `0.2000` (assegurando que o sistema aplique a fração proporcional também aos fundos públicos do TJ e taxas estaduais).
6. Clique no botão **Gravar Fórmula**.
7. Acesse o menu **Tabelas** > **Naturezas de Atos Notariais** e localize ou crie a natureza: *Desistência de Escritura / Ato Incompleto (1/5)*.
8. No campo **Fórmula de Cálculo Vinculada**, selecione a regra recém-criada (**1/5 das Custas**) e clique em **Salvar**.
9. Ao abrir um protocolo dessa espécie, o Orion TN aplicará automaticamente o redutor no orçamento e no módulo de Caixa.

* **Dica:** Exija sempre a certidão de arquivamento ou termo de desistência assinado pelas partes anexado ao protocolo para lastrear a cobrança perante a Corregedoria.
---
