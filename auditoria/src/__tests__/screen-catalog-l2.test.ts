import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classifySafeOpener,
  filterCatalogEntriesForLevel2,
  isBlockedByAntiMutation,
  isReadOnlySearchEndpoint,
  isSafeSearchButton,
  parseLevel2CliFlags,
  planScreenExploration,
  restoreCleanScreenState
} from '../map-screens-level2.js';
import {
  buildAllKnownElements,
  buildIconDictionary,
  buildOrionScreenCatalog,
  computeStateFingerprint,
  enrichScreenWithLevel2,
  type ScreenCatalogEntry,
  type ScreenSubState
} from '../screen-catalog-extractor.js';

function makeMockScreen(overrides: Partial<ScreenCatalogEntry> = {}): ScreenCatalogEntry {
  return {
    id: '010',
    modulo: 'Firmas',
    chain: ['Firmas', 'Fichas'],
    slug: 'firmas-fichas',
    status: 'captured',
    openedAs: 'route',
    routeHash: '#/firmas/fichas',
    pageTitle: 'Fichas de Firma',
    screenshots: { viewport: 'a.png', fullPage: null },
    breadcrumbs: [],
    headings: ['Fichas de Firma'],
    tabs: [],
    accordions: [],
    buttons: [],
    fields: [],
    tables: [],
    alerts: [],
    scrollMetrics: { scrollHeight: 900, clientHeight: 900, hasVerticalOverflow: false, innerScrollContainers: 0 },
    elementCounts: { tabs: 0, accordions: 0, buttons: 0, iconOnlyButtons: 0, fields: 0, tables: 0, alerts: 0 },
    capturedAt: '2026-11-24T20:00:00Z',
    error: null,
    ...overrides
  };
}

