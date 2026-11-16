import type { ComponentPropsWithRef } from "react";
import { cn } from "../cn";

export type CardPadding = "compact" | "default" | "feature";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  /** compact 20px, default 24px, feature 32px. */
  padding?: CardPadding;
  /** Adds hover border/surface change for clickable cards. */
  interactive?: boolean;
  /** Optional uppercase mono kicker shown above content. */
  kicker?: string;
}

/** Flat bordered surface. No shadows. */
export function Card({ padding = "default", interactive = false, kicker, className, children, ...props }: CardProps) {
  return (
    <div className={cn("ds-card", padding !== "default" && `ds-card--${padding}`, interactive && "ds-card--interactive", className)} {...props}>
      {kicker && <div className="ds-card__kicker">{kicker}</div>}
      {children}
    </div>
  );
}

export type MetricTrend = "up" | "down" | "flat";

export interface MetricProps extends ComponentPropsWithRef<"div"> {
  label: string;
  value: string;
  /** Signed delta, e.g. "+12.4%". */
  delta?: string;
  trend?: MetricTrend;
}

/** KPI card: kicker → mono value → delta. */
export function Metric({ label, value, delta, trend = "flat", className, ...props }: MetricProps) {
  return (
    <Card kicker={label} className={className} {...props}>
      <div className="ds-metric__value" style={{ marginTop: 0 }}>{value}</div>
      {delta && <div className={cn("ds-metric__delta", trend !== "flat" && `ds-metric__delta--${trend}`)}>{delta}</div>}
    </Card>
  );
}
