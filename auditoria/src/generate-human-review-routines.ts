import fs from 'node:fs';
import path from 'node:path';
import { ENVIRONMENT_BLOCK_TYPE, REVIEW_TAGS, reviewHeadline } from './review-taxonomy.js';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));

interface HumanReviewRoutine {
  id: string;
  slug: string;
  modulo: string;
  titulo: string;
  tipoBloqueio: string;
  motivoTecnico: string;
  passosRevisao: string[];
}

const HUMAN_ROUTINES: HumanReviewRoutine[] = [
  {
    id: 'C-ACESSO-05',
    slug: 'falha-de-conexao-com-o-servico-docker-do-modulo-sga',
    modulo: 'acesso',
    titulo: 'Falha de Conexão com o Serviço Docker do Módulo SGA',
    tipoBloqueio: 'Serviço de Infraestrutura / Container Docker',
    motivoTecnico: 'Demanda acesso ao host Linux/Windows onde o container do SGA roda, verificação de portas 8080/8443 e comando docker restart sga-service.',
    passosRevisao: [
      'Acessar o terminal do servidor de aplicação via SSH ou PowerShell administrativo.',
      'Executar `docker ps -a | grep sga` para inspecionar o status do container.',
      'Checar logs com `docker logs --tail 100 sga-service` identificando possíveis falhas de memória ou lock de porta.',
      'Reiniciar o container com `docker restart sga-service` e validar se a API interna responde HTTP 200.'
    ]
  },
  {
    id: 'C-CONFIG-01',
    slug: 'substituicao-e-configuracao-de-novo-certificado-digital-a1',
    modulo: 'config',
    titulo: 'Substituição e Configuração de Novo Certificado Digital A1 no Orion TN, SEFAZ e SIGNO',
    tipoBloqueio: 'Arquivo Físico Privado (.pfx) / Senha de Cartório',
    motivoTecnico: 'Requer upload de arquivo .pfx criptografado real e digitação da senha privada do titular/serventia, impossível de simular com dados fictícios.',
    passosRevisao: [
      'Obter o arquivo criptográfico `.pfx` ou `.p12` emitido por Autoridade Certificadora ICP-Brasil.',
      'Acessar **Configurações > Certificados Digitais**.',
      'Fazer o upload manual do arquivo e informar a senha privada de instalação.',
      'Validar o status do certificado (Válido até DD/MM/AAAA) e testar a comunicação com a SEFAZ estadual e o portal SIGNO.'
    ]
  },
  {
    id: 'C-CONFIG-02',
    slug: 'calibracao-de-sensor-gap-e-ajuste-de-midia-em-impressoras-termicas',
    modulo: 'config',
    titulo: 'Calibração de Sensor Gap e Ajuste de Mídia em Impressoras Térmicas (Zebra / Argox / Elgin)',
    tipoBloqueio: 'Hardware Periférico / Sensor Óptico Físico',
    motivoTecnico: 'Envolve procedimentos mecânicos no painel da impressora (Pause + Feed) e alinhamento do sensor de espaçamento (GAP) entre etiquetas físicas.',
    passosRevisao: [
      'Desligar a impressora térmica no botão traseiro.',
      'Pressionar e segurar o botão **FEED** (ou **PAUSE** conforme o modelo) e ligar o equipamento.',
      'Aguardar o avanço de 3 etiquetas em branco até o LED estabilizar na cor verde fixa.',
      'No Orion TN, acesse **Configurações > Modelos de Impressão** e envie um teste de impressão para validar o corte sobre o picote.'
    ]
  },
  {
    id: 'C-CONFIG-03',
    slug: 'ajuste-fino-de-margens-e-deslocamento-x-e-y-na-impressao-de-etiquetas',
    modulo: 'config',
    titulo: 'Ajuste Fino de Margens e Deslocamento X e Y na Impressão de Etiquetas',
    tipoBloqueio: 'Hardware Periférico / Calibração com Régua Física',
    motivoTecnico: 'Necessita medição manual milimétrica do papel impresso na serventia e calibração de offsets X e Y no driver ZDesigner ou Generic Text.',
    passosRevisao: [
      'Imprimir uma etiqueta de teste de reconhecimento de firma ou selo.',
      'Medir com régua o desvio em milímetros da margem superior (Y) e esquerda (X).',
      'No Orion TN, acessar **Configurações > Modelos de Impressão > Ajuste Fino**.',
      'Compensar os milímetros positivos ou negativos e reimprimir até o enquadramento perfeito.'
    ]
  },
  {
    id: 'C-CONFIG-04',
    slug: 'desbloqueio-de-spooler-do-windows-e-configuracao-de-porta-raw',
    modulo: 'config',
    titulo: 'Desbloqueio de Spooler do Windows e Configuração de Porta RAW para Impressão Rápida',
    tipoBloqueio: 'Sistema Operacional Windows / services.msc',
    motivoTecnico: 'Demanda intervenção direta no Windows da estação local: parar serviço `spooler`, limpar arquivos temporários em `System32\\spool\\PRINTERS` e reiniciar.',
    passosRevisao: [
      'Abrir o prompt de comando como Administrador na estação do escrevente.',
      'Executar `net stop spooler` para interromper a fila travada.',
      'Excluir todos os arquivos `.shd` e `.spl` dentro da pasta `C:\\Windows\\System32\\spool\\PRINTERS`.',
      'Executar `net start spooler` e conferir se as impressões do Orion TN voltam a fluir imediatamente.'
    ]
  },
  {
    id: 'C-CONFIG-05',
    slug: 'instalacao-e-integracao-de-scanner-de-cartao-de-autógrafo-via-docuvieware',
    modulo: 'config',
    titulo: 'Instalação e Integração de Scanner de Cartão de Autógrafo via DocuVieware e TWAIN',
    tipoBloqueio: 'Driver TWAIN / Periférico USB Físico',
    motivoTecnico: 'Requer scanner de mesa/alimentador USB conectado fisicamente (ex: Fujitsu fi-series, Canon) e driver TWAIN 32-bit ativo no Windows.',
    passosRevisao: [
      'Conectar o scanner à porta USB 3.0 direta do computador.',
      'Instalar o driver oficial TWAIN fornecido pelo fabricante.',
      'Iniciar o serviço **IntegradorSPCM** na bandeja do sistema.',
      'No Orion TN, acessar a captura de biometria/cartão e validar se a fonte de digitalização TWAIN é listada e responde ao comando de scan.'
    ]
  },
  {
    id: 'C-CONFIG-06',
    slug: 'resolucao-de-falha-no-scanner-com-mensagem-de-dispositivo-ocupado-ou-travado',
    modulo: 'config',
    titulo: 'Resolução de Falha no Scanner com Mensagem de Dispositivo Ocupado ou Travado',
    tipoBloqueio: 'Driver de Hardware / Processos Órfãos no SO',
    motivoTecnico: 'Processo de escaneamento em segundo plano retém a porta USB; requer matar o processo via Gerenciador de Tarefas ou reiniciar o serviço TWAIN.',
    passosRevisao: [
      'Abrir o Gerenciador de Tarefas (`Ctrl + Shift + Esc`).',
      'Localizar e encerrar processos órfãos de captura (ex: `DocuViewareServer.exe`, `twain.exe`, `integrador.exe`).',
      'Desconectar e reconectar o cabo USB do scanner.',
      'Reabrir o Orion TN e acionar a captura novamente.'
    ]
  },
  {
    id: 'C-CONFIG-07',
    slug: 'desbloqueio-de-processos-orfaos-retendo-locks-de-dados-no-postgresql',
    modulo: 'config',
    titulo: 'Desbloqueio de Processos Órfãos Retendo Locks de Dados no Banco PostgreSQL',
    tipoBloqueio: 'Banco de Dados Interno / DBA Siplan',
    motivoTecnico: 'Demanda acesso ao PostgreSQL com usuário postgres para rodar `pg_terminate_backend()` em transações travadas que geram erro de timeout na tela.',
    passosRevisao: [
      'Acessar o pgAdmin ou terminal `psql` no servidor de banco de dados.',
      'Executar a consulta de verificação de bloqueios: `SELECT pid, query, state, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != \'idle\';`',
      'Identificar o processo travado que segura locks em tabelas de protocolos ou caixas.',
      'Encerrar a sessão com `SELECT pg_terminate_backend(<PID>);`.'
    ]
  },
  {
    id: 'C-CONFIG-08',
    slug: 'parametrizacao-e-configuracao-de-nova-estacao-de-trabalho-com-driver-odbc',
    modulo: 'config',
    titulo: 'Parametrização e Configuração de Nova Estação de Trabalho com Driver ODBC e Fontes Siplan',
    tipoBloqueio: 'Instalação de Pacotes no Windows / Fontes de Sistema',
    motivoTecnico: 'Requer instalação local do driver PostgreSQL ODBC 64-bit, configuração de DSN no Windows e instalação dos arquivos de fontes tipográficas (Oswald, Lato).',
    passosRevisao: [
      'Instalar o driver PostgreSQL ODBC 64/32-bit na máquina do usuário.',
      'Configurar o DSN de sistema no `odbcad32.exe` apontando para o host de banco do cartório.',
      'Instalar as fontes institucionais Siplan na pasta `C:\\Windows\\Fonts`.',
      'Instalar o cliente do Integrador SPCM para comunicação com impressoras e scanners.'
    ]
  },
  {
    id: 'V-2.3.2',
    slug: 'gestao-de-valores-extranotariais-e-cadastro-de-novos-servicos-de-despesas',
    modulo: 'config',
    titulo: 'Gestão de Valores Extranotariais e Cadastro de Novos Serviços de Despesas',
    tipoBloqueio: 'Regra de Negócio com Reflexo Fiscal Restrito',
    motivoTecnico: 'Configuração com impacto direto na prestação de contas do cartório, livro caixa e emissão de notas fiscais; requer parametrização contábil assistida.',
    passosRevisao: [
      'No Orion TN, acesse **Configurações > Tabela de Custas > Extranotariais**.',
      'Conferir com o setor financeiro da serventia os tipos de despesas reembolsáveis autorizados pela Corregedoria Geral.',
      'Cadastrar o novo item definindo a alíquota de ISS e se o valor é repassado integralmente.',
      'Realizar lançamento em protocolo de teste para conferir a separação das custas na guia de depósito prévio.'
    ]
  }
];

