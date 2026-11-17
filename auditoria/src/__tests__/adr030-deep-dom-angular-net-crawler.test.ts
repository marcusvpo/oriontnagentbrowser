import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { afterEach, describe, it } from 'node:test';
import yaml from 'yaml';
import {
  attDiagnosisYamlLines,
  buildAttDiagnosis,
  renderAttDiagnosisTip,
  type ScreenStructuralInventory
} from '../att-screen-advisor.js';
import {
  AgentBrowserClient,
  buildNetMonitorInitScript,
  buildProbeActionNodeScript,
  parseApiResponsePayload,
  sanitizeMonitoredUrl,
  type OrionNetMonitorSnapshot
} from '../browser.js';
import {
  buildDOMIntrospectionScript,
  extractAngularBindingsFromAttrs,
  humanizeAngularIdentifier,
  parseDOMGeometryResponse
} from '../dom-geometry.js';
import { buildMenuPathMissingEvidence, chooseMenuItem, extractMenuPaths, type MenuTreeItem } from '../menu-path.js';
import {
  crawlOrionRouteGraph,
  findRouteEntriesByTabOrSection,
  findRouteEntryByChain,
  findRouteEntryByHash,
  setRouteGraphForTesting,
  type OrionRouteGraph
} from '../route-crawler.js';
import {
  buildCollectVisibleLabelNodesScript,
  cleanA11yNodeName,
  pruneAndPrioritizeNodesForLLM,
  resolveViaLLMOnAccessibilityTree,
  type ParsedA11yNode
} from '../smart-locator.js';
import { runStatefulStepPostAction } from '../stateful-step-engine.js';
import type { RoutineStep } from '../types.js';

// ---------------------------------------------------------------------------
// Mini DOM sintético com suporte a Open Shadow DOM, iframes recursivos e scroll
// ---------------------------------------------------------------------------
interface RectSpec {
  x: number;
  y: number;
  w: number;
  h: number;
}

class MockElement {
  nodeType = 1;
  tagName: string;
  id = '';
  className = '';
  children: MockElement[] = [];
  parentElement: MockElement | null = null;
  shadowRoot: MockShadowRoot | null = null;
  ownerDocument: MockDocument;
  attrs: Record<string, string> = {};
  style: Record<string, string> = {};
  textContent = '';
  innerText = '';
  disabled = false;
  readOnly = false;
  clientLeft = 0;
  clientTop = 0;
  clientWidth = 0;
  clientHeight = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  contentDocument: MockDocument | null = null;
  options: MockElement[] = [];
  labels: MockElement[] = [];
  control: MockElement | null = null;
  value = '';
  rectFn: () => RectSpec;
  onScrollIntoView?: () => void;

  constructor(doc: MockDocument, tag: string, rect: RectSpec | (() => RectSpec) = { x: 20, y: 20, w: 120, h: 32 }) {
    this.ownerDocument = doc;
    this.tagName = tag.toUpperCase();
    this.rectFn = typeof rect === 'function' ? rect : () => rect;
    const r = this.rectFn();
    this.offsetWidth = r.w;
    this.offsetHeight = r.h;
    this.clientWidth = r.w;
    this.clientHeight = r.h;
  }

