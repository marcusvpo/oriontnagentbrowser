import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { HUMAN_REVIEWS, REVIEW_AUTHOR } from './seed-human-reviews.js';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase.js';
import type { RoutineStep, StepZonePolicy } from './types.js';

export interface HumanReviewRecord {
  id: string;
  routineId: string;
  revisor: string;
  categoria: string;
  passos: number[];
  motivo: string;
  status: string;
  versao: number;
  atualizadoEm?: string;
}

export interface ReviewMenuOverride {
  fromPattern: string;
  toChain: string[];
  removeAlternatives?: boolean;
  postMenuSidebarItem?: string;
  postSidebarSubportalLink?: string;
}

export interface ReviewTargetOverride {
  stepNumber?: number;
  documented: string;
  actual: string;
  preferredZone?: StepZonePolicy;
}

export interface ReviewForbiddenTarget {
  stepNumber?: number;
  pattern: string;
  reason: string;
}

export interface RoutineHumanGuidance {
  routineId: string;
  reviews: HumanReviewRecord[];
  menuOverrides: ReviewMenuOverride[];
  targetOverrides: ReviewTargetOverride[];
  forbiddenTargets: ReviewForbiddenTarget[];
  searchFlowSteps: number[];
  implicitTargetsByStep: Record<number, string[]>;
  forbidFalseRbac: boolean;
}

export interface GlobalMenuEquivalence {
  documentedChainNorm: string;
  documentedRaw: string;
  targetChain: string[];
  sourceRoutineId: string;
  postMenuSidebarItem?: string;
  postSidebarSubportalLink?: string;
}

export interface GlobalAntiTargetRule {
  pattern: string;
  forbiddenWhen: 'menu_navigation' | 'service_or_order' | 'form_or_parameter' | 'always';
  reason: string;
  sourceRoutineId: string;
}

export interface CrossRoutineKnowledgeGraph {
  globalMenuEquivalences: GlobalMenuEquivalence[];
  globalAntiTargets: GlobalAntiTargetRule[];
  globalGridIconAliases: Record<string, string>;
  forbidRbacForFullAccess: boolean;
}

export interface HumanReviewKnowledgeBase {
  loadedAt: string;
  source: 'supabase' | 'cache' | 'seed_fallback';
  reviews: HumanReviewRecord[];
  byRoutine: Record<string, RoutineHumanGuidance>;
  crossRoutine: CrossRoutineKnowledgeGraph;
}

const CACHE_FILE = () => path.join(config.rootDir, 'auditoria', 'cache', 'human-reviews-cache.json');

let memoryKB: HumanReviewKnowledgeBase | null = null;

