import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import { parsePriorAudit, buildReauditHistoryEntry, mergeHistory, emptyPriorContext, hintsForStep, chainsForStep } from '../prior-audit.js';
import { parseTabList } from '../browser.js';
import type { AgentBrowserClient } from '../browser.js';
import { subportalAffinityTerms, buildSubportalLinkScript } from '../reveal-explorer.js';
import { chooseMenuItem, type DocumentedMenuPath, type MenuTreeItem } from '../menu-path.js';
import { locateAndCaptureWithSelfHealing } from '../smart-locator.js';
import { buildRevisedRoutineDocument } from '../report.js';
import { preflightOrionReachability, maskHost, PreflightError } from '../preflight.js';
import { selectPendingRoutineIds, listHardwareRoutineIds, type DiskReportSummary } from '../hardware-registry.js';
import type { ParsedRoutine, RoutineStep } from '../types.js';

// ---------------------------------------------------------------------------------------------------------
// Fixtures: o que a auditoria anterior deixou em disco (formato real do report.ts / executor.ts)
// ---------------------------------------------------------------------------------------------------------
const PRIOR_MD_DDD = `---
id: M-40.0
titulo: 'Gerenciar Alíquotas'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-14'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  tipo_bloqueio: 'Dependência de Dados no Banco de Homologação (Grade Vazia)'
  prints_geradas: 4
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Cadastros auxiliares > Alíquota'
        elemento_real: 'Configurações > Cadastros auxiliares > Alíquotas'
        camada: menu_path_resolution
        confianca: 0.82
        texto_alterado: false
      - passo: 2
        alvo_documentado: 'Cidade'
        elemento_real: 'Município'
        camada: a11y_fuzzy_match
        confianca: 0.83
        texto_alterado: true
      - passo: 3
        alvo_documentado: 'Filtrar'
        elemento_real: 'Pesquisar'
        camada: dom_synonym_heuristic
        confianca: 0.5
        texto_alterado: true
      - passo: 4
        alvo_documentado: 'Editar'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  divergencias_editoriais:
    - tipo: unit
      passo: 4
      trecho_manual: 'em cm'
      evidencia_dom: 'coluna em mm'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**
> A auditoria automática foi interrompida: **Dependência de Dados**.
>
> **Motivo Técnico:** A grade de alíquotas não tinha registros no ambiente.

#### Passo a passo (texto original preservado):
1. Acesse **Notas > Cadastros auxiliares > Alíquota**
`;

const PRIOR_TELEMETRY_DDD = [
  { routineId: 'M-40.0', stepNum: 1, frame: 'a', status: 'ok' },
  { routineId: 'M-40.0', stepNum: 4, frame: 'a', status: 'blocked', blockKind: 'empty_data', errorMessage: 'Grade sem linhas' }
];

