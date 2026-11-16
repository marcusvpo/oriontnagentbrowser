/**
 * Sonda SOMENTE-LEITURA (ADR-020): despeja o DOM real da 1ª linha da grade de M-25.0 e dos ícones
 * informativos "i" do formulário de Adicionar. Não clica em ação de linha nem grava nada.
 * Uso: npx --prefix auditoria tsx auditoria/src/probe-grid-icons.ts [#/rota]
 */
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';

const GRID_SCRIPT = `
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const rows = Array.from(document.querySelectorAll('table tbody tr, [role="row"]')).filter(vis).filter(r => r.querySelector('td, [role="gridcell"]'));
  const headers = Array.from(document.querySelectorAll('table th, [role="columnheader"]')).filter(vis).map(e => (e.innerText || '').trim());
  const first = rows[0];
  const info = { url: location.hash, title: (document.querySelector('h1,h2,h3,.panel-title,legend')||{}).innerText || '', headers, rowCount: rows.length, firstCells: [], actions: [] };
  if (!first) return JSON.stringify(info);
  info.firstCells = Array.from(first.querySelectorAll('td')).map(td => (td.innerText || '').trim().slice(0, 60));
  info.rowHtml = first.outerHTML.slice(0, 3000);
  const nodes = Array.from(first.querySelectorAll('button, a, i, em, span[class*="fa"], span[class*="glyphicon"], [class*="halflings"], [role="button"]')).filter(vis);
  nodes.forEach((el, n) => {
    el.setAttribute('data-probe-' + n, '1');
    const r = el.getBoundingClientRect();
    info.actions.push({ n, tag: el.tagName, cls: el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className, title: el.getAttribute('title'), dot: el.getAttribute('data-original-title'), aria: el.getAttribute('aria-label'), text: (el.innerText || '').trim(), box: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) } });
  });
  return JSON.stringify(info);
})()`;

const TOOLTIP_SCRIPT = `
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const t = Array.from(document.querySelectorAll('.tooltip, .popover, [role="tooltip"], .mat-tooltip, .tooltip-inner, .popover-content, [class*="tooltip"], [class*="popover"]')).filter(vis);
  return JSON.stringify(t.map(e => ({ cls: e.className, text: (e.innerText || '').trim().slice(0, 300), html: e.outerHTML.slice(0, 400) })));
})()`;

const INFO_SCRIPT = `
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const sel = '[data-toggle="tooltip"], [data-toggle="popover"], [data-original-title], [class*="info"], [class*="help"], [class*="question"], [tooltip], [ngbtooltip], [mattooltip], [title]';
  const els = Array.from(document.querySelectorAll(sel)).filter(vis).filter(e => !e.closest('.navbar, nav, aside'));
  return JSON.stringify(els.slice(0, 40).map((el, n) => { el.setAttribute('data-probe-info-' + n, '1'); const r = el.getBoundingClientRect(); return { n, tag: el.tagName, cls: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).slice(0,120), title: el.getAttribute('title'), dot: el.getAttribute('data-original-title'), text: (el.innerText||'').trim().slice(0,60), parent: (el.parentElement && (el.parentElement.innerText||'').trim().slice(0,80)), box: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) } }; }));
})()`;

async function main() {
  const route = process.argv[2] || '#/configuracaoImpressaoModelo';
  const client = new AgentBrowserClient({ headless: true, sessionId: 'probe-grid-icons', deviceScaleFactor: 1 });
  if (!(await ensureAuthenticated(client))) throw new Error('Falha de autenticação');
  await client.setViewport(1440, 900);
  await client.jumpHash(route);
  await client.wait(2500);

  const grid = await client.evalJson<any>(GRID_SCRIPT);
  console.log('=== GRADE ===');
  console.log(JSON.stringify(grid, null, 2));

  for (const a of grid?.actions ?? []) {
    try {
      await client.hover(`[data-probe-${a.n}]`);
      await client.wait(700);
      const tip = await client.evalJson<any[]>(TOOLTIP_SCRIPT);
      console.log(`--- hover ação #${a.n} (${a.tag}.${a.cls}) -> tooltips:`, JSON.stringify(tip));
    } catch (e: any) {
      console.log(`--- hover ação #${a.n} falhou: ${String(e.message).slice(0, 120)}`);
    }
  }
  await client.mouseMove(5, 5);

  // Formulário de Adicionar (apenas abre; não grava)
  const clicked = await client.evalJson<any>(`
    (() => {
      const b = Array.from(document.querySelectorAll('button, a')).find(e => /^\\s*adicionar/i.test((e.innerText || e.getAttribute('title') || '')));
      if (!b) return JSON.stringify({ ok: false });
      b.setAttribute('data-probe-add', '1');
      return JSON.stringify({ ok: true, text: (b.innerText || '').trim() });
    })()`);
  console.log('=== ADICIONAR ===', JSON.stringify(clicked));
  if (clicked?.ok) {
    await client.click('[data-probe-add]');
    await client.wait(2000);
    const info = await client.evalJson<any[]>(INFO_SCRIPT);
    console.log('=== CANDIDATOS A ÍCONE INFORMATIVO ===');
    console.log(JSON.stringify(info, null, 2));
    const labels = await client.evalJson<string[]>(`JSON.stringify(Array.from(document.querySelectorAll('label, h1, h2, h3, h4, legend, .panel-title')).filter(e => e.getBoundingClientRect().width > 1).map(e => (e.innerText||'').trim()).filter(Boolean).slice(0, 60))`);
    console.log('=== RÓTULOS/TÍTULOS ===', JSON.stringify(labels));
    for (const i of (info ?? []).filter(x => x.box.w <= 40 && x.box.h <= 40).slice(0, 8)) {
      try {
        await client.hover(`[data-probe-info-${i.n}]`);
        await client.wait(700);
        console.log(`--- hover info #${i.n} (${i.cls}) ->`, JSON.stringify(await client.evalJson<any[]>(TOOLTIP_SCRIPT)));
      } catch (e: any) {
        console.log(`--- hover info #${i.n} falhou: ${String(e.message).slice(0, 120)}`);
      }
    }
    await client.mouseMove(5, 5);
  }
  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
