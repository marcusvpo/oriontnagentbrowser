import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';

export interface TrueFullPageResult {
  captured: boolean;
  path: string | null;
  width: number;
  height: number;
  tallerThanViewport: boolean;
  method: 'native_full' | 'expanded_container_full' | 'stitched_scroll' | 'viewport_only';
}

interface OverflowProbe {
  zoom: number;
  scrollHeight: number;
  clientHeight: number;
  effectiveClientHeight: number;
  hasDocumentOverflow: boolean;
  innerContainersCount: number;
  maxScrollNeeded: number;
}

const PROBE_OVERFLOW_SCRIPT = `
  (() => {
    const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
    const NAV_SEL = ${JSON.stringify(NAV_ZONE_SELECTOR)};
    const vis = e => {
      if (!e || !e.getBoundingClientRect) return false;
      const r = e.getBoundingClientRect();
      const s = window.getComputedStyle(e);
      return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && !e.closest('.ng-hide');
    };
    const activeModals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
    const modalRoot = activeModals.length > 0 ? activeModals[activeModals.length - 1] : null;
    const contentRoot =
      modalRoot ||
      document.querySelector('#content, main, [role="main"], .main-content, .content-wrapper, .page-content') ||
      document.body;
    const isGlobal = el => {
      if (!el || !el.closest) return false;
      if (modalRoot && el.closest(MODAL_SEL) === modalRoot) {
        return !!el.closest('.navbar, header, footer, .footer, .rodape');
      }
      return !!el.closest(NAV_SEL + ', .navbar, header, footer, .footer, .rodape');
    };

    const docEl = document.documentElement;
    const zoom = parseFloat(window.getComputedStyle(docEl).zoom || '1') || 1;
    const scrollHeight = Math.max(docEl ? docEl.scrollHeight : 0, document.body ? document.body.scrollHeight : 0);
    const clientHeight = docEl ? docEl.clientHeight : window.innerHeight || 900;
    const effectiveClientHeight = Math.round(clientHeight / zoom);
    const hasDocumentOverflow = scrollHeight > effectiveClientHeight + 60;

    let innerContainersCount = 0;
    let maxInnerExtra = 0;
    for (const el of Array.from(contentRoot.querySelectorAll('*'))) {
      if (!vis(el) || isGlobal(el)) continue;
      const st = window.getComputedStyle(el);
      if ((st.overflowY === 'auto' || st.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 40) {
        innerContainersCount++;
        maxInnerExtra = Math.max(maxInnerExtra, el.scrollHeight - el.clientHeight);
      }
    }

    return JSON.stringify({
      zoom,
      scrollHeight,
      clientHeight,
      effectiveClientHeight,
      hasDocumentOverflow,
      innerContainersCount,
      maxScrollNeeded: Math.max(scrollHeight, effectiveClientHeight + maxInnerExtra)
    });
  })()
`;

const EXPAND_INNER_CONTAINERS_SCRIPT = `
  (() => {
    const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
    const NAV_SEL = ${JSON.stringify(NAV_ZONE_SELECTOR)};
    const vis = e => {
      if (!e || !e.getBoundingClientRect) return false;
      const r = e.getBoundingClientRect();
      const s = window.getComputedStyle(e);
      return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && !e.closest('.ng-hide');
    };
    const activeModals = Array.from(document.querySelectorAll(MODAL_SEL)).filter(vis);
    const modalRoot = activeModals.length > 0 ? activeModals[activeModals.length - 1] : null;
    const contentRoot =
      modalRoot ||
      document.querySelector('#content, main, [role="main"], .main-content, .content-wrapper, .page-content') ||
      document.body;
    const isGlobal = el => {
      if (!el || !el.closest) return false;
      if (modalRoot && el.closest(MODAL_SEL) === modalRoot) {
        return !!el.closest('.navbar, header, footer, .footer, .rodape');
      }
      return !!el.closest(NAV_SEL + ', .navbar, header, footer, .footer, .rodape');
    };

    const patched = [];
    const candidates = modalRoot ? [modalRoot, ...Array.from(contentRoot.querySelectorAll('*'))] : Array.from(contentRoot.querySelectorAll('*'));
    for (const el of candidates) {
      if (!vis(el) || isGlobal(el)) continue;
      const st = window.getComputedStyle(el);
      if ((st.overflowY === 'auto' || st.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 40) {
        el.setAttribute('data-orion-l25-prev-style', el.getAttribute('style') || '');
        el.style.setProperty('max-height', 'none', 'important');
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('overflow-y', 'visible', 'important');
        patched.push(el.tagName);
      }
    }
    return JSON.stringify(patched.length);
  })()
`;

const RESTORE_INNER_CONTAINERS_SCRIPT = `
  (() => {
    const nodes = Array.from(document.querySelectorAll('[data-orion-l25-prev-style]'));
    for (const el of nodes) {
      const prev = el.getAttribute('data-orion-l25-prev-style');
      el.removeAttribute('data-orion-l25-prev-style');
      if (prev) el.setAttribute('style', prev);
      else el.removeAttribute('style');
    }
    return JSON.stringify(nodes.length);
  })()
`;

async function readPngDims(filePath: string): Promise<{ width: number; height: number }> {
  try {
    const meta = await sharp(filePath).metadata();
    return { width: meta.width ?? 0, height: meta.height ?? 0 };
  } catch {
    return { width: 0, height: 0 };
  }
}

/**
 * Fallback por costura vertical com Sharp caso `screenshot --full` retorne apenas a altura do viewport
 * ou quando um container interno não puder ser expandido via layout.
 */
