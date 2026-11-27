import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classifySafeViewSwitcher,
  filterCatalogEntriesForLevel2,
  isSafeSearchButton,
  parseLevel2CliFlags,
  planScreenExploration
} from '../map-screens-level2.js';
import { parseWhereLocation } from '../reveal-explorer.js';
import {
  buildAllKnownElements,
  buildOrionScreenCatalog,
  buildScreenDomExtractionScript,
  enrichScreenWithLevel2,
  getSubStateWhereLocation,
  type ScreenCatalogEntry,
  type ScreenSubState
} from '../screen-catalog-extractor.js';

function makeMockScreen(overrides: Partial<ScreenCatalogEntry> = {}): ScreenCatalogEntry {
  return {
    id: '001',
    modulo: 'Dashboard',
    chain: ['Dashboard', 'Atos Protocolares'],
    slug: 'dashboard-atos-protocolares',
    status: 'captured',
    openedAs: 'route',
    routeHash: '#/dashboard',
    pageTitle: 'Atos protocolares',
    screenshots: { viewport: 'a.png', fullPage: null },
    breadcrumbs: [],
    headings: ['Atos protocolares'],
    tabs: [],
    accordions: [],
    buttons: [],
    fields: [],
    tables: [],
    alerts: [],
    scrollMetrics: {
      scrollHeight: 1125,
      clientHeight: 900,
      zoom: 0.8,
      effectiveClientHeight: 1125,
      hasVerticalOverflow: false,
      innerScrollContainers: 0
    },
    elementCounts: { tabs: 0, accordions: 0, buttons: 0, iconOnlyButtons: 0, fields: 0, tables: 0, alerts: 0 },
    capturedAt: '2026-11-25T10:00:00Z',
    error: null,
    ...overrides
  };
}

