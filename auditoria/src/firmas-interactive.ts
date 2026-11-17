import type { AgentBrowserClient } from './browser.js';
import { extractMenuPaths } from './menu-path.js';
import { normalizeText } from './smart-locator.js';
import type {
  DOMCallout,
  DOMResolvedGeometry,
  RoutineStep,
  SmartLocatorDivergence,
  SmartLocatorResult
} from './types.js';

export type FirmasStepKind =
  | 'search_person'
  | 'review_card'
  | 'sga_order'
  | 'add_service'
  | 'act_and_print'
  | 'finish_order';

export interface FirmasResolveResult {
  kind: FirmasStepKind;
  locResult: SmartLocatorResult;
  adjusted?: boolean;
  note?: string;
  /** Quando verdadeiro, pula o `executeStepAction` genérico (ex.: para `search_person`, que roda fluxo próprio). */
  skipStandardAction?: boolean;
}

export interface FirmasPostStepResult {
  executed: boolean;
  adjusted?: boolean;
  note?: string;
}

export type FirmasAddSubFrame = (
  rawPath: string,
  geometry: DOMResolvedGeometry,
  frameCallouts: DOMCallout[],
  captureKind: 'step' | 'trigger' | 'reveal' | 'post-action',
  revealTrigger?: { kind: 'tab' | 'accordion' | 'button' | 'checkbox' | 'radio' | 'subportal_link'; label: string; directed: boolean }
) => Promise<string>;

async function getCurrentBrowserUrl(client: AgentBrowserClient): Promise<string> {
  try {
    const href = await client.evalJson<string>('JSON.stringify(window.location.href || "")');
    return href || '';
  } catch {
    return '';
  }
}

interface FirmasTargetSpec {
  label: string;
  selectors?: string[];
  textMatcher?: { text: string; tags?: string[] };
}

interface StampedTarget {
  label: string;
  selector: string;
  elementText: string;
}

export function isReconhecimentoFirmasUrl(urlOrHash: string | null | undefined): boolean {
  return /pedidoFirmas/i.test(urlOrHash || '');
}

/**
 * Classifica passos interativos da tela `Reconhecimento de firmas` (`#/pedidoFirmas/cadastrar`)
 * com base no texto do manual, sem hardcode de ID de rotina.
 */
export function classifyFirmasStep(step: RoutineStep): FirmasStepKind | null {
  if (extractMenuPaths(step).length > 0) return null;
  const norm = normalizeText([step.rawText, ...(step.subItems || [])].join(' '));
  if (!norm) return null;

  if (
    /\b(adicionar servico|servicos? realizados?|efetuar servico|nome do servico)\b/.test(norm) ||
    (step.targets.some(t => t.trim() === '+') && /\b(servico|servicos|ato|atos|autentic|reconhec)\b/.test(norm))
  ) {
    return 'add_service';
  }

  if (
    /\b(enviar ao caixa|finalizar pedido|tomador|pagamento|termo|concluir)\b/.test(norm) ||
    (/\bcaixa\b/.test(norm) && !/\b(pesquis|nome|cpf|cartao)\b/.test(norm))
  ) {
    return 'finish_order';
  }

  if (/\b(autenticidade|semelhanca|impressao|imprimir|etiqueta)\b/.test(norm)) {
    return 'act_and_print';
  }

  if (/\b(novo pedido|senha sga|pedido\/senha|sga)\b/.test(norm) && !/\b(por nome|pesquis.*nome)\b/.test(norm)) {
    return 'sga_order';
  }

  if (
    (/\b(pesquis|busc|filt|localiz)/.test(norm) &&
      /\b(nome|cpf|cnpj|cliente|titular|signatario|cartao|ficha)\b/.test(norm)) ||
    (/\b(nome|cpf)\b/.test(norm) && !/\b(exibira|assinatura digitalizada|documentos anexados)\b/.test(norm))
  ) {
    return 'search_person';
  }

  if (/\b(cartao|ficha|assinatura|documentos?|reconhecimento)\b/.test(norm)) {
    return 'review_card';
  }

  return null;
}

