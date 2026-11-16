---
id: C-CONFIG-08
titulo: Parametrização e Configuração de Nova Estação de Trabalho com Driver ODBC PostgreSQL
tags:
- Nova Estação
- ODBC
- PostgreSQL
- Rede
- Instalação de Terminal
objetivo: Configurar do zero uma nova máquina ou estação recém-formatada para operar com o Orion TN, instalando drivers ODBC e apontando conexões para o banco de dados do servidor.
sinonimos:
- instalar orion em máquina nova
- configurar terminal recém formatado
- erro de conexão com banco de dados odbc postgresql
- apontar ip do servidor no sistema
perguntas_usuario:
- Chegou um computador novo para a escrevente, como faço para instalar e conectar ele no servidor do cartório?
- A máquina foi formatada e o Orion dá erro de ODBC ao tentar conectar, qual driver está faltando?
- Onde configuro o endereço de IP do servidor no arquivo de configuração do sistema?
sintomas_comuns:
- 'mensagem "Erro ao inicializar conexão: Driver ODBC PostgreSQL não encontrado no sistema operacional"'
- tela de login não abre e retorna falha de handshake de socket com o banco na porta 5432
- falta de permissão na pasta de instalação compartilhada na rede local
video:
  tem_video: false
modulo: config
modulo_nome: Configurações, Impressão e Parâmetros
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Para que uma estação de trabalho execute o Orion TN, o ambiente Windows deve dispor do driver de comunicação ODBC do PostgreSQL na arquitetura de 32 bits (compatível com a compilação do executável), bibliotecas de runtime do Visual C++ e o arquivo de parametrização de rede (`siplan.ini`) configurado com o IP estático e porta do servidor local da serventia.

#### Passo a passo:
1. Na nova máquina, baixe e instale os pacotes de pré-requisitos: **Visual C++ Redistributable (x86)** e o instalador do driver **PostgreSQL ODBC Driver (psqlodbc 32 bits)**.
2. No Windows, abra o **Administrador de Fonte de Dados ODBC (32 bits)** (`odbcad32.exe`), acesse a aba **Drivers** e certifique-se de que conste o driver `PostgreSQL Unicode`.
3. Crie a pasta de destino local `C:\Siplan\OrionTN` ou conecte-se ao compartilhamento de rede mapeado do servidor (`\\[IP-SERVIDOR]\Siplan`).
4. Abra o arquivo `siplan.ini` na pasta de configuração e confirme os parâmetros de conectividade:
    - `Servidor=[IP-FIXO-DO-SERVIDOR]` (ex: `192.168.1.100`)
    - `Porta=5432`
    - `Banco=oriontn_db`
    - `Protocolo=TCP/IP`.
5. Crie o atalho do executável `OrionTN.exe` na Área de Trabalho.
6. Clique com o botão direito no atalho > **Propriedades** > **Compatibilidade** e marque **Executar este programa como administrador**.
7. Abra o sistema e efetue o primeiro login com um usuário válido para validar a replicação das tabelas.

* **Dica:** Fixe sempre um endereço IP estático no servidor do cartório para evitar que quedas de energia no roteador alterem o IP atribuído e derrubem a conexão de todos os terminais.
---
