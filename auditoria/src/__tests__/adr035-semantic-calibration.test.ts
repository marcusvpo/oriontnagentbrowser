import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AgentBrowserClient } from '../browser.js';
import { buildDOMIntrospectionScript, parseDOMGeometryResponse } from '../dom-geometry.js';
import { classifyFirmasStep, firmasSpecialistHandlesStep } from '../firmas-interactive.js';
import { extractBoldTargets, isLeadInBoldPhrase } from '../parser.js';
import {
  deriveStepGuard,
  forbiddenCandidateReason,
  forbiddenMeasuredReason,
  isColumnHeaderNode,
  isGlobalSearchNode,
  stepExpectsInteractiveControl
} from '../navigation-guard.js';
import { routeSynonymsFor } from '../route-synonyms.js';
import { evaluateSemanticCompatibility, inferNodeSemanticRole } from '../semantic-compatibility.js';
import {
  guardNodeOf,
  locateAndCaptureWithSelfHealing,
  pruneAndPrioritizeNodesForLLM,
  rankSemanticCandidatesInA11y,
  validateVisualCandidateSemantics,
  type ParsedA11yNode
} from '../smart-locator.js';
import type { DOMElementContext, RoutineStep } from '../types.js';
import { MockDocument, MockElement, createWindowForDoc, runInMockDom } from './mock-dom.js';

const GLOBAL_SEARCH_PLACEHOLDER = 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B';

const stepOf = (
  stepNumber: number,
  rawText: string,
  targets: string[],
  actionType: RoutineStep['actionType'] = 'click'
): RoutineStep => ({ stepNumber, rawText, targets, actionType });

// Textos reais dos passos sinalizados pelo verificador semântico multimodal (13 rotinas, 17 divergências)
const M360_STEP3 = stepOf(3, 'Utilize o campo **Descrição** e clique em **Filtrar** para localizar um item específico.', ['Descrição', 'Filtrar']);
const M660_STEP3 = stepOf(3, 'No campo **Valor**, insira o preço unitário padrão a ser cobrado do usuário.', ['Valor'], 'fill');
const R30_STEP3 = stepOf(3, 'No campo **Status**, selecione os filtros **Aguardando atendimento** e **Iniciado em**.', ['Status', 'Aguardando atendimento', 'Iniciado em'], 'select');
const SORT_STEP = stepOf(2, 'Clique no cabeçalho **Valor** para ordenar a coluna.', ['Valor']);
const CCERT_STEP5 = stepOf(5, 'Acesse **Certidões > Novo Pedido de Certidão** e informe o Livro e Folha da escritura primitiva.', ['Certidões > Novo Pedido de Certidão']);
const R100_STEP3 = stepOf(3, 'Uma mensagem de confirmação será exibida na tela; clique em **Sim** para inicializar a comanda.', ['Sim']);

