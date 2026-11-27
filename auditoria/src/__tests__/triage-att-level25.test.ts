import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  classifyAttRoutine,
  DEFAULT_SCREEN_CATALOG_FILE,
  matchCatalogScreenForRoute,
  parseAttReportMarkdown,
  type ParsedAttReport
} from '../triage-att-with-catalog.js';
import { findCatalogRevealHints } from '../reveal-explorer.js';
import { setRouteGraphForTesting, setScreenCatalogForTesting, type OrionScreenCatalog } from '../route-crawler.js';
import { ROUTE_LABEL_SYNONYMS, routeKey } from '../route-synonyms.js';
import type { CanonicalMenuItem } from '../menu-canonical.js';
import { chooseMenuItem, type MenuTreeItem } from '../menu-path.js';
import type { MenuCatalog } from '../menu-catalog.js';
import type { ScreenCatalogEntry } from '../screen-catalog-extractor.js';

const baseMenuCatalog: MenuCatalog = {
  version: '06.05.02',
  capturedAt: '2026-11-26T00:00:00Z',
  environment: 'Produtos',
  source: { markdown: '', manifest: '' },
  userMenuRoot: 'Olá, [usuário]',
  pathCount: 2,
  paths: [
    {
      chain: ['Configurações', 'Perfis e permissões de acesso'],
      depth: 2,
      isLeaf: true,
      parentModule: 'Configurações',
      printProof: '',
      aliases: []
    },
    {
      chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
      depth: 3,
      isLeaf: true,
      parentModule: 'Firmas',
      printProof: '',
      aliases: []
    }
  ],
  nodes: [
    { chain: ['Configurações'], depth: 1, hasChildren: true, isLeaf: false, parentModule: 'Configurações' },
    { chain: ['Configurações', 'Perfis e permissões de acesso'], depth: 2, hasChildren: false, isLeaf: true, parentModule: 'Configurações' },
    { chain: ['Firmas'], depth: 1, hasChildren: true, isLeaf: false, parentModule: 'Firmas' },
    { chain: ['Firmas', 'Cadastros'], depth: 2, hasChildren: true, isLeaf: false, parentModule: 'Firmas' },
    { chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'], depth: 3, hasChildren: false, isLeaf: true, parentModule: 'Firmas' }
  ],
  homonyms: [],
  nearHomonymFamilies: [],
  crossCheck: { mismatches: [], excluded: [], checkedSubmenus: 0 }
};

const canonicalItems: CanonicalMenuItem[] = baseMenuCatalog.nodes.map(n => ({
  chain: n.chain,
  hasChildren: n.hasChildren
}));

const sampleScreens: ScreenCatalogEntry[] = [
  {
    id: '009',
    modulo: 'Firmas',
    chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
    slug: 'firmas-cadastros-cartao-de-assinatura',
    status: 'captured',
    openedAs: 'route',
    routeHash: '#/ficha',
    pageTitle: 'Cartão de assinatura',
    screenshots: { viewport: null, fullPage: null },
    breadcrumbs: [],
    headings: ['Cartão de assinatura'],
    tabs: [],
    accordions: [],
    buttons: [{ label: 'Adicionar', tooltip: '', iconClass: '', kind: 'primary', disabled: false, isMutationLike: false }],
    fields: [],
    tables: [{ headers: ['Nome', 'CPF ou CIN'], rowCount: 0, isEmpty: true, emptyText: 'Nenhum registro', rowActionIcons: [] }],
    alerts: [],
    scrollMetrics: { scrollHeight: 900, clientHeight: 900, hasVerticalOverflow: false, innerScrollContainers: 0 },
    elementCounts: { tabs: 0, accordions: 0, buttons: 1, iconOnlyButtons: 0, fields: 0, tables: 1, alerts: 0 },
    capturedAt: '2026-11-26T00:00:00Z',
    error: null,
    level2Status: 'explored',
    subStates: [
      {
        id: 'SUB-1',
        kind: 'form_opener',
        triggerLabel: 'Adicionar',
        openedAs: 'sub_route',
        routeHash: '#/ficha/cadastrar',
        fingerprint: 'fp1',
        screenshot: null,
        restoredCleanly: true,
        status: 'captured',
        error: null,
        buttons: [],
        fields: [],
        tabs: [],
        accordions: [],
        tables: [],
        alerts: [],
        capturedAt: '2026-11-26T00:00:00Z'
      }
    ],
    allKnownElements: {
      tabs: [],
      buttons: [
        { label: 'Adicionar', tooltip: '', iconClass: '', kind: 'primary', disabled: false, isMutationLike: false, where: 'root' },
        { label: 'Preencher cartão usando I.A.', tooltip: '', iconClass: '', kind: 'secondary', disabled: false, isMutationLike: false, where: 'modal:Adicionar' },
        { label: 'Salvar', tooltip: '', iconClass: '', kind: 'primary', disabled: false, isMutationLike: true, where: 'modal:Adicionar' }
      ],
      fields: [
        { label: 'Nome', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: 'Dados pessoais', where: 'modal:Adicionar' },
        { label: 'Mês de referência', type: 'select', required: false, disabled: false, readonly: false, placeholder: '', options: [], section: '', where: 'root' }
      ],
      tableHeaders: [
        { header: 'Descrição', tableIndex: 0, where: 'root' }
      ],
      rowActions: [
        { iconClass: 'fa-pencil', tooltip: 'Alterar', where: 'grid_row' }
      ]
    }
  }
];

function makeReport(overrides: Partial<ParsedAttReport>): ParsedAttReport {
  return {
    id: 'TEST-1',
    modulo: 'firmas',
    titulo: 'Rotina teste',
    carga: 'read_only',
    tags: ['ATT'],
    folderName: '[ATT] TEST-1-rotina-teste',
    filePath: 'TEST-1.md',
    blockedStep: 3,
    blockedStepText: 'Clique em **Preencher cartão usando I.A.**.',
    steps: [{ stepNumber: 3, rawText: 'Clique em **Preencher cartão usando I.A.**.', targets: ['Preencher cartão usando I.A.'] }],
    tipoBloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)',
    motivo: 'No passo 3, o manual cita "Preencher cartão usando I.A.".',
    landingRejected: false,
    reachedRouteRaw: '#/ficha/cadastrar',
    reachedRouteKey: '#/ficha/cadastrar',
    missingTargets: ['Preencher cartão usando I.A.'],
    ...overrides
  };
}

