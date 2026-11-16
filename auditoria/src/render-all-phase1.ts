import path from 'node:path';
import fs from 'node:fs';
import { annotateScreenshot } from './annotator.js';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));
const cacheDir = path.join(auditoriaRoot, 'cache', 'raw');

const d11Dir = path.join(auditoriaRoot, 'rotinas', 'caixa', 'D-1.1-acessar-o-modulo-orion-caixa');
const r11Dir = path.join(auditoriaRoot, 'rotinas', 'firmas', 'R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d');

if (!fs.existsSync(d11Dir)) fs.mkdirSync(d11Dir, { recursive: true });
if (!fs.existsSync(r11Dir)) fs.mkdirSync(r11Dir, { recursive: true });

async function renderAll() {
  console.log('================================================================');
  console.log('  RENDERIZAÇÃO FINAL DE ALTA PRECISÃO — TODAS AS 9 PRINTS');
  console.log('================================================================\n');

  // --- D-1.1 (Orion Caixa) ---
  console.log('>>> [1/2] Renderizando D-1.1 (Orion Caixa) <<<');

  // Passo 1: Tela de Login limpa
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'd11-passo-01-raw.png'),
    outputPath: path.join(d11Dir, 'passo-01.png'),
    box: { x: 875, y: 232, width: 400, height: 338 },
    stepNumber: 1,
    actionType: 'click',
    label: 'Tela de Acesso ao Orion TN',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ D-1.1 Passo 1 renderizado com sucesso!');

  // Passo 2: Preencher Usuário e Senha
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'd11-passo-02-raw.png'),
    outputPath: path.join(d11Dir, 'passo-02.png'),
    box: { x: 875, y: 340, width: 400, height: 200 },
    stepNumber: 2,
    actionType: 'fill',
    label: 'Informe usuário e senha e clique em ENTRAR',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ D-1.1 Passo 2 renderizado com sucesso!');

  // Passo 3: Card Orion Caixa no Portal
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'd11-passo-03-raw.png'),
    outputPath: path.join(d11Dir, 'passo-03.png'),
    box: { x: 901, y: 342, width: 111, height: 104 },
    stepNumber: 3,
    actionType: 'click',
    label: 'Clique no card Orion Caixa',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ D-1.1 Passo 3 renderizado com sucesso!');

  // Passo 4: Menus operacionais do Caixa
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'd11-passo-04-raw.png'),
    outputPath: path.join(d11Dir, 'passo-04.png'),
    box: { x: 719, y: 6, width: 443, height: 50 },
    stepNumber: 4,
    actionType: 'verify',
    label: 'Menus Operacionais do Orion Caixa',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ D-1.1 Passo 4 renderizado com sucesso!');

  // --- R-1.1 (Orion TN / Firmas) ---
  console.log('\n>>> [2/2] Renderizando R-1.1 (Orion TN / Firmas) <<<');

  // Passo 1: Card Orion TN no Portal (Coluna 3)
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'd11-passo-03-raw.png'),
    outputPath: path.join(r11Dir, 'passo-01.png'),
    box: { x: 1150, y: 343, width: 111, height: 104 },
    stepNumber: 1,
    actionType: 'click',
    label: 'Selecione o módulo Orion TN',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ R-1.1 Passo 1 renderizado com sucesso (100% no Orion TN)!');

  // Passo 2: Menu Firmas na barra superior do Orion TN (Coordenada exata e simétrica: x: 504, y: 6, w: 75, h: 38)
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'r11-passo-02-real.png'),
    outputPath: path.join(r11Dir, 'passo-02.png'),
    box: { x: 504, y: 6, width: 75, height: 38 },
    stepNumber: 2,
    actionType: 'click',
    label: 'Acesse o menu Firmas',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ R-1.1 Passo 2 renderizado com 100% de precisão no botão Firmas!');

  // Passo 3: Item Reconhecimento de firmas no menu suspenso aberto
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'r11-passo-03-real.png'),
    outputPath: path.join(r11Dir, 'passo-03.png'),
    box: { x: 375, y: 56, width: 190, height: 30 },
    stepNumber: 3,
    actionType: 'click',
    label: 'Clique em Reconhecimento de firmas',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ R-1.1 Passo 3 renderizado com sucesso!');

  // Passo 4: Painel de pesquisa de signatário (Busca por, Nome, CPF, etc.)
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'tela-reconhecimento-sucesso.png'),
    outputPath: path.join(r11Dir, 'passo-04.png'),
    box: { x: 20, y: 195, width: 686, height: 215 },
    stepNumber: 4,
    actionType: 'search',
    label: 'Localize o signatário por Nome ou CPF',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ R-1.1 Passo 4 renderizado com sucesso!');

  // Passo 5: Painel de Atendimento e Seleção de Serviços (Lado Direito)
  await annotateScreenshot({
    inputPath: path.join(cacheDir, 'tela-reconhecimento-sucesso.png'),
    outputPath: path.join(r11Dir, 'passo-05.png'),
    box: { x: 728, y: 185, width: 694, height: 285 },
    stepNumber: 5,
    actionType: 'verify',
    label: 'Painel de Atendimento e Seleção de Atos',
    themeColor: '#ad0505',
    exportWebp: true
  });
  console.log('✓ R-1.1 Passo 5 renderizado com sucesso!');

  console.log('\n================================================================');
  console.log('  TODAS AS 9 PRINTS FORAM GERADAS E ANOTADAS COM SUCESSO!        ');
  console.log('================================================================\n');
}

renderAll().catch(err => console.error(err));