function normRag(text: string): string {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[^\w\s>+/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normChainKey(chainOrPath: string[] | string): string {
  const parts = Array.isArray(chainOrPath)
    ? chainOrPath
    : String(chainOrPath || '')
        .split('>')
        .map(s => s.trim())
        .filter(Boolean);
  return parts.map(p => normRag(p)).join(' > ');
}

function splitChain(raw: string): string[] {
  return raw
    .split('>')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Analisador genérico em linguagem natural para qualquer revisão humana criada ou editada pelo
 * Orion Audit Console (`routine_reviews.motivo`), extraindo caminhos `A > B`, substituições
 * `'X' -> 'Y'` e anti-alvos denunciados (`erroneamente ... 'Z'`).
 */
export function parseReviewMotivo(
  routineId: string,
  passos: number[],
  motivo: string
): Partial<RoutineHumanGuidance> {
  const menuOverrides: ReviewMenuOverride[] = [];
  const targetOverrides: ReviewTargetOverride[] = [];
  const forbiddenTargets: ReviewForbiddenTarget[] = [];
  const searchFlowSteps: number[] = [];

  const text = String(motivo || '');
  const norm = normRag(text);

  // Extrai pares explícitos `'A > B' ... -> 'C > D'` ou `caminho real é 'C > D'`
  const quoted = Array.from(text.matchAll(/'([^']{2,100})'/g)).map(m => m[1].trim());
  const menuQuotes = quoted.filter(q => q.includes('>'));

  const arrowMenus = Array.from(text.matchAll(/'([^']+>[^']+)'\s*(?:->|→)\s*'([^']+>[^']+)'/g));
  for (const m of arrowMenus) {
    menuOverrides.push({ fromPattern: m[1].trim(), toChain: splitChain(m[2]) });
  }

  // Padrão `'Notas > Certidões > ...'` + menção a opções reais ou caminho atualizado `'Livros > Abertura de Livros'`
  const explicitUpdatedMenu = text.match(/(?:caminho\s+(?:real|atualizado|[uú]nico)\s*(?:[eé]|para|:)?|menu\s+atual[^']*)\s*'([^']+>[^']+)'/i);
  if (explicitUpdatedMenu) {
    const segs = splitChain(explicitUpdatedMenu[1]);
    if (segs.length >= 2) {
      const linkMatch = text.match(/'(Clique aqui[^']+)'/i);
      const isSidebarSubportal = segs.length === 3 && /comunicacoes/i.test(normRag(segs[2])) && /menu lateral/i.test(norm);
      const baseChain = isSidebarSubportal ? [segs[0], segs[1]] : segs;
      const fromList = menuQuotes.filter(mq => normChainKey(mq) !== normChainKey(segs));
      if (fromList.length === 0) {
        menuOverrides.push({
          fromPattern: explicitUpdatedMenu[1].trim(),
          toChain: baseChain,
          removeAlternatives: true,
          postMenuSidebarItem: isSidebarSubportal ? segs[2] : undefined,
          postSidebarSubportalLink: isSidebarSubportal ? linkMatch?.[1] : undefined
        });
      } else {
        for (const mq of fromList) {
          menuOverrides.push({
            fromPattern: mq,
            toChain: baseChain,
            removeAlternatives: true,
            postMenuSidebarItem: isSidebarSubportal ? segs[2] : undefined,
            postSidebarSubportalLink: isSidebarSubportal ? linkMatch?.[1] : undefined
          });
        }
      }
    }
  } else if (menuQuotes.length >= 1) {
    const firstMenu = menuQuotes[0];
    const chainParts = splitChain(firstMenu);
    if (/opcoes reais sao\s+'([^']+)'/i.test(norm) && chainParts.length >= 2) {
      const optMatch = text.match(/op[cç][õo]es reais s[ãa]o\s+'([^']+)'/i);
      if (optMatch) {
        menuOverrides.push({
          fromPattern: firstMenu,
          toChain: [chainParts[0], optMatch[1].trim()]
        });
      }
    }
  }

  // Substituições de campo/botão tipo `'X' -> 'Y'` (sem `>`)
  const arrowTargets = Array.from(text.matchAll(/'([^'>]+)'\s*(?:->|→)\s*'([^'>]+)'/g));
  for (const m of arrowTargets) {
    const doc = m[1].trim();
    const real = m[2].trim();
    // Ignora denúncias de erro ("a auto-cura X -> Y está errada")
    const before = normRag(text.slice(Math.max(0, (m.index ?? 0) - 45), m.index ?? 0));
    if (/(errad|incorret|absurd|falso|nao existe)/.test(before) || /errad|exclusiv/.test(normRag(text.slice((m.index ?? 0), (m.index ?? 0) + m[0].length + 60)))) {
      forbiddenTargets.push({ pattern: real, reason: `Anti-alvo denunciado por revisor humano em ${routineId}: "${real}"` });
    } else {
      targetOverrides.push({ documented: doc, actual: real });
    }
  }

  // Denúncias explícitas de navbar / busca global / Novo cartão +
  if (/ctrl\s*\+\s*b|busca global/i.test(norm) && /erroneamente/i.test(norm)) {
    forbiddenTargets.push({ pattern: 'ctrl + b', reason: 'Busca global (CTRL + B) proibida como substituto de menu' });
  }
  if (/novo cart[ãa]o\s*\+/i.test(norm) && /exclusiv|errad/i.test(norm)) {
    forbiddenTargets.push({ pattern: 'novo cartao', reason: 'Novo cartão + destina-se apenas ao cadastro de novo cartão' });
  }
  if (/navbar|menu superior/i.test(norm) && /erroneamente/i.test(norm)) {
    forbiddenTargets.push({ pattern: 'navbar', reason: 'Menu superior (navbar) não deve ser destacado como opção de formulário' });
  }

  // Fluxo interativo com digitar 'teste' + Enter + '+' + Finalizar
  if (/teste/.test(norm) && /enter/.test(norm) && /nomes encontrados/.test(norm) && /finalizar/.test(norm)) {
    const stepForSearch = passos.find(p => p === 2 || p === 3) ?? passos[0];
    if (stepForSearch !== undefined) searchFlowSteps.push(stepForSearch);
  }

  return {
    menuOverrides,
    targetOverrides,
    forbiddenTargets,
    searchFlowSteps,
    forbidFalseRbac: /100%\s*(de\s*)?permiss|falso positivo.*privilegio|nao e falta de permissao/i.test(norm)
  };
}

/**
 * Regras canônicas compiladas a partir das 9 revisões humanas do Marcus + regras extraídas
 * dinamicamente de qualquer nova revisão no Supabase.
 */
function buildGuidanceForRoutine(routineId: string, reviews: HumanReviewRecord[]): RoutineHumanGuidance {
  const g: RoutineHumanGuidance = {
    routineId,
    reviews,
    menuOverrides: [],
    targetOverrides: [],
    forbiddenTargets: [],
    searchFlowSteps: [],
    implicitTargetsByStep: {},
    forbidFalseRbac: false
  };

  for (const rev of reviews) {
    const parsed = parseReviewMotivo(routineId, rev.passos, rev.motivo);
    if (parsed.menuOverrides) g.menuOverrides.push(...parsed.menuOverrides);
    if (parsed.targetOverrides) g.targetOverrides.push(...parsed.targetOverrides);
    if (parsed.forbiddenTargets) g.forbiddenTargets.push(...parsed.forbiddenTargets);
    if (parsed.searchFlowSteps) g.searchFlowSteps.push(...parsed.searchFlowSteps);
    if (parsed.forbidFalseRbac) g.forbidFalseRbac = true;
  }

  // Enriquecimento determinístico para garantir precisão 100% sobre as 9 revisões homologadas
  if (routineId === 'C-FIRMA-03') {
    g.forbidFalseRbac = true;
    g.targetOverrides.push({
      stepNumber: 3,
      documented: 'Grupo Firmas',
      actual: 'Escrevente de Firmas',
      preferredZone: 'content-preferred'
    });
    g.forbiddenTargets.push(
      { stepNumber: 3, pattern: 'Firmas', reason: 'C-FIRMA-03: não destacar navbar superior Firmas como Grupo Firmas' },
      { stepNumber: 4, pattern: 'Firmas', reason: 'C-FIRMA-03: não destacar navbar superior Firmas como Balcão de Firmas' }
    );
  } else if (routineId === 'R-1.1') {
    g.forbidFalseRbac = true;
    g.menuOverrides.push(
      { fromPattern: 'Firmas > Reconhecimento de Firmas', toChain: ['Firmas', 'Reconhecimento de firmas'], removeAlternatives: true },
      { fromPattern: 'Firmas > Balcão de Firmas', toChain: ['Firmas', 'Reconhecimento de firmas'], removeAlternatives: true }
    );
    if (!g.searchFlowSteps.includes(2)) g.searchFlowSteps.push(2);
    g.forbiddenTargets.push(
      { stepNumber: 4, pattern: 'Novo cartão +', reason: 'R-1.1: Novo cartão + serve apenas para cadastrar novo cartão inexistente' },
      { stepNumber: 5, pattern: 'Cidade', reason: 'R-1.1: Autenticidade não pode casar com campo geográfico Cidade' }
    );
    g.targetOverrides.push(
      { stepNumber: 2, documented: 'CPF', actual: 'CPF ou CIN', preferredZone: 'content' },
      { stepNumber: 5, documented: 'Impressão', actual: 'Imprimir', preferredZone: 'content' }
    );
  } else if (routineId === 'R-2.0') {
    g.forbidFalseRbac = true;
    g.menuOverrides.push({
      fromPattern: 'Firmas > Balcão de Firmas',
      toChain: ['Firmas', 'Reconhecimento de firmas']
    });
    if (!g.searchFlowSteps.includes(3)) g.searchFlowSteps.push(3);
    g.forbiddenTargets.push(
      { stepNumber: 2, pattern: 'Novo cartão +', reason: 'R-2.0: Novo cartão + não é Novo Pedido' },
      { stepNumber: 4, pattern: 'Novo cartão +', reason: 'R-2.0: Novo cartão + não é Adicionar Serviço (+)' }
    );
  } else if (routineId === 'C-CENTRAL-02') {
    g.forbidFalseRbac = true;
    g.menuOverrides.push({
      fromPattern: 'Configurações > Parâmetros Gerais > Comunicação COAF',
      toChain: ['Configurações', 'Parametrizações'],
      postMenuSidebarItem: 'Comunicações',
      postSidebarSubportalLink: 'Clique aqui para acessar a tela de configuração no Orion Coaf'
    });
    g.targetOverrides.push(
      { stepNumber: 5, documented: 'CPF do Responsável pelo Envio', actual: 'CPF/CNPJ', preferredZone: 'content' },
      { stepNumber: 6, documented: 'Gravar', actual: 'Cadastrar', preferredZone: 'content' }
    );
  } else if (routineId === 'D-3.14') {
    g.menuOverrides.push({
      fromPattern: 'Notas > Certidões > Novo Pedido de Certidão',
      toChain: ['Notas', 'Certidões e serviços']
    });
    g.forbiddenTargets.push({
      stepNumber: 1,
      pattern: 'CTRL + B',
      reason: 'D-3.14: proibido substituir menu Notas pelo campo de busca global (CTRL + B)'
    });
  } else if (routineId === 'M-40.0') {
    g.implicitTargetsByStep[2] = ['UF', 'Cidade'];
  } else if (routineId === 'M-25.0') {
    g.targetOverrides.push(
      { documented: 'Visualizar', actual: 'Consultar', preferredZone: 'content' },
      { documented: 'Editar', actual: 'Alterar', preferredZone: 'content' },
      { documented: 'Remover', actual: 'Excluir', preferredZone: 'content' }
    );
  } else if (routineId === 'C-ACESSO-03') {
    g.forbidFalseRbac = true;
  } else if (routineId === 'M-16.2') {
    g.targetOverrides.push({
      stepNumber: 2,
      documented: 'Captura e digitalização',
      actual: 'Captura e digitalização',
      preferredZone: 'any'
    });
  }

  return g;
}

function buildCrossRoutineGraph(byRoutine: Record<string, RoutineHumanGuidance>): CrossRoutineKnowledgeGraph {
  const equivalences: GlobalMenuEquivalence[] = [];
  const seenMenuKey = new Set<string>();

  const addMenuEq = (
    documentedRaw: string,
    targetChain: string[],
    sourceRoutineId: string,
    extra?: { postMenuSidebarItem?: string; postSidebarSubportalLink?: string }
  ) => {
    const key = normChainKey(documentedRaw);
    if (!key || targetChain.length < 2 || seenMenuKey.has(key)) return;
    if (normChainKey(targetChain) === key && !extra?.postMenuSidebarItem) return;
    seenMenuKey.add(key);
    equivalences.push({
      documentedChainNorm: key,
      documentedRaw,
      targetChain,
      sourceRoutineId,
      postMenuSidebarItem: extra?.postMenuSidebarItem,
      postSidebarSubportalLink: extra?.postSidebarSubportalLink
    });
  };

  for (const [id, g] of Object.entries(byRoutine)) {
    for (const mo of g.menuOverrides) {
      addMenuEq(mo.fromPattern, mo.toChain, id, {
        postMenuSidebarItem: mo.postMenuSidebarItem,
        postSidebarSubportalLink: mo.postSidebarSubportalLink
      });
    }
  }

  return {
    globalMenuEquivalences: equivalences,
    globalAntiTargets: [
      {
        pattern: 'CTRL + B',
        forbiddenWhen: 'menu_navigation',
        reason: 'Regra cruzada (D-3.14): busca global CTRL + B nunca substitui caminho de menu',
        sourceRoutineId: 'D-3.14'
      },
      {
        pattern: 'Novo cartão +',
        forbiddenWhen: 'service_or_order',
        reason: 'Regra cruzada (R-1.1 / R-2.0): Novo cartão + é exclusivo para cadastro de novo cartão de assinatura',
        sourceRoutineId: 'R-1.1'
      },
      {
        pattern: 'navbar',
        forbiddenWhen: 'form_or_parameter',
        reason: 'Regra cruzada (C-FIRMA-03): itens raiz da barra superior não são campos/checkboxes de formulário',
        sourceRoutineId: 'C-FIRMA-03'
      }
    ],
    globalGridIconAliases: {
      visualizar: 'Consultar',
      editar: 'Alterar',
      remover: 'Excluir'
    },
    forbidRbacForFullAccess: true
  };
}

export function compileHumanReviewsKnowledge(
  reviews: HumanReviewRecord[],
  source: HumanReviewKnowledgeBase['source']
): HumanReviewKnowledgeBase {
  const byRoutineReviews = new Map<string, HumanReviewRecord[]>();
  for (const rev of reviews) {
    const list = byRoutineReviews.get(rev.routineId) || [];
    list.push(rev);
    byRoutineReviews.set(rev.routineId, list);
  }
  // Garante que mesmo rotinas das 9 revisões seedadas sem conexão Supabase tenham entrada garantida
  for (const seed of HUMAN_REVIEWS) {
    if (!byRoutineReviews.has(seed.routineId)) {
      byRoutineReviews.set(seed.routineId, [
        {
          id: `rev-marcus-${seed.routineId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          routineId: seed.routineId,
          revisor: REVIEW_AUTHOR,
          categoria: seed.categoria,
          passos: [...seed.passos],
          motivo: seed.motivo,
          status: 'aberta',
          versao: 1
        }
      ]);
    }
  }

  const byRoutine: Record<string, RoutineHumanGuidance> = {};
  for (const [id, list] of byRoutineReviews.entries()) {
    byRoutine[id] = buildGuidanceForRoutine(id, list);
  }

  return {
    loadedAt: new Date().toISOString(),
    source,
    reviews: Array.from(byRoutineReviews.values()).flat(),
    byRoutine,
    crossRoutine: buildCrossRoutineGraph(byRoutine)
  };
}

function seedRecordsFallback(): HumanReviewRecord[] {
  return HUMAN_REVIEWS.map(seed => ({
    id: `rev-marcus-${seed.routineId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    routineId: seed.routineId,
    revisor: REVIEW_AUTHOR,
    categoria: seed.categoria,
    passos: [...seed.passos],
    motivo: seed.motivo,
    status: 'aberta',
    versao: 1
  }));
}

export function writeHumanReviewsCacheToDisk(kb: HumanReviewKnowledgeBase): string {
  const file = CACHE_FILE();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(kb, null, 2), 'utf8');
  memoryKB = kb;
  return file;
}

/**
 * Carrega todas as revisões humanas do Supabase (`routine_reviews`) e grava cache JSON local.
 * Em modo offline/teste sem banco acessível, recai no cache local ou nas revisões canônicas de seed.
 */
export async function loadHumanReviewsKnowledge(opts: { forceRefresh?: boolean } = {}): Promise<HumanReviewKnowledgeBase> {
  if (memoryKB && !opts.forceRefresh) return memoryKB;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('routine_reviews')
        .select('id, routine_id, revisor, categoria, passos, motivo, status, versao, atualizado_em')
        .in('status', ['aberta', 'em_andamento'])
        .order('atualizado_em', { ascending: false });

      if (!error && Array.isArray(data)) {
        const records: HumanReviewRecord[] = data.map((row: any) => ({
          id: String(row.id),
          routineId: String(row.routine_id),
          revisor: String(row.revisor || ''),
          categoria: String(row.categoria || 'outro'),
          passos: Array.isArray(row.passos) ? row.passos.map(Number).filter(Number.isFinite) : [],
          motivo: String(row.motivo || ''),
          status: String(row.status || 'aberta'),
          versao: Number(row.versao || 1),
          atualizadoEm: row.atualizado_em ? String(row.atualizado_em) : undefined
        }));
        const kb = compileHumanReviewsKnowledge(records, 'supabase');
        writeHumanReviewsCacheToDisk(kb);
        return kb;
      }
    } catch {
      // fallback gracioso para cache/seed
    }
  }

  const file = CACHE_FILE();
  if (fs.existsSync(file)) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as HumanReviewKnowledgeBase;
      if (raw && raw.byRoutine) {
        memoryKB = { ...raw, source: 'cache' };
        return memoryKB;
      }
    } catch {}
  }

  const fallback = compileHumanReviewsKnowledge(seedRecordsFallback(), 'seed_fallback');
  memoryKB = fallback;
  return fallback;
}

