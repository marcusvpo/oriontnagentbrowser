---
id: C-CENTRAL-07
titulo: Inicialização do Integrador Local para Geração e Exportação de Lotes da DOI
tags:
- DOI
- Integrador Local
- Geração de Arquivo
- Receita Federal
- Serviço em Segundo Plano
objetivo: Executar o aplicativo auxiliar Integrador na estação de trabalho para viabilizar a exportação dos arquivos estruturados da DOI.
sinonimos:
- arquivo da doi não gera
- integrador local fechado doi
- botão gerar doi não faz nada
- erro ao exportar lote receita federal
perguntas_usuario:
- Clico em gerar a remessa da DOI e o sistema fica carregando sem baixar o arquivo, como resolver?
- Onde fica o integrador local do Orion TN para geração da DOI?
- Por que a exportação da DOI não cria o arquivo .txt na minha máquina?
sintomas_comuns:
- processamento da DOI trava na barra de status sem concluir a compilação
- ícone do Integrador Orion ausente na barra de tarefas do Windows
- 'mensagem: Falha ao comunicar com o gerador de arquivos local'
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A compilação do arquivo de remessa da DOI no formato oficial exigido pelo software validador da Receita Federal é executada por um binário local na estação do usuário. Se o processo estiver inativo, o lote não é salvo.

#### Passo a passo:
1. Verifique a bandeja do sistema do Windows (Systray ao lado do relógio).
2. Caso o ícone do **Integrador Orion** não esteja visível:
3. Acesse o menu Iniciar do Windows e digite **Integrador Orion** (ou acesse `C:\Siplan\Integrador\Integrador.exe`).
4. Execute o aplicativo como Administrador.
5. Confirme que o ícone passou a ser exibido na bandeja com status conectado.
6. No navegador, retorne ao **Orion TN** em **Administração > Comunicações > DOI**.
7. Selecione o mês de apuração e clique no botão **Gerar e Exportar Lote DOI**.
8. O sistema salvará o arquivo gerado diretamente na pasta de downloads ou diretório parametrizado.

* **Configuração de Inicialização:** Coloque um atalho do Integrador Orion na pasta Inicializar do Windows (`shell:startup`) para que ele suba automaticamente com o computador.
---
