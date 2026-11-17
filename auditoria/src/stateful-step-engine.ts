import type { AgentBrowserClient } from './browser.js';
import {
  classifyFirmasStep,
  isReconhecimentoFirmasUrl,
  resolveFirmasStep
} from './firmas-interactive.js';
import { getRoutineHumanGuidance, resolveMenuPathViaHumanReview } from './human-review-rag.js';
import { extractMenuPaths } from './menu-path.js';
import { normalizeText } from './smart-locator.js';
import type {
  DOMCallout,
  DOMResolvedGeometry,
  RoutineStep,
  SmartLocatorResult
} from './types.js';

export interface DOMGridSummary {
  headers: string[];
  rowCount: number;
  hasRowPicker: boolean;
}

export interface DOMStateSnapshot {
  url: string;
  sections: string[];
  grids: DOMGridSummary[];
  buttons: string[];
  inputs: string[];
}

export interface DOMStateDiff {
  urlChanged: boolean;
  newSections: string[];
  appearedButtons: string[];
  appearedInputs: string[];
  populatedGridWithPicker: boolean;
  hasReactiveChange: boolean;
}

export type StatefulStepKind =
  | 'guided_sidebar_subportal'
  | 'search_and_pick'
  | 'master_detail_subform'
  | 'delegated_firmas';

export interface StatefulStepPlan {
  kind: StatefulStepKind;
  searchQuery?: string;
  postMenuSidebarItem?: string;
  postSidebarSubportalLink?: string;
  triggerHint?: string;
  reason: string;
}

export interface StatefulResolveResult {
  kind: StatefulStepKind;
  locResult: SmartLocatorResult;
  adjusted?: boolean;
  note?: string;
  skipStandardAction?: boolean;
}

export interface StatefulPostStepResult {
  executed: boolean;
  adjusted?: boolean;
  note?: string;
  openedTab?: { tabId: string; url: string; title: string };
}

export type StatefulAddSubFrame = (
  rawPath: string,
  geometry: DOMResolvedGeometry,
  frameCallouts: DOMCallout[],
  captureKind: 'step' | 'trigger' | 'reveal' | 'post-action'
) => Promise<string>;

async function currentUrl(client: AgentBrowserClient): Promise<string> {
  try {
    return (await client.evalJson<string>('JSON.stringify(window.location.href || "")')) || '';
  } catch {
    return '';
  }
}

/**
 * Captura um snapshot estrutural leve dos nós visíveis de conteúdo no DOM para permitir
 * comparação Antes × Depois (DOM Diffing, ADR-027) sem depender de seletores fixos por módulo.
 */
export async function captureDOMStateSnapshot(client: AgentBrowserClient): Promise<DOMStateSnapshot> {
  const snap = await client.evalJson<DOMStateSnapshot>(`
    (() => {
      const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral';
      const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
      const vis = el => {
        if (!el || !el.getBoundingClientRect) return false;
        const st = window.getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      };
      const uniq = arr => Array.from(new Set(arr.filter(Boolean)));

      const sections = uniq(
        Array.from(document.querySelectorAll('legend, .panel-heading, .card-header, .box-header, .modal-title, h3, h4, h5'))
          .filter(el => vis(el) && !el.closest(navSel))
          .map(el => clean(el.innerText || el.textContent))
      );

      const grids = Array.from(document.querySelectorAll('table'))
        .filter(t => vis(t) && !t.closest(navSel))
        .map(t => {
          const headers = Array.from(t.querySelectorAll('thead th, tr:first-child th'))
            .map(th => clean(th.innerText || th.textContent))
            .filter(Boolean);
          const bodyRows = Array.from(t.querySelectorAll('tbody tr')).filter(vis);
          const hasRowPicker = bodyRows.some(
            r => !!r.querySelector('.glyphicon-plus, .fa-plus, [id*="Seleciona" i], button[title*="Selecionar" i], a[title*="Selecionar" i]')
          );
          return { headers, rowCount: bodyRows.length, hasRowPicker };
        });

      const buttons = uniq(
        Array.from(document.querySelectorAll('button, a.btn, div.btn, .btn, [role="button"], input[type="submit"], input[type="button"]'))
          .filter(el => vis(el) && !el.closest(navSel))
          .map(el => clean(el.innerText || el.textContent || el.getAttribute('value') || el.getAttribute('title') || ''))
      );

      const inputs = uniq(
        Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'))
          .filter(el => vis(el) && !el.closest(navSel))
          .map(el => {
            const lbl = el.labels && el.labels[0] ? clean(el.labels[0].innerText || el.labels[0].textContent) : '';
            return lbl || clean(el.getAttribute('placeholder') || el.getAttribute('name') || el.id || '');
          })
      );

      return JSON.stringify({
        url: window.location.href || '',
        sections,
        grids,
        buttons,
        inputs
      });
    })()
  `);
  return (
    snap || {
      url: '',
      sections: [],
      grids: [],
      buttons: [],
      inputs: []
    }
  );
}

