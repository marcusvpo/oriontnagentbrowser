/**
 * Pré-Filtro Automático de Grades Vazias (ADR-029, Cluster B).
 *
 * Muitas telas de consulta do Orion TN abrem com a grade SEM linhas porque a busca ainda não foi disparada
 * (`Filtrar` fica desabilitado até haver período/campo válido: "Período de pesquisa inválido", "Preencha ao
 * menos um dos campos obrigatórios para efetuar a busca"; ou o filtro padrão é "hoje"). Antes de declarar a grade
 * vazia (`[DDD]`/`[XRX]`/`[ATT]`), o executor dispara a listagem com um filtro AMPLO e SEGURO:
 *
 *   1. `as_is`        — a tela já permite buscar: clica no botão de busca com os filtros como estão.
 *   2. `wide_period`  — preenche o PRIMEIRO par de datas (De/Até) da zona de conteúdo com um período amplo
 *                       (01/01/2000 até hoje) e busca de novo. Só altera campos de filtro; nada é gravado.
 *   3. `text_probe`   — sem par de datas, preenche o 1º campo de texto do filtro com `"teste"` (a mesma sonda da
 *                       Máquina de Estado, ADR-027) e busca.
 *
 * Só `Filtrar`/`Pesquisar`/`Buscar`/`Consultar`/`Listar` FORA das linhas da grade são acionados; nunca
 * Salvar/Gravar/Excluir/Inativar. Se nenhuma estratégia trouxer linhas, os filtros preenchidos são restaurados
 * (`Limpar`) e o passo segue o fluxo normal de estado vazio (auto-seed, `[XRX]`, `[DDD]`).
 */
import type { AgentBrowserClient } from './browser.js';
import { countGridRows } from './empty-state.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import type { DOMResolvedGeometry } from './types.js';

export type PrefilterStrategy = 'as_is' | 'wide_period' | 'text_probe' | 'none';

export interface PrefilterFieldFill {
  label: string;
  value: string;
  kind: 'date_from' | 'date_to' | 'text';
}

export interface GridPrefilterOutcome {
  attempted: boolean;
  populated: boolean;
  hash: string;
  rowsBefore: number;
  rowsAfter: number;
  strategy: PrefilterStrategy;
  /** Rótulo do botão de busca acionado */
  trigger?: string;
  filled: PrefilterFieldFill[];
  /** Frase de evidência para o relatório (fatos lidos da tela) */
  reason: string;
  /** Print crua do estado imediatamente antes do clique no botão de busca (sub-captura `passo-NN-b`) */
  triggerRawPath?: string;
  triggerGeometry?: DOMResolvedGeometry;
}

/** Controles de linha / seleção de item da grade que exigem registros visíveis. */
const ROW_ACTION_RE =
  /\b(consultar|visualizar|alterar|editar|excluir|remover|selecionar|abrir|caneta|lapis|olho|lixeira|icone)\b/;
/** O passo fala de escolher/abrir um item vindo de uma lista/grade. */
const PICK_FROM_GRID_RE =
  /\b(na grade|da grade|na listagem|da listagem|na lista|da lista|primeira linha|1a linha|registro desejado|registro gravado|selecione o|abra o|abra a|localize o|localize a)\b/;

