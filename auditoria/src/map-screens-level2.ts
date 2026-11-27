import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureAuthenticated } from './auth.js';
import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { captureTrueFullPage } from './fullpage-capture.js';
import { canonNormalize, isUserMenuRootLabel } from './menu-canonical.js';
import { buildMenuTreeScript, openCascadeWithPointer, parseMenuTreeResponse, type MenuTreeItem } from './menu-path.js';
import { ACTIVE_MODAL_SELECTOR, closeActiveModals, countActiveModals } from './modal-scope.js';
import { preflightOrionReachability } from './preflight.js';
import {
  buildOrionScreenCatalog,
  buildScreenDomExtractionScript,
  computeStateFingerprint,
  DEFAULT_LEVEL2_SCREENSHOTS_DIR,
  DEFAULT_SCREEN_CATALOG_PATH,
  DEFAULT_SCREENSHOTS_DIR,
  enrichScreenWithLevel2,
  mergeCatalogEntries,
  slugify,
  type Level2Status,
  type OrionScreenCatalog,
  type RawScreenDomExtraction,
  type ScreenButtonInfo,
  type ScreenCatalogEntry,
  type ScreenFieldInfo,
  type ScreenSubState,
  type SubStateKind,
  type SubStateOpenedAs,
  type SubStateSecurityAlert
} from './screen-catalog-extractor.js';

import sharp from 'sharp';

export interface MapScreensLevel2CliOptions {
  module?: string;
  only?: string;
  resume: boolean;
  maxStatesPerScreen?: number;
  dryRunPlan: boolean;
  timeoutMs: number;
  level25?: boolean;
  refreshFullpage?: boolean;
}

/**
 * Faz o parse das flags de CLI do mapeamento Nível 2 / 2.5:
 * --module=<Nome>, --only=<id-or-slug>, --resume, --max-states-per-screen=<N>, --dry-run-plan, --timeout=<ms>, --level25, --refresh-fullpage
 */
export function parseLevel2CliFlags(argv: string[]): MapScreensLevel2CliOptions {
  const opts: MapScreensLevel2CliOptions = {
    resume: false,
    dryRunPlan: false,
    timeoutMs: 12000
  };

  for (const arg of argv) {
    if (arg === '--resume') {
      opts.resume = true;
    } else if (arg === '--dry-run-plan') {
      opts.dryRunPlan = true;
    } else if (arg === '--level25') {
      opts.level25 = true;
    } else if (arg === '--refresh-fullpage') {
      opts.refreshFullpage = true;
    } else if (arg.startsWith('--module=')) {
      opts.module = arg.slice('--module='.length).trim();
    } else if (arg.startsWith('--only=')) {
      opts.only = arg.slice('--only='.length).trim();
    } else if (arg.startsWith('--max-states-per-screen=')) {
      const n = parseInt(arg.slice('--max-states-per-screen='.length), 10);
      if (Number.isFinite(n) && n > 0) opts.maxStatesPerScreen = n;
    } else if (arg.startsWith('--timeout=')) {
      const ms = parseInt(arg.slice('--timeout='.length), 10);
      if (Number.isFinite(ms) && ms > 0) opts.timeoutMs = ms;
    }
  }

  return opts;
}

/**
 * Normaliza texto de controles incluindo quebra de camelCase (ex.: `ng-click="vm.cancelarAto()"` -> `vm cancelar ato`).
 */
