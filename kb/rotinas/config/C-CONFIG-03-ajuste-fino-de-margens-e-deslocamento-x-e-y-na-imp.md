---
id: C-CONFIG-03
titulo: Ajuste Fino de Margens e Deslocamento X e Y na Impressão de Etiquetas de Reconhecimento
tags:
- Etiquetas
- Margens
- Layout de Impressão
- Balcão de Firmas
- Configurações
objetivo: Corrigir cortes de caracteres nas margens esquerda, direita ou superior de etiquetas de autenticidade através do ajuste de coordenadas milimétricas no Orion TN.
sinonimos:
- texto da etiqueta cortando na esquerda
- etiqueta de firma saindo torta
- ajustar margem de etiqueta de autenticidade
- como puxar texto para a direita na etiqueta
perguntas_usuario:
- O nome do cliente está saindo com a primeira letra comida na etiqueta de reconhecimento, como ajusto?
- Como faço para empurrar o texto da etiqueta mais para o centro do papel adesivo?
- Onde fica a configuração de margem milimétrica das etiquetas no Orion TN?
sintomas_comuns:
- iniciais dos nomes das partes ou código do selo cortados na borda física da etiqueta
- texto colado na borda superior invadindo a área de picote de destaque
- escrevente precisa colar etiqueta torta no documento para que as informações fiquem visíveis
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Mesmo com a impressora devidamente calibrada, variações mecânicas nas guias do rolo podem deslocar o início da impressão em alguns milímetros. O Orion TN possui um módulo nativo de compensação dimensional de layout de etiquetas, possibilitando mover toda a matriz de caracteres em eixos cartesianos X (horizontal) e Y (vertical) sem alterar o modelo de texto.

#### Passo a passo:
1. No menu principal do Orion TN, acesse **Configurações** > submenu **Impressão de Etiquetas**.
2. Na lista de layouts, localize o modelo em operação (ex: *Reconhecimento de Firma por Autenticidade Padrão* ou *Etiqueta Dupla Semelhança*).
3. Acione o botão **Alterar Layout / Parâmetros**.
4. Identifique os campos de ajuste de compensação milimétrica:
    - **Deslocamento Horizontal (Eixo X):** Para empurrar o texto para a direita, aumente o valor positivo (ex: de `0 mm` para `+2 mm`); para recuar à esquerda, use valores negativos.
    - **Deslocamento Vertical (Eixo Y):** Para descer o texto afastando do topo, aumente o valor (ex: de `1 mm` para `+3 mm`).
5. Clique no botão **Imprimir Etiqueta de Teste** utilizando o rolo de rascunho.
6. Valide visualmente se todas as bordas do texto, selo digital e QR Code respeitam a margem de segurança de pelo menos 2 milímetros de cada lado.
7. Clique em **Salvar Parâmetros** para aplicar a configuração a todos os balcões da serventia.

* **Dica:** Sempre faça ajustes graduais de 1 em 1 milímetro por teste, garantindo que o texto não ultrapasse o limite da borda oposta.
---
