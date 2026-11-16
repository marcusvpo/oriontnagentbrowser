import { Bar, BarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { Modulo } from "@/types/api";
import { axisTick, chartTooltip } from "./chartTheme";

export function ModuleBarChart({ data }: { data: Array<{ modulo: Modulo; total: number; auditadas: number }> }) {
  const navigate = useNavigate();
  return (
    <Card kicker="Distribuição por módulo">
      <div className="chart-box">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            onClick={(e) => { const m = e?.activeLabel; if (m) navigate({ to: "/rotinas", search: { modulo: String(m) } }); }}>
            <XAxis dataKey="modulo" tick={axisTick} axisLine={{ stroke: "var(--color-filament)" }} tickLine={false} interval={0} angle={-30} textAnchor="end" height={48} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <RTooltip {...chartTooltip} />
            <Bar dataKey="total" name="Total" fill="var(--color-filament-strong)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="auditadas" name="Auditadas" fill="var(--color-crimson)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
