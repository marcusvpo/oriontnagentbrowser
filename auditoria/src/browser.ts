import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import type { BoundingBox, DOMActionNode, DOMResolvedGeometry, SemanticZone, StepZonePolicy } from './types.js';
import { buildDOMIntrospectionScript, parseDOMGeometryResponse, NAV_ZONE_SELECTOR } from './dom-geometry.js';
import type { StepGuardContext } from './navigation-guard.js';
import { config } from './config.js';

const execFileAsync = promisify(execFile);

/** Resposta de API capturada pelo monitor de rede XHR/Fetch (ADR-030). */
export interface OrionLastApiResponse {
  status: number;
  url: string;
  timestamp: number;
  isEmptyArray: boolean;
  validationMessage?: string;
  snippet?: string;
}

/** Estado vivo de `window.__orionNetMonitor` no navegador. */
export interface OrionNetMonitorSnapshot {
  installed: boolean;
  pendingCount: number;
  totalRequests: number;
  lastActivityAt: number;
  lastApiResponse: OrionLastApiResponse | null;
}

/**
 * Remove origem/protocolo/host/IP da URL monitorada, preservando apenas `pathname + search`
 * para cumprir a blindagem de segredos e IPs internos (ADR-023 / ADR-025).
 */
export function sanitizeMonitoredUrl(rawUrl: string | null | undefined): string {
  const txt = String(rawUrl ?? '').trim();
  if (!txt) return '';
  try {
    const parsed = new URL(txt, 'http://orion.local');
    return `${parsed.pathname}${parsed.search}`.slice(0, 180);
  } catch {
    return txt.replace(/^https?:\/\/[^/]+/i, '').slice(0, 180);
  }
}

/**
 * Interpreta o status HTTP e o corpo bruto de uma resposta XHR/Fetch para detectar
 * retorno de grade vazia (`[]` / `{ content: [] }`) ou mensagens de validação HTTP 400/422.
 */
export function parseApiResponsePayload(
  status: number,
  rawUrl: string,
  rawBody: string | null | undefined,
  timestamp = Date.now()
): OrionLastApiResponse {
  const url = sanitizeMonitoredUrl(rawUrl);
  const body = String(rawBody ?? '').trim();
  const snippet = body ? body.replace(/\s+/g, ' ').trim().slice(0, 240) : undefined;
  let isEmptyArray = false;
  let validationMessage: string | undefined;

  let parsed: any = null;
  if (body && (body.startsWith('{') || body.startsWith('['))) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = null;
    }
  }

  if (status >= 200 && status < 300 && parsed !== null) {
    if (Array.isArray(parsed)) {
      isEmptyArray = parsed.length === 0;
    } else if (typeof parsed === 'object') {
      const listField = ['content', 'items', 'data', 'registros', 'records', 'rows', 'lista'].find(k =>
        Array.isArray(parsed[k])
      );
      if (listField && parsed[listField].length === 0) {
        isEmptyArray = true;
      } else if (parsed.totalElements === 0 || parsed.total === 0) {
        isEmptyArray = true;
      }
    }
  }

  if (status >= 400) {
    if (parsed && typeof parsed === 'object') {
      const directMsg = [parsed.message, parsed.mensagem, parsed.error_description, parsed.detail, parsed.erro, parsed.error, parsed.title]
        .find(v => typeof v === 'string' && v.trim().length > 0);
      if (directMsg) {
        validationMessage = String(directMsg).replace(/\s+/g, ' ').trim().slice(0, 220);
      } else if (Array.isArray(parsed.errors) || Array.isArray(parsed.mensagens)) {
        const arr = (Array.isArray(parsed.errors) ? parsed.errors : parsed.mensagens) as any[];
        const msgs = arr
          .map(item => (typeof item === 'string' ? item : item?.message || item?.mensagem || item?.defaultMessage || ''))
          .map(s => String(s).trim())
          .filter(Boolean);
        if (msgs.length > 0) validationMessage = msgs.join('; ').slice(0, 220);
      }
    } else if (body && !/^<!doctype|^<html/i.test(body)) {
      validationMessage = body.replace(/\s+/g, ' ').trim().slice(0, 220);
    }
  }

  return {
    status,
    url,
    timestamp,
    isEmptyArray,
    ...(validationMessage ? { validationMessage } : {}),
    ...(snippet ? { snippet } : {})
  };
}

/**
 * Gera o script idempotente que instala `window.__orionNetMonitor` para interceptar
 * `XMLHttpRequest` e `fetch`, mantendo `pendingCount` e `lastApiResponse` atualizados.
 */