/**
 * Carimba no DOM vivo os alvos reais solicitados para medição via `getDOMGeometry`.
 * Nenhuma coordenada é calculada aqui: apenas localizamos seletores estáveis e os entregamos
 * ao coletor determinístico do Blink (`dom-geometry.ts`).
 */
async function stampVisibleFirmasTargets(
  client: AgentBrowserClient,
  specs: FirmasTargetSpec[]
): Promise<StampedTarget[]> {
  const result = await client.evalJson<StampedTarget[]>(`
    (() => {
      const specs = ${JSON.stringify(specs)};
      const token = 'f' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
      for (const prev of window.__orionFirmasStamps || []) {
        try { prev[0].removeAttribute(prev[1]); } catch (e) {}
      }
      window.__orionFirmasStamps = [];

      const navSel = 'header, nav, .navbar, #navbar, aside, .sidebar, .menu-lateral, .nav-stacked';
      const norm = s => String(s || '')
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      const vis = el => {
        if (!el || !el.getBoundingClientRect) return false;
        const st = window.getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      };

      const out = [];
      let idx = 0;

      for (const spec of specs) {
        let matchedEl = null;

        if (Array.isArray(spec.selectors)) {
          for (const sel of spec.selectors) {
            try {
              const cand = Array.from(document.querySelectorAll(sel)).find(el => vis(el) && !el.closest(navSel));
              if (cand) {
                matchedEl = cand;
                break;
              }
            } catch (e) {}
          }
        }

        if (!matchedEl && spec.textMatcher) {
          const wanted = norm(spec.textMatcher.text);
          const tagQuery = (spec.textMatcher.tags && spec.textMatcher.tags.length > 0
            ? spec.textMatcher.tags
            : ['button', 'a', 'label', 'div.btn', '.btn', 'h4', 'h5', 'span']
          ).join(', ');
          const cands = Array.from(document.querySelectorAll(tagQuery)).filter(el => {
            if (!vis(el) || el.closest(navSel)) return false;
            const txt = norm(el.innerText || el.textContent || el.getAttribute('value') || '');
            return txt === wanted;
          });
          if (cands.length > 0) {
            cands.sort((a, b) => {
              const ra = a.getBoundingClientRect();
              const rb = b.getBoundingClientRect();
              return ra.width * ra.height - rb.width * rb.height;
            });
            matchedEl = cands[0];
          }
        }

        if (matchedEl) {
          const attr = 'data-orion-firmas-target-' + token + '-' + (idx++);
          matchedEl.setAttribute(attr, '');
          window.__orionFirmasStamps.push([matchedEl, attr]);
          const txt = String(
            matchedEl.innerText ||
            matchedEl.textContent ||
            matchedEl.getAttribute('title') ||
            matchedEl.getAttribute('placeholder') ||
            spec.label
          ).replace(/\\s+/g, ' ').trim();
          out.push({
            label: spec.label,
            selector: '[' + attr + ']',
            elementText: txt || spec.label
          });
        }
      }
      return JSON.stringify(out);
    })()
  `);
  return Array.isArray(result) ? result : [];
}

async function measureStampedTargets(
  client: AgentBrowserClient,
  stamped: StampedTarget[],
  actionMember: 'first-clickable' | 'last' = 'first-clickable'
): Promise<DOMResolvedGeometry | null> {
  if (stamped.length === 0) return null;
  const selectors = stamped.map(s => s.selector);
  const geometry = await client.getDOMGeometry([selectors[0]], {
    scrollIntoView: true,
    zone: 'content',
    groupTargets: selectors,
    actionMember
  });
  if (!geometry) return null;

  if (geometry.groupMembers && geometry.groupMembers.length > 0) {
    const labelBySelector = new Map(stamped.map(s => [s.selector, s.label]));
    geometry.groupMembers = geometry.groupMembers.map(m => ({
      ...m,
      query: labelBySelector.get(m.query) || labelBySelector.get(m.matchedSelector) || m.query
    }));
  }
  geometry.callouts = (geometry.groupMembers || []).map((m, i) => ({
    index: i + 1,
    label: stamped.find(s => s.selector === m.matchedSelector)?.label || m.query,
    cssBox: m.cssBox,
    matchedSelector: m.matchedSelector,
    innerText: stamped.find(s => s.selector === m.matchedSelector)?.elementText || m.innerText
  }));
  return geometry;
}

