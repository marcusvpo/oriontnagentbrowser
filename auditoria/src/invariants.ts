import fs from 'node:fs';
import sharp from 'sharp';
import {
  calculateRectIntersection,
  computeMultiAnnotationLayout,
  computeOptimalAnnotationLayout,
  intersectBoundingBox,
  resolvePhysicalBox,
  unionBoundingBoxes
} from './dom-geometry.js';
import { isCommitLabel } from './mutation-guard.js';
import yaml from 'yaml';
import {
  LEGACY_PREFIX_RE,
  REVIEW_PREFIX_RE,
  isReviewStatus,
  normalizeReviewTags,
  reviewTagsPrefix,
  statusFromPrefix,
  tagOfStatus,
  tagsFromPrefix,
  type ReviewTag
} from './review-taxonomy.js';
import { EXTERNAL_STEP_MARKER } from './step-scope.js';
import type {
  AnnotationLayoutResult,
  BoundingBox,
  DOMCallout,
  DOMResolvedGeometry,
  ExecutedStepAction,
  RoutineBlockInfo,
  StepZonePolicy
} from './types.js';

/**
 * Os 8 invariantes matemáticos e estruturais de uma print auditada (ADR-011 a ADR-018), numa única
 * implementação usada pelo validador de lote (`verify-all-phase2-boxes.ts`) e pelo servidor do Orion
 * Audit Console (`GET /api/rotinas/:id`). Vale para as duas fontes de telemetria — manifesto da
 * Fase 2 e executor do KB — e para as sub-capturas `passo-NN-b`.
 *
 * 1. Confinamento: caixa, molduras, badges e rótulos 100% dentro do buffer da imagem.
 * 2. Zero Auto-Oclusão: [badge + rótulo] x núcleo do elemento = 0 px².
 * 3. Zero Colisão: badge x rótulo = 0 px².
 * 4. Variância estrutural: a região demarcada contém um componente real de UI.
 * 5. Paridade dos artefatos: `.png`, `.webp` e marcador no `-revisado.md`.
 * 6. Zona Semântica: passo de política `content` resolvido em zona `content`, com 0 px² sobre a
 *    navegação lateral do mesmo frame.
 * 7. União Geométrica: a caixa de um grupo é exatamente a união dos seus membros, recortada ao viewport.
 * 8. Multi-Demarcação: numeração sequencial (continuando de uma print para a sub-captura seguinte),
 *    molduras no canvas, 0 px² de anotação sobre qualquer núcleo e 0 px² entre anotações.
 *
 * Quando a telemetria traz o layout efetivamente desenhado (`layout`, executor do KB), é ele que é
 * auditado, com as interseções recalculadas aqui. Sem ele (manifesto), o layout é recomputado pelo
 * solver determinístico com os mesmos parâmetros do motor gráfico.
 */

export type InvariantName =
  | 'confinamento'
  | 'zero_auto_oclusao'
  | 'zero_colisao_badge_rotulo'
  | 'variancia_estrutural'
  | 'paridade_artefatos'
  | 'zona_semantica'
  | 'uniao_geometrica'
  | 'multi_demarcacao';

export const INVARIANT_NAMES: Record<number, InvariantName> = {
  1: 'confinamento',
  2: 'zero_auto_oclusao',
  3: 'zero_colisao_badge_rotulo',
  4: 'variancia_estrutural',
  5: 'paridade_artefatos',
  6: 'zona_semantica',
  7: 'uniao_geometrica',
  8: 'multi_demarcacao'
};

/** Formato comum às duas fontes de telemetria: manifesto da Fase 2 e executor do KB. */
export interface PrintTelemetry {
  routineId: string;
  slug: string;
  modulo: string;
  stepNum: number;
  frame?: string;
  printName?: string;
  label: string;
  annotationLabel?: string;
  actionType?: string;
  rawScreenshotPath: string;
  finalPngPath: string;
  finalWebpPath: string;
  domGeometry: DOMResolvedGeometry | null;
  callouts?: DOMCallout[];
  layout?: AnnotationLayoutResult;
  captureMode?: 'annotated' | 'clean';
  captureKind?: 'step' | 'post-action' | 'trigger' | 'reveal';
  revealTrigger?: { kind: string; label: string; directed: boolean };
  zonePolicy?: StepZonePolicy;
  executedAction?: ExecutedStepAction;
  dryRunMutations?: boolean;
  status: 'ok' | 'blocked';
  blockKind?: RoutineBlockInfo['kind'];
  errorMessage?: string;
  source: 'manifesto' | 'kb';
}

