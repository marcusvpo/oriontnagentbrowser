import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { CAMADA_LABEL } from "@/lib/status";

export function DivergenceLayers({ data }: { data: Record<string, number> }) {
  const max = Math.max(...Object.values(data), 1);
  return (
    <Card kicker="Divergências por camada">
      <div className="stack-4">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="stack-2">
            <div className="row-between"><span className="t-mono">{k}</span><span className="t-mono muted">{v}</span></div>
            <div className="stackbar"><span className="seg-adj" style={{ width: `${(v / max) * 100}%` }} /></div>
            <span className="t-body-s dim">{CAMADA_LABEL[k]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
