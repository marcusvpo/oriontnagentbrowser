import type {
  AnchorPlacement,
  AnnotationCalloutInput,
  AnnotationCalloutLayout,
  AnnotationLayoutResult,
  BoundingBox,
  DOMElementContext,
  DOMResolvedGeometry,
  DOMViewportMetrics,
  Point,
  SemanticZone
} from './types.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';

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

  return `
    (() => {
      const targetZoom = ${JSON.stringify(zoomFactor)};
      if (Number.isFinite(targetZoom) && targetZoom > 0 && Math.abs(targetZoom - 1) >= 0.001) {
        const zStr = String(targetZoom);
        if (document.documentElement && document.documentElement.style.zoom !== zStr) {
          document.documentElement.style.zoom = zStr;
          void document.documentElement.offsetHeight;
        }
        if (document.head && !document.getElementById('orion-audit-zoom')) {
          const st = document.createElement('style');
          st.id = 'orion-audit-zoom';
          st.textContent = 'html { zoom: ' + zStr + ' !important; }';
          document.head.appendChild(st);
        }
      }
      const queries = ${JSON.stringify(targetList)};
      const groupQueries = ${JSON.stringify(groupList)};
      const zone = ${JSON.stringify(zone)};
      const shouldScroll = ${JSON.stringify(scrollIntoView)};
      const actionMember = ${JSON.stringify(actionMember)};
      const NAV_ZONE = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const MODAL_SEL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR + ", .modal-dialog")};
      const MAIN_SELECTORS = ['main', '[role="main"]', '#content', '#main', '.main-content', '.content-wrapper'];
      const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], li > a, label, span, th, td, h1, h2, h3, h4';
      const CONTROL_SEL = 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';

      const vpW = window.innerWidth || document.documentElement.clientWidth || 1440;
      const vpH = window.innerHeight || document.documentElement.clientHeight || 900;

      function isVisible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        const style = window.getComputedStyle(el);
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

      // Caixa inteira por arredondamento das 4 arestas (garante união exata e reproduzível no lado Node)
      function edgeBox(el, off) {
        const r = el.getBoundingClientRect();
        const x1 = Math.round(r.left + off.x);
        const y1 = Math.round(r.top + off.y);
        const x2 = Math.round(r.right + off.x);
        const y2 = Math.round(r.bottom + off.y);
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

      function clipToViewport(b) {
        const x1 = Math.max(0, b.x);
        const y1 = Math.max(0, b.y);
        const x2 = Math.min(vpW, b.x + b.width);
        const y2 = Math.min(vpH, b.y + b.height);
        if (x2 - x1 <= 0 || y2 - y1 <= 0) return null;
        return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
      }

      function isOutsideViewport(b) {
        return b.y < 0 || b.y + b.height > vpH || b.x < 0 || b.x + b.width > vpW;
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
      // Com um modal visível no topo, um nó FORA dele cujo centro é interceptado pelo modal/backdrop está
      // por trás da sobreposição: não é demarcável nem clicável e nunca é aceito como alvo. Sem modal
      // aberto o filtro é inerte (comportamento original).
      function topModalOf(doc) {
        const modals = Array.from(doc.querySelectorAll(MODAL_SEL)).filter(isVisible);
        return modals.length > 0 ? modals[modals.length - 1] : null;
      }

      function isBehindModal(el, doc) {
        const modal = topModalOf(doc);
        if (!modal || modal.contains(el)) return false;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cx < 0 || cy < 0 || cx > vpW || cy > vpH) return false;
        const top = doc.elementFromPoint(cx, cy);
        if (!top || top === el || el.contains(top)) return false;
        return modal.contains(top) || top.matches('.modal, .modal-backdrop, .orion-lightweight-modal, .orion-lightweight-in, [role="dialog"], [aria-modal="true"]') || !!top.closest('.modal, .orion-lightweight-modal');
      }

      function resolveContentRoot(doc) {
        // 1. Um modal aberto é o contêiner de conteúdo vigente
        const modals = Array.from(doc.querySelectorAll(MODAL_SEL)).filter(isVisible);
        if (modals.length > 0) {
          return { el: modals[modals.length - 1], strategy: 'modal-aberto', navs: [] };
        }

        // 2. Coluna irmã da navegação lateral: sobe a partir da sidebar até achar o ancestral
        //    que tenha um irmão visível, lado a lado e mais largo (a coluna de conteúdo real).
        //    O critério é a largura, não a área: uma aba com poucos campos tem conteúdo mais baixo que a sidebar.
        const laterals = Array.from(doc.querySelectorAll(NAV_ZONE)).filter(isVisible).filter(isLateralNav);
        for (const nav of laterals) {
          let cur = nav;
          while (cur && cur.parentElement && cur !== doc.body && cur !== doc.documentElement) {
            const cr = cur.getBoundingClientRect();
            const beside = Array.from(cur.parentElement.children).filter(s => {
              if (s === cur || !isVisible(s) || s.matches(NAV_ZONE)) return false;
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
            cur = cur.parentElement;
          }
        }

        // 3. Contêiner principal semântico da página. As navegações laterais seguem registradas:
        //    inZone() rejeita qualquer candidato que as contenha (invólucros da sidebar).
        for (const sel of MAIN_SELECTORS) {
          const main = Array.from(doc.querySelectorAll(sel)).find(e => isVisible(e) && !e.closest(NAV_ZONE));
          if (main) return { el: main, strategy: 'container-principal:' + sel, navs: laterals };
        }
        return { el: doc.body, strategy: 'document-body', navs: laterals };
      }

      function inZone(el, zs) {
        if (zone !== 'content') return true;
        // (a) dentro de uma zona de navegação; (b) fora do contêiner de conteúdo;
        // (c) invólucro que contém a navegação lateral (ex.: a coluna .col-md-24 que embrulha o menu)
        if (el.closest(NAV_ZONE)) return false;
        if (!zs.el.contains(el)) return false;
        return !zs.navs.some(n => el.contains(n));
      }

      // ---------------------------------------------------------------------
      // RESOLUÇÃO DE CANDIDATOS (seletor CSS direto -> texto exato -> texto parcial)
      // ---------------------------------------------------------------------
      function findCandidates(doc, rawQuery, zs) {
        if (!rawQuery) return null;
        const scope = zone === 'content' ? zs.el : doc;

        // 1. Tentativa como seletor CSS direto (todos os matches visíveis dentro da zona)
        if (!rawQuery.includes(':has-text(')) {
          try {
            const candidates = Array.from(scope.querySelectorAll(rawQuery)).filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc));
            if (zone === 'content' && scope.matches && scope.matches(rawQuery) && isVisible(scope) && inZone(scope, zs)) {
              candidates.unshift(scope);
            }
            if (candidates.length > 0) {
              return { els: candidates, matchedSelector: rawQuery };
            }
          } catch (e) {}
        }

        // 2. Busca semântica por texto visível ou atributo de rótulo
        const cleanText = rawQuery
          .replace(/^.*:has-text\\(['"]([^'"]+)['"]\\).*$/, '$1')
          .replace(/\\*\\*/g, '')
          .trim()
          .toLowerCase();

        if (!cleanText) return null;

        const nodes = Array.from(scope.querySelectorAll(INTERACTIVE)).filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc));
        const textOf = n => (n.innerText || n.textContent || '').trim().toLowerCase();
        const valOf = n => (n.getAttribute('value') || n.getAttribute('placeholder') || n.getAttribute('title') || '').trim().toLowerCase();

        // 2a. Match exato de texto ou placeholder/value
        const exact = nodes.filter(n => textOf(n) === cleanText || valOf(n) === cleanText);
        if (exact.length > 0) {
          return { els: exact, matchedSelector: 'text:' + cleanText };
        }

        // 2b. Match parcial priorizando o elemento mais específico (menor área que contém o texto)
        const partialMatches = nodes.filter(n => {
          const txt = textOf(n);
          const val = valOf(n);
          return (txt && txt.includes(cleanText)) || (val && val.includes(cleanText));
        });
        if (partialMatches.length > 0) {
          partialMatches.sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return (ra.width * ra.height) - (rb.width * rb.height);
          });
          return { els: [partialMatches[0]], matchedSelector: 'text:' + cleanText };
        }

        // 2c. Valor de uma lista suspensa (ADR-018): o texto de um option de um select visível resolve
        //     para o próprio select, que é o elemento demarcável (o option fechado não tem caixa)
        const selects = Array.from(scope.querySelectorAll('select')).filter(isVisible).filter(e => inZone(e, zs)).filter(e => !isBehindModal(e, doc));
        const owning = selects.filter(sel =>
          Array.from(sel.options).some(o => (o.textContent || '').trim().toLowerCase() === cleanText)
        );
        if (owning.length > 0) {
          return { els: owning, matchedSelector: 'option:' + cleanText };
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

      // Resolve cada alvo do grupo; alvos ambíguos (ex.: o mesmo rótulo repetido em outra seção)
      // são desambiguados pela proximidade ao centroide dos alvos inequívocos (mesmo bloco/seção).
      function resolveGroup(doc, zs) {
        const resolved = [];
        const unresolved = [];
        for (const q of groupQueries) {
          const c = findCandidates(doc, q, zs);
          if (!c) {
            unresolved.push(q);
            continue;
          }
          const outermost = c.els.filter(e => !c.els.some(o => o !== e && o.contains(e)));
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

      // Bloco de campo: um rótulo é unido ao(s) seu(s) controle(s) e um controle ao seu rótulo,
      // para que o destaque cubra o parâmetro inteiro e não apenas o texto localizado.
      function fieldBlockElements(el, zs) {
        const out = [el];
        const tag = el.tagName;
        if (tag === 'LABEL') {
          let ctrl = el.control && isVisible(el.control) ? el.control : null;
          if (!ctrl) {
            const forId = el.getAttribute('for');
            const byId = forId ? el.ownerDocument.getElementById(forId) : null;
            if (byId && isVisible(byId)) ctrl = byId;
          }
          if (ctrl) {
            out.push(ctrl);
            return out;
          }
          const p = el.parentElement;
          if (p && p !== zs.el && zs.el.contains(p)) {
            const kids = Array.from(p.children);
            const otherLabels = kids.filter(k => k !== el && k.tagName === 'LABEL');
            if (otherLabels.length === 0) {
              const sibs = kids.filter(k => k !== el && isVisible(k));
              if (sibs.length > 0 && sibs.length <= 6) {
                out.push(...sibs);
                return out;
              }
              const inner = Array.from(p.querySelectorAll(CONTROL_SEL)).filter(isVisible);
              if (inner.length > 0 && inner.length <= 6) out.push(...inner);
            }
          }
        } else if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
          const own = el.labels && el.labels.length ? Array.from(el.labels).find(isVisible) : null;
          if (own) {
            out.push(own);
          } else if (el.parentElement) {
            const pTag = el.parentElement.tagName;
            if ((pTag === 'SPAN' || pTag === 'ORION-CHECKBOX') && isVisible(el.parentElement)) {
              const checks = el.parentElement.querySelectorAll('input[type="checkbox"], input[type="radio"]');
              if (checks.length === 1) out.push(el.parentElement);
            } else {
              const lbls = Array.from(el.parentElement.children).filter(k => k.tagName === 'LABEL' && isVisible(k));
              if (lbls.length === 1) out.push(lbls[0]);
            }
          }
        } else if ((tag === 'SPAN' || tag === 'ORION-CHECKBOX') && isVisible(el)) {
          const checks = el.querySelectorAll('input[type="checkbox"], input[type="radio"]');
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

      function searchInDocument(doc, frameOffset) {
        const zs = zone === 'content' ? resolveContentRoot(doc) : { el: doc.body, strategy: 'sem-filtro', navs: [] };

        if (groupQueries.length > 0) {
          const group = resolveGroup(doc, zs);
          if (group) return { group, zs, frameOffset };
        }

        for (const rawQuery of queries) {
          const c = findCandidates(doc, rawQuery, zs);
          if (c) return { el: c.els[0], matchedSelector: c.matchedSelector, zs, frameOffset };
        }
        return null;
      }

      // Busca no documento principal
      let match = searchInDocument(document, { x: 0, y: 0 });

      // Busca em iframes de mesma origem (se não encontrado no documento raiz)
      if (!match) {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        for (const frame of iframes) {
          try {
            if (frame.contentDocument) {
              const fr = frame.getBoundingClientRect();
              const offset = {
                x: fr.left + (frame.clientLeft || 0),
                y: fr.top + (frame.clientTop || 0)
              };
              match = searchInDocument(frame.contentDocument, offset);
              if (match) break;
            }
          } catch (e) {}
        }
      }

      if (!match) return null;

      const frameOffset = match.frameOffset;
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

        if (shouldScroll && isOutsideViewport(meas.union)) {
          // Centraliza o membro mais próximo do centro da união e mede tudo de novo no mesmo frame
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
          cssBox: d.box
        }));
        unresolvedGroupTargets = match.group.unresolved;
        matchedSelector = 'group:' + groupMembers.map(g => g.matchedSelector).join(' + ');
        innerText = groupMembers.map(g => g.innerText || g.query).join(' + ').slice(0, 80);
        tagName = 'group';
      } else {
        // ------------------- Modo Alvo Único -------------------
        const el = match.el;
        if (!el) return null;

        // Garantir que o elemento esteja visível dentro do viewport (scrollIntoViewIfNeeded)
        const initRect = el.getBoundingClientRect();
        const partlyOut = initRect.top < 0 || initRect.bottom > vpH || initRect.left < 0 || initRect.right > vpW;
        const fitsViewport = initRect.width <= vpW && initRect.height <= vpH;
        const intersectsViewport = initRect.bottom > 0 && initRect.top < vpH && initRect.right > 0 && initRect.left < vpW;
        // Um contêiner maior que o viewport e já visível não é rolado (centralizá-lo esconderia o seu topo);
        // a moldura é apenas recortada à porção visível.
        if (shouldScroll && partlyOut && (fitsViewport || !intersectsViewport)) {
          try {
            el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
          } catch (e) {
            el.scrollIntoView(true);
          }
        }

        // Forçar reflow síncrono para estabilizar coordenadas pós-scroll
        void el.offsetHeight;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;

        rawBox = {
          x: Math.round(rect.left + frameOffset.x),
          y: Math.round(rect.top + frameOffset.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };

        // Extrair irmãos adjacentes visíveis para evitar colisão de rótulos
        for (const sib of [el.previousElementSibling, el.nextElementSibling]) {
          if (sib && isVisible(sib)) {
            const sr = sib.getBoundingClientRect();
            neighborBoxes.push({
              x: Math.round(sr.left + frameOffset.x),
              y: Math.round(sr.top + frameOffset.y),
              width: Math.round(sr.width),
              height: Math.round(sr.height)
            });
          }
        }

        ctxEl = el;
        matchedSelector = match.matchedSelector;
        innerText = (el.innerText || el.textContent || '').trim().slice(0, 80);
        tagName = (el.tagName || '').toLowerCase();
      }

      // Recorte à porção visível do viewport (a moldura nunca sai do canvas capturado)
      const cssBox = clipToViewport(rawBox);
      if (!cssBox) return null;

      // ---------------------------------------------------------------------
      // ALVO DA AÇÃO PÓS-CAPTURA (ADR-015 §2.4)
      // O nó validado na zona recebe um carimbo de atributo único. O executor clica/preenche por esse
      // carimbo, ou seja, no MESMO nó medido, e nunca refaz a busca por nome (que poderia cair num
      // item homônimo da navegação lateral).
      // ---------------------------------------------------------------------
      function controlOf(el) {
        if (el.matches(CONTROL_SEL)) return el;
        if (el.tagName === 'LABEL') {
          if (el.control && isVisible(el.control)) return el.control;
          const forId = el.getAttribute('for');
          const byId = forId ? el.ownerDocument.getElementById(forId) : null;
          if (byId && isVisible(byId)) return byId;
        }
        const inner = Array.from(el.querySelectorAll(CONTROL_SEL)).find(isVisible);
        if (inner) return inner;
        for (const b of fieldBlockElements(el, zs)) {
          if (b === el) continue;
          if (b.matches(CONTROL_SEL)) return b;
          const c = Array.from(b.querySelectorAll(CONTROL_SEL)).find(isVisible);
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
        // Grupo: o clique que avança o fluxo é o primeiro membro nativamente clicável (ex.: o botão
        // de um passo "digite ... e clique em ..."); o preenchimento vai ao primeiro campo do grupo.
        const clickEl = actionMember === 'last'
          ? memberEls[memberEls.length - 1]
          : memberEls.find(e => e.closest(CLICKABLE)) || memberEls[0];
        let fillEl = null;
        for (const e of memberEls) {
          fillEl = controlOf(e);
          if (fillEl) break;
        }

        if (clickEl.ownerDocument === document) {
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
            insideNavZone: !!el.closest(NAV_ZONE)
          });
          actionTarget = { clickSelector: stamp(clickEl, 'click'), click: info(clickEl) };
          if (fillEl && fillEl.ownerDocument === document) {
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
      const isTopNav = (!isGroup && !!ctxEl.closest('nav, header, .navbar, #navbar')) || cssBox.y < 52;
      const isVerticalSidebar = isGroup
        ? false
        : !!ctxEl.closest('aside, .sidebar, .nav-stacked, .list-group, .menu-lateral') ||
          (cssBox.x < 140 && cssBox.width < 240 && cssBox.y >= 60 && cssBox.height <= 48);
      const isDropdownItem = !isGroup && !!ctxEl.closest('.dropdown-menu, [role="menu"], [role="listbox"]');
      const isModal = !!ctxEl.closest('.modal, .modal-dialog, [role="dialog"]');

      // ADR-027: Assinatura Semântica Hierárquica (seção, linha de grade, rótulo associado e papel)
      function extractSemanticSignature(el) {
        const cleanSem = s => String(s || '').replace(/\\s+/g, ' ').trim().slice(0, 120);
        let sectionTitle = '';
        let cur = el;
        while (cur && cur !== document.body && cur.nodeType === 1) {
          if (cur.tagName === 'FIELDSET') {
            const leg = cur.querySelector('legend');
            if (leg && isVisible(leg)) { sectionTitle = cleanSem(leg.innerText || leg.textContent); break; }
          }
          if (cur.matches && cur.matches('.panel, .card, .box, .modal-content, .well, section, form')) {
            const hd = cur.querySelector(':scope > .panel-heading, :scope > .card-header, :scope > .box-header, :scope > .modal-header .modal-title, :scope > h3, :scope > h4, :scope > h5, :scope > legend');
            if (hd && isVisible(hd)) { sectionTitle = cleanSem(hd.innerText || hd.textContent); break; }
          }
          const prev = cur.previousElementSibling;
          if (prev && /^H[2-5]$/.test(prev.tagName) && isVisible(prev)) {
            sectionTitle = cleanSem(prev.innerText || prev.textContent);
            break;
          }
          cur = cur.parentElement;
        }
        if (!sectionTitle && el.closest) {
          const panel = el.closest('.panel, .card, .box, fieldset, .modal-content');
          if (panel) {
            const h = panel.querySelector('legend, .panel-heading, .card-header, .box-header, .modal-title, h3, h4, h5');
            if (h && isVisible(h)) sectionTitle = cleanSem(h.innerText || h.textContent);
          }
        }

        let rowContext;
        const tr = el.closest ? el.closest('tr') : null;
        if (tr && tr.parentElement) {
          const rows = Array.from(tr.parentElement.children).filter(r => r.tagName === 'TR');
          const rowIndex = Math.max(0, rows.indexOf(tr));
          const cells = Array.from(tr.querySelectorAll('td, th')).map(c => cleanSem(c.innerText || c.textContent)).filter(Boolean);
          if (cells.length > 0) {
            rowContext = { rowIndex, firstColText: cells[0], secondColText: cells[1] };
          }
        }

        let associatedLabel = '';
        const lbl = (el.labels && el.labels[0]) || (el.closest && el.closest('label'));
        if (lbl) associatedLabel = cleanSem(lbl.innerText || lbl.textContent);
        if (!associatedLabel && el.parentElement) {
          const sibLbl = Array.from(el.parentElement.children).find(k => k !== el && (k.tagName === 'LABEL' || k.tagName === 'SPAN') && isVisible(k));
          if (sibLbl) associatedLabel = cleanSem(sibLbl.innerText || sibLbl.textContent);
        }
        if (!associatedLabel) {
          associatedLabel = cleanSem(
            el.getAttribute('title') ||
            el.getAttribute('data-original-title') ||
            el.getAttribute('placeholder') ||
            el.getAttribute('ng-reflect-name') ||
            ''
          );
        }

        const txtNorm = cleanSem(el.innerText || el.textContent || associatedLabel).toLowerCase();
        let semanticRole = 'form_input';
        if (isTopNav) {
          semanticRole = isDropdownItem ? 'navigation_leaf' : 'navigation_root';
        } else if (/\\bnovo\\s+(cart[ãa]o|ficha|usu[áa]rio|protocolo|or[çc]amento)\\b/.test(txtNorm)) {
          semanticRole = 'entity_creation_button';
        } else if (/\\befetuar\\s+servi[çc]o\\b/.test(txtNorm) || /btnConcluirOutrosServicos/.test(el.id || '')) {
          semanticRole = 'service_execution_trigger';
        } else if (rowContext && (txtNorm === '+' || el.querySelector('.glyphicon-plus, .fa-plus') || /selecion/i.test(el.id || ''))) {
          semanticRole = 'grid_row_picker';
        } else if (/^finalizar$/i.test(txtNorm)) {
          semanticRole = 'section_confirm_button';
        } else if (/^(filtrar|pesquisar|buscar)$/i.test(txtNorm) && el.tagName === 'BUTTON') {
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
          role: isGroup ? undefined : ctxEl.getAttribute('role') || undefined,
          innerText,
          isTopNav,
          isVerticalSidebar,
          isDropdownItem,
          isModal,
          iframeOffset: frameOffset,
          neighborBoxes,
          semantic: extractSemanticSignature(ctxEl)
        },
        matchedSelector,
        url: window.location.href,
        capturedAt: new Date().toISOString(),
        zone,
        clippedToViewport
      };

      if (zone === 'content') {
        // Medidos no mesmo frame (pós-scroll) do alvo, para auditoria do invariante de zona
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