describe('ADR-025 §3 — PriorAuditContext (parser do que a auditoria anterior deixou em disco)', () => {
  const ctx = parsePriorAudit('M-40.0', PRIOR_MD_DDD, PRIOR_TELEMETRY_DDD);

  test('checkpoint: status, tags e passo/motivo exatos do bloqueio anterior', () => {
    assert.equal(ctx.found, true, 'contexto deve ser encontrado');
    assert.equal(ctx.status, 'dependencia_dados_banco');
    assert.deepEqual(ctx.tags, ['DDD']);
    assert.equal(ctx.block?.stepNumber, 4, 'o passo do bloqueio vem da telemetria');
    assert.equal(ctx.block?.kind, 'empty_data');
    assert.match(ctx.block?.tipo || '', /Grade Vazia/);
    assert.match(ctx.block?.motivo || '', /não tinha registros/, 'o Motivo Técnico vem do corpo do relatório');
  });

  test('a rota real de menu vira cadeia comprovada (não vira dica de rótulo)', () => {
    assert.deepEqual(chainsForStep(ctx, 1), [['Configurações', 'Cadastros auxiliares', 'Alíquotas']]);
    assert.equal(hintsForStep(ctx, 1).length, 0, 'rota de menu não é dica de rótulo');
  });

  test('só cura com confiança >= 0,68 e elemento real localizado vira dica', () => {
    assert.deepEqual(
      hintsForStep(ctx, 2).map(h => [h.documented, h.actual, h.layer]),
      [['Cidade', 'Município', 'a11y_fuzzy_match']]
    );
    assert.equal(hintsForStep(ctx, 3).length, 0, 'confiança 0,5 não é dica');
    assert.equal(hintsForStep(ctx, 4).length, 0, 'alvo não localizado nunca é dica');
  });

  test('notas editoriais anteriores são lidas para a reconfirmação ao vivo', () => {
    assert.equal(ctx.editorial.length, 1);
    assert.equal(ctx.editorial[0].kind, 'unit');
    assert.equal(ctx.editorial[0].stepNumber, 4);
  });

  test('sem relatório nem telemetria: found=false e nenhuma dica', () => {
    const none = parsePriorAudit('X-1', null, null);
    assert.equal(none.found, false);
    assert.equal(none.targetHints.length + none.menuChains.length, 0);
  });

  test('frontmatter corrompido não lança e telemetria sozinha já localiza o bloqueio', () => {
    const broken = parsePriorAudit('M-40.0', '---\nauditoria_ui: [oops\n---\ncorpo', PRIOR_TELEMETRY_DDD);
    assert.equal(broken.block?.stepNumber, 4, 'o passo do bloqueio sobrevive ao YAML inválido');
  });
});