export function buildNetMonitorInitScript(): string {
  return `
    (() => {
      if (window.__orionNetMonitor && window.__orionNetMonitor.installed) {
        return JSON.stringify(window.__orionNetMonitor);
      }
      const mon = {
        installed: true,
        pendingCount: 0,
        totalRequests: 0,
        lastActivityAt: Date.now(),
        lastApiResponse: null
      };
      window.__orionNetMonitor = mon;

      const sanitizeUrl = raw => {
        const txt = String(raw == null ? '' : raw).trim();
        if (!txt) return '';
        try {
          const u = new URL(txt, window.location.origin || 'http://orion.local');
          return (u.pathname + u.search).slice(0, 180);
        } catch (e) {
          return txt.replace(/^https?:\\/\\/[^/]+/i, '').slice(0, 180);
        }
      };

      const isAssetUrl = url => /\\.(html?|css|js|png|jpe?g|webp|svg|woff2?|ttf|ico)(\\?|$)/i.test(url || '');

      const recordResponse = (status, rawUrl, rawBody, contentType) => {
        const url = sanitizeUrl(rawUrl);
        const body = String(rawBody == null ? '' : rawBody).trim();
        const isJsonLike = /json/i.test(contentType || '') || body.startsWith('{') || body.startsWith('[');
        if (status < 400 && isAssetUrl(url) && !isJsonLike) return;
        if (status < 400 && !isJsonLike && !/\\/api\\//i.test(url)) return;

        let parsed = null;
        if (body && (body.startsWith('{') || body.startsWith('['))) {
          try { parsed = JSON.parse(body); } catch (e) { parsed = null; }
        }
        let isEmptyArray = false;
        if (status >= 200 && status < 300 && parsed !== null) {
          if (Array.isArray(parsed)) {
            isEmptyArray = parsed.length === 0;
          } else if (typeof parsed === 'object') {
            const keys = ['content', 'items', 'data', 'registros', 'records', 'rows', 'lista'];
            const listKey = keys.find(k => Array.isArray(parsed[k]));
            if (listKey && parsed[listKey].length === 0) isEmptyArray = true;
            else if (parsed.totalElements === 0 || parsed.total === 0) isEmptyArray = true;
          }
        }
        let validationMessage;
        if (status >= 400) {
          if (parsed && typeof parsed === 'object') {
            const msg = [parsed.message, parsed.mensagem, parsed.error_description, parsed.detail, parsed.erro, parsed.error, parsed.title]
              .find(v => typeof v === 'string' && v.trim().length > 0);
            if (msg) {
              validationMessage = String(msg).replace(/\\s+/g, ' ').trim().slice(0, 220);
            } else {
              const arr = Array.isArray(parsed.errors) ? parsed.errors : (Array.isArray(parsed.mensagens) ? parsed.mensagens : null);
              if (arr) {
                const msgs = arr.map(it => typeof it === 'string' ? it : (it && (it.message || it.mensagem || it.defaultMessage) || '')).map(s => String(s).trim()).filter(Boolean);
                if (msgs.length > 0) validationMessage = msgs.join('; ').slice(0, 220);
              }
            }
          } else if (body && !/^<!doctype|^<html/i.test(body)) {
            validationMessage = body.replace(/\\s+/g, ' ').trim().slice(0, 220);
          }
        }
        const snippet = body ? body.replace(/\\s+/g, ' ').trim().slice(0, 240) : undefined;
        mon.lastApiResponse = {
          status: status,
          url: url,
          timestamp: Date.now(),
          isEmptyArray: isEmptyArray,
          ...(validationMessage ? { validationMessage } : {}),
          ...(snippet ? { snippet } : {})
        };
      };

      if (typeof window.fetch === 'function' && !window.fetch.__orionMonitored) {
        const origFetch = window.fetch.bind(window);
        const wrappedFetch = function(input, init) {
          const reqUrl = typeof input === 'string' ? input : (input && input.url) || '';
          mon.pendingCount++;
          mon.totalRequests++;
          mon.lastActivityAt = Date.now();
          return origFetch(input, init).then(
            res => {
              let cloned = null;
              let ct = '';
              try {
                ct = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
                if (res.status >= 400 || /json|text|problem/i.test(ct) || !ct) {
                  cloned = res.clone();
                }
              } catch (e) {}
              if (cloned) {
                cloned.text()
                  .then(body => { recordResponse(res.status, reqUrl, String(body || '').slice(0, 8192), ct); })
                  .catch(() => {})
                  .finally(() => {
                    mon.pendingCount = Math.max(0, mon.pendingCount - 1);
                    mon.lastActivityAt = Date.now();
                  });
              } else {
                mon.pendingCount = Math.max(0, mon.pendingCount - 1);
                mon.lastActivityAt = Date.now();
              }
              return res;
            },
            err => {
              mon.pendingCount = Math.max(0, mon.pendingCount - 1);
              mon.lastActivityAt = Date.now();
              throw err;
            }
          );
        };
        wrappedFetch.__orionMonitored = true;
        window.fetch = wrappedFetch;
      }

      if (typeof window.XMLHttpRequest === 'function' && window.XMLHttpRequest.prototype && !window.XMLHttpRequest.prototype.__orionMonitored) {
        const origOpen = window.XMLHttpRequest.prototype.open;
        const origSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function(method, url) {
          this.__orionUrl = String(url || '');
          return origOpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function() {
          const xhr = this;
          let settled = false;
          mon.pendingCount++;
          mon.totalRequests++;
          mon.lastActivityAt = Date.now();
          const finalize = () => {
            if (settled) return;
            settled = true;
            try {
              if (xhr.status > 0) {
                const ct = (xhr.getResponseHeader && xhr.getResponseHeader('content-type')) || '';
                let body = '';
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                  body = String(xhr.responseText || '').slice(0, 8192);
                } else if (xhr.responseType === 'json' && xhr.response != null) {
                  body = JSON.stringify(xhr.response).slice(0, 8192);
                }
                recordResponse(xhr.status, xhr.__orionUrl || '', body, ct);
              }
            } catch (e) {}
            mon.pendingCount = Math.max(0, mon.pendingCount - 1);
            mon.lastActivityAt = Date.now();
          };
          if (xhr.addEventListener) {
            xhr.addEventListener('loadend', finalize, { once: true });
          }
          try {
            return origSend.apply(this, arguments);
          } catch (err) {
            finalize();
            throw err;
          }
        };
        window.XMLHttpRequest.prototype.__orionMonitored = true;
      }
      return JSON.stringify(mon);
    })()
  `;
}

/**
 * Gera o script de conferência de nó carimbado (`probeActionNode`) atravessando
 * Open Shadow DOM e iframes same-origin recursivamente até profundidade 6 (ADR-030).
 */
