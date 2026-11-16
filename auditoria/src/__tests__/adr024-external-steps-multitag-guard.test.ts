import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRoutineScope, stripProductNameTargets } from '../step-scope.js';
import {
  isBlockingReviewStatus,
  normalizeReviewTags,
  primaryStatusOf,
  reviewPrefix,
  reviewTagsPrefix,
  statusFromPrefix,
  stripReviewPrefix,
  tagsFromPrefix
} from '../review-taxonomy.js';
import {
  forbiddenCandidateReason,
  forbiddenMeasuredReason,
  isGlobalSearchName,
  isStrictNavigationStep,
  synonymMatchesNode
} from '../navigation-guard.js';
import { buildMenuPathMissingEvidence, describeMenuPathMissing, extractMenuPaths, type MenuTreeItem } from '../menu-path.js';
import { parseAccessibilitySnapshot, rankSemanticCandidatesInA11y } from '../smart-locator.js';
import { buildRevisedRoutineDocument } from '../report.js';
import { auditExternalSteps, externalStepsFromMd, reviewTagsFromMd } from '../invariants.js';
import type { ParsedRoutine, RoutineStep } from '../types.js';

const step = (stepNumber: number, rawText: string): RoutineStep => ({
  stepNumber,
  rawText,
  targets: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1].trim()),
  actionType: 'click',
  subItems: [],
  mainTargetCount: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).length
});

// ---------------------------------------------------------------------------------------------------------
// 1. Pré-análise de escopo de passo
// ---------------------------------------------------------------------------------------------------------
describe('ADR-024 §1 — escopo de passo (external_portal x orion_tn)', () => {
  const centralDois = [
    step(1, 'O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.'),
    step(2, 'Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.'),
    step(3, 'Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.'),
    step(4, 'No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.'),
    step(5, 'No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal.'),
    step(6, 'Clique em **Gravar**.'),
    step(7, 'Retorne à tela de envio do COAF e faça a transmissão do lote pendente.')
  ];

  test('C-CENTRAL-02: passos 1-3 externos (SISCOAF); execução começa no passo 4', () => {
    const a = analyzeRoutineScope(centralDois);
    assert.deepEqual(a.externalSteps.map(s => s.stepNumber), [1, 2, 3]);
    assert.ok(a.externalSteps.every(s => s.portal === 'SISCOAF'));
    assert.equal(a.firstInternalStep, 4);
    assert.deepEqual(a.steps.slice(3).map(s => s.scope), ['orion_tn', 'orion_tn', 'orion_tn', 'orion_tn']);
    assert.equal(a.hasExternal, true);
  });

  test('citar uma central como módulo do Orion TN não é portal externo', () => {
    const a = analyzeRoutineScope([
      step(1, 'Retorne ao módulo **Comunicações > CENSEC CTP**, recalcule a carga quinzenal e faça a transmissão.'),
      step(2, 'Acesse **Comunicações > DOI**, gere novamente a remessa mensal e valide no programa da Receita Federal.')
    ]);
    assert.equal(a.hasExternal, false);
    assert.equal(a.firstInternalStep, 1);
  });

  test('passo final em portal externo (e-Notariado) é externo; os anteriores seguem no Orion TN', () => {
    const a = analyzeRoutineScope([
      step(1, 'No **Orion TN**, certifique-se de que a ficha de firma está salva.'),
      step(2, 'Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**.'),
      step(3, 'Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível.')
    ]);
    assert.deepEqual(a.externalSteps.map(s => s.stepNumber), [3]);
    assert.equal(a.steps[1].scope, 'orion_tn');
  });

  test('"No **Orion TN**, ..." cita o produto, não um alvo de tela (C-CENTRAL-08 passo 1)', () => {
    const only = stripProductNameTargets(step(1, 'No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva.'));
    assert.deepEqual(only.step.targets, []);
    assert.equal(only.step.mainTargetCount, 0);
    assert.deepEqual(only.removed, ['Orion TN']);
    assert.equal(only.step.rawText, 'No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva.');

    const withPath = stripProductNameTargets(step(4, 'No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.'));
    assert.deepEqual(withPath.step.targets, ['Configurações > Parâmetros Gerais > Comunicação COAF']);
    assert.equal(withPath.step.mainTargetCount, 1);

    // sem retorno ao sistema o negrito segue como alvo (ex.: card "Orion TN" do portal)
    const card = stripProductNameTargets(step(2, 'Selecione o card **Orion TN**.'));
    assert.deepEqual(card.step.targets, ['Orion TN']);
    assert.deepEqual(card.removed, []);
  });

  test('rotina inteira externa não tem primeiro passo do Orion TN (nenhum navegador)', () => {
    const a = analyzeRoutineScope([step(1, 'Acesse o portal oficial do **SINTER** com o e-CPF.'), step(2, 'Consulte a matrícula no portal.')]);
    assert.equal(a.firstInternalStep, null);
    assert.equal(a.externalSteps.length, 2);
  });
});