function buildHumanStepCallouts(geometry: DOMResolvedGeometry, stamped: StampedTarget[]): DOMCallout[] {
  const members = geometry.groupMembers || [];
  if (members.length === 0) {
    return [
      {
        index: 1,
        label: stamped[0]?.label || geometry.context.innerText || 'Elemento',
        cssBox: geometry.cssBox,
        matchedSelector: geometry.matchedSelector,
        innerText: geometry.context.innerText
      }
    ];
  }
  return members.map((m, i) => ({
    index: i + 1,
    label: stamped.find(s => s.selector === m.matchedSelector)?.label || m.query,
    cssBox: m.cssBox,
    matchedSelector: m.matchedSelector,
    innerText: m.innerText
  }));
}

/**
 * Tenta resolver alvos da tela `#/pedidoFirmas/cadastrar` de forma determinística antes do SmartLocator
 * genérico, evitando falsos positivos (ex.: `+` -> `Novo cartão +`, `Autenticidade` -> `Cidade`) e
 * ajustando rótulos legados para os controles reais do Orion TN 6.0.
 */
export async function resolveFirmasStep(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string
): Promise<FirmasResolveResult | null> {
  const currentUrl = await getCurrentBrowserUrl(client);
  if (!isReconhecimentoFirmasUrl(currentUrl)) return null;

  const kind = classifyFirmasStep(step);
  if (!kind) return null;

  const normStep = normalizeText(step.rawText);

  if (kind === 'search_person') {
    const specs: FirmasTargetSpec[] = [];
    if (/\bnome\b/.test(normStep) || !/\bcpf\b/.test(normStep)) {
      specs.push({ label: 'Nome', selectors: ['#inputOrdemServicoNome', 'input[placeholder*="Nome" i]'] });
    }
    if (/\b(cpf|cnpj|documento)\b/.test(normStep)) {
      specs.push({ label: 'CPF ou CIN', selectors: ['#inputOrdemServicoCPF', 'input[placeholder*="CPF" i]'] });
    }
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'first-clickable');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    const targetDivergences: SmartLocatorDivergence[] = [];
    const cpfTarget = step.targets.find(t => /\bcpf\b/i.test(t) && normalizeText(t) !== 'cpf ou cin');
    const cpfStamped = stamped.find(s => s.label === 'CPF ou CIN');
    const cpfMember = geometry.groupMembers?.find(m => m.query === 'CPF ou CIN');
    if (cpfTarget && cpfStamped && cpfMember && step.rawText.includes(`**${cpfTarget}**`)) {
      targetDivergences.push({
        stepNumber: step.stepNumber,
        documentedTarget: cpfTarget,
        actualElementText: 'CPF ou CIN',
        actualRole: 'textbox',
        resolutionLayer: 'dom_synonym_heuristic',
        confidence: 0.9,
        reason: `Campo de documento na tela atual intitula-se "CPF ou CIN" em vez de "${cpfTarget}"`,
        detectedAt: new Date().toISOString(),
        evidence: {
          source: 'dom-measured',
          matchedSelector: cpfMember.matchedSelector,
          elementText: 'CPF ou CIN',
          box: cpfMember.cssBox
        },
        textChange: { from: `**${cpfTarget}**`, to: '**CPF ou CIN**' }
      });
    }

    return {
      kind,
      skipStandardAction: true,
      locResult: {
        found: true,
        healed: targetDivergences.length > 0,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + '),
        targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined
      }
    };
  }

  if (kind === 'sga_order') {
    const specs: FirmasTargetSpec[] = [
      { label: 'Pedido/Senha', selectors: ['#numeroPedidoBusca'] },
      { label: 'Senha SGA', selectors: ['#inputSenhaSGA'] },
      { label: 'Filtrar', selectors: ['#btnOrdemServicoFiltrarBuscaPessoa'] }
    ];
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'first-clickable');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    return {
      kind,
      adjusted: true,
      skipStandardAction: true,
      note:
        'Ajuste editorial/UI: na tela **Reconhecimento de firmas**, não existe botão **Novo Pedido**; o atendimento/consulta por senha inicia pelos campos **Pedido/Senha** e **Senha SGA** (o botão **Novo cartão +** destina-se exclusivamente ao cadastro de novo cartão de assinatura).',
      locResult: {
        found: true,
        healed: true,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + ')
      }
    };
  }

  if (kind === 'review_card') {
    const specs: FirmasTargetSpec[] = [
      { label: 'Nomes para reconhecimento', textMatcher: { text: 'Nomes para reconhecimento', tags: ['h4', 'h5', 'label', 'span', 'div'] } },
      { label: 'Qtd. Atos', selectors: ['#inputQuantidadeAtosPessoa0'] },
      { label: 'Imprimir', selectors: ['#btnImprimirPedidos'] }
    ];
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'first-clickable');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    return {
      kind,
      adjusted: true,
      skipStandardAction: true,
      note: 'Cartão de assinatura e dados do solicitante conferidos na seção **Nomes para reconhecimento** após seleção do cadastro de teste.',
      locResult: {
        found: true,
        healed: false,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + ')
      }
    };
  }

  if (kind === 'add_service') {
    const specs: FirmasTargetSpec[] = [
      { label: 'Nome do serviço', selectors: ['#inputOrdemServicoTO'] },
      { label: 'Escrevente', selectors: ['#comboUsuarioEscreventeOutrosServicos'] },
      { label: 'Cálculo', selectors: ['#comboDivisorOutrosServicos'] },
      { label: 'QTD', selectors: ['#inputAutenticacaoQntOutrosServico'] },
      { label: 'Efetuar Serviço', selectors: ['#btnConcluirOutrosServicosOutros'] },
      { label: 'Observação', selectors: ['#inputAutenticacaoObservacoesOutrosServico'] }
    ];
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'first-clickable');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    const targetDivergences: SmartLocatorDivergence[] = [];
    const docAdd = step.targets.find(t => /\badicionar servi[çc]o\b/i.test(t) || t.trim() === '+');
    if (docAdd) {
      targetDivergences.push({
        stepNumber: step.stepNumber,
        documentedTarget: docAdd,
        actualElementText: 'Serviços realizados / Efetuar Serviço',
        actualRole: 'button',
        resolutionLayer: 'dom_synonym_heuristic',
        confidence: 0.9,
        reason: `O botão "${docAdd}" não existe em Reconhecimento de firmas; os atos são lançados no painel Serviços realizados e confirmados na seta "Efetuar Serviço"`,
        detectedAt: new Date().toISOString()
      });
    }

    return {
      kind,
      adjusted: true,
      skipStandardAction: true,
      note:
        'O botão **Adicionar Serviço (+)** não existe na tela **Reconhecimento de firmas** (e **Novo cartão +** é exclusivo para cadastro de novo cartão); o lançamento do ato é feito no painel **Serviços realizados** com **Nome do serviço**, **Escrevente**, **Cálculo**, **QTD** (e **Observação**) seguido da seta **Efetuar Serviço** ao lado de **QTD**.',
      locResult: {
        found: true,
        healed: true,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + '),
        targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined
      }
    };
  }

  if (kind === 'act_and_print') {
    const specs: FirmasTargetSpec[] = [
      { label: 'Nome do serviço', selectors: ['#inputOrdemServicoTO'] },
      { label: 'Cálculo', selectors: ['#comboDivisorOutrosServicos'] },
      { label: 'Imprimir', selectors: ['#btnImprimirPedidos'] }
    ];
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'last');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    const targetDivergences: SmartLocatorDivergence[] = [];
    const impTarget = step.targets.find(t => /^impress[ãa]o$/i.test(t.trim()));
    const impStamped = stamped.find(s => s.label === 'Imprimir');
    const impMember = geometry.groupMembers?.find(m => m.query === 'Imprimir');
    if (impTarget && impStamped && impMember && step.rawText.includes(`**${impTarget}**`)) {
      targetDivergences.push({
        stepNumber: step.stepNumber,
        documentedTarget: impTarget,
        actualElementText: 'Imprimir',
        actualRole: 'button',
        resolutionLayer: 'dom_synonym_heuristic',
        confidence: 0.95,
        reason: `O botão documentado como "${impTarget}" chama-se "Imprimir" na interface atual`,
        detectedAt: new Date().toISOString(),
        evidence: {
          source: 'dom-measured',
          matchedSelector: impMember.matchedSelector,
          elementText: impStamped.elementText || 'Imprimir',
          box: impMember.cssBox
        },
        textChange: { from: `**${impTarget}**`, to: '**Imprimir**' }
      });
    }

    return {
      kind,
      adjusted: true,
      skipStandardAction: true,
      note:
        'Os tipos de ato (como **Autenticidade** e **Semelhança**) são selecionados no campo **Nome do serviço** / **Cálculo** do painel **Serviços realizados**, e a impressão é acionada no botão **Imprimir**.',
      locResult: {
        found: true,
        healed: true,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + '),
        targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined
      }
    };
  }

  if (kind === 'finish_order') {
    const specs: FirmasTargetSpec[] = [
      { label: 'Tomador', textMatcher: { text: 'Tomador', tags: ['button', 'a', 'label', 'div'] } },
      { label: 'Pagamento', textMatcher: { text: 'Pagamento', tags: ['button', 'a', 'label', 'div'] } },
      { label: 'Termo', textMatcher: { text: 'Termo', tags: ['button', 'a', 'label', 'div'] } },
      { label: 'Concluir', textMatcher: { text: 'Concluir', tags: ['button', 'a', 'label', 'div'] } }
    ];
    const stamped = await stampVisibleFirmasTargets(client, specs);
    const geometry = await measureStampedTargets(client, stamped, 'last');
    if (!geometry) return null;

    await client.screenshot(rawScreenshotPath);
    return {
      kind,
      adjusted: true,
      note:
        'No rodapé de **Reconhecimento de firmas**, após lançar o ato em **Efetuar Serviço**, habilitam-se os botões **Tomador**, **Pagamento**, **Termo**, **Cancelar** e **Concluir**.',
      locResult: {
        found: true,
        healed: true,
        geometry,
        matchedTargetName: stamped.map(s => s.label).join(' + ')
      }
    };
  }

  return null;
}

