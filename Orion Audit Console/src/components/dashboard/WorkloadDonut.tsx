import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { chartTooltip } from "./chartTheme";

export function WorkloadDonut({ readOnly, mutation }: { readOnly: number; mutation: number }) {
  const data = [{ name: "READ_ONLY", value: readOnly, fill: "var(--color-ash)" }, { name: "MUTATION", value: mutation, fill: "var(--color-crimson)" }];
  const total = readOnly + mutation;
  return (
    <Card kicker="Distribuição por carga">
      <div className="chart-box">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" stroke="var(--color-graphite)" strokeWidth={2} isAnimationActive={false}>
              {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
            </Pie>
            <RTooltip {...chartTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        {data.map((d) => (
          <span key={d.name} className="legend-item"><span className="legend-swatch" style={{ background: d.fill }} />{d.name} · {d.value} ({Math.round((d.value / total) * 100)}%)</span>
        ))}
      </div>
    </Card>
  );
}