// ---------------------------------------------------------------------------
// Padrão A — cabeçalho de coluna (th) nunca é campo de entrada
// ---------------------------------------------------------------------------
describe('ADR-035 Padrão A — table_column_header vs. controle interativo', () => {
  it('stepExpectsInteractiveControl: digitar/filtrar/selecionar/campo sim; coluna/ordenar não', () => {
    assert.equal(stepExpectsInteractiveControl(M360_STEP3), true, 'Utilize o campo + Filtrar');
    assert.equal(stepExpectsInteractiveControl(M660_STEP3), true, 'No campo + insira');
    assert.equal(stepExpectsInteractiveControl(R30_STEP3), true, 'selecione os filtros');
    assert.equal(stepExpectsInteractiveControl(SORT_STEP), false, 'coluna/ordenar mantém o th como alvo legítimo');
    assert.equal(stepExpectsInteractiveControl(stepOf(1, 'Observe a coluna **Situação** da grade.', ['Situação'])), false);
  });

  it('isColumnHeaderNode reconhece th, role columnheader e papel carimbado', () => {
    assert.equal(isColumnHeaderNode({ tagName: 'TH' }), true);
    assert.equal(isColumnHeaderNode({ role: 'columnheader' }), true);
    assert.equal(isColumnHeaderNode({ semanticRole: 'table_column_header' }), true);
    assert.equal(isColumnHeaderNode({ tagName: 'input', role: 'textbox' }), false);
  });

  it('inferNodeSemanticRole classifica th/columnheader como table_column_header e h1-h4 como page_heading', () => {
    assert.equal(inferNodeSemanticRole({ name: 'Descrição', tagName: 'th' }), 'table_column_header');
    assert.equal(inferNodeSemanticRole({ name: 'Descrição', role: 'columnheader' }), 'table_column_header');
    assert.equal(inferNodeSemanticRole({ name: 'Natureza', tagName: 'h3' }), 'page_heading');
    assert.equal(inferNodeSemanticRole({ name: 'Descrição', tagName: 'input', role: 'textbox' }), 'form_input');
  });

  it('evaluateSemanticCompatibility veta th/columnheader com weight 0 em passo de digitação/filtro/formulário', () => {
    for (const [step, target] of [
      [M360_STEP3, 'Descrição'],
      [M660_STEP3, 'Valor'],
      [R30_STEP3, 'Status'],
      [R30_STEP3, 'Iniciado em']
    ] as const) {
      const viaTag = evaluateSemanticCompatibility(step, target, { name: target, role: 'label', tagName: 'th' });
      assert.equal(viaTag.compatible, false, `th "${target}" deve ser vetado`);
      assert.equal(viaTag.weight, 0, 'weight 0');
      assert.equal(viaTag.nodeRole, 'table_column_header');
      const viaRole = evaluateSemanticCompatibility(step, target, { name: target, role: 'columnheader' });
      assert.equal(viaRole.compatible, false, `columnheader "${target}" deve ser vetado`);
      const viaStamp = evaluateSemanticCompatibility(step, target, { name: target, role: 'label', semanticRole: 'table_column_header' });
      assert.equal(viaStamp.compatible, false, 'papel carimbado no DOM');
    }
  });

  it('o controle real (input/select/label do campo) continua compatível', () => {
    const input = evaluateSemanticCompatibility(M660_STEP3, 'Valor', { name: 'Valor (R$)', role: 'textbox', tagName: 'input' });
    assert.equal(input.compatible, true, 'input do campo Valor');
    const label = evaluateSemanticCompatibility(M360_STEP3, 'Descrição', { name: 'Pesquisar por descrição', role: 'label', tagName: 'label' });
    assert.equal(label.compatible, true, 'label do campo de busca');
    const select = evaluateSemanticCompatibility(R30_STEP3, 'Status', { name: 'Status', role: 'combobox', tagName: 'select' });
    assert.equal(select.compatible, true, 'select Status');
  });

  it('passo que cita coluna/ordenação continua podendo casar o th', () => {
    const r = evaluateSemanticCompatibility(SORT_STEP, 'Valor', { name: 'Valor', role: 'columnheader', tagName: 'th' });
    assert.equal(r.compatible, true, 'ordenar a coluna é alvo legítimo do th');
    assert.equal(forbiddenCandidateReason(SORT_STEP, { name: 'Valor', tagName: 'th' }), null);
  });

  it('forbiddenCandidateReason: th vetado em passo de campo; forbiddenMeasuredReason cobre membros de grupo', () => {
    assert.ok(forbiddenCandidateReason(M360_STEP3, { name: 'Descrição', tagName: 'th' }), 'th em passo de campo deve ser vetado');
    assert.ok(forbiddenCandidateReason(M360_STEP3, { name: 'Descrição', role: 'columnheader' }), 'columnheader');
    assert.equal(forbiddenCandidateReason(M360_STEP3, { name: 'Pesquisar por descrição', tagName: 'label' }), null);
    const groupCtx: DOMElementContext = { tagName: 'group', innerText: 'Descrição + Filtrar', memberTags: ['th', 'button'] };
    assert.ok(forbiddenMeasuredReason(M360_STEP3, groupCtx), 'grupo com th entre os membros');
    const okGroup: DOMElementContext = { tagName: 'group', innerText: 'Descrição + Filtrar', memberTags: ['label', 'button'] };
    assert.equal(forbiddenMeasuredReason(M360_STEP3, okGroup), null, 'grupo sem th passa');
  });

  it('Camada 2A: o rótulo do campo vence o th homônimo (M-36.0/M-43.0)', () => {
    const nodes: ParsedA11yNode[] = [
      { ref: '', role: 'label', name: 'Descrição', rawLine: 'label "Descrição"', tagName: 'th', semanticRole: 'table_column_header' },
      { ref: '', role: 'label', name: 'Pesquisar por descrição', rawLine: 'label "Pesquisar por descrição"', tagName: 'label' }
    ];
    const ranked = rankSemanticCandidatesInA11y(['Descrição'], nodes, M360_STEP3);
    assert.equal(ranked.length >= 1, true, 'deve restar o rótulo do campo');
    assert.equal(ranked.every(c => c.node.tagName !== 'th'), true, 'nenhum th pode ser candidato');
    assert.equal(ranked[0].node.name, 'Pesquisar por descrição');
  });

  it('Camada 2B (poda): columnheader com @ref é descartado; o botão permanece', () => {
    const nodes: ParsedA11yNode[] = [
      { ref: '@e4', role: 'columnheader', name: 'Valor', rawLine: 'columnheader "Valor"', tagName: 'th' },
      { ref: '@e9', role: 'textbox', name: 'Valor (R$)', rawLine: 'textbox "Valor (R$)"' },
      { ref: '@e10', role: 'button', name: 'Concluir', rawLine: 'button "Concluir"' }
    ];
    const pruned = pruneAndPrioritizeNodesForLLM(M660_STEP3, nodes);
    assert.equal(pruned.some(n => n.ref === '@e4'), false, 'th removido da poda');
    assert.equal(pruned.some(n => n.ref === '@e9'), true, 'campo real preservado');
  });

  it('Camada 2C: candidato th é rejeitado pela validação SoM/Grounding', () => {
    const th = validateVisualCandidateSemantics(M660_STEP3, { name: 'Valor', role: 'columnheader', tagName: 'th', inNavbar: false });
    assert.equal(th.allowed, false, 'th rejeitado');
    const input = validateVisualCandidateSemantics(M660_STEP3, { name: 'Valor (R$)', role: 'textbox', tagName: 'input', inNavbar: false });
    assert.equal(input.allowed, true, 'input aceito');
  });
});