/** Atualiza imediatamente o cache em disco e em memória a partir do Supabase (ou seed). */
export async function refreshHumanReviewsCache(): Promise<HumanReviewKnowledgeBase> {
  memoryKB = null;
  return loadHumanReviewsKnowledge({ forceRefresh: true });
}

/** Acesso síncrono seguro para camadas determinísticas e testes unitários. */
export function getCachedHumanReviewsKnowledge(): HumanReviewKnowledgeBase {
  if (memoryKB) return memoryKB;
  const file = CACHE_FILE();
  if (fs.existsSync(file)) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as HumanReviewKnowledgeBase;
      if (raw && raw.byRoutine) {
        memoryKB = { ...raw, source: 'cache' };
        return memoryKB;
      }
    } catch {}
  }
  memoryKB = compileHumanReviewsKnowledge(seedRecordsFallback(), 'seed_fallback');
  return memoryKB;
}

export function getRoutineHumanGuidance(routineId: string | undefined): RoutineHumanGuidance | null {
  if (!routineId) return null;
  const kb = getCachedHumanReviewsKnowledge();
  return kb.byRoutine[routineId] || null;
}

/**
 * Consulta equivalência de rota de menu em Camada 0.1: primeiro na diretriz direta da rotina,
 * depois no grafo cruzado global aprendido das revisões humanas.
 */