const norm = (t: string): string =>
  String(t ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/**
 * O passo precisa de linhas na grade da tela? (alvo que é botão/ícone de linha, ou instrução de escolher/abrir um item
 * da listagem). Função pura: não olha a tela.
 */
export function stepNeedsGridRows(step: { rawText: string; targets: string[]; subItems?: string[] }): boolean {
  const targets = step.targets.map(norm);
  if (targets.some(t => ROW_ACTION_RE.test(t) || t === '+')) return true;
  const text = norm([step.rawText, ...(step.subItems || [])].join(' '));
  if (PICK_FROM_GRID_RE.test(text)) return true;
  // "Filtre e abra o cartão ... clicando no ícone": filtro + ação de linha no mesmo passo
  return /\b(filtre|pesquise|localize)\b/.test(text) && ROW_ACTION_RE.test(text);
}

/** Período amplo e seguro, no formato dos campos de data do Orion TN (`dd/mm/aaaa`). */
export function widePeriod(now: Date = new Date()): { from: string; to: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  return { from: '01/01/2000', to: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}` };
}

export interface FilterInputInfo {
  id: string;
  type: string;
  placeholder: string;
  label: string;
  disabled: boolean;
  value: string;
  /** Índice do carimbo `data-orion-prefilter-input` posto pela leitura ao vivo (ausente em testes) */
  stampIndex?: number;
}

const DATE_PLACEHOLDER = /^[_\d]{2}\/[_\d]{2}\/[_\d]{4}$/;
const isDateInput = (i: FilterInputInfo) =>
  DATE_PLACEHOLDER.test(i.placeholder) || (/\b(data|periodo)\b/.test(norm(i.label)) && i.type === 'text');

/**
 * Escolhe o primeiro par De/Até de campos de data na ordem do DOM (pares por `Inicial`/`Final` no id têm prioridade).
 * Função pura sobre a lista lida da tela.
 */
export function pickPeriodPair(inputs: FilterInputInfo[]): { from: FilterInputInfo; to: FilterInputInfo } | null {
  const dates = inputs.filter(i => !i.disabled && isDateInput(i));
  for (let k = 0; k + 1 < dates.length; k++) {
    const a = dates[k];
    const b = dates[k + 1];
    if (/inicial|de$/i.test(a.id) || /final|ate$/i.test(b.id)) return { from: a, to: b };
  }
  return dates.length >= 2 ? { from: dates[0], to: dates[1] } : null;
}

const SEARCH_LABEL_SOURCE = '^(filtrar|pesquisar|buscar|busca|consultar|listar|procurar|pesquisa)$';

interface TriggerInfo {
  label: string;
  disabled: boolean;
  title: string;
}

const STAMP_TRIGGER = 'data-orion-prefilter-trigger';
const STAMP_INPUT = 'data-orion-prefilter-input';

async function readInputs(client: AgentBrowserClient): Promise<FilterInputInfo[]> {
  const rows = await client.evalJson<FilterInputInfo[]>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/[ \\t\\r\\n]+/g, ' ').trim();
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const modals = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"], .modal-dialog')).filter(vis);
      const root = modals.length > 0 ? modals[modals.length - 1] : document;
      document.querySelectorAll('[${STAMP_INPUT}]').forEach(e => e.removeAttribute('${STAMP_INPUT}'));
      const out = [];
      let n = 0;
      for (const e of Array.from(root.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea'))) {
        if (!vis(e) || e.closest(NAV) || e.closest('table')) continue;
        e.setAttribute('${STAMP_INPUT}', String(n));
        const lbl = e.labels && e.labels[0] ? clean(e.labels[0].innerText) : clean((e.closest('.form-group, [class*=col-]') || {}).innerText || '').slice(0, 50);
        out.push({ id: e.id || '', type: e.type || 'text', placeholder: e.getAttribute('placeholder') || '', label: lbl, disabled: !!(e.disabled || e.readOnly), value: e.value || '', stampIndex: n });
        n++;
      }
      return JSON.stringify(out);
    })()
  `);
  return Array.isArray(rows) ? rows : [];
}

