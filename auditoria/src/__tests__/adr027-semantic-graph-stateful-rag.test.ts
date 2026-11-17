import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  evaluateSemanticCompatibility,
  hasIntraWordSubstringCollision,
  inferNodeSemanticRole,
  inferStepIntent
} from '../semantic-compatibility.js';
import { rankSemanticCandidatesInA11y, type ParsedA11yNode } from '../smart-locator.js';
import {
  compileHumanReviewsKnowledge,
  getCachedHumanReviewsKnowledge,
  getHumanTargetSuggestionsForStep,
  getRoutineHumanGuidance,
  parseReviewMotivo,
  resolveMenuPathViaHumanReview
} from '../human-review-rag.js';
import { chooseMenuItem, extractMenuPaths } from '../menu-path.js';
import {
  detectStatefulStepPlan,
  diffDOMStateSnapshots,
  type DOMStateSnapshot
} from '../stateful-step-engine.js';
import type { RoutineStep } from '../types.js';

const stepOf = (
  stepNumber: number,
  rawText: string,
  targets: string[],
  actionType: RoutineStep['actionType'] = 'click',
  routineId?: string
): RoutineStep => ({
  stepNumber,
  routineId,
  rawText,
  targets,
  actionType
});

describe('ADR-027 Frente 1 — Grafo Semântico de Seções e Compatibilidade Intenção × Papel', () => {
  it('infere semanticRole corretamente para navbar, grid_row_picker, entity_creation_button e service_execution_trigger', () => {
    assert.equal(inferNodeSemanticRole({ name: 'Firmas', role: 'link', inNavbar: true }), 'navigation_root');
    assert.equal(inferNodeSemanticRole({ name: 'Reconhecimento de firmas', role: 'menuitem', inNavbar: true }), 'navigation_leaf');
    assert.equal(inferNodeSemanticRole({ name: 'Novo cartão +', role: 'button' }), 'entity_creation_button');
    assert.equal(
      inferNodeSemanticRole({
        name: '+',
        role: 'button',
        sectionTitle: 'Nomes encontrados',
        rowContext: { rowIndex: 0, firstColText: 'teste', secondColText: '451' }
      }),
      'grid_row_picker'
    );
    assert.equal(inferNodeSemanticRole({ name: 'Efetuar Serviço', role: 'button' }), 'service_execution_trigger');
    assert.equal(inferNodeSemanticRole({ name: 'Finalizar', role: 'button' }), 'section_confirm_button');
    assert.equal(
      inferNodeSemanticRole({ name: 'Nome', role: 'textbox', sectionTitle: 'Pesquisa de Cartão' }),
      'search_filter_input'
    );
  });

  it('bloqueia colisão lexical intra-palavra ("Autenticidade" vs "Cidade") e permite flexão ("Alíquota" vs "Alíquotas")', () => {
    assert.equal(hasIntraWordSubstringCollision('Autenticidade', 'Cidade'), true);
    assert.equal(hasIntraWordSubstringCollision('Alíquota', 'Alíquotas'), false);
    assert.equal(hasIntraWordSubstringCollision('Grupo Firmas', 'Escrevente de Firmas'), false);
  });

  it('bloqueia com peso 0.0 combinações semanticamente incompatíveis antes do Sørensen-Dice', () => {
    const launchStep = stepOf(4, 'No painel **Serviços realizados**, clique em **Adicionar Serviço** (**+**).', [
      'Serviços realizados',
      'Adicionar Serviço',
      '+'
    ]);
    assert.equal(inferStepIntent(launchStep, '+'), 'launch_service_or_item');

    const novoCartaoCompat = evaluateSemanticCompatibility(launchStep, '+', {
      name: 'Novo cartão +',
      role: 'button'
    });
    assert.equal(novoCartaoCompat.compatible, false);
    assert.equal(novoCartaoCompat.weight, 0);

    const atoStep = stepOf(5, 'Selecione o tipo de ato (**Autenticidade** ou **Semelhança**).', [
      'Autenticidade',
      'Semelhança'
    ], 'select');
    const cidadeCompat = evaluateSemanticCompatibility(atoStep, 'Autenticidade', {
      name: 'Cidade',
      role: 'combobox'
    });
    assert.equal(cidadeCompat.compatible, false);
    assert.equal(cidadeCompat.weight, 0);

    const groupStep = stepOf(
      3,
      'Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.',
      ['Grupos de Trabalho', 'Grupo Firmas'],
      'check'
    );
    const navbarCompat = evaluateSemanticCompatibility(groupStep, 'Grupo Firmas', {
      name: 'Firmas',
      role: 'link',
      inNavbar: true
    });
    assert.equal(navbarCompat.compatible, false);
    assert.equal(navbarCompat.weight, 0);
  });

  it('aplica peso de seção (1.15) quando sectionTitle coincide com a seção citada no passo', () => {
    const step = stepOf(
      4,
      'Na seção **Serviços realizados**, clique em **Efetuar**. ',
      ['Serviços realizados', 'Efetuar'],
      'click'
    );
    const compat = evaluateSemanticCompatibility(step, 'Efetuar', {
      name: 'Efetuar Serviço',
      role: 'button',
      sectionTitle: 'Serviços realizados'
    });
    assert.equal(compat.compatible, true);
    assert.equal(compat.weight, 1.15);

    const nodes: ParsedA11yNode[] = [
      { ref: '@e1', role: 'combobox', name: 'Cidade', rawLine: 'combobox "Cidade"' },
      { ref: '@e2', role: 'button', name: 'Novo cartão +', rawLine: 'button "Novo cartão +"' },
      { ref: '@e3', role: 'button', name: 'Efetuar Serviço', rawLine: 'button "Efetuar Serviço"', sectionTitle: 'Serviços realizados' }
    ];
    const ranked = rankSemanticCandidatesInA11y(['Efetuar'], nodes, step);
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0].node.name, 'Efetuar Serviço');
  });
});

