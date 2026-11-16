import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { RotinasSearch } from "@/lib/search";

export function KpiCard({ label, value, delta, trend, search, className, footer }: { label: string; value: string; delta?: string; trend?: "up" | "down" | "flat"; search: RotinasSearch; className?: string; footer?: ReactNode }) {
  return (
    <Link to="/rotinas" search={search} className={`kpi-link ${className ?? ""}`} aria-label={`${label}: ${value}. Abrir no Explorador`}>
      <Card interactive padding="compact">
        <div className="kpi-content">
          <div className="row-between"><span className="t-overline">{label}</span><ArrowUpRight size={16} strokeWidth={1.5} className="muted" aria-hidden /></div>
          <span className={className === "kpi-hero" ? "t-display-xl kpi-value" : "t-mono-metric kpi-value"}>{value}</span>
          {footer}
          {delta && <span className={`t-body-s ${trend === "down" ? "warn" : "muted"}`}>{delta}</span>}
        </div>
      </Card>
    </Link>
  );
}
