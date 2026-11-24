import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  assignQueue,
  classifyBlockCause,
  classifyExplicitPath,
  classifyImplicitScreen,
  driftIsCosmetic,
  extractStepNavigation,
  maskIps,
  parseBlockInfo,
  parseStepsFromMarkdown,
  type BlockInfo,
  type NavCheck,
  type RoutineNavContext
} from '../audit-menu-coherence.js';
import { catalogAsCanonicalItems, loadMenuCatalog } from '../menu-catalog.js';
import type { RoutineStep } from '../types.js';

const catalog = loadMenuCatalog();
const ITEMS = catalogAsCanonicalItems(catalog);
const ctx = (over: Partial<RoutineNavContext> = {}): RoutineNavContext => ({ modulo: 'firmas', routineTitle: '', stepTexts: [], ...over });
const explicit = (path: string, c: RoutineNavContext = ctx(), step = 1) =>
  classifyExplicitPath(path.split('>').map(s => s.trim()), step, c, catalog, ITEMS);
const chain = (n: NavCheck) => (n.resolvedChain ?? []).join(' > ');
const block = (over: Partial<BlockInfo> = {}): BlockInfo => ({
  blockedStep: 1,
  cause: 'menu_path',
  tipoBloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)',
  motivo: '',
  liveAppliedChains: [],
  ...over
});
const step = (stepNumber: number, rawText: string): RoutineStep =>
  ({ stepNumber, rawText, targets: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1]), actionType: 'click', subItems: [], mainTargetCount: 1 }) as RoutineStep;

describe('ADR-037 — auditoria offline de coerência de menus: classificação', () => {
  test('caminho literalmente idêntico ao catálogo é exact', () => {
    const n = explicit('Firmas > Reconhecimento de firmas');
    assert.equal(n.classification, 'exact', `classe obtida: ${n.classification}`);
    assert.equal(chain(n), 'Firmas > Reconhecimento de firmas', 'cadeia do catálogo');
  });

  test('diferença só de caixa é deriva de grafia cosmética', () => {
    const n = explicit('Firmas > Reconhecimento de Firmas');
    assert.equal(n.classification, 'exact_with_spelling_drift', `classe obtida: ${n.classification}`);
    assert.deepEqual(n.drift?.[0]?.kinds, ['caixa'], 'natureza da diferença');
    assert.ok(driftIsCosmetic(n.drift), 'caixa é absorvida pela navegação normalizada');
  });

  test('diferença de acento é deriva de grafia com tipo acento', () => {
    const n = explicit('Configuracoes > Parametrizacoes');
    assert.equal(n.classification, 'exact_with_spelling_drift', `classe obtida: ${n.classification}`);
    assert.ok((n.drift ?? []).every(d => d.kinds.includes('acento')), `tipos: ${JSON.stringify(n.drift)}`);
  });

  test('singular × plural é deriva não cosmética', () => {
    const n = explicit('Firmas > Consultas > Reconhecimento de firmas');
    assert.equal(n.classification, 'exact_with_spelling_drift', `classe obtida: ${n.classification}`);
    assert.equal(chain(n), 'Firmas > Consultas > Reconhecimentos de firmas', 'cadeia do catálogo');
    assert.ok(n.drift?.some(d => d.kinds.includes('plural_flexao')), 'diferença de flexão registrada');
    assert.equal(driftIsCosmetic(n.drift), false, 'plural não é cosmético');
  });

  test('equivalência canônica da tabela explícita', () => {
    const n = explicit('Configurações > Grupos e Perfis de Acesso', ctx({ modulo: 'acesso' }));
    assert.equal(n.classification, 'canonical_equivalence', `classe obtida: ${n.classification}`);
    assert.equal(chain(n), 'Configurações > Perfis e permissões de acesso', 'cadeia real');
    assert.ok(n.evidence.length > 0, 'evidência registrada');
  });

  test('tela citada sem ">" resolve por segmento único', () => {
    const n = classifyImplicitScreen('Editor', 1, ctx({ modulo: 'notas' }), catalog);
    assert.equal(n.classification, 'single_segment', `classe obtida: ${n.classification}`);
    assert.equal(chain(n), 'Notas > Consultas > Editor', 'cadeia do catálogo');
  });

  test('raiz da barra citada sozinha é exata (submenu escolhido no passo seguinte)', () => {
    const n = classifyImplicitScreen('Configurações', 1, ctx({ modulo: 'acesso' }), catalog);
    assert.equal(n.classification, 'exact', `classe obtida: ${n.classification}`);
    assert.equal(chain(n), 'Configurações', 'raiz');
  });

  test('caminho sem equivalente devolve vizinhos como laudo', () => {
    const n = explicit('Notas > Cadastros auxiliares > Tipos de anexo', ctx({ modulo: 'notas', routineTitle: 'Cadastrar tipo de anexo' }));
    assert.equal(n.classification, 'no_equivalent', `classe obtida: ${n.classification} (${chain(n)})`);
    assert.equal(n.resolvedChain, undefined, 'sem cadeia resolvida');
    assert.ok(Array.isArray(n.candidates), 'candidatos listados para o laudo');
  });

  test('extração dos passos 1–3: explícito, implícito e passo 4 ignorado', () => {
    const steps = [
      step(1, 'Acesse o menu **Firmas > Reconhecimento de firmas**.'),
      step(2, 'Acesse **Editor** para continuar.'),
      step(4, 'Acesse o menu **Notas > Consultas > Editor**.')
    ];
    const nav = extractStepNavigation(steps, ctx({ modulo: 'notas', stepTexts: steps.map(s => s.rawText) }), catalog, ITEMS);
    assert.equal(nav.length, 2, `navegações: ${JSON.stringify(nav.map(n => n.documented))}`);
    assert.equal(nav[0].kind, 'explicit', 'passo 1 explícito');
    assert.equal(nav[1].kind, 'implicit', 'passo 2 implícito');
  });
});

