---
id: C-FIN-14
titulo: Correção de Vigência Retroativa na Tabela de Comissões de Mensalistas
tags:
- Mensalistas
- Comissões
- Tabela de Custas
- Vigência
- Reprocessamento
objetivo: Regularizar relatórios de comissões de empresas conveniadas quando os atos foram praticados antes da data de vigência cadastrada no sistema.
sinonimos:
- comissão de mensalista não calcula
- relatório de comissões divergente
- ajustar vigência de comissão
- reprocessar comissões mensalistas
perguntas_usuario:
- Por que os serviços de autenticação e firmas do mensalista não estão computando a comissão devida?
- Como fazer a regra de comissão de mensalista retroagir para atos feitos no início do mês?
- Relatório de comissões de convênio saiu em branco, onde está o erro?
sintomas_comuns:
- relatório analítico de comissões apresenta valor zerado para atos faturados
- regra de comissão foi cadastrada no meio do mês após os atos já terem sido lavrados
- divergência de valores no repasse acordado com o parceiro conveniado
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O motor de cálculo de convênios do Orion TN valida a data da realização do serviço contra a data de início de vigência da regra. Se o parâmetro for cadastrado com data posterior aos atendimentos, o sistema ignora o desconto/comissão.

#### Passo a passo:
1. No **Orion TN**, acesse **Configurações > Parâmetros de Faturamento > Comissões / Convênios**.
2. Localize a tabela de convênio da empresa parceira e clique em **Editar**.
3. No campo **Data de Início da Vigência**, altere para o primeiro dia útil do mês (ou data anterior ao primeiro ato faturado).
4. Clique no botão **Gravar**.
5. Para os pedidos que já haviam sido baixados sem o benefício: no **Orion Caixa**, estorne a baixa do faturamento correspondente.
6. Gere novamente o faturamento em **Mensalistas > Faturamento de Convênios**, validando que as comissões foram recalculadas com sucesso.

* **Atenção:** Sempre que firmar novo contrato com mensalista, configure a tabela de comissões antes do início da prestação dos atos no balcão.
---