export function buildProbeActionNodeScript(
  stampSelector: string,
  navZoneSelector = NAV_ZONE_SELECTOR,
  fallbackZoom = 0.8
): string {
  return `
    (() => {
      const MAX_DEPTH = 6;
      const NAV_SEL = ${JSON.stringify(navZoneSelector)};
      const FALLBACK_ZOOM = ${JSON.stringify(fallbackZoom)};

      const composedParent = node => {
        if (!node) return null;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode ? node.getRootNode() : null;
        return root && root.host ? root.host : null;
      };

      const composedClosest = (node, selector) => {
        let cur = node;
        while (cur) {
          if (cur.nodeType === 1 && cur.matches && cur.matches(selector)) return cur;
          cur = composedParent(cur);
        }
        return null;
      };

      const queryAllDeep = (root, selector, depth) => {
        const d = depth || 0;
        const out = [];
        const seen = new Set();
        if (!root || d > MAX_DEPTH) return out;
        const add = el => {
          if (el && !seen.has(el)) {
            seen.add(el);
            out.push(el);
          }
        };
        if (root.querySelectorAll) {
          try {
            const direct = root.querySelectorAll(selector);
            for (let i = 0; i < direct.length; i++) add(direct[i]);
          } catch (e) {}
        }
        if (d === 0 && root.shadowRoot) {
          const own = queryAllDeep(root.shadowRoot, selector, d + 1);
          for (let j = 0; j < own.length; j++) add(own[j]);
        }
        if (d < MAX_DEPTH && root.querySelectorAll) {
          try {
            const all = root.querySelectorAll('*');
            for (let i = 0; i < all.length; i++) {
              const host = all[i];
              if (host && host.shadowRoot) {
                const inner = queryAllDeep(host.shadowRoot, selector, d + 1);
                for (let j = 0; j < inner.length; j++) add(inner[j]);
              }
            }
          } catch (e) {}
        }
        return out;
      };

      const findDeepBySelector = (doc, selector, frameChain, depth) => {
        const hits = [];
        if (!doc || depth > MAX_DEPTH) return hits;
        const direct = queryAllDeep(doc, selector, 0);
        for (let i = 0; i < direct.length; i++) {
          hits.push({ el: direct[i], doc: doc, frameChain: frameChain });
        }
        if (depth < MAX_DEPTH) {
          const iframes = queryAllDeep(doc, 'iframe', 0);
          for (let i = 0; i < iframes.length; i++) {
            const frame = iframes[i];
            try {
              const childDoc = frame.contentDocument;
              if (!childDoc || !childDoc.body) continue;
              const nested = findDeepBySelector(childDoc, selector, frameChain.concat([frame]), depth + 1);
              for (let j = 0; j < nested.length; j++) hits.push(nested[j]);
            } catch (e) {}
          }
        }
        return hits;
      };

      const readEffectiveDocZoom = doc => {
        try {
          const win = doc && doc.defaultView;
          const de = doc && doc.documentElement;
          if (!de) return 1;
          const cs = win && win.getComputedStyle ? win.getComputedStyle(de) : null;
          const z = parseFloat((cs && cs.zoom) || (de.style && de.style.zoom) || '1');
          return Number.isFinite(z) && z > 0 ? z : 1;
        } catch (e) {
          return 1;
        }
      };

      const computeChainOffset = frameChain => {
        let x = 0;
        let y = 0;
        let scale = 1;
        const chain = frameChain || [];
        for (let i = 0; i < chain.length; i++) {
          const frame = chain[i];
          const hostDoc = frame.ownerDocument || document;
          const hostWin = hostDoc.defaultView || window;
          const fr = frame.getBoundingClientRect();
          const cs = hostWin && hostWin.getComputedStyle ? hostWin.getComputedStyle(frame) : null;
          let hostScale = 1;
          if (frame.offsetWidth > 0 && fr.width > 0) {
            hostScale = fr.width / frame.offsetWidth;
          } else {
            hostScale = readEffectiveDocZoom(hostDoc);
            if (hostScale === 1 && i === 0 && Number.isFinite(FALLBACK_ZOOM) && FALLBACK_ZOOM > 0) {
              hostScale = FALLBACK_ZOOM;
            }
          }
          const stepScale = scale * hostScale;
          const borderL = frame.clientLeft || (cs ? parseFloat(cs.borderLeftWidth) || 0 : 0);
          const borderT = frame.clientTop || (cs ? parseFloat(cs.borderTopWidth) || 0 : 0);
          const padL = cs ? parseFloat(cs.paddingLeft) || 0 : 0;
          const padT = cs ? parseFloat(cs.paddingTop) || 0 : 0;
          x = x + fr.left * scale + (borderL + padL) * stepScale;
          y = y + fr.top * scale + (borderT + padT) * stepScale;
          scale = stepScale;
        }
        return { x, y, scale };
      };

      const found = findDeepBySelector(document, ${JSON.stringify(stampSelector)}, [], 0);
      if (found.length !== 1) return null;
      const hit = found[0];
      const el = hit.el;
      const doc = hit.doc || el.ownerDocument || document;
      const win = doc.defaultView || window;
      const r = el.getBoundingClientRect();
      const style = win.getComputedStyle(el);
      if (r.width <= 1 || r.height <= 1 || style.display === 'none' || style.visibility === 'hidden' || composedClosest(el, '.ng-hide')) return null;

      const frameOffset = computeChainOffset(hit.frameChain);
      const s = frameOffset.scale || 1;
      const x1 = Math.round(r.left * s + frameOffset.x);
      const y1 = Math.round(r.top * s + frameOffset.y);
      const x2 = Math.round(r.right * s + frameOffset.x);
      const y2 = Math.round(r.bottom * s + frameOffset.y);

      const ngDis = el.getAttribute && el.getAttribute('ng-disabled');
      const isDisabled =
        !!el.disabled ||
        el.getAttribute('aria-disabled') === 'true' ||
        !!composedClosest(el, 'fieldset[disabled]') ||
        (!!ngDis && /^(true|1)$/i.test(String(ngDis).trim()));

      return JSON.stringify({
        tagName: el.tagName.toLowerCase(),
        text: (el.innerText || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || '').trim().slice(0, 80),
        box: { x: x1, y: y1, width: x2 - x1, height: y2 - y1 },
        insideNavZone: !!composedClosest(el, NAV_SEL),
        disabled: isDisabled,
        hint: (el.getAttribute('title') || el.getAttribute('aria-label') || el.getAttribute('value') || '').trim().slice(0, 80),
        opensNewTab: (() => {
          const a = composedClosest(el, 'a');
          const js = [el.getAttribute('onclick'), el.getAttribute('ng-click'), a && a.getAttribute('onclick'), a && a.getAttribute('ng-click')].join(' ');
          if (a && String(a.getAttribute('target') || '').toLowerCase() === '_blank') return true;
          if (/window\\.open|\\$window\\.open/.test(js)) return true;
          const href = a ? String(a.getAttribute('href') || '') : '';
          const txt = String((a || el).innerText || '').toLowerCase();
          return !!a && (href === '' || href === '#') && /clique aqui|acesse|acessar|tela de configura/.test(txt);
        })()
      });
    })()
  `;
}