/** Calcula a diferença reativa do DOM entre os estados Antes e Depois (função pura para testes e motor). */
export function diffDOMStateSnapshots(before: DOMStateSnapshot, after: DOMStateSnapshot): DOMStateDiff {
  const beforeSecs = new Set(before.sections.map(s => normalizeText(s)));
  const beforeBtns = new Set(before.buttons.map(s => normalizeText(s)));
  const beforeInputs = new Set(before.inputs.map(s => normalizeText(s)));

  const newSections = after.sections.filter(s => !beforeSecs.has(normalizeText(s)));
  const appearedButtons = after.buttons.filter(b => !beforeBtns.has(normalizeText(b)));
  const appearedInputs = after.inputs.filter(i => !beforeInputs.has(normalizeText(i)));

  const populatedGridWithPicker = after.grids.some(ag => {
    if (ag.rowCount <= 0 || !ag.hasRowPicker) return false;
    const headerKey = ag.headers.map(h => normalizeText(h)).join('|');
    const prev = before.grids.find(bg => bg.headers.map(h => normalizeText(h)).join('|') === headerKey);
    return !prev || prev.rowCount === 0 || (!prev.hasRowPicker && ag.hasRowPicker);
  });

  const urlChanged = before.url !== after.url;
  return {
    urlChanged,
    newSections,
    appearedButtons,
    appearedInputs,
    populatedGridWithPicker,
    hasReactiveChange:
      urlChanged || newSections.length > 0 || appearedButtons.length > 0 || appearedInputs.length > 0 || populatedGridWithPicker
  };
}

/**
 * Detector universal de passos produtores de estado em qualquer módulo do Orion TN.
 * Considera: (1) diretrizes de revisão humana (sidebar + subportal), (2) instruções de busca/filtro
 * quando o passo atual ou o seguinte espera resultado na tela, e (3) fluxos mestre-detalhe.
 */
export function detectStatefulStepPlan(
  step: RoutineStep,
  nextStep?: RoutineStep,
  opts: { currentUrl?: string } = {}
): StatefulStepPlan | null {
  const paths = extractMenuPaths(step);
  if (paths.length > 0) {
    for (const p of paths) {
      const guide = resolveMenuPathViaHumanReview(step.routineId, p.segments);
      if (guide?.postMenuSidebarItem) {
        return {
          kind: 'guided_sidebar_subportal',
          postMenuSidebarItem: guide.postMenuSidebarItem,
          postSidebarSubportalLink: guide.postSidebarSubportalLink,
          reason: guide.reason
        };
      }
    }
    return null;
  }

  const guidance = getRoutineHumanGuidance(step.routineId);
  const norm = normalizeText([step.rawText, ...(step.subItems || [])].join(' '));
  const nextNorm = nextStep ? normalizeText([nextStep.rawText, ...(nextStep.subItems || [])].join(' ')) : '';

  // Fluxo explícito de pesquisa/seleção apontado na revisão humana da rotina
  if (guidance && guidance.searchFlowSteps.includes(step.stepNumber)) {
    return {
      kind: 'search_and_pick',
      searchQuery: 'teste',
      reason: `Passo ${step.stepNumber} marcado pela revisão humana como fluxo interativo de busca e seleção`
    };
  }

  // Tela de Firmas delegada via especialista quando aplicável
  if (isReconhecimentoFirmasUrl(opts.currentUrl)) {
    const firmasKind = classifyFirmasStep(step);
    if (firmasKind === 'search_person') {
      return { kind: 'search_and_pick', searchQuery: 'teste', reason: 'Busca interativa em Reconhecimento de firmas' };
    }
    if (firmasKind) {
      return { kind: 'delegated_firmas', reason: `Etapa mestre-detalhe ${firmasKind} em Reconhecimento de firmas` };
    }
  }

  // Detecção universal por intenção de busca/filtro quando o passo seguinte consome o estado gerado
  const hasSearchVerb = /\b(pesquis|busc|filt|localiz|consult)/.test(norm);
  const hasEntityField = /\b(nome|cpf|cnpj|protocolo|numero|cartao|titulo|descricao|pessoa|parte)\b/.test(norm);
  const nextConsumesState =
    /\b(o sistema exibira|selecione|na grade|nomes encontrados|partes encontradas|cartao|assinatura|ficha|servicos realizados|preencha os dados)/.test(
      nextNorm
    );

  if (
    hasSearchVerb &&
    hasEntityField &&
    nextConsumesState &&
    !/\b(salvar|gravar|concluir|excluir|inativar|enviar ao caixa|impressao|imprimir)\b/.test(norm)
  ) {
    return {
      kind: 'search_and_pick',
      searchQuery: 'teste',
      reason: 'Passo produtor de estado detectado universalmente pelo verbo de busca e dependência no passo seguinte'
    };
  }

  return null;
}

