import type { AgentBrowserClient } from './browser.js';

/**
 * Escopo de modal ativo (correção pós-Fase 3).
 *
 * O Orion TN 6.0 usa dois tipos de modal: o `.modal.in` do Bootstrap e o modal "leve" próprio
 * (`#modalFichaRegistra`: `class="orion-lightweight-modal orion-lightweight-in in"`, sem a classe `.modal`).
 * Um seletor que só conhece o Bootstrap não enxerga o modal leve: a resolução de alvos caía no `#content`
 * por trás do backdrop e o clique era recusado ("covered by ... inside div#modalFichaRegistra").
 *
 * Este seletor é a fonte única usada pela medição (`dom-geometry.ts`), pela Exploração Investigativa,
 * pelo auto-seed e pelo reset entre rotinas.
 */
export const ACTIVE_MODAL_SELECTOR =
  '.modal.in, .modal.show, .modal[style*="display: block"], .orion-lightweight-modal.in, .orion-lightweight-in, #modalAvisoCertificado, [role="dialog"], [aria-modal="true"]';

/** Controles de saída sem efeito colateral, na ordem de preferência. */
const EXIT_LABELS = ['cancelar', 'fechar', 'voltar', 'nao', 'sair', 'ok', 'entendi', 'ciente'];

/**
 * Fecha o modal do topo por um controle de saída sem efeito (X, Cancelar, Fechar, Voltar).
 * Devolve `none` (nada aberto), `closed` (controle acionado) ou `no-exit` (sem controle de saída).
 */
export async function dismissTopModalOnce(client: AgentBrowserClient): Promise<'none' | 'closed' | 'no-exit'> {
  const res = await client.evalJson<string>(`
    (() => {
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w\\s+]/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const modals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      if (modals.length === 0) return JSON.stringify('none');
      // Do mais interno (topo) para o mais externo: o primeiro com controle de saída visível é o que fecha
      const exits = ${JSON.stringify(EXIT_LABELS)};
      let btn = null;
      for (let i = modals.length - 1; i >= 0 && !btn; i--) {
        const m = modals[i];
        btn =
          Array.from(m.querySelectorAll('[data-dismiss="modal"], .close, [aria-label="Close"], [aria-label="Fechar"]')).find(vis) ||
          Array.from(m.querySelectorAll('button, a.btn')).find(b => vis(b) && exits.includes(norm(b.innerText || b.textContent))) ||
          null;
      }
      if (!btn) return JSON.stringify('no-exit');
      btn.click();
      return JSON.stringify('closed');
    })()
  `);
  return res === 'closed' || res === 'no-exit' ? res : 'none';
}

/** Quantos modais ativos (visíveis) existem agora. */
export async function countActiveModals(client: AgentBrowserClient): Promise<number> {
  const n = await client.evalJson<number>(`
    (() => {
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      return JSON.stringify(Array.from(document.querySelectorAll(${JSON.stringify(ACTIVE_MODAL_SELECTOR)})).filter(vis).length);
    })()
  `);
  return typeof n === 'number' ? n : 0;
}

/**
 * Garante que nenhum modal ativo permaneça em tela: aciona o controle de saída (X/Cancelar/Fechar)
 * e confere o resultado. Nada é gravado: só botões de saída. Devolve quantos modais restaram.
 */
export async function closeActiveModals(client: AgentBrowserClient, maxRounds = 4): Promise<{ closed: number; remaining: number }> {
  let closed = 0;
  for (let round = 0; round < maxRounds; round++) {
    let status: 'none' | 'closed' | 'no-exit' = 'none';
    try {
      status = await dismissTopModalOnce(client);
    } catch {
      break;
    }
    if (status !== 'closed') break;
    closed++;
    await client.wait(700);
  }
  let remaining = 0;
  try {
    remaining = await countActiveModals(client);
  } catch {}
  return { closed, remaining };
}

/** Leitura de um modal herdado do passo anterior em relação aos alvos do passo atual. */
export interface InheritedModalProbe {
  /** Modais ativos visíveis agora */
  modalCount: number;
  /** Alvos cujo texto aparece dentro de algum modal visível */
  insideModal: string[];
  /** Alvos medidos visíveis FORA de todo modal (controle com texto idêntico) */
  outsideModal: string[];
}

/**
 * Decide se o modal aberto pelo passo anterior (ex.: **Imprimir** abre "Seleção de modelo") deve ser fechado
 * antes de medir o passo atual. Só fecha quando NENHUM alvo do passo está no modal e TODOS existem na tela
 * por trás dele: o passo claramente fala da tela principal. Em qualquer dúvida o modal fica (comportamento anterior).
 */
export function shouldDismissInheritedModal(targets: string[], probe: InheritedModalProbe | null): boolean {
  if (!probe || probe.modalCount <= 0) return false;
  const wanted = targets.map(t => t.trim()).filter(Boolean);
  if (wanted.length === 0) return false;
  if (probe.insideModal.length > 0) return false;
  const outside = new Set(probe.outsideModal);
  return wanted.every(t => outside.has(t));
}

/** Script de leitura (sem efeito) que alimenta `shouldDismissInheritedModal`. */
export function buildInheritedModalProbeScript(targets: string[]): string {
  return `
    (() => {
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
      const TARGETS = ${JSON.stringify(targets)};
      const norm = t => String(t || '').normalize('NFD').replace(/\\p{M}/gu, '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const vis = e => {
        if (!e || !e.getBoundingClientRect) return false;
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const modals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
      if (modals.length === 0) return JSON.stringify({ modalCount: 0, insideModal: [], outsideModal: [] });
      const inModal = el => modals.some(m => m === el || m.contains(el));
      const modalText = ' ' + modals.map(m => norm(m.innerText || m.textContent)).join(' ') + ' ';
      const controls = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], label, input[type="button"], input[type="submit"]'))
        .filter(el => vis(el) && !inModal(el));
      const insideModal = [];
      const outsideModal = [];
      for (const t of TARGETS) {
        const n = norm(t);
        if (!n) continue;
        if (modalText.indexOf(' ' + n + ' ') !== -1) insideModal.push(t);
        if (controls.some(el => norm(el.innerText || el.textContent || el.value) === n)) outsideModal.push(t);
      }
      return JSON.stringify({ modalCount: modals.length, insideModal, outsideModal });
    })()
  `;
}

/**
 * Modal herdado: o passo anterior abriu um modal que o passo atual não menciona (os alvos estão na tela de trás).
 * Fecha só por controle de saída (X/Cancelar/Fechar), nunca por gravação. Devolve quantos foram fechados.
 */
export async function dismissInheritedModalForStep(
  client: AgentBrowserClient,
  targets: string[]
): Promise<{ closed: number; remaining: number; probe: InheritedModalProbe | null }> {
  let probe: InheritedModalProbe | null = null;
  try {
    probe = await client.evalJson<InheritedModalProbe>(buildInheritedModalProbeScript(targets));
  } catch {
    probe = null;
  }
  if (!shouldDismissInheritedModal(targets, probe)) return { closed: 0, remaining: probe?.modalCount ?? 0, probe };
  const res = await closeActiveModals(client);
  return { ...res, probe };
}
