---
id: C-GERAL-03
titulo: Inconsistência no Envio de Atos ao SIGNO por Omissão Cadastral de Cônjuge ou Regime de Bens
tags:
- SIGNO
- Selo Digital
- Cônjuge
- Regime de Bens
- Validação XML
objetivo: Corrigir rejeições de selagem digital no SIGNO originadas pela indicação de pessoa casada desprovida de vinculação do respectivo cônjuge ou regime patrimonial no cadastro notarial.
sinonimos:
- erro no envio do selo para o signo
- signo rejeita parte casada sem cônjuge
- inconsistência no xml do selo digital estado civil
- falha de comunicação com cnb signo
perguntas_usuario:
- Por que o ato está com status de falha no SIGNO acusando inconsistência no cônjuge?
- Como resolvo o erro de validação do selo digital que reclama do regime de bens?
- O que precisa ser preenchido no cadastro da parte casada para o SIGNO aceitar o envio do ato?
sintomas_comuns:
- 'retorno do webservice SIGNO: "Erro de Schema XML: Elemento <Conjuge> obrigatório para estado civil Casado(a)"'
- protocolo não recebe o selo digital definitivo e não permite emissão do traslado
- escrevente alterou o estado civil da parte no texto da minuta mas esqueceu de atualizar a ficha cadastral estruturada
video:
  tem_video: false
modulo: geral
modulo_nome: Geral e Rotinas Administrativas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O barramento nacional do SIGNO (Colégio Notarial do Brasil) executa validações rigorosas de schema XML antes de conceder a chancela do selo digital. Quando uma parte envolvida é qualificada como Casada ou em União Estável, o padrão do selo exige a presença dos nós de dados do cônjuge (CPF e nome) e o código do regime patrimonial de bens (ex: Comunhão Parcial, Separação Total), rejeitando transmissões com campos em branco.

#### Passo a passo:
1. No Orion TN, acesse **Notas** > submenu **Protocolo** e abra o ato rejeitado.
2. Clique na aba **Partes**, selecione o participante qualificado como casado(a) e clique em **Alterar**.
3. Na seção **Identificação Civil**, confirme o campo **Estado Civil** definido como *Casado(a)*.
4. No campo **Cônjuge Vinculado**, clique na lupa de busca (`F3`) e selecione o cadastro do respectivo cônjuge com qualificação e CPF válidos.
5. No campo **Regime de Bens**, selecione expressamente o regime patrimonial adotado na certidão de casamento e informe a **Data do Casamento**.
6. Caso a parte seja separada judicialmente ou divorciada, ajuste o estado civil para a opção exata para desobrigar os campos de cônjuge.
7. Clique no botão **Confirmar** para fechar a ficha da parte e, em seguida, clique em **Salvar Protocolo**.
8. Acesse o menu **Comunicações** > **SIGNO / Selo Digital**, selecione o protocolo na grade de pendências e clique no botão **Reprocessar e Transmitir**.

* **Dica:** Sempre preencha a qualificação cadastral das partes pelas abas formais do protocolo em vez de confiar apenas em inserções manuais no corpo do editor de texto da minuta.
---
