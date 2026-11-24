import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import type { AgentBrowserClient } from '../browser.js';
import { loadMenuCatalog } from '../menu-catalog.js';
import { USER_MENU_ROOT } from '../menu-canonical.js';
import { detectImplicitScreenNavigation } from '../menu-implicit-nav.js';
import {
  COHERENCE_CHECKED_BASES,
  collectNextStepTargets,
  describeIncoherentLanding,
  evaluateLandingCoherence
} from '../menu-landing-coherence.js';
import {
  chooseMenuItem,
  describeMenuPathMissing,
  isAlreadyOnScreen,
  isHomeHash,
  liveItemForCatalogChain,
  matchFromNavigationPlan,
  planExplicitClosedSemantic,
  planFromAgyAnswer,
  planImplicitScreenNavigation,
  resolveAndNavigateMenuPath,
  syntheticPathFromImplicit,
  type MenuNavigationContext,
  type MenuTreeItem
} from '../menu-path.js';
import { forbiddenCandidateReason } from '../navigation-guard.js';
import { setRouteGraphForTesting } from '../route-crawler.js';
import type { ActionType, RoutineStep } from '../types.js';

// ---------------------------------------------------------------------------------------------------------
// Fixture: a árvore "viva" é o catálogo canônico com a raiz real do menu do usuário (`Olá, Fulano`) e um
// carimbo por nó, como `buildMenuTreeScript()` devolveria no navegador.
// ---------------------------------------------------------------------------------------------------------
const LIVE_USER_ROOT = 'Olá, Fulano';

function liveTree(opts: { disabled?: string[] } = {}): MenuTreeItem[] {
  const nodes = loadMenuCatalog().nodes;
  const chains = nodes.map(n => n.chain.map((s, k) => (k === 0 && s === USER_MENU_ROOT ? LIVE_USER_ROOT : s)));
  const selOf = new Map<string, string>();
  chains.forEach((c, i) => selOf.set(c.join('>'), `[data-orion-audit-menu-t-${i}]`));
  return chains.map((chain, i) => ({
    chain,
    selectors: chain.map((_, k) => selOf.get(chain.slice(0, k + 1).join('>')) || `[missing-${k}]`),
    disabled: (opts.disabled || []).includes(chain.join(' > ')),
    hasChildren: nodes[i].hasChildren
  }));
}

const ITEMS = liveTree();

const step = (stepNumber: number, rawText: string, actionType: ActionType = 'click', extra: Partial<RoutineStep> = {}): RoutineStep => ({
  stepNumber,
  rawText,
  targets: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1].trim()),
  actionType,
  ...extra
});

const ctx = (over: Partial<MenuNavigationContext> = {}): MenuNavigationContext => ({
  modulo: 'acesso',
  routineTitle: 'Gerenciar perfis de acesso',
  stepTexts: [],
  nextStepsText: [],
  allowAgy: false,
  ...over
});

const implicitOf = (s: RoutineStep) => {
  const imp = detectImplicitScreenNavigation(s);
  assert.ok(imp, `o passo "${s.rawText}" deveria ser navegação implícita`);
  return imp!;
};

// ---------------------------------------------------------------------------------------------------------
// Cliente simulado para percorrer `resolveAndNavigateMenuPath` sem navegador
// ---------------------------------------------------------------------------------------------------------
function fakeClient(items: MenuTreeItem[], state: { hash: string; href?: string }) {
  const log: string[] = [];
  const client = {
    eval: async (script: string) => (script.includes('__orionMenuStamps') ? JSON.stringify(items) : null),
    evalJson: async (script: string) => {
      if (script.includes("getAttribute('href')")) return state.href ?? '';
      if (script.includes('window.location.hash')) return state.hash;
      if (script.includes('.map(sel =>')) {
        return [0, 1, 2, 3].map(i => ({ vis: true, x: 20 + i * 180, y: 10, w: 150, h: 24, ul: { x: 20 + i * 180, y: 36, r: 190 + i * 180, b: 400 } }));
      }
      return null;
    },
    click: async (sel: string) => {
      log.push(`click ${sel}`);
    },
    mouseMove: async (x: number, y: number) => {
      log.push(`move ${x},${y}`);
    },
    hover: async () => undefined,
    focus: async () => undefined,
    wait: async () => undefined,
    screenshot: async () => undefined,
    getDOMGeometry: async (_names: string[], o: { groupTargets?: string[] }) => {
      const members = (o.groupTargets || []).map((sel, i) => ({
        query: sel,
        matchedSelector: sel,
        cssBox: { x: 20 + i * 180, y: 10, width: 150, height: 24 },
        innerText: `nivel-${i}`
      }));
      const last = members[members.length - 1];
      return {
        cssBox: last.cssBox,
        viewport: { width: 1440, height: 900, dpr: 1 },
        matchedSelector: last.matchedSelector,
        context: {},
        groupMembers: members
      };
    }
  } as unknown as AgentBrowserClient;
  return { client, log };
}