  appendChild<T extends MockElement>(child: T): T {
    child.parentElement = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  attachShadow(init: { mode: 'open' | 'closed' }): MockShadowRoot {
    const sr = new MockShadowRoot(this, this.ownerDocument);
    if (init.mode === 'open') this.shadowRoot = sr;
    return sr;
  }

  setAttribute(name: string, val: string): void {
    const k = name.toLowerCase();
    this.attrs[k] = String(val);
    if (k === 'id') this.id = String(val);
    if (k === 'class') this.className = String(val);
  }

  getAttribute(name: string): string | null {
    const k = name.toLowerCase();
    if (k === 'id' && this.id) return this.id;
    if (k === 'class' && this.className) return this.className;
    return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null;
  }

  hasAttribute(name: string): boolean {
    return this.getAttribute(name) !== null;
  }

  removeAttribute(name: string): void {
    delete this.attrs[name.toLowerCase()];
  }

  get previousElementSibling(): MockElement | null {
    if (!this.parentElement) return null;
    const idx = this.parentElement.children.indexOf(this);
    return idx > 0 ? this.parentElement.children[idx - 1] : null;
  }

  get nextElementSibling(): MockElement | null {
    if (!this.parentElement) return null;
    const idx = this.parentElement.children.indexOf(this);
    return idx >= 0 && idx + 1 < this.parentElement.children.length ? this.parentElement.children[idx + 1] : null;
  }

  getRootNode(): MockDocument | MockShadowRoot {
    let cur: MockElement | null = this;
    while (cur) {
      if ((cur as any)._shadowHostRoot) return (cur as any)._shadowHostRoot;
      cur = cur.parentElement;
    }
    return this.ownerDocument;
  }

  getBoundingClientRect() {
    const r = this.rectFn();
    return {
      left: r.x,
      top: r.y,
      right: r.x + r.w,
      bottom: r.y + r.h,
      width: r.w,
      height: r.h,
      x: r.x,
      y: r.y
    };
  }

  scrollIntoView(_opts?: any): void {
    this.onScrollIntoView?.();
  }

  contains(other: MockElement | null): boolean {
    let cur = other;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  matches(selector: string): boolean {
    return matchSimpleSelectorList(this, selector);
  }

  closest(selector: string): MockElement | null {
    let cur: MockElement | null = this;
    while (cur) {
      if (cur.matches(selector)) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  querySelectorAll(selector: string): MockElement[] {
    return queryInSubtree(this, selector, false);
  }

  querySelector(selector: string): MockElement | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

class MockShadowRoot {
  host: MockElement;
  ownerDocument: MockDocument;
  children: MockElement[] = [];

  constructor(host: MockElement, doc: MockDocument) {
    this.host = host;
    this.ownerDocument = doc;
  }

  appendChild<T extends MockElement>(child: T): T {
    child.parentElement = null;
    (child as any)._shadowHostRoot = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  querySelectorAll(selector: string): MockElement[] {
    const out: MockElement[] = [];
    for (const c of this.children) {
      if (matchSimpleSelectorList(c, selector)) out.push(c);
      out.push(...queryInSubtree(c, selector, false));
    }
    return out;
  }

  querySelector(selector: string): MockElement | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  getElementById(id: string): MockElement | null {
    return this.querySelector(`[id="${id}"]`);
  }
}

class MockDocument {
  documentElement: MockElement;
  head: MockElement;
  body: MockElement;
  readyState = 'complete';
  title = 'Orion TN Teste';
  defaultView: any;

  constructor(win?: any) {
    this.defaultView = win;
    this.documentElement = new MockElement(this, 'html', { x: 0, y: 0, w: 1440, h: 900 });
    this.head = this.documentElement.appendChild(new MockElement(this, 'head', { x: 0, y: 0, w: 0, h: 0 }));
    this.body = this.documentElement.appendChild(new MockElement(this, 'body', { x: 0, y: 0, w: 1440, h: 900 }));
  }

  createElement(tag: string): MockElement {
    return new MockElement(this, tag);
  }

  getElementById(id: string): MockElement | null {
    return this.body.querySelector(`#${id}`) || this.head.querySelector(`#${id}`);
  }

  querySelectorAll(selector: string): MockElement[] {
    return queryInSubtree(this.documentElement, selector, false);
  }

  querySelector(selector: string): MockElement | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  elementFromPoint(_x: number, _y: number): MockElement | null {
    return null;
  }
}

function matchSingleSelector(el: MockElement, raw: string): boolean {
  const s = raw.trim().replace(/^:scope\s*>\s*/, '');
  if (!s) return false;
  if (s === '*') return true;
  if (s.includes('>')) {
    const parts = s.split('>').map(p => p.trim());
    const leaf = parts[parts.length - 1];
    const parentSel = parts[parts.length - 2];
    return matchSingleSelector(el, leaf) && !!el.parentElement && matchSingleSelector(el.parentElement, parentSel);
  }
  const hasAttrNot = s.match(/^([a-z0-9*]+)?(?:\:not\(\[type=["']?hidden["']?\]\))?$/i);
  if (hasAttrNot && s.includes(':not([type="hidden"])')) {
    const base = s.replace(':not([type="hidden"])', '');
    if (el.getAttribute('type') === 'hidden') return false;
    return base ? matchSingleSelector(el, base) : true;
  }
  // Separa combinador simples descendente (ex.: `.modal-header .modal-title`)
  if (/\s+/.test(s) && !s.includes('[')) {
    const parts = s.split(/\s+/);
    const leaf = parts.pop()!;
    if (!matchSingleSelector(el, leaf)) return false;
    let cur = el.parentElement;
    while (cur) {
      if (matchSingleSelector(cur, parts.join(' '))) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  let rem = s;
  const tagMatch = rem.match(/^[a-z0-9]+/i);
  if (tagMatch) {
    if (el.tagName.toLowerCase() !== tagMatch[0].toLowerCase()) return false;
    rem = rem.slice(tagMatch[0].length);
  }
  const attrMatches = Array.from(rem.matchAll(/\[([^\]=]+)(?:=["']?([^\]"']+)["']?)?\]/g));
  for (const m of attrMatches) {
    const attrName = m[1].trim().toLowerCase();
    const attrVal = m[2];
    const actual = el.getAttribute(attrName);
    if (actual === null) return false;
    if (attrVal !== undefined && actual !== attrVal) return false;
    rem = rem.replace(m[0], '');
  }
  const idMatches = Array.from(rem.matchAll(/#([A-Za-z0-9_-]+)/g));
  for (const m of idMatches) {
    if (el.id !== m[1]) return false;
    rem = rem.replace(m[0], '');
  }
  const clsMatches = Array.from(rem.matchAll(/\.([A-Za-z0-9_-]+)/g));
  const elClasses = new Set(el.className.split(/\s+/).filter(Boolean));
  for (const m of clsMatches) {
    if (!elClasses.has(m[1])) return false;
  }
  return true;
}

function matchSimpleSelectorList(el: MockElement, selector: string): boolean {
  return selector
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .some(part => matchSingleSelector(el, part));
}

function queryInSubtree(root: MockElement, selector: string, includeSelf: boolean): MockElement[] {
  const out: MockElement[] = [];
  if (includeSelf && matchSimpleSelectorList(root, selector)) out.push(root);
  for (const c of root.children) {
    out.push(...queryInSubtree(c, selector, true));
  }
  return out;
}

function createWindowForDoc(doc: MockDocument) {
  const win: any = {
    innerWidth: 1440,
    innerHeight: 900,
    devicePixelRatio: 1,
    scrollX: 0,
    scrollY: 0,
    pageXOffset: 0,
    pageYOffset: 0,
    location: { href: 'http://orion.local/#/teste', origin: 'http://orion.local', hash: '#/teste' },
    document: doc,
    getComputedStyle: (el: MockElement) => ({
      display: el.style.display || 'block',
      visibility: el.style.visibility || 'visible',
      opacity: el.style.opacity || '1',
      zoom: el.style.zoom || '1',
      paddingLeft: el.style.paddingLeft || '0px',
      paddingTop: el.style.paddingTop || '0px',
      paddingRight: el.style.paddingRight || '0px',
      paddingBottom: el.style.paddingBottom || '0px',
      borderLeftWidth: el.style.borderLeftWidth || `${el.clientLeft}px`,
      borderTopWidth: el.style.borderTopWidth || `${el.clientTop}px`,
      borderRightWidth: el.style.borderRightWidth || `${el.clientLeft}px`,
      borderBottomWidth: el.style.borderBottomWidth || `${el.clientTop}px`
    })
  };
  doc.defaultView = win;
  return win;
}

function runInMockDom<T>(win: any, script: string): T {
  const context = vm.createContext({
    window: win,
    document: win.document,
    Set,
    Map,
    Array,
    Math,
    JSON,
    Date,
    Number,
    String,
    Boolean,
    Object,
    RegExp,
    URL,
    Error,
    Event,
    parseFloat,
    parseInt
  });
  return vm.runInContext(script, context) as T;
}

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

afterEach(() => {
  setRouteGraphForTesting(undefined);
});

describe('ADR-030 Parte A.1 — Travessia Deep DOM, Iframes Recursivos Pós-Scroll e Zoom 0.8', () => {
  it('todos os scripts injetados gerados são JavaScript sintaticamente válidos', () => {
    const scripts = [
      buildDOMIntrospectionScript(['Salvar'], { zone: 'content', groupTargets: ['Nome', 'CPF'] }),
      buildProbeActionNodeScript('[data-orion-audit-click-1]'),
      buildNetMonitorInitScript(),
      buildCollectVisibleLabelNodesScript()
    ];
    for (const s of scripts) {
      assert.doesNotThrow(() => new Function(`return (${s});`));
    }
  });

  it('atravessa Open Shadow DOM mantendo sectionTitle, zona content e veto a .sidebar/.ng-hide', () => {
    const doc = new MockDocument();
    const win = createWindowForDoc(doc);

    // Sidebar lateral que deve ser excluída pela zona 'content'
    const aside = doc.body.appendChild(new MockElement(doc, 'aside', { x: 0, y: 60, w: 220, h: 600 }));
    aside.className = 'sidebar';
    const sideBtn = aside.appendChild(new MockElement(doc, 'button', { x: 15, y: 120, w: 160, h: 30 }));
    sideBtn.innerText = 'CPF';

    // Área de conteúdo irmã da sidebar com fieldset e Open Shadow DOM
    const main = doc.body.appendChild(new MockElement(doc, 'main', { x: 240, y: 60, w: 1180, h: 700 }));
    const fsNode = main.appendChild(new MockElement(doc, 'fieldset', { x: 260, y: 80, w: 900, h: 300 }));
    const legend = fsNode.appendChild(new MockElement(doc, 'legend', { x: 270, y: 90, w: 200, h: 24 }));
    legend.innerText = 'Dados da Parte';

    const host = fsNode.appendChild(new MockElement(doc, 'orion-shadow-card', { x: 270, y: 125, w: 500, h: 120 }));
    const sr = host.attachShadow({ mode: 'open' });

    // Um input oculto por .ng-hide que deve ser ignorado
    const hiddenWrap = sr.appendChild(new MockElement(doc, 'div', { x: 280, y: 130, w: 200, h: 30 }));
    hiddenWrap.className = 'ng-hide';
    const hiddenInput = hiddenWrap.appendChild(new MockElement(doc, 'input', { x: 280, y: 130, w: 180, h: 28 }));
    hiddenInput.setAttribute('ng-model', 'filtro.cpfCnpj');

    // Input real visível dentro de Open Shadow DOM
    const input = sr.appendChild(new MockElement(doc, 'input', { x: 280, y: 170, w: 220, h: 32 }));
    input.setAttribute('ng-model', 'filtro.cpfCnpj');

    const raw = runInMockDom<string>(
      win,
      buildDOMIntrospectionScript(['cpf cnpj'], { zone: 'content', scrollIntoView: false, zoom: 0.8 })
    );
    const geom = parseDOMGeometryResponse(raw);
    assert.ok(geom, 'deve localizar o input dentro do Open Shadow DOM via ng-model');
    assert.equal(geom!.cssBox.x, 280);
    assert.equal(geom!.cssBox.y, 170);
    assert.equal(geom!.zone, 'content');
    assert.equal(geom!.context.semantic?.sectionTitle, 'Dados da Parte', 'composedParent atravessa ShadowRoot até legend');
    assert.equal(geom!.context.semantic?.angularBindings?.humanizedModel, 'cpf cnpj');
    assert.ok(geom!.actionTarget?.clickSelector);
    assert.ok(geom!.actionTarget?.fillSelector);
  });

  it('recalcula frameOffset pós-scroll em cadeia recursiva de iframes dentro de Shadow DOM com clientLeft, paddingLeft e zoom 0.8', () => {
    const rootDoc = new MockDocument();
    const rootWin = createWindowForDoc(rootDoc);
    rootDoc.documentElement.style.zoom = '0.8';

    // Shadow host no documento raiz contendo iframe1
    const shadowHost = rootDoc.body.appendChild(new MockElement(rootDoc, 'portal-shell', { x: 0, y: 0, w: 1440, h: 900 }));
    const sr1 = shadowHost.attachShadow({ mode: 'open' });

    // Estado antes vs depois do scroll: iframe1 começa em y=700 e após scrollIntoView vai para y=100
    let scrolled = false;
    const iframe1 = sr1.appendChild(
      new MockElement(rootDoc, 'iframe', () => ({
        x: 80,
        y: scrolled ? 100 : 700,
        w: 600,
        h: 400
      }))
    );
    // Zoom 0.8 no documento pai: fr.width = 600, offsetWidth = 750 (600 / 750 = 0.8)
    iframe1.offsetWidth = 750;
    iframe1.clientLeft = 5;
    iframe1.clientTop = 5;
    iframe1.style.paddingLeft = '10px';
    iframe1.style.paddingTop = '10px';
    iframe1.clientWidth = 740;
    iframe1.clientHeight = 490;

    const doc1 = new MockDocument();
    createWindowForDoc(doc1);
    iframe1.contentDocument = doc1;

    // iframe2 aninhado dentro de iframe1 -> iframe3 (profundidade 3)
    const iframe2 = doc1.body.appendChild(new MockElement(doc1, 'iframe', { x: 50, y: 40, w: 500, h: 350 }));
    iframe2.offsetWidth = 500;
    iframe2.clientLeft = 5;
    iframe2.clientTop = 5;
    iframe2.style.paddingLeft = '10px';
    iframe2.style.paddingTop = '10px';
    iframe2.clientWidth = 490;
    iframe2.clientHeight = 340;

    const doc2 = new MockDocument();
    createWindowForDoc(doc2);
    iframe2.contentDocument = doc2;

    const iframe3 = doc2.body.appendChild(new MockElement(doc2, 'iframe', { x: 20, y: 20, w: 300, h: 200 }));
    iframe3.offsetWidth = 300;
    iframe3.clientLeft = 0;
    iframe3.clientTop = 0;
    iframe3.clientWidth = 300;
    iframe3.clientHeight = 200;

    const doc3 = new MockDocument();
    createWindowForDoc(doc3);
    iframe3.contentDocument = doc3;

    const btn = doc3.body.appendChild(
      new MockElement(doc3, 'button', () => ({
        x: 25,
        y: scrolled ? 30 : 350, // fora do recorte de 200px de iframe3 antes do scroll
        w: 100,
        h: 40
      }))
    );
    btn.innerText = 'Confirmar Etapa';
    btn.onScrollIntoView = () => {
      scrolled = true;
    };

    const raw = runInMockDom<string>(
      rootWin,
      buildDOMIntrospectionScript(['Confirmar Etapa'], { scrollIntoView: true, zone: 'any', zoom: 0.8 })
    );
    const geom = parseDOMGeometryResponse(raw);
    assert.ok(geom, 'deve localizar botão na profundidade 3 de iframes e recalcular após scroll');
    assert.equal(scrolled, true, 'scrollIntoView deve ter sido disparado');

    // Cálculo exato esperado pós-scroll:
    // iframe1: x=80 + (5+10)*0.8 = 92; y=100 + (5+10)*0.8 = 112; scale = 0.8
    // iframe2: x=92 + 50*0.8 + (5+10)*0.8 = 144; y=112 + 40*0.8 + (5+10)*0.8 = 156; scale = 0.8
    // iframe3: x=144 + 20*0.8 = 160; y=156 + 20*0.8 = 172; scale = 0.8
    // btn:     x=160 + 25*0.8 = 180; y=172 + 30*0.8 = 196; w=100*0.8=80; h=40*0.8=32
    assert.deepEqual(geom!.cssBox, { x: 180, y: 196, width: 80, height: 32 });
    assert.ok(geom!.actionTarget?.clickSelector, 'carimbo actionTarget deve ser gerado mesmo dentro de iframe same-origin');

    // Agora testa probeActionNode com findDeepBySelector somando frameOffset
    const probeRaw = runInMockDom<string>(
      rootWin,
      buildProbeActionNodeScript(geom!.actionTarget!.clickSelector, '.sidebar', 0.8)
    );
    const probed = JSON.parse(probeRaw);
    assert.deepEqual(probed.box, { x: 180, y: 196, width: 80, height: 32 });
    assert.equal(probed.text, 'Confirmar Etapa');
  });
});

describe('ADR-030 Parte A.2 — Poda Semântica e Ranqueamento na Camada 2B', () => {
  it('limpa PUA/NBSP, remove label sem @ref, veta peso 0, remove navbar em zona content e dedup grade', () => {
    const step = stepOf(
      4,
      'Na seção **Serviços realizados**, preencha a **Modalidade** e clique em **Adicionar Serviço**.',
      ['Serviços realizados', 'Modalidade', 'Adicionar Serviço'],
      'fill'
    );

    const nodes: ParsedA11yNode[] = [
      // Sem ref / label -> descartado (a)
      { ref: '', role: 'label', name: 'Modalidade do Ato', rawLine: 'label "Modalidade do Ato"' },
      { ref: 'invalid', role: 'button', name: 'Inválido', rawLine: 'button "Inválido"' },
      // Navbar em zona content -> descartado (b)
      { ref: '@e1', role: 'link', name: 'Firmas', rawLine: 'link "Firmas"', inNavbar: true, semanticRole: 'navigation_root' },
      // Vetos semânticos weight === 0 -> descartados (b)
      { ref: '@e2', role: 'button', name: '\uE005\u00A0Novo cartão +', rawLine: 'button "Novo cartão +"' },
      { ref: '@e3', role: 'combobox', name: 'Cidade', rawLine: 'combobox "Cidade"' },
      { ref: '@e4', role: 'searchbox', name: 'CTRL + B', rawLine: 'searchbox "CTRL + B"' },
      // Repetição em linhas de grade -> mantém apenas 1º representante (c)
      { ref: '@e5', role: 'button', name: '\uE014\u00A0Alterar', rawLine: 'button "Alterar"', sectionTitle: 'Itens' },
      { ref: '@e6', role: 'button', name: '\uE014\u00A0Alterar', rawLine: 'button "Alterar"', sectionTitle: 'Itens' },
      { ref: '@e7', role: 'button', name: '\uE014\u00A0Alterar', rawLine: 'button "Alterar"', sectionTitle: 'Itens' },
      // 45 botões de ruído antes do alvo real para testar priorização antes do slice(0, 40) (d)
      ...Array.from({ length: 45 }, (_, i) => ({
        ref: `@e${20 + i}`,
        role: 'button',
        name: `Ação genérica ${i}`,
        rawLine: `button "Ação genérica ${i}"`
      })),
      {
        ref: '@e99',
        role: 'button',
        name: '\uE010\u00A0Incluir Serviço\u200B',
        rawLine: 'button "Incluir Serviço"',
        sectionTitle: 'Serviços realizados'
      }
    ];

    const pruned = pruneAndPrioritizeNodesForLLM(step, nodes, 40);
    assert.equal(pruned.length, 40);
    assert.equal(pruned[0].ref, '@e99', 'alvo de maior afinidade + sectionTitle deve ir para o topo antes do corte de 40');
    assert.equal(pruned[0].name, 'Incluir Serviço', 'PUA, NBSP e zero-width removidos');
    assert.equal(pruned.some(n => n.role === 'label' || n.ref === ''), false, 'sem nós label sem ref');
    assert.equal(pruned.some(n => n.ref === '@e1' || n.ref === '@e2' || n.ref === '@e3' || n.ref === '@e4'), false);
    assert.equal(pruned.filter(n => n.name === 'Alterar' && n.sectionTitle === 'Itens').length, 1, 'grade deduplicada');
  });

  it('cleanA11yNodeName limpa PUA, NBSP e espaços múltiplos', () => {
    assert.equal(cleanA11yNodeName('\uE014\u00A0Salvar  \uF001 Registro\u200B'), 'Salvar Registro');
  });

  it('resolveViaLLMOnAccessibilityTree valida novamente compatibilidade sobre o @ref retornado pelo LLM', async () => {
    const step = stepOf(5, 'Selecione **Autenticidade**.', ['Autenticidade'], 'select');
    const nodes: ParsedA11yNode[] = [
      { ref: '@e10', role: 'combobox', name: 'Cidade', rawLine: 'combobox "Cidade"' },
      { ref: '@e11', role: 'combobox', name: 'Tipo de Reconhecimento', rawLine: 'combobox "Tipo de Reconhecimento"', sectionTitle: 'Ato' }
    ];

    // LLM retorna @e10 (que já foi podado fora por weight === 0!)
    const rejectedFetch = (async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ ref: '@e10', confidence: 0.9, reason: 'teste' }) } }] }), {
        status: 200
      })) as unknown as typeof fetch;
    assert.equal(await resolveViaLLMOnAccessibilityTree(step, nodes, rejectedFetch), null);

    // LLM retorna @e11 (válido e presente na lista podada)
    let sentBody = '';
    const acceptedFetch = (async (_url: any, init: any) => {
      sentBody = String(init?.body || '');
      return new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify({ ref: '@e11', confidence: 0.85, reason: 'equivalente' }) } }] }),
        { status: 200 }
      );
    }) as unknown as typeof fetch;
    const hit = await resolveViaLLMOnAccessibilityTree(step, nodes, acceptedFetch);
    assert.ok(hit);
    assert.equal(hit!.node.ref, '@e11');
    assert.match(sentBody, /\{Ato\}/, 'prompt compacto deve incluir {sectionTitle}');
  });
});

