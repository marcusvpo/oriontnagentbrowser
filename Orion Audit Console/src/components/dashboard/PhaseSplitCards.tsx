import { Link } from "@tanstack/react-router";
import { Badge, Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { phaseSplit } from "@/lib/attDiagnosis";
import type { PhaseStats } from "@/types/api";

/** Contadores SEPARADOS da Fase 2 e da Fase 3 (ADR-029), cada um filtrando o Explorador pela fase e pelo status. */
export function PhaseSplitCards({ phases }: { phases: PhaseStats[] }) {
  const split = phaseSplit(phases);
  if (split.length === 0) return null;
  const cells = (fase: number, p: (typeof split)[number]) =>
    [
      { key: "ok", label: "Validadas", n: p.validadas, search: { fase: String(fase), status: "validado_inalterado" } },
      { key: "adj", label: "Auto-curadas", n: p.ajustes, search: { fase: String(fase), status: "validado_com_ajustes" } },
      { key: "att", label: "[ATT]", n: p.att, search: { fase: String(fase), tag: "ATT" } },
      { key: "ccc", label: "[CCC]", n: p.ccc, search: { fase: String(fase), tag: "CCC" } },
      { key: "ddd", label: "[DDD]", n: p.ddd, search: { fase: String(fase), tag: "DDD" } },
      { key: "xrx", label: "[XRX]", n: p.xrx, search: { fase: String(fase), tag: "XRX" } },
      { key: "na", label: "Não auditadas", n: p.naoAuditadas, search: { fase: String(fase), status: "nao_auditada" } },
    ];
  return (
    <div className="cols-2" data-testid="phase-split">
      {split.map((p) => (
        <Card key={p.fase} kicker={`Fase ${p.fase} · ${p.total} rotinas`}>
          <div className="stack-3">
            <span className="t-body-s dim">{p.titulo} — {p.auditadas} auditadas</span>
            <div className="row" aria-label={`Contadores da Fase ${p.fase}`}>
              {cells(p.fase, p).map((c) => (
                <Link key={c.key} to="/rotinas" search={c.search} className="tag-filter-link" aria-label={`Fase ${p.fase}: ${c.label} ${c.n}`}>
                  <Badge status={c.key === "ok" ? "passed" : c.key === "ddd" ? "failed" : c.key === "att" || c.key === "adj" ? "warning" : "neutral"} hideDot>
                    {c.label} {c.n}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
