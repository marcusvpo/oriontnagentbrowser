/**
 * Auditoria offline de coerência dos caminhos de menu (ADR-037) — passos 1 a 3 × catálogo canônico 06.05.02.
 *
 * SOMENTE LEITURA sobre `auditoria/rotinas/**` e `kb/**` (nenhum `-revisado.md` é tocado), sem navegador e sem rede.
 * Para cada rotina auditada (tag lida do nome da pasta) e, à parte, para cada rotina do KB ainda não auditada:
 *
 *   1. extrai a navegação dos passos 1 a 3: caminhos explícitos (`extractMenuPaths`, ADR-016) e telas citadas sem
 *      `>` (`detectImplicitScreenNavigation`, ADR-037);
 *   2. classifica cada uma contra o catálogo canônico (`menu-catalog.ts`): `exact`, `exact_with_spelling_drift`,
 *      `canonical_equivalence`, `single_segment`, `closed_semantic`, `ambiguous` ou `no_equivalent`;
 *   3. tria as rotinas `[ATT]`/`[XRX]` em filas de reauditoria: **A** (destravável por caminho canônico),
 *      **B** (bloqueio pós-navegação) e **C** (recurso/módulo sem equivalente na 06.05.02). `[DDD]` e `[CCC]` puros
 *      só são relatados; rotinas de hardware (`hardware-registry.ts`) nunca entram na Fila A.
 *
 * TRAVA DE EVIDÊNCIA (ADR-017/029): a cadeia "resolvida" aqui é só um CANDIDATO do catálogo; a reauditoria ao vivo
 * precisa lê-la na árvore real, medir e clicar antes de qualquer demarcação. Nada aqui reescreve o manual.
 *
 * Saídas: `auditoria/cache/menu-reaudit-queue.json` (máquina, ignorado pelo Git) e
 * `auditoria/reports/auditoria-caminhos-menus.md` (humano, versionado).
 *
 *   npx --prefix auditoria tsx auditoria/src/audit-menu-coherence.ts [--json-only] [--routines A,B]
 *
 * Com `--routines`, só o JSON parcial `menu-reaudit-queue-partial.json` é gravado (o relatório completo fica intacto).
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { config } from './config.js';
import { listHardwareRoutineIds, readDiskReports } from './hardware-registry.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import { canonNormalize, canonStem, isUserMenuRootLabel, resolveCanonicalMenuPath, type CanonicalMenuItem } from './menu-canonical.js';
import {
  catalogAsCanonicalItems,
  cleanScreenLabel,
  findExactPath,
  loadMenuCatalog,
  resolveClosedSemantic,
  resolveSingleSegmentScreen,
  USER_MENU_ROOT,
  type MenuCatalog
} from './menu-catalog.js';
import { detectImplicitScreenNavigation, IMPLICIT_NAV_MAX_STEP } from './menu-implicit-nav.js';
import { extractMenuPaths } from './menu-path.js';
import { extractBoldTargets, parseRoutineMarkdown } from './parser.js';
import { tagsFromPrefix, type ReviewTag } from './review-taxonomy.js';
import type { RoutineStep, WorkloadType } from './types.js';
import { classifyRoutineWorkload } from './worker-pool.js';

// ------------------------------------------------------------------------------------------------------------------
// Tipos
// ------------------------------------------------------------------------------------------------------------------

export type NavClassification =
  | 'exact'
  | 'exact_with_spelling_drift'
  | 'canonical_equivalence'
  | 'single_segment'
  | 'closed_semantic'
  | 'ambiguous'
  | 'no_equivalent';

/** Classes em que o catálogo oferece um destino único (candidato a confirmar ao vivo). */
export const RESOLVING_CLASSES: ReadonlySet<NavClassification> = new Set([
  'canonical_equivalence',
  'single_segment',
  'closed_semantic'
]);

export interface SpellingDrift {
  /** Posição do segmento na cadeia (0 = raiz) */
  segment: number;
  documented: string;
  catalog: string;
  /** Natureza da diferença literal */
  kinds: Array<'caixa' | 'acento' | 'plural_flexao' | 'espacamento_pontuacao'>;
}

export interface NavCheck {
  stepNumber: number;
  /** `explicit` = caminho com `>`; `implicit` = tela citada sem `>`; `routine` = nenhuma navegação nos passos 1–3 */
  kind: 'explicit' | 'implicit' | 'routine';
  /** Texto documentado (cadeia unida por ` > ` ou rótulo da tela) */
  documented: string;
  classification: NavClassification;
  resolvedChain?: string[];
  /** Segmentos do manual que sobram como aba/seção da tela alcançada (equivalência canônica) */
  tail?: string[];
  /** Base da resolução (`explicit_equivalence`, `generic_leaf_key`, `tail_as_screen_section`, `exact_leaf`...) */
  basis?: string;
  evidence: string;
  drift?: SpellingDrift[];
  /** Candidatos (ambíguo) ou vizinhos mais próximos do catálogo (sem equivalente) — laudo */
  candidates?: string[][];
}

export interface RoutineNavContext {
  modulo?: string;
  routineTitle?: string;
  /** Textos de todos os passos (contexto para homônimos e para a Camada 3) */
  stepTexts: string[];
}

export type BlockCause = 'menu_path' | 'missing_target' | 'empty_grid' | 'cross_routine' | 'environment' | 'other';

export interface BlockInfo {
  blockedStep: number | null;
  cause: BlockCause;
  tipoBloqueio: string;
  motivo: string;
  /** Rota em que o bloqueio aconteceu (Raio-X), quando registrada */
  route?: string;
  /** Cadeias de menu que a última auditoria já curou e confirmou ao vivo (por passo) */
  liveAppliedChains: Array<{ step: number; documented: string; real: string }>;
  /**
   * A última auditoria já resolveu a rota ao vivo e a Camada 4 (coerência pós-pouso, ADR-037) descartou a cura porque a
   * tela alcançada não contém os elementos dos passos seguintes: defasagem de CONTEÚDO do manual, não de rota.
   */
  landingRejected?: boolean;
}

export type QueueId = 'A' | 'B' | 'C';

export interface QueueDecision {
  queue: QueueId | null;
  reason: string;
  /** Navegação que decidiu a fila (A/C), quando houver */
  nav?: NavCheck;
  /** Sinal de dúvida para revisão do lote (ex.: equivalência já aplicada ao vivo) */
  doubt?: string;
  /** Fila A: `alta` = equivalência literal/canônica sem ressalvas; `revisar` = há `doubt` */
  confidence?: 'alta' | 'revisar';
  /** Fila C: navegação citada sem equivalente × tela pressuposta (passos 1–3 sem navegação) */
  subtype?: 'navegacao_sem_equivalente' | 'tela_pressuposta' | 'conteudo_defasado_pos_pouso';
}

// ------------------------------------------------------------------------------------------------------------------
// Classificação pura de uma navegação contra o catálogo
// ------------------------------------------------------------------------------------------------------------------

const pathText = (chain: string[]) => chain.join(' > ');
const squash = (s: string) => String(s ?? '').replace(/\s+/g, ' ').trim();
const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const stemSeq = (s: string) =>
  canonNormalize(s)
    .split(/[\s/]+/)
    .filter(Boolean)
    .map(canonStem)
    .join(' ');

function sameLiteral(catalogSeg: string, documentedSeg: string): boolean {
  if (catalogSeg === USER_MENU_ROOT) return isUserMenuRootLabel(documentedSeg);
  return squash(catalogSeg) === squash(documentedSeg);
}