/**
 * Resolve o alvo inicial de passos interativos estatais antes do SmartLocator genérico.
 */
export async function resolveStatefulStep(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  nextStep?: RoutineStep
): Promise<StatefulResolveResult | null> {
  const url = await currentUrl(client);
  if (isReconhecimentoFirmasUrl(url)) {
    const res = await resolveFirmasStep(client, step, rawScreenshotPath);
    if (res) {
      return {
        kind: res.kind === 'search_person' ? 'search_and_pick' : 'delegated_firmas',
        locResult: res.locResult,
        adjusted: res.adjusted,
        note: res.note,
        skipStandardAction: res.skipStandardAction
      };
    }
  }

  const plan = detectStatefulStepPlan(step, nextStep, { currentUrl: url });
  if (plan?.kind === 'search_and_pick') {
    // Tenta localizar o primeiro input de pesquisa/filtro visível na seção de conteúdo para ancorar passo-NN.png
    const targetInputSelector = await client.evalJson<string | null>(`
      (() => {
        const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral';
        const vis = el => {
          if (!el || !el.getBoundingClientRect) return false;
          const st = window.getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        };
        const candidates = Array.from(document.querySelectorAll('input[type="text"], input:not([type]), input[type="search"]'))
          .filter(el => vis(el) && !el.closest(navSel) && !el.disabled && !el.readOnly);
        const preferred = candidates.find(el => /nome|cpf|pesquis|busc|filtro|descri/i.test((el.id || '') + ' ' + (el.getAttribute('placeholder') || ''))) || candidates[0];
        if (!preferred) return JSON.stringify(null);
        preferred.setAttribute('data-orion-stateful-search', '');
        return JSON.stringify('[data-orion-stateful-search]');
      })()
    `);
    if (targetInputSelector) {
      const geom = await client.getDOMGeometry([targetInputSelector], { scrollIntoView: true, zone: 'content' });
      if (geom) {
        await client.screenshot(rawScreenshotPath);
        return {
          kind: 'search_and_pick',
          skipStandardAction: true,
          locResult: {
            found: true,
            healed: false,
            geometry: geom,
            matchedTargetName: geom.context.innerText || step.targets[0] || 'Pesquisa'
          }
        };
      }
    }
  }

  return null;
}