export function normalizeControlText(raw: string | null | undefined): string {
  return String(raw ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const WRITE_PERSIST_KEYWORDS = [
  'salvar',
  'gravar',
  'confirmar',
  'concluir',
  'finalizar',
  'aplicar',
  'aprovar',
  'assinar',
  'selar',
  'emitir',
  'gerar',
  'enviar',
  'transmitir',
  'retransmitir',
  'protocolar',
  'lavrar',
  'importar',
  'sincronizar',
  'processar',
  'executar',
  'estornar',
  'baixar',
  'liquidar',
  'faturar'
];

const DESTROY_STATE_KEYWORDS = [
  'excluir',
  'deletar',
  'remover',
  'apagar',
  'inativar',
  'desativar',
  'ativar',
  'cancelar ato',
  'cancelar selo',
  'cancelar protocolo',
  'anular',
  'bloquear',
  'desbloquear',
  'resetar',
  'redefinir'
];

const SESSION_KEYWORDS = ['sair', 'logout', 'encerrar sessao'];

const NON_OPENER_BUSINESS_ACTIONS = ['nova senha'];

const BLOCKED_ICON_REGEX =
  /\b(?:fa-trash|fa-trash-o|fa-save|fa-floppy-o|fa-remove|glyphicon-trash|glyphicon-floppy-disk)\b/i;

const MODAL_DISCARD_EXACT = new Set(['cancelar', 'fechar', 'voltar', 'x']);

export interface ControlInspectInput {
  label?: string;
  tooltip?: string;
  ariaLabel?: string;
  ngClick?: string;
  iconClass?: string;
}

/**
 * Verifica a BLOCKLIST ABSOLUTA ANTI-MUTAÇÃO em label, tooltip, aria-label, ng-click e ícone.
 * Exceção: Cancelar/Fechar/Voltar/× somente quando `allowModalDiscard === true` (para fechar modal/form aberto).
 */
export function isBlockedByAntiMutation(
  input: ControlInspectInput,
  opts: { allowModalDiscard?: boolean } = {}
): { blocked: boolean; reason?: string } {
  const rawFields = [input.label, input.tooltip, input.ariaLabel, input.ngClick].filter(Boolean);
  const normCombined = rawFields.map(f => normalizeControlText(f)).filter(Boolean).join(' ');

  if (BLOCKED_ICON_REGEX.test(String(input.iconClass || ''))) {
    return { blocked: true, reason: `Ícone de mutação bloqueado: ${input.iconClass}` };
  }

  for (const kw of [...WRITE_PERSIST_KEYWORDS, ...DESTROY_STATE_KEYWORDS, ...SESSION_KEYWORDS, ...NON_OPENER_BUSINESS_ACTIONS]) {
    const re = new RegExp(`\\b${kw}\\b`, 'i');
    if (re.test(normCombined)) {
      return { blocked: true, reason: `Palavra-chave bloqueada: "${kw}"` };
    }
  }

  // "cancelar" isolado fora de descarte de modal é bloqueado por segurança
  if (!opts.allowModalDiscard && /\bcancelar\b/i.test(normCombined)) {
    return { blocked: true, reason: 'Palavra-chave "cancelar" bloqueada fora de descarte de modal' };
  }

  // Mesmo dentro de modal discard, se houver algo além de cancelar/fechar/voltar/x (ex: cancelar ato), já caiu acima
  if (opts.allowModalDiscard) {
    const labelNorm = normalizeControlText(input.label);
    if (labelNorm && MODAL_DISCARD_EXACT.has(labelNorm)) {
      return { blocked: false };
    }
  }

  return { blocked: false };
}

const OPENER_FORM_PREFIXES = ['novo', 'nova', 'adicionar', 'incluir', 'cadastrar', 'visualizar', 'detalhes'];
const OPENER_FILTER_PREFIXES = [
  'filtros',
  'mais filtros',
  'pesquisa avancada',
  'busca avancada',
  'opcoes avancadas',
  'expandir'
];
const SEARCH_BUTTON_PREFIXES = ['pesquisar', 'filtrar', 'buscar', 'consultar'];
const SAFE_VIEW_SWITCHER_EXACT = new Set([
  'kanban',
  'dashboard',
  'visao geral',
  'informacoes',
  'resumo',
  'lista',
  'grade',
  'calendario',
  'grafico',
  'graficos',
  'tabela',
  'detalhado',
  'sintetico',
  'analitico'
]);
const SAFE_VIEW_SWITCHER_PREFIXES = ['por ', 'modo ', 'visualizacao '];

function matchesPrefixOrExact(norm: string, candidates: string[]): boolean {
  if (!norm) return false;
  return candidates.some(c => norm === c || norm.startsWith(`${c} `));
}

/**
 * Classifica se um botão é um abridor seguro permitido no Nível 2 (e qual SubStateKind ele representa).
 */
export function classifySafeOpener(
  input: ControlInspectInput
): { safe: true; kind: 'form_opener' | 'advanced_filters' } | { safe: false; reason: string } {
  const anti = isBlockedByAntiMutation(input);
  if (anti.blocked) {
    return { safe: false, reason: anti.reason || 'Bloqueado pela anti-mutação' };
  }

  const labelNorm = normalizeControlText(input.label);
  const tooltipNorm = normalizeControlText(input.tooltip);
  const ariaNorm = normalizeControlText(input.ariaLabel);
  const candidates = [labelNorm, tooltipNorm, ariaNorm].filter(Boolean);

  if (candidates.some(c => matchesPrefixOrExact(c, OPENER_FILTER_PREFIXES))) {
    return { safe: true, kind: 'advanced_filters' };
  }
  if (candidates.some(c => matchesPrefixOrExact(c, OPENER_FORM_PREFIXES))) {
    return { safe: true, kind: 'form_opener' };
  }

  return { safe: false, reason: 'Não corresponde à whitelist de abridores seguros' };
}

/**
 * Classifica se um botão é um alternador de modo/visão seguro (Kanban, Dashboard, Visão Geral, Por ..., Informações, etc.).
 */
export function classifySafeViewSwitcher(
  input: ControlInspectInput
): { safe: true } | { safe: false; reason: string } {
  const anti = isBlockedByAntiMutation(input);
  if (anti.blocked) {
    return { safe: false, reason: anti.reason || 'Bloqueado pela anti-mutação' };
  }
  if (classifySafeOpener(input).safe || isSafeSearchButton(input)) {
    return { safe: false, reason: 'Já classificado como abridor ou botão de busca' };
  }

  const labelNorm = normalizeControlText(input.label);
  const tooltipNorm = normalizeControlText(input.tooltip);
  const ariaNorm = normalizeControlText(input.ariaLabel);
  const candidates = [labelNorm, tooltipNorm, ariaNorm].filter(Boolean);

  const matched = candidates.some(
    c => SAFE_VIEW_SWITCHER_EXACT.has(c) || SAFE_VIEW_SWITCHER_PREFIXES.some(p => c.startsWith(p))
  );
  if (matched) {
    return { safe: true };
  }
  return { safe: false, reason: 'Não corresponde à whitelist de alternadores de visão' };
}

/**
 * Verifica se um botão é um gatilho seguro de pesquisa (Pesquisar/Filtrar/Buscar/Consultar).
 */
export function isSafeSearchButton(input: ControlInspectInput): boolean {
  const anti = isBlockedByAntiMutation(input);
  if (anti.blocked) return false;
  const labelNorm = normalizeControlText(input.label);
  const tooltipNorm = normalizeControlText(input.tooltip);
  return (
    matchesPrefixOrExact(labelNorm, SEARCH_BUTTON_PREFIXES) ||
    matchesPrefixOrExact(tooltipNorm, SEARCH_BUTTON_PREFIXES)
  );
}

const READONLY_ENDPOINT_REGEX =
  /\/(?:(?:pesquisar|buscar|listar|filtrar|consultar|obter|carregar|validar|calcular|recuperar|verificar|search|list|filter|query|find|get|autocomplete|combo|select|setCache|configuracaoToggle)[a-zA-Z0-9_-]*|g\/collect|j\/collect|spellcheck[a-zA-Z0-9_/-]*)(?:[/?#]|$)/i;

/**
 * Verifica se um endpoint XHR/Fetch é sabidamente somente leitura para busca/listagem.
 */
export function isReadOnlySearchEndpoint(url: string): boolean {
  return READONLY_ENDPOINT_REGEX.test(String(url || ''));
}

export interface PlannedAction {
  kind: SubStateKind;
  triggerLabel: string;
  reason: string;
}

export interface ScreenExplorationPlan {
  screenId: string;
  modulo: string;
  chain: string[];
  slug: string;
  eligible: boolean;
  maxStatesLimit: number;
  actions: PlannedAction[];
}

function isUnlimitedTabScreen(entry: ScreenCatalogEntry): boolean {
  const slugNorm = normalizeControlText(entry.slug);
  const chainNorm = entry.chain.map(c => normalizeControlText(c)).join(' ');
  return slugNorm.includes('parametrizac') || chainNorm.includes('parametrizac');
}

/**
 * Gera o plano determinístico de cliques seguros para uma tela a partir do catálogo Nível 1.
 */
export function planScreenExploration(
  entry: ScreenCatalogEntry,
  cliMaxStates?: number
): ScreenExplorationPlan {
  const maxStatesLimit =
    typeof cliMaxStates === 'number' && cliMaxStates > 0
      ? cliMaxStates
      : isUnlimitedTabScreen(entry)
        ? 100
        : 25;

  if (entry.status !== 'captured') {
    return {
      screenId: entry.id,
      modulo: entry.modulo,
      chain: entry.chain,
      slug: entry.slug,
      eligible: false,
      maxStatesLimit,
      actions: []
    };
  }

  const actions: PlannedAction[] = [];
  const seenKey = new Set<string>();
  const pushAction = (kind: SubStateKind, triggerLabel: string, reason: string) => {
    const key = `${kind}::${normalizeControlText(triggerLabel)}`;
    if (seenKey.has(key)) return;
    seenKey.add(key);
    actions.push({ kind, triggerLabel, reason });
  };

  // 1. Abas inativas
  if ((entry.tabs?.length ?? 0) > 1 || (entry.tabs ?? []).some(t => !t.active && !t.disabled)) {
    for (const tab of entry.tabs ?? []) {
      if (tab.active || tab.disabled) continue;
      if (isBlockedByAntiMutation({ label: tab.label }).blocked) continue;
      pushAction('tab', tab.label, 'Aba inativa');
    }
  }

  // 2. Accordions recolhidos
  for (const acc of entry.accordions ?? []) {
    if (acc.expanded) continue;
    if (isBlockedByAntiMutation({ label: acc.label }).blocked) continue;
    pushAction('accordion', acc.label, 'Accordion recolhido');
  }

  // 3. Botões abridores seguros
  for (const btn of entry.buttons ?? []) {
    if (btn.disabled) continue;
    const cls = classifySafeOpener({ label: btn.label, tooltip: btn.tooltip, iconClass: btn.iconClass });
    if (cls.safe) {
      pushAction(cls.kind, btn.label || btn.tooltip, `Botão seguro (${cls.kind})`);
    }
  }

  // 3b. Alternadores de modo/visão seguros (Kanban, Dashboard, Visão Geral, Por ..., Informações)
  for (const btn of entry.buttons ?? []) {
    if (btn.disabled) continue;
    const cls = classifySafeViewSwitcher({ label: btn.label, tooltip: btn.tooltip, iconClass: btn.iconClass });
    if (cls.safe) {
      pushAction('view_switcher', btn.label || btn.tooltip, 'Alternador de modo/visão seguro');
    }
  }

  // 4. Tabelas vazias com botão Pesquisar/Filtrar/Buscar/Consultar seguro
  // (remoção do bloqueio estático de required: o check ao vivo valida se o campo obrigatório está realmente vazio)
  const hasEmptyTable = (entry.tables ?? []).some(t => t.isEmpty);
  if (hasEmptyTable) {
    const searchBtn = (entry.buttons ?? []).find(
      b => !b.disabled && isSafeSearchButton({ label: b.label, tooltip: b.tooltip, iconClass: b.iconClass })
    );
    if (searchBtn) {
      pushAction('search_grid_reveal', searchBtn.label || searchBtn.tooltip, 'Tabela vazia com busca segura');
    }
  }

  const limitedActions = actions.slice(0, maxStatesLimit);
  return {
    screenId: entry.id,
    modulo: entry.modulo,
    chain: entry.chain,
    slug: entry.slug,
    eligible: limitedActions.length > 0,
    maxStatesLimit,
    actions: limitedActions
  };
}

/**
 * Filtra entradas do catálogo Nível 1 segundo --module, --only e --resume.
 */
export function filterCatalogEntriesForLevel2(
  screens: ScreenCatalogEntry[],
  opts: { module?: string; only?: string; resume?: boolean; level25?: boolean }
): ScreenCatalogEntry[] {
  let result = screens.slice();

  if (opts.module) {
    const targetMod = normalizeControlText(opts.module);
    const targetModSlug = slugify(opts.module);
    result = result.filter(
      s =>
        normalizeControlText(s.modulo) === targetMod ||
        slugify(s.modulo) === targetModSlug ||
        normalizeControlText(s.modulo).includes(targetMod)
    );
  }

  if (opts.only) {
    const rawOnly = opts.only.trim();
    const onlyNum = /^\d+$/.test(rawOnly) ? parseInt(rawOnly, 10) : null;
    const onlySlug = slugify(rawOnly);
    result = result.filter(s => {
      if (onlyNum !== null && parseInt(s.id, 10) === onlyNum) return true;
      return s.slug === onlySlug || s.slug.includes(onlySlug) || s.id === rawOnly;
    });
  }

  if (opts.resume) {
    if (opts.level25) {
      result = result.filter(s => s.status !== 'skipped' && !(s as any).level25CompletedAt);
    } else {
      result = result.filter(
        s => s.level2Status !== 'explored' && s.level2Status !== 'no_substates' && s.status !== 'skipped'
      );
    }
  }

  return result;
}

/**
 * Script idempotente para monitoramento passivo de mutações XHR/Fetch no navegador.
 */
export function buildL2MutationMonitorInitScript(): string {
  return `
    (() => {
      const READONLY_RE = /\\/(?:(?:pesquisar|buscar|listar|filtrar|consultar|obter|carregar|validar|calcular|recuperar|verificar|search|list|filter|query|find|get|autocomplete|combo|select|setCache|configuracaoToggle)[a-zA-Z0-9_-]*|g\\/collect|j\\/collect|spellcheck[a-zA-Z0-9_\\/-]*)(?:[/?#]|$)/i;
      if (window.__orionL2MutationMonitor && window.__orionL2MutationMonitor.installed) {
        window.__orionL2MutationMonitor.isReadOnly = url => READONLY_RE.test(String(url || ''));
        return JSON.stringify({ installed: true, alertsCount: window.__orionL2MutationMonitor.alerts.length });
      }
      const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
      const mon = {
        installed: true,
        alerts: [],
        isReadOnly: url => READONLY_RE.test(String(url || ''))
      };
      window.__orionL2MutationMonitor = mon;

      const recordIfMutation = (method, rawUrl) => {
        const m = String(method || 'GET').toUpperCase();
        if (!MUTATION_METHODS.has(m)) return;
        let pathname = String(rawUrl || '');
        try {
          const u = new URL(pathname, window.location.origin || 'http://orion.local');
          pathname = u.pathname + u.search;
        } catch (e) {}
        if (!mon.isReadOnly(pathname)) {
          mon.alerts.push({
            timestamp: new Date().toISOString(),
            method: m,
            url: pathname.slice(0, 180)
          });
        }
      };

      if (typeof window.fetch === 'function' && !window.fetch.__orionL2Wrapped) {
        const prevFetch = window.fetch.bind(window);
        const wrapped = function(input, init) {
          const url = typeof input === 'string' ? input : (input && input.url) || '';
          const method = (init && init.method) || (input && input.method) || 'GET';
          recordIfMutation(method, url);
          return prevFetch(input, init);
        };
        wrapped.__orionL2Wrapped = true;
        window.fetch = wrapped;
      }

      if (typeof window.XMLHttpRequest === 'function' && window.XMLHttpRequest.prototype && !window.XMLHttpRequest.prototype.__orionL2Wrapped) {
        const origOpen = window.XMLHttpRequest.prototype.open;
        const origSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function(method, url) {
          this.__orionL2Method = method;
          this.__orionL2Url = url;
          return origOpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function() {
          recordIfMutation(this.__orionL2Method, this.__orionL2Url);
          return origSend.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.__orionL2Wrapped = true;
      }

      return JSON.stringify({ installed: true, alertsCount: 0 });
    })()
  `;
}

async function readAndClearMutationAlerts(
  client: AgentBrowserClient,
  trigger: string
): Promise<SubStateSecurityAlert[]> {
  const raw = await client
    .evalJson<Array<{ timestamp: string; method: string; url: string }>>(`
      (() => {
        const m = window.__orionL2MutationMonitor;
        if (!m || !Array.isArray(m.alerts)) return JSON.stringify([]);
        const out = m.alerts.splice(0, m.alerts.length);
        return JSON.stringify(out);
      })()
    `)
    .catch(() => null);
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map(a => ({
    timestamp: a.timestamp,
    method: a.method,
    url: a.url,
    trigger,
    reason: `Requisição ${a.method} inesperada fora da whitelist de leitura: ${a.url}`
  }));
}

function readCatalog(catalogPath = DEFAULT_SCREEN_CATALOG_PATH): OrionScreenCatalog {
  return JSON.parse(fs.readFileSync(catalogPath, 'utf-8')) as OrionScreenCatalog;
}

function writeCatalogCheckpoint(
  catalogPath: string,
  screens: ScreenCatalogEntry[],
  totalCanonicalPaths: number
): OrionScreenCatalog {
  const dir = path.dirname(catalogPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const catalog = buildOrionScreenCatalog(screens, { totalCanonicalPaths, level: 2 });
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
  return catalog;
}

async function waitForOrionLoaders(client: AgentBrowserClient, maxWaitMs = 3500): Promise<void> {
  await client
    .evalJson<boolean>(`
      new Promise(resolve => {
        const deadline = Date.now() + ${Math.max(300, maxWaitMs)};
        const vis = e => {
          if (!e || !e.getBoundingClientRect) return false;
          const r = e.getBoundingClientRect();
          const s = window.getComputedStyle(e);
          return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
        };
        const tick = () => {
          const loaders = Array.from(document.querySelectorAll('.loading, .spinner, .blockUI, .ngx-spinner'));
          const mon = window.__orionNetMonitor;
          const netBusy = mon && mon.pendingCount > 0;
          if ((!loaders.some(vis) && !netBusy) || Date.now() >= deadline) {
            resolve(JSON.stringify(true));
            return;
          }
          setTimeout(tick, 120);
        };
        tick();
      })
    `)
    .catch(() => false);
}

async function extractDom(client: AgentBrowserClient): Promise<RawScreenDomExtraction | null> {
  const script = buildScreenDomExtractionScript(NAV_ZONE_SELECTOR, ACTIVE_MODAL_SELECTOR);
  return client.evalJson<RawScreenDomExtraction>(script);
}

/**
 * Restaura a tela para o estado limpo (fecha modais, abas secundárias e retorna ao hash original).
 */
export async function restoreCleanScreenState(
  client: AgentBrowserClient,
  expectedRouteHash: string
): Promise<boolean> {
  await client.closeSecondaryTabs().catch(() => 0);

  let modalsRemaining = await countActiveModals(client).catch(() => 0);
  if (modalsRemaining > 0) {
    await closeActiveModals(client, 4).catch(() => undefined);
    modalsRemaining = await countActiveModals(client).catch(() => 0);
  }
  if (modalsRemaining > 0) {
    await client.pressKey('Escape').catch(() => undefined);
    await client.wait(400);
    modalsRemaining = await countActiveModals(client).catch(() => 0);
  }

  const currentHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
  if (expectedRouteHash && currentHash !== expectedRouteHash) {
    // Tenta clicar botão Voltar/Fechar na área de conteúdo se houver sub-rota
    await client
      .evalJson<boolean>(`
        (() => {
          const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
          const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim().toLowerCase();
          const root = document.querySelector('#content, main, [role="main"], .main-content, .content-wrapper') || document.body;
          const btn = Array.from(root.querySelectorAll('button, a.btn')).find(b => vis(b) && ['voltar', 'fechar', 'cancelar'].includes(norm(b.innerText || b.textContent)));
          if (btn) { btn.click(); return JSON.stringify(true); }
          return JSON.stringify(false);
        })()
      `)
      .catch(() => false);
    await client.wait(500);
    const afterBtnHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
    if (afterBtnHash !== expectedRouteHash) {
      await client.jumpHash(expectedRouteHash).catch(() => undefined);
      await waitForOrionLoaders(client, 4000);
    }
  }

  const finalModals = await countActiveModals(client).catch(() => 0);
  let finalHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
  if (expectedRouteHash && finalHash !== expectedRouteHash) {
    await client.jumpHash('#/inicio').catch(() => undefined);
    await client.wait(250);
    await client.jumpHash(expectedRouteHash).catch(() => undefined);
    await waitForOrionLoaders(client, 4000);
    finalHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
  }
  const hashOk = !expectedRouteHash || finalHash === expectedRouteHash;
  return finalModals === 0 && hashOk;
}

async function navigateToScreen(
  client: AgentBrowserClient,
  entry: ScreenCatalogEntry,
  getMenuItems: (forceRefresh?: boolean) => Promise<MenuTreeItem[]>
): Promise<boolean> {
  await closeActiveModals(client).catch(() => undefined);
  await client.closeSecondaryTabs().catch(() => undefined);

  if (entry.openedAs === 'route' && entry.routeHash && entry.routeHash !== '#/inicio' && entry.routeHash !== '#') {
    await client.jumpHash(entry.routeHash);
    await waitForOrionLoaders(client, 5000);
    await client.waitForNetworkIdle({ timeoutMs: 3000, idleMs: 250 });
    await client.wait(400);
    const curHash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")')) || '';
    if (curHash === entry.routeHash || curHash.startsWith(entry.routeHash)) {
      await client.eval(buildL2MutationMonitorInitScript()).catch(() => undefined);
      return true;
    }
  }

  // Fallback: navega via menu canônico
  await client.jumpHash('#/inicio');
  await client.wait(400);
  let items = await getMenuItems(false);
  const findItem = (list: MenuTreeItem[]) => {
    if (isUserMenuRootLabel(entry.chain[0] || '')) {
      const leafNorm = canonNormalize(entry.chain[entry.chain.length - 1] || '');
      return list.find(
        it =>
          it.chain.length === entry.chain.length &&
          isUserMenuRootLabel(it.chain[0] || '') &&
          canonNormalize(it.chain[it.chain.length - 1] || '') === leafNorm
      );
    }
    return list.find(
      it =>
        it.chain.length === entry.chain.length &&
        it.chain.every((seg, idx) => canonNormalize(seg) === canonNormalize(entry.chain[idx] || ''))
    );
  };

  let liveItem = findItem(items);
  if (!liveItem) {
    items = await getMenuItems(true);
    liveItem = findItem(items);
  }
  if (!liveItem || liveItem.disabled) return false;

  if (liveItem.selectors.length === 1) {
    await client.eval(
      `(() => { const el = document.querySelector(${JSON.stringify(liveItem!.selectors[0])}); if (el) el.click(); return true; })()`
    );
  } else {
    const cascade = await openCascadeWithPointer(client, liveItem.selectors);
    if (cascade) {
      const leafSel = liveItem.selectors[liveItem.selectors.length - 1];
      await client.eval(
        `(() => { const el = document.querySelector(${JSON.stringify(leafSel)}); if (el) el.click(); return true; })()`
      );
    } else if (isUserMenuRootLabel(entry.chain[0] || '') && liveItem.selectors.length === 2) {
      await client.click(liveItem.selectors[0]);
      await client.wait(300);
      await client.eval(
        `(() => { const el = document.querySelector(${JSON.stringify(liveItem!.selectors[1])}); if (el) el.click(); return true; })()`
      );
    } else {
      return false;
    }
  }

  await client.mouseMove(2, 2).catch(() => undefined);
  await waitForOrionLoaders(client, 5000);
  await client.waitForNetworkIdle({ timeoutMs: 3000, idleMs: 250 });
  await client.wait(500);
  await client.eval(buildL2MutationMonitorInitScript()).catch(() => undefined);
  return true;
}

async function runWithTimeout<T>(
  ms: number,
  label: string,
  fn: (isAborted: () => boolean) => Promise<T>
): Promise<T> {
  let aborted = false;
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      fn(() => aborted),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          aborted = true;
          reject(new Error(`Timeout isolado (${ms}ms) em ${label}`));
        }, ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function clickControlSafelyInDom(
  client: AgentBrowserClient,
  kind: 'tab' | 'accordion' | 'button' | 'search' | 'row_eye',
  targetLabel: string
): Promise<{ clicked: boolean; blockedReason?: string; detail?: string }> {
  const blockedWords = [...WRITE_PERSIST_KEYWORDS, ...DESTROY_STATE_KEYWORDS, ...SESSION_KEYWORDS];
  const res = await client.evalJson<{ clicked: boolean; blockedReason?: string; detail?: string }>(`
    (() => {
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const NAV_SEL = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const BLOCKED_WORDS = ${JSON.stringify(blockedWords)};
      const KIND = ${JSON.stringify(kind)};
      const TARGET = ${JSON.stringify(normalizeControlText(targetLabel))};

      const norm = t => String(t || '')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();

      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && !e.closest('.ng-hide');
      };

      const isBlocked = el => {
        const ngClick = el.getAttribute('ng-click') || el.getAttribute('data-ng-click') || '';
        const title = el.getAttribute('title') || el.getAttribute('data-original-title') || '';
        const aria = el.getAttribute('aria-label') || '';
        const txt = el.innerText || el.textContent || el.value || '';
        const combined = norm(txt + ' ' + title + ' ' + aria + ' ' + ngClick);
        for (const kw of BLOCKED_WORDS) {
          if (new RegExp('\\\\b' + kw + '\\\\b', 'i').test(combined)) {
            return 'Bloqueado no DOM vivo: "' + kw + '" (' + combined.slice(0, 60) + ')';
          }
        }
        if (/\\bcancelar\\b/i.test(combined)) {
          return 'Bloqueado no DOM vivo: "cancelar"';
        }
        const ic = el.querySelector('i, span.fa, span.glyphicon');
        const icCls = ic ? String(ic.getAttribute('class') || '') : '';
        if (/\\b(?:fa-trash|fa-trash-o|fa-save|fa-floppy-o|fa-remove|glyphicon-trash|glyphicon-floppy-disk)\\b/i.test(icCls)) {
          return 'Ícone bloqueado no DOM vivo: ' + icCls;
        }
        return null;
      };

      const activeModals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      const modalRoot = activeModals.length > 0 ? activeModals[activeModals.length - 1] : null;
      const contentRoot = modalRoot || document.querySelector('#content, main, [role="main"], .main-content, .content-wrapper') || document.body;

      if (KIND === 'tab') {
        const tabSelectors = [
          '.nav-tabs',
          '[role="tablist"]',
          'ul.nav-pills',
          'ul.nav.nav-stacked',
          '.nav-wizard',
          '.wizard-steps',
          '.steps',
          'ul.list-group'
        ].join(', ');
        for (const tc of Array.from(contentRoot.querySelectorAll(tabSelectors))) {
          if (!vis(tc) || tc.closest('.navbar, header, footer, .footer, .rodape, .sidebar, .menu-lateral, .bg-menu-lateral')) continue;
          const isListGroup = tc.classList.contains('list-group');
          const rawItems = isListGroup
            ? Array.from(tc.querySelectorAll(':scope > a.list-group-item, :scope > button.list-group-item, :scope > li.list-group-item'))
            : Array.from(tc.querySelectorAll(':scope > li, :scope > [role="tab"], :scope > .mat-tab-label'));
          for (const item of rawItems) {
            if (!vis(item)) continue;
            const link = item.querySelector('a, button') || item;
            const lbl = norm(link.innerText || link.textContent || item.getAttribute('aria-label'));
            if (lbl === TARGET) {
              const blk = isBlocked(link);
              if (blk) return JSON.stringify({ clicked: false, blockedReason: blk });
              link.scrollIntoView({ block: 'center', inline: 'nearest' });
              link.click();
              return JSON.stringify({ clicked: true, detail: lbl });
            }
          }
        }
        for (const customTab of Array.from(contentRoot.querySelectorAll('[role="tab"], .mat-tab-label, button[ng-click*="aba" i], a[ng-click*="aba" i], button[ng-click*="tab" i], a[ng-click*="tab" i]'))) {
          if (!vis(customTab) || customTab.closest('.navbar, header, footer, .footer, .rodape, .sidebar, .menu-lateral, .bg-menu-lateral')) continue;
          const lbl = norm(customTab.innerText || customTab.textContent || customTab.getAttribute('aria-label'));
          if (lbl === TARGET) {
            const blk = isBlocked(customTab);
            if (blk) return JSON.stringify({ clicked: false, blockedReason: blk });
            customTab.scrollIntoView({ block: 'center', inline: 'nearest' });
            customTab.click();
            return JSON.stringify({ clicked: true, detail: lbl });
          }
        }
        return JSON.stringify({ clicked: false, detail: 'Aba não encontrada no DOM' });
      }

      if (KIND === 'accordion') {
        for (const acc of Array.from(contentRoot.querySelectorAll('.panel-heading [data-toggle="collapse"], .accordion-toggle, [aria-expanded]'))) {
          if (!vis(acc) || acc.closest(NAV_SEL)) continue;
          const lbl = norm(acc.innerText || acc.textContent || acc.getAttribute('aria-label'));
          if (lbl === TARGET) {
            const blk = isBlocked(acc);
            if (blk) return JSON.stringify({ clicked: false, blockedReason: blk });
            acc.scrollIntoView({ block: 'center', inline: 'nearest' });
            acc.click();
            return JSON.stringify({ clicked: true, detail: lbl });
          }
        }
        return JSON.stringify({ clicked: false, detail: 'Accordion não encontrado no DOM' });
      }

      if (KIND === 'row_eye') {
        const firstRow = contentRoot.querySelector('table tbody tr');
        if (!firstRow || !vis(firstRow)) return JSON.stringify({ clicked: false, detail: 'Sem linha visível' });
        for (const act of Array.from(firstRow.querySelectorAll('button, a'))) {
          if (!vis(act)) continue;
          const blk = isBlocked(act);
          if (blk) continue;
          const ic = act.querySelector('i, span.fa, span.glyphicon');
          const icCls = ic ? String(ic.getAttribute('class') || '') : '';
          const lbl = norm((act.innerText || act.textContent || '') + ' ' + (act.getAttribute('title') || '') + ' ' + (act.getAttribute('aria-label') || ''));
          if (/fa-eye|glyphicon-eye-open/i.test(icCls) || /\\b(visualizar|detalhes)\\b/i.test(lbl)) {
            act.scrollIntoView({ block: 'center', inline: 'nearest' });
            act.click();
            return JSON.stringify({ clicked: true, detail: lbl || icCls });
          }
        }
        return JSON.stringify({ clicked: false, detail: 'Nenhuma ação segura de visualização na 1ª linha' });
      }

      // button or search
      const btns = Array.from(contentRoot.querySelectorAll('button, a.btn, input[type="button"], input[type="submit"], [role="button"]'))
        .filter(b => vis(b) && !b.closest(NAV_SEL) && !b.disabled && b.getAttribute('aria-disabled') !== 'true');
      const match = btns.find(b => {
        const lbl = norm(b.innerText || b.textContent || b.value);
        const ttl = norm(b.getAttribute('title') || b.getAttribute('data-original-title') || b.getAttribute('aria-label'));
        return lbl === TARGET || ttl === TARGET;
      });
      if (!match) return JSON.stringify({ clicked: false, detail: 'Botão não encontrado ou desabilitado no DOM' });
      const blk = isBlocked(match);
      if (blk) return JSON.stringify({ clicked: false, blockedReason: blk });
      match.scrollIntoView({ block: 'center', inline: 'nearest' });
      match.click();
      return JSON.stringify({ clicked: true, detail: TARGET });
    })()
  `);
  return res ?? { clicked: false, detail: 'Retorno nulo do DOM' };
}

function diffFieldsAndButtons(
  beforeFields: ScreenFieldInfo[],
  beforeButtons: ScreenButtonInfo[],
  afterFields: ScreenFieldInfo[],
  afterButtons: ScreenButtonInfo[]
): { revealedFields: ScreenFieldInfo[]; revealedButtons: ScreenButtonInfo[] } {
  const beforeF = new Set(beforeFields.map(f => `${normalizeControlText(f.label)}::${f.type}`));
  const beforeB = new Set(beforeButtons.map(b => `${normalizeControlText(b.label)}::${normalizeControlText(b.tooltip)}`));
  return {
    revealedFields: afterFields.filter(f => !beforeF.has(`${normalizeControlText(f.label)}::${f.type}`)),
    revealedButtons: afterButtons.filter(b => !beforeB.has(`${normalizeControlText(b.label)}::${normalizeControlText(b.tooltip)}`))
  };
}

interface SubStatePrintBundle {
  screenshot: string | null;
  fullPageScreenshot: string | null;
  screenshotHeight: number;
}

async function measurePngHeight(absPath: string): Promise<number> {
  try {
    const meta = await sharp(absPath).metadata();
    return meta.height ?? 0;
  } catch {
    return 0;
  }
}

async function saveCleanSubStatePrint(
  client: AgentBrowserClient,
  moduloSlug: string,
  fileName: string,
  checkFullPage = true
): Promise<SubStatePrintBundle> {
  const dir = path.join(DEFAULT_LEVEL2_SCREENSHOTS_DIR, moduloSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const abs = path.join(dir, fileName);
  await client.screenshot(abs);
  const exists = fs.existsSync(abs);
  const viewportHeight = exists ? await measurePngHeight(abs) : 0;

  let fullPageScreenshot: string | null = null;
  let finalHeight = viewportHeight;
  if (exists && checkFullPage) {
    const fullName = fileName.replace(/\.png$/i, '-full.png');
    const fullAbs = path.join(dir, fullName);
    const fullRes = await captureTrueFullPage(client, fullAbs, { onlyIfOverflow: true }).catch(() => null);
    if (fullRes?.captured && fullRes.tallerThanViewport) {
      fullPageScreenshot = `auditoria/mapeamento-telas/nivel-2/${moduloSlug}/${fullName}`;
      finalHeight = fullRes.height;
    } else if (fs.existsSync(fullAbs)) {
      fs.rmSync(fullAbs, { force: true });
    }
  }

  return {
    screenshot: exists ? `auditoria/mapeamento-telas/nivel-2/${moduloSlug}/${fileName}` : null,
    fullPageScreenshot,
    screenshotHeight: finalHeight
  };
}

/**
 * Atualiza a print `-full.png` da raiz (Nível 1) com captura full-page verdadeira.
 * Se a tela não tiver overflow real acima de 910px, remove eventual `-full.png` falso de 900px.
 */
async function refreshRootFullPagePrint(
  client: AgentBrowserClient,
  entry: ScreenCatalogEntry
): Promise<{ fullPage: string | null }> {
  const moduloSlug = slugify(entry.modulo) || 'geral';
  const dir = path.join(DEFAULT_SCREENSHOTS_DIR, moduloSlug);
  const vpPath = entry.screenshots?.viewport;
  const baseName = vpPath ? path.basename(vpPath, '.png') : `${entry.id}-${entry.slug}`;
  const fullName = `${baseName}-full.png`;
  const fullAbs = path.join(dir, fullName);
  const relPath = `auditoria/mapeamento-telas/nivel-1/${moduloSlug}/${fullName}`;

  const fullRes = await captureTrueFullPage(client, fullAbs, { onlyIfOverflow: true }).catch(() => null);
  if (fullRes?.captured && fullRes.tallerThanViewport) {
    return { fullPage: relPath };
  }
  if (fs.existsSync(fullAbs)) {
    fs.rmSync(fullAbs, { force: true });
  }
  return { fullPage: null };
}

/**
 * Explora abas/menus laterais internos e accordions recolhidos DENTRO de um formulário/modal já aberto.
 */
async function exploreNestedTabsAndAccordions(opts: {
  client: AgentBrowserClient;
  entry: ScreenCatalogEntry;
  openerLabel: string;
  openerSlug: string;
  moduloSlug: string;
  initialDom: RawScreenDomExtraction;
  seenFingerprints: Set<string>;
  subStates: ScreenSubState[];
  pushSubState: (st: ScreenSubState) => void;
  isAborted: () => boolean;
  maxNestedTabs?: number;
}): Promise<void> {
  const { client, entry, openerLabel, openerSlug, moduloSlug, initialDom, seenFingerprints, subStates, pushSubState, isAborted } = opts;
  const maxTabs = opts.maxNestedTabs ?? 15;
  const inactiveTabs = (initialDom.tabs ?? []).filter(t => !t.active && !t.disabled);

  let exploredTabs = 0;
  for (const nestedTab of inactiveTabs) {
    if (isAborted() || exploredTabs >= maxTabs) break;
    if (isBlockedByAntiMutation({ label: nestedTab.label }).blocked) continue;

    const clickRes = await clickControlSafelyInDom(client, 'tab', nestedTab.label);
    if (!clickRes.clicked) continue;
    exploredTabs++;

    await waitForOrionLoaders(client, 2500);
    await client.wait(220);
    if (isAborted()) break;

    const alerts = await readAndClearMutationAlerts(client, `${openerLabel} > ${nestedTab.label}`);
    const dom = await extractDom(client);
    if (!dom) continue;

    const fp = computeStateFingerprint({
      routeHash: dom.routeHash,
      modalTitle: dom.openedAsModal ? dom.headings?.[0] || openerLabel : openerLabel,
      activeTab: `${openerLabel}::${nestedTab.label}`,
      fields: dom.fields,
      buttons: dom.buttons,
      tables: dom.tables
    });
    if (seenFingerprints.has(fp)) continue;
    seenFingerprints.add(fp);

    const tabSlug = slugify(nestedTab.label) || `tab-${exploredTabs}`;
    const shotBundle =
      alerts.length === 0
        ? await saveCleanSubStatePrint(
            client,
            moduloSlug,
            `${entry.id}-${entry.slug}__open-${openerSlug}__tab-${tabSlug}.png`
          )
        : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };

    pushSubState({
      id: `${entry.id}-s${String(subStates.length + 1).padStart(2, '0')}`,
      kind: 'nested_tab',
      triggerLabel: nestedTab.label,
      parentOpener: openerLabel,
      openedAs: 'nested_tab',
      routeHash: dom.routeHash || entry.routeHash,
      activeTab: nestedTab.label,
      fingerprint: fp,
      screenshot: shotBundle.screenshot,
      ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
      ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
      restoredCleanly: true,
      status: alerts.length > 0 ? 'blocked_security' : 'captured',
      error: alerts.length > 0 ? alerts[0].reason : null,
      buttons: (dom.buttons ?? []) as ScreenButtonInfo[],
      fields: dom.fields ?? [],
      tabs: dom.tabs ?? [],
      accordions: dom.accordions ?? [],
      tables: dom.tables ?? [],
      alerts: dom.alerts ?? [],
      ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
      capturedAt: new Date().toISOString()
    });
  }

  // Expande até 5 accordions recolhidos internos do formulário/modal aberto
  let accCount = 0;
  for (const innerAcc of (initialDom.accordions ?? []).filter(a => !a.expanded)) {
    if (isAborted() || accCount >= 5) break;
    if (isBlockedByAntiMutation({ label: innerAcc.label }).blocked) continue;
    const beforeF = initialDom.fields ?? [];
    const beforeB = (initialDom.buttons ?? []) as ScreenButtonInfo[];
    const accClick = await clickControlSafelyInDom(client, 'accordion', innerAcc.label);
    if (!accClick.clicked) continue;
    accCount++;
    await client.wait(300);
    const accAlerts = await readAndClearMutationAlerts(client, `${openerLabel} > ${innerAcc.label}`);
    const accDom = await extractDom(client);
    if (!accDom) continue;
    const diff = diffFieldsAndButtons(beforeF, beforeB, accDom.fields, accDom.buttons as ScreenButtonInfo[]);
    if (diff.revealedFields.length === 0 && diff.revealedButtons.length === 0) continue;

    const accFp = computeStateFingerprint({
      routeHash: accDom.routeHash,
      modalTitle: openerLabel,
      activeTab: `${openerLabel}::acc::${innerAcc.label}`,
      fields: accDom.fields,
      buttons: accDom.buttons
    });
    if (seenFingerprints.has(accFp)) continue;
    seenFingerprints.add(accFp);

    const accSlug = slugify(innerAcc.label) || `acc-${accCount}`;
    const accShot =
      accAlerts.length === 0
        ? await saveCleanSubStatePrint(
            client,
            moduloSlug,
            `${entry.id}-${entry.slug}__open-${openerSlug}__acc-${accSlug}.png`
          )
        : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };

    pushSubState({
      id: `${entry.id}-s${String(subStates.length + 1).padStart(2, '0')}`,
      kind: 'accordion',
      triggerLabel: innerAcc.label,
      parentOpener: openerLabel,
      openedAs: 'accordion',
      routeHash: accDom.routeHash || entry.routeHash,
      fingerprint: accFp,
      screenshot: accShot.screenshot,
      ...(accShot.fullPageScreenshot ? { fullPageScreenshot: accShot.fullPageScreenshot } : {}),
      ...(accShot.screenshotHeight > 0 ? { screenshotHeight: accShot.screenshotHeight } : {}),
      restoredCleanly: true,
      status: accAlerts.length > 0 ? 'blocked_security' : 'captured',
      error: accAlerts.length > 0 ? accAlerts[0].reason : null,
      buttons: diff.revealedButtons,
      fields: diff.revealedFields,
      tabs: accDom.tabs,
      accordions: accDom.accordions,
      tables: accDom.tables,
      alerts: accDom.alerts,
      revealedFieldsCount: diff.revealedFields.length,
      revealedButtonsCount: diff.revealedButtons.length,
      ...(accAlerts.length > 0 ? { securityAlerts: accAlerts } : {}),
      capturedAt: new Date().toISOString()
    });
  }
}

async function exploreSingleScreenLevel2(
  client: AgentBrowserClient,
  entry: ScreenCatalogEntry,
  plan: ScreenExplorationPlan,
  timeoutMs: number,
  getMenuItems: (forceRefresh?: boolean) => Promise<MenuTreeItem[]>,
  opts: { level25?: boolean; refreshFullpage?: boolean; cliMaxStates?: number } = {}
): Promise<ScreenCatalogEntry> {
  const moduloSlug = slugify(entry.modulo) || 'geral';
  const isL25 = Boolean(opts.level25);

  if (!plan.eligible && !isL25) {
    return enrichScreenWithLevel2(entry, {
      level2Status: 'no_substates',
      subStates: []
    });
  }

  const navOk = await navigateToScreen(client, entry, getMenuItems);
  if (!navOk) {
    if (isL25 && entry.subStates) {
      return entry;
    }
    return enrichScreenWithLevel2(entry, {
      level2Status: 'failed',
      subStates: []
    });
  }

  const rootDom = await extractDom(client);
  let workingEntry: ScreenCatalogEntry = entry;

  if (isL25 && rootDom) {
    const refreshedRootFull = await refreshRootFullPagePrint(client, entry);
    workingEntry = {
      ...entry,
      tabs: rootDom.tabs?.length ? rootDom.tabs : entry.tabs,
      accordions: rootDom.accordions?.length ? rootDom.accordions : entry.accordions,
      scrollMetrics: rootDom.scrollMetrics ?? entry.scrollMetrics,
      screenshots: {
        viewport: entry.screenshots?.viewport ?? null,
        fullPage: refreshedRootFull.fullPage
      }
    };
    plan = planScreenExploration(workingEntry, opts.cliMaxStates);
  }

  const rootFingerprint = computeStateFingerprint({
    routeHash: rootDom?.routeHash || workingEntry.routeHash,
    fields: rootDom?.fields || workingEntry.fields,
    buttons: rootDom?.buttons || workingEntry.buttons,
    tables: rootDom?.tables || workingEntry.tables
  });
  const seenFingerprints = new Set<string>([rootFingerprint]);
  const subStates: ScreenSubState[] = [];
  const allSecurityAlerts: SubStateSecurityAlert[] = isL25 ? [...(workingEntry.level2SecurityAlerts ?? [])] : [];
  let hadFailure = false;

  // Em L2.5, preserva sub-estados já capturados no L2 e registra seus fingerprints
  const existingCapturedKeys = new Set<string>();
  const existingFormOpenersToCheckNested = new Map<string, ScreenSubState>();
  const existingTabsToRefreshFull: ScreenSubState[] = [];

  if (isL25 && Array.isArray(workingEntry.subStates)) {
    for (const prev of workingEntry.subStates) {
      if (prev.status === 'captured') {
        subStates.push(prev);
        if (prev.fingerprint) seenFingerprints.add(prev.fingerprint);
        existingCapturedKeys.add(`${prev.kind}::${normalizeControlText(prev.triggerLabel)}`);
        if ((prev.kind === 'form_opener' || prev.kind === 'modal_opener') && !(prev as any).nestedChecked) {
          existingFormOpenersToCheckNested.set(normalizeControlText(prev.triggerLabel), prev);
        }
        if (prev.kind === 'tab' && opts.refreshFullpage && !prev.screenshotHeight) {
          existingTabsToRefreshFull.push(prev);
        }
      }
    }
  }

  const pushSubState = (st: ScreenSubState, isAborted?: () => boolean) => {
    if (isAborted && isAborted()) return;
    subStates.push(st);
    if (st.securityAlerts?.length) allSecurityAlerts.push(...st.securityAlerts);
  };

  // Refresh full-page em abas pré-existentes quando solicitado explicitamente via --refresh-fullpage
  for (const prevTab of existingTabsToRefreshFull) {
    try {
      await runWithTimeout(timeoutMs, `${workingEntry.id}/refresh-tab/${prevTab.triggerLabel}`, async isAborted => {
        const clickRes = await clickControlSafelyInDom(client, 'tab', prevTab.triggerLabel);
        if (!clickRes.clicked || isAborted()) return;
        await waitForOrionLoaders(client, 2500);
        await client.wait(200);
        const tabSlug = slugify(prevTab.triggerLabel) || 'tab';
        const shotBundle = await saveCleanSubStatePrint(
          client,
          moduloSlug,
          `${workingEntry.id}-${workingEntry.slug}__tab-${tabSlug}.png`,
          true
        );
        if (shotBundle.screenshot) prevTab.screenshot = shotBundle.screenshot;
        prevTab.fullPageScreenshot = shotBundle.fullPageScreenshot;
        prevTab.screenshotHeight = shotBundle.screenshotHeight;
      });
    } catch {
      // mantém estado anterior em caso de timeout pontual
    }
  }

  // Re-verifica formulários/modais já capturados no L2 que ainda não passaram pela checagem de abas internas (nested_tab)
  if (isL25 && existingFormOpenersToCheckNested.size > 0) {
    for (const [normTrigger, prevSub] of existingFormOpenersToCheckNested.entries()) {
      const hasAnyNested = subStates.some(
        s => s.kind === 'nested_tab' && normalizeControlText(s.parentOpener) === normTrigger
      );
      if (hasAnyNested) {
        (prevSub as any).nestedChecked = true;
        continue;
      }

      try {
        await runWithTimeout(timeoutMs * 2, `${workingEntry.id}/nested/${prevSub.triggerLabel}`, async isAborted => {
          await readAndClearMutationAlerts(client, prevSub.triggerLabel);
          const clickRes = await clickControlSafelyInDom(client, 'button', prevSub.triggerLabel);
          if (!clickRes.clicked) {
            (prevSub as any).nestedChecked = true;
            return;
          }
          await waitForOrionLoaders(client, 2500);
          await client.wait(250);
          if (isAborted()) return;

          const alerts = await readAndClearMutationAlerts(client, `${prevSub.triggerLabel} (nested check)`);
          const dom = await extractDom(client);
          if (dom && alerts.length === 0) {
            // Se o extrator L2.5 encontrou abas/menus internos agora, salva também no prevSub.tabs e captura cada aba!
            if ((dom.tabs?.length ?? 0) > (prevSub.tabs?.length ?? 0)) {
              prevSub.tabs = dom.tabs;
            }
            const openerSlug = slugify(prevSub.triggerLabel) || 'open';
            // Atualiza fullPage do próprio formulário aberto se tiver overflow
            if (!prevSub.fullPageScreenshot && dom.scrollMetrics?.hasVerticalOverflow) {
              const bundle = await saveCleanSubStatePrint(
                client,
                moduloSlug,
                `${workingEntry.id}-${workingEntry.slug}__open-${openerSlug}.png`,
                true
              );
              if (bundle.fullPageScreenshot) prevSub.fullPageScreenshot = bundle.fullPageScreenshot;
              if (bundle.screenshotHeight) prevSub.screenshotHeight = bundle.screenshotHeight;
            }
            await exploreNestedTabsAndAccordions({
              client,
              entry: workingEntry,
              openerLabel: prevSub.triggerLabel,
              openerSlug,
              moduloSlug,
              initialDom: dom,
              seenFingerprints,
              subStates,
              pushSubState: st => pushSubState(st, isAborted),
              isAborted
            });
          }
          (prevSub as any).nestedChecked = true;
          const restored = await restoreCleanScreenState(client, workingEntry.routeHash).catch(() => false);
          if (restored) prevSub.restoredCleanly = true;
        });
      } catch {
        (prevSub as any).nestedChecked = true;
        await restoreCleanScreenState(client, workingEntry.routeHash).catch(() => undefined);
      }
    }
  }

  for (let i = 0; i < plan.actions.length; i++) {
    const action = plan.actions[i];
    const actionKey = `${action.kind}::${normalizeControlText(action.triggerLabel)}`;

    // Em --level25, pula ações já capturadas no L2 (considerando form_opener == modal_opener)
    if (isL25) {
      const altKey =
        action.kind === 'form_opener' ? `modal_opener::${normalizeControlText(action.triggerLabel)}` : actionKey;
      if (existingCapturedKeys.has(actionKey) || existingCapturedKeys.has(altKey)) {
        continue;
      }
    }

    if (subStates.filter(s => s.status === 'captured').length >= plan.maxStatesLimit) break;
    const subId = `${workingEntry.id}-s${String(subStates.length + 1).padStart(2, '0')}`;
    const actionSlug = slugify(action.triggerLabel) || `state-${i + 1}`;

    let pendingRestoreHash: string | null = null;
    try {
      await runWithTimeout(timeoutMs, `${workingEntry.id}/${action.triggerLabel}`, async isAborted => {
        // Limpa alertas anteriores antes da ação
        await readAndClearMutationAlerts(client, action.triggerLabel);
        if (isAborted()) return;

        if (action.kind === 'tab') {
          const clickRes = await clickControlSafelyInDom(client, 'tab', action.triggerLabel);
          if (!clickRes.clicked) {
            if (clickRes.blockedReason) {
              pushSubState({
                id: subId,
                kind: 'tab',
                triggerLabel: action.triggerLabel,
                openedAs: 'tab',
                routeHash: workingEntry.routeHash,
                fingerprint: '',
                screenshot: null,
                restoredCleanly: true,
                status: 'blocked_security',
                error: clickRes.blockedReason,
                buttons: [],
                fields: [],
                tabs: [],
                accordions: [],
                tables: [],
                alerts: [],
                capturedAt: new Date().toISOString()
              });
            }
            return;
          }
          await waitForOrionLoaders(client, 2500);
          await client.wait(200);
          if (isAborted()) return;

          const alerts = await readAndClearMutationAlerts(client, action.triggerLabel);
          const dom = await extractDom(client);
          if (!dom) throw new Error('DOM nulo após clicar aba');

          const fp = computeStateFingerprint({
            routeHash: dom.routeHash,
            activeTab: action.triggerLabel,
            fields: dom.fields,
            buttons: dom.buttons,
            tables: dom.tables
          });
          if (seenFingerprints.has(fp)) {
            pushSubState({
              id: subId,
              kind: 'tab',
              triggerLabel: action.triggerLabel,
              openedAs: 'tab',
              routeHash: dom.routeHash,
              activeTab: action.triggerLabel,
              fingerprint: fp,
              screenshot: null,
              restoredCleanly: true,
              status: alerts.length > 0 ? 'blocked_security' : 'no_op',
              error: alerts.length > 0 ? alerts[0].reason : null,
              buttons: dom.buttons as ScreenButtonInfo[],
              fields: dom.fields,
              tabs: dom.tabs,
              accordions: dom.accordions,
              tables: dom.tables,
              alerts: dom.alerts,
              ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
              capturedAt: new Date().toISOString()
            });
            return;
          }
          seenFingerprints.add(fp);

          const shotBundle = await saveCleanSubStatePrint(
            client,
            moduloSlug,
            `${workingEntry.id}-${workingEntry.slug}__tab-${actionSlug}.png`
          );
          pushSubState({
            id: subId,
            kind: 'tab',
            triggerLabel: action.triggerLabel,
            openedAs: 'tab',
            routeHash: dom.routeHash,
            activeTab: action.triggerLabel,
            fingerprint: fp,
            screenshot: shotBundle.screenshot,
            ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
            ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
            restoredCleanly: true,
            status: alerts.length > 0 ? 'blocked_security' : 'captured',
            error: alerts.length > 0 ? alerts[0].reason : null,
            buttons: dom.buttons as ScreenButtonInfo[],
            fields: dom.fields,
            tabs: dom.tabs,
            accordions: dom.accordions,
            tables: dom.tables,
            alerts: dom.alerts,
            ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
            capturedAt: new Date().toISOString()
          });

          // Expande accordions recolhidos dentro da aba recém-aberta
          for (const innerAcc of dom.accordions.filter(a => !a.expanded)) {
            if (subStates.filter(s => s.status === 'captured').length >= plan.maxStatesLimit) break;
            if (isBlockedByAntiMutation({ label: innerAcc.label }).blocked) continue;
            const beforeF = dom.fields;
            const beforeB = dom.buttons as ScreenButtonInfo[];
            const accClick = await clickControlSafelyInDom(client, 'accordion', innerAcc.label);
            if (!accClick.clicked) continue;
            await client.wait(350);
            const accAlerts = await readAndClearMutationAlerts(client, `${action.triggerLabel} > ${innerAcc.label}`);
            const accDom = await extractDom(client);
            if (!accDom) continue;
            const diff = diffFieldsAndButtons(beforeF, beforeB, accDom.fields, accDom.buttons as ScreenButtonInfo[]);
            if (diff.revealedFields.length === 0 && diff.revealedButtons.length === 0) continue;
            const accFp = computeStateFingerprint({
              routeHash: accDom.routeHash,
              activeTab: `${action.triggerLabel}::${innerAcc.label}`,
              fields: accDom.fields,
              buttons: accDom.buttons
            });
            if (seenFingerprints.has(accFp)) continue;
            seenFingerprints.add(accFp);
            const accSlug = slugify(innerAcc.label) || 'acc';
            const accBundle = await saveCleanSubStatePrint(
              client,
              moduloSlug,
              `${workingEntry.id}-${workingEntry.slug}__tab-${actionSlug}__acc-${accSlug}.png`
            );
            pushSubState({
              id: `${workingEntry.id}-s${String(subStates.length + 1).padStart(2, '0')}`,
              kind: 'accordion',
              triggerLabel: innerAcc.label,
              parentTab: action.triggerLabel,
              openedAs: 'accordion',
              routeHash: accDom.routeHash,
              activeTab: action.triggerLabel,
              fingerprint: accFp,
              screenshot: accBundle.screenshot,
              ...(accBundle.fullPageScreenshot ? { fullPageScreenshot: accBundle.fullPageScreenshot } : {}),
              ...(accBundle.screenshotHeight > 0 ? { screenshotHeight: accBundle.screenshotHeight } : {}),
              restoredCleanly: true,
              status: accAlerts.length > 0 ? 'blocked_security' : 'captured',
              error: accAlerts.length > 0 ? accAlerts[0].reason : null,
              buttons: diff.revealedButtons,
              fields: diff.revealedFields,
              tabs: accDom.tabs,
              accordions: accDom.accordions,
              tables: accDom.tables,
              alerts: accDom.alerts,
              revealedFieldsCount: diff.revealedFields.length,
              revealedButtonsCount: diff.revealedButtons.length,
              ...(accAlerts.length > 0 ? { securityAlerts: accAlerts } : {}),
              capturedAt: new Date().toISOString()
            });
          }
          return;
        }

        if (action.kind === 'accordion' || action.kind === 'advanced_filters') {
          const beforeDom = await extractDom(client);
          const beforeF = beforeDom?.fields ?? [];
          const beforeB = (beforeDom?.buttons ?? []) as ScreenButtonInfo[];
          const clickKind = action.kind === 'accordion' ? 'accordion' : 'button';
          const clickRes = await clickControlSafelyInDom(client, clickKind, action.triggerLabel);
          if (!clickRes.clicked) return;

          await waitForOrionLoaders(client, 3000);
          await client.wait(350);
          const alerts = await readAndClearMutationAlerts(client, action.triggerLabel);
          const afterDom = await extractDom(client);
          if (!afterDom) return;

          const diff = diffFieldsAndButtons(beforeF, beforeB, afterDom.fields, afterDom.buttons as ScreenButtonInfo[]);
          if (diff.revealedFields.length === 0 && diff.revealedButtons.length === 0) {
            return; // Regra: salvar print somente se revelou campos ou botões
          }

          const fp = computeStateFingerprint({
            routeHash: afterDom.routeHash,
            activeTab: action.triggerLabel,
            fields: afterDom.fields,
            buttons: afterDom.buttons
          });
          if (seenFingerprints.has(fp)) return;
          seenFingerprints.add(fp);

          const prefix = action.kind === 'accordion' ? 'acc' : 'filter';
          if (isAborted()) return;
          const shotBundle = await saveCleanSubStatePrint(
            client,
            moduloSlug,
            `${workingEntry.id}-${workingEntry.slug}__${prefix}-${actionSlug}.png`
          );
          pushSubState(
            {
              id: subId,
              kind: action.kind,
              triggerLabel: action.triggerLabel,
              openedAs: 'accordion',
              routeHash: afterDom.routeHash,
              fingerprint: fp,
              screenshot: shotBundle.screenshot,
              ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
              ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
              restoredCleanly: true,
              status: alerts.length > 0 ? 'blocked_security' : 'captured',
              error: alerts.length > 0 ? alerts[0].reason : null,
              buttons: diff.revealedButtons,
              fields: diff.revealedFields,
              tabs: afterDom.tabs,
              accordions: afterDom.accordions,
              tables: afterDom.tables,
              alerts: afterDom.alerts,
              revealedFieldsCount: diff.revealedFields.length,
              revealedButtonsCount: diff.revealedButtons.length,
              ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
              capturedAt: new Date().toISOString()
            },
            isAborted
          );
          return;
        }

        if (action.kind === 'view_switcher') {
          const clickRes = await clickControlSafelyInDom(client, 'button', action.triggerLabel);
          if (!clickRes.clicked) return;

          await waitForOrionLoaders(client, 2500);
          await client.wait(250);
          if (isAborted()) return;

          const alerts = await readAndClearMutationAlerts(client, action.triggerLabel);
          const dom = await extractDom(client);
          if (!dom || isAborted()) return;

          const fp = computeStateFingerprint({
            routeHash: dom.routeHash,
            activeTab: `view:${action.triggerLabel}`,
            fields: dom.fields,
            buttons: dom.buttons,
            tables: dom.tables
          });
          const isDup = seenFingerprints.has(fp);
          if (!isDup) seenFingerprints.add(fp);

          if (isAborted()) return;
          const shotBundle =
            !isDup && alerts.length === 0
              ? await saveCleanSubStatePrint(client, moduloSlug, `${workingEntry.id}-${workingEntry.slug}__view-${actionSlug}.png`)
              : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };

          if (isAborted()) return;
          if (dom.routeHash && dom.routeHash !== workingEntry.routeHash) {
            pendingRestoreHash = workingEntry.routeHash;
          }

          pushSubState(
            {
              id: subId,
              kind: 'view_switcher',
              triggerLabel: action.triggerLabel,
              openedAs: 'view_switch',
              routeHash: dom.routeHash || workingEntry.routeHash,
              fingerprint: fp,
              screenshot: shotBundle.screenshot,
              ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
              ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
              restoredCleanly: true,
              status: alerts.length > 0 ? 'blocked_security' : isDup ? 'no_op' : 'captured',
              error: alerts.length > 0 ? alerts[0].reason : null,
              buttons: dom.buttons as ScreenButtonInfo[],
              fields: dom.fields,
              tabs: dom.tabs,
              accordions: dom.accordions,
              tables: dom.tables,
              alerts: dom.alerts,
              ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
              capturedAt: new Date().toISOString()
            },
            isAborted
          );
          return;
        }

        if (action.kind === 'form_opener' || action.kind === 'modal_opener') {
          const clickRes = await clickControlSafelyInDom(client, 'button', action.triggerLabel);
          if (!clickRes.clicked) return;

          await waitForOrionLoaders(client, 2500);
          await client.wait(200);
          if (isAborted()) return;

          const alerts = await readAndClearMutationAlerts(client, action.triggerLabel);
          const modalsOpen = await countActiveModals(client).catch(() => 0);
          const dom = await extractDom(client);
          let openedTab = false;
          if (modalsOpen === 0 && (!dom || dom.routeHash === workingEntry.routeHash)) {
            const tabsList = await client.listTabs().catch(() => []);
            openedTab = tabsList.length > 1;
          }
          const openedAs: SubStateOpenedAs = openedTab
            ? 'new_tab'
            : modalsOpen > 0 || dom?.openedAsModal
              ? 'modal'
              : dom && dom.routeHash !== workingEntry.routeHash
                ? 'sub_route'
                : 'same_route';

          const modalTitle = modalsOpen > 0 ? dom?.headings?.[0] || dom?.pageTitle || action.triggerLabel : undefined;
          const fp = computeStateFingerprint({
            routeHash: dom?.routeHash || '',
            modalTitle,
            fields: dom?.fields || [],
            buttons: dom?.buttons || []
          });

          const isDup = seenFingerprints.has(fp);
          if (!isDup) seenFingerprints.add(fp);

          if (isAborted()) return;
          const shotBundle =
            !isDup && alerts.length === 0
              ? await saveCleanSubStatePrint(client, moduloSlug, `${workingEntry.id}-${workingEntry.slug}__open-${actionSlug}.png`)
              : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };

          if (isAborted()) return;
          pendingRestoreHash = workingEntry.routeHash;

          const openerSub: ScreenSubState & { nestedChecked?: boolean } = {
            id: subId,
            kind: openedAs === 'modal' ? 'modal_opener' : 'form_opener',
            triggerLabel: action.triggerLabel,
            openedAs,
            routeHash: dom?.routeHash || workingEntry.routeHash,
            ...(modalTitle ? { modalTitle } : {}),
            fingerprint: fp,
            screenshot: shotBundle.screenshot,
            ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
            ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
            restoredCleanly: true,
            status: alerts.length > 0 ? 'blocked_security' : isDup ? 'no_op' : 'captured',
            error: alerts.length > 0 ? alerts[0].reason : null,
            buttons: (dom?.buttons ?? []) as ScreenButtonInfo[],
            fields: dom?.fields ?? [],
            tabs: dom?.tabs ?? [],
            accordions: dom?.accordions ?? [],
            tables: dom?.tables ?? [],
            alerts: dom?.alerts ?? [],
            ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
            capturedAt: new Date().toISOString()
          };
          pushSubState(openerSub, isAborted);

          if (!isDup && alerts.length === 0 && dom && !isAborted()) {
            await exploreNestedTabsAndAccordions({
              client,
              entry: workingEntry,
              openerLabel: action.triggerLabel,
              openerSlug: actionSlug,
              moduloSlug,
              initialDom: dom,
              seenFingerprints,
              subStates,
              pushSubState: st => pushSubState(st, isAborted),
              isAborted
            });
            openerSub.nestedChecked = true;
          }
          return;
        }

        if (action.kind === 'search_grid_reveal') {
          // Confere no DOM vivo se há campo obrigatório vazio
          const hasEmptyRequired = await client
            .evalJson<boolean>(`
              (() => {
                const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
                const reqs = Array.from(document.querySelectorAll('input[required], select[required], textarea[required], [aria-required="true"]')).filter(vis);
                return JSON.stringify(reqs.some(el => !el.disabled && !String(el.value || '').trim()));
              })()
            `)
            .catch(() => false);
          if (hasEmptyRequired || isAborted()) return;

          const clickRes = await clickControlSafelyInDom(client, 'search', action.triggerLabel);
          if (!clickRes.clicked) return;

          await waitForOrionLoaders(client, 2500);
          await client.wait(250);
          if (isAborted()) return;

          const alerts = await readAndClearMutationAlerts(client, action.triggerLabel);
          const dom = await extractDom(client);
          if (!dom || isAborted()) return;

          const populatedTable = dom.tables.find(t => t.rowCount > 0);
          const rowCount = populatedTable?.rowCount ?? 0;
          const rowActionIcons = populatedTable?.rowActionIcons ?? [];
          const fp = computeStateFingerprint({
            routeHash: dom.routeHash,
            fields: dom.fields,
            tables: dom.tables
          });
          const isDup = seenFingerprints.has(fp);
          if (!isDup) seenFingerprints.add(fp);

          if (isAborted()) return;
          const shotBundle =
            !isDup && alerts.length === 0
              ? await saveCleanSubStatePrint(client, moduloSlug, `${workingEntry.id}-${workingEntry.slug}__grid-reveal.png`)
              : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };

          pushSubState(
            {
              id: subId,
              kind: 'search_grid_reveal',
              triggerLabel: action.triggerLabel,
              openedAs: 'grid_reveal',
              routeHash: dom.routeHash,
              fingerprint: fp,
              screenshot: shotBundle.screenshot,
              ...(shotBundle.fullPageScreenshot ? { fullPageScreenshot: shotBundle.fullPageScreenshot } : {}),
              ...(shotBundle.screenshotHeight > 0 ? { screenshotHeight: shotBundle.screenshotHeight } : {}),
              restoredCleanly: true,
              status: alerts.length > 0 ? 'blocked_security' : isDup ? 'no_op' : 'captured',
              error: alerts.length > 0 ? alerts[0].reason : null,
              buttons: dom.buttons as ScreenButtonInfo[],
              fields: dom.fields,
              tabs: dom.tabs,
              accordions: dom.accordions,
              tables: dom.tables,
              alerts: dom.alerts,
              rowCount,
              rowActionIcons,
              ...(alerts.length > 0 ? { securityAlerts: alerts } : {}),
              capturedAt: new Date().toISOString()
            },
            isAborted
          );

          // Opcional: abrir 1ª linha somente via Visualizar/Detalhes/fa-eye (nunca excluir/cancelar)
          if (rowCount > 0 && alerts.length === 0) {
            const eyeClick = await clickControlSafelyInDom(client, 'row_eye', 'Visualizar');
            if (eyeClick.clicked) {
              await waitForOrionLoaders(client, 4000);
              await client.wait(400);
              const rowAlerts = await readAndClearMutationAlerts(client, 'grid_row_eye');
              const rowDom = await extractDom(client);
              const modalsOpen = await countActiveModals(client).catch(() => 0);
              const rowFp = computeStateFingerprint({
                routeHash: rowDom?.routeHash || '',
                modalTitle: rowDom?.headings?.[0] || 'grid_row_open',
                fields: rowDom?.fields || [],
                buttons: rowDom?.buttons || []
              });
              if (!seenFingerprints.has(rowFp)) {
                seenFingerprints.add(rowFp);
                const rowShotBundle =
                  rowAlerts.length === 0
                    ? await saveCleanSubStatePrint(
                        client,
                        moduloSlug,
                        `${workingEntry.id}-${workingEntry.slug}__grid-row-open.png`
                      )
                    : { screenshot: null, fullPageScreenshot: null, screenshotHeight: 0 };
                const rowSub: ScreenSubState = {
                  id: `${workingEntry.id}-s${String(subStates.length + 1).padStart(2, '0')}`,
                  kind: 'modal_opener',
                  triggerLabel: eyeClick.detail || 'Visualizar (1ª linha)',
                  openedAs: modalsOpen > 0 ? 'modal' : 'sub_route',
                  routeHash: rowDom?.routeHash || workingEntry.routeHash,
                  fingerprint: rowFp,
                  screenshot: rowShotBundle.screenshot,
                  ...(rowShotBundle.fullPageScreenshot ? { fullPageScreenshot: rowShotBundle.fullPageScreenshot } : {}),
                  ...(rowShotBundle.screenshotHeight > 0 ? { screenshotHeight: rowShotBundle.screenshotHeight } : {}),
                  restoredCleanly: true,
                  status: rowAlerts.length > 0 ? 'blocked_security' : 'captured',
                  error: rowAlerts.length > 0 ? rowAlerts[0].reason : null,
                  buttons: (rowDom?.buttons ?? []) as ScreenButtonInfo[],
                  fields: rowDom?.fields ?? [],
                  tabs: rowDom?.tabs ?? [],
                  accordions: rowDom?.accordions ?? [],
                  tables: rowDom?.tables ?? [],
                  alerts: rowDom?.alerts ?? [],
                  ...(rowAlerts.length > 0 ? { securityAlerts: rowAlerts } : {}),
                  capturedAt: new Date().toISOString()
                };
                pushSubState(rowSub);
                if (rowAlerts.length === 0 && rowDom) {
                  await exploreNestedTabsAndAccordions({
                    client,
                    entry: workingEntry,
                    openerLabel: rowSub.triggerLabel,
                    openerSlug: slugify(rowSub.triggerLabel) || 'grid-row',
                    moduloSlug,
                    initialDom: rowDom,
                    seenFingerprints,
                    subStates,
                    pushSubState: st => pushSubState(st, isAborted),
                    isAborted
                  });
                }
                rowSub.restoredCleanly = await restoreCleanScreenState(client, workingEntry.routeHash);
              } else {
                await restoreCleanScreenState(client, workingEntry.routeHash);
              }
            }
          }
        }
      });
    } catch (err: any) {
      hadFailure = true;
      const errMsg = String(err?.message || err || 'Erro desconhecido no sub-estado');
      pushSubState({
        id: subId,
        kind: action.kind,
        triggerLabel: action.triggerLabel,
        openedAs: 'same_route',
        routeHash: entry.routeHash,
        fingerprint: '',
        screenshot: null,
        restoredCleanly: false,
        status: 'failed',
        error: errMsg,
        buttons: [],
        fields: [],
        tabs: [],
        accordions: [],
        tables: [],
        alerts: [],
        capturedAt: new Date().toISOString()
      });

      // Recovery para #/inicio e reabertura da tela
      await closeActiveModals(client).catch(() => undefined);
      await client.closeSecondaryTabs().catch(() => undefined);
      await client.jumpHash('#/inicio').catch(() => undefined);
      await client.wait(400);
      await navigateToScreen(client, workingEntry, getMenuItems).catch(() => false);
    }
    if (pendingRestoreHash !== null) {
      const restored = await restoreCleanScreenState(client, pendingRestoreHash).catch(() => false);
      const openerSubs = subStates.filter(
        s => s.kind === 'form_opener' || s.kind === 'modal_opener' || s.kind === 'view_switcher'
      );
      const lastOpener = openerSubs[openerSubs.length - 1];
      if (lastOpener) lastOpener.restoredCleanly = restored;
    }
  }

  const capturedCount = subStates.filter(s => s.status === 'captured').length;
  const level2Status: Level2Status =
    hadFailure && capturedCount > 0
      ? 'partial'
      : hadFailure && capturedCount === 0
        ? 'failed'
        : subStates.length === 0
          ? 'no_substates'
          : 'explored';

  const enriched = enrichScreenWithLevel2(workingEntry, {
    level2Status,
    subStates,
    securityAlerts: allSecurityAlerts
  });
  if (isL25) {
    (enriched as any).level25CompletedAt = new Date().toISOString();
  }
  return enriched;
}

export async function runLevel2Mapping(argv = process.argv.slice(2)): Promise<OrionScreenCatalog> {
  const cli = parseLevel2CliFlags(argv);
  const isL25 = Boolean(cli.level25);
  const effectiveTimeoutMs = isL25 && cli.timeoutMs === 12000 ? 25000 : cli.timeoutMs;
  console.log(
    isL25
      ? '=== Mapeamento de Telas Nível 2.5 — Orion TN 06.05.02 (Fechamento Cirúrgico) ==='
      : '=== Mapeamento de Telas Nível 2 — Orion TN 06.05.02 (Exploração Segura) ==='
  );

  const catalog = readCatalog(DEFAULT_SCREEN_CATALOG_PATH);
  const selected = filterCatalogEntriesForLevel2(catalog.screens, {
    module: cli.module,
    only: cli.only,
    resume: cli.resume,
    level25: isL25
  });

  const plans = selected.map(s => planScreenExploration(s, cli.maxStatesPerScreen));
  const eligiblePlans = plans.filter(p => p.eligible || isL25);

  if (cli.dryRunPlan) {
    const labelMode = isL25 ? 'DRY-RUN PLAN L2.5' : 'DRY-RUN PLAN';
    console.log(`\n[${labelMode}] Telas selecionadas: ${selected.length} | Elegíveis: ${eligiblePlans.length}\n`);
    const byMod = new Map<string, Array<{ entry: ScreenCatalogEntry; plan: ScreenExplorationPlan }>>();
    for (let i = 0; i < selected.length; i++) {
      const p = plans[i];
      const s = selected[i];
      if (!p.eligible && !isL25) continue;
      if (s.status === 'skipped') continue;
      const list = byMod.get(p.modulo) ?? [];
      list.push({ entry: s, plan: p });
      byMod.set(p.modulo, list);
    }
    for (const [mod, modItems] of byMod.entries()) {
      const totalClicks = modItems.reduce((acc, item) => acc + item.plan.actions.length, 0);
      console.log(`## ${mod} (${modItems.length} telas, ${totalClicks} ações totais no plano)`);
      for (const { entry, plan: p } of modItems) {
        const existingKeys = new Set(
          (entry.subStates ?? [])
            .filter(st => st.status === 'captured')
            .map(st => `${st.kind}::${normalizeControlText(st.triggerLabel)}`)
        );
        const newActions = isL25
          ? p.actions.filter(a => {
              const k = `${a.kind}::${normalizeControlText(a.triggerLabel)}`;
              const alt = a.kind === 'form_opener' ? `modal_opener::${normalizeControlText(a.triggerLabel)}` : k;
              return !existingKeys.has(k) && !existingKeys.has(alt);
            })
          : p.actions;
        const formReopen = isL25
          ? (entry.subStates ?? []).filter(
              st => st.status === 'captured' && (st.kind === 'form_opener' || st.kind === 'modal_opener') && !(st as any).nestedChecked
            ).length
          : 0;
        if (isL25 && newActions.length === 0 && formReopen === 0 && !entry.screenshots?.fullPage) continue;
        console.log(
          `  - ${p.screenId} ${p.chain.join(' > ')} [novas=${newActions.length}, nestedCheck=${formReopen}, rootFullCheck=${Boolean(entry.screenshots?.fullPage)}]:`
        );
        for (const a of newActions) {
          console.log(`      * [${a.kind}] "${a.triggerLabel}" (${a.reason})`);
        }
      }
    }
    return catalog;
  }

  console.log(
    `Telas selecionadas: ${selected.length} | Elegíveis: ${eligiblePlans.length} | Sem sub-estados: ${selected.length - eligiblePlans.length} (timeout=${cli.timeoutMs}ms)`
  );

  let entries = catalog.screens.slice();
  const needBrowser = eligiblePlans.length > 0;
  let client: AgentBrowserClient | null = null;

  let cachedMenuItems: MenuTreeItem[] | null = null;
  const getMenuItems = async (forceRefresh = false): Promise<MenuTreeItem[]> => {
    if (!forceRefresh && cachedMenuItems && cachedMenuItems.length > 0) {
      const sampleSel = cachedMenuItems[0]?.selectors?.[0];
      if (sampleSel) {
        const alive = await client!
          .evalJson<boolean>(`JSON.stringify(Boolean(document.querySelector(${JSON.stringify(sampleSel)})))`)
          .catch(() => false);
        if (alive) return cachedMenuItems;
      }
    }
    cachedMenuItems = parseMenuTreeResponse(await client!.eval(buildMenuTreeScript()));
    return cachedMenuItems;
  };

  if (needBrowser) {
    await preflightOrionReachability();
    client = new AgentBrowserClient({
      headless: config.headless,
      sessionId: isL25 ? 'screens-map-l25' : 'screens-map-l2',
      deviceScaleFactor: 1,
      zoom: config.browserZoom
    });
    const authed = await ensureAuthenticated(client);
    if (!authed) {
      throw new Error('Falha na autenticação WildFly SSO antes do mapeamento Nível 2.');
    }
    const viewportCorrected = await client.ensureViewport(config.viewportWidth, config.viewportHeight);
    if (viewportCorrected) {
      await client.applyZoom(config.browserZoom);
    }
    await client.markPrimaryTab();
    await client.jumpHash('#/inicio');
    await waitForOrionLoaders(client, 4000);
    await client.eval(buildL2MutationMonitorInitScript()).catch(() => undefined);
    await getMenuItems(true);
  }

  try {
    for (let i = 0; i < selected.length; i++) {
      const entry = selected[i];
      const plan = plans[i];

      if (entry.status === 'skipped') {
        continue;
      }

      if (!plan.eligible && !isL25) {
        const enriched = enrichScreenWithLevel2(entry, {
          level2Status: 'no_substates',
          subStates: []
        });
        entries = mergeCatalogEntries(entries, [enriched]);
        writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, catalog.stats.totalCanonicalPaths);
        console.log(`[${i + 1}/${selected.length}] ${entry.id} ${entry.chain.join(' > ')} -> no_substates`);
        continue;
      }

      console.log(
        `[${i + 1}/${selected.length}] ${entry.id} ${entry.chain.join(' > ')} (${plan.actions.length} ações no plano${isL25 ? ' [L2.5]' : ''})`
      );
      const updated = await exploreSingleScreenLevel2(client!, entry, plan, effectiveTimeoutMs, getMenuItems, {
        level25: isL25,
        refreshFullpage: cli.refreshFullpage,
        cliMaxStates: cli.maxStatesPerScreen
      });
      entries = mergeCatalogEntries(entries, [updated]);
      writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, catalog.stats.totalCanonicalPaths);

      const capturedSubs = (updated.subStates ?? []).filter(s => s.status === 'captured').length;
      const alertsCount = updated.level2SecurityAlerts?.length ?? 0;
      console.log(
        `  ✓ ${updated.level2Status} | subStates=${capturedSubs}/${updated.subStates?.length ?? 0} | rootFull=${Boolean(updated.screenshots?.fullPage)} | alerts=${alertsCount}`
      );
    }
  } finally {
    if (client) {
      await client.closeSecondaryTabs().catch(() => undefined);
      await closeActiveModals(client).catch(() => undefined);
      await client.close().catch(() => undefined);
    }
  }

  const finalCatalog = writeCatalogCheckpoint(DEFAULT_SCREEN_CATALOG_PATH, entries, catalog.stats.totalCanonicalPaths);
  console.log(
    `=== ${isL25 ? 'Nível 2.5' : 'Nível 2'} Concluído: explored=${finalCatalog.stats.level2?.explored ?? 0}, no_substates=${finalCatalog.stats.level2?.noSubstates ?? 0}, partial=${finalCatalog.stats.level2?.partial ?? 0}, alerts=${finalCatalog.stats.level2?.securityAlertsCount ?? 0} ===`
  );
  return finalCatalog;
}

const isMainModule =
  typeof process.argv[1] === 'string' &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  runLevel2Mapping().catch(err => {
    console.error('Erro fatal no mapeamento Nível 2:', err);
    process.exitCode = 1;
  });
}
