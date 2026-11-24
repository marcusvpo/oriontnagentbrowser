---
id: C-CENTRAL-06
titulo: Adequação de Frações Ideais e Titularidade de Imóveis para Remessa da DOI
tags:
- DOI
- Receita Federal
- Imóveis
- Frações Ideais
- Alienante
- Adquirente
objetivo: Ajustar o preenchimento da aba Imóveis no protocolo notarial garantindo que a soma das frações transmitidas totalize exatamente 100%.
sinonimos:
- erro estrutura alienação doi
- fração ideal não fecha 100 doi
- receita rejeitou arquivo doi
- inconsistência aba imóveis doi
perguntas_usuario:
- O programa validador da Receita Federal rejeita a DOI com erro de estrutura de alienação, onde corrigir?
- Como preencher as frações ideais na aba Imóveis para não dar erro na declaração da DOI?
- O que fazer quando o imóvel foi vendido em partes para mais de um adquirente na DOI?
sintomas_comuns:
- validador da RFB aponta erro de alienante/adquirente sem percentual atribuído
- soma das frações ideais dos adquirentes resulta em valor diferente de 100,00%
- partes não foram marcadas com a flag Titular do Imóvel no cadastro
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A Declaração sobre Operações Imobiliárias (DOI) exige consistência matemática absoluta entre os alienantes e adquirentes do negócio jurídico. Se as porcentagens transmitidas não fecharem a integralidade do quinhão, a remessa é recusada.

#### Passo a passo:
1. No **Orion TN**, abra o protocolo da escritura através de **Notas > Consultas > Protocolos**.
2. Acesse a aba **Imóveis** e clique em **Editar** no bem correspondente.
3. Confira os campos obrigatórios: **Tipo de Imóvel** (Urbano/Rural), **Matrícula**, **Código IBGE** e **Logradouro**.
4. Acesse a sub-aba **Partes do Imóvel / Transmissão**.
5. Selecione os alienantes e adquirentes e marque obrigatoriamente a flag **Titular do Imóvel**.
6. No campo **Fração Transmitida (%)**, preencha com exatidão a porcentagem de cada um (ex.: 50% e 50%, ou 100%).
7. Clique no botão **Gravar Metadados da DOI** dentro da aba e salve o protocolo.
8. Acesse **Comunicações > DOI**, gere novamente a remessa mensal e valide no programa da Receita Federal.

* **Atenção Tributária:** Em cessões parciais de direitos ou fração ideal, a soma das porcentagens alienadas deve ser informada em relação à totalidade do quinhão transmitido.
---