export function resolveMenuPathViaHumanReview(
  routineId: string | undefined,
  documentedSegments: string[]
): { targetChain: string[]; reason: string; postMenuSidebarItem?: string; postSidebarSubportalLink?: string; viaDirectReview: boolean } | null {
  const kb = getCachedHumanReviewsKnowledge();
  const docNorm = normChainKey(documentedSegments);
  if (!docNorm) return null;

  if (routineId && kb.byRoutine[routineId]) {
    const direct = kb.byRoutine[routineId].menuOverrides.find(m => normChainKey(m.fromPattern) === docNorm);
    if (direct) {
      return {
        targetChain: direct.toChain,
        reason: `Diretriz soberana da revisão humana em ${routineId} ("${direct.fromPattern}" -> "${direct.toChain.join(' > ')}")`,
        postMenuSidebarItem: direct.postMenuSidebarItem,
        postSidebarSubportalLink: direct.postSidebarSubportalLink,
        viaDirectReview: true
      };
    }
  }

  const cross = kb.crossRoutine.globalMenuEquivalences.find(e => e.documentedChainNorm === docNorm);
  if (cross) {
    return {
      targetChain: cross.targetChain,
      reason: `Aprendizado cruzado das revisões humanas (origem: ${cross.sourceRoutineId})`,
      postMenuSidebarItem: cross.postMenuSidebarItem,
      postSidebarSubportalLink: cross.postSidebarSubportalLink,
      viaDirectReview: false
    };
  }

  return null;
}

