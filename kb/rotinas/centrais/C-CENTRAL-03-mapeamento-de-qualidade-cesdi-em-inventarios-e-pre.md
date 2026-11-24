---
id: C-CENTRAL-03
titulo: Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório
tags:
- CENSEC
- CESDI
- Inventário
- Qualidade das Partes
- De Cujus
- Filiação
objetivo: Vincular as participações do protocolo aos papéis obrigatórios exigidos pela CENSEC (CESDI) e preencher campos qualificativos indispensáveis.
sinonimos:
- ato de inventário deve conter herdeiro de cujus
- erro cesdi inventário
- qualidade cesdi não vinculada
- falha censec inventário partes
perguntas_usuario:
- O validador da CESDI rejeita o inventário dizendo que falta advogado, falecido ou herdeiro, como corrigir?
- Onde vinculo a qualidade CESDI no cadastro de participações do Orion TN?
- Erro de filiação nula ou getFather ao transmitir inventário para a CENSEC, o que fazer?
sintomas_comuns:
- 'rejeição CENSEC: O Ato de Inventário deve conter ao menos um advogado, um falecido e um herdeiro'
- 'erro Java ao exportar carga: Cannot invoke String.trim() because getFather() is null'
- partes cadastradas com papel genérico de Outorgante no protocolo
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
O Provimento nº 18 do CNJ estabelece que todo inventário comunicado à CESDI deve possuir identificação explícita do falecido, herdeiros e advogado assistente, além de dados de filiação completa.

#### Passo a passo:
1. No **Orion TN**, acesse **Configurações > Cadastros auxiliares > Participação**.
2. Verifique se as participações estão mapeadas no quadro **Comunicações - Configurações**:
3. Falecido/Autor da Herança ➔ Qualidade CESDI: **De Cujus / Falecido**.
4. Herdeiro/Cônjuge Meiro ➔ Qualidade CESDI: **Herdeiro**.
5. Advogado/Assistente ➔ Qualidade CESDI: **Advogado**.
6. Abra o protocolo do inventário em **Notas > Protocolo**, aba **Partes**.
7. Confira cada participante, garantindo que os papéis acima foram selecionados.
8. Abra o cadastro das pessoas e preencha obrigatoriamente: **Filiação (Pai e Mãe)**, **Data de Nascimento** e **Município com Código IBGE**.
9. Salve o protocolo e retransmita a carga da CESDI.

* **Validação Estrutural:** Em caso de genitor desconhecido, marque expressamente a opção "Pai Não Declarado" no cadastro para não gerar nó nulo no XML.
---
