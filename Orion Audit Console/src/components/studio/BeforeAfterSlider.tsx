import { useState } from "react";

export function BeforeAfterSlider({ raw, annotated, width, height }: { raw: string; annotated: string; width: number; height: number }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba" style={{ width, height }}>
      <img src={raw} width={width} height={height} alt="Print bruta" draggable={false} />
      <div className="ba-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={annotated} width={width} height={height} alt="Print anotada" draggable={false} />
      </div>
      <span className="ba-handle" style={{ left: `${pos}%` }} />
      <input className="ba-range" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Comparar bruto × anotado" onPointerDown={(e) => e.stopPropagation()} />
    </div>
  );
}