async function stampByTextAndMeasure(
  client: AgentBrowserClient,
  targets: Array<{ label: string; selector?: string; textMatch?: string; inSidebar?: boolean }>,
  zone: 'any' | 'content'
): Promise<{ geometry: DOMResolvedGeometry | null; selectors: Array<{ label: string; selector: string }> }> {
  const stamped = await client.evalJson<Array<{ label: string; selector: string }>>(`
    (() => {
      const items = ${JSON.stringify(targets)};
      const tok = 'st' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
      for (const prev of window.__orionStatefulStamps || []) {
        try { prev[0].removeAttribute(prev[1]); } catch (e) {}
      }
      window.__orionStatefulStamps = [];
      const topNav = 'header, nav.navbar, .navbar-fixed-top, #navbar';
      const norm = s => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const vis = el => {
        if (!el || !el.getBoundingClientRect) return false;
        const st = window.getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      };
      const out = [];
      let i = 0;
      for (const t of items) {
        let el = null;
        if (t.selector) {
          el = Array.from(document.querySelectorAll(t.selector)).find(vis);
        }
        if (!el && t.textMatch) {
          const want = norm(t.textMatch);
          const pool = Array.from(document.querySelectorAll('a, button, span, h3, h4, h5, li > a'))
            .filter(e => vis(e) && !e.closest(topNav))
            .filter(e => t.inSidebar ? true : !e.closest('aside, .sidebar, .nav-stacked, .menu-lateral'));
          const exact = pool.filter(e => norm(e.innerText || e.textContent) === want);
          const partial = exact.length > 0 ? exact : pool.filter(e => norm(e.innerText || e.textContent).includes(want));
          if (partial.length > 0) {
            partial.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
            el = partial[0];
          }
        }
        if (el) {
          const attr = 'data-orion-stateful-' + tok + '-' + (i++);
          el.setAttribute(attr, '');
          window.__orionStatefulStamps.push([el, attr]);
          out.push({ label: t.label, selector: '[' + attr + ']' });
        }
      }
      return JSON.stringify(out);
    })()
  `);
  const list = Array.isArray(stamped) ? stamped : [];
  if (list.length === 0) return { geometry: null, selectors: [] };
  const sels = list.map(x => x.selector);
  const geometry = await client.getDOMGeometry([sels[0]], {
    scrollIntoView: true,
    zone,
    groupTargets: sels,
    actionMember: 'last'
  });
  if (geometry) {
    geometry.callouts = (geometry.groupMembers || []).map((m, idx) => ({
      index: idx + 1,
      label: list[idx]?.label || m.query,
      cssBox: m.cssBox,
      matchedSelector: m.matchedSelector,
      innerText: m.innerText
    }));
  }
  return { geometry, selectors: list };
}

/**
 * Executa de forma universal as transições reativas pós-passo:
 * - `guided_sidebar_subportal`: (ex.: C-CENTRAL-02 passo 4) navega sidebar lateral -> link de subportal em nova guia;
 * - `search_and_pick`: executa a sonda com DOM Diffing Antes × Depois -> clique em `+` na grade -> seção acumuladora -> `Finalizar`.
 */
