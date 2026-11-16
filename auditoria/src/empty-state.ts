/**
 * Detector de Estado Vazio (ADR-021 §2): lê, ao vivo e em modo somente leitura, se a tela atual é uma
 * grade sem registros, se a aplicação exibiu um toast/alerta de "nada cadastrado" (transitório) e quais
 * controles estão inativos por falta de dado. O script é injetado via STDIN (ADR-014); nada é medido
 * para anotação, então a evidência não altera nenhuma geometria.
 */
import type { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import type { EmptyStateEvidence } from './types.js';

/** Mensagens da aplicação que dizem "não há dados" (já normalizadas: sem acento, minúsculas). */
export const EMPTY_MESSAGE_SOURCE =
  '(nenhum registro|nenhum resultado|nenhum item|nao existem? .{0,80}cadastrad|nao ha (registros|dados|itens)|sem registros|nenhum dado|lista vazia|nada cadastrado)';

/** Botões que abrem um cadastro novo (texto inteiro do controle, sem acento). */
export const ADD_BUTTON_SOURCE = '^(\\+\\s*)?(adicionar|novo|nova|cadastrar|incluir|criar)(\\s*\\+)?(\\s+\\S+){0,3}$';

/** Atributo de carimbo gravado no botão Adicionar localizado (lido pelo auto-seed). */
export const ADD_STAMP_ATTR = 'data-orion-add-stamp';

const TOAST_SELECTOR =
  '.toast, .toast-message, .toast-container .toast, .ngx-toastr, .toastr, .alert, [role="alert"], .swal2-popup, .noty_body, .notification, .snackbar, .p-toast-message, .mat-snack-bar-container';

/**
 * Observador de toasts: toda notificação que entra no DOM é registrada com texto e instante antes de
 * sumir. Idempotente; sobrevive às trocas de rota do SPA (só um recarregamento o remove).
 */
export async function installToastObserver(client: AgentBrowserClient): Promise<void> {
  await client.evalJson<string>(`
    (() => {
      if (window.__orionToastObserver) return JSON.stringify('already');
      window.__orionToastLog = [];
      const SEL = ${JSON.stringify(TOAST_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const record = el => {
        const text = clean(el.innerText || el.textContent);
        if (!text || text.length > 300) return;
        const log = window.__orionToastLog;
        if (!log.some(e => e.text === text)) log.push({ text, at: Date.now() });
      };
      const scan = node => {
        if (!(node instanceof Element)) return;
        if (node.matches(SEL)) record(node);
        node.querySelectorAll && node.querySelectorAll(SEL).forEach(record);
      };
      const obs = new MutationObserver(muts => {
        for (const m of muts) {
          m.addedNodes && m.addedNodes.forEach(scan);
          if (m.type === 'characterData' && m.target.parentElement) scan(m.target.parentElement.closest(SEL) || m.target.parentElement);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
      window.__orionToastObserver = true;
      document.querySelectorAll(SEL).forEach(record);
      return JSON.stringify('installed');
    })()
  `);
}

interface RawEmptyState {
  emptyGrid: boolean;
  headers: string[];
  rowCount: number;
  gridMessage?: string;
  toasts: string[];
  disabled: Array<{ label: string; hint?: string }>;
  addButton?: { label: string; selector: string };
  hash: string;
}

const norm = (t: string) =>
  String(t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const EMPTY_RE = new RegExp(EMPTY_MESSAGE_SOURCE);

export function isEmptyMessage(text: string | undefined): boolean {
  return !!text && EMPTY_RE.test(norm(text));
}

/**
 * Lê o estado vazio da tela atual. Devolve `null` quando a leitura falha ou a tela não tem grade, nem
 * toast de vazio, nem controle inativo, nem botão Adicionar (nada a registrar).
 */
export async function readEmptyState(client: AgentBrowserClient): Promise<EmptyStateEvidence | null> {
  const raw = await client.evalJson<RawEmptyState>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const TOAST = ${JSON.stringify(TOAST_SELECTOR)};
      const ADD_RE = new RegExp(${JSON.stringify(ADD_BUTTON_SOURCE)});
      const STAMP = ${JSON.stringify(ADD_STAMP_ATTR)};
      const EMPTY_RE = new RegExp(${JSON.stringify(EMPTY_MESSAGE_SOURCE)});
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const norm = t => clean(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
      const vis = e => {
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const inContent = e => !e.closest(NAV);
      // Um modal aberto é o contêiner vigente: o estado vazio é o dele
      const modals = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"], .modal-dialog')).filter(vis);
      const root = modals.length > 0 ? modals[modals.length - 1] : document;

      // 1. Grades: tabela HTML, role=grid ou datatable do Angular
      const grids = Array.from(root.querySelectorAll('table, [role="grid"], .ngx-datatable, .datatable, .p-datatable')).filter(g => vis(g) && inContent(g));
      let best = null;
      for (const g of grids) {
        const headers = Array.from(g.querySelectorAll('thead th, [role="columnheader"], .datatable-header-cell, .p-datatable-thead th'))
          .filter(vis).map(h => clean(h.innerText || h.textContent)).filter(Boolean);
        if (headers.length === 0) continue;
        const rowEls = Array.from(g.querySelectorAll('tbody tr, [role="row"], .datatable-body-row, .p-datatable-tbody tr'))
          .filter(r => vis(r) && !r.closest('thead') && !r.querySelector('th'));
        const dataRows = rowEls.filter(r => {
          const t = norm(r.innerText || r.textContent);
          return t.length > 0 && !EMPTY_RE.test(t);
        });
        const msgRow = rowEls.find(r => EMPTY_RE.test(norm(r.innerText || r.textContent)));
        const cand = { headers, rowCount: dataRows.length, gridMessage: msgRow ? clean(msgRow.innerText || msgRow.textContent) : undefined, area: g.getBoundingClientRect().width * g.getBoundingClientRect().height };
        if (!best || cand.area > best.area) best = cand;
      }

      // 2. Toasts/alertas: o log do observador (inclui os que já sumiram) e os visíveis agora
      const toasts = [];
      for (const e of (window.__orionToastLog || [])) toasts.push(e.text);
      for (const el of document.querySelectorAll(TOAST)) {
        if (vis(el)) { const t = clean(el.innerText || el.textContent); if (t && t.length <= 300) toasts.push(t); }
      }

      // 3. Mensagem de vazio fora da grade (card "Não existem ... cadastrados")
      let gridMessage = best && best.gridMessage;
      if (!gridMessage) {
        const cands = Array.from(root.querySelectorAll('td, p, div, span, li')).filter(e => vis(e) && inContent(e) && e.children.length <= 1);
        const hit = cands.find(e => { const t = norm(e.innerText || e.textContent); return t.length <= 120 && EMPTY_RE.test(t); });
        if (hit) gridMessage = clean(hit.innerText || hit.textContent);
      }

      // 4. Controles inativos na zona de conteúdo
      const disabled = Array.from(root.querySelectorAll('button, a.btn, [role="button"], input[type="submit"], input[type="button"]'))
        .filter(b => vis(b) && inContent(b) && (b.disabled || b.getAttribute('aria-disabled') === 'true' || b.classList.contains('disabled')))
        .map(b => ({
          label: clean(b.innerText || b.textContent || b.getAttribute('value') || b.getAttribute('title')).slice(0, 60),
          hint: clean(b.getAttribute('data-original-title') || b.getAttribute('title') || b.getAttribute('aria-label') || '').slice(0, 120) || undefined
        }))
        .filter(d => d.label)
        .slice(0, 10);

      // 5. Botão de cadastro ativo (carimbado para o auto-seed acionar exatamente este nó)
      document.querySelectorAll('[' + STAMP + ']').forEach(e => e.removeAttribute(STAMP));
      let addButton;
      const addCands = Array.from(root.querySelectorAll('button, a.btn, a[role="button"], [role="button"], input[type="button"]'))
        .filter(b => vis(b) && inContent(b) && !(b.disabled || b.getAttribute('aria-disabled') === 'true' || b.classList.contains('disabled')));
      const add = addCands.find(b => ADD_RE.test(norm(b.innerText || b.textContent || b.getAttribute('value') || '')) || ADD_RE.test(norm(b.getAttribute('title') || b.getAttribute('aria-label') || '')));
      if (add) {
        add.setAttribute(STAMP, '');
        addButton = { label: clean(add.innerText || add.textContent || add.getAttribute('title') || 'Adicionar').slice(0, 40), selector: '[' + STAMP + ']' };
      }

      return JSON.stringify({
        emptyGrid: !!best && best.rowCount === 0,
        headers: best ? best.headers : [],
        rowCount: best ? best.rowCount : -1,
        gridMessage,
        toasts: Array.from(new Set(toasts)).slice(0, 10),
        disabled,
        addButton,
        hash: window.location.hash || ''
      });
    })()
  `);
  if (!raw) return null;

  // O botão de fechar do toast ("×") entra no innerText: não faz parte da mensagem
  const stripClose = (t: string | undefined) => (t ? t.replace(/^[×✕✖xX]\s+/, '').trim() : t);
  raw.toasts = Array.from(new Set(raw.toasts.map(t => stripClose(t) as string)));
  raw.gridMessage = stripClose(raw.gridMessage);

  const emptyToast = raw.toasts.find(isEmptyMessage);
  const toastText = emptyToast ?? (raw.emptyGrid && isEmptyMessage(raw.gridMessage) ? raw.gridMessage : undefined);
  // Mensagem de vazio sem grade (card isolado) também conta como tela vazia
  const emptyGrid = raw.emptyGrid || (raw.rowCount < 0 && isEmptyMessage(raw.gridMessage));
  if (!emptyGrid && !toastText && raw.disabled.length === 0 && !raw.addButton) return null;
  return {
    emptyGrid,
    headers: raw.headers,
    toastText: toastText ?? (isEmptyMessage(raw.gridMessage) ? raw.gridMessage : undefined),
    disabledControls: raw.disabled,
    addButton: raw.addButton,
    hash: raw.hash
  };
}

/** A tela está vazia de dados (grade sem linhas ou mensagem de "nada cadastrado")? */
export function hasNoData(state: EmptyStateEvidence | null | undefined): boolean {
  return !!state && (state.emptyGrid || !!state.toastText);
}

/** Linhas de dados atuais da maior grade da tela (`-1` se não há grade) — usado para confirmar o seed. */
export async function countGridRows(client: AgentBrowserClient): Promise<number> {
  const n = await client.evalJson<number>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const EMPTY_RE = new RegExp(${JSON.stringify(EMPTY_MESSAGE_SOURCE)});
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const norm = t => clean(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const grids = Array.from(document.querySelectorAll('table, [role="grid"], .ngx-datatable, .datatable, .p-datatable')).filter(g => vis(g) && !g.closest(NAV) && g.querySelector('thead th, [role="columnheader"], .datatable-header-cell'));
      if (grids.length === 0) return JSON.stringify(-1);
      let best = null, area = -1;
      for (const g of grids) { const r = g.getBoundingClientRect(); if (r.width * r.height > area) { area = r.width * r.height; best = g; } }
      const rows = Array.from(best.querySelectorAll('tbody tr, [role="row"], .datatable-body-row')).filter(r => vis(r) && !r.closest('thead') && !r.querySelector('th'))
        .filter(r => { const t = norm(r.innerText || r.textContent); return t.length > 0 && !EMPTY_RE.test(t); });
      return JSON.stringify(rows.length);
    })()
  `);
  return typeof n === 'number' ? n : -1;
}
