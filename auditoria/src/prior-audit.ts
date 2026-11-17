import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { config } from './config.js';
import { findRevisedMarkdownById } from './governance-disk.js';
import { isBlockingReviewStatus, reviewTagsFor, type ReviewTag } from './review-taxonomy.js';
import type { SmartLocatorDivergence } from './types.js';

/**
 * Reauditoria contextual (ADR-025). Antes de reexecutar uma rotina que já tem `-revisado.md` e/ou
 * `cache/kb-telemetry/<id>.json` em disco, o motor lê o que a auditoria anterior aprendeu:
 *
 *  - curas e caminhos de menu REAIS já comprovados, usados apenas como DICA de busca (o SmartLocator e o
 *    `menu-path.ts` as tentam e só valem se o nó for medido ao vivo de novo: a dica nunca é evidência);
 *  - o checkpoint onde a rotina parou (passo, causa, tag), para registrar se o novo ambiente o superou;
 *  - o histórico (`historico_reauditoria`) acumulado, que o relatório novo estende em vez de descartar.
 *
 * O carregamento TEM de acontecer antes da limpeza da pasta da rotina em `executeRoutineAudit` (o
 * `-revisado.md` sem tag é apagado no início da execução). Funções puras de parsing ficam separadas do
 * acesso a disco para os testes offline.
 */

/** Camadas de cura cujo par documentado → real vale como dica de busca. */
const HINTABLE_LAYERS = new Set<SmartLocatorDivergence['resolutionLayer']>([
  'dom_synonym_heuristic',
  'a11y_fuzzy_match',
  'llm_a11y_fallback',
  'visual_som_fallback',
  'visual_grounding_fallback',
  'investigative_reveal'
]);
/** Confiança mínima de uma cura anterior para virar dica (a mesma régua da Auto-Cura, `smart-locator.ts`). */
export const PRIOR_HINT_MIN_CONFIDENCE = 0.68;
const NOT_LOCATED = '(não localizado na tela)';
const MAX_HISTORY = 10;

export interface PriorTargetHint {
  stepNumber: number;
  documented: string;
  actual: string;
  layer: SmartLocatorDivergence['resolutionLayer'];
  confidence: number;
}

export interface PriorBlock {
  stepNumber?: number;
  /** `blockKind` da telemetria (manual_outdated, cross_routine, rbac, empty_data...) */
  kind?: string;
  tipo?: string;
  motivo?: string;
}

export interface PriorEditorial {
  kind: string;
  stepNumber?: number;
  manualExcerpt: string;
  domEvidence: string;
}

export interface ReauditHistoryEntry {
  data: string;
  ambiente_anterior: string;
  ambiente_atual: string;
  status_anterior: string;
  tags_anteriores: string[];
  status_atual: string;
  tags_atuais: string[];
  bloqueio_anterior?: { passo?: number; tipo?: string; motivo?: string };
  /** `null` quando a auditoria anterior não tinha bloqueio (nada a superar) */
  bloqueio_superado: boolean | null;
  bloqueio_atual?: { passo?: number; tipo?: string };
  /**
   * Curas e rotas da auditoria anterior. `confirmada_ao_vivo`: o MESMO par documentado→real foi medido de novo
   * nesta execução (por qualquer caminho do motor); `usada_como_dica`: a dica anterior é que localizou o nó.
   */
  curas_reaproveitadas: Array<{ passo: number; alvo: string; real: string; confirmada_ao_vivo: boolean; usada_como_dica: boolean }>;
  notas_editoriais_reconfirmadas: number;
  notas_editoriais_nao_reconfirmadas: number;
}

export interface PriorAuditContext {
  routineId: string;
  /** Havia relatório e/ou telemetria em disco */
  found: boolean;
  sourceFile?: string;
  status?: string;
  tags: ReviewTag[];
  ambiente?: string;
  data?: string;
  block?: PriorBlock;
  targetHints: PriorTargetHint[];
  menuChains: Array<{ stepNumber: number; chain: string[]; documented: string }>;
  editorial: PriorEditorial[];
  history: ReauditHistoryEntry[];
}