describe('ADR-037 — auditoria offline de coerência de menus: filas', () => {
  const canon = explicit('Configurações > Grupos e Perfis de Acesso', ctx({ modulo: 'acesso' }));
  const exactNav = explicit('Firmas > Reconhecimento de firmas');
  const noEq = explicit('Notas > Cadastros auxiliares > Tipos de anexo', ctx({ modulo: 'notas' }));

  test('Fila A: caminho de menu ausente no passo 1 agora resolvido por equivalência', () => {
    const d = assignQueue({ tags: ['ATT'], block: block(), nav: [canon], isHardware: false });
    assert.equal(d.queue, 'A', d.reason);
    assert.equal(d.confidence, 'alta', `ressalva: ${d.doubt}`);
  });

  test('Fila A com ressalva quando a mesma cadeia já foi aplicada ao vivo', () => {
    const d = assignQueue({
      tags: ['ATT'],
      block: block({ liveAppliedChains: [{ step: 1, documented: canon.documented, real: chain(canon) }] }),
      nav: [canon],
      isHardware: false
    });
    assert.equal(d.queue, 'A', d.reason);
    assert.equal(d.confidence, 'revisar', 'ressalva esperada');
  });

  test('Fila B: caminho já exato e alvo ausente no passo seguinte', () => {
    const d = assignQueue({ tags: ['ATT'], block: block({ blockedStep: 2, cause: 'missing_target', route: '#/pedidoFirmas/cadastrar' }), nav: [exactNav], isHardware: false });
    assert.equal(d.queue, 'B', d.reason);
  });

  test('Fila C3: cura descartada ao vivo pela Camada 4 não volta à Fila A', () => {
    const d = assignQueue({ tags: ['ATT'], block: block({ landingRejected: true }), nav: [canon], isHardware: false });
    assert.equal(d.queue, 'C', d.reason);
    assert.equal(d.subtype, 'conteudo_defasado_pos_pouso', `subtipo inesperado: ${d.subtype}`);
  });

  test('Fila B: bloqueio depois do passo 3', () => {
    const d = assignQueue({ tags: ['XRX'], block: block({ blockedStep: 5, cause: 'cross_routine' }), nav: [canon], isHardware: false });
    assert.equal(d.queue, 'B', d.reason);
  });

  test('Fila B: grade vazia no passo 2', () => {
    const d = assignQueue({ tags: ['XRX'], block: block({ blockedStep: 2, cause: 'empty_grid' }), nav: [canon], isHardware: false });
    assert.equal(d.queue, 'B', d.reason);
  });

  test('Fila C: caminho sem equivalente no catálogo', () => {
    const d = assignQueue({ tags: ['ATT'], block: block(), nav: [noEq], isHardware: false });
    assert.equal(d.queue, 'C', d.reason);
    assert.equal(d.subtype, 'navegacao_sem_equivalente', 'subtipo');
  });

  test('Fila C (tela pressuposta): passos 1–3 sem navegação e Camada 3 sem destino', () => {
    const routineLevel: NavCheck = { stepNumber: 0, kind: 'routine', documented: 'Título', classification: 'no_equivalent', evidence: 'x', candidates: [] };
    const d = assignQueue({ tags: ['ATT'], block: block({ cause: 'missing_target', route: '#/inicio' }), nav: [], routineLevel, isHardware: false });
    assert.equal(d.queue, 'C', d.reason);
    assert.equal(d.subtype, 'tela_pressuposta', 'subtipo');
  });

  test('[DDD] puro fica fora das filas', () => {
    const d = assignQueue({ tags: ['DDD'], block: block({ cause: 'environment' }), nav: [canon], isHardware: true });
    assert.equal(d.queue, null, d.reason);
  });

  test('rotina de hardware nunca entra na Fila A', () => {
    const d = assignQueue({ tags: ['ATT'], block: block(), nav: [canon], isHardware: true });
    assert.notEqual(d.queue, 'A', d.reason);
  });
});