// ---------------------------------------------------------------------------------------------------------
// 2. Taxonomia [CCC] e múltiplas tags
// ---------------------------------------------------------------------------------------------------------
describe('ADR-024 §2 — [CCC] e multi-tags', () => {
  test('ordem canônica ATT, CCC, DDD, XRX e sem espaço entre colchetes', () => {
    assert.equal(reviewTagsPrefix(['CCC', 'ATT']), '[ATT][CCC] ');
    assert.equal(reviewTagsPrefix(['XRX', 'DDD', 'CCC']), '[CCC][DDD][XRX] ');
    assert.equal(reviewTagsPrefix([]), '');
    assert.deepEqual(normalizeReviewTags(['ccc', '[ATT]', 'ATT', 'lixo']), ['ATT', 'CCC']);
  });

  test('prefixo de pasta: tags, status principal e remoção', () => {
    assert.deepEqual(tagsFromPrefix('[ATT][CCC] C-CENTRAL-02-x'), ['ATT', 'CCC']);
    assert.deepEqual(tagsFromPrefix('[CCC] [ATT] C-CENTRAL-02-x'), ['ATT', 'CCC']);
    assert.equal(statusFromPrefix('[ATT][CCC] C-CENTRAL-02-x'), 'atualizacao_editorial');
    assert.equal(statusFromPrefix('[CCC] C-CENTRAL-04-x'), 'comunicacao_externa');
    assert.equal(statusFromPrefix('C-CENTRAL-04-x'), null);
    assert.equal(stripReviewPrefix('[ATT][CCC] C-CENTRAL-02-x'), 'C-CENTRAL-02-x');
    assert.equal(stripReviewPrefix('[!!!] [CCC] C-CENTRAL-02-x'), 'C-CENTRAL-02-x');
  });

  test('status principal: tags bloqueantes têm precedência sobre [CCC]', () => {
    assert.equal(primaryStatusOf(['CCC', 'DDD']), 'dependencia_dados_banco');
    assert.equal(primaryStatusOf(['CCC']), 'comunicacao_externa');
    assert.equal(primaryStatusOf([]), null);
    assert.equal(reviewPrefix('atualizacao_editorial', ['CCC']), '[ATT][CCC] ');
    assert.equal(reviewPrefix('comunicacao_externa', ['CCC']), '[CCC] ');
    assert.equal(reviewPrefix('validado_inalterado'), '');
  });

  test('[CCC] não bloqueia a auditoria; [ATT]/[DDD]/[XRX] sim', () => {
    assert.equal(isBlockingReviewStatus('comunicacao_externa'), false);
    assert.equal(isBlockingReviewStatus('atualizacao_editorial'), true);
    assert.equal(isBlockingReviewStatus('validado_inalterado'), false);
  });
});