export const emptyPriorContext = (routineId: string): PriorAuditContext => ({
  routineId,
  found: false,
  tags: [],
  targetHints: [],
  menuChains: [],
  editorial: [],
  history: []
});

const asStr = (v: unknown): string => (v == null ? '' : String(v));
/** Colapsa espaços e ignora caixa/acentos: forma de comparação de rótulos entre execuções. */
const squash = (s: string): string => s.replace(/\s+/g, ' ').trim();
const flat = (s: string): string =>
  squash(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
const asNum = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function splitFrontmatter(markdown: string): { fm: any; body: string } {
  const normalized = markdown.replace(/\r\n/g, '\n');
  const m = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: null, body: normalized };
  try {
    return { fm: yaml.parse(m[1]) ?? null, body: m[2] };
  } catch {
    return { fm: null, body: m[2] };
  }
}

/**
 * Converte o conteúdo de um `-revisado.md` e a telemetria do executor do KB no contexto anterior. Pura:
 * sem acesso a disco nem a navegador. Qualquer campo ilegível é simplesmente omitido.
 */
export function parsePriorAudit(routineId: string, markdown: string | null, telemetry: unknown[] | null): PriorAuditContext {
  const ctx = emptyPriorContext(routineId);
  const { fm, body } = markdown ? splitFrontmatter(markdown) : { fm: null, body: '' };
  const ui = fm?.auditoria_ui;

  if (ui && typeof ui === 'object') {
    ctx.found = true;
    ctx.status = asStr(ui.status) || undefined;
    ctx.data = asStr(ui.data_execucao) || undefined;
    ctx.ambiente = asStr(ui.ambiente) || undefined;
    const tagList = Array.isArray(ui.review_tags) ? (ui.review_tags as unknown[]).map(asStr) : [];
    ctx.tags = (tagList.length > 0 ? (tagList as ReviewTag[]) : reviewTagsFor(ctx.status, [])) as ReviewTag[];

    const cures: any[] = Array.isArray(ui.auto_cura?.divergencias_detectadas) ? ui.auto_cura.divergencias_detectadas : [];
    for (const c of cures) {
      const step = asNum(c?.passo);
      // Espaços duplicados do DOM ("Novo cartão  +") não casam na medição nem na comparação: normaliza
      const documented = squash(asStr(c?.alvo_documentado));
      const actual = squash(asStr(c?.elemento_real));
      const layer = asStr(c?.camada) as SmartLocatorDivergence['resolutionLayer'];
      const confidence = asNum(c?.confianca) ?? 0;
      if (step === undefined || !documented || !actual || actual === NOT_LOCATED) continue;
      if (layer === 'menu_path_resolution') {
        // Rota real lida da árvore de navegação: `A > B > C`
        const chain = actual.split('>').map(s => s.trim()).filter(Boolean);
        if (chain.length >= 2 && confidence >= PRIOR_HINT_MIN_CONFIDENCE) ctx.menuChains.push({ stepNumber: step, chain, documented });
        continue;
      }
      if (HINTABLE_LAYERS.has(layer) && confidence >= PRIOR_HINT_MIN_CONFIDENCE) {
        ctx.targetHints.push({ stepNumber: step, documented, actual, layer, confidence });
      }
    }

    const editorial: any[] = Array.isArray(ui.divergencias_editoriais) ? ui.divergencias_editoriais : [];
    ctx.editorial = editorial.map(e => ({
      kind: asStr(e?.tipo),
      stepNumber: asNum(e?.passo),
      manualExcerpt: asStr(e?.trecho_manual),
      domEvidence: asStr(e?.evidencia_dom)
    }));

    if (Array.isArray(ui.historico_reauditoria)) {
      ctx.history = (ui.historico_reauditoria as any[]).map(h => ({
        ...h,
        tags_anteriores: Array.isArray(h?.tags_anteriores) ? h.tags_anteriores : [],
        tags_atuais: Array.isArray(h?.tags_atuais) ? h.tags_atuais : [],
        curas_reaproveitadas: Array.isArray(h?.curas_reaproveitadas) ? h.curas_reaproveitadas : []
      })) as ReauditHistoryEntry[];
    }

    if (isBlockingReviewStatus(ctx.status)) {
      ctx.block = {
        tipo: asStr(ui.tipo_bloqueio) || undefined,
        motivo: body.match(/\*\*Motivo Técnico:\*\*\s*([^\n]+)/)?.[1]?.trim() || undefined
      };
    }
  }

  // A telemetria diz ONDE a rotina parou (frame `blocked`) e por quê (`blockKind`)
  const records = Array.isArray(telemetry) ? (telemetry as any[]) : [];
  if (records.length > 0) ctx.found = true;
  const blocked = records.find(r => r?.status === 'blocked');
  if (blocked) {
    ctx.block = {
      ...(ctx.block || {}),
      stepNumber: asNum(blocked.stepNum),
      kind: asStr(blocked.blockKind) || undefined,
      motivo: ctx.block?.motivo || asStr(blocked.errorMessage) || undefined
    };
  }
  return ctx;
}

