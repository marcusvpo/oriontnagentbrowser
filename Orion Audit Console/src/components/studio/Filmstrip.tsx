import { ExternalLink, ImageOff, OctagonAlert, Wand2 } from "lucide-react";
import { Badge } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { StepView } from "@/types/api";

export function Filmstrip({ steps, active, onSelect }: { steps: StepView[]; active: number; onSelect: (n: number) => void }) {
  return (
    <div className="filmstrip" role="tablist" aria-label="Passos">
      {steps.map((s) => {
        const isExternal = s.stepScope === "external_portal";
        return (
          <button
            key={s.stepNumber}
            className="film"
            aria-current={s.stepNumber === active}
            aria-label={isExternal ? `Passo ${s.stepNumber} · Etapa externa${s.portalExterno ? ` (${s.portalExterno})` : ""}` : `Passo ${s.stepNumber}`}
            onClick={() => onSelect(s.stepNumber)}
          >
            {s.media ? (
              <img src={s.media.webpUrl ?? s.media.pngUrl} alt="" />
            ) : isExternal ? (
              <span className="film-external" title={s.portalExterno ? `Etapa externa · ${s.portalExterno}` : "Etapa externa fora do Orion TN"}>
                <ExternalLink size={16} strokeWidth={1.5} aria-hidden />
              </span>
            ) : (
              <span className="film-empty"><ImageOff size={16} strokeWidth={1.5} /></span>
            )}
            <Badge className="film-num" hideDot>{s.stepNumber}</Badge>
            {isExternal ? (
              <Badge className="film-flag film-flag--external" hideDot>EXT</Badge>
            ) : s.status === "blocked" ? (
              <Badge className="film-flag" status="failed" hideDot><OctagonAlert size={10} strokeWidth={1.5} aria-label="bloqueado" /></Badge>
            ) : s.divergence ? (
              <Badge className="film-flag" status="warning" hideDot><Wand2 size={10} strokeWidth={1.5} aria-label="divergência" /></Badge>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