describe('ADR-025 §3 — historico_reauditoria (Antes → Depois)', () => {
  const prior = parsePriorAudit('M-40.0', PRIOR_MD_DDD, PRIOR_TELEMETRY_DDD);

  test('rotina [DDD] que agora valida: bloqueio superado e cura reconfirmada ao vivo', () => {
    const e = buildReauditHistoryEntry(
      prior,
      {
        status: 'validado_com_ajustes',
        tags: [],
        confirmedHints: [{ stepNumber: 2, documented: 'Cidade', actual: 'Município' }],
        editorial: [{ kind: 'unit', stepNumber: 4 }]
      },
      new Date('2026-11-17T10:00:00Z')
    );
    assert.equal(e.data, '2026-11-17');
    assert.equal(e.status_anterior, 'dependencia_dados_banco');
    assert.deepEqual(e.tags_anteriores, ['DDD']);
    assert.equal(e.status_atual, 'validado_com_ajustes');
    assert.equal(e.bloqueio_superado, true);
    assert.equal(e.bloqueio_anterior?.passo, 4);
    assert.equal(e.curas_reaproveitadas.length, 2, 'a cura de rótulo (passo 2) e a rota de menu (passo 1)');
    const label = e.curas_reaproveitadas.find(c => c.passo === 2)!;
    assert.equal(label.confirmada_ao_vivo, true);
    assert.equal(label.usada_como_dica, true, 'a dica localizou o nó');
    const menu = e.curas_reaproveitadas.find(c => c.passo === 1)!;
    assert.equal(menu.real, 'Configurações > Cadastros auxiliares > Alíquotas');
    assert.equal(menu.confirmada_ao_vivo, false, 'a rota não foi reconfirmada neste cenário');
    assert.equal(e.notas_editoriais_reconfirmadas, 1);
    assert.equal(e.notas_editoriais_nao_reconfirmadas, 0);
  });

  test('bloqueia no MESMO passo: bloqueio mantido; em passo posterior: superado', () => {
    const same = buildReauditHistoryEntry(prior, { status: 'dependencia_dados_banco', tags: ['DDD'], block: { stepNumber: 4 }, confirmedHints: [], editorial: [] });
    assert.equal(same.bloqueio_superado, false, 'mesmo passo = mantido');
    const later = buildReauditHistoryEntry(prior, { status: 'atualizacao_editorial', tags: ['ATT'], block: { stepNumber: 6, tipo: 'x' }, confirmedHints: [], editorial: [] });
    assert.equal(later.bloqueio_superado, true, 'passo posterior = superado');
    assert.equal(later.bloqueio_atual?.passo, 6);
  });

  test('cura anterior não reconfirmada fica marcada como não confirmada (dica descartada)', () => {
    const e = buildReauditHistoryEntry(prior, { status: 'validado_inalterado', tags: [], confirmedHints: [], editorial: [] });
    assert.equal(e.curas_reaproveitadas.every(c => !c.confirmada_ao_vivo), true, 'nada foi medido de novo');
    assert.equal(e.notas_editoriais_nao_reconfirmadas, 1, 'nota editorial não reproduzida ao vivo não é mantida');
  });

  test('cura re-derivada pelo próprio motor (sem passar pela dica) conta como reconfirmada, mas não como "usada como dica"', () => {
    const e = buildReauditHistoryEntry(prior, {
      status: 'validado_com_ajustes',
      tags: [],
      confirmedHints: [],
      // mesmo par documentado→real, medido de novo por outra camada (grade/árvore A11y); caixa e acento não importam
      liveDivergences: [
        { stepNumber: 2, documented: 'Cidade', actual: 'MUNICÍPIO' },
        { stepNumber: 1, documented: 'Notas > Cadastros auxiliares > Alíquota', actual: 'Configurações  >  Cadastros auxiliares > Alíquotas' }
      ],
      editorial: []
    });
    const label = e.curas_reaproveitadas.find(c => c.passo === 2)!;
    assert.equal(label.confirmada_ao_vivo, true);
    assert.equal(label.usada_como_dica, false, 'a dica não foi o caminho');
    assert.equal(e.curas_reaproveitadas.find(c => c.passo === 1)!.confirmada_ao_vivo, true, 'a rota de menu também é reconfirmada');
  });

  test('outro elemento real para o mesmo alvo NÃO reconfirma a cura anterior', () => {
    const e = buildReauditHistoryEntry(prior, {
      status: 'validado_com_ajustes',
      tags: [],
      confirmedHints: [],
      liveDivergences: [{ stepNumber: 2, documented: 'Cidade', actual: 'UF' }],
      editorial: []
    });
    assert.equal(e.curas_reaproveitadas.find(c => c.passo === 2)!.confirmada_ao_vivo, false);
  });

  test('espaços duplicados do DOM ("Novo cartão  +") são normalizados na dica anterior', () => {
    const md = `---\nid: R-1.1\nauditoria_ui:\n  status: validado_com_ajustes\n  auto_cura:\n    acionada: true\n    divergencias_detectadas:\n      - passo: 4\n        alvo_documentado: '"+" (Adicionar Serviço)'\n        elemento_real: 'Novo cartão  +'\n        camada: dom_synonym_heuristic\n        confianca: 0.96\n---\ncorpo`;
    const ctx = parsePriorAudit('R-1.1', md, null);
    assert.equal(ctx.targetHints[0].actual, 'Novo cartão +', 'a medição por texto não casa com espaço duplo');
  });

  test('auditoria anterior sem bloqueio: bloqueio_superado = null', () => {
    const validated = parsePriorAudit('R-1.1', `---\nid: R-1.1\nauditoria_ui:\n  status: validado_com_ajustes\n  data_execucao: '2026-11-10'\n---\ncorpo`, null);
    const e = buildReauditHistoryEntry(validated, { status: 'validado_com_ajustes', tags: [], confirmedHints: [], editorial: [] });
    assert.equal(e.bloqueio_superado, null);
    assert.equal(e.ambiente_anterior, 'não registrado (anterior ao ADR-025)');
  });

  test('o histórico acumula e guarda só as 10 últimas entradas', () => {
    const base = emptyPriorContext('X');
    const entry = buildReauditHistoryEntry(base, { status: 'validado_inalterado', tags: [], confirmedHints: [], editorial: [] });
    base.history = Array.from({ length: 10 }, (_, i) => ({ ...entry, data: `2026-01-${String(i + 1).padStart(2, '0')}` }));
    const merged = mergeHistory(base, { ...entry, data: '2026-12-31' });
    assert.equal(merged.length, 10);
    assert.equal(merged[9].data, '2026-12-31');
    assert.equal(merged[0].data, '2026-01-02', 'a mais antiga saiu');
  });

  test('relatório: frontmatter YAML válido com historico_reauditoria e seção Evolução da Reauditoria', () => {
    const entry = buildReauditHistoryEntry(prior, {
      status: 'validado_com_ajustes',
      tags: [],
      confirmedHints: [{ stepNumber: 2, documented: 'Cidade', actual: 'Município' }],
      editorial: []
    });
    const step: RoutineStep = { stepNumber: 1, rawText: 'Acesse **Alíquotas**', targets: ['Alíquotas'], actionType: 'click', subItems: [], mainTargetCount: 1 } as RoutineStep;
    const parsed: ParsedRoutine = {
      id: 'M-40.0',
      titulo: 'Gerenciar Alíquotas',
      modulo: 'config',
      secao: 'M',
      tem_video: false,
      frontmatter: {},
      descricao: 'Descrição.',
      steps: [step],
      observacoes: [],
      rawContent: ''
    };
    const { content } = buildRevisedRoutineDocument({
      parsed,
      results: [{ stepNumber: 1, originalText: step.rawText, validatedText: step.rawText, isModified: false, screenshotRawPath: '', screenshotAnnotatedPath: '', printFiles: ['passo-01.png'], status: 'ok' }],
      divergences: [],
      status: 'validado_com_ajustes',
      ambiente: 'Produtos (teste)',
      reauditHistory: [entry]
    });
    const fm = yaml.parse(content.split('\n---\n')[0].replace(/^---\n/, ''));
    const hist = fm.auditoria_ui.historico_reauditoria;
    assert.equal(Array.isArray(hist), true, 'historico_reauditoria deve ser uma lista');
    assert.equal(hist[0].status_anterior, 'dependencia_dados_banco');
    assert.equal(hist[0].status_atual, 'validado_com_ajustes');
    assert.equal(hist[0].bloqueio_superado, true);
    assert.equal(hist[0].curas_reaproveitadas[0].confirmada_ao_vivo, true);
    assert.equal(fm.auditoria_ui.ambiente, 'Produtos (teste)');
    assert.match(content, /#### Evolução da Reauditoria/);
    assert.match(content, /\*\*Bloqueio anterior:\*\* passo 4/);
    assert.match(content, /reconfirmada ao vivo/);
  });
});

describe('ADR-025 §2 — multi-aba: parser de `tab list --json`', () => {
  test('aceita array, { tabs } e { data: { tabs } } e normaliza ids numéricos para tN', () => {
    const a = parseTabList(JSON.stringify([{ tabId: 't1', title: 'Portal', url: 'http://x/webPortal', active: false }, { tabId: 't2', title: 'Orion', url: 'http://x/webFirmas', active: true }]));
    assert.deepEqual(a.map(t => [t.id, t.active]), [['t1', false], ['t2', true]]);
    const b = parseTabList(JSON.stringify({ tabs: [{ id: 3, url: 'u', title: 't', active: true }] }));
    assert.equal(b[0].id, 't3', 'o agent-browser rejeita "tab 3": o id precisa de prefixo t');
    const c = parseTabList(JSON.stringify({ data: { tabs: [{ label: 'coaf', targetId: 'ABC', url: 'u', title: 't', active: true }] } }));
    assert.equal(c[0].id, 'coaf');
    assert.equal(c[0].targetId, 'ABC');
  });

  test('saída vazia, texto solto ou JSON inválido não lançam', () => {
    assert.deepEqual(parseTabList(''), []);
    assert.deepEqual(parseTabList('nada aqui'), []);
    assert.deepEqual(parseTabList('{"tabs": [oops'), []);
  });

  test('diff antes/depois identifica a guia nova pelo id', () => {
    const before = new Set(parseTabList(JSON.stringify([{ tabId: 't1', url: 'a', title: 'a', active: true }])).map(t => t.id));
    const after = parseTabList(JSON.stringify([{ tabId: 't1', url: 'a', title: 'a', active: false }, { tabId: 't2', url: 'b', title: 'Orion Coaf', active: true }]));
    assert.deepEqual(after.filter(t => !before.has(t.id)).map(t => t.title), ['Orion Coaf']);
  });
});

describe('ADR-025 §2 — gatilho de sub-portal: afinidade por termos distintivos (sem nome de portal no código)', () => {
  const stepContext = 'No Orion TN, acesse Configurações > Parâmetros Gerais > Comunicação COAF Habilitação de Pessoa Obrigada';

  test('link "...no Orion Coaf" casa com o passo/rotina que cita COAF', () => {
    assert.deepEqual(subportalAffinityTerms('Clique aqui para acessar a tela de configuração no Orion Coaf', stepContext), ['coaf']);
  });

  test('palavras genéricas sozinhas não bastam (clique, aqui, acessar, tela, orion...)', () => {
    assert.deepEqual(subportalAffinityTerms('Clique aqui para acessar a tela do Orion', stepContext), []);
  });

  test('link sem relação com o contexto é descartado', () => {
    assert.deepEqual(subportalAffinityTerms('Manual de instruções do Cartflow', stepContext), []);
  });

  test('o script injetado no navegador é JavaScript válido (escapes de regex no template literal)', () => {
    const script = buildSubportalLinkScript();
    assert.doesNotThrow(() => new Function(`return ${script}`), 'sintaxe do script de levantamento de links');
    assert.match(script, /disabled/, 'link desabilitado pela aplicação nunca é candidato');
    assert.match(script, /clique aqui/, 'chamada para navegação é o sinal de link dirigido por JS');
  });

  test('funciona para outro portal (nada fixo em COAF)', () => {
    assert.deepEqual(subportalAffinityTerms('Acessar o painel do SINTER', 'Envie o lote ao SINTER pela tela de comunicações'), ['sinter']);
  });
});

describe('ADR-025 §3 — rota de menu comprovada (desempate sem afrouxar a guarda da ADR-024)', () => {
  const item = (chain: string[], extra: Partial<MenuTreeItem> = {}): MenuTreeItem => ({
    chain,
    selectors: chain.map((_, i) => `[s${i}]`),
    disabled: false,
    hasChildren: false,
    ...extra
  });
  const documented: DocumentedMenuPath = { segments: ['Notas', 'Cadastros auxiliares', 'Alíquota'], sourceText: '**Notas > Cadastros auxiliares > Alíquota**' };

  test('folhas homônimas empatadas bloqueiam; com a rota comprovada, resolve para a rota anterior', () => {
    // Empate real: as duas folhas compartilham exatamente o mesmo ancestral ("Tabelas") com o manual
    const tieDocumented: DocumentedMenuPath = { segments: ['Notas', 'Tabelas', 'Alíquota'], sourceText: '**Notas > Tabelas > Alíquota**' };
    const items = [item(['Configurações', 'Tabelas', 'Alíquotas']), item(['Tributos', 'Tabelas', 'Alíquotas'])];
    assert.equal(chooseMenuItem([tieDocumented], items), null, 'sem dica, o empate bloqueia (nunca se adivinha a tela)');
    const viaPrior = chooseMenuItem([tieDocumented], items, [['Configurações', 'Tabelas', 'Alíquotas']]);
    assert.equal(viaPrior?.viaPriorAudit, true);
    assert.deepEqual(viaPrior?.item.chain, ['Configurações', 'Tabelas', 'Alíquotas']);
    assert.equal(viaPrior?.exact, false, 'continua uma divergência de rota (o relatório registra)');
  });

  test('rota comprovada que NÃO existe mais na árvore real é ignorada', () => {
    const items = [item(['Configurações', 'Cadastros auxiliares', 'Alíquotas'])];
    const m = chooseMenuItem([documented], items, [['Administração', 'Parâmetros', 'Alíquotas']]);
    assert.equal(m?.viaPriorAudit, undefined, 'dica inexistente não é usada');
    assert.deepEqual(m?.item.chain, ['Configurações', 'Cadastros auxiliares', 'Alíquotas'], 'segue a escolha normal por similaridade');
  });

  test('guarda ADR-024: rota comprovada com folha diferente da do manual NÃO é aceita (sem falsa cura)', () => {
    const items = [item(['Utilitários', 'Busca', 'Pesquise aqui o nome da tela'])];
    const m = chooseMenuItem([documented], items, [['Utilitários', 'Busca', 'Pesquise aqui o nome da tela']]);
    assert.equal(m, null, 'a folha precisa continuar parecida com a do manual (>= 0,80)');
  });

  test('item bloqueado para o perfil nunca é escolhido pela dica', () => {
    const items = [item(['Configurações', 'Cadastros auxiliares', 'Alíquotas'], { disabled: true })];
    const m = chooseMenuItem([documented], items, [['Configurações', 'Cadastros auxiliares', 'Alíquotas']]);
    assert.notEqual(m?.viaPriorAudit, true, 'item bloqueado não passa pela dica');
  });
});

describe('ADR-025 §3 — Camada 0.5 do SmartLocator (cura anterior reconfirmada ao vivo)', () => {
  const step = { stepNumber: 2, rawText: 'No campo **Cidade**, informe o município', targets: ['Cidade'], actionType: 'fill', subItems: [], mainTargetCount: 1 } as unknown as RoutineStep;
  const geometryFor = (text: string) => ({
    cssBox: { x: 300, y: 200, width: 180, height: 32 },
    viewport: { width: 1440, height: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
    context: { tagName: 'input', innerText: text, isTopNav: false, isVerticalSidebar: false },
    matchedSelector: '[data-x]',
    url: 'http://h/webFirmas/#/aliquotas',
    capturedAt: new Date().toISOString(),
    zone: 'content',
    zonePolicy: 'content'
  });
  const fakeClient = (measure: (targets: string[]) => unknown) => {
    const queries: string[][] = [];
    const client = {
      getDOMGeometry: async (targets: string | string[]) => {
        const list = Array.isArray(targets) ? targets : [targets];
        queries.push(list);
        return measure(list) ?? null;
      },
      evalJson: async () => null,
      eval: async () => 'null',
      screenshot: async () => 'x.png',
      snapshotInteractive: async () => ''
    } as unknown as AgentBrowserClient;
    return { client, queries };
  };

  test('alvo documentado ausente + dica medida ao vivo: cura com priorHint e divergência documentado→real', async () => {
    const { client, queries } = fakeClient(t => (t[0] === 'Município' ? geometryFor('Município') : null));
    const res = await locateAndCaptureWithSelfHealing(client, step, 'x.png', {
      priorHints: [{ documented: 'Cidade', actual: 'Município', layer: 'a11y_fuzzy_match', confidence: 0.83 }]
    });
    assert.equal(res.found, true, 'a dica reconfirmada deve localizar o alvo');
    assert.deepEqual(res.priorHint, { documented: 'Cidade', actual: 'Município', layer: 'a11y_fuzzy_match' });
    assert.equal(res.divergence?.documentedTarget, 'Cidade');
    assert.equal(res.divergence?.actualElementText, 'Município');
    assert.equal(res.divergence?.evidence?.source, 'dom-measured', 'a evidência é o nó medido agora, não a dica');
    assert.deepEqual(queries[0], ['Cidade'], 'o alvo documentado é medido PRIMEIRO');
  });

  test('alvo documentado presente: a dica nem é consultada (o manual está certo)', async () => {
    const { client, queries } = fakeClient(t => (t[0] === 'Cidade' ? geometryFor('Cidade') : null));
    const res = await locateAndCaptureWithSelfHealing(client, step, 'x.png', {
      priorHints: [{ documented: 'Cidade', actual: 'Município', layer: 'a11y_fuzzy_match', confidence: 0.83 }]
    });
    assert.equal(res.found, true);
    assert.equal(res.priorHint, undefined, 'sem dica usada');
    assert.equal(queries.some(q => q[0] === 'Município'), false, 'a dica não deve ser medida');
  });

  test('dica não reconfirmada na tela: não forja demarcação (cai para a Auto-Cura normal)', async () => {
    const { client } = fakeClient(() => null);
    const res = await locateAndCaptureWithSelfHealing(client, step, 'x.png', {
      priorHints: [{ documented: 'Cidade', actual: 'Município', layer: 'a11y_fuzzy_match', confidence: 0.83 }]
    });
    assert.equal(res.found, false, 'nada medido = nada demarcado (Evidência Estrita)');
    assert.equal(res.priorHint, undefined);
  });
});

describe('ADR-025 §1 — preflight de VPN', () => {
  test('maskHost não vaza o IP interno', () => {
    assert.equal(maskHost('192.0.2.10'), '192.0.2.x');
    assert.equal(maskHost('servidor.interno'), '<host>');
  });

  test('servidor inalcançável: aborta com instrução da OpenVPN e sem o IP no texto', async () => {
    const failing = (async () => {
      throw Object.assign(new Error('fetch failed'), { cause: { code: 'ETIMEDOUT' } });
    }) as unknown as typeof fetch;
    await assert.rejects(
      () => preflightOrionReachability({ url: 'http://192.0.2.10:8080/webPortal/#/produtos', fetchImpl: failing }),
      (err: unknown) => {
        assert.equal(err instanceof PreflightError, true, 'deve ser PreflightError');
        const msg = (err as Error).message;
        assert.match(msg, /OpenVPN da Siplan/);
        assert.equal(msg.includes('192.0.2.10'), false, 'o IP completo não pode aparecer na mensagem');
        return true;
      }
    );
  });

  test('qualquer resposta HTTP (inclusive 404) prova que o servidor está alcançável', async () => {
    const notFound = (async () => new Response('', { status: 404 })) as unknown as typeof fetch;
    await preflightOrionReachability({ url: 'http://192.0.2.10:8080/webPortal/', fetchImpl: notFound });
  });

  test('URL ausente ou inválida aborta com mensagem clara', async () => {
    await assert.rejects(() => preflightOrionReachability({ url: '' , fetchImpl: (async () => new Response('')) as unknown as typeof fetch }), PreflightError);
    await assert.rejects(() => preflightOrionReachability({ url: 'isso-nao-e-url', fetchImpl: (async () => new Response('')) as unknown as typeof fetch }), PreflightError);
  });
});

describe('ADR-025 §3 — proteção das rotinas de hardware no lote de reauditoria', () => {
  const rep = (id: string, status: string, extra: Partial<DiskReportSummary> = {}): DiskReportSummary => ({
    id,
    status,
    printsGeradas: 3,
    folder: `${id}-x`,
    ...extra
  });
  const reports: DiskReportSummary[] = [
    rep('M-40.0', 'dependencia_dados_banco'),
    rep('C-FIRMA-03', 'atualizacao_editorial'),
    rep('C-CENTRAL-02', 'comunicacao_externa'),
    rep('M-9.2', 'dependencia_cruzada_rotina'),
    rep('R-1.1', 'validado_com_ajustes'),
    rep('C-CONFIG-02', 'dependencia_dados_banco', { tipoBloqueio: 'Dependência de Ambiente/Hardware', printsGeradas: 0 })
  ];

  test('seleciona bloqueadas e [CCC]; ignora validadas; exclui hardware sem navegador', () => {
    const sel = selectPendingRoutineIds(reports);
    assert.deepEqual(sel.ids, ['C-CENTRAL-02', 'C-FIRMA-03', 'M-40.0', 'M-9.2']);
    assert.equal(sel.excludedHardware.includes('C-CONFIG-02'), true, 'hardware protegido');
  });

  test('rotina [DDD] de ambiente que JÁ navegou (prints > 0) não é tratada como hardware', () => {
    const ids = listHardwareRoutineIds([rep('V-9', 'dependencia_dados_banco', { tipoBloqueio: 'Dependência de Ambiente/Hardware', printsGeradas: 2 })]);
    assert.equal(ids.has('V-9'), false);
  });

  test('as 7 pré-triadas do manifesto da Fase 3 sempre estão protegidas', () => {
    const ids = listHardwareRoutineIds([]);
    for (const id of ['C-FIRMA-01', 'M-9.1', 'V-CCA.1.3', 'C-SELO-08', 'D-3.6', 'C-CENTRAL-07', 'R-32.1']) {
      assert.equal(ids.has(id), true, `${id} deve estar protegida`);
    }
  });
});