describe('ADR-030 Parte B.3 — Extrator de Bindings Angular (ng-model / ng-click / ui-sref)', () => {
  it('humaniza identificadores Angular e extrai atributos determinísticos', () => {
    assert.equal(humanizeAngularIdentifier('filtro.cpfCnpj', 'model'), 'cpf cnpj');
    assert.equal(humanizeAngularIdentifier('vm.dataNascimento | date', 'model'), 'data nascimento');
    assert.equal(humanizeAngularIdentifier('vm.filtrarPesquisa(item)', 'action'), 'filtrar pesquisa');
    assert.equal(humanizeAngularIdentifier('abrirModalCartao()', 'action'), 'abrir modal cartao');

    const b = extractAngularBindingsFromAttrs({
      'ng-model': 'filtro.cpfCnpj',
      'ng-click': 'vm.filtrarPesquisa(item)',
      'ui-sref': 'app.firmas.cadastrar',
      'ng-disabled': 'form.$invalid',
      'ng-if': 'vm.podeEditar'
    });
    assert.deepEqual(b, {
      ngModel: 'filtro.cpfCnpj',
      humanizedModel: 'cpf cnpj',
      ngClick: 'vm.filtrarPesquisa(item)',
      humanizedAction: 'filtrar pesquisa',
      uiSref: 'app.firmas.cadastrar',
      ngDisabled: 'form.$invalid',
      ngIf: 'vm.podeEditar'
    });
  });

  it('resolve botão icônico via ng-click e input sem <label> via ng-model, desempatando ng-disabled', () => {
    const doc = new MockDocument();
    const win = createWindowForDoc(doc);

    const iconicDisabled = doc.body.appendChild(new MockElement(doc, 'button', { x: 40, y: 100, w: 32, h: 32 }));
    iconicDisabled.setAttribute('ng-click', 'vm.efetuarServico()');
    iconicDisabled.setAttribute('ng-disabled', 'true');

    const iconicEnabled = doc.body.appendChild(new MockElement(doc, 'button', { x: 90, y: 100, w: 32, h: 32 }));
    iconicEnabled.setAttribute('ng-click', 'vm.efetuarServico()');

    const inputCpf = doc.body.appendChild(new MockElement(doc, 'input', { x: 40, y: 160, w: 220, h: 30 }));
    inputCpf.setAttribute('ng-model', 'filtro.cpfCnpj');

    const btnRaw = runInMockDom<string>(win, buildDOMIntrospectionScript(['efetuar servico'], { zone: 'any', scrollIntoView: false }));
    const btnGeom = parseDOMGeometryResponse(btnRaw);
    assert.ok(btnGeom);
    assert.equal(btnGeom!.cssBox.x, 90, 'desempate prefere botão habilitado sobre ng-disabled="true"');
    assert.match(btnGeom!.matchedSelector, /^ng-click:/);
    assert.equal(btnGeom!.context.semantic?.semanticRole, 'service_execution_trigger');
    assert.equal(btnGeom!.context.semantic?.angularBindings?.humanizedAction, 'efetuar servico');

    const inpRaw = runInMockDom<string>(win, buildDOMIntrospectionScript(['cpf cnpj'], { zone: 'any', scrollIntoView: false }));
    const inpGeom = parseDOMGeometryResponse(inpRaw);
    assert.ok(inpGeom);
    assert.equal(inpGeom!.cssBox.y, 160);
    assert.match(inpGeom!.matchedSelector, /^ng-model:/);
    assert.equal(inpGeom!.context.semantic?.associatedLabel, 'cpf cnpj');
  });
});

