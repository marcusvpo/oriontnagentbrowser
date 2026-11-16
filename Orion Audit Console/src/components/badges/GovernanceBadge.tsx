import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { GOV_STATUS } from "@/lib/status";
import type { GovernanceStatus } from "@/types/api";

export function GovernanceBadge({ status }: { status: GovernanceStatus }) {
  const meta = GOV_STATUS[status];
  const Icon = meta.icon;
  return (
    <Tooltip content={meta.description}>
      <Badge status={meta.tone} hideDot tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{meta.label}</Badge>
    </Tooltip>
  );
}