async function main() {
  console.log('================================================================');
  console.log('  CRIANDO ROTINAS DE REVISÃO HUMANA COM TAG VISUAL [DDD] (ADR-021, antes [!!!])');
  console.log('================================================================\n');

  for (const r of HUMAN_ROUTINES) {
    // ADR-021: hardware/infra/ambiente é dependência que o banco/ambiente de homologação não supre -> [DDD]
    const prefix = REVIEW_TAGS.dependencia_dados_banco.prefix;
    const folderName = `${prefix}${r.id}-${r.slug}`;
    const fileName = `${prefix}${r.id}-${r.slug}-revisado.md`;
    const folderPath = path.join(auditoriaRoot, 'rotinas', r.modulo, folderName);

    // Migração: a pasta com o prefixo legado [!!!] da mesma rotina é substituída
    const legacyPath = path.join(auditoriaRoot, 'rotinas', r.modulo, `[!!!] ${r.id}-${r.slug}`);
    if (fs.existsSync(legacyPath)) {
      fs.rmSync(legacyPath, { recursive: true, force: true });
      console.log(`  (migrada) pasta legada removida: ${path.basename(legacyPath)}`);
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const mdContent = `---
id: ${r.id}
titulo: '${r.titulo}'
modulo: ${r.modulo}
secao: ${r.id.split('-')[0]}
auditoria_ui:
  data_execucao: '2026-11-11'
  status: dependencia_dados_banco
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  tipo_bloqueio: '${ENVIRONMENT_BLOCK_TYPE}'
  prints_geradas: 0
---

> [!CAUTION]
> **${reviewHeadline('dependencia_dados_banco')}:**
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **${r.tipoBloqueio.toLowerCase()}** (${ENVIRONMENT_BLOCK_TYPE}).
>
> **Motivo Técnico:** ${r.motivoTecnico}

#### Descrição:
${r.titulo}. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
${r.passosRevisao.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (${r.modulo}), o código da rotina e o comportamento observado no ambiente de produção.
`;

    fs.writeFileSync(path.join(folderPath, fileName), mdContent, 'utf8');
    console.log(`✓ Criada pasta e arquivo: auditoria/rotinas/${r.modulo}/${folderName}/${fileName}`);
  }

  console.log('\n================================================================');
  console.log('  TODAS AS 10 ROTINAS DE REVISÃO HUMANA ESTRUTURADAS COM SUCESSO!  ');
  console.log('================================================================\n');
}

main().catch(console.error);