/** Guia do navegador, como o `agent-browser tab list --json` a descreve (ADR-025). */
export interface BrowserTab {
  /** `t1`, `t2`... (ou o targetId CDP quando o daemon não devolve o id curto) */
  id: string;
  targetId?: string;
  title: string;
  url: string;
  active: boolean;
}

/** Guia aberta por uma ação do passo (link `_blank`, `window.open`). */
export interface OpenedTab {
  tabId: string;
  url: string;
  title: string;
}

/**
 * Converte a saída de `tab list --json`. O formato exato não é documentado: aceita `[...]`, `{ tabs: [...] }`
 * e `{ data: { tabs: [...] } }`, com `tabId`/`id`/`label`/`targetId` como identificador. Entrada ilegível = [].
 */
export function parseTabList(output: string): BrowserTab[] {
  const text = String(output || '').trim();
  if (!text) return [];
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/[\[{][\s\S]*[\]}]/);
    if (!m) return [];
    try {
      parsed = JSON.parse(m[0]);
    } catch {
      return [];
    }
  }
  const list: any[] = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.tabs) ? parsed.tabs : Array.isArray(parsed?.data?.tabs) ? parsed.data.tabs : Array.isArray(parsed?.data) ? parsed.data : [];
  return list
    .map((t: any, i: number): BrowserTab | null => {
      if (!t || typeof t !== 'object') return null;
      const id = String(t.tabId ?? t.id ?? t.label ?? t.targetId ?? '').trim();
      if (!id) return null;
      return {
        id: /^\d+$/.test(id) ? `t${id}` : id,
        targetId: t.targetId ? String(t.targetId) : undefined,
        title: String(t.title ?? ''),
        url: String(t.url ?? ''),
        active: t.active === true || t.current === true || t.isActive === true || (t.active === undefined && i === 0 && list.length === 1)
      };
    })
    .filter((t): t is BrowserTab => t !== null);
}

export interface DOMGeometryRequestOptions {
  scrollIntoView?: boolean;
  /** Política de Zona Semântica do passo (ADR-015). Default: `any` (busca irrestrita). */
  zone?: StepZonePolicy;
  /** Alvos a unir num único Group Bounding Box (ADR-015). */
  groupTargets?: string[];
  /** Membro do grupo que recebe o carimbo de clique (ADR-017). */
  actionMember?: 'first-clickable' | 'last';
  /** ADR-035: sobrescreve o contexto de guarda do passo vigente (`setStepGuard`). */
  fieldIntent?: boolean;
  allowGlobalSearch?: boolean;
  allowOptionTier?: boolean;
}

export interface AccessibilityNode {
  ref: string;
  role: string;
  name: string;
  value?: string;
  disabled?: boolean;
}

export interface AgentBrowserOptions {
  headless?: boolean;
  sessionId?: string;
  statePath?: string;
  deviceScaleFactor?: number;
  zoom?: number;
}

export class AgentBrowserClient {
  private headless: boolean;
  private sessionId?: string;
  private statePath?: string;
  private deviceScaleFactor: number;
  private browserZoom: number;
  /**
   * ADR-035: contexto de guarda do passo em localização (campo de entrada, busca global, valor de lista). O
   * `locateAndCaptureWithSelfHealing` o define no início do passo e o limpa no `finally`; toda medição textual
   * feita por ele (Camadas 1, 2A, 2B, 2C, curas e pré-filtros) herda o mesmo critério sem mudar cada chamada.
   */
  private stepGuard: StepGuardContext | null = null;

  setStepGuard(guard: StepGuardContext | null): void {
    this.stepGuard = guard;
  }

  getStepGuard(): StepGuardContext | null {
    return this.stepGuard;
  }

  constructor(options: boolean | AgentBrowserOptions = false) {
    if (typeof options === 'boolean') {
      this.headless = options;
      this.deviceScaleFactor = 1;
      this.sessionId = 'auditoria-session';
      this.browserZoom = config.browserZoom;
    } else {
      this.headless = options.headless ?? false;
      this.sessionId = options.sessionId || 'auditoria-session';
      this.statePath = options.statePath;
      this.deviceScaleFactor = options.deviceScaleFactor ?? 1;
      this.browserZoom = options.zoom ?? config.browserZoom;
    }
  }

  private async run(args: string[], stdinInput?: string): Promise<string> {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const fullArgs = ['agent-browser'];
    if (!this.headless) {
      fullArgs.push('--headed');
    }
    if (this.sessionId) {
      fullArgs.push('--session', this.sessionId);
    }
    if (this.statePath && fs.existsSync(this.statePath)) {
      fullArgs.push('--state', this.statePath);
    }
    fullArgs.push(...args);

    if (stdinInput !== undefined) {
      return new Promise<string>((resolve, reject) => {
        const child = spawn(cmd, fullArgs, {
          shell: process.platform === 'win32',
          env: { ...process.env, NODE_ENV: 'test' },
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
          child.kill();
          reject(new Error(`agent-browser timeout (${args.join(' ')})`));
        }, 30000);

        child.stdout.on('data', (chunk: Buffer) => {
          stdout += chunk.toString('utf8');
        });
        child.stderr.on('data', (chunk: Buffer) => {
          stderr += chunk.toString('utf8');
        });
        child.on('error', err => {
          clearTimeout(timer);
          reject(new Error(`agent-browser error (${args.join(' ')}): ${err.message}`));
        });
        child.on('close', code => {
          clearTimeout(timer);
          if (code === 0) {
            resolve(stdout.trim());
          } else {
            const msg = stderr.trim() || stdout.trim() || `exit code ${code}`;
            reject(new Error(`agent-browser error (${args.join(' ')}): ${msg}`));
          }
        });

        child.stdin.write(stdinInput, 'utf8');
        child.stdin.end();
      });
    }

    try {
      const { stdout } = await execFileAsync(cmd, fullArgs, {
        timeout: 30000,
        shell: process.platform === 'win32',
        env: { ...process.env, NODE_ENV: 'test' }
      });
      return stdout.trim();
    } catch (err: any) {
      const msg = err.stderr || err.stdout || err.message;
      throw new Error(`agent-browser error (${args.join(' ')}): ${msg}`);
    }
  }

