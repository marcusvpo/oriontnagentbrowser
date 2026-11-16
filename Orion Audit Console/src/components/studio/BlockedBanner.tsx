import { Alert } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import type { ReviewTagCode, RoutineAuditState } from "@/types/api";

export function BlockedBanner({
  bloqueio,
  statusAuditoria,
  reviewTags,
}: {
  bloqueio: { tipo: string; motivo: string; roteiroManual: string[] };
  statusAuditoria?: RoutineAuditState | string;
  reviewTags?: ReadonlyArray<ReviewTagCode | string>;
}) {
  const hasBadges = (reviewTags && reviewTags.length > 0) || !!statusAuditoria;
  return (
    <Alert tone="error" title={`CAUTION · ${bloqueio.tipo}`}>
      <div className="stack-3" style={{ marginTop: "var(--space-2)" }}>
        {hasBadges && statusAuditoria && (
          <AuditStatusBadge status={statusAuditoria} reviewTags={reviewTags} />
        )}
        <p className="t-body-s" style={{ margin: 0 }}>{bloqueio.motivo}</p>
        <span className="t-overline-xs">Roteiro técnico para execução manual</span>
        <ol className="ol-steps t-body-s">{bloqueio.roteiroManual.map((r, i) => <li key={i}>{r}</li>)}</ol>
      </div>
    </Alert>
  );
}
