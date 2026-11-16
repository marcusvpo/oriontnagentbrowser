---
id: C-FIN-03
titulo: Habilitação da Conferência de Atos do Setor de Notas no Fechamento de Caixa
tags:
- Orion Caixa
- Conferência de Caixa
- Setor Notas
- Parâmetros
- Fechamento
objetivo: Ativar o parâmetro global que integra as receitas do setor de Notas ao relatório diário de conferência e fechamento do Orion Caixa.
sinonimos:
- atos de notas não saem no caixa
- conferência de caixa notas zerada
- pagamento de certidão não aparece no caixa
- ativar rotina notas
perguntas_usuario:
- Por que os pagamentos de escrituras e certidões de notas não estão aparecendo na conferência de caixa?
- Como fazer o Orion Caixa listar as receitas do setor de notas junto com firmas?
- Relatório de conferência de caixa do dia saiu zerado para o setor de notas, o que verificar?
sintomas_comuns:
- baixa de certidões e atos de notas realizada com sucesso mas ausente no fechamento
- relatório de conferência de caixa só totaliza serviços do balcão de firmas
- saldo físico do caixa não bate com o relatório financeiro do dia
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por padrão de parametrização modular, o Orion Caixa pode operar com segregação de setores. Se a diretiva de integração do Notas estiver desligada, os pagamentos recebidos pelo protocolo de notas não comporão os totalizadores de fechamento.

#### Passo a passo:
1. Abra o **Orion Caixa** com perfil gestor ou tabelião.
2. Navegue até **Administração > Parâmetros do Sistema** (ou **Configurações Gerais**).
3. No quadro de integração de setores, localize e marque a opção **Ativar rotina - Notas**.
4. Selecione as espécies de atos que devem ser contabilizadas no turno do operador.
5. Clique no botão **Gravar / Confirmar**.
6. Oriente os operadores de notas a realizarem o procedimento formal de **Abertura de Caixa** no início do expediente subsequente.

* **Observação Contábil:** Atos recebidos antes da marcação do parâmetro não retroagem para a conferência automática e devem ser conferidos pelo relatório analítico de receitas.
---
