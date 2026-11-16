import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AUDIT_STATUS, normalizeAudit } from "@/lib/status";
import type { RoutineAuditState } from "@/types/api";

export function AuditStatusBadge({ status, divergencias }: { status: RoutineAuditState | string; divergencias?: number }) {
  const meta = AUDIT_STATUS[normalizeAudit(status)];
  const Icon = meta.icon;
  const tip = normalizeAudit(status) === "validado_com_ajustes" && divergencias !== undefined
    ? `${divergencias} divergência(s) auto-curada(s)` : meta.description;
  return (
    <Tooltip content={tip}>
      <Badge status={meta.tone} hideDot tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{meta.label}</Badge>
    </Tooltip>
  );
}
