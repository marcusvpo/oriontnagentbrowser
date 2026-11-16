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
  '.modal.in, .modal.show, .orion-lightweight-modal.in, .orion-lightweight-in, [role="dialog"], [aria-modal="true"]';

/** Controles de saída sem efeito colateral, na ordem de preferência. */
const EXIT_LABELS = ['cancelar', 'fechar', 'voltar', 'nao', 'sair'];

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
