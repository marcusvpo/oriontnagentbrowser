import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { AnnotationOptions, AnnotationOutput, BoundingBox, Point, SetOfMarkCandidateInput } from './types.js';
import { clamp, computeMultiAnnotationLayout, computeOptimalAnnotationLayout, calculateRectIntersection as intersectionArea } from './dom-geometry.js';

/** Limite máximo de candidatos interativos numerados no overlay Set-of-Mark (ADR-031). */
export const MAX_SOM_CANDIDATES = 45;

// Biblioteca de Ícones Vetoriais SVG (Baseados no Guia de Estilos Siplan / SPCM)
const SVG_ICONS: Record<string, string> = {
  click: `<path d="M4 1L11 15L8 10L13 7L4 1Z" fill="#FFFFFF"/>`,
  fill: `<path d="M2 3H14V13H2V3ZM4 5V7H6V5H4ZM8 5V7H10V5H8ZM4 9V11H12V9H4Z" fill="#FFFFFF"/>`,
  search: `<path d="M6.5 1a5.5 5.5 0 103.54 9.7l3.63 3.63 1.41-1.41-3.63-3.63A5.5 5.5 0 006.5 1zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" fill="#FFFFFF"/>`,
  select: `<path d="M3 5H13L8 11L3 5Z" fill="#FFFFFF"/>`,
  check: `<path d="M12.7 3.3a1 1 0 00-1.4 0L5.5 9.1 2.7 6.3a1 1 0 10-1.4 1.4l3.5 3.5a1 1 0 001.4 0l6.5-6.5a1 1 0 000-1.4z" fill="#FFFFFF"/>`
};

/**
 * Motor Gráfico Vetorial Sharp Determinístico:
 * - Opera exclusivamente sobre coordenadas geométricas do DOM transformadas para o espaço físico do buffer.
 * - Zero leitura heurística de pixels RGB (sem auto-snapper baseado em cor).
 * - Solver anti-oclusão e clamping matemático estrito dentro de [metadata.width x metadata.height].
 * - I/O 100% assíncrono não-bloqueante com geração paralela de PNG e WebP.
 */