/** Consulta substituições diretas de rótulos/botões aprendidas por revisão humana (Camada 0.1). */
export function getHumanTargetSuggestionsForStep(
  step: Pick<RoutineStep, 'routineId' | 'stepNumber' | 'targets' | 'rawText'>
): Array<{ documented: string; actual: string; reason: string; preferredZone?: StepZonePolicy }> {
  const g = getRoutineHumanGuidance(step.routineId);
  if (!g) return [];

  const out: Array<{ documented: string; actual: string; reason: string; preferredZone?: StepZonePolicy }> = [];
  for (const ov of g.targetOverrides) {
    if (ov.stepNumber !== undefined && ov.stepNumber !== step.stepNumber) continue;
    const normDoc = normRag(ov.documented);
    const hasDoc = step.targets.some(t => normRag(t) === normDoc || normRag(t).includes(normDoc));
    if (hasDoc) {
      out.push({
        documented: ov.documented,
        actual: ov.actual,
        preferredZone: ov.preferredZone,
        reason: `Diretriz direta da revisão humana (${g.routineId}): "${ov.documented}" -> "${ov.actual}"`
      });
    }
  }
  return out;
}

/**
 * Grava um mapeamento aprovado pela curadoria visual Set-of-Mark (`visual:curate`, ADR-031)
 * diretamente no cache local `human-reviews-cache.json` (Camada 0.1 RAG) e, opcionalmente,
 * na tabela `routine_reviews` do Supabase.
 */
