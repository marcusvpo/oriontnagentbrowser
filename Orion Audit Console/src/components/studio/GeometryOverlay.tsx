import type { StepView } from "@/types/api";

/** Sobreposição geométrica no tamanho natural da imagem. Nunca desenha em passo bloqueado ou sem layoutResult. */
export function GeometryOverlay({ step }: { step: StepView }) {
  const l = step.layoutResult;
  if (!l || step.status === "blocked" || !step.media) return null;
  const g = step.domGeometry;
  const { width, height } = step.media;
  return (
    <svg className="viewer-overlay" viewBox={`0 0 ${width} ${height}`} aria-label="Sobreposição geométrica">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-ash)" strokeWidth="2" strokeOpacity="0.35" />
        </pattern>
      </defs>
      {g?.lateralNavBoxes?.map((b, i) => <rect key={`n${i}`} x={b.x} y={b.y} width={b.width} height={b.height} fill="url(#hatch)" stroke="var(--color-ash-dim)" />)}
      {g?.groupMembers?.map((m, i) => <rect key={`g${i}`} x={m.cssBox.x} y={m.cssBox.y} width={m.cssBox.width} height={m.cssBox.height} fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeDasharray="2 4" />)}
      <rect x={l.targetBox.x} y={l.targetBox.y} width={l.targetBox.width} height={l.targetBox.height} fill="none" stroke="var(--color-success)" strokeWidth="2" />
      <rect x={l.badgeBox.x} y={l.badgeBox.y} width={l.badgeBox.width} height={l.badgeBox.height} fill="none" stroke="var(--color-bone)" strokeWidth="2" strokeDasharray="6 4" />
      {l.labelBox && <rect x={l.labelBox.x} y={l.labelBox.y} width={l.labelBox.width} height={l.labelBox.height} fill="none" stroke="var(--color-bone)" strokeWidth="2" strokeDasharray="6 4" />}
    </svg>
  );
}