function segmentDriftKinds(documented: string, catalog: string): SpellingDrift['kinds'] {
  const kinds: SpellingDrift['kinds'] = [];
  const d = squash(documented);
  const c = squash(catalog);
  if (canonNormalize(d) === canonNormalize(c)) {
    const noAccD = stripAccents(d);
    const noAccC = stripAccents(c);
    if (noAccD !== noAccC) {
      if (noAccD.toLowerCase() === noAccC.toLowerCase()) kinds.push('caixa');
      else kinds.push('espacamento_pontuacao');
    }
    if (d.toLowerCase() !== c.toLowerCase() && noAccD.toLowerCase() === noAccC.toLowerCase()) kinds.push('acento');
    if (kinds.length === 0) kinds.push('espacamento_pontuacao');
    return Array.from(new Set(kinds));
  }
  kinds.push('plural_flexao');
  return kinds;
}

/**
 * Procura no catálogo uma cadeia igual à documentada: literal (só espaços colapsados) -> `exact`; igual só depois de
 * normalizar caixa/acento/pontuação ou singular-plural -> `exact_with_spelling_drift` com as diferenças literais.
 */
export function findLiteralOrDrift(
  segments: string[],
  catalog: MenuCatalog
): { classification: 'exact' | 'exact_with_spelling_drift'; chain: string[]; drift: SpellingDrift[] } | null {
  const sameLen = catalog.nodes.filter(n => n.chain.length === segments.length);
  const literal = sameLen.find(n => n.chain.every((s, i) => sameLiteral(s, segments[i])));
  if (literal) return { classification: 'exact', chain: [...literal.chain], drift: [] };
  const viaNorm = findExactPath(segments, catalog);
  const node =
    viaNorm ??
    sameLen.find(n => n.chain.every((s, i) => (s === USER_MENU_ROOT ? isUserMenuRootLabel(segments[i]) : stemSeq(s) === stemSeq(segments[i])))) ??
    null;
  if (!node) return null;
  const drift: SpellingDrift[] = [];
  node.chain.forEach((s, i) => {
    if (sameLiteral(s, segments[i])) return;
    drift.push({ segment: i, documented: squash(segments[i]), catalog: s, kinds: segmentDriftKinds(segments[i], s) });
  });
  return { classification: 'exact_with_spelling_drift', chain: [...node.chain], drift };
}

/** A deriva só de caixa/acento/espaço é absorvida pela navegação ao vivo (comparação normalizada); plural não. */
export function driftIsCosmetic(drift: SpellingDrift[] | undefined): boolean {
  return (drift ?? []).every(d => !d.kinds.includes('plural_flexao'));
}

/**
 * Espelho do sinônimo de folha que o motor aplica ao vivo (`MENU_LEAF_SYNONYMS`, `menu-path.ts`, ADR-026): rota
 * obsoleta "Balcão de firmas" -> "Reconhecimento de firmas". Mantido aqui só para a triagem offline (a constante do
 * motor não é exportada); se ela mudar, atualize este espelho.
 */
const ENGINE_LEAF_SYNONYMS: Record<string, string> = {
  'balcao de firmas': 'Reconhecimento de firmas'
};

export function engineLeafSynonym(label: string): string | null {
  return ENGINE_LEAF_SYNONYMS[canonNormalize(cleanScreenLabel(label))] ?? null;
}

/** Classifica um caminho explícito (`A > B > C`) contra o catálogo. */
export function classifyExplicitPath(
  segments: string[],
  stepNumber: number,
  ctx: RoutineNavContext,
  catalog: MenuCatalog = loadMenuCatalog(),
  items: CanonicalMenuItem[] = catalogAsCanonicalItems(catalog)
): NavCheck {
  const documented = pathText(segments.map(squash));
  const base = { stepNumber, kind: 'explicit' as const, documented };

  const lit = findLiteralOrDrift(segments, catalog);
  if (lit) {
    return {
      ...base,
      classification: lit.classification,
      resolvedChain: lit.chain,
      evidence:
        lit.classification === 'exact'
          ? `cadeia idêntica no catálogo ${catalog.version}`
          : `cadeia existe no catálogo ${catalog.version} como "${pathText(lit.chain)}" (diferença de grafia: ${lit.drift
              .map(d => `"${d.documented}" × "${d.catalog}" [${d.kinds.join(', ')}]`)
              .join('; ')})`,
      ...(lit.drift.length ? { drift: lit.drift } : {})
    };
  }

  const canon = resolveCanonicalMenuPath(segments, items);
  if (canon) {
    return {
      ...base,
      classification: 'canonical_equivalence',
      resolvedChain: [...canon.chain],
      tail: [...canon.tail],
      basis: canon.basis,
      evidence: canon.evidence
    };
  }

  const leaf = segments[segments.length - 1];
  const synonym = engineLeafSynonym(leaf);
  if (synonym) {
    const viaSyn = findLiteralOrDrift([...segments.slice(0, -1), synonym], catalog);
    if (viaSyn) {
      return {
        ...base,
        classification: 'canonical_equivalence',
        resolvedChain: viaSyn.chain,
        tail: [],
        basis: 'sinonimo_folha_adr026',
        evidence: `sinônimo de folha do motor (ADR-026) "${squash(leaf)}" -> "${synonym}": "${pathText(viaSyn.chain)}" existe no catálogo ${catalog.version}`
      };
    }
  }
  const single = resolveSingleSegmentScreen(synonym ?? leaf,{ modulo: ctx.modulo, routineTitle: ctx.routineTitle, nextStepsText: ctx.stepTexts.slice(stepNumber) }, catalog);
  if (single.status === 'resolved') {
    return {
      ...base,
      classification: 'single_segment',
      resolvedChain: single.chain,
      basis: `folha_${single.basis}`,
      evidence: `cura pela folha "${leaf}": ${single.evidence}`
    };
  }

  const closed = resolveClosedSemantic({ stepTexts: ctx.stepTexts, modulo: ctx.modulo, routineTitle: ctx.routineTitle, documentedChain: segments }, catalog);
  if (closed.status === 'resolved') {
    return { ...base, classification: 'closed_semantic', resolvedChain: closed.chain, basis: 'closed_semantic', evidence: closed.justification };
  }
  if (single.status === 'ambiguous') {
    return { ...base, classification: 'ambiguous', basis: `folha_${single.basis}`, evidence: single.evidence, candidates: single.candidates };
  }
  return {
    ...base,
    classification: 'no_equivalent',
    evidence: `sem equivalente: ${single.evidence}; Camada 3: ${closed.justification}`,
    candidates: closed.topCandidates.map(c => c.chain)
  };
}