before(() => setRouteGraphForTesting(null));
after(() => setRouteGraphForTesting(undefined));

// =========================================================================================================
describe('ADR-037 Camada 2 — tela citada sem `>` (decisão pura)', () => {
  test('apelido curado resolve para a cadeia que EXISTE viva (single_segment_screen)', () => {
    const s = step(1, 'Acesse **Grupos e Perfis de Acesso**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx(), atHome: true });
    assert.equal(plan.kind, 'navigate', 'deveria navegar');
    if (plan.kind !== 'navigate') return;
    assert.equal(plan.basis, 'single_segment_screen', 'base da cura');
    assert.deepEqual(plan.item.chain, ['Configurações', 'Perfis e permissões de acesso'], 'cadeia viva');
    assert.ok(plan.confidence >= 0.68, 'confiança acima do mínimo da Trava de Evidência');
  });

  test('menu do usuário: o marcador do catálogo casa com a raiz real "Olá, <nome>"', () => {
    const s = step(1, 'Acesse **Alterar senha**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx(), atHome: true });
    assert.equal(plan.kind, 'navigate', 'deveria navegar até o menu do usuário');
    if (plan.kind !== 'navigate') return;
    assert.deepEqual(plan.item.chain, [LIVE_USER_ROOT, 'Alterar senha'], 'a cadeia é a REAL, nunca o marcador');
    assert.deepEqual(plan.catalogChain, [USER_MENU_ROOT, 'Alterar senha'], 'cadeia do catálogo preservada');
  });

  test('homônimo "Consultas" sem módulo não é resolvido (nada é adivinhado)', () => {
    const s = step(1, 'Acesse **Consultas**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx({ modulo: undefined, routineTitle: '' }), atHome: true });
    assert.equal(plan.kind, 'skip', 'homônimo deve ficar sem navegação');
  });

  test('"Consultas" com módulo desempata para um SUBMENU: não é tela, não navega', () => {
    const s = step(1, 'Acesse **Consultas**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx({ modulo: 'firmas' }), atHome: true });
    assert.equal(plan.kind, 'skip', 'submenu intermediário não é destino');
  });

  test('cadeia do catálogo ausente (ou bloqueada) na árvore viva: não navega', () => {
    const tree = liveTree({ disabled: ['Configurações > Perfis e permissões de acesso'] });
    const s = step(1, 'Acesse **Grupos e Perfis de Acesso**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: tree, context: ctx(), atHome: true });
    assert.equal(plan.kind, 'skip', 'o catálogo nunca é evidência');
    const pruned = ITEMS.filter(i => i.chain.join(' > ') !== 'Configurações > Usuários');
    const s2 = step(1, 'Acesse **Usuários**.');
    assert.equal(planImplicitScreenNavigation({ step: s2, implicit: implicitOf(s2), items: pruned, context: ctx(), atHome: true }).kind, 'skip', 'folha ausente ao vivo');
  });

  test('passo de formulário ("Na tela X, preencha") não navega pela Camada 2', () => {
    const s = step(2, 'Na tela **Usuários**, preencha o **Nome**.', 'fill');
    const imp = detectImplicitScreenNavigation(s);
    assert.ok(imp, 'o detector reconhece a tela');
    const plan = planImplicitScreenNavigation({ step: s, implicit: imp!, items: ITEMS, context: ctx(), atHome: true });
    assert.equal(plan.kind, 'skip', 'ação fill não é navegação');
  });

  test('rótulo fora do catálogo fora da tela inicial: não consulta a Camada 3', () => {
    const s = step(2, 'Acesse **Pedido especial de teste**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx(), atHome: false });
    assert.equal(plan.kind, 'skip', 'fora da Home o negrito pode ser elemento da tela aberta');
    assert.equal(plan.kind === 'skip' && plan.closed, undefined, 'a semântica fechada nem é calculada');
  });

  test('caminho sintético e match curado (nunca exato) com base registrada', () => {
    const s = step(1, 'Acesse **Grupos e Perfis de Acesso**.');
    const imp = implicitOf(s);
    const plan = planImplicitScreenNavigation({ step: s, implicit: imp, items: ITEMS, context: ctx(), atHome: true });
    assert.equal(plan.kind, 'navigate', 'deveria navegar');
    if (plan.kind !== 'navigate') return;
    const synthetic = syntheticPathFromImplicit(imp);
    assert.deepEqual(synthetic, { segments: ['Grupos e Perfis de Acesso'], sourceText: '**Grupos e Perfis de Acesso**' }, 'caminho sintético');
    const match = matchFromNavigationPlan(plan, synthetic);
    assert.equal(match.exact, false, 'cura nunca passa como ok silencioso');
    assert.equal(match.cureBasis, 'single_segment_screen', 'base da cura');
    assert.ok(COHERENCE_CHECKED_BASES.has(match.cureBasis!), 'a Camada 2 exige coerência pós-pouso');
  });

  test('liveItemForCatalogChain ignora itens bloqueados e exige item único', () => {
    assert.deepEqual(liveItemForCatalogChain(['Configurações', 'Usuários'], ITEMS)?.chain, ['Configurações', 'Usuários'], 'item vivo');
    assert.equal(liveItemForCatalogChain(['Configurações', 'Usuários'], liveTree({ disabled: ['Configurações > Usuários'] })), null, 'bloqueado');
    assert.equal(liveItemForCatalogChain(['Configurações', 'Inexistente'], ITEMS), null, 'inexistente');
  });

  test('tela inicial e tela já aberta', () => {
    assert.equal(isHomeHash('#/inicio'), true, '#/inicio');
    assert.equal(isHomeHash(''), true, 'vazio');
    assert.equal(isHomeHash('#/usuario'), false, 'tela interna');
    assert.equal(isAlreadyOnScreen('#/usuario?x=1', '#/usuario'), true, 'mesma rota');
    assert.equal(isAlreadyOnScreen('#/usuario/alterar/12', '#/usuario/alterar'), true, 'id numérico final');
    assert.equal(isAlreadyOnScreen('#/inicio', '#/usuario'), false, 'outra rota');
    assert.equal(isAlreadyOnScreen('#/usuario', ''), false, 'sem href');
    assert.equal(isAlreadyOnScreen('#/usuario', 'javascript:void(0)'), false, 'href não-hash');
  });
});

// =========================================================================================================
describe('ADR-037 Camada 3 — semântica fechada (decisão pura)', () => {
  test('caminho explícito sem equivalente: SEM_EQUIVALENTE curto-circuita com justificativa', () => {
    const s = step(1, 'Acesse **Xpto > Qwerty**.');
    const plan = planExplicitClosedSemantic({ step: s, items: ITEMS, context: ctx({ modulo: 'geral', routineTitle: 'Zzz', stepTexts: [s.rawText] }) });
    assert.equal(plan.kind, 'no_equivalent', 'sem destino inequívoco');
    if (plan.kind !== 'no_equivalent') return;
    assert.ok(plan.closed.justification.length > 0, 'justificativa presente');
  });

  test('caminho explícito com destino inequívoco que existe vivo: closed_semantic', () => {
    const s = step(1, 'Acesse **Fichas > Cadastro de fichas de cartões de assinatura**.');
    const plan = planExplicitClosedSemantic({
      step: s,
      items: ITEMS,
      context: ctx({ modulo: 'firmas', routineTitle: 'Cadastrar cartão de assinatura', stepTexts: [s.rawText, 'Clique em **Novo cartão +**.'] })
    });
    assert.equal(plan.kind, 'navigate', 'destino inequívoco');
    if (plan.kind !== 'navigate') return;
    assert.equal(plan.basis, 'closed_semantic', 'base da cura');
    assert.deepEqual(plan.item.chain, ['Firmas', 'Cadastros', 'Cartão de assinatura'], 'cadeia viva');
  });

  test('passo > 3 nunca usa a Camada 3', () => {
    const s = step(4, 'Acesse **Xpto > Qwerty**.');
    assert.equal(planExplicitClosedSemantic({ step: s, items: ITEMS, context: ctx() }).kind, 'skip', 'passo 4');
  });

  test('resposta do agy: só cadeia literal do catálogo E viva', () => {
    const ok = planFromAgyAnswer('Configurações > Usuários', ITEMS);
    assert.equal(ok?.kind, 'navigate', 'cadeia literal viva');
    assert.equal(ok?.kind === 'navigate' && ok.basis, 'closed_semantic_agy', 'base agy');
    assert.equal(planFromAgyAnswer('Acho que é Configurações > Usuários', ITEMS), null, 'texto livre rejeitado');
    assert.equal(planFromAgyAnswer('SEM_EQUIVALENTE_NA_ARVORE', ITEMS), null, 'token não navega');
    assert.equal(planFromAgyAnswer('Configurações > Usuários', ITEMS.filter(i => i.chain.join(' > ') !== 'Configurações > Usuários')), null, 'ausente ao vivo');
    assert.equal(planFromAgyAnswer(null, ITEMS), null, 'falha do agy');
  });

  test('evidência do caminho inexistente carrega a justificativa da Camada 3', () => {
    const text = describeMenuPathMissing({
      documented: 'Xpto > Qwerty',
      existingPrefix: [],
      missingSegment: 'Xpto',
      siblings: [],
      roots: ['Firmas'],
      treeSize: 3,
      closedSemantic: { justification: 'nenhum radical', topCandidates: ['Firmas > Abertura de pedido (0.3)'] }
    });
    assert.match(text, /SEM_EQUIVALENTE_NA_ARVORE/, 'token na evidência');
    assert.match(text, /Firmas > Abertura de pedido/, 'candidatos na evidência');
  });
});

// =========================================================================================================
describe('ADR-037 — resolveAndNavigateMenuPath com a cascata real simulada', () => {
  test('Camada 2: percorre a cadeia viva, registra divergência single_segment_screen e troca só o negrito', async () => {
    const s = step(1, 'Acesse **Grupos e Perfis de Acesso** no sistema.');
    const { client, log } = fakeClient(ITEMS, { hash: '#/inicio', href: '#/perfil' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png', [], { context: ctx() });
    assert.ok(res, 'deveria haver resultado');
    assert.equal(res!.found, true, 'cadeia medida');
    assert.equal(res!.divergence?.resolutionLayer, 'menu_path_resolution', 'camada');
    assert.equal(res!.divergence?.menuBasis, 'single_segment_screen', 'base');
    assert.equal(res!.divergence?.evidence?.source, 'menu-tree', 'evidência da árvore viva');
    assert.deepEqual(
      res!.divergence?.textChange,
      { from: '**Grupos e Perfis de Acesso**', to: '**Configurações > Perfis e permissões de acesso**' },
      'só o negrito é substituído'
    );
    assert.equal(res!.validatedText, 'Acesse **Configurações > Perfis e permissões de acesso** no sistema.', 'texto validado');
    assert.equal(res!.menuCure?.basis, 'single_segment_screen', 'exige coerência pós-pouso');
    assert.ok(log.some(l => l.startsWith('move ')), 'o ponteiro real percorreu a cascata');
  });

  test('Camada 2 desligada sem contexto (outros chamadores mantêm o comportamento antigo)', async () => {
    const s = step(1, 'Acesse **Grupos e Perfis de Acesso**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    assert.equal(await resolveAndNavigateMenuPath(client, s, 'x.png'), null, 'sem contexto = null');
  });

  test('tela já aberta: não renavega', async () => {
    const s = step(2, 'Acesse **Usuários**.');
    const { client } = fakeClient(ITEMS, { hash: '#/usuario', href: '#/usuario' });
    assert.equal(await resolveAndNavigateMenuPath(client, s, 'x.png', [], { context: ctx() }), null, 'tela já aberta');
  });

  test('homônimo ao vivo: segue o fluxo normal (null)', async () => {
    const s = step(1, 'Acesse **Consultas**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    assert.equal(await resolveAndNavigateMenuPath(client, s, 'x.png', [], { context: ctx({ modulo: undefined, routineTitle: '' }) }), null, 'homônimo');
  });

  test('Camada 3 explícita SEM_EQUIVALENTE: bloqueio com evidência da árvore + justificativa', async () => {
    const s = step(1, 'Acesse **Xpto > Qwerty**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png', [], { context: ctx({ modulo: 'geral', routineTitle: 'Zzz', stepTexts: [s.rawText] }) });
    assert.equal(res?.found, false, 'não navega');
    assert.ok(res?.menuPathMissing?.closedSemantic, 'justificativa da Camada 3 na evidência');
  });

  test('Camada 3 explícita resolvida: navega e marca closed_semantic', async () => {
    const s = step(1, 'Acesse **Fichas > Cadastro de fichas de cartões de assinatura**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png', [], {
      context: ctx({ modulo: 'firmas', routineTitle: 'Cadastrar cartão de assinatura', stepTexts: [s.rawText] })
    });
    assert.equal(res?.found, true, 'navegou');
    assert.equal(res?.divergence?.menuBasis, 'closed_semantic', 'base');
    assert.equal(res?.divergence?.actualElementText, 'Firmas > Cadastros > Cartão de assinatura', 'cadeia real');
    assert.equal(res?.menuCure?.basis, 'closed_semantic', 'exige coerência');
  });

  test('por que a Camada 2 NÃO passa segmento único pelo chooseMenuItem: a pontuação de folha escolheria um homônimo', () => {
    // A Auto-Cura de Rota (ADR-016) pontua folhas e, num segmento único, elegeria uma das 3 "Consultas" sem ancestral
    // nenhum. A Camada 2 decide pelo catálogo (com desempate por módulo/contexto) e só então confere a cadeia viva.
    const viaLeafScore = chooseMenuItem([{ segments: ['Consultas'], sourceText: '**Consultas**' }], ITEMS);
    assert.ok(viaLeafScore, 'a pontuação de folha escolheria algo (comportamento legado, só para caminhos >= 2)');
    const s = step(1, 'Acesse **Consultas**.');
    const plan = planImplicitScreenNavigation({ step: s, implicit: implicitOf(s), items: ITEMS, context: ctx({ modulo: undefined, routineTitle: '' }), atHome: true });
    assert.equal(plan.kind, 'skip', 'a Camada 2 não adivinha o homônimo');
  });
});

// =========================================================================================================
describe('ADR-037 Camada 4 — coerência pós-pouso (pura)', () => {
  const inventory = {
    route: '#/perfil',
    title: 'Perfis e permissões de acesso',
    inModal: false,
    sections: ['Filtros'],
    tabs: [{ label: 'Permissões', active: true }],
    fields: [{ label: 'Nome do perfil', type: 'text' }],
    buttons: [{ label: 'Adicionar', primary: true }]
  };

  test('alvo do passo seguinte presente: coerente', () => {
    const r = evaluateLandingCoherence(['Permissões'], inventory, null);
    assert.equal(r.coherent, true, 'coerente');
    assert.equal(r.verdict, 'coherent', 'veredito');
  });

  test('frase inteira contida num rótulo curto e mesma chave de folha', () => {
    assert.equal(evaluateLandingCoherence(['Nome'], inventory, null).coherent, true, 'frase contida');
    assert.equal(evaluateLandingCoherence(['Permissão'], inventory, null).matched[0]?.via, 'leaf_key', 'chave de folha');
  });

  test('substring intra-palavra não conta', () => {
    const r = evaluateLandingCoherence(['Missão'], inventory, null);
    assert.equal(r.coherent, false, 'Missão não casa com Permissões');
  });

  test('grafo de rotas e sinônimo de rota também contam', () => {
    assert.equal(evaluateLandingCoherence(['Grupos'], inventory, { title: '', tabs: ['Grupos'], sections: [] }).coherent, true, 'aba do grafo');
    const r = evaluateLandingCoherence(['Nome completo'], inventory, null, { routeSynonyms: () => [['Nome do perfil']] });
    assert.equal(r.coherent, true, 'sinônimo de rota');
    assert.equal(r.matched[0]?.via, 'route_synonym', 'via sinônimo');
  });

  test('nenhum alvo dos próximos passos na tela: incoerente com evidência', () => {
    const r = evaluateLandingCoherence(['Número do protocolo', 'Livro'], inventory, null);
    assert.equal(r.coherent, false, 'incoerente');
    assert.deepEqual(r.missing, ['Número do protocolo', 'Livro'], 'faltantes');
    const text = describeIncoherentLanding({ basisLabel: 'tela citada sem caminho (Camada 2)', documented: 'Protocolos', realChain: ['Notas', 'Protocolos'], hash: '#/protocolo', result: r });
    assert.match(text, /não contém "Número do protocolo", "Livro"/, 'evidência cita os alvos ausentes');
  });

  test('sem alvo verificável (genéricos) = coerente; inventário ilegível = inconclusivo (não bloqueia)', () => {
    assert.equal(evaluateLandingCoherence(['Salvar', 'Adicionar', '+'], inventory, null).verdict, 'no_targets', 'genéricos');
    const r = evaluateLandingCoherence(['Livro'], null, null);
    assert.equal(r.verdict, 'inconclusive', 'sem leitura');
    assert.equal(r.coherent, true, 'falha de leitura nunca vira bloqueio');
  });

  test('collectNextStepTargets: genéricos fora, para em caminho de menu e depois de botão que troca a tela', () => {
    const steps = [
      step(1, 'Acesse **Usuários**.'),
      step(2, 'Na aba **Dados** clique em **Adicionar**.'),
      step(3, 'Preencha **Nome**.', 'fill')
    ];
    assert.deepEqual(collectNextStepTargets(steps, 1), ['Dados'], 'para após o passo que troca a tela');
    const steps2 = [step(1, 'Acesse **Usuários**.'), step(2, 'Filtre por **Situação** e **Login**.'), step(3, 'Informe **CPF**.', 'fill')];
    assert.deepEqual(collectNextStepTargets(steps2, 1), ['Situação', 'Login', 'CPF'], 'dois passos');
    const steps3 = [step(1, 'Acesse **Usuários**.'), step(2, 'Acesse **Configurações > Parametrizações**.'), step(3, 'Informe **CPF**.')];
    assert.deepEqual(collectNextStepTargets(steps3, 1), [], 'caminho de menu encerra');
    assert.deepEqual(collectNextStepTargets([step(1, 'x'), step(2, 'Clique em **Usuários** e **Salvar**.')], 1, { excludeLabels: ['Usuários'] }), [], 'exclui a cadeia e genéricos');
  });
});

// =========================================================================================================
describe('ADR-037 — guarda anti-busca continua valendo para passos de navegação', () => {
  const nav = step(1, 'Acesse o menu **Cartão de assinatura**.');
  test('campo de texto nunca é item de menu', () => {
    assert.ok(forbiddenCandidateReason(nav, { name: 'Cartão de assinatura', role: 'textbox' }), 'textbox proibido');
    assert.ok(forbiddenCandidateReason(nav, { name: 'Cartão de assinatura', role: 'searchbox' }), 'searchbox proibido');
  });
  test('busca global (CTRL + B) na barra superior é proibida também no passo implícito', () => {
    const implicitNav = step(1, 'Acesse **Usuários**.');
    assert.ok(forbiddenCandidateReason(implicitNav, { name: 'Pesquisar', role: 'textbox', inNavbar: true }), 'busca global proibida');
  });
  test('a árvore viva da Camada 2 só contém itens de menu (nunca campos)', () => {
    assert.equal(ITEMS.some(i => i.chain.some(seg => /ctrl\s*\+\s*b/i.test(seg))), false, 'sem busca global na árvore');
  });
});

// =========================================================================================================
describe('ADR-037 — o nome real do usuário nunca vai para o texto do manual nem para o relatório', () => {
  const noName = (label: string, value: unknown) => {
    const text = JSON.stringify(value ?? '');
    assert.equal(text.includes('Fulano'), false, `${label} não pode conter o nome real: ${text.slice(0, 300)}`);
  };

  test('Camada 2 no menu do usuário: travessia na cadeia viva, texto com "Olá, [usuário]"', async () => {
    const s = step(1, 'Acesse **Alterar senha**.');
    const { client, log } = fakeClient(ITEMS, { hash: '#/inicio', href: '#/senha' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png', [], { context: ctx() });
    assert.equal(res?.found, true, 'navegou pelo menu do usuário');
    const live = liveItemForCatalogChain([USER_MENU_ROOT, 'Alterar senha'], ITEMS);
    assert.ok(live, 'item vivo do menu do usuário');
    assert.ok(log.some(l => l === `move ${20 + 180 + 75},${10 + 12}`), 'o ponteiro percorreu a cascata viva');
    assert.equal(res?.validatedText, 'Acesse **Olá, [usuário] > Alterar senha**.', 'texto validado neutro');
    assert.equal(res?.divergence?.actualElementText, 'Olá, [usuário] > Alterar senha', 'elemento real neutro');
    noName('divergência', res?.divergence);
    noName('validatedText', res?.validatedText);
    noName('matchedTargetName', res?.matchedTargetName);
    noName('menuCure', res?.menuCure);
    noName('rótulos das demarcações', res?.geometry?.callouts?.map(c => c.label));
  });

  test('Camada 1 (equivalência explícita userMenu): texto, motivo e evidência neutros', async () => {
    const s = step(1, 'Acesse **Configurações > Usuários > Alterar senha**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png');
    assert.equal(res?.found, true, 'equivalência resolvida');
    assert.equal(res?.divergence?.menuBasis, 'explicit_equivalence', 'base Camada 1');
    assert.deepEqual(res?.divergence?.textChange?.to, '**Olá, [usuário] > Alterar senha**', 'substituição neutra');
    noName('divergência', res?.divergence);
    noName('validatedText', res?.validatedText);
    noName('menuCure', res?.menuCure);
  });

  test('evidência de caminho inexistente lista a raiz neutra', async () => {
    const s = step(1, 'Acesse **Xpto > Qwerty**.');
    const { client } = fakeClient(ITEMS, { hash: '#/inicio' });
    const res = await resolveAndNavigateMenuPath(client, s, 'x.png');
    assert.ok(res?.menuPathMissing, 'caminho inexistente');
    noName('evidência', res?.menuPathMissing);
    noName('descrição', describeMenuPathMissing(res!.menuPathMissing!));
  });
});

describe('ADR-037 — resposta do agy restrita à âncora do caminho documentado', () => {
  test('fora da âncora: rejeitada; dentro da âncora: aceita', () => {
    const doc = ['Configurações', 'Grupos'];
    assert.equal(planFromAgyAnswer('Dashboard > Comunicações', ITEMS, doc), null, 'outra raiz rejeitada');
    assert.equal(planFromAgyAnswer('Configurações > Usuários', ITEMS, doc)?.kind, 'navigate', 'sob "Configurações" aceita');
    assert.equal(planFromAgyAnswer('Dashboard > Comunicações', ITEMS, ['Xpto', 'Qwerty'])?.kind, 'navigate', 'sem âncora no catálogo: sem restrição');
    assert.equal(planFromAgyAnswer('Configurações > Usuários', ITEMS, ['Configurações', 'Usuários']), null, 'a âncora é a própria folha: nada estritamente abaixo');
  });
});
