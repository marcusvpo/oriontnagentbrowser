import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../cn";

export interface SwitchProps extends Omit<ComponentPropsWithRef<"button">, "onChange"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** 36×20 toggle. Give it `aria-label` or wrap with a visible label. */
export function Switch({ checked, onCheckedChange, className, onClick, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn("ds-switch", className)}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onCheckedChange?.(!checked); }}
      {...props}
    >
      <span className="ds-switch__thumb" />
    </button>
  );
}

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  /** Visible label text. */
  children?: ReactNode;
}

/** 16px checkbox with label. */
export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return <label className={cn("ds-check", className)}><input type="checkbox" {...props} />{children}</label>;
}

export interface RadioProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  children?: ReactNode;
}

/** 16px radio with label. Share a `name` across a group. */
export function Radio({ children, className, ...props }: RadioProps) {
  return <label className={cn("ds-check", className)}><input type="radio" {...props} />{children}</label>;
}