/** Classifica uma tela citada sem `>` (passos 1 a 3) contra o catálogo. */
export function classifyImplicitScreen(
  label: string,
  stepNumber: number,
  ctx: RoutineNavContext,
  catalog: MenuCatalog = loadMenuCatalog()
): NavCheck {
  const base = { stepNumber, kind: 'implicit' as const, documented: squash(label) };
  // Raiz da barra citada sozinha ("Acesse o menu **Configurações**"): o submenu é escolhido no passo seguinte
  const root = findLiteralOrDrift([cleanScreenLabel(label)], catalog);
  if (root) {
    return {
      ...base,
      classification: root.classification,
      resolvedChain: root.chain,
      basis: 'raiz_da_barra',
      evidence: `"${root.chain[0]}" é raiz da barra de menus do catálogo ${catalog.version}; a tela é escolhida no passo seguinte`,
      ...(root.drift.length ? { drift: root.drift } : {})
    };
  }
  const synonym = engineLeafSynonym(label);
  const single = resolveSingleSegmentScreen(synonym ?? label,{ modulo: ctx.modulo, routineTitle: ctx.routineTitle, nextStepsText: ctx.stepTexts.slice(stepNumber) }, catalog);
  if (single.status === 'resolved') {
    const leafReal = single.chain[single.chain.length - 1];
    const drift: SpellingDrift[] =
      single.basis !== 'screen_alias' && !sameLiteral(leafReal, label) && canonNormalize(leafReal) === canonNormalize(label)
        ? [{ segment: single.chain.length - 1, documented: squash(label), catalog: leafReal, kinds: segmentDriftKinds(label, leafReal) }]
        : [];
    return {
      ...base,
      classification: 'single_segment',
      resolvedChain: single.chain,
      basis: (synonym ? 'sinonimo_folha_adr026+' : '') + single.basis + (single.disambiguatedBy ? `+${single.disambiguatedBy}` : ''),
      evidence: (synonym ? `sinônimo de folha do motor (ADR-026) "${squash(label)}" -> "${synonym}"; ` : '') + single.evidence,
      ...(drift.length ? { drift } : {})
    };
  }
  const closed = resolveClosedSemantic({ stepTexts: ctx.stepTexts, modulo: ctx.modulo, routineTitle: ctx.routineTitle }, catalog);
  if (single.status === 'ambiguous') {
    // A Camada 3 só desempata se escolher um dos próprios candidatos homônimos
    if (closed.status === 'resolved' && single.candidates.some(c => pathText(c) === pathText(closed.chain))) {
      return { ...base, classification: 'closed_semantic', resolvedChain: closed.chain, basis: 'closed_semantic', evidence: `${single.evidence}; desempate: ${closed.justification}` };
    }
    return { ...base, classification: 'ambiguous', basis: single.basis, evidence: single.evidence, candidates: single.candidates };
  }
  if (closed.status === 'resolved') {
    return { ...base, classification: 'closed_semantic', resolvedChain: closed.chain, basis: 'closed_semantic', evidence: `${single.evidence}; ${closed.justification}` };
  }
  return {
    ...base,
    classification: 'no_equivalent',
    evidence: `${single.evidence}; Camada 3: ${closed.justification}`,
    candidates: closed.topCandidates.map(c => c.chain)
  };
}

/** Navegação da rotina inteira (Camada 3) quando os passos 1 a 3 não citam caminho nem tela. */
export function classifyRoutineLevel(ctx: RoutineNavContext, catalog: MenuCatalog = loadMenuCatalog()): NavCheck {
  const closed = resolveClosedSemantic({ stepTexts: ctx.stepTexts, modulo: ctx.modulo, routineTitle: ctx.routineTitle }, catalog);
  const base = { stepNumber: 0, kind: 'routine' as const, documented: ctx.routineTitle || '(sem título)' };
  if (closed.status === 'resolved') {
    return { ...base, classification: 'closed_semantic', resolvedChain: closed.chain, basis: 'closed_semantic', evidence: closed.justification };
  }
  return { ...base, classification: 'no_equivalent', evidence: closed.justification, candidates: closed.topCandidates.map(c => c.chain) };
}

/** Extrai e classifica a navegação dos passos 1 a 3 (explícita e implícita). Sem nenhuma, devolve lista vazia. */
export function extractStepNavigation(
  steps: RoutineStep[],
  ctx: RoutineNavContext,
  catalog: MenuCatalog = loadMenuCatalog(),
  items: CanonicalMenuItem[] = catalogAsCanonicalItems(catalog)
): NavCheck[] {
  const out: NavCheck[] = [];
  for (const step of steps) {
    if (step.stepNumber < 1 || step.stepNumber > IMPLICIT_NAV_MAX_STEP) continue;
    const explicit = extractMenuPaths(step);
    if (explicit.length > 0) {
      for (const p of explicit) out.push(classifyExplicitPath(p.segments, step.stepNumber, ctx, catalog, items));
      continue;
    }
    const implicit = detectImplicitScreenNavigation(step);
    if (implicit) out.push(classifyImplicitScreen(implicit.label, step.stepNumber, ctx, catalog));
  }
  return out;
}

// ------------------------------------------------------------------------------------------------------------------
// Bloqueio registrado no relatório e triagem em filas
// ------------------------------------------------------------------------------------------------------------------

/** Mascara IPv4 (`10.0.3.x`) em qualquer texto que vá para relatório (CLAUDE.md, regra 18). */
export function maskIps(text: string): string {
  return String(text ?? '').replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}\b/g, '$1.x');
}

export function classifyBlockCause(motivo: string, tipoBloqueio: string, telemetryBlockKind = ''): BlockCause {
  const m = canonNormalize(motivo);
  if (/caminho de menu/.test(m)) return 'menu_path';
  if (/ambiente.hardware/.test(canonNormalize(tipoBloqueio))) return 'environment';
  if (/precisa existir antes|criado em outra rotina/.test(m) || telemetryBlockKind === 'cross_routine') return 'cross_routine';
  if (/sem dados|0 linhas de dados|grade com \d+ coluna/.test(m) || telemetryBlockKind === 'empty_data') return 'empty_grid';
  if (/nao fo(i|ram) localizad/.test(m) || /nao estava na tela/.test(m)) return 'missing_target';
  return 'other';
}

/**
 * Lê o bloqueio de um `-revisado.md` (frontmatter `auditoria_ui` + `[!CAUTION]`) e, se houver, da telemetria do
 * executor. Pura sobre os textos recebidos.
 */
export function parseBlockInfo(reportText: string, telemetry: Array<Record<string, any>> = []): BlockInfo {
  const text = String(reportText ?? '').replace(/\r\n/g, '\n');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  let ui: Record<string, any> = {};
  try {
    ui = (fm ? YAML.parse(fm[1])?.auditoria_ui : null) ?? {};
  } catch {
    ui = {};
  }
  const body = fm ? text.slice(fm[0].length) : text;
  const motivoRaw = (body.match(/> \*\*Motivo Técnico:\*\*([\s\S]*?)(?:\n\n|\n(?!>)|$)/) || [])[1] ?? '';
  const motivo = motivoRaw.replace(/\n> ?/g, ' ').replace(/\s+/g, ' ').trim();
  const tipoBloqueio = String(ui.tipo_bloqueio ?? '');
  const history = Array.isArray(ui.historico_reauditoria) ? ui.historico_reauditoria.at(-1)?.bloqueio_atual : undefined;
  const blockedTel = telemetry.find(e => e?.status === 'blocked');
  const fromMotivo = Number((motivo.match(/(?:No passo|do passo|o passo)\s+(\d+)/i) || [])[1]) || null;
  const blockedStep: number | null =
    (Number(history?.passo) || null) ?? fromMotivo ?? (Number(ui.diagnostico_tela_att?.passo) || null) ?? (Number(blockedTel?.stepNum) || null);
  const liveAppliedChains: BlockInfo['liveAppliedChains'] = [];
  for (const d of ui.auto_cura?.divergencias_detectadas ?? []) {
    if (d?.camada === 'menu_path_resolution' && d.elemento_real) {
      liveAppliedChains.push({ step: Number(d.passo) || 0, documented: String(d.alvo_documentado ?? ''), real: String(d.elemento_real) });
    }
  }
  return {
    blockedStep: blockedStep ?? fromMotivo ?? null,
    cause: classifyBlockCause(motivo, tipoBloqueio, String(blockedTel?.blockKind ?? '')),
    tipoBloqueio,
    motivo: maskIps(motivo),
    ...(ui.diagnostico_tela_att?.rota ? { route: String(ui.diagnostico_tela_att.rota) } : {}),
    ...(/coer[eê]ncia p[oó]s-pouso/i.test(body) && /descartad/i.test(body) ? { landingRejected: true } : {}),
    liveAppliedChains
  };
}

