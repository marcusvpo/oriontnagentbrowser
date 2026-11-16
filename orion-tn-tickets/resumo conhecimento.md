🧠 Principais Conhecimentos Extraídos pelas Auditorias dos Subagentes

Os 3 subagentes especializados auditaram a base e destacaram as soluções operacionais de maior valor que o Assistente de IA do Orion TN deve dominar:

🏛️ Módulo de Centrais Notariais (COAF, CENSEC, DOI e Selos)
Qualidade CESDI em Inventários: O erro "Ato de Inventário deve conter ao menos um advogado, um falecido e um herdeiro" decorre da falta de vínculo da "Qualidade CESDI" no cadastro de participações (Configurações > Cadastros auxiliares > Participação > Bloco Comunicações - Configurações).
Caracteres Especiais no COAF: Mensagens de erro de schema XML no COAF e SISCOAF decorrem de apóstrofos em nomes de municípios (ex: Santa Bárbara D'Oeste), aspas curvas copiadas do Word ou quebras de linha (\r\n) no campo de informações adicionais.
Pessoa Obrigada no SISCOAF: O erro "CPF não vinculado a uma Pessoa Obrigada ativa" ocorre quando o preposto que envia a carga não foi previamente habilitado pelo Tabelião titular dentro do portal oficial do SISCOAF.
Impossibilidade de Reutilizar Selo Digital Cancelado: Selos digitais já transmitidos ao Tribunal de Justiça não podem ser apagados nem reutilizados em outros atos; deve-se emitir a Retificação de Selo (tipo XA).
Divergência de Selos e Webservice Offline: Erros de divergência de recolhimento semanal com o portal do TJ decorrem de selos acumulados em fila local pendente (modo offline) ou duplicidade por timeout de webservice.

💰 Módulo Financeiro, Caixa e Lavratura
Regra do Estorno Encadeado: Quando um recibo não permite estorno, o operador deve seguir a ordem estrita: Estorno da Guia de Recolhimento Definitiva (PEX) ➔ Estorno do Recibo (OrionCaixa) ➔ Alteração no Protocolo ➔ Novo Pagamento no Caixa.
Conciliação Caixa vs. LCW (Livro Diário/Sinoreg): Divergências entre o fechamento de caixa e o LCW decorrem de atos lavrados em uma data anterior cujo pagamento foi lançado em data posterior; o ajuste requer estornar e reprocessar o recebimento com a data original do serviço.
Ativação da Rotina de Notas no Caixa: Se atos de notas não aparecem na conferência de caixa, a flag "Ativar rotina - Notas" precisa ser habilitada nas opções do OrionCaixa.
NFS-e / Emissor Nacional e Novas Regras: Erros de rejeição de RPS na transição para o Emissor Nacional decorrem da falta de parametrização da Classificação Tributária padrão / CST ou ausência de tomador identificado em atos de balcão de Firmas.
Etiquetas de Ressalva em Livros de Termos: Quando um termo encadernado contém erro de grafia, utiliza-se a rotina de "Impressão de Etiqueta de Ressalva" com "Reutilização da Folha do Termo", preservando a folha sem violar as normas da Corregedoria.

⚙️ Módulo de Modelos, Permissões e Periféricos
Cache de Permissões de Usuário: Alterações de perfil ou liberação de rotinas no Orion TN exigem obrigatoriamente logoff e novo login do escrevente, pois as permissões são carregadas na memória da sessão no momento do logon.
Erro de Modelo Padrão de Qualificação: A mensagem "Modelo Padrão para tipo [Editor - Qualificações de partes] não configurado" na quase totalidade das vezes não indica falta do modelo, mas sim falta de permissão de acesso ao modelo concedida ao usuário.
Formatação no Editor OrionTN: Colar textos diretos do Microsoft Word injeta tags HTML/RichText incompatíveis que causam travamento da minuta; deve-se utilizar a rotina nativa de importação de minutas.
Impressoras Térmicas (Zebra / Elgin): Ao instalar novas impressoras no Windows, o operador deve clicar no botão "Atualizar" dentro do Orion TN para que o sistema reconheça a nova fila de impressão do sistema operacional.