// ---------------------------------------------------------------------------------------------------------
// 4. Guarda contra falsa cura de menu (D-3.14)
// ---------------------------------------------------------------------------------------------------------
describe('ADR-024 §4 — guarda estrita de navegação (D-3.14)', () => {
  const d314 = step(1, 'Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.');
  const searchPlaceholder = 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B';

  test('passo com caminho de menu é navegação estrita', () => {
    assert.equal(isStrictNavigationStep(d314), true);
    assert.equal(isStrictNavigationStep(step(2, 'Clique em **Concluir Pedido** para salvar.')), false);
    assert.equal(isStrictNavigationStep(step(3, 'Acesse o menu **Notas** e depois o submenu **Certidões**.')), true);
  });

  test('a barra de pesquisa global (CTRL + B) é reconhecida', () => {
    assert.equal(isGlobalSearchName(searchPlaceholder), true);
    assert.equal(isGlobalSearchName('Novo Pedido de Certidão'), false);
  });

  test('o nó da busca global é proibido para o passo de menu (A11y e medido no DOM)', () => {
    assert.ok(forbiddenCandidateReason(d314, { name: searchPlaceholder, role: 'textbox' }));
    assert.ok(forbiddenCandidateReason(d314, { name: 'qualquer', role: 'searchbox' }));
    assert.ok(forbiddenMeasuredReason(d314, { tagName: 'INPUT', innerText: searchPlaceholder }));
    assert.ok(forbiddenMeasuredReason(d314, { tagName: 'textarea', innerText: 'x' }));
  });

  test('item de menu legítimo (link) não é proibido', () => {
    assert.equal(forbiddenCandidateReason(d314, { name: 'Certidões', role: 'link' }), null);
    assert.equal(forbiddenMeasuredReason(d314, { tagName: 'A', innerText: 'Certidões' }), null);
  });

  test('a busca global só é alvo quando o passo a cita', () => {
    const cita = step(4, 'Digite o nome da tela na **barra de pesquisa** global (CTRL + B).');
    assert.equal(forbiddenCandidateReason(cita, { name: searchPlaceholder, role: 'textbox' }), null);
    // passo comum (sem citar a busca) também não casa com ela
    assert.ok(forbiddenCandidateReason(step(5, 'Clique em **Novo**.'), { name: searchPlaceholder, role: 'textbox' }));
  });

  test('campo de texto é legítimo em passo que não é de navegação estrita', () => {
    assert.equal(forbiddenCandidateReason(step(6, 'Preencha o campo **Descrição**.'), { name: 'Descrição', role: 'textbox' }), null);
  });

  test('símbolo "+" só casa por igualdade exata (causa do incidente: "CTRL + B")', () => {
    assert.equal(synonymMatchesNode('+', 'atalho ctrl + b'), false);
    assert.equal(synonymMatchesNode('+', '+'), true);
    assert.equal(synonymMatchesNode('adicionar +', 'adicionar +'), true);
    assert.equal(synonymMatchesNode('novo', 'novo pedido'), true);
    assert.equal(synonymMatchesNode('ok', 'notebook'), false);
  });

  test('regressão D-3.14: a busca global não é candidata de "Novo Pedido de Certidão" (era 96%)', () => {
    // Árvore de acessibilidade como a da tela inicial: a caixa de busca global e itens de menu
    const nodes = parseAccessibilitySnapshot(
      [`- textbox "${searchPlaceholder}" [ref=e1]`, '- link "Notas" [ref=e2]', '- link "Certidões" [ref=e3]'].join('\n')
    );
    // Sem a guarda (comportamento anterior), o "+" do dicionário casava por substring com "CTRL + B"
    const before = rankSemanticCandidatesInA11y(d314.targets, nodes);
    assert.ok(!before.some(c => /ctrl/i.test(c.node.name)), 'nem sem passo: o "+" não casa por substring');
    const ranked = rankSemanticCandidatesInA11y(d314.targets, nodes, d314);
    assert.ok(!ranked.some(c => /ctrl/i.test(c.node.name)), 'a busca global não pode ser candidata');
  });
});

