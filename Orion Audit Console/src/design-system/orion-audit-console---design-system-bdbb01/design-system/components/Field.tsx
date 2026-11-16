import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "../cn";

export interface FieldProps {
  /** Uppercase mono label above the control. */
  label: string;
  /** Helper text below the control. */
  hint?: string;
  /** Error message; marks the control invalid and shows an icon. */
  error?: string;
  className?: string;
  /** Render prop receiving the ids/aria attributes to spread onto the control. */
  children: (control: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode;
}

/** Label + control + hint/error wrapper. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div className={cn("ds-field", className)}>
      <label htmlFor={id} className="ds-field__label">{label}</label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": hint || error ? descId : undefined })}
      {error ? (
        <p id={descId} className="ds-field__error"><AlertCircle size={14} strokeWidth={1.5} aria-hidden />{error}</p>
      ) : hint ? (
        <p id={descId} className="ds-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

export type InputFont = "body" | "mono";

export interface InputProps extends ComponentPropsWithRef<"input"> {
  /** `mono` for technical values (tokens, IDs, endpoints). Default `body`. */
  font?: InputFont;
}

/** 36px single-line text input. */
export function Input({ font = "body", className, ...props }: InputProps) {
  return <input className={cn("ds-input", font === "mono" && "ds-input--mono", className)} {...props} />;
}

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  font?: InputFont;
}

/** Multi-line input, min 96px, vertical resize. */
export function Textarea({ font = "body", className, ...props }: TextareaProps) {
  return <textarea className={cn("ds-input", font === "mono" && "ds-input--mono", className)} {...props} />;
}

export interface SelectProps extends ComponentPropsWithRef<"select"> {
  font?: InputFont;
}

/** Native select styled as an input with a chevron. */
export function Select({ font = "body", className, children, ...props }: SelectProps) {
  return (
    <div className="ds-select">
      <select className={cn("ds-input", font === "mono" && "ds-input--mono", className)} {...props}>{children}</select>
      <ChevronDown size={16} strokeWidth={1.5} aria-hidden />
    </div>
  );
}
