import { ImageOff, OctagonAlert, Wand2 } from "lucide-react";
import { Badge } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { StepView } from "@/types/api";

export function Filmstrip({ steps, active, onSelect }: { steps: StepView[]; active: number; onSelect: (n: number) => void }) {
  return (
    <div className="filmstrip" role="tablist" aria-label="Passos">
      {steps.map((s) => (
        <button key={s.stepNumber} className="film" aria-current={s.stepNumber === active} aria-label={`Passo ${s.stepNumber}`} onClick={() => onSelect(s.stepNumber)}>
          {s.media ? <img src={s.media.webpUrl ?? s.media.pngUrl} alt="" /> : <span className="film-empty"><ImageOff size={16} strokeWidth={1.5} /></span>}
          <Badge className="film-num" hideDot>{s.stepNumber}</Badge>
          {s.status === "blocked" ? <Badge className="film-flag" status="failed" hideDot><OctagonAlert size={10} strokeWidth={1.5} aria-label="bloqueado" /></Badge>
            : s.divergence ? <Badge className="film-flag" status="warning" hideDot><Wand2 size={10} strokeWidth={1.5} aria-label="divergência" /></Badge> : null}
        </button>
      ))}
    </div>
  );
}