describe('ADR-037 — auditoria offline de coerência de menus: leitura de relatório', () => {
  const report = [
    '---',
    'id: X-1.0',
    'auditoria_ui:',
    "  status: atualizacao_editorial",
    "  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'",
    '  auto_cura:',
    '    divergencias_detectadas:',
    '      - passo: 1',
    "        alvo_documentado: 'Administração > Parâmetros > E-mail'",
    "        elemento_real: 'Configurações > Parametrizações'",
    '        camada: menu_path_resolution',
    '  diagnostico_tela_att:',
    '    passo: 2',
    "    rota: '#/configuracoes'",
    '---',
    '',
    '> [!CAUTION]',
    '> **Motivo Técnico:** No passo 2, o manual cita "Porta", que não foi localizado na tela auditada em http://10.0.3.228:8601/x.',
    '',
    '#### Passo a passo (texto original preservado):',
    '1. Acesse o menu **Administração > Parâmetros > E-mail**.',
    '   [aqui vai a print "passo-01.png"]',
    '2. Informe a **Porta**.',
    '',
    '#### Evolução da Reauditoria'
  ].join('\n');

  test('passo, causa, rota, cura aplicada ao vivo e IP mascarado', () => {
    const b = parseBlockInfo(report);
    assert.equal(b.blockedStep, 2, 'passo do bloqueio');
    assert.equal(b.cause, 'missing_target', `causa: ${b.cause}`);
    assert.equal(b.route, '#/configuracoes', 'rota do Raio-X');
    assert.equal(b.liveAppliedChains.length, 1, 'cura de menu aplicada');
    assert.ok(!/10\.0\.3\.228/.test(b.motivo), 'IP mascarado no motivo');
  });

  test('passos do relatório (fallback quando a rotina não está no KB)', () => {
    const steps = parseStepsFromMarkdown(report);
    assert.equal(steps.length, 2, 'dois passos');
    assert.ok(steps[0].rawText.includes('Administração > Parâmetros > E-mail'), 'texto do passo 1');
  });

  test('causas do bloqueio pelo texto do motivo', () => {
    assert.equal(classifyBlockCause('No passo 1, o manual cita um caminho de menu que não existe', ''), 'menu_path', 'menu');
    assert.equal(classifyBlockCause('No passo 2, a tela está sem dados (grade com 8 coluna(s)) e 0 linhas de dados', ''), 'empty_grid', 'grade');
    assert.equal(classifyBlockCause('O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina)', ''), 'cross_routine', 'cruzada');
    assert.equal(classifyBlockCause('', 'Dependência de Ambiente/Hardware'), 'environment', 'ambiente');
  });

  test('maskIps troca o último octeto', () => {
    assert.equal(maskIps('host 10.0.3.228 ok'), 'host 10.0.3.x ok', 'máscara');
  });
});

describe('ADR-037 — minerador de clusters: fonte da árvore', () => {
  test('auto sem árvore ao vivo usa o catálogo; live sem árvore fica vazio; canonical sempre o catálogo', async () => {
    const { loadMinerMenuTree } = await import('../mine-att-clusters.js');
    const missing = 'arquivo-inexistente-orion-menu-tree.json';
    const auto = loadMinerMenuTree(missing, 'auto');
    assert.equal(auto.source, 'canonical', auto.reason);
    assert.equal(auto.items.length, catalog.nodes.length, 'todos os nós do catálogo');
    const live = loadMinerMenuTree(missing, 'live');
    assert.equal(live.source, 'none', live.reason);
    assert.equal(live.items.length, 0, 'sem itens');
    const canonical = loadMinerMenuTree(missing, 'canonical');
    assert.equal(canonical.source, 'canonical', canonical.reason);
  });
});