// ---------------------------------------------------------------------------
// Padrão C — busca global (CTRL + B) vetada em todas as camadas
// ---------------------------------------------------------------------------
describe('ADR-035 Padrão C — busca global nunca é eleita como campo de tela', () => {
  const fieldStep = stepOf(4, 'Preencha o campo **Livro** com o número do livro.', ['Livro'], 'fill');

  it('isGlobalSearchNode reconhece placeholder, id e marca do DOM', () => {
    assert.equal(isGlobalSearchNode({ placeholder: GLOBAL_SEARCH_PLACEHOLDER }), true);
    assert.equal(isGlobalSearchNode({ name: 'CTRL + B' }), true);
    assert.equal(isGlobalSearchNode({ id: 'inputSearchMenu' }), true);
    assert.equal(isGlobalSearchNode({ isGlobalSearch: true }), true);
    assert.equal(isGlobalSearchNode({ name: 'Livro', placeholder: 'Informe o livro' }), false);
  });

  it('input de texto sem nome (innerText vazio) é vetado pelo placeholder/id/barra superior, mesmo em passo de formulário', () => {
    assert.ok(forbiddenCandidateReason(fieldStep, { name: '', tagName: 'input', placeholder: GLOBAL_SEARCH_PLACEHOLDER }), 'placeholder');
    assert.ok(forbiddenCandidateReason(fieldStep, { name: '', tagName: 'input', id: 'inputSearchMenu' }), 'id');
    assert.ok(forbiddenCandidateReason(fieldStep, { name: '', tagName: 'input', inNavbar: true }), 'input dentro da barra superior');
    assert.ok(
      forbiddenMeasuredReason(fieldStep, { tagName: 'input', innerText: '', placeholder: GLOBAL_SEARCH_PLACEHOLDER }),
      'contexto medido (innerText vazio de <input>)'
    );
    assert.equal(forbiddenCandidateReason(fieldStep, { name: 'Livro', tagName: 'input', placeholder: 'Livro' }), null, 'campo real passa');
    assert.notEqual(
      forbiddenCandidateReason(fieldStep, { name: 'Quantidade por página', role: 'combobox', tagName: 'select', inNavbar: true }),
      'barra de pesquisa global (CTRL + B) não é alvo deste passo',
      'select de paginação dentro de um <nav> não é a busca global (outro veto, o de navbar em passo de formulário, é independente)'
    );
  });

  it('só é liberada quando o próprio passo cita a busca global', () => {
    const cita = stepOf(2, 'Digite o nome da tela na **barra de pesquisa** global (CTRL + B).', ['barra de pesquisa'], 'fill');
    assert.equal(forbiddenCandidateReason(cita, { name: '', tagName: 'input', placeholder: GLOBAL_SEARCH_PLACEHOLDER }), null);
  });

  it('Camada 2A/2B: nó com placeholder da busca global é eliminado do ranking e da poda', () => {
    const nodes: ParsedA11yNode[] = [
      { ref: '@e1', role: 'textbox', name: 'Livro', rawLine: 'textbox "Livro"', tagName: 'input', placeholder: GLOBAL_SEARCH_PLACEHOLDER, isGlobalSearch: true },
      { ref: '@e2', role: 'textbox', name: 'Livro', rawLine: 'textbox "Livro"', tagName: 'input' }
    ];
    const ranked = rankSemanticCandidatesInA11y(['Livro'], nodes, fieldStep);
    assert.equal(ranked.every(c => c.node.ref !== '@e1'), true, 'busca global fora do ranking 2A');
    const pruned = pruneAndPrioritizeNodesForLLM(fieldStep, nodes);
    assert.equal(pruned.some(n => n.ref === '@e1'), false, 'busca global fora da poda 2B');
    assert.equal(pruned.some(n => n.ref === '@e2'), true);
  });

  it('matriz Intenção × Papel veta a busca global em qualquer intenção (inclusive passo de formulário)', () => {
    const r = evaluateSemanticCompatibility(fieldStep, 'Livro', { name: '', role: 'textbox', tagName: 'input', placeholder: GLOBAL_SEARCH_PLACEHOLDER });
    assert.equal(r.compatible, false);
    assert.equal(r.weight, 0);
    const bar = evaluateSemanticCompatibility(fieldStep, 'Livro', { name: 'Livro', role: 'textbox', tagName: 'input', inNavbar: true });
    assert.equal(bar.compatible, false, 'campo da barra superior');
  });

  it('Camada 2C: candidato SoM/Grounding com placeholder da busca global é rejeitado', () => {
    const v = validateVisualCandidateSemantics(fieldStep, {
      name: GLOBAL_SEARCH_PLACEHOLDER,
      role: 'textbox',
      tagName: 'input',
      associatedLabel: GLOBAL_SEARCH_PLACEHOLDER,
      inNavbar: false
    });
    assert.equal(v.allowed, false);
  });

  it('incidente C-CERT-02: passo de caminho de menu nunca casa com o <input> da busca global', () => {
    assert.ok(
      forbiddenCandidateReason(CCERT_STEP5, { name: '', tagName: 'input', placeholder: GLOBAL_SEARCH_PLACEHOLDER }),
      'input da busca global em passo de menu deve ser vetado'
    );
    const r = evaluateSemanticCompatibility(CCERT_STEP5, 'Certidões > Novo Pedido de Certidão', {
      name: GLOBAL_SEARCH_PLACEHOLDER,
      role: 'textbox',
      tagName: 'input'
    });
    assert.equal(r.compatible, false);
  });
});

