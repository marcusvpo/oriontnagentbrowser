---
id: C-FIRMA-02
titulo: Regularização de Sequência no Livro de Termos de Comparecimento e Etiquetas de Ressalva
tags:
- Firmas
- Termo de Comparecimento
- Sequência de Livros
- Etiqueta de Ressalva
- DUT
objetivo: Corrigir saltos na numeração de termos de comparecimento e aplicar etiquetas de ressalva sem invalidar as folhas encadernadas.
sinonimos:
- pulei número do termo de comparecimento
- termo com nome errado ressalva
- reaproveitar folha do termo
- arrumar sequência livro termo
perguntas_usuario:
- O termo de comparecimento foi impresso com o nome errado por causa da ficha, como arrumar sem perder o termo?
- Como corrigir a sequência de termos que pulou duas posições no livro encadernado?
- Como emitir etiqueta de ressalva para termo de comparecimento de DUT no Orion TN?
sintomas_comuns:
- termo físico impresso com erro de grafia de nome ou documento
- sistema acusa divergência entre a numeração física do livro e o contador do banco
- escrevente precisa retificar o lançamento sem violar a regra de encadernação
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Em livros encadernados de termos de comparecimento (DUT/CRV e autenticidade), não é permitido rasgar folhas. O Orion TN dispõe de rotina nativa de ressalva com reutilização da folha do termo.

#### Passo a passo:
1. No caso de **Erro de Grafia no Termo Já Impresso**:
2. Acesse **Firmas > Fichas de Firmas**, localize o cliente e corrija os dados cadastrais.
3. Acesse **Firmas > Livros > Livro de Termos de Comparecimento** e selecione o termo emitido.
4. Clique no botão **Imprimir Etiqueta de Ressalva** com a opção **Reutilização da Folha do Termo** ativada.
5. Cole a etiqueta retificadora sobre a folha física do livro.
6. No caso de **Salto de Numeração**:
7. Na tela de gestão de livros de termos, acesse **Ajuste de Sequência de Termos**.
8. Informe a numeração que deve ser restabelecida como próximo termo e confirme.

* **Corregedoria:** A emissão de etiqueta de ressalva preserva a integridade numérica e atende integralmente às exigências das Normas de Serviço.
---