export interface InvariantCheck {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  nome: InvariantName;
  aprovado: boolean;
  /** Falso quando o invariante não se aplica à print (ex.: print limpa, alvo único no invariante 8) */
  aplicavel: boolean;
  detalhe: string;
}

export type PrintAuditKind = 'geometry' | 'clean' | 'structured-block' | 'unclassified-block' | 'invalid';

export interface PrintAudit {
  kind: PrintAuditKind;
  printName: string;
  /** Discrepâncias, cada uma atribuída a um invariante (0 = consistência do relatório/segurança) */
  issues: Array<{ invariant: number; message: string }>;
  invariants: InvariantCheck[];
  /** Layout auditado: o desenhado (telemetria) ou o recomputado */
  layout?: AnnotationLayoutResult;
  zeroOcclusion: boolean;
  zoneScoped: boolean;
  groupUnion: boolean;
  /** Número de caixas numeradas (0 = demarcação única) */
  calloutBoxes: number;
  artifactPair: boolean;
}

export interface PrintAuditContext {
  /** Conteúdo do `-revisado.md` da pasta da print */
  mdContent: string;
  /** Nome da pasta da rotina (para conferir o prefixo `[ATT]`/`[DDD]`/`[XRX]`) */
  dirSlug: string;
  /** Print anterior do mesmo passo (para a continuidade da numeração das sub-capturas) */
  previousFrame?: PrintTelemetry;
  /** Pula a leitura de pixels do invariante 4 */
  skipPixelCheck?: boolean;
}

const inCanvas = (b: BoundingBox, w: number, h: number) => b.x >= 0 && b.y >= 0 && b.x + b.width <= w && b.y + b.height <= h;
const area = (b: BoundingBox) => Math.max(0, b.width) * Math.max(0, b.height);

/** Frontmatter YAML de um `-revisado.md` (objeto vazio se ilegível). */
function readFrontmatter(mdContent: string): Record<string, any> {
  const parts = mdContent.replace(/\r\n/g, '\n').split(/^---$/m);
  if (parts.length < 3) return {};
  try {
    return (yaml.parse(parts[1]) as Record<string, any>) || {};
  } catch {
    return {};
  }
}

/** Tags declaradas no relatório (`auditoria_ui.review_tags`), em ordem canônica. Sem a lista: derivada do `status` legado. */
export function reviewTagsFromMd(mdContent: string): ReviewTag[] {
  const ui = readFrontmatter(mdContent).auditoria_ui || {};
  if (Array.isArray(ui.review_tags)) return normalizeReviewTags(ui.review_tags);
  return isReviewStatus(ui.status) ? [tagOfStatus(ui.status)] : [];
}

/** Passos declarados como externos ao Orion TN (ADR-024) no frontmatter do relatório. */
export function externalStepsFromMd(mdContent: string): Array<{ stepNumber: number; portal: string }> {
  const list = readFrontmatter(mdContent).auditoria_ui?.etapas_externas;
  if (!Array.isArray(list)) return [];
  return list
    .map((e: any) => ({ stepNumber: Number(e?.passo), portal: String(e?.portal ?? '') }))
    .filter(e => Number.isInteger(e.stepNumber) && e.stepNumber > 0);
}

/**
 * Auditoria dos passos externos de uma pasta de rotina (ADR-024). Um passo `external_portal` NÃO tem
 * `passo-NN.png`, e isso não é erro de paridade: o passo vale pelo callout informativo. O que é erro:
 *  - print (marcador ou arquivo) de um passo declarado externo — seria evidência falsa da tela do Orion TN;
 *  - passo externo sem o callout `Etapa Externa (Fora do Orion TN)` no relatório;
 *  - `etapas_externas` sem a tag `[CCC]` em `review_tags`.
 * `onDiskPrints`: nomes `passo-NN[-x].png|webp` existentes na pasta (opcional).
 */
