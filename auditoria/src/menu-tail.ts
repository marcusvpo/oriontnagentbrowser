/**
 * Cauda de caminho de menu como aba/seção da tela alcançada (ADR-029).
 *
 * Quando a equivalência canônica resolve `Administração > Parâmetros > Captura e digitalização` para a tela real
 * `Configurações > Parametrizações`, o último segmento do manual é uma ABA dessa tela. Depois do clique da folha o
 * executor chama `resolveMenuTail`, que:
 *   1. lê as abas/seções reais da tela (somente leitura);
 *   2. procura o segmento pelo texto exato, por sinônimo contextual da rota (`route-synonyms.ts`) ou por chave de
 *      folha igual (plural/acento, `menu-canonical.ts`) — nunca por similaridade textual solta;
 *   3. mede o nó ao vivo (`getBoundingClientRect()`) e entrega a geometria para a sub-captura `passo-NN-b`.
 * O clique na aba é dado pelo executor (abrir uma aba não grava nada). Sem aba medida, o resultado é `missing` com a
 * lista real de abas, que vira a evidência do bloqueio `[ATT]`.
 */
import type { AgentBrowserClient } from './browser.js';
import { leafKey } from './menu-canonical.js';
import { routeSynonymsFor } from './route-synonyms.js';
import { stampByTextAndMeasure } from './stateful-step-engine.js';
import type { DOMResolvedGeometry } from './types.js';

export interface MenuTailOutcome {
  status: 'found' | 'missing';
  /** Segmento citado pelo manual */
  segment: string;
  /** Rótulo real medido (pode diferir do documentado) */
  real?: string;
  via?: 'exact' | 'route_synonym' | 'leaf_key';
  evidence?: string;
  geometry?: DOMResolvedGeometry | null;
  selector?: string;
  rawPath?: string;
  /** Abas/seções reais lidas na tela */
  screenLabels: string[];
  hash: string;
}

/** Abas, itens de painel lateral de conteúdo e cabeçalhos de seção visíveis (fora do menu superior). */
export async function readScreenSectionLabels(client: AgentBrowserClient): Promise<{ hash: string; labels: string[] }> {
  const out = await client.evalJson<{ hash: string; labels: string[] }>(`
    (() => {
      const TOP = 'header, nav.navbar, .navbar-fixed-top, #navbar';
      const clean = t => String(t == null ? '' : t).replace(/[ \\t\\r\\n]+/g, ' ').trim();
      const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const sel = '.nav-tabs a, .nav-pills a, [role="tab"], a[data-toggle="tab"], aside a, .sidebar a, .nav-stacked a, legend, .panel-heading, .accordion-toggle, h3, h4, h5';
      const labels = [];
      for (const e of Array.from(document.querySelectorAll(sel))) {
        if (!vis(e) || e.closest(TOP)) continue;
        const t = clean(e.innerText || e.textContent);
        if (t && t.length <= 80 && !labels.includes(t)) labels.push(t);
      }
      return JSON.stringify({ hash: window.location.hash || '', labels: labels.slice(0, 80) });
    })()
  `);
  return out && Array.isArray(out.labels) ? out : { hash: '', labels: [] };
}

const sameKey = (a: string[], b: string[]) => a.length > 0 && a.length === b.length && a.every((w, i) => w === b[i]);

/**
 * Resolve o PRIMEIRO segmento da cauda na tela atual. Não clica. As abas de Parametrizações vivem num painel
 * lateral de conteúdo, tratado como aba (só o menu superior fica de fora da leitura).
 */
export async function resolveMenuTail(
  client: AgentBrowserClient,
  segment: string,
  opts: { rawPathFor?: (suffix: string) => string; getNextLetter?: () => string } = {}
): Promise<MenuTailOutcome> {
  await client.wait(1200);
  const { hash, labels } = await readScreenSectionLabels(client);
  const findLabel = (text: string) => labels.find(l => l.toLowerCase() === text.toLowerCase());

  // Ordem de confiança: texto idêntico, sinônimo contextual da rota, mesma chave de folha (plural/acento)
  const candidates: Array<{ real: string; via: NonNullable<MenuTailOutcome['via']>; evidence?: string }> = [];
  const identical = findLabel(segment);
  if (identical) candidates.push({ real: identical, via: 'exact' });
  for (const syn of routeSynonymsFor(hash, segment)) {
    for (const real of syn.real) {
      const label = findLabel(real);
      if (label) candidates.push({ real: label, via: 'route_synonym', evidence: syn.evidence });
    }
  }
  const key = leafKey(segment);
  for (const l of labels) {
    if (sameKey(leafKey(l), key)) candidates.push({ real: l, via: 'leaf_key' });
  }

  const seen = new Set<string>();
  for (const cand of candidates) {
    if (seen.has(cand.real)) continue;
    seen.add(cand.real);
    const measured = await stampByTextAndMeasure(client, [{ label: cand.real, textMatch: cand.real, inSidebar: true, exactOnly: true }], 'any');
    if (!measured.geometry || measured.selectors.length === 0) continue;
    let rawPath: string | undefined;
    if (opts.rawPathFor && opts.getNextLetter) {
      rawPath = opts.rawPathFor(opts.getNextLetter());
      await client.screenshot(rawPath);
    }
    return {
      status: 'found',
      segment,
      real: cand.real,
      via: cand.via,
      evidence: cand.evidence,
      geometry: measured.geometry,
      selector: measured.selectors[0].selector,
      rawPath,
      screenLabels: labels,
      hash
    };
  }
  return { status: 'missing', segment, screenLabels: labels, hash };
}

/** Frase de evidência do bloqueio quando a cauda não existe como aba/seção da tela real. */
export function describeMenuTailMissing(realChain: string[], outcome: MenuTailOutcome): string {
  const labels = outcome.screenLabels.length > 0 ? outcome.screenLabels.map(l => `"${l}"`).join(', ') : '(nenhuma aba ou seção lida)';
  return (
    `O caminho de menu real **${realChain.join(' > ')}** foi aberto (rota ${outcome.hash || 'desconhecida'}), mas a tela não tem a aba/seção "${outcome.segment}" citada pelo manual. ` +
    `Abas e seções lidas ao vivo na tela: ${labels}.`
  );
}