/** Carrega o contexto anterior da rotina do disco. Nunca lança: sem artefatos, `found: false`. */
export function loadPriorAuditContext(routineId: string): PriorAuditContext {
  try {
    const file = findRevisedMarkdownById(routineId);
    const markdown = file ? fs.readFileSync(file, 'utf8') : null;
    let telemetry: unknown[] | null = null;
    const telemetryFile = path.join(config.rootDir, 'auditoria', 'cache', 'kb-telemetry', `${routineId}.json`);
    if (fs.existsSync(telemetryFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(telemetryFile, 'utf8'));
        telemetry = Array.isArray(raw) ? raw : null;
      } catch {
        telemetry = null;
      }
    }
    const ctx = parsePriorAudit(routineId, markdown, telemetry);
    if (file) ctx.sourceFile = file;
    return ctx;
  } catch {
    return emptyPriorContext(routineId);
  }
}

export const hintsForStep = (ctx: PriorAuditContext, stepNumber: number): PriorTargetHint[] =>
  ctx.targetHints.filter(h => h.stepNumber === stepNumber);

export const chainsForStep = (ctx: PriorAuditContext, stepNumber: number): string[][] =>
  ctx.menuChains.filter(c => c.stepNumber === stepNumber).map(c => c.chain);

/** Linha de log do checkpoint: onde a rotina havia parado no ambiente anterior. */
export function describePriorCheckpoint(ctx: PriorAuditContext): string {
  if (!ctx.found) return 'sem auditoria anterior em disco (primeira execução)';
  const tags = ctx.tags.length > 0 ? ctx.tags.map(t => `[${t}]`).join('') : '(sem tag)';
  const where = ctx.block
    ? ` — parou ${ctx.block.stepNumber ? `no passo ${ctx.block.stepNumber}` : 'em passo não registrado'}${ctx.block.tipo ? ` (${ctx.block.tipo})` : ''}${ctx.block.motivo ? `: ${ctx.block.motivo.slice(0, 160)}` : ''}`
    : '';
  const reuse = `${ctx.targetHints.length} cura(s) e ${ctx.menuChains.length} rota(s) de menu comprovadas disponíveis como dica`;
  return `status anterior ${ctx.status || 'desconhecido'} ${tags}${where}; ${reuse}`;
}

