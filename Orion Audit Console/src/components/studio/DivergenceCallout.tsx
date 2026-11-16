import { ArrowRight } from "lucide-react";
import { Alert } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { SmartLocatorDivergence } from "@/types/audit";
import { ConfidenceBar } from "@/components/badges/ConfidenceBar";
import { CAMADA_LABEL } from "@/lib/status";
import { fmtDate } from "@/lib/format";

export function DivergenceCallout({ d }: { d: SmartLocatorDivergence }) {
  return (
    <Alert tone="accent" title="Divergência detectada">
      <div className="stack-2" style={{ marginTop: "var(--space-2)" }}>
        <div className="row t-body-s"><span className="ui-chip">{d.documentedTarget}</span><ArrowRight size={14} strokeWidth={1.5} aria-label="resolvido como" /><span className="ui-chip">{d.actualElementText}</span></div>
        <dl className="kv">
          <dt>Camada</dt><dd><span className="t-mono">{d.resolutionLayer}</span> <span className="dim">({CAMADA_LABEL[d.resolutionLayer]})</span></dd>
          <dt>Confiança</dt><dd><ConfidenceBar value={d.confidence} /></dd>
          <dt>Motivo</dt><dd>{d.reason}</dd>
          {d.actualRole && <><dt>actualRole</dt><dd className="t-mono">{d.actualRole}</dd></>}
          {d.matchedRef && <><dt>matchedRef</dt><dd className="t-mono">{d.matchedRef}</dd></>}
          <dt>detectedAt</dt><dd className="t-mono">{fmtDate(d.detectedAt)}</dd>
        </dl>
      </div>
    </Alert>
  );
}