const HOME_ROUTES = new Set(['', '#/', '#/inicio', '#/home', '#/produtos']);

export interface QueueInput {
  tags: ReviewTag[];
  block: BlockInfo;
  nav: NavCheck[];
  /** Camada 3 da rotina inteira (usada quando nenhum passo 1–3 cita navegação) */
  routineLevel?: NavCheck;
  isHardware: boolean;
  /** Diz se a cadeia é submenu (tem filhos) no catálogo; ausente = não verifica */
  isSubmenu?: (chain: string[]) => boolean;
}

const navIsExactLike = (n: NavCheck) => n.classification === 'exact' || (n.classification === 'exact_with_spelling_drift' && driftIsCosmetic(n.drift));
const navResolves = (n: NavCheck) =>
  RESOLVING_CLASSES.has(n.classification) || (n.classification === 'exact_with_spelling_drift' && !driftIsCosmetic(n.drift));

/**
 * Triagem pura de uma rotina `[ATT]`/`[XRX]`:
 *  - A: o bloqueio é de navegação (passo 1–3 com caminho de menu ausente, ou alvo/tela não alcançada em passo de
 *       navegação) e a navegação agora tem destino único no catálogo;
 *  - B: o caminho já era exato, ou o bloqueio é posterior / de rótulo interno / de grade vazia / dependência cruzada;
 *  - C: bloqueio de navegação sem equivalente (ou homônimo indecidível) no catálogo — laudo com os vizinhos.
 * Rotina sem `ATT`/`XRX` não entra em fila; rotina de hardware nunca vai para a Fila A.
 */
export function assignQueue(input: QueueInput): QueueDecision {
  const { tags, block, nav, routineLevel, isHardware } = input;
  if (!tags.includes('ATT') && !tags.includes('XRX')) return { queue: null, reason: 'sem [ATT]/[XRX]: fora das filas de reauditoria de menu' };
  const step = block.blockedStep;
  if (step == null) return { queue: 'B', reason: 'passo do bloqueio não registrado no relatório: triagem manual (pós-navegação presumida)' };
  if (step > IMPLICIT_NAV_MAX_STEP) return { queue: 'B', reason: `bloqueio no passo ${step} (> 3): pós-navegação (${block.cause})` };
  if (block.cause === 'empty_grid') return { queue: 'B', reason: `bloqueio no passo ${step} por grade vazia (tela alcançada)` };
  if (block.cause === 'environment') return { queue: 'B', reason: 'dependência de ambiente/hardware' };
  if (block.landingRejected) {
    return {
      queue: 'C',
      reason: `rota resolvida ao vivo, mas a Camada 4 (coerência pós-pouso) descartou a cura no passo ${step}: a tela real não contém os elementos citados nos passos seguintes (defasagem de conteúdo do manual; reauditar só após atualização editorial)`,
      subtype: 'conteudo_defasado_pos_pouso'
    };
  }

  const upTo = nav.filter(n => n.stepNumber <= step);
  const atStep = upTo.filter(n => n.stepNumber === step);
  const screenReached = block.route ? !HOME_ROUTES.has(block.route.trim()) : undefined;
  const nonExactBefore = upTo.filter(n => !navIsExactLike(n));

  let navBlock = false;
  if (block.cause === 'menu_path') navBlock = true;
  else if (atStep.length > 0) navBlock = true;
  else if ((block.cause === 'missing_target' || block.cause === 'cross_routine' || block.cause === 'other') && screenReached === false) navBlock = true;

  if (!navBlock) {
    return {
      queue: 'B',
      reason: `bloqueio no passo ${step} por ${block.cause} sem navegação no próprio passo; ${
        block.route ? `tela alcançada (${block.route})` : 'rota do bloqueio não registrada (sem indício de tela não alcançada)'
      }`
    };
  }

  // Navegação decisiva: a do passo bloqueado; senão, a última não exata anterior; senão, a Camada 3 da rotina
  const pick = atStep.find(n => !navIsExactLike(n)) ?? atStep[0] ?? nonExactBefore[nonExactBefore.length - 1] ?? (upTo.length === 0 ? routineLevel : undefined);
  if (!pick) {
    return { queue: 'B', reason: `caminho(s) dos passos 1–${step} já exato(s) no catálogo: o bloqueio é posterior à navegação (${block.cause})` };
  }
  if (navIsExactLike(pick)) {
    return { queue: 'B', reason: `caminho do passo ${pick.stepNumber} já exato no catálogo ("${pick.documented}"): bloqueio pós-navegação (${block.cause})`, nav: pick };
  }
  if (navResolves(pick)) {
    if (isHardware) return { queue: 'B', reason: 'rotina de hardware/ambiente (hardware-registry): nunca entra na Fila A', nav: pick };
    const real = pick.resolvedChain ? pathText(pick.resolvedChain) : '';
    const doubts: string[] = [];
    const applied = block.liveAppliedChains.find(a => canonNormalize(a.real) === canonNormalize(real));
    if (applied) {
      doubts.push(
        pick.tail && pick.tail.length
          ? `a última auditoria já aplicou ao vivo a mesma cadeia "${applied.real}" (passo ${applied.step}); o bloqueio pode ser da aba/seção "${pick.tail.join(' > ')}"`
          : `a última auditoria já aplicou ao vivo "${applied.documented}" -> "${applied.real}" e ainda assim bloqueou no passo ${step}`
      );
    }
    if (pick.kind === 'routine') doubts.push('os passos 1–3 não citam tela: destino inferido só pelo título/passos (Camada 3)');
    else if (pick.kind === 'implicit' && /sinonimo_folha_adr026/.test(pick.basis ?? '')) {
      doubts.push('sinônimo de folha da ADR-026 espelhado do motor: confirmar que a navegação implícita (sem `>`) o aplica ao vivo');
    } else if (pick.classification === 'closed_semantic') doubts.push('destino só por pontuação semântica (Camada 3), sem equivalência literal do caminho/tela documentados');
    if (pick.resolvedChain && input.isSubmenu?.(pick.resolvedChain) && !(pick.tail && pick.tail.length)) {
      doubts.push(`"${real}" é submenu, não tela final: o passo seguinte precisa escolher a tela`);
    }
    return {
      queue: 'A',
      reason: `bloqueio de navegação no passo ${step} (${block.cause}) agora resolvido por ${pick.classification}`,
      nav: pick,
      confidence: doubts.length ? 'revisar' : 'alta',
      ...(doubts.length ? { doubt: doubts.join('; ') } : {})
    };
  }
  return {
    queue: 'C',
    reason: `bloqueio de navegação no passo ${step} sem destino único no catálogo (${pick.classification})`,
    nav: pick,
    subtype: pick.kind === 'routine' ? 'tela_pressuposta' : 'navegacao_sem_equivalente'
  };
}