export async function annotateScreenshot(options: AnnotationOptions): Promise<AnnotationOutput> {
  const {
    inputPath,
    outputPath,
    box,
    stepNumber,
    actionType = 'click',
    themeColor = '#ad0505', // Carmesim Canônico Siplan (RGB: 173, 5, 5)
    label,
    viewport,
    domContext,
    anchorPlacement = 'auto',
    enableZoomCallout,
    zoomFactor = 2.5,
    zoomPosition = 'auto',
    showActionIcon = true,
    arrowFrom,
    exportWebp = true,
    webpQuality = 85,
    callouts,
    softObstacles
  } = options;

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Imagem de entrada não encontrada: ${inputPath}`);
  }

  // Garantir diretório de destino de forma assíncrona
  const outDir = path.dirname(outputPath);
  await fs.promises.mkdir(outDir, { recursive: true });

  // 1. Decodificar buffer de entrada uma única vez em memória (evita re-leitura de disco)
  const rawInputBuffer = await fs.promises.readFile(inputPath);
  const baseSharp = sharp(rawInputBuffer);
  const metadata = await baseSharp.metadata();
  const imgWidth = metadata.width || 1440;
  const imgHeight = metadata.height || 900;

  // 2A. Multi-demarcação (ADR-017): N alvos do mesmo frame, cada um com moldura e badge numerado
  if (callouts && callouts.length >= 1) {
    const multiLayout = computeMultiAnnotationLayout({ callouts, imgWidth, imgHeight, viewport, padding: 3, softObstacles });
    const multiSvg = `
    <svg width="${imgWidth}" height="${imgHeight}" viewBox="0 0 ${imgWidth} ${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      ${(multiLayout.callouts || [])
        .map(
          c => `
      <rect x="${c.targetBox.x}" y="${c.targetBox.y}" width="${c.targetBox.width}" height="${c.targetBox.height}" rx="6" ry="6"
        fill="${themeColor}" fill-opacity="0.10" stroke="${themeColor}" stroke-width="3" filter="url(#shadow)"/>`
        )
        .join('')}
      ${(multiLayout.callouts || [])
        .map(
          c => `
      <g transform="translate(${c.badgeBox.x}, ${c.badgeBox.y})">
        <rect x="0" y="0" width="${c.badgeBox.width}" height="${c.badgeBox.height}" rx="14" fill="${themeColor}" stroke="#FFFFFF" stroke-width="2" filter="url(#shadow)"/>
        <text x="${c.badgeBox.width / 2}" y="19" text-anchor="middle" font-family="'Oswald', Arial, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${c.index}</text>
      </g>
      ${
        c.labelBox && c.label
          ? `<g transform="translate(${c.labelBox.x}, ${c.labelBox.y})">
        <rect x="0" y="0" width="${c.labelBox.width}" height="${c.labelBox.height}" rx="5" ry="5" fill="#5a0000" fill-opacity="0.95" filter="url(#shadow)"/>
        <text x="10" y="15" font-family="'Lato', Arial, sans-serif" font-size="11" font-weight="400" fill="#FFFFFF">${escapeXml(c.label)}</text>
      </g>`
          : ''
      }`
        )
        .join('')}
    </svg>`.trim();

    const multiPipeline = baseSharp.composite([{ input: Buffer.from(multiSvg), top: 0, left: 0 }]);
    const multiTasks: Promise<void>[] = [
      multiPipeline
        .clone()
        .png({ quality: 90 })
        .toBuffer()
        .then(buf => safeWriteFileAsync(outputPath, buf))
    ];
    let multiWebpPath: string | undefined;
    if (exportWebp) {
      multiWebpPath = outputPath.replace(/\.png$/i, '.webp');
      const target = multiWebpPath;
      multiTasks.push(
        multiPipeline
          .clone()
          .webp({ quality: webpQuality })
          .toBuffer()
          .then(buf => safeWriteFileAsync(target, buf))
      );
    }
    await Promise.all(multiTasks);
    return {
      pngPath: outputPath,
      webpPath: multiWebpPath,
      layout: multiLayout,
      imageSize: { width: imgWidth, height: imgHeight }
    };
  }

  // 2. Resolver Layout Determinístico (Conversão CSS->Physical + Clamping + Solver Anti-Oclusão)
  const layout = computeOptimalAnnotationLayout({
    rawBox: box,
    imgWidth,
    imgHeight,
    viewport,
    domContext,
    anchorPlacement,
    showActionIcon,
    labelText: label,
    padding: 3
  });

  const { targetBox, badgeBox, labelBox, scaleX, scaleY } = layout;
  const { x: rx, y: ry, width: rw, height: rh } = targetBox;

  // 3. Processar Inset de Lupa / Zoom Callout (exclusivamente para micro-ícones <= 48x48px físicos)
  const isTinyIcon = enableZoomCallout ?? (rw <= 48 && rh <= 48);
  let zoomCalloutComposite: sharp.OverlayOptions | null = null;
  let zoomCalloutDetails: {
    calloutBox: BoundingBox;
    connectorStart: Point;
    connectorEnd: Point;
  } | null = null;

  if (isTinyIcon) {
    const padExtract = 16;
    const cropX = clamp(rx - padExtract, 0, imgWidth - 12);
    const cropY = clamp(ry - padExtract, 0, imgHeight - 12);
    const cropW = clamp(rw + padExtract * 2, 12, imgWidth - cropX);
    const cropH = clamp(rh + padExtract * 2, 12, imgHeight - cropY);

    const zoomedW = Math.round(cropW * zoomFactor);
    const zoomedH = Math.round(cropH * zoomFactor);

    // Extrair a partir do buffer já carregado em memória com Lanczos3
    const croppedBuffer = await sharp(rawInputBuffer)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .resize(zoomedW, zoomedH, { kernel: 'lanczos3' })
      .png()
      .toBuffer();

    const calloutMargin = 20;
    const calloutHeaderH = 30;
    const totalCalloutW = Math.max(180, zoomedW + 16);
    const totalCalloutH = zoomedH + calloutHeaderH + 16;
    const innerLeftPad = Math.round((totalCalloutW - zoomedW) / 2);

    let calloutX = imgWidth - totalCalloutW - calloutMargin;
    let calloutY = calloutMargin;

    if (zoomPosition === 'bottom-right' || (zoomPosition === 'auto' && ry < imgHeight / 2 && rx > imgWidth / 2)) {
      calloutY = imgHeight - totalCalloutH - calloutMargin;
    } else if (zoomPosition === 'top-left') {
      calloutX = calloutMargin;
      calloutY = calloutMargin;
    } else if (zoomPosition === 'bottom-left') {
      calloutX = calloutMargin;
      calloutY = imgHeight - totalCalloutH - calloutMargin;
    }

    calloutX = clamp(calloutX, 8, imgWidth - totalCalloutW - 8);
    calloutY = clamp(calloutY, 8, imgHeight - totalCalloutH - 8);

    const calloutSvg = `
      <svg width="${totalCalloutW}" height="${totalCalloutH}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="callout-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.45"/>
          </filter>
        </defs>
        <rect width="${totalCalloutW}" height="${totalCalloutH}" rx="8" fill="#FFFFFF" stroke="${themeColor}" stroke-width="2.5" filter="url(#callout-shadow)"/>
        <path d="M 0 8 Q 0 0 8 0 L ${totalCalloutW - 8} 0 Q ${totalCalloutW} 0 ${totalCalloutW} 8 L ${totalCalloutW} ${calloutHeaderH} L 0 ${calloutHeaderH} Z" fill="${themeColor}"/>
        <text x="${totalCalloutW / 2}" y="20" text-anchor="middle" font-family="'Oswald', Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5" fill="#FFFFFF">🔍 LUPA DE DETALHE (${zoomFactor}x)</text>
      </svg>
    `.trim();

    const calloutCard = await sharp(Buffer.from(calloutSvg))
      .composite([
        {
          input: croppedBuffer,
          top: calloutHeaderH + 8,
          left: innerLeftPad
        }
      ])
      .png()
      .toBuffer();

    zoomCalloutComposite = {
      input: calloutCard,
      top: calloutY,
      left: calloutX
    };

    zoomCalloutDetails = {
      calloutBox: { x: calloutX, y: calloutY, width: totalCalloutW, height: totalCalloutH },
      connectorStart: { x: calloutX, y: calloutY + totalCalloutH },
      connectorEnd: { x: rx + rw, y: Math.round(ry + rh / 2) }
    };
  }

  // 4. Construir Camada Vetorial SVG Determinística
  const selectedIconKey =
    actionType === 'fill'
      ? 'fill'
      : actionType === 'search'
        ? 'search'
        : actionType === 'select'
          ? 'select'
          : actionType === 'verify'
            ? 'check'
            : 'click';
  const iconPath = SVG_ICONS[selectedIconKey] || SVG_ICONS.click;

  const scaledArrowFrom = arrowFrom
    ? { x: Math.round(arrowFrom.x * scaleX), y: Math.round(arrowFrom.y * scaleY) }
    : undefined;

  const svgOverlay = `
    <svg width="${imgWidth}" height="${imgHeight}" viewBox="0 0 ${imgWidth} ${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
        <marker id="red-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="${themeColor}"/>
        </marker>
      </defs>

      ${scaledArrowFrom ? `
      <path
        d="M ${scaledArrowFrom.x} ${scaledArrowFrom.y} C ${scaledArrowFrom.x + 80} ${scaledArrowFrom.y - 40}, ${rx - 80} ${ry - 40}, ${rx} ${Math.round(ry + rh / 2)}"
        fill="none"
        stroke="${themeColor}"
        stroke-width="3.5"
        stroke-dasharray="6,4"
        marker-end="url(#red-arrow)"
        filter="url(#shadow)"
      />
      ` : ''}

      ${zoomCalloutDetails ? `
      <path
        d="M ${zoomCalloutDetails.connectorStart.x} ${zoomCalloutDetails.connectorStart.y} C ${zoomCalloutDetails.connectorStart.x - 40} ${zoomCalloutDetails.connectorStart.y}, ${zoomCalloutDetails.connectorEnd.x + 40} ${zoomCalloutDetails.connectorEnd.y}, ${zoomCalloutDetails.connectorEnd.x} ${zoomCalloutDetails.connectorEnd.y}"
        fill="none"
        stroke="${themeColor}"
        stroke-width="2"
        stroke-dasharray="4,4"
        marker-end="url(#red-arrow)"
      />
      ` : ''}

      <!-- Moldura Retangular em Carmesim Siplan (#ad0505) -->
      <rect
        x="${rx}"
        y="${ry}"
        width="${rw}"
        height="${rh}"
        rx="6"
        ry="6"
        fill="${themeColor}"
        fill-opacity="0.10"
        stroke="${themeColor}"
        stroke-width="3"
        filter="url(#shadow)"
      />

      <!-- Badge com Micro-Ícone de Ação (Pill Badge) -->
      <g transform="translate(${badgeBox.x}, ${badgeBox.y})">
        <rect x="0" y="0" width="${badgeBox.width}" height="${badgeBox.height}" rx="14" fill="${themeColor}" stroke="#FFFFFF" stroke-width="2" filter="url(#shadow)"/>
        ${showActionIcon ? `
        <g transform="translate(6, 6) scale(0.9)">
          ${iconPath}
        </g>
        <text x="32" y="19" text-anchor="middle" font-family="'Oswald', Arial, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${stepNumber}</text>
        ` : `
        <text x="14" y="19" text-anchor="middle" font-family="'Oswald', Arial, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${stepNumber}</text>
        `}
      </g>

      ${label && labelBox ? `
      <!-- Rótulo do Elemento em Lato -->
      <g transform="translate(${labelBox.x}, ${labelBox.y})">
        <rect
          x="0"
          y="0"
          width="${labelBox.width}"
          height="${labelBox.height}"
          rx="5"
          ry="5"
          fill="#5a0000"
          fill-opacity="0.95"
          filter="url(#shadow)"
        />
        <text
          x="10"
          y="15"
          font-family="'Lato', Arial, sans-serif"
          font-size="11"
          font-weight="400"
          fill="#FFFFFF"
        >${escapeXml(label)}</text>
      </g>
      ` : ''}
    </svg>
  `.trim();

  // 5. Compor camadas no Sharp e exportar PNG + WebP concorrentemente (I/O desacoplado)
  const composites: sharp.OverlayOptions[] = [
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0
    }
  ];

  if (zoomCalloutComposite) {
    composites.push(zoomCalloutComposite);
  }

  const compositedPipeline = baseSharp.composite(composites);
  const pngPromise = compositedPipeline
    .clone()
    .png({ quality: 90 })
    .toBuffer()
    .then(buf => safeWriteFileAsync(outputPath, buf));

  let webpPath: string | undefined;
  const ioTasks: Promise<void>[] = [pngPromise];

  if (exportWebp) {
    webpPath = outputPath.replace(/\.png$/i, '.webp');
    const targetWebp = webpPath;
    const webpPromise = compositedPipeline
      .clone()
      .webp({ quality: webpQuality })
      .toBuffer()
      .then(buf => safeWriteFileAsync(targetWebp, buf));
    ioTasks.push(webpPromise);
  }

  await Promise.all(ioTasks);

  return {
    pngPath: outputPath,
    webpPath,
    layout,
    imageSize: { width: imgWidth, height: imgHeight }
  };
}

/**
 * Escrita assíncrona resiliente sem bloquear a Event Loop do Node.js
 * (substitui o antigo busy-wait síncrono).
 */
async function safeWriteFileAsync(filePath: string, buffer: Buffer, retries = 5, delayMs = 150): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.promises.writeFile(filePath, buffer);
      return;
    } catch (err: any) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function pointInsideBox(x: number, y: number, b: BoundingBox): boolean {
  return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
}

/**
 * Calcula a caixa da tag numerada `[id]` de um candidato Set-of-Mark (ADR-031),
 * garantindo por deslocamento determinístico que a tag nunca cubra o centro `(cx, cy)` do próprio alvo
 * e minimize colisão com o alvo e com outras tags já posicionadas no mesmo frame.
 */
export function computeSetOfMarkTagPlacement(
  box: BoundingBox,
  tagSize: { width: number; height: number },
  imgWidth = 1440,
  imgHeight = 900,
  occupiedTags: BoundingBox[] = []
): BoundingBox {
  const tw = Math.max(20, Math.round(tagSize.width));
  const th = Math.max(16, Math.round(tagSize.height));
  const target: BoundingBox = {
    x: clamp(Math.round(box.x), 2, Math.max(2, imgWidth - 4)),
    y: clamp(Math.round(box.y), 2, Math.max(2, imgHeight - 4)),
    width: Math.max(2, Math.round(box.width)),
    height: Math.max(2, Math.round(box.height))
  };
  const cx = target.x + target.width / 2;
  const cy = target.y + target.height / 2;
  const centerGuardBox: BoundingBox = {
    x: Math.round(cx - 3),
    y: Math.round(cy - 3),
    width: 6,
    height: 6
  };

  const clampTag = (x: number, y: number): BoundingBox => ({
    x: clamp(Math.round(x), 2, Math.max(2, imgWidth - tw - 2)),
    y: clamp(Math.round(y), 2, Math.max(2, imgHeight - th - 2)),
    width: tw,
    height: th
  });

  // Posições candidatas ao redor e nos cantos do alvo (afastadas do centro)
  const rawPositions: Array<{ x: number; y: number }> = [
    // 1. Acima à esquerda (externo)
    { x: target.x, y: target.y - th - 2 },
    // 2. Abaixo à esquerda (externo)
    { x: target.x, y: target.y + target.height + 2 },
    // 3. À esquerda (externo)
    { x: target.x - tw - 2, y: target.y },
    // 4. À direita (externo)
    { x: target.x + target.width + 2, y: target.y },
    // 5. Acima à direita (externo)
    { x: target.x + target.width - tw, y: target.y - th - 2 },
    // 6. Abaixo à direita (externo)
    { x: target.x + target.width - tw, y: target.y + target.height + 2 },
    // 7. Deslocamento diagonal superior esquerdo
    { x: target.x - tw, y: target.y - th },
    // 8. Deslocamento diagonal inferior direito
    { x: target.x + target.width, y: target.y + target.height },
    // 9. Canto interno mais distante do centro (para contêineres grandes que tocam as bordas)
    {
      x: cx >= imgWidth / 2 ? target.x + 2 : target.x + target.width - tw - 2,
      y: cy >= imgHeight / 2 ? target.y + 2 : target.y + target.height - th - 2
    }
  ];

  let best: BoundingBox | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const pos of rawPositions) {
    const candidate = clampTag(pos.x, pos.y);
    const coversCenter =
      pointInsideBox(cx, cy, candidate) || intersectionArea(candidate, centerGuardBox) > 0;
    const targetOverlap = intersectionArea(candidate, target);
    const occupiedOverlap = occupiedTags.reduce((sum, occ) => sum + intersectionArea(candidate, occ), 0);

    const score =
      (coversCenter ? 1_000_000 : 0) +
      occupiedOverlap * 50 +
      targetOverlap * 5;

    if (score < bestScore) {
      bestScore = score;
      best = candidate;
      if (score === 0) break;
    }
  }

  let chosen = best ?? clampTag(target.x, target.y - th - 2);

  // Garantia determinística final: se por clamping de borda extrema ainda cobrir `(cx, cy)`,
  // desloca perpendicularmente para fora do centro do elemento.
  if (pointInsideBox(cx, cy, chosen) || intersectionArea(chosen, centerGuardBox) > 0) {
    const shiftRight = Math.round(cx + 6);
    const shiftLeft = Math.round(cx - tw - 6);
    const shiftDown = Math.round(cy + 6);
    const shiftUp = Math.round(cy - th - 6);
    const fallbacks = [
      clampTag(shiftRight, chosen.y),
      clampTag(shiftLeft, chosen.y),
      clampTag(chosen.x, shiftDown),
      clampTag(chosen.x, shiftUp)
    ];
    const safe = fallbacks.find(f => !pointInsideBox(cx, cy, f));
    if (safe) chosen = safe;
  }

  return chosen;
}

/**
 * Renderizador Set-of-Mark (SoM) Efêmero em Memória (ADR-031):
 * - Recebe `screenshotBuffer` e até 45 candidatos interativos `{ id, box }`.
 * - Desenha em buffer de memória (NUNCA grava em disco nem altera `passo-NN.png`) molduras tracejadas
 *   e tags numeradas de alto contraste `[1]..[N]` sobre a captura `1440×900`, deslocando cada tag
 *   para não cobrir o centro do próprio alvo.
 */
export async function renderSetOfMarkOverlay(
  screenshotBuffer: Buffer,
  candidates: Array<SetOfMarkCandidateInput>
): Promise<Buffer> {
  if (!Buffer.isBuffer(screenshotBuffer) || screenshotBuffer.length === 0) {
    throw new Error('renderSetOfMarkOverlay exige um screenshotBuffer PNG válido em memória.');
  }

  const baseSharp = sharp(screenshotBuffer);
  const metadata = await baseSharp.metadata();
  const imgWidth = metadata.width || 1440;
  const imgHeight = metadata.height || 900;

  const capped = (candidates || []).slice(0, MAX_SOM_CANDIDATES);
  if (capped.length === 0) {
    return baseSharp.png().toBuffer();
  }

  const occupiedTags: BoundingBox[] = [];
  const rectsSvg: string[] = [];
  const tagsSvg: string[] = [];

  for (const item of capped) {
    const id = Number(item.id);
    if (!Number.isFinite(id)) continue;

    const rx = clamp(Math.round(item.box.x), 1, Math.max(1, imgWidth - 3));
    const ry = clamp(Math.round(item.box.y), 1, Math.max(1, imgHeight - 3));
    const rw = clamp(Math.round(item.box.width), 2, Math.max(2, imgWidth - rx - 1));
    const rh = clamp(Math.round(item.box.height), 2, Math.max(2, imgHeight - ry - 1));
    const clampedBox: BoundingBox = { x: rx, y: ry, width: rw, height: rh };

    const tagLabel = `[${id}]`;
    const tagW = Math.max(28, tagLabel.length * 8 + 8);
    const tagH = 20;
    const tagBox = computeSetOfMarkTagPlacement(clampedBox, { width: tagW, height: tagH }, imgWidth, imgHeight, occupiedTags);
    occupiedTags.push(tagBox);

    rectsSvg.push(
      `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="3" ry="3" fill="#FF0055" fill-opacity="0.06" stroke="#FF0055" stroke-width="2" stroke-dasharray="4,2"/>`
    );
    tagsSvg.push(
      `<g transform="translate(${tagBox.x}, ${tagBox.y})">` +
        `<rect x="0" y="0" width="${tagBox.width}" height="${tagBox.height}" rx="4" ry="4" fill="#111111" fill-opacity="0.94" stroke="#FFD600" stroke-width="1.8"/>` +
        `<text x="${(tagBox.width / 2).toFixed(1)}" y="14" text-anchor="middle" font-family="'Oswald', 'Consolas', Arial, sans-serif" font-size="12" font-weight="700" fill="#FFD600">${escapeXml(tagLabel)}</text>` +
      `</g>`
    );
  }

  const somSvg = `
    <svg width="${imgWidth}" height="${imgHeight}" viewBox="0 0 ${imgWidth} ${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${rectsSvg.join('\n      ')}
      ${tagsSvg.join('\n      ')}
    </svg>
  `.trim();

  return baseSharp
    .composite([{ input: Buffer.from(somSvg), top: 0, left: 0 }])
    .png({ compressionLevel: 6 })
    .toBuffer();
}
