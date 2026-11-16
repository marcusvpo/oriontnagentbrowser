/**
 * Coleta de Ajuda Contextual (ADR-020): ícones informativos "i" (popover/tooltip de ajuda) ao lado de
 * títulos e campos. Hover rápido e não destrutivo: lê o balão renderizado pela UI, devolve o ponteiro
 * para fora e confere que nada ficou aberto. O texto é copiado literalmente do DOM (Evidência Estrita).
 *
 * Markup real (Orion TN 6.0, sonda de M-25.0): `i.glyphicons-circle-info` com popover Bootstrap
 * (`.popover-title` + `.popover-content`). O asterisco `glyphicons-asterisk` ("Campo obrigatório") e o
 * ícone de ajuda do título (`.infotitulo`, sem balão no hover) não entram.
 */
import { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import type { BoundingBox } from './types.js';

export interface HelpTooltip {
  /** Título/campo ao qual o ícone se refere (ex.: "Margem mínima") */
  anchorLabel: string;
  /** Título do balão, quando existe */
  title?: string;
  /** Texto literal do balão */
  text: string;
  /** Caixa do ícone, medida ao vivo */
  box: BoundingBox;
}

/** Máximo de ícones sondados por tela (a sondagem é sequencial). */
export const HELP_MAX_PER_SCREEN = 8;

interface RawHelpIcon {
  n: number;
  selector: string;
  anchorLabel: string;
  box: BoundingBox;
}

function buildHelpIconScript(token: string): string {
  return `
(() => {
  const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const modal = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"]')).find(vis);
  const scope = modal || document;
  const SEL = '[class*="circle-info"], [class*="info-sign"], [class*="fa-info"], [data-toggle="popover"], [data-toggle="tooltip"], [popover], [uib-popover], [uib-popover-html], [uib-tooltip]';
  const clsOf = e => String((e.className && e.className.baseVal !== undefined) ? e.className.baseVal : e.className || '');
  const icons = Array.from(scope.querySelectorAll(SEL)).filter(vis).filter(e => {
    if (e.closest(NAV)) return false;
    if (/asterisk|infotitulo/.test(clsOf(e))) return false;
    const r = e.getBoundingClientRect();
    return r.width <= 40 && r.height <= 40;
  }).slice(0, ${HELP_MAX_PER_SCREEN});
  return JSON.stringify(icons.map((el, n) => {
    const stamp = 'data-orion-audit-help-${token}-' + n;
    el.setAttribute(stamp, '1');
    const r = el.getBoundingClientRect();
    let anchor = '';
    const host = el.closest('label, legend, h1, h2, h3, h4, h5, h6, .panel-title, .control-label, .form-group') || el.parentElement;
    if (host) anchor = (host.innerText || '').replace(/\\s+/g, ' ').trim();
    if (anchor.length > 80 && el.parentElement) anchor = (el.parentElement.innerText || '').replace(/\\s+/g, ' ').trim();
    return { n, selector: '[' + stamp + ']', anchorLabel: anchor.slice(0, 80), box: { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) } };
  }));
})()`;
}

const READ_BALLOON_SCRIPT = `
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const clean = t => String(t || '').replace(/\\s+/g, ' ').trim();
  const pop = Array.from(document.querySelectorAll('.popover, [role="tooltip"].popover')).filter(vis)[0];
  if (pop) {
    const t = pop.querySelector('.popover-title, .popover-header');
    const c = pop.querySelector('.popover-content, .popover-body');
    return JSON.stringify({ title: clean(t && t.innerText), text: clean(c ? c.innerText : pop.innerText) });
  }
  const tip = Array.from(document.querySelectorAll('.tooltip, [role="tooltip"]')).filter(vis)[0];
  if (tip) return JSON.stringify({ title: '', text: clean((tip.querySelector('.tooltip-inner') || tip).innerText) });
  return null;
})()`;

/**
 * Coleta os balões de ajuda da tela ativa. `seen` evita repetir o mesmo texto no mesmo roteiro.
 * Nunca clica: apenas `hover` e `mouseMove` para uma coordenada neutra.
 */
export async function collectHelpTooltips(client: AgentBrowserClient, seen: Set<string>): Promise<HelpTooltip[]> {
  const token = Math.random().toString(36).slice(2, 10);
  const icons = await client.evalJson<RawHelpIcon[]>(buildHelpIconScript(token));
  if (!icons || icons.length === 0) return [];

  const out: HelpTooltip[] = [];
  for (const icon of icons) {
    try {
      await client.hover(icon.selector);
      await client.wait(600);
      const balloon = await client.evalJson<{ title: string; text: string }>(READ_BALLOON_SCRIPT);
      if (balloon && balloon.text) {
        const key = `${balloon.title}|${balloon.text}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push({
            anchorLabel: balloon.title || icon.anchorLabel,
            title: balloon.title || undefined,
            text: balloon.text,
            box: icon.box
          });
        }
      }
    } catch {
      // ícone sem balão legível: ignora, nunca bloqueia a auditoria
    } finally {
      try {
        await client.mouseMove(2, 2);
        await client.wait(200);
      } catch {
        /* ponteiro já fora */
      }
    }
  }
  return out;
}