// ------------------------------------------------------------------------------------------------------------------
// Leitura de disco (CLI)
// ------------------------------------------------------------------------------------------------------------------

/** Passos de um `-revisado.md` (fallback quando a rotina não está no KB). */
export function parseStepsFromMarkdown(text: string): RoutineStep[] {
  const body = String(text ?? '').replace(/\r\n/g, '\n');
  const m = body.match(/^#### Passo a passo[^\n]*\n([\s\S]*?)(?=\n#### |(?![\s\S]))/m);
  if (!m) return [];
  const steps: RoutineStep[] = [];
  let cur: RoutineStep | null = null;
  for (const line of m[1].split('\n')) {
    const s = line.match(/^(\d+)\.\s+(.+)$/);
    if (s) {
      if (cur) steps.push(cur);
      const targets = extractBoldTargets(s[2]);
      cur = { stepNumber: Number(s[1]), rawText: s[2].trim(), targets, actionType: 'click', subItems: [], mainTargetCount: targets.length } as RoutineStep;
      continue;
    }
    const sub = line.match(/^\s+[-*]\s+(.+)$/);
    if (cur && sub) {
      cur.subItems?.push(sub[1].trim());
      for (const t of extractBoldTargets(sub[1])) if (!cur.targets.includes(t)) cur.targets.push(t);
    }
  }
  if (cur) steps.push(cur);
  return steps;
}

interface KbEntry {
  id: string;
  file: string;
  modulo: string;
  titulo: string;
  steps: RoutineStep[];
  parsed: ReturnType<typeof parseRoutineMarkdown>;
}

function readKb(kbDir: string): Map<string, KbEntry> {
  const out = new Map<string, KbEntry>();
  if (!fs.existsSync(kbDir)) return out;
  for (const mod of fs.readdirSync(kbDir)) {
    const modDir = path.join(kbDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const f of fs.readdirSync(modDir)) {
      if (!f.endsWith('.md') || f.startsWith('_')) continue;
      const file = path.join(modDir, f);
      try {
        const parsed = parseRoutineMarkdown(file);
        if (!parsed.id) continue;
        out.set(parsed.id, { id: parsed.id, file, modulo: parsed.modulo || mod, titulo: parsed.titulo, steps: parsed.steps, parsed });
      } catch {
        // arquivo sem frontmatter válido não derruba a auditoria
      }
    }
  }
  return out;
}

interface AuditedEntry {
  id: string;
  folder: string;
  modulo: string;
  titulo: string;
  tags: ReviewTag[];
  status: string;
  carga?: string;
  reportText: string;
}

function readAudited(rotinasDir: string): AuditedEntry[] {
  const out: AuditedEntry[] = [];
  if (!fs.existsSync(rotinasDir)) return out;
  for (const mod of fs.readdirSync(rotinasDir)) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const folder of fs.readdirSync(modDir)) {
      const dir = path.join(modDir, folder);
      if (!fs.statSync(dir).isDirectory()) continue;
      const file = fs.readdirSync(dir).find(f => f.endsWith('-revisado.md'));
      if (!file) continue;
      const reportText = fs.readFileSync(path.join(dir, file), 'utf-8').replace(/\r\n/g, '\n');
      const fm = reportText.match(/^---\n([\s\S]*?)\n---/);
      let meta: any = {};
      try {
        meta = fm ? YAML.parse(fm[1]) ?? {} : {};
      } catch {
        meta = {};
      }
      const id = String(meta.id ?? '').trim();
      if (!id) continue;
      out.push({
        id,
        folder,
        modulo: String(meta.modulo ?? mod),
        titulo: String(meta.titulo ?? ''),
        tags: tagsFromPrefix(folder),
        status: String(meta.auditoria_ui?.status ?? ''),
        ...(meta.auditoria_ui?.carga ? { carga: String(meta.auditoria_ui.carga) } : {}),
        reportText
      });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true }));
}

