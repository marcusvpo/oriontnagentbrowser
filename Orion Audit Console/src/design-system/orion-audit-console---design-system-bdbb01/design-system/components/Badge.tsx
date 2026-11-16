import type { ComponentPropsWithRef } from "react";
import { cn } from "../cn";

export type BadgeStatus = "neutral" | "running" | "passed" | "warning" | "failed";

export interface BadgeProps extends ComponentPropsWithRef<"span"> {
  /** Status tone. Always paired with a dot so color is never the only signal. Default `neutral`. */
  status?: BadgeStatus;
  /** Hide the leading dot (only when an icon child replaces it). */
  hideDot?: boolean;
}

/** Rectangular mono status badge. */
export function Badge({ status = "neutral", hideDot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("ds-badge", status !== "neutral" && `ds-badge--${status}`, className)} {...props}>
      {!hideDot && <span className="ds-badge__dot" aria-hidden />}
      {children}
    </span>
  );
}
