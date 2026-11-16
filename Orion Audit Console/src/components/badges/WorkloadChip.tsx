import { Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { WORKLOAD } from "@/lib/status";
import type { WorkloadType } from "@/types/audit";

export function WorkloadChip({ type }: { type: WorkloadType }) {
  const meta = WORKLOAD[type];
  const Icon = meta.icon;
  return (
    <Tooltip content={meta.description}>
      <span className="chip" tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{meta.label}</span>
    </Tooltip>
  );
}