function readTelemetry(dir: string, id: string): Array<Record<string, any>> {
  const f = path.join(dir, `${id}.json`);
  if (!fs.existsSync(f)) return [];
  try {
    const t = JSON.parse(fs.readFileSync(f, 'utf-8'));
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}

// ------------------------------------------------------------------------------------------------------------------
// Montagem do resultado
// ------------------------------------------------------------------------------------------------------------------

export interface QueueItem {
  id: string;
  tag: string;
  modulo: string;
  blockedStep: number | null;
  blockCause: BlockCause;
  documented: string;
  documentedKind?: NavCheck['kind'];
  classification?: NavClassification;
  resolvedChain?: string;
  tail?: string[];
  basis?: string;
  evidence: string;
  reason: string;
  load?: WorkloadType;
  doubt?: string;
  confidence?: 'alta' | 'revisar';
  subtype?: 'navegacao_sem_equivalente' | 'tela_pressuposta' | 'conteudo_defasado_pos_pouso';
  /** Fila C: vizinhos mais próximos no catálogo (laudo) */
  nearest?: string[];
  motivo?: string;
}

export interface CoherenceResult {
  generatedAt: string;
  catalogVersion: string;
  catalogCapturedAt: string;
  filter?: string[];
  counts: {
    audited: number;
    auditedByTag: Record<string, number>;
    filaA: number;
    filaA_readOnly: number;
    filaA_mutation: number;
    filaA_highConfidence: number;
    filaB: number;
    filaC: number;
    filaC_telaPressuposta: number;
    filaC_conteudoDefasadoPosPouso?: number;
    reportedNotQueued: number;
    validated: number;
    validatedWithIncoherence: number;
    validatedIncoherences: number;
    navClassAudited: Record<NavClassification, number>;
    kbTotal: number;
    kbNotAudited: number;
    kbNavClass: Record<NavClassification, number>;
    kbRoutinesAllExact: number;
    kbRoutinesNeedEquivalence: number;
    kbRoutinesWithNoEquivalent: number;
    kbRoutinesWithoutNavigation: number;
  };
  filaA: QueueItem[];
  filaB: QueueItem[];
  filaC: QueueItem[];
  reportedNotQueued: Array<{ id: string; tag: string; reason: string; nav: NavCheck[] }>;
  validatedIncoherences: Array<{ id: string; modulo: string; nav: NavCheck }>;
  kbPreventive: Array<{
    id: string;
    modulo: string;
    titulo: string;
    counts: Record<NavClassification, number>;
    nav: NavCheck[];
    routineLevel?: NavCheck;
  }>;
}

const emptyClassCounts = (): Record<NavClassification, number> => ({
  exact: 0,
  exact_with_spelling_drift: 0,
  canonical_equivalence: 0,
  single_segment: 0,
  closed_semantic: 0,
  ambiguous: 0,
  no_equivalent: 0
});

const tagLabel = (tags: ReviewTag[]) => (tags.length ? tags.map(t => `[${t}]`).join('') : '—');

function workloadFor(id: string, kb: KbEntry | undefined): WorkloadType | undefined {
  const manifest = PHASE3_MANIFEST.find(e => e.id === id)?.workloadType;
  if (manifest) return manifest;
  return kb ? classifyRoutineWorkload(kb.parsed) : undefined;
}

export interface CoherenceInput {
  rotinasDir: string;
  kbDir: string;
  telemetryDir: string;
  catalog?: MenuCatalog;
  routines?: string[];
}

export function runCoherenceAudit(input: CoherenceInput): CoherenceResult {
  const catalog = input.catalog ?? loadMenuCatalog();
  const items = catalogAsCanonicalItems(catalog);
  const filter = input.routines && input.routines.length ? new Set(input.routines) : null;
  const kb = readKb(input.kbDir);
  const audited = readAudited(input.rotinasDir).filter(a => !filter || filter.has(a.id));
  const hardware = listHardwareRoutineIds(readDiskReports(input.rotinasDir));
  const isSubmenu = (chain: string[]) => findExactPath(chain, catalog)?.hasChildren === true;

  const result: CoherenceResult = {
    generatedAt: new Date().toISOString(),
    catalogVersion: catalog.version,
    catalogCapturedAt: catalog.capturedAt,
    ...(filter ? { filter: Array.from(filter) } : {}),
    counts: {
      audited: audited.length,
      auditedByTag: {},
      filaA: 0,
      filaA_readOnly: 0,
      filaA_mutation: 0,
      filaA_highConfidence: 0,
      filaB: 0,
      filaC: 0,
      filaC_telaPressuposta: 0,
      reportedNotQueued: 0,
      validated: 0,
      validatedWithIncoherence: 0,
      validatedIncoherences: 0,
      navClassAudited: emptyClassCounts(),
      kbTotal: kb.size,
      kbNotAudited: 0,
      kbNavClass: emptyClassCounts(),
      kbRoutinesAllExact: 0,
      kbRoutinesNeedEquivalence: 0,
      kbRoutinesWithNoEquivalent: 0,
      kbRoutinesWithoutNavigation: 0
    },
    filaA: [],
    filaB: [],
    filaC: [],
    reportedNotQueued: [],
    validatedIncoherences: [],
    kbPreventive: []
  };

  const auditedIds = new Set<string>();
  for (const a of audited) {
    auditedIds.add(a.id);
    const key = tagLabel(a.tags);
    result.counts.auditedByTag[key] = (result.counts.auditedByTag[key] ?? 0) + 1;
    const kbEntry = kb.get(a.id);
    const steps = kbEntry?.steps.length ? kbEntry.steps : parseStepsFromMarkdown(a.reportText);
    const ctx: RoutineNavContext = { modulo: kbEntry?.modulo ?? a.modulo, routineTitle: kbEntry?.titulo || a.titulo, stepTexts: steps.map(s => s.rawText) };
    const nav = extractStepNavigation(steps, ctx, catalog, items);
    for (const n of nav) result.counts.navClassAudited[n.classification]++;

    if (a.tags.length === 0) {
      result.counts.validated++;
      const bad = nav.filter(n => n.classification !== 'exact');
      if (bad.length) result.counts.validatedWithIncoherence++;
      for (const n of bad) result.validatedIncoherences.push({ id: a.id, modulo: a.modulo, nav: n });
      continue;
    }

    const block = parseBlockInfo(a.reportText, readTelemetry(input.telemetryDir, a.id));
    const routineLevel = nav.length === 0 ? classifyRoutineLevel(ctx, catalog) : undefined;
    const decision = assignQueue({ tags: a.tags, block, nav, routineLevel, isHardware: hardware.has(a.id), isSubmenu });
    if (decision.queue == null) {
      result.reportedNotQueued.push({ id: a.id, tag: tagLabel(a.tags), reason: decision.reason, nav });
      continue;
    }
    const n = decision.nav;
    const item: QueueItem = {
      id: a.id,
      tag: tagLabel(a.tags),
      modulo: a.modulo,
      blockedStep: block.blockedStep,
      blockCause: block.cause,
      documented: n?.documented ?? nav.map(x => x.documented).join(' | '),
      ...(n ? { documentedKind: n.kind, classification: n.classification } : {}),
      ...(n?.resolvedChain ? { resolvedChain: pathText(n.resolvedChain) } : {}),
      ...(n?.tail && n.tail.length ? { tail: n.tail } : {}),
      ...(n?.basis ? { basis: n.basis } : {}),
      evidence: maskIps(n?.evidence ?? ''),
      reason: decision.reason,
      ...(decision.doubt ? { doubt: decision.doubt } : {}),
      ...(decision.confidence ? { confidence: decision.confidence } : {}),
      ...(decision.subtype ? { subtype: decision.subtype } : {}),
      motivo: block.motivo.slice(0, 400)
    };
    if (decision.queue === 'A') {
      item.load = workloadFor(a.id, kbEntry) ?? (a.carga === 'mutation' || a.carga === 'read_only' ? (a.carga as WorkloadType) : 'mutation');
      result.filaA.push(item);
    } else if (decision.queue === 'B') {
      result.filaB.push(item);
    } else {
      item.nearest = (n?.candidates ?? []).slice(0, 5).map(pathText);
      result.filaC.push(item);
    }
  }

  for (const [id, entry] of kb) {
    if (auditedIds.has(id) || (filter && !filter.has(id))) continue;
    const ctx: RoutineNavContext = { modulo: entry.modulo, routineTitle: entry.titulo, stepTexts: entry.steps.map(s => s.rawText) };
    const nav = extractStepNavigation(entry.steps, ctx, catalog, items);
    const counts = emptyClassCounts();
    for (const n of nav) {
      counts[n.classification]++;
      result.counts.kbNavClass[n.classification]++;
    }
    const routineLevel = nav.length === 0 ? classifyRoutineLevel(ctx, catalog) : undefined;
    result.kbPreventive.push({ id, modulo: entry.modulo, titulo: entry.titulo, counts, nav, ...(routineLevel ? { routineLevel } : {}) });
  }
  if (!filter) {
    // Rotinas auditadas cujos IDs não estão no KB não entram na contagem do KB
    result.counts.kbNotAudited = Array.from(kb.keys()).filter(id => !auditedIds.has(id)).length;
  } else {
    result.counts.kbNotAudited = result.kbPreventive.length;
  }
  result.kbPreventive.sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true }));
  for (const r of result.kbPreventive) {
    if (r.nav.length === 0) result.counts.kbRoutinesWithoutNavigation++;
    else if (r.nav.every(n => n.classification === 'exact')) result.counts.kbRoutinesAllExact++;
    if (r.counts.no_equivalent > 0 || r.counts.ambiguous > 0) result.counts.kbRoutinesWithNoEquivalent++;
    else if (r.nav.some(n => n.classification !== 'exact')) result.counts.kbRoutinesNeedEquivalence++;
  }

  const byId = (a: QueueItem, b: QueueItem) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true });
  result.filaA.sort((a, b) => (a.load === b.load ? byId(a, b) : a.load === 'read_only' ? -1 : 1));
  result.filaB.sort(byId);
  result.filaC.sort(byId);
  result.counts.filaA = result.filaA.length;
  result.counts.filaA_readOnly = result.filaA.filter(i => i.load === 'read_only').length;
  result.counts.filaA_mutation = result.filaA.filter(i => i.load === 'mutation').length;
  result.counts.filaB = result.filaB.length;
  result.counts.filaC = result.filaC.length;
  result.counts.filaA_highConfidence = result.filaA.filter(i => i.confidence === 'alta').length;
  result.counts.filaC_telaPressuposta = result.filaC.filter(i => i.subtype === 'tela_pressuposta').length;
  result.counts.filaC_conteudoDefasadoPosPouso = result.filaC.filter(i => i.subtype === 'conteudo_defasado_pos_pouso').length;
  result.counts.reportedNotQueued = result.reportedNotQueued.length;
  result.counts.validatedIncoherences = result.validatedIncoherences.length;
  return result;
}

