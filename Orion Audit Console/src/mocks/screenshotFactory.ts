import type { AnnotationLayoutResult, BoundingBox } from "@/types/audit";

// Gera prints SVG fictícios (1440×900) de um ERP genérico. As cores são lidas dos tokens do
// Design System em tempo de execução — nenhuma cor fixa no código.
const W = 1440;
const H = 900;

function token(name: string): string {
  if (typeof document === "undefined") return "currentColor";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "currentColor";
}

function palette() {
  return {
    ink: token("--color-ink"), graphite: token("--color-graphite"), slate: token("--color-slate"),
    filament: token("--color-filament"), filamentStrong: token("--color-filament-strong"),
    bone: token("--color-bone"), ash: token("--color-ash"), ashDim: token("--color-ash-dim"),
    white: token("--color-white"), crimson: token("--color-crimson"), crimsonDeep: token("--color-crimson-deep"),
    danger: token("--color-danger"), warning: token("--color-warning"),
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface ScreenSpec {
  screenTitle: string;
  menu: string[];
  activeMenu?: number;
  target?: { box: BoundingBox; label: string };
  extraTargets?: Array<{ box: BoundingBox; label: string }>;
}

function base(spec: ScreenSpec): string {
  const c = palette();
  const parts: string[] = [];
  parts.push(`<rect width="${W}" height="${H}" fill="${c.ink}"/>`);
  // topbar
  parts.push(`<rect width="${W}" height="56" fill="${c.graphite}"/><rect y="55" width="${W}" height="1" fill="${c.filament}"/>`);
  parts.push(`<text x="24" y="35" font-family="Space Grotesk, sans-serif" font-size="18" font-weight="700" fill="${c.bone}">ERP Notarial · Homologação</text>`);
  spec.menu.forEach((m, i) => {
    const x = 300 + i * 116;
    parts.push(`<rect x="${x}" y="14" width="104" height="28" rx="4" fill="${i === spec.activeMenu ? c.slate : c.graphite}" stroke="${c.filament}"/>`);
    parts.push(`<text x="${x + 52}" y="33" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="${c.ash}">${esc(m)}</text>`);
  });
  parts.push(`<circle cx="${W - 40}" cy="28" r="14" fill="${c.filament}"/>`);
  // sidebar
  parts.push(`<rect y="56" width="220" height="${H - 56}" fill="${c.graphite}"/><rect x="219" y="56" width="1" height="${H - 56}" fill="${c.filament}"/>`);
  ["Início", "Atos", "Cadastros", "Relatórios", "Parâmetros", "Ajuda"].forEach((s, i) => {
    parts.push(`<rect x="16" y="${84 + i * 44}" width="188" height="32" rx="4" fill="${i === 1 ? c.slate : c.graphite}"/>`);
    parts.push(`<text x="32" y="${105 + i * 44}" font-family="Inter, sans-serif" font-size="13" fill="${c.ash}">${s}</text>`);
  });
  // content
  parts.push(`<text x="260" y="104" font-family="Space Grotesk, sans-serif" font-size="24" font-weight="600" fill="${c.bone}">${esc(spec.screenTitle)}</text>`);
  parts.push(`<rect x="260" y="128" width="1140" height="1" fill="${c.filament}"/>`);
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 3; col++) {
      const x = 260 + col * 380; const y = 160 + r * 84;
      parts.push(`<rect x="${x}" y="${y}" width="${120 + ((r + col) % 3) * 30}" height="10" rx="2" fill="${c.filamentStrong}"/>`);
      parts.push(`<rect x="${x}" y="${y + 20}" width="350" height="36" rx="4" fill="${c.graphite}" stroke="${c.filament}"/>`);
    }
  }
  parts.push(`<rect x="260" y="520" width="1140" height="300" rx="4" fill="${c.graphite}" stroke="${c.filament}"/>`);
  for (let r = 0; r < 6; r++) {
    parts.push(`<rect x="260" y="${560 + r * 44}" width="1140" height="1" fill="${c.filament}"/>`);
    parts.push(`<rect x="284" y="${574 + r * 44}" width="${220 + (r % 3) * 60}" height="10" rx="2" fill="${c.filament}"/>`);
    parts.push(`<rect x="760" y="${574 + r * 44}" width="140" height="10" rx="2" fill="${c.filament}"/>`);
  }
  const drawEl = (t: { box: BoundingBox; label: string }) => {
    const { x, y, width, height } = t.box;
    parts.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="${c.slate}" stroke="${c.filamentStrong}"/>`);
    parts.push(`<text x="${x + width / 2}" y="${y + height / 2 + 5}" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="${c.bone}">${esc(t.label)}</text>`);
  };
  if (spec.target) drawEl(spec.target);
  spec.extraTargets?.forEach(drawEl);
  return parts.join("");
}

function annotation(stepNumber: number, layout: AnnotationLayoutResult, label: string, groupBoxes: BoundingBox[] = []): string {
  const c = palette();
  const t = layout.targetBox;
  const out: string[] = [];
  const frame = (b: BoundingBox) =>
    out.push(`<rect x="${b.x - 3}" y="${b.y - 3}" width="${b.width + 6}" height="${b.height + 6}" rx="6" fill="${c.crimson}" fill-opacity="0.1" stroke="${c.crimson}" stroke-width="3"/>`);
  groupBoxes.length ? groupBoxes.forEach(frame) : frame(t);
  const b = layout.badgeBox;
  out.push(`<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="${b.height / 2}" fill="${c.crimson}" stroke="${c.white}" stroke-width="2"/>`);
  out.push(`<text x="${b.x + b.width / 2}" y="${b.y + b.height / 2 + 6}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="16" font-weight="700" fill="${c.white}">${stepNumber}</text>`);
  if (layout.labelBox) {
    const l = layout.labelBox;
    out.push(`<rect x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}" rx="4" fill="${c.crimsonDeep}"/>`);
    out.push(`<text x="${l.x + 10}" y="${l.y + l.height / 2 + 5}" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="${c.white}">${esc(label)}</text>`);
  }
  return out.join("");
}

const toUri = (inner: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`)}`;

export function rawScreenshot(spec: ScreenSpec): string {
  return toUri(base(spec));
}

export function annotatedScreenshot(spec: ScreenSpec, stepNumber: number, layout: AnnotationLayoutResult, label: string, groupBoxes?: BoundingBox[]): string {
  return toUri(base(spec) + annotation(stepNumber, layout, label, groupBoxes));
}

export function blockedScreenshot(title: string, message: string): string {
  const c = palette();
  const inner = base({ screenTitle: title, menu: ["Atos", "Firmas", "Digitalizar"] }) +
    `<rect x="470" y="300" width="720" height="260" rx="6" fill="${c.graphite}" stroke="${c.danger}" stroke-width="1"/>` +
    `<circle cx="830" cy="370" r="22" fill="none" stroke="${c.danger}" stroke-width="2"/>` +
    `<text x="830" y="378" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="22" font-weight="700" fill="${c.danger}">!</text>` +
    `<text x="830" y="438" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="22" font-weight="600" fill="${c.bone}">Dispositivo não encontrado</text>` +
    `<text x="830" y="472" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" fill="${c.ash}">${esc(message)}</text>` +
    `<rect x="760" y="500" width="140" height="36" rx="4" fill="${c.slate}" stroke="${c.filamentStrong}"/>` +
    `<text x="830" y="523" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="${c.bone}">OK</text>`;
  return toUri(inner);
}

export const SCREEN_SIZE = { width: W, height: H };