describe('Screen Catalog Level 2.5 — Full-Page, View Switchers, Nested Tabs & Search Reveal', () => {
  it('inclui zoom/effectiveClientHeight e seletores de menu lateral/wizard no script de extração DOM', () => {
    const script = buildScreenDomExtractionScript();
    assert.ok(script.includes('effectiveClientHeight'), 'Deve calcular effectiveClientHeight considerando zoom');
    assert.ok(script.includes('ul.nav.nav-stacked'), 'Deve detectar menus laterais internos .nav-stacked');
    assert.ok(script.includes('ul.list-group'), 'Deve detectar painéis list-group dentro do conteúdo');
    assert.ok(script.includes('.nav-wizard'), 'Deve detectar steppers/wizards');
    assert.ok(script.includes('orientation'), 'Deve detectar orientação horizontal/vertical de abas');
  });

  it('aceita Filtrar em isSafeSearchButton e planeja search_grid_reveal mesmo com campo required no DOM', () => {
    assert.equal(isSafeSearchButton({ label: 'Filtrar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Pesquisar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Buscar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Consultar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Filtrar e Salvar' }), false);

    const screen = makeMockScreen({
      id: '009',
      modulo: 'Firmas',
      chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
      slug: 'firmas-cadastros-cartao-de-assinatura',
      buttons: [
        { label: 'Filtrar', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false },
        { label: 'Adicionar', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false }
      ],
      fields: [
        // Mesmo com required=true (ex.: data pré-preenchida), o plano inclui e deixa o check ao vivo decidir
        { label: 'Data início', type: 'date', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: '' }
      ],
      tables: [{ headers: ['CPF', 'Nome'], rowCount: 0, isEmpty: true, emptyText: 'Vazio', rowActionIcons: [] }]
    });

    const plan = planScreenExploration(screen);
    assert.ok(
      plan.actions.some(a => a.kind === 'search_grid_reveal' && a.triggerLabel === 'Filtrar'),
      'Deve planejar search_grid_reveal para Filtrar em grade vazia'
    );
  });

  it('classifica alternadores de modo/visão seguros e bloqueia mutações', () => {
    assert.equal(classifySafeViewSwitcher({ label: 'Kanban' }).safe, true);
    assert.equal(classifySafeViewSwitcher({ label: 'Dashboard' }).safe, true);
    assert.equal(classifySafeViewSwitcher({ label: 'Visão Geral' }).safe, true);
    assert.equal(classifySafeViewSwitcher({ label: 'Por comunicação' }).safe, true);
    assert.equal(classifySafeViewSwitcher({ label: 'Informações' }).safe, true);
    assert.equal(classifySafeViewSwitcher({ label: 'Resumo' }).safe, true);

    // Nunca deve reclassificar abridores/buscas/mutações como view_switcher
    assert.equal(classifySafeViewSwitcher({ label: 'Novo' }).safe, false);
    assert.equal(classifySafeViewSwitcher({ label: 'Pesquisar' }).safe, false);
    assert.equal(classifySafeViewSwitcher({ label: 'Salvar resumo' }).safe, false);
    assert.equal(classifySafeViewSwitcher({ label: 'Emitir relatório' }).safe, false);

    const dash = makeMockScreen({
      buttons: [
        { label: 'Kanban', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false },
        { label: 'Dashboard', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false },
        { label: 'Filtros', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false }
      ]
    });
    const plan = planScreenExploration(dash);
    assert.deepEqual(
      plan.actions.map(a => `${a.kind}:${a.triggerLabel}`),
      ['advanced_filters:Filtros', 'view_switcher:Kanban', 'view_switcher:Dashboard']
    );
  });

  it('mapeia nested_tab e view_switcher em allKnownElements, stats e parseWhereLocation', () => {
    const nestedSub: ScreenSubState = {
      id: '009-s02',
      kind: 'nested_tab',
      triggerLabel: 'Endereços',
      parentOpener: 'Adicionar',
      openedAs: 'nested_tab',
      routeHash: '#/cartao/cadastrar',
      activeTab: 'Endereços',
      fingerprint: 'fp-nested',
      screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/009__open-adicionar__tab-enderecos.png',
      fullPageScreenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/009__open-adicionar__tab-enderecos-full.png',
      screenshotHeight: 1450,
      restoredCleanly: true,
      status: 'captured',
      error: null,
      buttons: [],
      fields: [{ label: 'CEP', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: '' }],
      tabs: [],
      accordions: [],
      tables: [],
      alerts: [],
      capturedAt: '2026-11-25T10:05:00Z'
    };

    const viewSub: ScreenSubState = {
      id: '001-s02',
      kind: 'view_switcher',
      triggerLabel: 'Kanban',
      openedAs: 'view_switch',
      routeHash: '#/dashboard',
      fingerprint: 'fp-view',
      screenshot: 'auditoria/mapeamento-telas/nivel-2/dashboard/001__view-kanban.png',
      restoredCleanly: true,
      status: 'captured',
      error: null,
      buttons: [{ label: 'Card Config', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false }],
      fields: [],
      tabs: [],
      accordions: [],
      tables: [],
      alerts: [],
      capturedAt: '2026-11-25T10:06:00Z'
    };

    assert.equal(getSubStateWhereLocation(nestedSub), 'modal:Adicionar > tab:Endereços');
    assert.equal(getSubStateWhereLocation(viewSub), 'view:Kanban');

    const screen = makeMockScreen();
    const all = buildAllKnownElements(screen, [nestedSub, viewSub]);
    assert.equal(all.fields.find(f => f.label === 'CEP')?.where, 'modal:Adicionar > tab:Endereços');
    assert.equal(all.buttons.find(b => b.label === 'Card Config')?.where, 'view:Kanban');

    const enriched = enrichScreenWithLevel2(screen, {
      level2Status: 'explored',
      subStates: [nestedSub, viewSub]
    });
    const catalog = buildOrionScreenCatalog([enriched]);
    assert.equal(catalog.stats.level2?.totalNestedTabs, 1);
    assert.equal(catalog.stats.level2?.totalViewSwitchers, 1);
    assert.equal(catalog.stats.level2?.trueFullPagePrintsCount, 1);

    assert.deepEqual(parseWhereLocation('view:Kanban'), {
      triggerKind: 'button',
      triggerLabel: 'Kanban'
    });
    assert.deepEqual(parseWhereLocation('modal:Adicionar > tab:Endereços'), {
      triggerKind: 'button',
      triggerLabel: 'Adicionar',
      nestedTab: 'Endereços'
    });
  });

  it('parseia --level25 e --refresh-fullpage e filtra --resume no modo level25', () => {
    const cli = parseLevel2CliFlags(['--level25', '--refresh-fullpage', '--module=Firmas']);
    assert.equal(cli.level25, true);
    assert.equal(cli.refreshFullpage, true);
    assert.equal(cli.module, 'Firmas');

    const s1 = makeMockScreen({ id: '001', level2Status: 'explored' }) as any;
    s1.level25CompletedAt = '2026-11-25T10:10:00Z';
    const s2 = makeMockScreen({ id: '002', level2Status: 'explored' });
    const filtered = filterCatalogEntriesForLevel2([s1, s2], { resume: true, level25: true });
    assert.deepEqual(filtered.map(s => s.id), ['002']);
  });
});
