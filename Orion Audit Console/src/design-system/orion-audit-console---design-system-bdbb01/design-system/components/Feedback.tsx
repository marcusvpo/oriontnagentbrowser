import type { ComponentPropsWithRef, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../cn";

export type AlertTone = "accent" | "error" | "success";

export interface AlertProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  /** accent = crimson wash; error = danger outline + icon; success = green. */
  tone?: AlertTone;
  title?: ReactNode;
}

const icons = { accent: Info, error: AlertCircle, success: CheckCircle2 };

/** Inline alert. Error always carries icon + text. */
export function Alert({ tone = "accent", title, className, children, ...props }: AlertProps) {
  const Icon = icons[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("ds-alert", tone !== "accent" && `ds-alert--${tone}`, className)} {...props}>
      <Icon size={16} strokeWidth={1.5} aria-hidden />
      <div>{title && <div className="ds-alert__title">{title}</div>}{children}</div>
    </div>
  );
}

export type ToastProps = ComponentPropsWithRef<"div">;

/** Discreet success toast with green left rule. */
export function Toast({ className, children, ...props }: ToastProps) {
  return (
    <div role="status" className={cn("ds-toast", className)} {...props}>
      <CheckCircle2 size={16} strokeWidth={1.5} color="var(--color-success)" aria-hidden />{children}
    </div>
  );
}

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  icon: ReactNode;
  title: string;
  description: string;
  /** At most one secondary Button. */
  action?: ReactNode;
}

/** Empty state: outline icon, title, one line, optional CTA. */
export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("ds-empty", className)} {...props}>
      {icon}
      <div className="ds-empty__title">{title}</div>
      <div className="ds-empty__text">{description}</div>
      {action}
    </div>
  );
}

export interface SpinnerProps extends ComponentPropsWithRef<"svg"> {
  label?: string;
}

/** Small 16px ash spinner. */
export function Spinner({ label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg role="img" aria-label={label} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--color-ash)" strokeWidth={1.5} className={cn("ds-spin", className)} {...props}>
      <path d="M21 12a9 9 0 1 1-6.2-8.56" strokeLinecap="round" />
    </svg>
  );
}
