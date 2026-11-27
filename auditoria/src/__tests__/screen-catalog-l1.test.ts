import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseCliFlags } from '../map-screens-level1.js';
import {
  buildOrionScreenCatalog,
  buildScreenDomExtractionScript,
  buildScreenEntryId,
  buildSkippedScreenEntry,
  computeCatalogStats,
  filterScreenTargets,
  isMutationLike,
  loadCanonicalMenuCatalog,
  normalizeExtractedScreen,
  prepareScreenTargets,
  slugify,
  type RawScreenDomExtraction
} from '../screen-catalog-extractor.js';

describe('Screen Catalog Level 1 (Offline)', () => {
  const canonical = loadCanonicalMenuCatalog();
  const targets = prepareScreenTargets(canonical);

  it('prepara exatamente 115 caminhos canônicos: 109 prof>=2 + 1 Históricos + 4 Olá,[usuário] + 1 Sair skipped', () => {
    assert.equal(targets.length, 115);

    const cascade = targets.filter(t => t.navigationKind === 'cascade');
    const directTop = targets.filter(t => t.navigationKind === 'direct_top');
    const userMenu = targets.filter(t => t.navigationKind === 'user_menu');
    const skippedLogout = targets.filter(t => t.navigationKind === 'skipped_logout');

    assert.equal(cascade.length, 109);
    assert.equal(directTop.length, 1);
    assert.deepEqual(directTop[0].chain, ['Históricos']);

    assert.equal(userMenu.length, 4);
    assert.deepEqual(
      userMenu.map(u => u.chain[1]),
      ['Alterar senha', 'Fale conosco', 'Autenticação em dois fatores', 'Cadastrar biometria']
    );

    assert.equal(skippedLogout.length, 1);
    assert.deepEqual(skippedLogout[0].chain, ['Olá, [usuário]', 'Sair']);
    assert.equal(skippedLogout[0].skipReason, 'logout_safety_block');

    const skippedEntry = buildSkippedScreenEntry(skippedLogout[0]);
    assert.equal(skippedEntry.status, 'skipped');
    assert.equal(skippedEntry.error, 'logout_safety_block');
  });

  it('gera IDs sequenciais ("001".."115") e slugs determinísticos sem acentos', () => {
    assert.equal(buildScreenEntryId(1), '001');
    assert.equal(buildScreenEntryId(42), '042');
    assert.equal(buildScreenEntryId(115), '115');
    assert.equal(slugify('Olá, [usuário] Autenticação em dois fatores'), 'ola-usuario-autenticacao-em-dois-fatores');
    assert.equal(slugify('Históricos'), 'historicos');
  });

  it('suporta filtros --module, --only, --resume e --max', () => {
    const onlyFirmas = filterScreenTargets(targets, { module: 'Firmas' });
    assert.ok(onlyFirmas.length > 0);
    assert.ok(onlyFirmas.every(t => t.modulo === 'Firmas'));

    const onlyHistoricos = filterScreenTargets(targets, { only: 'historicos' });
    assert.equal(onlyHistoricos.length, 1);
    assert.deepEqual(onlyHistoricos[0].chain, ['Históricos']);

    const onlyByIndex = filterScreenTargets(targets, { only: '1' });
    assert.equal(onlyByIndex.length, 1);
    assert.equal(onlyByIndex[0].id, '001');

    const resumeCatalog = buildOrionScreenCatalog([
      normalizeExtractedScreen(
        targets[0],
        {
          routeHash: '#/dashboard',
          pageTitle: 'Orion TN',
          breadcrumbs: [],
          headings: ['Atos Protocolares'],
          tabs: [],
          accordions: [],
          buttons: [],
          fields: [],
          tables: [],
          alerts: [],
          scrollMetrics: { scrollHeight: 800, clientHeight: 900, hasVerticalOverflow: false, innerScrollContainers: 0 }
        },
        { openedAs: 'route', screenshots: { viewport: 'a.png', fullPage: null } }
      )
    ]);

    const resumed = filterScreenTargets(targets, { resumeCatalog, max: 3 });
    assert.equal(resumed.length, 3);
    assert.equal(resumed[0].id, '002');
  });

  it('faz parse correto das flags de CLI', () => {
    const parsed = parseCliFlags([
      '--module=Notas',
      '--only=015',
      '--resume',
      '--max=5',
      '--timeout=25000'
    ]);
    assert.deepEqual(parsed, {
      module: 'Notas',
      only: '015',
      resume: true,
      max: 5,
      timeoutMs: 25000
    });

    const defaults = parseCliFlags([]);
    assert.deepEqual(defaults, {
      resume: false,
      timeoutMs: 90000
    });
  });

  it('classifica isMutationLike corretamente para botões de escrita vs leitura', () => {
    assert.equal(isMutationLike('Salvar'), true);
    assert.equal(isMutationLike('Gravar alterações'), true);
    assert.equal(isMutationLike('Excluir registro'), true);
    assert.equal(isMutationLike('Confirmar'), true);
    assert.equal(isMutationLike('', 'Excluir item', ''), true);
    assert.equal(isMutationLike('', '', 'fa fa-trash'), true);

    assert.equal(isMutationLike('Pesquisar'), false);
    assert.equal(isMutationLike('Consultar'), false);
    assert.equal(isMutationLike('Limpar filtros'), false);
    assert.equal(isMutationLike('Visualizar detalhes'), false);
    assert.equal(isMutationLike('Exportar PDF'), false);
  });

  it('calcula computeCatalogStats e normaliza opções de select até 30 itens', () => {
    const rawSample: RawScreenDomExtraction = {
      routeHash: '#/firmas/reconhecimento',
      pageTitle: 'Orion TN - Firmas',
      breadcrumbs: ['Firmas', 'Reconhecimento de firmas'],
      headings: ['Reconhecimento de firmas'],
      tabs: [
        { label: 'Dados Gerais', active: true, disabled: false },
        { label: 'Anexos', active: false, disabled: false }
      ],
      accordions: [{ label: 'Filtros Avançados', expanded: false }],
      buttons: [
        { label: 'Pesquisar', tooltip: '', iconClass: 'fa fa-search', kind: 'button', disabled: false },
        { label: 'Salvar', tooltip: '', iconClass: 'fa fa-save', kind: 'submit', disabled: false },
        { label: '', tooltip: 'Imprimir', iconClass: 'fa fa-print', kind: 'button', disabled: false }
      ],
      fields: [
        {
          label: 'Tipo de Ato',
          type: 'select',
          required: true,
          disabled: false,
          readonly: false,
          placeholder: '',
          options: Array.from({ length: 45 }, (_, i) => `Opção ${i + 1}`),
          section: 'Filtros'
        }
      ],
      tables: [
        {
          headers: ['Protocolo', 'Data', 'Ações'],
          rowCount: 0,
          isEmpty: true,
          emptyText: 'Nenhum registro encontrado',
          rowActionIcons: []
        }
      ],
      alerts: [],
      scrollMetrics: {
        scrollHeight: 1450,
        clientHeight: 900,
        hasVerticalOverflow: true,
        innerScrollContainers: 1
      }
    };

    const entry1 = normalizeExtractedScreen(targets[0], rawSample, {
      openedAs: 'route',
      screenshots: { viewport: 'v1.png', fullPage: 'f1.png' }
    });
    assert.equal(entry1.fields[0].options.length, 30);
    assert.equal(entry1.buttons[0].isMutationLike, false);
    assert.equal(entry1.buttons[1].isMutationLike, true);
    assert.equal(entry1.elementCounts.iconOnlyButtons, 1);

    const skipped = buildSkippedScreenEntry(targets[targets.length - 1]);
    const stats = computeCatalogStats([entry1, skipped], 115);

    assert.equal(stats.totalCanonicalPaths, 115);
    assert.equal(stats.targetScreens, 1);
    assert.equal(stats.captured, 1);
    assert.equal(stats.failed, 0);
    assert.equal(stats.skipped, 1);
    assert.equal(stats.totalButtons, 3);
    assert.equal(stats.totalFields, 1);
    assert.equal(stats.totalTabs, 2);
    assert.equal(stats.totalTables, 1);
    assert.equal(stats.screensWithOverflow, 1);
    assert.equal(stats.screensWithTabs, 1);
    assert.equal(stats.screensWithEmptyTables, 1);
  });

  it('gera script JS de extração do DOM válido sintaticamente e com limite de 30 options', () => {
    const script = buildScreenDomExtractionScript();
    assert.ok(script.includes('.slice(0, 30)'));
    assert.ok(script.includes('.navbar'));
    assert.doesNotThrow(() => new Function(script));
  });
});
