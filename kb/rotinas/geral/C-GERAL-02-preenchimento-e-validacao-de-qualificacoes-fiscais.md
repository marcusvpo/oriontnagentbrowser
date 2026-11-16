---
id: C-GERAL-02
titulo: Preenchimento e Validação de Qualificações Fiscais Obrigatórias no ITCMD para Transmissão
tags:
- ITCMD
- SEFAZ
- Qualificação Fiscal
- Doador
- Donatário
- Herdeiro
objetivo: Preencher os papéis e vínculos tributários obrigatórios de outorgantes e outorgados no protocolo para aprovação sem erros de validação na SEFAZ.
sinonimos:
- erro de qualificação itcmd
- falta definir papel fiscal na sefaz
- como qualificar herdeiro e meeiro no itcmd
- sefaz acusa falta de dados das partes
perguntas_usuario:
- A SEFAZ está retornando erro de qualificação de partes no ITCMD, o que falta preencher?
- Onde defino quem é o doador e quem é o donatário no cadastro do protocolo?
- Como corrigir a falta de filiação ou dados tributários para envio da declaração estadual?
sintomas_comuns:
- retorno de erro "Tag <QualificacaoParte> nula ou inválida no XML da SEFAZ"
- sistema não habilita o botão de geração do lote do ITCMD no painel de obrigações fiscais
- declaração rejeitada por ausência de indicação expressa de De Cujus em inventário extrajudicial
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A comunicação de atos notariais para a SEFAZ exige uma tipificação fiscal específica para cada participante do ato, a qual difere dos papéis notariais tradicionais de outorgante e outorgado. É imperativo que cada pessoa física ou jurídica participante tenha o campo "Papel Fiscal ITCMD" devidamente atribuído (Doador, Donatário, De Cujus, Herdeiro, Meeiro ou Cessionário).

#### Passo a passo:
1. No Orion TN, abra o protocolo afetado no menu **Notas** > **Protocolo**.
2. Acesse a aba **Partes** da escritura.
3. Selecione a primeira parte listada e clique no botão **Editar / Alterar**.
4. Na seção **Dados Fiscais / SEFAZ**, localize o campo **Qualificação Fiscal ITCMD** e selecione o papel correspondente (ex: para quem transmite o bem: *Doador*; para quem recebe: *Donatário*).
5. Verifique se os dados complementares indispensáveis estão preenchidos: **CPF regular**, **Estado Civil**, **Profissão** e **Endereço Completo com CEP válido**.
6. Repita o mesmo procedimento para todas as partes envolvidas no ato.
7. Na aba **Bens**, confirme se o valor venal de referência da municipalidade e a base de cálculo declarada foram inseridos sem caracteres alfanuméricos estranhos.
8. Clique em **Salvar Protocolo** e proceda à retransmissão no menu **Comunicações** > **SEFAZ**.

* **Dica:** Nos atos de inventário e partilha, o *De Cujus* deve constar obrigatoriamente no cadastro com a data exata do falecimento preenchida para o correto cálculo dos acréscimos moratórios pela SEFAZ.
---
