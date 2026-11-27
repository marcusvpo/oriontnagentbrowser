import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, beforeEach, describe, test } from 'node:test';
import yaml from 'yaml';
import {
  attDiagnosisYamlLines,
  buildAttDiagnosis,
  renderAttDiagnosisTip,
  type ScreenStructuralInventory
} from '../att-screen-advisor.js';
import {
  findCatalogRevealHints,
  parseWhereLocation,
  rankTriggers,
  type RevealTrigger
} from '../reveal-explorer.js';
import {
  findRouteEntriesByTabOrSection,
  findRouteEntryByChain,
  findRouteEntryByHash,
  findScreenCatalogEntryByChain,
  findScreenCatalogEntryByHash,
  findScreenCatalogHints,
  loadCachedScreenCatalog,
  setRouteGraphForTesting,
  setScreenCatalogForTesting,
  type OrionRouteGraph,
  type OrionScreenCatalog
} from '../route-crawler.js';

const SAMPLE_CATALOG: OrionScreenCatalog = {
  version: '06.05.02',
  level: 1,
  screens: [
    {
      id: 'SCR-FIRMAS-001',
      modulo: 'Firmas',
      chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
      slug: 'firmas-cadastros-cartao-de-assinatura',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/firmas/cartao-assinatura',
      pageTitle: 'Cartão de Assinatura',
      tabs: [
        { label: 'Dados Pessoais', active: true, disabled: false },
        { label: 'Biometria', active: false, disabled: false },
        { label: 'Procuradores', active: false, disabled: false }
      ],
      headings: ['Identificação do Outorgante', 'Observações'],
      buttons: [
        { label: 'Salvar', tooltip: '', iconClass: '', kind: 'primary', disabled: false, isMutationLike: true },
        { label: '', tooltip: 'Capturar Digital', iconClass: 'fa-fingerprint', kind: 'icon_only', disabled: false, isMutationLike: false },
        { label: 'Imprimir Ficha', tooltip: '', iconClass: '', kind: 'secondary', disabled: false, isMutationLike: false }
      ],
      fields: [
        { label: 'CPF/CNPJ', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: '' },
        { label: 'Nome Completo', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: '' },
        { label: 'Data de Nascimento', type: 'date', required: false, disabled: false, readonly: false, placeholder: '', options: [], section: '' }
      ],
      tables: [
        { title: 'Histórico de Alterações', headers: ['Data', 'Usuário'] },
        { headers: ['Documentos Anexos', 'Tipo'] }
      ]
    },
    {
      id: 'SCR-CONF-002',
      modulo: 'Configurações',
      chain: ['Configurações', 'Parametrizações'],
      slug: 'configuracoes-parametrizacoes',
      status: 'captured',
      openedAs: 'route',
      routeHash: '#/configuracao/parametrizacao',
      pageTitle: 'Parametrizações do Sistema',
      tabs: ['Geral', 'Comunicação SEFAZ', 'Certidões'],
      headings: ['Dados do Cartório', 'Integração'],
      buttons: ['Salvar', 'Testar Conexão'],
      fields: ['Prazo de entrega (dias)', 'Token SEFAZ'],
      tables: ['Grade de Emolumentos']
    }
  ]
};

