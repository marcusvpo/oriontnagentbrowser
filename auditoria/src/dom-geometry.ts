import type {
  AnchorPlacement,
  AnnotationCalloutInput,
  AnnotationCalloutLayout,
  AnnotationLayoutResult,
  BoundingBox,
  DOMAngularBindings,
  DOMElementContext,
  DOMResolvedGeometry,
  DOMViewportMetrics,
  Point,
  SemanticZone
} from './types.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';

const ANGULAR_GENERIC_PREFIXES = new Set([
  'vm',
  'ctrl',
  '$ctrl',
  'scope',
  '$scope',
  'this',
  'model',
  'entity',
  'entidade',
  'dados',
  'form',
  'filtro',
  'filtros',
  'filter',
  'item',
  'dto',
  'vo',
  'obj',
  'data',
  'row',
  'registro'
]);

/**
 * Converte um identificador Angular (`filtro.cpfCnpj`, `vm.filtrarPesquisa(item)`)
 * em termos legíveis e minúsculos para desempate auxiliar e rótulos de fallback (ADR-030).
 */
export function humanizeAngularIdentifier(raw: string | null | undefined, kind: 'model' | 'action'): string {
  let text = String(raw ?? '').trim();
  if (!text) return '';
  if (kind === 'model') {
    text = text.split(/[|?:=&!<>+\-*/;]/)[0].trim();
  } else {
    const parts = text
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
    const callPart = parts.find(p => /\(/.test(p)) || parts[0] || '';
    text = callPart
      .replace(/\([^)]*\)/g, '')
      .split(/[=&!<>+\-*/]/)[0]
      .trim();
  }
  text = text.replace(/\[[^\]]*\]/g, '').replace(/[^A-Za-z0-9_$.]/g, '').trim();
  if (!text) return '';
  const segs = text
    .split('.')
    .map(s => s.trim())
    .filter(Boolean);
  while (segs.length > 1 && ANGULAR_GENERIC_PREFIXES.has(segs[0].toLowerCase())) {
    segs.shift();
  }
  const target = segs[segs.length - 1] || '';
  if (!target) return '';
  return target
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_$-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Extrai atributos nativos do AngularJS/Angular (`ng-model`, `ng-click`, `ui-sref`, `ng-disabled`, `ng-if`)
 * a partir de um dicionário de atributos do elemento (ADR-030).
 */
export function extractAngularBindingsFromAttrs(
  attrs: Record<string, string | null | undefined>
): DOMAngularBindings | undefined {
  const norm: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrs || {})) {
    const val = v == null ? '' : String(v).trim();
    if (val) norm[k.toLowerCase()] = val;
  }
  const ngModel = norm['ng-model'] || norm['data-ng-model'] || norm['formcontrolname'] || norm['ng-reflect-name'];
  const ngClick = norm['ng-click'] || norm['data-ng-click'];
  const uiSref = norm['ui-sref'] || norm['routerlink'] || norm['ng-href'];
  const ngDisabled = norm['ng-disabled'];
  const ngIf = norm['ng-if'] || norm['ng-show'] || norm['ng-hide'];

  if (!ngModel && !ngClick && !uiSref && !ngDisabled && !ngIf) return undefined;

  const out: DOMAngularBindings = {};
  if (ngModel) {
    out.ngModel = ngModel;
    const hm = humanizeAngularIdentifier(ngModel, 'model');
    if (hm) out.humanizedModel = hm;
  }
  if (ngClick) {
    out.ngClick = ngClick;
    const ha = humanizeAngularIdentifier(ngClick, 'action');
    if (ha) out.humanizedAction = ha;
  }
  if (uiSref) out.uiSref = uiSref;
  if (ngDisabled) out.ngDisabled = ngDisabled;
  if (ngIf) out.ngIf = ngIf;
  return out;
}

/**
 * Zonas de Navegação (ADR-015): qualquer elemento dentro destes contêineres é navegação
 * (sidebar, menu lateral, barra superior, faixa de abas) e nunca conteúdo de formulário.
 * Inclui o markup real do Orion TN 6.0 (`ul.nav.nav-pills.nav-stacked[role="tablist"]`,
 * `a.bg-menu-lateral`), que não usa `<aside>`/`<nav>` semânticos.
 */
export const NAV_ZONE_SELECTOR = [
  'aside',
  'nav',
  '.sidebar',
  '.navbar',
  '.nav-stacked',
  '.nav-pills',
  '.nav-tabs',
  '.menu-lateral',
  '.bg-menu-lateral',
  '[role="tablist"]',
  '[role="navigation"]',
  '[role="menubar"]'
].join(', ');

/**
 * Clamp matemático determinístico no intervalo fechado [min, max].
 */
export function clamp(val: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.max(min, Math.min(max, val));
}

/**
 * Calcula a área de interseção (em px²) entre dois retângulos.
 * Retorna 0 se não houver sobreposição.
 */
export function calculateRectIntersection(a: BoundingBox, b: BoundingBox): number {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return xOverlap * yOverlap;
}

/**
 * Calcula a caixa delimitadora (union box) que engloba dois retângulos.
 */