// ---------------------------------------------------------------------------
// Contexto de guarda do passo (deriveStepGuard + plumbing no cliente do navegador)
// ---------------------------------------------------------------------------
describe('ADR-035 — contexto de guarda do passo', () => {
  it('deriveStepGuard: campo, busca global e camada option:', () => {
    assert.deepEqual(deriveStepGuard(M360_STEP3), { fieldIntent: true, allowGlobalSearch: false, allowOptionTier: true });
    assert.equal(deriveStepGuard(SORT_STEP).fieldIntent, false);
    assert.equal(deriveStepGuard(stepOf(2, 'Digite na **barra de pesquisa** global (CTRL + B).', ['barra de pesquisa'], 'fill')).allowGlobalSearch, true);
    assert.equal(deriveStepGuard(R100_STEP3).allowOptionTier, false, 'clique puro em confirmação: "Sim" nunca é <select>');
    assert.equal(deriveStepGuard(R30_STEP3).allowOptionTier, true, 'selecione/filtre mantém a camada option:');
    assert.equal(deriveStepGuard(stepOf(4, 'Clique no ícone **+**, selecione a modalidade (**Autenticidade**).', ['+', 'Autenticidade'])).allowOptionTier, true);
  });

  it('getDOMGeometry injeta no script o contexto fixado por setStepGuard (e permite sobrescrever)', async () => {
    const client = new AgentBrowserClient({ sessionId: 'adr035-test' });
    const scripts: string[] = [];
    (client as any).eval = async (script: string) => {
      scripts.push(script);
      return 'null';
    };
    client.setStepGuard({ fieldIntent: true, allowGlobalSearch: false, allowOptionTier: false });
    await client.getDOMGeometry(['Valor']);
    assert.match(scripts[0], /const fieldIntent = true;/);
    assert.match(scripts[0], /const allowGlobalSearch = false;/);
    assert.match(scripts[0], /const allowOptionTier = false;/);
    await client.getDOMGeometry(['Valor'], { allowOptionTier: true, fieldIntent: false });
    assert.match(scripts[1], /const fieldIntent = false;/);
    assert.match(scripts[1], /const allowOptionTier = true;/);
    client.setStepGuard(null);
    await client.getDOMGeometry(['Valor']);
    assert.match(scripts[2], /const fieldIntent = false;/, 'sem contexto: comportamento anterior');
    assert.match(scripts[2], /const allowOptionTier = true;/);
  });

  it('locateAndCaptureWithSelfHealing fixa o contexto durante o passo e o restaura no finally (mesmo em erro)', async () => {
    const calls: Array<unknown> = [];
    const fake: any = {
      getStepGuard: () => 'anterior',
      setStepGuard: (g: unknown) => calls.push(g)
    };
    await assert.rejects(() => locateAndCaptureWithSelfHealing(fake, M660_STEP3, 'nao-usado.png'));
    assert.deepEqual(calls[0], { fieldIntent: true, allowGlobalSearch: false, allowOptionTier: true }, 'contexto do passo fixado');
    assert.equal(calls[calls.length - 1], 'anterior', 'estado anterior restaurado no finally');
  });

  it('guardNodeOf repassa tag, placeholder, id e papel carimbado', () => {
    const g = guardNodeOf({ name: 'x', role: 'label', tagName: 'th', placeholder: 'p', elementId: 'i', isGlobalSearch: true, semanticRole: 'table_column_header' });
    assert.deepEqual(g, { name: 'x', role: 'label', tagName: 'th', inNavbar: undefined, placeholder: 'p', id: 'i', isGlobalSearch: true, semanticRole: 'table_column_header' });
  });
});

