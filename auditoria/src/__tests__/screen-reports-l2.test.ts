import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import {
  analyzeEditorialCrossReferenceV2,
  buildEditorialCrossReferenceV2Markdown,
  buildScreenCatalogMarkdown,
  collectConsolidatedIconDictionary,
  collectLevel2Terms,
  generateScreenReports,
  loadKbRoutines,
  type OrionScreenCatalog
} from '../generate-screen-reports.js';

const mockCatalogL2: OrionScreenCatalog = {
  version: '06.05.02',
  level: 2,
  capturedAt: '2026-11-24T20:30:00Z',
  environment: 'Produtos (homologacao interna Siplan)',
  sourceMenuCatalog: 'auditoria/data/orion-menu-tree-canonical.json',
  stats: {
    totalCanonicalPaths: 2,
    targetScreens: 2,
    captured: 2,
    failed: 0,
    skipped: 0,
    totalButtons: 3,
    totalFields: 1,
    totalTabs: 2,
    totalTables: 1,
    screensWithOverflow: 0,
    screensWithTabs: 1,
    screensWithEmptyTables: 1,
    level2: {
      explored: 1,
      noSubstates: 1,
      partial: 0,
      failed: 0,
      totalSubStates: 4,
      totalSubStateScreenshots: 4,
      totalUniqueKnownButtons: 6,
      totalUniqueKnownFields: 4,
      totalIconDictionaryEntries: 2,
      securityAlertsCount: 0
    }
  },
  screens: [
    {
      id: '001',
      modulo: 'Firmas',
      chain: ['Firmas', 'Fichas'],
      slug: 'firmas-fichas',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/firmas/fichas',
      pageTitle: 'Fichas de Firma',
      screenshots: {
        viewport: 'auditoria/mapeamento-telas/nivel-1/firmas/001-firmas-fichas-viewport.png',
        fullPage: null
      },
      breadcrumbs: ['Firmas', 'Fichas'],
      headings: ['Pesquisa de Fichas'],
      tabs: [
        { label: 'Dados Gerais', active: true, disabled: false },
        { label: 'Documentação Digital', active: false, disabled: false }
      ],
      accordions: [{ label: 'Filtros Avançados', expanded: false }],
      buttons: [
        { label: 'Novo', tooltip: 'Nova Ficha', kind: 'primary', disabled: false, isMutationLike: false },
        { label: 'Pesquisar', tooltip: 'Buscar fichas', kind: 'secondary', disabled: false, isMutationLike: false }
      ],
      fields: [{ label: 'Nome', type: 'text', required: false }],
      tables: [
        {
          headers: ['Número', 'Titular'],
          rowCount: 0,
          isEmpty: true,
          emptyText: 'Nenhum registro encontrado',
          rowActionIcons: []
        }
      ],
      alerts: [],
      scrollMetrics: { scrollHeight: 900, clientHeight: 900, hasVerticalOverflow: false },
      elementCounts: { tabs: 2, accordions: 1, buttons: 2, iconOnlyButtons: 0, fields: 1, tables: 1, alerts: 0 },
      level2Status: 'explored',
      level2ExploredAt: '2026-11-24T20:30:00Z',
      subStates: [
        {
          id: 'tab-documentacao-digital',
          kind: 'tab',
          triggerLabel: 'Documentação Digital',
          openedAs: 'tab',
          routeHash: '#/firmas/fichas',
          activeTab: 'Documentação Digital',
          fingerprint: 'fp-tab-1',
          screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/001-firmas-fichas__tab-documentacao-digital.png',
          restoredCleanly: true,
          status: 'captured',
          error: null,
          buttons: [{ label: 'Digitalizar Documento', tooltip: '', iconClass: 'fa fa-camera', kind: 'secondary', disabled: false, isMutationLike: false }],
          fields: [{ label: 'Tipo de Documento', type: 'select', options: ['RG', 'CNH'] }],
          tabs: [],
          accordions: [{ label: 'Histórico de Anexos', expanded: false }],
          tables: [],
          alerts: [],
          capturedAt: '2026-11-24T20:30:01Z'
        },
        {
          id: 'acc-filtros-avancados',
          kind: 'advanced_filters',
          triggerLabel: 'Filtros Avançados',
          openedAs: 'accordion',
          routeHash: '#/firmas/fichas',
          fingerprint: 'fp-acc-1',
          screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/001-firmas-fichas__acc-filtros-avancados.png',
          restoredCleanly: true,
          status: 'captured',
          error: null,
          buttons: [],
          fields: [{ label: 'Data de Abertura', type: 'date' }],
          tabs: [],
          accordions: [],
          tables: [],
          alerts: [],
          revealedFieldsCount: 1,
          revealedButtonsCount: 0,
          capturedAt: '2026-11-24T20:30:02Z'
        },
        {
          id: 'modal-novo',
          kind: 'form_opener',
          triggerLabel: 'Novo',
          openedAs: 'modal',
          routeHash: '#/firmas/fichas',
          modalTitle: 'Cadastro de Ficha de Firma',
          fingerprint: 'fp-modal-1',
          screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/001-firmas-fichas__open-novo.png',
          restoredCleanly: true,
          status: 'captured',
          error: null,
          buttons: [{ label: 'Coletar Biometria', tooltip: '', iconClass: '', kind: 'secondary', disabled: false, isMutationLike: false }],
          fields: [{ label: 'CPF do Titular', type: 'text', required: true }],
          tabs: [{ label: 'Assinatura', active: true, disabled: false }],
          accordions: [],
          tables: [],
          alerts: [],
          capturedAt: '2026-11-24T20:30:03Z'
        },
        {
          id: 'grid-pesquisar',
          kind: 'search_grid_reveal',
          triggerLabel: 'Pesquisar',
          openedAs: 'grid_reveal',
          routeHash: '#/firmas/fichas',
          fingerprint: 'fp-grid-1',
          screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/001-firmas-fichas__grid-pesquisar.png',
          restoredCleanly: true,
          status: 'captured',
          error: null,
          buttons: [],
          fields: [],
          tabs: [],
          accordions: [],
          tables: [{ headers: ['Número', 'Titular'], rowCount: 3, isEmpty: false, rowActionIcons: ['fa-eye'] }],
          alerts: [],
          rowCount: 3,
          rowActionIcons: ['fa-eye'],
          capturedAt: '2026-11-24T20:30:04Z'
        }
      ],
      allKnownElements: {
        buttons: [
          { label: 'Novo', tooltip: 'Nova Ficha', kind: 'primary', where: 'root' },
          { label: 'Pesquisar', tooltip: 'Buscar fichas', kind: 'secondary', where: 'root' },
          { label: 'Digitalizar Documento', tooltip: '', iconClass: 'fa fa-camera', where: 'tab:Documentação Digital' },
          { label: 'Coletar Biometria', tooltip: '', where: 'modal:Novo' }
        ],
        fields: [
          { label: 'Nome', type: 'text', where: 'root' },
          { label: 'Tipo de Documento', type: 'select', where: 'tab:Documentação Digital' },
          { label: 'Data de Abertura', type: 'date', where: 'accordion:Filtros Avançados' },
          { label: 'CPF do Titular', type: 'text', where: 'modal:Novo' }
        ],
        tabs: [
          { label: 'Dados Gerais', active: true, where: 'root' },
          { label: 'Documentação Digital', active: false, where: 'root' },
          { label: 'Assinatura', active: true, where: 'modal:Novo' }
        ],
        tableHeaders: [
          { header: 'Número', tableIndex: 0, where: 'root' },
          { header: 'Titular', tableIndex: 0, where: 'root' }
        ],
        rowActions: [{ iconClass: 'fa fa-eye', tooltip: 'Visualizar Ficha', where: 'grid_row' }]
      },
      iconDictionary: {
        'fa fa-eye': {
          iconClass: 'fa fa-eye',
          meanings: ['Visualizar Ficha'],
          tooltips: ['Visualizar Ficha'],
          observedIn: ['grid_row']
        },
        'fa fa-camera': {
          iconClass: 'fa fa-camera',
          meanings: ['Digitalizar Documento'],
          tooltips: [],
          observedIn: ['tab:Documentação Digital']
        }
      }
    },
    {
      id: '002',
      modulo: 'Dashboard',
      chain: ['Dashboard'],
      slug: 'dashboard',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/inicio',
      pageTitle: 'Início',
      screenshots: { viewport: null, fullPage: null },
      breadcrumbs: [],
      headings: [],
      tabs: [],
      accordions: [],
      buttons: [],
      fields: [],
      tables: [],
      alerts: [],
      scrollMetrics: { scrollHeight: 800, clientHeight: 900, hasVerticalOverflow: false },
      elementCounts: { tabs: 0, accordions: 0, buttons: 0, iconOnlyButtons: 0, fields: 0, tables: 0, alerts: 0 },
      level2Status: 'no_substates'
    }
  ]
};

