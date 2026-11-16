---
id: C-FIRMA-04
titulo: Unificação e Bloqueio de Cartões de Assinatura Abertos em Duplicidade
tags:
- Firmas
- Duplicidade
- Cartão de Assinatura
- Unificação
- Auditoria
objetivo: Resolver duplicidade de fichas de firma abertas para o mesmo CPF, preservando o histórico de atos praticados.
sinonimos:
- cliente com duas fichas de firma
- cartão de assinatura duplicado
- como unificar ficha de firma
- bloquear ficha duplicada
perguntas_usuario:
- Abriram duas fichas de firma para a mesma pessoa por engano, como unificar no Orion TN?
- Como cancelar uma ficha de autógrafo duplicada sem perder os atos já reconhecidos?
- Qual ficha de firma deve permanecer ativa quando há duplicidade de cadastro?
sintomas_comuns:
- busca por nome ou CPF exibe dois cartões com números de ficha diferentes
- escreventes reconhecem firmas ora em um cartão, ora em outro
- divergência na contagem de atos praticados pelo cliente
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A legislação veda a exclusão física de fichas numeradas. A duplicidade deve ser tratada elegendo-se a ficha primitiva como principal e inativando a ficha secundária com nota de remissão recíproca.

#### Passo a passo:
1. Acesse o menu **Balcão de Firmas > Fichas / Cartões de Assinatura**.
2. Localize ambas as fichas buscando pelo CPF da parte.
3. Identifique a ficha mais antiga (ou que possui o maior acervo de imagens e atos) para ser a **Ficha Principal**.
4. Abra a ficha secundária (duplicada) e clique em **Editar**.
5. Altere o status para **Inativo / Bloqueado** e, no campo de observações, registre: *"Ficha aberta em duplicidade; atos unificados na Ficha nº [NUMERO_PRINCIPAL]"*.
6. Na Ficha Principal, registre no histórico a anotação da existência do cartão correlato inativado.
7. Clique em **Salvar** em ambas as fichas.

* **Auditoria Notarial:** A inativação formal impede que novas firmas sejam reconhecidas no cartão excedente sem quebrar a rastreabilidade histórica.
---