describe('ADR-030 Parte B.4 — Monitor de Rede XHR/Fetch e Integração com Máquina de Estado', () => {
  it('sanitiza URLs internas sem vazar IP/host e classifica respostas JSON vazias e HTTP 400/422', () => {
    assert.equal(sanitizeMonitoredUrl('http://10.0.3.20:8080/webFirmas/api/v1/pesquisa?nome=teste'), '/webFirmas/api/v1/pesquisa?nome=teste');

    const empty = parseApiResponsePayload(200, 'http://10.0.3.20:8080/api/pessoas', '[]', 1000);
    assert.equal(empty.isEmptyArray, true);
    assert.equal(empty.url, '/api/pessoas');

    const pagedEmpty = parseApiResponsePayload(200, '/api/selos', JSON.stringify({ content: [], totalElements: 0 }), 1001);
    assert.equal(pagedEmpty.isEmptyArray, true);

    const err422 = parseApiResponsePayload(
      422,
      'http://10.0.3.20:8080/api/pedidos',
      JSON.stringify({ message: 'Período de pesquisa inválido' }),
      1002
    );
    assert.equal(err422.isEmptyArray, false);
    assert.equal(err422.validationMessage, 'Período de pesquisa inválido');
  });

  it('instala __orionNetMonitor idempotentemente no window e contabiliza pendingCount em fetch e XHR', async () => {
    const fetchCalls: string[] = [];
    let resolveFetch!: (res: any) => void;
    class FakeXHR {
      status = 0;
      responseType = '';
      responseText = '';
      listeners: Record<string, Array<() => void>> = {};
      addEventListener(ev: string, fn: () => void) {
        (this.listeners[ev] ||= []).push(fn);
      }
      open(_m: string, _u: string) {}
      send() {}
      emitLoadEnd(status: number, body: string) {
        this.status = status;
        this.responseText = body;
        for (const fn of this.listeners['loadend'] || []) fn();
      }
    }
    const win: any = {
      location: { origin: 'http://10.0.3.99:8080' },
      fetch: (url: string) => {
        fetchCalls.push(url);
        return new Promise(r => {
          resolveFetch = r;
        });
      },
      XMLHttpRequest: FakeXHR
    };
    const ctx = vm.createContext({ window: win, URL, JSON, Date, Math, Array, Object, String, Number, RegExp });

    vm.runInContext(buildNetMonitorInitScript(), ctx);
    vm.runInContext(buildNetMonitorInitScript(), ctx); // 2ª chamada idempotente
    assert.equal(win.__orionNetMonitor.installed, true);
    assert.equal(win.__orionNetMonitor.pendingCount, 0);

    // Fetch em voo -> pendingCount === 1
    const p = win.fetch('http://10.0.3.99:8080/api/cartoes?nome=teste');
    assert.equal(win.__orionNetMonitor.pendingCount, 1);
    resolveFetch({
      status: 200,
      headers: { get: () => 'application/json' },
      clone() {
        return { text: async () => '[]' };
      }
    });
    await p;
    await new Promise(r => setTimeout(r, 15));
    assert.equal(win.__orionNetMonitor.pendingCount, 0);
    assert.equal(win.__orionNetMonitor.lastApiResponse.isEmptyArray, true);
    assert.equal(win.__orionNetMonitor.lastApiResponse.url, '/api/cartoes?nome=teste');

    // XHR HTTP 422 -> pendingCount 1 -> 0 e captura validationMessage
    const xhr = new win.XMLHttpRequest();
    xhr.open('POST', 'http://10.0.3.99:8080/api/filtros');
    xhr.send();
    assert.equal(win.__orionNetMonitor.pendingCount, 1);
    xhr.emitLoadEnd(422, JSON.stringify({ mensagem: 'Informe CPF ou Nome' }));
    assert.equal(win.__orionNetMonitor.pendingCount, 0);
    assert.equal(win.__orionNetMonitor.lastApiResponse.status, 422);
    assert.equal(win.__orionNetMonitor.lastApiResponse.validationMessage, 'Informe CPF ou Nome');
    assert.equal(fetchCalls.length, 1);
  });

  it('runStatefulStepPostAction aguarda pendingCount === 0 e registra validação HTTP 422 da API', async () => {
    const step = stepOf(2, 'Pesquise a parte pelo **Nome**.', ['Nome'], 'fill', 'R-TEST-NET');
    const nextStep = stepOf(3, 'Na grade **Partes encontradas**, selecione o registro.', ['Partes encontradas']);
    let reads = 0;
    const netSnapshots: OrionNetMonitorSnapshot[] = [
      { installed: true, pendingCount: 1, totalRequests: 1, lastActivityAt: Date.now(), lastApiResponse: null },
      {
        installed: true,
        pendingCount: 0,
        totalRequests: 1,
        lastActivityAt: Date.now(),
        lastApiResponse: {
          status: 422,
          url: '/api/partes',
          timestamp: Date.now() + 100,
          isEmptyArray: false,
          validationMessage: 'Filtro obrigatório ausente'
        }
      }
    ];
    const fakeClient: any = {
      ensureNetMonitor: async () => true,
      readNetMonitor: async () => netSnapshots[Math.min(reads++, netSnapshots.length - 1)],
      fill: async () => '',
      pressKey: async () => '',
      wait: async () => '',
      evalJson: async (code: string) => {
        if (code.includes('window.location.href') && !code.includes('sections')) return 'http://local/#/partes';
        if (code.includes('sections')) {
          return { url: 'http://local/#/partes', sections: [], grids: [], buttons: ['Filtrar'], inputs: ['Nome'] };
        }
        if (code.includes('data-orion-probe-input')) return '[data-orion-probe-input]';
        return null;
      }
    };

    const res = await runStatefulStepPostAction(fakeClient, step, nextStep, {
      getLastIndex: () => 1,
      rawPathFor: s => `raw-${s}.png`,
      getNextLetter: () => 'b',
      addSubFrame: async () => 'p.png'
    });
    assert.equal(res.lastApiResponse?.status, 422);
    assert.match(res.apiValidationMessage || '', /422.*Filtro obrigatório ausente/);
    assert.match(res.note || '', /Filtro obrigatório ausente/);
  });

  it('withNewTabDetection reafirma viewport 1440x900, applyZoom e ensureNetMonitor após redirects', async () => {
    const calls: string[] = [];
    let tabListCount = 0;
    const client = new AgentBrowserClient({ headless: true, sessionId: 'test-tab' });
    client.markPrimaryTab = async () => 't1';
    client.listTabs = async () => {
      tabListCount++;
      if (tabListCount === 1) return [{ id: 't1', title: 'Orion', url: 'http://local/#/inicio', active: true }];
      return [
        { id: 't1', title: 'Orion', url: 'http://local/#/inicio', active: false },
        { id: 't2', title: 'Coaf', url: 'http://local/coaf', active: true }
      ];
    };
    client.switchTab = async (id: string) => {
      calls.push(`switch:${id}`);
      return '';
    };
    client.eval = async (code: string) => {
      if (code === 'document.readyState') return '"complete"';
      if (code === 'window.location.href') return '"http://local/coaf/certificados"';
      if (code === 'document.title') return '"Coaf"';
      return 'true';
    };
    client.evalJson = async <T>(_code: string) => ({ href: 'http://local/coaf/certificados', ready: 'complete' }) as unknown as T;
    client.wait = async () => '';
    client.ensureViewport = async (w = 1440, h = 900) => {
      calls.push(`viewport:${w}x${h}`);
      return false;
    };
    client.applyZoom = async () => {
      calls.push('zoom');
    };
    client.ensureNetMonitor = async () => {
      calls.push('netmon');
      return true;
    };

    const out = await client.withNewTabDetection(async () => 'clicked', 500);
    assert.equal(out.openedTab?.tabId, 't2');
    assert.equal(calls.filter(c => c === 'viewport:1440x900').length, 2, 'viewport reaplicado antes e após redirect');
    assert.equal(calls.filter(c => c === 'zoom').length, 2, 'zoom reafirmado após redirect');
    assert.equal(calls.includes('netmon'), true, 'monitor XHR/Fetch instalado na nova guia');
  });
});