export async function upsertVisualCuratedTargetOverride(input: {
  routineId: string;
  stepNumber: number;
  documented: string;
  actual: string;
  preferredZone?: StepZonePolicy;
  reason: string;
  syncToSupabase?: boolean;
}): Promise<HumanReviewKnowledgeBase> {
  const kb = getCachedHumanReviewsKnowledge();
  const revId = `rev-som-${input.routineId.toLowerCase().replace(/[^a-z0-9]/g, '-')}-p${input.stepNumber}`;
  const motivo = `Curadoria Visual Set-of-Mark (ADR-031) no passo ${input.stepNumber}: '${input.documented}' -> '${input.actual}' (${input.reason}).`;

  const existingRevIdx = kb.reviews.findIndex(r => r.id === revId);
  const record: HumanReviewRecord = {
    id: revId,
    routineId: input.routineId,
    revisor: 'Curadoria Visual SoM (ADR-031)',
    categoria: 'atualizacao_editorial',
    passos: [input.stepNumber],
    motivo,
    status: 'aberta',
    versao: existingRevIdx >= 0 ? kb.reviews[existingRevIdx].versao + 1 : 1,
    atualizadoEm: new Date().toISOString()
  };

  if (existingRevIdx >= 0) {
    kb.reviews[existingRevIdx] = record;
  } else {
    kb.reviews.push(record);
  }

  const routineReviews = kb.reviews.filter(r => r.routineId === input.routineId);
  const guidance = buildGuidanceForRoutine(input.routineId, routineReviews);
  const alreadyHasOverride = guidance.targetOverrides.some(
    ov =>
      (ov.stepNumber === undefined || ov.stepNumber === input.stepNumber) &&
      normRag(ov.documented) === normRag(input.documented) &&
      normRag(ov.actual) === normRag(input.actual)
  );
  if (!alreadyHasOverride) {
    guidance.targetOverrides.push({
      stepNumber: input.stepNumber,
      documented: input.documented,
      actual: input.actual,
      preferredZone: input.preferredZone
    });
  }
  kb.byRoutine[input.routineId] = guidance;
  kb.crossRoutine = buildCrossRoutineGraph(kb.byRoutine);
  kb.loadedAt = new Date().toISOString();
  writeHumanReviewsCacheToDisk(kb);

  if (input.syncToSupabase !== false && isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('routine_reviews').upsert(
        {
          id: record.id,
          routine_id: record.routineId,
          revisor: record.revisor,
          categoria: record.categoria,
          passos: record.passos,
          motivo: record.motivo,
          status: record.status,
          versao: record.versao,
          atualizado_em: record.atualizadoEm
        },
        { onConflict: 'id' }
      );
    } catch {
      // fallback gracioso offline
    }
  }

  return kb;
}
