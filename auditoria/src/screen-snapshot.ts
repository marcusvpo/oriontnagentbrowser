/**
 * Snapshot estrutural leve da tela real + Confronto Semântico com a Descrição e os passos (ADR-020).
 *
 * O comparador é determinístico (sem LLM) e só emite divergência com DUAS evidências: o trecho do manual
 * e o trecho do DOM. Nada é inventado: tudo o que sai aqui foi lido da tela ao vivo.
 */
import { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { normalizeText } from './smart-locator.js';
import type { ParsedRoutine } from './types.js';

export interface ScreenSnapshot {
  hash: string;
  /** Título do painel/tela (cabeçalho visível, fora da navegação) */
  title: string;
  headings: string[];
  columns: string[];
  /** Até 3 valores reais da primeira coluna da grade */
  firstColumnValues: string[];
  /** Rótulos de campos do formulário visível */
  labels: string[];
  /** Unidades lidas dos rótulos, ex.: `(cm)` */
  units: string[];
}

export interface EditorialDivergence {
  kind: 'unit' | 'examples' | 'concept';
  /** Passo da rotina que carrega o trecho do manual (ausente = só Descrição/Observações) */
  stepNumber?: number;
  manualExcerpt: string;
  domEvidence: string;
  /** Texto da nota no relatório (já com as duas evidências) */
  message: string;
}

const SNAPSHOT_SCRIPT = `
(() => {
  const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const clean = t => String(t || '').replace(/\\s+/g, ' ').trim();
  const modal = Array.from(document.querySelectorAll('.modal.in, .modal.show, [role="dialog"]')).find(vis);
  const scope = modal || document;
  const inNav = e => !!e.closest(NAV) || !!e.closest('.navbar, header');
  const heads = Array.from(scope.querySelectorAll('h1, h2, h3, h4, legend, .panel-title, .panel-heading')).filter(vis).filter(e => !inNav(e)).map(e => clean(e.innerText)).filter(Boolean);
  const ths = Array.from(scope.querySelectorAll('table th, [role="columnheader"]')).filter(vis).filter(e => !inNav(e)).map(e => clean(e.innerText));
  const rows = Array.from(scope.querySelectorAll('table tbody tr')).filter(vis).filter(r => !inNav(r) && r.querySelector('td'));
  const firstVals = rows.slice(0, 3).map(r => clean(r.querySelector('td').innerText)).filter(Boolean);
  const labels = Array.from(scope.querySelectorAll('label, .control-label')).filter(vis).filter(e => !inNav(e)).map(e => clean(e.innerText)).filter(Boolean);
  return JSON.stringify({ hash: location.hash || '', headings: heads.slice(0, 12), columns: ths, firstColumnValues: firstVals, labels: Array.from(new Set(labels)).slice(0, 60) });
})()`;

export async function readScreenSnapshot(client: AgentBrowserClient): Promise<ScreenSnapshot | null> {
  const raw = await client.evalJson<Omit<ScreenSnapshot, 'title' | 'units'> & { headings: string[] }>(SNAPSHOT_SCRIPT);
  if (!raw) return null;
  const units = new Set<string>();
  for (const l of raw.labels) {
    for (const m of l.matchAll(/\(([a-zA-Zµ%²³]{1,4})\)/g)) units.add(m[1].toLowerCase());
  }
  return {
    ...raw,
    title: raw.headings[0] || '',
    units: Array.from(units)
  };
}

/** Chave estável para não guardar a mesma tela duas vezes. */
export function snapshotKey(s: ScreenSnapshot): string {
  return [s.hash, s.title, s.columns.join(','), s.labels.slice(0, 6).join(',')].join('|');
}

// ---------------------------------------------------------------------------
// Confronto semântico
// ---------------------------------------------------------------------------

const STOP = new Set(['para', 'como', 'sobre', 'entre', 'ainda', 'cada', 'esta', 'este', 'essa', 'esse', 'seus', 'suas', 'qualquer']);
const stem = (w: string) => normalizeText(w).replace(/[^a-z0-9]/g, '').slice(0, 6);

function excerptAround(text: string, rx: RegExp, radius = 60): string {
  const m = rx.exec(text);
  if (!m) return '';
  let a = Math.max(0, m.index - radius);
  let b = Math.min(text.length, m.index + m[0].length + radius);
  // Ajusta ao limite de palavra: o trecho nunca começa nem termina no meio de uma palavra
  while (a > 0 && a < m.index && /\S/.test(text[a - 1]) && /\S/.test(text[a])) a++;
  while (b < text.length && b > m.index + m[0].length && /\S/.test(text[b - 1]) && /\S/.test(text[b])) b--;
  return (a > 0 ? '…' : '') + text.slice(a, b).replace(/\s+/g, ' ').trim() + (b < text.length ? '…' : '');
}

function stepContaining(parsed: ParsedRoutine, rx: RegExp): number | undefined {
  for (const s of parsed.steps) {
    const hay = [s.rawText, ...(s.subItems || [])].join(' ');
    if (rx.test(hay)) return s.stepNumber;
  }
  return undefined;
}

/** Une os snapshots das telas visitadas no vocabulário real da tela. */
function screenVocabulary(snaps: ScreenSnapshot[]): { words: Set<string>; text: string } {
  const parts = snaps.flatMap(s => [s.title, ...s.headings, ...s.columns, ...s.firstColumnValues, ...s.labels]);
  const words = new Set<string>();
  for (const p of parts) for (const w of normalizeText(p).split(/\s+/)) if (w.length >= 4) words.add(stem(w));
  return { words, text: parts.join(' ') };
}

export function compareManualWithScreens(parsed: ParsedRoutine, snaps: ScreenSnapshot[]): EditorialDivergence[] {
  const out: EditorialDivergence[] = [];
  if (snaps.length === 0) return out;
  const manualBlob = [parsed.descricao, ...parsed.steps.flatMap(s => [s.rawText, ...(s.subItems || [])]), ...parsed.observacoes].join('\n');
  const vocab = screenVocabulary(snaps);
  const screenUnits = new Set(snaps.flatMap(s => s.units));
  const measureLabels = snaps.flatMap(s => s.labels).filter(l => /\((mm|cm|m|px|pol|in)\)/i.test(l));

  // (a) Unidade de medida: o manual cita mm; os rótulos reais medem em outra unidade
  const mm = /\b(mil[ií]metros?|mm)\b/i;
  const cmReal = screenUnits.has('cm') && !screenUnits.has('mm');
  if (mm.test(manualBlob) && cmReal) {
    const rx = /\b(mil[ií]metros?|mm)\b/i;
    const excerpt = excerptAround(manualBlob, rx);
    const sample = measureLabels.filter(l => /\(cm\)/i.test(l)).slice(0, 3).join(' · ');
    out.push({
      kind: 'unit',
      stepNumber: stepContaining(parsed, rx),
      manualExcerpt: excerpt,
      domEvidence: sample,
      message: `o manual cita medidas em **milímetros** ("${excerpt}"), mas os rótulos reais da tela medem em **centímetros (cm)**: ${sample}.`
    });
  }

  // (b) Exemplos de registros citados entre aspas que não existem na grade real
  const realValues = snaps.flatMap(s => s.firstColumnValues);
  if (realValues.length > 0) {
    const quoted = Array.from(manualBlob.matchAll(/['"“‘]([^'"”’\n]{4,60})['"”’]/g)).map(m => m[1].trim());
    const examples = quoted.filter(q => /\d|\s/.test(q) && !/^\*\*/.test(q));
    const realNorm = realValues.map(v => normalizeText(v));
    const missing = examples.filter(q => !realNorm.some(r => r && (r.includes(normalizeText(q)) || normalizeText(q).includes(r))));
    if (examples.length > 0 && missing.length === examples.length) {
      const first = missing[0];
      const rx = new RegExp(first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      out.push({
        kind: 'examples',
        stepNumber: stepContaining(parsed, rx),
        manualExcerpt: missing.slice(0, 2).map(m => `'${m}'`).join(', '),
        domEvidence: realValues.map(v => `'${v}'`).join(', '),
        message: `os exemplos de registros do manual (${missing.slice(0, 2).map(m => `'${m}'`).join(', ')}) não existem na grade real, cujos primeiros registros são ${realValues.map(v => `**${v}**`).join(', ')}.`
      });
    }
  }

  // (c) Conceito: o substantivo-núcleo que a Descrição diz cadastrar/gerenciar não aparece em nenhum texto da tela
  const entity = /(?:cadastrar|gerenciar|configurar|consultar|visualizar)(?:\s+e\s+\w+)?\s+(?:os\s+|as\s+|o\s+|a\s+|um\s+|uma\s+)?([\p{L}]{4,}(?:\s+(?:de|do|da|dos|das)\s+[\p{L}]{4,})?)/iu.exec(
    parsed.descricao
  );
  if (entity) {
    const phrase = entity[1].trim();
    const sig = phrase.split(/\s+/).filter(w => w.length >= 5 && !STOP.has(normalizeText(w)));
    if (sig.length >= 2 && sig.every(w => !vocab.words.has(stem(w)))) {
      const title = snaps.map(s => s.title).find(Boolean) || '';
      const cols = snaps.flatMap(s => s.columns).filter(Boolean).slice(0, 4).join(', ');
      const vals = realValues.slice(0, 3).join(', ');
      const dom = [title && `título **${title}**`, cols && `colunas ${cols}`, vals && `registros ${vals}`].filter(Boolean).join('; ');
      const stems5 = sig.map(w => normalizeText(w).slice(0, 5));
      const attach = parsed.steps.find(st =>
        normalizeText([st.rawText, ...(st.subItems || [])].join(' '))
          .split(/\s+/)
          .some(w => w.length >= 5 && stems5.includes(w.slice(0, 5)))
      );
      out.push({
        kind: 'concept',
        stepNumber: attach?.stepNumber,
        manualExcerpt: phrase,
        domEvidence: dom,
        message: `a Descrição trata de **${phrase}**, termos que não aparecem em nenhum texto da tela real (${dom}). A tela usa outra nomenclatura para o mesmo recurso; confirme o conceito com a Produtos.`
      });
    }
  }
  return out;
}