export interface CurrentAuditSummary {
  status: string;
  tags: ReviewTag[];
  /** Passo e tipo do bloqueio desta execução (se houver) */
  block?: { stepNumber?: number; tipo?: string };
  /** Dicas anteriores que localizaram o nó nesta execução (`SmartLocatorResult.priorHint`) */
  confirmedHints: Array<{ stepNumber: number; documented: string; actual: string }>;
  /**
   * Todas as divergências documentado→real medidas AGORA (qualquer camada). Uma cura anterior conta como
   * reconfirmada se o mesmo par foi medido de novo, mesmo sem ter passado pela dica (ex.: grade, árvore A11y).
   */
  liveDivergences?: Array<{ stepNumber: number; documented: string; actual: string }>;
  /** Divergências editoriais comprovadas AGORA no DOM */
  editorial: Array<{ kind: string; stepNumber?: number }>;
}

/**
 * Monta a entrada do `historico_reauditoria`: comparativo objetivo entre a auditoria anterior e a atual.
 * `bloqueio_superado` é `true` quando a rotina deixou de ser bloqueada ou chegou a um passo posterior ao do
 * bloqueio anterior; `false` quando bloqueia no mesmo passo (ou antes); `null` sem bloqueio anterior.
 */
export function buildReauditHistoryEntry(prior: PriorAuditContext, current: CurrentAuditSummary, now = new Date()): ReauditHistoryEntry {
  const wasBlocked = isBlockingReviewStatus(prior.status);
  const isBlockedNow = isBlockingReviewStatus(current.status);
  let overcame: boolean | null = null;
  if (wasBlocked) {
    if (!isBlockedNow) overcame = true;
    else if (prior.block?.stepNumber !== undefined && current.block?.stepNumber !== undefined) overcame = current.block.stepNumber > prior.block.stepNumber;
    else overcame = false;
  }

  const pairKey = (step: number, documented: string, actual: string) => `${step}|${flat(documented)}|${flat(actual)}`;
  const usedKey = new Set(current.confirmedHints.map(h => pairKey(h.stepNumber, h.documented, h.actual)));
  const liveKey = new Set([...current.confirmedHints, ...(current.liveDivergences || [])].map(h => pairKey(h.stepNumber, h.documented, h.actual)));
  const reusedItems = [
    ...prior.targetHints.map(h => ({ passo: h.stepNumber, alvo: h.documented, real: h.actual })),
    // A rota de menu comprovada também é um aprendizado reaproveitado: "documentado" → cadeia real
    ...prior.menuChains.map(c => ({ passo: c.stepNumber, alvo: c.documented, real: c.chain.join(' > ') }))
  ];
  const reused = reusedItems.map(r => {
    const key = pairKey(r.passo, r.alvo, r.real);
    return { ...r, confirmada_ao_vivo: liveKey.has(key), usada_como_dica: usedKey.has(key) };
  });

  const editorialNow = new Set(current.editorial.map(e => `${e.kind}|${e.stepNumber ?? ''}`));
  const reconfirmed = prior.editorial.filter(e => editorialNow.has(`${e.kind}|${e.stepNumber ?? ''}`)).length;

  const entry: ReauditHistoryEntry = {
    data: now.toISOString().split('T')[0],
    ambiente_anterior: prior.ambiente || 'não registrado (anterior ao ADR-025)',
    ambiente_atual: config.envLabel,
    status_anterior: prior.status || 'nao_auditada',
    tags_anteriores: prior.tags,
    status_atual: current.status,
    tags_atuais: current.tags,
    bloqueio_superado: overcame,
    curas_reaproveitadas: reused,
    notas_editoriais_reconfirmadas: reconfirmed,
    notas_editoriais_nao_reconfirmadas: prior.editorial.length - reconfirmed
  };
  if (prior.block) entry.bloqueio_anterior = { passo: prior.block.stepNumber, tipo: prior.block.tipo, motivo: prior.block.motivo?.slice(0, 300) };
  if (current.block) entry.bloqueio_atual = { passo: current.block.stepNumber, tipo: current.block.tipo };
  return entry;
}

/** Histórico acumulado: o anterior mais a nova entrada, limitado às últimas 10. */
export function mergeHistory(prior: PriorAuditContext, entry: ReauditHistoryEntry): ReauditHistoryEntry[] {
  return [...prior.history, entry].slice(-MAX_HISTORY);
}