describe('ADR-027 Frente 3 — RAG de Revisões Humanas e Grafo de Conhecimento Cruzado', () => {
  it('carrega todas as 9 revisões humanas canônicas com diretrizes diretas e aprendizado cruzado', () => {
    const kb = getCachedHumanReviewsKnowledge();
    assert.ok(kb.reviews.length >= 9);

    const cCentral = getRoutineHumanGuidance('C-CENTRAL-02');
    assert.ok(cCentral);
    assert.ok(
      cCentral.menuOverrides.some(
        m =>
          m.toChain.join(' > ') === 'Configurações > Parametrizações' &&
          m.postMenuSidebarItem === 'Comunicações' &&
          m.postSidebarSubportalLink?.includes('Orion Coaf')
      )
    );

    const d314 = getRoutineHumanGuidance('D-3.14');
    assert.ok(d314);
    assert.ok(d314.menuOverrides.some(m => m.toChain.join(' > ') === 'Notas > Certidões e serviços'));

    // Grafo cruzado aplica equivalência aprendida em D-3.14 / R-2.0 para QUALQUER outra rotina do acervo
    const crossMenuFirmas = resolveMenuPathViaHumanReview('OUTRA-ROTINA-99', ['Firmas', 'Balcão de Firmas']);
    assert.ok(crossMenuFirmas);
    assert.deepEqual(
      crossMenuFirmas.targetChain.map(s => s.toLowerCase()),
      ['firmas', 'reconhecimento de firmas']
    );
    assert.equal(crossMenuFirmas.viaDirectReview, false);

    const crossMenuCert = resolveMenuPathViaHumanReview('OUTRA-ROTINA-CERT', ['Notas', 'Certidões', 'Novo Pedido de Certidão']);
    assert.ok(crossMenuCert);
    assert.deepEqual(crossMenuCert.targetChain, ['Notas', 'Certidões e serviços']);
  });

  it('chooseMenuItem usa Camada 0.1 da revisão humana antes da heurística cega', () => {
    const step = stepOf(1, 'Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.', ['Notas > Certidões > Novo Pedido de Certidão'], 'navigate', 'D-3.14');
    const paths = extractMenuPaths(step);
    const tree = [
      { chain: ['Notas', 'Protocolos'], selectors: ['[a]', '[b]'], disabled: false, hasChildren: false },
      { chain: ['Notas', 'Certidões e serviços'], selectors: ['[a]', '[c]'], disabled: false, hasChildren: false },
      { chain: ['Notas', 'Certidões e serviços em aberto'], selectors: ['[a]', '[d]'], disabled: false, hasChildren: false }
    ];
    const match = chooseMenuItem(paths, tree, [], { routineId: 'D-3.14' });
    assert.ok(match);
    assert.deepEqual(match.item.chain, ['Notas', 'Certidões e serviços']);
    assert.equal(match.confidence, 0.98);
  });

  it('fornece sugestões diretas de alvo (Camada 0.1) para C-FIRMA-03 e C-CENTRAL-02', () => {
    const sFirma = stepOf(3, 'Marque **Grupo Firmas**.', ['Grupo Firmas'], 'check', 'C-FIRMA-03');
    const sugFirma = getHumanTargetSuggestionsForStep(sFirma);
    assert.equal(sugFirma[0]?.actual, 'Escrevente de Firmas');

    const sCoaf = stepOf(5, 'Informe o **CPF do Responsável pelo Envio**.', ['CPF do Responsável pelo Envio'], 'fill', 'C-CENTRAL-02');
    const sugCoaf = getHumanTargetSuggestionsForStep(sCoaf);
    assert.equal(sugCoaf[0]?.actual, 'CPF/CNPJ');
  });

  it('interpreta novas revisões humanas futuras escritas em linguagem natural via parseReviewMotivo', () => {
    const parsed = parseReviewMotivo(
      'M-99.0',
      [1, 3],
      "O caminho atualizado é 'Livros > Abertura de Livros'. No passo 3, 'Confirmar' -> 'Salvar Registro'. Erroneamente destacou 'CTRL + B'."
    );
    assert.ok(parsed.menuOverrides?.some(m => m.toChain.join(' > ') === 'Livros > Abertura de Livros'));
    assert.ok(parsed.targetOverrides?.some(t => t.documented === 'Confirmar' && t.actual === 'Salvar Registro'));
    assert.ok(parsed.forbiddenTargets?.some(f => f.pattern.toLowerCase().includes('ctrl + b')));

    const compiled = compileHumanReviewsKnowledge([], 'seed_fallback');
    assert.ok(compiled.crossRoutine.globalAntiTargets.length >= 3);
  });
});

