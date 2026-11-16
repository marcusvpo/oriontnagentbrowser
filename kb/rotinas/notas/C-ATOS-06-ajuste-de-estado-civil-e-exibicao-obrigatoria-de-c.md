---
id: C-ATOS-06
titulo: Ajuste de Estado Civil e Exibição Obrigatória de Cônjuge no Protocolo
tags:
- Qualificação
- Estado Civil
- Cônjuge
- Casamento
- Regime de Bens
objetivo: Corrigir inconsistências no cadastro de pessoas para garantir a correta exibição e validação dos dados de cônjuges em escrituras patrimoniais.
sinonimos:
- cônjuge não aparece no protocolo
- não puxa marido ou esposa
- erro estado civil casado
- cadastrar cônjuge escritura
perguntas_usuario:
- O cliente é casado mas o sistema não abre o campo para cadastrar o cônjuge no protocolo, como arrumar?
- Ao buscar pelo CPF, a esposa cadastrada não vem vinculada ao outorgante, o que fazer?
- Por que o sistema reclama de cônjuge faltante se o outorgante declarou união estável?
sintomas_comuns:
- campo de dados do cônjuge permanece oculto mesmo marcando Casado
- 'cadastro central de pessoas está com estado civil desatualizado (ex.: Solteiro)'
- ausência de indicação do regime de bens bloqueia o envio ao Registro de Imóveis (ONR)
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A exibição do formulário de cônjuge é acionada pelo status do cadastro da pessoa física. Se houver divergência entre o cadastro mestre e o preenchimento no protocolo, o sistema omite o cônjuge ou trava a comunicação.

#### Passo a passo:
1. No **Orion TN**, acesse o menu **Cadastros > Pessoas Físicas** e localize o cliente pelo CPF.
2. Clique em **Editar** e certifique-se de que o campo **Estado Civil** esteja preenchido como **Casado(a)** ou **União Estável**.
3. No campo **Cônjuge / Companheiro(a)**, busque e vincule o cadastro da respectiva pessoa.
4. Preencha obrigatoriamente o **Regime de Bens** e a **Data do Casamento** e clique em **Salvar**.
5. Retorne ao protocolo em **Notas > Protocolo**, remova a parte e insira-a novamente buscando pelo CPF.
6. O Orion TN carregará automaticamente o cônjuge vinculado com toda a qualificação patrimonial perfeita.

* **Normas do Registro de Imóveis:** A indicação expressa do regime de bens e da data do matrimônio é requisito indispensável para evitar notas devolutivas no Registro de Imóveis.
---
