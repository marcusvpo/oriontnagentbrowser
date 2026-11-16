---
id: C-SELO-02
titulo: Tratamento de Duplicidade de Selos Digitais por Instabilidade ou Timeout de Webservice
tags:
- Selo Digital
- Duplicidade
- Timeout
- Postman
- Suporte Siplan
objetivo: Identificar e inutilizar selos gerados em duplicidade para um mesmo ato notarial em decorrência de lentidão na resposta do servidor do tribunal.
sinonimos:
- selo digital duplicado
- dois selos no mesmo ato
- timeout ao gerar selo tj
- inutilizar selo excedente
perguntas_usuario:
- O sistema travou na geração do selo e agora o ato está com dois selos digitais, como cancelar um deles?
- Como excluir um selo duplicado gerado por instabilidade do TJSP?
- Dois selos foram cobrados no mesmo protocolo por erro de rede, como regularizar?
sintomas_comuns:
- protocolo ou ficha apresenta dois números de selo distintos para o mesmo serviço
- relatório de fechamento aponta consumo excessivo de selos
- escrevente clicou duas vezes no botão de selagem durante lentidão do sistema
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando ocorre timeout de socket após o tribunal processar a requisição mas antes de retornar o código de confirmação ao cartório, nova tentativa gera uma segunda numeração legítima no banco de dados.

#### Passo a passo:
1. Abra o protocolo no **Orion TN** e acesse a aba **Custas / Selos**.
2. Identifique qual dos selos foi impresso no documento físico e qual ficou excedente (espúrio).
3. No selo excedente, clique em **Estornar Selo** e justifique: *"Duplicidade sistêmica decorrente de timeout de conexão"*.
4. Na grade de custas, remova o lançamento excedente para que o valor não seja cobrado da parte.
5. **Ação de Suporte Siplan N2 (se o lote ainda não fechou no TJ):**
6. O suporte técnico executará a chamada de cancelamento via API de retaguarda para registrar a anulação do selo órfão diretamente no webservice do tribunal antes do fechamento semanal.

* **Suporte Siplan:** Ao abrir chamado no 0800 para exclusão de selo duplicado, informe sempre o número do selo a manter, o número a cancelar e o número do protocolo.
---