async function stitchDocumentScrollWithSharp(
  client: AgentBrowserClient,
  outputPath: string,
  maxScrollSlices = 10
): Promise<{ width: number; height: number } | null> {
  const tmpDir = path.join(path.dirname(outputPath), '.tmp-stitch');
  fs.mkdirSync(tmpDir, { recursive: true });
  const tempFiles: string[] = [];

  try {
    const metrics = await client.evalJson<{ scrollHeight: number; viewportH: number }>(`
      (() => {
        const docEl = document.documentElement;
        const zoom = parseFloat(window.getComputedStyle(docEl).zoom || '1') || 1;
        const sh = Math.round(Math.max(docEl.scrollHeight, document.body.scrollHeight) * zoom);
        const vh = window.innerHeight || 900;
        return JSON.stringify({ scrollHeight: sh, viewportH: vh });
      })()
    `);
    if (!metrics || metrics.scrollHeight <= metrics.viewportH + 30) {
      return null;
    }

    const stepPx = Math.max(200, metrics.viewportH - 80);
    const slices: Array<{ buf: Buffer; top: number; height: number; width: number }> = [];
    let scrollY = 0;

    for (let i = 0; i < maxScrollSlices; i++) {
      await client.eval(`window.scrollTo(0, ${scrollY}); true;`);
      await client.wait(150);
      const actualY =
        (await client.evalJson<number>('JSON.stringify(Math.round(window.scrollY || window.pageYOffset || 0))')) ??
        scrollY;
      const slicePath = path.join(tmpDir, `${path.basename(outputPath, '.png')}-s${i}.png`);
      tempFiles.push(slicePath);
      await client.screenshot(slicePath);
      const buf = await fs.promises.readFile(slicePath);
      const meta = await sharp(buf).metadata();
      slices.push({
        buf,
        top: actualY,
        height: meta.height ?? metrics.viewportH,
        width: meta.width ?? 1440
      });
      if (actualY + metrics.viewportH >= metrics.scrollHeight - 4) break;
      const nextY = scrollY + stepPx;
      if (nextY === scrollY) break;
      scrollY = nextY;
    }

    await client.eval('window.scrollTo(0, 0); true;').catch(() => undefined);

    if (slices.length <= 1) return null;

    const width = slices[0].width;
    const composites: sharp.OverlayOptions[] = [];
    let currentBottom = 0;
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i];
      if (i === 0) {
        composites.push({ input: s.buf, top: 0, left: 0 });
        currentBottom = s.height;
      } else {
        const expectedTop = Math.min(s.top, currentBottom);
        const overlap = Math.max(0, currentBottom - expectedTop);
        const cropTop = Math.min(s.height - 1, overlap);
        const cropHeight = s.height - cropTop;
        if (cropHeight > 10) {
          const cropped = await sharp(s.buf).extract({ left: 0, top: cropTop, width, height: cropHeight }).toBuffer();
          composites.push({ input: cropped, top: currentBottom, left: 0 });
          currentBottom += cropHeight;
        }
      }
    }

    await sharp({
      create: {
        width,
        height: currentBottom,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite(composites)
      .png()
      .toFile(outputPath);

    return { width, height: currentBottom };
  } finally {
    await client.eval('window.scrollTo(0, 0); true;').catch(() => undefined);
    for (const f of tempFiles) {
      fs.rmSync(f, { force: true });
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/**
 * Captura uma print Full-Page VERDADEIRA (página inteira + containers internos com scroll),
 * garantindo que telas maiores que 900px produzam PNGs realmente maiores que o viewport.
 */
export async function captureTrueFullPage(
  client: AgentBrowserClient,
  outputPath: string,
  options: { onlyIfOverflow?: boolean } = {}
): Promise<TrueFullPageResult> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const probe = await client.evalJson<OverflowProbe>(PROBE_OVERFLOW_SCRIPT).catch(() => null);
  const needsFull = !probe || probe.hasDocumentOverflow || probe.innerContainersCount > 0;

  if (options.onlyIfOverflow && !needsFull) {
    return {
      captured: false,
      path: null,
      width: 0,
      height: 0,
      tallerThanViewport: false,
      method: 'viewport_only'
    };
  }

  let patchedCount = 0;
  try {
    if (probe && probe.innerContainersCount > 0) {
      patchedCount = (await client.evalJson<number>(EXPAND_INNER_CONTAINERS_SCRIPT).catch(() => 0)) ?? 0;
      if (patchedCount > 0) {
        await client.wait(120);
      }
    }

    await client.eval('window.scrollTo(0, 0); true;').catch(() => undefined);
    await client.screenshotFullPage(outputPath);
    let dims = await readPngDims(outputPath);
    let method: TrueFullPageResult['method'] = patchedCount > 0 ? 'expanded_container_full' : 'native_full';

    // Se `--full` ainda devolveu <= 910px apesar de haver overflow no DOM, tentar costura vertical
    if (dims.height <= 910 && needsFull) {
      const stitched = await stitchDocumentScrollWithSharp(client, outputPath).catch(() => null);
      if (stitched && stitched.height > dims.height) {
        dims = stitched;
        method = 'stitched_scroll';
      }
    }

    return {
      captured: fs.existsSync(outputPath) && dims.height > 0,
      path: fs.existsSync(outputPath) ? outputPath : null,
      width: dims.width,
      height: dims.height,
      tallerThanViewport: dims.height > 910,
      method
    };
  } finally {
    if (patchedCount > 0) {
      await client.eval(RESTORE_INNER_CONTAINERS_SCRIPT).catch(() => undefined);
    }
    await client.eval('window.scrollTo(0, 0); true;').catch(() => undefined);
  }
}
