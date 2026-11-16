import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { RUNNER_STATUS } from "@/lib/status";
import type { RunnerJobInfo } from "@/types/api";

export function RunnerBadge({ runner }: { runner: RunnerJobInfo }) {
  if (runner.estado === "idle") return null;
  const meta = RUNNER_STATUS[runner.estado];
  const Icon = meta.icon;
  const label = runner.estado === "na_fila" && runner.posicaoFila ? `${meta.label} · #${runner.posicaoFila}` : meta.label;
  return (
    <Tooltip content={runner.erro ?? `${meta.description}${runner.lane ? ` Lane ${runner.lane}.` : ""}`}>
      <Badge status={meta.tone} hideDot tabIndex={0}>
        <Icon size={12} strokeWidth={1.5} aria-hidden className={runner.estado === "em_execucao" ? "ds-spin" : undefined} />{label}
      </Badge>
    </Tooltip>
  );
}