describe('ADR-038 — Integração do Catálogo de Telas Nível 1 (offline)', () => {
  beforeEach(() => {
    setRouteGraphForTesting(null);
    setScreenCatalogForTesting(null);
  });

  after(() => {
    setRouteGraphForTesting(undefined);
    setScreenCatalogForTesting(undefined);
  });

  test('fallback seguro quando orion-screen-catalog.json não existe em disco', () => {
    const missing = path.join(os.tmpdir(), `nao-existe-orion-screen-catalog-${Date.now()}.json`);
    assert.equal(loadCachedScreenCatalog(missing), null);
    assert.equal(findScreenCatalogEntryByChain(['Firmas', 'Cadastros', 'Cartão de assinatura']), null);
    assert.equal(findScreenCatalogEntryByHash('#/firmas/cartao-assinatura'), null);
    assert.equal(findRouteEntryByChain(['Firmas', 'Cadastros', 'Cartão de assinatura']), null);
    assert.equal(findRouteEntryByHash('#/firmas/cartao-assinatura'), null);
    assert.deepEqual(findRouteEntriesByTabOrSection('Biometria'), []);
    assert.deepEqual(findScreenCatalogHints('Biometria'), []);
  });

  test('cache por mtimeMs ao ler arquivo temporário e invalidação ao atualizar', () => {
    const tmpFile = path.join(os.tmpdir(), `orion-screen-catalog-test-${Date.now()}.json`);
    try {
      fs.writeFileSync(tmpFile, JSON.stringify(SAMPLE_CATALOG), 'utf-8');
      const first = loadCachedScreenCatalog(tmpFile);
      const second = loadCachedScreenCatalog(tmpFile);
      assert.ok(first);
      assert.equal(first, second, 'segunda leitura com mesmo mtimeMs deve retornar o objeto em cache');
      assert.equal(first.screens.length, 2);

      const updated: OrionScreenCatalog = {
        ...SAMPLE_CATALOG,
        screens: [SAMPLE_CATALOG.screens[0]]
      };
      fs.writeFileSync(tmpFile, JSON.stringify(updated), 'utf-8');
      const nextTime = new Date(Date.now() + 5000);
      fs.utimesSync(tmpFile, nextTime, nextTime);

      const third = loadCachedScreenCatalog(tmpFile);
      assert.ok(third);
      assert.equal(third.screens.length, 1, 'alteração de mtimeMs deve invalidar o cache');
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test('setScreenCatalogForTesting: route-crawler enriquece buscas por chain, hash, tabs, fields, buttons e tables', () => {
    setScreenCatalogForTesting(SAMPLE_CATALOG);

    // Sem orion-route-graph.json, findRouteEntryByChain/Hash usa fallback do catálogo Nível 1
    const byChain = findRouteEntryByChain(['Firmas', 'Cadastros', 'Cartão de assinatura']);
    assert.ok(byChain);
    assert.equal(byChain.hash, '#/firmas/cartao-assinatura');
    assert.deepEqual(byChain.tabs, ['Dados Pessoais', 'Biometria', 'Procuradores']);
    assert.deepEqual(byChain.fields, ['CPF/CNPJ', 'Nome Completo', 'Data de Nascimento']);
    assert.deepEqual(byChain.buttons, ['Salvar', 'Capturar Digital', 'Imprimir Ficha']);
    assert.deepEqual(byChain.tables, ['Histórico de Alterações', 'Data', 'Usuário', 'Documentos Anexos', 'Tipo']);

    const byHash = findRouteEntryByHash('#/firmas/cartao-assinatura/42?modo=edicao');
    assert.ok(byHash);
    assert.equal(byHash.title, 'Cartão de Assinatura');

    // Quando orion-route-graph.json existe parcialmente, o catálogo enriquece campos ausentes sem sobrescrever os vivos
    const partialGraph: OrionRouteGraph = {
      capturedAt: '2026-11-24T00:00:00Z',
      environment: 'Produtos',
      totalMenus: 10,
      totalRoutes: 1,
      entries: [
        {
          modulo: 'Firmas',
          chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
          hash: '#/firmas/cartao-assinatura',
          title: 'Título Vivo',
          tabs: ['Dados Pessoais'],
          sections: []
        }
      ]
    };
    setRouteGraphForTesting(partialGraph);

    const enriched = findRouteEntryByChain(['Firmas', 'Cadastros', 'Cartão de assinatura']);
    assert.ok(enriched);
    assert.equal(enriched.title, 'Título Vivo', 'não sobrescreve título vivo do grafo');
    assert.deepEqual(enriched.tabs, ['Dados Pessoais'], 'não sobrescreve abas vivas do grafo');
    assert.deepEqual(enriched.sections, ['Identificação do Outorgante', 'Observações'], 'preenche seções vazias a partir do catálogo');
    assert.deepEqual(enriched.fields, ['CPF/CNPJ', 'Nome Completo', 'Data de Nascimento']);
    assert.deepEqual(enriched.tables, ['Histórico de Alterações', 'Data', 'Usuário', 'Documentos Anexos', 'Tipo']);

    // Busca auxiliar em tabs/sections inclui rotas do catálogo
    const routeHints = findRouteEntriesByTabOrSection('Comunicação SEFAZ');
    assert.equal(routeHints.length, 1);
    assert.equal(routeHints[0].entry.hash, '#/configuracao/parametrizacao');
    assert.equal(routeHints[0].matchedIn, 'tab');

    // Busca rica no catálogo Nível 1 encontra buttons, fields e tables
    const btnHints = findScreenCatalogHints('Capturar Digital');
    assert.equal(btnHints[0]?.matchedIn, 'button');
    assert.equal(btnHints[0]?.entry.id, 'SCR-FIRMAS-001');

    const tblHints = findScreenCatalogHints('Grade de Emolumentos');
    assert.equal(tblHints[0]?.matchedIn, 'table');
    assert.equal(tblHints[0]?.entry.id, 'SCR-CONF-002');
  });

  test('att-screen-advisor integra pistas do catálogo Nível 1 preservando 100% a Evidência Estrita (ADR-017)', () => {
    setScreenCatalogForTesting(SAMPLE_CATALOG);

    // Inventário ao vivo da tela atual (#/firmas/cartao-assinatura) sem o botão 'Capturar Digital' visível no recorte atual
    // e sem a aba 'Comunicação SEFAZ' (que pertence a outra rota)
    const liveInventory: ScreenStructuralInventory = {
      route: '#/firmas/cartao-assinatura',
      title: 'Cartão de Assinatura',
      inModal: false,
      sections: ['Identificação do Outorgante'],
      tabs: [{ label: 'Dados Pessoais', active: true }],
      fields: [{ label: 'CPF/CNPJ', type: 'text', section: 'Identificação do Outorgante' }],
      buttons: [{ label: 'Salvar', primary: true }]
    };

    const diag = buildAttDiagnosis({
      stepNumber: 3,
      stepText: 'Clique em **Capturar Digital** e depois configure **Token SEFAZ**.',
      targets: ['Capturar Digital', 'Token SEFAZ'],
      inventory: liveInventory,
      now: new Date('2026-11-24T12:00:00Z')
    });

    // Evidência Estrita (ADR-017): sugestões e unmatched vêm EXCLUSIVAMENTE do DOM ao vivo
    assert.equal(diag.suggestions.length, 0, 'catálogo nunca fabrica sugestão como se fosse medição ao vivo');
    assert.deepEqual(diag.unmatched, ['Capturar Digital', 'Token SEFAZ']);
    assert.ok(diag.rewriteHint?.includes('não tem correspondente funcional nesta tela'));

    // Contexto consultivo da tela atual via Catálogo Nível 1
    assert.ok(diag.catalogContext);
    assert.equal(diag.catalogContext.screenId, 'SCR-FIRMAS-001');
    assert.equal(diag.catalogContext.menuPath, 'Firmas > Cadastros > Cartão de assinatura');
    assert.deepEqual(diag.catalogContext.tables, ['Histórico de Alterações', 'Data', 'Usuário', 'Documentos Anexos', 'Tipo']);
    assert.ok(
      diag.catalogContext.matchedElements?.some(m => m.target === 'Capturar Digital' && m.kind === 'button' && m.label === 'Capturar Digital'),
      'deve apontar pista consultiva do botão mapeado no catálogo Nível 1'
    );

    // Pista em outra rota vinda do campo no Catálogo Nível 1
    assert.ok(diag.crossRouteHints?.some(h => h.target === 'Token SEFAZ' && h.route === '#/configuracao/parametrizacao' && h.matchedIn === 'field' && h.source === 'screen-catalog'));

    // Renderização do TIP e YAML válido
    const tip = renderAttDiagnosisTip(diag);
    assert.ok(tip.includes('Contexto do Catálogo Nível 1 (`SCR-FIRMAS-001`, consultivo)'));
    assert.ok(tip.includes('Capturar Digital'));

    const parsedYaml = yaml.parse(attDiagnosisYamlLines(diag).join('\n'));
    assert.equal(parsedYaml.diagnostico_tela_att.contexto_catalogo_nivel1.id_tela, 'SCR-FIRMAS-001');
    assert.equal(parsedYaml.diagnostico_tela_att.contexto_catalogo_nivel1.pistas_consultivas[0].rotulo, 'Capturar Digital');
  });
});

describe('ADR-039 — Integração Avançada do Catálogo Nível 2 (offline)', () => {
  const SAMPLE_L2_CATALOG: OrionScreenCatalog = {
    version: '06.05.02',
    level: 2,
    screens: [
      {
        ...SAMPLE_CATALOG.screens[0],
        level2Status: 'explored',
        subStates: [
          {
            id: 'SUB-01',
            kind: 'tab',
            triggerLabel: 'Biometria',
            openedAs: 'tab',
            routeHash: '#/firmas/cartao-assinatura',
            activeTab: 'Biometria',
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
            alerts: []
          },
          {
            id: 'SUB-02',
            kind: 'modal_opener',
            triggerLabel: 'Adicionar Procurador',
            parentTab: 'Procuradores',
            openedAs: 'modal',
            routeHash: '#/firmas/cartao-assinatura',
            modalTitle: 'Novo Procurador',
            fingerprint: 'fp2',
            screenshot: null,
            restoredCleanly: true,
            status: 'captured',
            error: null,
            buttons: [],
            fields: [],
            tabs: [],
            accordions: [],
            tables: [],
            alerts: []
          },
          {
            id: 'SUB-03',
            kind: 'search_grid_reveal',
            triggerLabel: 'Pesquisar',
            openedAs: 'grid_reveal',
            routeHash: '#/firmas/cartao-assinatura',
            fingerprint: 'fp3',
            screenshot: null,
            restoredCleanly: true,
            status: 'captured',
            error: null,
            buttons: [],
            fields: [],
            tabs: [],
            accordions: [],
            tables: [],
            alerts: []
          }
        ],
        allKnownElements: {
          tabs: [
            { label: 'Dados Pessoais', active: true, disabled: false, where: 'root' },
            { label: 'Biometria', active: false, disabled: false, where: 'root' },
            { label: 'Procuradores', active: false, disabled: false, where: 'root' }
          ],
          buttons: [
            { label: 'Salvar', tooltip: '', iconClass: '', kind: 'primary', disabled: false, isMutationLike: true, where: 'root' },
            { label: 'Capturar Digital', tooltip: 'Capturar Digital', iconClass: 'fa-fingerprint', kind: 'secondary', disabled: false, isMutationLike: false, where: 'tab:Biometria' },
            { label: 'Validar Poderes', tooltip: '', iconClass: '', kind: 'secondary', disabled: false, isMutationLike: false, where: 'modal:Adicionar Procurador' }
          ],
          fields: [
            { label: 'CPF/CNPJ', type: 'text', required: true, disabled: false, readonly: false, placeholder: '', options: [], section: '', where: 'root' },
            { label: 'Dedo Indicador Direito', type: 'checkbox', required: false, disabled: false, readonly: false, placeholder: '', options: [], section: '', where: 'tab:Biometria' },
            { label: 'Observação Biométrica', type: 'textarea', required: false, disabled: false, readonly: false, placeholder: '', options: [], section: '', where: 'accordion:Detalhes Técnicos' }
          ],
          tableHeaders: [
            { header: 'Data', tableIndex: 0, where: 'root' }
          ],
          rowActions: [
            { iconClass: 'fa-eye', tooltip: 'Visualizar Histórico', where: 'grid_row' }
          ]
        }
      } as OrionScreenCatalog['screens'][number]
    ]
  };

  beforeEach(() => {
    setRouteGraphForTesting(null);
    setScreenCatalogForTesting(SAMPLE_L2_CATALOG);
  });

  after(() => {
    setRouteGraphForTesting(undefined);
    setScreenCatalogForTesting(undefined);
  });

  test('reveal-explorer usa allKnownElements para priorizar gatilhos diretos (aba, accordion, modal, grade) sem dispensar DOM ao vivo', () => {
    assert.equal(parseWhereLocation('root'), null);
    assert.deepEqual(parseWhereLocation('tab:Biometria'), { triggerKind: 'tab', triggerLabel: 'Biometria' });
    assert.deepEqual(parseWhereLocation('accordion:Detalhes Técnicos'), {
      triggerKind: 'accordion',
      triggerLabel: 'Detalhes Técnicos',
      parentTab: undefined
    });

    const hints = findCatalogRevealHints('#/firmas/cartao-assinatura', ['Capturar Digital', 'Validar Poderes', 'Visualizar Histórico', 'CPF/CNPJ']);
    // CPF/CNPJ está em 'root' -> não deve gerar hint de sub-estado
    assert.equal(hints.some(h => h.target === 'CPF/CNPJ'), false);
    assert.ok(hints.some(h => h.target === 'Capturar Digital' && h.triggerKind === 'tab' && h.triggerLabel === 'Biometria'));
    assert.ok(hints.some(h => h.target === 'Validar Poderes' && h.triggerKind === 'button' && h.triggerLabel === 'Adicionar Procurador' && h.parentTab === 'Procuradores'));
    assert.ok(hints.some(h => h.target === 'Visualizar Histórico' && h.triggerKind === 'button' && h.triggerLabel === 'Pesquisar'));

    const triggers: RevealTrigger[] = [
      { kind: 'tab', label: 'Procuradores', directed: false, selector: '[t1]', box: { x: 0, y: 0, width: 80, height: 30 } },
      { kind: 'tab', label: 'Biometria', directed: false, selector: '[t2]', box: { x: 80, y: 0, width: 80, height: 30 } },
      { kind: 'button', label: 'Filtros', directed: false, selector: '[b1]', box: { x: 0, y: 40, width: 80, height: 30 } }
    ];

    const ranked = rankTriggers(triggers, ['Capturar Digital'], 'Clique em **Capturar Digital**.', hints);
    assert.equal(ranked[0].label, 'Biometria', 'aba Biometria apontada pelo L2 deve subir para o topo da fila');
    assert.equal(ranked[0].catalogDirected, true);
    assert.equal(ranked[1].label, 'Procuradores', 'aba pai de modal L2 deve ficar à frente de gatilho sem pista');
    assert.equal(ranked[1].catalogDirected, true);
    assert.equal(ranked[2].label, 'Filtros');
    assert.equal(ranked[2].catalogDirected, undefined);
  });

  test('att-screen-advisor distingue alvos em sub-estados não visitados de alvos genuinamente ausentes', () => {
    const liveInventory: ScreenStructuralInventory = {
      route: '#/firmas/cartao-assinatura',
      title: 'Cartão de Assinatura',
      inModal: false,
      sections: ['Identificação do Outorgante'],
      tabs: [
        { label: 'Dados Pessoais', active: true },
        { label: 'Biometria', active: false },
        { label: 'Procuradores', active: false }
      ],
      fields: [{ label: 'CPF/CNPJ', type: 'text', section: 'Identificação do Outorgante' }],
      buttons: [{ label: 'Salvar', primary: true }]
    };

    const diag = buildAttDiagnosis({
      stepNumber: 4,
      stepText: 'Preencha **Dedo Indicador Direito** e clique em **Botão Fantasma Inexistente**.',
      targets: ['Dedo Indicador Direito', 'Botão Fantasma Inexistente'],
      inventory: liveInventory,
      now: new Date('2026-11-24T12:00:00Z')
    });

    // Evidência Estrita preservada
    assert.equal(diag.suggestions.length, 0);
    assert.deepEqual(diag.unmatched, ['Dedo Indicador Direito', 'Botão Fantasma Inexistente']);

    assert.ok(diag.catalogContext);
    assert.equal(diag.catalogContext.level, 2);
    assert.equal(diag.catalogContext.level2Status, 'explored');
    assert.deepEqual(diag.catalogContext.unvisitedSubStateTargets, ['Dedo Indicador Direito']);
    assert.deepEqual(diag.catalogContext.genuinelyMissingTargets, ['Botão Fantasma Inexistente']);
    assert.ok(
      diag.catalogContext.matchedElements?.some(
        m => m.target === 'Dedo Indicador Direito' && m.where === 'tab:Biometria' && m.inUnvisitedSubState === true
      )
    );

    const tip = renderAttDiagnosisTip(diag);
    assert.ok(tip.includes('Contexto do Catálogo Nível 2 (`SCR-FIRMAS-001`, consultivo)'));
    assert.ok(tip.includes('aba **Biometria**'));
    assert.ok(tip.includes('Alvos em sub-estados não visitados (Catálogo Nível 2)'));
    assert.ok(tip.includes('Ausentes em toda a tela (incluindo sub-estados L2)'));

    const parsedYaml = yaml.parse(attDiagnosisYamlLines(diag).join('\n'));
    assert.equal(parsedYaml.diagnostico_tela_att.contexto_catalogo_nivel1.nivel, 2);
    assert.deepEqual(parsedYaml.diagnostico_tela_att.contexto_catalogo_nivel1.alvos_em_subestados, ['Dedo Indicador Direito']);
    assert.deepEqual(parsedYaml.diagnostico_tela_att.contexto_catalogo_nivel1.alvos_ausentes_nivel2, ['Botão Fantasma Inexistente']);
  });
});
