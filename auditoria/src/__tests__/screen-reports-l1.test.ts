import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import {
  analyzeEditorialCrossReference,
  buildEditorialCrossReferenceMarkdown,
  buildScreenCatalogMarkdown,
  extractBoldTermsFromMarkdown,
  generateScreenReports,
  identifyLevel2CandidateScreens,
  loadKbRoutines,
  type OrionScreenCatalog
} from '../generate-screen-reports.js';

const mockCatalog: OrionScreenCatalog = {
  version: '06.05.02',
  level: 1,
  capturedAt: '2026-11-24T19:00:00Z',
  environment: 'Produtos (homologacao interna Siplan)',
  sourceMenuCatalog: 'auditoria/data/orion-menu-tree-canonical.json',
  stats: {
    totalCanonicalPaths: 3,
    targetScreens: 3,
    captured: 2,
    failed: 0,
    skipped: 1,
    totalButtons: 4,
    totalFields: 2,
    totalTabs: 2,
    totalTables: 1,
    screensWithOverflow: 0,
    screensWithTabs: 1,
    screensWithEmptyTables: 1
  },
  screens: [
    {
      id: '001',
      modulo: 'Configurações',
      chain: ['Configurações', 'Usuários'],
      slug: 'configuracoes-usuarios',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/configuracao/usuarios',
      pageTitle: 'Cadastro de Usuários',
      screenshots: {
        viewport: 'auditoria/mapeamento-telas/prints/001-configuracoes-usuarios-viewport.png',
        fullPage: 'auditoria/mapeamento-telas/prints/001-configuracoes-usuarios-full.png'
      },
      breadcrumbs: ['Configurações', 'Usuários'],
      headings: ['Usuários do Sistema'],
      tabs: [
        { label: 'Dados Gerais', active: true, disabled: false },
        { label: 'Permissões de Acesso', active: false, disabled: false }
      ],
      accordions: [{ label: 'Filtros Avançados', expanded: false }],
      buttons: [
        { label: 'Novo', tooltip: 'Cadastrar novo usuário', kind: 'primary', disabled: false, isMutationLike: false },
        { label: 'Pesquisar', tooltip: 'Buscar registros', kind: 'secondary', disabled: false, isMutationLike: false },
        { label: '', tooltip: 'Exportar CSV', iconClass: 'fa fa-download', kind: 'icon_only', disabled: false, isMutationLike: false }
      ],
      fields: [
        { label: 'Nome Completo', type: 'text', required: true, disabled: false, readonly: false, section: 'Filtros' },
        {
          label: 'Cargo',
          type: 'select',
          required: false,
          options: ['Tabelião', 'Escrevente', 'Auxiliar', 'Substituto', 'Estagiário', 'Outro']
        }
      ],
      tables: [
        {
          headers: ['Nome', 'Login', 'Status'],
          rowCount: 0,
          isEmpty: true,
          emptyText: 'Nenhum registro encontrado',
          rowActionIcons: ['fa-pencil']
        }
      ],
      alerts: ['Ambiente de homologação ativo'],
      scrollMetrics: { scrollHeight: 900, clientHeight: 900, hasVerticalOverflow: false },
      elementCounts: { tabs: 2, accordions: 1, buttons: 3, iconOnlyButtons: 1, fields: 2, tables: 1, alerts: 1 }
    },
    {
      id: '002',
      modulo: 'Firmas',
      chain: ['Firmas', 'Fichas'],
      slug: 'firmas-fichas',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/firmas/fichas',
      pageTitle: 'Fichas de Firma',
      screenshots: {
        viewport: 'auditoria/mapeamento-telas/prints/002-firmas-fichas-viewport.png',
        fullPage: null
      },
      breadcrumbs: ['Firmas', 'Fichas'],
      headings: [],
      tabs: [],
      accordions: [],
      buttons: [{ label: 'Salvar', kind: 'primary', isMutationLike: true }],
      fields: [],
      tables: [],
      alerts: [],
      scrollMetrics: { scrollHeight: 800, clientHeight: 900, hasVerticalOverflow: false },
      elementCounts: { tabs: 0, accordions: 0, buttons: 1, iconOnlyButtons: 0, fields: 0, tables: 0, alerts: 0 }
    },
    {
      id: '003',
      modulo: 'Olá, [usuário]',
      chain: ['Olá, [usuário]', 'Sair'],
      slug: 'usuario-sair',
      status: 'skipped',
      openedAs: 'unknown',
      routeHash: '',
      pageTitle: '',
      screenshots: { viewport: null, fullPage: null },
      breadcrumbs: [],
      headings: [],
      tabs: [],
      accordions: [],
      buttons: [],
      fields: [],
      tables: [],
      alerts: [],
      scrollMetrics: { scrollHeight: 0, clientHeight: 0, hasVerticalOverflow: false },
      elementCounts: { tabs: 0, accordions: 0, buttons: 0, iconOnlyButtons: 0, fields: 0, tables: 0, alerts: 0 },
      error: 'logout_safety_block'
    }
  ]
};