describe('ADR-027 Frente 2 — Máquina de Estado Interativa Universal com DOM Diffing', () => {
  it('detecta plano guided_sidebar_subportal em C-CENTRAL-02 passo 4 e search_and_pick universal em outros módulos', () => {
    const coafStep4 = stepOf(
      4,
      'No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.',
      ['Configurações > Parâmetros Gerais > Comunicação COAF'],
      'navigate',
      'C-CENTRAL-02'
    );
    const coafPlan = detectStatefulStepPlan(coafStep4);
    assert.ok(coafPlan);
    assert.equal(coafPlan.kind, 'guided_sidebar_subportal');
    assert.equal(coafPlan.postMenuSidebarItem, 'Comunicações');

    const notasBuscaStep = stepOf(2, 'Pesquise a parte pelo **Nome** ou **CPF**.', ['Nome', 'CPF'], 'fill', 'M-NOTAS-TESTE');
    const notasNextStep = stepOf(3, 'Na grade de **Partes encontradas**, selecione o cadastro e preencha os dados do ato.', []);
    const universalPlan = detectStatefulStepPlan(notasBuscaStep, notasNextStep);
    assert.ok(universalPlan);
    assert.equal(universalPlan.kind, 'search_and_pick');
  });

  it('calcula DOM Diffing Antes x Depois revelando novas seções, campos e grades com picker', () => {
    const before: DOMStateSnapshot = {
      url: 'http://localhost/#/pedidoFirmas/cadastrar',
      sections: ['Serviços solicitados', 'Serviços realizados'],
      grids: [{ headers: ['Serviço', 'QTD'], rowCount: 0, hasRowPicker: false }],
      buttons: ['Novo cartão +', 'Limpar', 'Filtrar'],
      inputs: ['Nome', 'CPF ou CIN']
    };
    const after: DOMStateSnapshot = {
      url: 'http://localhost/#/pedidoFirmas/cadastrar',
      sections: ['Nomes encontrados'],
      grids: [
        { headers: ['Serviço', 'QTD'], rowCount: 0, hasRowPicker: false },
        { headers: ['Nome civil', 'Cartão', 'CPF ou CIN'], rowCount: 5, hasRowPicker: true }
      ],
      buttons: ['Novo cartão +', 'Limpar', 'Filtrar', 'Finalizar'],
      inputs: ['Nome', 'CPF ou CIN']
    };
    const diff = diffDOMStateSnapshots(before, after);
    assert.equal(diff.hasReactiveChange, true);
    assert.deepEqual(diff.newSections, ['Nomes encontrados']);
    assert.deepEqual(diff.appearedButtons, ['Finalizar']);
    assert.equal(diff.populatedGridWithPicker, true);
  });
});
