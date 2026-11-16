import type { ComponentPropsWithRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  /** Visual style. One `primary` per screen. Default `secondary`. */
  variant?: ButtonVariant;
  /** Height: sm 28px, md 32px, lg 40px. Default `md`. */
  size?: ButtonSize;
  /** Square icon-only button. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

/** Uppercase mono action button. */
export function Button({ variant = "secondary", size = "md", iconOnly = false, loading = false, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("ds-btn", `ds-btn--${variant}`, size !== "md" && `ds-btn--${size}`, iconOnly && "ds-btn--icon", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={14} strokeWidth={1.5} className="ds-spin" aria-hidden />}
      {children}
    </button>
  );
}