describe('ADR-024 §4 — evidência real de caminho de menu inexistente', () => {
  const item = (chain: string[], hasChildren = false): MenuTreeItem => ({ chain, selectors: chain.map(c => `[x-${c}]`), disabled: false, hasChildren });
  const tree: MenuTreeItem[] = [
    item(['Notas'], true),
    item(['Notas', 'Protocolo']),
    item(['Notas', 'Certidões'], true),
    item(['Notas', 'Certidões', 'Pedidos de Certidão']),
    item(['Caixa'], true),
    item(['Caixa', 'Recibos'])
  ];

  test('percorre Notas -> Certidões e aponta o segmento que não existe', () => {
    const paths = extractMenuPaths(step(1, 'Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.'));
    const ev = buildMenuPathMissingEvidence(paths, tree);
    assert.deepEqual(ev.existingPrefix, ['Notas', 'Certidões']);
    assert.equal(ev.missingSegment, 'Novo Pedido de Certidão');
    assert.deepEqual(ev.siblings, ['Pedidos de Certidão']);
    assert.deepEqual(ev.roots, ['Notas', 'Caixa']);
    const text = describeMenuPathMissing(ev);
    assert.match(text, /Notas > Certidões/);
    assert.match(text, /Pedidos de Certidão/);
    assert.match(text, /CTRL \+ B/);
  });

  test('menu raiz inexistente', () => {
    const paths = extractMenuPaths(step(1, 'Acesse **Financeiro > Boletos**.'));
    const ev = buildMenuPathMissingEvidence(paths, tree);
    assert.deepEqual(ev.existingPrefix, []);
    assert.equal(ev.missingSegment, 'Financeiro');
    assert.match(describeMenuPathMissing(ev), /menu raiz "Financeiro" não existe/);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Relatório e validador de passos externos
// ---------------------------------------------------------------------------------------------------------
describe('ADR-024 — relatório com passos externos e multi-tags', () => {
  const steps = [
    { ...step(1, 'Acesse o portal oficial do **SISCOAF** com o e-CPF.'), scope: 'external_portal' as const, externalPortal: 'SISCOAF' },
    { ...step(2, 'No **Orion TN**, clique em **Gravar**.'), scope: 'orion_tn' as const }
  ];
  const parsed: ParsedRoutine = {
    id: 'C-CENTRAL-99',
    titulo: 'Teste',
    modulo: 'centrais',
    secao: 'C',
    tem_video: false,
    frontmatter: {},
    descricao: 'Descrição original.',
    steps,
    observacoes: [],
    rawContent: ''
  };
  const externalResult = {
    stepNumber: 1,
    originalText: steps[0].rawText,
    validatedText: steps[0].rawText,
    isModified: false,
    screenshotRawPath: '',
    screenshotAnnotatedPath: '',
    printFiles: [],
    stepScope: 'external_portal' as const,
    status: 'ok' as const
  };
  const internalResult = {
    stepNumber: 2,
    originalText: steps[1].rawText,
    validatedText: steps[1].rawText,
    isModified: false,
    screenshotRawPath: 'x.png',
    screenshotAnnotatedPath: 'x.png',
    printFiles: ['passo-02.png'],
    status: 'ok' as const
  };

  test('[CCC] sozinha: relatório não bloqueante, com callout externo, sem print do passo 1 e review_tags', () => {
    const { content } = buildRevisedRoutineDocument({
      parsed,
      results: [externalResult, internalResult],
      divergences: [],
      status: 'comunicacao_externa'
    });
    assert.match(content, /review_tags: \['CCC'\]/);
    assert.match(content, /status: comunicacao_externa/);
    assert.match(content, /Etapa Externa \(Fora do Orion TN\)/);
    assert.match(content, /#### Passo a passo revisado:/);
    assert.ok(!content.includes('[aqui vai a print "passo-01'));
    assert.match(content, /\[aqui vai a print "passo-02.png"\]/);
    assert.ok(!content.includes('[!CAUTION]'));
    assert.deepEqual(reviewTagsFromMd(content), ['CCC']);
    assert.deepEqual(externalStepsFromMd(content), [{ stepNumber: 1, portal: 'SISCOAF' }]);
    assert.deepEqual(auditExternalSteps(content, ['passo-02.png', 'passo-02.webp']).issues, []);
  });

  test('[ATT][CCC]: bloqueio no Orion TN + etapa externa, texto original preservado', () => {
    const { content } = buildRevisedRoutineDocument({
      parsed,
      results: [externalResult, { ...internalResult, status: 'blocked', errorMessage: 'sem evidência' }],
      divergences: [],
      status: 'atualizacao_editorial',
      extraTags: ['CCC'],
      block: { kind: 'manual_outdated', tipo: 'Defasagem Editorial do Manual', motivo: 'm', roteiro: ['r'] }
    });
    assert.match(content, /review_tags: \['ATT', 'CCC'\]/);
    assert.match(content, /ROTINA QUE REQUER REVISÃO HUMANA \(\[ATT\]\[CCC\]\)/);
    assert.match(content, /Etapas externas \(\[CCC\]\)/);
    assert.deepEqual(reviewTagsFromMd(content), ['ATT', 'CCC']);
    // O "Roteiro Técnico" (também numerado 1., 2.) precede o passo a passo e não pode ser confundido com ele
    assert.match(content, /#### Roteiro Técnico para Execução Manual:\n1\. r/);
    assert.deepEqual(auditExternalSteps(content, ['passo-02.png']).issues, []);
  });

  test('validador: print em passo externo e [CCC] ausente são discrepâncias; ausência de passo-01.png não é', () => {
    const { content } = buildRevisedRoutineDocument({ parsed, results: [externalResult, internalResult], divergences: [], status: 'comunicacao_externa' });
    // sem passo-01.png em disco: sem erro de paridade
    assert.deepEqual(auditExternalSteps(content, ['passo-02.png']).issues, []);
    // print falsa para o passo externo em disco
    const fake = auditExternalSteps(content, ['passo-01.png', 'passo-02.png']);
    assert.equal(fake.issues.length, 1);
    assert.match(fake.issues[0], /evidência falsa/);
    // [CCC] removida do relatório
    const broken = content.replace(/ {2}review_tags: \['CCC'\]\n/, '').replace('status: comunicacao_externa', 'status: validado_inalterado');
    assert.notEqual(broken, content, 'a remoção de review_tags deve alterar o relatório');
    const brokenIssues = auditExternalSteps(broken).issues;
    assert.equal(
      brokenIssues.some(i => /\[CCC\]/.test(i)),
      true,
      `esperava a discrepância de [CCC] ausente; obtido: ${JSON.stringify(brokenIssues)}`
    );
  });
});