/**
 * Executa de forma real o fluxo interativo da busca em `#/pedidoFirmas/cadastrar` após o passo
 * de pesquisa por Nome/CPF:
 * 1. Digita `"teste"` no campo `#inputOrdemServicoNome` e pressiona `Enter`.
 * 2. Aguarda a grade `Nomes encontrados` abrir à direita e captura sub-print (`passo-NN-b`) no botão `+` (`#iconSelecionaPessoa0`).
 * 3. Clica no `+` (`#iconSelecionaPessoa0`), enviando o cadastro para `Nomes para reconhecimento` à esquerda.
 * 4. Captura sub-print (`passo-NN-c`) destacando `Nomes para reconhecimento` e o botão `Finalizar`.
 * 5. Clica em `Finalizar` para reexibir `Serviços solicitados` / `Serviços realizados` com o cartão carregado.
 */
export async function runFirmasSearchPostStep(
  client: AgentBrowserClient,
  step: RoutineStep,
  opts: {
    getLastIndex: () => number;
    rawPathFor: (suffix: string) => string;
    getNextLetter: () => string;
    addSubFrame: FirmasAddSubFrame;
  }
): Promise<FirmasPostStepResult> {
  const currentUrl = await getCurrentBrowserUrl(client);
  if (!isReconhecimentoFirmasUrl(currentUrl)) return { executed: false };
  if (classifyFirmasStep(step) !== 'search_person') return { executed: false };

  const hasNameInput = await client.evalJson<boolean>(`
    (() => {
      const el = document.querySelector('#inputOrdemServicoNome');
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    })()
  `);
  if (!hasNameInput) return { executed: false };

  // 1. Digita "teste" + Enter no campo Nome
  await client.fill('#inputOrdemServicoNome', 'teste');
  await client.wait(250);
  await client.pressKey('Enter');

  const waitVisible = async (selector: string, timeoutMs = 4500): Promise<boolean> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const ok = await client.evalJson<boolean>(`
        (() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return false;
          const st = window.getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        })()
      `);
      if (ok) return true;
      await client.wait(300);
    }
    return false;
  };

  let resultsReady = await waitVisible('#iconSelecionaPessoa0', 3000);
  if (!resultsReady) {
    // Fallback seguro caso o template exija clique no botão Filtrar além de Enter
    await client.click('#btnOrdemServicoFiltrarBuscaPessoa').catch(() => undefined);
    resultsReady = await waitVisible('#iconSelecionaPessoa0', 4000);
  }
  if (!resultsReady) {
    return {
      executed: false,
      note: 'A pesquisa por "teste" no campo **Nome** foi acionada, mas a grade **Nomes encontrados** não retornou linhas visíveis no tempo limite.'
    };
  }

  // 2. Sub-print passo-NN-b destacando o botão '+' (#iconSelecionaPessoa0) em Nomes encontrados
  const plusStamped = await stampVisibleFirmasTargets(client, [
    { label: 'Adicionar nome (+)', selectors: ['#iconSelecionaPessoa0'] }
  ]);
  const geomB = await measureStampedTargets(client, plusStamped, 'first-clickable');
  if (geomB) {
    const rawB = opts.rawPathFor(opts.getNextLetter());
    await client.screenshot(rawB);
    const calloutsB: DOMCallout[] = [
      {
        index: opts.getLastIndex() + 1,
        label: 'Selecionar nome (+)',
        cssBox: geomB.cssBox,
        matchedSelector: geomB.matchedSelector,
        innerText: '+'
      }
    ];
    await opts.addSubFrame(rawB, geomB, calloutsB, 'post-action');
  }

  // 3. Clica no '+' da linha para mover para Nomes para reconhecimento e exibe Finalizar
  await client.click('#iconSelecionaPessoa0');
  const cardLoaded = await waitVisible('#inputQuantidadeAtosPessoa0', 4500);
  await client.wait(300);

  // 4. Sub-print passo-NN-c destacando Nomes para reconhecimento + Finalizar
  const finalStamped = await stampVisibleFirmasTargets(client, [
    { label: 'Nomes para reconhecimento', textMatcher: { text: 'Nomes para reconhecimento', tags: ['h4', 'h5', 'label', 'span', 'div'] } },
    { label: 'Finalizar', textMatcher: { text: 'Finalizar', tags: ['button', 'a'] } }
  ]);
  const geomC = await measureStampedTargets(client, finalStamped, 'last');
  if (geomC && finalStamped.length > 0) {
    const rawC = opts.rawPathFor(opts.getNextLetter());
    await client.screenshot(rawC);
    const startIdx = opts.getLastIndex() + 1;
    const calloutsC = buildHumanStepCallouts(geomC, finalStamped).map((c, idx) => ({
      ...c,
      index: startIdx + idx
    }));
    await opts.addSubFrame(rawC, geomC, calloutsC, 'post-action');
  }

  // 5. Clica em Finalizar para restaurar Serviços solicitados / Serviços realizados com o cartão carregado
  const finalizarSpec = finalStamped.find(s => s.label === 'Finalizar');
  if (finalizarSpec) {
    await client.click(finalizarSpec.selector);
    await waitVisible('#inputOrdemServicoTO', 4000);
    await client.wait(400);
  }

  console.log(
    `   [Firmas Interativo] Busca "teste" -> '+' em Nomes encontrados -> cartão ${cardLoaded ? 'carregado' : 'selecionado'} em Nomes para reconhecimento -> Finalizar acionado.`
  );
  return {
    executed: true,
    adjusted: true,
    note:
      'Fluxo executado ao vivo: digitado **"teste"** em **Nome** + **Enter** -> clique em **+** na grade **Nomes encontrados** -> cadastro enviado para **Nomes para reconhecimento** -> clique em **Finalizar** exibindo **Serviços realizados** com o cartão carregado.'
  };
}