// ---------------------------------------------------------------------------
// Script injetado no navegador (Camada 1) em mini-DOM offline
// ---------------------------------------------------------------------------
describe('ADR-035 — script do DOM (Camada 1) com fieldIntent / busca global / option:', () => {
  function measure(doc: MockDocument, targets: string[], options: Parameters<typeof buildDOMIntrospectionScript>[1] = {}) {
    const win = createWindowForDoc(doc);
    const raw = runInMockDom<string>(win, buildDOMIntrospectionScript(targets, { zone: 'any', scrollIntoView: false, ...options }));
    return parseDOMGeometryResponse(raw);
  }

  /** Tela de listagem: filtro "Pesquisar por descrição" + grade com cabeçalho "Descrição" / "Valor" */
  function listingScreen() {
    const doc = new MockDocument();
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const label = main.appendChild(new MockElement(doc, 'label', { x: 25, y: 120, w: 160, h: 18 }));
    label.innerText = 'Pesquisar por descrição';
    label.textContent = 'Pesquisar por descrição';
    const input = main.appendChild(new MockElement(doc, 'input', { x: 25, y: 140, w: 450, h: 30 }));
    label.control = input;
    const btn = main.appendChild(new MockElement(doc, 'button', { x: 1250, y: 180, w: 160, h: 30 }));
    btn.innerText = 'Filtrar';
    const table = main.appendChild(new MockElement(doc, 'table', { x: 30, y: 230, w: 1380, h: 200 }));
    const thead = table.appendChild(new MockElement(doc, 'thead', { x: 30, y: 230, w: 1380, h: 40 }));
    const tr = thead.appendChild(new MockElement(doc, 'tr', { x: 30, y: 230, w: 1380, h: 40 }));
    const thDesc = tr.appendChild(new MockElement(doc, 'th', { x: 40, y: 235, w: 120, h: 30 }));
    thDesc.innerText = 'Descrição';
    thDesc.textContent = 'Descrição';
    const thValor = tr.appendChild(new MockElement(doc, 'th', { x: 600, y: 235, w: 100, h: 30 }));
    thValor.innerText = 'Valor';
    thValor.textContent = 'Valor';
    return { doc, label, input, btn, thDesc, thValor };
  }

  it('SEM fieldIntent o texto exato do th vence o rótulo parcial (defeito original M-36.0/M-43.0)', () => {
    const { doc } = listingScreen();
    const geom = measure(doc, ['Descrição']);
    assert.ok(geom, 'deve medir algo');
    assert.equal(geom!.context.tagName, 'th', 'comportamento anterior: th exato');
    assert.equal(geom!.context.semantic?.semanticRole, 'table_column_header', 'papel carimbado no DOM');
  });

  it('COM fieldIntent o th é excluído e o rótulo do campo é medido', () => {
    const { doc } = listingScreen();
    const geom = measure(doc, ['Descrição'], { fieldIntent: true });
    assert.ok(geom, 'deve medir o rótulo do campo');
    assert.equal(geom!.context.tagName, 'label', 'label "Pesquisar por descrição"');
    // label + controle associado (bloco de campo): 25,120 -> 475,170
    assert.deepEqual(geom!.cssBox, { x: 25, y: 120, width: 450, height: 50 }, 'moldura = rótulo + caixa de digitação');
    assert.ok(geom!.actionTarget?.fillSelector, 'a ação de preenchimento recai sobre o controle');
  });

  it('th "Valor" sem nenhum campo na tela: fieldIntent não devolve o cabeçalho (cai para auto-cura/exploração)', () => {
    const { doc } = listingScreen();
    assert.equal(measure(doc, ['Valor'], { fieldIntent: true }), null, 'nenhum controle com esse nome');
    assert.ok(measure(doc, ['Valor']), 'sem fieldIntent o th ainda é medido (ordenar coluna)');
  });

  it('grupo (Descrição + Filtrar): com fieldIntent nenhum membro é th; sem ele o th aparece em memberTags', () => {
    const { doc } = listingScreen();
    const withIntent = measure(doc, ['Descrição'], { fieldIntent: true, groupTargets: ['Descrição', 'Filtrar'] });
    assert.ok(withIntent?.groupMembers, 'o grupo deve ser resolvido com os dois membros');
    assert.equal(withIntent!.context.memberTags?.includes('th'), false);
    const legacy = measure(doc, ['Descrição'], { groupTargets: ['Descrição', 'Filtrar'] });
    assert.equal(legacy!.context.memberTags?.includes('th'), true, 'sem a guarda o th era membro do grupo');
    assert.ok(forbiddenMeasuredReason(M360_STEP3, legacy!.context), 'a guarda pós-medição também o rejeita');
    assert.equal(forbiddenMeasuredReason(M360_STEP3, withIntent!.context), null);
  });

  it('título h3 de texto idêntico ao campo: o rótulo do campo vence; sozinho, o título ainda serve de último recurso', () => {
    const doc = new MockDocument();
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const h3 = main.appendChild(new MockElement(doc, 'h3', { x: 600, y: 70, w: 200, h: 30 }));
    h3.innerText = 'Natureza';
    h3.textContent = 'Natureza';
    const label = main.appendChild(new MockElement(doc, 'label', { x: 25, y: 120, w: 120, h: 18 }));
    label.innerText = 'Natureza*';
    label.textContent = 'Natureza*';
    const input = main.appendChild(new MockElement(doc, 'input', { x: 25, y: 140, w: 300, h: 30 }));
    label.control = input;

    const legacy = measure(doc, ['Natureza']);
    assert.equal(legacy!.context.tagName, 'h3', 'comportamento anterior: título exato vence o rótulo parcial');
    const guarded = measure(doc, ['Natureza'], { fieldIntent: true });
    assert.equal(guarded!.context.tagName, 'label', 'passo de campo: rótulo do campo');

    const onlyTitle = new MockDocument();
    const m2 = onlyTitle.body.appendChild(new MockElement(onlyTitle, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const h = m2.appendChild(new MockElement(onlyTitle, 'h3', { x: 600, y: 70, w: 200, h: 30 }));
    h.innerText = 'Dados da parte';
    h.textContent = 'Dados da parte';
    assert.equal(measure(onlyTitle, ['Dados da parte'], { fieldIntent: true })!.context.tagName, 'h3', 'último recurso preservado');
  });

  it('busca global: o <input> com placeholder do CTRL + B nunca é candidato, salvo allowGlobalSearch', () => {
    const doc = new MockDocument();
    const content = doc.body.appendChild(new MockElement(doc, 'section', { x: 0, y: 52, w: 1440, h: 745 }));
    content.setAttribute('id', 'content');
    const search = content.appendChild(new MockElement(doc, 'input', { x: 135, y: 72, w: 1170, h: 30 }));
    search.setAttribute('placeholder', GLOBAL_SEARCH_PLACEHOLDER);
    assert.equal(measure(doc, [GLOBAL_SEARCH_PLACEHOLDER]), null, 'padrão: excluída');
    assert.equal(measure(doc, ['pesquise aqui o nome da tela'], { fieldIntent: true }), null);
    const allowed = measure(doc, [GLOBAL_SEARCH_PLACEHOLDER], { allowGlobalSearch: true });
    assert.ok(allowed, 'passo que cita a busca global pode medi-la');
    assert.equal(allowed!.context.isGlobalSearch, true, 'marca de busca global no contexto');
  });

  it('busca global por id (inputSearchMenu) fora do conteúdo também é excluída', () => {
    const doc = new MockDocument();
    const wrap = doc.body.appendChild(new MockElement(doc, 'div', { x: 0, y: 60, w: 1440, h: 100 }));
    const search = wrap.appendChild(new MockElement(doc, 'input', { x: 135, y: 72, w: 600, h: 30 }));
    search.setAttribute('id', 'inputSearchMenu');
    search.setAttribute('placeholder', 'Livro');
    assert.equal(measure(doc, ['livro']), null, 'placeholder enganoso, mas o id revela a busca global');
  });

  it('camada option:: clique puro não elege o <select> que tem a opção "Sim" (R-10.0)', () => {
    const doc = new MockDocument();
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const select = main.appendChild(new MockElement(doc, 'select', { x: 100, y: 300, w: 200, h: 30 }));
    for (const txt of ['< Selecione >', 'Não', 'Sim']) {
      const o = new MockElement(doc, 'option', { x: 0, y: 0, w: 0, h: 0 });
      o.textContent = txt;
      select.options.push(o);
    }
    const viaOption = measure(doc, ['Sim']);
    assert.ok(viaOption, 'padrão (ADR-018): valor da lista elege o select');
    assert.equal(viaOption!.matchedSelector, 'option:sim');
    assert.equal(measure(doc, ['Sim'], { allowOptionTier: false }), null, 'passo de clique puro: sem a camada option:');
  });

  it('R-18.0: rótulos entre aspas no manual (**"Sem valor fixo"**, **"Valor"**) são medidos; o bloco de campo inclui o controle', () => {
    const doc = new MockDocument();
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const lblValor = main.appendChild(new MockElement(doc, 'label', { x: 373, y: 120, w: 40, h: 18 }));
    lblValor.innerText = 'Valor';
    lblValor.textContent = 'Valor';
    const inpValor = main.appendChild(new MockElement(doc, 'input', { x: 373, y: 140, w: 106, h: 24 }));
    lblValor.control = inpValor;
    const lblSem = main.appendChild(new MockElement(doc, 'label', { x: 785, y: 150, w: 90, h: 16 }));
    lblSem.innerText = 'Sem valor fixo';
    lblSem.textContent = 'Sem valor fixo';

    const single = measure(doc, ['"Valor"'], { fieldIntent: true });
    assert.ok(single, 'o alvo entre aspas deve ser medido');
    assert.equal(single!.context.tagName, 'label');
    assert.deepEqual(single!.cssBox, { x: 373, y: 120, width: 106, height: 44 }, 'rótulo + campo de digitação');

    const group = measure(doc, ['"Sem valor fixo"'], { fieldIntent: true, groupTargets: ['"Sem valor fixo"', '"Valor"'] });
    assert.ok(group?.groupMembers, 'grupo resolvido');
    assert.equal(group!.groupMembers!.length, 2, 'os dois alvos entre aspas foram medidos');
    assert.equal(group!.unresolvedGroupTargets?.length ?? 0, 0, 'nenhum alvo ficou sem localizar por causa das aspas');
    assert.deepEqual(group!.groupMembers!.map(m => m.query), ['"Sem valor fixo"', '"Valor"'], 'a consulta original (com aspas) é preservada para a Trava de Evidência');
  });

  it('R-18.0: passo de grupo "Sem valor fixo" + "Valor" preenche o campo de texto, nunca a caixa de marcação', () => {
    const doc = new MockDocument();
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const lblValor = main.appendChild(new MockElement(doc, 'label', { x: 373, y: 120, w: 40, h: 18 }));
    lblValor.innerText = 'Valor';
    lblValor.textContent = 'Valor';
    const inpValor = main.appendChild(new MockElement(doc, 'input', { x: 373, y: 140, w: 106, h: 24 }));
    inpValor.setAttribute('type', 'text');
    inpValor.setAttribute('name', 'valor');
    lblValor.control = inpValor;
    const lblSem = main.appendChild(new MockElement(doc, 'label', { x: 785, y: 150, w: 90, h: 16 }));
    lblSem.innerText = 'Sem valor fixo';
    lblSem.textContent = 'Sem valor fixo';
    const chkSem = main.appendChild(new MockElement(doc, 'input', { x: 770, y: 151, w: 10, h: 11 }));
    chkSem.setAttribute('type', 'checkbox');
    chkSem.setAttribute('name', 'semValorFixo');
    lblSem.control = chkSem;

    // O rótulo da caixa vem PRIMEIRO no passo ("Desmarque a caixa 'Sem valor fixo' e digite no campo 'Valor'")
    const group = measure(doc, ['"Sem valor fixo"'], { fieldIntent: true, groupTargets: ['"Sem valor fixo"', '"Valor"'] });
    assert.ok(group?.groupMembers, 'grupo resolvido');
    assert.equal(group!.actionTarget?.fill?.tagName, 'input', 'há controle de preenchimento');
    assert.equal(group!.actionTarget?.fill?.text, 'valor', 'o preenchimento recai no campo de texto "Valor" (name=valor), não na caixa semValorFixo');

    // Só a caixa de marcação disponível: continua sendo o último recurso (comportamento anterior preservado)
    const docOnlyBox = new MockDocument();
    const m2 = docOnlyBox.body.appendChild(new MockElement(docOnlyBox, 'main', { x: 20, y: 60, w: 1400, h: 700 }));
    const l2 = m2.appendChild(new MockElement(docOnlyBox, 'label', { x: 785, y: 150, w: 90, h: 16 }));
    l2.innerText = 'Sem valor fixo';
    l2.textContent = 'Sem valor fixo';
    const c2 = m2.appendChild(new MockElement(docOnlyBox, 'input', { x: 770, y: 151, w: 10, h: 11 }));
    c2.setAttribute('type', 'checkbox');
    c2.setAttribute('name', 'semValorFixo');
    l2.control = c2;
    const only = measure(docOnlyBox, ['Sem valor fixo'], { fieldIntent: true });
    assert.equal(only?.actionTarget?.fill?.text, 'semValorFixo', 'sem campo de texto, a caixa continua como único controle');
  });

  it('R-18.0: frase introdutória em negrito terminada em ":" não é alvo (parser)', () => {
    const step = '**Para definir um preço padrão:** Desmarque a caixa **"Sem valor fixo"** e digite o valor exato no campo **"Valor"**.';
    assert.deepEqual(extractBoldTargets(step), ['"Sem valor fixo"', '"Valor"'], 'a frase introdutória sai da lista de alvos');
    assert.equal(isLeadInBoldPhrase('Para definir um preço padrão:'), true, 'finalidade');
    assert.equal(isLeadInBoldPhrase('Se possuir scanner conectado:'), true, 'condição');
    assert.equal(isLeadInBoldPhrase('Quando o Tomador for uma pessoa diferente do Solicitante:'), true, 'tempo/condição');
    assert.equal(isLeadInBoldPhrase('Serventia:'), false, 'rótulo de seção real continua alvo');
    assert.equal(isLeadInBoldPhrase('Seção Final (Outras Informações):'), false, '"Seção" não é o conectivo "Se"');
    assert.equal(isLeadInBoldPhrase('Para'), false, 'sem dois-pontos nem complemento, é só um nome');
    assert.equal(isLeadInBoldPhrase('Para pesquisa'), false, 'sem dois-pontos finais, é rótulo');
    assert.deepEqual(extractBoldTargets('**Para modificar:** clique em **Editar**.'), ['Editar'], 'passo com lead-in + botão');
    assert.deepEqual(extractBoldTargets('**Para modificar:** altere o texto livremente.'), [], 'só lead-in: passo sem alvo (print limpa)');
  });

  it('R-10.0: o ícone "+" (Adicionar Novo Pedido) não é o fluxo de pedido por Senha SGA', () => {
    const plus = stepOf(2, 'Na parte superior da tela de atendimento, clique no botão de **"+" (Adicionar Novo Pedido)**.', ['"+" (Adicionar Novo Pedido)']);
    assert.equal(classifyFirmasStep(plus), null, 'o "+" é medido pelo localizador padrão');
    const sga = stepOf(2, 'Clique em **Novo Pedido** ou informe a **Senha SGA**.', ['Novo Pedido', 'Senha SGA']);
    assert.equal(classifyFirmasStep(sga), 'sga_order', 'o fluxo por Senha SGA continua intacto');
    const addService = stepOf(4, 'Clique em **Adicionar Serviço** (**+**) para incluir o ato.', ['Adicionar Serviço', '+']);
    assert.equal(classifyFirmasStep(addService), 'add_service', 'decisão editorial da ADR-026 preservada');
  });

  it('D-3.11: em #/pedidoFirmas/cadastrar o especialista de Firmas conduz a busca e o Pré-Filtro de Grade não roda antes dele', () => {
    const search = stepOf(2, 'Localize o cliente pelo número do **Pedido**, senha do **SGA** ou pesquisando por **Nome/CPF/Cartão**.', ['Pedido', 'SGA', 'Nome/CPF/Cartão']);
    assert.equal(firmasSpecialistHandlesStep(search, '#/pedidoFirmas/cadastrar'), true, 'busca de cliente na tela de Firmas é do especialista');
    assert.equal(firmasSpecialistHandlesStep(search, '#/documentoApresentado'), false, 'fora da tela de Firmas o pré-filtro segue valendo');
    const menu = stepOf(1, 'Acesse o menu **Firmas > Reconhecimento de Firmas**.', ['Firmas > Reconhecimento de Firmas']);
    assert.equal(firmasSpecialistHandlesStep(menu, '#/pedidoFirmas/cadastrar'), false, 'passo de caminho de menu nunca é do especialista');
  });

  it('M-36.0: o campo renomeado "Pesquisar por documento apresentado" é sinônimo de rota do "Pesquisar por descrição"', () => {
    const syn = routeSynonymsFor('#/documentoApresentado', 'Pesquisar por descrição');
    assert.equal(syn.length, 1, 'uma equivalência na rota');
    assert.deepEqual(syn[0].real, ['Pesquisar por documento apresentado']);
    assert.equal(routeSynonymsFor('#/outraRota', 'Pesquisar por descrição').length, 0, 'só vale nessa rota');
  });

  it('script gerado continua sintaticamente válido com as novas opções', () => {
    for (const opts of [{}, { fieldIntent: true }, { allowGlobalSearch: true, allowOptionTier: false, groupTargets: ['A', 'B'] }]) {
      assert.doesNotThrow(() => new Function(`return (${buildDOMIntrospectionScript(['X'], { zone: 'content', ...opts })});`));
    }
  });
});