// ------------------------------------------------------------------------------------------------------------------
// Relatório humano (pt-BR)
// ------------------------------------------------------------------------------------------------------------------

const CLASS_LABEL: Record<NavClassification, string> = {
  exact: 'Exato',
  exact_with_spelling_drift: 'Exato com deriva de grafia',
  canonical_equivalence: 'Equivalência canônica',
  single_segment: 'Tela de segmento único',
  closed_semantic: 'Semântica fechada (Camada 3)',
  ambiguous: 'Ambíguo (homônimo)',
  no_equivalent: 'Sem equivalente'
};

const cell = (s: unknown) => maskIps(String(s ?? '')).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim() || '—';
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function renderMarkdownReport(r: CoherenceResult): string {
  const L: string[] = [];
  const c = r.counts;
  L.push('# Auditoria de Caminhos de Menu — Passos 1 a 3 × Catálogo Canônico (ADR-037)');
  L.push('');
  L.push(
    `> Gerado por \`auditoria/src/audit-menu-coherence.ts\` em ${r.generatedAt} (offline, somente leitura sobre \`auditoria/rotinas/**\` e \`kb/**\`). ` +
      `Catálogo canônico **${r.catalogVersion}** (capturado em ${r.catalogCapturedAt}).`
  );
  L.push('>');
  L.push(
    '> **Trava de Evidência:** toda cadeia "resolvida" abaixo é só um candidato do catálogo fechado. A reauditoria ao vivo precisa lê-la na árvore real, medir e acionar o nó antes de qualquer demarcação; nenhum texto de manual foi alterado.'
  );
  L.push('');
  L.push('## Resumo');
  L.push('');
  L.push('| Indicador | Quantidade |');
  L.push('|---|---:|');
  L.push(`| Rotinas auditadas lidas | ${c.audited} |`);
  for (const [k, v] of Object.entries(c.auditedByTag).sort()) L.push(`| ↳ ${k === '—' ? 'sem tag (validadas)' : k} | ${v} |`);
  L.push(`| **Fila A** — destravável por caminho canônico | **${c.filaA}** (read_only ${c.filaA_readOnly} · mutation ${c.filaA_mutation} · confiança alta ${c.filaA_highConfidence}) |`);
  L.push(`| **Fila B** — bloqueio pós-navegação | **${c.filaB}** |`);
  L.push(`| **Fila C** — recurso/módulo sem equivalente na ${r.catalogVersion} | **${c.filaC}** (tela pressuposta ${c.filaC_telaPressuposta}) |`);
  L.push(`| \`[DDD]\`/\`[CCC]\` relatadas, fora das filas | ${c.reportedNotQueued} |`);
  L.push(`| Validadas com navegação 1–3 não exata | ${c.validatedWithIncoherence} de ${c.validated} (${c.validatedIncoherences} ocorrências) |`);
  L.push(`| Rotinas do KB lidas / ainda não auditadas | ${c.kbTotal} / ${c.kbNotAudited} |`);
  L.push('');
  L.push('**Navegações dos passos 1–3 por classe:**');
  L.push('');
  L.push('| Classe | Auditadas | KB não auditado |');
  L.push('|---|---:|---:|');
  for (const k of Object.keys(CLASS_LABEL) as NavClassification[]) L.push(`| ${CLASS_LABEL[k]} (\`${k}\`) | ${c.navClassAudited[k]} | ${c.kbNavClass[k]} |`);
  L.push('');
  L.push(
    'Critérios: **Fila A** = bloqueio `[ATT]`/`[XRX]` em passo 1–3 causado por navegação (caminho de menu ausente, alvo do próprio passo de navegação ou tela não alcançada) que agora tem destino único no catálogo (equivalência canônica, tela de segmento único, semântica fechada ou deriva de singular/plural). ' +
      '**Fila B** = caminho já exato, bloqueio após o passo 3, grade vazia, rótulo interno ausente ou dependência cruzada com a tela alcançada. ' +
      '**Fila C** = bloqueio de navegação sem destino único (sem equivalente ou homônimo indecidível), com os vizinhos mais próximos como laudo. Rotinas de hardware (`hardware-registry.ts`) nunca entram na Fila A.'
  );
  L.push('');

  L.push(`## Fila A — Destravável por caminho canônico (${c.filaA})`);
  L.push('');
  if (r.filaA.length === 0) L.push('_Nenhuma rotina._');
  else {
    L.push('| Rotina | Tag | Carga | Confiança | Passo | Documentado | Cadeia do catálogo | Base | Ressalva |');
    L.push('|---|---|---|---|---:|---|---|---|---|');
    for (const i of r.filaA) {
      const chain = `${i.resolvedChain ?? '—'}${i.tail && i.tail.length ? ` (+ aba/seção "${i.tail.join(' > ')}")` : ''}`;
      L.push(
        `| ${cell(i.id)} | ${cell(i.tag)} | \`${i.load}\` | ${i.confidence ?? '—'} | ${i.blockedStep ?? '—'} | ${cell(i.documented)} | **${cell(chain)}** | ${cell(`${i.classification}${i.basis ? ` / ${i.basis}` : ''}`)} | ${cell(i.doubt ?? '')} |`
      );
    }
    const high = r.filaA.filter(i => i.confidence === 'alta');
    L.push('');
    L.push('Comandos sugeridos (o Worker Pool separa sozinho as filas `read_only`/`mutation`):');
    L.push('');
    L.push('```powershell');
    if (high.length) {
      L.push(`# Confiança alta (${high.length})`);
      L.push(`npx --prefix auditoria tsx auditoria/src/cli.ts --routines ${high.map(i => i.id).join(',')} --dry-run-mutations`);
    }
    if (high.length < r.filaA.length) {
      L.push(`# Fila A completa (${r.filaA.length}), incluindo as que pedem revisão do destino`);
      L.push(`npx --prefix auditoria tsx auditoria/src/cli.ts --routines ${r.filaA.map(i => i.id).join(',')} --dry-run-mutations`);
    }
    L.push('```');
  }
  L.push('');

  L.push(`## Fila B — Bloqueio pós-navegação (${c.filaB})`);
  L.push('');
  if (r.filaB.length === 0) L.push('_Nenhuma rotina._');
  else {
    L.push('| Rotina | Tag | Passo | Causa | Motivo da fila |');
    L.push('|---|---|---:|---|---|');
    for (const i of r.filaB) L.push(`| ${cell(i.id)} | ${cell(i.tag)} | ${i.blockedStep ?? '—'} | \`${i.blockCause}\` | ${cell(clip(i.reason, 220))} |`);
  }
  L.push('');

  L.push(`## Fila C — Recurso/módulo sem equivalente na ${r.catalogVersion} (${c.filaC})`);
  L.push('');
  if (r.filaC.length === 0) L.push('_Nenhuma rotina._');
  else {
    const groups: Array<[string, QueueItem[]]> = [
      ['C1 — Caminho/tela citado sem equivalente ou homônimo indecidível', r.filaC.filter(i => i.subtype === 'navegacao_sem_equivalente' || !i.subtype)],
      ['C2 — Tela pressuposta: os passos 1–3 não citam tela e o título não aponta destino único (documentado = título da rotina)', r.filaC.filter(i => i.subtype === 'tela_pressuposta')],
      ['C3 — Conteúdo defasado pós-pouso: a rota foi resolvida e clicada ao vivo, mas a Camada 4 (ADR-037) provou que a tela real não tem os elementos dos passos seguintes', r.filaC.filter(i => i.subtype === 'conteudo_defasado_pos_pouso')]
    ];
    for (const [title, list] of groups) {
      L.push(`### ${title} (${list.length})`);
      L.push('');
      if (list.length === 0) {
        L.push('_Nenhuma._');
        L.push('');
        continue;
      }
      L.push('| Rotina | Tag | Passo | Documentado | Classe | Laudo: candidatos mais próximos no catálogo |');
      L.push('|---|---|---:|---|---|---|');
      for (const i of list) {
        L.push(`| ${cell(i.id)} | ${cell(i.tag)} | ${i.blockedStep ?? '—'} | ${cell(i.documented)} | \`${i.classification ?? '—'}\` | ${cell((i.nearest ?? []).join(' ; ') || 'nenhum radical em comum')} |`);
      }
      L.push('');
    }
  }
  L.push('');

  L.push(`## \`[DDD]\` e \`[CCC]\` relatadas (fora das filas de menu) (${c.reportedNotQueued})`);
  L.push('');
  if (r.reportedNotQueued.length === 0) L.push('_Nenhuma._');
  else {
    L.push('| Rotina | Tag | Navegação 1–3 |');
    L.push('|---|---|---|');
    for (const x of r.reportedNotQueued) {
      L.push(`| ${cell(x.id)} | ${cell(x.tag)} | ${cell(x.nav.map(n => `P${n.stepNumber} ${n.classification}: ${n.documented}`).join(' ; ') || 'sem navegação citada')} |`);
    }
  }
  L.push('');

  L.push(`## Rotinas validadas com navegação 1–3 não exata (${c.validatedIncoherences} ocorrências em ${c.validatedWithIncoherence} rotinas)`);
  L.push('');
  L.push('Rotinas sem tag cujo manual cita, nos passos 1–3, caminho/tela que não é literalmente idêntico ao catálogo. A auditoria ao vivo as validou (a navegação normalizada ou a cura absorveu a diferença), mas o manual deve ser alinhado à grafia real.');
  L.push('');
  if (r.validatedIncoherences.length === 0) L.push('_Nenhuma._');
  else {
    L.push('| Rotina | Passo | Tipo | Documentado | Classe | Catálogo | Diferença literal |');
    L.push('|---|---:|---|---|---|---|---|');
    for (const v of r.validatedIncoherences) {
      const n = v.nav;
      const drift = (n.drift ?? []).map(d => `"${d.documented}" × "${d.catalog}" (${d.kinds.join(', ')})`).join('; ');
      const chain = n.resolvedChain ? pathText(n.resolvedChain) + (n.tail && n.tail.length ? ` + "${n.tail.join(' > ')}"` : '') : (n.candidates ?? []).slice(0, 3).map(pathText).join(' ; ');
      L.push(`| ${cell(v.id)} | ${n.stepNumber} | ${n.kind === 'explicit' ? 'caminho' : 'tela sem `>`'} | ${cell(n.documented)} | \`${n.classification}\` | ${cell(chain)} | ${cell(drift)} |`);
    }
  }
  L.push('');

  L.push(`## Mapa preventivo do KB — rotinas ainda não auditadas (${c.kbNotAudited})`);
  L.push('');
  L.push('| Situação dos passos 1–3 | Rotinas |');
  L.push('|---|---:|');
  L.push(`| Toda navegação exata no catálogo | ${c.kbRoutinesAllExact} |`);
  L.push(`| Precisa de equivalência/deriva/segmento único/semântica fechada (sem pendência) | ${c.kbRoutinesNeedEquivalence} |`);
  L.push(`| Com navegação sem equivalente ou ambígua | ${c.kbRoutinesWithNoEquivalent} |`);
  L.push(`| Sem navegação citada nos passos 1–3 | ${c.kbRoutinesWithoutNavigation} |`);
  L.push('');
  L.push('| Rotina | Módulo | Exato | Deriva | Equiv. | Seg. único | Sem. fechada | Ambíguo | Sem equiv. | Destaque |');
  L.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---|');
  for (const k of r.kbPreventive) {
    const q = k.counts;
    const worst =
      k.nav.find(n => n.classification === 'no_equivalent' || n.classification === 'ambiguous') ??
      k.nav.find(n => n.classification !== 'exact') ??
      undefined;
    const highlight = worst
      ? `P${worst.stepNumber}: ${worst.documented}${worst.resolvedChain ? ` → ${pathText(worst.resolvedChain)}` : ''}`
      : k.routineLevel
        ? `sem navegação; Camada 3: ${k.routineLevel.resolvedChain ? pathText(k.routineLevel.resolvedChain) : 'sem equivalente'}`
        : '';
    L.push(
      `| ${cell(k.id)} | ${cell(k.modulo)} | ${q.exact} | ${q.exact_with_spelling_drift} | ${q.canonical_equivalence} | ${q.single_segment} | ${q.closed_semantic} | ${q.ambiguous} | ${q.no_equivalent} | ${cell(clip(highlight, 160))} |`
    );
  }
  L.push('');
  return L.join('\n');
}

