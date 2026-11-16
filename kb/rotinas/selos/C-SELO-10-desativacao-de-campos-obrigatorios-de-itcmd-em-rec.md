---
id: C-SELO-10
titulo: Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos
tags:
- ITCMD
- Campos Obrigatórios
- Recibo
- Validação
- Parâmetros
objetivo: Remover a exigência mandatória de preenchimento de campos de ITCMD em atos notariais em que o tributo não incide.
sinonimos:
- erro itcmd ao gerar recibo
- sistema obriga preencher itcmd em compra e venda
- tirar obrigatoriedade de itcmd
- bloqueio de protocolo itcmd
perguntas_usuario:
- Por que o sistema está exigindo preencher dados de ITCMD para emitir recibo de uma procuração ou compra e venda?
- Como desativar a trava que obriga preencher guia de ITCMD no protocolo?
- Onde configuro para o ITCMD não ser obrigatório em atos sem partilha?
sintomas_comuns:
- 'mensagem ao emitir recibo: Preenchimento obrigatório dos campos do ITCMD pendente'
- escrevente não consegue baixar o protocolo no caixa para serviços sem doação ou herança
- parametrização global de exigência fiscal aplicada indiscriminadamente
video:
  tem_video: false
modulo: selos
modulo_nome: Selo Digital e Papéis de Segurança
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Por equívoco de configuração cadastral, a flag de obrigatoriedade de conferência fiscal de ITCMD pode ser vinculada globalmente ao protocolo, impedindo o avanço de negócios onerosos em que incide apenas ITBI.

#### Passo a passo:
1. Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**.
2. Localize a natureza jurídica do ato que está bloqueado (ex.: **Compra e Venda Pura** ou **Procuração**).
3. Clique em **Editar** e acesse a aba **Obrigações e Parâmetros Fiscais**.
4. Desmarque o checkbox **Exigir Comprovante de ITCMD na Conclusão do Protocolo**.
5. Acesse também **Configurações > Parâmetros do Caixa > Emissão de Recibos** e assegure que a validação de ITCMD esteja restrita às naturezas de inventário e doação.
6. Clique em **Salvar Parâmetros**.
7. Retorne ao protocolo, clique em **Salvar** e gere o recibo financeiro com sucesso.

* **Atenção Cadastral:** Mantenha a exigência mandatória de ITCMD ligada apenas nas naturezas de Inventário, Partilha de Bens, Doação e Separação com Excesso de Meação.
---
