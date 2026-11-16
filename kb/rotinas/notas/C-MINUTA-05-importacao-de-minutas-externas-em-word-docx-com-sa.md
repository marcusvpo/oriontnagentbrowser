---
id: C-MINUTA-05
titulo: Importação de Minutas Externas em Word (.docx) com Sanitização Automática
tags:
- Editor
- Minuta Word
- Importação Externa
- DOCX
- Sanitização
objetivo: Importar arquivos de texto redigidos externamente no Microsoft Word (.docx) garantindo a conversão correta de fontes e diagramação.
sinonimos:
- importar arquivo docx para minuta
- subir minuta do word
- puxar escritura do word para o sistema
- conversão de arquivo docx orion
perguntas_usuario:
- O advogado mandou a minuta pronta em Word (.docx), como jogar direto para dentro do Orion TN?
- Como importar um documento do Word sem desconfigurar as margens da escritura?
- O sistema aceita carregar arquivos .doc antigos na tela de minuta?
sintomas_comuns:
- escrevente abre o Word em uma janela e o Orion TN em outra para digitar o texto novamente
- tentativa de importar arquivos em formatos legados (`.doc` ou `.rtf`) gerando erro de leitura
- necessidade de preservar negritos e itálicos originais da minuta aprovada pelas partes
video:
  tem_video: false
modulo: notas
modulo_nome: Notas e Escrituras
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A rotina de Importação de Minutas Externas processa o arquivo `.docx` através do parser homologado da Siplan, convertendo estilos do Word em elementos compatíveis com o livro e traslado notarial.

#### Passo a passo:
1. No Microsoft Word, certifique-se de salvar o documento com a extensão moderna **.docx** (se estiver em .doc antigo, use Salvar Como > Documento Word .docx).
2. No **Orion TN**, acesse o protocolo em **Notas > Protocolo**, aba **Minuta / Editor**.
3. Na barra de comandos superior, clique no botão **Importar Minuta Externa**.
4. Selecione o arquivo `.docx` em seu computador.
5. Marque a opção **Preservar Formatação de Estilos Compatíveis**.
6. Clique em **Confirmar Importação**.
7. O Orion TN processará a conversão e carregará o instrumento diretamente no editor, pronto para revisão e colheita de assinaturas.

* **IA e Inovação:** Na versão 6.0 do Orion TN, você pode marcar a opção "Extração Inteligente via IA" para que o sistema cadastre as partes e imóveis contidos no Word sozinho.
---
