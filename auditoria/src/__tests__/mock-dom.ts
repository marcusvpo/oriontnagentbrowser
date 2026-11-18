import vm from 'node:vm';

/**
 * Mini DOM sintético compartilhado pelos testes offline do script injetado no navegador
 * (`buildDOMIntrospectionScript`): Open Shadow DOM, iframes recursivos e scroll. Extraído do teste da ADR-030
 * para ser reaproveitado (ADR-035).
 */
// ---------------------------------------------------------------------------
// Mini DOM sintético com suporte a Open Shadow DOM, iframes recursivos e scroll
// ---------------------------------------------------------------------------
export interface RectSpec {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class MockElement {
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

export class MockShadowRoot {
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

export class MockDocument {
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

export function createWindowForDoc(doc: MockDocument) {
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

export function runInMockDom<T>(win: any, script: string): T {
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
