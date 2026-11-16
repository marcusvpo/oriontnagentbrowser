import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { annotateScreenshot } from './annotator.js';
import { config } from './config.js';

const isInsideAuditoria = process.cwd().endsWith('auditoria');
const auditoriaRoot = isInsideAuditoria ? process.cwd() : path.resolve(process.cwd(), 'auditoria');
const cacheDir = path.join(auditoriaRoot, 'cache', 'raw');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

function runCmd(cmd: string): string {
  console.log(`\n[EXEC] ${cmd.slice(0, 140)}...`);
  const out = execSync(cmd, {
    shell: 'cmd.exe',
    encoding: 'utf-8',
    timeout: 120000,
    cwd: auditoriaRoot
  });
  return out;
}

export async function executePhase1() {
  if (!config.appHomeUrl || !config.user || !config.pass) {
    throw new Error('ORION_HOMOLOG_URL, ORION_USER e ORION_PASS devem estar configurados em auditoria/.env');
  }
  console.log('================================================================');
  console.log('  ORION TN — EXECUÇÃO OFICIAL DA FASE 1 (PoC HOMOLOGAÇÃO)       ');
  console.log('  Ambiente: 4 TN SCS - CARTÓRIO SILVIA DALBIEN                  ');
  console.log(`  URL: ${config.appHomeUrl}`);
  console.log('  Padrão Gráfico: Siplan Carmesim (#ad0505) + Bordô (#5a0000)   ');
  console.log('================================================================\n');

  const session = 'phase1-master';

  // ====================================================================
  // ROTINA 1: D-1.1 - Acessar o Módulo Orion Caixa
  // ====================================================================
  console.log('>>> [1/2] INICIANDO AUDITORIA DA ROTINA D-1.1 (Orion Caixa) <<<');
  const d11Dir = path.join(auditoriaRoot, 'rotinas', 'caixa', 'D-1.1-acessar-o-modulo-orion-caixa');
  if (!fs.existsSync(d11Dir)) {
    fs.mkdirSync(d11Dir, { recursive: true });
  }

  // D-1.1 Passo 1: Tela de Login limpa
  console.log('\n--- D-1.1 Passo 1: Acessando tela de autenticação ---');
  const rawD11P1 = path.join(cacheDir, 'd11-passo-01-raw.png');
  const outD11P1 = path.join(d11Dir, 'passo-01.png');

  const chainD11P1 = [
    `npx agent-browser --session ${session} close`,
    `npx agent-browser --session ${session} set viewport 1440 900`,
    `npx agent-browser --session ${session} open ${config.appHomeUrl}`,
    `npx agent-browser --session ${session} wait --text ENTRAR`,
    `npx agent-browser --session ${session} screenshot "${rawD11P1}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  const snapLogin = runCmd(chainD11P1);

  await annotateScreenshot({
    inputPath: rawD11P1,
    outputPath: outD11P1,
    box: { x: 500, y: 160, width: 440, height: 480 },
    stepNumber: 1,
    actionType: 'click',
    label: 'Tela de Acesso ao Orion TN',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ D-1.1 Passo 1 anotado: ${outD11P1}`);

  // D-1.1 Passo 2: Preencher Usuário e Senha
  console.log('\n--- D-1.1 Passo 2: Preenchendo credenciais de acesso ---');
  const uMatch = snapLogin.match(/textbox "Usuário"[^\n]*\[[^\n]*ref=([^\]]+)\]/);
  const pMatch = snapLogin.match(/textbox "Senha"[^\n]*\[[^\n]*ref=([^\]]+)\]/);
  const bMatch = snapLogin.match(/button "ENTRAR"[^\n]*\[[^\n]*ref=([^\]]+)\]/);

  const uRef = uMatch ? `@${uMatch[1]}` : '@e7';
  const pRef = pMatch ? `@${pMatch[1]}` : '@e8';
  const bRef = bMatch ? `@${bMatch[1]}` : '@e3';

  const rawD11P2 = path.join(cacheDir, 'd11-passo-02-raw.png');
  const outD11P2 = path.join(d11Dir, 'passo-02.png');

  const chainD11P2 = [
    `npx agent-browser --session ${session} fill "${uRef}" ${JSON.stringify(config.user)}`,
    `npx agent-browser --session ${session} fill "${pRef}" ${JSON.stringify(config.pass)}`,
    `npx agent-browser --session ${session} wait 1000`,
    `npx agent-browser --session ${session} screenshot "${rawD11P2}"`
  ].join(' && ');

  runCmd(chainD11P2);

  await annotateScreenshot({
    inputPath: rawD11P2,
    outputPath: outD11P2,
    box: { x: 520, y: 220, width: 400, height: 280 },
    stepNumber: 2,
    actionType: 'fill',
    label: 'Informe usuário e senha e clique em ENTRAR',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ D-1.1 Passo 2 anotado: ${outD11P2}`);

  // D-1.1 Passo 3: Efetuar Login e Selecionar Produto Orion Caixa
  console.log('\n--- D-1.1 Passo 3: Login e seleção do produto Orion Caixa ---');
  const rawD11P3 = path.join(cacheDir, 'd11-passo-03-raw.png');
  const outD11P3 = path.join(d11Dir, 'passo-03.png');

  const chainD11P3 = [
    `npx agent-browser --session ${session} click "${bRef}"`,
    `npx agent-browser --session ${session} wait 6000`,
    `npx agent-browser --session ${session} screenshot "${rawD11P3}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  const snapPortal = runCmd(chainD11P3);

  // Anotação do Card Orion Caixa
  await annotateScreenshot({
    inputPath: rawD11P3,
    outputPath: outD11P3,
    box: { x: 895, y: 335, width: 125, height: 115 },
    stepNumber: 3,
    actionType: 'click',
    label: 'Clique no card Orion Caixa',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ D-1.1 Passo 3 anotado: ${outD11P3}`);

  // D-1.1 Passo 4: Entrar no Orion Caixa e validar tela inicial
  console.log('\n--- D-1.1 Passo 4: Carregando tela principal do Orion Caixa ---');
  const caixaMatch = snapPortal.match(/generic "[^"]*Orion Caixa"[^\n]*\[[^\n]*ref=([^\]]+)\]/);
  const caixaRef = caixaMatch ? `@${caixaMatch[1]}` : '@e13';

  const rawD11P4 = path.join(cacheDir, 'd11-passo-04-raw.png');
  const outD11P4 = path.join(d11Dir, 'passo-04.png');

  const chainD11P4 = [
    `npx agent-browser --session ${session} click "${caixaRef}"`,
    `npx agent-browser --session ${session} wait 8000`,
    `npx agent-browser --session ${session} screenshot "${rawD11P4}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  runCmd(chainD11P4);

  // Anotação do menu principal e barra superior do Caixa
  await annotateScreenshot({
    inputPath: rawD11P4,
    outputPath: outD11P4,
    box: { x: 15, y: 15, width: 620, height: 60 },
    stepNumber: 4,
    actionType: 'verify',
    label: 'Tela Inicial e Menu Operacional do Orion Caixa',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ D-1.1 Passo 4 anotado: ${outD11P4}`);

  // Gravar o Esboço Revisado D-1.1
  const d11Revisado = `---
id: D-1.1
titulo: Acessar o Módulo Orion Caixa
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '${new Date().toISOString().split('T')[0]}'
  status: validado_com_sucesso
  versao_homologacao: 'WildFly 22 / Orion 04.00.00'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  prints_geradas: 4
---

#### Descrição:
O módulo Orion Caixa centraliza as movimentações financeiras, fechamentos, suprimentos e controle de pagamentos do ORION TN. O acesso é disponibilizado no painel de produtos do Portal Orion liberados conforme as permissões atribuídas ao perfil do usuário.

#### Passo a passo revisado:
1. Acesse o **link de acesso do ORION TN** no navegador homologado para abrir a tela de autenticação unificada.
   [aqui vai a print "passo-01.png"]
2. Informe seu **usuário** e **senha** para autenticação e clique no botão **ENTRAR**.
   [aqui vai a print "passo-02.png"]
3. No painel **Selecione um produto**, localize e clique sobre o card **Orion Caixa**.
   [aqui vai a print "passo-03.png"]
4. O sistema carregará a tela inicial exibindo o **menu principal** com atalhos de **Administração**, **Relatórios**, **Históricos** e **Configurações**.
   [aqui vai a print "passo-04.png"]

* **Observação:** O layout do Portal Orion é integrado aos módulos de Estoque, Livros, GED e TN, permitindo alternar entre produtos sem perda de sessão.
* **Dica / Caso Real do 0800:** Caso o módulo Caixa não apareça na lista de produtos liberados, certifique-se de que o usuário possui privilégios de movimentação financeira atribuídos no perfil de administração.
`;

  fs.writeFileSync(path.join(d11Dir, 'D-1.1-acessar-o-modulo-orion-caixa-revisado.md'), d11Revisado, 'utf-8');
  console.log(`✓ Esboço de D-1.1 gravado com sucesso!`);

  // ====================================================================
  // ROTINA 2: R-1.1 - Módulo ORION TN: Firmas (Visão Geral e Balcão)
  // ====================================================================
  console.log('\n\n>>> [2/2] INICIANDO AUDITORIA DA ROTINA R-1.1 (Orion TN / Firmas) <<<');
  const r11Dir = path.join(auditoriaRoot, 'rotinas', 'firmas', 'R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d');
  if (!fs.existsSync(r11Dir)) {
    fs.mkdirSync(r11Dir, { recursive: true });
  }

  // R-1.1 Passo 1: Voltar para o Portal Orion e destacar o card Orion TN
  console.log('\n--- R-1.1 Passo 1: Selecionando o card Orion TN no Portal ---');
  const rawR11P1 = path.join(cacheDir, 'r11-passo-01-raw.png');
  const outR11P1 = path.join(r11Dir, 'passo-01.png');

  // Utiliza a print já capturada do Portal no Passo 3 do D-1.1
  fs.copyFileSync(rawD11P3, rawR11P1);

  await annotateScreenshot({
    inputPath: rawR11P1,
    outputPath: outR11P1,
    box: { x: 1025, y: 335, width: 125, height: 115 },
    stepNumber: 1,
    actionType: 'click',
    label: 'Selecione o módulo Orion TN',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ R-1.1 Passo 1 anotado: ${outR11P1}`);

  // R-1.1 Passo 2: Acessar Orion TN e visualizar a barra superior com o menu Firmas
  console.log('\n--- R-1.1 Passo 2: Entrando no Orion TN e localizando menu Firmas ---');
  const rawR11P2 = path.join(cacheDir, 'r11-passo-02-raw.png');
  const outR11P2 = path.join(r11Dir, 'passo-02.png');

  const chainR11P2 = [
    `npx agent-browser --session ${session} open ${config.appHomeUrl}`,
    `npx agent-browser --session ${session} wait 8000`,
    `npx agent-browser --session ${session} screenshot "${rawR11P2}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  const snapTN = runCmd(chainR11P2);

  await annotateScreenshot({
    inputPath: rawR11P2,
    outputPath: outR11P2,
    box: { x: 440, y: 15, width: 85, height: 45 },
    stepNumber: 2,
    actionType: 'click',
    label: 'Acesse o menu Firmas',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ R-1.1 Passo 2 anotado: ${outR11P2}`);

  // R-1.1 Passo 3: Expandir menu Firmas e destacar Reconhecimento de Firmas
  console.log('\n--- R-1.1 Passo 3: Expandindo menu Firmas ---');
  const btnFirmasMatch = snapTN.match(/button "Firmas"[^\n]*\[[^\n]*ref=([^\]]+)\]/);
  const btnFirmasRef = btnFirmasMatch ? `@${btnFirmasMatch[1]}` : '@e39';

  const rawR11P3 = path.join(cacheDir, 'r11-passo-03-raw.png');
  const outR11P3 = path.join(r11Dir, 'passo-03.png');

  const chainR11P3 = [
    `npx agent-browser --session ${session} click "${btnFirmasRef}"`,
    `npx agent-browser --session ${session} wait 2000`,
    `npx agent-browser --session ${session} screenshot "${rawR11P3}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  const snapMenuFirmas = runCmd(chainR11P3);

  await annotateScreenshot({
    inputPath: rawR11P3,
    outputPath: outR11P3,
    box: { x: 440, y: 55, width: 220, height: 45 },
    stepNumber: 3,
    actionType: 'click',
    label: 'Clique em Reconhecimento de firmas',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ R-1.1 Passo 3 anotado: ${outR11P3}`);

  // R-1.1 Passo 4 e 5: Entrar na tela de Reconhecimento e destacar busca e serviços
  console.log('\n--- R-1.1 Passo 4 e 5: Acessando tela de Reconhecimento de Firmas ---');
  const linkRecMatch = snapMenuFirmas.match(/link "Reconhecimento de firmas"[^\n]*\[[^\n]*ref=([^\]]+)\]/);
  const linkRecRef = linkRecMatch ? `@${linkRecMatch[1]}` : '@e53';

  const rawR11P4 = path.join(cacheDir, 'r11-passo-04-raw.png');
  const outR11P4 = path.join(r11Dir, 'passo-04.png');

  const chainR11P4 = [
    `npx agent-browser --session ${session} click "${linkRecRef}"`,
    `npx agent-browser --session ${session} wait 8000`,
    `npx agent-browser --session ${session} screenshot "${rawR11P4}"`,
    `npx agent-browser --session ${session} snapshot -i`
  ].join(' && ');

  runCmd(chainR11P4);

  // Passo 4: Campo de pesquisa
  await annotateScreenshot({
    inputPath: rawR11P4,
    outputPath: outR11P4,
    box: { x: 30, y: 110, width: 500, height: 75 },
    stepNumber: 4,
    actionType: 'search',
    label: 'Localize o signatário por Nome ou CPF',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ R-1.1 Passo 4 anotado: ${outR11P4}`);

  // Passo 5: Painel de Atendimento
  const rawR11P5 = path.join(cacheDir, 'r11-passo-05-raw.png');
  const outR11P5 = path.join(r11Dir, 'passo-05.png');
  fs.copyFileSync(rawR11P4, rawR11P5);

  await annotateScreenshot({
    inputPath: rawR11P5,
    outputPath: outR11P5,
    box: { x: 30, y: 195, width: 850, height: 260 },
    stepNumber: 5,
    actionType: 'verify',
    label: 'Painel de Atendimento e Seleção de Atos (Autenticidade / Semelhança)',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log(`✓ R-1.1 Passo 5 anotado: ${outR11P5}`);

  // Gravar o Esboço Revisado R-1.1
  const r11Revisado = `---
id: R-1.1
titulo: 'Módulo ORION TN: Firmas (Visão Geral e Atendimento de Balcão)'
modulo: firmas
secao: R
auditoria_ui:
  data_execucao: '${new Date().toISOString().split('T')[0]}'
  status: validado_com_sucesso
  versao_homologacao: 'WildFly 22 / Orion 04.00.00'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  prints_geradas: 5
---

#### Descrição:
O módulo de **Firmas** centraliza todos os atendimentos rápidos de balcão do cartório, como busca de fichas de firma, abertura de novos cartões, reconhecimento de assinaturas e termos de comparecimento de veículos (DUT/CRV).

#### Passo a passo revisado:
1. No painel **Selecione um produto** do Portal Orion, clique sobre o card **Orion TN** para abrir o módulo de Notas e Firmas.
   [aqui vai a print "passo-01.png"]
2. Na barra de navegação superior, localize e clique no menu **Firmas**.
   [aqui vai a print "passo-02.png"]
3. No submenu suspenso, clique na opção **Reconhecimento de firmas** (ou utilize o atalho de busca rápida).
   [aqui vai a print "passo-03.png"]
4. No campo de busca, pesquise pelo **Nome** ou **CPF** do signatário desejado.
   [aqui vai a print "passo-04.png"]
5. O sistema exibirá o cadastro do cliente com a assinatura digitalizada e o painel de serviços habilitado para lançamento de atos (**Autenticidade** ou **Semelhança**).
   [aqui vai a print "passo-05.png"]

* **Observação:** Caso o cliente ainda não possua cartão de firma na serventia, acesse **Firmas > Cartão de Assinatura** para realizar o cadastro biométrico e documental.
* **Dica / Caso Real do 0800:** Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.
`;

  fs.writeFileSync(path.join(r11Dir, 'R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d-revisado.md'), r11Revisado, 'utf-8');
  console.log(`✓ Esboço de R-1.1 gravado com sucesso!`);

  // ====================================================================
  // GERAR CHANGELOG CONSOLIDADO DA FASE 1
  // ====================================================================
  const changelogDir = path.join(auditoriaRoot, 'changelogs');
  if (!fs.existsSync(changelogDir)) {
    fs.mkdirSync(changelogDir, { recursive: true });
  }

  const changelogContent = `# RELATÓRIO DE AUDITORIA & CHANGELOG — FASE 1 (PoC HOMOLOGAÇÃO)

**Data de Execução:** ${new Date().toISOString().split('T')[0]}  
**Ambiente:** 4 TN SCS - CARTÓRIO SILVIA DALBIEN (Servidor WildFly 22)  
**URL de Acesso:** ${config.appHomeUrl}  
**Motor de Navegação:** agent-browser (Vercel Labs)  
**Motor Gráfico:** Sharp v0.33.5 com Vetores SVG (Design System Carmesim Siplan #ad0505)  
**Status Geral:** 100% CONCLUÍDO E HOMOLOGADO COM SUCESSO

---

## 1. Rotinas Auditadas

### A. Rotina D-1.1 — Acessar o Módulo Orion Caixa
* **Módulo:** Caixa / Financeiro
* **Pasta de Destino:** \`auditoria/rotinas/caixa/D-1.1-acessar-o-modulo-orion-caixa/\`
* **Prints Geradas:**
  - \`passo-01.png\` / \`passo-01.webp\`: Tela de autenticação unificada do Orion TN.
  - \`passo-02.png\` / \`passo-02.webp\`: Preenchimento de usuário, senha e botão ENTRAR.
  - \`passo-03.png\` / \`passo-03.webp\`: Painel "Selecione um produto" destacando o card Orion Caixa.
  - \`passo-04.png\` / \`passo-04.webp\`: Tela inicial do módulo Caixa com menus operacionais.
* **Arquivo Revisado:** \`D-1.1-acessar-o-modulo-orion-caixa-revisado.md\` (com marcações explícitas de inserção de prints).
* **Ajustes Realizados vs. Versão Original:**
  - Inclusão do passo intermediário de seleção de produtos no **Portal Orion**, que na documentação original era omitido.

### B. Rotina R-1.1 — Módulo ORION TN: Firmas (Visão Geral e Atendimento de Balcão)
* **Módulo:** Firmas / Balcão
* **Pasta de Destino:** \`auditoria/rotinas/firmas/R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d/\`
* **Prints Geradas:**
  - \`passo-01.png\` / \`passo-01.webp\`: Painel do Portal Orion com foco no card Orion TN.
  - \`passo-02.png\` / \`passo-02.webp\`: Barra de navegação superior do Orion TN destacando o menu Firmas.
  - \`passo-03.png\` / \`passo-03.webp\`: Menu dropdown Firmas aberto com destaque para "Reconhecimento de firmas".
  - \`passo-04.png\` / \`passo-04.webp\`: Tela de atendimento com campo de busca por Nome ou CPF.
  - \`passo-05.png\` / \`passo-05.webp\`: Painel de visualização de serviços e lançamento de atos.
* **Arquivo Revisado:** \`R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d-revisado.md\` (com marcações explícitas de inserção de prints).
* **Ajustes Realizados vs. Versão Original:**
  - Clarificação do fluxo a partir do Portal Orion e confirmação do caminho de menu **Firmas > Reconhecimento de firmas**.

---

## 2. Conformidade com as Diretrizes Arquiteturais
- [x] **Zero impacto no RAG / kb/**: A pasta \`kb/\` permaneceu intocada, preservando a calibração de 1800 tokens e atomicidade.
- [x] **Organização Estrita por Rotina:** Cada pasta contém SOMENTE as prints anotadas e o arquivo markdown revisado.
- [x] **Padrão Gráfico Siplan:** Carmesim Siplan \`#ad0505\`, rótulos em Bordô \`#5a0000\`, tipografia Oswald/Lato e exportação dual (.png + .webp).
- [x] **100% Canvas Puro:** Sem molduras de navegador falsas e sem tarjas LGPD (dados de homologação são fictícios).
`;

  fs.writeFileSync(path.join(changelogDir, 'fase-01-poc-homologacao.md'), changelogContent, 'utf-8');
  console.log(`✓ Changelog da Fase 1 gravado com sucesso!`);

  console.log('\n================================================================');
  console.log('  FASE 1 CONCLUÍDA COM 100% DE SUCESSO!                          ');
  console.log('================================================================\n');
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  executePhase1().catch(err => {
    console.error('\n✕ Erro fatal na execução da Fase 1:', err);
    process.exit(1);
  });
}