describe('Screen Catalog Level 2 — Anti-Mutation, Planning & Schema', () => {
  it('bloqueia 100% das palavras-chave da blocklist absoluta anti-mutação', () => {
    const blockedKeywords = [
      // Write / persist
      'Salvar',
      'Gravar',
      'Confirmar',
      'Concluir',
      'Finalizar',
      'Aplicar',
      'Aprovar',
      'Assinar',
      'Selar',
      'Emitir',
      'Gerar',
      'Enviar',
      'Transmitir',
      'Retransmitir',
      'Protocolar',
      'Lavrar',
      'Importar',
      'Sincronizar',
      'Processar',
      'Executar',
      'Estornar',
      'Baixar',
      'Liquidar',
      'Faturar',
      // Destroy / state change
      'Excluir',
      'Deletar',
      'Remover',
      'Apagar',
      'Inativar',
      'Desativar',
      'Ativar',
      'Cancelar ato',
      'Cancelar selo',
      'Cancelar protocolo',
      'Anular',
      'Bloquear',
      'Desbloquear',
      'Resetar',
      'Redefinir',
      // Session
      'Sair',
      'Logout',
      'Encerrar sessão'
    ];

    for (const kw of blockedKeywords) {
      const res = isBlockedByAntiMutation({ label: kw });
      assert.equal(res.blocked, true, `Esperava bloqueio para label="${kw}"`);

      const resNg = isBlockedByAntiMutation({
        label: '',
        ngClick: `vm.${kw.replace(/\s+/g, '_')}()`
      });
      assert.equal(resNg.blocked, true, `Esperava bloqueio para ngClick com "${kw}"`);
    }

    // CamelCase em ng-click e ícones destrutivos
    assert.equal(isBlockedByAntiMutation({ ngClick: 'vm.cancelarAto(item)' }).blocked, true);
    assert.equal(isBlockedByAntiMutation({ ngClick: 'ctrl.excluirRegistro()' }).blocked, true);
    assert.equal(isBlockedByAntiMutation({ iconClass: 'fa fa-trash' }).blocked, true);
    assert.equal(isBlockedByAntiMutation({ iconClass: 'glyphicon glyphicon-floppy-disk' }).blocked, true);
  });

  it('permite Cancelar/Fechar/Voltar/× exclusivamente no descarte de modal aberto', () => {
    assert.equal(isBlockedByAntiMutation({ label: 'Cancelar' }).blocked, true);
    assert.equal(isBlockedByAntiMutation({ label: 'Cancelar' }, { allowModalDiscard: true }).blocked, false);
    assert.equal(isBlockedByAntiMutation({ label: 'Fechar' }, { allowModalDiscard: true }).blocked, false);
    assert.equal(isBlockedByAntiMutation({ label: 'Voltar' }, { allowModalDiscard: true }).blocked, false);
    // Mesmo em descarte de modal, "Cancelar ato" continua bloqueado
    assert.equal(isBlockedByAntiMutation({ label: 'Cancelar ato' }, { allowModalDiscard: true }).blocked, true);
  });

  it('classifica abridores seguros e rejeita combinações com palavras de mutação', () => {
    assert.deepEqual(classifySafeOpener({ label: '+ Novo protocolo' }), { safe: true, kind: 'form_opener' });
    assert.deepEqual(classifySafeOpener({ label: 'Nova Ficha' }), { safe: true, kind: 'form_opener' });
    assert.deepEqual(classifySafeOpener({ label: 'Adicionar' }), { safe: true, kind: 'form_opener' });
    assert.deepEqual(classifySafeOpener({ label: 'Visualizar' }), { safe: true, kind: 'form_opener' });
    assert.deepEqual(classifySafeOpener({ label: 'Filtros' }), { safe: true, kind: 'advanced_filters' });
    assert.deepEqual(classifySafeOpener({ label: 'Pesquisa avançada' }), { safe: true, kind: 'advanced_filters' });

    // Combinações com mutação devem ser bloqueadas
    assert.equal(classifySafeOpener({ label: 'Gerar novo selo' }).safe, false);
    assert.equal(classifySafeOpener({ label: 'Emitir nova certidão' }).safe, false);
    assert.equal(classifySafeOpener({ label: 'Nova senha' }).safe, false);
    assert.equal(classifySafeOpener({ label: 'Novo', ngClick: 'vm.salvarNovo()' }).safe, false);

    assert.equal(isSafeSearchButton({ label: 'Pesquisar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Buscar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Consultar' }), true);
    assert.equal(isSafeSearchButton({ label: 'Salvar' }), false);

    assert.equal(isReadOnlySearchEndpoint('/api/firmas/pesquisar?nome=a'), true);
    assert.equal(isReadOnlySearchEndpoint('/api/atos/listar'), true);
    assert.equal(isReadOnlySearchEndpoint('/businessFirmas/services/paisUtil/getAllPais'), true);
    assert.equal(isReadOnlySearchEndpoint('/g/collect?v=2&tid=G-123'), true);
    assert.equal(isReadOnlySearchEndpoint('/spellcheck31/script/ssrv.cgi'), true);
    assert.equal(isReadOnlySearchEndpoint('/businessFirmas/services/ordemServico/registerOrdemServico'), false);
    assert.equal(isReadOnlySearchEndpoint('/api/firmas/salvar'), false);
    assert.equal(isReadOnlySearchEndpoint('/api/atos/excluir/1'), false);
  });

  it('planeja ações seguras por tela e respeita limite 25 vs ilimitado para Parametrizações', () => {
    const screen = makeMockScreen({
      tabs: [
        { label: 'Geral', active: true, disabled: false },
        { label: 'Histórico', active: false, disabled: false }
      ],
      accordions: [{ label: 'Filtros extras', expanded: false }],
      buttons: [
        { label: 'Novo', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false },
        { label: 'Salvar', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: true },
        { label: 'Pesquisar', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false }
      ],
      tables: [{ headers: ['Nome'], rowCount: 0, isEmpty: true, emptyText: 'Vazio', rowActionIcons: [] }]
    });

    const plan = planScreenExploration(screen);
    assert.equal(plan.eligible, true);
    assert.equal(plan.maxStatesLimit, 25);
    assert.deepEqual(
      plan.actions.map(a => `${a.kind}:${a.triggerLabel}`),
      ['tab:Histórico', 'accordion:Filtros extras', 'form_opener:Novo', 'search_grid_reveal:Pesquisar']
    );

    const paramScreen = makeMockScreen({
      id: '095',
      modulo: 'Configurações',
      chain: ['Configurações', 'Parametrizações'],
      slug: 'configuracoes-parametrizacoes',
      tabs: Array.from({ length: 32 }, (_, idx) => ({
        label: `Aba ${idx + 1}`,
        active: idx === 0,
        disabled: false
      }))
    });
    const paramPlan = planScreenExploration(paramScreen);
    assert.equal(paramPlan.maxStatesLimit, 100);
    assert.equal(paramPlan.actions.length, 31);
  });

  it('gera allKnownElements, iconDictionary, fingerprint e preserva compatibilidade L1', () => {
    const rootScreen = makeMockScreen({
      buttons: [{ label: 'Novo', tooltip: 'Nova ficha', iconClass: 'fa fa-plus', kind: 'button', disabled: false, isMutationLike: false }],
      fields: [{ label: 'Nome', type: 'text', required: false, disabled: false, readonly: false, placeholder: '', options: [], section: '' }],
      tables: [{ headers: ['CPF'], rowCount: 0, isEmpty: true, emptyText: '', rowActionIcons: ['fa-eye'] }]
    });

    const sub: ScreenSubState = {
      id: '010-s01',
      kind: 'modal_opener',
      triggerLabel: 'Novo',
      openedAs: 'modal',
      routeHash: '#/firmas/fichas',
      modalTitle: 'Nova Ficha',
      fingerprint: computeStateFingerprint({
        routeHash: '#/firmas/fichas',
        modalTitle: 'Nova Ficha',
        fields: [{ label: 'CPF', type: 'text' }]
      }),
      screenshot: 'auditoria/mapeamento-telas/nivel-2/firmas/010-firmas-fichas__open-novo.png',
      restoredCleanly: true,
      status: 'captured',
      error: null,
      buttons: [{ label: 'Fechar', tooltip: '', iconClass: '', kind: 'button', disabled: false, isMutationLike: false }],
      fields: [{ label: 'CPF', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: 'Dados' }],
      tabs: [],
      accordions: [],
      tables: [],
      alerts: [],
      capturedAt: '2026-11-24T20:05:00Z'
    };

    const enriched = enrichScreenWithLevel2(rootScreen, {
      level2Status: 'explored',
      subStates: [sub]
    });

    assert.equal(enriched.level2Status, 'explored');
    assert.ok(enriched.allKnownElements);
    assert.equal(enriched.allKnownElements.fields.find(f => f.label === 'Nome')?.where, 'root');
    assert.equal(enriched.allKnownElements.fields.find(f => f.label === 'CPF')?.where, 'modal:Novo');
    assert.equal(enriched.allKnownElements.rowActions[0]?.where, 'grid_row');
    assert.ok(enriched.iconDictionary?.['fa-plus']);
    assert.ok(enriched.iconDictionary?.['fa-eye']);

    const l2Catalog = buildOrionScreenCatalog([enriched]);
    assert.equal(l2Catalog.level, 2);
    assert.equal(l2Catalog.stats.level2?.explored, 1);

    const l1Catalog = buildOrionScreenCatalog([rootScreen]);
    assert.equal(l1Catalog.level, 1);
    assert.equal(l1Catalog.stats.level2, undefined);
  });

  it('restaura estado limpo após modal/sub-rota e parseia CLI flags Nível 2', async () => {
    const cli = parseLevel2CliFlags([
      '--module=Firmas',
      '--only=configuracoes-parametrizacoes',
      '--resume',
      '--max-states-per-screen=10',
      '--dry-run-plan'
    ]);
    assert.deepEqual(cli, {
      module: 'Firmas',
      only: 'configuracoes-parametrizacoes',
      resume: true,
      maxStatesPerScreen: 10,
      dryRunPlan: true,
      timeoutMs: 12000
    });

    // Mock de AgentBrowserClient para testar restauração limpa
    let modalOpen = 1;
    let currentHash = '#/firmas/fichas/novo';
    const mockClient: any = {
      closeSecondaryTabs: async () => 0,
      evalJson: async (script: string) => {
        if (script.includes('window.location.hash')) return currentHash;
        if (script.includes("btn.click(); return JSON.stringify(true)")) {
          currentHash = '#/firmas/fichas';
          return true;
        }
        if (script.includes('ACTIVE_MODAL_SELECTOR') || script.includes('.modal.in')) {
          if (script.includes('btn.click()')) {
            modalOpen = 0;
            return 'closed';
          }
          return modalOpen;
        }
        return modalOpen;
      },
      wait: async () => '',
      pressKey: async (key: string) => {
        if (key === 'Escape') modalOpen = 0;
        return '';
      },
      jumpHash: async (h: string) => {
        currentHash = h;
        return '';
      }
    };

    const restored = await restoreCleanScreenState(mockClient, '#/firmas/fichas');
    assert.equal(restored, true);
    assert.equal(modalOpen, 0);
    assert.equal(currentHash, '#/firmas/fichas');

    const filtered = filterCatalogEntriesForLevel2(
      [
        makeMockScreen({ id: '001', level2Status: 'explored' }),
        makeMockScreen({ id: '002', level2Status: 'partial' }),
        makeMockScreen({ id: '003' })
      ],
      { resume: true }
    );
    assert.deepEqual(filtered.map(f => f.id), ['002', '003']);
  });
});