export function unionBoundingBox(a: BoundingBox, b?: BoundingBox): BoundingBox {
  if (!b) return { ...a };
  const minX = Math.min(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxX = Math.max(a.x + a.width, b.x + b.width);
  const maxY = Math.max(a.y + a.height, b.y + b.height);
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * União matemática exata de N retângulos: (minX, minY, maxX, maxY).
 * Retorna `null` para lista vazia. É a contraparte Node do cálculo feito no navegador
 * para a União Geométrica de Múltiplos Alvos (ADR-015) e é usada pelo validador.
 */
export function unionBoundingBoxes(boxes: BoundingBox[]): BoundingBox | null {
  if (boxes.length === 0) return null;
  return boxes.slice(1).reduce((acc, b) => unionBoundingBox(acc, b), { ...boxes[0] });
}

/**
 * Interseção de dois retângulos. Retorna `null` se não houver área em comum.
 */
export function intersectBoundingBox(a: BoundingBox, b: BoundingBox): BoundingBox | null {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 - x1 <= 0 || y2 - y1 <= 0) return null;
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

/**
 * Transforma coordenadas do espaço CSS do DOM (Viewport Space) para o espaço
 * físico de pixels do buffer da imagem capturada (Physical Image Space),
 * compensando automaticamente devicePixelRatio (DPR) ou redimensionamentos.
 */
export function resolvePhysicalBox(
  cssBox: BoundingBox,
  viewport: DOMViewportMetrics | undefined,
  imageWidth: number,
  imageHeight: number
): { physicalBox: BoundingBox; scaleX: number; scaleY: number } {
  const vpWidth = viewport && viewport.width > 0 ? viewport.width : imageWidth;
  const vpHeight = viewport && viewport.height > 0 ? viewport.height : imageHeight;

  const scaleX = imageWidth / vpWidth;
  const scaleY = imageHeight / vpHeight;

  return {
    physicalBox: {
      x: Math.round(cssBox.x * scaleX),
      y: Math.round(cssBox.y * scaleY),
      width: Math.round(cssBox.width * scaleX),
      height: Math.round(cssBox.height * scaleY)
    },
    scaleX,
    scaleY
  };
}

export interface LayoutSolverParams {
  rawBox: BoundingBox;
  imgWidth: number;
  imgHeight: number;
  viewport?: DOMViewportMetrics;
  domContext?: DOMElementContext;
  anchorPlacement?: AnchorPlacement;
  showActionIcon?: boolean;
  labelText?: string;
  padding?: number;
}

/**
 * Solver Determinístico de Layout Gráfico (Anti-Oclusão e Clamping Matemático):
 * 1. Converte `rawBox` de CSS pixels para Physical pixels na imagem.
 * 2. Aplica clamping estrito dentro de [2, imgWidth - 2] x [2, imgHeight - 2].
 * 3. Avalia os 4 quadrantes cardinais (top, bottom, right, left) para o conjunto [Badge + Rótulo].
 * 4. Garante matematicamente Zero Auto-Oclusão (o badge e o rótulo nunca tampam o texto do botão/aba)
 *    e Zero Transbordamento das bordas do canvas.
 */
export function computeOptimalAnnotationLayout(params: LayoutSolverParams): AnnotationLayoutResult {
  const {
    rawBox,
    imgWidth,
    imgHeight,
    viewport,
    domContext,
    anchorPlacement = 'auto',
    showActionIcon = true,
    labelText,
    padding = 3
  } = params;

  // 1. Transformação CSS Space -> Physical Image Space
  const { physicalBox, scaleX, scaleY } = resolvePhysicalBox(rawBox, viewport, imgWidth, imgHeight);

  // 2. Clamping matemático estrito da moldura de destaque dentro do canvas
  const rx = clamp(physicalBox.x - padding, 2, imgWidth - 14);
  const ry = clamp(physicalBox.y - padding, 2, imgHeight - 14);
  const rw = clamp(physicalBox.width + padding * 2, 12, imgWidth - rx - 2);
  const rh = clamp(physicalBox.height + padding * 2, 10, imgHeight - ry - 2);

  const targetBox: BoundingBox = { x: rx, y: ry, width: rw, height: rh };

  // Caixa interna real do elemento (núcleo protegido contra oclusão textual)
  const coreElementBox: BoundingBox = {
    x: clamp(physicalBox.x, rx, rx + rw),
    y: clamp(physicalBox.y, ry, ry + rh),
    width: Math.max(4, Math.min(physicalBox.width, rw)),
    height: Math.max(4, Math.min(physicalBox.height, rh))
  };

  // Dimensões do Badge e do Rótulo
  const badgeW = showActionIcon ? 48 : 28;
  const badgeH = 28;
  const labelH = 22;
  const gapBadgeToLabel = 8;
  const gapToTarget = 6;
  const canvasMarginX = 8;
  const canvasMarginY = 4;

  const cleanLabel = labelText ? labelText.trim() : '';
  const rawLabelW = cleanLabel ? Math.round(cleanLabel.length * 8.2 + 20) : 0;
  const maxAllowedLabelW = Math.max(60, imgWidth - badgeW - gapBadgeToLabel - canvasMarginX * 2);
  const labelW = cleanLabel ? Math.min(rawLabelW, maxAllowedLabelW) : 0;

  // Inferir contexto estrutural (prioriza metadados reais do DOM; fallback geométrico caso ausente)
  const isSidebar = domContext?.isVerticalSidebar ?? (rx < 120 && rw < 230 && ry > 60 && ry < imgHeight - 60);
  const isTopBar = domContext?.isTopNav ?? (ry < 42);

  // Definir ordem de preferência de ancoragem
  type CardinalDirection = Exclude<AnchorPlacement, 'auto'>;
  let candidateOrder: CardinalDirection[];

  if (anchorPlacement !== 'auto') {
    const others: CardinalDirection[] = (['top', 'bottom', 'right', 'left'] as CardinalDirection[]).filter(
      d => d !== anchorPlacement
    );
    candidateOrder = [anchorPlacement, ...others];
  } else if (isSidebar) {
    candidateOrder = ['right', 'top', 'bottom', 'left'];
  } else if (isTopBar) {
    candidateOrder = ['bottom', 'right', 'left', 'top'];
  } else {
    candidateOrder = ['top', 'bottom', 'right', 'left'];
  }

  // Escalar caixas de elementos vizinhos se fornecidas pelo DOM
  const scaledNeighbors: BoundingBox[] = (domContext?.neighborBoxes || []).map(nb => ({
    x: Math.round(nb.x * scaleX),
    y: Math.round(nb.y * scaleY),
    width: Math.round(nb.width * scaleX),
    height: Math.round(nb.height * scaleY)
  }));

  interface EvaluatedCandidate {
    direction: CardinalDirection;
    badgeBox: BoundingBox;
    labelBox?: BoundingBox;
    selfOcclusionArea: number;
    score: number;
  }

  const evaluated: EvaluatedCandidate[] = [];

  for (let prefIdx = 0; prefIdx < candidateOrder.length; prefIdx++) {
    const dir = candidateOrder[prefIdx];
    const totalGroupW = labelW > 0 ? badgeW + gapBadgeToLabel + labelW : badgeW;

    let idealBadgeX = rx;
    let idealBadgeY = ry - badgeH - gapToTarget;

    if (dir === 'top') {
      idealBadgeX = clamp(rx, canvasMarginX, imgWidth - totalGroupW - canvasMarginX);
      idealBadgeY = ry - badgeH - gapToTarget;
    } else if (dir === 'bottom') {
      idealBadgeX = clamp(rx, canvasMarginX, imgWidth - totalGroupW - canvasMarginX);
      idealBadgeY = ry + rh + gapToTarget;
    } else if (dir === 'right') {
      idealBadgeX = rx + rw + gapToTarget + 2;
      idealBadgeY = Math.round(ry + rh / 2 - badgeH / 2);
    } else if (dir === 'left') {
      idealBadgeX = rx - totalGroupW - gapToTarget - 2;
      idealBadgeY = Math.round(ry + rh / 2 - badgeH / 2);
    }

    // Clamping horizontal e vertical conjunto do grupo [Badge + Rótulo]
    const clampedGroupX = clamp(idealBadgeX, canvasMarginX, imgWidth - totalGroupW - canvasMarginX);
    const clampedBadgeY = clamp(idealBadgeY, canvasMarginY, imgHeight - badgeH - canvasMarginY);

    const badgeBox: BoundingBox = {
      x: clampedGroupX,
      y: clampedBadgeY,
      width: badgeW,
      height: badgeH
    };

    let labelBox: BoundingBox | undefined;
    if (labelW > 0) {
      const idealLabelX = badgeBox.x + badgeW + gapBadgeToLabel;
      const idealLabelY = Math.round(badgeBox.y + badgeH / 2 - labelH / 2);
      labelBox = {
        x: clamp(idealLabelX, badgeBox.x + badgeW + 4, imgWidth - labelW - canvasMarginX),
        y: clamp(idealLabelY, canvasMarginY, imgHeight - labelH - canvasMarginY),
        width: labelW,
        height: labelH
      };
    }

    // Cálculo de invariantes geométricos:
    // 1. Interseção com o próprio elemento-alvo (Auto-Oclusão)
    const badgeTargetOverlap = calculateRectIntersection(badgeBox, coreElementBox);
    const labelTargetOverlap = labelBox ? calculateRectIntersection(labelBox, coreElementBox) : 0;
    const selfOcclusionArea = badgeTargetOverlap + labelTargetOverlap;

    // 2. Interseção com a moldura externa (targetBox)
    const frameOverlap =
      calculateRectIntersection(badgeBox, targetBox) +
      (labelBox ? calculateRectIntersection(labelBox, targetBox) : 0);

    // 3. Interseção com elementos vizinhos no DOM
    let neighborOverlap = 0;
    for (const nb of scaledNeighbors) {
      neighborOverlap += calculateRectIntersection(badgeBox, nb);
      if (labelBox) neighborOverlap += calculateRectIntersection(labelBox, nb);
    }

    // 4. Deslocamento forçado contra a parede na direção do eixo de ancoragem
    const axisShiftPenalty =
      dir === 'top' || dir === 'bottom'
        ? Math.abs(clampedBadgeY - idealBadgeY) * 15
        : Math.abs(clampedGroupX - idealBadgeX) * 15 + Math.abs(clampedBadgeY - idealBadgeY) * 5;

    // Score total (menor = melhor):
    // Auto-oclusão tem peso altíssimo (1000x por px²) para ser estritamente evitada
    const score =
      selfOcclusionArea * 1000 +
      frameOverlap * 80 +
      neighborOverlap * 20 +
      axisShiftPenalty +
      prefIdx * 100;

    evaluated.push({
      direction: dir,
      badgeBox,
      labelBox,
      selfOcclusionArea,
      score
    });
  }

  // Ordena pelo menor score (zero oclusão e melhor alinhamento)
  evaluated.sort((a, b) => a.score - b.score);
  const best = evaluated[0];

  return {
    targetBox,
    badgeBox: best.badgeBox,
    labelBox: best.labelBox,
    placement: best.direction,
    scaleX,
    scaleY,
    selfOcclusionArea: best.selfOcclusionArea
  };
}

export interface MultiLayoutParams {
  callouts: AnnotationCalloutInput[];
  imgWidth: number;
  imgHeight: number;
  viewport?: DOMViewportMetrics;
  padding?: number;
  /**
   * Obstáculos suaves em CSS pixels (ex.: listas de menu abertas, itens vizinhos): a anotação evita
   * cobri-los quando há alternativa, mas eles não são restrição dura.
   */
  softObstacles?: BoundingBox[];
}

/** Largura estimada do rótulo de uma demarcação (mesma métrica do solver de alvo único). */
export const MULTI_LABEL_MAX_CHARS = 40;
export function trimCalloutLabel(text: string | undefined): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  return clean.length > MULTI_LABEL_MAX_CHARS ? clean.slice(0, MULTI_LABEL_MAX_CHARS - 1).trimEnd() + '…' : clean;
}

/**
 * Solver de Multi-Demarcação (ADR-017): posiciona, numa única imagem, a moldura, o badge numerado e
 * o rótulo de N alvos medidos no mesmo frame.
 *
 * Restrições duras (auditadas pelo validador, todas = 0 px²):
 * 1. nenhuma anotação (badge ou rótulo) cobre o núcleo de QUALQUER alvo da print;
 * 2. anotações de alvos diferentes não se sobrepõem, nem badge e rótulo do mesmo alvo;
 * 3. tudo fica dentro do canvas.
 *
 * Estratégia determinística e gulosa, na ordem dos índices: para cada alvo avalia os 4 quadrantes,
 * 3 alinhamentos e as variantes com/sem rótulo; se nenhuma posição respeitar as restrições duras,
 * desliza o badge sozinho ao longo das arestas do alvo. Vence o menor custo.
 */
export function computeMultiAnnotationLayout(params: MultiLayoutParams): AnnotationLayoutResult {
  const { callouts, imgWidth, imgHeight, viewport, padding = 3, softObstacles = [] } = params;
  if (callouts.length === 0) throw new Error('computeMultiAnnotationLayout: nenhuma demarcação informada');

  type Dir = Exclude<AnchorPlacement, 'auto'>;
  const badgeW = 28;
  const badgeH = 28;
  const labelH = 22;
  const gapBadgeToLabel = 6;
  const gapToTarget = 6;
  const marginX = 8;
  const marginY = 4;

  let scaleX = 1;
  let scaleY = 1;
  const prepared = callouts.map(c => {
    const { physicalBox, scaleX: sx, scaleY: sy } = resolvePhysicalBox(c.box, viewport, imgWidth, imgHeight);
    scaleX = sx;
    scaleY = sy;
    const rx = clamp(physicalBox.x - padding, 2, imgWidth - 14);
    const ry = clamp(physicalBox.y - padding, 2, imgHeight - 14);
    const rw = clamp(physicalBox.width + padding * 2, 12, imgWidth - rx - 2);
    const rh = clamp(physicalBox.height + padding * 2, 10, imgHeight - ry - 2);
    const targetBox: BoundingBox = { x: rx, y: ry, width: rw, height: rh };
    const coreBox: BoundingBox = {
      x: clamp(physicalBox.x, rx, rx + rw),
      y: clamp(physicalBox.y, ry, ry + rh),
      width: Math.max(4, Math.min(physicalBox.width, rw)),
      height: Math.max(4, Math.min(physicalBox.height, rh))
    };
    return { input: c, targetBox, coreBox, label: trimCalloutLabel(c.label) };
  });

  const cores = prepared.map(p => p.coreBox);
  const frames = prepared.map(p => p.targetBox);
  const soft = softObstacles.map(b => resolvePhysicalBox(b, viewport, imgWidth, imgHeight).physicalBox);
  const placedAnnotations: BoundingBox[] = [];
  const sumOverlap = (box: BoundingBox, others: BoundingBox[]) =>
    others.reduce((acc, o) => acc + calculateRectIntersection(box, o), 0);
  const inCanvas = (b: BoundingBox) => b.x >= 0 && b.y >= 0 && b.x + b.width <= imgWidth && b.y + b.height <= imgHeight;

  interface Candidate {
    dir: Dir;
    badgeBox: BoundingBox;
    labelBox?: BoundingBox;
    hard: number;
    score: number;
  }

  const layouts: AnnotationCalloutLayout[] = [];

  for (const p of prepared) {
    const { x: rx, y: ry, width: rw, height: rh } = p.targetBox;
    const labelW = p.label ? Math.min(Math.round(p.label.length * 8.2 + 20), Math.max(60, imgWidth - badgeW - gapBadgeToLabel - marginX * 2)) : 0;

    // Ordem de preferência: abaixo para a barra superior; lateral livre para itens de lista/menu baixos
    const cx = rx + rw / 2;
    const lowRow = rh <= 40;
    const sideFirst: Dir[] = cx >= imgWidth / 2 ? ['right', 'left'] : ['left', 'right'];
    const order: Dir[] =
      ry < 52 ? ['bottom', ...sideFirst, 'top'] : lowRow ? [...sideFirst, 'top', 'bottom'] : ['top', 'bottom', ...sideFirst];

    const candidates: Candidate[] = [];
    const evaluate = (dir: Dir, gx: number, gy: number, withLabel: boolean, extraCost: number) => {
      const groupW = withLabel ? badgeW + gapBadgeToLabel + labelW : badgeW;
      const x = clamp(Math.round(gx), marginX, imgWidth - groupW - marginX);
      const y = clamp(Math.round(gy), marginY, imgHeight - badgeH - marginY);
      const badgeBox: BoundingBox = { x, y, width: badgeW, height: badgeH };
      const labelBox: BoundingBox | undefined = withLabel
        ? { x: x + badgeW + gapBadgeToLabel, y: Math.round(y + badgeH / 2 - labelH / 2), width: labelW, height: labelH }
        : undefined;
      const boxes = labelBox ? [badgeBox, labelBox] : [badgeBox];

      let hard = 0;
      let softCost = 0;
      for (const b of boxes) {
        hard += sumOverlap(b, cores) + sumOverlap(b, placedAnnotations);
        if (!inCanvas(b)) hard += b.width * b.height;
        softCost += sumOverlap(b, frames) * 80 + sumOverlap(b, soft) * 20;
      }
      const shift = Math.abs(x - gx) + Math.abs(y - gy);
      const score = hard * 1000 + softCost + shift * 15 + order.indexOf(dir) * 100 + (withLabel || !p.label ? 0 : 250) + extraCost;
      candidates.push({ dir, badgeBox, labelBox, hard, score });
    };

    for (const withLabel of p.label ? [true, false] : [false]) {
      const groupW = withLabel ? badgeW + gapBadgeToLabel + labelW : badgeW;
      for (const dir of order) {
        if (dir === 'top' || dir === 'bottom') {
          const gy = dir === 'top' ? ry - badgeH - gapToTarget : ry + rh + gapToTarget;
          evaluate(dir, rx, gy, withLabel, 0);
          evaluate(dir, rx + rw - groupW, gy, withLabel, 10);
          evaluate(dir, rx + rw / 2 - groupW / 2, gy, withLabel, 20);
        } else {
          const gx = dir === 'right' ? rx + rw + gapToTarget + 2 : rx - groupW - gapToTarget - 2;
          evaluate(dir, gx, ry + rh / 2 - badgeH / 2, withLabel, 0);
          evaluate(dir, gx, ry, withLabel, 10);
          evaluate(dir, gx, ry + rh - badgeH, withLabel, 20);
        }
      }
    }

    // Último recurso: badge sozinho deslizando ao longo das arestas do alvo
    if (!candidates.some(c => c.hard === 0)) {
      for (let k = 1; k <= 14; k++) {
        for (const sign of [1, -1]) {
          const d = sign * k * 16;
          evaluate('top', rx + d, ry - badgeH - gapToTarget, false, 400 + k * 5);
          evaluate('bottom', rx + d, ry + rh + gapToTarget, false, 400 + k * 5);
          evaluate('right', rx + rw + gapToTarget + 2, ry + d, false, 400 + k * 5);
          evaluate('left', rx - badgeW - gapToTarget - 2, ry + d, false, 400 + k * 5);
        }
      }
    }

    candidates.sort((a, b) => a.score - b.score);
    const best = candidates[0];
    placedAnnotations.push(best.badgeBox);
    if (best.labelBox) placedAnnotations.push(best.labelBox);

    const occlusionArea =
      sumOverlap(best.badgeBox, cores) + (best.labelBox ? sumOverlap(best.labelBox, cores) : 0);
    layouts.push({
      index: p.input.index,
      label: best.labelBox ? p.label : undefined,
      targetBox: p.targetBox,
      coreBox: p.coreBox,
      badgeBox: best.badgeBox,
      labelBox: best.labelBox,
      placement: best.dir,
      occlusionArea
    });
  }

  // Interseção entre anotações de alvos diferentes (e entre badge e rótulo do mesmo alvo)
  const allAnnotations = layouts.flatMap(l => (l.labelBox ? [l.badgeBox, l.labelBox] : [l.badgeBox]));
  let crossAnnotationOverlap = 0;
  for (let i = 0; i < allAnnotations.length; i++) {
    for (let k = i + 1; k < allAnnotations.length; k++) {
      crossAnnotationOverlap += calculateRectIntersection(allAnnotations[i], allAnnotations[k]);
    }
  }

  const first = layouts[0];
  return {
    targetBox: first.targetBox,
    badgeBox: first.badgeBox,
    labelBox: first.labelBox,
    placement: first.placement,
    scaleX,
    scaleY,
    selfOcclusionArea: layouts.reduce((acc, l) => acc + l.occlusionArea, 0),
    callouts: layouts,
    crossAnnotationOverlap
  };
}

export interface DOMIntrospectionOptions {
  scrollIntoView?: boolean;
  stabilizeFrames?: number;
  /**
   * Filtro de Zona Semântica (ADR-015). `content` exclui toda zona de navegação
   * (`NAV_ZONE_SELECTOR`) e restringe a busca ao contêiner principal de conteúdo. Default: `any`.
   */
  zone?: SemanticZone;
  /**
   * União Geométrica de Múltiplos Alvos (ADR-015): cada entrada (seletor CSS ou texto visível) é
   * resolvida ao vivo e a caixa final é a união exata (minX, minY, maxX, maxY) dos `DOMRect`s.
   * Se nenhum membro for localizado, o script recai na lista `targets` (alvo único).
   */
  groupTargets?: string[];
  /**
   * Membro do grupo que recebe o carimbo de clique (ADR-017). `first-clickable` (padrão): primeiro
   * membro nativamente clicável. `last`: o último membro resolvido — usado no caminho de menu, em
   * que a ação que avança o fluxo é o clique na folha, não no menu de topo.
   */
  actionMember?: 'first-clickable' | 'last';
  /** Zoom CSS ativo no documento (ex.: 0.8 para 80%) */
  zoom?: number;
  /**
   * ADR-035: o passo pede um controle interativo (digitação/filtro/seleção/formulário). A busca textual exclui
   * cabeçalhos de coluna (`th`, `[role="columnheader"]`, `thead`), rebaixa títulos `h1`-`h4` a último recurso e
   * expande um `label` único ao seu bloco de campo (rótulo + controle).
   */
  fieldIntent?: boolean;
  /** ADR-035: o passo cita a busca global (`CTRL + B`); só então ela pode ser candidata. Padrão: `false`. */
  allowGlobalSearch?: boolean;
  /** ADR-035: permite que o valor de uma lista suspensa (`option:`) eleja o `<select>` dono. Padrão: `true`. */
  allowOptionTier?: boolean;
}

/**
 * Gera o script JavaScript injetável no navegador (via Playwright / CDP) que:
 * 1. Resolve a Zona Semântica: com `zone: 'content'`, descobre ao vivo o contêiner principal de
 *    conteúdo (modal aberto > coluna irmã da navegação lateral > `main`/`#content` > `body`) e
 *    descarta qualquer candidato dentro de `aside`, `nav`, `.sidebar`, abas e menus laterais.
 * 2. Localiza o(s) elemento(s)-alvo no DOM (incluindo iframes do mesmo domínio).
 * 3. Com `groupTargets`, resolve cada parâmetro, expande-o ao seu bloco de campo (rótulo + controle)
 *    e calcula a união matemática exata dos `getBoundingClientRect()`.
 * 4. Executa `scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })` se estiver fora da tela
 *    e força reflow síncrono para estabilizar as coordenadas.
 * 5. Extrai as coordenadas em CSS pixels, as métricas do viewport (DPR, scroll, innerWidth/Height) e o contexto semântico.
 */
export function buildDOMIntrospectionScript(
  targets: string | string[],
  options: DOMIntrospectionOptions = {}
): string {
  const targetList = Array.isArray(targets) ? targets : [targets];
  const groupList = (options.groupTargets || []).filter(Boolean);
  const scrollIntoView = options.scrollIntoView ?? true;
  const zone: SemanticZone = options.zone ?? 'any';
  const actionMember = options.actionMember ?? 'first-clickable';
  const zoomFactor = options.zoom ?? 0.8;
  const fieldIntent = options.fieldIntent === true;
  const allowGlobalSearch = options.allowGlobalSearch === true;
  const allowOptionTier = options.allowOptionTier !== false;

  return `
    (() => {
      const targetZoom = ${JSON.stringify(zoomFactor)};
      const applyZoomToDoc = doc => {
        if (!doc) return;
        if (Number.isFinite(targetZoom) && targetZoom > 0 && Math.abs(targetZoom - 1) >= 0.001) {
          const zStr = String(targetZoom);
          if (doc.documentElement && doc.documentElement.style.zoom !== zStr) {
            doc.documentElement.style.zoom = zStr;
            void doc.documentElement.offsetHeight;
          }
          if (doc.head && !doc.getElementById('orion-audit-zoom')) {
            const st = doc.createElement('style');
            st.id = 'orion-audit-zoom';
            st.textContent = 'html { zoom: ' + zStr + ' !important; }';
            doc.head.appendChild(st);
          }
        }
      };
      applyZoomToDoc(document);

      const queries = ${JSON.stringify(targetList)};
      const groupQueries = ${JSON.stringify(groupList)};
      const zone = ${JSON.stringify(zone)};
      const shouldScroll = ${JSON.stringify(scrollIntoView)};
      const actionMember = ${JSON.stringify(actionMember)};
      const fieldIntent = ${JSON.stringify(fieldIntent)};
      const allowGlobalSearch = ${JSON.stringify(allowGlobalSearch)};
      const allowOptionTier = ${JSON.stringify(allowOptionTier)};
      const NAV_ZONE = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR + ", .modal-dialog")};
      const MAIN_SELECTORS = ['main', '[role="main"]', '#content', '#main', '.main-content', '.content-wrapper'];
      const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], li > a, label, span, th, td, h1, h2, h3, h4, [ng-click], [data-ng-click], [ng-model], [data-ng-model], [ui-sref], [formcontrolname]';
      const CONTROL_SEL = 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';
      const MAX_SHADOW_DEPTH = 6;
      const MAX_FRAME_DEPTH = 6;

      const vpW = window.innerWidth || document.documentElement.clientWidth || 1440;
      const vpH = window.innerHeight || document.documentElement.clientHeight || 900;

      // ---------------------------------------------------------------------
      // TRAVESSIA DEEP DOM (Open Shadow DOM + Iframes Recursivos — ADR-030)
      // ---------------------------------------------------------------------
      function composedParent(node) {
        if (!node) return null;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode ? node.getRootNode() : null;
        return root && root.host ? root.host : null;
      }

      function composedClosest(node, selector) {
        let cur = node;
        while (cur) {
          if (cur.nodeType === 1 && cur.matches && cur.matches(selector)) return cur;
          cur = composedParent(cur);
        }
        return null;
      }

      function composedContains(ancestor, descendant) {
        if (!ancestor || !descendant) return false;
        if (ancestor.contains && ancestor.contains(descendant)) return true;
        let cur = descendant;
        while (cur) {
          if (cur === ancestor) return true;
          cur = composedParent(cur);
        }
        return false;
      }

      function queryAllDeep(root, selector, depth) {
        const d = depth || 0;
        const out = [];
        const seen = new Set();
        if (!root || d > MAX_SHADOW_DEPTH) return out;
        const add = el => {
          if (el && !seen.has(el)) {
            seen.add(el);
            out.push(el);
          }
        };
        if (root.querySelectorAll) {
          try {
            const direct = root.querySelectorAll(selector);
            for (let i = 0; i < direct.length; i++) add(direct[i]);
          } catch (e) {}
        }
        if (d === 0 && root.shadowRoot) {
          const ownShadow = queryAllDeep(root.shadowRoot, selector, d + 1);
          for (let j = 0; j < ownShadow.length; j++) add(ownShadow[j]);
        }
        if (d < MAX_SHADOW_DEPTH && root.querySelectorAll) {
          try {
            const all = root.querySelectorAll('*');
            for (let i = 0; i < all.length; i++) {
              const host = all[i];
              if (host && host.shadowRoot) {
                const inner = queryAllDeep(host.shadowRoot, selector, d + 1);
                for (let j = 0; j < inner.length; j++) add(inner[j]);
              }
            }
          } catch (e) {}
        }
        return out;
      }

      // ---------------------------------------------------------------------
      // EXTRATOR DE BINDINGS ANGULAR / ANGULARJS (ADR-030)
      // ---------------------------------------------------------------------
      const ANGULAR_GENERIC = new Set([
        'vm', 'ctrl', '$ctrl', 'scope', '$scope', 'this',
        'model', 'entity', 'entidade', 'dados', 'form', 'filtro',
        'filtros', 'filter', 'item', 'dto', 'vo', 'obj', 'data', 'row', 'registro'
      ]);

      function humanizeAngular(raw, kind) {
        let text = String(raw == null ? '' : raw).trim();
        if (!text) return '';
        if (kind === 'model') {
          text = text.split(/[|?:=&!<>+\\-*/;]/)[0].trim();
        } else {
          const parts = text.split(';').map(s => s.trim()).filter(Boolean);
          const callPart = parts.find(p => /\\(/.test(p)) || parts[0] || '';
          text = callPart.replace(/\\([^)]*\\)/g, '').split(/[=&!<>+\\-*/]/)[0].trim();
        }
        text = text.replace(/\\[[^\\]]*\\]/g, '').replace(/[^A-Za-z0-9_$.]/g, '').trim();
        if (!text) return '';
        const segs = text.split('.').map(s => s.trim()).filter(Boolean);
        while (segs.length > 1 && ANGULAR_GENERIC.has(segs[0].toLowerCase())) {
          segs.shift();
        }
        const target = segs[segs.length - 1] || '';
        if (!target) return '';
        return target
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
          .replace(/[_$-]+/g, ' ')
          .replace(/\\s+/g, ' ')
          .trim()
          .toLowerCase();
      }

      function extractAngularBindings(el) {
        if (!el || !el.getAttribute) return null;
        const g = a => {
          const v = el.getAttribute(a);
          return v ? String(v).trim() : '';
        };
        const ngModel = g('ng-model') || g('data-ng-model') || g('formcontrolname') || g('ng-reflect-name');
        const ngClick = g('ng-click') || g('data-ng-click');
        const uiSref = g('ui-sref') || g('routerlink') || g('ng-href');
        const ngDisabled = g('ng-disabled');
        const ngIf = g('ng-if') || g('ng-show') || g('ng-hide');
        if (!ngModel && !ngClick && !uiSref && !ngDisabled && !ngIf) return null;
        const out = {};
        if (ngModel) {
          out.ngModel = ngModel;
          const hm = humanizeAngular(ngModel, 'model');
          if (hm) out.humanizedModel = hm;
        }
        if (ngClick) {
          out.ngClick = ngClick;
          const ha = humanizeAngular(ngClick, 'action');
          if (ha) out.humanizedAction = ha;
        }
        if (uiSref) out.uiSref = uiSref;
        if (ngDisabled) out.ngDisabled = ngDisabled;
        if (ngIf) out.ngIf = ngIf;
        return out;
      }

      function isNgDisabled(el) {
        if (!el) return false;
        if (el.disabled) return true;
        if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') return true;
        const ngDis = el.getAttribute && el.getAttribute('ng-disabled');
        if (ngDis && /^(true|1)$/i.test(ngDis.trim())) return true;
        return !!composedClosest(el, 'fieldset[disabled]');
      }

      function normCompare(s) {
        return String(s == null ? '' : s)
          .normalize('NFD')
          .replace(/[\\u0300-\\u036f]/g, '')
          .replace(/[^\\w\\s+]/g, ' ')
          .replace(/\\s+/g, ' ')
          .trim()
          .toLowerCase();
      }

      function isVisible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        if (composedClosest(el, '.ng-hide')) return false;
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const style = win.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) {
          return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      }

      function describe(el) {
        if (!el || !el.tagName) return '';
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\\s+/).filter(Boolean).slice(0, 3) : [];
        return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls.length ? '.' + cls.join('.') : '');
      }

      function readEffectiveDocZoom(doc) {
        try {
          const win = doc && doc.defaultView;
          const de = doc && doc.documentElement;
          if (!de) return 1;
          const cs = win && win.getComputedStyle ? win.getComputedStyle(de) : null;
          const z = parseFloat((cs && cs.zoom) || (de.style && de.style.zoom) || '1');
          return Number.isFinite(z) && z > 0 ? z : 1;
        } catch (e) {
          return 1;
        }
      }

      function computeChainOffsetAndClip(frameChain, fallbackZoom) {
        let x = 0;
        let y = 0;
        let scale = 1;
        let clip = { x: 0, y: 0, width: vpW, height: vpH };
        const chain = frameChain || [];
        for (let i = 0; i < chain.length; i++) {
          const frame = chain[i];
          const hostDoc = frame.ownerDocument || document;
          const hostWin = hostDoc.defaultView || window;
          const fr = frame.getBoundingClientRect();
          const cs = hostWin && hostWin.getComputedStyle ? hostWin.getComputedStyle(frame) : null;

          let hostScale = 1;
          if (frame.offsetWidth > 0 && fr.width > 0) {
            hostScale = fr.width / frame.offsetWidth;
          } else {
            hostScale = readEffectiveDocZoom(hostDoc);
            if (hostScale === 1 && i === 0 && Number.isFinite(fallbackZoom) && fallbackZoom > 0) {
              hostScale = fallbackZoom;
            }
          }
          const stepScale = scale * hostScale;

          const borderL = frame.clientLeft || (cs ? parseFloat(cs.borderLeftWidth) || 0 : 0);
          const borderT = frame.clientTop || (cs ? parseFloat(cs.borderTopWidth) || 0 : 0);
          const padL = cs ? parseFloat(cs.paddingLeft) || 0 : 0;
          const padT = cs ? parseFloat(cs.paddingTop) || 0 : 0;
          const borderR = cs ? parseFloat(cs.borderRightWidth) || borderL : borderL;
          const borderB = cs ? parseFloat(cs.borderBottomWidth) || borderT : borderT;
          const padR = cs ? parseFloat(cs.paddingRight) || 0 : 0;
          const padB = cs ? parseFloat(cs.paddingBottom) || 0 : 0;

          const frameLeft = x + fr.left * scale;
          const frameTop = y + fr.top * scale;
          const contentLeft = frameLeft + (borderL + padL) * stepScale;
          const contentTop = frameTop + (borderT + padT) * stepScale;

          const contentW = frame.clientWidth > 0
            ? Math.max(0, (frame.clientWidth - padL - padR) * stepScale)
            : Math.max(0, fr.width * scale - (borderL + borderR + padL + padR) * stepScale);
          const contentH = frame.clientHeight > 0
            ? Math.max(0, (frame.clientHeight - padT - padB) * stepScale)
            : Math.max(0, fr.height * scale - (borderT + borderB + padT + padB) * stepScale);

          const cx1 = Math.max(clip.x, Math.round(contentLeft));
          const cy1 = Math.max(clip.y, Math.round(contentTop));
          const cx2 = Math.min(clip.x + clip.width, Math.round(contentLeft + contentW));
          const cy2 = Math.min(clip.y + clip.height, Math.round(contentTop + contentH));
          clip = {
            x: cx1,
            y: cy1,
            width: Math.max(0, cx2 - cx1),
            height: Math.max(0, cy2 - cy1)
          };

          x = contentLeft;
          y = contentTop;
          scale = stepScale;
        }
        return { x: Math.round(x), y: Math.round(y), rawX: x, rawY: y, scale, clip };
      }

      // Caixa inteira por arredondamento das 4 arestas (garante união exata e reproduzível no lado Node)
      function edgeBox(el, off) {
        const r = el.getBoundingClientRect();
        const s = (off && off.scale) ? off.scale : 1;
        const ox = off && off.rawX != null ? off.rawX : (off ? off.x : 0);
        const oy = off && off.rawY != null ? off.rawY : (off ? off.y : 0);
        const x1 = Math.round(r.left * s + ox);
        const y1 = Math.round(r.top * s + oy);
        const x2 = Math.round(r.right * s + ox);
        const y2 = Math.round(r.bottom * s + oy);
        return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
      }

      function unionOf(boxes) {
        if (!boxes.length) return null;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const b of boxes) {
          minX = Math.min(minX, b.x);
          minY = Math.min(minY, b.y);
          maxX = Math.max(maxX, b.x + b.width);
          maxY = Math.max(maxY, b.y + b.height);
        }
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }

      function clipToViewport(b, clipBox) {
        const minX = clipBox ? Math.max(0, clipBox.x) : 0;
        const minY = clipBox ? Math.max(0, clipBox.y) : 0;
        const maxX = clipBox ? Math.min(vpW, clipBox.x + clipBox.width) : vpW;
        const maxY = clipBox ? Math.min(vpH, clipBox.y + clipBox.height) : vpH;
        const x1 = Math.max(minX, b.x);
        const y1 = Math.max(minY, b.y);
        const x2 = Math.min(maxX, b.x + b.width);
        const y2 = Math.min(maxY, b.y + b.height);
        if (x2 - x1 <= 0 || y2 - y1 <= 0) return null;
        return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
      }

      function isOutsideViewport(b, clipBox) {
        const minX = clipBox ? Math.max(0, clipBox.x) : 0;
        const minY = clipBox ? Math.max(0, clipBox.y) : 0;
        const maxX = clipBox ? Math.min(vpW, clipBox.x + clipBox.width) : vpW;
        const maxY = clipBox ? Math.min(vpH, clipBox.y + clipBox.height) : vpH;
        return b.y < minY || b.y + b.height > maxY || b.x < minX || b.x + b.width > maxX;
      }

      // ---------------------------------------------------------------------
      // FILTRO DE ZONA SEMÂNTICA (ADR-015)
      // ---------------------------------------------------------------------

      // Navegação lateral: zona de navegação vertical encostada numa das bordas do viewport
      function isLateralNav(el) {
        const r = el.getBoundingClientRect();
        if (r.height < 120 || r.height < r.width * 1.2) return false;
        if (r.width > vpW * 0.35) return false;
        return r.left <= vpW * 0.3 || r.right >= vpW * 0.7;
      }

      // ---------------------------------------------------------------------
      // ESCOPO DE MODAL ATIVO + CHECAGEM DE OCLUSÃO (elementFromPoint)
      // ---------------------------------------------------------------------
      function topModalOf(doc) {
        const modals = queryAllDeep(doc, MODAL_SEL).filter(isVisible);
        return modals.length > 0 ? modals[modals.length - 1] : null;
      }

      function deepElementFromPoint(root, cx, cy, depth) {
        const d = depth || 0;
        if (!root || !root.elementFromPoint || d > MAX_SHADOW_DEPTH) return null;
        const hit = root.elementFromPoint(cx, cy);
        if (!hit) return null;
        if (hit.shadowRoot) {
          const inner = deepElementFromPoint(hit.shadowRoot, cx, cy, d + 1);
          if (inner) return inner;
        }
        return hit;
      }

      function isBehindModal(el, doc) {
        const modal = topModalOf(doc);
        if (!modal || composedContains(modal, el)) return false;
        const r = el.getBoundingClientRect();
        const docVpW = (doc.defaultView && doc.defaultView.innerWidth) || vpW;
        const docVpH = (doc.defaultView && doc.defaultView.innerHeight) || vpH;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cx < 0 || cy < 0 || cx > docVpW || cy > docVpH) return false;
        const top = deepElementFromPoint(doc, cx, cy, 0);
        if (!top || top === el || composedContains(el, top)) return false;
        return (
          composedContains(modal, top) ||
          (top.matches && top.matches('.modal, .modal-backdrop, .orion-lightweight-modal, .orion-lightweight-in, [role="dialog"], [aria-modal="true"]')) ||
          !!composedClosest(top, '.modal, .orion-lightweight-modal')
        );
      }

      function resolveContentRoot(doc) {
        // 1. Um modal aberto é o contêiner de conteúdo vigente
        const modals = queryAllDeep(doc, MODAL_SEL).filter(isVisible);
        if (modals.length > 0) {
          return { el: modals[modals.length - 1], strategy: 'modal-aberto', navs: [] };
        }

        // 2. Coluna irmã da navegação lateral (atravessa também Shadow DOM via composedParent)
        const laterals = queryAllDeep(doc, NAV_ZONE).filter(isVisible).filter(isLateralNav);
        for (const nav of laterals) {
          let cur = nav;
          while (cur && cur !== doc.body && cur !== doc.documentElement) {
            const p = composedParent(cur);
            if (!p) break;
            const cr = cur.getBoundingClientRect();
            const beside = Array.from(p.children || []).filter(s => {
              if (s === cur || !isVisible(s) || (s.matches && s.matches(NAV_ZONE))) return false;
              const sr = s.getBoundingClientRect();
              const disjointX = sr.left >= cr.right - 1 || sr.right <= cr.left + 1;
              const overlapY = Math.min(sr.bottom, cr.bottom) - Math.max(sr.top, cr.top);
              return disjointX && overlapY > 0 && sr.width > cr.width;
            });
            if (beside.length > 0) {
              beside.sort((a, b) => {
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                return (rb.width * rb.height) - (ra.width * ra.height);
              });
              return { el: beside[0], strategy: 'coluna-irma-da-navegacao-lateral', navs: laterals };
            }
            cur = p;
          }
        }

        // 3. Contêiner principal semântico da página
        for (const sel of MAIN_SELECTORS) {
          const main = queryAllDeep(doc, sel).find(e => isVisible(e) && !composedClosest(e, NAV_ZONE));
          if (main) return { el: main, strategy: 'container-principal:' + sel, navs: laterals };
        }
        return { el: doc.body, strategy: 'document-body', navs: laterals };
      }

      function inZone(el, zs) {
        if (zone !== 'content') return true;
        if (composedClosest(el, NAV_ZONE)) return false;
        if (!composedContains(zs.el, el)) return false;
        return !zs.navs.some(n => composedContains(el, n));
      }

      // ---------------------------------------------------------------------
      // RESOLUÇÃO DE CANDIDATOS (seletor CSS direto -> texto exato -> texto parcial -> bindings Angular)
      // ---------------------------------------------------------------------
      const isNativeControl = el => /^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL)$/.test(el.tagName || '');

      // ADR-035: cabeçalho de coluna da grade (th / columnheader / qualquer nó dentro de thead)
      const isColumnHeaderEl = el => !!composedClosest(el, 'th, [role="columnheader"], thead');
      // ADR-035: título estático h1-h4 (um controle nativo dentro do título, como o gatilho de acordeão, não conta)
      const isHeadingEl = el => !isNativeControl(el) && !!composedClosest(el, 'h1, h2, h3, h4');
      // ADR-035: busca global de telas (CTRL + B) ou qualquer campo de texto da barra superior
      function isGlobalSearchEl(el) {
        if (!el || !el.tagName || !el.getAttribute) return false;
        const tag = el.tagName.toLowerCase();
        const idName = (el.id || '') + ' ' + (el.getAttribute('name') || '');
        const hint = [el.getAttribute('placeholder'), el.getAttribute('title'), el.getAttribute('aria-label'), el.getAttribute('data-original-title')]
          .filter(Boolean)
          .join(' ');
        if (/ctrl\\s*\\+\\s*b|pesquise aqui|nome da tela que deseja/i.test(hint)) return true;
        if (/search.?menu|input.?search|busca.?menu|pesquisa.?menu|menu.?search/i.test(idName)) return true;
        return (tag === 'input' || tag === 'textarea') && !!composedClosest(el, 'header, nav, .navbar, #navbar');
      }

      const sortByBindingAffinity = (list, cleanText) => {
        if (list.length <= 1) return list;
        const normQ = normCompare(cleanText);
        const rank = el => {
          let s = 0;
          if (!isNgDisabled(el)) s += 100;
          if (isNativeControl(el)) s += 20;
          const b = extractAngularBindings(el);
          if (b) {
            const cues = [b.humanizedModel, b.humanizedAction, b.uiSref ? normCompare(b.uiSref) : ''].filter(Boolean);
            if (cues.some(c => c === normQ)) s += 15;
            else if (normQ.length >= 3 && cues.some(c => (' ' + c + ' ').includes(' ' + normQ + ' '))) s += 8;
          }
          return s;
        };
        return list.slice().sort((a, b) => rank(b) - rank(a));
      };

      function findCandidates(doc, rawQuery, zs) {
        if (!rawQuery) return null;
        const scope = zone === 'content' ? zs.el : doc;

        // 1. Tentativa como seletor CSS direto (incluindo Open Shadow DOM dentro da zona)
        if (!rawQuery.includes(':has-text(')) {
          try {
            const candidates = queryAllDeep(scope, rawQuery).filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc));
            if (zone === 'content' && scope.matches && scope.matches(rawQuery) && isVisible(scope) && inZone(scope, zs)) {
              candidates.unshift(scope);
            }
            if (candidates.length > 0) {
              return { els: sortByBindingAffinity(candidates, rawQuery), matchedSelector: rawQuery };
            }
          } catch (e) {}
        }

        // 2. Busca semântica por texto visível ou atributo de rótulo
        const cleanText = rawQuery
          .replace(/^.*:has-text\\(['"]([^'"]+)['"]\\).*$/, '$1')
          .replace(/\\*\\*/g, '')
          // ADR-035: o manual cita rótulos entre aspas (**"Sem valor fixo"**, **"Valor"**); o texto da tela nunca as tem
          .replace(/^[\\s"'“”‘’«»]+|[\\s"'“”‘’«»]+$/g, '')
          .trim()
          .toLowerCase();

        if (!cleanText) return null;

        let nodes = queryAllDeep(scope, INTERACTIVE).filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc));
        // ADR-035: a busca global nunca é candidata a campo de tela, salvo quando o passo a cita
        if (!allowGlobalSearch) nodes = nodes.filter(n => !isGlobalSearchEl(n));
        // ADR-035: passo de digitação/filtro/formulário exige controle interativo — cabeçalho de coluna fica fora
        // e título h1-h4 só vale como último recurso (depois de rótulos, campos e valores de lista)
        let headingNodes = [];
        if (fieldIntent) {
          nodes = nodes.filter(n => !isColumnHeaderEl(n));
          headingNodes = nodes.filter(isHeadingEl);
          nodes = nodes.filter(n => !isHeadingEl(n));
        }
        const textOf = n => (n.innerText || n.textContent || '').trim().toLowerCase();
        const valOf = n => (n.getAttribute('value') || n.getAttribute('placeholder') || n.getAttribute('title') || '').trim().toLowerCase();

        // 2a. Match exato de texto ou placeholder/value
        const exact = nodes.filter(n => textOf(n) === cleanText || valOf(n) === cleanText);
        if (exact.length > 0) {
          return { els: sortByBindingAffinity(exact, cleanText), matchedSelector: 'text:' + cleanText };
        }

        // 2b. Match parcial priorizando o elemento mais específico (menor área que contém o texto)
        const partialMatches = nodes.filter(n => {
          const txt = textOf(n);
          const val = valOf(n);
          return (txt && txt.includes(cleanText)) || (val && val.includes(cleanText));
        });
        if (partialMatches.length > 0) {
          partialMatches.sort((a, b) => {
            const disDiff = (isNgDisabled(a) ? 1 : 0) - (isNgDisabled(b) ? 1 : 0);
            if (disDiff !== 0) return disDiff;
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return (ra.width * ra.height) - (rb.width * rb.height);
          });
          return { els: [partialMatches[0]], matchedSelector: 'text:' + cleanText };
        }

        // 2c. Valor de uma lista suspensa (ADR-018). ADR-035: desligado em passo de clique puro (R-10.0: "clique em
        //     Sim" numa confirmação nunca é o <select> que tem a opção "Sim")
        const selects = allowOptionTier
          ? queryAllDeep(scope, 'select').filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc))
          : [];
        const owning = selects.filter(sel =>
          Array.from(sel.options).some(o => (o.textContent || '').trim().toLowerCase() === cleanText)
        );
        if (owning.length > 0) {
          return { els: owning, matchedSelector: 'option:' + cleanText };
        }

        // 2d. Fallback determinístico por bindings Angular (botão icônico sem texto visível ou input sem <label>)
        const normQ = normCompare(cleanText);
        if (normQ.length >= 3) {
          const ngMatches = [];
          for (const n of nodes) {
            const b = extractAngularBindings(n);
            if (!b) continue;
            const txt = textOf(n);
            const val = valOf(n);
            const isFormControl = /^(INPUT|SELECT|TEXTAREA)$/.test(n.tagName || '');
            const isIconicOrUnlabeled = isFormControl ? !val : txt.length <= 2 && !val;
            if (!isIconicOrUnlabeled) continue;
            const cues = [
              b.humanizedModel ? { kind: 'ng-model', raw: b.ngModel, text: normCompare(b.humanizedModel) } : null,
              b.humanizedAction ? { kind: 'ng-click', raw: b.ngClick, text: normCompare(b.humanizedAction) } : null,
              b.uiSref ? { kind: 'ui-sref', raw: b.uiSref, text: normCompare(b.uiSref) } : null
            ].filter(Boolean);
            const hit = cues.find(c =>
              c.text === normQ ||
              (' ' + c.text + ' ').includes(' ' + normQ + ' ') ||
              (c.text.length >= 4 && (' ' + normQ + ' ').includes(' ' + c.text + ' '))
            );
            if (hit) {
              ngMatches.push({ el: n, selector: hit.kind + ':' + hit.raw, exact: hit.text === normQ });
            }
          }
          if (ngMatches.length > 0) {
            ngMatches.sort((a, b) => {
              const ex = (b.exact ? 1 : 0) - (a.exact ? 1 : 0);
              if (ex !== 0) return ex;
              return (isNgDisabled(a.el) ? 1 : 0) - (isNgDisabled(b.el) ? 1 : 0);
            });
            return { els: ngMatches.map(m => m.el), matchedSelector: ngMatches[0].selector };
          }
        }

        // 2e. ADR-035: último recurso em passo de campo — título estático h1-h4 de texto idêntico
        if (headingNodes.length > 0) {
          const exactHeading = headingNodes.filter(n => textOf(n) === cleanText || valOf(n) === cleanText);
          if (exactHeading.length > 0) {
            return { els: sortByBindingAffinity(exactHeading, cleanText), matchedSelector: 'text:' + cleanText };
          }
        }
        return null;
      }

      // ---------------------------------------------------------------------
      // UNIÃO GEOMÉTRICA DE MÚLTIPLOS ALVOS (ADR-015)
      // ---------------------------------------------------------------------
      function centerOf(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }

      function resolveGroup(doc, zs) {
        const resolved = [];
        const unresolved = [];
        for (const q of groupQueries) {
          const c = findCandidates(doc, q, zs);
          if (!c) {
            unresolved.push(q);
            continue;
          }
          const outermost = c.els.filter(e => !c.els.some(o => o !== e && composedContains(o, e)));
          resolved.push({ query: q, els: outermost, matchedSelector: c.matchedSelector });
        }
        if (resolved.length === 0) return null;

        let anchors = resolved.filter(r => r.els.length === 1).map(r => r.els[0]);
        if (anchors.length === 0) anchors = [resolved[0].els[0]];
        const centers = anchors.map(centerOf);
        const centroid = {
          x: centers.reduce((s, c) => s + c.x, 0) / centers.length,
          y: centers.reduce((s, c) => s + c.y, 0) / centers.length
        };

        const members = resolved.map(r => {
          let best = r.els[0];
          let bestDist = Infinity;
          for (const e of r.els) {
            const c = centerOf(e);
            const d = Math.hypot(c.x - centroid.x, c.y - centroid.y);
            if (d < bestDist) {
              best = e;
              bestDist = d;
            }
          }
          return { query: r.query, el: best, matchedSelector: r.matchedSelector };
        });
        return { members, unresolved };
      }

      function fieldBlockElements(el, zs) {
        const out = [el];
        const tag = el.tagName;
        if (tag === 'LABEL') {
          let ctrl = el.control && isVisible(el.control) ? el.control : null;
          if (!ctrl) {
            const forId = el.getAttribute('for');
            const rootNode = el.getRootNode ? el.getRootNode() : el.ownerDocument;
            const byId = forId && rootNode && rootNode.getElementById
              ? rootNode.getElementById(forId)
              : (forId ? el.ownerDocument.getElementById(forId) : null);
            if (byId && isVisible(byId)) ctrl = byId;
          }
          if (ctrl) {
            out.push(ctrl);
            return out;
          }
          const p = composedParent(el);
          if (p && p !== zs.el && composedContains(zs.el, p)) {
            const kids = Array.from(p.children || []);
            const otherLabels = kids.filter(k => k !== el && k.tagName === 'LABEL');
            if (otherLabels.length === 0) {
              const sibs = kids.filter(k => k !== el && isVisible(k));
              if (sibs.length > 0 && sibs.length <= 6) {
                out.push(...sibs);
                return out;
              }
              const inner = queryAllDeep(p, CONTROL_SEL).filter(isVisible);
              if (inner.length > 0 && inner.length <= 6) out.push(...inner);
            }
          }
        } else if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
          const own = el.labels && el.labels.length ? Array.from(el.labels).find(isVisible) : null;
          if (own) {
            out.push(own);
          } else {
            const p = composedParent(el);
            if (p) {
              const pTag = p.tagName;
              if ((pTag === 'SPAN' || pTag === 'ORION-CHECKBOX') && isVisible(p)) {
                const checks = queryAllDeep(p, 'input[type="checkbox"], input[type="radio"]');
                if (checks.length === 1) out.push(p);
              } else {
                const lbls = Array.from(p.children || []).filter(k => k.tagName === 'LABEL' && isVisible(k));
                if (lbls.length === 1) out.push(lbls[0]);
              }
            }
          }
        } else if ((tag === 'SPAN' || tag === 'ORION-CHECKBOX') && isVisible(el)) {
          const checks = queryAllDeep(el, 'input[type="checkbox"], input[type="radio"]');
          if (checks.length === 1 && isVisible(checks[0])) out.push(checks[0]);
        }
        return out;
      }

      function measureGroup(group, zs, off) {
        const memberData = [];
        for (const m of group.members) {
          const boxes = fieldBlockElements(m.el, zs)
            .map(e => edgeBox(e, off))
            .filter(b => b.width > 0 && b.height > 0);
          const box = unionOf(boxes);
          if (box) memberData.push({ m, box });
        }
        return { memberData, union: unionOf(memberData.map(d => d.box)) };
      }

      function searchInDocument(doc, frameOffset, frameChain) {
        const zs = zone === 'content' ? resolveContentRoot(doc) : { el: doc.body, strategy: 'sem-filtro', navs: [] };

        if (groupQueries.length > 0) {
          const group = resolveGroup(doc, zs);
          if (group) return { group, zs, frameOffset, frameChain };
        }

        for (const rawQuery of queries) {
          const c = findCandidates(doc, rawQuery, zs);
          if (c) return { el: c.els[0], matchedSelector: c.matchedSelector, zs, frameOffset, frameChain };
        }
        return null;
      }

      function searchFramesRecursively(rootDoc, frameChain, depth) {
        if (!rootDoc || depth > MAX_FRAME_DEPTH) return null;
        const iframes = queryAllDeep(rootDoc, 'iframe');
        for (let i = 0; i < iframes.length; i++) {
          const frame = iframes[i];
          try {
            if (!isVisible(frame)) continue;
            const childDoc = frame.contentDocument;
            if (!childDoc || !childDoc.body) continue;
            const nextChain = frameChain.concat([frame]);
            const offset = computeChainOffsetAndClip(nextChain, targetZoom);
            if (offset.clip && (offset.clip.width <= 1 || offset.clip.height <= 1)) continue;
            const hit = searchInDocument(childDoc, offset, nextChain);
            if (hit) return hit;
            const nested = searchFramesRecursively(childDoc, nextChain, depth + 1);
            if (nested) return nested;
          } catch (e) {}
        }
        return null;
      }

      // Busca no documento principal; se ausente, desce recursivamente por iframes same-origin (inclusive em Shadow DOM)
      let match = searchInDocument(document, computeChainOffsetAndClip([], targetZoom), []);
      if (!match) {
        match = searchFramesRecursively(document, [], 1);
      }

      if (!match) return null;

      const frameChain = match.frameChain || [];
      let frameOffset = match.frameOffset || computeChainOffsetAndClip(frameChain, targetZoom);
      const zs = match.zs;
      let ctxEl = null;
      let rawBox = null;
      let matchedSelector = '';
      let innerText = '';
      let tagName = '';
      let groupMembers;
      let groupUnionBox;
      let unresolvedGroupTargets;
      const neighborBoxes = [];

      if (match.group) {
        // ------------------- Modo Grupo: união exata dos DOMRects -------------------
        let meas = measureGroup(match.group, zs, frameOffset);
        if (!meas.union) return null;

        if (shouldScroll && isOutsideViewport(meas.union, frameOffset.clip)) {
          const ucx = meas.union.x + meas.union.width / 2;
          const ucy = meas.union.y + meas.union.height / 2;
          let pivot = meas.memberData[0];
          let pivotDist = Infinity;
          for (const d of meas.memberData) {
            const dist = Math.hypot(d.box.x + d.box.width / 2 - ucx, d.box.y + d.box.height / 2 - ucy);
            if (dist < pivotDist) {
              pivot = d;
              pivotDist = dist;
            }
          }
          try {
            pivot.m.el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
          } catch (e) {
            pivot.m.el.scrollIntoView(true);
          }
          void pivot.m.el.offsetHeight;
          // Recalcula a cadeia de iframes pós-scroll para compensar deslocamento dos frames hospedeiros
          frameOffset = computeChainOffsetAndClip(frameChain, targetZoom);
          meas = measureGroup(match.group, zs, frameOffset);
          if (!meas.union) return null;
        }

        ctxEl = meas.memberData[0].m.el;
        rawBox = meas.union;
        groupUnionBox = meas.union;
        groupMembers = meas.memberData.map(d => ({
          query: d.m.query,
          matchedSelector: d.m.matchedSelector,
          innerText: (d.m.el.innerText || d.m.el.textContent || d.m.el.getAttribute('placeholder') || '').trim().slice(0, 80),
          cssBox: d.box,
          tagName: isColumnHeaderEl(d.m.el) ? 'th' : (d.m.el.tagName || '').toLowerCase()
        }));
        unresolvedGroupTargets = match.group.unresolved;
        matchedSelector = 'group:' + groupMembers.map(g => g.matchedSelector).join(' + ');
        innerText = groupMembers.map(g => g.innerText || g.query).join(' + ').slice(0, 80);
        tagName = 'group';
      } else {
        // ------------------- Modo Alvo Único -------------------
        const el = match.el;
        if (!el) return null;

        const initBox = edgeBox(el, frameOffset);
        const visClip = frameOffset.clip || { x: 0, y: 0, width: vpW, height: vpH };
        const partlyOut =
          initBox.y < visClip.y ||
          initBox.y + initBox.height > visClip.y + visClip.height ||
          initBox.x < visClip.x ||
          initBox.x + initBox.width > visClip.x + visClip.width;
        const fitsViewport = initBox.width <= visClip.width && initBox.height <= visClip.height;
        const intersectsViewport =
          initBox.y + initBox.height > visClip.y &&
          initBox.y < visClip.y + visClip.height &&
          initBox.x + initBox.width > visClip.x &&
          initBox.x < visClip.x + visClip.width;

        if (shouldScroll && partlyOut && (fitsViewport || !intersectsViewport)) {
          try {
            el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
          } catch (e) {
            el.scrollIntoView(true);
          }
          void el.offsetHeight;
          // Se o próprio iframe hospedeiro ainda estiver fora do viewport principal, traz o iframe para a área visível
          if (frameChain.length > 0) {
            for (let fi = 0; fi < frameChain.length; fi++) {
              const frBox = frameChain[fi].getBoundingClientRect();
              if (frBox.bottom <= 0 || frBox.top >= vpH || frBox.right <= 0 || frBox.left >= vpW) {
                try {
                  frameChain[fi].scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
                } catch (e) {}
                void frameChain[fi].offsetHeight;
              }
            }
          }
        }

        // Recalcula o offset/clipping acumulado da cadeia de iframes APÓS o scroll e reflow
        void el.offsetHeight;
        frameOffset = computeChainOffsetAndClip(frameChain, targetZoom);
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;

        const s = frameOffset.scale || 1;
        const ox = frameOffset.rawX != null ? frameOffset.rawX : frameOffset.x;
        const oy = frameOffset.rawY != null ? frameOffset.rawY : frameOffset.y;
        rawBox = {
          x: Math.round(rect.left * s + ox),
          y: Math.round(rect.top * s + oy),
          width: Math.round(rect.width * s),
          height: Math.round(rect.height * s)
        };

        // ADR-035: passo de campo com alvo único que casou um <label> -> a moldura é o bloco de campo (rótulo +
        // controle), como na união de grupo (R-18.0: só o texto "Valor" era demarcado, sem a caixa de digitação)
        if (fieldIntent && el.tagName === 'LABEL') {
          const blockEls = fieldBlockElements(el, zs);
          if (blockEls.length > 1) {
            const blockBox = unionOf(blockEls.map(e => edgeBox(e, frameOffset)).filter(b => b.width > 0 && b.height > 0));
            if (blockBox) rawBox = blockBox;
          }
        }

        for (const sib of [el.previousElementSibling, el.nextElementSibling]) {
          if (sib && isVisible(sib)) {
            const sr = sib.getBoundingClientRect();
            neighborBoxes.push({
              x: Math.round(sr.left * s + ox),
              y: Math.round(sr.top * s + oy),
              width: Math.round(sr.width * s),
              height: Math.round(sr.height * s)
            });
          }
        }

        ctxEl = el;
        matchedSelector = match.matchedSelector;
        innerText = (el.innerText || el.textContent || '').trim().slice(0, 80);
        tagName = (el.tagName || '').toLowerCase();
      }

      // Recorte à porção visível do viewport e dos iframes hospedeiros
      const cssBox = clipToViewport(rawBox, frameOffset.clip);
      if (!cssBox) return null;

      // ---------------------------------------------------------------------
      // ALVO DA AÇÃO PÓS-CAPTURA (ADR-015 §2.4 + ADR-030 iframes same-origin / Shadow DOM)
      // ---------------------------------------------------------------------
      function controlOf(el) {
        if (el.matches && el.matches(CONTROL_SEL)) return el;
        if (el.tagName === 'LABEL') {
          if (el.control && isVisible(el.control)) return el.control;
          const forId = el.getAttribute('for');
          const rootNode = el.getRootNode ? el.getRootNode() : el.ownerDocument;
          const byId = forId && rootNode && rootNode.getElementById
            ? rootNode.getElementById(forId)
            : (forId ? el.ownerDocument.getElementById(forId) : null);
          if (byId && isVisible(byId)) return byId;
        }
        const inner = queryAllDeep(el, CONTROL_SEL).find(isVisible);
        if (inner) return inner;
        for (const b of fieldBlockElements(el, zs)) {
          if (b === el) continue;
          if (b.matches && b.matches(CONTROL_SEL)) return b;
          const c = queryAllDeep(b, CONTROL_SEL).find(isVisible);
          if (c) return c;
        }
        return null;
      }

      let actionTarget;
      try {
        for (const prev of window.__orionAuditStamps || []) {
          try { prev[0].removeAttribute(prev[1]); } catch (e) {}
        }
        window.__orionAuditStamps = [];

        const memberEls = match.group ? match.group.members.map(m => m.el) : [ctxEl];
        const CLICKABLE = 'a, button, [role="button"], input[type="button"], input[type="submit"]';
        const clickEl = actionMember === 'last'
          ? memberEls[memberEls.length - 1]
          : memberEls.find(e => composedClosest(e, CLICKABLE)) || memberEls[0];
        // ADR-035: o preenchimento recai no campo de entrada do grupo; caixa de marcação/opção só como último recurso
        // (preencher "Sem valor fixo" + "Valor" elegia a caixa de 10x11 e a digitação nunca chegava ao campo).
        let fillEl = null;
        let fallbackFillEl = null;
        for (const e of memberEls) {
          const candidate = controlOf(e);
          if (!candidate) continue;
          const isToggle = candidate.tagName === 'INPUT' && /^(checkbox|radio)$/i.test(candidate.getAttribute('type') || '');
          if (!isToggle) { fillEl = candidate; break; }
          if (!fallbackFillEl) fallbackFillEl = candidate;
        }
        if (!fillEl) fillEl = fallbackFillEl;

        if (clickEl) {
          const token = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
          const stamp = (el, kind) => {
            const attr = 'data-orion-audit-' + kind + '-' + token;
            el.setAttribute(attr, '');
            window.__orionAuditStamps.push([el, attr]);
            return '[' + attr + ']';
          };
          const info = el => ({
            tagName: (el.tagName || '').toLowerCase(),
            text: (el.innerText || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || '').trim().slice(0, 80),
            box: edgeBox(el, frameOffset),
            insideNavZone: !!composedClosest(el, NAV_ZONE)
          });
          actionTarget = { clickSelector: stamp(clickEl, 'click'), click: info(clickEl) };
          if (fillEl) {
            actionTarget.fillSelector = stamp(fillEl, 'fill');
            actionTarget.fill = info(fillEl);
          }
        }
      } catch (e) {
        actionTarget = undefined;
      }
      const clippedToViewport =
        cssBox.x !== rawBox.x || cssBox.y !== rawBox.y || cssBox.width !== rawBox.width || cssBox.height !== rawBox.height;

      const isGroup = !!match.group;
      const isTopNav = (!isGroup && !!composedClosest(ctxEl, 'nav, header, .navbar, #navbar')) || cssBox.y < 52;
      const isVerticalSidebar = isGroup
        ? false
        : !!composedClosest(ctxEl, 'aside, .sidebar, .nav-stacked, .list-group, .menu-lateral') ||
          (cssBox.x < 140 && cssBox.width < 240 && cssBox.y >= 60 && cssBox.height <= 48);
      const isDropdownItem = !isGroup && !!composedClosest(ctxEl, '.dropdown-menu, [role="menu"], [role="listbox"]');
      const isModal = !!composedClosest(ctxEl, '.modal, .modal-dialog, [role="dialog"]');

      // ADR-027 + ADR-030: Assinatura Semântica Hierárquica atravessando Open Shadow DOM + bindings Angular
      function extractSemanticSignature(el) {
        const cleanSem = s => String(s || '').replace(/\\s+/g, ' ').trim().slice(0, 120);
        let sectionTitle = '';
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const ownerBody = cur.ownerDocument ? cur.ownerDocument.body : document.body;
          const ownerDocEl = cur.ownerDocument ? cur.ownerDocument.documentElement : document.documentElement;
          if (cur === ownerBody || cur === ownerDocEl) break;
          if (cur.tagName === 'FIELDSET') {
            const leg = queryAllDeep(cur, 'legend').find(isVisible) || cur.querySelector('legend');
            if (leg && isVisible(leg)) { sectionTitle = cleanSem(leg.innerText || leg.textContent); break; }
          }
          if (cur.matches && cur.matches('.panel, .card, .box, .modal-content, .well, section, form')) {
            const hd =
              cur.querySelector(':scope > .panel-heading, :scope > .card-header, :scope > .box-header, :scope > .modal-header .modal-title, :scope > h3, :scope > h4, :scope > h5, :scope > legend') ||
              (cur.shadowRoot && cur.shadowRoot.querySelector('.panel-heading, .card-header, .box-header, .modal-header .modal-title, h3, h4, h5, legend'));
            if (hd && isVisible(hd)) { sectionTitle = cleanSem(hd.innerText || hd.textContent); break; }
          }
          const prev = cur.previousElementSibling;
          if (prev && /^H[2-5]$/.test(prev.tagName) && isVisible(prev)) {
            sectionTitle = cleanSem(prev.innerText || prev.textContent);
            break;
          }
          cur = composedParent(cur);
        }
        if (!sectionTitle) {
          const panel = composedClosest(el, '.panel, .card, .box, fieldset, .modal-content');
          if (panel) {
            const h = queryAllDeep(panel, 'legend, .panel-heading, .card-header, .box-header, .modal-title, h3, h4, h5').find(isVisible);
            if (h) sectionTitle = cleanSem(h.innerText || h.textContent);
          }
        }

        let rowContext;
        const tr = composedClosest(el, 'tr');
        if (tr && composedParent(tr)) {
          const pTr = composedParent(tr);
          const rows = Array.from(pTr.children || []).filter(r => r.tagName === 'TR');
          const rowIndex = Math.max(0, rows.indexOf(tr));
          const cells = Array.from(tr.querySelectorAll('td, th')).map(c => cleanSem(c.innerText || c.textContent)).filter(Boolean);
          if (cells.length > 0) {
            rowContext = { rowIndex, firstColText: cells[0], secondColText: cells[1] };
          }
        }

        const angularBindings = extractAngularBindings(el);

        let associatedLabel = '';
        const lbl = (el.labels && el.labels[0]) || composedClosest(el, 'label');
        if (lbl) associatedLabel = cleanSem(lbl.innerText || lbl.textContent);
        const parentEl = composedParent(el);
        if (!associatedLabel && parentEl) {
          const sibLbl = Array.from(parentEl.children || []).find(k => k !== el && (k.tagName === 'LABEL' || k.tagName === 'SPAN') && isVisible(k));
          if (sibLbl) associatedLabel = cleanSem(sibLbl.innerText || sibLbl.textContent);
        }
        if (!associatedLabel && el.getAttribute) {
          associatedLabel = cleanSem(
            el.getAttribute('title') ||
            el.getAttribute('data-original-title') ||
            el.getAttribute('placeholder') ||
            el.getAttribute('aria-label') ||
            el.getAttribute('ng-reflect-name') ||
            ''
          );
        }
        if (!associatedLabel && angularBindings) {
          associatedLabel = cleanSem(angularBindings.humanizedModel || angularBindings.humanizedAction || angularBindings.uiSref || '');
        }

        const txtNorm = cleanSem(
          el.innerText ||
          el.textContent ||
          associatedLabel ||
          (angularBindings && (angularBindings.humanizedAction || angularBindings.humanizedModel)) ||
          ''
        ).toLowerCase();
        let semanticRole = 'form_input';
        if (isColumnHeaderEl(el)) {
          semanticRole = 'table_column_header';
        } else if (isHeadingEl(el)) {
          semanticRole = 'page_heading';
        } else if (isTopNav) {
          semanticRole = isDropdownItem ? 'navigation_leaf' : 'navigation_root';
        } else if (/\\bnovo\\s+(cart[ãa]o|ficha|usu[áa]rio|protocolo|or[çc]amento)\\b/.test(txtNorm)) {
          semanticRole = 'entity_creation_button';
        } else if (/\\befetuar\\s+servi[çc]o\\b/.test(txtNorm) || /btnConcluirOutrosServicos/.test(el.id || '')) {
          semanticRole = 'service_execution_trigger';
        } else if (rowContext && (txtNorm === '+' || queryAllDeep(el, '.glyphicon-plus, .fa-plus').length > 0 || /selecion/i.test(el.id || ''))) {
          semanticRole = 'grid_row_picker';
        } else if (/^finalizar$/i.test(txtNorm)) {
          semanticRole = 'section_confirm_button';
        } else if (/^(filtrar|pesquisar|buscar)$/i.test(txtNorm) && (el.tagName === 'BUTTON' || (angularBindings && angularBindings.ngClick))) {
          semanticRole = 'search_trigger_button';
        } else if (/^(salvar|concluir|gravar|cadastrar|transmitir)$/i.test(txtNorm)) {
          semanticRole = 'form_submit';
        } else if (/^(limpar|cancelar|voltar|fechar)$/i.test(txtNorm)) {
          semanticRole = 'form_cancel';
        } else if ((el.tagName === 'INPUT' || el.tagName === 'SELECT') && (/busca|pesquisa|filtro/i.test(sectionTitle) || /ctrl\\s*\\+\\s*b/i.test(associatedLabel))) {
          semanticRole = 'search_filter_input';
        }

        const sig = { semanticRole };
        if (sectionTitle) sig.sectionTitle = sectionTitle;
        if (rowContext) sig.rowContext = rowContext;
        if (associatedLabel) sig.associatedLabel = associatedLabel;
        if (angularBindings) sig.angularBindings = angularBindings;
        return sig;
      }

      const payload = {
        cssBox,
        viewport: {
          width: vpW,
          height: vpH,
          devicePixelRatio: window.devicePixelRatio || 1,
          scrollX: Math.round(window.scrollX || window.pageXOffset || 0),
          scrollY: Math.round(window.scrollY || window.pageYOffset || 0)
        },
        context: {
          tagName,
          role: isGroup ? undefined : (ctxEl.getAttribute ? ctxEl.getAttribute('role') || undefined : undefined),
          innerText,
          isTopNav,
          isVerticalSidebar,
          isDropdownItem,
          isModal,
          iframeOffset: { x: frameOffset.x, y: frameOffset.y },
          neighborBoxes,
          semantic: extractSemanticSignature(ctxEl),
          placeholder: isGroup
            ? undefined
            : ((ctxEl.getAttribute && (ctxEl.getAttribute('placeholder') || ctxEl.getAttribute('title') || ctxEl.getAttribute('aria-label'))) || undefined),
          elementId: isGroup ? undefined : (ctxEl.id || undefined),
          isGlobalSearch: (isGroup ? match.group.members.map(m => m.el) : [ctxEl]).some(isGlobalSearchEl) || undefined,
          memberTags: isGroup ? groupMembers.map(g => g.tagName) : undefined
        },
        matchedSelector,
        url: window.location.href,
        capturedAt: new Date().toISOString(),
        zone,
        clippedToViewport
      };

      if (zone === 'content') {
        payload.contentRoot = {
          selector: describe(zs.el),
          strategy: zs.strategy,
          box: edgeBox(zs.el, frameOffset)
        };
        payload.lateralNavBoxes = zs.navs.filter(isVisible).map(n => edgeBox(n, frameOffset));
      }

      if (actionTarget) payload.actionTarget = actionTarget;

      if (isGroup) {
        payload.groupMembers = groupMembers;
        payload.groupUnionBox = groupUnionBox;
        payload.unresolvedGroupTargets = unresolvedGroupTargets;
      }

      return JSON.stringify(payload);
    })()
  `;
}

/**
 * Converte a string retornada pelo `client.eval(buildDOMIntrospectionScript(...))`
 * em um objeto `DOMResolvedGeometry` validado.
 */
export function parseDOMGeometryResponse(rawOutput: string | null | undefined): DOMResolvedGeometry | null {
  if (!rawOutput || rawOutput === 'null' || rawOutput === 'undefined') return null;
  try {
    const firstPass = JSON.parse(rawOutput);
    const parsed = typeof firstPass === 'string' ? JSON.parse(firstPass) : firstPass;
    if (
      parsed &&
      parsed.cssBox &&
      typeof parsed.cssBox.x === 'number' &&
      typeof parsed.cssBox.y === 'number' &&
      parsed.cssBox.width > 0 &&
      parsed.cssBox.height > 0
    ) {
      return parsed as DOMResolvedGeometry;
    }
    return null;
  } catch {
    return null;
  }
}