describe('Triagem Offline das [ATT] contra Catálogo Nível 2.5', () => {
  const deps = {
    screens: sampleScreens,
    menuCatalog: baseMenuCatalog,
    canonicalItems,
    hardwareIds: new Set<string>(['C-FIRMA-HW'])
  };

  it('classifica em Fila 1A quando alvo existe literalmente em sub-estado / sub-rota', () => {
    const res = classifyAttRoutine(makeReport({}), deps);
    assert.equal(res.queue, 'fila_1_destravavel');
    assert.equal(res.subCause, '1A_substate_literal');
    assert.equal(res.matchedScreenId, '009');
    assert.equal(res.matchedVia, 'sub_route');
  });

  it('classifica em Fila 1B quando passo 1-3 tem equivalência canônica de menu e coerência downstream', () => {
    const res = classifyAttRoutine(
      makeReport({
        id: 'TEST-MENU',
        blockedStep: 1,
        blockedStepText: 'Acesse **Firmas > Cadastros > Fichas / Cartões de Assinatura**.',
        steps: [
          { stepNumber: 1, rawText: 'Acesse **Firmas > Cadastros > Fichas / Cartões de Assinatura**.', targets: ['Firmas > Cadastros > Fichas / Cartões de Assinatura'] },
          { stepNumber: 2, rawText: 'Clique em **Adicionar**.', targets: ['Adicionar'] }
        ],
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe.',
        reachedRouteRaw: '#/inicio',
        reachedRouteKey: '#/inicio',
        missingTargets: []
      }),
      deps
    );
    assert.equal(res.queue, 'fila_1_destravavel');
    assert.equal(res.subCause, '1B_menu_canonical');
    assert.deepEqual(res.menuSuggestion?.resolvedChain, ['Firmas', 'Cadastros', 'Cartão de assinatura']);
  });

  it('classifica em Fila 1C quando há candidato similar >= 0.65 compatível', () => {
    const res = classifyAttRoutine(
      makeReport({
        id: 'TEST-SIM',
        blockedStepText: 'Informe o **Mês referência** desejado.',
        missingTargets: ['Mês referência']
      }),
      deps
    );
    assert.equal(res.queue, 'fila_1_destravavel');
    assert.equal(res.subCause, '1C_similar_candidate');
    assert.equal(res.targetDiagnoses[0]?.bestMatch?.matchedLabel, 'Mês de referência');
  });

  it('ADR-035: veta cabeçalho de coluna (th) em passo de preenchimento de campo, mantendo Fila 2', () => {
    const res = classifyAttRoutine(
      makeReport({
        id: 'TEST-TH-VETO',
        blockedStepText: 'Preencha o campo **Descrição** com o nome do cartão.',
        missingTargets: ['Descrição']
      }),
      deps
    );
    assert.equal(res.queue, 'fila_2_att_legitimo');
    assert.equal(res.subCause, '2_lista_ouro_confirmada');
    assert.deepEqual(res.targetDiagnoses[0]?.rejectedTableHeaders, ['Descrição']);
  });

  it('classifica em Fila 3 quando passo exige linha na grade vazia ou hardware', () => {
    const gridRes = classifyAttRoutine(
      makeReport({
        id: 'TEST-GRID',
        reachedRouteRaw: '#/ficha',
        reachedRouteKey: '#/ficha',
        blockedStepText: 'Na grade de registros, clique no ícone **Alterar** da primeira linha.',
        missingTargets: ['Alterar']
      }),
      deps
    );
    assert.equal(gridRes.queue, 'fila_3_ddd_xrx');
    assert.equal(gridRes.subCause, '3_grade_vazia_ou_registro');

    const hwRes = classifyAttRoutine(makeReport({ id: 'C-FIRMA-HW' }), deps);
    assert.equal(hwRes.queue, 'fila_3_ddd_xrx');
    assert.equal(hwRes.subCause, '3_hardware_ou_servico_externo');
  });

  it('faz o parse fiel de frontmatter CRLF e fallback de alvos em relatórios [ATT]', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'att-parse-'));
    const mdFile = path.join(tmpDir, '[ATT] X-1-teste-revisado.md');
    const content = [
      '---',
      'id: X-1',
      'titulo: Teste CRLF',
      'modulo: config',
      'auditoria_ui:',
      '  review_tags: ["ATT"]',
      '  carga: read_only',
      '  tipo_bloqueio: "Defasagem Editorial do Manual (Recurso Inexistente na Tela)"',
      '  diagnostico_tela_att:',
      '    passo: 2',
      '    rota: "#/configuracoes"',
      '    alvos_sem_correspondencia: []',
      '---',
      '',
      '> [!CAUTION]',
      '> **Motivo Técnico:** No passo 2, o manual cita "Parâmetros gerais".',
      '',
      '#### Passo a passo (texto original preservado):',
      '1. Acesse **Configurações > Parametrizações**.',
      '2. Selecione **Parâmetros gerais**.'
    ].join('\r\n');
    fs.writeFileSync(mdFile, content, 'utf-8');
    try {
      const parsed = parseAttReportMarkdown(mdFile, 'config', '[ATT] X-1-teste');
      assert.ok(parsed);
      assert.equal(parsed.id, 'X-1');
      assert.equal(parsed.blockedStep, 2);
      assert.equal(parsed.reachedRouteKey, '#/configuracoes');
      assert.deepEqual(parsed.missingTargets, ['Parâmetros gerais']);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('Etapa 2 — Integridade de ROUTE_LABEL_SYNONYMS (ADR-035) e Bridge L2.5', () => {
  it('não possui chaves duplicadas (route, documented) nem colisões proibidas', () => {
    const keys = new Set<string>();
    const norm = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    for (const s of ROUTE_LABEL_SYNONYMS) {
      const k = `${routeKey(s.route)}|${norm(s.documented)}`;
      assert.equal(keys.has(k), false, `Chave duplicada em ROUTE_LABEL_SYNONYMS: ${k}`);
      keys.add(k);
      assert.ok(s.real.length >= 1, `Sinônimo sem rótulo real: ${k}`);
      assert.ok(s.evidence.length >= 15, `Sinônimo sem evidência documentada: ${k}`);
    }
    const forbidden = [
      ['Ativo', 'Inativos'],
      ['Importar', 'Exportar'],
      ['Incluir', 'Concluir'],
      ['Editar', 'Auditar']
    ];
    for (const [doc, real] of forbidden) {
      const hit = ROUTE_LABEL_SYNONYMS.find(
        s => norm(s.documented) === norm(doc) && s.real.some(r => norm(r) === norm(real))
      );
      assert.equal(hit, undefined, `Colisão semântica proibida encontrada: ${doc} -> ${real}`);
    }
  });

  it('sinônimos curados na Etapa 2 existem em orion-screen-catalog.json com tipo compatível (nunca apenas th)', () => {
    const rawCatalog = JSON.parse(fs.readFileSync(DEFAULT_SCREEN_CATALOG_FILE, 'utf-8')) as {
      screens: ScreenCatalogEntry[];
    };
    const curatedRoutes = new Set([
      '#/configuracaoImpressaoModelo/cadastrar',
      '#/sinalPublico/cadastrar',
      '#/categoria/cadastrar',
      '#/ficha/cadastrar',
      '#/produto/cadastrar',
      '#/pedidoFirmas/cadastrar',
      '#/protocolo/cadastrar'
    ]);
    const curatedEntries = ROUTE_LABEL_SYNONYMS.filter(
      s =>
        curatedRoutes.has(s.route) ||
        (s.route === '#/configuracoes' &&
          (s.documented === 'Prazo de entrega padrão (dias)' || s.documented === 'Agência'))
    );
    assert.ok(curatedEntries.length >= 10, 'esperado ao menos 10 sinônimos curados na Etapa 2');

    const norm = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s+]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

    for (const syn of curatedEntries) {
      const match = matchCatalogScreenForRoute(syn.route, rawCatalog.screens);
      assert.ok(match, `Rota não encontrada no catálogo L2.5 para sinônimo ${syn.route}: ${syn.documented}`);
      const all = match.screen.allKnownElements;
      assert.ok(all, `Tela ${match.screen.id} sem allKnownElements`);
      for (const realLabel of syn.real) {
        const want = norm(realLabel);
        const inFields = (all.fields ?? []).some(f => norm(f.label) === want);
        const inButtons = (all.buttons ?? []).some(b => norm(b.label) === want || norm(b.tooltip) === want);
        const inTabs = (all.tabs ?? []).some(t => norm(t.label) === want);
        if (syn.kind === 'field') {
          assert.equal(inFields, true, `Campo real "${realLabel}" ausente em allKnownElements.fields na rota ${syn.route} (${match.screen.id})`);
        } else if (syn.kind === 'button') {
          assert.equal(inButtons, true, `Botão real "${realLabel}" ausente em allKnownElements.buttons na rota ${syn.route} (${match.screen.id})`);
        } else if (syn.kind === 'tab') {
          assert.equal(inTabs, true, `Aba real "${realLabel}" ausente em allKnownElements.tabs na rota ${syn.route} (${match.screen.id})`);
        }
      }
    }
  });

  it('findCatalogRevealHints expande routeSynonymsFor para localizar alvo renomeado dentro de aba/modal L2.5', () => {
    const cat: OrionScreenCatalog = {
      version: '06.05.02',
      level: 2,
      screens: [
        {
          ...sampleScreens[0],
          id: '110',
          routeHash: '#/configuracoes',
          chain: ['Configurações', 'Parametrizações'],
          subStates: [
            {
              id: 'SUB-CERT',
              kind: 'tab',
              triggerLabel: 'Certidão',
              openedAs: 'tab',
              routeHash: '#/configuracoes',
              activeTab: 'Certidão',
              fingerprint: 'fp-cert',
              screenshot: null,
              restoredCleanly: true,
              status: 'captured',
              error: null,
              buttons: [],
              fields: [],
              tabs: [],
              accordions: [],
              tables: [],
              alerts: [],
              capturedAt: '2026-11-26T00:00:00Z'
            }
          ],
          allKnownElements: {
            tabs: [{ label: 'Certidão', active: false, disabled: false, where: 'root' }],
            buttons: [],
            fields: [
              {
                label: 'Previsão de entrega',
                type: 'text',
                required: false,
                disabled: false,
                readonly: false,
                placeholder: '',
                options: [],
                section: '',
                where: 'tab:Certidão'
              }
            ],
            tableHeaders: [],
            rowActions: []
          }
        } as unknown as OrionScreenCatalog['screens'][number]
      ]
    };
    setRouteGraphForTesting(null);
    setScreenCatalogForTesting(cat);
    try {
      const hints = findCatalogRevealHints('#/configuracoes', ['Prazo de entrega padrão (dias)']);
      assert.equal(hints.length >= 1, true, 'deve apontar pista para aba Certidão via routeSynonymsFor');
      assert.equal(hints[0].target, 'Prazo de entrega padrão (dias)');
      assert.equal(hints[0].matchedLabel, 'Previsão de entrega');
      assert.equal(hints[0].triggerKind, 'tab');
      assert.equal(hints[0].triggerLabel, 'Certidão');
    } finally {
      setRouteGraphForTesting(undefined);
      setScreenCatalogForTesting(undefined);
    }
  });
});

describe('Fase 4 (caixa) — calibração cirúrgica pós-piloto (ADR-035)', () => {
  const normLabel = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s+]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

  it('M-65.0: "Tipo de Lançamento" -> "Tipo lançamento" é campo real da tela 102 (nunca th nem heading)', () => {
    const syn = ROUTE_LABEL_SYNONYMS.find(s => s.route === '#/tipoMovimentacaoFinanceira/cadastrar' && s.documented === 'Tipo de Lançamento');
    assert.notEqual(syn, undefined, 'sinônimo da Fase 4 presente');
    assert.equal(syn!.kind, 'field', 'tipo field');
    assert.deepEqual(syn!.real, ['Tipo lançamento'], 'rótulo real único');
    const rawCatalog = JSON.parse(fs.readFileSync(DEFAULT_SCREEN_CATALOG_FILE, 'utf-8')) as { screens: ScreenCatalogEntry[] };
    const match = matchCatalogScreenForRoute(syn!.route, rawCatalog.screens);
    assert.notEqual(match, null, 'rota no catálogo L2.5');
    const all = match!.screen.allKnownElements!;
    const want = normLabel('Tipo lançamento');
    assert.equal((all.fields ?? []).some(f => normLabel(f.label) === want), true, 'campo "Tipo lançamento" em allKnownElements.fields');
    // O vizinho "Tipo de movimentação" é outro campo: o sinônimo não pode apontar para ele
    assert.equal(syn!.real.some(r => normLabel(r) === normLabel('Tipo de movimentação')), false, 'sem colisão com Tipo de movimentação');
  });

  const item = (chain: string[], extra: Partial<MenuTreeItem> = {}): MenuTreeItem => ({
    chain,
    selectors: chain.map((_, i) => `[s${i}]`),
    disabled: false,
    hasChildren: false,
    ...extra
  });
  const doc = { segments: ['Administração', 'Mensalistas'], sourceText: '**Administração > Mensalistas**' };

  it('M-1.0: caminho que termina num submenu desce ao único filho homônimo (cura registrada, nunca exata)', () => {
    const items = [
      item(['Administração', 'Mensalistas'], { hasChildren: true }),
      item(['Administração', 'Mensalistas', 'Mensalistas']),
      item(['Administração', 'Mensalistas', 'Filiais']),
      item(['Administração', 'Mensalistas', 'Faturamento'])
    ];
    const m = chooseMenuItem([doc], items);
    assert.deepEqual(m?.item.chain, ['Administração', 'Mensalistas', 'Mensalistas'], 'filho homônimo escolhido');
    assert.equal(m?.exact, false, 'divergência de rota registrada no relatório');
    assert.equal(/submenu em cascata/.test(m?.reason || ''), true, 'motivo explica o submenu');
  });

  it('submenu sem filho homônimo (ou com filho que também é submenu) segue o comportamento anterior', () => {
    const noHomonym = [item(['Administração', 'Mensalistas'], { hasChildren: true }), item(['Administração', 'Mensalistas', 'Filiais'])];
    const a = chooseMenuItem([doc], noHomonym);
    assert.deepEqual(a?.item.chain, ['Administração', 'Mensalistas'], 'sem filho homônimo: caminho exato');
    assert.equal(a?.exact, true, 'continua exato');
    const nested = [
      item(['Administração', 'Mensalistas'], { hasChildren: true }),
      item(['Administração', 'Mensalistas', 'Mensalistas'], { hasChildren: true })
    ];
    assert.equal(chooseMenuItem([doc], nested)?.exact, true, 'filho homônimo que também é submenu não é adivinhado');
    const leaf = [item(['Administração', 'Mensalistas'])];
    assert.equal(chooseMenuItem([doc], leaf)?.exact, true, 'folha exata sem filhos: inalterado');
  });
});