describe('generate-screen-reports (Nível 2 offline)', () => {
  let tmpDir: string;
  let kbDir: string;
  let catalogPath: string;
  let outDir: string;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-screen-reports-l2-'));
    kbDir = path.join(tmpDir, 'kb');
    outDir = path.join(tmpDir, 'mapeamento-telas');
    catalogPath = path.join(tmpDir, 'orion-screen-catalog.json');

    fs.mkdirSync(path.join(kbDir, 'rotinas', 'firmas'), { recursive: true });
    fs.writeFileSync(
      path.join(kbDir, 'rotinas', 'firmas', 'R-1.1.md'),
      `---
id: R-1.1
modulo: firmas
---

#### Passo a passo:
1. Acesse **Firmas** > **Fichas** e clique em **Novo**.
2. Preencha **CPF do Titular** e clique em **Coletar Biometria**.
3. Na aba **Documentação Digital**, selecione **Tipo de Documento** e clique em **Digitalizar Documento**.
4. Nos filtros, informe **Data de Abertura** e na grade clique em **Visualizar Ficha**.
5. Caso necessário, clique em **Botão Fantasma Legado** (inexistente).
`,
      'utf-8'
    );

    fs.writeFileSync(catalogPath, JSON.stringify(mockCatalogL2, null, 2), 'utf-8');
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('collectLevel2Terms inclui elementos de abas, accordions, modais e ações de grade com where', () => {
    const terms = collectLevel2Terms(mockCatalogL2);
    const byNorm = new Map(terms.map(t => [`${t.normalizedTerm}|${t.where}`, t]));

    assert.ok(byNorm.has('digitalizar documento|tab:Documentação Digital'));
    assert.ok(byNorm.has('data de abertura|accordion:Filtros Avançados'));
    assert.ok(byNorm.has('cpf do titular|modal:Novo'));
    assert.ok(byNorm.has('coletar biometria|modal:Novo'));
    assert.ok(byNorm.has('visualizar ficha|grid_row'));
  });

  test('analyzeEditorialCrossReferenceV2 resgata termos ocultos por categoria e isola Lista Ouro [ATT]', () => {
    const routines = loadKbRoutines(kbDir);
    const v2 = analyzeEditorialCrossReferenceV2(mockCatalogL2, routines);

    // No L1, esses 5 termos não estão na superfície (e Digitalizar Documento é similar à aba)
    const l1Unmatched = new Set(v2.level1.unmatchedTerms.map(u => u.term));
    assert.ok(l1Unmatched.has('CPF do Titular'));
    assert.ok(l1Unmatched.has('Coletar Biometria'));
    assert.ok(l1Unmatched.has('Tipo de Documento'));
    assert.ok(l1Unmatched.has('Data de Abertura'));
    assert.ok(l1Unmatched.has('Visualizar Ficha'));
    assert.ok(l1Unmatched.has('Botão Fantasma Legado'));

    // No L2, 5 são resgatados de unmatched, 1 é promovido de similar para literal, e 1 permanece na Lista Ouro [ATT]
    assert.equal(v2.rescuedLiteralFromUnmatched.length, 5);
    assert.equal(v2.upgradedSimilarToLiteral.length, 1);
    assert.equal(v2.upgradedSimilarToLiteral[0].term, 'Digitalizar Documento');
    assert.equal(v2.rescuedByCategory.tab, 1);
    assert.equal(v2.rescuedByCategory.accordion, 1);
    assert.equal(v2.rescuedByCategory.modal, 2);
    assert.equal(v2.rescuedByCategory.grid_row, 1);

    assert.equal(v2.goldUnmatchedTerms.length, 1);
    assert.equal(v2.goldUnmatchedTerms[0].term, 'Botão Fantasma Legado');
  });

  test('collectConsolidatedIconDictionary consolida ícones entre telas', () => {
    const icons = collectConsolidatedIconDictionary(mockCatalogL2);
    assert.equal(icons.length, 2);
    const eye = icons.find(i => i.iconClass === 'fa fa-eye');
    assert.ok(eye);
    assert.deepEqual(eye.meanings, ['Visualizar Ficha']);
    assert.equal(eye.screens[0].screenId, '001');
  });

  test('buildScreenCatalogMarkdown renderiza árvore Nível 2 completa e iconDictionary consolidado', () => {
    const md = buildScreenCatalogMarkdown(mockCatalogL2, { outputDir: outDir });
    assert.match(md, /# Catálogo de Telas do Orion TN \(Mapeamento Nível 2\)/);
    assert.match(md, /\*\*Árvore Nível 2 \(Sub-estados\):\*\*/);
    assert.match(md, /\*\*Abas \(1\):\*\*/);
    assert.match(md, /\*\*Accordions & Filtros Avançados \(1\):\*\*/);
    assert.match(md, /\*\*Modais \/ Formulários \(1\):\*\*/);
    assert.match(md, /\*\*Ações de Grade:\*\*/);
    assert.match(md, /## Dicionário Consolidado de Ícones \(`iconDictionary`\)/);
    assert.match(md, /`fa fa-eye`/);
  });

  test('generateScreenReports gera cruzamento-editorial-telas-v2.md com comparativo L1 vs L2 e Lista Ouro', () => {
    const result = generateScreenReports({ catalogPath, kbDir, outputDir: outDir });
    assert.ok(fs.existsSync(result.catalogReportPath));
    assert.ok(fs.existsSync(result.crossRefReportPath));
    assert.ok(fs.existsSync(result.crossRefV2ReportPath));

    const v2Md = buildEditorialCrossReferenceV2Markdown(result.analysisV2, mockCatalogL2);
    assert.match(v2Md, /## 1\. Comparativo Nível 1 \(Superfície\) vs Nível 2/);
    assert.match(v2Md, /Abas: \*\*1\*\* \| Accordions\/Filtros: \*\*1\*\* \| Modais\/Formulários: \*\*2\*\* \| Ações de Grade: \*\*1\*\*/);
    assert.match(v2Md, /## 2\. Termos Resgatados no Nível 2/);
    assert.match(v2Md, /## 4\. Lista Ouro — Termos Confirmados Inexistentes no Orion TN 06\.05\.02/);
    assert.match(v2Md, /\*\*Botão Fantasma Legado\*\*/);
  });
});