describe('ADR-030 Parte B.5 — Crawler de Grafo Vivo de Rotas e Integrações Auxiliares', () => {
  const sampleGraph: OrionRouteGraph = {
    capturedAt: '2026-11-17T12:00:00Z',
    environment: 'Produtos',
    totalMenus: 4,
    totalRoutes: 2,
    entries: [
      {
        modulo: 'Configurações',
        chain: ['Configurações', 'Parametrizações'],
        hash: '#/configuracoes',
        title: 'Parametrizações do Sistema',
        tabs: ['Geral', 'Captura e digitalização', 'Comunicação COAF'],
        sections: ['Parâmetros Gerais', 'Certificado Digital']
      },
      {
        modulo: 'Firmas',
        chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'],
        hash: '#/ficha',
        title: 'Pesquisa de Cartões',
        tabs: ['Identificação', 'Documentos'],
        sections: ['Dados Pessoais', 'Biometria']
      }
    ]
  };

  it('indexa por cadeia, hash e encontra rotas por aba/seção', () => {
    assert.equal(findRouteEntryByChain(['Configurações', 'Parametrizações'], sampleGraph)?.hash, '#/configuracoes');
    assert.equal(findRouteEntryByHash('#/ficha/123?x=1', sampleGraph)?.title, 'Pesquisa de Cartões');
    const hits = findRouteEntriesByTabOrSection('Comunicação COAF', sampleGraph);
    assert.equal(hits.length, 1);
    assert.equal(hits[0].matchedIn, 'tab');
    assert.deepEqual(hits[0].entry.chain, ['Configurações', 'Parametrizações']);
  });

  it('chooseMenuItem usa orion-route-graph.json como pista auxiliar para cauda de aba/seção quando existe na árvore viva', () => {
    setRouteGraphForTesting(sampleGraph);
    const items: MenuTreeItem[] = [
      { chain: ['Configurações'], selectors: ['[m0]'], disabled: false, hasChildren: true },
      { chain: ['Configurações', 'Parametrizações'], selectors: ['[m0]', '[m1]'], disabled: false, hasChildren: false },
      { chain: ['Firmas'], selectors: ['[m2]'], disabled: false, hasChildren: true },
      { chain: ['Firmas', 'Cadastros'], selectors: ['[m2]', '[m3]'], disabled: false, hasChildren: true },
      { chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'], selectors: ['[m2]', '[m3]', '[m4]'], disabled: false, hasChildren: false }
    ];
    const paths = extractMenuPaths(
      stepOf(1, 'Acesse **Sistema > Central > Certificado Digital**.', ['Sistema > Central > Certificado Digital'], 'navigate')
    );
    const match = chooseMenuItem(paths, items);
    assert.ok(match);
    assert.deepEqual(match!.item.chain, ['Configurações', 'Parametrizações']);
    assert.deepEqual(match!.tail, ['Certificado Digital']);
    assert.equal(match!.canonicalBasis, 'tail_as_screen_section');

    // Quando nem no grafo está, buildMenuPathMissingEvidence mantém evidência e incorpora pistas válidas
    const missingPaths = extractMenuPaths(
      stepOf(1, 'Acesse **Outro > Caminho > Biometria**.', ['Outro > Caminho > Biometria'], 'navigate')
    );
    const ev = buildMenuPathMissingEvidence(missingPaths, items);
    assert.ok(ev.leafElsewhere?.some(l => l.includes('Cartão de assinatura') && l.includes('Biometria')));
  });

  it('att-screen-advisor incorpora crossRouteHints no Raio-X [ATT] e no YAML', () => {
    setRouteGraphForTesting(sampleGraph);
    const inv: ScreenStructuralInventory = {
      route: '#/inicio',
      title: 'Início',
      inModal: false,
      sections: ['Avisos'],
      tabs: [],
      fields: [],
      buttons: []
    };
    const diag = buildAttDiagnosis({
      stepNumber: 3,
      stepText: 'Abra a aba **Captura e digitalização**.',
      targets: ['Captura e digitalização'],
      inventory: inv
    });
    assert.equal(diag.crossRouteHints?.length, 1);
    assert.equal(diag.crossRouteHints![0].menuPath, 'Configurações > Parametrizações');
    const tip = renderAttDiagnosisTip(diag);
    assert.match(tip, /Pistas em outras rotas/);
    const parsedYaml = yaml.parse(`auditoria_ui:\n${attDiagnosisYamlLines(diag).join('\n')}`);
    assert.equal(parsedYaml.auditoria_ui.diagnostico_tela_att.pistas_mapa_rotas[0].rota, '#/configuracoes');
  });

  it('crawlOrionRouteGraph percorre folhas em modo somente-leitura e grava JSON válido sem acionar mutações', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crawl-'));
    const outFile = path.join(tmp, 'orion-route-graph.json');
    const clicks: string[] = [];
    let fills = 0;

    const fakeMenu = [
      { chain: ['Configurações'], selectors: ['[m0]'], disabled: false, hasChildren: true },
      { chain: ['Configurações', 'Parametrizações'], selectors: ['[m0]', '[m1]'], disabled: false, hasChildren: false },
      { chain: ['Configurações', 'Bloqueado'], selectors: ['[m0]', '[m2]'], disabled: true, hasChildren: false }
    ];

    const fakeClient: any = {
      ensureViewport: async () => false,
      jumpHash: async () => '',
      waitForNetworkIdle: async () => ({ installed: true, pendingCount: 0, totalRequests: 1, lastActivityAt: Date.now(), lastApiResponse: null }),
      wait: async () => '',
      closeSecondaryTabs: async () => 0,
      mouseMove: async () => '',
      hover: async () => '',
      focus: async () => '',
      click: async (sel: string) => {
        clicks.push(sel);
        return '';
      },
      fill: async () => {
        fills++;
        return '';
      },
      withNewTabDetection: async (fn: () => Promise<any>) => ({ result: await fn(), openedTab: null }),
      eval: async (code: string) => {
        if (code.includes('window.__orionMenuStamps')) return JSON.stringify(fakeMenu);
        return '[]';
      },
      evalJson: async (code: string) => {
        if (code.includes('location.hash')) {
          return {
            route: '#/configuracoes',
            title: 'Parametrizações',
            inModal: false,
            sections: ['Geral'],
            tabs: [{ label: 'E-mail', active: true }],
            fields: [{ label: 'Servidor SMTP', type: 'text', section: 'Geral' }],
            buttons: [{ label: 'Salvar', primary: true }]
          };
        }
        if (code.includes('data-dismiss="modal"')) return 'none';
        if (code.includes('orion-lightweight-modal')) return 0;
        // readCascade
        return [
          { vis: true, x: 10, y: 10, w: 90, h: 30 },
          { vis: true, x: 10, y: 40, w: 140, h: 26 }
        ];
      }
    };

    try {
      const graph = await crawlOrionRouteGraph(fakeClient, { outputPath: outFile, settleMs: 1 });
      assert.equal(graph.totalMenus, 3);
      assert.equal(graph.totalRoutes, 1, 'ignora item disabled e pasta pai');
      assert.deepEqual(graph.entries[0].chain, ['Configurações', 'Parametrizações']);
      assert.deepEqual(graph.entries[0].tabs, ['E-mail']);
      assert.equal(fills, 0, 'nunca preenche formulários');
      assert.equal(clicks.includes('[m1]'), true);
      assert.equal(fs.existsSync(outFile), true);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
