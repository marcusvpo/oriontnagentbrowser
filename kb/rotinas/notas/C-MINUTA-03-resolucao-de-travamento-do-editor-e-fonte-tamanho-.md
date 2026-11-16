---
id: C-MINUTA-03
titulo: Resolução de Travamento do Editor e Fonte Tamanho 2 por Cópia Externa do Word
tags:
- Editor
- Formatação
- Microsoft Word
- Fonte Tamanho 2
- Histórico de Versões
objetivo: Restaurar minutas travadas ou com fontes desconfiguradas decorrentes da colagem direta de textos formatados do Microsoft Word.
sinonimos:
- fonte tamanho 2 na minuta
- editor travou após colar do word
- minuta corrompida não abre
- limpar formatação externa editor
perguntas_usuario:
- Colei o texto do Word na minuta e a fonte ficou minúscula tamanho 2, como consertar?
- O editor do Orion TN travou e não abre mais a minuta depois que colei um modelo externo, o que fazer?
- Como recuperar uma versão anterior da minuta de escritura que corrompeu?
sintomas_comuns:
- minuta abre com carregamento infinito ou tela congelada
- todo o texto colado assume corpo de fonte minúsculo (tamanho 2) e desconfigura recuos
- injeção de tags incompatíveis de HTML/RichText do Word no documento do sistema
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A área de transferência do Microsoft Word transporta metadados e tags XML proprietárias que entram em conflito com o parser do editor web do Orion TN. Isso pode corromper a árvore DOM do documento.

#### Passo a passo:
1. Para **Restauração de Minuta Travada**:
2. Na aba **Minuta**, clique no botão **Histórico de Versões / Snapshots** na barra de ferramentas.
3. Selecione o snapshot imediatamente anterior à colagem e acione **Restaurar Versão**.
4. Para **Corrigir Fonte Tamanho 2 e Parâmetros Globais**:
5. Acesse **Configurações > Parâmetros Gerais > Editor Orion** e garanta que a **Fonte Padrão** esteja configurada como `Arial` ou `Times New Roman`, tamanho `12`.
6. Para **Colar Textos Externos sem Corromper**:
7. Ao colar do Word ou PDF, utilize obrigatoriamente o atalho `Ctrl + Shift + V` (Colar como Texto Sem Formatação) ou acione o botão **Importar Minuta Externa (.docx)** nativo do Orion TN.
8. Aplique a formatação de negrito e recuo utilizando os botões internos do editor.

* **Regra de Ouro:** Sempre prefira utilizar o botão nativo "Importar Minuta Externa" em vez de copiar e colar blocos extensos de texto via clipboard.
---
