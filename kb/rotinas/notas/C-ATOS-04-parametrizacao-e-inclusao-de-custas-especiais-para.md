---
id: C-ATOS-04
titulo: Parametrização e Inclusão de Custas Especiais para Escrituras COHAB / CDHU
tags:
- Custas
- COHAB
- CDHU
- Tabela de Emolumentos
- Habitação Popular
objetivo: Cadastrar itens tarifários com reduções legais para escrituras de habitação popular (COHAB/CDHU) e vinculá-los ao protocolo.
sinonimos:
- custa cohab não configurada
- emolumentos cdhu
- tabela de custas habitação social
- adicionar custa escritura popular
perguntas_usuario:
- Não está configurada a custa de escrituras da COHAB no sistema, como cadastrar?
- Como aplicar o desconto de emolumentos para imóveis do CDHU no Orion TN?
- Onde crio uma nova regra de cálculo para contratos habitacionais populares?
sintomas_comuns:
- sistema calcula valor cheio da escritura para mutuários de programas habitacionais
- ausência de rubrica tarifária correspondente na tabela vigente
- necessidade de ajustar os emolumentos manualmente a cada atendimento
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A legislação estadual e os provimentos da Corregedoria preveem reduções de custas para contratos vinculados à COHAB e CDHU. A ausência do item parametrizado na tabela do sistema força cálculos manuais suscetíveis a erro.

#### Passo a passo:
1. Acesse o menu **Configurações > Custas e Emolumentos > Itens da Tabela**.
2. Clique no botão **Novo Item de Custa**.
3. Defina a descrição (ex.: **Escritura Padrão COHAB/CDHU**) e associe o código da tabela do Tribunal de Justiça.
4. Informe a regra de alíquota com o desconto percentual ou o valor fixo estipulado pelo provimento.
5. No campo **Naturezas Habilitadas**, vincule o item às naturezas de Compra e Venda e Habitação Popular.
6. Clique em **Gravar**.
7. No protocolo do ato, acesse a aba **Custas**, selecione o novo item cadastrado e confirme o cálculo automático.

* **Conformidade:** Certifique-se de arquivar a comprovação do enquadramento do imóvel no programa habitacional junto ao protocolo notarial.
---