export async function runStatefulStepPostAction(
  client: AgentBrowserClient,
  step: RoutineStep,
  nextStep: RoutineStep | undefined,
  opts: {
    getLastIndex: () => number;
    rawPathFor: (suffix: string) => string;
    getNextLetter: () => string;
    addSubFrame: StatefulAddSubFrame;
  }
): Promise<StatefulPostStepResult> {
  const url = await currentUrl(client);
  const plan = detectStatefulStepPlan(step, nextStep, { currentUrl: url });
  if (!plan) return { executed: false };

  // 1. Fluxo guiado por revisão humana: menu -> item lateral -> link subportal em nova guia (C-CENTRAL-02 passo 4)
  if (plan.kind === 'guided_sidebar_subportal' && plan.postMenuSidebarItem) {
    await client.wait(1200);
    const sideRes = await stampByTextAndMeasure(
      client,
      [{ label: plan.postMenuSidebarItem, textMatch: plan.postMenuSidebarItem, inSidebar: true }],
      'any'
    );
    if (!sideRes.geometry || sideRes.selectors.length === 0) {
      return { executed: false };
    }

    const rawB = opts.rawPathFor(opts.getNextLetter());
    await client.screenshot(rawB);
    await opts.addSubFrame(
      rawB,
      sideRes.geometry,
      [
        {
          index: opts.getLastIndex() + 1,
          label: plan.postMenuSidebarItem,
          cssBox: sideRes.geometry.cssBox,
          matchedSelector: sideRes.geometry.matchedSelector,
          innerText: plan.postMenuSidebarItem
        }
      ],
      'post-action'
    );

    await client.click(sideRes.selectors[0].selector);
    await client.wait(1200);

    let openedTab: StatefulPostStepResult['openedTab'];
    if (plan.postSidebarSubportalLink) {
      const linkRes = await stampByTextAndMeasure(
        client,
        [{ label: plan.postSidebarSubportalLink, textMatch: plan.postSidebarSubportalLink, inSidebar: false }],
        'content'
      );
      if (linkRes.geometry && linkRes.selectors.length > 0) {
        const rawC = opts.rawPathFor(opts.getNextLetter());
        await client.screenshot(rawC);
        await opts.addSubFrame(
          rawC,
          linkRes.geometry,
          [
            {
              index: opts.getLastIndex() + 1,
              label: plan.postSidebarSubportalLink,
              cssBox: linkRes.geometry.cssBox,
              matchedSelector: linkRes.geometry.matchedSelector,
              innerText: plan.postSidebarSubportalLink
            }
          ],
          'post-action'
        );
        const tabRes = await client.withNewTabDetection(
          () => client.click(linkRes.selectors[0].selector),
          5000
        );
        if (tabRes.openedTab) {
          openedTab = tabRes.openedTab;
        }
      }
    }

    console.log(
      `   [Estado Universal] Transição pós-menu concluída: "${plan.postMenuSidebarItem}"${openedTab ? ` -> nova guia "${openedTab.title || openedTab.url}"` : ''}.`
    );
    return {
      executed: true,
      adjusted: true,
      openedTab,
      note:
        `Fluxo guiado por revisão humana executado ao vivo: selecionado **${plan.postMenuSidebarItem}** no menu lateral` +
        (plan.postSidebarSubportalLink ? ` e acionado **${plan.postSidebarSubportalLink}**` : '') +
        (openedTab ? ` abrindo a guia **${openedTab.title || openedTab.url}** para os passos seguintes.` : '.')
    };
  }

  // 2. Fluxo Mestre-Detalhe universal com DOM Diffing (Antes x Depois)
  if (plan.kind === 'search_and_pick') {
    const before = await captureDOMStateSnapshot(client);
    const searchSelector = await client.evalJson<string | null>(`
      (() => {
        const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral';
        const vis = el => {
          if (!el || !el.getBoundingClientRect) return false;
          const st = window.getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        };
        const known = document.querySelector('#inputOrdemServicoNome, [data-orion-stateful-search]');
        if (known && vis(known)) {
          known.setAttribute('data-orion-probe-input', '');
          return JSON.stringify('[data-orion-probe-input]');
        }
        const candidates = Array.from(document.querySelectorAll('input[type="text"], input:not([type]), input[type="search"]'))
          .filter(el => vis(el) && !el.closest(navSel) && !el.disabled && !el.readOnly);
        if (candidates.length === 0) return JSON.stringify(null);
        candidates[0].setAttribute('data-orion-probe-input', '');
        return JSON.stringify('[data-orion-probe-input]');
      })()
    `);
    if (!searchSelector) return { executed: false };

    await client.fill(searchSelector, plan.searchQuery || 'teste');
    await client.wait(250);
    await client.pressKey('Enter');

    const waitReactiveResult = async (timeoutMs = 4000) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const snap = await captureDOMStateSnapshot(client);
        const curDiff = diffDOMStateSnapshots(before, snap);
        if (curDiff.populatedGridWithPicker || curDiff.hasReactiveChange) {
          return { snap, curDiff };
        }
        await client.wait(350);
      }
      const finalSnap = await captureDOMStateSnapshot(client);
      return { snap: finalSnap, curDiff: diffDOMStateSnapshots(before, finalSnap) };
    };

    let { snap: after, curDiff: diff } = await waitReactiveResult(3500);

    if (!diff.hasReactiveChange && !diff.populatedGridWithPicker) {
      // Fallback para telas em que o Enter não submete o filtro sem clique no botão Filtrar/Pesquisar
      const triggerSel = await client.evalJson<string | null>(`
        (() => {
          const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral';
          const vis = el => el && el.getBoundingClientRect && window.getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 1;
          const btn = document.querySelector('#btnOrdemServicoFiltrarBuscaPessoa') ||
            Array.from(document.querySelectorAll('button')).find(b => vis(b) && !b.closest(navSel) && /filtrar|pesquisar|buscar|consultar/i.test(b.innerText || b.textContent || ''));
          if (!btn || !vis(btn)) return JSON.stringify(null);
          btn.setAttribute('data-orion-probe-trigger', '');
          return JSON.stringify('[data-orion-probe-trigger]');
        })()
      `);
      if (triggerSel) {
        await client.click(triggerSel).catch(() => undefined);
        const retry = await waitReactiveResult(3500);
        after = retry.snap;
        diff = retry.curDiff;
      }
    }

    // Procura picker de linha na nova grade revelada (ex.: #iconSelecionaPessoa0 ou botão '+' / Selecionar na 1ª linha)
    const pickerSelector = await client.evalJson<string | null>(`
      (() => {
        const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral';
        const vis = el => {
          if (!el || !el.getBoundingClientRect) return false;
          const st = window.getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        };
        const known = document.querySelector('#iconSelecionaPessoa0');
        if (known && vis(known)) {
          known.setAttribute('data-orion-probe-picker', '');
          return JSON.stringify('[data-orion-probe-picker]');
        }
        const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(tr => vis(tr) && !tr.closest(navSel));
        for (const tr of rows) {
          const act = tr.querySelector('.glyphicon-plus, .fa-plus, [id*="Seleciona" i], button[title*="Selecionar" i], a[title*="Selecionar" i]');
          if (act && vis(act)) {
            act.setAttribute('data-orion-probe-picker', '');
            return JSON.stringify('[data-orion-probe-picker]');
          }
        }
        return JSON.stringify(null);
      })()
    `);
    if (!pickerSelector) {
      return {
        executed: diff.hasReactiveChange,
        adjusted: diff.hasReactiveChange,
        note: diff.hasReactiveChange
          ? `DOM Diffing detectou nova resposta na tela após pesquisa (${diff.newSections.join(', ') || 'grade atualizada'}).`
          : undefined
      };
    }

    const pickerGeom = await client.getDOMGeometry([pickerSelector], { scrollIntoView: true, zone: 'content' });
    if (pickerGeom) {
      const rawB = opts.rawPathFor(opts.getNextLetter());
      await client.screenshot(rawB);
      await opts.addSubFrame(
        rawB,
        pickerGeom,
        [
          {
            index: opts.getLastIndex() + 1,
            label: 'Selecionar nome (+)',
            cssBox: pickerGeom.cssBox,
            matchedSelector: pickerGeom.matchedSelector,
            innerText: '+'
          }
        ],
        'post-action'
      );
    }

    await client.click(pickerSelector);
    await client.wait(1200);

    const confirmRes = await stampByTextAndMeasure(
      client,
      [
        { label: 'Nomes para reconhecimento', textMatch: 'Nomes para reconhecimento', inSidebar: false },
        { label: 'Finalizar', textMatch: 'Finalizar', inSidebar: false }
      ],
      'content'
    );
    if (confirmRes.geometry && confirmRes.selectors.length > 0) {
      const rawC = opts.rawPathFor(opts.getNextLetter());
      await client.screenshot(rawC);
      const startIdx = opts.getLastIndex() + 1;
      const calloutsC = (confirmRes.geometry.callouts || []).map((c, idx) => ({ ...c, index: startIdx + idx }));
      if (calloutsC.length > 0) {
        await opts.addSubFrame(rawC, confirmRes.geometry, calloutsC, 'post-action');
      }
      const fin = confirmRes.selectors.find(s => normalizeText(s.label) === 'finalizar');
      if (fin) {
        await client.click(fin.selector);
        await client.wait(1200);
      }
    }

    console.log(
      `   [Estado Universal + DOM Diffing] Sonda "${plan.searchQuery}" -> diff detectado (${diff.newSections.join(', ') || 'grade/painel'}) -> seleção e confirmação executadas.`
    );
    return {
      executed: true,
      adjusted: true,
      note:
        'Fluxo executado ao vivo (Máquina de Estado Universal + DOM Diffing): pesquisa com **"teste" + Enter** -> inclusão do registro na grade (**+**) -> confirmação em **Finalizar** liberando o próximo painel.'
    };
  }

  return { executed: false };
}
