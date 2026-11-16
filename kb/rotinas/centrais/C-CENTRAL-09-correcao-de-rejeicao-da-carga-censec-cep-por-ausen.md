---
id: C-CENTRAL-09
titulo: Correção de Rejeição da Carga CENSEC CEP por Ausência de Código IBGE
tags:
- CENSEC
- CEP
- Escrituras Públicas
- Código IBGE
- Município
objetivo: Sanear cadastros de pessoas e imóveis sem código oficial do IBGE para liberar a transmissão quinzenal da Central de Escrituras Públicas.
sinonimos:
- erro cep censec município
- código ibge inválido censec
- rejeição lote quinzenal cep
- cidade sem código ibge protocolo
perguntas_usuario:
- O lote quinzenal da CEP não transmite acusando erro no município de um dos outorgantes, onde arrumar?
- Como preencher o código IBGE que a CENSEC exige nas escrituras?
- Por que a exportação da CEP diz que o código de localidade está em branco?
sintomas_comuns:
- 'rejeição no validador da CENSEC: Código IBGE do município do outorgante/imóvel ausente ou inválido'
- nome da cidade digitado manualmente sem seleção na lista padronizada do sistema
- lote de escrituras com status de erro na tela de comunicações
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A CENSEC não utiliza o nome textual dos municípios para cruzamento estatístico, mas sim o código de 7 dígitos da tabela oficial do IBGE. Cidades cadastradas sem esse vínculo impedem o envio da carga.

#### Passo a passo:
1. Acesse **Notas > Protocolo** e abra o ato apontado com pendência no log da CEP.
2. Na aba **Partes**, edite o endereço das partes: no campo **Município**, utilize a lupa de busca para selecionar a cidade da lista oficial (o sistema preencherá o código IBGE automaticamente).
3. Na aba **Imóveis**, confira o endereço do bem e repita a seleção assistida do município.
4. Clique no botão **Salvar** do protocolo.
5. Acesse **Comunicações > CENSEC CEP**, selecione a quinzena e clique em **Reprocessar Carga**.
6. Transmita o lote aprovado.

* **Prevenção Cadastral:** Nunca desative o preenchimento automático por CEP dos Correios; ele já amarra o código IBGE correto sem intervenção do digitador.
---