  /**
   * Aplica o zoom CSS configurado (padrão 0.8 = 80%) mantendo o viewport físico 1440x900 @ DPR 1.0,
   * e aproveita a mesma ida ao navegador para garantir `window.__orionNetMonitor` instalado (zero roundtrip extra).
   */
  async applyZoom(zoom = this.browserZoom): Promise<void> {
    const safeZoom = Number.isFinite(zoom) && zoom > 0 ? zoom : 0.8;
    const shouldApplyZoom = Math.abs(safeZoom - 1) >= 0.001;
    try {
      await this.eval(`
        (() => {
          if (${JSON.stringify(shouldApplyZoom)}) {
            const z = ${JSON.stringify(String(safeZoom))};
            if (document.documentElement && document.documentElement.style.zoom !== z) {
              document.documentElement.style.zoom = z;
            }
            if (document.head && !document.getElementById('orion-audit-zoom')) {
              const st = document.createElement('style');
              st.id = 'orion-audit-zoom';
              st.textContent = 'html { zoom: ' + z + ' !important; }';
              document.head.appendChild(st);
            }
          }
          ${buildNetMonitorInitScript()};
          return true;
        })()
      `);
    } catch {
      // Página transitória (ex.: about:blank ou ainda inicializando)
    }
  }

  /** Garante a instalação idempotente do monitor XHR/Fetch (`window.__orionNetMonitor`). */
  async ensureNetMonitor(): Promise<boolean> {
    try {
      const snap = await this.evalJson<OrionNetMonitorSnapshot>(buildNetMonitorInitScript());
      return Boolean(snap?.installed);
    } catch {
      return false;
    }
  }

  /** Lê o snapshot atual do monitor XHR/Fetch (`pendingCount`, `lastApiResponse`). */
  async readNetMonitor(): Promise<OrionNetMonitorSnapshot | null> {
    return this.evalJson<OrionNetMonitorSnapshot>(`
      (() => {
        if (!window.__orionNetMonitor) return JSON.stringify(null);
        return JSON.stringify(window.__orionNetMonitor);
      })()
    `);
  }

  /**
   * Aguarda a rede XHR/Fetch estabilizar (`pendingCount === 0`) sem esperas cegas fixas.
   * Se o monitor ainda não estiver instalado na aba atual, instala-o antes de consultar.
   */
  async waitForNetworkIdle(
    options: { timeoutMs?: number; idleMs?: number; pollMs?: number } = {}
  ): Promise<OrionNetMonitorSnapshot | null> {
    const timeoutMs = options.timeoutMs ?? 5000;
    const idleMs = options.idleMs ?? 200;
    const pollMs = options.pollMs ?? 150;
    const deadline = Date.now() + timeoutMs;
    let snap = await this.readNetMonitor();
    if (!snap) {
      await this.ensureNetMonitor();
      snap = await this.readNetMonitor();
    }
    while (Date.now() < deadline) {
      if (!snap) return null;
      if (snap.pendingCount === 0 && Date.now() - snap.lastActivityAt >= idleMs) {
        return snap;
      }
      await new Promise(r => setTimeout(r, pollMs));
      snap = await this.readNetMonitor();
    }
    return snap;
  }

