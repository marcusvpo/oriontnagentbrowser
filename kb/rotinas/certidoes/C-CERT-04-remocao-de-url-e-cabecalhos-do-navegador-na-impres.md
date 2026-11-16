---
id: C-CERT-04
titulo: Remoção de URL e Cabeçalhos do Navegador na Impressão de Certidões pelo Chrome
tags:
- Certidões
- Impressão
- Google Chrome
- Cabeçalho e Rodapé
- Layout
objetivo: Configurar o diálogo de impressão do navegador Google Chrome para impedir que links de protocolo ou URLs saiam impressos na certidão.
sinonimos:
- link do protocolo saindo na certidão
- tirar endereço do site na impressão da certidão
- certidão saindo com data e url no rodapé
- configurar impressão chrome certidões
perguntas_usuario:
- Quando imprimo a certidão no Chrome está saindo o link do protocolo no rodapé da folha, como tirar?
- Como fazer para não sair a data e o endereço da web na impressão das certidões?
- Onde desmarco os cabeçalhos do navegador ao imprimir atos no Orion TN?
sintomas_comuns:
- folha oficial da certidão é impressa com o texto `https://oriontn...` na margem superior ou inferior
- cliente ou órgão público reclama de caracteres do navegador impressos no documento oficial
- impressão pelo download do PDF sai perfeita, mas pela tela direta sai com cabeçalho
video:
  tem_video: false
modulo: certidoes
modulo_nome: Certidões e Buscas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Esse comportamento não é uma falha do Orion TN, mas sim uma configuração padrão de fábrica do Google Chrome que injeta cabeçalhos e rodapés (data, título e URL da página) em qualquer impressão HTML.

#### Passo a passo:
1. Na tela de visualização da certidão, acione o comando de impressão (`Ctrl + P`).
2. No painel lateral de configurações de impressão do Google Chrome, clique em **Mais Definições**.
3. Localize o grupo de opções e **DESMARQUE** a caixa de seleção **Cabeçalhos e Rodapés**.
4. Certifique-se de que a opção **Ajustar à Área de Impressão** ou **Escala** esteja definida como `Padrão` (100%).
5. Envie a impressão para a impressora oficial de papel de segurança.
6. O Chrome salvará essa preferência permanentemente para os próximos documentos impressos naquela estação.

* **Aparência Profissional:** Sempre desmarque cabeçalhos e rodapés em todos os navegadores instalados nos computadores do cartório.
---