async function readTrigger(client: AgentBrowserClient): Promise<TriggerInfo | null> {
  return client.evalJson<TriggerInfo | null>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const SEARCH = new RegExp(${JSON.stringify(SEARCH_LABEL_SOURCE)}, 'i');
      const clean = t => String(t == null ? '' : t).replace(/[ \\t\\r\\n]+/g, ' ').trim();
      const norm = t => clean(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const modals = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"], .modal-dialog')).filter(vis);
      const root = modals.length > 0 ? modals[modals.length - 1] : document;
      document.querySelectorAll('[${STAMP_TRIGGER}]').forEach(e => e.removeAttribute('${STAMP_TRIGGER}'));
      const cands = Array.from(root.querySelectorAll('button, a.btn, [role="button"], input[type="button"], input[type="submit"]'))
        .filter(b => vis(b) && !b.closest(NAV) && !b.closest('table, tbody, tr, td'));
      const textOf = b => norm(b.innerText || b.textContent || b.getAttribute('value') || '');
      let hit = cands.find(b => SEARCH.test(textOf(b)));
      if (!hit) {
        hit = cands.find(b => {
          const t = norm(b.getAttribute('data-original-title') || b.getAttribute('title') || b.getAttribute('aria-label') || '');
          return SEARCH.test(t) || !!b.querySelector('.fa-search, .fa-filter, .glyphicon-search, .glyphicon-filter');
        });
      }
      if (!hit) return JSON.stringify(null);
      hit.setAttribute('${STAMP_TRIGGER}', '');
      const dis = !!(hit.disabled || hit.getAttribute('aria-disabled') === 'true' || hit.classList.contains('disabled'));
      return JSON.stringify({ label: clean(hit.innerText || hit.textContent || hit.getAttribute('value') || hit.getAttribute('title') || 'Filtrar').slice(0, 40), disabled: dis, title: clean(hit.getAttribute('data-original-title') || hit.getAttribute('title') || '') });
    })()
  `);
}

/**
 * Preenche um campo de filtro (carimbado) com teclas reais: a máscara de data e o modelo do Angular só reagem a
 * digitação (o `fill` direto deixa o botão `Filtrar` desabilitado). `Tab` tira o foco e fecha o seletor de data.
 */
async function fillStamped(client: AgentBrowserClient, stampIndex: number, value: string): Promise<void> {
  const sel = `[${STAMP_INPUT}="${stampIndex}"]`;
  await client.fill(sel, '');
  await client.type(sel, value.replace(/\D/g, '').length === 8 && /^\d\d\/\d\d\/\d{4}$/.test(value) ? value.replace(/\D/g, '') : value);
  await client.pressKey('Tab');
  await client.wait(300);
}

async function waitRows(client: AgentBrowserClient, timeoutMs = 4500): Promise<number> {
  const start = Date.now();
  let rows = await countGridRows(client);
  while (rows <= 0 && Date.now() - start < timeoutMs) {
    await client.wait(400);
    rows = await countGridRows(client);
  }
  return rows;
}

const DISABLED_REASON = (t: TriggerInfo) => `o botão "${t.label}" está desabilitado${t.title ? ` ("${t.title}")` : ''}`;

/** Clica no `Limpar` da tela (restaura filtros que o pré-filtro preencheu). Silencioso se não existir. */
async function restoreFilters(client: AgentBrowserClient): Promise<void> {
  await client
    .eval(`
      (() => {
        const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
        const b = Array.from(document.querySelectorAll('button, a.btn')).find(x => !x.closest(NAV) && !x.closest('table') && /^\\s*limpar\\s*$/i.test(x.innerText || ''));
        if (b && !b.disabled) b.click();
      })()
    `)
    .catch(() => undefined);
  await client.wait(500);
}

/**
 * Tenta popular a grade vazia da tela atual. Nunca lança: qualquer falha vira `populated: false` com o motivo.
 * `captureTrigger` grava a print crua + geometria medida do botão de busca imediatamente antes do clique.
 */
export async function autoFilterEmptyGrid(
  client: AgentBrowserClient,
  opts: { rawPathFor?: (suffix: string) => string; getNextLetter?: () => string } = {}
): Promise<GridPrefilterOutcome> {
  const hash = (await client.evalJson<string>('JSON.stringify(window.location.hash || "")').catch(() => '')) || '';
  const base: GridPrefilterOutcome = {
    attempted: false,
    populated: false,
    hash,
    rowsBefore: -1,
    rowsAfter: -1,
    strategy: 'none',
    filled: [],
    reason: ''
  };
  try {
    const rowsBefore = await countGridRows(client);
    base.rowsBefore = rowsBefore;
    if (rowsBefore !== 0) return { ...base, reason: rowsBefore < 0 ? 'a tela não tem grade' : `a grade já tem ${rowsBefore} linha(s)` };

    let trigger = await readTrigger(client);
    if (!trigger) return { ...base, reason: 'a tela não tem botão de busca (Filtrar/Pesquisar/Consultar) fora das linhas da grade' };
    base.attempted = true;
    base.trigger = trigger.label;

    const captureAndClick = async (strategy: PrefilterStrategy, filled: PrefilterFieldFill[]): Promise<GridPrefilterOutcome | null> => {
      const sel = `[${STAMP_TRIGGER}]`;
      let triggerRawPath: string | undefined;
      let triggerGeometry: DOMResolvedGeometry | undefined;
      try {
        const geom = await client.getDOMGeometry([sel], { scrollIntoView: true, zone: 'content' });
        if (geom && opts.rawPathFor && opts.getNextLetter) {
          triggerRawPath = opts.rawPathFor(opts.getNextLetter());
          await client.screenshot(triggerRawPath);
          triggerGeometry = geom;
        }
      } catch {
        // a captura do gatilho é evidência opcional; a busca segue sem ela
      }
      await client.click(sel);
      const rowsAfter = await waitRows(client);
      if (rowsAfter > 0) {
        return {
          ...base,
          populated: true,
          strategy,
          rowsAfter,
          filled,
          triggerRawPath,
          triggerGeometry,
          reason: `grade sem linhas ao abrir a tela; após acionar "${trigger!.label}"${filled.length > 0 ? ` com ${filled.map(f => `${f.label} = ${f.value}`).join(', ')}` : ''} a grade passou a ter ${rowsAfter} linha(s) (nada foi gravado)`
        };
      }
      return null;
    };

    // 1. como está
    if (!trigger.disabled) {
      const r = await captureAndClick('as_is', []);
      if (r) return r;
    }

    // 2. período amplo
    const inputs = await readInputs(client);
    const pair = pickPeriodPair(inputs);
    const filled: PrefilterFieldFill[] = [];
    if (pair) {
      const { from, to } = widePeriod();
      await fillStamped(client, pair.from.stampIndex ?? 0, from);
      await fillStamped(client, pair.to.stampIndex ?? 0, to);
      filled.push({ label: pair.from.label || pair.from.id || 'Data inicial', value: from, kind: 'date_from' });
      filled.push({ label: (pair.to.label || pair.to.id || 'Data final') + (pair.to.label ? ' (até)' : ''), value: to, kind: 'date_to' });
      trigger = (await readTrigger(client)) ?? trigger;
      if (!trigger.disabled) {
        const r = await captureAndClick('wide_period', filled);
        if (r) return r;
      }
    } else {
      // 3. sonda de texto (sem par de datas)
      const text = inputs.find(i => !i.disabled && i.type !== 'number' && !isDateInput(i));
      if (text) {
        await fillStamped(client, text.stampIndex ?? 0, 'teste');
        filled.push({ label: text.label || text.id || 'Pesquisa', value: 'teste', kind: 'text' });
        trigger = (await readTrigger(client)) ?? trigger;
        if (!trigger.disabled) {
          const r = await captureAndClick('text_probe', filled);
          if (r) return r;
        }
      }
    }

    const finalRows = await countGridRows(client);
    if (filled.length > 0) await restoreFilters(client);
    return {
      ...base,
      rowsAfter: finalRows,
      strategy: filled.length > 0 ? (pair ? 'wide_period' : 'text_probe') : 'as_is',
      filled,
      reason: trigger.disabled
        ? `${DISABLED_REASON(trigger)} mesmo com o filtro amplo; a grade permaneceu sem linhas`
        : `a busca (${filled.length > 0 ? 'filtro amplo' : 'filtros padrão'}) não retornou registros no ambiente`
    };
  } catch (err: any) {
    return { ...base, reason: `falha ao disparar a busca: ${err?.message || err}` };
  }
}