  async open(url: string): Promise<string> {
    const out = await this.run(['open', url]);
    if (url !== 'about:blank') {
      await this.applyZoom();
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Multi-aba / sub-portais (ADR-025). O agent-browser não tem "wait for popup": a nova guia é detectada
  // pelo diff de `tab list --json` antes/depois da ação. Ids são `t1`, `t2`... (`tab 2` é rejeitado).
  // ---------------------------------------------------------------------------

  /** Guia principal da auditoria (a que o worker abriu); `closeSecondaryTabs` preserva esta. */
  private primaryTabId?: string;

  /** Lista as guias abertas do daemon. Nunca lança: sem resposta, devolve lista vazia. */
  async listTabs(): Promise<BrowserTab[]> {
    try {
      const out = await this.run(['tab', 'list', '--json']);
      return parseTabList(out);
    } catch {
      return [];
    }
  }

  /** Muda o foco para uma guia (`t2`, rótulo ou targetId). */
  async switchTab(id: string): Promise<string> {
    return this.run(['tab', id]);
  }

  /** Fecha uma guia específica (ou a atual, sem id). */
  async closeTab(id?: string): Promise<string> {
    return this.run(id ? ['tab', 'close', id] : ['tab', 'close']);
  }

  /** Registra como principal a guia ativa neste momento (idempotente: só o primeiro registro vale). */
  async markPrimaryTab(): Promise<string | undefined> {
    if (this.primaryTabId) return this.primaryTabId;
    const tabs = await this.listTabs();
    const active = tabs.find(t => t.active) ?? tabs[0];
    if (active) this.primaryTabId = active.id;
    return this.primaryTabId;
  }

  /** Redefine a guia principal (login que troca o portal pela guia do módulo). */
  setPrimaryTab(id: string | undefined): void {
    this.primaryTabId = id;
  }

  getPrimaryTab(): string | undefined {
    return this.primaryTabId;
  }

  /**
   * Fecha todas as guias secundárias e devolve o foco à principal (`resetToHome`, ADR-025). Se a principal
   * não foi registrada ou sumiu, preserva a primeira guia da lista. Retorna quantas guias foram fechadas.
   */
  async closeSecondaryTabs(): Promise<number> {
    const tabs = await this.listTabs();
    if (tabs.length <= 1) {
      // Única guia: é a principal (registra se ainda não foi registrada) e precisa estar em foco
      if (tabs[0]) {
        if (!this.primaryTabId) this.primaryTabId = tabs[0].id;
        if (!tabs[0].active) await this.switchTab(tabs[0].id).catch(() => undefined);
      }
      return 0;
    }
    const keep = tabs.find(t => t.id === this.primaryTabId) ?? tabs[0];
    this.primaryTabId = keep.id;
    let closed = 0;
    for (const t of tabs) {
      if (t.id === keep.id) continue;
      try {
        await this.closeTab(t.id);
        closed++;
      } catch {
        // guia já fechada pelo próprio sistema
      }
    }
    const remaining = await this.listTabs();
    const current = remaining.find(t => t.active);
    if (!current || current.id !== keep.id) await this.switchTab(keep.id).catch(() => undefined);
    return closed;
  }

  /**
   * Executa uma ação e, se ela abrir uma nova guia (`target="_blank"`, `window.open`), muda o foco para
   * ela, espera o carregamento e reaplica o viewport 1440x900 (a emulação não é herdada, ADR-009/ADR-025).
   * Devolve `{ result, openedTab }`; `openedTab` é `null` quando nenhuma guia nova apareceu.
   */
  async withNewTabDetection<T>(action: () => Promise<T>, settleMs = 3000): Promise<{ result: T; openedTab: OpenedTab | null }> {
    await this.markPrimaryTab();
    const before = new Set((await this.listTabs()).map(t => t.id));
    const result = await action();
    const deadline = Date.now() + settleMs;
    let fresh: BrowserTab | undefined;
    do {
      const after = await this.listTabs();
      fresh = after.filter(t => !before.has(t.id)).pop();
      if (fresh) break;
      await new Promise(r => setTimeout(r, 400));
    } while (Date.now() < deadline);
    if (!fresh) return { result, openedTab: null };

    await this.switchTab(fresh.id);
    for (let i = 0; i < 10; i++) {
      try {
        const state = String(await this.eval('document.readyState')).replace(/"/g, '');
        if (state === 'complete') break;
      } catch {
        // a guia ainda está inicializando
      }
      await this.wait(500);
    }
    await this.ensureViewport(1440, 900);
    await this.applyZoom();

    // ADR-030: sub-portais [CCC] podem executar redirects pós-load; aguarda estabilização e
    // reafirma viewport 1440x900, zoom e monitor XHR/Fetch sobre a guia final.
    let prevHref = '';
    for (let i = 0; i < 5; i++) {
      try {
        const probe = await this.evalJson<{ href: string; ready: string }>(
          'JSON.stringify({ href: window.location.href || "", ready: document.readyState || "" })'
        );
        if (probe && probe.ready === 'complete' && probe.href && probe.href === prevHref) break;
        prevHref = probe?.href || prevHref;
      } catch {
        // redirect em andamento
      }
      await this.wait(300);
    }
    await this.ensureViewport(1440, 900);
    await this.applyZoom();
    await this.ensureNetMonitor();

    let url = fresh.url;
    let title = fresh.title;
    try {
      url = String(await this.eval('window.location.href')).replace(/^"|"$/g, '') || url;
      title = String(await this.eval('document.title')).replace(/^"|"$/g, '') || title;
    } catch {
      // mantém o que `tab list` informou
    }
    return { result, openedTab: { tabId: fresh.id, url, title } };
  }

  /**
   * Descarta um diálogo nativo pendente (alert/confirm/beforeunload) que travaria o worker.
   * O agent-browser já os dispensa por padrão; isto cobre o caso de um diálogo ter sobrado aberto.
   * Aceitar é o correto para `beforeunload` ("sair da página"). Nunca lança: sem diálogo, é no-op.
   */
  async dismissPendingDialog(): Promise<boolean> {
    try {
      const status = await this.run(['dialog', 'status']);
      if (!/open|aberto|true|yes/i.test(status) || /no dialog|closed|false/i.test(status)) return false;
      await this.run(['dialog', 'accept']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Trava de Viewport (ADR-009, regra 6): confere 1440x900 @ DPR 1.0 na aba ATIVA e reaplica se divergir.
   * Um passo que abre uma nova aba/janela (impressão, link `_blank`) deixa essa aba sem a emulação, e o
   * navegador volta ao tamanho da janela (1803x915 na máquina de auditoria). Sem este guard o worker
   * continua assim para todas as rotinas seguintes. Deve rodar ANTES de medir o passo: mudar o viewport
   * entre a medição e a captura desalinharia as molduras. Retorna `true` se precisou corrigir.
   */
  async ensureViewport(width = 1440, height = 900): Promise<boolean> {
    const probe =
      '[window.innerWidth, window.innerHeight, window.devicePixelRatio].join("x") + "|" + ' +
      '((document.getAnimations ? document.getAnimations().filter(a => a.playState === "running" && a.effect && a.effect.getComputedTiming().iterations !== Infinity).length : 0)' +
      ' + Array.from(document.querySelectorAll(".modal.fade:not(.in):not(.show)")).filter(m => getComputedStyle(m).display !== "none").length)';
    let corrected = false;
    let animating = 0;
    try {
      const raw = String(await this.eval(probe)).replace(/"/g, '');
      const [dims, anim] = raw.split('|');
      const [w, h, dpr] = dims.split('x').map(Number);
      animating = Number(anim) || 0;
      // O Chromium reporta o DPR com ruído de ponto flutuante (1.0000000149): comparar com tolerância
      if (!(w === width && h === height && Math.abs(dpr - 1) < 0.01)) {
        console.warn(`   [Viewport] ${dims} fora da trava ${width}x${height}@1; reaplicando...`);
        await this.setViewport(width, height);
        await this.wait(400);
        corrected = true;
      }
    } catch {
      // aba sem resposta: reaplica o viewport de forma visível
      await this.setViewport(width, height);
      await this.wait(400);
      return true;
    }
    // Estabilidade de layout: medir um modal Bootstrap (`.fade`) durante a animação de entrada grava a
    // geometria ~110 px acima da posição final, e a moldura sai sobre uma região vazia (V-CCA.3.3).
    for (let i = 0; i < 6 && animating > 0; i++) {
      await this.wait(500);
      try {
        const raw = String(await this.eval(probe)).replace(/"/g, '');
        animating = Number(raw.split('|')[1]) || 0;
      } catch {
        break;
      }
    }
    await this.applyZoom();
    return corrected;
  }

  /** Pressiona uma tecla no documento (ex.: `Escape` para fechar um modal). */
  async pressKey(key: string): Promise<string> {
    return this.run(['press', key]);
  }

  async wait(target: string | number): Promise<string> {
    return this.run(['wait', String(target)]);
  }

  async eval(code: string): Promise<string> {
    return this.run(['eval', '--stdin'], code);
  }

  async setViewport(width = 1440, height = 900): Promise<string> {
    const out = await this.run(['set', 'viewport', String(width), String(height)]);
    await this.applyZoom();
    return out;
  }

  async jumpHash(hashRoute: string): Promise<string> {
    const cleanHash = hashRoute.startsWith('#') ? hashRoute : `#${hashRoute}`;
    const out = await this.eval(`window.location.hash = '${cleanHash}'`);
    await this.applyZoom();
    return out;
  }

  async snapshotInteractive(): Promise<string> {
    return this.run(['snapshot', '-i']);
  }

  async getBox(refOrSelector: string): Promise<BoundingBox> {
    const normalized = /^e\d+$/.test(refOrSelector) ? `@${refOrSelector}` : refOrSelector;
    const output = await this.run(['get', 'box', normalized, '--json']);
    try {
      const parsed = JSON.parse(output);
      const b = parsed.data?.box || parsed.data || parsed;
      return {
        x: Math.round(b.x ?? 0),
        y: Math.round(b.y ?? 0),
        width: Math.round(b.width ?? b.w ?? 0),
        height: Math.round(b.height ?? b.h ?? 0)
      };
    } catch {
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const b = parsed.data?.box || parsed.data || parsed;
        return {
          x: Math.round(b.x ?? 0),
          y: Math.round(b.y ?? 0),
          width: Math.round(b.width ?? b.w ?? 0),
          height: Math.round(b.height ?? b.h ?? 0)
        };
      }
      throw new Error(`Falha ao converter bounding box para JSON: ${output}`);
    }
  }

  /**
   * Fonte Única de Verdade (DOM Real):
   * Localiza o elemento no DOM (incluindo iframes), garante visibilidade (scrollIntoViewIfNeeded),
   * estabiliza reflow e retorna a geometria completa (`cssBox`, `viewport` com DPR/scroll, e `context`).
   */
  async getDOMGeometry(
    targets: string | string[],
    options: DOMGeometryRequestOptions = {}
  ): Promise<DOMResolvedGeometry | null> {
    const zonePolicy: StepZonePolicy = options.zone ?? 'any';
    const scrollIntoView = options.scrollIntoView;

    const measure = async (zone: SemanticZone, groupTargets?: string[]) => {
      const script = buildDOMIntrospectionScript(targets, {
        scrollIntoView,
        zone,
        groupTargets,
        actionMember: options.actionMember,
        zoom: this.browserZoom,
        fieldIntent: options.fieldIntent ?? this.stepGuard?.fieldIntent,
        allowGlobalSearch: options.allowGlobalSearch ?? this.stepGuard?.allowGlobalSearch,
        allowOptionTier: options.allowOptionTier ?? this.stepGuard?.allowOptionTier
      });
      const geometry = parseDOMGeometryResponse(await this.eval(script));
      if (geometry) geometry.zonePolicy = zonePolicy;
      return geometry;
    };

    if (zonePolicy === 'any') {
      return measure('any', options.groupTargets);
    }

    // Filtro de Zona Semântica (ADR-015): a busca começa restrita ao contêiner de conteúdo.
    const inContent = await measure('content', options.groupTargets);
    if (inContent || zonePolicy === 'content') {
      return inContent;
    }

    // `content-preferred` (verbo ambíguo): só então libera a busca irrestrita, sem união de grupo,
    // para nunca fundir um item de navegação com campos do formulário.
    return measure('any');
  }

  /**
   * Protocolo Atômico de Medição + Captura:
   * 1. Rola o elemento para a área visível e extrai a geometria estabilizada do DOM.
   * 2. Captura o screenshot imediatamente no mesmo frame de scroll/viewport.
   */
  async captureStepWithDOMGeometry(
    targets: string | string[],
    rawScreenshotPath: string,
    options: DOMGeometryRequestOptions = {}
  ): Promise<DOMResolvedGeometry | null> {
    const geometry = await this.getDOMGeometry(targets, options);
    await this.screenshot(rawScreenshotPath);
    return geometry;
  }

  /**
   * Compatibilidade com Fast DOM Introspection retornando apenas a BoundingBox estabilizada.
   */
  async getElementBoxFast(selectorOrText: string): Promise<BoundingBox | null> {
    const geometry = await this.getDOMGeometry(selectorOrText, { scrollIntoView: true });
    return geometry ? geometry.cssBox : null;
  }

  /**
   * Confere, imediatamente antes da ação, o nó carimbado na medição (ADR-015 §2.4 + ADR-030 Deep DOM):
   * percorre Open Shadow DOM e iframes same-origin recursivamente até profundidade 6, somando
   * o offset acumulado da cadeia de iframes (`frameOffset`) à caixa retornada.
   */
  async probeActionNode(stampSelector: string): Promise<DOMActionNode | null> {
    const raw = await this.eval(buildProbeActionNodeScript(stampSelector, NAV_ZONE_SELECTOR, this.browserZoom));
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    try {
      const first = JSON.parse(raw);
      return (typeof first === 'string' ? JSON.parse(first) : first) as DOMActionNode;
    } catch {
      return null;
    }
  }

  /**
   * Verificação de tela carregada para passos sem alvo (ADR-016): documento completo, sessão ativa
   * (fora do login), conteúdo visível e nenhum alerta de erro na tela. Não mede nem demarca nada.
   */
  async probeScreenLoaded(): Promise<{ ok: boolean; reason?: string; hash: string }> {
    const raw = await this.eval(`
      (() => {
        const vis = e => {
          const r = e.getBoundingClientRect();
          const s = window.getComputedStyle(e);
          return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
        };
        const hash = window.location.hash || '';
        const fail = reason => JSON.stringify({ ok: false, reason, hash });
        if (document.readyState !== 'complete') return fail('Documento ainda em carregamento (' + document.readyState + ')');
        if (hash.indexOf('/login') !== -1 || window.location.href.indexOf('webPortal') !== -1) return fail('Sessão fora do Orion TN (tela de login/portal)');
        const main = document.querySelector('#content, main, [role="main"], .main-content') || document.body;
        if (!vis(main) || (main.innerText || '').trim().length === 0) return fail('Área de conteúdo vazia');
        const errors = Array.from(document.querySelectorAll('.alert-danger, .alert-error, .toast-error')).filter(vis);
        if (errors.length > 0) return fail('Alerta de erro na tela: ' + (errors[0].innerText || '').trim().slice(0, 80));
        return JSON.stringify({ ok: true, hash });
      })()
    `);
    try {
      const first = JSON.parse(raw);
      return typeof first === 'string' ? JSON.parse(first) : first;
    } catch {
      return { ok: false, reason: 'Resposta inválida da verificação de tela', hash: '' };
    }
  }

  async hover(refOrSelector: string): Promise<string> {
    return this.run(['hover', refOrSelector]);
  }

  /**
   * Move o ponteiro real do navegador para uma coordenada do viewport (ADR-017). Usado para percorrer
   * submenus em cascata por dentro da sua geometria segura, sem disparar `mouseleave`.
   */
  async mouseMove(x: number, y: number): Promise<string> {
    return this.run(['mouse', 'move', String(Math.round(x)), String(Math.round(y))]);
  }

  async focus(refOrSelector: string): Promise<string> {
    return this.run(['focus', refOrSelector]);
  }

  /** Avalia um script que devolve JSON (direto ou serializado) e o converte; `null` em qualquer falha. */
  async evalJson<T>(code: string): Promise<T | null> {
    try {
      const raw = await this.eval(code);
      if (!raw || raw === 'null' || raw === 'undefined') return null;
      const first = JSON.parse(raw);
      return (typeof first === 'string' ? JSON.parse(first) : first) as T;
    } catch {
      return null;
    }
  }

  async screenshot(outputPath: string): Promise<string> {
    await this.run(['screenshot', outputPath]);
    return outputPath;
  }

  async click(refOrSelector: string): Promise<string> {
    try {
      return await this.run(['click', refOrSelector]);
    } catch (err) {
      if (!refOrSelector.startsWith('[data-orion-')) throw err;
      const clicked = await this.evalJson<boolean>(`
        (() => {
          const sel = ${JSON.stringify(refOrSelector)};
          const queryDeep = (root, d) => {
            if (!root || d > 6) return null;
            if (root.querySelector) {
              const direct = root.querySelector(sel);
              if (direct) return direct;
            }
            if (d === 0 && root.shadowRoot) {
              const own = queryDeep(root.shadowRoot, d + 1);
              if (own) return own;
            }
            const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
            for (let i = 0; i < all.length; i++) {
              const h = all[i];
              if (h.shadowRoot) {
                const sHit = queryDeep(h.shadowRoot, d + 1);
                if (sHit) return sHit;
              }
              if (h.tagName === 'IFRAME') {
                try {
                  if (h.contentDocument) {
                    const fHit = queryDeep(h.contentDocument, d + 1);
                    if (fHit) return fHit;
                  }
                } catch (e) {}
              }
            }
            return null;
          };
          const el = queryDeep(document, 0);
          if (!el) return JSON.stringify(false);
          el.click();
          return JSON.stringify(true);
        })()
      `);
      if (clicked) return 'clicked-deep-dom';
      throw err;
    }
  }

  async fill(refOrSelector: string, text: string): Promise<string> {
    try {
      return await this.run(['fill', refOrSelector, text]);
    } catch (err) {
      if (!refOrSelector.startsWith('[data-orion-')) throw err;
      const filled = await this.evalJson<boolean>(`
        (() => {
          const sel = ${JSON.stringify(refOrSelector)};
          const val = ${JSON.stringify(text)};
          const queryDeep = (root, d) => {
            if (!root || d > 6) return null;
            if (root.querySelector) {
              const direct = root.querySelector(sel);
              if (direct) return direct;
            }
            if (d === 0 && root.shadowRoot) {
              const own = queryDeep(root.shadowRoot, d + 1);
              if (own) return own;
            }
            const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
            for (let i = 0; i < all.length; i++) {
              const h = all[i];
              if (h.shadowRoot) {
                const sHit = queryDeep(h.shadowRoot, d + 1);
                if (sHit) return sHit;
              }
              if (h.tagName === 'IFRAME') {
                try {
                  if (h.contentDocument) {
                    const fHit = queryDeep(h.contentDocument, d + 1);
                    if (fHit) return fHit;
                  }
                } catch (e) {}
              }
            }
            return null;
          };
          const el = queryDeep(document, 0);
          if (!el) return JSON.stringify(false);
          el.focus();
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return JSON.stringify(true);
        })()
      `);
      if (filled) return 'filled-deep-dom';
      throw err;
    }
  }

  /** Digita com teclas reais (necessário para campos com máscara, como as datas `__/__/____`). */
  async type(refOrSelector: string, text: string): Promise<string> {
    return this.run(['type', refOrSelector, text]);
  }

  async stateSave(filePath: string): Promise<string> {
    const normalized = path.resolve(filePath).replace(/\\/g, '/');
    return this.run(['state', 'save', normalized]);
  }

  async stateLoad(filePath: string): Promise<string> {
    const normalized = path.resolve(filePath).replace(/\\/g, '/');
    return this.run(['state', 'load', normalized]);
  }

  async close(): Promise<string> {
    return this.run(['close']);
  }
}