export function auditExternalSteps(mdContent: string, onDiskPrints: string[] = []): { steps: number[]; issues: string[] } {
  const external = externalStepsFromMd(mdContent);
  const issues: string[] = [];
  if (external.length === 0) return { steps: [], issues };

  if (!reviewTagsFromMd(mdContent).includes('CCC')) {
    issues.push('Passos externos declarados em etapas_externas, mas a tag [CCC] não consta em review_tags');
  }
  const body = mdContent.replace(/\r\n/g, '\n');
  // Só a seção "Passo a passo": o "Roteiro Técnico para Execução Manual" de uma rotina bloqueada também é numerado (1., 2.)
  const stepsStart = body.search(/^#### Passo a passo/m);
  const stepsSection = stepsStart >= 0 ? body.slice(stepsStart).replace(/^#### Passo a passo[^\n]*\n/, '') : body;
  const stepsEnd = stepsSection.search(/^#### /m);
  const steps = stepsEnd >= 0 ? stepsSection.slice(0, stepsEnd) : stepsSection;
  for (const { stepNumber } of external) {
    const pad = String(stepNumber).padStart(2, '0');
    const block = steps.match(new RegExp(`^${stepNumber}\\.\\s[\\s\\S]*?(?=^\\d+\\.\\s|^\\*\\s|$(?![\\s\\S]))`, 'm'))?.[0] ?? '';
    if (!block.includes(EXTERNAL_STEP_MARKER)) {
      issues.push(`Passo externo ${stepNumber} sem o callout "${EXTERNAL_STEP_MARKER}" no relatório`);
    }
    if (new RegExp(`\\[aqui vai a print "passo-${pad}(-[a-z])?\\.png"\\]`).test(body)) {
      issues.push(`Passo externo ${stepNumber} com marcador de print: a tela do Orion TN não pode ilustrar um passo de portal externo`);
    }
    if (onDiskPrints.some(f => new RegExp(`^passo-${pad}(-[a-z])?\\.(png|webp)$`, 'i').test(f))) {
      issues.push(`Passo externo ${stepNumber} com arquivo de print em disco (passo-${pad}): evidência falsa`);
    }
  }
  return { steps: external.map(e => e.stepNumber), issues };
}

export function printNameOf(item: Pick<PrintTelemetry, 'printName' | 'stepNum' | 'frame'>): string {
  if (item.printName) return item.printName;
  const pad = String(item.stepNum).padStart(2, '0');
  return !item.frame || item.frame === 'a' ? `passo-${pad}.png` : `passo-${pad}-${item.frame}.png`;
}

/** Invariante 4: a região demarcada contém estrutura real de UI (não é uma área vazia). */
async function flatRegion(rawPath: string, box: BoundingBox, imgW: number, imgH: number): Promise<string | null> {
  const left = Math.max(0, Math.min(box.x, imgW - 1));
  const top = Math.max(0, Math.min(box.y, imgH - 1));
  const width = Math.max(1, Math.min(box.width, imgW - left));
  const height = Math.max(1, Math.min(box.height, imgH - top));
  const { data, info } = await sharp(rawPath).extract({ left, top, width, height }).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  let sumLuma = 0;
  let sumSqLuma = 0;
  let activePixels = 0;
  const numPixels = info.width * info.height;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    sumLuma += luma;
    sumSqLuma += luma * luma;
    if (r < 248 || g < 248 || b < 248) activePixels++;
  }
  const mean = sumLuma / numPixels;
  const variance = sumSqLuma / numPixels - mean * mean;
  const activeRatio = activePixels / numPixels;
  return activeRatio < 0.005 && variance < 1.0
    ? `Região sem estrutura de UI (activeRatio=${(activeRatio * 100).toFixed(2)}%, var=${variance.toFixed(2)})`
    : null;
}

/** Último número de demarcação de uma print (print de alvo único conta como demarcação 1). */
function lastCalloutIndex(item: PrintTelemetry | undefined): number {
  if (!item) return 0;
  const callouts = item.callouts || [];
  return callouts.length > 0 ? callouts[callouts.length - 1].index : 1;
}

export async function auditPrint(item: PrintTelemetry, ctx: PrintAuditContext): Promise<PrintAudit> {
  const printName = printNameOf(item);
  const issues: PrintAudit['issues'] = [];
  const add = (invariant: number, message: string) => issues.push({ invariant, message });
  const { mdContent, dirSlug } = ctx;
  const isSubFrame = !!item.frame && item.frame !== 'a';

  let kind: PrintAuditKind = 'geometry';
  let layout: AnnotationLayoutResult | undefined;
  let zeroOcclusion = false;
  let zoneScoped = false;
  let groupUnion = false;
  let calloutBoxes = 0;
  let geometryAudited = false;
  let pixelChecked = false;

  // ADR-021: o prefixo legado [!!!] foi aposentado e nunca pode existir no acervo
  if (LEGACY_PREFIX_RE.test(dirSlug)) {
    add(0, 'Pasta com o prefixo legado [!!!] (aposentado pela ADR-021): migrar para [ATT], [DDD] ou [XRX]');
  }
  const mdStatus = mdContent.match(/^\s*status:\s*(\w+)/m)?.[1];
  const prefixStatus = statusFromPrefix(dirSlug);
  const prefixTags = tagsFromPrefix(dirSlug);
  const rawPrefix = dirSlug.match(REVIEW_PREFIX_RE)?.[0] ?? '';
  if (isReviewStatus(mdStatus) !== !!prefixStatus || (prefixStatus && mdStatus !== prefixStatus)) {
    add(
      0,
      `Taxonomia incoerente: status do relatório "${mdStatus ?? '(ausente)'}" x prefixo da pasta "${rawPrefix.trim() || '(nenhum)'}"`
    );
  }
  // ADR-024: multi-tags. O prefixo segue a ordem canônica, sem espaço entre colchetes, e repete review_tags
  if (rawPrefix && rawPrefix !== reviewTagsPrefix(prefixTags)) {
    add(0, `Prefixo fora do padrão canônico: "${rawPrefix}" (esperado "${reviewTagsPrefix(prefixTags)}": ordem ATT, CCC, DDD, XRX e sem espaço entre colchetes)`);
  }
  const mdTags = reviewTagsFromMd(mdContent);
  if (mdTags.join(',') !== prefixTags.join(',')) {
    add(0, `Tags incoerentes: review_tags do relatório [${mdTags.join(', ') || '-'}] x prefixo da pasta [${prefixTags.join(', ') || '-'}]`);
  }
  // Passo externo (ADR-024): não tem print por desenho; print em passo externo é evidência falsa
  const externalDeclared = externalStepsFromMd(mdContent).map(e => e.stepNumber);
  if (externalDeclared.includes(item.stepNum)) {
    add(5, `Passo ${item.stepNum} está declarado como externo (portal fora do Orion TN) e não pode ter print da tela do sistema`);
  }

  // Trava de Viewport (ADR-009, regra 6): toda print entregue tem exatamente 1440x900. A geometria pode
  // continuar coerente numa print larga (a caixa é escalada pelo viewport medido), então só esta conferência
  // direta nas dimensões do arquivo pega um worker que perdeu a emulação (ex.: nova aba aberta por um passo).
  if (item.finalPngPath && fs.existsSync(item.finalPngPath)) {
    const finalMeta = await sharp(item.finalPngPath).metadata();
    if (finalMeta.width !== 1440 || finalMeta.height !== 900) {
      add(1, `Print fora da trava de viewport 1440x900: ${finalMeta.width}x${finalMeta.height} (${printName})`);
    }
  }

  if (item.status === 'blocked' && item.blockKind) {
    kind = 'structured-block';
    if (!isReviewStatus(mdStatus) || !prefixStatus || !/tipo_bloqueio:/.test(mdContent)) {
      add(0, 'Bloqueio estruturado sem sinalização [ATT]/[DDD]/[XRX], status de revisão e tipo_bloqueio no relatório');
    }
  } else if (item.status === 'blocked') {
    kind = 'unclassified-block';
    add(0, `Passo bloqueado na execução ao vivo: ${item.errorMessage || 'DOM não localizado'}`);
  } else if (!item.domGeometry) {
    if (item.captureMode === 'clean') {
      kind = 'clean';
    } else {
      kind = 'invalid';
      add(1, 'Passo sem geometria do DOM e sem marcação de print limpa');
    }
  } else if (!fs.existsSync(item.rawScreenshotPath)) {
    kind = 'invalid';
    add(4, `Screenshot bruto ao vivo não encontrado: ${item.rawScreenshotPath}`);
  } else {
    geometryAudited = true;
    const meta = await sharp(item.rawScreenshotPath).metadata();
    const imgW = meta.width || 1440;
    const imgH = meta.height || 900;
    const geo = item.domGeometry;
    const box = geo.cssBox;
    const callouts = item.callouts && item.callouts.length > 0 ? item.callouts : undefined;
    const physical = (b: BoundingBox) =>
      intersectBoundingBox(resolvePhysicalBox(b, geo.viewport, imgW, imgH).physicalBox, { x: 0, y: 0, width: imgW, height: imgH });

    // 1. Limites físicos da caixa bruta
    if (box.x < 0 || box.y < 0) add(1, `Coordenada negativa: (${box.x}, ${box.y})`);
    if (box.x + box.width > imgW) add(1, `Transbordamento horizontal: x+w (${box.x + box.width}) > imgW (${imgW})`);
    if (box.y + box.height > imgH) add(1, `Transbordamento vertical: y+h (${box.y + box.height}) > imgH (${imgH})`);
    if (box.width < 4 || box.height < 4) add(1, `Dimensões colapsadas: ${box.width}x${box.height}`);

    if (callouts) {
      // 8. Multi-Demarcação (ADR-017) e continuidade da numeração nas sub-capturas (ADR-018)
      calloutBoxes = callouts.length;
      const firstIndex = isSubFrame ? lastCalloutIndex(ctx.previousFrame) + 1 : 1;
      if (isSubFrame && !ctx.previousFrame) add(8, `Sub-captura ${printName} sem a print anterior do passo na telemetria`);
      callouts.forEach((c, i) => {
        if (c.index !== firstIndex + i) {
          add(8, `Numeração fora de sequência: demarcação ${i + 1} tem índice ${c.index} (esperado ${firstIndex + i})`);
        }
        if (!inCanvas(c.cssBox, imgW, imgH)) add(8, `Demarcação ${c.index} fora do canvas: ${JSON.stringify(c.cssBox)}`);
        if (c.cssBox.width < 4 || c.cssBox.height < 4) add(8, `Demarcação ${c.index} colapsada: ${c.cssBox.width}x${c.cssBox.height}`);
      });
      if (!isSubFrame && callouts.length < 2) add(8, 'Print principal com multi-demarcação de um único alvo');

      layout =
        item.layout && item.layout.callouts && item.layout.callouts.length === callouts.length
          ? item.layout
          : computeMultiAnnotationLayout({
              callouts: callouts.map(c => ({ index: c.index, box: c.cssBox, label: c.label })),
              imgWidth: imgW,
              imgHeight: imgH,
              viewport: geo.viewport,
              padding: 3,
              softObstacles: geo.context.neighborBoxes
            });
      if (item.layout && layout !== item.layout) add(8, 'Layout desenhado não corresponde às demarcações registradas na telemetria');

      // Interseções recalculadas aqui, a partir das caixas medidas no DOM (não do que o solver declarou)
      const cores = callouts.map(c => physical(c.cssBox)).filter((b): b is BoundingBox => !!b);
      const annotations: BoundingBox[] = [];
      let occlusion = 0;
      for (const c of layout.callouts || []) {
        if (!inCanvas(c.targetBox, imgW, imgH)) add(8, `Moldura ${c.index} fora do canvas: ${JSON.stringify(c.targetBox)}`);
        if (!inCanvas(c.badgeBox, imgW, imgH)) add(8, `Badge ${c.index} fora do canvas: ${JSON.stringify(c.badgeBox)}`);
        if (c.labelBox && !inCanvas(c.labelBox, imgW, imgH)) add(8, `Rótulo ${c.index} fora do canvas: ${JSON.stringify(c.labelBox)}`);
        const own = c.labelBox ? [c.badgeBox, c.labelBox] : [c.badgeBox];
        const covered = own.reduce((acc, a) => acc + cores.reduce((s, core) => s + calculateRectIntersection(a, core), 0), 0);
        if (covered > 0) add(8, `Anotação ${c.index} cobre ${covered}px² do núcleo de um alvo`);
        occlusion += covered;
        annotations.push(...own);
      }
      let cross = 0;
      for (let i = 0; i < annotations.length; i++) {
        for (let k = i + 1; k < annotations.length; k++) cross += calculateRectIntersection(annotations[i], annotations[k]);
      }
      if (cross > 0) add(8, `Colisão entre anotações de alvos diferentes: ${cross}px²`);
      zeroOcclusion = occlusion === 0;
    } else {
      // 2 e 3. Layout de alvo único (badge, rótulo e auto-oclusão)
      if (isSubFrame) add(8, `Sub-captura ${printName} sem demarcações numeradas`);
      layout =
        item.layout && !item.layout.callouts
          ? item.layout
          : computeOptimalAnnotationLayout({
              rawBox: box,
              imgWidth: imgW,
              imgHeight: imgH,
              viewport: geo.viewport,
              domContext: geo.context,
              showActionIcon: true,
              labelText: item.annotationLabel ?? item.label,
              padding: 3
            });
      const bb = layout.badgeBox;
      const lb = layout.labelBox;
      if (!inCanvas(layout.targetBox, imgW, imgH)) add(1, `Moldura fora do canvas: ${JSON.stringify(layout.targetBox)}`);
      if (!inCanvas(bb, imgW, imgH)) add(1, `Badge fora do canvas: ${JSON.stringify(bb)}`);
      if (lb && !inCanvas(lb, imgW, imgH)) add(1, `Rótulo fora do canvas: ${JSON.stringify(lb)}`);
      if (lb) {
        const overlap = calculateRectIntersection(bb, lb);
        if (overlap > 0) add(3, `Colisão entre Badge e Rótulo: ${overlap}px²`);
      }
      const core = physical(box);
      const covered = core ? calculateRectIntersection(bb, core) + (lb ? calculateRectIntersection(lb, core) : 0) : 0;
      const declared = layout.selfOcclusionArea;
      if (covered > 0 || declared > 0) {
        add(2, `Auto-oclusão detectada sobre o elemento: ${Math.max(covered, declared)}px²`);
      } else {
        zeroOcclusion = true;
      }
      // A moldura desenhada tem de envolver o elemento medido (o clamping junto à borda do canvas
      // recua a moldura em até 2 px, daí a tolerância)
      if (core && calculateRectIntersection(layout.targetBox, core) < area(core) * 0.9) {
        add(1, `Moldura desenhada ${JSON.stringify(layout.targetBox)} não envolve o elemento medido ${JSON.stringify(core)}`);
      }
    }

    // 6. Zona Semântica (ADR-015)
    const zonePolicy = item.zonePolicy ?? geo.zonePolicy;
    if (zonePolicy === 'content' && geo.zone !== 'content') {
      add(6, `Passo de formulário (política content) resolvido fora da zona de conteúdo: zone=${geo.zone}`);
    }
    if (geo.zone === 'content') {
      zoneScoped = true;
      for (const navBox of geo.lateralNavBoxes || []) {
        const navOverlap = calculateRectIntersection(box, navBox);
        if (navOverlap > 0) add(6, `Violação de Zona Semântica: ${navOverlap}px² sobre a navegação lateral ${JSON.stringify(navBox)}`);
      }
    }

    // 7. União Geométrica de Múltiplos Alvos (ADR-015)
    if (geo.groupMembers && geo.groupMembers.length > 0) {
      groupUnion = true;
      const exactUnion = unionBoundingBoxes(geo.groupMembers.map(m => m.cssBox));
      const vp = geo.viewport;
      const expected = exactUnion ? intersectBoundingBox(exactUnion, { x: 0, y: 0, width: vp.width, height: vp.height }) : null;
      if (!expected || expected.x !== box.x || expected.y !== box.y || expected.width !== box.width || expected.height !== box.height) {
        add(7, `União geométrica divergente: esperado ${JSON.stringify(expected)} (união de ${geo.groupMembers.length} membros), medido ${JSON.stringify(box)}`);
      }
    }

    // 4. Coerência estrutural (variância de luminância na(s) região(ões) demarcada(s))
    if (issues.length === 0 && !ctx.skipPixelCheck) {
      pixelChecked = true;
      for (const region of callouts ? callouts.map(c => c.cssBox) : [box]) {
        const flat = await flatRegion(item.rawScreenshotPath, region, imgW, imgH);
        if (flat) add(4, flat);
      }
    }
  }

  // 5. Paridade dos artefatos finais (.png, .webp e marcador no .md) — vale para toda print
  const pngExists = fs.existsSync(item.finalPngPath);
  const webpExists = fs.existsSync(item.finalWebpPath);
  if (!pngExists) add(5, `Artefato PNG ausente: ${item.finalPngPath}`);
  if (!webpExists) add(5, `Artefato WebP ausente: ${item.finalWebpPath}`);
  if (!mdContent.includes(`"${printName}"`)) add(5, `Marcador [aqui vai a print "${printName}"] ausente no markdown revisado`);

  // Consistência do relatório e segurança (ADR-018), fora dos 8 invariantes geométricos
  const action = item.executedAction;
  if (item.dryRunMutations && action?.kind === 'click' && (isCommitLabel(action.node?.text) || isCommitLabel(action.node?.hint))) {
    add(0, `Trava de Mutação violada: clique registrado no comando de gravação "${action.node?.text || action.node?.hint}"`);
  }
  if (action?.via === 'dry-run' && !mdContent.includes('Trava Segura de Mutação (dry-run)')) {
    add(0, 'Comando de gravação omitido pela Trava de Mutação sem a nota correspondente no relatório');
  }
  if (item.revealTrigger && !mdContent.includes(item.revealTrigger.label)) {
    add(0, `Gatilho revelador "${item.revealTrigger.label}" demarcado sem registro no relatório`);
  }

  const failed = (id: number) => issues.filter(i => i.invariant === id).map(i => i.message);
  const check = (id: InvariantCheck['id'], aplicavel: boolean, ok: string, na: string): InvariantCheck => {
    const problems = failed(id);
    return {
      id,
      nome: INVARIANT_NAMES[id],
      aplicavel,
      aprovado: problems.length === 0,
      detalhe: problems.length > 0 ? problems.join('; ') : aplicavel ? ok : na
    };
  };
  const noGeometry =
    kind === 'clean'
      ? 'Não se aplica: print limpa, sem demarcação'
      : kind === 'structured-block'
        ? 'Não se aplica: bloqueio estruturado ([ATT]/[DDD]/[XRX])'
        : 'Não auditado: print sem geometria válida';
  const geo = item.domGeometry;
  const invariants: InvariantCheck[] = [
    check(1, geometryAudited, 'Caixa, moldura, badge e rótulo dentro do canvas', noGeometry),
    check(2, geometryAudited, '0 px² de anotação sobre o núcleo do elemento', noGeometry),
    check(3, geometryAudited && !calloutBoxes && !!layout?.labelBox, '0 px² entre badge e rótulo', geometryAudited ? 'Não se aplica: sem rótulo ou print multi-demarcada (ver invariante 8)' : noGeometry),
    check(4, pixelChecked, 'Região demarcada contém componente real de UI', geometryAudited ? 'Não auditado: há discrepância anterior na geometria' : noGeometry),
    check(5, true, 'PNG + WebP + marcador no markdown', ''),
    check(6, geometryAudited && geo?.zone === 'content', 'Zona de conteúdo, 0 px² sobre a navegação lateral', geometryAudited ? `Não se aplica: alvo de navegação (zona ${geo?.zone || 'any'})` : noGeometry),
    check(7, groupUnion, `União exata de ${geo?.groupMembers?.length || 0} membro(s)`, geometryAudited ? 'Não se aplica: alvo único' : noGeometry),
    check(8, calloutBoxes > 0, `${calloutBoxes} demarcação(ões) numeradas em sequência, sem oclusão nem colisão`, geometryAudited ? 'Não se aplica: demarcação única' : noGeometry)
  ];

  return {
    kind,
    printName,
    issues,
    invariants,
    layout,
    zeroOcclusion,
    zoneScoped,
    groupUnion,
    calloutBoxes,
    artifactPair: pngExists && webpExists
  };
}

/**
 * Carrega a telemetria das duas fontes. Quando o executor do KB reauditou uma rotina do manifesto, as
 * prints em disco são as dele: as entradas do manifesto para essa rotina ficam superadas.
 */
export async function loadPrintTelemetry(
  manifestPath: string,
  kbTelemetryDir: string
): Promise<{ items: PrintTelemetry[]; supersededIds: string[]; supersededCount: number }> {
  const manifest: PrintTelemetry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(await fs.promises.readFile(manifestPath, 'utf8')) as PrintTelemetry[]).map(t => ({ ...t, source: 'manifesto' as const }))
    : [];
  const kb: PrintTelemetry[] = [];
  if (fs.existsSync(kbTelemetryDir)) {
    for (const file of (await fs.promises.readdir(kbTelemetryDir)).filter(f => f.endsWith('.json')).sort()) {
      const entries = JSON.parse(await fs.promises.readFile(`${kbTelemetryDir}/${file}`, 'utf8')) as PrintTelemetry[];
      kb.push(...entries.map(t => ({ ...t, source: 'kb' as const })));
    }
  }
  const kbIds = new Set(kb.map(t => t.routineId));
  const superseded = manifest.filter(t => kbIds.has(t.routineId));
  return {
    items: [...manifest.filter(t => !kbIds.has(t.routineId)), ...kb],
    supersededIds: Array.from(new Set(superseded.map(t => t.routineId))),
    supersededCount: superseded.length
  };
}