describe('generate-screen-reports (Nível 1 offline)', () => {
  let tmpDir: string;
  let kbDir: string;
  let catalogPath: string;
  let outDir: string;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-screen-reports-'));
    kbDir = path.join(tmpDir, 'kb');
    outDir = path.join(tmpDir, 'mapeamento-telas');
    catalogPath = path.join(tmpDir, 'orion-screen-catalog.json');

    fs.mkdirSync(path.join(kbDir, 'rotinas', 'acesso'), { recursive: true });
    fs.writeFileSync(path.join(kbDir, '_indice.md'), '# Índice\n**Ignorar Termo Indice**\n', 'utf-8');
    fs.writeFileSync(path.join(kbDir, '_glossario.md'), '# Glossário\n**Ignorar Termo Glossario**\n', 'utf-8');
    fs.writeFileSync(path.join(kbDir, 'rotinas', 'README.md'), '# README\n**Ignorar Termo Readme**\n', 'utf-8');

    fs.writeFileSync(
      path.join(kbDir, 'rotinas', 'acesso', 'C-ACESSO-01.md'),
      `---
id: C-ACESSO-01
modulo: acesso
---

#### Passo a passo:
1. Acesse **Configurações** > **Usuários** e clique em **Novo**.
2. Preencha **Nome Completo** e **Permissões Acesso**.
3. Clique em **Redefinir Senha Manualmente** na aba **Segurança**.
`,
      'utf-8'
    );

    fs.writeFileSync(
      path.join(kbDir, 'rotinas', 'acesso', 'C-ACESSO-02.md'),
      `---
id: C-ACESSO-02
modulo: acesso
---

#### Passo a passo:
1. Clique em **Salvar** e confira **Redefinir Senha Manualmente**.
`,
      'utf-8'
    );

    fs.writeFileSync(catalogPath, JSON.stringify(mockCatalog, null, 2), 'utf-8');
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('extractBoldTermsFromMarkdown ignora frontmatter YAML e extrai negritos limpos', () => {
    const terms = extractBoldTermsFromMarkdown(`---
id: R-1
---
1. Clique em **Novo** e preencha **Nome Completo**.`);
    assert.deepEqual(terms, ['Novo', 'Nome Completo']);
  });

  test('loadKbRoutines ignora _indice.md, _glossario.md e README.md', () => {
    const routines = loadKbRoutines(kbDir);
    assert.equal(routines.length, 2);
    assert.deepEqual(
      routines.map(r => r.id).sort(),
      ['C-ACESSO-01', 'C-ACESSO-02']
    );
  });

  test('analyzeEditorialCrossReference separa literais, similares >= 0.65 e não encontrados', () => {
    const routines = loadKbRoutines(kbDir);
    const analysis = analyzeEditorialCrossReference(mockCatalog, routines);

    const literalTerms = analysis.literalMatches.map(m => m.term);
    assert.ok(literalTerms.includes('Configurações'));
    assert.ok(literalTerms.includes('Usuários'));
    assert.ok(literalTerms.includes('Novo'));
    assert.ok(literalTerms.includes('Nome Completo'));
    assert.ok(literalTerms.includes('Salvar'));

    const similarTerms = analysis.similarMatches.map(m => m.term);
    assert.ok(similarTerms.includes('Permissões Acesso'));
    const permMatch = analysis.similarMatches.find(m => m.term === 'Permissões Acesso');
    assert.ok(permMatch && permMatch.similarity >= 0.65);
    assert.equal(permMatch?.bestCandidate.rawTerm, 'Permissões de Acesso');

    const unmatched = analysis.unmatchedTerms.map(u => u.term);
    assert.ok(unmatched.includes('Redefinir Senha Manualmente'));
    assert.ok(unmatched.includes('Segurança'));
  });

  test('identifyLevel2CandidateScreens prioriza telas com abas, accordions, botões gatilho e tabelas vazias', () => {
    const candidates = identifyLevel2CandidateScreens(mockCatalog);
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].screenId, '001');
    assert.equal(candidates[0].tabsCount, 2);
    assert.equal(candidates[0].accordionsCount, 1);
    assert.equal(candidates[0].emptyTablesCount, 1);
    assert.deepEqual(candidates[0].triggerButtons, ['Novo', 'Pesquisar']);
  });

  test('generateScreenReports gera catalogo-telas-orion-tn.md e cruzamento-editorial-telas.md válidos', () => {
    const result = generateScreenReports({ catalogPath, kbDir, outputDir: outDir });
    assert.ok(fs.existsSync(result.catalogReportPath));
    assert.ok(fs.existsSync(result.crossRefReportPath));

    const catalogMd = fs.readFileSync(result.catalogReportPath, 'utf-8');
    assert.match(catalogMd, /## Módulo: Configurações/);
    assert.match(catalogMd, /\[001\] Configurações > Usuários/);
    assert.match(catalogMd, /`icon_only`/);
    assert.match(catalogMd, /tooltip: "Exportar CSV"/);
    assert.match(catalogMd, /\(\+1 opções\)/);
    assert.match(catalogMd, /Ambiente de homologação ativo/);
    assert.match(catalogMd, /logout_safety_block/);

    const crossMd = buildEditorialCrossReferenceMarkdown(result.analysis, mockCatalog);
    assert.match(crossMd, /## 1\. Termos Encontrados Literalmente na Superfície/);
    assert.match(crossMd, /## 2\. Termos com Candidato Similar/);
    assert.match(crossMd, /## 3\. Termos Não Encontrados na Superfície/);
    assert.match(crossMd, /## 4\. Telas Candidatas Prioritárias para o Mapeamento Nível 2/);
  });
});