// ------------------------------------------------------------------------------------------------------------------
// CLI
// ------------------------------------------------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes('--json-only');
  const ri = args.indexOf('--routines');
  const routines =
    ri >= 0 && args[ri + 1]
      ? args[ri + 1]
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : undefined;
  const root = path.join(config.rootDir, 'auditoria');
  const result = runCoherenceAudit({
    rotinasDir: config.outputDir,
    kbDir: config.kbDir,
    telemetryDir: path.join(root, 'cache', 'kb-telemetry'),
    routines
  });
  const jsonFile = path.join(root, 'cache', routines ? 'menu-reaudit-queue-partial.json' : 'menu-reaudit-queue.json');
  fs.mkdirSync(path.dirname(jsonFile), { recursive: true });
  fs.writeFileSync(jsonFile, JSON.stringify(result, null, 1), 'utf-8');
  if (!jsonOnly && !routines) {
    const md = path.join(root, 'reports', 'auditoria-caminhos-menus.md');
    fs.mkdirSync(path.dirname(md), { recursive: true });
    fs.writeFileSync(md, renderMarkdownReport(result), 'utf-8');
    console.log(`✓ Relatório: ${path.relative(config.rootDir, md)}`);
  }
  const c = result.counts;
  console.log(`✓ Fila de reauditoria: ${path.relative(config.rootDir, jsonFile)} (catálogo ${result.catalogVersion})`);
  console.log(`  Auditadas: ${c.audited} ${JSON.stringify(c.auditedByTag)}`);
  console.log(`  Fila A: ${c.filaA} (read_only ${c.filaA_readOnly} | mutation ${c.filaA_mutation} | confiança alta ${c.filaA_highConfidence}) | Fila B: ${c.filaB} | Fila C: ${c.filaC} (tela pressuposta ${c.filaC_telaPressuposta}) | fora das filas: ${c.reportedNotQueued}`);
  console.log(`  Validadas com navegação não exata: ${c.validatedWithIncoherence}/${c.validated} (${c.validatedIncoherences} ocorrências)`);
  console.log(
    `  KB não auditado: ${c.kbNotAudited} | todo exato ${c.kbRoutinesAllExact} | precisa equivalência ${c.kbRoutinesNeedEquivalence} | sem equivalente/ambíguo ${c.kbRoutinesWithNoEquivalent} | sem navegação ${c.kbRoutinesWithoutNavigation}`
  );
}

if (process.argv[1] && /audit-menu-coherence\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) main();
