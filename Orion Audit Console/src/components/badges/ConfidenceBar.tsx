import { AlertTriangle } from "lucide-react";
import { Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { confidenceTone } from "@/lib/status";

export function ConfidenceBar({ value, showWarning = true }: { value: number; showWarning?: boolean }) {
  const tone = confidenceTone(value);
  return (
    <span className="row">
      <Tooltip content={`Confiança da auto-cura: ${(value * 100).toFixed(0)}% (≥85% alta · 70–85% média · <70% baixa)`}>
        <span className="conf" tabIndex={0} role="meter" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Confiança">
          <span className="conf-track"><span className="conf-fill" data-tone={tone} style={{ width: `${value * 100}%` }} /></span>
          <span className="t-mono">{value.toFixed(2)}</span>
        </span>
      </Tooltip>
      {showWarning && tone === "failed" && <span className="icon-inline err t-body-s"><AlertTriangle size={12} strokeWidth={1.5} aria-hidden />baixa confiança</span>}
    </span>
  );
}
