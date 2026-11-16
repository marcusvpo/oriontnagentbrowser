import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import type { BoundingBox, DOMActionNode, DOMResolvedGeometry, SemanticZone, StepZonePolicy } from './types.js';
import { buildDOMIntrospectionScript, parseDOMGeometryResponse, NAV_ZONE_SELECTOR } from './dom-geometry.js';

const execFileAsync = promisify(execFile);

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
}

export class AgentBrowserClient {
  private headless: boolean;
  private sessionId?: string;
  private statePath?: string;
  private deviceScaleFactor: number;

  constructor(options: boolean | AgentBrowserOptions = false) {
    if (typeof options === 'boolean') {
      this.headless = options;
      this.deviceScaleFactor = 1;
      this.sessionId = 'auditoria-session';
    } else {
      this.headless = options.headless ?? false;
      this.sessionId = options.sessionId || 'auditoria-session';
      this.statePath = options.statePath;
      this.deviceScaleFactor = options.deviceScaleFactor ?? 1;
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

  async open(url: string): Promise<string> {
    return this.run(['open', url]);
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
    return this.run(['set', 'viewport', String(width), String(height)]);
  }

  async jumpHash(hashRoute: string): Promise<string> {
    const cleanHash = hashRoute.startsWith('#') ? hashRoute : `#${hashRoute}`;
    return this.eval(`window.location.hash = '${cleanHash}'`);
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
        actionMember: options.actionMember
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
   * Confere, imediatamente antes da ação, o nó carimbado na medição (ADR-015 §2.4): o carimbo deve
   * apontar para exatamente um nó visível. Devolve a sua descrição atual ou `null` se o carimbo se
   * perdeu (ex.: o Angular recriou o nó).
   */
  async probeActionNode(stampSelector: string): Promise<DOMActionNode | null> {
    const raw = await this.eval(`
      (() => {
        const found = document.querySelectorAll(${JSON.stringify(stampSelector)});
        if (found.length !== 1) return null;
        const el = found[0];
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (r.width <= 1 || r.height <= 1 || style.display === 'none' || style.visibility === 'hidden') return null;
        const x1 = Math.round(r.left), y1 = Math.round(r.top);
        return JSON.stringify({
          tagName: el.tagName.toLowerCase(),
          text: (el.innerText || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || '').trim().slice(0, 80),
          box: { x: x1, y: y1, width: Math.round(r.right) - x1, height: Math.round(r.bottom) - y1 },
          insideNavZone: !!el.closest(${JSON.stringify(NAV_ZONE_SELECTOR)}),
          disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true' || !!el.closest('fieldset[disabled]'),
          hint: (el.getAttribute('title') || el.getAttribute('aria-label') || el.getAttribute('value') || '').trim().slice(0, 80),
          opensNewTab: (() => {
            const a = el.closest('a');
            const js = [el.getAttribute('onclick'), el.getAttribute('ng-click'), a && a.getAttribute('onclick'), a && a.getAttribute('ng-click')].join(' ');
            if (a && String(a.getAttribute('target') || '').toLowerCase() === '_blank') return true;
            if (/window\\.open|\\$window\\.open/.test(js)) return true;
            // Link dirigido por JS (handler do Angular não aparece como atributo) com chamada para navegação
            const href = a ? String(a.getAttribute('href') || '') : '';
            const txt = String((a || el).innerText || '').toLowerCase();
            return !!a && (href === '' || href === '#') && /clique aqui|acesse|acessar|tela de configura/.test(txt);
          })()
        });
      })()
    `);
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
    return this.run(['click', refOrSelector]);
  }

  async fill(refOrSelector: string, text: string): Promise<string> {
    return this.run(['fill', refOrSelector, text]);
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
